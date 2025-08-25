import { useLocalStorageState } from 'ahooks';
import React from 'react';
import { BOUNDARY_DASH, BOUNDARY_STROKE, BOUNDARY_STROKE_WIDTH } from '../constants/index';
import { IBoundary } from '../index.d';

const useBoundary = (props: IBoundary) => {
  const { boundaryVisible = false, boundaryPoints = [], boundaryProps = {} } = props;
  const [boundary_visible, set_boundary_visible] = React.useState<any>(boundaryVisible);
  const [boundary_points, set_boundary_points] = React.useState<any>(boundaryPoints);
  const [boundary_props, set_boundary_props] = useLocalStorageState('boundary_props', {
    defaultValue: {
      strokeWidth: BOUNDARY_STROKE_WIDTH,
      stroke: BOUNDARY_STROKE,
      dash: BOUNDARY_DASH,
      ...boundaryProps,
    },
    listenStorageChange: true,
  });
  const boundarySize = React.useMemo(() => {
    const [minX, maxY, maxX, , , minY] = boundary_points;
    return {
      width: maxX - minX,
      height: maxY - minY,
    };
  }, [boundary_points]);

  return {
    props: boundary_props,
    points: boundary_points,
    visible: boundary_visible,
    setPoints: set_boundary_points,
    width: boundarySize.width,
    height: boundarySize.height,
  };
};
export default useBoundary;
