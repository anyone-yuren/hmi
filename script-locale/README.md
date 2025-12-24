## 多语言转换脚本

### 介绍

本脚本用于将多语言JSON文件输出转为Excel文件或将多语言的Excel文件转为JSON文件。

### 使用方法

##### 1. 将多语言JSON文件输出转为Excel文件：

```
pnpm locale2excel
```

##### 2. 将多语言的Excel文件转为JSON文件：

```
pnpm excel2locale
```

##### 3. common.mjs

配置当前转换的配置

```
// 默认配置，可增加语言
const languageMap = {
  'zh-CN': '中文',
  'en-US': '英语',
  'fr-FR': '法语',
  'ko-KR': '韩语',
  'ja-JP': '日语',
}
export const baseLanguageMap = Object.entries(languageMap).reduce((acc, [key, value]) => {
  return {
    ...acc,
    [key]: value,
    [value]: key,
  }
}, {})


export const hmiFilename = 'WMS多语言翻译.xlsx'
export const hmiLocalePaths = [
  '/packages/locales/locales/zh-CN/index.json',
  '/packages/locales/locales/en-US/index.json',
  '/packages/locales/locales/fr-FR/index.json',
  '/packages/locales/locales/ko-KR/index.json',
  '/packages/locales/locales/ja-JP/index.json',
]

export const dashboardFilename = '工作台多语言翻译.xlsx'
export const dashboardLocalePaths = [
  '/apps/dashboard/src/i18n/locales/lang/zh-CN/index.json',
  '/apps/dashboard/src/i18n/locales/lang/en-US/index.json',
  '/apps/dashboard/src/i18n/locales/lang/fr-FR/index.json',
  '/apps/dashboard/src/i18n/locales/lang/ko-KR/index.json',
  '/apps/dashboard/src/i18n/locales/lang/ja-JP/index.json',
]
```

### 示例

```
pnpm locale2excel
```

将在`script-locale`目录下生成`WMS多语言翻译.xlsx`文件。

```
pnpm excel2locale
```

将在`packages`目录下的`locales/locales`目录，更新包含`zh-CN/index.json`、`en-US/index.json`、`fr-FR/index.json`、`ko-KR/index.json`、`ja-JP/index.json`五个多语言的JSON文件。

将在`apps/dashboard/src/i18n/locales/lang`目录下，更新包含`zh-CN/index.json`、`en-US/index.json`、`fr-FR/index.json`、`ko-KR/index.json`、`ja-JP/index.json`五个多语言的JSON文件。
