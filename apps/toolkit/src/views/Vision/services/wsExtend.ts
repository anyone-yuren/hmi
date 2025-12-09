import { useShallow } from 'zustand/react/shallow';
import { useVisionStore } from '../store/vision.store';

export default function useVisionWsExtend() {
  const { setVisionPickSetting, setPointCloud, setPointCloud2d } = useVisionStore(
    useShallow((store) => ({
      setVisionPickSetting: store.setVisionPickSetting,
      setPointCloud: store.setPointCloud,
      setPointCloud2d: store.setPointCloud2d,
    })),
  );

  return {
    '/cv_mwrobot/para_config_changes': (data: any) => {
      setVisionPickSetting(data.data);
    },
    '/cv_mwrobot/point_cloud': (data: any) => {
      if (data.data) {
        const ary = JSON.parse(data.data);
        setPointCloud(ary);
      }
    },
    '/cv_mwrobot/point_cloud_2D': (data) => {
      if (!data.data) return;
      const ary = JSON.parse(data.data);
      setPointCloud2d(ary);
    },
  };
}
