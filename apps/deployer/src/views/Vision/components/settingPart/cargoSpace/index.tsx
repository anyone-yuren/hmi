import { memo, useEffect, useState } from 'react';

import { ListItemText, MenuItem, ThemeProvider, createTheme } from '@mui/material';

import { useRequest, useSetState } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getPlaceSpaceDetectRead as read, postPlaceSpaceDetectSave as save } from '../../../services/index';
import CustomSelect from '../comp/customSelect';
import LoadingButton from '../comp/loadingButton';
import PointCloudFilter from '../comp/pointCloudFilter';
import TextChangeRow from '../comp/textChangeRow';
import TextUpdateRow from '../comp/textUpdateRow';
import TextUpdateSwitchRow from '../comp/textUpdateSwitchRow';
import Illustration from './illustration';
// import useVisionWebsocket from "@/components/https/visionWebSocket";
// import { getRequestUrl } from "@/components/WebSocketContainer/index";
import useVision from '../../../hooks/useVision';
const LightTheme = (props: any) => {
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#00D1D1',
          },
        },
        typography: {
          fontSize: 20,
        },
      })}
    >
      {props.children}
    </ThemeProvider>
  );
};

const Setting = () => {
  // const { disconnect } = useVisionWebsocket({
  //   url: `ws://${getRequestUrl()}:10010`,
  // });
  const { disconnect } = useVision();
  const { t } = useTranslation();
  const [originHashMap, setOriginHashMap] = useState<any>({});
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    need_detect: false,
    sensor_model: '',
    sensor_model_list: [],
    extra_heights: 0,
    goods_total_width: 0,
    goods_total_height: 0,
    sku_gap: 0,
  });

  useRequest(read, {
    onSuccess: (response: any) => {
      const { data: hashMap } = response;
      if (!hashMap || !Object.keys(hashMap)?.length) return;
      const obj: any = {};
      Object.keys(hashMap)?.forEach((key: any) => {
        obj[key] = hashMap[key]?.value;
      });
      setUpdateHashMap(obj);
      setOriginHashMap(hashMap); // 缓存接口的数据,提交的时候要合并
    },
  });

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const changeUpdateHashMap = (key: string, value: any) => {
    setUpdateHashMap({
      [key]: value,
    });
  };

  const handleSave = async () => {
    const sendState: any = {};
    const numberAry = ['uint', 'int'];
    Object.keys(originHashMap).forEach((key) => {
      sendState[key] =
        updateHashMap[key] !== undefined
          ? {
              ...originHashMap[key],
              value: numberAry.includes(originHashMap[key]?.type) ? Number(updateHashMap[key]) : updateHashMap[key],
            }
          : originHashMap[key];
    });
    console.log(sendState, updateHashMap);
    await save(sendState);
    toast.success(t('common.actionSuccess'));
  };

  return (
    <LightTheme>
      <div className='text-black h-full flex gap-[10px] px-[40px]'>
        <div className='w-[350px] overflow-scroll'>
          <TextUpdateSwitchRow
            title={t('deployer.vision.isTurnOn')}
            checked={updateHashMap['need_detect']}
            onChange={(checked: boolean) => {
              changeUpdateHashMap('need_detect', checked);
            }}
          />
          <TextUpdateRow>
            <div>{t('deployer.vision.sensorBind')}</div>
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
              {updateHashMap?.sensor_model_list?.map((name: any) => (
                <MenuItem
                  key={name}
                  value={name}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: '#00d1d1ad', // 修改选中项的背景色
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: '#00d1d1ad', // 修改选中项的背景色
                    },
                  }}
                >
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </CustomSelect>
          </TextUpdateRow>
          <PointCloudFilter type={'place_space_detect'} background={'white'} titleColor={'black'}></PointCloudFilter>

          {[
            { title: t('deployer.vision.extraForkLift'), key: 'extra_height' },
            { title: t('deployer.vision.goodsWidth'), key: 'goods_total_width' },
            { title: t('deployer.vision.goodsHeight'), key: 'goods_total_height' },
            { title: t('deployer.vision.goodsSideGap'), key: 'sku_gap' },
          ]?.map((item: any) => {
            return (
              <TextChangeRow
                key={item?.key}
                title={item.title}
                value={updateHashMap?.[item.key]}
                validateRange={[originHashMap?.[item.key]?.min, originHashMap?.[item.key]?.max]}
                onChange={(value: string) => {
                  changeUpdateHashMap(item.key, value);
                }}
              >
                <div>{updateHashMap?.[item.key] || 0}</div>
              </TextChangeRow>
            );
          })}

          <LoadingButton
            fullWidth
            variant='contained'
            sx={{ color: 'white', marginBottom: '80px' }}
            onPress={handleSave}
          >
            {t('common.save')}
          </LoadingButton>
        </div>
        <div className='flex-1'>
          <Illustration />
        </div>
      </div>
    </LightTheme>
  );
};

export default memo(Setting);
