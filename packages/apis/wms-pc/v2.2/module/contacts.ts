import { defHttp } from '../axios';

// 获取区域列表哦
export const getContacts = (params: any) =>
  defHttp.get<any>({
    url: '/contact',
    params,
  });

// 获取区域详情
export const getContactsDetail = (params: any) =>
  defHttp.get<any>({
    url: `/contact/${params.id}`,
  });

// 编辑区域
export const updateContacts = (params: any) =>
  defHttp.put<any>({
    url: `/contact/${params.id}`,
    data: params,
  });
// 新增区域
export const addContacts = (params: any) =>
  defHttp.post<any>({
    url: '/contact',
    data: params,
  });
// 删除区域
export const deleteContacts = (params: any) =>
  defHttp.delete<any>({
    url: `/contact/${params}`,
  });
