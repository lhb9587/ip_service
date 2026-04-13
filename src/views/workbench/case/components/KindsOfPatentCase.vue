<template>
  <div>
    <div class="patent-container">
      <el-form v-if="caseType == '普通新申请' || caseType == 'PCT国家阶段' || caseType == 'PCT国际申请' || caseType == '海牙国际申请' || caseType == '海牙国家阶段' " label-width="160px"
               size="small"
               class="form-container"
               :model="caseDetailFormData" :rules="rules">
        <div class="">
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
          <!--        基本信息-->
          <div>
            <el-row>
              <span class="header-info" id="info-title">基本信息</span>
            </el-row>
            <el-row class="border-top">
              <el-col :span="12">
                <el-form-item label="申请方向:" prop="appFromto">
                  <template>
                    <el-radio-group v-model="caseDetailFormData.appFromto" style="margin-left: 0px">
                      <el-radio label='外-内'></el-radio>
                      <el-radio label='内-内'></el-radio>
                      <el-radio label='内-外'></el-radio>
                      <el-radio label='外-外'></el-radio>
                      <el-radio label='台-内'></el-radio>
                    </el-radio-group>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="!isHyCaseType ? 6 : 12">
                <el-form-item label="主体法律性质:">
                  <el-radio-group v-model="caseDetailFormData.legalNature" style="margin-left: 10px">
                    <el-radio label='0'>自然人</el-radio>
                    <el-radio label='1'>法人</el-radio>
                  </el-radio-group>
                  <!--              <el-select default-first-option :clearable='true' placeholder="请选择"-->
                  <!--                         v-model="caseDetailFormData.legalNature" filterable>-->
                  <!--                <el-option :label="item.typeName" :value="item.id" v-for="item in applicantTypeList"></el-option>-->
                  <!--              </el-select>-->
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="!isHyCaseType">
                <el-form-item label="技术领域:">
                  <el-select default-first-option :clearable='true' placeholder="请选择"
                             v-model="caseDetailFormData.techField"
                             filterable>
                    <el-option :label="item.typeName" :value="item.id" v-for="item in cMtechFieldList"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="caseType === '普通新申请' ? 6 : 12">
                <el-form-item label="专利类型:" prop="patentType">
                  <el-select default-first-option :clearable='true' placeholder="请选择"
                             v-model="caseDetailFormData.patentType" filterable>
                    <el-option :disabled="caseType == 'PCT国际申请'&&(item.id == 1297 || item.id == 1298)"
                               :label="item.typeName" :value="item.id" v-for="item in patentTypeList"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="caseType === '普通新申请'">
                <el-form-item label="是否为分案:">
                  <el-radio-group v-model="caseDetailFormData.isDivcase" style="margin-left: 10px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否代交:">
                  <el-radio-group v-model="caseDetailFormData.daijiao" style="margin-left: 10px">
                    <el-radio label='Y'>是</el-radio>
                    <el-radio label='N'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="本案为中间转案:">
                  <el-radio-group v-model="caseDetailFormData.istrans" style="margin-left: 10px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>


            </el-row>

            <el-row>
              <el-col :span="(caseType == '普通新申请' && patentType != 1298) || caseType == 'PCT国家阶段' ? 12 : 24">
                <el-form-item label="案件文号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.agentNum" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col v-show="caseType == '普通新申请' && patentType != 1298 || caseType == 'PCT国家阶段'"
                      :span="caseDetailFormData.twoapp == 1 ? 6 : 12">
                <el-form-item label="一带二申请:">
                  <el-radio-group v-model="caseDetailFormData.twoapp" style="margin-left: 10px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col
                class="special-width"
                v-show="caseDetailFormData.twoapp == 1 && (caseType == '普通新申请' && patentType != 1298 || caseType == 'PCT国家阶段')"
                :span="6">
                <el-form-item label="另一件案号:">
                  <!--                <el-input type="text" size="small" v-model="caseDetailFormData.anotherApp"></el-input>-->
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
            <el-row v-if="caseType !=='海牙国家阶段'">
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
                    <i v-if="!imageUrl" class="el-icon-plus avatar-uploader-icon"></i>
                    <img v-if="imageUrl" :src="`ipdoc/${imageUrl}`" class="avatar"
                         style="max-width: 100%;max-height: 100%;object-fit: contain">
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
            <el-row v-if="!isHyCaseType">
              <el-col :span="24">
                <el-form-item label="案件日文名称:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.caseJpName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 任务7763 -->
            <el-row v-if="['外-内', '内-内'].includes(caseDetailFormData.appFromto) && caseDetailFormData.patentType == 1298">
              <el-col :span="24">
                <el-form-item label="延迟审查:">
                  <el-checkbox :true-label="1" :false-label="0" v-model="caseDetailFormData.ycsc"></el-checkbox>
                  <span style="color: #606266;">请求对本申请延迟审查，延迟期限为</span>
                  <el-input style="width: 200px;" type="number" :min="1" :max="36" size="small" v-model="caseDetailFormData.yanchi" placeholder="请输入1-36之间的数字"
                    @input="(v) => { if (v === '' || v === null || v === undefined) { caseDetailFormData.yanchi = '' } else { let n = parseInt(v); if (isNaN(n) || n < 1) { caseDetailFormData.yanchi = 1 } else if (n > 36) { caseDetailFormData.yanchi = 36 } else { caseDetailFormData.yanchi = n } } }">
                    <template slot="append">个月</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!--        客户-->
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
                  <div class="handle" style="display: inline-block">
                    <span @click="customerView">查看</span>
                  </div>

                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="来自国家:">
                  <el-select default-first-option :clearable='true' placeholder="请选择"
                             v-model="caseDetailFormData.country"
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
                    <el-option v-for="(item,key)  in invoiceTitleList" :key="key"
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
                             v-model="caseDetailFormData.custConId" @change="() => {queryCustomerContactByCustContactIdUrl('客户')}"
                             filterable>
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
                    <el-select default-first-option :clearable='true' placeholder="请选择" @change="() => {queryCustomerContactByCustContactIdUrl('账单')}"
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
                  <!--              <el-input type="text" size="small" v-model="caseDetailFormData.billAddrId"></el-input>-->
                  <el-select default-first-option :clearable='true' placeholder="请选择"
                             v-model="caseDetailFormData.billAddrId" filterable>
                    <el-option v-for="(item,key)  in billAddsList" :key="key"
                               :label="('中文:'+item.addressCn||'中文:')+';'+('英文:'+item.addressEn||'英文:')"
                               :value="item.addrId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

            </el-row>
            <el-row class="">
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
            <el-row>
              <el-col :span="24">
                <el-form-item label="个案要求:">
                  <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" size="small"
                            v-model="caseDetailFormData.custCommand"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="(caseType == '普通新申请' && patentType==1296)
          || (caseType != 'PCT国家阶段' && (patentType == 1297 || patentType == 1298))
           || (caseType == 'PCT国家阶段'  && (patentType == 1296 || patentType == 1297))
