<template>
  <div class="industry-info">
    <el-button size="mini" type="primary" v-if="editStatus" @click="addIndustry">新增</el-button>
<!--    <div class="base-header">-->
<!--      <span class="left-line"></span>-->
<!--      <span class="right-text">品牌</span>-->
<!--    </div>-->

    <div class="header-table">
      <el-table :max-height="clientHeight" class="el-table1" size="mini" :data="brandList" fit empty-text="暂无数据"
                highlight-current-row
                current-row-key style="width: 100%;" @row-dblclick="rowDbClick">
        <el-table-column label="图标" align="left" width>
          <template slot-scope="scope">
            <img class="filterTableTmg" v-if="scope.row.address" :src="'/ipdoc' + scope.row.address" width="60" height="60">
          </template>
        </el-table-column>
        <el-table-column label="品牌" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.pinpai">{{ scope.row.pinpai }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.ppdesc">{{ scope.row.ppdesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.createDate">{{ scope.row.createDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label=" 修改日期" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.modifyDate">{{ scope.row.modifyDate }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="editStatus" label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <span class="pointer" @click="delBrand(scope.row, scope.$index)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="'品牌 - ' + title"
      style="position:absolute;left: 0;top: 0;" :fullscreen="false" :show-close="false"
      :close-on-click-modal="false" :modal="false"
      :visible.sync="brandView"
      width="60%"
      class="abow_dialog"
    >
      <div class="box-border">
        <el-form label-position="left" label-width="120px"
                 style="width: 100%;">
          <el-row class="form-border">
            <el-col :span="24">
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="图标:" class="postInfo-container-item">
                    <div v-if="title === '新建' || title === '修改'">
                      <el-upload :action='creatematerial' ref='userIconupload' :data='usericonSendData'
                                 :on-success='iconSendSuccess'
                                 accept="image/jpeg,image/gif,image/png"
                                 :before-upload="onBeforeUploadIcon" :show-file-list="false" :auto-upload='false'
                                 :multiple="false"
                                 name='attachFile'
                                 :on-change="handleAvatarChange">
                        <div v-if="brandData.address && !iconIsDel" style="position: relative;padding-top: 10px"
                             @mouseenter="showDelIcon"
                             @mouseleave="hideDelIcon">
                          <img v-if="userIconCust" :src="userIconCust" class="avatar">
                          <div @click.stop="btnDelete()" class="mask" v-show="isShow"
                               style="position:absolute; bottom: 0px; background-color: #000; opacity: 0.8; height: 20px; width: 100%">
                            <i class="el-icon-delete"
                               style="position:absolute; left: 43px;bottom: 3px; color: #fff;"></i>
                          </div>
                        </div>
                        <i v-else="!postForm.userIcon" class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </div>
                    <img v-if="userIconCust && title === '查看'" :src="userIconCust" class="avatar">
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="品牌:" class="postInfo-container-item">
                    <div v-if="title === '新建' || title === '修改'">
                      <el-input size="mini" placeholder="请填写:"
                                v-model="brandData.pinpai"></el-input>
                    </div>
                    <div v-else>{{brandData.pinpai}}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="描述:" class="postInfo-container-item">
                    <div v-if="title === '新建' || title === '修改'">
                      <el-input size="mini" type="textarea" class="edit-border" placeholder="请填写:"
                                v-model="brandData.ppdesc"></el-input>
                    </div>
                    <div v-else>{{brandData.ppdesc}}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="创建日期:" class="postInfo-container-item">
                    {{brandData.createDate}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer fl-ac-jc">
          <el-button size="small" @click="() => closeDialog(false)">取 消</el-button>
          <el-button size="small" type="primary" v-if="title === '新建' || title === '修改'"
                     @click="submitData">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import {creatematerial} from '@/api/ipServiceApi.config.js'
  import {
    addCustomerIndustry, addCustomerPinpai, delCustomerIndustry, delCustomerPinpai, deleteCustomerIcon,
    queryCustomerIndustry, queryCustomerPinpai,
    queryIndustryTag,
    queryIndustryUrl, saveCustomerPinpai,
    updateCustomerIndustry, updateCustomerPinpai
  } from "../../../../../api/customerList";

  export default {
    name: "CustomerIndustry",
    props: {
      tabNo: {},
      editStatus: {
        type: Boolean,
        default: false
      },
      custId: {}
    },
    data() {
      return {
        isShow: false,
        userIconCust: '',
        iconIsDel: false,
        usericonSendData: {
          tokenID: "",
          custId: ""
        },
        creatematerial,
        title: '',
        brandView: false,
        brandData: {
          custId: '',
          ppId: '',
          pinpai: '',
          ppdesc: '',
          materialId: '',
          address: '',
          createDate: ''
        },
        brandList: [],
        industry: [],
        industryTagList: []
      }
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 300
      },
    },
    created() {
      this.queryList()
    },
    methods: {
      submitData() {
        if (this.title === '修改') {
          delete this.brandData.caseIdList
          delete this.brandData.createDate
          delete this.brandData.modifyDate
          updateCustomerPinpai(this.brandData).then(res => {
            this.$message.success('修改成功!')
            this.closeDialog(true)
          })
        } else {
          this.brandData.custId = this.custId
          addCustomerPinpai(this.brandData).then(res => {
            this.$message.success('新建成功!')
            this.closeDialog(true)
          })
        }
      },
      closeDialog(isSearch) {
        isSearch === true && this.queryList()
        this.title = ''
        this.userIconCust = ''
        this.brandData = {
          custId: '',
          ppId: '',
          pinpai: '',
          ppdescL: '',
          createDate: '',
          modifyDate: '',
          materialId: '',
          address: ''
        }
        this.brandView = false
        this.$emit('changeMask', {type: 'del', value: this.tabNo})
      },
      rowDbClick(row) {
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.brandData = JSON.parse(JSON.stringify(row))
        if (this.brandData.address) {
          this.userIconCust = `/ipdoc${this.brandData.address}`
        }
        this.title = this.editStatus ? '修改' : '查看'
        this.brandView = true
      },
      delBrand(row, index) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delCustomerPinpai({
            ppId: row.ppId
          }).then(res => {
            this.$message.success('删除成功!')
            this.brandList.splice(index, 1)
          })
        })
      },
      addIndustry() {
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.title = '新建'
        this.brandView = true
        this.brandData.createDate = this.$wUtil.getDate('', 'day')
      },
      queryList() {
        queryCustomerPinpai({
          custId: this.custId
        }).then(res => {
          this.brandList = res.data || []
        })
      },
      btnDelete() {
        this.iconIsDel = true
        this.brandData.materialId = ''
        this.brandData.address = ''
      },
      hideDelIcon() {
        this.isShow = false
      },
      showDelIcon() {
        this.isShow = true
      },
      isItemTrue(item) {
        if (!this.customerData[item]) {
          this.$message.error("请填写必填项")
          return false
        } else {
          return true
        }
      },
      handleAvatarChange(file, fileList) {
        this.$refs.userIconupload.submit()
      },
      onBeforeUploadIcon(file) {
        this.usericonSendData.tokenID = this.$store.getters.token
        this.usericonSendData.custId = this.custId
        const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png"
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isIMAGE) {
          this.$message.error("上传文件只能是图片格式!")
        }
        if (!isLt1M) {
          this.$message.error("上传文件大小不能超过 1MB!")
        }
        return isIMAGE && isLt1M
      },
      iconSendSuccess(response, file, fileList) {
        if (response.success) {
          this.iconIsDel = false
          this.brandData.address = response.data[0] && `/ipdoc${response.data[0].address}`
          this.brandData.materialId = response.data[0] && response.data[0].materialId
          this.userIconCust = response.data[0] && `/ipdoc${response.data[0].address}`
          this.$message.success(response.message)
        } else {
          this.$message.error(response.message)
          this.brandData.address = ''
        }
      },
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

  .industry-info {
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
      text-align: right;
    }

    /deep/ .el-form-item {
      display: flex;
      height: 100%;
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
      text-align: left;
      padding-left: 10px;
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

  .edit-border {
    /deep/ .el-input__inner {
      border: 1px solid #fff;
      font-size: 14px;
      color: #000000;
      padding-left: 0;

      &:hover {
        border-radius: 0;
        border-bottom: 1px solid #f2f2f2;
      }
    }
  }

  .avatar-uploader {
    /deep/ .el-form-item__label {
      height: 154px;
      line-height: 154px;
      width: 30%;
    }

    height: 154px;

    /deep/ .el-upload {
      border: 1px dashed #b6b2b2;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      margin-top: 4px;
    }
  }

  .avatar-uploader {
    /deep/ .el-upload:hover {
      border-color: #409eff;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
