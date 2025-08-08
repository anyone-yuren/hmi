import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import { styled } from '@mui/material';
import { memo, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

const PositionViewStyled = styled('div')(() => {
  return {
    fontSize: 12,
    fontWeight: 600,
    overflow: 'hidden',
    zIndex: 100,
  };
});

const PositionView = () => {
  const { agvPosition } = useHybirdStore(
    useShallow((state) => {
      return {
        agvPosition: state.agvPosition,
      };
    }),
  );

  const translateAngel = (angel: number) => {
    return (angel || 0) * (180 / Math.PI);
  };

  const { x, y, angel } = useMemo(() => {
    const { x, y, angel } = agvPosition as any;
    return {
      x: `${x || 0}`.replace(/\.\d*/, ''),
      y: `${y || 0}`.replace(/\.\d*/, ''),
      angel: translateAngel(angel)?.toFixed(1),
    };
  }, [agvPosition]);

  return (
    <>
      <PositionViewStyled
        sx={{
          background: 'none',
          padding: 0,
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <span>X: {x}mm </span>&nbsp;|&nbsp; <span>Y: {y}mm</span>
      </PositionViewStyled>
      <PositionViewStyled sx={{ background: 'none', padding: 0 }}>θ: {angel}°</PositionViewStyled>
    </>
  );
};

export default memo(PositionView);
