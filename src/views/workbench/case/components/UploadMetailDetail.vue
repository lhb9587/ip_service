<template>
  <div>
    <el-form v-if="pageType=='edit' || pageType=='create'" ref="submission" label-width="206px">
      <el-row style="border-right: 1px solid #EBEEF5;border-top: 1px solid #EBEEF5" >
        <el-form-item label="往来类型:" class="small-el-form-item" style="border:0">
          <el-select default-first-option v-model="submitData.docTypeName" placeholder="请选择" filterable clearable>
            <el-option v-for="item in materialDocTypeList.filter(i=>i.typeName!='官方通知')" :key="item.typeName" :label="item.typeName" :value="item.typeName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="文件/事件类型:">
          <el-select default-first-option v-model="submitData.materialTypeId" placeholder="请选择" filterable clearable >
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
            <el-checkbox :disabled="pageType=='edit'" v-model="isEncryption" @change="changeEncryption">加密</el-checkbox>
          <virtual-select :disabled="true" placeholder="可查看人" style="flex: 1;margin: 0 10px;" :isUser="true" clearable multiple   :data="$store.getters.userList" v-model="encryptionUserList"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
                  </virtual-select>
            <el-button size="small" :disabled="!isEncryption || pageType=='edit'" type="primary" @click="() => {encryptionDialog = true; editUser = true}">修改</el-button>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="上传文件:">
          <el-upload class="upload-demo"
                     :on-remove="brforeRemoveFile"
                     drag
                     ref="uploadFile"
                     multiple
                     :data="uploadFileData"
                     :action="creatematerialUrl"
                     name="attachFile"
                     :auto-upload="true"
                     :on-success="successCallback"
                     :before-upload="beforeupload"
                     :on-preview="onPreview"
                     :file-list="flielist">
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
        <el-row>
          <el-form-item label="电子卷是否完整：">
            <el-radio-group v-model="submitData.tdDoc" style="margin-left: 10px">
              <el-radio :label='1'>是</el-radio>
              <el-radio :label='0'>否</el-radio>
            </el-radio-group>
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
    <el-form v-if="pageType=='view'" ref="submission" label-width="206px">
      <el-row style="border-right: 1px solid #EBEEF5;border-top: 1px solid #EBEEF5" >
        <el-form-item label="往来类型:" class="small-el-form-item" style="border:0">
          {{submitData.docTypeName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="文件/事件类型:">
         {{$commonUtils.transformation(materialTypeByDocIdList,submitData.materialTypeId,'materialTypeId','typeName')}}
<!--          <el-select default-first-option v-model="submitData.materialTypeId" placeholder="请选择" filterable clearable >-->
<!--            <el-option v-for="item in materialTypeByDocIdList" :key="item.materialTypeId" :label="item.typeName" :value="item.materialTypeId">-->
<!--            </el-option>-->
<!--          </el-select>-->
        </el-form-item>
        <el-form-item label="文件/事件名称:">
          {{submitData.eventName}}
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="文件加密:">
          <div style="display: flex">
            <el-checkbox :disabled="true" v-model="isEncryption">加密</el-checkbox>
          <virtual-select :disabled="true" placeholder="可查看人" style="flex: 1;margin-left: 10px;margin-top: 5px" :isUser="true" clearable multiple   :data="$store.getters.userList" v-model="encryptionUserList"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
                  </virtual-select>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
<!--        <el-form-item label="上传文件:">-->
<!--          <el-upload class="upload-demo" :before-remove="brforeRemoveFile" drag ref="uploadFile" multiple :data="uploadFileData" :action="creatematerialUrl" name="attachFile" :auto-upload="true"-->
<!--                     :on-success="successCallback" :before-upload="beforeupload" :file-list="flielist">-->
<!--            <i class="el-icon-upload"></i>-->
<!--            <div class="el-upload__text">-->
<!--              将文件拖到此处，或<em>点击上传</em>-->
<!--            </div>-->
<!--          </el-upload>-->
<!--          -->
<!--        </el-form-item>-->
        <el-form-item label="上传文件:">
          <p v-for="item in flielist" class="pointer" @click="onPreview(item)">
            {{item.name}}
<!--            <a  target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>-->
          </p>
        </el-form-item>
      </el-row>
      <template v-if="submitData.typeName === '闭卷单'">
        <el-row>
          <el-form-item label="是否有转达官文或待报告客户的任务：">
            {{submitData.tdMail ? '是' : '否'}}
          </el-form-item>
          <el-form-item label="是否有未开账单：">
            {{submitData.tdBill ? '是' : '否'}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="电子卷是否完整：">
            {{submitData.tdDoc ? '是' : '否'}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="闭卷备注:">
            {{submitData.pmemo}}
          </el-form-item>
        </el-row>
      </template>
      <template v-if="filemessage&&submitData.typeName !== '闭卷单'" >
        <template v-if="submitData.docTypeName!=='递交官方'">
          <el-row>
            <el-form-item label="发文日期:">
             {{submitData.docDate}}
            </el-form-item>
            <el-form-item label="收文（发生）日期:" class="small-el-form-item-prev">
              {{submitData.recvDate}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="发文编号:" class="small-el-form-item">
              {{submitData.docNumber}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="转寄日期:" class="small-el-form-item">
             {{submitData.sendDate}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="邮寄方式:">
              {{$commonUtils.transformation(mailingTypeList,submitData.mailingType,'mailingType','typeName')}}
<!--              <el-select v-model="submitData.mailingType" placeholder="请选择" filterable clearable>-->
<!--                <el-option v-for="item in mailingTypeList" :key="item.mailingType" :label="item.typeName" :value="item.mailingType">-->
<!--                </el-option>-->
<!--              </el-select>-->
            </el-form-item>
            <el-form-item label="挂号号码:">
             {{submitData.registNum}}
            </el-form-item>
          </el-row>
        </template>
        <el-row>
          <el-form-item label="备注:">
          {{submitData.memo}}
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
      <el-button @click="delEven()" v-if="pageType=='edit' || pageType=='create'">取 消</el-button>
      <el-button @click="delEven()" v-if="pageType=='view'">关 闭</el-button>
      <el-button type="primary" @click="submit" v-if="(pageType=='edit' || pageType=='create')&&submitData.typeName !== '闭卷单'">确 定</el-button>
      <el-button type="primary" @click="submit" v-if="(pageType=='edit' || pageType=='create')&&submitData.typeName === '闭卷单'">保 存</el-button>
      <el-button type="primary" @click="submitBiJuanWithChecks" v-if="(pageType=='edit' || pageType=='create')&&submitData.typeName === '闭卷单'&&(eventRecordData&&submitData.doTask || !eventRecordData)&&!submitData.auditStatus">提 交</el-button>
      <el-button type="primary" v-if="(pageType=='edit' || pageType=='create')&&eventRecordData&&submitData.typeName === '闭卷单'&&submitData.auditStatus===1" @click="rejectAudit">退 回</el-button>
      <el-button type="primary" @click="submitAudit" v-if="(pageType=='edit' || pageType=='create')&&eventRecordData&&submitData.typeName === '闭卷单'&&submitData.auditStatus===1">通 过</el-button>
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
  import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
import {
  queryMaterialDocType,
  queryMaterialTypeByDocId,
  queryMailingType,
  queryMaterialById,
  delCaseMaterial
} from "@/api/caseList";
  import {
    addCaseEventUrl,
    updateCaseEventUrl,
    deleteCaseEventUrl,
    queryCaseEventDetailUrl,
    delCaseMaterialUrl,
    checkLawsuitCase,
    auditCaseClose,
    submitCaseClose, checkImageInstruction
  } from "@/api/caseDetail";
import { creatematerialUrl } from "@/api/serviceApi.config.js";
import Vue from "vue";
  import {decFile, deleteFile, modifyMaterialStatus, queryDefaultUser} from "../../../../api/caseList";
export default {
  props: {
    caseDetailFoemData: {},
    caseIds: {
      default: () => []
    },
    isPatentFee: {
      default: false
    },
    eventRecordData: {
      default: ''
    },
    evenItem: {
      default: {}
    },
    pageType:{
      default:'edit'
    },
    curCaseId: {},
    custId: {},
    taskInfo: {
      default: ()=>({
        taskId: '',
        type: ''
      })
    }
  },
  name: "UploadMetailDetail",
  data() {
    return {
      editUser: false,
      defaultUserList: [],
      defaultFlag: false,
      encryptionDialog: false,
      encryptionUserList: [], // 文件可查看人
      isEncryption: false, // 文件是否加密
      flielist: [],
      submitData: {
        eventName:''
      },
      materialDocTypeList: [],
      materialTypeByDocIdList: [],
      mailingTypeList: [],
      creatematerialUrl,
      filemessage: false,
      eventRecordId: "",
      modifyState: false,
      uploadFileData: {
        custId: this.custId,
        caseId: this.curCaseId,
        tokenID: this.$store.getters.token
      }
    };
  },
  created() {
    this.submitData.caseId = this.curCaseId;
    this.submitData.userId = this.$store.getters.userId;

    this.queryMaterialDocType();
    this.queryMailingType();
    if (this.pageType=='create') {
      queryDefaultUser().then(res => {
        this.defaultUserList = res.data.userIdList || []
      })
    }
    if (this.eventRecordData) {
      this.modifyState = true;
      this.submitData = this.eventRecordData;
      queryCaseEventDetailUrl({
        eventRecordId: this.eventRecordData.eventRecordId
      }).then(res => {
        if (res.data.materialList) {
          this.submitData = { ...res.data, ...res.data.materialList[0] };
          if (res.data.materialList.find(item => item.status1 == 9)) {
            this.isEncryption = true
            this.encryptionUserList = res.data.materialList.find(item => item.status1 == 9).userIdList
          }
          this.flielist = res.data.materialList.map(item => {
            return {
              name: item.materialName,
              url: item.address,
              address: item.address,
              materialId: item.materialId,
              status1: item.status1
            };
          });
          this.flielist = this.flielist.filter(item => item.materialId);
          this.submitData.materialIdList = this.flielist.map(
            item => item.materialId
          );
        } else {
          this.submitData = res.data;
        }
        if (this.flielist && this.flielist.length > 0) {
          this.filemessage = true;
        } else {
          this.filemessage = false;
        }
        if(!this.submitData.todoModeList&&this.submitData.typeName === '闭卷单'){
          this.$set(this.submitData, 'todoModeList', [])
        }
      });
    } else {
      // this.addEven();
    }
  },
  methods: {
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
    downLoad(data, isDel){
        const url = data.address || data.url
        // let notify = this.$notify.success({
        //   // title: 'Info',
        //   message: '正在下载',
        //   showClose: false,
        //   duration: 0
        //
        // });
        const downData={
          url:`ipdoc${url}`,
          success(){
            isDel && deleteFile({
              materialId: data.materialId
            })
          }
        }
        if(data.mailId){
          downData.downLoad=data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
    },
    onPreview(data){
      if (data.status1 == 9) {
        decFile({
          materialId: data.materialId
        }).then(res => {
          res.data && this.downLoad(res.data, true)
        })
      } else {
        let url = data.address || data.url
        if (getProgID(url)||['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          if(['doc','docx'].includes(url.replace(/.+\./,"").toLocaleLowerCase())){
            this.$commonUtils.viewPdf(`${url}`)
          }else {
            let flag = ''
            if(data.mailId){
              flag = 'mailId'
            }else if (data.materialId) {
              flag = 'materialId'
            }
            url = url.replace(/&/g, '%26')
            window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g,'%2B'))
          }
          // doEditInOffice(url, getProgID(url))
        } else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
          window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
        } else {
         this.downLoad(data)
        }
      }
    },
    // onPreview(file) {
    //   var a = document.createElement('a')
    //   a.setAttribute('href', '/ipdoc' + file.url)
    //   a.setAttribute('id', 'startTelMedicine')
    //   a.setAttribute('target', '_blank')
    //   if (document.getElementById('startTelMedicine')) {
    //     document.body.removeChild(document.getElementById('startTelMedicine'))
    //   }
    //   document.body.appendChild(a)
    //   a.click()
    // },
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
    async submitBiJuanWithChecks() {
      if (!this.submitData.materialTypeId && this.submitData.materialIdList && this.submitData.materialIdList.length) {
        this.$message.error('请选择文件/事件类型')
        return
      }
      if (this.submitData.tdMail !== 1) {
        this.$message.error('请先确认“是否有转达官文或待报告客户的任务”为是，再提交申请')
        return
      }
      if (this.submitData.tdBill !== 1) {
        this.$message.error('请先确认“是否有未开账单”为是，再提交申请')
        return
      }
      if (this.submitData.tdDoc !== 1) {
        this.$message.error('请先确认“电子卷是否完整”为是，再提交申请')
        return
      }
      if (!(await this.validateCloseCaseBeforeSubmit())) {
        return
      }
      submitCaseClose({...this.submitData, caseIds: this.curCaseId, eventRecordId: this.eventRecordData&&this.eventRecordData.eventRecordId || ''}).then(res=>{
        this.$message.success('提交成功！')
        this.$emit("changeFalse", true);
      }).catch(err=>{
        this.$message.error('提交失败！')
      })
    },
    submitAudit(){
      auditCaseClose({caseIds: this.curCaseId,taskId: this.taskInfo.taskId, result: 1}).then(res=>{
        this.$message.success('审核成功！')
        this.$emit("changeFalse", true);
      }).catch(err=>{
        this.$message.error('审核失败！')
        // this.$emit("changeFalse", true);
      })
    },
    async rejectAudit() {
      try {
        const { value } = await this.$prompt('请输入退回原因', '退回原因', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: '',
          inputValidator: (inputValue) => {
            if (!inputValue || !inputValue.trim()) {
              return '请输入退回原因'
            }
            return true
          }
        })
        auditCaseClose({
          caseIds: this.curCaseId,
          taskId: this.taskInfo.taskId,
          result: 0,
          failReason: value.trim()
        }).then(res => {
          this.$message.info('已退回至申请人！')
          this.$emit("changeFalse", true);
        }).catch(err => {
          this.$message.error('退回失败！')
        })
      } catch (e) {
      }
    },
    addEven() {
      addCaseEventUrl(this.submitData).then(res => {
        // this.submitData.eventRecordId = res.data.eventRecordId;
        this.$emit("changeFalse", true);
      });
    },
    updataEven() {
      delete this.submitData.materialList;
      delete this.submitData.materialId;
      delete this.submitData.materialName;
      delete this.submitData.address;
      updateCaseEventUrl(this.submitData).then(res => {
        this.$emit("changeFalse", true);
      });
    },
    delEven() {
      this.$emit("changeFalse", true);
    },
    queryMaterialDocType() {
      queryMaterialDocType().then(res => {
        this.materialDocTypeList = res.data;
        this.isPatentFee && (this.$set(this.submitData, 'docTypeName' , '内部往来'))
      });
    },
    queryMaterialTypeByDocId(doctId) {
      // this.$set(this.submitData,'materialTypeId','')
      queryMaterialTypeByDocId({ doctId,caseIds: this.curCaseId,taskType:this.$route.query.taskType }).then(res => {
        this.materialTypeByDocIdList = res.data;
        this.isPatentFee && (this.$set(this.submitData, 'materialTypeId', 301423))
      });

    },
    queryMailingType() {
      queryMailingType().then(res => {
        if (res.success) {
          this.mailingTypeList = res.data;
        }
      });
    },
    successCallback(res, file, fileList) {
      console.log(fileList, "+++");
      this.submitData.materialIdList = fileList.map(item => {
        if (item.materialId) {
          return item.materialId;
        } else {
          return item.response.data[0].materialId;
        }
      });
      // console.log('+++++++++++++++++')
      // console.log(res.data.map(item=>({
      //   name: item.materialName,
      //   url: item.address,
      //   materialId: item.materialId
      // }))[0])
      // console.log('+++++++++++++++++')
      this.flielist.push(res.data.map(item=>({
        name: item.materialName,
        url: item.address,
        address: item.address,
        materialId: item.materialId,
      }))[0])

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
      if (!this.submitData.materialTypeId && this.submitData.materialIdList && this.submitData.materialIdList.length){
          this.$message('请选择文件类型')
          return false
        }
      let delmaterialId;
      if (file.response) {
        delmaterialId = file.response.data[0].materialId;
      } else {
        delmaterialId = file.materialId;
      }
      delmaterialId && delCaseMaterialUrl({
        caseIdArray: [this.curCaseId],
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
        this.flielist = fileList
        if (fileList.length > 0) {
          this.filemessage = true;
        } else {
          this.filemessage = false;
        }
      });
    },
     beforeupload() {
       let coverImage = 0
       let result = true
       if (!this.submitData.materialTypeId){
         this.$message('请选择文件类型')
         return false
       }
       if (this.submitData.materialTypeId == '1018' && this.caseDetailFoemData.caseType == '商标注册' && ['内-内', '外-内'].includes(this.caseDetailFoemData.appFromto)) {
         return new Promise(async (resolve, reject) => {
           try {
             const flag = await checkImageInstruction({caseIds: this.caseIds +　''})
             if (flag.data && !await this.$confirm('该案件已有商标图样，请确认是否覆盖？', '提示', {
               confirmButtonText: '覆盖',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
               coverImage = 1

             }).catch(() => {
               coverImage = 0
               result = false
             })) {

             }
           } catch (e) {

           }
           this.uploadFileData.materialTypeId = this.submitData.materialTypeId;
           this.uploadFileData.caseIds = this.caseIds
           this.uploadFileData.coverImage = coverImage
           result ? resolve() : reject()
         })
       } else {
         this.uploadFileData.materialTypeId = this.submitData.materialTypeId;
         this.uploadFileData.caseIds = this.caseIds
         this.uploadFileData.coverImage = coverImage
       }
      // return
      // this.uploadFileData.objInstId = this.submitData.eventRecordId;
      // this.uploadFileData.objType = "99";
    },
    async submit() {
      if (!this.submitData.materialTypeId && this.submitData.materialIdList && this.submitData.materialIdList.length) {
        this.$message.error('请选择文件/事件类型')
        return
      }
      if(this.submitData.typeName === '闭卷单'){
        if (!(await this.validateCloseCaseBeforeSubmit())) {
          return
        }
      }

      if(this.eventRecordData){
        this.updataEven();
      }else {
        this.addEven()
      }


    }
  },
  watch: {
    "submitData.docTypeName": {
      handler(n){
        setTimeout(()=>{
          this.queryMaterialTypeByDocId(
          this.materialDocTypeList.find(item => item.typeName === n).doctId);
          this.submitData.doctId = this.materialDocTypeList.find(
            item => item.typeName === n
          ).doctId;
        },0)
      },
      immediate: false
    },
    "submitData.materialTypeId"(n, o) {
      if(this.materialTypeByDocIdList.length){
        this.submitData.typeName = this.materialTypeByDocIdList.find(
          item => item.materialTypeId === n
        ).typeName;
        this.submitData.eventName= this.submitData.typeName
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
  margin: 0 20px;
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
      height: 100%;
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
