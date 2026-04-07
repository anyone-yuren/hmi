import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { getStringItem } from '@/utils/storage';
import globalLocales from '@gbeata/locales';

import en_US from './locales/lang/en-US';
import es_ES from './locales/lang/es-ES';
import fr_FR from './locales/lang/fr-FR';
import ja_JP from './locales/lang/ja-JP';
import ko_KR from './locales/lang/ko-KR';
import zh_CN from './locales/lang/zh-CN';
// import tr_TR from './locales/lang/tr-TR';

import { LocalEnum, StorageEnum } from '#/enum';

// 语言码映射：浏览器语言 => 项目内部语言资源 key
const langMap: Record<string, string> = {
  'zh-CN': 'zh_CN',
  en: 'en_US',
  fr: 'fr_FR',
  ja: 'ja_JP',
  ko: 'ko_KR',
  zh_CN: 'zh_CN',
  en_US: 'en_US',
  fr_FR: 'fr_FR',
  ja_JP: 'ja_JP',
  ko_KR: 'ko_KR',
  es_ES: 'es_ES',
  tr_TR: 'tr_TR',
};

// 2️⃣ 再查浏览器语言
const browserLang = navigator.language || (navigator.languages && navigator.languages[0]);

const defaultLng = getStringItem(StorageEnum.I18N) || langMap[browserLang] || (LocalEnum.zh_CN as string);

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    lng: defaultLng, // localstorage -> i18nextLng: en_US
    fallbackLng: LocalEnum.en_US,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    postProcess: ['capitalize'],
    resources: {
      en_US: { translation: { ...en_US, ...globalLocales['en-US'] } },
      zh_CN: { translation: { ...zh_CN, ...globalLocales['zh-CN'] } },
      ja_JP: { translation: { ...ja_JP, ...globalLocales['ja-JP'] } },
      ko_KR: { translation: { ...ko_KR, ...globalLocales['ko-KR'] } },
      fr_FR: { translation: { ...fr_FR, ...globalLocales['fr-FR'] } },
      es_ES: { translation: { ...es_ES, ...globalLocales['es-ES'] } },
      tr_TR: { translation: { ...globalLocales['tr-TR'] } },
    },
  });

i18n.services.formatter?.add('capitalize', (value, lng, options) => {
  if (!value) return '';
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
});

export default i18n;
export const { t } = i18n;
