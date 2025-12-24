import fs from 'node:fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url))

export const getCurrentPath = (filename) => path.join(__dirname, filename);

export const getPath = (filename, dir = '') => path.join(process.cwd(), dir, filename);


const getLanguage = (path, regex) => path.match(regex)[1]
const getFlatData = (json) => {
  const res = Object.entries(json).reduce((acc, [key, value]) => {
    if (typeof value === 'object') {
      const flat = getFlatData(value)
      Object.entries(flat).forEach(([subKey, subValue]) => {
        acc[`${key}.${subKey}`] = subValue
      })
    } else {
      acc[key] = value?.trim() || ''
    }
    return acc
  }, {})
  return res
}
export const getFlatDataMap = ({
  localePaths,
  languageMap,
  regex,
}) => {
  const xlsTitle = ['Key(该列开发专用，勿动)']
  const existLanguage = {}
  const flatDataMap = localePaths.reduce((acc, jsonPath) => {
    const filePath = getPath(jsonPath)
    const data = fs.readFileSync(filePath, 'utf-8')
    const json = JSON.parse(data)

    const language = getLanguage(jsonPath, regex)
    if (!existLanguage[language]) {
      xlsTitle.push(languageMap[language])
      existLanguage[language] = true
    }

    const flat = getFlatData(json)
    Object.entries(flat).forEach(([key, value]) => {
      if (!acc[key]) {
        acc[key] = [key, value]
      } else {
        acc[key] = [...acc[key], value]
      }
    })
    return acc
  }, {})

  return {
    xlsTitle,
    flatDataMap,
  }
}