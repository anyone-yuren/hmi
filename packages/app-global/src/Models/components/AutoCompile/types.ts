export interface LibraryItem {
  id: string;
  name: string;
  version: string;
  checked: boolean;
  versions: string[];
}

export interface LayerData {
  id: string;
  title: string;
  items: LibraryItem[];
}

export interface BuildHistory {
  id: string;
  timestamp: number;
  duration: string;
  status: 'success' | 'failed';
  snapshot: Record<string, LayerData>; // Snapshot of layers at that time
}

export type LayerType = 'dependency' | 'base' | 'application';

export const MOCK_VERSIONS = ['20250930-G', '20250830-G', '20250730-G'];
