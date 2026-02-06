'use client';

import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import { COUNTRIES } from '../../countries';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function RegisterPage() {
  const params = useParams();
  const locale = params.locale || 'fr';
  const t = useTranslations('register');

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
    <main className="min-h-screen flex items-center justify-center bg-[#f1f5f9] py-8">
      <div className="w-full max-w-[600px] mx-auto px-4">
        <div className="rounded-xl bg-white shadow-lg overflow-hidden">
          <div className="w-full p-8 sm:p-12">
            {/* Titre */}
            <div className="mb-9 text-center sm:text-left">
              <h2 className="mb-3 text-3xl font-bold text-[#1c2434]">
                {t('title')}
              </h2>
              <p className="text-base text-[#64748b]">
                {t('description')}
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    {t('fullName')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-lg text-sm focus:ring-2 focus:ring-[#3c50e0] focus:border-[#3c50e0]"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    {t('address')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-lg text-sm focus:ring-2 focus:ring-[#3c50e0] focus:border-[#3c50e0]"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    {t('birthDate')}
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-lg text-sm focus:ring-2 focus:ring-[#3c50e0] focus:border-[#3c50e0]"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    {t('country')}
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-lg text-sm focus:ring-2 focus:ring-[#3c50e0] focus:border-[#3c50e0]"
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
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  {t('phone')}
                </label>
                <PhoneInput
                  defaultCountry={localeToCountry[locale] || 'fr'}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  className="w-full"
                  inputClassName="w-full px-4 py-3 border border-[#d1d5db] rounded-lg text-sm focus:ring-2 focus:ring-[#3c50e0] focus:border-[#3c50e0]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#374151] mb-3">
                  {t('gender')}
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={gender === 'Male'}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-4 h-4 text-[#3c50e0] focus:ring-[#3c50e0]"
                    />
                    <span className="text-sm">{t('genderMale')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={gender === 'Female'}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-4 h-4 text-[#3c50e0] focus:ring-[#3c50e0]"
                    />
                    <span className="text-sm">{t('genderFemale')}</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-lg text-sm focus:ring-2 focus:ring-[#3c50e0] focus:border-[#3c50e0]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    {t('password')}
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-lg text-sm focus:ring-2 focus:ring-[#3c50e0] focus:border-[#3c50e0]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    {t('confirmPassword')}
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-[#d1d5db] rounded-lg text-sm focus:ring-2 focus:ring-[#3c50e0] focus:border-[#3c50e0]"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {message && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#3c50e0] p-4 font-medium text-white hover:bg-opacity-90 disabled:opacity-60 transition-all duration-200"
              >
                {loading ? (
                  <>
                    {t('submitting')}
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </>
                ) : (
                  t('submit')
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-base text-[#64748b]">
                  Déjà un compte?{' '}
                  <Link
                    href={`/${locale}/login`}
                    className="text-[#3c50e0] hover:underline font-medium"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
