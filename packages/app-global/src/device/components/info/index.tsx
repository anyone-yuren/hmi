import Device from './profile';

type DeviceInfoProps = {
  id: string;
};
const DeviceInfo = (props: DeviceInfoProps) => {
  const { id } = props;
  return (
    <div>
      <Device />
    </div>
  );
};
export default DeviceInfo;
