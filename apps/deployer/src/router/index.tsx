import GlobalHeader from '@/components/Header';
import LazyLoad from '@/components/LazyLoad';
import { PdaLayout } from '@gbeata/layout-ui';
import { lazy } from '@loadable/component';
import { createHashRouter } from 'react-router-dom';

const router = createHashRouter([
  {
    path: '',
    element: (
      <>
        <PdaLayout header={<GlobalHeader />} />
      </>
    ),
    children: [
      {
        path: '',
        element: LazyLoad(lazy(() => import('@/views/Home'))),
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
    ],
  },
]);

export default router;
