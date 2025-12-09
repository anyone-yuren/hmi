import { get, post } from '@gbeata/app-global';
import YAML from 'js-yaml';

export const getCurrent = () => get('/vehicle/status/current_error', {}, '10020');
export const getHistory = () => get('/vehicle/status/history_error', {}, '10020');

export const getResult = () => post('/vehicle/diagnostic/query_result', {}, '10020');

export const postErrorCode = (data: any) => post('/vehicle/diagnostic/error_code', data, '10020');
export const postPhenomenon = (data: any) => post('/vehicle/diagnostic/phenomenon', data, '10020');
export const queryPhenomenonList = () => get('/vehicle/diagnostic/query_phenomenon_list', {}, '10020');

export const error_log_download = (params: any) => post('/mwrobot/error_log', YAML.dump(params), '10009');
