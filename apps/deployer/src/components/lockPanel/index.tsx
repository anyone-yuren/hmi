import { LockOutlined } from '@ant-design/icons';
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
    background: ${props.isDark
      ? 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 70%)'
      : 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,1) 70%)'};
    backdrop-filter: blur(2px);
    border-radius: 10px;
  `,
}));

const PanelLock = (props) => {
  const { isDark = true } = props;
  const { styles } = useStyles({ isDark });
  const { t } = useTranslation();
  return (
    <div className={styles.loadingContainer}>
      <LockOutlined />
    </div>
  );
};

export default PanelLock;
