<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      top="5vh"
      max-width="60%"
      @closed="handleClose"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="div-form">
        <el-form :model="submitData" :rules="rules" ref="ruleForm" label-width="160px" >
          <template v-if="pageState == 'create'">
            <el-row>
              <el-form-item label="查验方式：" :required="true">
                <el-radio-group v-model="checkMethod">
                  <el-radio label="1">图片识别</el-radio>
                  <el-radio label="2">手动录入</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="交票类型：" :required="true">
                <el-radio-group v-model="invoiceInfo.deliveryType">
                  <el-radio :label="1">交通票</el-radio>
                  <el-radio :label="2">其他票</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-row v-if="checkMethod == 1">
              <el-form-item label="发票所属人:" :required="true">
                <el-select v-model="invoiceInfo.invUserId" @change="queryWorkByUserId" filterable reserve-keyword>
                  <el-option
                    v-for="item in selectData.userList"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.userId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发票所属工作组:">
                <el-select v-model="invoiceInfo.wkgId" @change="changeCostWkg" size="small" no-match-text="暂无数据" filterable>
                  <el-option
                    v-for="item in selectGroupData"
                    :key="item.wkgId"
                    :label="item.groupName"
                    :value="item.wkgId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <div class="content">
              <div v-if="checkMethod==1">
                <el-upload
                  v-loading="loading"
                  element-loading-text="查验中"
                  class="upload-demo"
                  drag
                  name="attachFile"
                  :data="{
                    tokenID: $store.getters.token,
                    deliveryType:invoiceInfo.deliveryType,
                    invUserId:invoiceInfo.invUserId,
                    wkgId:invoiceInfo.wkgId,
                    domainId:invoiceInfo.domainId}"
                  :action="uploadInvoice"
                  :on-success="onsuccess"
                  :on-change="handleChange"
                  :before-upload="beforeAvatarUpload"
                  :file-list="fileList">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div slot="tip" class="el-upload__tip">目前只支持格式pdf、jpg、png、zip、ofd的增值税发票（普票、电子）进行发票查验，jpg、png 图片小于5M, 尺寸最小15px，最大4096px</div>
                </el-upload>
              </div>
              <div v-else>
                <el-row>
                  <el-form-item label="发票类型：" prop="invType">
                    <el-select v-model="submitData.invType" size="small" no-match-text="暂无数据" filterable>
                      <el-option
                        v-for="item in typeList"
                        :key="item.id"
                        :label="item.typeName"
                        :value="item.typeName"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="发票代码:" prop="invoiceCode">
                    <el-input type="number" v-model="submitData.invoiceCode"></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="发票号码：" prop="invoiceNum">
                    <el-input type="number" v-model="submitData.invoiceNum"></el-input>
                  </el-form-item>
                  <el-form-item label="校验码:" prop="checkCode">
                    <el-input v-model="submitData.checkCode" placeholder="校验码可只填后六位"></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="合计金额(不含税)：" prop="totalAmount">
                    <el-input type="number" v-model="submitData.totalAmount"></el-input>
                  </el-form-item>
                  <el-form-item label="价税合计：" prop="amountInFiguers">
                    <el-input type="number" v-model="submitData.amountInFiguers"></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="开票日期：" prop="invoiceDate">
                    <el-date-picker
                      v-model="submitData.invoiceDate"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item v-if="rules.sellerRegisterNum.length > 0" label="销售方纳税人号：" prop="sellerRegisterNum">
                    <el-input v-model="submitData.sellerRegisterNum"></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="发票上传" prop="invoiceFile">
                    <template slot="label"><span class="required-asterisk">*</span>发票上传：</template>
                    <el-upload
                      name="attachFile"
                      class="invoice-upload-btn"
                      :data='addInvoiceFileData'
                      ref="uploadInvoiceFile"
                      :action="creatematerial"
                      :file-list="invoiceList"
                      :on-success="onSuccessUploadInvoice"
                      :on-remove="onRemoveUploadInvoice"
                      :limit="1"
                      >
                        <el-button size="small" type="primary" :disabled="invoiceList.length">上传</el-button>
                      </el-upload>
                  </el-form-item>
                </el-row>
              </div>
            </div>
            <div class="button_wrap" v-if="checkMethod==2">
              <el-button size="small" v-if="!invoiceInfo.invId" @click="handleClose">取消</el-button>
              <el-button size="small" type="primary" @click="handleIdentify()">识别</el-button>
            </div>
          </template>
          <div class="content" v-if="invoiceInfo.invId">
            <el-row v-if="invoiceInfo.invPath">
              <el-form-item label="发票查看：">
                <span class="invoice-fpgl" @click="preView(`${invoiceInfo.invPath}`) ">{{invoiceInfo.invPath.substring(invoiceInfo.invPath.lastIndexOf("/")+1)}}</span>
              </el-form-item>
              <el-form-item label="交票类型：">
                <span v-if="pageState != 'edit'">{{ invoiceInfo.deliveryType==1 ? '交通票' : '其他票' }}</span>
                <el-radio-group v-else v-model="invoiceInfo.deliveryType" :disabled="invoiceInfo.invStatus === 1 || invoiceInfo.invStatus === 2 || invoiceInfo.invStatus === 3">
                  <el-radio :label="1">交通票</el-radio>
                  <el-radio :label="2">其他票</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="发票类型：">
                <span v-if="invoiceInfo.veriCode==0">{{invoiceInfo.invType}}</span>
                <el-select  v-else v-model="invoiceInfo.invType" size="small" no-match-text="暂无数据" filterable>
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.typeName"
                    :value="item.typeName"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发票标题:">
                <span v-if="invoiceInfo.veriCode==0">{{invoiceInfo.invTypeOrg}}</span>
                <el-input v-else v-model="invoiceInfo.invTypeOrg"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="发票消费类型:">
                <span v-if="invoiceInfo.veriCode==0">{{invoiceInfo.serviceType}}</span>
                <el-select v-else v-model="invoiceInfo.serviceType" size="small" no-match-text="暂无数据" filterable>
                  <el-option
                    v-for="item in serviceTypeList"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发票代码:">
                <span v-if="invoiceInfo.veriCode==0">{{invoiceInfo.invoiceCode}}</span>
                <el-input v-else type="number" v-model="invoiceInfo.invoiceCode"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="购买方名称:">
                <span v-if="invoiceInfo.veriCode==0">{{invoiceInfo.purchaserName}}</span>
                <el-input v-else v-model="invoiceInfo.purchaserName"></el-input>
              </el-form-item>
              <el-form-item label="发票号码:">
                <span v-if="invoiceInfo.veriCode==0">{{invoiceInfo.invoiceNum}}</span>
                <el-input v-else type="number" v-model="invoiceInfo.invoiceNum"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="购买方纳税人识别号:">
                <span v-if="invoiceInfo.veriCode==0">{{invoiceInfo.purchaserRegisterNum}}</span>
                <el-input v-else v-model="invoiceInfo.purchaserRegisterNum"></el-input>
              </el-form-item>
              <el-form-item label="开票日期:">
                <span v-if="invoiceInfo.veriCode==0">{{invoiceInfo.invoiceDate}}</span>
                <el-date-picker
                  v-else
                  v-model="invoiceInfo.invoiceDate"
                  type="date"
                  size="small"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="销售方名称:">
                <span v-if="invoiceInfo.veriCode==0">{{invoiceInfo.sellerName}}</span>
                <el-input v-else v-model="invoiceInfo.sellerName"></el-input>
              </el-form-item>
              <el-form-item label="校验码:">
                <span v-if="invoiceInfo.veriCode==0">{{invoiceInfo.checkCode}}</span>
                <el-input v-else placeholder="校验码可只填后六位" v-model="invoiceInfo.checkCode"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="销售方纳税人识别号:">
                <span v-if="invoiceInfo.veriCode==0">{{invoiceInfo.sellerRegisterNum}}</span>
                <el-input v-else v-model="invoiceInfo.sellerRegisterNum"></el-input>
              </el-form-item>
              <el-form-item label="价税合计:">
                <span v-if="invoiceInfo.veriCode==0">{{invoiceInfo.amountInFiguers}}</span>
                <el-input v-else type="number" v-model="invoiceInfo.amountInFiguers"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-table
                :data="invoiceInfo.invoiceDetails"
                border
                style="width: 100%">
                <el-table-column
                  prop="commodityName"
                  label="服务名称">
                </el-table-column>
                <el-table-column
                  prop="commodityType"
                  label="规格型号"
                  width="130">
                </el-table-column>
                <el-table-column
                  prop="commodityUnit"
                  label="单位"
                  width="60">
                </el-table-column>
                <el-table-column
                  prop="commodityNum"
                  label="数量"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="commodityPrice"
                  label="单价"
                  width="130">
                </el-table-column>
                <el-table-column
                  prop="commodityAmount"
                  label="金额"
                  width="130">
                </el-table-column>
                <el-table-column
                  prop="commodityTaxRate"
                  label="税率"
                  width="60">
                </el-table-column>
                <el-table-column
                  prop="commodityTax"
                  label="税额"
                  width="100">
                </el-table-column>
              </el-table>
            </el-row>
            <el-row v-if="!(pageState == 'create' && checkMethod == 1)">
              <el-form-item label="发票所属人:">
                <span v-if="pageState === 'view'">{{ invoiceInfo.invUserIdStr }}</span>
                <el-select v-else v-model="invoiceInfo.invUserId" @change="queryWorkByUserId" filterable clearable reserve-keyword>
                  <el-option
                    v-for="item in selectData.userList"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.userId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发票所属工作组:">
                <span v-if="pageState === 'view'">{{invoiceInfo.wkgIdStr}}</span>
                <el-select v-else v-model="invoiceInfo.wkgId" @change="changeCostWkg" size="small" no-match-text="暂无数据" filterable>
                  <el-option
                    v-for="item in selectGroupData"
                    :key="item.wkgId"
                    :label="item.groupName"
                    :value="item.wkgId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="发票所属部门:">
                <span>{{invoiceInfo.domainIdStr}}</span>
