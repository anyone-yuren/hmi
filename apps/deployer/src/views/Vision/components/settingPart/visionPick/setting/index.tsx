import { memo, useEffect, useMemo } from 'react';

import { Button, Chip, createTheme, IconButton, ListItemText, MenuItem, TextField, ThemeProvider } from '@mui/material';

import MwConfirm from '@/views/Vision/components/MwConfirm';
import InputWidthKeyboard from '@/views/Vision/components/inputWithKeyboard';
import { config_agv_info } from '@/views/Vision/services/index';
import { translateStateToParams } from '@/views/Vision/utils';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import { useGetState, useRequest, useSetState, useUpdateEffect } from 'ahooks';
import { Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { getModelList, getVisionPickSetting, saveVisionPickSetting } from '../../../../services/index';
import { useVisionStore } from '../../../../store/vision.store';
import CustomSelect from '../../comp/customSelect';
import CustomSwitch from '../../comp/customSwitch';
import LoadingButton from '../../comp/loadingButton';
import PointCloudFilter from '../../comp/pointCloudFilter';
import PointCloudFilter2D from '../../comp/pointCloudFilter2D';
import TextChangeRow from '../../comp/textChangeRow';
import TextUpdateRow from '../../comp/textUpdateRow';
import Illustration from './illustration';
const Title = (props: any) => {
  return (
    <Divider style={{ borderColor: 'black' }} orientation='left'>
      <p className='text-xl text-[#000000b3]'>{props.children}</p>
    </Divider>
  );
};

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

const Setting = (props: any) => {
  const [, setInput, getInput] = useGetState();
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    __isInit: false,
    auto_para_tuning: false,
    // max_offset_value: [], // 分别对应左右，上下，前后、角度
    base_pallet_model_detect: true, // 模型列表是否启用
    pallet_model_list: [], //已经选择的模型列表
    compensation: {
      front: [],
      left: [],
      right: [],
    }, // 补偿参数,除了K车（四项穿）都用front，K车用left和right
    need_detect_height: false, // 进叉高度识别(托盘车不显示该参数)
    // start_mid_dist: 0, // 车身回正时基准点到托盘前表面的距离
    // end_mid_dist: 0, // 停车后基准点到托盘前表面的距离
    extra_height: 0, // 执行视觉任务额外抬升叉臂的高度(托盘车不显示该参数)
    base_pallet_model_detect_dist: false, // 使用不同进叉深度叉取不同托盘
    select_model: [],
    vision_move_vehicle_range_list: [], // 最大挪车次数
    forkarmhead_pallet_dis: 0,
    forkarmroot_pallet_dis: 0,
  });

  const { data: modelList } = useRequest(() => getModelList(), {});
  const {
    data: pickSetting,
    mutate: updatePickSetting,
    runAsync: getPickSetting,
  } = useRequest(() => getVisionPickSetting(), { manual: true });
  const { data: agvInfo }: any = useRequest(() => config_agv_info(), {});
  const vehicleChassis = useMemo(() => {
    if (agvInfo?.is_x20s) {
      return 'X20S';
    }
    const chassisHashMap: any = {
      1: 'STACKER',
      2: 'PALLET',
      3: 'FORWARD',
      9: 'BALANCE',
      13: 'TRILATERAL',
      14: 'OMNI_FORWARD',
    };
    const chassis = agvInfo ? agvInfo?.executor : 2;
    return chassisHashMap?.[chassis] || chassisHashMap?.[2];
  }, [agvInfo]);

  const { t } = useTranslation();
  const isMultiwayAgv = useMemo(() => {
    return false;
  }, []);

  const { visionPickSetting } = useVisionStore(
    useShallow((store: any) => ({
      visionPickSetting: store.visionPickSetting,
    })),
  );

  useEffect(() => {
    getPickSetting();
  }, []);

  useUpdateEffect(() => {
    toast.error(t('deployer.vision.visionChangeWarning'));
    updatePickSetting({ data: visionPickSetting });
    setUpdateHashMap({ __isInit: false });
    // const newParams = { ...visionPickSetting };
    // if (confirmVisible) return;
    // setConfirmVisible(true);
    // MwConfirm.confirm({
    //   title: t("提示") as string,
    //   content: <>视觉配置文件已经改变，是否覆盖当前页面</>,
    //   onOk: async () => {
    //     updatePickSetting({ data: newParams });
    //     setUpdateHashMap({ __isInit: false });
    //     setConfirmVisible(false);
    //   },executor_model
    // });
  }, [visionPickSetting]);

  const propsState = useMemo(() => {
    return pickSetting?.data;
  }, [pickSetting]);

  const modelHashMap = useMemo(() => {
    const hashMap: any = {};
    modelList?.data?.forEach((item: any) => {
      hashMap[item.id] = item.display_name || item.id;
    });
    return hashMap;
  }, [modelList]);

  // 判断是不是托盘车
  const vehicle = useMemo(() => {
    return {
      isPallet: vehicleChassis === 'PALLET',
      isTrilateral: vehicleChassis === 'TRILATERAL',
    };
  }, [vehicleChassis]);

  // const maxOffsetOptions = useMemo(() => {
  //   const options = [
  //     { title: t("左右"), index: 0 },
  //     { title: t("前后"), index: 1 },
  //     { title: t("上下"), index: 2 },
  //     { title: t("角度"), index: 3 },
  //   ];
  //   return vehicle?.isTrilateral
  //     ? options.filter((item) => {
  //         return [0, 1].includes(item.index);
  //       })
  //     : vehicle.isPallet
  //     ? options.filter((item: any) => item.index != 2)
  //     : options;
  // }, [vehicle]);

  const routeKeyOptions = useMemo(() => {
    const options = [
      // { title: t('deployer.vision.vehicleStartMidDist'), key: 'start_mid_dist' },
      // { title: t('deployer.vision.vehicleEndMidDist'), key: 'end_mid_dist' },
      { title: t('deployer.vision.extraForkLift'), key: 'extra_height' },
      { title: t('deployer.vision.forkDistancePallet'), key: 'forkarmhead_pallet_dis' },
      { title: t('deployer.vision.palletDistanceForksEnd'), key: 'forkarmroot_pallet_dis' },
    ];
    return vehicle?.isTrilateral
      ? options.filter((item: any) => item.key == 'extra_height')
      : vehicle.isPallet
        ? options.filter((item: any) => item.key != 'extra_height')
        : options;
  }, [vehicle]);

  useEffect(() => {
    if (!vehicleChassis || !propsState) {
      return;
    }
    if (!updateHashMap || updateHashMap.__isInit) {
      return;
    }
    const newObj = { ...updateHashMap };

    const translateHashMap: any = {
      compensation: (obj: any, value: string) => {
        const newValue = { ...obj };
        Object.keys(newValue).map((key) => {
          newValue[key] = propsState['compensation'][key]?.value;
        });
        return newValue;
      },
      select_model: (ary: any, value: string) => {
        // 初始化给新的
        const newValue: any = [];
        if (!propsState?.['select_model']) return [];
        Object?.keys(propsState?.['select_model']).map((key) => {
          newValue.push({
            name: key,
            value: propsState?.['select_model']?.[key]?.['value'],
          });
        });
        return newValue;
      },
    };

    Object.keys(newObj)
      .filter((key) => !(key.indexOf('__') > -1))
      .map((key) => {
        if (translateHashMap[key]) {
          newObj[key] = translateHashMap[key](newObj[key], propsState[key]?.value);
        } else {
          if (!propsState?.[key]) return;
          propsState[key]?.value && (newObj[key] = propsState[key]?.value);

          Object?.keys(propsState?.[key])?.length && (newObj[key] = propsState[key]?.value);
        }
      });
    newObj['__isInit'] = true;
    setUpdateHashMap(newObj);
  }, [propsState, updateHashMap, vehicleChassis]);

  const handleValue = (obj: any) => {
    const newValByKey = updateHashMap?.[obj?.key] || 0 + '';
    const updateByKey = (val: string) => {
      setUpdateHashMap({
        [obj.key]: val,
      });
    };

    // const newValByIndex = updateHashMap?.[obj?.key]?.[obj?.index] || 0 + "";
    // const updateValByIndex = (val: string) => {
    //   const newVal = [...updateHashMap[obj.key]];
    //   newVal[obj.index] = val;
    //   setUpdateHashMap({
    //     [obj.key]: newVal,
    //   });
    // };

    const newValByPath = updateHashMap?.[obj?.key]?.[obj.path]?.[obj?.index] || 0 + '';
    const updateValByPath = (val: string) => {
      const newVal = Array.isArray(updateHashMap[obj.key])
        ? [...updateHashMap[obj.key]]
        : { ...updateHashMap[obj.key] };
      newVal[obj.path][obj.index] = val;

      setUpdateHashMap({
        [obj.key]: newVal,
      });
    };

    const commonValidateRule = (val: number) => {
      let isPass = true;
      const validateParams = val;
      const min = propsState[obj.key].min;
      const max = propsState[obj.key].max;
      (validateParams > max || validateParams < min) && (isPass = false);
      !isPass && toast.error(t('deployer.vision.paramsValidateRange') + `[${min}-${max}]`);
      return isPass;
    };

    const hashMap: any = {
      initVal: {
        // max_offset_value: newValByIndex,
        compensation: newValByPath,
        start_mid_dist: newValByKey,
        end_mid_dist: newValByKey,
        extra_height: newValByKey,
        select_model: newValByPath,
        forkarmroot_pallet_dis: newValByKey,
        forkarmhead_pallet_dis: newValByKey,
      },
      update: {
        // max_offset_value: updateValByIndex,
        compensation: updateValByPath,
        start_mid_dist: updateByKey,
        end_mid_dist: updateByKey,
        extra_height: updateByKey,
        select_model: updateValByPath,
        forkarmroot_pallet_dis: updateByKey,
        forkarmhead_pallet_dis: updateByKey,
      },
      validate: {
        // 暂时先验证这些
        // max_offset_value: () => {
        //   return true;
        // },
        compensation: (val: number) => {
          let isPass = true;
          const validateParams = val;
          const min = propsState['compensation']?.[obj.path]?.min;
          const max = propsState['compensation']?.[obj.path]?.max;
          (validateParams > max || validateParams < min) && (isPass = false);
          !isPass && toast.error(t('deployer.vision.paramsValidateRange') + `[${min}-${max}]`);
          return isPass;
        },
        start_mid_dist: commonValidateRule,
        end_mid_dist: commonValidateRule,
      },
    };
    MwConfirm.confirm({
      title: obj.title,
      content: (
        <>
          {isMultiwayAgv ? (
            <InputWidthKeyboard
              input={hashMap.initVal[obj.key]}
              setInput={(val: any) => {
                setInput(val);
              }}
              placeholder={`${t('common.plsInput')}`}
              mode={'numbers'}
            ></InputWidthKeyboard>
          ) : (
            <TextField
              autoFocus
              fullWidth
              defaultValue={!hashMap.initVal[obj.key] ? '' : hashMap.initVal[obj.key]}
              onChange={(event) => {
                setInput(event.target.value as any);
              }}
            ></TextField>
          )}
        </>
      ),
      onOk: async () => {
        try {
          const val = getInput();
          const isValidate = hashMap.validate[obj.key] ? hashMap.validate[obj.key](Number(val)) : true;
          if (!isValidate) {
            return Promise.reject();
          }
          hashMap.update[obj.key](Number(val));
        } catch (err) {
          toast.error(t('deployer.vision.paramsValidateRange') + '[0-0]');
        }
      },
    });
  };

  const handleSave = async () => {
    const omitAry = ['compensation', 'select_model'];
    let params = { ...propsState };
    const newObj: any = {};
    Object.keys(updateHashMap)
      .filter((key: string) => !(key.indexOf('__') > -1))
      .filter((key: string) => !omitAry.includes(key))
      .map((key) => {
        newObj[key] = updateHashMap[key];
      });
    params = translateStateToParams(params, newObj);

    Object.keys(updateHashMap['compensation'])?.forEach((key: string) => {
      params['compensation'][key].value = updateHashMap['compensation'][key];
    });
    const selectModelObj: any = {};
    updateHashMap?.['select_model']?.forEach((item: any) => {
      selectModelObj[item.name] = {
        max: 500,
        min: -500,
        type: 'int',
        value: item.value,
      };
    });
    params['select_model'] = selectModelObj;

    await saveVisionPickSetting(params);
    toast.success(t('common.actionSuccess'));
    // props?.['__open'] && props?.['__open'](false);
  };

  return (
    <div>
      <div className='text-black h-full flex gap-[10px]'>
        <LightTheme>
          <div className='w-[350px] '>
            <TextUpdateRow>
              <div>{t('deployer.vision.autoSetting')}</div>
              <div>
                <CustomSwitch
                  checked={updateHashMap['auto_para_tuning']}
                  onChange={(event: any) => {
                    setUpdateHashMap({
                      auto_para_tuning: event.target.checked,
                    });
                  }}
                />
              </div>
            </TextUpdateRow>
            {/* <div className='flex gap-[8px] justify-between'> */}
            <PointCloudFilter type={'pick_pallet_position_detect'}></PointCloudFilter>
            <div className='h-[12px]'></div>
            <PointCloudFilter2D type={'pick_pallet_position_detect'}></PointCloudFilter2D>
            {/* </div> */}

            {/* <Title>{t("载具最大偏移阈值")}</Title>
            {maxOffsetOptions.map((item: any) => {
              return (
                <TextUpdateRow
                  key={item.title}
                  onClick={() => {
                    handleValue({
                      key: "max_offset_value",
                      title: item.title,
                      index: item.index,
                    });
                  }}
                >
                  <div>{item.title}</div>
                  <div>
                    {updateHashMap["max_offset_value"]?.[item.index] || 0}
                  </div>
                </TextUpdateRow>
              );
            })} */}

            <Title>{t('deployer.vision.modelList')}</Title>
            <TextUpdateRow>
              <div>{t('deployer.vision.isTurnOn')}</div>
              <div>
                <CustomSwitch
                  checked={updateHashMap['base_pallet_model_detect']}
                  onChange={(event: any) => {
                    setUpdateHashMap({
                      base_pallet_model_detect: event.target.checked,
                    });
                  }}
                />
              </div>
            </TextUpdateRow>
            {updateHashMap['base_pallet_model_detect'] && (
              <TextUpdateRow>
                <div>{t('deployer.vision.model')}</div>
                <div className='relative'>
                  <CustomSelect
                    multiple
                    variant='standard'
                    value={updateHashMap?.pallet_model_list}
                    renderValue={(value: any) => {
                      return (
                        <div className='flex flex-wrap'>
                          {value?.map((item: any, index: number) => {
                            return (
                              <Chip
                                key={item.id + (index + '')}
                                className='mt-1 mr-10'
                                label={modelHashMap?.[item] || '-'}
                                size='small'
                              />
                            );
                          })}
                        </div>
                      );
                    }}
                    onChange={(event: any) => {
                      setUpdateHashMap({
                        pallet_model_list: event.target.value,
                        select_model: [],
                      });
                    }}
                  >
                    {modelList?.data?.map((item: any) => (
                      <MenuItem
                        key={item.id}
                        value={item.id}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#00d1d1ad', // 修改选中项的背景色
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: '#00d1d1ad', // 修改选中项的背景色
                          },
                        }}
                      >
                        <ListItemText primary={item.display_name || item.id} />
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {updateHashMap['pallet_model_list']?.length > 0 && (
                    <IconButton
                      onClick={() => {
                        setUpdateHashMap({
                          pallet_model_list: [],
                          select_model: [],
                        });
                      }}
                      style={{
                        position: 'absolute',
                        right: 20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </div>
              </TextUpdateRow>
            )}
            {!vehicle?.isTrilateral ? (
              <>
                <Title>{t('deployer.vision.compensationParams')}</Title>
                {[
                  { title: t('deployer.vision.swayCompensation'), index: 0 },
                  { title: t('deployer.vision.aroundCompensation'), index: 2 },
                  { title: t('deployer.vision.angleCompensation'), index: 3 },
                ].map((item: any) => {
                  return (
                    <TextUpdateRow
                      key={item.title}
                      onClick={() => {
                        handleValue({
                          key: 'compensation',
                          path: 'front',
                          title: item.title,
                          index: item.index,
                        });
                      }}
                    >
                      <div>{item.title}</div>
                      <div>{updateHashMap['compensation']['front']?.[item.index] || 0}</div>
                    </TextUpdateRow>
                  );
                })}

                {!vehicle?.isPallet && (
                  <TextUpdateRow>
                    <div>{t('deployer.vision.inForkHeightDetect')}</div>
                    <div>
                      <CustomSwitch
                        checked={updateHashMap['need_detect_height']}
                        onChange={(event: any) => {
                          setUpdateHashMap({
                            need_detect_height: event.target.checked,
                          });
                        }}
                      />
                    </div>
                  </TextUpdateRow>
                )}

                {!vehicle?.isPallet && updateHashMap['need_detect_height'] && (
                  <TextUpdateRow
                    onClick={() => {
                      handleValue({
                        key: 'compensation',
                        path: 'front',
                        title: t('deployer.vision.heightCompensation'),
                        index: 1,
                      });
                    }}
                  >
                    <div>{t('deployer.vision.heightCompensation')}</div>
                    <div>{updateHashMap['compensation']?.['front']?.[1] || 0}</div>
                  </TextUpdateRow>
                )}
              </>
            ) : (
              <>
                {[
                  { title: t('deployer.vision.leftCompensation'), key: 'left' },
                  { title: t('deployer.vision.rightCompensation'), key: 'right' },
                ]?.map((row: any) => {
                  return (
                    <>
                      <Title>{row.title}</Title>
                      {[
                        { title: t('deployer.vision.aroundVehicleCompensation'), index: 0 },
                        { title: t('deployer.vision.forkExtendDistCompensation'), index: 2 },
                      ]?.map((item: any) => {
                        return (
                          <TextUpdateRow
                            onClick={() => {
                              handleValue({
                                key: 'compensation',
                                title: item.title,
                                path: row.key,
                                index: item.index,
                              });
                            }}
                          >
                            <div>{item.title}</div>
                            <div>{updateHashMap?.['compensation']?.[row.key]?.[item.index] || 0}</div>
                          </TextUpdateRow>
                        );
                      })}
                    </>
                  );
                })}
              </>
            )}

            <Title>{t('deployer.vision.pathPlanning')}</Title>
            {routeKeyOptions.map((item: any) => {
              return (
                <TextUpdateRow
                  key={item.key}
                  onClick={() => {
                    handleValue({
                      key: item.key,
                      title: item.title,
                    });
                  }}
                >
                  <div>{item.title}</div>
                  <div>{updateHashMap[item.key] || 0}</div>
                </TextUpdateRow>
              );
            })}

            {/* <TextUpdateRow
              onChange={(event: any) => {
                setUpdateHashMap({
                  forkarmroot_pallet_dis: event.target.checked,
                });
              }}
            >
              <div>{t('deployer.vision.forkDistancePallet')}</div>
              <div>{updateHashMap['forkarmroot_pallet_dis']}</div>
            </TextUpdateRow>

            <TextUpdateRow
              onChange={(event: any) => {
                setUpdateHashMap({
                  forkarmhead_pallet_dis: event.target.checked,
                });
              }}
            >
              <div>{t('deployer.vision.palletDistanceForksEnd')}</div>
              <div>{updateHashMap['forkarmhead_pallet_dis']}</div>
            </TextUpdateRow> */}

            {false && (
              <TextUpdateRow>
                <div>{t('deployer.vision.forkWidthPallet')}</div>
                <div>
                  <CustomSwitch
                    checked={updateHashMap['base_pallet_model_detect_dist']}
                    onChange={(event: any) => {
                      setUpdateHashMap({
                        base_pallet_model_detect_dist: event.target.checked,
                      });
                    }}
                  />
                </div>
              </TextUpdateRow>
            )}

            {false && updateHashMap['base_pallet_model_detect_dist'] && (
              <>
                <Title>{t('deployer.vision.aroundOffset')}</Title>
                <TextUpdateRow>
                  <div>{t('deployer.vision.modelSelect')}</div>
                  <div>
                    <div className='relative'>
                      <CustomSelect
                        multiple
                        variant='standard'
                        value={[...updateHashMap.select_model?.map((item: any) => item.name)]}
                        renderValue={(value: any) => {
                          return (
                            <div className='flex flex-wrap'>
                              {value?.map((item: any) => {
                                return (
                                  <Chip
                                    className='mt-1 mr-10'
                                    key={item}
                                    label={modelHashMap?.[item] || '-'}
                                    size='small'
                                  />
                                );
                              })}
                            </div>
                          );
                        }}
                        onChange={(event: any) => {
                          const oldAry = [...updateHashMap['select_model']];
                          const oldObj: any = {};
                          oldAry.forEach((item: any) => {
                            oldObj[item.name] = item.value;
                          });

                          const newAry = event.target.value?.map((item: string) => {
                            return {
                              name: item,
                              value: oldObj[item] || 0,
                            };
                          });

                          setUpdateHashMap({
                            select_model: newAry,
                          });
                        }}
                      >
                        {updateHashMap?.['pallet_model_list']?.map((name: string) => (
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
                            {<ListItemText primary={modelHashMap?.[name] || '-'} />}
                          </MenuItem>
                        ))}
                        {!updateHashMap?.['pallet_model_list']?.length && (
                          <MenuItem disabled key={'none'} value={'none'}>
                            <ListItemText primary={t('deployer.vision.plsSelectModel')} />
                          </MenuItem>
                        )}
                      </CustomSelect>
                      {updateHashMap['select_model'].length > 0 && (
                        <IconButton
                          onClick={() => {
                            setUpdateHashMap({
                              select_model: [],
                            });
                          }}
                          style={{
                            position: 'absolute',
                            right: 20,
                            top: '50%',
                            transform: 'translateY(-50%)',
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      )}
                    </div>
                  </div>
                </TextUpdateRow>
              </>
            )}

            {false &&
              updateHashMap['base_pallet_model_detect_dist'] &&
              updateHashMap?.['select_model']?.map((item: any, index: number) => {
                return (
                  <TextUpdateRow
                    key={item.name}
                    onClick={() => {
                      handleValue({
                        key: 'select_model',
                        title: modelHashMap[item.name],
                        path: index,
                        index: 'value',
                      });
                    }}
                  >
                    <div>{modelHashMap[item.name] || '-'}</div>
                    <div>{item.value}</div>
                  </TextUpdateRow>
                );
              })}
            {vehicle.isTrilateral && (
              <>
                <Title>{t('deployer.vision.maxMoveVehicleTime')}</Title>
                {updateHashMap?.['vision_move_vehicle_range_list']?.map((item: any, index: number) => {
                  return (
                    <div key={'vision_move_vehicle_range_list' + index} className='flex'>
                      <div className='flex-1'>
                        <TextChangeRow
                          key={'vision_move_vehicle_range_list' + index}
                          title={t('deployer.vision.minMoveVehicleThreshold') + (index + 1)}
                          value={item}
                          onChange={(value: string) => {
                            const list = updateHashMap?.['vision_move_vehicle_range_list'];
                            list[index] = Number(value);
                            setUpdateHashMap({
                              vision_move_vehicle_range_list: list,
                            });
                          }}
                        >
                          <div>{item || 0}</div>
                        </TextChangeRow>
                      </div>
                      <div
                        className='flex items-center justify-center'
                        onClick={() => {
                          const list = updateHashMap?.['vision_move_vehicle_range_list'];
                          list.splice(index, 1);
                          setUpdateHashMap({
                            vision_move_vehicle_range_list: list,
                          });
                        }}
                      >
                        <CloseIcon fontSize={'medium'}></CloseIcon>
                      </div>
                    </div>
                  );
                })}
                <Button
                  fullWidth
                  variant='contained'
                  sx={{ color: 'white', marginBottom: '40px' }}
                  onClick={() => {
                    const list = updateHashMap?.['vision_move_vehicle_range_list'];
                    list.push(0);
                    setUpdateHashMap({
                      vision_move_vehicle_range_list: list,
                    });
                  }}
                >
                  {t('common.add')}
                </Button>
              </>
            )}

            <LoadingButton
              fullWidth
              variant='contained'
              sx={{ color: 'white', marginBottom: '40px' }}
              onPress={handleSave}
            >
              {t('common.save')}
            </LoadingButton>
          </div>

          <Illustration vehicleChassis={vehicleChassis}></Illustration>
        </LightTheme>
      </div>
    </div>
  );
};

export default memo(Setting);
