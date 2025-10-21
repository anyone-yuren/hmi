import { get, post } from '../../https/index';

export const getTasks = () => get('/sirius/topics/test_task_info', {}, '10009');
export const createTask = (data) => post('/sirius/topics/test_task_execution', data, '10009');
export const cancelTask = (data) => post('/sirius/topics/test_task_cancel', data, '10009');
export const addHeightInfo = (data) => post('/mwrobot/single_task/add_height_info', data, '10009');
export const getHeightInfo = () => get('/mwrobot/single_task/get_height_info', {}, '10009');
export const deleteHeightInfo = (data) => post('/mwrobot/single_task/delete_height_info', data, '10009');
export const getPointList = () => get('/sirius/topics/point_info_list', {}, '10009');
export const getLineList = () => get('/mwrobot/get_segments_info', {}, '10009');
export const addTemplate = (data) => post('/mwrobot/single_task/add_template_task', data, '10009');
export const deleteTemplate = (data) => post('/mwrobot/single_task/delete_template_task', data, '10009');
export const getTemplate = () => get('/mwrobot/single_task/get_template_task', {}, '10009');
export const updateTemplate = (data) => post('/mwrobot/single_task/update_template_task', data, '10009');

export const getTaskMode = () => get('/mwrobot/config/get_task_mode', {}, '10009');
export const setTaskMode = (data) => post('/mwrobot/config/set_task_mode', data, '10009');
export const uploadRcsMap = (data) => post('/mwrobot/config/upload_rcs_map', data, '10009');
export const chargePolicy = (data) => post('/mwrobot/single_task/set_charge_policy', data, '10009');
export const getChargePolicy = () => get('/mwrobot/single_task/get_charge_policy', {}, '10009');

export const config_agv_info = () => get('/robot_config/base_param/config_agv_info', {}, '10009');

export const getFloorData = (floor) =>
  post(
    '/navigation/request_target_floor_map',
    {
      floor_number: floor,
    },
    '10001',
  );

// 这两个偏移表的马上废弃了
// export const offsetTable = () => get('/sirius/offset_table', {}, '10009');
// export const offsetTableSave = (data) => post('/sirius/offset_table_save', data, '10009');

// 新的偏移表接口
export const offsetTable = () => get('/mwrobot/offset_table/query', {}, '10009');
export const updateOffsetTable = (data) => post('/mwrobot/offset_table/update', data, '10009'); // 废弃，新增和修改都是同样的参数

export const deleteOffsetTable = (data) => post('/mwrobot/offset_table/delete', data, '10009');

export const createOffsetTable = (data) => post('/mwrobot/offset_table/insert', data, '10009');
