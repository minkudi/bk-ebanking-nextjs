"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { BellAlertIcon } from "@heroicons/react/24/outline";

export default function AdminDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";
  const t = useTranslations("admin");

  const [smsEnabled, setSmsEnabled] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.status === 401 || res.status === 403) {
          router.push(`/${locale}/login`);
          return;
        }
        const json = await res.json();
        setSmsEnabled(json.smsEnabled);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSettings(false);
      }
    }
    load();
  }, [router, locale]);

  async function toggleSms() {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smsEnabled: !smsEnabled }),
      });
      if (!res.ok) {
        console.error(await res.text());
        return;
      }
      setSmsEnabled((v) => !v);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Header admin (le sidebar vient du layout) */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            Administration
          </span>
          <span className="text-xs text-slate-400">
            Configuration globale de la plateforme
          </span>
        </div>
      </header>

      {/* Contenu */}
      <div className="flex-1 px-4 lg:px-8 py-6 space-y-6">
        <section className="rounded-2xl bg-white border border-slate-100 px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-rose-50 text-rose-500 inline-flex items-center justify-center">
                <BellAlertIcon className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Envoi des SMS transactionnels
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Active ou désactive l&apos;envoi des SMS lors des transactions
                  clients. S&apos;applique immédiatement à tous les comptes.
                </p>
              </div>
            </div>
            <button
              onClick={toggleSms}
              disabled={loadingSettings || saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
                smsEnabled
                  ? "bg-emerald-500 border-emerald-500"
                  : "bg-slate-200 border-slate-300"
              } ${saving ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                  smsEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            État actuel :{" "}
            <span className={smsEnabled ? "text-emerald-600" : "text-red-500"}>
              {smsEnabled ? "SMS ACTIVÉS" : "SMS DÉSACTIVÉS"}
            </span>
          </p>
        </section>
      </div>
    </>
  );
}
