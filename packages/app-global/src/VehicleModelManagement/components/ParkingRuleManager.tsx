import { Drawer } from 'antd';
import ParkingRuleList from './ParkingRuleList';
import ParkingRuleModal from './ParkingRuleModal';

interface ParkingRuleManagerProps {
  open: boolean;
  onClose: () => void;
}

const ParkingRuleManager = ({ open, onClose }: ParkingRuleManagerProps) => {
  return (
    <>
      <Drawer
        title="停车规则管理"
        width="80%"
        open={open}
        onClose={onClose}
        styles={{ body: { paddingBottom: 80 } }}
      >
        <ParkingRuleList />
      </Drawer>
      <ParkingRuleModal />
    </>
  );
};

export default ParkingRuleManager;
