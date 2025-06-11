import { theme } from 'antd';
import { memo } from 'react';
import type { Props as ApexChartProps } from 'react-apexcharts';
import ApexChart from 'react-apexcharts';

function Chart(props: ApexChartProps) {
  const { token } = theme.useToken();
  return (
    <div>
      <ApexChart {...props} />
      <style>
        {`
          .apexcharts-tooltip {
            background-color: ${token.colorBgElevated} !important;
            color: ${token.colorText} !important;
            border: 1px solid ${token.colorBorder} !important;
            box-shadow: 0 0 6px rgba(0,0,0,0.15);
          }

          .apexcharts-tooltip-title {
            background-color: ${token.colorBgContainer} !important;
            color: ${token.colorTextSecondary} !important;
          }

          .apexcharts-xaxistooltip {
            color: ${token.colorTextSecondary}!important;
            border-radius: ${token.borderRadius}px!important;
            border-color: transparent;
            box-shadow: ${token.boxShadow}!important;
            background-color: ${token.colorBgContainer}!important;
          })

          .apexcharts-xaxistooltip::before {
            border-bottom-color: rgbAlpha(${token.colorBgContainer}, 0.8) !important;
          })

          .apexcharts-xaxistooltip::after {
            border-bottom-color: ${token.colorBgContainer} !important;
          })

          .apexcharts-legend {
            padding: 0,
          })

          .apexcharts-legend-series {
            display: "inline-flex !important";
            alignItems: "center";
          })

          .apexcharts-legend-text {
            lineHeight: "18px";
            text-transform: "capitalize";
          });
        `}
      </style>
    </div>
  );
}

export default memo(Chart);
