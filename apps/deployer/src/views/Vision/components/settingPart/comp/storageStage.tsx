import { getLineList, getPointList } from '@/views/Vision/services/index';
// import { InitStage } from '@gbeata/mapping';
import { InitStage } from '@gbeata/app-global';
import { Button, Chip } from '@mui/material';
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
      const newPoint = {
        ...point,
        x: (point.x / 1000) * 20,
        y: (point.y / 1000) * 20,
        state: 0,
      };
      hashMap[point.id] = newPoint;
      points.push(newPoint);
      point.type === 6 && charges.push(newPoint);
      point.type === 1 && locations.push(newPoint);
    }
    return { hashMap, points, charges, locations };
  }, [pointsList]);

  const lines = useMemo(() => {
    const ary: any = [];
    for (let index = 0; index < linesList?.data?.length; index++) {
      const { id, end_point, start_point, control_points = [] } = linesList?.data?.[index];
      ary.push({
        id,
        type: 1,
        start: start_point?.id,
        end: end_point?.id,
        length: 1,
        controlPoint: control_points?.map((point: any, index: number) => {
          return { x: point.x / 50, y: point.y / 50 };
        }),
        directionType: 1,
      });
    }
    return ary;
  }, [linesList]);

  const renderTemplateValue = useMemo(() => {
    return templateValue?.filter((point: any) => pointsMap?.hashMap[point]);
  }, [templateValue, pointsMap?.hashMap]);

  const handleDeleteItem = (itemId: string | number) => {
    const newSelected = renderTemplateValue.filter((id) => id !== itemId);
    setTemplateValue(newSelected);
  };

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
            allPointsVisible={true}
            boundary={{
              boundaryVisible: false,
            }}
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
            activePointStroke={'red'}
          ></InitStage>
        )}
      </div>
      <div className='w-full h-[30px] flex items-center'>
        <div className='flex-1'>
          {t('deployer.vision.selected')}:{' '}
          {renderTemplateValue?.map((item, index) => (
            <Chip
              key={index}
              label={item}
              onDelete={() => handleDeleteItem(item)}
              size='small'
              sx={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                height: '24px',
                margin: '0 5px',
              }}
            />
          ))}
        </div>
        <div>
          <Button variant='contained' size={'small'} sx={{ color: 'white' }} onClick={handleClick}>
            {t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(StorageStage);
