import request from '../utils/request'
import { timestamp } from '../utils/timestamp'

export function fm() {
  return request({
    url: '/personal_fm',
    method: 'get',
    params: {
      timestamp: timestamp(),
    },
  })
}
