import { Button, ListItemText, MenuItem } from '@mui/material';
import { useAsyncEffect, useRequest, useSetState, useUpdateEffect } from 'ahooks';
import { ConfigProvider } from 'antd';
import React, { memo, Suspense, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getTailTruckRead, postTailTruckSave } from '../../../services/index';
import SecondaryPage, { SecondaryPaper } from '../../SecondaryPage';
import CustomSelect from '../comp/customSelect';
import LightTheme from '../comp/lightTheme';

const TruckLoad = ({ signal, cancelAxios }: any) => {
  const { t } = useTranslation();
  const [modalConfig, setModalConfig] = useState({
    open: false,
    key: '',
  });
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    __isSubmit: false,
    sensor_model_list: [],
    tail_loading: '', // 装车
    tail_unloading: '', // 卸车
    tail_vehicle_forward: '', // 退出车厢
  });
  const { data: truckLoad, runAsync: getTruckLoad } = useRequest(
    () =>
      getTailTruckRead(
        {},
        {
          signal,
        },
      ),
    {},
  );

  const renderData = [
    [
      {
        key: 'observe',
        label: t('观测任务'),
        sensorVisible: false,
        sensorKey: '',
        sensor: '',
      },
      {
        key: 'load',
        label: t('装车'),
        sensorVisible: true,
        sensorKey: 'tail_loading',
        sensor: '',
      },
    ],
    [
      {
        key: 'unload',
        label: t('卸车'),
        sensorVisible: true,
        sensorKey: 'tail_unloading',
        sensor: '',
      },
      {
        key: 'leave',
        label: t('退出车厢'),
        sensorVisible: true,
        sensorKey: 'tail_vehicle_forward',
        sensor: '',
      },
    ],
  ];

  useEffect(() => {
    return () => {
      cancelAxios();
    };
  }, []);

  useAsyncEffect(async () => {
    if (!updateHashMap.__isSubmit) {
      return;
    }

    const params: any = { ...truckLoad?.data };
    for (let key in updateHashMap) {
      if (params.select_model[key]) {
        params.select_model[key].value = updateHashMap[key];
      }
    }
    await postTailTruckSave(params);
    toast.success(t('操作成功'));
  }, [updateHashMap, postTailTruckSave]);

  useEffect(() => {
    const data = truckLoad?.data;
    setUpdateHashMap({
      __isSubmit: false,
      tail_vehicle_forward: data?.select_model?.tail_vehicle_forward?.value || '',
      tail_unloading: data?.select_model?.tail_unloading?.value || '',
      tail_loading: data?.select_model?.tail_loading?.value || '',
      sensor_model_list: data?.sensor_model_list?.value || [],
    });
  }, [truckLoad]);

  useUpdateEffect(() => {
    if (!modalConfig?.open && modalConfig.key === 'load') {
      getTruckLoad();
    }
  }, [modalConfig]);

  const Observe = React.lazy(() => import('./observe/index'));
  const Leave = React.lazy(() => import('./leave/index'));
  const Load = React.lazy(() => import('./load'));
  const UnLoad = React.lazy(() => import('./unload'));
  const Cargo = React.lazy(() => import('./cargo/index'));
  const template: any = useMemo(() => {
    return {
      observe: <Observe />,
      leave: <Leave />,
      load: <Load />,
      unload: <UnLoad />,
      cargo: <Cargo />,
    };
  }, []);

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              defaultBg: '#04d1d1',
              defaultActiveBg: '#04d1d1',
              defaultBorderColor: '#04d1d1',
              defaultHoverBg: '#04d1d1',
              defaultColor: '#fff',
              defaultActiveColor: '#fff',
              textTextActiveColor: '#fff',
              defaultHoverColor: '#fff',
              paddingInline: '10px',
              paddingBlock: '4px',
              borderRadius: 4,
              contentFontSize: 13,
            },
            Select: {
              optionActiveBg: '#6b7682',
              selectorBg: '#6b7682',
              activeBorderColor: '#6b7682',
              colorBorder: '#6b7682',
            },
            Tabs: {
              itemColor: '#0009',
              inkBarColor: '#00d1d1',
              itemActiveColor: '#00d1d1',
              titleFontSize: 20,
              boxShadowSecondary: ' 0px 0px 0px 2px #00d1d1',
              controlItemBgHover: '#00D1D1',
              itemSelectedColor: '#00D1D1',
              horizontalItemGutter: 60,
            },
          },
        }}
      >
        <div className='flex flex-col items-center justify-center flex-1 basis-[45%] w-[50%] h-full overflow-hidden'>
          <div className='w-full bg-[#2c3645] rounded-[20px] p-[20px] overflow-hidden relative h-full overflow-y-auto'>
            <div className='text-3xl mb-[6px]'>{t('尾箱装卸')}</div>
            {renderData?.map((row: any, index: number) => {
              return (
                <div key={'row' + index} className='flex gap-[10px]'>
                  {row?.map((item: any) => {
                    return (
                      <div
                        key={item.key}
                        className={`my-[6px] p-2 w-full border-box bg-[#d8d8d8] bg-opacity-20 rounded-lg items-start justify-between text-lg`}
                      >
                        <div>{item.label}</div>
                        <div className='flex gap-[10px] w-full justify-between'>
                          {item.sensorVisible ? (
                            <CustomSelect
                              size='small'
                              variant='standard'
                              value={updateHashMap[item.sensorKey]}
                              onChange={(event: any) => {
                                setUpdateHashMap({
                                  __isSubmit: true,
                                  [item.sensorKey]: event.target.value,
                                });
                              }}
                            >
                              {updateHashMap?.sensor_model_list?.map((name) => (
                                <MenuItem key={name} value={name}>
                                  <ListItemText primary={name} />
                                </MenuItem>
                              ))}
                            </CustomSelect>
                          ) : (
                            <div></div>
                          )}

                          <Button
                            size='small'
                            sx={{ color: 'white', whiteSpace: 'nowrap' }}
                            variant='contained'
                            onClick={async () => {
                              cancelAxios();
                              setModalConfig({
                                open: true,
                                key: item.key,
                              });
                            }}
                          >
                            {t('参数设置')}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            <div
              className={`my-[6px] px-2 py-3 w-full border-box bg-[#d8d8d8] bg-opacity-20 rounded-lg flex items-start justify-between text-lg`}
            >
              <div>{t('车厢货物状态管理')}</div>
              <Button
                size='small'
                sx={{ color: 'white', float: 'right', whiteSpace: 'nowrap' }}
                variant='contained'
                onClick={() => {
                  cancelAxios();
                  setModalConfig({
                    open: true,
                    key: 'cargo',
                  });
                }}
              >
                {t('参数设置')}
              </Button>
            </div>
          </div>
        </div>
        <SecondaryPage
          open={modalConfig?.open}
          setOpen={(open) => {
            setModalConfig({
              ...modalConfig,
              open,
            });
          }}
          fullScreen={true}
          background={'#445260'}
        >
          <SecondaryPaper>
            <LightTheme className='text-black'>
              <Suspense fallback={<span>loading modal</span>}>{template?.[modalConfig?.key] || '-'}</Suspense>
            </LightTheme>
          </SecondaryPaper>
        </SecondaryPage>
      </ConfigProvider>
    </>
  );
};

export default memo(TruckLoad);
