import { Button, Form, Input, Select, Typography } from 'antd';
import { useEffect } from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';

const { Title } = Typography;
const { TextArea } = Input;

const PropertiesPanel = () => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedNode) {
      form.setFieldsValue({
        label: selectedNode.data.label,
        description: selectedNode.data.description,
        ...selectedNode.data.params,
      });
    }
  }, [selectedNode, form]);

  const onValuesChange = (changedValues: any, allValues: any) => {
    if (!selectedNodeId) return;

    // Separate label/description from params
    const { label, description, ...params } = allValues;
    updateNodeData(selectedNodeId, {
      label,
      description,
      params,
    });
  };

  if (!selectedNode) {
    return (
      <div className="flex h-full w-72 flex-col items-center justify-center border-l border-gray-700 bg-[#1f1f1f] text-gray-500">
        <div>请选择一个节点</div>
      </div>
    );
  }

  return (
    <div className="h-full w-72 border-l border-gray-700 bg-[#1f1f1f] text-gray-200">
      <div className="border-b border-gray-700 p-4">
        <Title level={5} style={{ margin: 0, color: '#e5e7eb' }}>
          属性配置
        </Title>
        <div className="text-xs text-gray-500">ID: {selectedNode.id}</div>
      </div>
      <div className="p-4">
        <Form
          form={form}
          layout="vertical"
          onValuesChange={onValuesChange}
          initialValues={{
            label: selectedNode.data.label,
            description: selectedNode.data.description,
          }}
        >
          <Form.Item label={<span className="text-gray-300">节点名称</span>} name="label">
            <Input className="bg-[#2a2a2a] text-gray-200 border-gray-600 focus:bg-[#333]" />
          </Form.Item>
          
          <Form.Item label={<span className="text-gray-300">描述</span>} name="description">
            <TextArea rows={2} className="bg-[#2a2a2a] text-gray-200 border-gray-600 focus:bg-[#333]" />
          </Form.Item>

          <div className="my-4 border-t border-gray-700 pt-4">
            <Title level={5} style={{ fontSize: '14px', color: '#e5e7eb' }}>参数设置</Title>
            
            {/* Dynamic fields based on type could go here */}
            {selectedNode.data.type === 'data-acquisition' && (
              <Form.Item label={<span className="text-gray-300">设备ID</span>} name="deviceId">
                <Input className="bg-[#2a2a2a] text-gray-200 border-gray-600 focus:bg-[#333]" />
              </Form.Item>
            )}

            {selectedNode.data.type === 'integration' && (
              <>
                <Form.Item label={<span className="text-gray-300">API 地址</span>} name="apiUrl">
                  <Input className="bg-[#2a2a2a] text-gray-200 border-gray-600 focus:bg-[#333]" />
                </Form.Item>
                <Form.Item label={<span className="text-gray-300">请求方法</span>} name="method">
                  <Select 
                    className="bg-[#2a2a2a]"
                    popupClassName="bg-[#2a2a2a]"
                    options={[
                      { value: 'GET', label: 'GET' },
                      { value: 'POST', label: 'POST' },
                    ]} 
                  />
                </Form.Item>
              </>
            )}
            
            {/* Add more specific fields as needed */}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PropertiesPanel;
