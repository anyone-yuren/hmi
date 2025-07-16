import { useShallow } from "zustand/react/shallow";
import { useHybirdStore } from "../../store/hybird.store";
import { useMemo } from "react";
import { Rect } from "react-konva";

const QrCodemap = () => {
  const { floorMapData } = useHybirdStore(
    useShallow((state) => ({
      floorMapData: state.floorData,
    }))
  );
  const { qrcode_map } = floorMapData;
  const renderQrCodeMap = useMemo(() => {
    if (qrcode_map && qrcode_map.length) {
      return qrcode_map.map((item: any) => {
        const { x, y } = item.pose;
        return (
          <Rect
            name={"qrcode-" + item?.tag}
            key={item?.tag}
            x={x * 20}
            y={0 - y * 20}
            width={4}
            height={4}
            fill="yellow"
            stroke={"black"}
            strokeWidth={1}
          />
        );
      });
    }
  }, [qrcode_map]);
  return <>{renderQrCodeMap}</>;
};

export default QrCodemap;
