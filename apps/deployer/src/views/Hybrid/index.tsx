import EmptyBox from '@/components/Empty';
import InitStage from '@/components/InitStage';
import CoordinateSystem from '@/components/InitStage/components/coordinateSystem';
import { Add } from '@mui/icons-material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {
  Box,
  Button,
  createTheme,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
  ThemeProvider,
  Typography,
  useTheme,
} from '@mui/material';
import { useRequest, useSize } from 'ahooks';
import { Badge, ConfigProvider, Dropdown, message, Modal } from 'antd';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Layer } from 'react-konva';
import Agv from './components/agv';
import HybridStatus from './components/hybridStatus';
import ReflectorHandle from './components/reflector/handles';
import ReflectorActions from './components/reflector/handles/actions';
import ReflectorLayer from './components/reflector/reflectorLayer';
import SlamHandles from './components/slam/handles';
import SlamLayer from './components/slam/slamLayer';
import { addFloor, delFloor, postFloorList, switchFloor, updateFloor } from './service';

import ErrorPage from '@/components/ErrorPage';
import ExchangeIcon from '@/components/SvgIcon/ExchangeIcon';
import { SwipeAction } from '@/components/SwiperAction';
import { useLatest } from 'ahooks';
import Konva from 'konva';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import CanvasOnline from './components/CanvasOnline';
import ChangePose from './components/changePose';
import InputWidthKeyboard from './components/inputWithKeyboard';
import MwConfirm from './components/MwConfirm';
import { NavigationRegion } from './components/navigationRegion';
import OnlinePoint from './components/onLinePoint';
import PointCloudV1 from './components/pointCloudV1';
import PointsCloudDiagV1 from './components/pointsCloudDiagV1';
import PositionView from './components/reflector/positionView';
import { postDeleteTargetReflectors } from './components/reflector/services';
import WsContainer from './components/WsContainer';
import useMapFloorData from './hooks/mapFloorData';
import { useHttpCode } from './hooks/useHttpCode';
import { useHybirdStore } from './store/hybird.store';
import { isShowNavigation } from './utils';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const CustomList = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemButton-root': {
    padding: '16px',
  },
});

