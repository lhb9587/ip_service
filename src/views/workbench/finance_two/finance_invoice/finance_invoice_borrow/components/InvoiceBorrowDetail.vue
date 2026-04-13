<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      top="5vh"
      width="60%"
      @change="handleClose">
      <div class="div-form" :style="pageState !== 'create' ? 'width:80%' : 'width:100%'">
        <el-form :model="submitData" :rules="rules" ref="ruleForm" label-width="160px" >
          <el-row>
            <el-form-item label="主题">
              {{ submitData.subject }}
            </el-form-item>
            <MaterialUpload  v-if="pageState !== 'view' && dialogVisible" :obj-type="objType" :obj-inst-id="objInstId" :subject="submitData.subject" @file-list="fileList"></MaterialUpload>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="文号:">
                <span v-if="pageState === 'view'">{{submitData.showRefno}}</span>
                <template v-else>
                  <span class="title-mx" style="cursor: pointer">{{ submitData.showRefno }}</span>
                  <el-button style="margin-left: 10px" size="mini" type="primary" @click="changeCaseVisible=true">修改</el-button>
                </template>

                <ChooseCase
                  :dialogVisible="changeCaseVisible"
                  :agentNums="caseArray.map(item=>item.agentNum).join('\n')"
                  @closed="changeCaseVisible=false"
                  rules="custId"
                  @getList="getList"></ChooseCase>
              </el-form-item>

            </el-col>
          </el-row>
          <div class="content" v-if="materialList.length > 0">
            <el-row>
              <el-form-item label="附件文档" >
                <div v-for="(item, key) in materialList">
                  <span >{{ item.materialName }}</span>
                  <el-button type="text" class="el-icon-view" style="line-height:0" @click="preView(item.address)" ></el-button>
                  <el-button type="text" size="smail" @click="downLoad(item.address)">下载</el-button>
                  <el-button v-if="pageState !== 'view'" type="text" size="smail" @click="deleteMaterial(item.materialId, key)">删除</el-button>
                </div>
              </el-form-item>
            </el-row>
          </div>
          <div class="content">
            <el-row>
              <el-form-item label="填报日期：">
                <span v-if="pageState === 'view'">{{submitData.fillinDate}}</span>
                <el-date-picker
                  v-else
                  v-model="submitData.fillinDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="欠发票人:" prop="borrowUserId">
                <span v-if="pageState === 'view'">{{submitData.borrowUserIdStr}}</span>
                <virtual-select @change="changeReibuserUserId" placeholder="请选择" v-else class="virtual-select" :isUser="false" clearable :disabled="false"  :data="$store.getters.allUserList" v-model="submitData.borrowUserId"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
                </virtual-select>
