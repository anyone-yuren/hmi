import { motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../store';
import DrawLinesParamsPanel from '../drawLine/components/paramspanel';
import DrawPointsParamsPanel from '../drawPoints/components/paramspanel';
import DrawDeviceParamsPanel from '../handles/components/draw/components/device/paramspanel';
import DrawNavigationParamsPanel from '../handles/components/draw/components/navigation/paramspanel';

const ParamsPanel = () => {
  const { paramsPanelCollapsed, selectDrawType } = useMapEditorStore(
    useShallow((state) => {
      return {
        paramsPanelCollapsed: state.paramsPanelCollapsed,
        selectDrawType: state.selectDrawType,
      };
    }),
  );
  return (
    <motion.div
      animate={{
        width: !paramsPanelCollapsed ? 0 : 400,
        opacity: !paramsPanelCollapsed ? 0 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 24,
      }}
      className='bg-white/5 overflow-hidden flex'
    >
      {selectDrawType === 'point' && <DrawPointsParamsPanel />}
      {(selectDrawType === 'line' || selectDrawType === 'bspline') && <DrawLinesParamsPanel />}
      {selectDrawType === 'device' && <DrawDeviceParamsPanel />}
      {selectDrawType === 'navigation' && <DrawNavigationParamsPanel />}
    </motion.div>
  );
};

export default ParamsPanel;
