import { StyledComponent } from '@emotion/styled';
import { Button, ButtonProps, CircularProgress, styled } from '@mui/material';
import StartIcon from './SvgIcon/StartIcon';

const MainTempButton: StyledComponent<ButtonProps & { loading?: boolean }> = styled(
  (props: ButtonProps & { loading?: boolean }) => (
    <Button
      variant='contained'
      disableElevation
      fullWidth
      disabled={props.loading}
      startIcon={<StartIcon fontSize={25} />}
      {...props}
    ></Button>
  ),
)(() => ({
  marginTop: '5px',
  height: '52px',
  color: 'white',
  fontSize: '18px',
}));

const MainButton = (props: ButtonProps & { loading?: boolean }) => {
  return (
    <div className='relative'>
      <MainTempButton {...props} />
      {props.loading && (
        <CircularProgress
          size={24}
          sx={{
            color: 'primary.main',
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </div>
  );
};

export default MainButton;
