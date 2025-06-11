import { LogChart } from '@gbeata/charts-ui';
import { dashboard } from 'apis';
import dayjs from 'dayjs';
import { GSearchTable } from 'gbeata';
import { useTranslation } from 'react-i18next';
import useCommonData from '../hooks/useCommonData';

const TaskLog = () => {
  const { type, method, source } = useCommonData();
  const { t } = useTranslation();
  return (
    <div className='flex gap-4 flex-col'>
      <LogChart />
      <GSearchTable
        tableExtend={{
          size: 'small',
          bordered: true,
          scroll: { x: 1500 },
        }}
        api={dashboard.exceptionLog}
        fields={[
          {
            title: t('global.logs.source'),
            key: 'source',
            render: (text) => {
              return source[text] ?? '-';
            },
            width: 150,
          },
          {
            title: t('global.logs.conent'),
            dataIndex: 'content',
          },
          {
            title: t('global.logs.creationTime'),
            dataIndex: 'creationTime',
            width: 200,
            render: (text) => {
              return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
            },
          },
        ]}
      ></GSearchTable>
    </div>
  );
};
export default TaskLog;
