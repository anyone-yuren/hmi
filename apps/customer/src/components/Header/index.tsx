import { Button, Modal } from 'antd';
import { useResponsive } from 'antd-style';
import { useNavigate } from 'react-router-dom';
import { SvgIcon } from 'ui';
import BarBattery from '../battery';
import ChargingAnimation from '../charging';
import WsVehicleContainer from '../wsVehicleContainer';

import { GlobalNotification, LoginDialog, triggerLoginModal } from '@gbeata/app-global';
import { useGlobalStore, useVehicleStore } from '@gbeata/store';
import { createStyles } from 'antd-style';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import Selectlangulage from './components/Selectlangulage';

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const responsive = useResponsive();
  const [modal, contextHolder] = Modal.useModal();
  const { styles } = useStyles();
  const { powerStatus } = useVehicleStore(
    useShallow((state) => {
      return {
        powerStatus: state.powerStatus,
      };
    }),
  );
  const { token, setToken } = useGlobalStore(
    useShallow((state) => ({
      token: state.token,
      setToken: state.setToken,
    })),
  );

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
              title: t('common.logoutTip'),
              onOk: () => {
                setToken('');
                toast.success(t('common.actionSuccess'));
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
      <div>
        <BarBattery level={40} height={24} />
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
            className={`${styles.customerButton} border-none !w-[82px] h-[82px] flex items-center justify-center !rounded-2xl text-white bg-gradient-to-b from-[#00E7E7] to-[#008787]`}
            shape='circle'
            icon={<SvgIcon name='chache' size={responsive.xs ? 42 : 54} />}
          />
        </div>
        <div
          onClick={() => {
            navigate('/maintenance');
          }}
          className={'justify-center flex  flex-col items-center '}
        >
          <Button
            classNames={{
              icon: 'flex items-center justify-center',
            }}
            className='border-none !w-[82px] h-[82px] flex items-center justify-center !rounded-2xl text-white bg-gradient-to-b from-yellow-500 to-yellow-400'
            shape='circle'
            icon={<SvgIcon name='weibao' size={responsive.xs ? 42 : 54} />}
          />
        </div>
        <div
          onClick={() => {
            navigate('/setting');
          }}
          className={' justify-center flex flex-col items-center  '}
        >
          <Button
            classNames={{
              icon: 'flex items-center justify-center',
            }}
            className='border-none !w-[82px] h-[82px] flex items-center justify-center !rounded-2xl text-white bg-gradient-to-b from-[#049c66] to-[#05de6b]'
            shape='circle'
            icon={<SvgIcon name='shezhi' size={responsive.xs ? 42 : 54} />}
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
      {[2, 3].includes(powerStatus.charge_status) && <ChargingAnimation />}
      <WsVehicleContainer />
      <GlobalNotification />
      <LoginDialog />
    </div>
  );
};
export default GlobalHeader;
