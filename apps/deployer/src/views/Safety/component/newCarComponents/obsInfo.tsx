import PanelLoading from '@/components/PanelLoading';
import Safety3D from '@/views/Safety/safety';
import { useObsError } from '@gbeata/app-global';
import { Drawer, Tag, theme } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useStrategyListName } from '../../hooks/useActiveDevice';
import useDrawerClassName from '../../hooks/useDrawerClassName';
import { useSafetyStore } from '../../store/safety.store';
import { Line1px } from './drawerContent';
interface ObsInfoPanelProps {
  setOpenUpdateObsDrawer?: (open: boolean) => void;
  isDark?: boolean;
  show?: boolean;
  currentObsData: any;
  strategyList: any;
  loading: boolean;
  client?: boolean;
}
const ObsInfoPanel = (props: ObsInfoPanelProps) => {
  const { t } = useTranslation();
  const classNames = useDrawerClassName();
  const [open, setOpen] = useState(false);
  const { show = true, isDark = false, currentObsData, strategyList, loading, client } = props;
  const { token } = theme.useToken();
  const { motionStatus, obsInfo, goodsInfo } = useSafetyStore(
    useShallow((store) => ({
      motionStatus: store.motionStatus,
      obsInfo: store.obsInfo,
      goodsInfo: store.goodsInfo,
    })),
  );
  const strategyListName = useStrategyListName();
  const { getObsMsg } = useObsError();
  if (loading) {
    return (
      <>
        <PanelLoading />
      </>
    );
  }

  if (!currentObsData) {
    return null;
  }

  const { strategy_list = [] } = currentObsData;

  const strategyNames = Object.keys(strategyList).filter((item) => {
    if (strategy_list.includes(strategyList[item].id)) {
      return item;
    }
  });

  const iMotionStatus = [
    t('common.safety.init'),
    t('common.safety.stop'),
    t('common.safety.forward'),
    t('common.safety.back'),
    t('common.safety.turn'),
    t('common.safety.spin'),
    t('common.safety.error'),
  ];
  const strategyTpye = strategyNames.map((item) => {
    return {
      name: strategyListName[item],
    };
  });
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
              {strategyTpye.map((item, index) => {
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
            {iMotionStatus[motionStatus]}
          </div>
          <div className='shadow-sm rounded-md flex items-center justify-between p-2  hover:bg-black/5 hover:shadow-lg hover:-translate-y-0.5 hover:font-bold  animation-all duration-300 '>
            <p className='text-md'>避障类型</p>
            {getObsMsg(obsInfo.type)}
          </div>
          {obsInfo?.sensor_description?.length ? (
            <div className='shadow-sm rounded-md flex items-center justify-between p-2  hover:bg-black/5 hover:shadow-lg hover:-translate-y-0.5 hover:font-bold  animation-all duration-300 '>
              <p className='min-w-[40%]'>避障传感器</p>
              <p className='break-words flex items-center gap-2 flex-col'>
                {obsInfo?.sensor_description?.map((item) => <span className='bg-black/5 px-1'>{item}</span>) || '-'}
              </p>
            </div>
          ) : null}
          <div className='shadow-sm rounded-md flex items-center justify-between p-2  hover:bg-black/5 hover:shadow-lg hover:-translate-y-0.5 hover:font-bold  animation-all duration-300 '>
            <p className='text-md'>货物状态</p>
            {goodsInfo?.good_status ? (
              <Tag className='!m-0' color='green'>
                有货
              </Tag>
            ) : (
              <Tag className='!m-0'>无货</Tag>
            )}
          </div>
        </div>
        {!client ? (
          <>
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
              <p className='text-xs opacity-60'>
                {currentObsData?.pc_sensor_list?.length ? '查看点云' : t('common.safety.noDevice')}
              </p>
            </div>
          </>
        ) : null}
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
