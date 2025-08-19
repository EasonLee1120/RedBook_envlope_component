import { RedEnvelopeOutlined, CloseCircleOutlined, UserOutlined, RightOutlined, FrownOutlined } from '@ant-design/icons';
import '../../style/clientStyle/BonusDisplay.css'; 
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../contexts/DataContext.tsx'
import { useNavigate } from 'react-router-dom';
import { fetchBonusData } from '../../api/Bonus'; // 导入接口函数
import type {CreateBonusResponse} from '../../api/Bonus'; // 导入接口数据类型

// 编写将字符串中的数字提取出来并转换成number类型的算法
function extractNumber(str: string) {
  // 字符串中的数字提取
  let numberstr = ''
  for(let i = 0; i< str.length; i++){
    const char = str[i]
    if(char >= '0' && char <= '9'){
      numberstr += char
    }
    // 只取第一个连续的以字符串形式的数字
    else if(numberstr) {
      break
    }
    // 将数字字符串转换为number类型
    return Number(numberstr)
  }
}

// 格式化时间的算法
function formatTime(seconds:number) {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

 
export default function BonusDisplay(){
  // 构建全局context(将data数据取过来和存储的id数据取过来)
  const { bonusData,bonusIsUsedId } = useContext(DataContext)

  // 创建剩余时间
  const [restTime, setRestTime] = useState<number>(0)

  // 设置倒计时十秒时高亮显示的逻辑
  const [lastTime, setLastTime] = useState<boolean>(false)

  // 获取关注状态信息
  const [subCondition, setSubCondition] = useState<number>(1)

  // 找到当前红包id,获取剩余时间
  useEffect(()=>{
    if (!bonusIsUsedId){
      return;
    }
    const currentBonus = bonusData.find(bonus => bonus.Id === bonusIsUsedId);
    if(currentBonus){
      setRestTime(extractNumber(currentBonus.startTime) * 60)
      setSubCondition(currentBonus.isConditionSelected)
    }

  }, [bonusIsUsedId, bonusData])

  // 倒计时逻辑，更新红包剩余时间
  useEffect(()=>{
    if(restTime<=0){
      return;
    }
    // 创建倒计时定时器
    const timer = setInterval(()=>{
      setRestTime(prev=>{
        if(prev <= 10){
          setLastTime(true)
        }
        // 当之前的时间小于1时返回0
        if(prev <= 1){
          clearInterval(timer)
          return 0
        }
        return prev-1
      })
    }, 1000)
    return ()=> clearInterval(timer)
  }, [restTime])

  // 设置弹出框显示逻辑
  const [modelOpen, setModelOpen] = useState(false)


  // 在组件内添加状态
  const [isGrabbed, setIsGrabbed] = useState(false); // 是否已抢到红包
  const [grabbedAmount, setGrabbedAmount] = useState<number>(0); // 抢到的金额
  const [useTime, setUseTime] = useState<string>('') //可使用时间


  // 设置抢到红包之后的页面
function grabBonus() {
  if (isExpired) return; // 已过期则不执行抢红包
  // 模拟抢红包
  const currentBonus = bonusData.find(bonus => bonus.Id === bonusIsUsedId);
  if (!currentBonus) return;

  let amount = 0;
  if (currentBonus.isTypeSelected === 1) {
    // 拼手气红包
    amount = +((currentBonus.totalRandom * 2 / 3 / currentBonus.packetNumber) + (Math.random() * currentBonus.totalRandom * 1 / 3)).toFixed(2)
  } else {
    // 普通红包：固定金额
    amount = currentBonus.totalFixed;
  }
  

  // 标记为已抢到，并设置金额和可使用时间
  setGrabbedAmount(amount);
  setIsGrabbed(true);
  setUseTime(currentBonus.useTime)
}

const [data, setData] = useState<CreateBonusResponse | null>(null);

// 从后端接口获得主播姓名数据
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
},[isGrabbed])

