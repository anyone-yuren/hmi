/* eslint-disable */
/* tslint:disable */

export interface ActionApiDescriptionModel {
  uniqueName?: string | null;
  name?: string | null;
  httpMethod?: string | null;
  url?: string | null;
  supportedVersions?: string[] | null;
  parametersOnMethod?: MethodParameterApiDescriptionModel[] | null;
  parameters?: ParameterApiDescriptionModel[] | null;
  returnValue?: ReturnValueApiDescriptionModel;
  allowAnonymous?: boolean | null;
  implementFrom?: string | null;
}

/** @format int32 */
export enum ActionType {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value8 = 8,
}

/** 系统管理员输出信息 */
export interface AdminUserOutput {
  /** @format uuid */
  id?: string;
  /** 姓名 */
  name?: string | null;
  /** 用户名 */
  username?: string | null;
  /** 邮箱 */
  email?: string | null;
  /** 手机号 */
  phone?: string | null;
  /** 是否启用 */
  isActive?: boolean;
  /** 是否管理员 */
  isAdmin?: boolean;
  /**
   * 创建时间
   * @format date-time
   */
  creationTime?: string;
}

export interface AdminUserOutputPagedResultDto {
  items?: AdminUserOutput[] | null;
  /** @format int64 */
  totalCount?: number;
}

export interface AdminUserOutputPagedResultDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: AdminUserOutputPagedResultDto;
}

export interface AgvTaskDto {
  /**
   * Agv 编号
   * @format int32
   */
  id?: number;
  /**
   * 完成的任务个数
   * @format int32
   */
  taskQty?: number;
  /**
   * 消耗的时间 单位 分钟
   * @format double
   */
  consumeTime?: number;
  /**
   * 平均每个任务消耗时间 分钟
   * @format double
   */
  average?: number;
}

export interface AgvTaskDtoListServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: AgvTaskDto[] | null;
}

/** Agv 耗时统计Dto */
export interface AgvTimeSumDto {
  /**
   * Agv 编号
   * @format int32
   */
  id?: number;
  /**
   * 完成的任务个数
   * @format int32
   */
  taskQty?: number;
  /**
   * 消耗的时间 单位 分钟
   * @format double
   */
  consumeTime?: number;
  /**
   * 平均每个任务消耗时间 分钟
   * @format double
   */
  average?: number;
  /**
   * 空闲时间 /H
   * @format double
   */
  freeTime?: number;
  /**
   * 运行时间 /H
   * @format double
   */
  workTime?: number;
  /**
   * 故障时间 /H
   * @format double
   */
  errorTime?: number;
  /**
   * 交管时间 /H
   * @format double
   */
  trafficTime?: number;
  /**
   * 充电时间 /H
   * @format double
   */
  chargeTime?: number;
  /**
   * 平均单个任务执行时间 H
   * @format double
   */
  averageTask?: number;
}

export interface AgvTimeSumDtoListServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: AgvTimeSumDto[] | null;
}

export interface AllEfficiencyStatisticsDto {
  /**
   * 车辆利用率
   * @format double
   */
  useRatio?: number;
  /**
   * 无故障率
   * @format double
   */
  troubleprool?: number;
  /**
   * 交管占比
   * @format double
   */
  trafficControl?: number;
  /** 单个车辆数据 */
  efficiencyStatisticsDtos?: EfficiencyStatisticsDto[] | null;
}

export interface AllEfficiencyStatisticsDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: AllEfficiencyStatisticsDto;
}

export interface AllPerformanceDto {
  /**
   * 空闲时间
   * @format double
   */
  freeTime?: number;
  /**
   * 运行时间
   * @format double
   */
  workTime?: number;
  /**
   * 交管时间
   * @format double
   */
  trafficTime?: number;
  /**
   * 充电时间
   * @format double
   */
  chargeTime?: number;
  performanceDto?: PerformanceDto[] | null;
}

export interface AllPerformanceDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: AllPerformanceDto;
}

export interface ApplicationApiDescriptionModel {
  modules?: Record<string, ModuleApiDescriptionModel>;
  types?: Record<string, TypeApiDescriptionModel>;
}

export interface ApplicationAuthConfigurationDto {
  grantedPolicies?: Record<string, boolean>;
}

export interface ApplicationConfigurationDto {
  localization?: ApplicationLocalizationConfigurationDto;
  auth?: ApplicationAuthConfigurationDto;
  setting?: ApplicationSettingConfigurationDto;
  currentUser?: CurrentUserDto;
  features?: ApplicationFeatureConfigurationDto;
  globalFeatures?: ApplicationGlobalFeatureConfigurationDto;
  multiTenancy?: MultiTenancyInfoDto;
  currentTenant?: CurrentTenantDto;
  timing?: TimingDto;
  clock?: ClockDto;
  objectExtensions?: ObjectExtensionsDto;
  extraProperties?: Record<string, any>;
}

export interface ApplicationFeatureConfigurationDto {
  values?: Record<string, string | null>;
}

export interface ApplicationGlobalFeatureConfigurationDto {
  /** @uniqueItems true */
  enabledFeatures?: string[] | null;
}

export interface ApplicationLocalizationConfigurationDto {
  values?: Record<string, Record<string, string>>;
  resources?: Record<string, ApplicationLocalizationResourceDto>;
  languages?: LanguageInfo[] | null;
  currentCulture?: CurrentCultureDto;
  defaultResourceName?: string | null;
  languagesMap?: Record<string, NameValue[]>;
  languageFilesMap?: Record<string, NameValue[]>;
}

export interface ApplicationLocalizationDto {
  resources?: Record<string, ApplicationLocalizationResourceDto>;
}

export interface ApplicationLocalizationResourceDto {
  texts?: Record<string, string>;
  baseResources?: string[] | null;
}

export interface ApplicationSettingConfigurationDto {
  values?: Record<string, string | null>;
}

/** @format int32 */
export enum AvailableEnum {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value8 = 8,
  Value9 = 9,
  Value10 = 10,
}

/** @format int32 */
export enum BlockType {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value8 = 8,
}

export interface ChargingRecordOutput {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /**
   * 小车编号
   * @format int32
   */
  vehicleNum?: number;
  /**
   * 充电开始时间
   * @format date-time
   */
  startIime?: string;
  /**
   * 充电结束时间
   * @format date-time
   */
  completeTime?: string | null;
  chargingState?: ChargingState;
  /** 强制充电 */
  isForce?: boolean;
}

export interface ChargingRecordOutputPagedResultDto {
  items?: ChargingRecordOutput[] | null;
  /** @format int64 */
  totalCount?: number;
}

export interface ChargingRecordOutputPagedResultDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: ChargingRecordOutputPagedResultDto;
}

/** @format int32 */
export enum ChargingState {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

export interface ChargingStrategyOutput {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /** 充电策略名称 */
  name?: string | null;
  /** 小车编号 */
  carrierKeys?: string | null;
  /**
   * 低电量百分比
   * @format int32
   */
  minLimitBattery?: number | null;
  /**
   * 高电量百分比
   * @format int32
   */
  maxLimitBattery?: number | null;
  /**
   * 0点
   * @format int32
   */
  startHour?: number;
  /**
   * 24点
   * @format int32
   */
  endHour?: number;
  /**
   * 开始分钟
   * @format int32
   */
  startMinute?: number;
  /**
   * 结束分钟
   * @format int32
   */
  endMinute?: number;
  /**
   * 小车类型
   * @format int32
   */
  vehicleChassisNum?: number;
  /**
   * 任务优先级
   * @format int32
   */
  priority?: number;
  /**
   * 规则优先级,由小到大,优先级越高
   * @format int32
   */
  level?: number;
  /**
   * 充电完成时间（分钟）
   * @format int32
   */
  completeTime?: number;
  /**
   * 充电完成百分比1~100
   * @format int32
   */
  completePercent?: number;
  /** 充电桩点位 */
  pileKeys?: string | null;
  /** 充电完是否回待命点 */
  isGoHome?: boolean;
  /**
   * 待命点位
   * @format int32
   */
  homeKey?: number | null;
  /**
   * 充电策略类型
   * 0 普通充电策略 1强制充电策略
   * @format int32
   */
  strategyType?: number;
}

export interface ChargingStrategyOutputListServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: ChargingStrategyOutput[] | null;
}

export interface ChargingStrategyOutputPagedResultDto {
  items?: ChargingStrategyOutput[] | null;
  /** @format int64 */
  totalCount?: number;
}

export interface ChargingStrategyOutputPagedResultDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: ChargingStrategyOutputPagedResultDto;
}

export interface ChargingStrategyOutputServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: ChargingStrategyOutput;
}

export interface ClockDto {
  kind?: string | null;
}

