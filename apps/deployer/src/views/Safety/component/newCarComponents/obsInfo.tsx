import { FormOutlined } from '@ant-design/icons';
import { SvgIcon } from 'ui';
import { Line1px } from './drawerContent';
interface ObsInfoPanelProps {
  setOpenUpdateObsDrawer?: (open: boolean) => void;
}
const ObsInfoPanel = (props: ObsInfoPanelProps) => {
  const { setOpenUpdateObsDrawer } = props;
  return (
    <div className='w-1/5 min-w-[240px] absolute z-10 p-2 flex flex-col gap-2 top-4 left-4 bg-white shadow-md rounded-lg'>
      <p className='text-md font-bold relative pb-2'>
        避障信息
        <Line1px />
      </p>
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
        <div className='shadow-sm rounded-md flex items-center justify-between p-2  hover:bg-black/5 hover:shadow-lg hover:-translate-y-0.5 hover:font-bold  animation-all duration-300 '>
          <p className='text-md'>当前避障方案</p>
          <div className='flex items-center gap-2'>
            1
            <FormOutlined
              className='cursor-pointer opacity-60 hover:opacity-100 hover:scale-125 transition-all'
              onClick={() => setOpenUpdateObsDrawer && setOpenUpdateObsDrawer(true)}
            />
          </div>
        </div>
      </div>
      <p className='text-md font-bold relative pb-2'>
        点云查看
        <Line1px />
      </p>
      <div
        className='h-40 flex flex-col rounded-b-lg items-center justify-center bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]
  backdrop-blur-[6px] hover:shadow-lg animation-all duration-300'
      >
        <SvgIcon name='points' size={128} />
        <p className='text-xs opacity-60'>暂无使能传感器</p>
      </div>
    </div>
  );
};
export default ObsInfoPanel;
