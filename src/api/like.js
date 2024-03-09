import request from '../utils/request'

/**
 * @description 调用此接口 , 传入音乐 id, 可喜欢该音乐
 * @param {Object} params
 * @param {number} params.id
 * @param {boolean} params.like
 */
export function likeSong(params) {
  return request({
    url: '/like',
    methods: 'get',
    params,
  })
}

/**
 * @description 调用此接口,可收藏歌手
 * @param {object} params
 * @param {number} params.id 歌手id
 * @param {number} params.t 1收藏 其他取消
 */
export function likeArtist(params) {
  return request({
    url: '/artist/sub',
    method: 'get',
    params,
  })
}

/**
 * @description 调用此接口,可收藏/取消收藏MV
 * @param {object} params
 * @param {number} params.mvid MV id
 * @param {number} params.t 1收藏 其他取消
 */
export function likeMV(params) {
  return request({
    url: '/mv/sub',
    method: 'get',
    params,
  })
}

/**
 * @description 调用此接口,可收藏/取消收藏歌单
 * @param {object} params
 * @param {number} params.id 歌单 id
 * @param {number} params.t 1收藏 2取消
 */
export function likePlaylist(params) {
  return request({
    url: '/playlist/subscribe',
    method: 'get',
    params,
  })
}

/**
 * @description 调用此接口,可收藏/取消收藏歌专辑
 * @param {object} params
 * @param {number} params.id 专辑 id
 * @param {number} params.t 1收藏 其他取消
 */
export function likeAlbum(params) {
  return request({
    url: '/album/sub',
    method: 'get',
    params,
  })
}
