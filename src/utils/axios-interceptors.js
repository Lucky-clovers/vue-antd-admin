import Cookie from 'js-cookie'
import store from "../store";
// 401拦截
const resp401 = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(response, options) {
    const {message} = options
    if (response.status === 401) {
      message.error('无此接口权限')
    }
    return response
  },
  /**
   * 响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const {message} = options
    message.error(error.message)
    return Promise.reject(error)
  }
}

const resp403 = {
  onFulfilled(response, options) {
    const {message} = options
    if (response.status === 403) {
      message.error(`请求被拒绝`)
    }
    return response
  }
}

const reqCommon = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(config, options) {
    const {message} = options
    const { url,xsrfCookieName} = config
    const urlList = ["login","register"]
    const signIn = store.state.account.signIn
    /**
     * 请求拦截器
     */
    urlList.forEach(values=>{
      if(url.indexOf(values) === -1){
        console.log("url.indexOf(values) === -1",url.indexOf(values) === -1)
        store.commit('account/setSignIn', -1)

      }
    })
    console.log(signIn)
    if (signIn === 200 && xsrfCookieName && !Cookie.get(xsrfCookieName)) {
        message.warning('认证 token 已过期，请重新登录')
    }
    return config
  },
  /**
   * 请求出错时做点什么
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const {message} = options
    message.error(error.message)
    return Promise.reject(error)
  }
}

export default {
  request: [reqCommon], // 请求拦截
  response: [resp401, resp403] // 响应拦截
}
