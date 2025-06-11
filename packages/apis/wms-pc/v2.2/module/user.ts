import { defHttp } from '../axios';

// 获取区域列表哦
export const getUser = (params: any) =>
  defHttp.get<any>({
    url: '/user',
    params,
  });

// 获取区域详情
export const getUserDetail = (params: any) =>
  defHttp.get<any>({
    url: `/user/${params.id}`,
  });

// 编辑区域
export const updateUser = (params: any) =>
  defHttp.put<any>({
    url: `/user/${params.id}`,
    data: params,
  });