/** @format int32 */
export enum ControlState {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

export interface ControllerApiDescriptionModel {
  controllerName?: string | null;
  controllerGroupName?: string | null;
  isRemoteService?: boolean;
  isIntegrationService?: boolean;
  apiVersion?: string | null;
  type?: string | null;
  interfaces?: ControllerInterfaceApiDescriptionModel[] | null;
  actions?: Record<string, ActionApiDescriptionModel>;
}

export interface ControllerInterfaceApiDescriptionModel {
  type?: string | null;
  name?: string | null;
  methods?: InterfaceMethodApiDescriptionModel[] | null;
}

/** 创建系统管理员输入信息 */
export interface CreateAdminUserInput {
  /** @format uuid */
  id?: string;
  /**
   * 姓名
   * @minLength 1
   * @maxLength 64
   */
  name: string;
  /**
   * 用户名
   * @minLength 1
   * @maxLength 64
   */
  username: string;
  /**
   * 邮件
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * 手机号
   * @minLength 1
   * @pattern ^1\d{10}$
   */
  phone: string;
}

/** 充电策略创建 */
export interface CreateChargingStrategyInput {
  /** @format uuid */
  id?: string;
  extraProperties?: Record<string, any>;
  concurrencyStamp?: string | null;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /** 充电策略名称 */
  name?: string | null;
  /** 小车编号 */
  carrierKeys?: string | null;
  /**
   * 低电量百分比
   * @format int32
   */
  minLimitBattery?: number | null;
  /**
   * 高电量百分比
   * @format int32
   */
  maxLimitBattery?: number | null;
  /**
   * 0点
   * @format int32
   */
  startHour?: number;
  /**
   * 24点
   * @format int32
   */
  endHour?: number;
  /**
   * 开始分钟
   * @format int32
   */
  startMinute?: number;
  /**
   * 结束分钟
   * @format int32
   */
  endMinute?: number;
  /**
   * 小车类型
   * @format int32
   */
  vehicleChassisNum?: number;
  /**
   * 任务优先级
   * @format int32
   */
  priority?: number;
  /**
   * 规则优先级,由小到大,优先级越高
   * @format int32
   */
  level?: number;
  /**
   * 充电完成时间（分钟）
   * @format int32
   */
  completeTime?: number;
  /**
   * 充电完成百分比1~100
   * @format int32
   */
  completePercent?: number;
  /** 充电桩点位 */
  pileKeys?: string | null;
  /** 充电完是否回待命点 */
  isGoHome?: boolean;
  /**
   * 待命点位
   * @format int32
   */
  homeKey?: number | null;
  /**
   * 充电策略类型
   * 0 普通充电策略 1强制充电策略
   * @format int32
   */
  strategyType?: number;
}

/** 创建通信配置 */
export interface CreateCommunicationOptionInput {
  /** @format uuid */
  id?: string;
  extraProperties?: Record<string, any>;
  concurrencyStamp?: string | null;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /** 通道的类型 */
  connectionType?: string | null;
  /** 通道名称，通过名称初始化某一类型的通道 */
  name?: string | null;
  /**
   * 端口号
   * @format int32
   */
  port?: number;
  /** 主机IP */
  host?: string | null;
  /** 通道类型，通过反射实例化具体类 */
  channelType?: string | null;
  /** 是否启用 */
  enable?: boolean;
  /** 服务名称 */
  serverName?: string | null;
}

/** 创建Dto */
export interface CreateMapBlockInput {
  type?: BlockType;
  /**
   * 楼层
   * @format int32
   */
  floor?: number;
  /** 区块名称 */
  blockName?: string | null;
  /** 边界 */
  border?: string | null;
  /** 扩展 */
  mapBlockExtend?: MapBlockExtendDto;
  /** 区块详情 */
  mapBlockDetails?: MapBlockDetailDto[] | null;
}

/** 创建地图配置Dto */
export interface CreateMapOptionInput {
  /** @format uuid */
  id?: string;
  extraProperties?: Record<string, any>;
  concurrencyStamp?: string | null;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /** 项目名称 */
  projectName?: string | null;
  /** 地图名称 */
  mapName?: string | null;
  /** 地图编号 */
  mapGuid?: string | null;
  /** 地图文件名称 */
  fileName?: string | null;
  /** 地图底图 */
  dxfName?: string | null;
  /**
   * 底图的最小X
   * @format int32
   */
  dxfMinX?: number;
  /**
   * 底图的最大X
   * @format int32
   */
  dxfMaxX?: number;
  /**
   * 底图的最小Y
   * @format int32
   */
  dxfMinY?: number;
  /**
   * 底图最大Y
   * @format int32
   */
  dxfMaxY?: number;
  /**
   * 地图的最小X
   * @format int32
   */
  mapMinX?: number;
  /**
   * 地图的最大X
   * @format int32
   */
  mapMaxX?: number;
  /**
   * 地图的最小Y
   * @format int32
   */
  mapMinY?: number;
  /**
   * 地图的最大Y
   * @format int32
   */
  mapMaxY?: number;
  /** 激活地图 */
  isActive?: boolean;
}

/** 创建站点 */
export interface CreateMapStationInput {
  /**
   * 点位编号
   * @format int32
   */
  pointId?: number;
  type?: VertexType;
  /** 组号 */
  groups?: number[] | null;
  /** 车辆类型 */
  vehicleTypes?: number[] | null;
  /** 车辆编号 */
  vehicleKeys?: number[] | null;
  /**
   * 优先级
   * @format int32
   */
  priority?: number;
  /** 待命点类型扩展 */
  mapStationExtend?: MapStationExtendDto;
}

/** 创建任务 */
export interface CreateMissionInput {
  /** @format uuid */
  id?: string;
  extraProperties?: Record<string, any>;
  concurrencyStamp?: string | null;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /**
   *  第三方订单id
   * [正常WCS下发]
   * @format uuid
   */
  orderCode?: string;
  missionType?: MissionType;
  missionState?: MissionState;
  /** 自动结束任务 */
  isAutoCompleted?: boolean;
  /**
   * 任务区域
   * @format int32
   */
  areaID?: number;
  /**
   * 起点
   * @format int32
   */
  start?: number;
  /**
   * 目标点
   * @format int32
   */
  destination?: number;
  /**
   * 任务优先级
   * @format int32
   */
  priority?: number;
  /**
   * 任务完成时间
   * @format date-time
   */
  completedTime?: string | null;
  /**
   * 任务激活时间
   * @format date-time
   */
  activedTime?: string | null;
  platformSource?: PlatformSource;
  /** 任务状态描述 */
  stateDescription?: string | null;
  /** 描述 */
  description?: string | null;
}

export interface CreateMissionItemInput {
  /** @format uuid */
  id?: string;
  extraProperties?: Record<string, any>;
  concurrencyStamp?: string | null;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /** 子任务订单编码 */
  orderItemCode?: string | null;
  /**
   * 任务编号
   * @format uuid
   */
  missionId?: string;
  /**
   * 任务区域
   * @format int32
   */
  areaID?: number;
  type?: MissionType;
  missionItemType?: MissionItemType;
  missionItemState?: MissionItemState;
  /** 子任务项状态描述 */
  itemStateDescription?: string | null;
  /**
   * 目标点
   * @format int32
   */
  destination?: number;
  /**
   * 车辆编号
   * @format int32
   */
  vehicleNum?: number;
  /**
   * 车辆类型
   * @format int32
   */
  vehicleChassisNum?: number;
  action?: ActionType;
  /**
   * 滚轴编号
   * @format int32
   */
  axisId?: number;
  /**
   * 目的点停车角度
   * @format int32
   */
  headingAngle?: number;
  /** 轴动作调试 */
  isActionDebug?: boolean;
  /**
   * 优先级
   * @format int32
   */
  priority?: number;
  platformSource?: PlatformSource;
  /** 相关描述 */
  description?: string | null;
}

export interface CreateRoleInput {
  /**
   * 角色Id
   * @format uuid
   */
  roleId: string;
  /**
   * 角色名称
   * @minLength 1
   * @maxLength 64
   */
  name: string;
  /** 是否允许编辑权限 */
  isAllowEditPermission?: boolean;
  /** 是否允许删除 */
  isAllowDelete?: boolean;
}

/** 创建角色权限输入信息 */
export type CreateRolePermissionInput = object;

/** 创建路径事件Dto */
export interface CreateRouteEventOptionInput {
  /** @format uuid */
  id?: string;
  extraProperties?: Record<string, any>;
  concurrencyStamp?: string | null;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /**
   * 事件编号
   * @format uuid
   */
  eventID?: string;
  /** 事件描述 */
  description?: string | null;
  routeEventType?: RouteEventType;
  eventTriggerTime?: EventTriggerStage;
  /**
   * 事件优先级
   * @format int32
   */
  priority?: number;
  /**
   * 超时时间（秒）
   * @format int32
   */
  timeout?: number;
  routeType?: RouteType;
  /**
   * 路径参数Key
   * @format int32
   */
  routeKey?: number;
  /**
   * 车辆编号
   * @format int32
   */
  vehicleNum?: number;
  /**
   * 车辆类型
   * @format int32
   */
  vehicleChassisNum?: number;
}

/** 创建企业用户输入信息 */
export interface CreateUserInput {
  /** @format uuid */
  id?: string;
  /**
   * 姓名
   * @minLength 1
   * @maxLength 64
   */
  name: string;
  /**
   * 用户名
   * @minLength 1
   * @maxLength 64
   */
  username: string;
  /**
   * 邮箱
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * 手机号
   * @minLength 1
   * @pattern ^1\d{10}$
   */
  phone: string;
  /**
   * 角色Id
   * @format uuid
   */
  roleId: string;
}

/** 车辆类型创建输入信息 */
export interface CreateVehicleChassisInput {
  /** @format uuid */
  id?: string;
  extraProperties?: Record<string, any>;
  concurrencyStamp?: string | null;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /**
   * 车辆类型编号
   * @format int32
   */
  vehicleChassisNum?: number;
  /** 车辆类型名称 */
  vehicleChassisName?: string | null;
  vehicleType?: VehicleType;
  /**
   * 托盘编号
   * @format uuid
   */
  vehicleTrayId?: string;
  /**
   * X轴安全距离
   * @format double
   */
  safeX?: number;
  /**
   * Y轴安全距离
   * @format double
   */
  safeY?: number;
  /**
   * 车辆最大速度
   * @format int32
   */
  speedMax?: number;
  /**
   * 强制充电电量百分比
   * @format int32
   */
  forcedCharge?: number;
  /**
   * 制动加速度
   * @format int32
   */
  brakingAcceleration?: number;
  /**
   * 强制充满电天数计算
   * @format int32
   */
  fullChargeDay?: number;
  /**
   * 空载形状中心偏移X(相对控制中心)
   * @format double
   */
  noLoadOffsetX?: number;
  /**
   * 空载形状中心偏移Y(相对控制中心)
   * @format double
   */
  noLoadOffsetY?: number;
  /**
   * 空载宽度
   * @format double
   */
  noLoadWidth?: number;
  /**
   * 空载长度
   * @format double
   */
  noLoadLength?: number;
  /** 车辆svg模型文件名 */
  chassisModel?: string | null;
  /**
   * 超时时间
   * @format int32
   */
  timeout?: number;
  /**
   * 空闲时间(回待命点)
   * @format int32
   */
  freeSeconds?: number;
}

/** 车辆信息创建输入信息 */
export interface CreateVehicleInput {
  /** @format uuid */
  id?: string;
  extraProperties?: Record<string, any>;
  concurrencyStamp?: string | null;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /**
   * 车辆编号
   * @format int32
   */
  vehicleNum?: number;
  /**
   * 车辆类型id
   * @format int32
   */
  vehicleChassisNum?: number;
  /** 车辆名称 */
  vehicleChassisName?: string | null;
  /** 车辆Ip */
  vehicleIp?: string | null;
  /** 激活 */
  isActive?: boolean;
  /** 是否仿真 */
  isSimulation?: boolean;
  /**
   * 满载形状中心偏移X(相对控制中心)
   * @format double
   */
  loadOffsetX?: number;
  /**
   * 满载形状中心偏移Y(相对控制中心)
   * @format double
   */
  loadOffsetY?: number;
  /**
   * 满载宽度
   * @format double
   */
  loadWidth?: number;
  /**
   * 满载长度
   * @format double
   */
  loadLength?: number;
  /** 是否自动回待命点 */
  isAutoReHome?: boolean;
}

/** 车辆状态创建输入信息 */
export interface CreateVehicleTrayInput {
  /** @format uuid */
  id?: string;
  extraProperties?: Record<string, any>;
  concurrencyStamp?: string | null;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /** 托盘名称 */
  name?: string | null;
  /**
   * 托盘长
   * @format double
   */
  length?: number;
  /**
   * 托盘宽
   * @format double
   */
  width?: number;
}

export interface CurrentCultureDto {
  displayName?: string | null;
  englishName?: string | null;
  threeLetterIsoLanguageName?: string | null;
  twoLetterIsoLanguageName?: string | null;
  isRightToLeft?: boolean;
  cultureName?: string | null;
  name?: string | null;
  nativeName?: string | null;
  dateTimeFormat?: DateTimeFormatDto;
}

export interface CurrentTenantDto {
  /** @format uuid */
  id?: string | null;
  name?: string | null;
  isAvailable?: boolean;
}

export interface CurrentUserDto {
  isAuthenticated?: boolean;
  /** @format uuid */
  id?: string | null;
  /** @format uuid */
  tenantId?: string | null;
  /** @format uuid */
  impersonatorUserId?: string | null;
  /** @format uuid */
  impersonatorTenantId?: string | null;
  impersonatorUserName?: string | null;
  impersonatorTenantName?: string | null;
  userName?: string | null;
  name?: string | null;
  surName?: string | null;
  email?: string | null;
  emailVerified?: boolean;
  phoneNumber?: string | null;
  phoneNumberVerified?: boolean;
  roles?: string[] | null;
}

export interface DateTimeFormatDto {
  calendarAlgorithmType?: string | null;
  dateTimeFormatLong?: string | null;
  shortDatePattern?: string | null;
  fullDateTimePattern?: string | null;
  dateSeparator?: string | null;
  shortTimePattern?: string | null;
  longTimePattern?: string | null;
}

/** @format int32 */
export enum DateType {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

/** @format int32 */
export enum DeviceState {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
}

/** @format int32 */
export enum DirectionType {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
}

/** @format int32 */
export enum EdgeType {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

export interface EfficiencyStatisticsDto {
  /** @format int32 */
  id?: number;
  /**
   * 车辆利用率
   * @format double
   */
  useRatio?: number;
  /**
   * 无故障率
   * @format double
   */
  troubleprool?: number;
  /**
   * 交管占比
   * @format double
   */
  trafficControl?: number;
}

/** @format int32 */
export enum EnergyState {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

export interface EntityExtensionDto {
  properties?: Record<string, ExtensionPropertyDto>;
  configuration?: Record<string, any>;
}

/** @format int32 */
export enum EventTriggerStage {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

export interface ExtensionEnumDto {
  fields?: ExtensionEnumFieldDto[] | null;
  localizationResource?: string | null;
}

export interface ExtensionEnumFieldDto {
  name?: string | null;
  value?: any;
}

export interface ExtensionPropertyApiCreateDto {
  isAvailable?: boolean;
}

export interface ExtensionPropertyApiDto {
  onGet?: ExtensionPropertyApiGetDto;
  onCreate?: ExtensionPropertyApiCreateDto;
  onUpdate?: ExtensionPropertyApiUpdateDto;
}

export interface ExtensionPropertyApiGetDto {
  isAvailable?: boolean;
}

export interface ExtensionPropertyApiUpdateDto {
  isAvailable?: boolean;
}

export interface ExtensionPropertyAttributeDto {
  typeSimple?: string | null;
  config?: Record<string, any>;
}

export interface ExtensionPropertyDto {
  type?: string | null;
  typeSimple?: string | null;
  displayName?: LocalizableStringDto;
  api?: ExtensionPropertyApiDto;
  ui?: ExtensionPropertyUiDto;
  attributes?: ExtensionPropertyAttributeDto[] | null;
  configuration?: Record<string, any>;
  defaultValue?: any;
}

export interface ExtensionPropertyUiDto {
  onTable?: ExtensionPropertyUiTableDto;
  onCreateForm?: ExtensionPropertyUiFormDto;
  onEditForm?: ExtensionPropertyUiFormDto;
  lookup?: ExtensionPropertyUiLookupDto;
}

export interface ExtensionPropertyUiFormDto {
  isVisible?: boolean;
}

export interface ExtensionPropertyUiLookupDto {
  url?: string | null;
  resultListPropertyName?: string | null;
  displayPropertyName?: string | null;
  valuePropertyName?: string | null;
  filterParamName?: string | null;
}

export interface ExtensionPropertyUiTableDto {
  isVisible?: boolean;
}

/** @format int32 */
export enum GoodsState {
  Value0 = 0,
  Value1 = 1,
}

export interface GuidServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  /** @format uuid */
  data?: string;
}

/** @format int32 */
export enum HomeGroupType {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
}

export interface IanaTimeZone {
  timeZoneName?: string | null;
}

export interface InterfaceMethodApiDescriptionModel {
  name?: string | null;
  parametersOnMethod?: MethodParameterApiDescriptionModel[] | null;
  returnValue?: ReturnValueApiDescriptionModel;
}

export interface LanguageInfo {
  cultureName?: string | null;
  uiCultureName?: string | null;
  displayName?: string | null;
  twoLetterISOLanguageName?: string | null;
  flagIcon?: string | null;
}

export interface LocalizableStringDto {
  name?: string | null;
  resource?: string | null;
}

/** 登录输出信息 */
export interface LoginOutput {
  /**
   * 主键Id
   * @format uuid
   */
  id?: string;
  /** 姓名 */
  name?: string | null;
  /** 用户名 */
  username?: string | null;
  /** 是否管理员 */
  isAdmin?: boolean;
  /** token */
  token?: string | null;
  /** 角色 */
  roles?: Role[] | null;
}

export interface LoginOutputServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  /** 登录输出信息 */
  data?: LoginOutput;
}

/** 区块详情 */
export interface MapBlockDetailDto {
  routeType?: RouteType;
  /**
   * 路径key
   * @format int32
   */
  routeKey?: number;
}

/** 扩展 */
export interface MapBlockExtendDto {
  /**
   * 数量限制 s-- 数量区块使用
   * @format int32
   */
  number?: number;
  /** 扩展字段 */
  extraProperties?: Record<string, any>;
}

/** 控制点集合 */
export interface MapControlPointOutputDto {
  /**
   * 线ID
   * @format int32
   */
  edgeID?: number;
  /**
   * 序号
   * @format int32
   */
  order?: number;
  /**
   * X
   * @format double
   */
  x?: number;
  /**
   * Y
   * @format double
   */
  y?: number;
}

/** 地图数据 */
export interface MapDataOutputDto {
  mapOption?: OptionDto;
  /** 地图点数据 */
  mapVertices?: MapVertexOutputDto[] | null;
  /** 地图线数据 */
  mapEdges?: MapEdgeOutputDto[] | null;
}

export interface MapDataOutputDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  /** 地图数据 */
  data?: MapDataOutputDto;
}

/** 线集合表 */
export interface MapEdgeOutputDto {
  /**
   * 线编号
   * @format int32
   */
  edgeId?: number;
  directionType?: DirectionType;
  type?: EdgeType;
  /**
   * 起点标识
   * @format int32
   */
  start?: number;
  /**
   * 终点标识
   * @format int32
   */
  end?: number;
  /**
   * 线长度
   * @format double
   */
  length?: number;
  /** 控制点 */
  controlPoint?: MapControlPointOutputDto[] | null;
}

/** 地图配置项目数据 */
export interface MapOptionOutPut {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /** 项目名称 */
  projectName?: string | null;
  /** 地图名称 */
  mapName?: string | null;
  /** 地图编号 */
  mapGuid?: string | null;
  /** 地图文件名称 */
  fileName?: string | null;
  /** 地图底图 */
  dxfName?: string | null;
  /**
   * 底图的最小X
   * @format int32
   */
  dxfMinX?: number;
  /**
   * 底图的最大X
   * @format int32
   */
  dxfMaxX?: number;
  /**
   * 底图的最小Y
   * @format int32
   */
  dxfMinY?: number;
  /**
   * 底图最大Y
   * @format int32
   */
  dxfMaxY?: number;
  /**
   * 地图的最小X
   * @format int32
   */
  mapMinX?: number;
  /**
   * 地图的最大X
   * @format int32
   */
  mapMaxX?: number;
  /**
   * 地图的最小Y
   * @format int32
   */
  mapMinY?: number;
  /**
   * 地图的最大Y
   * @format int32
   */
  mapMaxY?: number;
  /** 激活地图 */
  isActive?: boolean;
}

export interface MapOptionOutPutPagedResultDto {
  items?: MapOptionOutPut[] | null;
  /** @format int64 */
  totalCount?: number;
}

export interface MapOptionOutPutPagedResultDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: MapOptionOutPutPagedResultDto;
}

/** 待命点类型扩展 */
export interface MapStationExtendDto {
  homeType?: HomeGroupType;
  /**
   * 待命点组号
   * @format int32
   */
  homeGroup?: number;
  /**
   * 优先级
   * @format int32
   */
  homePriority?: number;
  /** 扩展字段 */
  extraProperties?: Record<string, any>;
}

/** 区块信息 */
export interface MapStationOutput {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  type?: BlockType;
  /** 区块名称 */
  blockName?: string | null;
  /**
   * 楼层
   * @format int32
   */
  floor?: number;
  /** 边界 */
  border?: string | null;
  /** 扩展 */
  mapBlockExtend?: MapBlockExtendDto;
  /** 区块详情 */
  mapBlockDetails?: MapBlockDetailDto[] | null;
}

export interface MapStationOutputPagedResultDto {
  items?: MapStationOutput[] | null;
  /** @format int64 */
  totalCount?: number;
}

export interface MapStationOutputPagedResultDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: MapStationOutputPagedResultDto;
}

