"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";
  const t = useTranslations("profile");

  const [data, setData] = useState(null);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [message, setMessage] = useState("");

  const [info, setInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
  });

  const [prefs, setPrefs] = useState({
    language: "fr",
    dateFormat: "DD/MM/YYYY",
  });

  const [pwd, setPwd] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/profile");
        if (res.status === 401) {
          router.push(`/${locale}/login`);
          return;
        }
        const json = await res.json();
        setData(json);
        setInfo({
          fullName: json.user.fullName || "",
          email: json.user.email || "",
          phone: json.user.phone || "",
          address: json.user.address || "",
          country: json.user.country || "",
        });
        setPrefs({
          language: json.preferences.language || "fr",
          dateFormat: json.preferences.dateFormat || "DD/MM/YYYY",
        });
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [router, locale]);

  if (!data) return null;

  async function saveInfo() {
    setSavingInfo(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: info.email,
          phone: info.phone,
          address: info.address,
          country: info.country,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur");
      setMessage("Informations mises à jour.");
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSavingInfo(false);
    }
  }

  async function savePrefs() {
    setSavingPrefs(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: prefs.language,
          dateFormat: prefs.dateFormat,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur");
      setMessage("Préférences mises à jour.");
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSavingPrefs(false);
    }
  }

  async function savePassword() {
    if (!pwd.newPassword || pwd.newPassword !== pwd.confirmPassword) {
      setMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    setSavingPwd(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: pwd.currentPassword,
          newPassword: pwd.newPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur");
      setMessage("Mot de passe mis à jour.");
      setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSavingPwd(false);
    }
  }

  return (
    <div className="flex-1 px-4 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-sm font-semibold tracking-tight text-slate-900">
          {t("title")}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">{t("subtitle")}</p>
      </div>

      {message && (
        <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          {message}
        </div>
      )}

      {/* Identité & coordonnées */}
      <section className="rounded-2xl bg-white border border-slate-100 px-5 py-4 space-y-3">
        <h2 className="text-xs font-semibold text-slate-900">
          {t("sections.identity")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">
              {t("fields.fullName")}
            </label>
            <input
              type="text"
              value={info.fullName}
              disabled
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">
              {t("fields.email")}
            </label>
            <input
              type="email"
              value={info.email}
              onChange={(e) =>
                setInfo((p) => ({ ...p, email: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">
              {t("fields.phone")}
            </label>
            <input
              type="text"
              value={info.phone}
              onChange={(e) =>
                setInfo((p) => ({ ...p, phone: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">
              {t("fields.country")}
            </label>
            <input
              type="text"
              value={info.country}
              onChange={(e) =>
                setInfo((p) => ({ ...p, country: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] text-slate-500 mb-1">
              {t("fields.address")}
            </label>
            <input
              type="text"
              value={info.address}
              onChange={(e) =>
                setInfo((p) => ({ ...p, address: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
            />
          </div>
        </div>
        <button
          onClick={saveInfo}
          disabled={savingInfo}
          className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-[11px] font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {savingInfo ? "Enregistrement..." : t("actions.saveIdentity")}
        </button>
      </section>

      {/* Préférences */}
      <section className="rounded-2xl bg-white border border-slate-100 px-5 py-4 space-y-3">
        <h2 className="text-xs font-semibold text-slate-900">
          {t("sections.preferences")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">
              {t("fields.language")}
            </label>
            <select
              value={prefs.language}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, language: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="nl">Nederlands</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">
              {t("fields.dateFormat")}
            </label>
            <select
              value={prefs.dateFormat}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, dateFormat: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs bg-white"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
        <button
          onClick={savePrefs}
          disabled={savingPrefs}
          className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-[11px] font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {savingPrefs ? "Enregistrement..." : t("actions.savePreferences")}
        </button>
      </section>

      {/* Sécurité */}
      <section className="rounded-2xl bg-white border border-slate-100 px-5 py-4 space-y-3">
        <h2 className="text-xs font-semibold text-slate-900">
          {t("sections.security")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">
              {t("fields.currentPassword")}
            </label>
            <input
              type="password"
              value={pwd.currentPassword}
              onChange={(e) =>
                setPwd((p) => ({ ...p, currentPassword: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">
              {t("fields.newPassword")}
            </label>
            <input
              type="password"
              value={pwd.newPassword}
              onChange={(e) =>
                setPwd((p) => ({ ...p, newPassword: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">
              {t("fields.confirmPassword")}
            </label>
            <input
              type="password"
              value={pwd.confirmPassword}
              onChange={(e) =>
                setPwd((p) => ({ ...p, confirmPassword: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
            />
          </div>
        </div>
        <button
          onClick={savePassword}
          disabled={savingPwd}
          className="mt-2 inline-flex items-center rounded-full bg-rose-500 px-4 py-1.5 text-[11px] font-medium text-white hover:bg-rose-600 disabled:opacity-60"
        >
          {savingPwd ? "Mise à jour..." : t("actions.savePassword")}
        </button>
      </section>
    </div>
  );
}
