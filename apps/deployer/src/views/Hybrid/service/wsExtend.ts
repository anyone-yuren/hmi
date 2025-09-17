import { isEqual } from 'lodash';
import { useShallow } from 'zustand/react/shallow';
import { useHybirdStore } from '../store/hybird.store';

import { roundCoordinates } from '@/utils';
import pako from 'pako';
let agvPosition = { x: 0, y: 0 };
function unzipText(str) {
  return pako.ungzip(
    Uint8Array.from(atob(str), (c) => c.charCodeAt(0)),
    { to: 'string' },
  );
}

export default function useHybirdWsExtend() {
  const {
    setAddSlamMappingData,
    currentReflectors,
    setCurrentReflectors,
    matchedReflectors,
    setMatchedReflectors,
    mismatchedReflectors,
    setMismatchedReflectors,
    setSlamFrozenMap,
    setNavigationType,
    setPointCloudV1Data,
    setQrCodeData,
    setAgvPosition,
    robotCurrentStatus,
    setRobotCurrentStatus,
    setScanHead,
    setWsState,
    isDrag,
  } = useHybirdStore(
    useShallow((store) => ({
      robotCurrentStatus: store.robot_current_status,
      setRobotCurrentStatus: store.setRobotCurrentStatus,
      setAddSlamMappingData: store.setAddSlamMappingData,

      // 当前反光板地图
      currentReflectors: store.currentReflectors,
      setCurrentReflectors: store.setCurrentReflectors,

      // 当前匹配成功的反光板
      matchedReflectors: store.matchedReflectors,
      setMatchedReflectors: store.setMatchedReflectors,

      // 当前未匹配成功的反光板
      mismatchedReflectors: store.mismatchedReflectors,
      setMismatchedReflectors: store.setMismatchedReflectors,
      setSlamFrozenMap: store.setSlamFrozenMap,
      setNavigationType: store.setNavigationType,
      setPointCloudV1Data: store.setPointCloudV1Data,
      setQrCodeData: store.setQrCodeData,
      setAgvPosition: store.setAgvPosition,
      setScanHead: store.setScanHead,
      setWsState: store.setWsState,
      isDrag: store.isDrag,
    })),
  );

  return {
    '/navigation/slam_extending_map': (data: any) => {
      // 这里不做阈值处理
      setAddSlamMappingData(data);
    },
    '/navigation/slam_frozen_map': (data: any) => {
      setSlamFrozenMap(data);
    },

    '/navigation/real_time_data/current_reflector_map': (data: any) => {
      const { reflectors_info: list } = data ?? {};
      const newReflectors = roundCoordinates(list ?? []);

      if (!isEqual(currentReflectors, newReflectors)) {
        setCurrentReflectors(newReflectors ?? []);
      }
    },
    '/navigation/real_time_data/matched_reflectors': (data: any) => {
      const { reflectors_info: list } = data ?? {};
      const newMatchedReflectors = roundCoordinates(list ?? []);

      if (!isEqual(matchedReflectors, newMatchedReflectors)) {
        setMatchedReflectors(newMatchedReflectors ?? []);
      }
    },
    '/navigation/real_time_data/mismatched_reflectors': (data: any) => {
      const { reflectors_info: list } = data ?? {};
      const newMismatchedReflectors = roundCoordinates(list ?? []);
      if (!isEqual(mismatchedReflectors, newMismatchedReflectors)) {
        setMismatchedReflectors(newMismatchedReflectors ?? []);
      }
    },
    '/navigation/type': (data: any) => {
      setNavigationType(data?.navigation_type || 0);
    },
    '/navigation/real_time_data/scan_head': (data: any) => {
      let ary = [];
      if (data?.isGzip) {
        ary = unzipText(data?.point_cloud);
      } else {
        ary = data?.point_cloud;
      }
      if (typeof ary === 'string') {
        ary = JSON.parse(ary);
      }
      !isDrag && setPointCloudV1Data(ary || []);
    },
    '/navigation/current_qrcode_info': (data: any) => {
      setQrCodeData(data);
    },
    // 目前车的定位只看这个 10001上面的 10001是定位的
    '/navigation/robot_status_localizer_result': (data: any) => {
      data.pose.x = data.pose.x * 1000;
      data.pose.y = data.pose.y * 1000;

      const diffX = Math.abs(data.pose.x - agvPosition.x);
      const diffY = Math.abs(data.pose.y - agvPosition.y);
      if (diffX > 10 || diffY > 10) {
        setAgvPosition({
          angel: data.pose.theta,
          x: data.pose.x,
          y: data.pose.y,
        });
        agvPosition = { x: data.pose.x, y: data.pose.y };
      }
    },

    '/navigation/robot_current_status': (data: any) => {
      console.log('wss robot_current_status', data, robotCurrentStatus);
      // 当前车辆导航信息
      if (!isEqual(data, robotCurrentStatus)) {
        setRobotCurrentStatus(data);
      }
    },
    '/navigation/scan_head': (data: any) => {
      // 获取定位点云
      !isDrag && setScanHead(data);
    },
    setWebsocketState: (state) => {
      setWsState(state);
    },
  };
}
