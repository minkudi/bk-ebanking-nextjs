"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  HomeIcon,
  ArrowPathRoundedSquareIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function DashboardLayout({ children, activeKey }) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";
  const t = useTranslations("dashboard");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.status === 401) {
          router.push(`/${locale}/login`);
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router, locale]);

  if (loading || !data) {
    return (
      <div className="h-screen bg-slate-50 flex text-slate-900 overflow-hidden">
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200" />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between">
            <div className="h-4 w-40 bg-slate-100 rounded animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse" />
          </header>
        </main>
      </div>
    );
  }

  const menuItems = [
    { key: "dashboard", href: `/${locale}/dashboard`, label: t("menu.dashboard"), icon: HomeIcon },
    { key: "transfer", href: `/${locale}/transfer`, label: t("menu.transfer"), icon: ArrowPathRoundedSquareIcon },
    { key: "history", href: `/${locale}/transactions`, label: t("menu.history"), icon: ClockIcon },
    { key: "profile", href: `/${locale}/profile`, label: t("menu.profile"), icon: UserCircleIcon },
  ];

  const balance = Number(data.account.balance) || 0;
  const currency = data.account.currency || "EUR";

  return (
    <div className="h-screen bg-slate-50 flex text-slate-900 overflow-hidden">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200">
        <div className="h-16 px-6 flex items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center text-white">
              <span className="text-[18px] font-bold">BK</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900 tracking-tight">
                BK E‑BANKING
              </span>
              <span className="text-[11px] text-slate-400 uppercase tracking-[0.16em]">
                Menu
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 mx-6" />

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activeKey;
            return (
              <a
                key={item.key}
                href={item.href}
                className={`group flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-9 w-9 rounded-xl inline-flex items-center justify-center text-xs ${
                      isActive
                        ? "bg-white text-indigo-500"
                        : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
              </a>
            );
          })}
        </nav>

        <div className="px-6 pb-3">
          <LanguageSwitcher currentLocale={locale} />
        </div>
        <div className="px-6 py-2 text-[11px] text-slate-400">
          © 2026 BK E‑BANKING
        </div>
      </aside>

      {/* SIDEBAR MOBILE */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="w-64 bg-white h-full shadow-lg border-r border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-16 px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center text-white">
                  <span className="text-[18px] font-bold">BK</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 tracking-tight">
                    BK E‑BANKING
                  </span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-[0.16em]">
                    Menu
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-400 text-sm hover:bg-slate-50"
              >
                ×
              </button>
            </div>

            <div className="h-px bg-slate-100 mx-4" />

            <nav className="px-3 py-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.key === activeKey;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-9 w-9 rounded-xl inline-flex items-center justify-center text-xs ${
                          isActive
                            ? "bg-white text-indigo-500"
                            : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                  </a>
                );
              })}
            </nav>
            <div className="px-4 pb-4">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </aside>
        </div>
      )}

      {/* MAIN + HEADER */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden h-8 w-8 inline-flex items-center justify-center rounded-md border border-slate-200 text-slate-500 text-lg"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                {t("title")}
              </span>
              <span className="text-xs text-slate-400">
                {t("balance")}: {balance.toFixed(2)} {currency}
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu((v) => !v)}
              className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 transition"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-white text-xs font-semibold">
                {data.user.fullName.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-xs font-medium text-slate-900 truncate max-w-[140px]">
                  {data.user.fullName}
                </span>
                <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {data.user.email}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">▼</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg text-sm py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push(`/${locale}/profile`);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-600"
                >
                  {t("menu.profile")}
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => router.push(`/${locale}/logout`)}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
                >
                  {t("menu.logout")}
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="flex-1 px-4 lg:px-8 py-6 space-y-6">
          {typeof children === "object" && children !== null
            ? {
                ...children,
                props: {
                  ...children.props,
                  balance,
                  currency,
                },
              }
            : children}
        </div>
      </main>
    </div>
  );
}
