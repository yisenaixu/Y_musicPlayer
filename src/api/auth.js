import { createAxiosByIntercepors } from '../request'
const request = createAxiosByIntercepors({
  baseURL: '/api',
  withCredentials: true,
  timeout: 15000,
})

export function loginByPhone(params) {
  // return request.post('/login/cellphone',{params})
  return request({
    url: '/login/cellphone',
    method: 'post',
    params,
  })
}

export function loginByEmail(params) {
  return request({
    url: '/login',
    method: 'post',
    params,
  })
}

/**
 * 生成二维码key 用于生成二维码的参数
 */
export function generateQrcodeKey() {
  return request({
    url: '/login/qr/key',
    method: 'get',
    params: {
      timestamp: new Date().getTime(),
    },
  })
}

/**
 * 生成二维码
 * @param {Object} params
 * @param {string} params.key
 * @param {string} params.qrimg //任意数据都可以
 */
export function generateQrcode(params) {
  return request({
    url: '/login/qr/create',
    method: 'get',
    params: {
      ...params,
      timestamp: new Date().getTime(),
    },
  })
}

/**
 * 检测二维码状态
 * 轮询此接口获取二维码扫码状态
 * @param {string} key
 */
export function checkQrcode(key) {
  return request({
    url: '/login/qr/check',
    method: 'get',
    params: {
      key,
      timestamp: new Date().getTime(),
    },
  })
}

/**
 * @description 退出登录
 *
 */
export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}
