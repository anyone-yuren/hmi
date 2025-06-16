import { createHashRouter } from 'react-router-dom';

import GlobalHeader from '@/components/Header';
import Home from '@/views/Home';
import Maintenance from '@/views/maintenance';
import Setting from '@/views/Setting';
import { PdaLayout } from '@gbeata/layout-ui';

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
        element: <Home />,
      },
      {
        path: 'maintenance',
        element: <Maintenance />,
      },
      {
        path: 'setting',
        element: <Setting />,
      },
    ],
  },
]);

export default router;
