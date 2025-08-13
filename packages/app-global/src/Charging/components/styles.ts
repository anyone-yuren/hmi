import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css, token }) => ({
  btns: css`
    position: absolute;
    top: 16px;
    right: 16px;
    width: 120px;
    height: 120px;
    background: c61dff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    cursor: pointer;
    text-decoration: none;
    color: #fff;
    line-height: 1.2em;
    letter-spacing: 0.1em;
    font-size: 0.8em;
    transition: 0.25s;
    text-align: center;
    box-shadow:
      inset 10px 10px 10px rgba(190, 1, 254, 0.05),
      25px 35px 20px rgba(190, 1, 254, 0.1),
      25px 30px 30px rgba(190, 1, 254, 0.1),
      inset -10px -10px 15px rgba(255, 255, 255, 0.5);
    border-radius: 44% 56% 65% 35% / 57% 58% 42% 43%;
    user-select: none;
    &:hover {
      border-radius: 50%;
    }

    &::before {
      content: '';
      position: absolute;
      top: 15px;
      left: 30px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #fff;
      opacity: 0.45;
    }
  `,
  vehiclePopup: css`
    bottom: 150px;
    right: -120px;
    width: 80px;
    height: 80px;
    border-radius: 49% 51% 52% 48%/ 63% 59% 41% 37%;
    background-color: #01b4ff;
    box-shadow:
      inset 10px 10px 10px rgba(1, 180, 255, 0.05),
      25px 35px 20px rgba(1, 180, 255, 0.1),
      25px 30px 30px rgba(1, 180, 255, 0.1),
      inset -10px -10px 15px rgba(255, 255, 255, 0.5);
    &::before {
      left: 20px;
      width: 15xpx;
      height: 15px;
    }
  `,
}));

export default useStyles;
