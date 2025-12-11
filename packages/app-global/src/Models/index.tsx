import { GizmoHelper, GizmoViewport, Grid, Html, OrbitControls, SoftShadows, useProgress } from '@react-three/drei';
import { Canvas, MeshProps, useFrame, useThree } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { IconifyIcon } from 'ui';
import Radar2dPanel from './components/2dRadarPanel';
import RModelFbx from './components/r20';
import TabsPanel from './components/tabsPanel';

interface RightTriangularPrismProps extends MeshProps {
  width?: number; // 直角三角形一条直角边长度 (X 方向)
  height?: number; // 直角三角形另一条直角边长度 (Y 方向)
  depth?: number; // 拉伸深度 (Z 方向)
  color?: string | number;
}

function SceneHelpers() {
  return (
    <>
      <axesHelper args={[5]} />
    </>
  );
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
  const meshRef = useRef();
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
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.8,
    cellColor: '#808080',
    sectionSize: 2,
    sectionThickness: 1,
    sectionColor: '#808080',
    fadeDistance: 100,
    fadeStrength: 1,
  };

  const [panelWidth, setPanelWidth] = useState(300);
  const [isOpen, setIsOpen] = useState(true); // true 表示面板打开

  return (
    <div className='w-full h-full relative flex gap-2 items-center'>
      <motion.div
        animate={{
          width: isOpen ? `calc(100% - ${panelWidth}px)` : '100%',
        }}
        transition={{ duration: 0.3 }}
        className='h-full shadow-inner overflow-auto relative'
      >
        <TabsPanel setPanelOpen={setIsOpen} />
        <Canvas
          shadows
          className='h-full w-full'
          gl={{ antialias: true }}
          camera={{ position: [2, 3, 2], fov: 50, near: 0.1, far: 1000 }}
          onCreated={({ scene }) => {
            scene.fog = new THREE.FogExp2('#cccccc', 0.02); // 更柔和的雾效
          }}
        >
          <color attach='background' args={['#2f2f2f']} />
          <Suspense fallback={<Html center>Loading...</Html>}>
            <ambientLight intensity={0.4} />
            {/* 主方向光 */}
            <directionalLight
              castShadow
              position={[0, 3, 0]}
              intensity={1}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={50}
              shadow-camera-left={-20}
              shadow-camera-right={20}
              shadow-camera-top={20}
              shadow-camera-bottom={-20}
            />

            {/* 补充光 */}
            <pointLight position={[-10, 10, -10]} intensity={0.5} />

            {/* 柔和的阴影 */}
            <SoftShadows size={25} samples={16} />

            <SceneHelpers />
            <Grid args={[100, 100]} {...gridConfig} />

            {/* <Forklift /> */}
            {/* <O15Model /> */}
            <CarModel />
            <CameraLimit />
            <OrbitControls enablePan enableRotate enableZoom />
            {/* 添加坐标参考 */}
            <GizmoHelper
              alignment='bottom-right' // 显示位置
              margin={[80, 80]} // 距离边缘的间距（可调）
            >
              <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='white' />
            </GizmoHelper>
          </Suspense>
        </Canvas>
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
        <Radar2dPanel />
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
    </div>
  );
}
