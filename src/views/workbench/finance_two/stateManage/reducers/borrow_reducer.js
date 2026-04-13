import { Message, MessageBox } from 'element-ui'
import { checkBorrowTasker } from '@/api/caseList'

function borrowReducer(ctx) {
  function checkSeletedRows(isCheck = true) {
    if (ctx.$refs.borrowList.getSelectedRows().length) {
      return ctx.$refs.borrowList.getSelectedRows()
    } else {
      Message.error(`请选择借款！`)
      return false
    }
  }
  // 创建
  function borrow_create() {
    ctx.$refs.borrowList['borrowCreate']()
  }
  // 修改
  function borrow_edit() {
    if (checkSeletedRows()) {
      if (!checkSeletedRows()[0].flag) {
        Message.error(`该借款您无法更改！`)
      } else {
        ctx.$refs.borrowList['borrowEdit'](checkSeletedRows()[0])
      }
    }
  }
  // 删除
  function borrow_delete() {
    if (checkSeletedRows()) {
      if (checkSeletedRows().find(item => !item.flag)) {
        Message.error(`部分借款您无法更改！`)
      } else {
        ctx.$refs.borrowList['borrowDelete'](checkSeletedRows())
      }
    }
  }

  // 提交
  function borrow_submit() {
    checkSeletedRows() && ctx.$refs.borrowList['doLoanTask'](1)
  }

  // 财务审核
  function borrow_audit() {
    checkSeletedRows() && MessageBox.confirm('借款财务审核', {
      confirmButtonText: '通过',
      cancelButtonText: '退回',
      closeOnClickModal: false,
      distinguishCancelAndClose: true,
      type: 'warning'
    }).then(() => {
      ctx.$refs.borrowList['doLoanTask'](2, 1)
    }).catch((e) => {
      if (e == 'close') {
        return false
      }
      ctx.$refs.borrowList['doLoanTask'](2, 0)
    })
  }

  // 支付
  function borrow_pay() {
    checkSeletedRows() && ctx.$refs.borrowList['doLoanTask'](3)
  }

  // 还款
  function borrow_repay() {
    checkSeletedRows() && ctx.$refs.borrowList['doLoanTask'](4)
  }
  // 改签
  function borrow_rebook(...args) {
    // 右键改签
    if (args[0].rightKeySign) {
      checkBorrowTasker({ taskIdList: args[0].taskId }).then(res => {
        ctx.$data.dialogRebookVisible = true
        ctx.$nextTick(() => {
          ctx.$refs.rebook.$data.taskIdList = args[0].taskId
        })
      })
    } else {
      checkSeletedRows() && checkBorrowTasker({ taskIdList: checkSeletedRows().map(item => item.taskId) }).then(res => {
        ctx.$data.dialogRebookVisible = true
        ctx.$nextTick(() => {
          ctx.$refs.rebook.$data.taskIdList = checkSeletedRows().map(item => item.taskId)
        })
      })
    }
  }
  // 搜索
  function borrow_search(...args) {
    let searchType = args[0],
      searchData = args[1] || {}
    ctx.$refs.borrowList['handleSearch']({ searchType, searchData })
  }
  // 清空搜索
  function borrow_clear_search(...args) {
    let that = args[0]
    ctx.$refs.borrowList['clearSearch'](that)
  }
  return {
    borrow_create,
    borrow_edit,
    borrow_delete,
    borrow_submit,
    borrow_audit,
    borrow_pay,
    borrow_repay,
    borrow_rebook,
    borrow_search,
    borrow_clear_search
  }
}

export default borrowReducer
