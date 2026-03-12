// lib/smsTemplates.js

export function buildDebitSms({ locale, amount, currency, accountNumber, transactionId }) {
  const amt = Number(amount).toFixed(2);
  const ref = transactionId;
  const acct = accountNumber;

  const templates = {
    fr: `[OLAKRED] Debit: -${amt} ${currency} | Cpte: ${acct} | Ref: ${ref}`,
    en: `[OLAKRED] Debit: -${amt} ${currency} | Acct: ${acct} | Ref: ${ref}`,
    de: `[OLAKRED] Lastschrift: -${amt} ${currency} | Kto: ${acct} | Ref: ${ref}`,
    nl: `[OLAKRED] Debet: -${amt} ${currency} | Rek: ${acct} | Ref: ${ref}`,
    fi: `[OLAKRED] Debet: -${amt} ${currency} | Tili: ${acct} | Ref: ${ref}`,
    es: `[OLAKRED] Debito: -${amt} ${currency} | Cta: ${acct} | Ref: ${ref}`,
    pt: `[OLAKRED] Debito: -${amt} ${currency} | Cta: ${acct} | Ref: ${ref}`,
    pl: `[OLAKRED] Debet: -${amt} ${currency} | Kto: ${acct} | Ref: ${ref}`,
    sk: `[OLAKRED] Debet: -${amt} ${currency} | Ucet: ${acct} | Ref: ${ref}`,
    bg: `[OLAKRED] Debit: -${amt} ${currency} | Smt: ${acct} | Ref: ${ref}`,
    el: `[OLAKRED] Xrewsh: -${amt} ${currency} | Log: ${acct} | Ref: ${ref}`,
    sl: `[OLAKRED] Bremenitev: -${amt} ${currency} | Racun: ${acct} | Ref: ${ref}`,
    lt: `[OLAKRED] Debetas: -${amt} ${currency} | Sask: ${acct} | Ref: ${ref}`,
    lv: `[OLAKRED] Debets: -${amt} ${currency} | Konts: ${acct} | Ref: ${ref}`,
    it: `[OLAKRED] Addebito: -${amt} ${currency} | Conto: ${acct} | Ref: ${ref}`,
    cs: `[OLAKRED] Debet: -${amt} ${currency} | Ucet: ${acct} | Ref: ${ref}`,
  };

  return templates[locale] || templates.fr;
}

export function buildCreditSms({ locale, amount, currency, accountNumber, transactionId }) {
  const amt = Number(amount).toFixed(2);
  const ref = transactionId;
  const acct = accountNumber;

  const templates = {
    fr: `[OLAKRED] Credit: +${amt} ${currency} | Cpte: ${acct} | Ref: ${ref}`,
    en: `[OLAKRED] Credit: +${amt} ${currency} | Acct: ${acct} | Ref: ${ref}`,
    de: `[OLAKRED] Gutschrift: +${amt} ${currency} | Kto: ${acct} | Ref: ${ref}`,
    nl: `[OLAKRED] Credit: +${amt} ${currency} | Rek: ${acct} | Ref: ${ref}`,
    fi: `[OLAKRED] Krediitti: +${amt} ${currency} | Tili: ${acct} | Ref: ${ref}`,
    es: `[OLAKRED] Credito: +${amt} ${currency} | Cta: ${acct} | Ref: ${ref}`,
    pt: `[OLAKRED] Credito: +${amt} ${currency} | Cta: ${acct} | Ref: ${ref}`,
    pl: `[OLAKRED] Uznanie: +${amt} ${currency} | Kto: ${acct} | Ref: ${ref}`,
    sk: `[OLAKRED] Kredit: +${amt} ${currency} | Ucet: ${acct} | Ref: ${ref}`,
    bg: `[OLAKRED] Kredit: +${amt} ${currency} | Smt: ${acct} | Ref: ${ref}`,
    el: `[OLAKRED] Pistwsh: +${amt} ${currency} | Log: ${acct} | Ref: ${ref}`,
    sl: `[OLAKRED] Dobropis: +${amt} ${currency} | Racun: ${acct} | Ref: ${ref}`,
    lt: `[OLAKRED] Kreditas: +${amt} ${currency} | Sask: ${acct} | Ref: ${ref}`,
    lv: `[OLAKRED] Kredits: +${amt} ${currency} | Konts: ${acct} | Ref: ${ref}`,
    it: `[OLAKRED] Accredito: +${amt} ${currency} | Conto: ${acct} | Ref: ${ref}`,
    cs: `[OLAKRED] Kredit: +${amt} ${currency} | Ucet: ${acct} | Ref: ${ref}`,
  };

  return templates[locale] || templates.fr;
}
