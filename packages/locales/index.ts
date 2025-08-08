import enUS from './locales/en-US';
import frFR from './locales/fr-FR';
import jaJP from './locales/ja-JP';
import koKR from './locales/ko-KR';
import zhCN from './locales/zh-CN';
import origin from './origin.json';
// origin 是翻译的源文件。每个多语言和这个对比，之前有的就拿出来
// 先不删除，翻译完后删除,以下是对比的方法
function replaceChineseValuesWithJapanese(obj: any, chineseToJapaneseMap: Record<string, string>): any {
  if (typeof obj === 'string') {
    return chineseToJapaneseMap[obj] || obj;
  } else if (Array.isArray(obj)) {
    return obj.map((item) => replaceChineseValuesWithJapanese(item, chineseToJapaneseMap));
  } else if (typeof obj === 'object' && obj !== null) {
    const result: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = replaceChineseValuesWithJapanese(obj[key], chineseToJapaneseMap);
      }
    }
    return result;
  }
  return obj;
}

function translateJaJPWithOrigin(jaJP: any, origin: Record<string, string>): any {
  // 直接使用origin作为映射对象（中文key -> 日文value）
  return replaceChineseValuesWithJapanese(jaJP, origin);
}

const translatedJaJP = translateJaJPWithOrigin(koKR, origin);

console.log('[locales]', JSON.stringify(translatedJaJP));

export default {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'fr-FR': frFR,
};
