// eslint-disable-next-line import/no-extraneous-dependencies
import { lazy } from '@loadable/component';
// import type { LoaderFunction, NonIndexRouteObject, RouteObject } from 'react-router-dom';

import LazyLoad from '../components/LazyLoad';

// import AuthenticatedRoute from '../hooks/permission';

// import type { RouteObject } from '../types';

const DeviceInfo = lazy(() => import('../components/info'));
const DeviceAnalytics = lazy(() => import('../components/analytics'));

// import ErrorBoundary from '@/components/ErrorBoundary';
// Home route
const HomeRoute = [
  {
    path: 'analytics',
    element: LazyLoad(DeviceAnalytics),
    index: true,
    meta: {
      title: 'menu.home',
      key: 'analytics',
      icon: 'home',
      orderNo: 1,
      hideChildrenInMenu: true,
    },
  },
  {
    path: 'info/:id',
    element: LazyLoad(DeviceInfo),
    meta: {
      title: 'menu.home',
      key: 'info',
      icon: 'home',
      orderNo: 1,
      hideMenu: true,
    },
    // async lazy() {
    //   const Home = lazy(() => import('@/views/home/index'));
    //   return {
    //     Component: Home,
    //     meta: {
    //       title: '首页',
    //       key: 'home',
    //       icon: 'home',
    //       orderNo: 1,
    //       hideMenu: true,
    //     },
    //   };
    // },
  },
];

export default HomeRoute;
