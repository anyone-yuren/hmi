/* eslint-disable import/no-extraneous-dependencies */
import { defineApplicationConfig } from '@gbeata/vite-config';
import { loadEnv } from 'vite';

const root = process.cwd();

const { VITE_APP_API } = loadEnv(process.env.NODE_ENV as string, root);

export default defineApplicationConfig({
  overrides: {
    define: {
      'import.meta.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'false'),
    },
    optimizeDeps: {
      include: ['@iconify/react', 'lodash-es', 'echarts', 'echarts-for-react'],
    },
    server: {
      // Listening on all local ips
      host: true,
      port: 4000,
      proxy: {
        '/api': {
          target: `http://${VITE_APP_API}:10009`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/admin': {
          target: `http://${VITE_APP_API}:10001`,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/admin/, ''),
        },
        '/tool': {
          target: `http://${VITE_APP_API}:10020`,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/tool/, ''),
        },
        '/vision': {
          target: `http://${VITE_APP_API}:10010`,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/vision/, ''),
        },
        '/ws10001': {
          // 新增 WebSocket 代理
          target: `ws://${VITE_APP_API}:10001`,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ws/, ''),
        },
        '/ws10010': {
          // 新增 WebSocket 代理
          target: `ws://${VITE_APP_API}:10010`,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ws/, ''),
        },
        '/ws10009': {
          target: `ws://${VITE_APP_API}:10009`,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ws10009/, ''),
        },
      },
    },
  },
});
