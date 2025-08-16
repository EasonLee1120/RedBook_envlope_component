// 创建红包按钮组件
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import '../style/BonusCreate.css'
import BonusList from './BonusList';
import BonusListDetail from './BonusListDetail.tsx'
import { useContext, useState, useEffect } from 'react';
import { DataContext } from '../contexts/DataContext';
import { LeftOutlined } from '@ant-design/icons';
import { fetchBonusData } from '../api/Bonus'; // 导入接口函数
import type {CreateBonusResponse} from '../api/Bonus'; // 导入接口数据类型


export default function BonusCreater() {

  // 路由导航
  const navigate = useNavigate(); // 初始化导航函数

  function handleCreate() {
    navigate('/bonus-detail'); // 编程式导航到详情页
  }

  // 从接口中获取数据
  // 状态管理：接口数据、错误信息
  const [interfaceData, setInterfaceData] = useState<CreateBonusResponse | null>(null);
  const [error, setError] = useState<string>('');

  // 初始化时调用接口获取数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchBonusData(); // 调用接口
        setInterfaceData(result); // 保存接口返回数据
        setError(''); // 清空错误
      } catch (err) {
        setError('获取数据失败，请重试');
        console.error('接口请求错误:', err);
      }
    };
    loadData(); // 执行加载函数
  }, []);

  // 从全局 Context 中获取数据
  const { bonusData, isCreated, isUsed, bonusIsUsedId } = useContext(DataContext);


  // 设置单独红包id
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  // 切换指定红包的详情显示状态（接收红包Id作为参数）
  const toggleDetail = (id: string) => {
    setExpandedIds(prev => ({
      ...prev, // 保留其他红包的状态
      [id]: !prev[id] // 切换当前红包的状态
    }));
  };

  return (
    <>   
      <div className='bonus-container'>
        <div className='create_page_title'>
          <button className='back_to_home' onClick={()=> navigate('/')}><LeftOutlined /></button>
          <div className='anchor_title'>主播红包</div>
        </div>
        
        {isCreated && bonusData.length > 0 && (
          // 遍历红包列表时，过滤掉已发放的红包
          bonusData
            .filter(bonus => {
              // 如果红包已发放且是当前发放的红包，则过滤掉（不渲染）
              return !(isUsed && bonus.Id === bonusIsUsedId);
            })
            .map(bonus => (
              <div key={bonus.Id} className="bonus-item-wrapper">
                {/* 红包列表项 */}
                <BonusList 
                  data={bonus} 
                  detailVisible={!expandedIds[bonus.Id]} 
                  onDetailClick={()=> toggleDetail(bonus.Id)} 
                />
                
                {/* 详情组件：仅当展开时显示（无需额外判断，因为已过滤掉已发放红包） */}
                {expandedIds[bonus.Id] && ( 
                  <BonusListDetail 
                    data={bonus} 
                    interfaceData={interfaceData} 
                    error={error} 
                  />
                )}
              </div>
            ))
        )}
        
        <button className='create' onClick={handleCreate}>创建红包</button>
      </div>
    </>
  );
}