import { useTitle as usePageTitle } from 'ahooks';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const searchRoute: any = (path: string, routes: any = []) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of routes) {
    if (item.path === path || item.fullPath === path) return item;
    if (item.children) {
      const result = searchRoute(path, item.children);
      if (result) return result;
    }
  }
  return null;
};

// 监听页面变化和动态改变网站标题
export function useTitle(basicRoutes) {
  const [pageTitle, setPageTitle] = useState('-');
  const { pathname } = useLocation();

  useEffect(() => {
    const currRoute = searchRoute(pathname, basicRoutes);
    setPageTitle(currRoute?.meta?.title);
  }, [pathname]);

  usePageTitle(pageTitle);
}
