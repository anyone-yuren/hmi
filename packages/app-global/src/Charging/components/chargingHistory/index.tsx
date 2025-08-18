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
    { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: '最近14天', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: '最近30天', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: '最近90天', value: [dayjs().add(-90, 'd'), dayjs()] },
  ];
  return (
    <Drawer
      closable
      destroyOnHidden
      title={<p>充电记录</p>}
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
                label: <span aria-label='今天'>今天</span>,
                value: () => [todayStart, today], // 5.8.0+ support function
              },
              ...rangePresets,
            ]}
          />

          <Button type='primary' onClick={submit}>
            查询
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
                    title: '起始电量',
                    dataIndex: 'start_power',
                    key: 'start_power',
                  },
                  {
                    title: '结束电量',
                    dataIndex: 'end_power',
                    key: 'end_power',
                  },
                  {
                    title: '充电度数',
                    dataIndex: 'charging_degree',
                    key: 'charging_degree',
                  },
                  {
                    title: '开始时间',
                    dataIndex: 'start_time',
                    key: 'start_time',
                    render: (text) => dayjs(text * 1000).format('YYYY-MM-DD HH:mm:ss'),
                  },
                  {
                    title: '结束时间',
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
