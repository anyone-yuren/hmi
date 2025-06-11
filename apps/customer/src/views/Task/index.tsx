import GlobalFooter from '@/components/Footer';
import { Card, Space } from 'antd';
import { useResponsive } from 'antd-style';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SvgIcon } from 'ui';

const Home = () => {
  const { t } = useTranslation();
  const responsive = useResponsive();
  const navigate = useNavigate();

  return (
    <div className='flex flex-col h-full w-full justify-between'>
      <div className='flex-1 p-4 overflow-y-auto'>
        <Card title={t('pda.home.warehourse')} className='bg-gradient-to-b from-[#F8F7FC] to-[#FAFAFA] mb-4'>
          <Space className='flex justify-between'>
            <div className='flex items-center gap-1 flex-col' onClick={() => navigate('/bind')}>
              <div className='w-14 h-14 max-sm:w-10 max-sm:h-10 bg-gradient-to-t from-[#8FCFEA] to-[#427BEC] rounded-3xl flex items-center justify-center'>
                <SvgIcon name='bangding' style={{ color: 'white' }} size={responsive.xs ? 24 : 38} />
              </div>
              <p className='text-xs'>{t('pda.home.bind')}</p>
            </div>
            <div className='flex items-center gap-1 flex-col' onClick={() => navigate('/unbind')}>
              <div className='w-14 h-14 max-sm:w-10 max-sm:h-10 bg-gradient-to-t from-[#F8E040] to-[#FBA703] rounded-3xl flex items-center justify-center'>
                <SvgIcon name='jiebang' style={{ color: 'white' }} size={responsive.xs ? 24 : 38} />
              </div>
              <p className='text-xs'>解盘</p>
            </div>
            <div className='flex items-center gap-1 flex-col' onClick={() => navigate('/ins')}>
              <div className='w-14 h-14 max-sm:w-10 max-sm:h-10 bg-gradient-to-t from-[#BCFFE8] to-[#9CF4D0] rounded-3xl flex items-center justify-center'>
                <SvgIcon name='ruku' style={{ color: 'black' }} size={responsive.xs ? 24 : 38} />
              </div>
              <p className='text-xs'>{t('pda.home.applyIn')}</p>
            </div>
            <div className='flex items-center gap-1 flex-col' onClick={() => navigate('summonContainer')}>
              <div className='w-14 h-14 max-sm:w-10 max-sm:h-10 bg-gradient-to-t from-[#F9B26B] to-[#FA5A21] rounded-3xl flex items-center justify-center'>
                <SvgIcon name='hujiao' style={{ color: 'white' }} size={responsive.xs ? 24 : 38} />
              </div>
              <p className='text-xs'>{t('pda.home.applyContainer')}</p>
            </div>
          </Space>
        </Card>
      </div>
      <GlobalFooter />
    </div>
  );
};
export default Home;
