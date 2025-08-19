import { Form, Modal, Input, Select, Radio, InputNumber, Typography } from 'antd';
import type {CreateBonusResponse, SaveBonusResponse} from '../../../api/Bonus'; // 导入接口数据类型
import { fetchBonusData, postBonus } from '../../../api/Bonus'; // 导入接口函数(带数据)
import {useState, useContext, useEffect} from 'react'
import { DataContext, type BonusData } from '../../../contexts/DataContext'; // 导入全局 Context
import { v4 as uuidv4 } from 'uuid'; // 安装 uuid 库（确保id唯一）

// 定义接口类型
interface Props {
  isModalOpen: boolean,
  handleModalClose: () => void
}

export default function BonusDetailForPC({isModalOpen, handleModalClose}: Props) {

// 获取含有主播姓名的接口数据
const [interfaceData, setInterfaceData] = useState<CreateBonusResponse | null>()

useEffect(()=>{
  const loadData = async () =>{
    try{
      // 获取数据（主播姓名，薯币信息）
      const result = await fetchBonusData();
      setInterfaceData(result)
    }catch(err){
      console.error('获取数据失败',err)
    }
  }
  loadData()
},[])

// 定义双向传输的数据类型
const [form] = Form.useForm<{
  packetName: string;
  startTime: string;
  useTime: string;
  isConditionSelected: number;
  isTypeSelected: number;
  totalFixed: number;
  packetNumber: number;
}>();

// 2. 当主播数据加载完成后，更新红包名称的初始值
useEffect(() => {
  if (interfaceData?.anchorid) {
    // 动态设置表单初始值：[主播姓名]的主播红包
    form.setFieldsValue({
      packetName: `${interfaceData.anchorid}的主播红包`,
    });
  }
}, [interfaceData, form]); // 依赖主播数据和 form 实例

// 1. 主播姓名数据
const packetName = Form.useWatch('packetName', form);

// 2. 开抢时间数据
const startTime = Form.useWatch('startTime', form);

// 3.红包可使用时间数据
const useTime = Form.useWatch('useTime', form);

// 4. 参与条件设置
const isConditionSelected = Form.useWatch('isConditionSelected', form);

// 5 选择红包类型
const isTypeSelected = Form.useWatch('isTypeSelected', form);

// 6.1. 拼手气总金额数据
const totalRandom = Form.useWatch('totalRandom', form);

// 6.2. 单个金额数据
const totalFixed = Form.useWatch('totalFixed', form);

// 7. 红包数量
const packetNumber = Form.useWatch('packetNumber', form);

// 8.薯币数据
const [potatoCoin, setPotatoCoin] = useState<number>(50)

// 9. 获取全局 Context 的更新函数
const { setBonusData, setIsCreated } = useContext(DataContext);


// 点击“创建红包”按钮时将数据同步到全局datacontext中
const handleConfirmCreate = async () => {
  // 校验必要数据
  // 错误消息数组
  const errors = [];

  // 校验红包名称
  if (!packetName.trim()) {
    errors.push("红包名称不能为空");
  }

  // 校验拼手气红包逻辑
  if(isTypeSelected === 1){
    const amount = totalRandom
    if(isNaN(amount) || amount < 1 || amount > 200){
      errors.push("拼手气总金额必须在1-200之间");
    }
    if (isNaN(packetNumber) || packetNumber < 1 || packetNumber > 99) {
      errors.push("红包数量必须在1-99之间");
    }
  }

  // 校验普通红包逻辑
  if(isTypeSelected === 2){
    if(isNaN(totalFixed)){
      errors.push("单个金额不能为空");
    }

    if(isNaN(packetNumber)) {
      errors.push("红包数量不能为空");
    }

    if(totalFixed < 1) {
      errors.push("单个红包金额不能小于1元");
    }

    const totalMoney = totalFixed * packetNumber
    if(totalMoney > 200){
      errors.push("普通红包总金额不能超过200");
    }
  }

  // 校验薯币逻辑
  if(interfaceData.potatoCoin < potatoCoin){
    errors.push("薯币不足！");
  }

  if(potatoCoin == 0 || potatoCoin == null){
    errors.push("薯币不能为空！");
  }

  // 如果有错误，显示错误信息
  if (errors.length > 0) {
    alert(errors.join("\n")); // 简单的alert提示
    return;
  }

  // 所有校验通过，执行创建逻辑
  console.log("所有校验通过，准备创建红包");

  // 组装数据
  const currentData: BonusData = {
    Id: uuidv4(),
    packetName,
    startTime,
    useTime,
    isConditionSelected,
    isTypeSelected,
    totalRandom: totalRandom || 0,
    totalFixed: totalFixed || 0,
    packetNumber: packetNumber || 0,
    potatoCoin: potatoCoin || 0,
  };

  // 提交数据到mock接口
  try {
    console.log('开始上传红包数据')
    const response: SaveBonusResponse = await postBonus(currentData)

    // 上传成功后再更新context和导航
    if(response.success) {
      // 同步到全局Context，并标记为已创建
      setBonusData(prev => [...prev, currentData]);
      setIsCreated(true); // 标记创建状态

      // 提示红包创建成功
      alert('红包创建成功！')
      
    }else{
      alert('红包创建失败' + response.message)
    }
  }catch(err){
      // 请求发送失败
      console.error('上传红包数据失败：', err);
      alert('创建红包失败，请重试');
  }
  }

  return (
    <>
      <Modal
        title="创建红包"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onCancel={handleModalClose}
        onOk={handleConfirmCreate}
        cancelText = '取消'
        okText = '创建红包'
      >
        <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        style={{ maxWidth: 1200 }}
        form={form}
        initialValues={{
          // 这里定义的默认值会被 Form.useWatch 自动捕获
          packetName: '', // 红包名称默认
          startTime: '1分钟可抢', // 开抢时间默认值
          useTime: '1分钟内可用', // 可用时间默认值
          isConditionSelected: 1, // 领取条件默认“关注主播”
          isTypeSelected: 1, // 红包类型默认“拼手气”
          totalRandom: 0, // 拼手气总金额默认0
          totalFixed: 0, // 单个面额默认0
          packetNumber: 0, // 红包数量默认0
        }}
        >
          <Form.Item label="红包名称" colon={false} name='packetName' tooltip="红包名称默认为用户名称">
            <Input/>
          </Form.Item>

          <Form.Item label="开抢时间" colon={false} name='startTime'>
            <Select>
              <Select.Option value='1分钟可抢'>1分钟可抢</Select.Option>
              <Select.Option value='2分钟可抢'>2分钟可抢</Select.Option>
              <Select.Option value='5分钟可抢'>5分钟可抢</Select.Option>
              <Select.Option value='10分钟可抢'>10分钟可抢</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="红包可使用时间" colon={false} name='useTime'>
            <Select>
              <Select.Option value="1分钟内可用">1分钟内可用</Select.Option>
              <Select.Option value="2分钟内可用">2分钟内可用</Select.Option>
              <Select.Option value="5分钟内可用">5分钟内可用</Select.Option>
              <Select.Option value="10分钟内可用">10分钟内可用</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="领取条件" colon={false} name='isConditionSelected'>
            <Radio.Group>
              <Radio value={1}> 关注主播 </Radio>
              <Radio value={2}> 不设置条件 </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="红包类型" colon={false} name='isTypeSelected'>
            <Radio.Group>
              <Radio value={1}> 拼手气 </Radio>
              <Radio value={2}> 普通红包 </Radio>
            </Radio.Group>
          </Form.Item>
          {isTypeSelected === 1?           
          <Form.Item label="拼手气总金额" colon={false} name='totalRandom'>
            <InputNumber />
          </Form.Item> :
          <Form.Item label="单个面额" colon={false} name='totalFixed'>
            <InputNumber />
          </Form.Item>
          }

          <Form.Item label="红包数量" colon={false} name='packetNumber'>
            <InputNumber />
          </Form.Item>

          <div className='consume' style={{display: 'flex', marginLeft: '45px'}}>
            <div style={{borderRight:'1px solid gray', paddingRight: '10px'}}>消耗薯币：{potatoCoin}</div>
            <div style={{marginLeft: '10px'}}>薯币余额：{interfaceData?.potatoCoin}</div>
          </div>
        </Form>
        {/* <Typography>
        <pre>Value: {packetName}</pre>
        <pre>Value: {startTime}</pre>
        <pre>Value: {useTime}</pre>
        <pre>Value: {isConditionSelected}</pre>
        <pre>Value: {isTypeSelected}</pre>
        <pre>Value: {totalRandom}</pre>
        <pre>Value: {totalFixed}</pre>
        <pre>Value: {packetNumber}</pre>
      </Typography> */}
      </Modal>
    </>
  );
}


