'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import {
  HomeIcon,
  ArrowPathRoundedSquareIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'fr';
  const pathname = usePathname();
  const t = useTranslations('dashboard');

  const [data, setData] = useState(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.status === 401) {
          router.push(`/${locale}/login`);
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [router, locale]);

  // Tant que les données ne sont pas là, on ne rend rien (0 skeleton)
  if (!data) return null;

  const menuItems = [
    { key: 'dashboard', href: `/${locale}/dashboard`, label: t('menu.dashboard'), icon: HomeIcon },
    { key: 'transfer', href: `/${locale}/transfer`, label: t('menu.transfer'), icon: ArrowPathRoundedSquareIcon },
    { key: 'history', href: `/${locale}/transactions`, label: t('menu.history'), icon: ClockIcon },
    { key: 'profile', href: `/${locale}/profile`, label: t('menu.profile'), icon: UserCircleIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      {/* Sidebar Desktop */}
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
            const isActive = pathname.startsWith(item.href);

            return (
              <a
                key={item.key}
                href={item.href}
                className={`group flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-9 w-9 rounded-xl inline-flex items-center justify-center text-xs ${
                      isActive
                        ? 'bg-white text-indigo-500'
                        : 'bg-slate-100 text-slate-400 group-hover:text-slate-600'
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

      {/* Sidebar Mobile */}
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
                const isActive = pathname.startsWith(item.href);

                return (
                  <a
                    key={item.key}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-9 w-9 rounded-xl inline-flex items-center justify-center text-xs ${
                          isActive
                            ? 'bg-white text-indigo-500'
                            : 'bg-slate-100 text-slate-400 group-hover:text-slate-600'
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
              <LanguageSwitcher />
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden h-8 w-8 inline-flex items-center justify-center rounded-md border border-slate-200 text-slate-500 text-lg"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-semibold tracking-tight">{t('title')}</span>
              <span className="text-xs text-slate-400">
                {t('balance')}: {data.account.balance} {data.account.currency}
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
                  {t('menu.profile')}
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => router.push(`/${locale}/logout`)}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
                >
                  {t('menu.logout')}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-4 lg:px-8 py-6 space-y-6">
          {/* Top metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white border border-slate-200/80 shadow-sm shadow-slate-100 px-4 py-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {t('balance')}
                </span>
                <span className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 text-xs inline-flex items-center justify-center">
                  €
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                {data.account.balance} {data.account.currency}
              </p>
              <p className="mt-1 text-[11px] text-emerald-600">
                {t('accountNumber')}: {data.account.accountNumber.slice(0, 4)}••••{data.account.accountNumber.slice(-4)}
              </p>
            </div>

            <div className="rounded-xl bg-white border border-slate-200/80 shadow-sm shadow-slate-100 px-4 py-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {t('pendingTransfers')}
                </span>
                <span className="h-6 w-6 rounded-full bg-amber-50 text-amber-600 text-xs inline-flex items-center justify-center">
                  ●
                </span>
              </div>
              <p className="mt-3 text-xl font-semibold tracking-tight text-slate-900">
                {data.pending.count}
              </p>
              <p className="mt-1 text-[11px] text-amber-600">
                {data.pending.total} EUR
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 text-white px-4 py-4 shadow-sm shadow-emerald-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide opacity-90">
                  Mastercard
                </span>
                <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-full">
                  {data.card ? t('card.title') : t('card.add')}
                </span>
              </div>
              <p className="mt-3 text-sm opacity-90">
                {data.card
                  ? `${t('card.holder')}: ${data.card.cardholderName}`
                  : t('card.verificationMessage')}
              </p>
              <div className="mt-3 flex justify-between items-center">
                <button
                  onClick={() => (data.card ? setShowCardDetailsModal(true) : setShowAddCardModal(true))}
                  className="text-xs font-medium bg-white text-emerald-700 rounded-full px-3 py-1 hover:bg-slate-50 transition"
                >
                  {data.card ? t('card.viewDetails') : t('card.add')}
                </button>
                {data.card && (
                  <span className="text-[11px] opacity-90">
                    **** {data.card.cardNumber.slice(-4)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push(`/${locale}/transfer`)}
            className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-rose-600 active:bg-rose-700"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
              +
            </span>
            {t('newTransfer')}
          </button>

          {/* Dernières transactions */}
          <div className="rounded-2xl bg-white border border-slate-100 px-5 py-4 space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-slate-100 inline-flex items-center justify-center text-slate-500">
                  <ClockIcon className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    {t('recentTransactions')}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t('recentTransactionsSubtitle')}
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400">
                {data.transactions.length} opérations
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] text-slate-400 border-b border-slate-100">
                    <th className="py-2 pr-4 font-medium">{t('table.date')}</th>
                    <th className="py-2 pr-4 font-medium">{t('table.beneficiary')}</th>
                    <th className="py-2 pr-4 font-medium">{t('table.type')}</th>
                    <th className="py-2 pr-4 font-medium text-right">{t('table.amount')}</th>
                    <th className="py-2 pl-4 font-medium text-right">N Transaction</th>
                  </tr>
                </thead>
<tbody className="divide-y divide-slate-50">
  {data.transactions.length === 0 && (
    <tr>
      <td
        colSpan={5}
        className="py-3 text-center text-xs text-slate-400"
      >
        Aucune transaction pour le moment.
      </td>
    </tr>
  )}

  {data.transactions.slice(0, 10).map((tx) => (
    <tr key={tx.id} className="hover:bg-gray-2/60">
      <td className="py-2 pr-4 whitespace-nowrap text-dark-4">
        {tx.created_at
          ? new Date(tx.created_at).toLocaleDateString()
          : "—"}
      </td>
      <td className="py-2 pr-4 whitespace-nowrap text-dark">
        {tx.counterparty_name || tx.description || "—"}
      </td>
      <td className="py-2 pr-4 whitespace-nowrap text-dark-4">
        {tx.type === "CREDIT" ? "Crédit" : "Débit"}
      </td>
      <td
        className={`py-2 pr-4 text-right whitespace-nowrap font-semibold ${
          tx.type === "CREDIT" ? "text-emerald-600" : "text-red-500"
        }`}
      >
        {Number.isFinite(Number(tx.amount))
          ? `${tx.type === "CREDIT" ? "+" : "-"}${Number(
              tx.amount
            ).toFixed(2)} EUR`
          : "—"}
      </td>
      <td className="py-2 pl-4 text-right whitespace-nowrap text-[11px] text-slate-500 font-mono">
        {tx.reference || `${tx.id}` || "—"}
      </td>
    </tr>
  ))}
</tbody>

              </table>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showAddCardModal && (
          <AddCardModal onClose={() => setShowAddCardModal(false)} locale={locale} t={t} />
        )}
        {showCardDetailsModal && data.card && (
          <CardDetailsModal
            card={data.card}
            onClose={() => setShowCardDetailsModal(false)}
            t={t}
          />
        )}
      </main>
    </div>
  );
}
// Modal Ajout Carte
function AddCardModal({ onClose, locale, t }) {
  const [step, setStep] = useState(1);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [smsCode, setSmsCode] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStep(2);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200">
        {step === 1 ? (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                  {t('card.addTitle')}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('card.verificationMessage')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-400 text-sm hover:bg-slate-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 text-sm">
              <div className="grid gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">
                    {t('card.cardNumber')}
                  </label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(
                        e.target.value
                          .replace(/\s/g, '')
                          .replace(/(.{4})/g, '$1 ')
                          .trim()
                      )
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500">
                      {t('card.expiry')}
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM/YY"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                      value={expiryDate}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                        setExpiryDate(val);
                      }}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500">
                      {t('card.cvv')}
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      placeholder="123"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500">
                    {t('card.holderName')}
                  </label>
                  <input
                    type="text"
                    placeholder="JOHN DOE"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50"
                >
                  {t('card.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
                >
                  {t('card.submit')}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                  {t('card.smsVerification')}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('card.smsSent')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-400 text-sm hover:bg-slate-50"
              >
                ×
              </button>
            </div>

            <div className="px-5 py-4 space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  {t('card.smsCode')}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-center text-lg font-mono tracking-[0.3em] text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50"
                >
                  {t('card.cancel')}
                </button>
                <button
                  className="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600"
                >
                  {t('card.verify')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Modal Détails Carte
function CardDetailsModal({ card, onClose, t }) {
  const [showBack, setShowBack] = useState(false);
  const [cvvRevealed, setCvvRevealed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold tracking-tight text-slate-900">
            {t('card.detailsTitle')}
          </h2>
          <button
            onClick={onClose}
            className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-400 text-sm hover:bg-slate-50"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Carte flip */}
          <div className="w-full" style={{ perspective: '1000px' }}>
            <div
              className="relative w-full h-56 cursor-pointer transition-transform duration-700"
              style={{
                transformStyle: 'preserve-3d',
                transform: showBack ? 'rotateY(180deg)' : 'rotateY(0)',
              }}
              onClick={() => setShowBack(!showBack)}
            >
              {/* Recto */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-5 shadow-md">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] uppercase tracking-wide opacity-70">
                      BK • Mastercard
                    </span>
                    <div className="flex gap-1">
                      <span className="h-7 w-7 rounded-full bg-amber-500/90" />
                      <span className="h-7 w-7 rounded-full bg-red-500/80 -ml-2" />
                    </div>
                  </div>

                  <p className="mt-8 text-xl font-mono tracking-[0.25em]">
                    {card.cardNumber.replace(/(.{4})/g, '$1 ').trim()}
                  </p>

                  <div className="mt-8 flex justify-between text-[11px]">
                    <div>
                      <p className="opacity-60">{t('card.holder')}</p>
                      <p className="text-xs font-medium">{card.cardholderName}</p>
                    </div>
                    <div>
                      <p className="opacity-60">{t('card.expiry')}</p>
                      <p className="text-xs font-mono">{card.expiryDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verso */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-slate-800 via-slate-900 to-slate-900 text-white shadow-md overflow-hidden">
                  <div className="mt-6 h-10 bg-slate-950" />
                  <div className="px-6 mt-8">
                    <div className="bg-white h-10 rounded flex items-center justify-end px-4">
                      <span className="font-mono text-xs text-slate-400">Signature</span>
                    </div>
                    <div className="mt-6 text-right">
                      <p className="text-[11px] text-white/60 mb-1">{t('card.cvv')}</p>
                      <p className="text-2xl font-mono font-semibold">
                        ***
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-center text-[11px] text-white/40">
                    {t('card.clickToFlip')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Détails */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">{t('card.number')}</span>
              <span className="font-mono text-slate-900">
                {card.cardNumber.replace(/(.{4})/g, '$1 ').trim()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('card.holder')}</span>
              <span className="font-medium text-slate-900">
                {card.cardholderName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('card.expiry')}</span>
              <span className="font-mono text-slate-900">
                {card.expiryDate}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">{t('card.cvv')}</span>
              <button
                onClick={() => setCvvRevealed(!cvvRevealed)}
                className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700"
              >
                {cvvRevealed ? '123' : t('card.reveal')}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">{t('card.status')}</span>
              <span
                className={`text-[11px] font-semibold ${
                  card.status === 'ACTIVE' ? 'text-emerald-600' : 'text-sky-600'
                }`}
              >
                {card.status === 'ACTIVE' ? t('card.active') : t('card.frozen')}
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 pb-4 pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
          >
            {t('card.close')}
          </button>
        </div>
      </div>
    </div>
  );
}

