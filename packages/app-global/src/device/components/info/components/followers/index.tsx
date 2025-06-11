import { v1DeviceConnectLogs } from 'apis';
import dayjs from 'dayjs';
import { GSearchTable } from 'gbeata';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';

export interface PConnect {}
const ConnectPage: FC<PConnect> = () => {
  const { id } = useParams();
  return (
    <>
      <GSearchTable
        api={(params) => v1DeviceConnectLogs(id, params)}
        beforeSearch={(query) => {
          const { startDate, endDate, ...rest } = query;
          return {
            ...rest,
            startTime: startDate,
            endTime: endDate,
          };
        }}
        fields={[
          {
            title: '开始时间',
            key: 'creationTime',
            render: (_, record) => {
              return dayjs(record.creationTime).format('YYYY-MM-DD HH:mm:ss');
            },
          },
          {
            // title: t('wms.task.create'),
            key: 'creationTime',
            width: 160,
            type: 'date-range',
            table: false,
            search: {
              showTime: true,
            },
          },
          {
            title: 'IP地址/端口',
            key: 'ip',
            render: (text, record) => {
              return `${record.ipAddress}:${record.port}`;
            },
          },
          {
            title: '动作类型',
            key: 'actionType',
            type: 'select',
            options: [
              { label: '连接', value: 'connect' },
              { label: '断开', value: 'disconnect' },
            ],
          },
          {
            title: '触发来源',
            key: 'triggerSource',
          },
          {
            title: '信息',
            key: 'message',
            search: true,
          },
        ]}
        tableExtend={{
          bordered: true,
          scroll: { x: 1500 },
          size: 'small',
        }}
      />
    </>
  );
};

export default ConnectPage;
