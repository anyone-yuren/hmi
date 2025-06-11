import { Card, Divider, Segmented, Skeleton, Space, Tag, Typography } from 'antd';
import { v1DeviceTemplateInfo } from 'apis';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MotionAnimatePanel } from 'ui';

import avatar from '../../../../../assets/huoti.png';

import BaseInfo from '../baseInfo';
import Followers from '../followers';
import Gallery from '../gallery';
import useStyles from './styles';

import { BugOutlined, LinkOutlined, UngroupOutlined } from '@ant-design/icons';
import { useDeviceStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import type { CardProps } from 'antd/es/card';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

const { Text, Title } = Typography;

export interface UserCardProp extends CardProps {
  children?: React.ReactNode;
}

const UserCard: React.FC<UserCardProp> = (prop) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { deviceList } = useDeviceStore(
    useShallow((state) => {
      return {
        deviceList: state.deviceList,
      };
    }),
  );
  const device = deviceList?.find((item) => item.deviceName === id);

  const {
    data: deviceInfo,
    runAsync: getDeviceInfoAsync,
    loading: deviceInfoLoading,
  } = useRequest(
    () => {
      return v1DeviceTemplateInfo(id);
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (!id) {
      return;
    }
    getDeviceInfoAsync();
  }, [id]);
  const { children, ...rest } = prop;
  const [tabActive, setTabActive] = React.useState('Profile');
  const [loading, setLoading] = React.useState(true);
  const { styles } = useStyles();
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 尝试自动播放（需要静音）
    if (!videoRef?.current) {
      return;
    }
    const playPromise = videoRef?.current.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // 自动播放失败时静音后重试
        videoRef?.current && (videoRef.current.muted = true);
        videoRef?.current && videoRef.current.play();
      });
    }
  }, []);
  return (
    <div className={styles.content}>
      <Card
        hoverable
        className={'rounded-xl ' + styles['user-card']}
        cover={
          <>
            <video
              className='absolute w-full h-full object-cover top-0 left-0'
              ref={videoRef}
              autoPlay
              muted
              playsInline
              loop
              // 隐藏所有控件
              controls={false}
            >
              <source src='/vedios/chanxian.mp4' type='video/mp4' />
              {t('global.device.videoNotSupport')}
            </video>
            <div className='user_info'>
              <div className='avatar'>
                <img className='w-full h-full' src={avatar} />
              </div>
              <div className='info'>
                <Title style={{ margin: 0, color: 'inherit' }} level={3}>
                  {id}
                </Title>
                <Space className='text-white font-bold' split={<Divider type='vertical' />}>
                  {deviceInfoLoading ? (
                    <>
                      <Skeleton.Button size='small' active block className='min-w-[120px]' />
                      <Skeleton.Button size='small' active block className='min-w-[120px]' />
                      <Skeleton.Button size='small' active block className='min-w-[120px]' />
                      <Skeleton.Button size='small' active block className='min-w-[120px]' />
                    </>
                  ) : (
                    deviceInfo?.realTimeInformation
                      ?.filter((item) => item.title)
                      .map((item) => {
                        const { uiElementType, items, title, value, id } = item;
                        let signalRFieldValue = '';
                        if (id.includes('.')) {
                          const [signalRField, field] = id.split('.');
                          signalRFieldValue = device[signalRField][field] + '';
                        } else {
                          signalRFieldValue = device[id] + '';
                        }
                        if (uiElementType === 'StatusLabel') {
                          return (
                            <div className='flex gap-2'>
                              <span>{title}</span>
                              {items.length ? (
                                <Tag color={'#d0b615'}>
                                  {items?.map((e) => {
                                    const { value, title } = e;
                                    if (value === signalRFieldValue) {
                                      return title;
                                    }
                                    return '';
                                  })}
                                </Tag>
                              ) : (
                                <Tag color={'#d0b615'}>{signalRFieldValue ?? '-'}</Tag>
                              )}
                            </div>
                          );
                        }
                        return (
                          <div className='flex gap-2'>
                            <span>{title}</span>
                            <Tag color='#d0b615'>{value ?? '-'}</Tag>
                          </div>
                        );
                      })
                  )}
                  {/* <div className='flex gap-2'>
                    <span>连接状态</span>
                    <Tag color='#03850b'>已连接</Tag>
                  </div>
                  <div className='flex gap-2'>
                    <span>当前楼层</span>
                    <Tag color='#d0b615'>2</Tag>
                  </div>
                  <div className='flex gap-2'>
                    <span>使用状态</span>
                    <Tag color='#d0b615'>2号车使用中</Tag>
                  </div>
                  <div className='flex gap-2'>
                    <span>电梯状态</span>
                    <Tag color='#d0b615'>开</Tag>
                  </div> */}
                </Space>
              </div>
            </div>
          </>
        }
      >
        <Segmented
          size='small'
          onChange={(e: string) => {
            setTabActive(e);
          }}
          value={tabActive}
          className='font-bold'
          options={[
            { label: t('global.device.info'), value: 'Profile', icon: <UngroupOutlined /> },
            {
              label: t('global.device.eventLog'),
              value: 'Followers',
              icon: <BugOutlined />,
            },
            { label: t('global.device.linkLog'), value: 'Friends', icon: <LinkOutlined /> },
          ]}
        />
      </Card>
      {tabActive === 'Profile' ? (
        <MotionAnimatePanel className={styles.translatex} animationType='slide' delay={0.2} duration={0.4}>
          <BaseInfo deviceInfo={deviceInfo} loading={deviceInfoLoading} signaRdevice={device} />
        </MotionAnimatePanel>
      ) : null}
      {tabActive === 'Followers' ? (
        <MotionAnimatePanel className={styles.translatex} animationType='slide' delay={0.2} duration={0.4}>
          <Gallery />
        </MotionAnimatePanel>
      ) : null}
      {tabActive === 'Friends' ? (
        <MotionAnimatePanel className={styles.translatex} animationType='slide' delay={0.2} duration={0.4}>
          <Followers />
        </MotionAnimatePanel>
      ) : null}
      {/* {tabActive === 'Gallery' ? (
        <MotionAnimatePanel className={styles.translatex} animationType='slide' delay={0.2} duration={0.4}>
          <Friends />
        </MotionAnimatePanel>
      ) : null} */}
    </div>
  );
};
export default UserCard;