<!--                <el-select v-else v-model="invoiceInfo.domainId" filterable clearable reserve-keyword placeholder="请选择所属部门">-->
<!--                  <el-option-->
<!--                    v-for="item in selectData.deptByConditionList"-->
<!--                    :key="item.deptId"-->
<!--                    :label="item.name"-->
<!--                    :value="item.deptId"-->
<!--                  >-->
<!--                  </el-option>-->
<!--                </el-select>-->
              </el-form-item>
              <el-form-item label="发票状态:">
                <span>{{ invoiceInfo.invStatusStr }}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="发票查验状态:">
                <span>{{ invoiceInfo.veriMessgeDesc }}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="备注">
                <span v-if="pageState === 'view'">{{invoiceInfo.invMemo}}</span>
                <el-input v-else type="textarea" v-model="invoiceInfo.invMemo"></el-input>
              </el-form-item>
            </el-row>
            <div class="button_wrap" v-if="['create','edit'].includes(pageState)">
              <el-button v-if="!invoiceInfo.invId" @click="handleClose">取消</el-button>
              <el-button class="exactButton" type="primary" @click="submit()">确定</el-button>
            </div>
            <div class="button_wrap" v-if="pageState == 'view'">
              <el-button @click="handleClose">关闭查看</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryWorkByUserId, queryDeptByCondition} from '@/api/systemList'
