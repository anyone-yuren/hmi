import { IconifyIcon } from 'ui';

const DrawLinesSelect = () => {
  return (
    <>
      <div className='flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md'>
        <IconifyIcon icon='fad:softclipcurve' size={16} />
        <span>线</span>
      </div>
    </>
  );
};

export default DrawLinesSelect;
