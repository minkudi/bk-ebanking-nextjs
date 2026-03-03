"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import {
  HomeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function AdminLayout({ children }) {
  const params = useParams();
  const locale = params.locale || "fr";
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      key: "admin-dashboard",
      href: `/${locale}/admin`,
      label: "Vue globale",
      icon: HomeIcon,
    },
    {
      key: "admin-users",
      href: `/${locale}/admin/users`,
      label: "Utilisateurs",
      icon: UserGroupIcon,
    },
    {
      key: "admin-settings",
      href: `/${locale}/admin/settings`,
      label: "Paramètres",
      icon: Cog6ToothIcon,
    },
  ];

  async function handleLogout() {
    try {
      await fetch("/api/logout", { method: "POST" }).catch(() => {});
    } catch (_) {}
    router.push(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200">
        <div className="h-16 px-6 flex items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white">
              <span className="text-[18px] font-bold">BK</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900 tracking-tight">
                Admin Panel
              </span>
              <span className="text-[11px] text-slate-400 uppercase tracking-[0.16em]">
                Back‑office
              </span>
            </div>
          </div>
        </div>
        <div className="h-px bg-slate-100 mx-6" />

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            let isActive = false;

            if (item.key === "admin-dashboard") {
              // Vue globale active uniquement sur /locale/admin
              isActive = pathname === item.href;
            } else {
              isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");
            }

            return (
              <button
                key={item.key}
                onClick={() => router.push(item.href)}
                className={`w-full group flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-rose-50 text-rose-600"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-9 w-9 rounded-xl inline-flex items-center justify-center text-xs ${
                      isActive
                        ? "bg-white text-rose-500"
                        : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="px-6 pb-3 space-y-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-medium text-rose-600 border border-rose-100 hover:bg-rose-50"
          >
            <span className="inline-flex items-center gap-2">
              <span className="h-7 w-7 rounded-xl bg-rose-50 text-rose-500 inline-flex items-center justify-center">
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
              </span>
              <span>Logout</span>
            </span>
          </button>

          <LanguageSwitcher currentLocale={locale} />
        </div>
        <div className="px-6 py-2 text-[11px] text-slate-400">
          © 2026 BK E‑BANKING Admin
        </div>
      </aside>

      {/* Sidebar mobile (overlay) */}
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
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white">
                  <span className="text-[18px] font-bold">BK</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 tracking-tight">
                    Admin Panel
                  </span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-[0.16em]">
                    Back‑office
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
                let isActive = false;

                if (item.key === "admin-dashboard") {
                  isActive = pathname === item.href;
                } else {
                  isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                }

                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      router.push(item.href);
                      setSidebarOpen(false);
                    }}
                    className={`w-full group flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-rose-50 text-rose-600"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-9 w-9 rounded-xl inline-flex items-center justify-center text-xs ${
                          isActive
                            ? "bg-white text-rose-500"
                            : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={async () => {
                  await handleLogout();
                  setSidebarOpen(false);
                }}
                className="mt-4 w-full inline-flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-medium text-rose-600 border border-rose-100 hover:bg-rose-50"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="h-7 w-7 rounded-xl bg-rose-50 text-rose-500 inline-flex items-center justify-center">
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  </span>
                  <span>Déconnexion</span>
                </span>
                <span className="text-[9px] uppercase tracking-wide">
                  logout
                </span>
              </button>
            </nav>
            <div className="px-4 pb-4">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </aside>
        </div>
      )}

      {/* Contenu principal + bouton menu mobile */}
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="lg:hidden h-12 px-4 flex items-center border-b border-slate-200 bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-slate-200 text-slate-600 text-lg"
          >
            ☰
          </button>
          <span className="ml-3 text-sm font-semibold text-slate-900">
            Admin
          </span>
        </div>
        {children}
      </main>
    </div>
  );
}
