// eslint-disable-next-line import/no-extraneous-dependencies
import { useRcsGlobalStore } from '@gbeata/store';
import { notification } from 'antd';
import { type RequestOptionsInit, extend } from 'umi-request';

import { languageAdapter } from './adapter';

// 全局请求参数设置
const PREFIX = '/api/rcs';
export const request = extend({
  timeout: 60000,
  // 记得区分开发环境与生产环境
  prefix: PREFIX,
});

let isRefreshingToken = false; // 是否正在刷新token
const requestQueue: {
  url: string;
  options: RequestOptionsInit;
  resolve: (value: Response | PromiseLike<Response>) => any;
  reject: (reason?: any) => void;
}[] = []; // 请求队列
request.interceptors.request.use((url, options: RequestOptionsInit) => {
  // const userInfo = storage.getItem('USER_INFO') || '{}';
  const { userInfo = {} } = useRcsGlobalStore.getState();
  const { headers }: any = options;
  headers.Authorization = userInfo?.jwtToken;
  headers.language = languageAdapter(localStorage.getItem('language') || 'zh');
  const languageDict: any = {
    zh_CN: 'zh-Hans',
  };
  console.log("localStorage.getItem('MULTIWAY_LOCALE')", localStorage.getItem('MULTIWAY_LOCALE'));
  headers['Accept-Language'] = languageDict[localStorage.getItem('MULTIWAY_LOCALE')] || 'zh-Hans';
  return {
    url,
    options: {
      ...options,
      headers,
    },
  };
});

request.interceptors.response.use(async (response, options) => {
  const { status } = response;
  if (status === 200) {
    const data = await response.clone().json();
    if (data.code !== 0) {
      notification.error({
        message: '请求错误',
        description: data.msg,
      });
      return Promise.reject(data.msg);
    }
    return data;
  }
  if (status === 401) {
    if (!isRefreshingToken) {
      // 重新登录
      const { userInfo } = useRcsGlobalStore.getState();
      isRefreshingToken = true;
      // 刷新token
      const res = await request('/User/ReLogin', {
        method: 'POST',
        data: userInfo,
      });
      if (res) {
        useRcsGlobalStore.setState({ userInfo: res.data });
        isRefreshingToken = false;
        const response = request(options.url, options);

        // 重新登录后，将队列中的请求重新发出
        requestQueue.forEach((cb) => cb.resolve(request(cb.url, cb.options)));

        return response;
      }
    }
    // 正在刷新token，将返回一个未执行resolve的promise
    return new Promise((resolve, reject) => {
      requestQueue.push({ url: options.url, options, resolve, reject });
    });
  }
  notification.error({
    message: '请求错误',
    description: response.statusText,
  });
  return Promise.reject(response.statusText);
});

export default { request };
