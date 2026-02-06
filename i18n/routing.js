import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en', 'de', 'nl', 'fi', 'es', 'pl', 'pt', 'sk', 'bg', 'el', 'sl', 'lt', 'lv', 'it', 'cs'],
  defaultLocale: 'fr',
});
