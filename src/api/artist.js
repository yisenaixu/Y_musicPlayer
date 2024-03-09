import request from '../utils/request'
/**
 * @description 调用此接口 , 可获取热门歌手数据
 * @param {Number} limit
 * @param {Number} offset
 */
export function fetchTopArtists(limit, offset) {
  return request({
    url: '/top/artists',
    method: 'get',
    params: {
      limit,
      offset,
    },
  })
}

/**
 * @description 获取歌手所有专辑
 * @param {Number} id
 * @param {Number} limit
 * @param {Number} offset
 */
export function fetchArtistAlbums(id, limit, offset) {
  return request({
    url: '/artist/album',
    method: 'get',
    params: {
      id,
      limit,
      offset,
    },
  })
}

/**
 * @description 获取歌手详情
 * @param {Number} id
 */
export function fetchArtistDetail(id) {
  return request({
    url: '/artist/detail',
    method: 'get',
    params: {
      id,
    },
  })
}

/**
 * @description 获取歌手热门50首歌曲
 * @param {Number} id
 */
export function fetchArtistHotSong(id) {
  return request({
    url: '/artist/top/song',
    method: 'get',
    params: {
      id,
    },
  })
}

/**
 * @description 获取歌手mv
 * @param {Object} params
 * @param {number} params.id 歌手id
 * @param {number} params.offset
 * @param {number} params.limit
 */
export function fetchArtistMv(params) {
  return request({
    url: '/artist/mv',
    method: 'get',
    params,
  })
}
