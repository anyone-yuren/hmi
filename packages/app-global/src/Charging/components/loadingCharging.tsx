import { createStyles } from 'antd-style';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = createStyles(({ css, token }) => ({
  loadingContainer: css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: absolute;
    z-index: 40;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 1) 70%);
    backdrop-filter: blur(6px);
    .loader {
      height: 60px;
      aspect-ratio: 2;
      border-bottom: 3px solid transparent;
      background: linear-gradient(90deg, ${token.colorText} 50%, transparent 0) -25% 100%/50% 3px repeat-x border-box;
      position: relative;
      animation: l3-0 0.75s linear infinite;
    }

    .loader::before {
      content: '';
      position: absolute;
      inset: auto 42.5% 0;
      aspect-ratio: 1;
      border-radius: 50%;
      background: ${token.colorPrimary};
      box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
      animation:
        l3-1 0.75s cubic-bezier(0, 900, 1, 900) infinite,
        l3-shadow 0.75s ease-in-out infinite,
        l3-opacity 0.75s ease-in-out infinite;
    }

    @keyframes l3-0 {
      to {
        background-position: -125% 100%;
      }
    }

    @keyframes l3-1 {
      0%,
      2% {
        bottom: 0%;
      }
      98%,
      to {
        bottom: 0.1%;
      }
    }

    @keyframes l3-shadow {
      0%,
      50%,
      100% {
        box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.5);
      }
      25%,
      75% {
        box-shadow: 0 0 15px 5px rgba(255, 255, 255, 1);
      }
    }

    @keyframes l3-opacity {
      0%,
      50%,
      100% {
        opacity: 0.3;
      }
      25%,
      75% {
        opacity: 1;
      }
    }
  `,
}));

const LoadingCharging = (props) => {
  const { state } = props;
  const { styles } = useStyles();
  const { t, i18n } = useTranslation();
  console.log('state', state);
  const textHashmap = useMemo(() => {
    return {
      1: t('common.charging.runCharging'),
      2: t('common.charging.readyCharging'),
      3: '正在充电',
    };
  }, [i18n.language]);
  return (
    <div className={styles.loadingContainer}>
      <div className='loader'></div>
      <p>{textHashmap?.[state || 1]}...</p>
    </div>
  );
};

export default LoadingCharging;
