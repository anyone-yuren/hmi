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

// Hook 改造
import { useGlobalStore } from '@gbeata/store';
import { useShallow } from 'zustand/react/shallow';
import { Fork15lift, Sl14Model, X20Model } from '../Models/components/index';

// 定义一个映射表：数值 → 名称
const AGV_MODELS: Record<number, any> = {
  [AGVTYPES.MIN]: null,
  [AGVTYPES.C05]: null,
  [AGVTYPES.C10]: null,
  [AGVTYPES.X1]: null,
  [AGVTYPES.X20]: {
    model: X20Model,
    position: [-0.2, 0, 0],
  },
  [AGVTYPES.X20S]: null,
  [AGVTYPES.T30]: null,
  [AGVTYPES.OT10]: null,
  [AGVTYPES.OT15]: null,
  [AGVTYPES.SL14]: {
    model: Sl14Model,
  },
  [AGVTYPES.SL16]: null,
  [AGVTYPES.SL20]: null,
  [AGVTYPES.L20]: null,
  [AGVTYPES.SE15]: {
    model: Fork15lift,
  },
  [AGVTYPES.SE20]: null,
  [AGVTYPES.SE30]: null,
  [AGVTYPES.E30]: null,
  [AGVTYPES.E35]: null,
  [AGVTYPES.E40]: null,
  [AGVTYPES.O15]: null,
  [AGVTYPES.O20]: null,
  [AGVTYPES.O30]: null,
  [AGVTYPES.O40]: null,
  [AGVTYPES.O50]: null,
  [AGVTYPES.K16]: null,
  [AGVTYPES.R14]: null,
  [AGVTYPES.R16]: null,
  [AGVTYPES.R20]: null,
  [AGVTYPES.R20S]: null,
  [AGVTYPES.Q20]: null,
  [AGVTYPES.Z15]: null,
  [AGVTYPES.MAX]: null,
};

export const useAgvModels = () => {
  const { avgType } = useGlobalStore(
    useShallow((state) => ({
      avgType: state.avgType,
    })),
  );
  console.log('[useAgvModels.tsx]:avgType', avgType);
  return {
    hasModel: AGV_MODELS[avgType] ? true : false,
    model: AGV_MODELS[avgType]?.model ?? null,
    position: AGV_MODELS[avgType]?.position ?? [0, 0, 0],
  };
};
