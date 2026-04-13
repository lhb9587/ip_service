<template>
  <div style="height: 630px; padding: 10px; overflow: auto">
    <div class="header-table">
      <el-table max-height="600" class="el-table1" size="mini" :data="contactList" fit empty-text="暂无数据"
                highlight-current-row
                current-row-key style="width: 100%;" @row-dblclick="rowDbClick">
        <el-table-column label="联系人名称" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.lxre">{{scope.row.lxren}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.lxfs">{{scope.row.lxfs}}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.department">{{scope.row.department}}</span>
          </template>
        </el-table-column>
        <el-table-column label="职位" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.jobtitle">{{scope.row.jobtitle}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上级联系人" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.parentLxren">{{scope.row.parentLxren}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="left" width>
          <template slot-scope="scope">
            <span>{{scope.row.createDate}}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="editStatus" label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <span class="pointer" @click="delContact(scope.row, scope.$index)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="'机构联系人 - ' + title"
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
              <el-form-item label="联系人名称:" class="postInfo-container-item">
                <div v-if="title === '新建' || title === '修改'">
                  <el-input size="mini" class="edit-border" placeholder="请填写联系人名称"
                            v-model="fzData.lxren"></el-input>
                </div>
                <div v-else>{{fzData.lxren}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="联系方式:" class="postInfo-container-item">
                <div v-if="title === '新建' || title === '修改'">
                  <el-input size="mini" class="edit-border" v-model="fzData.lxfs"
                            placeholder="请填写联系方式"></el-input>
                </div>
                <div v-else>{{fzData.lxfs}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="部门:" class="postInfo-container-item">
                <div v-if="title === '新建' || title === '修改'">
                  <el-input size="mini" class="edit-border" v-model="fzData.department"
                            placeholder="请填写部门"></el-input>
                </div>
                <div v-else>{{fzData.department}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="职位:" class="postInfo-container-item">
                <div v-if="title === '新建' || title === '修改'">
                  <el-input size="mini" class="edit-border" v-model="fzData.jobtitle"
                            placeholder="请填写职位"></el-input>
                </div>
                <div v-else>{{fzData.jobtitle}}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="机构:" class="postInfo-container-item requireForm">
                <el-select :disabled="title === '查看'" @change="changeFz" size="mini" class="" default-first-option
                           :clearable='true'
                           placeholder="请选择机构"
                           v-model="fzData.custfzId" filterable
                >
                  <el-option
                    v-for="item in fzList"
                    :key="item.custfzId"
                    :label="item.jgName" :value="item.custfzId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="上级联系人:" class="postInfo-container-item">
                <div v-if="title === '新建' || title === '修改'">
                  <el-select :disabled="title === '查看'" size="mini" class="" default-first-option
                             :clearable='true'
                             placeholder="请选择上级联系人"
                             v-model="fzData.parentId" filterable
                  >
                    <el-option
                      v-for="item in dfList.filter(i => i.lxren !== fzData.lxren)"
                      :key="item.lxren"
                      :label="item.lxren" :value="item.fzlxId">
                    </el-option>
                  </el-select>
                </div>
                <div v-else>{{fzData.parentLxren}}</div>
              </el-form-item>
            </el-col>
          </el-row>
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
    addCustomerFenzhiLianxi, delCustomerFenzhiLianxi,
    queryCustomerFenzhiByCustId,
    queryCustomerFenzhiLianxiByCustfzId, updateCustomerFenzhiLianxiById
  } from "../../../../../api/customerList";

  export default {
    name: "ContactManage",
    props: {
      custId: {},
      editStatus: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        fzList: [],
        dfList: [],
        fzData: {
          custfzId: '',
          lxren: '',
          lxfs: '',
          department: '',
          jobtitle: '',
          parentLxren: '',
          parentId: ''
        },
        fzView: false,
        title: '',
        contactList: []
      }
    },
    created() {
      this.queryCustomerFenzhiLianxiByCustfzId()
      this.queryFzList()
    },
    methods: {
      addContact() {
        this.title = '新建'
        this.$emit('changeMask', {type: 'add'})
        this.fzView = true
      },
      closeFzDialog(isSearch) {
        this.title = ''
        this.fzView = false
        this.fzData = {
          custfzId: '',
          lxren: '',
          lxfs: '',
          department: '',
          jobtitle: '',
          parentLxren: '',
          parentId: ''
        }
        this.dfList = []
        this.$emit('changeMask', {type: 'del'})
        isSearch === true && this.queryCustomerFenzhiLianxiByCustfzId()
      },
      submitFzData() {
        if (!this.fzData.custfzId) {
          this.$message.error('请选择分支机构！')
          return
        }
        if (this.title === '新建') {
          addCustomerFenzhiLianxi(this.fzData).then(res => {
            this.$message.success('创建成功!')
            this.closeFzDialog(true)
          })
        } else if (this.title === '修改') {
          updateCustomerFenzhiLianxiById(this.fzData).then(res => {
            this.$message.success('修改成功!')
            this.closeFzDialog(true)
          })
        }
      },
      queryCustomerFenzhiLianxiByCustfzId() {
        queryCustomerFenzhiLianxiByCustfzId({
          custId: this.custId
        }).then(res => {
          this.contactList = res.data
        })
      },
      delContact(row, index) {
        this.$confirm("确定删除这条数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delCustomerFenzhiLianxi({
            fzlxId: row.fzlxId
          }).then(res => {
            this.$message.success('删除成功!')
            this.contactList.splice(index, 1)
          })
        }).catch(() => {

        })
      },
      changeFz(custfzId) {
        if (custfzId) {
          queryCustomerFenzhiLianxiByCustfzId({custfzId}).then(res => {
            this.dfList = res.data
          })
        } else {
          this.dfList = []
        }
      },
      rowDbClick(row) {
        if (this.editStatus) {
          this.title = '修改'
        } else {
          this.title = '查看'
        }
        this.$emit('changeMask', {type: 'add'})
        this.fzView = true
        this.fzData = JSON.parse(JSON.stringify(row))
        this.changeFz(row.custfzId)
      },
      queryFzList() {
        queryCustomerFenzhiByCustId({
          custId: this.custId
        }).then(res => {
          this.fzList = res.data
        })
      },
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

  .require:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }

  .requireForm /deep/ .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }

</style>
