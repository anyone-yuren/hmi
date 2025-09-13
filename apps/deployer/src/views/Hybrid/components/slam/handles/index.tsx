import { Icon } from '@iconify/react';
import { Button as ButtonBase, Divider, FormControlLabel, IconButton, Switch } from '@mui/material';
import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import { useRequest } from 'ahooks';
import { Modal } from 'antd';
import * as React from 'react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { addSlamMap, delFloorMap, extendMapping } from '../../../service';
import { useHybirdStore } from '../../../store/hybird.store';

import { MyLocationOutlined } from '@mui/icons-material';
import { useHttpCode } from '../../../hooks/useHttpCode';

interface HandleButtonProps extends ButtonBaseProps {
  selected?: boolean;
}

const HandleButton = styled(ButtonBase)<HandleButtonProps>(({ theme, selected }) => ({
  color: selected ? 'red' : theme.palette.text.primary,
  '&:active': {
    backgroundColor: selected ? theme.palette.primary.main : theme.palette.action.selected,
  },
}));

const SlamHandles = (props: any) => {
  const { floor, hide } = props;
  const [modal, contextHolder] = Modal.useModal();
  const [selectedButton, setSelectedButton] = useState('');
  const { getCodeMsg, useErrorMessage } = useHttpCode();

  const { t } = useTranslation();

  const {
    hybirdStage,
    setAddSlamMappingData,
    setBeginPose,
    beginPose,
    showPointCloud,
    setShowPointCloud,
    setMapLoading,
    robot_current_status,
    floorData,
    setCoverFloorData,
    showFloor,
    setStagePos,
    agvPosition,
  } = useHybirdStore(
    useShallow((state) => ({
      hybirdStage: state.hybirdStage,
      setAddSlamMappingData: state.setAddSlamMappingData,
      setBeginPose: state.setBeginPose,
      beginPose: state.beginPose,
      showPointCloud: state.showPointCloud,
      setShowPointCloud: state.setShowPointCloud,
      setMapLoading: state.setMapLoading,
      robot_current_status: state.robot_current_status,
      floorData: state.floorData,
      setCoverFloorData: state.setCoverFloorData,
      showFloor: state.showFloor,
      setStagePos: state.setStagePos,
      agvPosition: state.agvPosition,
    })),
  );

  const { grid_map } = floorData;
  const { system_status = 0, floor_number }: any = robot_current_status;
  const { runAsync: runAdd, loading: addLoading } = useRequest(addSlamMap, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.error_code !== 10000) {
        useErrorMessage(res.error_description, res.solution);
        setMapLoading(false);
        return;
      }
      setCoverFloorData('grid_map', res?.grid_map);
      setMapLoading(false);
      // const stage = hybirdStage.getStage();
      // hybirdStage.to({
      //   x: stage!.width() / 2,
      //   y: stage!.height() / 2,
      //   duration: 1,
      // });
    },
  });

  const { runAsync: runExtendMapping, loading: extendLoading } = useRequest(extendMapping, {
    manual: true,
    onSuccess: (res: any) => {
      debugger;
      if (res.error_code !== 10000) {
        setMapLoading(false);
        useErrorMessage(res.error_description, res.solution);
        return;
      }
      setMapLoading(false);
      setCoverFloorData('grid_map', res?.grid_map || floorData?.grid_map);
    },
    onError: (err: any) => {
      setMapLoading(false);
    },
  });

  const { runAsync: runDel, loading: delLoading } = useRequest(delFloorMap, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.error_code !== 10000) {
        useErrorMessage(res.error_description, res.solution);
        return;
      }
      toast.success(t('common.actionSuccess'));
      setCoverFloorData('grid_map', null);
    },
  });

  const delSlamMap = async () => {
    modal.confirm({
      title: t('deployer.hybrid.confirmDelete'),
      content: t('deployer.hybrid.confirmDeleteMap'),
      zIndex: 10000,
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: async () => {
        await runDel({ floor_number: floor, map_type: 2 });
      },
    });
  };

  const handleButtonClick = async (buttonName: string) => {
    // setSelectedButton(buttonName);
    // 新增和扩展地图要关闭重定位的状态
    if (buttonName === 'add') {
      await runAdd({ floor_number: floor, cmd_type: 1 });
      setAddSlamMappingData({});
      setShowPointCloud(true);
      setBeginPose(false);
    }
    if (buttonName === 'cancel') {
      setMapLoading(true);
      setAddSlamMappingData({});
      if (system_status === 1) {
        await runAdd({ floor_number: floor, cmd_type: 3 });
      }
      // 关闭扩展
      if (system_status === 2) {
        await runExtendMapping({ floor_number: floor, cmd_type: 3 });
      }

      setBeginPose(false);
      setMapLoading(false);
    }
    if (buttonName === 'hybird') {
      setBeginPose(beginPose ? false : true);
    }
    if (buttonName === 'radar') {
      if (showPointCloud) {
        setShowPointCloud(false);
      } else {
        setShowPointCloud(true);
      }
    }
    // 保存地图
    if (buttonName === 'success') {
      setMapLoading(true);
      if (system_status === 1) {
        await runAdd({ floor_number: floor, cmd_type: 2 });
      }
      if (system_status === 2) {
        await runExtendMapping({ floor_number: floor, cmd_type: 2 });
      }
      setAddSlamMappingData({});
    }
    // 扩展地图
    if (buttonName === 'slamExtend') {
      await runExtendMapping({ floor_number: floor, cmd_type: 1 });
      setAddSlamMappingData({});
      setShowPointCloud(true);
      setBeginPose(false);
    }
  };

  // 添加漫游引导
  const [openTour, setOpenTour] = React.useState(false); // [openTour, closeTour]
  const addRef = React.useRef(null);
  const extendsRef = React.useRef(null);
  const hybirdRef = React.useRef(null);
  const pointsRef = React.useRef(null);
  const delRef = React.useRef(null);

  // 引导页面 看代码不启用，先注释，观察没问题再删除
  // const handleAddTour: TourProps['steps'] = [
  //   {
  //     title: t('新增'),
  //     description: t('触发新增地图后，留意定位的操作状态变化'),
  //     target: () => addRef.current,
  //   },
  //   {
  //     title: t('扩展'),
  //     description: t('当楼层无SLAM地图时，触发扩展置灰并且不可操作'),
  //     target: () => extendsRef.current,
  //   },
  //   {
  //     title: t('重定位'),
  //     description: t('点击后，在地图上点击需要重新定位的位置，可按住手势旋转角度'),
  //     target: () => hybirdRef.current,
  //   },
  //   {
  //     title: t('点云诊断'),
  //     description: t('点击可开启和关闭，根据点云精准匹配反光板位置'),
  //     target: () => pointsRef.current,
  //   },
  //   {
  //     title: t('common.delete'),
  //     description: t('删除SLAM地图'),
  //     target: () => delRef.current,
  //   },
  // ];
  // React.useEffect(() => {
  //   // setOpenTour(true);
  //   console.log('agvPosition', agvPosition);
  //   hybirdStage && handleClick();
  // }, [hybirdStage]);

  const handleClick = () => {
    hybirdStage.to({
      x: 0 - agvPosition?.x / 50 + hybirdStage.width()! / 2,
      y: agvPosition?.y / 50 + hybirdStage.height()! / 2,
      duration: 1,
      onFinish: () => {
        const tween = new Konva.Tween({
          node: hybirdStage,
          duration: 0.3,
          scaleX: 1 * 1,
          scaleY: 1 * 1,
          easing: Konva.Easings.EaseInOut,
          onFinish: () => {
            tween.destroy();
            setStagePos({ x: 0, y: 0 });
          },
        });

        tween.play();
      },
    });
  };
  return (
    <>
      <div className=' p-2 absolute bottom-2 left-2 flex flex-col'>
        {contextHolder}
        {system_status === 0 || hide ? (
          <>
            <IconButton className='!mr-2 flex items-center' onClick={handleClick}>
              <MyLocationOutlined fontSize='medium' style={{ color: '#000' }} />
            </IconButton>
            {grid_map ? (
              floor == floor_number ? (
                <HandleButton
                  variant='contained'
                  ref={extendsRef}
                  onClick={() => handleButtonClick('slamExtend')}
                  className='flex-1 flex  gap-1 items-center justify-center text-sm'
                >
                  {t('deployer.hybrid.extendMap')}
                </HandleButton>
              ) : null
            ) : (
              <HandleButton
                variant='contained'
                ref={addRef}
                onClick={() => handleButtonClick('add')}
                className='flex-1 flex gap-1 items-center justify-center text-sm'
              >
                {t('deployer.hybrid.createMap')}
              </HandleButton>
            )}
            <Divider orientation='vertical' variant='middle' flexItem />
            <HandleButton
              variant='contained'
              ref={delRef}
              onClick={() => {
                delSlamMap();
              }}
              className='flex-1 flex  gap-1 items-center justify-center text-sm'
            >
              {t('deployer.hybrid.deleteMap')}
            </HandleButton>
          </>
        ) : null}
        {system_status === 1 || system_status === 2 ? (
          <>
            <HandleButton
              variant='contained'
              onClick={() => handleButtonClick('success')}
              className='flex-1 flex  gap-1 items-center justify-center text-sm'
            >
              <Icon fontSize={24} icon='ix:success' />
              {t('common.success')}
            </HandleButton>
            <Divider orientation='vertical' variant='middle' flexItem />

            <HandleButton
              variant='contained'
              onClick={() => handleButtonClick('cancel')}
              className='flex-1 flex  gap-1 items-center justify-center text-sm'
            >
              <Icon fontSize={24} icon='material-symbols:cancel-outline' />
              {t('common.cancel')}
            </HandleButton>
          </>
        ) : null}
      </div>
      {system_status === 0 || hide ? (
        <>
          <div className={`absolute bottom-2 ${showFloor ? 'right-[190px]' : 'right-2'} p-2 flex flex-col`}>
            <div className='rounded-sm shadow-md bg-white px-2 !text-right' style={{ textAlign: 'right' }}>
              {floorData?.grid_map ? (
                system_status === 9 ? null : (
                  <FormControlLabel
                    value='end'
                    control={<Switch color='primary' />}
                    label={t('deployer.hybrid.autoReLocation')}
                    onChange={(e) => {
                      handleButtonClick('hybird');
                    }}
                    checked={beginPose}
                    sx={{
                      '& MuiFormControlLabel-root': {
                        margin: 0,
                      },
                      '& .MuiFormControlLabel-label': {
                        color: '#333', // 修改标签的颜色
                        fontSize: '0.875rem',
                      },
                    }}
                    labelPlacement='start'
                  />
                )
              ) : null}
            </div>
            <Divider orientation='vertical' variant='middle' flexItem />

            <div className='rounded-sm shadow-md bg-white px-2 ' style={{ textAlign: 'right' }}>
              <FormControlLabel
                value='end'
                control={<Switch color='primary' />}
                label={t('deployer.hybrid.pointCloudCheck')}
                disabled={hide}
                checked={showPointCloud}
                onChange={(e) => {
                  handleButtonClick('radar');
                }}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    color: '#333', // 修改标签的颜色
                    fontSize: '0.875rem',
                  },
                }}
                labelPlacement='start'
              />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default memo(SlamHandles);
