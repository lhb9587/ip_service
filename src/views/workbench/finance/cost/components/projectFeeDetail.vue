<template>
  <div style="display:flex;" class="feeDetail">
    <div class="addFeeDetail">

      <div style="display: flex;justify-content: space-between">

        <h4 class="title">费用明细</h4>
        <div>
        <el-button  type="primary" size="small" @click="submitData.feeDetails.push({})">增加</el-button>
      </div>
      </div>
      <el-table :data="submitData.feeDetails" border class="el-table1" style="width: 99%">
        <el-table-column  label="费用类型" width="360">
          <template slot-scope="{row}">
            <el-cascader
              :disabled="isCn"
              v-model="row.feetIdList"
              filterable
              clearable
              :emitPath="false"
              :change-on-select="true"
              :show-all-levels="true"
              :options="feeTypeList"
              :props="defaultParams"
              placeholder="请选择"
              @change="(e)=>catchange(row)"
            ></el-cascader>
          </template>
        </el-table-column>
        <el-table-column  label="费用名" >
          <template slot-scope="{row}">
            <el-input  :disabled="isCn" type="text" v-model="row.feeName"></el-input>
          </template>
        </el-table-column>
        <el-table-column  label="金额" >
          <template slot-scope="{row}">
            <el-input  :disabled="isCn" type="number" v-model="row.amount"></el-input>
          </template>
        </el-table-column>
        <el-table-column  label="收款对方名称" >
          <template slot-scope="{row}">
            <el-input  :disabled="isCn" type="text" v-model="row.receiverName"></el-input>
          </template>
        </el-table-column>
        <el-table-column  label="费用描述" width="200">
          <template slot-scope="{row}">
            <el-input  :disabled="isCn" type="textarea" autosize v-model="row.feeDesc"></el-input>
          </template>
        </el-table-column>
        <el-table-column  label="操作" >
          <template slot-scope="scope">
            <el-button  :disabled="isCn" type="text" @click="submitData.feeDetails.splice(scope.$index,1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;width:100%">
        <span>总金额：</span><span>{{totalSum|formatAmount}}</span>
      </div>
      <h4 class="title">费用基础信息</h4>
      <el-form label-width="206px" :model="submitData" :rules="rules" style="width: 99%" ref="ruleForm">
        <el-row >
          <el-form-item label="项目名称:" >
            {{this.$commonUtils.transformation(projectList,projectId,'projectId','prjName')}}
