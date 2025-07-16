import { Icon } from '@iconify/react';
import { Button as ButtonBase, Divider, FormControlLabel, Switch } from '@mui/material';
// import ButtonBase from "@mui/material/ButtonBase";
import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import { memo, useCallback, useEffect, useMemo } from 'react';

import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import { useRequest } from 'ahooks';
import { Modal } from 'antd';
import { t } from 'i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { useHttpCode } from '../../../hooks/useHttpCode';
import {
  postDeleteTargetTypeMap,
  postEndReflectorMapping,
  postReflectorExtendMapping,
  postReflectorMapping,
  postSaveReflectorMapping,
} from '../services';

/**
 * 只做类型定义，无需多语言支持
 */
export const ActionsEnum = {
  add: '新建',
  expand: '拓展',
  delete: '删除',
  radar: '点云诊断',
  relocation: '智能重定位',
  settle: '镇定',
  success: '完成',
  cancel: '取消',
  end: '结束',
};

interface HandleButtonProps extends ButtonBaseProps {
  selected?: boolean;
}

const HandleButton = styled(ButtonBase)<HandleButtonProps>(({ theme, selected }) => ({
  color: selected ? 'red' : theme.palette.text.primary,
  '&:active': {
    backgroundColor: selected ? theme.palette.primary.main : theme.palette.action.selected,
  },
}));

