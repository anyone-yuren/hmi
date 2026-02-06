import { create } from 'zustand';
import { ParkingRule } from '../types';

interface ParkingRuleState {
  rules: ParkingRule[];
  isEditing: boolean;
  currentRule: ParkingRule | null;

  setRules: (rules: ParkingRule[]) => void;
  addRule: (rule: ParkingRule) => void;
  updateRule: (id: string, data: Partial<ParkingRule>) => void;
  deleteRule: (id: string) => void;
  startEditing: (rule?: ParkingRule) => void;
  cancelEditing: () => void;
}

const MOCK_RULES: ParkingRule[] = [
  {
    id: 'PR001',
    name: 'Standard Parking',
    vehicleModelIds: ['V001', 'V002'],
    stationType: 'LoadingStation',
    priority: 1,
    enabled: true,
    description: 'Standard parking rule for loading stations',
    parkingPoint: {
      anchor: 'CENTER',
      offsetX: 0.6,
      offsetY: 0,
      direction: 'FORWARD',
      angle: 0,
    },
    safety: {
      visualDetection: true,
      obstacleAvoidanceScheme: 'Strict',
    },
    updateTime: '2023-10-27 10:00:00',
  },
];

export const useParkingRuleStore = create<ParkingRuleState>((set) => ({
  rules: MOCK_RULES,
  isEditing: false,
  currentRule: null,

  setRules: (rules) => set({ rules }),
  addRule: (rule) => set((state) => ({ rules: [...state.rules, rule] })),
  updateRule: (id, data) =>
    set((state) => ({
      rules: state.rules.map((r) => (r.id === id ? { ...r, ...data } : r)),
    })),
  deleteRule: (id) =>
    set((state) => ({
      rules: state.rules.filter((r) => r.id !== id),
    })),
  startEditing: (rule) => set({ isEditing: true, currentRule: rule || null }),
  cancelEditing: () => set({ isEditing: false, currentRule: null }),
}));
