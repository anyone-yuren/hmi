import Konva from 'konva';

export interface IBoundary {
  boundaryPoints?: []; // 不传的话会遍历所有的点得出边界值
  boundaryVisible?: boolean;
  boundaryProps?: Omit<Konva.Line, 'points'>;
}

export interface IPoint {
  id: string;
  type: number;
  types?: number[];
  state?: number;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}
export interface IVehicle {
  id: string;
  x: number;
  y: number;
  angle: number;
  image?: string;
}

export interface ITarget {
  x: number | null;
  y: number | null;
  scale?: number | null;
}
export interface IOriginPoints {
  points: IPoint[];

  commonVisible?: boolean;
  commonProps?: Omit<Konva.Circle, 'points'>;
  commonTextVisible?: boolean;
  commonTextProps?: Omit<Konva.Text, 'text'>;

  storageVisible?: boolean;
  storageProps?: Omit<Konva.Rect, 'points'>;
  storageTextVisible?: boolean;
  storageTextProps?: Omit<Konva.Text, 'text'>;

  stationVisible?: boolean;
  stationProps?: Omit<Konva.Image, 'points'>;
  stationTextVisible?: boolean;
  stationTextProps?: Omit<Konva.Text, 'text'>;

  boundary?: any;
  scale?: number;
  visibleConfig?: Record<string, boolean>;
}

export default interface IInitStage {
  size?: {
    width: number;
    height: number;
  };

  stageStyle?: React.CSSProperties;

  boundary?: IBoundary;
  defaultMapCenter?: {
    x: number;
    y: number;
  }; // 不传的话会定位到边界值的中心

  points: IOriginPoints;
  pointsValue?: IPoint['id'][];
  onPointsSelect?: (points: IPoint['id'][]) => void;

  activePointsPopup?: (id: IPoint['id']) => React.Node;
  activePointsPopupDivProps?: React.HTMLAttributes<HTMLDivElement>;

  vehicles?: IVehicle[];

  lines?: any;
  lineVisible?: boolean;

  setAttrs?: <T>(attrs: T, scale) => attrs;

  moveToTarget?: ITarget;
  locationStateHashMap?: Record<string, any>;

  infiniteView?: boolean;
  allPointsVisible?: boolean;

  floorMapData?: any;
  cloudPoints?: any;

  activePointStroke?: string; // 选中点的描边颜色
}
