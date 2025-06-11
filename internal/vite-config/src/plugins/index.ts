import react from "@vitejs/plugin-react-swc";
import { type PluginOption } from "vite";
import { createHtmlPlugin as viteHtmlPlugin } from "vite-plugin-html";
import progress from "vite-plugin-progress";
import { VitePWA } from "vite-plugin-pwa";
import {
  ApplicationPluginOptions,
  CommonPluginOptions,
  ConditionPlugin,
} from "../typing";
import { createAppConfigPlugin } from "./appConfig";
import { viteInjectAppLoadingPlugin } from "./inject-app-loading";
import { configSvgIconsPlugin } from "./svgSprite";

interface Options {
  isBuild: boolean;
  root: string;
  compress: string;
  enableAnalyze?: boolean;
  enableMock?: boolean;
}

async function createPlugins({
  isBuild,
  root,
  compress,
  enableAnalyze,
  enableMock,
}: Options): Promise<PluginOption[]> {
  const vitePlugins: (PluginOption | PluginOption[])[] = [react()];

  const appConfigPlugin = await createAppConfigPlugin({
    root,
    isBuild,
  });
  vitePlugins.push(appConfigPlugin);

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin({ isBuild }));

  // if (enableMock) {
  //   vitePlugins.push(configMockPlugin({ isBuild, root }));
  // }
  return vitePlugins;
}

/**
 * 获取条件成立的 vite 插件
 * @param conditionPlugins
 */
async function loadConditionPlugins(conditionPlugins: ConditionPlugin[]) {
  const plugins: PluginOption[] = [];
  for (const conditionPlugin of conditionPlugins) {
    if (conditionPlugin.condition) {
      const realPlugins = await conditionPlugin.plugins();
      plugins.push(...realPlugins);
    }
  }
  return plugins.flat();
}
/**
 * 根据条件获取通用的vite插件
 */
async function loadCommonPlugins(
  options: CommonPluginOptions
): Promise<ConditionPlugin[]> {
  const { devtools, injectMetadata, isBuild, visualizer } = options;
  return [
    {
      condition: true,
      plugins: () => [progress()],
    },

    // {
    //   condition: !isBuild && devtools,
    //   plugins: () => [viteVueDevTools()],
    // },
    // {
    //   condition: injectMetadata,
    //   plugins: async () => [await viteMetadataPlugin()],
    // },
    // {
    //   condition: isBuild && !!visualizer,
    //   plugins: () => [<PluginOption>viteVisualizerPlugin({
    //       filename: "./node_modules/.cache/visualizer/stats.html",
    //       gzipSize: true,
    //       open: true,
    //     })],
    // },
  ];
}

/**
 * 根据条件获取应用类型的vite插件
 */
async function loadApplicationPlugins(
  options: ApplicationPluginOptions
): Promise<PluginOption[]> {
  // 单独取，否则commonOptions拿不到
  const isBuild = options.isBuild;
  const env = options.env;

  const {
    archiver,
    archiverPluginOptions,
    compress,
    compressTypes,
    extraAppConfig,
    html,
    i18n,
    importmap,
    importmapOptions,
    injectAppLoading,
    license,
    nitroMock,
    nitroMockOptions,
    print,
    printInfoMap,
    pwa,
    pwaOptions,
    vxeTableLazyImport,
    root,
    ...commonOptions
  } = options;

  const commonPlugins = await loadCommonPlugins(commonOptions);

  return await loadConditionPlugins([
    ...commonPlugins,
    {
      condition: !!html,
      plugins: () => {
        return [viteHtmlPlugin({ minify: true })];
      },
    },
    // {
    //   condition: vxeTableLazyImport,
    //   plugins: async () => {
    //     return [await viteVxeTableImportsPlugin()];
    //   },
    // },
    {
      condition: injectAppLoading,
      plugins: async () => [await viteInjectAppLoadingPlugin(!!isBuild, env)],
    },
    {
      condition: pwa,
      plugins: async () => {
        console.log("pwaOptions", pwaOptions, "pwa", pwa);
        return [
          VitePWA({
            injectRegister: false,
            workbox: {
              globPatterns: [],
            },
            ...pwaOptions,
            manifest: {
              display: "standalone",
              name: "gbeata",
              short_name: "nyg",
              start_url: "/",
              theme_color: "#ffffff",
              ...pwaOptions?.manifest,
            },
          }),
        ];
      },
    },
  ]);
}

export { createPlugins, loadApplicationPlugins };
