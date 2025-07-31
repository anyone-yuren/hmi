/*
    STACKER,      // 堆高
    PALLET ,       // 托盘车   X20
    FORWARD,      // R车前移
  BALANCE ,              // 平衡重
   TRILATERAL,  //K车三向叉
  OMNI_FORWARD,        // 全向车
  */
export const visionSettingMock = {
  "executor_model": {   //默认托盘车
    "name": "车辆类型",
    "type": "string",
    "value": "PALLET"
  },

  "need_detect": {
    "name": "是否启用视觉",
    "type": "bool",
    "value": true
  },
  "sensor_model_list": {
    "name": "传感器列表",
    "type": "string_array",
    "value": ["sensor_1", "sensor_2", "sensor_3"]
  },
  "sensor_model": {
    "name": "绑定的传感器",
    "type": "string",
    "value": "sensor_1"  //必须从传感器列表里面选择，且只能绑定一个 
  },
  "max_offset_value": {
    "max": 3500,
    "min": 0,
    "name": "最大偏移距离",
    "type": "float_array",
    "value": [ //分别对应左右，上下，前后、角度
      2500,
      1000,
      3000,
      10
    ]
  },
  "pallet_model_list": {
    "max": 0,
    "min": 0,
    "name": "选择的模型列表",
    "type": "string_array",
    "value": ["sensor_1", "sensor_2", "sensor_3"]
  },
  "base_pallet_model_detect": {
    "max": 0,
    "min": 0,
    "name": "基于模型的识别方法",
    "type": "bool",
    "value": true
  },
  "need_detect_height": { //托盘车不显示该参数
    "max": 0,
    "min": 0,
    "name": "进叉高度识别",
    "type": "bool",
    "value": true
  },
  "start_mid_dist": { //车身回正时基准点到托盘前表面的距离
    "max": 2600,
    "min": 0,
    "name": "车身回正时基准点到托盘的距离",
    "type": "int",
    "value": 1200
  },
  "end_mid_dist": {
    "max": 10000,
    "min": 0,
    "name": "停车后基准点到托盘前表面的距离",
    "type": "int",
    "value": 10
  },
  "extra_height": { //托盘车不显示该参数
    "max": 10000,
    "min": -10000,
    "name": "执行视觉任务额外抬升叉臂的高度",
    "type": "int",
    "value": 0
  },
  "base_pallet_model_detect_dist": {
    "max": 500,
    "min": -500,
    "name": "使用不同进叉深度叉取不同托盘",
    "type": "bool",
    "value": true
  },
  "select_model": //只能从已选择的模型里面进行添加
  {
    "pallet_1": {
      "max": 500,
      "min": -500,
      "name": "模型1的进叉深度补偿",
      "type": "int",
      "value": 100
    },
    "pallet_2": {
      "max": 500,
      "min": -500,
      "name": "模型1的进叉补偿",
      "type": "int",
      "value": 100
    }
  },
  "compensation": {
    "en_name": "compensation",
    "name": "取货补偿",
    "front": { //除了K车外，其它车型都采用该接口
      "level": 1,
      "max": 500,
      "min": -500,
      "name": "补偿参数",
      "type": "float_array",
      "value": //表示左右，上下，前后，角度补偿；
        [
          0,
          0,
          0,
          0
        ]
    },
    "left": {  //K车左侧取货补偿参数
      "level": 1,
      "max": 1500,
      "min": -1500,
      "name": "左侧补偿参数",
      "type": "float_array",
      "value": [ //第一个参数表示“前后挪车补偿”，第三个参数表示“叉臂伸出距离补偿”，
        //另外两个参数无用
        [
          -30,
          0,
          -50,
          0
        ]
      ]
    },
    "right": {  //K车右侧取货补偿参数
      "max": 1500,
      "min": -1500,
      "name": "右侧补偿参数",
      "type": "float_array",
      "value": [ //第一个参数表示“前后挪车补偿”，第三个参数表示“叉臂伸出距离补偿”，
        //另外两个参数无用
        [
          -30,
          0,
          -50,
          0
        ]
      ]
    },
  },
}
