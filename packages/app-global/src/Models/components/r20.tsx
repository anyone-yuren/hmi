/*
R车模型组件
包含分段升降逻辑：fork-left → first-door → second-door
添加选中部件的发光效果
*/
import { animated, useSpring } from '@react-spring/three';
import { useFBX } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { BoxGeometry, MeshBasicMaterial } from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { useShallow } from 'zustand/react/shallow';
import { useModelStore } from '../store';
import { useSafetyStore } from '../store/safity';
import { useVisionFlowStore } from '../visionFlow/store/visionFlowStore';

const SCALE = 0.1;
// 升降阶段阈值（单位：毫米）
const FIRST_STAGE_MAX = 2200; // fork-left 最大升高2.5m
const SECOND_STAGE_MAX = 4400; // first-door 最大升高5m

// 创建材质副本，处理单个材质和材质数组
const createMaterialClone = (originalMaterial) => {
  if (!originalMaterial) return null;

  if (Array.isArray(originalMaterial)) {
    // 如果是材质数组，克隆数组中的每个材质
    return originalMaterial.map((mat) => mat.clone());
  } else {
    // 如果是单个材质，直接克隆
    return originalMaterial.clone();
  }
};

// 更新材质透明度，处理单个材质和材质数组
const updateMaterialOpacity = (material, opacity) => {
  if (!material) return;

  if (Array.isArray(material)) {
    // 如果是材质数组，更新数组中的每个材质
    material.forEach((mat) => {
      mat.transparent = opacity < 1;
      mat.opacity = opacity;
      mat.needsUpdate = true;
    });
  } else {
    // 如果是单个材质，直接更新
    material.transparent = opacity < 1;
    material.opacity = opacity;
    material.needsUpdate = true;
  }
};

// 添加发光材质创建函数
const createGlowMaterial = (originalMaterial, glowIntensity = 2) => {
  if (!originalMaterial) return null;

  const createGlowMat = (mat) => {
    const glowMat = mat.clone();

    // 增强自发光效果
    if (glowMat.emissive) {
      glowMat.emissive.set(0x00ff00); // 绿色发光
      glowMat.emissiveIntensity = glowIntensity;
    }

    // 提高材质亮度
    if (glowMat.color) {
      const originalColor = glowMat.color.clone();
      const brighterColor = originalColor.multiplyScalar(1.5);
      glowMat.color.copy(brighterColor);
    }

    glowMat.needsUpdate = true;
    return glowMat;
  };

  if (Array.isArray(originalMaterial)) {
    return originalMaterial.map(createGlowMat);
  } else {
    return createGlowMat(originalMaterial);
  }
};

