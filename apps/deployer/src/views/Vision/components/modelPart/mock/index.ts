export const containerTypeListMock = [
  {
    type: "pallet",
    name: "托盘(两个支腿)",
    id: "1", // 后续根据id和type做增删改查
    width: 1200,
    height: 30,
    length: 1200,
    legs: [
      {
        width: 100,
        length: 100,
        height: 120,
        leftPosition: 0,
      },
      {
        width: 100,
        length: 100,
        height: 120,
        leftPosition: 1100,
      },
    ],
    handles: [

    ],
  },
  {
    type: "pallet",
    name: "托盘(三个支腿)",
    id: "2",
    width: 1700,
    height: 30,
    length: 1200,
    legs: [
      {
        width: 100,
        length: 100,
        height: 120,
        leftPosition: 0,
      },
      {
        width: 100,
        length: 100,
        height: 120,
        leftPosition: 1600,
      },
      {
        width: 150,
        length: 100,
        height: 120,
        leftPosition: 525,
      },
    ],
    handles: [
    ],
  },
  {
    type: "pallet",
    name: "托盘(四个支腿)",
    id: "3",
    width: 1200,
    height: 30,
    length: 1200,
    legs: [
      {
        width: 100,
        length: 100,
        height: 120,
        leftPosition: 0,
      },
      {
        width: 150,
        length: 100,
        height: 120,
        leftPosition: 350,
      },
      {
        width: 150,
        length: 100,
        height: 120,
        leftPosition: 700,
      },
      {
        width: 100,
        length: 100,
        height: 120,
        leftPosition: 1100,
      },
    ],
    handles: [
    ],
  },
  {
    type: "pallet",
    name: "托盘(五个支腿)",
    id: "4",
    width: 1200,
    height: 50,
    length: 1200,
    legs: [
      {
        width: 100,
        length: 100,
        height: 120,
        leftPosition: 0,
      },
      {
        width: 150,
        length: 100,
        height: 120,
        leftPosition: 200,
      },
      {
        width: 150,
        length: 100,
        height: 120,
        leftPosition: 525,
      },
      {
        width: 150,
        length: 100,
        height: 120,
        leftPosition: 850,
      },
      {
        width: 100,
        length: 100,
        height: 120,
        leftPosition: 1100,
      },
    ],
    handles: [
    ],
  },
  {
    type: "nine-corner-pallet",
    width: 1000,
    height: 20,
    legs: [
      {
        topWidth: 100,
        bottomWidth: 80,
        height: 200,
        leftPosition: 0,
      },
      {
        topWidth: 100,
        bottomWidth: 80,
        height: 200,
        leftPosition: 400,
      },
      {
        topWidth: 100,
        bottomWidth: 80,
        height: 200,
        leftPosition: 900,
      }
    ],
    handles: []
  },
  {
    type: "pallet",
    name: "料笼",
    id: "5", // 后续根据id和type做增删改查
    width: 1200,
    height: 30,
    length: 1200,
    legs: [
      {
        width: 100,
        length: 100,
        height: 40,
        leftPosition: 0,
      },
      {
        width: 100,
        length: 100,
        height: 40,
        leftPosition: 1100,
      },
    ],
    handles: [
      {
        width: 100,
        length: 100,
        height: 300,
        leftPosition: 0,
      },
      {
        width: 100,
        length: 100,
        height: 300,
        leftPosition: 1100,
      },
    ],
  },
  {
    type: "rect",
    id: "6",
    name: "矩形",
    width: 1000,
    height: 200
  }, {
    type: "concentric",
    id: "7",
    name: "同心圆",
    maxDiameter: 100, // 最大直径
    minDiameter: 60, // 最小直径
  },
  {
    type: "cylinder", // 圆柱
    id: "8",
    name: "圆柱",
    diameter: 60, // 直径
    height: 100, // 高度
  },

]