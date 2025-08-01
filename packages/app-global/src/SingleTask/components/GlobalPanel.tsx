import { Box, BoxProps, styled } from '@mui/material';
import { animated } from '@react-spring/web';
import { memo } from 'react';

interface IProps extends BoxProps {
  delay?: number;
  direction?: string;
}
const StylePanel = styled(animated(Box))(({ theme }) => ({
  backgroundColor: '#445260',
  borderRadius: '20px',
  padding: '20px',
  height: '100%',
}));

const GlobalPanel = ({ delay = 3000, direction = 'left', children, ...rest }: IProps) => {
  return <StylePanel {...rest}>{children}</StylePanel>;
};
export default memo(GlobalPanel);
