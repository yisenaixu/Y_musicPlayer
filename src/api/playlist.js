import request from '../utils/request'
/**
 * @description 调用此接口 , 可获取推荐歌单
 * @param {*} param
 * @returns
 */
export function getRecommendSongList(limit) {
  return request({
    url: '/personalized',
    method: 'get',
    params: {
      limit: limit,
    },
  })
}

/**
 * @description 调用此接口 , 可获得每日推荐歌单 ( 需要登录 )
 * @param {Object} params
 * @param {number} params.limit
 * @returns
 */
export function getDailyRecommendSongList(params) {
  return request({
    url: '/recommend/resource',
    method: 'get',
    params: {
      params,
      // timestamp,
    },
  })
}

/**
 * @description 调用此接口 , 传入歌单 id, 可 以获取对应歌单内的所有的音乐
 * @param {String} id
 */
export function getSongListDetail(id) {
  return request({
    url: '/playlist/detail',
    method: 'get',
    params: {
      id,
    },
  })
}

/**
 * @description 调用此接口 , 可获取网友精选碟歌单
 * @params {String} cat
 * @params {Number} limit
 * @params {String} order
 */
export function fetchPlaylistByCat(cat, limit, offset, order = 'hot') {
  return request({
    url: '/top/playlist',
    method: 'get',
    params: {
      order,
      cat,
      limit,
      offset,
    },
  })
}

/**
 * @description 调用此接口,可获取所有榜单
 *
 */
export function fetchRankList() {
  return request({
    url: '/toplist',
    method: 'get',
  })
}
