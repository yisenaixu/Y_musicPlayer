import { timestamp } from '../utils/timestamp'
import { createAxiosByIntercepors } from '../request'
const request = createAxiosByIntercepors({
  baseURL: '/api',
  withCredentials: true,
  timeout: 15000,
})

/**
 * @description 获取用户账号信息
 * @returns {}
 */
export function userAccount() {
  return request({
    url: '/user/account',
    methods: 'get',
    params: {
      timestamp: timestamp(),
    },
  })
}

/**
 * @description 登录后调用此接口 , 传入用户 id, 可获取用户播放记录 type=1 时只返回 weekData, type=0 时返回 allData
 * @param {Object} params
 * @param {number} params.uid
 * @param {number} params,type
 */
export function userPlayHistory(params) {
  return request({
    url: '/user/record',
    method: 'get',
    params,
  })
}

/**
 * @description 调用此接口 , 传入用户 id, 可获取已喜欢音乐 id 列表(id 数组)
 * @param {number} uid
 */
export function userLikeSongsIDs(uid) {
  return request({
    url: '/likelist',
    method: 'get',
    params: {
      uid,
      timestamp: timestamp(),
    },
  })
}

/**
 * @description 登录后调用此接口 , 传入用户 id, 可以获取用户歌单
 * @param {Object} params
 * @param {number} params.uid     userId
 * @param {number} params.limit  default: 30   pageSize
 * @param {number} params.offset  default 0   current
 */
export function userPlaylist(params) {
  return request({
    url: '/user/playlist',
    method: 'get',
    params: {
      ...params,
      timestamp: timestamp(),
    },
  })
}

/**
 * @description 获取收藏的专辑（需要登录）
 * @param {Object} params
 * @param {number} params.limit default 25
 * @param {number} params.offset default 0
 * @returns
 */
export function likedAlbums(params) {
  return request({
    url: '/album/sublist',
    method: 'get',
    params,
  })
}

/**
 * @description 获取收藏的歌手（需要登录）
 * @param {Object} params
 * @param {number} params.limit default 25
 * @param {number} params.offset default 0
 * @returns
 */
export function likedArtists(params) {
  return request({
    url: '/artist/sublist',
    method: 'get',
    params,
  })
}

/**
 * @description 获取收藏的MV（需要登录）
 * @returns
 */
export function likedMVs() {
  return request({
    url: '/mv/sublist',
    method: 'get',
  })
}