<!--                <el-select v-else v-model="submitData.borrowUserId" filterable clearable reserve-keyword-->
<!--                           @change="changeReibuserUserId">-->
<!--                  <el-option-->
<!--                    v-for="item in selectData.userList"-->
<!--                    :key="item.userId"-->
<!--                    :label="item.fullname"-->
<!--                    :value="item.userId"-->
<!--                  >-->
<!--                  </el-option>-->
<!--                </el-select>-->
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="借发票日期:">
                <span v-if="pageState === 'view'">{{submitData.borrowDate}}</span>
                <el-date-picker
                  v-else
                  v-model="submitData.borrowDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="所属组:">
                <span v-if="pageState === 'view'">{{submitData.wkgIdStr}}</span>
                <el-select v-else v-model="submitData.wkgId" size="small" no-match-text="暂无数据" filterable>
                  <el-option
                    v-for="item in selectData.groupList"
                    :key="item.wkgId"
                    :label="item.groupName"
                    :value="item.wkgId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="还票日期:">
                <span v-if="pageState === 'view'">{{submitData.returnDate}}</span>
                <el-date-picker
                  v-else
                  v-model="submitData.returnDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="所属部门:">
                <span v-if="pageState === 'view'">{{submitData.deptIdStr}}</span>
                <el-select v-else v-model="submitData.deptId" filterable clearable reserve-keyword placeholder="请选择所属部门">
                  <el-option
                    v-for="item in selectData.deptByConditionList"
                    :key="item.deptId"
                    :label="item.name"
                    :value="item.deptId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="核销日期:">
                <span v-if="pageState === 'view'">{{submitData.hxDate}}</span>
                <el-date-picker
                  v-else
                  v-model="submitData.hxDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="支付公司:" prop="companyId">
                <span v-if="pageState === 'view'">{{submitData.companyIdStr}}</span>
                <el-select v-else @change="queryPayMode" v-model="submitData.companyId" filterable clearable reserve-keyword placeholder="请选择支付公司">
                  <el-option
                    v-for="item in selectData.companyList"
                    :key="item.deptId"
                    :label="item.companyShortName"
                    :value="item.deptId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="欠票性质:" prop="invoiceNature">
                <span v-if="pageState === 'view'">{{submitData.invoiceNature}}</span>
                <el-select v-else v-model="submitData.invoiceNature" placeholder="请选择欠票性质">
                  <el-option
                    v-for="item in invoiceNatureOption"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发票归还时限:">
                <span>{{ submitData.returnLimitDate }}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="支付方式">
                <span v-if="pageState === 'view'">{{submitData.payType}}</span>
                <el-select v-else v-model="submitData.payType" filterable clearable reserve-keyword placeholder="请选择方式">
                  <el-option
                    v-for="item in selectData.payTypeList"
                    :key="item.payMode"
                    :label="item.payMode"
                    :value="item.payMode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="欠发票金额" prop="amount">
                <span v-if="pageState === 'view'">{{submitData.amount}}</span>
                <el-input v-else type="number" v-on:blur="handleAmount" v-model="submitData.amount"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="发票内容">
                <span v-if="pageState === 'view'">{{submitData.invoiceContent}}</span>
                <el-input v-else type="textarea" v-model="submitData.invoiceContent"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="填报人">
                <span v-if="pageState === 'view'">{{submitData.fillinUserIdStr}}</span>
                <virtual-select @change="changeReibuserUserId" placeholder="请选择" v-else class="virtual-select" :isUser="false" clearable :disabled="false"  :data="$store.getters.allUserList" v-model="submitData.fillinUserId"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
                </virtual-select>