<!--            <el-select v-model="submitData.projectId"  :clearable="true" default-first-option filterable placeholder="请选择">-->
<!--              <el-option  v-for="(item,key) in projectList"   :key="item.projectId" :label="item.prjName" :value="item.projectId"/>-->
<!--            </el-select>-->
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="客户:" >
            <el-select  :disabled="isCn"  v-model="submitData.custId" filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
                remoteMethod(queryString);
                }">
              <el-option v-for="itm in custList" :key="itm.custId" :label="itm.name" :value="itm.custId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费用状态:" >
            {{submitData.wfStatus}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发生日期:" prop="beginDate">
            <el-date-picker
              :disabled="isCn"
              v-model="submitData.beginDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期:" prop="endDate">
            <el-date-picker
              :disabled="isCn"
              v-model="submitData.endDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="报销人:" prop="reimburseUserId">
            <el-select  :disabled="isCn"  v-model="submitData.reimburseUserId" filterable  clearable reserve-keyword placeholder="请选择报销人" @change="changeReibuserUserId">
              <el-option v-for="itm in userList" :key="itm.userId" :label="itm.fullname" :value="itm.userId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费用承担工作组:" prop="costWkgId">
            <el-select  :disabled="isCn" v-model="submitData.costWkgId" filterable  clearable reserve-keyword placeholder="请选择工作组" >
              <el-option v-for="itm in workgroupNamesList" :key="itm.wkgId" :label="itm.groupName" :value="itm.wkgId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="报销人所属工作组:" >
            <el-select  :disabled="isCn" v-model="submitData.reimburseWkgId" filterable  clearable reserve-keyword placeholder="请选择工作组" >
              <el-option v-for="itm in workgroupNamesList" :key="itm.wkgId" :label="itm.groupName" :value="itm.wkgId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门:" >
            <el-select  :disabled="isCn" v-model="submitData.deptId" filterable  clearable reserve-keyword placeholder="请选择部门" >
              <el-option v-for="itm in deptByConditionList" :key="itm.deptId" :label="itm.name" :value="itm.deptId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="支付公司:" prop="paymentDeptId">
            <el-select  :disabled="isCn" @change="queryPayMode" v-model="submitData.paymentDeptId" filterable  clearable reserve-keyword placeholder="请选择支付公司" >
              <el-option v-for="itm in companyList" :key="itm.deptId" :label="itm.companyShortName" :value="itm.deptId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式:" prop="payType">
            <el-select   v-model="submitData.payType" filterable  clearable reserve-keyword placeholder="请选择方式" >
              <el-option v-for="itm in payTypeList" :key="itm.payMode" :label="itm.payMode" :value="itm.payMode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.payType">
          <el-form-item label="具体付款方式:" prop="specificPayType" v-show="submitData.payType.includes('银行')">
            <el-select  :disabled="isCn"  v-model="submitData.specificPayType" filterable  clearable reserve-keyword placeholder="请选择方式" >
              <el-option v-for="itm in querySpecificPayTypeList" :key="itm.typeName" :label="itm.typeName" :value="itm.typeName">
              </el-option>
            </el-select>
          </el-form-item>
          <!--          <template v-else>-->
          <el-form-item label="具体付款方式:"  v-show="!submitData.payType.includes('银行')">
            <el-select  :disabled="isCn"  v-model="submitData.specificPayType" filterable  clearable reserve-keyword placeholder="请选择方式" >
              <el-option v-for="itm in querySpecificPayTypeList" :key="itm.typeName" :label="itm.typeName" :value="itm.typeName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="后期提供发票:" prop="invoiceLater">
            <el-select @change="changeInvoicesWay" v-model="submitData.invoiceLater" filterable clearable reserve-keyword
                       placeholder="请选择方式">
              <el-option key="1" label="是" :value="1" />
              <el-option key="0" label="否" :value="0" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="苏总审批:" >
            <el-radio :disabled="isCn" v-model="submitData.suAudit" :label="0">否</el-radio>
            <el-radio  :disabled="isCn"  v-model="submitData.suAudit" :label="1">是</el-radio>
          </el-form-item>
          <el-form-item label="是否为差旅费:" >
            <el-radio  :disabled="isCn" v-model="submitData.travelExpenses" :label="0">否</el-radio>
            <el-radio  :disabled="isCn" v-model="submitData.travelExpenses" :label="1">是</el-radio>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="单据号:" >
            <el-input  :disabled="isCn" type="text" v-model="submitData.feeNo"></el-input>

          </el-form-item>
          <el-form-item label="所属月:" >
            <el-date-picker
              v-model="submitData.belongtoDate"
              align="right"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="上传文件:">
            <el-upload
              ref="upload"
              class="upload-demo"
              drag
              multiple
              name="attachFile"
              :data="uploadFileData"
              :action="creatematerial"
              :file-list="materialArray"
              :on-remove="handleRemove"
              :on-preview="onPreview"
              :on-success="onsuccess"
            >
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注:">
            <el-input
              :disabled="isCn"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5}"
              placeholder="请输入备注"
              v-model="submitData.remarks"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="填报人:" >
            <span>{{submitData.fillinUserIdStr?submitData.fillinUserIdStr:$store.getters.name}}</span>
            <span v-show="false">{{submitData.fillinUserId?submitData.fillinUserId:submitData.fillinUserId=$store.getters.userId}}</span>
          </el-form-item>
          <el-form-item label="填报日期:" >
            <el-date-picker
              :disabled="isCn"
              v-model="submitData.fillinDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="核销状态:" >
            <el-select   :disabled="isCn" v-model="submitData.tobillStatus" filterable  clearable reserve-keyword placeholder="请选择核销状态" >
              <el-option v-for="itm in [{id:1,value:'已核销'},
              {id:2,value:'延迟核销'},
              {id:3,value:'不开账单'},
              {id:0,value:'未核销'}]" :key="itm.id" :label="itm.value" :value="itm.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="核销日期:" >
            <el-date-picker
              :disabled="isCn"
              v-model="submitData.tobillDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="button_wrap" v-if="pageType==1">
        <el-button class="exactButton" type="primary" @click="updateFee" >保存</el-button>
        <el-button class="exactButton" type="primary" @click="submit">提交</el-button>
        <el-button class="exactButton" plain @click="cancel">取消</el-button>
      </div>
      <div class="button_wrap" v-if="pageType==2">
