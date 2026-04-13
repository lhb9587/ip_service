<template>
  <div style="height: 630px; padding: 10px; overflow: auto">
    <div class="header-table">
      <el-table max-height="600" class="el-table1" size="mini" :data="fzList" fit empty-text="暂无数据"
                highlight-current-row
                current-row-key style="width: 100%;" @row-dblclick="rowDbClick">
        <el-table-column label="机构名称" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.jgName">{{ scope.row.jgName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="机构联系人" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.duifangList.map(item => item.lxren)">{{ scope.row.duifangList.map(item => item.lxren) + '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="对接人" align="left" width>
          <template slot-scope="scope">
            <span
              :title="scope.row.wofangList.filter(i => i.userId).map(item => $store.getters.userList.find(user => user.userId === item.userId).fullname) +''">{{ scope.row.wofangList.filter(i => i.userId).map(item => $store.getters.userList.find(user => user.userId === item.userId).fullname) + '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.createTime">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="editStatus" label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <span class="pointer" @click="delFz(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="header-table" style="margin-top: 40px;">
      <el-table max-height="600" class="el-table1" size="mini" :data="custList" fit empty-text="暂无数据"
                highlight-current-row
                current-row-key style="width: 100%;">
        <el-table-column label="关联客户" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.custName">{{ scope.row.custName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="对方联系人" align="left" width>
          <template slot-scope="scope">
            <span class="ellipsis" :title="scope.row.customerContacts.map(item => item.custContactName)">{{ scope.row.customerContacts.map(item => item.custContactName) + '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="对接人" align="left" width>
          <template slot-scope="scope">
            <span
              class="ellipsis"
              :title="scope.row.customerResponsibleArray.map(item => item.userName) +''">{{ scope.row.customerResponsibleArray.map(item => item.userName) + '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.createTime">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="'分支 - ' + title"
      :fullscreen="false" :show-close="false"
      :close-on-click-modal="false" :modal="false"
      :append-to-body="false"
      :visible.sync="fzView"
      width="80%"
      class="abow_dialog"
      :before-close="closeFzDialog"
    >
      <div class="box-border">
        <el-form size="small" class="form-container" label-width="120px">
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="机构名称:" class="postInfo-container-item">
                <div v-if="title === '新建' || title === '修改'">
                  <el-input size="mini" class="edit-border" placeholder="请填写机构名称"
                            v-model="fzData.jgName"></el-input>
                </div>
                <div v-else>{{fzData.jgName}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="机构地址:" class="postInfo-container-item">
                <div v-if="title === '新建' || title === '修改'">
                  <el-input size="mini" class="edit-border" v-model="fzData.jgAddress"
                            placeholder="请填写地址"></el-input>
                </div>
                <div v-else>{{fzData.jgAddress}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="我方联系人:" class="postInfo-container-item">
                <el-select :disabled="title === '查看'" v-model="fzData.wofangList" placeholder="请选择创建人" multiple
                           filterable
                           clearable>
                  <el-option
                    v-for="item in $store.getters.userList"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.userId">
                    <!--                    <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="divider">
                <span>
                    机构联系人
                </span>
          </div>
          <el-table
            empty-text="暂无数据"
            size="mini"
            :data="fzData.duifangList"
            max-height="200"
          >
            <el-table-column
              label="名称"
            >
              <template slot-scope="scope">
                <el-input placeholder="请填写名称" v-if="title !== '查看'" size="mini" v-model="scope.row.lxren"></el-input>
                <span v-else>{{scope.row.lxren}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="联系方式"
            >
              <template slot-scope="scope">
                <el-input placeholder="请填写联系方式" v-if="title !== '查看'" size="mini" v-model="scope.row.lxfs"></el-input>
                <span v-else>{{scope.row.lxfs}}</span>
              </template>
            </el-table-column>
            <el-table-column

              label="部门"
            >
              <template slot-scope="scope">
                <el-input v-if="title !== '查看'" placeholder="请填写部门" size="mini"
                          v-model="scope.row.department"></el-input>
                <span v-else>{{scope.row.department}}</span>
              </template>
            </el-table-column>
            <el-table-column

              label="职位"
            >
              <template slot-scope="scope">
                <el-input v-if="title !== '查看'" placeholder="请填写职位" size="mini" v-model="scope.row.jobtitle"></el-input>
                <span v-else>{{scope.row.jobtitle}}</span>
              </template>
            </el-table-column>
            <el-table-column

              label="上级联系人"
            >
              <template slot-scope="scope">
                <el-select :disabled="title === '查看'" size="mini" class="" default-first-option
                           :clearable='true'
                           placeholder="请选择"
                           v-model="scope.row.parentId" filterable
                >
                  <el-option
                    v-for="item in dfList.filter(i => i.lxren !== scope.row.lxren)"
                    :key="item.lxren"
                    :label="item.lxren" :value="item.fzlxId">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="title !== '查看'" label="操作" align="left" width="" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <span class="pointer" v-if="scope.$index < fzData.duifangList.length - 1" @click="delContact(scope.$index)">删除</span>
              </template>
            </el-table-column>
          </el-table>


        </el-form>
      </div>
      <span slot="footer" class="dialog-footer fl-ac-jc">
          <el-button size="small" @click="() => closeFzDialog(false)">取 消</el-button>
          <el-button size="small" type="primary" v-if="title === '新建' || title === '修改'"
                     @click="submitFzData">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addCustomerFenzhi, delCustomerFenzhi, queryCustInfo,
    queryCustomerFenzhiByCustId, queryCustomerFenzhiById, queryCustomerFenzhiLianxiByCustfzId, saveCustomerFenzhi,
    updateCustomerFenzhiById
  } from "../../../../../api/customerList";

  export default {
    name: "FzManage",
    props: {
      custId: {},
      editStatus: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        custList: [],
        fzView: false,
        fzData: {
          custId: '',
          jgAddress: '',
          jgName: ''
        },
        title: '',
        fzList: [],
        dfList: []
      }
    },
    watch: {
      "fzData.duifangList": {
        handler(n) {
          if (n && !n.find(item => !item.lxren) && this.title !== '查看') {
            n.push({
              lxren: '',
              lxfs: '',
              department: '',
              jobtitle: '',
              parentId: ''
            })
          }
        },
        immediate: true,
        deep: true
      }
    },
    created() {
      this.queryFzList()
    },
    methods: {
      delContact(index) {
        this.fzData.duifangList.splice(index, 1)
      },
      queryCustomerFenzhiLianxiByCustfzId(custfzId) {
        queryCustomerFenzhiLianxiByCustfzId({custfzId}).then(res => {
          this.dfList = res.data
        })
      },
      delFz(row) {
        this.$confirm("确定删除这条数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delCustomerFenzhi({
            custfzId: row.custfzId
          }).then(res => {
            this.$message.success('删除成功!')
            this.closeFzDialog(true)
          })
        })

      },
      addFz() {
        this.$emit('changeMask', {type: 'add', value: '14'})
        this.title = '新建'
        this.fzView = true
        this.fzData = {
          custId: '',
          jgAddress: '',
          jgName: '',
          wofangList: [],
          duifangList: []
        }
      },
      submitFzData() {
        saveCustomerFenzhi({
          ...this.fzData,
          duifangList: this.fzData.duifangList.filter(item => item.lxren),
          custId: this.custId,
          wofangList: this.fzData.wofangList.map(item => ({userId: item}))
        }).then(res => {
          this.$message.success(this.title + '成功！')
          this.closeFzDialog(true)
        })
        // if (this.title === '新建') {
        //   addCustomerFenzhi({...this.fzData, custId: this.custId}).then(res => {
        //     this.$message.success('增加成功！')
        //     this.closeFzDialog(true)
        //   })
        // } else if (this.title === '修改') {
        //   updateCustomerFenzhiById({...this.fzData, custId: this.custId}).then(res => {
        //     this.$message.success('修改成功!')
        //     this.closeFzDialog(true)
        //   })
        // }
      },
      closeFzDialog(isSearch) {
        this.$emit('changeMask', {type: 'del', value: '14'})
        isSearch === true && this.queryFzList()
        isSearch === true && this.$emit('updateFz')
        this.title = ''
        this.fzView = false
        this.fzData = {
          custId: '',
          jgAddress: '',
          jgName: '',
          wofangList: [],
          duifangList: []
        }
      },
      rowDbClick(row) {
        this.$emit('changeMask', {type: 'add', value: '14'})
        this.title = this.editStatus ? '修改' : '查看'
        this.fzView = true
        this.fzData = JSON.parse(JSON.stringify(row))
        this.fzData.wofangList = row.wofangList.map(item => item.userId)
        this.queryCustomerFenzhiLianxiByCustfzId(row.custfzId)
        // queryCustomerFenzhiById({
        //   custfzId: row.custfzId
        // }).then(res => {
        //   this.fzData = res.data
        // })
      },
      queryFzList() {
        queryCustomerFenzhiByCustId({
          custId: this.custId
        }).then(res => {
          this.fzList = res.data
        })
        queryCustInfo({
          custId: this.custId
        }).then(res => {
          this.custList = res.data
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .header-table {
    margin-top: 10px;
    padding: 0 0 0 15px;

    .el-table__header-wrapper {
      border: 1px solid #EBEEF5;
      border-bottom: none;

      th {
        background-color: #FAFAFA;
        font-size: 16px;
        color: #555555;
        font-weight: normal;
      }
    }
  }

  .box-border {
    border: 1px solid #D7D7D7;
    padding: 10px 10px 5px 10px;
  }

  .form-container {
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    /deep/ .el-row {
      margin: 0 0 5px 0;
      display: flex;
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;

      .el-row {
        border: none;
      }
    }

    /deep/ .el-form-item__label {
      flex-shrink: 0;
      background-color: #F2F2F2;
      /*width: 36.7%;*/
      text-align: right;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #F2F2F2;
      margin: 0px !important;
    }

    .first-row {
      border-top: 1px solid #F2F2F2;
    }

    /deep/ .el-row {
      border-bottom: 1px solid #F2F2F2;
      border-left: 1px solid #F2F2F2;
    }

    /deep/ td .el-input,
    /deep/ td .el-select {
      width: 100%;
    }

    /deep/ .el-form-item__content {
      text-align: left;
      word-break: break-word;
      // height: 30px;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    .postInfo-container-item {
      display: flex;
      width: 100%;

      /deep/ .el-form-item__content {
        text-align: left;
        display: inline-table;
        flex: 1;
        padding: 5px 15px;
        margin-left: 0 !important;
      }

      > > > .el-date-editor {
        width: 100%;
      }
    }
  }

  > > > .el-dialog__body {
    padding-top: 0;
  }

  .abow_dialog {
    position: fixed;
    left: 35%;
    bottom: 10%;
    top: unset;
  }

  .divider {
    position: relative;
    border-bottom: 1px solid #797979;
    margin-bottom: 20px;
    /*border-right: 1px solid #ccc;*/
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
      left: 50px;
      padding: 0 10px;
    }
  }
</style>