// 货叉组件 - 第一阶段升降
const ForkLeft = forwardRef(({ forkMesh, forkHeight, children, isSelected, onClick, opacity }, ref) => {
  // 第一阶段：0-2.5m，货叉单独升高
  // const stage1Height = Math.min(forkHeight, FIRST_STAGE_MAX) * SCALE;

  const MIN_HEIGHT = 100; // mm
  const MAX_HEIGHT = forkHeight * SCALE;

  const { mode } = useModelStore(
    useShallow((state) => {
      return {
        mode: state.mode,
      };
    }),
  );
  const { displayStrategies, setSelectMeshName, selectMeshName } = useSafetyStore(
    useShallow((state) => {
      return {
        displayStrategies: state.displayStrategies,
        setSelectMeshName: state.setSelectMeshName,
        selectMeshName: state.selectMeshName,
      };
    }),
  );

  // 🟢 react-spring 动画
  // const { y } = useSpring({
  //   from: { y: MIN_HEIGHT, positionY: 50, scaleY: 1 },
  //   to: { y: MAX_HEIGHT, positionY: MAX_HEIGHT / 2, scaleY: 3 },
  //   config: {
  //     mass: 1,
  //     tension: 120,
  //     friction: 20,
  //     duration: 2000,
  //   },
  //   loop: { reverse: mode === 'obstacleAvoidance' }, // ✨ 上下往返循环
  // });

  // 创建材质副本
  const [clonedMaterial, setClonedMaterial] = useState(null);
  const meshRef = useRef();

  useEffect(() => {
    if (forkMesh && forkMesh.material) {
      const material = createMaterialClone(forkMesh.material);
      setClonedMaterial(material);
    }
  }, [forkMesh]);

  useEffect(() => {
    if (clonedMaterial) {
      updateMaterialOpacity(clonedMaterial, opacity);
    }
  }, [clonedMaterial, opacity]);

  const { scaleY, positionY, y } = useSpring({
    from: {
      scaleY: 1,
      y: MIN_HEIGHT,
      positionY: 50, // 初始位置补偿，使底部在原点
    },
    to: async (next) => {
      while (true) {
        // 向上拉伸到3倍
        await next({ scaleY: 1, positionY: 25, y: MAX_HEIGHT });
        // 恢复
        await next({ scaleY: 2, positionY: 50, y: MIN_HEIGHT });
      }
    },
    config: { mass: 1, tension: 120, friction: 20, duration: 2000 },
    loop: { reverse: mode === 'obstacleAvoidance' }, // ✨ 上下往返循环
  });

  if (!forkMesh || !clonedMaterial) return null;

  return (
    <>
      <animated.group position-y={y}>
        {mode === 'obstacleAvoidance' && displayStrategies.includes('dropSpaceDetection') ? (
          <>
            <mesh
              position={[-150, 0, 0]}
              geometry={new BoxGeometry(100, 10, 100)}
              material={new MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3 })}
            />
          </>
        ) : null}
        {/* 叉尖 */}
        {mode === 'obstacleAvoidance' && displayStrategies.includes('pickupTipProtection') ? (
          <>
            <mesh
              position={[-110, 5, 25]}
              geometry={new BoxGeometry(20, 1, 20)}
              material={
                new MeshBasicMaterial({
                  color: 0x00ffff,
                  transparent: true,
                  opacity: 0.3,
                  depthTest: false,
                  depthWrite: false,
                })
              }
            />
            <mesh
              position={[-110, 5, -25]}
              geometry={new BoxGeometry(20, 1, 20)}
              material={
                new MeshBasicMaterial({
                  color: 0x00ffff,
                  transparent: true,
                  opacity: 0.3,
                  depthTest: false,
                  depthWrite: false,
                })
              }
            />
          </>
        ) : null}

        <mesh
          ref={ref || meshRef}
          geometry={forkMesh.geometry}
          material={clonedMaterial}
          scale={forkMesh.scale}
          castShadow
          receiveShadow
          onClick={onClick}
        >
          {isSelected && (
            // 添加额外的发光层
            <mesh geometry={forkMesh.geometry} scale={1.02}>
              <meshBasicMaterial
                color={0x00ff00}
                transparent
                opacity={0.3}
                side={2} // 双面渲染
              />
            </mesh>
          )}
        </mesh>
        {children}
      </animated.group>
      {mode === 'obstacleAvoidance' && displayStrategies.includes('underForkProtection') ? (
        <>
          <animated.mesh
            position-y={positionY}
            scale-y={scaleY}
            position-x={-50}
            onClick={(e) => {
              setSelectMeshName(selectMeshName === 'underForkProtection' ? '' : 'underForkProtection');
            }}
          >
            <boxGeometry args={[100, 50, 100]} />
            <meshStandardMaterial color='hotpink' transparent opacity={0.3} />
          </animated.mesh>
        </>
      ) : null}
    </>
  );
});

// 第一门架组件 - 第二阶段升降
interface FirstDoorProps {
  doorMesh: any;
  forkHeight: number;
  children?: React.ReactNode;
  isSelected?: boolean;
  onClick?: (event: any) => void;
  opacity?: number;
}

