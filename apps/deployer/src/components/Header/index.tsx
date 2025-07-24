import { Button, Typography } from 'antd';
import { useResponsive } from 'antd-style';
import { useNavigate } from 'react-router-dom';
import { SvgIcon } from 'ui';
import BarBattery from '../battery';
import ChargingAnimation from '../charging';
import WsVehicleContainer from '../wsVehicleContainer';

import { useVehicleStore } from '@/store/vehicleStore';
import { GlobalNotification } from '@gbeata/app-global';
import { createStyles } from 'antd-style';
import { useShallow } from 'zustand/react/shallow';
import Selectlangulage from './components/Selectlangulage';
// 去除table hover央视
const useStyles = createStyles(({ css, token }) => {
  return {
    customerButton: css`
      &:hover {
      }
    `,
  };
});

const GlobalHeader = () => {
  const navigate = useNavigate();
  const responsive = useResponsive();
  const { styles } = useStyles();
  const { powerStatus } = useVehicleStore(
    useShallow((state) => {
      return {
        powerStatus: state.powerStatus,
      };
    }),
  );
  return (
    <div className='flex flex-col h-full items-center justify-between px-4 py-2 text-white '>
      <Typography.Title className='' level={2}>
        <span className='text-white'>HMI</span>
      </Typography.Title>
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
            navigate('/task');
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
      {[1, 2, 3].includes(powerStatus.charge_status) && <ChargingAnimation />}
      <WsVehicleContainer />
      <GlobalNotification />
    </div>
  );
};
export default GlobalHeader;
