import { FC, Fragment, ReactNode } from 'react';

import { unmountGlobalLoading } from '@gbeata/utils';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';
import { GlobalConfig } from 'ui';
interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();

  unmountGlobalLoading();

  const darkTheme = createTheme({
    typography: {
      fontFamily: 'Microsoft YaHei',
    },
    palette: {
      mode: 'dark',
      primary: {
        main: '#00D1D1',
      },
    },
  });
  return (
    <GlobalConfig
      card={{
        classNames: {
          body: '!px-4',
          header: '!px-2 !min-h-10',
        },
      }}
    >
      <Toaster position='top-center' richColors visibleToasts={1} closeButton />
      <CssBaseline />
      <ThemeProvider theme={darkTheme}>
        <Fragment>
          {children}
          {/* The global components of the album are mostly controlled with eventBus. */}
        </Fragment>
      </ThemeProvider>
    </GlobalConfig>
  );
};

GlobalProvider.displayName = 'GlobalProvider';

export default GlobalProvider;
