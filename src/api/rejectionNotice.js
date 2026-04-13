import request from '@/utils/request'

/**
 * 创建商标请求任务
 * @param {Object} data - 请求参数
 * @param {String} data.reqName - 任务名称（可选）
 * @returns {Promise}
 */
export function createTrademarkRequest(data) {
  return request({
    url: '/ai_write/proposal/createTrademarkRequest',
    method: 'post',
    data
  })
}

/**
 * 上传驳回通知书文件
 * @param {FormData} data - 文件表单数据
 * @returns {Promise}
 */
export function uploadRejectionFile(data) {
  return request({
    url: '/ai_write/proposal/createMaterial',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 查询商标列表
 * @param {Object} params - 查询参数
 * @param {String} params.regNumber - 商标号
 * @returns {Promise}
 */
export function queryTmList(params) {
  return request({
    url: '/ai_write/proposal/queryTmList',
    method: 'get',
    params
  })
}

/**
 * 保存商标请求信息
 * @param {Object} data - 保存数据
 * @returns {Promise}
 */
export function saveTrademarkRequest(data) {
  return request({
    url: '/ai_write/proposal/saveTrademarkRequest',
    method: 'post',
    data
  })
}

/**
 * 生成报驳回通知邮件
 * @param {Object} data - 请求参数
 * @param {Number} data.requestId - 任务ID
 * @returns {Promise}
 */
export function createRejectionDoc(data) {
  return request({
    url: '/ai_write/proposal/createRejectionDoc',
    method: 'post',
    data
  })
}

