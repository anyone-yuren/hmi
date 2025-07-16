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
import type { TourProps } from 'antd';
import { useHttpCode } from '../../../hooks/useHttpCode';
// import { QrCodeHandleButton, QrCodeHandleBuilding } from "../../qrCodeHandle";

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
  const { system_status = 0 } = robot_current_status;
  const { runAsync: runAdd, loading: addLoading } = useRequest(addSlamMap, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.error_code !== 10000) {
        useErrorMessage(res.error_description, res.solution);
        return;
      }
      setCoverFloorData('grid_map', res?.grid_map);
      setMapLoading(false);
      const stage = hybirdStage.getStage();
      hybirdStage.to({
        x: stage!.width() / 2,
        y: stage!.height() / 2,
        duration: 1,
      });
    },
  });

  const { runAsync: runExtendMapping, loading: extendLoading } = useRequest(extendMapping, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.error_code !== 10000) {
        useErrorMessage(res.error_description, res.solution);
        return;
      }
      setMapLoading(false);
      // setRefreshFloorData();
      setCoverFloorData('grid_map', res?.grid_map || floorData?.grid_map);
    },
  });

  const { runAsync: runDel, loading: delLoading } = useRequest(delFloorMap, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.error_code !== 10000) {
        useErrorMessage(res.error_description, res.solution);
        return;
      }
      toast.success(t('操作成功'));
      setCoverFloorData('grid_map', null);
    },
  });

  const delSlamMap = async () => {
    modal.confirm({
      title: t('确认删除'),
      content: t('确认删除该地图吗？'),
      zIndex: 10000,
      okText: t('确认'),
      cancelText: t('取消'),
      onOk: async () => {
        await runDel({ floor_number: floor, map_type: 2 });
      },
    });
  };

  const handleButtonClick = async (buttonName: string) => {
    setSelectedButton(buttonName);
    if (buttonName === 'add') {
      await runAdd({ floor_number: floor, cmd_type: 1 });
      setAddSlamMappingData({});
      setShowPointCloud(true);
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
      // await runInitPose({ floor_number: floor });
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
      // setRefreshFloorData();
    }
    // 扩展地图
    if (buttonName === 'slamExtend') {
      await runExtendMapping({ floor_number: floor, cmd_type: 1 });
      setAddSlamMappingData({});
      setShowPointCloud(true);
    }
  };

  // 添加漫游引导
  const [openTour, setOpenTour] = React.useState(false); // [openTour, closeTour]
  const addRef = React.useRef(null);
  const extendsRef = React.useRef(null);
  const hybirdRef = React.useRef(null);
  const pointsRef = React.useRef(null);
  const delRef = React.useRef(null);

  const handleAddTour: TourProps['steps'] = [
    {
      title: t('新增'),
      description: t('触发新增地图后，留意定位的操作状态变化'),
      target: () => addRef.current,
    },
    {
      title: t('扩展'),
      description: t('当楼层无SLAM地图时，触发扩展置灰并且不可操作'),
      target: () => extendsRef.current,
    },
    {
      title: t('重定位'),
      description: t('点击后，在地图上点击需要重新定位的位置，可按住手势旋转角度'),
      target: () => hybirdRef.current,
    },
    {
      title: t('点云诊断'),
      description: t('点击可开启和关闭，根据点云精准匹配反光板位置'),
      target: () => pointsRef.current,
    },
    {
      title: t('删除'),
      description: t('删除SLAM地图'),
      target: () => delRef.current,
    },
  ];
  React.useEffect(() => {
    setOpenTour(true);
  }, []);

  const handleClick = () => {
    hybirdStage.to({
      x: 0 - agvPosition?.x / 50 + hybirdStage.width()! / 2,
      y: agvPosition?.y / 50 + hybirdStage.height()! / 2,
      // y: hybirdStage.height()! / 2,
      duration: 1,
      onFinish: () => {
        // 使用Konva.Tween进行动画
        const tween = new Konva.Tween({
          node: hybirdStage,
          duration: 0.3, // 缓慢缩放的持续时间
          scaleX: 1 * 1, // 新的横向缩放比例
          scaleY: 1 * 1, // 新的纵向缩放比例
          easing: Konva.Easings.EaseInOut, // 缓动效果
          onFinish: () => {
            // console.log('缩放动画完成');
            tween.destroy();
            // 处理画线不完整问题
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
            <IconButton
              className='!mr-2 flex items-center'
              // disabled={location}
              onClick={handleClick}
            >
              <MyLocationOutlined fontSize='medium' style={{ color: '#000' }} />
            </IconButton>
            {grid_map ? (
              <HandleButton
                variant='contained'
                ref={extendsRef}
                // selected={system_status === 2}
                // disabled={[1].includes(system_status) || !grid_map || hide}
                onClick={() => handleButtonClick('slamExtend')}
                className='flex-1 flex  gap-1 items-center justify-center text-sm'
              >
                {/* <Icon fontSize={24} icon="icon-park-outline:extend" /> */}
                {t('扩展地图')}
              </HandleButton>
            ) : (
              <HandleButton
                variant='contained'
                ref={addRef}
                // selected={system_status === 1}
                // disabled={[2].includes(system_status) || grid_map || hide}
                onClick={() => handleButtonClick('add')}
                className='flex-1 flex gap-1 items-center justify-center text-sm'
              >
                {/* <Icon fontSize={24} icon="gg:add" /> */}
                {t('新建地图')}
              </HandleButton>
            )}
            <Divider orientation='vertical' variant='middle' flexItem />
            <HandleButton
              variant='contained'
              ref={delRef}
              onClick={() => {
                delSlamMap();
              }}
              // disabled={!grid_map || [1, 2].includes(system_status) || hide}
              className='flex-1 flex  gap-1 items-center justify-center text-sm'
            >
              {/* <Icon fontSize={24} icon="mdi:delete-circle-outline"></Icon> */}
              {t('删除地图')}
            </HandleButton>
          </>
        ) : null}
        {system_status === 1 || system_status === 2 ? (
          <>
            <HandleButton
              variant='contained'
              // selected={selectedButton === "success"}
              // disabled={}
              onClick={() => handleButtonClick('success')}
              className='flex-1 flex  gap-1 items-center justify-center text-sm'
            >
              <Icon fontSize={24} icon='ix:success' />
              {t('完成')}
            </HandleButton>
            <Divider orientation='vertical' variant='middle' flexItem />

            <HandleButton
              variant='contained'
              // selected={selectedButton === "cancel"}
              // disabled={system_status === 0 || hide}
              onClick={() => handleButtonClick('cancel')}
              className='flex-1 flex  gap-1 items-center justify-center text-sm'
            >
              <Icon fontSize={24} icon='material-symbols:cancel-outline' />
              {t('取消')}
            </HandleButton>
          </>
        ) : null}

        {/* <QrCodeHandleBuilding /> */}
      </div>
      {system_status === 0 || hide ? (
        <>
          <div className={`absolute bottom-2 ${showFloor ? 'right-[190px]' : 'right-2'} p-2 flex flex-col`}>
            {/* <QrCodeHandleButton /> */}
            {/* <HandleButton
              variant="contained"
              ref={hybirdRef}
              // disabled={[1, 2].includes(system_status) || hide || !grid_map}
              selected={beginPose}
              onClick={() => handleButtonClick("hybird")}
              className="flex-1 flex  gap-1 items-center justify-center text-sm"
            >
              <Icon fontSize={24} icon="pepicons-print:pinpoint" />
              {t("智能重定位")}
            </HandleButton> */}
            {/* <HandleButton
              variant="contained"
              ref={pointsRef}
              disabled={hide}
              selected={showPointCloud}
              onClick={() => handleButtonClick("radar")}
              className="flex-1 flex  gap-1 items-center justify-center text-sm"
            >
              <Icon fontSize={24} icon="game-icons:radar-cross-section"></Icon>
              {t("点云诊断")}
            </HandleButton> */}

            <div className='rounded-sm shadow-md bg-white px-2 !text-right' style={{ textAlign: 'right' }}>
              {floorData?.grid_map ? (
                <FormControlLabel
                  value='end'
                  control={<Switch color='primary' />}
                  label={t('智能重定位')}
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
              ) : null}
            </div>
            <Divider orientation='vertical' variant='middle' flexItem />

            <div className='rounded-sm shadow-md bg-white px-2 ' style={{ textAlign: 'right' }}>
              <FormControlLabel
                value='end'
                control={<Switch color='primary' />}
                label={t('点云诊断')}
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
