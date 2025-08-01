import { Button, Grid, MenuItem, TextField } from '@mui/material';
import _ from 'lodash';
import { forwardRef, memo, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useRequest } from 'ahooks';
import { toast } from 'sonner';
import 'swiper/css';
import { InputGroup, MapTaskPanelAction, MapTaskSelect, SubTaskContainer } from '../Style';
import { addTemplate, createTask, getHeightInfo } from '../services';
import MainButton from './MainButton';
import MwConfirm from './MwConfirm';
import PointOrLineBox, { PointCardContainer } from './PointOrLineBox';
import DeleteIcon from './SvgIcon/DeleteIcon';
import EditIcon from './SvgIcon/EditIcon';
import TaskArrow from './SvgIcon/TaskArrow';
import InputWidthKeyboard from './inputWithKeyboard';

import { useSingleTaskStore } from '../store/singleTask.store';

import { Modal } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import StartIcon from './SvgIcon/StartIcon';

const TaskAction = forwardRef((props: any, ref) => {
  const { preTaskList, setPreTaskList, points, initTaskActionRow, onFinish, charges, locations, isKVehicle } = props;
  const [loading, setLoading] = useState(false);
  const [loopTime, setLoopTime] = useState(1);
  const [intervalTime, setIntervalTime] = useState(0);
  const [templateName, setTemplateName] = useState('');
  const { data: heightResponse } = useRequest(() => getHeightInfo(), {});
  const taskActionRef = useRef(null);

  const [modal, contextHolder] = Modal.useModal();
  const { t } = useTranslation();
  const rcs_info = useSingleTaskStore(useShallow((store: any) => store.rcs_info));

  const vehicleOnPoint = useMemo(() => {
    return rcs_info?.is_on_node;
  }, [rcs_info]);

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
      list[index] = { ...initTaskActionRow, task_type: value };
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

  const transformParams = (params: any) => {
    const newParams = _.cloneDeep(params);
    const transformDict: any = {
      Pick: (obj: any) => {
        obj['param'][0] = Number(obj?.task_low_height) || 0;
        obj['param'][1] = Number(obj?.task_high_height) || 0;
        obj['param'][2] = isKVehicle ? Number(obj?.fork_direction) : Number(obj.params1);
        obj['param'][3] = Number(obj.params2);
        return obj;
      },
      Place: (obj: any) => {
        obj['param'][0] = Number(obj?.task_low_height) || 0;
        obj['param'][1] = Number(obj?.task_high_height) || 0;
        obj['param'][2] = isKVehicle ? Number(obj?.fork_direction) : Number(obj.params1);
        obj['param'][3] = Number(obj.params2);
        return obj;
      },
      Null: (obj: any) => {
        return obj;
      },
      Charge: (obj: any) => {
        obj['param'][0] = Number(obj?.task_charge_type) || 0;
        obj['param'][1] = Number(obj?.threshold) || 0;
        return obj;
      },
    };
    for (let index = 0; index < newParams.tasks.length; index++) {
      let obj = newParams.tasks[index];
      obj = transformDict[obj['task_type']](obj);
      delete obj.id;
      delete obj.task_type_name;
      delete obj.threshold;
      delete obj.task_charge_type;
      delete obj.task_low_height;
      delete obj.task_high_height;
      delete obj.fork_direction;
      delete obj.expand;
      delete obj.params1;
      delete obj.params2;
    }

    return newParams;
  };

  const validateParams = (params: any) => {
    let isPass = true;
    for (let index = 0; index < params.tasks.length; index++) {
      (!params.tasks[index]['task_type'] || !params.tasks[index]['task_point_id']) && (isPass = false);
    }
    return isPass;
  };

  const showConfirm = () => {
    const params = transformParams({
      loop_count: loopTime,
      task_interval: intervalTime,
      tasks: preTaskList.filter((item: any) => !!item?.task_type),
    });
    if (!params.tasks.length) return;
    const isValidate = validateParams(params);
    if (!isValidate) {
      toast.error(t('点的类型和点位必填'));
      return;
    }
    modal.confirm({
      title: t('当前车辆不在点上,是否要继续下发任务') + '?',
      okText: t('确认'),
      cancelText: t('取消'),
      onOk: async () => {
        await handleSubmit();
      },
    });
  };

  const handleSubmit = async () => {
    const params = transformParams({
      loop_count: loopTime,
      task_interval: intervalTime,
      tasks: preTaskList.filter((item: any) => !!item?.task_type),
    });
    const templateParams = { name: templateName, ..._.cloneDeep(params) };
    if (!params.tasks.length) return;
    const isValidate = validateParams(params);
    if (!isValidate) {
      toast.error(t('点的类型和点位必填'));
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
        toast.success(t('操作成功'));
        templateParams.name && saveTemplate(templateParams);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    const params = transformParams({
      loop_count: loopTime,
      task_interval: intervalTime,
      tasks: preTaskList.filter((item: any) => !!item?.task_type),
    });
    if (!params.tasks.length) return;
    const isValidate = validateParams(params);
    if (!isValidate) {
      toast.error(t('点的类型和点位必填'));
      return;
    }
    const templateParams = { name: templateName, ..._.cloneDeep(params) };
    if (!templateParams.name) {
      toast.error(t('模版名称必填'));
      return;
    }
    try {
      await saveTemplate(templateParams);
      toast.success(t('操作成功'));
      setLoopTime(1);
      setIntervalTime(0);
      setTemplateName('');
      onFinish && onFinish(true);
    } catch (error) {
      console.log(error);
    }
  };

  const saveTemplate = async (params: any) => {
    await addTemplate(params);
    onFinish && onFinish();
  };

  return (
    <MapTaskPanelAction>
      <div className='listContainer'>
        {preTaskList.map((task: any, index: number) => {
          return (
            <SubTaskContainer key={'task_action_' + task?.id}>
              <PointCardContainer container alignItems={'center'} sx={{}}>
                <Grid item xs>
                  <PointOrLineBox
                    key='left'
                    title={task.task_type}
                    subTitle={t('请选择任务类型')}
                    list={[
                      { id: 'Pick', label: t('取货') },
                      { id: 'Place', label: t('放货') },
                      { id: 'Charge', label: t('充电') },
                      { id: 'Null', label: t('移动') },
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
                    subTitle={t('请选择点位')}
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
                        <div className='title'>{t('名称')}</div>
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
                              {t('暂无数据')}
                            </MenuItem>
                          )}
                        </MapTaskSelect>
                      </InputGroup>
                      <InputGroupText
                        title={t('进叉高度')}
                        value={task?.task_low_height}
                        onChange={(val: number) => {
                          onValueChange('task_low_height', index, val);
                        }}
                      ></InputGroupText>
                      <InputGroupText
                        title={t('出叉高度')}
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
                            <div className='title'>{t('叉臂方向')}</div>
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
                              <MenuItem value={0}>{`${t('前')}`}</MenuItem>
                              <MenuItem value={1}>{`${t('左')}`}</MenuItem>
                              <MenuItem value={2}>{`${t('右')}`}</MenuItem>
                            </MapTaskSelect>
                          </InputGroup>
                        ) : (
                          <InputGroupText
                            title={t('扩展参数') + '1'}
                            value={task?.params1}
                            onChange={(val: number) => {
                              onValueChange('params1', index, val);
                            }}
                          ></InputGroupText>
                        )}
                        <InputGroupText
                          title={t('扩展参数') + '2'}
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
                        <div className='title'>{t('充电类型')}</div>
                        <MapTaskSelect
                          variant={'outlined'}
                          displayEmpty
                          value={task?.task_charge_type}
                          onChange={(event: any) => {
                            onValueChange('task_charge_type', index, event.target.value);
                          }}
                        >
                          <MenuItem value={1}>{t('百分比')}</MenuItem>
                          <MenuItem value={3}>{t('时间')}</MenuItem>
                        </MapTaskSelect>
                      </InputGroup>
                      <InputGroupText
                        title={t('阈值') + (task.task_charge_type === 1 ? '(%)' : '(h)')}
                        value={task?.threshold}
                        onChange={(val: number) => {
                          onValueChange('threshold', index, val);
                        }}
                      ></InputGroupText>
                    </div>
                  </>
                )}
              </div>
            </SubTaskContainer>
          );
        })}
        <div ref={taskActionRef} style={{ height: '0px' }}></div>
      </div>

      <div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <InputGroupText
            title={t('循环次数')}
            value={loopTime}
            onChange={(val: any) => {
              !Number(val) ? setLoopTime(1) : setLoopTime(Number(val));
            }}
          ></InputGroupText>
          <InputGroupText
            title={t('间隔时间') + '(s)'}
            value={intervalTime}
            onChange={(val: any) => {
              !Number(val) ? setIntervalTime(0) : setIntervalTime(Number(val));
            }}
          ></InputGroupText>
          <InputGroupText
            title={t('模板名称')}
            value={templateName}
            mode={'default'}
            onChange={setTemplateName}
          ></InputGroupText>
        </div>
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
            sx={{ marginTop: '5px', color: 'white', flex: 1 }}
            onClick={handleSaveTemplate}
          >
            {t('保存为模版')}
          </Button>
        </div>
      </div>
      {contextHolder}
    </MapTaskPanelAction>
  );
});

const InputGroupText = (props: any) => {
  const { title, value, onChange, mode = 'numbers', inputLabel } = props;
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
              placeholder={`${t('请输入')} ${inputLabel || title}`}
              mode={mode}
            ></InputWidthKeyboard>
          ) : (
            <TextField
              fullWidth
              defaultValue={!value ? '' : value}
              onChange={(event) => {
                onChange && onChange(event.target.value);
              }}
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
