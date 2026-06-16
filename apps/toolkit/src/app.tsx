import { unmountGlobalLoading } from '@gbeata/utils';
import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';

import router from '@/router';

import '@/gbeata';
import '@/gbeata/config';

import { useTranslation } from 'react-i18next';
function App() {
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();

  unmountGlobalLoading();
  return (
    <>
      {/* <Toaster position='top-center' richColors /> */}
      <RouterProvider router={router} />
    </>
  );
}
export default App;
