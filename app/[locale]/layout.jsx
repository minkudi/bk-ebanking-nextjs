import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import LanguageSwitcher from '../components/LanguageSwitcher';

const locales = ['fr', 'en', 'de', 'nl', 'fi', 'es', 'pl', 'pt', 'sk', 'bg', 'el', 'sl', 'lt', 'lv', 'it', 'cs'];

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  // Vérifier que la locale est valide
  if (!locales.includes(locale)) {
    notFound();
  }

  // Passer explicitement la locale à getMessages
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="fixed top-4 right-4 z-50">
            <LanguageSwitcher currentLocale={locale} />
          </div>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
