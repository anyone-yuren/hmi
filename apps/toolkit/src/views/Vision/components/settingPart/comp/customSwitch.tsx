import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomSwitch = styled(Switch)(({ theme, ...props }) => {
  const { size } = props;
  return {
    width: size === 'small' ? 80 : 110,
    height: size === 'small' ? 35 : 45,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 3,
      '&.Mui-checked': {
        transform: `translateX(${size === 'small' ? 45 : 65}px) !important`,
        '& + .MuiSwitch-track': {
          backgroundColor: '#d8d8d8',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      width: size === 'small' ? 29 : 39,
      height: size === 'small' ? 29 : 39,
      borderRadius: 5,
      opacity: 1,
    },
    '& .MuiSwitch-track': {
      opacity: 0.5,
      backgroundColor: '#d8d8d8',
      ...(theme.palette.mode === 'dark' && {
        backgroundColor: '#8796A4',
      }),
    },
  };
});

export default CustomSwitch;
