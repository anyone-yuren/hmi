import EmptyBox from '@/components/Empty';
import { useRequest } from 'ahooks';
import { Button, Table, Tag } from 'antd';
import * as dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { LevelColor, LevelEnum } from '../enum';
import { getHistory, postErrorCode } from '../services';

const History = () => {
  const { t } = useTranslation();
  const {
    runAsync: getHistoryData,
    loading: historyLoading,
    data: historyData,
  } = useRequest(getHistory, {
    manual: false,
    onSuccess: (res: any) => {
      if (res.error_code !== 0) {
        toast.error(res.error_description || '');
      }
    },
  });

  const { runAsync: postErrorCodeData, loading: errorCodeLoading } = useRequest(postErrorCode, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.error_code !== 0) {
        toast.error(res.error_description || t('deployer.diagnosis.notSupportDiagnosis'));
      }
    },
  });

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
      width: 300,
      align: 'left',
    },
    {
      title: t('deployer.diagnosis.level'),
      dataIndex: 'level',
      key: 'level',
      minWidth: 100,
      align: 'left',
      render: (text: any) => {
        return <Tag color={LevelColor[text]}>{LevelEnum[text]}</Tag>;
      },
    },
    {
      title: t('deployer.diagnosis.reason'),
      dataIndex: 'error_reason',
      key: 'error_reason',
      minWidth: 200,
      align: 'left',
    },
    {
      title: t('deployer.diagnosis.solution'),
      dataIndex: 'diagnosis_result',
      key: 'diagnosis_result',
      minWidth: 200,
      align: 'left',
    },
    {
      title: t('common.action'),
      dataIndex: 'status',
      key: 'status',
      minWidth: 100,
      align: 'center',
      fixed: 'right',
      render: (text: any, record) => (
        <Button
          type='primary'
          variant='solid'
          size='small'
          disabled={record?.diagnosis_result ? true : false}
          onClick={async () => {
            const { generate_time, error_code, error_reason } = record;
            const res = await postErrorCodeData({
              generate_time,
              error_code,
              error_reason,
            });
            if (res.error_code == 0) {
              toast.success(t('common.actionSuccess'));
              getHistoryData();
            }
          }}
        >
          {record?.diagnosis_result ? t('deployer.diagnosis.diagnosed') : t('deployer.diagnosis.diagnosis')}
        </Button>
      ),
    },
  ];
  return (
    <Table
      columns={columns}
      size='large'
      loading={historyLoading || errorCodeLoading}
      dataSource={historyData?.data || []}
      scroll={{ x: 1500, y: 500 }}
      locale={{
        emptyText: <EmptyBox titleColor='#fff' backgroundColor='transparent' />,
      }}
    ></Table>
  );
};
export default History;
