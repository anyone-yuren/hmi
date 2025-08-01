import { get, post } from '@gbeata/app-global';

export const getPointList = () => get('/sirius/topics/point_info_list', {}, '10009');
export const getLineList = () => get('/mwrobot/get_segments_info', {}, '10009');
export const config_agv_info = () => get('/robot_config/base_param/config_agv_info');
export const getModelList = () => get('/cv_mwrobot/get_model_list', {}, '10010');
export const getModalTypes = () => get('/cv_mwrobot/get_model_types', {}, '10010');

export const deleteModel = (data: any) => post('/cv_mwrobot/delete_model', data, '10010');
export const saveModel = (data: any) => post('/cv_mwrobot/save_model', data, '10010');
export const updateModel = (data: any) => post('/cv_mwrobot/update_model', data, '10010');

export const getVisionPickSetting = () => get('/cv_mwrobot/pick_pallet_position_detect/read', {}, '10010');

export const saveVisionPickSetting = () => get('/cv_mwrobot/pick_pallet_position_detect/save', {}, '10010');

// 获取到点云筛选的配置&且会让点云开始推送
export const getPointCloudMonitoringRead = (data: any) =>
  post('/cv_mwrobot/point_cloud_monitoring/read', data, '10010');

// 结束点云推送
export const getPointCloudMonitoringBack = () => get('/cv_mwrobot/point_cloud_monitoring/back', {}, '10010');

// 保存
export const postPointCloudMonitoringSave = (data: any) =>
  post('/cv_mwrobot/point_cloud_monitoring/save', data, '10010');

// 写入
export const postPointCloudMonitoringWrite = (data: any) =>
  post('/cv_mwrobot/point_cloud_monitoring/write', data, '10010');

// 货架放货视觉参数读取
export const getShelfPlacePalletPositionDetectRead = () =>
  get('/cv_mwrobot/common_scenarios/place_pallet_position_detect/read', {}, '10010');
export const postShelfPlacePalletPositionDetectSave = (data: any) =>
  post('/cv_mwrobot/common_scenarios/place_pallet_position_detect/save', data, '10010');

// 货架放货挪车参数读取
export const getShelfPlaceMoveVehicleRead = () =>
  get('/cv_mwrobot/common_scenarios/place_move_vehicle/read', {}, '10010');
export const postShelfPlaceMoveVehicleSave = (data: any) =>
  post('/cv_mwrobot/common_scenarios/place_move_vehicle/save', data, '10010');

// 堆叠放货视觉参数
export const getStackPlacePalletPositionDetectRead = () =>
  get('/cv_mwrobot/stack_scenarios/place_pallet_position_detect/read', {}, '10010');
export const postStackPlacePalletPositionDetectSave = (data: any) =>
  post('/cv_mwrobot/stack_scenarios/place_pallet_position_detect/save', data, '10010');

// 堆叠放货挪车参数
export const getStackPlaceMoveVehicleRead = () =>
  get('/cv_mwrobot/stack_scenarios/place_move_vehicle/read', {}, '10010');

export const postStackPlaceMoveVehicleSave = (data: any) =>
  post('/cv_mwrobot/stack_scenarios/place_move_vehicle/save', data, '10010');

export const getFlatPlacePalletPositionDetectRead = () =>
  get('/cv_mwrobot/flat_flt_truck_scenarios/place_pallet_position_detect/read', {}, '10010');
export const postFlatPlacePalletPositionDetectSave = (data: any) =>
  post('/cv_mwrobot/flat_flt_truck_scenarios/place_pallet_position_detect/save', data, '10010');

export const getFlatPlaceMoveVehicleRead = () =>
  get('/cv_mwrobot/flat_flt_truck_scenarios/place_move_vehicle/read', {}, '10010');
export const postFlatPlaceMoveVehicleSave = (data: any) =>
  post('/cv_mwrobot/flat_flt_truck_scenarios/place_move_vehicle/save', data, '10010');

export const getVisualPlaceRead = () => get('/cv_mwrobot/visual_place/read', {}, '10010');
export const postVisualPlaceSave = (data: any) => post('/cv_mwrobot/visual_place/save', data, '10010');

export const getGoodsStateDetectRead = () => get('/cv_mwrobot/common_scenarios/goods_status_detect/read', {}, '10010');

export const postGoodsStateDetectSave = (data: any) =>
  post('/cv_mwrobot/common_scenarios/goods_status_detect/save', data, '10010');

export const getPlaceSpaceDetectRead = () => get('/cv_mwrobot/common_scenarios/place_space_detect/read', {}, '10010');

export const postPlaceSpaceDetectSave = (data: any) =>
  post('/cv_mwrobot/common_scenarios/place_space_detect/save', data, '10010');

export const getTailTruckRead = (params: any, config: any) => get('/cv_mwrobot/tail_truck/read', params, '10010');

