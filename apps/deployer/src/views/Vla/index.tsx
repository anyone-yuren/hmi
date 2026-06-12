import { Tag } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

// ==================== 枚举映射表 ====================

const TASK_TYPE_MAP: Record<number, { label: string; tag: string }> = {
  1: { label: '取货', tag: 'cyan' },
  2: { label: '放货', tag: 'orange' },
};

const TASK_STATE_MAP: Record<number, { label: string; tag: string }> = {
  0: { label: '未执行', tag: 'default' },
  1: { label: '执行中', tag: 'processing' },
  2: { label: '完成', tag: 'success' },
  3: { label: '取消', tag: 'warning' },
  4: { label: '失败', tag: 'error' },
};

const ACTION_TYPE_LABEL: Record<string, string> = {
  vision: '视觉识别',
  forkarm: '叉臂动作',
};

const VISION_SUB_MAP: Record<number, string> = {
  1: '取货姿态识别',
  2: '放货姿态识别',
  3: '取货货物状态检测',
  4: '放货空间检测',
  5: '取货挪车',
  6: '放货挪车',
};

const FORKARM_SUB_MAP: Record<number, string> = {
  1: '前移',
  2: '横移',
  3: '升降',
  4: '侧倾',
  5: '俯仰',
  6: '偏航',
  7: '叉间距',
  10: '横移+旋转',
};

const REALTIME_LABELS: Record<string, string> = {
  x: 'X 前移',
  y: 'Y 横移',
  z: 'Z 升降',
  euler_x: 'X 侧倾',
  euler_y: 'Y 俯仰',
  euler_z: 'Z 偏航',
  width: '叉间距',
};

const ANGLE_KEYS = new Set(['euler_x', 'euler_y', 'euler_z']);

// ==================== 数据类型 ====================

interface ProcessItem {
  timestamp: string;
  state: string;
}

interface RealtimeData {
  x?: number;
  y?: number;
  z?: number;
  euler_x?: number;
  euler_y?: number;
  euler_z?: number;
  width?: number;
}

interface ActionItem {
  timestamp: number;
  action_type: string;
  action_sub_type: number;
  action_value: number;
  action_point_id: number;
  action_state: number;
  process: ProcessItem[];
  realtime_data: RealtimeData;
}

interface TaskData {
  task_id: number;
  task_type: number;
  task_point_id: number;
  timestamp: number;
  pallet_name: string;
  task_state: number;
  actions: ActionItem[];
}

// ==================== 模拟数据 —— 严格按用户给定的数据格式 ====================

const MOCK_TASK: TaskData = {
  task_id: 123,
  task_type: 1,
  task_point_id: 10,
  timestamp: 1781247727,
  pallet_name: '托盘名称',
  task_state: 1,
  actions: [
    {
      timestamp: 1781247728,
      action_type: 'vision',
      action_sub_type: 1,
      action_value: 0,
      action_point_id: 9,
      action_state: 2,
      process: [
        { timestamp: '1781247729', state: '开始识别' },
        { timestamp: '1781247729', state: '识别成功' },
      ],
      realtime_data: {},
    },
    {
      timestamp: 1781247728,
      action_type: 'forkarm',
      action_sub_type: 1,
      action_value: 1000,
      action_point_id: 10,
      action_state: 1,
      process: [
        { timestamp: '1781247729', state: '开始动作' },
        { timestamp: '1781247729', state: '动作完成' },
      ],
      realtime_data: {
        x: 100,
        y: 0,
        z: 200,
        euler_x: 0,
        euler_y: 0,
        euler_z: 0,
        width: 0,
      },
    },
  ],
};

// ==================== 工具函数 ====================

function fmt(ts: number) {
  return dayjs.unix(ts).format('HH:mm:ss');
}

function actionSubLabel(a: ActionItem) {
  const m = a.action_type === 'vision' ? VISION_SUB_MAP : FORKARM_SUB_MAP;
  return m[a.action_sub_type] ?? `未知动作_${a.action_sub_type}`;
}

