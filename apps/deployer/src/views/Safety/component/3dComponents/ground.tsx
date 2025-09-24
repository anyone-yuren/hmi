function Ground() {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.8,
    cellColor: '#808080',
    sectionSize: 2,
    sectionThickness: 1, // 截面厚度
    sectionColor: '#808080',
    fadeDistance: 100, // 视距，多大开始模糊
    fadeStrength: 1,
  };

  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <gridHelper args={[20, 20, '#808080', '#808080']} />
      {/* <Grid
        args={[10000, 10000]}
        // position={[agvPosition.x / 1000, -0.1, agvPosition.y / 1000]}
        {...gridConfig}
      /> */}
    </group>
  );
}

export default Ground;
