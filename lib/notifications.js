// lib/notifications.js
import nodemailer from "nodemailer";

const mailTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendTransactionalEmail({ to, subject, html, text }) {
  if (!to) return;

  await mailTransport.sendMail({
    from: {
      name: "OLAKRED",                       
      address: process.env.SMTP_FROM,     
    },
    to,
    subject,
    html,
    text,
  });
}


export async function sendTransactionalSMS({ to, body }) {
  if (!to) return;

  const jwt = process.env.SMS_WORKS_JWT;
  const sender = process.env.SMS_WORKS_SENDER || "OLAKRED";
  const apiUrl =
    process.env.SMS_WORKS_URL ||
    "https://api.thesmsworks.co.uk/v1/message/send";

  if (!jwt) {
    console.error("SMS_WORKS_JWT manquant");
    return;
  }

  const payload = {
    sender, // ex: OLAKRED
    destination: to, // ex: 33612345678 (sans +)
    content: body,
  };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: jwt, // "JWT xxx..."
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const textRes = await res.text();
    console.error("SMS Works error", res.status, textRes);
  }
}
