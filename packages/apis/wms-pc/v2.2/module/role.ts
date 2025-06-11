import { defHttp } from '../axios';

// 获取区域列表哦
export const getRole = (params: any) =>
  defHttp.get<any>({
    url: '/role',
    params,
  });

// 获取区域详情
export const getRoleDetail = (params: any) =>
  defHttp.get<any>({
    url: `/role/${params.id}`,
  });

// 编辑区域
export const updateRole = (params: any) =>
  defHttp.put<any>({
    url: `/role/${params.id}`,
    data: params,
  });
// 新增区域
export const addRole = (params: any) =>
  defHttp.post<any>({
    url: '/role',
    data: params,
  });
// 删除区域
export const deleteRole = (params: any) =>
  defHttp.delete<any>({
    url: `/role/${params}`,
  });

// 获取角色对应权限
export const getRolePermissions = (params: any) =>
  defHttp.get<any>({
    url: `/role/${params}/permissions`,
  });

// 给角色分配权限
export const updateRolePermissions = (params: any) =>
  defHttp.put<any>({
    url: `/role/${params.id}/permissions`,
    data: params,
  });
