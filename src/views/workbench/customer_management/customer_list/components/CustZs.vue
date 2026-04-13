<template>
  <div class="">
    <el-row>
      <el-col :span="24" style='text-align:right'>
        <el-button v-if="type!='view'" type="primary" size="mini" @click="addFormShow()">添加
        </el-button>
        <el-button v-if="postForm.customerRequirements.length>3" type="primary" size="mini" @click="allMessageFormShow()">全部
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :key="changeKey" size="mini" :data="postForm.customerRequirements.filter((item,index)=>index<=2)" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
          <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
          <el-table-column label="客户" align="left" width>
            <template slot-scope="scope">
              <span>{{ scope.row.custName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请人" align="left" width prop="applicantName"  :filters="headWorkFilters['applicantName']" :filter-method="filterHandler">
            <template slot-scope="scope">
              <span>{{ scope.row.applicantName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="指示类型" align="left" width prop="indicateTypeStr"  :filters="headWorkFilters['indicateTypeStr']" :filter-method="filterHandler">
            <template slot-scope="scope">
              <span>{{ scope.row.indicateTypeStr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="案件类型" align="left" width prop="caseTypeStr"  :filters="headWorkFilters['caseTypeStr']" :filter-method="filterHandler">
            <template slot-scope="scope">
              <span>{{ scope.row.caseTypeStr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="案件特殊指示/账单特殊指示" align="left" width="190" prop="specialInfo"  :filters="headWorkFilters['specialInfo']" :filter-method="filterHandler">
            <template slot-scope="scope">
              <span class="ellipsis-2" :title="scope.row.specialInfo">{{ scope.row.specialInfo }}</span>
            </template>
          </el-table-column>
<!--          <el-table-column label="金额" align="left" width>-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.price }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="备注" align="left" width>
            <template slot-scope="scope">
              <span>{{ scope.row.memo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="启用日期" sortable align="left" width  prop="startDate"  :filters="headWorkFilters['startDate']" :filter-method="filterHandler">
            <template slot-scope="scope">
              <span>{{ scope.row.startDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="停用日期" align="left" width prop="endDate"  :filters="headWorkFilters['endDate']" :filter-method="filterHandler">
            <template slot-scope="scope">
              <span>{{ scope.row.endDate }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
            <template slot-scope="scope">

              <el-button  size="mini" type="text" @click="custAddrupdata(scope.row, true)">查看</el-button>
              <el-button v-if="type!='view'" size="mini" type="text" @click="custAddrupdata(scope.row)">修改</el-button>
              <el-button v-if="type!='view'" size="mini" type="text" @click="custAddrdel(scope.row,scope.$index)">删除</el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog :show-close="false"  title="客户指示" :visible.sync="dialogFormzs" width="50%" :modal-append-to-body="false" :modal="false">
      <el-form ref="creatzsForm" :model="zsFromData" label-position="left"  :rules="rules"  style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="指示类型:" prop="indicateType" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' :disabled="disabledZs" placeholder="请选择" @change="regTypeselectChange" v-model="zsFromData.indicateType" filterable>
                      <el-option v-for="item in seletData.reqType" :key="item.indicateType" :label="item.indicateName" :value="item.indicateType">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
                 <el-row >
              <el-col :span="12">
                <el-form-item label="客户:" class="postInfo-container-item">
                  <template>
                    <span>{{postForm.fullname}}</span>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="申请人:" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{zsFromData.applicantName}}</span>
                       <el-select v-else collapse-tags :clearable="true"  default-first-option multiple filterable placeholder="请选择" v-model="zsFromData.appIdArray ">
                             <el-option :key="key" :label="item.applicantName" :value="item.appId" v-for="(item,key) in apps" />
                        </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="12">
                <el-form-item label="案件类型:" prop="caseTypeIdArray" class="postInfo-container-item">
                  <span v-if="dialogLook">{{zsFromData.caseTypeStr}}</span>
                  <el-multi-cascader v-else @change="changeCaseType"  style="" selectChildren :show-all-levels="false" :is-two-dimension-value="true"   multiple filterable  clearable   :options="caseTypeOptions" :props="defaultParams" change-on-select  collapse-tags v-model="zsFromData.caseTypeIdArray">
                    <template slot-scope="{ node, data }">
                      <span>{{ data.label }}</span>
                      <div class="casecBtn" v-if="data.label=='商标'">
                        <el-button @click.stop.prevent="jdbtn">简单</el-button>
                        <el-button>复杂</el-button>
                      </div>
                    </template>
                  </el-multi-cascader>

                </el-form-item>
              </el-col>
              <el-col v-if="isPatent&&zsFromData.indicateType == 4" :span="12">
                <el-form-item label="专利类型:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{String(patentTypeList.filter(i=>zsFromData.patentType.includes(i.id)).map(j=>j.label))}}</span>
                  <el-select multiple v-else v-model='zsFromData.patentType' @change="changeType">
                    <el-option v-for="item in patentTypeList" :label="item.label" :value="item.id" :key="item.label"></el-option>
                  </el-select>

                </el-form-item>
              </el-col>

            </el-row>
            <el-row class="">
              <el-col :span="12">
                <el-form-item label="状态:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{+zsFromData.status===1 ? '启用' : '停用'}}</span>
                  <el-radio-group v-else v-model="zsFromData.status">
                    <el-radio :label='1'>启用</el-radio>
                    <el-radio :label='0'>停用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="递交方式:" prop="submitType" class="postInfo-container-item">

                     <template>
                       <span v-if="dialogLook">{{zsFromData.submitType}}</span>
                                  <el-select v-else :clearable="true"  default-first-option filterable placeholder="请选择"
                                    v-model="zsFromData.submitType">
                                    <el-option label="全部" value="全部" />
                                    <el-option label="网上申请" value="网上申请" />
                                    <el-option label="线下申请" value="线下申请" />
                                  </el-select>
                                </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="启用日期:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{zsFromData.startDate}}</span>
                  <el-date-picker v-else v-model="zsFromData.startDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="停用日期:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{zsFromData.endDate}}</span>
                  <el-date-picker v-else v-model="zsFromData.endDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="zsFromData.indicateType=='4'" class="fullRow">
              <el-col :span="24">
                <el-form-item label="费用:" prop="customerReqQuoteFeeList" class="postInfo-container-item uploader-custfile">
                  <div class="fee-table" style="width: 95%;padding: 10px">
                    <el-button v-if="!dialogLook" size="mini" type="primary" @click="addTableList(zsFromData.customerReqQuoteFeeList, 'customerReqQuoteFeeList' )">添加</el-button>
                    <el-button v-if="!dialogLook" size="mini" type="primary" @click="delTableList(zsFromData.customerReqQuoteFeeList, 'customerReqQuoteFeeList' )">删除</el-button>
                    <el-table
                      ref="customerReqQuoteFeeList"
                      :data="zsFromData.customerReqQuoteFeeList"
                      border
                      style="width: 100%">
                      <el-table-column
                        v-if="!dialogLook"
                        type="selection"
                        width="55">
                      </el-table-column>
                      <el-table-column
                        v-if="isPatent&&zsFromData.indicateType == 4"
                        label="专利类型"
                        >
                        <template slot-scope="scope">
                          <span v-if="dialogLook">{{scope.row.patentType&&patentTypeList.find(i=>i.id == scope.row.patentType).label}}</span>
                          <el-select v-else v-model='scope.row.patentType'>
                            <el-option v-for="item in patentTypeList.filter(i=>zsFromData.patentType.includes(i.id))" :label="item.label" :value="item.id" :key="item.label"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="费用名称"
                        >
                        <template slot-scope="scope">
                          <span v-if="dialogLook">{{scope.row.chargeItemName}}</span>
                          <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="scope.row.chargeItemId" filterable>
                            <el-option v-for="(item,key) in seletData.chargeItemlist.filter(i=>i.patentType == scope.row.patentType)" :key="key" :label="item.nameCn" :value="item.chargeItemId">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="单价">
                        <template slot-scope="scope">
                          <span v-if="dialogLook">{{scope.row.price}}</span>
                          <el-input v-else type="number" placeholder="请输入内容" v-model="scope.row.price"></el-input>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-form-item>
              </el-col>
<!--              <el-col :span="12">-->
<!--                <el-form-item label="费用名:" prop="chargeItemId" class="postInfo-container-item">-->
<!--                  <template>-->
<!--                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="zsFromData.chargeItemId" filterable>-->
<!--                      <el-option v-for="(item,key) in seletData.chargeItemlist" :key="key" :label="item.nameCn" :value="item.chargeItemId">-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </template>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="单价:" class="postInfo-container-item">-->
<!--                  <template>-->
<!--                    <el-input type="number" placeholder="请输入内容" v-model="zsFromData.price">-->
<!--                    </el-input>-->
<!--                  </template>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
            </el-row>
            <el-row class="fullRow" v-if="zsFromData.indicateType=='2'">
              <el-col :span="24">
                <el-form-item label="是否月度账单:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{+zsFromData.billIfmonth ? '是' : '否'}}</span>
                  <el-radio-group v-else v-model="zsFromData.billIfmonth">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="zsFromData.indicateType=='2'">
              <el-col :span="24">
                <el-form-item label="月度账单发送日期:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{zsFromData.billSenddate}}</span>
                  <el-date-picker v-else v-model="zsFromData.billSenddate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="zsFromData.indicateType=='2'">
              <el-col :span="24">
                <el-form-item label="账单发送方式:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{zsFromData.billSendtype}}</span>
                  <el-radio-group v-else v-model="zsFromData.billSendtype">
                    <el-radio label='电子'>电子</el-radio>
                    <el-radio label='邮寄'>邮寄</el-radio>
                    <el-radio label='电子+邮寄'>电子+邮寄</el-radio>
                    <el-radio label='上传'>上传</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="zsFromData.indicateType=='2'">
              <el-col :span="24">
                <el-form-item label="币种:" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{zsFromData.curName}}</span>
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="zsFromData.curId" filterable>
                      <el-option v-for="(item,key) in seletData.curId" :key="key" :label="item.curName" :value="item.curId">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="zsFromData.indicateType=='2'">
              <el-col :span="24">
                <el-form-item label="账单的账户信息:" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{zsFromData.payAcountName}}</span>
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="zsFromData.payAcountId" filterable>
                      <el-option v-for="(item,key) in seletData.payAcount" :key="key" :label="item.payAccountName" :value="item.payAccountId">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="zsFromData.indicateType=='2'">
              <el-col :span="24">
                <el-form-item label="账单特殊指示:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <span v-if="dialogLook">{{zsFromData.specialInfo}}</span>
                    <el-input v-else type="textarea" :rows="2" placeholder="请输入内容" v-model="zsFromData.specialInfo">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="zsFromData.indicateType=='1'">
              <el-col :span="24">
                <el-form-item label="案件特殊指示:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <span v-if="dialogLook">{{zsFromData.specialInfo}}</span>
                    <el-input v-else type="textarea" :rows="2" placeholder="请输入内容" v-model="zsFromData.specialInfo">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow" v-if="zsFromData.indicateType=='3'">
              <el-col :span="24">
                <el-form-item label="折扣率:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <span v-if="dialogLook">{{zsFromData.value}}</span>
                    <el-input v-else type="textarea" :rows="2" placeholder="输入两位整数" v-model="zsFromData.value">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">

                <el-form-item label="上传文件:" class="postInfo-container-item uploader-custfile">
                  <template>

                    <p v-if="dialogLook" v-for="item in postForm.materiaoList" style="color: #409EFF">
                      <a target="_blank" :href="`ipdoc${item.address}`">{{item.name+item.format}}</a>
                    </p>
                    <el-upload v-if="!dialogLook" class="upload-demo"  :on-preview="preview" name="custReqFile" :data='addCustomerRequirementFileData' ref="uploadzsFile" :action="addCustomerRequirementFileUrl" :before-upload="handlePreview"
                       :file-list="postForm.materiaoList"  :on-remove="handleRemove">
                      <el-button v-if="zsfileUploadbool" slot="trigger" size="small" type="primary">选取文件
                      </el-button>
                    </el-upload>

                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <span v-if="dialogLook">{{zsFromData.memo}}</span>
                    <el-input v-else type="textarea" :rows="2" placeholder="请输入内容" v-model="zsFromData.memo">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delzsdialog">
          取消
        </el-button>
        <el-button v-if="!dialogLook" type="primary" @click="createCustAddr()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog  title="全部" :visible.sync="alldialogVisible" width="50%" :modal-append-to-body="false" close-on-click-modal :modal="false">

      <el-table :key="changeKey1" size="mini" :data="alltableData" height="500" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
        <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
        <el-table-column label="客户" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.custName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请人" align="left" width prop="applicantName"  :filters="headWorkFilters1['applicantName']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span>{{ scope.row.applicantName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="指示类型" align="left" width prop="indicateTypeStr"  :filters="headWorkFilters1['indicateTypeStr']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span>{{ scope.row.indicateTypeStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="案件类型" align="left" width prop="caseTypeStr"  :filters="headWorkFilters1['caseTypeStr']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span>{{ scope.row.caseTypeStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="案件特殊指示/账单特殊指示" align="left" width="190" prop="specialInfo"  :filters="headWorkFilters1['specialInfo']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span class="ellipsis-2" :title="scope.row.specialInfo">{{ scope.row.specialInfo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.memo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用日期" align="left" sortable width prop="startDate"  :filters="headWorkFilters1['startDate']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span>{{ scope.row.startDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="停用日期" align="left" width prop="endDate"  :filters="headWorkFilters1['endDate']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span>{{ scope.row.endDate }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">

            <el-button size="mini" type="text" @click="custAddrupdata(scope.row,true)">查看</el-button>
            <el-button v-if="type!='view'" size="mini" type="text" @click="custAddrupdata(scope.row)">修改</el-button>
            <el-button v-if="type!='view'" size="mini" type="text" @click="custAddrdel(scope.row,scope.$index)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="alldialogVisible = false">关闭</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addCustomer,
  querycustSelectClass,
  queryFiliale,
  queryCustomerNameId,
  queryUserByPermissionId,
  queryCountry,
  addCustomerAddrUrl,
  updateCustomerAddrUrl,
  delCustomerAddrUrl,
  queryCustomerContactCustIdUrl,
  addCustomerContactUrl,
  updateCustomerContacturl,
  delCustomerContacturl,
  queryCustomersUrl,
  queryUserNamesUrl,
  addActivityUrl,
  delActivity,
  updateActivityUrl,
  queryCaseTypeUrl,
  querywfUserNameUrl,
  allocationCustomerUrl,
  delAgencyContactUrl,
  updateAgencyContactUrl,
  queryCustomerReqTypeUrl,
  queryregCaseTypeUrl,
  addCustomerRequirementUrl,
  updateCustomerRequirementUrl,
  delCustomerRequirementUrl,
  queryActivityListflUrl,
  queryIndustryUrl,
  queryCustomerUrl,
  updateCustomerUrl,
  queryCurrencyUrl,
  queryPayAcountUrl,
  queryCustomerAddrUrl,
  queryCustomerContactUrl,
  queryActivityOneUrl,
  queryAgencyContactUrl,
  queryCustomerRequirementUrl,
  addCustomerContactAgencyUrl,
  queryCustomerContactAgencyUrl,
  updateCustomerContactAgencyUrl,
  delCustomerContactAgencyUrl,
  CustomerExamineUrl,
  queryCaseType,
  queryCustomerAddrListUrl,
  queryChargeItemUrl,
  queryCustomerRequirementBycustIdUrl,
  queryActivityListUrl,
  queryAppInfoUrl,
  delCustomerReqDoc
} from "@/api/customerList";
import serviceApi from "@/api/serviceApi.config.js";
import { getTwoDimensionalArray } from "@/utils/index.js";
export default {
  name: "CustZs",
  components: {},
  props: {
    type:{

    },
    postForm: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    var caseTypeIdArray=(rule, value, callback) => {
      if (this.zsFromData.caseTypeIdArray && JSON.stringify(this.zsFromData.caseTypeIdArray) != '[]') {
        callback();
      } else {
        callback(new Error("请选择案件类型"));
      }
    }

    return {
      changeKey: true,
      changeKey1: true,
      headWorkFilters:{
        applicantName: '',
        indicateTypeStr: '',
        caseTypeStr: ''
      },
      headWorkFilters1:{},
      dialogLook: false,
      patentTypeList: [{label: '发明', id: 1296},{label: '实用新型', id: 1297},{label: '外观', id: 1298}],
      isPatent: false,
      rules:{
        indicateType:[
          { required: true, message: "请选择指示类型", trigger: "change" }
        ],
        // submitType: [
        //   { required: true, message: "请选择递交方式", trigger: "change" }
        // ],
        customerReqQuoteFeeList: [
          { required: true, message: "请添加费用", trigger: "change" }
        ],
        caseTypeIdArray: [
          { required: true, validator: caseTypeIdArray,
            trigger: "blur"}
        ],
      },
      apps:[],
      alldialogVisible: false,
      addCustomerRequirementFileUrl: serviceApi.addCustomerRequirementFileUrl,
      addCustomerRequirementFileData: {
        tokenID: this.$store.getters.token,
        custId: "",
        id: "",
        indicateType: "",
        fileNames: ""
      },
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      zsfileUploadbool: false,
      defaultParams: {
        // 級聯菜單默認
        value: "caseTypeId",
        label: "caseType",
        children: "childrens",
        checkStrictly: true,
        multiple: true,
        disabled: false
      },
      dialogFormzs: false,
      zsFromData: {
        custId: "",
        indicateType: "",
        examineStatus: "1623",
        caseTypeIdArray: [],
        caseTypeIds: [],
        specialInfo: "",
        price: "",

        chargeItemId: "",

        startDate:this.$commonUtils.formatDate(new Date()),
        endDate: "",
        status: 1,
        submitType:'',
        memo: "",

        billIfmonth: "",

        billSenddate: "",

        billSendtype: "",

        curId: "",

        value: "",

        payAcountId: "",

        appId: "",
        ID: "",
        id: ""
      },
      seletData: {
        reqType: [],
        chargeItemlist: [],
        curId: [],
        payAcount: []
      },
      alltableData: [],
      disabledZs: false,
      dialogFormStatus: "",
      caseTypeOptions: [] // 案件类型集合
    };
  },
  watch: {
    'postForm.customerRequirements':{
      handler(n){
        this.headWorkFilters = this.$commonUtils.tableFilter(n.filter((item,index)=>index<=2) || [])
        this.changeKey = !this.changeKey
      },
      deep: true,
      immediate: true
    },
    alltableData:{
      handler(n){
        this.headWorkFilters1 = this.$commonUtils.tableFilter(n || [])
        // if (this.headWorkFilters1.startDate && this.headWorkFilters1.startDate.length) {
        //   this.headWorkFilters1.startDate = this.headWorkFilters1.startDate.sort((a, b) => a.value.localeCompare(b.value))
        // }
        this.changeKey1 = !this.changeKey1
      },
      deep: true,
      immediate: true
    },
    "zsFromData.caseTypeIdArray"(n){
      this.isPatent = false
      if(!n){
        this.$set(this.zsFromData, 'caseTypeIdArray', [])
        // this.zsFromData.caseTypeIdArray=[];
      }else{
        let langList = []
        n.length&&n.forEach(item=>{
          langList = langList.concat([...item])
        });
        [...new Set(langList)].forEach(i=>{
          if(this.$store.getters.patentCaseTypeIdList.includes(i)){
            this.isPatent = true
          }
        })
      }

    },
    dialogFormzs(n){
      if(n){
         queryAppInfoUrl({ custId: this.postForm.custId }).then(res=>{
           this.apps=res.data
         })
      }else{
        this.dialogLook = false
      }
    }
  },
  computed: {},
  methods: {
    sortTableByKey(list, key, sort = 'desc') {
      list.forEach(item => !item[key] && (item[key] = ''))
      list = list.sort((a, b) => b[key].localeCompare(a[key]))
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    addTableList(list, f) {
      if (list) {
        list.push({})
      } else {
        this.$set(this.zsFromData, f, [{}])
      }
    },
    delTableList(list, f) {
      if (!list.length) {
        this.$message.error('无数据')
        return
      }
      if (!this.$refs[f].selection.length) {
        this.$message.error('请选择数据')
        return
      }
      this.$refs[f].selection.forEach(item => {
        let idx = list.findIndex(i => i == item);
        list.splice(idx, 1)
      })
    },
    queryChargeItemUrl(caseTypeIdList='', patentType=''){
      let data = {}
      patentType&&(data.patentTypeList = patentType.split(','));
      caseTypeIdList&&(data.caseTypeIdList = caseTypeIdList);
      queryChargeItemUrl(data).then(response => {
        this.seletData.chargeItemlist = response.data;
      });
    },
    handleFirstCaseTypeIdList(typeIdList){
      if(!typeIdList)return ;
      const firstCaseTypeIdLIst = [1,2,3,4,75,76,86];
      let langList = []
        typeIdList.length&&typeIdList.forEach(item=>{
          langList = langList.concat([...item])
        });
      if([...new Set(langList)].includes(4)){
        return [...new Set(langList)].filter(i=>firstCaseTypeIdLIst.includes(i));
      }
        return [...new Set(langList)];
    },
    changeCaseType(typeIdList){
      if(!typeIdList.length){
        this.zsFromData.patentType = []
        return;
      };

      let caseTypeIdList = this.handleFirstCaseTypeIdList(typeIdList);
      const patentType = this.zsFromData.patentType&&this.zsFromData.patentType.length&&this.patentTypeList.filter(i=> this.zsFromData.patentType.includes(i.id)).map(i=>i.label).join(',') || ''
      this.queryChargeItemUrl(caseTypeIdList, patentType)

    },
    changeType(patentTypeIdList){
      // this.zsFromData.caseTypeIdArray
      // zsFromData.patentTypeList
      if(!patentTypeIdList || patentTypeIdList&&!patentTypeIdList.length)return;
      const patentType = this.patentTypeList.filter(i=> patentTypeIdList.includes(i.id)).map(i=>i.label).join(',') || ''
      this.queryChargeItemUrl(this.handleFirstCaseTypeIdList(this.zsFromData.caseTypeIdArray), patentType)
    },
    preview(file){
      if(file.raw){
        if(file.response){
          this.$commonUtils.downLoadAll({url:'ipdoc'+file.response.data.address})
        }
      } else {
        this.$commonUtils.downLoadAll(file)
      }
    },
    handleRemove(file, fileList, caseId) {
      let delmaterialId;
      if (file.response) {
        delmaterialId = file.response.data[0].materialId;
      } else {
        delmaterialId = file.materialId;
      }
      delCustomerReqDoc({ materialId: delmaterialId ,custReqType:this.zsFromData.indicateType, custReqId:this.zsFromData.id}).then(res => {
      })
    },
    addFormShow() {
      if (this.isItemTrue("custId")) {
        this.dialogFormzs = true;
        this.disabledZs = false;
        this.resetFromData();
        this.postForm.materiaoList = [];
        this.dialogFormStatus = "create";
      }
    },
    resetFromData() {
      this.$set(this, 'zsFromData', {
        patentType: [],
        custId: "",

        indicateType: "",
        caseTypeIdArray: [],
        examineStatus: "1623",

        caseTypeIds: [],

        specialInfo: "",

        price: "",

        chargeItemId: "",

        startDate: "",

        endDate: "",

        status: "",

        memo: "",

        billIfmonth: "",

        billSenddate: "",

        billSendtype: "",

        curId: "",

        value: "",

        payAcountId: "",

        appId: "",
        appIdArray: [],

        id: ""
      })
      // this.zsFromData = {
      //   patentType: [],
      //   custId: "",
      //
      //   indicateType: "",
      //   caseTypeIdArray: [],
      //   examineStatus: "1623",
      //
      //   caseTypeIds: [],
      //
      //   specialInfo: "",
      //
      //   price: "",
      //
      //   chargeItemId: "",
      //
      //   startDate: "",
      //
      //   endDate: "",
      //
      //   status: "",
      //
      //   memo: "",
      //
      //   billIfmonth: "",
      //
      //   billSenddate: "",
      //
      //   billSendtype: "",
      //
      //   curId: "",
      //
      //   value: "",
      //
      //   payAcountId: "",
      //
      //   appId: "",
      //
      //   id: ""
      // };
    },
    allMessageFormShow() {
      this.alldialogVisible = true;
      queryCustomerRequirementBycustIdUrl({
        custId: this.postForm.custId
      }).then(res => {
        this.alltableData = res.data;
        this.sortTableByKey(this.alltableData, 'startDate', 'desc')
      });
    },
    custAddrupdata(row, isView) {
      isView && (this.dialogLook = true)
      queryCustomerRequirementUrl({
        indicateType: row.indicateType,
        id: row.id
      }).then(res => {
        this.zsFromData = res.data;
        this.zsFromData.patentTypeName&&(
          this.zsFromData.patentType = this.zsFromData.patentTypeName.split(',').map(i=>+i)
          // this.$set(this.zsFromData, 'patentType', this.zsFromData.patentTypeName.split(','))
        )
        this.zsfileUploadbool = true;
        this.postForm.materiaoList=res.data.materialList
        this.postForm.materiaoList.forEach(item=>item.url='ipdoc'+item.url)
        if (this.zsFromData.caseTypeIdList) {
          this.zsFromData.caseTypeIdArray = getTwoDimensionalArray(
            this.caseTypeOptions,
            "caseTypeId",
            this.zsFromData.caseTypeIdList
          );
        }else {
          this.$set(this.zsFromData, 'caseTypeIdArray', [])
          // this.zsFromData.caseTypeIdArray=[]
        }
        this.zsFromData.oldIndicateType = this.zsFromData.indicateType;
        this.disabledZs = true;
        this.dialogFormzs = true;
        this.isPatent = false
        this.zsFromData.caseTypeIdList&&this.zsFromData.caseTypeIdList.length&&this.zsFromData.caseTypeIdList.forEach(i=>{
          if(this.$store.getters.patentCaseTypeIdList.includes(i)){
            this.isPatent = true
          }
        })
        const caseTypeIdList = this.isPatent ? [4] : this.zsFromData.caseTypeIdList
        const patentType = this.zsFromData.patentType&&this.zsFromData.patentType.length&&this.patentTypeList.filter(i=> this.zsFromData.patentType.includes(i.id)).map(i=>i.label).join(',') || ''
        this.queryChargeItemUrl(caseTypeIdList, patentType)
      });
      this.dialogFormStatus = "update";
    },
    custAddrdel(row, index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delCustomerRequirementUrl({
            id: row.id,
            indicateType: row.indicateType
          }).then(response => {
            this.$message.success(response.message);
            queryCustomerRequirementBycustIdUrl({
              custId: this.postForm.custId,
              pageNo: 1,
              pageSize: 3
            }).then(res => {
              this.postForm.customerRequirements = res.data;
              this.sortTableByKey(this.postForm.customerRequirements, 'startDate', 'desc')
              this.dialogFormzs = false;

              // const index1 = this.alltableData.indexOf(row);
              this.alltableData.splice(index, 1);
              queryCustomerRequirementBycustIdUrl({
                custId: this.postForm.custId
              }).then(res => {
                this.postForm.customerRequirements = res.data;
                this.sortTableByKey(this.postForm.customerRequirements, 'startDate', 'desc')
              });

              this.$message({
                type: "success",
                message: "删除成功"
              });
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    createCustAddr(type) {
  this.$refs["creatzsForm"].validate(valid => {
    if(valid){
  if (this.zsFromData.id) {
        const tempData = Object.assign({}, this.zsFromData);
        tempData.custId = this.postForm.custId;
        tempData.id = this.zsFromData.id;
        delete tempData.materialList
        tempData.patentType&&tempData.patentType.length&&(tempData.patentTypeName = String(tempData.patentType))
        delete tempData.patentType
        updateCustomerRequirementUrl(tempData).then(response => {
          if (response.success) {
            this.$message({
              type:'success',
              dangerouslyUseHTMLString: true,
              message:response.message
            })
            queryCustomerRequirementBycustIdUrl({
              custId: this.postForm.custId
            }).then(res => {
              this.postForm.customerRequirements = res.data;
              this.sortTableByKey(this.postForm.customerRequirements, 'startDate', 'desc')

              this.alltableData = res.data;
              this.sortTableByKey(this.alltableData, 'startDate', 'desc')

              this.dialogFormzs = false;
            });
          } else {
            this.$message.error(response.message);
          }
        });
      } else {
        this.$message.error("请重新选择指示类型");
      }
    }else{
      this.$message.error("请填写必填项");
    }
  })


    },
    delzsdialog() {
      if (this.dialogFormStatus == "update" || !this.zsFromData.id) {
        this.dialogFormzs = false;
      } else {
        delCustomerRequirementUrl({
          id: this.zsFromData.id,
          indicateType: this.zsFromData.indicateType
        }).then(response => {
          if (response.success) {
            queryCustomerRequirementBycustIdUrl({
              custId: this.postForm.custId
            }).then(res => {
              this.postForm.materiaoList=res.data.materialList
              this.postForm.customerRequirements = res.data;
              this.sortTableByKey(this.postForm.customerRequirements, 'startDate', 'desc')
              this.dialogFormzs = false;
            });
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    regTypeselectChange(id) {
      if (id == "2") {

      }

      if (id == "4") {

      }

      if (this.zsFromData.id == "") {
        this.zsFromData.custId = this.postForm.custId;
        if(!this.zsFromData.indicateType){
          return
        }
        addCustomerRequirementUrl(this.zsFromData).then(response => {
          if (response.success) {
            this.zsFromData.id = response.data.id;
            this.zsFromData.oldIndicateType = this.zsFromData.indicateType;
            this.zsfileUploadbool = true;
            this.postForm.customerRequirements.unshift(response.data);
          } else {
            this.$message.error(response.message);
          }
        });
      }

      queryregCaseTypeUrl({
        indicateType: id,
        custId: this.postForm.custId
      }).then(response => {
        if (response.success) {
          this.seletData.caseTypezs = response.data;
        }
      });
    },
    handlePreview(file) {
      // this.addCustomerRequirementFileData.tokenID = this.token;
      this.addCustomerRequirementFileData.custId = this.postForm.custId;
      this.addCustomerRequirementFileData.id = this.zsFromData.id;
      this.addCustomerRequirementFileData.indicateType = this.zsFromData.indicateType;
      this.addCustomerRequirementFileData.fileNames = file.name.substr(
        0,
        file.name.lastIndexOf(".")
      );
    },
    isItemTrue(item) {
      if (!this.postForm[item]) {
        this.$message.error("请填写必填项");
        return false;
      } else {
        return true;
      }
    },
  },
  created() {

  },
  mounted() {
    this.queryChargeItemUrl();
    queryCaseType().then(res => {
      this.caseTypeOptions = res.data; // this.getTreeData()
    });
    queryCustomerReqTypeUrl().then(response => {
      if (response.success) {
        this.seletData.reqType = response.data;
      } else {
        this.$message.error(response.message);
      }
    });

            queryCurrencyUrl().then(res => {
          this.seletData.curId = res.data;
        });
        queryPayAcountUrl().then(res => {
          this.seletData.payAcount = res.data;
        });
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.el-table /deep/ th {
  background-color: #f2f2f2;
  color: #333333;
  height: 30px;
  line-height: 30px;
  padding: 0px !important;
}
.table-dl-row {
  /deep/ thead,
  /deep/ th,
  /deep/ .el-table__header-wrapper,
  /deep/ .el-table__header,
  /deep/ tr,
  /deep/ td,
  /deep/ .el-select,
  /deep/ .el-input,
  /deep/ .el-input__inner {
    height: 30px;
    line-height: 30px;
    padding: 0px !important;
  }
  /deep/ td {
    background-color: #ffffff !important;
  }
}

.form-border {
  /deep/ .el-row {
    margin: 0px;
  }
  /deep/ .postInfo-container-item {
    width: 100%;
  }
  /deep/ .el-form-item__label {
    background-color: #f9f9f9;
    width: 30%;
    text-align: center;
  }

  /deep/ .el-form-item {
    border-right: 1px solid #d7d7d7;
    margin: 0px !important;
  }
  /deep/ .el-row {
    border-bottom: 1px solid #d7d7d7;
  }
  /deep/ .el-input,
  /deep/ .el-select {
    width: 70%;
  }
  /deep/ .el-form-item__content {
    text-align: center;
    height: 30px;
  }
  .fullRow {
    /deep/ .el-form-item__label {
      width: 15%;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 85%;
    }
  }
  /deep/ .el-input__inner {
    border: none;
  }
  /deep/ .el-select .el-input {
    width: 100%;
  }
  border-top: 1px solid #d7d7d7;
  border-left: 1px solid #d7d7d7;
  // border-bottom: 1px solid #d7d7d7;
}

.titleLeft {
  margin-right: 20px;
}
.createPost-container {
  position: relative;

  background-color: #e8ebed;
  /deep/ .form-con {
    background-color: #ffffff;

    /deep/ .form-con-item {
      @include clearfix;
      padding: 5px 20px;
      /deep/ .el-col {
      }
    }
  }
  /deep/ .createPost-main-container {
    padding: 0px;
    border: 1px solid #ccc;
    /deep/ .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
    }
  }

  /deep/ .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.uploader-custfile {
  display: flex;
  width: 100%;
  /deep/ .el-form-item__content {
    text-align: left;
    display: inline-table;
    width: 85%;
  }

  /deep/ .el-form-item__label {
  }
}
.tilteSpan {
  font-size: 18px;
  padding: 15px 0px;
  color: #7199d5;
}
.article-textarea /deep/ {
  /deep/ textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

.avatar-uploader {
  /deep/ .el-form-item__label {
    height: 154px;
    line-height: 154px;
    width: 30%;
  }
  height: 154px;

  /deep/ .el-upload {
    border: 1px dashed #b6b2b2;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-top: 4px;
  }
}
.avatar-uploader {
  /deep/ .el-upload:hover {
    border-color: #409eff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 145px;
  height: 145px;
  line-height: 145px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
.el-step {
  cursor: pointer;
}
.tilteBtn {
  text-align: right;
  padding: 10px 10px;
  background-color: #d0d0d0;
}
/deep/.postInfoleft /deep/.el-form-item__content {
  text-align: left;
}
/deep/ .el-form-item__error {
  display: none !important;
}
/deep/ .jdbtn {
  position: absolute;
  bottom: 0px;
}
.casecBtn {
  position: absolute;
  left: 0px;
  bottom: -147px;
}

/deep/ .el-popper,
.multi-el-cascader-menu {
  z-index: 8000 !important;
}
  >>>.postInfo-container-item{
    .fee-table{
      .cell{
        text-align: center;
      }
    }
  }
</style>

