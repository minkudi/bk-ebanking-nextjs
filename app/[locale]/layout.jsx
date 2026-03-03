// app/[locale]/layout.jsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import AuthLanguageWrapper from "./AuthLanguageWrapper";

const locales = [
  "fr",
  "en",
  "de",
  "nl",
  "fi",
  "es",
  "pl",
  "pt",
  "sk",
  "bg",
  "el",
  "sl",
  "lt",
  "lv",
  "it",
  "cs",
];

export default async function LocaleLayout({ children, params }) {
  // ICI il faut bien await, comme le dit l’erreur
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthLanguageWrapper locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}