">
              <el-col :span="24">
                <el-form-item label="转出所至">
                  <el-input type="text" size="small" v-model="caseDetailFormData.alteragency"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--  申请人-->
          <div>
            <el-row>
              <div style="position:relative; width: 100%;">
                <span class="header-info" id="app-title">申请人</span>
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
                               filterable
                    >
                      <el-option v-for="(item,key)  in scope.row.appAddrArray" :key="key" :label="item.addressCn" :disabled="item.status !== '启用'"
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

          <!--        发明人-->
          <div>
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
                  width="100">
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
          <!-- 海牙国际申请-指定国家-->
          <div v-if="caseType == '海牙国际申请'">
            <el-row>
              <span class="header-info" id="wds-title">指定国家</span>
              <el-button
                type="primary"
                size="mini"
                style="position:absolute;bottom: 0;right: 0;"
                @click="handlePatentCaseCountryFee('add')"
                v-if="isShowDCF"
              >
                添加费减比例
              </el-button>
            </el-row>
            <el-row class="border-top">
              <el-col :span="(caseDetailFormData.appFromto == '内-外' || caseDetailFormData.appFromto == '外-外') ? 12 : 24" class="special-width">
                <el-form-item label="指定国家:" prop="designatedCountryList">
                  <el-select
                    clearable
                    placeholder="请选择"
                    v-model="caseDetailFormData.designatedCountryList"
                    filterable
                    multiple
                    @change="changeDesignatedCountryList"
                  >
                    <el-option
                      v-for="(item,key)  in designatedCountryOptions"
                      :key="key"
                      :label="item.countryCn"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-show="caseDetailFormData.appFromto == '内-外' || caseDetailFormData.appFromto == '外-外'">
                <el-form-item label="外方代理所:" prop="agencyCustId">
                  <VirtualSelect filterable clearable :data="hzListsList"
                                 v-model="caseDetailFormData.agencyCustId"></VirtualSelect>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="外方代理所:">
                  <VirtualSelect
                    filterable clearable
                    :data="hzListsList"
                    v-model="caseDetailFormData.agencyCustId"></VirtualSelect>
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row v-if="isShowDCF">
              <el-col :span="24">
                <el-form-item label="费减比例:">
                  <el-table
                    :data="caseDetailFormData.patentCaseCountryFeeList"
                    border
                    style="width: 100%">
                    <el-table-column
                      prop="countryCn"
                      label="国家">
                    </el-table-column>
                    <el-table-column
                      prop="economicStatus"
                      label="经济状态">
                    </el-table-column>
                    <el-table-column
                      prop="feeReduce"
                      label="费减比例">
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      width="120"
                    >
                      <template slot-scope="scope">
                        <div class="handle">
                          <span @click="handlePatentCaseCountryFee('edit', scope.row)">修改</span>
                          <span @click="handlePatentCaseCountryFee('del',{}, scope.$index)">删除</span>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--        外代所-->
          <div v-if="(caseDetailFormData.appFromto == '内-外' || caseDetailFormData.appFromto == '外-外') && caseType !== '海牙国际申请'">
            <el-row>
              <span class="header-info" id="wds-title">外代所</span>
            </el-row>
            <el-row class="border-top">
              <el-col :span="6" v-if="caseType == '海牙国家阶段'">
                <el-form-item label="进入国家:" prop="toCountry">
                  <el-select
                    clearable
                    placeholder="请选择"
                    v-model="caseDetailFormData.toCountry"
                    filterable
                  >
                    <el-option
                      v-for="(item,key)  in designatedCountryOptions"
                      :key="key"
                      :label="item.countryCn"
                      :value="item.countryCn"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-else>
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
                <el-form-item label="外方案号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.agencyCustRefno"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="外方代理所:" prop="agencyCustId">
                  <VirtualSelect filterable clearable :data="hzListsList"
                                 v-model="caseDetailFormData.agencyCustId"></VirtualSelect>
                  <!--                  <el-select default-first-option :clearable='true' placeholder="请选择"-->
                  <!--                             v-model="caseDetailFormData.agencyCustId"-->
                  <!--                             filterable>-->
                  <!--                    <el-option v-for="(item,key)  in hzListsList" :key="key" :label="item.label"-->
                  <!--                               :value="item.value">-->
                  <!--                    </el-option>-->
                  <!--                  </el-select>-->
                  <!--                  <virtual-select class="virtual-select" clearable :data="hzListsList"-->
                  <!--                                  v-model="caseDetailFormData.agencyCustId"-->
                  <!--                                  @change="wfAgentChange" filterable></virtual-select>-->
                </el-form-item>
              </el-col>


            </el-row>
            <el-row class="">
              <el-col :span="12">
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
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="外方要求:">
                  <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" size="small"
                            v-model="caseDetailFormData.agencyCustReq"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!--        要求优先权-->
          <div>
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
          <!-- 海牙国家阶段 -->
          <div v-if="caseType == '海牙国家阶段'">
            <el-row>
              <span class="header-info" id="country-title">海牙国家阶段</span>
            </el-row>
            <el-row class="border-top">
              <el-col :span="6">
                <el-form-item label="国际受理局:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctRecOffice"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="优先权日:">
                  {{caseDetailFormData.priorityAppDate}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="WIPO/受理局提交号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctOpenNumber"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="海牙申请号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctFileNo"
                            @change="changeAppNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="海牙申请日:">
                  <el-date-picker
                    v-model="caseDetailFormData.appDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="海牙注册号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.hyRegNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="海牙注册日:">
                  <el-date-picker
                    v-model="caseDetailFormData.pctOpenDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    @change="changePctOpenDate"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品分类:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.productClassification"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="海牙公布日:">
                  <el-date-picker
                    v-model="caseDetailFormData.hyAnnouncementDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
           </div>
          <!--        新申请递交-->
          <div>
            <el-row>
          <span class="header-info" id="new-app-title" @click="hideNewAppClick">新申请递交<i class="el-icon-arrow-down"
                                                                                        :class="[hideNewApp ? 'right' : 'down']"></i></span>
            </el-row>
            <div v-if="caseType === '海牙国际申请' || caseType === '海牙国家阶段'" :class="[hideNewApp ? 'hideNewApp' : 'showNewApp']">
              <el-row class="border-top">
                <el-col :span="6">
                  <el-form-item label="相似设计项数:">
                    <el-input type="number" size="small" v-model="caseDetailFormData.wgxsNum"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="成套设计项数:">
                    <el-input type="number" size="small" v-model="caseDetailFormData.wgctNum"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="局部设计:">
                    <el-radio-group v-model="caseDetailFormData.jusjbj" style="margin-left: 10px">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="要求DAS:">
                    <el-radio-group v-model="caseDetailFormData.das" style="margin-left: 10px">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
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
                      reserve-keyword
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
                <el-col :span="12">
                  <el-form-item label="要求提交IDS:">
                    <el-radio-group v-model="caseDetailFormData.needIds" style="margin-left: 10px">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <el-row v-if="caseType === '海牙国际申请'">
                <el-col :span="12">
                  <el-form-item label="经济状态:" prop="economicStatus">
                    <el-select
                      v-model="caseDetailFormData.economicStatus"
                      clearable
                      placeholder="请选择"
                      @change="changeEconomicStatus"
                    >
                      <el-option
                        v-for="item in economicStatusOptions"
                        :key="item.economicStatus"
                        :label="item.economicStatus"
                        :value="item.economicStatus"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="费减比例:" prop="feeReduce">
                    {{ caseDetailFormData.feeReduce }}
                  </el-form-item>
                </el-col>
              </el-row> -->
              <el-row  v-if="caseType === '海牙国际申请'">
                <el-col :span="6">
                  <el-form-item label="申请人邮箱:">
                    <el-input type="text" size="small" v-model="caseDetailFormData.appEmail"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="caseDetailFormData.appAnnouncementTime == 2268 ? 12 : 18">
                  <el-form-item label="申请公布时间">
                    <el-select
                      v-model="caseDetailFormData.appAnnouncementTime"
                      clearable
                      @change="changeAppAnnounceTime"
                    >
                      <el-option
                        v-for="item in appAnnouncementTimeList"
                        :key="item.id"
                        :label="item.typeName"
                        :value="String(item.id)"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span=6 v-if="caseDetailFormData.appAnnouncementTime == 2268">
                  <el-form-item label="具体月数">
                    <el-input
                      type="number"
                      :min="2"
                      :max="12"
                      size="small"
                      v-model="caseDetailFormData.hyCustomAnnouncementMonth"
                      @change="changeHyAnnouncementMonth"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" v-show="hasPatentPriority">
                  <el-form-item label="缺优证文件:">
                    <el-radio-group v-model="caseDetailFormData.priorityFile" style="margin-left: 10px">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="caseType === '海牙国际申请'">
                <el-col :span="24">
                  <el-form-item label="简要说明（英文）:">
                    <el-input
                      size="small"
                      v-model="caseDetailFormData.briefDescription"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-else>
              <div v-if="!(caseType == '普通新申请' && patentType == 1298)"
                 :class="[hideNewApp ? 'hideNewApp' : 'showNewApp']">
                <div v-if="caseType == 'PCT国际申请'">
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
                        <!--                      <el-input type="number" size="small" @change="feeReduceChange"-->
                        <!--                                v-model="caseDetailFormData.feeReduce"></el-input>-->
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="摘要附图页数:">
                        <el-input type="text" size="small" v-model="caseDetailFormData.substractDrawing"></el-input>
                      </el-form-item>
                    </el-col>

                  </el-row>
                </div>
                <div v-else>
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

                    <el-col :span="hasPatentPriority ? 6: 12">
                      <el-form-item label="摘要附图指定图:">
                        <el-input type="text" size="small" v-model="caseDetailFormData.substractDrwno"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="hasPatentPriority ? 6: 12">
                      <el-form-item label="缺委托书:">
                        <el-radio-group :disabled="hasZw" v-model="caseDetailFormData.nopower" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="caseType != 'PCT国家阶段' && hasPatentPriority">
                      <el-form-item label="缺优证文件:">
                        <el-radio-group v-model="caseDetailFormData.priorityFile" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col v-if="caseType == 'PCT国家阶段' && hasPatentPriority" :span="12">
                      <el-form-item></el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="">
                    <el-col :span="caseType == '普通新申请' || caseType == 'PCT国家阶段' ? 6 : 12">
                      <el-form-item label="要求DAS:">
                        <!--              <el-input type="text" size="small" v-model="caseDetailFormData.das"></el-input>-->
                        <el-radio-group v-model="caseDetailFormData.das" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="caseDetailFormData.appFromto == '内-内'">
                      <el-form-item label="预审案件:">
                        <el-radio-group v-model="caseDetailFormData.preexamine" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="caseDetailFormData.appFromto != '内-内'">
                      <el-form-item></el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="caseType == '普通新申请'">
                      <el-form-item label="要求优先审查:">
                        <el-radio-group v-model="caseDetailFormData.tqsc" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="caseType == '普通新申请'&&caseDetailFormData.appFromto == '内-内'&&caseDetailFormData.patentType == 1296">
                      <el-form-item label="是集中审查:">
                        <el-radio-group v-model="caseDetailFormData.focusReview" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col v-if="caseType == 'PCT国家阶段'" :span="12">
                      <el-form-item>
                        <span slot="label">要求审查高速公路<br>(PPH)</span>
                        <el-radio-group v-model="caseDetailFormData.dopph" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row v-show="caseType == 'PCT国家阶段' && (patentType == 1296 || patentType == 1297)">
                    <el-col :span="6">
                      <el-form-item label="进入国家阶段期限:">
                        <!--              <el-input type="text" size="small"></el-input>-->
                        <el-radio-group style="margin-left: 10px" v-model="caseDetailFormData.pctKxq">
                          <el-radio style="margin-top: 10px" :label='1458'>提前进入</el-radio>
                          <el-radio style="margin-top: 10px" :label='1459'>30个月内提交</el-radio>
                          <el-radio style="margin-top: 10px" :label='1460'>32个月内提交</el-radio>
                          <el-radio style="margin-top: 10px" :label='1461'>31个月内提交</el-radio>
                        </el-radio-group>

                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="根据条约第19条修改的权利要求和声明:">
                        <!--              <el-input type="text" size="small" v-model="caseDetailFormData.xgwjyw1"></el-input>-->
                        <el-radio-group v-model="caseDetailFormData.xgwjyw1" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <!--                  <el-col :span="6">-->
                    <!--                    <el-form-item label="根据条约第19条修改时的声明:">-->
                    <!--                      &lt;!&ndash;              <el-input type="text" size="small" v-model="caseDetailFormData.xgwjyw2"></el-input>&ndash;&gt;-->
                    <!--                      <el-radio-group v-model="caseDetailFormData.xgwjyw2" style="margin-left: 10px">-->
                    <!--                        <el-radio :label='1'>是</el-radio>-->
                    <!--                        <el-radio :label='0'>否</el-radio>-->
                    <!--                      </el-radio-group>-->

                    <!--                    </el-form-item>-->
                    <!--                  </el-col>-->
                    <el-col :span="6">
                      <el-form-item label="修改文件（28或41条）:">
                        <!--              <el-input type="text" size="small" v-model="caseDetailFormData.xgwj"></el-input>-->
                        <el-radio-group v-model="caseDetailFormData.xgwj" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="修改文件（34条）:">
                        <!--              <el-input type="text" size="small" v-model="caseDetailFormData.xgwj"></el-input>-->
                        <el-radio-group v-model="caseDetailFormData.law34" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>

                  </el-row>


                  <div v-if="caseType == '普通新申请' && patentType==1296">
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
                      <el-col v-show="caseDetailFormData.needdiv == 1 " :span="6" class="special-width">
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
                          <!--                        <el-input type="number" size="small"-->
                          <!--                                  @change="feeReduceChange"-->
                          <!--                                  v-model="caseDetailFormData.feeReduce"></el-input>-->
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="要求新申请同时提实审:">
                          <el-radio-group v-model="caseDetailFormData.tstss" style="margin-left: 10px">
                            <el-radio :label='1'>是</el-radio>
                            <el-radio :label='0'>否</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="提前公布:">
                          <el-radio-group v-model="caseDetailFormData.tqgk" style="margin-left: 10px">
                            <el-radio :label='1'>是</el-radio>
                            <el-radio :label='0'>否</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>

                  <div v-show="caseType == 'PCT国家阶段'  && (patentType == 1296 || patentType == 1297)">
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
                        <!--                    <el-col :span="6">-->

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
                            reserve-keyword
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
                      <el-col :span="patentType == 1296 ? 6 :12">
                        <el-form-item label="要求提交IDS:">
                          <el-radio-group v-model="caseDetailFormData.needIds" style="margin-left: 10px">
                            <el-radio :label='1'>是</el-radio>
                            <el-radio :label='0'>否</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col :span="patentType == 1296 ? 6 :12">
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
                          <!--                        <el-input type="number" size="small"-->
                          <!--                                  @change="feeReduceChange"-->
                          <!--                                  v-model="caseDetailFormData.feeReduce"></el-input>-->
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" v-if="patentType == 1296">
                        <el-form-item label="要求新申请同时提实审:">
                          <!--              <el-input type="text" size="small" v-model="caseDetailFormData.tstss"></el-input>-->
                          <el-radio-group v-model="caseDetailFormData.tstss" style="margin-left: 10px">
                            <el-radio :label='1'>是</el-radio>
                            <el-radio :label='0'>否</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" v-if="patentType == 1296">
                        <el-form-item label="提前公布:">
                          <el-radio-group v-model="caseDetailFormData.tqgk" style="margin-left: 10px">
                            <el-radio :label='1'>是</el-radio>
                            <el-radio :label='0'>否</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>

                  <el-row v-show="caseType == '普通新申请' && (patentType == 1297 || patentType == 1298)">
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
                          reserve-keyword
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
                        <!--                      <el-input type="number" size="small"-->
                        <!--                                @change="feeReduceChange"-->
                        <!--                                v-model="caseDetailFormData.feeReduce"></el-input>-->
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>

              <div v-else :class="[hideNewApp ? 'hideNewApp' : 'showNewApp']">
                <el-row class="border-top">
                  <el-col :span="6">
                    <el-form-item label="相似设计项数:">
                      <el-input type="number" size="small" v-model="caseDetailFormData.wgxsNum"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="成套设计项数:">
                      <el-input type="number" size="small" v-model="caseDetailFormData.wgctNum"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="局部设计:">
                      <el-radio-group v-model="caseDetailFormData.jusjbj" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="缺委托书:">
                      <el-radio-group :disabled="hasZw" v-model="caseDetailFormData.nopower" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div>
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="请求优先审查:">
                        <el-radio-group v-model="caseDetailFormData.tqsc" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="要求DAS:">
                        <el-radio-group v-model="caseDetailFormData.das" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="hasPatentPriority">
                      <el-form-item label="缺优证文件:">
                        <el-radio-group v-model="caseDetailFormData.priorityFile" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="hasPatentPriority ? 6 : 12">
                      <el-form-item label="预审案件:">
                        <el-radio-group v-model="caseDetailFormData.preexamine" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
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
                          reserve-keyword
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
                        <!--                      <el-input type="number" size="small"-->
                        <!--                                @change="feeReduceChange"-->
                        <!--                                v-model="caseDetailFormData.feeReduce"></el-input>-->
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row>
                    <el-col :span="caseDetailFormData.ishk == 1 ? 12 : 24">
                      <el-form-item label="要求提交香港申请:">
                        <el-radio-group v-model="caseDetailFormData.ishk" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col class="special-width" v-show="caseDetailFormData.ishk == 1" :span="12">
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
                  </el-row>
                </div>
              </div>
            </div>

            <el-row :class="[hideNewApp ? 'hideNewApp' : 'showNewApp']" v-if="caseDetailFormData.appFromto == '外-内'">
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

          <!-- 海牙国际申请 -->
          <div v-if="caseType == '海牙国际申请'">
            <el-row>
              <span class="header-info" id="country-title">海牙国际申请</span>
            </el-row>
            <el-row class="border-top">
              <el-col :span="6">
                <el-form-item label="国际受理局:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctRecOffice"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="海牙申请日:">
                  <el-date-picker
                    v-model="caseDetailFormData.appDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="海牙申请号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctFileNo"
                            @change="changeAppNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="WIPO/受理局提交号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctOpenNumber"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="海牙注册日:">
                  <el-date-picker
                    v-model="caseDetailFormData.pctOpenDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    @change="changePctOpenDate"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="海牙注册号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.hyRegNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="优先权日:">
                  {{caseDetailFormData.priorityAppDate}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="递交语言:">
                  <el-radio-group v-model="caseDetailFormData.pctLanguage" style="margin-left: 10px">
                    <el-radio label='E'>英文</el-radio>
                    <el-radio label='C'>中文</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品分类:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.productClassification"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="海牙公布日:">
                  <el-date-picker
                    v-model="caseDetailFormData.hyAnnouncementDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--       PCT国家阶段 -->
          <div v-if="caseType == 'PCT国家阶段'">
            <el-row>
              <span class="header-info" id="country-title">PCT国家阶段</span>
            </el-row>
            <el-row class="border-top">
              <el-col :span="6">
                <el-form-item label="国际受理局:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctRecOffice"></el-input>

                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="检索单位:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctSearchAu"></el-input>

                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="初审单位:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctPreliexAu"></el-input>

                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
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
                <el-form-item label="国际公开号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctOpenNumber"></el-input>

                </el-form-item>
              </el-col>
            </el-row>

          </div>

          <!--        PCT国际阶段-->
          <div v-if="caseType == 'PCT国际申请'">
            <el-row>
              <span class="header-info" id="world-title">PCT国际申请</span>
            </el-row>
            <el-row class="border-top">
              <el-col :span="6">
                <el-form-item label="国际受理局:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctRecOffice"></el-input>

                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="检索单位:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctSearchAu"></el-input>

                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="初审单位:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctPreliexAu"></el-input>

                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
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
                <el-form-item label="PCT申请号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctFileNo"
                            @change="changeAppNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="PCT公开号:">
                  <el-input type="text" size="small" v-model="caseDetailFormData.pctOpenNumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="PCT公开日:">
                  <el-date-picker
                    v-model="caseDetailFormData.pctOpenDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="国际初审日:">
                  <el-date-picker
                    v-model="caseDetailFormData.pctPreliexDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="优先权日:">
                  {{caseDetailFormData.priorityAppDate}}
                  <!--                  <el-date-picker-->
                  <!--                    v-model="caseDetailFormData.priorityAppDate"-->
                  <!--                    type="date"-->
                  <!--                    placeholder="选择日期"-->
                  <!--                    value-format="yyyy-MM-dd">-->
                  <!--                  </el-date-picker>-->
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="要求国际初步审查:">
                  <el-radio-group v-model="caseDetailFormData.pctPreliex" style="margin-left: 10px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="递交语言:">

                  <el-radio-group v-model="caseDetailFormData.pctLanguage" style="margin-left: 10px">
                    <el-radio label='E'>英文</el-radio>
                    <el-radio label='C'>中文</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--专利基础信息 海牙国际申请-->
          <div v-if="caseType === '海牙国际申请'">
            <el-row>
              <span class="header-info" id="patent-base-title" @click="hidePatentClick">
                专利基础信息
                <i class="el-icon-arrow-down":class="[hidePatentBase ? 'right' : 'down']"></i>
              </span>
            </el-row>
            <el-row class="border-top">
              <el-col :span="12">
                <el-form-item label="年费监视:">
                  <el-radio-group v-model="caseDetailFormData.isagency" style="margin-left: 10px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="首次年费日期:">
                  <el-date-picker
                    v-model="caseDetailFormData.firstYearDate"
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
          <!--        专利基础信息-->
          <div v-else>
            <el-row>
          <span class="header-info" id="patent-base-title" @click="hidePatentClick">专利基础信息<i class="el-icon-arrow-down"
                                                                                             :class="[hidePatentBase ? 'right' : 'down']"></i></span>
            </el-row>
            <div v-if="!((caseType == '普通新申请' && patentType == 1298) || caseType == '海牙国家阶段')"
                 :class="[hidePatentBase ? 'hidePatentBase' : 'showPatentBase']">
              <div v-if="caseType == 'PCT国际申请' && patentType == 1296">
                <el-row class="border-top">
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
              <div v-else>
                <el-row class="border-top">
                  <el-col :span="(caseType != 'PCT国家阶段' && !(caseType == '普通新申请' && patentType == 1297)) ||
                   ((caseType == 'PCT国际申请' && (patentType == 1296 || patentType == 1297 || patentType == 1298) ) || (caseType == 'PCT国家阶段' && (patentType == 1296 ||patentType == 1297)) || (caseType == '普通新申请' && (patentType == 1297||patentType == 1298))) ?6:12">
                    <el-form-item label="优先权日:">
                      {{caseDetailFormData.priorityAppDate}}
                      <!--                      <el-date-picker-->
                      <!--                        v-model="caseDetailFormData.priorityAppDate"-->
                      <!--                        type="date"-->
                      <!--                        placeholder="选择日期"-->
                      <!--                        value-format="yyyy-MM-dd">-->
                      <!--                      </el-date-picker>-->
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
                  <el-col :span="caseType=='海牙国家阶段'?12:6">
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
                <el-row class="" v-if="patentType != 1297">
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
                  <el-col :span="6" v-if="patentType != 1297">
                    <el-form-item label="实审日期:">
                      <el-date-picker
                        v-model="caseDetailFormData.subexamDate"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-else>
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
                <el-row v-show="caseType == 'PCT国家阶段' && (patentType == 1296 || patentType == 1297)">
                  <el-col :span="12">
                    <el-form-item label="年费公司:">
                      <el-input type="text" min="1" max="100" size="small"
                                v-model="caseDetailFormData.ngCli"></el-input>
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
                  <!--                  <el-col :span="6">-->
                  <!--                    <el-form-item label="费减比例:">-->
                  <!--                      <el-input type="number" min="1" max="100" size="small"-->
                  <!--                                v-model="caseDetailFormData.feeReduce"></el-input>-->
                  <!--                    </el-form-item>-->
                  <!--                  </el-col>-->
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
            <div v-else :class="[hidePatentBase ? 'hidePatentBase' : 'showPatentBase']">
              <el-row class="border-top">
                <el-col :span="6" v-if="caseType !=='海牙国家阶段'">
                  <el-form-item label="产品分类:">
                    <el-input type="text" size="small" v-model="caseDetailFormData.classNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseType !=='海牙国家阶段'">
                  <el-form-item label="优先权日:">
                    {{caseDetailFormData.priorityAppDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="caseType !=='海牙国家阶段' ? 6 :12">
                  <el-form-item label="申请号:">
                    <el-input
                      v-if="caseDetailFormData.appFromto == '外-内' || caseDetailFormData.appFromto == '内-内' || caseDetailFormData.appFromto == '台-内'"
                      type="text" size="small"
                      v-model="caseDetailFormData.appNumberStr" @change="changeAppNumber"></el-input>
                    <el-input v-else type="text" size="small"
                              v-model="caseDetailFormData.appNumber"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="caseType !=='海牙国家阶段' ? 6 :12">
                  <el-form-item label="申请日:">
                    <el-date-picker
                      v-model="caseDetailFormData.appDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </el-col>


                <!--                <el-col :span="12">-->
                <!--                  <el-form-item label="费减比例:">-->
                <!--                    <el-input type="number" min="1" max="100" size="small"-->
                <!--                              v-model="caseDetailFormData.feeReduce"></el-input>-->
                <!--                  </el-form-item>-->
                <!--                </el-col>-->
              </el-row>
              <el-row>
                <el-col :span="12">
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
              <el-row
                v-if="(caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.length)||caseDetailFormData.isDivcase">
                <el-col v-if="caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.length" :span="12">
                  <el-form-item label="针对分案申请号:">
                    <el-input type="text" size="small" v-model="caseDetailFormData.parentFileNo"></el-input>

                  </el-form-item>
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

                <el-col :span="12" v-if="!caseDetailFormData.isDivcase">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="12" v-if="!(caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.length)">
                  <el-form-item></el-form-item>
                </el-col>

              </el-row>

              <el-row>
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
          </div>

          <!--        立卷信息-->
          <div>
            <el-row>
              <span class="header-info" id="create-info-title">立卷信息</span>
            </el-row>
            <el-row class="border-top"
                    v-if="(caseType == '普通新申请' && (patentType == 1296 || patentType == 1297))">
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
                  <!--                  <el-select v-model="caseDetailFormData.createUserId" filterable clearable placeholder="请选择">-->
                  <!--                    <el-option-->
                  <!--                      v-for="item in $store.getters.allUserList"-->
                  <!--                      :key="item.userId"-->
                  <!--                      :label="item.fullname"-->
                  <!--                      :value="item.userId">-->
                  <!--                      &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                  <!--                    </el-option>-->
                  <!--                  </el-select>-->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="border-top"
                    v-else-if="(caseType == 'PCT国际申请' && (patentType == 1296 || patentType == 1297 || patentType == 1298) ) || (caseType == 'PCT国家阶段' && (patentType == 1296 ||patentType == 1297)) || (caseType == '普通新申请' && (patentType == 1297||patentType == 1298))">
              <el-col :span="12">
                <el-form-item label="收案日期:">
                  <el-date-picker
                    v-model="caseDetailFormData.receiveDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <!--              <el-col :span="6">-->
              <!--                <el-form-item label="递交日期:">-->
              <!--                  <el-date-picker-->
              <!--                    v-model="caseDetailFormData.submitDate"-->
              <!--                    type="date"-->
              <!--                    placeholder="选择日期"-->
              <!--                    value-format="yyyy-MM-dd">-->
              <!--                  </el-date-picker>-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
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
                  <VirtualSelect disabled clearable filterable :data="$store.getters.allUserList"
                                 v-model="caseDetailFormData.createUserId"></VirtualSelect>
                  <!--                  <el-select v-model="caseDetailFormData.createUserId" filterable clearable placeholder="请选择">-->
                  <!--                    <el-option-->
                  <!--                      v-for="item in $store.getters.allUserList"-->
                  <!--                      :key="item.userId"-->
                  <!--                      :label="item.fullname"-->
                  <!--                      :value="item.userId">-->
                  <!--                      &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                  <!--                    </el-option>-->
                  <!--                  </el-select>-->
                </el-form-item>
              </el-col>

            </el-row>
            <el-row
              v-if="(caseType == 'PCT国家阶段' && patentType == 1297) || (caseType == 'PCT国际申请' && patentType == 1296 ) || (caseType == '普通新申请' && ( patentType == 1298))">
              <el-col :span="24">
                <el-form-item label="财务备注:">
                  <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" size="small"
                            v-model="caseDetailFormData.memo2"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-else>
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

          <!--        -->
        </div>
      </el-form>

      <patent-common-case v-else
                          @changeCust="queryCustomerContactByCustContactIdUrl"
                          @handlePatentApplication="commonHandleApp"
                          @changeActive="changeActive"
                          @queryCustomerNameId="queryCustomerNameId"
                          @selectCustChange="selectCustChange"
                          :caseDetailFormData="caseDetailFormData"
                          :rules="rules"
                          :patentTypeList="patentTypeList"
                          :techFieldList="cMtechFieldList"
                          :queryCustomerNameIdList="queryCustomerNameIdList"
                          :countryList="countryList"
                          :customerContactsList="customerContactsList"
                          :billContactsList="billContactsList"
                          :billAddsList="billAddsList"
                          :customerMailAddsList="customerMailAddsList"
                          :hzListsList="hzListsList"
                          :custStatusList="custStatusList"
                          :statusList="statusList"
                          :patentCountryList="patentCountryList"
                          :patentCountryArray="patentCountryArray"
                          :invoiceTitleList="invoiceTitleList"
      ></patent-common-case>

      <!--费减比例弹窗-->
      <el-dialog
        :close-on-click-modal="false"
        :title="patentCaseCountryFeeTitle"
        :visible.sync="patentCaseCountryFeeVisible"
        width="30%"
      >
        <el-form v-model="patentCaseCountryFeeItem" label-width="130px">
          <el-row class="border-top">
            <el-col :span="24">
              <el-form-item label="国家:">
                <el-select
                  clearable
                  placeholder="请选择国家"
                  v-model="patentCaseCountryFeeItem.pcdcId"
                  filterable
                  size="small"
                  @change="changeDesignatedCountry"
                >
                  <el-option
                    v-for="(item,key)  in designatedCountryOptions"
                    :key="key"
                    :label="item.countryCn"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="经济状态:">
                <el-select
                  clearable
                  placeholder="请选择经济状态"
                  v-model="patentCaseCountryFeeItem.pcdcfId"
                  size="small"
                  @change="changeEconomicStatus"
                >
                  <el-option
                    v-for="(item,key)  in economicStatusOptions"
                    :key="key"
                    :label="item.economicStatus"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="费减比例:">
                  {{ patentCaseCountryFeeItem.feeReduce }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer fl-ac-jc">
          <el-button size="mini" @click="closePatentCaseCountryFee">取 消</el-button>
          <el-button size="mini" type="primary" @click="addPatentCaseCountryFee(patentCaseCountryFeeTitle)">确 定</el-button>
        </span>
      </el-dialog>
      <div>
        <!--    弹框-->
        <!--        优先权-->
        <el-dialog
          :close-on-click-modal="false"
          :title="patentPriorityClaimTitle"
          :visible.sync="patentPriorityClaim"
          width="30%"
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

        <!--        发明人-->
        <el-dialog
          :close-on-click-modal="false"
          :title="patentInventorTitle"
          :visible.sync="patentInventor"
          width="30%"
        >
          <div>
            <el-form v-model="patentInventorItem" label-width="130px">
              <el-row class="border-top">
                <el-col :span="24">
                  <el-form-item label="中文名称:">
                    <!--                    <el-input type="text" size="small" v-model="patentInventorItem.inventorCtitle"></el-input>-->
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
                    <!--                    <el-input type="text" size="small" v-model="patentInventorItem.inventorEtitle"></el-input>-->
                    <el-select :clearable='true' placeholder="请选择"
                               v-model="patentInventorItem.inventorEtitle"
                               allow-create
                               filterable
                               @change="(v)=>changeName(v, 'inventorEtitle')"
                    >
                      <el-option v-for="(item,key)  in nameList.filter(i => i.inventorEtitle)" :key="key" :label="item.inventorEtitle"
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
              <el-row class="">
                <el-col :span="24">
                  <el-form-item label="国籍:">
                    <el-select :clearable='true' placeholder="请选择"
                               v-model="patentInventorItem.inventorCountry"
                               filterable>
                      <el-option v-for="(item,key)  in patentCountryList" :key="key" :label="item.value"
                                 :value="item.cityCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <!--              <el-row class="">-->
              <!--                <el-col :span="24">-->
              <!--                  <el-form-item label="发明人证件类型:">-->
              <!--                    <el-input type="text" size="small" v-model="patentInventorItem.invcardType"></el-input>-->
              <!--                  </el-form-item>-->
              <!--                </el-col>-->
              <!--              </el-row>-->
              <el-row class="">
                <el-col :span="24">
                  <el-form-item label="不公开标志:">
                    <el-radio-group v-model="patentInventorItem.notOpenSign" style="margin-left: 10px">
                      <el-radio label='1'>是</el-radio>
                      <el-radio label='0'>否</el-radio>
                    </el-radio-group>
                    <!--                    <el-input type="text" size="small" v-model="patentInventorItem.notOpenSign"></el-input>-->
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

    </div>

    <!--    申请人-->
    <el-dialog
      :close-on-click-modal="false"
      :modal-append-to-body="true"
      :modal="true"
      class="abow_dialog"
      :title="patentApplicationTitle"
      :visible.sync="patentApplication"
      width="80%"
      :before-close="(done)=>{this.appId = '';this.listView = false;done()}"
    >
      <ApplicantDetail @checked="checkedAppItem" @clickBack="clickBack" v-if="newView"
                       :cust-id="caseDetailFormData.custId" :is-edit="false" :patent="true"/>
      <ApplicantDetail @checked="checkedAppItem" @clickBack="clickBack" v-if="editView" :firstApp="firstApp"
                       :app-id="appId" :is-edit="true" :patent="true"/>
      <applicant_list v-if="listView" @openNew="openNew" @checked="checkedAppItem"
                      :cust-name="caseDetailFormData.custName" :custId="caseDetailFormData.custId"
                      :patent="true"></applicant_list>

      <span slot="footer" class="dialog-footer fl-ac-jc">
<!--              <el-button size="mini" @click="checkedAppItem('')" type="primary">取 消</el-button>-->
        <!--        <el-button size="mini" type="primary" @click="addApplication">确 定</el-button>-->
            </span>
    </el-dialog>
  </div>
</template>

<script>
  import { creatematerialUrl } from '@/api/serviceApi.config.js'
  import { formatAmount, fomatFloat, toFixed1, toFixed2 } from '@/utils/filters'
  import {
    queryCPCAddr
  } from '@/api/applicant'
  import patentCommonCase from './patentCommonCase'
  import {
    tmdetail,
    queryAgencyName,
    queryAlltask,
    modifyjoinapp,
    createCode,
    queryCustomerNameId,
    getCaseTime,
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
    queryPatentCountry,
    queryDesignatedCountry,
    queryDesignatedCountryFee,
    queryCaseByPctFileNo
  } from '@/api/caseDetail'
  import { queryAddrByAppIds } from '@/api/applicant'
  import { billSubmitUrl, billDiscount } from '@/api/billApi'
  import { querycustSelectClass } from '@/api/customerList.js'
  import ApplicantDetail from '../../customer_management/applicant/components/ApplicantDetail'
  import Applicant_list from '../../customer_management/applicant/applicant_list'

  export default {
    name: 'KindsOfPatentCase',
    components: {
      Applicant_list,
      ApplicantDetail,
      patentCommonCase
    },
    props: {
      isEdit: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      isShowDCF(){
        const arrayA = [102,122,143]
        const arrayB = this.caseDetailFormData.designatedCountryList || []
        return arrayA.some(num => arrayB.includes(num))
      },
      isHyCaseType(){
        return this.caseType === '海牙国际申请' || this.caseType === '海牙国家阶段'
      },
      hasApplicationType(){
        return this.caseDetailFormData.patentCaseApplicationList&&this.caseDetailFormData.patentCaseApplicationList.find(item => item.applicationType == '1752')
      },
      cMtechFieldList() {
        if (this.caseDetailFormData.patentType == 1298) {
          return this.wGtechFieldList
        } else {
          return this.techFieldList
        }
      },
      patentType() {
        return this.caseDetailFormData.patentType
      },
      caseType() {
        return this.caseDetailFormData.caseType
      }
    },
    data() {
      var checkfeeReduce = (rule, value, callback) => {
        if (value > 1 || value < 0) {
          callback(new Error('费减比例数据错误'))
        }
      }
      return {
        invoiceTitleList: [],
        designatedCountryOptions:[],
        selctedArrList: [],
        imageUrl: '',
        imageData: {
          tokenID: this.$store.getters.token,
          materialTypeId: 301510
        },
        creatematerialUrl,
        nameList: [],
        hasZw: false,
        hasPatentPriority: false,
        nullValueList: [],
        backData: {},
        firstApp: '',
        code: '',
        appId: '',
        editView: false,
        listView: false,
        newView: false,
        patentApplicationTitle: '',
        patentApplication: false,
        patentApplicationItem: {},
        anotherCaseNumList: [],
        elstepList: [],
        stepActive1: 0,
        hidePatentBase: false,
        hideNewApp: false,
        hideApp: false,
        rules: {
          agencyCustId:[{ required: true, message: '请选择外方代理所', trigger: 'change' }],
          feeReduce: [
            { validator: checkfeeReduce, trigger: 'change' }
          ],
          toCountry: [{ required: true, message: '请选择进入国家', trigger: 'change' }],
          patentType: [{ required: true, message: '请选择专利类型', trigger: 'change' }],
          appFromto: [{ required: true, message: '请选择申请方向', trigger: 'change' }],
          caseCnName: [{ required: true, message: '请填写案件中文名称', trigger: 'blur' }]
          // custId: [{ required: true, message: '请选择客户', trigger: 'change' },],
          // executor: [{ required: true, message: '请选择任务执行人', trigger: 'change' },],
        },
        curCustLevel: false,
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
        patentCaseCountryFeeTitle: '',
        patentPriorityClaimItem: {},
        patentCaseCountryFeeItem: {},
        patentPriorityClaim: false,
        patentCaseCountryFeeVisible: false,
        caseDetailFormData: {},
        caseIds: '',
        applicantTypeList: [],
        patentTypeList: [],
        wGtechFieldList: [],
        techFieldList: [],
        patentCountryList: [],
        patentCountryArray: [],
        countryList: [],
        customerContactsList: [],
        customerMailAddsList: [],
        wfCustomerMailAddsList: [],
        billAddsList: [],
        billContactsList: [],
        hzListsList: [],
        customerContactswfList: [],
        customerAddrsList: [],
        statusList: [],
        custStatusList: [],
        queryCustomerNameIdList: [],
        appAnnouncementTimeList:[],
        economicStatusOptions:[]
      }
    },
    watch: {
      // 'caseDetailFormData.designatedCountryList'(value){
      //   if (value&&value.length>0) {
      //     const priorityLength = this.caseDetailFormData.patentPriorityClaimList  && this.caseDetailFormData.patentPriorityClaimList.length
      //     const priorityApp = priorityLength > 0 ? 1 : 0
      //     this.fetchDesignatedCountryFee(value,priorityApp)
      //   }else {
      //     this.economicStatusOptions = []
      //   }
      // },
      'caseDetailFormData.agencyCustId'(n) {
        if (n) {
          this.wfAgentChange(n)
        }
      },
      selctedArrList(n, o) {
        if (n.length) {
          let str = ''
          this.$commonUtils.unique(n, 'appNumber').filter(item => this.caseDetailFormData.divcaseList.includes(item.agentNum)).forEach(i => {
            i.appNumber && (str += i.appNumber + ';')
          })
          this.caseDetailFormData.parentFileNo = str
        }
      },
      'caseDetailFormData.patentCaseApplicationList': {
        handler(n, o) {
          if (n && n.length) {
            if(n[0].iszw){
              this.hasZw = 1 // 是
              this.caseDetailFormData.nopower = 0
            }else if(n[0].iszw === 0){
              this.hasZw = 0 // 否
            }else {
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

          }else{
            this.hasZw = null
          }
        },
        immediate: true,
        deep: true
      },
      'caseDetailFormData.patentPriorityClaimList': {
        handler(n) {
          this.hasPatentPriority = false
          if (n && n.length) {
            this.hasPatentPriority = true
            let dateList = n.map(i => i.priorityAppDate)
            this.$set(this.caseDetailFormData, 'priorityAppDate', dateList.sort((a, b) => {
              return new Date(a.replace(/-/g, '\/')) - new Date(b.replace(/-/g, '\/'))
            })[0] || '')
            // this.caseDetailFormData.priorityAppDate = dateList.sort((a, b) => {
            //   return new Date(a.replace(/-/g, "\/")) - new Date(b.replace(/-/g, "\/"))
            // })[0] || ''
          } else {
            // this.caseDetailFormData.priorityAppDate = ''
            this.$set(this.caseDetailFormData, 'priorityAppDate', '')
          }
        },
        deep: true
      },
      stepActive1(n) {
        this.$emit('getValue', {
          curCustLevel: this.curCustLevel,
          stepActive1: this.stepActive1,
          caseDetailFormData: this.caseDetailFormData
        })
      },
      curCustLevel(n, o) {
        if (n) {
          this.$emit('getValue', {
            curCustLevel: this.curCustLevel,
            stepActive1: this.stepActive1,
            caseDetailFormData: this.caseDetailFormData
          })
        }
      },
      caseDetailFormData: {
        handler(n, o) {
          if (n) {
            // this.getChangeClear(n)

            this.$emit('getValue', {
              curCustLevel: this.curCustLevel,
              stepActive1: this.stepActive1,
              caseDetailFormData: this.caseDetailFormData
            })
          }
        },
        deep: true
        // immediate:true
      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      this.caseIds = id.split(',')
      this.queryCaseInfo(this.caseIds)
      this.queryOtherCustomerListUrl()
      this.queryCountry()
      this.querycustSelectClass()
      this.fetchDesignatedCountryList()
      // this.getInvoiceTitle()
    },
    mounted() {
      if (this.$route.query.pageId) {
        this.hidePatentBase = true
        this.hideNewApp = true
      }

      window.addEventListener('scroll', this.handleScroll, true)
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
        queryFixedCompanies({
          custId: this.caseDetailFormData.custId,
          appId: this.caseDetailFormData.patentCaseApplicationList[0] && this.caseDetailFormData.patentCaseApplicationList[0].appId
        }).then(res => {
          this.invoiceTitleList = res.data
        })
      },
      //变更海牙注册日
      changePctOpenDate(value){
         if (value) {
           const formatDate = new Date(value)
           formatDate.setFullYear(formatDate.getFullYear() + 5);
           const resultDate = formatDate.toISOString().split('T')[0]
           console.log(resultDate,'resultDate');
           this.$set(this.caseDetailFormData, 'firstYearDate', resultDate)
         }
       },
      //变更经济状态
      changeEconomicStatus(value){
        if (value) {
          const obj = this.economicStatusOptions.find(item => item.id == value) || {}
          this.patentCaseCountryFeeItem.feeReduce = obj.feeReductionRatio/100
        }else {
          this.patentCaseCountryFeeItem.feeReduce = ''
        }
      },
      // 变更指定国家
      changeDesignatedCountryList(vlaues){
        if (vlaues&&vlaues.length>0) {
          const arrayA = [102,122,143]
          const bol = arrayA.some(num => vlaues.includes(num))
          if (!bol) {
            this.caseDetailFormData.patentCaseCountryFeeList = []
          }
        }else{
          this.caseDetailFormData.patentCaseCountryFeeList = []
        }
      },
      //变更弹窗内指定国家
      changeDesignatedCountry(value){
        if (value) {
          const priorityLength = this.caseDetailFormData.patentPriorityClaimList  && this.caseDetailFormData.patentPriorityClaimList.length
          const priorityApp = priorityLength > 0 ? 1 : 0
          this.fetchDesignatedCountryFee(value,priorityApp)
        }else {
          this.economicStatusOptions = []
        }
      },
      //变更申请公布时间
      changeAppAnnounceTime(value){
        if (value == 2268 && this.caseDetailFormData.pctOpenDate) {
          this.caseDetailFormData.hyCustomAnnouncementMonth = 2
          this.caseDetailFormData.hyAnnouncementDate = this.addMonth(this.caseDetailFormData.pctOpenDate,this.caseDetailFormData.hyCustomAnnouncementMonth)
        } else if (value == 2269 && this.caseDetailFormData.pctOpenDate){
          this.caseDetailFormData.hyAnnouncementDate = this.addMonth(this.caseDetailFormData.pctOpenDate,12)
        }
      },
      changeHyAnnouncementMonth(value){
        if (this.caseDetailFormData.pctOpenDate) {
          this.caseDetailFormData.hyAnnouncementDate = this.addMonth(this.caseDetailFormData.pctOpenDate,value)
        }
      },
      addMonth(date,num){
        if (date&&num) {
          const formatDate = new Date(date)
          formatDate.setMonth(formatDate.getMonth() + Number(num));
          const resultDate = formatDate.toISOString().split('T')[0]
          return resultDate
        }
      },
      // 获取指定国家
      fetchDesignatedCountryList() {
        queryDesignatedCountry().then(res => {
          this.designatedCountryOptions = res.data || []
        })
      },
      //获取经济状态
      fetchDesignatedCountryFee(id,priorityApp){
        queryDesignatedCountryFee({priorityApp,designatedCountryFeePcdcIdList:[id]}).then(res => {
          this.economicStatusOptions = res.data || []
        })
      },
      //根据海牙申请号查询相关案件信息
      fetchCaseByPctFileNo(value){
        queryCaseByPctFileNo({pctFileNo:value}).then((res) => {
          if (res.success && res.data) {
            const info = res.data
            this.caseDetailFormData.das = info.das
            this.caseDetailFormData.jusjbj = info.jusjbj
            this.caseDetailFormData.needIds = info.needIds
            this.caseDetailFormData.needdiv = info.needdiv
            this.caseDetailFormData.priorityFile = info.priorityFile
            this.caseDetailFormData.wgctNum = info.wgctNum
          }
        })
      },
      chooseLang(type){
        if(this.caseDetailFormData.pctOpenLang == type){
          this.$set(this.caseDetailFormData, 'pctOpenLang', '')
        }else{
          this.$set(this.caseDetailFormData, 'pctOpenLang', type)
        }
      },
      changeCnAddess(v, row, list) {
        if (v) {
          row.addressEn = list.find(i => i.addrId == v).addressEn
        }
      },
      customerView() {
        if (!this.caseDetailFormData.custId) return
        window.open(`/#/workbench/customer_management/cust_view/${this.caseDetailFormData.custId}`)
      },
      queryAddrByAppIds(appList) {
        if (!(appList && appList.length)) return
        let appIds = appList.map(i => i.appId).join(',')
        queryAddrByAppIds({ appIds }).then(res => {
          res.data.forEach(i => {
            appList.forEach(j => {
              if (j.appId == i.appId) {
                j.post = i.appAddrArray.find(item => item.addrId == j.addrId) && i.appAddrArray.find(item => item.addrId == j.addrId).post
                j.addressEn = i.appAddrArray.find(item => item.addrId == j.addrId) && i.appAddrArray.find(item => item.addrId == j.addrId).addressEn
                j.appAddrArray = i.appAddrArray
              }
            })
          })
        })
      },
      beforeupload() {
        this.caseIds && (this.imageData.caseIds = this.caseIds)
      },
      successBack(file) {
        this.imageUrl = file.data[0].address
      },
      changeName(v, f) { // f: inventorEtitle || inventorCtitle
        if(!v)return
        let obj = null
        if(f == 'inventorEtitle'){
          if(this.nameList.find(i => i[f] == v && i.inventorCtitle)){
            obj = this.nameList.find(i => i[f] == v && i.inventorCtitle)
          }else{
            obj = this.nameList.find(i => i[f] == v)
          }
        }else{
          if(this.nameList.find(i => i[f] == v && i.inventorEtitle)){
            obj = this.nameList.find(i => i[f] == v && i.inventorEtitle)
          }else{
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
        if (this.caseDetailFormData.appFromto === '内-外' && this.caseType === '海牙国家阶段') {
          this.fetchCaseByPctFileNo(v)
        }
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
        // v && (this.caseDetailFormData.feeReduce = fomatFloat(v, 2))
      },
      getChangeClear(n) {
        // let nullValueList = []
        // for (var key in n) {
        //   if (Object.prototype.toString.call(n[key]) == '[object Array]') {
        //     if (this.backData[key] && this.backData[key].length && !(n[key] && n[key].length)) {
        //       nullValueList.push(key)
        //     }
        //   } else {
        //     if (n[key] !== 0 && !n[key] && this.backData[key]) {
        //       nullValueList.push(key)
        //     }
        //   }
        // }
        // this.nullValueList = nullValueList
        // this.$emit('changeNullValue', this.nullValueList)
      },
      commonHandleApp(datas) {
        let { flag, data, index } = datas
        this.handlePatentApplication(flag, data, index)
      },

      clickBack() {
        this.listView = true
        this.newView = false
        this.editView = false
      },
      openNew() {
        this.editView = false
        this.listView = false
        this.newView = true
      },
      checkedAppItem(params) {
        if (params) {
          // params.data.isFirstAppliantStr == '是' ? params.data.isFirstAppliant = 1 : params.data.isFirstAppliant = 0
          let index = this.caseDetailFormData.patentCaseApplicationList.findIndex(item => item.appId == params.data.appId)
          let list = this.caseDetailFormData.patentCaseApplicationList.find(item => item.appId == params.data.appId)
          if (index != -1) {
            let no = list.no
            this.caseDetailFormData.patentCaseApplicationList.splice(index, 1, params.data)
            this.$set(this.caseDetailFormData.patentCaseApplicationList[index], 'no', no)
          } else {
            this.caseDetailFormData.patentCaseApplicationList.push(params.data)
            let no = this.caseDetailFormData.patentCaseApplicationList.length
            this.$set(this.caseDetailFormData.patentCaseApplicationList[no - 1], 'no', no)
            this.changeNo(no, 'apply', no - 1)
          }
          if(this.caseDetailFormData.patentCaseApplicationList.length){
            this.choiceDiscount({appId: this.caseDetailFormData.patentCaseApplicationList[0].appId})
            }

        }
        this.appId = ''
        this.patentApplication = false
      },
      choiceDiscount({appId}){
        if(this.caseDetailFormData.discount&&this.caseDetailFormData.discount!=100)return;
        Promise.all([this.billDiscount(), this.billDiscount(appId)]).then(res => {
          this.caseDetailFormData.discount = (res[1].data != 100 && res[1].data) || res[0].data
        })
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
      async queryCaseAgentNumList(query) {
        queryCaseAgentNumList({ agentNum: query, pageSize: 100, pageNo: 1 }).then(res => {
          this.anotherCaseNumList = res.data
        })
      },
      handleScroll() {
        if (!['普通新申请', 'PCT国家阶段', 'PCT国际申请'].includes(this.caseType)) return
        this.elstepList = [
          { title: '基本信息', state: true, id: 'info-title' },
          { title: '客户', state: true, id: 'cust-title' },
          { title: '申请人', state: true, id: 'app-title' },
          { title: '发明人', state: true, id: 'inventor-title' },
          {
            title: '外代所',
            state: this.caseDetailFormData.appFromto == '内-外' || this.caseDetailFormData.appFromto == '外-外',
            id: 'wds-title'
          },
          { title: '要求优先权', state: true, id: 'priority-title' },
          { title: '新申请递交', state: true, id: 'new-app-title' },
          { title: '个案信息', state: true, id: 'case-info-title' },
          { title: 'PCT国家阶段', state: this.caseType == 'PCT国家阶段', id: 'country-title' },
          { title: '专利基础信息', state: true, id: 'patent-base-title' },
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
      changeActive(n) {
        this.stepActive1 = n
      },
      hidePatentClick() {
        this.hidePatentBase = !this.hidePatentBase
      },
      hideNewAppClick() {
        this.hideNewApp = !this.hideNewApp
      },
      hideAppPeople() {
        // this.hideApp = !this.hideApp
      },
      wfAgentChange(id) {
        if (id) {
          this.queryCustomerUrl()
        }
      },
      //客户远程搜索
      queryCustomerNameId(query) {
        if (!this.loading) {
          if (query !== '') {
            this.loading = true
            setTimeout(() => {
              queryCustomerNameId({ curStatus: '4,5', pageNo: 0, pageSize: 100, keyword: query }).then(res => {
                this.queryCustomerNameIdList = res.data
                this.loading = false
              })
            }, 200)
          }
        } else {
          this.queryCustomerNameIdList = []
        }
      },
      billDiscount(appId) {
        const {caseTypeId, custId, submitType} = this.caseDetailFormData
        return billDiscount({caseTypeId, custId, submitType, appId})
      },
      //更改客户
      selectCustChange(e) {
        if (!e) {
          return
        }
        this.caseDetailFormData.custConId = ''
        this.caseDetailFormData.trademarkCaseCustContacts = ''
        this.queryCustomerContactByCustIdUrl()
        this.getInvoiceTitle()
        // this.billDiscount()
      },
      //申请人
      handlePatentApplication(flag, data, index) {

        flag == 'add' ? this.patentApplicationTitle = '添加申请人' : this.patentApplicationTitle = '修改申请人'
        data ? this.patentApplicationItem = data : ''
        if (flag == 'del') {
          this.caseDetailFormData.patentCaseApplicationList.splice(index, 1)
        } else if (flag == 'add') {
          this.patentApplication = true
          this.listView = true
          this.newView = false
          this.editView = false
        } else {
          this.firstApp = data.isFirstAppliant
          this.appId = data.appId
          this.code = data.code
          this.patentApplication = true
          this.listView = false
          this.newView = false
          this.editView = true
        }
      },
      //关闭申请人
      closeApplication() {
        this.patentApplication = false
        this.listView = false
        this.patentApplicationItem = {}
      },
      //添加申请人
      addApplication() {
        this.caseDetailFormData.patentCaseApplicationList.push(this.patentApplicationItem)
        this.closeApplication()
      },
      //发明人操作
      handlePatentInventor(flag, data, index) {
        // notOpenSign
        flag == 'add' ? this.patentInventorTitle = '添加发明人' : this.patentInventorTitle = '修改发明人'
        data ? this.patentInventorItem = data : ''
        this.patentInventorItem.notOpenSign = this.patentInventorItem.notOpenSign || '0'
        if (flag == 'del') {
          this.caseDetailFormData.patentInventorList.splice(index, 1)
        } else {
          this.patentInventor = true
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
      //费减比例操作
      handlePatentCaseCountryFee(flag,data,index){
        flag == 'add' ? this.patentCaseCountryFeeTitle = '添加费减比例' : this.patentCaseCountryFeeTitle = '修改费减比例'
        data ? this.patentCaseCountryFeeItem = data : ''
        if (flag == 'edit' && data.pcdcId) {
          this.changeDesignatedCountry(data.pcdcId)
        }
        if (flag == 'del') {
          this.caseDetailFormData.patentCaseCountryFeeList.splice(index, 1)
        } else {
          this.patentCaseCountryFeeVisible = true
        }
      },
      //关闭费减比例
      closePatentCaseCountryFee(){
        this.patentCaseCountryFeeVisible = false
        this.patentCaseCountryFeeItem = {}
      },
      addPatentCaseCountryFee(title){
        if (this.patentCaseCountryFeeItem.pcdcId) {
          const contry = this.designatedCountryOptions.find(item => item.id == this.patentCaseCountryFeeItem.pcdcId) || {}
          this.patentCaseCountryFeeItem.countryCn = contry.countryCn
        }
        if (this.patentCaseCountryFeeItem.pcdcfId) {
          const economicStatus = this.economicStatusOptions.find(item => item.id == this.patentCaseCountryFeeItem.pcdcfId) || {}
          this.patentCaseCountryFeeItem.economicStatus = economicStatus.economicStatus
        }
        if (title == '添加费减比例') {
          this.caseDetailFormData.patentCaseCountryFeeList.push(this.patentCaseCountryFeeItem)
        }
        this.closePatentCaseCountryFee()
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
      },
      //添加要求优先权
      addPatentPriorityClaim(f) {
        if (f == '添加要求优先权') {
          this.caseDetailFormData.patentPriorityClaimList.push(this.patentPriorityClaimItem)
        }
        this.closePatentPriorityClaim()
      },
      //关闭 添加要求优先权弹框
      closePatentPriorityClaim() {
        this.patentPriorityClaim = false
        this.patentPriorityClaimItem = {}
      },
      defaultData(data, f) {
        //isagency  是
        //das  priorityFile  preexamine  dopph  xgwjyw1
        //xgwjyw2 xgwj  ishk  needdiv tstss needIds  pctPreliex
        //ssqq     tqsc
        let defaultRadio = ['istrans', 'twoapp', 'nopower', 'das', 'das', 'priorityFile', 'preexamine', 'dopph', 'xgwjyw1', 'xgwjyw2',
          'xgwj', 'ishk', 'needdiv', 'tstss', 'needIds', 'pctPreliex', 'ssqq', 'tqsc', 'tqgk','focusReview']
        for (let i = 0; i < defaultRadio.length; i++) {
          if (!this.caseDetailFormData[defaultRadio[i]]) {
            this.$set(this.caseDetailFormData, defaultRadio[i], 0)
            // this.caseDetailFormData[defaultRadio[i]] = 0
          }
        }
        if (this.caseDetailFormData['isagency'] !== 0) {
          this.caseDetailFormData['isagency'] = 1
        }
        // if (this.caseDetailFormData['tqgk'] !== 0) {
        //   this.caseDetailFormData['tqgk'] = 1
        // }
        if (!this.caseDetailFormData['daijiao']) {
          this.caseDetailFormData['daijiao'] = 'N'
        }
        this.caseDetailFormData.receiveDate = data.receiveDate || this.$commonUtils.getDay(0, '-')
        this.caseDetailFormData.caseDate = data.caseDate || this.$commonUtils.getDay(0, '-')
        this.caseDetailFormData.createUserId = data.createUserId || this.$store.getters.userId
        this.caseDetailFormData.substractPage = data.substractPage || 1
        this.caseDetailFormData.substractDrawing = data.substractDrawing || 1
        this.caseDetailFormData.whdAgencyName = data.whdAgencyName || '万慧达律所'
      },
      async queryCaseInfo(caseIds) {
        let { data } = await queryPatentCaseInfo({ caseIds, initFlag: 1 })
        this.caseDetailFormData = Object.assign(data, this.caseDetailFormData)
        let res = await queryPatentCaseInfo({ caseIds })
        this.caseDetailFormData = res.data
        this.getInvoiceTitle()
        this.queryAddrByAppIds(this.caseDetailFormData.patentCaseApplicationList)
        this.imageUrl = this.caseDetailFormData.materials && this.caseDetailFormData.materials.find(i => i.materialTypeId == 301510) && this.caseDetailFormData.materials.find(i => i.materialTypeId == 301510).address
        this.backData = JSON.parse(JSON.stringify(res.data))
        this.$emit('getBackData', this.backData)
        this.defaultData(this.caseDetailFormData)
        this.$emit('getValue', this.$data)
        this.queryCustomerNameIdList = [{
          custId: Number(this.caseDetailFormData.custId),
          fullname: this.caseDetailFormData.custName
        }]
        //7850 给外代所设置默认值
        if (this.caseDetailFormData.caseType === '海牙国际申请' && !this.caseDetailFormData.agencyCustId) {
          this.caseDetailFormData.agencyCustId = 2013
        }

        if (!this.caseDetailFormData.designatedCountryList) {
          this.caseDetailFormData.designatedCountryList = []
        }
        //信用度->立卷/预立卷审批按钮
        if (
          /^['C'|'D']$/.test(this.caseDetailFormData.custLevel) ||
          !this.caseDetailFormData.custLevel
        ) {
          this.curCustLevel = false

          queryAlltask({
            userId: this.$store.getters.userId,
            taskId: this.caseDetailFormData.taskId
          }).then(res => {
            if (res.data && res.data.length && res.data[0].createStatus) {
              this.curCustLevel = true
            } else {
              if (!this.caseDetailFormData.custLevel) {
                this.caseDetailFormData.custId && queryCustomerContactByCustIdUrl({
                  caseTypeId: this.caseDetailFormData.caseTypeId,
                  custId: this.caseDetailFormData.custId
                })
                  .then(response => {
                    if (response.data.country == '中国') {
                      this.curCustLevel = false
                    } else {
                      this.curCustLevel = true
                    }
                  })
              } else {
                this.curCustLevel = false
              }
            }
          })
        } else {
          this.curCustLevel = true
        }
        this.queryCustomerContactByCustIdUrl()
        this.queryCustomerContactByCustContactIdUrl('客户', 1)
        this.queryCustomerContactByCustContactIdUrl('账单', 1)
        this.queryWfCustomerContactUrl()
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
      //外方代理所
      queryOtherCustomerListUrl() {
        queryOtherCustomerListUrl({ isCollaboration: '1',collaborationStatusArray:[2249,2250] })
          .then(response => {
            this.hzListsList = response.data
            this.hzListsList.forEach(item => {
              item.label = item.fullname
              // item.id=item.custId
              // item.name=item.fullname
              item.value = item.custId
            })
          })
          .catch(err => {
            console.log(err)
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
      //信函地址
      queryCustomerContactByCustContactIdUrl(type, noChange) {
        if(type=='客户' && !this.caseDetailFormData.custConId)return;
        if(type=='账单' && !this.caseDetailFormData.billCustContactId)return;
        queryCustomerContactByCustContactIdUrl({
          custContactId: type=='客户' ? this.caseDetailFormData.custConId : this.caseDetailFormData.billCustContactId
        }).then(res => {
          type=='客户' ? (this.customerMailAddsList = res.data.customerMailAdds, this.$set(this.caseDetailFormData,'letterAddrId','')) : (
            this.billAddsList = res.data.BillAdds,
            this.billAddsList.forEach(item => {
              if (!item.addressCn) {
                item.addressCn = item.addressEn
              }
            })
              // this.$set(this.caseDetailFormData,'billAddrId','')
          );
          !noChange && this.$set(this.caseDetailFormData,'billAddrId','')

        })
      },
      //客户联系人
      queryCustomerContactByCustIdUrl() {
        if (!this.caseDetailFormData.custId) {
          return
        }
        queryCustomerContactByCustIdUrl({
          caseTypeId: this.caseDetailFormData.caseTypeId,
          custId: this.caseDetailFormData.custId
        })
          .then(response => {
            this.customerContactsList = response.data.customerContacts
            this.billContactsList = response.data.BillContacts
            this.$set(this.caseDetailFormData, 'country', response.data.country)
          })
          .catch(err => {
            console.log(err)
          })
      },
      //国家
      queryCountry() {
        queryCPCAddr().then(res => {
          this.patentCountryList = res.data
        })
        queryPatentCountry().then(res => {
          this.patentCountryArray = res.data
        })
        queryCountry()
          .then(response => {
            this.countryList = response.data
          })
          .catch(err => {
            console.log(err)
          })
      },
      querycustSelectClass() {
        // 1042: 主体法律性质
        // 1062: 专利类型
        // 1096：技术领域
        // 1139: 法律状态
        // 1040: 集成电路结构
        // 1141: 集成电路技术
        // 1143: 客户状态
        let classIdString = [1042, 1062, 1096, 1139, 1140, 1141, 1143, 1154, 1193].join(',')
        querycustSelectClass({ classId: classIdString }).then(res => {
          this.applicantTypeList = res.data['1042']
          this.patentTypeList = res.data['1062']
          this.techFieldList = res.data['1096']
          this.wGtechFieldList = res.data['1154']
          this.statusList = res.data['1139']
          this.custStatusList = res.data['1143']
          this.appAnnouncementTimeList = res.data['1193']
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .patent-container {
    .el-form {
      .el-row {
        display: flex;

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
              height: 100%;
              /*line-height: 30px;*/
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
            height: 41px;

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

              .el-input__inner {
                height: 28px;
              }

              .el-input__icon {
                line-height: 28px;
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

    /*> > > .el-form-item__error {*/
    /*  position: relative;*/
    /*  top: 0;*/
    /*}*/
    .el-form-item__error {
      position: static;
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

  .adress {
    width: 100%;
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
    float: left;
    font-size: 28px;
    color: #8c939d;
    width: 145px;
    height: 145px;
    line-height: 145px;
    text-align: center;
    /*border: 1px dashed #d9d9d9;*/
  }

  .avatar {
    width: 145px;
    height: 145px;
    display: block;
  }

  > > > .special-width {
    .el-input--suffix {
      width: 100% !important;
    }

    .el-select__tags {
      left: 10px;
    }
  }
</style>
