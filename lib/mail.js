// lib/mail.js
import nodemailer from "nodemailer";

const BANK_NAME = "BK E‑BANKING";
const BANK_SHORT = "BK";

function createTransporter() {
  console.log("SMTP CONFIG =>", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
  });

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}


function formatDateFr(date = new Date()) {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function sendTransferEmail({ to, fullName, transfer }) {
  const transporter = createTransporter();

  const {
    amount,
    iban,
    bic,
    country,
    holder,
    reason,
    reference,
    date,
    newBalance,
  } = transfer;

  const formattedDate = date || formatDateFr();

  const subject = `${BANK_NAME} - Confirmation de virement - ${amount.toFixed(
    2
  )} EUR`;

  const text = `
${BANK_NAME} - Confirmation de virement

Bonjour ${fullName},

Nous vous confirmons l'exécution du virement suivant :

Banque émettrice : ${BANK_NAME}
Montant          : ${amount.toFixed(2)} EUR
Bénéficiaire     : ${holder}
IBAN             : ${iban}
BIC              : ${bic || "-"}
Pays             : ${country}
Motif            : ${reason || "-"}
Référence        : ${reference}
Date d'exécution : ${formattedDate}

Solde après opération : ${newBalance.toFixed(2)} EUR

Si vous n'êtes pas à l'origine de ce virement, contactez immédiatement le service client ${BANK_NAME}.

Ceci est un message automatique, merci de ne pas y répondre.
`.trim();

  const html = `
<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f7;padding:24px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:linear-gradient(135deg,#4f46e5,#06b6d4);padding:16px 24px;color:#fff;">
                <table width="100%">
                  <tr>
                    <td style="font-size:18px;font-weight:600;">
                      ${BANK_NAME}
                    </td>
                    <td align="right" style="font-size:12px;opacity:.9;">
                      Confirmation de virement
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;font-size:14px;color:#111827;">
                <p style="margin:0 0 12px 0;">Bonjour <strong>${fullName}</strong>,</p>
                <p style="margin:0 0 16px 0;">Nous vous confirmons l'exécution du virement suivant :</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;color:#111827;">
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Banque émettrice</td>
                    <td align="right" style="padding:6px 0;">${BANK_NAME}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Montant</td>
                    <td align="right" style="padding:6px 0;font-weight:600;">${amount.toFixed(
                      2
                    )} EUR</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Bénéficiaire</td>
                    <td align="right" style="padding:6px 0;">${holder}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">IBAN</td>
                    <td align="right" style="padding:6px 0;font-family:monospace;">${iban}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">BIC</td>
                    <td align="right" style="padding:6px 0;">${bic || "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Pays</td>
                    <td align="right" style="padding:6px 0;">${country}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Motif</td>
                    <td align="right" style="padding:6px 0;">${
                      reason || "-"
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Référence</td>
                    <td align="right" style="padding:6px 0;font-family:monospace;">${reference}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Date d'exécution</td>
                    <td align="right" style="padding:6px 0;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#6b7280;border-top:1px solid #e5e7eb;">Solde après opération</td>
                    <td align="right" style="padding:10px 0;border-top:1px solid #e5e7eb;font-weight:600;">${newBalance.toFixed(
                      2
                    )} EUR</td>
                  </tr>
                </table>
                <p style="margin:16px 0 0 0;font-size:12px;color:#6b7280;">
                  Si vous n'êtes pas à l'origine de ce virement, contactez immédiatement le service client ${BANK_NAME}.
                </p>
                <p style="margin:8px 0 0 0;font-size:11px;color:#9ca3af;">
                  Ceci est un message automatique, merci de ne pas y répondre.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background-color:#f9fafb;font-size:11px;color:#9ca3af;text-align:center;">
                ${BANK_NAME} - Service ${BANK_SHORT} en ligne.<br />
                Pour votre sécurité, ${BANK_NAME} ne vous demandera jamais vos codes d'accès complets par email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();

  await transporter.sendMail({
    from: `"${BANK_NAME}" <${
      process.env.SMTP_FROM || "no-reply@olakred.com"
    }>`,
    to,
    subject,
    text,
    html,
  });
}
