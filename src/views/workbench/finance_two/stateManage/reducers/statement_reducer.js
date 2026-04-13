import {Message} from "element-ui";

function reportReducer(ctx) {

  function checkSeletedRows(isCheck = true) {
    if (ctx.$refs.cust_grid.getSelectedRows().length) {
      return ctx.$refs.cust_grid.getSelectedRows()
    } else {
      Message.error(`请选择客户！`)
      return false
    }
  }
 // 设定信用等级
  function statement_credit(...args) {
    if (args[0].rightKeySign) {
      const {custId, name} = args[0]
      ctx.$data.creditDialogVisible = true
      ctx.$data.creditType = '新建'
      ctx.$nextTick(() => {
        ctx.$refs.credit.$data.creditData.custIds = String(custId)
        ctx.$refs.credit.$data.creditData.custNames = name
      })
    } else {
      if (checkSeletedRows()) {
        ctx.$data.creditDialogVisible = true
        ctx.$data.creditType = '新建'
        ctx.$nextTick(() => {
          ctx.$refs.credit.$data.creditData.custIds = checkSeletedRows().map(item => item.custId).join(',')
          ctx.$refs.credit.$data.creditData.custNames = checkSeletedRows().map(item => item.name).join(', ')
        })
      }
    }
  }
  // 修改信用等级
  function statement_edit_credit(...args) {
    const {custId,memo, custIdStr, custCreditId, level, createDate, userIdStr, userId, eventType, notAdvanceFlag, materialList=[]} = args[0]
      ctx.$data.creditDialogVisible = true
      ctx.$data.creditType = eventType
      ctx.$nextTick(() => {
        // ctx.$refs.credit.$data.creditData.custIds = String(custId)
        ctx.$refs.credit.$data.creditData.custNames = custIdStr
        ctx.$refs.credit.$data.creditData.custCreditId = custCreditId
        ctx.$refs.credit.$data.creditData.custId = custId
        ctx.$refs.credit.$data.creditData.level = level
        ctx.$refs.credit.$data.creditData.createDate = createDate
        ctx.$refs.credit.$data.creditData.memo = memo
        ctx.$refs.credit.$data.userName = userIdStr
        ctx.$refs.credit.$data.creditData.userId = userId
        ctx.$refs.credit.$data.creditData.notAdvanceFlag = notAdvanceFlag
        ctx.$refs.credit.$data.creditData.materialList = materialList
      })
  }
  // 修改对账信息
  function statement_edit_statement(...args) {
    const {eventType} = args[0]
    ctx.$data.checkBillDialogVisible = true
    ctx.$data.checkBillType = eventType
    ctx.$nextTick(() => {
      // args[0].reconcileType && (args[0].reconcileType = +args[0].reconcileType)
      ctx.$refs.check_bill.$data.checkBillData = args[0]
      ctx.$refs.check_bill.$data.custName = args[0].custIdStr
    })
  }
  // 设定对账信息
  function statement_set_statement(...args) {
    if (args[0].rightKeySign) {
      const {custId, name} = args[0]
      ctx.$data.statementDialogVisible = true
      ctx.$data.statementType = '新建'
      ctx.$nextTick(() => {
        ctx.$refs.statement.$data.statementData.custId = custId
        ctx.$refs.statement.$data.custName = name
      })
    } else {
      if (checkSeletedRows()) {
        ctx.$data.statementDialogVisible = true
        ctx.$data.statementType = '新建'
        ctx.$nextTick(() => {
          ctx.$refs.statement.$data.statementData.custId = checkSeletedRows()[0].custId
          ctx.$refs.statement.$data.custName = checkSeletedRows()[0].name
        })
      }
    }
  }

  function statement_search(...args) {
    let searchType = args[0],
      searchData = args[1] || {}
    ctx.$nextTick(() => {
      ctx.$refs.cust_grid['handleSearch']({searchType, searchData})
    })

    // ctx.$refs.cust_grid['handleSearch']({searchType, searchData})
  }

  // 导出
  function statement_export() {

  }

  return {
    statement_credit,
    statement_set_statement,
    statement_search,
    statement_edit_credit,
    statement_edit_statement,
    statement_export
  }
}

export default reportReducer
