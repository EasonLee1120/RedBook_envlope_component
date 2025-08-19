import {defineMock} from 'vite-plugin-mock-dev-server'

// 1. 获取主播信息的接口
const getBonusInfoMock =  defineMock({
  url: '/api/createBonus',
  method: ['GET'],
  body: {
    anchorid: 'A01',
    balance: 1000,
    potatoCoin: 150,
  },
})

// 2. 存储红包信息的接口
const postBonusInfoMock = defineMock({
  url: '/api/saveBonus', // 新接口URL
  method: ['POST'],
  // 处理请求并返回响应
  body: (req) => {
    // 从请求体中获取前端上传的红包数据
    const bonusData = req.body; 

    // 模拟存储数据的逻辑
    console.log('mock接口已接收红包数据：', bonusData); 

    // 返回成功响应
    return {
      success: true,
      message: '红包创建成功',
      data: {
        id: Date.now().toString(), // 模拟生成唯一红包ID
        ...bonusData, // 返回存储的红包数据
      },
    };
  },
});

export default [getBonusInfoMock, postBonusInfoMock]



