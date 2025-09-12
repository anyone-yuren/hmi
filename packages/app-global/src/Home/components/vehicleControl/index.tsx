import { CheckCircle, NotInterested } from '@mui/icons-material';

import { Typography } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import earth from '../../../assets/img/earth.png';
import { useHomeStore } from '../../store';

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
  const { t } = useTranslation();
  const { styles } = useStyles();
  const theme = useTheme();
  const { robotIsensorStatus, robotGoodsStatus } = useHomeStore(
    useShallow((state) => {
      return {
        robotIsensorStatus: state.robotIsensorStatus,
        robotGoodsStatus: state.robotGoodsStatus,
      };
    }),
  );

  // 根据auto_manual_status值返回不同图标值
  const mamualStatusIcon = useMemo(() => {
    switch (robotIsensorStatus.auto_manual_status) {
      case 1:
        return 'handle';
      case 2:
        return 'auto';
      case 3:
        return 'semiAuto';
      default:
        return '';
    }
  }, [robotIsensorStatus.auto_manual_status]);

  return (
    <motion.div
      className='relative h-full p-4 rounded-2xl bg-white/10  backdrop-blur-xl shadow-2xl overflow-hidden'
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* 内容 */}
      <div className='relative z-10 text-white flex flex-col h-full'>
        {/* <SvgIcon name='slam' className='absolute -right-10 -bottom-10 scale-125 opacity-5' size={160} /> */}
        <img src={earth} className='w-60 absolute -right-10 top-0 scale-125 opacity-35' />

        <div className='w-full'>
          <h2 className='text-lg font-bold mb-1'>{t('common.home.vehicleControl')}</h2>
          <motion.div
            className='!w-full h-px'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div
              className='w-full h-full'
              style={{
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)',
              }}
            />
          </motion.div>
        </div>
        <div className='flex-1 grid grid-cols-3'>
          <div className='flex-1 flex flex-col justify-center items-center'>
            <Typography.Title level={4}>
              {/* <Switch
                className={`${styles.customSwitch} shadow-lg shadow-teal-500/20 `}
                checkedChildren='多机'
                unCheckedChildren='单机'
                defaultChecked
              /> */}
              {robotGoodsStatus.number} KG
            </Typography.Title>
            <Typography.Text className='opacity-50'>{t('common.home.vehicleControlWeight')}</Typography.Text>
          </div>
          <div className='flex-1 flex flex-col justify-center items-center'>
            <Typography.Title
              style={{
                color: theme.colorPrimary,
              }}
              level={4}
            >
              {mamualStatusIcon ? <SvgIcon name={mamualStatusIcon} size={24} /> : '-'}
            </Typography.Title>
            <Typography.Text className='opacity-50'>{t('common.home.vehicleControlMode')}</Typography.Text>
          </div>
          <div className='flex-1 flex flex-col justify-center items-center'>
            <Typography.Title level={4}>
              {robotGoodsStatus.number ? (
                <>
                  <CheckCircle color='success' />
                </>
              ) : (
                <>
                  <NotInterested color='info' />
                </>
              )}
            </Typography.Title>
            <Typography.Text className='opacity-50'>{t('common.home.vehicleControlStatus')}</Typography.Text>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default VehicleControl;