<!--                <el-select v-else v-model="submitData.fillinUserId" filterable clearable reserve-keyword-->
<!--                           @change="changeReibuserUserId">-->
<!--                  <el-option-->
<!--                    v-for="item in selectData.userList"-->
<!--                    :key="item.userId"-->
<!--                    :label="item.fullname"-->
<!--                    :value="item.userId"-->
<!--                  >-->
<!--                  </el-option>-->
<!--                </el-select>-->
              </el-form-item>
              <el-form-item label="核销状态">
                {{ submitData.hxStatus ? '已核销' : '未核销'}}
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="备注">
                <span v-if="pageState === 'view'" v-html="htmlRemarks"></span>
                <el-input v-else type="textarea" v-model="submitData.remarks"></el-input>
              </el-form-item>
            </el-row>
            <el-row v-if="invoiceList.length > 0">
              <el-form-item label="关联发票">
                <div v-for="(item,index) in invoiceList" class="text item">
                  <span v-if="item.invoiceNum" class="invoice-fpgl" @click="preView(`${item.invPath}`)">发票号：{{ item.invoiceNum }}</span>
                  <span v-else>发票异常</span>
                  <el-tooltip :disabled="!item.veriCode!=0" effect="light" :content="item.veriMessge" placement="top">
                    <i @click="modifyVeriCode(item)" v-if="item.veriCode!=0" :style="'cursor: pointer;'+ (item.veriCode == -1 ? 'color:#ebbb35' : item.veriCode == -11 ? 'color:#02c348' : 'color:red')" class="el-icon-warning"></i>
                  </el-tooltip>
                  {{ item.amountInFiguers ? '发票金额：￥' + item.amountInFiguers : '' }}
                  <span v-if="(item.remainingAmount || $store.getters.permissions.includes(306))" title="删除" class="invoice-fpsc iconfont icon-fapiaoshanchu" @click="deleteRelated(index)"></span>
                </div>
              </el-form-item>
            </el-row>
            <el-row v-else-if="submitData.noInv && submitData.noInv == 1">
              <el-form-item label="关联发票">无需关联发票</el-form-item>
            </el-row>
            <el-row v-if="invoiceList.length > 0">
              <el-form-item label="关联发票总金额">
                {{ totalInFiguersAmount() }}
              </el-form-item>
            </el-row>
          </div>
        </el-form>
        <div class="button_wrap" v-if="pageState == 'view' && dialogTitle.includes('处理')">
          <el-button class="exactButton" type="primary" @click="submitReturnInvoice(2)">退回归还欠票</el-button>
          <el-button class="exactButton" plain @click="handleClose">取消</el-button>
        </div>
        <div class="button_wrap" v-else-if="pageState == 'view' && dialogTitle.includes('归还欠票')">
          <el-button class="exactButton" type="primary" @click="showPop($event)">归还欠票</el-button>
          <el-button class="exactButton" plain @click="handleClose">取消</el-button>
        </div>
        <div class="button_wrap" v-if="pageState == 'create'">
          <el-button class="exactButton" type="primary" @click="submit(1)">保存</el-button>
          <el-button class="exactButton" type="primary" @click="submit(2)">提交</el-button>
          <el-button class="exactButton" plain @click="handleClose">取消</el-button>
        </div>
        <div class="button_wrap" v-if="pageState == 'submit'">
          <el-button class="exactButton" type="primary" @click="submit(2)">提交</el-button>
          <el-button class="exactButton" plain @click="handleClose">取消</el-button>
        </div>
        <div class="button_wrap" v-if="pageState =='edit'">
          <el-button class="exactButton" type="primary" @click="submit(1)">保存</el-button>
          <el-button class="exactButton" type="primary" v-if="submitData.flag !== 1 && submitData.tasker.includes(this.$store.getters.name) && submitData.taskNo==2" @click="submit(2)">核销</el-button>
          <el-button class="exactButton" plain @click="handleClose">取消</el-button>
        </div>
      </div>
      <popover-svc ref="pop1" placement="top" v-model="showPopper">
        <IdentifyInvoices class="popover-content" :position="'borrow'" @closeInvoiceSelect="invoiceRelated($event)" @cancelClose="cancelClose"></IdentifyInvoices>
      </popover-svc>
      <div class="TaskRecordWrap" v-if="pageState !== 'create' && dialogVisible">
        <TaskRecord :id="objInstId" :type-id="typeId"></TaskRecord>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryUserById, queryDeptByCondition} from '@/api/systemList'