const ReflectorHandles = (props: any) => {
  const { floor, hide } = props;

  const {
    isSettled,
    setIsSettled,
    reflectorType,
    setReflectorType,
    systemStatus,
    showPointCloudDiag,
    setShowPointCloud,
    setShowPointCloudDiag,
    beginPose,
    setBeginPose,
    setRefreshFloorData,
    reflectorMapData,
    setCoverFloorData,
    robotCurrentStatus,
    showFloor,
  } = useHybirdStore(
    useShallow((state) => ({
      systemStatus: state.robot_current_status?.system_status ?? 0,
      reflectorType: state.reflectorType,
      setReflectorType: state.setReflectorType,
      showPointCloudDiag: state.showPointCloudDiag,
      setShowPointCloudDiag: state.setShowPointCloudDiag,
      setShowPointCloud: state.setShowPointCloud,
      isSettled: state.isSettled,
      setIsSettled: state.setIsSettled,
      beginPose: state.beginPose,
      setBeginPose: state.setBeginPose,
      setRefreshFloorData: state.setRefreshFloorData,
      reflectorMapData: state.floorData?.reflector_map,
      setCoverFloorData: state.setCoverFloorData,
      robotCurrentStatus: state.robot_current_status,
      showFloor: state.showFloor,
    })),
  );

  const [modal, contextHolder] = Modal.useModal();

  const { getCodeMsg } = useHttpCode();

  useEffect(() => {
    console.log('systemStatus = ', systemStatus);
  }, [systemStatus]);

  // 新建
  const { runAsync: runAdd } = useRequest(postReflectorMapping, {
    manual: true,
    debounceWait: 100,
    onSuccess: () => {},
  });

  // 拓展
  const { runAsync: runExpand } = useRequest(postReflectorExtendMapping, {
    manual: true,
    debounceWait: 100,
    onSuccess: () => {},
  });

  // 完成
  const { runAsync: runSave } = useRequest(postSaveReflectorMapping, {
    manual: true,
    debounceWait: 100,
  });

  // 结束
  const { runAsync: runEnd } = useRequest(postEndReflectorMapping, {
    manual: true,
    debounceWait: 100,
  });

  // 删除 地图
  const { runAsync: runDeleteMap } = useRequest(postDeleteTargetTypeMap, {
    manual: true,
    debounceWait: 100,
    onSuccess: () => {},
  });

  const handleAction = useCallback(
    async (type: string) => {
      if (![ActionsEnum['radar']].includes(type)) {
        setReflectorType(type);
      }

      switch (type) {
        case ActionsEnum['add']: // 新建
          {
            const { error_code, error_description } = ((await runAdd(floor)) as any) ?? {};
            if (error_code !== 10000) {
              toast.error(error_description || getCodeMsg(error_code));
              return;
            }
            setIsSettled(true);
            setShowPointCloudDiag(true);
          }
          break;
        case ActionsEnum['expand']: // 拓展
          {
            const { error_code, error_description } = ((await runExpand(floor)) as any) ?? {};
            if (error_code !== 10000) {
              toast.error(error_description || getCodeMsg(error_code));
              return;
            }
            setIsSettled(true);
            setShowPointCloudDiag(true);
          }
          break;
        case ActionsEnum['delete']: // 删除地图
          modal.confirm({
            title: t('确认删除'),
            content: t('确认删除该地图吗？'),
            zIndex: 2000,
            okText: t('确认'),
            cancelText: t('取消'),
            onOk: async () => {
              try {
                const { error_code, error_description } =
                  ((await runDeleteMap({
                    floor_number: floor,
                    map_type: 1,
                  })) as any) ?? {};
                if (error_code === 10000) {
                  setReflectorType('');
                  toast.success(error_description || t('删除成功'));
                  setRefreshFloorData();
                  return Promise.resolve();
                }
                const msg = getCodeMsg(error_code);
                toast.error(msg);
                return Promise.reject(new Error(msg));
              } catch (error) {
                return Promise.reject(error);
              }
            },
            onCancel: () => {
              setReflectorType('');
            },
          });
          break;
        case ActionsEnum['radar']: // 点云诊断
          {
            if (showPointCloudDiag) {
              setShowPointCloudDiag(false);
              setShowPointCloud(false);
            } else {
              setShowPointCloudDiag(true);
            }
          }
          break;
        case ActionsEnum['relocation']: // 智能重定位
          {
            const nextBeginPose = !beginPose;
            setBeginPose(nextBeginPose);
            if (!nextBeginPose) {
              setReflectorType('');
            }
          }
          break;
        case ActionsEnum['success']: // 完成
          {
            try {
              const { error_code, error_description, reflector_map } = ((await runSave()) as any) ?? {};
              if (error_code !== 10000) {
                toast.error(error_description || getCodeMsg(error_code));
                return;
              }
              setCoverFloorData('reflector_map', reflector_map);
            } catch (error) {}
          }
          break;
        case ActionsEnum['cancel']: // 退出
          {
            try {
              setIsSettled(false);
              const { error_code, error_description } = ((await runEnd()) as any) ?? {};
              if (error_code !== 10000) {
                toast.error(error_description || getCodeMsg(error_code));
                setIsSettled(true);
                return;
              }
              setBeginPose(false);
              setReflectorType('');
            } catch (error) {
              setIsSettled(true);
            }
          }
          break;
        default:
          break;
      }
    },
    [showPointCloudDiag, systemStatus, floor, beginPose],
  );

  const handleButtonClick = useCallback(
    (buttonName: string) => {
      handleAction(buttonName);
    },
    [handleAction],
  );

  useEffect(() => {
    if ([5, 6].includes(systemStatus)) {
      setIsSettled(true);
    }
    if (systemStatus === 0) {
      setReflectorType('');
      setIsSettled(false);
    }
  }, [systemStatus]);

  const locationLost = useMemo(() => robotCurrentStatus?.navi_status === 1, [robotCurrentStatus?.navi_status]);

  useEffect(() => {
    if (beginPose) {
      setReflectorType(ActionsEnum['relocation']);
    }
  }, [beginPose]);

  return (
    <>
      <div className='rounded-md flex flex-col p-2 left-2 bottom-2'>
        {systemStatus === 0 || hide ? (
          <>
            {reflectorMapData?.length ? (
              <HandleButton
                variant='contained'
                // selected={reflectorType === ActionsEnum["expand"]}
                onClick={() => handleButtonClick(ActionsEnum['expand'])}
                className='flex-1 flex  gap-1 items-center justify-center text-sm'
              >
                {t('扩展地图')}
              </HandleButton>
            ) : (
              <HandleButton
                variant='contained'
                // selected={reflectorType === ActionsEnum["add"]}
                onClick={() => handleButtonClick(ActionsEnum['add'])}
                className='flex-1 flex  gap-1 items-center justify-center text-sm'
              >
                {t('新建地图')}
              </HandleButton>
            )}

            <Divider orientation='vertical' variant='middle' flexItem />

            <HandleButton
              variant='contained'
              // selected={reflectorType === ActionsEnum["delete"]}
              onClick={() => handleButtonClick(ActionsEnum['delete'])}
              className='flex-1 flex  gap-1 items-center justify-center text-sm'
            >
              {t('删除地图')}
            </HandleButton>
          </>
        ) : (
          <>
            <HandleButton
              variant='contained'
              selected={reflectorType === ActionsEnum['success']}
              onClick={() => handleButtonClick(ActionsEnum['success'])}
              // disabled={![5, 6].includes(systemStatus) || hide}
              className='flex-1 flex  gap-1 items-center justify-center text-sm'
            >
              <Icon fontSize={24} icon='ix:success' />
              {t('保存')}
            </HandleButton>
            <Divider orientation='vertical' variant='middle' flexItem />

            <HandleButton
              variant='contained'
              // selected={reflectorType === ActionsEnum["cancel"]}
              onClick={() => handleButtonClick(ActionsEnum['cancel'])}
              // disabled={![5, 6].includes(systemStatus) || hide}
              className='flex-1 flex  gap-1 items-center justify-center text-sm'
            >
              <Icon fontSize={24} icon='material-symbols:cancel-outline' />
              {t('退出')}
            </HandleButton>
          </>
        )}

        {contextHolder}
      </div>
      {systemStatus === 0 || hide ? (
        <div className={`absolute bottom-2 ${showFloor ? 'right-[190px]' : 'right-2'}  flex flex-col`}>
          <div className='rounded-sm shadow-md bg-white px-2'>
            <FormControlLabel
              value='end'
              control={<Switch color='primary' className='mr-2' />}
              label={t('智能重定位')}
              onChange={(e) => {
                handleButtonClick(ActionsEnum['relocation']);
              }}
              checked={beginPose}
              sx={{
                '& .MuiFormControlLabel-root': {
                  margin: 0,
                },
                '& .MuiFormControlLabel-label': {
                  color: '#333', // 修改标签的颜色
                  fontSize: '0.875rem',
                },
              }}
              labelPlacement='start'
            />
          </div>
          <Divider orientation='vertical' variant='middle' flexItem />

          <div className='rounded-sm shadow-md bg-white px-2'>
            <FormControlLabel
              value='end'
              control={<Switch color='primary' />}
              label={t('点云诊断')}
              onChange={(e) => {
                handleButtonClick(ActionsEnum['radar']);
              }}
              checked={showPointCloudDiag}
              sx={{
                // "& .MuiFormControlLabel-root": {
                //   marginRight: 0,
                // },
                '& .MuiFormControlLabel-label': {
                  color: '#333', // 修改标签的颜色
                  fontSize: '0.875rem',
                },
              }}
              labelPlacement='start'
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default memo(ReflectorHandles);
