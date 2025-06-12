import { useDashboardInfo } from "@/store/DashboardInfo";
import { Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, Vector3 } from "three";
import { useShallow } from "zustand/react/shallow";

export const convertToMeters = (value: number) => value / 1000;
const ActiveLine = (props) => {
  // const { agvPosition } = props;
  const { segments_info } = useDashboardInfo(
    useShallow((state) => {
      return {
        segments_info: state.segments_info,
      };
    })
  );

  const paths = useMemo(() => {
    if (!segments_info.length) return [];
    return segments_info?.map((route) => {
      if (!route?.control_points) return [];
      const pathPoints = route?.control_points?.map(
        (point) =>
          new Vector3(
            convertToMeters(point.x),
            -0.001,
            convertToMeters(point.y)
          )
      );
      const curve = new CatmullRomCurve3(pathPoints, false); // 'centripetal' | 'chordal' | 'catmullrom'
      return curve;
    });
  }, [segments_info]);

  // 将角度变化转为弧度

  return (
    <>
      <group>
        {/* 在车辆位置上添加一个点光源 */}
        <group>
          {paths?.map((curve, index) => {
            if (!curve || !curve?.length) return null;
            return (
              // <line key={index} geometry={new BufferGeometry().setFromPoints(curve.getPoints())} material={material} />
              <Line
                key={index}
                points={curve.getPoints(100)}
                lineWidth={4}
                color={"#ffc90f"}
                dashed={false}
              />
            );
          })}
        </group>
      </group>
    </>
  );
};
export default ActiveLine;
