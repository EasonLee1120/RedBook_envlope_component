import type { BonusData } from '../contexts/DataContext'
import '../style/BonusList.css'
import {UpOutlined, DownOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { DataContext } from '../contexts/DataContext'; // 导入Context


interface Props {
  data: BonusData
  detailVisible: boolean;
  onDetailClick: () => void;
}

// 构建红包列表组件
export default function BonusList({data, detailVisible, onDetailClick}: Props) {

  // 创建路由
  const navigate = useNavigate();

  // 定义全局状态
  const { setBonusIsUsedId } = useContext(DataContext); // 获取更新当前发放ID的方法

  // 定义创建成功状态
  const { setIsUsed } = useContext(DataContext)

  // 获取红包data数据，用于发放时从列表中把当前已发放的红包从列表中删除
  // const { setBonusData, bonusData } = useContext(DataContext)


  // 跳转逻辑+创建成功回调
  function confirmSending() {
    alert('红包发放成功!')
    // 将当前id存储进context表示为正在发放的红包
    setBonusIsUsedId(data.Id)
    // 标记为已发放
    setIsUsed(true); 

    // // 从 bonusData 中移除已发放的红包（过滤条件，只保留红包id不等于已经使用的红包的id的列表）--------有问题，直接删除了通报，他的数据该怎么获取并在客户端调用使用呢，还是应该为过滤显示逻辑而不是删除逻辑
    // const updatedBonusData = bonusData.filter(bonus => bonus.Id !== data.Id);
    // setBonusData(updatedBonusData);

    navigate('../client/bonus-display')
  }

  return(
    <>
      <div className='listDiv'>
        <div className='left'>
          <div className='Bonus_money'>￥{data.isTypeSelected === 1? data.totalRandom : data.totalFixed * data.packetNumber}</div>
          <div className='Bonus_type'>{data.isTypeSelected === 1? '拼手气' : '普通'}红包</div>
        </div>
        <div className='middle'>
          <div className='Bonus_detail'>{data.packetName}</div>
          <div className='Bonus_time_detail'>领取后{data.useTime}{data.isTypeSelected === 2? ` 单个面额：${data.totalFixed}元`: ''}</div>
          <button className='detail_intro' onClick={onDetailClick}>{detailVisible ? <div>详细说明<DownOutlined /></div> : <div>收起说明<UpOutlined /></div>}</button>
        </div>
        <div className='right'>
          <button onClick={confirmSending}>发放</button>
        </div>
      </div>
    </>
  )
}
