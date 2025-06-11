import { Divider, Layout, Space } from 'antd';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import { Outlet, useLocation } from 'react-router-dom';
// import "./gbeata/index.tsx";
// import "./gbeata/config.tsx";
import React from 'react';

import { useGlobalSettings } from '@gbeata/store';

import LayoutHeader from './header';
import useStyles from './index.style';

interface IProps {
  children?: React.ReactNode;
  menuNodes?: React.ReactNode;
  footer?: React.ReactNode;
}

export const BasicLayout = (props: IProps) => {
  const { menuNodes, children, footer } = props;
  const { state } = useLocation();
  const { unfold } = useGlobalSettings();
  const { key = 'key' } = state || {};
  // useTitle();
  const { Sider, Content, Footer } = Layout;
  const { styles } = useStyles();
  return (
    <Layout className={styles.layout_wrapper}>
      <Sider
        width={240}
        style={{
          overflowY: 'auto',
          height: '100vh',
        }}
        trigger={null}
        theme='light'
        collapsed={unfold}
        className='ant-layout-sider'
      >
        {menuNodes}
      </Sider>
      <Layout>
        <LayoutHeader />
        <Content>
          <ErrorBoundary>
            <Outlet key={key} />
          </ErrorBoundary>
        </Content>
        <Footer className={styles.footer}>
          <Space split={<Divider type='vertical' />}>{footer}</Space>
        </Footer>
      </Layout>
    </Layout>
  );
};
