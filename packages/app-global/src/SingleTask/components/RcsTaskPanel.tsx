import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import BorderColorIcon from '@mui/icons-material/BorderColor';
import CloseIcon from '@mui/icons-material/Close';
import { Button, MenuItem, Tab, Tabs, Typography } from '@mui/material';
import { useAsyncEffect, useRequest } from 'ahooks';
import { Input } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import EmptyBox from '../components/Empty';
import MwConfirm from '../components/MwConfirm';
import useTransRequest from '../hooks/useTransRequest';
import {
  createRcsMissionFormTemplate,
  createRcsTask,
  createRcsTemplateTask,
  deleteRcsTemplateTask,
  getHeightInfo,
  getPalletList,
  getRcsTaskList,
  getRcsTemplateTaskList,
  updateRcsMissionState,
  updateRcsTemplateTaskList,
} from '../services/index';
import { useSingleTaskStore } from '../store/singleTask.store';
import {
  generateUniqueId,
  InputGroup,
  MapTaskPanelAction,
  MapTaskPanelList,
  MapTaskPanelListHeader,
  MapTaskSelect,
  TaskItem,
} from '../Style';
import useConstants from '../useConstants';
import MainButton from './MainButton';
import PointOrLineBox from './PointOrLineBox';
import DeleteIcon from './SvgIcon/DeleteIcon';
import EditIcon from './SvgIcon/EditIcon';
import PointsAdd from './SvgIcon/PointsAdd';
import StartIcon from './SvgIcon/StartIcon';
import TaskArrow from './SvgIcon/TaskArrow';

const ArrowIconBox = (props: any) => {
  return (
    <div {...props} className='flex-1 flex items-center justify-items-center bg-[#627881] rounded-[6px]'>
      {props.children}
    </div>
  );
};

const InputAntdText = (props: any) => {
  const { title, value, onChange } = props;
  return (
    <InputGroup sx={{ flex: 1 }}>
      <div className='title'>{title}</div>
      <div className='content'>
        <Input
          className='flex-1 p-0 text-[16px]'
          variant='borderless'
          value={value}
          onChange={(event: any) => {
            onChange(event.target.value);
          }}
        />
        <EditIcon fontSize={14}></EditIcon>
      </div>
    </InputGroup>
  );
};

export type IActive = 'task' | 'template';
interface IProps {
  close: () => void;
  preTaskList: any[];
  setPreTaskList: (list: any[]) => void;
  initTaskActionRow: any;
  points: any[];
  charges: any[];
  locations: any[];
  isKVehicle: boolean;
  setRcsModalConfig: (obj: any) => void;
  vehicleNum: number;
}

