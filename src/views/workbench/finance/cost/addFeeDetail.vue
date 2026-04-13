<template>
  <div style="display:flex;" class="feeDetail">
    <div class="addFeeDetail">
      <template v-if="$route.params.pageType==1 || dialogFeeType == 1">
        <aside v-if="!$route.query.agentNums">
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
        <div style="display: flex" v-if="$route.query.agentNums">
          <label>案件文号：</label><span>{{$route.query.agentNums}}</span>
        </div>
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
              <el-button type="text" size="small" @click="caseData.splice(scope.$index,1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <h4 class="title">费用明细</h4>
      <div style="text-align:right;margin-bottom: 10px">
        <el-button type="primary" size="small" @click="submitData.feeDetails.push({})">增加</el-button>
      </div>
      <el-table :data="submitData.feeDetails" border class="el-table1" style="width: 99%">
        <el-table-column label="费用类型" width="350">
          <template slot-scope="{row}">
            <el-cascader
              ref="cascader"
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
        <el-table-column label="费用名">
          <template slot-scope="{row}">
            <el-input :disabled="isCn" type="text" v-model="row.feeName"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="150">
          <template slot-scope="{row}">
            <el-input :disabled="isCn" type="number" v-model="row.amount" @mousewheel.native.prevent @change="initializeInvoiceRemainingAmounts"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="发票金额" width="300">
          <template slot-scope="scope">
            <div v-if="scope.row.noInv != 1">
              <el-tooltip v-if="!isCn"  :disabled="!hasRemainingAmount(scope.row.invoices)" placement="top-start" effect="light">
                <div slot="content">请修改关联发票，发票可用金额小于报销金额<br/>{{ hasRemainingAmount(scope.row.invoices) ? '差额' + scope.row.invoices[scope.row.invoices.length - 1].actualBalance : '' }}</div>
                <div :class="hasRemainingAmount(scope.row.invoices) ? 'invoice-fpbk' : ''">
                  <div v-for="(inv,invIndex) in scope.row.invoices" :key="inv.invId">
                    <p>
                      <span :class="inv.invStatus==0? 'del_line' : inv.invPath ? 'invoice-fpgl' : ''" :title="inv.invStatus==0?'发票不可用':''" @click="preView(`${inv.invPath}`) ">No2.{{ inv.invoiceNum }}</span>
                      <el-tooltip :disabled="!inv.veriCode!=0" effect="light" :content="inv.veriMessge" placement="top">
                        <i @click="modifyVeriCode(inv)" v-if="inv.veriCode!=0" :style="'cursor: pointer;'+ (inv.veriCode == -1 ? 'color:#ebbb35' : inv.veriCode == -11 ? 'color:#02c348' : 'color:red')" class="el-icon-warning"></i>
                      </el-tooltip>
                      <span :class="{'invoice-date-warning': isInvoiceDateWarning(inv.invoiceDate)}">{{ inv.invoiceDate }}</span>
                      <span :class="inv.invStatus==0? 'del_line' : ''">￥{{ inv.amountInFiguers}}</span>
                      <span title="删除" class="invoice-fpsc iconfont icon-fapiaoshanchu" @click="deleteRelated(scope.row,invIndex,inv.invId)"></span>
                      <i v-if="$store.getters.permissions.includes(397) && inv.invStatus!=0 && submitData.wfStatus=='查验'" title="不可用" class="el-icon-error" style="cursor: pointer" @click="changeInvoiceStatus(inv)"></i>
                    </p>
                  </div>
                  <!--显示关联发票总金额-->
                  <!--                <span>{{ parseFloat(totalAmountInFiguers(scope.row.invoices)).toFixed(2) }}</span>-->
                  <span v-if="submitData.invoiceLater !== 1" class="invoice-fpgl iconfont icon-fapiaoguanli" @click="showPop($event, scope)">
                    <span style="font-size: 12px">关联发票</span>
                  </span>
                </div>
              </el-tooltip>
              <div v-else>
                <div v-for="inv in scope.row.invoices" :key="inv.invId">
                  <span :class="inv.invStatus==0? 'del_line' : inv.invPath ? 'invoice-fpgl' : ''" @click="preView(`${inv.invPath}`) ">No1.{{ inv.invoiceNum }}</span>
                  <el-tooltip :disabled="!inv.veriCode!=0" effect="light" :content="inv.veriMessge" placement="top">
                    <i v-if="inv.veriCode!=0" :style="'cursor: pointer;'+ (inv.veriCode == -1 ? 'color:#ebbb35' : inv.veriCode == -11 ? 'color:#02c348' : 'color:red')" class="el-icon-warning"></i>
                  </el-tooltip>
                  <span :class="inv.invStatus==0? 'del_line' : ''">￥{{ inv.amountInFiguers}}</span>
                </div>
              </div>
            </div>
            <div v-if="submitData.invoiceLater !== 1">
              <div v-if="scope.row.invIds ? scope.row.invIds.length <= 0 : true">
                <el-checkbox :disabled="isCn" label="无需关联发票" v-model="scope.row.noInv" name="type" :true-label="1"
                             :false-label="0"></el-checkbox>
                <el-tooltip class="item" effect="light" placement="top-start">
                  <div slot="content"><div style="margin-top: 1px">无需查验票包括以下类型：</div><br/>定额发票、卷联打车票、蓝联机票行程单、火车票、客户抬头票、财政部监制的非税收入票<br/></div>
                  <i class="el-icon-info" style="cursor: pointer"></i>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收款对方名称">
          <template slot-scope="{row}">
            <el-input :disabled="isCn" type="text" v-model="row.receiverName"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="费用描述">
          <template slot-scope="{row}">
            <el-input :disabled="isCn" type="textarea" autosize v-model="row.feeDesc"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="财务描述" v-if="isFinStaff">
          <template slot-scope="{row}">
            <el-input :disabled="isCn" type="textarea" autosize v-model="row.financialDesc"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <el-button :disabled="isCn" type="text" @click="deleteFeeDetail(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <popover-svc ref="pop1" placement="right" v-model="showPopper">
        <IdentifyInvoices class="popover-content" :position="'fee'" @closeInvoiceSelect="invoiceRelated($event,curObj)" @cancelClose="cancelClose"></IdentifyInvoices>
      </popover-svc>
      <div style="text-align:center;width:100%">
        <span>总金额：</span><span>{{totalSum|formatAmount}}</span>
        <span>发票总金额：</span><span>{{invoiceTotalSum|formatAmount}}</span>
      </div>
      <h4 class="title">费用基础信息</h4>
      <el-form label-width="150px" :model="submitData" :rules="rules" ref="ruleForm" style="width: 99%">
        <el-row v-if="$route.params.pageType!=1 && dialogFeeType != 1">
          <el-form-item label="案件文号:">
            <template>
              <span class="title-mx" style="cursor: pointer" @click="takeCaseDetail(submitData)">{{submitData.showRefno}}</span>
              <el-button style="margin-left: 10px" size="mini" type="primary" @click="changeCaseVisible=true">修改
              </el-button>
            </template>

            <ChooseCase
              :dialogVisible="changeCaseVisible"
              :agentNums="submitData.caseArray.map(item=>item.agentNum).join('\n')"
              @closed="ChooseCaseClose"
              rules="custId"
              @getList="getList"></ChooseCase>
            <!--          <span v-if="!caseState">{{submitData.showRefno}}</span>-->
            <!--            <el-input type="text" v-if="caseState" v-model="submitData.showRefno" @change="getThisCase"></el-input>-->
          </el-form-item>
          <el-form-item label="案件名称:">
            {{submitData.caseName}}

          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="项目名称:">
            <el-select v-model="submitData.projectId" filterable remote clearable reserve-keyword
                       placeholder="请输入关键词" :remote-method="(queryString)=>{
              remoteMethodPrj(queryString);
              }">
              <el-option v-for="itm in prjList" :key="itm.projectId" :label="itm.prjName" :value="itm.projectId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同号/名称:">
            <el-select v-model="submitData.contractId" filterable remote clearable reserve-keyword
                       placeholder="请输入合同号、合同名称" :remote-method="(queryString)=>{
              remoteMethodContract(queryString);
              }" @change="handleContractChange">
              <el-option v-for="itm in contractList" :key="itm.contractId" :label="(itm.contractNo || '-') + ' / ' + (itm.contractName || '-')" :value="itm.contractId">
              </el-option>
            </el-select>
            <span v-if="submitData.contractId" class="el-icon-paperclip" style="color: #409EFF;cursor: pointer;" @click="viewContractFile"></span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="客户:">
            <el-select :disabled="isCn" v-model="submitData.custId" filterable remote clearable reserve-keyword
                       placeholder="请输入关键词" :remote-method="(queryString)=>{
                remoteMethod(queryString);
                }">
              <el-option v-for="itm in custList" :key="itm.custId" :label="itm.name" :value="itm.custId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费用状态:">
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
            <el-select :disabled="isCn" v-model="submitData.reimburseUserId" filterable clearable reserve-keyword
                       placeholder="请选择报销人" @change="changeReibuserUserId">
              <el-option v-for="itm in userList" :key="itm.userId" :label="itm.fullname" :value="itm.userId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费用承担工作组:" prop="costWkgId">
            <el-select
              @change="changeCostWkg"
              default-first-option
              v-model="submitData.costWkgId"
              ref="custSelect"
              :disabled="isCn"
              filterable
              clearable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="(value) => {searchWorkGroup(value, 'twoWorkList')}"
            >
              <el-option
                v-for="item in twoWorkList"
                :key="item.wkgId"
                :label="item.groupName"
                :value="item.wkgId"
              >
              </el-option>
            </el-select>
