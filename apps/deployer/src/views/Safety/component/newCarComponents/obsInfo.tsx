import Safety3D from '@/views/Safety/safety';
import { Drawer, theme } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import useDrawerClassName from '../../hooks/useDrawerClassName';
import { Line1px } from './drawerContent';
interface ObsInfoPanelProps {
  setOpenUpdateObsDrawer?: (open: boolean) => void;
  isDark?: boolean;
  show?: boolean;
}
const ObsInfoPanel = (props: ObsInfoPanelProps) => {
  const { t } = useTranslation();
  const classNames = useDrawerClassName();
  const [open, setOpen] = useState(false);
  const { show = true, isDark = false } = props;
  const { token } = theme.useToken();
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
    <>
      <motion.div
        initial={{ opacity: 0, x: '-100%' }}
        animate={show ? { opacity: 1, x: '0%' } : { opacity: 0, x: '-100%' }}
        transition={{ duration: 0.3 }}
        className='w-1/5 min-w-[240px] absolute z-10 p-2 flex flex-col gap-2 top-4 ml-4 shadow-md rounded-lg'
        style={{ backgroundColor: token.colorBgElevated }}
      >
        <p className='text-md font-bold relative pb-2'>
          避障信息
          <Line1px />
        </p>
        <div
          className={`flex flex-col relative w-full rounded-lg overflow-hidden shadow-sm p-2 ${
            isDark
              ? '!bg-[radial-gradient(circle,rgba(0,0,0,0.9)_0%,rgba(255,255,255,0.1)_0%)]'
              : 'bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]  '
          }`}
          // style={{ aspectRatio: '4/3' }}
        >
          <div>
            <p className='text-xs mb-2'>避障策略</p>
            <div className='grid grid-cols-2 gap-1 max-h-16 overflow-y-auto'>
              {strategyTpye.map((item) => {
                return (
                  <div className='flex items-center justify-between p-1 shadow-sm hover:bg-black/5 hover:shadow-lg hover:-translate-y-0.5 hover:font-bold transition-all duration-300'>
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
          className={`group h-40 flex flex-col rounded-b-lg items-center justify-center 
  backdrop-blur-[6px] hover:shadow-lg animation-all duration-300 ${
    isDark
      ? 'bg-[radial-gradient(circle,rgba(0,0,0,0.9)_0%,rgba(255,255,255,0.1)_10%)]'
      : 'bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(0,0,0,0.1)_70%)]'
  }`}
          onClick={() => setOpen(true)}
        >
          <SvgIcon name='points' size={128} className='group-hover:scale-110 animation-all duration-300' />
          <p className='text-xs opacity-60'>{t('common.safety.noDevice')}</p>
        </div>
      </motion.div>
      <Drawer
        closable
        destroyOnHidden
        title={<p>{t('common.safety.3dpoints')}</p>}
        placement='right'
        open={open}
        loading={false}
        classNames={{
          ...classNames,
          body: '!p-0',
        }}
        width={'calc(100% - 120px)'}
        onClose={() => setOpen(false)}
      >
        <Safety3D />
      </Drawer>
    </>
  );
};
export default ObsInfoPanel;
