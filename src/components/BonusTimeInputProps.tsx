interface Props {
  startTime: string;
  onChange: (value: string) => void;
}

export default function BonusTimeInputProps({startTime, onChange}:Props) {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value); // 直接传递选中的值给父组件
  };

  return(
    <div className='title'>
        <div className='name'>开抢时间</div>
        <select className='nameInput' onChange={handleChange} value={startTime}>
          <option value="1分钟可抢">1分钟可抢</option>
          <option value="2分钟可抢">2分钟可抢</option>
          <option value="5分钟可抢">5分钟可抢</option>
          <option value="10分钟可抢">10分钟可抢</option>
      </select>
    </div>
  )
}