<template>
  <div class="createPost-container" id="createPost-container">
    <div class="" style="display: flex;flex-wrap:nowrap;width: 100%">
      <div class="zdjbxn">
        <el-button v-if="!custFlag" @click="arrowClick" class="arrow" type="text"
                   icon="el-icon-d-arrow-right"></el-button>
        <el-button v-else @click="arrowClick" class="arrow" type="text" icon="el-icon-d-arrow-left"></el-button>
        <el-tabs v-model="activeName" style="width: 99%">
          <el-tab-pane label="账单基本信息" name="first">
            <transition name="show" mode="out-in">
              <el-form ref="postForm" :model="data" size="small" :rules="rules" class="form-container">
                <div>
                  <div class="form-con">
                    <el-row>
                      <el-col class="form-con-item" :span="24">
                        <el-row class="form-border">
                          <el-col :span="24">
                            <div class="sticky">
                              <el-row class="">
                                <el-col :span="12">
                                  <el-form-item label="案件文号:" class="postInfo-container-item">
                                    <span class="title-mx" style="cursor: pointer" @click="takeCaseDetail(data)">{{data.showRefno}}</span>
                                    <el-button style="margin-left: 10px" size="mini" type="primary" v-if="type!='view' && !createCommonBill"
                                               @click="changeCaseVisible=true">修改
                                    </el-button>
                                    <ChooseCase
                                      :dialogVisible="changeCaseVisible"
                                      :agentNums="data.caseArray.map(item=>item.agentNum).join('\n')"
                                      @closed="ChooseCaseClose"
                                      rules="custId"
                                      @getList="getList"></ChooseCase>
                                    <!--                              <a :href="`#/workbench/case/seeCaseDetail/${data.caseId}?taskType=${data.taskType}`" target="_blank" :title="data.showRefno"> </a>-->
                                  </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item label="案件类型:" class="postInfo-container-item">
                                    <template>
                                      <span>{{getCaseTypeIdString(caseTypeIdString)}}</span>
                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-row v-if="data.taskType == 4">
                                <el-col :span="12">
                                  <el-form-item label="账单类型:" class="postInfo-container-item">
                                    <el-cascader
                                      v-if="type!='view'"
                                      :show-all-levels="false"
                                      :options="typeTreeList"
                                      filterable
                                      clearable
                                      :props="billTypeProps"
                                      change-on-select
                                      selectChildren
                                      v-model="billTypeIds"
                                      style="left: 10px;"
                                      ></el-cascader>
                                    <span v-else>{{data.billStyleName}}</span>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item label="代理人:" class="postInfo-container-item">
                                    <el-select v-if="type!='view'"  :clearable="true" @change="changeAgentUser"
                                               default-first-option filterable v-model="data.agentUser"
                                    >
                                      <el-option v-for="(item,key) in $store.getters.userList" :key="key"
                                                 :label="item.fullname" :value="item.userId"></el-option>
                                    </el-select>
