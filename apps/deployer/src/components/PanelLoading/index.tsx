import { createStyles } from 'antd-style';
import { useTranslation } from 'react-i18next';

const useStyles = createStyles(({ css, token }, props: { isDark: boolean }) => ({
  loadingContainer: css`
    width: 100%;
    height: 100%;
    display: flex;
    left: 0;
    top: 0;
    flex-direction: column;
    gap: 10px;
    position: absolute;
    z-index: 40;
    align-items: center;
    justify-content: center;
    background: ${
      props.isDark
        ? 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,1) 70%)'
        : 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,1) 70%)'
    };
    backdrop-filter: blur(6px);
    border-radius: 10px;

    .loader {
      width: 30px;
      aspect-ratio: 1;
      display: grid;
      transform: translateY(100%);
    }

    .loader::before,
    .loader::after {
      content: '';
      grid-area: 1/1;
      border-radius: 50%;
      transform-origin: bottom;
      position: relative;
    }

    .loader::before {
      background: radial-gradient(at 30% 30%, #0000, #000a) ${token.colorPrimary};
      transform: scaleY(0.65);
      top: 0;
      animation:
        l11-1 1s cubic-bezier(0, 400, 1, 400) infinite,
        l11-2 1s ease infinite;
    }

    .loader::after {
      background: #ccc;
      filter: blur(8px);
      transform: scaleY(0.3) translate(0px, 0px);
      left: 0;
      animation: l11-3 1s cubic-bezier(0, 400, 1, 400) infinite;
    }

    @keyframes l11-1 {
      100% {
        top: -0.2px;
      }
    }

    @keyframes l11-2 {
      4%,
      96% {
        transform: scaleY(1);
      }
    }

    @keyframes l11-3 {
      100% {
        transform: scaleY(0.3) translate(0.1px, -0.1px);
      }
    }
  `,
}));

const PanelLoading = (props) => {
  const { isDark } = props;
  const { styles } = useStyles({ isDark });
  const { t } = useTranslation();
  return (
    <div className={styles.loadingContainer}>
      <div className='loader'></div>
    </div>
  );
};

export default PanelLoading;
