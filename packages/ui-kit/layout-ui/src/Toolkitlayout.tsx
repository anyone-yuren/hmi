import { Layout } from 'antd';
import { ThemeProvider, useTheme, useThemeMode } from 'antd-style';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

interface IProps {
  children?: React.ReactNode;
  menuNodes?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
  header?: React.ReactNode;
  top?: React.ReactNode;
}

export const useHashQuery = () => {
  const { search } = useLocation();
  const queryString = search.includes('?') ? search.split('?')[1] : '';
  return new URLSearchParams(queryString);
};

export const ToolkitLayout = (props: IProps) => {
  const { title, header, top, footer } = props;
  const { state } = useLocation();
  const query = useHashQuery();
  const client = query.get('client'); // "true"
  const token = useTheme();
  const { setThemeMode } = useThemeMode();
  const { key = 'key' } = state || {};
  const { Content, Sider, Header, Footer } = Layout;

  const location = useLocation();
  return (
    <ThemeProvider appearance='dark'>
      <Layout className='h-full flex !flex-col'>
        <Header className='h-9 leading-9 !py-0 flex items-center bg-black border-b border-white/10 px-2'>{top}</Header>
        <div className='flex flex-1'>
          <Sider className='bg-white/10' width={client ? 0 : 50}>
            {header}
          </Sider>
          <Content className='overflow-y-auto relative bg-black'>
            <ErrorBoundary>
              <Outlet key={key} />
            </ErrorBoundary>
          </Content>
        </div>
        <Footer className='h-6 !py-0 px-2 bg-black border-t border-white/10 flex items-center'>{footer}</Footer>
      </Layout>
    </ThemeProvider>
  );
};
