import { useSetState } from 'ahooks';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import LoadingButton from '../../comp/loadingButton';
import ModelListSelect from '../../comp/modelListSelect';
import PointCloudFilter from '../../comp/pointCloudFilter';
import StorageListSelect from '../../comp/storageListSelect';
import TextChangeRow from '../../comp/textChangeRow';
import TextUpdateSwitchRow from '../../comp/textUpdateSwitchRow';
import Title from '../../comp/title';

import Illustration from './illustration';

import { postStackPlacePalletPositionDetectSave as save } from '../../../../services/index';
interface IProps {
  initState: any;
  getResponse: () => void;
}
// 堆叠放货 - 姿态识别
const PoseDetect = (props: IProps) => {
  const { initState, getResponse } = props;
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    auto_para_tuning: false, // 自动调参
    need_detect: false, // 是否启用
    pallet_model_list: [], // 选择的模型列表
    need_detect_height: true, // 放货高度识别
    extra_height: 0, // 额外抬升叉臂高度
    // start_mid_dist: 0, // 车身回正时基准点到托盘的距离
    // end_mid_dist: 0, // 停车后基准点到托盘的距离
    // back_mid_dist: 0, // 退出时车身行走的直线距离
    first_floor_height: 0, // 第一层货物高度
    compensation: [],
    scene_storage: [], // 场景库位列表
  });
  const { t } = useTranslation();

  useEffect(() => {
    // 将参数转化为useState里面去
    if (!initState || !Object.keys(initState).length) return;
    const tempHashMap = { ...updateHashMap };
    const translateHashMap: any = {
      compensation: (originState: any) => {
        const ary = originState?.['compensation']?.value?.[0];
        if (ary && ary.length > 3 && typeof ary[3] === 'number') {
          ary[3] = ary[3] % 1 !== 0 ? Number(ary[3].toFixed(1)) : ary[3];
        }
        return ary;
      },
    };
    Object.keys(initState).forEach((key: string) => {
      if (tempHashMap[key] != undefined) {
        tempHashMap[key] = translateHashMap[key] ? translateHashMap[key](initState) : initState[key]?.value;
      }
    });
    setUpdateHashMap(tempHashMap);
  }, [initState]);

  const changeUpdateHashMap = (key: string, value: any) => {
    setUpdateHashMap({
      [key]: value,
    });
  };

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
            key={'place_pose_detect'}
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

          {/* 点云选择 */}
          <PointCloudFilter type={'stack_pallet_position_detect'}></PointCloudFilter>

          <Title>{t('deployer.vision.model')}</Title>
          <ModelListSelect
            value={updateHashMap?.pallet_model_list}
            onChange={(value: any) => {
              changeUpdateHashMap('pallet_model_list', value);
            }}
          ></ModelListSelect>

          {/* 姿态识别没有K车,只要前后 */}
          <Title>{t('deployer.vision.compensationParams')}</Title>
          {[
            { title: t('deployer.vision.swayCompensation'), index: 0 },
            { title: t('deployer.vision.aroundCompensation'), index: 2 },
            { title: t('deployer.vision.angleCompensation'), index: 3 },
          ].map((item: any) => {
            const val = updateHashMap?.['compensation']?.[item.index];
            return (
              <TextChangeRow
                key={item.title}
                title={item.title}
                value={val}
                validateRange={[initState?.['compensation'].min, initState?.['compensation'].max]}
                onChange={(value) => {
                  const val = updateHashMap?.['compensation'];
                  if (item.index === 3 && !Number.isInteger(Number(value))) {
                    val[item.index] = Number(value).toFixed(1);
                  } else {
                    val[item.index] = Number(value);
                  }
                  setUpdateHashMap({
                    ...updateHashMap,
                    compensation: val,
                  });
                }}
              >
                <div>{val || 0}</div>
              </TextChangeRow>
            );
          })}

          <TextUpdateSwitchRow
            title={t('deployer.vision.placeHeightDetect')}
            checked={updateHashMap['need_detect_height']}
            onChange={(checked: boolean) => {
              changeUpdateHashMap('need_detect_height', checked);
            }}
          />

          {updateHashMap['need_detect_height'] && (
            <TextChangeRow
              title={t('deployer.vision.heightCompensation')}
              value={updateHashMap?.['compensation']?.[1]}
              validateRange={[initState?.['compensation'].min, initState?.['compensation'].max]}
              onChange={(value: string) => {
                const front = updateHashMap?.['compensation'];
                front[1] = Number(value);
                setUpdateHashMap({
                  ...updateHashMap,
                  compensation: front,
                });
              }}
            >
              <div>{updateHashMap?.['compensation']?.[1] || 0}</div>
            </TextChangeRow>
          )}

          <TextChangeRow
            title={t('deployer.vision.extraForkLift')}
            value={updateHashMap?.['extra_height']}
            validateRange={[initState?.['extra_height'].min, initState?.['extra_height'].max]}
            onChange={(value: string) => {
              changeUpdateHashMap('extra_height', value);
            }}
          >
            <div>{updateHashMap?.['extra_height'] || 0}</div>
          </TextChangeRow>

          <Title>{t('deployer.vision.goodsHeight')}</Title>
          <TextChangeRow
            title={t('deployer.vision.firstLayerGoodsHeight')}
            value={updateHashMap?.['first_floor_height']}
            validateRange={[initState?.['first_floor_height'].min, initState?.['first_floor_height'].max]}
            onChange={(value: string) => {
              changeUpdateHashMap('first_floor_height', value);
            }}
          >
            <div>{updateHashMap?.['first_floor_height']}</div>
          </TextChangeRow>

          {/* <Title>{t('deployer.vision.pathPlanning')}</Title> */}
          {[
            // { title: t('deployer.vision.vehicleBackDist'), key: 'back_mid_dist' },
            // { title: t('deployer.vision.vehicleStartMidDist'), key: 'start_mid_dist' },
            // { title: t('deployer.vision.vehicleEndMidDist'), key: 'end_mid_dist' },
          ]?.map((item: any) => {
            const val = updateHashMap?.[item.key];
            return (
              <TextChangeRow
                title={item.title}
                value={val}
                key={item.key}
                validateRange={[initState?.[item.key]?.min, initState?.[item.key]?.max]}
                onChange={(value: string) => {
                  changeUpdateHashMap(item.key, value);
                }}
              >
                <div>{updateHashMap?.[item.key]}</div>
              </TextChangeRow>
            );
          })}

          <LoadingButton
            fullWidth
            variant='contained'
            sx={{ color: 'white', marginBottom: '40px' }}
            onPress={async () => {
              let sendState: any = {};
              const translateHashMap: any = {
                compensation: (originState: any) => {
                  const obj = {
                    ...originState['compensation'],
                    value: [updateHashMap['compensation']],
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

export default memo(PoseDetect);
