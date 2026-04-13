import {Message, MessageBox} from 'element-ui'
import {checkFeeTasker} from '@/api/feeList'
import {checkPermission} from '@/api/caseList'
import {unique} from '@/utils'
import store from '@/store'
import Vue from '@/main'

function feeReducer(ctx) {
  // 检查是否选中及检查相关任务人
  function checkSeletedRows(isCheck = false, list = ctx.$refs.costList.getSelectedRows()) {
    if (list.length) {
      if (isCheck && list.find(item => item.tasker && !item.tasker.includes(store.getters.name))) {
        Message.error(`存在不属于你的任务！`)
        return false
      }
      return list
    } else {
      Message.error(`请选择费用！`)
      return false
    }
  }

  // 查看
  function fee_see(...args) {
    ctx.seeFee(args[0])
  }

  // 新建
  function fee_create() {
    ctx.editFee({}, 1)
  }

  // 修改
  function fee_edit(...args) {
    if (args[0].rightKeySign) {
      ctx.editFee(args[0], args[0].feeType || 2)
    } else {
      checkSeletedRows() && ctx.$refs.costList.edit(checkSeletedRows()[0])
    }
  }

  // 删除
  function fee_delete() {
    if (checkSeletedRows()) {
      ctx.$refs.costList.deleteFees(unique(checkSeletedRows(), 'feeId'))
    }
  }

  // 提交
  function fee_submit(...args) {
    if (args[0].rightKeySign) {
      checkSeletedRows(true, [args[0]]) && ctx.editFee(args[0], 3)
    } else {
      checkSeletedRows(true) && ctx.$refs.costList.selectionList('费用提交')
    }
  }

  // 报销人所属组审核(组长1审核)
  function fee_group_audit(...args) {
    if (args[0].rightKeySign) {
      checkSeletedRows(true, [args[0]]) && ctx.editFee(args[0], 3)
    } else {
      const params = {
        result: '',
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
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="0">退回</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row v-show="result === 0">
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
          this.result = this.params.result
          this.failReasion = this.params.failReasion
        }
      }, {
        props: {
          params
        }
      })
      checkSeletedRows(true) && MessageBox.confirm(vnode, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (params.result) {
              done()
            } else {
              if (params.failReasion) {
                done()
              } else {
                Vue.$message.error('请输入退回原因')
              }
            }
          } else {
            done()
          }
        }
      }).then(() => {
        if (params.result) {
          ctx.$refs.costList.selectionList('报销人所属组审核', 1)
        } else {
          ctx.$refs.costList.selectionList('报销人所属组审核', 0, params.failReasion)
        }
      })
    }
  }

  // 承担组审核(组长2审核)
  function fee_assumejob_audit(...args) {
    if (args[0].rightKeySign) {
      checkSeletedRows(true, [args[0]]) && ctx.editFee(args[0], 3)
    } else {
      const params = {
        result: 1,
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
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="0">退回</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row v-show="result === 0">
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
          this.result = this.params.result
          this.failReasion = this.params.failReasion
        }
      }, {
        props: {
          params
        }
      })
      checkSeletedRows(true) && MessageBox.confirm(vnode, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (params.result) {
              done()
            } else {
              if (params.failReasion) {
                done()
              } else {
                Vue.$message.error('请输入退回原因')
              }
            }
          } else {
            done()
          }
        }
      }).then(() => {
        if (params.result) {
          ctx.$refs.costList.selectionList('承担组审核', 1)
        } else {
          ctx.$refs.costList.selectionList('承担组审核', 0, params.failReasion)
        }
      })
    }
  }

  // 费用加批
  function fee_add_rule(...args) {
    if (args[0].rightKeySign) {
      checkSeletedRows(true, [args[0]]) && ctx.editFee(args[0], 3)
    } else {
      const params = {
        result: 1,
        failReasion: ''
      }
      const h = Vue.$createElement
      let vnode = h({
        template: `
          <div>
            <el-form label-width="100px">
              <el-row>
                <el-form-item label="费用加批">
                  <el-radio-group v-model="result">
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="0">退回</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row v-show="result === 0">
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
          this.result = this.params.result
          this.failReasion = this.params.failReasion
        }
      }, {
        props: {
          params
        }
      })
      checkSeletedRows(true) && MessageBox.confirm(vnode, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (params.result) {
              done()
            } else {
              if (params.failReasion) {
                done()
              } else {
                Vue.$message.error('请输入退回原因')
              }
            }
          } else {
            done()
          }
        }
      }).then(() => {
        if (params.result) {
          ctx.$refs.costList.selectionList('费用加批', 1)
        } else {
          ctx.$refs.costList.selectionList('费用加批', 0, params.failReasion)
        }
      })
    }
  }

  // 财务负责人加审
  function fee_add_audit(...args) {
    if (args[0].rightKeySign) {
      checkSeletedRows(true, [args[0]]) && ctx.editFee(args[0], 3)
    } else {
      const params = {
        result: 1,
        failReasion: ''
      }
      const h = Vue.$createElement
      let vnode = h({
        template: `
          <div>
            <el-form label-width="130px">
              <el-row>
                <el-form-item label="财务负责人加审">
                  <el-radio-group v-model="result">
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="0">退回</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row v-show="result === 0">
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
          this.result = this.params.result
          this.failReasion = this.params.failReasion
        }
      }, {
        props: {
          params
        }
      })
      checkSeletedRows(true) && MessageBox.confirm(vnode, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (params.result) {
              done()
            } else {
              if (params.failReasion) {
                done()
              } else {
                Vue.$message.error('请输入退回原因')
              }
            }
          } else {
            done()
          }
        }
      }).then(() => {
        if (params.result) {
          ctx.$refs.costList.selectionList('财务负责人加审', 1)
        } else {
          ctx.$refs.costList.selectionList('财务负责人加审', 0, params.failReasion)
        }
      })
    }
  }

  // 账单财务岗审核
  function fee_user_audit(...args) {
    if (args[0].rightKeySign) {
      checkSeletedRows(true, [args[0]]) && ctx.editFee(args[0], 3)
    } else {
      const params = {
        result: 1,
        failReasion: ''
      }
      const h = Vue.$createElement
      let vnode = h({
        template: `
          <div>
            <el-form label-width="130px">
              <el-row>
                <el-form-item label="账单财务岗审核">
                  <el-radio-group v-model="result">
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="0">退回</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row v-show="result === 0">
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
          this.result = this.params.result
          this.failReasion = this.params.failReasion
        }
      }, {
        props: {
          params
        }
      })
      checkSeletedRows(true) && MessageBox.confirm(vnode, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (params.result) {
              done()
            } else {
              if (params.failReasion) {
                done()
              } else {
                Vue.$message.error('请输入退回原因')
              }
            }
          } else {
            done()
          }
        }
      }).then(() => {
        if (params.result) {
          ctx.$refs.costList.selectionList('账单财务岗审核', 1)
        } else {
          ctx.$refs.costList.selectionList('账单财务岗审核', 0, params.failReasion)
        }
      })
    }
  }

  // 复核
  function fee_first_audit(...args) {
    if (args[0].rightKeySign) {
      checkSeletedRows(true, [args[0]]) && ctx.editFee(args[0], 3) // 右键编辑页面用于查验！
    } else {
      checkSeletedRows(true) && MessageBox.confirm('费用复核', {
        confirmButtonText: '通过',
        cancelButtonText: '退回',
        distinguishCancelAndClose: true,
        type: 'warning'
      }).then(() => {
        ctx.$refs.costList.beginAudit(1)
      }).catch((action) => {
        action === 'cancel' ? ctx.$refs.costList.beginAudit(0) : ''
      })
    }
  }

  // 查验
  function fee_second_audit() {
    if (checkSeletedRows(true)) {
      if (checkSeletedRows().find(item => item.payType && item.payType.includes('转账'))) {
        ctx.$refs.costList.checkAditView = true
        ctx.$refs.costList.isCheckAuditDate = true
      } else {
        ctx.$refs.costList.checkAditView = true
        ctx.$refs.costList.isCheckAuditDate = false
        // MessageBox.confirm('费用查验', {
        //   confirmButtonText: '通过',
        //   cancelButtonText: '退回',
        //   distinguishCancelAndClose: true,
        //   type: 'warning'
        // }).then(() => {
        //   ctx.$refs.costList.againAudit(1)
        // }).catch((action) => {
        //   action === 'cancel' ? ctx.$refs.costList.againAudit(0) : ''
        // })
      }
    }
  }

  // 支付
  function fee_pay() {
    checkSeletedRows() && ctx.$refs.costList.selectionList('支付')
  }

  // 改签
  function fee_rebook(...args) {
    if (args[0].rightKeySign) {
      checkFeeTasker({taskIdList: args[0].taskId}).then(res => {
        ctx.$data.dialogRebookVisible = true
        ctx.$nextTick(() => {
          ctx.$refs.rebook.$data.taskIdList = args[0].taskId
          ctx.$refs.rebook.$data.feeIds = args[0].feeId
          ctx.$refs.rebook.$data.feeDetailIds = args[0].feeDetailId
        })
      })
    } else {
      checkSeletedRows() && checkFeeTasker({taskIdList: checkSeletedRows().map(item => item.taskId)}).then(res => {
        ctx.$data.dialogRebookVisible = true
        ctx.$nextTick(() => {
          ctx.$refs.rebook.$data.taskIdList = checkSeletedRows().map(item => item.taskId)
          ctx.$refs.rebook.$data.feeIds = checkSeletedRows().map(item => item.feeId) + ''
          ctx.$refs.rebook.$data.feeDetailIds = checkSeletedRows().map(item => item.feeDetailId) + ''
        })
      })
    }
  }

  // 修改所属月
  function fee_belong_month() {
    checkSeletedRows() && ctx.$refs.costList.plEdit('所属月')
  }

  // 修改支付方式
  function fee_pay_style() {
    checkSeletedRows() && ctx.$refs.costList.plEdit('支付方式')
  }

  // 修改核销状态
  function fee_verification_status() {
    checkSeletedRows() && (ctx.$data.dialogVerificationVisible = true, ctx.$nextTick(() => {
      ctx.$refs.verification.$data.feeIdList = checkSeletedRows().map(item => item.feeId)
      ctx.$refs.verification.$data.feeIds = checkSeletedRows().map(item => item.feeId) + ''
      ctx.$refs.verification.$data.feeDetailIds = checkSeletedRows().map(item => item.feeDetailId) + ''
    }))
  }

  // 生成欠票提醒
  function fee_invoice_remind() {
    checkSeletedRows() && ctx.$refs.invoiceBorrowDetail.initDataByFee(checkSeletedRows())
  }

  // 搜索
  function fee_search(...args) {
    let searchType = args[0],
      searchData = args[1] || {}
    if (searchType) {
      ctx.$refs.costList.changeFeeStatus()
    }
    ctx.$refs.costList['handleSearch']({searchType, searchData})
  }

  // 清空搜索
  function fee_clear_search(...args) {
    let that = args[0]
    ctx.$refs.costList['clearSearch'](that)
  }

  // 批量复制费用
  function fee_copy() {
    ctx.$refs.costList.copyFees()
  }

  // 批量编辑
  function fee_detail_pl_edit() {
    if (checkSeletedRows()) {
      checkPermission({feeIdList: checkSeletedRows().map(item => item.feeId)}).then(res => {
        let isModList = res.data.filter(item => item.modify).map(item => item.feeId) || []
        let notModList = res.data.filter(item => !item.modify).map(item => item.feeId) || []
        let notice = ''
        if (notModList.length) {
          if (isModList.length) {
            notice = `已选费用中:  ${isModList.length}条费用可修改; ${notModList.length}条费用无法修改，请重新选择`
          } else {
            notice = '所选费用都无法修改！'
          }
          Vue.$confirm(notice, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showCancelButton: false,
            type: 'warning'
          }).then(() => {
          })
        } else {
          ctx.$refs.costList.$data.showTable = true
        }
      })
    }
  }

  // 生成模板
  function fee_export_model() {
    ctx.$refs.costList.createFeeTemplate(10)
  }

  return {
    fee_see,
    fee_edit,
    fee_delete,
    fee_submit,
    fee_group_audit,
    fee_assumejob_audit,
    fee_first_audit,
    fee_second_audit,
    fee_pay,
    fee_rebook,
    fee_belong_month,
    fee_pay_style,
    fee_verification_status,
    fee_invoice_remind,
    fee_search,
    fee_clear_search,
    fee_create,
    fee_copy,
    fee_detail_pl_edit,
    fee_export_model,
    fee_add_rule,
    fee_add_audit,
    fee_user_audit
  }
}

export default feeReducer
