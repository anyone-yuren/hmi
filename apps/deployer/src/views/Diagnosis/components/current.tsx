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
        toast.error(res?.error_description || t('deployer.diagnosis.notSupportDiagnosis'));
      }
    },
  });
  const isMultiwayAgv = useMemo(() => {
    return false;
  }, []);
  const columns: any[] = [
    {
      title: t('deployer.diagnosis.time'),
      dataIndex: 'generate_time',
      key: 'generate_time',
      minWidth: 150,
      align: 'left',
      render: (text: any) => dayjs.unix(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: t('deployer.diagnosis.errorCode'),
      dataIndex: 'error_code',
      key: 'error_code',
      minWidth: 100,
      align: 'left',
    },
    {
      title: t('deployer.diagnosis.errorDesc'),
      dataIndex: 'description',
      key: 'description',
      minWidth: 200,
      align: 'left',
    },
    {
      title: t('deployer.diagnosis.level'),
      dataIndex: 'level',
      key: 'level',
      minWidth: 100,
      align: 'left',
      render: (text: any) => <Tag color={LevelColor[text]}>{LevelEnum[text]}</Tag>,
    },
    {
      title: t('deployer.diagnosis.reason'),
      dataIndex: 'reason',
      key: 'reason',
      minWidth: 200,
      align: 'left',
    },
    {
      title: t('deployer.diagnosis.solution'),
      dataIndex: 'diagnosis_result',
      key: 'resolve',
      minWidth: 200,
      align: 'left',
    },

    {
      title: t('deployer.diagnosis.vehiclePosition'),
      dataIndex: 'vehicle_position',
      key: 'vehicle_position',
      minWidth: 100,
      align: 'left',
    },
    {
      title: t('common.action'),
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
                  toast.success(t('common.actionSuccess'));
                  getCurrentData();
                }
              }}
            >
              {record?.diagnosis_result ? t('deployer.diagnosis.diagnosed') : t('deployer.diagnosis.diagnosis')}
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
                {t('deployer.diagnosis.downloadLog')}
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
