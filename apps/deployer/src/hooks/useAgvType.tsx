// 定义枚举值（数值可以和后端保持一致）
export enum AGVTYPES {
  MIN = 0,
  C05 = 1,
  C10,
  X1 = 10,
  X20,
  X20S,
  T30 = 20,
  OT10 = 30,
  OT15,
  SL14 = 40,
  SL16,
  SL20,
  L20 = 50,
  SE15 = 60,
  SE20,
  SE30,
  E30 = 70,
  E35,
  E40,
  O15 = 80,
  O20,
  O30,
  O40,
  O50,
  K16 = 90,
  R14 = 100,
  R16,
  R20,
  R20S,
  Q20 = 110,
  Z15 = 120,
  MAX,
}

// 定义一个映射表：数值 → 名称
const AGVTYPE_NAMES: Record<number, string> = {
  [AGVTYPES.MIN]: 'MIN',
  [AGVTYPES.C05]: 'C05',
  [AGVTYPES.C10]: 'C10',
  [AGVTYPES.X1]: 'X1',
  [AGVTYPES.X20]: 'X20',
  [AGVTYPES.X20S]: 'X20S',
  [AGVTYPES.T30]: 'T30',
  [AGVTYPES.OT10]: 'OT10',
  [AGVTYPES.OT15]: 'OT15',
  [AGVTYPES.SL14]: 'SL14',
  [AGVTYPES.SL16]: 'SL16',
  [AGVTYPES.SL20]: 'SL20',
  [AGVTYPES.L20]: 'L20',
  [AGVTYPES.SE15]: 'SE15',
  [AGVTYPES.SE20]: 'SE20',
  [AGVTYPES.SE30]: 'SE30',
  [AGVTYPES.E30]: 'E30',
  [AGVTYPES.E35]: 'E35',
  [AGVTYPES.E40]: 'E40',
  [AGVTYPES.O15]: 'O15',
  [AGVTYPES.O20]: 'O20',
  [AGVTYPES.O30]: 'O30',
  [AGVTYPES.O40]: 'O40',
  [AGVTYPES.O50]: 'O50',
  [AGVTYPES.K16]: 'K16',
  [AGVTYPES.R14]: 'R14',
  [AGVTYPES.R16]: 'R16',
  [AGVTYPES.R20]: 'R20',
  [AGVTYPES.R20S]: 'R20S',
  [AGVTYPES.Q20]: 'Q20',
  [AGVTYPES.Z15]: 'Z15',
  [AGVTYPES.MAX]: 'MAX',
};

// Hook 改造
import { useGlobalStore } from '@gbeata/store';
import { useShallow } from 'zustand/react/shallow';

export const useAgvType = () => {
  const { avgType } = useGlobalStore(
    useShallow((state) => ({
      avgType: state.avgType,
    })),
  );
  console.log(AGVTYPE_NAMES[avgType], '测试----');

  // 如果找不到对应值，就返回“未定义”
  return AGVTYPE_NAMES[avgType] ?? '未定义';
};
