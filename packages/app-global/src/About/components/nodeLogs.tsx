import { RedoOutlined } from '@ant-design/icons';
import { Button, List, Radio, Result, Splitter, Typography } from 'antd';
import { useState } from 'react';
import { SvgIcon } from 'ui';
import LoadingPage from '../../components/PageLoading/Loading';

const { Paragraph } = Typography;

const NodeLogs = () => {
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
    <div
      className='w-full h-full flex'
      style={{
        background: `
      radial-gradient(circle at 60% 90%, #3f6fa199, #0000 60%), 
      radial-gradient(circle at 20px 20px, #2e67a1cc, #0000 25%), 
      #182336
    `,
      }}
    >
      <Splitter className='w-full h-full'>
        <Splitter.Panel defaultSize='25%' min='20%' max='30%'>
          <div className='p-2'>
            <h2 className='text-lg font-bold mb-1 flex items-center justify-between'>
              日志列表{' '}
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
                刷新
              </Button>
            </h2>
            <List
              className='w-full'
              itemLayout='horizontal'
              dataSource={nodesData}
              loading={loadingList}
              renderItem={(item, index) => (
                <List.Item className='cursor-pointer hover:bg-[#234e70]' onClick={() => loadListNode()}>
                  <List.Item.Meta
                    title={
                      <div className='flex items-center gap-2 justify-between'>
                        <div className='px-1 flex items-center gap-1'>{item.title}</div>
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
                <div className='p-[2px] w-full h-full rounded-lg bg-gradient-to-r from-[#234e70] to-teal-400 relative flex flex-col gap-2'>
                  <div className='flex items-center justify-between p-2 bg-black/40 shadow-sm rounded-lg'>
                    <p className='m-0'>20250804-161507.[DEBUG]</p>
                    <Radio.Group defaultValue='a' buttonStyle='solid' className=''>
                      <Radio.Button value='a'>全部</Radio.Button>
                      <Radio.Button value='b' className='text-[#ff4d4f]'>
                        错误
                      </Radio.Button>
                      <Radio.Button value='c' className='text-[#faad14]'>
                        警告
                      </Radio.Button>
                      <Radio.Button value='d' className='text-[#409eff]'>
                        信息
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                  <div className='bg-black/80 rounded-lg w-full h-full p-6 overflow-y-auto flex-1'>
                    <Paragraph>[2025-08-02 19:35:22.140466] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph type='warning'>[2025-08-02 19:35:32.141429] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>[2025-08-02 19:35:42.142385] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph type='warning'>[2025-08-02 19:35:52.143405] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>[2025-08-02 19:36:02.144383] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>
                      [2025-08-02 19:36:05.627674] [INFO] [运行信息]任务号:0, 任务状态:初始化, 半自动模式, 不在点上,
                      货物状态:无货, 电量:46, 急停:0, 避障:1, 错误码:0x00000000, 车号:25, 剩余路线数量:0
                    </Paragraph>
                    <Paragraph>[2025-08-02 19:36:12.145327] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph type='danger'>
                      [2025-08-08 16:00:16.200668] [ERROR] Time synchronization successful motion data count is too few
                      4
                    </Paragraph>
                    <Paragraph type='warning'>[2025-08-02 19:36:22.146250] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph type='warning'>[2025-08-02 19:36:32.147161] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph type='warning'>[2025-08-02 19:36:42.148088] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph type='warning'>[2025-08-02 19:36:52.148989] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph type='warning'>[2025-08-02 19:37:02.149868] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>[2025-08-02 19:37:12.150771] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>[2025-08-02 19:37:22.151673] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>[2025-08-02 19:37:32.152575] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>[2025-08-02 19:37:42.153477] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>[2025-08-02 19:35:22.140466] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph type='warning'>[2025-08-02 19:35:32.141429] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>[2025-08-02 19:35:42.142385] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph type='warning'>[2025-08-02 19:35:52.143405] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>[2025-08-02 19:36:02.144383] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>
                      [2025-08-02 19:36:05.627674] [INFO] [运行信息]任务号:0, 任务状态:初始化, 半自动模式, 不在点上,
                      货物状态:无货, 电量:46, 急停:0, 避障:1, 错误码:0x00000000, 车号:25, 剩余路线数量:0
                    </Paragraph>
                    <Paragraph>[2025-08-02 19:36:12.145327] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph type='danger'>
                      [2025-08-08 16:00:16.200668] [ERROR] Time synchronization successful motion data count is too few
                      4
                    </Paragraph>
                    <Paragraph type='warning'>[2025-08-02 19:36:22.146250] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph type='warning'>[2025-08-02 19:36:32.147161] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph type='warning'>[2025-08-02 19:36:42.148088] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph type='warning'>[2025-08-02 19:36:52.148989] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph type='warning'>[2025-08-02 19:37:02.149868] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>[2025-08-02 19:37:12.150771] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>[2025-08-02 19:37:22.151673] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>[2025-08-02 19:37:32.152575] [WARN] 车体已连续15天未充满电</Paragraph>
                    <Paragraph>[2025-08-02 19:37:42.153477] [WARN] 车体已连续15天未充满电</Paragraph>
                  </div>
                </div>
              ))}
            {!visible && (
              <Result
                icon={<SvgIcon size={320} name={'noLog'} />}
                title='暂无日志'
                subTitle='请选择其他日志'
                extra={
                  <Button type='primary' onClick={() => setVisible(true)}>
                    选择
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
