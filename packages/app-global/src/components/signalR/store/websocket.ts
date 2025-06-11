/* eslint-disable implicit-arrow-linebreak */
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export enum EWebsocketMessagePath {
  ReportGetHomeChargeGoodsStations = 'Report/GetHomeChargeGoodsStations', // 获取待命点，充点电，有货库位
  ReportGetOnLineCarriers = 'Report/GetOnLineCarriers', // 获取在线车辆
  ReportGetTimeSum = 'Report/GetTimeSum', // 获取时间统计
  ReportGetAgvThroughs = 'Report/GetAgvThroughs', // 获取稼动率统计
  ReportGetAgvStatus = 'Report/GetAgvStatus', // 获取车辆状态统计
  ReportGetJobSumByAgv = 'Report/GetJobSumByAgv', // 获取车辆任务统计
  ReportGetAgvAbnormal = 'Report/GetCarrierAbnormal', // 获取车辆异常信息
}

type TWebsocketState = {
  [EWebsocketMessagePath.ReportGetOnLineCarriers]: ReportAPI.OnlineCarrier[];
  [EWebsocketMessagePath.ReportGetHomeChargeGoodsStations]: ReportAPI.ChargeGoodsStations[];
  [EWebsocketMessagePath.ReportGetTimeSum]: ReportAPI.TimeSumDatum[];
  [EWebsocketMessagePath.ReportGetAgvThroughs]: ReportAPI.Through | null;
  [EWebsocketMessagePath.ReportGetAgvStatus]: ReportAPI.CarrierStatus | null;
  [EWebsocketMessagePath.ReportGetJobSumByAgv]: ReportAPI.AgvTaskRoot | null;
  [EWebsocketMessagePath.ReportGetAgvAbnormal]: ReportAPI.AbnormalCarrier[] | null;
};

type TWebsocketActions = {
  setReportGetOnLineCarriers: (onlineCarriers: TWebsocketState['Report/GetOnLineCarriers']) => void;
  setReportGetHomeChargeGoodsStations: (
    chargeGoodsStations: TWebsocketState['Report/GetHomeChargeGoodsStations'],
  ) => void;
  setReportGetTimeSum: (timeSum: TWebsocketState['Report/GetTimeSum']) => void;
  setReportGetAgvThroughs: (agvThroughs: TWebsocketState['Report/GetAgvThroughs']) => void;
  setReportGetAgvStatus: (agvStatus: TWebsocketState['Report/GetAgvStatus']) => void;
  setReportGetJobSumByAgv: (jobSumByAgv: TWebsocketState['Report/GetJobSumByAgv']) => void;
  setReportGetAgvAbnormal: (agvAbnormal: TWebsocketState['Report/GetCarrierAbnormal']) => void;
};

export const useWebsocketStore = createWithEqualityFn<TWebsocketState & TWebsocketActions>(
  (set) => ({
    'Report/GetOnLineCarriers': [],
    'Report/GetHomeChargeGoodsStations': [],
    'Report/GetTimeSum': [],
    'Report/GetAgvThroughs': null,
    'Report/GetAgvStatus': null,
    'Report/GetJobSumByAgv': null,
    'Report/GetCarrierAbnormal': null,
    setReportGetOnLineCarriers: (onlineCarriers: TWebsocketState['Report/GetOnLineCarriers']) =>
      set({ 'Report/GetOnLineCarriers': onlineCarriers }),
    setReportGetHomeChargeGoodsStations: (chargeGoodsStations: TWebsocketState['Report/GetHomeChargeGoodsStations']) =>
      set({ 'Report/GetHomeChargeGoodsStations': chargeGoodsStations }),
    setReportGetTimeSum: (timeSum: TWebsocketState['Report/GetTimeSum']) => set({ 'Report/GetTimeSum': timeSum }),
    setReportGetAgvThroughs: (agvThroughs: TWebsocketState['Report/GetAgvThroughs']) =>
      set({ 'Report/GetAgvThroughs': agvThroughs }),
    setReportGetAgvStatus: (agvStatus: TWebsocketState['Report/GetAgvStatus']) =>
      set({ 'Report/GetAgvStatus': agvStatus }),
    setReportGetJobSumByAgv: (jobSumByAgv: TWebsocketState['Report/GetJobSumByAgv']) =>
      set({ 'Report/GetJobSumByAgv': jobSumByAgv }),
    setReportGetAgvAbnormal: (agvAbnormal: TWebsocketState['Report/GetCarrierAbnormal']) =>
      set({ 'Report/GetCarrierAbnormal': agvAbnormal }),
  }),
  shallow,
);
