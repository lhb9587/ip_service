<template>
  <div>
    <div class="box-border">
      <div style="display: flex;max-height: 600px;overflow: auto">
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
              <el-col :span="16">
                <el-form-item label="案件文号:" label-width="150px" class="postInfo-container-item">
                  <!--                  {{checkData.showRefno}}-->
                  <el-input
                    v-if="checkData.showRefno"
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 2}"
                    :disabled="true"
                    v-model="checkData.showRefno">
                  </el-input>
                  <el-button v-if="checkType !== 'view'" style="margin-left: 10px" size="mini" type="primary"
                             @click="changeCaseVisible=true">搜索
                  </el-button>
                  <ChooseCase
                    :dialogVisible="changeCaseVisible"
                    :agentNums="agentNums.length <= 0 ? caseArray.map(item=>item.agentNum).join('\n') : agentNums.join('\n')"
                    @closed="changeCaseVisible=false"
                    rules="custId"
                    @getList="getList"></ChooseCase>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态:" label-width="150px" class="postInfo-container-item">
                  <template v-for="item in statusList">
                    <b v-if="checkData.status == item.type">{{item.name}}</b>
                  </template>
                  <!--                  <el-select default-first-option :clearable='true' placeholder="请选择" size="mini"-->
                  <!--                             v-model="checkData.status" filterable>-->
                  <!--                    <el-option :label="item.name" :value="item.type" v-for="item in statusList"></el-option>-->
                  <!--                  </el-select>-->
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
              </el-col>
            </el-row>
            <el-row class="first-row" style="margin-bottom: 5px">
              <el-col :span="12">
                <el-form-item label="权利号:" label-width="150px" class="postInfo-container-item">
                  <el-input key='droitNumber' :value="checkData.droitNumber ? checkData.droitNumber : caseInfo.droitNumber" @input="(value)=>handleCaseInfo(value,'droitNumber')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商标类别:" label-width="150px" class="postInfo-container-item">
                  <el-input key='goodClasses' :value="checkData.goodClasses ? checkData.goodClasses : caseInfo.goodClasses" @input="(value)=>handleCaseInfo(value,'goodClasses')"></el-input>
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
            <div v-loading="uploadLoading"
                 element-loading-text="识别中，请等待！"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)">
              <div class="divider">
              <span>
                  档案信息
              </span>
              </div>
              <el-row class="first-row">
                <el-col :span="12">
                  <el-form-item label="条码号:" prop="barcode" label-width="150px" class="postInfo-container-item">
                    <span v-if="checkType === 'view'">{{checkData.barcode}}</span>
                    <el-input v-else ref="barcode" v-model="checkData.barcode" @change="barcodeDiscern" placeholder="录入条码号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="postInfo-container-item" style="display: flex">
                    <!--                  <el-checkbox-group >-->
                    <el-checkbox label="原件" v-model="checkData.original" :disabled="checkType === 'view'? true:false" :checked="checkData.original==1?true:false" :true-label="1" :false-label="0" name="type"></el-checkbox>
                    <!--                  </el-checkbox-group>-->
                    <el-upload
                      v-if="checkType !== 'view' && checkData.original"
                      class="upload"
                      name="attachFile"
                      :show-file-list="false"
                      :data="{tokenID:$store.getters.token}"
                      :action="uploadArchivesOriginalFile"
                      :on-progress="handleOriginalProgress"
                      :on-success="handleOriginalSuccess">
                      <el-button size="small" type="primary">原件识别</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="checkData.original">
                <el-col :span="24">
                  <el-form-item label="原件类型:" label-width="150px" class="postInfo-container-item">
                    <span v-if="checkType === 'view'">{{checkData.oriType}}</span>
                    <el-select
                      v-else
                      v-model="checkData.oriType"
                      filterable
                      allow-create
                      default-first-option
                      clearable
                      placeholder="请选择原件类型">
                      <el-option
                        v-for="item in originalType"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="checkData.original">
                <el-col :span="24">
                  <el-form-item label="原件名称:" label-width="150px" class="postInfo-container-item">
                    <span v-if="checkType === 'view'">{{checkData.oriName}}</span>
                    <el-input v-else type="textarea" :rows="6" v-model="checkData.oriName"
                              maxlength="1000" placeholder="请填写原件名称"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!--              <el-row>-->
              <!--                <el-col :span="24">-->
              <!--                  <el-form-item label="案卷简要内容:" label-width="150px" class="postInfo-container-item">-->
              <!--                    <span v-if="checkType === 'view'">{{checkData.briefContent}}</span>-->
              <!--                    <el-input v-else :rows="2" v-model="checkData.briefContent"-->
              <!--                              placeholder="请填写案卷简要内容"></el-input>-->
              <!--                  </el-form-item>-->
              <!--                </el-col>-->
              <!--              </el-row>-->
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
                    <span v-if="checkType === 'view'">{{ userList.find(item => item.userId == checkData.filingUserId) ? userList.find(item => item.userId == checkData.filingUserId).fullname : ''}}</span>
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
            </div>
            <div style="padding-right: 5px" v-if="checkType != 'create'">
              <div class="divider">
                <span>
                  档案状态变更记录
                </span>
              </div>
            </div>
            <el-row class="first-row" v-if="checkType != 'create'">
              <el-col :span="24">
                <el-form-item label="借出记录:" label-width="150px" class="postInfo-container-item">
                  <el-table
                    :data="checkData.recordArray"
                    style="width: 100%">
                    <el-table-column
                      prop="lendUser"
                      label="借出人"
                      width="180">
                      <template slot-scope="scope">
                        <span>{{ scope.row.lendUser}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="lendDate"
                      label="借出日期"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="returnDate"
                      label="归还日期">
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="first-row" v-if="checkType != 'create'">
              <el-col :span="24">
                <el-form-item label="取走记录:" label-width="150px" class="postInfo-container-item">
                  <el-table
                    :data="checkData.takeAwayRecordArray"
                    style="width: 100%">
                    <el-table-column
                      prop="takeAwayUser"
                      label="取走人"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="takeAwayDate"
                      label="取走日期"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="takeAwayReason"
                      label="备注">
                    </el-table-column>
                    <el-table-column
                      prop="takeAwayReturnDate"
                      label="取走归还日期">
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="checkData.status == 3">
              <el-col :span="12">
                <el-form-item label="异地保存包号:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkType === 'view'">{{checkData.packageCode}}</span>
                  <el-input v-else v-model="checkData.packageCode" placeholder="异地保存包号" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="异地保存日期:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkType === 'view'">{{checkData.remoteStorageDate}}</span>
                  <el-date-picker
                    v-else
                    v-model="checkData.remoteStorageDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="checkData.status == 4">
              <el-col :span="12">
                <el-form-item label="销毁日期:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkType === 'view'">{{checkData.destroyDate}}</span>
                  <el-date-picker
                    v-else
                    v-model="checkData.destroyDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <!--            <el-row v-if="checkData.status == 5">-->
            <!--              <el-col :span="12">-->
            <!--                <el-form-item label="取走人:" label-width="150px" class="postInfo-container-item">-->
            <!--                  <span v-if="checkType === 'view'">{{ userList.find(item => item.userId == checkData.takeAwayUserId) ? userList.find(item => item.userId == checkData.takeAwayUserId).fullname : ''}}</span>-->
            <!--                  <el-select v-else v-model="checkData.takeAwayUserId" filterable clearable reserve-keyword default-first-option>-->
            <!--                    <el-option-->
            <!--                      v-for="item in userList"-->
            <!--                      :key="item.userId"-->
            <!--                      :label="item.fullname"-->
            <!--                      :value="item.userId"-->
            <!--                    >-->
            <!--                    </el-option>-->
            <!--                  </el-select>-->
            <!--                </el-form-item>-->
            <!--              </el-col>-->
            <!--              <el-col :span="12">-->
            <!--                <el-form-item label="取走日期:" label-width="150px" class="postInfo-container-item">-->
            <!--                  <span v-if="checkType === 'view'">{{checkData.takeAwayDate}}</span>-->
            <!--                  <el-date-picker-->
            <!--                    v-else-->
            <!--                    v-model="checkData.takeAwayDate"-->
            <!--                    type="date"-->
            <!--                    format="yyyy-MM-dd"-->
            <!--                    value-format="yyyy-MM-dd"-->
            <!--                    placeholder="选择日期">-->
            <!--                  </el-date-picker>-->
            <!--                </el-form-item>-->
            <!--              </el-col>-->
            <!--            </el-row>-->
            <!--            <el-row v-if="checkData.status == 5">-->
            <!--              <el-col :span="24">-->
            <!--                <el-form-item label="取走原因:" label-width="150px" class="postInfo-container-item">-->
            <!--                  <span v-if="checkType === 'view'">{{checkData.takeAwayReason}}</span>-->
            <!--                  <el-input v-else type="textarea" :rows="2" v-model="checkData.takeAwayReason"-->
            <!--                            placeholder="取走原因"></el-input>-->
            <!--                </el-form-item>-->
            <!--              </el-col>-->
            <!--            </el-row>-->
          </div>
        </el-form>
      </div>
    </div>
    <div class="fl-ac-jc" style="padding: 20px 0">
      <el-button size="small" @click="closeDialog(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="submit" v-if="checkType == 'create' || checkType == 'edit' ">确 定</el-button>
    </div>
  </div>
</template>

<script>
import {getCase} from "@/api/feeList";
import { deleteMaterial } from "@/api/customerList";
import { disposeAgentNum } from "@/api/billApi";
import uploadFile from '@/views/workbench/material_management/components/uploadFile'
import {getProgID} from '@/utils/editInOffice.js'
import {queryCustomerNameId} from '@/api/caseList.js'
import ChooseCase from "../../case/components/ChooseCase";
import { uploadArchivesOriginalFile } from "@/api/serviceApi.config.js";
import { createArchives, updateArchives, queryArchivesInfo, uploadArchivesMaterial, deleteArchivesMaterial, initArchivesOriginalFile } from "@/api/material.js";
export default {
  name: "archiveDetail",
  components: {
    uploadFile,
    ChooseCase
  },
  props: {
    checkType:{
      type: String
    },
    archiveId:{
      type: Number,
      default: 0
    },
    materialId:{
      type: Number
    },
    agentNums:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      uploadArchivesOriginalFile,
      sign: '',
      userList: [], // 用户列表
      fileList: [],
      caseArray: [],
      statusList: [
        { type: 1, name: '在库' },
        { type: 2, name: '借出' },
        { type: 3, name: '异地保存' },
        { type: 4, name: '销毁' },
        { type: 5, name: '取走' }
      ], // 状态列表
      changeCaseVisible: false, // 案件文号选择界面
      loading: false,
      uploadLoading: false,
      queryCustomerNameIdList: [], // 查询客户列表
      caseInfo: {
        custId: '', // 客户id
        caseName: '', // 案件名称
        custName: '', // 客户名称
        droitNumber: '', // 权利号
        goodClasses: '' // 商标类别
      },
      checkData: {
        subject: '建立档案', // 主题
        showRefno: '', // 案件文号
        custId: '', // 客户
        droitNumber: '', // 权利号
        goodClasses: '', // 商标类别
        original: 0, // 是否原件
        oriType: '', // 原件类型
        oriName: '', // 原件名称
        filingUserId: '', // 建档用户id
        filingDate: '', // 创建时间
        packageCode: '', // 异地保存包号
        remoteStorageDate: '', // 异地保存日期
        destroyDate: '', // 销毁日期
        takeAwayUserId: '', // 取走人id
        takeAwayDate: '', // 取走日期
        takeAwayReason: '', // 取走原因
        briefContent: '', // 案件简要内容
        remarks: '', // 备注
        status: 1, // 状态 1在库（默认），2借出，3异地保存，4销毁，5取走
        recordArray: [],
        materialIdArray: [], // 附件
        caseIds: '',
        taskType: 1
      },
      hoverState: false,
      curFile: [],
      clickUpload: false,
      rules: {
        barcode: [{required: true, message: '请录入条码号', trigger: 'change'}],
      },
      originalType: ['商标裁定','裁判文书','商标注册证明','客户授权材料','官方发文清单','证据','资料','专利综合证据','非注册受理通知书','领取注册证通知书'],
      relationTypes:[
        {type: 'CAID', name: '商标裁定'},
        {type: 'JDS', name: '裁判文书'},
        {type: 'TMZCZ', name: '商标注册证明'},
        {type: 'WTH', name: '客户授权材料'},
        {type: 'GSZ', name: '客户授权材料'},
        {type: 'SQS', name: '客户授权材料'},
        {type: 'GWEN', name: '官方发文清单'},
        {type: 'ZHJ', name: '证据'},
        {type: 'ZIL', name: '资料'},
        {type: 'ZL', name: '专利综合证据'}, // ZL*ZH
        {type: 'FZC', name: '非注册受理通知书'} // FZC*ST
      ]
    }
  },
  created() {
  },
  mounted() {
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
        if (this.agentNums.length > 0) {
          this.caseArray = this.agentNums
          const agentNums = this.agentNums.join('\n')
          this.checkData.showRefno = agentNums
          this.getCase(agentNums)
        }
        this.materialId && this.initOriginal()
        // 复制
        this.queryArchivesInfo(true)
        this.checkData.filingUserId = this.$store.getters.userId // 建档人 当前用户
        this.checkData.filingDate = this.$wUtil.getDate('', 'day') // 填报日期
      } else {
        this.queryArchivesInfo(false)
      }
    },
    // 获取档案数据
    queryArchivesInfo(copy) {
      if (this.archiveId){
        queryArchivesInfo({arcId: this.archiveId}).then(res => {
          if (res.data) {
            const checkData = res.data
            this.fileList = checkData.materialArray
            if (checkData.caseArray.length >  0) {
              this.caseArray = checkData.caseArray
              const agentNums = checkData.caseArray.map(res => res.agentNum).join('\n')
              this.getCase(agentNums)
            }
            if (checkData.custId) {
              this.caseInfo.custId = checkData.custId
              this.$nextTick(()=>{
                this.queryCustomerNameIdList = [ {custId: checkData.custId, fullname: checkData.custName }]
              })
            }
            if (!copy){
              this.checkData = checkData
            }else{
              this.copyArchive(checkData)
              this.fileList = []
            }
          }
        })
      }
    },
    // 复制档案
    copyArchive(data) {
      this.checkData.showRefno = data.showRefno
      this.checkData.original = data.original
      this.checkData.oriType = data.oriType
      this.checkData.oriName = data.oriName
      this.checkData.remarks = data.remarks
    },
    // 初始化原件识别
    initOriginal() {
      initArchivesOriginalFile({ materialId: this.materialId }).then(res => {
        if (res.data){
          if (!res.data.oriType){
            this.$message.warning('无法识别此类型文档');
            return
          }
          this.checkData.original = 1
          this.checkData.oriName = res.data.briefContent
          this.fileList.push(res.data)
        }
      })
    },
    // 条码号识别原件类型
    barcodeDiscern() {
      if(this.checkData.barcode) {
        this.relationTypes.forEach(item => {
          // if (!item.type.includes('*')){
          if (this.checkData.barcode.includes(item.type)) {
            this.checkData.oriType = item.name
          }
          // }
        })
      }
    },
    handleCaseInfo(value,filed) {
      this.checkData[filed] = value
    },
    // 获取案号数据,联动客户
    getList(list) {
      if (list.length) {
        this.checkData.caseIds = list.map(item => item.caseId)
        this.caseArray = list
        disposeAgentNum({agentNumberArray: list.map(item => item.agentNum)}).then(res => {
          this.checkData.showRefno = res.data
          this.caseInfoParam(list)
          this.checkData.droitNumber = ''
          this.checkData.goodClasses = ''
        })
      } else {
        this.checkData.showRefno = ''
        this.checkData.caseIds = null
      }
    },
    // 案件信息数据赋值
    caseInfoParam(list){
      if (list && list[0].custId) {
        this.caseInfo.custId = list[0].custId
        this.checkData.custId = list[0].custId
        this.checkData.taskType = list[0].taskType
        this.caseInfo.custName = list[0].custName
        this.caseInfo.caseName = list.map(item => item.caseName).join(",")
        this.caseInfo.droitNumber = list.map(item => item.droitNumber).join(",")
        this.caseInfo.goodClasses = list.map(item => item.goodClasses).join(",")
        // this.queryCustomerNameId(list[0].custName)
        this.$nextTick(()=>{
          this.queryCustomerNameIdList = [ {custId: list[0].custId, fullname: list[0].custName }]
        })
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
    // 根据搜索条件，查询客户
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
    handleOriginalProgress(event){
      this.uploadLoading = true
    },
    // 原件识别回调
    handleOriginalSuccess(res, file) {
      this.$message.success('原件识别成功!');
      this.uploadLoading = false
      this.checkData.oriName = res.data.briefContent
      this.fileList.push(res.data)
    },
    // 删除附件
    delFile(file) {
      deleteArchivesMaterial({materialId: file.materialId}).then(res => {
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
      uploadArchivesMaterial(formData, (e) => {
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
    getCase(agentNums) {
      getCase({agentNums: agentNums}).then(res=>{
        if (res.data){
          if (this.checkType == 'create'){
            this.getList(res.data)
          }else{
            this.caseInfoParam(res.data)
          }
        }
      })
    },
    submit() {
      if (!this.$commonUtils.formValidate(this.$refs['ruleForm'])) return
      this.checkData.materialIdArray = this.fileList.map(item => item.materialId)
      if (this.checkType === 'create') {
        createArchives(this.checkData).then(res => {
          this.$message.success('新建成功!')
          this.closeDialog(res.data.arcId,'create')
        })
      } else {
        updateArchives(this.checkData).then(res => {
          this.$message.success('修改成功!')
          this.closeDialog(this.checkData.arcId)
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

.upload {
  display: inline-block;
  margin-left: 20px;
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
