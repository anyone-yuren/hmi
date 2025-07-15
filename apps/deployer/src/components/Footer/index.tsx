import { theme } from 'antd';
import { useResponsive } from 'antd-style';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { SvgIcon } from 'ui';
const GlobalFooter = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname;
  // const bg = 'bg-gradient-to-b from-[#235EFF] via-[#3F73FF] to-[#235EFF] text-white';
  const bg = `text-[${token.colorPrimary}]`;
  const { t } = useTranslation();
  const responsive = useResponsive();
  return (
    <div className=' bg-[linear-gradient(to_right,#ffffff80_0%,#ffffff40_0%,transparent_40%,transparent_60%,#ffffff40_100%,#ffffff20_100%)] p-[1px] mx-[-1px]'>
      {/* <div className=' p-4 bg-gradient-to-b from-black to-[#ffffff10]'> */}
      <div className='bg-black'>
        <div className='grid grid-cols-3 justify-between items-center max-sm:h-16 h-20 '>
          <div
            onClick={() => {
              navigate('/');
            }}
            className={'h-full col-span-1 justify-center flex flex-col items-center ' + (active === '/' ? bg : '')}
            style={{
              color: active === '/' ? token.colorPrimary : token.colorText,
            }}
          >
            <SvgIcon name='chache' size={responsive.xs ? 24 : 38} />
            <span>车辆</span>
          </div>
          <div
            onClick={() => {
              navigate('/task');
            }}
            className={'h-full col-span-1 justify-center flex  flex-col items-center '}
          >
            <SvgIcon name='weibao' size={responsive.xs ? 24 : 38} />
            <span>维保</span>
          </div>
          <div
            onClick={() => {
              navigate('/me');
            }}
            className={'h-full col-span-1 justify-center flex flex-col items-center  '}
          >
            <SvgIcon name='shezhi' size={responsive.xs ? 24 : 38} />
            <span>设置</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalFooter;
