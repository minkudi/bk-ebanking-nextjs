'use client';

import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import { COUNTRIES } from '../../countries';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const params = useParams();
  const locale = params.locale || 'fr';
  const t = useTranslations('register');

  // Mapping langue → code pays pour le téléphone
  const localeToCountry = {
    fr: 'fr',
    en: 'gb',
    de: 'de',
    nl: 'nl',
    fi: 'fi',
    es: 'es',
    pl: 'pl',
    pt: 'pt',
    sk: 'sk',
    bg: 'bg',
    el: 'gr',
    sl: 'si',
    lt: 'lt',
    lv: 'lv',
    it: 'it',
    cs: 'cz',
  };

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          address,
          birthDate,
          country,
          phone,
          gender,
          email,
          password,
          confirmPassword,
          locale,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || t('errorGeneric'));
      } else {
        setMessage(t('successMessage', { accountNumber: data.accountNumber }));
        setFullName('');
        setAddress('');
        setBirthDate('');
        setCountry('');
        setPhone('');
        setGender('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setMessage(t('errorNetwork'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
      <div className="w-full max-w-2xl px-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                {t('fullName')}
              </label>
              <input
                className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                {t('address')}
              </label>
              <input
                className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                {t('birthDate')}
              </label>
              <input
                type="text"
                placeholder={t('birthDatePlaceholder')}
                className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                {t('country')}
              </label>
              <select
                className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">{t('countryPlaceholder')}</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                {t('phone')}
              </label>
              <PhoneInput
                defaultCountry={localeToCountry[locale] || 'fr'}
                value={phone}
                onChange={(value) => setPhone(value)}
                className="w-full"
                inputClassName="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                {t('gender')}
              </label>
              <div className="flex gap-4 mt-1 text-sm text-[#111827]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={gender === 'Male'}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  />
                  <span>{t('genderMale')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={gender === 'Female'}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  />
                  <span>{t('genderFemale')}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e5e7eb] pt-4 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                {t('confirmPassword')}
              </label>
              <input
                type="password"
                className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {message && (
            <p className="text-xs md:text-sm text-center text-[#b91c1c] bg-[#fee2e2] border border-[#fecaca] rounded-md px-3 py-2">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#047857] text-white py-2.5 rounded-full text-sm font-semibold tracking-wide hover:bg-[#03624a] disabled:opacity-60 transition"
          >
            {loading ? t('submitting') : t('submit')}
          </button>
        </form>
      </div>
    </main>
  );
}
