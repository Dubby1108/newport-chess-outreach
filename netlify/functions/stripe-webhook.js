// netlify/functions/stripe-webhook.js
// ----------------------------------------------------------------------------
// Stripe calls this URL by itself, automatically, the moment a payment
// actually succeeds — it's what flips a registration from "Pending" to
// "Paid" in your Google Sheet, and what logs a completed donation. This is
// more reliable than trusting the browser redirect alone, since a browser
// redirect can be spoofed or interrupted but this server-to-server call
// is verified with a signing secret.
//
// Setup (see SETUP.md):
//   1. Deploy the site once so you have a live URL.
//   2. In Stripe Dashboard → Developers → Webhooks, add an endpoint:
//        https://YOUR-SITE-URL/.netlify/functions/stripe-webhook
//      and select the "checkout.session.completed" event.
//   3. Copy the "Signing secret" Stripe gives you into the
//      STRIPE_WEBHOOK_SECRET environment variable in Netlify, then redeploy.
//
// Required environment variables:
//   STRIPE_SECRET_KEY
//   STRIPE_WEBHOOK_SECRET
//   SHEETS_WEB_APP_URL
// ----------------------------------------------------------------------------

const Stripe = require("stripe");

exports.handler = async (event) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return { statusCode: 500, body: "Webhook is not configured." };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = event.headers["stripe-signature"];
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body, "base64") : event.body;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return { statusCode: 400, body: `Webhook signature verification failed: ${err.message}` };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;

    try {
      if (session.metadata && session.metadata.registrationId) {
        await fetch(process.env.SHEETS_WEB_APP_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "markPaid",
            registrationId: session.metadata.registrationId,
            stripeSessionId: session.id,
            amountPaid: (session.amount_total / 100).toFixed(2)
          })
        });
      } else if (session.metadata && session.metadata.type === "donation") {
        await fetch(process.env.SHEETS_WEB_APP_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "newDonation",
            donorEmail: session.customer_details ? session.customer_details.email : "",
            amount: (session.amount_total / 100).toFixed(2),
            recurring: session.metadata.recurring === "true",
            stripeSessionId: session.id
          })
        });
      }
    } catch (err) {
      // The payment already succeeded either way — we just log this so it's
      // not silently lost. Stripe will retry the webhook if we return non-200.
      console.error("Sheet update failed:", err.message);
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
