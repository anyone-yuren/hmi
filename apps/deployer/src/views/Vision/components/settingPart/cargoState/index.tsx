import { Button, ListItemText, MenuItem } from '@mui/material';
import { useAsyncEffect, useRequest, useSetState, useUpdateEffect } from 'ahooks';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import SecondaryPage, { SecondaryPaper } from '../../SecondaryPage';
import CustomSelect from '../comp/customSelect';
import CustomSwitch from '../comp/customSwitch';
import Setting from './setting';

import { getGoodsStateDetectRead, postGoodsStateDetectSave } from '../../../services/index';

// import { translateStateToParams } from "../../../utils";

const RowBox = (props: any) => {
  return (
    <div className='my-3 p-4 bg-[#d8d8d8] bg-opacity-20 rounded-lg flex items-center justify-between text-lg'>
      {props.children}
    </div>
  );
};
const CargoState = () => {
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
  const { data: cargoStateSetting, runAsync: getCargoStateSetting } = useRequest(() => getGoodsStateDetectRead(), {});

  useEffect(() => {
    if (!cargoStateSetting) return;
    const { data } = cargoStateSetting;
    setSettingHashMap({ ...data });
    setUpdateHashMap({
      need_detect: data?.need_detect?.value,
      sensor_model: data?.sensor_model?.value || '',
      sensor_model_list: data?.sensor_model_list?.value,
    });
  }, [cargoStateSetting]);

  const sensorSelectList = useMemo(() => {
    const origin = cargoStateSetting?.data?.sensor_model_list?.value;
    const cn_origin = cargoStateSetting?.data?.ch_sensor_model_list?.value;
    const isChinese = i18n.language === 'zh_CN';
    return origin?.map((item, index) => {
      return {
        value: item,
        label: isChinese ? cn_origin[index] : item,
      };
    });
  }, [i18n.language, cargoStateSetting]);

  useAsyncEffect(async () => {
    if (!updateHashMap.__isSubmit) {
      return;
    }
    // const params = translateStateToParams(settingHashMap, updateHashMap);
    const params = { ...settingHashMap };
    params['need_detect'].value = updateHashMap.need_detect;
    params['sensor_model'].value = updateHashMap.sensor_model;
    await postGoodsStateDetectSave(params);
    toast.success(t('common.actionSuccess'));
  }, [updateHashMap, settingHashMap]);

  useUpdateEffect(() => {
    getCargoStateSetting();
  }, [open]);

  return (
    <>
      <div className='flex flex-col items-center justify-center flex-1 basis-[45%] w-[50%] h-full overflow-hidden'>
        <div className='w-full bg-[#2c3645] rounded-[20px] p-[20px] overflow-hidden relative h-full overflow-y-auto'>
          <div className='text-3xl'>{t('deployer.vision.goodsStatusCheck')}</div>
          <RowBox>
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
          </RowBox>
          <RowBox>
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
          </RowBox>
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
        <SecondaryPaper>{open && <Setting __open={setOpen} propsState={settingHashMap}></Setting>}</SecondaryPaper>
      </SecondaryPage>
    </>
  );
};

export default memo(CargoState);
