import Mock from 'mockjs'
import '@/mock/extend'

const user = Mock.mock({
    name: '@ADMIN',
    avatar: '@AVATAR',
    address: '@CITY',
    position: '@POSITION'
})
Mock.mock(`${process.env.VUE_APP_API_BASE_URL}/register`, 'post', ({body}) => {
    let result = {}
    const {captcha,confirm,password} = JSON.parse(body)
    //     email:   邮箱
    //     mobile: 手机
    if ( captcha !== '4569' ) {
        result.code = -1
        result.message = '验证码错误'
    } else if(confirm !== password){
        result.code = -1
        result.message = '两次密码不一样'
    } else {
        result.code = 200
        result.message = Mock.mock('@WELCOME').CN + '，注册成功'
        result.data = {}
        result.data.user = user
    }
    return result
})
