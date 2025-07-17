import EmptyBox from '@/components/Empty';
import { useRequest } from 'ahooks';
import { Button, Space, Table, Tag } from 'antd';
import * as dayjs from 'dayjs';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LevelColor, LevelEnum } from '../enum';
import { error_log_download, getCurrent, postErrorCode } from '../services';

import { toast } from 'sonner';

const Current = () => {
  const { t } = useTranslation();
  const {
    runAsync: getCurrentData,
    loading: currentLoading,
    data: currentData,
  } = useRequest(getCurrent, {
    manual: false,
    onSuccess: (res: any) => {
      if (res?.error_code !== 0) {
        toast.error(res?.error_description || '');
        return [];
      }
      return res.data || [];
    },
  });
  const { runAsync: postErrorCodeData } = useRequest(postErrorCode, {
    manual: true,
    onSuccess: (res: any) => {
      if (res?.error_code !== 0) {
        toast.error(res?.error_description || t('当前错误不支持诊断'));
      }
    },
  });
  // 这个方法看之前的是废弃了，一直都是返回false
  const isMultiwayAgv = useMemo(() => {
    return false;
  }, []);
  const columns: any[] = [
    {
      title: t('时间'),
      dataIndex: 'generate_time',
      key: 'generate_time',
      minWidth: 150,
      align: 'left',
      render: (text: any) => dayjs.unix(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: t('错误码'),
      dataIndex: 'error_code',
      key: 'error_code',
      minWidth: 100,
      align: 'left',
    },
    {
      title: t('故障描述'),
      dataIndex: 'description',
      key: 'description',
      minWidth: 200,
      align: 'left',
    },
    {
      title: t('级别'),
      dataIndex: 'level',
      key: 'level',
      minWidth: 100,
      align: 'left',
      render: (text: any) => <Tag color={LevelColor[text]}>{LevelEnum[text]}</Tag>,
    },
    {
      title: t('产生原因'),
      dataIndex: 'reason',
      key: 'reason',
      minWidth: 200,
      align: 'left',
    },
    {
      title: t('解决措施'),
      dataIndex: 'diagnosis_result',
      key: 'resolve',
      minWidth: 200,
      align: 'left',
    },

    {
      title: t('车辆位置'),
      dataIndex: 'vehicle_position',
      key: 'vehicle_position',
      minWidth: 100,
      align: 'left',
    },
    {
      title: t('操作'),
      dataIndex: 'status',
      key: 'status',
      minWidth: 100,
      fixed: 'right',
      render: (text: any, record) => {
        return (
          <Space size='small'>
            <Button
              type='primary'
              size='small'
              variant='solid'
              disabled={record?.diagnosis_result ? true : false}
              onClick={async () => {
                const { generate_time, error_code, error_reason } = record;
                const res: any = await postErrorCodeData({
                  generate_time,
                  error_code,
                  error_reason,
                });
                if (res.error_code == 0) {
                  toast.success(t('操作成功'));
                  getCurrentData();
                }
              }}
            >
              {record?.diagnosis_result ? t('已诊断') : t('诊断')}
            </Button>
            {!isMultiwayAgv && (
              <Button
                size='small'
                onClick={async () => {
                  const { data } = await error_log_download({
                    error_code: record.error_code,
                    error_time: record.generate_time,
                  });
                  // window.open(getDownloadUrl() + data);
                }}
              >
                {t('下载日志')}
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      size='large'
      loading={currentLoading}
      dataSource={currentData?.data || []}
      scroll={{ x: 1500, y: 600 }}
      locale={{
        emptyText: <EmptyBox titleColor='#fff' backgroundColor='transparent' />,
      }}
    ></Table>
  );
};
export default memo(Current);
