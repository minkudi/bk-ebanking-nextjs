import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import nodemailer from 'nodemailer';

// Templates d'email multilingues
const emailTemplates = {
  fr: {
    subject: 'Bienvenue sur BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Bonjour ${fullName},\n\nVotre compte e‑banking a été créé.\n\nNuméro de compte : ${accountNumber}\n\n(Environnement de test)`,
    html: (fullName, accountNumber) =>
      `<p>Bonjour ${fullName},</p><p>Votre compte e‑banking a été créé.</p><p><strong>Numéro de compte :</strong> ${accountNumber}</p><p><em>(Environnement de test)</em></p>`,
  },
  en: {
    subject: 'Welcome to BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Hello ${fullName},\n\nYour e-banking account has been created.\n\nAccount number: ${accountNumber}\n\n(Test environment)`,
    html: (fullName, accountNumber) =>
      `<p>Hello ${fullName},</p><p>Your e-banking account has been created.</p><p><strong>Account number:</strong> ${accountNumber}</p><p><em>(Test environment)</em></p>`,
  },
  de: {
    subject: 'Willkommen bei BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Hallo ${fullName},\n\nIhr E-Banking-Konto wurde erstellt.\n\nKontonummer: ${accountNumber}\n\n(Testumgebung)`,
    html: (fullName, accountNumber) =>
      `<p>Hallo ${fullName},</p><p>Ihr E-Banking-Konto wurde erstellt.</p><p><strong>Kontonummer:</strong> ${accountNumber}</p><p><em>(Testumgebung)</em></p>`,
  },
  nl: {
    subject: 'Welkom bij BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Hallo ${fullName},\n\nUw e-banking account is aangemaakt.\n\nRekeningnummer: ${accountNumber}\n\n(Testomgeving)`,
    html: (fullName, accountNumber) =>
      `<p>Hallo ${fullName},</p><p>Uw e-banking account is aangemaakt.</p><p><strong>Rekeningnummer:</strong> ${accountNumber}</p><p><em>(Testomgeving)</em></p>`,
  },
  fi: {
    subject: 'Tervetuloa BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Hei ${fullName},\n\nE-banking-tilisi on luotu.\n\nTilinumero: ${accountNumber}\n\n(Testiympäristö)`,
    html: (fullName, accountNumber) =>
      `<p>Hei ${fullName},</p><p>E-banking-tilisi on luotu.</p><p><strong>Tilinumero:</strong> ${accountNumber}</p><p><em>(Testiympäristö)</em></p>`,
  },
  es: {
    subject: 'Bienvenido a BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Hola ${fullName},\n\nSu cuenta de e-banking ha sido creada.\n\nNúmero de cuenta: ${accountNumber}\n\n(Entorno de prueba)`,
    html: (fullName, accountNumber) =>
      `<p>Hola ${fullName},</p><p>Su cuenta de e-banking ha sido creada.</p><p><strong>Número de cuenta:</strong> ${accountNumber}</p><p><em>(Entorno de prueba)</em></p>`,
  },
  pl: {
    subject: 'Witamy w BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Witaj ${fullName},\n\nTwoje konto e-banking zostało utworzone.\n\nNumer konta: ${accountNumber}\n\n(Środowisko testowe)`,
    html: (fullName, accountNumber) =>
      `<p>Witaj ${fullName},</p><p>Twoje konto e-banking zostało utworzone.</p><p><strong>Numer konta:</strong> ${accountNumber}</p><p><em>(Środowisko testowe)</em></p>`,
  },
  pt: {
    subject: 'Bem-vindo ao BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Olá ${fullName},\n\nSua conta de e-banking foi criada.\n\nNúmero da conta: ${accountNumber}\n\n(Ambiente de teste)`,
    html: (fullName, accountNumber) =>
      `<p>Olá ${fullName},</p><p>Sua conta de e-banking foi criada.</p><p><strong>Número da conta:</strong> ${accountNumber}</p><p><em>(Ambiente de teste)</em></p>`,
  },
  sk: {
    subject: 'Vitajte v BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Ahoj ${fullName},\n\nVáš účet e-banking bol vytvorený.\n\nČíslo účtu: ${accountNumber}\n\n(Testové prostredie)`,
    html: (fullName, accountNumber) =>
      `<p>Ahoj ${fullName},</p><p>Váš účet e-banking bol vytvorený.</p><p><strong>Číslo účtu:</strong> ${accountNumber}</p><p><em>(Testové prostredie)</em></p>`,
  },
  bg: {
    subject: 'Добре дошли в BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Здравей ${fullName},\n\nВашият акаунт за електронно банкиране беше създаден.\n\nНомер на сметка: ${accountNumber}\n\n(Тестова среда)`,
    html: (fullName, accountNumber) =>
      `<p>Здравей ${fullName},</p><p>Вашият акаунт за електронно банкиране беше създаден.</p><p><strong>Номер на сметка:</strong> ${accountNumber}</p><p><em>(Тестова среда)</em></p>`,
  },
  el: {
    subject: 'Καλώς ήρθατε στο BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Γεια σου ${fullName},\n\nΟ λογαριασμός σας e-banking έχει δημιουργηθεί.\n\nΑριθμός λογαριασμού: ${accountNumber}\n\n(Περιβάλλον δοκιμών)`,
    html: (fullName, accountNumber) =>
      `<p>Γεια σου ${fullName},</p><p>Ο λογαριασμός σας e-banking έχει δημιουργηθεί.</p><p><strong>Αριθμός λογαριασμού:</strong> ${accountNumber}</p><p><em>(Περιβάλλον δοκιμών)</em></p>`,
  },
  sl: {
    subject: 'Dobrodošli v BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Pozdravljeni ${fullName},\n\nVaš račun za e-banking je bil ustvarjen.\n\nŠtevilka računa: ${accountNumber}\n\n(Testno okolje)`,
    html: (fullName, accountNumber) =>
      `<p>Pozdravljeni ${fullName},</p><p>Vaš račun za e-banking je bil ustvarjen.</p><p><strong>Številka računa:</strong> ${accountNumber}</p><p><em>(Testno okolje)</em></p>`,
  },
  lt: {
    subject: 'Sveiki atvykę į BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Sveiki ${fullName},\n\nJūsų e-banking paskyra buvo sukurta.\n\nSąskaitos numeris: ${accountNumber}\n\n(Testavimo aplinka)`,
    html: (fullName, accountNumber) =>
      `<p>Sveiki ${fullName},</p><p>Jūsų e-banking paskyra buvo sukurta.</p><p><strong>Sąskaitos numeris:</strong> ${accountNumber}</p><p><em>(Testavimo aplinka)</em></p>`,
  },
  lv: {
    subject: 'Laipni lūdzam BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Sveiki ${fullName},\n\nJūsu e-banking konts ir izveidots.\n\nKonta numurs: ${accountNumber}\n\n(Testa vide)`,
    html: (fullName, accountNumber) =>
      `<p>Sveiki ${fullName},</p><p>Jūsu e-banking konts ir izveidots.</p><p><strong>Konta numurs:</strong> ${accountNumber}</p><p><em>(Testa vide)</em></p>`,
  },
  it: {
    subject: 'Benvenuto su BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Ciao ${fullName},\n\nIl tuo account e-banking è stato creato.\n\nNumero di conto: ${accountNumber}\n\n(Ambiente di test)`,
    html: (fullName, accountNumber) =>
      `<p>Ciao ${fullName},</p><p>Il tuo account e-banking è stato creato.</p><p><strong>Numero di conto:</strong> ${accountNumber}</p><p><em>(Ambiente di test)</em></p>`,
  },
  cs: {
    subject: 'Vítejte v BK e‑Banking',
    text: (fullName, accountNumber) =>
      `Ahoj ${fullName},\n\nVáš účet e-banking byl vytvořen.\n\nČíslo účtu: ${accountNumber}\n\n(Testovací prostředí)`,
    html: (fullName, accountNumber) =>
      `<p>Ahoj ${fullName},</p><p>Váš účet e-banking byl vytvořen.</p><p><strong>Číslo účtu:</strong> ${accountNumber}</p><p><em>(Testovací prostředí)</em></p>`,
  },
};