// 定义跳转至红包创建界面的逻辑
const navigate = useNavigate()


function useBonus() {
  alert('使用成功！')
  navigate('/')
}


// 判断红包是否过期的逻辑
const [expireTime, setExpireTime] = useState<number>(15); // 15秒过期时间
const [isExpired, setIsExpired] = useState<boolean>(false); // 是否已过期

  // 过期倒计时逻辑 - 当可领取后开始15秒倒计时
  useEffect(() => {
    // 只有当红包可领取（restTime为0）且未被领取时才开始过期倒计时
    if (restTime !== 0 || isGrabbed || isExpired) return;
    
    const timer = setInterval(() => {
      setExpireTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true); // 标记为已过期
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [restTime, isGrabbed, isExpired]);

  // 获取主播数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchBonusData();
        setData(result);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [isGrabbed]);


return (
  <>
    <button 
      className='packet_div' 
      onClick={() => setModelOpen(!modelOpen)}
      disabled={isGrabbed} // 已抢到则禁用按钮
    >
      <div className='packet_icon'><RedEnvelopeOutlined /></div>
      <div className='packet_time'>
        {restTime === 0 ? '领取红包' : formatTime(restTime)}
      </div>
    </button>

    {isGrabbed && (
      <div className='after_grab_bonus'>
        <RedEnvelopeOutlined />
        <span>{data?.anchorid}领到了{grabbedAmount.toFixed(1)}元的购物红包</span>
        <RightOutlined />
      </div>
    )}

    {modelOpen && (
      <div className='modal'>
        {!isGrabbed ? (
          isExpired ? (
            // 过期状态：显示已抢光
            <>
              <div className='packet_expired'>
                <div className='expired_title'>来晚了，红包已被抢光</div>
                <div className='expired_desc'>关注主播，抢到的概率越大</div>
                <div className='cryIcon'><FrownOutlined /></div>
                <button className='check'>查看大家的手气<RightOutlined /></button>
                <button className='use' onClick={() => navigate('/')}>返回发放红包</button>
              </div>
              <button 
                className='expired_close' 
                onClick={() => setModelOpen(false)}
              >
                <CloseCircleOutlined />
              </button>
            </>
          ) : (
            // 未过期未抢到状态
          <>
            <div className='packet_open'>
              <div className='user_icon'><UserOutlined /></div>
              <div className='bonus_intro'>主播送你一个购物红包</div>
              
              {restTime >= 10 ? (
                <button className='time_display_restTime'>
                  {formatTime(restTime)}后<br/>开抢
                </button>
              ) : restTime >= 1 ? (
                <button className='time_display_lastTime'>{restTime}</button>
              ) : (
                <button 
                  className='time_display_finished' 
                  onClick={grabBonus}
                >
                  {subCondition === 1 ? (
                    <><div className='sub'>关注</div>抢红包</>
                  ) : (
                    '抢红包'
                  )}
                </button>
              )}
            </div>
            <button 
              className='packet_closed' 
              onClick={() => setModelOpen(false)}
            >
              <CloseCircleOutlined />
            </button>
          </>
          )
        ) : (
          // 已抢到状态
          <>
            <div className='result_open'>
              <div className='user_icon'><UserOutlined /></div>
              <div className='result_intro'>主播送的购物红包</div>
              <div className='result_amount'>
                {grabbedAmount.toFixed(1)}
                <div className='result_amount_yuan'>元</div>
              </div>
              <div className='result_desc'>观看时间越长，手气越好哦</div>
              <button className='check'>查看大家的手气<RightOutlined /></button>
              <button className='use' onClick={useBonus}>去使用</button>
              <div className="use_time">当前直播间内{useTime}</div>
            </div>
            <button 
              className='packet_closed' 
              onClick={() => setModelOpen(false)}
            >
              <CloseCircleOutlined />
            </button>
          </>
        )}
      </div>
    )}
  </>
);
}