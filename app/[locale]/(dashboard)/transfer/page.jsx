"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

function SummaryModal({
  open,
  values,
  balance,
  onBack,
  onConfirm,
  loading,
  error,
}) {
  if (!open) return null;

  const amountNumber = Number(values.amount || 0);
  const insufficient =
    isNaN(amountNumber) || amountNumber <= 0 || amountNumber > balance;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/75">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <p className="text-xs font-medium text-gray-700">
                Traitement du virement…
              </p>
            </div>
          </div>
        )}

        <h2 className="mb-4 text-lg font-semibold">Résumé du virement</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Titulaire</span>
            <span className="font-medium">{values.holder || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">IBAN</span>
            <span className="font-medium break-all">
              {values.iban || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">BIC</span>
            <span className="font-medium">{values.bic || "—"}</span>
          </div>
          <div className="flex justify-between">
  <span className="text-gray-500">Banque</span>
  <span className="font-medium">{values.bankName || "—"}</span>
</div>

          <div className="flex justify-between">
            <span className="text-gray-500">Montant</span>
            <span className="font-medium">
              {values.amount ? `${values.amount} EUR` : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Motif</span>
            <span className="font-medium">{values.reason || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Pays</span>
            <span className="font-medium">{values.country || "—"}</span>
          </div>
          <div className="mt-3 border-t pt-3 text-xs text-gray-500">
            Solde disponible:{" "}
            <span className="font-semibold text-gray-800">
              {balance.toFixed(2)} EUR
            </span>
          </div>
          {insufficient && (
            <p className="mt-2 text-xs text-red-600">
              Solde insuffisant ou montant invalide. Merci de corriger avant de
              valider.
            </p>
          )}
          {error && (
            <p className="mt-2 text-xs text-red-600">{error}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Retour
          </button>
<button
  type="button"
  onClick={onConfirm}
  disabled={loading || insufficient}
  className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600 active:bg-rose-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
>
  {loading ? "Validation…" : "Valider le virement"}
</button>

        </div>
      </div>
    </div>
  );
}

export default function TransferPage() {
  const params = useParams();
  const locale = params.locale || "fr";
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState("EUR");

  const [values, setValues] = useState({
    holder: "",
    iban: "",
    bic: "",
    amount: "",
    reason: "",
    country: "",
    bankName: "", 
  });

  const [showSummary, setShowSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) return;
        const data = await res.json();
        setBalance(Number(data.account.balance) || 0);
        setCurrency(data.account.currency || "EUR");
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (
      !values.holder ||
      !values.iban ||
      !values.bic ||
      !values.amount ||
      !values.country ||
      !values.bankName
    ) {
      setFormError("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    const amountNumber = Number(values.amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setFormError("Le montant doit être un nombre strictement positif.");
      return;
    }

    if (amountNumber > balance) {
      setFormError("Solde insuffisant pour effectuer ce virement.");
      return;
    }

    setShowSummary(true);
  };

const handleConfirm = async () => {
  setSubmitting(true);
  setModalError(null);

  try {
    const res = await fetch("/api/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(
        data?.error || data?.message || "Une erreur inconnue est survenue."
      );
    }

    if (typeof data.newBalance === "number") {
      setBalance(data.newBalance);
    }

    setShowSummary(false);
    setSuccessMessage(
      data?.message ||
        "Virement enregistré. Un e‑mail de confirmation vous sera envoyé."
    );
    setValues({
      holder: "",
      iban: "",
      bic: "",
      amount: "",
      reason: "",
      country: "",
      bankName: "",
    });

    // ✅ Succès : redirection vers dashboard après 1s
    setTimeout(() => {
      window.location.href = `/${locale}/dashboard`; 
    }, 1000);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur réseau.";
    setModalError(msg);
    // ❌ Echec : on ne bouge pas, l’utilisateur reste sur /transfer
  } finally {
    setSubmitting(false);
  }
};


  return (
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="py-2">
          <h1 className="text-2xl font-semibold">Virement</h1>
          <p className="mt-1 text-sm text-gray-500">
            Effectuez un virement vers un bénéficiaire externe.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Solde disponible:{" "}
            <span className="font-semibold text-gray-800">
              {balance.toFixed(2)} {currency}
            </span>
          </p>
        </header>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl bg-white p-6 shadow-sm"
        >
          {formError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {formError}
            </p>
          )}
          {successMessage && (
            <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
              {successMessage}
            </p>
          )}

          <div className="space-y-4">
            {/* Titulaire */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Titulaire
              </label>
              <input
                type="text"
                value={values.holder}
                onChange={handleChange("holder")}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
                placeholder="Nom complet du bénéficiaire"
              />
            </div>

            {/* IBAN */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                IBAN
              </label>
              <input
                type="text"
                value={values.iban}
                onChange={handleChange("iban")}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
                placeholder="FR76 3000 ..."
              />
            </div>

            {/* BIC */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                BIC
              </label>
              <input
                type="text"
                value={values.bic}
                onChange={handleChange("bic")}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
                placeholder="ABCDEFGHXXX"
              />
            </div>

            {/* Bank name */}
<div>
  <label className="mb-1 block text-xs font-medium text-gray-700">
    Banque
  </label>
  <input
    type="text"
    value={values.bankName}
    onChange={handleChange("bankName")}
    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
    placeholder="Nom de la banque du bénéficiaire"
  />
</div>


            {/* Montant */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Montant
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={values.amount}
                onChange={handleChange("amount")}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
                placeholder="0.00"
              />
            </div>

            {/* Motif */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Motif
              </label>
              <input
                type="text"
                value={values.reason}
                onChange={handleChange("reason")}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
                placeholder="Facture, loyer, remboursement..."
              />
            </div>

            {/* Pays */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Pays
              </label>
              <input
                type="text"
                value={values.country}
                onChange={handleChange("country")}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
                placeholder="France, Belgique, ..."
              />
            </div>
          </div>

          <div className="pt-2">
<button
  type="submit"
  className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
>
  Continuer
</button>

          </div>
        </form>

        <SummaryModal
          open={showSummary}
          values={values}
          balance={balance}
          onBack={() => setShowSummary(false)}
          onConfirm={handleConfirm}
          loading={submitting}
          error={modalError}
        />
      </main>
  );
}
