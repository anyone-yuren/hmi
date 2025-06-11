import '@/i18n/i18n';
import '@gbeata/tailwind-config/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'virtual:svg-icons-register';
import App from './app';
import './index.css';

import GlobalProvider from '@/components/GlobalProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalProvider>
      {/* <RouterProvider router={router} /> */}
      <App />
    </GlobalProvider>
  </React.StrictMode>,
);
