import { Button, Grid, MenuItem, TextField } from '@mui/material';
import _ from 'lodash';
import { forwardRef, memo, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useRequest } from 'ahooks';
import { toast } from 'sonner';
import 'swiper/css';
import { InputGroup, MapTaskPanelAction, MapTaskSelect, SubTaskContainer } from '../Style';
import { addTemplate, createTask, getHeightInfo, updateTemplate } from '../services';
import MainButton from './MainButton';
import MwConfirm from './MwConfirm';
import PointOrLineBox, { PointCardContainer } from './PointOrLineBox';
import DeleteIcon from './SvgIcon/DeleteIcon';
import EditIcon from './SvgIcon/EditIcon';
import TaskArrow from './SvgIcon/TaskArrow';
import InputWidthKeyboard from './inputWithKeyboard';

import { useSingleTaskStore } from '../store/singleTask.store';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Modal } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import { transformTaskListToParams } from '../utils/index';
import StartIcon from './SvgIcon/StartIcon';

const TaskAction = forwardRef((props: any, ref) => {
  const {
    preTaskList,
    setPreTaskList,
    points,
    initTaskActionRow,
    onFinish,
    charges,
    locations,
    isKVehicle,
    taskMode,
    setTaskMode,
  } = props;
  const [loading, setLoading] = useState(false);
  const [loopTime, setLoopTime] = useState(1);
  const [intervalTime, setIntervalTime] = useState(0);
  const [templateName, setTemplateName] = useState('');
  const [initTemplateName, setInitTemplateName] = useState('');
  const { data: heightResponse } = useRequest(() => getHeightInfo(), {});
  const taskActionRef = useRef(null);

  const { loading: updateTemplateLoading, runAsync: updateTemplateAsync } = useRequest(
    (params) => updateTemplate(params),
    {
      manual: true,
      onSuccess: (res: any) => {
        toast.success(t('common.actionSuccess'));
        exitUpdateTemplate();
      },
      onError: (err: any) => {
        toast.error(err.message);
      },
    },
  );

  const [modal, contextHolder] = Modal.useModal();
  const { t } = useTranslation();
  const { rcsInfo } = useSingleTaskStore(
    useShallow((store: any) => ({
      rcsInfo: store.rcsInfo,
    })),
  );

  const vehicleOnPoint = useMemo(() => {
    return rcsInfo?.is_on_node;
  }, [rcsInfo]);

  useImperativeHandle(
    ref,
    () => ({
      scrollToBottom: () => {
        const refs: any = taskActionRef.current;
        // 不得已加个定时，跳出渲染的队列，最后执行
        setTimeout(() => {
          refs.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      },
      setPublicParams: (params: any) => {
        setLoopTime(params.loopTime);
        setIntervalTime(params.intervalTime);
        setTemplateName(params.templateName);
        setInitTemplateName(params.templateName);
      },
    }),
    [],
  );

  const options: any = useMemo(() => {
    return heightResponse?.data || [];
  }, [heightResponse]);

  const pointsHash: any = useMemo(() => {
    return {
      Pick: locations,
      Place: locations,
      Charge: charges,
      Null: points,
    };
  }, [points, charges, locations]);

  const onValueChange = (key: string, index: number, value: any) => {
    const list = _.cloneDeep([...preTaskList]);
    if (key === 'task_type') {
      list[index] = { ...initTaskActionRow, task_type: value, id: list[index]?.id };
    } else {
      list[index][key] = value;
    }
    setPreTaskList(list);
  };

  const handleDelete = (index: number) => {
    const list = [...preTaskList];
    list.splice(index, 1);
    setPreTaskList(list);
  };

  const validateParams = (params: any) => {
    let isPass = true;
    for (let index = 0; index < params.tasks.length; index++) {
      (!params.tasks[index]['task_type'] || !params.tasks[index]['task_point_id']) && (isPass = false);
    }
    return isPass;
  };

  const showConfirm = () => {
    const params = transformTaskListToParams(
      {
        loop_count: loopTime,
        task_interval: intervalTime,
        tasks: preTaskList.filter((item: any) => !!item?.task_type),
      },
      isKVehicle,
    );
    if (!params.tasks.length) return;
    const isValidate = validateParams(params);
    if (!isValidate) {
      toast.error(t('deployer.singleTask.pointSelectTip'));
      return;
    }
    modal.confirm({
      title: t('deployer.singleTask.sendTaskConfirm') + '?',
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: async () => {
        await handleSubmit();
      },
    });
  };

  const handleSubmit = async () => {
    const params = transformTaskListToParams(
      {
        loop_count: loopTime,
        task_interval: intervalTime,
        tasks: preTaskList.filter((item: any) => !!item?.task_type),
      },
      isKVehicle,
    );
    const templateParams = { name: templateName, ..._.cloneDeep(params) };
    if (!params.tasks.length) return;
    const isValidate = validateParams(params);
    if (!isValidate) {
      toast.error(t('deployer.singleTask.pointSelectTip'));
      return;
    }
    setLoading(true);
    try {
      const { code }: any = await createTask(params);
      setLoading(false);
      if (code === 200) {
        !templateParams.name && onFinish && onFinish();
        setLoopTime(1);
        setIntervalTime(0);
        setTemplateName('');
        toast.success(t('common.actionSuccess'));
        templateParams.name && saveTemplate(templateParams);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    const params = transformTaskListToParams(
      {
        loop_count: loopTime,
        task_interval: intervalTime,
        tasks: preTaskList.filter((item: any) => !!item?.task_type),
      },
      isKVehicle,
    );
    if (!params.tasks.length) return;
    const isValidate = validateParams(params);
    if (!isValidate) {
      toast.error(t('deployer.singleTask.pointSelectTip'));
      return;
    }
    const templateParams = { name: templateName, ..._.cloneDeep(params) };
    if (!templateParams.name) {
      toast.error(t('deployer.singleTask.templateNameTips'));
      return;
    }
    try {
      await saveTemplate(templateParams);
      toast.success(t('common.actionSuccess'));
      setLoopTime(1);
      setIntervalTime(0);
      setTemplateName('');
      onFinish && onFinish(true);
    } catch (error) {
      //
    }
  };

  const saveTemplate = async (params: any) => {
    await addTemplate(params);
    onFinish && onFinish();
  };

  const exitUpdateTemplate = () => {
    setTaskMode('create');
    setLoopTime(1);
    setIntervalTime(0);
    setTemplateName('');
    onFinish && onFinish(true);
  };

  return (
    <MapTaskPanelAction>
      <div className='listContainer'>
        {taskMode === 'update' && (
          <div className='sticky top-0 text-[#facc14] bg-[#44606b] text-center z-[10] py-[6px]'>
            {t('deployer.singleTask.updateTemplateTips')}
          </div>
        )}
        {preTaskList.map((task: any, index: number) => {
          return (
            <SubTaskContainer key={'task_action_' + task?.id}>
              <div className='flex flex-col gap-[5px]'>
                <div
                  className='flex-1 flex items-center justify-items-center bg-[#627881] rounded-[5px]'
                  onClick={() => {
                    if (index === 0) return;
                    const newList = [...preTaskList];
                    [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
                    setPreTaskList(newList);
                  }}
                >
                  <ArrowUpwardIcon />
                </div>
                <div
                  className='flex-1 flex items-center justify-items-center mb-[5px] bg-[#627881] rounded-[5px]'
                  onClick={() => {
                    if (index === preTaskList.length - 1) return;
                    const newList = [...preTaskList];
                    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
                    setPreTaskList(newList);
                  }}
                >
                  <ArrowDownwardIcon />
                </div>
              </div>
              <div className='flex-1 flex flex-col gap-[5px]'>
                <PointCardContainer container alignItems={'center'}>
                  <Grid item xs>
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
                  </Grid>
                  <TaskArrow fontSize={20} Opacity={1} />
                  <Grid item xs>
                    <PointOrLineBox
                      key='right'
                      title={task.task_point_id}
                      subTitle={t('deployer.singleTask.plsSelectPoint')}
                      list={pointsHash?.[task.task_type] || []}
                      onChange={(id: any) => {
                        onValueChange('task_point_id', index, id);
                      }}
                    ></PointOrLineBox>
                  </Grid>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: 30,
                      gap: 10,
                    }}
                  >
                    <DeleteIcon
                      fontSize={18}
                      onClick={() => {
                        if (preTaskList.length === 1) {
                          setPreTaskList([{ ...initTaskActionRow }]);
                        } else {
                          handleDelete(index);
                        }
                      }}
                    ></DeleteIcon>
                  </div>
                </PointCardContainer>

                <div>
                  {(task.task_type === 'Pick' || task.task_type === 'Place') && (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          gap: '5px',
                          paddingBottom: '5px',
                        }}
                      >
                        <InputGroup>
                          <div className='title'>{t('deployer.singleTask.name')}</div>
                          <MapTaskSelect
                            size={'small'}
                            variant={'outlined'}
                            displayEmpty
                            defaultValue={''}
                            onChange={(event: any) => {
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
                        <InputGroupText
                          title={t('deployer.singleTask.forkInHeight')}
                          value={task?.task_low_height}
                          onChange={(val: number) => {
                            onValueChange('task_low_height', index, val);
                          }}
                        ></InputGroupText>
                        <InputGroupText
                          title={t('deployer.singleTask.forkOutHeight')}
                          value={task?.task_high_height}
                          onChange={(val: number) => {
                            onValueChange('task_high_height', index, val);
                          }}
                        ></InputGroupText>
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
                        <div className='flex gap-[5px] pb-[5px]'>
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
                            <InputGroupText
                              title={t('deployer.singleTask.extraParams') + '1'}
                              value={task?.params1}
                              onChange={(val: number) => {
                                onValueChange('params1', index, val);
                              }}
                            ></InputGroupText>
                          )}
                          <InputGroupText
                            title={t('deployer.singleTask.extraParams') + '2'}
                            value={task?.params2}
                            onChange={(val: number) => {
                              onValueChange('params2', index, val);
                            }}
                          ></InputGroupText>
                          <div className='w-[15px]'></div>
                        </div>
                      )}
                    </>
                  )}

                  {task.task_type === 'Charge' && (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          gap: '5px',
                          paddingBottom: '5px',
                        }}
                      >
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
                        <InputGroupText
                          title={t('deployer.singleTask.threshold') + (task.task_charge_type === 1 ? '(%)' : '(h)')}
                          value={task?.threshold}
                          onChange={(val: number) => {
                            onValueChange('threshold', index, val);
                          }}
                        ></InputGroupText>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </SubTaskContainer>
          );
        })}
        <div ref={taskActionRef} style={{ height: '0px' }}></div>
      </div>

      <div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
          <InputGroupText
            title={t('deployer.singleTask.loopCount')}
            value={loopTime}
            onChange={(val: any) => {
              !Number(val) ? setLoopTime(1) : setLoopTime(Number(val));
            }}
          ></InputGroupText>
          <InputGroupText
            title={t('deployer.singleTask.gapTime') + '(s)'}
            value={intervalTime}
            onChange={(val: any) => {
              !Number(val) ? setIntervalTime(0) : setIntervalTime(Number(val));
            }}
          ></InputGroupText>
          <InputGroupText
            title={t('deployer.singleTask.templateName')}
            value={templateName}
            mode={'default'}
            onChange={setTemplateName}
          ></InputGroupText>
        </div>
        {taskMode === 'create' && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 2 }}>
              <MainButton
                loading={loading}
                onClick={() => {
                  vehicleOnPoint ? handleSubmit() : showConfirm();
                }}
              ></MainButton>
            </div>
            <Button
              variant='contained'
              disableElevation
              sx={{ marginTop: '5px', color: 'white', minWidth: '120px', maxWidth: '220px' }}
              onClick={handleSaveTemplate}
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
                disabled={updateTemplateLoading}
                sx={{
                  marginTop: '5px',
                  color: 'white',
                  width: '100%',
                  height: '52px',
                  background: '#facc14',
                  '&:hover': { background: '#facc14' },
                }}
                onClick={async () => {
                  const params = transformTaskListToParams(
                    {
                      loop_count: loopTime,
                      task_interval: intervalTime,
                      tasks: preTaskList.filter((item: any) => !!item?.task_type),
                    },
                    isKVehicle,
                  );
                  const templateParams = { name: templateName, ..._.cloneDeep(params) };
                  const sendParams = { old_info_name: initTemplateName, new_template_task: templateParams };
                  await updateTemplateAsync(sendParams);
                }}
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
      {contextHolder}
    </MapTaskPanelAction>
  );
});

