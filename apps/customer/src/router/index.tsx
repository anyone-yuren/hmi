import { createHashRouter } from 'react-router-dom';

import Home from '@/views/Home';
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
    ],
  },
]);

export default router;
