import useCommonStyles from '@/utils/commonStyle';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useGlobalStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { Button, Skeleton, Slider, Switch, Tooltip, Typography } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { getPeripheralControlParam, postPeripheralControlParam } from '../service';
/**
 * 外设参数
 */
const Peripheral = () => {
  const { token } = useGlobalStore(
    useShallow((state) => ({
      token: state.token,
    })),
  );
  const { styles } = useCommonStyles();
  const { t } = useTranslation();
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

  return (
    <div className='flex-1 overflow-auto relative'>
      <Typography.Title className='text-center' level={3}>
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
          <div className='flex justify-end absolute bottom-0 right-0'>
            <Tooltip title={t('common.constructionEndTip')}>
              <Button
                variant='solid'
                type='primary'
                size='large'
                icon={<QuestionCircleOutlined />}
                disabled={!token}
                onClick={() => {
                  window.open('/deployer');
                }}
              >
                {t('common.constructionEnd')}
              </Button>
            </Tooltip>
          </div>
        </div>
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};

export default Peripheral;
