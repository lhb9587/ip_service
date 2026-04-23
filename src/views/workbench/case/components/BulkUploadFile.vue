<template>
  <div>
    <el-form ref="submission" label-width="206px">
      <el-row style="border-right: 1px solid #EBEEF5;border-top: 1px solid #EBEEF5" v-show="!uploadType">
        <el-form-item label="往来类型:" class="small-el-form-item" style="border:0">
          <el-select default-first-option v-model="submitData.docTypeName" placeholder="请选择" filterable clearable>
            <el-option v-for="item in materialDocTypeList" :key="item.typeName" :label="item.typeName" :value="item.typeName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="文件/事件类型:">
          <el-select default-first-option v-model="submitData.materialTypeId" placeholder="请选择" filterable clearable @change="selectDocType">
            <el-option v-for="item in materialTypeByDocIdList" :key="item.materialTypeId" :label="item.typeName" :value="item.materialTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件/事件名称:">
          <el-input v-model="submitData.eventName" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="文件加密:">
          <div style="display: flex;align-items: center">
            <el-checkbox v-model="isEncryption" @change="changeEncryption">加密</el-checkbox>
          <virtual-select :disabled="true" placeholder="可查看人" style="flex: 1;margin: 0 10px;" :isUser="true" clearable multiple   :data="$store.getters.userList" v-model="encryptionUserList"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
                  </virtual-select>
            <el-button size="small" :disabled="!isEncryption" type="primary" @click="() => {encryptionDialog = true; editUser = true}">修改</el-button>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="上传文件:">
          <el-upload class="upload-demo" :before-remove="brforeRemoveFile" drag ref="uploadFile" multiple :data="uploadFileData" :action="creatematerialUrl" name="attachFile" :auto-upload="true"
                     :on-success="successCallback" :before-upload="beforeupload" :file-list="flielist" :on-preview="onPreview">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-row>
      <template v-if="submitData.typeName === '闭卷单'">
        <el-row>
          <el-form-item label="是否有转达官文或待报告客户的任务：">
            <el-radio-group v-model="submitData.tdMail" style="margin-left: 10px">
                <el-radio :label='1'>是</el-radio>
                <el-radio :label='0'>否</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="是否有未开账单：">
            <el-radio-group v-model="submitData.tdBill" style="margin-left: 10px">
              <el-radio :label='1'>是</el-radio>
              <el-radio :label='0'>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-if="isLawsuitOrProtect">
          <el-form-item label="电子卷是否完整：">
            <el-radio-group v-model="submitData.tdDoc" style="margin-left: 10px">
              <el-radio :label='1'>是</el-radio>
              <el-radio :label='0'>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-else>
          <el-form-item label="是否核销所有时限：">
            <el-radio-group v-model="submitData.tdTimelimit" style="margin-left: 10px">
              <el-radio :label='1'>是</el-radio>
              <el-radio :label='0'>否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="确认处理方式：">
            <el-select v-model="submitData.todoModeList" placeholder="请选择" filterable clearable multiple>
              <el-option v-for="item in handleKindList"
                :key="item.id"
                :label="item.label" :value="item.id">{{item.label}}
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="闭卷备注:">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-model="submitData.pmemo">
            </el-input>
          </el-form-item>
        </el-row>
      </template>
      <template v-if="filemessage&&submitData.typeName !== '闭卷单'" >
        <template v-if="submitData.docTypeName!=='递交官方'">
        <el-row>
          <el-form-item label="发文日期:">
            <el-date-picker v-model="submitData.docDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="收文（发生）日期:" class="small-el-form-item-prev">
            <el-date-picker v-model="submitData.recvDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row v-if="[301667,390,386].includes(submitData.materialTypeId)">
          <el-form-item label="邮寄单号:" class="small-el-form-item">
            <el-input v-model="submitData.docNumber" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-row>
        <el-row v-else>
          <el-form-item label="发文编号:" class="small-el-form-item">
            <el-input v-model="submitData.docNumber" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="转寄日期:" class="small-el-form-item">
            <el-date-picker v-model="submitData.sendDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="邮寄方式:">
            <el-select v-model="submitData.mailingType" placeholder="请选择" filterable clearable>
              <el-option v-for="item in mailingTypeList" :key="item.mailingType" :label="item.typeName" :value="item.mailingType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="挂号号码:" v-if="!([301667,390,386].includes(submitData.materialTypeId))">
            <el-input v-model="submitData.registNum" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-row>
        </template>
        <el-row>
          <el-form-item label="备注:">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-model="submitData.memo">
            </el-input>
          </el-form-item>
        </el-row>
      </template>
      <el-row>
        <el-form-item label="上传人:">
          {{
          submitData.creater
          ? submitData.creater
          : (submitData.creater = $store.getters.name)
          }}
        </el-form-item>
        <el-form-item label="上传日期:">
          {{
          submitData.createDate
          ? submitData.createDate
          : (submitData.createDate = getNowFormatDate())
          }}
        </el-form-item>
      </el-row>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="delEven()">取 消</el-button>
      <el-button type="primary" @click="submit" v-if="submitData.typeName !== '闭卷单'">确 定</el-button>
      <el-button type="primary" @click="submit" v-if="submitData.typeName === '闭卷单'">保 存</el-button>
      <el-button type="primary" @click="submitBiJuan" v-if="submitData.typeName === '闭卷单'">提 交</el-button>
    </div>
    <el-dialog title="请选择查看人" :close-on-click-modal="false" append-to-body :visible.sync="encryptionDialog" width="30%" :before-close="closeEncryption">
      <virtual-select placeholder="请选择可查看人" style="flex: 1;margin-left: 10px;margin-top: 5px" class="virtual-select" :isUser="true" clearable multiple   :data="$store.getters.userList" v-model="encryptionUserList"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
                  </virtual-select>
      <el-checkbox style="margin-top: 10px" v-model="defaultFlag">设为默认查看人</el-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEncryption">取 消</el-button>
        <el-button type="primary" @click="submitEncryption">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryMaterialDocType,
  queryMaterialTypeByDocId,
  queryMailingType,
  queryMaterialById,
  delCaseMaterial,
  modifyMaterialType
} from "@/api/caseList";
import {
  addCaseEventUrl,
  updateCaseEventUrl,
  deleteCaseEventUrl,
  queryCaseEventDetailUrl,
  delCaseMaterialUrl,
  checkLawsuitCase,
  submitCaseClose, checkImageInstruction
} from "@/api/caseDetail";
import { creatematerialUrl } from "@/api/serviceApi.config.js";
import Vue from "vue";
import {modifyMaterialStatus, queryDefaultUser} from "../../../../api/caseList";
export default {
  props: {
    caseList: {
      default: () => []
    },
    patentOneMaterial:{
      type: Boolean,
      default: false
    },
    curCaseId: {
    },
    uploadType: {
    },
    taskType:{
      default:1
    }
  },
  name: "BulkUploadFile",
  data() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要加1
    const day = String(now.getDate()).padStart(2, '0');
    const formatDate = `${year}-${month}-${day}`
    return {
      editUser: false,
      defaultUserList: [],
      defaultFlag: false,
      encryptionDialog: false,
      encryptionUserList: [], // 文件可查看人
      isEncryption: false, // 文件是否加密
      handleKindList: [{id: 1, label: '补开账单'},{id: 2, label: '向客户发确认函'},{id: 3, label: '指示函存入系统'},{id: 4, label: '转达官文'},{id: 5, label: '其它'}],
      flielist: [],
      submitData: {
        docTypeName:'',
        materialTypeId:'',
        eventName:'',
        docDate:formatDate,
        recvDate:formatDate,
        docNumber:'',
        sendDate:'',
        mailingType:'',
        registNum:'',
        memo:'',
      },
      materialDocTypeList: [],
      materialTypeByDocIdList: [],
      mailingTypeList: [],
      creatematerialUrl,
      filemessage: false,
      eventRecordId: "",
      modifyState: false,
      uploadFileData: {
        caseIds: this.curCaseId,
        tokenID: this.$store.getters.token
      }
    };
  },
  created() {
    this.submitData.caseIds = this.curCaseId;
    this.submitData.userId = this.$store.getters.userId;
    queryDefaultUser().then(res => {
      this.defaultUserList = res.data.userIdList || []
    })

    this.queryMaterialDocType();
    this.queryMailingType();
    // if (this.eventRecordData) {
    //   this.modifyState = true;
    //   this.submitData = this.eventRecordData;
    //   queryCaseEventDetailUrl({
    //     eventRecordId: this.eventRecordData.eventRecordId
    //   }).then(res => {
    //     if (res.data.materialList) {
    //       this.submitData = { ...res.data, ...res.data.materialList[0] };
    //       this.flielist = res.data.materialList.map(item => {
    //         return {
    //           name: item.materialName,
    //           url: item.address,
    //           materialId: item.materialId
    //         };
    //       });
    //       this.flielist = this.flielist.filter(item => item.materialId);
    //       this.submitData.materialIdList = this.flielist.map(
    //         item => item.materialId
    //       );
    //     } else {
    //       this.submitData = res.data;
    //     }
    //     if (this.flielist && this.flielist.length > 0) {
    //       this.filemessage = true;
    //     } else {
    //       this.filemessage = false;
    //     }
    //   });
    // } else {
    //   this.addEven();
    // }
  },
  methods: {
    formatDate(date) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要加1
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`
    },
    modifyMaterialStatus(flag) {
      modifyMaterialStatus({
        status1: flag === "加密" ? 9 : undefined,
        materialIdList: this.submitData.materialIdList,
        userIdList: this.encryptionUserList,
        defaultFlag: this.defaultFlag ? 1 : undefined
      }).then(res => {
        this.$message.success(`文件${flag}成功!`)
        this.closeEncryption(flag === "加密")
      })
    },
    submitEncryption() {
      if (this.encryptionUserList.length) {
        if (this.submitData.materialIdList) {
          this.modifyMaterialStatus("加密")
        } else {
          this.closeEncryption(true)
        }
      } else {
        this.$message.error("请选择查看人!")
      }
    },
    closeEncryption(flag) {
      this.encryptionDialog = false
      if (flag !== true && !this.editUser) {
        this.encryptionUserList = []
        this.isEncryption = false
        this.defaultFlag = false
      }
      this.editUser = false
    },
    changeEncryption(value) {
      if (value) {
        this.encryptionDialog = true
        this.encryptionUserList = this.defaultUserList || []
      } else {
        if (this.encryptionUserList.length) {
          if (this.submitData.materialIdList) {
            this.modifyMaterialStatus("取消加密")
          } else {
            this.closeEncryption()
          }
        }
      }
    },
    onPreview(file) {
      var a = document.createElement('a')
      a.setAttribute('href', '/ipdoc' + file.response.data[0].address)
      a.setAttribute('id', 'startTelMedicine')
      a.setAttribute('target', '_blank')
      if (document.getElementById('startTelMedicine')) {
        document.body.removeChild(document.getElementById('startTelMedicine'))
      }
      document.body.appendChild(a)
      a.click()
    },
    async validateCloseCaseBeforeSubmit() {
      if (!this.submitData.materialTypeId || String(this.submitData.materialTypeId) !== '301397') {
        return true
      }
      const res = await checkLawsuitCase({ idArray: this.curCaseId })
      if (!res.success) {
        this.$message.error('案件有未核销的时限或费用，请先核销再进行闭卷')
        return false
      }
      return true
    },
    submitBiJuan(){
      if (!this.submitData.materialTypeId && this.submitData.materialIdList && this.submitData.materialIdList.length) {
        this.$message.error('请选择文件/事件类型')
        return
      }
      console.log(this.isLawsuitOrProtect,'this.isLawsuitOrProtect');
      
      if (this.isLawsuitOrProtect) {
        this.submitBiJuanWithChecks()
      }else{
        this.submitBiJuanNoChecks()
      }
    },
    submitBiJuanNoChecks(){
      if(
        (this.submitData.tdMail !== 0 && this.submitData.tdMail !== 1)
        &&(this.submitData.tdBill !== 0 && this.submitData.tdBill !== 1)
        &&(this.submitData.tdTimelimit !== 0 && this.submitData.tdTimelimit !== 1)
        &&(this.submitData.todoModeList&&this.submitData.todoModeList.length == 0)
      ){
        this.$message.error('请填写至少一项闭卷信息，否则不能提交申请!')
        return;
      }
      submitCaseClose({ ...this.submitData, caseIds: this.curCaseId }).then(res => {
        this.$message.success('提交成功！')
        this.$emit("changeFalse", true);
      })
    },
    async submitBiJuanWithChecks() {
      if (this.submitData.tdMail !== 0 && this.submitData.tdMail !== 1) {
        this.$message.error('请填写“是否有转达官文或待报告客户的任务”')
        return
      }
      if (this.submitData.tdBill !== 0 && this.submitData.tdBill !== 1) {
        this.$message.error('请填写“是否有未开账单”')
        return
      }
      if (this.submitData.tdDoc !== 0 && this.submitData.tdDoc !== 1) {
        this.$message.error('请填写“电子卷是否完整”')
        return
      }
      if (this.submitData.tdMail === 1) {
        this.$message.error('请完成转达官文或待报告客户的任务，否则不能提交闭卷')
        return
      }
      if (this.submitData.tdBill === 1) {
        this.$message.error('请完成未开账单，否则不能提交闭卷')
        return
      }
      if (this.submitData.tdDoc !== 1) {
        this.$message.error('请上传完整电子卷，否则不能提交闭卷')
        return
      }
      if (!(await this.validateCloseCaseBeforeSubmit())) {
        return
      }
      submitCaseClose({ ...this.submitData, caseIds: this.curCaseId }).then(res => {
        this.$message.success('提交成功！')
        this.$emit("changeFalse", true);
      })
    },
    updataEven() {
      // delete this.submitData.materialList;
      this.submitData.materialIdList=JSON.parse(JSON.stringify(this.submitData.materialList))
      delete this.submitData.materialList
      updateCaseEventUrl(this.submitData).then(res => {
        this.$emit("changeFalse", true);
      });
    },
    delEven() {
      this.$emit("changeFalse", true);
    },
    selectDocType(e){
      if(this.patentOneMaterial) {
          this.submitData.materialTypeId = 301509;
          this.materialTypeByDocIdList = this.materialTypeByDocIdList.filter(i=>i.materialTypeId == 301509)
        }
      this.submitData.eventName=this.materialTypeByDocIdList.find(item=>item.materialTypeId===this.submitData.materialTypeId).typeName
      this.submitData.typeName=this.submitData.eventName
      if(this.submitData.materialIdList&&this.submitData.materialIdList.length){
        modifyMaterialType({materialTypeId:e,
        materialIdList:this.submitData.materialIdList,
        docName:this.submitData.typeName}).then(res=>{

        })
      }
    },
    queryMaterialDocType() {
      queryMaterialDocType().then(res => {
        this.materialDocTypeList = res.data;
        if(this.taskType==2){
          this.materialDocTypeList =  this.materialDocTypeList.filter(item=>item.typeName!=='官方通知');
        }
        if(this.uploadType){

          this.submitData.docTypeName=this.uploadType
          this.queryMaterialTypeByDocId(this.materialDocTypeList.find(item => item.typeName === this.uploadType).doctId)
        }
      });
    },
    queryMaterialTypeByDocId(doctId) {
      queryMaterialTypeByDocId({ doctId ,taskType:this.taskType}).then(res => {
        this.materialTypeByDocIdList = res.data;
        if(this.patentOneMaterial) {
          this.submitData.materialTypeId = 301509;
          this.materialTypeByDocIdList = this.materialTypeByDocIdList.filter(i=>i.materialTypeId == 301509)
          this.submitData.typeName = this.materialTypeByDocIdList.find(item => item.materialTypeId === this.submitData.materialTypeId).typeName;
          this.submitData.eventName = this.submitData.typeName
        }


      });
      // this.$set(this.submitData,'materialTypeId','')

    },
    queryMailingType() {
      queryMailingType().then(res => {
        if (res.success) {
          this.mailingTypeList = res.data;
        }
      });
    },
    successCallback(res, file, fileList) {
      this.submitData.materialIdList = fileList.map(item => {
        if (item.materialId) {
          return item.materialId;
        } else {
          return item.response.data[0].materialId;
        }
      });
      if (this.encryptionUserList.length && this.isEncryption) {
        this.modifyMaterialStatus("加密")
      }
      if (fileList.length > 0) {
        this.filemessage = true;
      } else {
        this.filemessage = false;
      }
    },
    brforeRemoveFile(file, fileList) {
      let delmaterialId;
      if (file.response) {
        delmaterialId = file.response.data[0].materialId;
      } else {
        delmaterialId = file.materialId;
      }
      if(delmaterialId){
        delCaseMaterialUrl({
          caseIdArray: this.curCaseId,
          materialId: delmaterialId
        }).then(res => {
          this.$message.success(res.message);
          this.submitData.materialIdList = fileList.map(item => {
            if (item.materialId) {
              return item.materialId;
            } else {
              return item.response.data[0].materialId;
            }
          });
          if (fileList.length > 0) {
            this.filemessage = true;
          } else {
            this.filemessage = false;
          }
        });
      }
    },
    beforeupload() {
      let coverImage = 0
      let result = true
      if(!this.submitData.materialTypeId){
        this.$message.error('请选择文件类型')
        return false
      }
      if (this.submitData.materialTypeId == '1018' && this.caseList.find(item => item.caseType == '商标注册' && ['内-内', '外-内'].includes(item.appFromto))) {
        return new Promise(async (resolve, reject) => {
          try {
            const flag = await checkImageInstruction({caseIds: this.curCaseId + ''})
            if (flag.data && !await this.$confirm('该案件已有商标图样，请确认是否覆盖？', '提示', {
              confirmButtonText: '覆盖',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              coverImage = 1

            }).catch(() => {
              coverImage = 0
              result = false
            })) {}
          } catch (e) {

          }
          this.uploadFileData.materialTypeId = this.submitData.materialTypeId;
          this.uploadFileData.coverImage = coverImage
          result ? resolve() : reject()
        })
      } else {
        this.uploadFileData.materialTypeId = this.submitData.materialTypeId;
        this.uploadFileData.coverImage = coverImage
      }
     // this.uploadFileData.objType = 99
     //  this.uploadFileData.materialTypeId = this.submitData.materialTypeId;
      // this.uploadFileData.caseIds=[1,2,3]
    },
    submit(){
      if((!this.submitData.materialIdList||!this.submitData.materialIdList.length)&&this.submitData.typeName !== '闭卷单') {
        this.$message.error('请上传文件')
        return
      }
      if (!this.submitData.materialTypeId && this.submitData.materialIdList && this.submitData.materialIdList.length) {
        this.$message.error('请选择文件/事件类型')
        return
      }
      this.submitData.caseIds= this.curCaseId

      addCaseEventUrl(this.submitData).then(res=>{
        this.$message.success('上传成功')
        this.$emit("changeFalse", true);
      })
      // Promise.all(this.curCaseId.map(item=>addCaseEventUrl({caseId:item}))).then(res=>{
      //   delete this.submitData.caseId
      //   Promise.all(res.map(item=>updateCaseEventUrl(Object.assign(item.data,this.submitData)))).then(res=>{
      //     this.$message.success('上传成功')
      //     this.$emit("changeFalse", true);
      //   })
      // })
    }
  },
  watch: {
    'submitData.docTypeName'(n, o) {
      this.queryMaterialTypeByDocId(this.materialDocTypeList.find(item => item.typeName === n).doctId);
      this.submitData.doctId = this.materialDocTypeList.find(
        item => item.typeName === n
      ).doctId;
    },
  },
  computed: {
    //判断类型是否是诉讼或者是保护
    isLawsuitOrProtect() {
      const lawsuitOrProtectType = [2,3]
      return lawsuitOrProtectType.includes(this.taskType)
    }
  }
};
</script>

<style lang="scss" scoped>
  .el-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 20px;
    .el-select,
    .el-input,
    .el-date-picker,
    .el-textarea {
      width: 95%;
    }
    .el-textarea {
      margin: 10px 0;
    }
    /deep/ input {
      height: 28px;
    }
    /deep/ .el-input__icon {
      line-height: 28px;
    }
    .el-row {
      min-height: 30px;
      width: 100%;
      display: flex;
      align-items: center;
      .el-form-item {
        width: 100%;
        display: flex;
        border: 1px solid #ebeef5;
        border-bottom: 0;
        margin-bottom: 0;
        /deep/ .el-form-item__label {
          background: #f5f7fa;
        }
        /deep/ .el-form-item__content {
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
        }
      }
      .small-el-form-item-prev:before {
        content: "";
        width: 50%;
        height: 1px;
        background: #ebeef5;
        position: absolute;
        bottom: -1px;
        right: 0;
        z-index: 1;
      }
      .small-el-form-item {
        position: relative;
        width: 50%;
        /deep/ .el-form-item__content {
          flex: 1;
          .pad20 {
            padding-left: 20px;
          }
        }
      }
    }
    .el-row:nth-last-child(1) {
      .el-form-item {
        border: 1px solid #ebeef5;
      }
    }
  }
  .dialog-footer {
    width: 100%;
    display: flex;
    height: 85px;
    align-items: center;
    justify-content: flex-end;
    .el-button {
      margin-right: 30px;
    }
  }
  >>>.virtual-select {
    .jh-virtual-select {
      height: auto;
    }
  }
</style>
