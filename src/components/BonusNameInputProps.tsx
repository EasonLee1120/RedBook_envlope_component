import '../style/BonusProps.css'

interface Props {
  packetName: string;
  onChange: (value: string) => void;
}

export default function BonusNameInputProps({packetName, onChange}:Props) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange(value); // 通知父组件更新
  };


  return(
    <div className='title'>
        <div className='name'>红包名称</div>
        <input type="text" value= {packetName} className='nameInput' onChange={handleChange}/>
    </div>
  )
}