import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../../lib/db";

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

    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      await db.end();
      return NextResponse.json(
        { error: "Both currentPassword and newPassword are required." },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur
    const [users] = await db.execute(
      "SELECT id, password FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (users.length === 0) {
      await db.end();
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = users[0];

    // Comparaison en clair (test seulement)
    if (user.password !== currentPassword) {
      await db.end();
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect." },
        { status: 400 }
      );
    }

    // Mettre à jour avec le nouveau mot de passe (en clair pour tes tests)
    await db.execute("UPDATE users SET password = ? WHERE id = ?", [
      newPassword,
      userId,
    ]);

    await db.end();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/profile/password error:", err);
    await db.end();
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
