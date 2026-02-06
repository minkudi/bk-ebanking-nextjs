'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'fr';
  const t = useTranslations('dashboard');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router, locale]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
        <div className="animate-pulse text-gray-600">{t('loading')}</div>
      </main>
    );
  }

  if (!data) return null;

  const menuItems = [
    { key: 'dashboard', href: `/${locale}/dashboard`, icon: '🏠', label: t('menu.dashboard') },
    { key: 'transfer', href: `/${locale}/transfer`, icon: '💸', label: t('menu.transfer') },
    { key: 'history', href: `/${locale}/transactions`, icon: '📋', label: t('menu.history') },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-[#e5e7eb] fixed h-full">
        <div className="p-6 border-b border-[#e5e7eb]">
          <h1 className="text-xl font-bold text-[#111827]">BK E‑BANKING</h1>
          <p className="text-xs text-[#6b7280] mt-1">{t('subtitle')}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <a
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                item.key === 'dashboard' 
                  ? 'bg-[#047857] text-white font-semibold' 
                  : 'text-[#6b7280] hover:bg-[#f3f4f6]'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-[#e5e7eb]">
          <p className="text-xs text-[#9ca3af] text-center">© 2026 BK E-Banking</p>
        </div>
      </aside>

      {/* Sidebar Mobile (overlay) */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 bg-white h-full animate-slide-right" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[#e5e7eb] flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-[#111827]">BK E‑BANKING</h1>
                <p className="text-xs text-[#6b7280] mt-1">{t('subtitle')}</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-2xl text-gray-400">&times;</button>
            </div>
            <nav className="p-4 space-y-2">
              {menuItems.map(item => (
                <a
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    item.key === 'dashboard' 
                      ? 'bg-[#047857] text-white font-semibold' 
                      : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </a>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Contenu principal */}
      <main className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-[#e5e7eb] px-6 py-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Burger menu mobile */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-2xl text-[#6b7280]"
            >
              ☰
            </button>

            <h2 className="text-lg font-semibold text-[#111827] hidden md:block">{t('title')}</h2>

            {/* Avatar + menu utilisateur */}
            <div className="relative ml-auto">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 hover:bg-[#f3f4f6] px-3 py-2 rounded-lg transition"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#047857] to-[#059669] flex items-center justify-center text-white font-bold text-sm">
                  {data.user.fullName.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-[#111827]">{data.user.fullName}</p>
                  <p className="text-xs text-[#6b7280]">{data.user.email}</p>
                </div>
                <span className="text-[#6b7280]">▼</span>
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e5e7eb] rounded-lg shadow-lg py-2 animate-fade-in">
                  <a 
                    href={`/${locale}/profile`}
                    className="block px-4 py-2 text-sm text-[#6b7280] hover:bg-[#f3f4f6] transition"
                  >
                    👤 {t('menu.profile')}
                  </a>
                  <div className="border-t border-[#e5e7eb] my-1"></div>
                  <button 
                    onClick={() => router.push(`/${locale}/logout`)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    🚪 {t('menu.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenu */}
        <div className="p-6">
          {/* Cartes principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 hover:shadow-md transition">
              <p className="text-xs uppercase tracking-wide text-[#6b7280] mb-2">{t('balance')}</p>
              <p className="text-3xl font-bold text-[#111827]">
                {data.account.balance} {data.account.currency}
              </p>
            </div>

            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 hover:shadow-md transition">
              <p className="text-xs uppercase tracking-wide text-[#6b7280] mb-2">{t('accountNumber')}</p>
              <p className="text-lg font-mono text-[#111827]">
                {data.account.accountNumber.slice(0, 4)}••••{data.account.accountNumber.slice(-4)}
              </p>
            </div>

            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 hover:shadow-md transition">
              <p className="text-xs uppercase tracking-wide text-[#6b7280] mb-2">{t('pendingTransfers')}</p>
              <p className="text-xl font-bold text-orange-600">
                {data.pending.count} ({data.pending.total} EUR)
              </p>
            </div>
          </div>

          {/* Section Carte */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 mb-8 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-[#111827] mb-6">{t('card.title')}</h2>
            
            {!data.card ? (
              <div className="flex items-center gap-6">
                <div 
                  className="w-80 h-48 border-2 border-dashed border-[#d1d5db] rounded-xl flex items-center justify-center bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6] hover:border-[#047857] hover:shadow-lg transition cursor-pointer group"
                  onClick={() => setShowAddCardModal(true)}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">💳</div>
                    <p className="text-sm font-semibold text-[#047857]">+ {t('card.add')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row items-start gap-6">
                <div 
                  className="w-80 h-48 bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1f1f1f] rounded-xl p-6 text-white shadow-xl relative overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 group"
                  onClick={() => setShowCardDetailsModal(true)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="absolute top-4 right-4 z-10 flex gap-1">
                    <div className="w-8 h-8 rounded-full bg-red-500 opacity-90"></div>
                    <div className="w-8 h-8 rounded-full bg-orange-400 opacity-90 -ml-4"></div>
                  </div>

                  <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md shadow-md"></div>

                  <div className="mt-8">
                    <p className="text-xs opacity-60 mb-1">{t('card.number')}</p>
                    <p className="text-lg font-mono tracking-widest">
                      •••• •••• •••• {data.card.cardNumber.slice(-4)}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-60">{t('card.holder')}</p>
                      <p className="text-sm font-semibold">{data.card.cardholderName}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-60">{t('card.expiry')}</p>
                      <p className="text-sm font-mono">{data.card.expiryDate}</p>
                    </div>
                  </div>

                  {data.card.status === 'FROZEN' && (
                    <div className="absolute inset-0 bg-blue-500/30 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                        ❄️ {t('card.frozen')}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition bg-black/70 px-3 py-1 rounded-full whitespace-nowrap">
                    👁️ {t('card.clickToView')}
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:flex lg:flex-col gap-2">
                  <button className="px-4 py-2 bg-[#047857] text-white rounded-lg text-sm font-semibold hover:bg-[#03624a] transition">
                    ✨ {t('card.generate')}
                  </button>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition">
                    {data.card.status === 'FROZEN' ? '🔓 ' + t('card.unfreeze') : '🧊 ' + t('card.freeze')}
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                    🗑️ {t('card.delete')}
                  </button>
                  <button 
                    onClick={() => setShowCardDetailsModal(true)}
                    className="px-4 py-2 border border-[#d1d5db] text-[#6b7280] rounded-lg text-sm font-semibold hover:border-[#047857] hover:text-[#047857] transition"
                  >
                    👁️ {t('card.viewDetails')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Transactions */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">{t('recentTransactions')}</h2>
            {data.transactions.length === 0 ? (
              <p className="text-sm text-[#6b7280] text-center py-8">{t('noTransactions')}</p>
            ) : (
              <div className="space-y-2">
                {data.transactions.map(tx => (
                  <div 
                    key={tx.id} 
                    className="flex justify-between items-center border-b border-[#f3f4f6] pb-2 hover:bg-[#f9fafb] px-3 py-2 rounded-lg transition"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#111827]">{tx.counterparty_name || tx.description}</p>
                      <p className="text-xs text-[#6b7280]">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className={`text-sm font-semibold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'CREDIT' ? '+' : '-'}{tx.amount} EUR
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showAddCardModal && <AddCardModal onClose={() => setShowAddCardModal(false)} locale={locale} t={t} />}
      {showCardDetailsModal && data.card && <CardDetailsModal card={data.card} onClose={() => setShowCardDetailsModal(false)} t={t} />}
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-slide-up">
        {step === 1 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#111827]">{t('card.addTitle')}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl transition">&times;</button>
            </div>

            {/* Message statique */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-xs text-blue-800">
                ℹ️ {t('card.verificationMessage')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                  {t('card.cardNumber')}
                </label>
                <input
                  type="text"
                  maxLength="19"
                  placeholder="1234 5678 9012 3456"
                  className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:ring-2 focus:ring-[#047857] transition"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                    {t('card.expiry')}
                  </label>
                  <input
                    type="text"
                    maxLength="5"
                    placeholder="MM/YY"
                    className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:ring-2 focus:ring-[#047857] transition"
                    value={expiryDate}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                      setExpiryDate(val);
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                    {t('card.cvv')}
                  </label>
                  <input
                    type="text"
                    maxLength="3"
                    placeholder="123"
                    className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:ring-2 focus:ring-[#047857] transition"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                  {t('card.holderName')}
                </label>
                <input
                  type="text"
                  placeholder="JOHN DOE"
                  className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] focus:ring-2 focus:ring-[#047857] transition"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-[#d1d5db] text-[#6b7280] rounded-full text-sm font-semibold hover:bg-[#f9fafb] transition"
                >
                  {t('card.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#047857] text-white rounded-full text-sm font-semibold hover:bg-[#03624a] transition"
                >
                  {t('card.submit')}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#111827]">{t('card.smsVerification')}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl transition">&times;</button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800 flex items-center gap-2">
                <span className="text-xl">✅</span>
                {t('card.smsSent')}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                {t('card.smsCode')}
              </label>
              <input
                type="text"
                maxLength="6"
                placeholder="123456"
                className="w-full border-2 border-[#d1d5db] rounded-lg px-4 py-3 text-center text-2xl font-mono text-[#111827] focus:ring-2 focus:ring-[#047857] transition"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-[#d1d5db] text-[#6b7280] rounded-full text-sm font-semibold hover:bg-[#f9fafb] transition"
              >
                {t('card.cancel')}
              </button>
              <button
                className="flex-1 px-4 py-2.5 bg-[#047857] text-white rounded-full text-sm font-semibold hover:bg-[#03624a] transition"
              >
                ✓ {t('card.verify')}
              </button>
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#111827]">{t('card.detailsTitle')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl transition">&times;</button>
        </div>

        {/* Carte flip */}
        <div className="mb-6" style={{ perspective: '1000px' }}>
          <div 
            className="relative w-full h-56 cursor-pointer transition-transform duration-700"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: showBack ? 'rotateY(180deg)' : 'rotateY(0)'
            }}
            onClick={() => setShowBack(!showBack)}
          >
            {/* Recto */}
            <div 
              className="absolute inset-0 rounded-xl"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1f1f1f] rounded-xl p-6 text-white shadow-2xl">
                <div className="flex gap-1 justify-end mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500 opacity-90"></div>
                  <div className="w-10 h-10 rounded-full bg-orange-400 opacity-90 -ml-5"></div>
                </div>
                <div className="w-14 h-12 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md mb-8"></div>
                <p className="text-xl font-mono tracking-widest mb-8">
                  {card.cardNumber.replace(/(.{4})/g, '$1 ').trim()}
                </p>
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs opacity-60">{t('card.holder')}</p>
                    <p className="text-sm font-semibold">{card.cardholderName}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-60">{t('card.expiry')}</p>
                    <p className="text-sm font-mono">{card.expiryDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verso */}
            <div 
              className="absolute inset-0 rounded-xl"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-[#2d2d2d] via-[#1a1a1a] to-[#1f1f1f] rounded-xl overflow-hidden shadow-2xl">
                <div className="bg-black h-12 mt-6"></div>
                <div className="px-6 mt-8">
                  <div className="bg-white h-10 rounded flex items-center justify-end px-4">
                    <span className="font-mono text-sm italic text-gray-400">Signature</span>
                  </div>
                  <div className="mt-6 text-right">
                    <p className="text-xs text-white/60 mb-1">{t('card.cvv')}</p>
                    <p className="text-2xl font-mono text-white font-bold">***</p>
                  </div>
                </div>
                <p className="text-center text-xs text-white/40 mt-6">{t('card.clickToFlip')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Détails */}
        <div className="space-y-3 bg-[#f9fafb] rounded-lg p-4">
          <div className="flex justify-between">
            <span className="text-xs uppercase text-[#6b7280]">{t('card.number')}</span>
            <span className="text-sm font-mono text-[#111827]">{card.cardNumber.replace(/(.{4})/g, '$1 ').trim()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs uppercase text-[#6b7280]">{t('card.holder')}</span>
            <span className="text-sm font-semibold text-[#111827]">{card.cardholderName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs uppercase text-[#6b7280]">{t('card.expiry')}</span>
            <span className="text-sm font-mono text-[#111827]">{card.expiryDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase text-[#6b7280]">{t('card.cvv')}</span>
            <button 
              onClick={() => setCvvRevealed(!cvvRevealed)}
              className="text-sm font-mono text-[#047857] hover:text-[#03624a] font-semibold transition"
            >
              {cvvRevealed ? '123' : '👁️ ' + t('card.reveal')}
            </button>
          </div>
          <div className="flex justify-between">
            <span className="text-xs uppercase text-[#6b7280]">{t('card.status')}</span>
            <span className={`text-sm font-semibold ${card.status === 'ACTIVE' ? 'text-green-600' : 'text-blue-600'}`}>
              {card.status === 'ACTIVE' ? '✓ ' + t('card.active') : '❄️ ' + t('card.frozen')}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2.5 bg-[#047857] text-white rounded-full text-sm font-semibold hover:bg-[#03624a] transition"
        >
          {t('card.close')}
        </button>
      </div>
    </div>
  );
}

