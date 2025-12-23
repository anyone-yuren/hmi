import { useFullscreen } from 'ahooks';
import { useRef } from 'react';
import { IconifyIcon } from 'ui';
import VisionFlow from './VisionFlow';
export default function Page() {
  const ref = useRef<HTMLDivElement>(null);
  // const [{ toggleFullscreen }] = useFullscreen(ref);
  const [isFullscreen, { enterFullscreen, exitFullscreen, toggleFullscreen }] = useFullscreen(ref);
  return (
    <div style={{ width: '100%', height: '100%' }} className='relative' ref={ref}>
      <IconifyIcon
        icon='icon-park-outline:off-screen-one'
        size={18}
        className='absolute top-2 right-2 z-20 cursor-pointer text-white'
        onClick={toggleFullscreen}
      />
      <VisionFlow />
    </div>
  );
}
