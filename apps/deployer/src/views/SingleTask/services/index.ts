import { get, post } from '@/https';

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
export const getTaskMode = () => get('/mwrobot/config/get_task_mode', {}, '10009');
export const setTaskMode = (data) => post('/mwrobot/config/set_task_mode', data, '10009');
export const uploadRcsMap = (data) => post('/mwrobot/config/upload_rcs_map', data, '10009');
export const chargePolicy = (data) => post('/mwrobot/single_task/set_charge_policy', data, '10009');
export const getChargePolicy = () => get('/mwrobot/single_task/get_charge_policy', {}, '10009');
