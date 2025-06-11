import { Modal } from "antd";
import { removeStoreToken, removeStoreTokenFromKey } from "./storage";

export const setCookie = (
  name: string,
  value: string,
  days: number,
  domain?: string
) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  let domainStr = "";
  if (domain) {
    domainStr = `; domain=${domain}`;
  } else {
    const obj = getDomain();
    domainStr = `; domain=${obj.tld}`;
  }
  document.cookie = `${name}=${value || ""}${expires}${domainStr}; path=/;`;
};

export const getDomain = (url?: string) => {
  const hostname = url || window.location.hostname;
  const parts = hostname.split(".");
  const obj = { tld: "", sld: "" };
  if (isIPAddress(hostname)) {
    return {
      tld: hostname,
      sld: hostname,
    };
  }
  if (parts.length >= 2) {
    obj.tld = parts.slice(-2).join(".");
  }
  if (parts.length >= 3) {
    obj.sld = parts.slice(-3).join(".");
  }
  return obj;
};

export const isIPAddress = (hostname: string): boolean => {
  // 检查是否为IPv4地址
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Pattern.test(hostname)) {
    return hostname
      .split(".")
      .every((octet) => parseInt(octet) >= 0 && parseInt(octet) <= 255);
  }

  // 检查是否为IPv6地址
  const ipv6Pattern = /^(([0-9a-fA-F]{1,4}):){7}([0-9a-fA-F]{1,4})$/;
  return ipv6Pattern.test(hostname);
};

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

export const clearAllCookies = () => {
  const cookies = document.cookie.split(";");
  cookies.forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
  });
};
export const clearCookie = (name: string) => {
  console.log("开始清除cookie", name);
  const domain = getDomain();
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain.tld}`;
};

export const redirectToLogin = (key?: string) => {
  // 重定向会清除cookie 再看看
  console.log("keys", key, window.location);
  let callbackUrl = "";
  const { origin, pathname, hash } = window.location;
  if (hash.indexOf("redirect_uri") > -1) return; // 防止重复跳 看看会不会有什么问题
  // 先写本地的 部署后先换测试环境的
  if ((import.meta as any).env.MODE === "development") {
    callbackUrl = `http://auth.multiway-cloud.com/dashboard/#/login?redirect_uri=${encodeURI(origin + pathname + hash)}`;
    // callbackUrl = `http://work.multiway-cloud.com:5188/#/login?redirect_uri=${encodeURI(origin + pathname + hash)}`;
    // callbackUrl = `http://www.c25010.logistics.multiway-cloud.com:7216/dashboard/#/login?redirect_uri=${encodeURI(origin + pathname + hash)}`
  } else {
    callbackUrl = `${origin}/dashboard/#/login?redirect_uri=${encodeURI(origin + pathname + hash)}`;
  }
  if (key) {
    removeStoreTokenFromKey(key);
  } else {
    clearCookie("code");
    clearCookie("access_token");
    removeStoreToken();
  }
  const mode = localStorage.getItem("mode");
  mode && mode === "dev"
    ? Modal.confirm({
        content: "是否转跳到登录页",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          window.location.href = callbackUrl;
        },
        onCancel() {
          console.log("Cancel");
        },
      })
    : window.location.replace(callbackUrl);
};
