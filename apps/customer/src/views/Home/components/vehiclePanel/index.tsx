import { motion } from 'framer-motion';
import CarStage from '../CarPanel';
const VehiclePanel = () => {
  return (
    <motion.div
      className='relative h-full rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl overflow-hidden'
      whileHover={{ scale: 1, boxShadow: '0 0 40px rgba(255,255,255,0.4)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <CarStage />
    </motion.div>
  );
};
export default VehiclePanel;
