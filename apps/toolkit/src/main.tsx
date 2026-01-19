import '@/i18n/i18n';
import '@gbeata/tailwind-config/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
// @ts-ignore 虚拟模块，由 vite-plugin-svg-icons 注入
import 'virtual:svg-icons-register';
import App from './app';
import './index.css';

import GlobalProvider from '@/components/GlobalProvider';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalProvider>
      {/* <RouterProvider router={router} /> */}
      <App />
      <Toaster
        richColors
        visibleToasts={5}
        expand={true}
        position={'top-center'}
      />
    </GlobalProvider>
  </React.StrictMode>,
);
