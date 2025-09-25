function AxesHelper({
  size = 5,
  radius = 0.05, // 控制粗细
  depthTest = false,
  depthWrite = false,
}) {
  return (
    <group>
      {/* X轴 - 红色 */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[size / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, size, 8]} />
        <meshBasicMaterial color={0xff0000} depthTest={depthTest} depthWrite={depthWrite} />
      </mesh>

      {/* Y轴 - 绿色 */}
      <mesh position={[0, size / 2, 0]}>
        <cylinderGeometry args={[radius, radius, size, 8]} />
        <meshBasicMaterial color={0x0000ff} depthTest={depthTest} depthWrite={depthWrite} />
      </mesh>

      {/* Z轴 - 蓝色 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, size / 2]}>
        <cylinderGeometry args={[radius, radius, size, 8]} />
        <meshBasicMaterial color={0x00ff00} depthTest={depthTest} depthWrite={depthWrite} />
      </mesh>
    </group>
  );
}

export default AxesHelper;
