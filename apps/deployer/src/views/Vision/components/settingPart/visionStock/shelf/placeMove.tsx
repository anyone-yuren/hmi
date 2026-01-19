import { useSetState } from 'ahooks';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useVisionStore } from '@/views/Vision/store/vision.store';
import CloseIcon from '@mui/icons-material/Close';
import { useShallow } from 'zustand/react/shallow';
import { postShelfPlaceMoveVehicleSave as save } from '../../../../services/index';
import LoadingButton from '../../comp/loadingButton';
import ModelListSelect from '../../comp/modelListSelect';
import PointCloudFilter from '../../comp/pointCloudFilter';
import StorageListSelect from '../../comp/storageListSelect';
import TextChangeRow from '../../comp/textChangeRow';
import TextUpdateSwitchRow from '../../comp/textUpdateSwitchRow';
import Title from '../../comp/title';
import Illustration from './illustration';
interface IProps {
  initState: Record<string, any>;
  getResponse: () => void;
}
// 货架设置
const PlaceMove = (props: IProps) => {
  const { initState, getResponse } = props;

  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    auto_para_tuning: false, // 自动调参
    need_detect: false,
    extra_height: 0,
    pallet_model_list: [],
    compensation: {
      front: {
        offset_x: [],
        offset_y: [],
      },
      left: {
        offset_x: [],
        offset_y: [],
      }, // K车左侧取货补偿参数: 第一个参数表示“前后挪车补偿”，第三个参数表示“叉臂伸出距离补偿”,其余参数无效
      right: {
        offset_x: [],
        offset_y: [],
      }, // K车右侧取货补偿参数: 第一个参数表示“前后挪车补偿”，第三个参数表示“叉臂伸出距离补偿”,其余参数无效
    },
    ground_transfer_points: [], // 地面接驳位
    vision_move_vehicle_range_list: [], // 最大挪车次数
  });
  const { t } = useTranslation();

  const { isTrilateral } = useVisionStore(
    useShallow((store: any) => ({
      isTrilateral: store.isTrilateral,
    })),
  );

  const changeUpdateHashMap = (key: string, value: any) => {
    setUpdateHashMap({
      [key]: value,
    });
  };

  useEffect(() => {
    // 将参数转化为useState里面去
    if (!initState || !Object.keys(initState).length) return;
    const tempHashMap = { ...updateHashMap };
    const translateHashMap: any = {
      compensation: (originState: any) => {
        const obj: any = {
          front: {
            offset_x: originState?.['compensation']?.['front']?.['offset_x']?.value,
            offset_y: originState?.['compensation']?.['front']?.['offset_y']?.value,
          },
          left: {
            offset_x: originState?.['compensation']?.['left']?.['offset_x']?.value,
            offset_y: originState?.['compensation']?.['left']?.['offset_y']?.value,
          },
          right: {
            offset_x: originState?.['compensation']?.['right']?.['offset_x']?.value,
            offset_y: originState?.['compensation']?.['right']?.['offset_y']?.value,
          },
        };
        return obj;
      },
    };
    Object.keys(initState).forEach((key: string) => {
      if (tempHashMap[key] !== undefined) {
        tempHashMap[key] = translateHashMap[key] ? translateHashMap[key](initState) : initState[key]?.value;
      }
    });
    setUpdateHashMap(tempHashMap);
  }, [initState]);

  return (
    <>
      <div className='flex'>
        <div className='w-[350px]'>
          <TextUpdateSwitchRow
            title={t('deployer.vision.autoSetting')}
            checked={updateHashMap['auto_para_tuning']}
            onChange={(checked: boolean) => {
              changeUpdateHashMap('auto_para_tuning', checked);
            }}
          />
          <TextUpdateSwitchRow
            title={t('deployer.vision.isTurnOn')}
            checked={updateHashMap['need_detect']}
            onChange={(checked: boolean) => {
              changeUpdateHashMap('need_detect', checked);
            }}
          />

          <StorageListSelect
            title={t('deployer.vision.groundTransferStorage')}
            value={updateHashMap?.['ground_transfer_points']}
            onChange={(value: any) => {
              changeUpdateHashMap('ground_transfer_points', value);
            }}
          ></StorageListSelect>

          <PointCloudFilter type={'shelf_place_move_vehicle'}></PointCloudFilter>

          <Title>{t('deployer.vision.model')}</Title>
          <ModelListSelect
            value={updateHashMap?.pallet_model_list}
            onChange={(value: any) => {
              changeUpdateHashMap('pallet_model_list', value);
            }}
          ></ModelListSelect>

          {isTrilateral() ? (
            <>
              {[
                {
                  title: t('deployer.vision.leftCompensation'),
                  key: 'left',
                  children: [
                    { title: t('deployer.vision.swayCompensation'), key: 'offset_x', index: 0 },
                    { title: t('deployer.vision.aroundCompensation'), key: 'offset_y', index: 0 },
                  ],
                },
                {
                  title: t('deployer.vision.rightCompensation'),
                  key: 'right',
                  children: [
                    { title: t('deployer.vision.swayCompensation'), key: 'offset_x', index: 0 },
                    { title: t('deployer.vision.aroundCompensation'), key: 'offset_y', index: 0 },
                  ],
                },
              ].map((row: any) => {
                return (
                  <div key={row.key}>
                    <Title>{row.title}</Title>
                    {row.children?.map((item: any) => {
                      return (
                        <TextChangeRow
                          title={item.title}
                          value={updateHashMap?.['compensation']?.[row?.key]?.[item?.key]?.[item?.index]}
                          validateRange={[
                            initState?.['compensation']?.[row.key]?.[item.key]?.min,
                            initState?.['compensation']?.[row.key]?.[item.key]?.max,
                          ]}
                          onChange={(value: string) => {
                            const val = updateHashMap?.['compensation']?.[row?.key]?.[item?.key];
                            val[item?.index] = Number(value);
                            setUpdateHashMap({
                              ...updateHashMap,
                              compensation: {
                                ...updateHashMap['compensation'],
                                [row?.key]: {
                                  ...updateHashMap['compensation'][row?.key],
                                  [item?.key]: val,
                                },
                              },
                            });
                          }}
                        >
                          <div>{updateHashMap?.['compensation']?.[row?.key]?.[item?.key]?.[item.index] || 0}</div>
                        </TextChangeRow>
                      );
                    })}
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <Title>{t('deployer.vision.placeCompensation')}</Title>
              {[
                { title: t('deployer.vision.swayCompensation'), key: 'offset_x', index: 0 },
                { title: t('deployer.vision.aroundCompensation'), key: 'offset_y', index: 0 },
              ].map((item: any) => {
                return (
                  <TextChangeRow
                    title={item.title}
                    value={updateHashMap?.['compensation']?.['front']?.[item.key]?.[item.index]}
                    validateRange={[
                      initState?.['compensation']?.['front']?.[item.key]?.min,
                      initState?.['compensation']?.['front']?.[item.key]?.max,
                    ]}
                    onChange={(value: string) => {
                      const val = updateHashMap?.['compensation']?.['front']?.[item.key];
                      val[item.index] = Number(value);
                      setUpdateHashMap({
                        ...updateHashMap,
                        compensation: {
                          ...updateHashMap?.['compensation'],
                          left: {
                            ...updateHashMap?.['compensation']?.['front'],
                            [item?.key]: val,
                          },
                        },
                      });
                    }}
                  >
                    <div>{updateHashMap?.['compensation']?.['front']?.[item.key]?.[item.index] || 0}</div>
                  </TextChangeRow>
                );
              })}
            </>
          )}

          <TextChangeRow
            title={t('deployer.vision.extraForkLift')}
            value={updateHashMap?.['extra_height']}
            onChange={(value: string) => {
              changeUpdateHashMap('extra_height', value);
            }}
          >
            <div>{updateHashMap?.['extra_height'] || 0}</div>
          </TextChangeRow>
          {isTrilateral() && (
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
                          changeUpdateHashMap('vision_move_vehicle_range_list', list);
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
                        changeUpdateHashMap('vision_move_vehicle_range_list', list);
                      }}
                    >
                      <CloseIcon fontSize={'medium'}></CloseIcon>
                    </div>
                  </div>
                );
              })}
              <LoadingButton
                fullWidth
                variant='contained'
                sx={{ color: 'white', marginBottom: '40px' }}
                onPress={() => {
                  const list = updateHashMap?.['vision_move_vehicle_range_list'];
                  list.push(0);
                  changeUpdateHashMap('vision_move_vehicle_range_list', list);
                }}
              >
                {t('common.add')}
              </LoadingButton>
            </>
          )}

          <LoadingButton
            fullWidth
            variant='contained'
            sx={{ color: 'white', marginBottom: '40px' }}
            onPress={async () => {
              let sendState: any = {};
              const translateHashMap: any = {
                compensation: (originState: any, hashMap: any) => {
                  const obj = {
                    ...originState['compensation'],
                    font: {
                      ...originState['compensation']['front'],
                      offset_x: {
                        ...originState['compensation']['front']['offset_x'],
                        value: hashMap['compensation']['front']['offset_x'],
                      },
                      offset_y: {
                        ...originState['compensation']['front']['offset_y'],
                        value: hashMap['compensation']['front']['offset_y'],
                      },
                    },
                    left: {
                      ...originState['compensation']['left'],
                      offset_x: {
                        ...originState['compensation']['left']['offset_x'],
                        value: hashMap['compensation']['left']['offset_x'],
                      },
                      offset_y: {
                        ...originState['compensation']['left']['offset_y'],
                        value: hashMap['compensation']['left']['offset_y'],
                      },
                    },
                    right: {
                      ...originState['compensation']['right'],
                      offset_x: {
                        ...originState['compensation']['right']['offset_x'],
                        value: hashMap['compensation']['right']['offset_x'],
                      },
                      offset_y: {
                        ...originState['compensation']['right']['offset_y'],
                        value: hashMap['compensation']['right']['offset_y'],
                      },
                    },
                  };
                  return obj;
                },
              };
              const numberAry = ['uint', 'int'];
              Object.keys(initState).forEach((key) => {
                sendState[key] = translateHashMap[key]
                  ? translateHashMap[key](initState, updateHashMap)
                  : {
                      ...initState[key],
                      value: numberAry.includes(initState[key]?.type) ? Number(updateHashMap[key]) : updateHashMap[key],
                    };
              });
              await save(sendState);
              toast.success(t('common.actionSuccess'));
              getResponse();
            }}
          >
            {t('common.save')}
          </LoadingButton>
        </div>
        <div className='flex-1'>
          <Illustration type='detect' />
        </div>
      </div>
    </>
  );
};

export default memo(PlaceMove);
