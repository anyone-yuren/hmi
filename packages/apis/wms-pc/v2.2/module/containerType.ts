import { defHttp } from '../axios';
// 获取区域列表哦
export const getContainerType = (params: any) =>
  defHttp.get<any>({
    url: '/container-type',
    params,
  });

// 获取区域详情
export const getContainerTypeDetail = (params: any) =>
  defHttp.get<any>({
    url: `/container-type/${params.id}`,
  });

// 编辑区域
export const updateContainerType = (params: any) =>
  defHttp.put<any>({
    url: `/container-type/${params.id}`,
    data: params,
  });
// 新增区域
export const addContainerType = (params: any) =>
  defHttp.post<any>({
    url: '/container-type',
    data: params,
  });
// 删除区域
export const deleteContainerType = (params: any) =>
  defHttp.delete<any>({
    url: `/container-type/${params}`,
  });

// 获取容器选项列表
export const getContainerTypeOptions = () =>
  defHttp.get<any>({
    url: '/container-type/options',
  });