function actionTypeTheme(type: string) {
  if (type === 'vision') {
    return {
      tag: 'bg-gradient-to-r from-[#123a5a] to-[#185b86] text-[#7ddcff]',
      panel: 'from-[#0d2030] to-[#0a1621]',
      border: 'border-[#24577a]',
    };
  }

  return {
    tag: 'bg-gradient-to-r from-[#233618] to-[#355c26] text-[#bcf57b]',
    panel: 'from-[#172416] to-[#0d1712]',
    border: 'border-[#40633a]',
  };
}

// ==================== 子组件 ====================

/** 顶部任务栏 */
function TaskBar({ t }: { t: TaskData }) {
  const type = TASK_TYPE_MAP[t.task_type] ?? { label: '--', tag: 'default' };
  const state = TASK_STATE_MAP[t.task_state] ?? { label: '--', tag: 'default' };

  return (
    <div className='relative overflow-hidden rounded-[24px] border border-[#23435d] bg-gradient-to-r from-[#0c1722] via-[#112031] to-[#0c1621] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)]'>
      <div className='pointer-events-none absolute -left-12 top-0 h-36 w-36 rounded-full bg-[#00c2ff]/10 blur-3xl' />
      <div className='pointer-events-none absolute right-0 top-0 h-32 w-44 rounded-full bg-[#00d4aa]/10 blur-3xl' />

      <div className='relative flex items-start justify-between gap-4'>
        <div>
          <div className='text-[12px] tracking-[0.28em] text-[#627e9a]'>VLA 任务中枢</div>
          <div className='mt-2 flex items-center gap-3'>
            <span className='text-2xl font-semibold tracking-[0.04em] text-[#eef6ff]'>任务控制面板</span>
            <Tag color={type.tag} className='m-0'>
              {type.label}
            </Tag>
          </div>
        </div>

        <div className='rounded-2xl border border-[#22445d] bg-[#0b1520]/85 px-4 py-3'>
          <div className='flex items-center gap-2'>
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                t.task_state === 1 ? 'bg-[#00d4aa] shadow-[0_0_12px_#00d4aa] animate-pulse' : 'bg-[#4e6078]'
              }`}
            />
            <span className='text-[12px] tracking-[0.2em] text-[#627e9a]'>当前状态</span>
          </div>
          <div className='mt-2 text-right text-lg font-semibold text-[#e0e8f0]'>{state.label}</div>
        </div>
      </div>

      <div className='relative mt-5 grid grid-cols-5 gap-3'>
        <div className='rounded-2xl border border-[#223b52] bg-gradient-to-b from-[#101d2b] to-[#0b1520] px-4 py-3'>
          <div className='text-[12px] tracking-[0.18em] text-[#627e9a]'>任务编号</div>
          <div className='mt-2 text-xl font-semibold text-[#f3f8ff] font-mono'>#{t.task_id}</div>
        </div>
        <div className='rounded-2xl border border-[#223b52] bg-gradient-to-b from-[#0f2031] to-[#0b1520] px-4 py-3'>
          <div className='text-[12px] tracking-[0.18em] text-[#627e9a]'>目标点位</div>
          <div className='mt-2 text-xl font-semibold text-[#7ddcff] font-mono'>POINT_{t.task_point_id}</div>
        </div>
        <div className='rounded-2xl border border-[#223b52] bg-gradient-to-b from-[#101d2b] to-[#0b1520] px-4 py-3'>
          <div className='text-[12px] tracking-[0.18em] text-[#627e9a]'>任务时间</div>
          <div className='mt-2 text-xl font-semibold text-[#dbe8f7] font-mono'>{fmt(t.timestamp)}</div>
        </div>
        <div className='rounded-2xl border border-[#223b52] bg-gradient-to-b from-[#101d2b] to-[#0b1520] px-4 py-3'>
          <div className='text-[12px] tracking-[0.18em] text-[#627e9a]'>托盘名称</div>
          <div className='mt-2 truncate text-xl font-semibold text-[#dbe8f7]'>{t.pallet_name}</div>
        </div>
        <div className='rounded-2xl border border-[#223b52] bg-gradient-to-b from-[#0f1b27] to-[#0b1520] px-4 py-3'>
          <div className='text-[12px] tracking-[0.18em] text-[#627e9a]'>动作数量</div>
          <div className='mt-2 text-xl font-semibold text-[#9ce8bf] font-mono'>{t.actions.length}</div>
        </div>
      </div>
    </div>
  );
}

/** 左侧 action 卡片 */
function ActionCard({ a, idx, sel, onClick }: { a: ActionItem; idx: number; sel: boolean; onClick: () => void }) {
  const tone = actionTypeTheme(a.action_type);

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border select-none ${
        sel
          ? `bg-gradient-to-br ${tone.panel} ${tone.border} shadow-[0_0_18px_rgba(0,160,200,0.12)]`
          : 'bg-gradient-to-br from-[#111b28] to-[#0f1923] border-[#1a2d42] hover:border-[#234058] hover:from-[#15202f] hover:to-[#111e2c]'
      }`}
    >
      {/* 行1: 序号 + 类型标签 + 状态 */}
      <div className='flex items-center gap-2 mb-3'>
        <span className='text-[#3a5068] text-[12px] font-mono w-6'>0{idx + 1}</span>
        <span className={`text-[12px] px-2.5 py-1 rounded font-mono font-semibold ${tone.tag}`}>
          {ACTION_TYPE_LABEL[a.action_type] ?? a.action_type}
        </span>
        <span className='text-[#4e6078] text-[12px] ml-auto font-mono'>{fmt(a.timestamp)}</span>
      </div>

      {/* 行2: 子类型 + 状态点 */}
      <div className='flex items-center gap-2 mb-2'>
        <div
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            a.action_state === 1
              ? 'bg-[#00d4aa] animate-pulse'
              : a.action_state === 2
                ? 'bg-[#00d4aa]'
                : a.action_state === 4
                  ? 'bg-[#ff5c5c]'
                  : 'bg-[#4e6078]'
          }`}
        />
        <span className='text-[#bcc8d6] text-base'>{actionSubLabel(a)}</span>
      </div>

      {/* 数值 */}
      {a.action_type === 'forkarm' && a.action_value > 0 && (
        <div className='text-right'>
          <span className='text-[#00d4aa] text-sm font-mono font-semibold'>{a.action_value}</span>
          <span className='text-[#4e6078] text-[12px] ml-1'>mm</span>
        </div>
      )}
    </div>
  );
}

function ActionOverview({ a }: { a: ActionItem }) {
  const tone = actionTypeTheme(a.action_type);
  const state = TASK_STATE_MAP[a.action_state] ?? { label: '--', tag: 'default' };

  return (
    <div className='relative overflow-hidden rounded-[22px] border border-[#23425b] bg-gradient-to-r from-[#0d1824] via-[#112031] to-[#0c1722] px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.22)]'>
      <div className='pointer-events-none absolute right-0 top-0 h-24 w-32 rounded-full bg-[#00c2ff]/10 blur-3xl' />
      <div className='relative flex items-center gap-3'>
        <div className={`rounded-2xl border px-4 py-3 ${tone.border} bg-gradient-to-br ${tone.panel}`}>
          <div className='text-[12px] tracking-[0.2em] text-[#627e9a]'>当前动作</div>
          <div className='mt-1 text-base font-semibold text-[#eef6ff]'>{actionSubLabel(a)}</div>
        </div>

        <div className='rounded-2xl border border-[#22384d] bg-[#0a1520]/80 px-4 py-3'>
          <div className='text-[12px] tracking-[0.2em] text-[#627e9a]'>动作类型</div>
          <div className='mt-1 text-base text-[#dbe8f7]'>{ACTION_TYPE_LABEL[a.action_type] ?? a.action_type}</div>
        </div>

        <div className='rounded-2xl border border-[#22384d] bg-[#0a1520]/80 px-4 py-3'>
          <div className='text-[12px] tracking-[0.2em] text-[#627e9a]'>动作点位</div>
          <div className='mt-1 font-mono text-base text-[#7ddcff]'>#{a.action_point_id}</div>
        </div>

        <div className='rounded-2xl border border-[#22384d] bg-[#0a1520]/80 px-4 py-3'>
          <div className='text-[12px] tracking-[0.2em] text-[#627e9a]'>动作值</div>
          <div className='mt-1 font-mono text-base text-[#9ce8bf]'>{a.action_value}</div>
        </div>

        <div className='ml-auto rounded-2xl border border-[#22445d] bg-[#0a1520]/85 px-4 py-3'>
          <div className='flex items-center gap-2'>
            <div
              className={`h-2 w-2 rounded-full ${
                a.action_state === 1
                  ? 'bg-[#00d4aa] shadow-[0_0_12px_#00d4aa] animate-pulse'
                  : a.action_state === 2
                    ? 'bg-[#7ce8c4]'
                    : 'bg-[#4e6078]'
              }`}
            />
            <span className='text-[12px] tracking-[0.2em] text-[#627e9a]'>执行状态</span>
          </div>
          <div className='mt-1 text-right text-base font-medium text-[#e0e8f0]'>{state.label}</div>
        </div>
      </div>
    </div>
  );
}

/** 实时参数 */
function RealtimePanel({ a }: { a: ActionItem }) {
  const entries = (Object.entries(a.realtime_data) as [string, number][]).filter(
    ([, v]) => v !== undefined && v !== null,
  );

  return (
    <div className='flex-1 bg-gradient-to-b from-[#111d2b] to-[#0e1722] border border-[#1a2d42] rounded-xl p-5 flex flex-col min-h-0 overflow-auto'>
      <div className='flex items-center gap-2 mb-4'>
        <div className='w-1 h-4 rounded bg-gradient-to-b from-[#007799] to-[#00b4d8]' />
        <span className='text-[#7a8fa8] text-[13px] tracking-wider'>实时数据</span>
      </div>

      {entries.length === 0 ? (
        <div className='flex-1 flex items-center justify-center text-[#3a5068] text-base'>-- 无参数 --</div>
      ) : (
        <div className='grid grid-cols-2 gap-2'>
          {entries.map(([key, val]) => (
            <div
              key={key}
              className='flex items-center justify-between px-3 py-2.5 rounded-lg bg-gradient-to-r from-[#0b1420] to-[#0f1926] border border-[#162535]'
            >
              <span className='text-[#5a7088] text-[13px]'>{REALTIME_LABELS[key] ?? key}</span>
              <span className='text-[#00d4aa] text-base font-mono font-semibold'>
                {val}
                <span className='text-[#3a5068] text-[12px] ml-0.5'>{ANGLE_KEYS.has(key) ? '°' : 'mm'}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** 执行日志 */
function ProcessLogPanel({ a }: { a: ActionItem }) {
  const logs = a.process ?? [];
  const isAiAnalyzing = a.action_type === 'vision' || a.action_state === 1;

  return (
    <div className='flex-1 bg-gradient-to-b from-[#111d2b] to-[#0e1722] border border-[#1a2d42] rounded-xl p-5 flex flex-col min-h-0 overflow-auto'>
      <div className='mb-4 rounded-2xl border border-[#1a3144] bg-gradient-to-r from-[#0b1722] via-[#0d1b28] to-[#0f1c25] px-4 py-3'>
        <div className='flex items-center gap-2'>
          <div className='w-1 h-4 rounded bg-gradient-to-b from-[#00d4aa] to-[#00a080]' />
          <span className='text-[#7a8fa8] text-[13px] tracking-wider'>执行日志</span>
          <span className='text-[#3a5068] text-[12px] ml-auto font-mono'>{logs.length} 条</span>
        </div>

        <div className='mt-3 flex items-center gap-3 rounded-xl border border-[#18384a] bg-[#09131d]/80 px-3 py-2'>
          <div className='flex items-center gap-2 shrink-0'>
            <div className='relative h-3 w-10 overflow-hidden rounded-full bg-[#102432]'>
              <span
                className={`absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#00d4aa] shadow-[0_0_10px_#00d4aa] ${
                  isAiAnalyzing ? 'vla-ai-dot' : 'left-[calc(100%-0.5rem)]'
                }`}
              />
            </div>
            <span className='text-[14px] text-[#d7f6ea]'>{isAiAnalyzing ? 'AI 实时分析中' : 'AI 分析已完成'}</span>
          </div>

          <div className='relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#102432]'>
            <div
              className={`absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-[#00d4aa] to-transparent ${
                isAiAnalyzing ? 'vla-ai-scan' : 'opacity-60 left-[66%]'
              }`}
            />
          </div>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className='flex-1 flex items-center justify-center text-[#3a5068] text-base'>-- 暂无日志 --</div>
      ) : (
        <div className='flex flex-col gap-0'>
          {logs.map((item, i) => (
            <div key={i} className='flex items-start gap-3 py-2 border-b border-[#162535] last:border-b-0'>
              <span className='text-[#4e6078] text-[13px] font-mono shrink-0 leading-6'>
                {fmt(Number(item.timestamp))}
              </span>
              <div className='flex items-center gap-2'>
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    i === logs.length - 1 ? 'bg-[#00d4aa]' : 'bg-[#2a4a60]'
                  }`}
                />
                <span className='text-[#bcc8d6] text-base'>{item.state}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== 主组件 ====================

