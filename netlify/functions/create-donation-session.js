// netlify/functions/create-donation-session.js
// ----------------------------------------------------------------------------
// Called by the donation form on contact.html. Creates a Stripe Checkout
// Session for either a one-time payment or a monthly subscription, using a
// dynamic amount the donor chose on the page — no Stripe Dashboard product
// setup required.
//
// Required environment variables:
//   STRIPE_SECRET_KEY
//   SITE_URL
// ----------------------------------------------------------------------------

const Stripe = require("stripe");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server is not configured (missing STRIPE_SECRET_KEY)." })
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body." }) };
  }

  const amountCents = parseInt(data.amountCents, 10);
  if (!amountCents || amountCents < 100) {
    return { statusCode: 400, body: JSON.stringify({ error: "Minimum donation is $1.00." }) };
  }

  const recurring = !!data.recurring;
  const siteUrl = process.env.SITE_URL || `https://${event.headers.host}`;

  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    const priceData = {
      currency: "usd",
      product_data: {
        name: recurring
          ? "Monthly Donation — Newport Chess Outreach"
          : "Donation — Newport Chess Outreach"
      },
      unit_amount: amountCents
    };
    if (recurring) priceData.recurring = { interval: "month" };

    const session = await stripe.checkout.sessions.create({
      mode: recurring ? "subscription" : "payment",
      payment_method_types: ["card"],
      customer_email: data.donorEmail || undefined,
      line_items: [{ price_data: priceData, quantity: 1 }],
      metadata: { type: "donation", recurring: String(recurring) },
      success_url: `${siteUrl}/donate-success.html`,
      cancel_url: `${siteUrl}/contact.html#donate`
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Stripe error: " + err.message }) };
  }
};
