import { Html, useProgress } from '@react-three/drei';
import { Canvas, MeshProps, useFrame, useThree } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import ScanLoading from '../toolkit/components/ScanLoading';
import OffsetTableScene from './components/OffsetTable';
import OffsetTableUI from './components/OffsetTable/OffsetTableUI';
import DrawHandle from './components/modelHandle';
import RModelFbx from './components/r20';
import RightPanel from './components/rightPanel';
import TabsPanel from './components/tabsPanel';
import { useModelStore } from './store';
import ContextMenu from './threeComponent/ContextMenu';
import PanelRoot from './threeComponent/PanelRoot';
import { SceneRaycaster } from './threeComponent/SceneRaycaster';
import BaseElement from './threeComponent/base';
import VisionFlow from './visionFlow';
import { useVisionFlowStore } from './visionFlow/store/visionFlowStore';

// ⭐ 增量导入我们新写的隔离控制层
import { SensorFilterDrawer } from './components/SensorFilterDrawer';
import { useEditorStore } from './store/editorStore';
import { FilterStrategy, SensorItem } from './types/sensor';

interface RightTriangularPrismProps extends MeshProps {
  width?: number; // 直角三角形一条直角边长度 (X 方向)
  height?: number; // 直角三角形另一条直角边长度 (Y 方向)
  depth?: number; // 拉伸深度 (Z 方向)
  color?: string | number;
}

