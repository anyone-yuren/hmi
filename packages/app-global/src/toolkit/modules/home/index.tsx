import { useState } from 'react';
import VehiclesManagement from './components/vehiclesManagement';

const Home = () => {
  const [select, setSelect] = useState<string>('车辆管理');
  return (
    <div className='bg-white/5 h-full flex flex-col gap-2 p-2 overflow-hidden overflow-y-auto'>
      {/* <div>
        <Segmented<string>
          options={['车辆管理', '地图编辑器', '调度管理']}
          onChange={(value) => {
            setSelect(value);
          }}
        />
      </div> */}
      {/* <div>{select === '车辆管理' && <VehiclesManagement />}</div> */}
      <VehiclesManagement />
    </div>
  );
};
export default Home;
