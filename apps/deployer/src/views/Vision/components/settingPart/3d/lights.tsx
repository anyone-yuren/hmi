function Lights() {
  return (
    <>
      {/* 首先添加个环境光,AmbientLight,影响整个场景的光源 */}
      <ambientLight color={0xffffff} intensity={1} position={[0, 0, 0]} />
      {/* 模拟远处类似太阳的光源 */}
      <directionalLight color={0xffffff} intensity={0.3} position={[1000, 1000, 1000]} />
      {/* 设置点光源 */}
      <pointLight color={0xffffff} intensity={0.3} position={[-500, 200, 0]} />
      <pointLight color={0xffffff} intensity={0.3} position={[500, 200, 0]} />
    </>
  );
}

export default Lights;
