// app/api/transfer/route.js
import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { cookies } from "next/headers";
import { sendTransferEmail } from "../../../lib/mail";
import { sendTransferSms } from "../../../lib/sms";

export async function POST(req) {
  const db = await getDb();

  try {
    // 1) Auth par cookie user_id (comme /api/dashboard)
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      await db.end();
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Lecture body + validations simples
    const body = await req.json().catch(() => null);
    if (!body) {
      await db.end();
      return NextResponse.json(
        { error: "Corps de requête invalide." },
        { status: 400 }
      );
    }

    const { holder, iban, bic, amount, reason, country, bankName } = body;

    if (!holder || !iban || !amount || !country || !bankName) {
      await db.end();
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis." },
        { status: 400 }
      );
    }

    const amountNumber = Number(amount);
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      await db.end();
      return NextResponse.json(
        { error: "Le montant doit être un nombre strictement positif." },
        { status: 400 }
      );
    }

    // 3) Récupérer utilisateur + compte (avec phone)
    const [users] = await db.execute(
      "SELECT id, email, full_name, phone FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (users.length === 0) {
      await db.end();
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    const user = users[0];

    const [accounts] = await db.execute(
      "SELECT id, balance, currency, account_number FROM accounts WHERE user_id = ? LIMIT 1",
      [userId]
    );

    if (accounts.length === 0) {
      await db.end();
      return NextResponse.json(
        { error: "Compte introuvable." },
        { status: 404 }
      );
    }

    const account = accounts[0];
    const currentBalance = Number(account.balance);

    if (amountNumber > currentBalance) {
      await db.end();
      return NextResponse.json(
        { error: "Solde insuffisant pour effectuer ce virement." },
        { status: 400 }
      );
    }

    const newBalance = currentBalance - amountNumber;

    // 4) Transaction SQL : pending_transactions + transactions + update balance
    await db.beginTransaction();

    const [pendingResult] = await db.execute(
      `INSERT INTO pending_transactions
       (account_id, amount, bank_name, iban, country, beneficiary_name, purpose, status, email_sent, sms_sent)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', 0, 0)`,
      [
        account.id,
        amountNumber,
        bankName,
        iban,
        country,
        holder,
        reason || null,
      ]
    );

    const [txResult] = await db.execute(
      `INSERT INTO transactions
       (account_id, type, amount, description, counterparty_iban, counterparty_name, status)
       VALUES (?, 'DEBIT', ?, ?, ?, ?, 'COMPLETED')`,
      [
        account.id,
        amountNumber,
        reason || `Virement vers ${holder}`,
        iban,
        holder,
      ]
    );

    await db.execute("UPDATE accounts SET balance = ? WHERE id = ?", [
      newBalance,
      account.id,
    ]);

    await db.commit();

    const pendingId = pendingResult.insertId;
    const transactionId = txResult.insertId;
    let reference;

    // 5) Email (best effort)
    try {
      reference = `${String(account.account_number).slice(-4)}-${transactionId}`;

      await sendTransferEmail({
        to: user.email,
        fullName: user.full_name,
        transfer: {
          amount: amountNumber,
          iban,
          bic,
          country,
          holder,
          reason,
          reference,
          date: undefined,
          newBalance,
        },
      });

      await db.execute(
        "UPDATE pending_transactions SET email_sent = 1 WHERE id = ?",
        [pendingId]
      );
    } catch (mailErr) {
      console.error("Erreur envoi email virement:", mailErr);
    }

    try {
      const last4 = String(account.account_number).slice(-4);

      await sendTransferSms({
        to: user.phone, // colonne phone de ta table users
        fullName: user.full_name,
        transfer: {
          amount: amountNumber,
          newBalance,
          last4,
          reference: reference || `TX-${transactionId}`,
        },
      });

      await db.execute(
        "UPDATE pending_transactions SET sms_sent = 1 WHERE id = ?",
        [pendingId]
      );
    } catch (smsErr) {
      console.error("Erreur envoi SMS virement:", smsErr);
    }

    await db.end();

    return NextResponse.json({
      message: "Virement exécuté avec succès.",
      newBalance,
      transactionId,
      pendingId,
      accountNumber: account.account_number,
      userEmail: user.email,
      fullName: user.full_name,
    });
  } catch (err) {
    console.error("Erreur serveur /api/transfer (DB):", err);
    try {
      await db.rollback();
    } catch (e) {}
    await db.end();
    return NextResponse.json(
      { error: "Erreur serveur lors du traitement du virement (DB)." },
      { status: 500 }
    );
  }
}
