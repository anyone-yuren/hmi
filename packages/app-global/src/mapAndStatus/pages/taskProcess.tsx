import { ClockCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Drawer, Timeline, Typography } from 'antd';
import { V1GetMissionDetailAsync } from 'apis';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
type Props = {
  guid: string;
  open?: boolean;
  closeFn?: () => void;
};

const TaskProcess = (props: Props) => {
  const { guid, open, closeFn } = props;
  // 获取任务进度
  const [proccess, setProccess] = useState<any>(null);
  const {
    data: taskData,
    loading: taskLoading,
    run: getProcess,
  } = useRequest(V1GetMissionDetailAsync, {
    manual: true,
    onSuccess: (res) => {
      if (res) {
        let lastIndex = null;
        setProccess(
          res.missionItemDetails.map((item: any, index) => {
            if (item.missionTrajectoryState == res.currentTrajectoryState && item.missionItemId === res.missionItemId) {
              lastIndex = index;
            }
            return {
              color: !lastIndex ? 'green' : 'gray',
              dot:
                item.missionTrajectoryState === res.currentTrajectoryState && index === lastIndex ? (
                  <ClockCircleOutlined className='text-yellow-500' />
                ) : null,
              children: (
                <div className='flex flex-col'>
                  <div className='flex items-center justify-between'>
                    <Typography.Text strong>{item.stateDescription}</Typography.Text>
                    <div className='opacity-50'></div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <Typography.Text type='danger' className='text-xs'>
                      {/*  */}
                      {item.missionTrajectoryState == res.currentTrajectoryState &&
                      item.missionItemId === res.missionItemId
                        ? res.currentStateDescription
                        : null}
                    </Typography.Text>
                  </div>
                  {item.trajectoryStateTime ? (
                    <div className='mt-2 flex items-center gap-2 text-xs'>
                      <span className='font-medium opacity-60'>
                        发生时间：{dayjs(item.trajectoryStateTime).format('YYYY-MM-DD HH:mm:ss')}
                      </span>
                    </div>
                  ) : null}
                </div>
              ),
            };
          }),
        );
      }
    },
  });
  useEffect(() => {
    if (!guid || !open) {
      return;
    }
    setOpen(true);
    getProcess({
      guid,
    });
  }, [guid, open]);
  const [show, setOpen] = useState(false);
  return (
    <Drawer
      title='任务进度'
      placement='right'
      closable={false}
      loading={taskLoading}
      width={240}
      onClose={() => {
        setOpen(false);
        closeFn();
      }}
      open={show}
      getContainer={false}
    >
      <Timeline items={proccess}></Timeline>
    </Drawer>
  );
};
export default TaskProcess;
