import request from '@/utils/request'
import serviceApi from '@/api/serviceApi.config.js'

export function queryCaseTagTree(data) {
  return request({
    url: serviceApi.queryCaseTagTree,
    method: 'post',
    data,
    isLoading: false
  })
}

export function queryCaseTagCustAllow(data) {
  return request({
    url: serviceApi.queryCaseTagCustAllow,
    method: 'post',
    data,
    isLoading: false
  })
}

export function batchUpdateCaseTag(data) {
  return request({
    url: serviceApi.batchUpdateCaseTag,
    method: 'post',
    data,
    isLoading: true
  })
}

export function updateCaseTag(data) {
  return request({
    url: serviceApi.updateCaseTag,
    method: 'post',
    data,
    isLoading: true
  })
}

export function clearCaseTag(data) {
  return request({
    url: serviceApi.clearCaseTag,
    method: 'post',
    data,
    isLoading: true
  })
}
