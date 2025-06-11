import { defHttp } from '../../axios';

const get = (url: string, params?: any) => defHttp.get({ url, params });
const post = (url: string, data?: any) => defHttp.post({ url, data });

export const createOutbound = (data: any) => post('/custom/request-outbound', data);

export const getOutboundSlotOptions = () => get('/custom/user-visible-outbound-slot-options');

export const getOutboundSlotList = (params: any) => get('/custom/carrier-list', params);
