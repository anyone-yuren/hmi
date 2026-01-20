export type CapabilityStatus = 'done' | 'ready' | 'disabled';

export type CapabilityNodeData = {
  label: string;
  status: CapabilityStatus;
};
