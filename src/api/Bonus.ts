import request from '../utils/request';
import type { BonusData } from '../contexts/DataContext'; // 导入红包数据类型

// 1. 定义接口返回数据类型
export interface CreateBonusResponse {
  anchorid: string;
  balance: number;
  potatoCoin: number;
}

// 1. 获取主播红包数据的接口函数
export const fetchBonusData = async (): Promise<CreateBonusResponse> => {
  // 调用 /api/createBonus 接口
  return request({
    url: '/api/createBonus',
    method: 'GET',
  });
};

// 2. 上传红包信息接口的函数
export interface SaveBonusResponse {
  success: boolean;
  message: string;
  data: {
    // 交叉类型：{ id: string } + BonusData 的所有属性
    data: { id: string } & BonusData; 
  };
}

export const postBonus = async (bonusData: BonusData): Promise<SaveBonusResponse> => {
  return request({
    url: '/api/saveBonus', // 对应mock接口的URL
    method: 'POST', // 用POST方法提交数据
    data: bonusData, // 要上传的红包数据（放在请求体中）
  });
};


