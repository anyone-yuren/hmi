import truckload_header from '@/assets/vision/truckload/truckload_header.png';
import MwConfirm from '@/views/Vision/components/MwConfirm';
import {
  getTailTruckScenariosGoodsStatusManagementRead as read,
  postTailTruckScenariosGoodsStatusManagementSave as save,
} from '@/views/Vision/services/index';
import Button from '@mui/material/Button';
import { useRequest } from 'ahooks';
import { Dropdown } from 'antd';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
const mock = [
  [-9.54796, -0.816572, 0.0314617, 0],
  [-9.58397, 0.329479, 0.0314617, 1],
  [-8.51849, -0.784172, 0.0314617, 2],
  [-8.55449, 0.361878, 0.0314617, 1],
  [-7.48902, -0.751772, 0.0314617, 0],
  [-7.52502, 0.394278, 0.0314617, 2],
  [-6.45954, -0.719373, 0.0314617, 0],
  [-6.49555, 0.426678, 0.0314617, 1],
  [-5.43007, -0.686973, 0.0314617, 0],
  [-5.46608, 0.459077, 0.0314617, 0],
];
// const goodsResponse = {
//   code: 200,
//   data: {
//     goods_size: {
//       value: null,
//     },
//     storage_location: {
//       value: null,
//     },
//     truck_size: {
//       value: null,
//     },
//   },
//   msg: "OK",
// };
const Cargo = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'load' | 'unload'>('load');
  const { data: goodsResponse, runAsync: getLocation } = useRequest(read, {});
  useEffect(() => {
    console.log('goodsResponse', goodsResponse);
  }, [goodsResponse]);

  const mockXs = mock.map(([, y]) => y); // 把原来的 y 当作水平方向
  const mockYs = mock.map(([x]) => x); // 把原来的 x 当作垂直方向

  const width = 400 / mockXs.length;

  function findClosestToOrigin(points) {
    return points.reduce((closest, current) => {
      const dist1 = closest[0] ** 2 + closest[1] ** 2;
      const dist2 = current[0] ** 2 + current[1] ** 2;
      return dist2 < dist1 ? current : closest;
    });
  }

  const renderWidth = 150;
  console.log('width', width);
  const locationAry: any = useMemo(() => {
    return goodsResponse?.data?.storage_location?.value;
  }, [goodsResponse]);
  const sizeResponse = useMemo(() => {
    return goodsResponse?.data || {};
  }, [goodsResponse]);

  const size = useMemo(() => {
    const scale = renderWidth / sizeResponse?.truck_size?.value?.[1];
    return {
      scale,
      truckLength: sizeResponse?.truck_size?.value?.[0] * scale,
      goodsWidth: sizeResponse?.goods_size?.value?.[1] * scale,
      goodsHeight: sizeResponse?.goods_size?.value?.[0] * scale,
    };
  }, [sizeResponse]);
  const hashMap: any = {
    status: {
      0: 1,
      1: 0,
    },
    color: {
      0: '#00d1d1', // 无货
      1: 'yellow',
      2: 'red',
    },
    text: {
      0: t('无货'),
      1: t('有货'),
      2: t('规划中'),
    },
  };
  const scaledPoints = useMemo(() => {
    if (!locationAry) return [];
    // ×1000，并交换 x/y 顺序 → [y, x]
    return locationAry.slice(1).map((p) => [
      p[1] * 1000, // y → 新的 x（水平方向）
      p[0] * 1000, // x → 新的 y（垂直方向）
      p[2], // z（保持不变）
      p[3], // status（保持不变）
    ]);
  }, [locationAry]);
  const topLeftPoint = useMemo(() => {
    if (!scaledPoints.length) return null;
    const [x, y] = findClosestToOrigin(scaledPoints);
    // 找出离 (0, 0) 最近的点
    return { x, y };
  }, [scaledPoints]);
  const offsetPoints = useMemo(() => {
    if (!scaledPoints.length || !topLeftPoint) return [];

    return scaledPoints.map((point) => ({
      x: point[0] - topLeftPoint.x, // 新的 x（原 y）
      y: topLeftPoint.y - point[1], // 新的 y（原 x），反转 Y 轴
      status: point[3],
      originX: point[0],
      originY: point[1],
    }));
  }, [scaledPoints, topLeftPoint]);

  const containerWidth = renderWidth;
  const containerHeight = useMemo(() => {
    return size.truckLength;
  }, [size]);

  const mappedPoints = useMemo(() => {
    if (!offsetPoints.length) return [];
    return offsetPoints.map((p) => {
      const pixelX = p.x * size.scale;
      const pixelY = p.y * size.scale;
      return {
        x: pixelX,
        y: pixelY,
        status: p.status,
        color: hashMap.color[p.status],
        originX: p.originX,
        originY: p.originY,
      };
    });
  }, [offsetPoints, containerWidth, containerHeight, hashMap]);

  const validateItem = (index: number, state: number) => {
    const ary = structuredClone(locationAry).slice(1);
    let isPass = true;
    const hashMap = {
      load: {
        splitAry: () => {
          return state === 1 ? ary.slice(index + 1, ary.length) : ary.slice(0, index);
        },
      },
      unload: {
        splitAry: () => {
          return ary.slice(0, index);
        },
      },
    };
    const validateAry = hashMap[mode].splitAry();
    validateAry.forEach((item: any) => {
      if (item[3] !== state) {
        isPass = false;
      }
    });
    if (!isPass) {
      toast.error(t('请选择操作上一个库位'));
    }
    return isPass;
  };

  const getItems = (index: number) => {
    return [
      {
        label: t('设为有货'),
        key: 'hasGoods',
        onClick: async () => {
          let params = structuredClone(locationAry);
          const isPass = validateItem(index, 1);
          if (!isPass) return;
          params[index + 1][3] = 1;
          await save({ storage_location: { value: params } });
          toast.success(t('操作成功'));
          await getLocation();
        },
      },
      {
        label: t('设为无货'),
        key: 'withoutGoods',
        onClick: async () => {
          let params = structuredClone(locationAry);
          const isPass = validateItem(index, 0);
          if (!isPass) return;
          params[index + 1][3] = 0;
          await save({ storage_location: { value: params } });
          toast.success(t('操作成功'));
          await getLocation();
        },
      },
    ];
  };

  const handleChangeAllState = async (state: any) => {
    const titleHashMap: any = {
      1: t('全部设为有货'),
      0: t('全部设为无货'),
    };
    MwConfirm.confirm({
      title: t('操作') as string,
      content: titleHashMap[state],
      onOk: async () => {
        const [axis, ...ary] = locationAry;
        ary.forEach((item: any) => {
          item[3] = state;
        });
        try {
          await save({ storage_location: { value: [axis, ...ary] } });
          await getLocation();
          toast.success(t('操作成功'));
        } catch (e) {
          toast.error(t('操作失败'));
        }
      },
    });
  };

  const modeHashMap = {
    title: {
      load: t('装车模式'),
      unload: t('卸车模式'),
    },
    tips: {
      load: t('只能从最外面修改状态'),
      unload: t('只能从最里面修改状态'),
    },
  };

  return (
    <>
      <div className='flex w-full h-full'>
        <div className='flex-1 flex flex-col items-center justify-center'>
          <div
            className='relative'
            style={{
              width: renderWidth,
              height: size.truckLength,
              border: '1px solid black',
            }}
          >
            {mappedPoints?.map((point, index) => {
              return (
                <Dropdown key={index} arrow menu={{ items: getItems(index) }} trigger={['click', 'contextMenu']}>
                  <div
                    style={{
                      position: 'absolute',
                      left: `${point.x}px`,
                      top: `${point.y}px`,
                      width: size?.goodsWidth,
                      height: size?.goodsWidth,
                      backgroundColor: hashMap.color[point.status],
                      cursor: 'pointer',
                      border: '1px solid #00d1d1',
                    }}
                  >
                    {index}
                  </div>
                </Dropdown>
              );
            })}
          </div>
          <div className='h-[100px]' style={{ width: renderWidth }}>
            <img src={truckload_header} />
          </div>
        </div>
        <div className='flex-1 flex items-center justify-start'>
          <div>
            <div className='flex items-center gap-2'>
              <span className='w-[20px] h-[20px] bg-[red] block'></span>
              <span>{t('规划中')}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-[20px] h-[20px] bg-[yellow] block'></span>
              <span>{t('有货')}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-[20px] h-[20px] bg-[#00d1d1] block'></span>
              <span>{t('无货')}</span>
            </div>
            <div className='mt-[10px] flex gap-[20px]'>
              <Button
                variant='contained'
                size={'small'}
                style={{ color: 'white' }}
                onClick={() => {
                  handleChangeAllState(1);
                }}
              >
                {t('全部设为有货')}
              </Button>
              <Button
                variant='outlined'
                size={'small'}
                onClick={() => {
                  handleChangeAllState(0);
                }}
              >
                {t('全部设为无货')}
              </Button>
            </div>
            <div className='mt-[20px]'>
              <div>
                {modeHashMap.title[mode]}（{t('数字越大越靠近外面')}）
              </div>
              <div>{modeHashMap.tips[mode]}</div>
              <div className='flex gap-[20px] mt-[5px]'>
                <Button
                  variant='contained'
                  size={'small'}
                  style={{ color: 'white' }}
                  onClick={() => {
                    setMode('load');
                  }}
                >
                  {t('设为装车')}
                </Button>
                <Button
                  variant='outlined'
                  size={'small'}
                  onClick={() => {
                    setMode('unload');
                  }}
                >
                  {t('设为卸车')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Cargo);

// -9.54 -8.51
