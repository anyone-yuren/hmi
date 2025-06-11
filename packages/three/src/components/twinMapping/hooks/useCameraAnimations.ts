import { useFrame, useThree } from '@react-three/fiber';
import * as TWEEN from '@tweenjs/tween.js';
import { equals, map } from 'ramda';
import { useEffect, useRef, useState } from 'react';
import { useRcsGlobalStore } from '@gbeata/store';
import { useShallow } from 'zustand/react/shallow';

import { convertToMeters } from '../utils';

import type { CameraControls } from '@react-three/drei';
import type * as THREE from 'three';

/**
 * 自定义hook, 用于封装相机动画逻辑
 * @param camera -THREE.Camera对象
 * @param cameraControlsRef -CameraControls的ref
 */

const useCameraAnimations = (camera?: THREE.Camera, cameraControlsRef?: React.RefObject<CameraControls>) => {
  const { vehicleList } = useRcsGlobalStore(
    useShallow((store) => {
      return {
        vehicleList: store.vehicleList,
      };
    }),
  );

  const { camera: hookCamera } = useThree();
  const group = new TWEEN.Group();
  // 相机平移动画
  const animateCametaTo = (targetPosition: [number, number, number], duration: number) => {
    const from = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    const to = {
      x: targetPosition[0],
      y: targetPosition[1],
      z: targetPosition[2],
    };

    console.log('Starting camera animation from', from, 'to', to); // 调试日志

    const cameraToTween = new TWEEN.Tween(from)
      .to(to, duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onStart(() => console.log('Animation started'))
      .onUpdate(() => {
        console.log('Updating position:', from);
        camera.position.set(from.x, from.y, from.z);
        camera.updateMatrixWorld();
      })
      .onComplete(() => console.log('Animation completed'))
      .start();

    group.add(cameraToTween);
  };

  // 相机视线目标动画
  const animateLookAt = (targetLookAt: [number, number, number], duration: number) => {
    if (!cameraControlsRef.current) return;

    const from = {
      x: cameraControlsRef.current._target.x,
      y: cameraControlsRef.current._target.y,
      z: cameraControlsRef.current._target.z,
    };
    const to = {
      x: targetLookAt[0],
      y: targetLookAt[1],
      z: targetLookAt[2],
    };

    console.log('Starting lookAt animation from', from, 'to', to); // 调试日志

    const lookatTween = new TWEEN.Tween(from)
      .to(to, duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onStart(() => console.log('LookAt animation started'))
      .onUpdate(() => {
        console.log('Updating lookAt target:', from);
        // camera.position.set(from.x, from.y, from.z);
        cameraControlsRef.current?.setLookAt(from.x, 100, from.z, from.x, from.y, from.z);
      })
      .onComplete(() => console.log('LookAt animation completed'))
      .start();

    group.add(lookatTween);
  };

  const lookAtVehicle = (vehicleId: number) => {
    const targetVehicle = vehicleList.find((vehicle) => vehicle.vehicleNum === vehicleId);
    if (!targetVehicle) return;

    const updateCameraPosition = () => {
      const updatedVehicle = vehicleList.find((vehicle) => vehicle.vehicleNum === vehicleId);
      if (!updatedVehicle) return; // 如果车辆丢失，则停止跟随

      const { y, x } = updatedVehicle;
      console.log(updatedVehicle);

      const convertedX = convertToMeters(x);
      const convertedY = convertToMeters(y);

      // 更新相机的位置和视线
      cameraControlsRef.current?.setLookAt(
        convertedX, // 相机位置 X
        10, // 相机位置 Y（高度）
        convertedY, // 相机位置 Z
        convertedX, // 视线目标 X
        0, // 视线目标 Y（高度）
        convertedY, // 视线目标 Z
        true, // 动画关闭，因为我们需要实时跟随
      );

      // 使用 requestAnimationFrame 实现下一帧更新
      requestAnimationFrame(updateCameraPosition);
    };

    // 初始化帧更新
    updateCameraPosition();
  };

  // 初始化 TWEEN 的更新循环
  useEffect(() => {
    const animate = () => {
      group.update();
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const cameraPosition = useRef(hookCamera.position.toArray());

  useFrame(() => {
    const trunPosition = map(Math.trunc, hookCamera.position.toArray());

    const isSame = equals(cameraPosition, trunPosition);
    if (!isSame) {
      cameraPosition.current = trunPosition;
    }
  });

  return { animateCametaTo, animateLookAt, lookAtVehicle, cameraPosition };
};

export default useCameraAnimations;
