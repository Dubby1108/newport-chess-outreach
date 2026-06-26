/**
 * Newport Chess Outreach — submit-scholarship
 * ----------------------------------------------------------------------------
 * Receives a scholarship application from scholarship.html and forwards it
 * to the same Google Sheet used for registrations and donations (see
 * google-apps-script.js and SETUP.md, Part 1). No Stripe involved here —
 * applying for a scholarship doesn't take a payment, so there's no
 * checkout session to create.
 *
 * Requires the SHEETS_WEB_APP_URL environment variable already configured
 * in Netlify for registrations/donations — no new environment variables
 * needed.
 * ----------------------------------------------------------------------------
 */

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: "Method not allowed" }) };
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Invalid request body" }) };
  }

  // Simple honeypot — real applicants never fill this field in. Pretend to
  // succeed so bots don't learn anything from the response.
  if (data.companyWebsite) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  const sheetsUrl = process.env.SHEETS_WEB_APP_URL;
  if (!sheetsUrl) {
    console.error("submit-scholarship: SHEETS_WEB_APP_URL is not set");
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: "The site isn't configured to receive applications yet. Please contact us directly."
      })
    };
  }

  // Explicitly whitelist/shape the fields we forward, so the Sheet's
  // column order stays predictable regardless of what the browser sends.
  const payload = {
    action: "newScholarshipApplication",
    applicantRelationship: data.applicantRelationship || "",
    applicantFirstName: data.applicantFirstName || "",
    applicantLastName: data.applicantLastName || "",
    applicantEmail: data.applicantEmail || "",
    applicantPhone: data.applicantPhone || "",
    program: data.program || "",
    participantFirstName: data.participantFirstName || "",
    participantLastName: data.participantLastName || "",
    participantAgeGrade: data.participantAgeGrade || "",
    participantSchool: data.participantSchool || "",
    householdSize: data.householdSize || "",
    householdIncome: data.householdIncome || "",
    publicAssistance: joinIfArray(data.publicAssistance),
    scholarshipAmountRequested: data.scholarshipAmountRequested || "",
    scholarshipAmountOther: data.scholarshipAmountOther || "",
    financialNeedExplanation: data.financialNeedExplanation || "",
    raceEthnicity: joinIfArray(data.raceEthnicity),
    raceEthnicityOther: data.raceEthnicityOther || "",
    homeLanguage: data.homeLanguage || "",
    immigrationStatus: data.immigrationStatus || "",
    priorScholarship: data.priorScholarship || "",
    howHeard: data.howHeard || "",
    additionalComments: data.additionalComments || ""
  };

  try {
    const res = await fetch(sheetsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!result.ok) throw new Error(result.error || "The sheet rejected the submission.");

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("submit-scholarship error:", err);
    return {
      statusCode: 502,
      body: JSON.stringify({ ok: false, error: "We couldn't save your application. Please try again shortly." })
    };
  }
};

function joinIfArray(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
}
