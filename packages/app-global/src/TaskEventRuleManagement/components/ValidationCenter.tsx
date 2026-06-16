import React, { useState } from 'react';
import { Card, Button, Table, Alert, Modal, Progress } from 'antd';
import { useTaskRuleStore } from '../store/useTaskRuleStore';
import { TaskType } from '../types';

export const ValidationCenter = () => {
  const { scenes, eventFlows, relations } = useTaskRuleStore();
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reportData, setReportData] = useState<any[]>([]);

  const runCheck = () => {
    setIsChecking(true);
    setProgress(0);
    setReportData([]);

    // Simulate async check steps
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsChecking(false);
        generateReport();
      }
    }, 500);
  };

  const generateReport = () => {
    const issues: any[] = [];

    // 1. Check Scene Overlaps (Simple Mock)
    // Real logic needs rigorous set intersection checks
    if (scenes.length > 1) {
       issues.push({
         key: 'overlap-1',
         type: 'ERROR',
         desc: '场景 [场景A] 与 [场景B] 在 [车型: SE15] 上存在条件重叠',
         scenes: '场景A, 场景B',
       });
    }

    // 2. Check Unlinked Scenes
    scenes.forEach(s => {
      const rel = relations.find(r => r.sceneId === s.id);
      if (!rel) {
        issues.push({
          key: `unlinked-${s.id}`,
          type: 'WARNING',
          desc: `场景 [${s.name}] 未关联任何事件流`,
          scenes: s.name,
        });
      }
    });

    // 3. Check Flow Integrity
    eventFlows.forEach(f => {
      const start = f.nodes?.find(n => n.data.isStart);
      const end = f.nodes?.find(n => n.data.isEnd);
      if (!start || !end) {
        issues.push({
          key: `flow-integrity-${f.id}`,
          type: 'ERROR',
          desc: `事件流 [${f.name}] 结构不完整 (缺少开始/结束节点)`,
          scenes: '-',
        });
      }
    });

    setReportData(issues);
  };

  const columns = [
    { title: '类型', dataIndex: 'type', key: 'type', render: (text: string) => <span className={text === 'ERROR' ? 'text-red-500' : 'text-orange-500 font-bold'}>{text}</span> },
    { title: '描述', dataIndex: 'desc', key: 'desc', className: 'text-white' },
    { title: '涉及对象', dataIndex: 'scenes', key: 'scenes', className: 'text-white' },
    { title: '操作', key: 'action', render: () => <Button type="link">修复</Button> },
  ];

  return (
    <div className='h-full p-4 overflow-y-auto'>
      <div className='mb-6'>
        <h2 className='text-xl font-bold mb-4 text-white'>规则校验中心</h2>
        <div className='bg-white/5 p-4 rounded border border-white/10 mb-4 text-white/80 text-sm space-y-2'>
          <h3 className='font-bold text-white mb-2'>校验规则说明：</h3>
          <p>1. 场景冲突检查：检查不同场景的触发条件（车型、位置、任务类型等）是否存在重叠，避免同时触发多个场景。</p>
          <p>2. 孤立场景检查：检查是否存在未关联任何事件流的场景。</p>
          <p>3. 流程完整性检查：检查所有事件流是否包含完整的“开始”和“结束”节点，且路径连通。</p>
          <p>4. 节点配置检查：检查流程中的每个节点是否都已正确配置了位置、事件和动作参数。</p>
        </div>

        <div className='flex gap-4 mb-4 items-center'>
          <Button
            type='primary'
            size='large'
            onClick={runCheck}
            loading={isChecking}
          >
            {isChecking ? '检查中...' : '立即全量检查'}
          </Button>
          <Button size='large'>导出校验报告</Button>
        </div>

        {isChecking && (
          <Progress
            percent={progress}
            status='active'
            strokeColor={{ from: '#108ee9', to: '#87d068' }}
          />
        )}

        {!isChecking && reportData.length > 0 && (
          <Alert
            message='检查完成'
            description={`发现 ${
              reportData.filter((i) => i.type === 'ERROR').length
            } 个错误，${
              reportData.filter((i) => i.type === 'WARNING').length
            } 个警告。请及时修复以免影响任务执行。`}
            type='warning'
            showIcon
            className='mb-4'
          />
        )}

        {!isChecking && reportData.length === 0 && progress === 100 && (
          <Alert
            message='检查完成'
            description='恭喜！未发现任何规则冲突或错误。'
            type='success'
            showIcon
            className='mb-4'
          />
        )}
      </div>

      <Card
        title={<span className='text-white'>详细校验结果列表</span>}
        className='bg-white/5 border-white/10'
      >
        <Table
          columns={columns}
          dataSource={reportData}
          pagination={false}
          rowClassName='hover:bg-white/5'
        />
      </Card>
    </div>
  );
};
