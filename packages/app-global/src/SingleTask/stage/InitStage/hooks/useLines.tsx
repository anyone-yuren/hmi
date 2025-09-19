import { useThrottleEffect } from 'ahooks';
import { useState } from 'react';
import { lineControlsHashmap } from '../components/lines/utils';

const useLines = (props: any) => {
  const { lines, lineProps, lineVisible, boundary = [], scale, visibleConfig = {} } = props;
  const [line_visible, set_line_visible] = useState(lineVisible);
  const [origin_lines, set_origin_lines] = useState({ lines: [], hashMap: {} });
  const [line_props, set_line_props] = useState({
    ...lineProps,
  });

  function chunk(array: any, size = 1) {
    if (!Array.isArray(array) || size <= 0) {
      return [];
    }
    const result: any = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  function isPointInRectangle(px, py, x1, y1, x2, y2) {
    return px >= x1 && px <= x2 && py >= y2 && py <= y1;
  }

  const getFirstAndLast = (arr) => {
    if (arr.length === 0) return [];
    return [arr[0], arr[arr.length - 1]];
  };

  useThrottleEffect(
    () => {
      let origin: any = [];
      const lineHashMap: any = {};
      const directionHashMap: any = {};
      for (let index = 0; index < lines?.length; index += 1) {
        const line = lines[index];
        const { start, end, id } = line;
        const key = `${start}-${end}`,
          reverseKey = `${end}-${start}`;
        // const points = newCalcSplinePoints({
        //   ary: line.controlPoint,
        //   length: line.length,
        //   type: line.type,
        // });
        const points = lineControlsHashmap[line.type]({
          ary: line.controlPoint,
          length: line.length,
        });
        line.controls = points;
        line.simpleControls = getFirstAndLast(line.controlPoint).flatMap((item: any) => {
          return [item.x, -item.y];
        });
        !directionHashMap[key] && (directionHashMap[key] = line);
        !lineHashMap[id] && (lineHashMap[id] = line);

        const isInside = chunk(points, 2).some((item: any) => {
          const [x, y] = item;
          const [x1, y1, x2, y2] = boundary;
          if (!boundary.length) {
            return true;
          }
          return isPointInRectangle(x, -y, x1, y1, x2, y2);
        });
        const isReverseLine = !!directionHashMap[reverseKey];
        line_visible && isInside && !isReverseLine && origin.push(line);
      }
      // 移动端只取单向线
      origin.length > 1000 && (origin = origin.filter((_, index) => _.directionType === 1));

      set_origin_lines({
        lines: origin,
        hashMap: lineHashMap,
      });
    },
    [lines, line_visible, boundary, scale, visibleConfig],
    {
      wait: 600,
    },
  );

  return {
    lines: origin_lines.lines,
    visible: line_visible,
    hashMap: origin_lines.hashMap,
    lineProps: line_props,
  };
};
export default useLines;
