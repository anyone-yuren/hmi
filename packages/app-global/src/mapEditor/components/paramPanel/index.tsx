import { motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../store';
import DrawPointsParamsPanel from '../drawPoints/components/paramspanel';

const ParamsPanel = () => {
  const { paramsPanelCollapsed } = useMapEditorStore(
    useShallow((state) => {
      return {
        paramsPanelCollapsed: state.paramsPanelCollapsed,
      };
    }),
  );

  return (
    <motion.div
      animate={{
        width: !paramsPanelCollapsed ? 0 : 300,
        opacity: !paramsPanelCollapsed ? 0 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 24,
      }}
      className='bg-white/5 overflow-hidden flex'
    >
      <DrawPointsParamsPanel />
    </motion.div>
  );
};

export default ParamsPanel;
