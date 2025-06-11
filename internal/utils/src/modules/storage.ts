import type { StorageEnum } from "../../types/enum";

export const getItem = <T>(key: StorageEnum): T | null => {
  let value = null;
  try {
    const result = window.localStorage.getItem(key);
    if (result !== null && result !== "undefined") {
      value = JSON.parse(result);
    }
  } catch (error) {
    console.error(error);
  }
  return value;
};

export const getStringItem = (key: StorageEnum): string | null => {
  return localStorage.getItem(key);
};

export const setItem = <T>(key: StorageEnum, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
export const removeItem = (key: StorageEnum): void => {
  localStorage.removeItem(key);
};
export const clearItems = () => {
  localStorage.clear();
};

export const getStorageTokenFromKey = (key?: string) => {
  if (!key) return "";
  const store = JSON.parse(localStorage.getItem(key) as string);
  return store?.state?.token;
};

export const removeStoreTokenFromKey = (key: string) => {
  // 401的时候,删除当前系统的key,如果不行，就算了
  const store = JSON.parse(localStorage.getItem(key) as string);
  if (store && store.state && store.state.token) {
    delete store.state.token;
    localStorage.setItem(key, JSON.stringify(store));
  }
};

export const removeStoreToken = () => {
  // 去除所有系统的token 根据当前系统的命名规则来,含有global-storage的则带有token
  const keys: string[] = Object.keys(localStorage).filter((key) => {
    return key.includes("global-storage");
  });
  if (!keys.length) return;
  keys.forEach((key) => {
    removeStoreTokenFromKey(key);
  });
};