const FirstDoor = forwardRef<any, FirstDoorProps>(
  ({ doorMesh, forkHeight, children, isSelected, onClick, opacity }, ref) => {
    // 第二阶段：2.5m-5m，第一门架开始升高
    const stage2Height =
      forkHeight > FIRST_STAGE_MAX ? Math.min(forkHeight - FIRST_STAGE_MAX, FIRST_STAGE_MAX) * SCALE : 0;

    // 创建材质副本
    const [clonedMaterial, setClonedMaterial] = useState(null);
    const meshRef = useRef();

    useEffect(() => {
      if (doorMesh && doorMesh.material) {
        const material = createMaterialClone(doorMesh.material);
        setClonedMaterial(material);
      }
    }, [doorMesh]);

    useEffect(() => {
      if (clonedMaterial) {
        updateMaterialOpacity(clonedMaterial, opacity);
      }
    }, [clonedMaterial, opacity]);

    if (!doorMesh || !clonedMaterial) return null;

    return (
      <group position={[0, stage2Height, 0]}>
        <mesh
          ref={ref || meshRef}
          geometry={doorMesh.geometry}
          material={clonedMaterial}
          scale={doorMesh.scale}
          castShadow
          receiveShadow
          onClick={onClick}
        >
          {isSelected && (
            <mesh geometry={doorMesh.geometry} scale={1.02}>
              <meshBasicMaterial color={0x00ff00} transparent opacity={0.3} side={2} />
            </mesh>
          )}
        </mesh>
        {children}
      </group>
    );
  },
);

// 第二门架组件 - 第三阶段升降
interface SecondDoorProps {
  doorMesh: any;
  forkHeight: number;
  children?: React.ReactNode;
  isSelected?: boolean;
  onClick?: React.MouseEventHandler;
  opacity?: number;
}

const SecondDoor = forwardRef<any, SecondDoorProps>(
  ({ doorMesh, forkHeight, children, isSelected, onClick, opacity }, ref) => {
    // 第三阶段：5m以上，第二门架开始升高
    const stage3Height = forkHeight > SECOND_STAGE_MAX ? (forkHeight - SECOND_STAGE_MAX) * SCALE : 0;

    // 创建材质副本
    const [clonedMaterial, setClonedMaterial] = useState(null);
    const meshRef = useRef();

    useEffect(() => {
      if (doorMesh && doorMesh.material) {
        const material = createMaterialClone(doorMesh.material);
        setClonedMaterial(material);
      }
    }, [doorMesh]);

    useEffect(() => {
      if (clonedMaterial) {
        updateMaterialOpacity(clonedMaterial, opacity);
      }
    }, [clonedMaterial, opacity]);

    if (!doorMesh || !clonedMaterial) return null;

    return (
      <group position={[0, stage3Height, 0]}>
        <mesh
          ref={ref || meshRef}
          geometry={doorMesh.geometry}
          material={clonedMaterial}
          scale={doorMesh.scale}
          castShadow
          receiveShadow
          onClick={onClick}
        >
          {isSelected && (
            <mesh geometry={doorMesh.geometry} scale={1.02}>
              <meshBasicMaterial color={0x00ff00} transparent opacity={0.3} side={2} />
            </mesh>
          )}
        </mesh>
        {children}
      </group>
    );
  },
);

// 立柱组件 - 固定不动
const BaseDoor = forwardRef(({ columnMesh, isSelected, onClick, opacity }, ref) => {
  // 创建材质副本
  const [clonedMaterial, setClonedMaterial] = useState(null);
  const meshRef = useRef();

  useEffect(() => {
    if (columnMesh && columnMesh.material) {
      const material = createMaterialClone(columnMesh.material);

      // 设置立柱的特殊颜色
      const updateMaterialColor = (mat) => {
        if (mat.color) mat.color.setHex(0xffffff);
        if (mat.specular) mat.specular.setHex(0x222222);
      };

      if (Array.isArray(material)) {
        material.forEach(updateMaterialColor);
      } else {
        updateMaterialColor(material);
      }

      setClonedMaterial(material);
    }
  }, [columnMesh]);

  useEffect(() => {
    if (clonedMaterial) {
      updateMaterialOpacity(clonedMaterial, opacity);
    }
  }, [clonedMaterial, opacity]);

  if (!columnMesh || !clonedMaterial) return null;

  return (
    <mesh
      ref={ref || meshRef}
      geometry={columnMesh.geometry}
      material={clonedMaterial}
      scale={columnMesh.scale}
      castShadow
      onClick={onClick}
    >
      {isSelected && (
        <mesh geometry={columnMesh.geometry} scale={1.02}>
          <meshBasicMaterial color={0x00ff00} transparent opacity={0.3} side={2} />
        </mesh>
      )}
    </mesh>
  );
});

