<template>
  <div>
    <div class="km-cell-editor" :style="cellEditorStyle" :class="{
        'else': editor.editType != 'text' && editor.editType != 'number'
      }" @dblclick="setEditing" v-show="editor.editorShow">
      <textarea ref="clipboard" class="km-clipboard" @paste="clipboardToContent">
      </textarea>
      <div style="flex:1;" v-show="editor.editing">
        <textarea v-if="editor.editType == 'text'" ref="text" v-model="editContent" @change="resetEditor" @blur="resetEditor">
        </textarea>
        <el-date-picker size="mini" v-model="editContent" value-format="yyyy-MM-dd" type="date" :style="{width:`${editor.curEditorWidth > 140 ? editor.curEditorWidth : 140}px`}" @blur="resetEditor"
          v-else-if="editor.editType === 'date'" ref="date">
        </el-date-picker>
        <el-date-picker size="mini" v-model="editContent" value-format="yyyy-MM" type="month" :style="{width:`${editor.curEditorWidth > 140 ? editor.curEditorWidth : 140}px`}" @blur="resetEditor"
          v-else-if="editor.editType === 'month'" ref="month">
        </el-date-picker>
        <el-select size="mini" @change="resetEditor" :automatic-dropdown="true" default-first-option v-model="editContent" :filterable='true' :style="{width:`${editor.curEditorWidth}px`}"
          v-else-if="editor.editType === 'select'" :allow-create="columns[editor.editorXIndex].key === 'appCnAddr'" placeholder="请选择" clearable ref="select">
          <el-option v-for="item in editor.options" :value="item.value" :key="item.value" :label="item.label">
          </el-option>
        </el-select>
        <el-select size="mini" @change="resetEditor" :automatic-dropdown="true" default-first-option value-key='label' v-model="editContent" :filterable='true'
          :style="{width:`${editor.curEditorWidth}px`}" v-else-if="editor.editType === 'selectItem'" placeholder="请选择" clearable ref="selectItem">
          <el-option v-for="item in editor.options" :value="item" :key="item.value" :label="item.label">
          </el-option>
        </el-select>

        <el-select size="mini" @change="resetEditor" :remote-method="remoteMethod" default-first-option remote :automatic-dropdown="true" value-key='value' v-model="editContent" :filterable='true'
          :style="{width:`${editor.curEditorWidth}px`}" v-else-if="editor.editType === 'searchSelect'" placeholder="请选择" clearable ref="searchSelect">
          <el-option v-for="item in editor.options" :value="item" :key="item.value" :label="item.label">
          </el-option>
        </el-select>

        <textarea v-model="editContent" v-else-if="editor.editType === 'number'" ref="number" @input="limitNumber(editContent)" @paste="limitNumber(editContent)">
        </textarea>
      </div>
    </div>
    <div ref="autofillHandler" class="km-autofill-handler" :style="autofillHandlerStyle" @mousedown="handleAutofill" v-if="autofillState" v-show="!editor.editing && editor.editorShow">
    </div>
    <div class="km-cover-area selected" :style="selectedStyle"></div>
    <div class="km-cover-area selected fixed" :style="fixedSelectedStyle"></div>
    <div class="km-cover-area autofill" :style="autofillStyle"></div>
    <div class="km-cover-area autofill fixed" :style="fixedAutofillStyle"></div>

    <el-dialog title="提示" :append-to-body="true" :close-on-click-modal='false' :close-on-press-escape='false' :show-close='false' :visible.sync="yeditedialogVisible" width="70%">
      <div v-if="editor.editType === 'patentPriorityClaimList'">
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
                class="patent"
                :data="editContent"
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
      </div>
      <div v-if="editor.editType === 'patentInventorList'">
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
                class="patent"
                :data="editContent"
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
                      <span @click="handlePatentInventor('edit', scope.row, scope.$index)">修改</span>
                      <span @click="handlePatentInventor('del',{}, scope.$index)">删除</span>
                    </div>
                  </template>

                </el-table-column>
              </el-table>
            </el-row>
          </div>
      </div>
      <div v-if="editor.editType === 'patentCaseApplicationList'">
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
                class="patent"
                :data="editContent"
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
                <el-table-column
                  width="130"
                  prop="applicantName"
                  label="申请人中文名称">
                </el-table-column>
                <el-table-column
                  width="130"
                  prop="applicantEnName"
                  label="申请人英文名称">
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
                      <el-option v-for="(item,key)  in scope.row.appAddrArray" :key="key" :label="item.addressCn"
                                 :value="item.addrId">
                      </el-option>
                    </el-select>
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
                  v-if="showData[editor.editorYIndex].caseType == 'PCT国际申请'"
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
      <Goods
        :appFromto="showData[editor.editorYIndex].appFromto"
        v-if="editor.editType === 'goods' && yeditedialogVisible"
        :appId='showData[editor.editorYIndex].appId'
        :trademarkCaseCategoryModifyList="showData[editor.editorYIndex].trademarkCaseCategoryModifyList"
        :goodsVersionList="goodsVersionList"
        :caseId="showData[editor.editorYIndex].caseId"
        @getGoods='getGoods'
        @delgood='delrow'
        :goodsListData='editContent'></Goods>
        <CaseInvestigators :plData='editContent'  isCustwork='cust' :isEdit="true" @workGroup="workGroup" v-if="yeditedialogVisible && editor.editType === 'trademarkCaseCustWorkgroups'"></CaseInvestigators>
        <CaseInvestigators  :plData='editContent' isCustwork='cb' :isEdit="true" @workGroup="workGroup" v-if="yeditedialogVisible && editor.editType === 'trademarkCaseCBWorkgroups'"></CaseInvestigators>

      <JoinList v-if="editor.editType === 'joinApps'" :casetype="this.$commonUtils.getMenuName(this.$store.state.caseInformation.caseTypeList,'childrens').find(item=>item.caseTypeId==showData[editor.editorYIndex].caseTypeId).caseType" @getjoin='getjoin' @deljoin='delMDL' :joinList='editContent'></JoinList>
      <overseas-quotation
        ref="overseas"
        :case-id="showData[editor.editorYIndex] && showData[editor.editorYIndex].caseId"
        :case-ids="[showData[editor.editorYIndex]&&showData[editor.editorYIndex].caseId]"
        v-if="showData[editor.editorYIndex] && showData[editor.editorYIndex].caseId && currencyList.length && editor.editType === 'agencyOffers'"
        :currencyList="currencyList"
        type="edit"
        :priceData="showData[editor.editorYIndex].agencyOffers"
        @addQuotationData="addQuotationData"
        @delQuotationData="delQuotationData"
      ></overseas-quotation>
      <el-col v-if="editor.editType === 'trademarkCaseBasicinfos'" :span="24" class="form-con-item">
        <el-row>
          <el-col :span="24" style="text-align:right">

            <el-button @click="addMDL" size="mini" style="margin-left:10px" type="primary">
              添加
            </el-button>
          </el-col>
        </el-row>
        <el-row class="form-border">
          <el-col :span="24">
            <el-table :data="editContent" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
              <el-table-column align="left" label="序号" type="index" width="50" />
              <el-table-column align="left" label="基础注册/申请号" width>
                <template slot-scope="scope">

                  <el-input placeholder="" size="small" v-model="scope.row.regNumber" />
                </template>
              </el-table-column>
              <el-table-column align="left" label="基础注册/申请日" width>
                <template slot-scope="scope">

                  <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" size="small" type="date" v-model="scope.row.regDate" value-format="yyyy-MM-dd" />
                </template>
              </el-table-column>

              <el-table-column align="left" label="操作" width>
                <template slot-scope="scope">
                  <el-button @click="delMDL(scope.row,scope.$index)" size="mini" type="text">删除
                  </el-button>
                </template>
              </el-table-column>

            </el-table>
          </el-col>
        </el-row>
      </el-col>
      <el-col v-if="editor.editType === 'tmCaseList'" :span="24" class="form-con-item">
        <el-row class="form-border">
          <el-col :span="24">
            <el-table v-if="plType == '官方通知1'" :data="showData[this.editor.editorYIndex].tmCaseList" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
              <el-table-column align="left" label="序号" type="index" width="50" />
              <el-table-column align="left" label="案件文号" width="130">
                <template slot-scope="scope">
                  <span>{{scope.row.agentNum}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="appDate"
                label="申请日"
                width="180"
              >
                <template slot-scope="scope">
                  <el-date-picker
                    style="width: 150px;"
                    size="mini"
                    v-if="(typeName==='受理通知'||typeName==='缴费通知书'||typeName==='不予通知书'||typeName==='核准通知书'||typeName==='核准证明')"
                    v-model="scope.row.appDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                  <span v-else>{{scope.row.appDate}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="appNumber"
                width="180"
                label="申请号"
              >
                <template slot-scope="scope">
                  <el-input style="width: 150px;" size="mini" v-if="typeName==='受理通知'||typeName==='补正通知'||typeName=='缴费通知书'||typeName==='核准证明'||typeName==='核准通知书'" v-model="scope.row.appNumber" placeholder="请输入申请号"></el-input>
                  <span v-else>{{scope.row.appNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="approvalDate"
                width="180"
                label="初步审定公告日期"
              >
                <template slot-scope="scope">
                  <el-date-picker
                    size="mini"
                    style="width: 150px;"
                    v-if="typeName==='初步审定公告'"
                    v-model="scope.row.approvalDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                  <span v-else>{{scope.row.approvalDate}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="approvalNumber"
                width="180"
                label="初步审定公告期号"
              >
                <template slot-scope="scope">
                  <el-input style="width: 150px;" size="mini" v-if="typeName==='初步审定公告'" v-model="scope.row.approvalNumber" placeholder="初步审定公告期号"></el-input>
                  <span v-else>{{scope.row.approvalNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="approvalNo"
                width="180"
                label="初步审定公告号"
              >
                <template slot-scope="scope">
                  <el-input style="width: 150px;" size="mini" v-if="typeName==='初步审定公告'" v-model="scope.row.approvalNo" placeholder="初步审定公告号"></el-input>
                  <span v-else>{{scope.row.approvalNo}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="objectionDate"
                width="180"
                label="异议截止日"
              >
                <template slot-scope="scope">
                  <el-date-picker
                    size="mini"
                    style="width: 150px;"
                    v-if="typeName==='初步审定公告'"
                    v-model="scope.row.objectionDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                  <span v-else>{{scope.row.objectionDate}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="regNoticeNumber"
                width="180"
                label="注册期号"
              >
                <template slot-scope="scope">
                  <el-input style="width: 150px;" size="mini" v-if="typeName==='注册证'" v-model="scope.row.regNoticeNumber" placeholder="注册期号"></el-input>
                  <span v-else>{{scope.row.regNoticeNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="regNumber"
                width="180"
                label="注册号"
              >
                <template slot-scope="scope">
                  <el-input style="width: 150px;" size="mini" v-if="typeName==='注册证'" v-model="scope.row.regNumber" placeholder="请输入注册号"></el-input>
                  <span v-else>{{scope.row.regNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="regDate"
                width="180"
                label="注册日期"
              >
                <template slot-scope="scope">
                  <el-date-picker
                    style="width: 150px;"
                    size="mini"
                    v-if="typeName==='注册证'||typeName==='核准证明'"
                    v-model="scope.row.regDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                  <span v-else>{{scope.row.regDate}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="validStartDate"
                width="180"
                label="有效起日"
              >
                <template slot-scope="scope">
                  <el-date-picker
                    size="mini"
                    style="width: 150px;"
                    v-if="typeName==='注册证'||typeName==='核准证明'"
                    v-model="scope.row.validStartDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                  <span v-else>{{scope.row.validStartDate}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="validEndDate"
                width="180"
                label="有效止日"
              >
                <template slot-scope="scope">
                  <el-date-picker
                    size="mini"
                    style="width: 150px;"
                    v-if="typeName==='注册证'||typeName==='核准证明'"
                    v-model="scope.row.validEndDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                  <span v-else>{{scope.row.validEndDate}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="案件类型" width="180">
                <template slot-scope="scope">

                  <span>{{scope.row.caseType}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="客户名称" width="180">
                <template slot-scope="scope">
                  <CustCard :custName='scope.row.custName' :customerID='scope.row.custId' />
                </template>
              </el-table-column>
              <el-table-column align="left" label="商标名称" width="180">
                <template slot-scope="scope">
                  <span>{{scope.row.tmName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="商标类别" width="180">
                <template slot-scope="scope">
                  <span>{{scope.row.goodClasses}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="申请人中文名称" width="180">
                <template slot-scope="scope">
                  <span>{{scope.row.appCnName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="商标号" width="180">
                <template slot-scope="scope">
                  <span>{{scope.row.regNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="阶段" width="180">
                <template slot-scope="scope">
                  <span>{{scope.row.stageName}}</span>
                </template>
              </el-table-column>

            </el-table>
            <el-table v-else :data="showData[this.editor.editorYIndex].tmCaseList" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
              <el-table-column align="left" label="序号" type="index" width="50" />
              <el-table-column align="left" label="案件类型" width>
                <template slot-scope="scope">

                  <span>{{scope.row.caseType}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="案件文号" width>
                <template slot-scope="scope">
                  <span>{{scope.row.agentNum}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="客户名称" width>
                <template slot-scope="scope">
                  <CustCard :custName='scope.row.custName' :customerID='scope.row.custId' />
                </template>
              </el-table-column>
              <el-table-column align="left" label="商标名称" width>
                <template slot-scope="scope">
                  <span>{{scope.row.tmName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="商标类别" width>
                <template slot-scope="scope">
                  <span>{{scope.row.goodClasses}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="申请人中文名称" width>
                <template slot-scope="scope">
                  <span>{{scope.row.appCnName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="商标号" width>
                <template slot-scope="scope">
                  <span>{{scope.row.regNumber}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="阶段" width>
                <template slot-scope="scope">
                  <span>{{scope.row.stageName}}</span>
                </template>
              </el-table-column>

            </el-table>
          </el-col>
        </el-row>
      </el-col>
      <el-col v-if="editor.editType === 'moreSelect' && columns[this.editor.editorXIndex].key === 'trademarkCaseCustContactArray'" :span="24" style="text-align: center" class="form-con-item">
        <el-select size="mini" value-key='custContactId' default-first-option multiple :automatic-dropdown="true" v-model="editContent" :filterable='true' style="width:60%"
          placeholder="请选择" clearable ref="">
          <el-option v-for="item in editor.options" :value="item" :key="item.custContactId" :label="item.custContacName">
          </el-option>
        </el-select>
      </el-col>
      <el-col v-if="editor.editType === 'moreSelect' && columns[this.editor.editorXIndex].key === 'caseCustRespUserArray'" :span="24" style="text-align: center" class="form-con-item">
        <el-select size="mini" value-key='userId' default-first-option multiple :automatic-dropdown="true" v-model="editContent" :filterable='true' style="width:60%"
          placeholder="请选择" clearable ref="">
          <el-option v-for="item in editor.options" :value="item" :key="item.userId" :label="item.fullname">
          </el-option>
        </el-select>
      </el-col>

      <span slot="footer" style="margin-top:15px" class="dialog-footer" v-if="editor.editType == 'tmCaseList'">
        <el-button @click="yeditedialogVisible = false" type="primary">确 定</el-button>
      </span>
      <span slot="footer" style="margin-top:15px" class="dialog-footer" v-else>
        <el-button @click="yeditedialogVisible = false" type="primary">取 消</el-button>
        <el-button v-if='editor.editType != "tmCaseList"' type="primary" @click="centerRdite">确 定</el-button>
      </span>
    </el-dialog>

<!--  申请人  -->
    <el-dialog
      :append-to-body="true"
      :modal="true"
      class="abow_dialog"
      :title="patentApplicationTitle"
      :visible.sync="patentApplication"
      width="80%"
      :before-close="(done)=>{this.appId = '';done()}"
    >
      <ApplicantDetail @checked="checkedAppItem" @clickBack="clickBack" v-if="newView"
                       :cust-id="showData[editor.editorYIndex].custId" :is-edit="false" :patent="true"/>
      <ApplicantDetail @checked="checkedAppItem" @clickBack="clickBack" v-if="editView" :firstApp="firstApp"
                       :app-id="appId" :is-edit="true" :patent="true"/>
      <applicant_list v-if="listView" @openNew="openNew" @checked="checkedAppItem"
                      :cust-name="showData[editor.editorYIndex].custName" :custId="showData[editor.editorYIndex].custId"
                      :patent="true"></applicant_list>

      <span slot="footer" class="dialog-footer fl-ac-jc">
<!--              <el-button size="mini" @click="checkedAppItem('')" type="primary">取 消</el-button>-->
        <!--        <el-button size="mini" type="primary" @click="addApplication">确 定</el-button>-->
            </span>
    </el-dialog>

    <!--        发明人-->
    <el-dialog
      append-to-body
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
                      <el-option v-for="(item,key)  in nameList" :key="key" :label="item.inventorCtitle"
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
              <el-row>
                <el-col :span="24">
                  <el-form-item label="证件上传:">
                    <el-upload
                      ref="upload"
                      class="upload-demo"
                      name="attachFile"
                      :data="uploadFileData"
                      :action="creatematerial"
                      :file-list="inventorMaterialFileList"
                      :limit="1"
                      :before-upload="beforeInventorMaterialUpload"
                      :on-remove="onInventorMaterialRemove"
                      :on-success="onInventorMaterialSuccess"
                      :on-exceed="onInventorMaterialExceed"
                      :on-preview="onInventorMaterialPreview"
                    >
                    <el-button type="primary" size="mini">上传</el-button>
                  </el-upload>
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

    <!--        优先权-->
    <el-dialog
      append-to-body
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
  </div>
</template>

<script>
import {
  queryCustomerNameId,
  queryBankaccountListBycustId,
  queryFixedCompanies
} from "@/api/caseList.js";
import { DatePicker, Select, Option } from "element-ui";
import Goods from "@/views/workbench/case/components/Goods.vue";
import JoinList from "@/views/workbench/case/components/JoinList.vue";
import { creatematerial } from '@/api/ipServiceApi.config.js'
import CaseInvestigators from "@/views/workbench/case/components/CaseInvestigators.vue";
import {
  queryCaseInfoUrl,
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
  queryInventorList,
  queryOtherCustomerListUrl,
  queryCustUserList
} from "@/api/caseDetail";
import { queryCurrencyUrl, deleteMaterial } from "@/api/customerList";
import { billDiscount, getCaseList, getAbroadBill } from "@/api/billApi";
  import ApplicantDetail from "../../../views/workbench/customer_management/applicant/components/ApplicantDetail";
  import Applicant_list from "../../../views/workbench/customer_management/applicant/applicant_list";
  import { queryAddrByAppIds, queryCPCAddr } from '@/api/applicant'
  import OverseasQuotation from "../../../views/workbench/case/components/OverseasQuotation";
  import { queryAgentPerson } from '../../../api/caseDetail'
export default {
  props: {
    plType: {
      type: String,
      default: "案件管理1"
    },
    columnsWidth: {
      type: Array,
      default: () => []
    },
    fixedCount: [String, Number],
    rowHeight: {
      type: [String, Number],
      default: 28
    },
    store: {
      required: true
    },
    autofillState: {
      default: true
    }
  },
  components: {
    OverseasQuotation,
    Applicant_list,
    ApplicantDetail,
    "el-date-picker": DatePicker,
    "el-select": Select,
    "el-option": Option,
    Goods,
    JoinList,
    CaseInvestigators
  },
  data() {
    return {
      creatematerial,
      uploadFileData: {
        tokenID: this.$store.getters.token,
        objType: 301703
      },
      inventorMaterialFileList: [],
      invoiceTitleList: [],
      currencyList: [],
      goodsVersionList: [],
      caseData: [],
      patentPriorityClaim: false,
      patentPriorityClaimTitle: '',
      patentPriorityClaimItem: {},
      patentCountryList: [],
      nameList: [],
      patentInventorTitle: '',
      patentInventorIndex: -1,
      inventorOriginalMaterialId: '',
      inventorMaterialDeleteList: [],
      patentInventorItem: {},
      patentInventor: false,
      patentApplicationTitle: '',
      patentApplicationItem: {},
      patentApplication: false,
      newView: false,
      listView: false,
      editView: false,
      firstApp: '',
      code: '',
      appId: '',
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now()
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
      editContent: "",
      yeditedialogVisible: false
    };
  },
  computed: {
    hasApplicationType(){
      return this.editContent&&this.editContent.find(item => item.applicationType == '1752')
    },
    typeName(){
      return this.showData[this.editor.editorYIndex].typeName
    },
    cellEditorStyle() {
      let left;
      if (this.editor.editorIsFixed) {
        left =
          this.store.states.tableBodyLeft +
          this.columnsWidth
            .filter((item, index) => index < this.editor.editorXIndex)
            .reduce((sum, item) => sum + item, 0);
      } else {
        left = this.columnsWidth
          .filter((item, index) => index < this.editor.editorXIndex)
          .reduce((sum, item) => sum + item, 0);
      }
      return {
        top: `${this.editor.editorYIndex * this.rowHeight}px`,
        left: `${left}px`,
        width: `${this.columnsWidth[this.editor.editorXIndex]}px`,
        height: `${this.rowHeight}px`,
        "z-index": this.editor.editorIsFixed ? 4 : 1
      };
    },
    autofillHandlerStyle() {
      let left;
      if (
        this.editor.editorIsFixed &&
        this.selector.selectedYArr[0] === this.selector.selectedYArr[1]
      ) {
        left =
          this.store.states.tableBodyLeft +
          this.columnsWidth
            .filter((item, index) => index < this.autofill.autofillXIndex)
            .reduce((sum, item) => sum + item, 0);
      } else {
        left = this.columnsWidth
          .filter((item, index) => index < this.autofill.autofillXIndex)
          .reduce((sum, item) => sum + item, 0);
      }
      left = left + this.columnsWidth[this.autofill.autofillXIndex] - 5;
      return {
        top: `${(this.autofill.autofillYIndex + 1) * this.rowHeight - 4}px`,
        left: `${left}px`,
        "z-index": this.fixedCount > this.autofill.autofillXIndex ? 4 : 1
      };
    },
    selectedStyle() {
      // console.log(this.rowHeight);
      console.log({
        top: `${this.selector.selectedYArr[0] * this.rowHeight}px`,
        left: `${this.columnsWidth
          .filter((item, index) => index < this.selector.selectedXArr[0])
          .reduce((sum, item) => sum + item, 0)}px`,
        width: `${this.columnsWidth
          .filter(
            (item, index) =>
              index <= this.selector.selectedXArr[1] &&
              index >= this.selector.selectedXArr[0]
          )
          .reduce((sum, item) => sum + item, 0)}px`,
        height: `${(this.selector.selectedYArr[1] -
          this.selector.selectedYArr[0] +
          1) *
        this.rowHeight}px`
      })
      return {

        top: `${this.selector.selectedYArr[0] * this.rowHeight}px`,
        left: `${this.columnsWidth
          .filter((item, index) => index < this.selector.selectedXArr[0])
          .reduce((sum, item) => sum + item, 0)}px`,
        width: `${this.columnsWidth
          .filter(
            (item, index) =>
              index <= this.selector.selectedXArr[1] &&
              index >= this.selector.selectedXArr[0]
          )
          .reduce((sum, item) => sum + item, 0)}px`,
        height: `${(this.selector.selectedYArr[1] -
          this.selector.selectedYArr[0] +
          1) *
          this.rowHeight}px`
      };
    },
    fixedSelectedStyle() {
      return {
        top: `${this.selector.selectedYArr[0] * this.rowHeight}px`,
        left: `${this.store.states.tableBodyLeft +
          this.columnsWidth
            .filter((item, index) => index < this.selector.selectedXArr[0])
            .reduce((sum, item) => sum + item, 0)}px`,
        width: `${this.columnsWidth
          .filter(
            (item, index) =>
              index <= this.selector.selectedXArr[1] &&
              index >= this.selector.selectedXArr[0] &&
              this.columns[index].fixed
          )
          .reduce((sum, item) => sum + item, 0)}px`,
        height: `${(this.selector.selectedYArr[1] -
          this.selector.selectedYArr[0] +
          1) *
          this.rowHeight}px`
      };
    },
    autofillStyle() {
      return {
        top: `${this.autofill.autofillYArr[0] * this.rowHeight}px`,
        left: `${this.columnsWidth
          .filter((item, index) => index < this.selector.selectedXArr[0])
          .reduce((sum, item) => sum + item, 0)}px`,
        width: `${this.columnsWidth
          .filter(
            (item, index) =>
              index <= this.selector.selectedXArr[1] &&
              index >= this.selector.selectedXArr[0]
          )
          .reduce((sum, item) => sum + item, 0)}px`,
        height: `${
          this.autofill.autofillYArr.length > 0
            ? (this.autofill.autofillYArr[1] -
                this.autofill.autofillYArr[0] +
                1) *
              this.rowHeight
            : 0
        }px`
      };
    },
    fixedAutofillStyle() {
      return {
        top: `${this.autofill.autofillYArr[0] * this.rowHeight}px`,
        left: `${this.store.states.tableBodyLeft +
          this.columnsWidth
            .filter((item, index) => index < this.selector.selectedXArr[0])
            .reduce((sum, item) => sum + item, 0)}px`,
        width: `${this.columnsWidth
          .filter(
            (item, index) =>
              index <= this.selector.selectedXArr[1] &&
              index >= this.selector.selectedXArr[0] &&
              this.columns[index].fixed
          )
          .reduce((sum, item) => sum + item, 0)}px`,
        height: `${
          this.autofill.autofillYArr.length > 0
            ? (this.autofill.autofillYArr[1] -
                this.autofill.autofillYArr[0] +
                1) *
              this.rowHeight
            : 0
        }px`
      };
    },
    columns() {
      return this.store.states.columns;
    },
    editor() {
      return this.store.states.editor;
    },
    selector() {
      return this.store.states.selector;
    },
    autofill() {
      return this.store.states.autofill;
    },
    showData() {
      return this.store.states.showData;
    }
  },
  watch: {
    'editContent.patentCaseApplicationList': {
        handler(n) {
          if (n && n.length) {
            n.forEach(j => {
              if (j.appAddrArray && j.appAddrArray.length === 1) {
                j.addrId = j.appAddrArray[0].addrId
                j.addressEn = j.appAddrArray[0].addressEn
              }
            })

          }
        },
        immediate: true,
        deep: true
      },
    editContent: function(val) {

    },
    yeditedialogVisible:function(val){
        this.editor.editing=val;
    },
    "editor.editing": {
      handler(val) {
        if (!val) {
         if (this.columns[this.editor.editorXIndex].type === "number") {
            this.limitNumber(this.editContent, true);
          }
          this.store.getEditorContent(this.editContent);

          // this.store.getEditorContent(this.editContent);
          // console.log(this.editContent, "刷新");
          // if (
          //   this.editor.editType == "goods" ||
          //   this.editor.editType == "joinApps" ||
          //   this.editor.editType == "trademarkCaseBasicinfos" ||
          //   this.editor.editType == "trademarkCaseCustContactArray"||
          //   this.editor.editType == "moreSelect"
          // ) {
          //   this.editContent = [];
          // } else {
          //   this.editContent = "";
          // }
        }
      },
      deep:true
    }
  },
  created () {
    this.querycustSelectClass()
  },
  methods: {
    addQuotationData() {
      this.showData[this.editor.editorYIndex].agencyOffers.push({
        tmCaseId: this.showData[this.editor.editorYIndex].tmCaseId,
        caseId: this.showData[this.editor.editorYIndex].caseId,
        materialArray: [],
        abroadCurId: '',
        discount: '',
        serviceCost: '',
        officialCost: '',
        otherCost: '',
        sumCost: '',
        description: '',
        materialIds: [],
      })
    },
    delQuotationData(items){
      this.showData[this.editor.editorYIndex].agencyOffers = this.showData[this.editor.editorYIndex].agencyOffers.filter(
        data => !items.includes(data)
      );
    },
    querycustSelectClass() {
      const classIdString = [1174].join(',')
      querycustSelectClass({classId: classIdString}).then(res => {
        this.goodsVersionList = res.data['1174']
      });
    },
    getCaseList(value, type) {
      if (!value) return
      if (type == 'billNo') {
        if (!this.showData[this.editor.editorYIndex].regCountry) return;
      } else {
        if (!this.showData[this.editor.editorYIndex].billNo) return;
      }
        getCaseList({billNo: this.showData[this.editor.editorYIndex].billNo, appState: this.showData[this.editor.editorYIndex].regCountry}).then(res => {
          this.caseData = res.data || []
          if (!this.caseData.length) {
            this.$message.error('请检查注册国家/账单号是否正确！')
            this.showData[this.editor.editorYIndex].regCountry = ''
          } else {
            this.getAbroadBill()
          }
        }).catch(err => {
          this.$message.error('查询失败！')
        })
    },
    getAbroadBill() {
      getAbroadBill({caseIds: this.caseData.map(item => item.caseId), billNo: this.showData[this.editor.editorYIndex].billNo}).then(res => {
        if(res.messageType == 100){
          this.$message.error(res.message)
        }
        this.$set(this.showData[this.editor.editorYIndex], 'billId', res.data.billId)
        delete this.showData[this.editor.editorYIndex].bill
      }).catch(err => {
        this.$message.error('查询失败！')
      })
    },
    //优先权操作
      handlePatentPriorityClaim(flag, data, index) {
        flag == 'add' ? this.patentPriorityClaimTitle = '添加要求优先权' : this.patentPriorityClaimTitle = '修改要求优先权'
        data ? this.patentPriorityClaimItem = data : ''
        if (flag == 'del') {
          this.editContent.splice(index, 1)
        } else {
          this.patentPriorityClaim = true
        }
      },
      //添加要求优先权
      addPatentPriorityClaim(f) {
        if (f == '添加要求优先权') {
          this.editContent.push(this.patentPriorityClaimItem)
        }
        this.closePatentPriorityClaim()
      },
      //关闭 添加要求优先权弹框
      closePatentPriorityClaim() {
        this.patentPriorityClaim = false
        this.patentPriorityClaimItem = {}
      },
    //添加发明人
    addPatentInventor(f) {
      this.patentInventorItem.inventorCountryStr = this.patentCountryList.find(i => i.cityCode == this.patentInventorItem.inventorCountry)
        && this.patentCountryList.find(i => i.cityCode == this.patentInventorItem.inventorCountry).label || ''
      if (f == '添加发明人') {
        this.$set(this.patentInventorItem, 'no', this.editContent.length + 1)
        this.patentInventorItem.inventorCountryStr = this.patentCountryList.find(i => i.cityCode == this.patentInventorItem.inventorCountry)
          && this.patentCountryList.find(i => i.cityCode == this.patentInventorItem.inventorCountry).label || ''
        this.editContent.push(this.patentInventorItem)
        this.changeNo(this.editContent.length, '', this.editContent.length - 1)
      } else if (this.patentInventorIndex > -1) {
        this.$set(this.editContent, this.patentInventorIndex, this.patentInventorItem)
      }
      this.deleteInventorMaterials(this.inventorMaterialDeleteList)
      this.closePatentInventor(true)
    },
    //关闭发明人弹框
    deleteInventorMaterials(materialIds) {
      Array.from(new Set(materialIds.filter(Boolean))).forEach(materialId => {
        deleteMaterial({ materialId })
      })
    },
    clearUnsavedInventorMaterials() {
      const materialIds = this.inventorMaterialDeleteList.filter(materialId => materialId != this.inventorOriginalMaterialId)
      if (this.patentInventorItem.materialId && this.patentInventorItem.materialId != this.inventorOriginalMaterialId) {
        materialIds.push(this.patentInventorItem.materialId)
      }
      this.deleteInventorMaterials(materialIds)
    },
    closePatentInventor(isSave) {
      if (isSave !== true) {
        this.clearUnsavedInventorMaterials()
      }
      this.patentInventor = false
      this.patentInventorIndex = -1
      this.inventorOriginalMaterialId = ''
      this.inventorMaterialDeleteList = []
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
        f == 'inventorEtitle' ? this.patentInventorItem.inventorCtitle = obj.inventorCtitle
          : this.patentInventorItem.inventorEtitle = obj.inventorEtitle
        this.patentInventorItem.invAddressCn = obj.invAddressCn
        this.patentInventorItem.invAddressEn = obj.invAddressEn
        this.patentInventorItem.inventorCountry = obj.inventorCountry
        this.patentInventorItem.inventorIdno = obj.inventorIdno
        this.patentInventorItem.materialId = obj.materialId
        this.patentInventorItem.address = obj.address
        this.patentInventorItem.materialName = obj.materialName
        this.inventorMaterialFileList = this.getInventorMaterialFileList(this.patentInventorItem)
      }
    },
    queryInventorList() {
      if (this.showData[this.editor.editorYIndex].patentCaseApplicationList && this.showData[this.editor.editorYIndex].patentCaseApplicationList.length == 0) return
      let appIdList = this.showData[this.editor.editorYIndex].patentCaseApplicationList.map(i => i.appId).filter(Boolean)
      appIdList.length && queryInventorList({ appIdList }).then(res => {
        this.nameList = res.data
      })
    },
    //发明人操作
    handlePatentInventor(flag, data, index) {
      // notOpenSign
      flag == 'add' ? this.patentInventorTitle = '添加发明人' : this.patentInventorTitle = '修改发明人'
      if(!this.editContent){
        // this.editContent = []
        this.$set(this, 'editContent', [])
      }
      if (flag == 'del') {
        this.editContent.splice(index, 1)
      } else {
        this.patentInventorIndex = flag == 'edit' ? index : -1
        this.patentInventorItem = data ? JSON.parse(JSON.stringify(data)) : {}
        this.inventorOriginalMaterialId = this.patentInventorItem.materialId || ''
        this.inventorMaterialDeleteList = []
        this.patentInventorItem.notOpenSign = this.patentInventorItem.notOpenSign || '0'
        this.patentInventor = true
        this.inventorMaterialFileList = this.getInventorMaterialFileList(this.patentInventorItem)
        this.queryInventorList()
      }
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
    onInventorMaterialRemove(file) {
      const materialId = file.materialId || (file.response && file.response.data && file.response.data[0] && file.response.data[0].materialId)
      this.$set(this.patentInventorItem, 'materialId', '')
      this.$set(this.patentInventorItem, 'address', '')
      this.$set(this.patentInventorItem, 'materialName', '')
      this.inventorMaterialFileList = []
      if (materialId) {
        this.inventorMaterialDeleteList.push(materialId)
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
    queryAddrByAppIds(appList) {
      let appIds = appList.map(i => i.appId).filter(Boolean).join(',')
      appIds && appIds.length && queryAddrByAppIds({ appIds }).then(res => {
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
    changeNo(v, type, index) {
      if (type === 'apply') {
        if (v && this.editContent.some((i, ind) => i.no == v && ind != index)) {
          this.editContent[index].no = ''
          this.$message.error('该序号已存在')
          return
        }
      } else {
        if (v && this.editContent.some((i, ind) => i.no == v && ind != index)) {
          this.editContent[index].no = ''
          this.$message.error('该序号已存在')
          return
        }
      }
    },
    changeCnAddess(v, row, list) {
      if (v) {
        row.addressEn = list.find(i => i.addrId == v).addressEn
      }
    },
    checkedAppItem(params) {
      if (params) {
        // params.data.isFirstAppliantStr == '是' ? params.data.isFirstAppliant = 1 : params.data.isFirstAppliant = 0
        if(!this.editContent){
          // this.editContent = []
          this.$set(this, 'editContent', [])
        }
        let index = this.editContent.findIndex(item => item.appId == params.data.appId)
        let list = this.editContent.find(item => item.appId == params.data.appId)
        if (index != -1) {
          let no = list.no
          this.editContent.splice(index, 1, params.data)
          this.$set(this.editContent[index], 'no', no)
        } else {
          this.editContent.push(params.data)
          let no = this.editContent.length
          this.$set(this.editContent[no - 1], 'no', no)
          this.changeNo(no, 'apply', no - 1)
        }
      }
      this.appId = ''
      this.patentApplication = false
    },
    handlePatentApplication(flag, data, index) {
      flag == 'add' ? this.patentApplicationTitle = '添加申请人' : this.patentApplicationTitle = '修改申请人'
      data ? this.patentApplicationItem = data : ''
      if (flag == 'del') {
        this.editContent.splice(index, 1)
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
    centerRdite() {
      const agencyOffers = JSON.parse(JSON.stringify(this.showData[this.editor.editorYIndex].agencyOffers || []))
      this.store.resetEditor();
      this.store.getEditorContent(this.editContent);
      this.yeditedialogVisible = false;
      this.showData[this.editor.editorYIndex].agencyOffers = JSON.parse(JSON.stringify(agencyOffers))

      // console.log(this.showData[this.editor.editorYIndex], "data");
      // this.showData[this.editor.editorYIndex].ifShareTm = "1";
    },
    addMDL() {
      this.editContent.push({
        regNumber: "",
        regDate: ""
      });
    },
    delrow(items) {
      this.editContent = this.editContent.filter(data => !items.includes(data));
      // this.store.getEditorContent(this.editContent);
    },
    delMDL(item, index) {

      this.editor.editing = true;
      this.editContent.splice(index, 1);
      this.editor.editing = true;
    },
    getGoods(goods) {

      this.editContent = [...this.editContent, ...goods];

      const res = new Map();
      this.editContent = this.editContent.filter(
        item => !res.has(item.goodName + item.goodEnName + item.goodJpName + (item.version || '')) && res.set(item.goodName + item.goodEnName + item.goodJpName + (item.version || ''), 1)
      );
      // this.store.getEditorContent(this.editContent);
    },
       workGroup (work,type) {
         if(type=='cust'){
 this.editContent.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers =
        work.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers;
         }else{
  this.editContent.trademarkCaseCBWorkgroups =
        work.trademarkCaseCBWorkgroups;
         }
    },
    getjoin(join) {
      this.editContent.push(join);
    },

    selectChange(val) {

    },
    // 限制输入数字
    limitNumber(val, format) {
      let nVal;
      try {
        nVal = val.replace(/[^\d.-]/g, "");
      } catch (err) {
        return;
      }
      if (/^0\d+/.test(nVal)) {
        nVal = nVal.replace(/0/, "");
      }
      if (format && isNaN(nVal)) {
        nVal = "";
      }
      this.editContent = nVal;
    },
    setEditing() {
      this.$parent.$parent.setEditing();
      this.ysetEdting();
    },
    ysetEdting() {
      if (
        this.editor.editType == "goods" ||
        this.editor.editType == "joinApps" ||
        this.editor.editType == "trademarkCaseBasicinfos" ||
        this.editor.editType == "tmCaseList" ||
        this.editor.editType == "moreSelect"||
        this.editor.editType == "trademarkCaseCustWorkgroups"||
        this.editor.editType == "trademarkCaseCBWorkgroups" ||
        this.editor.editType == 'patentCaseApplicationList' ||
        this.editor.editType == 'patentInventorList' ||
        this.editor.editType == 'patentPriorityClaimList' ||
        this.editor.editType == 'agencyOffers'
      ) {
        this.editor.editing = true;
        this.yeditedialogVisible = true;
      }
      if (this.editor.editType == "searchSelect") {
        this.editor.options = [];
      }
      switch (this.columns[this.editor.editorXIndex].key) {
        case "agencyOffers":
          !this.currencyList.length && queryCurrencyUrl().then(res => {
            this.currencyList = res.data
          })
          break
        case "goods":
          this.editContent = this.showData[this.editor.editorYIndex].goods
          break
        case "patentInventorList":
          !this.patentCountryList.length && queryCPCAddr().then(res => {
            this.patentCountryList = res.data
          })
          break;
        case "patentPriorityClaimList":
          !this.patentCountryList.length && queryCPCAddr().then(res => {
            this.patentCountryList = res.data
          })
          break;
        case "patentCaseApplicationList":
        this.editContent && this.editContent.length && this.queryAddrByAppIds(this.editContent)
          break;
        case "custConId":
          this.editContent = {};
          this.editor.options = [];
          queryCustomerContactByCustIdUrl({
            caseTypeId: this.showData[this.editor.editorYIndex].caseTypeId,
            custId: this.showData[this.editor.editorYIndex].custId
          }).then(response => {
            // this.selectData.country = response.data;
            this.editor.options =
              response.data.customerContacts &&
              response.data.customerContacts.length > 0
                ? response.data.customerContacts.map(ite => {
                    ite.value = ite.custContactId;
                    ite.label = ite.name;
                    return ite;
                  })
                : [];
            // this.selectData.billContacts = response.data.BillContacts;
          });
          break;
        case "account":
          this.editContent = {};
          this.editor.options = [];
          queryBankaccountListBycustId({
            custId: this.showData[this.editor.editorYIndex].abroadAgencyCustId
          }).then(response => {
            this.editor.options =
              response.data &&
              response.data.length > 0
                ? response.data.map(ite => {
                    ite.value = ite.account;
                    ite.label = ite.account;
                    return ite;
                  })
                : [];
          });
          break;
        case "custContactId":
          this.editContent = {};
          this.editor.options = [];
          queryCustomerContactByCustIdUrl({
            caseTypeId: this.showData[this.editor.editorYIndex].caseTypeId,
            custId: this.showData[this.editor.editorYIndex].custId
          }).then(response => {
            // this.selectData.country = response.data;
            this.editor.options =
              response.data.customerContacts &&
              response.data.customerContacts.length > 0
                ? response.data.customerContacts.map(ite => {
                    ite.value = ite.custContactId;
                    ite.label = ite.name;
                    return ite;
                  })
                : [];

            // this.selectData.billContacts = response.data.BillContacts;
          });
          break;
        case "billCustContactId":
          this.editor.options = [];
          this.editContent = {};
          queryCustomerContactByCustIdUrl({
            caseTypeId: this.showData[this.editor.editorYIndex].caseTypeId,
            custId: this.showData[this.editor.editorYIndex].custId
          }).then(response => {
            // this.selectData.country = response.data;
            this.editor.options =
              response.data.customerContacts &&
              response.data.customerContacts.length > 0
                ? response.data.customerContacts.map(ite => {
                    ite.value = ite.custContactId;
                    ite.label = ite.name;
                    return ite;
                  })
                : [];

            // this.selectData.billContacts = response.data.BillContacts;
          });
          break;
        case "trademarkCaseCustContactArray":
          this.editor.options = [];
          queryCustomerContactByCustIdUrl({
            caseTypeId: this.showData[this.editor.editorYIndex].caseTypeId,
            custId: this.showData[this.editor.editorYIndex].custId
          }).then(response => {
            // this.selectData.country = response.data;
            this.editor.options =
              response.data.customerContacts &&
              response.data.customerContacts.length > 0
                ? response.data.customerContacts.map(ite => {
                    ite.custContactId = ite.custContactId;
                    ite.custContacName = ite.name;
                    return ite;
                  })
                : [];

            // this.selectData.billContacts = response.data.BillContacts;
          });
          break;
        case "caseCustRespUserArray":
          const data = this.showData[this.editor.editorYIndex]
          this.editor.options = [];
          queryCustUserList({
            caseTypeId: data.caseTypeId,
            custId: data.custId,
            appFromto: data.appFromto,
          }).then(response => {
            this.editor.options = response.data.map((item)=>({
              userId:item.userId,
              fullname:item.fullname
            }))
          });
          break;
        case "appCnAddr":
          this.editor.options = [];

          queryAppAddrByAppIdUrl({
            appId: this.showData[this.editor.editorYIndex].appId
          }).then(response => {
            // this.selectData.country = response.data;
            this.editor.options =
              response.data && response.data.length > 0
                ? response.data.map(ite => {
                    ite.value = ite.addressCn;
                    ite.label = ite.addressCn;
                    return ite;
                  })
                : [];

            // this.selectData.billContacts = response.data.BillContacts;
          });
          break;
        case "appEnAddr":
          this.editor.options = [];
          queryAppAddrByAppIdUrl({
            appId: this.showData[this.editor.editorYIndex].appId
          }).then(response => {
            // this.selectData.country = response.data;
            this.editor.options =
              response.data && response.data.length > 0
                ? response.data.map(ite => {
                    ite.value = ite.addressEn;
                    ite.label = ite.addressEn;
                    return ite;
                  })
                : [];

            // this.selectData.billContacts = response.data.BillContacts;
          });
          break;
        case "appContactPerson":
          this.editor.options = [];
          if (this.showData[this.editor.editorYIndex].appId) {
            queryAppContactUrl({
              appId: this.showData[this.editor.editorYIndex].appId
            }).then(response => {
              // this.selectData.country = response.data;
              this.editor.options =
                response.data && response.data.length > 0
                  ? response.data.map(ite => {
                      ite.value = ite.nameCn;
                      ite.label = ite.nameCn;
                      return ite;
                    })
                  : [];

              // this.selectData.billContacts = response.data.BillContacts;
            });
          }

          break;
        case "agencyCustId":
          this.editor.options = [];
          queryOtherCustomerListUrl({
            isCollaboration: "1",
            collaborationStatusArray:[2249,2250]
          }).then(response => {
            // this.selectData.country = response.data;
            this.editor.options =
              response.data && response.data.length > 0
                ? response.data.map(ite => {
                    ite.value = ite.custId;
                    ite.label = ite.fullname;
                    return ite;
                  })
                : [];

            // this.selectData.billContacts = response.data.BillContacts;
          });
          break;
        case "letterAddrId":
          this.editor.options = [];
          this.editContent = {};
          var id = this.showData[this.editor.editorYIndex].custContactId;
          if (Object.prototype.toString.call(id) === "[object Object]") {
            id = this.showData[this.editor.editorYIndex].custContactId
              .custContactId;
          }
          queryCustomerContactByCustContactIdUrl({
            custContactId: id
          }).then(response => {
            // this.selectData.country = response.data;
            this.editor.options =
              response.data.customerMailAdds &&
              response.data.customerMailAdds.length > 0
                ? response.data.customerMailAdds.map(ite => {
                    ite.value = ite.addrId;
                    ite.label = ite.addressCn + ite.addressEn;
                    return ite;
                  })
                : [];

            // this.selectData.billContacts = response.data.BillContacts;
          });
          break;
        case "billAddrId":
          this.editor.options = [];
          this.editContent = {};
          var id = this.showData[this.editor.editorYIndex].custContactId;
          if (Object.prototype.toString.call(id) === "[object Object]") {
            id = this.showData[this.editor.editorYIndex].custContactId
              .custContactId;
          }
          queryCustomerContactByCustContactIdUrl({
            custContactId: id
          }).then(response => {
            // this.selectData.country = response.data;
            this.editor.options =
              response.data.BillAdds && response.data.BillAdds.length > 0
                ? response.data.BillAdds.map(ite => {
                    ite.value = ite.addrId;
                    ite.label = ite.addressCn + ite.addressEn;
                    return ite;
                  })
                : [];

            // this.selectData.billContacts = response.data.BillContacts;
          });
          break;
        case "agencyCustContactId":
          this.editor.options = [];
          this.editContent = {};
          queryCustomerUrl({
            customerID: this.showData[this.editor.editorYIndex].custId
          }).then(response => {
            // this.selectData.country = response.data;
            this.editor.options =
              response.data.customerContacts &&
              response.data.customerContacts.length > 0
                ? response.data.customerContacts.map(ite => {
                    ite.value = ite.custContactId;
                    ite.label = ite.name;
                    return ite;
                  })
                : [];

            // this.selectData.billContacts = response.data.BillContacts;
          });
          break;
        case "agencyCustAddrId":
          this.editor.options = [];
          this.editContent = {};
          this.showData[this.editor.editorYIndex].agencyCustId&&queryCustomerUrl({
            customerID: this.showData[this.editor.editorYIndex].agencyCustId
          }).then(response => {
            // this.selectData.country = response.data;
            this.editor.options =
              response.data.customerAddrs &&
              response.data.customerAddrs.length > 0
                ? response.data.customerAddrs.map(ite => {
                    ite.value = ite.addrId;
                    ite.label = ite.addressEn;
                    return ite;
                  })
                : [];

            // this.selectData.billContacts = response.data.BillContacts;
          });
          break;
        case 'purchaseOrPayExcRate':
          this.editor.options = [
            {
              value: '购汇',
              label: '购汇'
            },
            {
              value: '付汇',
              label: '付汇'
            },
            {
              value: '抵扣账单',
              label: '抵扣账单'
            },
          ]
          break;
        case 'payCurId':
          // this.editor.options = [];
          // // this.editContent = {};
          // queryCurrencyUrl().then(response => {
          //   this.editor.options =
          //     response.data && response.data.length > 0
          //       ? response.data.map(ite => {
          //           ite.value = ite.curId ? ite.curId : ite.curId + ''; // 币种为人民币的id为0无法正常显示，这里转为字符串
          //           ite.label = ite.curName;
          //           return ite;
          //         })
          //       : [];
          // })
          break;
        case 'abroadCurId':
          // queryCurrencyUrl().then(response => {
          //   this.editor.options =
          //     response.data && response.data.length > 0
          //       ? response.data.map(ite => {
          //           ite.value = ite.curId ? ite.curId : ite.curId + ''; // 币种为人民币的id为0无法正常显示，这里转为字符串
          //           ite.label = ite.curName;
          //           return ite;
          //         })
          //       : [];
          // })
          break;
          case 'agentPerson':
            // this.showData[this.editor.editorYIndex].agencyCustId
            // 案件详情页面的代理人对案件类型也有要求，这里先不做限制（看后续需求），只对代理人列表的条件做出限制 let ch_caseTypr = this.$commonUtils.getMenuName(this.$store.state.caseInformation.caseTypeList,'childrens').find(item=>item.caseTypeId==this.showData[this.editor.editorYIndex].caseTypeId).caseType
            if (this.showData[this.editor.editorYIndex].replaceAgencyName && this.showData[this.editor.editorYIndex].replaceAgencyName !== '北京佰舟知识产权代理有限公司' && ['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(this.showData[this.editor.editorYIndex].whdAgencyName) && ['内-内', '外-内'].includes(this.showData[this.editor.editorYIndex].appFromto)) {
              queryAgentPerson({
                whdAgencyName: this.showData[this.editor.editorYIndex].whdAgencyName
              }).then(res => {
                this.editor.options = res.data.map(item => ({
                  label: item,
                  value: item
                }))
              })
            } else if (this.showData[this.editor.editorYIndex].replaceAgencyName == '北京佰舟知识产权代理有限公司') {
              this.editor.options = [{value: '王莹', label: '王莹'}, {value: '刘骞', label: '刘骞'}, {value: '刘敏', label: '刘敏'}]
            } else {
              //  所有员工列表
              this.editor.options = this.$store.getters.userList.map(item => ({
                value: item.fullname,
                label: item.fullName
              }))
            }
            break;
        case 'billNo':
          break
        case "gfReceiptRise":
          this.editContent = {};
          this.editor.options = [];
          // queryCustomerContactByCustIdUrl({
          //   caseTypeId: this.showData[this.editor.editorYIndex].caseTypeId,
          //   custId: this.showData[this.editor.editorYIndex].custId
          // })
          queryFixedCompanies({
            custId: this.showData[this.editor.editorYIndex].custId,
            appIdArray: this.showData[this.editor.editorYIndex].patentCaseApplicationList[0] && this.showData[this.editor.editorYIndex].patentCaseApplicationList.map(j => j.appId)
          }).then(response => {
            this.invoiceTitleList = response.data
            // this.selectData.country = response.data;
            this.editor.options =
              response.data && response.data.length > 0
                ? response.data.map(ite => {
                  ite.value = ite.fullname + '(' + ite.creditCode + ')';
                  ite.label = ite.fullname + '(' + ite.creditCode + ')';
                  return ite;
                })
                : [];
            // this.selectData.billContacts = response.data.BillContacts;
          });
          break;
        case 'regCountry':
          break
        default:
          break;
      }
    },
    remoteMethod(query) {
      if (query !== "") {
        switch (this.columns[this.editor.editorXIndex].key) {
          case "appCnName":
          case "transferorCnName":
            queryAppInfoUrl({
              custId: this.showData[this.editor.editorYIndex].custId,
              keyword: query,
              caseTypeId: this.showData[this.editor.editorYIndex].caseTypeId,
            }).then(response => {
              this.editor.options =
                response.data && response.data.length > 0
                  ? response.data.map(ite => {
                      ite.value = ite.applicantName;
                      ite.label = ite.applicantName;
                      return ite;
                    })
                  : [];

            });

            break;
            case 'custName':
              queryCustomerNameId({pageNo: 1, pageSize: 100, keyword: query}).then(res => {
                this.editor.options = res.data.map(item => {
                  item.value = item.name
                  item.label = item.name
                  return item
                })
              })
            break;
          case "respondentNameCn":
            queryConflicterListUrl({ fullname: query }).then(res => {
              this.editor.options =
                res.data && res.data.length > 0
                  ? res.data.map(ite => {
                      ite.value = ite.fullname;
                      ite.label = ite.fullname;
                      return ite;
                    })
                  : [];
            });
            break;

          default:
            break;
        }
      }
    },

    clipboardToContent(e) {
      this.$parent.$parent.clipboardToContent(e);
    },
    handleAutofill() {
      this.store.handleAutofill();
    },
    findFeeNames(list, feetId, obj){
      const nameList = []
      const langList = this.$wUtil.extractTree(list, 'feeTypes', ['feetId', 'feeName', 'parent'])
      const findName = (id) => {
        const item = langList.find(item => item.feetId === id)
        nameList.push(item.feeName)
        item.parent && findName(item.parent)
      }
      findName(feetId)
      obj.feeName1 = nameList[nameList.length - 1]
      obj.feeName2 = nameList[nameList.length - 2]
      obj.feeName3 = nameList[nameList.length - 3]
    },
    resetEditor(item) {
      switch (this.columns[this.editor.editorXIndex].key) {
        case "ifShareTm":
          if (item == 0 && this.plType == '案件管理1') {
            this.showData[this.editor.editorYIndex].joinApps = []
          }
          break
        case "respondentNameCn":
          this.showData[this.editor.editorYIndex].respondentNameEn =
            item.fullnameEn;
          this.showData[this.editor.editorYIndex].respondentAddrCn =
            item.address;
          this.showData[this.editor.editorYIndex].respondentAddrEn =
            item.addressEn;
          break;
        case "transferorCnName":
          this.showData[this.editor.editorYIndex].transferorEnName =
            item.applicantEnName;
          this.showData[this.editor.editorYIndex].transferorCnName =
            item.applicantName;
          this.showData[this.editor.editorYIndex].transferorType = item.appType;
          this.showData[this.editor.editorYIndex].transferorNationality =
            item.sendType;
          this.showData[this.editor.editorYIndex].transferorCnAdress =
            item.applicantAddress;
          this.showData[this.editor.editorYIndex].transferorEnAdress =
            item.applicantEnAddress;
          this.showData[this.editor.editorYIndex].transferorCountryAndregion =
            item.country;
          this.showData[this.editor.editorYIndex].zrCertCode = item.certCode;
          break;
        case "appCnName":
          if (item) {
            this.showData[this.editor.editorYIndex].appId = item.appId;
            this.showData[this.editor.editorYIndex].appEnName =
              item.applicantEnName;
            this.showData[this.editor.editorYIndex].appCnName =
              item.applicantName;
            this.showData[this.editor.editorYIndex].applicantType =
              item.appType;
            this.showData[this.editor.editorYIndex].appGJdq = item.sendType;
            this.showData[this.editor.editorYIndex].appCnAddr =
              item.applicantAddress;
            this.showData[this.editor.editorYIndex].appEnAddr =
              item.applicantEnAddress;
            this.showData[this.editor.editorYIndex].appCountryOrRegion =
              item.country;
            this.showData[this.editor.editorYIndex].certCode = item.certCode;
            this.showData[this.editor.editorYIndex].appCertificateNum =
              item.cardNumber;
            this.showData[this.editor.editorYIndex].appCertificate =
              item.cardName;
          }
          break;
          case "custConId":
            this.showData[this.editor.editorYIndex].custConName = item.label;
            break;
        case "custContactId":

          this.showData[this.editor.editorYIndex].custContactName = item.label;
          this.showData[this.editor.editorYIndex].letterAddrId = "";
          this.showData[this.editor.editorYIndex].billAddrId = "";
          break;
        case "agencyCustId":
          this.showData[this.editor.editorYIndex].agencyCustAddrId = "";
          this.showData[this.editor.editorYIndex].agencyCustContactId = "";
          break;
        case "materialTypeName":
          const txt = this.showData[this.editor.editorYIndex].paperofficial ? '纸件' : '电子'
          this.showData[this.editor.editorYIndex].docName = txt + item.replace(/^(纸件)|(电子)/, '');
          break;
        case "custId":
          billDiscount(this.showData[this.editor.editorYIndex]).then(res=>{
            this.showData[this.editor.editorYIndex].discount=res.data
          });
          break;
        case "custName":
          this.showData[this.editor.editorYIndex].custId = item.custId
          break
        case "submitType":
          break;
        case "appId":
          break;
        case 'ifSec':
          if(item === '1'){
            this.$confirm("请注意：【机密案件】只能办案人才能查看！确认设置为【机密案件】吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {

            }).catch(() => {
              this.showData[this.editor.editorYIndex].ifSec = '0'
            })
          }
          break;
        case "abroadCurId":
          this.columns[this.editor.editorXIndex].options = this.editor.options
          // abroadExchangeRate 境外账单汇率
          this.showData[this.editor.editorYIndex].abroadExchangeRate = this.editor.options.find(i => i.value == item).value2
          break;
        case "payCurId":
          this.columns[this.editor.editorXIndex].options = this.editor.options
          break;
        case "billNo":
          this.getCaseList(this.showData[this.editor.editorYIndex].billNo, 'billNo')
          break;
        case 'regCountry':
          this.showData[this.editor.editorYIndex].regCountry = item
          this.getCaseList(this.showData[this.editor.editorYIndex].regCountry, 'regCountry')
          break
        case 'foreignExchangeRate':
          // foreignExchangeRate 外汇牌价
          // payMoney 支付金额本币
          // abroadBillSum 境外账单总金额
          // 支付金额（本币）= 境外账单总金额 X 外汇牌价
          this.showData[this.editor.editorYIndex].payMoney = (this.showData[this.editor.editorYIndex].abroadBillSum * this.showData[this.editor.editorYIndex].foreignExchangeRate / 100).toFixed(2)
          break;
        case 'feetId':
          let obj = this.showData[this.editor.editorYIndex]
          const feeTypeList = JSON.parse(localStorage.getItem('feeTypeList'))
          this.findFeeNames(feeTypeList, item, obj)
          break;
        case 'appFromto':
          if (!['内-外', '外-外'].includes(item)) {
            // 改成对内，如果发现多个版本商品，默认保留最新的版本的商品
            if (this.showData[this.editor.editorYIndex].goods && this.showData[this.editor.editorYIndex].goods.length && [...new Set(this.showData[this.editor.editorYIndex].goods.map(item => item.version).filter(Boolean))].length > 1) {
              this.showData[this.editor.editorYIndex].appFromto = item
              this.showData[this.editor.editorYIndex].goods = this.showData[this.editor.editorYIndex].goods.filter(item => item.version === (this.showData[this.editor.editorYIndex].trademarkCaseCategoryModifyList && this.showData[this.editor.editorYIndex].trademarkCaseCategoryModifyList.length && this.showData[this.editor.editorYIndex].trademarkCaseCategoryModifyList[0].goodVersion || 2096))
            }
          } else {
            // 改成对外，如果发现商品没有version的，默认给最初版本，2096
            if (this.showData[this.editor.editorYIndex].goods && this.showData[this.editor.editorYIndex].goods.find(item => !item.version)) {
              let number = Math.max(...(this.showData[this.editor.editorYIndex].goods && this.showData[this.editor.editorYIndex].goods.filter(item => item.number).map(item => item.number) || []), 0)
              this.showData[this.editor.editorYIndex].goods.forEach((item, index) => {
                if (!item.version) {
                  item.version = 2096
                  item.number = ++number
                }
              })
            }
          }
          break
        case 'otherAgency':
          if (item && !Number(item)) {
            this.showData[this.editor.editorYIndex].replaceAgencyName = ''
          }
          break;
        case 'whdAgencyName':
          if (this.showData[this.editor.editorYIndex].replaceAgencyName && this.showData[this.editor.editorYIndex].replaceAgencyName !== '北京佰舟知识产权代理有限公司' && ['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(item) && ['内-内', '外-内'].includes(this.showData[this.editor.editorYIndex].appFromto)) {
            queryAgentPerson({
              whdAgencyName: item
            }).then(res => {
              this.editor.options = res.data.map(item => ({
                label: item,
                value: item
              }))
            })
          } else if (this.showData[this.editor.editorYIndex].replaceAgencyName == '北京佰舟知识产权代理有限公司') {
            this.editor.options = [{value: '王莹', label: '王莹'}, {value: '刘骞', label: '刘骞'}, {value: '刘敏', label: '刘敏'}]
          } else {
            //  所有员工列表
            this.editor.options = this.$store.getters.userList.map(item => ({
              value: item.fullname,
              label: item.fullName
            }))
          }
          break;
        case 'tmDesignDeclare':
          if (this.showData[this.editor.editorYIndex].tmDesignDeclare.length > 180) {
            this.showData[this.editor.editorYIndex].tmDesignDeclare = this.showData[this.editor.editorYIndex].tmDesignDeclare.substring(0, 180)
            this.$message.warning('商标说明字数在1-180之间')
          }
          break
        case 'gfReceiptRise':
          if (!item.label) {
            this.showData[this.editor.editorYIndex].gfReceiptRise = ''
            this.showData[this.editor.editorYIndex].gfReceiptRiseNumber = ''
            return
          }
          // const fullname = item.label.indexOf('(') !== -1 ? item.label.substring(0, item.label.indexOf('(')) : item.label
          // const it = this.invoiceTitleList.find(i => i.fullname === fullname)
          const parenIdx = item.label.lastIndexOf('(')
          const fullname = parenIdx !== -1 ? item.label.substring(0, parenIdx) : item.label
          const creditCode = parenIdx !== -1 ? item.label.substring(parenIdx + 1, item.label.lastIndexOf(')')) : ''
          const it = this.invoiceTitleList.find(i =>
            i.fullname === fullname && (creditCode ? i.creditCode === creditCode : true)
          )
          this.$set(this.showData[this.editor.editorYIndex], 'gfReceiptRise', fullname)
          this.$set(this.showData[this.editor.editorYIndex], 'gfReceiptRiseNumber', it ? it.creditCode : '')
        default:
          break;
      }

      this.store.resetEditor();
      // this.store.getEditorContent(this.editContent);
    }
  }
};
</script>

<style lang="scss" scoped>
// 编辑框
.km-cell-editor {
  position: absolute;
  top: 30px;
  left: 0;
  display: flex;
  width: 200px;
  border: 1px solid #57a3f3;
  z-index: 4;
  overflow: hidden;
  &.else {
    overflow: visible;
    border: none;
  }
  textarea {
    width: 100%;
    height: 50px;
    line-height: 20px;
    outline: 0;
    resize: none;
    padding: 4px 6px;
    white-space: pre;
    border: none;
  }
}

.km-autofill-handler {
  position: absolute;
  top: 56px;
  left: 196px;
  width: 8px;
  height: 8px;
  border: 1px solid #57a3f3;
  background-color: #fff;
  cursor: crosshair;
  z-index: 5;
}

.km-clipboard {
  width: 0 !important;
  height: 0 !important;
  flex: 0 0 !important;
  padding: 0 !important;
}

.km-cover-area {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  &.selected {
    background-color: rgba(74, 149, 235, 0.2);
  }
  &.autofill {
    background-color: rgba(127, 127, 127, 0.2);
  }
  &.fixed {
    z-index: 3;
  }
}
.patent{
  /deep/ .el-table__header tr,
  /deep/ .el-table__header th {
    padding: 0;
    height: 30px;
    background: #f5f5f5;
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
  .handle {
      span {
        color: #409EFF;
        cursor: pointer;
      }
    }
</style>
