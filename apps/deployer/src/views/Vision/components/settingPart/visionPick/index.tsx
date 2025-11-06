import { Button, ListItemText, MenuItem } from '@mui/material';
import { useAsyncEffect, useRequest, useSetState } from 'ahooks';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { getVisionPickSetting, saveVisionPickSetting } from '../../../services/index';
import SecondaryPage, { SecondaryPaper } from '../../SecondaryPage';
import CustomSelect from '../comp/customSelect';
import CustomSwitch from '../comp/customSwitch';
import Setting from './setting';

import { translateStateToParams } from '../../../utils';

const VisionPick = () => {
  const { t, i18n } = useTranslation();
  const [settingHashMap, setSettingHashMap] = useState<any>({});
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    __isSubmit: false,
    need_detect: false,
    sensor_model: '',
    sensor_model_list: [],
  });
  const [open, setOpen] = useState(false);
  // loading 用来判断没有加载数据的时候锁死卡牌
  const { data: visionSetting, loading, runAsync: getVisionSetting } = useRequest(() => getVisionPickSetting(), {});

  useEffect(() => {
    if (!visionSetting) return;
    const { data } = visionSetting;
    setSettingHashMap({ ...data });
    setUpdateHashMap({
      need_detect: data?.need_detect?.value,
      sensor_model: data?.sensor_model?.value || '',
      sensor_model_list: data?.sensor_model_list?.value,
    });
  }, [visionSetting]);

  const sensorSelectList = useMemo(() => {
    const origin = visionSetting?.data?.sensor_model_list?.value;
    const cn_origin = visionSetting?.data?.ch_sensor_model_list?.value || [];
    const isChinese = i18n.language === 'zh_CN';
    return origin?.map((item, index) => {
      return {
        value: item,
        label: isChinese ? cn_origin?.[index] : item,
      };
    });
  }, [i18n.language, visionSetting]);

  useAsyncEffect(async () => {
    if (!updateHashMap.__isSubmit) {
      return;
    }
    const params = translateStateToParams(settingHashMap, updateHashMap);
    await saveVisionPickSetting(params);
    toast.success(t('common.actionSuccess'));
  }, [updateHashMap, settingHashMap]);

  return (
    <>
      <div className='flex flex-col items-center justify-center flex-1 basis-[45%] w-[50%] h-full overflow-hidden'>
        <div className='w-full bg-[#2c3645] rounded-[20px] p-[20px] overflow-hidden relative h-full overflow-y-auto'>
          <div className='text-3xl'>{t('deployer.vision.pick')}</div>
          <div className='my-3 p-4 bg-[#d8d8d8] bg-opacity-20 rounded-lg flex items-center justify-between text-lg'>
            <div>{t('deployer.vision.isTurnOn')}</div>
            <div>
              <CustomSwitch
                checked={updateHashMap.need_detect}
                onChange={(event: any) => {
                  setUpdateHashMap({
                    __isSubmit: true,
                    need_detect: event.target.checked,
                  });
                }}
              />
            </div>
          </div>
          <div className='my-3 p-4 bg-[#d8d8d8] bg-opacity-20 rounded-lg flex items-center justify-between text-lg'>
            <div>{t('deployer.vision.sensorBind')}</div>
            <div>
              <CustomSelect
                variant='standard'
                value={updateHashMap.sensor_model}
                onChange={(event: any) => {
                  setUpdateHashMap({
                    __isSubmit: true,
                    sensor_model: event.target.value,
                  });
                }}
              >
                {sensorSelectList?.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </CustomSelect>
            </div>
          </div>
          <Button
            sx={{ color: 'white', float: 'right' }}
            variant='contained'
            onClick={async () => {
              setOpen(true);
            }}
          >
            {t('deployer.vision.paramSetting')}
          </Button>
        </div>
      </div>

      <SecondaryPage open={open} setOpen={setOpen} fullScreen={true} background={'#162640'}>
        <SecondaryPaper>{open && <Setting __open={setOpen}></Setting>}</SecondaryPaper>
      </SecondaryPage>
    </>
  );
};

export default memo(VisionPick);
