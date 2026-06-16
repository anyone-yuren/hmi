import { RedoOutlined } from '@ant-design/icons';
import { Button, List, Radio, Result, Splitter, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import LoadingPage from '../../../../components/PageLoading/Loading';

const { Paragraph } = Typography;

const NodeLogs = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const loadListNode = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible(true);
    }, 2000);
  };
  const nodesData = [
    {
      title: '20250802-151349.[ERROR]',
    },
    {
      title: '20250804-161507.[WARN]',
    },
    {
      title: '20250804-161507.[INFO]',
    },
    {
      title: '20250804-161507.[DEBUG]',
    },
    {
      title: '20250804-161507.[INFO]',
    },
    {
      title: '20250804-161507.[DEBUG]',
    },
    {
      title: '20250806-165140.[ERROR]',
    },
    {
      title: '20250806-165140.[DEBUG]',
    },
  ];
  return (
    <div className='w-full h-full flex'>
      <Splitter className='w-full h-full'>
        <Splitter.Panel defaultSize='25%' min='20%' max='30%'>
          <div className='p-2'>
            <h2 className='text-lg font-bold mb-1 flex items-center justify-between'>
              {t('common.about.loglist')}
              <Button
                type='primary'
                icon={<RedoOutlined />}
                onClick={() => {
                  setLoadingList(true);
                  setVisible(false);
                  setTimeout(() => {
                    setLoadingList(false);
                  }, 2000);
                }}
              >
                {t('common.refresh')}
              </Button>
            </h2>
            <List
              className='w-full'
              itemLayout='horizontal'
              dataSource={nodesData}
              loading={loadingList}
              renderItem={(item, index) => (
                <List.Item
                  className='cursor-pointer hover:bg-[#234e70]'
                  onClick={() => loadListNode()}
                >
                  <List.Item.Meta
                    title={
                      <div className='flex items-center gap-2 justify-between'>
                        <div className='px-1 flex items-center gap-1'>
                          {item.title}
                        </div>
                      </div>
                    }
                    description={
                      <div className='flex items-center gap-2'>
                        <span>{item.time}</span>
                        <span>{item.version}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div className='w-full h-full p-2'>
            {visible &&
              (loading ? (
                <LoadingPage />
              ) : (
                <div className='p-[2px] w-full h-full rounded-lg relative flex flex-col gap-2'>
                  <div className='flex items-center justify-between p-2 bg-black/40 shadow-sm rounded-lg'>
                    <p className='m-0'>20250804-161507.[DEBUG]</p>
                    <Radio.Group
                      defaultValue='a'
                      buttonStyle='solid'
                      className=''
                    >
                      <Radio.Button value='a'>{t('common.all')}</Radio.Button>
                      <Radio.Button value='b' className='text-[#ff4d4f]'>
                        {t('common.error')}
                      </Radio.Button>
                      <Radio.Button value='c' className='text-[#faad14]'>
                        {t('common.warn')}
                      </Radio.Button>
                      <Radio.Button value='d' className='text-[#409eff]'>
                        {t('common.info')}
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                  <div className='bg-black/80 rounded-lg w-full h-full p-2 overflow-y-auto flex-1'>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:35:22.140466] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph type='warning' className='!mb-2'>
                      [2025-08-02 19:35:32.141429] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:35:42.142385] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2' type='warning'>
                      [2025-08-02 19:35:52.143405] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:36:02.144383] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:36:05.627674] [INFO] [运行信息]任务号:0,
                      任务状态:初始化, 半自动模式, 不在点上, 货物状态:无货,
                      电量:46, 急停:0, 避障:1, 错误码:0x00000000, 车号:25,
                      剩余路线数量:0
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:36:12.145327] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2' type='danger'>
                      [2025-08-08 16:00:16.200668] [ERROR] Time synchronization
                      successful motion data count is too few 4
                    </Paragraph>
                    <Paragraph className='!mb-2' type='warning'>
                      [2025-08-02 19:36:22.146250] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2' type='warning'>
                      [2025-08-02 19:36:32.147161] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2' type='warning'>
                      [2025-08-02 19:36:42.148088] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2' type='warning'>
                      [2025-08-02 19:36:52.148989] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2' type='warning'>
                      [2025-08-02 19:37:02.149868] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:37:12.150771] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:37:22.151673] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:37:32.152575] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:37:42.153477] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:35:22.140466] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2' type='warning'>
                      [2025-08-02 19:35:32.141429] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:35:42.142385] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2' type='warning'>
                      [2025-08-02 19:35:52.143405] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:36:02.144383] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:36:05.627674] [INFO] [运行信息]任务号:0,
                      任务状态:初始化, 半自动模式, 不在点上, 货物状态:无货,
                      电量:46, 急停:0, 避障:1, 错误码:0x00000000, 车号:25,
                      剩余路线数量:0
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:36:12.145327] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2' type='danger'>
                      [2025-08-08 16:00:16.200668] [ERROR] Time synchronization
                      successful motion data count is too few 4
                    </Paragraph>
                    <Paragraph className='!mb-2' type='warning'>
                      [2025-08-02 19:36:22.146250] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2' type='warning'>
                      [2025-08-02 19:36:32.147161] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2' type='warning'>
                      [2025-08-02 19:36:42.148088] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2' type='warning'>
                      [2025-08-02 19:36:52.148989] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2' type='warning'>
                      [2025-08-02 19:37:02.149868] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:37:12.150771] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:37:22.151673] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:37:32.152575] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                    <Paragraph className='!mb-2'>
                      [2025-08-02 19:37:42.153477] [WARN] 车体已连续15天未充满电
                    </Paragraph>
                  </div>
                </div>
              ))}
            {!visible && (
              <Result
                icon={<SvgIcon size={320} name={'noLog'} />}
                title={t('common.about.nolog')}
                subTitle={t('common.about.choose')}
                extra={
                  <Button type='primary' onClick={() => setVisible(true)}>
                    {t('common.choose')}
                  </Button>
                }
              ></Result>
            )}
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};

export default NodeLogs;