function CameraLimit() {
  const { camera } = useThree();

  useFrame(() => {
    // 限制相机最高高度为 50
    if (camera.position.y > 50) {
      camera.position.y = 50;
    }
  });

  return null;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '20px',
          borderRadius: '10px',
          color: 'white',
          fontSize: '14px',
          minWidth: '120px',
          textAlign: 'center',
        }}
      >
        <div>加载中...</div>
        <div>{Math.round(progress)}%</div>
        <div
          style={{
            marginTop: '10px',
            height: '4px',
            background: '#333',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              background: '#1890ff',
              width: `${progress}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>
    </Html>
  );
}

// 模型加载状态管理
function ModelLoader({ modelType }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(0);

    // 模拟加载进度
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [modelType]);

  if (loading) {
    return (
      <Html center>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '20px',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            minWidth: '120px',
            textAlign: 'center',
          }}
        >
          <div>切换模型中...</div>
          <div>{progress}%</div>
        </div>
      </Html>
    );
  }

  return null;
}

// 车辆模型组件
function CarModel() {
  const meshRef = useRef<THREE.Group>(null);
  return (
    // <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
    <group ref={meshRef} scale={0.05}>
      {/* 模型加载指示器 */}
      <ModelLoader modelType={'MW_R20S'} />

      <Suspense fallback={<Loader />}>
        <RModelFbx />
      </Suspense>
    </group>
    // </Float>
  );
}

export default function R3FBasicScene() {
  const [panelWidth, setPanelWidth] = useState(300);
  const [isOpen, setIsOpen] = useState(true); // true 表示面板打开
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true); // 控制底部面板是否展开

  // ==========================================
  // 🔥 新增：感知器件独立状态机，完全不会与老代码的数据流交叉污染
  // ==========================================
  const [sensorDrawerOpen, setSensorDrawerOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [targetSensorId, setTargetSensorId] = useState<string | null>(null);
  const [sensors, setSensors] = useState<SensorItem[]>([
    {
      id: 'lidar_front',
      name: '前激光雷达 (Front LiDAR)',
      type: 'lidar',
      showPointCloud: true,
      filters: [],
    },
    {
      id: 'lidar_rear',
      name: '后激光雷达 (Rear LiDAR)',
      type: 'lidar',
      showPointCloud: false,
      filters: [],
    },
    {
      id: 'camera_3d',
      name: '3D 视觉相机 (Tray Vision)',
      type: 'camera',
      showPointCloud: true,
      filters: [],
    },
  ]);

  // 点云显示开关切换
  const handleTogglePointCloud = (id: string, checked: boolean) => {
    setSensors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, showPointCloud: checked } : s)),
    );
    const setLayerVisible = useEditorStore.getState().setLayerVisible;
    if (typeof setLayerVisible === 'function') {
      setLayerVisible(id, checked);
    }
  };

  // 面板内直接新增策略（零弹窗，实时响应）
  const handleInlineAddStrategy = (
    sensorId: string,
    strategyValues: Omit<FilterStrategy, 'id'>,
  ) => {
    setSensors((prev) =>
      prev.map((s) => {
        if (s.id === sensorId) {
          const newFilter: FilterStrategy = {
            ...strategyValues,
            id: `filter_${Date.now()}`,
          };
          return { ...s, filters: [...s.filters, newFilter] };
        }
        return s;
      }),
    );

    // 这里可以直接将参数 push 给底层的 Three.js 点云过滤 Shader 或是计算矩阵进行实时清洗
  };

  // 面板内直接删除标定策略
  const handleInlineDeleteStrategy = (sensorId: string, filterId: string) => {
    setSensors((prev) =>
      prev.map((s) => {
        if (s.id === sensorId) {
          return {
            ...s,
            filters: s.filters.filter((f) => f.id !== filterId),
          };
        }
        return s;
      }),
    );
  };

  const { openVisionPanel } = useVisionFlowStore(
    useShallow((store) => {
      return {
        openVisionPanel: store.openVisionPanel,
      };
    }),
  );
  const { isOffsetTable } = useModelStore(
    useShallow((store) => {
      return {
        isOffsetTable: store.isOffsetTable,
      };
    }),
  );

  useEffect(() => {
    setIsOpen(!isOffsetTable);
  }, [isOffsetTable]);

  const panelBoundsRef = useRef<HTMLDivElement>(null);

  return (
    <div className='w-full h-full relative flex gap-2 '>
      <motion.div
        animate={{
          width: isOpen ? `calc(100% - ${panelWidth}px)` : '100%',
        }}
        transition={{ duration: 0.3 }}
        className=' shadow-inner overflow-auto relative flex flex-col gap-2'
      >
        <DrawHandle />
        <TabsPanel
          setPanelOpen={setIsOpen}
          onOpenSensorControl={() => setSensorDrawerOpen(true)}
        />
        <motion.div
          animate={{
            height: openVisionPanel ? `calc(100% - 300px)` : '100%', // 80px 是底部面板的高度
          }}
          transition={{ duration: 0.3 }}
          ref={panelBoundsRef}
        >
          <ScanLoading />
          <Canvas
            shadows
            className='flex-1'
            dpr={[1.5, 2]}
            gl={{ logarithmicDepthBuffer: true, antialias: true, alpha: true }}
            onCreated={({ scene }) => {
              scene.fog = new THREE.FogExp2('#cccccc', 0.02); // 更柔和的雾效
            }}
          >
            <color attach='background' args={['#2f2f2f']} />
            <Suspense fallback={<Html center>Loading...</Html>}>
              {/* <Forklift /> */}
              {/* <O15Model /> */}
              {isOffsetTable ? (
                <OffsetTableScene />
              ) : (
                <>
                  <CarModel />
                  <CameraLimit />
                  <SceneRaycaster />
                  <BaseElement />
                </>
              )}
            </Suspense>
          </Canvas>
          <ContextMenu /> {/* 完全独立 */}
          <PanelRoot boundsRef={panelBoundsRef} /> {/* ⭐ 只渲染一次 */}
          {isOffsetTable && <OffsetTableUI boundsRef={panelBoundsRef} />}
        </motion.div>
        <AnimatePresence>
          {openVisionPanel && (
            <motion.div
              initial={{ y: '100%' }} // 初始位置在屏幕底部
              animate={{ y: 0 }} // 展开时动画到顶部
              exit={{ y: '100%' }} // 收回时动画到底部
              transition={{ duration: 0.3 }}
              className=' bg-white/50 shadow-xl flex gap-2 flex-col p-2 h-[300px] relative'
            >
              <VisionFlow />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 右侧面板 */}
      <motion.div
        animate={{
          x: isOpen ? 0 : panelWidth, // ✨ 向右滑动隐藏
        }}
        transition={{ duration: 0.3 }}
        className='absolute top-0 right-0 h-full bg-white/10 shadow-xl flex gap-2 flex-col p-2'
        style={{
          width: panelWidth,
        }}
      >
        <RightPanel />
      </motion.div>

      {/* 右侧折叠按钮 */}
      <span
        onClick={() => setIsOpen(!isOpen)}
        className='absolute top-1/2 z-20 -translate-y-1/2 shadow-lg flex items-center justify-center transition-all duration-300'
        style={{
          right: isOpen ? panelWidth : 0,
        }}
      >
        <IconifyIcon icon='ep:arrow-left' size={18} />
      </span>

      {/* ==========================================
        🔥 增量挂载：在主 DOM 树最底部平行渲染抽屉与弹窗，对老功能完全零负荷
      ========================================== */}
      <SensorFilterDrawer
        open={sensorDrawerOpen}
        onClose={() => setSensorDrawerOpen(false)}
        sensors={sensors}
        onToggleVisible={handleTogglePointCloud}
        onAddStrategy={handleInlineAddStrategy}
        onDeleteStrategy={handleInlineDeleteStrategy}
      />

      {/* 底部面板动画 */}

      {/* 控制底部面板显示隐藏的按钮 */}
      {/* <span
        onClick={() => setBottomPanelOpen(!bottomPanelOpen)}
        className='absolute bottom-2 right-2 z-20 cursor-pointer text-white'
      >
        {bottomPanelOpen ? '收起面板' : '展开面板'}
      </span> */}
    </div>
  );
}
