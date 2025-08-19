import { createContext } from 'react';

// 全局数据类型
export interface BonusData {
  Id: string,
  packetName: string,
  startTime: string,
  useTime: string
  isConditionSelected: number,
  isTypeSelected: number,
  totalRandom: number,
  totalFixed: number,
  packetNumber: number,
  potatoCoin: number
}

// Context类型
interface DataContextType {
  bonusData: BonusData[]; // 初始化为空数组
  isCreated: boolean; // 是否已确认创建
  setBonusData: (data: BonusData[]) => void;
  setIsCreated: (isCreated: boolean) => void;
  // 新增当前发放的红包id
  bonusIsUsedId: string | null;
  setBonusIsUsedId: (id: string) => void
  // 新增是否已确认发放
  isUsed: boolean;
  setIsUsed:(isUsed: boolean) => void
}

// 初始Context值
const initialContext: DataContextType = {
  bonusData: [],
  isCreated: false,
  setBonusData: () => {},
  setIsCreated: () => {},

  bonusIsUsedId: null,
  setBonusIsUsedId: () => {},

  isUsed: false,
  setIsUsed:() => {}
};

// 创建context用于传递数据
export const DataContext = createContext<DataContextType>(initialContext);