# SMTP2GO Contact Form Setup

This project sends the contact form through a Netlify Function using the SMTP2GO API.

## Files involved

- `netlify/functions/contact.js`
- `components/legacy-runtime.tsx`
- `pages/kontakt.html`
- `netlify.toml`
- `.env.example`

## Required environment variables

Set these in the Netlify site dashboard:

- `CONTACT_FORM_RECIPIENT`
- `SMTP2GO_API_KEY`
- `SMTP2GO_SENDER`

### Variable notes

- `CONTACT_FORM_RECIPIENT`
  Use the inbox that should receive contact form submissions.
  You can also provide multiple addresses as a comma-separated list.

- `SMTP2GO_API_KEY`
  Your SMTP2GO API key.

- `SMTP2GO_SENDER`
  The verified sender address in SMTP2GO that the email should be sent from.

## Netlify setup

The Netlify function lives in `netlify/functions/contact.js`, and Netlify is configured to use that directory in `netlify.toml`.

## Form flow

1. The contact form is rendered on `/kontakt`.
2. The browser submits the form with JavaScript to `/.netlify/functions/contact`.
3. The Netlify Function validates the input.
4. The function calls `https://api.smtp2go.com/v3/email/send`.
5. The frontend shows a success or error message inline.

## Local development

For full function testing locally, run the site with Netlify Dev so `/.netlify/functions/contact` is available.

## Troubleshooting

- If form submission returns a 500 error, check that all three environment variables are set.
- If SMTP2GO rejects the message, verify that `SMTP2GO_SENDER` is an allowed sender in your SMTP2GO account.
- If no email arrives, inspect the Netlify function logs for the `contact` function.
