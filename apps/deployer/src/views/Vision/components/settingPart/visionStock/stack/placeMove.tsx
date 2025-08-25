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

import { postStackPlaceMoveVehicleSave as save } from '../../../../services/index';

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
    compensation: [],
    pallet_model_list: [], // 选择的模型列表
    first_floor_height: 0, // 第一层货物高度
    need_detect_height: false, // 托盘高度检测
    scene_storage: [], // 场景库位列表
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
        const ary = originState?.['compensation']?.value?.[0];
        if (ary && ary.length > 3 && typeof ary[3] === 'number') {
          ary[3] = ary[3] % 1 !== 0 ? Number(ary[3].toFixed(1)) : ary[3];
        }
        return ary;
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
            key={'place_move_vehicle'}
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

          <PointCloudFilter type={'stack_place_move_vehicle'}></PointCloudFilter>

          <Title>{t('deployer.vision.model')}</Title>
          <ModelListSelect
            value={updateHashMap?.pallet_model_list}
            onChange={(value: any) => {
              changeUpdateHashMap('pallet_model_list', value);
            }}
          ></ModelListSelect>

          <>
            <Title>{t('deployer.vision.compensationParams')}</Title>
            {[
              { title: t('deployer.vision.swayCompensation'), index: 0 },
              { title: t('deployer.vision.aroundCompensation'), index: 2 },
              { title: t('deployer.vision.angleCompensation'), index: 3 },
            ].map((item: any) => {
              return (
                <TextChangeRow
                  key={item.title}
                  title={item.title}
                  value={updateHashMap?.['compensation']?.[item.index]}
                  validateRange={[initState?.['compensation']?.min, initState?.['compensation']?.max]}
                  onChange={(value: string) => {
                    let val = updateHashMap?.['compensation'];
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
                  <div>{updateHashMap?.['compensation']?.[item.index] || 0}</div>
                </TextChangeRow>
              );
            })}
          </>
          {/* )} */}

          <TextChangeRow
            title={t('deployer.vision.extraForkLift')}
            value={updateHashMap?.['extra_height']}
            validateRange={[initState?.['extra_height']?.min, initState?.['extra_height']?.max]}
            onChange={(value: string) => {
              changeUpdateHashMap('extra_height', value);
            }}
          >
            <div>{updateHashMap?.['extra_height'] || 0}</div>
          </TextChangeRow>

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
              validateRange={[initState?.['compensation']?.min, initState?.['compensation']?.max]}
              onChange={(value: string) => {
                const val = updateHashMap?.['compensation'];
                val[1] = Number(value);
                setUpdateHashMap({
                  ...updateHashMap,
                  compensation: val,
                });
              }}
            >
              <div>{updateHashMap?.['compensation']?.[1] || 0}</div>
            </TextChangeRow>
          )}

          <Title>{t('deployer.vision.goodsHeight')}</Title>
          <TextChangeRow
            title={t('deployer.vision.firstLayerGoodsHeight')}
            value={updateHashMap?.['first_floor_height']}
            validateRange={[initState?.['first_floor_height']?.min, initState?.['first_floor_height']?.max]}
            onChange={(value: string) => {
              changeUpdateHashMap('first_floor_height', value);
            }}
          >
            <div>{updateHashMap?.['first_floor_height']}</div>
          </TextChangeRow>

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
                    compensation: [updateHashMap['compensation']],
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
