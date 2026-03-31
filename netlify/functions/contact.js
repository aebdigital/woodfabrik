const REQUIRED_ENV_VARS = [
  "CONTACT_FORM_RECIPIENT",
  "SMTP2GO_API_KEY",
  "SMTP2GO_SENDER",
];

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function parseRecipients(value) {
  return value
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseBody(event) {
  const contentType =
    event.headers["content-type"] || event.headers["Content-Type"] || "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(event.body || "");
    return Object.fromEntries(params.entries());
  }

  return JSON.parse(event.body || "{}");
}

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        Allow: "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return json(405, {
      success: false,
      message: "Method not allowed.",
    });
  }

  const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missingEnvVars.length > 0) {
    console.error("Missing contact form environment variables:", missingEnvVars);
    return json(500, {
      success: false,
      message: "Email service is not configured correctly.",
    });
  }

  let payload;

  try {
    payload = parseBody(event);
  } catch (error) {
    console.error("Invalid contact form payload:", error);
    return json(400, {
      success: false,
      message: "Invalid form submission.",
    });
  }

  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const phone = String(payload.phone || "").trim();
  const subject = String(payload.subject || "").trim();
  const message = String(payload.message || "").trim();
  const botField = String(payload["bot-field"] || payload.botField || "").trim();

  if (botField) {
    return json(200, {
      success: true,
      message: "Správa bola úspešne odoslaná. Ďakujeme za kontakt!",
    });
  }

  if (!name || !email || !message) {
    return json(400, {
      success: false,
      message: "Vyplňte všetky povinné polia (meno, email, správa).",
    });
  }

  if (!validateEmail(email)) {
    return json(400, {
      success: false,
      message: "Neplatný email formát.",
    });
  }

  const recipients = parseRecipients(process.env.CONTACT_FORM_RECIPIENT);
  if (recipients.length === 0) {
    console.error("CONTACT_FORM_RECIPIENT does not contain any usable email addresses.");
    return json(500, {
      success: false,
      message: "Email service is not configured correctly.",
    });
  }

  const mailSubject = subject
    ? `Nová správa z Woodfabrik kontaktného formulára - ${subject}`
    : "Nová správa z Woodfabrik kontaktného formulára";

  const textBody = [
    "Nová správa z Woodfabrik kontaktného formulára",
    "",
    `Meno: ${name}`,
    `Email: ${email}`,
    phone ? `Telefón: ${phone}` : null,
    subject ? `Predmet: ${subject}` : null,
    "",
    "Správa:",
    message,
    "",
    "---",
    `Čas odoslania: ${new Date().toISOString()}`,
    "Odoslané cez: woodfabrik.sk",
  ]
    .filter(Boolean)
    .join("\n");

  const htmlBody = `
    <h1>Nová správa z Woodfabrik kontaktného formulára</h1>
    <p><strong>Meno:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${phone ? `<p><strong>Telefón:</strong> ${escapeHtml(phone)}</p>` : ""}
    ${subject ? `<p><strong>Predmet:</strong> ${escapeHtml(subject)}</p>` : ""}
    <p><strong>Správa:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    <hr>
    <p><strong>Čas odoslania:</strong> ${new Date().toISOString()}</p>
    <p><strong>Odoslané cez:</strong> woodfabrik.sk</p>
  `;

  try {
    const response = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Smtp2go-Api-Key": process.env.SMTP2GO_API_KEY,
      },
      body: JSON.stringify({
        sender: process.env.SMTP2GO_SENDER,
        to: recipients,
        subject: mailSubject,
        text_body: textBody,
        html_body: htmlBody,
        reply_to: email,
      }),
    });

    const data = await response.json().catch(() => null);
    const succeeded = data?.data?.succeeded ?? data?.succeeded;

    if (!response.ok || succeeded === 0) {
      console.error("SMTP2GO send failed:", {
        status: response.status,
        data,
      });
      return json(502, {
        success: false,
        message:
          "Nepodarilo sa odoslať správu. Skúste to prosím neskôr alebo nás kontaktujte telefonicky na +421 904 163 666.",
      });
    }

    return json(200, {
      success: true,
      message: "Správa bola úspešne odoslaná. Ďakujeme za kontakt!",
    });
  } catch (error) {
    console.error("SMTP2GO request failed:", error);
    return json(500, {
      success: false,
      message:
        "Nepodarilo sa odoslať správu. Skúste to prosím neskôr alebo nás kontaktujte telefonicky na +421 904 163 666.",
    });
  }
};
