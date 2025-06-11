import { useLoader } from '@react-three/fiber';
import React, { memo, useEffect, useState } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { getScalingOfModelGroupTargetSize } from '../utils';

import type { FC } from 'react';
import type * as THREE from 'three';

interface IDeviceItemProps {
  modelPaths: string[];
  size: { width: number; height: number; depth: number };
  onClick?: (id: number) => void;
}

const DeviceItem: FC<IDeviceItemProps> = (props) => {
  const { modelPaths, size } = props;
  const models = useLoader(FBXLoader, modelPaths);

  const [groupScale, setGroupScale] = useState<THREE.Vector3>();

  // 计算导入的模型组的BoundingBoxSize
  useEffect(() => {
    const scale = getScalingOfModelGroupTargetSize(models, size);
    setGroupScale(scale);

    models.forEach((model) => {
      model.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    });
  }, [models]);
  return (
    <group scale={groupScale} onClick={() => {}}>
      {models.map((model) => (
        <primitive key={model.uuid} object={model.clone()} />
      ))}
    </group>
  );
};

export default memo(DeviceItem);
