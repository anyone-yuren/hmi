import { useTranslation } from 'react-i18next';

import { FileUpload } from '@mui/icons-material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import StreamIcon from '@mui/icons-material/Stream';
import { Menu, MenuItem, ThemeProvider, Tooltip } from '@mui/material';
import { toast } from 'sonner';
import 'swiper/css';
import { IMode } from '../index.d';

import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { createTheme } from '@mui/material/styles';
import { forwardRef, memo, useCallback, useMemo, useState } from 'react';
import { IconStyleButton } from '../Style';
import { setTaskMode, uploadRcsMap } from '../services';

import SettingsIcon from '@mui/icons-material/Settings';
import { Upload, UploadProps } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';

const MapActionBar = forwardRef((props: any, ref) => {
  const { setTaskSettingVisible, setTaskVisible, stageRef, setMoveToTarget, taskMode, modeHashMap, getMapTaskMode } =
    props;
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    fileList,
  };

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
          }}
        >
          <Tooltip title={t('deployer.singleTask.setting')} placement='bottom'>
            <SettingsIcon fontSize={'large'} />
            {/* <SettingIconWithoutLine fontSize={50} /> */}
          </Tooltip>
        </IconStyleButton>

        <IconStyleButton
          onClick={() => {
            const { x, y } = stageRef?.current?.getVehiclePosition();
            if (x != null && y != null) {
              stageRef?.current && stageRef?.current?.setStageScale(1);
              console.log('taskmode', x, y);
              setMoveToTarget({ x: x * 20, y: -y * 20 } as any);
            } else {
              toast.error(t('deployer.singleTask.noData'));
            }
          }}
        >
          <Tooltip title={t('deployer.singleTask.location')}>
            <GpsFixedIcon fontSize={'large'} />
          </Tooltip>
        </IconStyleButton>
        {!isMultiwayAgv && (
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
            //
          }}
        >
          <Tooltip title={t('deployer.singleTask.offsetTable')}>
            <StreamIcon fontSize={'large'} />
          </Tooltip>
        </IconStyleButton>
      </div>
    </div>
  );
});

export default memo(MapActionBar);
