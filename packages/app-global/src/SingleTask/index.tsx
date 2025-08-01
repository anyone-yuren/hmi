import { FileUpload } from '@mui/icons-material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Tooltip,
} from '@mui/material';
import { useSize } from 'ahooks';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  cancelTask,
  getFloorData,
  getLineList,
  getPointList,
  getTaskMode,
  setTaskMode,
  uploadRcsMap,
} from './services';
import { InitStage } from './stage/index';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import SettingsIcon from '@mui/icons-material/Settings';
import { createTheme } from '@mui/material/styles';
import { useRequest } from 'ahooks';
import { Upload, UploadProps } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import {
  generateUniqueId,
  IconStyleButton,
  MapContainer,
  MapTaskPanelEmptyContainer,
  MapTaskPopup,
  RenderItemRow,
} from './Style';
import EmptyBox from './components/Empty';
import MouseEvent from './components/MouseEvent';
import SecondaryPage from './components/SecondaryPage';
import TaskPanel from './components/TaskPanel';
import TaskSetting from './components/TaskSetting';
import WsContainer from './components/wsContainer';
import './index.css';
import { IMode, IPoint, ISubTaskItem, ITaskItem, IVehicle } from './index.d';
import { useSingleTaskStore } from './store/singleTask.store';
import useConstants from './useConstants';

const initTaskActionRow = {
  id: generateUniqueId(),
  task_type: '',
  task_point_id: '',
  param: [0, 0, 0, 0],
  task_type_name: '',
  task_high_height: 0,
  task_low_height: 0,
  threshold: 100,
  task_charge_type: 1,
  fork_direction: '0',
  expand: false,
  params1: 0,
  params2: 0,
};

const translateAngel = (angel: number) => {
  return 180 - (angel || 0) * (180 / Math.PI);
};

