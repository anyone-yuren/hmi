import { useGetState, useSize } from 'ahooks';
import { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef } from 'react';

import StorageListSelect from '@/views/Vision/components/settingPart/comp/storageListSelect';

import { ListItemText, MenuItem } from '@mui/material';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { getMultiCageModelRead } from '../../../services/index';
import CustomSelect from '../../settingPart/comp/customSelect';
import TextUpdateRow from '../../settingPart/comp/textUpdateRow';
import MultiCageAnnotation from './multiCageAnnotation';
import './truck.css';

const Cube = memo((props: any) => {
  const { width, title } = props;
  return (
    <div className='w-[80%] h-[40%] bg-[#00d1d1] relative'>
      <div
        className='h-full bg-[#09abab] absolute'
        style={{
          transformOrigin: 'left top',
          transform: 'skew(0deg, 330deg)',
          width: width * 0.17 + 'px',
          right: -width * 0.17 + 'px',
        }}
      ></div>
      <div
        className='w-full absolute left-0 bg-[#17efef]'
        style={{
          transformOrigin: 'left bottom',
          transform: 'skew(300deg, 0deg)',
          height: width * 0.1 + 'px',
          top: -width * 0.1 + 'px',
        }}
      ></div>
      {props.showMarks && (
        <MultiCageAnnotation widthText={100} heightText={100} lengthText={10000} realWidth={width * 0.17} {...props} />
      )}
    </div>
  );
});

const MultiCage = forwardRef((props: any, ref) => {
  const { data: multiCageModels, run: getMultiCageModels } = useRequest(getMultiCageModelRead, { manual: true });

  const [propsState, setPropsState] = useGetState<any>({
    truck_size: {
      height: 0,
      length: 0,
      width: 0,
    },
    goods_size: [
      {
        height: 0,
        length: 0,
        width: 0,
      },
      {
        height: 0,
        length: 0,
        width: 0,
      },
    ],
    above_model_id: '',
    below_model_id: '',
  });
  const divRef = useRef(null);
  const divSize = useSize(divRef);

  const { t } = useTranslation();

  const options = useMemo(() => {
    return {
      top: multiCageModels?.data?.multi_cage_model_list?.above_model_id_list,
      bottom: multiCageModels?.data?.multi_cage_model_list?.below_model_id_list,
    };
  }, [multiCageModels]);

  useEffect(() => {
    props.showMarks && getMultiCageModels();
  }, [props.showMarks]);

  useImperativeHandle(ref, () => ({
    getParams: () => {
      return {
        ...propsState,
      };
    },
  }));

  useEffect(() => {
    setPropsState({
      ...propsState,
      ...props,
    });
  }, [props]);
  const handleSizeArea = () => {};
  return (
    <div className='flex flex-col w-full h-full'>
      <div ref={divRef} className='flex flex-1 w-full h-full items-center justify-center '>
        {propsState?.showMarks && (
          <div className='w-[260px] flex  flex-col'>
            <div className='flex-1'>
              {props.showMarks && (
                <>
                  {[
                    {
                      label: t('deployer.vision.topMultiCage'),
                      key: 'above_model_id',
                      optionsKey: 'top',
                    },
                    {
                      label: t('deployer.vision.bottomMultiCage'),
                      key: 'below_model_id',
                      optionsKey: 'bottom',
                    },
                  ]?.map((item) => {
                    return (
                      <TextUpdateRow key={item.key} className={'w-[260px]'}>
                        <div>{t('deployer.vision.topMultiCage')}</div>
                        <div className='max-w-[130px] overflow-auto'>
                          <CustomSelect
                            variant='standard'
                            value={propsState?.[item.key]}
                            onChange={(event) => {
                              const selectedValue = event.target.value;
                              setPropsState({
                                ...propsState,
                                [item.key]: selectedValue,
                              });
                            }}
                          >
                            {options?.[item.optionsKey]?.length ? (
                              options?.[item.optionsKey]?.map((item: any) => {
                                return (
                                  <MenuItem
                                    value={item}
                                    key={item}
                                    sx={{
                                      '&.Mui-selected': {
                                        backgroundColor: '#00d1d1ad', // 修改选中项的背景色
                                      },
                                      '&.Mui-selected:hover': {
                                        backgroundColor: '#00d1d1ad', // 修改选中项的背景色
                                      },
                                    }}
                                  >
                                    <ListItemText primary={item || '-'} />
                                  </MenuItem>
                                );
                              })
                            ) : (
                              <MenuItem
                                key='nodata'
                                sx={{
                                  justifyContent: 'center',
                                  fontSize: '18px',
                                  padding: '15px 0px',
                                }}
                              >
                                {t('common.noData')}
                              </MenuItem>
                            )}
                          </CustomSelect>
                        </div>
                      </TextUpdateRow>
                    );
                  })}

                  <StorageListSelect
                    className='w-[260px]'
                    title={t('deployer.vision.targetStorage')}
                    value={propsState?.['storage_list']}
                    onChange={(value: any) => {
                      setPropsState({
                        ...propsState,
                        ['storage_list']: value,
                      });
                    }}
                  ></StorageListSelect>
                </>
              )}
            </div>
            <div className='flex-1 flex gap-[10px]'></div>
          </div>
        )}
        {/* 这是分界线 */}
        <div className='flex-1 flex items-center pl-[10%] h-full'>
          <Cube
            width={(divSize?.width || 2) / 2}
            title={props.showMarks ? t('deployer.vision.truckModel') : null}
            showMarks={props.showMarks}
            updateKey={'truck_size'}
            handleSizeArea={handleSizeArea}
            widthText={propsState?.multi_cage_size?.width}
            heightText={propsState?.multi_cage_size?.height}
            lengthText={propsState?.multi_cage_size?.length}
          ></Cube>
        </div>
      </div>
    </div>
  );
});

export default memo(MultiCage);
