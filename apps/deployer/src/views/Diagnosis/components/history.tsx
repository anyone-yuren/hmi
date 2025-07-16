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
        toast.error(res.error_description || t('当前错误不支持诊断'));
      }
    },
  });

  const columns: any[] = [
    {
      title: t('时间'),
      dataIndex: 'generate_time',
      key: 'generate_time',
      minWidth: 150,
      align: 'left',
      render: (text: any) => dayjs.unix(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    // {
    //   title: "消失时间",
    //   dataIndex: "disappear",
    //   key: "disappear",
    //   minWidth: 150,
    //   align: "left",
    // },
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
      width: 300,
      align: 'left',
    },
    {
      title: t('级别'),
      dataIndex: 'level',
      key: 'level',
      minWidth: 100,
      align: 'left',
      render: (text: any) => {
        return <Tag color={LevelColor[text]}>{LevelEnum[text]}</Tag>;
      },
    },
    {
      title: t('产生原因'),
      dataIndex: 'error_reason',
      key: 'error_reason',
      minWidth: 200,
      align: 'left',
    },
    {
      title: t('解决措施'),
      dataIndex: 'diagnosis_result',
      key: 'diagnosis_result',
      minWidth: 200,
      align: 'left',
    },
    {
      title: t('操作'),
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
            const { diagnosis_result } = res;
            if (res.error_code == 0) {
              toast.success(t('操作成功'));
              // tableData.map((item) => {
              //   if (item.error_code == error_code) {
              //     item.diagnosis_result = diagnosis_result;
              //   }
              // });
              // setTableData([...tableData]);
              getHistoryData();
            }
          }}
        >
          {record?.diagnosis_result ? t('已诊断') : t('诊断')}
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
      scroll={{ x: 1500, y: 570 }}
      locale={{
        emptyText: <EmptyBox titleColor='#fff' backgroundColor='transparent' />,
      }}
    ></Table>
  );
};
export default History;
