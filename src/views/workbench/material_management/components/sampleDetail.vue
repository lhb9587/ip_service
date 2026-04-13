<template>
  <div>
    <div class="box-border">
      <div style="display: flex;height: 640px;overflow: auto">
        <el-form style="flex: 7" :rules="rules" ref="ruleForm" class="form-container" size="small" :model="checkData">
          <div class="leftBox">
            <div style="padding-right: 5px">
              <div class="divider">
              <span>
                  案件信息
              </span>
              </div>
            </div>
            <el-row class="first-row" style="margin-bottom: 5px">
              <el-col :span="24">
                <el-form-item label="案件文号:" label-width="150px" class="postInfo-container-item">
                  {{checkData.showRefno}}
                  <el-button v-if="checkType !== 'view'" style="margin-left: 10px" size="mini" type="primary"
                             @click="changeCaseVisible=true">搜索
                  </el-button>
                  <ChooseCase
                    :dialogVisible="changeCaseVisible"
                    :agentNums="caseArray.map(item=>item.agentNum).join('\n')"
                    @closed="changeCaseVisible=false"
                    rules="custId"
                    @getList="getList"></ChooseCase>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="first-row" style="margin-bottom: 5px">
              <el-col :span="12">
                <el-form-item label="案件名称:" label-width="150px" class="postInfo-container-item">
                  <el-input v-model="caseInfo.caseName" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客户:" label-width="150px" class="postInfo-container-item">
                  <el-select
                    v-model="caseInfo.custId"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :disabled="checkData.showRefno ? true : false"
                    :remote-method="queryCustomerNameId"
                    @change="changeCustomerId"
                  >
                    <el-option
                      v-for="item in queryCustomerNameIdList"
                      :key="item.custId"
                      :label="item.fullname"
                      :value="item.custId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
