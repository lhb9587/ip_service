<template>
  <div style="display:flex;" class="feeDetail">
    <div class="addFeeDetail">
      <h4 class="title">费用明细</h4>
      <el-table :data="submitData.feeDetails" border class="el-table1" style="width: 99%">
        <el-table-column  label="费用类型" width="330">
          <template slot-scope="{row}">
            <!--          <el-cascader-->
            <!--            v-model="row.feetIdList"-->
            <!--            filterable-->
            <!--            clearable-->
            <!--            :emitPath="false"-->
            <!--            :change-on-select="true"-->
            <!--            :show-all-levels="false"-->
            <!--            :options="feeTypeList"-->
            <!--            :props="defaultParams"-->
            <!--            placeholder="请选择"-->
            <!--            @change="(e)=>catchange(row)"-->
            <!--          ></el-cascader>-->
            {{row.feetName}}
          </template>
        </el-table-column>
        <el-table-column  label="费用名" >
          <template slot-scope="{row}">
            {{row.feeName}}
          </template>
        </el-table-column>
        <el-table-column  label="金额" >
          <template slot-scope="{row}">
            {{row.amount}}
          </template>
        </el-table-column>
        <el-table-column  label="发票金额" width="300">
          <template slot-scope="{row}">
            <div v-for="inv in row.invoices" :key="inv.invId">
              <p>
                <span :class="inv.invStatus==0? 'del_line' : inv.invPath ? 'invoice-fpgl' : ''" :title="inv.invStatus==0?'发票不可用':''" @click="preView(`${inv.invPath}`) ">No.{{ inv.invoiceNum }}</span>
                <el-tooltip :disabled="!inv.veriCode!=0" effect="light" :content="inv.veriMessge" placement="top">
                  <i v-if="inv.veriCode!=0" :style="'cursor: pointer;'+ (inv.veriCode == -1 ? 'color:#ebbb35' : inv.veriCode == -11 ? 'color:#02c348' : 'color:red')" class="el-icon-warning"></i>
                </el-tooltip>
                <span :class="{'invoice-date-warning': isInvoiceDateWarning(inv.invoiceDate)}">{{ inv.invoiceDate }}</span>
                <span :class="inv.invStatus==0? 'del_line' : ''">￥{{ inv.amountInFiguers }}</span>
              </p>
            </div>
            <div v-if="row.noInv == 1">
              <el-checkbox :disabled="true" label="无需关联发票" v-model="row.noInv" name="type" :true-label="1"
                           :false-label="0"></el-checkbox>
              <el-tooltip class="item" effect="light" placement="top-start">
                <div slot="content"><div style="margin-top: 1px">无需查验票包括以下类型：</div><br/>定额发票、卷联打车票、蓝联机票行程单、火车票、客户抬头票、财政部监制的非税收入票<br/></div>
                <i class="el-icon-info" style="cursor: pointer"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column  label="收款对方名称" >
          <template slot-scope="{row}">
            {{row.receiverName}}
          </template>
        </el-table-column>
        <el-table-column  label="费用描述" >
          <template slot-scope="{row}">
            {{row.feeDesc}}
          </template>
        </el-table-column>
        <el-table-column  label="财务描述" v-if="isFinStaff">
          <template slot-scope="{row}">
            {{row.financialDesc}}
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;width:100%">
        <span>总金额：</span><span>{{totalSum|formatAmount}}</span>
        <span>发票总金额：</span><span>{{invoiceTotalSum|formatAmount}}</span>
      </div>
      <h4 class="title">费用基础信息</h4>
      <el-form label-width="150px" style="width: 99%">
        <el-row>
          <el-form-item label="案件文号:" >
            {{submitData.showRefno}}
          </el-form-item>
          <el-form-item label="案件名称:" >
            {{submitData.caseName}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="项目名称:" >
            {{submitData.prjName}}
          </el-form-item>
          <el-form-item label="合同号/名称:" >
            {{submitData.contractNo || '-'}} / {{ submitData.contractName || '-' }}
            <span v-if="submitData.contractId" class="el-icon-paperclip" style="color: #409EFF;cursor: pointer;" @click="viewContractFile"></span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="客户:" >
            {{submitData.custIdStr}}
          </el-form-item>
          <el-form-item label="费用状态:" >
            {{submitData.wfStatus}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发生日期:" >
            {{submitData.beginDate}}
          </el-form-item>
          <el-form-item label="结束日期:" >
            {{submitData.endDate}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="报销人:">
            {{submitData.reimburseUserIdStr}}
          </el-form-item>
          <el-form-item label="费用承担工作组:" >
            {{submitData.costWkgIdStr}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="报销人所属工作组:" >
            {{submitData.reimburseWkgIdStr}}
          </el-form-item>
          <el-form-item label="所属部门:" >
            {{submitData.deptIdStr}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="支付公司:" >
            {{submitData.paymentDeptIdStr}}
            <!--          <el-select  @change="queryPayMode" v-model="submitData.paymentDeptId" filterable  clearable reserve-keyword placeholder="请选择支付公司" >-->
            <!--            <el-option v-for="itm in companyList" :key="itm.deptId" :label="itm.companyShortName" :value="itm.deptId">-->
            <!--            </el-option>-->
            <!--          </el-select>-->
          </el-form-item>
          <el-form-item label="支付方式:" >
            {{submitData.payType}}
            <!--          <el-select   v-model="submitData.payType" filterable  clearable reserve-keyword placeholder="请选择方式" >-->
            <!--            <el-option v-for="itm in payTypeList" :key="itm.payMode" :label="itm.payMode" :value="itm.payMode">-->
            <!--            </el-option>-->
            <!--          </el-select>-->
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.payType">
          <el-form-item label="具体付款方式:" >
            {{submitData.specificPayType}}
          </el-form-item>
          <el-form-item label="后期提供发票:" >
            <span v-if='submitData.invoiceLater==0' >否</span>
            <span v-if='submitData.invoiceLater==1' >是</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="是否替票:" >
            <span v-if='submitData.suAudit==0' >否</span>
            <span v-if='submitData.suAudit==1' >是</span>
          </el-form-item>
          <el-form-item label="是否为差旅费:" >
            <span v-if='submitData.travelExpenses==0' >否</span>
            <span v-if='submitData.travelExpenses==1' >是</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="出差信息:" >
            <span>{{ submitData.btDesc }}</span>
            <span v-if="submitData.btId" @click="openBusinessTripDrawer" style="margin-left: 10px;color: #409EFF;cursor: pointer;">详情</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="单据号:" >
            {{submitData.feeNo}}
          </el-form-item>
          <el-form-item label="所属月:" >
            {{submitData.belongtoDate}}
          </el-form-item>
        </el-row>
        <el-row class="">
          <el-form-item label="上传文件:">
            <p v-for="item in materialArray">
              <span  class="itemTitle_style" @click="preView(`${item.address}`) ">{{item.name}}</span>
            </p>
          </el-form-item>
          <el-form-item label="诉讼费收据号:" v-if="['律所现金', '万慧达现金'].includes(submitData.payType) && submitData.feeDetails.find(item => item.feetId == 190 && (!item.invIds || item.invIds && !item.invIds.length))">
            {{submitData.lawsuitReceiptNo}}
          </el-form-item>
          <el-form-item label="诉讼费收据号:" v-if="isShowLitigFeeRecptNo">
            {{submitData.lawsuitReceiptNo}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注:">
            {{submitData.remarks}}
          </el-form-item>
        </el-row>
        <el-row v-if="isFinStaff">
          <el-form-item label="财务备注:">
            {{submitData.financialRemarks}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="填报人:" >
            <span>{{submitData.fillinUserIdStr}}</span>
          </el-form-item>
          <el-form-item label="填报日期:" >
            {{submitData.fillinDate}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="核销状态:" style="border-bottom: 1px solid #EBEEF5;">
            {{submitData.tobillStatusStr}}
          </el-form-item>
          <el-form-item label="核销日期:" style="border-bottom: 1px solid #EBEEF5;">
            {{submitData.tobillDate}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="财务负责人加审:" style="border-top: none;">
            <span v-if='submitData.financeRecheck==0' >否</span>
            <span v-if='submitData.financeRecheck==1' >是</span>
          </el-form-item>
          <el-form-item label="加审人:" style="border-top: none;">
            {{submitData.recheckUserIdStr || '-'}}
          </el-form-item>
        </el-row>
        <el-row style="border-bottom: 1px solid #EBEEF5;">
          <el-form-item label="加审说明:" >
            {{submitData.overdueRemark || '-'}}
          </el-form-item>
        </el-row>
      </el-form>

      <div class="button_wrap" >
        <el-button class="exactButton" plain @click="cancel">关 闭</el-button>
      </div>
    </div>
    <div class="TaskRecordWrap" >
      <TaskRecord :id="$route.query.feeId || dialogFeeId"></TaskRecord>
    </div>
    <BusinessTripDrawer
      :drawerVisible.sync="drawerStatus"
      :btId="submitData.btId"
      @close="handleDrawerClose"
    />
  </div>

</template>

<script>
import getPageTitle from '@/utils/get-page-title'
import {getCase,queryCustomerNameId} from '@/api/caseList'
import {queryUsers,queryWorkgroupNames,queryDeptByCondition,queryUserById} from '@/api/systemList'
import { createFee,queryFeeTypeList,submitFee,queryFeeInfo,updateFee,queryCompany,queryPayMode,createFeeInCase,deleteFee,querySpecificPayType, getContractDetail, contractViewPdf} from "@/api/feeList";
import {getMenuName,formatDate1} from '@/utils'
import TaskRecord from '../components/TaskRecord'
import BusinessTripDrawer from './components/BusinessTripDrawer'
export default {
  name:'seeFeeDetail',
  props:{
    dialogFeeId: {
      default: 0
    }
  },
  data(){
    return{
      drawerStatus: false,
      materialArray:[],
      submitData:{
        contractName: '',
        contractNo: '',
        feeDetails:[],
        payType:'',
        deptId:'',
        tobillStatus:0,
        fillinDate:formatDate1(new Date())
      },
      custList:[],
      agentNums:'',
      feeDetailList:[],
      caseData:[],
      tableTitleList:[{'title':'案件文号','value':'agentNum' },{'title':'客户','value':'custName' },{'title':'申请人','value':'appName'},{'title':'案件类型','value':'caseTypeStr'},{'title':'申请方向','value':'appFromto'},{'title':'权利号','value':'appFromto'},{'title':'案件状态','value':'status'},{'title':'案件名称','value':'caseName'},{'title':'商标类别','value':'goodClasses'}],
      feeTypeList:[],
      userList:[],
      workgroupNamesList:[],
      deptByConditionList:[],
      companyList:[],
      payTypeList:[],
      querySpecificPayTypeList:[],
      defaultParams:{
        value: 'feetId',
        label: 'feeName',
        checkStrictly: true,
        children: 'feeTypes'
      },
      isFinStaff:false,
    }
  },
  async created(){
   // this.queryUsers()
   // this.queryDeptByCondition()
   // this.queryCompany()
   // this.queryWorkgroupNames()
    let res= await  this.queryFeeTypeList()
    this.feeTypeList=res.data
    this.queryFeeInfo()
  },
  methods:{
    viewContractFile() {
      getContractDetail({
        contractId: this.submitData.contractId
      }).then(res => {
          if (res.data && res.data[0] && res.data[0].attachmentCon) {
            contractViewPdf({wordFilePath: res.data[0].attachmentCon.filePath}).then(result => {
              window.open(`/ipdoc${result.data.pdfAddress}`.replace(/[+]/g,'%2B'))
            })
          }
      })
    },
    preView(url){
      if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
        window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
      } else {
        this.$commonUtils.downLoadAll({url:`ipdoc${url}`})
      }
    },
    getCase(){
      getCase({agentNums:this.agentNums}).then(res=>{
        this.caseData=res.data
      })
    },
    querySpecificPayType(){
      querySpecificPayType({feeId:this.submitData.feeId}).then(res=>{
        this.querySpecificPayTypeList=res.data
      })
    },
    catchange(row){
      row.feetId=row.feetIdList[row.feetIdList.length-1]
      row.feeName=getMenuName(this.feeTypeList, 'feeTypes').find(item => item.feetId == row.feetId).feeName
    },
    queryFeeInfo(){
      queryFeeInfo({feeId:this.$route.query.feeId || this.dialogFeeId}).then(res=>{
        this.submitData=res.data || {}
      //  this.queryPayMode()
       // this.querySpecificPayType()
        this.materialArray = this.submitData.materialArray
        this.materialArray.forEach(item => {
          item.name = item.materialName
        })
        this.submitData.feeDetails.forEach(item=>{
         // =this.$commonUtils.getMenuName(this.feeTypeList,'feeTypes').find(i=>item.feetId==i.feetId).feeName
          item.feetIdList=this.$commonUtils.getTwoDimensionalArray( this.feeTypeList, 'feetId', item.feetId, {children:'feeTypes'})
          item.feetName=  item.feetIdList.map(i=>this.$commonUtils.getMenuName(this.feeTypeList,'feeTypes').find(ii=>ii.feetId==i).feeName).join('/')
          // item.feetIdList=this.$commonUtils.getTwoDimensionalArray( this.feeTypeList, 'feetId', item.feetId, {children:'feeTypes'})

        })
        this.isFinStaff = this.submitData.isFinancial

        // 计算是否有发票日期警告
        this.checkInvoiceDateWarning()

        // if(this.submitData.custId){
        //   queryCustomerNameId({custId: this.submitData.custId}).then(res=>{
        //     this.$set(this,'custList', res.data)
        //   })
        // }
      })
    },
    queryFeeTypeList(){
      return queryFeeTypeList()
    },
    // 检查发票开具日期是否需要警告（红色显示）
    isInvoiceDateWarning(invoiceDate) {
      if (!invoiceDate) return false
      const compareDate = this.submitData.submitDate || this.submitData.fillinDate
      if (!compareDate) return false

      const invoiceDateObj = new Date(invoiceDate)
      const compareDateObj = new Date(compareDate)

      // 计算对比日期减3个月
      const threeMonthsAgo = new Date(compareDateObj)
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

      // 如果发票开具日期早于（对比日期 - 3个月），则显示红色

      return invoiceDateObj < threeMonthsAgo
    },
    openBusinessTripDrawer() {
      this.drawerStatus = true
    },
    handleDrawerClose() {
      this.drawerStatus = false
    },
    // 检查是否有发票开具日期警告
    checkInvoiceDateWarning() {
      const compareDate = this.submitData.submitDate || this.submitData.fillinDate
      if (!compareDate) {
        this.$set(this.submitData, 'hasInvoiceDateWarning', 0)
        return
      }

      const compareDateObj = new Date(compareDate)

      // 计算对比日期减3个月
      const threeMonthsAgo = new Date(compareDateObj)
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

      // 检查是否有任何费用明细的发票开具日期早于3个月（有警告）
      const hasWarning = this.submitData.feeDetails.some(detail => {
        // 检查关联发票中的发票开具日期
        if (!detail.invoices || !Array.isArray(detail.invoices)) return false
        return detail.invoices.some(invoice => {
          if (!invoice.invoiceDate) return false
          const invoiceDateObj = new Date(invoice.invoiceDate)
          return invoiceDateObj < threeMonthsAgo
        })
      })

      this.$set(this.submitData, 'hasInvoiceDateWarning', hasWarning ? 1 : 0)
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
      })

    },
    queryUsers(){
      this.userList = this.$store.getters.userList
      if(this.$route.params.pageType==1){
        this.submitData.reimburseUserId=this.$store.getters.userId
      }
    },
    queryFeeTaskDefine(){

    },
    queryWorkgroupNames(){
      queryWorkgroupNames().then(res=>{
        this.workgroupNamesList=res.data
        if(this.$route.params.pageType==1){
          this.queryWorkByUserId()
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
            this.submitData.reimburseWkgId=res.data.groups[0].wkgId
          }
        }
      })
    },
    queryDeptByCondition(){
      queryDeptByCondition().then(res=>{
        this.deptByConditionList=res.data
      })
    },
    queryPayMode(e){
      if(this.submitData.paymentDeptId){
        queryPayMode({deptId:this.submitData.paymentDeptId}).then(res=>{
          this.payTypeList=res.data
        })
      }else{
        this.payTypeList=[]
      }
    },
    submit(){
      if(this.caseData.length){
        if(!this.submitData.feeId){
          createFeeInCase({caseIds:this.caseData.map(item=>item.caseId)}).then(res=>{
            this.submitData.taskIdList=res.data[0].taskId
            this.submitData.feeId=res.data[0].feeId
            this.submitData.feeDetails.forEach(item=>{
              item.feeId=this.submitData.feeId
              delete item.feetIdList
            })
            submitFee(this.submitData).then(Response=>{
              this.successed()
            })
          })
        }else {
          this.submitData.taskIdList=this.submitData.taskId
          this.submitData.feeDetails.forEach(item=>{
            item.feeId=this.submitData.feeId
            delete item.feetIdList
          })
          submitFee(this.submitData).then(Response=>{
            this.successed()
          })
        }
      }else{
        if(!this.submitData.feeId){
          createFee().then(res=>{
            this.submitData.taskIdList=res.data[0].taskId
            this.submitData.feeId=res.data[0].feeId
            this.submitData.feeDetails.forEach(item=>{
              item.feeId=this.submitData.feeId
              delete item.feetIdList
            })
            submitFee(this.submitData).then(Response=>{
              this.successed()
            })
          })
        }else {
          this.submitData.taskIdList=this.submitData.taskId
          this.submitData.feeDetails.forEach(item=>{
            item.feeId=this.submitData.feeId
            delete item.feetIdList
          })
          submitFee(this.submitData).then(Response=>{
            this.successed()
          })
        }
      }
    },
    submitFee(result){
      this.submitData.taskIdList= this.submitData.taskId
      this.submitData.result=result
      this.submitData.feeDetails.forEach(item=>{
        item.feeId=this.submitData.feeId
        delete item.feetIdList
      })
      submitFee(this.submitData).then(Response=>{
        this.successed()
      })
    },
    updateFee(){
      if(this.$route.params.pageType==1&&!this.submitData.feeId){
        if(this.caseData.length){
          createFeeInCase({caseIds:this.caseData.map(item=>item.caseId)}).then(res=>{
            this.submitData.taskIdList=res.data[0].taskId
            this.submitData.feeId=res.data[0].feeId
            this.submitData.feeDetails.forEach(item=>{
              item.feeId=this.submitData.feeId
              delete item.feetIdList
            })
            updateFee(this.submitData).then(Response=>{
              this.successed()
            })
          })
        }else{
          createFee().then(res=>{
            this.submitData.taskIdList=res.data[0].taskId
            this.submitData.feeId=res.data[0].feeId
            this.submitData.feeDetails.forEach(item=>{
              item.feeId=this.submitData.feeId
              delete item.feetIdList
            })
            updateFee(this.submitData).then(Response=>{
              this.successed()
            })
          })
        }
      }else{
        this.submitData.taskIdList=this.submitData.taskId
        this.submitData.feeDetails.forEach(item=>{
          item.feeId=this.submitData.feeId
          delete item.feetIdList
        })
        updateFee(this.submitData).then(Response=>{
          this.successed()
        })
      }
    },
    successed(){
      this.$message.success('操作成功')
      this.cancel()
    },
    cancel(){
      if(this.dialogFeeId){
        this.$emit('close')
      }else{
       this.$router.go(-1)
      }
    },
    transformation(arr,val,valType,labelStr){
      if(arr&&arr.length){
        var item=arr.find(item=>item[valType]==val)
        if(item){
          return item[labelStr]
        }else {
          return ''
        }
      }
      return ''
    },
  },
  watch:{
    totalSum(n){
      this.submitData.total= n
    },
    invoiceTotalSum(n) {
      this.submitData.invoiceTotal = n
    }
  },
  computed:{
    isShowLitigFeeRecptNo(){
      const isBank = this.submitData.payType.endsWith("银行")
      const isLitigationFee = this.submitData.feeDetails.some(item => item.feetId == 190)
      let isnoInv = false
      this.submitData.feeDetails.forEach(item => {
        if(item.feetId === 190 && (item.noInv || (item.invIds && !item.invIds.length))){
          isnoInv = true
        }
      })
      const bol = isLitigationFee && isBank && (this.submitData.invoiceLater || isnoInv) && this.submitData.specificPayType === '支付对方个人账户对私账户'
      return bol
    },
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

    },
    // 关联发票统计
    invoiceTotalSum() {
      const uniqueInvIds = new Set(); // 用于存储唯一的invId
      const amountList = this.submitData.feeDetails.reduce((accumulator, item) => {
        if (item.invoices) {
          item.invoices.forEach((invoice) => {
            if (invoice.invStatus != 0){
              if (!uniqueInvIds.has(invoice.invId)) {
                const amount = parseFloat(invoice.amountInFiguers);
                if (!isNaN(amount)) {
                  accumulator.push(amount);
                  uniqueInvIds.add(invoice.invId);
                }
              }
            }
          });
        }
        return accumulator;
      }, []);

      if (amountList.length === 0) {
        return 0.00;
      } else if (amountList.length === 1) {
        return amountList[0].toFixed(2);
      } else {
        const totalSum = amountList.reduce((pre, next) => pre + next);
        return totalSum.toFixed(2);
      }
    }
  },
  components:{
    TaskRecord,
    BusinessTripDrawer
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
    height: 50px;
    line-height: 50px;
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
        height: 100%;
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
    padding: 20px;
    flex: 1;
  }
  .TaskRecordWrap{
    margin-top:20px ;
    min-width:200px;
  }
  // .feeDetail{
  //   max-width:1500px;
  // }
  .invoice-fpgl{
    color: #52A0F5;
    cursor:pointer;
  }
  .del_line{
    text-decoration:line-through red;
  }
  .invoice-date-warning {
    color: red;
  }
</style>
