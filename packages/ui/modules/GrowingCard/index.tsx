import { createStyles } from 'antd-style';
import React, { useRef } from 'react';

const useStyles = createStyles(({ token, css }) => {
  return {
    card: css`
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      border-radius: 8px;
      border: 1px solid ${token.colorBorderSecondary};
      padding: 16px;
      color: ${token.colorText};
    `,
    glowingContainer: css`
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
    `,
    glowingEffect: css`
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: inherit;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        border: 2px solid transparent;
        filter: blur(1px);
        background: conic-gradient(
          from 180deg at 50% 50%,
          #6e9cf7 0deg,
          #8090ff 51deg,
          #0df2aa 90deg,
          #0df24e 140deg,
          #13ec50 246deg,
          #0df2aa 280deg,
          #55a8f6 304deg,
          #6e9cf7 1turn,
          #8090ff 411deg
        );

        -webkit-mask-clip: padding-box, border-box;
        mask-clip: padding-box, border-box;
        -webkit-mask-composite: source-in, xor;
        mask-composite: intersect;

        -webkit-mask-image:
          linear-gradient(#0000, #0000),
          conic-gradient(
            from calc((var(--start) - var(--spread)) * 1deg),
            #0000,
            #fff,
            #0000 calc(var(--spread) * 2deg)
          );
        mask-image:
          linear-gradient(#0000, #0000),
          conic-gradient(
            from calc((var(--start) - var(--spread)) * 1deg),
            #0000,
            #fff,
            #0000 calc(var(--spread) * 2deg)
          );

        opacity: var(--active, 0);
        transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `,
  };
});

const GlowingCard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { styles } = useStyles();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;

    const angle = Math.atan2(y, x) * (180 / Math.PI);
    const deg = (angle + 360) % 360;

    const spread = 80; // 发光线段角度
    // 将 --start 设置为鼠标角度减去一半的 spread
    card.style.setProperty('--start', (deg + spread).toString());
    card.style.setProperty('--active', '1');
    card.style.setProperty('--spread', spread.toString());
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--active', '0');
  };

  return (
    <div ref={cardRef} className={styles.card} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className={styles.glowingContainer}>
        <div className={styles.glowingEffect}></div>
      </div>
      {children}
    </div>
  );
};

export default GlowingCard;
