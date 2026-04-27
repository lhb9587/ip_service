import request from '@/utils/request'
import serviceApi from '@/api/serviceApi.config.js'
import ipServiceApi from '@/api/ipServiceApi.config.js'

// 创建撰写
export function createPatentWriting(data) {
  return request({
    url: serviceApi.createPatentWriting,
    method: 'post',
    data
  })
}

// 提交撰写
export function patentWritingappSubmit(data) {
    return request({
    url: serviceApi.patentWritingappSubmit,
    method: 'post',
    data
  })
}
// 查询撰写详情
export function queryPatentWritingDetail(data) {
    return request({
    url: serviceApi.queryPatentWritingDetail,
    method: 'post',
    data
  })
}
// 查询撰写列表
export function queryPatentWritingList(data) {
    return request({
    url: serviceApi.queryPatentWritingList,
    method: 'post',
    data
  })
}
// 撰写审核
export function patentWritingappExamine(data) {
    return request({
    url: serviceApi.patentWritingappExamine,
    method: 'post',
    data
  })
}
// 撰写退回
export function queryPatentWritingReturnReasonList(data) {
    return request({
    url: serviceApi.queryPatentWritingReturnReasonList,
    method: 'post',
    data
  })
}
