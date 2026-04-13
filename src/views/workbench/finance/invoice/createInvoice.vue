<template>
  <el-dialog
    :title="getTitle"
    append-to-body
    :visible.sync="createInvoiceState"
    width="60%"
    height="800"
    :modal="false"
    top="0"
    :before-close="handleClose"
    :close-on-click-modal="false"
    v-dialogDrag
  >
    <template v-if="pageState!='view'">
      <el-form :model="submitData" :rules="rules" ref="ruleForm"  label-width="156px" >
        <el-row>
          <el-form-item label="申请日期:" >
            <el-date-picker
              v-model="submitData.appDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发票领取人:" prop="receiverUserId">
            <virtual-select clearable :isUser="true" :data="$store.getters.userList" v-model="submitData.receiverUserId"  filterable :render="(data)=>$commonUtils.UserRender(data)" />

<!--            <el-select v-model="submitData.receiverUserId"-->
<!--                       placeholder="请选择"-->
<!--                       filterable-->
<!--                       clearable>-->
<!--              <el-option-->
<!--                v-for="item in userList"-->
<!--                :key="item.userId"-->
<!--                :label="item.fullname"-->
<!--                :value="item.userId">-->
<!--                <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--              </el-option>-->
<!--            </el-select>-->
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发票送达邮箱:" >
            <el-input v-model="submitData.receiverMail" placeholder="请输入内容" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="账单发票:" prop="receiptType">
            <el-radio v-model="submitData.receiptType" :label="1">无账单发票</el-radio>
            <el-radio v-model="submitData.receiptType" :label="0">有账单发票</el-radio>
          </el-form-item>
        </el-row>

        <el-row v-if="submitData.receiptType!=1&&billIdList">
          <el-form-item label="账单号:" >
            {{submitData.billNos}}
          </el-form-item>
          <el-form-item label="账单金额:" >
            {{submitData.billTotal}}
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.receiptType!=1&&!billIdList">
          <el-form-item label="账单号:" >
            <el-input v-model="submitData.billNos" placeholder="请输入账单号，多个用;隔开" clearable @change="billNosChange"></el-input>
          </el-form-item>
          <el-form-item label="账单金额:" >
            {{submitData.billTotal}}
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.receiptType==1">
          <el-form-item label="无账单发票收款状态:">
            <el-input v-model="submitData.noBillPayStatus" placeholder="请输入内容" clearable></el-input>
          </el-form-item>
          <el-form-item label="无账单发票收款日期:">
            <el-date-picker
              v-model="submitData.noBillPayDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row v-if="billIdList">
          <el-form-item label="客户:" >
            {{submitData.custFullName}}
          </el-form-item>
        </el-row>
        <el-row v-else>
          <el-form-item label="客户:" >
            <el-select
              v-model="submitData['custId']"
              ref="custSelect"
              filterable
              clearable
              remote
              reserve-keyword
              placeholder="请输入客户姓名"
              @change="customerChange"
              :remote-method="queryCustomerList">
              <el-option
                v-for="item in customerNameIdList"
                :key="item.custId"
                :label="item.fullname"
                :value="item.custId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row v-if="billIdList">
          <el-form-item label="案件文号:">
            {{submitData.showRefno}}
          </el-form-item>
        </el-row>
        <el-row v-if="!billIdList">
          <el-form-item label="案件文号:">
            <el-input v-model="submitData.showRefno" placeholder="请输入内容" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发票抬头:" prop="receiptTitle">
            <Autocomplete v-model="submitData.receiptTitle" type="accName" :list="bankaccountList"> </Autocomplete>
