import { useWmsGlobalStore, type WmsGlobalState } from '@gbeata/store';
import { getCookie, unmountGlobalLoading } from '@gbeata/utils';
import { wms } from 'apis';
import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import router from '@/router';

import { redirectToLogin } from '@gbeata/utils';

import '@/gbeata';
import '@/gbeata/config.tsx';
import { useGlobalStore } from '@gbeata/store';
import { useAsyncEffect } from 'ahooks';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
function App() {
  const [loading, setLoading] = useState(false);
  const { preset } = useGlobalStore(
    useShallow((state) => {
      return {
        preset: state.preset,
      };
    }),
  );

  const { setToken, token, getToken } = useWmsGlobalStore(
    useShallow((state: WmsGlobalState) => {
      return {
        token: state.token,
        setToken: state.setToken,
        getToken: state.getToken,
      };
    }),
  );
  const { t, i18n } = useTranslation();
  useAsyncEffect(async () => {
    const code = getCookie('code');
    const currentToken = getToken(); // 这个和token不一样，一个快 一个慢
    console.log(code, token, currentToken);
    if (!code && !currentToken) {
      redirectToLogin('wms-global-storage');
      return;
    }
    if (!code || currentToken) {
      return;
    }
    try {
      setLoading(true);
      const response = await wms.getConnectToken({ code, grant_type: 'Multiway', client_id: 'Wms_API' });
      console.log('[RESPONSE TOKEN]:请求两次', response);
      if (response?.data && response?.data?.access_token) {
        setToken(response?.data?.access_token);
      } else {
        // code换token失败，是否要处理
        message.error(t('common.getTokenFailed'));
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      message.error(t('common.getTokenFailed'));
    }
  }, []);

  unmountGlobalLoading();
  return (
    <>
      {/* <Toaster position='top-center' richColors /> */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
