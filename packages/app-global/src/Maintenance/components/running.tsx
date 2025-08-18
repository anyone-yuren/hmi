import {
  DoubleRightOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { useGlobalStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { App, Button, Popconfirm, Skeleton, Tooltip } from 'antd';
import { useTheme } from 'antd-style';
import { SvgIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { getRunningData, maintenance } from '../services';
interface Props {
  loading: boolean;
  data: any;
  reload: () => void;
}
const Running = (props: Props) => {
  const { loading, data, reload } = props;
  const { modal } = App.useApp();
  const { token } = useGlobalStore(
    useShallow((state) => ({
      token: state.token,
    })),
  );
  const STATUS = ['正常', '已触发', '严重超期'];
  const theme = useTheme();
  const datePercentage = (data?.current?.time ?? 182) / (data?.condition?.time ?? 180);
  const milesPercentage = (data?.current?.miles ?? 70) / (data?.condition?.miles ?? 1000);
  const COLORS = [theme.colorSuccessText, theme.colorWarningText, theme.colorErrorText];
  const { data: runningData, loading: runningLoading } = useRequest(getRunningData);
  const { run: maintain } = useRequest(maintenance, {
    manual: true,
    onSuccess: () => {
      reload();
    },
  });
  return (
    <div className='relative w-full h-full rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/25 shadow-[0_25px_80px_-25px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.35)] overflow-hidden'>
      <Tooltip
        title={
          <>
            <div className='text-md font-bold'>维保条件：</div>
            <div>时长：{data?.condition?.time ?? '-'}天</div>
            <div>行走公里数：{data?.condition?.miles ?? '-'}公里</div>
          </>
        }
      >
        <QuestionCircleOutlined
          className='absolute top-4 right-4 z-20'
          style={{
            fontSize: 20,
          }}
        />
      </Tooltip>
      {/* 顶部高光 */}
      <div className='pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-[#e47254]/100 to-[#d71752]'></div>

      {/* 内容 */}
      <div className='relative z-10 h-full p-8 flex flex-col justify-between'>
        <div className='flex flex-col w-full items-center justify-center gap-2'>
          <SvgIcon name='running' size={120} />
          <h3 className='text-xl xl:text-3xl font-semibold tracking-tight'>行走系统</h3>
          <p className='mt-2 text-white/80 max-w-xl'>
            移动执行机构，由驱动电机、转向机构、轮组及相应控制器组成，接收电控指令实现前进、后退、转向及调速，保障移动精准性与稳定性。
          </p>
        </div>
        <div className='flex flex-col w-full items-end justify-center gap-2'>
          <div className='flex flex-col items-end'>
            <h4 className='text-xs'>维保状态</h4>
            {!loading ? (
              <p className='text-lg font-bold' style={{ color: COLORS[data?.status ?? 1] }}>
                {STATUS[data?.status ?? 1]}
              </p>
            ) : (
              <Skeleton.Button active size='small' />
            )}
          </div>

          <div className='flex flex-col items-end'>
            <h4 className='text-xs'>已维保次数</h4>
            {loading ? (
              <Skeleton.Button active size='small' />
            ) : (
              <p className='text-lg font-bold'>{data?.alreadyMaintainTimes ?? '-'}次</p>
            )}
          </div>
          <div className='flex flex-col items-end'>
            <h4 className='text-xs'>上次维保</h4>
            {loading ? (
              <Skeleton.Button active size='small' className='!w-36' />
            ) : (
              <div className='p-2 rounded-md bg-gradient-to-br from-white/20 to-white/5 flex items-center gap-2'>
                <div className='text-xs flex items-center gap-1'>
                  <ScheduleOutlined />
                  {data?.history?.[data?.history?.length - 1]?.date ?? '-'}
                </div>
                <div className='text-xs flex items-center gap-1'>
                  <LineChartOutlined />
                  里程 {data?.history?.[data?.history?.length - 1]?.miles ?? '-'}km
                </div>
              </div>
            )}
          </div>
          <div className='flex flex-col items-end'>
            <Tooltip placement='topRight' title='维保触发条件为：规定使用时间或规定行驶里程，二者以先达到者为准。'>
              <h4 className='text-xs'>
                下次维保 <InfoCircleOutlined />
              </h4>
            </Tooltip>
            {loading ? (
              <Skeleton.Button active size='small' className='!w-36' />
            ) : (
              <div className='p-2 rounded-md bg-gradient-to-br from-white/20 to-white/5 flex items-center gap-2'>
                <div className='text-xs flex items-center gap-1'>
                  <ScheduleOutlined />
                  {data?.next?.date ?? '-'}
                </div>
                <div className='text-xs flex items-center gap-1'>
                  <LineChartOutlined />
                  里程 {data?.next?.miles ?? '-'}km
                </div>
              </div>
            )}
          </div>
          <div className='flex flex-col items-end w-full'>
            <h4 className='text-md'>当前进度</h4>
            {loading ? (
              <Skeleton.Button active size='small' className='!w-full' />
            ) : (
              <div className='flex gap-2 w-full'>
                <div className='flex flex-1 items-center gap-2'>
                  <LineChartOutlined />
                  {/* <span>0</span> */}
                  <div className='flex-1 h-1 bg-white/20 rounded-[2px]'>
                    <div className='h-full bg-white rounded-full' style={{ width: `${milesPercentage * 100}%` }}></div>
                  </div>
                  <span>{data?.condition?.miles ?? '-'}km</span>
                </div>
                <div className='flex flex-1 items-center gap-2'>
                  <ScheduleOutlined />
                  <div className='flex-1 h-1 bg-white/20 rounded-[2px]'>
                    <div
                      className=' h-full bg-white rounded-full bg-gradient-to-r from-white to-yellow-400'
                      style={{ width: `${datePercentage * 100}%` }}
                    ></div>
                  </div>
                  <span>{data?.condition?.time ?? '-'}天</span>
                </div>
              </div>
            )}
          </div>
          <div className='flex flex-col items-end'>
            <h4 className='text-xs font-bold cursor-pointer'>
              <Popconfirm
                placement='topRight'
                // title={'维保条件：时长：180天，行走公里数：1000公里'}
                title={
                  <>
                    <div className='flex items-center gap-2'>
                      <span className='font-bold min-w-24 text-right'>刹车次数：</span>
                      {runningData?.data?.braking_times ?? '-'}次
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='font-bold min-w-24 text-right'>行走公里数：</span>
                      {runningData?.data?.running_distance ?? '-'}米
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='font-bold min-w-24 text-right'>运行时间：</span>
                      {runningData?.data?.running_seconds ?? '-'}秒
                    </div>
                  </>
                }
              >
                更多信息 <DoubleRightOutlined />
              </Popconfirm>
            </h4>
          </div>
        </div>
        <div className='flex gap-3 justify-end'>
          {token === 'admin' && (
            <Button
              disabled={loading || !data?.next}
              size='large'
              className='px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition border border-white/30 backdrop-blur-md'
              onClick={() => {
                modal.confirm({
                  title: '维保',
                  content: '确认维保吗？',
                  onOk: () => {
                    maintain({
                      subsystem: 1,
                    });
                  },
                });
              }}
            >
              维保
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Running;
