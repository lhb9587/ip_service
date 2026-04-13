<template>
  <div>
    <el-radio-group v-model="type" @change="changeType">
      <el-radio :label="1">图片查验</el-radio>
      <el-radio :label="2">发票库</el-radio>
      <el-radio :label="3">手动查验</el-radio>
      <el-radio v-if="this.position == 'borrow'" :label="4">无需关联发票</el-radio>
    </el-radio-group>
    <div v-if="type == 1" class="picture-upload">
      <el-upload
        v-loading="loading"
        element-loading-text="查验中"
        class="invoice-upload"
        drag
        name="attachFile"
        :data="{tokenID: $store.getters.token}"
        :action="uploadInvoice"
        :on-success="onsuccess"
        :on-change="handleChange"
        :before-upload="beforeAvatarUpload"
        :file-list="fileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只支持格式pdf、jpg、png、ofd的增值税发票（普票、电子）<br/>jpg、png 图片小于5M, 尺寸最小15px，最大4096px</div>
      </el-upload>
    </div>
    <div v-else-if="type == 2" class="invoice-library">
      <div class="table-div">
        <el-input size="small" style="width: 280px;margin-bottom: 10px" placeholder="支持发票号码回车查询" @keyup.enter.native="querySearch" v-model="searchInput" clearable>
          <el-button slot="append" icon="el-icon-search" @click.stop="querySearch"></el-button>
        </el-input>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          max-height="350">
          <el-table-column
            prop="invType"
            label="发票类型"
            width="175">
            <template slot-scope="scope">
              <span style="cursor:pointer;" :title="scope.row.serviceType ? '消费类型：'+scope.row.serviceType : ''">{{ scope.row.invType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="invoiceNum"
            label="发票号码"
            width="110">
            <template slot-scope="scope">
              <span style="cursor:pointer;color: #52A0F5;" :title="scope.row.purchaserName" @click="preView(`${scope.row.invPath}`) ">{{ scope.row.invoiceNum }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="invUserIdStr"
            label="所属人"
            width="80">
          </el-table-column>
          <el-table-column
            prop="amountInFiguers"
            label="发票金额"
            sortable
            width="110">
            <template slot-scope="scope">
              <span style="cursor:pointer;" :title="'剩余可报销金额：'+scope.row.remainingAmount">{{ scope.row.amountInFiguers }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="invStatus"
            label="状态"
            width="70">
            <template slot-scope="scope">
              <span style="cursor:pointer;" :title="scope.row.veriMessge">{{ scope.row.invStatusStr }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="130">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" :disabled="scope.row.remainingAmount <= 0 || scope.row.invStatus === 0" type="text" size="small">关联</el-button>
              <el-button @click="handleClickEdit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button v-if="scope.row.veriCode != 0" @click="verifyAgain(scope.row)" type="text" size="small">重验</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :pager-count="5"
          layout="total, prev, pager, next, sizes"
          :page.sync="listQuery.pageNo"
          :limit.sync="listQuery.pageSize"
          @pagination="querySearch"
        />
      </div>
    </div>
    <div v-if="type == 3 || fillInfo" class="hand-upload">
      <el-form :model="submitData" :rules="rules" ref="ruleForm" label-width="150px" v-loading="loading"
               element-loading-text="查验中">
        <el-form-item label="发票类型：" prop="invType">
          <el-select v-model="submitData.invType" @change="isFillInfo = true" size="small" no-match-text="暂无数据" filterable>
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.typeName"
              :value="item.typeName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="fillInfo" label="公司名称：">
          <span class="purchaser-name-line">{{ submitData.purchaserName }}</span>
        </el-form-item>
        <el-form-item v-if="fillInfo" label="纳税人识别号：">
          {{ submitData.purchaserRegisterNum }}
        </el-form-item>
        <el-form-item label="发票代码：" prop="invoiceCode">
          <el-input type="number" size="small" v-model="submitData.invoiceCode" @change="isFillInfo = true"></el-input>
        </el-form-item>
        <el-form-item label="发票号码：" prop="invoiceNum">
          <el-input type="number" size="small" v-model="submitData.invoiceNum" @change="isFillInfo = true"></el-input>
        </el-form-item>
        <el-form-item label="校验码：" prop="checkCode">
          <el-input size="small" placeholder="校验码可只填后六位" v-model="submitData.checkCode" @change="isFillInfo = true"></el-input>
        </el-form-item>
        <el-form-item label="合计金额(不含税)：" prop="totalAmount">
          <el-input type="number" size="small" v-model="submitData.totalAmount" @change="isFillInfo = true"></el-input>
        </el-form-item>
        <el-form-item label="价税合计：" prop="amountInFiguers">
          <el-input type="number" size="small" v-model="submitData.amountInFiguers" @change="isFillInfo = true"></el-input>
        </el-form-item>
        <el-form-item label="开票日期：" prop="invoiceDate">
          <el-date-picker
            v-model="submitData.invoiceDate"
            @change="isFillInfo = true"
            type="date"
            size="small"
            style="width: 206px"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="rules.sellerRegisterNum.length > 0" label="销售方纳税人号：" prop="sellerRegisterNum">
          <el-input size="small" placeholder="销售方纳税人识别号" v-model="submitData.sellerRegisterNum" @change="isFillInfo = true"></el-input>
        </el-form-item>
        <el-form-item label="发票上传">
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
        <el-form-item>
          <el-button v-if="!fillInfo" class="btn" type="primary" size="small" @click="onSubmit">查验关联</el-button>
          <el-button v-else class="btn" :disabled="!isFillInfo" type="primary" size="small" @click="fillInfoSubmit">填充信息</el-button>
        </el-form-item>

      </el-form>
    </div>
    <div v-if="type == 4">
      <div style="margin-top: 10px">
        <p>无需查验票包括以下类型：</p>
        <p style="margin-top: 10px;margin-bottom: 10px">定额发票、卷联打车票、蓝联机票行程单、火车票、客户抬头票、财政部监制的非税收入票</p>
        <el-button class="btn" type="primary" size="small" style="display: block;margin: auto" @click="notCheck">确定</el-button>
      </div>
    </div>
    <InvoiceLibraryDetail ref="invoiceLibraryDetail" @cancel="cancel"/>
  </div>
</template>

<script>
  import { uploadInvoice,creatematerial } from "@/api/ipServiceApi.config.js";
  import {queryInvoiceLibrary, createInvoice, modifyInvoice, checkInvoice } from "@/api/caseList";
  import {querycustSelectClass } from "@/api/caseDetail";
  import Pagination from '@/components/Pagination';
  import InvoiceLibraryDetail from '@/views/workbench/finance_two/finance_invoice/finance_invoice_library/components/InvoiceLibraryDetail';
  import AuditDetail from '../../hrm/staff_management/components/AuditDetail'
  export default {
    name: "IdentifyInvoices",
    props: {
      position: {
        type: String,
        default: ''
      },
    },
    data(){
      return {
        creatematerial,
        addInvoiceFileData:{
          tokenID: this.$store.getters.token,
          subject: "发票管理",
          docName: "发票"
        },
        invoiceList:[],
        type: 1,
        loading: false,
        fillInfo: false,
        isFillInfo: true,
        uploadInvoice,
        fileList: [],
        submitData: {},
        searchInput: '',
        typeList: [],
        tableData: [],
        total: 0,
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        rules: {
          invType: [{required: true, message: '请选择发票类型', trigger: 'change'}],
          invoiceNum: [{required: true, message: '请填写发票号码', trigger: 'change'}],
          invoiceCode: [],
          totalAmount: [],
          checkCode: [],
          amountInFiguers: [{ required: true, message: '请填写价税合计', trigger: 'change' }],
          invoiceDate: [{required: true, message: '请选择开票日期', trigger: 'change'}],
          sellerRegisterNum: []
        },
      }
    },
    created() {
    },
    methods:{
      onSuccessUploadInvoice(response,file,fileList){
        this.invoiceList = fileList
        this.submitData.invPath = response.data[0].address
      },
      onRemoveUploadInvoice(){
        this.invoiceList = []
        this.submitData.invPath = ''
      },
      // 更改状态
      changeType(type) {
        if (type==2 || type == 3){
          this.submitData = {}
          this.fillInfo = false
          this.invoiceList = []
        }
      },
      // 发票库查询
      querySearch() {
        var queryData = {}
        if (this.position=='fee'){
          queryData = {
            invStatusArr: [-1,0,2,4],
            invoiceNum:this.searchInput,
            pageNo: this.listQuery.pageNo,
            pageSize: this.listQuery.pageSize
          }
        }else{
          queryData = {
            invStatusArr: [-1,0,3],
            invoiceNum:this.searchInput,
            pageNo: this.listQuery.pageNo,
            pageSize: this.listQuery.pageSize
          }
        }
        queryInvoiceLibrary(queryData).then(res=>{
          this.total = res.total
          this.tableData= res.data
        })
      },
      preView(url) {
        if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        }
      },
      beforeAvatarUpload(file) {
        const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
        const whiteList = ["pdf", "jpeg", "jpg", "png", "ofd"];
        const pictureWhiteList = ["jpeg", "jpg", "png"];
        this.fileSuffix = fileSuffix;

        if (!whiteList.includes(fileSuffix)) {
          this.$message.error({
            message: '只能上传PDF、JPG、PNG、OFD格式的文件',
            duration: 8000
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
              this.loading = true
              this.submitData = {}
              this.fillInfo = false
              this.invoiceList = []
              return true
            })
            .catch(error => {
              // 处理错误情况
              this.$message.error({
                message: error.message,
                duration: 8000
              });
              return false;
            });
        }
        this.loading = true
        this.submitData = {}
        this.invoiceList = []
        this.fillInfo = false
        return true
      },
      handleChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
        this.fileList = fileList;
      },
      // 上传成功
      onsuccess(res, file) {
        this.loading = false
        if (res.success){
          if (res.data.veriCode != -1 && res.data.veriCode != 0 && res.data.veriCode != -11){
            // 信息不全，需要补全
            this.queryTypeSelect()
            this.submitData = JSON.parse(JSON.stringify(res.data))
            this.fillInfo = true
            this.isFillInfo = false
            this.$message.warning({
              message: res.data.veriMessge,
              duration: 10000
            })
          }else {
            this.closeInvoiceSelect(res.data)
            var statusMsg = res.data.invStatus==-1 ? '，发票可用' : ''
            this.$message.success({
              message: res.data.veriMessge+statusMsg,
              duration: 8000
            })
          }

        }else{
          if (res.message && res.message.includes('已存在')){
            this.returnExistMessage(res.message)
          }else {
            var message = res.message ? res.message : '发票识别异常！'
            this.returnExistMessage(message)
          }
        }
      },
      // 返回存在消息
      returnExistMessage(message) {
        this.$alert(message, '异常提醒', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {}
        });
      },
      // 再次验真
      verifyAgain(row) {
        checkInvoice({invId: row.invId}).then(res => {
          if (res.success) {
            if (res.data.veriCode != -1 && res.data.veriCode != 0 && res.data.veriCode != -11) {
              this.$message.warning({
                message: res.data.veriMessge,
                duration: 8000
              })
            }else{
              this.$message({
                type: 'success',
                message: res.message
              });
            }
            this.querySearch()
          }
        })
      },
      // 发票库
      handleClick(row) {
        this.closeInvoiceSelect(row)
      },
      // 发票信息修改
      handleClickEdit(row) {
        this.$nextTick(() => {
          this.$refs.invoiceLibraryDetail.feeLibraryEdit(JSON.parse(JSON.stringify(row)));
        })
      },
      cancel(invId) {
        if (invId){
          if (this.tableData.find(item => item.invId == invId)){
            this.querySearch()
          }
        }
        this.$emit('cancelClose')
      },
      onSubmit() {
        if (!this.$commonUtils.formValidate(this.$refs['ruleForm'])) return
        if (!this.invoiceList.length) {
          return this.$message.error('请上传发票')
        }
        this.loading = true
        createInvoice(this.submitData).then(res => {
          this.loading = false
          if (res.data.veriCode != 0){
            this.$message.warning({
              message: res.data.veriMessge,
              duration: 8000
            })
          }else {
            this.$message.success({
              message: res.data.veriMessge,
              duration: 8000
            })
            this.$emit('closeInvoiceSelect',res.data)
          }
        }).catch( err => {
          this.loading = false
          if (err.message.includes('已存在')){
            this.returnExistMessage('此发票已存在，请在发票库检索或上传其他发票！')
          }else {
            var message = err.message ? err.message : '发票识别异常！'
            this.returnExistMessage(message)
          }
        })
      },
      // 无需查验
      notCheck() {
        this.$emit('closeInvoiceSelect',false)
      },
      // 填充信息提交
      fillInfoSubmit() {
        if (!this.$commonUtils.formValidate(this.$refs['ruleForm'])) return
        delete this.submitData.flag

        var data = JSON.parse(JSON.stringify(this.submitData))
        modifyInvoice(data).then(res => {
          if (res.data && res.data.veriCode != -1 && res.data.veriCode != 0 ){
            this.isFillInfo = false
            this.$message.warning({
              message: res.data.veriMessge,
              duration: 8000
            })
          }else{
            this.closeInvoiceSelect(res.data)
            this.fillInfo = false
            this.$message.success({
              message: res.data.veriMessge,
              duration: 8000
            })
          }
        });
      },
      closeInvoiceSelect(data) {
        var invoiceInfo = {
          invId: data.invId,
          amountInFiguers: data.amountInFiguers,
          remainingAmount: data.remainingAmount,
          invoiceNum: data.invoiceNum,
          invPath: data.invPath,
          invStatus: data.invStatus,
          purchaserName: data.purchaserName,
          deptId: data.deptId,
          veriCode: data.veriCode,
          veriMessge: data.veriMessge,
          invoiceDate: data.invoiceDate,
        }
        this.$emit('closeInvoiceSelect',invoiceInfo)
      },
      queryTypeSelect() {
        querycustSelectClass({classId: 1175}).then(res => {
          this.typeList = res.data['1175']
        })
      },
    },
    watch: {
      type(n) {
        if (n == 3 && this.typeList.length <= 0){
          this.queryTypeSelect()
        }
      },
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
      Pagination,
      InvoiceLibraryDetail
    }
  }
</script>

<style lang="scss" scoped>
.picture-upload{
  margin-top: 10px;
  min-width: 300px;
}
.invoice-library{
  width: 710px;
  margin-top: 10px;
  border: 1px dashed #d9d9d9;
  .table-div{
    margin: 10px;
  }
}
.hand-upload{
  margin-top: 10px;
  border: 1px dashed #d9d9d9;
  min-width: 380px;
}
.invoice-upload /deep/ .el-upload{
  width: 100%;
}
.invoice-upload /deep/ .el-upload-dragger{
  width: 100%;
  height: 140px;
  .el-icon-upload{
    margin: 20px 0 16px;
  }
}
.el-form {
  margin: 5px;

  .el-form-item {
    width: 100%;
    height: 100%;
    display: flex;
    border: 1px solid #EBEEF5;
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
    /deep/ .purchaser-name-line {
      display: block;
      line-height: 25px;
    }
  }
  .btn {
    margin-left: 110px;
  }

  .required-asterisk{ color:#F56C6C; margin-right:4px; }
}
</style>
