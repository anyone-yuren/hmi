import CloseIcon from '@mui/icons-material/Close';
import { Tab, Tabs, Typography } from '@mui/material';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import {
  generateUniqueId,
  MapTaskPanel,
  MapTaskPanelHeader,
  MapTaskPanelList,
  MapTaskPanelListHeader,
  TaskItem,
} from '../Style';
import EmptyBox from '../components/Empty';
import PointsAdd from './SvgIcon/PointsAdd';

import { useAsyncEffect, useRequest } from 'ahooks';
import { Action, SwipeAction } from '../components/SwiperAction';
import { cancelTask, createTask, deleteTemplate, getTasks, getTemplate } from '../services/index';
import DeleteIcon from './SvgIcon/DeleteIcon';
import StartIcon from './SvgIcon/StartIcon';
import TaskAction from './TaskAction';

import { config_agv_info } from '../services/index';
import { useSingleTaskStore } from '../store/singleTask.store';

import _ from 'lodash';
import { toast } from 'sonner';
import MwConfirm from '../components/MwConfirm';
import { ITaskItem } from '../index.d';
import useConstants from '../useConstants';

export type IActive = 'task' | 'template';
const TaskPanel = forwardRef((props: any, ref) => {
  const {
    setTaskVisible,
    handleTaskOption,
    preTaskList,
    setPreTaskList,
    points,
    charges,
    locations,
    initTaskActionRow,
    updateTask,
  } = props;

  const [active, setActive] = useState<IActive>('task');
  const { data: taskList, runAsync: getTaskList } = useRequest(getTasks, {
    manual: true,
  });
  const { data: templateList, runAsync: getTemplateList } = useRequest(getTemplate, { manual: true });
  const { data: agvInfo, loading }: any = useRequest(() => config_agv_info(), {});
  const isKVehicle = useMemo(() => {
    // return true;
    return agvInfo?.executor === 13;
  }, [agvInfo]);
  const move = useRef(false);
  const taskActionRef = useRef<any>(null);
  const { t } = useTranslation();
  const { TaskStatusHashMap } = useConstants();
  const isTask = useMemo(() => {
    return active === 'task';
  }, [active]);
  const list = useMemo(() => {
    return { task: taskList?.data || [], template: templateList?.data || [] }[active] || [];
  }, [taskList, templateList, active]);

  const { refreshTaskList } = useSingleTaskStore((store) => ({
    refreshTaskList: store.refreshTaskList,
  }));

  useImperativeHandle(
    ref,
    () => ({
      getTaskList,
      getTemplateList,
      scrollToBottom: () => {
        taskActionRef?.current?.scrollToBottom();
      },
    }),
    [],
  );

  useEffect(() => {
    isTask ? getTaskList() : getTemplateList();
  }, [active]);

  useAsyncEffect(async () => {
    if (refreshTaskList) {
      const { data } = await getTaskList();
      updateTask(data || []);
    }
  }, [refreshTaskList]);

  const rightActions: Action[] = [
    {
      key: 'delete',
      text: t('common.delete'),
      color: 'danger',
      iconStyle: { width: '50px' },
      icon: (
        <div style={{ display: 'flex' }}>
          <DeleteIcon fontSize={26} isActive onClick={() => {}}></DeleteIcon>
        </div>
      ),
      onClick: async () => {},
    },
  ];

  const runActions: Action[] = [
    {
      key: 'start',
      text: t('deployer.singleTask.execute'),
      color: 'danger',
      iconStyle: { width: '50px' },
      icon: (
        <div style={{ display: 'flex' }}>
          <StartIcon fontSize={26} isActive></StartIcon>
        </div>
      ),
      onClick: async () => {},
    },
  ];

  const handleTaskDelete = async (mainTask: ITaskItem | any) => {
    const hashMap = {
      title: {
        task: t('deployer.singleTask.deleteTask'),
        template: t('deployer.singleTask.deleteTemplate'),
      },
      content: {
        task: `[${mainTask?.task_group_id}]:` + t('deployer.singleTask.confirmDeleteTaskTips'),
        template: `[${mainTask?.name}]:` + t('deployer.singleTask.confirmDeleteTemplateTips'),
      },
      onOk: {
        task: async () => {
          const task = mainTask?.tasks || [];
          const subTaskId = task?.map((sub: any) => Number(sub.task_id));
          const { code } = await cancelTask({ task_id_list: subTaskId });
          if (code === 200) {
            getTaskList();
          }
        },
        template: async () => {
          const { code } = await deleteTemplate({ name: mainTask?.name });
          if (code === 200) {
            getTemplateList();
          }
        },
      },
    };
    MwConfirm.confirm({
      title: hashMap.title[active],
      content: hashMap.content[active],
      onOk: hashMap.onOk[active],
    });
  };

  const handleTaskStart = async (template: any) => {
    const params = _.cloneDeep(template);
    delete params.name;
    const { code } = await createTask(params);
    if (code === 200) {
      toast.success(t('common.actionSuccess'));
      setActive('task');
    }
  };

  const onFinish = useCallback(
    (isTemplateFinish?: boolean) => {
      isTask ? (isTemplateFinish ? setActive('template') : getTaskList()) : getTemplateList();
      setPreTaskList([initTaskActionRow]);
    },
    [isTask],
  );

  const handleAdd = () => {
    const list = _.cloneDeep([...preTaskList]);
    const obj = { ...initTaskActionRow, id: generateUniqueId() };
    list.push(obj);
    setPreTaskList(list);
    taskActionRef.current?.scrollToBottom();
  };

  const getMapTaskPanelListHashMap = (): any => {
    return {
      task: (list: any) => {
        return list?.map((taskItem: ITaskItem) => {
          return (
            <SwipeAction
              key={taskItem?.task_group_id}
              rightActions={rightActions}
              closeOnAction={false}
              onMove={() => {
                move.current = true;
              }}
              onAction={() => {
                handleTaskDelete(taskItem);
              }}
            >
              <TaskItem
                onClick={() => {
                  handleTaskOption && handleTaskOption(taskItem, 'task');
                }}
              >
                <div className='title'>
                  <span>{taskItem?.task_group_id || '-'}</span>
                  <span style={{ fontSize: '12px' }}>
                    {t('deployer.singleTask.loopCount')}: {taskItem?.loop_count}
                  </span>
                </div>
                <div className='content'>
                  <span
                    style={{
                      color: TaskStatusHashMap?.[taskItem?.task_state].color,
                    }}
                  >
                    {TaskStatusHashMap?.[taskItem?.task_state].text || '-'}
                  </span>
                  &nbsp;&nbsp;
                  <span style={{ fontSize: '12px' }}>
                    {t('deployer.singleTask.gapTime')}: {taskItem?.task_interval}
                  </span>
                </div>
              </TaskItem>
            </SwipeAction>
          );
        });
      },
      template: (list: any) => {
        return list?.map((template: any) => {
          return (
            <SwipeAction
              key={template?.name}
              rightActions={[...runActions, ...rightActions]}
              closeOnAction={false}
              onMove={() => {
                move.current = true;
              }}
              onAction={(object: any) => {
                const { key } = object;
                key === 'delete' && handleTaskDelete(template);
                key === 'start' && handleTaskStart(template);
              }}
            >
              <TaskItem
                onClick={() => {
                  handleTaskOption && handleTaskOption(template, 'template');
                }}
              >
                <div className='title'>{template?.name || '-'}</div>
                <div className='content' style={{ fontSize: 12 }}>
                  <span>
                    {t('deployer.singleTask.loopCount')}: {template?.loop_count}
                  </span>
                  <span>
                    {t('deployer.singleTask.gapTime')}: {template?.task_interval}
                  </span>
                </div>
              </TaskItem>
            </SwipeAction>
          );
        });
      },
    };
  };

  return (
    <MapTaskPanel>
      <MapTaskPanelHeader>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <Typography sx={{ fontSize: '20px' }} variant='h5'>
            {t('deployer.singleTask.task')}
          </Typography>
          <PointsAdd fontSize={18} onClick={handleAdd}></PointsAdd>
        </div>
        <CloseIcon
          fontSize={'large'}
          onClick={() => {
            setTaskVisible(false);
          }}
        ></CloseIcon>
      </MapTaskPanelHeader>

      <TaskAction
        ref={taskActionRef}
        {...{
          setPreTaskList,
          preTaskList,
          points,
          initTaskActionRow,
          onFinish,
          charges,
          locations,
          isKVehicle,
        }}
      ></TaskAction>

      <MapTaskPanelList>
        <MapTaskPanelListHeader>
          <Tabs
            sx={{ width: '100%' }}
            value={active}
            onChange={(event, newValue) => {
              setActive(newValue);
            }}
            centered
          >
            <Tab sx={{ fontSize: '18px' }} label={t('deployer.singleTask.taskList')} value={'task'} />
            <Tab sx={{ fontSize: '18px' }} label={t('deployer.singleTask.taskTemplate')} value={'template'} />
          </Tabs>
        </MapTaskPanelListHeader>
        <div style={{ height: '10px' }}></div>
        {list.length ? (
          getMapTaskPanelListHashMap()[active](list)
        ) : (
          <EmptyBox
            title={t('common.noData')}
            iconColor='white'
            titleColor='white'
            backgroundColor='transparent'
          ></EmptyBox>
        )}
      </MapTaskPanelList>
    </MapTaskPanel>
  );
});

export default memo(TaskPanel);
