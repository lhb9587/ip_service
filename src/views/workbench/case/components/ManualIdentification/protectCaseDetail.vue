<template>
  <el-form label-width="130px">
    <template v-if="taskType==3">
      <el-row>
        <el-form-item label="案件类型">
          <p v-for="item in caseDetailFoemData.lawsuitCasetypeNameArray">{{item}}</p>
        </el-form-item>

        <el-form-item class="postInfo-container-item" label="案件性质:">
          <p
            v-for="itm in caseDetailFoemData.lawsuitWorkArray.map(item=>transformation(selectData.natureOfWorkList,item,'id','typeName'))">
            {{itm}}</p>
          <!--          {{caseDetailFoemData.lawsuitWorkArray.map(item=>transformation(selectData.natureOfWorkList,item,'id','typeName')).join(',')}}-->
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="申请方向">
          {{caseDetailFoemData.appFromto}}
        </el-form-item>

      </el-row>
      <el-row>
        <el-form-item label="案件文号">
          {{caseDetailFoemData.agentNum}}
        </el-form-item>
        <el-form-item label="案件等级">
          <span v-if="caseDetailFoemData.caseLevel==1">普通</span>
          <span v-if="caseDetailFoemData.caseLevel==2">重要</span>
        </el-form-item>
      </el-row>
