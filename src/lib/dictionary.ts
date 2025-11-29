import 'server-only';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  ko: () => import('@/dictionaries/ko.json').then((module) => module.default),
  ja: () => import('@/dictionaries/ja.json').then((module) => module.default),
  th: () => import('@/dictionaries/th.json').then((module) => module.default),
};

export const getDictionary = async (locale: keyof typeof dictionaries) =>
  dictionaries[locale]();