const InputGroupText = (props: any) => {
  const { title, value, onChange, mode = 'number', inputLabel } = props;
  const [newInputValue, setNewInputValue] = useState(value);
  const isMultiwayAgv = useMemo(() => {
    return false;
  }, []);
  // const { isMultiwayAgv } = useGlobaltore(
  //   useShallow((store) => ({
  //     isMultiwayAgv: store.isMultiwayAgv,
  //   }))
  // );
  const { t } = useTranslation();

  const handleInput = () => {
    MwConfirm.confirm({
      title: inputLabel || title,
      content: (
        <>
          {isMultiwayAgv ? (
            <InputWidthKeyboard
              input={value}
              setInput={(val: any) => {
                onChange && onChange(val);
              }}
              placeholder={`${t('deployer.singleTask.plsInput')} ${inputLabel || title}`}
              mode={mode}
            ></InputWidthKeyboard>
          ) : (
            <TextField
              autoFocus
              fullWidth
              defaultValue={!value ? '' : value}
              onChange={(event) => {
                onChange && onChange(event.target.value);
              }}
              type={mode}
            ></TextField>
          )}
        </>
      ),
      onOk: async () => {},
    });
  };
  return (
    <InputGroup onClick={handleInput}>
      <div className='title' style={{ whiteSpace: 'nowrap', overflow: 'scroll' }}>
        {title}
      </div>
      <div className='content' style={{ height: '24px' }}>
        <div style={{ fontSize: 16, overflow: 'scroll', whiteSpace: 'nowrap' }}>{value}</div>
        <EditIcon fontSize={14}></EditIcon>
      </div>
    </InputGroup>
  );
};

export default memo(TaskAction);
