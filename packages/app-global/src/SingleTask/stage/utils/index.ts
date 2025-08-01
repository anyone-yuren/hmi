interface IExtremum {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
// 从极值中获取边界
export const getBoundaryFromExtremum = ({ minX, maxX, minY, maxY }: IExtremum) => {
  return [minX, maxY, maxX, maxY, maxX, minY, minX, minY, minX, maxY];
};

interface IExtremePoint {
  UpRight: {
    X: number;
    Y: number;
  };
  DownLeft: {
    X: number;
    Y: number;
  };
}
export const getBoundaryFromExtremePoint = ({ UpRight, DownLeft }: IExtremePoint) => {
  const [minX, maxX, minY, maxY] = [DownLeft.X, UpRight.X, DownLeft.Y, UpRight.Y];
  return getBoundaryFromExtremum({ minX, maxX, minY, maxY });
};
