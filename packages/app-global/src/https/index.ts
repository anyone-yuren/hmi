import { useGlobalStore } from '@gbeata/store';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { t } from 'i18next';
import { toast } from 'sonner';
import ErrorMessageManager from './errorMessage';
// 统一的响应枚举
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 500,
  TIMEOUT = 401,
}

// 动态获取当前 host
const currentHost = window.location.hostname;

const BASE_API = import.meta.env.VITE_BASE_API || `http://${currentHost}:10009`;
const ADMIN_API = import.meta.env.VITE_ADMIN_API || `http://${currentHost}:10001`;
const TOOL_API = import.meta.env.VITE_TOOL_API || `http://${currentHost}:10020`;
const VISION_API = import.meta.env.VITE_VISION_API || `http://${currentHost}:10010`;
const RCS_WEB_API = import.meta.env.VITE_RCS_WEB_API || `http://${currentHost}:10009`;

const PORT_BASEURL = {
  10009: BASE_API,
  10001: ADMIN_API,
  10020: TOOL_API,
  10010: VISION_API,
  25018: RCS_WEB_API,
};

// 创建 axios 实例
const instance = axios.create({
  baseURL: BASE_API, // 设置默认 baseURL
  timeout: 1000 * 60 * 2,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

const manager = new ErrorMessageManager();
// 请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const { resetSessionTimeout } = useGlobalStore.getState();
    resetSessionTimeout();
    // 这里可以统一携带 token
    const token = localStorage.getItem('token');
    if (config.url?.includes('/login')) {
      return config;
    }
    // if (!token) {
    //   triggerLoginModal();
    // }

    // if (config.url?.includes('/rcs-web')) {
    if (config.baseURL === RCS_WEB_API) {
      // RCS 特殊处理
      config.headers = config.headers || {};
      config.headers['Content-Type'] = `application/json; charset=utf-8`;
      return config;
    }
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, config } = response;
    // 如果没有 code 字段，直接返回原始数据（适配数组或对象）
    if (!data || typeof data === 'string' || !('code' in data)) {
      return data;
    }
    const { code, msg, message, data: resData } = data;
    // if (config.url?.includes('/rcs-web')) {
    if (config.baseURL === RCS_WEB_API) {
      if (code === 0) {
        return data;
      } else {
        toast.error(message, {
          position: 'top-center',
        });
        return Promise.reject(message || t('common.http.error'));
      }
    }
    if (code === ResultEnum.SUCCESS) {
      return data;
    }
    // 登录超时
    if (code === ResultEnum.TIMEOUT) {
      // message.error(msg);
      toast.error(msg, {
        position: 'top-center',
      });
      // 可以跳转登录页或者清空 token
      localStorage.removeItem('token');
      // window.location.href = '/login';
      return Promise.reject(msg);
    }

    // 其他错误
    toast.error(t('common.http.error'), {
      position: 'top-center',
    });
    return Promise.reject(msg || t('common.http.error'));
  },
  (error) => {
    // 处理 HTTP 错误状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error(t('common.http.withoutAuth'), {
            position: 'top-center',
          });
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          toast.error(t('common.http.refused'), {
            position: 'top-center',
          });
          break;
        case 404:
          toast.error(t('common.http.notFound'), {
            position: 'top-center',
          });
          break;
        case 500:
          // message.error(t('common.http.serverError'));
          // 暂时只启用这一个,防止多次弹窗。其他有需要可以按需加。
          manager.push(t('common.http.serverError'));
          break;
        default:
          toast.error(error?.response?.data?.message || t('common.http.fail'), {
            position: 'top-center',
          });
      }
    } else if (error.request) {
      manager.push(t('common.http.timeout'));
    } else {
      toast.error(t('common.http.fail'), {
        position: 'top-center',
      });
    }
    return Promise.reject(error);
  },
);

// GET 封装
export const get = (url: string, params?: any, port: string = '10009') => {
  return instance.get(url, {
    baseURL: PORT_BASEURL[port],
    params,
  });
};

// POST 封装
export const post = (url: string, data?: any, port: string = '10009') => {
  return instance.post(url, data, {
    baseURL: PORT_BASEURL[port],
  });
};

export const del = (url: string, data?: any, port: string = '10009') => {
  return instance.delete(url, {
    baseURL: PORT_BASEURL[port],
  });
};

export const put = (url: string, data?: any, port: string = '10009') => {
  return instance.put(url, data, {
    baseURL: PORT_BASEURL[port],
  });
};

export default instance;
