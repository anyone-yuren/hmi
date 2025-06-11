import { message, Tag } from 'antd';
import { dashboard } from 'apis';
import dayjs from 'dayjs';
import { GAction, GCtrl, GSearchTable, GTableCtrlField } from 'gbeata';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useRefreshNotification from '../hooks/useRefreshNotification';
const NotificationList = () => {
  const { t, i18n } = useTranslation();
  const tableRef = useRef(null);
  const { refreshNotification } = useRefreshNotification();

  const fields = [
    {
      title: t('global.billing.title'),
      key: 'title',
    },
    {
      title: t('global.billing.content'),
      key: 'content',
    },
    {
      title: t('global.billing.time'),
      key: 'creationTime',
      render: (text: any) => {
        return <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: t('global.billing.type'),
      key: 'type',
      type: 'select',
      options: [
        {
          label: t('global.billing.error'),
          value: 2,
        },
        {
          label: t('global.billing.warning'),
          value: 1,
        },
        {
          label: t('global.billing.info'),
          value: 0,
        },
      ],
      render: (text: any, record) => {
        const { type } = record;
        switch (type) {
          case 0:
            return <Tag color='default'>{t('global.billing.info')}</Tag>;
          case 1:
            return <Tag color='processing'>{t('global.billing.warning')}</Tag>;
          case 2:
            return <Tag color='error'>{t('global.billing.error')}</Tag>;
        }
        return;
      },
      search: true,
    },
    {
      title: t('global.billing.status'),
      key: 'status',
      type: 'select',
      options: [
        {
          label: t('global.billing.unread'),
          value: 0,
        },
        {
          label: t('global.billing.read'),
          value: 1,
        },
      ],
      render: (text: any, record) => {
        const { status } = record;
        switch (status) {
          case 0:
            return <Tag color='error'>{t('global.billing.unread')}</Tag>;
          case 1:
            return <Tag color='success'>{t('global.billing.read')}</Tag>;
        }
      },
    },
    {
      title: t('global.billing.source'),
      key: 'source',
      type: 'select',
      search: true,
      options: [
        {
          label: 'WMS',
          value: 0,
        },
        {
          label: 'WCS',
          value: 1,
        },
        {
          label: 'RCS',
          value: 2,
        },
      ],
    },
  ];
  const ctrl: GTableCtrlField = {
    width: i18n.language === 'zh_CN' ? 150 : 240,
    fixed: 'right',
    render: (_, record: Record<string, any>) => {
      const { status } = record;
      // 3,4 完成/取消
      // if ([3, 4].includes(state)) {
      //   return null;
      // }
      return (
        <GCtrl>
          <GAction
            confirm
            disabled={status === 1}
            confirmMsg={t('global.billing.isRead')}
            onConfirm={async () => {
              const res = await dashboard.readNotification(record.id);
              if (res) {
                message.success(t('global.billing.readSuccess'));
                tableRef.current?.refresh();
                refreshNotification();
              }
            }}
            record={record}
          >
            {t('global.billing.read')}
          </GAction>
          <GAction variant='link' color='yellow' actionType='edit' record={record}>
            {t('global.billing.log')}
          </GAction>
        </GCtrl>
      );
    },
  };
  return (
    <GSearchTable
      ref={tableRef}
      api={dashboard.getNotificationList}
      fields={fields}
      rowKey='concurrencyStamp'
      tableExtend={{
        bordered: true,
        scroll: { x: 1200 },
      }}
      ctrl={ctrl}
    ></GSearchTable>
  );
};
export default NotificationList;
