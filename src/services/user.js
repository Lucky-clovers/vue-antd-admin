import {LOGIN, ROUTES,REGISTER} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  return request(LOGIN, METHOD.POST, {
    name: name,
    password: password
  })
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}

/**
 *注册账号
 * @param captcha 验证码
 * @param email 邮箱
 * @param mobile 手机号
 * @param password 密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function Register(data){
  return request(REGISTER,METHOD.POST,{
    captcha: data.captcha,
    confirm: data.confirm,
    email: data.email,
    mobile: data.mobile,
    password: data.password,
  })

}
export default {
  login,
  logout,
  Register,
  getRoutesConfig
}


