<template>
  <div>
    <el-form v-if="caseType == '普通新申请' || caseType == 'PCT国家阶段' || caseType == 'PCT国际申请' || caseType == '海牙国际申请' || caseType == '海牙国家阶段'" label-width="160px"
             size="small"
             class="form-container"
             :model="caseDetailFormData">
      <div class="">
        <el-row class="border-top">
          <el-col :span="24">
            <el-form-item label="案件类型:">
              {{caseDetailFormData.caseType}}
            </el-form-item>
            <el-form-item label="代理机构:">
              {{caseDetailFormData.whdAgencyName}}
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
              <el-form-item label="申请方向:">
                {{caseDetailFormData.appFromto}}
              </el-form-item>
            </el-col>
            <el-col :span="caseType !=='海牙国际申请' && caseType !=='海牙国家阶段' ? 6 : 12">
              <el-form-item label="主体法律性质:">
                {{caseDetailFormData.legalNature == 0 ? '自然人' : '法人'}}
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="caseType !=='海牙国际申请' && caseType !=='海牙国家阶段'">
              <el-form-item label="技术领域:">
                {{caseDetailFormData.techFieStr}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="caseType === '普通新申请' ? 6 : 12">
              <el-form-item label="专利类型:" prop="patentType">
                {{caseDetailFormData.typeNameStr}}
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="caseType === '普通新申请'">
              <el-form-item label="是否为分案:">
                {{caseDetailFormData.isDivcase ? '是' : '否'}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否代交:">
                {{caseDetailFormData.daijiao == 'Y' ? '是' : '否'}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="本案为中间转案:">
                {{+caseDetailFormData.istrans ? '是' : '否'}}
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="(caseType == '普通新申请' && patentType != 1298) || caseType == 'PCT国家阶段' ? 12 : 24">
              <el-form-item label="案件文号:">
                {{caseDetailFormData.agentNum}}
              </el-form-item>
            </el-col>
            <el-col v-show="caseType == '普通新申请' && patentType != 1298 || caseType == 'PCT国家阶段'"
                    :span="caseDetailFormData.twoapp == 1 ? 6 : 12">
              <el-form-item label="一带二申请:">
                {{+caseDetailFormData.twoapp ? '是' : '否'}}
              </el-form-item>
            </el-col>
            <el-col
              v-show="caseDetailFormData.twoapp == 1 && (caseType == '普通新申请' && patentType != 1298 || caseType == 'PCT国家阶段')"
              :span="6">
              <el-form-item label="另一件案号:">
                {{caseDetailFormData.anotherApp}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType !== '海牙国家阶段'">
            <el-col :span="24">
              <el-form-item label="技术交底名称:">
                {{caseDetailFormData.technicalDisclosure}}
<!--                  <el-input type="text" size="small" v-model="caseDetailFormData.technicalDisclosure"></el-input>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="patentType == 1298 ? 12 : 24">
              <el-form-item label="案件中文名称:" prop="caseCnName">
                <div style="display: flex;align-items: center">
                  <div>{{caseDetailFormData.caseCnName}}</div>
                  <!--                  <img v-if="imageUrl&&caseType == '普通新申请' && patentType == 1298" style="width:100px;height:100px"-->
                  <!--                       :src="`ipdoc/${imageUrl}`" alt="">-->
                </div>

              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="patentType == 1298">
              <el-form-item label="图片">
                <div
                  style="width: 145px;height: 145px;padding: 10px"

                  class="avatar-uploader fl-ac-jc">
                  <img v-if="imageUrl" :src="`ipdoc/${imageUrl}`" class="avatar"
                       style="max-width: 100%;max-height: 100%;object-fit: contain">
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="案件英文名称:">
                {{caseDetailFormData.caseEnName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType !== '海牙国际申请' && caseType !== '海牙国家阶段'">
            <el-col :span="24">
              <el-form-item label="案件日文名称:">
                {{caseDetailFormData.caseJpName}}
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 任务7763 -->
            <el-row v-if="['外-内', '内-内'].includes(caseDetailFormData.appFromto) && caseDetailFormData.patentType == 1298">
              <el-col :span="24">
                <el-form-item label="延迟审查:">
                  <div v-if="caseDetailFormData.ycsc"> 请求对本申请延迟审查，延迟期限为：{{caseDetailFormData.yanchi}}个月</div>
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
                {{caseDetailFormData.custName}}
                <div class="handle" style="display: inline-block">
                  <span @click="customerView">查看</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="来自国家:">
                {{caseDetailFormData.country}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="折扣:">
                {{caseDetailFormData.discount}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="" v-if="['内-内'].includes(caseDetailFormData.appFromto) && (caseType == '普通新申请' || caseType == '年费代缴' || caseType == '无效' || caseType == 'PCT国家阶段') || ['内-外'].includes(caseDetailFormData.appFromto) && (caseType === 'PCT国际申请')">
              <el-col :span="12">
                <el-form-item label="收据抬头:">
                  {{caseDetailFormData.gfReceiptRise}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="统一社会信用代码:">
                  {{caseDetailFormData.gfReceiptRiseNumber}}
                </el-form-item>
              </el-col>

            </el-row>
          <el-row class="">
            <el-col :span="12">
              <el-form-item label="客户联系人:">
                {{this.customerContactsList.find(i=>i.custContactId ==
                caseDetailFormData.custConId)&&this.customerContactsList.find(i=>i.custContactId ==
                caseDetailFormData.custConId).name + '('+ this.customerContactsList.find(i=>i.custContactId ==
                caseDetailFormData.custConId).email +')'}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件邮址:">
                {{caseDetailFormData.letterAddrCn}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="抄送人:">
                {{caseDetailFormData.patentCaseCustContactStr}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="账单联系人:">
                {{caseDetailFormData.billCustContactName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账单邮址:">
                {{caseDetailFormData.billAddrCn}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="技术联系人:">
                {{caseDetailFormData.techLinkman}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户案号:">
                {{caseDetailFormData.custRefNo}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请人案号:">
                {{caseDetailFormData.applicantRefNo}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="个案要求:">
                <template v-if="caseDetailFormData.custCommand">
                  <p v-for="item in caseDetailFormData.custCommand.split('\n')">{{item}}</p>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="(caseType == '普通新申请' && patentType==1296)
          || (caseType != 'PCT国家阶段' && (patentType == 1297 || patentType == 1298))
           || (caseType == 'PCT国家阶段'  && (patentType == 1296 || patentType == 1297))
">
            <el-col :span="24">
              <el-form-item label="转出所至">
                {{caseDetailFormData.alteragency}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--  申请人-->
        <div>
          <el-row>
            <div style="position:relative; width: 100%;">
              <span class="header-info" id="app-title">申请人</span>
            </div>
          </el-row>
          <el-row>
            <el-table
              :data="caseDetailFormData.patentCaseApplicationList"
              border
              style="width: 100%">
              <el-table-column
                label="序号"
                type="index"
                width="60">
              </el-table-column>
              <!--              <el-table-column-->
              <!--                prop="code"-->
              <!--                width="100"-->
              <!--                label="编号">-->
              <!--              </el-table-column>-->
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
                width="60"
                label="总委">
                <template slot-scope="scope">
                  {{scope.row.iszw ? '是' : '否'}}
                </template>
              </el-table-column>
              <el-table-column
                width="300"
                label="中文地址">
                <template slot-scope="scope">
                  {{scope.row.appAddrArray&&scope.row.appAddrArray.find(i=>i.addrId ==
                  scope.row.addrId)&&scope.row.appAddrArray.find(i=>i.addrId == scope.row.addrId).addressCn}}
                  <!--                    <el-select default-first-option :clearable='true' placeholder="请选择"-->
                  <!--                             v-model="scope.row.addrId"-->
                  <!--                             filterable>-->
                  <!--                    <el-option v-for="(item,key)  in scope.row.appAddrArray" :key="key" :label="item.addressCn"-->
                  <!--                               :value="item.addrId">-->
                  <!--                    </el-option>-->
                  <!--                  </el-select>-->
                </template>
              </el-table-column>
              <el-table-column
                prop="addressEn"
                label="英文地址"
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
              <!--              <el-table-column-->
              <!--                width="150"-->
              <!--                prop="isFirstAppliantStr"-->
              <!--                label="第一联系人">-->
              <!--              </el-table-column>-->
              <el-table-column
                width="140"
                prop="beianYear"
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
              <!--              <el-table-column-->
              <!--                width="140"-->
              <!--                prop="appType"-->
              <!--                label="申请人主体性质">-->
              <!--              </el-table-column>-->
            </el-table>
          </el-row>
        </div>

        <!--        发明人-->
        <div>
          <el-row>
            <div style="position:relative; width: 100%;">
              <span class="header-info" id="inventor-title">发明人</span>
              <!--              <el-button type="primary" size="mini" style="position:absolute;bottom: 0;right: 0;"-->
              <!--                         @click="handlePatentInventor('add')">添加-->
              <!--              </el-button>-->
            </div>
          </el-row>
          <el-row>
            <el-table
              :data="caseDetailFormData.patentInventorList"
              border
              style="width: 100%">
              <el-table-column
                label="序号"
                type="index"
                width="60">
              </el-table-column>
              <el-table-column
                prop="inventorCtitle"
                label="中文名称">
              </el-table-column>
              <el-table-column
                prop="inventorEtitle"
                label="英文名称">
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
              <!--              <el-table-column-->
              <!--                label="操作"-->
              <!--                width="120"-->
              <!--              >-->
              <!--                <template slot-scope="scope">-->
              <!--                  <div class="handle">-->
              <!--                    <span @click="handlePatentInventor('edit', scope.row)">修改</span>-->
              <!--                    <span @click="handlePatentInventor('del',{}, scope.$index)">删除</span>-->
              <!--                  </div>-->
              <!--                </template>-->

              <!--              </el-table-column>-->
            </el-table>
          </el-row>
        </div>
        <!-- 海牙国际申请-指定国家-->
        <div v-if="caseType == '海牙国际申请'">
          <el-row>
            <span class="header-info" id="wds-title">指定国家</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="(caseDetailFormData.appFromto == '内-外' || caseDetailFormData.appFromto == '外-外') ? 12 : 24">
              <el-form-item label="指定国家:">
                {{ caseDetailFormData.designatedCountryStr }}
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="caseDetailFormData.appFromto == '内-外' || caseDetailFormData.appFromto == '外-外'">
              <el-form-item label="外方代理所:">
                {{ caseDetailFormData.agencyCustName }}
              </el-form-item>
            </el-col>
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
            <el-col :span="6">
              <el-form-item label="进入国家:">
                {{caseDetailFormData.toCountry}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="外方案号:">
                {{caseDetailFormData.agencyCustRefno}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="外方代理所:">
                {{caseDetailFormData.agencyCustName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="12">
              <el-form-item label="外方联系人:">
                {{caseDetailFormData.agencyCustContactName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="外方文件邮址:">
                {{caseDetailFormData.agencyCustFileAddrCn}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="外方要求:">
                {{caseDetailFormData.agencyCustReq}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!--        要求优先权-->
        <div>
          <el-row>
            <div style="position:relative; width: 100%;">
              <span class="header-info" id="priority-title">要求优先权</span>
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
              <!--              <el-table-column-->
              <!--                label="操作"-->
              <!--                width="120"-->
              <!--              >-->
              <!--                <template slot-scope="scope">-->
              <!--                  <div class="handle">-->
              <!--                    <span @click="handlePatentPriorityClaim('edit', scope.row)">修改</span>-->
              <!--                    <span @click="handlePatentPriorityClaim('del',{}, scope.$index)">删除</span>-->
              <!--                  </div>-->
              <!--                </template>-->

              <!--              </el-table-column>-->
            </el-table>
          </el-row>
        </div>
                <!-- 海牙国际申请 -->
                <div v-if="caseType === '海牙国际申请'">
          <el-row>
            <span class="header-info" id="patent-base-title">海牙国际申请</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="6">
              <el-form-item label="国际受理局:">
                {{ caseDetailFormData.pctRecOffice }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请日:">
                {{ caseDetailFormData.appDate }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="海牙申请号:">
                {{ caseDetailFormData.pctFileNo }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="WIPO/受理局提交号:">
                {{ caseDetailFormData.pctOpenNumber }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="海牙注册日:">
                {{ caseDetailFormData.pctOpenDate }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="海牙注册号:">
                {{ caseDetailFormData.hyRegNumber }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="优先权日:">
                {{ caseDetailFormData.priorityAppDate }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="递交语言:">
                {{caseDetailFormData.pctLanguage == 'E' ? '英文' : '中文'}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="产品分类:">
                {{caseDetailFormData.productClassification}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="海牙公布日:">
                {{caseDetailFormData.hyAnnouncementDate}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 海牙国家阶段 -->
        <div v-if="caseType === '海牙国家阶段'">
          <el-row>
            <span class="header-info" id="patent-base-title">海牙国家阶段</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="6">
              <el-form-item label="国际受理局:">
                {{ caseDetailFormData.pctRecOffice }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="优先权日:">
                {{ caseDetailFormData.priorityAppDate }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="WIPO/受理局提交号:">
                {{ caseDetailFormData.pctOpenNumber }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="海牙申请号:">
                {{ caseDetailFormData.pctFileNo }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="海牙申请日:">
                {{ caseDetailFormData.appDate }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="海牙注册号:">
                {{ caseDetailFormData.hyRegNumber }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="海牙注册日:">
                {{ caseDetailFormData.pctOpenDate }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="产品分类:">
                {{caseDetailFormData.productClassification}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="海牙公布日:">
                {{caseDetailFormData.hyAnnouncementDate}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 海牙国际申请 新递交申请-->
        <div v-if="caseType == '海牙国际申请' || caseType == '海牙国家阶段'">
          <el-row>
            <span class="header-info" id="new-app-title">新申请递交</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="6">
              <el-form-item label="相似设计项数:">
                {{caseDetailFormData.wgxsNum}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="成套设计项数:">
                {{caseDetailFormData.wgctNum}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="局部设计:">
                {{caseDetailFormData.jusjbj ? '是' : '否'}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="要求DAS:">
                {{caseDetailFormData.das ? '是' : '否'}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="caseDetailFormData.needdiv == 1 ? 6 : 12">
              <el-form-item label="是否需要提交分案申请:">
                {{+caseDetailFormData.needdiv ? '是' : '否' }}
              </el-form-item>
            </el-col>
            <el-col v-show="caseDetailFormData.needdiv == 1 " :span="6">
              <el-form-item label="分案申请案号:">
                {{caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.join(';')}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="要求提交IDS:">
                {{+caseDetailFormData.needIds ? '是' : '否'}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType === '海牙国际申请'">
            <el-col :span="6">
              <el-form-item label="申请人邮箱:">
                {{ caseDetailFormData.appEmail }}
              </el-form-item>
            </el-col>
            <el-col :span="caseDetailFormData.appAnnouncementTime == 2268 ? 12 : 18">
              <el-form-item label="申请公布时间:">
                {{ caseDetailFormData.appAnnouncementTimeStr }}
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="caseDetailFormData.appAnnouncementTime == 2268">
              <el-form-item label="具体月数:">
                {{ caseDetailFormData.hyCustomAnnouncementMonth }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="hasPatentPriority">
            <el-col :span="24">
              <el-form-item label="缺优证文件:">
                {{+caseDetailFormData.priorityFile ? '是' : '否'}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType === '海牙国际申请'">
            <el-col :span="24">
              <el-form-item label="简要说明（英文）:">
                {{caseDetailFormData.briefDescription }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseDetailFormData.appFromto == '外-内'">
            <el-col :span="24">
              <el-form-item label="原案语言:">
                {{caseDetailFormData.pctOpenLang}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="是否需要优先权期限提醒:">
                {{caseDetailFormData.applyExternally ? '是' : '否'}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--        新申请递交-->
        <div v-else>
          <el-row>
            <span class="header-info" id="new-app-title">新申请递交</span>
          </el-row>
          <div v-if="!(caseType == '普通新申请' && patentType == 1298)">
            <div v-if="caseType == 'PCT国际申请'">
              <el-row class="border-top">
                <el-col :span="6">
                  <el-form-item label="文稿字数:">
                    {{caseDetailFormData.wordsNum}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="说明书页数:">
                    {{caseDetailFormData.descriptionPages}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="附图幅数:">
                    {{caseDetailFormData.appendedDrawings}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="附图页数:">
                    {{caseDetailFormData.drawingPages}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="">
                <el-col :span="6">
                  <el-form-item label="权利要求项数:">
                    {{caseDetailFormData.claimItems}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="权利要求页数:">
                    {{caseDetailFormData.claimPages}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="摘要附图页数:">
                    {{caseDetailFormData.substractDrawing}}
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
            <div v-else>
              <el-row class="border-top">
                <el-col :span="6">
                  <el-form-item label="文稿字数:">
                    {{caseDetailFormData.wordsNum}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="说明书页数:">
                    {{caseDetailFormData.descriptionPages}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="附图幅数:">
                    {{caseDetailFormData.appendedDrawings}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="附图页数:">
                    {{caseDetailFormData.drawingPages}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="">
                <el-col :span="6">
                  <el-form-item label="权利要求项数:">
                    {{caseDetailFormData.claimItems}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="权利要求页数:">
                    {{caseDetailFormData.claimPages}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="摘要页数:">
                    {{caseDetailFormData.substractPage}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="摘要附图页数:">
                    {{caseDetailFormData.substractDrawing}}
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row class="">

                <el-col :span="hasPatentPriority ? 6: 12">
                  <el-form-item label="摘要附图指定图:">
                    {{caseDetailFormData.substractDrwno}}
                  </el-form-item>
                </el-col>
                <el-col :span="hasPatentPriority ? 6: 12">
                  <el-form-item label="缺委托书:">
                    {{+caseDetailFormData.nopower ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <!--                <el-col :span="12" v-if="caseType == 'PCT国家阶段'">-->
                <!--                  <el-form-item label="要求DAS:">-->
                <!--                    {{+caseDetailFormData.das ? '是' : '否'}}-->
                <!--                  </el-form-item>-->
                <!--                </el-col>-->
                <el-col :span="12" v-if="caseType != 'PCT国家阶段' && hasPatentPriority">
                  <el-form-item label="缺优证文件:">
                    {{+caseDetailFormData.priorityFile ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col v-if="caseType == 'PCT国家阶段' && hasPatentPriority" :span="12">
                  <el-form-item></el-form-item>
                </el-col>

              </el-row>
              <el-row class="">
                <el-col :span="caseType == '普通新申请' || caseType == 'PCT国家阶段' ? 6 : 12">
                  <el-form-item label="要求DAS:">
                    {{+caseDetailFormData.das ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseDetailFormData.appFromto == '内-内'">
                  <el-form-item label="预审案件:">
                    {{+caseDetailFormData.preexamine ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseDetailFormData.appFromto != '内-内'">
                    <el-form-item></el-form-item>
                  </el-col>
                <el-col :span="(caseType == '普通新申请'&&caseDetailFormData.appFromto == '内-内'&&patentType == 1296)?6:12" v-if="caseType == '普通新申请'">
                  <el-form-item label="要求优先审查:">
                    {{+caseDetailFormData.tqsc ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseType == '普通新申请'&&caseDetailFormData.appFromto == '内-内'&&patentType == 1296">
                  <el-form-item label="是集中审查:">
                    {{+caseDetailFormData.focusReview ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col v-if="caseType == 'PCT国家阶段'" :span="12">
                  <el-form-item>
                    <span slot="label">要求审查高速公路<br>(PPH)</span>
                    {{+caseDetailFormData.dopph ? '是' : '否'}}
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row v-show="caseType == 'PCT国家阶段' && (patentType == 1296 || patentType == 1297)">
                <el-col :span="6">
                  <el-form-item label="进入国家阶段期限:">
                    {{caseDetailFormData.pctKxq==1460 ? '32个月内提交' : caseDetailFormData.pctKxq == 1458 ? '提前进入' :
                    caseDetailFormData.pctKxq == 1461 ? '31个月内提交' : caseDetailFormData.pctKxq == 1459 ? '30个月内提交' : ''}}

                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="根据条约第19条修改的权利要求和声明:">
                    {{+caseDetailFormData.xgwjyw1 ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="修改文件（28或41条）:">
                    {{+caseDetailFormData.xgwj ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="修改文件（34条）:">
                    {{+caseDetailFormData.law34 ? '是' : '否'}}
                  </el-form-item>
                </el-col>

              </el-row>
              <div v-if="caseType == '普通新申请' && patentType==1296">
                <el-row>
                  <el-col :span="caseDetailFormData.ishk == 1 ? 6 : 12">
                    <el-form-item label="要求提交香港申请:">
                      {{+caseDetailFormData.ishk ? '是' : '否'}}
                    </el-form-item>
                  </el-col>
                  <el-col v-show="caseDetailFormData.ishk == 1" :span="6">
                    <el-form-item label="香港申请案号:">
                      {{caseDetailFormData.hkRefNoList&&caseDetailFormData.hkRefNoList.join(';')}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="caseDetailFormData.needdiv == 1 ? 6 : 12">
                    <el-form-item label="是否需要提交分案申请:">
                      {{+caseDetailFormData.needdiv ? '是' : '否' }}
                    </el-form-item>
                  </el-col>
                  <el-col v-show="caseDetailFormData.needdiv == 1 " :span="6">
                    <el-form-item label="分案申请案号:">
                      {{caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.join(';')}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="要求新申请同时提实审:">
                      {{+caseDetailFormData.tstss ? '是' : '否'}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="要求提交IDS:">
                      {{+caseDetailFormData.needIds ? '是' : '否'}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="费减比例:">
                      {{caseDetailFormData.feeReduce}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="提前公布:">
                      {{caseDetailFormData.tqgk ? '是' : '否'}}
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div v-show="caseType == 'PCT国家阶段'  && (patentType == 1296 || patentType == 1297)">
                <el-row>
                  <el-col :span="caseDetailFormData.ishk == 1 ? 6 : 12">
                    <el-form-item label="要求提交香港申请:">
                      {{+caseDetailFormData.ishk ? '是' : '否'}}
                    </el-form-item>
                  </el-col>
                  <el-col v-show="caseDetailFormData.ishk == 1" :span="6">
                    <el-form-item label="香港申请案号:">
                      {{caseDetailFormData.hkRefNoList && caseDetailFormData.hkRefNoList.join(';')}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="caseDetailFormData.needdiv == 1 ? 6 : 12">
                    <el-form-item label="是否需要提交分案申请:">
                      {{+caseDetailFormData.needdiv ? '是' : '否' }}
                    </el-form-item>
                  </el-col>
                  <el-col v-show="caseDetailFormData.needdiv == 1 " :span="6">
                    <el-form-item label="分案申请案号:">
                      {{caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.join(';')}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="patentType == 1296 ? 6 :12">
                    <el-form-item label="要求提交IDS:">
                      {{+caseDetailFormData.needIds ? '是' : '否'}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="patentType == 1296 ? 6 :12">
                    <el-form-item label="费减比例:">
                      {{caseDetailFormData.feeReduce}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-if="caseType == 'PCT国家阶段'  &&  patentType != 1297">
                    <el-form-item label="要求新申请同时提实审:">
                      {{+caseDetailFormData.tstss ? '是' : '否'}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-if="patentType == 1296">
                    <el-form-item label="提前公布:">
                      {{caseDetailFormData.tqgk ? '是' : '否'}}
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>

              <el-row v-show="caseType == '普通新申请' && (patentType == 1297 || patentType == 1298)">
                <el-col :span="caseDetailFormData.needdiv == 1 ? 6 : 12">
                  <el-form-item label="是否需要提交分案申请:">
                    {{+caseDetailFormData.needdiv ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col v-show="caseDetailFormData.needdiv == 1 " :span="6">
                  <el-form-item label="分案申请案号:">
                    {{caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.join(';')}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="要求提交IDS:">
                    {{+caseDetailFormData.needIds ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="费减比例:">
                    {{caseDetailFormData.feeReduce}}
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
          </div>
          <div v-else>
            <el-row class="border-top">
              <el-col :span="6">
                <el-form-item label="相似设计项数:">
                  {{caseDetailFormData.wgxsNum}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="成套设计项数:">
                  {{caseDetailFormData.wgctNum}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="局部设计:">
                  {{caseDetailFormData.jusjbj ? '是' : '否'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="缺委托书:">
                  <!--              <el-input type="text" size="small" v-model="caseDetailFormData.nopower"></el-input>-->
                  {{caseDetailFormData.nopower ? '是' : '否'}}
                </el-form-item>
              </el-col>
            </el-row>
            <div>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="请求优先审查:">
                    {{caseDetailFormData.tqsc ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="要求DAS:">
                    {{caseDetailFormData.das ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-show="hasPatentPriority">
                  <el-form-item label="缺优证文件:">
                    {{+caseDetailFormData.priorityFile ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col :span="hasPatentPriority ? 6 : 12">
                  <el-form-item label="预审案件:">
                    {{+caseDetailFormData.preexamine ? '是' : '否'}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="caseDetailFormData.needdiv == 1 ? 6 : 12">
                  <el-form-item label="是否需要提交分案申请:">
                    {{+caseDetailFormData.needdiv ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col class="special-width" v-show="caseDetailFormData.needdiv == 1 " :span="6">
                  <el-form-item label="分案申请案号:">
                    {{caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.join(';')}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="要求提交IDS:">
                    {{+caseDetailFormData.needIds ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="费减比例:" prop="feeReduce">
                    {{caseDetailFormData.feeReduce}}
                    <!--                      <el-input type="number" size="small"-->
                    <!--                                @change="feeReduceChange"-->
                    <!--                                v-model="caseDetailFormData.feeReduce"></el-input>-->
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row>
                <el-col :span="caseDetailFormData.ishk == 1 ? 12 : 24">
                  <el-form-item label="要求提交香港申请:">
                    {{+caseDetailFormData.ishk ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col class="special-width" v-show="caseDetailFormData.ishk == 1" :span="12">
                  <el-form-item label="香港申请案号:">
                    {{caseDetailFormData.hkRefNoList && caseDetailFormData.hkRefNoList.join(';')}}

                  </el-form-item>
                </el-col>
              </el-row>
              <!--              <el-row>-->
              <!--                <el-col :span="24">-->
              <!--                  <el-form-item label="费减比例:" prop="feeReduce">-->
              <!--                    {{caseDetailFormData.feeReduce}}-->
              <!--                  </el-form-item>-->
              <!--                </el-col>-->
              <!--              </el-row>-->
            </div>
          </div>
          <el-row v-if="caseDetailFormData.appFromto == '外-内'">
            <el-col :span="24">
              <el-form-item label="原案语言:">
                {{caseDetailFormData.pctOpenLang}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="是否需要优先权期限提醒:">
                {{caseDetailFormData.applyExternally ? '是' : '否'}}
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
                {{caseDetailFormData.pctRecOffice}}

              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="检索单位:">
                {{caseDetailFormData.pctSearchAu}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="初审单位:">
                {{caseDetailFormData.pctPreliexAu}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="6">
              <el-form-item label="国际申请号:">
                {{caseDetailFormData.pctFileNo}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="国际申请日:">
                {{caseDetailFormData.pctFileDate}}
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="国际公开日:">
                {{caseDetailFormData.pctOpenDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="国际公开号:">
                {{caseDetailFormData.pctOpenNumber}}
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
                {{caseDetailFormData.pctRecOffice}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="检索单位:">
                {{caseDetailFormData.pctSearchAu}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="初审单位:">
                {{caseDetailFormData.pctPreliexAu}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="6">
              <el-form-item label="申请日:">
                {{caseDetailFormData.appDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="PCT申请号:">
                {{caseDetailFormData.pctFileNo}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="PCT公开号:">
                {{caseDetailFormData.pctOpenNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="PCT公开日:">
                {{caseDetailFormData.pctOpenDate}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="国际初审日:">
                {{caseDetailFormData.pctPreliexDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="优先权日:">
                {{caseDetailFormData.priorityAppDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="要求国际初步审查:">
                {{+caseDetailFormData.pctPreliex ? '是' : '否'}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="递交语言:">
                {{caseDetailFormData.pctLanguage == 'E' ? '英文' : '中文'}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--专利基础信息 海牙国际申请-->
        <div v-if="caseType === '海牙国际申请'">
          <el-row>
            <span class="header-info" id="patent-base-title">专利基础信息</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="12">
              <el-form-item label="年费监视:">
                {{+caseDetailFormData.isagency ? '是' : '否'}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="首次年费日期:">
                {{caseDetailFormData.firstYearDate}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="法律状态:">
                {{caseDetailFormData.lawStatusStr}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="法律状态变更日期:">
                {{caseDetailFormData.statusDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户状态:">
                {{caseDetailFormData.custStatusStr}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户状态变更日期:">
                {{caseDetailFormData.custstatusDate}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--        专利基础信息-->
        <div v-else>
          <el-row>
            <span class="header-info" id="patent-base-title">专利基础信息</span>
          </el-row>
          <div v-if="!((caseType == '普通新申请' && patentType == 1298 || caseType == '海牙国家阶段'))">
            <div v-if="caseType == 'PCT国际申请' && patentType == 1296">
              <el-row class="border-top">
                <el-col :span="6">
                  <el-form-item label="法律状态:">
                    {{caseDetailFormData.lawStatusStr}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="法律状态变更日期:">
                    {{caseDetailFormData.statusDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="客户状态变更日期:">
                    {{caseDetailFormData.custstatusDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="客户状态:">
                    {{caseDetailFormData.custStatusStr}}
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
            <div v-else>
              <el-row class="border-top">
                <el-col
                  :span="caseType != 'PCT国家阶段' && !(caseType == '普通新申请' && patentType == 1297) || (caseType == 'PCT国际申请' && patentType == 1296 ) || (caseType == 'PCT国家阶段' && (patentType == 1296 ||patentType == 1297)) || (caseType == '普通新申请' && (patentType == 1297||patentType == 1298))?6:12">
                  <el-form-item label="优先权日:">
                    {{caseDetailFormData.priorityAppDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="递交日期:">
                    {{caseDetailFormData.submitDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="申请日:">
                    {{caseDetailFormData.appDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="caseType !== '海牙国家阶段'?6:12">
                  <el-form-item label="申请号:">
                    <span
                      v-if="caseDetailFormData.appFromto == '外-内' || caseDetailFormData.appFromto == '内-内' || caseDetailFormData.appFromto == '台-内'">{{caseDetailFormData.appNumberStr}}</span>
                    <span v-else>{{caseDetailFormData.appNumber}}</span>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row class=""
                      v-if="caseType != 'PCT国家阶段' && (caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.length || caseDetailFormData.isDivcase)">
                <el-col :span="6" v-if="caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.length">
                  <el-form-item label="针对分案申请号:">
                    {{caseDetailFormData.parentFileNo}}
                  </el-form-item>
                </el-col>
                <el-col v-if="!caseDetailFormData.isDivcase" :span="18">
                  <el-form-item></el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseDetailFormData.isDivcase">
                  <el-form-item label="原案申请号:">
                    {{caseDetailFormData.parentAppNumber}}
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseDetailFormData.isDivcase">
                  <el-form-item label="原案申请日:">
                    {{caseDetailFormData.parentAppDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseDetailFormData.isDivcase">
                  <el-form-item label="原案PCT号:">
                    {{caseDetailFormData.pctFileNo}}
                  </el-form-item>
                </el-col>
                <el-col v-if="!(caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.length)" :span="6">
                  <el-form-item></el-form-item>
                </el-col>
              </el-row>
              <el-row class="" v-if="patentType != 1297">
                <el-col :span="6">
                  <el-form-item label="公开号:">
                    {{caseDetailFormData.openNumber}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="公开日:">
                    {{caseDetailFormData.openDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="实审请求日期:">
                    {{caseDetailFormData.ssqqDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="已提实审请求:">
                    {{+caseDetailFormData.ssqq ? '是' : '否'}}
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row class="">
                <el-col :span="6">
                  <el-form-item label="公告号:">
                    {{caseDetailFormData.declareNo}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="公告日:">
                    {{caseDetailFormData.declareDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="patentType != 1297">
                  <el-form-item label="实审日期:">
                    {{caseDetailFormData.subexamDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-else>
                  <el-form-item label="OA次数:">
                    {{caseDetailFormData.oaTimes}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="授权权利要求项数:">
                    {{caseDetailFormData.claimItems}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-show="caseType == 'PCT国家阶段' && (patentType == 1296 || patentType == 1297)">
                <el-col :span="12">
                  <el-form-item label="年费公司:">
                    {{caseDetailFormData.ngCli}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="年费公司案号:">
                    {{caseDetailFormData.ngcliRefNo}}
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row class="">
                <el-col :span="6">
                  <el-form-item label="证书号:">
                    {{caseDetailFormData.certificateNumber}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="有效日期:">
                    {{caseDetailFormData.validEndDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="年费监视:">
                    {{+caseDetailFormData.isagency ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="首次年费:">
                    {{caseDetailFormData.firstYearNumber}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="复审官方案件编号:">
                    {{caseDetailFormData.patentNumber}}
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="授权发文日期:">
                    {{caseDetailFormData.grantDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="授权日:">
                    {{caseDetailFormData.certificateDate}}
                  </el-form-item>
                </el-col>
                <!--                <el-col :span="6">-->
                <!--                  <el-form-item label="费减比例:">-->
                <!--                    {{caseDetailFormData.feeReduce}}-->
                <!--                  </el-form-item>-->
                <!--                </el-col>-->
              </el-row>
              <el-row class="">
                <el-col :span="6">
                  <el-form-item label="法律状态:">
                    {{caseDetailFormData.lawStatusStr}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="法律状态变更日期:">
                    {{caseDetailFormData.statusDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="客户状态变更日期:">
                    {{caseDetailFormData.custstatusDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="客户状态:">
                    {{caseDetailFormData.custStatusStr}}
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

          </div>
          <div v-else>
            <el-row class="border-top">
              <el-col :span="6" v-if="caseType !== '海牙国家阶段'">
                <el-form-item label="产品分类:">
                  {{caseDetailFormData.classNo}}
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="caseType !== '海牙国家阶段'">
                <el-form-item label="优先权日:">
                  {{caseDetailFormData.priorityAppDate}}
                </el-form-item>
              </el-col>
              <el-col :span="caseType !== '海牙国家阶段' ? 6 : 12">
                <el-form-item label="申请号:">
                  <span
                    v-if="caseDetailFormData.appFromto == '外-内' || caseDetailFormData.appFromto == '内-内' || caseDetailFormData.appFromto == '台-内'">{{caseDetailFormData.appNumberStr}}</span>
                  <span v-else>{{caseDetailFormData.appNumber}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="caseType !== '海牙国家阶段' ? 6 : 12">
                <el-form-item label="申请日:">
                  {{caseDetailFormData.appDate}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="公告号:">
                  {{caseDetailFormData.declareNo}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公告日:">
                  {{caseDetailFormData.declareDate}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="递交日期:">
                  {{caseDetailFormData.submitDate}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              v-if="(caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.length)||caseDetailFormData.isDivcase">
              <el-col v-if="caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.length" :span="12">
                <el-form-item label="针对分案申请号:">
                  {{caseDetailFormData.parentFileNo}}
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="caseDetailFormData.isDivcase">
                <el-form-item label="原案申请号:">
                  {{caseDetailFormData.parentAppNumber}}
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="caseDetailFormData.isDivcase">
                <el-form-item label="原案申请日:">
                  {{caseDetailFormData.parentAppDate}}
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
                  {{caseDetailFormData.certificateNumber}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="有效日期:">
                  {{caseDetailFormData.validEndDate}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="年费监视:">
                  {{+caseDetailFormData.isagency ? '是' : '否'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="首次年费:">
                  {{caseDetailFormData.firstYearNumber}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>

              <el-col :span="6">
                <el-form-item label="复审官方案件编号:">
                  {{caseDetailFormData.patentNumber}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="授权发文日期:">
                  {{caseDetailFormData.grantDate}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="授权日:">
                  {{caseDetailFormData.certificateDate}}
                </el-form-item>
              </el-col>

            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="法律状态:">
                  {{caseDetailFormData.lawStatusStr}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="法律状态变更日期:">
                  {{caseDetailFormData.statusDate}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="客户状态:">
                  {{caseDetailFormData.custStatusStr}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="客户状态变更日期:">
                  {{caseDetailFormData.custstatusDate}}
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
                {{caseDetailFormData.receiveDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建日期:">
                {{caseDetailFormData.caseDate}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建人员:">
                {{caseDetailFormData.createUserName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="border-top"
                  v-else-if="(caseType == 'PCT国际申请' && patentType == 1296 ) || (caseType == 'PCT国家阶段' && (patentType == 1296 ||patentType == 1297)) || (caseType == '普通新申请' && (patentType == 1297||patentType == 1298))">
            <el-col :span="12">
              <el-form-item label="收案日期:">
                {{caseDetailFormData.receiveDate}}
              </el-form-item>
            </el-col>
            <!--            <el-col :span="6">-->
            <!--              <el-form-item label="递交日期:">-->
            <!--                {{caseDetailFormData.submitDate}}-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <el-col :span="6">
              <el-form-item label="创建日期:">
                {{caseDetailFormData.caseDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建人员:">
                {{caseDetailFormData.createUserName}}
              </el-form-item>
            </el-col>

          </el-row>
          <el-row
            v-if="(caseType == 'PCT国家阶段' && patentType == 1297) || (caseType == 'PCT国际申请' && patentType == 1296 ) || (caseType == '普通新申请' && (patentType == 1298))">
            <el-col :span="24">
              <el-form-item label="财务备注:">
                {{caseDetailFormData.memo2}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-else>
            <el-col :span="24">
              <el-form-item label="财务备注:">
                {{caseDetailFormData.memo2}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="案件备注:">
                {{caseDetailFormData.memo}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!--        -->
      </div>
    </el-form>


    <div v-else>
      <el-form label-width="160px" class="form-container" :model="caseDetailFormData">
        <!--      案件基本信息-->
        <el-row class="border-top">
          <el-col :span="24">
            <el-form-item label="案件类型:">
              {{caseDetailFormData.caseType}}
            </el-form-item>
            <el-form-item label="代理机构:">
              {{caseDetailFormData.whdAgencyName}}
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
                {{caseDetailFormData.appFromto}}
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="caseType != '翻译'">
              <el-form-item label="主体法律性质:">
                {{caseDetailFormData.legalNature ? '法人' : '自然人'}}
              </el-form-item>
            </el-col>
            <el-col :span="caseType != '翻译' ? 6 : 12">
              <el-form-item label="技术领域:">
                {{caseDetailFormData.techFieStr}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="12">
              <el-form-item label="专利类型:" prop="patentType">
                {{caseDetailFormData.typeNameStr}}
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="caseType == '年费代缴'">
              <el-form-item label="本案为中间转案:">
                {{+caseDetailFormData.istrans ? '是' : '否'}}
              </el-form-item>
            </el-col>
            <el-col :span="caseType == '年费代缴' ? 6 : 12">
              <el-form-item label="是否代交:">
                {{caseDetailFormData.daijiao == 'Y' ? '是' : '否'}}
              </el-form-item>
            </el-col>

          </el-row>
          <el-row v-if="caseType != '香港登记'">
            <el-col :span="24">
              <el-form-item label="案件文号:">
                {{caseDetailFormData.agentNum}}
              </el-form-item>
            </el-col>

          </el-row>
          <el-row v-if="caseType == '香港登记'">
            <el-col :span="12">
              <el-form-item label="案件文号:">
                {{caseDetailFormData.agentNum}}
              </el-form-item>
            </el-col>
            <el-col :span="caseDetailFormData.twoapp == 1 ? 6 : 12">
              <el-form-item label="一带二申请:">
                {{+caseDetailFormData.twoapp ? '是' : '否'}}
              </el-form-item>
            </el-col>
            <el-col v-show="caseDetailFormData.twoapp == 1" :span="6">
              <el-form-item label="另一件案号:">
                {{caseDetailFormData.anotherApp}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="技术交底名称:">
                {{caseDetailFormData.technicalDisclosure}}
<!--                  <el-input type="text" size="small" v-model="caseDetailFormData.technicalDisclosure"></el-input>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="patentType == 1298 ? 12 : 24">
              <el-form-item label="案件中文名称:" prop="caseCnName">
                <div style="display: flex;align-items: center">
                  <div>{{caseDetailFormData.caseCnName}}</div>
                  <!--                  <img v-if="imageUrl&&caseType == '普通新申请' && patentType == 1298" style="width:100px;height:100px"-->
                  <!--                       :src="`ipdoc/${imageUrl}`" alt="">-->
                </div>

              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="patentType == 1298">
              <el-form-item label="图片">
                <div
                  style="width: 145px;height: 145px;padding: 10px"

                  class="avatar-uploader fl-ac-jc">
                  <img v-if="imageUrl" :src="`ipdoc/${imageUrl}`" class="avatar"
                       style="max-width: 100%;max-height: 100%;object-fit: contain">
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="案件英文名称:">
                {{caseDetailFormData.caseEnName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="案件日文名称:">
                {{caseDetailFormData.caseJpName}}
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="caseDetailFormData.caseType == '无效'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="专利号:">
<!--                  {{caseDetailFormData.patentNumber}}-->
                  <span
                      v-if="caseDetailFormData.appFromto == '外-内' || caseDetailFormData.appFromto == '内-内' || caseDetailFormData.appFromto == '台-内'">{{caseDetailFormData.appNumberStr}}</span>
                    <span v-else>{{caseDetailFormData.appNumber}}</span>
                </el-form-item>
              </el-col>
              <!--              <el-col :span="6">-->
              <!--                <el-form-item label="优先权日:">-->
              <!--                  {{caseDetailFormData.priorityAppDate}}-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <el-col :span="12">
                <el-form-item label="申请日:">
                  {{caseDetailFormData.appDate}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="授权日:">
                  {{caseDetailFormData.certificateDate}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="官方案件编号:">
                  {{caseDetailFormData.patentNumber}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="费减比例:">
                  {{caseDetailFormData.feeReduce}}
                </el-form-item>
              </el-col>
            </el-row>
          </div>

        </div>
        <!--      委托方-->
        <div v-if="caseType == '无效'">
          <el-row>
            <span class="header-info" id="wt-title">委托方</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="24">
              <el-form-item label="委托方:">
                  <div style="display: flex;flex-direction: column;padding-left: 5px">
                    <div :style="{marginLeft: caseDetailFormData.disableWtr == 2 ? '20px' : 0}">
                      <span v-if="caseDetailFormData.disableWtr == 1" class="el-icon-check" style="color: #409EFF;font-weight: bold;font-size: 16px"></span>
                      专利权人: {{caseDetailFormData.patentRighter}}
                      </div>
                    <div :style="{marginLeft: caseDetailFormData.disableWtr == 1 ? '20px' : 0}">
                      <span v-if="caseDetailFormData.disableWtr == 2" class="el-icon-check" style="color: #409EFF;font-weight: bold;font-size: 16px"></span>
                      请求人: {{caseDetailFormData.disableAppliant}}
                      </div>
                    </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--      客户-->
        <div>
          <el-row>
            <span class="header-info" id="cust-title">客户</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="12">
              <el-form-item label="客户:">
                {{caseDetailFormData.custName}}
                <div class="" style="display: inline-block;color: #409EFF;cursor: pointer;">
                  <span @click="customerView">查看</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="来自国家:">
                {{caseDetailFormData.country}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="折扣:">
                {{caseDetailFormData.discount}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="12">
              <el-form-item label="客户联系人:">
                {{this.customerContactsList.find(i=>i.custContactId ==
                caseDetailFormData.custConId)&&this.customerContactsList.find(i=>i.custContactId ==
                caseDetailFormData.custConId).name + '('+ this.customerContactsList.find(i=>i.custContactId ==
                caseDetailFormData.custConId).email +')'}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件邮址:">
                {{caseDetailFormData.letterAddrCn}}
              </el-form-item>
            </el-col>


          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="抄送人:">
                {{caseDetailFormData.patentCaseCustContactStr}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="12">
              <el-form-item label="账单联系人:">
                {{caseDetailFormData.billCustContactName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账单邮址:">
                {{caseDetailFormData.billAddrCn}}
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="技术联系人:">
                {{caseDetailFormData.techLinkman}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户案号:">
                {{caseDetailFormData.custRefNo}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请人案号:">
                {{caseDetailFormData.applicantRefNo}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType == '欧洲专利国家生效'">
            <el-col :span="12">
              <el-form-item label="申请人客户:">
                {{caseDetailFormData.applicantCustName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="个案要求:">
                <template v-if="caseDetailFormData.custCommand">
                  <p v-for="item in caseDetailFormData.custCommand.split('\n')">{{item}}</p>
                </template>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row v-if="caseType == '欧洲专利国家生效' || caseType == '年费代缴'">
            <el-col :span="24">
              <el-form-item label="转出所至:">
                {{caseDetailFormData.alteragency}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType == '翻译'">
            <el-col :span="12">
              <el-form-item label="申请人客户:">
                {{caseDetailFormData.applicantCustName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="要求返稿期限:">
                {{caseDetailFormData.cliSubmitDlDate}}
              </el-form-item>
            </el-col>
          </el-row>

        </div>
        <!--      申请人-->
        <div v-if="caseType != '翻译'">
          <el-row>
            <div style="position:relative; width: 100%;">
              <span class="header-info" id="app-title">申请人</span>
              <!--              <el-button type="primary" size="mini" style="position:absolute;bottom: 0;right: 0;">添加</el-button>-->
            </div>
          </el-row>
          <el-row>
            <el-table
              :data="caseDetailFormData.patentCaseApplicationList"
              border
              style="width: 100%">
              <el-table-column
                label="序号"
                type="index"
                width="60">
              </el-table-column>
              <!--              <el-table-column-->
              <!--                prop="code"-->
              <!--                width="100"-->
              <!--                label="编号">-->
              <!--              </el-table-column>-->
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
                width="60"
                label="总委">
                <template slot-scope="scope">
                  {{scope.row.iszw ? '是' : '否'}}
                </template>
              </el-table-column>
              <el-table-column
                width="300"
                label="中文地址">
                <template slot-scope="scope">
                  {{scope.row.appAddrArray&&scope.row.appAddrArray.find(i=>i.addrId ==
                  scope.row.addrId)&&scope.row.appAddrArray.find(i=>i.addrId == scope.row.addrId).addressCn}}
                  <!--                    <el-select default-first-option :clearable='true' placeholder="请选择"-->
                  <!--                             v-model="scope.row.addrId"-->
                  <!--                             filterable>-->
                  <!--                    <el-option v-for="(item,key)  in scope.row.appAddrArray" :key="key" :label="item.addressCn"-->
                  <!--                               :value="item.addrId">-->
                  <!--                    </el-option>-->
                  <!--                  </el-select>-->
                </template>
              </el-table-column>
              <el-table-column
                prop="addressEn"
                label="英文地址"
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
              <!--              <el-table-column-->
              <!--                width="150"-->
              <!--                prop="isFirstAppliantStr"-->
              <!--                label="第一联系人">-->
              <!--              </el-table-column>-->
              <el-table-column
                width="140"
                prop="beianYear"
                label="费用减缴备案年度">
              </el-table-column>
              <el-table-column
                v-if="hasApplicationType"
                prop="cardNumber"
                key="cardNumber"
                width="140"
                label="证件号">
              </el-table-column>
              <!--              <el-table-column-->
              <!--                width="140"-->
              <!--                prop="appType"-->
              <!--                label="申请人主体性质">-->
              <!--              </el-table-column>-->
            </el-table>
          </el-row>
        </div>
        <!--      许可人-->
        <div v-if="caseType == '许可备案'">
          <el-row>
            <span class="header-info" id="xk-title">许可人</span>
          </el-row>
          <el-row class="border-top">
            <el-col :span="12">
              <el-form-item label="许可人:">
                {{caseDetailFormData.patentRighter}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="许可人地址:">
                {{caseDetailFormData.party3}}
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
              <!--              <el-button type="primary" size="mini" style="position:absolute;bottom: 0;right: 0;"-->
              <!--                         @click="handlePatentInventor('add')">添加-->
              <!--              </el-button>-->
            </div>
          </el-row>
          <el-row>
            <el-table
              :data="caseDetailFormData.patentInventorList"
              border
              style="width: 100%">
              <el-table-column
                label="序号"
                type="index"
                width="60">
              </el-table-column>
              <el-table-column
                prop="inventorCtitle"
                label="中文名称">
              </el-table-column>
              <el-table-column
                prop="inventorEtitle"
                label="英文名称">
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
              <!--              <el-table-column-->
              <!--                label="操作"-->
              <!--                width="120"-->
              <!--              >-->
              <!--                <template slot-scope="scope">-->
              <!--                  <div class="handle">-->
              <!--                    <span @click="handlePatentInventor('edit', scope.row)">修改</span>-->
              <!--                    <span @click="handlePatentInventor('del',{}, scope.$index)">删除</span>-->
              <!--                  </div>-->
              <!--                </template>-->

              <!--              </el-table-column>-->
            </el-table>
          </el-row>
        </div>

        <!--      要求优先权-->
        <div
          v-if="caseType != '顾问服务' && caseType != '无效' && caseType != '咨询' && caseType != '许可备案' && caseType != '翻译'">
          <el-row>
            <div style="position:relative; width: 100%;">
              <span class="header-info" id="priority-title">要求优先权</span>
              <!--              <el-button type="primary" size="mini" style="position:absolute;bottom: 0;right: 0;"-->
              <!--                         @click="handlePatentPriorityClaim('add')">添加-->
              <!--              </el-button>-->
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
              <!--              <el-table-column-->
              <!--                label="操作"-->
              <!--                width="120"-->
              <!--              >-->
              <!--                <template slot-scope="scope">-->
              <!--                  <div class="handle">-->
              <!--                    <span @click="handlePatentPriorityClaim('edit', scope.row)">修改</span>-->
              <!--                    <span @click="handlePatentPriorityClaim('del',{}, scope.$index)">删除</span>-->
              <!--                  </div>-->
              <!--                </template>-->

              <!--              </el-table-column>-->
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
              <el-form-item label="进入国家:">
                {{caseDetailFormData.toCountry}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="外方代理所:">
                {{caseDetailFormData.agencyCustName}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="外方案号:">
                {{caseDetailFormData.agencyCustRefno}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="外方联系人:">
                {{caseDetailFormData.agencyCustContactName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="12">
              <el-form-item label="外方文件邮址:">
                {{caseDetailFormData.agencyCustFileAddrCn}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="外方要求:">
                {{caseDetailFormData.agencyCustReq}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!--      新申请递交-->
        <div v-if="caseType == '欧洲专利国家生效'">
          <el-row>
            <span class="header-info" id="new-app-title">新申请递交</span>
          </el-row>
          <div>
            <el-row class="border-top">
              <el-col :span="6">
                <el-form-item label="文稿字数:">
                  {{caseDetailFormData.wordsNum}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="说明书页数:">
                  {{caseDetailFormData.descriptionPages}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="附图幅数:">
                  {{caseDetailFormData.appendedDrawings}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="附图页数:">
                  {{caseDetailFormData.drawingPages}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="6">
                <el-form-item label="权利要求项数:">
                  {{caseDetailFormData.claimItems}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="权利要求页数:">
                  {{caseDetailFormData.claimPages}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="摘要页数:">
                  {{caseDetailFormData.substractPage}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="摘要附图页数:">
                  {{caseDetailFormData.substractDrawing}}
                </el-form-item>
              </el-col>

            </el-row>
            <el-row class="">
              <el-col :span="6">
                <el-form-item label="摘要附图指定图:">
                  {{caseDetailFormData.substractDrwno}}
                </el-form-item>
              </el-col>
              <el-col :span="6" v-show="caseDetailFormData.appFromto == '内-内'">
                <el-form-item label="预审案件:">
                  {{+caseDetailFormData.preexamine ? '是' : '否'}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="要求DAS:">
                  {{+caseDetailFormData.das ? '是' : '否'}}
                </el-form-item>
              </el-col>
              <el-col :span="caseDetailFormData.appFromto == '内-内' ? 6 : 12">
                <el-form-item label="缺委托书:">
                  {{+caseDetailFormData.nopower ? '是' : '否'}}
                </el-form-item>
              </el-col>
            </el-row>
            <!--            <el-row class="">-->
            <!--&lt;!&ndash;              <el-col :span="12">&ndash;&gt;-->
            <!--&lt;!&ndash;                <el-form-item label="要求优先审查:">&ndash;&gt;-->
            <!--&lt;!&ndash;                  {{+caseDetailFormData.tqsc ? '是' : '否'}}&ndash;&gt;-->
            <!--&lt;!&ndash;                </el-form-item>&ndash;&gt;-->
            <!--&lt;!&ndash;              </el-col>&ndash;&gt;-->
            <!--              <el-col :span="24">-->
            <!--                <el-form-item>-->
            <!--                  <span slot="label">要求审查高速公路<br>(PPH)</span>-->
            <!--                  {{+caseDetailFormData.dopph ? '是' : '否'}}-->
            <!--                </el-form-item>-->
            <!--              </el-col>-->

            <!--            </el-row>-->
            <div v-if="caseType == '欧洲专利国家生效'">
              <el-row>
                <el-col :span="caseDetailFormData.ishk == 1 ? 6 : 12">
                  <el-form-item label="要求提交香港申请:">
                    {{+caseDetailFormData.ishk ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col v-show="caseDetailFormData.ishk == 1" :span="6">
                  <el-form-item label="香港申请案号:">
                    {{caseDetailFormData.hkRefNoList && caseDetailFormData.hkRefNoList.join(';')}}
                  </el-form-item>
                </el-col>
                <el-col :span="caseDetailFormData.needdiv == 1 ? 6 : 12">
                  <el-form-item label="是否需要提交分案申请:">
                    {{+caseDetailFormData.needdiv ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col v-show="caseDetailFormData.needdiv == 1 " :span="6">
                  <el-form-item label="分案申请案号:">
                    {{caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.join(';')}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="要求新申请同时提实审:">
                    {{+caseDetailFormData.tstss ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="要求提交IDS:">
                    {{+caseDetailFormData.needIds ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="费减比例:">
                    {{caseDetailFormData.feeReduce}}
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

          </div>
          <el-row v-if="caseDetailFormData.appFromto == '外-内'">
            <el-col :span="24">
              <el-form-item label="原案语言:">
                {{caseDetailFormData.pctOpenLang}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="是否需要优先权期限提醒:">
                {{caseDetailFormData.applyExternally ? '是' : '否'}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>


        <!--      专利基础信息-->
        <div v-if="['咨询', '许可备案', '翻译', '欧洲专利国家生效', '年费代缴', '其他'].includes(caseType)">
          <el-row>
            <span class="header-info" id="patent-base-title">专利基础信息</span>
          </el-row>
          <div v-if="caseType == '欧洲专利国家生效'" :class="[hidePatentBase ? 'hidePatentBase' : 'showPatentBase']">
            <div>
              <el-row class="border-top">
                <el-col :span="caseType != 'PCT国家阶段'?6:12">
                  <el-form-item label="优先权日:">
                    {{caseDetailFormData.priorityAppDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseType != 'PCT国家阶段'">
                  <el-form-item label="递交日期:">
                    {{caseDetailFormData.submitDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="申请日:">
                    {{caseDetailFormData.appDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="申请号:">
                    <span
                      v-if="caseDetailFormData.appFromto == '外-内' || caseDetailFormData.appFromto == '内-内' || caseDetailFormData.appFromto == '台-内'">{{caseDetailFormData.appNumberStr}}</span>
                    <span v-else>{{caseDetailFormData.appNumber}}</span>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row class=""
                      v-if="caseType != 'PCT国家阶段' && (caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.length || caseDetailFormData.isDivcase)">
                <el-col :span="6" v-if="caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.length">
                  <el-form-item label="针对分案申请号:">
                    {{caseDetailFormData.parentFileNo}}
                  </el-form-item>
                </el-col>
                <el-col v-if="!caseDetailFormData.isDivcase" :span="18">
                  <el-form-item></el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseDetailFormData.isDivcase">
                  <el-form-item label="原案申请号:">
                    {{caseDetailFormData.parentAppNumber}}
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseDetailFormData.isDivcase">
                  <el-form-item label="原案申请日:">
                    {{caseDetailFormData.parentAppDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="caseDetailFormData.isDivcase">
                  <el-form-item label="原案PCT号:">
                    {{caseDetailFormData.pctFileNo}}
                  </el-form-item>
                </el-col>
                <el-col v-if="!caseDetailFormData.divcaseList&&caseDetailFormData.divcaseList.length" :span="6">
                  <el-form-item></el-form-item>
                </el-col>
              </el-row>
              <el-row class="">
                <el-col :span="6">
                  <el-form-item label="公开号:">
                    {{caseDetailFormData.openNumber}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="公开日:">
                    {{caseDetailFormData.openDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="实审请求日期:">
                    {{caseDetailFormData.ssqqDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="已提实审请求:">
                    {{+caseDetailFormData.ssqq ? '是' : '否'}}
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row class="">
                <el-col :span="6">
                  <el-form-item label="公告号:">
                    {{caseDetailFormData.declareNo}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="公告日:">
                    {{caseDetailFormData.declareDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="OA次数:">
                    {{caseDetailFormData.oaTimes}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="授权权利要求项数:">
                    {{caseDetailFormData.claimItems}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="年费公司:">
                    {{caseDetailFormData.ngCli}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="年费公司案号:">
                    {{caseDetailFormData.ngcliRefNo}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="">
                <el-col :span="6">
                  <el-form-item label="证书号:">
                    {{caseDetailFormData.certificateNumber}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="有效日期:">
                    {{caseDetailFormData.validEndDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="年费监视:">
                    {{+caseDetailFormData.isagency ? '是' : '否'}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="首次年费:">
                    {{caseDetailFormData.firstYearNumber}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="复审官方案件编号:">
                    {{caseDetailFormData.patentNumber}}
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
              <el-row class="">
                <el-col :span="6">
                  <el-form-item label="法律状态:">
                    {{caseDetailFormData.lawStatusStr}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="法律状态变更日期:">
                    {{caseDetailFormData.statusDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="客户状态变更日期:">
                    {{caseDetailFormData.custstatusDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="客户状态:">
                    {{caseDetailFormData.custStatusStr}}
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
          </div>
          <div v-else-if="caseType == '年费代缴'">
            <el-row class="border-top">
              <el-col :span="6">
                <el-form-item label="申请号:">
                  <span
                    v-if="caseDetailFormData.appFromto == '外-内' || caseDetailFormData.appFromto == '内-内' || caseDetailFormData.appFromto == '台-内'">{{caseDetailFormData.appNumberStr}}</span>
                  <span v-else>{{caseDetailFormData.appNumber}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申请日:">
                  {{caseDetailFormData.appDate}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="证书号:">
                  {{caseDetailFormData.certificateNumber}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="有效日期:">
                  {{caseDetailFormData.validEndDate}}
                </el-form-item>
              </el-col>

            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="公开号:">
                  {{caseDetailFormData.openNumber}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公开日:">
                  {{caseDetailFormData.openDate}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公告号:">
                  {{caseDetailFormData.declareNo}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公告日:">
                  {{caseDetailFormData.declareDate}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="授权日:">
                  {{caseDetailFormData.certificateDate}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="授权权利要求项数:">
                  {{caseDetailFormData.claimItems}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="授权发文日期:">
                  {{caseDetailFormData.grantDate}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="递交日期:">
                  {{caseDetailFormData.submitDate}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>

              <el-col :span="6">
                <el-form-item label="法律状态:">
                  {{caseDetailFormData.lawStatusStr}}
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
                  {{caseDetailFormData.custStatusStr}}
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
                  {{caseDetailFormData.firstYearNumber}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="费减比例:">
                  {{caseDetailFormData.feeReduce}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年费监视:">
                  {{+caseDetailFormData.isagency ? '是' : '否'}}
                </el-form-item>

              </el-col>
            </el-row>
          </div>
          <div v-else :class="[hidePatentBase ? 'hidePatentBase' : 'showPatentBase']">
            <el-row class="border-top" v-if="caseType != '翻译'">
              <el-col :span="6">
                <el-form-item label="申请号:">
                  <span
                    v-if="caseDetailFormData.appFromto == '外-内' || caseDetailFormData.appFromto == '内-内' || caseDetailFormData.appFromto == '台-内'">{{caseDetailFormData.appNumberStr}}</span>
                  <span v-else>{{caseDetailFormData.appNumber}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申请日:">
                  {{caseDetailFormData.appDate}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="登记日:">
                  {{caseDetailFormData.certificateDate}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="证书号:">
                  {{caseDetailFormData.certificateNumber}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :class="{'border-top': caseType == '翻译'}">
              <el-col :span="6">
                <el-form-item label="客户状态变更日期:">
                  {{caseDetailFormData.custstatusDate}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="法律状态:">
                  {{caseDetailFormData.lawStatusStr}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="法律状态变更日期:">
                  {{caseDetailFormData.statusDate}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="客户状态:">
                  {{caseDetailFormData.custStatusStr}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="caseType != '翻译'">
              <el-col :span="24">
                <el-form-item label="年费监视:">
                  {{+caseDetailFormData.isagency ? '是' : '否'}}
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
              <el-form-item label="母案卷号:">
                {{caseDetailFormData.origRefNo}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="PCT进入日:">
                {{caseDetailFormData.btUseDate}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="母案优先权日:">
                {{caseDetailFormData.origPriorityDate}}
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="母案申请号:">
                {{caseDetailFormData.parentAppNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="母案申请日:">
                {{caseDetailFormData.parentAppDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="母案公开号:">
                {{caseDetailFormData.origOpenNo}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="母案公开日:">
                {{caseDetailFormData.origOpenDate}}
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="母案公告号:">
                {{caseDetailFormData.origAnnounceNo}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="母案公告日:">
                {{caseDetailFormData.origAnnounceDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="国际申请号:">
                {{caseDetailFormData.pctFileNo}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="国际申请日:">
                {{caseDetailFormData.pctFileDate}}
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="国际公开号:">
                {{caseDetailFormData.pctOpenNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="国际公开日:">
                {{caseDetailFormData.pctOpenDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="母案官方状态:">
                {{caseDetailFormData.origStatusName}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="母案客户状态:">
                {{caseDetailFormData.origCustStatusStr}}
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
                <span
                  v-if="caseDetailFormData.appFromto == '外-内' || caseDetailFormData.appFromto == '内-内' || caseDetailFormData.appFromto == '台-内'">{{caseDetailFormData.appNumberStr}}</span>
                <span v-else>{{caseDetailFormData.appNumber}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请日:">
                {{caseDetailFormData.appDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="优先权日:">
                {{caseDetailFormData.priorityAppDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="年费监视:">
                {{+caseDetailFormData.isagency ? '是' : '否'}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="公开号:">
                {{caseDetailFormData.openNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公开日:">
                {{caseDetailFormData.openDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公告号:">
                {{caseDetailFormData.declareNo}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公告日:">
                {{caseDetailFormData.declareDate}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="授权发文日期:">
                {{caseDetailFormData.grantDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="授权日:">
                {{caseDetailFormData.certificateDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="证书号:">
                {{caseDetailFormData.certificateNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="有效日期:">
                {{caseDetailFormData.validEndDate}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="法律状态:">
                {{caseDetailFormData.lawStatusStr}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="法律状态变更日期:">
                {{caseDetailFormData.statusDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户状态:">
                {{caseDetailFormData.custStatusStr}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户状态变更日期:">
                {{caseDetailFormData.custstatusDate}}
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
                {{caseDetailFormData.receiveDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建日期:">
                {{caseDetailFormData.caseDate}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建人员:">
                {{caseDetailFormData.createUserName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-else class="border-top">
            <el-col :span="6">
              <el-form-item label="收案日期:">
                {{caseDetailFormData.receiveDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="递交日期:">
                {{caseDetailFormData.submitDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建日期:">
                {{caseDetailFormData.caseDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建人员:">
                {{caseDetailFormData.createUserName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType != '年费代缴' && caseType != '香港登记' && caseType != '澳门登记' && caseType != '欧洲专利国家生效'">
            <el-col :span="24">
              <el-form-item label="财务备注:">
                {{caseDetailFormData.memo2}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType == '香港登记' || caseType == '澳门登记'">
            <el-col :span="6">
              <el-form-item label="指示外方代理日:">
                {{caseDetailFormData.agencyCustShowDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="第二步递交日期:">
                {{caseDetailFormData.ssqqDate}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请人与发明人的关系">
                {{caseDetailFormData.modifymemo}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="caseType == '欧洲专利国家生效'">
            <el-col :span="12">
              <el-form-item label="委托外方日期:">
                {{caseDetailFormData.agencyCustShowDate}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="">
                <!--                {{caseDetailFormData.checkerUserId&&$store.getters.allUserList.find(item=>item.userId ==-->
                <!--                caseDetailFormData.checkerUserId).fullname}}-->
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
                {{caseDetailFormData.memo2}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="案件备注:">
                {{caseDetailFormData.memo}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import patentCommonCase from '../patentCommonCase'
  import {
    tmdetail,
    queryAgencyName,
    queryAlltask,
    modifyjoinapp,
    createCode,
    queryCustomerNameId,
    getCaseTime
  } from '@/api/caseList'
  import {
    queryPatentCaseInfo,
    queryCountry,
    queryCustomerContactByCustIdUrl,
    queryCustomerContactByCustContactIdUrl,
    queryOtherCustomerListUrl,
    queryCustomerUrl,
    queryCaseAgentNumList
  } from '@/api/caseDetail'
  import { billSubmitUrl, billDiscount } from '@/api/billApi'
  import { querycustSelectClass } from '@/api/customerList.js'

  export default {
    name: 'patentCaseDetail',
    components: {
      patentCommonCase
    },
    props: {
      caseDetailFormData: {}
    },
    computed: {
      isShowDCF(){
        const arrayA = [102,122,143]
        const arrayB = this.caseDetailFormData.designatedCountryList || []
        return arrayA.some(num => arrayB.includes(num))
      },
      hasApplicationType(){
        return this.caseDetailFormData.patentCaseApplicationList&&this.caseDetailFormData.patentCaseApplicationList.find(item => item.applicationType == '1752')
      },
      appCnName() {
        if (this.caseDetailFormData.patentCaseApplicationList.length) {
          return this.caseDetailFormData.patentCaseApplicationList[0].applicantName
        }
      },
      patentType() {
        return this.caseDetailFormData.patentType || 1296
      },
      caseType() {
        return this.caseDetailFormData.caseType || '普通新申请'
      }
    },
    data() {
      return {
        imageUrl: '',
        hasZw: false,
        hasPatentPriority: false,
        // caseDetailFormData: {},
        anotherCaseNumList: [],
        elstepList: [],
        stepActive1: 0,
        hidePatentBase: false,
        hideNewApp: false,
        hideApp: false,
        rules: {
          patentType: [{ required: true, message: '请选择专利类型', trigger: 'change' }],
          appFromto: [{ required: true, message: '请选择申请方向', trigger: 'change' }],
          caseCnName: [{ required: true, message: '请填写案件中文名称', trigger: 'blur' }]
          // custId: [{ required: true, message: '请选择客户', trigger: 'change' },],
          // executor: [{ required: true, message: '请选择任务执行人', trigger: 'change' },],
        },
        curCustLevel: false,
        patentInventorTitle: '',
        patentInventorItem: {},
        patentInventor: false,
        patentPriorityClaimTitle: '',
        patentPriorityClaimItem: {},
        patentPriorityClaim: false,
        caseIds: '',
        applicantTypeList: [],
        patentTypeList: [],
        techFieldList: [],
        countryList: [],
        customerContactsList: [],
        customerMailAddsList: [],
        billAddsList: [],
        billContactsList: [],
        hzListsList: [],
        customerContactswfList: [],
        customerAddrsList: [],
        statusList: [],
        custStatusList: [],
        queryCustomerNameIdList: []
      }
    },
    watch: {
      // 'caseDetailFormData.patentCaseApplicationList': {
      //   handler(n){
      //     this.hasZw = false
      //     if (n && n.length) {
      //       n.forEach(i => {
      //         if (i.iszw) {
      //           this.hasZw = true
      //         }
      //       })
      //     }
      //   },
      //   immediate: true
      //
      // },
      'caseDetailFormData.patentPriorityClaimList':{
        handler(n){
          this.hasPatentPriority = false
          if (n && n.length) {
            this.hasPatentPriority = true
          }
        },
        immediate: true

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
            this.imageUrl = n.materials.find(i => i.materialTypeId == 301510) && n.materials.find(i => i.materialTypeId == 301510).address
            this.queryCustomerContactByCustIdUrl()
            this.queryCustomerContactByCustContactIdUrl()
          }
        },
        immediate: true,
        deep: true
      }
    },
    created() {
      // const id = this.$route.params && this.$route.params.id
      // this.caseIds = id.split(",")
      // this.queryCaseInfo(this.caseIds)
      // this.queryOtherCustomerListUrl()
      // this.queryCountry()
      // this.querycustSelectClass()
    },
    mounted() {
      if (this.$route.query.pageId) {
        this.hidePatentBase = true
        this.hideNewApp = true
      }

      window.addEventListener('scroll', this.handleScroll, true)
    },
    methods: {
      customerView() {
        if (!this.caseDetailFormData.custId) return
        window.open(`/#/workbench/customer_management/cust_view/${this.caseDetailFormData.custId}`)
      },
      //分案号变化
      agentNumChange(e) {
        if (!e.length) return
        let list = []
        e.forEach(item => {
          if (this.anotherCaseNumList.length && this.anotherCaseNumList.find(i => i.agentNum == item)) {
            list.push(this.anotherCaseNumList.find(i => i.agentNum == item).appNumber)
          }
        })
        let str = this.caseDetailFormData.parentFileNo ? this.caseDetailFormData.parentFileNo : ''
        str += list.filter(item => !!item) + (str ? ';' : '')
        this.caseDetailFormData.parentFileNo = str
      },
      //另一件案号搜索事件
      queryCaseAgentNumList(query) {
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
      billDiscount() {
        billDiscount(this.caseDetailFormData).then(res => {
          this.caseDetailFormData.discount = res.data
        })
      },
      //更改客户
      selectCustChange(e) {
        if (!e) {
          return
        }
        this.caseDetailFormData.custConId = ''
        this.caseDetailFormData.trademarkCaseCustContacts = ''
        this.queryCustomerContactByCustIdUrl()
        this.billDiscount()
      },
      //发明人操作
      handlePatentInventor(flag, data, index) {
        flag == 'add' ? this.patentInventorTitle = '添加发明人' : this.patentInventorTitle = '修改发明人'
        data ? this.patentInventorItem = data : ''
        if (flag == 'del') {
          this.caseDetailFormData.patentInventorList.splice(index, 1)
        } else {
          this.patentInventor = true
        }
      },
      //添加发明人
      addPatentInventor() {
        this.caseDetailFormData.patentInventorList.push(this.patentInventorItem)
        this.closePatentInventor()
      },
      //关闭发明人弹框
      closePatentInventor() {
        this.patentInventor = false
        this.patentInventorItem = {}
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
      addPatentPriorityClaim() {
        this.caseDetailFormData.patentPriorityClaimList.push(this.patentPriorityClaimItem)
        this.closePatentPriorityClaim()
      },
      //关闭 添加要求优先权弹框
      closePatentPriorityClaim() {
        this.patentPriorityClaim = false
        this.patentPriorityClaimItem = {}
      },
      defaultData(data) {
        this.caseDetailFormData.receiveDate = data.receiveDate || this.$commonUtils.getDay(0, '-')
        this.caseDetailFormData.caseDate = data.caseDate || this.$commonUtils.getDay(0, '-')
        this.caseDetailFormData.createUserId = data.createUserId || this.$store.getters.userId
        this.caseDetailFormData.substractPage = data.substractPage || 1
        this.caseDetailFormData.substractDrawing = data.substractDrawing || 1
      },
      async queryCaseInfo(caseIds) {
        let { data } = await queryPatentCaseInfo({ caseIds, initFlag: 1 })
        this.caseDetailFormData = Object.assign(data, this.caseDetailFormData)
        let res = await queryPatentCaseInfo({ caseIds })
        this.caseDetailFormData = res.data
        this.queryCustomerContactByCustIdUrl()
        this.queryCustomerContactByCustContactIdUrl()
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
      //信函地址
      queryCustomerContactByCustContactIdUrl() {
        if (!this.caseDetailFormData.custConId) {
          return
        }
        queryCustomerContactByCustContactIdUrl({
          custContactId: this.caseDetailFormData.custConId
        }).then(res => {
          this.customerMailAddsList = res.data.customerMailAdds
          this.billAddsList = res.data.BillAdds
          this.billAddsList.forEach(item => {
            if (!item.addressCn) {
              item.addressCn = item.addressEn
            }
          })
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
          })
          .catch(err => {
            console.log(err)
          })
      },
      //国家
      queryCountry() {
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
        let classIdString = [1042, 1062, 1096, 1139, 1140, 1141, 1143].join(',')
        querycustSelectClass({ classId: classIdString }).then(res => {
          this.applicantTypeList = res.data['1042']
          this.patentTypeList = res.data['1062']
          this.techFieldList = res.data['1096']
          this.statusList = res.data['1139']
          this.custStatusList = res.data['1143']
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .el-form {
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
          border: 1px solid #ebeef5;
          border-top: none;
          border-right: none;
          margin-bottom: 0;
          /*display: flex;*/
          /*align-items: center;*/
          /*justify-content: center;*/
          .el-form-item__content {
            height: 100%;
            /*line-height: 30px;*/
            /*padding: 5px 15px;*/
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
            /*border-right: 1px solid #d7d7d7;*/
            background-color: #f5f7fa;
            color: #606266;
          }
        }

        &:last-child {
          /*border: 1px solid #ebeef5;*/
          border-right: 1px solid #ebeef5;
        }
      }
    }

    .border-top {
      border-top: 1px solid #ebeef5;
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
          /*height: 41px;*/

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
              /*height: 28px;*/
            }

            .el-input__icon {
              /*line-height: 28px;*/
            }

            .el-input, .el-textarea {
              width: 80% !important;
              margin-left: 10px;
            }

            .el-form-item__label {
              min-height: 30px;
              line-height: 30px;
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
</style>
