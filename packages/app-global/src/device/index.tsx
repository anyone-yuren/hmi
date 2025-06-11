import { PieChartOutlined, TeamOutlined } from '@ant-design/icons';
import { useDeviceStore } from '@gbeata/store';
import type { MenuProps } from 'antd';
import { Badge, Layout, Menu, theme } from 'antd';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import Notification from './components/notification';
import { SignalRProvider } from './components/signalRProvider';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const App: React.FC = () => {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();

  const pathMemo = useMemo(() => {
    console.log('state', pathname);

    return pathname;
  }, [pathname]);
  function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      onClick: () => {
        if (key === '2') {
          return;
        }
        navigate(key as string);
      },
    } as MenuItem;
  }
  const [collapsed, setCollapsed] = useState(false);
  const { t, i18n } = useTranslation();
  const { deviceList } = useDeviceStore(
    useShallow((state) => {
      return {
        deviceList: state.deviceList,
      };
    }),
  );

  const items: MenuItem[] = [
    getItem(t('global.device.analytics.name'), '/device/analytics', <PieChartOutlined />),
    getItem(
      t('global.device.list.listName'),
      '2',
      <TeamOutlined />,
      deviceList?.map((item) => {
        const { isConnected } = item;
        return getItem(
          <>
            <Badge
              classNames={{
                indicator: 'w-4 h-4',
              }}
              status={isConnected ? 'processing' : 'error'}
            />
            {item.deviceName}
          </>,
          '/device/info/' + item.deviceName,
        );
      }),
    ),
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout className='h-full overflow-x-hidden'>
      <SignalRProvider></SignalRProvider>
      <Header
        className='bg-white shadow-sm relative z-10 h-10 !px-4 justify-between'
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <div className='demo-logo font-bold text-xl'>设备接入管理</div>
        <div>
          <Notification />
        </div>
      </Header>
      <Layout>
        <Sider theme='light' width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode='inline'
            selectedKeys={[pathMemo]}
            defaultSelectedKeys={[pathMemo]}
            defaultOpenKeys={['2']}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
            inlineIndent={10}
          />
        </Sider>
        <Layout style={{ margin: '12px 12px' }} className='overflow-y-auto overflow-x-hidden'>
          <Content>
            {/* <DeviceInfo id='' /> */}
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
