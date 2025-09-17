function Ground() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <gridHelper args={[20, 20, '#808080', '#808080']} />
    </group>
  );
}

export default Ground;
