// 将米转换成像素
export const meterToPixel = (meter: number) => {
  return Math.floor(meter * 100);
};

export const pixelToMeter = (pixel: number) => {
  return Math.floor(pixel / 100);
};

// 根据左上角xy与宽高 生成一个【x1,y1,x2,y2】的数组
export const getRectPoints = (x: number, y: number, width: number, height: number) => {
  return [0 - y, 0 - x, 0 - (y + height), 0 - (x + width)];
};

// 根据【x1,y1,x2,y2】数组 生成一个矩形
export const getRect = (points: number[]) => {
  return {
    x: 0 - points[1],
    y: 0 - points[0],
    width: Math.abs(points[3] - points[1]),
    height: Math.abs(points[2] - points[0]),
  };
};
