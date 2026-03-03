import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../../lib/db";

async function assertAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const isAdmin = cookieStore.get("is_admin")?.value;

  if (!userId || isAdmin !== "1") {
    return false;
  }
  return true;
}

export async function GET() {
  const ok = await assertAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = await getDb();
  const [rows] = await db.execute(
    "SELECT sms_enabled FROM settings WHERE id = 1 LIMIT 1"
  );
  await db.end();

  if (!rows.length) {
    return NextResponse.json({ error: "Settings not found" }, { status: 404 });
  }

  return NextResponse.json({ smsEnabled: !!rows[0].sms_enabled });
}

export async function PUT(req) {
  const ok = await assertAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.smsEnabled !== "boolean") {
    return NextResponse.json(
      { error: "smsEnabled (boolean) is required" },
      { status: 400 }
    );
  }

  const db = await getDb();
  await db.execute(
    "UPDATE settings SET sms_enabled = ? WHERE id = 1",
    [body.smsEnabled ? 1 : 0]
  );
  await db.end();

  return NextResponse.json({ success: true });
}
