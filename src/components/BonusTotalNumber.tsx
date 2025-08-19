interface Props {
  packetNumber: number;
  onChange: (value: number) => void;
}


export default function BonusTotalNumber({packetNumber, onChange}:Props) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onChange(value); // 通知父组件更新
  };

  return(
    <div className='title'>
        <div className='name'>红包数量</div>
        <div className='detail'>
          <input type="text" className='nameInput' value={packetNumber} onChange={handleChange}/>
          <div>个</div>
        </div>
    </div>
  )
}