<template>
  <div class="">
    <div class="patent-container">
      <el-form label-width="160px" class="form-container" :model="caseDetailFormData" :rules="rules">
        <!--      案件基本信息-->
        <el-row class="border-top">
          <el-col :span="24">
            <el-form-item v-if="$route.query.copy === 'true'" label="案件类型" prop="caseType">
              <el-select default-first-option :clearable='true' placeholder="请选择"
                         v-model="caseDetailFormData.caseTypeId" filterable>
                <el-option :label="item.caseType" :value="item.caseTypeId"
                           v-for="item in $store.getters.caseTypeList.find(item => item.caseTypeId == 4).childrens"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-else label="案件类型:">
              {{caseDetailFormData.caseType}}
              <!--              <el-input size="small"></el-input>-->
            </el-form-item>
            <el-form-item label="代理机构:" class="postInfo-container-item">
                <template>
                  <el-select default-first-option :clearable='true'
                              placeholder="请选择" v-model="caseDetailFormData.whdAgencyName">
                    <el-option label="万慧达律所" value="万慧达律所"></el-option>
                    <el-option label="汉智嘉成" value="汉智嘉成" />
                  </el-select>
                </template>
              </el-form-item>
          </el-col>
        </el-row>
        <!--      案件基本信息-->
        <div>
          <el-row>
            <span class="header-info" id="info-title">基本信息</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="12">
              <el-form-item label="申请方向:" prop="appFromto">
                <template>
                  <el-radio-group v-model="caseDetailFormData.appFromto" style="margin-left: 10px">
                    <el-radio label='外-内'></el-radio>
                    <el-radio label='内-内'></el-radio>
                    <el-radio label='内-外'></el-radio>
                    <el-radio label='外-外'></el-radio>
                    <el-radio label='台-内'></el-radio>
                  </el-radio-group>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="caseType != '翻译'">
              <el-form-item label="主体法律性质:">
                <el-radio-group v-model="caseDetailFormData.legalNature" style="margin-left: 10px">
                  <el-radio label='0'>自然人</el-radio>
                  <el-radio label='1'>法人</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="caseType != '翻译' ? 6 : 12">
              <el-form-item label="技术领域:">
                <el-select default-first-option :clearable='true' placeholder="请选择"
                           v-model="caseDetailFormData.techField"
                           filterable>
                  <el-option :label="item.typeName" :value="item.id" v-for="item in techFieldList"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="专利类型:" prop="patentType">
                <el-select default-first-option :clearable='true' placeholder="请选择"
                           v-model="caseDetailFormData.patentType" filterable>
                  <el-option :label="item.typeName" :value="item.id" v-for="item in patentTypeList"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="caseType == '年费代缴'">
              <el-form-item label="本案为中间转案:">
                <el-radio-group v-model="caseDetailFormData.istrans" style="margin-left: 10px">
                  <el-radio :label='1'>是</el-radio>
                  <el-radio :label='0'>否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="caseType == '年费代缴' ? 6 : 12">
              <el-form-item label="是否代交:">
                <el-radio-group v-model="caseDetailFormData.daijiao" style="margin-left: 10px">
                  <el-radio label='Y'>是</el-radio>
                  <el-radio label='N'>否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType != '香港登记'">
            <el-col :span="24">
              <el-form-item label="案件文号:">
                <el-input type="text" size="small" v-model="caseDetailFormData.agentNum" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType == '香港登记'">
            <el-col :span="12">
              <el-form-item label="案件文号:">
                <el-input type="text" size="small" v-model="caseDetailFormData.agentNum" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="caseDetailFormData.twoapp == 1 ? 6 : 12">
              <el-form-item label="一带二申请:">
                <el-radio-group v-model="caseDetailFormData.twoapp" style="margin-left: 10px">
                  <el-radio :label='1'>是</el-radio>
                  <el-radio :label='0'>否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col class="special-width" v-show="caseDetailFormData.twoapp == 1" :span="6">
              <el-form-item label="另一件案号:">
                <el-select
                  v-model="caseDetailFormData.anotherApp"
                  ref="custSelect"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="queryCaseAgentNumList"
                >
                  <el-option
                    v-for="item in anotherCaseNumList"
                    :key="item.agentNum"
                    :label="item.agentNum"
                    :value="item.agentNum"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!--          <el-row v-if="caseType == '澳门登记' || caseType == '欧洲专利国家生效'">-->
          <!--            <el-col :span="12">-->
          <!--              <el-form-item label="第一次资助:">-->
          <!--                <el-radio-group v-model="caseDetailFormData.zizhu1" style="margin-left: 10px">-->
          <!--                  <el-radio :label='1'>是</el-radio>-->
          <!--                  <el-radio :label='0'>否</el-radio>-->
          <!--                </el-radio-group>-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--            <el-col :span="12">-->
          <!--              <el-form-item label="第二次资助:">-->
          <!--                <el-radio-group v-model="caseDetailFormData.zizhu2" style="margin-left: 10px">-->
          <!--                  <el-radio :label='1'>是</el-radio>-->
          <!--                  <el-radio :label='0'>否</el-radio>-->
          <!--                </el-radio-group>-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
          <el-row>
            <el-col :span="24">
              <el-form-item label="技术交底名称:">
                <el-input type="text" size="small" v-model="caseDetailFormData.technicalDisclosure"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="patentType == 1298 ? 12 : 24">
              <el-form-item label="案件中文名称:" prop="caseCnName">
                <div style="display: flex;align-items: center">
                  <el-input type="text" size="small" v-model="caseDetailFormData.caseCnName"></el-input>
                </div>

              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="patentType == 1298">
              <el-form-item label="上传最能标明设计要点的图片或照片:">
                <el-upload
                  drag
                  style="width: 145px;height: 145px"
                  ref="uploadFile"
                  name="attachFile"
                  :data="imageData"
                  class="avatar-uploader fl-ac-jc"
                  :action="creatematerialUrl"
                  :show-file-list="false"
                  :auto-upload="true"
                  :on-success="successBack"
                  :before-upload="beforeupload">
                  <img v-if="imageUrl" :src="`ipdoc/${imageUrl}`" class="avatar"
                       style="max-width: 100%;max-height: 100%;object-fit: contain">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="案件英文名称:">
                <el-input type="text" size="small" v-model="caseDetailFormData.caseEnName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="案件日文名称:">
                <el-input type="text" size="small" v-model="caseDetailFormData.caseJpName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="caseDetailFormData.caseType == '无效'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="专利号:">
                  <el-input
                    v-if="caseDetailFormData.appFromto == '外-内' || caseDetailFormData.appFromto == '内-内' || caseDetailFormData.appFromto == '台-内'"
                    type="text" size="small"
                    v-model="caseDetailFormData.appNumberStr" @change="changeAppNumber"></el-input>
                  <el-input v-else type="text" size="small"
                            v-model="caseDetailFormData.appNumber"></el-input>
                  <!--                  <el-input type="text" size="small" v-model="caseDetailFormData.patentNumber"></el-input>-->
                </el-form-item>
              </el-col>
              <!--              <el-col :span="6">-->
              <!--                <el-form-item label="优先权日:">-->
              <!--                  {{caseDetailFormData.priorityAppDate}}-->
              <!--&lt;!&ndash;                  <el-date-picker&ndash;&gt;-->
              <!--&lt;!&ndash;                    v-model="caseDetailFormData.priorityAppDate"&ndash;&gt;-->
              <!--&lt;!&ndash;                    type="date"&ndash;&gt;-->
              <!--&lt;!&ndash;                    placeholder="选择日期"&ndash;&gt;-->
              <!--&lt;!&ndash;                    value-format="yyyy-MM-dd">&ndash;&gt;-->
              <!--&lt;!&ndash;                  </el-date-picker>&ndash;&gt;-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <el-col :span="12">
                <el-form-item label="申请日:">
                  <el-date-picker
                    v-model="caseDetailFormData.appDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="授权日:">
                  <el-date-picker
                    v-model="caseDetailFormData.certificateDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="官方案件编号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.patentNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="费减比例:" prop="feeReduce">
                  <el-select v-model="caseDetailFormData.feeReduce" @change="feeReduceChange" filterable clearable
                             placeholder="请选择">
                    <el-option
                      v-for="item in ['0.70',' 0.85']"
                      :key="item"
                      :label="item"
                      :value="item">
                      <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                    </el-option>
                  </el-select>
                  <!--                  <el-input type="text" size="small"-->
                  <!--                            @change="feeReduceChange"-->
                  <!--                            v-model="caseDetailFormData.feeReduce"></el-input>-->
                </el-form-item>
              </el-col>
            </el-row>
          </div>

        </div>
        <!--      客户-->
        <div>
          <el-row>
            <span class="header-info" id="cust-title">客户</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="12">
              <el-form-item label="客户:">
                <!--              <el-input type="text" size="small" v-model="caseDetailFormData.custId"></el-input>-->
                <el-select
                  v-model="caseDetailFormData.custId"
                  ref="custSelect"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="queryCustomerNameId"
                  @change="selectCustChange"

                >
                  <el-option
                    v-for="item in queryCustomerNameIdList"
                    :key="item.custId"
                    :label="item.fullname"
                    :value="item.custId"
                  >
                  </el-option>
                </el-select>
                <div class="" style="display: inline-block;color: #409EFF;cursor: pointer;">
                  <span @click="customerView">查看</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="来自国家:">
                <el-select default-first-option :clearable='true' placeholder="请选择" v-model="caseDetailFormData.country"
                           filterable>
                  <el-option v-for="(item,key)  in countryList" :key="key" :label="item.countryCn"
                             :value="item.countryCn">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="折扣:">
                <el-input type="number" min="1" max="100" size="small"
                          v-model="caseDetailFormData.discount"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="" v-if="['内-内'].includes(caseDetailFormData.appFromto) && (caseType == '普通新申请' || caseType == '年费代缴' || caseType == '无效' || caseType == 'PCT国家阶段') || ['内-外'].includes(caseDetailFormData.appFromto) && (caseType === 'PCT国际申请')">
              <el-col :span="12">
                <el-form-item label="收据抬头:">
                  <el-select default-first-option :clearable='true' placeholder="请选择"
                             v-model="caseDetailFormData.gfReceiptRise" @change="onReceiptRiseChange"
                             filterable>
                    <el-option v-for="(item,key) in invoiceTitleList" :key="key"
                               :label="item.fullname + '(' + item.creditCode + ')'"
                               :value="item.fullname + '(' + item.creditCode + ')'">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="统一社会信用代码:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.gfReceiptRiseNumber"></el-input>
                </el-form-item>
              </el-col>

            </el-row>
          <el-row class="">
            <el-col :span="12">
              <el-form-item label="客户联系人:">
                <el-select default-first-option :clearable='true' placeholder="请选择"
                           v-model="caseDetailFormData.custConId" @change="$emit('changeCust', '客户')" filterable>
                  <el-option v-for="(item,key)  in customerContactsList" :key="key"
                             :label="item.name+' ( '+item.email+ ' )'"
                             :value="item.custContactId">
                  </el-option>
                </el-select>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件邮址:">
                <el-select default-first-option :clearable='true' placeholder="请选择"
                           v-model="caseDetailFormData.letterAddrId" filterable>
                  <el-option v-for="(item,key)  in customerMailAddsList" :key="key"
                             :label="(item.addressCn||'')+(item.addressEn||'')" :value="item.addrId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>


          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="抄送人:">
                <el-select multiple default-first-option :clearable='true' placeholder="请选择"
                           v-model="caseDetailFormData.patentCaseCustContactList"
                           filterable>
                  <el-option v-for="(item,key)  in customerContactsList" :key="key"
                             :label="item.name+' ( '+item.email+ ' )'"
                             :value="item.custContactId">
                  </el-option>
                </el-select>

              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="账单联系人:" class="postInfo-container-item">
                <template>
                  <el-select default-first-option :clearable='true' placeholder="请选择"
                             @change="$emit('changeCust', '账单')"
                             v-model="caseDetailFormData.billCustContactId" filterable>
                    <el-option v-for="(item,key)  in billContactsList" :key="key"
                               :label="item.name" :value="item.custContactId">
                    </el-option>
                  </el-select>

                </template>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账单邮址:">
                <el-select default-first-option :clearable='true' placeholder="请选择"
                           v-model="caseDetailFormData.billAddrId" filterable>
                  <el-option v-for="(item,key)  in billAddsList" :key="key"
                             :label="('中文: '+item.addressCn||'')+' ; '+('英文: '+item.addressEn||'')"
                             :value="item.addrId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="技术联系人:">
                <el-input type="text" size="small" v-model="caseDetailFormData.techLinkman"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户案号:">
                <el-input type="text" size="small" v-model="caseDetailFormData.custRefNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请人案号:">
                <el-input type="text" size="small" v-model="caseDetailFormData.applicantRefNo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType == '欧洲专利国家生效'">
            <el-col :span="24">
              <el-form-item label="申请人客户:">
                <!--              <el-input type="text" :autosize="{ minRows: 1, maxRows: 4}" size="small" v-model="caseDetailFormData.applicantCustId"></el-input>-->
                <el-select
                  v-model="caseDetailFormData.applicantCustId"
                  ref="custSelect"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="queryCustomerNameId"
                  @change="selectCustChange"

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
          <el-row>
            <el-col :span="24">
              <el-form-item label="个案要求:">
                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" size="small"
                          v-model="caseDetailFormData.custCommand"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row v-if="caseType == '欧洲专利国家生效' || caseType == '年费代缴'">
            <el-col :span="24">
              <el-form-item label="转出所至:">
                <el-input type="text" size="small" v-model="caseDetailFormData.alteragency"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType == '翻译'">
            <el-col :span="12">
              <el-form-item label="申请人客户:">
                <!--              <el-input type="text" :autosize="{ minRows: 1, maxRows: 4}" size="small" v-model="caseDetailFormData.applicantCustId"></el-input>-->
                <el-select
                  v-model="caseDetailFormData.applicantCustId"
                  ref="custSelect"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="queryCustomerNameId"
                  @change="selectCustChange"

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
            <el-col :span="12">
              <el-form-item label="要求返稿期限:">
                <el-date-picker
                  v-model="caseDetailFormData.cliSubmitDlDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

        </div>
        <!--      申请人-->
        <div v-if="caseType != '翻译'">
          <el-row>
            <div style="position:relative; width: 100%;">
              <span class="header-info" id="app-title"><span style="color: #F56C6C">*</span>申请人</span>
              <el-button type="primary" size="mini" style="position:absolute;bottom: 0;right: 0;"
                         @click="handlePatentApplication('add')">添加
              </el-button>
            </div>
          </el-row>
          <el-row>
            <el-table
              :data="caseDetailFormData.patentCaseApplicationList"
              border
              style="width: 100%">
              <el-table-column
                label="序号"
                width="60">
                <template slot-scope="scope">
                  <el-input size="mini" v-model="scope.row.no"
                            @change="(v)=>{changeNo(v, 'apply', scope.$index)}"></el-input>
                </template>
              </el-table-column>
              <!--                <el-table-column-->
              <!--                  prop="code"-->
              <!--                  label="编号"-->
              <!--                  width="100"-->
              <!--                >-->
              <!--                </el-table-column>-->
              <el-table-column
                prop="applicantName"
                label="申请人中文名称">
              </el-table-column>
              <el-table-column
                prop="applicantEnName"
                label="申请人英文名称">
              </el-table-column>
              <el-table-column
                prop="phone"
                label="联系电话">
              </el-table-column>
              <el-table-column
                label="总委"
                width="60"
              >
                <template slot-scope="scope">
                  {{scope.row.iszw ? '是' : '否'}}
                </template>
              </el-table-column>
              <el-table-column
                label="中文地址"
                width="300"
              >
                <template slot-scope="scope">
                  <el-select class="adress" default-first-option :clearable='true' placeholder="请选择"
                             v-model="scope.row.addrId"
                             @change="(v)=>{changeCnAddess(v, scope.row, scope.row.appAddrArray)}"
                             filterable>
                    <el-option v-for="(item,key)  in scope.row.appAddrArray" :key="key" :label="item.addressCn"
                               :disabled="item.status !== '启用'"
                               :value="item.addrId">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="addressEn"
                label="英文地址"
                key="addressEn"
                width="300"
              >
              </el-table-column>
              <el-table-column
                prop="post"
                key="post"
                width="100"
                label="邮编">
              </el-table-column>
              <el-table-column
                v-if="caseType == 'PCT国际申请'"
                prop="pctzwno"
                key="pctzwno"
                width="100"
                label="PCT总委号">
              </el-table-column>
              <el-table-column
                v-else
                prop="zwNo"
                key="zwNo"
                width="100"
                label="总委号">
              </el-table-column>
              <!--                <el-table-column-->
              <!--                  width="150"-->
              <!--                  label="第一联系人"-->
              <!--                >-->
              <!--                  <template slot-scope="scope">-->
              <!--                    <el-radio-group v-model="scope.row.isFirstAppliant" style="margin-left: 10px"-->
              <!--                                    @change="(v)=>{checkIsFirstApp(v, scope.$index)}">-->
              <!--                      <el-radio :label='1'>是</el-radio>-->
              <!--                      <el-radio :label='0'>否</el-radio>-->
              <!--                    </el-radio-group>-->
              <!--                  </template>-->
              <!--                </el-table-column>-->
              <el-table-column
                prop="beianYear"
                key="beianYear"
                width="140"
                label="费用减缴备案年度">
              </el-table-column>
              <el-table-column
                v-if="hasApplicationType"
                prop="cardNumber"
                key="cardNumber"
                width="140"
                label="证件号">
              </el-table-column>
              <el-table-column
                v-else
                prop="certCode"
                key="certCode"
                width="140"
                label="统一社会信用代码">
              </el-table-column>
              <!--                <el-table-column-->
              <!--                  prop="appType"-->
              <!--                  width="140"-->
              <!--                  label="申请人主体性质">-->
              <!--                </el-table-column>-->
              <el-table-column
                label="操作"
                width="100"
              >
                <template slot-scope="scope">
                  <div class="handle">
                    <span @click="handlePatentApplication('edit', scope.row)">修改</span>
                    <span @click="handlePatentApplication('del',{}, scope.$index)">删除</span>
                  </div>
                </template>

              </el-table-column>
            </el-table>
          </el-row>
        </div>

        <!--      委托方-->
        <div v-if="caseType == '无效'">
          <el-row>
            <span class="header-info" id="wt-title">委托方</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="24">
              <el-form-item label="委托方:" prop="patentRighter">
                <p style="display: flex;">
                  <el-checkbox style="width: 100px" :true-label="1" v-model="caseDetailFormData.disableWtr">专利权人
                  </el-checkbox>
                  <el-form-item style="border:none" prop="patentRighter">
                    <el-input size="mini" v-model="caseDetailFormData.patentRighter" class=""
                              style="flex:1"></el-input>
                  </el-form-item>
                  <!--                  <span v-if="caseDetailFormData.disableWtr == 2">{{appCnName}}</span>-->
                </p>
                <p style="display: flex;">
                  <el-checkbox style="width: 100px" :true-label="2" v-model="caseDetailFormData.disableWtr">请求人
                  </el-checkbox>
                  <el-form-item style="border:none;" prop="disableAppliant">
                    <el-input size="mini" v-model="caseDetailFormData.disableAppliant" class=""
                              style="flex:1"></el-input>
                  </el-form-item>
                </p>

              </el-form-item>
            </el-col>
            <!--            <el-col :span="12">-->
            <!--              <el-form-item label="申请人中文名称:">{{appCnName}}</el-form-item>-->
            <!--            </el-col>-->
            <!--            <el-col :span="12">-->
            <!--              <el-form-item label="请求人:">-->
            <!--                <el-input type="text" size="small" v-model="caseDetailFormData.disableAppliant"></el-input>-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
          </el-row>
          <!--          <el-row>-->
          <!--            <el-col :span="24">-->
          <!--              <el-form-item v-if="caseDetailFormData.disableWtr == 2" label="专利权人名称:">-->
          <!--                <el-input v-model="caseDetailFormData.patentRighter" size="mini"></el-input>-->
          <!--              </el-form-item>-->
          <!--              <el-form-item v-if="caseDetailFormData.disableWtr == 1" label="请求人名称:">-->
          <!--                 <el-input v-model="caseDetailFormData.disableAppliant" size="mini"></el-input>-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
        </div>

        <!--      许可人-->
        <div v-if="caseType == '许可备案'">
          <el-row>
            <span class="header-info" id="xk-title">许可人</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="12">
              <el-form-item label="许可人:">
                <el-input type="text" size="small" v-model="caseDetailFormData.patentRighter"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="许可人地址:">
                <el-input type="text" size="small" v-model="caseDetailFormData.party3"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--      发明人-->
        <div
          v-if="caseType != '顾问服务' && caseType != '无效' && caseType != '咨询' && caseType != '许可备案' && caseType != '翻译'">
          <el-row>
            <div style="position:relative; width: 100%;">
              <span class="header-info" id="inventor-title">发明人</span>
              <el-button type="primary" size="mini" style="position:absolute;bottom: 0;right: 0;"
                         @click="handlePatentInventor('add', { inventorCtitle: '',inventorEtitle: '',inventorCountry: '',inventorIdno: '',invAddressEn: '',invAddressCn: '',notOpenSign: '0'})">
                添加
              </el-button>
            </div>
          </el-row>
          <el-row>
            <el-table
              :data="caseDetailFormData.patentInventorList"
              border
              style="width: 100%">
              <el-table-column
                label="序号"
                width="60">
                <template slot-scope="scope">
                  <el-input size="mini" v-model="scope.row.no"
                            @change="(v)=>{changeNo(v, 'invent',scope.$index)}"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="inventorCtitle"
                label="中文名称">
              </el-table-column>
              <el-table-column
                prop="inventorEtitle"
                label="原文名称">
              </el-table-column>
              <el-table-column
                prop="inventorJtitle"
                label="日文名称">
              </el-table-column>
              <el-table-column
                prop="inventorIdno"
                label="证件号">
              </el-table-column>
              <el-table-column
                prop="notOpenSign"
                label="不公开标志">
                <template slot-scope="scope">
                  {{+scope.row.notOpenSign ? '是' : '否'}}
                </template>
              </el-table-column>
              <el-table-column
                prop="inventorCountryStr"
                label="国籍">
              </el-table-column>
              <el-table-column
                label="操作"
                width="120"
              >
                <template slot-scope="scope">
                  <div class="handle">
                    <span @click="handlePatentInventor('edit', scope.row)">修改</span>
                    <span @click="handlePatentInventor('del',{}, scope.$index)">删除</span>
                  </div>
                </template>

              </el-table-column>
            </el-table>
          </el-row>
        </div>

        <!--      要求优先权-->
        <div
          v-if="caseType != '顾问服务' && caseType != '无效' && caseType != '咨询' && caseType != '许可备案' && caseType != '翻译'">
          <el-row>
            <div style="position:relative; width: 100%;">
              <span class="header-info" id="priority-title">要求优先权</span>
              <el-button type="primary" size="mini" style="position:absolute;bottom: 0;right: 0;"
                         @click="handlePatentPriorityClaim('add')">添加
              </el-button>
            </div>
          </el-row>
          <el-row>
            <el-table
              :data="caseDetailFormData.patentPriorityClaimList"
              border
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                width="60">
              </el-table-column>
              <el-table-column
                prop="priorityBaseCrty"
                label="在先申请国">
              </el-table-column>
              <el-table-column
                prop="priorityAppNum"
                label="在先申请号">
              </el-table-column>
              <el-table-column
                prop="priorityAppDate"
                label="在先申请日">
              </el-table-column>
              <el-table-column
                prop="dasNo"
                label="DAS接入号">
              </el-table-column>
              <el-table-column
                prop="makeDate"
                label="出证日">
              </el-table-column>
              <el-table-column
                label="操作"
                width="120"
              >
                <template slot-scope="scope">
                  <div class="handle">
                    <span @click="handlePatentPriorityClaim('edit', scope.row)">修改</span>
                    <span @click="handlePatentPriorityClaim('del',{}, scope.$index)">删除</span>
                  </div>
                </template>

              </el-table-column>
            </el-table>
          </el-row>
        </div>

        <!--      外代所-->
        <div
          v-show="caseDetailFormData.appFromto == '内-外' || caseDetailFormData.appFromto == '外-外'">
          <el-row>
            <span class="header-info" id="wds-title">外代所</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="6">
              <el-form-item label="进入国家:" prop="toCountry">
                <!--              <el-input type="text" size="small" v-model="caseDetailFormData.toCountry"></el-input>-->
                <el-select default-first-option :clearable='true' placeholder="请选择"
                           v-model="caseDetailFormData.toCountry"
                           filterable>
                  <el-option v-for="(item,key)  in patentCountryArray" :key="key" :label="item.country_name"
                             :value="item.country_name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="外方代理所:">
                <VirtualSelect filterable clearable :data="hzListsList"
                               v-model="caseDetailFormData.agencyCustId"></VirtualSelect>
                <!--                <el-select default-first-option :clearable='true' placeholder="请选择"-->
                <!--                           v-model="caseDetailFormData.agencyCustId"-->

                <!--                           filterable>-->
                <!--                  <el-option v-for="(item,key)  in hzListsList" :key="key" :label="item.label"-->
                <!--                             :value="item.value">-->
                <!--                  </el-option>-->
                <!--                </el-select>-->
                <!--                <virtual-select class="virtual-select" clearable :data="hzListsList"-->
                <!--                                v-model="caseDetailFormData.agencyCustId"-->
                <!--                                @change="wfAgentChange" filterable></virtual-select>-->
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="外方案号:">
                <el-input type="text" size="small" v-model="caseDetailFormData.agencyCustRefno"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="外方联系人:">
                <!--              <el-input type="text" size="small" v-model="caseDetailFormData.agencyCustContactId"></el-input>-->
                <el-select default-first-option :clearable='true' placeholder="请选择" @change="queryWfCustomerContactUrl"
                           v-model="caseDetailFormData.agencyCustContactId" filterable>
                  <el-option v-for="(item,key)  in customerContactswfList" :key="key" :label="item.name"
                             :value="item.custContactId">
                  </el-option>
                </el-select>

              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="12">
              <el-form-item label="外方文件邮址:">
                <el-select default-first-option :clearable='true' placeholder="请选择"
                           v-model="caseDetailFormData.agencyCustFileAddr" filterable>
                  <el-option v-for="(item,key)  in wfCustomerMailAddsList" :key="key"
                             :label="(item.addressCn||'')+(item.addressEn||'')" :value="item.addrId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="外方要求:">
                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" size="small"
                          v-model="caseDetailFormData.agencyCustReq"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!--      新申请递交-->
        <div v-if="caseType == '欧洲专利国家生效'">
          <el-row>
          <span class="header-info" id="new-app-title" @click="hideNewAppClick">新申请递交<i class="el-icon-arrow-down"
                                                                                        :class="[hideNewApp ? 'right' : 'down']"></i></span>
          </el-row>
          <div :class="[hideNewApp ? 'hideNewApp' : 'showNewApp']">
            <el-row class="border-top">
              <el-col :span="6">
                <el-form-item label="文稿字数:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.wordsNum"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="说明书页数:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.descriptionPages"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="附图幅数:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.appendedDrawings"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="附图页数:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.drawingPages"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="6">
                <el-form-item label="权利要求项数:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.claimItems"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="权利要求页数:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.claimPages"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="摘要页数:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.substractPage"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="摘要附图页数:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.substractDrawing"></el-input>
                </el-form-item>
              </el-col>

            </el-row>
            <el-row class="">
              <el-col :span="6">
                <el-form-item label="摘要附图指定图:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.substractDrwno"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-show="caseDetailFormData.appFromto == '内-内'">
                <el-form-item label="预审案件:">
                  <el-radio-group v-model="caseDetailFormData.preexamine" style="margin-left: 10px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="要求DAS:">
                  <!--              <el-input type="text" size="small" v-model="caseDetailFormData.das"></el-input>-->
                  <el-radio-group v-model="caseDetailFormData.das" style="margin-left: 10px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="caseDetailFormData.appFromto == '内-内' ? 6 : 12">
                <el-form-item label="缺委托书:">
                  <el-radio-group :disabled="hasZw"
                                  v-model="caseDetailFormData.nopower" style="margin-left: 10px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <!--            <el-row class="">-->

            <!--&lt;!&ndash;              <el-col :span="12">&ndash;&gt;-->
            <!--&lt;!&ndash;                <el-form-item label="要求优先审查:">&ndash;&gt;-->
            <!--&lt;!&ndash;                  <el-radio-group v-model="caseDetailFormData.tqsc" style="margin-left: 10px">&ndash;&gt;-->
            <!--&lt;!&ndash;                    <el-radio :label='1'>是</el-radio>&ndash;&gt;-->
            <!--&lt;!&ndash;                    <el-radio :label='0'>否</el-radio>&ndash;&gt;-->
            <!--&lt;!&ndash;                  </el-radio-group>&ndash;&gt;-->
            <!--&lt;!&ndash;                </el-form-item>&ndash;&gt;-->
            <!--&lt;!&ndash;              </el-col>&ndash;&gt;-->
            <!--              <el-col :span="24">-->
            <!--                <el-form-item>-->
            <!--                  <span slot="label">要求审查高速公路<br>(PPH)</span>-->
            <!--                  <el-radio-group v-model="caseDetailFormData.dopph" style="margin-left: 10px">-->
            <!--                    <el-radio :label='1'>是</el-radio>-->
            <!--                    <el-radio :label='0'>否</el-radio>-->
            <!--                  </el-radio-group>-->
            <!--                </el-form-item>-->
            <!--              </el-col>-->

            <!--            </el-row>-->
            <div v-if="caseType == '欧洲专利国家生效'">
              <el-row>
                <el-col :span="caseDetailFormData.ishk == 1 ? 6 : 12">
                  <el-form-item label="要求提交香港申请:">
                    <el-radio-group v-model="caseDetailFormData.ishk" style="margin-left: 10px">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col class="special-width" v-show="caseDetailFormData.ishk == 1" :span="6">
                  <!--                <el-col :span="6">-->
                  <el-form-item label="香港申请案号:">
                    <el-select
                      v-model="caseDetailFormData.hkRefNoList"
                      ref="custSelect"
                      filterable
                      clearable
                      remote
                      multiple
                      reserve-keyword
                      placeholder="请输入关键词"
                      :remote-method="queryCaseAgentNumList"
                    >
                      <el-option
                        v-for="item in anotherCaseNumList"
                        :key="item.agentNum"
                        :label="item.agentNum"
                        :value="item.agentNum"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="caseDetailFormData.needdiv == 1 ? 6 : 12">
                  <el-form-item label="是否需要提交分案申请:">
                    <el-radio-group v-model="caseDetailFormData.needdiv" style="margin-left: 10px">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col class="special-width" v-show="caseDetailFormData.needdiv == 1 " :span="6">
                  <el-form-item label="分案申请案号:">
                    <el-select
                      v-model="caseDetailFormData.divcaseList"
                      ref="custSelect"
                      filterable
                      clearable
                      remote
                      multiple
                      :reserve-keyword="false"
                      placeholder="请输入关键词"
                      :remote-method="queryCaseAgentNumList"
                      @change="agentNumChange"
                    >
                      <el-option
                        v-for="item in anotherCaseNumList"
                        :key="item.agentNum"
                        :label="item.agentNum"
                        :value="item.agentNum"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="要求新申请同时提实审:">
                    <!--              <el-input type="text" size="small" v-model="caseDetailFormData.tstss"></el-input>-->
                    <el-radio-group v-model="caseDetailFormData.tstss" style="margin-left: 10px">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="要求提交IDS:">
                    <el-radio-group v-model="caseDetailFormData.needIds" style="margin-left: 10px">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="费减比例:" prop="feeReduce">
                    <el-select v-model="caseDetailFormData.feeReduce" @change="feeReduceChange" filterable clearable
                               placeholder="请选择">
                      <el-option
                        v-for="item in ['0.70',' 0.85']"
                        :key="item"
                        :label="item"
                        :value="item">
                        <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                      </el-option>
                    </el-select>
                    <!--                    <el-input type="text" size="small"-->
                    <!--                              @change="feeReduceChange"-->
                    <!--                              v-model="caseDetailFormData.feeReduce"></el-input>-->
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

          </div>
          <el-row v-if="caseDetailFormData.appFromto == '外-内'" :class="[hideNewApp ? 'hideNewApp' : 'showNewApp']">
            <el-col :span="24">
              <el-form-item label="原案语言:">
                <el-radio-group v-model="caseDetailFormData.pctOpenLang" style="margin-left: 10px">
                  <el-radio label='英语' @click.native.prevent="chooseLang('英语')">英语</el-radio>
                  <el-radio label='法语' @click.native.prevent="chooseLang('法语')">法语</el-radio>
                  <el-radio label='德语' @click.native.prevent="chooseLang('德语')">德语</el-radio>
                  <el-radio label='韩语' @click.native.prevent="chooseLang('韩语')">韩语</el-radio>
                  <el-radio label='俄语' @click.native.prevent="chooseLang('俄语')">俄语</el-radio>
                  <el-radio label='日语' @click.native.prevent="chooseLang('日语')">日语</el-radio>
                  <el-radio label='葡语' @click.native.prevent="chooseLang('葡语')">葡语</el-radio>
                  <el-radio label='葡语' @click.native.prevent="chooseLang('西班牙语')">西班牙语</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :class="[hideNewApp ? 'hideNewApp' : 'showNewApp']">
            <el-col :span="24">
              <el-form-item label="是否需要优先权期限提醒:">
                <el-radio-group v-model="caseDetailFormData.applyExternally" style="margin-left: 10px">
                  <el-radio :label='1'>是</el-radio>
                  <el-radio :label='0'>否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>


        <!--      专利基础信息-->
        <div v-if="['咨询', '许可备案', '翻译', '欧洲专利国家生效', '年费代缴', '其他'].includes(caseType)">
          <el-row>
          <span class="header-info" id="patent-base-title" @click="hidePatentClick">专利基础信息<i class="el-icon-arrow-down"
                                                                                             :class="[hidePatentBase ? 'right' : 'down']"></i></span>
          </el-row>
          <div v-if="caseType == '欧洲专利国家生效'" :class="[hidePatentBase ? 'hidePatentBase' : 'showPatentBase']">
            <div :class="[hidePatentBase ? 'hidePatentBase' : 'showPatentBase']">
              <el-row class="border-top">
                <el-col :span="caseType != 'PCT国家阶段'?6:12">
                  <el-form-item label="优先权日:">
                    {{caseDetailFormData.priorityAppDate}}
                    <!--                    <el-date-picker-->
                    <!--                      v-model="caseDetailFormData.priorityAppDate"-->
                    <!--                      type="date"-->
                    <!--                      placeholder="选择日期"-->
                    <!--                      value-format="yyyy-MM-dd">-->
                    <!--                    </el-date-picker>-->
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseType != 'PCT国家阶段'">
                  <el-form-item label="递交日期:">
                    <el-date-picker
                      v-model="caseDetailFormData.submitDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="申请日:">
                    <el-date-picker
                      v-model="caseDetailFormData.appDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="申请号:">
                    <el-input
                      v-if="caseDetailFormData.appFromto == '外-内' || caseDetailFormData.appFromto == '内-内' || caseDetailFormData.appFromto == '台-内'"
                      type="text" size="small"
                      v-model="caseDetailFormData.appNumberStr" @change="changeAppNumber"></el-input>
                    <el-input v-else type="text" size="small"
                              v-model="caseDetailFormData.appNumber"></el-input>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row class=""
                      v-if="caseType != 'PCT国家阶段' && (caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.length || caseDetailFormData.isDivcase)">
                <el-col :span="6" v-if="caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.length">
                  <el-form-item label="针对分案申请号:">
                    <el-input type="text" size="small" v-model="caseDetailFormData.parentFileNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col v-if="!caseDetailFormData.isDivcase" :span="18">
                  <el-form-item></el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseDetailFormData.isDivcase">
                  <el-form-item label="原案申请号:">
                    <el-input type="text" size="small" v-model="caseDetailFormData.parentAppNumber"></el-input>

                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseDetailFormData.isDivcase">
                  <el-form-item label="原案申请日:">
                    <el-date-picker
                      v-model="caseDetailFormData.parentAppDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseDetailFormData.isDivcase">
                  <el-form-item label="原案PCT号:">
                    <el-input type="text" size="small" v-model="caseDetailFormData.pctFileNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col v-if="!(caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.length)" :span="6">
                  <el-form-item></el-form-item>
                </el-col>
              </el-row>
              <el-row class="">
                <el-col :span="6">
                  <el-form-item label="公开号:">
                    <el-input type="text" size="small" v-model="caseDetailFormData.openNumber"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="公开日:">
                    <el-date-picker
                      v-model="caseDetailFormData.openDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="实审请求日期:">
                    <el-date-picker
                      v-model="caseDetailFormData.ssqqDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="已提实审请求:">
                    <el-radio-group v-model="caseDetailFormData.ssqq" style="margin-left: 10px">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                    </el-radio-group>

                  </el-form-item>
                </el-col>

              </el-row>
              <el-row class="">
                <el-col :span="6">
                  <el-form-item label="公告号:">
                    <el-input type="text" size="small" v-model="caseDetailFormData.declareNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="公告日:">
                    <el-date-picker
                      v-model="caseDetailFormData.declareDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="OA次数:">
                    <el-input type="text" size="small" v-model="caseDetailFormData.oaTimes"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="授权权利要求项数:">
                    <el-input type="text" size="small" v-model="caseDetailFormData.claimItems"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="年费公司:">
                    <el-input type="text" min="1" max="100" size="small" v-model="caseDetailFormData.ngCli"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="年费公司案号:">
                    <el-input type="text" min="1" max="100" size="small"
                              v-model="caseDetailFormData.ngcliRefNo"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="">
                <el-col :span="6">
                  <el-form-item label="证书号:">
                    <el-input type="text" size="small" v-model="caseDetailFormData.certificateNumber"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="有效日期:">
                    <el-date-picker
                      v-model="caseDetailFormData.validEndDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="年费监视:">
                    <el-radio-group v-model="caseDetailFormData.isagency" style="margin-left: 10px">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="首次年费:">
                    <el-input type="text" size="small" v-model="caseDetailFormData.firstYearNumber"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="复审官方案件编号:">
                    <el-input type="text" size="small" v-model="caseDetailFormData.patentNumber"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="授权发文日期:">
                    <el-date-picker
                      v-model="caseDetailFormData.grantDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="授权日:">
                    <el-date-picker
                      v-model="caseDetailFormData.certificateDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <!--                <el-col :span="6">-->
                <!--                  <el-form-item label="费减比例:">-->
                <!--                    <el-input type="text" min="1" max="100" size="small"-->
                <!--                              v-model="caseDetailFormData.feeReduce"></el-input>-->
                <!--                  </el-form-item>-->
                <!--                </el-col>-->
              </el-row>
              <el-row class="">
                <el-col :span="6">
                  <el-form-item label="法律状态:">
                    <el-select default-first-option :clearable='true' placeholder="请选择"
                               v-model="caseDetailFormData.lawStatus"
                               filterable>
                      <el-option :label="item.typeName" :value="item.id" v-for="item in statusList"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="法律状态变更日期:">
                    <el-date-picker
                      v-model="caseDetailFormData.statusDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="客户状态变更日期:">
                    <el-date-picker
                      v-model="caseDetailFormData.custstatusDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="客户状态:">
                    <el-select default-first-option :clearable='true' placeholder="请选择"
                               v-model="caseDetailFormData.custStatus" filterable>
                      <el-option :label="item.typeName" :value="item.id" v-for="item in custStatusList"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
          </div>
          <div v-else-if="caseType == '年费代缴'" :class="[hidePatentBase ? 'hidePatentBase' : 'showPatentBase']">
            <el-row class="border-top">
              <el-col :span="6">
                <el-form-item label="申请号:">
                  <el-input
                    v-if="caseDetailFormData.appFromto == '外-内' || caseDetailFormData.appFromto == '内-内' || caseDetailFormData.appFromto == '台-内'"
                    type="text" size="small"
                    v-model="caseDetailFormData.appNumberStr" @change="changeAppNumber"></el-input>
                  <el-input v-else type="text" size="small"
                            v-model="caseDetailFormData.appNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申请日:">
                  <el-date-picker
                    v-model="caseDetailFormData.appDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="证书号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.certificateNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="有效日期:">
                  <el-date-picker
                    v-model="caseDetailFormData.validEndDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>

            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="公开号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.openNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公开日:">
                  <el-date-picker
                    v-model="caseDetailFormData.openDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公告号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.declareNo"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公告日:">
                  <el-date-picker
                    v-model="caseDetailFormData.declareDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="授权日:">
                  <el-date-picker
                    v-model="caseDetailFormData.certificateDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="授权权利要求项数:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.claimItems"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="授权发文日期:">
                  <el-date-picker
                    v-model="caseDetailFormData.grantDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="递交日期:">
                  <el-date-picker
                    v-model="caseDetailFormData.submitDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>

              <el-col :span="6">
                <el-form-item label="法律状态:">
                  <el-select default-first-option :clearable='true' placeholder="请选择"
                             v-model="caseDetailFormData.lawStatus"
                             filterable>
                    <el-option :label="item.typeName" :value="item.id" v-for="item in statusList"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="法律状态变更日期:">
                  <el-date-picker
                    v-model="caseDetailFormData.statusDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="客户状态:">
                  <el-select default-first-option :clearable='true' placeholder="请选择"
                             v-model="caseDetailFormData.custStatus" filterable>
                    <el-option :label="item.typeName" :value="item.id" v-for="item in custStatusList"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="客户状态变更日期:">
                  <el-date-picker
                    v-model="caseDetailFormData.custstatusDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="首次年费:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.firstYearNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="费减比例:" prop="feeReduce">
                  <el-select v-model="caseDetailFormData.feeReduce" @change="feeReduceChange" filterable clearable
                             placeholder="请选择">
                    <el-option
                      v-for="item in ['0.70',' 0.85']"
                      :key="item"
                      :label="item"
                      :value="item">
                      <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                    </el-option>
                  </el-select>
                  <!--                  <el-input type="text" size="small"-->
                  <!--                            @change="feeReduceChange"-->
                  <!--                            v-model="caseDetailFormData.feeReduce"></el-input>-->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年费监视:">
                  <el-radio-group v-model="caseDetailFormData.isagency" style="margin-left: 10px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>

              </el-col>
            </el-row>
          </div>
          <div v-else :class="[hidePatentBase ? 'hidePatentBase' : 'showPatentBase']">
            <el-row class="border-top" v-if="caseType != '翻译'">
              <el-col :span="6">
                <el-form-item label="申请号:">
                  <el-input
                    v-if="caseDetailFormData.appFromto == '外-内' || caseDetailFormData.appFromto == '内-内' || caseDetailFormData.appFromto == '台-内'"
                    type="text" size="small"
                    v-model="caseDetailFormData.appNumberStr" @change="changeAppNumber"></el-input>
                  <el-input v-else type="text" size="small"
                            v-model="caseDetailFormData.appNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申请日:">
                  <el-date-picker
                    v-model="caseDetailFormData.appDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="登记日:">
                  <el-date-picker
                    v-model="caseDetailFormData.certificateDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="证书号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.certificateNumber"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :class="{'border-top': caseType == '翻译'}">
              <el-col :span="6">
                <el-form-item label="客户状态变更日期:">
                  <el-date-picker
                    v-model="caseDetailFormData.custstatusDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="法律状态:">
                  <el-select default-first-option :clearable='true' placeholder="请选择"
                             v-model="caseDetailFormData.lawStatus"
                             filterable>
                    <el-option :label="item.typeName" :value="item.id" v-for="item in statusList"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="法律状态变更日期:">
                  <el-date-picker
                    v-model="caseDetailFormData.statusDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="客户状态:">
                  <el-select default-first-option :clearable='true' placeholder="请选择"
                             v-model="caseDetailFormData.custStatus" filterable>
                    <el-option :label="item.typeName" :value="item.id" v-for="item in custStatusList"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="caseType != '翻译'">
              <el-col :span="24">
                <el-form-item label="年费监视:">
                  <el-radio-group v-model="caseDetailFormData.isagency" style="margin-left: 10px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>

              </el-col>
            </el-row>
          </div>


        </div>

        <!--      母案信息-->
        <div v-if="caseType == '香港登记' || caseType == '澳门登记'">
          <el-row>
            <span class="header-info" id="parent-title">母案信息</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="6">
              <el-form-item>
                <span slot="label">母案卷号<br><span class="pointer"
                                                 @click="queryOrigCaseInfo(caseDetailFormData.origRefNo)">查询</span></span>
                <el-input type="text" size="small" v-model="caseDetailFormData.origRefNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="PCT进入日:">
                <el-date-picker
                  v-model="caseDetailFormData.btUseDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="母案优先权日:">
                {{caseDetailFormData.origPriorityDate}}
                <!--                <el-date-picker-->
                <!--                  v-model="caseDetailFormData.priorityAppDate"-->
                <!--                  type="date"-->
                <!--                  placeholder="选择日期"-->
                <!--                  value-format="yyyy-MM-dd">-->
                <!--                </el-date-picker>-->
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="母案申请号:">
                <el-input type="text" size="small" v-model="caseDetailFormData.parentAppNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="母案申请日:">
                <el-date-picker
                  v-model="caseDetailFormData.parentAppDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="母案公开号:">
                <el-input type="text" size="small" v-model="caseDetailFormData.origOpenNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="母案公开日:">
                <el-date-picker
                  v-model="caseDetailFormData.origOpenDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="母案公告号:">
                <el-input type="text" size="small" v-model="caseDetailFormData.origAnnounceNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="母案公告日:">
                <el-date-picker
                  v-model="caseDetailFormData.origAnnounceDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="国际申请号:">
                <el-input type="text" size="small" v-model="caseDetailFormData.pctFileNo"></el-input>

              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="国际申请日:">
                <!--              <el-input type="text" size="small" v-model="caseDetailFormData.pctFileDate"></el-input>-->
                <el-date-picker
                  v-model="caseDetailFormData.pctFileDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="国际公开号:">
                <el-input type="text" size="small" v-model="caseDetailFormData.pctOpenNumber"></el-input>

              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="国际公开日:">
                <!--              <el-input type="text" size="small" v-model="caseDetailFormData.pctOpenDate"></el-input>-->
                <el-date-picker
                  v-model="caseDetailFormData.pctOpenDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="母案官方状态:">
                <el-select default-first-option :clearable='true' placeholder="请选择"
                           v-model="caseDetailFormData.origStatus"
                           filterable>
                  <el-option :label="item.typeName" :value="item.id" v-for="item in statusList"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="母案客户状态:">
                <el-select default-first-option :clearable='true' placeholder="请选择"
                           v-model="caseDetailFormData.origCustStatus" filterable>
                  <el-option :label="item.typeName" :value="item.id" v-for="item in custStatusList"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!--      香港申请信息-->
        <div v-if="caseType == '香港登记' || caseType == '澳门登记'">
          <el-row>
            <span class="header-info" id="hk-app-title" v-if="caseType == '香港登记'">香港申请信息</span>
            <span class="header-info" id="am-app-title" v-if="caseType == '澳门登记'">澳门申请信息</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="6">
              <el-form-item label="申请号:">
                <el-input
                  v-if="caseDetailFormData.appFromto == '外-内' || caseDetailFormData.appFromto == '内-内' || caseDetailFormData.appFromto == '台-内'"
                  type="text" size="small"
                  v-model="caseDetailFormData.appNumberStr" @change="changeAppNumber"></el-input>
                <el-input v-else type="text" size="small"
                          v-model="caseDetailFormData.appNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请日:">
                <el-date-picker
                  v-model="caseDetailFormData.appDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="优先权日:">
                {{caseDetailFormData.priorityAppDate}}
                <!--                <el-date-picker-->
                <!--                  v-model="caseDetailFormData.priorityAppDate"-->
                <!--                  type="date"-->
                <!--                  placeholder="选择日期"-->
                <!--                  value-format="yyyy-MM-dd">-->
                <!--                </el-date-picker>-->
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="年费监视:">
                <el-radio-group v-model="caseDetailFormData.isagency" style="margin-left: 10px">
                  <el-radio :label='1'>是</el-radio>
                  <el-radio :label='0'>否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="公开号:">
                <el-input type="text" size="small" v-model="caseDetailFormData.openNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公开日:">
                <el-date-picker
                  v-model="caseDetailFormData.openDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公告号:">
                <el-input type="text" size="small" v-model="caseDetailFormData.declareNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公告日:">
                <el-date-picker
                  v-model="caseDetailFormData.declareDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="授权发文日期:">
                <el-date-picker
                  v-model="caseDetailFormData.grantDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="授权日:">
                <el-date-picker
                  v-model="caseDetailFormData.certificateDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="证书号:">
                <el-input type="text" size="small" v-model="caseDetailFormData.certificateNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="有效日期:">
                <el-date-picker
                  v-model="caseDetailFormData.validEndDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="6">
              <el-form-item label="法律状态:">
                <el-select default-first-option :clearable='true' placeholder="请选择"
                           v-model="caseDetailFormData.lawStatus"
                           filterable>
                  <el-option :label="item.typeName" :value="item.id" v-for="item in statusList"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="法律状态变更日期:">
                <el-date-picker
                  v-model="caseDetailFormData.statusDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户状态:">
                <el-select default-first-option :clearable='true' placeholder="请选择"
                           v-model="caseDetailFormData.custStatus" filterable>
                  <el-option :label="item.typeName" :value="item.id" v-for="item in custStatusList"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户状态变更日期:">
                <el-date-picker
                  v-model="caseDetailFormData.custstatusDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!--      立卷信息-->
        <div>
          <el-row>
            <span class="header-info" id="create-info-title">立卷信息</span>
          </el-row>
          <el-row v-if="caseType == '年费代缴'" class="border-top">
            <el-col :span="6">
              <el-form-item label="收案日期:">
                <el-date-picker
                  v-model="caseDetailFormData.receiveDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建日期:">
                <el-date-picker
                  disabled
                  v-model="caseDetailFormData.caseDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建人员:">
                <VirtualSelect disabled filterable clearable :data="$store.getters.allUserList"
                               v-model="caseDetailFormData.createUserId"></VirtualSelect>
                <!--                <el-select v-model="caseDetailFormData.createUserId" filterable clearable placeholder="请选择">-->
                <!--                  <el-option-->
                <!--                    v-for="item in $store.getters.allUserList"-->
                <!--                    :key="item.userId"-->
                <!--                    :label="item.fullname"-->
                <!--                    :value="item.userId">-->
                <!--                    &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                <!--                  </el-option>-->
                <!--                </el-select>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-else class="border-top">
            <el-col :span="6">
              <el-form-item label="收案日期:">
                <el-date-picker
                  v-model="caseDetailFormData.receiveDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="caseType !== '欧洲专利国家生效'">
              <el-form-item label="递交日期:">
                <el-date-picker
                  v-model="caseDetailFormData.submitDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建日期:">
                <el-date-picker
                  disabled
                  v-model="caseDetailFormData.caseDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建人员:">
                <VirtualSelect disabled filterable clearable :data="$store.getters.allUserList"
                               v-model="caseDetailFormData.createUserId"></VirtualSelect>
                <!--                <el-select v-model="caseDetailFormData.createUserId" filterable clearable placeholder="请选择">-->
                <!--                  <el-option-->
                <!--                    v-for="item in $store.getters.allUserList"-->
                <!--                    :key="item.userId"-->
                <!--                    :label="item.fullname"-->
                <!--                    :value="item.userId">-->
                <!--                    &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                <!--                  </el-option>-->
                <!--                </el-select>-->
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="caseType == '欧洲专利国家生效'">
              <el-form-item label=""></el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType != '年费代缴' && caseType != '香港登记' && caseType != '澳门登记' && caseType != '欧洲专利国家生效'">
            <el-col :span="24">
              <el-form-item label="财务备注:">
                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" size="small"
                          v-model="caseDetailFormData.memo2"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType == '香港登记' || caseType == '澳门登记'">
            <el-col :span="6">
              <el-form-item label="指示外方代理日:">
                <el-date-picker
                  v-model="caseDetailFormData.agencyCustShowDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="第二步递交日期:">
                <el-date-picker
                  v-model="caseDetailFormData.ssqqDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请人与发明人的关系">
                <el-input type="text" size="small" v-model="caseDetailFormData.modifymemo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType == '欧洲专利国家生效'">
            <el-col :span="12">
              <el-form-item label="委托外方日期:">
                <el-date-picker
                  v-model="caseDetailFormData.agencyCustShowDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="">
                <!--                <VirtualSelect filterable :data="$store.getters.allUserList" v-model="caseDetailFormData.checkerUserId"></VirtualSelect>-->
                <!--                <el-select v-model="caseDetailFormData.checkerUserId" filterable clearable placeholder="请选择">-->
                <!--                  <el-option-->
                <!--                    v-for="item in $store.getters.allUserList"-->
                <!--                    :key="item.userId"-->
                <!--                    :label="item.fullname"-->
                <!--                    :value="item.userId">-->
                <!--                    &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                <!--                  </el-option>-->
                <!--                </el-select>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if=" caseType == '年费代缴' || caseType == '香港登记' || caseType == '澳门登记' || caseType == '欧洲专利国家生效'">
            <el-col :span="24">
              <el-form-item label="财务备注:">
                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" size="small"
                          v-model="caseDetailFormData.memo2"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="案件备注:">
                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" size="small"
                          v-model="caseDetailFormData.memo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <!--    弹框-->
      <el-dialog
        :close-on-click-modal="false"
        :title="patentPriorityClaimTitle"
        :visible.sync="patentPriorityClaim"
        width="30%"
        :before-close="closePatentPriorityClaim"
      >
        <div>
          <el-form v-model="patentPriorityClaimItem" label-width="130px">
            <el-row class="border-top">
              <el-col :span="24">
                <el-form-item label="在先申请国:">
                  <el-select default-first-option :clearable='true' placeholder="请选择"
                             v-model="patentPriorityClaimItem.priorityBaseCrty"
                             filterable>
                    <el-option v-for="(item,key)  in patentCountryList" :key="key" :label="item.value"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="在先申请号:">
                  <el-input type="text" size="small" v-model="patentPriorityClaimItem.priorityAppNum"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="在先申请日:">
                  <el-date-picker
                    v-model="patentPriorityClaimItem.priorityAppDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="DAS接入号:">
                  <el-input type="text" size="small" v-model="patentPriorityClaimItem.dasNo"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="出证日:">
                  <el-date-picker
                    v-model="patentPriorityClaimItem.makeDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="mini" @click="closePatentPriorityClaim">取 消</el-button>
        <el-button size="mini" type="primary" @click="addPatentPriorityClaim(patentPriorityClaimTitle)">确 定</el-button>
      </span>
      </el-dialog>

      <el-dialog
        :close-on-click-modal="false"
        :title="patentInventorTitle"
        :visible.sync="patentInventor"
        width="30%"
        :before-close="closePatentInventor"
      >
        <div>
          <el-form v-model="patentInventorItem" label-width="130px">
            <el-row class="border-top">
              <el-col :span="24">
                <el-form-item label="中文名称:">
                  <el-select :clearable='true' placeholder="请选择"
                             v-model="patentInventorItem.inventorCtitle"
                             allow-create
                             filterable
                             @change="(v)=>changeName(v, 'inventorCtitle')"
                  >
                    <el-option v-for="(item,key)  in nameList.filter(i => i.inventorCtitle)" :key="key" :label="item.inventorCtitle"
                               :value="item.inventorCtitle">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                <el-form-item label="原文名称:">
                  <el-select :clearable='true' placeholder="请选择"
                             v-model="patentInventorItem.inventorEtitle"
                             allow-create
                             filterable
                             @change="(v)=>changeName(v, 'inventorEtitle')"
                  >
                    <el-option v-for="(item,key)  in nameList.filter(i => i.inventorEtitle)" :key="key"
                               :label="item.inventorEtitle"
                               :value="item.inventorEtitle">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                <el-form-item label="日文名称:">
                  <el-input type="text" size="small" v-model="patentInventorItem.inventorJtitle"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                <el-form-item label="证件号:">
                  <el-input type="text" size="small" v-model="patentInventorItem.inventorIdno"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="inventor-material-row">
              <el-col :span="24">
                <el-form-item label="证件上传:">
                  <el-upload
                    ref="inventorMaterialUpload"
                    class="upload-demo"
                    name="attachFile"
                    :data="inventorUploadFileData"
                    :action="creatematerialUrl"
                    :file-list="inventorMaterialFileList"
                    :limit="1"
                    :on-change="onInventorMaterialChange"
                    :before-upload="beforeInventorMaterialUpload"
                    :on-remove="onInventorMaterialRemove"
                    :on-success="onInventorMaterialSuccess"
                    :on-error="onInventorMaterialError"
                    :on-exceed="onInventorMaterialExceed"
                    :on-preview="onInventorMaterialPreview"
                  >
                    <el-button type="primary" size="mini" style="margin-left:10px">上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                <el-form-item label="国籍:">
                  <el-select default-first-option :clearable='true' placeholder="请选择"
                             v-model="patentInventorItem.inventorCountry"
                             filterable>
                    <el-option v-for="(item,key)  in patentCountryList" :key="key" :label="item.value"
                               :value="item.cityCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!--            <el-row class="">-->
            <!--              <el-col :span="24">-->
            <!--                <el-form-item label="发明人证件类型:">-->
            <!--                  <el-input type="text" size="small" v-model="patentInventorItem.invcardType"></el-input>-->
            <!--                </el-form-item>-->
            <!--              </el-col>-->
            <!--            </el-row>-->
            <el-row class="">
              <el-col :span="24">
                <el-form-item label="不公开标志:">
                  <el-radio-group v-model="patentInventorItem.notOpenSign" style="margin-left: 10px">
                    <el-radio label='1'>是</el-radio>
                    <el-radio label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                <el-form-item label="中文地址:">
                  <el-input type="text" size="small" v-model="patentInventorItem.invAddressCn"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                <el-form-item label="英文地址:">
                  <el-input type="text" size="small" v-model="patentInventorItem.invAddressEn"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="mini" @click="closePatentInventor">取 消</el-button>
        <el-button size="mini" type="primary" @click="addPatentInventor(patentInventorTitle)">确 定</el-button>
      </span>
      </el-dialog>
    </div>


    <!--    申请人-->
    <!--    <el-dialog-->
    <!--      :modal-append-to-body="true"-->
    <!--      :modal="true"-->
    <!--      class="abow_dialog"-->
    <!--      :title="patentApplicationTitle"-->
    <!--      :visible.sync="patentApplication"-->
    <!--      width="80%"-->
    <!--    >-->
    <!--      <ApplicantDetail @checked="checkedAppItem" @clickBack="clickBack" v-if="newView" :is-edit="false" :patent="true"/>-->
    <!--      <ApplicantDetail @checked="checkedAppItem" @clickBack="clickBack" v-if="editView" :app-id="appId" :is-edit="true"-->
    <!--                       :patent="true"/>-->
    <!--      <applicant_list v-if="listView" @openNew="openNew" @checked="checkedAppItem"-->
    <!--                      :cust-name="caseDetailFormData.custName" :custId="caseDetailFormData.custId"-->
    <!--                      :patent="true"></applicant_list>-->

    <!--      <span slot="footer" class="dialog-footer fl-ac-jc">-->
    <!--&lt;!&ndash;              <el-button size="mini" @click="checkedAppItem('')" type="primary">取 消</el-button>&ndash;&gt;-->
    <!--        &lt;!&ndash;        <el-button size="mini" type="primary" @click="addApplication">确 定</el-button>&ndash;&gt;-->
    <!--            </span>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
  import { billSubmitUrl, billDiscount } from '@/api/billApi'
  import { creatematerialUrl } from '@/api/serviceApi.config.js'
  import { deleteMaterial } from '@/api/customerList.js'
  import { queryAddrByAppIds } from '@/api/applicant'
  import { formatAmount, fomatFloat, toFixed1, toFixed2 } from '@/utils/filters'
  import {
    queryFixedCompanies
  } from '@/api/caseList'
  import {
    queryPatentCaseInfo,
    queryCountry,
    queryCustomerContactByCustIdUrl,
    queryCustomerContactByCustContactIdUrl,
    queryOtherCustomerListUrl,
    queryCustomerUrl,
    queryCaseAgentNumList,
    queryInventorList,
    queryOrigCaseInfo
  } from '@/api/caseDetail'
  import ApplicantDetail from '../../customer_management/applicant/components/ApplicantDetail'
  import Applicant_list from '../../customer_management/applicant/applicant_list'

  export default {
    components: {
      ApplicantDetail,
      Applicant_list
    },
    name: 'patentCommonCase',
    props: {
      invoiceTitleList: { type: Array, default: () => [] },
      patentCountryArray: {},
      billContactsList: {},
      patentCountryList: {},
      caseDetailFormData: {},
      // rules: {},
      patentTypeList: {},
      techFieldList: {},
      queryCustomerNameIdList: {},
      countryList: {},
      customerContactsList: {},
      billAddsList: {},
      customerMailAddsList: {},
      hzListsList: {},
      // customerContactswfList: {},
      statusList: {},
      custStatusList: {}
    },
    computed: {
      hasApplicationType() {
        return this.caseDetailFormData.patentCaseApplicationList && this.caseDetailFormData.patentCaseApplicationList.find(item => item.applicationType == '1752')
      },
      appCnName() {
        if (this.caseDetailFormData.patentCaseApplicationList.length) {
          return this.caseDetailFormData.patentCaseApplicationList[0].applicantName
        }
      },
      patentType() {
        return this.caseDetailFormData.patentType
      },
      caseType() {
        return this.caseDetailFormData.caseType
      },
      rules() {
        var checkfeeReduce = (rule, value, callback) => {
          if (value > 1 || value < 0) {
            callback(new Error('费减比例数据错误'))
          }
        }
        return {
          feeReduce: [
            { validator: checkfeeReduce, trigger: 'change' }
          ],
          disableAppliant: [{ required: true, message: '请填写请求人', trigger: ['change', 'blur'] }],
          patentRighter: [{ required: true, message: '请填写专利权人', trigger: ['change', 'blur'] }],
          patentType: [{ required: true, message: '请选择专利类型', trigger: 'change' }],
          appFromto: [{ required: true, message: '请选择申请方向', trigger: 'change' }],
          toCountry: [{ required: true, message: '请选择进入国家', trigger: 'change' }],
          caseCnName: [{ required: true, message: '请填写案件中文名称', trigger: 'blur' }]
        }
      }
    },
    watch: {
      'caseDetailFormData.materials': {
        handler(n) {
          this.imageUrl = n && n.find(i => i.materialTypeId == 301510) && n.find(i => i.materialTypeId == 301510).address
        },
        immediate: true
      },
      'caseDetailFormData.disableWtr'(n) {
        if (n == 1) {
          !this.caseDetailFormData.patentRighter && this.$set(this.caseDetailFormData, 'patentRighter', this.appCnName || '')
        } else if (n == 2) {
          !this.caseDetailFormData.disableAppliant && this.$set(this.caseDetailFormData, 'disableAppliant', this.appCnName || '')
        }
      },
      'caseDetailFormData.agencyCustId'(n) {
        if (n) {
          this.wfAgentChange(n)
        }
      },
      // selctedArrList(n, o) {
      //   if (n.length) {
      //     let str = ''
      //     this.$commonUtils.unique(n, 'appNumber').filter(item => this.caseDetailFormData.divcaseList.includes(item.agentNum)).forEach(i => {
      //       i.appNumber && (str += i.appNumber + ';')
      //     })
      //     this.caseDetailFormData.parentFileNo = str
      //   }
      // },
      'caseDetailFormData.patentCaseApplicationList': {
        handler(n, o) {
          if (n && n.length) {
            // this.caseDetailFormData.patentRighter = n[0].applicantName
            if (this.caseDetailFormData.disableWtr == 1) {
              this.$set(this.caseDetailFormData, 'patentRighter', this.appCnName || '')
            } else if (this.caseDetailFormData.disableWtr == 2) {
              this.$set(this.caseDetailFormData, 'disableAppliant', this.appCnName || '')
            }
            if (n[0].iszw) {
              this.hasZw = 1 // 是
              this.caseDetailFormData.nopower = 0
            } else if (n[0].iszw === 0) {
              this.hasZw = 0 // 否
            } else {
              this.hasZw = null // 空
            }
            if (this.$route.query.pageId) {
              n.forEach(j => {
                if (j.appAddrArray && j.appAddrArray.length === 1) {
                  j.addrId = j.appAddrArray[0].addrId
                  j.addressEn = j.appAddrArray[0].addressEn
                }
              })
            }

          } else {
            this.hasZw = null
            this.caseDetailFormData.disableWtr = ''
            this.caseDetailFormData.patentRighter = ''
            this.caseDetailFormData.disableAppliant = ''
          }
        },
        immediate: true,
        deep: true
      },
      // 'caseDetailFormData.patentPriorityClaimList'(n) {
      //   if (n && n.length) {
      //     let dateList = n.map(i => i.priorityAppDate)
      //     this.$set(this.caseDetailFormData, 'priorityAppDate', dateList.sort((a, b) => {
      //       return new Date(a.replace(/-/g, "\/")) - new Date(b.replace(/-/g, "\/"))
      //     })[0] || '')
      //     // this.caseDetailFormData.priorityAppDate = dateList.sort((a, b) => {
      //     //   return new Date(a.replace(/-/g, "\/")) - new Date(b.replace(/-/g, "\/"))
      //     // })[0] || ''
      //   } else {
      //     // this.caseDetailFormData.priorityAppDate = ''
      //     this.$set(this.caseDetailFormData, 'priorityAppDate', '')
      //   }
      // },
      stepActive1: {
        handler(n) {
          this.$emit('changeActive', n)
        },
        immediate: true

      }
    },
    data() {
      return {
        // invoiceTitleList: [],
        wfCustomerMailAddsList: [],
        imageUrl: '',
        creatematerialUrl,
        imageData: {
          tokenID: this.$store.getters.token,
          materialTypeId: 301510
        },
        inventorUploadFileData: {
          tokenID: this.$store.getters.token,
          objType: 301703
        },
        inventorMaterialFileList: [],
        selctedArrList: [],
        nameList: [],
        hasZw: false,
        code: '',
        appId: '',
        editView: false,
        listView: false,
        newView: false,
        patentApplicationTitle: '',
        patentApplication: false,
        patentApplicationItem: {},
        anotherCaseNumList: [],
        customerContactswfList: [],
        // rules: {
        //   patentType: [{required: true, message: '请选择专利类型', trigger: 'change'},],
        //   appFromto: [{required: true, message: '请选择申请方向', trigger: 'change'},],
        //   caseCnName: [{required: true, message: '请填写案件中文名称', trigger: 'blur'},],
        //   // custId: [{ required: true, message: '请选择客户', trigger: 'change' },],
        //   // executor: [{ required: true, message: '请选择任务执行人', trigger: 'change' },],
        // },
        hideNewApp: false,
        hidePatentBase: false,
        stepActive1: 0,
        elstepList: [],
        patentInventorTitle: '',
        patentInventorItem: {
          inventorCtitle: '',
          inventorEtitle: '',
          inventorCountry: '',
          inventorIdno: '',
          invAddressEn: '',
          invAddressCn: '',
          notOpenSign: '0'
        },
        patentInventor: false,
        patentPriorityClaimTitle: '',
        patentPriorityClaimItem: {},
        patentPriorityClaim: false
      }
    },
    mounted() {
      if (this.$route.query.pageId) {
        this.hidePatentBase = true
        this.hideNewApp = true
      }
      this.queryWfCustomerContactUrl()
      window.addEventListener('scroll', this.handleScroll, true)
      // this.getInvoiceTitle()
    },
    methods: {
      onReceiptRiseChange(val) {
        if (!val) {
          this.caseDetailFormData.gfReceiptRise = ''
          this.caseDetailFormData.gfReceiptRiseNumber = ''
          return
        }
        const parenIdx = val.lastIndexOf('(')
        const fullname = parenIdx !== -1 ? val.substring(0, parenIdx) : val
        const creditCode = parenIdx !== -1 ? val.substring(parenIdx + 1, val.lastIndexOf(')')) : ''
        const item = this.invoiceTitleList.find(i =>
          i.fullname === fullname && (creditCode ? i.creditCode === creditCode : true)
        )
        this.$set(this.caseDetailFormData, 'gfReceiptRise', fullname)
        this.caseDetailFormData.gfReceiptRiseNumber = item ? item.creditCode : ''
      },
      // 发票抬头
      getInvoiceTitle() {
        this.caseDetailFormData.custId && queryFixedCompanies({
          custId: this.caseDetailFormData.custId,
          appIdArray: this.caseDetailFormData.patentCaseApplicationList[0] && this.caseDetailFormData.patentCaseApplicationList.map(j => j.appId)
        }).then(res => {
          this.invoiceTitleList = res.data
        })
      },
      // 外方文件邮址
      queryWfCustomerContactUrl() {
        queryCustomerContactByCustContactIdUrl({
          custContactId: this.caseDetailFormData.agencyCustContactId
        }).then(res => {
          this.wfCustomerMailAddsList = res.data.customerMailAdds
        })
      },
      chooseLang(type) {
        if (this.caseDetailFormData.pctOpenLang == type) {
          this.$set(this.caseDetailFormData, 'pctOpenLang', '')
        } else {
          this.$set(this.caseDetailFormData, 'pctOpenLang', type)
        }
      },
      queryOrigCaseInfo(origRefNo) {
        if (!origRefNo) return
        queryOrigCaseInfo({ origRefNo }).then(res => {
          // ['PCT进入日','母案优先权日','母案申请号', '母案申请日', '母案公开号', '母案公开日', '母案公告号',
          //   '母案公告日', '国际申请号','国际申请日','国际公开号','国际公开日','母案官方状态','母案客户状态'
          // ];
          // ['btUseDate', 'origPriorityDate', 'parentAppNumber','parentAppDate', 'origOpenDate', 'origOpenNo',  'origAnnounceNo',
          //   'origAnnounceDate', 'pctFileNo','pctFileDate','pctOpenNumber','pctOpenDate','origStatus','origCustStatus'
          //   ]

          // ['PCT进入日', '优先权日','申请号', '申请日', '公开号', '公开日', '公告号',
          //   '公告日', '国际申请号', '国际申请日', '国际公开号', '国际公开日', '法律状态', '客户状态']
          // ['btUseDate', 'priorityAppDate', 'appNumber', 'appDate', 'openNumber', 'openDate', 'declareNo',
          //   'declareDate','pctFileNo', 'pctFileDate','pctOpenNumber','pctOpenDate','lawStatus', 'custStatus']

          if (res.data) {
            this.caseDetailFormData.btUseDate = res.data.btUseDate || ''
            this.caseDetailFormData.origPriorityDate = res.data.priorityAppDate || ''
            this.caseDetailFormData.parentAppNumber = res.data.appNumber || ''
            this.caseDetailFormData.parentAppDate = res.data.appDate || ''
            this.caseDetailFormData.origOpenNo = res.data.openNumber || ''
            this.caseDetailFormData.origOpenDate = res.data.openDate || ''
            this.caseDetailFormData.origAnnounceNo = res.data.declareNo || ''
            this.caseDetailFormData.origAnnounceDate = res.data.declareDate || ''
            this.caseDetailFormData.pctFileNo = res.data.pctFileNo || ''
            this.caseDetailFormData.pctFileDate = res.data.pctFileDate || ''
            this.caseDetailFormData.pctOpenNumber = res.data.pctOpenNumber || ''
            this.caseDetailFormData.pctOpenDate = res.data.pctOpenDate || ''
            this.caseDetailFormData.origStatus = res.data.lawStatus || ''
            this.caseDetailFormData.origCustStatus = res.data.custStatus || ''
            this.$forceUpdate()
          }
        })
      },
      changeCnAddess(v, row, list) {
        if (v) {
          row.addressEn = list.find(i => i.addrId == v).addressEn
        }
      },
      beforeupload() {
        this.imageData.caseIds = this.caseDetailFormData.caseId || ''
      },
      successBack(file) {
        this.imageUrl = file.data[0].address
      },
      getInventorMaterialFileList(row) {
        if (!row || !row.materialId) {
          return []
        }
        return [{
          name: row.materialName || row.name || row.address,
          url: row.address ? `ipdoc${row.address}` : '',
          materialId: row.materialId,
          address: row.address,
          materialName: row.materialName
        }]
      },
      beforeInventorMaterialUpload(file) {
        const maxSize = 50 * 1024 * 1024
        if (file.size > maxSize) {
          this.$message.error('文件大小不能超过50M')
          return false
        }
        return true
      },
      onInventorMaterialChange(file) {
        if (file && file.raw) {
          this.inventorMaterialFileList = [{
            name: file.name,
            uid: file.uid,
            status: file.status || 'ready',
            percentage: file.percentage || 0,
            raw: file.raw
          }]
        }
      },
      onInventorMaterialSuccess(res, file) {
        const material = res && res.data && res.data[0]
        if (!material || !material.materialId) {
          this.$message.error('上传失败，请重新上传')
          this.inventorMaterialFileList = this.getInventorMaterialFileList(this.patentInventorItem)
          return
        }
        this.$set(this.patentInventorItem, 'materialId', material.materialId)
        this.$set(this.patentInventorItem, 'address', material.address)
        this.$set(this.patentInventorItem, 'materialName', material.materialName || material.name || file.name)
        this.inventorMaterialFileList = this.getInventorMaterialFileList(this.patentInventorItem)
        this.$message.success('上传成功')
      },
      onInventorMaterialError() {
        this.inventorMaterialFileList = this.getInventorMaterialFileList(this.patentInventorItem)
        this.$message.error('上传失败，请重新上传')
      },
      onInventorMaterialRemove(file) {
        const materialId = file.materialId || (file.response && file.response.data && file.response.data[0] && file.response.data[0].materialId)
        this.$set(this.patentInventorItem, 'materialId', '')
        this.$set(this.patentInventorItem, 'address', '')
        this.$set(this.patentInventorItem, 'materialName', '')
        this.inventorMaterialFileList = []
        if (materialId) {
          deleteMaterial({ materialId }).then(res => {
            this.$message.success(res.message || '删除成功')
          })
        }
      },
      onInventorMaterialExceed() {
        this.$message.warning('证件材料只能上传一个文件，请先删除已有文件')
      },
      onInventorMaterialPreview(file) {
        const address = file.address || (file.response && file.response.data && file.response.data[0] && file.response.data[0].address)
        if (address) {
          window.open(`ipdoc${address}`, '_blank')
        }
      },
      customerView() {
        if (!this.caseDetailFormData.custId) return
        window.open(`/#/workbench/customer_management/cust_view/${this.caseDetailFormData.custId}`)
      },
      // queryAddrByAppIds(appList){
      //   if(!(appList&&appList.length))return;
      //   let appIds = appList.map(i=>i.appId).join(',')
      //   queryAddrByAppIds({appIds}).then(res=>{
      //     res.data.forEach(i=>{
      //       appList.forEach(j=>{
      //         if(j.appId == i.appId){
      //           j.addrId = i.addrId
      //           j.post = i.post
      //           j.appAddrArray = i.appAddrArray
      //         }
      //       })
      //     })
      //   })
      // },
      changeName(v, f) {
        if (!v) return
        let obj = null
        if (f == 'inventorEtitle') {
          if (this.nameList.find(i => i[f] == v && i.inventorCtitle)) {
            obj = this.nameList.find(i => i[f] == v && i.inventorCtitle)
          } else {
            obj = this.nameList.find(i => i[f] == v)
          }
        } else {
          if (this.nameList.find(i => i[f] == v && i.inventorEtitle)) {
            obj = this.nameList.find(i => i[f] == v && i.inventorEtitle)
          } else {
            obj = this.nameList.find(i => i[f] == v)
          }
        }
        if (obj) {
          if (f == 'inventorEtitle') {
            !this.patentInventorItem.inventorCtitle && (this.patentInventorItem.inventorCtitle = obj.inventorCtitle)
          } else {
            !this.patentInventorItem.inventorEtitle && (this.patentInventorItem.inventorEtitle = obj.inventorEtitle)
            !this.patentInventorItem.invAddressCn && (this.patentInventorItem.invAddressCn = obj.invAddressCn)
            !this.patentInventorItem.invAddressEn && (this.patentInventorItem.invAddressEn = obj.invAddressEn)
            !this.patentInventorItem.inventorCountry && (this.patentInventorItem.inventorCountry = obj.inventorCountry)
            !this.patentInventorItem.inventorIdno && (this.patentInventorItem.inventorIdno = obj.inventorIdno)
            !this.patentInventorItem.materialId && this.$set(this.patentInventorItem, 'materialId', obj.materialId)
            !this.patentInventorItem.address && this.$set(this.patentInventorItem, 'address', obj.address)
            !this.patentInventorItem.materialName && this.$set(this.patentInventorItem, 'materialName', obj.materialName || obj.name)
            this.inventorMaterialFileList = this.getInventorMaterialFileList(this.patentInventorItem)
          }
          // f == 'inventorEtitle' ? this.patentInventorItem.inventorCtitle = obj.inventorCtitle
          //   : this.patentInventorItem.inventorEtitle = obj.inventorEtitle
          // this.patentInventorItem.invAddressCn = obj.invAddressCn
          // this.patentInventorItem.invAddressEn = obj.invAddressEn
          // this.patentInventorItem.inventorCountry = obj.inventorCountry
          // this.patentInventorItem.inventorIdno = obj.inventorIdno
        }
      },
      changeAppNumber(v) {
        let appStr = v.split('')
        if (appStr.length > 2 && appStr[appStr.length - 2] === '.') {
          appStr[appStr.length - 2] = ''
        }
        this.caseDetailFormData.appNumber = appStr.join('')
      },
      changeNo(v, type, index) {
        if (type === 'apply') {
          if (v && this.caseDetailFormData.patentCaseApplicationList.some((i, ind) => i.no == v && ind != index)) {
            this.caseDetailFormData.patentCaseApplicationList[index].no = ''
            this.$message.error('该序号已存在')
            return
          }
        } else {
          if (v && this.caseDetailFormData.patentInventorList.some((i, ind) => i.no == v && ind != index)) {
            this.caseDetailFormData.patentInventorList[index].no = ''
            this.$message.error('该序号已存在')
            return
          }
        }
      },
      checkIsFirstApp(v, index) {
        if (v) {
          let appObj = this.caseDetailFormData.patentCaseApplicationList.find((item, ind) => item.isFirstAppliant && ind !== index)
          if (appObj) {
            this.$confirm('已经存在第一申请人，是否覆盖?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              appObj.isFirstAppliant = 0
              let no = this.caseDetailFormData.patentCaseApplicationList[index].no
              this.caseDetailFormData.patentCaseApplicationList[index].no = 1
              appObj.no = no
            }).catch(err => {
              this.caseDetailFormData.patentCaseApplicationList[index].isFirstAppliant = 0
            })
          }
        }
      },
      feeReduceChange(v) {
        v && (this.caseDetailFormData.feeReduce = fomatFloat(v, 2))
      },
      handlePatentApplication(flag, data, index) {
        this.$emit('handlePatentApplication', { flag, data, index })
        // flag == 'add' ? this.patentApplicationTitle = '添加申请人' : this.patentApplicationTitle = '修改申请人'
        // data ? this.patentApplicationItem = data : ''
        // if (flag == 'del') {
        //   this.caseDetailFormData.patentCaseApplicationList.splice(index, 1)
        // } else if (flag == 'add') {
        //   this.patentApplication = true
        //   this.listView = true
        //   this.newView = false
        //   this.editView = false
        // } else {
        //   this.appId = data.appId
        //   this.code = data.code
        //   this.patentApplication = true
        //   this.listView = false
        //   this.newView = false
        //   this.editView = true
        // }
      },

      //分案号变化
      agentNumChange(e) {
        if (!e.length) {
          this.caseDetailFormData.parentFileNo = ''
          return
        }
        e.forEach(async(item) => {
          if (this.anotherCaseNumList.length && this.anotherCaseNumList.find(i => i.agentNum == item)) {
            this.selctedArrList.push(this.anotherCaseNumList.length && this.anotherCaseNumList.find(i => i.agentNum == item))
          } else {
            let list = await queryCaseAgentNumList({ agentNum: item, pageSize: 100, pageNo: 1 })
            this.selctedArrList = this.selctedArrList.concat(list.data)
          }
        })
      },
      //另一件案号搜索事件
      queryCaseAgentNumList(query) {
        queryCaseAgentNumList({ agentNum: query, pageSize: 100, pageNo: 1 }).then(res => {
          this.anotherCaseNumList = res.data
        })
      },
      //外方代理所改变
      wfAgentChange(id) {
        if (id) {
          this.queryCustomerUrl()
        }
      },
      //外方联系人
      queryCustomerUrl() {
        if (this.caseDetailFormData.agencyCustId) {
          queryCustomerUrl({
            customerID: this.caseDetailFormData.agencyCustId
          }).then(res => {
            this.customerContactswfList = res.data.customerContacts
            this.customerAddrsList = res.data.customerAddrs
          })
        }
      },
      hideNewAppClick() {
        this.hideNewApp = !this.hideNewApp
      },
      hidePatentClick() {
        this.hidePatentBase = !this.hidePatentBase
      },
      handleScroll() {
        this.elstepList = [
          { title: '基本信息', state: true, id: 'info-title' },
          { title: '委托方', state: this.caseType == '无效', id: 'wt-title' },
          { title: '客户', state: true, id: 'cust-title' },
          { title: '申请人', state: this.caseType != '翻译', id: 'app-title' },
          { title: '许可人', state: this.caseType == '许可备案', id: 'xk-title' },
          { title: '发明人', state: !['顾问服务', '无效', '咨询', '许可备案', '翻译'].includes(this.caseType), id: 'inventor-title' },
          {
            title: '要求优先权',
            state: !['顾问服务', '无效', '咨询', '许可备案', '翻译'].includes(this.caseType),
            id: 'priority-title'
          },
          {
            title: '外代所',
            state: this.caseDetailFormData.appFromto == '内-外' || this.caseDetailFormData.appFromto == '外-外',
            id: 'wds-title'
          },

          { title: '新申请递交', state: this.caseType == '欧洲专利国家生效', id: 'new-app-title' },
          // { title: "个案信息", state: true, id: "case-info-title" },
          // { title: "PCT国家阶段", state: this.caseDetailFormData.caseType == 'PCT国家阶段', id: "country-title" },
          {
            title: '专利基础信息',
            state: ['咨询', '许可备案', '翻译', '欧洲专利国家生效'].includes(this.caseDetailFormData.caseType),
            id: 'patent-base-title'
          },
          {
            title: '母案信息',
            state: ['香港登记', '澳门登记'].includes(this.caseType),
            id: 'parent-title'
          },
          {
            title: '香港申请信息',
            state: ['香港登记'].includes(this.caseType),
            id: 'hk-app-title'
          },
          {
            title: '澳门申请信息',
            state: ['澳门登记'].includes(this.caseType),
            id: 'am-app-title'
          },
          { title: '立卷信息', state: true, id: 'create-info-title' }
        ].filter(item => item.state)
        var top1 = document.getElementsByClassName('header-info')
        var top2 = Array.prototype.slice.call(top1)

        top2 = top2.filter(
          item =>
            item.getBoundingClientRect().top > 0 &&
            item.getBoundingClientRect().top < 150
        )

        if (top2.length == 1) {
          let stepindex = ''
          this.elstepList.forEach((item, index) => {
            let items = JSON.parse(JSON.stringify(item))
            if (items.id == top2[0].id && items.state == true) {
              stepindex = index
            }
          })

          this.stepActive1 = stepindex
        }
      },
      getTopPosition(el) {
        document.getElementById(el) && document.getElementById(el).scrollIntoView()
      },
      //更改客户
      selectCustChange(e) {
        if (!e) {
          return
        }
        this.$emit('selectCustChange', e)
      },
      //客户远程搜索
      queryCustomerNameId(query) {
        this.$emit('queryCustomerNameId', query)
      },
      //关闭 添加要求优先权弹框
      closePatentPriorityClaim() {
        this.patentPriorityClaim = false
        this.patentPriorityClaimItem = {}
      },
      //添加要求优先权
      addPatentPriorityClaim(f) {
        if (f == '添加要求优先权') {
          this.caseDetailFormData.patentPriorityClaimList.push(this.patentPriorityClaimItem)
        }
        this.closePatentPriorityClaim()
      },
      //发明人操作
      handlePatentInventor(flag, data, index) {
        flag == 'add' ? this.patentInventorTitle = '添加发明人' : this.patentInventorTitle = '修改发明人'
        data ? this.patentInventorItem = data : ''
        this.patentInventorItem.notOpenSign = this.patentInventorItem.notOpenSign || '0'
        if (flag == 'del') {
          this.caseDetailFormData.patentInventorList.splice(index, 1)
        } else {
          this.patentInventor = true
          this.inventorMaterialFileList = this.getInventorMaterialFileList(this.patentInventorItem)
          this.queryInventorList()
        }
      },
      queryInventorList() {
        if (this.caseDetailFormData.patentCaseApplicationList && this.caseDetailFormData.patentCaseApplicationList.length == 0) return
        let appIdList = this.caseDetailFormData.patentCaseApplicationList.map(i => i.appId)
        queryInventorList({ appIdList }).then(res => {
          this.nameList = res.data
        })
      },
      //添加发明人
      addPatentInventor(f) {
        if (f == '添加发明人') {
          this.$set(this.patentInventorItem, 'no', this.caseDetailFormData.patentInventorList.length + 1)
          this.patentInventorItem.inventorCountryStr = this.patentCountryList.find(i => i.cityCode == this.patentInventorItem.inventorCountry)
            && this.patentCountryList.find(i => i.cityCode == this.patentInventorItem.inventorCountry).label || ''
          this.caseDetailFormData.patentInventorList.push(this.patentInventorItem)
          this.changeNo(this.caseDetailFormData.patentInventorList.length, '', this.caseDetailFormData.patentInventorList.length - 1)
        }
        this.closePatentInventor()
      },
      //关闭发明人弹框
      closePatentInventor() {
        this.patentInventor = false
        this.inventorMaterialFileList = []
        this.patentInventorItem = {
          inventorCtitle: '',
          inventorEtitle: '',
          inventorCountry: '',
          inventorIdno: '',
          invAddressEn: '',
          invAddressCn: '',
          notOpenSign: '0'
        }
      },
      //优先权操作
      handlePatentPriorityClaim(flag, data, index) {
        flag == 'add' ? this.patentPriorityClaimTitle = '添加要求优先权' : this.patentPriorityClaimTitle = '修改要求优先权'
        data ? this.patentPriorityClaimItem = data : ''
        if (flag == 'del') {
          this.caseDetailFormData.patentPriorityClaimList.splice(index, 1)
        } else {
          this.patentPriorityClaim = true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .patent-container {
    > > > .el-form {
      .el-row {
        display: flex !important;

        .header-info {
          cursor: pointer;
          display: block;
          font-size: 18px;
          padding: 15px 0px;
          color: #7199d5;
        }

        .el-col {
          display: flex;
          /*height: 42px;*/
          .el-form-item {
            flex: 1;
            border: 1px solid #d7d7d7;
            border-top: none;
            border-right: none;
            margin-bottom: 0;
            /*display: flex;*/
            /*align-items: center;*/
            /*justify-content: center;*/
            .el-form-item__content {
              min-height: 40px;
              line-height: 30px;
              padding: 5px 15px;
            }

            .el-select {
              width: 90%;
            }

            .el-input__inner {
              height: 28px;
            }

            .el-input__icon {
              line-height: 28px;
            }

            .el-input, .el-textarea {
              width: 80%;
              margin-left: 10px;
            }

            .virtual-select {
              width: 80% !important;

              .content {
                height: 28px;
                overflow: hidden;
              }
            }

            .el-form-item__label {
              /*min-height: 35px;*/
              line-height: 35px;
              height: 100%;
              border-right: 1px solid #d7d7d7;
              background-color: #f9f9f9;
            }
          }

          &:last-child {
            border-right: 1px solid #d7d7d7;
          }
        }
      }

      .border-top {
        border-top: 1px solid #d7d7d7;
      }
    }

    > > > .el-dialog {
      .el-form {
        .el-row {
          display: flex;

          .header-info {
            display: block;
            font-size: 18px;
            padding: 15px 0px;
            color: #7199d5;
          }

          .el-col {
            display: flex;
            /*height: 42px;*/
            .el-form-item {
              flex: 1;
              border: 1px solid #d7d7d7;
              border-top: none;
              border-right: none;
              margin-bottom: 0;
              align-items: center;

              .el-form-item__content {
                line-height: 30px;
              }

              .el-select {
                width: 90%;
              }

              .el-input, .el-textarea {
                width: 80% !important;
                margin-left: 10px;
              }

              .el-form-item__label {
                min-height: 40px;
                line-height: 40px;
                height: 100%;
                border-right: 1px solid #d7d7d7;
                background-color: #f9f9f9;
              }
            }

            &:last-child {
              border-right: 1px solid #d7d7d7;
            }
          }
        }

        .border-top {
          border-top: 1px solid #d7d7d7;
        }
      }
    }

    .handle {
      span {
        color: #409EFF;
        cursor: pointer;
      }
    }

    .file-box {
      box-sizing: border-box;
      width: 100%;
      min-height: 300px;
      border: 1px solid #d7d7d7;

      .file-box-left {
        width: 50%;
        height: 100%;
        border-right: 1px solid #d7d7d7;
      }

      .file-box-right {
        width: 50%;
        height: 100%;
      }
    }

    > > > .el-form-item__error {
      position: relative;
      top: 0;
    }

    .hideApp,
    .hideNewApp,
    .hidePatentBase {
      opacity: 0;
      height: 0;
      /*display: none!important;*/
      overflow: hidden;
      transition-duration: .5s;
      transition-property: all;
      transition-timing-function: ease;
      transition-delay: 0s;

    }

    .showApp,
    .showNewApp,
    .showPatentBase {
      opacity: 1;
      height: 100%;
      /*display: block;*/
      transition-duration: .5s;
      transition-property: all;
      transition-timing-function: ease;
      transition-delay: 0s;
    }

    .right {
      transform: rotate(-90deg);
      /*display: block;*/
      transition-duration: .5s;
      transition-property: all;
      transition-timing-function: ease;
      transition-delay: 0s;
    }

    .down {
      /*transform: rotate(90deg);*/
      /*display: block;*/
      transition-duration: .5s;
      transition-property: all;
      transition-timing-function: ease;
      transition-delay: 0s;
    }
  }


  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
    }
  }

  .claims {
    > > > .el-input__inner {
      border: none;
      border-bottom: 1px solid #dcdfe6;
      border-radius: 0;
      background-color: transparent;
    }
  }

  > > > .special-width {
    .el-input--suffix {
      width: 100% !important;
    }

    .el-select__tags {
      left: 10px;
    }
  }

  /deep/ .inventor-material-row {
    .el-col {
      height: auto !important;
      min-height: 70px;
    }

    .el-form-item__content {
      line-height: normal !important;
      padding-top: 5px;
      padding-bottom: 5px;
    }

    .el-upload-list {
      min-height: 28px;
      line-height: 28px;
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

</style>
