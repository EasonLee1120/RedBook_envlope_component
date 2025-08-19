interface Props {
  isTypeSelected: number,
  totalRandom: number,
  randomOnChange: (value:number) => void,
  totalFixed: number,
  fixedOnChange: (value:number) => void
}


export default function BonusTotalMoney({isTypeSelected, totalRandom, randomOnChange, totalFixed, fixedOnChange}: Props) {
  const handleRandomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numericValue = parseInt(value, 10); // 使用 parseInt 转换为数字
    // 验证转换有效性（避免 NaN）
    if (!isNaN(numericValue)) {
      randomOnChange(numericValue); // 传递 number 类型给父组件
    }
  };

  const handleFixedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numericValue = parseInt(value, 10); // 使用 parseInt 转换为数字
    // 验证转换有效性（避免 NaN）
    if (!isNaN(numericValue)) {
      fixedOnChange(numericValue); // 传递 number 类型给父组件
    }
  };


  return(
    <div className='title'>
        {isTypeSelected === 1? <div className='name'>拼手气总金额</div> : <div className='name'>单个金额</div>
        }
        <div className='detail'>
          {isTypeSelected === 1? <input type="text" className='nameInput' value= {totalRandom} onChange={handleRandomChange}/> :<input type="text" className='nameInput' value={totalFixed} onChange={handleFixedChange}/>}
          <div>元</div>
        </div>
    </div>
  )
}