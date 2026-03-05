// lib/generateTransactionsPDF.js
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const translations = {
  fr: {
    statementTitle: "Relevé de compte",
    client: "Client",
    accountNo: "Compte N°",
    currentBalance: "Solde actuel",
    issueDate: "Date d'édition",
    tableHeaders: ["Date", "Type", "Libellé", "Montant", "Réf."],
    credit: "Crédit",
    debit: "Débit",
    footer: "Ce document est un relevé officiel. Pour toute question, contactez votre conseiller.",
    legalFooter: "Olakred SA - Capital social : 50 000 000 EUR - RCS Paris B 123 456 789",
    fileName: "Releve"
  },
  en: {
    statementTitle: "Account Statement",
    client: "Client",
    accountNo: "Account No",
    currentBalance: "Current Balance",
    issueDate: "Issue Date",
    tableHeaders: ["Date", "Type", "Description", "Amount", "Ref."],
    credit: "Credit",
    debit: "Debit",
    footer: "This document is an official statement. For any questions, contact your advisor.",
    legalFooter: "Olakred SA - Share Capital: 50,000,000 EUR - Paris Trade Register B 123 456 789",
    fileName: "Statement"
  },
  de: {
    statementTitle: "Kontoauszug",
    client: "Kunde",
    accountNo: "Konto-Nr.",
    currentBalance: "Aktueller Saldo",
    issueDate: "Ausstellungsdatum",
    tableHeaders: ["Datum", "Art", "Bezeichnung", "Betrag", "Ref."],
    credit: "Gutschrift",
    debit: "Lastschrift",
    footer: "Dieses Dokument ist ein offizieller Kontoauszug. Bei Fragen wenden Sie sich bitte an Ihren Berater.",
    legalFooter: "Olakred SA - Aktienkapital: 50.000.000 EUR - Handelsregister Paris B 123 456 789",
    fileName: "Kontoauszug"
  },
  nl: {
    statementTitle: "Rekeningoverzicht",
    client: "Klant",
    accountNo: "Rekeningnummer",
    currentBalance: "Huidig saldo",
    issueDate: "Uitgiftedatum",
    tableHeaders: ["Datum", "Type", "Omschrijving", "Bedrag", "Ref."],
    credit: "Credit",
    debit: "Debet",
    footer: "Dit document is een officieel overzicht. Neem bij vragen contact op met uw adviseur.",
    legalFooter: "Olakred SA - Aandelenkapitaal: 50.000.000 EUR - Handelsregister Parijs B 123 456 789",
    fileName: "Overzicht"
  },
  es: {
    statementTitle: "Extracto de cuenta",
    client: "Cliente",
    accountNo: "Nº de cuenta",
    currentBalance: "Saldo actual",
    issueDate: "Fecha de emisión",
    tableHeaders: ["Fecha", "Tipo", "Descripción", "Importe", "Ref."],
    credit: "Crédito",
    debit: "Débito",
    footer: "Este documento es un extracto oficial. Para cualquier duda, contacte con su asesor.",
    legalFooter: "Olakred SA - Capital social: 50.000.000 EUR - Registro Mercantil París B 123 456 789",
    fileName: "Extracto"
  },
  it: {
    statementTitle: "Estratto conto",
    client: "Cliente",
    accountNo: "N° di conto",
    currentBalance: "Saldo attuale",
    issueDate: "Data di emissione",
    tableHeaders: ["Data", "Tipo", "Descrizione", "Importo", "Rif."],
    credit: "Accredito",
    debit: "Addebito",
    footer: "Questo documento è un estratto ufficiale. Per domande, contatti il suo consulente.",
    legalFooter: "Olakred SA - Capitale sociale: 50.000.000 EUR - Registro Imprese Parigi B 123 456 789",
    fileName: "Estratto"
  },
  pl: {
    statementTitle: "Wyciąg z konta",
    client: "Klient",
    accountNo: "Nr konta",
    currentBalance: "Aktualny stan",
    issueDate: "Data wystawienia",
    tableHeaders: ["Data", "Typ", "Opis", "Kwota", "Ref."],
    credit: "Wpłata",
    debit: "Wypłata",
    footer: "Niniejszy dokument jest oficjalnym wyciągiem. W razie pytań prosimy o kontakt z doradcą.",
    legalFooter: "Olakred SA - Kapitał zakładowy: 50 000 000 EUR - Rejestr Handlowy Paryż B 123 456 789",
    fileName: "Wyciag"
  },
  pt: {
    statementTitle: "Extrato de conta",
    client: "Cliente",
    accountNo: "N.º de conta",
    currentBalance: "Saldo atual",
    issueDate: "Data de emissão",
    tableHeaders: ["Data", "Tipo", "Descrição", "Montante", "Ref."],
    credit: "Crédito",
    debit: "Débito",
    footer: "Este documento é um extrato oficial. Para questões, contacte o seu consultor.",
    legalFooter: "Olakred SA - Capital social: 50.000.000 EUR - Registo Comercial Paris B 123 456 789",
    fileName: "Extrato"
  },
  fi: {
    statementTitle: "Tiliote",
    client: "Asiakas",
    accountNo: "Tilinumero",
    currentBalance: "Nykyinen saldo",
    issueDate: "Päiväys",
    tableHeaders: ["Päivä", "Tyyppi", "Kuvaus", "Summa", "Viite"],
    credit: "Hyvitys",
    debit: "Veloitus",
    footer: "Tämä asiakirja on virallinen tiliote. Kysymysten osalta ota yhteyttä neuvonantajaasi.",
    legalFooter: "Olakred SA - Osakepääoma: 50 000 000 EUR - Pariisi Kaupparekisteri B 123 456 789",
    fileName: "Tiliote"
  },
  sk: {
    statementTitle: "Výpis z účtu",
    client: "Klient",
    accountNo: "Číslo účtu",
    currentBalance: "Aktuálny zostatok",
    issueDate: "Dátum vydania",
    tableHeaders: ["Dátum", "Typ", "Popis", "Suma", "Ref."],
    credit: "Kredit",
    debit: "Debet",
    footer: "Tento dokument je oficiálny výpis. Pri otázkach kontaktujte svojho poradcu.",
    legalFooter: "Olakred SA - Základné imanie: 50 000 000 EUR - Obchodný register Paríž B 123 456 789",
    fileName: "Vypis"
  },
  bg: {
    statementTitle: "Извлечение от сметка",
    client: "Клиент",
    accountNo: "Номер на сметка",
    currentBalance: "Текущо салдо",
    issueDate: "Дата на издаване",
    tableHeaders: ["Дата", "Тип", "Описание", "Сума", "Реф."],
    credit: "Кредит",
    debit: "Дебит",
    footer: "Този документ е официално извлечение. За въпроси се свържете с вашия консултант.",
    legalFooter: "Olakred SA - Капитал: 50 000 000 EUR - Търговски регистър Париж B 123 456 789",
    fileName: "Izvlechenie"
  },
  el: {
    statementTitle: "Κατάσταση λογαριασμού",
    client: "Πελάτης",
    accountNo: "Αρ. λογαριασμού",
    currentBalance: "Τρέχον υπόλοιπο",
    issueDate: "Ημερομηνία έκδοσης",
    tableHeaders: ["Ημερομηνία", "Τύπος", "Περιγραφή", "Ποσό", "Αναφ."],
    credit: "Πίστωση",
    debit: "Χρέωση",
    footer: "Το έγγραφο αυτό είναι επίσημη κατάσταση. Για ερωτήσεις επικοινωνήστε με τον σύμβουλό σας.",
    legalFooter: "Olakred SA - Μετοχικό κεφάλαιο: 50.000.000 EUR - Εμπορικό Μητρώο Παρίσι B 123 456 789",
    fileName: "Katastasi"
  },
  sl: {
    statementTitle: "Izpisek računa",
    client: "Stranka",
    accountNo: "Številka računa",
    currentBalance: "Trenutno stanje",
    issueDate: "Datum izdaje",
    tableHeaders: ["Datum", "Vrsta", "Opis", "Znesek", "Ref."],
    credit: "Odobritev",
    debit: "Breme",
    footer: "Ta dokument je uradni izpisek. Za vprašanja se obrnite na svojega svetovalca.",
    legalFooter: "Olakred SA - Osnovni kapital: 50.000.000 EUR - Trgovinski register Pariz B 123 456 789",
    fileName: "Izpisek"
  },
  lt: {
    statementTitle: "Sąskaitos išrašas",
    client: "Klientas",
    accountNo: "Sąskaitos Nr.",
    currentBalance: "Dabartinis likutis",
    issueDate: "Išdavimo data",
    tableHeaders: ["Data", "Tipas", "Aprašymas", "Suma", "Nuor."],
    credit: "Kreditas",
    debit: "Debetas",
    footer: "Šis dokumentas yra oficialus išrašas. Klausimų atveju kreipkitės į savo patarėją.",
    legalFooter: "Olakred SA - Įstatinis kapitalas: 50 000 000 EUR - Paryžiaus Prekybos Registras B 123 456 789",
    fileName: "Israsas"
  },
  lv: {
    statementTitle: "Konta izraksts",
    client: "Klients",
    accountNo: "Konta Nr.",
    currentBalance: "Pašreizējais atlikums",
    issueDate: "Izdošanas datums",
    tableHeaders: ["Datums", "Tips", "Apraksts", "Summa", "Ats."],
    credit: "Kredīts",
    debit: "Debets",
    footer: "Šis dokuments ir oficiāls izraksts. Jautājumu gadījumā sazinieties ar savu konsultantu.",
    legalFooter: "Olakred SA - Pamatkapitāls: 50 000 000 EUR - Parīzes Komercreģistrs B 123 456 789",
    fileName: "Izraksts"
  },
  cs: {
    statementTitle: "Výpis z účtu",
    client: "Klient",
    accountNo: "Číslo účtu",
    currentBalance: "Aktuální zůstatek",
    issueDate: "Datum vydání",
    tableHeaders: ["Datum", "Typ", "Popis", "Částka", "Ref."],
    credit: "Kredit",
    debit: "Debet",
    footer: "Tento dokument je oficiální výpis. V případě dotazů kontaktujte svého poradce.",
    legalFooter: "Olakred SA - Základní kapitál: 50 000 000 EUR - Obchodní rejstřík Paříž B 123 456 789",
    fileName: "Vypis"
  }
};

