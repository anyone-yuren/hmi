import { motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../store';
import DrawLinesParamsPanel from '../drawLine/components/paramspanel';
import DrawPointsParamsPanel from '../drawPoints/components/paramspanel';

const ParamsPanel = () => {
  const { paramsPanelCollapsed, selectDrawType } = useMapEditorStore(
    useShallow((state) => {
      return {
        paramsPanelCollapsed: state.paramsPanelCollapsed,
        selectDrawType: state.selectDrawType,
      };
    }),
  );
  console.log(selectDrawType);
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
    </motion.div>
  );
};

export default ParamsPanel;
