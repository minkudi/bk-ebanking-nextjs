'use client';

import { useState, useEffect } from 'react';
import { PhoneInput } from 'react-international-phone';
import { COUNTRIES } from '../../countries';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale || 'fr';
  const t = useTranslations('register');

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
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || t('Erreur'));
      } else {
        setMessage(t(`Compte créé. Numéro de compte : ${data.accountNumber}`));
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
      setMessage(t('Erreur réseau'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
      <div className="w-full max-w-2xl px-4">
        <div className="mb-6 text-center">
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#9ca3af] mb-1">
            {t('BK E‑BANKING')}
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#111827]">
            {t('Ouverture de compte')}
          </h1>
          <p className="text-xs md:text-sm text-[#6b7280] mt-2">
            {t('Interface claire, informations essentielles, sans décoration inutile.')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#e5e7eb] rounded-xl px-8 py-6 space-y-4 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                {t('Nom complet')}
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
                {t('Adresse')}
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
                {t('Date de naissance')}
              </label>
              <input
                type="text"
                placeholder={t('JJ/MM/AAAA')}
                className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                {t('Pays')}
              </label>
              <select
                className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">{t('Sélectionner un pays')}</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                {t('Téléphone')}
              </label>
              <PhoneInput
                value={phone}
                onChange={(value) => setPhone(value)}
                className="w-full"
                inputClassName="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                {t('Sexe')}
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
                  <span>{t('Homme')}</span>
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
                  <span>{t('Femme')}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e5e7eb] pt-4 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-1">
                {t('Email')}
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
                {t('Mot de passe')}
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
                {t('Confirmation mot de passe')}
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
            {loading ? t('Création du compte…') : t('Créer mon compte')}
          </button>
        </form>
      </div>
    </main>
  );
}
