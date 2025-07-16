import { post } from '@/https';

/**
 * 反光板构建
 * @param {number} floor_number 楼层号
 * @returns
 */
export const postReflectorMapping = (floor_number: number) =>
  post(`/navigation/cmd/start_reflector_mapping`, { floor_number }, '10001');

/**
 * 反光板扩展地图
 * @param {number} floor_number 楼层号
 * @returns
 */
export const postReflectorExtendMapping = (floor_number: number) =>
  post(`/navigation/cmd/extend_reflector_mapping`, { floor_number }, '10001');

/**
 * 镇定
 * @returns
 */
export const postSettleReflectors = () => post(`/navigation/cmd/settle_reflectors`, {}, '10001');

/**
 * 镇定 - 添加
 * @returns
 */
export const postAddSettledReflectors = () => post(`/navigation/cmd/add_new_reflectors`, {}, '10001');

/**
 * 删除选中的反光板
 * @param params
 * @returns
 */
export const postDeleteTargetReflectors = (params: { floor_number: number; reflectors_id: number[] }) =>
  post(`/navigation/cmd/delete_target_reflectors`, params, '10001');

/**
 * 删除对应楼层指定类型的地图
 * @param params
 * @param {params.floor_number} params.floor_number 楼层号
 * @param {params.map_type} params.map_type 地图类型 反光板：1 ，slam: 2，二维码 ：5
 * @returns
 */
export const postDeleteTargetTypeMap = (params: { floor_number: number; map_type: 1 | 2 | 5 }) =>
  post(`/navigation/delete_target_type_map`, params, '10001');

/**
 * 保存反光板地图
 * @returns
 */
export const postSaveReflectorMapping = () => post(`/navigation/cmd/save_reflector_map`, {}, '10001');

/**
 * 结束反光板构建
 * @returns
 */
export const postEndReflectorMapping = () => post(`/navigation/cmd/stop_reflector_mapping`, {}, '10001');