<!--        <el-button class="exactButton" type="primary" @click="submitFee(1)" v-if="submitData.taskNo==null">提交</el-button>-->
        <el-button class="exactButton" type="primary" @click="updateFee">修改</el-button>
        <el-button class="exactButton" plain @click="cancel">取消</el-button>

      </div>
      <div class="button_wrap" v-if="pageType==3">
        <template v-if="taskNo==1">
          <el-button class="exactButton" type="primary" @click="updateFee" >保存</el-button>
          <el-button class="exactButton" type="primary" @click="submit">提交</el-button>
          <el-button class="exactButton" plain @click="cancel">取消</el-button>
        </template>
        <template  v-if="taskNo!=1&&taskNo!=6">
          <el-button class="exactButton" type="primary" @click="submitFee(0)" >退回</el-button>
          <el-button class="exactButton" type="primary" @click="submitFee(1)">通过</el-button>
          <el-button class="exactButton" plain @click="cancel">取消</el-button>
        </template>
        <template  v-if="taskNo==6">
          <el-button class="exactButton" type="primary" @click="submitFee(1)">支付</el-button>
          <el-button class="exactButton" plain @click="cancel">取消</el-button>
        </template>
      </div>
    </div>
    <div class="TaskRecordWrap" v-if="pageType!=1">
      <TaskRecord :id="feeId"></TaskRecord>
    </div>
  </div>
</template>