<!--            <el-select :disabled="isCn" v-model="submitData.costWkgId" v-debounce:searchWorkGroup="'input',500" filterable clearable reserve-keyword-->
<!--                       placeholder="请选择工作组">-->
<!--              <el-option v-for="itm in workgroupNamesList" :key="itm.wkgId" :label="itm.groupName" :value="itm.wkgId">-->
<!--              </el-option>-->
<!--            </el-select>-->
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="报销人所属工作组:">
            <el-select
              :disabled="isCn"
              v-model="submitData.reimburseWkgId"
              filterable
              clearable
              remote
              reserve-keyword
              :remote-method="(value) => {searchWorkGroup(value, 'reimburseWorkList')}"
              placeholder="请选择工作组">
              <el-option v-for="itm in reimburseWorkList" :key="itm.wkgId" :label="itm.groupName" :value="itm.wkgId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门:">
            <el-select :disabled="isCn" v-model="submitData.deptId" filterable clearable reserve-keyword
                       placeholder="请选择部门">
              <el-option v-for="itm in deptByConditionList" :key="itm.deptId" :label="itm.name" :value="itm.deptId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="支付公司:" prop="paymentDeptId">
            <el-select :disabled="isCn" @change="queryPayMode" v-model="submitData.paymentDeptId" filterable clearable
                       reserve-keyword placeholder="请选择支付公司">
              <el-option v-for="itm in companyList" :key="itm.deptId" :label="itm.companyShortName" :value="itm.deptId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式:" prop="payType">
            <el-select @change="changePayType" v-model="submitData.payType" filterable clearable reserve-keyword placeholder="请选择方式">
              <el-option v-for="itm in payTypeList" :key="itm.payMode" :label="itm.payMode" :value="itm.payMode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.payType">
          <el-form-item label="具体付款方式:" prop="specificPayType" v-show="submitData.payType.includes('银行')">
            <el-select v-model="submitData.specificPayType" filterable clearable reserve-keyword
                       placeholder="请选择方式">
              <el-option v-for="itm in querySpecificPayTypeList" :key="itm.typeName" :label="itm.typeName"
                         :value="itm.typeName">
              </el-option>
            </el-select>
          </el-form-item>
          <!--          <template v-else>-->
          <el-form-item label="具体付款方式:" v-show="!submitData.payType.includes('银行')">
            <el-select :disabled="!submitData.payType.includes('银行')" v-model="submitData.specificPayType" filterable clearable reserve-keyword
                       placeholder="请选择方式">
              <el-option v-for="itm in querySpecificPayTypeList" :key="itm.typeName" :label="itm.typeName"
                         :value="itm.typeName">
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
          <el-form-item label="是否替票:">
            <el-radio :disabled="isCn" v-model="submitData.suAudit" :label="0">否</el-radio>
            <el-radio :disabled="isCn" v-model="submitData.suAudit" :label="1">是</el-radio>
          </el-form-item>
          <el-form-item label="是否为差旅费:">
            <el-radio :disabled="isCn" v-model="submitData.travelExpenses" :label="0">否</el-radio>
            <el-radio :disabled="isCn" v-model="submitData.travelExpenses" :label="1">是</el-radio>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="出差信息:">
            <div style="display: flex; align-items: center;width: 40%;">
              <el-select
                :disabled="isCn"
                v-model="submitData.btId"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethodBusinessTrip"
                :loading="businessTripLoading"
                style="flex: 1;">
                <el-option
                  v-for="itm in businessTripList"
                  :key="itm.btId"
                  :label="itm.btDesc"
                  :value="itm.btId">
                </el-option>
              </el-select>
              <span v-if="submitData.btId" @click="openBusinessTripDrawer" style="margin-left: 10px;color: #409EFF;cursor: pointer;">详情</span>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="单据号:" :prop="feeNoReq ? 'feeNo' : ''" :key="feeNoReq">
            <el-input type="text" v-model="submitData.feeNo"></el-input>

          </el-form-item>
          <el-form-item label="所属月:">
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
              :before-upload="beforeUpload"
            >
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="诉讼费收据号:" v-if="['律所现金', '万慧达现金'].includes(submitData.payType) && submitData.feeDetails.find(item => item.feetId == 190 && (!item.invIds || item.invIds && !item.invIds.length))" prop="lawsuitReceiptNo">
            <el-input type="text" v-model="submitData.lawsuitReceiptNo" v-debounce:checkLawsuitReceiptNo="'input',500"></el-input>
          </el-form-item>
          <el-form-item label="诉讼费收据号:" v-if="isShowLitigFeeRecptNo" prop="lawsuitReceiptNo">
            <el-input type="text" v-model="submitData.lawsuitReceiptNo" v-debounce:noLimitcheckLawsuitReceiptNo="'input',1000"></el-input>
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
        <el-row v-if="isFinStaff">
          <el-form-item label="财务备注:">
            <el-input type="textarea" placeholder="请输入财务备注"  :autosize="{ minRows: 2, maxRows: 5}" v-model="submitData.financialRemarks"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="填报人:">
            <span>{{submitData.fillinUserIdStr?submitData.fillinUserIdStr:$store.getters.name}}</span>
            <span v-show="false">{{submitData.fillinUserId?submitData.fillinUserId:submitData.fillinUserId=$store.getters.userId}}</span>
          </el-form-item>
          <el-form-item label="填报日期:">
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
          <el-form-item label="核销状态:" style="border-bottom: 1px solid #EBEEF5;">
            <el-select :disabled="isCn" v-model="submitData.tobillStatus" filterable clearable reserve-keyword
                       placeholder="请选择核销状态">
              <el-option v-for="itm in [{id:1,value:'已核销'},
              {id:2,value:'延迟核销'},
              {id:3,value:'不开账单'},
              {id:0,value:'未核销'}]" :key="itm.id" :label="itm.value" :value="itm.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="核销日期:" style="border-bottom: 1px solid #EBEEF5;">
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
        <el-row v-if="!shouldHideFinanceRecheck()">
          <el-form-item label="财务负责人加审:" style="border-top: none;">
            <el-checkbox :disabled="isCn" v-model="submitData.financeRecheck" :true-label="1" :false-label="0">需要加审</el-checkbox>
          </el-form-item>
          <!-- <el-form-item
            label="加审人:"
            :required="submitData.financeRecheck === 1"
            style="border-top: none;">
            <el-select
              v-model="submitData.recheckUserIdList"
              multiple
              filterable
              clearable
              placeholder="请选择加审人">
              <el-option
                v-for="itm in recheckUserList"
                :key="itm.userId"
                :label="itm.fullname"
                :value="itm.userId">
              </el-option>
            </el-select>
          </el-form-item> -->
        </el-row>
        <el-row v-if="!shouldHideFinanceRecheck()">
          <el-form-item
            label="加审说明:"
            :required="submitData.financeRecheck === 1"
            style="border-bottom: 1px solid #EBEEF5;">
            <el-input
              :disabled="isCn"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5}"
              placeholder="请输入逾期报销或替票原因"
              v-model="submitData.overdueRemark"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="button_wrap" v-if="$route.params.pageType==1 || dialogFeeType == 1">
        <el-button class="exactButton" type="primary" @click="updateFee">保存</el-button>
        <el-button class="exactButton" type="primary" @click="submit">提交</el-button>
        <el-button class="exactButton" plain @click="cancel(false)">取消</el-button>
      </div>
      <div class="button_wrap" v-if="$route.params.pageType==2 || dialogFeeType == 2">
        <el-button class="exactButton" type="primary" @click="updateFee">保存</el-button>
        <el-button class="exactButton" plain @click="cancel(false)">取消</el-button>

      </div>
      <div class="button_wrap" v-if="$route.params.pageType==3 || dialogFeeType == 3">
        <template v-if="$route.query.taskNo==1 || dialogTaskNo == 1">
          <el-button class="exactButton" type="primary" @click="updateFee">保存</el-button>
          <el-button class="exactButton" type="primary" @click="submit">提交</el-button>
<!--          <el-button class="exactButton" plain @click="cancel(false)">取消</el-button>-->
        </template>
        <template v-if="$route.query.taskNo&&$route.query.taskNo != 1 && $route.query.taskNo != 6 || dialogTaskNo && dialogTaskNo != 1 && dialogTaskNo != 6">
          <el-button class="exactButton" type="primary" @click="submitFee(0)">退回</el-button>
          <el-button class="exactButton" type="primary" @click="submitFee(1)">通过</el-button>
<!--          <el-button class="exactButton" plain @click="cancel(false)">取消</el-button>-->
        </template>
        <template v-if="$route.query.taskNo==6 || dialogTaskNo == 6">
          <el-button class="exactButton" type="primary" @click="submitFee(1)">支付</el-button>
<!--          <el-button class="exactButton" plain @click="cancel(false)">取消</el-button>-->
        </template>
        <el-button class="exactButton" plain @click="cancel(false)">取消</el-button>
      </div>
    </div>
    <div class="TaskRecordWrap" v-if="$route.params.pageType!=1 && dialogFeeType != 1">
      <TaskRecord :id="$route.query.feeId || dialogFeeId"></TaskRecord>
    </div>
    <el-dialog title="案件选择" :visible.sync="selectCaseVisible" width="40%">
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
    <BusinessTripDrawer
      :drawerVisible.sync="drawerStatus"
      :btId="submitData.btId"
      @close="handleDrawerClose"
    />
  </div>
</template>

