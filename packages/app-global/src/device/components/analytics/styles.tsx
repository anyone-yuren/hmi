import { createStyles } from 'antd-style';
import shapeSquare from '../../../assets/shape-square.svg';
const useStyles = createStyles(({ token, css }) => {
  return {
    card: css`
    flex:1;
    background-image: linear-gradient(
      180deg,
      rgba(204, 244, 254, 0.5) 0%,
      rgba(104, 205, 249, 0.5) 100%);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
    &:nth-child(2) {
      background-image: linear-gradient(
        180deg,
        rgba(239, 214, 255, 0.5) 0%,
        rgba(198, 132, 255, 0.5) 100%);
      .mask {
        background-color: #8e33ff;
      }
    }
    &:nth-child(3) {
      background-image: linear-gradient(
        180deg,
        rgba(255, 238, 204, 0.5) 0%,
        rgba(255, 198, 104, 0.5) 100%);
     .mask {
        background-color: #ff9800;
     }
    }
    &:nth-child(4) {
      background-image: linear-gradient(
        180deg,
        rgba(204, 254, 226, 0.5) 0%,
        rgba(104, 249, 174, 0.5) 100%);
    .mask {
        background-color: #00b83f;
      }
    }
    &:nth-child(5) {
      background-image: linear-gradient(
        180deg,
        rgba(255, 233, 213, 0.5) 0%,
        rgba(255, 172, 130, 0.5) 100%);
      .mask {
        background-color: #ff5630;
      }
    }
    .ant-card-body {
      padding: 0;
      display: flex;
      min-height: 100px;
      position: relative;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 20px;
    }
    .mask {
      mask: url(${shapeSquare}) center center / contain no-repeat;
      top: -40px;
      left: -20px;
      width: 240px;
      height: 240px;
      opacity: 0.24;
      position: absolute;
      color: #078dee;
      background-color: #078dee;
      z-index: 0;
    }
  }
})
`,
    table: css`
      .g-table-header {
        margin: 12px;
      }
    `,
  };
});

export default useStyles;
