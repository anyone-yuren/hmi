import { Button, Modal } from 'antd';
import { useResponsive } from 'antd-style';
import { useNavigate } from 'react-router-dom';
import { SvgIcon } from 'ui';
import BarBattery from '../battery';
import ChargingAnimation from '../charging';
import WsVehicleContainer from '../wsVehicleContainer';
import { config_agv_info } from './service';

import { GlobalNotification, LoginDialog, triggerLoginModal } from '@gbeata/app-global';
import { useGlobalStore, useVehicleStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { createStyles } from 'antd-style';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Selectlangulage from './components/Selectlangulage';
import Signal from './components/signal';

// 去除table hover央视
const useStyles = createStyles(({ css }) => {
  return {
    noHoverButton: css`
      // 使用属性选择器增加优先级
      &[class*='ant-btn']:hover {
        background: inherit !important;
        border-color: inherit !important;
        color: inherit !important;
        transform: none !important;
        box-shadow: none !important;
        transition: none !important;
      }

      // 精确匹配你提供的选择器
      &:where(.ant-btn-variant-outlined):not(:disabled):not(.ant-btn-disabled):hover,
      &:where(.ant-btn-variant-dashed):not(:disabled):not(.ant-btn-disabled):hover {
        background: inherit !important;
        border-color: inherit !important;
        color: inherit !important;
        transform: none !important;
        box-shadow: none !important;
        transition: none !important;
      }
    `,
  };
});

const GlobalHeader = () => {
  const navigate = useNavigate();
  const responsive = useResponsive();
  const [modal, contextHolder] = Modal.useModal();
  const { styles } = useStyles();
  const { powerStatus, setPowerStatus } = useVehicleStore(
    useShallow((state) => {
      return {
        powerStatus: state.powerStatus,
        setPowerStatus: state.setPowerStatus,
      };
    }),
  );
  const { token, setToken, setAvgType, showChargingDialog, setShowChargingDialog } = useGlobalStore(
    useShallow((state) => ({
      token: state.token,
      setToken: state.setToken,
      setAvgType: state.setAvgType,
      showChargingDialog: state.showChargingDialog,
      setShowChargingDialog: state.setShowChargingDialog,
    })),
  );

  const { data } = useRequest(config_agv_info);

  useEffect(() => {
    if (data) {
      data?.agv_type && setAvgType(data?.agv_type);
    }
  }, [data]);

  // 设置十分钟定时器
  useEffect(() => {
    if (powerStatus.charge_status === 3) {
      setShowChargingDialog(true);
      const timer = setTimeout(
        () => {
          setShowChargingDialog(true);
        },
        10 * 60 * 1000,
      );
      return () => clearTimeout(timer);
    }
  }, [powerStatus.charge_status]);

  return (
    <div className='flex flex-col h-full items-center justify-between px-4 py-2 text-white '>
      {contextHolder}
      <div
        className='w-12 h-12 rounded-full flex items-center justify-center mt-2 mb-4'
        style={{
          backgroundColor: token ? '#00D1D1' : '#445260',
        }}
        onClick={() => {
          if (!token) {
            triggerLoginModal();
          } else {
            modal.confirm({
              title: '确认退出登录吗？',
              onOk: () => {
                setToken('');
              },
            });
          }
        }}
      >
        {/* {token ? <SvgIcon name='user' size={28} /> : <SvgIcon name='unknowUser' size={28} />} */}
        {token ? (
          <span className='font-bold text-4xl'>{token.charAt(0)}</span>
        ) : (
          <SvgIcon name='unknowUser' size={28} />
        )}
      </div>
      <div className='flex flex-col items-center gap-2'>
        <BarBattery level={40} height={24} />
        <Signal />
      </div>
      <Selectlangulage />
      <div className='flex flex-1 flex-col gap-8 items-center justify-center'>
        <div
          onClick={() => {
            navigate('/');
          }}
          className={'justify-center flex flex-col items-center '}
        >
          <Button
            classNames={{
              icon: 'flex items-center justify-center',
            }}
            className={`${styles.noHoverButton} border-none !w-[82px] h-[82px] flex items-center justify-center !rounded-2xl text-white bg-gradient-to-b from-[#00E7E7] to-[#008787]`}
            shape='circle'
            icon={<SvgIcon name='chache' size={responsive.xs ? 42 : 54} />}
          />
        </div>
        <div
          onClick={() => {
            navigate('/singleTask');
          }}
          className={'justify-center flex  flex-col items-center '}
        >
          <Button
            classNames={{
              icon: 'flex items-center justify-center',
            }}
            className='border-none !w-[82px] h-[82px] flex items-center justify-center !rounded-2xl text-white bg-gradient-to-b from-[#223d62] to-[#3b587e]'
            shape='circle'
            icon={<SvgIcon name='task' size={responsive.xs ? 42 : 54} />}
          />
        </div>
        <div
          onClick={() => {
            navigate('/hybrid');
          }}
          className={' justify-center flex flex-col items-center  '}
        >
          <Button
            classNames={{
              icon: 'flex items-center justify-center',
            }}
            className='border-none !w-[82px] h-[82px] flex items-center justify-center !rounded-2xl text-white'
            shape='circle'
            icon={<SvgIcon name='hybrid' size={responsive.xs ? 80 : 80} />}
          />
        </div>
      </div>
      <div>
        <Button
          className='border-none !w-[82px] h-[62px] !bg-transparent flex items-center justify-center !rounded-2xl text-white'
          icon={<SvgIcon name='bar' size={responsive.xs ? 42 : 54} />}
          onClick={() => navigate('/slider')}
        ></Button>
      </div>
      {[2, 3].includes(powerStatus.charge_status) && showChargingDialog && (
        <ChargingAnimation
          onClick={() => {
            setShowChargingDialog(false);
            setPowerStatus({
              charge_status: 0,
              power: 0,
            });
          }}
        />
      )}
      <WsVehicleContainer />
      <GlobalNotification />
      <LoginDialog />
    </div>
  );
};
export default GlobalHeader;
