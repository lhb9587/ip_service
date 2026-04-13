import request from '@/utils/request'
import serviceApi from '@/api/serviceApi.config.js'

/**
 * 商品服务推荐相关API
 */

// 查询推荐规则
export function queryRecommandRule(params) {
  return request({
    url: serviceApi.queryRecommandRule,
    method: 'get',
    params
  })
}

// 生成商品/服务推荐结果
export function createRecommandContent(data) {
  return request({
    url: serviceApi.createRecommandContent,
    method: 'post',
    data
  })
}

// 查询商品/服务推荐结果
export function queryGoodsRecommand(params) {
  return request({
    url: serviceApi.queryGoodsRecommand,
    method: 'get',
    params,
    isLoading: false
  })
}

// 保存推荐规则等的修改
export function saveTrademarkRequest(data) {
  return request({
    url: serviceApi.saveTrademarkRequest,
    method: 'post',
    data
  })
}

// 保存对商品/服务推荐结果的修改
export function saveGoodsRecommand(data) {
  return request({
    url: serviceApi.saveGoodsRecommand,
    method: 'post',
    data
  })
}

// 生成推荐报告文档
export function createRecommandDoc(data) {
  return request({
    url: serviceApi.createRecommandDoc,
    method: 'post',
    data
  })
}

// 历史数据智能分析
export function analysisGoodsServiceHistory(params) {
  return request({
    url: serviceApi.analysisGoodsServiceHistory,
    method: 'get',
    params,
    isLoading: false
  })
}

// 查询历史推荐列表
export function queryTrademarkRequestList(params) {
  return request({
    url: serviceApi.queryTrademarkRequestList,
    method: 'get',
    params
  })
}

// 查询历史记录
export function queryHistoryRecords(params) {
  return request({
    url: serviceApi.queryHistoryRecords,
    method: 'get',
    params
  })
}

// 删除历史记录
export function deleteHistory(data) {
  return request({
    url: serviceApi.deleteHistory,
    method: 'post',
    data
  })
}

// 创建商标请求（仅创建任务）
export function createTrademarkRequest(data) {
  return request({
    url: serviceApi.createTrademarkRequest,
    method: 'post',
    data
  })
}

// 分析产品功能
export function anylisisProduct(data) {
  return request({
    url: serviceApi.anylisisProduct,
    method: 'post',
    data,
    isLoading: false
  })
}