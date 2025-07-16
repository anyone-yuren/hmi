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
}

export const PdaLayout = (props: IProps) => {
  const { title, header } = props;
  const { state } = useLocation();
  const token = useTheme();
  const { setThemeMode } = useThemeMode();
  const { key = 'key' } = state || {};
  const { Content, Sider } = Layout;
  const location = useLocation();
  return (
    <ThemeProvider appearance='dark'>
      <Layout className='h-full'>
        {/* <LayoutHeader title={title} /> */}
        <Sider width={120}>{header}</Sider>
        <Content className='overflow-y-auto relative bg-[#162640]'>
          <ErrorBoundary>
            <Outlet key={key} />
          </ErrorBoundary>
        </Content>
      </Layout>
    </ThemeProvider>
  );
};
