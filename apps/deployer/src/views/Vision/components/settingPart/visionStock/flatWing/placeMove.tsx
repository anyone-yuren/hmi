import { useSetState } from 'ahooks';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { postFlatPlaceMoveVehicleSave as save } from '../../../../services/index';
import LoadingButton from '../../comp/loadingButton';
import PointCloudFilter from '../../comp/pointCloudFilter';
import StorageListSelect from '../../comp/storageListSelect';
import TextChangeRow from '../../comp/textChangeRow';
import TextUpdateSwitchRow from '../../comp/textUpdateSwitchRow';
import Title from '../../comp/title';
import Illustration from './illustration';
interface IProps {
  initState: any;
}
// 货架设置
const PlaceMove = (props: IProps) => {
  const { initState } = props;

  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    auto_para_tuning: true, // 自动调参
    need_detect: false,
    extra_height: 0,
    pallet_model_list: [],
    compensation: {
      left: {
        offset_x: [],
        offset_y: [],
      }, // K车左侧取货补偿参数: 第一个参数表示“前后挪车补偿”，第三个参数表示“叉臂伸出距离补偿”,其余参数无效
      right: {
        offset_x: [],
        offset_y: [],
      }, // K车右侧取货补偿参数: 第一个参数表示“前后挪车补偿”，第三个参数表示“叉臂伸出距离补偿”,其余参数无效
    },
    scene_storage: [], // 场景库位列表
    // first_floor_height: 0, // 第一层货物高度
    // need_detect_height: false, // 托盘高度检测
  });
  const { t } = useTranslation();

  const changeUpdateHashMap = (key: string, value: any) => {
    setUpdateHashMap({
      [key]: value,
    });
  };

  useEffect(() => {
    if (!initState || !Object.keys(initState).length) return;
    const tempHashMap = { ...updateHashMap };
    const translateHashMap: any = {
      compensation: (originState: any) => {
        const obj: any = {
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
            title={t('deployer.vision.sceneStorage')}
            value={updateHashMap?.['scene_storage']}
            onChange={(value: any) => {
              changeUpdateHashMap('scene_storage', value);
            }}
          ></StorageListSelect>

          <PointCloudFilter type={'truck_place_move_vehicle'}></PointCloudFilter>

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

          <TextChangeRow
            title={t('deployer.vision.extraForkLift')}
            value={updateHashMap?.['extra_height']}
            onChange={(value: string) => {
              changeUpdateHashMap('extra_height', value);
            }}
          >
            <div>{updateHashMap?.['extra_height'] || 0}</div>
          </TextChangeRow>

          <LoadingButton
            fullWidth
            variant='contained'
            sx={{ color: 'white', marginBottom: '40px' }}
            onPress={async () => {
              let sendState: any = {};
              const translateHashMap: any = {
                compensation: (originState: any, hashMap: any) => {
                  console.log('originState', originState, 'hashMap', hashMap);
                  const obj = {
                    ...originState['compensation'],
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
            }}
          >
            {t('common.save')}
          </LoadingButton>
        </div>
        <div className='flex-1'>
          <Illustration type='move' />
        </div>
      </div>
    </>
  );
};

export default memo(PlaceMove);
