/**
 *
 * 导出一个languageAdapter函数,该函数会接收当前程序localStorage中的language字段，并将字段适配成后端需要的字段
 * 例如：kor => ko
 * @returns
 */
export const languageAdapter = (language: string) => {
  const languageMap: { [key: string]: string } = {
    kor: 'ko',
    en: 'en',
    zh: 'zh',
    jp: 'ja',
  };
  return languageMap[language] || 'zh';
};
