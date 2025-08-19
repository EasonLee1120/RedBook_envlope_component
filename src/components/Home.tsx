// 红包进入主界面
import '../style/Home.css'
import {RedEnvelopeOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function Home() {

  // 路由导航
  const navigate = useNavigate();

  return(
    <>
      <button className='Home' onClick={()=> navigate('/create-bonus')}>
        <RedEnvelopeOutlined className='packetSVG'/>
        <div className='header'>主播红包</div>
        <div className='desc'>促进成交</div>
      </button>
      <button className='switchToPC' onClick={()=> navigate('/PC')}>切换至电脑端</button>
    </>
  )
}