const SingleTask = () => {
  const [activePoints, setActivePoints] = useState<IPoint['id'][]>([]);
  const [taskVisible, setTaskVisible] = useState(false);
  const [taskSettingVisible, setTaskSettingVisible] = useState(false);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [preTaskList, setPreTaskList] = useState([_.cloneDeep(initTaskActionRow)]);
  const [subTask, setSubTask] = useState<ITaskItem>();
  const [activeKey, setActiveKey] = useState('task');
  const [PopUp, setPopUp] = useState(false);
  const [moveToTarget, setMoveToTarget] = useState({ x: null, y: null });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { data: pointsData }: Record<string, any> = useRequest(getPointList, {});
  const { data: linesList } = useRequest(() => getLineList(), {});

  const { data: taskMode, runAsync: getMapTaskMode }: Record<string, any> = useRequest(getTaskMode, {});

  const { data: floorMapData, runAsync: getFloorMapData } = useRequest(
    (floor) => {
      return getFloorData(floor);
    },
    { manual: true },
  );

  const ref = useRef<HTMLDivElement>(null);
  const taskPanelRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const size = useSize(ref);
  const { t } = useTranslation();
  const { TaskStatusHashMap, TaskTypeHashMap } = useConstants();

  const isMultiwayAgv = useMemo(() => {
    return false;
  }, []);

  const { robotCurrentStatus } = useSingleTaskStore(
    useShallow((state) => ({
      robotCurrentStatus: state.robotCurrentStatus,
    })),
  );
  const modeHashMap: {
    title: Record<IMode, string>;
    showTaskPanel: Record<IMode, () => void> | any;
  } = {
    title: {
      0: t('调度模式'),
      3: t('单机模式'),
    },
    showTaskPanel: {
      0: () => {
        toast.error(t('当前模式不可操作,请切换模式'));
      },
      3: () => {
        setTaskSettingVisible(false);
        setTaskVisible(true);
      },
    },
  };

  const isTask = useMemo(() => {
    return activeKey === 'task';
  }, [activeKey]);

  // 0调度 3单机
  const mapTaskMode: IMode = useMemo(() => {
    return taskMode?.data?.task_mode ?? 100;
  }, [taskMode]);

  const pointsDict = useMemo(() => {
    let hashMap: any = {},
      points: any = [],
      charges: any = [],
      locations: any = [];
    for (let index = 0; index < pointsData?.data?.length; index++) {
      const point = pointsData?.['data']?.[index] || {};
      // 暂时先这么临时处理,后面看看有没有什么办法
      point.types.length &&
        (point.type = point.types[0] === 0 && point.types.length > 1 ? point.types[1] : point.types[0]);
      hashMap[point.id] = point;
      points.push({
        ...point,
        x: (point.x / 1000) * 20,
        y: (point.y / 1000) * 20,
        state: 0,
      });
      // points.push({ ...point, state: 0 });
      point.type === 6 && charges.push(point);
      (point.type === 1 || point.type === 4) && locations.push(point);
    }
    return { hashMap, points, charges, locations };
  }, [pointsData]);

  const lines = useMemo(() => {
    const ary: any = [];
    for (let index = 0; index < linesList?.data?.length; index++) {
      const { id, end_point, start_point, control_points } = linesList?.data?.[index];
      ary.push({
        id,
        type: 1,
        start: start_point?.id,
        end: end_point?.id,
        length: 1,
        controlPoint: control_points?.map((point: any, index: number) => {
          return { x: point.x / 50, y: point.y / 50 };
        }),
        directionType: 1,
      });
    }
    return ary;
  }, [linesList]);

  useEffect(() => {
    if (robotCurrentStatus?.floor_number) {
      getFloorMapData(robotCurrentStatus?.floor_number);
    }
  }, [robotCurrentStatus]);

  // useEffect(() => {
  //   Object.keys(agvPosition).length &&
  //     setVehicles([
  //       {
  //         x: agvPosition.x,
  //         y: -agvPosition.y,
  //         id: 'dream_car',
  //         angle: translateAngel(agvPosition.angel),
  //       },
  //     ]);
  // }, [agvPosition]);

  const handleMouse = (type: ISubTaskItem['task_type'], id: IPoint['id']) => {
    !taskVisible && setTaskVisible(true);
    const list: any = [...preTaskList];
    const newList = list.filter((item: any) => item.task_point_id && item.task_type);
    newList.push(
      _.cloneDeep({
        ...initTaskActionRow,
        id: generateUniqueId(),
        task_type: type,
        task_point_id: id,
      }),
    );
    setPreTaskList(newList);
    const newActivePoints = activePoints.filter((activeId: IPoint['id']) => activeId != id);
    setActivePoints(newActivePoints);
    taskPanelRef?.current?.scrollToBottom();
  };

  const changeMapTaskMode = async (task_mode: IMode) => {
    const { code } = await setTaskMode({ task_mode });
    if (code === 200) {
      toast.success(t('修改成功'));
      getMapTaskMode();
      setAnchorEl(null);
      setTaskVisible(false);
    }
  };

  const uploadFile = useCallback((info: UploadChangeParam) => {
    const { file } = info;
    // 只在文件添加状态处理
    if (file.status === 'uploading' || !file.originFileObj) {
      const formData: any = {};
      const reader = new FileReader();

      reader.onload = () => {
        formData.data = reader.result;
        formData.filename = file.name;

        uploadRcsMap(formData)
          .then(() => {
            toast.success(t('上传成功'));
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

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    fileList,
  };

  return (
    <>
      {(() => {
        console.log('[SingleTask]: 单任务页面在渲染');
        return null;
      })()}
      {taskVisible && (
        <MapTaskPopup>
          <TaskPanel
            ref={taskPanelRef}
            {...{
              setTaskVisible,
              preTaskList,
              setPreTaskList,
              initTaskActionRow,
            }}
            {..._.pick(pointsDict, ['points', 'charges', 'locations'])}
            updateTask={(tasks: ITaskItem[]) => {
              if (tasks.length) {
                const ary = tasks?.filter((item: ITaskItem) => item?.task_group_id === subTask?.task_group_id);
                ary.length ? setSubTask(ary[0]) : setPopUp(false);
              } else {
                setPopUp(false);
              }
            }}
            handleTaskOption={(item: ITaskItem, key: 'task' | 'template') => {
              if (PopUp) return;
              setActiveKey(key);
              setSubTask(item);
              setPopUp(true);
            }}
          ></TaskPanel>
        </MapTaskPopup>
      )}

      <MapContainer>
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
            {modeHashMap.title[mapTaskMode]}
            {mapTaskMode === 0 ? `，${t('请从调度系统下发任务')}` : ''}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
            <>
              <IconStyleButton
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  setAnchorEl(event.currentTarget);
                }}
              >
                <Tooltip title={t('模式切换')}>
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
                    {t('调度模式')}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      changeMapTaskMode(3);
                    }}
                  >
                    {t('单机模式')}
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
              <Tooltip title={t('设置')} placement='bottom'>
                <SettingsIcon fontSize={'large'} />
                {/* <SettingIconWithoutLine fontSize={50} /> */}
              </Tooltip>
            </IconStyleButton>

            <IconStyleButton
              onClick={() => {
                const { x, y } = stageRef?.current?.getVehiclePosition();
                if (x != null && y != null) {
                  stageRef?.current && stageRef?.current?.setStageScale(0.08);
                  setMoveToTarget({ x: x / 50, y: -y / 50 } as any);
                } else {
                  toast.error(t('没有数据'));
                }
              }}
            >
              <Tooltip title={t('定位')}>
                <GpsFixedIcon fontSize={'large'} />
              </Tooltip>
            </IconStyleButton>
            {!isMultiwayAgv && (
              <Upload {...props} onChange={uploadFile}>
                <IconStyleButton>
                  <Tooltip title={t('上传地图')}>
                    <FileUpload fontSize={'large'} />
                  </Tooltip>
                </IconStyleButton>
              </Upload>
            )}
          </div>
        </div>
        {mapTaskMode !== 0 && (
          <div
            style={{
              position: 'absolute',
              background: '#00D1D1',
              height: '80px',
              width: '80px',
              borderRadius: '80px',
              right: -40,
              top: '50%',
              transform: 'translate(0%, -50%)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 10,
              zIndex: 1211,
            }}
            onClick={modeHashMap.showTaskPanel[mapTaskMode]}
          >
            <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
          </div>
        )}

        <Box ref={ref} flex={1} sx={{ width: '100%', height: '100%', minHeight: '300px' }}>
          {pointsDict?.points.length ? (
            <InitStage
              ref={stageRef}
              infiniteView={true}
              allPointsVisible={true}
              boundary={{
                boundaryVisible: false,
              }}
              lines={{
                lines,
                lineVisible: true,
              }}
              stageStyle={{ background: 'white' }}
              points={{
                points: pointsDict?.points,
              }}
              size={size}
              floorMapData={floorMapData?.grid_map}
              // vehicles={vehicles}
              pointsValue={activePoints}
              onPointsSelect={(points: IPoint['id'][]) => {
                const point = points[points.length - 1];
                point ? setActivePoints([point]) : setActivePoints([]);
              }}
              moveToTarget={moveToTarget}
              activePointsPopupDivProps={{ style: {} }}
              activePointsPopup={(id: IPoint['id']) => {
                return (
                  <MouseEvent
                    id={id}
                    hashMap={pointsDict?.hashMap}
                    handleAction={(type: ISubTaskItem['task_type']) => {
                      handleMouse(type, id);
                    }}
                  />
                );
              }}
            />
          ) : null}
        </Box>

        <SecondaryPage open={PopUp as boolean} setOpen={setPopUp} fullScreen={false} sx={{ zIndex: 1213 }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              background: 'white',
            }}
          >
            <RenderItemRow>
              <ThemeProvider
                theme={createTheme({
                  palette: {
                    mode: 'light',
                    primary: {
                      main: '#00D1D1',
                    },
                  },
                  typography: {
                    fontSize: 20,
                  },
                })}
              >
                <TableContainer sx={{ maxHeight: '450px' }}>
                  <Table size='medium' stickyHeader>
                    <TableHead>
                      <TableRow>
                        {isTask && <TableCell align='center'>{t('任务号')}</TableCell>}
                        <TableCell align='center'>{t('点号')}</TableCell>
                        <TableCell align='center'>{t('任务类型')}</TableCell>
                        {isTask && <TableCell align='center'>{t('剩余次数')}</TableCell>}
                        {isTask && <TableCell align='center'>{t('状态')}</TableCell>}
                        {isTask && <TableCell align='center'>{t('操作')}</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {subTask?.tasks?.length ? (
                        subTask?.tasks?.map((row, index) => (
                          <TableRow key={row?.task_id}>
                            {isTask && (
                              <TableCell align='center' component='th' scope='row'>
                                {row?.task_id || '-'}
                              </TableCell>
                            )}
                            <TableCell align='center'>{row?.task_point_id}</TableCell>
                            <TableCell align='center'>{TaskTypeHashMap?.[row?.task_type] || '-'}</TableCell>
                            {isTask && <TableCell align='center'>{row?.remain_count}</TableCell>}

                            {isTask && (
                              <TableCell align='center'>
                                <span
                                  style={{
                                    color: TaskStatusHashMap?.[row?.task_state]?.color || '-',
                                  }}
                                >
                                  {TaskStatusHashMap?.[row?.task_state]?.text || '-'}
                                </span>
                              </TableCell>
                            )}
                            {isTask && (
                              <TableCell align='center'>
                                <Button
                                  onClick={async () => {
                                    const { code } = await cancelTask({
                                      task_id_list: [Number(row?.task_id)],
                                    });
                                    if (code === 200) {
                                      const list = [...subTask?.tasks];
                                      list.splice(index, 1);
                                      setSubTask({
                                        ...subTask,
                                        tasks: list,
                                      });
                                      if (!list.length) {
                                        setPopUp(false);
                                      }
                                      taskPanelRef && taskPanelRef?.current && taskPanelRef?.current?.getTaskList();
                                    }
                                  }}
                                  color='error'
                                >
                                  {t('删除')}
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      ) : (
                        <MapTaskPanelEmptyContainer>
                          <div>
                            <EmptyBox title={t('没有数据')} iconColor='#000' titleColor='#000'></EmptyBox>
                          </div>
                        </MapTaskPanelEmptyContainer>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ThemeProvider>
            </RenderItemRow>
          </Box>
        </SecondaryPage>

        <SecondaryPage open={taskSettingVisible} setOpen={setTaskSettingVisible} fullScreen={true}>
          <TaskSetting></TaskSetting>
        </SecondaryPage>
      </MapContainer>
      <WsContainer></WsContainer>
    </>
  );
};
export default memo(SingleTask);
