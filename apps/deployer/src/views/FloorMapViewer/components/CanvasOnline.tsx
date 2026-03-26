import { useRequest } from 'ahooks';
import { Modal } from 'antd';
import { memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Circle, Group, Layer, Text } from 'react-konva';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import NewAgv from '../../Hybrid/components/newAgv';
import { relocatePoint } from '../../Hybrid/service';
import { useHybirdStore } from '../../Hybrid/store/hybird.store';

const translateAngel = (angel: number) => {
  return 180 - (angel || 0) * (180 / Math.PI);
};
const DeviceList = () => {
  const { t } = useTranslation();
  const { onlineData, isDrag } = useHybirdStore(
    useShallow((state) => {
      return {
        onlineData: state.onlineData,
        isDrag: state.isDrag,
      };
    }),
  );

  const onlineDataRef = useRef(onlineData);
  if (!isDrag) {
    onlineDataRef.current = onlineData;
  }
  const currentOnlineData = onlineDataRef.current;

  const { runAsync: run } = useRequest(relocatePoint, {
    manual: true,
  });
  const meterToPixel = (meter: number) => {
    return Math.floor(meter * 20);
  };

  const onClickEvent = (e: any) => {
    const target = e.target;
    const targetName = target.className;
    const id = target.attrs.id;
    if (targetName === 'Circle' || targetName === 'Text') {
      Modal.confirm({
        title: t('common.tips'),
        content: t('deployer.hybrid.confirmOnlineTips'),
        okText: t('common.confirm'),
        cancelText: t('common.cancel'),
        onOk: async () => {
          const res: any = await run({
            cmd_type: 3,
            point_id: id,
          });
          if (res?.error_code === 10000) {
            toast.success(t('deployer.hybrid.onlineSuccess'));
          } else {
            toast.error(t('deployer.hybrid.onlineFail'));
          }
        },
      });
    }
  };
  return (
    <Layer name='online-layer'>
      <Group name='device' onClick={onClickEvent} onTap={onClickEvent}>
        {currentOnlineData?.point_list?.map((item: any) => {
          return (
            <Group key={item.point_id}>
              {false && (
                <Circle
                  radius={4}
                  fill='#FF0000'
                  id={item.point_id}
                  name='onlinePoint'
                  x={meterToPixel(item.pose_x)}
                  y={0 - meterToPixel(item.pose_y)}
                ></Circle>
              )}
              {true && (
                <NewAgv
                  id={item.point_id}
                  radius={8}
                  stroke={'black'}
                  showRect={true}
                  x={meterToPixel(item.pose_x)}
                  y={0 - meterToPixel(item.pose_y)}
                  rotation={translateAngel(item.pose_theta) + 270}
                ></NewAgv>
              )}
              <Text
                x={meterToPixel(item.pose_x)}
                y={0 - meterToPixel(item.pose_y)}
                id={item.point_id}
                text={item.point_id}
                offsetY={30}
                offsetX={3}
                fontSize={25}
                fill='#00D1D1'
              ></Text>
            </Group>
          );
        })}
      </Group>
    </Layer>
  );
};
export default memo(DeviceList);
