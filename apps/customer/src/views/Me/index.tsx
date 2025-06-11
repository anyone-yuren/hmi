import GlobalFooter from '@/components/Footer';
import { RightOutlined } from '@ant-design/icons';
import { useResponsive } from 'antd-style';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const MePage = () => {
  const { t } = useTranslation();
  const responsive = useResponsive();
  const navigate = useNavigate();

  return (
    <div className='flex flex-col h-full w-full justify-between bg-gradient-to-b from-[#D0DCFF] via-[#D4E0FF]'>
      <div className='flex-1 p-4 overflow-y-auto'>
        <div className='flex flex-col gap-4'>
          <div className='flex justify-between p-2 rounded-xl bg-white'>
            <div>当前版本：v4.0.1</div>
            <RightOutlined style={{ fontSize: '10px' }} className='opacity-70' />
          </div>
          <div className='flex justify-between p-2 rounded-xl bg-white'>
            <div>退出</div>
            <RightOutlined style={{ fontSize: '10px' }} className='opacity-70' />
          </div>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};
export default MePage;
