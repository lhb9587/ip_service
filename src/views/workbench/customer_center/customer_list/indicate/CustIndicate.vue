<template>
  <div class="indicate-info">
    <el-button size="mini" type="primary" v-if="editStatus" v-allow="48" @click="addIndicate">新增</el-button>
<!--    <div class="base-header">-->
<!--      <span class="left-line"></span>-->
<!--      <span class="right-text">客户指示</span>-->
<!--    </div>-->
    <div class="header-table">
      <el-table :key="changeKey" :max-height="clientHeight" class="el-table1" size="mini" :data="indicateList" fit
                empty-text="暂无数据"
                highlight-current-row
                current-row-key style="width: 100%;" @row-dblclick="rowDbClick">
        <el-table-column type="index" width="60" label="序号" align="left"></el-table-column>
<!--        <el-table-column label="客户" align="left" width>-->
<!--          <template slot-scope="scope">-->
<!--            <span :title="scope.row.custName">{{ scope.row.custName }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="申请人" align="left" width prop="applicantName" :filters="headWorkFilters['applicantName']"
                         :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.applicantName">{{ scope.row.applicantName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="指示类型" align="left" width prop="indicateTypeStr"
                         :filters="headWorkFilters['indicateTypeStr']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.indicateTypeStr">{{ scope.row.indicateTypeStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="案件类型" align="left" width prop="caseTypeStr" :filters="headWorkFilters['caseTypeStr']"
                         :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.caseTypeStr">{{ scope.row.caseTypeStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="案件特殊指示/账单特殊指示" align="left" width="240" prop="specialInfo"
                         :filters="headWorkFilters['specialInfo']" :filter-method="filterHandler">
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
            <span :title="scope.row.memo">{{ scope.row.memo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用日期" sortable align="left" width="120" prop="startDate"
                         :filters="headWorkFilters['startDate']"
                         :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.startDate">{{ scope.row.startDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="停用日期" align="left" width prop="endDate" :filters="headWorkFilters['endDate']"
                         :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.endDate">{{ scope.row.endDate }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="editStatus" label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">

            <el-button size="mini" type="text" @click="custAddrdel(scope.row,scope.$index)">删除</el-button>
            <el-button size="mini" v-if="!scope.row.topping" type="text" @click="setTop(scope.row,scope.$index)">置顶
            </el-button>
            <el-button size="mini" v-if="scope.row.topping" type="text" @click="cancelTop(scope.row,scope.$index)">
              取消置顶
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog style="position:absolute;left: 0;top: 0;" :fullscreen="false" :show-close="false"
               :close-on-click-modal="false" :modal="false" :title="'客户指示 - ' + title" :visible.sync="dialogFormzs"
               width="70%">
      <el-form ref="creatzsForm" :model="zsFromData" label-position="left" :rules="rules" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="指示类型:" prop="indicateType" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' :disabled="disabledZs" placeholder="请选择"
                               @change="regTypeselectChange" v-model="zsFromData.indicateType" filterable>
                      <el-option v-for="item in seletData.reqType" :key="item.indicateType" :label="item.indicateName"
                                 :value="item.indicateType">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="客户:" class="postInfo-container-item">
                  <template>
                    <span>{{fullname}}</span>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="申请人:" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{zsFromData.applicantName}}</span>
                    <el-select v-else collapse-tags :clearable="true" default-first-option multiple filterable
                               placeholder="请选择" v-model="zsFromData.appIdArray ">
                      <el-option :key="key" :label="item.applicantName" :value="item.appId" v-for="(item,key) in apps"/>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="12">
                <el-form-item label="案件类型:" prop="caseTypeIdArray" class="postInfo-container-item">
                  <span v-if="dialogLook">{{zsFromData.caseTypeStr}}</span>
                  <el-multi-cascader v-else @change="changeCaseType" style="" selectChildren :show-all-levels="false"
                                     :is-two-dimension-value="true" multiple filterable clearable
                                     :options="caseTypeOptions" :props="defaultParams" change-on-select collapse-tags
                                     v-model="zsFromData.caseTypeIdArray">
                    <template slot-scope="{ node, data }">
                      <span>{{ data.label }}</span>
                      <div class="casecBtn" v-if="data.label=='商标'">
                        <el-button>简单</el-button>
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
                    <el-option v-for="item in patentTypeList" :label="item.label" :value="item.id"
                               :key="item.label"></el-option>
                  </el-select>

                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="zsFromData.indicateType == 5">
                <el-form-item label="进入国家:" prop="toCountry">
                  <span v-if="dialogLook">{{zsFromData.toCountrys}}</span>
                  <el-select v-else default-first-option :clearable='true' placeholder="请选择"
                             v-model="zsFromData.toCountryList" multiple
                             filterable>
                    <el-option v-for="(item,key)  in patentCountryArray" :key="key" :label="item.country_name"
                               :value="item.country_name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col v-if="zsFromData.indicateType == 5" :span="12">
                <el-form-item label="时限类型:" prop="tltTypeId" >
                  <span v-if="dialogLook">{{computedTltTypeId}}</span>
                  <el-select v-else v-model="zsFromData.tltTypeId" placeholder="请选择时限类型" filterable
                             clearable >
                    <el-option
                      v-for="item in getTimelimitTypeAllList"
                      :key="item.tltTypeId"
                      :label="item.typeName"
                      :value="item.tltTypeId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-else>
                <el-form-item label="递交方式:" prop="submitType" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{zsFromData.submitType}}</span>
                    <el-select v-else :clearable="true" default-first-option filterable placeholder="请选择"
                               v-model="zsFromData.submitType">
                      <el-option label="全部" value="全部"/>
                      <el-option label="网上申请" value="网上申请"/>
                      <el-option label="线下申请" value="线下申请"/>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{+zsFromData.status===1 ? '启用' : '停用'}}</span>
                  <el-radio-group v-else v-model="zsFromData.status">
                    <el-radio :label='1'>启用</el-radio>
                    <el-radio :label='0'>停用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="zsFromData.indicateType == 5">
              <el-col :span="24">
                <el-form-item label="绝限日期:" prop="abslimitDate" class="abslimitDate">
                  <div v-if="dialogLook">
                    <span >{{zsFromData.abslimitDate}} 天 / </span>
                    <span >{{zsFromData.dayTypeStr}}</span>
                  </div>
                  <div v-else style="display: flex;align-items: center;">
                    <el-input
                      style="width: 50%;"
                      v-model.number="zsFromData.abslimitDate"
                      type="number"
                      placeholder="请输入天数">
                    </el-input>
                    <el-radio-group v-model="zsFromData.dayType">
                      <el-radio :label='1'>工作日</el-radio>
                      <el-radio :label='2'>自然日</el-radio>
                    </el-radio-group>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="zsFromData.indicateType == 5">
              <el-col :span="24">
                <el-form-item label="提醒计划" class="postInfo-container-item">
                  <span v-if="dialogLook">{{computedRempId}}</span>
                  <el-select v-else v-model="zsFromData.rempId" :popper-append-to-body="false" :disabled="type" placeholder="请选择提醒计划" filterable
                            clearable>
                    <el-option
                      v-for="item in remindPlanList"
                      :key="item.rempId"
                      :label="item.planName"
                      :value="item.rempId">
                      <span>
                        {{ item.planName }}
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="启用日期:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{zsFromData.startDate}}</span>
                  <el-date-picker v-else v-model="zsFromData.startDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                                  align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="停用日期:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{zsFromData.endDate}}</span>
                  <el-date-picker v-else v-model="zsFromData.endDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                                  align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="zsFromData.indicateType=='4'" class="fullRow">
              <el-col :span="24">
                <el-form-item label="费用:" prop="customerReqQuoteFeeList"
                              class="postInfo-container-item uploader-custfile">
                  <div class="fee-table" style="width: 95%;padding: 10px">
                    <el-button v-if="!dialogLook" size="mini" type="primary"
                               @click="addTableList(zsFromData.customerReqQuoteFeeList, 'customerReqQuoteFeeList' )">添加
                    </el-button>
                    <el-button v-if="!dialogLook" size="mini" type="primary"
                               @click="delTableList(zsFromData.customerReqQuoteFeeList, 'customerReqQuoteFeeList' )">删除
                    </el-button>
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
                            <el-option v-for="item in patentTypeList.filter(i=>zsFromData.patentType.includes(i.id))"
                                       :label="item.label" :value="item.id" :key="item.label"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="费用名称"
                      >
                        <template slot-scope="scope">
                          <span v-if="dialogLook">{{scope.row.chargeItemName}}</span>
                          <el-select v-else default-first-option :clearable='true' placeholder="请选择"
                                     v-model="scope.row.chargeItemId" filterable>
                            <el-option
                              v-for="(item,key) in seletData.chargeItemlist.filter(i=>i.patentType == scope.row.patentType)"
                              :key="key" :label="item.nameCn" :value="item.chargeItemId">
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
                  <el-date-picker v-else v-model="zsFromData.billSenddate" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                                  align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
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
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择"
                               v-model="zsFromData.curId" filterable>
                      <el-option v-for="(item,key) in seletData.curId" :key="key" :label="item.curName"
                                 :value="item.curId">
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
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择"
                               v-model="zsFromData.payAcountId" filterable>
                      <el-option v-for="(item,key) in seletData.payAcount" :key="key" :label="item.payAccountName"
                                 :value="item.payAccountId">
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

                    <p v-if="dialogLook" v-for="item in materialList" style="color: #409EFF">
                      <a target="_blank" :href="`ipdoc${item.address}`">{{item.name+item.format}}</a>
                    </p>
                    <el-upload v-if="!dialogLook" class="upload-demo" :on-preview="onPreview" name="custReqFile"
                               :data='addCustomerRequirementFileData' ref="uploadzsFile"
                               :action="addCustomerRequirementFileUrl" :before-upload="handlePreview"
                               list-type='picture' :file-list="materialList" :on-remove="handleRemove">
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
      <div slot="footer" class="fl-ac-jc" style="height: 35px;">
        <el-button @click="closeIndicateDialog(false)">
          取消
        </el-button>
        <el-button v-if="!dialogLook" type="primary" @click="createCustAddr()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addCustomerRequirementUrl,
    delCustomerReqDoc,
    delCustomerRequirementUrl, queryAppInfoUrl,
    queryCaseType,
    queryChargeItemUrl,
    queryCurrencyUrl,
    queryCustomerReqTypeUrl,
    queryCustomerRequirementBycustIdUrl,
    queryCustomerRequirementUrl,
    queryPayAcountUrl,
    queryregCaseTypeUrl, topCustomerRequirement,
    updateCustomerRequirementUrl
  } from "../../../../../api/customerList";
  import {getProgID} from "../../../../../utils/editInOffice";
  import {getTwoDimensionalArray} from "@/utils/index.js";
  import * as serviceApi from "../../../../../api/serviceApi.config";
  import { mapGetters } from "vuex";
  import { queryPatentCountry } from '@/api/caseDetail'
  import { getTimelimitType, queryRemindPlan } from '@/api/caseList'

  export default {
    name: "CustIndicate",
    components: {},
    props: {
      tabNo: {},
      fullname: {},
      editStatus: {
        type: Boolean,
        default: false
      },
      custId: {}

    },
    watch: {
      indicateList: {
        handler(n) {
          this.headWorkFilters = this.$commonUtils.tableFilter(n)
          this.changeKey = !this.changeKey
        },
        deep: true,
        immediate: true
      },
      "zsFromData.caseTypeIdArray"(n) {
        this.isPatent = false
        if (!n) {
          this.$set(this.zsFromData, 'caseTypeIdArray', [])
          // this.zsFromData.caseTypeIdArray=[];
        } else {
          let langList = []
          n.length && n.forEach(item => {
            langList = langList.concat([...item])
          });
          [...new Set(langList)].forEach(i => {
            if (this.$store.getters.patentCaseTypeIdList.includes(i)) {
              this.isPatent = true
            }
          })
        }

      },
      "zsFromData.toCountryList": {
        handler(n) {
          if (n && Array.isArray(n)) {
            this.zsFromData.toCountrys = n.join(',')
          } else {
            this.zsFromData.toCountrys = ''
          }
        },
        immediate: true
      }
    },
    data() {
      var caseTypeIdArray = (rule, value, callback) => {
        if (this.zsFromData.caseTypeIdArray && JSON.stringify(this.zsFromData.caseTypeIdArray) != '[]') {
          callback()
        } else {
          callback(new Error("请选择案件类型"))
        }
      }
      return {
        remindPlanList: [],
        patentCountryArray: [], // 进入国家
        getTimelimitTypeAllList: [], // 时限类型
        materialList: [],
        dialogLook: true,
        disabledZs: false,
        rules: {
          indicateType: [
            {required: true, message: "请选择指示类型", trigger: "change"}
          ],
          // submitType: [
          //   { required: true, message: "请选择递交方式", trigger: "change" }
          // ],
          customerReqQuoteFeeList: [
            {required: true, message: "请添加费用", trigger: "change"}
          ],
          caseTypeIdArray: [
            {
              required: true, validator: caseTypeIdArray,
              trigger: "blur"
            }
          ],
          tltTypeId: [
            {required: true, message: "请选择时限类型", trigger: "change"}
          ],
        },
        dialogFormzs: false,
        headWorkFilters: {
          applicantName: '',
          indicateTypeStr: '',
          caseTypeStr: ''
        },
        changeKey: false,
        indicateList: [],
        caseTypeOptions: [],
        seletData: {
          reqType: [],
          chargeItemlist: [],
          curId: [],
          payAcount: []
        },
        zsFromData: {
          dayType: 1,
          toCountrys: '中国',
          toCountryList: ['中国'],
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
        },
        addCustomerRequirementFileData: {
          tokenID: "",
          custId: "",
          id: "",
          indicateType: "",
          fileNames: ""
        },
        patentTypeList: [{label: '发明', id: 1296}, {label: '实用新型', id: 1297}, {label: '外观', id: 1298}],
        isPatent: false,
        apps: [],
        alldialogVisible: false,
        addCustomerRequirementFileUrl: serviceApi.addCustomerRequirementFileUrl,
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
        alltableData: [],
        dialogFormStatus: "",
        isSave: false,
        title: '',
      }
    },
    computed: {
      computedTltTypeId() {
        return this.getTimelimitTypeAllList.find(item => item.tltTypeId === this.zsFromData.tltTypeId) && this.getTimelimitTypeAllList.find(item => item.tltTypeId === this.zsFromData.tltTypeId).typeName
      },
      computedRempId() {
        return this.remindPlanList.find(item => item.rempId == this.zsFromData.rempId) && this.remindPlanList.find(item => item.rempId == this.zsFromData.rempId).planName;
      },
      clientHeight() {
        return document.documentElement.clientHeight - 300
      },
      ...mapGetters(["token"])
    },
    created() {
      this.init()
    },
    methods: {
      limitFormat(value){
        const formatSuffix = this.remindPlanList.map(detail => detail.remindOnce).join('/')
        if(formatSuffix){
          const name = value.planName.replace(/\（.*?\）/g, '').trim();
          return name + '(' + formatSuffix + ')'
        }else{
          return value.planName
        }
      },
      queryRemindPlan(){
         queryRemindPlan().then(res=>{
          this.remindPlanList = res.data
        })
      },
      cancelTop(row) {
        topCustomerRequirement({
          id: row.id,
          indicateType: row.indicateType,
          topping: 0
        }).then(res => {
          this.$message.success('取消置顶成功!')
          this.queryList()
        })
      },
      setTop(row, index) {
        const topList = this.indicateList.filter(item => item.topping)
        if (topList.length > 2) { // 置顶超过3个，需要取消第一个置顶，再置顶这个
          topCustomerRequirement({
            id: topList[0].id,
            indicateType: topList[0].indicateType,
            topping: 0
          }).then(res => {
            topCustomerRequirement({
              id: row.id,
              indicateType: row.indicateType,
              topping: 1
            }).then(res => {
              this.$message.success('置顶成功!')
              this.queryList()
            })
          })
        } else { // 置顶不超过3个，可以直接置顶
          topCustomerRequirement({
            id: row.id,
            indicateType: row.indicateType,
            topping: 1
          }).then(res => {
            this.$message.success('置顶成功!')
            this.queryList()
          })
        }
      },
      handleRemove(file, fileList, caseId) {
        let delmaterialId;
        if (file.response) {
          delmaterialId = file.response.data[0].materialId;
        } else {
          delmaterialId = file.materialId;
        }
        delCustomerReqDoc({
          materialId: delmaterialId,
          custReqType: this.zsFromData.indicateType,
          custReqId: this.zsFromData.id
        }).then(res => {
        })
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
          let idx = list.findIndex(i => i == item)
          list.splice(idx, 1)
        })
      },
      onPreview(data) {
        let url = data.address || data.url
        if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          if (['doc', 'docx'].includes(url.replace(/.+\./, "").toLocaleLowerCase())) {
            this.$commonUtils.viewPdf(`${url}`)
          } else {
            let flag = ''
            if (data.mailId) {
              flag = 'mailId'
            } else if (data.materialId) {
              flag = 'materialId'
            }
            url = url.replace(/&/g, '%26')
            window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g, '%2B'))
          }
          // doEditInOffice(url, getProgID(url))
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          this.downLoad(data)
        }
      },
      downLoad(data) {
        const url = data.address || data.url
        const downData = {
          url: `ipdoc${url}`,
          success() {
          }
        }
        if (data.mailId) {
          downData.downLoad = data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
      },
      handlePreview(file) {
        this.addCustomerRequirementFileData.tokenID = this.token;
        this.addCustomerRequirementFileData.custId = this.custId;
        this.addCustomerRequirementFileData.id = this.zsFromData.id;
        this.addCustomerRequirementFileData.indicateType = this.zsFromData.indicateType;
        this.addCustomerRequirementFileData.fileNames = file.name.substr(
          0,
          file.name.lastIndexOf(".")
        )
      },
      init() {
        this.queryApps()
        this.queryList()
        this.queryChargeItemUrl()
        queryCaseType().then(res => {
          this.caseTypeOptions = res.data
        })
        queryCustomerReqTypeUrl().then(response => {
          if (response.success) {
            this.seletData.reqType = response.data
          } else {
            this.$message.error(response.message)
          }
        })
        queryCurrencyUrl().then(res => {
          this.seletData.curId = res.data
        })
        queryPayAcountUrl().then(res => {
          this.seletData.payAcount = res.data
        })
        queryPatentCountry().then(res => {
          this.patentCountryArray = res.data
        })
        getTimelimitType({
          kind: 2 // 内部时限
        }).then(res=>{
          this.getTimelimitTypeAllList = res.data
        })
        this.queryRemindPlan()
      },
      queryApps() {
        queryAppInfoUrl({custId: this.custId}).then(res => {
          this.apps = res.data
        })
      },
      queryChargeItemUrl(caseTypeIdList = '', patentType = '') {
        let data = {}
        patentType && (data.patentTypeList = patentType.split(','))
        caseTypeIdList && (data.caseTypeIdList = caseTypeIdList)
        queryChargeItemUrl(data).then(response => {
          this.seletData.chargeItemlist = response.data
        });
      },
      handleFirstCaseTypeIdList(typeIdList) {
        if (!typeIdList) return;
        const firstCaseTypeIdLIst = [1, 2, 3, 4, 75, 76, 86]
        let langList = []
        typeIdList.length && typeIdList.forEach(item => {
          langList = langList.concat([...item])
        });
        if ([...new Set(langList)].includes(4)) {
          return [...new Set(langList)].filter(i => firstCaseTypeIdLIst.includes(i))
        }
        return [...new Set(langList)]
      },
      changeCaseType(typeIdList) {
        if (!typeIdList.length) {
          this.zsFromData.patentType = []
          return
        }
        let caseTypeIdList = this.handleFirstCaseTypeIdList(typeIdList)
        const patentType = this.zsFromData.patentType && this.zsFromData.patentType.length && this.patentTypeList.filter(i => this.zsFromData.patentType.includes(i.id)).map(i => i.label).join(',') || ''
        this.queryChargeItemUrl(caseTypeIdList, patentType)
      },
      changeType(patentTypeIdList) {
        if (!patentTypeIdList || patentTypeIdList && !patentTypeIdList.length) return;
        const patentType = this.patentTypeList.filter(i => patentTypeIdList.includes(i.id)).map(i => i.label).join(',') || ''
        this.queryChargeItemUrl(this.handleFirstCaseTypeIdList(this.zsFromData.caseTypeIdArray), patentType)
      },
      async closeIndicateDialog(isSearch) {
        this.$emit('changeMask', {type: 'del', value: this.tabNo})
        if (this.title === '新建' && !this.isSave && this.zsFromData.id) {
          await delCustomerRequirementUrl({
            id: this.zsFromData.id,
            indicateType: this.zsFromData.indicateType
          })
        }
        isSearch && this.queryList()
        this.materialList = []
        this.dialogFormzs = false
        this.zsfileUploadbool = false
        this.dialogLook = true
        this.disabledZs = false
        this.isPatent = false
        this.isSave = false
        this.title = ''
      },
      createCustAddr() {
        // creatzsForm
        if (!this.$commonUtils.formValidate(this.$refs['creatzsForm'])) return;
        if (this.zsFromData.id) {
          const tempData = Object.assign({}, this.zsFromData);
          tempData.custId = this.custId;
          tempData.id = this.zsFromData.id;
          delete tempData.materialList
          tempData.patentType && tempData.patentType.length && (tempData.patentTypeName = String(tempData.patentType))
          delete tempData.patentType
          updateCustomerRequirementUrl(tempData).then(response => {
            if (response.success) {
              this.isSave = true
              this.$message({
                type: 'success',
                dangerouslyUseHTMLString: true,
                message: response.message
              })
              this.closeIndicateDialog(true)
            } else {
              this.$message.error(response.message)
            }
          })
        } else {
          this.$message.error("请重新选择指示类型")
        }
      },
      regTypeselectChange(id) {
        if (this.zsFromData.id == "") {
          this.zsFromData.custId = this.custId;
          if (!this.zsFromData.indicateType) {
            return
          }
          addCustomerRequirementUrl(this.zsFromData).then(response => {
            if (response.success) {
              this.zsFromData.id = response.data.id
              this.zsFromData.oldIndicateType = this.zsFromData.indicateType
              this.zsfileUploadbool = true
            } else {
              this.$message.error(response.message)
            }
          })
        }
        // queryregCaseTypeUrl({
        //   indicateType: id,
        //   custId: this.custId
        // }).then(response => {
        //   if (response.success) {
        //     this.seletData.caseTypezs = response.data;
        //   }
        // });
      },
      custAddrdel(row, index) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delCustomerRequirementUrl({
            id: row.id,
            indicateType: row.indicateType
          }).then(response => {
            this.$message.success(response.message)
            this.indicateList.splice(index, 1)
          })
        })
      },
      queryList() {
        queryCustomerRequirementBycustIdUrl({
          custId: this.custId
        }).then(res => {
          this.indicateList = res.data || []
          this.sortTableByKey(this.alltableData, 'startDate', 'desc')
        })
      },
      sortTableByKey(list, key, sort = 'desc') {
        list.forEach(item => !item[key] && (item[key] = ''))
        list = list.sort((a, b) => b[key].localeCompare(a[key]))
      },
      filterHandler(value, row, column) {
        const property = column['property']
        return row[property] === value
      },
      addIndicate() {
        this.resetFromData()
        this.dialogFormzs = true
        this.title = '新建'
        this.dialogLook = false
        this.materialList = []
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
      },
      resetFromData() {
        this.$set(this, 'zsFromData', {
          toCountrys: '中国',
          toCountryList: ['中国'],
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
          materialList: [],
          id: ""
        })
      },
      rowDbClick(row) {
        queryCustomerRequirementUrl({
          indicateType: row.indicateType,
          id: row.id
        }).then(res => {
          this.$emit('changeMask', {type: 'add', value: this.tabNo})
          this.title = this.editStatus ? '修改' : '查看'
          this.dialogLook = this.editStatus ? false : true
          this.zsFromData = res.data;
          this.$set(this.zsFromData, 'toCountryList', this.zsFromData.toCountrys ? this.zsFromData.toCountrys.split(',') : [])
          this.zsFromData.patentTypeName && (
            this.zsFromData.patentType = this.zsFromData.patentTypeName.split(',').map(i => +i)
            // this.$set(this.zsFromData, 'patentType', this.zsFromData.patentTypeName.split(','))
          )
          this.zsfileUploadbool = true;
          this.materialList = res.data.materialList
          this.materialList.forEach(item => item.url = 'ipdoc' + item.url)
          if (this.zsFromData.caseTypeIdList) {
            this.zsFromData.caseTypeIdArray = getTwoDimensionalArray(
              this.caseTypeOptions,
              "caseTypeId",
              this.zsFromData.caseTypeIdList
            );
          } else {
            this.$set(this.zsFromData, 'caseTypeIdArray', [])
          }
          this.zsFromData.oldIndicateType = this.zsFromData.indicateType;
          this.disabledZs = true;
          this.dialogFormzs = true;
          this.isPatent = false
          this.zsFromData.caseTypeIdList && this.zsFromData.caseTypeIdList.length && this.zsFromData.caseTypeIdList.forEach(i => {
            if (this.$store.getters.patentCaseTypeIdList.includes(i)) {
              this.isPatent = true
            }
          })
          const caseTypeIdList = this.isPatent ? [4] : this.zsFromData.caseTypeIdList
          const patentType = this.zsFromData.patentType && this.zsFromData.patentType.length && this.patentTypeList.filter(i => this.zsFromData.patentType.includes(i.id)).map(i => i.label).join(',') || ''
          this.queryChargeItemUrl(caseTypeIdList, patentType)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  > > > .el-table1 {
    /*height: auto;*/

    .cell {
      max-height: 70px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }

  > > > .header-table {
    margin-top: 10px;
    padding: 0 0 0 15px;

    .el-table__header-wrapper {
      border: 1px solid #EBEEF5;
      border-bottom: none;

      th {
        background-color: #FAFAFA;
        font-size: 16px;
        color: #555555;
        font-weight: normal;
      }
    }
  }

  .indicate-info {
    background-color: #fff;
    padding: 10px 15px;

    .el-button {
      float: right;
    }

    .base-header {
      display: flex;
      align-items: center;

      .left-line {
        display: inline-block;
        width: 10px;
        height: 26px;
        background-color: #409EFF;
        margin-right: 10px;
      }

      .right-text {
        font-weight: bold;
      }
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
      display: flex;
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
      flex: 1;
      text-align: center;
      /*height: 30px;*/
      margin-left: 0 !important;
    }

    .fullRow {
      /deep/ .el-form-item__label {
        width: 15%;
      }

      /deep/ .el-input,
      /deep/ .el-select {
        width: 100%;
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

  /deep/ .el-col.el-col-12 {
    .el-cascader {
      width: 100%;

      .el-input {
        width: 100%;
      }
    }
  }

  > > > .el-dialog {
    margin-top: 5vh !important;
  }

  > > > .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    max-height: 450px;
    overflow: auto;
  }

  /deep/ .el-form-item__content {
    text-align: center;

    .el-form-item__error {
      position: relative;
      text-align: left;
      left: 0;
      top: 0;
    }
  }


  /*.el-table /deep/ th {*/
  /*  background-color: #f2f2f2;*/
  /*  color: #333333;*/
  /*  height: 30px;*/
  /*  line-height: 30px;*/
  /*  padding: 0px !important;*/
  /*}*/

  /*.table-dl-row {*/
  /*  /deep/ thead,*/
  /*  /deep/ th,*/
  /*  /deep/ .el-table__header-wrapper,*/
  /*  /deep/ .el-table__header,*/
  /*  /deep/ tr,*/
  /*  /deep/ td,*/
  /*  /deep/ .el-select,*/
  /*  /deep/ .el-input,*/
  /*  /deep/ .el-input__inner {*/
  /*    height: 30px;*/
  /*    line-height: 30px;*/
  /*    padding: 0px !important;*/
  /*  }*/

  /*  /deep/ td {*/
  /*    background-color: #ffffff !important;*/
  /*  }*/
  /*}*/

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
      height: 38px;
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


  /deep/ .postInfoleft /deep/ .el-form-item__content {
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

  > > > .postInfo-container-item {
    .fee-table {
      .cell {
        text-align: center;
      }
    }
  }
  /deep/ .el-input__inner {
    border: none;
    height: 38px;
  }
  /deep/ .multi-base-input {
    //height: 38px;
    .el-input__inner {
      border: none;
      height: 40px !important;
    }
  }
</style>
