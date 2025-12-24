import json2xls from "json2xls";
import fs from "node:fs";
import { hmiLocalePaths, hmiMap, hmiOutputPath, hmiRegex } from "./common.mjs";
import { getFlatDataMap } from "./utils.mjs";

const generateXls = ({ outputPath, languageMap, regex, localePaths }) => {
  const { xlsTitle, flatDataMap } = getFlatDataMap({
    localePaths,
    languageMap,
    regex,
  });
  const flatDataList = Object.entries(flatDataMap).map(([_, value]) => value);

  const xlsData = [xlsTitle, ...flatDataList];
  const xls = json2xls(xlsData);

  fs.writeFileSync(outputPath, xls, "binary");
};

generateXls({
  languageMap: hmiMap,
  regex: hmiRegex,
  outputPath: hmiOutputPath,
  localePaths: hmiLocalePaths,
});
