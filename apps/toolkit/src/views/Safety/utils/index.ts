// 将米转换成像素
export const meterToPixel = (meter: number) => {
  return Math.floor(meter * 100);
};

export const pixelToMeter = (pixel: number) => {
  return Math.floor(pixel / 100);
};

// 把两个点转换成矩形
export const generateRectanglePoints = (coords) => {
  if (!coords || coords.length !== 4) {
    return [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ];
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

export const isPointInRectangle = (px: number, py: number, rect: number[]) => {
  const [x1, y1, x2, y2] = rect;
  const minX = Math.min(x1, x2) / 1000;
  const maxX = Math.max(x1, x2) / 1000;
  const minY = Math.min(y1, y2) / 1000;
  const maxY = Math.max(y1, y2) / 1000;
  return px >= minX && px <= maxX && py >= minY && py <= maxY;
};

export const isPointInVehicle = (px: number, py: number, pz: number, rect: number[]) => {
  const [x1, y1, x2, y2] = rect;
  const minX = Math.min(x1, x2) / 1000;
  const maxX = Math.max(x1, x2) / 1000;
  const minY = Math.min(y1, y2) / 1000;
  const maxY = Math.max(y1, y2) / 1000;
  return px >= minX && px <= maxX && py >= minY && py <= maxY && pz < 1.8;
};

// 根据左上角xy与宽高 生成一个【x1,y1,x2,y2】的数组
export const getRectPoints = (x: number, y: number, width: number, height: number) => {
  return [0 - Math.round(y + height), 0 - Math.round(x + width), 0 - Math.round(y), 0 - Math.round(x)];
};

// 根据【x1,y1,x2,y2】数组 生成一个矩形
export const getRect = (points: number[]) => {
  return {
    x: 0 - points[3],
    y: 0 - points[2],
    width: Math.abs(points[1] - points[3]),
    height: Math.abs(points[0] - points[2]),
  };
};

// 将h7数据转换成数组
export const extractKeyValue = (obj: {
  io_input_config?: Record<string, any[]>;
  io_output_config?: Record<string, any[]>;
}): Record<string, { key: string; value: any }[]> => {
  const result: { key: string; value: any }[] = [];
  const inputConfig: { key: string; value: any }[] = [];
  const outputConfig: { key: string; value: any }[] = [];

  // 处理 io_input_config
  if (obj.io_input_config) {
    for (const [key, arr] of Object.entries(obj.io_input_config)) {
      result.push({ key, value: arr[2] });
      inputConfig.push({ key, value: arr[2] });
    }
  }

  // 处理 io_output_config
  if (obj.io_output_config) {
    for (const [key, arr] of Object.entries(obj.io_output_config)) {
      result.push({ key, value: arr[2] });
      outputConfig.push({ key, value: arr[2] });
    }
  }

  return { result, inputConfig, outputConfig };
};