<!--            <el-autocomplete class="inline-input" :clearable='true' v-model="submitData.receiptTitle" :fetch-suggestions="remotepinput" placeholder="请输入内容" :trigger-on-focus="true">-->
<!--            </el-autocomplete>-->
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="税号:">
            <el-input v-model="submitData.taxNo" placeholder="请输入内容" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="开户行及账号:">
            <el-input v-model="submitData.bankName" placeholder="请输入开户行" clearable style="margin-right: 15px" title="请输入开户行"></el-input>
            <el-input v-model="submitData.account" placeholder="请输入账号" clearable title="请输入账号"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="地址和电话:">
            <el-input v-model="submitData.addr" placeholder="请输入地址" clearable style="margin-right: 15px" title="请输入地址"></el-input>
            <el-input v-model="submitData.tel" placeholder="请输入电话" clearable title="请输入电话"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="国税发票:" prop="stateTaxReceipt">
            <el-select v-model="submitData.stateTaxReceipt" placeholder="请选择"   filterable
                       clearable>
              <el-option
                v-for="item in ['国税专票','国税普票（电子）','国税普票','作废票','全电专票','全电普票']"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属公司:"  prop="companyId" >
            <el-select v-model="submitData.companyId" placeholder="请选择"   filterable
                       clearable>
              <el-option
                v-for="item in receiptCompanyList"
                :key="item.repCompId"
                :label="item.fullname"
                :value="item.repCompId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发票性质:" prop="receiptClass" >
            <el-select v-model="submitData.receiptClass" placeholder="请选择"   filterable
                       clearable>
              <el-option
                v-for="item in ['客户开发票', '财务开发票']"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作废原因:">
            <el-select v-model="submitData.cancelReasons" placeholder="请选择"   filterable
                       clearable>
              <el-option
                v-for="item in ['客户原因','财务原因','业务原因']"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="附件:">
            <el-upload class="upload-demo"
                       :before-remove="brforeRemoveFile"
                       drag
                       ref="uploadFile"
                       :on-preview="onPreview"
                       multiple
                       :data="uploadFileData" :action="creatematerialUrl" name="attachFile"
                       :on-success="successCallback" :before-upload="beforeupload"
                       :on-remove="handleRemove"
                       :file-list="submitData.materialList"
                       >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
            </el-upload>
          </el-form-item>
        </el-row>
        <div style="width: 100%" class="title"><i>发票明细</i><el-button class="title_right" type="primary" size="mini" @click="submitData.details.push({unitPrice:0,number:1})">新增</el-button></div>
        <div style="width: 100%;">
          <el-table
            :data="submitData.details">
            <el-table-column  label="发票项目" align="left">
              <template slot-scope="scope">
<!--                <el-select v-model="scope.row.item" @change="(e)=>scope.row.itemType=receiptIitemList.find(item=>item.item==e).itemType" placeholder="请选择"   filterable-->
<!--                           clearable>-->
<!--                  <el-option-->
<!--                    v-for="item in receiptIitemList"-->
<!--                    :key="item.item"-->
<!--                    :label="item.item"-->
<!--                    :value="item.item">-->
<!--                  </el-option>-->
<!--                </el-select>-->
                <el-autocomplete
                  v-model="scope.row.item"
                  :fetch-suggestions="(queryString, cb)=>cb(receiptIitemList)"
                  placeholder="请输入内容"
                  @select="(item)=>scope.row.itemType=item.itemType"
                ></el-autocomplete>
              </template>
            </el-table-column>
            <el-table-column  label="项目类型" align="left">
              <template slot-scope="scope">
                <el-select v-model="scope.row.itemType" placeholder="请选择"   filterable
                           clearable>
                  <el-option
                    v-for="item in ['代理费','官费','代收款']"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column  label="单价" align="left">
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.unitPrice" placeholder="请输入内容" clearable></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="数量" align="left">
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.number" placeholder="请输入内容" clearable></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="单位" align="left">
              <template slot-scope="scope">
                <el-select v-model="scope.row.unit" placeholder="请选择"   filterable
                           clearable>
                  <el-option
                    v-for="item in ['件','个','批','年']"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column  label="金额" align="left">
              <template slot-scope="scope">
                {{scope.row.amount=scope.row.number*scope.row.unitPrice}}
