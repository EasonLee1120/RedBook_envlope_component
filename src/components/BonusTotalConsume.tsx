import {DollarOutlined} from '@ant-design/icons';

interface Props {
  potatoCoin: number;
  onChange: (value: number) => void;
}

export default function BonusTotalConsume({potatoCoin, onChange}:Props) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onChange(value); // 通知父组件更新
  };

  return(
    <div className='title' style={{marginBottom:'0px'}}>
        <div className='potatoName'>消耗薯币</div>
        <div className='title'>
          <input type="text" className='nameInput' value= {potatoCoin} onChange={handleChange}/>
          <div style={{fontSize: '16px', color: '#ff4d4f'}}><DollarOutlined /></div>
        </div>
    </div>
  )
}