export interface MapStationOutputServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  /** 区块信息 */
  data?: MapStationOutput;
}

/** 库位 */
export interface MapStorageOutPut {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /**
   * 点位编号
   * @format int32
   */
  pointId?: number;
  type?: VertexType;
  state?: GoodsState;
}

export interface MapStorageOutPutPagedResultDto {
  items?: MapStorageOutPut[] | null;
  /** @format int64 */
  totalCount?: number;
}

export interface MapStorageOutPutPagedResultDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: MapStorageOutPutPagedResultDto;
}

export interface MapStorageOutPutServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  /** 库位 */
  data?: MapStorageOutPut;
}

/** 点位信息表 */
export interface MapVertexOutputDto {
  /**
   * 点位
   * @format int32
   */
  pointId?: number;
  vertexType?: VertexType;
  /**
   * X坐标
   * @format double
   */
  x?: number;
  /**
   * Y坐标
   * @format double
   */
  y?: number;
}

export interface MethodParameterApiDescriptionModel {
  name?: string | null;
  typeAsString?: string | null;
  type?: string | null;
  typeSimple?: string | null;
  isOptional?: boolean;
  defaultValue?: any;
}

export interface MissionItem {
  /** @format uuid */
  id?: string;
  extraProperties?: Record<string, any>;
  concurrencyStamp?: string | null;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /** @format date-time */
  lastModificationTime?: string | null;
  /** @format uuid */
  lastModifierId?: string | null;
  orderItemCode?: string | null;
  /** @format int32 */
  missionItemSerial?: number;
  /** @format uuid */
  missionId?: string;
  /** @format int32 */
  areaID?: number;
  type?: MissionType;
  missionItemType?: MissionItemType;
  missionItemState?: MissionItemState;
  /** @maxLength 128 */
  itemStateDescription?: string | null;
  /** @format int32 */
  destination?: number;
  /** @format int32 */
  vehicleNum?: number;
  /** @format int32 */
  vehicleChassisNum?: number;
  action?: ActionType;
  /** @format int32 */
  axisId?: number;
  /** @format int32 */
  headingAngle?: number;
  isActionDebug?: boolean;
  /** @format int32 */
  priority?: number;
  /** @format date-time */
  completeTime?: string | null;
  /** @format date-time */
  activeTime?: string | null;
  platformSource?: PlatformSource;
  /** @maxLength 128 */
  description?: string | null;
}

export interface MissionItemOutput {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /** 子任务订单编号 */
  orderItemCode?: string | null;
  /**
   * 任务编号
   * @format uuid
   */
  missionId?: string;
  /**
   * 任务区域
   * @format int32
   */
  areaID?: number;
  /**
   * Command在Job的Index
   * @format int32
   */
  commandIndex?: number;
  type?: MissionType;
  missionItemType?: MissionItemType;
  missionItemState?: MissionItemState;
  /** 子任务项状态描述 */
  itemStateDescription?: string | null;
  /**
   * 目标点
   * @format int32
   */
  destination?: number;
  /**
   * 车辆编号
   * @format int32
   */
  vehicleNum?: number;
  /**
   * 车辆类型
   * @format int32
   */
  vehicleChassisNum?: number;
  action?: ActionType;
  /**
   * 滚轴编号
   * @format int32
   */
  axisId?: number;
  /**
   * 目的点停车角度
   * @format int32
   */
  headingAngle?: number;
  /** 轴动作调试 */
  isActionDebug?: boolean;
  /**
   * 优先级
   * @format int32
   */
  priority?: number;
  /**
   * 子任务项完成时间
   * @format date-time
   */
  completeTime?: string | null;
  /**
   * 子任务项激活时间
   * @format date-time
   */
  activeTime?: string | null;
  platformSource?: PlatformSource;
  /** 平任务台来源描述 */
  platformSourceDescription?: string | null;
  /** 相关描述 */
  description?: string | null;
}

export interface MissionItemOutputListServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: MissionItemOutput[] | null;
}

export interface MissionItemOutputServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: MissionItemOutput;
}

/** @format int32 */
export enum MissionItemState {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value8 = 8,
}

/** @format int32 */
export enum MissionItemType {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

export interface MissionOutput {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /**
   *  第三方订单id
   * [WCS下发,其他系统产生]
   * @format uuid
   */
  orderCode?: string;
  /**
   * 任务编号
   * @format int32
   */
  taskSerial?: number;
  missionType?: MissionType;
  missionState?: MissionState;
  /** 自动结束任务 */
  isAutoCompleted?: boolean;
  /**
   * 任务区域
   * @format int32
   */
  areaID?: number;
  /**
   * 起点
   * @format int32
   */
  start?: number;
  /**
   * 目标点
   * @format int32
   */
  destination?: number;
  /**
   * 任务优先级
   * @format int32
   */
  priority?: number;
  /**
   * 任务完成时间
   * @format date-time
   */
  completedTime?: string | null;
  /**
   * 任务激活时间
   * @format date-time
   */
  activedTime?: string | null;
  platformSource?: PlatformSource;
  /** 平任务台来源描述 */
  platformSourceDescription?: string | null;
  /** 任务状态描述 */
  stateDescription?: string | null;
  /** 任务类型描述 */
  missionTypeDescription?: string | null;
  /** 描述 */
  description?: string | null;
  /** 子任务项 */
  missionItems?: MissionItem[] | null;
}

export interface MissionOutputListServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: MissionOutput[] | null;
}

export interface MissionOutputPagedResultDto {
  items?: MissionOutput[] | null;
  /** @format int64 */
  totalCount?: number;
}

export interface MissionOutputPagedResultDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: MissionOutputPagedResultDto;
}

export interface MissionOutputServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: MissionOutput;
}

