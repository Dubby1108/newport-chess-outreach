# Setup Guide — Newport Chess Outreach Website

This guide walks you through everything needed to make payments, registrations, contact forms, and scholarship applications fully functional. No coding required — it's mostly copy-paste and clicking through account setups.

**What you're setting up:**

- **GitHub** — stores your website files so Netlify can deploy them
- **Netlify** — hosts the website and runs the payment functions
- **Stripe** — handles all card payments (registrations and donations)
- **Google Sheets** — saves every registration, donation, and scholarship application as a spreadsheet row
- **Formspree** — delivers contact form messages to your inbox

Budget about 60–75 minutes the first time through. Parts 1–5 must be done in order. Parts 6 and 7 are straightforward once those are done.

---

## Part 1 — GitHub (putting your files online)

Netlify deploys your site from GitHub, so this is the starting point. You don't need to know anything about coding or "version control" — GitHub Desktop handles everything with a regular app interface.

**1. Install GitHub Desktop**

Go to [desktop.github.com](https://desktop.github.com) and download the app for your Mac or PC. Install it like any normal application.

**2. Create a free GitHub account**

Go to [github.com](https://github.com) and sign up. Then open GitHub Desktop — it will prompt you to sign into your GitHub account on first launch.

**3. Create a repository from your project folder**

A "repository" is just GitHub's word for a folder of files it's tracking.

1. In GitHub Desktop, click **File → New Repository**
2. Name it `newport-chess-outreach` (or anything you like — no spaces)
3. For "Local Path," click **Choose** and select the folder on your computer that contains `index.html`, `styles.css`, and all the other site files
4. Leave everything else as default and click **Create Repository**

**4. Commit and publish**

1. You'll see all your project files listed with checkboxes — they should all be checked, which is correct
2. In the bottom-left "Summary" box, type `Initial commit`
3. Click **Commit to main**
4. Click **Publish repository** (the blue button in the top-right)
5. Make sure "Keep this code private" is **unchecked** — Netlify needs to read your files
6. Click **Publish Repository**

Your files are now on GitHub. You won't need to touch GitHub Desktop again unless you make changes to the site later.

> **Heads up:** If your project folder contains a `node_modules` subfolder, delete it before creating the repository. It contains thousands of files that don't need to be on GitHub — Netlify recreates it automatically on every deploy.

---

## Part 2 — Netlify (hosting the site)

Netlify hosts your website and runs the behind-the-scenes payment functions that keep your Stripe secret key out of the browser.

**1. Create a free Netlify account**

Go to [netlify.com](https://netlify.com) and sign up. When asked, sign in with GitHub — this makes connecting your repository much easier.

**2. Import your repository**

1. In Netlify, click **Add new site → Import an existing project**
2. Click **GitHub** and authorize Netlify to access your repositories
3. Find and select `newport-chess-outreach` from the list
4. On the build settings screen:
   - **Build command:** leave this blank
   - **Publish directory:** type a single dot — `.`
   - Netlify will read your `netlify.toml` file automatically
5. Click **Deploy site**

Netlify will give your site a random URL like `https://charming-panda-123.netlify.app`. You can rename it under **Site configuration → Change site name**.

**3. Add environment variables**

These are private values Netlify injects into the payment functions — they never appear in your public website files.

Go to **Site configuration → Environment variables** and add the following. You'll fill in the values in Parts 3 and 4 — for now you can add the keys and come back to paste in the values.

| Key | Value |
|---|---|
| `STRIPE_SECRET_KEY` | your Stripe secret key (from Part 3) |
| `SHEETS_WEB_APP_URL` | your Google Apps Script URL (from Part 4) |
| `STRIPE_WEBHOOK_SECRET` | your Stripe webhook signing secret (from Part 5) |
| `SITE_URL` | your Netlify URL, e.g. `https://charming-panda-123.netlify.app` — update this later when you connect a custom domain |

After adding all values, trigger a fresh deploy: **Deploys → Trigger deploy → Deploy site**.

---

## Part 3 — Stripe (payments)

Stripe handles all card payments — event registrations and donations. Keep it in Test mode until everything is verified working.

**1. Create a Stripe account**

Go to [stripe.com](https://stripe.com) and sign up. Stay in **Test mode** (the toggle is in the top-right of the dashboard).

**2. Copy your secret key**

Go to **Developers → API keys**. Copy the **Secret key** — it starts with `sk_test_...` in test mode.

Paste this into the `STRIPE_SECRET_KEY` environment variable in Netlify (from Part 2, step 3).

> Keep this key private. Never paste it directly into any HTML, JS, or CSS file — only into Netlify's environment variables.

You'll come back to Stripe in Part 5 to set up the webhook after your site is live.

---

## Part 4 — Google Sheets (storing registrations and donations)

Every registration, donation, and scholarship application gets saved as a row in a Google Sheet you control. Three tabs — Registrations, Donations, and Scholarships — are created automatically the first time someone submits each form.

**1. Create the spreadsheet**

Go to [sheets.new](https://sheets.new) to open a new Google Sheet. Name it something like **Newport Chess Outreach — Registrations & Donations**.

**2. Open Apps Script**

In the Sheet, click **Extensions → Apps Script**. This opens a code editor in a new tab.

**3. Paste in the script**

Select all the placeholder code in the editor and delete it. Then open the file `google-apps-script.js` from your project folder (open it in any text editor like Notepad or TextEdit), select all the text, copy it, and paste it into the Apps Script editor.

Click the **Save** button (the floppy disk icon, or Ctrl+S / Cmd+S).

**4. Deploy as a Web App**

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Google will ask you to authorize the script. Click through the prompts — you may see a warning that says "Google hasn't verified this app." This is normal for your own private scripts. Click **Advanced → Go to [project name] (unsafe)** to proceed.
6. Copy the **Web app URL** it gives you — it looks like: `https://script.google.com/macros/s/AKfycb.../exec`

Paste this URL into the `SHEETS_WEB_APP_URL` environment variable in Netlify.

> **Updating the script later:** If you ever need to change `google-apps-script.js` and re-deploy it, go back to Extensions → Apps Script, paste in the updated code, then click **Deploy → Manage deployments**, click the pencil icon on your existing deployment, change "Version" to **New version**, and click **Deploy**. Just saving the file is not enough — you must create a new version for the live URL to pick up the changes.

---

## Part 5 — Stripe Webhook (marking payments as confirmed)

Without a webhook, Stripe doesn't automatically notify your Google Sheet when a payment succeeds — it relies on the browser redirect, which can fail if someone closes the tab early. The webhook fixes this by having Stripe call your site directly the moment payment is confirmed.

**Your site must be live on Netlify before doing this step.**

1. In the Stripe Dashboard, go to **Developers → Webhooks → Add endpoint**
2. For the Endpoint URL, enter: `https://YOUR-NETLIFY-SITE/.netlify/functions/stripe-webhook`
   (replace `YOUR-NETLIFY-SITE` with your actual Netlify URL, e.g. `charming-panda-123.netlify.app`)
3. Under "Select events to listen to," find and select **checkout.session.completed**
4. Click **Add endpoint**
5. On the next screen, click **Reveal** under "Signing secret" and copy the value — it starts with `whsec_...`

Paste this into the `STRIPE_WEBHOOK_SECRET` environment variable in Netlify, then trigger a fresh deploy.

---

## Part 6 — Formspree (contact form)

Formspree delivers contact form submissions straight to your email inbox. This one requires a small edit to `contact.html`.

**1. Create a free Formspree account**

Go to [formspree.io](https://formspree.io), sign up, and create a new form. Connect the email address where you want to receive contact messages. Formspree will give you a form endpoint that looks like `https://formspree.io/f/abc12345`.

**2. Update contact.html**

Open `contact.html` in any text editor. Find this line near the top of the contact form section:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

Replace `YOUR_FORM_ID` with just the ID portion from your Formspree endpoint — for example, if your endpoint is `https://formspree.io/f/abc12345`, replace `YOUR_FORM_ID` with `abc12345`.

Save the file, then in GitHub Desktop commit the change and push it to GitHub — Netlify will automatically redeploy.

No environment variables are needed for Formspree. The form submits directly from the browser.

---

## Part 7 — Test everything before going public

With Stripe still in Test mode, run through each flow on your live Netlify site:

**Paid registration:**
1. Go to an event page and click Register
2. Fill out the form and proceed to payment
3. On the Stripe checkout page, use test card **4242 4242 4242 4242**, any future expiry date (e.g. 12/30), any 3-digit CVC, any ZIP
4. Confirm: you land on the success page, a new row appears in the **Registrations** tab of your Google Sheet, and its Payment Status column updates to **Paid** within a few seconds

**Free registration:**
Register for the July tournament (cost: $0). Confirm you land on the success page and a row appears in the Registrations tab — no Stripe checkout should appear.

**Donation:**
Go to the donate section on the Contact page, choose an amount, and complete checkout with the test card. Confirm a row appears in the **Donations** tab.

**Scholarship application:**
Submit a test application on the Scholarships page. Confirm a row appears in the **Scholarships** tab with "decisionStatus" set to **Pending**.

**Contact form:**
Submit the contact form. Confirm the message arrives in your inbox.

---

## Part 8 — Go live

Once everything tests cleanly:

1. In Stripe, switch from Test mode to **Live mode** using the toggle in the top-right of the dashboard
2. Go to **Developers → API keys** and copy the live Secret key (starts with `sk_live_...`)
3. Update the `STRIPE_SECRET_KEY` environment variable in Netlify with the live key
4. Repeat Part 5 to create a **new webhook in live mode** — test and live webhooks are separate in Stripe
5. Connect your custom domain in Netlify under **Domain management → Add a domain**, and update `SITE_URL` to match it exactly (e.g. `https://newportchessoutreach.org`)
6. Trigger a fresh deploy
7. Do one real small transaction (a $1 donation or a free registration) to confirm everything works end-to-end before promoting the site publicly

---

## Notes

**Confirmation emails to registrants:** Stripe automatically sends a payment receipt if receipt emails are enabled in your Stripe account — go to **Settings → Customer emails** to turn this on. The site doesn't send a separate custom confirmation email beyond Stripe's receipt. If you'd like a custom email (with event details, what to bring, etc.) sent automatically, that requires adding a transactional email service like Resend or SendGrid.

**Refunds:** Handled directly in the Stripe Dashboard under **Payments**. No changes needed on the website.

**Editing a submitted registration:** Open the Google Sheet and edit the row directly.

**Making changes to the website later:** Edit the files on your computer, then open GitHub Desktop, write a short commit summary describing what you changed, click **Commit to main**, and click **Push origin**. Netlify detects the push and redeploys automatically within about a minute.
