import { useShallow } from 'zustand/react/shallow';
import { useVisionStore } from '../store/vision.store';

export default function useVisionWsExtend() {
  const { setVisionPickSetting, setPointCloud } = useVisionStore(
    useShallow((store) => ({
      setVisionPickSetting: store.setVisionPickSetting,
      setPointCloud: store.setPointCloud,
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
  };
}
