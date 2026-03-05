"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ClockIcon } from "@heroicons/react/24/outline";
import { generateTransactionsPDF } from "../../../../lib/generateTransactionsPDF";

export default function TransactionsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";
  const t = useTranslations("transactions");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/transactions");
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

  if (loading) {
    return (
      <div className="flex-1 px-4 lg:px-8 py-6 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-10 bg-white border border-slate-200 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const transactions = data.transactions || [];
  const accountNumber = data.account?.accountNumber || "";
  const balance = data.account?.balance ?? null;
  const currency = data.account?.currency || "EUR";
  const fullName = data.user?.fullName || "";
  const email = data.user?.email || "";

  return (
    <div className="flex-1 px-4 lg:px-8 py-6 space-y-4">
      {/* Titre + boutons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-slate-100 inline-flex items-center justify-center text-slate-500">
            <ClockIcon className="h-4 w-4" />
          </span>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-slate-900">
              {t("title")}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            {transactions.length} {t("table.operations")}
          </span>

          <button
            type="button"
            onClick={() =>
              generateTransactionsPDF(transactions, {
                fullName,
                email,
                accountNumber,
                balance,
                currency,
                locale, // ⬅️ important pour la langue du PDF
              })
            }
            disabled={!transactions.length}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Icône imprimante */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
              />
            </svg>
            PDF
          </button>
        </div>
      </div>

      {/* Table historique */}
      <div className="rounded-2xl bg-white border border-slate-100 px-5 py-4 space-y-3">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] text-slate-400 border-b border-slate-100">
                <th className="py-2 pr-4 font-medium">{t("table.date")}</th>
                <th className="py-2 pr-4 font-medium">
                  {t("table.beneficiary")}
                </th>
                <th className="py-2 pr-4 font-medium">{t("table.type")}</th>
                <th className="py-2 pr-4 font-medium text-right">
                  {t("table.amount")}
                </th>
                <th className="py-2 pl-4 font-medium text-right">
                  N Tr
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-2/60">
                  <td className="py-2 pr-4 text-[11px] lg:text-xs text-dark-4">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 pr-4 text-[11px] lg:text-xs text-dark">
                    {tx.counterparty_name || tx.description}
                  </td>
                  <td className="py-2 pr-4 text-[11px] lg:text-xs text-dark-4">
                    {tx.type === "CREDIT" ? "Crédit" : "Débit"}
                  </td>
                  <td
                    className={`py-2 pr-4 text-right text-[11px] lg:text-xs font-semibold ${
                      tx.type === "CREDIT"
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {`${tx.type === "CREDIT" ? "+" : "-"}${Number(
                      tx.amount
                    ).toFixed(2)} EUR`}
                  </td>
                  <td className="py-2 pl-4 text-right text-[10px] lg:text-[11px] text-slate-500 font-mono">
                    {tx.reference}
                  </td>
                </tr>
              ))}
              {!transactions.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-3 text-center text-xs text-slate-400"
                  >
                    {t("empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
