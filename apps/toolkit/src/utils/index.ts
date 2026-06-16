//
interface Pose {
  id: number;
  pose_x: number;
  pose_y: number;
}
export const roundCoordinates = (arr: Pose[]): Pose[] => {
  return arr.map((item) => ({
    ...item,
    pose_x: Math.round(item.pose_x * 100) / 100, // 先乘以 100，再四舍五入后除以 100
    pose_y: Math.round(item.pose_y * 100) / 100, // 同上
  }));
};