// 车身组件 - 固定不动
const RBody = forwardRef(({ bodyMesh, isSelected, onClick, opacity }, ref) => {
  const { mode } = useModelStore(
    useShallow((state) => {
      return {
        mode: state.mode,
      };
    }),
  );
  const { displayStrategies } = useSafetyStore(
    useShallow((state) => {
      return {
        displayStrategies: state.displayStrategies,
      };
    }),
  );

  const { openVisionPanel, setOpenVisionPanel } = useVisionFlowStore(
    useShallow((store) => {
      return {
        openVisionPanel: store.openVisionPanel,
        setOpenVisionPanel: store.setOpenVisionPanel,
      };
    }),
  );
  // 创建材质副本
  const [clonedMaterial, setClonedMaterial] = useState(null);
  const meshRef = useRef();

  useEffect(() => {
    if (bodyMesh && bodyMesh.material) {
      const material = createMaterialClone(bodyMesh.material);
      // const glowMat = createGlowMaterial(bodyMesh.material);
      setClonedMaterial(material);
      // setGlowMaterial(glowMat);
    }
  }, [bodyMesh]);

  useEffect(() => {
    if (clonedMaterial) {
      updateMaterialOpacity(clonedMaterial, opacity);
    }
  }, [clonedMaterial, opacity]);

  if (!bodyMesh || !clonedMaterial) return null;
  return (
    <>
      {/* 顶部绘制一个发光的保护区域 */}
      {mode === 'obstacleAvoidance' && displayStrategies.includes('topProtection') ? (
        <>
          <mesh
            position={[-100, FIRST_STAGE_MAX * SCALE, 0]}
            geometry={new BoxGeometry(100, 10, 100)}
            material={new MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3 })}
          />

          <mesh
            position={[-100, FIRST_STAGE_MAX * SCALE - 100, 0]}
            geometry={new BoxGeometry(100, 10, 100)}
            material={new MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.3 })}
          />
        </>
      ) : null}

      <mesh
        ref={ref || meshRef}
        name='body'
        geometry={bodyMesh.geometry}
        material={clonedMaterial}
        scale={bodyMesh.scale}
        castShadow
        onClick={(e) => {
          // setOpenVisionPanel(!openVisionPanel);
          onClick && onClick(e);
        }}
      >
        {isSelected && (
          <mesh geometry={bodyMesh.geometry} scale={1.02}>
            <meshBasicMaterial color={0x00ff00} transparent opacity={0.3} side={2} />
          </mesh>
        )}
      </mesh>
    </>
  );
});

// 颜色漆面
const ColorMesh = forwardRef(({ colorMesh, isSelected, onClick, opacity }, ref) => {
  // 创建材质副本
  const [clonedMaterial, setClonedMaterial] = useState(null);
  const meshRef = useRef();

  useEffect(() => {
    if (colorMesh && colorMesh.material) {
      const material = createMaterialClone(colorMesh.material);
      const glowMat = createGlowMaterial(colorMesh.material);
      setClonedMaterial(material);
    }
  }, [colorMesh]);

  useEffect(() => {
    if (clonedMaterial) {
      updateMaterialOpacity(clonedMaterial, opacity);
    }
  }, [clonedMaterial, opacity]);

  if (!colorMesh || !clonedMaterial) return null;

  return (
    <mesh
      ref={ref || meshRef}
      geometry={colorMesh.geometry}
      material={clonedMaterial}
      scale={colorMesh.scale}
      castShadow
      receiveShadow
      onClick={onClick}
    >
      {isSelected && (
        <mesh geometry={colorMesh.geometry} scale={1.02}>
          <meshBasicMaterial color={0x00ff00} transparent opacity={0.3} side={2} />
        </mesh>
      )}
    </mesh>
  );
});

