interface Props {
  isConditionSelected: number;
  onChange: (value: number) => void;
}

export default function BonusConditionProps({isConditionSelected, onChange}:Props) {

  return(
    <div className='title' style={{marginBottom: 0}}>
        <div className='name'>参与条件设置</div>
        <div className='bonus-type-selector'>
          <button 
            type='button'
            className={isConditionSelected === 1? 'selected': ''}
            onClick={()=>onChange(1)}
          >关注主播</button>
          <button 
            type='button'
            className={isConditionSelected === 2? 'selected': ''}
            onClick={()=>onChange(2)}
          >不设置</button>
        </div>
    </div>
  )
}