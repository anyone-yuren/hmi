import { createStyles } from 'antd-style';

const useCommonStyles = createStyles(({ css, token }) => ({
  customSlider: css`
    margin: 12px !important;
    .ant-slider-rail {
      height: 12px;
    }
    .ant-slider-track {
      height: 12px;
      background-color: ${token.colorPrimary};
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
        background-color: ${token.colorPrimary};
        box-shadow: 0 0 0 2px ${token.colorText};
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
    width: 110px;
    height: 45px;
    line-height: 45px;
    border-radius: 7px;
    &.ant-switch-checked {
      .ant-switch-handle {
        inset-inline-start: calc(100% - 42px);
      }
    }

    .ant-switch-handle {
      width: 45px;
      height: 45px;
      top: 3px;
      left: 3px;
      border-radius: 16px;
      &::before {
        width: 39px;
        height: 39px;
        border-radius: 7px;
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

export default useCommonStyles;