import { queryZZWorkGroupUrl } from "@/api/billApi";
import { queryPayMode} from "@/api/feeList";
import { uploadInvoice,creatematerial } from "@/api/ipServiceApi.config.js";
import { createInvoice, modifyInvoice } from "@/api/caseList";
import { querycustSelectClass } from "@/api/caseDetail";

export default {
  name: 'InvoiceBorrowDetail',
  data() {
    return {
      creatematerial,
      addInvoiceFileData:{
        tokenID: this.$store.getters.token,
        subject: "发票管理",
        docName: "发票"
      },
      invoiceList:[],
      checkMethod: '1',
      loading: false,
      uploadInvoice,
      invoiceInfo: {
        invId: '',
        deliveryType: 0,
        invUserId: '',
      },
      fileSuffix: '',
      invStatus: {
        '-1': '可用',
        0: '不可用',
        1: '财务已处理',
        2: '已报销',
      },
      veriCodeStatus: {
        '-1': '待验真',
        '-2': '发票标题未识别',
        0: '验真成功（真）',
        1: '发票代码长度有误/发票代码有误（假）',
        2: '发票号码长度有误（假）',
        4: '校验码有误',
        1002: '超过该张发票当日查验次数(请于次日再次查验)',
        1006: '不一致（发票号码不正确/开票日期不正确）',
        1009: '查无此票（假）',
        120: '没有有测试数量了'
      },
      typeList: [],
      serviceTypeList: ['餐饮','电器设备','通讯','服务','日用品食品','医疗','交通','其他'],
      submitData: {}, // 手动查验数据
      fileList: [],
      selectGroupData: [],
      userGroupList: [],
      selectData: {
        userList: [],
        groupList: [],
        deptByConditionList: [],
        invSelectList: []
      },
      pageState: 'create',
      dialogTitle: '',
      dialogVisible: false,
      cancelIsCallback: false,
      rules: {
        invType: [{required: true, message: '请选择发票类型', trigger: 'change'}],
        invoiceNum: [{required: true, message: '请填写发票号码', trigger: 'change'}],
        invoiceCode: [],
        totalAmount: [],
        checkCode: [],
        amountInFiguers: [{ required: true, message: '请填写价税合计', trigger: 'change' }],
        invoiceDate: [{required: true, message: '请选择开票日期', trigger: 'change'}],
        invoiceFile: [
          { validator: this.validateInvoiceFile, message: '请上传发票', trigger: 'change' }
        ],
        sellerRegisterNum: []
      },
    }
  },
  created() {
    this.getallSelectdata()
  },
  methods: {
    onSuccessUploadInvoice(response,file,fileList){
      this.invoiceList = fileList
      this.submitData.invPath = response.data[0].address
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('invoiceFile')
    },
    onRemoveUploadInvoice(){
      this.invoiceList = []
      this.submitData.invPath = ''
      this.$refs.ruleForm && this.$refs.ruleForm.validateField('invoiceFile')
    },
    async getallSelectdata() {
      this.selectData.userList = this.$store.getters.userList
      queryZZWorkGroupUrl().then(res => {
        this.selectData.groupList = res.data
      })
      queryDeptByCondition({isactive: 1}).then(res => {
        this.selectData.deptByConditionList = res.data
      })
      // 发票类型
      if (this.typeList.length <= 0){
        querycustSelectClass({classId: 1175}).then(res => {
          this.typeList = res.data['1175']
        })
      }
    },
    // 自定义校验：当未上传发票文件时必填
    validateInvoiceFile(rule, value, callback) {
      if (!this.invoiceList || this.invoiceList.length === 0) {
        callback(new Error('请上传发票'))
      } else {
        callback()
      }
    },
    handleChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      this.fileList = fileList;
    },
    // 识别
    handleIdentify() {
      if (!this.invoiceInfo.deliveryType){
        this.$message.warning({
          message: '请先选择交票类型！',
          duration: 6000
        })
        return false
      }
      if (!this.$commonUtils.formValidate(this.$refs['ruleForm'])) return
      this.submitData.deliveryType = this.invoiceInfo.deliveryType
      createInvoice(this.submitData).then(res => {
        this.$nextTick(() => {
          if (res.data.veriCode != 0){
            this.$message.warning({
              message: res.data.veriMessge,
              duration: 6000
            })
          }else {
            this.$message.success({
              message: res.data.veriMessge,
              duration: 6000
            })
            //防止接口400 给invoiceDetails赋空数组
            if (!res.data.invoiceDetails) {
              res.data.invoiceDetails = []
            }
            this.invoiceInfo = res.data

            this.queryWorkByUserId()
          }
        })
      });
    },
    invoiceView(row) {
      this.dialogTitle = '发票-查看'
      this.pageState = 'view'
      this.defaultDataInit(row)
    },
    libraryCreate(deliveryType) {
      this.dialogTitle = '发票-查验'
      this.pageState = 'create'
      this.invoiceInfo = {}
      this.$set(this.invoiceInfo,'deliveryType',parseInt(deliveryType))
      this.$set(this.invoiceInfo,'invUserId',this.$store.getters.userId)
      this.defaultDataInit()
    },
    libraryEdit(row) {
      // if (row.flag != 1) {
      //   this.$message.warning({
      //     message: '您无权限修改',
      //     duration: 6000
      //   });
      //   return
      // }
      this.dialogTitle = '发票-编辑'
      this.pageState = 'edit'
      this.defaultDataInit(row)
    },
    feeLibraryEdit(row) {
      this.dialogTitle = '发票-编辑'
      this.pageState = 'edit'
      this.cancelIsCallback = true
      this.defaultDataInit(row)
    },
    defaultDataInit(row) {
      this.dialogVisible = true
      if (this.pageState == 'create') {
        this.queryWorkByUserId()
      }else{
        this.invoiceInfo = JSON.parse(JSON.stringify(row))
        this.queryWorkByUserId('true')
      }
    },
    changeCostWkg(){
      if (this.userGroupList.find(item=> item.wkgId == this.invoiceInfo.wkgId)){
        var group = this.userGroupList.find(item=> item.wkgId == this.invoiceInfo.wkgId)
        this.$set(this.invoiceInfo,'domainId',group.domainId)
        this.$set(this.invoiceInfo,'domainIdStr',group.domainName)
      }
    },
    queryWorkByUserId(state) {
      queryWorkByUserId({userId: this.invoiceInfo.invUserId}).then(res => {
        if (res.data.groups && res.data.groups.length) {
          this.userGroupList = res.data.groups
          const uniqueGroups = Array.from(new Set(res.data.groups.map(item => item.wkgId)));
          this.selectGroupData = this.selectData.groupList.filter(ite => uniqueGroups.includes(ite.wkgId));
          if (state!='true') {
            this.$set(this.invoiceInfo,'domainId',res.data.groups[0].domainId)
            this.$set(this.invoiceInfo,'domainIdStr',res.data.groups[0].domainName)
            this.$set(this.invoiceInfo,'wkgId',res.data.groups[0].wkgId)
          }
        }
      })
    },
    // 上传成功
    onsuccess(res, file) {
      this.loading = false
      if (this.fileSuffix == 'zip'){
        if (res.success){
          this.$message.success({
            message: '压缩包解析时间较长，此页面将被关闭，解析成功后将右侧消息通知，请注意查看！',
            duration: 6000
          })
          this.handleClose()
        }else{
          this.$message.warning({
            message: res.message,
            duration: 6000
          })
        }
        return
        // this.$nextTick(()=>{
        //   this.$alert('压缩包解析时间较长，此页面将被关闭，请稍后刷新查看！', '提示', {
        //     confirmButtonText: '确定',
        //     callback: action => {
        //       this.handleClose()
        //     }
        //   });
        // })
      }else{
        if (res.success){
          this.invoiceInfo = res.data
          if (this.invoiceInfo.veriCode != 0){
            this.$message.warning({
              message: this.invoiceInfo.veriMessge,
              duration: 6000
            })
          }else {
            this.$message.success({
              message: res.data.veriMessge,
              duration: 6000
            })
          }
        }else{
          if (res.message && res.message.includes('已存在')){
            this.returnExistMessage(res.message)
          }else {
            var message = res.message ? res.message : '发票识别异常！'
            this.$message.warning({
              message: message,
              duration: 6000
            })
          }
        }
      }
    },
    // 返回存在消息
    returnExistMessage(message) {
      this.$alert(message, '发票已存在', {
        confirmButtonText: '确定',
        type: 'warning',
        callback: action => {}
      });
    },
    beforeAvatarUpload(file) {
      if (!this.invoiceInfo.deliveryType) {
        this.$message.info({
          message: '请先选择交票类型！',
          duration: 6000
        });
        return false;
      }
      if (!this.invoiceInfo.invUserId) {
        this.$message.info({
          message: '请先选择发票所属人',
          duration: 6000
        });
        return false;
      }

      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
      const whiteList = ["pdf", "jpeg", "jpg", "png", "zip", "ofd"];
      const pictureWhiteList = ["jpeg", "jpg", "png"];
      this.fileSuffix = fileSuffix;

      if (!whiteList.includes(fileSuffix)) {
        this.$message.error({
          message: '只能上传PDF、JPG、PNG、OFD和ZIP格式的文件',
          duration: 6000
        });
        return false;
      }

      // 百度识别信息要求
      if (pictureWhiteList.indexOf(fileSuffix) !== -1) {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          this.$message.error({
            message: '上传图片大小不能超过 5MB!',
            duration: 6000
          });
          return false;
        }

        // 图片尺寸校验，边长最小15px，最大4096px
        return new Promise((resolve, reject) => {
          let img = new Image();
          let fileBlobName = (window.createObjectURL || window.URL.createObjectURL || window.webkitURL.createObjectURL)(file);
          img.src = fileBlobName;

          img.onload = () => {
            const resWidth = img.width >= 15 && img.width <= 4096;
            const resHeight = img.height >= 15 && img.height <= 4096;
            if (resWidth && resHeight) {
              resolve();
            } else {
              reject(new Error('识别图片尺寸不符，可能导致识别失败!'));
            }
          };

          img.onerror = () => {
            reject(new Error('图片加载失败!'));
          };
        })
          .then(() => {
            // 处理成功后的逻辑
            this.loading = true;
            return true;
          })
          .catch(error => {
            // 处理错误情况
            this.$alert(error.message, '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              callback: action => {
                // 在错误回调中执行逻辑，如果需要的话
              }
            });
            return false;
          });
      }

      // 如果不是图片类型文件，则直接进行上传
      this.loading = true;
      return true;
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
    async submit(type) {
      // if (!this.$commonUtils.formValidate(this.$refs['ruleForm'])) return
      if (!this.invoiceInfo.amountInFiguers){
        this.$message.error({
          message: '请输入价税合计！',
          duration: 6000
        });
        return false;
      }
      delete this.invoiceInfo.flag

      var data = JSON.parse(JSON.stringify(this.invoiceInfo))
      modifyInvoice(data).then(res => {
        if (res.success) {
          this.dialogVisible = false
          this.$message.success({
            message: res.message,
            duration: 6000
          })
          this.cancelIsCallback = false
          this.$emit('cancel',data.invId)
        }
      });
    },
    handleClose() {
      if (this.pageState == 'create' && this.invoiceInfo.invId){
        this.$emit('cancel',this.invoiceInfo.invId)
      }
      this.loading = false
      this.fileList = []
      this.invoiceInfo = []
      this.submitData = []
      this.invoiceList = []
      this.dialogVisible = false
      if (this.cancelIsCallback){
        this.$emit('cancel')
      }
    }
  },
  watch: {
    'submitData.invType': function(newVal) {
      // 关闭之前的验证提示
      if (this.$refs.ruleForm){
        this.$nextTick(()=>{
          this.$refs.ruleForm.clearValidate();
        })
      }

      let invoiceCodeRules = [{ required: true, message: '请填写发票代码', trigger: 'change' }];
      let totalAmountRules = [{ required: true, message: '请填写合计金额(不含税)', trigger: 'change' }];
      if (newVal === '专用发票' || newVal === '电子专用发票') {
        this.rules.invoiceCode = invoiceCodeRules
        this.rules.totalAmount = totalAmountRules
        this.rules.checkCode = [];
        this.$refs.checkCode && this.$refs.ruleForm.clearValidate(['checkCode']);
        this.rules.sellerRegisterNum = [];
        this.$refs.sellerRegisterNum && this.$refs.ruleForm.clearValidate(['sellerRegisterNum']);
      } else if (newVal === '电子发票（专用发票）' || newVal === '电子发票（普通发票）' || newVal === '电子发票（铁路电子客票）') {
        this.rules.invoiceCode = [];
        this.$refs.invoiceCode && this.$refs.ruleForm.clearValidate(['invoiceCode']);
        this.rules.totalAmount = [];
        this.$refs.totalAmount && this.$refs.ruleForm.clearValidate(['totalAmount']);
        this.rules.checkCode = [];
        this.$refs.checkCode && this.$refs.ruleForm.clearValidate(['checkCode']);
        this.rules.sellerRegisterNum = [];
        this.$refs.sellerRegisterNum && this.$refs.ruleForm.clearValidate(['sellerRegisterNum']);
      } else if (newVal === '电子发票（航空运输电子客票行程单）') {
        this.rules.invoiceCode = [];
        this.$refs.invoiceCode && this.$refs.ruleForm.clearValidate(['invoiceCode']);
        this.rules.totalAmount = [];
        this.$refs.totalAmount && this.$refs.ruleForm.clearValidate(['totalAmount']);
        this.rules.checkCode = [];
        this.$refs.checkCode && this.$refs.ruleForm.clearValidate(['checkCode']);
        this.rules.sellerRegisterNum = [];
        this.$refs.sellerRegisterNum && this.$refs.ruleForm.clearValidate(['sellerRegisterNum']);
      } else if (newVal === '普通发票' || newVal === '电子普通发票' || newVal === '卷式普通发票') {
        this.rules.invoiceCode = invoiceCodeRules
        this.rules.checkCode = [{ required: true, message: '请填写校验码后6位', trigger: 'change' }];
        this.rules.totalAmount = [];
        this.$refs.totalAmount && this.$refs.ruleForm.clearValidate(['totalAmount']);
        this.rules.sellerRegisterNum = [];
        this.$refs.sellerRegisterNum && this.$refs.ruleForm.clearValidate(['sellerRegisterNum']);
      } else if (newVal === '通用（电子）发票') {
        this.rules.invoiceCode = invoiceCodeRules
        this.rules.sellerRegisterNum = [{ required: true, message: '请填写销售方纳税人识别号', trigger: 'change' }];
        this.rules.checkCode = [];
        this.$refs.checkCode && this.$refs.ruleForm.clearValidate(['checkCode']);
        this.rules.totalAmount = [];
        this.$refs.totalAmount && this.$refs.ruleForm.clearValidate(['totalAmount']);
      }  else {
        this.rules.invoiceCode = invoiceCodeRules
        this.rules.totalAmount = totalAmountRules
        this.rules.checkCode = [];
        this.$refs.checkCode && this.$refs.ruleForm.clearValidate(['checkCode']);
        this.rules.sellerRegisterNum = [];
        this.$refs.sellerRegisterNum && this.$refs.ruleForm.clearValidate(['sellerRegisterNum']);
      }
    },
  },
  components: {

  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  max-height: 80vh;
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
      /deep/ .el-form-item__error {
        position: relative !important;
        top: -5px;
      }
    }
  }
}

.content {
  width: 100%;
  border: 1px solid #D7D7D7;
  margin: 10px 0 10px;
  padding: 5px;
}
.button_wrap {
  margin: 10px 0 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  .el-button{
    margin-left: 30px;
  }
}
.div-form {
  width: 100%;
  display: inline-block;
}
.TaskRecordWrap {
  width: 18%;
  margin-top: 20px;
  float: right;
}
/deep/ .el-upload{
  width: 100%;
}
/deep/ .el-upload-dragger{
  width: 100%;
  height: 100px;
  .el-icon-upload{
    margin: 5px 0 16px;
  }
}
.invoice-fpgl{
  color: #52A0F5;
  cursor:pointer;
}
.el-table{
  /deep/ th{
    padding:5px 0;
    color: rgba(51, 51, 51, 1);
    background: rgba(187, 187, 187, 0.5);
  }
  /deep/ td {
    padding: 0 ;
  }
}
.required-asterisk{ color:#F56C6C; margin-right:4px; }
.invoice-upload-btn{
  /deep/ .el-upload{
    text-align: left;
  }
}
</style>

