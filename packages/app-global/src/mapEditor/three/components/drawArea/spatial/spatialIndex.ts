import RBush from 'rbush';

export type SpatialPoint = {
  id: string;
  x: number;
  y: number;
};

type RBushItem = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  point: SpatialPoint;
};

class SpatialIndex {
  private tree = new RBush<RBushItem>();

  build(points: SpatialPoint[]) {
    const items = points.map((p) => ({
      minX: p.x,
      minY: p.y,
      maxX: p.x,
      maxY: p.y,
      point: p,
    }));

    this.tree.clear();
    this.tree.load(items);
  }

  searchBBox(bbox: { minX: number; minY: number; maxX: number; maxY: number }) {
    return this.tree.search(bbox).map((item) => item.point);
  }
}

export const spatialIndex = new SpatialIndex();
