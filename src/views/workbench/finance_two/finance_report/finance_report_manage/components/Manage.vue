<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      top="25vh"
      width="30%"
      height="90%"
      :before-close="handleClose">
      <div>
        <el-form label-width="160px" >
          <el-row>
            <el-form-item label="报表类型">
              <el-select v-model="formData.docType" filterable clearable v-bind:disabled="diasabledInput" @change="docTypeCheck">
                <el-option
                  v-for="item in docTypeList"
                  :key="item.docType"
                  :label="item.label"
                  :value="item.docType"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="所属月/季度">
              <div v-if="pageState == 'view' || pageState == 'edit'">
                <el-input type="text" v-model="formData.belongTo" v-bind:disabled="diasabledInput"></el-input>
              </div>
              <div v-else>
                <div v-if="isQuarter">
                  <el-quarter-picker v-model="quarter" placeholder="选择季度" @change="quarterPicker" style="width: 70%" v-bind:disabled="diasabledInput"/>
                </div>
                <div v-else>
                  <el-date-picker
                    v-model="formData.belongTo"
                    type="month"
                    value-format="yyyy-MM"
                    placeholder="选择月份"
                    v-bind:disabled="diasabledInput">
                  </el-date-picker>
                </div>
              </div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="上传文件">
              <div v-if="pageState == 'view'">
                <el-input type="text" v-model="formData.docName" v-bind:disabled="diasabledInput"></el-input>
              </div>
              <div v-else>
                <el-upload
                  class="upload-demo"
                  name="attachFile"
                  drag
                  :data="formData"
                  :action="financeReportUploadFile"
                  :before-upload="beforeUpload"
                  :on-success="(value)=> handleSuccess(value)"
                  multiple
                  :limit="1">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">上传附件成功后即报表保存成功，当前页面会自动关闭</div>
                </el-upload>
              </div>
            </el-form-item>
          </el-row>
        </el-form>
        <div class="button_wrap" v-if="pageState=='view'">
          <el-button type="primary" @click="download">下载</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { financeReportUploadFile } from "@/api/ipServiceApi.config.js";
import ElQuarterPicker from '../../components/ElQuarterPicker'
export default {
  name: 'ReportForms',
  props: ['pageState', 'reportData', 'companyList'],
  components: {
    ElQuarterPicker
  },
  data() {
    return {
      dialogVisible: true,
      diasabledInput: false,// 可读可写
      dialogTitle: '',
      docTypeList: [
        {
          docType: 1,
          label: '财务状况'
        },
        {
          docType: 2,
          label: '从业人员工资总额'
        },
        {
          docType: 3,
          label: '经营财务研发'
        },
        {
          docType: 4,
          label: '损益表'
        },
        {
          docType: 5,
          label: '资产负债表'
        },
        {
          docType: 6,
          label: '资产余额情况表'
        }
      ],
      isQuarter: false,
      quarter: '',
      financeReportUploadFile,
      formData: {
        tokenID: this.$store.getters.token,
        docType: '',
        belongTo: '',
      }
    }
  },
  created() {
    this.selectAction()
  },
  methods: {
    selectAction(){
      switch (this.pageState) {
        case 'view':
          this.dialogTitle = '报表管理-查看'
          this.diasabledInput = true
          this.formData = this.reportData
          break;
        case 'create':
          this.dialogTitle = '报表管理-创建'
          break;
        case 'edit':
          this.dialogTitle = '报表管理-编辑'
          this.diasabledInput = true
          this.formData.docType = this.reportData.docType
          this.formData.belongTo = this.reportData.belongTo
          break;
        default:
          break;
      }
    },
    download() {
      this.$commonUtils.downLoadAll({url:'ipdoc'+this.reportData.address})
      this.handleClose()
    },
    docTypeCheck(docType) {
      if (docType == 2) {
        this.isQuarter = true
        return
      }
      this.isQuarter = false
    },
    beforeUpload() {
      if (!this.formData.docType || !this.formData.belongTo) {
        this.$message('请选择报表类型及所属月/季度')
        return false
      }
    },
    quarterPicker(row) {
      this.formData.belongTo = row.slice(0, 4) + '第' + row.slice(-1) + '季度'
    },
    handleSuccess(file) {
      if (file.success == true) {
        this.$message.success('报表上传成功')
        this.handleClose(true)
      }
    },
    handleClose(state){
      this.$emit('closeDialog',false, state === true ? state : false);
    }
  },
}
</script>

<style lang="scss" scoped>
.el-form{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .el-select,.el-input,.el-date-picker,.el-textarea{
    width: 95%;
  }
  .el-textarea{
    margin: 10px 0;
  }
  /deep/ input{
    height: 28px;
  }
  /deep/ .el-input__icon{
    line-height: 28px;
  }
  .el-row{
    min-height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    .el-form-item{
      width: 100%;
      display: flex;
      border: 1px solid #EBEEF5;
      margin: 0px !important;
      /deep/ .el-form-item__label{
        background: #f5f7fa;
      }
      /deep/ .el-form-item__content {
        margin-left: 0 !important;
        padding-left: 10px;
        background: #fff;
        flex: 1;
      }
    }
  }
}
.button_wrap {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  .el-button{
    margin-left: 30px;
  }
}

.title{
  width: 100%;
  font-size: 16px;
  color: #6AA7FF;
  height: 50px;
  line-height: 50px;
  font-weight: normal;
  position: relative;
  .title_right{
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
.title-div{
  font-size: 14px;
  color: #fb9608a3;
  line-height: 30px;
}
.topBox {
  background-color: #F2F2F2;
  padding-left: 20px;
  display: flex;
  height: 40px;
  /*justify-content: center;*/
  align-items: center;
  margin-bottom: 10px;

  .iconfont {
    margin-right: 10px;
    color: #E6A23C;
    font-size: 20px;
  }

}
.down-dialog /deep/.el-dialog__body{
  padding-top: 0px;
}
.input-lable {
  float: left;
  width: 30%;
  height: 40px;
  font-size: 16px;
  text-align: center;
  line-height: 40px;
  background-color: #F2F2F2;
}

.switch-lable {
  float: right;
  width: 40%;
  height: 40px;
  font-size: 12px;
  text-align: center;
  line-height: 40px;
}
</style>
