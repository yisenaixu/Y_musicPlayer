import { isLoggedIn } from './auth'
import {
  getRecommendSongList,
  getDailyRecommendSongList,
  fetchRankList,
} from '../api/playlist'
import { getAllTrack } from '../api/track'

/**
 * @description 获取推荐歌单的范围
 * @param {number} left
 * @param {number} right
 * @returns
 */
export async function getPersonalRecommendSongList(left, right) {
  if (isLoggedIn()) {
    const res = await getDailyRecommendSongList()
    console.debug(res)
    if (left < 0 || right > res.length) return
    return res.recommend.slice(left, right)
  } else {
    const res = await getRecommendSongList(right - left)
    return res.result
  }
}

/**
 * @description 一次获取五十首歌单的歌曲
 */
export async function getPartTrack(id, offset) {
  const res = await getAllTrack({
    id,
    limit: 50,
    offset,
  })
  return res
}

/**
 * @description 获取限制个数的榜单数据
 * @param {Number} limit
 * @returns
 */
export async function fetchLimitRankList(limit) {
  const res = await fetchRankList()
  return res.list.slice(0, limit)
}
