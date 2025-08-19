import '../../style/PCStyle/AnchorPacketEnter.css'
import { Button } from "antd";
import {useState} from 'react'
import BonusDetailPC from './BonusDetailForPC/BonusDetailPC'


export default function AnchorPacketEnter() {
  const data ={
    data1: {
      title: '主播红包',
      desc: '主播可自行充值购买主播红包在直播间发放，主播红包可在下单时抵扣，提升直播间下单转化率及观看时长'
    },
    data2: {
      title: '直播间秒杀',
      desc:'实现商品在直播间内限时限量限价，促进转化，提升营销氛围'
    },
    data3: {
      title: '直播间主播发券',
      desc:'主播可以自定义领券任务，在直播问发券。提升直播间商品成交，促进直播间转化'
    },
    data4: {
      title: '直播渠道专享券',
      desc:'创建当前直播渠道专享券，果道专享券将展示在购物袋当中，用户点击商品顾可领取'
    }
  }

  // 将data对象转为数组，便于遍历
  const dataList = Object.values(data);

  // 弹窗显示逻辑
  // 定义弹窗显示
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="container">
      {/* 遍历数据生成盒子 */}
      {dataList.map((item, index) => (
        <div key={index} className="main_box">
          <div className="left_img">图片 {index + 1}</div>
          <div className="packet_right">
            <div className="right_title">{item.title}</div>
            <div className="right_desc">{item.desc}</div>
            {item.title === '主播红包' ? <Button type="primary" onClick={handleModalOpen}>立即使用</Button> : <Button type="primary">立即使用</Button>}
          </div>
        </div>
      ))}
      <BonusDetailPC isModalOpen={isModalOpen} handleModalClose={handleModalClose}/>
    </div>
  );
}