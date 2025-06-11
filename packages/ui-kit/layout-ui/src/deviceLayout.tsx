import { Layout } from 'antd';
import { useTheme } from 'antd-style';
import React from 'react';
import { useLocation } from 'react-router-dom';

import LayoutHeader from './header/pdaHeader';

interface IProps {
  children?: React.ReactNode;
  menuNodes?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
}

export const DeviceLayout = (props: IProps) => {
  const { title, children } = props;
  const { state } = useLocation();
  const token = useTheme();
  console.log(token);

  const { key = 'key' } = state || {};
  const { Content } = Layout;
  const location = useLocation();
  return (
    <Layout className='h-full'>
      <LayoutHeader title={title} />
      <Content>{children}</Content>
    </Layout>
  );
};
