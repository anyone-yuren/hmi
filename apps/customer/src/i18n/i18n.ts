import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { getStringItem } from '@/utils/storage';
import globalLocales from '@gbeata/locales';

import en_US from './locales/lang/en-US';
import fr_FR from './locales/lang/fr-FR';
import ja_JP from './locales/lang/ja-JP';
import ko_KR from './locales/lang/ko-KR';
import zh_CN from './locales/lang/zh-CN';

import { LocalEnum, StorageEnum } from '#/enum';

const defaultLng = getStringItem(StorageEnum.I18N) || (LocalEnum.zh_CN as string);
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
      ko_KR: { translation: ko_KR, ...globalLocales['ko-KR'] },
      fr_FR: { translation: fr_FR, ...globalLocales['fr-FR'] },
    },
  });

i18n.services.formatter?.add('capitalize', (value, lng, options) => {
  if (!value) return '';
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
});

export default i18n;
export const { t } = i18n;
