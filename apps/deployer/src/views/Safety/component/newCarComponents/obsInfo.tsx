import { motion } from 'framer-motion';
import { SvgIcon } from 'ui';
import { Line1px } from './drawerContent';

interface ObsInfoPanelProps {
  setOpenUpdateObsDrawer?: (open: boolean) => void;
  show?: boolean;
  animateEnd?: () => void;
}

const ObsInfoPanel = (props: ObsInfoPanelProps) => {
  const { setOpenUpdateObsDrawer, show, animateEnd } = props;
  const strategyTpye = [
    { id: 1, name: '直线保持' },
    { id: 2, name: '叉臂下方区域保护叉臂下方区域保护' },
    { id: 3, name: '放货空间检测' },
    { id: 4, name: '取货防护' },
    { id: 5, name: '末端路线自适应最小避障距离' },
    { id: 6, name: '末端路线屏蔽叉尖避障功能' },
  ];

  return (
    <motion.div
      key='obs-panel'
      initial={{ opacity: 0, width: 0 }}
      animate={show ? { opacity: 1, width: 100 } : { opacity: 0, width: 0 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={() => {
        animateEnd && animateEnd();
      }}
    >
      <div className='flex h-full flex-col gap-2 shadow-md overflow-hidden p-2 relative z-30'>
        <p className='text-md text-center font-bold relative pb-2'>
          避障信息
          <Line1px />
        </p>

        <div className='flex flex-col gap-2'>
          <div className='shadow-sm rounded-md flex flex-col justify-between items-center p-2 hover:bg-black/5 hover:shadow-lg hover:-translate-y-0.5 hover:font-bold transition-all duration-300'>
            <p className='text-md text-nowrap'>车辆状态</p>
            11
          </div>
          <div className='shadow-sm rounded-md flex flex-col justify-between items-center p-2 hover:bg-black/5 hover:shadow-lg hover:-translate-y-0.5 hover:font-bold transition-all duration-300'>
            <p className='text-md text-nowrap'>避障类型</p>
            11
          </div>
          <div className='shadow-sm rounded-md flex flex-col justify-between items-center p-2 hover:bg-black/5 hover:shadow-lg hover:-translate-y-0.5 hover:font-bold transition-all duration-300'>
            <p className='text-md text-nowrap'>货物状态</p>
            222
          </div>
        </div>

        <p className='text-md font-bold text-center relative pb-2'>
          点云查看
          <Line1px />
        </p>

        <div className='group p-2 flex flex-col rounded-b-lg items-center justify-center shadow-md hover:shadow-lg transition-all duration-300'>
          <SvgIcon name='points' size={68} className='group-hover:scale-110 transition-all duration-300' />
          <p className='text-xs opacity-60'>暂无使能传感器</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ObsInfoPanel;
