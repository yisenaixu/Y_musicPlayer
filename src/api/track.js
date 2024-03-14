import {
  cacheTrackDetail,
  cacheTrackLyrics,
  getTrackDetailCache,
  getTrackLyricsFromCache,
} from '../utils/db'
import request from '../utils/request'
/**
 * @description 由于网易云接口限制，歌单详情只会提供 10 首歌，通过调用此接口，
 *              传入对应的歌单id，即可获得对应的所有歌曲
 * @param {Object} params
 */
export function getAllTrack(params) {
  return request({
    url: '/playlist/track/all',
    method: 'get',
    params,
  })
}

/**
 * @description 调用此接口 , 传入音乐 id(支持多个id, 用 , 隔开), 可获得歌曲详情
 * @param {string} ids '1,2,3'
 */
export function getTrackDetail(ids) {
  const getFromRequest = () => {
    return request({
      url: '/song/detail',
      method: 'get',
      params: {
        ids,
      },
    }).then(res => {
      console.debug(res)
      res.songs.map(song => {
        // 缓存歌曲详情
        cacheTrackDetail(song)
      })
      return res
    })
  }
  console.debug(typeof ids)
  console.debug(ids)
  let idsArr = ids.split(',')
  return getTrackDetailCache(idsArr).then(res => {
    console.debug(idsArr)
    console.debug(res)
    return res ?? getFromRequest()
  })
}

/**
 * @description 调用此接口 , 可获得每日推荐歌曲 ( 需要登录 )
 */
export function dailyTracks() {
  return request({
    url: '/recommend/songs',
    method: 'get',
  })
}

/**
 * @description 获取音乐 url
 *  说明 : 使用歌单详情接口后 , 能得到的音乐的 id, 但不能得到的音乐 url,
 * 调用此接口, 传入的音乐 id( 可多个 , 用逗号隔开 ), 可以获取对应的音乐的 url,
 * 未登录状态或者非会员返回试听片段(返回字段包含被截取的正常歌曲的开始时间和结束时间)
 * @param {Object} params
 * @param {number} params.id 歌曲id
 * @param {string} params.level
 */
export function songUrl(params) {
  return request({
    url: '/song/url/v1',
    method: 'get',
    params,
  })
}

/**
 * 获取歌词
 * @description 调用此接口 , 传入音乐 id 可获得对应音乐的歌词 ( 不需要登录 )
 * @param {number} id - 音乐 id
 */
export function getLyrics(id) {
  const getFromRequest = () => {
    return request({
      url: '/lyric',
      method: 'get',
      params: {
        id,
      },
    }).then(res => {
      // 缓存歌词
      cacheTrackLyrics(id, res.lrc.lyric)
      return { lyrics: res.lrc.lyric }
    })
  }
  return getTrackLyricsFromCache(id).then(res => {
    return res ?? getFromRequest()
  })
}
