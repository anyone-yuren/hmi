import { Button, ConfigProvider, Modal } from 'antd';
import { useResponsive, useTheme } from 'antd-style';
import { useNavigate } from 'react-router-dom';
import { SvgIcon } from 'ui';
import BarBattery from '../battery';
import ChargingAnimation from '../charging';
import WsVehicleContainer from '../wsVehicleContainer';
import { config_agv_info } from './service';

import { AuthComponent, GlobalNotification, LoginDialog, triggerLoginModal } from '@gbeata/app-global';
import { useGlobalStore, useVehicleStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import Selectlangulage from './components/Selectlangulage';
import Signal from './components/signal';

// 去除table hover央视
const useStyles = createStyles(({ css }) => ({
  mainHoverButton: css`
    &:hover {
      background: linear-gradient(to bottom, #00e7e7, #008787) !important;
      border-color: inherit !important;
      color: inherit !important;
      transform: none !important;
      box-shadow: none !important;
      transition: none !important;
    }
  `,
  taskHoverButton: css`
    &:hover {
      background: linear-gradient(to bottom, #223d62, #3b587e) !important;
      border-color: inherit !important;
      color: inherit !important;
      transform: none !important;
      box-shadow: none !important;
      transition: none !important;
    }
  `,
  dot: css`
    .ant-badge-dot {
      width: 10px !important;
      height: 10px !important;
    }
  `,
}));

const GlobalHeader = () => {
  const navigate = useNavigate();
  const responsive = useResponsive();
  const [modal, contextHolder] = Modal.useModal();
  const { styles } = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { powerStatus, setPowerStatus, systemDateTime, taskInfo } = useVehicleStore(
    useShallow((state) => {
      return {
        powerStatus: state.powerStatus,
        setPowerStatus: state.setPowerStatus,
        systemDateTime: state.systemDateTime,
        // rcsIsOnline: state.rcsIsOnline,
        taskInfo: state.taskInfo,
      };
    }),
  );
  const {
    token,
    setToken,
    setAvgType,
    showChargingDialog,
    setShowChargingDialog,
    setCloseChargingTime,
    closeChargingTime,
  } = useGlobalStore(
    useShallow((state) => ({
      token: state.token,
      setToken: state.setToken,
      setAvgType: state.setAvgType,
      showChargingDialog: state.showChargingDialog,
      setShowChargingDialog: state.setShowChargingDialog,
      setCloseChargingTime: state.setCloseChargingTime,
      closeChargingTime: state.closeChargingTime,
    })),
  );

  const { data } = useRequest(config_agv_info);

  useEffect(() => {
    if (data) {
      data?.agv_type && setAvgType(data?.agv_type);
    }
  }, [data]);

  useEffect(() => {
    // 准备充电的时候就跳到充电页面
    if (taskInfo?.operate_identification === 3 || powerStatus.charge_status === 2) {
      navigate('/charging');
    }
  }, [taskInfo?.operate_identification, powerStatus.charge_status]);

  // 设置十分钟定时器
  useEffect(() => {
    if ([3].includes(powerStatus.charge_status) && !closeChargingTime) {
      setShowChargingDialog(true);
      // const timer = setTimeout(
      //   () => {
      //     setShowChargingDialog(true);
      //   },
      //   10 * 60 * 1000,
      // );
      // return () => clearTimeout(timer);
    }
  }, [powerStatus.charge_status, closeChargingTime]);

  useEffect(() => {
    if (closeChargingTime && systemDateTime) {
      const diff = Number(systemDateTime) - closeChargingTime;
      diff > 10 * 60 * 1000 && setCloseChargingTime(0);
    }
    // 每次冲完了就给他状态重置了
    if (powerStatus.charge_status === 1 && closeChargingTime != 0) {
      setCloseChargingTime(0);
    }
  }, [systemDateTime, closeChargingTime, powerStatus]);

  return (
    <div className='flex flex-col h-full items-center justify-between px-4 py-2 text-white '>
      {contextHolder}
      {/* <Badge
        dot
        className={styles.dot}
        color={rcsIsOnline ? theme.colorPrimary : theme.colorError}
        status={rcsIsOnline ? 'processing' : 'default'}
        offset={[0, 10]}
      > */}
      <div
        className='w-full flex items-center justify-center'
        onClick={() => {
          if (!token) {
            triggerLoginModal();
          } else {
            modal.confirm({
              title: t('common.logoutTip'),
              onOk: () => {
                setToken('');
                toast.success(t('common.actionSuccess'));
                navigate('/');
              },
            });
          }
        }}
      >
        <div
          className='w-12 h-12 rounded-full flex items-center justify-center mt-2 mb-4'
          style={{
            backgroundColor: token ? '#00D1D1' : '#445260',
          }}
        >
          {/* {token ? <SvgIcon name='user' size={28} /> : <SvgIcon name='unknowUser' size={28} />} */}
          {token ? (
            <span className='font-bold text-4xl'>{token.charAt(0)}</span>
          ) : (
            <SvgIcon name='unknowUser' size={28} />
          )}
        </div>
      </div>
      {/* </Badge> */}
      <p className='text-md text-center font-bold mb-2'>
        {systemDateTime ? dayjs(systemDateTime).format('YYYY/MM/DD HH:mm:ss') : '-'}
      </p>
      <div className='flex flex-col items-center gap-2'>
        <BarBattery level={40} height={24} />
        <Signal canLinkWifi={data?.support_wireless_configuration} />
      </div>
      <Selectlangulage />
      <ConfigProvider
        theme={{
          components: {
            Button: {
              defaultHoverBg: 'transparent', // 设置透明背景
              defaultHoverBorderColor: 'transparent', // 去除 hover 边框颜色
              defaultHoverColor: 'inherit', // 文字颜色保持不变
            },
          },
        }}
      >
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
              className={`${styles.mainHoverButton} border-none !w-[82px] h-[82px] flex items-center justify-center !rounded-2xl text-white bg-gradient-to-b from-[#00E7E7] to-[#008787]`}
              shape='circle'
              icon={<SvgIcon name='chache' size={responsive.xs ? 42 : 54} />}
            ></Button>
          </div>
          <AuthComponent authKey={['admin']}>
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
                className={`${styles.taskHoverButton} border-none !w-[82px] h-[82px] flex items-center justify-center !rounded-2xl text-white bg-gradient-to-b from-[#223d62] to-[#3b587e]`}
                shape='circle'
                icon={<SvgIcon name='task' size={responsive.xs ? 42 : 54} />}
              ></Button>
            </div>
          </AuthComponent>
          <AuthComponent authKey={['admin', 'customer']}>
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
              ></Button>
            </div>
          </AuthComponent>
        </div>
        <div>
          <Button
            className='border-none !w-[82px] h-[62px] !bg-transparent flex items-center justify-center !rounded-2xl text-white'
            classNames={{
              icon: 'flex items-center justify-center h-full', // 覆盖 ant-btn-icon 的样式
            }}
            icon={<SvgIcon name='bar' size={responsive.xs ? 42 : 54} />}
            onClick={() => navigate('/slider')}
          ></Button>
        </div>
      </ConfigProvider>
      {[3].includes(powerStatus.charge_status) && showChargingDialog && (
        <ChargingAnimation
          onClick={() => {
            setShowChargingDialog(false);
            // setCloseChargingTime(new Date().getTime());
            setCloseChargingTime(Number(systemDateTime) || new Date().getTime());
            // setPowerStatus({
            //   ...powerStatus,
            //   charge_status: 0,
            //   // power: 0,
            // });
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
