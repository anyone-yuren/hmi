import { Checkbox, Collapse, Dropdown, Form, Input, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useSafetyStore } from '../../../store/safity';

const ObstacleHandles = () => {
  const { selectMeshName } = useSafetyStore(
    useShallow((state) => ({
      selectMeshName: state.selectMeshName,
    })),
  );
  const items = [
    {
      key: '1',
      label: '叉臂下方保护',
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 200 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item name='remember' valuePropName='checked' label={null}>
            <Checkbox>是否启用</Checkbox>
          </Form.Item>
          <Form.Item label='防护区域' name='protectionArea' rules={[{ required: true, message: '请输入防护区域！' }]}>
            <div className='flex gap-2'>
              <Form.Item name={['protectionArea', 'x']} noStyle rules={[{ required: true, message: '请输入 X！' }]}>
                <Input size='small' placeholder='X' />
              </Form.Item>

              <Form.Item name={['protectionArea', 'y']} noStyle rules={[{ required: true, message: '请输入 Y！' }]}>
                <Input size='small' placeholder='Y' />
              </Form.Item>

              <Form.Item name={['protectionArea', 'z']} noStyle rules={[{ required: true, message: '请输入 Z！' }]}>
                <Input size='small' placeholder='Z' />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item
            label='起始保护高度'
            name='startProtectionHeight'
            rules={[{ required: true, message: '请输入起始保护高度！' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='激活策略最小叉臂高度'
            name='minForkArmHeight'
            rules={[{ required: true, message: '请输入最小叉臂高度！' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='关闭策略的最小任务距离'
            name='minTaskDistance'
            rules={[{ required: true, message: '请输入最小任务距离！' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='屏蔽叉臂上表面距离空间'
            name='maskForkArmHeight'
            rules={[{ required: true, message: '请输入屏蔽叉臂上表面距离空间！' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item label={'关联传感器'} name='deviceId2' rules={[{ required: true, message: '请选择关联传感器！' }]}>
            <Checkbox.Group
              className='flex-col gap-2'
              options={[
                { label: '定位雷达', value: 'camera1' },
                { label: '左后雷达', value: 'camera2' },
                { label: '右前雷达', value: 'camera3' },
                { label: '后视觉雷达', value: 'camera4' },
              ]}
            />
          </Form.Item>
        </Form>
      ),
    },
  ];
  return (
    <>
      <motion.div
        className='absolute bottom-2 left-2 z-10 bg-black min-w-40 rounded-lg'
        initial={{ opacity: 0, y: 10 }}
        animate={selectMeshName ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        // 结束后设置隐藏
      >
        <Collapse items={items} defaultActiveKey={['1']} />
      </motion.div>
      <motion.div
        className='absolute top-20 right-2 z-10  rounded-lg'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        // 结束后设置隐藏
      >
        <div className='flex flex-col gap-2'>
          <div className='w-6 aspect-square flex items-center justify-center rounded-full bg-black/80'>
            <Tooltip title='同步到车辆' placement='left'>
              <IconifyIcon icon='fluent:cloud-sync-complete-20-filled' size={16} className='font-bold' />
            </Tooltip>
          </div>
          <Dropdown
            placement='bottomRight'
            menu={{
              items: [
                {
                  key: '1',
                  label: '导出到本地',
                  icon: <IconifyIcon icon='tdesign:file-export' size={16} />,
                },
                {
                  key: '2',
                  label: '导入',
                  icon: <IconifyIcon icon='tdesign:file-import' size={16} />,
                },
                {
                  key: '3',
                  label: '历史版本',
                  icon: <IconifyIcon icon='mingcute:history-line' size={16} />,
                },
              ],
            }}
            trigger={['click']}
          >
            <div className='w-6 aspect-square flex items-center justify-center rounded-full bg-black/80'>
              <Tooltip title='操作' placement='left'>
                <IconifyIcon icon='weui:setting-filled' size={16} className='font-bold' />
              </Tooltip>
            </div>
          </Dropdown>
        </div>
      </motion.div>
    </>
  );
};
export default ObstacleHandles;
