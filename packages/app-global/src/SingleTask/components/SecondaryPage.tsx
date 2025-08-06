import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, BoxProps, IconButton, Paper, SxProps, styled } from '@mui/material';
import { animated, useSpring } from '@react-spring/web';
import { t } from 'i18next';
import { memo, useEffect, useState } from 'react';
export const SecondaryPaper = styled(Paper)(({ theme }) => ({
  background: '#fff',
  height: 'calc(100% - 80px)',
  borderRadius: '20px',
  padding: '40px',
  overflow: 'auto',
}));
const SlideBox = styled(animated(Box))(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: theme.zIndex.drawer + 10,
  padding: theme.spacing(2.5),
}));
type Props = {
  children?: JSX.Element | JSX.Element[];
  open: boolean;
  fullScreen?: boolean;
  background?: string;
  titleColor?: string;
  setOpen: (open: any) => void;
  startAnimate?: (start: boolean) => void;
} & BoxProps;

const SecondaryPage = (props: Props) => {
  const {
    children,
    open,
    fullScreen = true,
    setOpen,
    startAnimate,
    background = 'transparent',
    titleColor = '#fff',
    ...rest
  } = props;
  const [start, setStart] = useState(false);
  useEffect(() => {
    if (open) {
      setStart(true);
    } else {
      setStart(false);
    }
  }, [open]);
  const transformStart = fullScreen ? 'translateX(0%)' : 'translate(-50%, -50%)';
  const transformEnd = fullScreen ? 'translateX(100%)' : 'translate(100%, -50%)';
  const animate = useSpring({
    opacity: start ? 1 : 0,
    transform: start ? transformStart : transformEnd,
    config: { tension: 260, friction: 40 },
    onRest: () => {
      console.log('onRest', open, start);
      if (!start) {
        setOpen(false);
      }
    },
  });

  const headerSx: SxProps = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '30px',
    borderRadius: '20px',
    background,
    color: titleColor,
  };

  const slideBoxStyle = fullScreen ? {} : { left: '50%', top: '50%', width: '60%', height: '60%' };
  if (!open) return null;
  return (
    <>
      <SlideBox
        {...rest}
        style={{
          opacity: start ? 1 : 0,
          transform: start ? transformStart : transformEnd,
          ...slideBoxStyle,
        }}
      >
        <Box
          sx={headerSx}
          onClick={() => {
            setStart(false);
            setOpen(false);
            startAnimate && startAnimate(false);
          }}
        >
          <IconButton
            sx={{
              background: '#fff !important',
              color: '#000 !important',
              marginRight: '8px',
            }}
            aria-label='back'
            size='medium'
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          {t('common.back')}
        </Box>
        <div className={`w-full h-[20px]`} style={{ background }}></div>
        {children}
      </SlideBox>
    </>
  );
};
export default memo(SecondaryPage);
