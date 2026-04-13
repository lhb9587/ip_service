import { Message, MessageBox } from 'element-ui'

function outPriceReducer(ctx) {
  // 检查是否选中
  function checkSeletedRows(isCheck = true) {
    if (ctx.$refs.overseasPriceList.getSelectedRows().length) {
      return ctx.$refs.overseasPriceList.getSelectedRows()
    } else {
      Message.error(`请选择报价！`)
      return false
    }
  }

  // 搜索
  function out_price_search() {
    ctx.$nextTick(() => {
      ctx.$refs.overseasPriceList.handleSearch()
    })
  }

  // 新建
  function out_price_create() {
    ctx.$refs.overseasPriceList.createBJ()
  }

  // 修改
  function out_price_edit() {
    if (checkSeletedRows()) {
      if (checkSeletedRows()[0].modifyPer) {
        ctx.$refs.overseasPriceList.editFun(checkSeletedRows()[0])
      } else {
        Message.error(`该报价您无法修改！`)
      }
    }
  }

  // 逐一报价表
  function out_price_zy() {
    ctx.$refs.overseasPriceList.ZYClick()
  }

  // 马德里报价表
  function out_price_mdl() {
    ctx.$refs.overseasPriceList.MDLClick()
  }

  // 模板生成
  function out_price_export_model() {
    // ctx.$refs.overseasPriceList.createModel()
  }

  // 外币汇率
  function out_price_waibi() {
    ctx.$refs.overseasPriceList.waibiClick()
  }

  return {
    out_price_search,
    out_price_create,
    out_price_edit,
    out_price_zy,
    out_price_mdl,
    out_price_export_model,
    out_price_waibi
  }
}

export default outPriceReducer
