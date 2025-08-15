import { ClockCircleOutlined, DoubleRightOutlined, InfoCircleOutlined, ScheduleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useTheme } from 'antd-style';
import { SvgIcon } from 'ui';
import Running from './components/running';
import Sensor from './components/sensor';

const Maintenance = () => {
  const theme = useTheme();
  return (
    <div className='flex w-full h-full items-center justify-center gap-4 p-4'>
      <div className='flex flex-1  h-full'>
        <Sensor />
      </div>
      <div className='flex flex-1  h-full'>
        <Running />
      </div>
      <div className='flex flex-1  h-full'>
        {/* 玻璃卡片 */}
        <div className='relative w-full h-full rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/25 shadow-[0_25px_80px_-25px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.35)] overflow-hidden'>
          {/* 顶部高光 */}
          <div className='pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-[#d763b7]/100 to-[#462580]'></div>
          {/* 内容 */}
          <div className='relative z-10 h-full p-8 flex flex-col justify-between'>
            <div className='flex flex-col w-full items-center justify-center gap-2'>
              <SvgIcon name='left' size={120} />
              <h3 className='text-xl xl:text-3xl font-semibold tracking-tight'>举升系统</h3>
              <p className='mt-2 text-white/80 max-w-xl'>
                举升电机、液压泵（或电动推杆）、货叉架及控制器组成，接收指令驱动货叉升降，精准完成取放货作业，兼具负载能力与运行平稳性。
              </p>
            </div>
            <div className='flex flex-col w-full items-end justify-center gap-2'>
              <div className='flex  flex-col items-end'>
                <h4 className='text-xs'>维保状态</h4>
                <p className='text-lg font-bold' style={{ color: theme.colorErrorText }}>
                  维保已过期
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
                    <ClockCircleOutlined />
                    运行时间 1080mm
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
                    <ClockCircleOutlined />
                    运行时间 2080mm
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end w-full'>
                <h4 className='text-md'>当前进度</h4>
                <div className='flex gap-2 w-full'>
                  <div className='flex flex-1 items-center gap-2'>
                    <ClockCircleOutlined />
                    {/* <span>0</span> */}
                    <div className='flex-1 h-1 bg-white/20 rounded-[2px]'>
                      <div className='w-1/2 h-full bg-white rounded-full'></div>
                    </div>
                    <span>280(mm)</span>
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
              <button className='px-4 py-2 rounded-xl bg-transparent hover:bg-white/10 transition border border-white/25'>
                维保
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