<!--                <el-form-item label="客户:" label-width="150px" class="postInfo-container-item">-->
<!--                  <el-input v-model="caseInfo.custName" :disabled="true"></el-input>-->
<!--                </el-form-item>-->
              </el-col>
            </el-row>
            <el-row class="first-row" style="margin-bottom: 5px">
              <el-col :span="12">
                <el-form-item label="案件客户组:" label-width="150px" class="postInfo-container-item">
                  <el-select :clearable="true" :disabled="checkData.showRefno ? true : false"
                             default-first-option filterable placeholder=""
                             v-model="caseInfo.custWkgId" @change="handleCustWkgId">
                    <el-option :key="key" :label="item.groupName" :value="item.wkgId"
                               v-for="(item,key) in custGroup"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="案件承办组:" label-width="150px" class="postInfo-container-item">
                  <el-select :clearable="true" disabled
                             default-first-option filterable placeholder=""
                             v-model="caseInfo.cbWkgId">
                    <el-option :key="key" :label="item.groupName" :value="item.wkgId"
                               v-for="(item,key) in custGroup"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="divider">
        <span>
            附件管理
        </span>
            </div>
            <div class="model_wrap">
              <div class="uploadwrap" :style="{'height': '100%','background':hoverState?'RGBA(32,159,255,0.06)':'#fff','overflow':'auto','padding':'20px'}" v-if="checkType == 'view'">
                <p @mouseover="sign = file.materialId" @mouseleave="sign = ''" class="bg-hover"
                   style="display: flex;align-items: center; height: 26px;line-height: 26px;cursor: pointer"
                   v-for="(file, index) in fileList"
                   :key="file.materialId">
            <span class="single" style="flex:1;display: flex;align-items: center">
              <i class="el-icon-document"></i><span style="flex: 1" class="single" @click="preView(file)">{{file.materialName}}</span>
            </span>
                  <i v-if="sign == file.materialId" class="el-icon-download" style="color: #67C23A"
                     @click="downLoad(file)"></i>
                  <i v-else class="el-icon-circle-check" style="color: #67C23A"></i>
                </p>
              </div>
              <div class="uploadwrap"
                   v-else
                   :style="{'height': '100%','background':hoverState?'RGBA(32,159,255,0.06)':'#fff','overflow':'auto','padding':'20px'}"
                   @drop.stop.prevent="enentDrop($event)"
                   @dragover.stop.prevent="hoverState=true"
                   @dragleave.stop.prevent="hoverState=false"
                   @dragenter.stop.prevent="hoverState=true">
                <div style="text-align: center;margin-bottom: 10px">
            <span style="font-size: 12px;">将文件拖放到此处以添加附件，或者<span style="color: #409EFF;cursor: pointer;"
                                                                 @click="clickUpload=true">浏览</span></span>
                </div>

                <uploadFile :clickUpload="clickUpload" @getUploadFile="getUploadFile"
                            @changeClick="clickUpload=false"></uploadFile>
                <p @mouseover="sign = file.materialId" @mouseleave="sign = ''" class="bg-hover"
                   style="display: flex;align-items: center; height: 26px;line-height: 26px;cursor: pointer"
                   v-for="(file, index) in fileList"
                   :key="file.materialId">
            <span class="single" style="flex:1;display: flex;align-items: center">
              <i class="el-icon-document"></i><span style="flex: 1" class="single" @click="preView(file)">{{file.materialName}}</span>
            </span>
                  <i v-if="sign == file.materialId && checkType !== 'view'" class="el-icon-close" style="color: #67C23A"
                     @click="delFile(file)"></i>
                  <i v-if="sign == file.materialId" class="el-icon-download" style="color: #67C23A"
                     @click="downLoad(file)"></i>
                  <i v-else class="el-icon-circle-check" style="color: #67C23A"></i>
                </p>
              </div>
            </div>
            <div class="divider">
              <span>
                  样品信息
              </span>
            </div>
            <el-row class="first-row">
              <el-col :span="12">
                <el-form-item label="条码号:" prop="barcode" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkType === 'view'">{{checkData.barcode}}</span>
                  <el-input v-else ref="barcode" v-model="checkData.barcode" placeholder="录入条码号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="postInfo-container-item">
                  <el-checkbox label="真伪" v-model="checkData.realOrFake" :disabled="checkType === 'view'? true:false" :checked="checkData.realOrFake==1?true:false" :true-label="1" :false-label="0" name="type"></el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="样品名称:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkType === 'view'">{{checkData.sampleName}}</span>
                  <el-input v-else  v-model="checkData.sampleName" maxlength="1000" placeholder="请填写样品名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="来源:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkType === 'view'">{{checkData.source}}</span>
                  <el-input v-else  v-model="checkData.source" placeholder="请填写来源"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="送样人:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkType === 'view'">{{ checkData.sender }}</span>
                  <el-select v-else v-model="checkData.sender" filterable clearable reserve-keyword default-first-option>
                    <el-option
                      v-for="item in userList"
                      :key="item.userId"
                      :label="item.fullname"
                      :value="item.fullname"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="公证地点:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkType === 'view'">{{checkData.notaryAddr}}</span>
                  <el-input v-else  v-model="checkData.notaryAddr" placeholder="请填写公证地点"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="位置:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkType === 'view'">{{checkData.position}}</span>
                  <el-input v-else  v-model="checkData.position" placeholder="请填写位置"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实收总数:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkType === 'view'">{{checkData.receiveTotal}}</span>
                  <el-input v-else v-model="checkData.receiveTotal" oninput="value=value.replace(/[^\d]/g,'')" @change="handleInventory" placeholder="请填写实收总数"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkType === 'view'">{{checkData.remarks}}</span>
                  <el-input v-else type="textarea" :rows="2" v-model="checkData.remarks"
                            placeholder="请填写备注"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="建档人:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkType === 'view'">{{userList.find(item => item.userId == checkData.filingUserId) ? userList.find(item => item.userId == checkData.filingUserId).fullname : ''}}</span>
                  <el-select v-else v-model="checkData.filingUserId" filterable clearable reserve-keyword default-first-option>
                    <el-option
                      v-for="item in userList"
                      :key="item.userId"
                      :label="item.fullname"
                      :value="item.userId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="建档日期:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkType === 'view'">{{checkData.filingDate}}</span>
                  <el-date-picker
                    v-else
                    v-model="checkData.filingDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <template v-if="checkType != 'create'">
              <div style="padding-right: 5px">
                <div class="divider">
                <span>
                    库存情况
                </span>
                </div>
              </div>
              <el-row class="first-row">
                <el-col :span="8">
                  <el-form-item label="库存数量:" label-width="150px" class="postInfo-container-item">
                    {{checkData.quantity ? checkData.quantity : 0}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="借出记录:" label-width="150px" class="postInfo-container-item">
                    <el-table
                      :data="recordArray.lendData"
                      style="width: 100%">
                      <el-table-column
                        prop="number"
                        label="借出数量"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="operator"
                        label="借出人"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="recordDate"
                        label="借出日期"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="returnNumber"
                        label="归还数量"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="returnDate"
                        label="归还日期">
                      </el-table-column>
                      <el-table-column
                        prop="remarks"
                        label="备注"
                        width="80">
                        <template slot-scope="scope">
                          <el-tooltip effect="light" v-if="scope.row.remarks" :content="scope.row.remarks" placement="top-end">
                            <el-button type="text">查看</el-button>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="寄出记录:" label-width="150px" class="postInfo-container-item">
                    <el-table
                      :data="recordArray.mailData"
                      style="width: 100%">
                      <el-table-column
                        prop="number"
                        label="寄出数量">
                      </el-table-column>
                      <el-table-column
                        prop="operator"
                        label="寄出人"
                      >
                        <template slot-scope="scope">
                          <span>{{ scope.row.operator }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="recordDate"
                        label="寄出日期">
                      </el-table-column>
                      <el-table-column
                        prop="expresNo"
                        label="快递单号">
                      </el-table-column>
                      <el-table-column
                        prop="expressAddr"
                        label="邮寄地址">
                      </el-table-column>
                      <el-table-column
                        prop="returnDate"
                        label="归还日期">
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="异地保存:" label-width="150px" class="postInfo-container-item">
                    <el-table
                      :data="recordArray.offSiteData"
                      style="width: 100%">
                      <el-table-column
                        prop="number"
                        label="异地保存数量"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="recordDate"
                        label="异地保存日期"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="operator"
                        label="异地保存人"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="remarks"
                        label="备注"
                        width="80">
                        <template slot-scope="scope">
                          <el-tooltip effect="light" v-if="scope.row.remarks" :content="scope.row.remarks" placement="top-end">
                            <el-button type="text">查看</el-button>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="销毁:" label-width="150px" class="postInfo-container-item">
                    <el-table
                      :data="recordArray.destructData"
                      style="width: 100%">
                      <el-table-column
                        prop="number"
                        label="销毁数量"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="recordDate"
                        label="销毁日期"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="operator"
                        label="销毁人"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="remarks"
                        label="备注"
                        width="80">
                        <template slot-scope="scope">
                          <el-tooltip effect="light" v-if="scope.row.remarks" :content="scope.row.remarks" placement="top-end">
                            <el-button type="text">查看</el-button>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </div>
        </el-form>
      </div>
    </div>
    <div class="fl-ac-jc" style="padding: 20px 0">
      <el-button size="small" @click="closeDialog(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="submit" v-if="checkType == 'create' || checkType == 'edit' ">确
        定
      </el-button>
    </div>
  </div>
</template>

<script>
import {
  queryCaseWorkgroupUrl,
  queryCaseInfoUrl,
  lawsuitUrl,
  queryPatentCaseInfo
} from '@/api/caseDetail'
import {getCase} from "@/api/feeList";
import { deleteMaterial } from "@/api/customerList";
import { disposeAgentNum } from "@/api/billApi";
import uploadFile from '@/views/workbench/material_management/components/uploadFile'
import {getProgID} from '@/utils/editInOffice.js'
import {getAllCaseInfo, queryCustomerNameId} from '@/api/caseList.js'
import ChooseCase from "../../case/components/ChooseCase";
import { createSample, updateSample, querySampleInfo, uploadSampleMaterial, deleteSampleMaterial } from "@/api/material.js";
export default {
  name: "sampleDetail",
  components: {
    uploadFile,
    ChooseCase
  },
  props: {
    checkType:{
      type: String
    },
    sampleId:{
      type: Number
    },
  },
  data() {
    return {
      sign: '',
      userList: [], // 用户列表
      custGroup: [], // 组列表
      fileList: [],
      caseArray: [],
      changeCaseVisible: false, // 案件文号选择界面
      loading: false,
      uploadLoading: false,
      queryCustomerNameIdList: [], // 查询客户列表
      caseInfo: {
        custId: '', // 客户id
        caseName: '', // 案件名称
        custName: '', // 客户名称
        custWkgId: '', // 案件客户组
        cbWkgId: '' // 案件承办组
      },
      checkData: {
        subject: '建立样品', // 主题
        showRefno: '', // 案件文号
        custId: '', // 客户
        barcode: '', // 条码号
        realOrFake: 0, // 是否真伪
        sampleName: '', // 样品名称
        source: '', // 来源
        sender: '', // 送样人
        notaryAddr: '', // 公证地点
        position: '', // 位置
        receiveTotal: '', // 实收总数
        remarks: '', // 备注
        filingUserId: '', // 建档人
        filingDate: '', // 建档日期
        quantity: '', // 在库数量
        status: 1, // 状态 1在库（默认），2借出，3异地保存，4销毁，5取走
        recordArray: [], // 借出数量
        materialIdArray: [], // 附件
        caseIds: '',
        custWkgId: '',
        taskType: 1
      },
      hoverState: false,
      curFile: [],
      clickUpload: false,
      rules: {
        barcode: [{required: true, message: '请录入条码号', trigger: 'change'}],
      },
      recordTypeMap: {
        1: 'lendData', // 借出信息
        3: 'turnData', // 转借信息
        4: 'mailData', // 寄出信息
        5: 'offSiteData', // 异地保存信息
        6: 'destructData' // 销毁信息
      },
      recordArray: {
        lendData: [],
        mailData: [],
        returnData: [],
        offSiteData: [],
        destructData: []
      }
    }
  },
  mounted() {
    this.queryCaseWorkgroup()
    this.init()
    this.$nextTick(() => {
      this.$refs.barcode.focus();
    })
  },
  methods: {
    // 页面初始化
    init() {
      this.userList = this.$store.getters.userList
      if (this.checkType === 'create') {
        this.querySampleInfo(true)
        this.checkData.filingUserId = this.$store.getters.userId // 建档人 当前用户
        this.checkData.filingDate = this.$wUtil.getDate('', 'day') // 填报日期
      } else {
        this.querySampleInfo(false)
      }
    },
    querySampleInfo(copy) {
      if(this.sampleId){
        querySampleInfo({samId: this.sampleId}).then(res => {
          if (res.data) {
            const checkData = res.data
            this.fileList = checkData.materialArray
            if (checkData.caseArray.length >  0) {
              this.caseArray = checkData.caseArray
              checkData.caseArray && this.getCase(checkData.caseArray)
            }
            if (checkData.recordArray){
              checkData.recordArray.forEach(item => {
                item.recordType && this.recordArray[this.recordTypeMap[item.recordType]].push(item)
              })
            }
            if (checkData.custId) {
              this.caseInfo.custId = checkData.custId
              this.$nextTick(()=>{
                this.queryCustomerNameIdList = [ {custId: checkData.custId, fullname: checkData.custName }]
              })
            }
            checkData.custWkgId && (this.caseInfo.custWkgId = checkData.custWkgId)
            if (!copy){
              this.checkData = checkData
            } else {
              this.copySample(checkData)
            }
          }
        })
      }
    },
    // 复制样品赋值
    copySample(data){
      this.checkData.showRefno = data.showRefno
      this.checkData.caseIds = data.caseIds
      this.checkData.barcode = data.barcode
      this.checkData.realOrFake = data.realOrFake
      this.checkData.sampleName = data.sampleName
      this.checkData.source = data.source
      this.checkData.sender = data.sender
      this.checkData.notaryAddr = data.notaryAddr
      this.checkData.position = data.position
      this.checkData.receiveTotal = data.receiveTotal
      this.checkData.quantity = data.receiveTotal
      this.fileList = []
    },
    queryCaseWorkgroup(){
      queryCaseWorkgroupUrl({ status: '1' }).then(res => {
        this.custGroup = res.data
      })
    },
    // 案件客户组更改
    handleCustWkgId(e) {
      this.caseInfo.custWkgId = e
      this.checkData.custWkgId = e
      console.log('客户组',e)
    },
    // 获取案号数据,联动客户
    getList(list) {
      if (list.length) {
        this.checkData.caseIds = list.map(item => item.caseId)
        this.caseArray = list
        disposeAgentNum({agentNumberArray: list.map(item => item.agentNum)}).then(res => {
          this.checkData.showRefno = res.data
          this.caseInfoParam(list,this.checkData.caseIds)
        })
      } else {
        this.checkData.showRefno = ''
        this.checkData.caseIds = null
      }
    },
    // 案件信息数据赋值
    caseInfoParam(list,caseIds){
      if (list && list[0].custId) {
        this.caseInfo.custId = list[0].custId
        this.caseInfo.custName = list[0].custName
        this.caseInfo.caseName = list.map(item => item.caseName).join(",")
        this.caseInfo.custWkgId = list[0].costWkgId

        this.checkData.custId = list[0].custId
        this.checkData.taskType = list[0].taskType

        this.$nextTick(()=>{
          this.queryCustomerNameIdList = [ {custId: list[0].custId, fullname: list[0].custName }]
        })
        // 查询案件，获取承办组信息
        if (list[0].taskType==1){
          queryCaseInfoUrl({ caseIds: caseIds }).then(res => {
            if(res.data.trademarkCaseCBWorkgroups.length > 0){
              this.caseInfo.cbWkgId = res.data.trademarkCaseCBWorkgroups[0].wkgId
            }
          })
        } else if(list[0].taskType == 4){
          queryPatentCaseInfo({ caseIds: caseIds }).then(res => {
            if(res.data.trademarkCaseCBWorkgroups.length > 0){
              this.caseInfo.cbWkgId = res.data.trademarkCaseCBWorkgroups[0].wkgId
            }
          })
        } else {
          lawsuitUrl({ caseIds: caseIds}).then(res => {
            if(res.data.trademarkCaseCBWorkgroups.length > 0){
              this.caseInfo.cbWkgId = res.data.trademarkCaseCBWorkgroups[0].wkgId
            }
          })
        }
      }
    },
    // 客户选择赋值
    changeCustomerId(value) {
      if (value){
        this.checkData.custId = value
      }else{
        this.checkData.custId = ''
      }
    },
    // 根据搜索条件，查询客户 暂不用
    queryCustomerNameId(query) {
      if (!this.loading) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            queryCustomerNameId({curStatus: '4,5', pageNo: 0, pageSize: 100, keyword: query}).then(res => {
              this.queryCustomerNameIdList = res.data
              this.loading = false;
            })
          }, 200);
        }
      } else {
        this.queryCustomerNameIdList = [];
      }
    },
    // 重新计算库存数量
    handleInventory() {
      var quantity = 0
      this.recordArray.lendData.map(item => {
        if (!item.returnDate){
          quantity += item.number
        }
      })
      this.recordArray.mailData.map(item => {
        if (!item.returnDate){
          quantity += item.number
        }
      })
      this.recordArray.offSiteData.map(item => {
        quantity += item.number
      })
      this.recordArray.destructData.map(item => {
        quantity += item.number
      })
      this.checkData.quantity = parseInt(this.checkData.receiveTotal) - quantity
      if (Math.sign(this.checkData.quantity) == -1){
        this.$message.warning('库存数量为负数，请检查！')
      }
    },
    // 删除附件
    delFile(file) {
      deleteSampleMaterial({materialId: file.materialId}).then(res => {
        this.$message.success('删除成功！')
        this.fileList.splice(this.fileList.findIndex(i => i.materialId === file.materialId), 1)
      })
    },
    // 预览附件
    preView(data) {
      let url = data.address
      if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
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
      } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
        window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
      } else {
        this.downLoad(data)
      }
    },
    // 附件下载
    downLoad(data) {
      const url = data.address
      const downData = {
        url: `ipdoc${url}`,
        success() {
          // notify.close()
        }
      }
      if (data.mailId) {
        downData.downLoad = data.materialName
      }
      this.$commonUtils.downLoadAll(downData)
    },
    getUploadFile(e) {
      this.curFile = e.target.files
      this.createMultMaterial(this.curFile)
    },
    createMultMaterial(file) {
      let formData = new FormData()
      for (let item of file) {
        formData.append("attachFile", item);
      }
      formData.append("tokenID", this.$store.getters.token);
      uploadSampleMaterial(formData, (e) => {
        this.percentage = parseInt(e.loaded / e.total * 100)
      }).then(async res => {
        this.percentage = 0
        res.data.forEach(item => {
          item.name = item.materialName
        })
        this.fileList.push(...res.data)
      }).catch(() => {
        this.percentage = 0
      })
    },
    enentDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      this.hoverState = false
      this.curFile = e.dataTransfer.files
      this.createMultMaterial(this.curFile)
    },
    // 根据案件文号获取案件信息
    getCase(caseArray) {
      const agentNums = caseArray.map(res => res.agentNum).join('\n')
      getCase({agentNums: agentNums}).then(res=>{
        res.data && this.caseInfoParam(res.data,caseArray.map(item => item.caseId))
      })
    },
    submit() {
      if (!this.$commonUtils.formValidate(this.$refs['ruleForm'])) return
      this.checkData.materialIdArray = this.fileList.map(item => item.materialId)
      if (this.checkType === 'create') {
        createSample(this.checkData).then(res => {
          this.$message.success('新建成功!')
          this.closeDialog(res.data.samId,'create')
        })
      } else {
        updateSample(this.checkData).then(res => {
          this.$message.success('修改成功!')
          this.closeDialog(this.checkData.samId)
        })
      }
    },
    // 关闭页面
    closeDialog(search,type) {
      this.$emit('closeDialog', search,type)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  .el-form-item__error {
    position: relative !important;
    top: 0;
  }

  /deep/ .el-form-item__error{
    position: relative !important;
  }

  /deep/ .el-row {
    margin: 0px;
    display: flex;
  }

  /deep/ .postInfo-container-item {
    height: 100%;
    width: 100%;
  }

  /deep/ .el-form-item__label {
    flex-shrink: 0;
    background-color: #f9f9f9;
    /*width: 36.7%;*/
    text-align: right;
  }

  /deep/ .el-form-item {
    border-right: 1px solid #d7d7d7;
    margin: 0px !important;
  }

  .first-row {
    border-top: 1px solid #d7d7d7;
  }

  /deep/ .el-row {
    border-bottom: 1px solid #d7d7d7;
    border-left: 1px solid #d7d7d7;
  }

  /deep/ td .el-input,
  /deep/ td .el-select {
    width: 100%;
  }

  /deep/ .el-form-item__content {
    text-align: left;
    word-break: break-word;
    // height: 30px;
  }

  /deep/ .el-select .el-input {
    width: 100%;
  }

  .postInfo-container-item {
    display: flex;
    width: 100%;

    /deep/ .el-form-item__content {
      text-align: left;
      display: inline-table;
      flex: 1;
      padding: 5px 15px;
      margin-left: 0 !important;
    }

    > > > .el-date-editor {
      width: 100%;
    }
  }
}

