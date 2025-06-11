import { defHttp } from '../axios';

// 获取区域列表哦
export const getMaterialType = (params: any) =>
  defHttp.get<any>({
    url: '/material-type',
    params,
  });

// 获取区域详情
export const getMaterialTypeDetail = (params: any) =>
  defHttp.get<any>({
    url: `/material-type/${params.id}`,
  });

// 编辑区域
export const updateMaterialType = (params: any) =>
  defHttp.put<any>({
    url: `/material-type/${params.id}`,
    data: params,
  });
// 新增区域
export const addMaterialType = (params: any) =>
  defHttp.post<any>({
    url: '/material-type',
    data: params,
  });
// 删除区域
export const deleteMaterialType = (params: any) =>
  defHttp.delete<any>({
    url: `/material-type/${params}`,
  });
