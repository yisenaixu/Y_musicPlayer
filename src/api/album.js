import request from '../utils/request'

/**
 * @description 获取首页最新专辑 length = 12
 */
export function fetchNewestAlbums() {
  return request({
    url: '/album/newest',
    method: 'get',
  })
}

/**
 * @description 登录后调用此接口 ,可获取全部新碟
 * @param {Object} params
 * @param {number} params.limit   max: 500 defalut: 30
 * @param {number} params.offset
 * @param {string} params.area 地区 ALL | ZH | EA | KR | JP
 */
export function fetchNewAlbums(params) {
  return request({
    url: '/album/new',
    method: 'get',
    params,
  })
}
/**
 * @description 获取专辑内容
 */
export function fetchAlbumDetail(id) {
  return request({
    url: '/album',
    method: 'get',
    params: {
      id,
    },
  })
}
