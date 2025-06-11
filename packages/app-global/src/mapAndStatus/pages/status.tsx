import {
  ApiOutlined,
  CompassOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useRcsDictByName } from '@gbeata/hooks';
import { useRequest } from 'ahooks';
import { Button, Empty, List, Spin, Tabs, Tag, Typography } from 'antd';
import { v1missionGetPagedListAsync } from 'apis';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useSignalRStore } from '../../components/signalR/store/signalR';
import TaskProcess from './taskProcess';

type IProps = {
  selectedVehicle?: string;
};
const VehicleStatus = (prop: IProps) => {
  const missionType = useRcsDictByName('missionType');
  const missionState = useRcsDictByName('missionState');
  const platformSource = useRcsDictByName('platformSource');
  const { selectedVehicle } = prop;
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('info');
  const [open, setOpen] = useState(false);
  const [vehicleTask, setVehicleTask] = useState<any>(null);
  const { vehicles, vehicleStates } = useSignalRStore(
    useShallow((state: any) => ({
      vehicles: state.vehicles,
      vehicleStates: state.monitorMessage.vehicleStates,
    })),
  );

  const { loading: listLoading, run: getCheckVehicleTask } = useRequest(
    () =>
      v1missionGetPagedListAsync({
        missionState: 1,
        vehicleNum: selectedVehicle,
      }),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.items?.length) {
          setVehicleTask(res.items[0]);
        } else {
          setVehicleTask(null);
        }
      },
    },
  );

  useEffect(() => {
    if (activeKey === 'task') {
      getCheckVehicleTask();
    }
  }, [activeKey]);

  const selectVehicle = vehicles?.find((item) => item.vehicleNum === selectedVehicle);

  const tabList = [
    {
      key: 'info',
      label: t('common.vehicle.info'),
    },
    {
      key: 'task',
      label: t('common.vehicle.task'),
    },
  ];

  const vehicleStatus = [t('common.normal'), t('common.manually'), t('common.traffic'), t('common.abnormal')];
  const tabPanel = {
    info: (
      <div>
        <List itemLayout='horizontal' className='px-2'>
          <List.Item extra={selectVehicle?.vehicleNum}>
            <List.Item.Meta avatar={<LinkOutlined />} title={`${t('common.vehicle.id')}:`} />
          </List.Item>
          <List.Item extra={vehicleStatus[selectVehicle?.vehicleState]}>
            <List.Item.Meta avatar={<CompassOutlined />} title={`${t('common.vehicle.control')}:`} />
          </List.Item>
          <List.Item extra={selectVehicle?.elecQuantity}>
            <List.Item.Meta avatar={<ThunderboltOutlined />} title={`${t('common.vehicle.elecQuantity')}:`} />
          </List.Item>
          <List.Item extra={selectVehicle.image}>
            <List.Item.Meta avatar={<ApiOutlined />} title={`${t('common.vehicle.type')}:`} />
          </List.Item>
          <List.Item
            extra={
              selectVehicle?.isHasGoods ? (
                <Tag color='success'>{t('common.vehicle.hasGood')}</Tag>
              ) : (
                <Tag color='error'>{t('common.vehicle.noGood')}</Tag>
              )
            }
          >
            <List.Item.Meta avatar={<ExclamationCircleOutlined />} title={`${t('common.vehicle.hasGoods')}:`} />
          </List.Item>
        </List>
      </div>
    ),
    task: listLoading ? (
      <div className='flex justify-center'>
        <Spin></Spin>
      </div>
    ) : (
      <div>
        {vehicleTask ? (
          <List itemLayout='horizontal' className='px-2'>
            <List.Item>
              <List.Item.Meta
                title={
                  <div className='flex items-center justify-between'>
                    <Typography.Title className='!m-0' level={5}>
                      {t('common.vehicle.No')}：
                    </Typography.Title>
                    <Typography.Paragraph
                      className='!m-0'
                      ellipsis={{
                        rows: 1,
                        expandable: true,
                        symbol: 'more',
                      }}
                      copyable
                    >
                      {vehicleTask.taskCode ?? vehicleTask.id}
                    </Typography.Paragraph>
                  </div>
                }
                description={
                  <div className='divide-y'>
                    <div className='flex justify-between items-center p-2'>
                      <Typography.Text>{t('common.vehicle.trajectory')}：</Typography.Text>
                      {vehicleTask.missionTrajectory}
                    </div>
                    <div className='flex justify-between items-center p-2'>
                      <Typography.Text>{t('common.vehicle.source')}：</Typography.Text>
                      {platformSource?.find((node) => node.value === vehicleTask.platformSource)?.label}
                    </div>
                    <div className='flex justify-between items-center p-2'>
                      <Typography.Text>{t('common.vehicle.createTime')}：</Typography.Text>
                      {dayjs(vehicleTask.creationTime).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                    <div className='flex justify-between items-center p-2'>
                      <Typography.Text>{t('common.vehicle.taskStatus')}：</Typography.Text>
                      {missionState.find((node) => node.value === vehicleTask.missionState)?.label}
                    </div>
                    {/* <div className='flex justify-between items-center p-2'>
                      <Typography.Text>{t('common.vehicle.remark')}：</Typography.Text>
                      {vehicleTask.description}
                    </div> */}
                    <div className='flex justify-between items-center p-2'>
                      <Typography.Text>{t('common.vehicle.reload')}：</Typography.Text>
                      <Button color='primary' size='small' variant='outlined' onClick={() => setOpen(true)}>
                        {t('common.detail')}
                      </Button>
                    </div>
                  </div>
                }
              />
            </List.Item>
          </List>
        ) : (
          <Empty></Empty>
        )}
      </div>
    ),
  };

  return (
    <>
      <Tabs
        items={tabList}
        defaultActiveKey='info'
        onChange={(key: string) => {
          setActiveKey(key);
        }}
      ></Tabs>
      {activeKey === 'info' && tabPanel.info}
      {activeKey === 'task' && tabPanel.task}
      <TaskProcess
        guid={vehicleTask?.id}
        open={open}
        closeFn={() => {
          setOpen(false);
        }}
      />
    </>
  );
};
export default VehicleStatus;
