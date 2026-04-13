import { Message, MessageBox } from 'element-ui'
import { checkInvoiceBorrowTasker } from '@/api/caseList'

function invoiceOpenerReducer(ctx) {
  function checkSeletedRows(isCheck = true) {
    if (ctx.$refs.invoiceOpenerList.getSelectedRows().length) {
      return ctx.$refs.invoiceOpenerList.getSelectedRows()
    } else {
      Message.error(`请选择发票！`)
      return false
    }
  }

  // 创建
  function invoice_opener_create() {
    ctx.$refs.invoiceOpenerList['create']()
  }

  // 修改
  function invoice_opener_edit() {
    checkSeletedRows() && ctx.$refs.invoiceOpenerList['editInvocie'](checkSeletedRows()[0])
  }
  // 删除
  function invoice_opener_delete() {
    checkSeletedRows() && ctx.$refs.invoiceOpenerList['deleteInvocies'](checkSeletedRows())
  }

  // 提交
  function invoice_opener_submit() {
    checkSeletedRows() && ctx.$refs.invoiceOpenerList['doTask'](1)
  }

  // 审核
  function invoice_opener_audit() {
    checkSeletedRows() && MessageBox.confirm('发票财务审核', {
      confirmButtonText: '通过',
      cancelButtonText: '退回',
      closeOnClickModal: false,
      distinguishCancelAndClose: true,
      type: 'warning'
    }).then(() => {
      ctx.$refs.invoiceOpenerList['doTask'](2, 1)
    }).catch((e) => {
      if (e == 'close') {
        return false
      }
      ctx.$refs.invoiceOpenerList['doTask'](2, 0)
    })
  }

  // 开具
  function invoice_opener() {
    checkSeletedRows() && MessageBox.confirm('发票开具', {
      confirmButtonText: '通过',
      cancelButtonText: '退回',
      closeOnClickModal: false,
      distinguishCancelAndClose: true,
      type: 'warning'
    }).then(() => {
      ctx.$refs.invoiceOpenerList['doTask'](3, 1)
    }).catch((e) => {
      if (e == 'close') {
        return false
      }
      ctx.$refs.invoiceOpenerList['doTask'](3, 0)
    })
  }

  // 改签
  function invoice_opener_rebook(...args) {
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

  // 批量修改开具日期
  function invoice_opener_date() {
    checkSeletedRows() && ctx.$refs.invoiceOpenerList.editDate()
  }

  // 搜索
  function invoice_opener_search(...args) {
    let searchType = args[0],
        searchData = args[1] || {}
    ctx.$refs.invoiceOpenerList['handleSearch']({ searchType, searchData })
  }
  // 清空搜索
  function invoice_opener_clear_search(...args) {
    let that = args[0]
    ctx.$refs.invoiceOpenerList['clearSearch'](that)
  }

  // 统计组税额
  function invoice_opener_tax_amount() {
    ctx.$refs.invoiceOpenerList.queryReceiptCompanyFunc()
  }
  //上传发票
  function invoice_upload() {
    ctx.$refs.invoiceOpenerList.handleSelect()
  }
  return {
    invoice_opener_create,
    invoice_opener_edit,
    invoice_opener_delete,
    invoice_opener_submit,
    invoice_opener_audit,
    invoice_opener,
    invoice_opener_rebook,
    invoice_opener_search,
    invoice_opener_clear_search,
    invoice_opener_date,
    invoice_opener_tax_amount,
    invoice_upload
  }
}

export default invoiceOpenerReducer