<script>
  import {saveLog} from '@/api/systemList'
  import ChooseCase from "../../case/components/ChooseCase";
  import TaskRecord from '../components/TaskRecord'
  import IdentifyInvoices from '../components/IdentifyInvoices'
  import getPageTitle from '@/utils/get-page-title'
  import {
    queryCustomerNameId,
    checkPermission,
    modifyInvoiceStatus,
    modifyVeriCode,
    queryProjectList
  } from '@/api/caseList'
  import {
    queryUsers,
    queryWorkgroupNames,
    queryDeptByCondition,
    queryUserById,
    queryWorkByUserId
  } from '@/api/systemList'
  import {
    createFee,
    queryFeeTypeList,
    submitFee,
    queryFeeInfo,
    updateFee,
    queryCompany,
    queryPayMode,
    createFeeInCase,
    deleteFee,
    querySpecificPayType,
    getCase,
    queryWorkGroupByUserId,
    getContractBase, getContractDetail, contractViewPdf, getBusinessTripListByUserId
  } from '@/api/feeList'
  import {queryZZWorkGroupUrl, disposeAgentNum} from "@/api/billApi";
  import {getMenuName, formatDate1} from '@/utils'
  import {deleteMaterial} from "@/api/customerList";
  import {creatematerial} from "@/api/ipServiceApi.config";
  import {checkLawsuitReceiptNo, queryUserByPermissionId} from "../../../../api/feeList";
  import { Popover } from 'element-ui';
  import { queryRecentProject } from '../../../../api/caseList'
  import { hideLoading, showLoading } from '@/utils/loading'
  import BusinessTripDrawer from '@/views/workbench/finance/cost/components/BusinessTripDrawer.vue'
  // 创建 Popover 组件
  export default {
    props: {
      dialogTaskNo: {
        default: 0
      },
      dialogFeeType: {
        type: Number,
        default: 0
      },
      dialogFeeId: {
        default: 0
      }
    },
    data() {
      var lawsuitReceiptNoValidator = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请填写诉讼费收据号'))
        } else {
          if (this.isShowLitigFeeRecptNo) {
            callback()
          }else{
            const reg = /^[0-9]\d{7}$/
            if (!reg.test(value)) {
              callback(new Error('诉讼费收据号只能为8位数字'))
            } else {
              callback()
            }
          }
        }
      }
      return {
        drawerStatus: false,
        isLoadingData: false,
        businessTripLoading: false,
        contractList: [],
        prjList: [],
        twoWorkList: [],
        reimburseWorkList: [],
        groupLoading: false,
        isCn: false,
        // isCn: (this.$route.params.pageType == 2 || this.dialogFeeType == 2) && (this.$route.query.taskNo == 6 || this.dialogTaskNo == 6),
        submitData: {
          belongtoDate: formatDate1(new Date()),
          feeDetails: [],
          payType: '',
          deptId: '',
          tobillStatus: 0,
          fillinDate: formatDate1(new Date()),
          suAudit: 0,
          travelExpenses: 0,
          beginDate: '',
          endDate: '',
          reimburseUserId: '',
          costWkgId: '',
          reimburseWkgId: '',
          tobillDate: '',
          isOverdueReimbursement: 0,
          hasInvoiceDateWarning: 0,
          financeRecheck: 0,
          recheckUserIds: '',
          // recheckUserIdList: [],
          overdueRemark: '',
          feeNo: '',
          paymentDeptId: '',
          specificPayType: '',
          caseArray: [],
          materialIdArray: [],
          invoiceLater: 0,
          contractId: ''
        },
        materialArray: [],
        materialIdList: [],
        recheckUserList: [],
        creatematerial,
        uploadFileData: {
          materialTypeId: 300014,
          tokenID: this.$store.getters.token
        },
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
        isFeeTypeLevel4: true,
        userList: [],
        caseState: false,
        workgroupNamesList: [],
        deptByConditionList: [],
        companyList: [],
        payTypeList: [],
        hasCaseList: [200, 199, 251, 203, 213, 212, 211, 215, 216, 214, 186, 182, 191, 259, 185, 192, 193, 194, 188, 187, 189, 190, 184, 183, 223, 224],
        noCaseList: [218, 205, 255, 249, 237, 207, 254, 206, 225, 208, 238, 262, 260, 204, 261, 222],
        querySpecificPayTypeList: [],
        invoiceLater: '',
        defaultParams: {
          value: 'feetId',
          label: 'feeName',
          checkStrictly: true,
          children: 'feeTypes'
        },
        selectCaseVisible: false,
        changeCaseVisible: false,
        selectCaseList: [],
        showPopper: false,
        curObj: {},
        eventObj: {},
        invoiceRemainingAmounts: {},
        rules: {
          beginDate: [{required: true, message: '请选择发生日期', trigger: 'blur'}],
          endDate: [{required: true, message: '请选择结束日期', trigger: 'blur'}],
          reimburseUserId: [{required: true, message: '请选择报销人', trigger: 'blur'}],
          costWkgId: [{required: true, message: '请选择费用承担工作组', trigger: 'blur'}],
          paymentDeptId: [{required: true, message: '请选择支付公司', trigger: 'blur'}],
          payType: [{required: true, message: '请选择支付方式', trigger: 'blur'}],
          feeNo: [{required: true, message: '请填写单据号', trigger: 'blur'}],
          invoiceLater: [{required: true, message: '请填写是否【后期提供发票】', trigger: 'blur'}],
          specificPayType: [{required: true, message: '请选择具体方式', trigger: 'blur'}],
          nocheckLawsuitReceiptNo: [{required: true, message: '请填写诉讼费收据号', trigger: 'blur'}],
          lawsuitReceiptNo: [{validator: lawsuitReceiptNoValidator, required: true, trigger: ['blur']}],
        },
        isFinStaff:false,
        businessTripList: []
      }
    },
    async created() {
      setTimeout(() => {
        this.queryUsers()
      })
      this.queryDeptByCondition()
      this.queryCompany()
      this.queryWorkgroupNames()
      if (this.$route.params.pageType == 1 || this.dialogFeeType == 1) {
        this.querySpecificPayType()
        this.submitData.feeDetails.push({})
        this.queryFeeTypeList().then(res => {
          this.feeTypeList = res.data
          this.feeTypeList = this.$commonUtils.cascaderDisabled(this.feeTypeList, 'feeTypes', 'isUse')
        })
      } else {
        let res = await this.queryFeeTypeList()
        this.feeTypeList = res.data
        this.feeTypeList = this.$commonUtils.cascaderDisabled(this.feeTypeList, 'feeTypes', 'isUse')
        this.queryFeeInfo()
      }
      if (this.$route.query.agentNums) {
        this.agentNums = this.$route.query.agentNums.replace(/,/g, '\n')
        this.getCase()
      }
      if (this.$route.query.contractId) {
        this.submitData.contractId = +this.$route.query.contractId
        getContractDetail({
          contractId: this.submitData.contractId
        }).then(res => {
          const selectedContract = res.data[0]
          this.contractList = [{
            contractName: selectedContract.contractName,
            contractNo: selectedContract.contractNo,
            contractId: selectedContract.contractId
          }]
          if (selectedContract.projectInfo && selectedContract.projectInfo.custIdstr) {
            this.custList.unshift({
              custId: +selectedContract.projectInfo.custIdstr,
              name: selectedContract.projectInfo.custIdName
            })
            this.$set(this.submitData, 'custId', +selectedContract.projectInfo.custIdstr)
          }

          // 费用承担工作组 - 客户组ID
          if (selectedContract.projectInfo && selectedContract.projectInfo.custWkgId) {
            this.$set(this.submitData, 'costWkgId', +selectedContract.projectInfo.custWkgId)
          }

          // 报销人 - 呈批人ID
          if (selectedContract.projectInfo && selectedContract.projectInfo.undertaker) {
            // this.$set(this.submitData, 'reimburseUserId', selectedContract.projectInfo.undertaker)
          }
        })
      }
      this.queryPermissionUserList()
    },
    methods: {
      queryPermissionUserList() {
        queryUserByPermissionId({id: 517}).then(res => {
          this.recheckUserList = res.data
        })
      },
      remoteMethodBusinessTrip(queryString) {
        if (queryString !== '') {
          this.businessTripLoading = true
          getBusinessTripListByUserId({ keywords: queryString, pageSize: 30, userId: this.submitData.reimburseUserId || undefined }).then(res => {
            if (res.success) {
              this.businessTripList = res.data || []
            }
          }).catch(err => {
            // this.$message.error('查询出差管理失败')
          }).finally(() => {
            this.businessTripLoading = false
          })
        } else {
          this.businessTripList = []
        }
      },
      openBusinessTripDrawer() {
        this.drawerStatus = true
      },
      handleDrawerClose() {
        this.drawerStatus = false
      },
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
      // 远程搜索合同
      remoteMethodContract(queryString) {
        if (queryString !== '') {
          getContractBase({ keywords: queryString, pageSize: 100 }).then(res => {
            if (res.success) {
              // 过滤掉contractNo为空的合同
              this.contractList = (res.data || []).filter(item => item.contractNo)
            }
          }).catch(err => {
            this.$message.error('查询合同失败')
          })
        } else {
          this.contractList = []
        }
      },
      // 合同选择变化处理
      handleContractChange(contractId) {
        if (contractId) {
          const selectedContract = this.contractList.find(item => item.contractId === contractId)
          if (selectedContract) {
            this.submitData.contractNo = selectedContract.contractNo
            // 自动填充表单字段
            // 客户ID - 取第一个
            if (selectedContract.projectInfo && selectedContract.projectInfo.custIdList && selectedContract.projectInfo.custIdList.length > 0) {
              this.custList.unshift({
                custId: selectedContract.projectInfo.custIdList[0],
                name: selectedContract.projectInfo.custIdNameList[0]
              })
              this.$set(this.submitData, 'custId', selectedContract.projectInfo.custIdList[0])
            }

            // 费用承担工作组 - 客户组ID
            if (selectedContract.projectInfo && selectedContract.projectInfo.custWkgId) {
              this.$set(this.submitData, 'costWkgId', selectedContract.projectInfo.custWkgId)
            }

            // 报销人 - 呈批人ID
            if (selectedContract.projectInfo && selectedContract.projectInfo.undertaker) {
              // this.$set(this.submitData, 'reimburseUserId', selectedContract.projectInfo.undertaker)
            }
          }
        } else {
          delete this.submitData.contractNo
        }

        // 检查是否需要自动勾选加审
        this.checkAutoRecheck()
      },
      // 统计发票总额,费用明细对应多张发票
      totalAmountInFiguers(data){
        let invoices = data ? data : []
        let amountList = invoices.map(item => item.amountInFiguers).filter(item => !!item)
        if (amountList.length == 0) {
          return 0.00
        }
        if (amountList.length == 1) {
          return amountList[0]
        } else {
          return invoices.map(item => item.amountInFiguers).filter(item => !!item).reduce((pre, next) => {
            return Number(pre) + Number(next)
          })
        }
      },
      preView(url){
        if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
          window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
        } else {
          this.$commonUtils.downLoadAll({url:`ipdoc${url}`})
        }
      },
      showPop(e, obj) {
        this.$set(this.submitData, 'invoiceLater', 0)
        this.curObj = obj;
        this.eventObj = e;
        this.$refs.pop1.popBy(e.target);
      },
      // 发票关联绑定
      invoiceRelated(invInfo,obj) {
        const { row = {} } = obj;
        const { invIds = [], invoices = [] } = row;

        if (!invIds.includes(invInfo.invId)) {
          const data = {
            ...row,
            invIds: [...invIds, invInfo.invId],
            invoices: [...invoices, invInfo],
          };

          this.showPopper = false;
          this.$set(this.submitData.feeDetails, obj.$index, data);
          if (invInfo.deptId){
            // 关联发票，更新支付方式
            this.$set(this.submitData,'paymentDeptId', invInfo.deptId);
            this.$set(this.submitData,'payType', '');
            queryPayMode({deptId: invInfo.deptId}).then(res => {
              this.payTypeList = res.data
            })
          }

          this.checkOverdueReimbursement()
          this.checkInvoiceDateWarning()
          this.initializeInvoiceRemainingAmounts()
        }else{
          this.$message.warning('此发票已关联当前费用！')
        }
      },
      // 取消关闭
      cancelClose() {
        this.$refs.pop1.popBy(this.eventObj.target);
      },
      // 初始化发票剩余可报销金额字典
      initializeInvoiceRemainingAmounts() {
        // 清空invoiceRemainingAmounts字典
        this.invoiceRemainingAmounts = {};
        for (let expense of this.submitData.feeDetails) {
          let { invoices = [] } = expense;
          for (let invoice of invoices) {
            let invId = invoice.invId;
            if (!Object.prototype.hasOwnProperty.call(this.invoiceRemainingAmounts, invId)) {
              this.invoiceRemainingAmounts[invId] = invoice.remainingAmount;
            }
          }
        }

        this.calculateRemainingAmounts()
      },
      // 计算剩余金额
      calculateRemainingAmounts() {
        this.$nextTick(() =>{
          for (let i = 0; i < this.submitData.feeDetails.length; i++) {
            let expense = this.submitData.feeDetails[i];
            let amount = expense.amount ? parseFloat(expense.amount).toFixed(2) : 0;
            let { invIds = [], invoices = [] } = expense
            let lastInvoiceIndex = invoices.length - 1; // 最后一张发票的索引

            // 遍历发票信息，依次进行报销
            for (let j = 0; j < invIds.length; j++) {
              let invId = invIds[j];
              let remainingAmount = this.invoiceRemainingAmounts[invId] || 0;
              for (let k = 0; k < invoices.length; k++) {
                let invoice = invoices[k];

                if (invoice.invId === invId) {
                  if (j === lastInvoiceIndex) {
                    // 最后一张发票，可报销金额可以为负数
                    let updatedRemainingAmount = remainingAmount - amount;
                    invoice.actualBalance = parseFloat(updatedRemainingAmount.toFixed(2));
                    amount -= remainingAmount;
                    remainingAmount = updatedRemainingAmount;
                  } else {
                    if (remainingAmount >= amount) {
                      let updatedRemainingAmount = remainingAmount - amount;
                      invoice.actualBalance = parseFloat(updatedRemainingAmount.toFixed(2));
                      remainingAmount = updatedRemainingAmount;
                      amount = 0;
                    } else {
                      amount -= remainingAmount;
                      invoice.actualBalance = 0;
                      remainingAmount = 0;
                    }
                  }
                }
              }

              // 更新invoiceRemainingAmounts中的剩余可报销金额
              this.invoiceRemainingAmounts[invId] = parseFloat(remainingAmount.toFixed(2));

              // 如果已完成报销，则无需继续遍历发票
              // if (amount === 0) {
              //   break;
              // }
            }
          }
          console.log('更新后的数据',this.invoiceRemainingAmounts,this.submitData.feeDetails)
        })
      },
      // 修改验真状态
      modifyVeriCode(row) {
        if (this.$store.getters.permissions.includes(397) && this.submitData.wfStatus == '查验' && row.veriCode == -11){
          modifyVeriCode({invId: row.invId, veriCode: 0 }).then(res => {
            if (res.success){
              this.$message({
                type: 'success',
                message: '手动验真成功！'
              });
              this.$set(row,'veriCode',0)
            }
          })
        }
      },
      // 删除发票关联
      deleteRelated(row,index,invId) {
        if (row.invIds && row.invoices) {
          const invIdIndex = row.invIds.findIndex(item => item == invId)
          row.invIds.splice(invIdIndex, 1);
          row.invoices.splice(index, 1);
        }
        this.initializeInvoiceRemainingAmounts()
      },
      // 删除发票明细
      deleteFeeDetail(index) {
        this.submitData.feeDetails.splice(index,1)
        this.initializeInvoiceRemainingAmounts()
      },
      // 验证发票金额是否小于费用金额
      hasRemainingAmount(invoices) {
        return invoices ? invoices.find(fee => fee.actualBalance < 0) : false
      },
      // 更改发票状态
      changeInvoiceStatus(row) {
        modifyInvoiceStatus({invId: row.invId, invStatus: 0 }).then(res => {
          if (res.success){
            this.$message({
              type: 'success',
              message: res.message
            });
            this.$set(row,'invStatus',0)
          }
        })
      },
      // 提交关联发票相关验证
      invoiceRelatedVerify() {
        if (this.submitData.invoiceLater == 0 && this.submitData.wfStatus != '查验' && this.submitData.wfStatus != '支付' && this.submitData.wfStatus != '已完成'){
          if (this.submitData.feeDetails.some(item => (!item.invIds || item.invIds.length === 0) && (!item.noInv || item.noInv != 1))) {
            this.returnExistMessage('后期提供发票为“否”，费用明细请关联发票或勾选“无需关联发票”')
            return false
          }

          const amounts = Object.values(this.invoiceRemainingAmounts);
          if (amounts.some(expense => expense < 0)) {
            this.returnExistMessage('金额大于发票金额，请注意费用明细标红！')
            return false
          }

          const allInvoices = [];
          // 将所有的invoices对象收集到一个数组中
          for (const feeDetail of this.submitData.feeDetails) {
            if (feeDetail.noInv != 1) {
              allInvoices.push(...feeDetail.invoices.filter(invoice => invoice.purchaserName && invoice.purchaserName !== '' && invoice.purchaserName !== null));
            }
          }
          if (allInvoices.length > 0){
            // 检查所有invoices对象的purchaserName是否一致
            const updatedInvoices = allInvoices.map(invoice => ({
              ...invoice,
              purchaserName: invoice.purchaserName.replace(/[^\u4e00-\u9fa5a-zA-Z]/g, '').replace(/\s+/g, '')
            }));

            const firstCompanyName = updatedInvoices[0].purchaserName.replace(/[^\u4e00-\u9fa5a-zA-Z]/g, '').replace(/\s+/g, '')
            const deptId = updatedInvoices.find(item => item.deptId) ? updatedInvoices.find(item => item.deptId).deptId : '';
            if (!updatedInvoices.every(invoice => invoice.purchaserName === firstCompanyName)) {
              this.returnExistMessage('费用关联发票存在公司主体名称不统一问题，请修改！');
              return false;
            }
            if (deptId && deptId != this.submitData.paymentDeptId){
              this.returnExistMessage('发票主体和支付公司不一致，请进行确认');
              return false;
            }
          }

          // if (this.submitData.total > this.submitData.invoiceTotal) {
          //   this.returnExistMessage('请注意，发票总金额需要大于等于总金额！')
          //   return false
          // }
        }
        return true
      },
      // 返回异常消息
      returnExistMessage(message) {
        this.$alert(message, '异常提醒', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {}
        });
      },
      changeIdentifyInvoices() {
        this.visiblepop = true
      },
      checkLawsuitReceiptNo() {
        const reg = /^[0-9]\d{7}$/
        reg.test(this.submitData.lawsuitReceiptNo) && checkLawsuitReceiptNo({
          lawsuitReceiptNo: this.submitData.lawsuitReceiptNo
        }).then(res => {

        }).catch(() => {
          this.$set(this.submitData, 'lawsuitReceiptNo', '')
        })
      },
      noLimitcheckLawsuitReceiptNo() {
        this.submitData.lawsuitReceiptNo && checkLawsuitReceiptNo({
          lawsuitReceiptNo: this.submitData.lawsuitReceiptNo
        }).then(res => {

        }).catch(() => {
          this.$set(this.submitData, 'lawsuitReceiptNo', '')
        })
      },
      changeCostWkg(id){
        if(this.workgroupNamesList.find(item =>item.wkgId == id)){
          this.$set(this.submitData, 'deptId', this.workgroupNamesList.find(item => item.wkgId == id).deptId)
        }
      },
      ChooseCaseClose(){
        this.changeCaseVisible = false
      },
      searchWorkGroup(value, list){
        if(!value)return;
        queryWorkGroupByUserId({fullName: value}).then(res => {
          this.$set(this, list, this.$commonUtils.unique([...this.workgroupNamesList.filter(k => k.groupName.includes(value)), ...res.data], 'wkgId'))
        })
        // if(!this.workgroupNamesList.find(item => item.groupName.includes(value))){
        //   queryWorkGroupByUserId({fullName: value}).then(res => {
        //     if(res.data && res.data.length){
        //       this.twoWorkList = this.workgroupNamesList.filter(i => res.data.find(j => j.wkgId == i.wkgId)).map(item => {
        //         item.groupName = item.groupName + '( ' + value + ' )'
        //         return item
        //       })
        //     }
        //   })
        // }else{
        //   this.twoWorkList = this.workgroupNamesList.filter(item => item.groupName.includes(value))
        // }
      },
      changePayType(v){
        if(!v || v && !v.includes('银行')){
          this.submitData.specificPayType = ''
        }
        if (v && v.includes('转') && !this.submitData.invoiceLater) {
          this.$set(this.submitData, 'invoiceLater', 0)
        }
      },
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
      checkFeeAmount(){
        if(this.submitData.wfStatus == '组长上级加批'|| this.submitData.wfStatus == '组长审核'){
          return true
        }
        let requireList = this.$wUtil.extractTree(this.feeTypeList, 'feeTypes', ['feetId', 'feeName', 'requiredPayee']).filter(item => item.requiredPayee)
        let feeName4 = ''
        if(!this.submitData.feeDetails){
          return true
        }

        if(this.submitData.feeDetails.find(item => !item.receiverName && item.feetIdList && item.feetIdList.find(i => requireList.find(j => { if(j.feetId == i){feeName4 = j.feeName};return j.feetId == i})))){
          this.$message.error(`请填写${feeName4}的收款对方名称！`)
         return false
        }
        if(this.submitData.feeDetails.find(item => item.feetIdList && item.feetIdList.find(i => i == 137 || i == 156) && !item.feeName) && (this.submitData.payType == '万慧达转账' || this.submitData.payType == '律所转账')){
          this.$message.error('请填写往返交通费用名称！')
          return false
        }
        if(this.submitData.feeDetails.find(item =>!item.amount)){
          this.$message.error('请填写费用明细金额！')
          return false
        }
        if(this.submitData.showRefno && !this.submitData.reimburseWkgId){
          this.$message.error('请选择报销人所属工作组！')
          return false
        }
        return true
      },
      getUploadData(caseIds) {
        const data = {
          tokenID: this.$store.getters.token
        }
        return data
      },
      handleRemove(file, fileList, caseId) {
        let delmaterialId;
        if (file.response) {
          delmaterialId = file.response.data[0].materialId;
        } else {
          delmaterialId = file.materialId;
        }
        deleteMaterial({materialId: delmaterialId}).then(res => {
          this.materialIdList.splice(this.materialIdList.indexOf(delmaterialId), 1)
        })
      },
      onPreview(file) {
        var a = document.createElement('a')
        if (file.raw && file.response) {
          a.setAttribute('href', '/ipdoc' + file.response.data[0].address)
        } else {
          a.setAttribute('href', '/ipdoc' + file.address)
        }
        a.setAttribute('id', 'startTelMedicine')
        a.setAttribute('target', '_blank')
        if (document.getElementById('startTelMedicine')) {
          document.body.removeChild(document.getElementById('startTelMedicine'))
        }
        document.body.appendChild(a)
        a.click()
      },
      beforeUpload() {
        showLoading()
      },
      onsuccess(res, file, fileList) {
        hideLoading()
        this.materialIdList.push(res.data[0].materialId)
      },
      getList(list) {
        console.log(list);
        const tmEndList = []
        list = list.filter(item => {
          if (item.taskType == 1 && item.status && item.status.includes('结案') && ['内-外', '外-外'].includes(item.appFromto) && this.submitData.feeDetails.find(it => it.feetIdList && it.feetIdList.includes(230))) {
            tmEndList.push(item.agentNum)
            return false
          }
          return true
        })
        if (tmEndList.length) {
          this.$message.error(`商标案件:${tmEndList.join('、')}已结案，不能在【垫款】科目下报费用！`)
        }
        if (list.length) {
          this.submitData.caseIds = list.map(item => item.caseId)
          this.submitData.caseArray = list
          this.submitData.custId = list[0].custId
          this.submitData.costWkgId = list[0].costWkgId
          if(this.workgroupNamesList.find(item =>item.wkgId == this.submitData.costWkgId)){
            this.$set(this.submitData, 'deptId', this.workgroupNamesList.find(item => item.wkgId == this.submitData.costWkgId).deptId)
          }
          this.$set(this, 'custList', [{custId: list[0].custId, name: list[0].custName}])
          disposeAgentNum({agentNumberArray: list.map(item => item.agentNum)}).then(res => {
            this.submitData.showRefno = res.data
            this.submitData.caseName = list[0].caseName
          })
        } else {
          this.submitData.showRefno = ''
          this.submitData.caseName = ''
          this.submitData.caseIds = null
        }
      },
      getCase() {
        getCase({agentNums: this.agentNums}).then(res => {
          this.caseData = res.data
          const tmEndList = []
          this.caseData = this.caseData.filter(item => {
            if (item.taskType == 1 && item.status && item.status.includes('结案') && ['内-外', '外-外'].includes(item.appFromto) && this.submitData.feeDetails.find(it => it.feetIdList && it.feetIdList.includes(230))) {
              tmEndList.push(item.agentNum)
              return false
            }
            return true
          })
          if (tmEndList.length) {
            this.$message.error(`商标案件:${tmEndList.join('、')}已结案，不能在【垫款】科目下报费用！`)
          }
          if (this.caseData && this.caseData.length) {
            this.submitData.custId = this.caseData[0].custId
            queryCustomerNameId({custId: this.submitData.custId}).then(res => {
              const list = res.data
              list.forEach(item => {
                item.name = item.fullname
              })
              this.$set(this, 'custList', list)
            })
            this.submitData.costWkgId = this.caseData[0].costWkgId
            this.submitData.deptId = this.caseData[0].deptId
            // this.submitData.paymentDeptId=res.data[0].paymentDeptId
          }
        })
      },
      querySpecificPayType() {
        querySpecificPayType({feeId: this.submitData.feeId}).then(res => {
          this.querySpecificPayTypeList = res.data
        })
      },
      catchange(row) {
        if (row.feetIdList.length == 4) {
          this.isFeeTypeLevel4 = true
          row.feetId = row.feetIdList[3]
          // if (this.$route.params.pageType == 1 || !row.feeName) {
          //   this.$set(row, 'feeName', this.$refs['cascader'].currentLabels[3])
          //   // row.feeName = this.$refs['cascader'].currentLabels[3]
          // }
        } else {
          this.isFeeTypeLevel4 = false
        }
        // row.feeName=getMenuName(this.feeTypeList, 'feeTypes').find(item => item.feetId == row.feetId).feeName

        // 检查是否需要自动勾选加审
        // this.checkAutoRecheck()
      },
      // 检查是否需要自动勾选加审
      checkAutoRecheck() {
        // 数据加载时不触发自动清空逻辑
        if (this.isLoadingData) {
          return
        }

        // 任务7746: 如果满足条件，取消勾选负责人加审
        if (this.shouldHideFinanceRecheck()) {
          this.$set(this.submitData, 'financeRecheck', 0)
          this.submitData.recheckUserIds = ""
          return
        } else {
          // 任务7628
          // 情况1: 存在feetId为134
          const has134 = this.submitData.feeDetails.some(item => item.feetId == 134)

          // 情况2: 存在feetId为202,并且所有feetId为202的费用明细金额大于100000
          const fee202List = this.submitData.feeDetails.filter(item => item.feetId == 202)
          const has202Over100000 = fee202List.length > 0 && fee202List.every(item => Number(item.amount) > 100000)

          // 情况3: 存在feetId为210,且当前费用没有绑定合同
          const has210NoContract = this.submitData.feeDetails.some(item => item.feetId == 210) && !this.submitData.contractId

          // 满足任一条件则自动勾选加审
          if (has134 || has202Over100000 || has210NoContract) {
            // 勾选财务负责人加审
            this.$set(this.submitData, 'financeRecheck', 1)
            // 自动勾选所有加审人
            // if (this.recheckUserList.length > 0) {
            //   this.$set(this.submitData, 'recheckUserIdList', this.recheckUserList.map(item => item.userId))
            // }
          } else {
            this.$set(this.submitData, 'financeRecheck', 0)
            // this.$set(this.submitData, 'recheckUserIdList', [])
          }
        }
      },
      // 任务7746：判断是否应该隐藏负责人加审
      shouldHideFinanceRecheck() {
        if (!this.submitData.feeDetails || this.submitData.feeDetails.length === 0) {
          return false
        }

        // 检查是否存在feetId为118、119、120且金额<300的
        const hasSmallAmount = this.submitData.feeDetails.some(item =>
          [118, 119, 120].includes(item.feetId) && Number(item.amount) < 300
        )

        // 检查是否存在科目名称包含"样品"或"样品费"的,142、147、168
        const hasSampleFee = this.submitData.feeDetails.some(item =>
          [142, 147, 168].includes(item.feetId)
        )

        return hasSmallAmount || hasSampleFee && this.submitData.suAudit
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

          // this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId);
          // this.selectCaseVisible = false;
        }
      },
      queryFeeInfo() {
        this.isLoadingData = true
        queryFeeInfo({feeId: this.$route.query.feeId || this.dialogFeeId}).then(res => {
          if (res.data.caseIds && res.data.caseIds.length == 0) {
            res.data.caseIds = null
          }

          this.submitData = res.data || {}

          // 将加审人字符串转换为数组
          // if (this.submitData.recheckUserIds && typeof this.submitData.recheckUserIds === 'string') {
          //   this.$set(this.submitData, 'recheckUserIdList', this.submitData.recheckUserIds.split(',').map(id => parseInt(id)))
          // } else {
          //   this.$set(this.submitData, 'recheckUserIdList', [])
          // }


          if (this.submitData.projectId) {
            this.prjList = [{
              prjName: this.submitData.prjName,
              projectId: this.submitData.projectId
            }]
          }
          if (this.submitData.contractId) {
            this.contractList = [{
              contractName: this.submitData.contractName,
              contractNo: this.submitData.contractNo,
              contractId: this.submitData.contractId
            }]
          }
          this.isCn = (this.$route.params.pageType == 2 || this.dialogFeeType == 2 || this.dialogFeeType == 3) && (this.$route.query.taskNo == 6 || this.dialogTaskNo == 6) && this.submitData.taskId
          if(this.dialogTaskNo == 6){
            this.$set(this.submitData, 'belongtoDate', this.$wUtil.getDate('', 'day'))
          }
          this.materialArray = this.submitData.materialArray
          this.materialArray.forEach(item => {
            item.name = item.materialName
          })
          this.materialIdList = this.materialArray.map(item => item.materialId)
          this.defaultSubmitData = JSON.parse(JSON.stringify(res.data))
          this.queryPayMode()
          this.querySpecificPayType()
          this.submitData.feeDetails.forEach(item => {
            item.feetIdList = this.$commonUtils.getTwoDimensionalArray(this.feeTypeList, 'feetId', item.feetId, {children: 'feeTypes'})

          })
          if (this.submitData.custId) {
            queryCustomerNameId({custId: this.submitData.custId}).then(res => {
              const list = res.data
              list.forEach(item => {
                item.name = item.fullname
              })
              this.$set(this, 'custList', list)
            })
          }

          this.initializeInvoiceRemainingAmounts()
          this.isFinStaff = this.submitData.isFinancial

          // 如果有出差管理ID，获取出差详情并添加到列表中
          if (this.submitData.btId) {
            this.businessTripList = [{
              btId: this.submitData.btId,
              btDesc: this.submitData.btDesc
            }]
            // getBtById({ btId: this.submitData.btId }).then(btRes => {
            //   if (btRes.success && btRes.data) {
            //     this.businessTripList = [btRes.data]
            //   }
            // }).catch(err => {
            //   console.error('获取出差详情失败', err)
            // })
          }

          this.$nextTick(() => {
            this.isLoadingData = false
          })
        })
      },
      queryFeeTypeList() {
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
      // 检查是否逾期报销
      checkOverdueReimbursement() {
        const compareDate = this.submitData.submitDate || this.submitData.fillinDate
        if (!compareDate || !this.submitData.endDate) {
          this.$set(this.submitData, 'isOverdueReimbursement', 0)
          // 不修改 financeRecheck，保留后端返回的值或用户手动设置的值
          return
        }

        const compareDateObj = new Date(compareDate)
        const endDateObj = new Date(this.submitData.endDate)

        // 计算对比日期减3个月
        const threeMonthsAgo = new Date(compareDateObj)
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

        // 计算对比日期减1个月
        const oneMonthAgo = new Date(compareDateObj)
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

        // 检查是否有任何费用明细的发票开具日期早于3个月
        const hasOverdueInvoice = this.submitData.feeDetails.some(detail => {
          // 检查关联发票中的发票开具日期
          if (!detail.invoices || !Array.isArray(detail.invoices)) return false
          return detail.invoices.some(invoice => {
            if (!invoice.invoiceDate) return false
            const invoiceDateObj = new Date(invoice.invoiceDate)
            return invoiceDateObj < threeMonthsAgo
          })
        })

        // 检查结束日期是否早于1个月
        const isEndDateOverdue = endDateObj < oneMonthAgo

        // 当发票开具日期逾期 且 结束日期逾期时，标记为逾期报销
        const isOverdue = hasOverdueInvoice && isEndDateOverdue
        this.$set(this.submitData, 'isOverdueReimbursement', isOverdue ? 1 : 0)
        // 计算出逾期时设置 financeRecheck 为 1
        if (isOverdue) {
          this.$set(this.submitData, 'financeRecheck', 1)
        } else {
          // 数据加载时不触发自动清空逻辑
          if (!this.isLoadingData) {
            this.$set(this.submitData, 'financeRecheck', 0)
            // this.$set(this.submitData, 'recheckUserIdList', [])
          }
        }
      },
      // 检查是否有发票开具日期警告
      checkInvoiceDateWarning() {
        const compareDate = this.submitData.submitDate || this.submitData.fillinDate
        if (!compareDate) {
          this.submitData.hasInvoiceDateWarning = 0
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
      remoteMethod(value) {
        queryCustomerNameId({pageNo: 1, pageSize: 100, keyword: value}).then(
          res => {
            const list = res.data
            list.forEach(item => {
              item.name = item.fullname
            })
            this.custList = list
          }
        );
      },
      remoteMethodPrj(value) {
        queryRecentProject({pageNo: 1, pageSize: 100, prjName: value}).then(
          res => {
            this.prjList = res.data
          }
        );
      },
      queryCompany() {
        queryCompany().then(res => {
          this.companyList = res.data
          if (this.$route.params.pageType == 1 || this.dialogFeeType == 1) {
            let data = this.companyList.find(item => item.companyShortName == this.$store.getters.corporationName)
            if (data) {
              this.submitData.paymentDeptId = data.deptId

            }
            this.queryPayMode(this.submitData.paymentDeptId)
          }

        })
      },
      queryUsers() {
        // queryUsers({pageNo:1,pageSize:10000}).then(res=>{
        //
        // })
        this.userList = this.$store.getters.userList
        if (this.$route.params.pageType == 1 || this.dialogFeeType == 1) {
          this.submitData.reimburseUserId = this.$store.getters.userId
          this.submitData.endDate = this.$commonUtils.formatDate1(new Date())
          this.changeReibuserUserId(this.submitData.reimburseUserId)
        }
      },
      queryFeeTaskDefine() {

      },
      queryWorkgroupNames() {
        queryZZWorkGroupUrl().then(res => {
          this.workgroupNamesList = res.data
          this.twoWorkList = [...res.data]
          this.reimburseWorkList = [...res.data]
          if ((this.$route.params.pageType == 1 || this.dialogFeeType == 1) && !this.$route.query.agentNums) {
            this.queryWorkByUserId()
          }
        })
      },
      ruleCaseFee() {
        if (this.submitData.payType && this.submitData.payType.includes('银行')) {
          this.rules.specificPayType[0].required = true
        } else {
          this.rules.specificPayType[0].required = false
        }
        // return true
        if (this.$route.params.pageType == 1 || this.dialogFeeType == 1) {
          if (this.$commonUtils.getLanglist(this.submitData.feeDetails.map(item => item.feetIdList)).includes(229) && !this.caseData.length) {
            this.$message.error('案内费用必须添加案件')
            return false
          }
          if (this.$commonUtils.getLanglist(this.submitData.feeDetails.map(item => item.feetIdList)).includes(228) && this.caseData.length) {
            this.$message.error('日常费用不能添加案件')
            return false
          }
          let arr = this.$commonUtils.getLanglist(this.submitData.feeDetails.map(item => item.feetIdList))
          if (this.noCaseList.some(item => arr.includes(item)) && this.caseData.length) {
            this.caseState = true
            this.$message.error('该垫款事项不能添加案件')
            return false
          }
          if (this.hasCaseList.some(item => arr.includes(item)) && !this.caseData.length) {
            this.$message.error('该垫款事项必须添加案件')
            return false
          }

          return true
        } else {
          if (this.$commonUtils.getLanglist(this.submitData.feeDetails.map(item => item.feetIdList)).includes(229) && !this.submitData.caseIds) {
            this.caseState = true
            this.$message.error('案内费用必须添加案件')
            return false
          }
          if (this.$commonUtils.getLanglist(this.submitData.feeDetails.map(item => item.feetIdList)).includes(228) && this.submitData.caseIds && this.submitData.caseIds.length) {
            this.caseState = true
            this.$message.error('日常费用不能添加案件')
            return false
          }
          let arr = this.$commonUtils.getLanglist(this.submitData.feeDetails.map(item => item.feetIdList))
          if (this.noCaseList.some(item => arr.includes(item)) && this.submitData.caseIds && this.submitData.caseIds.length) {
            this.caseState = true
            this.$message.error('该垫款事项不能添加案件')
            return false
          }
          if (this.hasCaseList.some(item => arr.includes(item)) && !this.submitData.caseIds) {
            this.caseState = true
            this.$message.error('该垫款事项必须添加案件')
            return false
          }
          return true
        }//
      },
      changeReibuserUserId(e) {
        queryWorkByUserId({userId: e}).then(res => {
          if (res.data.groups && res.data.groups.length) {
            // this.submitData.costWkgId= res.data.groups[0].wkgId
            this.submitData.reimburseWkgId = res.data.groups[0].wkgId
          }
        })
      },
      queryWorkByUserId() {
        // queryWorkByUserId({userId:this.$store.getters.userId}).then(res=>{
        //   if(res.data.groups&&res.data.groups.length){
        //    this.submitData.costWkgId= res.data.groups[0].wkgId
        //     this.submitData.reimburseWkgId=res.data.groups[0].wkgId
        //   }
        // })
        queryUserById(this.$store.getters.userId).then(res => {
          if (res.data.user) {
            this.submitData.deptId = res.data.user.deptId
          }
          if (res.data.groups && res.data.groups.length) {
            if (res.data.groups && res.data.groups.length && !this.submitData.costWkgId) {
              this.submitData.costWkgId = res.data.groups[0].wkgId
              // this.submitData.reimburseWkgId=res.data.groups[0].wkgId
            }
          }
        })
      },
      queryDeptByCondition() {
        queryDeptByCondition({isactive: 1}).then(res => {
          this.deptByConditionList = res.data
        })
      },
      queryPayMode(e) {
        if (e) {
          this.submitData.payType = ''
        }

        if (this.submitData.paymentDeptId) {
          queryPayMode({deptId: this.submitData.paymentDeptId}).then(res => {
            this.payTypeList = res.data
          })
        } else {
          this.payTypeList = []
        }
      },
      async checkTravelExpenses() {
        if (!this.submitData.travelExpenses && this.submitData.feeDetails.length && this.submitData.feeDetails.find(item => [137, 139, 140, 156, 158, 159].includes(item.feetId))) {
          return await this.$confirm('是否为差旅费',
            "提示",
            {
              // distinguishCancelAndClose:true,
              confirmButtonText: "是",
              cancelButtonText: "否",
              type: "warning"
            }
          ).then(() => {
            return 1;
          }).catch((err) => {
            return 0;
          })
        }else{
          return 'noChange'
        }
      },
      async submit() {
        if(!this.checkFeeAmount())return;
        this.submitData.materialIdArray = this.materialIdList
        delete this.submitData.materialArray
        if (!this.ruleCaseFee()) {
          return
        }
        if (!this.isFeeTypeLevel4) {
          this.$message.error('请选择费用的四级科目！')
          return
        }
        if (this.submitData.feeDetails && this.submitData.feeDetails.find(j => j.feetId == 210) && !this.submitData.custId) { // id:210,垫款/各类可收回垫款/垫款/退款
          const confirmed = await this.$confirm('有客户必须填写客户名称！是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return true
          }).catch(() => {
            return false
          })
          if (!confirmed) return
        }
        // 关联发票验证
        if(!this.invoiceRelatedVerify())return;

        if (!this.$commonUtils.formValidate(this.$refs['ruleForm'])) return
        // const [err, data] = await this.$commonUtils.awaitWrap(this.$refs.ruleForm.validate())
        // if (!data) {
        //   this.$message.error('请填写必填项')
        //   return
        // }
        let flag = await this.checkTravelExpenses();
        if(flag == 'noChange'){

        }else{
          this.submitData.travelExpenses = flag;
        }

        // 验证财务负责人加审必填项
        if (this.submitData.financeRecheck === 1) {
          // if (!this.submitData.recheckUserIdList || this.submitData.recheckUserIdList.length === 0) {
          //   this.$message.error('加审人为必填项')
          //   return
          // }
          if (!this.submitData.overdueRemark || this.submitData.overdueRemark.trim() === '') {
            this.$message.error('加审说明为必填项')
            return
          }
        }

        // 验证合同号：当费用明细中包含feetId为281或282时，必须填写合同号
        const hasSpecialFeeType = this.submitData.feeDetails.some(item =>
          item.feetId === 281 || item.feetId === 282
        )
        if (hasSpecialFeeType && !this.submitData.contractNo) {
          this.$message.error('费用明细中包含第三方主体使用费，合同号为必填项')
          return
        }

        // 逾期报销确认提示
        if (this.submitData.isOverdueReimbursement === 1) {
          const confirmed = await this.$confirm('费用报销逾期，需要财务负责人加审！（发票开具日期超过（填报）提交日期的3个月，且，结束日期超过（填报）提交日期的1个月，视为逾期报销！）', '逾期报销提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return true
          }).catch(() => {
            return false
          })
          if (!confirmed) return
        }

        // this.checkFeeName()
        if (this.caseData.length) {
          if (!this.submitData.feeId) {
            if (this.caseData.find(it =>　it.status && it.status.includes('结案') && it.taskType == 1 && ['内-外', '外-外'].includes(it.appFromto)) && this.submitData.feeDetails.find(it => it.feetIdList && it.feetIdList.includes(230))) {
              this.$message.error('此案件已结案，不能在【垫款】科目下报费用！')
              return
            }
            createFeeInCase({caseIds: this.caseData.map(item => item.caseId), checkCase: 1}).then(res => {
              if(res.message.includes('案件已闭卷')){
                this.$confirm(res.message, "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(()=>{
                  createFeeInCase({caseIds: this.caseData.map(item => item.caseId)}).then(res=>{
                    this.submitData.taskIdList = res.data[0].taskId
                    this.submitData.taskId = res.data[0].taskId
                    this.submitData.feeId = res.data[0].feeId
                    this.submitData.caseIds = this.caseData.map(item => item.caseId)
                    this.submitData.feeDetails.forEach(item => {
                      item.feeId = this.submitData.feeId
                      delete item.feetIdList
                      delete item.invoices // 删除关联发票信息
                    })
                    submitFee(this.submitData).then(Response => {
                      this.successed(true)
                    }).catch((e) => {
                      if (e.messageType == -4) {
                        return
                      } else {
                        this.successed(false)
                      }
                      saveLog({
                        content: JSON.stringify({
                          feeId: this.submitData.feeId,
                          message: '费用审核报错' + e.message,
                          logType: 1
                        })
                      })
                    })
                  })
                }).catch(()=>{
                  this.$message({
                    type: "info",
                    message: "已取消操作"
                  });
                })
              }else{
                this.submitData.taskIdList = res.data[0].taskId
                this.submitData.taskId = res.data[0].taskId
                this.submitData.feeId = res.data[0].feeId
                this.submitData.caseIds = this.caseData.map(item => item.caseId)
                this.submitData.feeDetails.forEach(item => {
                  item.feeId = this.submitData.feeId
                  delete item.feetIdList
                  delete item.invoices // 删除关联发票信息
                })
                submitFee(this.submitData).then(Response => {
                  this.successed(true)
                }).catch((e) => {
                  if (e.messageType == -4) {
                    return
                  } else {
                    this.successed(false)
                  }
                  saveLog({
                    content: JSON.stringify({
                      feeId: this.submitData.feeId,
                      message: '费用审核报错' + e.message,
                      logType: 1
                    })
                  })
                })
              }
            }).catch((e) => {
              if (e.messageType == -4) {
                return
              } else {
                this.successed(false)
              }
              saveLog({
                content: JSON.stringify({
                  feeId: this.submitData.feeId,
                  message: '费用审核报错' + e.message,
                  logType: 2
                })
              }).then(res => {


              })
            })
          } else {
            this.submitData.taskIdList = this.submitData.taskId
            this.submitData.feeDetails.forEach(item => {
              item.feeId = this.submitData.feeId
              delete item.feetIdList
              delete item.invoices // 删除关联发票信息
            })
            submitFee(this.submitData).then(Response => {
              this.successed({feeIds: this.submitData.feeId, feeDetailIds: this.submitData.feeDetails && this.submitData.feeDetails.map(item => item.feeDetailId) })
            }).catch((e) => {
              if (e.messageType == -4) {
                return
              } else {
                this.successed(false)
              }
              saveLog({
                content: JSON.stringify({
                  feeId: this.submitData.feeId,
                  message: '费用审核报错' + e.message,
                  logType: 3
                })
              }).then(res => {


              })

            })
          }
        } else {
          if (!this.submitData.feeId) {
            createFee().then(res => {
              this.submitData.taskIdList = res.data[0].taskId
              this.submitData.taskId = res.data[0].taskId
              this.submitData.feeId = res.data[0].feeId
              this.submitData.feeDetails.forEach(item => {
                item.feeId = this.submitData.feeId
                delete item.feetIdList
                delete item.invoices // 删除关联发票信息
              })
              submitFee(this.submitData).then(Response => {
                this.successed(true)
              }).catch((e) => {
                if (e.messageType == -4) {
                  return
                } else {
                  this.successed(false)
                }
                saveLog({
                  content: JSON.stringify({
                    feeId: this.submitData.feeId,
                    message: '费用审核报错' + e.message,
                    logType: 4
                  })
                }).then(res => {

                })

              })
            }).catch((e) => {
              saveLog({
                content: JSON.stringify({
                  feeId: this.submitData.feeId,
                  message: '费用审核报错' + e.message,
                  logType: 5
                })
              }).then(res => {

              })

            })
          } else {
            this.submitData.taskIdList = this.submitData.taskId
            this.submitData.feeDetails.forEach(item => {
              item.feeId = this.submitData.feeId
              delete item.feetIdList
              delete item.invoices // 删除关联发票信息
            })
            submitFee(this.submitData).then(Response => {
              this.successed({feeIds: this.submitData.feeId, feeDetailIds: this.submitData.feeDetails && this.submitData.feeDetails.map(item => item.feeDetailId) })
            }).catch((e) => {
              if (e.messageType == -4) {
                return
              } else {
                this.successed(false)
              }
              saveLog({
                content: JSON.stringify({
                  feeId: this.submitData.feeId,
                  message: '费用审核报错' + e.message,
                  logType: 6
                })
              }).then(res => {


              })

            })
          }
        }
      },
      async submitFee(result) {
        if(!this.checkFeeAmount())return;
        this.submitData.materialIdArray = this.materialIdList
        delete this.submitData.materialArray
        if (!this.ruleCaseFee()) {
          return
        }
        if (!this.isFeeTypeLevel4) {
          this.$message.error('请选择费用的四级科目！')
          return
        }
        // 关联发票验证
        if(result && !this.invoiceRelatedVerify())return;

        let rst = true
        // 关联发票未验真提醒
        if (result && this.submitData.wfStatus == '查验' && this.submitData.feeDetails.find(item => item.invoices && item.invoices.some(invoice => invoice.veriCode != 0))){
          rst = await this.$confirm('费用关联发票，存在发票未验真通过, 是否继续通过查验！', '提示', {
            confirmButtonText: '确定通过',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return true
          }).catch(() => {
            return false
          });
          if (!rst)return;
        }

        if (result) {
          const [err, data] = await this.$commonUtils.awaitWrap(this.$refs.ruleForm.validate())
          if (!data) {
            this.$message.error('请填写必填项')
            return
          }
        }
        if (this.submitData.feeDetails && this.submitData.feeDetails.find(j => j.feetId == 210) && !this.submitData.custId) { // id:210,垫款/各类可收回垫款/垫款/退款
          const confirmed = await this.$confirm('有客户必须填写客户名称！是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return true
          }).catch(() => {
            return false
          })
          if (!confirmed) return
        }
        // 验证财务负责人加审必填项
        if (this.submitData.financeRecheck === 1) {
          // if (!this.submitData.recheckUserIdList || this.submitData.recheckUserIdList.length === 0) {
          //   this.$message.error('加审人为必填项')
          //   return
          // }
          if (!this.submitData.overdueRemark || this.submitData.overdueRemark.trim() === '') {
            this.$message.error('加审说明为必填项')
            return
          }
        }

        // 逾期报销确认提示
        if (this.submitData.isOverdueReimbursement === 1) {
          const confirmed = await this.$confirm('费用报销逾期，需要财务负责人加审！（发票开具日期超过（填报）提交日期的3个月，且，结束日期超过（填报）提交日期的1个月，视为逾期报销！）', '逾期报销提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return true
          }).catch(() => {
            return false
          })
          if (!confirmed) return
        }

        // this.checkFeeName()
        this.submitData.taskIdList = this.submitData.taskId
        this.submitData.result = result

        if (result) {
          this.submitData.feeDetails.forEach(item => {
            item.feeId = this.submitData.feeId
            delete item.feetIdList
            delete item.invoices // 删除关联发票信息
          })
          submitFee(this.submitData).then(Response => {
            this.successed({feeIds: this.submitData.feeId, feeDetailIds: this.submitData.feeDetails && this.submitData.feeDetails.map(item => item.feeDetailId) })
          }).catch((e) => {
            if (e.messageType == -4) {
              return
            } else {
              this.successed(false)
            }
            saveLog({
              content: JSON.stringify({
                feeId: this.submitData.feeId,
                message: '费用审核报错' + e.message,
                logType: 7
              })
            }).then(res => {


            })

          })
        } else {
          this.$prompt('请输入退回原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: (value) => {
              if (value !== null && value !== '') return true
              return false
            },
            inputErrorMessage: '请输入退回原因'
          }).then(({value}) => {
            this.submitData.feeDetails.forEach(item => {
              item.feeId = this.submitData.feeId
              delete item.feetIdList
              delete item.invoices // 删除关联发票信息
            })
            this.submitData.failReason = value
            submitFee(this.submitData).then(Response => {
              this.successed({feeIds: this.submitData.feeId, feeDetailIds: this.submitData.feeDetails && this.submitData.feeDetails.map(item => item.feeDetailId) })
            }).catch((e) => {
              if (e.messageType == -4) {
                return
              } else {
                this.successed(false)
              }
              saveLog({
                content: JSON.stringify({
                  feeId: this.submitData.feeId,
                  message: '费用审核报错' + e.message,
                  logType: 7
                })
              }).then(res => {


              })

            })
          }).catch(() => {})
        }
      },
      recursiveFunction(a) {
        let typeList = []
        const getObj = (arr) => {
          arr.forEach(function (row) {
            if (row.feeTypes) {
              getObj(row.feeTypes)
            } else {
              typeList.push({'feetId': row.feetId, 'feeName': row.feeName})
            }
          })
        }
        getObj(a)
        return typeList
      },
      checkFeeName() {
        if (this.submitData.feeDetails.length) {
          this.submitData.feeDetails.forEach(row => {
            if (row.feetIdList.length == 4 && !row.feeName) {
              // row.feetId = row.feetIdList[3]
              if (this.$route.params.pageType == 1 || this.dialogFeeType == 1 || !row.feeName) {
                // this.$set(row, 'feeName', this.$refs['cascader'].currentLabels[3])
                row.feeName = this.recursiveFunction(this.feeTypeList).find(i => i.feetId == row.feetId).feeName
              }
            }
          })
        }
      },
      async updateFee() {
        if(!this.checkFeeAmount())return;
        this.submitData.materialIdArray = this.materialIdList
        delete this.submitData.materialArray
        if (!this.ruleCaseFee()) {
          return
        }
        if (!this.isFeeTypeLevel4) {
          this.$message.error('请选择费用的四级科目！')
          return
        }

        // 关联发票验证
        if(!this.invoiceRelatedVerify())return;

        if (!this.$commonUtils.formValidate(this.$refs['ruleForm'])) return
        // const [err, data] = await this.$commonUtils.awaitWrap(this.$refs.ruleForm.validate())
        // if (!data) {
        //   this.$message.error('请填写必填项')
        //   return
        // }
        let flag = await this.checkTravelExpenses();
        if(flag == 'noChange'){

        }else{
          this.submitData.travelExpenses = flag;
        }

        // 验证财务负责人加审必填项
        if (this.submitData.financeRecheck === 1) {
          // if (!this.submitData.recheckUserIdList || this.submitData.recheckUserIdList.length === 0) {
          //   this.$message.error('加审人为必填项')
          //   return
          // }
          if (!this.submitData.overdueRemark || this.submitData.overdueRemark.trim() === '') {
            this.$message.error('加审说明为必填项')
            return
          }
        }

        // 验证合同号：当费用明细中包含feetId为281或282时，必须填写合同号
        const hasSpecialFeeType = this.submitData.feeDetails.some(item =>
          item.feetId === 281 || item.feetId === 282
        )
        if (hasSpecialFeeType && !this.submitData.contractNo) {
          this.$message.error('费用明细中包含第三方主体使用费，合同号为必填项')
          return
        }

        if (this.submitData.feeDetails && this.submitData.feeDetails.find(j => j.feetId == 210) && !this.submitData.custId) { // id:210,垫款/各类可收回垫款/垫款/退款
          const confirmed = await this.$confirm('有客户必须填写客户名称！是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return true
          }).catch(() => {
            return false
          })
          if (!confirmed) return
        }
        // 逾期报销确认提示
        if (this.submitData.isOverdueReimbursement === 1) {
          const confirmed = await this.$confirm('费用报销逾期，需要财务负责人加审！（发票开具日期超过（填报）提交日期的3个月，且，结束日期超过（填报）提交日期的1个月，视为逾期报销！）', '逾期报销提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return true
          }).catch(() => {
            return false
          })
          if (!confirmed) return
        }

        // this.checkFeeName()
        if ((this.$route.params.pageType == 1 || this.dialogFeeType == 1) && !this.submitData.feeId) {
          if (this.caseData.length) {
            if (this.caseData.find(it =>　it.status && it.status.includes('结案') && it.taskType == 1 && ['内-外', '外-外'].includes(it.appFromto)) && this.submitData.feeDetails.find(it => it.feetIdList && it.feetIdList.includes(230))) {
              this.$message.error('此案件已结案，不能在【垫款】科目下报费用！')
              return
            }
            createFeeInCase({caseIds: this.caseData.map(item => item.caseId), checkCase: 1}).then(res => {
              if(res.message.includes('案件已闭卷')){
                this.$confirm(res.message, "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(()=>{
                  createFeeInCase({caseIds: this.caseData.map(item => item.caseId)}).then(res=>{
                    this.submitData.taskIdList = res.data[0].taskId
                    this.submitData.feeId = res.data[0].feeId
                    this.submitData.caseIds = this.caseData.map(item => item.caseId)
                    this.submitData.feeDetails.forEach(item => {
                      item.feeId = this.submitData.feeId
                      delete item.feetIdList
                      delete item.invoices // 删除关联发票信息
                    })
                    updateFee(this.submitData).then(Response => {
                      this.successed(true)
                    })
                  })
                }).catch(()=>{
                  this.$message({
                    type: "info",
                    message: "已取消操作"
                  });
                })
              }else{
                this.submitData.taskIdList = res.data[0].taskId
                this.submitData.feeId = res.data[0].feeId
                this.submitData.caseIds = this.caseData.map(item => item.caseId)
                this.submitData.feeDetails.forEach(item => {
                  item.feeId = this.submitData.feeId
                  delete item.feetIdList
                  delete item.invoices // 删除关联发票信息
                })
                updateFee(this.submitData).then(Response => {
                  this.successed(true)
                })
              }
            }).catch((e) => {
              if (e.messageType == -4) {
                return
              } else {
                this.successed(false)
              }
              saveLog({
                content: JSON.stringify({
                  feeId: this.submitData.feeId,
                  message: '费用审核报错' + e.message,
                  logType: 8
                })
              }).then(res => {


              })

            })
          } else {
            createFee().then(res => {
              this.submitData.taskIdList = res.data[0].taskId
              this.submitData.feeId = res.data[0].feeId
              this.submitData.feeDetails.forEach(item => {
                item.feeId = this.submitData.feeId
                delete item.feetIdList
                delete item.invoices // 删除关联发票信息
              })
              updateFee(this.submitData).then(Response => {
                this.successed(true)
              })
            }).catch((e) => {

              saveLog({
                content: JSON.stringify({
                  feeId: this.submitData.feeId,
                  message: '费用审核报错' + e.message,
                  logType: 9
                })
              }).then(res => {


              })

            })
          }
        } else {
          this.submitData.taskIdList = this.submitData.taskId
          this.submitData.feeDetails.forEach(item => {
            item.feeId = this.submitData.feeId
            delete item.feetIdList
            delete item.invoices // 删除关联发票信息
          })
          updateFee(this.submitData).then(Response => {
            this.successed({feeIds: this.submitData.feeId, feeDetailIds: this.submitData.feeDetails && this.submitData.feeDetails.map(item => item.feeDetailId) })
          })
        }
      },
      successed(search) {
        this.$message.success('操作成功')
        this.cancel(search)
      },
      cancel(search) {
        if(this.dialogFeeType){
          this.$emit('close', search)
        }else{
         this.$router.go(-1)
        }
      }

    },
    watch: {
      totalSum(n) {
        this.submitData.total = n
      },
      invoiceTotalSum(n) {
        this.submitData.invoiceTotal = n
      },
      // 'submitData.recheckUserIdList': {
      //   handler(newVal) {
      //     if (Array.isArray(newVal) && newVal.length > 0) {
      //       this.submitData.recheckUserIds = newVal.join(',')
      //     } else {
      //       this.submitData.recheckUserIds = ''
      //     }
      //   },
      //   immediate: true
      // },
      // 'submitData.isOverdueReimbursement': {
      //   handler(newVal) {
      //     if (newVal === 1 && this.recheckUserList.length > 0) {
      //       // 自动勾选所有加审人
      //       this.$set(this.submitData, 'recheckUserIdList', this.recheckUserList.map(item => item.userId))
      //     }
      //   },
      //   immediate: false
      // },
      'submitData.financeRecheck': {
        handler(newVal) {
          if (newVal) {
            if (this.submitData.suAudit) {
              this.submitData.recheckUserIds = "4260"
            } else {
              this.submitData.recheckUserIds = "3351,4260"
            }
          } else {
            this.submitData.recheckUserIds = ""
          }
        },
        immediate: true
      },
      // 监听提交日期变化
      'submitData.submitDate': {
        handler() {
          this.checkOverdueReimbursement()
          this.checkInvoiceDateWarning()
        },
        immediate: false
      },
      // 监听填报日期变化
      'submitData.fillinDate': {
        handler() {
          this.checkOverdueReimbursement()
          this.checkInvoiceDateWarning()
        },
        immediate: false
      },
      // 监听结束日期变化
      'submitData.endDate': {
        handler() {
          this.checkOverdueReimbursement()
        },
        immediate: false
      },
      // 监听费用明细变化（深度监听）
      'submitData.feeDetails': {
        handler(n, o) {
          // 初始的feeDetails赋值，不执行
          if (n.length && o.filter(i => i.feetId).length === 0 && n.filter(i => i.feetId).length === 0) return
          this.checkOverdueReimbursement()
          this.checkInvoiceDateWarning()
          this.checkAutoRecheck()
        },
        deep: true,
        immediate: false
      },
      // 监听是否替票变化
      'submitData.suAudit': {
        handler(newVal) {
          // 数据加载时不触发自动清空逻辑
          if (this.isLoadingData) {
            return
          }
          if (newVal === 1 && !this.shouldHideFinanceRecheck()) {
            // 勾选财务负责人加审
            this.$set(this.submitData, 'financeRecheck', 1)
            this.submitData.recheckUserIds = "4260"
            // 自动勾选所有加审人
            // if (this.recheckUserList.length > 0) {
            //   this.$set(this.submitData, 'recheckUserIdList', this.recheckUserList.map(item => item.userId))
            // }
          } else {
            this.$set(this.submitData, 'financeRecheck', 0)
            // this.$set(this.submitData, 'recheckUserIdList', [])
          }
        },
        immediate: false
      }
    },
    beforeRouteEnter: (to, from, next) => {
      if (to.params.pageType === "1") {
        document.title = getPageTitle((to.meta.title = "费用新建"));
        next(res => {
        });
      } else if(to.params.pageType === "2") {
        document.title = getPageTitle((to.meta.title = "费用修改"));
        next(res => {
        });
      }else{
        document.title = getPageTitle((to.meta.title = "费用审批"));
        next(res => {
        });
      }
    },
    computed: {
      isShowLitigFeeRecptNo(){
        const isBank = this.submitData.payType && this.submitData.payType.endsWith("银行")
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
      feeNoReq(){
        if (this.submitData.feeDetails.find(item => [166, 163, 72].includes(item.feetId)) && this.submitData.payType === "万慧达转账") {
          return true
        }
        return false
      },
      totalSum() {
        let amountList = this.submitData.feeDetails.map(item => item.amount).filter(item => !!item)
        if (amountList.length == 0) {
          return 0.00
        }
        if (amountList.length == 1) {
          return amountList[0]
        } else {
          return this.submitData.feeDetails.map(item => item.amount).filter(item => !!item).reduce((pre, next) => {
            return Number(pre) + Number(next)
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
    components: {
      TaskRecord, ChooseCase, IdentifyInvoices,BusinessTripDrawer,
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

<style lang='scss' scoped>
  @import "~@/styles/icons/font_3706197_rh1r0jc8pxk.css";
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
    justify-content: center;

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
    flex: 1;
  }

  .TaskRecordWrap {
    margin-top: 20px;
    min-width: 200px;
  }

  .el-cascader {
    width: 100%;
  }

  /deep/ .el-upload-dragger {
    height: 70px
  }

  // .feeDetail {
  //   max-width: 1500px;
  // }
  .title-mx {
    /*float: left;*/
    font-size: 15px;
    color: rgb(64, 158, 255);
    font-weight: 350;
    font-style: normal;
  }
  .invoice-fpbk {
    border: 1px solid red;
    margin: 0 -5px 0 -5px;
    padding: 5px;
  }
  .invoice-fpgl{
    color: #52A0F5;
    cursor:pointer;
  }
  .invoice-fpsc {
    color: red;
    cursor:pointer;
  }
  .invoice-date-warning {
    color: red;
  }
  .popover-content {
    min-width: 300px;
  }
  .del_line{
    text-decoration:line-through red;
  }
  /* 在Chrome浏览器下 */
  /deep/ input::-webkit-outer-spin-button,
  /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  /* 在Firefox浏览器下 */
  /deep/ input[type="number"]{
    -moz-appearance: textfield;
  }
</style>
