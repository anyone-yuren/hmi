/**
 * Vite Static Copy Plugin
 *
 */
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
export function configStaticCopyPlugin() {
  const monoRoot =
    process.env.TURBO_INVOCATION_DIR ?? (process.env.INIT_CWD as string);
  const configDir = path.resolve(monoRoot, "config");
  const staticCopyPlugin = viteStaticCopy({
    targets: [
      {
        src: path.resolve(configDir, "**/*"),
        dest: "config",
      },
    ],
  });
  return staticCopyPlugin;
}
