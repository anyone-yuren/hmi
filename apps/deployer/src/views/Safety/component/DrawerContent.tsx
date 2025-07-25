import CustomSwitch from '@/components/CustomSwitch';
import { Input, InputAdornment } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useRequest } from 'ahooks';
import { Button, Divider, notification } from 'antd';
import { mapValues } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { getDeviceList, updateSafety } from '../service';
import { useSafetyStore } from '../store/safety.store';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00D1D1',
    },
  },
});

const DrawerContent = ({ refresh }) => {
  const { t, i18n } = useTranslation();
  const [api, contextHolder] = notification.useNotification({
    maxCount: 1,
    bottom: 0,
  });

  const serviceLanguage = useMemo(() => {
    return i18n.language;
  }, [i18n.language]);

  const { setSetting, setObstacleData, obstacleData } = useSafetyStore(
    useShallow((store) => {
      return {
        setSetting: store.setSetting,
        setObstacleData: store.setObstacleData,
        obstacleData: store.obstacleData,
      };
    }),
  );

  const { data: deviceList } = useRequest(getDeviceList);

  const {
    data: updateSafetyData,
    loading: updateLoading,
    run,
  } = useRequest(updateSafety, {
    manual: true,
    onSuccess: (res) => {
      if (res.code === 200) {
        toast.success(t('修改成功'));
        setSetting(false);
        api.destroy();
        refresh && refresh();
      } else {
        toast.error(res.msg);
      }
    },
  });

  const [initalValue, setInitalValue] = useState({
    stop_distance_forward_empty: 0.3,
    stop_distance_backward_empty: 0.3,
    stop_distance_left_empty: 0.3,
    stop_distance_right_empty: 0.3,
    stop_region_right: 0.3,
    stop_region_left: 0.3,
  });

  useEffect(() => {
    setInitalValue(obstacleData);
  }, [obstacleData]);

  const inputChange = (e, type) => {
    if (!e) return;
    setObstacleData({ ...obstacleData, [type]: Number(e.target.value) });
  };

  const memoDeviceList = useMemo(() => {
    if (!deviceList) return null;
    return deviceList?.data
      ? deviceList?.data?.map((item) => {
          return (
            <div className='p-4 bg-[#d8d8d8] bg-opacity-20 rounded-lg flex items-center justify-between text-lg text-black'>
              <div>{serviceLanguage.includes('zh') ? item.ch_name : item.name}</div>
              <div>
                <CustomSwitch
                  checked={obstacleData.sensor_enable?.includes(item.id)}
                  onChange={(e, checked) => {
                    setObstacleData({
                      ...obstacleData,
                      sensor_enable: checked
                        ? [...obstacleData.sensor_enable, item.id]
                        : obstacleData.sensor_enable.filter((id) => id !== item.id),
                    });
                  }}
                />
              </div>
            </div>
          );
        })
      : null;
  }, [obstacleData, deviceList?.data, serviceLanguage]);

  const renderDirectionData = [
    {
      title: t('deployer.safety.forwardDistance'),
      key: 'stop_distance_forward_empty',
    },
    {
      title: t('deployer.safety.backDistance'),
      key: 'stop_distance_backward_empty',
    },
    {
      title: t('deployer.safety.leftDistance'),
      key: 'stop_distance_left_empty',
    },
    {
      title: t('deployer.safety.rightDistance'),
      key: 'stop_distance_right_empty',
    },
  ];

  const lateralData = [
    {
      title: t('deployer.safety.left'),
      key: 'stop_region_left',
    },
    {
      title: t('deployer.safety.right'),
      key: 'stop_region_right',
    },
  ];

  const renderDirection = (data: Array<{ key: string; title: string }>) => {
    return data.map((item) => {
      return (
        <div className='p-4 bg-[#d8d8d8] bg-opacity-20 rounded-lg flex items-center justify-between text-lg gap-4 text-black'>
          <div>{item.title}</div>
          <Input
            className='flex-1 min-w-[30%]'
            type='number'
            onChange={(e) => {
              inputChange(e, item.key);
            }}
            value={initalValue[item.key as keyof typeof initalValue]}
            endAdornment={<InputAdornment position='end'>m</InputAdornment>}
            inputProps={{
              step: 0.1,
              min: 0,
              max: 5,
              type: 'number',
            }}
          />
        </div>
      );
    });
  };
  return (
    <ThemeProvider theme={lightTheme}>
      <div className='flex flex-col h-full'>
        {contextHolder}
        <div className='flex-1 overflow-auto pt-0'>
          <Divider orientation='left'>
            <p className='text-lg text-black'>{t('deployer.safety.obsDistance')}</p>
          </Divider>
          <div className='flex flex-col gap-4'>{renderDirection(renderDirectionData)}</div>
          <Divider orientation='left'>
            <p className='text-lg text-black'>{t('deployer.safety.lateral')}</p>
          </Divider>
          <div className='flex flex-col gap-4'>{renderDirection(lateralData)}</div>
          <Divider orientation='left'>
            <p className='text-lg text-black'>{t('deployer.safety.sensor')}</p>
          </Divider>
          <div className='flex flex-col gap-4'>{memoDeviceList}</div>
        </div>
        <div className='flex justify-around p-4 shadow shadow-slate-200'>
          <Button
            size='large'
            type='primary'
            loading={updateLoading}
            onClick={async () => {
              const { line_keeping, scheme_id, sensor_enable, ...changeData } = obstacleData;
              const values = mapValues(changeData, (value) => value * 1000);
              await run({
                ...values,
                scheme_id,
                sensor_enable,
                line_keeping,
              });
            }}
          >
            {t('common.modify')}
          </Button>
          <Button
            className='text-black'
            size='large'
            onClick={async () => {
              setSetting(false);
              api.destroy();
            }}
          >
            {t('common.close')}
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DrawerContent;
