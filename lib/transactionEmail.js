// lib/transactionEmail.js

// 1) normalizeLocale pour les 16 langues

function normalizeLocale(locale) {
  if (!locale || typeof locale !== "string") return "fr";
  const base = locale.toLowerCase().split("-")[0];

  const supported = [
    "fr", // français
    "en", // anglais
    "de", // allemand
    "nl", // néerlandais
    "fi", // finnois
    "es", // espagnol
    "pt", // portugais
    "pl", // polonais
    "sk", // slovaque
    "bg", // bulgare
    "el", // grec
    "sl", // slovène
    "lt", // lituanien
    "lv", // letton
    "it", // italien
    "cs", // tchèque
  ];

  return supported.includes(base) ? base : "fr";
}


// ========== FR ==========

function buildFr({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "CRÉDIT" : "DÉBIT";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Cher client";

  const text = [
    `Bonjour ${safeName},`,
    ``,
    `Une opération de ${opLabel} a été effectuée sur votre compte.`,
    ``,
    `Montant : ${amountStr}`,
    `Compte : ${accountNumber}`,
    `Libellé : ${label}`,
    `Référence : ${transactionId}`,
    `Date : ${createdAt}`,
    ``,
    `Si vous n'êtes pas à l'origine de cette opération, contactez immédiatement votre conseiller ou le service client.`,
    ``,
    `Cordialement,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Notification de ${opLabel} - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Notification de ${opLabel}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Bonjour ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Nous vous informons qu'une opération de <strong>${opLabel}</strong> a été enregistrée sur votre compte OLAKRED.
              </p>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Montant ${opLabel.toLowerCase()}
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Compte : <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:140px;color:#6B7280;">Libellé</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:140px;color:#6B7280;">Référence</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:140px;color:#6B7280;">Date</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>

              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Si vous n'êtes pas à l'origine de cette opération, veuillez contacter immédiatement votre conseiller ou notre service client.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Adresse de ta structure
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Ce message est généré automatiquement, merci de ne pas y répondre.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Tous droits réservés.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} de votre compte OLAKRED`,
    text,
    html,
  };
}

// ========== EN ==========

function buildEn({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "CREDIT" : "DEBIT";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Dear customer";

  const text = [
    `Hello ${safeName},`,
    ``,
    `A ${opLabel} operation has been performed on your account.`,
    ``,
    `Amount: ${amountStr}`,
    `Account: ${accountNumber}`,
    `Label: ${label}`,
    `Reference: ${transactionId}`,
    `Date: ${createdAt}`,
    ``,
    `If you did not initiate this operation, please contact your advisor or customer support immediately.`,
    ``,
    `Best regards,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${opLabel} notification - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    ${opLabel} notification
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Hello ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                We inform you that a <strong>${opLabel}</strong> operation has been recorded on your OLAKRED account.
              </p>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      ${opLabel.toLowerCase()} amount
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Account: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:140px;color:#6B7280;">Label</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:140px;color:#6B7280;">Reference</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:140px;color:#6B7280;">Date</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>

              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                If you are not the originator of this operation, please contact your advisor or our customer support immediately.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Your institution address
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                This message is automatically generated, please do not reply to it.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} on your OLAKRED account`,
    text,
    html,
  };
}

function buildDe({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "GUTSCHRIFT" : "BELASTUNG";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName =
    fullName || email || "Sehr geehrte Kundin, sehr geehrter Kunde";

  const text = [
    `Guten Tag ${safeName},`,
    ``,
    `Auf Ihrem Konto wurde eine ${opLabel}-Buchung vorgenommen.`,
    ``,
    `Betrag: ${amountStr}`,
    `Konto: ${accountNumber}`,
    `Verwendungszweck: ${label}`,
    `Referenz: ${transactionId}`,
    `Datum: ${createdAt}`,
    ``,
    `Wenn Sie diese Transaktion nicht veranlasst haben, kontaktieren Sie bitte umgehend Ihren Berater oder den Kundenservice.`,
    ``,
    `Mit freundlichen Grüßen,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <title>${opLabel}-Benachrichtigung - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    ${opLabel}-Benachrichtigung
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Guten Tag ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Wir informieren Sie, dass eine <strong>${opLabel}</strong>-Buchung auf Ihrem OLAKRED-Konto vorgenommen wurde.
              </p>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Betrag der Buchung
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Konto: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:160px;color:#6B7280;">Verwendungszweck</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:160px;color:#6B7280;">Referenz</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:160px;color:#6B7280;">Datum</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>

              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Wenn Sie diese Transaktion nicht veranlasst haben, kontaktieren Sie bitte umgehend Ihren Berater oder unseren Kundenservice.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Anschrift Ihres Instituts
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Diese Nachricht wurde automatisch erstellt, bitte antworten Sie nicht darauf.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Alle Rechte vorbehalten.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} auf Ihrem OLAKRED-Konto`,
    text,
    html,
  };
}

// ========== NL ==========

function buildNl({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "CREDIT" : "DEBET";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Beste klant";

  const text = [
    `Beste ${safeName},`,
    ``,
    `Er is een ${opLabel}-transactie uitgevoerd op uw rekening.`,
    ``,
    `Bedrag: ${amountStr}`,
    `Rekening: ${accountNumber}`,
    `Omschrijving: ${label}`,
    `Referentie: ${transactionId}`,
    `Datum: ${createdAt}`,
    ``,
    `Als u deze transactie niet zelf heeft uitgevoerd, neem dan onmiddellijk contact op met uw adviseur of de klantendienst.`,
    ``,
    `Met vriendelijke groet,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <title>${opLabel}-melding - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    ${opLabel}-melding
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Beste ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Wij informeren u dat er een <strong>${opLabel}</strong>-transactie is geregistreerd op uw OLAKRED-rekening.
              </p>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Transactiebedrag
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Rekening: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:160px;color:#6B7280;">Omschrijving</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:160px;color:#6B7280;">Referentie</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:160px;color:#6B7280;">Datum</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>

              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Als u deze transactie niet zelf heeft uitgevoerd, neem dan onmiddellijk contact op met uw adviseur of onze klantendienst.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Adres van uw instelling
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Dit bericht is automatisch gegenereerd, gelieve hier niet op te antwoorden.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Alle rechten voorbehouden.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} op uw OLAKRED-rekening`,
    text,
    html,
  };
}

function buildFi({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "KREDIITTI" : "DEBITTI";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Arvoisa asiakas";

  const text = [
    `Hyvä ${safeName},`,
    ``,
    `Tilillenne on tehty ${opLabel}-tapahtuma.`,
    ``,
    `Summa: ${amountStr}`,
    `Tili: ${accountNumber}`,
    `Selite: ${label}`,
    `Viite: ${transactionId}`,
    `Päivämäärä: ${createdAt}`,
    ``,
    `Jos ette ole itse aloittanut tätä tapahtumaa, ottakaa välittömästi yhteyttä omaan neuvojaan tai asiakaspalveluumme.`,
    ``,
    `Ystävällisin terveisin,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="fi">
<head>
  <meta charset="utf-8" />
  <title>${opLabel}-ilmoitus - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    ${opLabel}-ilmoitus
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Hyvä ${safeName},
              </p>
             <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Ilmoitamme, että tilillenne on kirjattu <strong>${opLabel}</strong>-tapahtuma OLAKRED-tilille.
              </p>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Tapahtuman summa
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Tili: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:180px;color:#6B7280;">Selite</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:180px;color:#6B7280;">Viite</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:180px;color:#6B7280;">Päivämäärä</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>

              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Jos ette ole itse aloittanut tätä tapahtumaa, ottakaa välittömästi yhteyttä omaan neuvojaan tai asiakaspalveluumme.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Laitoksenne osoite
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Tämä viesti on luotu automaattisesti, älkää vastatko tähän viestiin.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Kaikki oikeudet pidätetään.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel}-tapahtuma OLAKRED-tilillänne`,
    text,
    html,
  };
}

function buildEs({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "CRÉDITO" : "DÉBITO";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Estimado cliente";

  const text = [
    `Estimado/a ${safeName},`,
    ``,
    `Se ha realizado una operación de ${opLabel} en su cuenta.`,
    ``,
    `Importe: ${amountStr}`,
    `Cuenta: ${accountNumber}`,
    `Concepto: ${label}`,
    `Referencia: ${transactionId}`,
    `Fecha: ${createdAt}`,
    ``,
    `Si usted no ha realizado esta operación, póngase en contacto inmediatamente con su asesor o con el servicio de atención al cliente.`,
    ``,
    `Atentamente,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Notificación de ${opLabel} - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Notificación de ${opLabel}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Estimado/a ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Le informamos de que se ha registrado una operación de <strong>${opLabel}</strong> en su cuenta OLAKRED.
              </p>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Importe de la operación
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Cuenta: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:170px;color:#6B7280;">Concepto</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:170px;color:#6B7280;">Referencia</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:170px;color:#6B7280;">Fecha</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>

              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Si usted no ha realizado esta operación, póngase en contacto inmediatamente con su asesor o con nuestro servicio de atención al cliente.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Dirección de su entidad
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Este mensaje se ha generado automáticamente, por favor no responda a este correo.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Todos los derechos reservados.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} en su cuenta OLAKRED`,
    text,
    html,
  };
}


function buildPt({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "CRÉDITO" : "DÉBITO";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Prezado cliente";

  const text = [
    `Prezado(a) ${safeName},`,
    ``,
    `Uma operação de ${opLabel} foi efetuada na sua conta.`,
    ``,
    `Valor: ${amountStr}`,
    `Conta: ${accountNumber}`,
    `Descrição: ${label}`,
    `Referência: ${transactionId}`,
    `Data: ${createdAt}`,
    ``,
    `Caso não tenha realizado esta operação, entre em contacto imediatamente com o seu consultor ou com o serviço de apoio ao cliente.`,
    ``,
    `Atenciosamente,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <title>Notificação de ${opLabel} - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Notificação de ${opLabel}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Prezado(a) ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Informamos que foi registada uma operação de <strong>${opLabel}</strong> na sua conta OLAKRED.
              </p>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Valor da operação
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Conta: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:170px;color:#6B7280;">Descrição</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:170px;color:#6B7280;">Referência</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:170px;color:#6B7280;">Data</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>

              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Caso não tenha realizado esta operação, entre em contacto imediatamente com o seu consultor ou com o nosso serviço de apoio ao cliente.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Endereço da sua instituição
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Esta mensagem foi gerada automaticamente, por favor não responda a este e-mail.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Todos os direitos reservados.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} na sua conta OLAKRED`,
    text,
    html,
  };
}


function buildPl({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "UZNANIE" : "OBCIĄŻENIE";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Szanowny Kliencie";

  const text = [
    `Szanowny/a ${safeName},`,
    ``,
    `Na Państwa koncie została wykonana operacja typu ${opLabel}.`,
    ``,
    `Kwota: ${amountStr}`,
    `Konto: ${accountNumber}`,
    `Tytuł: ${label}`,
    `Referencja: ${transactionId}`,
    `Data: ${createdAt}`,
    ``,
    `Jeśli to nie Państwo zlecili tę operację, prosimy o niezwłoczny kontakt z doradcą lub działem obsługi klienta.`,
    ``,
    `Z poważaniem,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <title>Powiadomienie o ${opLabel} - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Powiadomienie o ${opLabel}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Szanowny/a ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Informujemy, że na Państwa koncie została zarejestrowana operacja typu <strong>${opLabel}</strong> na rachunku OLAKRED.
              </p>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Kwota operacji
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Konto: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:180px;color:#6B7280;">Tytuł operacji</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:180px;color:#6B7280;">Referencja</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:180px;color:#6B7280;">Data</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>

              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Jeżeli to nie Państwo zlecili tę operację, prosimy o niezwłoczny kontakt z doradcą lub naszym działem obsługi klienta.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Adres Państwa instytucji
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Ta wiadomość została wygenerowana automatycznie, prosimy na nią nie odpowiadać.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Wszelkie prawa zastrzeżone.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} na Państwa koncie OLAKRED`,
    text,
    html,
  };
}

function buildSk({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "KREDIT" : "DEBET";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Vážený klient";

  const text = [
    `Vážený/á ${safeName},`,
    ``,
    `Na Vašom účte bola vykonaná operácia typu ${opLabel}.`,
    ``,
    `Suma: ${amountStr}`,
    `Účet: ${accountNumber}`,
    `Popis: ${label}`,
    `Referencia: ${transactionId}`,
    `Dátum: ${createdAt}`,
    ``,
    `Ak ste túto operáciu nevykonali Vy, prosím, okamžite kontaktujte svojho poradcu alebo zákaznícky servis.`,
    ``,
    `S pozdravom,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="sk">
<head>
  <meta charset="utf-8" />
  <title>Upozornenie na ${opLabel} - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Upozornenie na ${opLabel}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Vážený/á ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Oznamujeme Vám, že na Vašom účte OLAKRED bola zaevidovaná operácia typu <strong>${opLabel}</strong>.
              </p>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Suma operácie
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Účet: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Popis operácie</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Referencia</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Dátum</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>
              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Ak ste túto operáciu nevykonali Vy, prosím, bezodkladne kontaktujte svojho poradcu alebo náš zákaznícky servis.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Adresa Vašej inštitúcie
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Táto správa bola vygenerovaná automaticky, prosím neodpovedajte na ňu.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Všetky práva vyhradené.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} na Vašom účte OLAKRED`,
    text,
    html,
  };
}

function buildBg({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "КРЕДИТ" : "ДЕБИТ";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Уважаеми клиент";

  const text = [
    `Уважаеми/а ${safeName},`,
    ``,
    `По Вашата сметка е извършена операция тип ${opLabel}.`,
    ``,
    `Сума: ${amountStr}`,
    `Сметка: ${accountNumber}`,
    `Основание: ${label}`,
    `Референция: ${transactionId}`,
    `Дата: ${createdAt}`,
    ``,
    `Ако Вие не сте наредили тази операция, моля незабавно се свържете с Вашия консултант или с отдела за обслужване на клиенти.`,
    ``,
    `С уважение,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="bg">
<head>
  <meta charset="utf-8" />
  <title>Известие за ${opLabel} - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Известие за ${opLabel}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Уважаеми/а ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Информираме Ви, че по Вашата сметка OLAKRED е регистрирана операция тип <strong>${opLabel}</strong>.
              </p>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Сума на операцията
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Сметка: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:200px;color:#6B7280;">Основание на операцията</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:200px;color:#6B7280;">Референция</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:200px;color:#6B7280;">Дата</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>
              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Ако Вие не сте наредили тази операция, моля незабавно се свържете с Вашия консултант или с нашия отдел за обслужване на клиенти.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Адрес на Вашата институция
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Това съобщение е генерирано автоматично, моля не отговаряйте на него.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Всички права запазени.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} по Вашата сметка OLAKRED`,
    text,
    html,
  };
}


function buildEl({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "ΠΙΣΤΩΣΗ" : "ΧΡΕΩΣΗ";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Αγαπητέ πελάτη";

  const text = [
    `Αγαπητέ/ή ${safeName},`,
    ``,
    `Έχει πραγματοποιηθεί μία συναλλαγή τύπου ${opLabel} στον λογαριασμό σας.`,
    ``,
    `Ποσό: ${amountStr}`,
    `Λογαριασμός: ${accountNumber}`,
    `Αιτιολογία: ${label}`,
    `Αναφορά: ${transactionId}`,
    `Ημερομηνία: ${createdAt}`,
    ``,
    `Εάν δεν έχετε πραγματοποιήσει εσείς αυτή τη συναλλαγή, παρακαλούμε επικοινωνήστε άμεσα με τον σύμβουλό σας ή με το τμήμα εξυπηρέτησης πελατών.`,
    ``,
    `Με εκτίμηση,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="el">
<head>
  <meta charset="utf-8" />
  <title>Ειδοποίηση για ${opLabel} - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Ειδοποίηση για ${opLabel}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Αγαπητέ/ή ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Σας ενημερώνουμε ότι έχει καταχωρηθεί συναλλαγή τύπου <strong>${opLabel}</strong> στον λογαριασμό σας στην OLAKRED.
              </p>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Ποσό συναλλαγής
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Λογαριασμός: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:200px;color:#6B7280;">Αιτιολογία συναλλαγής</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:200px;color:#6B7280;">Αναφορά</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:200px;color:#6B7280;">Ημερομηνία</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>
              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Εάν δεν έχετε πραγματοποιήσει εσείς αυτή τη συναλλαγή, παρακαλούμε επικοινωνήστε άμεσα με τον σύμβουλό σας ή με το τμήμα εξυπηρέτησης πελατών.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Διεύθυνση του ιδρύματός σας
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Αυτό το μήνυμα δημιουργήθηκε αυτόματα, παρακαλούμε μην απαντήσετε σε αυτό.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Με επιφύλαξη παντός δικαιώματος.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `Συναλλαγή ${opLabel} στον λογαριασμό σας OLAKRED`,
    text,
    html,
  };
}


function buildSl({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "DOBROPIS" : "BREMENITEV";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Spoštovani klient";

  const text = [
    `Spoštovani ${safeName},`,
    ``,
    `Na vašem računu je bila izvedena transakcija vrste ${opLabel}.`,
    ``,
    `Znesek: ${amountStr}`,
    `Račun: ${accountNumber}`,
    `Namen: ${label}`,
    `Referenca: ${transactionId}`,
    `Datum: ${createdAt}`,
    ``,
    `Če transakcije niste opravili vi, prosimo, da nemudoma kontaktirate svojega svetovalca ali službo za pomoč uporabnikom.`,
    ``,
    `Lep pozdrav,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="sl">
<head>
  <meta charset="utf-8" />
  <title>Obvestilo o ${opLabel} - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Obvestilo o ${opLabel}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Spoštovani ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Obveščamo vas, da je bila na vašem računu OLAKRED zabeležena transakcija vrste <strong>${opLabel}</strong>.
              </p>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Znesek transakcije
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Račun: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Namen transakcije</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Referenca</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Datum</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>
              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Če transakcije niste opravili vi, vas prosimo, da nemudoma kontaktirate svojega svetovalca ali našo službo za pomoč uporabnikom.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Naslov vaše ustanove
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                To sporočilo je bilo ustvarjeno samodejno, prosimo, ne odgovarjajte nanj.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Vse pravice pridržane.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} na vašem računu OLAKRED`,
    text,
    html,
  };
}

function buildLt({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "KREDITO" : "DEBITO";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Gerbiamas kliente";

  const text = [
    `Gerbiamas(-a) ${safeName},`,
    ``,
    `Jūsų sąskaitoje atlikta ${opLabel} operacija.`,
    ``,
    `Suma: ${amountStr}`,
    `Sąskaita: ${accountNumber}`,
    `Paskirtis: ${label}`,
    `Nuoroda: ${transactionId}`,
    `Data: ${createdAt}`,
    ``,
    `Jei šios operacijos nevykdėte jūs, prašome nedelsiant susisiekti su savo konsultantu arba klientų aptarnavimo skyriumi.`,
    ``,
    `Pagarbiai,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="lt">
<head>
  <meta charset="utf-8" />
  <title>Pranešimas apie ${opLabel} operaciją - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Pranešimas apie ${opLabel} operaciją
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Gerbiamas(-a) ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Informuojame, kad jūsų OLAKRED sąskaitoje užregistruota <strong>${opLabel}</strong> operacija.
              </p>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Operacijos suma
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Sąskaita: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Operacijos paskirtis</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Nuoroda</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Data</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>
              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Jei šios operacijos nevykdėte jūs, prašome nedelsiant susisiekti su savo konsultantu arba su mūsų klientų aptarnavimo skyriumi.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Jūsų įstaigos adresas
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Ši žinutė sugeneruota automatiškai, prašome į ją neatsakyti.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Visos teisės saugomos.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} operacija jūsų OLAKRED sąskaitoje`,
    text,
    html,
  };
}


function buildLv({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "KREDĪTS" : "DEBETS";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Cienījamais klients";

  const text = [
    `Cienījamais ${safeName},`,
    ``,
    `Jūsu kontā ir veikta darījuma operācija (${opLabel}).`,
    ``,
    `Summa: ${amountStr}`,
    `Konts: ${accountNumber}`,
    `Mērķis: ${label}`,
    `Atsauce: ${transactionId}`,
    `Datums: ${createdAt}`,
    ``,
    `Ja šo darījumu neveicāt Jūs, lūdzam nekavējoties sazināties ar savu konsultantu vai klientu apkalpošanas dienestu.`,
    ``,
    `Ar cieņu,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="lv">
<head>
  <meta charset="utf-8" />
  <title>Paziņojums par ${opLabel} - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Paziņojums par ${opLabel}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Cienījamais ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Informējam, ka Jūsu OLAKRED kontā ir reģistrēts darījums (<strong>${opLabel}</strong>).
              </p>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Darījuma summa
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Konts: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Darījuma mērķis</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Atsauce</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Datums</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>
              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Ja šo darījumu neveicāt Jūs, lūdzam nekavējoties sazināties ar savu konsultantu vai ar mūsu klientu apkalpošanas dienestu.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Jūsu iestādes adrese
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Šis ziņojums ir ģenerēts automātiski, lūdzu, neatbildiet uz to.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Visas tiesības aizsargātas.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} Jūsu OLAKRED kontā`,
    text,
    html,
  };
}


function buildIt({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "ACCREDITO" : "ADDEBITO";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Gentile cliente";

  const text = [
    `Gentile ${safeName},`,
    ``,
    `È stata effettuata un'operazione di tipo ${opLabel} sul suo conto.`,
    ``,
    `Importo: ${amountStr}`,
    `Conto: ${accountNumber}`,
    `Causale: ${label}`,
    `Riferimento: ${transactionId}`,
    `Data: ${createdAt}`,
    ``,
    `Se non ha autorizzato personalmente questa operazione, La preghiamo di contattare immediatamente il Suo consulente o il servizio clienti.`,
    ``,
    `Cordiali saluti,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <title>Notifica di ${opLabel} - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Notifica di ${opLabel}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Gentile ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                La informiamo che sul Suo conto OLAKRED è stata registrata un'operazione di tipo <strong>${opLabel}</strong>.
              </p>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Importo dell'operazione
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Conto: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Causale dell'operazione</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Riferimento</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Data</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>
              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Se non ha autorizzato personalmente questa operazione, La preghiamo di contattare immediatamente il Suo consulente o il nostro servizio clienti.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Indirizzo della Sua istituzione
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Questo messaggio è stato generato automaticamente, La preghiamo di non rispondere a questa email.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Tutti i diritti riservati.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} sul Suo conto OLAKRED`,
    text,
    html,
  };
}


function buildCs({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? "KREDIT" : "DEBET";
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${amount.toFixed(2)} ${currency}`;
  const safeName = fullName || email || "Vážený klient";

  const text = [
    `Vážený/á ${safeName},`,
    ``,
    `Na vašem účtu byla provedena transakce typu ${opLabel}.`,
    ``,
    `Částka: ${amountStr}`,
    `Účet: ${accountNumber}`,
    `Účel platby: ${label}`,
    `Reference: ${transactionId}`,
    `Datum: ${createdAt}`,
    ``,
    `Pokud jste tuto transakci neprovedl(a) vy, kontaktujte prosím neprodleně svého poradce nebo zákaznický servis.`,
    ``,
    `S pozdravem,`,
    `OLAKRED`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8" />
  <title>Upozornění na ${opLabel} - OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Upozornění na ${opLabel}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Vážený/á ${safeName},
              </p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Informujeme vás, že na vašem účtu OLAKRED byla zaevidována transakce typu <strong>${opLabel}</strong>.
              </p>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;">
                <tr>
                  <td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Částka transakce
                    </div>
                    <div style="font-size:22px;font-weight:700;color:${color};">
                      ${amountStr}
                    </div>
                    <div style="margin-top:8px;font-size:12px;color:#6B7280;">
                      Účet: <span style="font-family:monospace;">${accountNumber}</span>
                    </div>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Účel platby</td>
                  <td style="padding:4px 0;">${label}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Reference</td>
                  <td style="padding:4px 0;font-family:monospace;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;width:190px;color:#6B7280;">Datum</td>
                  <td style="padding:4px 0;">${createdAt}</td>
                </tr>
              </table>
              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">
                Pokud jste tuto transakci neprovedl(a) vy, kontaktujte prosím neprodleně svého poradce nebo náš zákaznický servis.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED - Adresa vaší instituce
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Tato zpráva byla vygenerována automaticky, prosím neodpovídejte na ni.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Všechna práva vyhrazena.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} na vašem účtu OLAKRED`,
    text,
    html,
  };
}



// ========== EXPORT ==========

export function buildTransactionEmail(params) {
  const locale = normalizeLocale(params.locale);

  if (locale === "en") return buildEn(params);
  if (locale === "de") return buildDe(params);
  if (locale === "nl") return buildNl(params);
  if (locale === "fi") return buildFi(params);
  if (locale === "es") return buildEs(params);
  if (locale === "pt") return buildPt(params);
  if (locale === "pl") return buildPl(params);
  if (locale === "sk") return buildSk(params);
  if (locale === "bg") return buildBg(params);
  if (locale === "el") return buildEl(params);
  if (locale === "sl") return buildSl(params);
  if (locale === "lt") return buildLt(params);
  if (locale === "lv") return buildLv(params);
  if (locale === "it") return buildIt(params);
  if (locale === "cs") return buildCs(params);

  // défaut
  return buildFr(params);
}

// ── ADMIN : Notification virement ──
export function buildTransferAdminEmail({
  senderName, senderEmail, senderAccount,
  recipientName, recipientEmail, recipientAccount,
  amount, currency, label, transactionId, createdAt,
}) {
  const amountStr = `${parseFloat(amount).toFixed(2)} ${currency}`;
  const year = new Date().getFullYear();

  const html = `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><title>Nouveau virement — OLAKRED</title></head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
        <tr>
          <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;">
            <table width="100%"><tr>
              <td style="font-size:20px;font-weight:700;">OLAKRED</td>
              <td align="right" style="font-size:12px;opacity:.9;">🔔 Nouveau virement</td>
            </tr></table>
          </td>
        </tr>
        <tr><td style="padding:24px;">
          <p style="margin:0 0 16px;font-size:14px;color:#111827;">Bonjour Admin,</p>
          <p style="margin:0 0 20px;font-size:13px;color:#4B5563;line-height:1.5;">
            Un virement vient d'être effectué sur <strong>OLAKRED</strong>.
          </p>
          <table width="100%" style="margin:0 0 20px;">
            <tr><td style="padding:16px;border-radius:10px;border:1px solid #E5E7EB;background:#F9FAFB;">
              <div style="font-size:11px;text-transform:uppercase;color:#6B7280;margin-bottom:4px;">Montant transféré</div>
              <div style="font-size:26px;font-weight:700;color:#0F766E;">${amountStr}</div>
            </td></tr>
          </table>
          <table width="100%" style="border-collapse:collapse;font-size:13px;color:#374151;">
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:8px 0;color:#6B7280;width:180px;">Expéditeur</td>
              <td style="padding:8px 0;font-weight:600;">${senderName || '—'}</td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:8px 0;color:#6B7280;">Email expéditeur</td>
              <td style="padding:8px 0;">${senderEmail || '—'}</td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:8px 0;color:#6B7280;">Compte expéditeur</td>
              <td style="padding:8px 0;font-family:monospace;">${senderAccount || '—'}</td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:8px 0;color:#6B7280;">Bénéficiaire</td>
              <td style="padding:8px 0;font-weight:600;">${recipientName || '—'}</td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:8px 0;color:#6B7280;">Email bénéficiaire</td>
              <td style="padding:8px 0;">${recipientEmail || '—'}</td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:8px 0;color:#6B7280;">Compte bénéficiaire</td>
              <td style="padding:8px 0;font-family:monospace;">${recipientAccount || '—'}</td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:8px 0;color:#6B7280;">Libellé</td>
              <td style="padding:8px 0;">${label || '—'}</td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6;">
              <td style="padding:8px 0;color:#6B7280;">Référence</td>
              <td style="padding:8px 0;font-family:monospace;">${transactionId || '—'}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6B7280;">Date / Heure</td>
              <td style="padding:8px 0;">${createdAt || '—'}</td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#6B7280;">Ne pas répondre à cet email automatique.</p>
        </td></tr>
        <tr>
          <td style="padding:16px 24px;border-top:1px solid #E5E7EB;background:#F9FAFB;">
            <p style="margin:0;font-size:11px;color:#9CA3AF;">OLAKRED — Plateforme bancaire en ligne.</p>
          </td>
        </tr>
      </table>
      <p style="margin:12px 0 0;font-size:10px;color:#9CA3AF;">&copy; ${year} OLAKRED. Tous droits réservés.</p>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `[OLAKRED] Nouveau virement`,
    ``,
    `Expéditeur   : ${senderName} (${senderEmail})`,
    `Compte       : ${senderAccount}`,
    `Bénéficiaire : ${recipientName} (${recipientEmail})`,
    `Compte       : ${recipientAccount}`,
    `Montant      : ${amountStr}`,
    `Libellé      : ${label}`,
    `Référence    : ${transactionId}`,
    `Date         : ${createdAt}`,
  ].join('\n');

  return {
    subject: `[OLAKRED] Virement ${amountStr} — ${senderName} → ${recipientName}`,
    html,
    text,
  };
}
