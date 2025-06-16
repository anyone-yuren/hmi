import { Button, Typography } from 'antd';
import { useResponsive } from 'antd-style';
import { useNavigate } from 'react-router-dom';
import { SvgIcon } from 'ui';
import BarBattery from '../battery';

const GlobalHeader = () => {
  const navigate = useNavigate();
  const responsive = useResponsive();
  return (
    <div className='flex items-center justify-between px-4 py-2 text-white '>
      <Typography.Title className='!m-0' level={4}>
        <span className='text-primary'>HMI</span>
      </Typography.Title>
      <div className='flex flex-row gap-8 items-center justify-center'>
        <div
          onClick={() => {
            navigate('/');
          }}
          className={'h-full col-span-1 justify-center flex flex-col items-center '}
        >
          <Button
            classNames={{
              icon: 'flex items-center justify-center',
            }}
            className='border-none'
            shape='circle'
            icon={<SvgIcon name='chache' size={responsive.xs ? 12 : 24} />}
          />
        </div>
        <div
          onClick={() => {
            navigate('/maintenance');
          }}
          className={'h-full col-span-1 justify-center flex  flex-col items-center '}
        >
          <Button
            classNames={{
              icon: 'flex items-center justify-center',
            }}
            className='border-none'
            shape='circle'
            icon={<SvgIcon name='weibao' size={responsive.xs ? 12 : 24} />}
          />
        </div>
        <div
          onClick={() => {
            navigate('/setting');
          }}
          className={'h-full col-span-1 justify-center flex flex-col items-center  '}
        >
          <Button
            classNames={{
              icon: 'flex items-center justify-center',
            }}
            className='border-none'
            shape='circle'
            icon={<SvgIcon name='shezhi' size={responsive.xs ? 12 : 24} />}
          />
        </div>
        <div>
          <BarBattery level={40} height={24} />
        </div>
      </div>
    </div>
  );
};
export default GlobalHeader;
