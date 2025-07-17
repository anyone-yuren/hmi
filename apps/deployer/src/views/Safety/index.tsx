import InitStage from '@/components/InitStage';
import SafetyCoordinate from '@/components/InitStage/components/safetyCoordinate';
import { useSize } from 'ahooks';
import { ConfigProvider, Drawer, Space, theme } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Layer } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import { useHybirdStore } from '../Hybrid/store/hybird.store';
import DrawerContent from './component/DrawerContent';
import { useSafetyStore } from './store/safety.store';
// import { ThemeProvider as ConfigProvider } from "antd-style";
import { Box, FormControl, MenuItem, Select } from '@mui/material';
import Car from './component/Car';
import StatusPanel from './component/status';
import TurnRegion from './component/TurmRegion';

import { useRequest } from 'ahooks';
import Konva from 'konva';
import { find, mapValues } from 'lodash';
import { useTranslation } from 'react-i18next';
import CenterAction from './component/centerAction';
import PointCloud from './component/pointCloud';
import { safetyConfig } from './service';

const Safety = () => {
  const { t } = useTranslation();
  const [scale, setScale] = useState(1);

  // 获取避障方案列表
  const { data: obstacleData, loading: obstacleDataLoading, run: refreshObstacleData } = useRequest(safetyConfig);

  const ref = useRef(null);
  const size = useSize(ref);
  const { setSetting, setting, showPointCloud, setShowPointCloud, setObstacleData, obsInfo } = useSafetyStore(
    useShallow((store) => {
      return {
        setting: store.setting,
        setSetting: store.setSetting,
        showPointCloud: store.showPointCloud,
        setShowPointCloud: store.setShowPointCloud,
        setObstacleData: store.setObstacleData,
        obsInfo: store.obsInfo,
      };
    }),
  );

  const { setMapLoading, stageScale } = useHybirdStore(
    useShallow((store) => {
      return {
        setMapLoading: store.setMapLoading,
        stageScale: store.stageScale,
      };
    }),
  );

  useEffect(() => {
    setMapLoading(false);
  }, []);
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(obsInfo.scheme_id);
  }, [obsInfo.type]);

  const handleChange = (event: React.SyntheticEvent) => {
    const newValue = typeof event === 'number' ? event : Number((event.target as HTMLInputElement).value);
    setValue(newValue);
    // 根据newValue 从obstacleData 筛选出对应的数据
    const newObsSelectData = find(obstacleData?.data ?? [], {
      scheme_id: newValue,
    });
    // 提取不需要除以1000的数据
    const { line_keeping, scheme_id, sensor_enable, ...changeData } = newObsSelectData;
    if (newObsSelectData) {
      const values = mapValues(changeData, (value) => value / 1000);
      setObstacleData({ ...values, scheme_id, sensor_enable, line_keeping });
    }
    setSetting(true);
  };

  const layerRef = useRef<Konva.Layer>(null);
  useEffect(() => {
    if (layerRef.current) {
      requestAnimationFrame(() => {
        if (layerRef.current) {
          const layer = layerRef.current;
          layer.setPosition({ x: size.width / 2, y: size.height / 2 });
          layer.scale({ x: 2, y: 2 });
          layer.batchDraw();
        }
      });
    }
  }, [size?.height, size?.width]);

  return (
    <div className='w-full h-full flex flex-col !absolute left-0 top-0'>
      <div className=''>
        <StatusPanel obstacleData={obstacleData} obstacleIndex={value} handleChange={handleChange} />
      </div>
      <div className='flex-1 bg-white' ref={ref}>
        <InitStage
          size={size}
          minScale={1}
          onWheelCallback={(e) => {
            setScale(e);
          }}
        >
          <Layer ref={layerRef}>
            {/* 车体 */}
            <TurnRegion />
            <Car />
            <SafetyCoordinate />
            <PointCloud />
          </Layer>
        </InitStage>
      </div>

      {/* 操作区域 */}
      <Box className='absolute bottom-0 left-0 flex items-center w-full '>
        {/* 避障方案列表 */}
        {/* <Box className=" bg-slate-700 min-w-1/5">
          <Tabs
            variant="scrollable"
            value={value}
            className=""
            onChange={handleChange}
          >
            {obstacleData &&
              obstacleData?.data?.map((item: any, index: number) => (
                <Tab
                  label={`避障方案` + item.scheme_id}
                  key={index}
                  value={item.scheme_id}
                  className="text-white"
                />
              ))}
          </Tabs>
        </Box>
        <FormControlLabel
          label="显示点云"
          componentsProps={{
            // 设置label间距
            typography: {
              style: {
                marginRight: 10,
                whiteSpace: "nowrap",
                fontWeight: "bold",
              },
            },
          }}
          labelPlacement="start"
          control={
            <CustomSwitch
              size="small"
              // value={showPointCloud}
              checked={showPointCloud}
              onChange={(e, value) => {
                setShowPointCloud(value);
              }}
            />
          }
        ></FormControlLabel> */}
      </Box>
      <div className='absolute bottom-0 right-0 flex items-center'>
        <CenterAction />
      </div>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <Drawer
          title={t('避障方案调整')}
          placement={'right'}
          zIndex={1203}
          closable={false}
          destroyOnClose
          extra={
            <Space>
              <FormControl variant='outlined' sx={{ minWidth: '100px' }}>
                <Select
                  size='small'
                  value={value}
                  onChange={handleChange}
                  label={t('导航类型')}
                  MenuProps={{
                    container: () => document.body,
                  }}
                  sx={{
                    '& .MuiSelect-select': {
                      color: 'black',
                      fontSize: '14px',
                    },
                    '& .MuiOutlinedInput-notchedOutline, & .MuiSvgIcon-root': {
                      color: 'black', // 设置 label 的颜色为黑色
                      legend: {
                        height: 'auto',
                      },
                    },
                  }}
                >
                  {obstacleData?.data && obstacleData?.data.length > 0
                    ? obstacleData.data.map((item: any) => {
                        return <MenuItem value={item.scheme_id}>{item.scheme_id}</MenuItem>;
                      })
                    : null}
                  {/* <MenuItem value="reflector">反光板导航</MenuItem>
                    <MenuItem value="slam">slam导航</MenuItem> */}
                  {/* <MenuItem value="hybird">混合导航</MenuItem> */}
                </Select>
              </FormControl>
            </Space>
          }
          mask={false}
          classNames={
            {
              // body: "!bg-[#445260] !p-0",
              // header: "!bg-[#000]",
            }
          }
          onClose={() => setSetting(!setting)}
          open={setting}
        >
          <DrawerContent refresh={refreshObstacleData} />
        </Drawer>
      </ConfigProvider>
    </div>
  );
};
export default Safety;
