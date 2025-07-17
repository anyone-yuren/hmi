// 将米转换成像素
export const meterToPixel = (meter: number) => {
  return Math.floor(meter * 100);
};

export const pixelToMeter = (pixel: number) => {
  return Math.floor(pixel / 100);
};
