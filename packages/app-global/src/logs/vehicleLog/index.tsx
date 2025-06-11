import { LogChart } from '@gbeata/charts-ui';
import { dashboard } from 'apis';
import dayjs from 'dayjs';
import { GSearchTable } from 'gbeata';
import { useTranslation } from 'react-i18next';
import useCommonData from '../hooks/useCommonData';

const VehicleLog = () => {
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
        api={dashboard.vehicleLog}
        fields={[
          {
            title: t('global.logs.vehicleNo'),
            key: 'vehicleNo',
            width: 150,
          },
          {
            title: t('global.logs.missionId'),
            key: 'missionId',
            width: 150,
          },
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
            key: 'content',
          },
          {
            title: t('global.logs.creationTime'),
            key: 'creationTime',
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
export default VehicleLog;
