<template>
  <el-dialog
    :title="getTitle"
    append-to-body
    :visible.sync="createInvoiceState"
    :width="pageState !== 'create' ? '90%' : '70%'"
    height="80%"
    top="0"
    :before-close="handleClose"
    :close-on-click-modal="false"
    center
    v-dialogDrag
  >
    <template v-if="pageState!='view'">
      <div style="display: inline-flex">
        <div :style="pageState !== 'create' ? 'width:80%' : 'width:100%'">
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
                <virtual-select clearable :isUser="true" :data="$store.getters.userList" v-model="submitData.receiverUserId" @change="getUserEmail()" filterable :render="(data)=>$commonUtils.UserRender(data)" />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="发票送达邮箱:" >
                <el-input v-model="submitData.receiverMail" placeholder="请输入内容" clearable></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="账单发票:" prop="receiptType">
                <el-radio-group v-model="submitData.receiptType" @change="changeReceiptType">
                  <el-radio :label="1">无账单发票</el-radio>
                  <el-radio :label="0">有账单发票</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="submitData.receiptType === 0" label="发票项目类型:" prop="recItemTypeArray">
                <el-select v-model="submitData.recItemTypeArray" placeholder="请选择"   filterable multiple size="small"
                           clearable @change="changeRecItemType">
                  <el-option
                    v-for="item in [{label: '官费', value: 1}, {label: '服务费', value: 2}, {label: '杂费', value: 3},]"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row v-if="submitData.receiptType!=1&&billIdList">
              <el-form-item label="账单号:" >
                {{submitData.billNos}}
              </el-form-item>
              <el-form-item label="账单总金额:" >
                {{submitData.billTotal}}
              </el-form-item>
            </el-row>

            <el-row v-if="submitData.receiptType!=1&&!billIdList">
              <el-form-item label="账单号:" >
                <el-input v-model="submitData.billNos" placeholder="请输入账单号，多个用;隔开" clearable @change="billNosChange"></el-input>
              </el-form-item>
              <el-form-item label="账单总金额:" >
                {{submitData.billTotal}}
              </el-form-item>
            </el-row>
            <el-row v-if="submitData.receiptType === 0">
              <el-form-item label="账单列表:" >
                <el-table
                  :summary-method="getSummaries"
                  show-summary
                  class="el-table1"
                  border
                  :data="submitData.receiptBillWkgList">
                  <el-table-column  label="账单号" align="left" prop="billNos">
                    <template slot-scope="scope">
                      {{scope.row.billNos}}
                    </template>
                  </el-table-column>
                  <el-table-column  label="工作组" align="left" prop="groupName">
                    <template slot-scope="scope">
                      {{scope.row.groupName}}
                    </template>
                  </el-table-column>
                  <el-table-column  label="发票金额" align="left" prop="receiptAmount">
                    <template slot-scope="scope">
