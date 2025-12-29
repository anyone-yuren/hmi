import { createStyles, keyframes } from 'antd-style';
const radarRotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const useStyles = createStyles(() => ({
  loader: {
    position: 'relative',
    width: 150,
    height: 150,
    borderRadius: '50%',
    background: 'transparent',
    border: '1px solid #333',
    boxShadow: '25px 25px 75px rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 20,
      borderRadius: '50%',
      border: '1px dashed #444',
      boxShadow: 'inset -5px -5px 25px rgba(0,0,0,0.25), inset 5px 5px 35px rgba(0,0,0,0.25)',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      width: 50,
      height: 50,
      borderRadius: '50%',
      border: '1px dashed #444',
      boxShadow: 'inset -5px -5px 25px rgba(0,0,0,0.25), inset 5px 5px 35px rgba(0,0,0,0.25)',
    },
  },

  sweep: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '50%',
    height: '100%',
    transformOrigin: 'top left',
    animation: `${radarRotate} 2s linear infinite`,
    borderTop: '1px dashed #fff',

    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: 'seagreen',
      transformOrigin: 'top left',
      transform: 'rotate(-55deg)',
      filter: 'blur(30px) drop-shadow(20px 20px 20px seagreen)',
    },
  },

  '@keyframes radar-rotate': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
}));

export function RadarLoading() {
  const { styles } = useStyles();

  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div className={styles.loader}>
        <span className={styles.sweep} />
      </div>
    </div>
  );
}
