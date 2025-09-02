import { useState } from 'react';
import { Group, Rect } from 'react-konva';
import { meterToPixel } from '../../utils';
interface IProps {
  width: number;
  topleft: {
    x: number;
    y: number;
  };
  topRight: {
    x: number;
    y: number;
  };
}

const CarHeader = (prop: IProps) => {
  const { width, topleft, topRight } = prop;
  const { x: topLeftX, y: topLeftY } = topleft;
  const { x: topRightX, y: topRightY } = topRight;
  const [strokeColor, setStrokeColor] = useState('yellow');
  return (
    <Group x={0} y={0} name='car-header'>
      <Rect
        width={meterToPixel(width)}
        height={50}
        fill='#00d1d1'
        strokeWidth={1}
        stroke={strokeColor}
        onMouseEnter={() => setStrokeColor('red')}
        onMouseLeave={() => setStrokeColor('yellow')}
      />
    </Group>
  );
};
export default CarHeader;
