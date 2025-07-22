import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css, token }) => ({
  customSlider: css`
    .ant-slider-rail {
      height: 12px;
    }
    .ant-slider-track {
      height: 12px;
    }
    &.ant-slider-horizontal {
      padding-block: 6px;
      margin-inline: 0;
    }
    .ant-slider-handle {
      width: 24px;
      height: 24px;
      &::after {
        width: 24px;
        height: 24px;
      }
      &::before {
        width: 20px;
        height: 20px;
      }
      &:focus,
      &:hover {
        &::after {
          width: 24px;
          height: 24px;
        }
      }
    }
  `,
  customSwitch: css`
    width: 80px;
    height: 36px;
    line-height: 36px;
    &.ant-switch-checked {
      .ant-switch-handle {
        inset-inline-start: calc(100% - 34px);
      }
    }

    .ant-switch-handle {
      width: 32px;
      height: 32px;
      top: 2px;
      left: 2px;
      border-radius: 16px;
      &::before {
        width: 32px;
        height: 32px;
        border-radius: 16px;
      }
    }

    .ant-switch-inner {
      font-size: 16px;
      line-height: 36px;
      padding-inline-end: 9px;
      padding-inline-start: 24px;
      .ant-switch-inner-unchecked {
        margin-top: -36px;
        font-size: 16px;
      }
      .ant-switch-inner-checked {
        font-size: 16px;
      }
    }

    .ant-switch {
      min-width: 80px;
      height: 36px;
      line-height: 36px;
      padding: 2px;
    }

    .ant-switch-checked {
      background-color: ${token.colorPrimary};
    }
  `,
}));

export default useStyles;
