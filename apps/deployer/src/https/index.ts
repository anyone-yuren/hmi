import { message } from 'antd';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

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

const PORT_BASEURL = {
  10009: BASE_API,
  10001: ADMIN_API,
  10020: TOOL_API,
};

// 创建 axios 实例
const instance = axios.create({
  baseURL: BASE_API, // 设置默认 baseURL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 这里可以统一携带 token
    const token = localStorage.getItem('token');
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

    const { code, message: msg, data: resData } = data;

    if (code === ResultEnum.SUCCESS) {
      return resData;
    }

    // 登录超时
    if (code === ResultEnum.TIMEOUT) {
      message.error('登录超时，请重新登录');
      // 可以跳转登录页或者清空 token
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(msg);
    }

    // 其他错误
    message.error(msg || '接口请求异常');
    return Promise.reject(msg || '接口请求异常');
  },
  (error) => {
    // 处理 HTTP 错误状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error('未授权，请重新登录');
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error(error.response.data.message || '请求失败');
      }
    } else if (error.request) {
      message.error('请求超时，请检查网络连接');
    } else {
      message.error('请求失败');
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

export default instance;
