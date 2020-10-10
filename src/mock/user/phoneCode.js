import Mock from 'mockjs'
import '@/mock/extend'


Mock.mock(`${process.env.VUE_APP_API_BASE_URL}/phoneCode`, 'post', ({body}) => {
  let result = {}
  const phoneReg = /^(?:(?:\+|00)86)?1\d{10}$/
  const {phone} = JSON.parse(body)

  if (!phoneReg.test(phone)) {
    result.code = -1
    result.message = '手机号码错误，无法发送验证码'
  } else {
    result.code = 0
    result.message =  '获取验证码成功，验证码（4569）'
  }
  return result
})
