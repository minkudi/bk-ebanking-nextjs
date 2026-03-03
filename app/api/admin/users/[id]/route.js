// app/api/admin/users/[id]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../../../lib/db";

async function assertAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const isAdmin = cookieStore.get("is_admin")?.value;
  if (!userId || isAdmin !== "1") return false;
  return true;
}

export async function GET(_req, ctx) {
  const ok = await assertAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const userId = id;

  const db = await getDb();

  // User
  const [users] = await db.execute(
    `SELECT id, email, full_name, phone, country, gender, birth_date, is_admin, created_at
     FROM users WHERE id = ? LIMIT 1`,
    [userId]
  );

  if (!users.length) {
    await db.end();
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const u = users[0];

  // Accounts
  const [accounts] = await db.execute(
    `SELECT id, account_number, balance, currency, created_at
     FROM accounts WHERE user_id = ?`,
    [userId]
  );

  await db.end();

  return NextResponse.json({
    user: {
      id: u.id,
      email: u.email,
      fullName: u.full_name,
      phone: u.phone,
      country: u.country,
      gender: u.gender,
      birthDate: u.birth_date,
      isAdmin: !!u.is_admin,
      createdAt: u.created_at,
    },
    accounts: accounts.map((a) => ({
      id: a.id,
      accountNumber: a.account_number,
      balance: a.balance,
      currency: a.currency,
      createdAt: a.created_at,
    })),
    // pour l'instant on renvoie un tableau vide
    transactions: [],
  });
}

export async function PATCH(req, ctx) {
  const ok = await assertAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const userId = id;

  const body = await req.json().catch(() => ({}));

  const fields = [];
  const values = [];

  const mapping = {
    email: "email",
    fullName: "full_name",
    phone: "phone",
    country: "country",
    gender: "gender",
    birthDate: "birth_date",
  };

  Object.entries(mapping).forEach(([key, column]) => {
    if (body[key] !== undefined) {
      fields.push(`${column} = ?`);
      values.push(body[key]);
    }
  });

  if (!fields.length) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const db = await getDb();

  try {
    values.push(userId);
    await db.execute(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ? LIMIT 1`,
      values
    );
    await db.end();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin update user error:", err);
    await db.end();
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