const localeToDateFormat = {
  fr: "fr-FR",
  en: "en-GB",
  de: "de-DE",
  nl: "nl-NL",
  es: "es-ES",
  it: "it-IT",
  pl: "pl-PL",
  pt: "pt-PT",
  fi: "fi-FI",
  sk: "sk-SK",
  bg: "bg-BG",
  el: "el-GR",
  sl: "sl-SI",
  lt: "lt-LT",
  lv: "lv-LV",
  cs: "cs-CZ"
};

export function generateTransactionsPDF(transactions, options = {}) {
  const {
    fullName = "",
    email = "",
    accountNumber = "",
    balance = null,
    currency = "EUR",
    locale = "fr" 
  } = options;


  const t = translations[locale] || translations.fr;
  const dateLocale = localeToDateFormat[locale] || "fr-FR";

  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();


  doc.setFillColor(33, 128, 141);
  doc.rect(0, 0, pageWidth, 80, "F");

  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("OLAKRED", 40, 50);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  let yPos = 25;
  ["OLAKRED", "123 Avenue du Général", "Paris, France", "contact@olakred.com"].forEach(
    (line) => {
      doc.text(line, pageWidth - 40, yPos, { align: "right" });
      yPos += 12;
    }
  );

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(t.statementTitle, 40, 110);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  if (fullName || email) {
    doc.text(`${t.client} : ${fullName || email}`, 40, 130);
  }
  if (accountNumber) {
    doc.text(`${t.accountNo} : ${accountNumber}`, 40, 145);
  }
  if (balance != null) {
    doc.text(
      `${t.currentBalance} : ${Number(balance).toFixed(2)} ${currency}`,
      40,
      160
    );
  }
  doc.text(
    `${t.issueDate} : ${new Date().toLocaleDateString(dateLocale)}`,
    40,
    175
  );

  const tableData = (transactions || []).map((tx) => {
    const date = new Date(tx.created_at).toLocaleDateString(dateLocale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const type = tx.type === "CREDIT" ? t.credit : t.debit;
    const montant = `${tx.type === "CREDIT" ? "+" : "-"}${Number(
      tx.amount
    ).toFixed(2)} ${currency}`;
    const libelle = tx.counterparty_name || tx.description || "—";
    return [date, type, libelle, montant, tx.reference || tx.id];
  });

  autoTable(doc, {
    startY: 195,
    head: [t.tableHeaders],
    body: tableData,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 5 },
    headStyles: {
      fillColor: [33, 128, 141],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 50 },
      2: { cellWidth: 210 },
      3: { cellWidth: 90, halign: "right" },
      4: { cellWidth: 60, halign: "right" },
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  const finalY = doc.lastAutoTable?.finalY || 400;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    t.footer,
    40,
    finalY + 30,
    { maxWidth: pageWidth - 80 }
  );
  doc.text(
    t.legalFooter,
    pageWidth / 2,
    pageHeight - 30,
    { align: "center" }
  );

  const fileName = `${t.fileName}_${accountNumber || "compte"}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);
}
