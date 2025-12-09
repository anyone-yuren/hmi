// 根据navigationType 位与运算判断是否显示对应导航
const navigationTypeObj: { [key: string]: number } = {
  REFLECTOR: 0, // 反光板导航，第0位表示
  LIDAR_SLAM_2D: 1, // 2D 激光 slam，第1位表示
  LIDAR_SLAM_3D: 2, // 3D 激光 slam，第2位表示
  SKY: 3, // 天空导航，第3位表示
  QRCODE: 4, // 二维码，第4位表示
  MAGNETIC: 5, // 磁钉，第5位表示
};
export const isShowNavigation = (navigationType: number, type: string) => {
  return navigationType & (1 << navigationTypeObj[type]);
};
