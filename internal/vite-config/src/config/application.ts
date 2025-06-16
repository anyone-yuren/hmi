import { resolve } from "path";

import dayjs from "dayjs";
import { readPackageJSON } from "pkg-types";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv, mergeConfig, type UserConfig } from "vite";
import { getDefaultPwaOptions } from "../options";
import { createPlugins, loadApplicationPlugins } from "../plugins";
import { loadAndConvertEnv } from "../utils/env";
import { commonConfig } from "./common";

interface DefineOptions {
  overrides?: UserConfig;
  options?: {};
}

function defineApplicationConfig(options: DefineOptions = {}) {
  const { overrides = {}, options: overrideOptions } = options;

  return defineConfig(async ({ command, mode }) => {
    const root = process.cwd();
    const { TURBO_INVOCATION_DIR } = process.env;
    const isBuild = command === "build";
    const { appTitle, base, port, ...envConfig } = await loadAndConvertEnv();
    const {
      VITE_PUBLIC_PATH,
      VITE_USE_MOCK,
      VITE_BUILD_COMPRESS,
      VITE_ENABLE_ANALYZE,
    } = loadEnv(mode, root);
    const defineData = await createDefineData(root);

    const otherPlugins = await loadApplicationPlugins({
      archiver: true,
      archiverPluginOptions: {},
      compressTypes: ["brotli", "gzip"],
      devtools: true,
      extraAppConfig: true,
      html: true,
      i18n: true,
      injectAppLoading: true,
      injectMetadata: true,
      isBuild,
      license: true,
      mode,
      nitroMock: !isBuild,
      nitroMockOptions: {},
      print: !isBuild,
      printInfoMap: {
        "gbeata admin": "",
      },
      pwa: false,
      pwaOptions: getDefaultPwaOptions(appTitle),
      vxeTableLazyImport: true,
      compress: true,
      ...envConfig,
    });

    const plugins = await createPlugins({
      isBuild,
      root,
      enableAnalyze: VITE_ENABLE_ANALYZE === "true",
      enableMock: VITE_USE_MOCK === "true",
      compress: VITE_BUILD_COMPRESS,
    });

    const pathResolve = (path: string) => {
      return resolve(root, path);
    };
    const timestamp = new Date().getTime();
    const applicationConfig: UserConfig = {
      base: VITE_PUBLIC_PATH,
      resolve: {
        alias: [
          {
            find: /@\//,
            replacement: pathResolve("src") + "/",
          },
          {
            find: /#\//,
            replacement: pathResolve("types") + "/",
          },
        ],
      },
      define: defineData,
      build: {
        target: "es2015",
        cssTarget: "chrome80",
        minify: "esbuild",
        outDir: TURBO_INVOCATION_DIR + "/" + defineData?.pkg?.name ?? "dist",
        rollupOptions: {
          output: {
            entryFileNames: `assets/entry/[name]-[hash].${timestamp}.js`,
            // 配置大包的分块策略
            manualChunks: {
              react: ["react", "react-router-dom"],
              antd: ["antd", "@ant-design/icons", "antd-style"],
            },
          },
          plugins: [
            visualizer({
              open: true, // 打包完成后自动打开浏览器
              gzipSize: true, // 显示 gzip 压缩大小
              brotliSize: true, // 显示 brotli 压缩大小
            }),
          ],
        },
      },

      css: {
        preprocessorOptions: {
          less: {
            javascriptEnabled: true,
            // modifyVars: generateModifyVars(),
          },
        },
      },
      // esbuild: {
      //   drop: isBuild ? ["console", "debugger"] : [],
      //   legalComments: "none",
      // },
      plugins: [...plugins, ...otherPlugins],
    };
    const common = commonConfig(mode);
    const mergedServer = {
      ...common.server,
      ...applicationConfig.server,
      proxy: {
        ...common.server?.proxy,
        ...applicationConfig.server?.proxy,
      },
    };

    const mergedConfig = mergeConfig(
      { ...common, server: mergedServer },
      applicationConfig
    );
    // const mergedConfig = mergeConfig(commonConfig(mode), applicationConfig);
    return mergeConfig(mergedConfig, overrides);
  });
}

async function createDefineData(root: string) {
  try {
    const pkg = await readPackageJSON(resolve(root, "package.json"));
    const { version, name, dependencies, devDependencies } = pkg;
    const __APP_INFO__ = {
      pkg: { dependencies, devDependencies, version, name },
      lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
    return {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      pkg,
    };
  } catch (error) {
    return {};
  }
}
export { defineApplicationConfig };
