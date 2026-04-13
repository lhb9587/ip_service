import {Message, MessageBox} from 'element-ui'
function outBillReducer(ctx) {
  // 检查是否选中
  function checkSeletedRows(isCheck = true) {
    if (ctx.$refs.overseasBillList.getSelectedRows().length) {
      return ctx.$refs.overseasBillList.getSelectedRows()
    } else {
      Message.error(`请选择境外账单！`)
      return false
    }
  }

  // 搜索
   function out_bill_search(...args) {
    let searchType = args[0],
      searchData = args[1] || {}
      ctx.$refs.overseasBillList['handleSearch']({ searchType, searchData })
   }

   // 新建
  function out_bill_create() {
    ctx.createFun()
  }

  // 提交
  function out_bill_submit() {
    ctx.$refs.overseasBillList.toExamine('提交')
  }

  //初审
  function out_bill_first_audit() {
    checkSeletedRows() && MessageBox.confirm('财务初审', {
      confirmButtonText: '通过',
      cancelButtonText: '退回',
      distinguishCancelAndClose: true,
      type: 'warning'
    }).then(() => {
      ctx.$refs.overseasBillList.toExamine('财务初审通过')
    }).catch((action) => {
      action === 'cancel' ? ctx.$refs.overseasBillList.toExamine('财务初审退回') : ''
    })
  }

  // 支付
  function out_bill_pay() {
    let idx = 0;
    if (checkSeletedRows() && checkSeletedRows().findIndex(item => !item.purchaseOrPayExcRate || !item.payDeptId) != -1) {
      idx = checkSeletedRows().findIndex(item => !item.purchaseOrPayExcRate || !item.payDeptId)
      Message.error(`第${idx + 1}条境外账单中缺少支付公司或购付汇信息！`)
      return
    }
    ctx.$refs.overseasBillList.toExamine('支付')
  }

  // 复审
  function out_bill_second_audit() {
    ctx.$refs.overseasBillList.toExamine('费用复审')
  }

  // 同批付款
  function out_bill_batch_pay() {
    ctx.$refs.overseasBillList.batchPayAbroad()
  }

  // 修改
  function out_bill_edit() {
    checkSeletedRows() && ctx.$refs.overseasBillList.checkEdit(checkSeletedRows()[0])
  }

  // 删除
  function out_bill_del() {
    // alert('删除鸭')
  }
  // 清空搜索
  function out_bill_clear_search(...args) {
    let that = args[0]
    ctx.$refs.overseasBillList['clearSearch'](that)
  }

  // 批量编辑
  function out_bill_pl_edit() {
    checkSeletedRows() && ctx.$refs.overseasBillList.batchEdit()
  }

  // 模板生成
  function out_bill_export_model() {
    // checkSeletedRows() && ctx.$refs.overseasBillList.exportModel()
  }

  // 生成费用
  function out_bill_create_fee() {
    checkSeletedRows() && ctx.$refs.overseasBillList.createFee()
  }

  // 改签
  function out_bill_rebook(...args) {
    if (checkSeletedRows()){
      let num = checkSeletedRows().filter(i => !i.taskId).length
      checkSeletedRows().map(item => item.taskerId).forEach(item => {
        if (item){
          var taskIdList = item.split(';')
          if (taskIdList.indexOf(String(ctx.$store.getters.userId)) == -1 ) {
            num ++
          }
        }
      })
      if(num){
        Message.error(`您所选择的 [境外账单] 中有 [${num}] 条不是您的任务！`)
        return
      }
      ctx.dialogRebookVisible = true
      ctx.$nextTick(() => {
        ctx.$refs.rebook.$data.taskIdList = checkSeletedRows().map(item => item.taskId)
      })
    }
  }

  //上传境外账单
  function out_bill_upload() {
    ctx.$refs.overseasBillList.handleSelect()
  }

  //下载境外账单
  function out_bill_download() {
    ctx.$refs.overseasBillList.downloadBills()
  }

  //批量导入境外账单
  function out_bill_patchimport() {
    ctx.$refs.overseasBillList.patchimport()
  }

  return {
    out_bill_search,
    out_bill_create,
    out_bill_submit,
    out_bill_first_audit,
    out_bill_pay,
    out_bill_second_audit,
    out_bill_batch_pay,
    out_bill_edit,
    out_bill_del,
    out_bill_clear_search,
    out_bill_pl_edit,
    out_bill_export_model,
    out_bill_create_fee,
    out_bill_rebook,
    out_bill_upload,
    out_bill_download,
    out_bill_patchimport
  }
}

export default outBillReducer
