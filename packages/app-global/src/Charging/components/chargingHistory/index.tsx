import { useRequest } from 'ahooks';
import { Button, DatePicker, Drawer, Result, Spin, Table, TimeRangePickerProps } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import useDrawerClassName from '../../../hooks/useDrawerClassName';
import { postChargingHistory } from '../../services';

const { RangePicker } = DatePicker;
interface Props {
  open: boolean;
  onClose: () => {};
}
const ChargingHistory = (props: Props) => {
  const { t } = useTranslation();
  const { open, onClose } = props;
  const classNames = useDrawerClassName();
  const today = dayjs();
  const todayStart = dayjs().startOf('day');
  const [timeRange, setTimeRange] = useState([todayStart, today]);
  const { data, loading, run } = useRequest(postChargingHistory, {
    manual: true,
  });
  useEffect(() => {
    if (!open) {
      return;
    }
    run({
      start_time: todayStart.unix(),
      end_time: today.unix(),
    });
  }, [open]);

  const submit = () => {
    run({
      start_time: timeRange[0].unix(),
      end_time: timeRange[1].unix(),
    });
  };

  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: t('common.charging.recent7Days'), value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: t('common.charging.recent14Days'), value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: t('common.charging.recent30Days'), value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: t('common.charging.recent90Days'), value: [dayjs().add(-90, 'd'), dayjs()] },
  ];
  return (
    <Drawer
      closable
      destroyOnHidden
      title={<p>{t('common.charging.chargingRecord')}</p>}
      placement='right'
      open={open}
      loading={false}
      classNames={{
        ...classNames,
        body: '!p-0',
      }}
      width={'70%'}
      onClose={onClose}
    >
      <div className='w-full h-full p-4 gap-4 flex flex-col'>
        <div className='w-full p-2 flex items-center justify-end gap-2 rounded-xl bg-white/20'>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format='YYYY-MM-DD HH:mm'
            onChange={(value, dateString) => {
              setTimeRange(value);
            }}
            onOk={() => {}}
            defaultValue={[todayStart, today]}
            presets={[
              {
                label: <span aria-label={t('common.charging.today')}>{t('common.charging.today')}</span>,
                value: () => [todayStart, today], // 5.8.0+ support function
              },
              ...rangePresets,
            ]}
          />

          <Button type='primary' onClick={submit}>
            {t('common.search')}
          </Button>
        </div>
        {/* 查询结果 */}
        <div className='w-full h-full bg-white/20 rounded-xl'>
          {loading ? (
            <div className='w-full h-full flex items-center justify-center'>
              <Spin size='large' />
            </div>
          ) : data?.data ? (
            <div className='w-full h-full p-4'>
              <Table
                columns={[
                  {
                    title: t('common.charging.startPower'),
                    dataIndex: 'start_power',
                    key: 'start_power',
                  },
                  {
                    title: t('common.charging.endPower'),
                    dataIndex: 'end_power',
                    key: 'end_power',
                  },
                  {
                    title: t('common.charging.chargingDegree'),
                    dataIndex: 'charging_degree',
                    key: 'charging_degree',
                  },
                  {
                    title: t('common.startTime'),
                    dataIndex: 'start_time',
                    key: 'start_time',
                    render: (text) => dayjs(text * 1000).format('YYYY-MM-DD HH:mm:ss'),
                  },
                  {
                    title: t('common.endTime'),
                    dataIndex: 'end_time',
                    key: 'end_time',
                    render: (text) => dayjs(text * 1000).format('YYYY-MM-DD HH:mm:ss'),
                  },
                ]}
                dataSource={data?.data}
                pagination={{
                  total: data?.data.length,
                  defaultCurrent: 1,
                  pageSize: 6,
                }}
                rowKey={(record) => record.end_time}
              />
            </div>
          ) : (
            <Result icon={<SvgIcon name='without' size={340} />} title={t('common.noData')} />
          )}
        </div>
      </div>
    </Drawer>
  );
};
export default ChargingHistory;
