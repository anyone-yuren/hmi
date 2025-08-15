import { DoubleRightOutlined, InfoCircleOutlined, LineChartOutlined, ScheduleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useTheme } from 'antd-style';
import { SvgIcon } from 'ui';

const Running = () => {
  const theme = useTheme();
  return (
    <div className='relative w-full h-full rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/25 shadow-[0_25px_80px_-25px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.35)] overflow-hidden'>
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
          <div className='flex  flex-col items-end'>
            <h4 className='text-xs'>维保状态</h4>
            <p className='text-lg font-bold' style={{ color: theme.colorWarningTextHover }}>
              即将维保
            </p>
          </div>

          <div className='flex flex-col items-end'>
            <h4 className='text-xs'>已维保次数</h4>
            <p className='text-lg font-bold'>2次</p>
          </div>
          <div className='flex flex-col items-end'>
            <h4 className='text-xs'>上次维保</h4>
            <div className='p-2 rounded-md bg-gradient-to-br from-white/20 to-white/5 flex items-center gap-2'>
              <div className='text-xs flex items-center gap-1'>
                <ScheduleOutlined />
                2025-01-01
              </div>
              <div className='text-xs flex items-center gap-1'>
                <LineChartOutlined />
                里程 180km
              </div>
            </div>
          </div>
          <div className='flex flex-col items-end'>
            <Tooltip placement='topRight' title='维保触发条件为：规定使用时间或规定行驶里程，二者以先达到者为准。'>
              <h4 className='text-xs'>
                下次维保 <InfoCircleOutlined />
              </h4>
            </Tooltip>
            <div className='p-2 rounded-md bg-gradient-to-br from-white/20 to-white/5 flex items-center gap-2'>
              <div className='text-xs flex items-center gap-1'>
                <ScheduleOutlined />
                2025-07-01
              </div>
              <div className='text-xs flex items-center gap-1'>
                <LineChartOutlined />
                里程 280km
              </div>
            </div>
          </div>
          <div className='flex flex-col items-end w-full'>
            <h4 className='text-md'>当前进度</h4>
            <div className='flex gap-2 w-full'>
              <div className='flex flex-1 items-center gap-2'>
                <LineChartOutlined />
                {/* <span>0</span> */}
                <div className='flex-1 h-1 bg-white/20 rounded-[2px]'>
                  <div className='w-1/2 h-full bg-white rounded-full'></div>
                </div>
                <span>280(km)</span>
              </div>
              <div className='flex flex-1 items-center gap-2'>
                <ScheduleOutlined />
                <div className='flex-1 h-1 bg-white/20 rounded-[2px]'>
                  <div className='w-3/4 h-full bg-white rounded-full bg-gradient-to-r from-white to-yellow-400'></div>
                </div>
                <span>180</span>
              </div>
            </div>
          </div>
          <div className='flex flex-col items-end'>
            <h4 className='text-xs font-bold cursor-pointer'>
              更多信息 <DoubleRightOutlined />
            </h4>
          </div>
        </div>
        <div className='flex gap-3 justify-end'>
          <button className='px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition border border-white/30 backdrop-blur-md'>
            维保
          </button>
        </div>
      </div>
    </div>
  );
};

export default Running;
