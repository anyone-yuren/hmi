function Ground() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <gridHelper args={[100, 60, 'black', 'black']} />
    </group>
  );
}

export default Ground;
