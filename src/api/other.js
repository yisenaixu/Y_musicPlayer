import request from '../utils/request'

/**
 * @description 调用此接口 , 传入搜索关键词可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户 ,
 *   关键词可以多个 , 以空格隔开 , 如 " 周杰伦 搁浅 "( 不需要登录 ), 可通过 /song/url 接口传入歌曲 id 获取具体的播放链接
 * @param {object} param
 * @param {string} param.keywords
 * @returns
 */
export function search(keywords, type, limit) {
  return request({
    url: '/search',
    method: 'get',
    params: {
      keywords,
      type,
      limit,
    },
  })
}
