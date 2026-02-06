'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'fr';
  const t = useTranslations('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('errorGeneric'));
      } else {
        router.push(`/${locale}/dashboard`);
      }
    } catch (err) {
      setError(t('errorNetwork'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
      <div className="w-full max-w-md px-4">
        <div className="mb-6 text-center">
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#9ca3af] mb-1">
            {t('subtitle')}
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#111827]">
            {t('title')}
          </h1>
          <p className="text-xs md:text-sm text-[#6b7280] mt-2">
            {t('description')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#e5e7eb] rounded-xl px-8 py-6 space-y-4 shadow-sm"
        >
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
              {t('email')}
            </label>
            <input
              type="email"
              className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
              {t('password')}
            </label>
            <input
              type="password"
              className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-xs text-center text-[#b91c1c] bg-[#fee2e2] border border-[#fecaca] rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#047857] text-white py-2.5 rounded-full text-sm font-semibold tracking-wide hover:bg-[#03624a] disabled:opacity-60 transition"
          >
            {loading ? t('submitting') : t('submit')}
          </button>

          <p className="text-center text-xs text-[#6b7280] mt-4">
            {t('noAccount')}{' '}
            <a href={`/${locale}/register`} className="text-[#047857] font-semibold underline">
              {t('register')}
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
