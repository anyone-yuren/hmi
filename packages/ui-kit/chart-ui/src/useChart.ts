import { theme } from 'antd';
import type { ApexOptions } from 'apexcharts';
import de from 'apexcharts/dist/locales/de.json';
import en from 'apexcharts/dist/locales/en.json';
import fr from 'apexcharts/dist/locales/fr.json';
import ja from 'apexcharts/dist/locales/ja.json';
import ko from 'apexcharts/dist/locales/ko.json';
import zh_cn from 'apexcharts/dist/locales/zh-cn.json';
import { mergeDeepRight } from 'ramda';
import { useTranslation } from 'react-i18next';

const { useToken } = theme;

export default function useChart(options: ApexOptions) {
  const { token } = useToken();
  const { t, i18n } = useTranslation();
  const LABEL_TOTAL = {
    show: true,
    label: 'Total',
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
    // lineHeight: themeVars.typography.lineHeight.tight,
  };

  const LABEL_VALUE = {
    offsetY: 8,
    color: token.colorPrimary,
    fontSize: token.fontSizeSM,
    // lineHeight: themeVars.typography.lineHeight.tight,
  };

  const language = () => {
    if (i18n.language === 'zh_CN') {
      return 'zh-cn';
    }
    if (i18n.language === 'ja_jP') {
      return 'ja';
    }
    if (i18n.language === 'ko_KR') {
      return 'ko';
    }
    if (i18n.language === 'en_US') {
      return 'en';
    }

    if (i18n.language === 'fr_FR') {
      return 'fr';
    }
  };
  const baseOptions: ApexOptions = {
    // Colors
    colors: [token.colorPrimary, token.colorWarning, token.colorInfo, token.colorError, token.colorSuccess],

    // Chart
    chart: {
      toolbar: { show: false },
      zoom: { enabled: true },
      foreColor: token.colorTextDisabled,
      fontFamily: token.fontFamily,
      locales: [zh_cn, en, ja, ko, de, fr],
      defaultLocale: language(),
    },

    // States
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.04,
        },
      },
      active: {
        filter: {
          type: 'darken',
          value: 0.88,
        },
      },
    },

    // Fill
    // fill: {
    //   type: 'gradient',
    //   gradient: {
    //     shade: 'light', // 渐变风格
    //     type: 'vertical', // vertical / horizontal
    //     shadeIntensity: 0.1, // 阴影强度
    //     gradientToColors: undefined, // 如果要单独设 end color，也可以写数组
    //     inverseColors: false,
    //     opacityFrom: 0.8, // 上方透明度
    //     opacityTo: 0.05, // 底部透明度
    //     stops: [0, 90, 100], // 渐变停靠点
    //   },
    // },

    // Datalabels
    dataLabels: {
      enabled: false,
    },

    // Stroke
    stroke: {
      width: 3,
      curve: 'smooth',
      lineCap: 'round',
    },

    // Grid
    // grid: {
    //   strokeDashArray: 3,
    //   borderColor: token.colorBgContainer,
    //   xaxis: {
    //     lines: {
    //       show: false,
    //     },
    //   },
    // },
    grid: {
      show: false,
      borderColor: '#90A4AE',
      strokeDashArray: 3,
      position: 'back',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      row: {
        colors: undefined,
        opacity: 0.5,
      },
      column: {
        colors: undefined,
        opacity: 0.5,
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },

    // Xaxis
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    // Markers
    markers: {
      size: 0,
    },

    // Tooltip
    tooltip: {
      theme: undefined,
      x: {
        show: true,
      },
    },

    // Legend
    legend: {
      show: true,
      fontSize: token.fontSizeSM + '',
      position: 'top',
      horizontalAlign: 'right',
      markers: {
        strokeWidth: 0,
      },
      fontWeight: 500,
      itemMargin: {
        horizontal: 8,
      },
      labels: {
        colors: token.colorPrimary,
      },
    },

    // plotOptions
    plotOptions: {
      // Bar
      bar: {
        borderRadius: 4,
        columnWidth: '28%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        dataLabels: {
          position: 'top',
        },
      },
      // Pie + Donut
      pie: {
        donut: {
          labels: {
            show: true,
            value: LABEL_VALUE,
            total: LABEL_TOTAL,
          },
        },
      },

      // Radialbar
      radialBar: {
        track: {
          strokeWidth: '100%',
        },
        dataLabels: {
          value: LABEL_VALUE,
          total: LABEL_TOTAL,
        },
      },

      // Radar
      radar: {
        polygons: {
          fill: { colors: ['transparent'] },
          // strokeColors: themeVars.colors.background.neutral,
          // connectorColors: themeVars.colors.background.neutral,
        },
      },

      // polarArea
      polarArea: {
        rings: {
          // strokeColor: themeVars.colors.background.neutral,
        },
        spokes: {
          // connectorColors: themeVars.colors.background.neutral,
        },
      },
    },

    // Responsive
    responsive: [
      {
        // sm
        // breakpoint: removePx(breakpointsTokens.sm),
        options: {
          plotOptions: { bar: { columnWidth: '40%' } },
        },
      },
      {
        // md
        // breakpoint: removePx(breakpointsTokens.md),
        options: {
          plotOptions: { bar: { columnWidth: '32%' } },
        },
      },
    ],
  };

  return mergeDeepRight(baseOptions, options) as ApexOptions;
}
