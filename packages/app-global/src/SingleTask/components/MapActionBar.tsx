import { useTranslation } from 'react-i18next';

import { FileUpload } from '@mui/icons-material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import GrainIcon from '@mui/icons-material/Grain';
import StreamIcon from '@mui/icons-material/Stream';
import { Menu, MenuItem, ThemeProvider, Tooltip } from '@mui/material';
import { toast } from 'sonner';
import 'swiper/css';
import { IMode } from '../index.d';

import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { createTheme } from '@mui/material/styles';
import { forwardRef, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { IconStyleButton } from '../Style';
import { setTaskMode, uploadRcsMap } from '../services';

import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SettingsIcon from '@mui/icons-material/Settings';
import { Upload, UploadProps } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { useShallow } from 'zustand/react/shallow';
import { useSingleTaskStore } from '../store/singleTask.store';

const MapActionBar = forwardRef((props: any, ref) => {
  const {
    setTaskSettingVisible,
    setTaskVisible,
    stageRef,
    setMoveToTarget,
    taskMode,
    modeHashMap,
    getMapTaskMode,
    setOffsetVisible,
  } = props;
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { showRealTimePoints, setShowRealTimePoints, agvViewLock, setAgvViewLock } = useSingleTaskStore(
    useShallow((state) => ({
      showRealTimePoints: state.showRealTimePoints,
      setShowRealTimePoints: state.setShowRealTimePoints,
      agvViewLock: state.agvViewLock,
      setAgvViewLock: state.setAgvViewLock,
    })),
  );

  const open = Boolean(anchorEl);

  const isMultiwayAgv = useMemo(() => {
    return false;
  }, []);

  // 0调度 3单机
  const mapTaskMode: IMode = useMemo(() => {
    return taskMode?.data?.task_mode ?? 100;
  }, [taskMode]);

  const changeMapTaskMode = async (task_mode: IMode) => {
    const { code }: any = await setTaskMode({ task_mode });
    if (code === 200) {
      toast.success(t('common.actionSuccess'));
      getMapTaskMode();
      setAnchorEl(null);
      setTaskVisible(false);
    }
  };

  const uploadFile = useCallback((info: UploadChangeParam) => {
    const { file }: any = info;
    // 只在文件添加状态处理
    if (file.status === 'uploading' || !file.originFileObj) {
      const formData: any = {};
      const reader = new FileReader();

      reader.onload = () => {
        formData.data = reader.result;
        formData.filename = file.name;

        uploadRcsMap(formData)
          .then(() => {
            toast.success(t('common.actionSuccess'));
            window.location.reload();
          })
          .catch((error) => {});
      };

      reader.onerror = (error) => {
        console.error('FileReader 错误:', error);
      };

      reader.readAsDataURL(file.originFileObj);
    }
  }, []);

  const uploadProps: UploadProps = {
    accept: `.zar`,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    fileList,
  };

  useEffect(() => {
    setAgvViewLock(true);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        padding: '10px',
        borderRadius: '10px',
        zIndex: 1,
      }}
    >
      <div>
        {modeHashMap?.title?.[mapTaskMode]}
        {mapTaskMode === 0 ? `，${t('deployer.singleTask.modeTips')}` : ''}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
        <>
          <IconStyleButton
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              setAnchorEl(event.currentTarget);
            }}
          >
            <Tooltip title={t('deployer.singleTask.changeMode')}>
              <PublishedWithChangesIcon fontSize={'large'} />
            </Tooltip>
          </IconStyleButton>

          <ThemeProvider
            theme={createTheme({
              palette: {
                mode: 'light',
                primary: {
                  main: '#00D1D1',
                },
              },
              typography: {
                fontSize: 14,
              },
            })}
          >
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => {
                setAnchorEl(null);
              }}
            >
              <MenuItem
                onClick={() => {
                  changeMapTaskMode(0);
                }}
              >
                {t('deployer.singleTask.rcsMode')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  changeMapTaskMode(3);
                }}
              >
                {t('deployer.singleTask.singleMode')}
              </MenuItem>
            </Menu>
          </ThemeProvider>
        </>

        <IconStyleButton
          onClick={() => {
            setTaskSettingVisible(true);
            setTaskVisible(false);
            setOffsetVisible(false);
          }}
        >
          <Tooltip title={t('deployer.singleTask.setting')} placement='bottom'>
            <SettingsIcon fontSize={'large'} />
          </Tooltip>
        </IconStyleButton>

        <IconStyleButton
          onClick={() => {
            const { x, y } = stageRef?.current?.getVehiclePosition();
            if (x != null && y != null) {
              stageRef?.current && stageRef?.current?.setStageScale(1);
              setMoveToTarget({ x: x * 20, y: -y * 20 } as any);
            } else {
              toast.error(t('common.noData'));
            }
          }}
        >
          <Tooltip title={t('deployer.singleTask.location')}>
            <GpsFixedIcon fontSize={'large'} />
          </Tooltip>
        </IconStyleButton>
        {!isMultiwayAgv && mapTaskMode === 3 && (
          <Upload {...uploadProps} onChange={uploadFile}>
            <IconStyleButton>
              <Tooltip title={t('deployer.singleTask.uploadMap')}>
                <FileUpload fontSize={'large'} />
              </Tooltip>
            </IconStyleButton>
          </Upload>
        )}
        <IconStyleButton
          onClick={() => {
            setOffsetVisible(true);
          }}
        >
          <Tooltip title={t('deployer.singleTask.offsetTable')}>
            <StreamIcon fontSize={'large'} />
          </Tooltip>
        </IconStyleButton>
        <IconStyleButton
          notActive={!showRealTimePoints}
          onClick={() => {
            setShowRealTimePoints(!showRealTimePoints);
          }}
        >
          <Tooltip title={t('deployer.singleTask.visiblePoints')}>
            <GrainIcon fontSize={'large'} />
          </Tooltip>
        </IconStyleButton>
        <IconStyleButton
          onClick={() => {
            setAgvViewLock(!agvViewLock);
          }}
          notActive={!agvViewLock}
        >
          <Tooltip title={t('deployer.singleTask.agvViewLock')}>
            {agvViewLock ? <LockIcon fontSize={'large'} style={{}} /> : <LockOpenIcon fontSize={'large'} style={{}} />}
          </Tooltip>
        </IconStyleButton>
      </div>
    </div>
  );
});

export default memo(MapActionBar);
