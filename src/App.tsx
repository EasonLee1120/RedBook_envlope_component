import { BrowserRouter, Routes, Route} from 'react-router-dom';
import BonusDetail from './components/BonusDetail';
import BonusCreater from './components/BonusCreater.tsx';
import Home from './components/Home.tsx'
import BonusDisplay from './components/client/BonusDisplay.tsx'
import './App.css';
import { DataContext } from './contexts/DataContext';
import type { BonusData } from './contexts/DataContext';
import { useState } from 'react';
import HomeForPC from './components/PC/HomeForPC.tsx'

export default function App() {
  // 1. 补充定义 isCreated 状态及更新函数
  const [bonusData, setBonusData] = useState<BonusData[]>([]); // 红包数据
  const [isCreated, setIsCreated] = useState(false); // 创建状态标记
  const [bonusIsUsedId, setBonusIsUsedId] = useState<string | null>(null)

  // 创建红包是否已发放的逻辑
  const [isUsed, setIsUsed] = useState(false)

  return (
    <BrowserRouter>
      {/* 2. 传递完整的 Context 值（匹配 DataContextType 接口） */}
      <DataContext.Provider 
        value={{ 
          bonusData,
          setBonusData, 
          isCreated,  // 传递创建状态
          setIsCreated, // 传递创建状态更新函数

          bonusIsUsedId, // 传递当前正在使用的红包id
          setBonusIsUsedId, // 传递创建红包id的set方法

          isUsed,
          setIsUsed

        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-bonus" element={<BonusCreater />} />
          <Route path="/bonus-detail" element={<BonusDetail />} />
          <Route path="/client/bonus-display" element={<BonusDisplay />} />
          <Route path="/PC" element={<HomeForPC />} />
        </Routes>
      </DataContext.Provider>
    </BrowserRouter>
  );
}

