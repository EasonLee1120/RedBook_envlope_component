import BonusConditionProps from './BonusConditionProps.tsx'
import BonusConfirmCreater from './BonusConfirmCreater.tsx'
import BonusNameInputProps from './BonusNameInputProps.tsx'
import BonusTimeInputProps from './BonusTimeInputProps.tsx'
import BonusTotalConsume from './BonusTotalConsume.tsx'
import BonusTotalMoney from './BonusTotalMoney.tsx'
import BonusTotalNumber from './BonusTotalNumber.tsx'
import BonusTypeSelecter from './BonusTypeSelecter.tsx'
import BonusUseTimeInputProps from './BonusUseTimeInputProps.tsx'
import '../style/BonusDetail.css'
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { DataContext, type BonusData } from '../contexts/DataContext'; // 导入全局 Context
import { fetchBonusData, postBonus } from '../api/Bonus'; // 导入接口函数
import type {CreateBonusResponse, SaveBonusResponse} from '../api/Bonus'; // 导入接口数据类型
import { LeftOutlined } from '@ant-design/icons';

import { v4 as uuidv4 } from 'uuid'; // 安装 uuid 库（确保id唯一）


export default function BonusDetail() {
  // 获取接口数据
  const [interfaceData, setInterfaceData] = useState<CreateBonusResponse | null>()
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const loadData = async () =>{
      // 初始挂载时将加载状态设置为true
      setLoading(true)
      try{
        // 获取数据
        const result = await fetchBonusData();
        setInterfaceData(result)
        // 关闭加载
        setLoading(false)
      }catch(err){
        console.error('获取数据失败',err)
        setLoading(false)
      }
    }
    loadData()
  },[])

  // 1. 红包名称数据+主播姓名获取
  const [packetName, setpacketName] = useState<string>('xxx的主播红包')

  function handlepacketName(newValue: string) {
    setpacketName(newValue)
  }

  // 监听 interfaceData 变化，数据加载完成后更新红包名称初始值
  useEffect(() => {
    // 只有当 interfaceData 存在且有 anchorid 时，才更新初始值
    if (interfaceData && interfaceData.anchorid) {
      setpacketName(`${interfaceData.anchorid}的主播红包`);
    }
  }, [interfaceData]); // 依赖 interfaceData，数据变化时触发

  // 2. 开抢时间数据
  const [startTime, setStartTime] = useState('1分钟可抢'); // 默认值

  function handleStartTime(newValue: string) {
    setStartTime(newValue);
  }

  // 3. 红包可使用时间数据
  const [useTime, setUseTime] = useState('1分钟内可用'); // 默认值

  function handleUseTime(newValue: string) {
    setUseTime(newValue);
  }
  // 4. 参与条件设置
  const [isConditionSelected, setConitionSelected] = useState(1)

  function handleConditionSelect(newValue: number){
    setConitionSelected(newValue)
  }

  // 5 选择红包类型
  const [isTypeSelected, setTypeSelected] = useState(1)

  function handleTypeSelect(selected: number){
    setTypeSelected(selected)
  }

  // 6.1. 拼手气总金额数据
  const [totalRandom, setTotalRandom] = useState<number>()

  function handletotalRandom(newValue: number){
    setTotalRandom(newValue)
  }

  // 6.2. 单个金额数据
  const [totalFixed, setTotalFixed] = useState<number>()

  function handletotalFixed(newValue: number){
    setTotalFixed(newValue)
  }

  // 7. 红包数量
  const [packetNumber, setpacketNumber] = useState<number>()

  function handlepacketNumber(newValue: number) {
    setpacketNumber(newValue)
  }

  // 8. 薯币数据
  const [potatoCoin, setPotatoCoin] = useState<number>()

  function handlePotatoCoin(newValue: number) {
    setPotatoCoin(newValue)
  }

  // 9. 路由导航
  const navigate = useNavigate();

  // 10. 获取全局 Context 的更新函数
  const { setBonusData, setIsCreated } = useContext(DataContext);

  // 点击“确认创建”按钮时才同步数据
  const handleConfirmCreate = async () => {
    // 校验必要数据
    // 错误消息数组
    const errors = [];
  
    // 校验红包名称
    if (!packetName.trim()) {
      errors.push("红包名称不能为空");
    }

    // 校验拼手气红包逻辑
    if(isTypeSelected === 1){
      const amount = totalRandom
      if(isNaN(amount) || amount < 1 || amount > 200){
        errors.push("拼手气总金额必须在1-200之间");
      }
      if (isNaN(packetNumber) || packetNumber < 1 || packetNumber > 99) {
        errors.push("红包数量必须在1-99之间");
      }
    }

    // 校验普通红包逻辑
    if(isTypeSelected === 2){
      if(isNaN(totalFixed)){
        errors.push("单个金额不能为空");
      }

      if(isNaN(packetNumber)) {
        errors.push("红包数量不能为空");
      }

      if(totalFixed < 1) {
        errors.push("单个红包金额不能小于1元");
      }

      const totalMoney = totalFixed * packetNumber
      if(totalMoney > 200){
        errors.push("普通红包总金额不能超过200");
      }
    }

    // 校验薯币逻辑
    if(interfaceData.potatoCoin < potatoCoin){
      errors.push("薯币不足！");
    }

    if(potatoCoin == 0 || potatoCoin == null){
      errors.push("薯币不能为空！");
    }
  
    // 如果有错误，显示错误信息
    if (errors.length > 0) {
      alert(errors.join("\n")); // 简单的alert提示
      return;
    }
  
    // 所有校验通过，执行创建逻辑
    console.log("所有校验通过，准备创建红包");

    // 组装数据
    const currentData: BonusData = {
      Id: uuidv4(),
      packetName,
      startTime,
      useTime,
      isConditionSelected,
      isTypeSelected,
      totalRandom: totalRandom || 0,
      totalFixed: totalFixed || 0,
      packetNumber: packetNumber || 0,
      potatoCoin: potatoCoin || 0,
    };

    // 提交数据到mock接口
    try {
      console.log('开始上传红包数据')
      const response: SaveBonusResponse = await postBonus(currentData)

      // 上传成功后再更新context和导航
      if(response.success) {
        // 同步到全局Context，并标记为已创建
        setBonusData(prev => [...prev, currentData]);
        setIsCreated(true); // 标记创建状态

        // 提示红包创建成功
        alert('红包创建成功！')

        // 导航到主播红包页面
        navigate('/create-bonus');
        
      }else{
        alert('红包创建失败' + response.message)
      }
    }catch(err){
        // 请求发送失败
        console.error('上传红包数据失败：', err);
        alert('创建红包失败，请重试');
    }
  }

  return(
    <div className= 'main'>    
      <div className='created_top'>
        <button className='return' onClick={()=> navigate('/create-bonus')}><LeftOutlined /></button>
        <div className='created_title'>创建红包</div>
        {loading? <div className='interface_static'>加载中...</div> : <div className='interface_static'>余额：{interfaceData.balance}元 &nbsp;薯币：{interfaceData.potatoCoin}</div>}
      </div>
      <form className='packetNameDetail'>
        <BonusNameInputProps packetName={packetName} onChange={handlepacketName}/>
        <BonusTimeInputProps startTime={startTime} onChange={handleStartTime}/>
        <BonusUseTimeInputProps useTime={useTime} onChange={handleUseTime}/>
        <BonusConditionProps isConditionSelected={isConditionSelected} onChange={handleConditionSelect}/>
      </form>

      <form className='packetNumbereDetail'>
        <BonusTypeSelecter isTypeSelected={isTypeSelected} onChange={handleTypeSelect}/>
        <BonusTotalMoney isTypeSelected={isTypeSelected} totalRandom={totalRandom} randomOnChange={handletotalRandom} totalFixed={totalFixed} fixedOnChange = {handletotalFixed}/>
        <BonusTotalNumber packetNumber={packetNumber} onChange={handlepacketNumber}/>
        <BonusTotalConsume potatoCoin={potatoCoin} onChange={handlePotatoCoin}/>
      </form>
      <div className='reminder'>购物红包仅直播间可用，多个红包下单时叠加</div>
      <BonusConfirmCreater
        // 传递必要参数
        onConfirm={handleConfirmCreate} // 新增确认回调
      />
    </div>
  )
}
