import LanSetting from './infoComponents/lanSetting';
import PasswordConnect from './infoComponents/passwordConnect';
import WanSetting from './infoComponents/wanSetting';
import PortModules from './portModules';

const NetworkInfo = (props: { currentAp: Record<string, any>; selectNetwork: any }) => {
  const { currentAp, selectNetwork = {} } = props;
  return (
    <div className='flex flex-col gap-2 overflow-y-auto'>
      <div>
        <PasswordConnect selectNetwork={selectNetwork} currentAp={currentAp} />
      </div>
      <div>
        <WanSetting selectNetwork={selectNetwork} currentAp={currentAp} />
      </div>
      <div>
        <LanSetting />
      </div>
      <div>
        <PortModules />
      </div>
    </div>
  );
};

export default NetworkInfo;