<!--                      {{scope.row.receiptAmount|formatAmount}}-->
                      <el-input size="small" v-model="scope.row.receiptAmount"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-row>
            <el-row v-if="submitData.receiptType==1">
              <el-form-item label="无账单发票收款状态:">
                <el-select v-model="submitData.noBillPayStatus" placeholder="请选择"   filterable
                           clearable>
                  <el-option
                    v-for="item in noBillPayList"
                    :key="item.typeName"
                    :label="item.typeName"
                    :value="item.typeName">
                  </el-option>
                </el-select>
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
<!--                <el-input v-model="submitData.showRefno" placeholder="请输入内容" clearable></el-input>-->
                <template>
                  <span class="title-mx" style="cursor: pointer" @click="takeCaseDetail(submitData)">{{submitData.showRefno}}</span>
                  <el-button v-if="submitData.receiptType" style="margin-left: 10px" size="mini" type="primary" @click="changeCaseVisible=true">修改
                  </el-button>
                </template>
                <ChooseCase
                  :dialogVisible="changeCaseVisible"
                  :agentNums="submitData.caseArray&&submitData.caseArray.map(item=>item.agentNum).join('\n')"
                  @closed="ChooseCaseClose"
                  rules="custId"
                  @getList="getList"></ChooseCase>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="发票抬头:" prop="receiptTitle">
                <Autocomplete v-model="submitData.receiptTitle" type="accName" :list="bankaccountList" class="mr-10"> </Autocomplete>
                <i class="el-icon-tickets copy-icon" @click="copyInfo(submitData.receiptTitle)"></i>
      <!--            <el-autocomplete class="inline-input" :clearable='true' v-model="submitData.receiptTitle" :fetch-suggestions="remotepinput" placeholder="请输入内容" :trigger-on-focus="true">-->
      <!--            </el-autocomplete>-->
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="税号:">
                <el-input v-model.trim="submitData.taxNo" placeholder="请输入内容" @change="changeTaxNo()" clearable class="mr-10"></el-input>
                <i class="el-icon-tickets copy-icon" @click="copyInfo(submitData.taxNo)"></i>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="开户行及账号:">
                <el-input v-model="submitData.bankName" placeholder="请输入开户行" clearable class="mr-15" title="请输入开户行"></el-input>
                <el-input v-model="submitData.account" placeholder="请输入账号" clearable class="mr-10" title="请输入账号"></el-input>
                <i class="el-icon-tickets copy-icon" @click="copyInfo((submitData.bankName || '')+' '+(submitData.account || ''))"></i>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="地址和电话:">
                <el-input v-model="submitData.addr" placeholder="请输入地址" clearable class="mr-15" title="请输入地址"></el-input>
                <el-input v-model="submitData.tel" placeholder="请输入电话" clearable class="mr-10" title="请输入电话"></el-input>
                <i class="el-icon-tickets copy-icon" @click="copyInfo((submitData.addr || '')+' '+(submitData.tel || ''))"></i>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="国税发票:" prop="stateTaxReceipt">
                <el-select v-model="submitData.stateTaxReceipt" placeholder="请选择"   filterable
                           clearable>
                  <el-option
                    v-for="item in invoiceTypeList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属公司:"  prop="companyId" >
                <el-select v-model="submitData.companyId" placeholder="请选择" filterable
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
                      :fetch-suggestions="fetchSuggestion"
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
                    <el-input v-model="scope.row.unitPrice" placeholder="请输入内容" clearable @input="(val) => scope.row.unitPrice = val.replace(/[^\d.-]/g,'')" @change="(val) => {
                      // 处理多个负号和小数点的情况
                      let value = val;
                      // 确保只有一个负号且在开头
                      if(value.split('-').length > 2) {
                        value = (value.charAt(0) === '-' ? '-' : '') + value.replace(/-/g, '');
                      }
                      // 确保只有一个小数点
                      if(value.split('.').length > 2) {
                        value = value.substring(0, value.lastIndexOf('.'));
                      }
                      scope.row.unitPrice = parseFloat(value) || 0;
                    }"></el-input>
                  </template>
                </el-table-column>
                <el-table-column  label="数量" align="left">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.number" placeholder="请输入内容" @input="(val) => scope.row.number = parseInt(val) || 0" clearable></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="left">
                  <template slot="header"><span style="color:#F56C6C;margin-right:4px;">*</span>单位</template>
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
                    {{scope.row.amount=(scope.row.number*scope.row.unitPrice)||0}}
      <!--                <el-input :value="scope.row.amount=scope.row.number*scope.row.unitPrice" placeholder="请输入内容" clearable></el-input>-->
                  </template>
                </el-table-column>
                <el-table-column  label="操作" align="left">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="submitData.details.splice(scope.$index,1)">删除</el-button>
                    <i class="el-icon-tickets copy-icon" @click="copyInfo(scope.row.item)"></i>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-row>
              <el-form-item label="发票金额:" prop="receiptTotal">
                {{submitData.receiptTotal || 0}}
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
              <el-form-item label="税率:" prop="taxRate">
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
      <!--            <virtual-select clearable :isUser="true" :data="$store.getters.userList" v-model="submitData.optId"  filterable :render="(data)=>$commonUtils.UserRender(data)" />-->

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
<!--            <el-row>-->
<!--              <el-form-item label="审核日期:">-->
<!--                <el-date-picker-->
<!--                  v-model="submitData.auditDate"-->
<!--                  type="date"-->
<!--                  placeholder="选择日期"-->
<!--                  value-format="yyyy-MM-dd">-->
<!--                </el-date-picker>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="开票日期:">-->
<!--                <el-date-picker-->
<!--                  v-model="submitData.optDate"-->
<!--                  type="date"-->
<!--                  placeholder="选择日期"-->
<!--                  value-format="yyyy-MM-dd">-->
<!--                </el-date-picker>-->
<!--              </el-form-item>-->
<!--            </el-row>-->
            <el-row>
              <el-form-item label="发票票面备注:">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="submitData.receiptRemarks"
                  class="mr-15"
                >
                </el-input>
                <i class="el-icon-tickets copy-icon" @click="copyInfo(submitData.receiptRemarks)"></i>
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
            <el-button type="primary" @click="saveReceipt('保存')">保存</el-button>
            <template v-if="isAudit">
              <el-button class="exactButton" type="primary" @click="saveReceipt('通过')">通过</el-button>
              <el-button class="exactButton" type="primary" @click="saveReceipt('退回')">退回</el-button>
            </template>
            <el-button type="primary" @click="saveReceipt('提交')" v-if="this.pageState=='create'||submitData.taskNo==1">提交</el-button>
           <el-button  @click="$emit('close')">取消</el-button>
          </span>
        </div>
        <div class="TaskRecordWrap" v-if="pageState !== 'create'" style="margin: 10px">
          <TaskRecord :id="receiptId" :type-id="typeId"></TaskRecord>
        </div>
      </div>
    </template>
    <template v-if="pageState=='view'">
      <div style="display: inline-flex">
        <div class="div-form">
          <el-form  ref="submission"  label-width="156px" >
          <el-row>
            <el-form-item label="申请日期:" >
             {{submitData.appDate}}
            </el-form-item>
            <el-form-item label="发票领取人:">
              {{submitData.receiverName}}
    <!--            {{transformation(userList,submitData.receiverUserId,'userId','fullname')}}-->
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
            <el-form-item v-if="submitData.receiptType === 0" label="发票项目类型:" prop="recItemTypeArray">
              <el-select disabled v-model="submitData.recItemTypeArray" placeholder="请选择"   filterable multiple size="small"
                         clearable @change="changeRecItemType">
                <el-option
                  v-for="item in [{label: '官费', value: 1}, {label: '服务费', value: 2}, {label: '杂费', value: 3},]"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row v-if="submitData.receiptType!=1">
            <el-form-item label="账单号:" >
              {{submitData.billNos}}
            </el-form-item>
            <el-form-item label="账单总金额:" >
              {{submitData.billTotal|formatAmount}}
            </el-form-item>
          </el-row>
            <el-row v-if="submitData.receiptType === 0">
              <el-form-item label="账单列表:">
                <el-table
                  :summary-method="getSummaries"
                  show-summary
                  class="el-table1"
                  border
                  :data="submitData.receiptBillWkgList">
                  <el-table-column  label="账单号" align="left" prop="billNos">
                    <template slot-scope="scope">
                      {{scope.row.billNos}}
                    </template>
                  </el-table-column>
                  <el-table-column  label="工作组" align="left" prop="groupName">
                    <template slot-scope="scope">
                      {{scope.row.groupName}}
                    </template>
                  </el-table-column>
                  <el-table-column  label="发票金额" align="left" prop="receiptAmount">
                    <template slot-scope="scope">
                      {{scope.row.receiptAmount|formatAmount}}
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-row>
          <el-row v-if="submitData.receiptType==1">
            <el-form-item label="无账单发票收款状态:">
              {{submitData.noBillPayStatus}}
            </el-form-item>
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
              <div>
                <p v-for="item in submitData.materialList" :key="item.address">
                  <a style="color: #409EFF" target="_blank" @click="onPreview(item)" >{{item.name}}</a>
                </p>
              </div>
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
                  {{scope.row.unitPrice|formatAmount}}
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
                  {{scope.row.amount|formatAmount}}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-row>
            <el-form-item label="发票金额:">
              {{submitData.receiptTotal|formatAmount}}
              <!--          <el-input v-model="submitData.receiptTotal" placeholder="请输入内容" clearable></el-input>-->
            </el-form-item>
          </el-row>
          <div style="width: 100%" class="title">财务填写</div>
          <el-row>
            <el-form-item label="国税票金额:">
             {{submitData.stateTaxTotal|formatAmount}}
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
             {{submitData.taxAmount|formatAmount}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="不含税金额:">
              {{submitData.taxExcept|formatAmount}}
            </el-form-item>
            <el-form-item label="价税合计:">
             {{submitData.priceTaxTotal|formatAmount}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="申请开票人:">
              {{submitData.appUserName}}
            </el-form-item>
            <el-form-item label="开票人:">
              {{submitData.optName}}
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
        </div>
        <div class="TaskRecordWrap" style="margin: 10px">
          <TaskRecord :id="receiptId" :type-id="typeId"></TaskRecord>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {queryBillReceipt,queryReceiptIitem,queryReceiptCompany, queryBankaccountListBycustId,saveReceipt,queryCustomerNameId,queryReceiptDetail ,receiptToTask,delCaseMaterial, recordOnlienEdit} from "@/api/caseList"
import {getUser} from "@/api/user"
import {formatAmount,fomatFloat,toFixed1,toFixed2} from '@/utils/filters'
import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
import { creatematerialUrl } from "@/api/serviceApi.config.js";
import { querycustSelectClass } from '@/api/customerList.js'
import TaskRecord from '../../../../finance/components/TaskRecord'
import ChooseCase from '../../../../case/components/ChooseCase'
import { disposeAgentNum } from '../../../../../../api/billApi'
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
    isAudit:{
      type: Boolean,
      default: false
    },
    receiptId:{}
  },
  data(){
    const validateReceiptTotal = (rule, value, cb) => {
      if (this.submitData.receiptTotal) {
        cb()
      } else {
        cb(new Error('请填写发票明细信息'))
      }
    }
    const validateRecItemTypeArray = (rule, value, cb) => {
      if (value && value.length) {
        cb()
      } else {
        cb(new Error('请选择发票项目类型'))
      }
    }
    return {
      changeCaseVisible: false,
      typeId: 20,
      receiverUserList:[],
      userList:[],
      appUserIdUserList:[],
      optIdUserList:[],
      noBillPayList:[],
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
        receiptTotal: [
          {validator: validateReceiptTotal, required: true, trigger: 'change'}
        ],
        recItemTypeArray: [
          {validator: validateRecItemTypeArray, required: true, message: '请选择发票项目类型', trigger: 'change'}
        ],
        taxRate: [
          {required: true, message: '请填写税率', trigger: 'change'}
        ],
        receiverUserId: [
          {required: true, message: '请选择发票领取人', trigger: 'change'},
        ],
        receiptType: [
          {required: true, message: '请选择账单发票类型', trigger: 'change'}
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
      materialIdList:[],
      invoiceTypeList: ['国税专票','国税普票（电子）','国税普票','作废票','全电专票','全电普票'],
      invoiceCustId: null
    }
  },
  created() {
    this.getUser()
    this.queryReceiptIitem()
    this.queryReceiptCompany()
    this.queryClass()
  },
  mounted() {
    if(this.pageState=='create'&&this.billIdList){
      this.$set(this.submitData, 'recItemTypeArray', [1, 2, 3])
      this.queryBillReceipt({ billIdList: this.billIdList.map(item => item.billId),checkReceipt:1, recItemType: '1,2,3' })
      this.getUserEmail()
    }
    if(this.pageState=='create'){
      this.$set(this.submitData, 'taxRate', 6)
    }
    if(this.pageState=='create'&&!this.billIdList){
      this.submitData.appDate=this.submitData.appDate?this.submitData.appDate:this.$commonUtils.formatDate1(new Date())
      this.submitData.receiverUserId=this.$store.getters.userId
      this.submitData.appUserId=this.$store.getters.userId
      this.getUserEmail()
    }
    if(this.pageState=='edit'||this.pageState=='view'){
      this.queryReceiptDetail()
    }
  },
  methods:{
    fetchSuggestion(queryString, cb) {
      const restaurants = this.receiptIitemList;
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    getSummaries(param) {
      const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：'
            return
          }
          const values = data.map(item => {
            if (column.property == 'receiptAmount' && isNaN(Number(item[column.property]))) {
              return Number(item[column.property])
            }
            return Number(item[column.property])
          })
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = toFixed2(sums[index])
            sums[index] = sums[index]
          }
        })
        return sums
    },
    changeReceiptType(n){
      n && this.$set(this.submitData, 'showRefno', '')
    },
    getList(list) {
        if (list.length) {
          this.submitData.caseIds = list.map(item => item.caseId)
          this.submitData.caseArray = list
          disposeAgentNum({agentNumberArray: list.map(item => item.agentNum)}).then(res => {
            this.submitData.showRefno = res.data
            // this.submitData.caseName = list[0].caseName
          })
        } else {
          this.submitData.showRefno = ''
          this.submitData.caseName = ''
          this.submitData.caseIds = null
        }
      },
    ChooseCaseClose(){
      this.changeCaseVisible = false
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
          }
        }
      },
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
        this.submitData.taxNo && this.$set(this.submitData, 'taxNo', this.submitData.taxNo.replace(/\s/g,""))
        // this.selectCompany()
        // this.$set(this.submitData,'details',res.data.details)
        res.data.materialList.forEach( item => {
          this.materialIdList.push(item.materialId)
           if(!item.name){
             item.name=this.$commonUtils.getSuffix(item.address)
           }
        })
        if (this.submitData.recItemType) {
          this.$set(this.submitData, 'recItemTypeArray', this.submitData.recItemType.split(',').map(Number))
        } else {
         this.$set(this.submitData, 'recItemTypeArray', [])
        }
        this.invoiceCustId = this.submitData.custId
        this.submitData.custId && queryCustomerNameId({custIdArray: this.submitData.custId}).then(res=>{
          this.customerNameIdList=res.data
        })
        this.submitData.custId && queryBankaccountListBycustId({custId:this.submitData.custId}).then(res=>{
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
    copyInfo(value){
      if (value) {
        this.$copyText(value).then(
          res => {
            this.$message({
              message: '复制成功',
              type: 'success'
            });
          })
      }
    },
    // 选择所属公司  IPSERVICE-4340
    selectCompany() {
      // defaultInvoiceType: ['国税专票','国税普票（电子）','国税普票','作废票'],
      // newInvoiceType: ['国税专票','国税普票（电子）','国税普票','作废票','全电专票','全电普票'],
      // if (this.submitData.companyId == 5 || this.submitData.companyId == 11 || this.submitData.companyId == 16){
      //   this.invoiceTypeList = this.newInvoiceType
      // } else {
      //   this.invoiceTypeList = this.defaultInvoiceType
      //   if (['全电专票','全电普票'].includes(this.submitData.stateTaxReceipt)) {
      //     this.$set(this.submitData,'stateTaxReceipt','')
      //   }
      // }
    },
    // 税号处理
    changeTaxNo() {
      this.$set(this.submitData, 'taxNo', this.submitData.taxNo.replace(/\s/g,""))
    },
    queryCustomerList(query){
      if(query !== ''){
        queryCustomerNameId({ pageNo: 1, pageSize: 100,keyword:query }).then(res=>{
          this.customerNameIdList=res.data
        })
      }
    },
    // 获取参数字典
    queryClass() {
      querycustSelectClass({ classId: '1094' }).then(res => {
        this.noBillPayList = res.data['1094']
      })
    },
    async saveReceipt(type){
      if (['提交', '保存'].includes(type) && this.submitData.priceTaxTotal > 100000 && ['国税专票', '国税普票（电子）', '国税普票'].includes(this.submitData.stateTaxReceipt)) {
        this.$message.error('单张发票金额不能超10万，请分开提交！')
        return
      }
      if (this.submitData.receiptBillWkgList && this.submitData.receiptBillWkgList.length && this.submitData.receiptType === 0 && ['提交', '保存'].includes(type) && Number(this.submitData.priceTaxTotal.toFixed(2)) != Number(this.submitData.receiptBillWkgList.reduce((p, n) => p + Number(n.receiptAmount), 0).toFixed(2))) {
        this.$message.error('发票价税合计与账单列表中发票金额合计不同，操作失败！')
        return
      }
      if (!this.$commonUtils.formValidate(this.$refs['ruleForm'])) return

      if (this.submitData.details && this.submitData.details.some(item => !item.unit)) {
        this.$message.error('发票明细中单位为必填项，请填写完整！')
        return
      }

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

      if (this.submitData.receiptType==0 && !this.submitData.custId){
        this.$message({
          message: '有账单发票，客户不能为空',
          type: 'warning'
        });
      } else {
        if (await this.checkAccountAndTel()) return
        if (await this.checkCompany()) return
        this.submitData.materialIdList=this.materialIdList
        delete this.submitData.receiptCaseList
        delete this.submitData.receiptBillList
        delete this.submitData.materialList
        delete this.submitData.caseArray
        // saveReceipt(this.$commonUtils.cleanNullAttr(this.submitData)).then(res=>{
        saveReceipt(this.submitData).then(res=>{
          if(type != '保存'){
            this.submitData.taskId = res.data[0].taskId
            this.submitData.receiptId = res.data[0].receiptId
            var checkReceipt = type == '退回' ? 0 : 1
            this.receiptToTask(type,checkReceipt)
          }else{
            this.$emit('close',true)
            this.$message.success(`${type}成功`)
          }
        })
      }
    },
    async checkAccountAndTel(){
      if (!this.submitData.account || !this.submitData.tel) {
        return await this.$confirm('开户行账号或电话未填写，是否继续',
          '提示',
          {
            // distinguishCancelAndClose:true,
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          return 0
        }).catch((err) => {
          return 1
        })
      }
      return 0
    },
    async checkCompany(){
      if ((this.pageState=='create' || this.submitData.taskNo==1) && (this.submitData.companyId == 1 || this.submitData.companyId == 2)) {
        var message = '请确认开票【所属公司】是否正确？'
        return await this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return 0
        }).catch(() => {
          return 1
        });
      }
      return 0
    },
    receiptToTask(type,checkReceipt) {
      var data = { taskIdList: this.submitData.taskId,checkReceipt:checkReceipt }
      if (this.submitData.taskNo == 2 || this.submitData.taskNo == 3) {
        var result = type == '通过' ? 1 : 0
        data = Object.assign(data, { result: result });
      }
      receiptToTask(data).then(res => {
        if (res.messageType == -6) {
          this.repeatReceiptRemind(type, res.message)
        }else{
          this.$emit('close',true)
          this.$message.success(`${type}成功`)
        }
      })
    },
    repeatReceiptRemind(result,message){
      let confirmText = message.split('$$');
      const newDatas = []
      const h = this.$createElement
      for (const i in confirmText) {
        newDatas.push(h('p', null, confirmText[i]))
      }
      newDatas.push(h('p', null, '是否继续 ？'))
      this.$confirm(
        '提示',
        {
          title: '提示',
          message: h('div', { class: 'message-inspect' }, newDatas),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        if (typeof(result) == 'string'){
          this.receiptToTask(result,0)
        }else{
          this.queryBillReceipt(result)
        }
      }).catch(()=>{});
    },
    queryBankaccountListBycustId(custId){
      queryBankaccountListBycustId({custId}).then(res=>{
        res.data.forEach(item=>item.value=item.accName)
        this.bankaccountList=res.data
        if(res.data&&res.data.length){
          var accountInfo = this.bankaccountList.find(item=>item.accName == this.submitData.receiptTitle)
          console.log(accountInfo)
          if (accountInfo) {
            this.invoiceCustId = custId
            !this.submitData.taxNo && this.$set(this.submitData, 'taxNo', accountInfo.taxNo.replace(/\s/g,""))
            !this.submitData.bankName && this.$set(this.submitData, 'bankName', accountInfo.bankName)
            !this.submitData.account && this.$set(this.submitData, 'account', accountInfo.account)
            !this.submitData.addr && this.$set(this.submitData, 'addr', accountInfo.accAddr)
            !this.submitData.tel && this.$set(this.submitData, 'tel', accountInfo.telNo)
          }else{
            // IPSERVICE-4555需求
            var check1 =  (this.submitData.receiptTitle == undefined || this.submitData.receiptTitle == 0) ? true : false
            var check2 =  this.invoiceCustId ? (this.submitData.custId != this.invoiceCustId) : false
            console.log('check',check1, check2)
            if (check1 || check2){
              console.log(this.bankaccountList[0].value)
              this.submitData.receiptTitle=this.bankaccountList[0].value
            }
            this.invoiceCustId = custId
          }
        }
      })
    },
    getUser(){
      this.userList=this.$store.getters.userList
    },
    // 获取发票领取人邮箱
    getUserEmail() {
      if (!this.submitData.receiverMail && this.submitData.receiverUserId){
        var item = this.userList.find(item=>item['userId'] == this.submitData.receiverUserId)
        item && (this.submitData.receiverMail =  item['username'])
      }
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
      this.queryBillReceipt({billNos:this.submitData.billNos,checkReceipt:1, recItemType: this.submitData.recItemType})
    },
    changeRecItemType(value) {
      value && value.length && this.queryBillReceipt({billNos:this.submitData.billNos,checkReceipt:1, recItemType: value.join(',')})
    },
    queryBillReceipt(data,type) {
     // { billIdList: this.billIdList.map(item => item.billId) }
      queryBillReceipt(data).then(res => {
        if (res.messageType == -6) {
          if(this.pageState=='create'&&this.billIdList){
            this.repeatReceiptRemind({ billIdList: this.billIdList.map(item => item.billId),checkReceipt:0, recItemType: this.submitData.recItemType}, res.message)
          }else{
            this.repeatReceiptRemind({billNos:this.submitData.billNos,checkReceipt:0, recItemType: this.submitData.recItemType}, res.message)
          }
        }else {
          if(this.pageState == 'edit'){
            let { billTotal, addrAndTel, bankNameAndAccount, custFullName, custId, showRefno, taxNo, billNos, receiptBillWkgList } = res.data
            this.submitData.billNos = billNos // 账单号
            this.submitData.receiptBillWkgList = receiptBillWkgList // 账单列表
            this.submitData.billTotal = billTotal // 账单金额
            this.submitData.custId = custId // 客户
            this.submitData.showRefno = showRefno // 案件文号
            this.submitData.custFullName = custFullName // 客户名称
            if (!this.submitData.receiptTitle) {
              taxNo && this.$set(this.submitData, 'taxNo', taxNo.replace(/\s/g,""))
              this.submitData.bankNameAndAccount = bankNameAndAccount // 开户行及账号
              this.submitData.addrAndTel = addrAndTel // 地址和电话
            }
          }else{
            this.submitData = res.data
            if (this.submitData.recItemType) {
              this.$set(this.submitData, 'recItemTypeArray', this.submitData.recItemType.split(',').map(Number))
            } else {
             this.$set(this.submitData, 'recItemTypeArray', [])
            }
            this.submitData.receiptType = 0;
            this.submitData.appDate=this.submitData.appDate?this.submitData.appDate:this.$commonUtils.formatDate1(new Date())
            this.submitData.receiverUserId=this.$store.getters.userId
            this.submitData.appUserId=this.$store.getters.userId
            if(!this.submitData.details||this.submitData.details.length==0){
              this.submitData.details=[{unitPrice:0,number:1}]
            }
            this.submitData.taxNo && this.$set(this.submitData, 'taxNo', this.submitData.taxNo.replace(/\s/g,""))
            this.$set(this.submitData, 'taxRate', 6)
          }
          if(data.billNos){
            this.customerNameIdList=[{fullname:this.submitData.custFullName,custId:this.submitData.custId}]
            this.submitData.receiptType=0
          }
          if (!this.submitData.receiptTitle) {
            this.queryBankaccountListBycustId(this.submitData.custId)
          }
        }
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
    'submitData.recItemTypeArray': {
      handler(n) {
        if (n && n.length) {
          this.$set(this.submitData, 'recItemType',  n.join(','))
        } else {
          this.$set(this.submitData, 'recItemType',  '')
        }
      },
      immediate: true
    },
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
            const num =  (Number(this.submitData.taxAmount) + Number(((this.submitData.taxRate*item*0.01)/(1 + this.submitData.taxRate*0.01)).toFixed(2))).toFixed(2)
            this.submitData.taxAmount = isNaN(num) ? 0 : num
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
          obj.taxNo && this.$set(this.submitData, 'taxNo' , obj.taxNo.replace(/\s/g,""))
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
  },
  components: {
    ChooseCase,
    TaskRecord
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
      .mr-10{
        margin-right: 10px;
      }
      .mr-15{
        margin-right: 15px;
      }
      .copy-icon{
        font-size: 20px;
        padding-right: 10px;
        cursor: pointer;
      }
      .copy-icon:hover{
        color: rgb(82, 160, 245);
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
  .el-table1{
    width: auto;
    margin-top: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    /deep/ tr:nth-of-type(1){
      th{
        background: #f5f7fa;
        padding: 0;
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
  .div-form {
    width: 80%;
    display: inline-flex;
  }
  .dialog-footer {
    float: right;
    margin-top: 20px;
  }
  .title-mx {
    /*float: left;*/
    font-size: 15px;
    color: rgb(64, 158, 255);
    font-weight: 350;
    font-style: normal;
  }
  .message-inspect{
    max-height: 290px !important;
    overflow-y: auto;
  }
</style>
