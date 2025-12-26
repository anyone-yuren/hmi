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
        path: 'ftp',
        element: LazyLoad(lazy(() => import('@/views/Ftp'))),
      },
      {
        path: 'toolDashboard',
        element: LazyLoad(lazy(() => import('@/views/ToolDashboard'))),
      },
      {
        path: 'models',
        element: LazyLoad(lazy(() => import('@/views/Models'))),
      },
      {
        path: 'mapEditor',
        element: LazyLoad(lazy(() => import('@/views/MapEditor'))),
      },

      {
        path: 'parameters',
        element: LazyLoad(lazy(() => import('@/views/Parameters'))),
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
  // {
  //   path: 'safetyPointsCloud',
  //   element: LazyLoad(lazy(() => import('@/views/Safety/safety'))),
  // },
]);

export default router;