<script>
  import {saveLog} from '@/api/systemList'
  import TaskRecord from '../../components/TaskRecord'

  import { queryCustomerNameId,queryProjectList,createFeeInProject} from '@/api/caseList'
  import { queryUsers, queryWorkgroupNames, queryDeptByCondition, queryUserById,queryWorkByUserId} from '@/api/systemList'
  import { createFee, queryFeeTypeList, submitFee, queryFeeInfo, updateFee, queryCompany, queryPayMode, createFeeInCase,deleteFee,querySpecificPayType,getCase} from "@/api/feeList";
  import { queryZZWorkGroupUrl ,disposeAgentNum} from "@/api/billApi";
  import {getMenuName,formatDate} from '@/utils'
  import {deleteMaterial} from "@/api/customerList";
  import {creatematerial} from "@/api/ipServiceApi.config";

  export default {
    name: "projectFeeDetail",
    props:{
      projectId:{    },
      pageType:{      } ,
      feeId:{},
      taskNo:{}
      },

    data(){
      return{
        isCn:this.pageType==2&&this.$store.getters.roles.map(item=>item.name).includes('现金出纳岗'),
        submitData:{
          invoiceLater: 0,
          projectId:this.projectId,
          belongtoDate:formatDate(new Date()),
          feeDetails:[],
          payType:'',
          deptId:'',
          tobillStatus:0,
          fillinDate:formatDate(new Date()),
          suAudit:0,
          travelExpenses:0,
          beginDate:'',
          endDate:'',
          reimburseUserId:'',
          costWkgId:'',
          reimburseWkgId:'',
          tobillDate:'',
          feeNo:'',
          paymentDeptId:'' ,
          specificPayType:'',
          caseArray:[],
          materialIdArray: []
        },
        projectList:[],
        materialArray: [],
        materialIdList: [],
        creatematerial,
        uploadFileData: {
          materialTypeId: 300014,
          tokenID: this.$store.getters.token
        },
        custList:[],
        agentNums:'',
        feeDetailList:[],
        caseData:[],
        tableTitleList:[{'title':'案件文号','value':'agentNum' },{'title':'客户','value':'custName' },{'title':'申请人','value':'appName'},{'title':'案件类型','value':'caseTypeStr'},{'title':'申请方向','value':'appFromto'},{'title':'权利号','value':'droitNumber'},{'title':'案件状态','value':'status'},{'title':'案件名称','value':'caseName'},{'title':'商标类别','value':'goodClasses'}],
        feeTypeList:[],
        userList:[],
        caseState:false,
        workgroupNamesList:[],
        deptByConditionList:[],
        companyList:[],
        payTypeList:[],
        hasCaseList:[200,199,251,203,213,212,211,215,216,214,186,182,191,259,185,192,193,194,188,187,189,190,184,183,180,223,224],
        noCaseList:[218,205,255,249,237,207,254,206,225,208,238,262,260,201,204,261,222],
        querySpecificPayTypeList:[],
        defaultParams:{
          value: 'feetId',
          label: 'feeName',
          checkStrictly: true,
          children: 'feeTypes'
        },
        selectCaseVisible:false,
        changeCaseVisible:false,
        selectCaseList:[],
        rules:{
          invoiceLater: [{required: true, message: '请填写是否【后期提供发票】', trigger: 'blur'}],
          beginDate:[{required: true, message: '请选择发生日期', trigger: 'blur' }],
          endDate:[{required: true, message: '请选择结束日期', trigger: 'blur' }] ,
          reimburseUserId:[{required: true, message: '请选择报销人', trigger: 'blur' }],
          costWkgId:[{required: true, message: '请选择费用承担工作组', trigger: 'blur' }],
          paymentDeptId:[{required: true, message: '请选择支付公司', trigger: 'blur' }],
          payType:[{required: true, message: '请选择支付方式', trigger: 'blur' }],
          specificPayType:[{required: true, message: '请选择具体方式', trigger: 'blur' }]
        }
      }
    },
    async created(){
      setTimeout(()=>{
        this.queryUsers()
      })
      this.queryProjectList()
      this.queryDeptByCondition()
      this.queryCompany()
      this.queryWorkgroupNames()
      console.log(this.pageType);
      if(this.pageType==1){
        this.querySpecificPayType()
        this.submitData.feeDetails.push({})
        this.queryFeeTypeList().then(res=>{
          this.feeTypeList=res.data
          this.feeTypeList = this.$commonUtils.cascaderDisabled(this.feeTypeList, 'feeTypes', 'isUse')
        })
      }else{
        let res= await  this.queryFeeTypeList()
        this.feeTypeList=res.data
        console.log(5666);
        this.queryFeeInfo()
      }
    },
    methods:{
      // 更改后期提供发票方式
      changeInvoicesWay(n) {
        if (n == 1){
          this.submitData.feeDetails.forEach(item => {
            this.$set(item, 'noInv', 0)
            this.$set(item, 'invIds', [])
            this.$set(item, 'invoices', [])
          })
        }
      },
      getUploadData(caseIds) {
        const data = {
          tokenID: this.$store.getters.token
        }
        return data
      },
      queryProjectList(){
        queryProjectList().then(res=>{
            this.projectList=res.data})
      },
      handleRemove(file, fileList, caseId) {
        let delmaterialId;
        if (file.response) {
          delmaterialId = file.response.data[0].materialId;
        } else {
          delmaterialId = file.materialId;
        }
        deleteMaterial({ materialId: delmaterialId}).then(res => {
          this.materialIdList.splice(this.materialIdList.indexOf(delmaterialId),1)
        })
      },
      onPreview(file) {
        var a = document.createElement('a')
        a.setAttribute('href', '/ipdoc' + file.address)
        a.setAttribute('id', 'startTelMedicine')
        a.setAttribute('target', '_blank')
        if(document.getElementById('startTelMedicine')) {
          document.body.removeChild(document.getElementById('startTelMedicine'))
        }
        document.body.appendChild(a)
        a.click()
      },
      onsuccess(res, file, fileList) {
        this.materialIdList.push(res.data[0].materialId)
      },
      getList(list){
        console.log(list);
        if(list.length){
          this.submitData.caseIds=list.map(item=>item.caseId)
          this.submitData.caseArray=list
          this.submitData.custId=list[0].custId
          this.$set(this,'custList', [{custId:list[0].custId,name:list[0].custName}])
          disposeAgentNum({agentNumberArray:list.map(item=>item.agentNum)}).then(res=>{
            this.submitData.showRefno = res.data
            this.submitData.caseName = list[0].caseName
          })
        }else {
          this.submitData.showRefno=''
          this.submitData.caseName = ''
          this.submitData.caseIds=null
        }
      },
      getCase(){
        getCase({agentNums:this.agentNums}).then(res=>{
          this.caseData=res.data
          if(res.data&&res.data.length){
            this.submitData.custId=res.data[0].custId
            queryCustomerNameId({custId: this.submitData.custId}).then(res=>{
              this.$set(this,'custList', res.data)
            })
            this.submitData.costWkgId=res.data[0].costWkgId
            this.submitData.deptId=res.data[0].deptId
            // this.submitData.paymentDeptId=res.data[0].paymentDeptId
          }
        })
      },
      querySpecificPayType(){
        querySpecificPayType({feeId:this.submitData.feeId}).then(res=>{
          this.querySpecificPayTypeList=res.data
        })
      },
      catchange(row){
        row.feetId=row.feetIdList[row.feetIdList.length-1]
        // row.feeName=getMenuName(this.feeTypeList, 'feeTypes').find(item => item.feetId == row.feetId).feeName
      },
      takeCaseDetail(row) {
        if (row.caseArray&&row.caseArray.length > 1) {
          this.selectCaseList = row.caseArray;
          this.selectCaseVisible = true;
        } else {
          if(!row.caseId){
            this.takeCaseDetail(row.caseArray[0])
          } else {
            this.$commonUtils.takeCaseDetail(row,this)
            // window.open(`#/workbench/case/seeCaseDetail/${row.caseId}?taskType=${row.taskType}`)
          }

          // this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId);
          // this.selectCaseVisible = false;
        }
      },
      queryFeeInfo(){
        queryFeeInfo({feeId:this.feeId}).then(res=>{
          if(res.data.caseIds&&res.data.caseIds.length==0){
            res.data.caseIds = null
          }

          this.submitData=res.data
          this.submitData.projectId=this.projectId
          this.materialArray = this.submitData.materialArray
          this.materialArray.forEach(item => {
            item.name = item.materialName
          })
          this.materialIdArray = this.materialArray.map(item=>item.materialId)
          this.defaultSubmitData = JSON.parse(JSON.stringify(res.data))
          this.queryPayMode()
          this.querySpecificPayType()
          this.submitData.feeDetails.forEach(item=>{
            item.feetIdList = this.$commonUtils.getTwoDimensionalArray( this.feeTypeList, 'feetId', item.feetId, {children:'feeTypes'})

          })
          if(this.submitData.custId){
            queryCustomerNameId({custId: this.submitData.custId}).then(res=>{
              this.$set(this,'custList', res.data)
            })
          }
        })
      },
      queryFeeTypeList(){
        return queryFeeTypeList()
      },
      remoteMethod(value){
        queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value }).then(
          res => {
            this.custList=res.data
          }
        );
      },
      queryCompany(){
        queryCompany().then(res=>{
          this.companyList=res.data
          if(this.$route.params.pageType==1){
            let data= this.companyList.find(item=>item.companyShortName==this.$store.getters.corporationName)
            if(data){
              this.submitData.paymentDeptId = data.deptId

            }
            this.queryPayMode(this.submitData.paymentDeptId)
          }

        })
      },
      queryUsers(){
        // queryUsers({pageNo:1,pageSize:10000}).then(res=>{
        //
        // })
        this.userList = this.$store.getters.userList
        if(this.pageType == 1){
          this.submitData.reimburseUserId = this.$store.getters.userId
          this.submitData.endDate = this.$commonUtils.formatDate(new Date())
          this.changeReibuserUserId(this.submitData.reimburseUserId)
        }
      },
      queryFeeTaskDefine(){

      },
      queryWorkgroupNames(){
        queryZZWorkGroupUrl().then(res=>{
          this.workgroupNamesList=res.data
          if(this.$route.params.pageType==1&&!this.$route.query.agentNums){
            this.queryWorkByUserId()
          }
        })
      },
      ruleCaseFee(){
        if(this.submitData.payType&&this.submitData.payType.includes('银行')){
          this.rules.specificPayType[0].required=true
        }else {
          this.rules.specificPayType[0].required=false
        }
        // return true
        if(this.pageType==1){
          if(this.$commonUtils.getLanglist(this.submitData.feeDetails.map(item=>item.feetIdList)).includes(229)&&!this.caseData.length){
            this.$message.error('案内费用必须添加案件')
            return false
          }
          if(this.$commonUtils.getLanglist(this.submitData.feeDetails.map(item=>item.feetIdList)).includes(228)&&this.caseData.length){
            this.$message.error('日常费用不能添加案件')
            return false
          }
          let arr= this.$commonUtils.getLanglist(this.submitData.feeDetails.map(item=>item.feetIdList))
          if(this.noCaseList.some(item=> arr.includes(item))&&this.caseData.length){
            this.caseState=true
            this.$message.error('该垫款事项不能添加案件')
            return false
          }
          if(this.hasCaseList.some(item=> arr.includes(item))&&!this.caseData.length){
            this.$message.error('该垫款事项必须添加案件')
            return false
          }

          return true
        } else {
          if(this.$commonUtils.getLanglist(this.submitData.feeDetails.map(item=>item.feetIdList)).includes(229)&&!this.submitData.caseIds){
            this.caseState=true
            this.$message.error('案内费用必须添加案件')
            return false
          }
          if(this.$commonUtils.getLanglist(this.submitData.feeDetails.map(item=>item.feetIdList)).includes(228)&&this.submitData.caseIds){
            this.caseState=true
            this.$message.error('日常费用不能添加案件')
            return false
          }
          let arr= this.$commonUtils.getLanglist(this.submitData.feeDetails.map(item=>item.feetIdList))
          if(this.noCaseList.some(item=> arr.includes(item))&&this.submitData.caseIds){
            this.caseState=true
            this.$message.error('该垫款事项不能添加案件')
            return false
          }
          if(this.hasCaseList.some(item=> arr.includes(item))&&!this.submitData.caseIds){
            this.caseState=true
            this.$message.error('该垫款事项必须添加案件')
            return false
          }
          return true
        }//
      },
      changeReibuserUserId(e){
        queryWorkByUserId({userId:e}).then(res=>{
          if(res.data.groups&&res.data.groups.length){
            // this.submitData.costWkgId= res.data.groups[0].wkgId
            this.submitData.reimburseWkgId=res.data.groups[0].wkgId
          }
        })
      },
      queryWorkByUserId(){
        // queryWorkByUserId({userId:this.$store.getters.userId}).then(res=>{
        //   if(res.data.groups&&res.data.groups.length){
        //    this.submitData.costWkgId= res.data.groups[0].wkgId
        //     this.submitData.reimburseWkgId=res.data.groups[0].wkgId
        //   }
        // })
        queryUserById(this.$store.getters.userId).then(res=>{
          if(res.data.user){
            this.submitData.deptId =res.data.user.deptId
          }
          if(res.data.groups&&res.data.groups.length){
            if(res.data.groups&&res.data.groups.length){
              this.submitData.costWkgId= res.data.groups[0].wkgId
              // this.submitData.reimburseWkgId=res.data.groups[0].wkgId
            }
          }
        })
      },
      queryDeptByCondition(){
        queryDeptByCondition({isactive:1}).then(res=>{
          this.deptByConditionList=res.data
        })
      },
      queryPayMode(e){
        if(e){
          this.submitData.payType=''
        }

        if(this.submitData.paymentDeptId){
          queryPayMode({deptId:this.submitData.paymentDeptId}).then(res=>{
            this.payTypeList=res.data
          })
        }else{
          this.payTypeList=[]
        }
      },
      async submit(){
        this.submitData.materialIdArray = this.materialIdList
        delete this.submitData.materialArray
        if(!this.ruleCaseFee()){
          return
        }
        const [ err, data] = await this.$commonUtils.awaitWrap(this.$refs.ruleForm.validate())
        if (!data) {
          this.$message.error('请填写必填项')
          return
        }
        if(!this.submitData.feeId){
          this.submitData.projectIdList=[this.submitData.projectId]
          createFeeInProject({projectIdList: this.submitData.projectIdList}).then(res=>{
            this.submitData.taskIdList=res.data[0].taskId
            this.submitData.taskId=res.data[0].taskId
            this.submitData.feeId=res.data[0].feeId
            this.submitData.caseIds=this.caseData.map(item=>item.caseId)
            this.submitData.feeDetails.forEach(item=>{
              item.feeId=this.submitData.feeId
              delete item.feetIdList
            })
            submitFee(this.submitData).then(Response=>{
              this.successed()
            }).catch((e)=>{
              if(e.messageType==-4){
                return
              }else {
                this.successed()
              }
              saveLog({content:JSON.stringify({feeId:this.submitData.feeId,message:'费用审核报错'+e.message,logType:1})}).then(res=>{


              })
            })
          }).catch((e)=>{
            if(e.messageType==-4){
              return
            }else {
              this.successed()
            }
            saveLog({content:JSON.stringify({feeId:this.submitData.feeId,message:'费用审核报错'+e.message,logType:2})}).then(res=>{


            })
          })
        }
      },
      async submitFee(result){
        this.submitData.materialIdArray = this.materialIdList
        delete this.submitData.materialArray
        if(!this.ruleCaseFee()){
          return
        }
        if(result){

          const [ err, data] = await this.$commonUtils.awaitWrap(this.$refs.ruleForm.validate())
          if (!data) {
            this.$message.error('请填写必填项')
            return
          }
        }
        this.submitData.taskIdList= this.submitData.taskId
        this.submitData.result=result
        this.submitData.feeDetails.forEach(item=>{
          item.feeId=this.submitData.feeId
          delete item.feetIdList
        })
        submitFee(this.submitData).then(Response=>{
          this.successed()
        }).catch((e)=>{
          if(e.messageType==-4){
            return
          }else {
            this.successed()
          }
          saveLog({content:JSON.stringify({feeId:this.submitData.feeId,message:'费用审核报错'+e.message,logType:7})}).then(res=>{


          })

        })
      },
      async  updateFee(){
        this.submitData.materialIdArray = this.materialIdList
        delete this.submitData.materialArray
        if(!this.ruleCaseFee()){
          return
        }
        const [ err, data] = await this.$commonUtils.awaitWrap(this.$refs.ruleForm.validate())
        if (!data) {
          this.$message.error('请填写必填项')
          return
        }
        if(this.pageType==1&&!this.submitData.feeId){
          this.submitData.projectIdList=[this.submitData.projectId]
          createFeeInProject({projectIdList: this.submitData.projectIdList}).then(res=>{
              this.submitData.taskIdList=res.data[0].taskId
              this.submitData.feeId=res.data[0].feeId
              this.submitData.caseIds=this.caseData.map(item=>item.caseId)
              this.submitData.feeDetails.forEach(item=>{
                item.feeId=this.submitData.feeId
                delete item.feetIdList
              })
              if(!this.submitData.travelExpenses && this.submitData.feeDetails.length&&this.submitData.feeDetails.find(item => [137,139,140,156,158,159].includes(item.feetId))){
                this.$confirm('是否为差旅费',
                    "提示",
                    {
                      confirmButtonText: "是",
                      cancelButtonText: "否",
                      type: "warning"
                    }
                  ).then(() => {
                    this.submitData.travelExpenses = 1
                    updateFee(this.submitData).then(Response=>{
                      this.successed()
                    })
                  }).catch((err)=>{
                    updateFee(this.submitData).then(Response=>{
                      this.successed()
                    })
               })
              }else{
                updateFee(this.submitData).then(Response=>{
                  this.successed()
                })
              }

            }).catch((e)=>{
              if(e.messageType==-4){
                return
              }else {
                this.successed()
              }
              saveLog({content:JSON.stringify({feeId:this.submitData.feeId,message:'费用审核报错'+e.message,logType:8})}).then(res=>{


              })

            })

        }else{
          this.submitData.taskIdList=this.submitData.taskId
          this.submitData.feeDetails.forEach(item=>{
            item.feeId=this.submitData.feeId
            delete item.feetIdList
          })
          if(!this.submitData.travelExpenses && this.submitData.feeDetails.length&&this.submitData.feeDetails.find(item => [137,139,140,156,158,159].includes(item.feetId))){
            this.$confirm('是否为差旅费',
                "提示",
                {
                  confirmButtonText: "是",
                  cancelButtonText: "否",
                  type: "warning"
                }
              ).then(() => {
                this.submitData.travelExpenses = 1
                updateFee(this.submitData).then(Response=>{
                  this.successed()
                })
              }).catch((err)=>{
                updateFee(this.submitData).then(Response=>{
                  this.successed()
                })
           })
          }else{
            updateFee(this.submitData).then(Response=>{
              this.successed()
            })
          }
        }
      },
      successed(){
        this.$message.success('操作成功')
        this.cancel(true)
      },
      cancel(flag){
        this.$emit('cancel',flag)
      }

    },
    watch:{
      totalSum(n){
        this.submitData.total= n
      }
    },

    computed:{
      totalSum(){
        let amountList= this.submitData.feeDetails.map(item=>item.amount).filter(item=>!!item)
        if(amountList.length==0){
          return 0.00
        }
        if(amountList.length==1){
          return amountList[0]
        }else {
          return this.submitData.feeDetails.map(item=>item.amount).filter(item=>!!item).reduce((pre,next)=>{
            return Number(pre)+Number(next)
          })
        }

      }
    },
    components:{
      TaskRecord
    }
  }
</script>

<style lang='scss' scoped>
  aside{
    &>div{
      display: flex;
      align-items: center;
      .el-textarea{
        width: 80%;
      }
      .el-button{
        margin-left: 20px;
        width: 67px;
        height: 32px;
        padding: 0;
        color: #409EFF;
        border: 1px solid #409EFF;
      }
    }
    span{
      display: block;
      margin: 10px 0;
      font-size: 12px;
      color: #FB9608;
    }

  }
  .title{
    font-size: 16px;
    color: #6AA7FF;
    height: 32px;
    line-height: 32px;
    font-weight: normal;
  }
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
        border-bottom: 0;
        margin-bottom: 0;
        /deep/ .el-form-item__label{
          background: #f5f7fa;
        }
        /deep/ .el-form-item__content{
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
        }
      }}
  }
  .button_wrap {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
    .el-button{
      margin-left: 30px;
    }
  }
  .addFeeDetail{
    /*padding: 20px;*/
    flex: 1;
  }
  .TaskRecordWrap{
    margin-top:20px ;
    width:200px;
  }
  .el-cascader{
    width: 100%;
  }
  /deep/ .el-upload-dragger{
    height:70px
  }
</style>
