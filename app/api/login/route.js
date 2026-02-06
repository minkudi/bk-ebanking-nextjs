import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const db = await getDb();

    // Vérifier user (mot de passe en clair pour DEV)
    const [users] = await db.execute(
      'SELECT id, email, full_name FROM users WHERE email = ? AND password = ? LIMIT 1',
      [email, password]
    );

    if (users.length === 0) {
      await db.end();
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];

    // Récupérer le compte
    const [accounts] = await db.execute(
      'SELECT account_number, balance FROM accounts WHERE user_id = ? LIMIT 1',
      [user.id]
    );

    await db.end();

    if (accounts.length === 0) {
      return NextResponse.json({ error: 'No account found' }, { status: 404 });
    }

    const account = accounts[0];

    // Créer session (cookie sécurisé)
    const cookieStore = await cookies();
    cookieStore.set('user_id', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        accountNumber: account.account_number,
        balance: account.balance,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
