import { FC, Fragment, ReactNode, useEffect } from 'react';

import { useWmsGlobalStore } from '@gbeata/store';
import { unmountGlobalLoading } from '@gbeata/utils';
import { wms } from 'apis';
import { useTranslation } from 'react-i18next';
import { GlobalConfig } from 'ui';
import { useShallow } from 'zustand/react/shallow';

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  // const { data, runAsync: getToken } = useRequest(
  //   (params) => {
  //     return wms.getOAuth2Callback(params);
  //   },
  //   { manual: true },
  // );
  const { setDicts, token, setVerSion } = useWmsGlobalStore(
    useShallow((state) => {
      return {
        setDicts: state.setDicts,
        token: state.token,
        setVerSion: state.setVerSion,
      };
    }),
  );
  const getDictsData = async () => {
    const res = await wms.getEnum();
    if (res) {
      setDicts(res);
    }
  };
  const getVersion = async () => {
    const res = await wms.getWmsVersion();
    if (res) {
      setVerSion(res);
    }
  };

  // useAsyncEffect(async () => {
  //   const code = getCookie('code');
  //   if (token) {
  //     return;
  //   }
  //   if (!code) {
  //     return;
  //   }
  //   const response = await getToken({ code });
  //   console.log('response', response);
  //   if (response?.access_token) {
  //     setToken(response?.access_token);
  //   }
  // }, []);

  useEffect(() => {
    token && getDictsData();
    token && getVersion();
  }, [token, i18n.language]);
  unmountGlobalLoading();
  return (
    <GlobalConfig
      card={{
        classNames: {
          body: '!px-4',
          header: '!px-2 !min-h-10',
        },
      }}
      theme={{
        token: {
          colorPrimary: '#235EFF',
        },
      }}
    >
      <Fragment>
        {children}
        {/* The global components of the album are mostly controlled with eventBus. */}
      </Fragment>
    </GlobalConfig>
  );
};

GlobalProvider.displayName = 'GlobalProvider';

export default GlobalProvider;
