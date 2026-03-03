// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../../lib/db";

async function assertAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const isAdmin = cookieStore.get("is_admin")?.value;
  if (!userId || isAdmin !== "1") return false;
  return true;
}

export async function GET() {
  const ok = await assertAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = await getDb();

  const [rows] = await db.execute(
    `SELECT 
       u.id,
       u.full_name,
       u.email,
       u.phone,
       u.country,
       u.is_admin,
       a.account_number,
       a.balance,
       u.created_at
     FROM users u
     LEFT JOIN accounts a ON a.user_id = u.id
     ORDER BY u.created_at DESC`
  );

  await db.end();

  return NextResponse.json({
    users: rows.map((u) => ({
      id: u.id,
      fullName: u.full_name,
      email: u.email,
      phone: u.phone,
      country: u.country,
      isAdmin: !!u.is_admin,
      accountNumber: u.account_number,
      balance: u.balance,
      createdAt: u.created_at,
    })),
  });
}
