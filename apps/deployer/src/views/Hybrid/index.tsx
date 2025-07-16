import EmptyBox from '@/components/Empty';
import InitStage from '@/components/InitStage';
import CoordinateSystem from '@/components/InitStage/components/coordinateSystem';
import { Add } from '@mui/icons-material';
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
  ThemeProvider,
  Typography,
  useTheme,
} from '@mui/material';
import { useRequest, useSize } from 'ahooks';
import { Badge, ConfigProvider, Dropdown, Modal } from 'antd';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Layer } from 'react-konva';
import Agv from './components/agv';
import HybirdStatus from './components/hybirdStatus';
import ReflectorHandle from './components/reflector/handles';
import ReflectorActions from './components/reflector/handles/actions';
import ReflectorLayer from './components/reflector/reflectorLayer';
import SlamHandle from './components/slam/handles';
import SlamLayer from './components/slam/slamLayer';
import { addFloor, delFloor, postFloorList, switchFloor } from './service';

import DeleteIcon from '@/components/SvgIcon/DeleteIcon';
import ExchangeIcon from '@/components/SvgIcon/ExchangeIcon';
import { SwipeAction } from '@/components/SwiperAction';
import { useLatest } from 'ahooks';
import Konva from 'konva';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import CanvaOnline from './components/CanvaOnline';
import MwConfirm from './components/MwConfirm';
import ChangePose from './components/changePose';
import InputWidthKeyboard from './components/inputWithKeyboard';
import { NavigationRegion } from './components/navigationRegion';
import OnlinePoint from './components/onLinePoint';
import PointCloudV1 from './components/pointCloudV1';
import PositionView from './components/reflector/positionView';
import { postDeleteTargetReflectors } from './components/reflector/services';
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
  const { t } = useTranslation();
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
    })),
  );

  // 获取当前楼层
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);
  const [newFloor, setNewFloor] = React.useState();
  const latestInputText = useLatest(newFloor);
  const [floor, setFloor] = React.useState(robot_current_status.floor_number || 1);
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
  }, [navigationType, robot_current_status.navigation_type]);
  const { getFloorMapData } = useMapFloorData();

  const { getCodeMsg, useErrorMessage } = useHttpCode();

  const changeHybird = (event: SelectChangeEvent) => {
    const newAlignment = event.target.value as string;
    if (!newAlignment) return;
    if (robot_current_status.system_status !== 0) {
      toast.error(t('请先取消当前操作'));
      return;
    }
    setAlignment(newAlignment);
  };

  const { runAsync: getFloors, data: listData } = useRequest(postFloorList, {
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
        toast.success(t('新增成功'));
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
        toast.success(t('删除成功'));
        getFloors();
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
        toast.success(t('切换成功'));
        getFloors();
      }
    },
  });

  React.useEffect(() => {
    getFloors();
    return () => {
      setMapLoading(false);
    };
  }, []);

  const handleChange = (newValue: number) => {
    if (robot_current_status.system_status !== 0) {
      toast.warning(t('请先取消当前操作'));
      return;
    }
    setFloor(newValue);
  };

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
        title: t('确认删除'),
        content: t('确认删除该反光板吗？'),
        zIndex: 2000,
        okText: t('确认'),
        cancelText: t('取消'),

        onOk: async () => {
          try {
            const reflectors_id = [id];
            const { error_code, solution, error_description } =
              ((await runDeleteReflector({
                floor_number: floor,
                reflectors_id,
              })) as any) ?? {};
            if (error_code === 10000) {
              toast.success(t('删除成功'));
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

  const rightActions = [
    {
      key: 'delete',
      text: t('删除'),
      icon: (
        <div style={{ display: 'flex' }}>
          <DeleteIcon fontSize={26} isActive></DeleteIcon>
        </div>
      ),
    },
  ];

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
                  status={floor === value ? 'processing' : null}
                />
                <ListItemText disableTypography sx={{ color: 'text.primary', fontSize: '14px' }}>
                  {t('楼层') + ' ' + value}
                </ListItemText>
              </ListItemButton>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: '1',
                      icon: <SwapHorizIcon fontSize='large' />,
                      label: t('切换'),
                      onClick: () => {
                        modal.confirm({
                          title: t('确认切换'),
                          content: t('确认切换到该楼层吗？'),
                          zIndex: 2000,
                          okText: t('确认'),
                          cancelText: t('取消'),
                          onOk: async () => {
                            await postSwitchFloor(value);
                          },
                        });
                      },
                    },
                    {
                      key: '2',
                      icon: <DeleteSweepIcon fontSize='large' />,
                      label: t('删除'),
                      onClick: () => {
                        modal.confirm({
                          title: t('确认删除'),
                          content: t('确认删除该楼层吗？'),
                          zIndex: 2000,
                          okText: t('确认'),
                          cancelText: t('取消'),
                          onOk: async () => {
                            await postDelFloor(value);
                          },
                        });
                      },
                    },
                  ],
                }}
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
  }, [floor, listData]);
  const layerRef = useRef<Konva.Layer>(null);

  return (
    <>
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
          <Paper className='flex items-baseline flex-col justify-between absolute  w-[220px] z-[9999] text-black p-2 left-2 top-2'>
            <HybirdStatus />
            <PositionView />
            <>
              <Divider sx={{ width: '100%', margin: '10px 0' }} />
              <FormControl variant='standard' sx={{ width: '100%' }}>
                <Select
                  size='small'
                  value={alignment}
                  onChange={changeHybird}
                  label={t('导航类型')}
                  sx={{
                    '& .MuiSelect-select': {
                      color: 'black',
                      fontSize: '14px',
                    },
                  }}
                >
                  {isShowNavigation(navigationType, 'REFLECTOR') ? (
                    <MenuItem value='reflector'>{t('反光板导航')}</MenuItem>
                  ) : null}
                  {isShowNavigation(navigationType, 'LIDAR_SLAM_2D') ? (
                    <MenuItem value='slam'>{t('slam导航')}</MenuItem>
                  ) : null}
                  {/* <MenuItem value="hybird">混合导航</MenuItem> */}
                </Select>
              </FormControl>
              {/* <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={changeHybird}
                    aria-label="Platform"
                    className="bg-gray-700"
                  >
                    <ToggleButton value="reflector">反光板导航</ToggleButton>
                    <ToggleButton value="slam">slam导航</ToggleButton>
                  </ToggleButtonGroup> */}
            </>
            <OnlinePoint />
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
          onClick={() => setShowFloor(true)}
        >
          {t('楼层管理')}
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
              <PointCloudV1 />
              <Layer ref={layerRef} name='active-layer'>
                {alignment === 'slam' && isShowNavigation(navigationType, 'LIDAR_SLAM_2D') ? <SlamLayer /> : null}
                {alignment === 'reflector' && isShowNavigation(navigationType, 'REFLECTOR') ? (
                  <ReflectorLayer onReflectorClick={handleReflectorClick} />
                ) : null}
                {/* <QrCodemap /> */}
                <Group>
                  {/* <PointsCloud /> */}
                  <Group>
                    <Agv isOnline={true} floor={floor}></Agv>
                    <CoordinateSystem />
                  </Group>
                  <ChangePose floor={floor} />
                  <NavigationRegion />
                  {/* <GridGroup width={size?.width} height={size?.height} /> */}
                </Group>
                <CanvaOnline />
              </Layer>
              {/* <PointsCloudDiagV1 /> */}
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
                  <Typography>{t('暂无楼层数据，请添加')}</Typography>
                </>
              }
            ></EmptyBox>
          </Box>
        )}

        {alignment === 'slam' && isShowNavigation(navigationType, 'LIDAR_SLAM_2D') && listData?.floor_list?.length ? (
          <SlamHandle floor={floor} hide={!listData?.floor_list?.length}></SlamHandle>
        ) : null}

        {/* 导航切换区域 */}
        <div className='absolute bottom-2 right-2 left-2 flex flex-col gap-2 z-50'>
          {/* 反光板导航 */}
          <ReflectorActions isReflector={alignment === 'reflector' && isShowNavigation(navigationType, 'REFLECTOR')} />
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
              // height: "auto",
              // top: "4rem",
              // bottom: "3.5rem",
            },
          }}
          variant='persistent'
          anchor='right'
          open={showFloor}
        >
          <DrawerHeader>
            <Add
              // fontSize="small"
              sx={{
                color: robot_current_status.system_status !== 0 ? 'gray' : '#00D1D1',
              }}
              onClick={async () => {
                if (robot_current_status.system_status !== 0) {
                  toast.error(t('请先取消当前操作'));
                  return;
                }
                MwConfirm.confirm({
                  title: t('楼层号'),
                  content: (
                    <>
                      {/* <div style={{ textAlign: "center" }}>{t("楼层号")}</div> */}
                      <InputWidthKeyboard
                        mode='numbers'
                        input={''}
                        placeholder={t('请输入')}
                        setInput={setNewFloor}
                      ></InputWidthKeyboard>
                    </>
                  ),

                  onOk: async () => {
                    const addFloorNumber = Number(latestInputText.current);
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
                  <Typography>{t('暂无楼层数据，请添加')}</Typography>
                </>
              }
            ></EmptyBox>
          )}
        </Drawer>
      </ThemeProvider>
      {contextHolder}
    </>
  );
};
export default Mapping;
