// pointWorker.ts
export {}; // 确保这是一个模块，避免全局命名冲突
declare const self: DedicatedWorkerGlobalScope;
self.onmessage = (e) => {
  const rawData = e.data; // websocket 推送的原始 sensorPoints
  const ary: number[] = [];
  const stride = 3;
  // 扁平化成 Float32Array
  let currentIndex = 0;
  console.time(`OuterLoop`);
  Object.values(rawData || {}).forEach((list: any, outerIndex: number) => {
    (list as { x: number; y: number; z: number }[]).forEach((p) => {
      ary.push(p.x, p.y, p.z);
      currentIndex++;
    });
  });
  console.timeEnd(`OuterLoop`); // 停止计时外层循环
  console.log('ary', ary.length);
  const float32 = new Float32Array(ary);
  self.postMessage(float32, [float32.buffer]);
};
