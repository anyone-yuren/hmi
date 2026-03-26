import { useWebSocket } from 'ahooks';
import pako from 'pako';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useHybirdStore } from '../../Hybrid/store/hybird.store';

function unzipText(str: string) {
  return pako.ungzip(
    Uint8Array.from(atob(str), (c) => c.charCodeAt(0)),
    { to: 'string' }
  );
}
const currentHost = window.location.hostname;

// const wsUrl10001 = `${import.meta.env.VITE_WS_URL || window.location.host}/ws10001`;
const wsUrl10001 = import.meta.env.DEV
  ? '/ws10001' // 开发环境使用代理
  : `ws://${currentHost}:10001`; // 生产环境使用真实地址

export const useViewerWs = () => {
  const { setRobotCurrentStatus, setScanHead, setPointCloudV1Data, isDrag, setAgvPosition } = useHybirdStore(
    useShallow((state) => ({
      setRobotCurrentStatus: state.setRobotCurrentStatus,
      setScanHead: state.setScanHead,
      setPointCloudV1Data: state.setPointCloudV1Data,
      isDrag: state.isDrag,
      setAgvPosition: state.setAgvPosition,
    })),
  );

  const isDragRef = useRef(isDrag);
  useEffect(() => {
    isDragRef.current = isDrag;
  }, [isDrag]);

  // 节流更新机器人状态，避免过于频繁渲染
  const robotStatusRef = useRef<any>(null);
  const statusUpdateTimer = useRef<any>(null);
  const pointCloudUpdateTimer = useRef<any>(null);
  
  // 节流更新小车位置
  const agvPositionRef = useRef<any>({ x: 0, y: 0 });
  const agvPositionUpdateTimer = useRef<any>(null);

  const { sendMessage, readyState } = useWebSocket(wsUrl10001, {
    reconnectLimit: Infinity,
    reconnectInterval: 3000,
    onMessage: (message: MessageEvent, event: WebSocket) => {
      try {
        if (!message.data) return;
        
        // 如果正在拖动/缩放画布，直接拦截，丢弃所有WebSocket数据更新，避免渲染卡顿
        if (isDragRef.current) return;

        const res = JSON.parse(message.data);
        if (res.uri === '/navigation/robot_current_status') {
          robotStatusRef.current = res;

          // 节流 100ms 更新 store，避免根组件重复渲染卡顿
          if (!statusUpdateTimer.current) {
            statusUpdateTimer.current = setTimeout(() => {
              setRobotCurrentStatus(robotStatusRef.current);
              statusUpdateTimer.current = null;
            }, 100);
          }
        } else if (res.uri === '/navigation/scan_head') {
          setScanHead(res);
        } else if (res.uri === '/navigation/robot_status_localizer_result') {
          const data = res;
          if (data && data.pose) {
            data.pose.x = data.pose.x * 1000;
            data.pose.y = data.pose.y * 1000;
            
            const diffX = Math.abs(data.pose.x - agvPositionRef.current.x);
            const diffY = Math.abs(data.pose.y - agvPositionRef.current.y);
            const diffTheta = Math.abs(data.pose.theta - (agvPositionRef.current.theta || 0));

            // 约 20fps 的节流控制和位置变化阈值判断
            if ((diffX > 10 || diffY > 10 || diffTheta > 0.05) && !agvPositionUpdateTimer.current) {
              agvPositionRef.current = { x: data.pose.x, y: data.pose.y, theta: data.pose.theta };
              
              agvPositionUpdateTimer.current = setTimeout(() => {
                setAgvPosition({
                  angel: data.pose.theta,
                  x: data.pose.x,
                  y: data.pose.y,
                });
                agvPositionUpdateTimer.current = null;
              }, 50);
            }
          }
        } else if (res.uri === '/navigation/real_time_data/scan_head') {
          if (!pointCloudUpdateTimer.current) {
            pointCloudUpdateTimer.current = setTimeout(() => {
              let ary = [];
              try {
                const data = res;
                // if (data?.isGzip) {
                //   ary = unzipText(data?.point_cloud) as any;
                // } else {
                //   ary = data?.point_cloud;
                // }
                ary = data?.point_cloud;
                if (typeof ary === 'string') {
                  ary = JSON.parse(ary);
                }
                setPointCloudV1Data(ary || []);
              } catch (e) {
                console.error('Point cloud parsing error:', e);
              }
              pointCloudUpdateTimer.current = null;
            }, 200); // 200ms 节流，避免高频点云数据卡死
          }
        }
      } catch (e) {
        console.error('WebSocket parse error', e);
      }
    },
  });

  useEffect(() => {
    if (readyState === 1) {
      sendMessage(
        JSON.stringify({
          uri: 'subscribe',
          topics: [
            '/navigation/scan_head',
            '/navigation/robot_current_status',
            '/navigation/robot_status_localizer_result',
            '/navigation/real_time_data/scan_head',
          ],
        })
      );
    }
  }, [readyState, sendMessage]);

  useEffect(() => {
    return () => {
      if (statusUpdateTimer.current) {
        clearTimeout(statusUpdateTimer.current);
      }
      if (pointCloudUpdateTimer.current) {
        clearTimeout(pointCloudUpdateTimer.current);
      }
      if (agvPositionUpdateTimer.current) {
        clearTimeout(agvPositionUpdateTimer.current);
      }
    };
  }, []);
};