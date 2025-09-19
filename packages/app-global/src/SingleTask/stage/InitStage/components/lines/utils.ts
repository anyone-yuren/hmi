import { BSpline } from './bSpline';
import { SplinePoint } from './splinePoint';
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

export const generateBezierCurve = (
  controlPoints: { x: number; y: number }[], // 控制点数组
  steps: number = 100, // 采样点数，默认值为 100
): { x: number; y: number }[] => {
  if (controlPoints.length < 2) {
    throw new Error('至少需要两个控制点来生成贝塞尔曲线');
  }

  const bezierPoints: { x: number; y: number }[] = [];

  // 计算贝塞尔曲线上的点
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 参数 t ∈ [0, 1]
    const point = calculateBezierPoint(controlPoints, t);
    bezierPoints.push(point);
  }

  return bezierPoints;
};

const calculateBezierPoint = (
  points: { x: number; y: number }[], // 当前控制点数组
  t: number, // 参数 t ∈ [0, 1]
): { x: number; y: number } => {
  if (points.length === 1) {
    return points[0]; // 基础情况：只剩下一个点
  }

  // 计算下一层控制点
  const nextPoints: { x: number; y: number }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midPoint = {
      x: (1 - t) * p0.x + t * p1.x,
      y: (1 - t) * p0.y + t * p1.y,
    };
    nextPoints.push(midPoint);
  }

  // 递归调用
  return calculateBezierPoint(nextPoints, t);
};

// 新线段 - 0:直线 1: 4个点贝塞尔 2: 3个点贝塞尔 3: B样条
export const lineControlsHashmap = {
  0: ({ ary, length }) => {
    if (!length) {
      return [];
    }
    return [
      [ary[0].x, -ary[0].y],
      [ary[length - 1].x, -ary[length - 1].y],
    ];
  },
  1: ({ ary, length }) => {
    return generateBezierCurve(ary, 20).flatMap((item: any) => {
      return [item.x, -item.y];
    });
  },
  2: ({ ary, length }) => {
    return generateBezierCurve(ary, 20).flatMap((item: any) => {
      return [item.x, -item.y];
    });
  },
  3: ({ ary, length }) => {
    const result: number[] = [];
    const t = length / 20;
    const points = ary.map(function (p) {
      return SplinePoint.CreateSplinePoint(p.x, -p.y);
    });
    const bSpline = new BSpline(points, t);
    bSpline.PlotPoints().forEach((point: any) => {
      result.push(point.X, point.Y);
    });
    return result;
  },
};
