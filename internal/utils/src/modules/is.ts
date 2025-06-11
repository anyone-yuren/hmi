export { cloneDeep, isFunction } from "lodash-es";
const { toString } = Object.prototype;
/**
 * 检查给定的值是否为指定的类型。
 *
 * @param {unknown} val - 要检查的值。
 * @param {string} type - 要检查的类型。
 * @return {boolean} 如果值是指定类型，则返回true，否则返回false。
 */
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}

export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, "Object");
}

export function isNumber(val: unknown): val is number {
  return is(val, "Number");
}

export function isString(val: unknown): val is string {
  return is(val, "String");
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== "undefined";
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val);
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val);
}

export function isUrl(path: string): boolean {
  const reg =
    // eslint-disable-next-line no-useless-escape
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}

export const isServer = typeof window === "undefined";

export const isClient = !isServer;

export const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  ) || navigator.userAgent.includes("Mobile");
