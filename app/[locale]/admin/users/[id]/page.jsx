"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  BanknotesIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/outline";

export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";
  const userId = params.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [creditOpen, setCreditOpen] = useState(false);
  const [debitOpen, setDebitOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string } | null

  // édition profil
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    gender: "",
    birthDate: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        if (res.status === 401 || res.status === 403) {
          router.push(`/${locale}/login`);
          return;
        }
        const json = await res.json();
        setData(json);

        if (json.user) {
          setEditForm({
            fullName: json.user.fullName || "",
            email: json.user.email || "",
            phone: json.user.phone || "",
            country: json.user.country || "",
            gender: json.user.gender || "",
            birthDate: json.user.birthDate
              ? String(json.user.birthDate).substring(0, 10)
              : "",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router, locale, userId]);

  if (loading) return null;
  if (!data || !data.user) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/${locale}/admin/users`)}
              className="h-7 w-7 rounded-full border border-slate-200 text-slate-500 inline-flex items-center justify-center text-sm hover:bg-slate-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                Utilisateur introuvable
              </span>
              <span className="text-xs text-slate-400">
                L’utilisateur demandé n’existe pas ou a été supprimé.
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center text-sm text-slate-500">
            <p>Impossible de charger les informations de cet utilisateur.</p>
            <button
              onClick={() => router.push(`/${locale}/admin/users`)}
              className="mt-4 inline-flex items-center rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Retour à la liste des utilisateurs
            </button>
          </div>
        </main>
      </div>
    );
  }

  const user = data.user;
  const accounts = data.accounts || [];
  const transactions = data.transactions || [];
  const mainAccount = accounts.length > 0 ? accounts[0] : null;

  async function refreshUser() {
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      const json = await res.json();
      setData(json);
      if (json.user) {
        setEditForm({
          fullName: json.user.fullName || "",
          email: json.user.email || "",
          phone: json.user.phone || "",
          country: json.user.country || "",
          gender: json.user.gender || "",
          birthDate: json.user.birthDate
            ? String(json.user.birthDate).substring(0, 10)
            : "",
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function submitCredit() {
    if (!mainAccount) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/users/${userId}/credit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), label }),
      });
      const json = await res.json();
      if (!res.ok) {
        setToast({ type: "error", message: json.error || "Erreur crédit." });
        return;
      }
      setToast({ type: "success", message: "Crédit effectué avec succès." });
      setCreditOpen(false);
      setAmount("");
      setLabel("");
      await refreshUser();
    } catch (e) {
      console.error(e);
      setToast({ type: "error", message: "Erreur serveur." });
    } finally {
      setSaving(false);
    }
  }

  async function submitDebit() {
    if (!mainAccount) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/users/${userId}/debit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), label }),
      });
      const json = await res.json();
      if (!res.ok) {
        setToast({ type: "error", message: json.error || "Erreur débit." });
        return;
      }
      setToast({ type: "success", message: "Débit effectué avec succès." });
      setDebitOpen(false);
      setAmount("");
      setLabel("");
      await refreshUser();
    } catch (e) {
      console.error(e);
      setToast({ type: "error", message: "Erreur serveur." });
    } finally {
      setSaving(false);
    }
  }

  async function saveProfile() {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (!res.ok) {
        setToast({
          type: "error",
          message: json.error || "Erreur lors de la mise à jour du profil.",
        });
        return;
      }
      setToast({
        type: "success",
        message: "Profil mis à jour avec succès.",
      });
      setEditMode(false);
      await refreshUser();
    } catch (e) {
      console.error(e);
      setToast({ type: "error", message: "Erreur serveur." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/${locale}/admin/users`)}
            className="h-7 w-7 rounded-full border border-slate-200 text-slate-500 inline-flex items-center justify-center text-sm hover:bg-slate-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-medium">
              {user.fullName?.charAt(0) || "?"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                {user.fullName || "Utilisateur #" + user.id}
              </span>
              <span className="text-xs text-slate-400">
                ID #{user.id} • {user.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div className="px-4 lg:px-8 mt-2">
          <div
            className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-rose-50 text-rose-700 border border-rose-100"
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-3 text-[11px] text-slate-400 hover:text-slate-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 px-4 lg:px-8 py-6 space-y-6">
        {/* Ligne haute : infos + compte principal + actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Infos utilisateur (éditable) */}
          <section className="rounded-2xl bg-white border border-slate-100 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                Profil
              </h2>
              <button
                type="button"
                onClick={() => {
                  if (!editMode) {
                    setEditForm({
                      fullName: user.fullName || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      country: user.country || "",
                      gender: user.gender || "",
                      birthDate: user.birthDate
                        ? String(user.birthDate).substring(0, 10)
                        : "",
                    });
                  }
                  setEditMode((v) => !v);
                }}
                className="text-[11px] text-slate-500 hover:text-slate-700"
              >
                {editMode ? "Annuler" : "Modifier"}
              </button>
            </div>

            {!editMode ? (
              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  <span className="text-slate-400">Nom :</span>{" "}
                  {user.fullName || "—"}
                </p>
                <p>
                  <span className="text-slate-400">Email :</span>{" "}
                  {user.email || "—"}
                </p>
                <p>
                  <span className="text-slate-400">Téléphone :</span>{" "}
                  {user.phone || "—"}
                </p>
                <p>
                  <span className="text-slate-400">Pays :</span>{" "}
                  {user.country || "—"}
                </p>
                <p>
                  <span className="text-slate-400">Date de naissance :</span>{" "}
                  {user.birthDate
                    ? new Date(user.birthDate).toLocaleDateString("fr-FR")
                    : "—"}
                </p>
                <p>
                  <span className="text-slate-400">Rôle :</span>{" "}
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      user.isAdmin
                        ? "bg-rose-50 text-rose-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {user.isAdmin ? "Admin" : "Client"}
                  </span>
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <InputRow
                  label="Nom complet"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={setEditForm}
                />
                <InputRow
                  label="Email"
                  name="email"
                  value={editForm.email}
                  onChange={setEditForm}
                  type="email"
                />
                <InputRow
                  label="Téléphone"
                  name="phone"
                  value={editForm.phone}
                  onChange={setEditForm}
                />
                <InputRow
                  label="Pays"
                  name="country"
                  value={editForm.country}
                  onChange={setEditForm}
                />
                <InputRow
                  label="Date de naissance"
                  name="birthDate"
                  value={editForm.birthDate}
                  onChange={setEditForm}
                  type="date"
                />
                <div className="space-y-1">
                  <span className="block text-[11px] text-slate-500">
                    Genre
                  </span>
                  <div className="flex gap-3">
                    {["Male", "Female"].map((g) => (
                      <label
                        key={g}
                        className="inline-flex items-center gap-1 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={editForm.gender === g}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              gender: e.target.value,
                            }))
                          }
                        />
                        <span>{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-3 py-1.5 rounded-full border border-slate-200 text-[11px] text-slate-600 hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={saveProfile}
                    className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-medium hover:bg-slate-800 disabled:opacity-50"
                  >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Compte principal */}
          <section className="rounded-2xl bg-white border border-slate-100 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                Compte principal
              </h2>
              <span className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-600 inline-flex items-center justify-center">
                <BanknotesIcon className="h-4 w-4" />
              </span>
            </div>
            {mainAccount ? (
              <div className="space-y-1 text-xs">
                <p className="text-slate-400">Numéro de compte</p>
                <p className="font-mono text-slate-900">
                  {mainAccount.accountNumber}
                </p>
                <p className="mt-2 text-slate-400">Solde</p>
                <p className="text-lg font-semibold text-slate-900">
                  {Number(mainAccount.balance).toFixed(2)}{" "}
                  {mainAccount.currency}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Aucun compte trouvé.</p>
            )}
          </section>

          {/* Actions rapides */}
          <section className="rounded-2xl bg-white border border-slate-100 px-5 py-4 space-y-3">
            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
              Actions rapides
            </h2>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={!mainAccount}
                onClick={() => {
                  setAmount("");
                  setLabel("");
                  setCreditOpen(true);
                }}
                className="inline-flex items-center justify-between rounded-full border border-emerald-500 text-emerald-600 px-3 py-1.5 text-[11px] font-medium hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center gap-1">
                  <ArrowDownCircleIcon className="h-4 w-4" />
                  Créditer le compte
                </span>
                <span className="text-[9px] uppercase tracking-wide">
                  action
                </span>
              </button>
              <button
                type="button"
                disabled={!mainAccount}
                onClick={() => {
                  setAmount("");
                  setLabel("");
                  setDebitOpen(true);
                }}
                className="inline-flex items-center justify-between rounded-full border border-rose-500 text-rose-600 px-3 py-1.5 text-[11px] font-medium hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center gap-1">
                  <ArrowUpCircleIcon className="h-4 w-4" />
                  Débiter le compte
                </span>
                <span className="text-[9px] uppercase tracking-wide">
                  action
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* Transactions récentes */}
        <section className="rounded-2xl bg-white border border-slate-100 px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Transactions récentes
            </h2>
            <span className="text-xs text-slate-400">
              {transactions.length} opérations
            </span>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-left text-[11px] text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Libellé</th>
                  <th className="py-2 pr-4 font-medium text-right">Montant</th>
                  <th className="py-2 pl-4 font-medium text-right">
                    Référence
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80">
                    <td className="py-2 pr-4 whitespace-nowrap text-slate-500">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap text-slate-500">
                      {tx.type === "CREDIT" ? "Crédit" : "Débit"}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap text-slate-600">
                      {tx.description || "—"}
                    </td>
                    <td
                      className={`py-2 pr-4 whitespace-nowrap text-right font-semibold ${
                        tx.type === "CREDIT"
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                    >
                      {`${tx.type === "CREDIT" ? "+" : "-"}${Number(
                        tx.amount
                      ).toFixed(2)} EUR`}
                    </td>
                    <td className="py-2 pl-4 whitespace-nowrap text-right text-[11px] text-slate-500 font-mono">
                      {tx.id}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-3 text-center text-xs text-slate-400"
                    >
                      Aucune transaction pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Modale Crédit */}
      {creditOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-lg border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Créditer le compte
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Montant
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Libellé
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Ex: Ajustement solde, bonus, etc."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!saving) {
                    setCreditOpen(false);
                  }
                }}
                className="px-3 py-1.5 text-[11px] rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={saving || !amount}
                onClick={submitCredit}
                className="px-3 py-1.5 text-[11px] rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "En cours..." : "Valider le crédit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Débit */}
      {debitOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-lg border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Débiter le compte
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Montant
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Libellé
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                  placeholder="Ex: Correction, retrait manuel, etc."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!saving) {
                    setDebitOpen(false);
                  }
                }}
                className="px-3 py-1.5 text-[11px] rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={saving || !amount}
                onClick={submitDebit}
                className="px-3 py-1.5 text-[11px] rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "En cours..." : "Valider le débit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InputRow({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-[11px] text-slate-500 mb-0.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange((f) => ({
            ...f,
            [name]: e.target.value,
          }))
        }
        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  );
}
