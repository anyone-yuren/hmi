import { SplinePoint } from './splinePoint';
import { BSpline } from './bSpline';
export const newCalcSplinePoints = ({ ary, length, type }) => {
  if (type === 1) {
    return ary.flatMap((item: any) => {
      return [item.x, -item.y];
    });
  }
  const result: number[] = [];
  // Type: 1-直线，2-曲线，3-圆弧
  const t = length / 20;
  const points = ary.map(function (p) {
    return SplinePoint.CreateSplinePoint(p.x, -p.y);
  });
  const bSpline = new BSpline(points, t);
  bSpline.PlotPoints().forEach((point: any) => {
    result.push(point.X, point.Y);
  });
  return result;
};
export const calcSplinePoints = (
  edge: any & {
    startPoint?: { x: number; y: number };
    endPoint?: { x: number; y: number };
  },
) => {
  const result: number[] = [];
  // Type: 1-直线，2-曲线，3-圆弧
  if (edge.Type === 1) {
    edge.ControlPoint.forEach((cPoint) => {
      result.push(cPoint.X, cPoint.Y);
    });
  } else {
    const t = edge.Length / 20;
    const points = edge.ControlPoint.map(function (p) {
      return SplinePoint.CreateSplinePoint(p.X, p.Y);
    });
    // console.log('[useLines]: points', points);
    const bSpline = new BSpline(points, t);
    bSpline.PlotPoints().forEach((point) => {
      result.push(point.X, point.Y);
    });
  }

  return result;
};

// 废了 没鸟用
function newBezierCurve(obj: any) {
  // let newAry = [];
  const controlAry = obj.control.map((item: any) => {
    return { x: item.x, y: item.y };
  });
  const pointsAry = [{ x: obj.start.x, y: obj.start.y }, ...controlAry, { x: obj.end.x, y: obj.end.y }];
  const map = new Map();

  pointsAry.forEach((item) => {
    map.set(`${item.x},${item.y}`, item);
  });
  const uniquePointsAry = Array.from(map.values());
  const newAry = recursionGetPoints(uniquePointsAry, obj.level);
  const numberAry = newAry?.flatMap((item: any) => {
    return [item.x, -item.y];
  });
  return numberAry;
}

const recursionGetPoints = (ary, level) => {
  if (level === 0) {
    return ary;
  }
  let newAry = [];
  for (let index = 0; index < ary.length - 1; index += 1) {
    const midAry: any = calculateMidPoint(ary[index], ary[index + 1]);
    newAry = newAry.concat(midAry);
  }
  return recursionGetPoints(newAry, level - 1);
};

export function calculateMidPoint(point1, point2) {
  // 计算两点之间的中点
  return [
    point1,
    {
      x: (point1.x + point2.x) / 2,
      y: (point1.y + point2.y) / 2,
    },
    point2,
  ];
}
