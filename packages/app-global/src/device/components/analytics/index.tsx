import { MehOutlined, RobotOutlined, RocketOutlined, SmileOutlined, SplitCellsOutlined } from '@ant-design/icons';
import { useDeviceStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { Card, Skeleton, Tag, Typography } from 'antd';
import { v1DeviceStaTistic } from 'apis';
import { GAction, GCtrl, GSearchTable } from 'gbeata';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import useStyles from './styles';

const Analytics = () => {
  const { t } = useTranslation();
  const { styles } = useStyles();
  const { run } = useRequest(v1DeviceStaTistic, {
    manual: true,
    onSuccess: (res) => {
      console.log('res', res);
    },
  });
  const { deviceList, deviceLoading } = useDeviceStore(
    useShallow((state) => {
      return {
        deviceList: state.deviceList,
        deviceLoading: state.deviceLoading,
      };
    }),
  );
  useEffect(() => {
    run();
  }, []);
  const navigate = useNavigate();
  return (
    <div className='flex gap-4 flex-col'>
      <div className='flex gap-2 justify-between'>
        <Card className={styles.card}>
          <div className='mask'></div>
          <div className='flex items-center flex-col relative  gap-2'>
            <SplitCellsOutlined
              style={{
                fontSize: '40px',
                color: '#078dee',
              }}
            />
            <div className='flex flex-col items-center'>
              <Typography.Text>{t('global.device.analytics.deviceCount')}</Typography.Text>
              <Typography.Title className='!m-0' level={3}>
                {deviceList?.length ?? 0}
              </Typography.Title>
            </div>
          </div>
        </Card>
        <Card className={styles.card}>
          <div className='mask'></div>
          <div className='flex items-center flex-col relative  gap-2'>
            <SmileOutlined
              style={{
                fontSize: '40px',
                color: '#8e33ff',
              }}
            />
            <div className='flex flex-col items-center'>
              <Typography.Text>{t('global.device.analytics.onLine')}</Typography.Text>
              <Typography.Title className='!m-0' level={3}>
                {deviceList?.filter((item) => item.isConnected).length ?? 0}
              </Typography.Title>
            </div>
          </div>
        </Card>
        <Card className={styles.card}>
          <div className='mask'></div>
          <div className='flex items-center flex-col relative  gap-2'>
            <MehOutlined
              style={{
                fontSize: '40px',
                color: '#ff9800',
              }}
            />
            <div className='flex flex-col items-center'>
              <Typography.Text>{t('global.device.analytics.offLine')}</Typography.Text>
              <Typography.Title className='!m-0' level={3}>
                {deviceList?.filter((item) => !item.isConnected).length ?? 0}
              </Typography.Title>
            </div>
          </div>
        </Card>
        <Card className={styles.card}>
          <div className='mask'></div>
          <div className='flex items-center flex-col relative  gap-2'>
            <RocketOutlined
              style={{
                fontSize: '40px',
                color: '#00b83f',
              }}
            />
            <div className='flex flex-col items-center'>
              <Typography.Text>{t('global.device.analytics.active')}</Typography.Text>
              <Typography.Title className='!m-0' level={3}>
                {deviceList?.filter((item) => item.isEnable).length ?? 0}
              </Typography.Title>
            </div>
          </div>
        </Card>
        <Card className={styles.card}>
          <div className='mask'></div>
          <div className='flex items-center flex-col relative  gap-2'>
            <RobotOutlined
              style={{
                fontSize: '40px',
                color: '#ff5630',
              }}
            />
            <div className='flex flex-col items-center'>
              <Typography.Text>{t('global.device.analytics.inactive')}</Typography.Text>
              <Typography.Title className='!m-0' level={3}>
                {deviceList?.filter((item) => !item.isEnable).length ?? 0}
              </Typography.Title>
            </div>
          </div>
        </Card>
      </div>
      {/* <DeviceChart></DeviceChart> */}
      <div className={styles.table}>
        <GSearchTable
          extraVisible={false}
          title={
            <Typography.Title className='!m-0' level={5}>
              {t('global.device.analytics.deviceList')}
            </Typography.Title>
          }
          tableHeader={<>{/* <DeviceChart></DeviceChart> */}</>}
          ctrl={{
            width: 130,
            render: (_, record: Record<string, any>) => {
              const { deviceName } = record;
              return (
                <GCtrl>
                  <GAction
                    record={record}
                    action='view'
                    variant='link'
                    // color='orange'
                    onClick={() => {
                      navigate(`/device/info/${deviceName}`);
                    }}
                  >
                    {t('global.common.info')}
                  </GAction>
                </GCtrl>
              );
            },
          }}
          loading={deviceLoading}
          data={deviceList ?? []}
          fields={[
            {
              title: t('global.device.list.no'),
              key: 'key',
            },
            {
              title: t('global.device.list.name'),
              key: 'deviceName',
            },
            {
              title: t('global.device.list.communicationType'),
              key: 'communicationType',
            },
            {
              title: t('global.device.list.ipAddress'),
              key: 'ipAddress',
              render: (_, record: Record<string, any>) => {
                const { ipPort } = record;
                if (ipPort) {
                  return <span>{ipPort}</span>;
                } else {
                }
                return <Skeleton.Button size='small' active block />;
              },
            },
            {
              title: t('global.device.list.status'),
              key: 'isIdle',
              render: (_, record: Record<string, any>) => {
                const { isConnected } = record;
                if (isConnected) {
                  return <Tag color='success'>{t('global.device.analytics.onLine')}</Tag>;
                } else {
                  return <Tag color='error'>{t('global.device.analytics.offLine')}</Tag>;
                }
              },
            },

            {
              title: t('global.device.list.statusAdress'),
              key: 'moreInfo',
              render: (_, record: Record<string, any>) => {
                const { moreInfo } = record;
                return moreInfo?.statusAdress ?? '-';
              },
            },
            {
              title: t('global.device.list.templateType'),
              key: 'templateType',
            },
            {
              title: t('global.device.list.description'),
              key: 'description',
            },
            {
              title: t('global.device.list.enable'),
              key: 'isEnable',
              render: (_, record: Record<string, any>) => {
                return (
                  <Tag color={record.isEnable ? 'success' : 'error'}>
                    {record.isEnable ? t('global.common.enable') : t('global.common.unable')}
                  </Tag>
                );
              },
              // type: 'switch',
              // valuePropName: 'checked',
              // checkedChildren: '启用',
              // unCheckedChildren: '禁用',
            },
          ]}
          tableExtend={{
            bordered: true,
            scroll: { x: 1200 },
          }}
        ></GSearchTable>
      </div>
    </div>
  );
};
export default Analytics;
