// 将米转换成像素
export const meterToPixel = (meter: number) => {
  return Math.floor(meter * 100);
};

export const pixelToMeter = (pixel: number) => {
  return Math.floor(pixel / 100);
};

// 把两个点转换成矩形
export const generateRectanglePoints = (coords) => {
  if (coords.length !== 4) {
    throw new Error('参数必须是包含4个数字的数组 [x1, y1, x2, y2]');
  }

  const [x1, y1, x2, y2] = coords;
  const minX = Math.min(x1, x2) / 1000;
  const maxX = Math.max(x1, x2) / 1000;
  const minY = Math.min(y1, y2) / 1000;
  const maxY = Math.max(y1, y2) / 1000;

  return [
    [minX, minY], // 左上角
    [maxX, minY], // 右上角
    [maxX, maxY], // 右下角
    [minX, maxY], // 左下角
  ];
};

export const getProjectArea = (forksUnderRect, forksHeight) => {
  if (!forksUnderRect) return null;

  const projectRect = generateRectanglePoints(forksUnderRect.rectangle);

  // 计算保护区域的尺寸
  const projectWidth = Math.abs(projectRect[1][0] - projectRect[0][0]); // 宽度
  const projectHeight = Math.abs(projectRect[2][1] - projectRect[0][1]); // 高度
  const projectDepth = Math.max(
    (forksHeight - forksUnderRect.height_start - forksUnderRect.forkarm_height_cut) / 1000,
    0,
  ); // 深度
  // 计算保护区域的位置
  const projectPosition = [
    (projectRect[0][0] + projectRect[1][0]) / 2, // X 中心点
    (projectRect[0][1] + projectRect[2][1]) / 2, // Y 中心点
    forksUnderRect.height_start / 1000 + projectDepth / 2, // Z 中心点
  ];
  return {
    width: projectWidth,
    height: projectHeight,
    depth: projectDepth,
    position: projectPosition,
  };
};