const Vla = () => {
  const [idx, setIdx] = useState(0);
  const task = MOCK_TASK;
  const cur = task.actions[idx] ?? task.actions[0];

  return (
    <div
      className='relative h-full w-full overflow-hidden p-5 font-sans text-white'
      style={{
        backgroundColor: '#06101a',
        backgroundImage:
          'radial-gradient(circle at 12% 18%, rgba(0,174,255,0.16), transparent 24%), radial-gradient(circle at 86% 14%, rgba(0,212,170,0.14), transparent 22%), linear-gradient(135deg, #06101a 0%, #091521 38%, #0b1622 100%), repeating-linear-gradient(0deg, rgba(90,120,147,0.06) 0, rgba(90,120,147,0.06) 1px, transparent 1px, transparent 34px), repeating-linear-gradient(90deg, rgba(90,120,147,0.045) 0, rgba(90,120,147,0.045) 1px, transparent 1px, transparent 34px)',
      }}
    >
      <div className='pointer-events-none absolute left-[8%] top-[12%] h-40 w-40 rounded-full bg-[#00c2ff]/8 blur-[90px]' />
      <div className='pointer-events-none absolute bottom-[12%] right-[10%] h-44 w-44 rounded-full bg-[#00d4aa]/8 blur-[100px]' />
      <style>{`
        @keyframes vla-ai-scan {
          0% { transform: translateX(-130%); }
          100% { transform: translateX(360%); }
        }
        @keyframes vla-ai-dot {
          0% { transform: translate(0, -50%); }
          50% { transform: translate(2rem, -50%); }
          100% { transform: translate(0, -50%); }
        }
        .vla-ai-scan {
          animation: vla-ai-scan 1.8s linear infinite;
        }
        .vla-ai-dot {
          animation: vla-ai-dot 1.6s ease-in-out infinite;
        }
      `}</style>

      <div className='relative flex h-full flex-col gap-4'>
        <TaskBar t={task} />

        <div className='flex min-h-0 flex-1 gap-4'>
          <div className='w-[300px] shrink-0 rounded-[22px] border border-[#223c53] bg-gradient-to-b from-[#0f1a27] via-[#0c1520] to-[#09121a] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.25)]'>
            <div className='mb-3 flex items-center gap-2 px-1 pb-2'>
              <div className='h-4 w-1 rounded bg-gradient-to-b from-[#00c2ff] to-[#00d4aa]' />
              <span className='text-[13px] tracking-[0.28em] text-[#7a8fa8]'>动作队列</span>
              <span className='ml-auto rounded-full border border-[#23455e] bg-[#0a1520] px-2.5 py-1 text-[12px] font-mono text-[#8fb8d8]'>
                {task.actions.length}
              </span>
            </div>

            <div className='flex h-[calc(100%-2rem)] flex-col gap-3 overflow-auto pr-1'>
              {task.actions.map((a, i) => (
                <ActionCard key={i} a={a} idx={i} sel={idx === i} onClick={() => setIdx(i)} />
              ))}
            </div>
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-4'>
            <ActionOverview a={cur} />
            <div className='flex min-h-0 flex-1 gap-4'>
              <RealtimePanel a={cur} />
              <ProcessLogPanel a={cur} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vla;
