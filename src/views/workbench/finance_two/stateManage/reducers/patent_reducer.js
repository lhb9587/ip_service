import {Message, MessageBox} from 'element-ui'

function patentReducer(ctx) {
  // 检查是否选中
  function checkSeletedRows(isCheck = true) {
    if (ctx.$refs.patentList.getSelectedRows().length) {
      return ctx.$refs.patentList.getSelectedRows()
    } else {
      Message.error(`请选择官费！`)
      return false
    }
  }

  // 新建清单
  function patent_create() {
    ctx.$refs.patentList['createList']()
  }
  // 修改
  function patent_edit() {
    checkSeletedRows() && ctx.$refs.patentList['editFun'](checkSeletedRows()[0])
  }
  // 搜索
  function patent_search(...args) {
    let flag = '',
      searchData = args[1] || {};
    if(args[0] === undefined){
      flag = 1
    }
    ctx.$refs.patentList['queryPayList'](flag, '')
  }

  // 网络支付
  function patent_net_pay() {

  }

  // 财务支付
  function patent_finance_pay() {

  }

  // 收据录入
  function patent_receipt_input() {
    ctx.$refs.patentList.sjClick()
  }

  // 缴费汇率
  function patent_charge_exchange() {
    ctx.$refs.patentList.editCurrency()
  }

  function patent_merge() {
    ctx.$refs.patentList.mergePatent()
  }

  return {
    patent_search,
    patent_edit,
    patent_create,
    patent_net_pay,
    patent_finance_pay,
    patent_receipt_input,
    patent_charge_exchange,
    patent_merge
  }
}

export default patentReducer
