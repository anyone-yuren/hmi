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
        api={dashboard.missionLog}
        fields={[
          {
            key: 'missionId',
            title: t('global.logs.missionId'),
          },
          {
            title: t('global.logs.source'),
            key: 'source',
            render: (text) => {
              return source[text] ?? '-';
            },
          },
          {
            title: t('global.logs.conent'),
            dataIndex: 'content',
          },
          {
            title: t('global.logs.method'),
            dataIndex: 'method',
            render: (text) => {
              return method[text] ?? '-';
            },
          },
          {
            title: t('global.logs.type'),
            dataIndex: 'type',
            render: (text) => {
              return type[text] ?? '-';
            },
          },
          {
            title: t('global.logs.creationTime'),
            dataIndex: 'creationTime',
            render: (text) => {
              return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
            },
          },
        ]}
        tableExtend={{
          bordered: true,
          scroll: { x: 1200 },
          size: 'small',
        }}
      ></GSearchTable>
    </div>
  );
};
export default TaskLog;