const Mapping = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const {
    setMapLoading,
    robot_current_status,
    refreshFloorData,
    setCurrentReflectors,
    setMatchedReflectors,
    setMismatchedReflectors,
    setShowFloor,
    showFloor,
    navigationType,
    setBeginPose,
    wsState,
    setShowPointCloud,
  } = useHybirdStore(
    useShallow((state) => ({
      setMapLoading: state.setMapLoading,
      robot_current_status: state.robot_current_status,
      refreshFloorData: state.refreshFloorData,
      setCurrentReflectors: state.setCurrentReflectors,
      setMatchedReflectors: state.setMatchedReflectors,
      setMismatchedReflectors: state.setMismatchedReflectors,
      setShowFloor: state.setShowFloor,
      showFloor: state.showFloor,
      navigationType: state.navigationType,
      setBeginPose: state.setBeginPose,
      wsState: state.wsState,
      setShowPointCloud: state.setShowPointCloud,
    })),
  );

  // 获取当前楼层
  const ref = useRef<HTMLDivElement>(null);
  const updateInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<any>(null);
  const size = useSize(ref);
  const [newFloor, setNewFloor] = React.useState();
  const latestInputText = useLatest(newFloor);
  const [floor, setFloor] = React.useState(robot_current_status.floor_number || 1);
  const [floorButtonDisabled, setFloorButtonDisabled] = React.useState(true);
  const [alignment, setAlignment] = React.useState('slam');

  const currentAddFloor = useRef(0);
  useEffect(() => {
    if (!robot_current_status?.navigation_type) {
      setAlignment('slam');
      return;
    }
    isShowNavigation(navigationType, 'REFLECTOR') &&
      robot_current_status?.navigation_type === 1 &&
      setAlignment('reflector');
    isShowNavigation(navigationType, 'LIDAR_SLAM_2D') &&
      robot_current_status?.navigation_type === 2 &&
      setAlignment('slam');
    isShowNavigation(navigationType, 'LIDAR_SLAM_3D') &&
      robot_current_status?.navigation_type === 4 &&
      setAlignment('slam');
  }, [navigationType, robot_current_status.navigation_type]);
  const { getFloorMapData } = useMapFloorData();

  const { getCodeMsg, useErrorMessage } = useHttpCode();

  const isSameFloor = useMemo(() => {
    return robot_current_status.floor_number == floor;
  }, [robot_current_status.floor_number, floor]);

  const changeHybrid = (event: SelectChangeEvent) => {
    const newAlignment = event.target.value as string;
    if (!newAlignment) return;
    if (robot_current_status.system_status !== 0) {
      toast.error(t('deployer.hybrid.plsCancelAction'));
      return;
    }
    setAlignment(newAlignment);
  };

  const { runAsync: getFloors, data: listData }: any = useRequest(postFloorList, {
    manual: true,
    onSuccess: (data) => {
      setMapLoading(false);
    },
  });

  // 新增楼层
  const { runAsync: postAddFloor, loading: addLoading } = useRequest(addFloor, {
    manual: true,
    onSuccess: async (res: any) => {
      if (res) {
        if (res.error_code !== 10000) {
          useErrorMessage(res.error_description, res.solution);
          return;
        }
        toast.success(t('common.actionSuccess'));
        await getFloors();
        setFloor(currentAddFloor.current);
      }
    },
  });

  // 删除楼层
  const { runAsync: postDelFloor } = useRequest(delFloor, {
    manual: true,
    onSuccess: (res: any) => {
      if (res) {
        if (res.error_code !== 10000) {
          useErrorMessage(res.error_description, res.solution);
          return;
        }
        toast.success(t('common.actionSuccess'));
        getFloors();
        setFloor(robot_current_status?.floor_number as number);
      }
    },
  });

  // 切换楼层
  const { runAsync: postSwitchFloor } = useRequest(switchFloor, {
    manual: true,
    onSuccess: (res: any) => {
      if (res) {
        if (res.error_code !== 10000) {
          useErrorMessage(res.error_description, res.solution);
          return;
        }
        toast.success(t('common.actionSuccess'));
        getFloors();
      }
    },
  });

  const isConnectSuccess = useMemo(() => {
    return wsState === 1;
  }, [wsState]);

  React.useEffect(() => {
    wsState === 1 && getFloors();
    return () => {
      setMapLoading(false);
    };
  }, [wsState]);

  const handleChange = (newValue: number) => {
    setFloor(newValue);
  };

  React.useEffect(() => {
    if (robot_current_status.system_status !== 0) {
      setShowFloor(false);
      setFloorButtonDisabled(true);
      setBeginPose(false); // 建图中关闭重定位的状态
      setShowPointCloud(true); // 建图中显示点云
    } else {
      setFloorButtonDisabled(false);
    }
  }, [robot_current_status.system_status]);

  // 根据楼层切换，获取对应楼层数据
  React.useEffect(() => {
    setCurrentReflectors([]);
    setMatchedReflectors([]);
    setMismatchedReflectors([]);

    getFloorMapData(floor);
  }, [floor, refreshFloorData]);

  const [modal, contextHolder] = Modal.useModal();
  const { runAsync: runDeleteReflector } = useRequest(postDeleteTargetReflectors, {
    manual: true,
  });
  const handleReflectorClick = useCallback(
    (id: number) => {
      modal.confirm({
        title: t('deployer.hybrid.confirmDelete'),
        content: t('deployer.hybrid.confirmDeleteReflectorsTip'),
        zIndex: 2000,
        okText: t('common.confirm'),
        cancelText: t('common.cancel'),
        onOk: async () => {
          try {
            const reflectors_id = [id];
            const { error_code, solution, error_description } =
              ((await runDeleteReflector({
                floor_number: floor,
                reflectors_id,
              })) as any) ?? {};
            if (error_code === 10000) {
              toast.success(t('common.actionSuccess'));
              getFloorMapData(floor);
              return Promise.resolve();
            }
            const msg = getCodeMsg(error_code);
            useErrorMessage(error_description, solution);
            toast.error(msg);
            return Promise.reject(new Error(msg));
          } catch (error) {
            return Promise.reject(error);
          }
        },
      });
    },
    [floor],
  );

  const drawerWidth = 180;

  // 显示隐藏楼层
  // const rightActions = [
  //   {
  //     key: 'delete',
  //     text: t('common.delete'),
  //     icon: (
  //       <div style={{ display: 'flex' }}>
  //         <DeleteIcon fontSize={26} isActive></DeleteIcon>
  //       </div>
  //     ),
  //   },
  // ];

  // 渲染楼层列表
  const renderFloorList = useMemo(() => {
    return listData?.floor_list?.map((value) => {
      return (
        <SwipeAction key={value}>
          <ListItem disablePadding>
            <>
              <ListItemButton
                sx={{ padding: '8px 8px !important' }}
                onClick={() => {
                  setBeginPose(false);
                  handleChange(value);
                }}
              >
                <Badge
                  classNames={{
                    indicator: '!w-2 !h-2 !bg-teal-400 mr-1',
                  }}
                  status={floor === value ? 'processing' : 'default'}
                />
                <ListItemText disableTypography sx={{ color: 'text.primary', fontSize: '14px' }}>
                  {t('deployer.hybrid.floor') + ' ' + value}
                </ListItemText>
              </ListItemButton>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: '1',
                      icon: <SwapHorizIcon fontSize='large' />,
                      label: t('deployer.hybrid.switch'),
                      onClick: () => {
                        if (robot_current_status.floor_number === value) {
                          toast.error(t('deployer.hybrid.isExistFloor'));
                          return;
                        }
                        if (floor !== value) {
                          toast.error(t('deployer.hybrid.reviewFloorTips'));
                          return;
                        }
                        modal.confirm({
                          title: t('deployer.hybrid.confirmSwitch'),
                          content: t('deployer.hybrid.confirmSwitchFloorTip'),
                          zIndex: 2000,
                          okText: t('common.confirm'),
                          cancelText: t('common.cancel'),
                          onOk: async () => {
                            await postSwitchFloor(value);
                          },
                        });
                      },
                    },
                    {
                      key: '2',
                      icon: <BorderColorIcon fontSize='large' />,
                      label: t('common.edit'),
                      onClick: () => {
                        MwConfirm.confirm({
                          title: t('deployer.hybrid.floorNo'),
                          content: (
                            <TextField
                              fullWidth
                              autoFocus
                              placeholder={t('common.plsInput')}
                              type={'number'}
                              inputRef={updateInputRef}
                            ></TextField>
                          ),
                          onOk: async () => {
                            const inputValue = updateInputRef.current?.value;
                            const { error_code, error_description }: any = await updateFloor({
                              floor_number: Number(value),
                              new_floor: Number(inputValue),
                            });
                            if (error_code != 10000) {
                              message.error(error_description);
                              return Promise.reject();
                            }
                            message.success(t('common.actionSuccess'));
                            await getFloors();
                          },
                        });
                      },
                    },
                    {
                      key: '3',
                      icon: <DeleteSweepIcon fontSize='large' />,
                      label: t('common.delete'),
                      onClick: () => {
                        modal.confirm({
                          title: t('deployer.hybrid.confirmDelete'),
                          content: t('deployer.hybrid.confirmDeleteFloorTip'),
                          zIndex: 2000,
                          okText: t('common.confirm'),
                          cancelText: t('common.cancel'),
                          onOk: async () => {
                            await postDelFloor(value);
                          },
                        });
                      },
                    },
                  ],
                }}
                trigger={['click']}
                overlayStyle={{ zIndex: 99999, color: 'black' }}
                overlayClassName={'floor_menu'}
              >
                <IconButton size='small' shape='circle'>
                  <MoreVertIcon fontSize='small' className='opacity-80' />
                </IconButton>
              </Dropdown>
            </>
          </ListItem>
        </SwipeAction>
      );
    });
  }, [floor, listData, i18n.language]);
  const layerRef = useRef<Konva.Layer>(null);

  const wsStateHashmap = {
    text: {
      0: t('deployer.hybrid.connecting'),
      3: t('deployer.hybrid.connectFail'),
    },
  };

  if (!isConnectSuccess) {
    return (
      <WsContainer ref={wsRef}>
        <ErrorPage
          loading={wsState === 0}
          refresh={() => {
            wsRef?.current && wsRef?.current?.connect();
          }}
        />
      </WsContainer>
    );
  }

  return (
    <>
      <WsContainer ref={wsRef}>
        <div className='h-full w-full flex flex-col gap-2 absolute top-0 left-0'>
          {/* 反光板导航 左上角坐标显示 */}
          <ThemeProvider
            theme={createTheme({
              palette: {
                mode: 'light',
                primary: {
                  main: '#00D1D1',
                },
              },
            })}
          >
            <Paper className='flex items-baseline flex-col justify-between absolute  w-[220px] z-[999] text-black p-2 left-2 top-2'>
              {wsState === 1 ? (
                isSameFloor ? (
                  <>
                    <HybridStatus />
                    <PositionView />
                    <>
                      <Divider sx={{ width: '100%', margin: '10px 0' }} />
                      <FormControl variant='standard' sx={{ width: '100%' }}>
                        <Select
                          size='small'
                          value={alignment}
                          onChange={changeHybrid}
                          label={t('deployer.hybrid.navigationType')}
                          sx={{
                            '& .MuiSelect-select': {
                              color: 'black',
                              fontSize: '14px',
                              // position: 'relative',
                              // zIndex: 1000,
                            },
                            '& .MuiPaper-root': {
                              zIndex: 1000,
                            },
                          }}
                        >
                          {isShowNavigation(navigationType, 'REFLECTOR') ? (
                            <MenuItem value='reflector'>{t('deployer.hybrid.reflectorsNavigation')}</MenuItem>
                          ) : null}
                          {isShowNavigation(navigationType, 'LIDAR_SLAM_2D') ? (
                            <MenuItem value='slam'>{t('deployer.hybrid.slamNavigation')}</MenuItem>
                          ) : null}
                          {isShowNavigation(navigationType, 'LIDAR_SLAM_3D') ? (
                            <MenuItem value='slam'>{'3D SLAM'}</MenuItem>
                          ) : null}
                        </Select>
                      </FormControl>
                    </>
                    {<OnlinePoint />}
                  </>
                ) : (
                  <div>
                    <div>
                      {t('deployer.hybrid.reviewFloor')}
                      {floor}
                    </div>
                    <div>
                      {t('deployer.hybrid.vehicleExistFloor')}
                      {robot_current_status.floor_number}
                    </div>
                  </div>
                )
              ) : (
                <div className='flex items-center justify-between w-full'>
                  <div>{wsStateHashmap.text[wsState]}</div>
                  {wsState === 3 && (
                    <Button
                      type='primary'
                      variant='contained'
                      sx={{
                        color: 'white',
                      }}
                      onClick={() => {
                        wsRef?.current && wsRef?.current?.connect();
                      }}
                      size='small'
                    >
                      {t('deployer.hybrid.reconnect')}
                    </Button>
                  )}
                </div>
              )}
            </Paper>
          </ThemeProvider>
          <Button
            type='primary'
            variant='contained'
            sx={{
              color: 'white',
            }}
            className='!absolute top-2 right-2 z-10'
            endIcon={<ExchangeIcon />}
            onClick={() => {
              if (floorButtonDisabled) {
                toast.error(t('deployer.hybrid.plsCancelAction'));
              } else {
                setShowFloor(true);
              }
            }}
          >
            {t('deployer.hybrid.floorManage')}
          </Button>

          {/* 根据楼层数据决定显示内容 */}
          {listData?.floor_list?.length ? (
            <Box
              className='flex-1 relative'
              ref={ref}
              sx={{
                width: '100%',
                height: '100%',
                background: 'white',
              }}
            >
              <InitStage size={size}>
                <Layer ref={layerRef} name='active-layer'>
                  {alignment === 'slam' &&
                  (isShowNavigation(navigationType, 'LIDAR_SLAM_2D') ||
                    isShowNavigation(navigationType, 'LIDAR_SLAM_3D')) ? (
                    <SlamLayer />
                  ) : null}
                  {alignment === 'reflector' && isShowNavigation(navigationType, 'REFLECTOR') ? (
                    <ReflectorLayer onReflectorClick={handleReflectorClick} />
                  ) : null}
                  <Group>
                    <Group>
                      <Agv isOnline={true} floor={floor}></Agv>
                      <CoordinateSystem />
                    </Group>
                    <ChangePose floor={floor} />
                    {!isShowNavigation(navigationType, 'LIDAR_SLAM_3D') && <NavigationRegion />}
                  </Group>
                  <CanvasOnline />
                </Layer>
                <PointsCloudDiagV1 alignment={alignment} />
                {false && !!isShowNavigation(navigationType, 'LIDAR_SLAM_3D') && <PointsCloudDiagV1 />}
                {false && !!isShowNavigation(navigationType, 'LIDAR_SLAM_2D') && <PointCloudV1 />}
              </InitStage>
            </Box>
          ) : (
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
                background: '#445260e6',
                borderRadius: '20px',
                height: '100%',
              }}
            >
              <EmptyBox
                backgroundColor='transparent'
                title={
                  <>
                    <Typography>{t('deployer.hybrid.noFloorData')}</Typography>
                  </>
                }
              ></EmptyBox>
            </Box>
          )}

          {alignment === 'slam' &&
          isSameFloor &&
          (isShowNavigation(navigationType, 'LIDAR_SLAM_2D') || isShowNavigation(navigationType, 'LIDAR_SLAM_3D')) &&
          listData?.floor_list?.length ? (
            <SlamHandles floor={floor} setFloor={setFloor} hide={!listData?.floor_list?.length}></SlamHandles>
          ) : null}

          {!isSameFloor && (
            <div className='absolute left-4 bottom-4 flex flex-col gap-4'>
              <Button
                variant='contained'
                style={{ color: 'white' }}
                onClick={async () => {
                  await postSwitchFloor(floor);
                }}
              >
                {t('deployer.hybrid.switchFloor')}
              </Button>
              <Button
                variant='contained'
                style={{ color: 'white' }}
                onClick={() => {
                  setFloor(robot_current_status?.floor_number as number);
                }}
              >
                {t('deployer.hybrid.cancelView')}
              </Button>
            </div>
          )}

          {/* 导航切换区域 */}
          <div className='absolute bottom-2 right-2 left-2 flex flex-col gap-2 z-50'>
            {/* 反光板导航 */}
            <ReflectorActions
              isReflector={alignment === 'reflector' && isShowNavigation(navigationType, 'REFLECTOR')}
            />
            <div className='flex'>
              {/* 反光板导航 */}
              {alignment === 'reflector' &&
                listData?.floor_list?.length &&
                isShowNavigation(navigationType, 'REFLECTOR') && (
                  <ReflectorHandle hide={!listData?.floor_list?.length} floor={floor} />
                )}
            </div>
          </div>
        </div>
        <ThemeProvider
          theme={createTheme({
            palette: {
              mode: 'light',
              primary: {
                main: '#00D1D1',
              },
            },
            typography: {
              fontSize: 16,
            },
          })}
        >
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
              },
            }}
            variant='persistent'
            anchor='right'
            open={showFloor}
          >
            <DrawerHeader>
              <Add
                sx={{
                  color: robot_current_status.system_status !== 0 ? 'gray' : '#00D1D1',
                }}
                onClick={async () => {
                  if (robot_current_status.system_status !== 0) {
                    toast.error(t('deployer.hybrid.plsCancelAction'));
                    return;
                  }

                  MwConfirm.confirm({
                    title: t('deployer.hybrid.floorNo'),
                    content: (
                      <>
                        {false && (
                          <InputWidthKeyboard
                            mode='numbers'
                            input={''}
                            placeholder={t('common.plsInput')}
                            setInput={setNewFloor}
                          ></InputWidthKeyboard>
                        )}
                        <TextField
                          fullWidth
                          autoFocus
                          placeholder={t('common.plsInput')}
                          defaultValue={!latestInputText ? '' : latestInputText}
                          onChange={(event) => {
                            setNewFloor(event.target.value as any);
                          }}
                          type={'number'}
                        ></TextField>
                      </>
                    ),

                    onOk: async () => {
                      const addFloorNumber = Number(latestInputText.current);
                      if (addFloorNumber <= 0 || addFloorNumber > 999999) {
                        toast.error(t('deployer.vision.paramsValidateRange') + `:[1-999999]`);
                        return Promise.reject();
                      }
                      await postAddFloor(addFloorNumber);
                      currentAddFloor.current = addFloorNumber;
                    },
                  });
                }}
              />
              <IconButton onClick={() => setShowFloor(false)}>
                {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            {/* 渲染楼层列表 */}
            {listData?.floor_list?.length ? (
              <ConfigProvider
                theme={{
                  algorithm: theme.defaultAlgorithm,
                }}
              >
                <CustomList>{renderFloorList}</CustomList>
              </ConfigProvider>
            ) : (
              <EmptyBox
                backgroundColor='transparent'
                title={
                  <>
                    <Typography>{t('deployer.hybrid.noFloorData')}</Typography>
                  </>
                }
              ></EmptyBox>
            )}
          </Drawer>
        </ThemeProvider>
        {contextHolder}
      </WsContainer>
    </>
  );
};
export default Mapping;
