import diqiu from '@/assets/img/diqiu.png';
import { useHybridStore } from '@/store/hyBridStore';
import { Divider, Space, Typography } from 'antd';
import { useTheme } from 'antd-style';
import { motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';

const VehicleInfo = () => {
  const { agvPosition } = useHybridStore(
    useShallow((state) => {
      return {
        agvPosition: state.agvPosition,
      };
    }),
  );
  console.log('agvPosition', agvPosition);
  const theme = useTheme();

  return (
    <motion.div
      className='relative h-full p-4 rounded-2xl bg-white/10  backdrop-blur-xl shadow-2xl overflow-hidden'
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* 内容 */}
      <div className='relative z-10 text-white flex flex-col h-full'>
        {/* <SvgIcon name='slam' className='absolute -right-10 -bottom-10 scale-125 opacity-5' size={160} /> */}
        <img src={diqiu} className='w-60 absolute -right-10 -bottom-10 scale-125 opacity-15' />
        <h2 className='text-lg font-bold mb-2'>车辆信息</h2>
        <div className='flex-1 grid grid-cols-3 gap-2'>
          <div className='flex-1 col-span-3 flex flex-col'>
            <div className='text-[60px] md:text-[40px] flex items-start'>
              <span>No. 233</span>
              <span
                style={{
                  background: theme.colorPrimary,
                  borderRadius: 4,
                  padding: '2px 4px',
                  color: theme.colorText,
                  fontSize: '12px',
                }}
              >
                单机
              </span>
            </div>
            <Space className='flex-1' split={<Divider type='vertical' />}>
              <Typography.Text>x: {Math.round((agvPosition.x / 1000) * 100) / 100}</Typography.Text>
              <Typography.Text>y: {Math.round((agvPosition.y / 1000) * 100) / 100}</Typography.Text>
              <Typography.Text>theta: {Math.round((agvPosition?.angel * 180) / Math.PI) || 0}°</Typography.Text>
            </Space>
            <div className='flex-1 col-span-1'>
              <Typography.Title level={5} className='!m-0'>
                IP: 129.12.12.123
              </Typography.Title>
            </div>
          </div>
          <div className='flex-1'></div>
        </div>
      </div>
    </motion.div>
  );
};
export default VehicleInfo;