import { queryZZWorkGroupUrl, disposeAgentNum } from "@/api/billApi";
import { queryPayMode, queryCompany, getInvoiceBorrowInfo } from "@/api/feeList";
import { deleteMaterial } from "@/api/customerList";
import { createInvoiceBorrow, modifyInvoiceBorrow, doInvoiceBorrowTask , queryMaterialByObjTypeAndInstId, returnInvoice, modifyVeriCode } from "@/api/caseList";
import ChooseCase from '../../../../case/components/ChooseCase'
import TaskRecord from '../../../../finance/components/TaskRecord'
import MaterialUpload from '../../../components/MaterialUpload'
import IdentifyInvoices from '../../../../finance/components/IdentifyInvoices'
import { Popover } from 'element-ui'
export default {
  name: 'InvoiceBorrowDetail',
  computed: {
    htmlRemarks() {
      return this.submitData.remarks && this.submitData.remarks.replace(/\n/g, `<br />`) || ''
    }
  },
  data() {
    return {
      feeIds: '',
      pageState: 'create',
      objInstId: '',
      objType: 1114,
      typeId: 18,
      dialogTitle: '',
      dialogVisible: false,
      changeCaseVisible: false,
      invoiceNatureOption: ['借用发票', '财务已付款未提供发票', '海外担保金抵扣仓储费等发票', '备用金'],
      hxStatusOption: ['未核销', '已核销'],
      caseArray: [],
      selectData: {
        groupList: [],
        payTypeList: [],
        userList: [],
        companyList: [],
        deptByConditionList: []
      },
      rules: {
        borrowUserId: [{required: true, message: '请选择欠发票人', trigger: 'change'}],
        invoiceNature: [{required: true, message: '请选择欠票性质', trigger: 'change'}],
        amount: [{required: true, message: '请选择欠发票金额', trigger: 'change'}],
        companyId: [{required: true, message: '请选择支付公司', trigger: 'change'}],
      },
      materialList:[],
      submitData: {},
      defaultForm: {
        subject: '外借发票',
        showRefno: '',
        fillinDate: '',
        borrowUserId: '',
        borrowDate: '',
        returnDate: '',
        hxDate: '',
        deptId: '',
        companyId: '',
        invoiceNature: '',
        payType: '',
        amount: '',
        invoiceContent: '',
        fillinUserId: '',
        hxStatus: 0,
        wkgId: '',
        remarks: '',
        caseIds: null,
        materialIdArray: [],
      },
      showPopper: false,
      eventObj: {},
      invoiceList: [],
      noInv: ''
    }
  },
  created() {
    this.getallSelectdata()
  },
  methods: {
    initDataByFee(rows){
      const row = rows[0]
      this.feeIds = String([...new Set(rows.map(i => i.feeId))])
      getInvoiceBorrowInfo({
        idStr: this.feeIds
      }).then(res => {
        this.submitData.caseIds = res.data.caseIds
        this.submitData.invoiceContent = res.data.invContents.join('\n')
        this.submitData.showRefno = res.data.showRefno
        this.submitData.amount = res.data.total
        this.submitData.remarks = res.data.invRemarks.join('\n')
        this.caseArray = res.data.caseArray || []
      })
      this.dialogTitle = '外借发票-填写外借发票信息'
      this.pageState = 'create'
      this.dialogVisible = true
      this.defaultDataInit()
      // this.submitData.showRefno = row.showRefno // 案件文号
      this.submitData.borrowUserId = row.reimburseUserId // 欠发票人， 缺字段
      this.changeReibuserUserId(this.submitData.borrowUserId,row.paymentDeptId)
      // this.submitData.wkgId = '' // 所属组
      // this.submitData.deptId = '' // 所属部门
      // this.submitData.deptId&&this.queryPayMode()//所属部门联动
      // this.submitData.companyId = '' // 所属公司
      // 以上三个跟欠发票人联动
      this.submitData.borrowDate = this.$wUtil.getDate('', 'day') // 借发票日期
      this.submitData.fillinDate = this.$wUtil.getDate('', 'day') // 填报日期
      //以上当天
      // this.submitData.returnDate = this.$commonUtils.getEndDate(this.$wUtil.getDate('', 'day'), 7, '天') // 预计还票日期 当天+7天
      // this.submitData.hxDate = '' // 核销日期 空
      this.submitData.invoiceNature = '财务已付款未提供发票' // 欠票性质
      this.submitData.payType = row.payType // 支付方式
      // this.submitData.amount = row.amount // 发票金额
      this.handleAmount()
      // this.submitData.invoiceContent = row.feeName4 + (row.receiverName ? ' ' + row.receiverName : '') // 发票内容 = 四级科目+收款对方名称
      this.submitData.fillinUserId = this.$store.getters.userId // 填报人 当前用户
      // this.submitData.hxStatus = '' // 核销状态 未核销

      // this.submitData.remarks = row.remarks // 备注
      // this.submitData.caseIds = [row.caseId] // 案件id
    },
    returnInvoice(row) {
      this.dialogTitle = '外借发票-归还欠票'
      this.pageState = 'view'
      this.defaultDataInit(row)
    },
    handleReturnInvoice(row) {
      this.dialogTitle = '外借发票-处理归还欠票'
      this.pageState = 'view'
      this.defaultDataInit(row)
    },
    borrowView(row) {
      this.dialogTitle = '外借发票-查看'
      this.pageState = 'view'
      this.defaultDataInit(row)
    },
    borrowCreate() {
      this.dialogTitle = '外借发票-填写外借发票信息'
      this.pageState = 'create'
      this.defaultDataInit()

    },
    borrowEdit(row) {
      if (row.flag != 1) {
        this.$message.warning('您无权限修改');
        return
      }
      this.dialogTitle = '外借发票-编辑'
      this.pageState = 'edit'
      this.defaultDataInit(row)
    },
    borrowSubmit(row) {
      this.dialogTitle = '外借发票-填写外借发票信息'
      this.pageState = 'submit'
      this.defaultDataInit(row)
    },

    defaultDataInit(row) {
      this.dialogVisible = true
      if (this.pageState == 'create') {
        this.submitData = JSON.parse(JSON.stringify(this.defaultForm))
        this.materialList = []
        this.invoiceList = []
        var user_id = this.$store.getters.userId
        var to_date = this.$commonUtils.formatDate1(new Date())
        this.submitData.fillinUserId = user_id
        this.submitData.fillinDate = to_date
        this.submitData.borrowDate = to_date
      } else {
        this.submitData = JSON.parse(JSON.stringify(row))
        this.invoiceList = JSON.parse(JSON.stringify(row.invoices))
        if (this.submitData.wfStatus == '已完成') {
          this.pageState = 'view'
        }
        this.objInstId = this.submitData.invBorId
        this.queryMaterial()
      }
      console.log(this.invoiceList)
    },
    async getallSelectdata() {
      this.selectData.userList = this.$store.getters.userList
      queryZZWorkGroupUrl().then(res => {
        this.selectData.groupList = res.data
      })
      queryDeptByCondition({isactive: 1}).then(res => {
        this.selectData.deptByConditionList = res.data
      })
      queryCompany().then(res=>{
        this.selectData.companyList = res.data
      })
    },
    queryMaterial() {
      this.materialList = []
      this.submitData.materialIdArray = []
      queryMaterialByObjTypeAndInstId({ objType: this.objType, objInstId: this.submitData.invBorId }).then(res => {
        res.data.forEach(item => {
          this.materialList.push(item)
          this.submitData.materialIdArray.push(item.materialId)
        })
      })
    },
    // 附件上传处理,文件追加
    fileList(data) {
      this.materialList.push(data)
      this.submitData.materialIdArray.push(data.materialId)
    },
    // 预览查看
    preView(url) {
      if(['doc','docx'].includes(url.replace(/.+\./,"").toLocaleLowerCase())) {
        this.$commonUtils.viewPdf(`${url}`)
      }else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)) {
        window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
      } else {
        this.downLoad(url)
      }
    },
    // 附件下载
    downLoad(url){
      const downData={
        url:`ipdoc${url}`,
        success(){
          // notify.close()
        }
      }
      this.$commonUtils.downLoadAll(downData)
    },
    // 删除附件
    deleteMaterial(materialId, key){
      deleteMaterial({ materialId: materialId }).then(res => {
        this.materialList.splice(key,1)
        this.submitData.materialIdArray.splice(key,1)
        this.$message.success(res.message)
      })
    },
    queryPayMode(e,deptId) {
      if (e && !deptId) {
        this.submitData.payType = ''
      }
      if (this.submitData.companyId) {
        queryPayMode({deptId: this.submitData.companyId}).then(res => {
          this.selectData.payTypeList = res.data
        })
      } else {
        this.selectData.payTypeList = []
      }
    },
    changeReibuserUserId(e,deptId) {
      queryUserById(e).then(res=>{
        if(res.data.groups&&res.data.groups.length){
          this.submitData.wkgId= res.data.groups[0].wkgId // 工作组
        }
        if(res.data.user){
          if (this.selectData.deptByConditionList.find(item => item.deptId == res.data.user.deptId)){ //判断是否无效的部门，否者带出工作组所属部门
            this.submitData.deptId = res.data.user.deptId
          }else if (this.submitData.wkgId){
            let wkgData = this.selectData.groupList.find(item => item.wkgId == this.submitData.wkgId)
            if (wkgData) {
              this.submitData.deptId = wkgData.deptId
            }
          }
        }
        if (deptId) {
          this.submitData.companyId = deptId
        }else{
          if (res.data.department){
            let data = this.selectData.companyList.find(item => item.companyShortName == res.data.department.companyShortName) // 公司
            if (data) {
              this.submitData.companyId = data.deptId
            }
          }
        }
        this.queryPayMode(this.submitData.companyId,deptId)
      })
    },
    // 处理欠发票金额
    handleAmount() {
      this.submitData.amount = parseFloat(this.submitData.amount).toFixed(2)
    },
    // 获取文案数据
    getList(list) {
      if (list.length) {
        this.submitData.caseIds = list.map(item => item.caseId)
        this.caseArray = list
        disposeAgentNum({agentNumberArray: list.map(item => item.agentNum)}).then(res => {
          this.submitData.showRefno = res.data
        })
      } else {
        this.submitData.showRefno = ''
        this.submitData.caseIds = null
      }
    },
    async submit(type) {
      if (!this.$commonUtils.formValidate(this.$refs['ruleForm'])) return
      this.dialogVisible = false
      this.submitData.feeIds = this.feeIds
      if (this.pageState == 'create'){
        createInvoiceBorrow(this.submitData).then(res => {
          if (res.success) {
            if (type == 2) {
              this.doInvoiceBorrowTask(res.data[0].taskId)
            }
            this.$message.success(res.message)
            this.$emit('cancel')
          }
        });
      } else {
        this.submitData.invIds = this.invoiceList.map(invoice => invoice.invId)
        modifyInvoiceBorrow(this.submitData).then(res => {
          if (res.success) {
            if (type == 2) {
              this.doInvoiceBorrowTask(this.submitData.taskId)
            }
            this.$message.success(res.message)
            this.$emit('cancel')
          }
        });
      }
    },
    doInvoiceBorrowTask(taskId) {
      let taskIdList = []
      taskIdList.push(taskId)
      doInvoiceBorrowTask({ taskIdList }).then(result => {
        this.$emit('cancel')
      })
    },
    // 判断是否显示发票关联界面
    showPop(e) {
      this.eventObj = e
      if (this.invoiceList.length <= 0) {
        this.$refs.pop1.popBy(e.target);
      } else {
        this.$confirm('请选择关联发票或者继续归还发票操作?', '提示', {
          confirmButtonText: '归还发票',
          cancelButtonText: '关联发票',
          type: 'warning'
        }).then(() => {
          if(this.invoiceRelatedVerify() != false){
            this.submitReturnInvoice(1)
          }
        }).catch((err) => {
          this.$refs.pop1.popBy(e.target);
        });
      }
    },
    // 统计关联发票可用金额
    totalInFiguersAmount() {
      return this.invoiceList.reduce((total, invoice) => total + invoice.amountInFiguers, 0);
    },
    // 发票关联绑定
    invoiceRelated(invInfo) {
      if (invInfo){
        if (this.invoiceList.find(item => item.invId == invInfo.invId)){
          this.$message.warning('该发票已存在，请选择其他发票！')
          return false;
        }
        this.noInv = ''
        this.showPopper = false
        this.invoiceList.push(invInfo)
      }else {
        this.showPopper = false
        this.noInv = 1
        this.submitReturnInvoice(1)
      }
    },
    // 取消关闭
    cancelClose() {
      this.$refs.pop1.popBy(this.eventObj.target);
    },
    // 修改验真状态
    modifyVeriCode(row) {
      if (this.$store.getters.permissions.includes(397) && this.$store.getters.permissions.includes(306) && row.veriCode == -11){
        modifyVeriCode({invId: row.invId, veriCode: 0 }).then(res => {
          if (res.success){
            this.$message({
              type: 'success',
              message: '手动验真成功！'
            });
            this.$set(row,'veriCode',0)
            this.$emit('cancel')
          }
        })
      }
    },
    // 删除发票关联
    deleteRelated(index) {
      this.invoiceList.splice(index,1)
    },
    // 返回异常消息
    returnExistMessage(message) {
      this.$alert(message, '异常提醒', {
        confirmButtonText: '确定',
        type: 'warning',
        callback: action => {}
      });
    },
    invoiceRelatedVerify() {
      const allInvoices = this.invoiceList.filter(invoice => invoice.purchaserName && invoice.purchaserName !== '' && invoice.purchaserName !== null);
      if (allInvoices.length > 0){
        // 检查所有invoices对象的purchaserName是否一致
        const updatedInvoices = allInvoices.map(invoice => ({
          ...invoice,
          purchaserName: invoice.purchaserName.replace(/(\(|（)(.*?)(\)|）)/g, '（$2）')
        }));

        const firstCompanyName = updatedInvoices[0].purchaserName
        const deptId = updatedInvoices.find(item => item.deptId) ? updatedInvoices.find(item => item.deptId).deptId : '';

        if (!updatedInvoices.every(invoice => invoice.purchaserName === firstCompanyName)) {
          this.returnExistMessage('关联发票存在公司主体名称不统一问题，请修改！');
          return false;
        }
        if (deptId && deptId != this.submitData.companyId){
          this.returnExistMessage('发票主体和支付公司不一致，请进行确认');
          return false;
        }
      }
    },
    // 归还欠票
    submitReturnInvoice(type) {
      var data = {
        invBorId: this.submitData.invBorId,
        invIds: this.invoiceList.map(invoice => invoice.invId),
        optType: type,
        noInv: this.noInv
      }
      this.dialogVisible = false
      returnInvoice(data).then(res => {
        this.$message.success(res.message)
        this.$emit('cancel')
      })
    },
    handleClose() {
      this.dialogVisible = false
    }
  },
  components: {
    ChooseCase,
    MaterialUpload,
    TaskRecord,
    IdentifyInvoices,
    'popover-svc': {
      extends: Popover,
      methods: {
        popBy(el) {
          this.close();
          this.doDestroy(true);
          this.$nextTick(() => {
            this.referenceElm = this.$refs.reference = el;
            this.showPopper = true;
          });
        },
        close() {
          this.showPopper = false;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/icons/font_3706197_i43kfx45ljo.css";
/deep/ .el-dialog {
  height: 80vh;
  overflow: auto;
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
    height: 32px;
    line-height: 32px;
  }
  /deep/ .el-input__icon{
    line-height: 32px;
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
        text-align: left;
        padding-left: 12px;
        background: #f5f7fa;
        display: flex;
        display: -webkit-flex;
        jusitify-content: center;
        align-items: center;
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

.content {
  width: 100%;
  border: 1px solid #D7D7D7;
  margin-top: 10px;
  padding: 5px;
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
.div-form {
  width: 80%;
  display: inline-block;
}
.TaskRecordWrap {
  width: 18%;
  margin-top: 20px;
  float: right;
}
.invoice-fpsc {
  color: red;
  cursor:pointer;
}
.invoice-fpgl{
  color: #52A0F5;
  cursor:pointer;
}
.virtual-select/deep/{
  display: flex;
  margin-top: 4px;
  .jh-virtual-select{
    width: 95%;
    line-height: 40px;
    .suffix {
      /*height: 32px;*/
    }
  }
}
</style>

