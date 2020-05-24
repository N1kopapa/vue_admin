import request from '@/utils/request'

export function fetchLogin(data) {
  return request({
    url: '/api/username',
    method: 'get',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
