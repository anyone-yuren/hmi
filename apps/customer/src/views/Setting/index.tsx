import x20 from '@/assets/img/X20-M_320-500.png';
import { useHybridStore } from '@/store/hyBridStore';
import { UserOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Segmented, Slider, Switch, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import WsContainer from '../Home/components/wsContainer';
const { Header, Content, Footer, Sider } = Layout;
const useStyles = createStyles(({ css, token }) => ({
  customSlider: css`
    .ant-slider-rail {
      height: 12px;
    }
    .ant-slider-track {
      height: 12px;
    }
    &.ant-slider-horizontal {
      padding-block: 6px;
      margin-inline: 0;
    }
    .ant-slider-handle {
      width: 24px;
      height: 24px;
      &::after {
        width: 24px;
        height: 24px;
      }
      &::before {
        width: 20px;
        height: 20px;
      }
      &:focus,
      &:hover {
        &::after {
          width: 24px;
          height: 24px;
        }
      }
    }
  `,
  customSwitch: css`
    width: 80px;
    height: 36px;
    line-height: 36px;
    &.ant-switch-checked {
      .ant-switch-handle {
        inset-inline-start: calc(100% - 34px);
      }
    }

    .ant-switch-handle {
      width: 32px;
      height: 32px;
      top: 2px;
      left: 2px;
      border-radius: 16px;
      &::before {
        width: 32px;
        height: 32px;
        border-radius: 16px;
      }
    }

    .ant-switch-inner {
      font-size: 16px;
      line-height: 36px;
      padding-inline-end: 9px;
      padding-inline-start: 24px;
      .ant-switch-inner-unchecked {
        margin-top: -36px;
        font-size: 16px;
      }
      .ant-switch-inner-checked {
        font-size: 16px;
      }
    }

    .ant-switch {
      min-width: 80px;
      height: 36px;
      line-height: 36px;
      padding: 2px;
    }

    .ant-switch-checked {
      background-color: ${token.colorPrimary};
    }
  `,
}));

const Setting = () => {
  const { styles } = useStyles();
  const { agvPosition } = useHybridStore(
    useShallow((state) => ({
      agvPosition: state.agvPosition,
    })),
  );
  // const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map((icon, index) => ({
  //   key: String(index + 1),
  //   icon: React.createElement(icon),
  //   label: `nav ${index + 1}`,
  // }));
  const items = [
    {
      key: '1',
      icon: React.createElement(UserOutlined),
      label: '车辆控制',
    },
    {
      key: '2',
      icon: React.createElement(UserOutlined),
      label: '显示',
    },
  ];
  return (
    <Layout className='h-full bg-transparent'>
      <WsContainer />
      <Sider
        breakpoint='lg'
        collapsedWidth={0}
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']} items={items} />
      </Sider>
      <Content className='relative'>
        <div className='p-5 flex flex-col gap-8 w-2/3 h-full rounded-lg bg-gradient-to-r from-black to-purple-500/0'>
          <div>
            <Typography.Title level={5}>语言</Typography.Title>
            <Segmented
              size='large'
              options={[
                { label: '中文', value: 'zh-CN' },
                { label: 'English', value: 'en-US' },
                { label: '日本語', value: 'ja-JP' },
                { label: '한국어', value: 'ko-KR' },
              ]}
            />
          </div>
          <div className='flex gap-4 items-center'>
            <Switch defaultChecked className={styles.customSwitch} onChange={() => {}} />
            <Typography.Text>异常显示</Typography.Text>
          </div>
          <div className='flex gap-4 items-center'>
            <Switch defaultChecked className={styles.customSwitch} onChange={() => {}} />
            <Typography.Text>库位自动校准</Typography.Text>
          </div>
          <div className='w-1/2'>
            <Typography.Title level={5}>喇叭音量</Typography.Title>
            <Slider className={styles.customSlider} defaultValue={30} />
          </div>
          <div>
            <Button size='large' type='primary'>
              切换到施工端
            </Button>
          </div>
          {/* <div>
            <Typography.Title level={5}>AGV位置</Typography.Title>
            <div>
              <Typography.Text>X轴：{agvPosition?.x}</Typography.Text>
            </div>
            <div>
              <Typography.Text>Y轴：{agvPosition?.y}</Typography.Text>
            </div>
            <div>
              <Typography.Text>角度：{agvPosition?.angel}</Typography.Text>
            </div>
          </div> */}
        </div>
        <div className='absolute top-10 right-10'>
          <img src={x20} className='rounded-lg  w-96' />
          <img src={x20} className='absolute top-full left-0 w-full h-[100px] opacity-30 blur-sm scale-y-[-1]' />
        </div>
      </Content>
    </Layout>
  );
};
export default Setting;
