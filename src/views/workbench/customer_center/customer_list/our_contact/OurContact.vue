<template>
  <div class="contact-info">
    <el-button size="mini" type="primary" v-if="editStatus" @click="addwfContact">新增</el-button>
<!--    <div class="base-header">-->
<!--      <span class="left-line"></span>-->
<!--      <span class="right-text">我方联系人</span>-->
<!--    </div>-->
    <div class="header-table">
      <el-table max-height="600" class="el-table1" size="mini" :data="wfContactList" fit empty-text="暂无数据"
                highlight-current-row
                current-row-key style="width: 100%;" >
        <el-table-column label="姓名" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.fullname">{{ scope.row.fullname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务领域" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.business">{{ scope.row.business }}</span>
          </template>
        </el-table-column>
        <el-table-column label="案件类型" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.caseTypeStr">{{ scope.row.caseTypeStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="职位" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.position">{{ scope.row.position }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始日期" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.startdate">{{ scope.row.startdate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="截止日期" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.enddate">{{ scope.row.enddate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.memo">{{ scope.row.memo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="查全部案件" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.ischeckStr">{{ scope.row.ischeckStr }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="editStatus" label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <span class="pointer" style="margin-right: 10px" @click="rowDbClick(scope.row, scope.$index)">修改</span>
            <span class="pointer" v-allow="51" @click="delwfContact(scope.row, scope.$index)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog style="position:absolute;left: 0;top: 0;" :fullscreen="false" :show-close="false"
               :close-on-click-modal="false" :modal="false" :title="'我方联系人 - ' + title" :visible.sync="dialogFormwfcon"
               width="70%">
      <el-form ref="creatwfconForm" :model="wfconFromData" label-position="left" label-width="150px"
               style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="姓名:" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{wfconFromData.fullname}}</span>
                    <el-select v-else default-first-option :clearable='true' @change="wfUserNamechange"
                               placeholder="请选择" v-model="wfconFromData.userId" filterable>
                      <el-option v-for="item in seletData.wfuserNames" :key="item.userId" :label="item.fullname"
                                 :value="item.userId">
                        <!--                        <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="业务领域 :" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{wfconFromData.business}}</span>
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择"
                               v-model="wfconFromData.business" filterable>
                      <el-option v-for="item in seletData.ywstuta" :key="String(item.typeName)" :label="item.typeName"
                                 :value="String(item.typeName)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="案件类型:" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{wfconFromData.caseTypeStr}}</span>
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择"
                               v-model="wfconFromData.caseTypeId" filterable>
                      <el-option v-for="item in seletData.caseType" :key="item.caseTypeId" :label="item.caseType"
                                 :value="item.caseTypeId">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="职位:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{wfconFromData.position}}</span>
                  <el-select v-else default-first-option v-model="wfconFromData.position" clearable filterable
                             placeholder="请选择">
                    <el-option v-for="item in queryPositionList" :key="item.position" :label="item.position"
                               :value="item.position">
                    </el-option>
                  </el-select>
                  <!--                  <el-input type="text"  placeholder="" v-model="wfconFromData.position">-->
                  <!--                  </el-input>-->
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="角色描述:" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{wfconFromData.userrole}}</span>
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择"
                               v-model="wfconFromData.userrole" filterable>
                      <el-option v-for="item in seletData.roleMessage" :key="String(item.typeName)"
                                 :label="item.typeName" :value="String(item.typeName)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="开始日期:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{wfconFromData.startdate}}</span>
                  <el-date-picker v-else v-model="wfconFromData.startdate" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                                  align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="截止日期:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{wfconFromData.enddate}}</span>
                  <el-date-picker v-else v-model="wfconFromData.enddate" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                                  align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="能否查看全部案件:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{wfconFromData.ischeck ? '是' : '否'}}</span>
                  <el-radio-group v-else v-model="wfconFromData.ischeck">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="能否查看全部时限:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{wfconFromData.isAllTlt ? '是' : '否'}}</span>
                  <el-radio-group v-else v-model="wfconFromData.isAllTlt">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="是否处理全部待报告:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{wfconFromData.mailtodoStr}}</span>
                  <el-radio-group v-else v-model="wfconFromData.mailtodo">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <span v-if="dialogLook">{{wfconFromData.memo}}</span>
                    <el-input v-else type="textarea" :rows="2" placeholder="请输入内容" v-model="wfconFromData.memo">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

          </el-col>
        </el-row>

      </el-form>
      <div class="dialog-footer fl-ac-jc" style="margin: 10px 0;">
        <el-button size="small" @click="closeWfDialog(false)">
          取消
        </el-button>
        <el-button size="small" v-if="title === '新建'" type="primary" @click="addContact">新建</el-button>
        <el-button size="small" v-if="title === '修改'" type="primary" @click="saveWfContact">保存</el-button>
        <!--        <el-button v-if="!dialogLook" type="primary"-->
        <!--                   @click="dialogFormStatus==='create'?createCustAddr('wfcon'):updateCustAddr('wfcon')">-->
        <!--          确定-->
        <!--        </el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    allocationCustomerUrl, delAgencyContactUrl,
    queryAgencyContactListUrl,
    queryAgencyContactUrl, updateAgencyContactUrl
  } from "../../../../../api/customerList";
  import {queryPosition} from "../../../../../api/systemList";

  export default {
    name: "OurContact",
    props: {
      tabNo: {},
      seletData: {},
      custId: {
        type: Number,
        default: 0
      },
      editStatus: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogFormwfcon: false,
        wfContactList: [],
        wfconFromData: {
          custId: "",
          userId: "",
          startdate: "",
          enddate: "",
          business: "",
          roleId: "",
          caseTypeId: "",
          userrole: "",
          memo: "",
          position: "",
          ischeck: ""
        },
        dialogLook: true,
        title: '',
        queryPositionList: []
      }
    },
    created() {
      this.queryWfList()
      this.queryPosition()
    },
    methods: {
      addContact() {
        this.wfconFromData.custId = this.custId
        allocationCustomerUrl(this.wfconFromData).then(response => {
          this.$message.success('新建成功!')
          this.closeWfDialog(true)
        })
      },
      saveWfContact() {
        updateAgencyContactUrl(this.wfconFromData).then(res => {
          this.$message.success('保存成功!')
          this.closeWfDialog(true)
        })
      },
      queryPosition() {
        queryPosition().then(res => {
          this.queryPositionList = res.data;
        });
      },
      queryWfList() {
        queryAgencyContactListUrl({
          customerID: this.custId
        }).then(res => {
          this.wfContactList = res.data
        })
      },
      closeWfDialog(isSearch) {
        isSearch === true && this.queryWfList()
        this.$emit('changeMask', {type: 'del', value: this.tabNo})
        this.dialogFormwfcon = false
        this.title = ''
        this.dialogLook = true
      },
      delwfContact(row, index) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(res => {
          delAgencyContactUrl({
            agencyContactId: row.agencyContactId
          }).then(res => {
            this.$message.success('删除成功!')
            this.wfContactList.splice(index, 1)
          })
        })
      },
      addwfContact() {
        this.dialogFormwfcon = true
        this.dialogLook = false
        this.wfconFromData = {
          custId: "",
          userId: "",
          startdate: "",
          enddate: "",
          business: "",
          roleId: "",
          caseTypeId: "",
          userrole: "",
          memo: "",
          position: "",
          ischeck: ""
        }
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.title = '新建'
      },
      rowDbClick(row) {
        queryAgencyContactUrl({agencyContactId: row.agencyContactId}).then(
          res => {
            this.$emit('changeMask', {type: 'add', value: this.tabNo})
            this.title = this.editStatus ? '修改' : '查看'
            this.wfconFromData = res.data
            this.dialogLook = this.editStatus ? false : true
            this.dialogFormwfcon = true
          }
        );

      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .el-table1 {
    /*height: auto;*/

    .cell {
      max-height: 70px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }

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

  .contact-info {
    background-color: #fff;
    padding: 10px 15px;

    .el-button {
      float: right;
    }

    .base-header {
      display: flex;
      align-items: center;

      .left-line {
        display: inline-block;
        width: 10px;
        height: 26px;
        background-color: #409EFF;
        margin-right: 10px;
      }

      .right-text {
        font-weight: bold;
      }
    }
  }

  .form-border {
    /deep/ .el-row {
      margin: 0px;
    }

    /deep/ .postInfo-container-item {
      width: 100%;
    }

    /deep/ .el-form-item__label {
      background-color: #f9f9f9;
      width: 30%;
      text-align: center;
    }

    /deep/ .el-form-item {
      display: flex;
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    /deep/ .el-row {
      border-bottom: 1px solid #d7d7d7;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 70%;
    }

    /deep/ .el-form-item__content {
      flex: 1;
      text-align: center;
      /*height: 30px;*/
      margin-left: 0 !important;
    }

    .fullRow {
      /deep/ .el-form-item__label {
        width: 15%;
      }

      /deep/ .el-input,
      /deep/ .el-select {
        width: 100%;
      }
    }

    /deep/ .el-input__inner {
      border: none;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    border-top: 1px solid #d7d7d7;
    border-left: 1px solid #d7d7d7;
    // border-bottom: 1px solid #d7d7d7;
  }

  /deep/ .el-col.el-col-12 {
    .el-cascader {
      width: 100%;

      .el-input {
        width: 100%;
      }
    }
  }

  > > > .el-dialog {
    margin-top: 5vh !important;
  }

  > > > .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    max-height: 500px;
    overflow: auto;
  }

  /deep/ .el-form-item__content {
    text-align: center;

    .el-form-item__error {
      position: relative;
      text-align: left;
      left: 0;
      top: 0;
    }
  }
</style>