/** @format int32 */
export enum MissionState {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

/** @format int32 */
export enum MissionType {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

/** 充电策略修改 */
export interface ModifyChargingStrategyInput {
  /** @format uuid */
  id?: string;
  /** 充电策略名称 */
  name?: string | null;
  /** 小车编号 */
  carrierKeys?: string | null;
  /**
   * 低电量百分比
   * @format int32
   */
  minLimitBattery?: number | null;
  /**
   * 高电量百分比
   * @format int32
   */
  maxLimitBattery?: number | null;
  /**
   * 0点
   * @format int32
   */
  startHour?: number;
  /**
   * 24点
   * @format int32
   */
  endHour: number;
  /**
   * 开始分钟
   * @format int32
   */
  startMinute?: number;
  /**
   * 结束分钟
   * @format int32
   */
  endMinute?: number;
  /**
   * 小车类型
   * @format int32
   */
  vehicleChassisNum?: number;
  /**
   * 任务优先级
   * @format int32
   */
  priority?: number;
  /**
   * 规则优先级,由小到大,优先级越高
   * @format int32
   */
  level?: number;
  /**
   * 充电完成时间（分钟）
   * @format int32
   */
  completeTime?: number;
  /**
   * 充电完成百分比1~100
   * @format int32
   */
  completePercent?: number;
  /** 充电桩点位 */
  pileKeys?: string | null;
  /** 充电完是否回待命点 */
  isGoHome?: boolean;
  /**
   * 待命点位
   * @format int32
   */
  homeKey?: number | null;
  /**
   * 充电策略类型
   * 0 普通充电策略 1强制充电策略
   * @format int32
   */
  strategyType?: number;
}

/** 修改通信配置 */
export interface ModifyCommunicationOptionInput {
  /** @format uuid */
  id?: string;
  /** 通道的类型 */
  connectionType?: string | null;
  /** 通道名称，通过名称初始化某一类型的通道 */
  name?: string | null;
  /**
   * 端口号
   * @format int32
   */
  port?: number;
  /** 主机IP */
  host?: string | null;
  /** 通道类型，通过反射实例化具体类 */
  channelType?: string | null;
  /** 是否启用 */
  enable?: boolean;
}

export interface ModifyForceChargingStrategyInput {
  /** @format uuid */
  id?: string;
  /**
   * 强制充满电间隔天数
   * @format int32
   */
  forceChargingDays?: number;
}

/** 修改地图的激活状态Dto */
export interface ModifyMapOptionActiveStateInput {
  /** @format uuid */
  id?: string;
  /** 激活 */
  isActive?: boolean;
}

/** 修改 */
export interface ModifyMapStationInput {
  /** @format uuid */
  id?: string;
  /**
   * 点位编号
   * @format int32
   */
  pointId?: number;
  type?: VertexType;
  /** 组号 */
  groups?: number[] | null;
  /** 车辆类型 */
  vehicleTypes?: number[] | null;
  /** 车辆编号 */
  vehicleKeys?: number[] | null;
  /**
   * 优先级
   * @format int32
   */
  priority?: number;
  /** 待命点类型扩展 */
  mapStationExtend?: MapStationExtendDto;
}

/** 修改实体 */
export interface ModifyMapStorageInput {
  /** @format uuid */
  id?: string;
  state?: GoodsState;
}

/** 修改优先级 */
export interface ModifyMissionPriorityInput {
  /** @format uuid */
  id?: string;
  /**
   * 优先级
   * @format int32
   */
  priority?: number;
}

/** 修改任务状态 */
export interface ModifyMissionStateInput {
  /** @format uuid */
  id?: string;
  missionState?: MissionState;
  platformSource?: PlatformSource;
}

/** 修改路径事件Dto */
export interface ModifyRouteEventOptionInput {
  /** @format uuid */
  id?: string;
  /**
   * 事件编号
   * @format uuid
   */
  eventID?: string;
  /** 事件描述 */
  description?: string | null;
  routeEventType?: RouteEventType;
  eventTriggerTime?: EventTriggerStage;
  /**
   * 事件优先级
   * @format int32
   */
  priority?: number;
  /**
   * 超时时间（秒）
   * @format int32
   */
  timeout?: number;
  routeType?: RouteType;
  /**
   * 路径参数Key
   * @format int32
   */
  routeKey?: number;
  /**
   * 车辆编号
   * @format int32
   */
  vehicleNum?: number;
  /**
   * 车辆类型
   * @format int32
   */
  vehicleChassisNum?: number;
}

/** 车辆类型修改输入信息 */
export interface ModifyVehicleChassisInput {
  /** @format uuid */
  id?: string;
  /** 车辆类型名称 */
  vehicleChassisName?: string | null;
  vehicleType?: VehicleType;
  /**
   * 托盘编号
   * @format uuid
   */
  vehicleTrayId?: string;
  /**
   * X轴安全距离
   * @format double
   */
  safeX?: number;
  /**
   * Y轴安全距离
   * @format double
   */
  safeY?: number;
  /**
   * 车辆最大速度
   * @format int32
   */
  speedMax?: number;
  /**
   * 强制充电电量百分比
   * @format int32
   */
  forcedCharge?: number;
  /**
   * 制动加速度
   * @format int32
   */
  brakingAcceleration?: number;
  /**
   * 强制充满电天数计算
   * @format int32
   */
  fullChargeDay?: number;
  /**
   * 空载形状中心偏移X(相对控制中心)
   * @format double
   */
  noLoadOffsetX?: number;
  /**
   * 空载形状中心偏移Y(相对控制中心)
   * @format double
   */
  noLoadOffsetY?: number;
  /**
   * 空载宽度
   * @format double
   */
  noLoadWidth?: number;
  /**
   * 空载长度
   * @format double
   */
  noLoadLength?: number;
  /** 车辆svg模型文件名 */
  chassisModel?: string | null;
  /**
   * 超时时间
   * @format int32
   */
  timeout?: number;
  /**
   * 空闲时间(回待命点)
   * @format int32
   */
  freeSeconds?: number;
}

/** 车辆信息修改输入信息 */
export interface ModifyVehicleInput {
  /** @format uuid */
  id?: string;
  /**
   * 车辆类型id
   * @format int32
   */
  vehicleChassisNum?: number;
  /** 车辆名称 */
  vehicleChassisName?: string | null;
  /** 车辆Ip */
  vehicleIp?: string | null;
  /** 激活 */
  isActive?: boolean;
  /** 是否仿真 */
  isSimulation?: boolean;
  /**
   * 满载形状中心偏移X(相对控制中心)
   * @format double
   */
  loadOffsetX?: number;
  /**
   * 满载形状中心偏移Y(相对控制中心)
   * @format double
   */
  loadOffsetY?: number;
  /**
   * 满载宽度
   * @format double
   */
  loadWidth?: number;
  /**
   * 满载长度
   * @format double
   */
  loadLength?: number;
  /** 是否自动回待命点 */
  isAutoReHome?: boolean;
}

/** 车辆状态修改输入信息 */
export interface ModifyVehicleTrayInput {
  /** @format uuid */
  id?: string;
  /** 托盘名称 */
  name?: string | null;
  /**
   * 托盘长
   * @format double
   */
  length?: number;
  /**
   * 托盘宽
   * @format double
   */
  width?: number;
}

export interface ModuleApiDescriptionModel {
  rootPath?: string | null;
  remoteServiceName?: string | null;
  controllers?: Record<string, ControllerApiDescriptionModel>;
}

export interface ModuleExtensionDto {
  entities?: Record<string, EntityExtensionDto>;
  configuration?: Record<string, any>;
}

export interface MultiTenancyInfoDto {
  isEnabled?: boolean;
}

export interface NameValue {
  name?: string | null;
  value?: string | null;
}

export interface ObjectExtensionsDto {
  modules?: Record<string, ModuleExtensionDto>;
  enums?: Record<string, ExtensionEnumDto>;
}

export interface OptionDto {
  guid?: string | null;
  projectName?: string | null;
  mapName?: string | null;
  mapGuid?: string | null;
  fileName?: string | null;
  /** @format int32 */
  revision?: number;
  /** @format int32 */
  mapMinX?: number;
  /** @format int32 */
  mapMaxX?: number;
  /** @format int32 */
  mapMinY?: number;
  /** @format int32 */
  mapMaxY?: number;
  isActive?: boolean;
}

export interface ParameterApiDescriptionModel {
  nameOnMethod?: string | null;
  name?: string | null;
  jsonName?: string | null;
  type?: string | null;
  typeSimple?: string | null;
  isOptional?: boolean;
  defaultValue?: any;
  constraintTypes?: string[] | null;
  bindingSourceId?: string | null;
  descriptorName?: string | null;
}

export interface PerformanceDto {
  /** @format int32 */
  id?: number;
  /**
   * 空闲时间
   * @format double
   */
  freeTime?: number;
  /**
   * 运行时间
   * @format double
   */
  workTime?: number;
  /**
   * 交管时间
   * @format double
   */
  trafficTime?: number;
  /**
   * 充电时间
   * @format double
   */
  chargeTime?: number;
}

/** 权限输出信息 */
export interface PermissionOutput {
  /** @format uuid */
  id?: string;
  /** 权限名称 */
  name?: string | null;
  /** 权限显示名称 */
  displayName?: string | null;
  /** 权限Code */
  code?: string | null;
  /**
   * 创建时间
   * @format date-time
   */
  creationTime?: string;
}

export interface PermissionOutputListServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: PermissionOutput[] | null;
}

/** @format int32 */
export enum PlatformSource {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

export interface PropertyApiDescriptionModel {
  name?: string | null;
  jsonName?: string | null;
  type?: string | null;
  typeSimple?: string | null;
  isRequired?: boolean;
  /** @format int32 */
  minLength?: number | null;
  /** @format int32 */
  maxLength?: number | null;
  minimum?: string | null;
  maximum?: string | null;
  regex?: string | null;
}

export interface RemoteServiceErrorInfo {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  data?: Record<string, any>;
  validationErrors?: RemoteServiceValidationErrorInfo[] | null;
}

export interface RemoteServiceErrorResponse {
  error?: RemoteServiceErrorInfo;
}

export interface RemoteServiceValidationErrorInfo {
  message?: string | null;
  members?: string[] | null;
}

export interface ReportDetailDto {
  /** 标题 */
  title?: string | null;
  /** 纵坐标值 */
  list?: number[] | null;
}

export interface ReportResponseDTO {
  /** 横坐标值 */
  labels?: string[] | null;
  /** 纵坐标值 */
  values?: ReportDetailDto[] | null;
}

export interface ReportResponseDTOServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: ReportResponseDTO;
}

export interface ReportResponseDTOs {
  /** 横坐标值 */
  labels?: string[] | null;
  /** 纵坐标值 */
  values?: ReportDetailDto[] | null;
  /**
   * 单日充电次数
   * @format int32
   */
  dayCount?: number;
  /**
   * 时间段内累计充电次数
   * @format int32
   */
  grandTotal?: number;
}

export interface ReportResponseDTOsServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: ReportResponseDTOs;
}

export interface ReturnValueApiDescriptionModel {
  type?: string | null;
  typeSimple?: string | null;
}

export interface Role {
  /** @format uuid */
  id?: string;
  extraProperties?: Record<string, any>;
  concurrencyStamp?: string | null;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /** @format date-time */
  lastModificationTime?: string | null;
  /** @format uuid */
  lastModifierId?: string | null;
  isDeleted?: boolean;
  /** @format uuid */
  deleterId?: string | null;
  /** @format date-time */
  deletionTime?: string | null;
  /**
   * @minLength 1
   * @maxLength 64
   */
  name: string;
  isAllowEditPermission?: boolean;
  isAllowDelete?: boolean;
  rolePermissions?: RolePermission[] | null;
}

/** 角色输出信息 */
export interface RoleOutput {
  /** @format uuid */
  id?: string;
  /** 角色名称 */
  name?: string | null;
  /**
   * 创建时间
   * @format date-time
   */
  creationTime?: string;
}

export interface RoleOutputListServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: RoleOutput[] | null;
}

export interface RoleOutputPagedResultDto {
  items?: RoleOutput[] | null;
  /** @format int64 */
  totalCount?: number;
}

export interface RoleOutputPagedResultDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: RoleOutputPagedResultDto;
}

export interface RoleOutputServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  /** 角色输出信息 */
  data?: RoleOutput;
}

export interface RolePermission {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /** @format date-time */
  lastModificationTime?: string | null;
  /** @format uuid */
  lastModifierId?: string | null;
  isDeleted?: boolean;
  /** @format uuid */
  deleterId?: string | null;
  /** @format date-time */
  deletionTime?: string | null;
  /** @format uuid */
  roleId?: string;
  /** @format uuid */
  permissionId?: string;
}

/** 路径事件配置项目数据 */
export interface RouteEventOptionOutput {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /**
   * 事件编号
   * @format uuid
   */
  eventID?: string;
  /** 事件描述 */
  description?: string | null;
  routeEventType?: RouteEventType;
  eventTriggerTime?: EventTriggerStage;
  /**
   * 事件优先级
   * @format int32
   */
  priority?: number;
  /**
   * 超时时间（秒）
   * @format int32
   */
  timeout?: number;
  routeType?: RouteType;
  /**
   * 路径参数Key
   * @format int32
   */
  routeKey?: number;
}

export interface RouteEventOptionOutputPagedResultDto {
  items?: RouteEventOptionOutput[] | null;
  /** @format int64 */
  totalCount?: number;
}

export interface RouteEventOptionOutputPagedResultDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: RouteEventOptionOutputPagedResultDto;
}

export interface RouteEventRecordOutput {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /**
   * 车号
   * @format int32
   */
  vehicleNum?: number;
  /**
   * 任务id
   * @format uuid
   */
  missionId?: string;
  /**
   * 子任务id
   * @format uuid
   */
  missionItemId?: string;
  /**
   * 事件id
   * @format uuid
   */
  eventId?: string;
  routeEventResult?: RouteEventResult;
  /** 描述 */
  description?: string | null;
}

export interface RouteEventRecordOutputListServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: RouteEventRecordOutput[] | null;
}

export interface RouteEventRecordOutputPagedResultDto {
  items?: RouteEventRecordOutput[] | null;
  /** @format int64 */
  totalCount?: number;
}

export interface RouteEventRecordOutputPagedResultDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: RouteEventRecordOutputPagedResultDto;
}

/** @format int32 */
export enum RouteEventResult {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
}

/** @format int32 */
export enum RouteEventType {
  Value1 = 1,
  Value2 = 2,
}

/** @format int32 */
export enum RouteType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

export interface ServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: any;
}

export interface TimeZone {
  iana?: IanaTimeZone;
  windows?: WindowsTimeZone;
}

export interface TimingDto {
  timeZone?: TimeZone;
}

export interface TypeApiDescriptionModel {
  baseType?: string | null;
  isEnum?: boolean;
  enumNames?: string[] | null;
  enumValues?: any[] | null;
  genericArguments?: string[] | null;
  properties?: PropertyApiDescriptionModel[] | null;
}

/** 用户（含角色）输出信息 */
export interface UserWithRoleOutput {
  /** @format uuid */
  id?: string;
  /** 姓名 */
  name?: string | null;
  /** 用户名 */
  username?: string | null;
  /** 邮箱 */
  email?: string | null;
  /** 手机号 */
  phone?: string | null;
  /** 是否启用 */
  isActive?: boolean;
  /**
   * 角色Id
   * @format uuid
   */
  roleId?: string;
  /** 角色名称 */
  roleName?: string | null;
  /**
   * 创建时间
   * @format date-time
   */
  creationTime?: string;
}

export interface UserWithRoleOutputPagedResultDto {
  items?: UserWithRoleOutput[] | null;
  /** @format int64 */
  totalCount?: number;
}

export interface UserWithRoleOutputServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  /** 用户（含角色）输出信息 */
  data?: UserWithRoleOutput;
}

export interface VehicleChassisOutput {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /**
   * 车辆类型编号
   * @format int32
   */
  vehicleChassisNum?: number;
  /** 车辆类型名称 */
  vehicleChassisName?: string | null;
  vehicleType?: VehicleType;
  /**
   * 托盘编号
   * @format uuid
   */
  vehicleTrayId?: string;
  /**
   * X轴安全距离
   * @format double
   */
  safeX?: number;
  /**
   * Y轴安全距离
   * @format double
   */
  safeY?: number;
  /**
   * 车辆最大速度
   * @format int32
   */
  speedMax?: number;
  /**
   * 强制充满电
   * @format int32
   */
  forcedCharge?: number;
  /**
   * 制动加速度
   * @format int32
   */
  brakingAcceleration?: number;
  /**
   * 强制充满电天数计算
   * @format int32
   */
  fullChargeDay?: number;
  /**
   * 空载形状中心偏移X(相对控制中心)
   * @format double
   */
  noLoadOffsetX?: number;
  /**
   * 空载形状中心偏移Y(相对控制中心)
   * @format double
   */
  noLoadOffsetY?: number;
  /**
   * 空载宽度
   * @format double
   */
  noLoadWidth?: number;
  /**
   * 空载长度
   * @format double
   */
  noLoadLength?: number;
  /** 车辆svg模型文件名 */
  chassisModel?: string | null;
  /**
   * 超时时间
   * @format int32
   */
  timeout?: number;
  /**
   * 空闲时间(回待命点)
   * @format int32
   */
  freeSeconds?: number;
}

export interface VehicleChassisOutputListServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: VehicleChassisOutput[] | null;
}

export interface VehicleChassisOutputPagedResultDto {
  items?: VehicleChassisOutput[] | null;
  /** @format int64 */
  totalCount?: number;
}

export interface VehicleChassisOutputPagedResultDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: VehicleChassisOutputPagedResultDto;
}

/** 车型分页入参信息 */
export interface VehicleChassisPageInput {
  /**
   * @format int32
   * @min 1
   * @max 2147483647
   */
  maxResultCount?: number;
  /**
   * @format int32
   * @min 0
   * @max 2147483647
   */
  skipCount?: number;
  sorting?: string | null;
  /**
   * 车型编号
   * @format int32
   */
  vehicleChassisNum?: number;
  /** 车型名称 */
  vehicleChassisName?: string | null;
}

/** 车辆DTO */
export interface VehicleOutput {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /** @format date-time */
  lastModificationTime?: string | null;
  /** @format uuid */
  lastModifierId?: string | null;
  isDeleted?: boolean;
  /** @format uuid */
  deleterId?: string | null;
  /** @format date-time */
  deletionTime?: string | null;
  /**
   * 车辆编号
   * @format int32
   */
  vehicleNum?: number;
  /**
   * 车辆类型id
   * @format int32
   */
  vehicleChassisId?: number;
  /** 车辆名称 */
  vehicleChassisName?: string | null;
  /** 车辆Ip */
  vehicleIp?: string | null;
  /** 激活 */
  isActive?: boolean;
  /** 是否仿真 */
  isSimulation?: boolean;
  /**
   * 满载形状中心偏移X(相对控制中心)
   * @format double
   */
  loadOffsetX?: number;
  /**
   * 满载形状中心偏移Y(相对控制中心)
   * @format double
   */
  loadOffsetY?: number;
  /**
   * 满载宽度
   * @format double
   */
  loadWidth?: number;
  /**
   * 满载长度
   * @format double
   */
  loadLength?: number;
  /** 是否自动回待命点 */
  isAutoReHome?: boolean;
}

export interface VehicleOutputListServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: VehicleOutput[] | null;
}

export interface VehicleOutputPagedResultDto {
  items?: VehicleOutput[] | null;
  /** @format int64 */
  totalCount?: number;
}

export interface VehicleOutputPagedResultDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: VehicleOutputPagedResultDto;
}

/** 车辆分页查询 */
export interface VehiclePageInput {
  /**
   * @format int32
   * @min 1
   * @max 2147483647
   */
  maxResultCount?: number;
  /**
   * @format int32
   * @min 0
   * @max 2147483647
   */
  skipCount?: number;
  sorting?: string | null;
  /**
   * 车辆编号
   * @format int32
   */
  vehicleNum?: number;
  /**
   * 车辆类型
   * @format int32
   */
  vehicleChassisNum?: number;
  /** 激活 */
  isActive?: boolean | null;
  /** 是否仿真 */
  isSimulation?: boolean | null;
}

/** 车辆状态输出信息 */
export interface VehicleStateOutput {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /** @format date-time */
  lastModificationTime?: string | null;
  /** @format uuid */
  lastModifierId?: string | null;
  isDeleted?: boolean;
  /** @format uuid */
  deleterId?: string | null;
  /** @format date-time */
  deletionTime?: string | null;
  /**
   * 车号
   * @format int32
   */
  vehicleNum?: number;
  /**
   * 心跳信号值
   * @format int32
   */
  heart?: number;
  routeType?: RouteType;
  /**
   * 路径参数Key
   * @format int32
   */
  routeKey?: number;
  /**
   * 线偏移
   * @format int32
   */
  rounteCompeleteRate?: number;
  /**
   * 小车X坐标
   * @format double
   */
  x?: number;
  /**
   * 小车Y坐标
   * @format double
   */
  y?: number;
  /**
   * 小车Z坐标
   * @format double
   */
  z?: number;
  /**
   * 车头与X轴夹角
   * @format double
   */
  angle?: number;
  /**
   * 速度
   * @format double
   */
  speed?: number;
  /**
   * 电池参数
   * @format int32
   */
  elecQuantity?: number;
  energyState?: EnergyState;
  controlState?: ControlState;
  deviceState?: DeviceState;
  availableState?: AvailableEnum;
  missionState?: MissionState;
  /**
   * 接收到的任务流水号
   * @format int32
   */
  receiveSerial?: number;
  /** 在线 */
  isInSystem?: boolean;
  /** 货物状态 */
  isHasGoods?: boolean;
  /** 是否交管上线 */
  isTrafficOnline?: boolean;
  /** 是否仿真车辆 */
  isSimulation?: boolean;
  /**
   * 交管小车编号
   * 无交管为0
   * @format int32
   */
  trafficControlCar?: number;
  /** 车辆是否空闲 */
  isFree?: boolean;
  /** 条形码 */
  barCode?: string | null;
  /** 通道令牌 */
  token?: string | null;
  /**
   * 叉尺伸出
   * @format int32
   */
  forkReach?: number;
  /**
   * 叉臂高度
   * @format int32
   */
  forkHeight?: number;
  /**
   * 状态
   * @format int32
   */
  abnormalState?: number;
  /**
   * 急停状态
   * @format int32
   */
  emergencyStatus?: number;
  /**
   * 天眼检测
   * @format int32
   */
  skyVisionCheck?: number;
  /**
   * 调度状态
   * @format int32
   */
  schedulingStatus?: number;
  /**
   * 充电状态
   * @format int32
   */
  chargeStatus?: number;
  /**
   * 轴状态
   * @format int32
   */
  axisStatus?: number;
}

export interface VehicleStateOutputListServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: VehicleStateOutput[] | null;
}

export interface VehicleStateOutputPagedResultDto {
  items?: VehicleStateOutput[] | null;
  /** @format int64 */
  totalCount?: number;
}

export interface VehicleStateOutputPagedResultDtoServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: VehicleStateOutputPagedResultDto;
}

/** 车辆状态分页输入信息 */
export interface VehicleStatePageInput {
  /**
   * @format int32
   * @min 1
   * @max 2147483647
   */
  maxResultCount?: number;
  /**
   * @format int32
   * @min 0
   * @max 2147483647
   */
  skipCount?: number;
  sorting?: string | null;
  /**
   * 车号
   * @format int32
   */
  vehicleNum?: number;
}

/** 车辆托盘配置 */
export interface VehicleTrayOutput {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  creationTime?: string;
  /** @format uuid */
  creatorId?: string | null;
  /** @format date-time */
  lastModificationTime?: string | null;
  /** @format uuid */
  lastModifierId?: string | null;
  isDeleted?: boolean;
  /** @format uuid */
  deleterId?: string | null;
  /** @format date-time */
  deletionTime?: string | null;
  /** 托盘名称 */
  name?: string | null;
  /**
   * 托盘长
   * @format double
   */
  length?: number;
  /**
   * 托盘宽
   * @format double
   */
  width?: number;
}

export interface VehicleTrayOutputListServicesResult {
  /** @format int32 */
  code?: number;
  successful?: boolean;
  message?: string | null;
  data?: VehicleTrayOutput[] | null;
}

/** @format int32 */
export enum VehicleType {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value8 = 8,
  Value9 = 9,
  Value10 = 10,
}

/** @format int32 */
export enum VertexType {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
}

