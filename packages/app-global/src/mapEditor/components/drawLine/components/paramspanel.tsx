import { Checkbox, Collapse, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../../store';

const DrawLinesParamsPanel = () => {
  const [form] = Form.useForm();

  const { selectLineData } = useMapEditorStore(
    useShallow((state) => ({
      selectLineData: state.selectLineData,
    })),
  );

  /* ------------------- 同步选中线段数据 ------------------- */
  useEffect(() => {
    if (!selectLineData) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      points: selectLineData.points.map((p) => ({
        x: Number(p.x.toFixed(3)),
        y: Number(p.y.toFixed(3)),
      })),
      lineLength: Number(selectLineData.length.toFixed(3)),
      headingAngle: Number(((selectLineData.angle * 180) / Math.PI).toFixed(2)),
    });
  }, [selectLineData]);

  return (
    <div className='flex-1  rounded-sm p-2 overflow-auto'>
      <Form form={form} layout='horizontal' labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete='off'>
        <Collapse defaultActiveKey={['1', '2', '3']}>
          {/* ---------------- 通用属性 ---------------- */}
          <Collapse.Panel header='通用属性' key='1'>
            <Form.Item label='控制点'>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className='flex gap-2 mb-1'>
                  <Form.Item name={['points', index, 'x']} noStyle rules={[{ required: true }]}>
                    <Input size='small' placeholder='X' />
                  </Form.Item>

                  <Form.Item name={['points', index, 'y']} noStyle rules={[{ required: true }]}>
                    <Input size='small' placeholder='Y' />
                  </Form.Item>
                </div>
              ))}
            </Form.Item>
          </Collapse.Panel>

          {/* ---------------- 高级属性 ---------------- */}
          <Collapse.Panel header='高级属性' key='2'>
            <Form.Item label='线路编号' name='lineId' rules={[{ required: true, message: '请输入线路编号' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='起始点' name='startPoint' rules={[{ required: true, message: '请输入起始点' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='终止点' name='endPoint' rules={[{ required: true, message: '请输入终止点' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='进入角度' name='enterAngle' rules={[{ required: true, message: '请输入进入角度' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='离开角度' name='leaveAngle' rules={[{ required: true, message: '请输入离开角度' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='速度比例' name='speedRatio' rules={[{ required: true, message: '请输入速度比例' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='速度' name='speed' rules={[{ required: true, message: '请输入速度' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='线路长度' name='lineLength' rules={[{ required: true, message: '请输入线路长度' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='起始比例' name='startRatio' rules={[{ required: true, message: '请输入起始比例' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='终止比例' name='endRatio' rules={[{ required: true, message: '请输入终止比例' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='方向' name='direction' rules={[{ required: true, message: '请选择方向' }]}>
              <Select
                size='small'
                options={[
                  { label: '顺时针', value: 'clockwise' },
                  { label: '逆时针', value: 'counterclockwise' },
                  { label: '优弧', value: 'optimalArc' },
                ]}
              />
            </Form.Item>
            <Form.Item label='航向角' name='headingAngle' rules={[{ required: true, message: '请输入航向角' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='附加权重' name='additionalWeight' rules={[{ required: true, message: '请输入附加权重' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item name='flexiblePath' valuePropName='checked' label={'柔性路径'}>
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name='autoOnline' valuePropName='checked' label={'自动上线'}>
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name='virtualFloorLine' valuePropName='checked' label={'楼层虚拟线'}>
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item
              label='左侧绕障距离'
              name='leftObstacleDistance'
              rules={[{ required: true, message: '请输入左侧绕障距离' }]}
            >
              <Input size='small' />
            </Form.Item>
            <Form.Item
              label='右侧绕障距离'
              name='rightObstacleDistance'
              rules={[{ required: true, message: '请输入右侧绕障距离' }]}
            >
              <Input size='small' />
            </Form.Item>
            <Form.Item label='逻辑值1' name='logicalValue1' rules={[{ required: true, message: '请输入逻辑值1' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='逻辑值2' name='logicalValue2' rules={[{ required: true, message: '请输入逻辑值2' }]}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='逻辑值3' name='logicalValue3' rules={[{ required: true, message: '请输入逻辑值3' }]}>
              <Input size='small' />
            </Form.Item>
          </Collapse.Panel>

          {/* ---------------- 额外属性 ---------------- */}
          <Collapse.Panel header='额外属性' key='3'>
            <Form.Item name='keepAmrDirection' valuePropName='checked' label={'保持AMR方向'}>
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name='shrinkObstacleAvoidanceRange' valuePropName='checked' label={'缩小避障范围'}>
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name='outboundLineGuidance' valuePropName='checked' label={'出库线盲导'}>
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name='enableHeadingAngle' valuePropName='checked' label={'启用航向角'}>
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name='enableVisualLineDetection' valuePropName='checked' label={'视觉检测线'}>
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name='allowUturn' valuePropName='checked' label={'允许掉头'}>
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name='disableObstacleAvoidance' valuePropName='checked' label={'关闭后避障'}>
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name='disableObstacleAvoidanceBefore' valuePropName='checked' label={'关闭前避障'}>
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name='disableCrossArmTakeoffLand' valuePropName='checked' label={'禁止叉臂起降'}>
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name='continuousIssueRoute' valuePropName='checked' label={'连续下发路线'}>
              <Checkbox></Checkbox>
            </Form.Item>
          </Collapse.Panel>
        </Collapse>
      </Form>
    </div>
  );
};

export default DrawLinesParamsPanel;
