// app/api/admin/users/[id]/debit/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../../../../lib/db";
import {
  sendTransactionalEmail,
  sendTransactionalSMS,
} from "../../../../../../lib/notifications";
import { buildTransactionEmail } from "../../../../../../lib/transactionEmail";

async function assertAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const isAdmin = cookieStore.get("is_admin")?.value;
  if (!userId || isAdmin !== "1") return false;
  return true;
}

export async function POST(req, ctx) {
  const ok = await assertAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params; // user id

  const body = await req.json().catch(() => null);
  if (!body || !body.amount) {
    return NextResponse.json({ error: "amount is required" }, { status: 400 });
  }

  const amount = Number(body.amount);
  const label = body.label || "Débit manuel admin";

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const db = await getDb();

  try {
    // compte principal du user
    const [accounts] = await db.execute(
      "SELECT id, balance, currency, account_number FROM accounts WHERE user_id = ? LIMIT 1",
      [id]
    );
    if (!accounts.length) {
      await db.end();
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    const row = accounts[0];
    const account = {
      id: row.id,
      balance: row.balance,
      currency: row.currency,
      accountNumber: row.account_number || row.id,
    };

    // solde suffisant
    if (Number(account.balance) < amount) {
      await db.end();
      return NextResponse.json(
        { error: "Solde insuffisant pour ce débit." },
        { status: 400 }
      );
    }

    // infos user + langue
    const [users] = await db.execute(
      "SELECT full_name AS fullName, email, phone, locale FROM users WHERE id = ? LIMIT 1",
      [id]
    );
    const user = users[0] || {};
    const locale = (user.locale || "fr").toLowerCase();

    await db.beginTransaction();

    // débiter le compte
    await db.execute("UPDATE accounts SET balance = balance - ? WHERE id = ?", [
      amount,
      account.id,
    ]);

    // enregistrer la transaction
    const [txResult] = await db.execute(
      `INSERT INTO transactions (account_id, amount, type, description, status)
       VALUES (?, ?, 'DEBIT', ?, 'COMPLETED')`,
      [account.id, amount, label]
    );
    const transactionId = txResult.insertId;
    const displayDate = new Date().toLocaleString(locale || "fr-FR");

    // notifications (on ne bloque pas la transaction si ça échoue)
    try {
      if (user.email) {
        const { subject, text, html } = buildTransactionEmail({
          type: "DEBIT",
          locale, // langue du client
          fullName: user.fullName,
          email: user.email,
          accountNumber: account.accountNumber,
          amount,
          currency: account.currency,
          label,
          transactionId,
          createdAt: displayDate,
        });

        await sendTransactionalEmail({
          to: user.email,
          subject,
          html,
          text,
        });
      }

      if (user.phone) {
        // plus tard tu pourras aussi i18n le SMS
        await sendTransactionalSMS({
          to: user.phone,
          body: `[OLAKRED] Débit de ${amount.toFixed(
            2
          )} ${account.currency} sur votre compte ${
            account.accountNumber
          }. Libellé: ${label}. Réf: ${transactionId}. Si vous n'êtes pas à l'origine, contactez la banque.`,
        });
      }
    } catch (notifyErr) {
      console.error("Debit notification error:", notifyErr);
    }

    await db.commit();
    await db.end();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin debit error:", err);
    try {
      await db.rollback();
    } catch {}
    await db.end();
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
