'use client';

import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function AuthLanguageWrapper({ locale }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname.endsWith('/login') || pathname.endsWith('/register');

  if (!isAuthPage) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <LanguageSwitcher currentLocale={locale} />
    </div>
  );
}
