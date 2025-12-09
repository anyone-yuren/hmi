import Footer from '@/components/Footer';
import GlobalHeader from '@/components/Header';
import LazyLoad from '@/components/LazyLoad';
import PageException from '@/components/PageException';
import Top from '@/components/Top';
import { ToolkitLayout } from '@gbeata/layout-ui';
import { lazy } from '@loadable/component';
import { createHashRouter, Navigate } from 'react-router-dom';
export enum ExceptionEnum {
  // page not access
  PAGE_NOT_ACCESS = 403,

  // page not found
  PAGE_NOT_FOUND = 404,

  // server error
  SERVER_ERROR = 500,
}

const router = createHashRouter([
  {
    path: '',
    element: (
      <>
        <ToolkitLayout header={<GlobalHeader />} footer={<Footer />} top={<Top />} />
      </>
    ),
    children: [
      {
        path: '',
        element: LazyLoad(lazy(() => import('@/views/Home'))),
      },
      {
        path: 'dashboard',
        element: LazyLoad(lazy(() => import('@/views/dashboard'))),
      },
      {
        path: 'maintenance',
        element: LazyLoad(lazy(() => import('@/views/maintenance'))),
      },
      {
        path: 'setting',
        element: LazyLoad(lazy(() => import('@/views/Setting'))),
      },
      {
        path: 'slider',
        element: LazyLoad(lazy(() => import('@/views/SliderPage'))),
      },
      {
        path: 'diagnosis',
        element: LazyLoad(lazy(() => import('@/views/Diagnosis'))),
      },
      {
        path: 'hybrid',
        element: LazyLoad(lazy(() => import('@/views/Hybrid'))),
      },
      {
        path: 'io',
        element: LazyLoad(lazy(() => import('@/views/Io'))),
      },
      {
        path: 'safety',
        element: LazyLoad(lazy(() => import('@/views/Safety'))),
      },

      {
        path: 'singleTask',
        element: LazyLoad(lazy(() => import('@/views/SingleTask'))),
      },
      {
        path: 'vision',
        element: LazyLoad(lazy(() => import('@/views/Vision'))),
      },
      {
        path: 'setting',
        element: LazyLoad(lazy(() => import('@/views/Setting'))),
      },
      {
        path: 'about',
        element: LazyLoad(lazy(() => import('@/views/About'))),
      },
      {
        path: 'charging',
        element: LazyLoad(lazy(() => import('@/views/Charging'))),
      },
      {
        path: 'maintenance',
        element: LazyLoad(lazy(() => import('@/views/maintenance'))),
      },
      {
        path: 'network',
        element: LazyLoad(lazy(() => import('@/views/Network'))),
      },
      {
        path: '*',
        element: <Navigate to='/404' />,
      },
      {
        path: '/403',
        element: <PageException />,
        loader: () => ({ status: ExceptionEnum.PAGE_NOT_ACCESS, withCard: false }),
      },
      {
        path: '/404',
        element: <PageException />,
        loader: () => ({ status: ExceptionEnum.PAGE_NOT_FOUND, withCard: false }),
      },
      {
        path: '/500',
        element: <PageException />,
        loader: () => ({ status: ExceptionEnum.SERVER_ERROR, withCard: false }),
      },
    ],
  },
  {
    path: 'models',
    element: LazyLoad(lazy(() => import('@/views/Models'))),
  },
  // {
  //   path: 'safetyPointsCloud',
  //   element: LazyLoad(lazy(() => import('@/views/Safety/safety'))),
  // },
]);

export default router;
