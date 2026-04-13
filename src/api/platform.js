import request from '@/utils/request'
import serviceApi from '@/api/serviceApi.config.js'

// 平台管理相关API
export function createPlatform(data) {
  return request({
    url: serviceApi.createPlatform,
    method: 'post',
    data
  })
}

export function updatePlatform(data) {
  return request({
    url: serviceApi.updatePlatform,
    method: 'post',
    data
  })
}

export function deletePlatform(data) {
  return request({
    url: serviceApi.deletePlatform,
    method: 'post',
    data
  })
}

export function queryPlatformList(params) {
  return request({
    url: serviceApi.queryPlatformList,
    method: 'post',
    params
  })
}

export function queryPlatformDetail(params) {
  return request({
    url: serviceApi.queryPlatformDetail,
    method: 'post',
    params
  })
}

export function enablePlatform(data) {
  return request({
    url: serviceApi.enablePlatform,
    method: 'post',
    data,
  })
}

export function disablePlatform(data) {
  return request({
    url: serviceApi.disablePlatform,
    method: 'post',
    data,
  })
}

export function queryUserPlatformList(data) {
  return request({
    url: serviceApi.queryUserPlatformList,
    method: 'post',
    data,
  })
}

// 账户管理相关API
export function createAccount(data) {
  return request({
    url: serviceApi.createAccount,
    method: 'post',
    data
  })
}

export function updateAccount(data) {
  return request({
    url: serviceApi.updateAccount,
    method: 'post',
    data
  })
}

export function deleteAccount(data) {
  return request({
    url: serviceApi.deleteAccount,
    method: 'post',
    data
  })
}

export function queryAccountList(params) {
  return request({
    url: serviceApi.queryAccountList,
    method: 'post',
    params
  })
}

export function queryAccountDetail(params) {
  return request({
    url: serviceApi.queryAccountDetail,
    method: 'post',
    params
  })
}

export function enableAccount(data) {
  return request({
    url: serviceApi.enableAccount,
    method: 'post',
    data,
  })
}

export function disableAccount(data) {
  return request({
    url: serviceApi.disableAccount,
    method: 'post',
    data,
  })
}