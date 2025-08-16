interface Props {
    onConfirm: () => void; 
}

export default function BonusConfirmCreater({onConfirm}:Props) {


  return(
    <div className='title'>
        <div className='bonus-type-selector' style={{width: '100%'}}>
          <button 
            className="confirmed selected" 
            onClick={onConfirm} // 点击时触发确认逻辑
          >
            立即创建
          </button>
        </div>
    </div>
  )
}