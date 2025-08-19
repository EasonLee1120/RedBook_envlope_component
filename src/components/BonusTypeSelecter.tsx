import '../style/BonusButton.css'

interface Props {
  isTypeSelected: number,
  onChange: (value: number) => void
}

export default function BonusTypeSelecter({isTypeSelected, onChange}:Props) {

  return(
    <div className='bonus-type-selector' style={{justifyContent: "space-between"}}>
      <div className='typeBox'>红包类型</div>
      <div>
        <button 
          type='button'
          className={isTypeSelected === 1? 'selected': ''}
          onClick={()=>onChange(1)}
        >拼手气红包</button>
        <button 
          type='button'
          className={isTypeSelected === 2? 'selected': ''}
          onClick={()=>onChange(2)}
        >普通红包</button>
      </div>
    </div>
  )
}