export interface WindowsTimeZone {
  timeZoneId?: string | null;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Mw.Hive 接口文档
 * @version v1
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags AdminUser
     * @name V1CreateAdminUserCreate
     * @summary 创建管理员
     * @request POST:/api/v1/CreateAdminUser
     * @secure
     */
    v1CreateAdminUserCreate: (data: CreateAdminUserInput, params: RequestParams = {}) =>
      this.request<AdminUserOutput, any>({
        path: `/api/v1/CreateAdminUser`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminUser
     * @name V1DeleteAdminUserDelete
     * @summary 删除管理员
     * @request DELETE:/api/v1/DeleteAdminUser
     * @secure
     */
    v1DeleteAdminUserDelete: (
      query?: {
        /** @format uuid */
        adminUserId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/DeleteAdminUser`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags AdminUser
     * @name V1GetPageListAdminUsersList
     * @summary 获取管理员列表
     * @request GET:/api/v1/GetPageListAdminUsers
     * @secure
     */
    v1GetPageListAdminUsersList: (
      query?: {
        /** 是否启用 */
        IsActive?: boolean;
        /** 查询关键字 */
        Keyword?: string;
        Sorting?: string;
        /**
         * @format int32
         * @min 0
         * @max 2147483647
         */
        SkipCount?: number;
        /**
         * @format int32
         * @min 1
         * @max 2147483647
         */
        MaxResultCount?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AdminUserOutputPagedResultDtoServicesResult, any>({
        path: `/api/v1/GetPageListAdminUsers`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ChargingRecord
     * @name V1ChargingRecordList
     * @summary 充电策略分页查询
     * @request GET:/api/v1/ChargingRecord
     * @secure
     */
    v1ChargingRecordList: (
      query?: {
        /**
         * 充电开始查询开始时间
         * @format date-time
         */
        ChargingStartTime?: string;
        /**
         * 充电开始查询结束时间
         * @format date-time
         */
        ChargingEndTime?: string;
        /**
         * 充电开始时间
         * @format date-time
         */
        ChargingCompleteStartTime?: string;
        /**
         * 充电开始时间
         * @format date-time
         */
        ChargingCompleteEndTime?: string;
        /**
         * 小车编号
         * @format int32
         */
        VehicleNum?: number;
        /** 强制充电 */
        IsForce?: boolean;
        /** 强制充电 */
        ChargingState?: ChargingState;
        Sorting?: string;
        /**
         * @format int32
         * @min 0
         * @max 2147483647
         */
        SkipCount?: number;
        /**
         * @format int32
         * @min 1
         * @max 2147483647
         */
        MaxResultCount?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ChargingRecordOutputPagedResultDtoServicesResult, any>({
        path: `/api/v1/ChargingRecord`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ChargingStrategy
     * @name V1ChargingStrategyGetAsyncList
     * @summary 查询充电策略
     * @request GET:/api/v1/ChargingStrategy/GetAsync
     * @secure
     */
    v1ChargingStrategyGetAsyncList: (
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ChargingStrategyOutputServicesResult, any>({
        path: `/api/v1/ChargingStrategy/GetAsync`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ChargingStrategy
     * @name V1ChargingStrategyGetListAsyncList
     * @summary 查询充电策略集合
     * @request GET:/api/v1/ChargingStrategy/GetListAsync
     * @secure
     */
    v1ChargingStrategyGetListAsyncList: (
      query?: {
        /** 小车编号 */
        CarrierKeys?: string;
        /**
         * 小车类型编号
         * @format int32
         */
        VehicleChassisNum?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ChargingStrategyOutputListServicesResult, any>({
        path: `/api/v1/ChargingStrategy/GetListAsync`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ChargingStrategy
     * @name V1ChargingStrategyGetPagedListAsyncList
     * @summary 充电策略分页查询
     * @request GET:/api/v1/ChargingStrategy/GetPagedListAsync
     * @secure
     */
    v1ChargingStrategyGetPagedListAsyncList: (
      query?: {
        /** 小车编号 */
        CarrierKeys?: string;
        /**
         * 小车类型
         * @format int32
         */
        VehicleChassisNum?: number;
        Sorting?: string;
        /**
         * @format int32
         * @min 0
         * @max 2147483647
         */
        SkipCount?: number;
        /**
         * @format int32
         * @min 1
         * @max 2147483647
         */
        MaxResultCount?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ChargingStrategyOutputPagedResultDtoServicesResult, any>({
        path: `/api/v1/ChargingStrategy/GetPagedListAsync`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ChargingStrategy
     * @name V1ChargingStrategyCreateAsyncCreate
     * @summary 创建充电策略
     * @request POST:/api/v1/ChargingStrategy/CreateAsync
     * @secure
     */
    v1ChargingStrategyCreateAsyncCreate: (data: CreateChargingStrategyInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/ChargingStrategy/CreateAsync`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ChargingStrategy
     * @name V1ChargingStrategyModifyCharginStrategyAsyncCreate
     * @summary 修改普通充电策略
     * @request POST:/api/v1/ChargingStrategy/ModifyCharginStrategyAsync
     * @secure
     */
    v1ChargingStrategyModifyCharginStrategyAsyncCreate: (
      data: ModifyChargingStrategyInput,
      params: RequestParams = {},
    ) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/ChargingStrategy/ModifyCharginStrategyAsync`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ChargingStrategy
     * @name V1ChargingStrategyModifyForceChargingStrategyAsyncCreate
     * @summary 修改强制充电策略
     * @request POST:/api/v1/ChargingStrategy/ModifyForceChargingStrategyAsync
     * @secure
     */
    v1ChargingStrategyModifyForceChargingStrategyAsyncCreate: (
      data: ModifyForceChargingStrategyInput,
      params: RequestParams = {},
    ) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/ChargingStrategy/ModifyForceChargingStrategyAsync`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ChargingStrategy
     * @name V1ChargingStrategyDeleteAsyncDelete
     * @summary 删除充电策略
     * @request DELETE:/api/v1/ChargingStrategy/DeleteAsync
     * @secure
     */
    v1ChargingStrategyDeleteAsyncDelete: (
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/ChargingStrategy/DeleteAsync`,
        method: 'DELETE',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Communication
     * @name V1CommunicationCreateCommunicationCreate
     * @summary 创建车辆信息
     * @request POST:/api/v1/Communication/CreateCommunication
     * @secure
     */
    v1CommunicationCreateCommunicationCreate: (data: CreateCommunicationOptionInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Communication/CreateCommunication`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Communication
     * @name V1CommunicationModifyCommunicationUpdate
     * @summary 修改车辆信息
     * @request PUT:/api/v1/Communication/ModifyCommunication
     * @secure
     */
    v1CommunicationModifyCommunicationUpdate: (data: ModifyCommunicationOptionInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Communication/ModifyCommunication`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Communication
     * @name V1CommunicationDeleteCommunicationDelete
     * @summary 删除车辆信息
     * @request DELETE:/api/v1/Communication/DeleteCommunication
     * @secure
     */
    v1CommunicationDeleteCommunicationDelete: (
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Communication/DeleteCommunication`,
        method: 'DELETE',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Map
     * @name V1MapList
     * @summary 分页查询
     * @request GET:/api/v1/Map
     * @secure
     */
    v1MapList: (
      query?: {
        /** 激活 */
        IsActive?: boolean;
        Sorting?: string;
        /**
         * @format int32
         * @min 0
         * @max 2147483647
         */
        SkipCount?: number;
        /**
         * @format int32
         * @min 1
         * @max 2147483647
         */
        MaxResultCount?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<MapOptionOutPutPagedResultDtoServicesResult, any>({
        path: `/api/v1/Map`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Map
     * @name V1MapCreate
     * @summary 新增地图配置
     * @request POST:/api/v1/Map
     * @secure
     */
    v1MapCreate: (data: CreateMapOptionInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Map`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Map
     * @name V1MapUpdate
     * @summary 修改地图激活状态
     * @request PUT:/api/v1/Map
     * @secure
     */
    v1MapUpdate: (data: ModifyMapOptionActiveStateInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Map`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Map
     * @name V1MapUpLoadMapFileCreate
     * @summary 上传地图路径文件
     * @request POST:/api/v1/Map/UpLoadMapFile
     * @secure
     */
    v1MapUpLoadMapFileCreate: (
      data: {
        /** @format binary */
        file?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Map/UpLoadMapFile`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Map
     * @name V1MapDelete
     * @summary 删除地图配置
     * @request DELETE:/api/v1/Map/{id}
     * @secure
     */
    v1MapDelete: (id: string, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Map/${id}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Map
     * @name V1MapPathDetail
     * @summary 获取地图路径
     * @request GET:/api/v1/Map/Path/{start}/{end}
     * @secure
     */
    v1MapPathDetail: (start: number, end: number, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Map/Path/${start}/${end}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Map
     * @name V1MapGetMapDataCreate
     * @summary 获取地图数据
     * @request POST:/api/v1/Map/GetMapData
     * @secure
     */
    v1MapGetMapDataCreate: (params: RequestParams = {}) =>
      this.request<MapDataOutputDtoServicesResult, any>({
        path: `/api/v1/Map/GetMapData`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MapBlock
     * @name V1MapBlockList
     * @summary 分页查询
     * @request GET:/api/v1/Map/Block
     * @secure
     */
    v1MapBlockList: (
      query?: {
        Sorting?: string;
        /**
         * @format int32
         * @min 0
         * @max 2147483647
         */
        SkipCount?: number;
        /**
         * @format int32
         * @min 1
         * @max 2147483647
         */
        MaxResultCount?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<MapStationOutputPagedResultDtoServicesResult, any>({
        path: `/api/v1/Map/Block`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MapBlock
     * @name V1MapBlockCreate
     * @summary 新增配置
     * @request POST:/api/v1/Map/Block
     * @secure
     */
    v1MapBlockCreate: (data: CreateMapBlockInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Map/Block`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MapBlock
     * @name V1MapBlockDelete
     * @summary 删除配置
     * @request DELETE:/api/v1/Map/Block/{id}
     * @secure
     */
    v1MapBlockDelete: (id: string, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Map/Block/${id}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MapStation
     * @name V1MapStationList
     * @summary 分页查询
     * @request GET:/api/v1/Map/Station
     * @secure
     */
    v1MapStationList: (
      query?: {
        /** 站点类型 */
        Type?: VertexType;
        Sorting?: string;
        /**
         * @format int32
         * @min 0
         * @max 2147483647
         */
        SkipCount?: number;
        /**
         * @format int32
         * @min 1
         * @max 2147483647
         */
        MaxResultCount?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<MapStationOutputPagedResultDtoServicesResult, any>({
        path: `/api/v1/Map/Station`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MapStation
     * @name V1MapStationCreate
     * @summary 新增
     * @request POST:/api/v1/Map/Station
     * @secure
     */
    v1MapStationCreate: (data: CreateMapStationInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Map/Station`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MapStation
     * @name V1MapStationUpdate
     * @summary 修改
     * @request PUT:/api/v1/Map/Station
     * @secure
     */
    v1MapStationUpdate: (data: ModifyMapStationInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Map/Station`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MapStation
     * @name V1MapStationDetail
     * @summary 单个查询
     * @request GET:/api/v1/Map/Station/{id}
     * @secure
     */
    v1MapStationDetail: (id: string, params: RequestParams = {}) =>
      this.request<MapStationOutputServicesResult, any>({
        path: `/api/v1/Map/Station/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MapStation
     * @name V1MapStationDelete
     * @summary 删除
     * @request DELETE:/api/v1/Map/Station/{id}
     * @secure
     */
    v1MapStationDelete: (id: string, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Map/Station/${id}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MapStorage
     * @name V1MapMapStorageList
     * @summary 分页查询
     * @request GET:/api/v1/Map/MapStorage
     * @secure
     */
    v1MapMapStorageList: (
      query?: {
        /**
         * 点位编号
         * @format int32
         */
        PointId?: number;
        /** 货物状态 */
        State?: GoodsState;
        Sorting?: string;
        /**
         * @format int32
         * @min 0
         * @max 2147483647
         */
        SkipCount?: number;
        /**
         * @format int32
         * @min 1
         * @max 2147483647
         */
        MaxResultCount?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<MapStorageOutPutPagedResultDtoServicesResult, any>({
        path: `/api/v1/Map/MapStorage`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MapStorage
     * @name V1MapMapStorageUpdate
     * @summary 修改
     * @request PUT:/api/v1/Map/MapStorage
     * @secure
     */
    v1MapMapStorageUpdate: (data: ModifyMapStorageInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Map/MapStorage`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MapStorage
     * @name V1MapMapStorageDetail
     * @summary 单个查询
     * @request GET:/api/v1/Map/MapStorage/{id}
     * @secure
     */
    v1MapMapStorageDetail: (id: string, params: RequestParams = {}) =>
      this.request<MapStorageOutPutServicesResult, any>({
        path: `/api/v1/Map/MapStorage/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mission
     * @name V1MissionGetAsyncList
     * @summary 查询任务
     * @request GET:/api/v1/Mission/GetAsync
     * @secure
     */
    v1MissionGetAsyncList: (
      query?: {
        /** @format uuid */
        guid?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MissionOutputServicesResult, any>({
        path: `/api/v1/Mission/GetAsync`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mission
     * @name V1MissionGetMissionAsyncList
     * @summary 查询任务
     * @request GET:/api/v1/Mission/GetMissionAsync
     * @secure
     */
    v1MissionGetMissionAsyncList: (
      query?: {
        /** @format uuid */
        orderCode?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MissionOutputServicesResult, any>({
        path: `/api/v1/Mission/GetMissionAsync`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mission
     * @name V1MissionGetListAsyncList
     * @summary 查询任务集合
     * @request GET:/api/v1/Mission/GetListAsync
     * @secure
     */
    v1MissionGetListAsyncList: (
      query?: {
        /**
         *  第三方订单id
         * [WCS下发,其他系统产生]
         * @format uuid
         */
        OrderCode?: string;
        /** 任务类型 */
        MissionType?: MissionType;
        /** 任务状态 */
        MissionState?: MissionState;
        /**
         * 开始时间
         * @format date-time
         */
        StartTime?: string;
        /**
         * 结束时间
         * @format date-time
         */
        EndTime?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MissionOutputListServicesResult, any>({
        path: `/api/v1/Mission/GetListAsync`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mission
     * @name V1MissionGetPagedListAsyncList
     * @summary 任务分页查询
     * @request GET:/api/v1/Mission/GetPagedListAsync
     * @secure
     */
    v1MissionGetPagedListAsyncList: (
      query?: {
        /**
         *  第三方订单id
         * [WCS下发,其他系统产生]
         * @format uuid
         */
        OrderCode?: string;
        /** 任务类型 */
        MissionType?: MissionType;
        /** 任务状态 */
        MissionState?: MissionState;
        /**
         * 目标点
         * @format int32
         */
        Destination?: number;
        /** 自动结束任务 */
        IsAutoCompleted?: boolean;
        /**
         * 任务创建开始时间
         * @format date-time
         */
        StartTime?: string;
        /**
         * 任务创建结束时间
         * @format date-time
         */
        EndTime?: string;
        Sorting?: string;
        /**
         * @format int32
         * @min 0
         * @max 2147483647
         */
        SkipCount?: number;
        /**
         * @format int32
         * @min 1
         * @max 2147483647
         */
        MaxResultCount?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<MissionOutputPagedResultDtoServicesResult, any>({
        path: `/api/v1/Mission/GetPagedListAsync`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mission
     * @name V1MissionCreateAsyncCreate
     * @summary 创建任务
     * @request POST:/api/v1/Mission/CreateAsync
     * @secure
     */
    v1MissionCreateAsyncCreate: (data: CreateMissionInput, params: RequestParams = {}) =>
      this.request<GuidServicesResult, any>({
        path: `/api/v1/Mission/CreateAsync`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mission
     * @name V1MissionModifyMissionStateAsyncCreate
     * @summary 修改任务状态
     * @request POST:/api/v1/Mission/ModifyMissionStateAsync
     * @secure
     */
    v1MissionModifyMissionStateAsyncCreate: (data: ModifyMissionStateInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Mission/ModifyMissionStateAsync`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mission
     * @name V1MissionModifyMissionPriorityAsyncCreate
     * @summary 修改任务优先级
     * @request POST:/api/v1/Mission/ModifyMissionPriorityAsync
     * @secure
     */
    v1MissionModifyMissionPriorityAsyncCreate: (data: ModifyMissionPriorityInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Mission/ModifyMissionPriorityAsync`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MissionItem
     * @name V1MissionItemGetAsyncList
     * @summary 查询子任务
     * @request GET:/api/v1/MissionItem/GetAsync
     * @secure
     */
    v1MissionItemGetAsyncList: (
      query?: {
        /** @format uuid */
        guid?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MissionItemOutputServicesResult, any>({
        path: `/api/v1/MissionItem/GetAsync`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MissionItem
     * @name V1MissionItemGetMissionItemAsyncList
     * @summary 查询子任务
     * @request GET:/api/v1/MissionItem/GetMissionItemAsync
     * @secure
     */
    v1MissionItemGetMissionItemAsyncList: (
      query?: {
        orderCode?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MissionItemOutputServicesResult, any>({
        path: `/api/v1/MissionItem/GetMissionItemAsync`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MissionItem
     * @name V1MissionItemGetListAsyncList
     * @summary 查询子任务集合
     * @request GET:/api/v1/MissionItem/GetListAsync
     * @secure
     */
    v1MissionItemGetListAsyncList: (
      query?: {
        /**
         * 任务id
         * @format uuid
         */
        MissionId?: string;
        /** @format uuid */
        Id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MissionItemOutputListServicesResult, any>({
        path: `/api/v1/MissionItem/GetListAsync`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MissionItem
     * @name V1MissionItemCreateAsyncCreate
     * @summary 创建子任务
     * @request POST:/api/v1/MissionItem/CreateAsync
     * @secure
     */
    v1MissionItemCreateAsyncCreate: (data: CreateMissionItemInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/MissionItem/CreateAsync`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MissionItem
     * @name V1MissionItemModifyMissionItemStateAsyncCreate
     * @summary 修改子任务状态
     * @request POST:/api/v1/MissionItem/ModifyMissionItemStateAsync
     * @secure
     */
    v1MissionItemModifyMissionItemStateAsyncCreate: (
      query?: {
        /** 任务状态 */
        missionItemState?: MissionItemState;
        /** @format uuid */
        Id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/MissionItem/ModifyMissionItemStateAsync`,
        method: 'POST',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags MissionItem
     * @name V1MissionItemModifyMissionItemPriorityAsyncCreate
     * @summary 修改子任务优先级
     * @request POST:/api/v1/MissionItem/ModifyMissionItemPriorityAsync
     * @secure
     */
    v1MissionItemModifyMissionItemPriorityAsyncCreate: (
      query?: {
        /**
         * 优先级
         * @format int32
         */
        Priority?: number;
        /** @format uuid */
        Id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/MissionItem/ModifyMissionItemPriorityAsync`,
        method: 'POST',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Permission
     * @name V1GetAllPermissionsList
     * @summary 查询所有的权限
     * @request GET:/api/v1/GetAllPermissions
     * @secure
     */
    v1GetAllPermissionsList: (params: RequestParams = {}) =>
      this.request<PermissionOutputListServicesResult, any>({
        path: `/api/v1/GetAllPermissions`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Report
     * @name V1ReportGetEquipmentTaskList
     * @summary 设备完成任务数
     * @request GET:/api/v1/Report/GetEquipmentTask
     * @secure
     */
    v1ReportGetEquipmentTaskList: (
      query?: {
        /**
         * 开始时间
         * @format date-time
         */
        StartTime?: string;
        /**
         * 结束时间
         * @format date-time
         */
        EndTime?: string;
        /** 时间类型 */
        Type?: DateType;
        /**
         * 车辆ID
         * @format int32
         */
        VehicleNum?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReportResponseDTOServicesResult, any>({
        path: `/api/v1/Report/GetEquipmentTask`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Report
     * @name V1ReportGetAgvTimeRatioList
     * @summary 车辆运行时间占比
     * @request GET:/api/v1/Report/GetAGVTimeRatio
     * @secure
     */
    v1ReportGetAgvTimeRatioList: (
      query?: {
        /**
         * 开始时间
         * @format date-time
         */
        StartTime?: string;
        /**
         * 结束时间
         * @format date-time
         */
        EndTime?: string;
        /** 时间类型 */
        Type?: DateType;
        /**
         * 车辆ID
         * @format int32
         */
        VehicleNum?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AllPerformanceDtoServicesResult, any>({
        path: `/api/v1/Report/GetAGVTimeRatio`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Report
     * @name V1ReportGetAgvEfficiencyList
     * @summary AGV效率统计
     * @request GET:/api/v1/Report/GetAGVEfficiency
     * @secure
     */
    v1ReportGetAgvEfficiencyList: (
      query?: {
        /**
         * 开始时间
         * @format date-time
         */
        StartTime?: string;
        /**
         * 结束时间
         * @format date-time
         */
        EndTime?: string;
        /** 时间类型 */
        Type?: DateType;
        /**
         * 车辆ID
         * @format int32
         */
        VehicleNum?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AllEfficiencyStatisticsDtoServicesResult, any>({
        path: `/api/v1/Report/GetAGVEfficiency`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Report
     * @name V1ReportGetAgvChargeList
     * @summary AGV充电统计
     * @request GET:/api/v1/Report/GetAGVCharge
     * @secure
     */
    v1ReportGetAgvChargeList: (
      query?: {
        /**
         * 开始时间
         * @format date-time
         */
        StartTime?: string;
        /**
         * 结束时间
         * @format date-time
         */
        EndTime?: string;
        /** 时间类型 */
        Type?: DateType;
        /**
         * 车辆ID
         * @format int32
         */
        VehicleNum?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReportResponseDTOsServicesResult, any>({
        path: `/api/v1/Report/GetAGVCharge`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Report
     * @name V1ReportGetAgvTimeCountList
     * @summary AGV时间统计
     * @request GET:/api/v1/Report/GetAgvTimeCount
     * @secure
     */
    v1ReportGetAgvTimeCountList: (
      query?: {
        /**
         * 开始时间
         * @format date-time
         */
        StartTime?: string;
        /**
         * 结束时间
         * @format date-time
         */
        EndTime?: string;
        /** 时间类型 */
        Type?: DateType;
        /**
         * 车辆ID
         * @format int32
         */
        VehicleNum?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<AgvTimeSumDtoListServicesResult, any>({
        path: `/api/v1/Report/GetAgvTimeCount`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Report
     * @name V1ReportGetAgvMissionList
     * @summary AGV任务统计
     * @request GET:/api/v1/Report/GetAgvMission
     * @secure
     */
    v1ReportGetAgvMissionList: (params: RequestParams = {}) =>
      this.request<AgvTaskDtoListServicesResult, any>({
        path: `/api/v1/Report/GetAgvMission`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Report
     * @name V1ReportGetAgvUtilizationList
     * @summary AGV稼动率统计
     * @request GET:/api/v1/Report/GetAgvUtilization
     * @secure
     */
    v1ReportGetAgvUtilizationList: (
      query?: {
        /**
         * 开始时间
         * @format date-time
         */
        StartTime?: string;
        /**
         * 结束时间
         * @format date-time
         */
        EndTime?: string;
        /** 时间类型 */
        Type?: DateType;
        /**
         * 车辆ID
         * @format int32
         */
        VehicleNum?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReportResponseDTOServicesResult, any>({
        path: `/api/v1/Report/GetAgvUtilization`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Report
     * @name V1ReportGetAllAgvUtilizationList
     * @summary AGV稼动率汇总
     * @request GET:/api/v1/Report/GetAllAgvUtilization
     * @secure
     */
    v1ReportGetAllAgvUtilizationList: (params: RequestParams = {}) =>
      this.request<ReportResponseDTOServicesResult, any>({
        path: `/api/v1/Report/GetAllAgvUtilization`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Role
     * @name V1GetRolesList
     * @summary 查询所有角色
     * @request GET:/api/v1/GetRoles
     * @secure
     */
    v1GetRolesList: (params: RequestParams = {}) =>
      this.request<RoleOutputListServicesResult, any>({
        path: `/api/v1/GetRoles`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Role
     * @name V1GetPageListRolesList
     * @summary 角色分页查询
     * @request GET:/api/v1/GetPageListRoles
     * @secure
     */
    v1GetPageListRolesList: (
      query?: {
        /** 角色名称 */
        Name?: string;
        /**
         * 创建时间
         * @format date-time
         */
        CreationTime?: string;
        Sorting?: string;
        /**
         * @format int32
         * @min 0
         * @max 2147483647
         */
        SkipCount?: number;
        /**
         * @format int32
         * @min 1
         * @max 2147483647
         */
        MaxResultCount?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<RoleOutputPagedResultDtoServicesResult, any>({
        path: `/api/v1/GetPageListRoles`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Role
     * @name V1CreateRoleCreate
     * @summary 新增角色
     * @request POST:/api/v1/CreateRole
     * @secure
     */
    v1CreateRoleCreate: (data: CreateRoleInput, params: RequestParams = {}) =>
      this.request<RoleOutputServicesResult, any>({
        path: `/api/v1/CreateRole`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags RolePermission
     * @name V1GetRolesPermissionsList
     * @summary 查询角色下面的权限列表
     * @request GET:/api/v1/GetRolesPermissions
     * @secure
     */
    v1GetRolesPermissionsList: (
      query?: {
        /** @format uuid */
        roleId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PermissionOutput[], any>({
        path: `/api/v1/GetRolesPermissions`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags RolePermission
     * @name V1CreateRolesPermissionsCreate
     * @summary 新增角色拥有的权限
     * @request POST:/api/v1/CreateRolesPermissions
     * @secure
     */
    v1CreateRolesPermissionsCreate: (
      data: CreateRolePermissionInput,
      query?: {
        /** @format uuid */
        roleId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PermissionOutput[], any>({
        path: `/api/v1/CreateRolesPermissions`,
        method: 'POST',
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags RouteEventOption
     * @name V1RouteEventOptionGetPagedListAsyncList
     * @summary 路径事件分页查询
     * @request GET:/api/v1/RouteEvent/Option/GetPagedListAsync
     * @secure
     */
    v1RouteEventOptionGetPagedListAsyncList: (
      query?: {
        /** 事件描述 */
        Description?: string;
        Sorting?: string;
        /**
         * @format int32
         * @min 0
         * @max 2147483647
         */
        SkipCount?: number;
        /**
         * @format int32
         * @min 1
         * @max 2147483647
         */
        MaxResultCount?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<RouteEventOptionOutputPagedResultDtoServicesResult, any>({
        path: `/api/v1/RouteEvent/Option/GetPagedListAsync`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags RouteEventOption
     * @name V1RouteEventOptionCreateAsyncCreate
     * @summary 新增路径事件配置
     * @request POST:/api/v1/RouteEvent/Option/CreateAsync
     * @secure
     */
    v1RouteEventOptionCreateAsyncCreate: (data: CreateRouteEventOptionInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/RouteEvent/Option/CreateAsync`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags RouteEventOption
     * @name V1RouteEventOptionModifyAsyncUpdate
     * @summary 修改路径事件
     * @request PUT:/api/v1/RouteEvent/Option/ModifyAsync
     * @secure
     */
    v1RouteEventOptionModifyAsyncUpdate: (data: ModifyRouteEventOptionInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/RouteEvent/Option/ModifyAsync`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags RouteEventOption
     * @name V1RouteEventOptionDeleteAsyncDelete
     * @summary 删除路径事件
     * @request DELETE:/api/v1/RouteEvent/Option/DeleteAsync
     * @secure
     */
    v1RouteEventOptionDeleteAsyncDelete: (
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/RouteEvent/Option/DeleteAsync`,
        method: 'DELETE',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags RouteEventRecord
     * @name V1RouteEventRecordGetListAsyncList
     * @summary 集合查询
     * @request GET:/api/v1/RouteEvent/Record/GetListAsync
     * @secure
     */
    v1RouteEventRecordGetListAsyncList: (
      query?: {
        /** @format uuid */
        missionId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<RouteEventRecordOutputListServicesResult, any>({
        path: `/api/v1/RouteEvent/Record/GetListAsync`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags RouteEventRecord
     * @name V1RouteEventRecordGetPagedListAsyncList
     * @summary 路径事件记录分页查询
     * @request GET:/api/v1/RouteEvent/Record/GetPagedListAsync
     * @secure
     */
    v1RouteEventRecordGetPagedListAsyncList: (
      query?: {
        /**
         * 车号
         * @format int32
         */
        VehicleNum?: number;
        /**
         * 任务id
         * @format uuid
         */
        MissionId?: string;
        /**
         * 子任务id
         * @format uuid
         */
        MissionItemId?: string;
        Sorting?: string;
        /**
         * @format int32
         * @min 0
         * @max 2147483647
         */
        SkipCount?: number;
        /**
         * @format int32
         * @min 1
         * @max 2147483647
         */
        MaxResultCount?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<RouteEventRecordOutputPagedResultDtoServicesResult, any>({
        path: `/api/v1/RouteEvent/Record/GetPagedListAsync`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name V1GetPageListUserWithRolesList
     * @summary 分页查询用户列表
     * @request GET:/api/v1/GetPageListUserWithRoles
     * @secure
     */
    v1GetPageListUserWithRolesList: (
      query?: {
        /**
         * 角色Id
         * @format uuid
         */
        RoleId?: string;
        /**
         * 关键字
         * 手机、姓名、邮箱
         */
        Keyword?: string;
        Sorting?: string;
        /**
         * @format int32
         * @min 0
         * @max 2147483647
         */
        SkipCount?: number;
        /**
         * @format int32
         * @min 1
         * @max 2147483647
         */
        MaxResultCount?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserWithRoleOutputPagedResultDto, any>({
        path: `/api/v1/GetPageListUserWithRoles`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name V1GetUserWithRoleList
     * @summary 查询用户详情
     * @request GET:/api/v1/GetUserWithRole
     * @secure
     */
    v1GetUserWithRoleList: (
      query?: {
        /** @format uuid */
        userId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserWithRoleOutputServicesResult, any>({
        path: `/api/v1/GetUserWithRole`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name V1CreateUserCreate
     * @summary 新增企业成员
     * @request POST:/api/v1/CreateUser
     * @secure
     */
    v1CreateUserCreate: (data: CreateUserInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/CreateUser`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name V1AssignUserToRoleUpdate
     * @summary 分配用户所属角色
     * @request PUT:/api/v1/AssignUserToRole
     * @secure
     */
    v1AssignUserToRoleUpdate: (
      query?: {
        /** @format uuid */
        userId?: string;
        /** @format uuid */
        roleId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/AssignUserToRole`,
        method: 'PUT',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name V1DeleteUserDelete
     * @summary 删除用户
     * @request DELETE:/api/v1/DeleteUser
     * @secure
     */
    v1DeleteUserDelete: (
      query?: {
        /** @format uuid */
        userId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/DeleteUser`,
        method: 'DELETE',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name V1LoginCreate
     * @summary 登录
     * @request POST:/api/v1/Login
     * @secure
     */
    v1LoginCreate: (
      query: {
        /** 用户名 */
        Username: string;
        /** 密码 */
        Password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<LoginOutputServicesResult, any>({
        path: `/api/v1/Login`,
        method: 'POST',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserPermission
     * @name V1GetUserPermissionsList
     * @summary 查询用户的权限数据
     * @request GET:/api/v1/GetUserPermissions
     * @secure
     */
    v1GetUserPermissionsList: (
      query?: {
        /** @format uuid */
        userId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PermissionOutput[], any>({
        path: `/api/v1/GetUserPermissions`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Vehicle
     * @name V1VehicleGetPageListVehiclesList
     * @summary 分页查询车辆信息
     * @request GET:/api/v1/Vehicle/GetPageListVehicles
     * @secure
     */
    v1VehicleGetPageListVehiclesList: (data: VehiclePageInput, params: RequestParams = {}) =>
      this.request<VehicleOutputPagedResultDtoServicesResult, any>({
        path: `/api/v1/Vehicle/GetPageListVehicles`,
        method: 'GET',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Vehicle
     * @name V1VehicleGetVehiclesList
     * @summary 查询所有车辆信息
     * @request GET:/api/v1/Vehicle/GetVehicles
     * @secure
     */
    v1VehicleGetVehiclesList: (params: RequestParams = {}) =>
      this.request<VehicleOutputListServicesResult, any>({
        path: `/api/v1/Vehicle/GetVehicles`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Vehicle
     * @name V1VehicleCreateVehicleCreate
     * @summary 创建车辆信息
     * @request POST:/api/v1/Vehicle/CreateVehicle
     * @secure
     */
    v1VehicleCreateVehicleCreate: (data: CreateVehicleInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Vehicle/CreateVehicle`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Vehicle
     * @name V1VehicleModifyVehicleUpdate
     * @summary 修改车辆信息
     * @request PUT:/api/v1/Vehicle/ModifyVehicle
     * @secure
     */
    v1VehicleModifyVehicleUpdate: (data: ModifyVehicleInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Vehicle/ModifyVehicle`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Vehicle
     * @name V1VehicleDeleteVehicleDelete
     * @summary 删除车辆信息
     * @request DELETE:/api/v1/Vehicle/DeleteVehicle
     * @secure
     */
    v1VehicleDeleteVehicleDelete: (
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/Vehicle/DeleteVehicle`,
        method: 'DELETE',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags VehicleChassis
     * @name V1VehicleChassisGetPageListVehicleChassisList
     * @summary 分页查询车辆类型
     * @request GET:/api/v1/VehicleChassis/GetPageListVehicleChassis
     * @secure
     */
    v1VehicleChassisGetPageListVehicleChassisList: (data: VehicleChassisPageInput, params: RequestParams = {}) =>
      this.request<VehicleChassisOutputPagedResultDtoServicesResult, any>({
        path: `/api/v1/VehicleChassis/GetPageListVehicleChassis`,
        method: 'GET',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags VehicleChassis
     * @name V1VehicleChassisGetVehicleChassisList
     * @summary 查询所有车辆类型
     * @request GET:/api/v1/VehicleChassis/GetVehicleChassis
     * @secure
     */
    v1VehicleChassisGetVehicleChassisList: (params: RequestParams = {}) =>
      this.request<VehicleChassisOutputListServicesResult, any>({
        path: `/api/v1/VehicleChassis/GetVehicleChassis`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags VehicleChassis
     * @name V1VehicleChassisCreateVehicleChassisCreate
     * @summary 创建车辆类型
     * @request POST:/api/v1/VehicleChassis/CreateVehicleChassis
     * @secure
     */
    v1VehicleChassisCreateVehicleChassisCreate: (data: CreateVehicleChassisInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/VehicleChassis/CreateVehicleChassis`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags VehicleChassis
     * @name V1VehicleChassisModifyVehicleChassisUpdate
     * @summary 修改车辆类型
     * @request PUT:/api/v1/VehicleChassis/ModifyVehicleChassis
     * @secure
     */
    v1VehicleChassisModifyVehicleChassisUpdate: (data: ModifyVehicleChassisInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/VehicleChassis/ModifyVehicleChassis`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags VehicleChassis
     * @name V1VehicleChassisDeleteVehicleChassisDelete
     * @summary 删除车辆类型
     * @request DELETE:/api/v1/VehicleChassis/DeleteVehicleChassis
     * @secure
     */
    v1VehicleChassisDeleteVehicleChassisDelete: (
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/VehicleChassis/DeleteVehicleChassis`,
        method: 'DELETE',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags VehicleState
     * @name V1VehicleStateGetPageListVehicleStatesList
     * @summary 分页查询车辆状态
     * @request GET:/api/v1/VehicleState/GetPageListVehicleStates
     * @secure
     */
    v1VehicleStateGetPageListVehicleStatesList: (data: VehicleStatePageInput, params: RequestParams = {}) =>
      this.request<VehicleStateOutputPagedResultDtoServicesResult, any>({
        path: `/api/v1/VehicleState/GetPageListVehicleStates`,
        method: 'GET',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags VehicleState
     * @name V1VehicleStateGetVehicleStatesList
     * @summary 查询所有车辆状态
     * @request GET:/api/v1/VehicleState/GetVehicleStates
     * @secure
     */
    v1VehicleStateGetVehicleStatesList: (params: RequestParams = {}) =>
      this.request<VehicleStateOutputListServicesResult, any>({
        path: `/api/v1/VehicleState/GetVehicleStates`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags VehiclePallet
     * @name V1VehicleTrayGetVehicleTrayList
     * @summary 查询所有车辆托盘
     * @request GET:/api/v1/VehiclePallet/GetVehicleTray
     * @secure
     */
    v1VehicleTrayGetVehicleTrayList: (params: RequestParams = {}) =>
      this.request<VehicleTrayOutputListServicesResult, any>({
        path: `/api/v1/VehiclePallet/GetVehicleTray`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags VehiclePallet
     * @name V1VehicleTrayCreateVehicleTrayCreate
     * @summary 创建车辆托盘
     * @request POST:/api/v1/VehiclePallet/CreateVehicleTray
     * @secure
     */
    v1VehicleTrayCreateVehicleTrayCreate: (data: CreateVehicleTrayInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/VehiclePallet/CreateVehicleTray`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags VehiclePallet
     * @name V1VehicleTrayModifyVehicleTrayUpdate
     * @summary 修改车辆托盘
     * @request PUT:/api/v1/VehiclePallet/ModifyVehicleTray
     * @secure
     */
    v1VehicleTrayModifyVehicleTrayUpdate: (data: ModifyVehicleTrayInput, params: RequestParams = {}) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/VehiclePallet/ModifyVehicleTray`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags VehiclePallet
     * @name V1VehicleTrayDeleteVehicleTrayDelete
     * @summary 删除车辆托盘
     * @request DELETE:/api/v1/VehiclePallet/DeleteVehicleTray
     * @secure
     */
    v1VehicleTrayDeleteVehicleTrayDelete: (
      query?: {
        /** @format uuid */
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServicesResult, any>({
        path: `/api/v1/VehiclePallet/DeleteVehicleTray`,
        method: 'DELETE',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),
  };
}
