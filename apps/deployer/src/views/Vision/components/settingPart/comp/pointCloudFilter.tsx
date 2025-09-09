import { Button, ListItemText, MenuItem, Slider, TextField } from '@mui/material';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SecondaryPage, { SecondaryPaper } from '../../SecondaryPage';
import LightTheme from './lightTheme';
import TextUpdateRow from './textUpdateRow';

import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  getPointCloudMonitoringBack,
  getPointCloudMonitoringRead,
  postPointCloudMonitoringSave,
  postPointCloudMonitoringWrite,
} from '../../../services/index';
import { useVisionStore } from '../../../store/vision.store';
import MwConfirm from '../../MwConfirm';
import InputWidthKeyboard from '../../inputWithKeyboard';
import PointCloud3D from '../3d/pointCloud3d';

import { EditOutlined } from '@ant-design/icons';
import { Tab, Tabs } from '@mui/material';
import { useAsyncEffect, useGetState, useRequest, useThrottleEffect, useUpdateEffect } from 'ahooks';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import CustomSelect from './customSelect';
import LongPressIconButton from './longPressIconButton';

interface IProps {
  type: string;
  background?: string;
  titleColor?: string;
}

let timer: any = null;
const PointCloudFilter = (props: IProps) => {
  const { type, background, titleColor } = props;
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState(0); // 模式为一个单独的参数来控制
  const [inputString, setInputString, getInputString] = useGetState('');
  const {
    data: pointCloudResponse,
    runAsync: getPointCloudResponse,
    error,
  } = useRequest(getPointCloudMonitoringRead, {
    manual: true,
  });
  const [state, setState, getState] = useGetState<any>({
    front: {
      label: t('deployer.vision.frontDetectDist'),
      value: 0,
      keyIndex: 0,
      index: 1,
    },
    back: {
      label: t('deployer.vision.backDetectDist'),
      value: 0,
      keyIndex: 0,
      index: 0,
    },
    left: {
      label: t('deployer.vision.leftDetectDist'),
      value: 0,
      keyIndex: 1,
      index: 0,
    },
    right: {
      label: t('deployer.vision.rightDetectDist'),
      value: 0,
      keyIndex: 1,
      index: 1,
    },
    top: {
      label: t('deployer.vision.topDetectDist'),
      value: 0,
      keyIndex: 2,
      index: 1,
    },
    down: {
      label: t('deployer.vision.bottomDetectDist'),
      value: 0,
      keyIndex: 2,
      index: 0,
    },
  });
  const intervalRef = useRef<any>(null);
  const { setPointCloudParams, setPointsCloudHeart, setPointsCloudKey } = useVisionStore(
    useShallow((store: any) => ({
      setPointCloudParams: store.setPointCloudParams,
      setPointsCloudHeart: store.setPointsCloudHeart,
      setPointsCloudKey: store.setPointsCloudKey,
    })),
  );
  console.log('[shelf]: type', type);

  const showStorageCalibrationAssistant = useMemo(() => {
    const ary = ['stack_pallet_position_detect', 'shelf_place_move_vehicle', 'stack_place_move_vehicle'];
    return ary.includes(type);
  }, [type]);

  const isMultiwayAgv = useMemo(() => {
    return false;
  }, []);

  useEffect(() => {
    setPointsCloudKey(type);
  }, [type]);

  const hashMap = {
    0: type,
    1: 'location_calibration_assistant',
  };

  const pointCloudFilterParams = useMemo(() => {
    return [
      [state?.front?.value, state?.back?.value],
      [state?.left?.value, state?.right?.value],
      [state?.top?.value, state?.down?.value],
    ];
  }, [state]);

  const initParams = useMemo(() => {
    if (pointCloudResponse?.data) {
      let initState: any = {};
      Object.keys(state).map((key: string) => {
        const keyIndex = state?.[key]?.keyIndex;
        const oIndex = state?.[key]?.index;
        const value = pointCloudResponse?.data?.select_dist?.value?.[0]?.[keyIndex]?.[oIndex];
        initState[key] = {
          ...state[key],
          value,
        };
      });
      setState(initState);
      setMode(pointCloudResponse?.data?.is_select?.value);
    }
    return pointCloudResponse?.data || {};
  }, [pointCloudResponse]);

  const validateRange = useMemo(() => {
    return {
      max: initParams?.select_dist?.max || 4000,
      min: initParams?.select_dist?.min || -4000,
    };
  }, [initParams]);

  useAsyncEffect(async () => {
    if (open) {
      getPointCloudResponse({ task_id: type });
      timer = setInterval(() => {
        setPointsCloudHeart(new Date().getTime());
      }, 2000);
    }
  }, [open]);

  useUpdateEffect(() => {
    if (!open) {
      getPointCloudMonitoringBack();
      clearInterval(timer);
      setPointsCloudHeart(0);
    }
  }, [open]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      setPointsCloudHeart(0);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      setPointsCloudHeart(0);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useThrottleEffect(
    () => {
      if (!pointCloudResponse || !Object.keys(pointCloudResponse.data).length) return;
      const val = { ...pointCloudResponse.data };
      if (!val.select_dist) return;
      val.select_dist.value[0] = pointCloudFilterParams;
      setPointCloudParams(val);
    },
    [pointCloudFilterParams, pointCloudResponse],
    {
      wait: 200,
    },
  );

  const validateParams = (params: any) => {
    if (!initParams?.select_dist) {
      toast.error(t('deployer.vision.missParamsTips'));
      return Promise.reject();
    }
    const newParams = {
      ...params,
      is_select: {
        ...params.is_select,
        value: mode,
      },
      select_dist: {
        ...params?.select_dist,
        value: [pointCloudFilterParams],
      },
    };
    return Promise.resolve(newParams);
  };

  const handleParamsWrite = async () => {
    const params = await validateParams(initParams);
    await postPointCloudMonitoringWrite(params);
    toast.success(t('common.actionSuccess'));
  };

  const handleParamsSave = async () => {
    const params = await validateParams(initParams);
    await postPointCloudMonitoringSave(params);
    toast.success(t('common.actionSuccess'));
  };

  const handleDelPress = useCallback(
    (key: string) => {
      const newState = getState();
      const origin = newState?.[key]?.value;
      const value = origin - 10;
      if (value < validateRange.min) {
        toast.error(t('deployer.vision.paramsValidateRange') + `[${validateRange.min}-${validateRange.max}]`);
        handleMouseUp();
        return;
      }
      setState({
        ...newState,
        [key]: {
          ...newState?.[key],
          value,
        },
      });
    },
    [validateRange],
  );
  const handleAddPress = useCallback(
    (key: string) => {
      const newState = getState();
      const origin = newState?.[key]?.value;
      const value = origin + 10;
      if (value > validateRange.max) {
        toast.error(t('deployer.vision.paramsValidateRange') + `[${validateRange.min}-${validateRange.max}]`);
        handleMouseUp();
        return;
      }
      setState({
        ...newState,
        [key]: {
          ...newState?.[key],
          value,
        },
      });
    },
    [validateRange],
  );

  const handleDoubleClick = (params: any) => {
    const { key } = params;
    const newState = getState();
    MwConfirm.confirm({
      title: newState?.[key]?.label,
      content: (
        <>
          {isMultiwayAgv ? (
            <InputWidthKeyboard
              input={getInputString()}
              setInput={(val: any) => {
                setInputString(val);
              }}
              placeholder={`${t('common.plsInput')}`}
              mode={'numbers'}
            ></InputWidthKeyboard>
          ) : (
            <TextField
              fullWidth
              autoFocus
              defaultValue={newState?.[key]?.value ? '' : newState?.[key]?.value}
              onChange={(event) => {
                setInputString(event.target.value);
              }}
            ></TextField>
          )}
        </>
      ),
      onOk: async () => {
        const value = Number(getInputString());
        if (value < validateRange.min || value > validateRange.max) {
          toast.error(t('deployer.vision.paramsValidateRange') + `[${validateRange.min}-${validateRange.max}]`);
          return Promise.reject();
        }
        setState({
          ...newState,
          [key]: {
            ...newState?.[key],
            value,
          },
        });
      },
    });
  };

  const handleMouseUp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    getPointCloudResponse({ task_id: hashMap[newValue] });
  };

  return (
    <div>
      <Button
        fullWidth
        variant='contained'
        sx={{ color: 'white' }}
        onClick={() => {
          setOpen(true);
        }}
      >
        {t('deployer.vision.pointsCloud')}
      </Button>
      <SecondaryPage
        open={open}
        setOpen={setOpen}
        fullScreen={true}
        background={background || '#162640'}
        titleColor={titleColor}
      >
        <SecondaryPaper>
          {open && (
            <LightTheme>
              <div className='flex text-black h-full'>
                <div className='w-[350px] h-full overflow-auto'>
                  {showStorageCalibrationAssistant && (
                    <Tabs value={value} onChange={handleChange} variant='fullWidth'>
                      <Tab label={t('deployer.vision.other')} iconPosition='end' />
                      <Tab label={t('deployer.vision.storageCalibration')} iconPosition='end' />
                    </Tabs>
                  )}
                  {!error || true ? (
                    <>
                      {Object.keys(state)?.map((key: string) => {
                        return (
                          <TextUpdateRow key={key} className='flex-col py-2'>
                            <div className='flex justify-between w-full relative z-10'>
                              <div>{state?.[key]?.label || '-'}</div>
                              <div className='flex gap-[5px] align-bottom'>
                                <div
                                  onDoubleClick={() => {
                                    handleDoubleClick({
                                      label: state?.[key]?.label,
                                      key,
                                    });
                                  }}
                                >
                                  {state?.[key]?.value || 0}
                                </div>
                                <div
                                  className='text-[blue] text-[12px] flex items-center justify-center'
                                  onClick={() => {
                                    handleDoubleClick({
                                      label: state?.[key]?.label,
                                      key,
                                    });
                                  }}
                                >
                                  {/* {t('common.edit')} */}
                                  <EditOutlined style={{ fontSize: 18 }} />
                                </div>
                              </div>
                            </div>
                            <div className='flex w-full'>
                              <LongPressIconButton
                                typeKey={key}
                                onLongPressEnd={handleMouseUp}
                                onLongPress={(key) => {
                                  intervalRef.current = setInterval(() => {
                                    handleDelPress(key);
                                  }, 200);
                                }}
                                onPress={handleDelPress}
                              >
                                <RemoveCircleOutlineIcon sx={{ color: 'black', fontSize: '25px' }} />
                              </LongPressIconButton>
                              <div className='flex-1 relative flex'>
                                <Slider
                                  className='relative z-[2]'
                                  aria-label={key}
                                  value={state?.[key]?.value}
                                  step={1}
                                  min={validateRange.min}
                                  max={validateRange.max}
                                  onChange={(event: any) => {
                                    setState({
                                      ...state,
                                      [key]: {
                                        ...state?.[key],
                                        value: event.target.value,
                                      },
                                    });
                                  }}
                                />
                                <div className='flex justify-between w-full text-[12px] absolute bottom-[-8px] z-[1]'>
                                  <div>{validateRange.min}</div>
                                  <div>{validateRange.max}</div>
                                </div>
                              </div>
                              <LongPressIconButton
                                typeKey={key}
                                onLongPressEnd={handleMouseUp}
                                onLongPress={(key) => {
                                  intervalRef.current = setInterval(() => {
                                    handleAddPress(key);
                                  }, 200);
                                }}
                                onPress={handleAddPress}
                              >
                                <ControlPointIcon sx={{ color: 'black', fontSize: '25px' }} />
                              </LongPressIconButton>
                            </div>
                          </TextUpdateRow>
                        );
                      })}
                      <TextUpdateRow>
                        <div>{t('deployer.vision.mode')}</div>
                        <div className='relative'>
                          <CustomSelect
                            size={'small'}
                            variant='standard'
                            value={mode}
                            onChange={(event) => {
                              setMode(event.target.value);
                            }}
                          >
                            <MenuItem value={0}>
                              <ListItemText primary={t('deployer.vision.backgroundOff')} />
                            </MenuItem>
                            <MenuItem value={1}>
                              <ListItemText primary={t('deployer.vision.targetSelect')} />
                            </MenuItem>
                            {showStorageCalibrationAssistant && (
                              <MenuItem value={2}>
                                <ListItemText primary={t('deployer.vision.forkUpPointCloud')} />
                              </MenuItem>
                            )}
                          </CustomSelect>
                        </div>
                      </TextUpdateRow>
                      <Button
                        fullWidth
                        variant='contained'
                        sx={{ color: 'white', marginBottom: '10px' }}
                        onClick={handleParamsWrite}
                      >
                        {t('deployer.vision.paramsWrite')}
                      </Button>
                      <Button
                        fullWidth
                        variant='contained'
                        sx={{ color: 'white', marginBottom: '20px' }}
                        onClick={handleParamsSave}
                      >
                        {t('deployer.vision.paramsSave')}
                      </Button>
                    </>
                  ) : (
                    <div className='w-full text-center mt-10'>{t('common.http.error')}</div>
                  )}
                </div>
                <div className='flex-1 p-4 h-full'>
                  <PointCloud3D params={pointCloudFilterParams}></PointCloud3D>
                </div>
              </div>
            </LightTheme>
          )}
        </SecondaryPaper>
      </SecondaryPage>
    </div>
  );
};

export default memo(PointCloudFilter);