<!--                <el-input :value="scope.row.amount=scope.row.number*scope.row.unitPrice" placeholder="请输入内容" clearable></el-input>-->
              </template>
            </el-table-column>
            <el-table-column  label="操作" align="left">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="submitData.details.splice(scope.$index,1)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row>
          <el-form-item label="发票金额:">
            {{submitData.receiptTotal}}
            <!--          <el-input v-model="submitData.receiptTotal" placeholder="请输入内容" clearable></el-input>-->
          </el-form-item>
        </el-row>
        <div style="width: 100%" class="title">财务填写</div>
        <el-row>
          <el-form-item label="国税票金额:">
<!--            <el-input v-model="submitData.stateTaxTotal" @change="getTaxAmount" placeholder="请输入内容" clearable></el-input>-->
            {{submitData.stateTaxTotal}}
          </el-form-item>
          <el-form-item label="国税票号:">
            <el-input v-model="submitData.stateTaxNo" placeholder="请输入内容" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="税率:">
            <el-select v-model="submitData.taxRate" @change="getTaxAmount" placeholder="请选择"   filterable
                       clearable>
              <el-option
                v-for="item in [1,3,6,9,17,0]"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="税额:">
            <el-input v-model="submitData.taxAmount" placeholder="请输入内容" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="不含税金额:">
            <el-input v-model="submitData.taxExcept" placeholder="请输入内容" clearable></el-input>
          </el-form-item>
          <el-form-item label="价税合计:">
            <el-input v-model="submitData.priceTaxTotal" placeholder="请输入内容" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="申请开票人:">
            <virtual-select clearable :isUser="true" :data="$store.getters.userList" v-model="submitData.appUserId"  filterable :render="(data)=>$commonUtils.UserRender(data)" />

<!--            <el-select v-model="submitData.appUserId" placeholder="请选择"   filterable-->
<!--                       clearable-->
<!--            >-->
<!--              <el-option-->
<!--                v-for="item in userList"-->
<!--                :key="item.userId"-->
<!--                :label="item.fullname"-->
<!--                :value="item.userId">-->
<!--                <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--              </el-option>-->
<!--            </el-select>-->
          </el-form-item>
          <el-form-item label="开票人:">
            <virtual-select clearable :isUser="true" :data="$store.getters.userList" v-model="submitData.optId"  filterable :render="(data)=>$commonUtils.UserRender(data)" />