const RadarMesh = forwardRef(({ radarMesh, isSelected, onClick, opacity }, ref) => {
  // 创建材质副本
  const [clonedMaterial, setClonedMaterial] = useState(null);
  const meshRef = useRef();

  useEffect(() => {
    if (radarMesh && radarMesh.material) {
      const material = createMaterialClone(radarMesh.material);
      setClonedMaterial(material);
    }
  }, [radarMesh]);

  useEffect(() => {
    if (clonedMaterial) {
      updateMaterialOpacity(clonedMaterial, opacity);
    }
  }, [clonedMaterial, opacity]);

  if (!radarMesh || !clonedMaterial) return null;

  return (
    <mesh
      ref={ref || meshRef}
      geometry={radarMesh.geometry}
      material={clonedMaterial}
      scale={radarMesh.scale}
      castShadow
      receiveShadow
      onClick={onClick}
      name='radar'
    >
      {isSelected && (
        <mesh geometry={radarMesh.geometry} scale={1}>
          <meshBasicMaterial color={0x00ff00} transparent opacity={0.3} side={2} />
        </mesh>
      )}
    </mesh>
  );
});

const CameraMesh = forwardRef(({ cameraMesh, isSelected, onClick, opacity }, ref) => {
  // 创建材质副本
  const [clonedMaterial, setClonedMaterial] = useState(null);
  const meshRef = useRef();

  useEffect(() => {
    if (cameraMesh && cameraMesh.material) {
      const material = createMaterialClone(cameraMesh.material);
      setClonedMaterial(material);
    }
  }, [cameraMesh]);

  useEffect(() => {
    if (clonedMaterial) {
      updateMaterialOpacity(clonedMaterial, opacity);
    }
  }, [clonedMaterial, opacity]);

  if (!cameraMesh || !clonedMaterial) return null;

  return (
    <mesh
      ref={ref || meshRef}
      geometry={cameraMesh.geometry}
      material={clonedMaterial}
      scale={cameraMesh.scale}
      castShadow
      receiveShadow
      onClick={onClick}
      name={cameraMesh.name ?? 'camera'}
    >
      {isSelected && (
        <mesh geometry={cameraMesh.geometry} scale={1}>
          <meshBasicMaterial color={0x00ff00} transparent opacity={0.3} side={2} />
        </mesh>
      )}
    </mesh>
  );
});

