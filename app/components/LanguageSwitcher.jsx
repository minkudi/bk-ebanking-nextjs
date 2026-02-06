'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher({ currentLocale }) {
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
    { code: 'fi', label: 'Suomi', flag: '🇫🇮' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'pl', label: 'Polski', flag: '🇵🇱' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'sk', label: 'Slovenčina', flag: '🇸🇰' },
    { code: 'bg', label: 'Български', flag: '🇧🇬' },
    { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'sl', label: 'Slovenščina', flag: '🇸🇮' },
    { code: 'lt', label: 'Lietuvių', flag: '🇱🇹' },
    { code: 'lv', label: 'Latviešu', flag: '🇱🇻' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'cs', label: 'Čeština', flag: '🇨🇿' },
  ];

  const handleChange = (newLocale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <div className="relative inline-block">
      <select
        value={currentLocale}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#047857] cursor-pointer"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
}