const RcsTaskPanel = (props: IProps) => {
  const {
    close,
    preTaskList,
    initTaskActionRow,
    setPreTaskList,
    points,
    charges,
    locations,
    isKVehicle = false,
    setRcsModalConfig,
    vehicleNum,
  } = props;
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState<IActive>('task');
  const [loading, setLoading] = useState(false);
  const [loopTime, setLoopTime] = useState(1);
  const [palletNo, setPalletNo] = useState(null);
  const [templateId, setTemplateId] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateTaskList, setTemplateTaskList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [taskMode, setTaskMode] = useState('create');
  const { data: heightResponse } = useRequest(() => getHeightInfo(), {});
  const taskActionRef = useRef<any>(null);

  const { runAsync: getTemplateTaskListAsync } = useRequest(
    () => {
      return getRcsTemplateTaskList(vehicleNum);
    },
    {
      manual: true,
      onSuccess: (response) => {
        const ary =
          response?.data?.items?.map((item: any) => {
            const template = JSON.parse(item.template);
            const palletAry = JSON.parse(template?.extraProperties.containerTypeCodes);
            return {
              id: item.id,
              templateName: item.templateName,
              createTime: item.creationTime,
              loop: template?.missionCount,
              pallet: palletAry[0],
              tasks: template?.missionItems?.map((item) => ({
                id: item.missionItemSerial,
                point: item.destination,
                state: item.missionItemState,
                type: item.missionItemType,
                task_low_height: item.extraProperties?.initialHeight,
                task_high_height: item.extraProperties?.finalHeight,
                task_point_id: item.destination,
                expand: false,
                task_charge_type: item?.extraProperties?.completeType,
                threshold: item?.extraProperties?.completeValue,
                task_type: rcsConfigHashMap[item.missionItemType]?.type || 'Null',
                params1: item?.extraProperties?.param3,
                params2: item?.extraProperties?.param4,
                fork_direction: item?.extraProperties?.param3,
                param: [0, 0, 0, 0],
              })),
            };
          }) || [];
        setTemplateTaskList(ary);
      },
    },
  );
  const { runAsync: getTaskListAsync } = useRequest(
    () => {
      return getRcsTaskList(vehicleNum);
    },
    {
      manual: true,
      onSuccess: (res) => {
        // missionState 0: 待执行 1: 运行中
        const missionStateRange = [0, 1];
        const ary: any = [];
        for (let index = 0; index < res?.data?.items?.length; index++) {
          const element = res?.data?.items[index];
          if (missionStateRange.includes(element.missionState)) {
            ary.push({
              id: element.id,
              state: element.missionState,
              trajectory: element.missionTrajectory,
              loop: element.missionCycleCount,
              tasks: element?.missionItems?.map((item: any) => {
                return {
                  id: item.id,
                  point: item.destination,
                  state: item.missionItemState,
                  type: item.missionItemType,
                };
              }),
            });
          }
        }
        setTaskList(ary);
      },
    },
  );
  const { data: palletList }: any = useTransRequest(getPalletList, {
    translate: (response) => {
      return (
        response?.data?.map((item) => {
          return {
            id: item.pallet_id,
            name: item.pallet_name,
          };
        }) || []
      );
    },
  });

  const { refreshTaskList } = useSingleTaskStore((store) => ({
    refreshTaskList: store.refreshTaskList,
  }));

  const { TaskStatusHashMap } = useConstants();

  useAsyncEffect(async () => {
    console.log('refreshTaskList', refreshTaskList);
    if (refreshTaskList > 1) {
      getTaskListAsync();
    }
  }, [refreshTaskList]);

  const options: any = useMemo(() => {
    return heightResponse?.data || [];
  }, [heightResponse]);

  const list = useMemo(() => {
    return { task: taskList || [], template: templateTaskList || [] }[activeKey] || [];
  }, [taskList, templateTaskList, activeKey]);

  const pointsHash: any = useMemo(() => {
    return {
      Pick: locations,
      Place: locations,
      Charge: charges,
      Null: points,
    };
  }, [points, charges, locations]);

  const isTask = useMemo(() => {
    return activeKey === 'task';
  }, [activeKey]);

  useEffect(() => {
    setTaskMode('create');
  }, []);

  useAsyncEffect(async () => {
    isTask ? await getTaskListAsync() : await getTemplateTaskListAsync();
  }, [isTask]);

  useEffect(() => {
    console.log('palletList', palletList);
  }, [palletList]);
  const handleAdd = () => {
    const list = _.cloneDeep([...preTaskList]);
    const obj = { ...initTaskActionRow, id: generateUniqueId() };
    list.push(obj);
    setPreTaskList(list);
    taskActionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUpTaskIndex = (index) => {
    if (index === 0) return;
    const newList = [...preTaskList];
    [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
    setPreTaskList(newList);
  };

  const handleDownTaskIndex = (index) => {
    if (index === preTaskList.length - 1) return;
    const newList = [...preTaskList];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setPreTaskList(newList);
  };

  const handleDeleteTask = (index) => {
    if (preTaskList.length === 1) {
      setPreTaskList([{ ...initTaskActionRow }]);
    } else {
      const list = [...preTaskList];
      list.splice(index, 1);
      setPreTaskList(list);
    }
  };

  const onValueChange = (key: string, index: number, value: any) => {
    const list = _.cloneDeep([...preTaskList]);
    if (key === 'task_type') {
      list[index] = { ...initTaskActionRow, task_type: value, id: list[index]?.id };
    } else {
      list[index][key] = value;
    }
    setPreTaskList(list);
  };

  const handleForksHeight = (event: any, index: number) => {
    const list = _.cloneDeep([...preTaskList]);
    const name = event.target.value;
    const [obj] = options.filter((item: any) => item.name === name);
    if (obj) {
      if (list[index]['task_type'] === 'Pick') {
        list[index]['task_low_height'] = obj.low_height;
        list[index]['task_high_height'] = obj.high_height;
      }
      if (list[index]['task_type'] === 'Place') {
        list[index]['task_low_height'] = obj.high_height;
        list[index]['task_high_height'] = obj.low_height;
      }
    }
    setPreTaskList(list);
  };

  const rcsConfigHashMap: any = useMemo(() => {
    return {
      1: {
        type: 'Pick',
      },
      Pick: {
        translateToRcsParams: (obj) => {
          obj['param'][0] = Number(obj?.task_low_height) || 0;
          obj['param'][1] = Number(obj?.task_high_height) || 0;
          obj['param'][2] = isKVehicle ? Number(obj?.fork_direction) : Number(obj.params1);
          obj['param'][3] = Number(obj.params2);
          obj['missionItemType'] = 1;
          obj['extraProperties'] = {};
          obj['param'][0] && (obj['extraProperties']['InitialHeight'] = obj['param'][0]);
          obj['param'][1] && (obj['extraProperties']['FinalHeight'] = obj['param'][1]);
          obj['param'][2] && (obj['extraProperties']['Param3'] = obj['param'][2]);
          obj['param'][3] && (obj['extraProperties']['Param4'] = obj['param'][3]);
          obj['vehicleNum'] = vehicleNum;
          obj['destination'] = obj['task_point_id'];
          return _.pick(obj, ['missionItemType', 'extraProperties', 'vehicleNum', 'destination']);
        },
      },
      2: {
        type: 'Place',
      },
      Place: {
        translateToRcsParams: (obj) => {
          obj['param'][0] = Number(obj?.task_low_height) || 0;
          obj['param'][1] = Number(obj?.task_high_height) || 0;
          obj['param'][2] = isKVehicle ? Number(obj?.fork_direction) : Number(obj.params1);
          obj['param'][3] = Number(obj.params2);
          obj['missionItemType'] = 2;
          obj['extraProperties'] = {};
          obj['param'][0] && (obj['extraProperties']['InitialHeight'] = obj['param'][0]);
          obj['param'][1] && (obj['extraProperties']['FinalHeight'] = obj['param'][1]);
          obj['param'][2] && (obj['extraProperties']['Param3'] = obj['param'][2]);
          obj['param'][3] && (obj['extraProperties']['Param4'] = obj['param'][3]);
          obj['vehicleNum'] = vehicleNum;
          obj['destination'] = obj['task_point_id'];
          return _.pick(obj, ['missionItemType', 'extraProperties', 'vehicleNum', 'destination']);
        },
      },
      0: {
        type: 'Null',
      },
      Null: {
        translateToRcsParams: (obj) => {
          obj['missionItemType'] = 0;
          obj['vehicleNum'] = vehicleNum;
          obj['extraProperties'] = {};
          obj['destination'] = obj['task_point_id'];
          return _.pick(obj, ['missionItemType', 'extraProperties', 'vehicleNum', 'destination']);
        },
      },
      3: {
        type: 'Charge',
      },
      Charge: {
        translateToRcsParams: (obj) => {
          obj['missionItemType'] = 3;
          obj['param'][0] = Number(obj?.task_charge_type) || 0;
          obj['param'][1] = Number(obj?.threshold) || 0;
          obj['extraProperties'] = {
            CompleteType: obj['param'][0],
            CompleteValue: obj['param'][1],
          };
          obj['destination'] = obj['task_point_id'];
          return _.pick(obj, ['missionItemType', 'extraProperties', 'vehicleNum', 'destination']);
        },
      },
    };
  }, [vehicleNum]);

  const getParamsFormTaskList = (ary) => {
    const palletString = JSON.stringify([palletNo]);
    let initParams = {
      isAutoCompleted: true,
      priority: 1,
      platformSource: 6,
      missionCount: loopTime,
      missionItems: [],
      extraProperties: {
        ContainerTypeCodes: palletString,
      },
    };
    const missionItems: any = [];
    const types: any = [];

    for (let index = 0; index < ary.length; index++) {
      const type = ary[index].task_type;
      types.push(type);
      missionItems.push(rcsConfigHashMap[type].translateToRcsParams(ary[index]));
    }
    types.includes('Charge') ? (initParams['missionType'] = 1) : (initParams['missionType'] = 0);
    initParams['missionItems'] = missionItems;
    return initParams;
  };
  const validateParams = (ary: any) => {
    let isPass = true;

    let hasCharge = false;
    let hasCarry = false;
    let hasEmpty = false;
    for (let index = 0; index < ary.length; index++) {
      if (ary[index].task_type === 'Charge') {
        hasCharge = true;
      } else {
        hasCarry = true;
      }
      if (!ary[index]['task_type'] || !ary[index]['task_point_id']) {
        hasEmpty = true;
      }
    }
    if (hasCarry && hasCharge) {
      isPass = false;
      toast.error(t('deployer.singleTask.createTaskTips'));
    }
    if (hasEmpty) {
      isPass = false;
      toast.error(t('deployer.singleTask.pointSelectTip'));
    }
    if (!palletNo) {
      isPass = false;
      toast.error(t('deployer.singleTask.plsSelectPallet'));
    }
    return isPass;
  };

  const onFinish = useCallback(
    async (isTemplateFinish?: boolean) => {
      setPreTaskList([initTaskActionRow]);
      isTask
        ? isTemplateFinish
          ? setActiveKey('template')
          : await getTaskListAsync()
        : await getTemplateTaskListAsync();
    },
    [isTask],
  );
  const handleSubmit = async () => {
    const isValidate = validateParams(preTaskList);
    if (!isValidate) return;
    const params = getParamsFormTaskList(preTaskList);
    setLoading(true);
    try {
      await createRcsTask(params);
      setLoading(false);
      setLoopTime(1);
      setPalletNo(null);
      setTemplateName('');
      setActiveKey('task');
      onFinish();
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const handleSubmitTemplate = async () => {
    const isValidate = validateParams(preTaskList);
    if (!isValidate) return;
    if (!templateName) {
      toast.error(t('deployer.singleTask.templateNameTips'));
      return;
    }
    const template = getParamsFormTaskList(preTaskList);
    const params = {
      templateName,
      template,
      vehicleNum,
      platformSource: 6,
    };
    setLoading(true);
    try {
      await createRcsTemplateTask(params);
      setLoading(false);
      setLoopTime(1);
      setPalletNo(null);
      setTemplateName('');
      setActiveKey('template');
      onFinish(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTaskDelete = async (mainTask: any) => {
    const hashMap = {
      title: {
        task: t('deployer.singleTask.deleteTask'),
        template: t('deployer.singleTask.deleteTemplate'),
      },
      content: {
        task: `[${mainTask?.trajectory}]:` + t('deployer.singleTask.confirmDeleteTaskTips'),
        template: `[${mainTask?.templateName}]:` + t('deployer.singleTask.confirmDeleteTemplateTips'),
      },
      onOk: {
        task: async () => {
          console.log(mainTask);
          const params = {
            id: mainTask?.id,
            platformSource: 6,
            missionState: 3,
          };
          await updateRcsMissionState(params);
          toast.success(t('common.actionSuccess'));
          await getTaskListAsync();
        },
        template: async () => {
          await deleteRcsTemplateTask({ id: mainTask?.id });
          toast.success(t('common.actionSuccess'));
          await getTemplateTaskListAsync();
        },
      },
    };
    MwConfirm.confirm({
      title: hashMap.title[activeKey],
      content: hashMap.content[activeKey],
      onOk: hashMap.onOk[activeKey],
    });
  };

  const handleCreateTaskFormTemp = async (template: any) => {
    await createRcsMissionFormTemplate({ id: template.id });
    toast.success(t('common.actionSuccess'));
    setActiveKey('task');
  };

  const handleOption = (option, type) => {
    setRcsModalConfig({
      visible: true,
      rows: option?.tasks,
      mode: type,
    });
  };

  const handleTemplateUpdate = (template) => {
    setTaskMode('update');
    setPreTaskList(template.tasks);
    setTemplateId(template.id);
    setLoopTime(template.loop);
    setPalletNo(template.pallet);
    setTemplateName(template.templateName);
  };

  const handleUpdateTemplate = async () => {
    const isValidate = validateParams(preTaskList);
    if (!isValidate) return;
    if (!templateName) {
      toast.error(t('deployer.singleTask.templateNameTips'));
      return;
    }
    const template = getParamsFormTaskList(preTaskList);
    const params = {
      templateName,
      template,
      vehicleNum,
      id: templateId,
      platformSource: 6,
    };
    setLoading(true);
    try {
      await updateRcsTemplateTaskList(params);
      setLoading(false);
      exitUpdateTemplate();
    } catch (err) {
      console.log(err);
    }
  };

  const panelListHashMap = () => {
    return {
      task: (list) => {
        return list?.map((taskItem) => {
          return (
            <TaskItem>
              <div
                className='flex-1 flex flex-col justify-center'
                onClick={() => {
                  handleOption(taskItem, 'task');
                }}
              >
                <div className='title'>
                  <span>
                    {t('deployer.singleTask.trajectory')}:{taskItem?.trajectory || '-'}
                  </span>
                </div>
                <div className='content'>
                  <span
                    style={{
                      color: TaskStatusHashMap?.[taskItem?.state].color,
                    }}
                  >
                    {TaskStatusHashMap?.[taskItem?.state].text || '-'}
                  </span>
                  &nbsp;&nbsp;
                  <span style={{ fontSize: '12px' }}>
                    {t('deployer.singleTask.loopCount')}: {taskItem?.loop}
                  </span>
                </div>
              </div>
              <div className='flex items-center pl-2'>
                <DeleteIcon
                  fontSize={18}
                  isActive
                  onClick={() => {
                    handleTaskDelete(taskItem);
                  }}
                ></DeleteIcon>
              </div>
            </TaskItem>
          );
        });
      },
      template: (list) => {
        return list?.map((template: any) => {
          return (
            <TaskItem>
              <div className='flex items-center'>
                <StartIcon
                  color={'#00d1d1'}
                  fontSize={18}
                  isActive
                  onClick={() => {
                    handleCreateTaskFormTemp(template);
                  }}
                ></StartIcon>
              </div>
              <div
                className='flex-1 flex flex-col justify-center'
                onClick={() => {
                  handleOption(template, 'template');
                }}
              >
                <div className='title'>{template?.templateName || '-'}</div>
                <div className='content' style={{ fontSize: 12 }}>
                  {t('common.createTime')}:{dayjs(template?.createTime)?.format('YYYY-MM-DD HH:mm:ss') || '-'}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <BorderColorIcon
                  sx={{ fontSize: 18, color: 'white' }}
                  onClick={() => {
                    // handleTaskUpdate(template);
                    handleTemplateUpdate(template);
                  }}
                ></BorderColorIcon>
                <DeleteIcon
                  fontSize={18}
                  isActive
                  onClick={() => {
                    handleTaskDelete(template);
                  }}
                ></DeleteIcon>
              </div>
            </TaskItem>
          );
        });
      },
    };
  };

  const exitUpdateTemplate = () => {
    setTaskMode('create');
    setLoopTime(1);
    setPalletNo(null);
    setTemplateName('');
    onFinish && onFinish(true);
  };

  return (
    <>
      <div className='relative flex flex-col gap-1 h-full'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Typography sx={{ fontSize: '20px' }} variant='h5'>
              {'RCS' + ' ' + t('deployer.singleTask.task')}
            </Typography>
            <PointsAdd fontSize={18} onClick={handleAdd}></PointsAdd>
          </div>
          <CloseIcon fontSize={'large'} onClick={close}></CloseIcon>
        </div>
        <MapTaskPanelAction>
          {taskMode === 'update' && (
            <div className='sticky top-0 text-[#facc14] bg-[#44606b] text-center z-[10] py-[6px] mb-1'>
              {t('deployer.singleTask.updateTemplateTips')}
            </div>
          )}
          <div className='listContainer'>
            {preTaskList.map((task: any, index: number) => {
              return (
                <div className='bg-[#00d1d11a] flex rounded-[10px]' key={'task_action_' + task?.id}>
                  <div className='flex flex-col items-center p-[6px] pr-[0px] gap-[6px]'>
                    <ArrowIconBox
                      onClick={() => {
                        handleUpTaskIndex(index);
                      }}
                    >
                      <ArrowUpwardIcon />
                    </ArrowIconBox>
                    <ArrowIconBox
                      onClick={() => {
                        handleDownTaskIndex(index);
                      }}
                    >
                      <ArrowDownwardIcon />
                    </ArrowIconBox>
                  </div>
                  <div className='flex flex-col flex-1'>
                    <div className='flex items-center gap-[6px] m-[6px] rounded-[6px] bg-[#d8d8d833]'>
                      <div className='flex-1'>
                        <PointOrLineBox
                          key='left'
                          title={task.task_type}
                          subTitle={t('deployer.singleTask.plsSelectTaskType')}
                          list={[
                            { id: 'Pick', label: t('common.taskState.pickUp') },
                            { id: 'Place', label: t('common.taskState.pickDown') },
                            { id: 'Charge', label: t('common.taskState.charging') },
                            { id: 'Null', label: t('common.taskState.moving') },
                          ]}
                          onChange={(type: any) => {
                            onValueChange('task_type', index, type);
                          }}
                        ></PointOrLineBox>
                      </div>
                      <TaskArrow fontSize={20} Opacity={1} />
                      <div className='flex-1'>
                        <PointOrLineBox
                          key='right'
                          title={task.task_point_id}
                          subTitle={t('deployer.singleTask.plsSelectPoint')}
                          list={pointsHash?.[task.task_type] || []}
                          onChange={(id: any) => {
                            onValueChange('task_point_id', index, id);
                          }}
                        ></PointOrLineBox>
                      </div>
                      <div className='w-[30px] h-[54px] flex items-center'>
                        <DeleteIcon
                          fontSize={18}
                          onClick={() => {
                            handleDeleteTask(index);
                          }}
                        ></DeleteIcon>
                      </div>
                    </div>

                    {task.task_type === 'Charge' && (
                      <div className='flex gap-[6px] m-[6px] mt-[0px]'>
                        <InputGroup sx={{ flex: 1 }}>
                          <div className='title'>{t('deployer.singleTask.chargeType')}</div>
                          <MapTaskSelect
                            variant={'outlined'}
                            displayEmpty
                            value={task?.task_charge_type}
                            onChange={(event: any) => {
                              onValueChange('task_charge_type', index, event.target.value);
                            }}
                          >
                            <MenuItem value={1}>{t('deployer.singleTask.percentage')}</MenuItem>
                            <MenuItem value={3}>{t('deployer.singleTask.time')}</MenuItem>
                          </MapTaskSelect>
                        </InputGroup>
                        <InputAntdText
                          title={t('deployer.singleTask.threshold') + (task.task_charge_type === 1 ? '(%)' : '(h)')}
                          value={task?.threshold}
                          onChange={(value) => {
                            onValueChange('threshold', index, value);
                          }}
                        ></InputAntdText>
                      </div>
                    )}

                    {(task.task_type === 'Pick' || task.task_type === 'Place') && (
                      <>
                        <div className='flex gap-[6px] m-[6px] mt-[0px]'>
                          <InputGroup>
                            <div className='title'>{t('deployer.singleTask.name')}</div>
                            <MapTaskSelect
                              size={'small'}
                              variant={'outlined'}
                              displayEmpty
                              defaultValue={''}
                              onChange={(event: any) => {
                                handleForksHeight(event, index);
                              }}
                            >
                              {options?.length ? (
                                options?.map((item: any) => {
                                  return <MenuItem value={item.name}>{`${item.name}`}</MenuItem>;
                                })
                              ) : (
                                <MenuItem value={'no-data'} disabled>
                                  {t('common.noData')}
                                </MenuItem>
                              )}
                            </MapTaskSelect>
                          </InputGroup>
                          <InputAntdText
                            title={t('deployer.singleTask.forkInHeight')}
                            value={task?.task_low_height}
                            onChange={(val: number) => {
                              onValueChange('task_low_height', index, val);
                            }}
                          ></InputAntdText>
                          <InputAntdText
                            title={t('deployer.singleTask.forkOutHeight')}
                            value={task?.task_high_height}
                            onChange={(val: number) => {
                              onValueChange('task_high_height', index, val);
                            }}
                          ></InputAntdText>
                          <div
                            className='flex items-center justify-center w-[15px]'
                            onClick={() => {
                              onValueChange('expand', index, !task.expand);
                            }}
                          >
                            <StartIcon
                              fontSize={12}
                              sx={{
                                transform: !task.expand ? 'rotate(180deg)' : 'rotate(90deg)',
                                transition: 'all 0.2s ease-in-out',
                              }}
                            />
                          </div>
                        </div>

                        {task.expand && (
                          <div className='flex gap-[6px] m-[6px] mt-[0px]'>
                            {isKVehicle ? (
                              <InputGroup>
                                <div className='title'>{t('deployer.singleTask.forkDirection')}</div>
                                <MapTaskSelect
                                  size={'small'}
                                  variant={'outlined'}
                                  displayEmpty
                                  defaultValue={''}
                                  onChange={(event: any) => {
                                    const name = event.target.value;
                                    onValueChange('fork_direction', index, name);
                                  }}
                                >
                                  <MenuItem value={0}>{`${t('deployer.singleTask.front')}`}</MenuItem>
                                  <MenuItem value={1}>{`${t('deployer.singleTask.left')}`}</MenuItem>
                                  <MenuItem value={2}>{`${t('deployer.singleTask.right')}`}</MenuItem>
                                </MapTaskSelect>
                              </InputGroup>
                            ) : (
                              <InputAntdText
                                title={t('deployer.singleTask.extraParams') + '1'}
                                value={task?.params1}
                                onChange={(val: number) => {
                                  onValueChange('params1', index, val);
                                }}
                              ></InputAntdText>
                            )}
                            <InputAntdText
                              title={t('deployer.singleTask.extraParams') + '2'}
                              value={task?.params2}
                              onChange={(val: number) => {
                                onValueChange('params2', index, val);
                              }}
                            ></InputAntdText>
                            <div className='w-[15px]'></div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={taskActionRef} style={{ height: '0px' }}></div>
          </div>
          <div>
            <div className='flex gap-[6px] mt-[6px]'>
              <InputAntdText
                title={t('deployer.singleTask.loopCount')}
                value={loopTime}
                onChange={(val: any) => {
                  !Number(val) ? setLoopTime(1) : setLoopTime(Number(val));
                }}
              ></InputAntdText>
              <InputGroup sx={{ flex: 1 }}>
                <div className='title'>{t('deployer.singleTask.pallet')}</div>
                <MapTaskSelect
                  variant={'outlined'}
                  displayEmpty
                  value={palletNo}
                  onChange={(event: any) => {
                    setPalletNo(event.target.value);
                  }}
                >
                  {palletList?.length ? (
                    palletList?.map((item: any) => {
                      return <MenuItem value={item.id}>{item.name}</MenuItem>;
                    })
                  ) : (
                    <MenuItem value={'no-data'} disabled>
                      {t('common.noData')}
                    </MenuItem>
                  )}
                </MapTaskSelect>
              </InputGroup>
              <InputAntdText
                title={t('deployer.singleTask.templateName')}
                value={templateName}
                mode={'default'}
                onChange={setTemplateName}
              ></InputAntdText>
            </div>
            {taskMode === 'create' && (
              <div className='flex gap-[6px]'>
                <div style={{ flex: 2 }}>
                  <MainButton
                    loading={loading}
                    onClick={() => {
                      handleSubmit();
                      // vehicleOnPoint ? handleSubmit() : showConfirm();
                    }}
                  ></MainButton>
                </div>
                <Button
                  disabled={loading}
                  variant='contained'
                  disableElevation
                  sx={{ marginTop: '5px', color: 'white', minWidth: '120px', maxWidth: '220px' }}
                  onClick={() => {
                    handleSubmitTemplate();
                  }}
                >
                  {t('deployer.singleTask.saveAsTemplate')}
                </Button>
              </div>
            )}
            {taskMode === 'update' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 2 }}>
                  <Button
                    variant='contained'
                    disableElevation
                    // disabled={updateTemplateLoading}
                    sx={{
                      marginTop: '5px',
                      color: 'white',
                      width: '100%',
                      height: '52px',
                      background: '#facc14',
                      '&:hover': { background: '#facc14' },
                    }}
                    onClick={handleUpdateTemplate}
                  >
                    {t('deployer.singleTask.saveTemplate')}
                  </Button>
                </div>
                <Button
                  variant='contained'
                  disableElevation
                  sx={{ marginTop: '5px', color: 'white', minWidth: '120px', maxWidth: '220px' }}
                  onClick={exitUpdateTemplate}
                >
                  {t('deployer.singleTask.backUpdateMode')}
                </Button>
              </div>
            )}
          </div>
        </MapTaskPanelAction>

        <MapTaskPanelList>
          <MapTaskPanelListHeader>
            <Tabs
              sx={{ width: '100%' }}
              value={activeKey}
              onChange={(event, newValue) => {
                setActiveKey(newValue);
              }}
              centered
            >
              <Tab sx={{ fontSize: '18px' }} label={t('deployer.singleTask.taskList')} value={'task'} />
              <Tab sx={{ fontSize: '18px' }} label={t('deployer.singleTask.taskTemplate')} value={'template'} />
            </Tabs>
          </MapTaskPanelListHeader>
          <div style={{ height: '10px' }}></div>
          {list.length ? (
            panelListHashMap()[activeKey](list)
          ) : (
            <EmptyBox
              title={t('common.noData')}
              iconColor='white'
              titleColor='white'
              backgroundColor='transparent'
            ></EmptyBox>
          )}
        </MapTaskPanelList>
      </div>
    </>
  );
};
export default memo(RcsTaskPanel);
