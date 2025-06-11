import {
  DownOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  InfoCircleOutlined,
  RedoOutlined,
  SettingOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { useRcsGlobalStore } from '@gbeata/store';
import { LocationMapping } from '@gbeata/three';
import { useDebounceFn, useFullscreen, useRequest } from 'ahooks';
import {
  Button,
  Drawer,
  FloatButton,
  InputNumber,
  List,
  Popover,
  Select,
  Space,
  Switch,
  Tooltip,
  Typography,
} from 'antd';
import { useTheme } from 'antd-style';
import { v1MapGetMapDataCreate } from 'apis';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useSignalRStore } from '../../components/signalR/store/signalR';
import VehicleStatus from './status';

export default function PointCloudPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mappingRef = useRef(null);
  const [isFullscreen, { enterFullscreen, exitFullscreen, toggleFullscreen }] = useFullscreen(mappingRef);
  const [open, setOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(undefined);
  const {
    cameraControls,
    setReferencePoints,
    setShowBlockArea,
    setShowLine,
    showBlockArea,
    showLine,
    setLocationSize,
    locationSize,
  } = useRcsGlobalStore(
    useShallow((state) => ({
      cameraControls: state.cameraControls,
      setReferencePoints: state.setReferencePoints,
      showLine: state.showLine,
      setShowLine: state.setShowLine,
      showBlockArea: state.showBlockArea,
      setShowBlockArea: state.setShowBlockArea,
      setLocationSize: state.setLocationSize,
      locationSize: state.locationSize,
    })),
  );
  const { vehicles } = useSignalRStore(
    useShallow((state: any) => ({
      vehicles: state.vehicles,
    })),
  );

  const { data: mappingData } = useRequest(v1MapGetMapDataCreate, {
    onSuccess: (res) => {
      setReferencePoints(res?.referencePoints || []);
      // setMapData(res);
    },
  });

  const { run: handleDebounceChange } = useDebounceFn(
    (value) => {
      setLocationSize(value);
      // 这里写你实际要触发的逻辑
    },
    { wait: 500 }, // 500ms防抖，可调整
  );

  const token = useTheme();
  const popoverContent = (
    <div className='min-h-8 max-h-32 w-[400px] overflow-hidden rounded-xl'>
      <List itemLayout='horizontal'>
        <div className='min-w-60 grid grid-cols-2 gap-1'>
          <List.Item
            className='!py-1'
            extra={
              <Switch
                className='mb-1'
                size='small'
                defaultChecked={showLine}
                onChange={() => {
                  setShowLine(!showLine);
                }}
              />
            }
          >
            <List.Item.Meta title={`线路:`} />
          </List.Item>
          <List.Item
            className='!py-1'
            extra={<Switch className='mb-1' size='small' defaultChecked onChange={() => {}} />}
          >
            <List.Item.Meta title={`库位名:`} />
          </List.Item>
          <List.Item
            className='!py-1'
            extra={
              <Switch
                className='mb-1'
                size='small'
                defaultChecked={showBlockArea}
                onChange={() => {
                  setShowBlockArea(!showBlockArea);
                }}
              />
            }
          >
            <List.Item.Meta title={`建筑元素:`} />
          </List.Item>
          <List.Item
            className='!py-1'
            extra={
              <InputNumber min={0.5} max={2} step={0.01} defaultValue={locationSize} onChange={handleDebounceChange} />
            }
          >
            <List.Item.Meta title={`货架大小:`} />
          </List.Item>
        </div>
      </List>
    </div>
  );
  // return <PointCloud />;
  return (
    <div
      className=' shadow-custom-box-1 rounded-lg w-full h-full overflow-hidden'
      ref={mappingRef}
      style={{
        backgroundColor: token.colorBgContainer,
      }}
    >
      {/* <RcsMapping />; */}
      <div className='w-full h-full relative overflow-hidden'>
        <div
          className='absolute flex top-0 left-0 w-full shadow-lg z-10 rounded-t-lg justify-between items-center px-4 py-1'
          style={{
            backgroundColor: token.colorBgContainer,
          }}
        >
          <div>
            <Typography.Title className='!m-0' level={5}>
              {t('common.vehicle.mapInfo')}
            </Typography.Title>
          </div>
          <div className='flex items-center gap-2'>
            <div>
              <Select
                suffixIcon={
                  <div className='flex gap-1'>
                    <DownOutlined />
                    <Tooltip
                      title={
                        <>
                          {t('common.vehicle.locationInfo')}
                          <Button
                            type='link'
                            onClick={() => {
                              navigate('/slot');
                            }}
                          >
                            {t('common.viewAll')}
                          </Button>
                        </>
                      }
                    >
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                }
                className='w-32'
                showSearch
                allowClear
                size='small'
                optionFilterProp='label'
                placeholder={t('common.vehicle.searchLocation')}
                getPopupContainer={() => mappingRef.current}
                options={mappingData?.storageDatas?.map((item) => {
                  return {
                    value: item?.locationCode,
                    label: item?.locationCode,
                  };
                })}
                onChange={(locationCode) => {
                  if (locationCode) {
                    const location = mappingData?.storageDatas?.find((item) => item?.locationCode === locationCode);
                    if (location) {
                      cameraControls.setLookAt(
                        location?.x / 1000,
                        8,
                        0 - location?.y / 1000,
                        location?.x / 1000,
                        0,
                        0 - location?.y / 1000,
                        true,
                      );
                    }
                  }
                }}
              />
            </div>
            <Select
              suffixIcon={
                <div className='flex gap-1'>
                  <DownOutlined />
                  <Tooltip
                    title={
                      <>
                        {t('common.vehicle.vehicleInfo')}
                        <Button
                          type='link'
                          onClick={() => {
                            window.open('/rcs-web/#/vehicle/configuration', '_blank');
                          }}
                        >
                          {t('common.viewAll')}
                        </Button>
                      </>
                    }
                  >
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
              }
              className='w-32'
              showSearch
              allowClear
              size='small'
              getPopupContainer={() => mappingRef.current}
              optionFilterProp='label'
              placeholder={t('common.vehicle.searchVehicle')}
              onChange={(vehicleNum) => {
                if (vehicleNum) {
                  const vehicle = vehicles?.find((item) => item.vehicleNum === vehicleNum);
                  if (vehicle) {
                    // cameraControls.setPosition(vehicle.x / 1000 + 0.1, 4, 0 - vehicle.y / 1000 + 0.1, true);
                    // cameraControls.setTarget(vehicle.x / 1000, 0, 0 - vehicle.y / 1000, true);
                    cameraControls.setLookAt(
                      vehicle.x / 1000,
                      8,
                      0 - vehicle.y / 1000,
                      vehicle.x / 1000,
                      0,
                      0 - vehicle.y / 1000,
                      true,
                    );
                  }
                  setSelectedVehicle(vehicleNum);
                  setOpen(true);
                }
              }}
              options={vehicles?.map((item) => {
                return {
                  value: item?.vehicleNum,
                  label: item?.vehicleNum,
                };
              })}
            />
          </div>
        </div>
        <LocationMapping mappingData={mappingData} />
        <Popover
          getPopupContainer={() => mappingRef.current}
          placement='leftBottom'
          trigger='click'
          title={'地图操作'}
          content={popoverContent}
        >
          <FloatButton
            icon={<SettingOutlined />}
            className='!absolute right-4 bottom-4 !z-10'
            onClick={() => console.log('onClick')}
          />
        </Popover>
        <div className='!absolute cursor-pointer top-12 right-4 z-10 flex flex-col items-center gap-2 text-lg'>
          {isFullscreen ? (
            <FullscreenExitOutlined onClick={exitFullscreen} />
          ) : (
            <FullscreenOutlined onClick={enterFullscreen} />
          )}
        </div>
        {/* 地图控制器 */}
        <div className='!absolute bottom-4 left-4 z-10 flex flex-col items-center gap-2 text-lg'>
          <Space.Compact block>
            {/* <Button
              icon={<ZoomInOutlined className='cursor-pointer' />}
              onClick={() => {
                // cameraControls.dollyTo({ x: 1, y: 1 }, true);
                // cameraControls.update();
              }}
            ></Button>
            <Button
              icon={<ZoomOutOutlined className='cursor-pointer' />}
              onClick={() => {
                cameraControls.setPosition(
                  cameraControls._position0.x,
                  cameraControls._position0.y - 1,
                  cameraControls._position0.z,
                  true,
                );
              }}
            ></Button> */}
            <Button
              icon={<VerticalAlignTopOutlined className='cursor-pointer' />}
              onClick={() => {
                cameraControls.rotateTo(cameraControls.azimuthAngle, cameraControls.polarAngle + 0.1, true);
              }}
            ></Button>
            <Button
              icon={<VerticalAlignBottomOutlined className='cursor-pointer' />}
              onClick={() => {
                cameraControls.rotateTo(cameraControls.azimuthAngle, cameraControls.polarAngle - 0.1, true);
              }}
            ></Button>
            <Button
              icon={<VerticalAlignTopOutlined className='cursor-pointer -rotate-90' />}
              onClick={() => {
                cameraControls.rotateTo(cameraControls.azimuthAngle + 0.1, cameraControls.polarAngle, true);
              }}
            ></Button>
            <Button
              icon={<VerticalAlignBottomOutlined className='cursor-pointer -rotate-90' />}
              onClick={() => {
                cameraControls.rotateTo(cameraControls.azimuthAngle - 0.1, cameraControls.polarAngle, true);
              }}
            ></Button>
            <Button
              icon={<RedoOutlined className='cursor-pointer' />}
              onClick={() => {
                const position = cameraControls._position0;
                cameraControls.rotateTo(0, 0, true);
                cameraControls.setLookAt(position.x, position.y, position.z, position.x, 0, position.z, true);
              }}
            ></Button>
          </Space.Compact>
        </div>
        {/* 车辆详情 */}
        <Drawer
          title={t('common.viehicle.vehicleDetail')}
          placement='right'
          width={'300px'}
          destroyOnClose
          styles={{
            body: {
              padding: '0 8px',
            },
          }}
          classNames={{
            wrapper: '!transform-none',
          }}
          mask={false}
          // closable={false}
          onClose={() => {
            setOpen(false);
          }}
          extra={
            <Button color='primary' className='text-xs h-5' variant='filled' size='small'>
              {t('common.vehicle.debugger')}
            </Button>
          }
          open={open}
          getContainer={false}
        >
          <VehicleStatus selectedVehicle={selectedVehicle} />
        </Drawer>
      </div>
      {/* <RcsMapping2d /> */}
    </div>
  );
}