<!--      <el-row>-->
<!--        <el-form-item class="postInfo-container-item" label="工时类型:">-->
<!--          <span v-if="caseDetailFoemData.hrType == 1">记录工时</span>-->
<!--          <span v-if="caseDetailFoemData.hrType == 2">折算工时</span>-->
<!--        </el-form-item>-->
<!--      </el-row>-->
      <el-row>
        <el-form-item label="案件名称">
          {{caseDetailFoemData.caseName}}
        </el-form-item>
        <el-form-item label="案件名称（英文）">
          {{caseDetailFoemData.caseEnName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="基本案情介绍">
          {{caseDetailFoemData.caseIntroduce}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="报价:">
          {{caseDetailFoemData.caseOffer?caseDetailFoemData.caseOffer:'0'}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="备注:">
          {{caseDetailFoemData.memo}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="客户名称:">
          {{caseDetailFoemData.custName}}
          <div class="" style="display: inline-block;color: #409EFF;cursor: pointer;">
            <span @click="customerView">查看</span>
          </div>
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="客户文号:">
          {{caseDetailFoemData.custRefno}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="客户联系人:">
          {{transformation(selectData.customerContacts,caseDetailFoemData.custConId,'custContactId','name')}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="抄送人:">
          {{caseDetailFoemData.lawsuitCaseCcArray.map(item=>transformation(selectData.customerContacts,item,'custContactId','name')).join(',')}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="账单联系人:">
          {{caseDetailFoemData.billCustContactName}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="账单地址:">
          {{caseDetailFoemData.billAddre}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="折扣率:">
          {{caseDetailFoemData.discount}}
        </el-form-item>

      </el-row>

      <el-row>
        <el-form-item class="postInfo-container-item" label="权利授权号:">
          {{caseDetailFoemData.droitNumber}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="权利名称:">
          {{caseDetailFoemData.rightName}}
        </el-form-item>
      </el-row>
      <el-row class="">
        <el-form-item class="postInfo-container-item" label="权利类型:">
          {{transformation(selectDataByClass['1020'],caseDetailFoemData.rightType,'id','typeName')}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="权利所属:">
          {{caseDetailFoemData.rightBelongType}}
        </el-form-item>
      </el-row>
      <el-row class="fullRow">

        <el-form-item class="postInfo-container-item" label="申请人:">

          {{caseDetailFoemData.lawsuitApplicantArray.map(item=>transformation(selectData.appList,item,'appId','applicantName')).join(',')}}
        </el-form-item>
      </el-row>
      <el-row class="fullRow">
        <el-form-item class="postInfo-container-item" label="侵权人:">
          <template>
            <el-table size="mini" :data="caseDetailFoemData.lawsuitConflicterList" border fit empty-text="暂无数据"
                      highlight-current-row current-row-key style="width: 100%;">
              <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
              <el-table-column label="目标名称" align="left" width>
                <template slot-scope="scope">
                  {{transformation(selectData.liyiarr,scope.row.conId,'conId','fullname')}}
                </template>
              </el-table-column>
              <el-table-column label="目标性质" align="left" width>
                <template slot-scope="scope">
                  {{scope.row.conNature}}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所">
          {{caseDetailFoemData.agencyCustName}}
        </el-form-item>
        <el-form-item label="涉及国家">
          {{caseDetailFoemData.appState}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所联系人">
          {{caseDetailFoemData.agencyCustContactName}}
        </el-form-item>
        <el-form-item label="外方代理所地址">
          {{caseDetailFoemData.agencyCustAddrName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所文号">
          {{caseDetailFoemData.foreignAgentNum}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所要求">
          {{caseDetailFoemData.agencyCustReq}}
        </el-form-item>
      </el-row>
    </template>

    <template v-if="taskType==5">


      <el-row>
        <el-form-item label="案件类型">
          {{caseDetailFoemData.caseType}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="申请方向">
          {{caseDetailFoemData.appFromto}}
        </el-form-item>

      </el-row>


      <el-row>
        <el-form-item label="案件文号">
          {{caseDetailFoemData.agentNum}}
        </el-form-item>
        <el-form-item label="案件等级">
          <span v-if="caseDetailFoemData.caseLevel==1">普通</span>
          <span v-if="caseDetailFoemData.caseLevel==2">重要</span>
        </el-form-item>
      </el-row>
<!--      <el-row>-->
<!--        <el-form-item class="postInfo-container-item" label="工时类型:">-->
<!--          <span v-if="caseDetailFoemData.hrType == 1">记录工时</span>-->
<!--          <span v-if="caseDetailFoemData.hrType == 2">折算工时</span>-->
<!--        </el-form-item>-->
<!--      </el-row>-->

      <el-row>
        <el-form-item label="案件名称">
          {{caseDetailFoemData.caseName}}
        </el-form-item>
        <el-form-item label="案件名称（英文）">
          {{caseDetailFoemData.caseEnName}}
        </el-form-item>
      </el-row>

      <el-row class="fullRow">
        {{caseDetailFoemData.memo}}
      </el-row>


      <el-row>
        <el-form-item class="postInfo-container-item" label="客户名称:">
          {{caseDetailFoemData.custName}}
          <div class="" style="display: inline-block;color: #409EFF;cursor: pointer;">
            <span @click="customerView">查看</span>
          </div>
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="客户文号:">
          {{caseDetailFoemData.custRefno}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="客户联系人:">
          {{transformation(selectData.customerContacts,caseDetailFoemData.custConId,'custContactId','name')}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="抄送人:">
          {{caseDetailFoemData.lawsuitCaseCcArray.map(item=>transformation(selectData.customerContacts,item,'custContactId','name')).join(',')}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="账单联系人:">
          {{caseDetailFoemData.billCustContactName}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="账单地址:">
          {{caseDetailFoemData.billAddre}}
        </el-form-item>
      </el-row>
      <el-row class="fullRow">
        <el-form-item class="postInfo-container-item" label="折扣率:">
          {{caseDetailFoemData.discount}}
        </el-form-item>

      </el-row>


      <el-row>


        <el-form-item class="postInfo-container-item" label="域名类型:">
          {{transformation(selectDataByClass['1030'],caseDetailFoemData.rightType,'id','typeName')}}
        </el-form-item>

        <el-form-item class="postInfo-container-item  uploader-custfile" label="域名名称:" prop="">
          {{caseDetailFoemData.rightName}}
        </el-form-item>


      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="申请人:">
          {{transformation(selectData.appList,caseDetailFoemData.appId,'appId','applicantName')}}
          <!--                          {{caseDetailFoemData.lawsuitApplicantArray.map(item=>transformation(selectData.appList,item,'appId','applicantName')).join(',')}}-->
        </el-form-item>

      </el-row>
      <el-row>
        <el-form-item label="外方代理所">
          {{caseDetailFoemData.agencyCustName}}
        </el-form-item>
        <el-form-item label="涉及国家">
          {{caseDetailFoemData.appState}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所联系人">
          {{caseDetailFoemData.agencyCustContactName}}
        </el-form-item>
        <el-form-item label="外方代理所地址">
          {{caseDetailFoemData.agencyCustAddrName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所文号">
          {{caseDetailFoemData.foreignAgentNum}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所要求">
          {{caseDetailFoemData.agencyCustReq}}
        </el-form-item>
      </el-row>

    </template>
    <template v-if="taskType==6">

      <el-row class="fullRow">
        <el-form-item label="案件类型">
          {{caseDetailFoemData.caseType}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="代理机构:">
          {{caseDetailFoemData.whdAgencyName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="申请方向:">
          {{caseDetailFoemData.appFromto}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="交案账号:">
          {{caseDetailFoemData.submissionAccount}}
        </el-form-item>
      </el-row>

      <el-row>

        <el-form-item class="postInfo-container-item" label="案件文号:">
          {{caseDetailFoemData.agentNum}}
        </el-form-item>


        <el-form-item label="案件等级">
          <span v-if="caseDetailFoemData.caseLevel==1">普通</span>
          <span v-if="caseDetailFoemData.caseLevel==2">重要</span>
        </el-form-item>
      </el-row>
<!--      <el-row>-->
<!--        <el-form-item class="postInfo-container-item" label="工时类型:">-->
<!--          <span v-if="caseDetailFoemData.hrType == 1">记录工时</span>-->
<!--          <span v-if="caseDetailFoemData.hrType == 2">折算工时</span>-->
<!--        </el-form-item>-->
<!--      </el-row>-->
      <el-row class="">

        <el-form-item class="postInfo-container-item" label="案件名称:" prop="caseName">
          {{caseDetailFoemData.caseName}}
        </el-form-item>

        <el-form-item class="postInfo-container-item" label="案件名称(英文):">
          {{caseDetailFoemData.caseEnName}}
        </el-form-item>

      </el-row>
      <!--                          <el-row class="">-->
      <!--                            <el-col :span="12">-->
      <!--                              <el-form-item class="postInfo-container-item" label="前案案件类型:">-->
      <!--                                <template>-->
      <!--                                  <el-select clearable default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.parentCaseType">-->
      <!--                                    <el-option :key="key" :label="item" :value="item" v-for="(item,key) in ['注册驳回复审','国际注册驳回复审','撤销商标复审','不予注册复审','无效宣告','参加不予注册复审','撤销复审答辩','无效答辩']" />-->
      <!--                                  </el-select>-->
      <!--                                </template>-->
      <!--                              </el-form-item>-->
      <!--                            </el-col>-->
      <!--                            <el-col :span="12">-->
      <!--                              <el-form-item class="postInfo-container-item" label="前案官文收文日期:" :prop="caseDetailFoemData.agentPartyArray.filter(item=>item.position==1100).length?'parentCaseRecvDate':''">-->
      <!--                                <el-date-picker v-model="caseDetailFoemData.parentCaseRecvDate" type="date" value-format="yyyy-MM-dd"></el-date-picker>-->
      <!--                              </el-form-item>-->
      <!--                            </el-col>-->
      <!--                          </el-row>-->


      <el-row class="fullRow">
        <el-form-item class="postInfo-container-item" label="备注:">
          {{caseDetailFoemData.memo}}
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item class="postInfo-container-item" label="客户名称:">
          {{caseDetailFoemData.custName}}
          <div class="" style="display: inline-block;color: #409EFF;cursor: pointer;">
            <span @click="customerView">查看</span>
          </div>
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="客户文号:">
          {{caseDetailFoemData.custRefno}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="客户联系人:">
          {{transformation(selectData.customerContacts,caseDetailFoemData.custConId,'custContactId','name')}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="抄送人:">
          {{caseDetailFoemData.lawsuitCaseCcArray.map(item=>transformation(selectData.customerContacts,item,'custContactId','name')).join(',')}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="账单联系人:">
          {{caseDetailFoemData.billCustContactName}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="账单地址:">
          {{caseDetailFoemData.billAddre}}
        </el-form-item>
      </el-row>
      <el-row class="fullRow">

        <el-form-item class="postInfo-container-item" label="折扣率:">
          {{caseDetailFoemData.discount}}
        </el-form-item>

      </el-row>

      <el-row class="">
        <el-form-item class="postInfo-container-item" label="著作权类型:">
          {{transformation(selectDataByClass['1031'],caseDetailFoemData.rightBelongType,'id','typeName')}}
        </el-form-item>
        <el-form-item class="postInfo-container-item  uploader-custfile" label="著作权名称:" prop="">
          {{caseDetailFoemData.rightName}}
        </el-form-item>
      </el-row>
      <el-row class="">
        <el-form-item class="postInfo-container-item" label="著作权样本:">
          <p>
            <a style="color: #409EFF" target="_blank" :href="`ipdoc${getAddressAndName('1075')[0] && getAddressAndName('1075')[0].address}`">{{getAddressAndName('1075')[0] && getAddressAndName('1075')[0].name}}</a>
          </p>
        </el-form-item>
      </el-row>
      <el-row class="" v-if="caseDetailFoemData.droitNumber">
        <el-form-item class="postInfo-container-item" label="登记号:">
          {{caseDetailFoemData.droitNumber}}
        </el-form-item>
      </el-row>

      <el-row class="">
        <el-form-item class="postInfo-container-item" label="申请人中文名称:">
          {{caseDetailFoemData.appCnName}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="申请人英文名称:">
          {{caseDetailFoemData.appEnName}}
        </el-form-item>
      </el-row>
      <el-row class="">
        <el-form-item label="申请人中文地址:" class="postInfo-container-item">
          {{caseDetailFoemData.appCnAddr}}
        </el-form-item>
        <el-form-item label="申请人英文地址:" prop="appCountry" class="postInfo-container-item">
            {{caseDetailFoemData.appEnAddr}}
        </el-form-item>
      </el-row>
      <el-row class="fullRow">
        <el-form-item label="国籍:" prop="appCountry" class="postInfo-container-item">
            {{caseDetailFoemData.appCountry}}
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="外方代理所">
          {{caseDetailFoemData.agencyCustName}}
        </el-form-item>
        <el-form-item label="涉及国家">
          {{caseDetailFoemData.appState}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所联系人">
          {{caseDetailFoemData.agencyCustContactName}}
        </el-form-item>
        <el-form-item label="外方代理所地址">
          {{caseDetailFoemData.agencyCustAddrName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所文号">
          {{caseDetailFoemData.foreignAgentNum}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所要求">
          {{caseDetailFoemData.agencyCustReq}}
        </el-form-item>
      </el-row>

    </template>
    <template v-if="taskType==7">
      <el-row>
        <el-form-item label="案件类型">
          {{caseDetailFoemData.caseType}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="申请方向:">
          {{caseDetailFoemData.appFromto}}
        </el-form-item>
      </el-row>

      <el-row class="">
        <el-form-item class="postInfo-container-item" label="案件文号:">
          {{caseDetailFoemData.agentNum}}
        </el-form-item>

        <el-form-item label="案件等级">
          <span v-if="caseDetailFoemData.caseLevel==1">普通</span>
          <span v-if="caseDetailFoemData.caseLevel==2">重要</span>
        </el-form-item>

      </el-row>
<!--      <el-row>-->
<!--        <el-form-item class="postInfo-container-item" label="工时类型:">-->
<!--          <span v-if="caseDetailFoemData.hrType == 1">记录工时</span>-->
<!--          <span v-if="caseDetailFoemData.hrType == 2">折算工时</span>-->
<!--        </el-form-item>-->
<!--      </el-row>-->

      <el-row class="">

        <el-form-item class="postInfo-container-item" label="案件名称:">
          {{caseDetailFoemData.caseName}}
        </el-form-item>

        <el-form-item class="postInfo-container-item" label="案件名称(英文):">
          {{caseDetailFoemData.caseEnName}}
        </el-form-item>
      </el-row>

      <el-row class="fullRow">
        <el-form-item class="postInfo-container-item" label="基本案情介绍:">
          {{caseDetailFoemData.caseIntroduce}}
        </el-form-item>
      </el-row>

      <el-row class="fullRow">

        <el-form-item class="postInfo-container-item" label="备注:">
          {{caseDetailFoemData.memo}}
        </el-form-item>

      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="客户名称:">
          {{caseDetailFoemData.custName}}
          <div class="" style="display: inline-block;color: #409EFF;cursor: pointer;">
            <span @click="customerView">查看</span>
          </div>
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="客户文号:">
          {{caseDetailFoemData.custRefno}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="客户联系人:">
          {{transformation(selectData.customerContacts,caseDetailFoemData.custConId,'custContactId','name')}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="抄送人:">
          {{caseDetailFoemData.lawsuitCaseCcArray.map(item=>transformation(selectData.customerContacts,item,'custContactId','name')).join(',')}}
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item class="postInfo-container-item" label="账单联系人:">
          {{caseDetailFoemData.billCustContactName}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="账单地址:">
          {{caseDetailFoemData.billAddre}}
        </el-form-item>
      </el-row>
      <el-row class="fullRow">
        <el-form-item class="postInfo-container-item" label="折扣率:">
          {{caseDetailFoemData.discount}}
        </el-form-item>
      </el-row>


      <el-row class="fullRow">

        <el-form-item class="postInfo-container-item" label="申请人:">

          {{caseDetailFoemData.lawsuitApplicantArray.map(item=>transformation(selectData.appList,item,'appId','applicantName')).join(',')}}

        </el-form-item>

      </el-row>

      <el-row>
        <el-form-item label="外方代理所">
          {{caseDetailFoemData.agencyCustName}}
        </el-form-item>
        <el-form-item label="涉及国家">
          {{caseDetailFoemData.appState}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所联系人">
          {{caseDetailFoemData.agencyCustContactName}}
        </el-form-item>
        <el-form-item label="外方代理所地址">
          {{caseDetailFoemData.agencyCustAddrName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所文号">
          {{caseDetailFoemData.foreignAgentNum}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所要求">
          {{caseDetailFoemData.agencyCustReq}}
        </el-form-item>
      </el-row>

    </template>
  </el-form>
</template>

<script>
  import {
    lawsuitUrl,
    saveCaseInfoUrl,
    queryCountry,
    queryCustomerContactByCustIdUrl,
    queryAppInfoUrl,
    queryAppContactUrl,
    queryCustomerReqUrl,
    queryUserNames,
    queryListByUrl,
    queryGoodsPlanUrl,
    queryGoodsUrl,
    oneKeyZipUrl,
    heighCreditUrl,
    queryCustomerList,
    queryCustomerUrl,
    checkForbidContentUrl,
    checkSameTmUrl,
    queryGoodsByAgentNumUrl,
    cradeJoinAppUrl,
    delJoinAppUrl,
    delCaseMaterialUrl,
    queryCountryCaseUrl,
    querycustSelectClass,
    queryConflicterListUrl,
    addConflicterUrl,
    modifyjoinappUrl,
    queryAppAddrByAppIdUrl,
    queryCustomerContactByCustContactIdUrl,
    queryMaterialTypeUrl,
    queryOtherCustomerListUrl,
  } from '@/api/caseDetail'
  import Goods from '../Goods'
  import pagination from "@/components/Pagination";
  import {searchTmUrl, tmdetailUrl, tmdetailUrl3} from '@/api/customerList'
  import {queryApplicantByIdList} from '@/api/caseList'

  export default {
    props: {
      caseDetailFoemData: {},
      taskType: {}
    },
    components: {
      pagination, Goods
    },
    data() {
      return {
        tyimage: '',
        fileName: {},
        sjList: [{label: '无', value: 1368}, {label: '一审', value: 1071}, {label: '二审', value: 1072}, {
          label: '再审',
          value: 1073
        }, {label: '重申', value: 1074}, {label: '执行', value: 1075}],
        goodsDetailData: {
          goods: []
        },
        selectDataByClass: [],
        selectData: {
          natureOfWorkList: [],
          appaddr: [],
          pJtypelist: [],
          liyiarr: [],
          apptypelist: [],
          customerContactswf: [],
          goodsznselect: [],
          goodszn: {},
          country: [],
          customerContacts: [],
          billContacts: [],
          customerMailAdds: [],
          apps: [],
          billAdds: [],
          queryAppContact: [],
          workgroup: [],
          username: [],
          rolename: [],
          goodsPlanselect: [],
          hzLists: [],
          customerAddrs: [],
          casecount: [],

        },
        goodslistPageDataw: {
          total: 0,
          pageNo: 1,
          pageSize: 10
        },
      }
    },
    name: "protectCaseDetail",
    created() {
      this.getCreatData()
    },
    methods: {
      getAddressAndName(materialTypeId) {
        if (this.caseDetailFoemData.materials) {
          return this.caseDetailFoemData.materials.filter(
            item => item.materialTypeId == materialTypeId
          )
        } else {
          return []
        }
      },
      customerView() {
        if (!this.caseDetailFoemData.custId) return;
        window.open(`/#/workbench/customer_management/cust_view/${this.caseDetailFoemData.custId}`)
      },
      getCreatData() {
        if (this.caseDetailFoemData.droitNumber) {
          this.searchTmUrl(this.caseDetailFoemData.droitNumber)
        }
        if (this.caseDetailFoemData.lawsuitApplicantArray.length) {
          queryApplicantByIdList({appIdArray: this.caseDetailFoemData.lawsuitApplicantArray}).then(res => {
            this.selectData.appList = res.data
          })
        }
        if (this.caseDetailFoemData.appId) {
          queryApplicantByIdList({appIdArray: this.caseDetailFoemData.appId}).then(res => {
            this.selectData.appList = res.data
          })
        }
        this.caseDetailFoemData.custId && queryAppInfoUrl({custId: this.caseDetailFoemData.custId}).then(
          response => {
            this.selectData.apps = response.data;
          }
        );
        let conarrs = [...this.caseDetailFoemData.adversaryArray, ...this.caseDetailFoemData.otherPartyArray, ...this.caseDetailFoemData.lawsuitConflicterList];
        conarrs = conarrs.filter(itm => !!itm.nameId || !!itm.conId).map(res => res.nameId || res.conId)
        console.log(conarrs, 'conarrs');
        if (conarrs && conarrs.length > 0) {
          queryConflicterListUrl({conIdArray: conarrs}).then(res => {
            this.selectData.liyiarr = res.data
          })
        }

        // this.initfilelist()
        queryMaterialTypeUrl().then(res => {
          this.fileName = res.data
        })
        if (this.caseDetailFoemData.agencyCustId) {
          queryCustomerUrl({
            customerID: this.caseDetailFoemData.agencyCustId
          }).then(res => {
            this.selectData.customerContactswf = res.data.customerContacts
            this.selectData.customerAddrs = res.data.customerAddrs
          })
        }

        if (this.caseDetailFoemData.priorityType == '0') {
          this.ifpriority = '0'
        } else {
          this.ifpriority = '1'
        }
        querycustSelectClass({classId: '1042,1134,1135,1027,1029,1136,1031,1020'}).then(response => {
          if (response.success) {
            this.selectData.apptypelist = response.data['1042']
            this.selectData.natureOfWorkList = response.data['1136']
            this.selectDataByClass = response.data
          } else {
            this.$message.error(response.message)
          }
        })

        queryCountryCaseUrl()
          .then(response => {
            this.selectData.casecount = response.data
          })
          .catch(err => {
            console.log(err)
          })

        queryCountry()
          .then(response => {
            this.selectData.country = response.data
          })
          .catch(err => {
            console.log(err)
          })

        queryOtherCustomerListUrl({isOfficial: '1'})
          .then(response => {
            this.selectData.hzLists = response.data
          })
          .catch(err => {
            console.log(err)
          })


        this.caseDetailFoemData.custId && queryCustomerContactByCustIdUrl({
          caseTypeId: this.caseDetailFoemData.caseTypeId,
          custId: this.caseDetailFoemData.custId
        })
          .then(response => {
            // this.selectData.country = response.data;
            this.selectData.customerContacts = response.data.customerContacts
            this.selectData.billContacts = response.data.BillContacts
          })
          .catch(err => {
            console.log(err)
          })
        queryCustomerContactByCustContactIdUrl({
          custContactId: this.caseDetailFoemData.custConId
        }).then(res => {
          this.selectData.customerMailAdds = res.data.customerMailAdds
          this.selectData.billAdds = res.data.BillAdds
          this.selectData.billAdds.forEach(item => {
            if (!item.addressCn) {
              item.addressCn = item.addressEn
            }
          })
        })
      },
      getgoodsListw(goods) {
        console.log(goods);
        this.goodslistPageDataw.total = goods.length;
        var offset =
          (this.goodslistPageDataw.pageNo - 1) * this.goodslistPageDataw.pageSize;
        this.goodsDetailData.goods =
          offset + this.goodslistPageDataw.pageSize >= goods.length
            ? goods.slice(offset, goods.length)
            : goods.slice(offset, offset + this.goodslistPageDataw.pageSize);
      },
      searchTmUrl(val) {
        searchTmUrl({regNumbers: val, trans: 20, pageSize: 100, pageNo: 1}).then(res => {
          if (!res.data || !res.data.length) {
            return;
          }
          this.goodsDetailData.appCnName = res.data[0].applicantName;
          this.goodsDetailData.tmName = res.data[0].tmName;
          this.goodsDetailData.regNumber = res.data[0].regNumber;
          this.goodsDetailData.validStartDate = res.data[0].validStartDate;
          this.goodsDetailData.validEndDate = res.data[0].validEndDate;
          this.goodsDetailData.regDate = res.data[0].regNoticeDate;
          this.goodsDetailData.approvalDate = res.data[0].approvalDate;
          this.goodsDetailData.approvalNumber = res.data[0].approvalNumber;
          // this.caseDetailFoemData.appDate = res[0].data.appDate;
          this.goodsDetailData.tmType =
            res.data[0].classify === "证明"
              ? "3"
              : res.data[0].classify === "集体"
              ? "2"
              : "1";
          this.goodsDetailData.imageFile =
            "/tmFile" + res.data[0].imgFilePath;
          this.tyimage = "tmFile" + res.data[0].imgFilePath;
          this.goodsDetailData.ifSolidTm =
            res.data[0].ifSolidTm == "是" ? "1" : "0";
          this.goodsDetailData.assignColor = res.data[0].colorDesc
            ? res.data[0].colorDesc
            : false;
          this.goodsDetailData.tmVoice = res.data[0].tmForm
            ? res.data[0].tmForm === "文字"
              ? "0"
              : "1"
            : "0";
          this.goodsDetailData.colorSign = "0";
          // this.caseDetailFoemData.tmIdList = info.map(item => item.tmId);
          if (res.data[0].trademarkCategories.length) {
            this.goodsDetailData.goods = this.$commonUtils.getLanglist(
              res.data.map(item => item.trademarkCategories).filter(item => item)
            ).map(item => ({
              goodClass: item.tmType,
              goodEnName: item.enName,
              goodName: item.name,
              id: item.id,
              similarGroup: item.tmGroup
            }));
            // this.getgoodsListw(this.goodsDetailData.goods)
            this.goodsDetailData.goodClasses = [
              ...new Set(
                this.goodsDetailData.goods.map(item => item.goodClass)
              )
            ].join(";");
          } else {
            this.goodsDetailData.goodClasses = res.data[0].tmType
          }

          // tmdetailUrl3({tmId:res.data[0].tmId}).then(res=>{
          //
          // })
        });
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
    }
  }
</script>

<style lang="scss" scoped>
  .pad0 /deep/ .el-form-item__content {
    padding-left: 0 !important;
  }

  .el-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .el-row {
      // min-height: 20px;
      width: 100%;
      display: flex;
      line-height: 30px;

      .el-form-item {
        width: 100%;
        display: flex;
        border: 1px solid #ebeef5;
        border-bottom: 0;
        margin-bottom: 0;

        /deep/ .el-form-item__label {
          background: #f5f7fa;
          line-height: 30px;
        }

        /deep/ .el-form-item__content {
          line-height: 30px;
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
        }
      }

      .small-el-form-item-prev:before {
        content: "";
        width: 50%;
        height: 1px;
        background: #ebeef5;
        position: absolute;
        bottom: -1px;
        right: 0;
        z-index: 1;
      }

      .small-el-form-item {
        position: relative;
        width: 50%;

        /deep/ .el-form-item__content {
          flex: 1;

          .pad20 {
            padding-left: 20px;
          }
        }
      }
    }

    .el-row:nth-last-child(1) {
      .el-form-item {
        border: 1px solid #ebeef5;
      }
    }
  }
</style>
