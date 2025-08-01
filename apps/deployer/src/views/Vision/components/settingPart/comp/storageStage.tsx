import { getLineList, getPointList } from '@/views/Vision/services/index';
import { InitStage } from '@gbeata/mapping';
import { Button } from '@mui/material';
import { useRequest, useSize } from 'ahooks';
import { memo, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  value: any[];
  onChange: (value: any[]) => void;
}
const StorageStage = (props: IProps) => {
  const { value, onChange } = props;
  const [templateValue, setTemplateValue] = useState(value);
  const ref = useRef(null);
  const size = useSize(ref);
  const { t } = useTranslation();
  const { data: linesList } = useRequest(() => getLineList(), {});
  const { data: pointsList }: Record<string, any> = useRequest(getPointList, {
    manual: false,
  });

  const pointsMap = useMemo(() => {
    let hashMap: any = {},
      points: any = [],
      charges: any = [],
      locations: any = [];
    for (let index = 0; index < pointsList?.data?.length; index++) {
      const point = pointsList?.['data']?.[index] || {};
      point.types.length && (point.type = point.types[0]);
      if (point.type === 5) {
        point.type = 1;
      }
      hashMap[point.id] = point;
      points.push({ ...point, state: 0 });
      point.type === 6 && charges.push(point);
      point.type === 1 && locations.push(point);
    }
    console.log('locations', locations);
    return { hashMap, points, charges, locations };
  }, [pointsList]);

  const lines = useMemo(() => {
    const ary = [];
    for (let index = 0; index < linesList?.data?.length; index++) {
      const { id, end_point, start_point, control_points } = linesList?.data?.[index];
      ary.push({
        id,
        type: 1,
        start: start_point?.id,
        end: end_point?.id,
        length: 1,
        controlPoint: control_points?.map((point: any, index: number) => {
          return { x: point.x, y: point.y };
        }),
        directionType: 1,
      });
    }
    return ary;
  }, [linesList]);

  // const lines = React.useMemo(() => {
  //   const mapEdges: any = (isMock ? mockMapData?.data?.mapEdges : mapData?.mapEdges) || [];
  //   const ary: any = [];
  //   // // 不知道在哪里看的 用for循环会更快
  //   for (let index = 0; mapEdges.length > index; index += 1) {
  //     const { edgeId: id, start, type, end, controlPoint, directionType, length } = mapEdges[index];

  //     // 只给单单向线
  //     ary.push({
  //       id,
  //       type,
  //       start,
  //       end,
  //       length,
  //       controlPoint,
  //       directionType,
  //     });
  //   }
  //   return ary;
  // }, [mockMapData, mapData]);

  const renderTemplateValue = useMemo(() => {
    return templateValue?.filter((point: any) => pointsMap?.hashMap[point]);
  }, [templateValue, pointsMap?.hashMap]);

  const handleClick = () => {
    onChange && onChange(renderTemplateValue);
  };
  return (
    <div className='flex flex-col h-full gap-[10px]'>
      <div className='flex-1 text-white' ref={ref}>
        {pointsMap?.points?.length && (
          <InitStage
            size={size}
            infiniteView={true}
            lines={{
              lines,
              lineVisible: true,
            }}
            points={{
              points: pointsMap?.points,
            }}
            // 不在地图内显示的点不要给地图
            pointsValue={renderTemplateValue}
            onPointsSelect={(points: any[]) => {
              if (!points.length && renderTemplateValue.length !== 1) return;
              setTemplateValue(points);
            }}
          ></InitStage>
        )}
      </div>
      <div className='w-full h-[30px] flex items-center'>
        <div className='flex-1'>
          {t('已选择')}: {renderTemplateValue?.join('、')}
        </div>
        <div>
          <Button variant='contained' size={'small'} sx={{ color: 'white' }} onClick={handleClick}>
            {t('提交')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(StorageStage);