async function sendWelcomeEmail(to, fullName, accountNumber, locale = 'fr') {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const template = emailTemplates[locale] || emailTemplates.fr;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: template.subject,
    text: template.text(fullName, accountNumber),
    html: template.html(fullName, accountNumber),
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      fullName,
      address,
      birthDate,
      country,
      phone,
      gender,
      email,
      password,
      confirmPassword,
      locale,
    } = body;

    if (
      !fullName ||
      !address ||
      !birthDate ||
      !country ||
      !phone ||
      !gender ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Email déjà utilisé ?
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (existing.length > 0) {
      await db.end();
      return NextResponse.json(
        { error: 'Email already used' },
        { status: 400 }
      );
    }

    // Création utilisateur (mot de passe en clair pour DEV UNIQUEMENT)
    const [resultUser] = await db.execute(
      `
        INSERT INTO users (email, password, full_name, address, birth_date, country, phone, gender)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [email, password, fullName, address, birthDate, country, phone, gender]
    );
    const userId = resultUser.insertId;

    // Numéro de compte sans préfixe BK
    const accountNumber = `${Date.now()}`;

    await db.execute(
      'INSERT INTO accounts (user_id, account_number, balance, currency) VALUES (?, ?, ?, ?)',
      [userId, accountNumber, 0, 'EUR']
    );

    await db.end();

    // Envoi de l'email dans la bonne langue
    try {
      await sendWelcomeEmail(email, fullName, accountNumber, locale);
    } catch (e) {
      console.error('Email error', e);
    }

    return NextResponse.json(
      { success: true, userId, accountNumber },
      { status: 201 }
    );
  } catch (err) {
    console.error('REGISTER ERROR', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
