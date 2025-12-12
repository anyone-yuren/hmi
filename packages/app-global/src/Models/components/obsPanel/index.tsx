import { SearchOutlined } from '@ant-design/icons';
import { Affix, Checkbox, Collapse, Divider, Dropdown, Form, Input, Tooltip } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useSafetyStore } from '../../store/safity';

const ObsPanel = () => {
  const { displayStrategies, setDisplayStrategies } = useSafetyStore(
    useShallow((state) => {
      return {
        displayStrategies: state.displayStrategies,
        setDisplayStrategies: state.setDisplayStrategies,
      };
    }),
  );
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const items = [
    {
      key: '1',
      label: (
        <div className='flex items-center justify-between'>
          叉臂下方防护策略
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
          ></Checkbox>
        </div>
      ),
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
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
    {
      key: '2',
      label: (
        <div className='flex items-center justify-between'>
          取货牙尖防护策略
          <Checkbox
            checked={displayStrategies.includes('pickupTipProtection')}
            onChange={(e) => {
              setDisplayStrategies(
                e.target.checked
                  ? [...displayStrategies, 'pickupTipProtection']
                  : displayStrategies.filter((item) => item !== 'pickupTipProtection'),
              );
            }}
            className='text-xs'
          ></Checkbox>
        </div>
      ),
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item name='remember' valuePropName='checked' label={null}>
            <Checkbox>是否启用</Checkbox>
          </Form.Item>
          <Form.Item
            label='距离任务点激活策略的距离'
            name='activationDistance'
            rules={[{ required: true, message: '请输入激活距离！' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='控制中心到保护区域的距离'
            name='protectionDistance'
            rules={[{ required: true, message: '请输入保护距离！' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='左叉尖防护区域'
            name='leftForkTipProtectionArea'
            rules={[{ required: true, message: '请输入防护区域！' }]}
          >
            <div className='flex gap-2'>
              <Form.Item
                name={['leftForkTipProtectionArea', 'x']}
                noStyle
                rules={[{ required: true, message: '请输入 X！' }]}
              >
                <Input size='small' placeholder='X' />
              </Form.Item>

              <Form.Item
                name={['leftForkTipProtectionArea', 'y']}
                noStyle
                rules={[{ required: true, message: '请输入 Y！' }]}
              >
                <Input size='small' placeholder='Y' />
              </Form.Item>

              <Form.Item
                name={['leftForkTipProtectionArea', 'z']}
                noStyle
                rules={[{ required: true, message: '请输入 Z！' }]}
              >
                <Input size='small' placeholder='Z' />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item
            label='右叉尖防护区域'
            name='rightForkTipProtectionArea'
            rules={[{ required: true, message: '请输入防护区域！' }]}
          >
            <div className='flex gap-2'>
              <Form.Item
                name={['rightForkTipProtectionArea', 'x']}
                noStyle
                rules={[{ required: true, message: '请输入 X！' }]}
              >
                <Input size='small' placeholder='X' />
              </Form.Item>

              <Form.Item
                name={['rightForkTipProtectionArea', 'y']}
                noStyle
                rules={[{ required: true, message: '请输入 Y！' }]}
              >
                <Input size='small' placeholder='Y' />
              </Form.Item>

              <Form.Item
                name={['rightForkTipProtectionArea', 'z']}
                noStyle
                rules={[{ required: true, message: '请输入 Z！' }]}
              >
                <Input size='small' placeholder='Z' />
              </Form.Item>
            </div>
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
    {
      key: '3',
      label: (
        <div className='flex items-center justify-between'>
          放货空间检测
          <Checkbox
            checked={displayStrategies.includes('dropSpaceDetection')}
            onChange={(e) => {
              setDisplayStrategies(
                e.target.checked
                  ? [...displayStrategies, 'dropSpaceDetection']
                  : displayStrategies.filter((item) => item !== 'dropSpaceDetection'),
              );
            }}
            className='text-xs'
          ></Checkbox>
        </div>
      ),
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
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
            label='激活策略的最小叉臂高度'
            name='minCrossArmHeight'
            rules={[{ required: true, message: '请输入最小叉臂高度！' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='激活策略距离目标的最小距离'
            name='minDistanceToTarget'
            rules={[{ required: true, message: '请输入最小距离目标！' }]}
          >
            <Input size='small' />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '4',
      label: (
        <div className='flex items-center justify-between'>
          顶部保护策略
          <Checkbox
            checked={displayStrategies.includes('topProtection')}
            onChange={(e) => {
              setDisplayStrategies(
                e.target.checked
                  ? [...displayStrategies, 'topProtection']
                  : displayStrategies.filter((item) => item !== 'topProtection'),
              );
            }}
            className='text-xs'
          ></Checkbox>
        </div>
      ),
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item name='remember' valuePropName='checked' label={null}>
            <Checkbox>是否启用</Checkbox>
          </Form.Item>
          <Form.Item
            label='空载防护区域'
            name='verticalStartAngle'
            rules={[{ required: true, message: 'Please input your verticalStartAngle!' }]}
          >
            <div className='flex gap-2'>
              <Form.Item name={['verticalStartAngle', 'x']} noStyle rules={[{ required: true, message: '请输入 X！' }]}>
                <Input size='small' placeholder='X' />
              </Form.Item>

              <Form.Item name={['verticalStartAngle', 'y']} noStyle rules={[{ required: true, message: '请输入 Y！' }]}>
                <Input size='small' placeholder='Y' />
              </Form.Item>

              <Form.Item name={['verticalStartAngle', 'z']} noStyle rules={[{ required: true, message: '请输入 Z！' }]}>
                <Input size='small' placeholder='Z' />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item
            label='负载防护区域'
            name='loadProtectionArea'
            rules={[{ required: true, message: 'Please input your loadProtectionArea!' }]}
          >
            <div className='flex gap-2'>
              <Form.Item name={['loadProtectionArea', 'x']} noStyle rules={[{ required: true, message: '请输入 X！' }]}>
                <Input size='small' placeholder='X' />
              </Form.Item>
              <Form.Item name={['loadProtectionArea', 'y']} noStyle rules={[{ required: true, message: '请输入 Y！' }]}>
                <Input size='small' placeholder='Y' />
              </Form.Item>

              <Form.Item name={['loadProtectionArea', 'z']} noStyle rules={[{ required: true, message: '请输入 Z！' }]}>
                <Input size='small' placeholder='Z' />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item
            label={'关联传感器'}
            name='deviceId'
            rules={[{ required: true, message: 'Please input your deviceId!' }]}
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
      ),
    },
  ];
  const paramsItems = [
    {
      key: '1',
      label: <div className='flex items-center justify-between'>常规属性</div>,
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
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
        </Form>
      ),
    },
    {
      key: '2',
      label: <div className='flex items-center justify-between'>停止区域</div>,
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item
            label='距离任务点激活策略的距离'
            name='activationDistance'
            rules={[{ required: true, message: '请输入激活距离！' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='控制中心到保护区域的距离'
            name='protectionDistance'
            rules={[{ required: true, message: '请输入保护距离！' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='左叉尖防护区域'
            name='leftForkTipProtectionArea'
            rules={[{ required: true, message: '请输入防护区域！' }]}
          >
            <div className='flex gap-2'>
              <Form.Item
                name={['leftForkTipProtectionArea', 'x']}
                noStyle
                rules={[{ required: true, message: '请输入 X！' }]}
              >
                <Input size='small' placeholder='X' />
              </Form.Item>

              <Form.Item
                name={['leftForkTipProtectionArea', 'y']}
                noStyle
                rules={[{ required: true, message: '请输入 Y！' }]}
              >
                <Input size='small' placeholder='Y' />
              </Form.Item>

              <Form.Item
                name={['leftForkTipProtectionArea', 'z']}
                noStyle
                rules={[{ required: true, message: '请输入 Z！' }]}
              >
                <Input size='small' placeholder='Z' />
              </Form.Item>
            </div>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '3',
      label: <div className='flex items-center justify-between'>关联传感器</div>,
      children: (
        <Form
          name='basic'
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item name='deviceId' rules={[{ required: true, message: 'Please input your deviceId!' }]}>
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
    {
      key: '4',
      label: <div className='flex items-center justify-between'>关联IO</div>,
      children: (
        <Form
          name='basic'
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item name='deviceId' rules={[{ required: true, message: 'Please input your deviceId!' }]}>
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
      <div className='bg-white/5 rounded-sm p-2'>
        <p className='text-xs font-medium flex items-center gap-2 justify-between'>
          <span>
            <IconifyIcon icon='subway:folder-2' size={14} /> 避障方案列表
          </span>
          <IconifyIcon icon='material-symbols:check-box-rounded' size={14} />
        </p>
        <Dropdown
          menu={{
            items: [
              {
                label: (
                  <div className='flex items-center justify-between'>
                    复制
                    <span className='text-xs font-medium text-gray-400 flex items-center gap-1'>
                      <IconifyIcon icon='mingcute:command-line' size={12} />c
                    </span>
                  </div>
                ),
                key: 'copy',
              },
              { label: <span>删除</span>, key: 'delete' },
              { label: <span>选择</span>, key: 'add' },
            ],
          }}
          trigger={['contextMenu']}
        >
          <ul className='flex flex-col gap-2 text-xs py-2'>
            {new Array(4)
              .fill(0)
              .map((_, index) => ({
                label: `避障方案${index + 1}`,
                key: `obstacleAvoidance${index + 1}`,
                isSelected: index % 2 === 0,
              }))
              .map((item, index) => {
                return (
                  <li
                    className={classNames(
                      'cursor-pointer hover:bg-cyan-500/30 px-2 py-0.5 flex items-center justify-between',
                      {
                        'bg-white/5': index % 2 === 0,
                        'text-gray-400': !item.isSelected,
                        'bg-[#00d1d1]/80 !text-black': index === 1,
                      },
                    )}
                    key={item.key}
                  >
                    {item.label}
                    <span className='flex items-center gap-1'>
                      <Tooltip title='关闭/激活'>
                        <IconifyIcon
                          icon={
                            item.isSelected
                              ? 'material-symbols:check-box-rounded'
                              : 'material-symbols:check-box-outline-sharp'
                          }
                          size={14}
                        />
                      </Tooltip>
                    </span>
                  </li>
                );
              })}
          </ul>
        </Dropdown>
      </div>
      <div className='flex-1 bg-white/5 rounded-sm flex flex-col gap-2 p-2 overflow-auto' ref={setContainer}>
        {/* 属性搜索框 */}
        <Affix target={() => container} offsetTop={0}>
          <div className='flex items-center justify-center bg-neutral-800 rounded-sm p-1'>
            <Input size='small' placeholder='' className='w-1/2' prefix={<SearchOutlined />} />
          </div>
        </Affix>
        <div className='flex flex-col gap-2'>
          <Divider orientation='left' orientationMargin='0' className='text-xs !my-0'>
            避障方案参数
          </Divider>
          <Collapse items={paramsItems} defaultActiveKey={['1', '2', '3', '4']} />
          <Divider orientation='left' orientationMargin='0' className='text-xs !my-0'>
            避障策略参数
          </Divider>
          <Collapse items={items} defaultActiveKey={['1', '2', '3', '4']} />
        </div>
      </div>
    </>
  );
};
export default ObsPanel;
