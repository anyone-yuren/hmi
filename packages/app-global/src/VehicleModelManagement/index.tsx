import { useVehicleModelStore } from './store/useVehicleModelStore';
import ModelList from './components/ModelList';
import ModelDetail from './components/ModelDetail';

const VehicleModelManagement = () => {
  const { isEditing } = useVehicleModelStore();

  return (
    <div className="h-full w-full">
      {isEditing ? <ModelDetail /> : <ModelList />}
    </div>
  );
};

export default VehicleModelManagement;
