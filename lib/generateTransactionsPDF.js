// lib/generateTransactionsPDF.js
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

export function generateTransactionsPDF(transactions, options = {}) {
  const {
    fullName = "",
    email = "",
    accountNumber = "",
    balance = null,
    currency = "EUR",
  } = options;

  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Bandeau haut
  doc.setFillColor(33, 128, 141);
  doc.rect(0, 0, pageWidth, 80, "F");

  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("OLAKRED", 40, 50);

  // Infos banque
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  let yPos = 25;
  ["OLAKRED", "123 Avenue du Général", "Paris, France", "contact@olakred.com"].forEach(
    (line) => {
      doc.text(line, pageWidth - 40, yPos, { align: "right" });
      yPos += 12;
    }
  );

  // Infos client / compte
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Relevé de compte", 40, 110);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  if (fullName || email) {
    doc.text(`Client : ${fullName || email}`, 40, 130);
  }
  if (accountNumber) {
    doc.text(`Compte N° : ${accountNumber}`, 40, 145);
  }
  if (balance != null) {
    doc.text(
      `Solde actuel : ${Number(balance).toFixed(2)} ${currency}`,
      40,
      160
    );
  }
  doc.text(
    `Date d'édition : ${new Date().toLocaleDateString("fr-FR")}`,
    40,
    175
  );

  const tableData = (transactions || []).map((tx) => {
    const date = new Date(tx.created_at).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const type = tx.type === "CREDIT" ? "Crédit" : "Débit";
    const montant = `${tx.type === "CREDIT" ? "+" : "-"}${Number(
      tx.amount
    ).toFixed(2)} ${currency}`;
    const libelle = tx.counterparty_name || tx.description || "—";
    return [date, type, libelle, montant, tx.reference || tx.id];
  });

  // ⬇️ Utiliser la fonction autoTable au lieu de doc.autoTable
  autoTable(doc, {
    startY: 195,
    head: [["Date", "Type", "Libellé", "Montant", "Réf."]],
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
    "Ce document est un relevé officiel. Pour toute question, contactez votre conseiller.",
    40,
    finalY + 30,
    { maxWidth: pageWidth - 80 }
  );
  doc.text(
    "Olakred SA - Capital social : 50 000 000 EUR - RCS Paris B 123 456 789",
    pageWidth / 2,
    pageHeight - 30,
    { align: "center" }
  );

  const fileName = `Releve_${accountNumber || "compte"}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);
}
