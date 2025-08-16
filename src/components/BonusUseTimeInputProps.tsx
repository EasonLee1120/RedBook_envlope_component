interface Props {
  useTime: string;
  onChange: (value: string) => void;
}


export default function BonusUseTimeInputProps({useTime, onChange}:Props) {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value); // 直接传递选中的值给父组件
  };

  return(
    <div className='title'>
        <div className='name'>红包可使用时间</div>
        <select className='nameInput' onChange={handleChange} value={useTime}>
          <option value="1分钟可用">1分钟内可用</option>
          <option value="2分钟可用">2分钟内可用</option>
          <option value="5分钟可用">5分钟内可用</option>
          <option value="10分钟可用">10分钟内可用</option>
      </select>
    </div>
  )
}