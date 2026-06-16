import { QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { IconifyIcon } from 'ui';
import sl15 from '../../assets/vehicles/MW_SE15.png';
import GrowPanel from '../home/components/growpanel';
import LineChart from './components/lineChart';
const ToolDashboard = () => {
  const navigate = useNavigate();
  return (
    <div
      className='bg-white/15 h-full flex flex-col gap-2 p-2 overflow-hidden overflow-y-auto'
      style={{
        backgroundImage: `
      radial-gradient(
        circle,
        rgba(0,0,0,0.50) 0%,
        rgba(0,0,0,0.65) 60%,
        rgba(0,0,0,1) 100%
      ),
    `,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* 暗角（四角渐变加深，可选） */}
      <div
        className='pointer-events-none absolute inset-0 '
        style={{
          background: `
        radial-gradient(
          circle at center,
          rgba(0,0,0,0) 60%,
          rgba(0,0,0,0.35) 100%
        )
      `,
        }}
      />

      <div className='h-1/2 w-full rounded-md flex gap-2 items-center justify-center'>
        <div className='w-1/2 h-full bg-white/5 rounded-md flex items-center justify-center gap-2'>
          <div
            className='flex-1 h-full bg-center bg-no-repeat bg-contain rounded-md'
            style={{
              backgroundImage: `url(${sl15})`,
              backgroundSize: '90%',
            }}
          ></div>
          <div className='flex-1  grid grid-cols-2 gap-4 justify-center items-center text-left'>
            {/* 车号 */}
            <div className='flex flex-col leading-tight'>
              <span className='text-xs opacity-70 flex items-center gap-1'>
                <IconifyIcon icon='icon-park-outline:car' size={16} />
                车号
              </span>
              <span className='text-base font-semibold flex items-center gap-1 group cursor-pointer'>
                R-015
                <IconifyIcon
                  icon='uil:edit'
                  size={16}
                  className=' opacity-0 group-hover:opacity-70 transition-opacity'
                />
              </span>
            </div>

            {/* 电量 */}
            <div className='flex flex-col leading-tight'>
              <span className='text-xs opacity-70 flex items-center gap-1'>
                <IconifyIcon icon='fluent:battery-1-28-regular' size={20} />
                电量
              </span>
              <span className='text-base font-semibold'>82%</span>
            </div>
            {/* IP 地址 */}
            <div className='flex flex-col leading-tight'>
              <span className='text-xs opacity-70'>IP 地址</span>
              <span className='text-base font-semibold flex items-center gap-1 group cursor-pointer'>
                192.168.1.100
                <IconifyIcon
                  icon='uil:edit'
                  size={16}
                  className=' opacity-0 group-hover:opacity-70 transition-opacity'
                />
              </span>
            </div>

            {/* 信号强度 */}
            <div className='flex flex-col leading-tight'>
              <span className='text-xs opacity-70 flex items-center gap-1'>
                <IconifyIcon icon='icon-park-outline:signal' size={16} />
                信号
              </span>
              <span className='text-base font-semibold'>良好</span>
            </div>

            {/* 位置 */}
            <div className='flex flex-col leading-tight'>
              <span className='text-xs opacity-70 flex items-center gap-1'>
                <IconifyIcon icon='carbon:location' size={16} />
                位置
              </span>
              <span className='text-base font-semibold flex items-center gap-1 group cursor-pointer'>
                A区 - 32号点
                <IconifyIcon
                  icon='uil:edit'
                  size={16}
                  className=' opacity-0 group-hover:opacity-70 transition-opacity'
                />
              </span>
            </div>

            {/* 定位状态 */}
            <div className='flex flex-col leading-tight'>
              <span className='text-xs opacity-70 flex items-center gap-1'>
                <IconifyIcon icon='lets-icons:status' size={16} />
                定位状态
              </span>
              <span className='text-base font-semibold text-green-400'>
                已定位
              </span>
            </div>
            <div className='flex flex-col leading-tight'>
              <span className='text-xs opacity-70 flex items-center gap-1'>
                <IconifyIcon icon='solar:tag-outline' size={16} />
                当前版本
              </span>
              <span className='text-base font-semibold text-yellow-400 flex items-center gap-1 group cursor-pointer'>
                1.0.0
                <IconifyIcon
                  className=' opacity-0 group-hover:opacity-70 transition-opacity'
                  icon='ion:reload-circle-outline'
                  size={16}
                />
              </span>
            </div>
          </div>
        </div>
        <div className='w-1/2 h-full  rounded-md flex flex-col gap-2'>
          <div className='w-full p-2 h-1/2 bg-white/5 rounded-md flex flex-col gap-2'>
            <div className='text-lg font-semibold '>避障信息</div>
            <div className='flex flex-1 gap-2'>
              <div className='w-1/3 grid grid-cols-2 gap-2'>
                <div className='flex flex-col justify-center col-span-2 leading-tight bg-white/5 p-2 rounded-md relative group'>
                  <span className='text-xs opacity-70'>当前避障方案</span>
                  <span className='text-lg font-semibold'>SLAM + 激光检测</span>
                  <IconifyIcon
                    icon='uil:edit'
                    size={16}
                    className='transition-opacity absolute top-2 right-2 opacity-70 group-hover:opacity-100'
                  />
                </div>
                <div className='flex flex-col justify-center leading-tight bg-white/5 p-2 rounded-md'>
                  <span className='text-xs opacity-70'>当前线路编号</span>
                  <span className='text-lg font-semibold'>L-023</span>
                </div>

                <div className='flex flex-col justify-center leading-tight bg-white/5 p-2 rounded-md'>
                  <span className='text-xs opacity-70'>避障状态</span>
                  <span className='text-lg font-semibold text-green-400'>
                    正常
                  </span>
                </div>
              </div>
              <div className='flex-1 bg-white/5 rounded-md p-2 flex flex-col gap-2'>
                <p className='text-xs opacity-70'>避障次数统计</p>
                <LineChart
                  data={[
                    { x: 15, y: 90, label: 'Jan', value: 12 },
                    { x: 45, y: 40, label: 'Feb', value: 40 },
                    { x: 75, y: 60, label: 'Mar', value: 28 },
                    { x: 105, y: 35, label: 'Apr', value: 50 },
                    { x: 135, y: 60, label: 'May', value: 30 },
                    { x: 165, y: 80, label: 'Jun', value: 18 },
                    { x: 195, y: 60, label: 'Jul', value: 22 },
                    { x: 225, y: 70, label: 'Aug', value: 25 },
                    { x: 255, y: 40, label: 'Sep', value: 38 },
                    { x: 285, y: 60, label: 'Oct', value: 27 },
                    { x: 315, y: 50, label: 'Nov', value: 32 },
                    { x: 345, y: 70, label: 'Dec', value: 20 },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className='w-full h-1/2 bg-white/5 rounded-md p-2 flex flex-col gap-2 justify-center'>
            <div className='flex flex-col justify-center leading-tight rounded-md gap-1'>
              <span className='text-xs opacity-70 flex items-center gap-1'>
                策略 <QuestionCircleOutlined />
              </span>
              <div className='grid grid-cols-2 xl:grid-cols-3 gap-1'>
                <span className='text-xs font-semibold'>直线保持策略</span>
                <span className='text-xs font-semibold'>叉臂下方防护策略</span>
                <span className='text-xs font-semibold'>放货空间检测策略</span>
                <span className='text-xs font-semibold'>取货牙尖保护策略</span>
              </div>
            </div>
            <div className='flex flex-col justify-center leading-tight rounded-md gap-1'>
              <span className='text-xs opacity-70 flex items-center gap-1'>
                传感器 <QuestionCircleOutlined />
              </span>
              <div className='grid grid-cols-2 xl:grid-cols-3 gap-1'>
                <span className='text-xs font-semibold'>定位雷达</span>
                <span className='text-xs font-semibold'>姿态识别雷达</span>
                <span className='text-xs font-semibold'>牙尖相机</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='h-1/2 bg-white/5 rounded-md'>
        <div className='grid grid-cols-4 gap-2 h-full p-2'>
          <div className='shadow-sm rounded-s-md'>
            <GrowPanel>
              <div className='h-full flex flex-col justify-center gap-2 p-4 items-center'>
                <div className='flex items-center justify-center w-24 h-24 rounded-full bg-white/5'>
                  <IconifyIcon
                    icon='icon-park-outline:nine-points-connected'
                    size={40}
                  />
                </div>
                <div className='text-center'>
                  <span className='text-lg font-semibold'>偏移表</span>
                </div>
              </div>
            </GrowPanel>
          </div>
          <div className='shadow-sm rounded-s-md'>
            <GrowPanel>
              <div
                className='h-full flex flex-col justify-center gap-2 p-4 items-center'
                onClick={() => navigate('/models?model=true')}
              >
                <div className='flex items-center justify-center w-24 h-24 rounded-full bg-white/5'>
                  <IconifyIcon icon='bi:robot' size={40} />
                </div>
                <div className='text-center'>
                  <span className='text-lg font-semibold'>建模</span>
                </div>
              </div>
            </GrowPanel>
          </div>
          <div className='shadow-sm rounded-s-md'>
            <GrowPanel>
              <div className='h-full flex flex-col justify-center gap-2 p-4 items-center'>
                <div className='flex items-center justify-center w-24 h-24 rounded-full bg-white/5'>
                  <IconifyIcon icon='mingcute:plugin-2-fill' size={40} />
                </div>
                <div className='text-center'>
                  <span className='text-lg font-semibold'>插件配置</span>
                </div>
              </div>
            </GrowPanel>
          </div>
          <div className='shadow-sm rounded-s-md'>
            <GrowPanel>
              <div className='h-full flex flex-col justify-center gap-2 p-4 items-center'>
                <div className='flex items-center justify-center w-24 h-24 rounded-full bg-white/5'>
                  <IconifyIcon icon='mingcute:location-3-fill' size={40} />
                </div>
                <div className='text-center'>
                  <span className='text-lg font-semibold'>导航</span>
                </div>
              </div>
            </GrowPanel>
          </div>
          <div className='shadow-sm rounded-s-md'>
            <GrowPanel>
              <div className='h-full flex flex-col justify-center gap-2 p-4 items-center'>
                <div className='flex items-center justify-center w-24 h-24 rounded-full bg-white/5'>
                  <IconifyIcon icon='carbon:document-configuration' size={40} />
                </div>
                <div className='text-center'>
                  <span className='text-lg font-semibold'>参数配置</span>
                </div>
              </div>
            </GrowPanel>
          </div>
          <div className='shadow-sm rounded-s-md'>
            <GrowPanel>
              <div className='h-full flex flex-col justify-center gap-2 p-4 items-center'>
                <div className='flex items-center justify-center w-24 h-24 rounded-full bg-white/5'>
                  <IconifyIcon icon='fluent:tap-single-20-filled' size={40} />
                </div>
                <div className='text-center'>
                  <span className='text-lg font-semibold'>单机任务</span>
                </div>
              </div>
            </GrowPanel>
          </div>
          <div className='shadow-sm rounded-s-md'>
            <GrowPanel>
              <div className='h-full flex flex-col justify-center gap-2 p-4 items-center'>
                <div className='flex items-center justify-center w-24 h-24 rounded-full bg-white/5'>
                  <IconifyIcon icon='fluent:cloud-sync-28-filled' size={40} />
                </div>
                <div className='text-center'>
                  <span className='text-lg font-semibold'>云服务</span>
                </div>
              </div>
            </GrowPanel>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ToolDashboard;
