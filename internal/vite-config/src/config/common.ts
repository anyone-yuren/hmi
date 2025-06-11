import { type UserConfig } from "vite";
const commonConfig: (mode: string) => UserConfig = (mode) => {
  return {
    server: {
      host: true,
      proxy: {
        "/messaging-hub": {
          // target: 'ws://192.168.2.119:5203',
          // 192.168.2.135
          target: "ws://192.168.2.186:25007",
          // target: 'ws://192.168.2.132:5203',
          changeOrigin: true,
          ws: true,
          // secure: true
        },
        "/auth": {
          // target: 'http://47.120.1.60:25007/',
          target: "http://auth.multiway-cloud.com/",
          // target: 'http://www.c25010.logistics.multiway-cloud.com:7216',
          changeOrigin: true,
          secure: false,
          // rewrite: (path) => path.replace(/^\/auth/, ''),
        },
      },
    },
    build: {
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        maxParallelFileOps: 3,
      },
      sourcemap: false,
    },
  };
};

export { commonConfig };
