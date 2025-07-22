import useCommonStyles from '@/utils/commonStyle';
import { useRequest } from 'ahooks';
import { Slider, Switch, Typography } from 'antd';
import { getPeripheralControlParam } from '../service';
/**
 * 外设参数
 */
const Peripheral = () => {
  const { styles } = useCommonStyles();
  const {
    run,
    loading,
    data: serviceControlParam,
  } = useRequest(getPeripheralControlParam, {
    manual: true,
  });

  return (
    <div className='flex-1 overflow-auto'>
      <Typography.Title className='text-center' level={3}>
        外设参数
      </Typography.Title>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col p-2 bg-[#d8d8d833] rounded-md'>
          <div className='text-lg opacity-50'>喇叭音量</div>
          <div className='flex flex-row'>
            <Slider className={`${styles.customSlider} swiper-no-swiping w-full`} min={0} max={100} />
          </div>
        </div>
        <div className='flex flex-col p-2 bg-[#d8d8d833] rounded-md'>
          <div className='text-lg opacity-50'>电量报警阈值</div>
          <div className='flex flex-row'>
            <Slider className={`${styles.customSlider} swiper-no-swiping w-full`} min={0} max={100} />
          </div>
        </div>
        <div className='flex flex-row items-center justify-between p-2 bg-[#d8d8d833] rounded-md'>
          <div className='text-lg opacity-50'>行走音乐</div>
          <div className='flex flex-row'>
            <Switch className={styles.customSwitch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Peripheral;
