import request from 'umi-request';

import { Api } from './Api';

// 暴露modules文件夹中的所有模块状态
export * from './https/axios';
export * from './modules';

// 暴露modules文件夹中的所有模块状态

export const service = new Api({
  baseURL: '/api/v2/rcs',
  format: 'json',
});

service.instance.interceptors.response.use((res) => res.data);

export default request;
