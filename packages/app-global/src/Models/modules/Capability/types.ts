export type CapabilityStatus = 'done' | 'ready' | 'disabled';

export type CapabilityNodeData = {
  label: string;
  status: CapabilityStatus;
  hasChildren?: boolean;
  expanded?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
};
