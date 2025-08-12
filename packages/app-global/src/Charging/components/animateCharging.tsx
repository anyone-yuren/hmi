import { motion } from 'framer-motion';

const bubbleVariants = {
  initial: {
    y: 0,
    opacity: 0,
    scale: 1,
  },
  animate: {
    y: -200,
    opacity: [0, 1, 0],
    scale: 1.5,
  },
};

const bubbleTransition = {
  duration: 3,
  ease: 'easeInOut',
  repeat: Infinity,
  repeatType: 'loop' as const,
  times: [0, 0.8, 1],
};

const Bubble = ({ delay = 0, left = '50%', size = 'w-3 h-3' }) => (
  <motion.div
    className={`absolute bottom-0 ${size} rounded-full bg-yellow-200`}
    style={{ left }}
    variants={bubbleVariants}
    initial='initial'
    animate='animate'
    transition={{ ...bubbleTransition, delay }}
  />
);

const AnimateCharging = () => {
  return (
    <div className='w-full h-64  rounded-xl overflow-hidden '>
      <Bubble delay={-0.8} left='5%' size='w-1 h-1' />
      <Bubble delay={0} left='10%' size='w-4 h-4' />
      <Bubble delay={0.2} left='20%' size='w-2 h-2' />
      <Bubble delay={0.6} left='40%' size='w-3 h-3' />
      <Bubble delay={1.2} left='60%' size='w-2.5 h-2.5' />
      <Bubble delay={1.8} left='30%' size='w-1.5 h-1.5' />
      <Bubble delay={2.4} left='50%' size='w-2 h-2' />
    </div>
  );
};

export default AnimateCharging;
