// netlify/functions/stripe-webhook.js
// ----------------------------------------------------------------------------
// Stripe calls this endpoint directly from its own servers the instant a
// Checkout Session finishes — payment succeeded. This is the missing link
// between "Stripe took the donor's money" and "a row shows up in the
// Donations tab": nothing else in this project ever calls the Google Apps
// Script web app for donations, so without this function the sheet update
// simply never happens, no matter how many test donations you make.
//
// Unlike the success_url redirect (which only fires if the donor's browser
// makes it back to your site), this runs server-to-server, so it still
// records the donation even if they close the tab right after paying.
//
// ---- One-time setup (after this file is deployed) ----
//   1. Stripe Dashboard → Developers → Webhooks → Add an endpoint.
//   2. Endpoint URL: https://<your-site>/.netlify/functions/stripe-webhook
//   3. Events to send: checkout.session.completed
//   4. After creating it, Stripe shows a "Signing secret" starting with
//      whsec_. Copy it into a Netlify environment variable named
//      STRIPE_WEBHOOK_SECRET (Site settings → Environment variables).
//
// Required environment variables:
//   STRIPE_SECRET_KEY      (same one create-donation-session.js uses)
//   STRIPE_WEBHOOK_SECRET  (from step 4 above)
//   SHEETS_WEB_APP_URL     (the Google Apps Script Web App URL — see the
//                           header comment in google-apps-script.js)
// ----------------------------------------------------------------------------

const Stripe = require("stripe");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET env var.");
    return { statusCode: 500, body: "Server is not configured." };
  }
  if (!process.env.SHEETS_WEB_APP_URL) {
    console.error("Missing SHEETS_WEB_APP_URL env var.");
    return { statusCode: 500, body: "Server is not configured." };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  // Stripe signs the exact raw bytes it sent, so the signature must be
  // checked against the untouched body — re-stringifying a parsed copy
  // would change whitespace/key order and make verification fail.
  let stripeEvent;
  try {
    const signature = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];
    const rawBody = event.isBase64Encoded ? Buffer.from(event.body, "base64") : event.body;
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return { statusCode: 400, body: "Invalid signature." };
  }

  // Only donations are handled here. (Registration payments are recorded
  // by submit-registration.js and aren't touched by this function — if
  // you later want registration payment status updated by webhook too,
  // that should dispatch on its own metadata, separately from this.)
  if (stripeEvent.type !== "checkout.session.completed") {
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  }

  const session = stripeEvent.data.object;
  if (!session.metadata || session.metadata.type !== "donation") {
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  }

  try {
    const donorEmail = (session.customer_details && session.customer_details.email) || session.customer_email || "";

    const res = await fetch(process.env.SHEETS_WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "newDonation",
        donorEmail,
        amount: ((session.amount_total || 0) / 100).toFixed(2),
        recurring: session.metadata.recurring === "true",
        stripeSessionId: session.id
      })
    });
    const result = await res.json().catch(() => ({}));
    if (!result.ok) {
      throw new Error(result.error || "Google Sheets web app returned an error.");
    }
  } catch (err) {
    console.error("Failed to report donation to Google Sheets:", err);
    // A 500 tells Stripe to automatically retry delivering this webhook
    // later, instead of silently losing the donation record.
    return { statusCode: 500, body: "Failed to record donation." };
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};