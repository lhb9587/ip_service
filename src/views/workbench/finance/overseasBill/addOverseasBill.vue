<template>
  <div class="addFeeDetail">
    <div style="flex: 1">
      <template v-if="$route.params.pageType==1 || financeType == 1">
        <aside>
          <div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 5}"
              placeholder="请输入案件文号"
              v-model="agentNums"
            >
            </el-input>
            <el-button @click="getCase">确定</el-button>
          </div>
          <span>每一行只能输入一个案件号，若想继续输入，需按“Enter”键，换行输入。</span>
        </aside>
        <h4 class="title">案件信息</h4>
        <el-table :data="caseData" border class="el-table1">
          <el-table-column type="index" width="60" label="序号" align="left">
          </el-table-column>
          <el-table-column align="left" :key="item.title" v-for="item,index in tableTitleList" :label="item.title"
                           :prop="item.value">
            <template slot-scope="scope">
              {{scope.row[item.value]}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="delCase(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-form label-width="206px" :rules="rules" :model="submitData" ref="refForm">
        <template v-if="financeType != 4">
          <h4 class="title">费用基础信息</h4>
          <el-row v-if="$route.params.pageType!=1 && financeType != 1">
            <el-form-item label="案件文号:">
              <span class="title-mx" style="cursor: pointer" @click="takeCaseDetail(submitData)">{{submitData.showRefno}}</span>
              <el-button style="margin-left: 10px" size="mini" type="primary" @click="changeCaseVisible=true">修改
              </el-button>
              <ChooseCase
                :billId="submitData.billId"
                :dialogVisible="changeCaseVisible"
                :agentNums="submitData.caseArray && submitData.caseArray.map(item=>item.agentNum).join('\n')"
                @closed="ChooseCaseClose"
                rules="custId"
                @getList="getList"></ChooseCase>
            </el-form-item>
            <el-form-item label="案由描述:">
              <el-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 3}"
                placeholder="请输入案件文号"
                v-model="submitData.caseDesc"
              >
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="账单号:" class="require" prop="billNo">
                <el-input type="text" placeholder="请输入账单号" v-model="submitData.billNo"
                          @change="(v) => {getCaseList(v, 'billNo')}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="注册国家:" class="require" prop="regCountry">
                <el-select default-first-option :clearable='true' placeholder="请选择" v-model="submitData.regCountry"
                          filterable @change="(v) => {getCaseList(v, 'regCountry')}">
                  <el-option v-for="item in countryList" :key="item.countryCn" :label="item.countryCn"
                            :value="item.countryCn">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="案件类型:" class="custom-item">
                {{submitData.caseTypes}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="客户:">
              {{submitData.custName}}
            </el-form-item>
            <el-form-item label="客户信用等级:">
              {{submitData.custLevel}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="商标案件承办组:">
              <el-select v-model="submitData.tmCaseCbWkgId" filterable clearable reserve-keyword placeholder="请选择工作组">
                <el-option v-for="itm in workgroupNamesList" :key="itm.wkgId" :label="itm.groupName" :value="itm.wkgId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="费用承担工作组:" class="require" prop="feeCostWkgId">
              <el-select v-model="submitData.feeCostWkgId" filterable clearable reserve-keyword placeholder="请选择工作组">
                <el-option v-for="itm in workgroupNamesList" :key="itm.wkgId" :label="itm.groupName" :value="itm.wkgId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="我方账单收款情况:">
              {{billData.paymentStatusStr}}
            </el-form-item>
            <el-form-item label="账单服务费:">
              {{billData.serviceCost|formatAmount}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="账单官费:">
              {{billData.officialCost|formatAmount}}
            </el-form-item>
            <el-form-item label="账单杂费:">
              {{billData.otherCost|formatAmount}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="账单总金额:">
              {{billData.billSum|formatAmount}}
            </el-form-item>
            <el-form-item label="外币总金额:">
              {{billData.foreignSum|formatAmount}}
            </el-form-item>
          </el-row>
          <h4 class="title">境外账单信息</h4>
          <el-row>
            <el-form-item label="境外账单电子版:" class="require">
              <el-upload
                ref="uploads"
                class="upload-demo1"
                drag
                :multiple="false"
                :on-success="onsuccess"
                :data="getUploadData(caseData.map(item=>item.caseId), 359)"
                :action="creatematerial"
                name="attachFile"
                :file-list="materialList.filter(i => i.materialTypeId === 359)"
                :on-remove="handleRemove1"
              >
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
            <el-form-item label="境外代理所:" class="require" prop="abroadAgencyCustId">
  <!--            <virtual-select class="virtual-select" clearable @change="changeAbroadAgencyCust" :data="hzLists"-->
  <!--                            v-model="submitData.abroadAgencyCustId" filterable>-->
  <!--            </virtual-select>-->
                  <el-select
                    default-first-option
                    clearable
                    placeholder="请选择"
                    v-model="submitData.abroadAgencyCustId"
                    filterable
                    remote
                    @change="changeAbroadAgencyCust"
                    :remote-method="queryOtherCustomerListUrl"
                  >
                    <el-option v-for="(item,key)  in hzLists" :key="key" :label="item.fullname" :value="item.custId">
                    </el-option>
                  </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="境外账单日:" class="require" prop="abroadBillDate">
              <el-date-picker
                @change="changeDate"
                v-model="submitData.abroadBillDate"
                align="right"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="境外账单号:" class="require" prop="abroadBillNo">
              <el-input type="text" v-model="submitData.abroadBillNo" placeholder="请填写境外账单号" clearable></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="境外账单费用概要:" class="require" prop="abroadContent">
              <el-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 3}"
                placeholder="请输入境外账单费用概要"
                v-model="submitData.abroadContent"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="境外账单币种:" class="require" prop="abroadCurId">
              <el-select v-model='submitData.abroadCurId' @change="changeAbroad">
                <el-option v-for="item in queryCurrencyList" :label="item.curName" :value="item.curId"
                           :key="item.curId"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="境外账单汇率:" class="require" prop="abroadExchangeRate">
              <el-input
                type="text"
                placeholder="请输入境外账单汇率"
                v-model="submitData.abroadExchangeRate"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="境外代理费（折扣后）:">
              <FocusOrBlur
                @change="changeNumTotal"
                placeholder="请输入境外代理费（折扣后）"
                v-model="submitData.abroadServiceFee">
              </FocusOrBlur>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="境外官费:">
              <FocusOrBlur
                @change="changeNumTotal"
                placeholder="请输入境外官费"
                v-model="submitData.abroadOfficialFee">
              </FocusOrBlur>
            </el-form-item>
            <el-form-item label="境外杂费:">
              <FocusOrBlur
                @change="changeNumTotal"
                placeholder="请输入境外杂费"
                v-model="submitData.abroadOtherFee">
              </FocusOrBlur>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="境外账单总金额:" class="require" prop="abroadBillSum">
              <el-input v-model="submitData.abroadBillSum" disabled></el-input>
              <!--          <FocusOrBlur-->
              <!--            @change="getPayMoney"-->
              <!--            placeholder="请输入境外账单总金额"-->
              <!--            v-model="submitData.abroadBillSum">-->
              <!--          </FocusOrBlur>-->
            </el-form-item>
            <el-form-item label="境外事务所案件联系人:">
              <el-input
                type="text"
                placeholder="请输入境外事务所案件联系人"
                v-model="submitData.agencyCustContact"
              >
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="账单类型:" prop="billStyle">
                <el-select style="width: calc(50% - 120px)" v-model='submitData.billStyle' clearable>
                  <el-option v-for="item in billStyleList" :label="item.billStyleName" :value="item.billStyle"
                             :key="item.billStyle"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="汇款附言:">
                <el-input
                  type="textarea"
                  placeholder="请输入汇款附言"
                  v-model="submitData.remittanceInformation"
                  :maxlength="140"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="账期">{{ submitData.accountPeriod }} <span v-if="submitData.accountPeriod">天</span></el-form-item>
            <el-form-item label="汇款绝限日期:">
              <el-date-picker
                v-model="submitData.remittanceDeadline"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-row>
          <el-row style="border-bottom: 1px solid #EBEEF5;">
            <el-col :span="12">
              <el-form-item label="预计付款日:">
                {{ submitData.expectedPaymentDate }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计付款月:">
                {{ submitData.expectedPaymentMonth }}
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <h4 class="title">费用基础信息</h4>
          <el-row>
            <el-form-item label="案件文号:">
              <span class="title-mx" style="cursor: pointer" @click="takeCaseDetail(submitData)">{{submitData.showRefno}}</span>
            </el-form-item>
            <el-form-item label="案由描述:">
              {{submitData.caseDesc}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="账单号:" class="require" prop="abroadBillNo">
                {{submitData.billNo}}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="注册国家:" class="require" prop="regCountry">
                {{submitData.regCountry}}
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="案件类型:" class="custom-item">
                {{submitData.caseTypes}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="客户:">
              {{submitData.custName}}
            </el-form-item>
            <el-form-item label="客户信用等级:">
              {{submitData.custLevel}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="商标案件承办组:">
              {{ transformation(workgroupNamesList,submitData.tmCaseCbWkgId,'wkgId','groupName')}}
            </el-form-item>
            <el-form-item label="费用承担工作组:" class="require" prop="feeCostWkgId">
              {{ transformation(workgroupNamesList,submitData.feeCostWkgId,'wkgId','groupName')}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="我方账单收款情况:">
              {{billData.paymentStatusStr}}
            </el-form-item>
            <el-form-item label="账单服务费:">
              {{billData.serviceCost|formatAmount}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="账单官费:">
              {{billData.officialCost|formatAmount}}
            </el-form-item>
            <el-form-item label="账单杂费:">
              {{billData.otherCost|formatAmount}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="账单总金额:">
              {{billData.billSum|formatAmount}}
            </el-form-item>
            <el-form-item label="外币总金额:">
              {{billData.foreignSum|formatAmount}}
            </el-form-item>
          </el-row>
          <h4 class="title">境外账单信息</h4>
          <el-row>
            
            <el-form-item label="境外账单电子版:" class="require">
              <a v-for="item in submitData.materialList&&submitData.materialList.filter(i => i.materialTypeId === 359)"
                 style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`" :key="item.address">{{item.materialName}}</a>
            </el-form-item>
            <el-form-item label="境外代理所:" class="require" prop="abroadAgencyCustId">
              {{submitData.agencyCustName}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="境外账单日:" class="require" prop="abroadBillDate">
              {{submitData.abroadBillDate}}
            </el-form-item>
            <el-form-item label="境外账单号:" class="require" prop="abroadBillNo">
              {{submitData.abroadBillNo}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="境外账单费用概要:" class="require" prop="abroadContent">
              {{submitData.abroadContent}}
            </el-form-item>
            <el-form-item label="境外账单币种:" class="require" prop="abroadCurId">
              {{ transformation(queryCurrencyList,submitData.abroadCurId,'curId','curName')}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="境外账单汇率:" class="require" prop="abroadExchangeRate">
              {{submitData.abroadExchangeRate}}
            </el-form-item>
            <el-form-item label="境外代理费（折扣后）:">
              {{submitData.abroadServiceFee|formatAmount}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="境外官费:">
              {{submitData.abroadOfficialFee|formatAmount}}
            </el-form-item>
            <el-form-item label="境外杂费:">
              {{submitData.abroadOtherFee|formatAmount}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="境外账单总金额:" class="require" prop="abroadBillSum">
              {{submitData.abroadBillSum|formatAmount}}
            </el-form-item>
            <el-form-item label="境外事务所案件联系人:">
              {{submitData.agencyCustContact}}
            </el-form-item>
          </el-row>
          <el-row style="border-bottom: 1px solid #EBEEF5;">
            <el-col :span="24">
              <el-form-item label="账单类型:">
                {{submitData.billStyleStr}}
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <h4 class="title">支付信息</h4>
        <el-row>
          <el-form-item label="支付凭证电子版:">
            <el-upload
              ref="uploads"
              class="upload-demo1"
              drag
              :on-success="onsuccess"
              :data="getUploadData(caseData.map(item=>item.caseId), 301560 )"
              :action="creatematerial"
              name="attachFile"
              :file-list="materialList.filter(i => i.materialTypeId === 301560)"
              :on-remove="handleRemove1"
              multiple
            >
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="财务初审日期：">
            <el-date-picker
              v-model="submitData.financialApprovalDate"
              type="date"
              placeholder="财务初审日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="购付汇:" :class="{require: ['4', '6'].includes(financeType) ? true : false}" prop="purchaseOrPayExcRate">
            <el-select clearable v-model='submitData.purchaseOrPayExcRate' @change="purchaseOrPayExcRateChange">
              <el-option v-for="item in ['购汇','付汇','抵扣账单']" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付日期:">
            <el-date-picker
              clearable
              v-model="submitData.payDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="支付币种:">
            <el-select v-model='submitData.payCurId'>
              <el-option v-for="item in queryCurrencyList" :label="item.curName" :value="item.curId"
                         :key="item.curId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="外汇牌价:">
            <el-input
              type="text"
              @change="getPayMoney"
              placeholder="请输入外汇牌价"
              v-model="submitData.foreignExchangeRate"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="支付金额（本币）:">
            <FocusOrBlur
              placeholder="支付金额（本币）"
              v-model="submitData.payMoney"></FocusOrBlur>
          </el-form-item>
          <el-form-item label="手续费:">
            <FocusOrBlur
              placeholder="请输入手续费"
              v-model="submitData.handleFee"></FocusOrBlur>
          </el-form-item>
        </el-row>
        <el-row>

          <el-form-item label="支付公司:">
            <el-select v-model="submitData.payDeptId" @change="queryPayMode" filterable clearable reserve-keyword
                       placeholder="请选择支付公司">
              <el-option v-for="itm in companyList" :key="itm.deptId" :label="itm.companyShortName" :value="itm.deptId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式:">
            <el-select v-model="submitData.payType" filterable clearable reserve-keyword placeholder="请选择方式">
              <el-option v-for="itm in payTypeList" :key="itm.payMode" :label="itm.payMode" :value="itm.payMode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="手续费支付方式:">
            <el-select v-model="submitData.handleFeePayType" filterable clearable reserve-keyword placeholder="请选择方式">
              <el-option v-for="itm in payTypeList" :key="itm.payMode" :label="itm.payMode" :value="itm.payMode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报销人:">
            <el-select v-model="submitData.reimburseUserId" filterable clearable reserve-keyword placeholder="请选择报销人">
              <el-option v-for="itm in userList" :key="itm.userId" :label="itm.fullname" :value="itm.userId">
                <UserIconAndUserName :user-id="itm.userId"></UserIconAndUserName>
              </el-option>
            </el-select>
          </el-form-item>

        </el-row>
        <h4 class="title">银行信息</h4>
        <el-row>
          <el-form-item label="银行账户:">
            <el-select @change="changeAccount" v-model="submitData.account" filterable
               >
              <el-option v-for="(itm,index) in bankAccountList.filter(item => item.account)" :key="index"
                          :label="itm.account" :value="itm.account">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="银行名称:">
            {{ customerBankaccountInfo.bankName }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="银行分行:">
            {{ customerBankaccountInfo.bankBranch }}
          </el-form-item>
          <el-form-item label="银行地址:">
            {{ customerBankaccountInfo.address }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="收款人姓名:">
            {{ customerBankaccountInfo.payeeName }}
          </el-form-item>
          <el-form-item label="收款人地址:">
            {{ customerBankaccountInfo.accAddr }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="收款人国家:">
            {{ customerBankaccountInfo.accCountry }}
          </el-form-item>
          <el-form-item label="Swift Code:">
            {{ customerBankaccountInfo.swiftcode }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="ABA No:">
            {{ customerBankaccountInfo.aba }}
          </el-form-item>
          <el-form-item label="用途代码:">
            {{ customerBankaccountInfo.purposeCode }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="银行账户备注:">
            {{ customerBankaccountInfo.memo }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="中间行或代理行名称:">
            {{ customerBankaccountInfo.agencyBankName }}
          </el-form-item>
          <el-form-item label="中间行或代理行Swift Code:">
            {{ customerBankaccountInfo.swiftCodeIntermediary }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="中间行或代理行其他信息:">
            {{ customerBankaccountInfo.agencyBankAddr }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="中间行或代理行备注:">
            {{ customerBankaccountInfo.swiftCodeIntermediaryMemo }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="银行手续费:">
            {{ customerBankaccountInfo.bankChargesStr }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Tax No:">
            {{ customerBankaccountInfo.taxNo }}
          </el-form-item>
        </el-row>
        <h4 class="title">系统信息</h4>
        <el-row>
          <el-form-item label="备注:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 3}"
              placeholder="请输入备注"
              v-model="submitData.remarks"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="同批付款金额:">
<!--            <FocusOrBlur-->
<!--              placeholder="请输入同批付款金额"-->
<!--              v-model="submitData.batchPayMoney"></FocusOrBlur>-->
            {{submitData.batchPayMoney}}
          </el-form-item>
          <el-form-item label="同批付款境外账单号:">{{submitData.batchAbroadNo}}</el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="创建人:">
            {{submitData.createUserName?submitData.createUserName:$store.getters.name}}
          </el-form-item>
          <el-form-item label="创建日期:">
            {{submitData.createDate?submitData.createDate:new Date().toLocaleDateString()}}
          </el-form-item>
        </el-row>
      </el-form>
      <div class="button_wrap">
        <el-button class="exactButton" type="primary" @click="updateFee">保存</el-button>
        <el-button v-if="financeType == 1 || financeType == 3" class="exactButton" type="primary" @click="submit(1)">提交</el-button>
        <el-button v-if="financeType == 4" class="exactButton" type="primary" @click="submit(1)">支付</el-button>
        <el-dropdown v-if="financeType == 5" @command="(v) => submit(1, v)">
          <el-button type="primary">
            初审<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">通过</el-dropdown-item>
            <el-dropdown-item :command="0">退回</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown v-if="financeType == 6" @command="(v) => submit(1, v)">
          <el-button type="primary">
            复审<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">通过</el-dropdown-item>
            <el-dropdown-item :command="0">退回</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button class="exactButton" plain @click="cancel">取消</el-button>
      </div>
<!--      <div class="button_wrap" v-if="$route.params.pageType==2 || financeType == 2">-->
<!--        <el-button class="exactButton" type="primary" @click="updateFee">保存</el-button>-->
<!--        <el-button class="exactButton" plain @click="cancel">取消</el-button>-->
<!--      </div>-->
      <!--    <div class="button_wrap" v-if="$route.params.pageType==3">-->
      <!--      <template v-if="$route.query.taskNo==1">-->
      <!--        <el-button class="exactButton" type="primary" @click="updateFee" >保存</el-button>-->
      <!--        <el-button class="exactButton" type="primary" @click="submit(1)">提交</el-button>-->
      <!--        <el-button class="exactButton" plain @click="cancel">取消</el-button>-->
      <!--      </template>-->
      <!--      <template  v-if="$route.query.taskNo!=1&&$route.query.taskNo!=6">-->
      <!--        <el-button class="exactButton" type="primary" @click="submitFee(0)" >退回</el-button>-->
      <!--        <el-button class="exactButton" type="primary" @click="submitFee(1)">通过</el-button>-->
      <!--        <el-button class="exactButton" plain @click="cancel">取消</el-button>-->
      <!--      </template>-->
      <!--      <template  v-if="$route.query.taskNo==6">-->
      <!--        <el-button class="exactButton" type="primary" @click="submitFee(1)">支付</el-button>-->
      <!--        <el-button class="exactButton" plain @click="cancel">取消</el-button>-->
      <!--      </template>-->
      <!--    </div>-->
    </div>
    <div class="TaskRecordWrap">
      <TaskRecord v-if="submitData.abroadBillId" :id="submitData.abroadBillId" :typeId="19"></TaskRecord>
    </div>

    <el-dialog title="案件选择" :modal-append-to-body="false" append-to-body :visible.sync="selectCaseVisible" width="40%">
      <el-table :data="selectCaseList" border height="450">
        <el-table-column type="index" width="60" label="序号" align="left">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.$index+1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="案件文号" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.agentNum}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="案件类型" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.caseTypeStr}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="案件名称" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.caseName}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="类别" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.goodClasses}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectCaseVisible = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {queryBankaccountListBycustId} from "@/api/caseList"
  import getPageTitle from '@/utils/get-page-title'
  import {queryUsers} from '@/api/systemList'
  import {queryCompany, queryPayMode, getCase} from "@/api/feeList";
  import {
    queryBillUrl,
    queryZZWorkGroupUrl,
    getAbroadBill,
    createAbroadBill,
    saveAbroadBill,
    submitAbroadBill,
    queryAbroadBillDetail,
    getCaseList,
    disposeAgentNum, queryBillStyle
  } from '@/api/billApi'
  import {queryCurrencyUrl} from "@/api/customerList";
  import {queryCountry, queryOtherCustomerListUrl} from '@/api/caseDetail'
  import {delCaseMaterial} from "@/api/caseList.js"
  import {creatematerial} from '@/api/ipServiceApi.config.js'
  import {formatAmount} from '@/utils/filters'
  import TaskRecord from "../components/TaskRecord";
  import ChooseCase from "../../case/components/ChooseCase";

  export default {
    components: {ChooseCase, TaskRecord},
    computed: {
      accAddrList() {
        return this.$commonUtils.unique(this.bankInfoList.filter(item => item.accAddr), 'accAddr') || []
      },
      bankNameList() {
        return this.$commonUtils.unique(this.bankInfoList.filter(item => item.bankName), 'bankName') || []
      },
      addressList() {
        return this.$commonUtils.unique(this.bankInfoList.filter(item => item.address), 'address') || []
      },
      accountList() {
        return this.$commonUtils.unique(this.bankInfoList.filter(item => item.account), 'account') || []
      },
      swiftcodeList() {
        return this.$commonUtils.unique(this.bankInfoList.filter(item => item.swiftcode), 'swiftcode') || []
      },
      isPTAgentNum() {
        return this.submitData.showRefno && this.submitData.showRefno.startsWith('PT');
      },
    },
    data() {
      return {
        billStyleList: [],
        rules: {
          billNo: [
            {required: true, message: '请填写账单号', trigger: 'change'}
          ],
          regCountry: [
            {required: true, message: '请填写注册国家', trigger: 'change'}
          ],
          feeCostWkgId: [
            {required: true, message: '请选择费用承担组', trigger: 'change'}
          ],
          abroadAgencyCustId: [
            {required: true, message: '请选择境外代理所', trigger: 'change'}
          ],
          abroadBillDate: [
            {required: true, message: '请填写境外账单日', trigger: 'change'}
          ],
          abroadBillNo: [
            {required: true, message: '请填写境外账单号', trigger: 'change'}
          ],
          abroadContent: [
            {required: true, message: '请填写境外账单费用概要', trigger: 'change'}
          ],
          abroadCurId: [
            {required: true, message: '请填写境外账单币种', trigger: 'change'}
          ],
          abroadExchangeRate: [
            {required: true, message: '请填写境外账单汇率', trigger: 'change'}
          ],
          abroadBillSum: [
            {required: true, message: '请填写境外账单总金额', trigger: 'change'}
          ],
          purchaseOrPayExcRate: [
            {required: true, message: '请选择购付汇', trigger: 'change'}
          ],
          billStyle: [
            { required: false, message: '请选择账单类型', trigger: 'change' }
          ],
        },
        backData: {},
        selectCaseList: [],
        selectCaseVisible: false,
        changeCaseVisible: false,
        bankInfoList: [],
        submitData: {},
        creatematerial,
        custList: [],
        agentNums: '',
        feeDetailList: [],
        caseData: [],
        tableTitleList: [{'title': '案件文号', 'value': 'agentNum'}, {'title': '客户', 'value': 'custName'}, {
          'title': '申请人',
          'value': 'appName'
        }, {'title': '案件类型', 'value': 'caseTypeStr'}, {'title': '申请方向', 'value': 'appFromto'}, {
          'title': '权利号',
          'value': 'droitNumber'
        }, {'title': '案件状态', 'value': 'status'}, {'title': '案件名称', 'value': 'caseName'}, {
          'title': '商标类别',
          'value': 'goodClasses'
        }],
        feeTypeList: [],
        userList: [],
        workgroupNamesList: [],
        companyList: [],
        payTypeList: [],
        materialList: [],
        materialIdList: [],
        countryList: [],
        hzLists: [],
        queryCurrencyList: [],
        billData: {},
        numberBlurData: {},
        customerBankaccountInfo: {},
        bankAccountList: [],
      }
    },
    name: 'addOverseasBill',
    props: {
      isFinance: {
        type: Boolean,
        default: false
      },
      financeType: {
        type: Number,
        default: 0
      },
      outAbroadBillId: ''
    },
    watch:{
      //预计付款日
      'submitData.expectedPaymentDate':{
        handler(val){
          if(val){
            const date = new Date(val)
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要加1，并且确保是两位数
            const formattedDate = `${year}-${month}`
            this.submitData.expectedPaymentMonth = formattedDate
          }else{
            this.submitData.expectedPaymentMonth = ''
          }
        }
      },
      //境外账单日
      // 'submitData.abroadBillDate':{
      //   handler(val){
      //     if(val&&this.submitData.accountPeriod&&!this.submitData.remittanceDeadline){
      //       const date = this.countAbroadBillDate(val,this.submitData.accountPeriod,'add')
      //       this.submitData.remittanceDeadline = date
      //     }
      //   }
      // },
      //账期
      'submitData.accountPeriod':{
        handler(val){
          if(val&&this.submitData.abroadBillDate&&!this.submitData.remittanceDeadline){
            const date = this.countAbroadBillDate(this.submitData.abroadBillDate,val,'add')
            this.submitData.remittanceDeadline = date
          }
        }
      },
      // 汇款绝限日期
      'submitData.remittanceDeadline':{
        handler(val){
          if(val){
            this.submitData.expectedPaymentDate = this.countAbroadBillDate(val,15,'sub')
          }else{
            this.submitData.expectedPaymentDate = ''
          }
        }
      },
      'submitData.abroadAgencyCustId':{
        handler(val, oldVal){
          if (val) {
            const index = this.hzLists.findIndex(item => item.custId === val)
            if (index !== -1) {
              this.submitData.accountPeriod = this.hzLists[index].accountPeriod
            }
          } else if (oldVal) {
            // 只有之前有值，现在被清空了，才清空账期（用户主动清空的情况）
            this.submitData.accountPeriod = ''
          }
          // 如果是初始化（oldVal为空），不清空账期，保留编辑时的回显数据
        }
      },
      'submitData.showRefno': {
        handler(val) {
          if (this.isPTAgentNum) {
            this.$set(this.rules.billStyle[0], 'required', true);
          } else {
            this.$set(this.rules.billStyle[0], 'required', false);
          }
        },
        immediate: true,
      },
    },
    async created() {
      this.$nextTick(() => {
        // 待支付和复审，购付汇不是必填
        if (['4', '6'].includes(this.financeType)) {
          this.rules.purchaseOrPayExcRate[0].required = true
        } else {
          this.rules.purchaseOrPayExcRate[0].required = false
        }
      })
      this.queryStyleList()
      this.queryUsers()
      this.queryCountry()
      // this.queryOtherCustomerListUrl()
      this.queryCompany()
      this.queryWorkgroupNames()
      if (this.$route.params.pageType != 1 && this.financeType != 1) {
        this.queryAbroadBillDetail()
        // this.queryPayMode()
      }

      if (this.$route.query.agentNums) {
        this.agentNums = this.$route.query.agentNums.replace(/,/g, '\n')
        this.getCase()
      }
      if (this.$route.query.billNo) {
        this.$set(this.submitData, 'billNo', this.$route.query.billNo)
        this.getCaseList(this.$route.query.billNo, 'billNo')
      }
    },
    methods: {
      countAbroadBillDate(startDateString,daysToAdd,type){
        console.log(startDateString,'startDateString');
        console.log(daysToAdd,'daysToAdd');
        // 将起始日期字符串转换为Date对象
        const startDate = new Date(startDateString.replace(/-/g, '/'));
        
        // 检查日期字符串是否有效
        if (isNaN(startDate.getTime())) {
            throw new Error('无效的日期字符串');
        }
    
        // 设置新日期为起始日期加上指定的天数
        const endDate = new Date(startDate);
        if (type == 'add'){
          endDate.setDate(startDate.getDate() + Number(daysToAdd));
        } else{
          endDate.setDate(startDate.getDate() - Number(daysToAdd));
        }
    
        // 格式化新日期为YYYY-MM-DD字符串
        const year = endDate.getFullYear();
        const month = String(endDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，加1
        const day = String(endDate.getDate()).padStart(2, '0'); // 补零确保两位数
        const endDateString = `${year}-${month}-${day}`;
    
        return endDateString
      },
      queryStyleList() {
        queryBillStyle().then(res => {
          this.billStyleList = res.data
        })
      },
      changeDate(month) {
        queryCurrencyUrl({
          month
        }).then(res => {
          this.queryCurrencyList = res.data
          this.changeAbroad(this.submitData.abroadCurId)
          if(month&&this.submitData.accountPeriod){
            const date = this.countAbroadBillDate(month,this.submitData.accountPeriod,'add')
            this.submitData.remittanceDeadline = date
          }
        })
      },
      transformation(arr, val, valType, labelStr) {
        if (arr && arr.length) {
          var item = arr.find(item => item[valType] == val)
          if (item) {
            return item[labelStr]
          } else {
            return ''
          }
        }
        return ''
      },
      getList(list) {
        if (list.length) {
          // this.$set(this.collectData, 'custId', list[0].custId)
          // this.collectData.custId&&queryCustomerNameId({pageNo: 1, pageSize: 100, custId: this.collectData.custId}).then(res => {
          //   this.custList = res.data
          // })
          this.submitData.caseIds = list.map(item => item.caseId)
          this.$set(this.submitData, 'caseArray', list)
          disposeAgentNum({agentNumberArray: list.map(item => item.agentNum)}).then(res => {
            this.$set(this.submitData, 'showRefno', res.data)
          })
        }
      },
      takeCaseDetail(row) {
        if (row.caseArray && row.caseArray.length > 1) {
          this.selectCaseList = row.caseArray;
          this.selectCaseVisible = true;
        } else {
          if (!row.caseId) {
            this.takeCaseDetail(row.caseArray[0])
          } else {
            this.$commonUtils.takeCaseDetail(row, this)
            // window.open(`#/workbench/case/seeCaseDetail/${row.caseId}?taskType=${row.taskType}`)
          }
        }
      },
      ChooseCaseClose(data) {
        this.changeCaseVisible = false
      },
      changeAccount(value){
        const list = JSON.parse(JSON.stringify(this.bankAccountList))
        const index = list.findIndex(item => item.account == value)
        if (index != -1) {
          this.customerBankaccountInfo = list[index] || {}
        }
      },
      changeAbroadAgencyCust(value) {
        this.submitData.abroadBillDate = ''
        this.submitData.remittanceDeadline = ''
        if (!value) return;
        this.fetchBankList(value,'change')
      },
      //获取银行信息
      fetchBankList(custId,type) {
        queryBankaccountListBycustId({custId, state: 1 }).then(res => {
          if (res.data && res.data.length) {
            this.bankAccountList = res.data || []
            if (type == 'change'&&res.data.length) {
              this.customerBankaccountInfo = res.data[0] || {}
              this.submitData.account = res.data[0].account || ''
            }else{
              const list = JSON.parse(JSON.stringify(res.data))
              const index = list.findIndex(item => item.account == this.submitData.account)
              if (index != -1) {
                this.customerBankaccountInfo = list[index] || {}
              }else{
                this.submitData.account = null
                this.customerBankaccountInfo = {}
              }
            }
          }else{
            this.bankAccountList = []
            this.customerBankaccountInfo = {}
            this.submitData.account = null
          }
        })
      },
      queryAbroadInfo(billNo) {
        this.$set(this.submitData, 'billNo', billNo)
        // this.submitData.billNo = billNo
        this.getCaseList(billNo, 'billNo')
      },
      changeAbroad(e) {
        (e || e === 0) && this.$set(this.submitData, 'abroadExchangeRate', this.queryCurrencyList.find(item => item.curId == e).exchangeRate)
      },
      formatAmount(num) {
        return formatAmount(num)
      },
      getPayMoney() {
        this.submitData.payMoney = this.submitData.abroadBillSum && this.submitData.foreignExchangeRate ? this.submitData.abroadBillSum * this.submitData.foreignExchangeRate * 0.01 : ''
      },
      changeNumTotal() {
        let abroadServiceFee = this.submitData.abroadServiceFee ? this.submitData.abroadServiceFee : 0
        let abroadOfficialFee = this.submitData.abroadOfficialFee ? this.submitData.abroadOfficialFee : 0
        let abroadOtherFee = this.submitData.abroadOtherFee ? this.submitData.abroadOtherFee : 0
        this.submitData.abroadBillSum = this.$commonUtils.accuratelyAdd(this.$commonUtils.accuratelyAdd(Number(abroadServiceFee), Number(abroadOfficialFee)), Number(abroadOtherFee))
        this.getPayMoney(this.submitData.abroadBillSum)
      },
      getCaseList(value, type) {
        if (!value) return
        if (type == 'billNo') {
          if (!this.submitData.regCountry) return;
        } else {
          if (!this.submitData.billNo) return;
        }
        // if (this.$route.params.pageType == 1 || this.financeType == 1) {
          getCaseList({billNo: this.submitData.billNo, appState: this.submitData.regCountry}).then(res => {
            this.caseData = res.data || []
            if (!this.caseData.length) {
              this.$message.error('请检查注册国家/账单号是否正确！')
              this.$set(this.submitData, 'regCountry', '')
            } else {
              this.getAbroadBill()
            }
          }).catch(err => {
            this.$message.error('查询失败！')
          })
        // }
      },
      purchaseOrPayExcRateChange(e) {
        if (e == '购汇') {
          this.submitData.payCurId = 0
        }
      },
      getCase() {
        getCase({agentNums: this.agentNums, billId: this.submitData.billId}).then(res => {
          this.caseData = res.data
          if (res.data && res.data.length) {
            this.getAbroadBill()
          }
        })
      },
      getUploadData(caseIds, materialTypeId) {
        const data = {
          tokenID: this.$store.getters.token,
          caseIds: caseIds.length && caseIds || this.submitData.caseIds || [],
          materialTypeId
        }
        return data
      },
      getAbroadBill() {
        getAbroadBill({caseIds: this.caseData.map(item => item.caseId), billNo: this.submitData.billNo}).then(res => {
          if(res.messageType == 100){
            this.$message.error(res.message)
          }
          if (this.$route.params.pageType == 1 || this.financeType == 1) {
            this.submitData = res.data
            this.submitData.agencyCustName && this.queryOtherCustomerListUrl(this.submitData.agencyCustName)
          }else{
            this.submitData.billId = res.data.billId
          }
          if (res.data.customerBankaccountList&&res.data.customerBankaccountList.length) {
            this.bankAccountList = res.data.customerBankaccountList || []
            this.customerBankaccountInfo = res.data.customerBankaccountList[0] || {}
            this.submitData.account = res.data.customerBankaccountList[0].account
          }
           let {bill} = res.data
            this.billData = JSON.parse(JSON.stringify(bill))
            delete this.submitData.bill
        })
      },
      delCase(index) {
        this.caseData.splice(index, 1)
        this.getAbroadBill()
      },
      formatDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
      queryAbroadBillDetail() {
        let abroadBillId = ''
        if (this.isFinance) {
          abroadBillId = this.outAbroadBillId
        } else {
          abroadBillId = this.$route.query.abroadBillId
        }
        queryAbroadBillDetail({abroadBillId}).then(res => {
          this.submitData = res.data
          this.submitData.billStyle = this.submitData.billStyle || ''
          if (this.submitData.financialApprovalDate) {
            this.submitData.financialApprovalDate = this.formatDate(this.submitData.financialApprovalDate)
          }
          if (this.submitData.remittanceDeadline) {
            this.submitData.remittanceDeadline = this.formatDate(this.submitData.remittanceDeadline)
          }
          this.queryCurrencyUrl({month: this.submitData.abroadBillDate})
          this.queryPayMode()
          // this.bankInfoList = [res.data || {}]
          let {bill} = res.data
          this.billData = JSON.parse(JSON.stringify(bill))
          delete this.submitData.bill
          this.materialList = this.submitData.materialList
          this.materialList.forEach(item => item.name = item.materialName)
          this.materialIdList = this.submitData.materialList.map(item => item.materialId)
          this.backData = JSON.parse(JSON.stringify(this.submitData))
          this.submitData.agencyCustName && this.queryOtherCustomerListUrl(this.submitData.agencyCustName)
          console.log(res.data.abroadAgencyCustId,'res.data.abroadAgencyCustId');
          res.data.abroadAgencyCustId&&this.fetchBankList(res.data.abroadAgencyCustId)
        })
      },
      queryCompany() {
        queryCompany().then(res => {
          this.companyList = res.data
        })
      },
      queryCurrencyUrl() {
        queryCurrencyUrl().then(res => {
          this.queryCurrencyList = res.data
        })
      },
      queryOtherCustomerListUrl(v) {
        v && queryOtherCustomerListUrl({fullname: v,isCollaboration:1})
          .then(response => {

            this.hzLists = response.data;
            this.hzLists.forEach(item => {
              item.label = item.fullname

              // item.id=item.custId
              // item.name=item.fullname
              item.value = item.custId
            })
            
            // 编辑模式：列表加载完成后，从列表中获取对应代理所的账期
            this.$nextTick(() => {
              if (this.submitData.abroadAgencyCustId) {
                const selectedAgency = this.hzLists.find(item => item.custId === this.submitData.abroadAgencyCustId)
                if (selectedAgency && selectedAgency.accountPeriod) {
                  this.submitData.accountPeriod = selectedAgency.accountPeriod
                  // 如果没有汇款绝限日期，触发预期付款日的计算
                  if (!this.submitData.remittanceDeadline && this.submitData.abroadBillDate) {
                    const date = this.countAbroadBillDate(this.submitData.abroadBillDate, selectedAgency.accountPeriod, 'add')
                    this.submitData.expectedPaymentDate = date
                  }
                }
              }
            })
          })
      },
      queryCountry() {
        queryCountry().then(res => {
          this.countryList = res.data;
        })
      },
      queryUsers() {
        this.userList = this.$store.getters.userList
        // queryUsers({pageNo:1,pageSize:10000}).then(res=>{
        //  //res.data.users
        // })
      },
      queryWorkgroupNames() {
        queryZZWorkGroupUrl().then(res => {
          this.workgroupNamesList = res.data
        })
      },
      queryPayMode(e) {
        if (e) {
          this.submitData.payType = ''
        }
        if (this.submitData.payDeptId) {
          queryPayMode({deptId: this.submitData.payDeptId}).then(res => {
            this.payTypeList = res.data
          })
        } else {
          this.payTypeList = []
        }
      },
      handleRemove1(file) {
        if (file.materialId) {
          delCaseMaterial({
            objType: '1126',
            objInstId: this.submitData.abroadBillId || undefined,
            materialId: file.materialId,
            caseIdArray: this.caseData.map(item => item.caseId).length && this.caseData.map(item => item.caseId) || this.submitData.caseIds
          }).then(res => {
            this.materialIdList.splice(this.materialIdList.map(i => i.materialId).indexOf(file.materialId), 1)
            this.materialList.splice(this.materialList.map(i => i.materialId).indexOf(file.materialId), 1)
          })
        } else {
          delCaseMaterial({
            objType: '1126',
            objInstId: this.submitData.abroadBillId || undefined,
            materialId: file.response.data[0].materialId,
            caseIdArray: this.caseData.map(item => item.caseId).length && this.caseData.map(item => item.caseId) || this.submitData.caseIds
          }).then(res => {
            this.materialIdList.splice(this.materialIdList.map(i => i.materialId).indexOf(file.response.data[0].materialId), 1)
            this.materialList.splice(this.materialList.map(i => i.materialId).indexOf(file.response.data[0].materialId), 1)
          })
        }
      },
      onsuccess(response, file, fileList) {
        response.data[0].name = response.data[0].materialName
        this.materialList.push(response.data[0])
        this.materialIdList.push(response.data[0].materialId)
      },
      submit(checkFlag, result) {
        if(!this.$commonUtils.formValidate(this.$refs['refForm']))return;
        // if (this.materialList.filter(i => i.materialTypeId === 359).length < 1) {
        //   this.$message.error('请上传境外账单电子版！')
        //   return
        // }
        this.submitData.materialIdList = this.materialIdList
        this.submitData.caseIds = this.caseData.map(item => item.caseId).length && this.caseData.map(item => item.caseId) || this.submitData.caseIds || []
        if (!this.submitData.billId) {
          this.$message.error('缺少账单信息，无法继续操作！')
          return
        }
        this.submitData = {...this.submitData,...this.customerBankaccountInfo,}
        if (!this.submitData.abroadBillId) {
          createAbroadBill({...this.submitData, checkFlag: 1, billStyle: this.submitData.billStyle || 0}).then(res => {
              if (res.messageType == 100) {
                this.$confirm(
                  "提示",
                  {
                    message: this.$commonUtils.rowsMessage(res.message, '$$'),
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                    type: "warning"
                  }
                ).then(() => {
                  createAbroadBill({...this.submitData, billStyle: this.submitData.billStyle || 0}).then(res => {
                    // this.submitData.checkFlag = checkFlag
                    this.submitData.abroadBillId = res.data[0].abroadBillId
                    this.submitData.taskId = res.data[0].taskId
                    submitAbroadBill({
                      taskId: this.submitData.taskId,
                      abroadBillId: this.submitData.abroadBillId
                    }).then(res => {
                      // if (res.messageType == -6) {
                      //   this.$confirm(
                      //     res.message + "是否继续",
                      //     "提示",
                      //     {
                      //       confirmButtonText: "确定",
                      //       cancelButtonText: "取消",
                      //       type: "warning"
                      //     }
                      //   ).then(() => {
                      //     this.submit(0);
                      //     this.successed()
                      //   });
                      //   return
                      // }
                      this.successed()
                    })
                  })
                }).catch(() => {

                })
              } else if (res.messageType == 200) {
                this.$alert(
                  res.message,
                  "提示",
                  {
                    confirmButtonText: "关闭",
                    type: "warning"
                  }
                )
              } else {
                // this.submitData.checkFlag = checkFlag
                this.submitData.abroadBillId = res.data[0].abroadBillId
                this.submitData.taskId = res.data[0].taskId
                submitAbroadBill({
                  taskId: this.submitData.taskId,
                  abroadBillId: this.submitData.abroadBillId
                }).then(res => {
                  if (res.messageType == -6) {
                    this.$confirm(
                      res.message + "是否继续",
                      "提示",
                      {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                      }
                    ).then(() => {
                      this.submit(0);
                      this.successed()
                    });
                    return
                  }
                  this.successed()
                })
              }
            }
          )
        } else {
          this.$commonUtils.handleNullNumber(this.submitData, this.backData)
          this.submitData.checkFlag = checkFlag
          this.submitData.result = result
          submitAbroadBill({...this.submitData, billStyle: this.submitData.billStyle || 0}).then(res => {
            if (res.messageType == 100) {
              this.$confirm(
                "提示",
                {
                  message: this.$commonUtils.rowsMessage(res.message, '$$'),
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }
              ).then(() => {
                this.submit(0, result);
                this.successed()
              });
              return
            }
            if (res.messageType === 200) {
             this.$alert(
               res.message,
                "提示",
                {
                  confirmButtonText: "关闭",
                  type: "warning"
                }
              )
              return
            }
            this.successed()
          })
        }
      },
      // submitFee(result){
      //   this.submitData.taskIdList= this.submitData.taskId
      //   this.submitData.result=result
      //   this.submitData.feeDetails.forEach(item=>{
      //     item.feeId=this.submitData.feeId
      //     delete item.feetIdList
      //   })
      //   submitFee(this.submitData).then(Response=>{
      //     this.successed()
      //   })
      // },
      updateFee() {
        if (this.financeType != 1 && this.financeType != 3) {
          if (this.materialList.filter(i => i.materialTypeId === 359).length < 1) {
            this.$message.error('请上传境外账单电子版！')
            return
          }
          if(!this.$commonUtils.formValidate(this.$refs['refForm'])){
           return;
          }
        }
        this.$commonUtils.handleNullNumber(this.submitData, this.backData)
        this.submitData.materialIdList = this.materialIdList
        if ((this.financeType == 1 || this.$route.params.pageType == 1) && !this.submitData.abroadBillId) {
          if (this.financeType != 1 && this.financeType != 3) {
            if (!this.submitData.billId) {
              this.$message.error('缺少账单信息，无法继续操作！！')
              return
            }
          }
          this.submitData.caseIds = this.caseData.map(item => item.caseId).length && this.caseData.map(item => item.caseId) || this.submitData.caseIds || []
          this.submitData = {...this.submitData,...this.customerBankaccountInfo}
          createAbroadBill({...this.submitData, checkFlag: 1, billStyle: this.submitData.billStyle || 0}).then(res => {
            if (res.messageType == 100) {
              this.$confirm(
                "提示",
                {
                  message: this.$commonUtils.rowsMessage(res.message, '$$'),
                  confirmButtonText: "是",
                  cancelButtonText: "否",
                  type: "warning"
                }
              ).then(() => {
                createAbroadBill({...this.submitData, billStyle: this.submitData.billStyle || 0}).then(res => {
                  this.successed()
                  // this.submitData.abroadBillId=res.data[0].abroadBillId
                  // this.submitData.taskId=res.data[0].taskId
                  // saveAbroadBill(this.submitData).then(res=>{
                  //   this.successed()
                  // })
                })
              }).catch(err => {

              })
            } else if (res.messageType == 200) {
              this.$alert(
                res.message,
                "提示",
                {
                  confirmButtonText: "关闭",
                  type: "warning"
                }
              )
            } else {
              this.successed()
              // this.submitData.abroadBillId=res.data[0].abroadBillId
              // this.submitData.taskId=res.data[0].taskId
              // saveAbroadBill(this.submitData).then(res=>{
              //   this.successed()
              // })
            }

          })
        } else {
          this.submitData = {...this.submitData,...this.customerBankaccountInfo}
          saveAbroadBill({...this.submitData, checkFlag: 1, billStyle: this.submitData.billStyle || 0}).then(res => {
            if (res.messageType == 100) {
              this.$confirm(
                "提示",
                {
                  message: this.$commonUtils.rowsMessage(res.message, '$$'),
                  confirmButtonText: "是",
                  cancelButtonText: "否",
                  type: "warning"
                }
              ).then(() => {
                saveAbroadBill({...this.submitData, billStyle: this.submitData.billStyle || 0}).then(res => {
                  this.successed()
                })
              }).catch(err => {

              })
            } else if (res.messageType == 200) {
              this.$alert(
                res.message,
                "提示",
                {
                  confirmButtonText: "关闭",
                  type: "warning"
                }
              )
            } else {
              this.successed()
            }
          })
        }
      },
      successed() {
        this.$message.success('操作成功')
        this.cancel()
      },
      cancel() {
        if (this.isFinance) {
          this.$emit('close', false)
        } else {
          this.$router.go(-1)
        }
      }

    },
    beforeRouteEnter: (to, from, next) => {
      if (to.params.pageType === "1") {
        document.title = getPageTitle((to.meta.title = "境外账单新建"));
        next(res => {
        });
      } else {
        document.title = getPageTitle((to.meta.title = "境外账单修改"));
        next(res => {
        });
      }
    },
  }
</script>

<style lang='scss' scoped>
  aside {
    & > div {
      display: flex;
      align-items: center;

      .el-textarea {
        width: 80%;
      }

      .el-button {
        margin-left: 20px;
        width: 67px;
        height: 32px;
        padding: 0;
        color: #409EFF;
        border: 1px solid #409EFF;
      }
    }

    span {
      display: block;
      margin: 10px 0;
      font-size: 12px;
      color: #FB9608;
    }

  }

  .title {
    font-size: 16px;
    color: #6AA7FF;
    height: 50px;
    line-height: 50px;
    font-weight: normal;

  }

  .el-form {
    display: flex;
    flex-wrap: wrap;

    .el-select, .el-input, .el-date-picker, .el-textarea {
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

          .el-upload-dragger {
            height: 20px;
            width: 100%;

            .el-upload__text {
              line-height: 20px;
            }
          }
        }
      }
    }
  }

  .button_wrap {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: center;

    .el-button {
      margin-left: 30px;
    }
  }

  .addFeeDetail {
    padding: 20px;
    display: flex;
  }

  .require /deep/ .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
  .TaskRecordWrap {
    margin-top: 20px;
    margin-left: 10px;
    width: 200px;
  }
  .title-mx {
    /*float: left;*/
    font-size: 15px;
    color: rgb(64, 158, 255);
    font-weight: 350;
    font-style: normal;
  }
  .custom-item{
    /deep/ .el-form-item__label{
      width: 90px !important;
    }
  }
</style>
