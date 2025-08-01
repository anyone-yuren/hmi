export class SplinePoint {
  public X: number;
  public Y: number;
  public Angle: number;
  public Module: number;
  public Curvature: number;
  public Knot: number;
  public Length: number;
  constructor(x: number, y: number, angle: number, module: number, curvature: number) {
    this.X = x;
    this.Y = y;
    this.Angle = angle;
    this.Module = module;
    this.Curvature = curvature;
    this.Knot = 0;
    this.Length = 0;
  }
  public static CreateSplinePoint(x: number, y: number): SplinePoint {
    return new SplinePoint(x, y, 0, 0, 0);
  }
}
