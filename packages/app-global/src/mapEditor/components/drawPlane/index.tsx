import { IconifyIcon } from 'ui';

const DrawPlaneSelect = () => {
  return (
    <>
      <div className='flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md'>
        <IconifyIcon icon='ri:shape-line' size={16} />
        <span>面</span>
      </div>
    </>
  );
};

export default DrawPlaneSelect;
