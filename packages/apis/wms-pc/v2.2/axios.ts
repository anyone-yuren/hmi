import qs from 'qs';

import { createAxios } from '../../https/axios/index';

export const defHttp = createAxios({
  tokenKey: 'wms-global-storage',
  timeout: 120 * 1000,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export const get = (url: string, params?: any) =>
  defHttp.get<any>({
    url,
    params,
    // paramsSerializer: (data: any) => qs.stringify(data, { arrayFormat: 'repeat' }),
  });

export const post = (url: string, data?: any) =>
  defHttp.post<any>({
    url,
    data,
  });

export const put = (url: string, data?: any) =>
  defHttp.put<any>({
    url,
    data,
  });
