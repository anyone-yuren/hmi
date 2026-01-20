import { post } from '@gbeata/app-global';

export const postFloorList = () => post('/navigation/floor_list', {}, '10001');

export const addFloor = (num: any) => {
  return post(
    '/navigation/add_new_floor_number',
    {
      floor_number: num,
    },
    '10001',
  );
};

export const updateFloor = (data: any) => {
  return post(
    '/navigation/modify_map_floor',
    {
      ...data,
    },
    '10001',
  );
};

export const getFloorData = (floor: number): Promise<any> => {
  return post(
    '/navigation/request_target_floor_map',
    {
      floor_number: floor,
    },
    '10001',
  );
};

export const delFloor = (floor: number) => {
  return post(
    '/navigation/delete_full_floor_map',
    {
      floor_number: floor,
    },
    '10001',
  );
};

export const switchFloor = (floor: number) => {
  return post(
    '/navigation/switch_floor',
    {
      floor_number: floor,
    },
    '10001',
  );
};

export const addSlamMap = (data: { floor_number: number; cmd_type: number }) => {
  return post('/navigation/slam_mapping', data, '10001');
};

export const initalPose = (data: { floor_number: number; pose?: any }) => {
  return post('/navigation/smart_initialpose', data, '10001');
};

export const extendMapping = (data: { floor_number: number; cmd_type: number }) => {
  return post('/navigation/slam_extend_mapping', data, '10001');
};

export const delFloorMap = (data: { floor_number: number; map_type: number }) => {
  return post('/navigation/delete_target_type_map', data, '10001');
};

export const pointCloudDiag = () => {
  return post('/navigation/cmd/point_cloud_diag', {}, '10001');
};

export const relocatePoint = (data: any) => post('/navigation/relocate_point', data, '10001'); // /navigation/cmd/relocate_point

export const requestNavigationRegion = () => post('/navigation/request_navigation_region', {}, '10001'); // /navigation/cmd/request_navigation_region

export const qrcode_mapping = (data: any) => post('/navigation/qrcode_mapping', data, '10001');
