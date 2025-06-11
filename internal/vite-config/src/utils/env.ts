import { join } from "node:path";
import dotenv from "dotenv";

import { promises as fs } from "node:fs";
import { existsSync } from "node:fs";
import type { ApplicationPluginOptions } from "../typing";

const getBoolean = (value: string | undefined) => value === "true";

const getString = (value: string | undefined, fallback: string) =>
  value ?? fallback;

const getNumber = (value: string | undefined, fallback: number) =>
  Number(value) || fallback;
/**
 * 获取当前环境下生效的配置文件名
 */
function getConfigFiles() {
  // 前正在运行的 npm 脚本的完整命令 如果运行pnpm dev,值就是vite
  const script = process.env.npm_lifecycle_script as string;
  const reg = new RegExp("--mode ([a-z_\\d]+)");
  const result = reg.exec(script);
  console.log("result", result);
  if (result) {
    const mode = result[1] as string;
    return [".env", `.env.${mode}`];
  }
  return [".env", ".env.production"];
}

/**
 * 根据提供的匹配模式和配置文件获取环境配置。
 *
 * @param {string} [match="VITE_GLOB_"] - 用于过滤环境配置键的匹配模式。
 * @param {string[]} [confFiles=getConfigFiles()] - 从中读取环境配置的配置文件。
 * @return {Promise<{ [key: string]: string }>} - 一个解析为包含环境配置的对象的 Promise。
 */
export async function getEnvConfig<T = Record<string, string>>(
  match = "VITE_GLOB_",
  confFiles = getConfigFiles()
): Promise<{ [key: string]: string }> {
  let envConfig = {};

  for (const confFile of confFiles) {
    try {
      const confFilePath = join(process.cwd(), confFile);
      if (existsSync(confFilePath)) {
        const envPath = await fs.readFile(confFilePath, {
          encoding: "utf8",
        });
        const env = dotenv.parse(envPath);
        envConfig = { ...envConfig, ...env };
      }
    } catch (error) {
      console.error(`Error while parsing ${confFile}`, error);
    }
  }
  const reg = new RegExp(`^(${match})`);
  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key);
    }
  });
  console.log("last envConfig", envConfig);
  return envConfig as T;
}

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
  const script = process.env.npm_lifecycle_script as string;
  console.log("script", script);
  const reg = /--mode ([\d_a-z]+)/;
  const result = reg.exec(script);
  let mode = "production";
  if (result) {
    mode = result[1] as string;
  }
  return [".env", `.env.${mode}`];
}

export async function loadAndConvertEnv(
  match = "VITE_",
  confFiles = getConfFiles()
): Promise<
  Partial<ApplicationPluginOptions> & {
    appTitle: string;
    base: string;
    port: number;
  }
> {
  console.log("confFiles", confFiles);
  const envConfig = await getEnvConfig(match, confFiles);
  console.log("envConfig", envConfig);

  const {
    VITE_APP_TITLE,
    VITE_ARCHIVER,
    VITE_BASE,
    VITE_COMPRESS,
    VITE_DEVTOOLS,
    VITE_INJECT_APP_LOADING,
    VITE_NITRO_MOCK,
    VITE_PORT,
    VITE_PWA,
    VITE_VISUALIZER,
  } = envConfig;

  console.log(VITE_INJECT_APP_LOADING, "是否全局loading");

  const compressTypes = (VITE_COMPRESS ?? "")
    .split(",")
    .filter((item) => item === "brotli" || item === "gzip");
  return {
    appTitle: getString(VITE_APP_TITLE, "劢微汇总平台"),
    archiver: getBoolean(VITE_ARCHIVER),
    base: getString(VITE_BASE, "/"),
    compress: compressTypes.length > 0,
    compressTypes,
    devtools: getBoolean(VITE_DEVTOOLS),
    injectAppLoading: getBoolean(VITE_INJECT_APP_LOADING),
    nitroMock: getBoolean(VITE_NITRO_MOCK),
    port: getNumber(VITE_PORT, 5173),
    pwa: getBoolean(VITE_PWA),
    visualizer: getBoolean(VITE_VISUALIZER),
  };
}
