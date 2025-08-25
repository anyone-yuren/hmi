import truckload_header from '@/assets/vision/truckload/truckload_header.png';
import MwConfirm from '@/views/Vision/components/MwConfirm';
import {
  getTailTruckScenariosGoodsStatusManagementRead as read,
  postTailTruckScenariosGoodsStatusManagementSave as save,
} from '@/views/Vision/services/index';
import Button from '@mui/material/Button';
import { useRequest } from 'ahooks';
import { Dropdown } from 'antd';
import { memo, useMemo, useState } from 'react';
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

const Cargo = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'load' | 'unload'>('load');
  const { data: goodsResponse, runAsync: getLocation } = useRequest(read, {});

  function findClosestToOrigin(points) {
    return points.reduce((closest, current) => {
      const dist1 = closest[0] ** 2 + closest[1] ** 2;
      const dist2 = current[0] ** 2 + current[1] ** 2;
      return dist2 < dist1 ? current : closest;
    });
  }

  const renderWidth = 150;
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
      0: t('deployer.vision.noGoods'),
      1: t('deployer.vision.hasGoods'),
      2: t('deployer.vision.planning'),
    },
  };
  const scaledPoints = useMemo(() => {
    if (!locationAry) return [];
    return locationAry.slice(1).map((p) => [-p[1] * 1000, p[0] * 1000, p[2], p[3]]);
  }, [locationAry]);
  const topLeftPoint = useMemo(() => {
    if (!scaledPoints.length) return null;
    const [x, y] = findClosestToOrigin(scaledPoints);
    return { x, y };
  }, [scaledPoints]);
  const offsetPoints = useMemo(() => {
    if (!scaledPoints.length || !topLeftPoint) return [];

    return scaledPoints.map((point) => ({
      x: point[0] - topLeftPoint.x,
      y: topLeftPoint.y - point[1],
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
          return ary.slice(0, index);
        },
      },
      unload: {
        splitAry: () => {
          return ary.slice(index + 1, ary.length);
        },
      },
    };
    const action = state === 1 ? 'load' : 'unload';
    const validateAry = hashMap[action].splitAry();
    validateAry.forEach((item: any) => {
      if (item[3] !== state) {
        isPass = false;
      }
    });
    if (!isPass) {
      toast.error(t('deployer.vision.truckStorageTips'));
    }
    return isPass;
  };

  const getItems = (index: number) => {
    return [
      {
        label: t('deployer.vision.setHasGoods'),
        key: 'hasGoods',
        onClick: async () => {
          let params = structuredClone(locationAry);
          const isPass = validateItem(index, 1);
          if (!isPass) return;
          params[index + 1][3] = 1;
          await save({ storage_location: { value: params } });
          toast.success(t('common.actionSuccess'));
          await getLocation();
        },
      },
      {
        label: t('deployer.vision.setNoGoods'),
        key: 'withoutGoods',
        onClick: async () => {
          let params = structuredClone(locationAry);
          const isPass = validateItem(index, 0);
          if (!isPass) return;
          params[index + 1][3] = 0;
          await save({ storage_location: { value: params } });
          toast.success(t('common.actionSuccess'));
          await getLocation();
        },
      },
    ].filter((item) => item.status !== status);
  };

  const handleChangeAllState = async (state: any) => {
    const titleHashMap: any = {
      1: t('deployer.vision.setAllHasGoods'),
      0: t('deployer.vision.setAllNoGoods'),
    };
    MwConfirm.confirm({
      title: t('common.action') as string,
      content: titleHashMap[state],
      onOk: async () => {
        const [axis, ...ary] = locationAry;
        ary.forEach((item: any) => {
          item[3] = state;
        });
        try {
          await save({ storage_location: { value: [axis, ...ary] } });
          await getLocation();
          toast.success(t('common.actionSuccess'));
        } catch (e) {
          //
        }
      },
    });
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
              <span>{t('deployer.vision.planning')}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-[20px] h-[20px] bg-[yellow] block'></span>
              <span>{t('deployer.vision.hasGoods')}</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-[20px] h-[20px] bg-[#00d1d1] block'></span>
              <span>{t('deployer.vision.noGoods')}</span>
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
                {t('deployer.vision.setAllHasGoods')}
              </Button>
              <Button
                variant='outlined'
                size={'small'}
                onClick={() => {
                  handleChangeAllState(0);
                }}
              >
                {t('deployer.vision.setAllNoGoods')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Cargo);

// -9.54 -8.51