.divider {
  position: relative;
  border-bottom: 1px solid #797979;
  margin-bottom: 20px;
  /*border-right: 1px solid #ccc;*/
  margin-top: 20px;

  .el-badge {
    padding-right: 10px;
  }

  span {
    /*color: #333;*/
    /*font-weight: bold;*/
    font-size: 14px;
    background: #fff;
    position: absolute;
    bottom: -9px;
    left: 50px;
    padding: 0 10px;
  }
}

.box-border {
  border: 1px solid #D7D7D7;
  padding: 5px 5px 5px 5px;
}

> > > .no-radius {
  .el-textarea__inner {
    border-radius: 0;
  }

  input {
    border-radius: 0;
  }
}

> > > .el-select {
  width: 100%;
}

.model_wrap {
  margin-bottom: 15px;
  padding: 0 15px;
}

.uploadwrap {
  border: 1px dashed #c9c9c9;
}

.fileWarp {
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;

  .file_item {
    width: 200px;
    margin: 0 15px 15px 0;

    .fileName {
      font-size: 14px;
      color: #00b0ff;
      overflow: hidden;
      white-space: nowrap;
    }

    .file_detail {
      display: flex;
      justify-content: space-between;
    }
  }
}

.button_wrap {
  display: flex;
  justify-content: center;
}

.progressWrap {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);

  .el-progress {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    /deep/ .el-progress__text {
      color: #fff;
    }

    /deep/ path {
      fill: none !important;
    }
  }
}

.el-upload__text {
  margin-top: 20px;
}

.upload-demo {
  > > > .el-upload {
    width: 100%;
    height: 100%;

    .el-upload-dragger {
      width: 100% !important;
      height: 100% !important;
      min-height: 200px;
    }
  }
}

.single {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bg-hover {
  &:hover {
    background-color: #F5F7FA;
  }
}

>>> .el-table td{
  padding: 0;
}
>>> .el-table th{
  padding: 0;
}
</style>
