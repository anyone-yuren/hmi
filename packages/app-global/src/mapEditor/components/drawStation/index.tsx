import { IconifyIcon } from 'ui';

const DrawStationSelect = () => {
  return (
    <>
      <div className='flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md'>
        <IconifyIcon icon='mingcute:base-station-line' size={16} />
        <span>站点</span>
      </div>
    </>
  );
};

export default DrawStationSelect;
