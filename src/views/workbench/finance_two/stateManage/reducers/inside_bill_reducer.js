import {Message, MessageBox} from 'element-ui'
function outBillReducer(ctx) {
  // 检查是否选中
  function checkSeletedRows(isCheck = true) {
    if (ctx.$refs.insideBillList.getSelectedRows().length) {
      return ctx.$refs.insideBillList.getSelectedRows()
    } else {
      Message.error(`请选择内部账单！`)
      return false
    }
  }
  // 搜索
  function inside_bill_search(...args) {
    let searchType = 1,
      searchData = args[1] || {}
      ctx.$refs.insideBillList['handleSearch']({ searchType, searchData })
  }

  // 新建
  function inside_bill_create() {
    ctx.$refs.insideBillList.$data.writeOffView = true
  }

  //修改
  function inside_bill_edit() {
    checkSeletedRows() && ctx.$refs.insideBillList.editBill(checkSeletedRows()[0])
  }

  //审核
  function inside_bill_audit() {
    ctx.$refs.insideBillList.shbtnclick()
  }

  // 清空搜索
  function indise_bill_clear_search(...args) {
    let that = args[0]
    ctx.$refs.insideBillList['clearSearch'](that)
  }


  return {
    inside_bill_create,
    inside_bill_edit,
    inside_bill_audit,
    inside_bill_search,
    indise_bill_clear_search
  }
}

export default outBillReducer
