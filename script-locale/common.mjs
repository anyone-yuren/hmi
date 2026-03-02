import { getCurrentPath } from "./utils.mjs";

// 默认配置，可增加语言
const languageMap = {
  "zh-CN": "中文",
  "en-US": "英语",
  "fr-FR": "法语",
  "ko-KR": "韩语",
  "ja-JP": "日语",
  "es-ES": "西班牙语",
};
export const baseLanguageMap = Object.entries(languageMap).reduce(
  (acc, [key, value]) => {
    return {
      ...acc,
      [key]: value,
      [value]: key,
    };
  },
  {},
);

export const hmiFilename = "HMI250930-G1多语言翻译.xlsx";
export const hmiLocalePaths = [
  "/packages/locales/locales/zh-CN/index.json",
  "/packages/locales/locales/en-US/index.json",
  "/packages/locales/locales/fr-FR/index.json",
  "/packages/locales/locales/ko-KR/index.json",
  "/packages/locales/locales/ja-JP/index.json",
  "/packages/locales/locales/es-ES/index.json",
];
export const hmiRegex = /\/packages\/locales\/locales\/(.*)\//;
export const hmiOutputPath = getCurrentPath(hmiFilename);
export const hmiMap = {
  ...baseLanguageMap,
};