<!--            <el-select v-model="submitData.optId" placeholder="请选择"   filterable-->
<!--                       clearable  >-->
<!--              <el-option-->
<!--                v-for="item in userList"-->
<!--                :key="item.userId"-->
<!--                :label="item.fullname"-->
<!--                :value="item.userId">-->
<!--                <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--              </el-option>-->
<!--            </el-select>-->
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="审核日期:">
            <el-date-picker
              v-model="submitData.auditDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="开票日期:">
            <el-date-picker
              v-model="submitData.optDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发票票面备注:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="submitData.receiptRemarks"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="submitData.remarks"
            >
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveReceipt(1,'保存')">保存</el-button>
        <el-button type="primary" @click="saveReceipt(1,'提交')" v-if="this.pageState=='create'||submitData.taskNo==1">提交</el-button>
       <el-button  @click="$emit('close')">取消</el-button>
      </span>
    </template>
    <template v-if="pageState=='view'">
      <el-form  ref="submission"  label-width="156px" >
        <el-row>
          <el-form-item label="申请日期:" >
           {{submitData.appDate}}
          </el-form-item>
          <el-form-item label="发票领取人:">
            {{transformation(userList,submitData.receiverUserId,'userId','fullname')}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发票送达邮箱:" >
            {{submitData.receiverMail}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="账单发票:" >
            {{submitData.receiptTypeName}}
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.receiptType!=1">
          <el-form-item label="账单号:" >
            {{submitData.billNos}}
          </el-form-item>
          <el-form-item label="账单金额:" >
            {{submitData.billTotal}}
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.receiptType==1">
         {{submitData.noBillPayStatus}}
          <el-form-item label="无账单发票收款日期:">
            {{submitData.noBillPayDate}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="客户:" >
            {{submitData.custFullName}}
          </el-form-item>
        </el-row>
        <el-row >
          <el-form-item label="案件文号:">
            {{submitData.showRefno}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发票抬头:">
           {{submitData.receiptTitle}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="税号:">
           {{submitData.taxNo}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="开户行及账号:">
            {{(submitData.bankName || '') + ' ' + (submitData.account || '')}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="地址和电话:">
           {{(submitData.addr || '') + ' ' + (submitData.tel || '')}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="国税发票:">
            {{submitData.stateTaxReceipt}}
          </el-form-item>
          <el-form-item label="所属公司:">
            {{transformation(receiptCompanyList,submitData.companyId,'repCompId','fullname')}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发票性质:">
           {{submitData.receiptClass}}
          </el-form-item>
          <el-form-item label="作废原因:">
           {{submitData.cancelReasons}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="附件:">
            <p v-for="item in submitData.materialList" :key="item.address">
              <a style="color: #409EFF" target="_blank" @click="onPreview(item)" >{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
        <div style="width: 100%" class="title"><i>发票明细</i></div>
        <div style="width: 100%;">
          <el-table
            :data="submitData.details">
            <el-table-column  label="发票项目" align="left">
              <template slot-scope="scope">
                {{scope.row.item}}
              </template>
            </el-table-column>
            <el-table-column  label="项目类型" align="left">
              <template slot-scope="scope">
               {{scope.row.itemType}}
              </template>
            </el-table-column>
            <el-table-column  label="单价" align="left">
              <template slot-scope="scope">
                {{scope.row.unitPrice}}
              </template>
            </el-table-column>
            <el-table-column  label="数量" align="left">
              <template slot-scope="scope">
                {{scope.row.number}}
              </template>
            </el-table-column>
            <el-table-column  label="单位" align="left">
              <template slot-scope="scope">
                {{scope.row.unit}}
              </template>
            </el-table-column>
            <el-table-column  label="金额" align="left">
              <template slot-scope="scope">
                {{scope.row.amount}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row>
          <el-form-item label="发票金额:">
            {{submitData.receiptTotal}}
            <!--          <el-input v-model="submitData.receiptTotal" placeholder="请输入内容" clearable></el-input>-->
          </el-form-item>
        </el-row>
        <div style="width: 100%" class="title">财务填写</div>
        <el-row>
          <el-form-item label="国税票金额:">
           {{submitData.stateTaxTotal}}
          </el-form-item>
          <el-form-item label="国税票号:">
            {{submitData.stateTaxNo}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="税率:">
           {{submitData.taxRate}}

          </el-form-item>
          <el-form-item label="税额:">
           {{submitData.taxAmount}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="不含税金额:">
            {{submitData.taxExcept}}
          </el-form-item>
          <el-form-item label="价税合计:">
           {{submitData.priceTaxTotal}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="申请开票人:">
            {{transformation(userList,submitData.appUserId,'userId','fullname')}}
          </el-form-item>
          <el-form-item label="开票人:">
            {{transformation(userList,submitData.optId,'userId','fullname')}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="审核日期:">
           {{submitData.auditDate}}
          </el-form-item>
          <el-form-item label="开票日期:">
          {{submitData.optDate}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发票票面备注:">
           {{submitData.receiptRemarks}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注:">
            {{submitData.remarks}}
          </el-form-item>
        </el-row>
      </el-form>
    </template>
  </el-dialog>
</template>

<script>
import {queryBillReceipt,queryReceiptIitem,queryReceiptCompany, queryBankaccountListBycustId,saveReceipt,queryCustomerNameId,queryReceiptDetail ,submitReceipt,delCaseMaterial, recordOnlienEdit} from "@/api/caseList"
import {getUser} from "@/api/user"
import {formatAmount,fomatFloat,toFixed1,toFixed2} from '@/utils/filters'
import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
import { creatematerialUrl } from "@/api/serviceApi.config.js";
export default {
  name: "createInvoice",
  props:{
    createInvoiceState:{
      default: false
    },
    billIdList:{

    },
    pageState:{

    },
    receiptId:{}
  },
  data(){
    return {
      receiverUserList:[],
      userList:[],
      appUserIdUserList:[],
      optIdUserList:[],
      uploadFileData: {
        materialTypeId: 1074,
        tokenID: this.$store.getters.token
      },
      creatematerialUrl,
      submitData:{
        bankName: '',
        account: '',
        addr: '',
        tel: '',
        receiverUserId:null,
        details:[{unitPrice:0,number:1}],
        taxNo:'',
        bankNameAndAccount:'',
        addrAndTel:'',
        bankName:'',
        receiptTitle:'',
        receiptTotal:0,
        appDate:'',
        receiverMail:'',
        cancelReasons:'',
        receiptClass:'',
        receiptType:'',
        companyId:'',
        billNos:'',
        billTotal:'',
        stateTaxReceipt:'',
        noBillPayStatus:'',
        noBillPayDate:'',
        custFullName:'',
        receiptRemarks:'',
        remarks:'',
        optDate:'',
        auditDate:'',
        stateTaxNo:'',
        stateTaxTotal:'',
        optIdappUserId:'',
        priceTaxTotal:'',
        taxExcept:'',
        taxRate:'',
        taxAmount:'',
        custId:null,
      },
      rules: {
        receiverUserId: [
          {required: true, message: '请选择发票领取人', trigger: 'change'},
        ],
        receiptType: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
        receiptTitle: [
          {required: true, message: '请填写发票抬头', trigger: 'change'},
        ],
        stateTaxReceipt:[
          {required: true, message: '请填写国税发票', trigger: 'change'},
        ],
        companyId:[
          {required: true, message: '请填写所属公司', trigger: 'change'},
        ],
        receiptClass:[
          {required: true, message: '请填写发票性质', trigger: 'change'},
        ]
      },
      receiptIitemList:[],
      bankaccountList:[],
      receiptCompanyList:[],
      noBillPayStatus:'',
      customerNameIdList:[],
      materialIdList:[]
    }
  },
  created() {
    this.getUser()
    this.queryReceiptIitem()
    this.queryReceiptCompany()
  },
  mounted() {
    if(this.pageState=='create'&&this.billIdList){
      this.queryBillReceipt({ billIdList: this.billIdList.map(item => item.billId) })
    }
    if(this.pageState=='create'){
      this.$set(this.submitData, 'taxRate', 6)
    }
    if(this.pageState=='create'&&!this.billIdList){
      this.submitData.appDate=this.submitData.appDate?this.submitData.appDate:this.$commonUtils.formatDate1(new Date())
      this.submitData.receiverUserId=this.$store.getters.userId
    }
    if(this.pageState=='edit'||this.pageState=='view'){
      this.queryReceiptDetail()
    }
  },
  methods:{
    getTaxAmount(){
      if(this.submitData.stateTaxTotal&&this.submitData.taxRate||this.submitData.taxRate==0){
        // this.submitData.taxAmount=((this.submitData.taxRate*this.submitData.stateTaxTotal*0.01)/(1 + this.submitData.taxRate*0.01)).toFixed(2)
        this.submitData.taxAmount = 0
        this.submitData.details.map(i => i.unitPrice*i.number).forEach(item => {
          this.submitData.taxAmount = (Number(this.submitData.taxAmount) + Number(((this.submitData.taxRate*item*0.01)/(1 + this.submitData.taxRate*0.01)).toFixed(2))).toFixed(2)
        })
        this.submitData.taxExcept = (this.submitData.stateTaxTotal - this.submitData.taxAmount).toFixed(2)
      }
    },
    receiptTitleChange(item){
      console.log(item);
    },
    handleClose(done){
      this.$emit('close')
      return
      done()
    },
    onPreview(file){
      let data = file.address ? file : file.response.data[0]
       let url = data.address
      if (getProgID(url)||url.replace(/.+\./,"").toLocaleLowerCase()=='msg') {
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
    },
    downLoad(data){
        const url = data.address
        const downData={
          url:`ipdoc${url}`,
          success(){
            // notify.close()
          }
        }
        if(data.mailId){
          downData.downLoad=data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
    },
    successCallback(response, file, fileList){
      this.materialIdList.push(response.data[0].materialId)
    },
    beforeupload(){

    },
    handleRemove(file){

      let materialId;
        if(file.response){
          materialId=file.response.data[0].materialId
        }else {
          materialId=file.materialId
        }
      delCaseMaterial({materialIdList:materialId,objType:1111,objInstId:this.submitData.receiptId})
        this.materialIdList=this.materialIdList.filter(item=>item!=materialId)
    },
    brforeRemoveFile(){

    },
    queryReceiptDetail() {
      queryReceiptDetail({ receiptId: this.receiptId }).then(res=>{
        this.submitData = res.data
        // this.$set(this.submitData,'details',res.data.details)
        res.data.materialList.forEach( item => {
          this.materialIdList.push(item.materialId)
           if(!item.name){
             item.name=this.$commonUtils.getSuffix(item.address)
           }
        })
        queryCustomerNameId({custIdArray: this.submitData.custId}).then(res=>{
          this.customerNameIdList=res.data
        })
        queryBankaccountListBycustId({custId:this.submitData.custId}).then(res=>{
          res.data.forEach(item=>item.value=item.accName)
          this.bankaccountList=res.data
        })
      })
    },
    queryReceiptCompany(){
      queryReceiptCompany().then(res=>{
        this.receiptCompanyList=res.data
      })
    },
    queryCustomerList(query){
      if(query !== ''){
        queryCustomerNameId({ pageNo: 1, pageSize: 100,keyword:query }).then(res=>{
          this.customerNameIdList=res.data
        })
      }
    },
    async saveReceipt(checkReceipt, type){
      const [ err, data] = await this.$commonUtils.awaitWrap(this.$refs.ruleForm.validate())
      if (!data) {
        this.$message.error('请填写必填项')
        return
      }
      this.submitData.checkReceipt=checkReceipt
      if(this.submitData.receiptType==0&&this.billIdList){
        this.submitData.billIdList=this.billIdList.map(item => item.billId)
      }
      if(this.submitData.receiptType==1){
         this.submitData.billNos=null
         this.submitData.billTotal=0
      }else {
        this.submitData.noBillPayStatus=null
        this.submitData.noBillPayDate=''
      }
      // if(this.materialIdList.length==0){
      //   this.submitData.materialIdList=''
      // }else {
      //
      // }
      this.submitData.materialIdList=this.materialIdList
      delete this.submitData.receiptCaseList
      delete this.submitData.receiptBillList
      delete this.submitData.materialList
      saveReceipt(this.submitData).then(async res=>{
        if (res.messageType == -6) {
          this.$confirm(
            res.message + `是否继续${type}`,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          ).then(() => {
            this.saveReceipt(0, type)
          });
          return;
        }
        if(type=='提交'){
          this.submitData.taskId =res.data[0].taskId

          await this.submitReceipt()
        }
        this.$emit('close',true)
        this.$message.success(`${type}成功`)
      })
    },
    submitReceipt(){
      return submitReceipt({taskIdList:this.submitData.taskId})
    },
    queryBankaccountListBycustId(custId){
      queryBankaccountListBycustId({custId}).then(res=>{
        res.data.forEach(item=>item.value=item.accName)
        this.bankaccountList=res.data
        if(res.data&&res.data.length){
          this.submitData.receiptTitle=this.bankaccountList[0].value
        }
      })
    },
    getUser(){
      this.userList=this.$store.getters.userList
    },
    filterMethod(e,type){
      this[type]=this.userList.filter(item=>item.fullname.toUpperCase().includes(e.toUpperCase()))
    },
    queryReceiptIitem(){
      queryReceiptIitem().then(res => {
        res.data.forEach(item=>{
          item.value=item.item
        })
        this.receiptIitemList = res.data
      })
    },
    remotepinput(query, cb) {
      var restaurants = this.bankaccountList
      var results = query
        ? restaurants.filter(this.createStateFilter(query))
        : restaurants;

      cb(results);
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    customerChange(){
      this.queryBankaccountListBycustId(this.submitData.custId)
    },
    billNosChange(n){
      this.submitData.billNos = n.replace(/\s+/g, '')
     this.queryBillReceipt({billNos:this.submitData.billNos})
    },
    queryBillReceipt(data,type) {
     // { billIdList: this.billIdList.map(item => item.billId) }
      queryBillReceipt(data).then(res => {
        if(this.pageState == 'edit'){
          let { billTotal, addrAndTel, bankNameAndAccount, custFullName, custId, showRefno, taxNo } = res.data
          this.submitData.billTotal = billTotal
          this.submitData.custId = custId
          this.submitData.showRefno = showRefno
          this.submitData.custFullName = custFullName
          this.submitData.taxNo = taxNo
          this.submitData.bankNameAndAccount = bankNameAndAccount
          this.submitData.addrAndTel = addrAndTel

        }else{
          this.submitData = res.data
          this.$set(this.submitData, 'taxRate', 6)
        }
        this.submitData.appDate=this.submitData.appDate?this.submitData.appDate:this.$commonUtils.formatDate1(new Date())
        this.submitData.receiverUserId=this.$store.getters.userId
        if(!this.submitData.details||this.submitData.details.length==0){
          this.submitData.details=[{unitPrice:0,number:1}]
        }
        if(data.billNos){
          this.customerNameIdList=[{fullname:this.submitData.custFullName,custId:this.submitData.custId}]
          this.submitData.receiptType=0
        }
        this.queryBankaccountListBycustId(this.submitData.custId)
      })
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
    'submitData.taxAmount': {
      handler(n) {
        this.submitData.taxExcept = (this.submitData.stateTaxTotal - n).toFixed(2)
      }
    },
    'submitData.receiptTotal':{
      handler(n) {
        if(this.submitData.taxRate) {
          this.submitData.taxAmount = 0
          this.submitData.details.map(i => i.unitPrice*i.number).forEach(item => {
            this.submitData.taxAmount = (Number(this.submitData.taxAmount) + Number(((this.submitData.taxRate*item*0.01)/(1 + this.submitData.taxRate*0.01)).toFixed(2))).toFixed(2)
          })
          // this.submitData.taxAmount = ((this.submitData.taxRate*n*0.01)/(1 + this.submitData.taxRate*0.01)).toFixed(2)
        }
      }
    },
    'submitData.details':{
      handler(n){
        console.log(n);
        if(n.length>1){
          this.submitData.receiptTotal=0
          n.map(item=>item.unitPrice*item.number).forEach(item=>{
            this.submitData.receiptTotal=item+this.submitData.receiptTotal
          })
          // this.submitData.receiptTotal=n.reduce((pre,next)=>{
          //   console.log(pre,next);
          //   return (pre.unitPrice*pre.number)+(next.unitPrice*next.number)
          // })
        }else {
          if(n.length==1){
            this.submitData.receiptTotal=n[0].unitPrice*n[0].number
          }else {
            this.submitData.receiptTotal=0
          }
        }

      },
      deep:true
    },
    receiptTotalChange(n,o){
      if(n){
        this.submitData.stateTaxTotal = n
        this.submitData.taxExcept = (this.submitData.stateTaxTotal - this.submitData.taxAmount).toFixed(2)
        this.submitData.priceTaxTotal = this.submitData.stateTaxTotal
      }
    },
    // 'submitData.receiverUserId':{
    //   handler(n) {
    //     if (n) {
    //       let timer = setInterval(() => {
    //         if (this.userList && this.userList.length) {
    //           this.receiverUserList = this.userList.filter(item => item.userId == n)
    //           clearInterval(timer)
    //         }
    //       }, 100)
    //       setTimeout(() => {
    //         clearInterval(timer)
    //       }, 5000)
    //     }
    //   },
    //   deep: true
    //   // submitData.receiverUserId receiverUserList submitData.appUserId appUserIdUserList submitData.optId optIdUserList
    // },
    // 'submitData.appUserId':{
    //   handler(n) {
    //     if (n) {
    //       let timer = setInterval(() => {
    //         if (this.userList && this.userList.length) {
    //           this.appUserIdUserList = this.userList.filter(item => item.userId == n)
    //           clearInterval(timer)
    //         }
    //       }, 100)
    //       setTimeout(() => {
    //         clearInterval(timer)
    //       }, 5000)
    //     }
    //   },
    //   deep: true
    //   // submitData.receiverUserId receiverUserList submitData.appUserId appUserIdUserList submitData.optId optIdUserList
    // },
    // 'submitData.optId':{
    //   handler(n) {
    //     if (n) {
    //       let timer = setInterval(() => {
    //         if (this.userList && this.userList.length) {
    //           this.optIdUserList = this.userList.filter(item => item.userId == n)
    //           clearInterval(timer)
    //         }
    //       }, 100)
    //       setTimeout(() => {
    //         clearInterval(timer)
    //       }, 5000)
    //     }
    //   },
    //   deep: true
    //   // submitData.receiverUserId receiverUserList submitData.appUserId appUserIdUserList submitData.optId optIdUserList
    // },
    'submitData.receiptTitle'(n,o){
      if(this.bankaccountList&&this.bankaccountList.length){
        let obj = this.bankaccountList.find(item=>item.value == n)
        if(obj){
          this.$set(this.submitData, 'taxNo' , obj.taxNo)
          this.$set(this.submitData, 'bankName' , obj.bankName)
          this.$set(this.submitData, 'account' , obj.account)
          this.$set(this.submitData, 'addr' , obj.accAddr)
          this.$set(this.submitData, 'tel' , obj.telNo)
          // this.submitData.taxNo=obj.taxNo
          // this.submitData.bankName=obj.bankName
          // this.submitData.account=obj.account
          // this.submitData.addr=obj.accAddr
          // this.submitData.tel=obj.telNo
        }
      }
    }
  },
  computed:{
    getTitle(){
      if(this.pageState=='view'){
        return '发票查看'
      }
      if(this.pageState=='create'){
        return '发票创建'
      }
      if(this.pageState=='edit'){
        return '发票修改'
      }
    },
    receiptTotalChange(){
      return this.submitData.receiptTotal
    }
  }
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
          display: flex;
          align-items: center;
        }

      }
      .small-el-form-item-prev:before{
        content: '';
        width: 50%;
        height: 1px;
        background: #EBEEF5;
        position: absolute;
        bottom: -1px;
        right: 0;
        z-index: 1;
      }
      .small-el-form-item{
        position: relative;
        width: 50%;
        /deep/ .el-form-item__content{
          flex: 1;
          .pad20{
            padding-left: 20px;
          }
        }
      }
    }
    .el-row:nth-last-child(1){
      .el-form-item{
        border: 1px solid #EBEEF5;
      }
    }
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
  /deep/ .el-dialog{
    max-height: 100vh;
  }
  .el-table{
    width: auto;
    /deep/ tr:nth-of-type(1){
      th{
        background: #f5f7fa;
      }
    }
  }
  .title{
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
  .el-autocomplete{
    width: 95%;
  }
</style>
