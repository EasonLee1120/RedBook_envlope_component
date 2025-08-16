import React from 'react';
import { useState, useEffect } from 'react';
import { Flex, Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import '../../style/PCStyle/HomeForPC.css'; 
import { UserOutlined } from '@ant-design/icons';

// 与接口相关的数据导出
import { fetchBonusData } from '../../api/Bonus'; // 导入接口函数
import type {CreateBonusResponse} from '../../api/Bonus'; // 导入接口数据类型

// 使用路由
import { useNavigate } from 'react-router-dom';
import AnchorPacketEnter from './AnchorPacketEnter';

// 从layout中取出头部，侧边栏和内容区域
const { Header, Sider, Content } = Layout;

// 和ant api有关的样式布局
const headerStyle: React.CSSProperties = {
  backgroundColor: 'white',
  marginBottom: '2px',
};

const contentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  margin: '10px',
  borderRadius: '10px',
  padding: '20px'
};

const siderStyle: React.CSSProperties = {
  backgroundColor: 'white'
};


const layoutStyle = {
  minHeight: '100vh'
};

// 侧边栏导航项
const items: MenuProps['items'] = [
  {
    key: 'live-plan',
    label: '直播计划',
  },
  {
    key: 'live-sessions',
    label: '直播场次',
  },
  {
    key: 'real-time',
    label: '实时跟播',
  },
  {
    key: 'live-tools',
    label: '直播工具',
  },
  {
    key: 'live-promote',
    label: '直播推广',
    // 添加子菜单
    children: [
      { key: 'tool-1', label: '推流设置' },
      { key: 'tool-2', label: '素材管理' },
      { key: 'tool-3', label: '数据分析' },
    ]
  },
  {
    key: 'live-activity',
    label: '直播活动',
  },
  {
    key: 'live-special',
    label: '专栏',
  }
];


const App: React.FC = () => {
  // 用于记录当前选中的菜单key
  const [selectedKey, setSelectedKey] = useState('live-plan');

  // 处理菜单点击事件
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    // 更新选中的菜单key
    setSelectedKey(e.key);
  };

  // 获取后端接口主播姓名数据
  const [data, setData] = useState<CreateBonusResponse | null>(null);

  useEffect(()=>{
    const loadData = async () => {
      try{
        const result = await fetchBonusData()
        setData(result)
      }catch(err){
        console.error(err)
      }
    }
    loadData()
  },[])

  // 处理退出逻辑
  const navigate = useNavigate()

return(
  <Flex gap="middle" wrap>
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <div className='live_header'>
          <div className='live_title'>直播管理平台</div>
          <div className='live_account'>
            <div className='avator'><UserOutlined />{data?.anchorid}</div>
            <button className='switch_account'>切换账号</button>
            <button className='live_quit' onClick={()=>{navigate('/')}}>退出</button>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider width="25%" style={siderStyle}>
          <Menu
              mode="inline"
              defaultSelectedKeys={['live-plan']}  // 默认选中
              style={{ height: '100%', borderInlineEnd: 0 }}
              items={items}
              onClick={handleMenuClick}  // 添加点击事件监听
              selectedKeys={[selectedKey]}  // 显示当前选中项
            />
        </Sider>
        <Content style={contentStyle}>
          {/* 选中直播工具时显示促进转化页面 */}
          {selectedKey === 'live-tools' && 
          <>
            <div className='tools_title'>促进转化</div>
            <AnchorPacketEnter/>
          </>
          }
        </Content>
      </Layout>
    </Layout>
  </Flex>
)};

export default App;