import { message } from 'antd';
import { extend } from 'umi-request';

// 统一的响应枚举
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 500,
  TIMEOUT = 401,
}

// 读取环境变量
const BASE_API = import.meta.env.VITE_BASE_API;
const ADMIN_API = import.meta.env.VITE_ADMIN_API;

// 创建实例
const request = extend({
  // 默认配置
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use((url, options) => {
  // 这里可以统一携带 token
  const token = localStorage.getItem('token');
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  return {
    url,
    options,
  };
});

// 响应拦截器
request.interceptors.response.use(async (response) => {
  const contentType = response.headers.get('Content-Type') || '';
  const isJSON = contentType.includes('application/json');
  let data: any;

  try {
    data = isJSON ? await response.clone().json() : await response.clone().text();
  } catch (error) {
    message.error('服务器返回异常');
    throw error;
  }
  // 如果没有 code 字段，直接返回原始数据（适配数组或对象）
  if (!data || !('code' in data)) {
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
    return;
  }

  // 其他错误
  message.error(msg || '接口请求异常');
  throw new Error(msg || '接口请求异常');
});

// GET 封装
export const get = (url: string, params?: any, isAdmin = false) => {
  return request((isAdmin ? ADMIN_API : BASE_API) + url, {
    method: 'get',
    params,
  });
};

// POST 封装
export const post = (url: string, data?: any, isAdmin = false) => {
  return request((isAdmin ? ADMIN_API : BASE_API) + url, {
    method: 'post',
    data,
  });
};

export default request;
