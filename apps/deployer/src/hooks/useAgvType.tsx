import { useGlobalStore } from '@gbeata/store';
import { useShallow } from 'zustand/react/shallow';

export const useAgvType = () => {
  const AGVTYPES = [
    '',
    'X20',
    'X20S',
    'SL14',
    'SE20',
    'SE15',
    'R20S',
    'R16',
    '未定义',
    'O20',
    'K16',
    'Z15',
    'AMR',
    'L20',
    'T30',
    'O30',
    'Q20',
    'X1',
  ];
  const { avgType } = useGlobalStore(
    useShallow((state) => ({
      avgType: state.avgType,
    })),
  );
  return AGVTYPES[avgType];
};
