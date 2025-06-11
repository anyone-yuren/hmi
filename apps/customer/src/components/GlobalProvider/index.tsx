import { FC, Fragment, ReactNode } from 'react';

import { unmountGlobalLoading } from '@gbeata/utils';
import { useTranslation } from 'react-i18next';
import { GlobalConfig } from 'ui';

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();

  unmountGlobalLoading();
  return (
    <GlobalConfig
      card={{
        classNames: {
          body: '!px-4',
          header: '!px-2 !min-h-10',
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