<!--                                    <el-input v-if="type!='view'" size="small" type="text"  v-model="data.agentUserName"/>-->
                                    <span v-else>{{data.agentUserName}}</span>
                                  </el-form-item>
                                </el-col>

                              </el-row>
                              <el-row>
                                <el-col :span="12">
                                  <el-form-item label="账单号:" class="postInfo-container-item">
                                    <template>
                                      <span>{{data.billNo}}</span>
                                    </template>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item label="所属工作组:" :prop="createCommonBill ? '' : 'wkgId'" class="postInfo-container-item">
                                    <el-select v-if="type!='view'" @change="checkWkgIsGj" :clearable="true"
                                               default-first-option filterable v-model="data.wkgId" placeholder>
                                      <el-option v-for="(item,key) in selectData.gzzs" :key="key"
                                                 :label="item.groupName" :value="item.wkgId"></el-option>
                                    </el-select>
                                    <span v-else>{{data.wkgIdString}}</span>
                                  </el-form-item>
                                </el-col>

                              </el-row>
                            </div>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="客户负责人:" class="postInfo-container-item">
                                  <span>{{data.caseCustRespUser}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="客户:" class="postInfo-container-item">
                                  <el-select
                                    :disabled="createCommonBill"
                                    v-if="type!='view'"
                                    v-model="data.custId"
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
                                  <span v-else>{{data.custFullNameString}}</span>
                                  <!--                              <template>-->
                                  <!--                                <span>{{data.custFullNameString}}</span>-->
                                  <!--                              </template>-->
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="客户文号:" class="postInfo-container-item">
                                  <el-input :disabled="createCommonBill" type="text" v-model="data.custRefno" v-if="type!='view'"></el-input>
                                  <span v-else>{{data.custRefno}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="案件描述:" :prop="createCommonBill ? '' : 'caseDesc'" class="postInfo-container-item">
                                  <div style="width: 100%;height: 70px;overflow: auto;font-size: 13px" id="caseDescShow" v-show="type!='view' && !caseDescShow" @click="caseDescClick" v-html="caseDescHtml"></div>
                                  <el-input ref="caseDescRef" @blur="caseDescBlur" :disabled="createCommonBill" v-show="type!='view' && caseDescShow" size="small" v-model="data.caseDesc" type="textarea"
                                            :rows="3" style="width:100%"
                                            placeholder="模板语句：案件名称+案件个数  案件名称最多显示三条，超出以“等”表示，每个案件名称之间用“；”号隔开"></el-input>
                                  <span v-if="type == 'view'" v-html="getSpecialInfo(caseDescHtml, data.caseDesc)"></span>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="客户其他账单信息:" class="postInfo-container-item">
                                  <el-input v-if="type!='view'" size="small" type="textarea" :rows="3"
                                            v-model="data.otherBillInfo" placeholder="请输入"></el-input>
                                  <span v-else>{{data.otherBillInfo}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="发生日期:" class="postInfo-container-item">
                                  <el-date-picker :default-value="timeDefaultShow" v-if="type!='view'"
                                                  v-model="fwDatevalue" type="daterange" value-format="yyyy-MM-dd"
                                                  range-separator="至" start-placeholder="开始日期"
                                                  end-placeholder="结束日期"></el-date-picker>
                                  <span v-else>{{data.startDate}}-{{data.endDate}}</span>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="账单状态:" class="postInfo-container-item" v-if="type=='view'">
                                  <span>{{data.wfStatus}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row v-if="data.taskNo==4">
                              <el-col :span="12">
                                <el-form-item label="账期:" class="postInfo-container-item">
                                  <el-date-picker :disabled="createCommonBill" v-if="type!='view'" v-model="data.accountPeriod" type="date"
                                                  value-format="yyyy-MM-dd"></el-date-picker>
                                  <span v-else>{{data.accountPeriod}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="结算币种:" :prop="createCommonBill ? '' : 'curId'" class="postInfo-container-item">
                                  <el-select v-if="type!='view'" default-first-option @change="bzchange"
                                             v-model="data.curId" placeholder>
                                    <el-option v-for="(item,key) in selectData.bzData" :key="key" :label="item.curName"
                                               :value="item.curId"></el-option>
                                  </el-select>
                                  <span v-else>{{data.curIdString}}</span>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="汇率:" class="postInfo-container-item">
                                  <el-input v-if="type!='view'" type="text" v-model="data.exchangeRate"></el-input>
                                  <span v-else> {{data.exchangeRate}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="账单联系人:" class="postInfo-container-item">
                                  <template>
                                    <el-select v-if="type!='view'" multiple filterable default-first-option
                                               v-model="data.custContactIdArray" placeholder clearable
                                               @change="changeCustContactIdArray">
                                      <el-option v-for="(item,key) in selectData.lxrData" :key="key"
                                                 :label="`${item.called?item.called+' ':''}${item.name}`"
                                                 :value="item.custContactId"></el-option>
                                    </el-select>
                                    <!--                                <el-autocomplete-->
                                    <!--                                  v-if="type!='view'"-->
                                    <!--                                  class="inline-input"-->
                                    <!--                                  v-model="data.billContact"-->
                                    <!--                                  :fetch-suggestions="querySearch"-->
                                    <!--                                  placeholder="请输入内容"-->
                                    <!--                                  @select="handleSelect"-->
                                    <!--                                ></el-autocomplete>-->
                                    <span v-else>{{data.custContactIdStr}}</span>
                                    <!--                                <span style="vertical-align: text-top;" class="itemTitle_style" v-if="type!='view'"  @click="dialogVisibleTt=true">编辑联系人/抬头</span>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="账单抬头:" class="postInfo-container-item">
                                  <el-autocomplete
                                    v-if="type!='view'"
                                    class="inline-input"
                                    v-model="data.title"
                                    :fetch-suggestions="(queryString,cb)=>querySearch(queryString,cb,'titleData')"
                                    placeholder="请输入内容"
                                    @select="handleTitleSelect"
                                  ></el-autocomplete>
                                  <!--                              <el-select v-if="type!='view'"  default-first-option v-model="data.addrId" placeholder>-->
                                  <!--                                <el-option v-for="(item,key) in selectData.dzData.filter(itm=>!!itm.addressCn)" :key="key" :label="item.title" :value="item.addrId"></el-option>-->
                                  <!--                              </el-select>-->
                                  <span v-else>{{data.title}}</span>
                                </el-form-item>
                              </el-col>

                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="账单折扣:" class="postInfo-container-item">
                                  <!--  <el-input size="small" size="medium" v-model="data.discount" :min="1" :max="100" ></el-input> -->
                                  <el-input v-if="type!='view'" size="small" type="number" @input="intValidator" min="1"
                                            max="100" v-model.number="data.discount" @change="discountChange"
                                            placeholder="请输入两位整数"/>
                                  <span v-else>{{data.discount}}</span>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">

                                <el-form-item label="账单地址:" class="postInfo-container-item">
                                  <el-autocomplete
                                    v-if="type!='view'"
                                    class="inline-input"
                                    v-model="data.billAddr"
                                    :fetch-suggestions="(queryString,cb)=>querySearch(queryString,cb,'dzData')"
                                    placeholder="请输入内容"
                                  ></el-autocomplete>
                                  <!--                                <el-select  v-if="type!='view'" default-first-option v-model="data.billAddr" placeholder>-->
                                  <!--                                  <el-option v-for="(item,key) in selectData.dzData.filter(itm=>!!itm.addressCn)" :key="key" :label="item.addressCn" :value="item.addressCn"></el-option>-->
                                  <!--                                </el-select>-->
                                  <span v-else>{{data.billAddr}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="电子邮件:" class="postInfo-container-item">
                                  <el-input v-if="type!='view'" size="small" v-model="data.billEmail"
                                            placeholder></el-input>
                                  <span v-else>{{data.billEmail}}</span>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="邮寄地址:" class="postInfo-container-item">
                                  <el-autocomplete
                                    v-if="type!='view'"
                                    class="inline-input"
                                    v-model="data.addressMail"
                                    :fetch-suggestions="(queryString,cb)=>querySearch(queryString,cb,'addressMailData')"
                                    placeholder="请输入内容"
                                  ></el-autocomplete>
                                  <!--                                <el-select  v-if="type!='view'"  default-first-option v-model="data.addressMail" placeholder>-->
                                  <!--                                  <el-option v-for="(item,key) in selectData.dzData.filter(itm=>!!itm.addressCn)" :key="key" :label="item.addressCn" :value="item.addressCn"></el-option>-->
                                  <!--                                </el-select>-->
                                  <span v-else>{{data.addressMail}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="收款日期:" class="postInfo-container-item">
                                  <span>{{data.paymentDate}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="收款状态:" class="postInfo-container-item">
                                  <template>
                                    <!-- <el-select default-first-option v-model="data.paymentStatus" placeholder="">
                                  <el-option v-for="(item,key) in selectData.dzData.filter(itm=>!!itm.addressCn)" :key="key" :label="item.addressCn" :value="item.addressCn">
                                  </el-option>
                                </el-select>-->
                                    <span>{{data.paymentStatusStr}}</span>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="所属月:" class="postInfo-container-item">
                                  <el-date-picker v-if="type!='view'" :picker-options="pickerOptions" align="right" @change="changeDate"
                                                  format="yyyy-MM-dd" placeholder="选择日期" type="date"
                                                  v-model="data.belongToDate" value-format="yyyy-MM-dd"/>
                                  <span v-else>{{data.belongToDate}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="开单人:" class="postInfo-container-item">
                                  <template>
                                    <span>{{data.billUserIdString}}</span>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="开单日期:" class="postInfo-container-item">
                                  <el-date-picker v-if="type!='view'" :picker-options="pickerOptions" align="right"
                                                  format="yyyy-MM-dd" placeholder="选择日期" type="date"
                                                  v-model="data.billDate" value-format="yyyy-MM-dd"/>
                                  <span v-else>{{data.billDate}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row v-if="data.taskType==2||isGj">
<!--                              <el-col :span="12">-->
<!--                                <el-form-item label="需账单岗审核:" class="postInfo-container-item">-->
<!--                                  &lt;!&ndash; <el-radio  v-model="data.ifzdgsh" :label="1">是</el-radio>-->
<!--                              <el-radio v-model="data.ifzdgsh" :label="0">否</el-radio> &ndash;&gt;-->
<!--                                  <template v-if="type!='view'">-->
<!--                                    <div>-->
<!--                                      <el-radio v-model="data.ifzdgsh" :label="1">是</el-radio>-->
<!--                                      <el-radio v-model="data.ifzdgsh" :label="0">否</el-radio>-->
<!--                                    </div>-->

<!--                                  </template>-->
<!--                                  <div v-else>-->
<!--                                    <span v-if="data.ifzdgsh==1">是</span>-->
<!--                                    <span v-if="data.ifzdgsh==0">否</span>-->
<!--                                  </div>-->
<!--                                </el-form-item>-->
<!--                              </el-col>-->
                              <el-col :span="12">
                                <el-form-item label="发送账单pdf至所属组邮箱:" class="postInfo-container-item">
                                  <template v-if="type!='view'">
                                    <el-radio v-model="data.ifSendMail" :label="1">是</el-radio>
                                    <el-radio v-model="data.ifSendMail" :label="0">否</el-radio>
                                  </template>
                                  <div v-else>
                                    <span v-if="data.ifSendMail==1">是</span>
                                    <span v-if="data.ifSendMail==0">否</span>
                                  </div>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row v-if="isGj">
                              <el-col :span="12">
                                <el-form-item label="自动生成的账单模板类型:" class="postInfo-container-item">
                                  <el-select v-if="type!='view'" :clearable="true" default-first-option filterable
                                             v-model="data.billTypeId" placeholder>
                                    <el-option v-for="(item,key) in bllTemplateList" :key="key" :label="item.name"
                                               :value="item.id"></el-option>
                                  </el-select>
                                  <span v-else>{{data.billType}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="!createCommonBill">
                              <el-col :span="24">
                                <el-form-item label="账单文档:" class="postInfo-container-item">
                                  <el-upload
                                    @contextmenu.native="handlepreviewDoc($event)"
                                    v-if="type!='view'"
                                    class="upload-demo"
                                    :before-remove="brforeRemoveFile"
                                    drag
                                    name="attachFile"
                                    ref="uploadFile"
                                    :data="getUploadData(data.caseArray.map(item=>item.caseId))"
                                    :on-preview="(file)=>previewDoc(file)"
                                    :action="creatematerial"
                                    :auto-upload="true"
                                    :file-list="materialList">
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">
                                      将文件拖到此处，或<em>点击上传</em>
                                    </div>
                                  </el-upload>
                                  <p v-for="item in materialList" v-else>
                                    <span class="itemTitle_style" @click="previewDoc(item)">{{item.name}}</span>
                                    <el-button type="text" class="el-icon-view"
                                               @click="preView(item)"></el-button>
                                    <el-button type="text" class="el-icon-download"
                                               @click="down(`${item.address}`)"></el-button>
                                  </p>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="备注:" class="postInfo-container-item">
                                  <el-input v-if="type!='view'" size="small" type="textarea" :rows="3"
                                            v-model="data.remarks" placeholder="请输入"></el-input>
                                  <span v-else>{{data.remarks}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="是否清除账单分配比例:" class="postInfo-container-item">
                                    <el-radio-group  v-if="createCommonBill"  v-model="data.delAllocate">
                                      <el-radio :label="1">是</el-radio>
                                      <el-radio :label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <div v-show="!createCommonBill" :class="fullScreenBox ? 'fullScreenBox' : ''">
                              <el-row style="border:none">
                                <el-col class="tilteSpan" :span="24">
                                  <span>账单明细</span>
                                  <el-button v-if="fullScreenBox" style="margin-left:10px" type="primary"
                                           @click="fullScreenBox=''" size="mini">还原
                                  </el-button>
                                  <el-button v-if="!fullScreenBox" style="margin-left:10px" type="primary"
                                             @click="fullScreen('billDetailsfwf')" size="mini">全屏
                                  </el-button>
                                  <el-button style="margin-left:10px" type="primary" size="mini" @click="chanageGridSize">切换字体大小</el-button>
                                </el-col>
                              </el-row>
                              <div>
                              <el-row style="border:none">
                                <el-col :span="24" style="text-align:right">
                                  <p class="title-mx">账单明细—服务费</p>
<!--                                  <el-button v-if="fullScreenBox" style="margin-left:10px" type="primary"-->
<!--                                             @click="fullScreenBox=''" size="mini">还原-->
<!--                                  </el-button>-->
<!--                                  <el-button v-if="!fullScreenBox" style="margin-left:10px" type="primary"-->
<!--                                             @click="fullScreen('billDetailsfwf')" size="mini">全屏-->
<!--                                  </el-button>-->
                                  <el-button v-if="type!='view'" style="margin-left:10px" type="primary"
                                             @click="addfwf('billDetailsfwf')" size="mini">添加
                                  </el-button>
                                  <el-button v-if="type!='view'" style="margin-left:10px" type="primary"
                                             @click="delList('billDetailsfwf')" size="mini">删除
                                  </el-button>
                                </el-col>
                              </el-row>
                              <AgGridVue :style="{width:'100%',maxHeight:'600px',overflow: 'auto',border:'1px'}"
                                         domLayout='autoHeight'
                                         class="ag-theme-balham"
                                         ref="gridApibillDetailsfwf"
                                         :columnDefs="columnDefs"
                                         :gridOptions="gridOptions"
                                         :rowData="data.billDetailsfwf"
                                         @dragStopped="(params)=>dragStopped(params,'billDetailsfwf')"
                                         rowSelection="multiple"
                                         :localeText="$store.state.caseInformation.localeText"
                                         :getContextMenuItems="(params)=>getContextMenuItems(params,'billDetailsfwf')"
                                         :pinnedBottomRowData="pinnedBottomRowData"
                                         :frameworkComponents="frameworkComponents"
                                         @sortChanged="(params)=>refreshEvenRowsCurrencyData(params,'billDetailsfwf')"
                                         :rowHeight="getRowHeight"
                                         animateRows
                                         suppressAutoSize
                                         :suppressRowDrag="false"
                                         :rowDragManaged="true"
                                         :suppressMoveWhenRowDragging="false"
                                         @rowDragEnd="(params)=>rowDragEnd(params,'billDetailsfwf')"
                              >
                              </AgGridVue>
                              <!--                        <div style="height: 100%;width: 100%" id="plTable">-->
                              <!--                          <div :style="{'height': '300px','width': '100%'}">-->
                              <!--<el-table :datas="tableData" height="400" useVirtual
                                        注意点： 表格插件并不需要height属性字段(跟ele不同)，因为涉及分页组件。里面会去计算高度，只需要父级外层设置高度即可
                                        row-height属性很重要 请看表格属性列表
                                        -->

                              <!--                        <el-table ref="billDetailsfwf" :paginationShow="false" size="mini" :data="data.billDetailsfwf" border fit empty-text="暂无数据" current-row-key style="width: 100%;"-->
                              <!--                                  fixed-columns-roll  use-virtual-->
                              <!--                                  :row-height="50"-->
                              <!--                                  show-summary-->
                              <!--                                  :summary-method="getSummaries"-->
                              <!--                                 >-->
                              <!--                          <el-table-column type="index" width="40" label="序号" align="left"></el-table-column>-->
                              <!--                          <el-table-column-->
                              <!--                            prop="startdate"-->
                              <!--                            :filters="$commonUtils.unique(data.billDetailsfwf.map(i=>({text:i['startdate'],value:i['startdate']})),'value').filter(ii=>ii.value)"-->
                              <!--                            :filter-method="filterHandler"-->
                              <!--                            filter-placement="bottom-start"-->
                              <!--                            label="发生期始" align="left" width="150">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              <el-date-picker v-if="type!='view'"  size="small" v-model="scope.row.startdate " type="datetime" placeholder="选择日期时间" align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>-->
                              <!--                              <span v-else>{{scope.row.startdate}}</span>-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                          <el-table-column-->
                              <!--                            prop="enddate"-->
                              <!--                           :filters="$commonUtils.unique(data.billDetailsfwf.map(i=>({text:i['enddate'],value:i['enddate']})),'value').filter(ii=>ii.value)"-->
                              <!--                           :filter-method="filterHandler"-->
                              <!--                           filter-placement="bottom-start" label="发生期至" align="left" width="150">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              <el-date-picker v-if="type!='view'"  size="small" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="scope.row.enddate " type="datetime" placeholder="选择日期时间" align="right" :picker-options="pickerOptions1"></el-date-picker>-->
                              <!--                              <span v-else>{{scope.row.enddate}}</span>-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                          <el-table-column-->
                              <!--                            prop="description"-->
                              <!--                            :filters="$commonUtils.unique(data.billDetailsfwf.map(i=>({text:i['description'],value:i['description']})),'value').filter(ii=>ii.value)"-->
                              <!--                            :filter-method="filterHandler"-->
                              <!--                            filter-placement="bottom-start" label="服务费描述" minWidth="300" align="left" width="auto">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              <el-popover v-if="type!='view'"  v-model="scope.row.fwfPopShow" width class="inputshow" placement="bottom" trigger="click" >-->
                              <!--                                <el-table size="mini" @row-click="((val)=>{fwtableClick(val, scope.row,scope.$index)})" :data="gridData" style="height:250px;overflow: scroll;"  >-->
                              <!--                                  <el-table-column width="200" property="nameCn" label="费用描述（中文）"></el-table-column>-->
                              <!--                                  <el-table-column width="300" property="nameEN" label="费用描述英文"></el-table-column>-->
                              <!--                                  <el-table-column width="100" property="caseType" label="案件类型"></el-table-column>-->
                              <!--                                  <el-table-column width="100" property="appFromto" label="申请方向"></el-table-column>-->
                              <!--                                  <el-table-column width="100" property="price" label="定价"></el-table-column>-->
                              <!--                                </el-table>-->
                              <!--                                <el-input @dblclick.native="dblclick('billDetailsfwf',scope.$index)"  type="textarea" size="small" slot="reference" autosize :title="scope.row.description" @input="fwfinputchange" v-model="scope.row.description"></el-input>-->
                              <!--                              </el-popover>-->
                              <!--                              <span v-else>{{scope.row.description}}</span>-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                          <el-table-column-->
                              <!--                            prop="useridString"-->
                              <!--                            :filters="$commonUtils.unique(data.billDetailsfwf.map(i=>({text:i['useridString'],value:i['useridString']})),'value').filter(ii=>ii.value)"-->
                              <!--                            :filter-method="filterHandler"-->
                              <!--                            filter-placement="bottom-start" label="员工" align="left" style="padding:0px" width="100">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              <el-select v-if="type!='view'"  size="small" default-first-option ref :clearable="true" @change="((val)=>{ygchangeselect(val, scope.row,scope.$index)})" v-model="scope.row.userid" no-match-text="暂无数据" loading-text="正在查询" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remotepaternalUnitYg">-->
                              <!--                                <el-option v-for="(item,key) in selectData.ygData" :key="key" :label="item.fullname" :value="item.userId"></el-option>-->
                              <!--                              </el-select>-->
                              <!--                              <span v-else>{{scope.row.useridString}}</span>-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                          <el-table-column-->
                              <!--                            prop="roleidString"-->
                              <!--                            :filters="$commonUtils.unique(data.billDetailsfwf.map(i=>({text:i['roleidString'],value:i['roleidString']})),'value').filter(ii=>ii.value)"-->
                              <!--                            :filter-method="filterHandler"-->
                              <!--                            filter-placement="bottom-start"-->
                              <!--                            label="工时角色" align="left" width="100">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              <el-select v-if="type!='view'" @change="(e)=>changeRole(e,scope.$index)"  size="small" default-first-option  :clearable="true" v-model="scope.row.roleid" no-match-text="暂无数据" loading-text="正在查询" filterable remote reserve-keyword placeholder="请输入关键词">-->
                              <!--                                <el-option v-for="(item,key) in allRoles" :key="key" :label="item.name" :value="item.roleId"></el-option>-->
                              <!--                              </el-select>-->
                              <!--&lt;!&ndash;                              <el-input v-if="type!='view'"  size="small"  type="text"  v-model="scope.row.roleid"></el-input>&ndash;&gt;-->
                              <!--                              <span v-else>{{scope.row.roleidString}}</span>-->
                              <!--&lt;!&ndash;                              <span>{{ scope.row.roleidString }}</span>&ndash;&gt;-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                          <el-table-column-->
                              <!--                            prop="number"-->
                              <!--                            :filters="$commonUtils.unique(data.billDetailsfwf.map(i=>({text:i['number'],value:i['number']})),'value').filter(ii=>ii.value)"-->
                              <!--                            :filter-method="filterHandler"-->
                              <!--                            filter-placement="bottom-start"-->
                              <!--                            label="数量" align="left" width="100">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              <el-input v-if="type!='view'"  size="small"  type="number" min="0" @change="((val)=>{numberchange(val, scope.row,scope.$index)})" v-model="scope.row.number"></el-input>-->
                              <!--                              <span v-else>{{scope.row.number}}</span>-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                          <el-table-column-->
                              <!--                            prop="localprice"-->
                              <!--                            :filters="$commonUtils.unique(data.billDetailsfwf.map(i=>({text:i['localprice'],value:i['localprice']})),'value').filter(ii=>ii.value)"-->
                              <!--                            :filter-method="filterHandler"-->
                              <!--                            filter-placement="bottom-start" label="本币单价" align="left" width="100">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              <el-input   size="small" v-if="scope.row['localpriceState']" v-show="type!='view'"  @blur="$set(scope.row,'localpriceState',false)" type="number" @change="((val)=>{djchange(val, scope.row,scope.$index)})" v-model="scope.row.localprice"></el-input>-->
                              <!--                              <el-input v-if="!scope.row['localpriceState']"  v-show="type!='view'"  size="small" @focus="$set(scope.row,'localpriceState',true)" :value="floatFomat(scope.row.localprice)"></el-input>-->
                              <!--                              <span v-if="type=='view'">{{floatFomat(scope.row.localprice)}}</span>-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                          <el-table-column-->
                              <!--                            prop="localsum"-->
                              <!--                            :filters="$commonUtils.unique(data.billDetailsfwf.map(i=>({text:i['localsum'],value:i['localsum']})),'value').filter(ii=>ii.value)"-->
                              <!--                            :filter-method="filterHandler"-->
                              <!--                            filter-placement="bottom-start" label="本币金额" align="left" width="100">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              <el-input  size="small"  v-if="scope.row['localsumState']" v-show="type!='view'"  @blur="$set(scope.row,'localsumState',false)" type="number" @change="((val)=>{bbchange(val, scope.row,scope.$index)})" v-model="scope.row.localsum"></el-input>-->
                              <!--                              <el-input   size="small" v-if="!scope.row['localsumState']" v-show="type!='view'" @focus="$set(scope.row,'localsumState',true)" :value="floatFomat(scope.row.localsum)"></el-input>-->
                              <!--                              <span v-if="type=='view'">{{floatFomat(scope.row.localsum)}}</span>-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                          <el-table-column-->
                              <!--                            prop="discount"-->
                              <!--                            :filters="$commonUtils.unique(data.billDetailsfwf.map(i=>({text:i['discount'],value:i['discount']})),'value').filter(ii=>ii.value)"-->
                              <!--                            :filter-method="filterHandler"-->
                              <!--                            filter-placement="bottom-start" label="折扣" align="left" width="80">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              <el-input v-if="type!='view'"  size="small" @change="((val)=>{zkchange(val, scope.row,scope.$index)})" type="number" v-model="scope.row.discount" min="1" max="100"></el-input>-->
                              <!--                              <span v-if="type=='view'">{{scope.row.discount}}</span>-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                          <el-table-column  prop="localSumDiscount"-->
                              <!--                                            :filters="$commonUtils.unique(data.billDetailsfwf.map(i=>({text:i['localSumDiscount'],value:i['localSumDiscount']})),'value').filter(ii=>ii.value)"-->
                              <!--                                            :filter-method="filterHandler"-->
                              <!--                                            filter-placement="bottom-start"  label="本币金额（折扣后）" align="left" width="100">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              &lt;!&ndash; <span>{{ scope.row.discount?( floatFomat(scope.row.localsum*(scope.row.discount/100))):0 }}</span> &ndash;&gt;-->
                              <!--                              <el-input v-show="type!='view'" size="small"  v-if="scope.row['localSumDiscountState']" @blur="$set(scope.row,'localSumDiscountState',false)" @change="((val)=>{bbzkchange(val, scope.row,scope.$index)})" type="number" v-model="scope.row.localSumDiscount"></el-input>-->
                              <!--                              <el-input v-show="type!='view'"  size="small" v-if="!scope.row['localSumDiscountState']" @focus="$set(scope.row,'localSumDiscountState',true)" :value="floatFomat(scope.row.localSumDiscount)"></el-input>-->
                              <!--                              <span v-if="type=='view'">{{floatFomat(scope.row.localSumDiscount)}}</span>-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                          <el-table-column prop="foreignprice"-->
                              <!--                                           :filters="$commonUtils.unique(data.billDetailsfwf.map(i=>({text:i['foreignprice'],value:i['foreignprice']})),'value').filter(ii=>ii.value)"-->
                              <!--                                           :filter-method="filterHandler"-->
                              <!--                                           filter-placement="bottom-start"  label="外币单价" align="left" width="100">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              <el-input v-show="type!='view'"   size="small" v-if="scope.row['foreignpriceState']" @blur="$set(scope.row,'foreignpriceState',false)" @change="((val)=>{wbdjchange(val, scope.row,scope.$index)})" type="number" v-model="scope.row.foreignprice"></el-input>-->
                              <!--                              <el-input v-show="type!='view'"  size="small" v-if="!scope.row['foreignpriceState']" @focus="$set(scope.row,'foreignpriceState',true)" :value="floatFomat(scope.row.foreignprice)"></el-input>-->
                              <!--                              <span v-if="type=='view'">{{floatFomat(scope.row.foreignprice)}}</span>-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                          <el-table-column  prop="foreignPriceDiscount"-->
                              <!--                                            :filters="$commonUtils.unique(data.billDetailsfwf.map(i=>({text:i['foreignPriceDiscount'],value:i['foreignPriceDiscount']})),'value').filter(ii=>ii.value)"-->
                              <!--                                            :filter-method="filterHandler"-->
                              <!--                                            filter-placement="bottom-start" label="外币单价(折扣后)" align="left" width="100">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              <el-input v-show="type!='view'"  size="small"   v-if="scope.row['foreignPriceDiscountState']" @blur="$set(scope.row,'foreignPriceDiscountState',false)" @change="((val)=>{wbdjzkhchange(val, scope.row,scope.$index)})" type="number" v-model="scope.row.foreignPriceDiscount"></el-input>-->
                              <!--                              <el-input v-show="type!='view'"   size="small" v-if="!scope.row['foreignPriceDiscountState']" @focus="$set(scope.row,'foreignPriceDiscountState',true)" :value="floatFomat(scope.row.foreignPriceDiscount)"></el-input>-->
                              <!--                              <span v-if="type=='view'">{{floatFomat(scope.row.foreignPriceDiscount)}}</span>-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                          <el-table-column  prop="foreignsum"-->
                              <!--                                            :filters="$commonUtils.unique(data.billDetailsfwf.map(i=>({text:i['foreignsum'],value:i['foreignsum']})),'value').filter(ii=>ii.value)"-->
                              <!--                                            :filter-method="filterHandler"-->
                              <!--                                            filter-placement="bottom-start" label="外币金额" align="left" width="100">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              <el-input v-show="type!='view'"  size="small"  v-if="scope.row['foreignsumState']" @blur="$set(scope.row,'foreignsumState',false)"  @change="((val)=>{wbjechange(val, scope.row,scope.$index)})" type="number" v-model="scope.row.foreignsum"></el-input>-->
                              <!--                              <el-input v-show="type!='view'"   size="small" v-if="!scope.row['foreignsumState']" @focus="$set(scope.row,'foreignsumState',true)" :value="floatFomat(scope.row.foreignsum)"></el-input>-->
                              <!--                              <span v-if="type=='view'">{{floatFomat(scope.row.foreignsum)}}</span>-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                          <el-table-column  prop="foreignSumDiscount"-->
                              <!--                                            :filters="$commonUtils.unique(data.billDetailsfwf.map(i=>({text:i['foreignSumDiscount'],value:i['foreignSumDiscount']})),'value').filter(ii=>ii.value)"-->
                              <!--                                            :filter-method="filterHandler"-->
                              <!--                                            filter-placement="bottom-start" label="外币金额(折扣后)" align="left" width="100">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              <el-input v-show="type!='view'"   size="small"   v-if="scope.row['foreignSumDiscountState']" @blur="$set(scope.row,'foreignSumDiscountState',false)" @change="((val)=>{wbjezkhchange(val, scope.row,scope.$index)})" type="number" v-model="scope.row.foreignSumDiscount"></el-input>-->
                              <!--                              <el-input v-show="type!='view'"   size="small" v-if="!scope.row['foreignSumDiscountState']" @focus="$set(scope.row,'foreignSumDiscountState',true)" :value="floatFomat(scope.row.foreignSumDiscount)"></el-input>-->

                              <!--                              <span v-if="type=='view'">{{floatFomat(scope.row.foreignSumDiscount)}}</span>-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                          <el-table-column label="操作" align="left" width v-if="type!='view'" width="40">-->
                              <!--                            <template slot-scope="scope">-->
                              <!--                              <el-button type="text" @click="delfwf('billDetailsfwf',scope.$index)" size="mini">删除</el-button>-->
                              <!--                            </template>-->
                              <!--                          </el-table-column>-->
                              <!--                        </el-table>-->
                              <!--                          </div>-->
                              <!--                        </div>-->
                              <div class="billallPice">
                                <span
                                  class="billtotalspan">数量合计：{{data.billDetailsfwf?data.billDetailsfwf.length:'0'}}条</span>
                                <span class="billtotalspan">本币金额合计（折扣前）：￥{{fomatFloat(totalPrincipal_fw)}}</span>
                                <span class="billtotalspan">本币金额合计（折扣后）：￥{{fomatFloat(totalPrincipal_fw_zh)}}</span>
                                <span class="billtotalspan" v-if="data.curId!='1'&&data.curId">
                            外币金额合计（折扣后）：
                            {{currencySymbol}}{{fomatFloat(totalPrincipal_fw_zh_wb)|formatAmount1}}
                          </span>
                              </div>
                            </div>
                              <div>
                                <el-row style="border:none">
                                  <el-col :span="24" style="text-align:right">
                                    <p class="title-mx">账单明细—官费</p>
<!--                                    <el-button v-if="fullScreenBox" style="margin-left:10px" type="primary"-->
<!--                                               @click="fullScreenBox=''" size="mini">还原-->
<!--                                    </el-button>-->
<!--                                    <el-button v-if="!fullScreenBox" style="margin-left:10px" type="primary"-->
<!--                                               @click="fullScreen('billDetailgf')" size="mini">全屏-->
<!--                                    </el-button>-->
                                    <el-button v-if="type!='view'" style="margin-left:10px" type="primary"
                                               @click="addfwf('billDetailgf')" size="mini">添加
                                    </el-button>
                                    <el-button v-if="type!='view'" style="margin-left:10px" type="primary"
                                               @click="delList('billDetailgf')" size="mini">删除
                                    </el-button>
                                  </el-col>
                                </el-row>

                                <AgGridVue :style="{width:'100%',maxHeight:'600px',overflow: 'auto',border:'1px'}"
                                           domLayout='autoHeight'
                                           class="ag-theme-balham"
                                           ref="gridApibillDetailgf"
                                           :columnDefs="columnDefs2"
                                           :gridOptions="gridOptions2"
                                           :rowData="data.billDetailgf"
                                           @dragStopped="(params)=>dragStopped(params,'billDetailgf')"
                                           rowSelection="multiple"
                                           @sortChanged="(params)=>refreshEvenRowsCurrencyData(params,'billDetailgf')"
                                           :localeText="$store.state.caseInformation.localeText"
                                           :getContextMenuItems="(params)=>getContextMenuItems(params,'billDetailgf')"
                                           :pinnedBottomRowData="pinnedBottomRowDatagf"
                                           :frameworkComponents="frameworkComponents"
                                           :rowHeight="getRowHeight"
                                           animateRows
                                           suppressAutoSize
                                           :suppressRowDrag="false"
                                           :rowDragManaged="true"
                                           :suppressMoveWhenRowDragging="false"
                                           @rowDragEnd="(params)=>rowDragEnd(params,'billDetailgf')"
                                >
                                </AgGridVue>
                                <div class="billallPice">
                                  <span
                                    class="billtotalspan">数量合计：{{data.billDetailgf?data.billDetailgf.length:'0'}}条</span>
                                  <span class="billtotalspan">本币金额合计：￥{{fomatFloat(totalPrincipal_gf)}}</span>

                                  <span class="billtotalspan" v-if="data.curId!='1'&&data.curId">
                              外币金额合计：
                              {{currencySymbol}}{{fomatFloat(totalPrincipal_gf_wb)|formatAmount1}}
                            </span>
                                </div>
                              </div>
                              <div>
                                <el-row style="border:none">
                                  <el-col :span="24" style="text-align:right">
                                    <p class="title-mx">账单明细—杂费</p>
<!--                                    <el-button v-if="fullScreenBox" style="margin-left:10px" type="primary"-->
<!--                                               @click="fullScreenBox=''" size="mini">还原-->
<!--                                    </el-button>-->
<!--                                    <el-button v-if="!fullScreenBox" style="margin-left:10px" type="primary"-->
<!--                                               @click="fullScreen('billDetailzf')" size="mini">全屏-->
<!--                                    </el-button>-->

                                    <el-button v-if="type!='view'" style="margin-left:10px" type="primary"
                                               @click="addfwf('billDetailzf')" size="mini">添加
                                    </el-button>
                                    <el-button v-if="type!='view'" style="margin-left:10px" type="primary"
                                               @click="delList('billDetailzf')" size="mini">删除
                                    </el-button>
                                  </el-col>
                                </el-row>
                                <!--                        <el-table  ref="billDetailzf" size="mini" :data="data.billDetailzf" show-summary-->
                                <!--                                   :summary-method="getSummaries" border fit empty-text="暂无数据" current-row-key style="width: 100%;">-->
                                <!--                          <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                                <!--                          <el-table-column prop="startdate"-->
                                <!--                                           :filters="$commonUtils.unique(data.billDetailzf.map(i=>({text:i['startdate'],value:i['startdate']})),'value').filter(ii=>ii.value)"-->
                                <!--                                           :filter-method="filterHandler"-->
                                <!--                                           filter-placement="bottom-start" label="发生日期" align="left" width="210">-->
                                <!--                            <template slot-scope="scope">-->
                                <!--                              <el-date-picker size="small" v-if="type!=='view'" v-model="scope.row.startdate " type="datetime" placeholder="选择日期时间" align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"></el-date-picker>-->
                                <!--                              <span v-if="type=='view'">{{scope.row.startdate}}</span>-->
                                <!--                            </template>-->
                                <!--                          </el-table-column>-->

                                <!--                          <el-table-column prop="description"-->
                                <!--                                           :filters="$commonUtils.unique(data.billDetailzf.map(i=>({text:i['description'],value:i['description']})),'value').filter(ii=>ii.value)"-->
                                <!--                                           :filter-method="filterHandler"-->
                                <!--                                           filter-placement="bottom-start" label="杂费描述" align="left">-->
                                <!--                            <template slot-scope="scope">-->
                                <!--                              <el-popover v-if="type!='view'" v-model="scope.row.zfPopShow" class="inputshow" placement="bottom" trigger="click">-->
                                <!--                                <el-table size="mini" @row-click="((val)=>{zftableClick(val, scope.row,scope.$index)})" :data="gridData" style="height:250px;overflow: scroll;">-->
                                <!--                                  <el-table-column width="200" property="nameCn" label="费用描述（中文）"></el-table-column>-->
                                <!--                                  <el-table-column width="300" property="nameEN" label="费用描述英文"></el-table-column>-->
                                <!--                                  <el-table-column width="100" property="caseType" label="案件类型"></el-table-column>-->
                                <!--                                  <el-table-column width="100" property="appFromto" label="申请方向"></el-table-column>-->
                                <!--                                  <el-table-column width="100" property="price" label="定价"></el-table-column>-->
                                <!--                                </el-table>-->
                                <!--                                <el-input  @dblclick.native="dblclick('billDetailzf',scope.$index)"  size="small" type="textarea" slot="reference" autosize @input="fwfinputchange" v-model="scope.row.description"></el-input>-->

                                <!--                              </el-popover>-->
                                <!--                              <span v-if="type=='view'">{{scope.row.description}}</span>-->
                                <!--                            </template>-->
                                <!--                          </el-table-column>-->

                                <!--                          <el-table-column prop="localsum"-->
                                <!--                                           :filters="$commonUtils.unique(data.billDetailzf.map(i=>({text:i['localsum'],value:i['localsum']})),'value').filter(ii=>ii.value)"-->
                                <!--                                           :filter-method="filterHandler"-->
                                <!--                                           filter-placement="bottom-start" label="本币金额" align="left" width>-->
                                <!--                            <template slot-scope="scope">-->
                                <!--                              <el-input  size="small" v-if="scope.row['localsumState']" v-show="type!='view'" @blur="$set(scope.row,'localsumState',false)"   type="number" @change="((val)=>{bbchangezf(val, scope.row,scope.$index)})" v-model="scope.row.localsum"></el-input>-->
                                <!--                              <el-input size="small" v-if="!scope.row['localsumState']" v-show="type!='view'" @focus="$set(scope.row,'localsumState',true)" :value="floatFomat(scope.row.localsum)"></el-input>-->
                                <!--                              <span v-if="type=='view'">{{floatFomat(scope.row.localsum)}}</span>-->
                                <!--                            </template>-->
                                <!--                          </el-table-column>-->
                                <!--                          <el-table-column prop="foreignsum"-->
                                <!--                                           :filters="$commonUtils.unique(data.billDetailzf.map(i=>({text:i['foreignsum'],value:i['foreignsum']})),'value').filter(ii=>ii.value)"-->
                                <!--                                           :filter-method="filterHandler"-->
                                <!--                                           filter-placement="bottom-start" label="外币金额" align="left" width="160">-->
                                <!--                            <template slot-scope="scope">-->
                                <!--                              <el-input size="small" v-if="scope.row['foreignsumState']" v-show="type!='view'" @blur="$set(scope.row,'foreignsumState',false)"   @change="((val)=>{wbjechangezf(val, scope.row,scope.$index)})" type="number" v-model="scope.row.foreignsum"></el-input>-->
                                <!--                              <el-input size="small" v-if="!scope.row['foreignsumState']" v-show="type!='view'" @focus="$set(scope.row,'foreignsumState',true)" :value="floatFomat(scope.row.foreignsum)"></el-input>-->
                                <!--                              <span v-if="type=='view'">{{floatFomat(scope.row.foreignsum)}}</span>-->
                                <!--                            </template>-->
                                <!--                          </el-table-column>-->

                                <!--                          <el-table-column label="操作" align="left" width v-if="type!='view'">-->
                                <!--                            <template slot-scope="scope">-->
                                <!--                              <el-button type="text" @click="delfwf('billDetailzf',scope.$index)" size="mini">删除</el-button>-->
                                <!--                            </template>-->
                                <!--                          </el-table-column>-->
                                <!--                        </el-table>-->
                                <AgGridVue :style="{width:'100%',maxHeight:'600px',overflow: 'auto',border:'1px'}"
                                           domLayout='autoHeight'
                                           class="ag-theme-balham"
                                           ref="gridApibillDetailzf"
                                           :columnDefs="columnDefs3"
                                           :gridOptions="gridOptions3"
                                           :rowData="data.billDetailzf"
                                           @dragStopped="(params)=>dragStopped(params,'billDetailzf')"
                                           rowSelection="multiple"
                                           :localeText="$store.state.caseInformation.localeText"
                                           :getContextMenuItems="(params)=>getContextMenuItems(params,'billDetailzf')"
                                           @sortChanged="(params)=>refreshEvenRowsCurrencyData(params,'billDetailzf')"
                                           :pinnedBottomRowData="pinnedBottomRowDatazf"
                                           :frameworkComponents="frameworkComponents"
                                           :rowHeight="getRowHeight"
                                           animateRows
                                           suppressAutoSize
                                           :suppressRowDrag="false"
                                           :rowDragManaged="true"
                                           :suppressMoveWhenRowDragging="false"
                                           @rowDragEnd="(params)=>rowDragEnd(params,'billDetailzf')"
                                >
                                </AgGridVue>
                                <div class="billallPice">
                                  <span
                                    class="billtotalspan">数量合计：{{data.billDetailzf?data.billDetailzf.length:'0'}}条</span>
                                  <span class="billtotalspan">本币金额合计：￥{{fomatFloat(totalPrincipal_zf)}}</span>

                                  <span class="billtotalspan" v-if="data.curId!='1'&&data.curId">
                              外币金额合计：
                              {{currencySymbol}}{{fomatFloat(totalPrincipal_zf_wb)|formatAmount1}}
                            </span>
                                </div>
                              </div>
                              <div :span="24" style="text-align:right; padding-top:15px">
                              <span style="margin-left:20px">本币账单共计:</span>
                              <span class="piceSpan">{{fomatFloat(totalPrincipal_gf)+fomatFloat(totalPrincipal_fw_zh+fomatFloat(totalPrincipal_zf))|formatAmount}}</span>
                              <!--                          {{Number(totalPrincipal_gf)+Number(totalPrincipal_fw_zh+Number(totalPrincipal_zf))}}-->
                              <span v-if="data.curId!='1'&&data.curId" style="margin-left:20px">外币账单共计:</span>
                              <span v-if="data.curId!='1'&&data.curId" class="piceSpan">{{currencySymbol}}{{(fomatFloat(totalPrincipal_gf)+fomatFloat(totalPrincipal_fw_zh)+fomatFloat(totalPrincipal_zf))/(data.exchangeRate*0.01)|formatAmount1}}</span>
                            </div>
                            </div>
                            <div v-show="!createCommonBill">
                              <el-row style="border-left:none">
                                <el-col class="tilteSpan" :span="24">
                                  <span>账单分配</span>
                                  <el-button v-if="createCommonBill" style="margin-left:10px;float: right" type="primary"
                                             @click="() => this.$set(this.data, 'billAllocations', [])" size="mini">清空
                                  </el-button>
                                  <el-button v-if="type!='view' || billData.billAllocation" style="margin-left:10px;float: right" type="primary"
                                             @click="data.billAllocations.push({wkgid:'',groupType:''})" size="mini">添加
                                  </el-button>
                                </el-col>
                              </el-row>
                              <el-table size="mini" :data="data.billAllocations" border fit empty-text="暂无数据"
                                        current-row-key style="width: 100%;">
                                <el-table-column label="工作组类型" align="left" width="210">
                                  <template slot-scope="scope">
                                    <el-select v-if="type!='view' || billData.billAllocation" v-model="scope.row.groupType" size="small"
                                               no-match-text="暂无数据" filterable>
                                      <el-option v-for="(item,key) in ['客户组','承办组']" :key="key" :label="item"
                                                 :value="item"></el-option>
                                    </el-select>
                                    <span v-else>{{ scope.row.groupType }}</span>
                                  </template>
                                </el-table-column>

                                <el-table-column label="工作组" align="left">
                                  <template slot-scope="scope">
                                    <el-select v-if="type!='view' || billData.billAllocation" v-model="scope.row.wkgid" size="small"
                                               no-match-text="暂无数据" filterable>
                                      <el-option v-for="(item,key) in selectData.gzzs" :key="key" :label="item.groupName"
                                                 :value="item.wkgId"></el-option>
                                    </el-select>

                                    <span v-else>{{ scope.row.groupName }}</span>
                                  </template>
                                </el-table-column>

                                <el-table-column label="分配比例" align="left" width>
                                  <template slot-scope="scope">
                                    <div v-if="type!='view' || billData.billAllocation">
                                      <el-input v-if="scope.row['biliState']" style="width: 90%;" size="small" v-model="scope.row.alloratio"
                                                @blur="$set(scope.row,'biliState',false)" @change="((val)=>{blchangeinput(val, scope.row,scope.$index)})"
                                                placeholder></el-input>
                                      <el-input @focus="$set(scope.row,'biliState',true)" v-else style="width: 90%;" size="small" :value="floatFomat(scope.row.alloratio)"
                                                @change="((val)=>{blchangeinput(val, scope.row,scope.$index)})"
                                                placeholder></el-input>%
                                    </div>

                                    <span v-else>{{scope.row.alloratio}}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column label="分配金额" align="left" width>
                                  <template slot-scope="scope">
                                    <el-input size="small" v-if="scope.row['allomoneyState']" v-show="type!='view' || billData.billAllocation"
                                              @blur="$set(scope.row,'allomoneyState',false)" type="number"
                                              v-model="scope.row.allomoney"
                                              @change="((val)=>{jechangeinput(val, scope.row,scope.$index)})"
                                              placeholder></el-input>
                                    <el-input size="small" v-if="!scope.row['allomoneyState']" v-show="type!='view' || billData.billAllocation"
                                              @focus="$set(scope.row,'allomoneyState',true)"
                                              :value="floatFomat(scope.row.allomoney)"></el-input>
                                    <span v-if="type=='view' && !billData.billAllocation">{{floatFomat(scope.row.allomoney)}}</span>
                                  </template>
                                </el-table-column>

                                <el-table-column label="审批人" align="left" width>
                                  <template slot-scope="scope">
                                    <span>{{ scope.row.approvaluseridString }}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column label="备注" align="left" width>
                                  <template slot-scope="scope">
                                    <el-input @dblclick.native="openEditDialog(scope.row,scope.$index)"
                                              v-if="type!='view' || billData.billAllocation" type="textarea" :rows="1" size="small"
                                              v-model="scope.row.memo" placeholder="请输入"></el-input>
                                    <span v-else>{{ scope.row.memo }}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column label="操作" align="left" width v-if="type!='view' || billData.billAllocation">
                                  <template slot-scope="scope">
                                    <el-button type="text" @click="data.billAllocations.splice(scope.$index,1)"
                                               size="mini">删除
                                    </el-button>
                                  </template>
                                </el-table-column>
                              </el-table>
                              <el-row class="fullRow">
                                <el-col :span="24">
                                  <el-form-item label="实际成本（费用+内帐）:" class="postInfo-container-item">
                                    <template>
                                      <span>{{data.actualCost|formatAmount}}</span>
                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-row class="fullRow">
                                <el-col :span="24">
                                  <el-form-item label="可分配（总金额-成本）:" class="postInfo-container-item">
                                    <template>
                                      <span>{{data.allocationMoney|formatAmount}}</span>
                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                            </div>

                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top:40px" v-if="type!='view' || billData.billAllocation">
                      <el-col :span="24" style="text-align:center">
                        <template v-if="createCommonBill"><el-button  size="medium" @click="sunmitBill(2)" type="primary">保存共同信息</el-button></template>
                        <template v-else>
                          <el-button :disabled="flag" size="medium" @click="sunmitBill(2)" type="primary">保存</el-button>
                          <el-button :disabled="flag" size="medium" v-if="type=='creat'" @click="sunmitBill(1)"
                                     type="primary">提交
                          </el-button>
                          <el-button :disabled="flag" size="medium" v-if="(billData.taskNo=='1')&&billData.taskNo"
                                     @click="shfunc('1')" type="primary">提交
                          </el-button>
                          <el-button :disabled="flag" size="medium" v-if="(billData.taskNo=='6')&&billData.taskNo"
                                     @click="shfunc('1')" type="primary">确认比例
                          </el-button>
                          <el-button :disabled="flag" size="medium"
                                     v-if="billData.taskNo!='1'&&billData.taskNo!='6'&&billData.taskNo"
                                     @click="shfunc('1')" type="primary">通过
                          </el-button>
                          <el-popover
                            placement="top"
                            width="250"
                            title="退回原因"
                            v-if="billData.taskNo!='1'&&billData.taskNo!='6'&&billData.taskNo"
                          >
                            <div style="text-align: right">
                              <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请输入内容"
                                v-model="failReasion">
                              </el-input>
                              <el-button type="primary" @click="shfunc('0',failReasion)" class="exactButton" size="mini">
                                确认退回
                              </el-button>
                            </div>
                            <el-button slot="reference" :disabled="flag" size="medium" type="primary">退回</el-button>
                          </el-popover>
                        </template>
                        <el-button :disabled="flag" style="margin-left:50px" type @click="cancel(false)" size="medium">取消
                        </el-button>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top:40px" v-else>
                      <el-col :span="24" style="text-align:center">
                        <el-button type @click="cancel(false)" size="medium">关闭</el-button>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col class="form-con-item" :span="24">
                        <el-row class="form-border">
                          <el-row style="border-left:none">
                            <el-col class="tilteSpan" :span="24">
                              <span>我方账户</span>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="12">
                              <el-form-item label="我方账户:" :prop="createCommonBill ? '' : 'payAccountId'" class="postInfo-container-item">
                                <el-select v-if="type!='view'" default-first-option filterable clearable @change="yhSelectchange"
                                           v-model="data.payAccountId" placeholder>
                                  <el-option v-for="(item,key) in selectData.yhData.filter(item => $store.getters.permissions.includes(364) && item.payAccountId == 49 || item.payAccountId != 49)" :key="key"
                                             :label="item.payAccountName" :value="item.payAccountId"></el-option>
                                </el-select>
                                <span v-else>{{data.payAccountIdString}}</span>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="是否使用英文账户:" class="postInfo-container-item">
                                <el-radio-group v-if="type!='view'" @change="ywradiochange" v-model="data.useEnAccount">
                                  <el-radio :label="1">是</el-radio>
                                  <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                                <div v-else>
                                  <span v-if="data.useEnAccount==1">是</span>
                                  <span v-if="data.useEnAccount==0">否</span>
                                </div>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="银行账户名称:" class="postInfo-container-item">
                                <template>
                                  <span>{{data.bankAccountName}}</span>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="银行账户地址:" class="postInfo-container-item">
                                <template>
                                  <span>{{data.bankAccountAddress}}</span>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="开户银行:" class="postInfo-container-item">
                                <template>
                                  <span>{{data.bankName}}</span>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item label="银行账号:" class="postInfo-container-item">
                                <template>
                                  <span>{{data.bankAccount}}</span>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="银行行号:" class="postInfo-container-item">
                                <template>
                                  <span>{{data.bankNo}}</span>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="银行国际代码:" class="postInfo-container-item">
                                <template>
                                  <span>{{data.swiftCode}}</span>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-row>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-form>
            </transition>
          </el-tab-pane>
          <el-tab-pane label="核销信息" name="second">
            <transition name="show" mode="out-in">
              <WriteOff @billTypeEvent="billTypeEvent" ref="writeOff" :type="type" v-if="data.billId" :billId="data.billId" @changeBill="changeBill"
                        :caseIds="data.caseArray.map(item=>item.caseId)"></WriteOff>
            </transition>
          </el-tab-pane>
          <el-tab-pane label="账单流程" name="three">
            <transition name="show" mode="out-in">
              <el-table :data="progressData"
                        style="width: 98%">
                <el-table-column
                  :prop="item.prop"
                  :label="item.label"
                  v-for="item in progressColumn"
                >
                </el-table-column>
              </el-table>
            </transition>
          </el-tab-pane>
          <!--      <el-tab-pane label="账单指示" name="second">-->
          <!--        <transition name="show" mode="out-in">-->
          <!--         -->
          <!--        </transition>-->
          <!--      </el-tab-pane>-->
        </el-tabs>
      </div>
      <div class="zdzs" :style="{'display':custFlag?'none':'block'}">
        <!--        <p>客户 <span>{{data.custFullNameString}}</span></p>-->
        <!--        <el-table size="mini" :data="data.customerRequirementBillList" border fit empty-text="暂无数据" current-row-key style="width: 100%;">-->
        <!--          &lt;!&ndash;          <el-table-column type="index" width="30" label="序号" align="left"></el-table-column>&ndash;&gt;-->
        <!--          &lt;!&ndash;          <el-table-column label="客户" align="left" width="80">&ndash;&gt;-->
        <!--          &lt;!&ndash;            <template slot-scope="scope">&ndash;&gt;-->
        <!--          &lt;!&ndash;              <span>{{ scope.row.custfullname }}</span>&ndash;&gt;-->
        <!--          &lt;!&ndash;            </template>&ndash;&gt;-->
        <!--          &lt;!&ndash;          </el-table-column>&ndash;&gt;-->

        <!--          &lt;!&ndash;          <el-table-column label="申请人" align="left" width="80">&ndash;&gt;-->
        <!--          &lt;!&ndash;            <template slot-scope="scope">&ndash;&gt;-->
        <!--          &lt;!&ndash;              &ndash;&gt;-->
        <!--          &lt;!&ndash;            </template>&ndash;&gt;-->
        <!--          &lt;!&ndash;          </el-table-column>&ndash;&gt;-->

        <!--          <el-table-column label="账单特殊指示" align="left" width>-->
        <!--            <template slot-scope="scope">-->
        <!--              <el-collapse v-model="scope.row.activeNames" >-->
        <!--                <el-collapse-item :title="`时间: ${scope.row.startDate?scope.row.startDate:''}`" name="1">-->
        <!--                <span v-if="scope.row.applicantName">申请人{{ scope.row.applicantName }}</span>-->
        <!--                <el-input type="textarea"  autosize v-if="type!='view'" size="small" :title="scope.row.specialInfo" v-model="scope.row.specialInfo" placeholder></el-input>-->
        <!--                <div style="padding: 5px 10px" v-html="getSpecialInfo(scope.row.specialInfo)" v-else></div>-->
        <!--                </el-collapse-item>-->
        <!--              </el-collapse>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--        </el-table>-->
        <SpecialInstructions :type="type" :data="data"></SpecialInstructions>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :title="`${data.custFullNameString}——联系人/抬头编辑`" :visible.sync="dialogVisibleTt" width="70%">
      <CustDetail v-if="dialogVisibleTt" :is-edit="type!='view'" :billCustId="data.custId" :isBillEdit="true"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleTt = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleTt = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      append-to-body
      :visible.sync="textareaState"
      width="50%"
      :modal="false"
      top="0"
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
      <span slot="footer" class="fl-ac-jc">
        <el-button @click="handleClose" size="small" type="primary">确 定</el-button>
        <el-button @click="textareaState = false" size="small">取 消</el-button>
      </span>

    </el-dialog>
    <el-dialog title="案件选择" :close-on-click-modal="false" :modal-append-to-body="false" append-to-body :visible.sync="selectCaseVisible" width="40%">
      <el-table :data="selectCaseList" border height="450">
        <el-table-column type="index" width="60" label="序号" align="left">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.$index+1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="案件文号" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.agentNum}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="案件类型" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.caseTypeStr}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="案件名称" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.caseName}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="类别" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.goodClasses}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectCaseVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {saveLog} from '@/api/systemList'
  import ChooseCase from "../../../case/components/ChooseCase";
  import Sortable from 'sortablejs';
  import DraginResize from 'jo-dragin-resize'
  import {mapGetters} from "vuex";
  import SpecialInstructions from "./SpecialInstructions";
  import {creatematerial} from '@/api/ipServiceApi.config.js'
  import {
    queryPayAcountUrl,
    queryBillUrl,
    queryCurrencyUrl,
    querywfUserNameUrl,
    queryChargeItemBynameCnUrl,
    createBillUrl,
    updateBillUrl,
    queryCustomerContactByCustIdUrl1,
    queryCustomerAddrListUrl,
    billSubmitUrl,
    batchdoBillTaskUrl,
    queryZZWorkGroupUrl,
    queryCustomerContactAddrUrl,
    checkWkgIsGj,
    queryBillTemplateUrl, queryBillTaskRecord,
    disposeAgentNum, billDiscount,
    queryAgentUser,
    queryClassTree,
    queryWkgId,
    queryUserRate, checkBillDescWord
  } from '@/api/billApi'
  import {
    delCaseMaterialUrl
  } from "@/api/caseDetail";
  import {formatAmount, fomatFloat, toFixed1, toFixed2} from '@/utils/filters'
  import {queryAllRoles} from '@/api/systemList'
  import CustDetail from "@/views/workbench/customer_management/customer_list/components/CustDetail";
  import WriteOff from '@/views/workbench/finance/billviews/components/WriteOff.vue'
  import {viewPdf, queryCustomerNameId, checkPermission, recordOnlienEdit} from "@/api/caseList";
  import {doEditInOffice, getProgID} from '@/utils/editInOffice.js'
  import aGSelectDate from "@/components/aGSelectDate/index.js";
  import aGSelectUser from "@/components/aGSelectUser/index.js";
  import aGSelectRoles from "@/components/aGSelectRoles/index.js";
  import aGSelectDescription from "@/components/aGSelectDescription/index.js";
  import {checkWkg, deleteBillAllocation} from "../../../../../api/billApi";

  export default {
    name: "billDetail",
    components: {CustDetail, WriteOff, SpecialInstructions, ChooseCase},
    computed: {
      pinnedBottomRowData() {
        if (this['gridApi' + 'billDetailsfwf']) {
          return [
            {
              sid: "##",
              startdate: '##',
              enddate: '##',
              description: '##',
              userid: '##',
              roleid: '##',
              number: this.getSum(this['gridApi' + 'billDetailsfwf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'number'),
              localprice: (this.getSum(this['gridApi' + 'billDetailsfwf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'localsum', true) / this.getSum(this['gridApi' + 'billDetailsfwf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'number')).toFixed(2),
              localsum: this.getSum(this['gridApi' + 'billDetailsfwf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'localsum'),
              discount: '##',
              // discount:(this.getSum(this['gridApi'+'billDetailsfwf'].rowModel.rootNode.childrenAfterFilter.map(item=>item.data),'localSumDiscount',true)/this.getSum(this['gridApi'+'billDetailsfwf'].rowModel.rootNode.childrenAfterFilter.map(item=>item.data),'localsum',true)).toFixed(2)*100,
              localSumDiscount: this.getSum(this['gridApi' + 'billDetailsfwf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'localSumDiscount'),
              foreignprice: (this.getSum(this['gridApi' + 'billDetailsfwf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'foreignsum', true) / this.getSum(this['gridApi' + 'billDetailsfwf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'number')).toFixed(2),
              foreignPriceDiscount: (this.getSum(this['gridApi' + 'billDetailsfwf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'foreignSumDiscount', true) / this.getSum(this['gridApi' + 'billDetailsfwf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'number')).toFixed(2),//this.getSum(this['gridApi'+'billDetailsfwf'].rowModel.rootNode.childrenAfterFilter.map(item=>item.data),'foreignPriceDiscount'),
              foreignsum: this.getSum(this['gridApi' + 'billDetailsfwf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'foreignsum'),
              foreignSumDiscount: this.getSum(this['gridApi' + 'billDetailsfwf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'foreignSumDiscount')
            },
          ]
        } else {
          return [{}]
        }

      },
      pinnedBottomRowDatagf() {
        if (this['gridApi' + 'billDetailgf']) {
          return [
            {
              sid: "##",
              startdate: '##',
              description: '##',
              number: this.getSum(this['gridApi' + 'billDetailgf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'number'),
              localprice: (this.getSum(this['gridApi' + 'billDetailgf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'localprice', true) / this['gridApi' + 'billDetailgf'].rowModel.rootNode.childrenAfterFilter.length).toFixed(2),
              localsum: this.getSum(this['gridApi' + 'billDetailgf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'localsum'),
              foreignprice: (this.getSum(this['gridApi' + 'billDetailgf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'foreignsum', true) / this.getSum(this['gridApi' + 'billDetailgf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'number')).toFixed(2),
              foreignsum: this.getSum(this['gridApi' + 'billDetailgf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'foreignsum'),
            },
          ]
        } else {
          return [{}]
        }

      },
      pinnedBottomRowDatazf() {
        if (this['gridApi' + 'billDetailzf']) {
          return [
            {
              sid: "##",
              startdate: '##',
              description: '##',
              localsum: this.getSum(this['gridApi' + 'billDetailzf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'localsum'),
              foreignsum: this.getSum(this['gridApi' + 'billDetailzf'].rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'foreignsum'),
            }
          ]
        } else {
          return [{}]
        }

      },
      totalPrincipal_fw: function () {
        let fw_number = 0;
        if (this.data.billDetailsfwf) {
          this.data.billDetailsfwf.forEach(item => {
            fw_number += Number(item.localsum);
          });
        }
        return this.fomatFloat(fw_number);
      },
      totalPrincipal_fw_zh: function () {
        let fw_number = 0;
        if (this.data.billDetailsfwf) {
          this.data.billDetailsfwf.forEach(item => {
            fw_number += Number(item.localsum * item.discount * 0.01);
          });
        }
        return this.fomatFloat(fw_number)
      },
      totalPrincipal_fw_zh_wb() {
        let fw_number = 0;
        if (this.data.billDetailsfwf) {
          this.data.billDetailsfwf.forEach(item => {
            fw_number += Number(item.localsum * item.discount * 0.01);
          });
        }
        if (this.totalPrincipal_zf != 0) {
          return fw_number / (this.data.exchangeRate * 0.01)
        } else {
          if (this.totalPrincipal_gf == 0) {
            return fw_number / (this.data.exchangeRate * 0.01)
          } else {
            return toFixed1((Number(this.totalPrincipal_gf) + this.totalPrincipal_fw_zh) / (this.data.exchangeRate * 0.01)) - toFixed1(this.totalPrincipal_gf / (this.data.exchangeRate * 0.01))
          }
        }
      },
      totalPrincipal_gf: function () {
        let gf_number = 0;
        if (this.data.billDetailgf) {
          this.data.billDetailgf.forEach(item => {
            gf_number += Number(item.localsum);
          });
          let changelaterPrice = this.price + (gf_number - this.gfprice)
          this.$set(this.data, 'actualCost', changelaterPrice)
          // this.data.actualCost = this.price + (gf_number - this.gfprice)
        }
        return this.fomatFloat(gf_number);
      },
      totalPrincipal_gf_wb: function () {
        let gf_number = 0;
        if (this.data.billDetailgf) {
          this.data.billDetailgf.forEach(item => {
            gf_number += Number(item.foreignsum);
          });
        }
        return gf_number;
      },
      totalPrincipal_zf: function () {
        let zf_number = 0;
        if (this.data.billDetailzf) {
          this.data.billDetailzf.forEach(item => {
            zf_number += Number(item.localsum);
          });
        }

        return this.fomatFloat(zf_number);
      },
      totalPrincipal_zf_wb: function () {
        let zf_number = 0;
        if (this.data.billDetailzf) {
          this.data.billDetailzf.forEach(item => {
            zf_number += Number(item.foreignsum);
          });
        }
        if (zf_number == 0) {
          return 0
        } else {
          // console.log(toFixed1((Number(this.totalPrincipal_gf) + this.totalPrincipal_fw_zh + Number(this.totalPrincipal_zf)) / (this.data.exchangeRate * 0.01)) , toFixed1(this.totalPrincipal_fw_zh / (this.data.exchangeRate * 0.01)) ,toFixed1(this.totalPrincipal_gf_wb));
          return toFixed1((Number(this.totalPrincipal_gf) + this.totalPrincipal_fw_zh + Number(this.totalPrincipal_zf)) / (this.data.exchangeRate * 0.01)) - toFixed1(this.totalPrincipal_fw_zh / (this.data.exchangeRate * 0.01)) - toFixed1(this.totalPrincipal_gf_wb)
        }
      },
      conunt_cb: {
        get: function () {
          return this.totalPrincipal_gf;
        }
      },
      can_fp: {
        get: function () {
          return this.fomatFloat(Number(this.totalPrincipal_gf) + Number(this.totalPrincipal_fw_zh) + Number(this.totalPrincipal_zf) - Number(this.data.actualCost))
        }
      },

      ...mapGetters(["name", "roles", "userId"])
    },
    props: {
      createCommonBill: {},
      billData: {},
      type: {}
    },
    created() {
      this.timeDefaultShow = new Date();

      this.timeDefaultShow.setMonth(new Date().getMonth() - 1);
      if (this.createCommonBill) {
        this.timeDefaultShow = ''
      }
      this.getallSelectdata();
      // this.getBilldetail();
      this.queryBillTemplate()
      this.queryBillTaskRecord()
      this.queryAllRoles()
      // this.checkWkgIsGj()
    },
    data() {
      const that = this
      return {
        billTypeProps:{
          value: "id",
          label: "typeName",
          children: "childrens",
        },
        billTypeIds: [],
        typeTreeList:[],
        caseDescShow: false,
        caseDescHtml: '',
        rowHeight: 28,
        gridFontSizeBig: true,
        movingNode: '',
        price: 0,
        gfprice: 0,
        timeDefaultShow: '',
        progressData: [],
        progressColumn: [{prop: 'progressName', label: '任务名称'}, {prop: 'status', label: '任务状态'}, {
          prop: 'tasker',
          label: '任务人'
        }, {prop: 'createTime', label: '创建时间'}, {prop: 'result', label: '任务执行结果'}, {
          prop: 'returnReason',
          label: '退回原因'
        }],
        materialList: [],
        creatematerial,
        custFlag: localStorage.getItem('custFlag') ? Number(localStorage.getItem('custFlag')) : 0,
        flag: false,
        isGj: '',
        dialogVisibleTt: false,
        fwfPopShow: false,
        gfPopShow: false,
        zfPopShow: false,
        changeCaseVisible: false,
        fwDatevalue: [],
        rules: {
          wkgId: [
            {required: true, message: "请选择所属工作组", trigger: "change"}
          ],
          caseDesc: [
            {required: true, message: "请填写案件描述", trigger: "change"}
          ],
          curId: [
            {required: true, message: "请选择结算币种", trigger: "change"}
          ],
          payAccountId: [
            {required: true, message: "请选择我方账户", trigger: "change"}
          ]
        },
        textarea: '',
        textareaState: false,
        gridData: [],
        activeName: "first",
        failReasion: '',
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
        pickerOptions1: {
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
        messageList: [],
        checkNum: false,
        isSaveBill: false,
        allRoles: [],
        gridOptions: {
          onColumnResized(params) {

            params.api.resetRowHeights();
          },
          onGridReady: (params) => {
            this['gridApi' + 'billDetailsfwf'] = params.api
            this.data.billDetailsfwf.forEach(function (data, index) {
              data.id = index;
            });
            // params.api.setRowData(this.data.billDetailsfwf);
            // params.api.sizeColumnsToFit();
          },
          singleClickEdit: true,
          // onCellEditingStarted: function (event) {
          //   console.log('cellEditingStarted');
          // },
          onCellEditingStarted(event) {
            that.preValue = event.value
          },
          // getRowHeight(params){
          //   if(params.data.description){
          //     return (params.api.getSizesForCurrentTheme().rowHeight * Math.floor(params.data.description.length / 50))
          //   }else {
          //     return 28
          //   }
          //  // return (params.api.getSizesForCurrentTheme().rowHeight * Math.floor(params.data.description.length / 50))
          // },
          onCellValueChanged(event) {
          },
          onCellEditingStopped: (event) => {
            if (that.preValue === event.value) {
              return;
            }
            const numCols = [
              {value: 'number', label: '数量'},
              {value: 'localprice', label: '本币单价'},
              {value: 'localsum', label: '本币金额'},
              {value: 'discount', label: '折扣'},
              {value: 'localSumDiscount', label: '本币金额(折扣后)'},
              {value: 'foreignprice', label: '外币单价'},
              {value: 'foreignPriceDiscount', label: '外币单价(折扣后)'},
              {value: 'foreignsum', label: '外币金额'},
              {value: 'foreignSumDiscount', label: '外币金额(折扣后)'}]
            if (numCols.find(item => item.value == event.colDef.field) && isNaN(event.value.replace(/,/g, ''))) {
              this.checkNum = true
              event.value = that.preValue
              this.$message.error(`服务费中的${numCols.find(item => item.value == event.colDef.field).label}必须为数字`)
              if (this.isSaveBill) {
                this.messageList.push({
                  model: '服务费',
                  idx: event.rowIndex + 1,
                  label: numCols.find(item => item.value == event.colDef.field).label
                })
              }
              event.api.refreshCells()
            }
            // this['gridApi'+'billDetailsfwf'].resetRowHeights();
            this.changeRowFwf(event, that.preValue)
            // var setFilter = this['gridApi'+'billDetailsfwf'].getFilterInstance(event.colDef.field);
            // setFilter.refreshFilterValues();
            this.resetRowHeights('billDetailsfwf')

          },
        },
        gridApi: null,
        frameworkComponents: {
          aGSelectDate: aGSelectDate,
          aGSelectUser: aGSelectUser,
          aGSelectRoles: aGSelectRoles,
          aGSelectDescription: aGSelectDescription
        },
        caseTypeIdString: '',
        data: {
          agentUserName:'',
          agentUser:'',
          billStyle:'',
          billStyleName:'',
          // otherBillInfo: '',
          // ifSendMail: '',
          // ifZZSH: '',
          // ifzdgsh: '',
          // ifGJ: '',
          // addrId:'',
          // billAllocations:[],
          caseArray: [],
          accountPeriod: '',
          actualCost: '',
          actualExpense: '',
          addrId: '',
          addrIdString: "",
          address: null,
          addressMail: null,
          agentNumEnd: null,
          agentNumEndIs: null,
          agentNumStart: null,
          agentNumStartIs: null,
          agentNumString: null,
          allocationMoney: '',
          appFullNameString: null,
          appId: null,
          appIdList: null,
          appShortNameString: null,
          auditStatus: null,
          autoGener: null,
          badDebtDate: null,
          badDebtDesc: null,
          badDebtUserId: null,
          bankAccount: '',
          bankAccountAddress: null,
          bankAccountName: "",
          bankName: "",
          bankNo: "",
          belongToDate: "",
          belongToDateEnd: null,
          belongToDateShort: null,
          belongToDateStart: null,
          billAddr: '',
          billAllocations: [],
          billContact: "",
          billCost: null,
          billDate: "",
          billDateArray: null,
          billDateEnd: null,
          billDateStart: null,
          billDetailgf: [],
          billDetails: [],
          billDetailsfwf: [],
          billDetailzf: [],
          billEmail: null,
          billId: null,
          billIn: null,
          billNo: null,
          billNoEnd: null,
          billNoStart: null,
          billRecordDate: "",
          billRecordUserId: null,
          billRecords: null,
          billSum: null,
          billType: null,
          billTypeId: null,
          billUserId: '',
          billwfStatus: null,
          caseDesc: '',
          caseId: null,
          caseTypeId: null,
          caseTypeIdArray: null,
          caseTypeIdString: null,
          caseTypeIds: null,
          company: null,
          completeAllocationPro: false,
          createDate: "",
          createUser: null,
          curId: null,
          custContactId: null,
          custCountry: null,
          custFullNameString: "",
          custId: '',
          custRefno: "",
          custShortNameString: null,
          customerRequirementBillList: [],
          department: null,
          deptId: null,
          deptIdList: null,
          discount: null,
          endDate: null,
          exchangeRate: 0,
          execDate: "",
          financeAuditStatus: false,
          flag: 0,
          foreignSum: 348.6,
          ifGJ: 1,
          ifSendMail: null,
          ifzdgsh: 0,
          importDataId: null,
          importDesc: null,
          isend: 0,
          isnewcase: 0,
          list: null,
          materialName: null,
          memo: null,
          nextReminderDate: null,
          noFee: false,
          officialCost: 0,
          otherBillInfo: null,
          otherCost: '',
          payAccountId: 1,
          payAccountIdString: "万慧达中信银行账户",
          payAccountName: null,
          paymentStatus: 1,
          paymentStatusStr: "",
          procdefinid: 10,
          recentReminderDate: null,
          remarks: null,
          reminderNum: null,
          returnReason: null,
          serviceCost: 3000,
          serviceCostDiscount: 0,
          serviceCostTotal: null,
          showRefno: "",
          startDate: null,
          subject: "",
          sumBillNo: null,
          swiftCode: "",
          synchro: 0,
          taskId: null,
          tasker: null,
          taskerUserId: null,
          useEnAccount: 0,

          wkgId: '',
          custContactIdArray: []
        },
        fullScreenBox: '',
        selectData: {
          bzData: [],
          yhData: [],
          ygData: [],
          lxrData: [],
          gzzs: [],
          dzData: [],
          ttData: [],
          titleData: [],
          addressMailData: []
        },
        currencySymbol: "",
        bllTemplateList: [],
        selectCaseList: [],
        selectCaseVisible: false,
        queryCustomerNameIdList: [],
        preferenceList: [
          {
            headerName: '序号',
            field: 'sid',
            // 'pinned': 'left', //固定再左边
            enableRowGroup: true,
            resizable: true,
            // enablePivot: true,
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer,
            rowDrag: true
          },
          {
            headerName: '发生期始',
            field: 'startdate',
            resizable: true,
            sortable: true,
            editable: this.type !== 'view',
            cellEditor: 'aGSelectDate',
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '发生期至',
            field: 'enddate',
            cellEditor: 'aGSelectDate',
            editable: this.type !== 'view',
            resizable: true,
            sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '服务费描述',
            field: 'description',
            autoHeight: true,
            cellStyle: {'white-space': 'normal'},
            editable: this.type !== 'view',
            resizable: true,
            width: 350,
            // sortable: true,
            cellEditor: 'aGSelectDescription',
            cellEditorParams: {
              onDoubleClick(type, data) {
                // console.log(that.data[type]);
                that.dblclick(type, that.data[type].indexOf(data))
                // console.log(type,data);
              }
            },
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '员工',
            field: 'userid',
            cellEditor: 'aGSelectUser',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              cellRenderer(params) {
                let value;
                var data = that.selectData.ygData.find(item => item.userId == params.value)
                if (data) {
                  value = data.fullname
                }
                return '<span style="font-weight: bold">' + value + '</span>';
              },
              comparator: (a, b) => {

                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '工时角色',
            field: 'roleid',
            cellEditor: 'aGSelectRoles',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,roleidString
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              cellRenderer(params) {
                let value;
                var data = that.allRoles.find(item => item.roleId == params.value)
                if (data) {
                  value = data.name
                }
                return '<span style="font-weight: bold">' + value + '</span>';
              },
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '数量',
            field: 'number',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '本币单价',
            field: 'localprice',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '本币金额',
            field: 'localsum',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '折扣',
            field: 'discount',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '本币金额（折扣后）',
            field: 'localSumDiscount',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '外币单价',
            field: 'foreignprice',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '外币单价(折扣后)',
            field: 'foreignPriceDiscount',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '外币金额',
            field: 'foreignsum',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '外币金额(折扣后)',
            field: 'foreignSumDiscount',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          }],
        preferenceList2: [
          {
            headerName: '序号',
            field: 'sid',
            // 'pinned': 'left', //固定再左边
            enableRowGroup: true,
            resizable: true,
            // enablePivot: true,
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer,
            rowDrag: true
          },
          {
            headerName: '发生期始',
            field: 'startdate',
            resizable: true,
            sortable: true,
            editable: this.type !== 'view',
            cellEditor: 'aGSelectDate',
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '官费描述',
            field: 'description',
            autoHeight: true,
            cellStyle: {'white-space': 'normal'},
            editable: this.type !== 'view',
            resizable: true,
            width: 350,
            // sortable: true,
            cellEditor: 'aGSelectDescription',
            cellEditorParams: {
              onDoubleClick(type, data) {
                // console.log(that.data[type]);
                that.dblclick('billDetailgf', that.data['billDetailgf'].indexOf(data))
                // console.log(type,data);
              }
            },
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '数量',
            field: 'number',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '本币单价',
            field: 'localprice',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '本币金额',
            field: 'localsum',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '外币单价',
            field: 'foreignprice',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '外币金额',
            field: 'foreignsum',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
        ],
        preferenceList3: [
          {
            headerName: '序号',
            field: 'sid',
            // 'pinned': 'left', //固定再左边
            enableRowGroup: true,
            resizable: true,
            // enablePivot: true,
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer,
            rowDrag: true
          },
          {
            headerName: '发生期始',
            field: 'startdate',
            resizable: true,
            sortable: true,
            editable: this.type !== 'view',
            cellEditor: 'aGSelectDate',
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '杂费描述',
            field: 'description',
            autoHeight: true,
            cellStyle: {'white-space': 'normal'},
            editable: this.type !== 'view',
            resizable: true,
            width: 350,
            // sortable: true,
            cellEditor: 'aGSelectDescription',
            cellEditorParams: {
              onDoubleClick(type, data) {
                // console.log(that.data[type]);

                that.dblclick('billDetailzf', that.data['billDetailzf'].indexOf(data))
                // console.log(type,data);
              }
            },
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '本币金额',
            field: 'localsum',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          },
          {
            headerName: '外币金额',
            field: 'foreignsum',
            editable: this.type !== 'view',
            resizable: true,
            // sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            filterParams: {
              refreshValuesOnOpen: true,
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b)
              }
            }
          }
        ],
        columnDefs: [],
        gridOptions2: {
          onColumnResized(params) {

            params.api.resetRowHeights();
          },
          onGridReady: (params) => {
            this['gridApi' + 'billDetailgf'] = params.api
            this.data.billDetailgf.forEach(function (data, index) {
              data.id = index;
            });
            // params.api.setRowData(this.data.billDetailsfwf);
            // params.api.sizeColumnsToFit();
          },
          singleClickEdit: true,
          // onCellEditingStarted: function (event) {
          //   console.log('cellEditingStarted');
          // },
          onCellEditingStarted(event) {
            that.preValue = event.value
          },
          // getRowHeight(params){
          //   if(params.data.description){
          //     return (params.api.getSizesForCurrentTheme().rowHeight * Math.floor(params.data.description.length / 50))
          //   }else {
          //     return 28
          //   }
          //  // return (params.api.getSizesForCurrentTheme().rowHeight * Math.floor(params.data.description.length / 50))
          // },
          onCellValueChanged(event) {
          },
          onCellEditingStopped: (event) => {
            if (that.preValue === event.value) {
              return;
            }
            const numCols = [
              {value: 'number', label: '数量'},
              {value: 'localprice', label: '本币单价'},
              {value: 'localsum', label: '本币金额'},
              {value: 'foreignprice', label: '外币单价'},
              {value: 'foreignsum', label: '外币金额'}]
            if (numCols.find(item => item.value == event.colDef.field) && isNaN(event.value.replace(/,/g, ''))) {
              this.checkNum = true
              event.value = that.preValue
              this.$message.error(`官费中的${numCols.find(item => item.value == event.colDef.field).label}必须为数字`)
              if (this.isSaveBill) {
                this.messageList.push({
                  model: '官费',
                  idx: event.rowIndex + 1,
                  label: numCols.find(item => item.value == event.colDef.field).label
                })
              }
              event.api.refreshCells()
            }
            // this['gridApi'+'billDetailgf'].resetRowHeights();
            this.resetRowHeights('billDetailgf')
            this.changeRowgf(event)
          },
        },
        columnDefs2: [],
        gridOptions3: {
          onColumnResized(params) {

            params.api.resetRowHeights();
          },
          onGridReady: (params) => {
            this['gridApi' + 'billDetailzf'] = params.api
            this.data.billDetailzf.forEach(function (data, index) {
              data.id = index;
            });
            // params.api.setRowData(this.data.billDetailsfwf);
            // params.api.sizeColumnsToFit();
          },
          singleClickEdit: true,
          // onCellEditingStarted: function (event) {
          //   console.log('cellEditingStarted');
          // },
          onCellEditingStarted(event) {
            that.preValue = event.value
          },
          // getRowHeight(params){
          //   if(params.data.description){
          //     return (params.api.getSizesForCurrentTheme().rowHeight * Math.floor(params.data.description.length / 50))
          //   }else {
          //     return 28
          //   }
          //  // return (params.api.getSizesForCurrentTheme().rowHeight * Math.floor(params.data.description.length / 50))
          // },
          onCellValueChanged(event) {
            console.log(event);
          },
          onCellEditingStopped: (event) => {
            if (that.preValue === event.value) {
              return;
            }
            const numCols = [
              {value: 'number', label: '数量'},
              {value: 'localsum', label: '本币金额'},
              {value: 'foreignsum', label: '外币金额'}]
            if (numCols.find(item => item.value == event.colDef.field) && isNaN(event.value.replace(/,/g, ''))) {
              this.checkNum = true
              event.value = that.preValue
              this.$message.error(`杂费中的${numCols.find(item => item.value == event.colDef.field).label}必须为数字`)
              if (this.isSaveBill) {
                this.messageList.push({
                  model: '杂费',
                  idx: event.rowIndex + 1,
                  label: numCols.find(item => item.value == event.colDef.field).label
                })
              }
              event.api.refreshCells()
            }
            this.resetRowHeights('billDetailzf')
            // this['gridApi'+'billDetailzf'].resetRowHeights();
            this.changeRowFzf(event)
          },
        },
        columnDefs3: [],
        gridApibillDetailsfwf: '',
        gridApibillDetailgf: '',
        gridApibillDetailzf: '',
        backData:{},
        nullValueList:[],
        isUsAgency: false
      }
    },

    watch: {
      data: {
        handler(n, o) {
          if (n.caseArray&&n.caseArray.find(item => item.usAgency)) {
            this.isUsAgency = true
            // 49 美国案件的账户
            this.$set(this.data, 'payAccountId', 49)
            this.yhSelectchange(this.data.payAccountId)
          } else {
            this.isUsAgency = false
          }
          let nullValueList = []
          if (n) {
            for (var key in n) {
              if (Object.prototype.toString.call(n[key]) == '[object Array]') {
                if (this.backData[key]&&this.backData[key].length && !(n[key]&&n[key].length)) {
                  nullValueList.push(key)
                }
              } else {
                if (!n[key] && n[key] !== 0 && this.backData[key] ) {
                  nullValueList.push(key)
                }
              }
            }
            this.nullValueList = nullValueList
          }
        },
        deep: true
      },
      // "data.discount"(n) {
      //   this.data.billDetailsfwf.map(item => {
      //     item.discount = n;
      //     return item;
      //   });
      // },
      typeTreeList: {
        handler(val) {
          if (this.data.billStyle) {
            this.billTypeIds = this.$commonUtils.getTwoDimensionalArray(val,'id', this.data.billStyle )
          }
        },
        deep: true
      },
      activeName(n) {
        if (n == 'first') {
          setTimeout(() => {
            this.computedBill()
          })
        }
      },
      'data.exchangeRate'(n) {
        this.computedBill()
        // this.data.billDetailsfwf.forEach(item=>{
        //   if (n) {
        //     item.foreignprice = this.fomatFloat(item.localprice / (this.data.exchangeRate * 0.01));
        //     item.foreignsum = this.fomatFloat((item.number * item.localprice) / (this.data.exchangeRate * 0.01));
        //     item.foreignPriceDiscount=this.fomatFloat(item.foreignprice*item.discount * 0.01)
        //     item.foreignSumDiscount=this.fomatFloat(item.foreignsum*item.discount * 0.01)
        //   }
        //   // item.foreignprice = this.fomatFloat(item.localprice / (this.data.exchangeRate * 0.01));
        // })
        // this.data.billDetailgf.forEach(item=>{
        //   if (n) {
        //     item.foreignprice = this.fomatFloat(item.localprice / (this.data.exchangeRate * 0.01));
        //     item.foreignsum = this.fomatFloat((item.number * item.localprice) / (this.data.exchangeRate * 0.01));
        //   }
        // })
        // this.data.billDetailzf.forEach(item=>{
        //   if (n) {
        //     // item.foreignprice = this.fomatFloat(item.localprice / (this.data.exchangeRate * 0.01));
        //     item.foreignsum = this.fomatFloat(item.localsum  / (this.data.exchangeRate * 0.01));
        //   }
        // })
      },
      dialogVisibleTt(n) {
        if (!n) {
          this.getBilldetail();
        }
      },
      // "data.custContactId"(n) {
      //   if (this.selectData.lxrData.find(ite => ite.custContactId == n)) {
      //     this.data.billEmail = this.selectData.lxrData.find(
      //       ite => ite.custContactId == n
      //     ).email;
      //     if(this.selectData.lxrData.find(ite => ite.custContactId == this.data.custContactId).billAddr&&this.selectData.lxrData.find(ite => ite.custContactId == this.data.custContactId).billAddr.length){
      //       let data=this.selectData.lxrData.find(ite => ite.custContactId == this.data.custContactId).billAddr
      //       this.selectData.dzData = JSON.parse(JSON.stringify(data))
      //       this.selectData.dzData.forEach(item => {
      //         item.value = item.addressCn
      //       })
      //       this.selectData.titleData = JSON.parse(JSON.stringify(data))
      //       this.selectData.titleData.forEach(item => {
      //         item.value = item.title
      //       })
      //       this.selectData.addressMailData = JSON.parse(JSON.stringify(data))
      //       this.selectData.addressMailData.forEach(item => {
      //         item.value = item.addressMail
      //       })
      //       this.data.billAddr= this.selectData.dzData[0].value
      //       this.data.title=this.selectData.titleData[0].value
      //       this.data.addressMail=this.selectData.addressMailData[0].value
      //
      //     }
      //   }
      //   // if (n) {
      //   //   queryCustomerAddrListUrl({
      //   //     custId: this.data.custId,
      //   //     isBillAdd: "1"
      //   //   }).then(res => {
      //   //     this.selectData.dzData = res.data;
      //   //   });
      //   // }
      // },

      // "data.custContactIdArray":{
      //   handler(n,o){
      //     this.data.billEmail = this.selectData.lxrData.filter(item=>n.includes(item.custContactId)).filter(item=>!!item.email).map(item=>item.email).join(';')
      //     let data= this.$commonUtils.getLanglist(this.selectData.lxrData.filter(item=>n.includes(item.custContactId)).map(item=>item.billAddr))
      //     this.selectData.dzData = JSON.parse(JSON.stringify(data)).filter(item=>!!item.addressCn).filter(item=>!!item.addressCn)
      //     this.selectData.dzData.forEach(item => {
      //       item.value = item.addressCn
      //     })
      //     this.selectData.titleData = JSON.parse(JSON.stringify(data)).filter(item=>!!item.title).filter(item=>!!item.title)
      //     this.selectData.titleData.forEach(item => {
      //       item.value = item.title
      //     })
      //     this.selectData.addressMailData = JSON.parse(JSON.stringify(data)).filter(item=>!!item.addressMail).filter(item=>!!item.addressMail)
      //     this.selectData.addressMailData.forEach(item => {
      //       item.value = item.addressMail
      //     })
      //     if (this.selectData.dzData.length) {
      //       this.data.billAddr = this.selectData.dzData[0].value
      //       this.data.title = this.selectData.titleData[0].value
      //       this.data.addressMail = this.selectData.addressMailData[0].value
      //     }
      //       // if (this.selectData.lxrData.find(ite => ite.custContactId == n)) {
      //       //   this.data.billEmail = this.selectData.lxrData.find(
      //       //     ite => ite.custContactId == n
      //       //   ).email;
      //       //   if(this.selectData.lxrData.find(ite => ite.custContactId == this.data.custContactId).billAddr&&this.selectData.lxrData.find(ite => ite.custContactId == this.data.custContactId).billAddr.length){
      //       //     let data=this.selectData.lxrData.find(ite => ite.custContactId == this.data.custContactId).billAddr
      //       //     this.selectData.dzData = JSON.parse(JSON.stringify(data))
      //       //     this.selectData.dzData.forEach(item => {
      //       //       item.value = item.addressCn
      //       //     })
      //       //     this.selectData.titleData = JSON.parse(JSON.stringify(data))
      //       //     this.selectData.titleData.forEach(item => {
      //       //       item.value = item.title
      //       //     })
      //       //     this.selectData.addressMailData = JSON.parse(JSON.stringify(data))
      //       //     this.selectData.addressMailData.forEach(item => {
      //       //       item.value = item.addressMail
      //       //     })
      //       //     this.data.billAddr= this.selectData.dzData[0].value
      //       //     this.data.title=this.selectData.titleData[0].value
      //       //     this.data.addressMail=this.selectData.addressMailData[0].value
      //       //
      //       //   }
      //       // }
      //   },
      //   deep:true
      // },
      conunt_cb: function (val, oldval) {
        // this.data.actualCost = val;
      },
      can_fp: function (val, oldval) {
        this.data.allocationMoney = val;
        this.initfptable();
      },
      fwDatevalue: function (val) {
        this.data.startDate = val[0];
        this.data.endDate = val[1];
      },
      'data.billStyle'(n){
        n&&this.data.billId&&this.queryAgentUser(this.data.billStyle,this.data.billId)
      }
    },

    methods: {
      caseDescBlur() {
        this.caseDescShow = false
        let html = this.data.caseDesc.replace(/\n/g, ' <br />')
        checkBillDescWord({sentence: this.data.caseDesc || ''}).then(res => {

          res.data && res.data.forEach(item => {
            const reg = new RegExp(item, 'g')

            html = html.split(' ').map(i => {
              // if (i === '') return `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">&nbsp</span>`
              if (i.includes('-')) {
                return i.split('-').map(j => {
                  if (j.replace(/[^a-zA-Z]/g, '') == item) return j.replace(reg, `<span class="error-text" style="font-size: 13px;text-decoration: underline wavy red">${item}</span>`)
                  return j
                }).join('-')
              }
              if (i.replace(/[^a-zA-Z]/g, '') == item) return i.replace(reg, `<span class="error-text" style="font-size: 13px;text-decoration: underline wavy red">${item}</span>`)
              return i
            }).join(' ')
          })
          // console.log(html)
          this.caseDescHtml = html.replace(/(^|\s+)([\w'-]+)(?=\s+\2(\b|$))/gi,
            (match, space, word) => {
              return space + `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">${word}</span>`;
            }
          ).split(' ').map(i => {
            if (i === '') return `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">&nbsp</span>`
            return i
          }).join(' ')
        })
      },
      queryBillTypeTree(){
        queryClassTree({classId:1185}).then(res=>{
          const list = res.data[1185] || []
          const formatData = list.map((item)=>{
            return {
              typeName:item.typeName,
              id:item.id,
              childrens:item.childrens
            }
          })
          this.typeTreeList = formatData
        })
      },
      caseDescClick() {
        this.caseDescShow = true;
        this.$nextTick(() => {
          this.$refs.caseDescRef.focus()
          this.$refs.caseDescRef.focused = true
        })
      },
      changeDate(n) {
        queryCurrencyUrl({
          month: n
        }).then(res => {
          this.selectData.bzData = res.data;
          (this.data.curId || this.data.curId === 0) && this.bzchange(this.data.curId)
        })
      },
      getRowHeight(){
       if(!this.gridFontSizeBig){
        [...document.getElementById('createPost-container').getElementsByClassName('ag-center-cols-container')].forEach(item => {
          [...item.getElementsByClassName('ag-cell')].forEach(it=> {
            it.style.fontSize = '12px'
            it.style.lineHeight = '20px'
          })
        });
      }else{
        [...document.getElementById('createPost-container').getElementsByClassName('ag-center-cols-container')].forEach(item => {
          [...item.getElementsByClassName('ag-cell')].forEach(it=> {
            it.style.fontSize = '14px'
            it.style.lineHeight = '28px'
          })
        });
      };
      return this.rowHeight
    },
      chanageGridSize(){
        this.gridFontSizeBig = !this.gridFontSizeBig
        if(!this.gridFontSizeBig){
          this.rowHeight = 20;
        }else{
          this.rowHeight = 28;
        }
        this.resetRowHeights('billDetailsfwf')
        this.resetRowHeights('billDetailgf')
        this.resetRowHeights('billDetailzf')
        // this['gridApibillDetailsfwf'].forEachNode(rowNode => {
        //   rowNode.setRowHeight(this.rowHeight)
        // });
        // this['gridApibillDetailsfwf'].onRowHeightChanged()
        // this.getRowHeight()
      },
      async changeAgentUser(userId){
        if(!userId)return ;
        let res = await queryWkgId({userId})
        res.data.wkgId&&(this.data.wkgId = res.data.wkgId);
      },
      queryAgentUser(billStyle,billId){
        queryAgentUser({billStyle,billId}).then(res=>{
          this.data.agentUser = this.data.agentUser ? this.data.agentUser : res.data.agentUser
          this.data.agentUserName = this.data.agentUserName ? this.data.agentUserName : res.data.agentUserName
        })
      },
      billTypeEvent(v){
        v.billStyle && this.type == 'creat' && (this.data.billStyle = v.billStyle)
        // v.billStyleName&&(this.data.billStyleName = v.billStyleName)

      },
      fullScreen(type) {
        // this.fullScreenBox = type
        this.fullScreenBox = true
      },
      getHeight(type) {
        if (this.fullScreenBox) {
          return document.documentElement.clientHeight - 70 + 'px'
        }
        if (type == 'billDetailsfwf') {
          return '600px'
          // return 'auto'
        } else {
          return '200px'
        }
        // if(type=='billDetailgf'){
        //   return '200px'
        // }
        // if(type=='billDetailgf'){
        //   return '200px'
        // }

      },
      getSum(list, type, float) {
        if (float) {
          return list.map(item => item[type]).filter(item => !!item).reduce((x, y) => Number(x) + Number(y), 0)
        } else {
          return this.floatFomat(list.map(item => item[type]).filter(item => !!item).reduce((x, y) => Number(x) + Number(y), 0))
        }

      },
      refreshEvenRowsCurrencyData(params, type) {
        if (!params.columnApi.columnController.groupAutoColumns) {
          params.api.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          });
        }
        if (params.type == "sortChanged") {
          let arr = params.api.rowModel.rootNode.childrenAfterSort.map(item => item.data)
          this.data[type] = this.data[type].filter(item => !arr.includes(item))
          this.data[type] = [...arr, ...this.data[type]]
        }
        // this['gridApi'+type].setRowData(arr);
        // this['gridApi'+type].clearFocusedCell();
        // console.log();
      },
      regPrice(event, list, index){
        const fieldList = ['localprice', 'localsum', 'localSumDiscount', 'foreignsum', 'foreignprice', 'foreignPriceDiscount', 'foreignSumDiscount']
        if(fieldList.includes(event.colDef.field)){
          event.value = Number(String(event.value).replace(/,/g, ''))
          list[index][event.colDef.field] = event.value;
        }
      },
      changeRowFwf(event, preValue) {
        let index = this.data.billDetailsfwf.findIndex(item => item == event.data)
        this.regPrice(event, this.data.billDetailsfwf, index)

        // if(event.colDef.field=='enddate'){
        //   // alert(event.value)
        //   this.data.billDetailsfwf[index].enddate = event.value
        // }
        if (event.rowPinned == 'bottom') {
          return
        }
        if (event.colDef.field == 'userid') {
          this.ygchangeselect(event.value, event.data, index)
        }
        if (event.colDef.field == 'roleid') {
          if (event.data.manhourPrice) {
            this.setManhourPrice(event.data.manhourPrice, index)
          }
        }
        if (event.colDef.field == 'description') {
          if (event.data.localprice) {
            this.djchange(event.data.localprice, event.data, index)
          }
        }
        if (event.colDef.field == 'number') {
          this.numberchange(event.value, event.data, index)
        }
        if (event.colDef.field == 'localprice') {
          this.djchange(event.value, event.data, index)
        }
        if (event.colDef.field == 'localsum') {
          this.bbchange(event.value, event.data, index)
        }
        if (event.colDef.field == 'discount') {
          this.zkchange(event.value, event.data, index, preValue)
        }
        if (event.colDef.field == 'localSumDiscount') {
          this.bbzkchange(event.value, event.data, index)
        }
        if (event.colDef.field == 'foreignsum') {
          this.wbjechange(event.value, event.data, index)
        }
        if (event.colDef.field == 'foreignprice') {
          this.wbdjchange(event.value, event.data, index)
        }
        if (event.colDef.field == 'foreignPriceDiscount') {
          this.wbdjzkhchange(event.value, event.data, index)
        }
        if (event.colDef.field == 'foreignSumDiscount') {
          this.wbjezkhchange(event.value, event.data, index)
        }
        event.api.refreshCells()
      },
      changeRowgf(event) {
        let index = this.data.billDetailgf.findIndex(item => item == event.data)
        this.regPrice(event, this.data.billDetailgf, index)
        if (event.rowPinned == 'bottom') {
          return
        }
        if (event.colDef.field == 'description') {
          if (event.data.localprice) {
            this.djchangezf(event.data.localprice, event.data, index)
          }
        }
        if (event.colDef.field == 'number') {
          this.numberchangezf(event.value, event.data, index)
        }
        if (event.colDef.field == 'localprice') {
          this.djchangezf(event.value, event.data, index)
        }
        if (event.colDef.field == 'localsum') {
          this.bbchangegf(event.value, event.data, index)
        }
        if (event.colDef.field == 'foreignprice') {
          this.wbdjchangegf(event.value, event.data, index)
        }
        if (event.colDef.field == 'foreignsum') {
          this.wbjechangegf(event.value, event.data, index)
        }
        event.api.refreshCells()
      },
      changeRowFzf(event) {
        let index = this.data.billDetailzf.findIndex(item => item == event.data)
        this.regPrice(event, this.data.billDetailzf, index)
        if (event.rowPinned == 'bottom') {
          return
        }
        if (event.colDef.field == 'description') {
          if (event.data.localprice) {
            this.djchangezff(event.data.localprice, event.data, index)
          }
        }
        if (event.colDef.field == 'localsum') {
          this.bbchangezf(event.value, event.data, index)
        }
        if (event.colDef.field == 'foreignsum') {
          this.wbjechangezf(event.value, event.data, index)
        }
        event.api.refreshCells()
      },
      cellRenderer(params) {
        this.getRowHeight()
        if (params.node.rowPinned == 'bottom') {
          return `<span style="position: absolute;top: -2px" title="${params.value}">${params.value ? params.value : ''}</span>`
        }
        if (params.colDef.field == 'userid') {
          return params.data.useridString
        }
        if (params.colDef.field == 'roleid') {
          return params.data.roleidString
        }
        if (params.colDef.field == 'sid') {
          return params.rowIndex + 1// params.data.no//params.rowIndex+1
        }
        if (params.colDef.field == 'description') {
          return this.getSpecialInfo(params.data.htmlCode, params.value)
        }

        if (['localprice', 'localsum', 'localSumDiscount', 'foreignprice', 'foreignPriceDiscount', 'foreignsum', 'foreignSumDiscount'].includes(params.colDef.field)) {
          return this.floatFomat(params.value)
        }
        return `<span title="${params.value}">${params.value || params.value === 0 ? params.value : ''}</span>`
      },
      getUploadData(caseIds) {
        const data = {
          tokenID: this.$store.getters.token,
          caseIdArray: caseIds,
          materialTypeId: 300039,
          type: 4,
          objType: 3,
          objInstId: this.billData.billId
        }
        return data
      },
      doEditInOffice(url, materialId) {
        if (getProgID(url)) {
          recordOnlienEdit({materialId})
          doEditInOffice(url, getProgID(url))
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
          // window.open(`#/preView?address=ipdoc${url}`.replace(/[+]/g,'%2B'))
        } else {
          this.$commonUtils.downLoadAll({url: `ipdoc${url}`})
        }
      },
      brforeRemoveFile(file, fileList) {
        let delmaterialId;
        if (file.response) {
          delmaterialId = file.response.data[0].materialId;
        } else {
          delmaterialId = file.materialId;
        }
        delCaseMaterialUrl({
          caseIdArray: this.data.caseArray.map(item => item.caseId),
          materialId: delmaterialId
        }).then(res => {
          this.materialList = this.materialList.filter(
            item => item.materialId != delmaterialId
          );
          // this.message.success(res.message);
        });
      },
      handlepreviewDoc(event) {
        if (event.target.className === 'el-upload-list__item-name') {
          let row = this.$refs.uploadFile.uploadFiles.find(item => item.name == event.target.innerText)
          const that = this
          this.$ContextMenu({
            event, // 传入鼠标事件
            menu: [{action: 'preView', name: '查看pdf'}]
          }).then(rs => {
            if (rs) {
              if (row.url) {
                this[rs](row)
              } else {
                this[rs](row.response.data[0])
              }
            }
          });
        }
      },
      // previewDoc(file){
      //
      //   if(file.raw){
      //     if(file.response){
      //       this.doEditInOffice(file.response.data[0].address)
      //       // this.$commonUtils.downLoadAll({url:'ipdoc'+file.response.data.address})
      //     }
      //   } else {
      //     this.doEditInOffice(file.address)
      //   }
      // },
      async previewDoc(file) {
        let res = await checkPermission({billId: file.objInstId})
        if (res.data.modify == 0) {
          this.preView(file)
        } else {
          if (file.raw && file.response) {
            // 修改账单文档权限限制
            this.doEditInOffice(file.response.data[0].address, file.response.data[0].materialId)
            // this.$commonUtils.downLoadAll({url:'ipdoc'+file.response.data.address})
          } else {
            this.doEditInOffice(file.address, file.materialId)
          }
        }
      },
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
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))

        } else {
          this.$commonUtils.downLoadAll({url: `ipdoc${url}`})
        }
      },
      down(url) {
        this.$commonUtils.downLoadAll({url: `ipdoc${url}`})
      },
      viewPdf(url) {
        viewPdf({address: `${url}`}).then(res => {
          window.open(`ipdoc${res.data.pdfAddress}`.replace(/[+]/g, '%2B'))
        })
      },
      rowDragEnd(event, type) {
        // var movingNode = event.node;
        // var overNode = event.overNode;
        // var rowNeedsToMove = movingNode !== overNode;
        // if (rowNeedsToMove) {
        //   var movingData = movingNode.data;
        //   var overData = overNode.data;
        //   var fromIndex = this.data[type].indexOf(movingData);
        //   var toIndex = this.data[type].indexOf(overData);
        //   var newStore = this.data[type].slice();
        //   moveInArray(newStore, fromIndex, toIndex);
        //   this.data[type] = newStore;
        //   this['gridApi' + type].setRowData(newStore);
        //   this['gridApi' + type].clearFocusedCell();
        //   // this.refreshEvenRowsCurrencyData(newStore, type)
        // }
        var movingData = event.node.data
        var fromIndex = this.data[type].indexOf(movingData);
        var toIndex = event.overIndex
        if(fromIndex !== toIndex){
          var newStore = this.data[type].slice();
          moveInArray(newStore, fromIndex, toIndex);
          this.data[type] = newStore;
          this['gridApi' + type].setRowData(newStore);
          this['gridApi' + type].clearFocusedCell();
        }

        function moveInArray(arr, fromIndex, toIndex) {
          var element = arr[fromIndex];
          arr.splice(fromIndex, 1);
          arr.splice(toIndex, 0, element);
        }
      },
      getContextMenuItems(params, type) {
        return [{
          name: '复制',
          action: () => {
            this.$copyText(params.value).then(
              res => {
              })
          }
        },
          {
            name: '往上插入',
            action: () => {
              this.addfwf(type, 'upInsert', this.data[type].indexOf(params.node.data))
            }
          },
          {
            name: '向下插入',
            action: () => {
              this.addfwf(type, 'downInsert', this.data[type].indexOf(params.node.data))
            }
          },
          {
            name: '删除',
            action: () => {
              this.data[type].splice(this.data[type].indexOf(params.node.data), 1)
            }
          }]
      },
      dragStopped(params, type) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field,
        })).filter(item => item.prop != "group")
        this.saveLocation(type, tableHeader)
        // var arr=JSON.parse(localStorage.getItem('tableHeader'))
        // arr.find(item=>item.name==type).tableHeader=tableHeader
        // localStorage.setItem('tableHeader',JSON.stringify(arr))
      },
      saveLocation(type, tableHeader) {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({name: type, tableHeader: tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == type)) {
            arr.find(item => item.name == type).tableHeader = tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({name: type, tableHeader: tableHeader})
          }
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        }
      },
      changeCustContactIdArray(n) {
        this.data.billEmail = this.selectData.lxrData.filter(item => n.includes(item.custContactId)).filter(item => !!item.email).map(item => item.email).join(';')
        let data = this.$commonUtils.getLanglist(this.selectData.lxrData.filter(item => n.includes(item.custContactId)).map(item => item.billAddr))
        this.selectData.dzData = JSON.parse(JSON.stringify(data)).filter(item => !!item.addressCn).filter(item => !!item.addressCn)
        this.selectData.dzData.forEach(item => {
          item.value = item.addressCn
        })
        this.selectData.titleData = JSON.parse(JSON.stringify(data)).filter(item => !!item.title).filter(item => !!item.title)
        this.selectData.titleData.forEach(item => {
          item.value = item.title
        })
        this.selectData.addressMailData = JSON.parse(JSON.stringify(data)).filter(item => !!item.addressMail).filter(item => !!item.addressMail)
        this.selectData.addressMailData.forEach(item => {
          item.value = item.addressMail
        })
        if (this.selectData.dzData.length && this.selectData.dzData.length == 1) {
          this.data.billAddr = this.selectData.dzData[0].value
          this.data.title = this.selectData.titleData[0].value
          this.data.addressMail = this.selectData.addressMailData[0].value
        } else {
          this.data.billAddr = ''
          this.data.title = ''
          this.data.addressMail = ''
        }
      },
      handleTitleSelect(item) {
        this.data.billAddr = item.addressCn
        this.data.addressMail = item.addressMail
      },
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
      selectCustChange(e) {
        if (!e) {
          return
        }
        this.data.custContactIdArray = []
        queryCustomerContactByCustIdUrl1({customerId: this.data.custId}).then(
          res => {
            res.data.forEach(item => item.value = item.name)
            this.selectData.lxrData = res.data;
            // if(this.selectData.lxrData.find(ite => ite.custContactId == this.data.custContactId)){
            //   let data=this.selectData.lxrData.find(ite => ite.custContactId == this.data.custContactId).billAddr
            //   this.selectData.dzData =JSON.parse(JSON.stringify(data))
            //   this.selectData.dzData.forEach(item => {
            //     item.value = item.addressCn
            //   })
            //   this.selectData.titleData = JSON.parse(JSON.stringify(data))
            //   this.selectData.titleData.forEach(item => {
            //     item.value = item.title
            //   })
            //   this.selectData.addressMailData =JSON.parse(JSON.stringify(data))
            //   this.selectData.addressMailData.forEach(item => {
            //     item.value = item.addressMail
            //   })
            // }
            let data = this.$commonUtils.getLanglist(this.selectData.lxrData.filter(item => this.data.custContactIdArray.includes(item.custContactId)).map(item => item.billAddr))
            this.selectData.dzData = JSON.parse(JSON.stringify(data))
            this.selectData.dzData.forEach(item => {
              item.value = item.addressCn
            })
            this.selectData.titleData = JSON.parse(JSON.stringify(data))
            this.selectData.titleData.forEach(item => {
              item.value = item.title
            })
            this.selectData.addressMailData = JSON.parse(JSON.stringify(data))
            this.selectData.addressMailData.forEach(item => {
              item.value = item.addressMail
            })
          }
        );
        // queryCustomerContactByCustIdUrl({
        //   caseTypeId: this.caseDetailFoemData.caseTypeId,
        //   custId: this.caseDetailFoemData.custId
        // })
        //   .then(response => {
        //     // this.selectData.country = response.data;
        //     this.selectData.customerContacts = response.data.customerContacts;
        //     this.selectData.billContacts = response.data.BillContacts;
        //   })
        //   .catch(err => {
        //     console.log(err);
        //   });
      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价';
            return;
          }
          const values = data.map(item => {
            if (column.property == 'discount') {
              return Number('ddd')
            }
            return Number(item[column.property])
          });
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            // sums[index]=0
          } else {
            sums[index] = 'N/A';
          }
        });
        return sums.map(item => {
          if (typeof item == 'number') {
            return this.fomatFloat(item)
          } else {
            return item
          }
        })

      },
      changeRole(e, index) {
        let data = this.allRoles.find(item => item.roleId == e)
        if (data) {
          this.$set(this.data.billDetailsfwf[index], 'roleidString', data.name)
        }
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      intValidator(value) {
        value = value.replace(/\D+/, "");
        if (value.length > 0) {
          if (value.length > 1 && value[0] == 0) {
            this.data.discount = value.substring(1, value.length);
            return;
          }
          this.data.discount = value;
        } else {
          this.data.discount = null;
        }
      },
      queryAllRoles() {
        queryAllRoles({agencyId: 1}).then(res => {
          this.allRoles = res.data
          this.$store.commit('caseInformation/SET_ROLELIST', this.allRoles)

        })
      },
      queryBillTaskRecord() {
        queryBillTaskRecord({id: this.billData.billId, typeId: 8}).then(res => {
          this.progressData = res.data
        })
      },
      arrowClick() {
        if (!this.custFlag) {
          this.custFlag = true
          localStorage.setItem('custFlag', 1)
        } else {
          this.custFlag = false
          localStorage.setItem('custFlag', 0)
        }
      },

      checkWkgIsGj(e, flag) { // flag第一次页面初始化不checkWkg
        let data = this.selectData.gzzs.find(item => item.wkgId == e)
        if (data) {
          this.data.deptId = data.deptId
        } else {
          this.data.deptId = null
        }
        checkWkgIsGj({wkgId: e}).then(res => {
          this.isGj = res.data.isGj
        })
        if (this.createCommonBill && !flag) {
          checkWkg({wkgId: e, billIdList: this.billData.billIdList}).then(res => {

          }).catch(err => {
            this.$confirm(`${err.message}, 是否清除账单分配比例？`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              // distinguishCancelAndClose: true,
              type: "warning"
            }).then(() => {
              deleteBillAllocation({billIdList: this.billData.billIdList}).then(res => {
                this.$message.success('清除成功!')
              }).catch(() => {
                this.$message.error('清除失败!')
                this.$set(this.data, 'wkgId', '')
              })
            }).catch(() => {
              this.$set(this.data, 'wkgId', '')
            })
          })
        }
      },
      dblclick(type, index) {
        this.textareaState = true
        this.textarea = this.data[type][index].description
        this.editData = {
          type,
          index
        }
        this['gridApi' + type].clearFocusedCell();
      },
      openEditDialog(data, index) {
        this.textareaState = true
        this.textarea = data.memo
        this.editData = {
          type: 'el-table',
          index
        }
      },
      handleClose(done) {
        let html = this.textarea.replace(/\n/g, ' <br />')
        checkBillDescWord({sentence: this.textarea || ''}).then(res => {
          res.data && res.data.forEach(item => {
            const reg = new RegExp(item, 'g')
            html = html.split(' ').map(i => {
              if (i.includes('-')) {
                return i.split('-').map(j => {
                  if (j.replace(/[^a-zA-Z]/g, '') == item) return j.replace(reg, `<span class="error-text" style="font-size: 13px;text-decoration: underline wavy red">${item}</span>`)
                  return j
                }).join('-')
              }
              // if (i === '') return `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">&nbsp</span>`
              if (i.replace(/[^a-zA-Z]/g, '') == item) return i.replace(reg, `<span class="error-text" style="font-size: 13px;text-decoration: underline wavy red">${item}</span>`)
              return i
            }).join(' ')
          })
          this.textareaState = false
          if (this.editData && this.editData.type === 'el-table') {
            this.$set(this.data.billAllocations[this.editData.index], 'memo', this.textarea)
            // this.data.billAllocations[this.editData.index].memo = this.textarea
            // done()
            return;
          }
          this.$set(this.data[this.editData.type][this.editData.index], 'description', this.textarea)
          this.$set(this.data[this.editData.type][this.editData.index], 'htmlCode', html.replace(/(^|\s+)([\w'-]+)(?=\s+\2(\b|$))/gi,
            (match, space, word) => {
              return space + `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">${word}</span>`;
            }
          ).split(' ').map(i => {
            if (i === '') return `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">&nbsp</span>`
            return i
          }).join(' '))
          // this.data[this.editData.type][this.editData.index].description = this.textarea
          // console.log(this.data[this.editData.type][this.editData.index].description);
          // console.log(this.editData);
          // this.gridApi.forEachNode(rowNode => {
          //   rowNode.setDataValue(
          //     'description',
          //     this.data[this.editData.type][this.editData.index].description)
          // });
          // console.log(this.$refs['gridApi' + this.editData.type]);
          let top = this.$refs['gridApi' + this.editData.type].$el.querySelector('.ag-body-viewport').scrollTop
          this['gridApi' + this.editData.type].refreshCells()
          this['gridApi' + this.editData.type].resetRowHeights();
          this.$refs['gridApi' + this.editData.type].$el.querySelector('.ag-body-viewport').scrollTop = top
        })

        // done()
      },
      ChooseCaseClose(data) {
        this.changeCaseVisible = false
      },
      getList(list) {
        if (list.length) {
          this.data.caseArray = list
          this.data.custId = list[0].custId
          this.selectCustChange(this.data.custId)
          this.queryCustomerNameIdList = [{custId: list[0].custId, fullname: list[0].custName}]
          disposeAgentNum({agentNumberArray: list.map(item => item.agentNum)}).then(res => {
            this.data.showRefno = res.data
          })
          billDiscount({caseTypeId: list[0].caseTypeId, custId: list[0].custId}).then(res => {
            this.data.discount = res.data
            this.discountChange(this.data.discount)
          })
        }
      },
      takeCaseDetail(row) {
        if (row.caseArray && row.caseArray.length > 1) {
          this.selectCaseList = row.caseArray;
          this.selectCaseVisible = true;
        } else {
          window.open(`#/workbench/case/seeCaseDetail/${row.caseId}?taskType=${row.taskType}`)
          // this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId);
          // this.selectCaseVisible = false;
        }
      },
      querySearch(queryString, cb, type) {
        var restaurants = this.selectData[type];
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      // handleSelect(item){
      //   this.data.billEmail=item.email
      // },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      queryBillTemplate() {
        queryBillTemplateUrl().then(res => {
          this.bllTemplateList = res.data
        })
      },
      getSpecialInfo(html, string) {
        if (html) {
          return `<div title="${string}">${
            html.split('\n').map(item => `<p style="word-wrap: break-word;
    word-break: break-word;">${item}</p>`).join('')
          }</div>`
        } else {
          if (string) {
            return string.split('\n').map(item => `<p title="${item}" style="word-wrap: break-word;
    word-break: break-word;">${item}</p>`).join('')
          } else {
            return ''
          }
        }
      },
      async changeBill(data) {
        this.data.billSum = this.fomatFloat(Number(this.totalPrincipal_gf) + this.totalPrincipal_fw_zh + Number(this.totalPrincipal_zf));
        this.data.foreignSum = toFixed1((Number(this.totalPrincipal_gf) + this.totalPrincipal_fw_zh + Number(this.totalPrincipal_zf)) / (this.data.exchangeRate * 0.01))
        this.data.serviceCost = Number(this.totalPrincipal_fw);
        this.data.officialCost = Number(this.totalPrincipal_gf);
        this.data.otherCost = Number(this.totalPrincipal_zf);
        this.data.serviceCostDiscount = this.totalPrincipal_fw_zh;
        this.data.foreignSumDiscount = this.fomatFloat(this.totalPrincipal_fw_zh / (this.data.exchangeRate * 0.01));
        const type = this.$route.params && this.type;
        let reqData = JSON.parse(JSON.stringify(this.data));
        delete reqData.billCost;
        delete reqData.billRecords;
        delete reqData.wfStatus
        delete reqData.billNo;
        if (data == 'delete') {
          await this.$refs.writeOff.deleteBillInfo()
        }
        await updateBillUrl(reqData).then(async res => {
          if (data == 'writeOff') {
            await this.$refs.writeOff.writeOffBillRecordUrl()
            await this.$refs.writeOff.queryBillInfoByBillId()
          }
          this.getBilldetail()
        })
      },
      cancel(flag, allSearch) {
        this.$emit('cancel', this.data.billId, allSearch)
        // if (flag) {
        //   this.$emit('cancel', this.data.billId, allSearch)
        //   // this.$emit('changeGridData', this.data.billId)
        //   // this.$router.push({ name: "bill",params: { siveId: this.data.billId } });
        // } else {
        //   this.$emit('cancel', this.data.billId)
        // }
        // if(flag){
        //   if(this.data.billId){
        //     this.$store.commit('caseInformation/SET_PREONLYID',this.data.billId)
        //   }
        // }else {
        //   this.$store.commit('caseInformation/SET_PREONLYID','')
        // }
        // if(this.type==2){
        //
        //   this.$router.go(-1)
        // }else {
        //   this.$router.push('/workbench/finance/bill')
        // }
      },
      fomatFloat(number, n) {
        return +fomatFloat(number, 2)
      },
      async shfunc(style, failReasion) {
        this.data.nullValueList = this.nullValueList
        let dataList = [this.data.billDetailgf,this.data.billDetailsfwf,this.data.billDetailzf]
        let attrList = [this.preferenceList2,this.preferenceList,this.preferenceList3]
        this.handleSomeNullAttr(dataList,attrList)
        await this.handleNullFee()
        if (this.data.billAllocations) {
          let number_f = 0;
          this.data.billAllocations.forEach((item, index) => {
            number_f += Number(item.allomoney);
          });
          if (this.fomatFloat(Number(this.data.allocationMoney)) >= 0) {
            if (this.fomatFloat(number_f) > 0.1 + this.fomatFloat(Number(this.data.allocationMoney))) {
              this.$message.error(
                "您选择的比例金额已经超出可分配金额上限，请确认！"
              );
              return
            }
          } else {
            if (number_f >= 0) {

            } else {
              if (this.fomatFloat(number_f) < this.fomatFloat(Number(this.data.allocationMoney)) - 0.1) {
                this.$message.error(
                  "您选择的比例金额已经超出可分配金额上限，请确认！"
                );
                return
              }
            }

          }

        }
        ['billDetailgf', 'billDetailsfwf', 'billDetailzf'].forEach(item => {

          this.sortNo(item)
        })
        this.computedBill(true)
        await new Promise(resolve => {
          setTimeout(() => {
            resolve()
          })
        })
        if (this.checkNum) {
          const confirmText = this.messageList.map(item => `第${item.idx}条${item.model}中的【${item.label}】`)
          const newDatas = []
          const h = this.$createElement
          for (const i in confirmText) {
            newDatas.push(h('p', null, confirmText[i]))
          }
          newDatas.push(h('p', null, '以上数据格式有误并恢复至修改前，是否核查?'))
          if (
            await this.$confirm(
              '提示',
              {
                message: h('div', null, newDatas),
                confirmButtonText: '核查',
                cancelButtonText: '不核查',
                type: 'warning'
              }
            ).then(() => true).catch(() => false)
          ) return ;
        }
        if (this.flag) {
          this.$message.error('请勿重复点击')
          return
        }
        if (!this.getDiscountRule()) {
          return;
        }
        this.data.billSum = this.fomatFloat(Number(this.totalPrincipal_gf) + this.totalPrincipal_fw_zh + Number(this.totalPrincipal_zf));
        this.data.foreignSum = toFixed1((Number(this.totalPrincipal_gf) + this.totalPrincipal_fw_zh + Number(this.totalPrincipal_zf)) / (this.data.exchangeRate * 0.01))
        this.data.serviceCost = Number(this.totalPrincipal_fw);
        this.data.officialCost = Number(this.totalPrincipal_gf);
        this.data.otherCost = Number(this.totalPrincipal_zf);
        this.data.serviceCostDiscount = this.totalPrincipal_fw_zh;
        this.data.foreignSumDiscount = this.fomatFloat(this.totalPrincipal_fw_zh / (this.data.exchangeRate * 0.01));
        this.data.serviceCostDiscForeign = toFixed1(this.totalPrincipal_fw_zh_wb)
        this.data.otherCostForeign = toFixed1(this.totalPrincipal_zf_wb)
        const type = this.$route.params && this.type;
        this.$refs["postForm"].validate(valid => {
          if (valid) {
            let reqData = JSON.parse(JSON.stringify(this.data));
            delete reqData.billCost;
            delete reqData.billRecords;
            delete reqData.wfStatus
            delete reqData.billNo;
            this.flag = true
            updateBillUrl(reqData).then(res => {
              batchdoBillTaskUrl({
                taskIdList: this.billData.taskId,
                result: style,
                agree: style,
                failReasion
              }).then(response => {
                this.$message.success(response.message);
                this.flag = false
                this.cancel(1)
              }).catch((e) => {
                saveLog({
                  content: JSON.stringify({
                    billId: this.data.billId,
                    message: '审核报错' + e.message,
                    logType: 1
                  })
                }).then(res => {


                })
                this.flag = false
                this.cancel(1)
              });
              // this.$message.success(res.message);
              // this.$router.push({ name: "bill",params: { siveId: this.data.billId } });
            }).catch(() => {
              this.flag = false
            });
          } else {
            this.$message.error("请填写必填项");
            return false;
          }
        });

      },
      handleEnCheck(key) {
        const list = JSON.parse(JSON.stringify(this.data[key]))
        const reqList = []
        list.forEach(bill => {
          let html = bill.description
          reqList.push(() => checkBillDescWord({sentence: html || ''}).then(res => {
            res.data && res.data.forEach(item => {
              const reg = new RegExp(item, 'g')
              html = html.replace(/\n/g, ' <br />').split(' ').map(i => {
                if (i.includes('-')) {
                  return i.split('-').map(j => {
                    if (j.replace(/[^a-zA-Z]/g, '') == item) return j.replace(reg, `<span class="error-text" style="font-size: 13px;text-decoration: underline wavy red">${item}</span>`)
                    return j
                  }).join('-')
                }
                // if (i === '') return `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">&nbsp</span>`
                if (i.replace(/[^a-zA-Z]/g, '') == item) return i.replace(reg, `<span class="error-text" style="font-size: 13px;text-decoration: underline wavy red">${item}</span>`)
                return i
              }).join(' ')
            })

            bill.htmlCode = html.replace(/(^|\s+)([\w'-]+)(?=\s+\2(\b|$))/gi,
              (match, space, word) => {
                return space + `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">${word}</span>`;
              }
            ).split(' ').map(i => {
              if (i === '') return `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">&nbsp</span>`
              return i
            }).join(' ')
          }))
        })
        Promise.all(reqList.map(f => f())).then(res => {
          setTimeout(() => {
            this.data[key] = list
            console.log('=====')
            console.log(this.data[key])
            this['gridApi' + key].refreshCells()
          }, 100)
        })
      },
      getBilldetail() {
        const type = this.type //$route.params && this.type;
        // if (type === "creat") {
        //   this.$route.meta.title = "创建账单";
        // } else if (type === "edit") {
        //   this.$route.meta.title = "账单编辑";
        // } else {
        //   this.$route.meta.title = "查看账单";
        // }
        // if (this.billData.taskNo) {
        //   if (
        //     this.billData.taskNo != "1" &&
        //     this.billData.taskNo != "6"
        //   ) {
        //     this.$route.meta.title = "账单审核";
        //   } else {
        //     this.$route.meta.title = "账单编辑";
        //   }
        // }

        const id = this.billData.billId
        queryBillUrl({billId: id}).then(res => {
          // let billStyleName = this.data.billStyleName
          // let billStyle = this.data.billStyle
          this.data = res.data;

          this.data.billDetailsfwf && this.handleEnCheck('billDetailsfwf')
          this.data.billDetailgf && this.handleEnCheck('billDetailgf')
          this.data.billDetailzf && this.handleEnCheck('billDetailzf')

          this.caseDescBlur()
          queryCurrencyUrl({
            month: this.data.belongToDate
          }).then(res => {
            this.selectData.bzData = res.data;
          });
          // if(this.data.agentUser && !this.data.wkgId){
          //   this.changeAgentUser(this.data.agentUser)
          // }
          // billStyleName && (this.data.billStyleName = billStyleName)
          // billStyle && (this.data.billStyle = billStyle)
          if(this.data.taskType==4 ){
            this.queryBillTypeTree()
          }
          // if(res.data.billStyle){
          //   console.log(this.typeTreeList,'this.typeTreeList')
          //   this.billTypeIds = this.$commonUtils.getTwoDimensionalArray(this.typeTreeList,'id', res.data.billStyle )
          //   console.log(this.billTypeIds,'this.billTypeIds')
          // }

          // this.backData = JSON.parse(JSON.stringify(this.data))
          this.price = this.data.actualCost
          this.caseTypeIdString = this.data.caseTypeIdString
          if (this.data.billDetailgf) {
            this.gfprice = 0
            this.data.billDetailgf.forEach(item => {
              this.gfprice += this.fomatFloat(item.localsum);
            });
          }
          // delete this.data.caseTypeIdString
          this.materialList = JSON.parse(JSON.stringify(this.data.materialList))
          this.materialList.forEach(item => {
            item.name = item.materialName
            item.url = item.address
          })
          delete this.data.materialList
          if ([this.data.startDate, this.data.endDate].filter(item => !!item).length) {
            this.fwDatevalue = [this.data.startDate, this.data.endDate]
          }

          this.queryCustomerNameIdList = [{custId: Number(this.data.custId), fullname: this.data.custFullNameString}]
          let e;
          this.selectData.bzData.forEach(ele => {
            if (ele.curId === this.data.curId) {
              e = ele;
            }
          });
          if (e) {
            this.currencySymbol = e.charSign;
          }
          if (!this.data.belongToDate) {
            this.data.belongToDate = this.getNowFormatDate();
          }
          this.checkWkgIsGj(this.data.wkgId, true)
          if (type === "creat") {
            if (this.data.contactLanguage == 1616) {
              this.data.useEnAccount = 0
            } else {
              this.data.useEnAccount = 1
            }
            this.yhSelectchange(this.data.payAccountId)
          }
          if (this.data.contactLanguage == 1616) {
            this.$store.commit('caseInformation/CONTACT_LANGUAGE', 'CN')
          } else {
            this.$store.commit('caseInformation/CONTACT_LANGUAGE', 'EN')
          }
          if (this.data.billAllocations&&this.data.billAllocations.length && this.data.billAllocations.find(item=> item.allomoney&&!item.alloratio || !item.allomoney&&item.alloratio)) {
            this.initfptable();
          }
          // this.initfptable();

          queryCustomerContactByCustIdUrl1({customerId: this.data.custId}).then(
            res => {
              res.data.forEach(item => item.value = item.name)
              this.selectData.lxrData = res.data;
              // if(this.selectData.lxrData.find(ite => ite.custContactId == this.data.custContactId)){
              //   let data=this.selectData.lxrData.find(ite => ite.custContactId == this.data.custContactId).billAddr
              //   this.selectData.dzData =JSON.parse(JSON.stringify(data))
              //   this.selectData.dzData.forEach(item => {
              //     item.value = item.addressCn
              //   })
              //   this.selectData.titleData = JSON.parse(JSON.stringify(data))
              //   this.selectData.titleData.forEach(item => {
              //     item.value = item.title
              //   })
              //   this.selectData.addressMailData =JSON.parse(JSON.stringify(data))
              //   this.selectData.addressMailData.forEach(item => {
              //     item.value = item.addressMail
              //   })
              // }
              let data = this.$commonUtils.getLanglist(this.selectData.lxrData.filter(item => this.data.custContactIdArray.includes(item.custContactId)).map(item => item.billAddr))
              this.selectData.dzData = JSON.parse(JSON.stringify(data)).filter(item => !!item.addressCn)
              this.selectData.dzData.forEach(item => {
                item.value = item.addressCn
              })
              this.selectData.titleData = JSON.parse(JSON.stringify(data)).filter(item => !!item.title)
              this.selectData.titleData.forEach(item => {
                item.value = item.title
              })
              this.selectData.addressMailData = JSON.parse(JSON.stringify(data)).filter(item => !!item.addressMail)
              this.selectData.addressMailData.forEach(item => {
                item.value = item.addressMail
              })
            }
          );
          // queryCustomerAddrListUrl({
          //   custId: this.data.custId,
          //   isBillAdd: "1"
          // }).then(res => {
          //   this.selectData.dzData = res.data;
          //   this.selectData.dzData.forEach(item=>item.value=item.a)
          // });

          querywfUserNameUrl({userIdArray: this.data.billDetailsfwf.map(item => item.userid)}).then(res => {
            this.selectData.ygData = res.data
          });
          this.backData = JSON.parse(JSON.stringify(this.data))
          if (this.createCommonBill) {
            const initList = [
              'billAllocations',
              'payAccountId',
              'useEnAccount',
              'billStyle',
              'agentUser',
              'wkgId',
              'otherBillInfo',
              'curId',
              'exchangeRate',
              'custContactIdArray',
              'title',
              'discount',
              'billAddr',
              'billEmail',
              'addressMail',
              'belongToDate',
              'billDate',
              'remarks',
              'bankAccountName',
              'bankAccountAddress',
              'bankName',
              'bankAccount',
              'bankNo',
              'swiftCode'
            ]
            initList.forEach(key => {
              if (Array.isArray(this.data[key])) {
                this.$set(this.data, key, [])
              } else {
                this.$set(this.data, key, undefined)
              }
            })
          }
        });
      },
      getcolumnDefs(type) {
        var tableHeader = []
        if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == type)) {
          tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == type).tableHeader
        }
        if (type == 'billDetailsfwf') {
          if (tableHeader.length) {
            this.columnDefs = this.preferenceList.map(item => {
              item.width = tableHeader.find(i => i.prop == item.field).width
              return item
            })
          } else {
            this.columnDefs = this.preferenceList
          }
        }
        if (type == 'billDetailgf') {
          if (tableHeader.length) {
            this.columnDefs2 = this.preferenceList2.map(item => {
              item.width = tableHeader.find(i => i.prop == item.field).width
              return item
            })
          } else {
            this.columnDefs2 = this.preferenceList2
          }
          // console.log(this.columnDefs2,4444);
        }
        if (type == 'billDetailzf') {
          if (tableHeader.length) {
            this.columnDefs3 = this.preferenceList3.map(item => {
              item.width = tableHeader.find(i => i.prop == item.field).width
              return item
            })
          } else {
            this.columnDefs3 = this.preferenceList3
            // console.log(this.columnDefs3);
          }
        }
      },
      async getallSelectdata() {
        ['billDetailsfwf', 'billDetailgf', 'billDetailzf'].forEach(item => this.getcolumnDefs(item))
        let res = await queryPayAcountUrl()
        this.selectData.yhData = res.data;
        this.getBilldetail()

        queryZZWorkGroupUrl().then(res => {
          this.selectData.gzzs = res.data;
        });
      },
      remotepaternalUnitYg(query) {
        querywfUserNameUrl({fullname: query}).then(res => {
          this.selectData.ygData = res.data.slice(0, 100);
        });
      },
      yhSelectchange(id) {
        let e;
        this.selectData.yhData.forEach(ele => {
          if (ele.payAccountId === id) {
            e = ele;
          }
        });
        if (e) {
          if (this.data.useEnAccount == "1") {
            this.data.bankAccountAddress = e.bankAccountAddressEn;
            this.data.bankAccountName = e.bankAccountNameEn;
            this.data.bankName = e.bankNameEn;
          } else {
            this.data.bankAccountName = e.bankAccountName;
            this.data.bankAccountAddress = e.bankAccountAddress;
            this.data.bankName = e.bankName;
          }

          this.data.bankAccount = e.bankAccount;
          this.data.bankNo = e.bankNo;
          this.data.swiftCode = e.swiftCode;
        }
      },
      ywradiochange(val) {
        let e;
        this.selectData.yhData.forEach(ele => {
          if (ele.payAccountId === this.data.payAccountId) {
            e = ele;
          }
        });

        if (val == "1") {
          this.data.bankAccountAddress = e.bankAccountAddressEn;
          this.data.bankAccountName = e.bankAccountNameEn;
          this.data.bankName = e.bankNameEn;
        } else {
          this.data.bankAccountName = e.bankAccountName;
          this.data.bankAccountAddress = e.bankAccountAddress;
          this.data.bankName = e.bankName;
        }
      },
      bzchange(id) {
        let e;
        this.selectData.bzData.forEach(ele => {
          if (ele.curId === id) {
            e = ele;
          }
        });
        this.data.exchangeRate = e.exchangeRate;
        this.currencySymbol = e.charSign;
      },
      fwfinputchange(val) {
        if (val != "") {
          queryChargeItemBynameCnUrl({nameCn: val, billId: this.billData.billId}).then(res => {
            this.gridData = res.data;
          });
        }
      },
      resetRowHeights(type) {
        let top = this.$refs['gridApi' + type].$el.querySelector('.ag-body-viewport').scrollTop
        this['gridApi' + type].refreshCells()
        this['gridApi' + type].resetRowHeights();
        this.$refs['gridApi' + type].$el.querySelector('.ag-body-viewport').scrollTop = top
      },
      fwtableClick(row, mainRow) {
        const index = this.data.billDetailsfwf.indexOf(mainRow);
        this.data.billDetailsfwf[index].localprice = row.price;
        this.data.billDetailsfwf[index].description = row.nameCn + row.nameEN;
        this.djchange(row.price, this.data.billDetailsfwf[index], index);
        mainRow.fwfPopShow = false
        this.resetRowHeights('billDetailsfwf')

      },
      gftableClick(row, mainRow) {
        const index = this.data.billDetailgf.indexOf(mainRow);
        this.data.billDetailgf[index].localprice = row.price;
        this.data.billDetailgf[index].description = row.nameCn + row.nameEN;
        this.djchangezf(row.price, this.data.billDetailgf[index], index);
        mainRow.gfPopShow = false
        this.resetRowHeights('billDetailgf')
      },
      zftableClick(row, mainRow) {
        const index = this.data.billDetailzf.indexOf(mainRow);
        this.data.billDetailzf[index].localprice = row.price;
        this.data.billDetailzf[index].description = row.nameCn + row.nameEN;
        mainRow.zfPopShow = false
        this.resetRowHeights('billDetailzf')
      },
      delList(type) {
        let list = this['gridApi' + type].getSelectedRows()
        this.data[type] = this.data[type].filter(item => !list.includes(item))
      },
      addfwf(val, type, index) {
        let data = {
          billid: "",
          billrecordid: "",
          datasource: "",
          description: "",
          detailid: "",
          enddate: "",
          feedetailid: "",
          feekind: "",
          feekindString: "",
          foreignprice: 0,
          foreignsum: 0,
          localprice: 0,
          localsum: 0,
          no: "",
          number: 1,
          roleid: "",
          roleidString: "",
          startdate: "",
          tag: "",
          userid: "",
          useridString: "",
          discount: this.data.discount
        }
        if (type == 'upInsert') {
          this.data[val].splice(index, 0, data)
        } else if (type == 'downInsert') {
          this.data[val].splice(index + 1, 0, data)
        } else {
          this.data[val].push(data);
        }
        this.sortNo(val)

      },
      getCaseTypeIdString(str) {
        return str && [...new Set(str.split(','))].join(',') || ''
      },
      sortNo(val) {
        this.data[val].forEach((itm, idx) => {
          itm.no = idx + 1
        });
      },
      delfwf(val, index) {
        // const index = this.data[val].indexOf(row);
        this.data[val].splice(index, 1);
        this.data[val].forEach((itm, idx) => {
          itm.no = idx + 1
        });
        this.$message({
          type: "success",
          message: "删除成功"
        });
      },
      computedBill(type = false) {
        this.checkNum = false;
        this.messageList = [];
        this.isSaveBill = type;
        ['billDetailsfwf', 'billDetailgf', 'billDetailzf'].forEach(item => {
          this['gridApi' + item].stopEditing(false)
          this.data[item].forEach((itm, idx) => {
            if (item == 'billDetailgf') {
              this.numberchangezf(itm.number, itm, idx)
            }
            if (item == 'billDetailsfwf') {
              this.numberchange(itm.number, itm, idx)
            }
            if (item == 'billDetailzf') {
              this.bbchangezf(itm.localsum, itm, idx)
            }
          })
          this['gridApi' + item].refreshCells()
          this.resetRowHeights(item)
        })
      },
      handleSomeNullAttr(dataList, attrList) {
        dataList.forEach((items, index) => {
          if (items.length) {
            items.forEach(item => {
              item.nullValueList = []
              for (var key in item) {
                // console.log(item[key])
                if (!item[key] && item[key] !== 0 && attrList[index].map(item => item.field).includes(key)) {
                  item.nullValueList.push(key)
                }
              }
            })
          }
        })
      },
      deepCompare(x, y) {
        var i, l, leftChain, rightChain;
        function compare2Objects(x, y) {
          var p;
          if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
              return true;
          }
          if (x === y) {
              return true;
          }
          if ((typeof x === 'function' && typeof y === 'function') ||
              (x instanceof Date && y instanceof Date) ||
              (x instanceof RegExp && y instanceof RegExp) ||
              (x instanceof String && y instanceof String) ||
              (x instanceof Number && y instanceof Number)) {
              return x.toString() === y.toString();
          }
          if (!(x instanceof Object && y instanceof Object)) {
              return false;
          }
          if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
              return false;
          }
          if (x.constructor !== y.constructor) {
              return false;
          }
          if (x.prototype !== y.prototype) {
              return false;
          }
          if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
              return false;
          }
          for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
          }
          for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
            switch (typeof(x[p])) {
              case 'object':
              case 'function':
                leftChain.push(x);
                rightChain.push(y);
                if (!compare2Objects(x[p], y[p])) {
                    return false;
                }
                leftChain.pop();
                rightChain.pop();
                break;
              default:
                if (x[p] !== y[p]) {
                    return false;
                }
                break;
            }
          }
          return true;
        }
        if (arguments.length < 1) {
          return true;
        }
        for (i = 1, l = arguments.length; i < l; i++) {
          leftChain = [];
          rightChain = [];
          if (!compare2Objects(arguments[0], arguments[i])) {
              return false;
          }
        }
        return true;
      },

      compare(){
        if(this.type == 'view')return true;
        // console.time('time')
        let res = this.deepCompare(this.backData, this.data)
        // console.timeEnd('time')
        return res
      },
      async handleNullFee() {
        // 本币金额 localsum 为0，描述 description 为空则提示删除数据
        if ([...this.data.billDetailgf,...this.data.billDetailsfwf,...this.data.billDetailzf].find(item => !item.localsum && !item.description)) {
          await this.$confirm(
            '提示',
            {
              message: '账单服务费、官费、杂费存在空数据，是否删除？',
              confirmButtonText: '删除',
              cancelButtonText: '不删除',
              type: 'warning'
            }
          ).then(() => {
            this.data.billDetailgf = this.data.billDetailgf.filter(item => item.localsum && item.description)
            this.data.billDetailsfwf = this.data.billDetailsfwf.filter(item => item.localsum && item.description)
            this.data.billDetailzf = this.data.billDetailzf.filter(item => item.localsum && item.description)
          }).catch(() => {

          })
        }
      },
      async sunmitBill(num, cb) {
        this.data.nullValueList = this.nullValueList
        let dataList = [this.data.billDetailgf,this.data.billDetailsfwf,this.data.billDetailzf]
        let attrList = [this.preferenceList2,this.preferenceList,this.preferenceList3]
        this.handleSomeNullAttr(dataList,attrList)
        await this.handleNullFee()

        // if (this.data.billDetailgf.length) {
        //   this.data.billDetailgf.forEach(item => {
        //     item.nullValueList = []
        //     for (var key in item) {
        //       // console.log(item[key])
        //       if (!item[key] && item[key] != 0 && this.preferenceList2.map(item => item.field).includes(key)) {
        //         item.nullValueList.push(key)
        //       }
        //     }
        //   })
        // }
        // return
        if (this.data.billAllocations) {
          let number_f = 0;
          this.data.billAllocations.forEach((item, index) => {
            number_f += this.fomatFloat(item.allomoney);
          });
          if (this.fomatFloat(Number(this.data.allocationMoney)) >= 0) {
            if (this.fomatFloat(number_f) > 0.1 + this.fomatFloat(Number(this.data.allocationMoney))) {
              this.$message.error(
                "您选择的比例金额已经超出可分配金额上限，请确认！"
              );
              return
            }
          } else {
            if (number_f >= 0) {

            } else {
              if (this.fomatFloat(number_f) < this.fomatFloat(Number(this.data.allocationMoney)) - 0.1) {
                this.$message.error(
                  "您选择的比例金额已经超出可分配金额上限，请确认！"
                );
                return
              }
            }

          }

        }
        ['billDetailsfwf', 'billDetailgf', 'billDetailzf'].forEach(item => {
          this['gridApi' + item].stopEditing(false)
          this.sortNo(item)
        });
         this.computedBill(true)
        await new Promise(resolve => {
          setTimeout(() => {
            resolve()
          })
        })
        if (this.checkNum) {
          const confirmText = this.messageList.map(item => `第${item.idx}条${item.model}中的【${item.label}】`)
          const newDatas = []
          const h = this.$createElement
          for (const i in confirmText) {
            newDatas.push(h('p', null, confirmText[i]))
          }
          newDatas.push(h('p', null, '以上数据格式有误并恢复至修改前，是否核查?'))
          if (
            await this.$confirm(
              '提示',
              {
                message: h('div', null, newDatas),
                confirmButtonText: '核查',
                cancelButtonText: '不核查',
                type: 'warning'
              }
            ).then(() => true).catch(() => false)
          ) return ;
        }
        // if (this.checkNum) return ;

        if (this.flag) {
          this.$message.error('请勿重复点击')
          return
        }
        if (!this.getDiscountRule()) {
          return;
        }
        // Number(totalPrincipal_gf)+Number(totalPrincipal_fw_zh+Number(totalPrincipal_zf))
        this.data.billSum = this.fomatFloat(Number(this.totalPrincipal_gf) + this.totalPrincipal_fw_zh + Number(this.totalPrincipal_zf));
        this.data.foreignSum = toFixed1((Number(this.totalPrincipal_gf) + this.totalPrincipal_fw_zh + Number(this.totalPrincipal_zf)) / (this.data.exchangeRate * 0.01))
        this.data.serviceCost = Number(this.totalPrincipal_fw);
        this.data.officialCost = Number(this.totalPrincipal_gf);
        this.data.otherCost = Number(this.totalPrincipal_zf);
        this.data.serviceCostDiscount = this.totalPrincipal_fw_zh;
        this.data.foreignSumDiscount = this.fomatFloat(this.totalPrincipal_fw_zh / (this.data.exchangeRate * 0.01));
        this.data.serviceCostDiscForeign = toFixed1(this.totalPrincipal_fw_zh_wb)
        this.data.otherCostForeign = toFixed1(this.totalPrincipal_zf_wb)
        const type = this.$route.params && this.type;
        if(this.billTypeIds.length>0){
          this.data.billStyle = this.billTypeIds[this.billTypeIds.length-1]
        }
        console.log(this.data.billStyle,'this.data.billStyle')
        this.$refs["postForm"].validate(valid => {
          if (valid) {
            if (num == 1) {
              // this.data.internal = "1";
              // this.data.distribution = "1";

              this.data.taskIdList = this.data.taskId;
              let reqData = JSON.parse(JSON.stringify(this.data));
              delete reqData.billCost;
              delete reqData.billRecords;
              delete reqData.wfStatus
              delete reqData.billNo;
              this.flag = true

              createBillUrl(reqData).then(res => {
                this.$message.success(res.message);
                this.flag = false
                this.cancel(1, true)
                // this.$router.push({ name: "bill" ,params: { siveId: this.data.billId }});
              }).catch((e) => {
                saveLog({
                  content: JSON.stringify({
                    billId: this.data.billId,
                    message: '审核报错' + e.message,
                    logType: 2
                  })
                }).then(res => {


                })
                // this.cancel()
                this.flag = false
              });
            } else if (num == 2) {
              let reqData = JSON.parse(JSON.stringify(this.data));
              delete reqData.billCost;
              delete reqData.billRecords;
              delete reqData.wfStatus
              delete reqData.billNo;
              this.flag = true
              if (this.billData.billIdList && this.billData.billIdList.length) {
                reqData.billIdList = this.billData.billIdList
              }
              updateBillUrl(reqData).then(res => {
                this.flag = false
                this.$message.success(res.message);
                this.backData = JSON.parse(JSON.stringify(this.data))
                cb&&this.cancel(1)
                // this.cancel(1)
                // this.$router.push({ name: "bill",params: { siveId: this.data.billId } });
              }).catch(() => {
                this.flag = false
              });
            }
          } else {
            this.$message.error("请填写必填项");
            return false;
          }
        });
      },
      // floatFomat(num) {
      //   console.log(num,'jinlaile')
      //   console.log(Number(parseFloat(num).toFixed(0)),'jinlaile1')
      //   return Number(parseFloat(num).toFixed(2));
      // },
      floatFomat(num) {
        return formatAmount(num)
      },
      getDiscountRule() {
        if ([...new Set(this.data.billDetailsfwf.map(item => item.discount))].length > 1) {
          this.data.discount = null
          return true
        } else if ([...new Set(this.data.billDetailsfwf.map(item => item.discount))].length == 1 && [...new Set(this.data.billDetailsfwf.map(item => item.discount))][0] != this.data.discount && this.data.discount) {
          // console.log([...new Set(this.data.billDetailsfwf.map(item=>item.discount))][0],this.data.discount);
          this.$message.error('主页折扣和分项折扣不一致，请统一')
          return false
        } else {
          return true
        }
      },
      discountChange(e) {
        this.data.billDetailsfwf.forEach((item, index) => {
          item.discount = e
          this.zkchange(e, item, index)
        })
        this['gridApi' + 'billDetailsfwf'].refreshCells()
      },
      ygchangeselect(val, row) {
        const index = this.data.billDetailsfwf.indexOf(row);
        val&&queryUserRate({userId: val}).then(res=>{
          this.data.billDetailsfwf[index].roleid = res.data[0]&&res.data[0].roleId
          this.data.billDetailsfwf[index].roleidString = res.data[0]&&res.data[0].name
          res.data[0]&&this.setManhourPrice(res.data[0].rate || 0, index)
          this.data.billDetailsfwf[index].useridString = row.useridString
          this.resetRowHeights('billDetailsfwf')
        })
      },
      setManhourPrice(val, index) {
        this.data.billDetailsfwf[index].localprice = val
        this.djchange(this.data.billDetailsfwf[index].localprice, this.data.billDetailsfwf[index], index);
      },
      numberchange(val, row, index) {
        if (!Number(this.data.billDetailsfwf[index].number) && this.data.billDetailsfwf[index].number != '0') {
          this.data.billDetailsfwf[index].number = 1
          val = this.data.billDetailsfwf[index].number
        }
        this.data.billDetailsfwf[index].localsum = this.fomatFloat(this.data.billDetailsfwf[index].localprice * val);
        this.data.billDetailsfwf[index].localSumDiscount = this.fomatFloat(this.data.billDetailsfwf[index].localsum * this.data.billDetailsfwf[index].discount * 0.01);
        if (this.data.exchangeRate) {
          this.data.billDetailsfwf[index].foreignprice = this.fomatFloat(this.data.billDetailsfwf[index].localprice / (this.data.exchangeRate * 0.01));
          this.data.billDetailsfwf[index].foreignsum = this.fomatFloat((this.data.billDetailsfwf[index].localprice * val) / (this.data.exchangeRate * 0.01));
          this.data.billDetailsfwf[index].foreignPriceDiscount = this.fomatFloat(this.data.billDetailsfwf[index].foreignprice * this.data.billDetailsfwf[index].discount * 0.01)
          this.data.billDetailsfwf[index].foreignSumDiscount = this.fomatFloat(this.data.billDetailsfwf[index].foreignsum * this.data.billDetailsfwf[index].discount * 0.01)
        }
      },
      djchange(val, row, index) {
        if (!Number(this.data.billDetailsfwf[index].number) && this.data.billDetailsfwf[index].number != '0') {
          this.data.billDetailsfwf[index].number = 1
        }
        this.data.billDetailsfwf[index].localsum = this.fomatFloat(this.data.billDetailsfwf[index].number * val);
        this.data.billDetailsfwf[index].localSumDiscount = this.fomatFloat(this.data.billDetailsfwf[index].localsum * this.data.billDetailsfwf[index].discount * 0.01);
        if (this.data.exchangeRate) {
          this.data.billDetailsfwf[index].foreignprice = this.fomatFloat(val / (this.data.exchangeRate * 0.01));
          this.data.billDetailsfwf[index].foreignsum = this.fomatFloat((this.data.billDetailsfwf[index].number * val) / (this.data.exchangeRate * 0.01));
          this.data.billDetailsfwf[index].foreignPriceDiscount = this.fomatFloat(this.data.billDetailsfwf[index].foreignprice * this.data.billDetailsfwf[index].discount * 0.01)
          this.data.billDetailsfwf[index].foreignSumDiscount = this.fomatFloat(this.data.billDetailsfwf[index].foreignsum * this.data.billDetailsfwf[index].discount * 0.01)
        } else {
          this.$message.error("请选择币种");
        }
      },
      wbdjchange(val, row, index) {
        this.data.billDetailsfwf[index].localprice = this.fomatFloat(val * (this.data.exchangeRate * 0.01));
        this.djchange(this.data.billDetailsfwf[index].localprice, row, index);
      },
      wbjechange(val, row, index) {
        if (!Number(this.data.billDetailsfwf[index].number) && this.data.billDetailsfwf[index].number != '0') {
          this.data.billDetailsfwf[index].number = 1
        }
        this.data.billDetailsfwf[index].foreignprice = this.fomatFloat(val / this.data.billDetailsfwf[index].number);
        this.wbdjchange(this.data.billDetailsfwf[index].foreignprice, row, index);
      },
      bbzkchange(val, row, index) {
        if (!Number(this.data.billDetailsfwf[index].number) && this.data.billDetailsfwf[index].number != '0') {
          this.data.billDetailsfwf[index].number = 1
        }
        this.data.billDetailsfwf[index].localsum = this.fomatFloat(val / (this.data.billDetailsfwf[index].discount * 0.01));
        this.data.billDetailsfwf[index].localprice = this.fomatFloat(this.data.billDetailsfwf[index].localsum / this.data.billDetailsfwf[index].number);
        if (this.data.exchangeRate) {
          this.data.billDetailsfwf[index].foreignprice = this.fomatFloat(this.data.billDetailsfwf[index].localprice / (this.data.exchangeRate * 0.01));
          this.data.billDetailsfwf[index].foreignsum = this.fomatFloat((this.data.billDetailsfwf[index].number * this.data.billDetailsfwf[index].localprice) / (this.data.exchangeRate * 0.01));
          this.data.billDetailsfwf[index].foreignPriceDiscount = this.fomatFloat(this.data.billDetailsfwf[index].foreignprice * this.data.billDetailsfwf[index].discount * 0.01)
          this.data.billDetailsfwf[index].foreignSumDiscount = this.fomatFloat(this.data.billDetailsfwf[index].foreignsum * this.data.billDetailsfwf[index].discount * 0.01)
        } else {
          this.$message.error("请选择币种");
        }
      },
      wbjezkhchange(val, row, index) {
        this.data.billDetailsfwf[index].foreignsum = this.fomatFloat(val / (this.data.billDetailsfwf[index].discount * 0.01));
        this.wbjechange(this.data.billDetailsfwf[index].foreignsum, row, index)
      },
      wbdjzkhchange(val, row, index) {
        this.data.billDetailsfwf[index].foreignprice = this.fomatFloat(val / (this.data.billDetailsfwf[index].discount * 0.01));
        this.wbdjchange(this.data.billDetailsfwf[index].foreignprice, row, index)
      },
      zkchange(val, row, index, preValue) {
        if (val != this.data.discount && this.data.discount) {
          this.$confirm("分项折扣和主页折扣不一致，是否确定修改？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            // distinguishCancelAndClose: true,
            type: "warning"
          }).then(() => {
            this.data.discount = null
            if (!Number(this.data.billDetailsfwf[index].number) && this.data.billDetailsfwf[index].number != '0') {
              this.data.billDetailsfwf[index].number = 1
            }
            this.data.billDetailsfwf[index].localSumDiscount = this.fomatFloat(val * this.data.billDetailsfwf[index].localsum * 0.01);
            const localsum = this.data.billDetailsfwf[index].localsum

            this.data.billDetailsfwf[index].localsum = 0;
            this.$nextTick(() => {
              this.data.billDetailsfwf[index].localsum = localsum
              this['gridApi' + 'billDetailsfwf'].refreshCells()
            })
            if (this.data.exchangeRate) {
              this.data.billDetailsfwf[index].foreignprice = this.fomatFloat(this.data.billDetailsfwf[index].localprice / (this.data.exchangeRate * 0.01));
              this.data.billDetailsfwf[index].foreignsum = this.fomatFloat((this.data.billDetailsfwf[index].number * this.data.billDetailsfwf[index].localprice) / (this.data.exchangeRate * 0.01));
              this.data.billDetailsfwf[index].foreignPriceDiscount = this.fomatFloat(this.data.billDetailsfwf[index].foreignprice * this.data.billDetailsfwf[index].discount * 0.01)
              this.data.billDetailsfwf[index].foreignSumDiscount = this.fomatFloat(this.data.billDetailsfwf[index].foreignsum * this.data.billDetailsfwf[index].discount * 0.01)
            } else {
              this.$message.error("请选择币种");
            }
            this['gridApi' + 'billDetailsfwf'].refreshCells()
          }).catch((action) => {
            this.data.billDetailsfwf[index].discount = this.preValue
            val = this.preValue
            if (!Number(this.data.billDetailsfwf[index].number) && this.data.billDetailsfwf[index].number != '0') {
              this.data.billDetailsfwf[index].number = 1
            }
            this.data.billDetailsfwf[index].localSumDiscount = this.fomatFloat(val * this.data.billDetailsfwf[index].localsum * 0.01);
            const localsum = this.data.billDetailsfwf[index].localsum

            this.data.billDetailsfwf[index].localsum = 0;
            this.$nextTick(() => {
              this.data.billDetailsfwf[index].localsum = localsum
              this['gridApi' + 'billDetailsfwf'].refreshCells()
            })
            if (this.data.exchangeRate) {
              this.data.billDetailsfwf[index].foreignprice = this.fomatFloat(this.data.billDetailsfwf[index].localprice / (this.data.exchangeRate * 0.01));
              this.data.billDetailsfwf[index].foreignsum = this.fomatFloat((this.data.billDetailsfwf[index].number * this.data.billDetailsfwf[index].localprice) / (this.data.exchangeRate * 0.01));
              this.data.billDetailsfwf[index].foreignPriceDiscount = this.fomatFloat(this.data.billDetailsfwf[index].foreignprice * this.data.billDetailsfwf[index].discount * 0.01)
              this.data.billDetailsfwf[index].foreignSumDiscount = this.fomatFloat(this.data.billDetailsfwf[index].foreignsum * this.data.billDetailsfwf[index].discount * 0.01)
            } else {
              this.$message.error("请选择币种");
            }
            this['gridApi' + 'billDetailsfwf'].refreshCells()
            // action === 'cancel' ? (this.data.billDetailsfwf[index].discount = this.data.discount) : '';
          })
          return
        }
        if (!Number(this.data.billDetailsfwf[index].number) && this.data.billDetailsfwf[index].number != '0') {
          this.data.billDetailsfwf[index].number = 1
        }
        this.data.billDetailsfwf[index].localSumDiscount = this.fomatFloat(val * this.data.billDetailsfwf[index].localsum * 0.01);
        const localsum = this.data.billDetailsfwf[index].localsum

        this.data.billDetailsfwf[index].localsum = 0;
        this.$nextTick(() => {
          this.data.billDetailsfwf[index].localsum = localsum
          this['gridApi' + 'billDetailsfwf'].refreshCells()
        })
        if (this.data.exchangeRate) {
          this.data.billDetailsfwf[index].foreignprice = this.fomatFloat(this.data.billDetailsfwf[index].localprice / (this.data.exchangeRate * 0.01));
          this.data.billDetailsfwf[index].foreignsum = this.fomatFloat((this.data.billDetailsfwf[index].number * this.data.billDetailsfwf[index].localprice) / (this.data.exchangeRate * 0.01));
          this.data.billDetailsfwf[index].foreignPriceDiscount = this.fomatFloat(this.data.billDetailsfwf[index].foreignprice * val * 0.01)
          this.data.billDetailsfwf[index].foreignSumDiscount = this.fomatFloat(this.data.billDetailsfwf[index].foreignsum * val * 0.01)
        } else {
          this.$message.error("请选择币种");
        }
        // this['gridApi' + 'billDetailsfwf'].refreshCells()
      },
      bbchange(val, row, index) {
        if (!Number(this.data.billDetailsfwf[index].number) && this.data.billDetailsfwf[index].number != '0') {
          this.data.billDetailsfwf[index].number = 1
        }
        this.data.billDetailsfwf[index].localprice = this.fomatFloat(val / this.data.billDetailsfwf[index].number)
        this.data.billDetailsfwf[index].localSumDiscount = this.fomatFloat(val * this.data.billDetailsfwf[index].discount * 0.01)
        if (this.data.exchangeRate) {
          this.data.billDetailsfwf[index].foreignprice = this.fomatFloat(this.data.billDetailsfwf[index].localprice / (this.data.exchangeRate * 0.01));
          this.data.billDetailsfwf[index].foreignsum = this.fomatFloat((this.data.billDetailsfwf[index].number * this.data.billDetailsfwf[index].localprice) / (this.data.exchangeRate * 0.01));
          this.data.billDetailsfwf[index].foreignPriceDiscount = this.fomatFloat(this.data.billDetailsfwf[index].foreignprice * this.data.billDetailsfwf[index].discount * 0.01)
          this.data.billDetailsfwf[index].foreignSumDiscount = this.fomatFloat(this.data.billDetailsfwf[index].foreignsum * this.data.billDetailsfwf[index].discount * 0.01)
        } else {
          this.$message.error("请选择币种");
        }
      },
      bbchangezf(val, row, index) {

        if (this.data.exchangeRate) {
          this.data.billDetailzf[index].foreignsum = this.fomatFloat(val / (this.data.exchangeRate * 0.01));
          this.data.billDetailzf[index].localprice = val
        }
      },
      wbjechangezf(val, row, index) {
        // console.log(val, row, index);
        this.data.billDetailzf[index].localsum = this.fomatFloat(val * this.data.exchangeRate * 0.01);
        this.data.billDetailzf[index].localprice = this.data.billDetailzf[index].localsum
      },
      numberchangezf(val, row, index) {
        if (!Number(this.data.billDetailgf[index].number) && this.data.billDetailgf[index].number != '0') {
          this.data.billDetailgf[index].number = 1
          val = this.data.billDetailgf[index].number
        }
        this.data.billDetailgf[index].localsum = this.fomatFloat(this.data.billDetailgf[index].localprice * val);

        if (this.data.exchangeRate) {
          this.data.billDetailgf[index].foreignprice = this.fomatFloat(this.data.billDetailgf[index].localprice / (this.data.exchangeRate * 0.01));

          this.data.billDetailgf[index].foreignsum = this.fomatFloat((this.data.billDetailgf[index].localprice * val) / (this.data.exchangeRate * 0.01));
        }
      },
      djchangezf(val, row, index) {
        if (!Number(this.data.billDetailgf[index].number) && this.data.billDetailgf[index].number != '0') {
          this.data.billDetailgf[index].number = 1
        }
        this.data.billDetailgf[index].localsum = this.fomatFloat(this.data.billDetailgf[index].number * val);
        if (this.data.exchangeRate) {
          this.data.billDetailgf[index].foreignprice = this.fomatFloat(val / (this.data.exchangeRate * 0.01));
          this.data.billDetailgf[index].foreignsum = this.fomatFloat((this.data.billDetailgf[index].number * val) / (this.data.exchangeRate * 0.01));
        } else {
          this.$message.error("请选择币种");
        }
      },
      djchangezff(val, row, index) {
        this.data.billDetailzf[index].localsum = this.fomatFloat(val);
        if (this.data.exchangeRate) {
          this.data.billDetailzf[index].foreignsum = this.fomatFloat(val / (this.data.exchangeRate * 0.01));
        } else {
          this.$message.error("请选择币种");
        }
      },
      wbdjchangegf(val, row, index) {
        this.data.billDetailgf[index].localprice = this.fomatFloat(val * (this.data.exchangeRate * 0.01));
        this.djchangezf(this.data.billDetailgf[index].localprice, row, index);
      },
      wbjechangegf(val, row, index) {
        if (!Number(this.data.billDetailgf[index].number) && this.data.billDetailgf[index].number != '0') {
          this.data.billDetailgf[index].number = 1
        }
        this.data.billDetailgf[index].foreignprice = this.fomatFloat(val / this.data.billDetailgf[index].number);
        this.wbdjchangegf(this.data.billDetailgf[index].foreignprice, row, index);
      },
      bbchangegf(val, row, index) {
        if (!Number(this.data.billDetailgf[index].number) && this.data.billDetailgf[index].number != '0') {
          this.data.billDetailgf[index].number = 1
        }
        this.data.billDetailgf[index].localprice = this.fomatFloat(val / this.data.billDetailgf[index].number);
        if (this.data.exchangeRate) {
          this.data.billDetailgf[index].foreignprice = this.fomatFloat(this.data.billDetailgf[index].localprice / (this.data.exchangeRate * 0.01));
          this.data.billDetailgf[index].foreignsum = this.fomatFloat((this.data.billDetailgf[index].number * this.data.billDetailgf[index].localprice) / (this.data.exchangeRate * 0.01));
        } else {
          this.$message.error("请选择币种");
        }
      },
      blchangeinput(val, row, index) {
        this.$set(this.data.billAllocations[index], 'allomoney', this.fomatFloat(this.data.allocationMoney * val * 0.01))
        // this.data.billAllocations[index].allomoney = this.fomatFloat(this.data.allocationMoney * val * 0.01);
        this.fpChangyz();
      },
      jechangeinput(val, row, index) {
        this.$set(this.data.billAllocations[index], 'alloratio', this.fomatFloat((val / this.data.allocationMoney) * 100))
        if (this.data.allocationMoney == 0) {
          this.$set(this.data.billAllocations[index], 'alloratio', 0)
        }
        // this.data.billAllocations[index].alloratio = this.fomatFloat((val / this.data.allocationMoney) * 100);
        this.fpChangyz();
      },
      initfptable() {
        if(!this.initChangFp){
          this.initChangFp = true;
        }else{
          if (this.data.billAllocations) {
            this.data.billAllocations.forEach((item, index) => {
              this.$set(this.data.billAllocations[index], 'allomoney', this.fomatFloat(this.data.billAllocations[index].alloratio * 0.01 * this.data.allocationMoney))
              this.$set(this.data.billAllocations[index], 'alloratio', this.fomatFloat((this.data.billAllocations[index].allomoney / this.data.allocationMoney) * 100))
              if (this.data.allocationMoney == 0) {
                this.$set(this.data.billAllocations[index], 'alloratio', 0)
              }
              // this.data.billAllocations[index].allomoney = this.fomatFloat(this.data.billAllocations[index].alloratio * 0.01 * this.data.allocationMoney)
            });
          }
        }
      },
      fpChangyz() {
        // if (this.data.billAllocations) {
        //   let number_f = 0;
        //   this.data.billAllocations.forEach((item, index) => {
        //     number_f += Number(item.allomoney);
        //   });
        //   if (number_f > Number(this.data.allocationMoney)) {
        //     this.$message.error(
        //       "您选择的比例金额已经超出可分配金额上限，请确认！"
        //     );
        //   }
        // }
        if (this.data.billAllocations) {
          let number_f = 0;
          this.data.billAllocations.forEach((item, index) => {
            number_f += this.fomatFloat(item.allomoney);
          });
          if (this.fomatFloat(Number(this.data.allocationMoney)) >= 0) {
            if (this.fomatFloat(number_f) > 0.1 + this.fomatFloat(Number(this.data.allocationMoney))) {
              this.$message.error(
                "您选择的比例金额已经超出可分配金额上限，请确认！"
              );
              return
            }
          } else {
            if (number_f >= 0) {

            } else {
              if (this.fomatFloat(number_f) < this.fomatFloat(Number(this.data.allocationMoney)) - 0.1) {
                this.$message.error(
                  "您选择的比例金额已经超出可分配金额上限，请确认！"
                );
                return
              }
            }

          }

        }
      }
    },
    mounted() {
      // new DraginResize(document.querySelector('.zdjbxn'), {
      //   clone: true,
      //   start(x, y) {
      //     console.log('start', x, y);
      //   },
      //   move(info) {
      //     console.log('move', info);
      //   },
      //   end(info) {
      //     console.log('end', info);
      //
      //     if (info.dir == 'ver') {
      //       this.elem.style.height = info.height + 'px';
      //     }
      //     else if (info.dir == 'hor') {
      //       this.elem.style.width = info.width + 'px';
      //     }
      //   }
      // })
      // if (this.selectData.ttData && this.selectData.ttData.length < 0) {
      //   if (this.data.addrId) {
      //     this.selectData.ttData = [
      //       {
      //         addrId: this.data.addrId,
      //         addressCn: this.data.addrIdString
      //       }
      //     ];
      //   }
      // }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;
    height: calc(100vh - 100px);
    overflow: auto;
    // padding: 10px 2px;
    // border: 1px solid #d7d7d7;
    // margin: 15px 20px;
    // min-height: 800px;
    .step-div {
      padding: 20px 65px;
    }

    /deep/ .el-tabs__header {
      margin-bottom: 2px;
    }

    /*/deep/ .el-collapse-item__header {*/
    /*  !*display: block;*!*/
    /*  !*text-align: center;*!*/

    /*  background: #f5f5f5;*/
    /*  height: 35px;*/
    /*  line-height: 35px;*/
    /*  display: flex;*/
    /*}*/
    /*/deep/ .el-collapse-item__content {*/
    /*  padding: 0px;*/
    /*}*/

    .fg-div {
      height: 20px;
      background: #e4e4e4;
    }

    .tilteSpan {
      font-size: 18px;
      padding: 15px 0px;
      color: #7199d5;
    }

    /deep/ .el-step {
      cursor: pointer;
    }
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
      padding: 0px !important;
      height: 35px !important;
      line-height: 35px !important;
    }

    /deep/ td {
      background-color: #ffffff !important;
    }

    /deep/ .el-input__inner,
    /deep/ .el-select {
      width: 100% !important;
    }

  }

  /deep/ .cell {
    padding: 5px 5px !important;
  }

  /deep/ .form-border {
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    .el-row {
      margin: 0px;
      display: flex; /*解决账单查看表单样式被撑开*/
    }

    .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    .el-form-item__label {
      background-color: #f9f9f9;
      width: 36.7%;
      text-align: right;
    }

    .el-form-item {
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    .el-row {
      border-bottom: 1px solid #d7d7d7;
      border-left: 1px solid #d7d7d7;
    }

    .el-input,
    .el-select {
      width: 77%;
    }

    td .el-input,
    td .el-select {
      width: 100%;
    }

    .el-form-item__content {
      text-align: left;
      word-break: break-word;
      // height: 30px;
    }

    .fullRow {
      .el-form-item__label {
        width: 15%;
      }

      .el-input,
      .el-select {
        width: 30%;
      }
    }

    .el-input__inner {
      // border: none;
    }

    .el-select .el-input {
      width: 100%;
    }

    td .el-select,
    td .el-input,
    td .el-input__inner {
      // border: 0px !important;
    }

    .postInfo-container-item {
      display: flex;
      width: 100%;

      .el-form-item__content {
        text-align: left;
        display: inline-table;
        width: 85%;
        padding: 0px 15px;
      }

      .el-form-item__label {
        line-height: 28px;
      }
    }

    // border-top: 1px solid #d7d7d7;
    // border-left: 1px solid #d7d7d7;
    // border-bottom: 1px solid #d7d7d7;
  }

  /deep/ .el-table__header tr,
  /deep/ .el-table__header th {
    padding: 0;
    height: 30px;
    background: #f5f5f5;
  }

  /deep/ .el-table__body tr,
  /deep/ .el-table__body td {
    padding: 0;
    height: 40px;
  }

  /deep/ .el-step {
    cursor: pointer;
  }

  .upload-btn {
    display: inline-block;
  }

  /deep/ .el-table /deep/ .warning-row {
    background: #dd7a7a;
    color: white;
  }

  .redClass {
    color: #dd7a7a;
  }

  .greenClass {
    color: rgb(49, 165, 49);
  }

  .tmCmsearch {
    /deep/ .el-select .el-input {
      width: 130px;
    }

    /deep/ .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
  }

  .billallPice {
    text-align: right;
    border-left: none;
    margin-top: 10px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    margin-bottom: 10px;
  }

  .piceSpan {
    font-weight: 700;
    font-style: normal;
    font-size: 28px;
    color: #ff6600;
    margin-right: 20px
  }

  .billtotalspan {
    margin-right: 20px;
  }

  /deep/ .el-input--medium {
    width: 120px;
  }

  .title-mx {
    float: left;
    font-size: 15px;
    color: rgb(64, 158, 255);
    font-weight: 350;
    font-style: normal;
  }

  /deep/ .el-autocomplete {
    width: 100%;
  }

  .zdjbxn {
    position: relative;
    flex: 1;
    height: calc(100vh - 150px);
    /*overflow: hidden;*/
    /deep/ .el-tabs {
      height: 100%;

      .el-tabs__content {
        height: 100%;
        overflow: auto;
      }
    }
  }

  .zdzs {
    width: 400px;
    height: calc(100vh - 150px);
    overflow: auto;
    border-right: 2px solid RGBA(239, 248, 255, 1);
  }

  /deep/ textarea {
    word-wrap: break-word;
    word-break: break-word;
  }

  .pdfDialog /deep/ {
    z-index: 3000;

    .el-dialog {
      z-index: 3000;
      height: 50vh;
      display: flex;
      flex-direction: column;

      .el-dialog__body {
        flex: 1;

        .el-textarea {
          height: 100%;

          textarea {
            height: 100%;
          }
        }
      }
    }
  }

  .arrow {
    position: absolute;
    right: 0;
    z-index: 10;
  }

  .ag-theme-balham {
    /deep/ .el-input,
    /deep/ .el-select {
      width: 100%;
      line-height: 28px;
    }

    /deep/ .el-textarea {
      height: 100%;

      textarea {
        height: 100%;
      }
    }

    /deep/ .el-input__inner {
      padding: 0
    }

    /deep/ .el-input__prefix {
      display: none;
    }

    /deep/ .ag-cell-auto-height {
      height: 100% !important;
      word-wrap: break-word;
      word-break: break-word;
    }

    /deep/ .ag-cell-inline-editing {
      background: #fff;
      color: #333;
    }
  }
  .exactButton {
    margin-top: 10px;
  }

  .sticky {
    position: sticky;
    background: #fff;
    top: 0;
    z-index: 10;
  }

  .fullScreenBox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 20px;
    z-index: 2000;
    background: #fff;
  }
  >>>.ag-floating-bottom-container{
    font-weight: bolder;
    font-size: 14px;
  }
  .error-text {
    font-size: 13px !important;
    text-decoration: underline wavy red !important;
  }
  #caseDescShow {
    padding: 5px 15px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    line-height: 1.5;
    word-wrap: break-word;
    word-break: break-word;
  }
</style>
