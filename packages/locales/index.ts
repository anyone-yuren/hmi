import enUS from './locales/en-US';
import frFR from './locales/fr-FR';
import jaJP from './locales/ja-JP';
import koKR from './locales/ko-KR';
import zhCN from './locales/zh-CN';
import origin from './origin.json';
console.log('[locales]', jaJP, origin);

function replaceChineseValuesWithJapanese(obj: any, chineseToJapaneseMap: Record<string, string>): any {
  if (typeof obj === 'string') {
    // 如果是字符串，检查是否在映射中有对应的日文翻译
    return chineseToJapaneseMap[obj] || obj;
  } else if (Array.isArray(obj)) {
    // 如果是数组，递归处理每个元素
    return obj.map((item) => replaceChineseValuesWithJapanese(item, chineseToJapaneseMap));
  } else if (typeof obj === 'object' && obj !== null) {
    // 如果是对象，递归处理每个属性值
    const result: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = replaceChineseValuesWithJapanese(obj[key], chineseToJapaneseMap);
      }
    }
    return result;
  }
  // 其他类型直接返回
  return obj;
}

function translateJaJPWithOrigin(jaJP: any, origin: Record<string, string>): any {
  // 直接使用origin作为映射对象（中文key -> 日文value）
  return replaceChineseValuesWithJapanese(jaJP, origin);
}

const translatedJaJP = translateJaJPWithOrigin(jaJP, origin);

console.log('[locales]', JSON.stringify(translatedJaJP));

export default {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'fr-FR': frFR,
};
