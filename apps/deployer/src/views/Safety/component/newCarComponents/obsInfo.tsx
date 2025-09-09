import { FormOutlined } from '@ant-design/icons';
import { SvgIcon } from 'ui';
import { Line1px } from './drawerContent';
interface ObsInfoPanelProps {
  setOpenUpdateObsDrawer?: (open: boolean) => void;
}
const ObsInfoPanel = (props: ObsInfoPanelProps) => {
  const { setOpenUpdateObsDrawer } = props;
  const strategyTpye = [
    { id: 1, name: '直线保持' },
    { id: 2, name: '叉臂下方区域保护叉臂下方区域保护' },
    { id: 3, name: '放货空间检测' },
    { id: 4, name: '取货防护' },
    { id: 5, name: '末端路线自适应最小避障距离' },
    { id: 6, name: '末端路线屏蔽叉尖避障功能' },
  ];
  return (
    <div className='w-1/5 min-w-[240px] absolute z-10 p-2 flex flex-col gap-2 top-4 left-4 bg-white shadow-md rounded-lg'>
      <p className='text-md font-bold relative pb-2'>
        避障信息
        <Line1px />
      </p>
      <div
        className='flex flex-col relative w-full rounded-lg overflow-hidden shadow-sm p-2 bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]'
        // style={{ aspectRatio: '4/3' }}
      >
        <FormOutlined
          className='absolute top-2 right-2 cursor-pointer opacity-60 hover:opacity-100 hover:scale-125 transition-all'
          onClick={() => setOpenUpdateObsDrawer && setOpenUpdateObsDrawer(true)}
        />
        <p>当前避障方案</p>
        <div className='flex-1 flex items-center justify-center'>
          <span className='text-4xl'>1</span>
        </div>
        <div>
          <p className='text-xs mb-2'>避障策略</p>
          <div className='grid grid-cols-2 gap-1 max-h-14 overflow-y-auto'>
            {strategyTpye.map((item) => {
              return (
                <div className='flex items-center justify-between p-1 shadow-sm hover:bg-black/5 hover:shadow-lg hover:translate-y-0.5 hover:font-bold transition-all duration-300'>
                  <p className='flex-1 truncate text-xs text-gray-500' title={item.name}>
                    {item.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='shadow-sm rounded-md flex items-center justify-between p-2  hover:bg-black/5 hover:shadow-lg hover:-translate-y-0.5 hover:font-bold  animation-all duration-300 '>
          <p className='text-md'>车辆状态</p>
          11
        </div>
        <div className='shadow-sm rounded-md flex items-center justify-between p-2  hover:bg-black/5 hover:shadow-lg hover:-translate-y-0.5 hover:font-bold  animation-all duration-300 '>
          <p className='text-md'>避障类型</p>
          11
        </div>
        <div className='shadow-sm rounded-md flex items-center justify-between p-2  hover:bg-black/5 hover:shadow-lg hover:-translate-y-0.5 hover:font-bold  animation-all duration-300 '>
          <p className='text-md'>货物状态</p>
          222
        </div>
      </div>
      <p className='text-md font-bold relative pb-2'>
        点云查看
        <Line1px />
      </p>
      <div
        className='group h-40 flex flex-col rounded-b-lg items-center justify-center bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]
  backdrop-blur-[6px] hover:shadow-lg animation-all duration-300'
      >
        <SvgIcon name='points' size={128} className='group-hover:scale-110 animation-all duration-300' />
        <p className='text-xs opacity-60'>暂无使能传感器</p>
      </div>
    </div>
  );
};
export default ObsInfoPanel;
