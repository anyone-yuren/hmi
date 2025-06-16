import earth from '@/assets/img/earth.png';
import { useHybridStore } from '@/store/hyBridStore';
import { Typography } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';

const useStyles = createStyles(({ token, css }) => ({
  customSwitch: css`
    width: 100px;
    height: 36px;
    line-height: 36px;
    &.ant-switch-checked {
      .ant-switch-handle {
        inset-inline-start: calc(100% - 34px);
      }
    }

    .ant-switch-handle {
      width: 32px;
      height: 32px;
      top: 2px;
      left: 2px;
      border-radius: 16px;
      &::before {
        width: 32px;
        height: 32px;
        border-radius: 16px;
      }
    }

    .ant-switch-inner {
      font-size: 16px;
      line-height: 36px;
      padding-inline-end: 9px;
      padding-inline-start: 24px;
      .ant-switch-inner-unchecked {
        margin-top: -36px;
        font-size: 16px;
      }
      .ant-switch-inner-checked {
        font-size: 16px;
      }
    }

    .ant-switch {
      min-width: 80px;
      height: 36px;
      line-height: 36px;
      padding: 2px;
    }

    .ant-switch-checked {
      background-color: ${token.colorPrimary};
    }
  `,
}));

const VehicleControl = () => {
  const { styles } = useStyles();
  const theme = useTheme();
  const { agvPosition } = useHybridStore(
    useShallow((state) => {
      return {
        agvPosition: state.agvPosition,
      };
    }),
  );
  console.log('agvPosition', agvPosition);

  return (
    <motion.div
      className='relative h-full p-4 rounded-2xl bg-white/10  backdrop-blur-xl shadow-2xl overflow-hidden'
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* 内容 */}
      <div className='relative z-10 text-white flex flex-col h-full'>
        {/* <SvgIcon name='slam' className='absolute -right-10 -bottom-10 scale-125 opacity-5' size={160} /> */}
        <img src={earth} className='w-60 absolute -right-10 -bottom-10 scale-125 opacity-35' />
        <h2 className='text-lg font-bold mb-2'>控制状态</h2>
        <div className='flex-1 grid grid-cols-3'>
          <div className='flex-1 flex flex-col justify-center items-center'>
            <Typography.Title level={4}>
              {/* <Switch
                className={`${styles.customSwitch} shadow-lg shadow-teal-500/20 `}
                checkedChildren='多机'
                unCheckedChildren='单机'
                defaultChecked
              /> */}
              100kg
            </Typography.Title>
            <Typography.Text className='opacity-50'>货物重量</Typography.Text>
          </div>
          <div className='flex-1 flex flex-col justify-center items-center'>
            <Typography.Title
              style={{
                color: theme.colorPrimary,
              }}
              level={4}
            >
              手动
            </Typography.Title>
            <Typography.Text className='opacity-50'>控制模式</Typography.Text>
          </div>
          <div className='flex-1 flex flex-col justify-center items-center'>
            <Typography.Title level={4}>有</Typography.Title>
            <Typography.Text className='opacity-50'>是否有货</Typography.Text>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default VehicleControl;
