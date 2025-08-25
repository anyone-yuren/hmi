import useCommonStyles from '@/utils/commonStyle';
import { useRequest } from 'ahooks';
import { Skeleton, Slider, Switch, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getPeripheralControlParam, postPeripheralControlParam } from '../service';
const branch = import.meta.env.VITE_APP_BUILD_BRANCH;
const data = import.meta.env.VITE_APP_BUILD_TIME;
const info = import.meta.env.VITE_APP_BUILD_INFO;
const hash = import.meta.env.VITE_APP_BUILD_COMMIT;
/**
 * 外设参数
 */
const Peripheral = () => {
  const { styles } = useCommonStyles();
  const { t } = useTranslation();
  const [count, setCount] = useState(1);
  const {
    run,
    loading,
    data: serviceControlParam,
  } = useRequest(getPeripheralControlParam, {
    manual: true,
  });

  const postRun = useRequest(postPeripheralControlParam, {
    manual: true,
  });

  useEffect(() => {
    run();
  }, []);

  useEffect(() => {
    if (count % 9 === 0) {
      alert(`branch: ${branch || '-'} \ndata: ${data || '-'} \ninfo: ${info || '-'} \nhash: ${hash || '-'}`);
    }
  }, [count]);

  const handleTitle = () => {
    setCount((origin) => origin + 1);
  };

  return (
    <div className='flex-1 overflow-auto'>
      <Typography.Title className='text-center' level={3} onClick={handleTitle}>
        {t('deployer.setting.peripheral')}
      </Typography.Title>
      {!loading ? (
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col p-2 bg-[#d8d8d833] rounded-md'>
            <div className='text-lg opacity-50'>{t('deployer.setting.volumn')}</div>
            <div className='flex flex-row'>
              <Slider
                defaultValue={serviceControlParam?.volumn}
                className={`${styles.customSlider} swiper-no-swiping w-full`}
                min={0}
                max={100}
                onChangeComplete={(value) => {
                  postRun.run({
                    volumn: value,
                  });
                }}
              />
            </div>
          </div>
          <div className='flex flex-col p-2 bg-[#d8d8d833] rounded-md'>
            <div className='text-lg opacity-50'>{t('deployer.setting.lowPower')}</div>
            <div className='flex flex-row'>
              <Slider
                defaultValue={serviceControlParam?.low_power}
                className={`${styles.customSlider} swiper-no-swiping w-full`}
                min={0}
                max={100}
                onChangeComplete={(value) => {
                  postRun.run({
                    low_power: value,
                  });
                }}
              />
            </div>
          </div>
          <div className='flex flex-row items-center justify-between p-2 bg-[#d8d8d833] rounded-md'>
            <div className='text-lg opacity-50'>{t('deployer.setting.runMusic')}</div>
            <div className='flex flex-row'>
              <Switch
                defaultChecked={serviceControlParam?.use_run_music}
                className={styles.customSwitch}
                onChange={(checked) => {
                  postRun.run({
                    use_run_music: checked,
                  });
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};

export default Peripheral;
