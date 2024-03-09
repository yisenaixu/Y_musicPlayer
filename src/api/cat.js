import request from '../utils/request'
export function getHotPlayListCats() {
  return request({
    url: '/playlist/hot',
    method: 'get',
  })
}

/**
 * @description 调用此接口,可获取歌单分类,包含 category 信息
 *
 */
export function fetchAllCatlist() {
  return request({
    url: '/playlist/catlist',
    method: 'get',
  })
}
