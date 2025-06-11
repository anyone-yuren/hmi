import { createHashRouter } from 'react-router-dom';

import Home from '@/views/Home';
import TaskPage from '@/views/Task';
import { PdaLayout } from '@gbeata/layout-ui';

const router = createHashRouter([
  {
    path: '',
    element: <PdaLayout title='HMI' />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'task',
        element: <TaskPage />,
      },
    ],
  },
]);

export default router;
