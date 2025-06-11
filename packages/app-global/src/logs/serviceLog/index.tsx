import { LogChart } from '@gbeata/charts-ui';
import { Tooltip } from 'antd';
import { dashboard } from 'apis';
import { GSearchTable } from 'gbeata';
import { useTranslation } from 'react-i18next';
import useCommonData from '../hooks/useCommonData';

const ServiceLog = () => {
  const { type, method, source } = useCommonData();
  const { t } = useTranslation();
  return (
    <div className='flex gap-4 flex-col'>
      <LogChart />
      <GSearchTable
        api={dashboard.interfaceLog}
        fields={[
          {
            title: 'ip',
            key: 'ip',
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
            title: t('global.logs.method'),
            key: 'method',
            width: 150,
            render: (text) => {
              return method[text] ?? '-';
            },
          },
          {
            title: t('global.logs.requestUrl'),
            key: 'requestUrl',
            width: 200,
          },
          {
            title: t('global.logs.requestParam'),
            key: 'requestParam',
            width: 200,
          },
          {
            title: t('global.logs.statusCode'),
            key: 'httpStatusCode',
            width: 150,
          },
          {
            title: t('global.logs.reponseData'),
            key: 'returnData',
            width: 200,
            render: (text) => {
              return <Tooltip title={text}>{text?.length > 100 ? `${text.substring(0, 100)}...` : text}</Tooltip>;
            },
          },
        ]}
        tableExtend={{
          bordered: true,
          scroll: { x: 1500 },
          size: 'small',
        }}
      ></GSearchTable>
    </div>
  );
};
export default ServiceLog;
