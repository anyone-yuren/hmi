import { Form, message, Modal, Select } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import { useParkingRuleStore } from '../../../../../VehicleModelManagement/store/useParkingRuleStore';
import { useVehicleModelStore } from '../../../../../VehicleModelManagement/store/useVehicleModelStore';
import { useMapEditorStore } from '../../../../store';
import { useStorageLocationStore } from '../store/storageLocationStore';

const BindVehicleDialog = () => {
  const {
    showBindVehicleDialog,
    setShowBindVehicleDialog,
    selectedIds,
    storageLocations,
    updateStorageLocation,
  } = useStorageLocationStore(
    useShallow((store) => ({
      showBindVehicleDialog: store.showBindVehicleDialog,
      setShowBindVehicleDialog: store.setShowBindVehicleDialog,
      selectedIds: store.selectedIds,
      storageLocations: store.storageLocations,
      updateStorageLocation: store.updateStorageLocation,
    })),
  );

  const { models } = useVehicleModelStore(
    useShallow((store) => ({ models: store.models })),
  );

  const { rules } = useParkingRuleStore(
    useShallow((store) => ({ rules: store.rules })),
  );

  const { staticPoints, setStaticPoints } = useMapEditorStore((state) => ({
    staticPoints: state.staticPoints,
    setStaticPoints: state.setStaticPoints,
  }));

  const [form] = Form.useForm();
  const vehicleModelIds = Form.useWatch('vehicleModelIds', form);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { vehicleModelIds, parkingRuleId } = values;

      const selectedRule = rules.find((r) => r.id === parkingRuleId);
      if (!selectedRule) {
        message.error('未找到选中的停车规则');
        return;
      }

      // Validation: Check allowedVehicleModelIds
      for (const id of selectedIds) {
        const loc = storageLocations.find((l) => l.id === id);
        if (
          loc &&
          loc.allowedVehicleModelIds &&
          loc.allowedVehicleModelIds.length > 0
        ) {
          const invalid = vehicleModelIds.some(
            (vid: string) => !loc.allowedVehicleModelIds?.includes(vid),
          );
          if (invalid) {
            message.error(`库位 ${loc.name} 不允许绑定选中的某些车型`);
            return;
          }
        }
      }

      // Filter out existing points linked to selected storage locations to avoid duplicates
      const newStaticPoints = staticPoints.filter(
        (p) => !selectedIds.includes(p.storageLocationId),
      );

      // Temporary array to hold generated points
      const generatedPoints: any[] = [];

      // Process each selected storage location
      selectedIds.forEach((id) => {
        const location = storageLocations.find((l) => l.id === id);
        if (!location) return;

        // 1. Update storage location with bound vehicle model and rule
        updateStorageLocation(id, {
          vehicleModelIds: vehicleModelIds,
          parkingRuleId: parkingRuleId,
        });

        // 2. Generate Parking Point
        if (location.type === 'shelf' && location.shelfConfig?.layers) {
          // Shelf Logic: Generate point for each layer
          location.shelfConfig.layers.forEach((layer, index) => {
            const pointPosition = {
              x: location.position.x + (layer.offsetX || 0),
              y: location.position.y + (layer.offsetY || 0),
              z: layer.height || 0,
            };

            const newPoint = {
              id: `SP_${Date.now()}_${id}_L${index}`,
              position: pointPosition,
              name: `${location.name}_L${index + 1}`,
              type: 'station',
              angle: layer.angle || 0,
              storageLocationId: id,
              layerIndex: index,
            };
            generatedPoints.push(newPoint);
          });
        } else {
          // Standard Logic: Generate single point based on Rule
          const ruleX = selectedRule.parkingPoint.offsetX || 0;
          const ruleY = selectedRule.parkingPoint.offsetY || 0;
          const ruleAngle = selectedRule.parkingPoint.angle || 0;

          const pointPosition = {
            x: location.position.x + ruleX,
            y: location.position.y + ruleY,
            z: 0,
          };

          const newPoint = {
            id: `SP_${Date.now()}_${id}`,
            position: pointPosition,
            name: `${location.name}_点`,
            type: 'station',
            angle: ruleAngle,
            storageLocationId: id,
          };
          generatedPoints.push(newPoint);
        }
      });

      // Batch update points
      setStaticPoints([...newStaticPoints, ...generatedPoints]);

      message.success(`已绑定车型并生成 ${generatedPoints.length} 个停车点`);
      setShowBindVehicleDialog(false);
      form.resetFields();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      title='绑定车型'
      open={showBindVehicleDialog}
      onOk={handleOk}
      onCancel={() => setShowBindVehicleDialog(false)}
      zIndex={10001}
    >
      <Form form={form} layout='vertical'>
        <Form.Item
          name='vehicleModelIds'
          label='选择车型'
          rules={[{ required: true, message: '请选择车型' }]}
        >
          <Select
            mode='multiple'
            placeholder='请选择车型'
            options={models.map((m) => ({ label: m.name, value: m.id }))}
          />
        </Form.Item>

        <Form.Item
          name='parkingRuleId'
          label='选择停车规则'
          rules={[{ required: true, message: '请选择停车规则' }]}
        >
          <Select
            placeholder='请选择停车规则'
            options={rules.map((r) => ({ label: r.name, value: r.id }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BindVehicleDialog;
