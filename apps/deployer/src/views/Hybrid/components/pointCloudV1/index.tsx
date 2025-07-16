import { useEffect, useRef, useState } from "react";
import { Circle, FastLayer, Rect } from "react-konva";
import { useHybirdStore } from "../../store/hybird.store";
import { useShallow } from "zustand/react/shallow";
import Konva from "konva";

export default function PointsCloudV1() {
  const layerRef = useRef<Konva.FastLayer>(null);
  const { showPointCloud, pointCloudV1Data } = useHybirdStore(
    useShallow((state) => ({
      showPointCloud: state.showPointCloud,
      pointCloudV1Data: state.pointCloudV1Data,
    }))
  );

  return (
    <FastLayer
      ref={layerRef}
      gpuAcceleration
      hitGraphEnabled={false}
      draggable={false}
    >
      {showPointCloud &&
        pointCloudV1Data?.map((point, index) => {
          return (
            <Circle
              key={index}
              x={point.x / 50}
              y={0 - point.y / 50}
              radius={1}
              fill={"red"}
            ></Circle>
          );
        })}
    </FastLayer>
  );
}
