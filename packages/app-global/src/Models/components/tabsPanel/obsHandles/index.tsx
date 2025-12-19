import { Checkbox, Form, Input } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { useSafetyStore } from '../../../store/safity';

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const ObstacleHandles = () => {
  const { showStrategies, displayStrategies, setDisplayStrategies } = useSafetyStore(
    useShallow((state) => ({
      showStrategies: state.showStrategies,
      displayStrategies: state.displayStrategies,
      setDisplayStrategies: state.setDisplayStrategies,
    })),
  );
  return (
    <>
      <AnimatePresence>
        {showStrategies && (
          <motion.div
            key='strategy-panel'
            className='absolute top-8 right-0 z-10 bg-black/60  rounded-lg p-2 origin-top-right'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <Form
              name='basic'
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 24 }}
              initialValues={{ remember: true }}
              autoComplete='off'
            >
              <Form.Item name='remember' valuePropName='checked' label={null}>
                <Checkbox
                  checked={displayStrategies.includes('underForkProtection')}
                  onChange={(e) => {
                    setDisplayStrategies(
                      e.target.checked
                        ? [...displayStrategies, 'underForkProtection']
                        : displayStrategies.filter((item) => item !== 'underForkProtection'),
                    );
                  }}
                  className='text-xs'
                >
                  显示
                </Checkbox>
              </Form.Item>
              <Form.Item
                label='防护区域'
                name='protectionArea'
                rules={[{ required: true, message: '请输入防护区域！' }]}
              >
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
              <Form.Item
                label={'关联传感器'}
                name='deviceId2'
                rules={[{ required: true, message: '请选择关联传感器！' }]}
              >
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default ObstacleHandles;
