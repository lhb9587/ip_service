<template>
  <div>
    <div class="rebookDiv">
      <div class="rebookTitle">确认要改签这条 [{{dataName}}] 吗？请指定您要改签的人</div>
      <div class="rebookBody">
<!--        <div class="bodyLeft">-->
<!--          <div class="divider">-->
<!--              <span>-->
<!--                <el-badge :value="2" class="item" type="warning">-->
<!--                  以往改签人-->
<!--                </el-badge>-->
<!--              </span>-->
<!--          </div>-->
<!--          <div class="nameList" v-for="item in 3" :key="item"><span class="iconfont icon-icontouxiang"></span>侯强{{item}}-->
<!--          </div>-->
<!--        </div>-->
        <div class="bodyRight">
          <div class="rightTitle">设置改签人员</div>
          <div class="rightSearch">
            <el-input v-model="name" @input="searchName" size="small" placeholder="搜索部门名称或人员姓名"></el-input>
          </div>
          <div class="rightTable">
            <el-table @row-click="rowClick" size="mini" :data="list" border fit empty-text="暂无数据" :row-class-name="rowClassName"
                      current-row-key
                      style="width: 100%;">
              <el-table-column label="部门" prop="deptName"></el-table-column>
              <el-table-column label="姓名" prop="fullname"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="fl-ac-jc" style="padding: 20px 0">
      <el-button size="small" @click="closeDialog(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </div>
  </div>
</template>

<script>
  import { endorseFee } from '@/api/feeList'
  import { endorse } from '@/api/billApi'
  import { endorseBorrow, endorseInvoiceBorrow } from '@/api/caseList'
  export default {
    name: 'Rebook',
    props:{
      ctx: {},
      isCollect: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      },
      dataName: {
        type: String,
        default: '数据'
      }
    },
    data() {
      return {
        feeDetailIds: '',
        feeIds: '',
        billIds: '',
        taskIdList: [],
        payIds: '',
        payDetailIds: '',
        auditUserIds: '',
        name: '',
        list: []
      }
    },
    methods: {
      rowClassName({row, rowIndex}){
        if(row.userId == this.auditUserIds){
          return 'currentClick'
        }
        return ''
      },
      submit() {
        if (!this.auditUserIds) {
          this.$message.error('请选择改签人！')
          return
        }
        if (!this.type) { // 账单和费用
          !this.isCollect && endorseFee({
            auditUserIds: this.auditUserIds,
            taskIdList: this.taskIdList
          }).then(res => {
            this.$message.success('改签成功！')
            if(this.dataName == '账单'){
             this.closeDialog(this.billIds || true)
            }
            if(this.dataName == '费用' && (this.feeDetailIds || this.feeIds)){
              this.closeDialog({feeDetailIds: this.feeDetailIds, feeIds: this.feeIds})
            }
            if (this.dataName == '境外账单') {
              this.closeDialog(true)
            }
            // this.closeDialog(true)
          })
          this.isCollect && endorse({
            auditUserIds: [this.endorseTasker],
            taskIdList: this.getSelectedRows().map(item => item.taskId)
          }).then(res => {
            this.$message.success('改签成功！')
            this.closeDialog({payIds: this.payIds, payDetailIds: this.payDetailIds})
            // this.closeDialog(true)
          })
        }else if (this.type == 'borrow'){ // 借款
          endorseBorrow({
            auditUserIds: this.auditUserIds,
            taskIdList: this.taskIdList
          }).then(res => {
            this.closeDialog(true)
          })
        }else if (this.type == 'invoice_borrow'){ // 发票外借
          endorseInvoiceBorrow({
            auditUserIds: this.auditUserIds,
            taskIdList: this.taskIdList
          }).then(res => {
            this.closeDialog(true)
          })
        }
      },
      rowClick(row) {
        this.name = row.fullname
        this.auditUserIds = row.userId || ''
      },
      closeDialog(search = false) {
        this.name = ''
        this.list = []
        this.$emit('closeDialog', search)
      },
      searchName(value) {
        if (!value) return
        this.auditUserIds = ''
        this.list = this.$store.getters.userList.filter(item => (item.deptName + '~' + item.fullname).includes(value))
      },
      // changeRebook(selectedRows) {
      //   // taskIdList   array
      //   // auditUserIds string | number
      //   this.selectedRows = selectedRows
      //   this.taskIdList = this.selectedRows.map(item => item.taskList.map(i => i.taskId)).flat(Infinity)
      // }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/icons/font_2251928_wgb15a3ybe.css";

  .divider {
    position: relative;
    border-bottom: 1px solid #797979;
    margin-bottom: 20px;
    margin-top: 20px;

    .el-badge {
      padding-right: 10px;
    }

    span {
      /*color: #333;*/
      /*font-weight: bold;*/
      font-size: 14px;
      background: #fff;
      position: absolute;
      bottom: -9px;
      left: 25%;
      padding: 0 10px;
    }
  }

  .rebookDiv {
    width: 100%;
    border: 1px solid #D7D7D7;
    padding: 10px;

    .rebookTitle {
      color: #D9001B;
      padding-bottom: 10px;
      border-bottom: 2px solid #797979;
    }

    .rebookBody {
      display: flex;

      .bodyLeft {
        min-height: 300px;
        max-height: 500px;
        overflow: auto;
        flex: 4;
        /*background-color: red;*/
        margin-right: 10px;

        .nameList {
          width: 100%;
          height: 35px;
          border: 1px solid #F2F2F2;
          border-bottom: none;
          display: flex;
          justify-content: center;
          align-items: center;

          &:last-child {
            border-bottom: 1px solid #F2F2F2;
          }
        }
      }

      .bodyRight {
        min-height: 300px;
        max-height: 500px;
        overflow: auto;
        flex: 6;

        .rightTitle {
          text-align: center;
          background-color: #D7D7D7;
          margin-top: 10px;
          height: 30px;
          line-height: 30px;
        }

        .rightSearch {
          .el-input {
            input {
              border-radius: 0 !important;
            }

            > > > .el-input__inner {
              height: 35px;
            }
          }
        }

        .rightTable {
          thead {
            tr {
              th {
                background-color: #D7D7D7;
                color: #606266;
              }
            }
          }
        }
      }
    }
  }
  >>>.currentClick{
    background-color: #2981EB!important;
    color: #ffffff;
    font-weight: bold;
  }

  >>>.el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: transparent!important;
  }

</style>
