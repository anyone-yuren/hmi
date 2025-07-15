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
        element: LazyLoad(
          lazy(() => import('@/views/Home')),
          'Wms.ReceivingOrders',
        ),
      },
      {
        path: 'maintenance',
        element: LazyLoad(
          lazy(() => import('@/views/maintenance')),
          'Wms.ReceivingOrders',
        ),
      },
      {
        path: 'setting',
        element: LazyLoad(
          lazy(() => import('@/views/Setting')),
          'Wms.ReceivingOrders',
        ),
      },
    ],
  },
]);

export default router;
