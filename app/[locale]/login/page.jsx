'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import InputGroup from '@/app/components/FormElements/InputGroup';
import { Checkbox } from '@/app/components/FormElements/checkbox';
import { EmailIcon, PasswordIcon } from '@/app/components/icons';

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'fr';
  const t = useTranslations('login');

  const [data, setData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setError(responseData.error || t('errorGeneric'));
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
    <main className="min-h-screen flex items-center justify-center bg-[#f1f5f9] dark:bg-[#1c2434] py-8">
      <div className="w-full max-w-[1170px] mx-auto px-4">
        <div className="rounded-xl bg-white shadow-lg dark:bg-[#1c2434] overflow-hidden">
          <div className="flex flex-wrap items-stretch">
            {/* Formulaire gauche */}
            <div className="w-full xl:w-1/2">
              <div className="w-full p-8 sm:p-12 xl:p-16">
                {/* Titre */}
                <div className="mb-9">
                  <h2 className="mb-3 text-3xl font-bold text-[#1c2434] dark:text-white">
                    {t('title')}
                  </h2>
                  <p className="text-base text-[#64748b] dark:text-[#8a99af]">
                    {t('description')}
                  </p>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit}>
                  <InputGroup
                    type="email"
                    label={t('email')}
                    className="mb-5"
                    placeholder={t('email')}
                    name="email"
                    handleChange={handleChange}
                    value={data.email}
                    icon={<EmailIcon />}
                  />

                  <InputGroup
                    type="password"
                    label={t('password')}
                    className="mb-6"
                    placeholder={t('password')}
                    name="password"
                    handleChange={handleChange}
                    value={data.password}
                    icon={<PasswordIcon />}
                  />

                  <div className="mb-6 flex items-center justify-between gap-2 font-medium">
                    <Checkbox
                      label={t('remember')}
                      name="remember"
                      onChange={(e) =>
                        setData({
                          ...data,
                          remember: e.target.checked,
                        })
                      }
                    />
                    <Link
                      href={`/${locale}/forgot-password`}
                      className="text-sm text-[#64748b] hover:text-[#3c50e0] dark:text-[#8a99af]"
                    >
                      {t('forgot')}
                    </Link>
                  </div>

                  {error && (
                    <p className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                      {error}
                    </p>
                  )}

                  <div className="mb-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#3c50e0] p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-60"
                    >
                      {loading ? t('submitting') : t('submit')}
                      {loading && (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-base text-[#64748b]">
                      {t('noAccount')}{' '}
                      <Link href={`/${locale}/register`} className="text-[#3c50e0] hover:underline">
                        {t('register')}
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Image/Texte droite (caché sur mobile) */}
            <div className="hidden w-full xl:block xl:w-1/2 bg-gradient-to-br from-[#3c50e0]/10 to-[#3c50e0]/5">
              <div className="flex h-full flex-col justify-center px-12 py-16">
                <div className="mb-10">
                  <h3 className="mb-3 text-2xl font-bold text-[#1c2434] dark:text-white">
                    {t('subtitle')}
                  </h3>
                  <h1 className="mb-4 text-4xl font-bold text-[#1c2434] dark:text-white">
                    Bienvenue!
                  </h1>
                  <p className="max-w-md text-lg text-[#64748b] dark:text-[#8a99af]">
                    Connectez-vous pour accéder à votre espace bancaire sécurisé.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
