import inPng from '@/assets/img/in.png';
import outPng from '@/assets/img/out.png';
import pdl from '@/assets/img/pdl.png';
import pdm from '@/assets/img/pdm.png';
import GlobalFooter from '@/components/Footer';
import { BarChartOutlined, DotChartOutlined } from '@ant-design/icons';
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
      {/* <div className='min-h-32'>
        <div className='text-white text-center'>
          <Typography.Title level={4} className='text-center !text-white !m-0'>
            ¥ 2,345.00 <RedoOutlined style={{ fontSize: '18px' }} />
          </Typography.Title>
          <span className='text-xs'>库存总额</span>
        </div>
        <div className='flex items-center divide-x mt-4'>
          <div className='flex-1 text-white text-center'>
            <Typography.Title level={5} className='!text-white !m-0'>
              12
            </Typography.Title>
            <span className='text-xs'>本月入库数</span>
          </div>
          <div className='flex-1 text-white text-center'>
            <Typography.Title level={5} className='!text-white !m-0'>
              4453.90
            </Typography.Title>
            <span className='text-xs'>本月入库总额</span>
          </div>
        </div>
      </div> */}
      <div className='flex-1 p-4 overflow-y-auto'>
        <div className='grid grid-cols-5 gap-4 mb-4'>
          <div className='col-span-2 flex flex-col justify-between bg-gradient-to-t from-[#F8F7FC] to-[#FAFAFA]  rounded-lg'>
            <div className='p-2'>
              <p className='text-xs font-bold text-[#333]'>订单管理</p>
              <p className='text-[#4B79A9] text-xs'>今日出库100件</p>
            </div>
            <img src={pdm} className='w-full' alt='' />
          </div>
          <div className='col-span-3 grid grid-cols-2 gap-4'>
            <div
              className='col-span-1 max-sm:max-h-24 bg-gradient-to-b from-[#FFFBF6] to-[#FFF7EF] rounded-lg flex items-center flex-col py-2'
              onClick={() => {
                navigate('/ins');
              }}
            >
              <p className='text-[#DA9318] font-bold'>入库</p>
              <img className='max-sm:w-14' src={inPng} alt='' />
            </div>
            <div
              className='col-span-1 max-sm:max-h-24 bg-gradient-to-b from-[#FBF9FF] to-[#F1ECFF] rounded-lg  flex items-center flex-col py-2'
              onClick={() => {
                navigate('/summonContainer');
              }}
            >
              <p className='text-[#4C66A7] font-bold'>出库</p>
              <img className='max-sm:w-14' src={outPng} alt='' />
            </div>
            <div
              className='col-span-2 max-sm:max-h-16 bg-gradient-to-b from-[#FFF5F5] to-[#FFF9F9] rounded-lg flex items-center justify-between'
              onClick={() => {
                navigate('/handingContainer');
              }}
            >
              <img src={pdl} alt='' className='max-sm:w-24' />
              <p className='text-[#AC4838] px-2 font-bold'>{t('pda.home.ApplySlotToSlot')}</p>
            </div>
          </div>
        </div>
        <Card title={t('pda.home.warehourse')} className='bg-gradient-to-b from-[#F8F7FC] to-[#FAFAFA] mb-4'>
          <Space className='grid grid-cols-4 justify-between'>
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
                <SvgIcon name='ruku' style={{ color: '#ccc' }} size={responsive.xs ? 24 : 38} />
              </div>
              <p className='text-xs'>{t('pda.home.applyIn')}</p>
            </div>
            <div className='flex items-center gap-1 flex-col' onClick={() => navigate('summonContainer')}>
              <div className='w-14 h-14 max-sm:w-10 max-sm:h-10 bg-gradient-to-t from-[#F9B26B] to-[#FA5A21] rounded-3xl flex items-center justify-center'>
                <SvgIcon name='hujiao' style={{ color: 'white' }} size={responsive.xs ? 24 : 38} />
              </div>
              <p className='text-xs'>{t('pda.home.applyContainer')}</p>
            </div>
            <div className='flex items-center gap-1 flex-col' onClick={() => navigate('multiApplyContainer')}>
              <div className='w-14 h-14 max-sm:w-10 max-sm:h-10 bg-gradient-to-t from-[#6bccf9] to-[#21bcfa] rounded-3xl flex items-center justify-center'>
                <SvgIcon name='mulApply' style={{ color: 'white' }} size={responsive.xs ? 24 : 38} />
              </div>
              <p className='text-xs'>{t('pda.home.multiplyApplyContainer')}</p>
            </div>
            <div className='flex items-center gap-1 flex-col' onClick={() => navigate('applyContainer')}>
              <div className='w-14 h-14 max-sm:w-10 max-sm:h-10 bg-gradient-to-t from-[#d56bf9] to-[#ae21fa] rounded-3xl flex items-center justify-center'>
                <SvgIcon name='applyEmpty' style={{ color: 'white' }} size={responsive.xs ? 24 : 38} />
              </div>
              <p className='text-xs'>{t('pda.home.ApplyContainer')}</p>
            </div>
            <div className='flex items-center gap-1 flex-col' onClick={() => navigate('handingContainer')}>
              <div className='w-14 h-14 max-sm:w-10 max-sm:h-10 bg-gradient-to-t from-[#63e1e8] to-[#1aaab7] rounded-3xl flex items-center justify-center'>
                <SvgIcon name='zaiju' style={{ color: 'white' }} size={responsive.xs ? 24 : 38} />
              </div>
              <p className='text-xs'>{t('pda.home.ApplySlotToSlot')}</p>
            </div>
          </Space>
        </Card>

        <Card title={t('pda.home.charts')} className='bg-gradient-to-b from-[#F8F7FC] to-[#FAFAFA] mb-4'>
          <Space className='grid grid-cols-4 justify-start'>
            <div className='flex items-center gap-1 flex-col' onClick={() => navigate('/bind')}>
              <div className='w-14 h-14 max-sm:w-10 max-sm:h-10 bg-gradient-to-t from-[#F9B26B] to-[#FA5A21] rounded-3xl flex items-center justify-center'>
                {/* <SvgIcon name='chart1'  size={responsive.xs ? 24 : 38} /> */}
                <BarChartOutlined
                  style={{
                    color: 'white',
                    fontSize: responsive.xs ? 24 : 38,
                  }}
                />
              </div>
              <p className='text-xs'>{t('pda.home.taskCount')}</p>
            </div>
            <div className='flex items-center gap-1 flex-col' onClick={() => navigate('/unbind')}>
              <div className='w-14 h-14 max-sm:w-10 max-sm:h-10 bg-gradient-to-t from-[#F8E040] to-[#FBA703] rounded-3xl flex items-center justify-center'>
                <DotChartOutlined
                  style={{
                    color: 'white',
                    fontSize: responsive.xs ? 24 : 38,
                  }}
                />
              </div>
              <p className='text-xs'>{t('pda.home.slotCount')}</p>
            </div>
          </Space>
        </Card>
      </div>
      <GlobalFooter />
    </div>
  );
};
export default Home;
