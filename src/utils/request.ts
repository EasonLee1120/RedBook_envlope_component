import axios from 'axios'

// 创建axios实例
const request = axios.create({
  // 设置基础路径和超时时间
  baseURL: '',
  timeout: 5000
})

// 设置请求拦截器（用于添加token）

// 设置响应拦截器（用于统一处理错误）
request.interceptors.response.use(
  (response) => response.data, // 直接返回数据部分
  (error) => {
    console.error('请求失败:', error);
    return Promise.reject(error);
  }
);

export default request