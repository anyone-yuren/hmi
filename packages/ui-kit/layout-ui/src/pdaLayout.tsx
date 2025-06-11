import { Layout } from 'antd';
import { ThemeProvider, useTheme, useThemeMode } from 'antd-style';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import LayoutHeader from './header/pdaHeader';

interface IProps {
  children?: React.ReactNode;
  menuNodes?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
}

export const PdaLayout = (props: IProps) => {
  const { title } = props;
  const { state } = useLocation();
  const token = useTheme();
  const { setThemeMode } = useThemeMode();
  const { key = 'key' } = state || {};
  const { Content } = Layout;
  const location = useLocation();
  return (
    <ThemeProvider appearance='dark'>
      <Layout className=' h-full'>
        <LayoutHeader title={title} />
        <Content className='overflow-y-auto'>
          <ErrorBoundary>
            <Outlet key={key} />
          </ErrorBoundary>
        </Content>
      </Layout>
    </ThemeProvider>
  );
};
