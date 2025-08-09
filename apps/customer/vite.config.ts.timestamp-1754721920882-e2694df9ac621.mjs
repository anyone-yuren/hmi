// vite.config.ts
import { defineApplicationConfig } from "file:///Users/suironghua/Desktop/multiway_git/vehicle-hmi/internal/vite-config/dist/index.mjs";
import { loadEnv } from "file:///Users/suironghua/Desktop/multiway_git/vehicle-hmi/node_modules/.pnpm/vite@4.5.0_@types+node@20.19.9_less@4.4.0_lightningcss@1.22.1_sass@1.89.2_terser@5.43.1/node_modules/vite/dist/node/index.js";
var root = process.cwd();
var { VITE_APP_API } = loadEnv(process.env.NODE_ENV, root);
var vite_config_default = defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: ["@iconify/react", "lodash-es", "echarts", "echarts-for-react"]
    },
    server: {
      // Listening on all local ips
      host: true,
      port: 4e3,
      proxy: {
        "/api": {
          target: "http://192.168.2.233:10009",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        },
        "/admin": {
          target: "http://192.168.2.233:10001",
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/admin/, "")
        },
        "/ws10001": {
          // 新增 WebSocket 代理
          target: "ws://192.168.2.233:10001",
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ws/, "")
        },
        "/ws10009": {
          target: "ws://192.168.2.233:10009",
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ws10009/, "")
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3Vpcm9uZ2h1YS9EZXNrdG9wL211bHRpd2F5X2dpdC92ZWhpY2xlLWhtaS9hcHBzL2N1c3RvbWVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3Vpcm9uZ2h1YS9EZXNrdG9wL211bHRpd2F5X2dpdC92ZWhpY2xlLWhtaS9hcHBzL2N1c3RvbWVyL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zdWlyb25naHVhL0Rlc2t0b3AvbXVsdGl3YXlfZ2l0L3ZlaGljbGUtaG1pL2FwcHMvY3VzdG9tZXIvdml0ZS5jb25maWcudHNcIjsvKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMgKi9cbmltcG9ydCB7IGRlZmluZUFwcGxpY2F0aW9uQ29uZmlnIH0gZnJvbSAnQGdiZWF0YS92aXRlLWNvbmZpZyc7XG5pbXBvcnQgeyBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5cbmNvbnN0IHJvb3QgPSBwcm9jZXNzLmN3ZCgpO1xuXG5jb25zdCB7IFZJVEVfQVBQX0FQSSB9ID0gbG9hZEVudihwcm9jZXNzLmVudi5OT0RFX0VOViBhcyBzdHJpbmcsIHJvb3QpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVBcHBsaWNhdGlvbkNvbmZpZyh7XG4gIG92ZXJyaWRlczoge1xuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgaW5jbHVkZTogWydAaWNvbmlmeS9yZWFjdCcsICdsb2Rhc2gtZXMnLCAnZWNoYXJ0cycsICdlY2hhcnRzLWZvci1yZWFjdCddLFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICAvLyBMaXN0ZW5pbmcgb24gYWxsIGxvY2FsIGlwc1xuICAgICAgaG9zdDogdHJ1ZSxcbiAgICAgIHBvcnQ6IDQwMDAsXG4gICAgICBwcm94eToge1xuICAgICAgICAnL2FwaSc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4yLjIzMzoxMDAwOScsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG4gICAgICAgIH0sXG4gICAgICAgICcvYWRtaW4nOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguMi4yMzM6MTAwMDEnLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICB3czogdHJ1ZSxcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYWRtaW4vLCAnJyksXG4gICAgICAgIH0sXG4gICAgICAgICcvd3MxMDAwMSc6IHtcbiAgICAgICAgICAvLyBcdTY1QjBcdTU4OUUgV2ViU29ja2V0IFx1NEVFM1x1NzQwNlxuICAgICAgICAgIHRhcmdldDogJ3dzOi8vMTkyLjE2OC4yLjIzMzoxMDAwMScsXG4gICAgICAgICAgd3M6IHRydWUsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC93cy8sICcnKSxcbiAgICAgICAgfSxcbiAgICAgICAgJy93czEwMDA5Jzoge1xuICAgICAgICAgIHRhcmdldDogJ3dzOi8vMTkyLjE2OC4yLjIzMzoxMDAwOScsXG4gICAgICAgICAgd3M6IHRydWUsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC93czEwMDA5LywgJycpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUywrQkFBK0I7QUFDeEMsU0FBUyxlQUFlO0FBRXhCLElBQU0sT0FBTyxRQUFRLElBQUk7QUFFekIsSUFBTSxFQUFFLGFBQWEsSUFBSSxRQUFRLFFBQVEsSUFBSSxVQUFvQixJQUFJO0FBRXJFLElBQU8sc0JBQVEsd0JBQXdCO0FBQUEsRUFDckMsV0FBVztBQUFBLElBQ1QsY0FBYztBQUFBLE1BQ1osU0FBUyxDQUFDLGtCQUFrQixhQUFhLFdBQVcsbUJBQW1CO0FBQUEsSUFDekU7QUFBQSxJQUNBLFFBQVE7QUFBQTtBQUFBLE1BRU4sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLFFBQzlDO0FBQUEsUUFDQSxVQUFVO0FBQUEsVUFDUixRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxJQUFJO0FBQUEsVUFDSixTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsWUFBWSxFQUFFO0FBQUEsUUFDaEQ7QUFBQSxRQUNBLFlBQVk7QUFBQTtBQUFBLFVBRVYsUUFBUTtBQUFBLFVBQ1IsSUFBSTtBQUFBLFVBQ0osY0FBYztBQUFBLFVBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLFNBQVMsRUFBRTtBQUFBLFFBQzdDO0FBQUEsUUFDQSxZQUFZO0FBQUEsVUFDVixRQUFRO0FBQUEsVUFDUixJQUFJO0FBQUEsVUFDSixjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsY0FBYyxFQUFFO0FBQUEsUUFDbEQ7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
