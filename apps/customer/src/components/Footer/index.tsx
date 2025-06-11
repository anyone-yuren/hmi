import { useResponsive } from 'antd-style';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { SvgIcon } from 'ui';
const GlobalFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname;
  const bg = 'bg-gradient-to-b from-[#235EFF] via-[#3F73FF] to-[#235EFF] text-white';
  const { t } = useTranslation();
  const responsive = useResponsive();
  return (
    <div className='grid grid-cols-3 justify-between items-center max-sm:h-16 h-20 text-[#235EFF]'>
      <div
        onClick={() => {
          navigate('/');
        }}
        className={
          'h-full col-span-1 justify-center flex flex-col items-center ' +
          (active === '/' ? '' : active === '/task' ? 'rounded-tr-3xl ' + bg : bg)
        }
      >
        <SvgIcon name='home' size={responsive.xs ? 24 : 38} />
        <span>首页</span>
      </div>
      <div
        onClick={() => {
          navigate('/task');
        }}
        className={
          'h-full col-span-1 justify-center flex  flex-col items-center ' +
          (active === '/task' ? '' : active === '/' ? 'rounded-tl-3xl ' + bg : 'rounded-tr-3xl ' + bg)
        }
      >
        <SvgIcon name='task' size={responsive.xs ? 24 : 38} />
        <span>任务</span>
      </div>
      <div
        onClick={() => {
          navigate('/me');
        }}
        className={
          'h-full col-span-1 justify-center flex flex-col items-center  ' +
          (active === '/me' ? '' : active === '/' ? ' ' + bg : 'rounded-tl-3xl ' + bg)
        }
      >
        <SvgIcon name='me' size={responsive.xs ? 24 : 38} />
        <span>我的</span>
      </div>
    </div>
  );
};

export default GlobalFooter;
