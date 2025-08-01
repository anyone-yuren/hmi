import { SplinePoint } from './splinePoint';
export class BSpline {
  private _Degree: number;
  private _Nodes: number;
  private _Gaps: number;
  private _KnotLength: number;
  private _KnotVectors: number[];
  private _MinKnotVector: number;
  private _MaxKnotVector: number;
  private _CtrlPoints: SplinePoint[];
  private _KnotPoints: SplinePoint[];
  private _PlotPoints: SplinePoint[];
  private _PlotDensity: number;

  constructor(points: SplinePoint[], density: number) {
    this._Degree = 5;
    this._Nodes = 0;
    this._Gaps = 0;
    this._KnotLength = 0;
    this._KnotVectors = [];
    this._MinKnotVector = 0;
    this._MaxKnotVector = 0;
    this._CtrlPoints = [];
    this._KnotPoints = [];
    this._PlotPoints = [];
    this._PlotDensity = density;
    this.Constructor(points);
  }

  public PlotPoints(): SplinePoint[] {
    return this._PlotPoints;
  }

  private Constructor(points: SplinePoint[]): void {
    this._CtrlPoints = points;
    this._Nodes = points.length;
    this._Gaps = this._Nodes - 1;

    this.CalculateKnots();
    this.CalculatePlotPoints();
  }

  private CalculateKnots(): void {
    this._KnotLength = this._Nodes + this._Degree;
    this._KnotVectors = [];
    for (let j = 0; j < this._KnotLength; j++) {
      if (j < this._Degree) {
        this._KnotVectors[j] = 0;
      } else if (j <= this._Gaps) {
        this._KnotVectors[j] = j - this._Degree + 1;
      } else {
        this._KnotVectors[j] = this._Gaps - this._Degree + 2;
      }
    }
    this._MinKnotVector = this._KnotVectors[0];
    this._MaxKnotVector = this._KnotVectors[this._KnotLength - 1];
  }

  private CalculatePlotPoints(): void {
    const plots: SplinePoint[] = [];

    let u = 0;
    while (u <= this._MaxKnotVector) {
      const newPoint = this.GetBasicPoint(u);
      plots.push(newPoint);

      if (u == this._MaxKnotVector) break;

      u += this._PlotDensity / newPoint.Module;
      if (u > this._MaxKnotVector) u = this._MaxKnotVector;
    }

    this._PlotPoints = plots;
  }

  private GetBasicPoint(u: number): SplinePoint {
    let x = 0;
    let y = 0;
    let dx = 0;
    let dy = 0;
    let ddx = 0;
    let ddy = 0;

    for (let k = 0; k <= this._Gaps; k++) {
      const bv = this.GetBasicValue(u, k, this._Degree);
      x += this._CtrlPoints[k].X * bv;
      y += this._CtrlPoints[k].Y * bv;

      const bd = this.GetBasicDifferential(u, k, this._Degree);
      dx += this._CtrlPoints[k].X * bd;
      dy += this._CtrlPoints[k].Y * bd;

      const bdd = this.GetDoubleDifferential(u, k, this._Degree);
      ddx += this._CtrlPoints[k].X * bdd;
      ddy += this._CtrlPoints[k].Y * bdd;
    }

    const angle = Math.atan2(dy, dx);
    const module = Math.sqrt(dx * dx + dy * dy);

    let curvature = 1000000000;

    if (module != 0) {
      curvature = (dx * ddy - dy * ddx) / module ** 3;
    }

    const output = new SplinePoint(x, y, angle, module, curvature);
    output.Knot = u;
    return output;
  }

  private GetBasicValue(u: number, k: number, d: number): number {
    if (d < 1) {
      return 0.0;
    }
    if (d == 1) {
      if (u >= this._KnotVectors[k] && u < this._KnotVectors[k + 1]) {
        return 1.0;
      }
      if (k >= this._Gaps && u == this._MaxKnotVector) {
        return 1.0;
      }
      return 0.0;
    }
    if (u < this._KnotVectors[k] || u > this._KnotVectors[k + d]) {
      return 0.0;
    }
    const devider1 = this._KnotVectors[k + d - 1] - this._KnotVectors[k];
    const devider2 = this._KnotVectors[k + d] - this._KnotVectors[k + 1];

    if (devider1 == 0 && devider2 == 0) {
      return 0;
    }
    if (devider1 == 0) {
      const bv = this.GetBasicValue(u, k + 1, d - 1);
      return ((this._KnotVectors[k + d] - u) / devider2) * bv;
    }
    if (devider2 == 0) {
      const bv = this.GetBasicValue(u, k, d - 1);
      return ((u - this._KnotVectors[k]) / devider1) * bv;
    }
    const bv1 = this.GetBasicValue(u, k, d - 1);
    const bv2 = this.GetBasicValue(u, k + 1, d - 1);
    return ((u - this._KnotVectors[k]) / devider1) * bv1 + ((this._KnotVectors[k + d] - u) / devider2) * bv2;
  }

  private GetBasicDifferential(u: number, k: number, d: number): number {
    const devider1 = this._KnotVectors[k + d - 1] - this._KnotVectors[k];
    const devider2 = this._KnotVectors[k + d] - this._KnotVectors[k + 1];

    if (devider1 == 0 && devider2 == 0) {
      return 0;
    }
    if (devider1 == 0) {
      return ((1 - d) / devider2) * this.GetBasicValue(u, k + 1, d - 1);
    }
    if (devider2 == 0) {
      return ((d - 1) / devider1) * this.GetBasicValue(u, k, d - 1);
    }
    return (
      ((d - 1) / devider1) * this.GetBasicValue(u, k, d - 1) +
      ((1 - d) / devider2) * this.GetBasicValue(u, k + 1, d - 1)
    );
  }

  private GetDoubleDifferential(u: number, k: number, d: number): number {
    const devider1 = this._KnotVectors[k + d - 1] - this._KnotVectors[k];
    const devider2 = this._KnotVectors[k + d] - this._KnotVectors[k + 1];

    if (devider1 == 0 && devider2 == 0) {
      return 0;
    }
    if (devider1 == 0) {
      return ((1 - d) / devider2) * this.GetBasicDifferential(u, k + 1, d - 1);
    }
    if (devider2 == 0) {
      return ((d - 1) / devider1) * this.GetBasicDifferential(u, k, d - 1);
    }
    return (
      ((d - 1) / devider1) * this.GetBasicDifferential(u, k, d - 1) +
      ((1 - d) / devider2) * this.GetBasicDifferential(u, k + 1, d - 1)
    );
  }
}
