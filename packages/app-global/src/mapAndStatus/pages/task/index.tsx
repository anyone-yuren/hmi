import { InfoCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Tooltip } from 'antd';
import { v1missionGetPagedListAsync, wms } from 'apis';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RunningTask from '../runningTask';
import RunningWmsTask from './runningWmsTask';

const TaskTabs = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('rcs');
  const [listData, setListData] = useState<any>([]);
  const [wmsListData, setWmsListData] = useState<any>([]);
  const items = [
    {
      key: 'rcs',
      tab: (
        <>
          <div className='flex gap-1 items-center'>
            <Tooltip
              title={
                <>
                  {t('common.vehicle.runningTip')}
                  <Button
                    type='link'
                    onClick={() => {
                      window.open('/rcs-web/#/task', '_blank');
                    }}
                  >
                    {t('common.viewAll')}
                  </Button>
                </>
              }
            >
              <InfoCircleOutlined />
            </Tooltip>
            rcs
          </div>
        </>
      ),
    },
    {
      key: 'wms',
      tab: 'wms',
    },
  ];
  const { run: getList, loading: listLoading } = useRequest(
    () =>
      v1missionGetPagedListAsync({
        missionState: 1,
      }),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.items?.length) {
          setListData(res.items ?? []);
        }
      },
    },
  );
  const { run: getWmsList, loading: listWmsLoading } = useRequest(
    () =>
      wms.getMission({
        states: [1, 2],
        MaxResultCount: 1000,
        SkipCount: 0,
        sorting: null,
      }),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.items?.length) {
          setWmsListData(res.items ?? []);
        }
      },
    },
  );
  useEffect(() => {
    getList();
    getWmsList();
  }, []);
  return (
    <Card
      className='h-full overflow-x-hidden flex flex-col'
      title={t('common.vehicle.running')}
      styles={{
        header: {},
        body: {
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        },
      }}
      tabList={items}
      activeTabKey={activeTab}
      onTabChange={setActiveTab}
      extra={
        <Button
          size='small'
          onClick={() => {
            getList();
            getWmsList();
          }}
          icon={<RedoOutlined spin={listLoading} />}
        />
      }
    >
      {/* <Tabs defaultActiveKey={activeTab} onChange={setActiveTab} items={items}></Tabs> */}
      <AnimatePresence mode='wait'>
        {activeTab === 'rcs' ? (
          <motion.div
            key={'rcs'}
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 0.3 }}
          >
            <RunningTask loading={listLoading} rcsList={listData} />
          </motion.div>
        ) : (
          <motion.div
            key={'wms'}
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 0.3 }}
          >
            <RunningWmsTask loading={listWmsLoading} wmsList={wmsListData} />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
export default TaskTabs;