export const postTailTruckSave = (data: any) => post('/cv_mwrobot/tail_truck/save', data, '10010');

// cv_mwrobot/tail_truck_scenarios/map_point_setting/read 点位观测&读写
export const getTailTruckScenariosMapPointSettingRead = () =>
  get('/cv_mwrobot/tail_truck_scenarios/map_point_setting/read', {}, '10010');

export const postTailTruckScenariosMapPointSettingSave = (data: any) =>
  post('/cv_mwrobot/tail_truck_scenarios/map_point_setting/save', data, '10010');

// cv_mwrobot/tail_truck_scenarios/pick_storage_detect/read 观测任务卸车&读写
export const getTailTruckScenariosPickStorageDetectRead = () =>
  get('/cv_mwrobot/tail_truck_scenarios/pick_storage_detect/read', {}, '10010');
export const postTailTruckScenariosPickStorageDetectSave = (data: any) =>
  post('/cv_mwrobot/tail_truck_scenarios/pick_storage_detect/save', data, '10010');

// cv_mwrobot/tail_truck_scenarios/pick_storage_detect/read 观测任务装车&读写
export const getTailTruckScenariosReleaseStorageDetectRead = () =>
  get('/cv_mwrobot/tail_truck_scenarios/place_storage_detect/read', {}, '10010');
export const postTailTruckScenariosReleaseStorageDetectSave = (data: any) =>
  post('/cv_mwrobot/tail_truck_scenarios/place_storage_detect/save', data, '10010');

// cv_mwrobot/tail_truck_scenarios/pick_pallet_position_detect/read 卸车-取货姿态识别&读写
export const getTailTruckScenariosPickPalletPositionDetectRead = () =>
  get('/cv_mwrobot/tail_truck_scenarios/pick_pallet_position_detect/read', {}, '10010');
export const postTailTruckScenariosPickPalletPositionDetectSave = (data: any) =>
  post('/cv_mwrobot/tail_truck_scenarios/pick_pallet_position_detect/save', data, '10010');

// cv_mwrobot/tail_truck_scenarios/pick_move_vehicle/read 卸车-叉臂横移&读写
export const getTailTruckScenariosPickMoveVehicleRead = () =>
  get('/cv_mwrobot/tail_truck_scenarios/pick_move_vehicle/read', {}, '10010');
export const postTailTruckScenariosPickMoveVehicleSave = (data: any) =>
  post('/cv_mwrobot/tail_truck_scenarios/pick_move_vehicle/save', data, '10010');

// cv_mwrobot/tail_truck_scenarios/place_pallet_position_detect/read 装车-车厢放货姿态识别&读写
export const getTailTruckScenariosPlacePalletPositionDetectRead = () =>
  get('/cv_mwrobot/tail_truck_scenarios/place_pallet_position_detect/read', {}, '10010');
export const postTailTruckScenariosPlacePalletPositionDetectSave = (data: any) =>
  post('/cv_mwrobot/tail_truck_scenarios/place_pallet_position_detect/save', data, '10010');

// cv_mwrobot/tail_truck_scenarios/place_move_vehicle/read 装车-叉臂横移识别&读写
export const getTailTruckScenariosPlaceMoveVehicleRead = () =>
  get('/cv_mwrobot/tail_truck_scenarios/place_move_vehicle/read', {}, '10010');
export const postTailTruckScenariosPlaceMoveVehicleSave = (data: any) =>
  post('/cv_mwrobot/tail_truck_scenarios/place_move_vehicle/save', data, '10010');

// cv_mwrobot/tail_truck_scenarios/place_space_detect/read 装车-放货间隙识别&读写
export const getTailTruckScenariosPlaceSpaceDetectRead = () =>
  get('/cv_mwrobot/tail_truck_scenarios/place_gap_detect/read', {}, '10010');
export const postTailTruckScenariosPlaceSpaceDetectSave = (data: any) =>
  post('/cv_mwrobot/tail_truck_scenarios/place_gap_detect/save', data, '10010');

// cv_mwrobot/tail_truck_scenarios/vehicle_forward/read 退出车厢*读写
export const getTailTruckScenariosVehicleForwardRead = () =>
  get('/cv_mwrobot/tail_truck_scenarios/vehicle_forward/read', {}, '10010');
export const postTailTruckScenariosVehicleForwardSave = (data: any) =>
  post('/cv_mwrobot/tail_truck_scenarios/vehicle_forward/save', data, '10010');

// 尾箱装卸读取库位点状态 cv_mwrobot/tail_truck_scenarios/goods_status_management/read
export const getTailTruckScenariosGoodsStatusManagementRead = () =>
  get('/cv_mwrobot/tail_truck_scenarios/goods_status_management/read', {}, '10010');

export const postTailTruckScenariosGoodsStatusManagementSave = (data: any) =>
  post('/cv_mwrobot/tail_truck_scenarios/goods_status_management/save', data, '10010');
