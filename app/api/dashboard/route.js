import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();

    // User info
    const [users] = await db.execute(
      'SELECT id, email, full_name FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (users.length === 0) {
      await db.end();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];

    // Account info
    const [accounts] = await db.execute(
      'SELECT id, account_number, balance, currency FROM accounts WHERE user_id = ? LIMIT 1',
      [userId]
    );

    if (accounts.length === 0) {
      await db.end();
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const account = accounts[0];

    // Dernières 10 transactions AVEC référence style 7053-13
    const [transactions] = await db.execute(
      `SELECT 
         id,
         type,
         amount,
         description,
         counterparty_name,
         created_at,
         CONCAT(RIGHT(?, 4), '-', id) AS reference
       FROM transactions
       WHERE account_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [account.account_number, account.id]
    );

    // Virements en attente
    const [pendingTransfers] = await db.execute(
      'SELECT COUNT(*) as count, SUM(amount) as total FROM pending_transactions WHERE account_id = ? AND status = "PENDING"',
      [account.id]
    );

    // Carte (si existe)
    const [cards] = await db.execute(
      'SELECT id, card_number, expiry_date, cardholder_name, status FROM cards WHERE account_id = ? AND status != "DELETED" LIMIT 1',
      [account.id]
    );

    await db.end();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
      },
      account: {
        id: account.id,
        accountNumber: String(account.account_number),
        balance: Number(account.balance),
        currency: account.currency,
      },
      transactions: transactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount: Number(tx.amount),
        description: tx.description,
        counterparty_name: tx.counterparty_name,
        created_at: tx.created_at,
        reference: tx.reference,
      })),
      pending: {
        count: pendingTransfers[0].count || 0,
        total: pendingTransfers[0].total || 0,
      },
      card:
        cards.length > 0
          ? {
              id: cards[0].id,
              cardNumber: cards[0].card_number,
              expiryDate: cards[0].expiry_date,
              cardholderName: cards[0].cardholder_name,
              status: cards[0].status,
            }
          : null,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
