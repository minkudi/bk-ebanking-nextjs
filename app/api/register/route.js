import { NextResponse } from 'next/server';
import { getDb } from "../../../lib/db";
import nodemailer from 'nodemailer';

// Templates d'email multilingues
const emailTemplates = {
fr: {
  subject: "Bienvenue sur OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Cher client";
    return [
      `Bonjour ${name},`,
      ``,
      `Bienvenue sur OLAKRED.`,
      ``,
      `Votre espace bancaire en ligne a été créé avec succès.`,
      `Numéro de compte : ${accountNumber}`,
      ``,
      `Vous pouvez dès à présent vous connecter pour :`,
      `- consulter le solde de vos comptes,`,
      `- suivre vos transactions en temps réel,`,
      `- effectuer vos opérations courantes en toute sécurité.`,
      ``,
      `Pour votre sécurité, ne partagez jamais vos identifiants ou codes de connexion.`,
      ``,
      `Cordialement,`,
      `L'équipe OLAKRED`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Cher client";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Bienvenue sur OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    <!-- Remplace par un <img src="https://.../logo.png" /> si tu veux -->
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Confirmation de création de compte
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Bonjour ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Nous avons le plaisir de vous confirmer la création de votre compte OLAKRED.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Numéro de compte
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Vous pouvez dès maintenant vous connecter à votre espace sécurisé pour :
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>consulter le solde de vos comptes,</li>
                <li>suivre vos transactions en temps réel,</li>
                <li>effectuer vos virements et opérations courantes,</li>
                <li>mettre à jour vos informations personnelles.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Accéder à mon espace
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                En cas de doute, contactez immédiatement votre service client.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Plateforme de services bancaires en ligne.
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
  },
},

en: {
  subject: "Welcome to OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Dear customer";
    return [
      `Hello ${name},`,
      ``,
      `Welcome to OLAKRED.`,
      ``,
      `Your online banking profile has been successfully created.`,
      `Account number: ${accountNumber}`,
      ``,
      `You can now log in to:`,
      `- check your account balances,`,
      `- monitor your transactions in real time,`,
      `- perform your everyday banking operations securely.`,
      ``,
      `For your security, never share your login details or security codes with anyone.`,
      ``,
      `Best regards,`,
      `The OLAKRED Team`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Dear customer";
    const baseUrl = process.env.APP_BASE_URL || "https://groups.olakred.com";
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Welcome to OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Account creation confirmation
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Hello ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                We are pleased to confirm that your OLAKRED account has been created.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Account number
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                You can now log in to your secure online banking space to:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>check your account balances,</li>
                <li>monitor your transactions in real time,</li>
                <li>make transfers and everyday payments,</li>
                <li>update your personal information.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Log in to my account
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                If you ever have any doubts, please contact customer support immediately.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Online banking services platform.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                This is an automated message, please do not reply to this email.
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
  },
},

de: {
  subject: "Willkommen bei OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Sehr geehrte Kundin, sehr geehrter Kunde";
    return [
      `Hallo ${name},`,
      ``,
      `willkommen bei OLAKRED.`,
      ``,
      `Ihr Online‑Banking-Zugang wurde erfolgreich eingerichtet.`,
      `Kontonummer: ${accountNumber}`,
      ``,
      `Sie können sich jetzt anmelden, um:`,
      `- Ihre Kontostände zu prüfen,`,
      `- Ihre Umsätze in Echtzeit zu verfolgen,`,
      `- Ihre täglichen Bankgeschäfte sicher durchzuführen.`,
      ``,
      `Zu Ihrer Sicherheit geben Sie Ihre Zugangsdaten oder Sicherheitscodes niemals an Dritte weiter.`,
      ``,
      `Mit freundlichen Grüßen`,
      `Ihr OLAKRED Team`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Sehr geehrte Kundin, sehr geehrter Kunde";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <title>Willkommen bei OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Bestätigung der Kontoeröffnung
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Inhalt -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Hallo ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                wir freuen uns, Ihnen die erfolgreiche Einrichtung Ihres OLAKRED‑Kontos bestätigen zu können.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Kontonummer
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Sie können sich jetzt in Ihrem sicheren Online‑Banking‑Bereich anmelden, um:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>Ihre Kontostände einzusehen,</li>
                <li>Ihre Umsätze in Echtzeit zu verfolgen,</li>
                <li>Überweisungen und Zahlungen durchzuführen,</li>
                <li>Ihre persönlichen Daten zu aktualisieren.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Zum Online‑Banking anmelden
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                Bei Unsicherheit wenden Sie sich bitte umgehend an unseren Kundenservice.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Plattform für digitales Bankwesen.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Diese Nachricht wurde automatisch erstellt. Bitte antworten Sie nicht auf diese E‑Mail.
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
  },
},

nl: {
  subject: "Welkom bij OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Beste klant";
    return [
      `Hallo ${name},`,
      ``,
      `Welkom bij OLAKRED.`,
      ``,
      `Uw online bankomgeving is succesvol aangemaakt.`,
      `Rekeningnummer: ${accountNumber}`,
      ``,
      `U kunt nu inloggen om:`,
      `- uw rekeningsaldi te bekijken,`,
      `- uw transacties in real time te volgen,`,
      `- uw dagelijkse bankzaken veilig uit te voeren.`,
      ``,
      `Deel uw inloggegevens of beveiligingscodes nooit met iemand anders.`,
      ``,
      `Met vriendelijke groet,`,
      `Het OLAKRED team`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Beste klant";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <title>Welkom bij OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Bevestiging van rekeningopening
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Inhoud -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Hallo ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                We bevestigen graag dat uw OLAKRED account succesvol is aangemaakt.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Rekeningnummer
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                U kunt nu inloggen in uw beveiligde online bankomgeving om:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>uw rekeningsaldi te controleren,</li>
                <li>uw transacties in real time te volgen,</li>
                <li>overschrijvingen en betalingen uit te voeren,</li>
                <li>uw persoonlijke gegevens bij te werken.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Inloggen op mijn account
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                Neem bij twijfel onmiddellijk contact op met onze klantenservice.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Platform voor online bankdiensten.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Dit is een automatisch gegenereerd bericht. Gelieve niet op deze e‑mail te antwoorden.
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
  },
},

fi: {
  subject: "Tervetuloa OLAKREDiin",
  text: (fullName, accountNumber) => {
    const name = fullName || "Hyvä asiakas";
    return [
      `Hei ${name},`,
      ``,
      `Tervetuloa OLAKREDiin.`,
      ``,
      `Verkkopankkitilisi on luotu onnistuneesti.`,
      `Tilinumero: ${accountNumber}`,
      ``,
      `Voit nyt kirjautua sisään ja:`,
      `- tarkastella tiliesi saldoja,`,
      `- seurata tapahtumia reaaliajassa,`,
      `- hoitaa päivittäiset pankkiasiasi turvallisesti.`,
      ``,
      `Älä koskaan jaa kirjautumistietojasi tai turvakoodejasi muiden kanssa.`,
      ``,
      `Ystävällisin terveisin,`,
      `OLAKRED -tiimi`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Hyvä asiakas";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="fi">
<head>
  <meta charset="utf-8" />
  <title>Tervetuloa OLAKREDiin</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Tilin avaamisen vahvistus
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sisältö -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Hei ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Meillä on ilo vahvistaa, että OLAKRED -verkkopankkitilisi on luotu onnistuneesti.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Tilinumero
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Voit nyt kirjautua turvalliseen verkkopankkiisi ja:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>tarkastella tiliesi saldoja,</li>
                <li>seurata tapahtumia reaaliajassa,</li>
                <li>tehdä tilisiirtoja ja maksuja,</li>
                <li>päivittää omia tietojasi.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Kirjaudu verkkopankkiin
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                Jos sinulla on epäilyksiä, ota välittömästi yhteyttä asiakaspalveluun.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Verkkopankkipalvelualusta.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Tämä viesti on lähetetty automaattisesti. Älä vastaa tähän sähköpostiin.
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
  },
},

es: {
  subject: "Bienvenido a OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Estimado cliente";
    return [
      `Hola ${name},`,
      ``,
      `Bienvenido a OLAKRED.`,
      ``,
      `Su banca en línea se ha creado correctamente.`,
      `Número de cuenta: ${accountNumber}`,
      ``,
      `Ahora puede iniciar sesión para:`,
      `- consultar los saldos de sus cuentas,`,
      `- seguir sus movimientos en tiempo real,`,
      `- realizar sus operaciones diarias de forma segura.`,
      ``,
      `Por su seguridad, no comparta nunca sus credenciales ni sus códigos de seguridad con nadie.`,
      ``,
      `Atentamente,`,
      `El equipo de OLAKRED`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Estimado cliente";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Bienvenido a OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Encabezado -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Confirmación de apertura de cuenta
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Hola ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Nos complace confirmar que su cuenta de OLAKRED se ha creado correctamente.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Número de cuenta
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Ahora puede acceder a su banca en línea segura para:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>consultar los saldos de sus cuentas,</li>
                <li>seguir sus movimientos en tiempo real,</li>
                <li>realizar transferencias y pagos,</li>
                <li>actualizar sus datos personales.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Acceder a mi cuenta
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                Si tiene alguna duda, póngase en contacto de inmediato con nuestro servicio de atención al cliente.
              </p>
            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Plataforma de servicios bancarios en línea.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Este es un mensaje automático, por favor no responda a este correo.
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
  },
},

pl: {
  subject: "Witamy w OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Drogi Kliencie";
    return [
      `Witaj ${name},`,
      ``,
      `Witamy w OLAKRED.`,
      ``,
      `Twoje konto bankowości internetowej zostało pomyślnie utworzone.`,
      `Numer konta: ${accountNumber}`,
      ``,
      `Możesz teraz zalogować się, aby:`,
      `- sprawdzać salda swoich rachunków,`,
      `- śledzić transakcje w czasie rzeczywistym,`,
      `- bezpiecznie wykonywać codzienne operacje bankowe.`,
      ``,
      `Ze względów bezpieczeństwa nigdy nie udostępniaj swoich danych logowania ani kodów bezpieczeństwa osobom trzecim.`,
      ``,
      `Z poważaniem,`,
      `Zespół OLAKRED`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Drogi Kliencie";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <title>Witamy w OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Nagłówek -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Potwierdzenie utworzenia konta
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Treść -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Witaj ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Z przyjemnością potwierdzamy, że Twoje konto OLAKRED zostało pomyślnie utworzone.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Numer konta
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Możesz teraz zalogować się do swojego bezpiecznego panelu OLAKRED, aby:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>sprawdzać salda swoich rachunków,</li>
                <li>śledzić transakcje w czasie rzeczywistym,</li>
                <li>wykonywać przelewy i płatności,</li>
                <li>aktualizować swoje dane osobowe.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Zaloguj się do mojego konta
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                W razie wątpliwości niezwłocznie skontaktuj się z naszym działem obsługi klienta.
              </p>
            </td>
          </tr>

          <!-- Stopka -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Platforma bankowości internetowej.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Ta wiadomość została wygenerowana automatycznie. Prosimy na nią nie odpowiadać.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">
          &copy; ${new Date().getFullYear()} OLAKRED. Wszystkie prawa zastrzeżone.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
  },
},

pt: {
  subject: "Bem-vindo ao OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Caro cliente";
    return [
      `Olá ${name},`,
      ``,
      `Bem-vindo ao OLAKRED.`,
      ``,
      `A sua conta de banca online foi criada com sucesso.`,
      `Número da conta: ${accountNumber}`,
      ``,
      `Agora pode iniciar sessão para:`,
      `- consultar os saldos das suas contas,`,
      `- acompanhar as suas movimentações em tempo real,`,
      `- realizar as suas operações diárias em segurança.`,
      ``,
      `Por motivos de segurança, nunca partilhe as suas credenciais ou códigos de segurança com terceiros.`,
      ``,
      `Com os melhores cumprimentos,`,
      `Equipa OLAKRED`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Caro cliente";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <title>Bem-vindo ao OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Cabeçalho -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Confirmação de criação de conta
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Olá ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Temos o prazer de confirmar que a sua conta OLAKRED foi criada com sucesso.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Número da conta
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Pode agora aceder à sua área segura de banca online para:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>consultar os saldos das suas contas,</li>
                <li>acompanhar as suas movimentações em tempo real,</li>
                <li>efetuar transferências e pagamentos,</li>
                <li>atualizar os seus dados pessoais.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Aceder à minha conta
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                Em caso de dúvida, contacte de imediato o nosso serviço de apoio ao cliente.
              </p>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Plataforma de serviços bancários online.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Esta é uma mensagem automática, por favor não responda a este e‑mail.
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
  },
},

sk: {
  subject: "Vitajte v OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Vážený klient";
    return [
      `Ahoj ${name},`,
      ``,
      `Vitajte v OLAKRED.`,
      ``,
      `Váš účet internetového bankovníctva bol úspešne vytvorený.`,
      `Číslo účtu: ${accountNumber}`,
      ``,
      `Teraz sa môžete prihlásiť a:`,
      `- kontrolovať zostatky na svojich účtoch,`,
      `- sledovať svoje transakcie v reálnom čase,`,
      `- bezpečne vykonávať svoje každodenné bankové operácie.`,
      ``,
      `Z bezpečnostných dôvodov nikdy nezdieľajte svoje prihlasovacie údaje ani bezpečnostné kódy s tretími osobami.`,
      ``,
      `S pozdravom,`,
      `Tím OLAKRED`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Vážený klient";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="sk">
<head>
  <meta charset="utf-8" />
  <title>Vitajte v OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Hlavička -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Potvrdenie vytvorenia účtu
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Obsah -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Ahoj ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                s radosťou potvrdzujeme, že váš účet OLAKRED bol úspešne vytvorený.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Číslo účtu
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Teraz sa môžete prihlásiť do svojho zabezpečeného internetového bankovníctva a:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>kontrolovať zostatky na svojich účtoch,</li>
                <li>sledovať transakcie v reálnom čase,</li>
                <li>vykonávať prevody a platby,</li>
                <li>aktualizovať svoje osobné údaje.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Prihlásiť sa do môjho účtu
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                V prípade pochybností sa okamžite obráťte na zákaznícky servis.
              </p>
            </td>
          </tr>

          <!-- Pätička -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Platforma pre internetové bankovníctvo.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Táto správa bola vygenerovaná automaticky. Prosím, neodpovedajte na tento e‑mail.
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
  },
},

bg: {
  subject: "Добре дошли в OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Уважаеми клиент";
    return [
      `Здравейте ${name},`,
      ``,
      `Добре дошли в OLAKRED.`,
      ``,
      `Вашият профил за онлайн банкиране беше успешно създаден.`,
      `Номер на сметка: ${accountNumber}`,
      ``,
      `Сега можете да влезете, за да:`,
      `- проверявате салдата по своите сметки,`,
      `- следите транзакциите си в реално време,`,
      `- извършвате ежедневните си банкови операции по сигурен начин.`,
      ``,
      `От съображения за сигурност никога не споделяйте своите данни за вход или защитни кодове с трети лица.`,
      ``,
      `С уважение,`,
      `Екипът на OLAKRED`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Уважаеми клиент";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="bg">
<head>
  <meta charset="utf-8" />
  <title>Добре дошли в OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Хедър -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Потвърждение за създаване на сметка
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Съдържание -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Здравейте ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                С удоволствие потвърждаваме, че вашият акаунт в OLAKRED беше успешно създаден.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Номер на сметка
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Сега можете да влезете в своя защитен профил за онлайн банкиране, за да:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>проверявате салдата по своите сметки,</li>
                <li>следите транзакциите си в реално време,</li>
                <li>извършвате преводи и плащания,</li>
                <li>актуализирате своите лични данни.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Вход в моя профил
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                При съмнение незабавно се свържете с отдела за обслужване на клиенти.
              </p>
            </td>
          </tr>

          <!-- Футър -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Платформа за онлайн банкови услуги.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Това съобщение е генерирано автоматично. Моля, не отговаряйте на този имейл.
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
  },
},

el: {
  subject: "Καλώς ήρθατε στο OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Αγαπητέ πελάτη";
    return [
      `Γεια σας ${name},`,
      ``,
      `Καλώς ήρθατε στο OLAKRED.`,
      ``,
      `Ο λογαριασμός σας για ηλεκτρονική τραπεζική δημιουργήθηκε με επιτυχία.`,
      `Αριθμός λογαριασμού: ${accountNumber}`,
      ``,
      `Μπορείτε τώρα να συνδεθείτε για να:`,
      `- ελέγχετε τα υπόλοιπα των λογαριασμών σας,`,
      `- παρακολουθείτε τις κινήσεις σας σε πραγματικό χρόνο,`,
      `- πραγματοποιείτε τις καθημερινές σας τραπεζικές συναλλαγές με ασφάλεια.`,
      ``,
      `Για λόγους ασφαλείας, μην κοινοποιείτε ποτέ τα στοιχεία σύνδεσης ή τους κωδικούς ασφαλείας σας σε τρίτους.`,
      ``,
      `Με εκτίμηση,`,
      `Η ομάδα του OLAKRED`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Αγαπητέ πελάτη";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="el">
<head>
  <meta charset="utf-8" />
  <title>Καλώς ήρθατε στο OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Επιβεβαίωση δημιουργίας λογαριασμού
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Περιεχόμενο -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Γεια σας ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Με χαρά σας ενημερώνουμε ότι ο λογαριασμός σας στο OLAKRED δημιουργήθηκε με επιτυχία.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Αριθμός λογαριασμού
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Μπορείτε τώρα να συνδεθείτε στον ασφαλή χώρο ηλεκτρονικής τραπεζικής για να:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>ελέγχετε τα υπόλοιπα των λογαριασμών σας,</li>
                <li>παρακολουθείτε τις κινήσεις σας σε πραγματικό χρόνο,</li>
                <li>πραγματοποιείτε μεταφορές και πληρωμές,</li>
                <li>ενημερώνετε τα προσωπικά σας στοιχεία.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Σύνδεση στον λογαριασμό μου
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                Σε περίπτωση αμφιβολιών, επικοινωνήστε άμεσα με την εξυπηρέτηση πελατών.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Πλατφόρμα υπηρεσιών ηλεκτρονικής τραπεζικής.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Αυτό είναι αυτοματοποιημένο μήνυμα· παρακαλούμε μην απαντάτε σε αυτό το email.
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
  },
},

sl: {
  subject: "Dobrodošli v OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Spoštovani klient";
    return [
      `Pozdravljeni ${name},`,
      ``,
      `Dobrodošli v OLAKRED.`,
      ``,
      `Vaš račun za spletno bančništvo je bil uspešno ustvarjen.`,
      `Številka računa: ${accountNumber}`,
      ``,
      `Zdaj se lahko prijavite in:`,
      `- preverjate stanja na svojih računih,`,
      `- spremljate svoje transakcije v realnem času,`,
      `- varno izvajate vsakodnevne bančne operacije.`,
      ``,
      `Zaradi varnosti svojih podatkov svojih prijavnih podatkov ali varnostnih kod nikoli ne delite z drugimi osebami.`,
      ``,
      `Lep pozdrav,`,
      `Ekipa OLAKRED`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Spoštovani klient";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="sl">
<head>
  <meta charset="utf-8" />
  <title>Dobrodošli v OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Glava -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Potrditev odprtja računa
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Vsebina -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Pozdravljeni ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Z veseljem potrjujemo, da je bil vaš račun OLAKRED uspešno ustvarjen.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Številka računa
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Zdaj se lahko prijavite v svoj varni spletni bančni prostor in:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>preverjate stanja na svojih računih,</li>
                <li>spremljate transakcije v realnem času,</li>
                <li>izvajate nakazila in plačila,</li>
                <li>posodabljate svoje osebne podatke.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Prijava v moj račun
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                V primeru dvoma se nemudoma obrnite na službo za podporo strankam.
              </p>
            </td>
          </tr>

          <!-- Noga -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Platforma za spletne bančne storitve.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                To sporočilo je bilo ustvarjeno samodejno. Prosimo, ne odgovarjajte na ta e‑poštni naslov.
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
  },
},

lt: {
  subject: "Sveiki atvykę į OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Gerbiamas kliente";
    return [
      `Sveiki ${name},`,
      ``,
      `Sveiki atvykę į OLAKRED.`,
      ``,
      `Jūsų internetinės bankininkystės paskyra sėkmingai sukurta.`,
      `Sąskaitos numeris: ${accountNumber}`,
      ``,
      `Dabar galite prisijungti ir:`,
      `- peržiūrėti savo sąskaitų likučius,`,
      `- stebėti operacijas realiuoju laiku,`,
      `- saugiai vykdyti kasdienes banko operacijas.`,
      ``,
      `Saugumo sumetimais niekada nesidalykite savo prisijungimo duomenimis ar saugos kodais su trečiosiomis šalimis.`,
      ``,
      `Pagarbiai,`,
      `OLAKRED komanda`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Gerbiamas kliente";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="lt">
<head>
  <meta charset="utf-8" />
  <title>Sveiki atvykę į OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Antraštė -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Paskyros sukūrimo patvirtinimas
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Turinys -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Sveiki ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Su džiaugsmu patvirtiname, kad jūsų OLAKRED paskyra buvo sėkmingai sukurta.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Sąskaitos numeris
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Dabar galite prisijungti prie savo saugios internetinės bankininkystės ir:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>peržiūrėti savo sąskaitų likučius,</li>
                <li>stebėti operacijas realiuoju laiku,</li>
                <li>vykdyti pervedimus ir mokėjimus,</li>
                <li>atnaujinti savo asmens duomenis.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Prisijungti prie mano paskyros
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                Kilus abejonių, nedelsdami susisiekite su klientų aptarnavimo centru.
              </p>
            </td>
          </tr>

          <!-- Poraštė -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Internetinės bankininkystės paslaugų platforma.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Ši žinutė sukurta automatiškai. Prašome neatsakinėti į šį el. laišką.
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
  },
},

lv: {
  subject: "Laipni lūdzam OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Cienījamais klients";
    return [
      `Sveicināti, ${name},`,
      ``,
      `Laipni lūdzam OLAKRED.`,
      ``,
      `Jūsu internetbankas konts ir veiksmīgi izveidots.`,
      `Konta numurs: ${accountNumber}`,
      ``,
      `Tagad varat pierakstīties, lai:`,
      `- pārbaudītu savu kontu atlikumus,`,
      `- sekotu līdzi darījumiem reāllaikā,`,
      `- droši veiktu ikdienas bankas operācijas.`,
      ``,
      `Drošības nolūkos nekad nekopīgojiet savus pieteikšanās datus vai drošības kodus ar trešajām personām.`,
      ``,
      `Ar cieņu,`,
      `OLAKRED komanda`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Cienījamais klients";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="lv">
<head>
  <meta charset="utf-8" />
  <title>Laipni lūdzam OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Galvene -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Konta izveides apstiprinājums
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Saturs -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Sveicināti, ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Ar prieku apstiprinām, ka jūsu OLAKRED konts ir veiksmīgi izveidots.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Konta numurs
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Tagad varat pieslēgties savam drošajam internetbankas profilam, lai:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>pārbaudītu savu kontu atlikumus,</li>
                <li>sekotu līdzi darījumiem reāllaikā,</li>
                <li>veiktu pārskaitījumus un maksājumus,</li>
                <li>atjauninātu savus personas datus.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Pieslēgties manam kontam
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                Ja rodas šaubas, nekavējoties sazinieties ar klientu apkalpošanas dienestu.
              </p>
            </td>
          </tr>

          <!-- Kājene -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Tiešsaistes bankas pakalpojumu platforma.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Šis ir automātiski ģenerēts ziņojums. Lūdzu, neatbildiet uz šo e‑pastu.
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
  },
},

it: {
  subject: "Benvenuto su OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Gentile cliente";
    return [
      `Ciao ${name},`,
      ``,
      `Benvenuto su OLAKRED.`,
      ``,
      `Il tuo profilo di internet banking è stato creato con successo.`,
      `Numero di conto: ${accountNumber}`,
      ``,
      `Ora puoi accedere per:`,
      `- verificare i saldi dei tuoi conti,`,
      `- monitorare le tue operazioni in tempo reale,`,
      `- effettuare in sicurezza le operazioni bancarie di tutti i giorni.`,
      ``,
      `Per motivi di sicurezza non condividere mai le tue credenziali di accesso o i codici di sicurezza con terzi.`,
      ``,
      `Cordiali saluti,`,
      `Il team OLAKRED`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Gentile cliente";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <title>Benvenuto su OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Intestazione -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Conferma creazione conto
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenuto -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Ciao ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Siamo lieti di confermare che il tuo conto OLAKRED è stato creato con successo.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Numero di conto
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Ora puoi accedere alla tua area sicura di internet banking per:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>verificare i saldi dei tuoi conti,</li>
                <li>monitorare le operazioni in tempo reale,</li>
                <li>effettuare bonifici e pagamenti,</li>
                <li>aggiornare i tuoi dati personali.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Accedi al mio conto
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                In caso di dubbi contatta immediatamente il servizio clienti.
              </p>
            </td>
          </tr>

          <!-- Piè di pagina -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Piattaforma di servizi bancari online.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Questo è un messaggio automatico, si prega di non rispondere a questa email.
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
  },
},

cs: {
  subject: "Vítejte v OLAKRED",
  text: (fullName, accountNumber) => {
    const name = fullName || "Vážený kliente";
    return [
      `Ahoj ${name},`,
      ``,
      `Vítejte v OLAKRED.`,
      ``,
      `Váš účet pro internetové bankovnictví byl úspěšně vytvořen.`,
      `Číslo účtu: ${accountNumber}`,
      ``,
      `Nyní se můžete přihlásit a:`,
      `- kontrolovat zůstatky na svých účtech,`,
      `- sledovat své transakce v reálném čase,`,
      `- bezpečně provádět každodenní bankovní operace.`,
      ``,
      `Z bezpečnostních důvodů nikdy nesdílejte své přihlašovací údaje ani bezpečnostní kódy s třetími osobami.`,
      ``,
      `S pozdravem,`,
      `Tým OLAKRED`,
    ].join("\n");
  },
  html: (fullName, accountNumber) => {
    const name = fullName || "Vážený kliente";
    const baseUrl = process.env.APP_BASE_URL || "https://bk-ebanking.test";
    return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8" />
  <title>Vítejte v OLAKRED</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <!-- Hlavička -->
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">
                    OLAKRED
                  </td>
                  <td align="right" style="font-size:12px;opacity:0.9;">
                    Potvrzení vytvoření účtu
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Obsah -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
                Ahoj ${name},
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                s potěšením potvrzujeme, že váš účet OLAKRED byl úspěšně vytvořen.
              </p>

              <table role="presentation" width="100%" style="margin:16px 0 20px 0;">
                <tr>
                  <td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background-color:#F9FAFB;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#6B7280;margin-bottom:4px;">
                      Číslo účtu
                    </div>
                    <div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">
                      ${accountNumber}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">
                Nyní se můžete přihlásit do svého zabezpečeného internetového bankovnictví, kde můžete:
              </p>
              <ul style="margin:0 0 16px 20px;padding:0;font-size:13px;color:#4B5563;line-height:1.6;">
                <li>kontrolovat zůstatky na svých účtech,</li>
                <li>sledovat transakce v reálném čase,</li>
                <li>provádět převody a platby,</li>
                <li>aktualizovat své osobní údaje.</li>
              </ul>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;">
                <tr>
                  <td>
                    <a href="${baseUrl}/login"
                       style="display:inline-block;padding:10px 18px;border-radius:999px;background-color:#0F766E;color:#FFFFFF;font-size:13px;font-weight:600;text-decoration:none;">
                      Přihlásit se do mého účtu
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0;font-size:12px;color:#6B7280;line-height:1.5;">
              </p>
              <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;">
                V případě pochybností kontaktujte neprodleně zákaznickou podporu.
              </p>
            </td>
          </tr>

          <!-- Patička -->
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">
                OLAKRED – Platforma pro internetové bankovnictví.
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                Tato zpráva byla vygenerována automaticky. Prosím, neodpovídejte na tento e‑mail.
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
  },
},

};


async function sendRegistrationAdminEmail({ to, user }) {
  const { fullName, email, locale, createdAt } = user || {};

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"OLAKRED" <${process.env.SMTP_FROM || "no-reply@olakred.com"}>`,
    to,
    subject: `OLAKRED - Nouvelle inscription`,
    text: `Nouvelle inscription\n\nNom : ${fullName}\nEmail : ${email}\nLangue : ${locale}\nDate : ${createdAt}`,
    html: `
      <div style="font-family:sans-serif;font-size:14px;color:#111827;max-width:600px;margin:0 auto;">
        <div style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;border-radius:12px 12px 0 0;">
          <span style="font-size:20px;font-weight:700;color:#fff;">OLAKRED</span>
          <span style="float:right;font-size:12px;color:#fff;opacity:.9;">Nouvelle inscription</span>
        </div>
        <div style="background:#fff;border:1px solid #E5E7EB;border-top:none;padding:24px;border-radius:0 0 12px 12px;">
          <p>Bonjour Admin,</p>
          <p>Une nouvelle inscription vient d'être réalisée sur <strong>OLAKRED</strong>.</p>
          <table style="border-collapse:collapse;font-size:13px;width:100%;">
            <tr>
              <td style="color:#6b7280;padding:6px 0;border-bottom:1px solid #f3f4f6;">Nom complet</td>
              <td style="padding:6px 0;border-bottom:1px solid #f3f4f6;text-align:right;"><strong>${fullName || "-"}</strong></td>
            </tr>
            <tr>
              <td style="color:#6b7280;padding:6px 0;border-bottom:1px solid #f3f4f6;">Email</td>
              <td style="padding:6px 0;border-bottom:1px solid #f3f4f6;text-align:right;"><strong>${email || "-"}</strong></td>
            </tr>
            <tr>
              <td style="color:#6b7280;padding:6px 0;border-bottom:1px solid #f3f4f6;">Langue</td>
              <td style="padding:6px 0;border-bottom:1px solid #f3f4f6;text-align:right;"><strong>${locale || "-"}</strong></td>
            </tr>
            <tr>
              <td style="color:#6b7280;padding:6px 0;">Date / heure</td>
              <td style="padding:6px 0;text-align:right;"><strong>${createdAt || "-"}</strong></td>
            </tr>
          </table>
          <p style="margin-top:20px;font-size:12px;color:#6b7280;">
            Cet email est destiné à l'administration pour suivre les nouvelles ouvertures de compte.
          </p>
        </div>
        <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:12px;">
          &copy; ${new Date().getFullYear()} OLAKRED. Tous droits réservés.
        </p>
      </div>
    `,
  });
}


async function sendWelcomeEmail(to, fullName, accountNumber, locale = 'fr') {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const template = emailTemplates[locale] || emailTemplates.fr;

await transporter.sendMail({
  from: {
    name: "OLAKRED",
    address: process.env.SMTP_FROM,
  },
  to,
  subject: template.subject,
  text: template.text(fullName, accountNumber),
  html: template.html(fullName, accountNumber),
});


}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      fullName,
      address,
      birthDate,
      country,
      phone,
      gender,
      email,
      password,
      confirmPassword,
      locale,
    } = body;

    if (
      !fullName ||
      !address ||
      !birthDate ||
      !country ||
      !phone ||
      !gender ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Email déjà utilisé ?
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (existing.length > 0) {
      await db.end();
      return NextResponse.json(
        { error: 'Email already used' },
        { status: 400 }
      );
    }

    // Création utilisateur (mot de passe en clair pour DEV UNIQUEMENT)
const [resultUser] = await db.execute(
  `
    INSERT INTO users (
      email,
      password,
      full_name,
      address,
      birth_date,
      country,
      phone,
      gender,
      locale
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  [
    email,
    password,
    fullName,
    address,
    birthDate,
    country,
    phone,
    gender,
    (locale || "fr").toLowerCase(),
  ]
);

    const userId = resultUser.insertId;

    // Numéro de compte sans préfixe BK
    const accountNumber = `${Date.now()}`;

    await db.execute(
      'INSERT INTO accounts (user_id, account_number, balance, currency) VALUES (?, ?, ?, ?)',
      [userId, accountNumber, 0, 'EUR']
    );

    await db.end();

// Envoi de l'email dans la bonne langue
try {
  await sendWelcomeEmail(email, fullName, accountNumber, locale);
} catch (e) {
  console.error("Email error", e);
}

// Notif admin nouvelle inscription
sendRegistrationAdminEmail({
  to: process.env.ADMIN_NOTIFY_EMAIL || "contact@olakred.com",
  user: {
    fullName,
    email,
    locale: locale || "fr",
    createdAt: new Date().toLocaleString("fr-FR"),
  },
}).catch((err) => console.error("Erreur mail admin inscription:", err));

return NextResponse.json({ success: true, userId, accountNumber }, { status: 201 });

  } catch (err) {
    console.error('REGISTER ERROR', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
