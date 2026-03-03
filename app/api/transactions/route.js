import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();

    // Récupérer le compte de l'utilisateur
    const [accounts] = await db.execute(
      "SELECT id, account_number FROM accounts WHERE user_id = ? LIMIT 1",
      [userId]
    );

    if (accounts.length === 0) {
      await db.end();
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const account = accounts[0];

    // Toutes les transactions du compte (ou limite + pagination plus tard)
    const [rows] = await db.execute(
      `SELECT 
         id,
         type,
         amount,
         description,
         counterparty_name,
         status,
         created_at,
         CONCAT(RIGHT(?, 4), '-', id) AS reference
       FROM transactions
       WHERE account_id = ?
       ORDER BY created_at DESC`,
      [account.account_number, account.id]
    );

    await db.end();

    return NextResponse.json({
      accountNumber: String(account.account_number),
      transactions: rows.map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount: Number(tx.amount),
        description: tx.description,
        counterparty_name: tx.counterparty_name,
        status: tx.status,
        created_at: tx.created_at,
        reference: tx.reference,
      })),
    });
  } catch (err) {
    console.error("Erreur /api/transactions:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
