import excelToJson from "convert-excel-to-json";
import pkg from "lodash";
import fs from "node:fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import {
  baseLanguageMap,
  hmiFilename,
  hmiLocalePaths,
  hmiMap,
  hmiRegex,
} from "./common.mjs";
import { getCurrentPath, getFlatDataMap } from "./utils.mjs";
const { merge } = pkg;

const __dirname = dirname(fileURLToPath(import.meta.url));

const wmsSourcePath = getCurrentPath(hmiFilename);

const convertKey2Json = (keyStr, value) => {
  const keys = keyStr.split(".");

  const result = keys.reduceRight((acc, key, index, arr) => {
    if (index === arr.length - 1) {
      return { [key]: value };
    }
    return { [key]: acc };
  }, {});

  return result;
};

const generateJson = ({ sourceFile, localePaths, languageMap, regex }) => {
  try {
    const { flatDataMap, xlsTitle } = getFlatDataMap({
      localePaths,
      languageMap,
      regex,
    });

    const result = excelToJson({
      sourceFile,
    });
    const [, { A: key, ...keyMap }, ...data] = result["Sheet 1"];
    let list = data.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => {
          if (key === "A") {
            return ["key", value];
          }
          return [baseLanguageMap[keyMap[key]], value];
        })
      )
    );

    // 移除已存在的翻译
    const excelKeys = list.map((row) => row.key);
    const nextDataMap = {
      ...flatDataMap,
    };
    for (let key in flatDataMap) {
      if (excelKeys.includes(key)) {
        delete nextDataMap[key];
      }
    }
    // 合并已存在，但Excel中没有的翻译
    const prevList = Object.values(nextDataMap).reduce((acc, cur) => {
      const item = cur.reduce((subAcc, subCur, index) => {
        if (index === 0) {
          return {
            ...subAcc,
            key: subCur,
          };
        }
        return {
          ...subAcc,
          [baseLanguageMap[xlsTitle[index]]]: subCur,
        };
      }, {});
      return [...acc, item];
    }, []);
    list = [...list, ...prevList];

    const res = list.reduce((acc, row) => {
      const { key, ...subKeyMap } = row;
      const map = Object.entries(subKeyMap).reduce(
        (subAcc, [subKey, value]) => {
          if (!subAcc[subKey]) {
            return {
              ...subAcc,
              [subKey]: convertKey2Json(key, value),
            };
          }
          return {
            ...subAcc,
            [subKey]: {
              ...subAcc[subKey],
              ...convertKey2Json(key, value),
            },
          };
        },
        {}
      );
      Object.entries(map).forEach(([subKey, value]) => {
        if (!acc[subKey]) {
          acc[subKey] = value;
        } else {
          acc[subKey] = merge(acc[subKey], value);
        }
      });
      return acc;
    }, {});

    const paths = localePaths.map((p) => path.join(__dirname, "../", p));
    Object.entries(res).forEach(([key, value]) => {
      const p = paths.find((p) => p.includes(key));
      fs.writeFileSync(p, JSON.stringify(value, null, 2));
    });
  } catch (error) {
    console.error("Error parsing Excel file:", error);
  }
};

generateJson({
  sourceFile: wmsSourcePath,
  localePaths: hmiLocalePaths,
  regex: hmiRegex,
  languageMap: hmiMap,
});
