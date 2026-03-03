import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../lib/db";

export async function GET() {
  const db = await getDb();

  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      await db.end();
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [users] = await db.execute(
      `SELECT 
         id,
         full_name,
         email,
         phone,
         address,
         country,
         birth_date
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );

    if (users.length === 0) {
      await db.end();
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const u = users[0];

    await db.end();

    return NextResponse.json({
      user: {
        fullName: u.full_name,
        email: u.email,
        phone: u.phone,
        address: u.address,
        country: u.country,
        birthDate: u.birth_date, // YYYY-MM-DD
      },
      preferences: {
        language: "fr",
        dateFormat: "DD/MM/YYYY",
      },
    });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    await db.end();
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const db = await getDb();

  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      await db.end();
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      await db.end();
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const { email, phone, address, country } = body;

    const fields = [];
    const values = [];

    if (typeof email === "string" && email.trim()) {
      fields.push("email = ?");
      values.push(email.trim());
    }

    if (typeof phone === "string") {
      fields.push("phone = ?");
      values.push(phone.trim());
    }

    if (typeof address === "string") {
      fields.push("address = ?");
      values.push(address.trim());
    }

    if (typeof country === "string" && country.trim()) {
      fields.push("country = ?");
      values.push(country.trim());
    }

    if (fields.length > 0) {
      await db.execute(
        `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
        [...values, userId]
      );
    }

    await db.end();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/profile error:", err);
    await db.end();
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
