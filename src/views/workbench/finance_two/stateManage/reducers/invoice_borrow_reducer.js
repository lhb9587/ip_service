import { Message } from 'element-ui'
import { checkInvoiceBorrowTasker } from '@/api/caseList'

function invoiceBorrowReducer(ctx) {
  function checkSeletedRows(isCheck = true) {
    if (ctx.$refs.invoiceBorrowList.getSelectedRows().length) {
      return ctx.$refs.invoiceBorrowList.getSelectedRows()
    } else {
      Message.error(`请选择外借发票！`)
      return false
    }
  }

  // 创建
  function invoice_borrow_create() {
    ctx.$refs.invoiceBorrowList['borrowCreate']()
  }

  // 修改
  function invoice_borrow_edit() {
    checkSeletedRows() && ctx.$refs.invoiceBorrowList['borrowEdit'](checkSeletedRows()[0])
  }
  // 删除
  function invoice_borrow_delete() {
    checkSeletedRows() && ctx.$refs.invoiceBorrowList['borrowDelete'](checkSeletedRows())
  }

  // 提交
  function invoice_borrow_submit() {
    checkSeletedRows() && ctx.$refs.invoiceBorrowList['doTask'](1)
  }

  // 核销
  function invoice_borrow_audit() {
    checkSeletedRows() && ctx.$refs.invoiceBorrowList['doTask'](2)
  }

  // 时限延期
  function invoice_time_delay() {
    checkSeletedRows() && ctx.$refs.invoiceBorrowList['timeDelay'](checkSeletedRows())
  }

  // 批量修改欠发票人
  function invoice_borrow_debtor() {
    checkSeletedRows() && ctx.$refs.invoiceBorrowList.editDebtor()
  }

  // 改签
  function invoice_borrow_rebook(...args) {
    // 右键改签
    if (args[0].rightKeySign) {
      checkInvoiceBorrowTasker({ taskIdList: args[0].taskId }).then(res => {
        ctx.$data.dialogRebookVisible = true
        ctx.$nextTick(() => {
          ctx.$refs.rebook.$data.taskIdList = args[0].taskId
        })
      })
    } else {
      checkSeletedRows() && checkInvoiceBorrowTasker({ taskIdList: checkSeletedRows().map(item => item.taskId) }).then(res => {
        ctx.$data.dialogRebookVisible = true
        ctx.$nextTick(() => {
          ctx.$refs.rebook.$data.taskIdList = checkSeletedRows().map(item => item.taskId)
        })
      })
    }
  }

  // 搜索
  function invoice_borrow_search(...args) {
    let searchType = args[0],
        searchData = args[1] || {}
    ctx.$refs.invoiceBorrowList['handleSearch']({ searchType, searchData })
  }
  // 清空搜索
  function invoice_borrow_clear_search(...args) {
    let that = args[0]
    ctx.$refs.invoiceBorrowList['clearSearch'](that)
  }
  return {
    invoice_borrow_create,
    invoice_borrow_edit,
    invoice_borrow_delete,
    invoice_borrow_submit,
    invoice_borrow_audit,
    invoice_borrow_debtor,
    invoice_borrow_rebook,
    invoice_borrow_search,
    invoice_borrow_clear_search,
    invoice_time_delay
  }
}

export default invoiceBorrowReducer