export default function RModelFbx(props) {
  const { isHasGoods, forkHeight = 500 } = props;
  const [bodyMesh, setBodyMesh] = useState(null);
  const [forkLeftMesh, setForkLeftMesh] = useState(null);
  const [firstDoorMesh, setFirstDoorMesh] = useState(null);
  const [secondDoorMesh, setSecondDoorMesh] = useState(null);
  const [colorMesh, setColorMesh] = useState(null);
  const [baseDoorMesh, setBaseDoorMesh] = useState(null);
  const [radarMesh, setRadarMesh] = useState(null);
  const [camera1Mesh, setCamera1Mesh] = useState(null);
  const [camera2Mesh, setCamera2Mesh] = useState(null);
  const { camera, controls } = useThree();
  // 选中状态管理
  const [selectedPart, setSelectedPart] = useState(null);
  // 区分生产环境和开发环境
  const isProd = process.env.NODE_ENV === 'production';
  const fbxPath = isProd ? '/toolkit/static/fbx/r15-15.fbx' : '/static/fbx/r15-15.fbx';
  const fbx = useFBX(fbxPath);
  const clonedFbx = useMemo(() => SkeletonUtils.clone(fbx), [fbx]);

  // 分离各个网格组件
  useEffect(() => {
    if (clonedFbx) {
      clonedFbx.children.forEach((child) => {
        if (child?.isMesh) {
          switch (child.name) {
            case 'fork-left':
              setForkLeftMesh(child);
              break;
            case 'first-door':
              setFirstDoorMesh(child);
              break;
            case 'second-door':
              setSecondDoorMesh(child);
              break;
            case 'body':
              setBodyMesh(child);
              break;
            case 'base-door':
              setBaseDoorMesh(child);
              break;
            case 'color-mesh':
              setColorMesh(child);
              break;
            case 'radar':
              setRadarMesh(child);
              break;
            case 'camera1':
              setCamera1Mesh(child);
              break;
            case 'camera2':
              setCamera2Mesh(child);
              break;
            default:
              // 其他未命名的mesh归为车身
              if (!bodyMesh) setBodyMesh(child);
              break;
          }
        }
      });
    }
  }, [clonedFbx, bodyMesh]);

  // 处理部件点击事件
  const handlePartClick = (partName, position, target) => (event) => {
    event.stopPropagation(); // 阻止事件冒泡
    setSelectedPart(selectedPart === partName ? null : partName);
    if (position) {
      controls?.setLookAt(...position, ...target, true);
    }
  };

  // 计算透明度：选中的部件不透明，其他部件半透明
  const getOpacity = (partName) => {
    if (!selectedPart) return 1; // 没有选中任何部件时，所有部件都不透明
    return selectedPart === partName ? 1 : 0.5;
  };

  return (
    <group rotation={[Math.PI, 0, 0 - Math.PI]} scale={0.1} position={[0, 0, 0]}>
      {/* 固定部件 */}
      <RBody
        bodyMesh={bodyMesh}
        isSelected={selectedPart === 'body'}
        onClick={handlePartClick('body')}
        opacity={getOpacity('body')}
      />
      <RadarMesh
        radarMesh={radarMesh}
        isSelected={selectedPart === 'radar'}
        onClick={handlePartClick('radar', [-0.6, 1.1, 0.5], [-0.6, 1.1, 0])}
        opacity={getOpacity('radar')}
      />
      <CameraMesh
        cameraMesh={camera1Mesh}
        isSelected={selectedPart === 'camera-1'}
        onClick={handlePartClick('camera-1', [-1, 0.15, 0.4], [0, 0.15, 0.4])}
        opacity={getOpacity('camera-1')}
      />
      <CameraMesh
        cameraMesh={camera2Mesh}
        isSelected={selectedPart === 'camera-2'}
        onClick={handlePartClick('camera-2', [-1, 0.15, -0.4], [0, 0.15, 0.4])}
        opacity={getOpacity('camera-2')}
      />
      <ColorMesh
        colorMesh={colorMesh}
        isSelected={selectedPart === 'color-mesh'}
        onClick={handlePartClick('color-mesh')}
        opacity={getOpacity('color-mesh')}
      />
      <BaseDoor
        columnMesh={baseDoorMesh}
        isSelected={selectedPart === 'base-door'}
        onClick={handlePartClick('base-door')}
        opacity={getOpacity('base-door')}
      />

      {/* 升降部件 - 按升降顺序嵌套 */}
      <SecondDoor
        doorMesh={secondDoorMesh}
        forkHeight={forkHeight}
        isSelected={selectedPart === 'second-door'}
        onClick={handlePartClick('second-door')}
        opacity={getOpacity('second-door')}
      >
        <FirstDoor
          doorMesh={firstDoorMesh}
          forkHeight={forkHeight}
          isSelected={selectedPart === 'first-door'}
          onClick={handlePartClick('first-door')}
          opacity={getOpacity('first-door')}
        >
          <ForkLeft
            forkMesh={forkLeftMesh}
            forkHeight={forkHeight}
            isSelected={selectedPart === 'fork-left'}
            onClick={handlePartClick('fork-left')}
            opacity={getOpacity('fork-left')}
          >
            {/* 商品模型 - 跟随货叉移动 */}
          </ForkLeft>
        </FirstDoor>
      </SecondDoor>
    </group>
  );
}
