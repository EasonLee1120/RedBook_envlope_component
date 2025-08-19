// 显示红包详细信息的组件
import { useState, useEffect } from "react"
import type {CreateBonusResponse} from '../api/Bonus'; // 导入接口数据类型
import type { BonusData } from "../contexts/DataContext";

interface Props {
  data: BonusData
  interfaceData: CreateBonusResponse | null
  error: string
}

export default function BonusListDetail({data, interfaceData, error}: Props) {

  // 从模拟接口中获取数据
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(interfaceData) {
      setLoading(false)
    }
  }, [interfaceData])

  // 同步父组件的detailVisible状态


  return(
    <div className='detail-container'>
      {loading? <div className='error'>{error}</div> : <div className='anchorid'>创建人: {interfaceData.anchorid}</div>}
      <div className='bonus_getTime'>开抢时间限制：{data.startTime}</div>
      <div className='condition'>参与条件限制：{data.isConditionSelected === 1? "关注主播" : "不设置"}</div>
      <div className='potato_consume'>创建消耗薯币：{data.potatoCoin}</div>
    </div>
  )
}