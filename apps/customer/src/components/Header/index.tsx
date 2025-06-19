import { Button, Typography } from 'antd';
import { useResponsive } from 'antd-style';
import { useNavigate } from 'react-router-dom';
import { SvgIcon } from 'ui';
import BarBattery from '../battery';
import ChargingAnimation from '../charging';
import WsVehicleContainer from '../wsVehicleContainer';

const GlobalHeader = () => {
  const navigate = useNavigate();
  const responsive = useResponsive();
  return (
    <div className='flex flex-col h-full items-center justify-between px-4 py-2 text-white '>
      <Typography.Title className='' level={2}>
        <span className='text-white'>HMI</span>
      </Typography.Title>
      <div>
        <BarBattery level={40} height={24} />
      </div>
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
            className='border-none !w-[82px] h-[82px] flex items-center justify-center !rounded-2xl text-white bg-gradient-to-b from-[#00E7E7] to-[#008787]'
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
      {false && <ChargingAnimation />}
      <WsVehicleContainer />
    </div>
  );
};
export default GlobalHeader;
