import { Message, MessageBox } from 'element-ui'
import Vue from '@/main'

function billReducer(ctx) {
  function checkSelected() {
    if(ctx.$refs.billList.getSelectedRows().length){
      return ctx.$refs.billList.getSelectedRows()
    }else{
      Message.error(`请选择账单！`)
      return false
    }
  }
  // 创建
  function bill_create() {
    ctx.$refs.billList['billCreate']('bill')
  }

  // 修改
  function bill_edit() {
    checkSelected() && ctx.$refs.billList['editBill'](checkSelected()[0])
  }

  // 删除
  function bill_delete() {
    checkSelected() && ctx.$refs.billList['delMoreBill'](checkSelected())
  }

  // 填写备注
  function bill_edit_remark() {
    checkSelected() && ctx.$refs.billList['editRemarksEvent'](checkSelected()[0])
  }

  // 修改开单日期
  function bill_edit_date() {
    checkSelected() && ctx.$refs.billList['editBtnclick']('1')
  }

  // 生成总账单号
  function bill_subillno() {
    checkSelected() && ctx.$refs.billList['editBtnclick']('3')
  }

  // 设置结余
  function bill_balance() {
    checkSelected() && ctx.$refs.billList['editBtnclick']('4')
  }

  // 开发票
  function bill_create_invoice() {
    checkSelected() && ctx.$refs.billList['takeInvoice'](checkSelected()[0])
  }

  // 搜索
  function bill_search(...args) {
    let searchType = args[0],
      searchData = args[1] || {}
      ctx.$refs.billList['handleSearch']({ searchType, searchData })
  }

  // 清空搜索
  function bill_clear_search(...args) {
    let that = args[0]
    ctx.$refs.billList['clearSearch'](that)
  }

  // 提交
  function bill_submit() {
    checkSelected() && ctx.$refs.billList['submission']('提交', 1)
  }

  // 组长审核
  function bill_headman_audit() {
    checkSelected() && billAudit(ctx,'组长审核', 2)
  }

  // 账单岗审核
  function bill_job_audit() {
    checkSelected() && billAudit(ctx,'账单岗审核', 3)
  }

  // 财务审核
  function bill_audit() {
    checkSelected() && billAudit(ctx,'财务审核', 4)
  }

  // 承办组审核
  function bill_undertake() {
    checkSelected() && billAudit(ctx,'承办组审核', 5)
  }

  // 重新确认比例
  function bill_reconfirm() {
    checkSelected() && ctx.$refs.billList['submission']('确认比例', 6)
  }

  // 改签
  function rebook(...args) {
    if (!ctx.$refs.billList.getSelectedRows().length) {
      Message.error(`请选择账单！`)
      return
    }
    let taskIdList = []
    let num = ctx.$refs.billList.getSelectedRows().filter(i => !i.taskList).length
    ctx.$refs.billList.getSelectedRows().filter(i => i.taskList).map(item => item.taskList).forEach(item => {
      if(item.find(j => j.taskCandidates.includes(String(ctx.$store.getters.userId)))){
        taskIdList.push(item.find(j => j.taskCandidates.includes(String(ctx.$store.getters.userId))).taskId)
      }else{
        num ++
      }
    })
    if(num){
      Message.error(`您所选择的 [账单] 中有 [${num}] 条不是您的任务！`)
      return
    }
    ctx.dialogRebookVisible = true
    ctx.$nextTick(() => {
      ctx.$refs.rebook.$data.taskIdList = taskIdList
      ctx.$refs.rebook.$data.billIds = ctx.$refs.billList.getSelectedRows().map(item => item.billId) + ''
    })
  }

  // 坏账
  function bill_bad_bill() {
    if (!ctx.$refs.billList.getSelectedRows().length) {
      Message.error(`请选择账单！`)
      return
    }
    ctx.$data.badBillView = true
    ctx.$nextTick(() => {
      ctx.$refs.badBill.$data.selectedRows = ctx.$refs.billList.getSelectedRows()
    })
  }
  // 收到境外账单
  function bill_out_bill() {
    if (!ctx.$refs.billList.getSelectedRows().length) {
      Message.error(`请选择账单！`)
      return
    }
    if (ctx.$refs.billList.getSelectedRows().length > 1) {
      Message.error(`只能填写一个账单号！`)
      return
    }
    ctx.$data.outBillView = true
    ctx.$nextTick(() => {
      ctx.$refs.outBill.queryAbroadInfo(ctx.$refs.billList.getSelectedRows()[0].billNo)
    })
  }
  // 模板生成
  function bill_export_model(...args) {
    if (!ctx.$refs.billList.getSelectedRows().length) {
      Message.error(`请选择账单！`)
      args[0].$data.noContent = true
      return
    }
    args[0].$data.noContent = false
  }

  // 账单收款
  function bill_collection() {
    if(checkSelected()){
      if(checkSelected().find(item => !item.custId)){
        Message.error(`对无客户的账单不能进行收款！`)
        return
      }
      if(checkSelected().find(item => !item.billNo)){
        Message.error(`对无账单号的账单不能进行收款！`)
        return
      }
      if(checkSelected().filter(item => item.paymentStatusStr === '收款完毕').length) {
        Message.error(`${checkSelected().filter(item => item.paymentStatusStr === '收款完毕').map(i => i.billNo).join(',')}已收款完毕，不能新建收款！`)
        return;
      }
      ctx.$data.curIdString = checkSelected()[0].curIdString
      ctx.$data.billIds = checkSelected().map(i=>i.billId).join(',')
      ctx.$data.collectDialogVisible = true
    }
  }
  // 账单批量下载
  function bill_download() {
    if (checkSelected()) {
      ctx.$refs.billList.downloadMaterialBatch()
    }
  }

  return {
    bill_create,
    bill_edit,
    bill_edit_remark,
    bill_create_invoice,
    bill_delete,
    bill_search,
    bill_clear_search,
    bill_submit,
    bill_headman_audit,
    bill_job_audit,
    bill_audit,
    bill_undertake,
    bill_reconfirm,
    bill_edit_date,
    bill_subillno,
    bill_balance,
    rebook,
    bill_bad_bill,
    bill_out_bill,
    bill_export_model,
    bill_collection,
    bill_download
  }
}

function billAudit(ctx, typeName, taskNo) {
  const params = {
    result: typeName,
    failReasion: ''
  }
  const h = Vue.$createElement
  let vnode = h({
    template: `
      <div>
        <el-form label-width="100px">
          <el-row>
            <el-form-item label="审核结果">
              <el-radio-group v-model="result">
                <el-radio :label="typename">通过</el-radio>
                <el-radio :label="typename + '退回'">退回</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row v-show="result == typename+'退回'">
            <el-form-item label="退回原因">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="failReasion">
              </el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>`,
    props: {
      params: {}
    },
    data() {
      return {
        typename: '',
        result: '',
        failReasion: ''
      }
    },
    watch: {
      result(n) {
        this.params.result = n
      },
      failReasion(n) {
        this.params.failReasion = n
      }
    },
    created() {
      this.typename = this.params.result
      this.result = this.params.result
      this.failReasion = this.params.failReasion
    }
  }, {
    props: {
      params
    }
  })
  MessageBox.confirm(vnode, typeName, {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    if (params.result === typeName) {
      ctx.$refs.billList['submission'](typeName, taskNo)
    } else {
      ctx.$refs.billList.$data.failReasion = params.failReasion
      ctx.$refs.billList['returnToExamin'](0, taskNo)
    }
  })
}

export default billReducer
