import { Drawer } from 'antd';
import useDrawerClassName from '../../../hooks/useDrawerClassName';
interface Props {
  open: boolean;
  onClose: () => {};
}
const ChargingHistory = (props: Props) => {
  const { open, onClose } = props;
  const classNames = useDrawerClassName;
  return (
    <Drawer
      closable
      destroyOnHidden
      title={<p>充电记录</p>}
      placement='right'
      open={open}
      loading={false}
      classNames={{
        ...classNames,
        body: '!p-0',
      }}
      width={'50%'}
      onClose={onClose}
    >
      121212
    </Drawer>
  );
};
export default ChargingHistory;
