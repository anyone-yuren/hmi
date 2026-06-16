import {
  MinusCircleOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Select, Space, Typography } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';

const { Title } = Typography;
const { TextArea } = Input;

const PropertiesPanel = () => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      setIsOpen(true);

      const defaultParams = { ...selectedNode.data.params };
      const excludeKeys = [
        'label',
        'description',
        'deviceId',
        'apiUrl',
        'method',
        'dataFormat',
        'callbackNodeId',
      ];

      form.setFieldsValue({
        label: selectedNode.data.label,
        description: selectedNode.data.description,
        ...defaultParams,
        customParams: Object.entries(defaultParams || {})
          .filter(([key]) => !excludeKeys.includes(key))
          .map(([key, value]) => ({ key, value })),
      });
    } else {
      setIsOpen(false);
    }
  }, [selectedNode, form]);

  const onValuesChange = (changedValues: any, allValues: any) => {
    if (!selectedNodeId) return;

    const { label, description, customParams, ...otherParams } = allValues;

    const params = { ...otherParams };
    if (customParams) {
      customParams.forEach((item: { key: string; value: any }) => {
        if (item && item.key) {
          params[item.key] = item.value;
        }
      });
    }

    updateNodeData(selectedNodeId, {
      label,
      description,
      params,
    });
  };

  // Get all nodes for callback selection
  const allNodes = useWorkflowStore((state) => state.nodes);

  return (
    <div className='relative flex h-full'>
      {/* Toggle Button */}
      <div
        className='absolute -left-4 top-1/2 z-10 flex h-16 w-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-l-md bg-[#1f1f1f] border-y border-l border-gray-700 text-gray-400 hover:text-blue-400'
        onClick={() => setIsOpen(!isOpen)}
      >
        <RightOutlined
          className={`text-xs transition-transform duration-300 ${
            isOpen ? '' : 'rotate-180'
          }`}
        />
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='h-full border-l border-gray-700 bg-[#1f1f1f] text-gray-200 overflow-hidden'
          >
            <div className='w-72 h-full flex flex-col'>
              {selectedNode ? (
                <>
                  <div className='border-b border-gray-700 p-4'>
                    <Title level={5} style={{ margin: 0, color: '#e5e7eb' }}>
                      属性配置
                    </Title>
                    <div className='text-xs text-gray-500'>
                      ID: {selectedNode.id}
                    </div>
                  </div>
                  <div className='flex-1 overflow-y-auto p-4'>
                    <Form
                      form={form}
                      layout='vertical'
                      onValuesChange={onValuesChange}
                      initialValues={{
                        label: selectedNode.data.label,
                        description: selectedNode.data.description,
                      }}
                    >
                      <Form.Item
                        label={<span className='text-gray-300'>节点名称</span>}
                        name='label'
                      >
                        <Input className='bg-[#2a2a2a] text-gray-200 border-gray-600 focus:bg-[#333]' />
                      </Form.Item>

                      <Form.Item
                        label={<span className='text-gray-300'>描述</span>}
                        name='description'
                      >
                        <TextArea
                          rows={2}
                          className='bg-[#2a2a2a] text-gray-200 border-gray-600 focus:bg-[#333]'
                        />
                      </Form.Item>

                      <div className='my-4 border-t border-gray-700 pt-4'>
                        <Title
                          level={5}
                          style={{ fontSize: '14px', color: '#e5e7eb' }}
                        >
                          参数设置
                        </Title>

                        {/* Specific fields based on Node Type */}

                        {/* Data Acquisition */}
                        {selectedNode.data.type === 'data-acquisition' && (
                          <Form.Item
                            label={
                              <span className='text-gray-300'>设备ID</span>
                            }
                            name='deviceId'
                          >
                            <Input className='bg-[#2a2a2a] text-gray-200 border-gray-600 focus:bg-[#333]' />
                          </Form.Item>
                        )}

                        {/* Integration */}
                        {selectedNode.data.type === 'integration' && (
                          <>
                            <Form.Item
                              label={
                                <span className='text-gray-300'>API 地址</span>
                              }
                              name='apiUrl'
                            >
                              <Input className='bg-[#2a2a2a] text-gray-200 border-gray-600 focus:bg-[#333]' />
                            </Form.Item>
                            <Form.Item
                              label={
                                <span className='text-gray-300'>请求方法</span>
                              }
                              name='method'
                            >
                              <Select
                                className='bg-[#2a2a2a]'
                                popupClassName='bg-[#2a2a2a]'
                                options={[
                                  { value: 'GET', label: 'GET' },
                                  { value: 'POST', label: 'POST' },
                                ]}
                              />
                            </Form.Item>
                          </>
                        )}

                        {/* Execution Node */}
                        {selectedNode.data.type === 'execution' && (
                          <>
                            <Form.Item
                              label={
                                <span className='text-gray-300'>接口地址</span>
                              }
                              name='apiUrl'
                            >
                              <Input
                                className='bg-[#2a2a2a] text-gray-200 border-gray-600 focus:bg-[#333]'
                                placeholder='例如: /api/execute'
                              />
                            </Form.Item>

                            <Form.Item
                              label={
                                <span className='text-gray-300'>数据格式</span>
                              }
                              name='dataFormat'
                            >
                              <Select
                                className='bg-[#2a2a2a]'
                                popupClassName='bg-[#2a2a2a]'
                                options={[
                                  { value: 'json', label: 'JSON' },
                                  { value: 'xml', label: 'XML' },
                                  { value: 'form-data', label: 'Form Data' },
                                ]}
                              />
                            </Form.Item>

                            <Form.Item
                              label={
                                <span className='text-gray-300'>
                                  回调触发节点
                                </span>
                              }
                              name='callbackNodeId'
                              tooltip='执行完成后触发的后续节点'
                            >
                              <Select
                                className='bg-[#2a2a2a]'
                                popupClassName='bg-[#2a2a2a]'
                                options={allNodes
                                  .filter((n) => n.id !== selectedNode.id)
                                  .map((n) => ({
                                    value: n.id,
                                    label: n.data.label,
                                  }))}
                                placeholder='选择回调节点'
                                allowClear
                              />
                            </Form.Item>
                          </>
                        )}

                        {/* Classifier Node */}
                        {selectedNode.data.type === 'classifier' && (
                          <div className='mb-4 text-xs text-gray-400 px-2 py-1 bg-blue-900/20 border border-blue-900 rounded'>
                            分类器节点包含多个输出端口，用于将数据流分发到不同的处理路径。
                          </div>
                        )}

                        {/* Dynamic Parameters */}
                        <div className='mt-4'>
                          <div className='mb-2 text-xs text-gray-400'>
                            自定义参数
                          </div>
                          <Form.List name='customParams'>
                            {(fields, { add, remove }) => (
                              <>
                                {fields.map(({ key, name, ...restField }) => (
                                  <Space
                                    key={key}
                                    style={{ display: 'flex', marginBottom: 8 }}
                                    align='baseline'
                                  >
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'key']}
                                      rules={[
                                        { required: true, message: 'Key' },
                                      ]}
                                      noStyle
                                    >
                                      <Input
                                        placeholder='Key'
                                        className='bg-[#2a2a2a] text-gray-200 border-gray-600'
                                        style={{ width: 100 }}
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'value']}
                                      rules={[
                                        { required: true, message: 'Value' },
                                      ]}
                                      noStyle
                                    >
                                      <Input
                                        placeholder='Value'
                                        className='bg-[#2a2a2a] text-gray-200 border-gray-600'
                                        style={{ width: 100 }}
                                      />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                      onClick={() => remove(name)}
                                      className='text-red-400 hover:text-red-300'
                                    />
                                  </Space>
                                ))}
                                <Form.Item>
                                  <Button
                                    type='dashed'
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                    className='bg-transparent border-gray-600 text-gray-400 hover:text-blue-400 hover:border-blue-400'
                                  >
                                    添加参数
                                  </Button>
                                </Form.Item>
                              </>
                            )}
                          </Form.List>
                        </div>
                      </div>
                    </Form>
                  </div>
                </>
              ) : (
                <div className='flex h-full flex-col items-center justify-center text-gray-500'>
                  <div>请选择一个节点</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertiesPanel;
