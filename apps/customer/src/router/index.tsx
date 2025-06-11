import { createHashRouter } from 'react-router-dom';

import ApplyContainer from '@/views/ApplyContainer';
import Home from '@/views/Home';
import MePage from '@/views/Me';
import MultiApplyContainer from '@/views/MultiApplyContainer';
import OutPage from '@/views/Out';
import SummonContainer from '@/views/SummonContainer';
import TaskPage from '@/views/Task';
import BindPage from '@/views/bind';
import HandingContainer from '@/views/handingContainer';
import UnbindPage from '@/views/unbind';
import { PdaLayout } from '@gbeata/layout-ui';

const router = createHashRouter([
  {
    path: '',
    element: <PdaLayout title='仓库管理系统' />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'task',
        element: <TaskPage />,
      },
      {
        path: 'bind',
        element: <BindPage />,
      },
      {
        path: 'unbind',
        element: <UnbindPage />,
      },
      {
        path: 'ins',
        element: <OutPage />,
      },
      {
        path: 'summonContainer',
        element: <SummonContainer />,
      },
      {
        path: 'multiApplyContainer',
        element: <MultiApplyContainer />,
      },
      {
        path: 'applyContainer',
        element: <ApplyContainer />,
      },
      {
        path: 'handingContainer',
        element: <HandingContainer />,
      },
      {
        path: '/me',
        element: <MePage />,
      },
    ],
  },
]);

export default router;
