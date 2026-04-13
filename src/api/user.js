import request from '@/utils/request'
import serviceApi from '@/api/serviceApi.config.js'
import ipServiceApi from '@/api/ipServiceApi.config'
export function login(data) {
  return request({
    url: serviceApi.userlogin,
    method: 'post',
    isLoading: false,
    data

  })
}

export function getQrCodeImage(data) {
  return request({
    url: serviceApi.getQrCodeImage,
    method: 'get',
    data
  })
}
export function checkUserPassWord(data) {
  return request({
    url: serviceApi.checkUserPassWord,
    method: 'post',
    data
  })
}
export function getInfo() {
  return request({
    url: serviceApi.queryUserselfInfo,
    method: 'post',
    data: {

    }
  })
}

export function logout() {
  return request({
    url: serviceApi.userlogout,
    method: 'post'
  })
}

export function upPassword(data) {
  return request({
    url: ipServiceApi.upPassword,
    method: 'post',
    data
  })
}
export function queryGroupsByUserId(data) {
  return request({
    url: serviceApi.queryGroupsByUserId,
    method: 'post',
    data,
    isLoading: false
  })
}
export function getUser(data) {
  return request({
    url: ipServiceApi.getUser,
    method: 'post',
    data,
    isLoading: false
  })
}
export function upUser(data) {
  return request({
    url: ipServiceApi.upUser,
    method: 'post',
    data
  })
}
export function switchoverAccount(data) {
  return request({
    url: ipServiceApi.switchoverAccount,
    method: 'post',
    data
  })
}
