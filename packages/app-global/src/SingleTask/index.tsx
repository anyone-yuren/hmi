import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider } from '@mui/material';
import { useSize } from 'ahooks';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { cancelTask, getFloorData, getLineList, getPointList, getTaskMode, offsetTable } from './services';
import { InitStage } from './stage/index';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { createTheme } from '@mui/material/styles';
import { useRequest } from 'ahooks';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { generateUniqueId, MapContainer, MapTaskPanelEmptyContainer, MapTaskPopup, RenderItemRow } from './Style';
import EmptyBox from './components/Empty';
import MapActionBar from './components/MapActionBar';
import MouseEvent from './components/MouseEvent';
import OffsetModal from './components/OffsetModal';
import OffsetPanel from './components/OffsetPanel';
import SecondaryPage from './components/SecondaryPage';
import TaskPanel from './components/TaskPanel';
import TaskSetting from './components/TaskSetting';
import WsContainer from './components/wsContainer';
import './index.css';
import { IMode, IPoint, ISubTaskItem, ITaskItem } from './index.d';
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

const SingleTask = () => {
  const [activePoints, setActivePoints] = useState<IPoint['id'][]>([]);
  const [taskVisible, setTaskVisible] = useState(false);
  const [taskSettingVisible, setTaskSettingVisible] = useState(false);
  const [offsetVisible, setOffsetVisible] = useState(false);
  const [offsetModalVisible, setOffsetModalVisible] = useState(false);
  const [offsetModalConfig, setOffsetModalConfig] = useState({ type: '', point: {} });
  const [preTaskList, setPreTaskList] = useState([_.cloneDeep(initTaskActionRow)]);
  const [subTask, setSubTask] = useState<ITaskItem>();
  const [activeKey, setActiveKey] = useState('task');
  const [PopUp, setPopUp] = useState(false);
  const [moveToTarget, setMoveToTarget] = useState({ x: null, y: null });

  const { data: pointsData }: Record<string, any> = useRequest(getPointList, {});
  const { data: linesList } = useRequest(() => getLineList(), {});

  const { data: taskMode, runAsync: getMapTaskMode }: Record<string, any> = useRequest(getTaskMode, {});
  const { data: offsetList, runAsync: getOffsetList }: Record<string, any> = useRequest(offsetTable, {});

  const { data: floorMapData, runAsync: getFloorMapData }: any = useRequest(
    (floor) => {
      return getFloorData(floor);
    },
    { manual: true },
  );

  const ref = useRef<HTMLDivElement>(null);
  const taskPanelRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const offsetModalRef = useRef<any>(null);
  const size = useSize(ref);
  const { t } = useTranslation();
  const { TaskStatusHashMap, TaskTypeHashMap } = useConstants();

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
      0: t('deployer.singleTask.rcsMode'),
      3: t('deployer.singleTask.singleMode'),
    },
    showTaskPanel: {
      0: () => {
        toast.error(t('deployer.singleTask.changeModeTips'));
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

  const offsetHashMap = useMemo(() => {
    if (!offsetList || !offsetList?.data?.length) return {};
    let hashMap: any = {};
    for (let index = 0; index < offsetList?.data?.length; index++) {
      const element = offsetList?.data?.[index];
      hashMap[element.point_id] = element;
    }
    return hashMap;
  }, [offsetList]);

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
      const newPoint = {
        ...point,
        x: (point.x / 1000) * 20,
        y: (point.y / 1000) * 20,
        origin_x: point.x,
        origin_y: point.y,
        // state: 0, // 暂时关掉这个状态看看
        offsetX: offsetHashMap?.[point.id]?.x || null,
        offsetY: offsetHashMap?.[point.id]?.y || null,
        offsetUpdateTime: offsetHashMap?.[point.id]?.update_time || null,
      };
      points.push(newPoint);
      hashMap[point.id] = newPoint;
      point.type === 6 && charges.push(newPoint);
      (point.type === 1 || point.type === 4) && locations.push(newPoint);
    }
    return { hashMap, points, charges, locations };
  }, [pointsData, offsetHashMap]);

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

  const handleMouse = (type: any, point: any) => {
    const taskActionAry = ['Pick', 'Place', 'Null', 'Charge'];
    if (taskActionAry.includes(type)) {
      taskAction(type, point.id);
      return;
    }
    const offsetAry = ['Offset', 'Info'];
    if (offsetAry.includes(type)) {
      setOffsetModalVisible(true);
      setOffsetModalConfig({
        type,
        point,
      });
      setActivePoints([]);
    }
  };

  const taskAction = (type: ISubTaskItem['task_type'], id: IPoint['id']) => {
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

  const updateTask = (tasks: ITaskItem[]) => {
    if (tasks.length) {
      const ary = tasks?.filter((item: ITaskItem) => item?.task_group_id === subTask?.task_group_id);
      ary.length ? setSubTask(ary[0]) : setPopUp(false);
    } else {
      setPopUp(false);
    }
  };

  return (
    <>
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
            updateTask={updateTask}
            handleTaskOption={(item: ITaskItem, key: 'task' | 'template') => {
              if (PopUp) return;
              setActiveKey(key);
              setSubTask(item);
              setPopUp(true);
            }}
          ></TaskPanel>
        </MapTaskPopup>
      )}

      {offsetVisible && (
        <MapTaskPopup>
          <OffsetPanel
            setOffsetVisible={setOffsetVisible}
            offsetList={offsetList}
            setOffsetModalVisible={setOffsetModalVisible}
            setOffsetModalConfig={setOffsetModalConfig}
            getOffsetList={getOffsetList}
          ></OffsetPanel>
        </MapTaskPopup>
      )}

      <MapContainer>
        {/* 底部操作栏的按钮 */}
        <MapActionBar
          setTaskSettingVisible={setTaskSettingVisible}
          setTaskVisible={setTaskVisible}
          stageRef={stageRef}
          setMoveToTarget={setMoveToTarget}
          taskMode={taskMode}
          modeHashMap={modeHashMap}
          getMapTaskMode={getMapTaskMode}
          setOffsetVisible={setOffsetVisible}
        ></MapActionBar>

        {mapTaskMode !== 0 && (
          <div
            style={{
              borderRadius: '80px',
              transform: 'translate(0%, -50%)',
            }}
            className='absolute bg-[#00D1D1] w-[80px] h-[80px] pl-[10px] items-center right-[-40px] top-[50%] flex z-[1211]'
            onClick={modeHashMap.showTaskPanel[mapTaskMode]}
          >
            <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
          </div>
        )}

        <div ref={ref} className='flex-1 w-full h-full min-h-[300px]'>
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
              // stageStyle={{ background: 'white' }}
              points={{
                points: pointsDict?.points,
              }}
              size={size}
              floorMapData={floorMapData?.grid_map}
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
                    handleAction={(type: any) => {
                      handleMouse(type, pointsDict?.hashMap[id]);
                    }}
                  />
                );
              }}
            />
          ) : null}
        </div>

        <SecondaryPage
          open={PopUp as boolean}
          setOpen={setPopUp}
          fullScreen={false}
          sx={{ zIndex: 1213, width: '800px!important' }}
        >
          <div
            style={{
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
                        {isTask && <TableCell align='center'>{t('deployer.singleTask.taskNo')}</TableCell>}
                        <TableCell align='center'>{t('deployer.singleTask.point')}</TableCell>
                        <TableCell align='center'>{t('deployer.singleTask.taskType')}</TableCell>
                        {isTask && <TableCell align='center'>{t('deployer.singleTask.restCount')}</TableCell>}
                        {isTask && <TableCell align='center'>{t('common.status')}</TableCell>}
                        {isTask && <TableCell align='center'>{t('common.action')}</TableCell>}
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
                                  {t('common.delete')}
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      ) : (
                        <MapTaskPanelEmptyContainer>
                          <div>
                            <EmptyBox title={t('common.noData')} iconColor='#000' titleColor='#000'></EmptyBox>
                          </div>
                        </MapTaskPanelEmptyContainer>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ThemeProvider>
            </RenderItemRow>
          </div>
        </SecondaryPage>

        <SecondaryPage open={taskSettingVisible} setOpen={setTaskSettingVisible} fullScreen={true}>
          <TaskSetting></TaskSetting>
        </SecondaryPage>

        <SecondaryPage
          open={offsetModalVisible}
          setOpen={setOffsetModalVisible}
          fullScreen={false}
          sx={{ zIndex: 1213, width: '600px!important' }}
        >
          <OffsetModal
            {...offsetModalConfig}
            setOffsetModalVisible={setOffsetModalVisible}
            getOffsetList={getOffsetList}
          ></OffsetModal>
        </SecondaryPage>
      </MapContainer>
      <WsContainer></WsContainer>
    </>
  );
};
export default memo(SingleTask);
