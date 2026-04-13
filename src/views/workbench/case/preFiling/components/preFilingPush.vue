<template>
    <div class="preFilingPush">
      <header>{{$route.meta.title}}</header>
      <el-form  ref="preFilingPushForm" :model="formData" :rules="rules" label-width="206px">
        <el-row>
          <el-form-item label="案件类型" class="small-el-form-item" >
           {{formData.caseType}}
          </el-form-item>
          <el-form-item label="预立卷文号"  class="small-el-form-item">
           {{formData.agentNum}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="客户名称"  class="small-el-form-item">
            {{formData.name}}
          </el-form-item>
          <el-form-item label="客户信用等级"  class="small-el-form-item">
            {{formData.level}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="信用等级理由及批示"  class="small-el-form-item">
            {{custInfo.creditMemo}}
          </el-form-item>
          <el-form-item label="不可垫付"  class="small-el-form-item">
            {{custInfo.creditNotAdvanceFlag?'是':'否'}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="附件列表"">
            <div v-for="(item,index) in custInfo.creditMaterialList || []" :key="index">
              <div class="clickable" href="" @click="preView(item)" style="width: fit-content;">{{ item.materialName }}</div>
            </div>
          </el-form-item>
        </el-row>
        <el-row v-if="$route.params.type==='3'">
          <el-form-item label="申请人" >
            {{formData.submitUser}}
          </el-form-item>
        </el-row>
        <el-row v-if="!(tmCaseTypeList.includes(formData.caseType))&&$route.params.type!=='1'" label="案件名称">
          <el-form-item>
            {{formData.caseName || formData.caseCnName}}
          </el-form-item>
          <el-form-item label="商标名称" v-if="$route.params.type!=='1'&&tmCaseTypeList.includes(formData.caseType)">
            {{formData.tmName}}
          </el-form-item>
        </el-row>
        <el-row v-if="$route.params.type==='2'">
          <el-form-item label="上传文件">
            <div v-for="(item, key) in materialList" :key="key">
              <p class="fileName"><a :href="`ipdoc${item.address}`"  target="_blank">{{item.name}}</a></p>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="审批人" prop="auditUserIds" v-if="$route.params.type!=='2'">
            <el-select  default-first-option v-model="formData.auditUserIds" multiple filterable clearable placeholder="请选择"  v-if="update">
              <el-option
                v-for="item in queryDeliverList"
                :key="item.userId"
                :label="item.fullname"
                :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="上传文件" :class="{'is-required': isYunFen}" v-if="$route.params.type!=='2'">
            <div v-for="(item, key) in typeNameList" :key="key">
              <el-upload class="upload-demo" :action="creatematerialUrl" :before-remove="beforeRemoveFile"
                         :data="materialData(item.materialTypeId, item.typeName)"
                         multiple :show-file-list="true" name="attachFile">
                <el-button slot="trigger" size="small" type="primary">{{item.typeName}}</el-button>
              </el-upload>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="提交说明">
            <el-input
              v-if="$route.params.type==='1'"
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="formData.appNote">
            </el-input>
            <span  v-if="$route.params.type!=='1'">{{formData.appNote}}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="提交人"  class="small-el-form-item"  v-if="$route.params.type!=='2'">
            {{$store.getters.name}}
          </el-form-item>
          <el-form-item label="提交人"  class="small-el-form-item"  v-if="$route.params.type==='2'">
            {{formData.submitUser}}
          </el-form-item>
          <el-form-item label="提交时间"  class="small-el-form-item">
            <span v-if="$route.params.type==='1'">{{new Date().toLocaleDateString()}}</span><span v-if="$route.params.type!=='1'">{{formData.submitDate}}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="审批人"  v-if="$route.params.type==='2'" >
            <span>{{$store.getters.name}}</span>
          </el-form-item>
        </el-row>
        <el-row v-if="$route.params.type!=='1'">
          <el-form-item label="审批意见" >
            <div v-if="$route.params.type==='3'">{{formData.auditNote}}</div>
            <el-input
              v-if="$route.params.type==='2'"
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="formData.auditNote"
             >
            </el-input>
          </el-form-item>
        </el-row>
        <div class="button_wrap" v-if="$route.params.type==='1'">
          <el-button class="exactButton" type="primary" @click="preSubmit(1)">提交</el-button>
          <el-button class="exactButton" plain @click="cancel">取消</el-button>
        </div>
        <div class="button_wrap"  v-if="$route.params.type==='2'">
          <el-button class="exactButton" type="primary" @click="passOrReturn(1)">通过</el-button>
          <el-button class="exactButton" type="primary" @click="passOrReturn(0)">退回</el-button>
          <el-button class="exactButton" plain @click="cancel">返回</el-button>
        </div>
        <div class="button_wrap"  v-if="$route.params.type==='3'">
          <el-dropdown trigger="click" placement="top" @command="filingOperation">
            <el-button type="primary" >
              立卷<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item command="prefiling" >预立卷审批</el-dropdown-item>
              <el-dropdown-item command="createBills">创建账单</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button class="exactButton" plain @click="cancel">返回</el-button>
        </div>
      </el-form>

      <el-dialog title="请注意:" :visible.sync="dialogcheckChongTuVisible" class="chongtuTitle">
      <el-row style="margin: 10px 5px">
        <el-col :span="24">
          <span style="font-size:17px;color: #ff0000">被申请人与下列我方代理过的申请人名称相同/近似，请暂停立案并联系客户部刘佳/崔晶进行冲突检索，收到邮件确认后方可继续立案。</span>
        </el-col>
      </el-row>
      <el-table :data="gridData">
        <el-table-column property="agentNum" label="案件文号"></el-table-column>
        <el-table-column property="caseType" label="案件类型"></el-table-column>
        <el-table-column property="caseName" label="案件名称"></el-table-column>
        <el-table-column property="droitNumber" label="权利号"></el-table-column>
        <el-table-column property="applicantName" label="申请人"></el-table-column>
        <el-table-column property="custName" label="客户名称"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogcheckChongTuVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogcheckChongTuBtn">确 定</el-button>
      </div>
    </el-dialog>
    </div>
</template>
<script>
  import {preCaseApproval,queryDeliver,preSubmit,passOrReturn,queryAuditUserList,queryMaterialTypeByDocId, queryMaterialByCaseIdUrl,queryCustomerNameId} from '@/api/caseList'
  import { queryCustGroup } from "@/api/customerList.js";
  import { creatematerialUrl } from '@/api/serviceApi.config.js'
  import getPageTitle from '@/utils/get-page-title'
  import { delCaseMaterialUrl } from "@/api/caseDetail";
  import { mapGetters } from 'vuex'
  import { getProgID } from '@/utils/editInOffice.js'

export default {
  name: "preFilingPush",
  data() {
    return {
      gridData: [],
      dialogcheckChongTuVisible: false,
      rules: {
        auditUserIds: [
          { type:'array', required: true, message:'请选择审批人', trigger: 'change' },
        ],
      },
      update: true,
      formData:{auditUserIds:[],auditNote:'',appNote:'' },
      queryDeliverList:[],
      submitData:{
        appNote:'',
        auditUserIds:[],
        audit:1,
        taskId:this.$route.query.taskId,
        userId:this.$store.getters.userId
      },
      isYunFen: false,
      curUploadTitle: '',
      typeNameList: [],
      creatematerialUrl,
      materialList: [],
      custInfo:{}
    }
  },
  computed: {
    tmCaseTypeList() {
        return this.$store.getters.tmCaseTypeList
    },
    ...mapGetters(["token", "name", "userId"])
  },
  created() {
    this.preCaseApproval(),
    this.queryCustGroup(),
    this.queryMaterialTypeByDocId()
  },
  methods:{
    materialData(materialTypeId, typeName) {
      let data = {
        tokenID: this.token,
        caseIds: this.formData.caseIds,
        type: "1",
        docName: typeName,
        materialTypeId: materialTypeId
      };
      return data;
    },
    preView(data) {
      let url = data.address
      if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
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
      } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
        window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
      } else {
        this.downLoad(data)
      }
    },
    downLoad(data) {
      const url = data.address
      const downData = {
        url: `${url}`,
      }
      if (data.mailId) {
        downData.downLoad = data.materialName
      }
      this.$commonUtils.downLoadAll(downData)
    },
    queryMaterialByCaseIdUrl() {
      queryMaterialByCaseIdUrl({caseIds: this.formData.caseId}).then(res => {
        if(res.data) {
          this.materialList = res.data[0].materialArray
        }
      })
    },
    queryCustomerNameId() {
      queryCustomerNameId({custIdArray:this.custInfo.custId}).then(res => {
        if(res.data) {
          this.custInfo = res.data[0]
        }
      })
    },
    queryCustGroup() {
      queryCustGroup({userId: this.userId}).then(res => {
        this.isYunFen = res.data['isYunFen'] == 1
      })
    },
    queryMaterialTypeByDocId() {
      queryMaterialTypeByDocId({ taskType: this.$route.query.taskType, doctId: 7, preCase: 1 }).then(res => {
        this.typeNameList = this.typeNameList.concat(res.data)
      })
      queryMaterialTypeByDocId({ taskType: this.$route.query.taskType, doctId: 6, preCase: 1 }).then(res => {
        this.typeNameList = this.typeNameList.concat(res.data)
      })
    },
    beforeRemoveFile(file, fileList) {
      let delmaterialId
      if (file.response) {
        delmaterialId = file.response.data[0].materialId
      } else {
        delmaterialId = file.materialId
      }
      if (delmaterialId) {
        delCaseMaterialUrl({
          caseIdArray: this.submitData.caseId,
          materialId: delmaterialId
        }).then(res => {
          this.$message.success(res.message)
          this.materialList = fileList.map(item => {
            if (item.materialId) {
              return item.materialId
            } else {
              return item.response.data[0].materialId
            }
          })
          if (fileList.length > 0) {
            this.filemessage = true
          } else {
            this.filemessage = false
          }
        })
      }
    },
    preCaseApproval(){
      const data={
        userId: this.$store.getters.userId,
        taskId: this.$route.query.taskId,
        taskType:this.$route.query.taskType
      }
      preCaseApproval(data).then(res=>{
          if(res.data.data){
            res.data.appNote=res.data.data.appNote
            res.data.auditId=res.data.data.auditId
            res.data.submitDate= new Date(res.data.data.submitDate).toLocaleDateString()
            res.data.auditNote=res.data.data.auditNote
            res.data.submitUser=res.data.data.submitUser
            res.data.submitUserId=res.data.data.submitUserId
            this.formData.auditUserIds=res.data.data.auditUserId?[res.data.data.auditUserId]:[]
            delete res.data.data
          }
          this.formData=Object.assign(this.formData,JSON.parse(JSON.stringify(res.data)))
          this.$forceUpdate()
          this.submitData.caseId=res.data.caseId
          this.custInfo.custId = res.data.custId
          this.queryDeliver()
          this.queryMaterialByCaseIdUrl()
          this.queryCustomerNameId()
      })
    },
    queryDeliver() {
      queryAuditUserList({caseId:this.submitData.caseId}).then(res => {
          this.queryDeliverList = res.data
      })
    },
    checkChongTuSet (chongData, type, forwordType) {
      this.gridData = chongData;
      this.dialogcheckChongTuVisible = true;
    },
    dialogcheckChongTuBtn () {
      this.preSubmit(0, 0)
      this.dialogcheckChongTuVisible = false;
    },
    preSubmit(checkCase, checkChongTu = 1) {
      this.$refs['preFilingPushForm'].validate(valid => {
        if (valid) {
          this.submitData.audit = 1
          this.submitData.taskId = this.$route.query.taskId
          this.submitData.auditUserIds = this.formData.auditUserIds
          this.submitData.appNote = this.formData.appNote
          this.submitData.checkCase = 0
          this.submitData.checkChongTu = 0
          this.submitData.taskType=this.$route.query.taskType,
          preSubmit(this.submitData).then(res => {
            if(res.messageType==-6){
              this.$confirm(res.message+' 是否继续提交', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.preSubmit(0)
              })
              return
            }
            if(res.messageType==10){
              this.checkChongTuSet(res.data, "", "");
              return
            }
            this.$router.replace('/workbench/toDoTask')
          }).catch(err=>{

          })
          return ;
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    passOrReturn(result) {
      const data = {
        taskId: this.$route.query.taskId,
        userId: this.$store.getters.userId,
        result,
        taskType:this.$route.query.taskType,
        caseId: this.formData.caseId,
        tmCaseId: this.formData.tmCaseId,
        auditUserId: this.$store.getters.userId,
        auditId: this.formData.auditId,
        auditNote: this.formData.auditNote,
        draftNumber: this.formData.agentNum,
        submitUserId: this.formData.submitUserId
      }
      passOrReturn(data).then(res => {
        if (res.success) {
          this.$router.replace('/workbench/toDoTask')
        }
      })
    },
    filingOperation(commond) {
      if (commond === 'prefiling') {
        this.$router.push({ path: '/workbench/case/preFilingPush/1', query: { taskId: this.$route.query.taskId ,taskType:this.$route.query.taskType}})
      }
    },
    cancel() {
      this.$router.history.go(-1)
    }
  },
  beforeRouteEnter: (to, from, next) => {
    switch (to.params.type) {
      case '2' :document.title = getPageTitle(to.meta.title = '预立卷审批'); break
      case '3' :document.title = getPageTitle(to.meta.title = '预立卷审批退回'); break
    }
    next(res => {
    });
  },
  watch:{
    'formData.auditUserIds'(n){
      this.update = false
      this.$nextTick((res)=>{
        this.update =true
      })
    }
  }

}
</script>

<style lang="scss" scoped>
  header{
    height: 62px;
    line-height:62px;
    font-size:22px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(51,51,51,1);
    padding-left: 20px;
    //border-bottom:1px solid #D4D5D5 ;
  }
  .el-row{
    display: flex;
    align-items: center;
  .el-form-item{
    border: 1px solid #EBEEF5;
    background: #f5f7fa;
  /deep/ .el-form-item__content{
    padding-left: 10px;
    background: #fff;
    width: 738px;
  }

  }
  .small-el-form-item{
  /deep/ .el-form-item__content{
    width: 265px;
  .pad20{
    padding-left: 20px;
  }
  }
  }
  }
  .el-form{
    border: 1px solid #99a9bf;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
    margin:0 20px ;
  }
  .button_wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    .el-button{
          margin-left: 30px;
        }
  }
  .require /deep/ .el-form-item__label:before{
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
  .clickable{
    cursor: pointer;
    color: #409EFF;
  }
</style>
