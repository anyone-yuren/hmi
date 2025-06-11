import { Tag } from 'antd';
import { v1DeviceEventLogs } from 'apis';
import dayjs from 'dayjs';
import { GSearchTable } from 'gbeata';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export interface PGallery {}
const Gallery: FC<PGallery> = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  return (
    <>
      <GSearchTable
        tableExtend={{
          bordered: true,
          scroll: { x: 1500 },
          size: 'small',
        }}
        api={(params) => {
          return v1DeviceEventLogs(id, params);
        }}
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
            title: '事件名称',
            key: 'eventName',
          },
          {
            title: '设备名称',
            key: 'deviceName',
          },
          {
            title: '执行时常',
            key: 'duration',
          },
          {
            title: '信息',
            key: 'message',
            search: true,
          },
          {
            title: '是否完成',
            key: 'isCompleted',
            render: (_, record) => {
              const { isCompleted } = record;
              if (isCompleted) {
                return <Tag color='success'>{t('global.device.analytics.onLine')}</Tag>;
              } else {
                return <Tag color='error'>{t('global.device.analytics.offLine')}</Tag>;
              }
            },
          },
        ]}
      />
    </>
  );
};

export default Gallery;
