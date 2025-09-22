import { Button, ListItemText, MenuItem } from '@mui/material';
import { useAsyncEffect, useRequest, useSetState } from 'ahooks';
import { memo, Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { toast } from 'sonner';

import SecondaryPage, { SecondaryPaper } from '../../SecondaryPage';
import CustomSelect from '../comp/customSelect';
import CustomSwitch from '../comp/customSwitch';

import CargoSpace from '@/views/Vision/components/settingPart/cargoSpace/index';
import { getVisualPlaceRead, postVisualPlaceSave } from '../../../services/index';

import * as React from 'react';

const VisionBox = (props: any) => {
  return (
    <div
      className={`my-[6px] p-2 w-full  border-box bg-[#d8d8d8] bg-opacity-20 rounded-lg flex-col flex items-start justify-between text-lg ${props?.className}`}
    >
      {props.children}
    </div>
  );
};

const VisionStock = () => {
  const { t } = useTranslation();
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    __isSubmit: false,
    need_detect_shelf: false,
    need_detect_stack: false,
    need_detect_truck: false,
    sensor_model: '',
    sensor_model_list: [],
  });
  const [modalConfig, setModalConfig] = useState({
    open: false,
    key: '',
  });

  const { data: visualPlace, mutate: setVisualPlace } = useRequest(getVisualPlaceRead, {});

  useAsyncEffect(async () => {
    if (!updateHashMap.__isSubmit) {
      return;
    }
    const params = { ...visualPlace?.data };
    for (let key in params) {
      params[key].value = updateHashMap[key];
    }
    await postVisualPlaceSave(params);
    toast.success(t('common.actionSuccess'));
  }, [updateHashMap, postVisualPlaceSave]);

  useEffect(() => {
    const data = visualPlace?.data;
    setUpdateHashMap({
      need_detect_shelf: data?.need_detect_shelf?.value,
      need_detect_stack: data?.need_detect_stack?.value,
      need_detect_truck: data?.need_detect_truck?.value,
      sensor_model: data?.sensor_model?.value || '',
      sensor_model_list: data?.sensor_model_list?.value,
    });
  }, [visualPlace]);

  const options = [
    {
      value: 'need_detect_shelf',
      label: t('deployer.vision.shelfStorage'),
    },
    {
      value: 'need_detect_stack',
      label: t('deployer.vision.stackStorage'),
    },
    {
      value: 'need_detect_truck',
      label: t('deployer.vision.truckStorage'),
    },
    {
      value: 'tailBox',
      label: t('deployer.vision.tailStorage'),
    },
  ];
  const ShelfSetting = React.lazy(() => import('./shelf/index'));
  const StackSetting = React.lazy(() => import('./stack/index'));
  const FlatWingSetting = React.lazy(() => import('./flatWing/index'));
  const template: any = {
    need_detect_shelf: <ShelfSetting />,
    need_detect_stack: <StackSetting />,
    need_detect_truck: <FlatWingSetting />,
    place_space_check: <CargoSpace />,
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center flex-1 basis-[45%] w-[50%] h-full overflow-hidden'>
        <div className='w-full bg-[#2c3645] rounded-[20px] p-[20px] overflow-hidden relative flex flex-col h-full overflow-y-auto'>
          <div className='text-3xl flex items-center justify-between'>
            <div>{t('deployer.vision.place')}</div>
          </div>
          <div className='flex justify-between items-center w-full gap-[10px] mt-1'>
            {options?.slice(0, 2)?.map((option) => {
              return (
                <div className='flex-1' key={option.value}>
                  <VisionBox className={'pt-0'}>
                    <div className='mt-[5px]'>{option.label}</div>
                    <div className='flex justify-between items-center w-full'>
                      <div></div>
                      {false && (
                        <CustomSwitch
                          size='small'
                          checked={updateHashMap[option.value]}
                          onChange={(event: any) => {
                            setUpdateHashMap({
                              __isSubmit: true,
                              [option.value]: event.target.checked,
                            });
                          }}
                        ></CustomSwitch>
                      )}
                      <Button
                        size='small'
                        sx={{
                          color: 'white',
                          float: 'right',
                          whiteSpace: 'nowrap',
                        }}
                        variant='contained'
                        onClick={async () => {
                          setModalConfig({
                            ...modalConfig,
                            open: true,
                            key: option.value,
                          });
                        }}
                      >
                        {t('deployer.vision.paramSetting')}
                      </Button>
                    </div>
                  </VisionBox>
                </div>
              );
            })}
          </div>
          <div className='flex justify-between items-stretch w-full gap-[10px] mt-1'>
            {/* <div className='flex-1'> */}
            <VisionBox className={'pt-0'}>
              <div className='mt-[5px]'>{t('deployer.vision.sensorBind')}</div>
              <div className='flex justify-between items-center w-full'>
                <div></div>
                <CustomSelect
                  size='small'
                  variant='standard'
                  value={updateHashMap.sensor_model}
                  onChange={(event: any) => {
                    setUpdateHashMap({
                      __isSubmit: true,
                      sensor_model: event.target.value,
                    });
                  }}
                >
                  {updateHashMap?.sensor_model_list?.map((name) => (
                    <MenuItem key={name} value={name}>
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </CustomSelect>
              </div>
            </VisionBox>
            {/* </div> */}
            {/* <div className='flex-1 h-full'> */}
            <VisionBox className={'pt-0'}>
              <div className='mt-[5px]'>{t('deployer.vision.placeSpaceCheck')}</div>
              <div className='flex justify-between items-center w-full'>
                <div></div>
                <Button
                  size='small'
                  sx={{
                    color: 'white',
                    float: 'right',
                    whiteSpace: 'nowrap',
                  }}
                  variant='contained'
                  onClick={async () => {
                    setModalConfig({
                      ...modalConfig,
                      open: true,
                      key: 'place_space_check',
                    });
                  }}
                >
                  {t('deployer.vision.paramSetting')}
                </Button>
              </div>
            </VisionBox>
            {/* </div> */}
          </div>
          <div>
            <VisionBox>
              <div>{options[2].label}</div>
              <div className='flex justify-between items-center w-full'>
                <div></div>
                {false && (
                  <CustomSwitch
                    size='small'
                    checked={updateHashMap[options[2].value]}
                    onChange={(event: any) => {
                      setUpdateHashMap({
                        __isSubmit: true,
                        [options[2].value]: event.target.checked,
                      });
                    }}
                  ></CustomSwitch>
                )}
                <Button
                  size='small'
                  sx={{ color: 'white', float: 'right' }}
                  variant='contained'
                  onClick={async () => {
                    setModalConfig({
                      ...modalConfig,
                      open: true,
                      key: options[2].value,
                    });
                  }}
                >
                  {t('deployer.vision.paramSetting')}
                </Button>
              </div>
            </VisionBox>
          </div>

          {false && (
            <div className='mt-2 p-[12px] bg-[#d8d8d8] bg-opacity-20 rounded-lg flex items-center justify-between text-lg'>
              <div>{t('deployer.vision.sensorBind')}</div>
              <div>
                <CustomSelect
                  size='small'
                  variant='standard'
                  value={updateHashMap.sensor_model}
                  onChange={(event: any) => {
                    setUpdateHashMap({
                      __isSubmit: true,
                      sensor_model: event.target.value,
                    });
                  }}
                >
                  {updateHashMap?.sensor_model_list?.map((name) => (
                    <MenuItem key={name} value={name}>
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </CustomSelect>
              </div>
            </div>
          )}
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
        background={'#162640'}
      >
        <SecondaryPaper>
          <Suspense fallback={<span>loading</span>}>{template?.[modalConfig?.key] || '-'}</Suspense>
        </SecondaryPaper>
      </SecondaryPage>
    </>
  );
};

export default memo(VisionStock);
