<template>
  <div>
    <BreadCrumbCase v-if="caseDetailFoemData.caseId" :caseDetailFoemData="caseDetailFoemData"></BreadCrumbCase>
    <el-row style="display: flex">
      <el-col style="flex: 1;margin-right: 10px;margin-bottom: 10px" class="createPost-container">
        <el-tabs v-model="activeName" @tab-click="handleClickTab">
          <el-row v-if="tabtypeDown">
            <el-col :span="24" />
          </el-row>
          <el-tab-pane label="案件详情" name="first">
              <template v-if="$route.query.taskType==3">
                <el-form ref="postForm" label-width="180px" :model="caseDetailFoemData" :rules="rules" class="form-container" size="mini"  v-if="postFormFlag">
                  <div class="createPost-main-container">
                    <div class="form-con">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="案件类型:" prop="protectcaseTypeIdList">
                                <!--                            <p v-for="item in caseDetailFoemData.lawsuitCasetypeNameArray">{{item}}</p>-->
                                <!--                            <template>-->
                                <!--                              <span>{{ caseDetailFoemData.caseType?caseDetailFoemData.caseType:'商标行政诉讼' }}</span>-->
                                <!--                            </template>-->
                                <el-multi-cascader
                                  ref="multiCascader"
                                  v-model="caseDetailFoemData.protectcaseTypeIdList"
                                  :options="$store.state.caseInformation.caseTypeList.filter(item=>item.caseTypeId==1)[0].childrens"
                                  multiple
                                  filterable
                                  clearable
                                  :props="defaultParams"
                                  change-on-select
                                  select-children
                                  @change="multiCatchange"
                                />
                              </el-form-item>

                            </el-col>
                            <el-col :span="12">

                              <el-form-item class="postInfo-container-item" label="案件性质:" prop="lawsuitWorkArray">

                                <el-select default-first-option multiple   :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.lawsuitWorkArray" filterable>
                                  <el-option :label="item.typeName" :value="item.id" v-for="item in selectData.natureOfWorkList" />

                                </el-select>
                              </el-form-item>

                              <!--                          <el-form-item class="postInfo-container-item" label="审级:" prop="judgeRank">-->
                              <!--                            <template>-->

                              <!--                              <el-select default-first-option :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.judgeRank" filterable>-->
                              <!--                                <el-option label="无" :value="1368" />-->
                              <!--                                <el-option label="一审" :value="1071" />-->
                              <!--                                <el-option label="二审" :value="1072" />-->
                              <!--                                <el-option label="再审" :value="1073" />-->
                              <!--                                <el-option label="重申" :value="1074" />-->
                              <!--                                <el-option label="执行" :value="1075" />-->

                              <!--                              </el-select>-->

                              <!--                            </template>-->
                              <!--                          </el-form-item>-->

                            </el-col>

                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">

                              <el-form-item class="postInfo-container-item" label="申请方向:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.appFromto">
                                    <el-radio label="外-内" />
                                    <el-radio label="内-内" />
                                    <el-radio label="内-外" />
                                    <el-radio label="外-外" />
                                    <el-radio label="台-内" />
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24" class="tilteSpan">
                          <span id="ajxq-title">案件信息</span>
                        </el-col>
                      </el-row>

                      <el-row>
                        <el-col :span="24" class="form-con-item">
                          <el-row class="form-border">
                            <el-col :span="24">
                              <el-row class="">
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item" label="案件文号:">
                                    <template>
                                      <el-input v-model="caseDetailFoemData.agentNum" disabled/>
                                    </template>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item" label="案件等级:" prop="caseLevel">
                                    <template>
                                      <el-radio-group v-model="caseDetailFoemData.caseLevel">
                                        <el-radio :label="1">普通</el-radio>
                                        <el-radio :label="2">重要</el-radio>
                                      </el-radio-group>
                                    </template>
                                  </el-form-item>
                                </el-col>

                              </el-row>
<!--                              <el-row class="fullRow">-->
<!--                                <el-col :span="24">-->
<!--                                  <el-form-item class="postInfo-container-item" label="工时类型:">-->
<!--                                    <template>-->
<!--                                      <el-radio-group v-model="caseDetailFoemData.hrType" :disabled="!ifModifyWorkHour">-->
<!--                                        <el-radio :label="1">记录工时</el-radio>-->
<!--                                        <el-radio :label="2">折算工时</el-radio>-->
<!--                                      </el-radio-group>-->
<!--                                    </template>-->
<!--                                  </el-form-item>-->
<!--                                </el-col>-->
<!--                              </el-row>-->

                              <el-row class="">
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item" label="案件名称:" prop="caseName">
                                    <template>
                                      <el-input v-model="caseDetailFoemData.caseName" />
                                    </template>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item" label="案件名称(英文):">
                                    <template>
                                      <el-input v-model="caseDetailFoemData.caseEnName" />
                                    </template>
                                  </el-form-item>
                                </el-col>
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
                                <el-col :span="24">
                                  <el-form-item class="postInfo-container-item" label="基本案情介绍:">
                                    <template>
                                      <el-input v-model="caseDetailFoemData.caseIntroduce" :rows="3" placeholder="请输入" type="textarea" />

                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <!--                          <el-row class="">-->
                              <!--                            <el-col :span="12">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="管辖法院:">-->
                              <!--                                <template>-->

                              <!--                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.courtCustId">-->

                              <!--                                    <el-option :key="key" :label="item.fullname" :value="item.custId" v-for="(item,key) in selectData.hzLists" />-->

                              <!--                                  </el-select>-->

                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                            <el-col :span="12">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="法院案号:">-->
                              <!--                                <template>-->
                              <!--                                  <el-input v-model="caseDetailFoemData.courtCaseNumber" />-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="合议庭:">-->
                              <!--                                <template>-->
                              <!--                                  <el-row class="fullRow">-->
                              <!--                                    <el-col :span="24">-->
                              <!--                                      <el-form-item class="postInfo-container-item" label="审判长:">-->
                              <!--                                        <template>-->
                              <!--                                          <el-input v-model="caseDetailFoemData.collegialBench" />-->
                              <!--                                        </template>-->
                              <!--                                      </el-form-item>-->
                              <!--                                    </el-col>-->
                              <!--                                  </el-row>-->
                              <!--                                  <el-row class="fullRow">-->
                              <!--                                    <el-col :span="24">-->
                              <!--                                      <el-form-item class="postInfo-container-item" label="审判员:">-->
                              <!--                                        <template>-->
                              <!--                                          <el-input v-model="caseDetailFoemData.judge" />-->
                              <!--                                        </template>-->
                              <!--                                      </el-form-item>-->
                              <!--                                    </el-col>-->
                              <!--                                  </el-row>-->
                              <!--                                  <el-row class="fullRow">-->
                              <!--                                    <el-col :span="24">-->
                              <!--                                      <el-form-item class="postInfo-container-item" label="法官助理:">-->
                              <!--                                        <template>-->
                              <!--                                          <el-input v-model="caseDetailFoemData.judgeAssistant" />-->
                              <!--                                        </template>-->
                              <!--                                      </el-form-item>-->
                              <!--                                    </el-col>-->
                              <!--                                  </el-row>-->
                              <!--                                  <el-row class="fullRow">-->
                              <!--                                    <el-col :span="24">-->
                              <!--                                      <el-form-item class="postInfo-container-item" label="书记员:">-->
                              <!--                                        <template>-->
                              <!--                                          <el-input v-model="caseDetailFoemData.clerk" />-->
                              <!--                                        </template>-->
                              <!--                                      </el-form-item>-->
                              <!--                                    </el-col>-->
                              <!--                                  </el-row>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row class="">-->
                              <!--                            <el-col :span="8">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="审理方式:">-->
                              <!--                                <template>-->

                              <!--                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.hearWay">-->

                              <!--                                    <el-option :key="key" :label="item.typeName" :value="item.id" v-for="(item,key) in selectDataByClass['1134']" />-->

                              <!--                                  </el-select>-->

                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                            <el-col :span="8">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="结案方式:">-->
                              <!--                                <template>-->

                              <!--                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.closeWay">-->

                              <!--                                    <el-option :key="key" :label="item.typeName" :value="item.id" v-for="(item,key) in selectDataByClass['1135']" />-->

                              <!--                                  </el-select>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                            <el-col :span="8">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="判决结果:">-->
                              <!--                                <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.judgment">-->

                              <!--                                  <el-option :key="key" :label="item.typeName" :value="item.id" v-for="(item,key) in selectDataByClass['1029']" />-->

                              <!--                                </el-select>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="所涉及条款:" prop="clause">-->
                              <!--                                <template>-->
                              <!--                                  <div class="textarea_wrap">-->
                              <!--                                    <el-input v-model="caseDetailFoemData.clause" :rows="3" placeholder="请输入" type="textarea" />-->
                              <!--                                    <div class="button_wrap">-->
                              <!--                                      <el-button type="primary" @click="editTextarea('clause')">编辑</el-button>-->
                              <!--                                    </div>-->
                              <!--                                  </div>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="审理尺度分析:" prop="hearMeasureAnalyze">-->
                              <!--                                <template>-->
                              <!--                                  <div class="textarea_wrap">-->
                              <!--                                    <el-input v-model="caseDetailFoemData.hearMeasureAnalyze" :rows="3" placeholder="请输入" type="textarea" />-->
                              <!--                                    <div class="button_wrap">-->
                              <!--                                      <el-button  type="primary" @click="editTextarea('hearMeasureAnalyze')">编辑</el-button>-->
                              <!--                                    </div>-->
                              <!--                                  </div>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="后续工作及建议:" prop="laterSuggest">-->
                              <!--                                <template>-->
                              <!--                                  <div class="textarea_wrap">-->
                              <!--                                    <el-input v-model="caseDetailFoemData.laterSuggest" :rows="3" placeholder="请输入" type="textarea" />-->
                              <!--                                    <div class="button_wrap">-->
                              <!--                                      <el-button  type="primary" @click="editTextarea('laterSuggest')">编辑</el-button>-->
                              <!--                                    </div>-->
                              <!--                                  </div>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="有无情势变更:" prop="situationChange">-->
                              <!--                                <template>-->
                              <!--                                  <div class="textarea_wrap">-->
                              <!--                                    <el-input v-model="caseDetailFoemData.situationChange" :rows="3" placeholder="请输入" type="textarea" />-->
                              <!--                                    <div class="button_wrap">-->
                              <!--                                      <el-button   type="primary" @click="editTextarea('situationChange')">编辑</el-button>-->
                              <!--                                    </div>-->
                              <!--                                  </div>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="关键词:" prop="keyword">-->
                              <!--                                <template>-->
                              <!--                                  <div class="textarea_wrap">-->
                              <!--                                    <el-input v-model="caseDetailFoemData.keyword" :rows="3" placeholder="请输入" type="textarea" />-->
                              <!--                                    <div class="button_wrap">-->
                              <!--                                      <el-button   type="primary" @click="editTextarea('keyword')">编辑</el-button>-->
                              <!--                                    </div>-->
                              <!--                                  </div>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <el-row class="fullRow">
                                <el-col :span="24">
                                  <el-form-item class="postInfo-container-item" label="报价:" prop="caseOffer">
                                    <el-input v-model="caseDetailFoemData.caseOffer" :rows="3" placeholder="请输入" />
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-row class="fullRow">
                                <el-col :span="24">
                                  <el-form-item class="postInfo-container-item" label="备注:">
                                    <template>
                                      <el-input v-model="caseDetailFoemData.memo" :rows="3" placeholder="请输入" type="textarea" />

                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                            </el-col>

                          </el-row>
                        </el-col>

                      </el-row>

                      <el-row>
                        <el-col :span="24" class="tilteSpan">
                          <span id="khxx-title">客户信息</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24" class="form-con-item">
                          <el-row class="form-border">
                            <el-col :span="24">
                              <el-row class="">
                                <el-col :span="12">
                                  <el-form-item label="客户名称:" prop="custName" class="postInfo-container-item">
                                    <!--                                <template>-->
                                    <!--                                  <el-input :disabled="true" v-model="caseDetailFoemData.custName">-->
                                    <!--                                  </el-input>-->
                                    <!--                                </template>-->
                                    <el-select
                                      v-model="caseDetailFoemData.custId"
                                      ref="custSelect"
                                      :disabled="!$store.getters.permissions.includes(242)"
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
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item"  label="客户文号:">
                                    <template>
                                      <el-input  v-model="caseDetailFoemData.custRefno" />
                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-row class="">
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item"  label="客户联系人:">
                                    <template>

                                      <el-select v-model="caseDetailFoemData.custConId" :clearable="true" default-first-option filterable placeholder="请选择" @change="contactchange">
                                        <el-option v-for="(item,key) in selectData.customerContacts" :key="key" :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId" />
                                      </el-select>
                                    </template>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item" label="抄送人:">
                                    <template>
                                      <el-select v-model="caseDetailFoemData.lawsuitCaseCcArray" :clearable="true" default-first-option filterable multiple placeholder="请选择">
                                        <el-option v-for="(item,key) in selectData.customerContacts" :key="key" :label="item.name" :value="item.custContactId" />
                                      </el-select>
                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>

                              <el-row class="">
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item" label="账单联系人:">
                                    <template>
                                      <el-select v-model="caseDetailFoemData.billCustContactId" :clearable="true" default-first-option filterable placeholder="请选择">
                                        <el-option v-for="(item,key) in selectData.billContacts" :key="key" :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId" />
                                      </el-select>

                                    </template>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item" label="账单地址:">
                                    <template>
                                      <el-select v-model="caseDetailFoemData.billAddrId" :clearable="true" default-first-option filterable placeholder="请选择">
                                        <el-option v-for="(item,key) in selectData.billAdds" :key="key" :label="(item.addressCn||'')+(item.addressEn||'')" :value="item.addrId" />
                                      </el-select>

                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-row class="fullRow">
                                <el-col :span="24">
                                  <el-form-item class="postInfo-container-item" label="折扣率:">
                                    <template>
                                      <!-- <el-input-number size="medium" v-model="caseDetailFoemData.discount" :min="1" :max="100" controls-position="right"></el-input-number> -->
                                      <el-input v-model="caseDetailFoemData.discount" type="number" min="1" max="100" />
                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="申请人:">-->
                              <!--                                <el-select :clearable="true" :remote-method="remoteMethod" multiple default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                              <!--                                           v-model="caseDetailFoemData.lawsuitApplicantArray">-->
                              <!--                                  <el-option :key="key" :label="item.applicantName" :value="item.appId" v-for="(item,key) in selectData.appList" />-->
                              <!--                                </el-select>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="侵权人:">-->
                              <!--                                <template>-->
                              <!--                                  <el-button style="float:right" size="mini" type="primary" @click="addlaw(4)">添加</el-button>-->
                              <!--                                  <el-table size="mini" :data="caseDetailFoemData.lawsuitConflicterList" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                              <!--                                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                              <!--                                    <el-table-column label="目标名称" align="left" width>-->
                              <!--                                      <template slot-scope="scope">-->
                              <!--                                        <el-select :clearable="true" :remote-method="remotepaternalUnit1" default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                              <!--                                                   v-model="scope.row.conId">-->
                              <!--                                          <el-option :key="key" :label="item.fullname" :value="item.conId" v-for="(item,key) in selectData.liyiarr" />-->
                              <!--                                        </el-select>-->
                              <!--                                      </template>-->
                              <!--                                    </el-table-column>-->
                              <!--                                    <el-table-column label="目标性质" align="left" width>-->
                              <!--                                      <template slot-scope="scope">-->
                              <!--                                        <el-select :clearable="true" default-first-option filterable reserve-keyword-->
                              <!--                                                   v-model="scope.row.conNature">-->
                              <!--                                          <el-option :key="key" :label="item" :value="item" v-for="(item,key) in ['经销型','生产型']"></el-option>-->
                              <!--                                        </el-select>-->
                              <!--                                      </template>-->
                              <!--                                    </el-table-column>-->
                              <!--                                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                              <!--                                      <template slot-scope="scope">-->

                              <!--                                        <el-button size="mini" type="text" @click="handledeleElementglgs('lawsuitConflicterList',scope.$index)">删除</el-button>-->

                              <!--                                      </template>-->
                              <!--                                    </el-table-column>-->
                              <!--                                  </el-table>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>

                      <el-row>
                        <el-col :span="24" class="tilteSpan">
                          <span id="sbxx-title">权利信息</span>
                        </el-col>
                      </el-row>

                      <el-row>
                        <el-col :span="24" class="form-con-item">
                          <el-row class="form-border">
                            <el-col :span="24">

                              <el-row class="">
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item" label="权利授权号:">
                                    <template>

                                      <el-input  v-model="caseDetailFoemData.droitNumber" />
                                    </template>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item  uploader-custfile" label="权利名称:" prop="">

                                    <template>
                                      <el-input  v-model="caseDetailFoemData.rightName" />

                                    </template>
                                  </el-form-item>

                                </el-col>
                              </el-row>
                              <el-row class="">
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item" label="权利类型:">
                                    <el-select v-model="caseDetailFoemData.rightType" :clearable="true" default-first-option filterable placeholder="请选择">
                                      <el-option  v-for="(item,key) in selectDataByClass['1020']"   :key="key" :label="item.typeName" :value="item.id"/>
                                    </el-select>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item" label="权利所属:">
                                    <el-input  v-model="caseDetailFoemData.rightBelongType" />

                                  </el-form-item>
                                </el-col>

                              </el-row>

                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item uploader-custfile" label="商标图样:">-->
                              <!--                                <template>-->

                              <!--                                  <div><img :src="tyimage" style="width:100px;height:100px;margin: 10px 10px;" v-if="tyimage"></div>-->

                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="商标国际分类">-->
                              <!--                                <template>-->

                              <!--                                  <span>{{goodsDetailData.goodClasses}}</span>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="商品/服务项目">-->
                              <!--                                <template>-->
                              <!--                                  <Goods :disabled="true" :appId='caseDetailFoemData.appId' @getGoods='getGoods' @delgood='delgood' :goodsListData='goodsDetailData.goods'></Goods>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->

                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="种类:">-->
                              <!--                                <template>-->
                              <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.tmType">-->
                              <!--                                    <el-radio label="1">一般</el-radio>-->
                              <!--                                    <el-radio label="2">集体</el-radio>-->
                              <!--                                    <el-radio label="3">证明</el-radio>-->
                              <!--                                  </el-radio-group>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row v-if="goodsDetailData.tmType=='2'||goodsDetailData.tmType=='3'" class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="集体/证明商标使用管理规则:">-->
                              <!--                                <template>-->
                              <!--                                  <el-input :disabled='true' v-model="goodsDetailData.memberRule" :rows="3" type="textarea" />-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row v-if="goodsDetailData.tmType=='2'||goodsDetailData.tmType=='3'" class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="集体/证明商标使用管理规则(附件):">-->
                              <!--                                <template>-->
                              <!--                                  <el-input v-model="fileName[1005]" />-->

                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row v-if="goodsDetailData.tmType=='2'" class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="集体成员名单:">-->
                              <!--                                <template>-->
                              <!--                                  <el-input :disabled='true' v-model="goodsDetailData.memberNamelist" :rows="4" placeholder="请输入内容" type="textarea" />-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row v-if="goodsDetailData.tmType=='2'" class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="集体成员名单(附件):">-->
                              <!--                                <template>-->
                              <!--                                  <el-input v-model="fileName[1006]" />-->

                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row v-if="goodsDetailData.tmType=='3'" class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="申请人是否具备检测能力:">-->
                              <!--                                <template>-->
                              <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.isAppWithDetectAbility">-->
                              <!--                                    <el-radio label="0">否</el-radio>-->
                              <!--                                    <el-radio label="1">是</el-radio>-->
                              <!--                                  </el-radio-group>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row v-if="goodsDetailData.isAppWithDetectAbility=='是'" class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="申请人检测资质证书（附件）:">-->
                              <!--                                <template>-->
                              <!--                                  <el-input v-model="fileName[1007]" />-->
                              <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1007',$event)">上传</!&ndash;&gt; &ndash;&gt;-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row v-if="goodsDetailData.isAppWithDetectAbility=='是'" class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="申请人专业检测设备清单:">-->
                              <!--                                <template>-->
                              <!--                                  <el-input v-model="fileName[1008]" />-->
                              <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1008',$event)">上传</el-button> &ndash;&gt;-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row v-if="goodsDetailData.isAppWithDetectAbility=='是'" class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="申请人专业技术人员名单（附件）:">-->
                              <!--                                <template>-->
                              <!--                                  <el-input v-model="fileName[1009]" />-->

                              <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1009',$event)">上传</el-button> &ndash;&gt;-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row v-if="goodsDetailData.isAppWithDetectAbility=='是'" class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="申请人技术人员证书:">-->
                              <!--                                <template>-->
                              <!--                                  <el-input v-model="fileName[1010]" />-->

                              <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1010',$event)">上传</el-button> &ndash;&gt;-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->

                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="是否三维标志:">-->
                              <!--                                <template>-->
                              <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.ifSolidTm">-->
                              <!--                                    <el-radio label="0">否</el-radio>-->
                              <!--                                    <el-radio label="1">是</el-radio>-->

                              <!--                                  </el-radio-group>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="是否颜色组合:">-->
                              <!--                                <template>-->
                              <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.colorSign">-->
                              <!--                                    <el-radio label="0">否</el-radio>-->
                              <!--                                    <el-radio label="1">是</el-radio>-->

                              <!--                                  </el-radio-group>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row class="fullRow">-->
                              <!--                            <el-col :span="24">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="指定颜色:">-->
                              <!--                                <template>-->
                              <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.assignColor">-->
                              <!--                                    <el-radio :label="false">否</el-radio>-->
                              <!--                                    <el-radio :label="true">是</el-radio>-->

                              <!--                                  </el-radio-group>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->
                              <!--                          <el-row class="">-->
                              <!--                            <el-col :span="12">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="声音标志:">-->
                              <!--                                <template>-->
                              <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.tmVoice">-->
                              <!--                                    <el-radio label="否"/>-->
                              <!--                                    <el-radio label="是"/>-->

                              <!--                                  </el-radio-group>-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                            <el-col v-if="goodsDetailData.tmVoice=='1'" :span="12">-->
                              <!--                              <el-form-item class="postInfo-container-item" label="声音文件:">-->
                              <!--                                <template>-->
                              <!--                                  <el-input v-model="fileName[1016]" />-->
                              <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1016',$event)">上传</el-button> &ndash;&gt;-->
                              <!--                                </template>-->
                              <!--                              </el-form-item>-->
                              <!--                            </el-col>-->
                              <!--                          </el-row>-->

                            </el-col>

                          </el-row>
                        </el-col>

                      </el-row>
                      <el-row>
                        <el-col :span="24" class="tilteSpan">
                          <span id="gfdsr-title">各方当事人</span>
                        </el-col>
                      </el-row>
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <!--                          <el-form-item class="postInfo-container-item" label="我方当事人:" required>-->
                              <!--                            <template>-->
                              <!--                              <el-button style="float:right" size="mini" type="primary" @click="addlaw(1)">添加</el-button>-->
                              <!--                              <el-table size="mini" :data="caseDetailFoemData.agentPartyArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                              <!--                                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                              <!--                                <el-table-column label="名称" align="left" width>-->
                              <!--                                  <template slot-scope="scope">-->

                              <!--                                    <el-select :clearable="true"  @change="((val)=>{appselectChange(val,'agentPartyArray',scope.$index)})" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                              <!--                                               v-model="scope.row.fullname">-->
                              <!--                                      <el-option :key="key" :label="item.applicantName" :value="item.applicantName" v-for="(item,key) in selectData.apps" />-->
                              <!--                                    </el-select>-->
                              <!--                                  </template>-->
                              <!--                                </el-table-column>-->
                              <!--                                <el-table-column label="住所" align="left" width>-->
                              <!--                                  <template slot-scope="scope">-->
                              <!--                                    <el-input :clearable="true" type="text" placeholder="" v-model="scope.row.address">-->
                              <!--                                    </el-input>-->
                              <!--                                  </template>-->
                              <!--                                </el-table-column>-->
                              <!--                                <el-table-column label="诉讼地位" align="left" width>-->
                              <!--                                  <template slot-scope="scope">-->

                              <!--                                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="scope.row.position">-->

                              <!--                                      <el-option :key="key" :label="item.typeName" :value="String(item.id)" :disabled="sxdwdisabled(item.typeName)" v-for="(item,key) in selectDataByClass['1027']" />-->

                              <!--                                    </el-select>-->
                              <!--                                  </template>-->
                              <!--                                </el-table-column>-->

                              <!--                                <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                              <!--                                  <template slot-scope="scope">-->

                              <!--                                    <el-button size="mini" type="text" @click="handledeleElementglgs('agentPartyArray',scope.$index)">删除</el-button>-->

                              <!--                                  </template>-->
                              <!--                                </el-table-column>-->
                              <!--                              </el-table>-->
                              <!--                            </template>-->
                              <!--                          </el-form-item>-->
                              <el-row class="fullRow">
                                <el-col :span="24">
                                  <el-form-item class="postInfo-container-item" label="申请人:" prop="lawsuitApplicantArray">
                                    <el-select :clearable="true" :remote-method="remoteMethod" multiple default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword
                                               v-model="caseDetailFoemData.lawsuitApplicantArray">
                                      <el-option :key="key" :label="item.applicantName" :value="item.appId" v-for="(item,key) in selectData.appList" />
                                    </el-select>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-row class="fullRow">
                                <el-col :span="24">
                                  <el-form-item class="postInfo-container-item" label="侵权人:">
                                    <template>
                                      <el-button style="float:right" size="mini" type="primary" @click="addlaw(4)">添加</el-button>
                                      <el-table size="mini" :data="caseDetailFoemData.lawsuitConflicterList" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                                        <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                                        <el-table-column label="目标名称" align="left" width>
                                          <template slot-scope="scope">
                                            <el-select @change="(val) => changeConId(val, scope.row)" :clearable="true" style="width: 100%;" :remote-method="remotepaternalUnit1" filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword
                                                       v-model="scope.row.conFullname">
                                              <el-option :key="key" :label="item.fullname" :value="item.fullname" v-for="(item,key) in selectData.liyiarr" />
                                            </el-select>
                                          </template>
                                        </el-table-column>
                                        <el-table-column label="目标性质" align="left" width>
                                          <template slot-scope="scope">
                                            <el-select :clearable="true" style="width: 100%;" default-first-option filterable reserve-keyword
                                                       v-model="scope.row.conNature">
                                              <el-option :key="key" :label="item" :value="item" v-for="(item,key) in ['经销型','生产型']"></el-option>
                                            </el-select>
                                          </template>
                                        </el-table-column>
                                        <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                                          <template slot-scope="scope">

                                            <el-button size="mini" type="text" @click="handledeleElementglgs('lawsuitConflicterList',scope.$index)">删除</el-button>

                                          </template>
                                        </el-table-column>
                                      </el-table>
                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                            </el-col>
                          </el-row>
                          <!--                      <el-row class="fullRow">-->
                          <!--                        <el-col :span="24">-->
                          <!--                          <el-form-item class="postInfo-container-item" label="对方当事人:" required>-->
                          <!--                            <template>-->
                          <!--                              <el-button style="float:right" size="mini" type="primary" @click="addlaw(2)">添加</el-button>-->
                          <!--                              <el-table size="mini" :data="caseDetailFoemData.adversaryArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                          <!--                                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                          <!--                                <el-table-column label="名称" align="left" width>-->
                          <!--                                  <template slot-scope="scope">-->

                          <!--                                    <el-select :clearable="true" :remote-method="remotepaternalUnit" @change="((val)=>{lytranappselectChange(val,'adversaryArray',scope.$index)})" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                          <!--                                               v-model="scope.row.fullname">-->
                          <!--                                      <el-option :key="key" :label="item.fullname" :value="item.fullname" v-for="(item,key) in selectData.liyiarr" />-->
                          <!--                                    </el-select>-->
                          <!--                                  </template>-->
                          <!--                                </el-table-column>-->
                          <!--                                <el-table-column label="住所" align="left" width>-->
                          <!--                                  <template slot-scope="scope">-->
                          <!--                                    <el-input :clearable="true" type="text" placeholder="" v-model="scope.row.address">-->
                          <!--                                    </el-input>-->
                          <!--                                  </template>-->
                          <!--                                </el-table-column>-->
                          <!--                                <el-table-column label="诉讼地位" align="left" width>-->
                          <!--                                  <template slot-scope="scope">-->

                          <!--                                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="scope.row.position">-->

                          <!--                                      <el-option :key="key" :label="item.typeName" :value="String(item.id)" v-for="(item,key) in selectDataByClass['1027']" />-->

                          <!--                                    </el-select>-->
                          <!--                                  </template>-->
                          <!--                                </el-table-column>-->

                          <!--                                <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                          <!--                                  <template slot-scope="scope">-->

                          <!--                                    <el-button size="mini" type="text" @click="handledeleElementglgs('adversaryArray',scope.$index)">删除</el-button>-->

                          <!--                                  </template>-->
                          <!--                                </el-table-column>-->
                          <!--                              </el-table>-->
                          <!--                            </template>-->
                          <!--                          </el-form-item>-->
                          <!--                        </el-col>-->
                          <!--                      </el-row>-->
                          <!--                      <el-row class="fullRow">-->
                          <!--                        <el-col :span="24">-->
                          <!--                          <el-form-item class="postInfo-container-item" label="其他当事人:">-->
                          <!--                            <template>-->
                          <!--                              <el-button style="float:right" size="mini" type="primary" @click="addlaw(3)">添加</el-button>-->
                          <!--                              <el-table size="mini" :data="caseDetailFoemData.otherPartyArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                          <!--                                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                          <!--                                <el-table-column label="名称" align="left" width>-->
                          <!--                                  <template slot-scope="scope">-->

                          <!--                                    <el-select :clearable="true" :remote-method="remotepaternalUnit" @change="((val)=>{lytranappselectChange(val,'otherPartyArray',scope.$index)})" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                          <!--                                               v-model="scope.row.fullname">-->
                          <!--                                      <el-option :key="key" :label="item.fullname" :value="item.fullname" v-for="(item,key) in selectData.liyiarr" />-->
                          <!--                                    </el-select>-->
                          <!--                                  </template>-->
                          <!--                                </el-table-column>-->
                          <!--                                <el-table-column label="住所" align="left" width>-->
                          <!--                                  <template slot-scope="scope">-->
                          <!--                                    <el-input :clearable="true" type="text" placeholder="" v-model="scope.row.address">-->
                          <!--                                    </el-input>-->
                          <!--                                  </template>-->
                          <!--                                </el-table-column>-->
                          <!--                                <el-table-column label="诉讼地位" align="left" width>-->
                          <!--                                  <template slot-scope="scope">-->

                          <!--                                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="scope.row.position">-->

                          <!--                                      <el-option :key="key" :label="item.typeName" :value="String(item.id)" v-for="(item,key) in selectDataByClass['1027']" />-->

                          <!--                                    </el-select>-->
                          <!--                                  </template>-->
                          <!--                                </el-table-column>-->

                          <!--                                <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                          <!--                                  <template slot-scope="scope">-->

                          <!--                                    <el-button size="mini" type="text" @click="handledeleElementglgs('otherPartyArray',scope.$index)">删除</el-button>-->

                          <!--                                  </template>-->
                          <!--                                </el-table-column>-->
                          <!--                              </el-table>-->
                          <!--                            </template>-->
                          <!--                          </el-form-item>-->
                          <!--                        </el-col>-->
                          <!--                      </el-row>-->
                        </el-col>
                      </el-row>

                      <el-row>
                        <el-col class="tilteSpan" :span="24">
                          <span id='out-title'>境外信息</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col class="form-con-item" :span="24">

                          <el-row class="form-border">
                            <el-col :span="24">
                              <el-row class="">
                                <el-col :span="12">
                                  <el-form-item label="外方代理所:" :key="caseDetailFoemData.appFromto" class="postInfo-container-item" :prop="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) ? 'foreignAgencyCustId' : ''">
                                    <template>
                                      <!--                                    <virtual-select placeholder="请选择" class="virtual-select" clearable :data="selectData.hzLists"-->
                                      <!--                                                    v-model="caseDetailFoemData.foreignAgencyCustId" @change="wfAgentChange"-->
                                      <!--                                                    filterable>-->
                                      <!--                                    </virtual-select>-->
                                      <el-select default-first-option :clearable='true' @change="wfAgentChange" placeholder="请选择" v-model="caseDetailFoemData.foreignAgencyCustId" filterable>
                                        <el-option v-for="(item,key)  in selectData.hzLists" :key="key" :label="item.label" :value="item.value">
                                        </el-option>
                                      </el-select>
                                    </template>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item label="涉及国家:" :key="caseDetailFoemData.appFromto" class="postInfo-container-item" :prop="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) ? 'appState' : ''">
                                    <template>
                                      <el-select default-first-option :clearable='true' placeholder="请选择"
                                                 v-model="caseDetailFoemData.appState" filterable>
                                        <el-option v-for="(item,key)  in selectData.country" :key="key"
                                                   :label="item.countryCn" :value="item.countryCn">
                                        </el-option>
                                      </el-select>
                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-row class="">
                                <el-col :span="12">
                                  <el-form-item label="外方代理所联系人:" class="postInfo-container-item">
                                    <template>
                                      <el-select default-first-option :clearable='true' placeholder="请选择"
                                                 v-model="caseDetailFoemData.agencyCustContactId" filterable>
                                        <el-option v-for="(item,key)  in selectData.customerContactswf" :key="key"
                                                   :label="item.name" :value="item.custContactId">
                                        </el-option>
                                      </el-select>
                                    </template>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item label="外方代理所地址:" class="postInfo-container-item">
                                    <template>

                                      <el-select default-first-option :clearable='true' placeholder="请选择"
                                                 v-model="caseDetailFoemData.agencyCustAddrId" filterable>
                                        <el-option v-for="(item,key)  in selectData.customerAddrs" :key="key"
                                                   :label="item.addressEn || item.addressCn" :value="item.addrId">
                                        </el-option>
                                      </el-select>
                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-row class="">
                                <el-col :span="24">
                                  <el-form-item label="外方代理所文号:" class="postInfo-container-item">
                                    <template>
                                      <el-input v-model="caseDetailFoemData.foreignAgentNum" placeholder=""></el-input>

                                    </template>
                                  </el-form-item>
                                </el-col>

                              </el-row>
                              <el-row class="fullRow">
                                <el-col :span="24">
                                  <el-form-item label="外方代理所要求:" class="postInfo-container-item">
                                    <template>
                                      <el-input v-model="caseDetailFoemData.agencyCustReq" type="textarea" rows="3"
                                                placeholder=""></el-input>
                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </el-form>
              </template>
            <template v-if="$route.query.taskType==5">
              <el-form ref="postForm" label-width="180px" :model="caseDetailFoemData" :rules="rules" class="form-container" size="mini"  v-if="postFormFlag">
                <div class="createPost-main-container">
                  <div class="form-con">
                    <el-row class="form-border">
                      <el-col :span="24">
                        <el-row class="fullRow">
                          <el-col :span="24">
                            <el-form-item class="postInfo-container-item" label="案件类型:">
                              <!--                            <p v-for="item in caseDetailFoemData.lawsuitCasetypeNameArray">{{item}}</p>-->
                              <!--                            <template>-->
                              <!--                              <span>{{ caseDetailFoemData.caseType?caseDetailFoemData.caseType:'商标行政诉讼' }}</span>-->
                              <!--                            </template>-->
                              <el-multi-cascader
                                ref="multiCascader"
                                v-model="caseDetailFoemData.protectcaseTypeIdList"
                                :options="$store.state.caseInformation.caseTypeList.filter(item=>item.caseTypeId==75)[0].childrens"
                                filterable
                                clearable
                                :props="defaultParams"
                                change-on-select
                                select-children
                                @change="multiCatchange"
                              />
                            </el-form-item>

                          </el-col>
                        </el-row>
                        <el-row class="fullRow">
                          <el-col :span="24">

                            <el-form-item class="postInfo-container-item" label="申请方向:">
                              <template>
                                <el-radio-group v-model="caseDetailFoemData.appFromto">
                                  <el-radio label="外-内" />
                                  <el-radio label="内-内" />
                                  <el-radio label="内-外" />
                                  <el-radio label="外-外" />
                                  <el-radio label="台-内" />
                                </el-radio-group>
                              </template>
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="ajxq-title">案件信息</span>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24" class="form-con-item">
                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="案件文号:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.agentNum" disabled/>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="案件等级:" prop="caseLevel">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.caseLevel">
                                      <el-radio :label="1">普通</el-radio>
                                      <el-radio :label="2">重要</el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>

                            </el-row>
<!--                            <el-row class="fullRow">-->
<!--                              <el-col :span="24">-->
<!--                                <el-form-item class="postInfo-container-item" label="工时类型:">-->
<!--                                  <template>-->
<!--                                    <el-radio-group v-model="caseDetailFoemData.hrType" :disabled="!ifModifyWorkHour">-->
<!--                                      <el-radio :label="1">记录工时</el-radio>-->
<!--                                      <el-radio :label="2">折算工时</el-radio>-->
<!--                                    </el-radio-group>-->
<!--                                  </template>-->
<!--                                </el-form-item>-->
<!--                              </el-col>-->
<!--                            </el-row>-->

                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="案件名称:"  prop="caseName">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.caseName" />
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="案件名称(英文):">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.caseEnName" />
                                  </template>
                                </el-form-item>
                              </el-col>
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


                            <!--                          <el-row class="">-->
                            <!--                            <el-col :span="12">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="管辖法院:">-->
                            <!--                                <template>-->

                            <!--                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.courtCustId">-->

                            <!--                                    <el-option :key="key" :label="item.fullname" :value="item.custId" v-for="(item,key) in selectData.hzLists" />-->

                            <!--                                  </el-select>-->

                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                            <el-col :span="12">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="法院案号:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="caseDetailFoemData.courtCaseNumber" />-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="合议庭:">-->
                            <!--                                <template>-->
                            <!--                                  <el-row class="fullRow">-->
                            <!--                                    <el-col :span="24">-->
                            <!--                                      <el-form-item class="postInfo-container-item" label="审判长:">-->
                            <!--                                        <template>-->
                            <!--                                          <el-input v-model="caseDetailFoemData.collegialBench" />-->
                            <!--                                        </template>-->
                            <!--                                      </el-form-item>-->
                            <!--                                    </el-col>-->
                            <!--                                  </el-row>-->
                            <!--                                  <el-row class="fullRow">-->
                            <!--                                    <el-col :span="24">-->
                            <!--                                      <el-form-item class="postInfo-container-item" label="审判员:">-->
                            <!--                                        <template>-->
                            <!--                                          <el-input v-model="caseDetailFoemData.judge" />-->
                            <!--                                        </template>-->
                            <!--                                      </el-form-item>-->
                            <!--                                    </el-col>-->
                            <!--                                  </el-row>-->
                            <!--                                  <el-row class="fullRow">-->
                            <!--                                    <el-col :span="24">-->
                            <!--                                      <el-form-item class="postInfo-container-item" label="法官助理:">-->
                            <!--                                        <template>-->
                            <!--                                          <el-input v-model="caseDetailFoemData.judgeAssistant" />-->
                            <!--                                        </template>-->
                            <!--                                      </el-form-item>-->
                            <!--                                    </el-col>-->
                            <!--                                  </el-row>-->
                            <!--                                  <el-row class="fullRow">-->
                            <!--                                    <el-col :span="24">-->
                            <!--                                      <el-form-item class="postInfo-container-item" label="书记员:">-->
                            <!--                                        <template>-->
                            <!--                                          <el-input v-model="caseDetailFoemData.clerk" />-->
                            <!--                                        </template>-->
                            <!--                                      </el-form-item>-->
                            <!--                                    </el-col>-->
                            <!--                                  </el-row>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="">-->
                            <!--                            <el-col :span="8">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="审理方式:">-->
                            <!--                                <template>-->

                            <!--                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.hearWay">-->

                            <!--                                    <el-option :key="key" :label="item.typeName" :value="item.id" v-for="(item,key) in selectDataByClass['1134']" />-->

                            <!--                                  </el-select>-->

                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                            <el-col :span="8">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="结案方式:">-->
                            <!--                                <template>-->

                            <!--                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.closeWay">-->

                            <!--                                    <el-option :key="key" :label="item.typeName" :value="item.id" v-for="(item,key) in selectDataByClass['1135']" />-->

                            <!--                                  </el-select>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                            <el-col :span="8">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="判决结果:">-->
                            <!--                                <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.judgment">-->

                            <!--                                  <el-option :key="key" :label="item.typeName" :value="item.id" v-for="(item,key) in selectDataByClass['1029']" />-->

                            <!--                                </el-select>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="所涉及条款:" prop="clause">-->
                            <!--                                <template>-->
                            <!--                                  <div class="textarea_wrap">-->
                            <!--                                    <el-input v-model="caseDetailFoemData.clause" :rows="3" placeholder="请输入" type="textarea" />-->
                            <!--                                    <div class="button_wrap">-->
                            <!--                                      <el-button type="primary" @click="editTextarea('clause')">编辑</el-button>-->
                            <!--                                    </div>-->
                            <!--                                  </div>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="审理尺度分析:" prop="hearMeasureAnalyze">-->
                            <!--                                <template>-->
                            <!--                                  <div class="textarea_wrap">-->
                            <!--                                    <el-input v-model="caseDetailFoemData.hearMeasureAnalyze" :rows="3" placeholder="请输入" type="textarea" />-->
                            <!--                                    <div class="button_wrap">-->
                            <!--                                      <el-button  type="primary" @click="editTextarea('hearMeasureAnalyze')">编辑</el-button>-->
                            <!--                                    </div>-->
                            <!--                                  </div>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="后续工作及建议:" prop="laterSuggest">-->
                            <!--                                <template>-->
                            <!--                                  <div class="textarea_wrap">-->
                            <!--                                    <el-input v-model="caseDetailFoemData.laterSuggest" :rows="3" placeholder="请输入" type="textarea" />-->
                            <!--                                    <div class="button_wrap">-->
                            <!--                                      <el-button  type="primary" @click="editTextarea('laterSuggest')">编辑</el-button>-->
                            <!--                                    </div>-->
                            <!--                                  </div>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="有无情势变更:" prop="situationChange">-->
                            <!--                                <template>-->
                            <!--                                  <div class="textarea_wrap">-->
                            <!--                                    <el-input v-model="caseDetailFoemData.situationChange" :rows="3" placeholder="请输入" type="textarea" />-->
                            <!--                                    <div class="button_wrap">-->
                            <!--                                      <el-button   type="primary" @click="editTextarea('situationChange')">编辑</el-button>-->
                            <!--                                    </div>-->
                            <!--                                  </div>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="关键词:" prop="keyword">-->
                            <!--                                <template>-->
                            <!--                                  <div class="textarea_wrap">-->
                            <!--                                    <el-input v-model="caseDetailFoemData.keyword" :rows="3" placeholder="请输入" type="textarea" />-->
                            <!--                                    <div class="button_wrap">-->
                            <!--                                      <el-button   type="primary" @click="editTextarea('keyword')">编辑</el-button>-->
                            <!--                                    </div>-->
                            <!--                                  </div>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->

                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="备注:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.memo" :rows="3" placeholder="请输入" type="textarea" />

                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-col>

                        </el-row>
                      </el-col>

                    </el-row>

                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="khxx-title">客户信息</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="form-con-item">
                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="客户名称:" prop="custName" class="postInfo-container-item">
                                  <!--                                <template>-->
                                  <!--                                  <el-input :disabled="true" v-model="caseDetailFoemData.custName">-->
                                  <!--                                  </el-input>-->
                                  <!--                                </template>-->
                                  <el-select
                                    v-model="caseDetailFoemData.custId"
                                    ref="custSelect"
                                    :disabled="!$store.getters.permissions.includes(242)"
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
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item"  label="客户文号:">
                                  <template>
                                    <el-input  v-model="caseDetailFoemData.custRefno" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item"  label="客户联系人:">
                                  <template>

                                    <el-select v-model="caseDetailFoemData.custConId" :clearable="true" default-first-option filterable placeholder="请选择" @change="contactchange">
                                      <el-option v-for="(item,key) in selectData.customerContacts" :key="key" :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId" />
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="抄送人:">
                                  <template>
                                    <el-select v-model="caseDetailFoemData.lawsuitCaseCcArray" :clearable="true" default-first-option filterable multiple placeholder="请选择">
                                      <el-option v-for="(item,key) in selectData.customerContacts" :key="key" :label="item.name" :value="item.custContactId" />
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="账单联系人:">
                                  <template>
                                    <el-select v-model="caseDetailFoemData.billCustContactId" :clearable="true" default-first-option filterable placeholder="请选择">
                                      <el-option v-for="(item,key) in selectData.billContacts" :key="key" :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId" />
                                    </el-select>

                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="账单地址:">
                                  <template>
                                    <el-select v-model="caseDetailFoemData.billAddrId" :clearable="true" default-first-option filterable placeholder="请选择">
                                      <el-option v-for="(item,key) in selectData.billAdds" :key="key" :label="(item.addressCn||'')+(item.addressEn||'')" :value="item.addrId" />
                                    </el-select>

                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="折扣率:">
                                  <template>
                                    <!-- <el-input-number size="medium" v-model="caseDetailFoemData.discount" :min="1" :max="100" controls-position="right"></el-input-number> -->
                                    <el-input v-model="caseDetailFoemData.discount" type="number" min="1" max="100" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="申请人:">-->
                            <!--                                <el-select :clearable="true" :remote-method="remoteMethod" multiple default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                            <!--                                           v-model="caseDetailFoemData.lawsuitApplicantArray">-->
                            <!--                                  <el-option :key="key" :label="item.applicantName" :value="item.appId" v-for="(item,key) in selectData.appList" />-->
                            <!--                                </el-select>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="侵权人:">-->
                            <!--                                <template>-->
                            <!--                                  <el-button style="float:right" size="mini" type="primary" @click="addlaw(4)">添加</el-button>-->
                            <!--                                  <el-table size="mini" :data="caseDetailFoemData.lawsuitConflicterList" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                            <!--                                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                            <!--                                    <el-table-column label="目标名称" align="left" width>-->
                            <!--                                      <template slot-scope="scope">-->
                            <!--                                        <el-select :clearable="true" :remote-method="remotepaternalUnit1" default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                            <!--                                                   v-model="scope.row.conId">-->
                            <!--                                          <el-option :key="key" :label="item.fullname" :value="item.conId" v-for="(item,key) in selectData.liyiarr" />-->
                            <!--                                        </el-select>-->
                            <!--                                      </template>-->
                            <!--                                    </el-table-column>-->
                            <!--                                    <el-table-column label="目标性质" align="left" width>-->
                            <!--                                      <template slot-scope="scope">-->
                            <!--                                        <el-select :clearable="true" default-first-option filterable reserve-keyword-->
                            <!--                                                   v-model="scope.row.conNature">-->
                            <!--                                          <el-option :key="key" :label="item" :value="item" v-for="(item,key) in ['经销型','生产型']"></el-option>-->
                            <!--                                        </el-select>-->
                            <!--                                      </template>-->
                            <!--                                    </el-table-column>-->
                            <!--                                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                            <!--                                      <template slot-scope="scope">-->

                            <!--                                        <el-button size="mini" type="text" @click="handledeleElementglgs('lawsuitConflicterList',scope.$index)">删除</el-button>-->

                            <!--                                      </template>-->
                            <!--                                    </el-table-column>-->
                            <!--                                  </el-table>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="sbxx-title">域名信息</span>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24" class="form-con-item">
                        <el-row class="form-border">
                          <el-col :span="24">

                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="域名类型:">
                                  <el-select v-model="caseDetailFoemData.rightType" :clearable="true" default-first-option filterable placeholder="请选择">
                                    <el-option  v-for="(item,key) in selectDataByClass['1030']"  :key="key" :label="item.typeName" :value="item.id"  />
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item  uploader-custfile" label="域名名称:" prop="">
                                  <template>
                                    <el-input  v-model="caseDetailFoemData.rightName" />

                                  </template>
                                </el-form-item>

                              </el-col>
                            </el-row>

                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item uploader-custfile" label="商标图样:">-->
                            <!--                                <template>-->

                            <!--                                  <div><img :src="tyimage" style="width:100px;height:100px;margin: 10px 10px;" v-if="tyimage"></div>-->

                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="商标国际分类">-->
                            <!--                                <template>-->

                            <!--                                  <span>{{goodsDetailData.goodClasses}}</span>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="商品/服务项目">-->
                            <!--                                <template>-->
                            <!--                                  <Goods :disabled="true" :appId='caseDetailFoemData.appId' @getGoods='getGoods' @delgood='delgood' :goodsListData='goodsDetailData.goods'></Goods>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->

                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="种类:">-->
                            <!--                                <template>-->
                            <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.tmType">-->
                            <!--                                    <el-radio label="1">一般</el-radio>-->
                            <!--                                    <el-radio label="2">集体</el-radio>-->
                            <!--                                    <el-radio label="3">证明</el-radio>-->
                            <!--                                  </el-radio-group>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.tmType=='2'||goodsDetailData.tmType=='3'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="集体/证明商标使用管理规则:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input :disabled='true' v-model="goodsDetailData.memberRule" :rows="3" type="textarea" />-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.tmType=='2'||goodsDetailData.tmType=='3'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="集体/证明商标使用管理规则(附件):">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="fileName[1005]" />-->

                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.tmType=='2'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="集体成员名单:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input :disabled='true' v-model="goodsDetailData.memberNamelist" :rows="4" placeholder="请输入内容" type="textarea" />-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.tmType=='2'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="集体成员名单(附件):">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="fileName[1006]" />-->

                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.tmType=='3'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="申请人是否具备检测能力:">-->
                            <!--                                <template>-->
                            <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.isAppWithDetectAbility">-->
                            <!--                                    <el-radio label="0">否</el-radio>-->
                            <!--                                    <el-radio label="1">是</el-radio>-->
                            <!--                                  </el-radio-group>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.isAppWithDetectAbility=='是'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="申请人检测资质证书（附件）:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="fileName[1007]" />-->
                            <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1007',$event)">上传</!&ndash;&gt; &ndash;&gt;-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.isAppWithDetectAbility=='是'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="申请人专业检测设备清单:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="fileName[1008]" />-->
                            <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1008',$event)">上传</el-button> &ndash;&gt;-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.isAppWithDetectAbility=='是'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="申请人专业技术人员名单（附件）:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="fileName[1009]" />-->

                            <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1009',$event)">上传</el-button> &ndash;&gt;-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.isAppWithDetectAbility=='是'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="申请人技术人员证书:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="fileName[1010]" />-->

                            <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1010',$event)">上传</el-button> &ndash;&gt;-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->

                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="是否三维标志:">-->
                            <!--                                <template>-->
                            <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.ifSolidTm">-->
                            <!--                                    <el-radio label="0">否</el-radio>-->
                            <!--                                    <el-radio label="1">是</el-radio>-->

                            <!--                                  </el-radio-group>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="是否颜色组合:">-->
                            <!--                                <template>-->
                            <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.colorSign">-->
                            <!--                                    <el-radio label="0">否</el-radio>-->
                            <!--                                    <el-radio label="1">是</el-radio>-->

                            <!--                                  </el-radio-group>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="指定颜色:">-->
                            <!--                                <template>-->
                            <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.assignColor">-->
                            <!--                                    <el-radio :label="false">否</el-radio>-->
                            <!--                                    <el-radio :label="true">是</el-radio>-->

                            <!--                                  </el-radio-group>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="">-->
                            <!--                            <el-col :span="12">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="声音标志:">-->
                            <!--                                <template>-->
                            <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.tmVoice">-->
                            <!--                                    <el-radio label="否"/>-->
                            <!--                                    <el-radio label="是"/>-->

                            <!--                                  </el-radio-group>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                            <el-col v-if="goodsDetailData.tmVoice=='1'" :span="12">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="声音文件:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="fileName[1016]" />-->
                            <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1016',$event)">上传</el-button> &ndash;&gt;-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->

                          </el-col>

                        </el-row>
                      </el-col>

                    </el-row>
                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="gfdsr-title">各方当事人</span>
                      </el-col>
                    </el-row>
                    <el-row class="form-border">
                      <el-col :span="24">
                        <el-row class="fullRow">
                          <el-col :span="24">
                            <!--                          <el-form-item class="postInfo-container-item" label="我方当事人:" required>-->
                            <!--                            <template>-->
                            <!--                              <el-button style="float:right" size="mini" type="primary" @click="addlaw(1)">添加</el-button>-->
                            <!--                              <el-table size="mini" :data="caseDetailFoemData.agentPartyArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                            <!--                                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                            <!--                                <el-table-column label="名称" align="left" width>-->
                            <!--                                  <template slot-scope="scope">-->

                            <!--                                    <el-select :clearable="true"  @change="((val)=>{appselectChange(val,'agentPartyArray',scope.$index)})" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                            <!--                                               v-model="scope.row.fullname">-->
                            <!--                                      <el-option :key="key" :label="item.applicantName" :value="item.applicantName" v-for="(item,key) in selectData.apps" />-->
                            <!--                                    </el-select>-->
                            <!--                                  </template>-->
                            <!--                                </el-table-column>-->
                            <!--                                <el-table-column label="住所" align="left" width>-->
                            <!--                                  <template slot-scope="scope">-->
                            <!--                                    <el-input :clearable="true" type="text" placeholder="" v-model="scope.row.address">-->
                            <!--                                    </el-input>-->
                            <!--                                  </template>-->
                            <!--                                </el-table-column>-->
                            <!--                                <el-table-column label="诉讼地位" align="left" width>-->
                            <!--                                  <template slot-scope="scope">-->

                            <!--                                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="scope.row.position">-->

                            <!--                                      <el-option :key="key" :label="item.typeName" :value="String(item.id)" :disabled="sxdwdisabled(item.typeName)" v-for="(item,key) in selectDataByClass['1027']" />-->

                            <!--                                    </el-select>-->
                            <!--                                  </template>-->
                            <!--                                </el-table-column>-->

                            <!--                                <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                            <!--                                  <template slot-scope="scope">-->

                            <!--                                    <el-button size="mini" type="text" @click="handledeleElementglgs('agentPartyArray',scope.$index)">删除</el-button>-->

                            <!--                                  </template>-->
                            <!--                                </el-table-column>-->
                            <!--                              </el-table>-->
                            <!--                            </template>-->
                            <!--                          </el-form-item>-->
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="申请人:" prop="appId">
                                  <el-select :clearable="true" :remote-method="remoteMethod"  default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword
                                             v-model="caseDetailFoemData.appId">
                                    <el-option :key="key" :label="item.applicantName" :value="item.appId" v-for="(item,key) in selectData.appList" />
                                  </el-select>
                                </el-form-item>
                              </el-col>
                            </el-row>
<!--                            <el-row class="fullRow">-->
<!--                              <el-col :span="24">-->
<!--                                <el-form-item class="postInfo-container-item" label="侵权人:">-->
<!--                                  <template>-->
<!--                                    <el-button style="float:right" size="mini" type="primary" @click="addlaw(4)">添加</el-button>-->
<!--                                    <el-table size="mini" :data="caseDetailFoemData.lawsuitConflicterList" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
<!--                                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
<!--                                      <el-table-column label="目标名称" align="left" width>-->
<!--                                        <template slot-scope="scope">-->
<!--                                          <el-select :clearable="true" :remote-method="remotepaternalUnit1" default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
<!--                                                     v-model="scope.row.conId">-->
<!--                                            <el-option :key="key" :label="item.fullname" :value="item.conId" v-for="(item,key) in selectData.liyiarr" />-->
<!--                                          </el-select>-->
<!--                                        </template>-->
<!--                                      </el-table-column>-->
<!--                                      <el-table-column label="目标性质" align="left" width>-->
<!--                                        <template slot-scope="scope">-->
<!--                                          <el-select :clearable="true" default-first-option filterable reserve-keyword-->
<!--                                                     v-model="scope.row.conNature">-->
<!--                                            <el-option :key="key" :label="item" :value="item" v-for="(item,key) in ['经销型','生产型']"></el-option>-->
<!--                                          </el-select>-->
<!--                                        </template>-->
<!--                                      </el-table-column>-->
<!--                                      <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
<!--                                        <template slot-scope="scope">-->

<!--                                          <el-button size="mini" type="text" @click="handledeleElementglgs('lawsuitConflicterList',scope.$index)">删除</el-button>-->

<!--                                        </template>-->
<!--                                      </el-table-column>-->
<!--                                    </el-table>-->
<!--                                  </template>-->
<!--                                </el-form-item>-->
<!--                              </el-col>-->
<!--                            </el-row>-->
                          </el-col>
                        </el-row>
                        <!--                      <el-row class="fullRow">-->
                        <!--                        <el-col :span="24">-->
                        <!--                          <el-form-item class="postInfo-container-item" label="对方当事人:" required>-->
                        <!--                            <template>-->
                        <!--                              <el-button style="float:right" size="mini" type="primary" @click="addlaw(2)">添加</el-button>-->
                        <!--                              <el-table size="mini" :data="caseDetailFoemData.adversaryArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                        <!--                                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                        <!--                                <el-table-column label="名称" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-select :clearable="true" :remote-method="remotepaternalUnit" @change="((val)=>{lytranappselectChange(val,'adversaryArray',scope.$index)})" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                        <!--                                               v-model="scope.row.fullname">-->
                        <!--                                      <el-option :key="key" :label="item.fullname" :value="item.fullname" v-for="(item,key) in selectData.liyiarr" />-->
                        <!--                                    </el-select>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                                <el-table-column label="住所" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->
                        <!--                                    <el-input :clearable="true" type="text" placeholder="" v-model="scope.row.address">-->
                        <!--                                    </el-input>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                                <el-table-column label="诉讼地位" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="scope.row.position">-->

                        <!--                                      <el-option :key="key" :label="item.typeName" :value="String(item.id)" v-for="(item,key) in selectDataByClass['1027']" />-->

                        <!--                                    </el-select>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->

                        <!--                                <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-button size="mini" type="text" @click="handledeleElementglgs('adversaryArray',scope.$index)">删除</el-button>-->

                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                              </el-table>-->
                        <!--                            </template>-->
                        <!--                          </el-form-item>-->
                        <!--                        </el-col>-->
                        <!--                      </el-row>-->
                        <!--                      <el-row class="fullRow">-->
                        <!--                        <el-col :span="24">-->
                        <!--                          <el-form-item class="postInfo-container-item" label="其他当事人:">-->
                        <!--                            <template>-->
                        <!--                              <el-button style="float:right" size="mini" type="primary" @click="addlaw(3)">添加</el-button>-->
                        <!--                              <el-table size="mini" :data="caseDetailFoemData.otherPartyArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                        <!--                                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                        <!--                                <el-table-column label="名称" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-select :clearable="true" :remote-method="remotepaternalUnit" @change="((val)=>{lytranappselectChange(val,'otherPartyArray',scope.$index)})" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                        <!--                                               v-model="scope.row.fullname">-->
                        <!--                                      <el-option :key="key" :label="item.fullname" :value="item.fullname" v-for="(item,key) in selectData.liyiarr" />-->
                        <!--                                    </el-select>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                                <el-table-column label="住所" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->
                        <!--                                    <el-input :clearable="true" type="text" placeholder="" v-model="scope.row.address">-->
                        <!--                                    </el-input>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                                <el-table-column label="诉讼地位" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="scope.row.position">-->

                        <!--                                      <el-option :key="key" :label="item.typeName" :value="String(item.id)" v-for="(item,key) in selectDataByClass['1027']" />-->

                        <!--                                    </el-select>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->

                        <!--                                <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-button size="mini" type="text" @click="handledeleElementglgs('otherPartyArray',scope.$index)">删除</el-button>-->

                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                              </el-table>-->
                        <!--                            </template>-->
                        <!--                          </el-form-item>-->
                        <!--                        </el-col>-->
                        <!--                      </el-row>-->
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col class="tilteSpan" :span="24">
                        <span id='out-title'>境外信息</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col class="form-con-item" :span="24">

                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="外方代理所:" :key="caseDetailFoemData.appFromto" class="postInfo-container-item" :prop="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) ? 'foreignAgencyCustId' : ''">
                                  <template>
                                    <!--                                    <virtual-select placeholder="请选择" class="virtual-select" clearable :data="selectData.hzLists"-->
                                    <!--                                                    v-model="caseDetailFoemData.foreignAgencyCustId" @change="wfAgentChange"-->
                                    <!--                                                    filterable>-->
                                    <!--                                    </virtual-select>-->
                                    <el-select default-first-option :clearable='true' @change="wfAgentChange" placeholder="请选择" v-model="caseDetailFoemData.foreignAgencyCustId" filterable>
                                      <el-option v-for="(item,key)  in selectData.hzLists" :key="key" :label="item.label" :value="item.value">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="涉及国家:" :key="caseDetailFoemData.appFromto" class="postInfo-container-item" :prop="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) ? 'appState' : ''">
                                  <template>
                                    <el-select default-first-option :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.appState" filterable>
                                      <el-option v-for="(item,key)  in selectData.country" :key="key"
                                                 :label="item.countryCn" :value="item.countryCn">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="外方代理所联系人:" class="postInfo-container-item">
                                  <template>
                                    <el-select default-first-option :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.agencyCustContactId" filterable>
                                      <el-option v-for="(item,key)  in selectData.customerContactswf" :key="key"
                                                 :label="item.name" :value="item.custContactId">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="外方代理所地址:" class="postInfo-container-item">
                                  <template>

                                    <el-select default-first-option :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.agencyCustAddrId" filterable>
                                      <el-option v-for="(item,key)  in selectData.customerAddrs" :key="key"
                                                 :label="item.addressEn || item.addressCn" :value="item.addrId">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="24">
                                <el-form-item label="外方代理所文号:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.foreignAgentNum" placeholder=""></el-input>

                                  </template>
                                </el-form-item>
                              </el-col>

                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="外方代理所要求:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.agencyCustReq" type="textarea" rows="3"
                                              placeholder=""></el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-form>
            </template>
            <template v-if="$route.query.taskType==6">
              <el-form ref="postForm" label-width="180px" :model="caseDetailFoemData" :rules="rules" class="form-container" size="mini"  v-if="postFormFlag">
                <div class="createPost-main-container">
                  <div class="form-con">
                    <el-row class="form-border">
                      <el-col :span="24">
                        <el-row class="fullRow">
                          <el-col :span="12">
                            <el-form-item class="postInfo-container-item" label="案件类型:">
                              <!--                            <p v-for="item in caseDetailFoemData.lawsuitCasetypeNameArray">{{item}}</p>-->
                              <!--                            <template>-->
                              <!--                              <span>{{ caseDetailFoemData.caseType?caseDetailFoemData.caseType:'商标行政诉讼' }}</span>-->
                              <!--                            </template>-->
                              <el-multi-cascader
                                ref="multiCascader"
                                v-model="caseDetailFoemData.protectcaseTypeIdList"
                                :options="$store.state.caseInformation.caseTypeList.filter(item=>item.caseTypeId==76)[0].childrens"
                                filterable
                                clearable
                                :props="defaultParams"
                                change-on-select
                                select-children
                                @change="multiCatchange"
                              />
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item class="postInfo-container-item" label="代理机构:">
                              <template>
                                <el-select
                                  style="width: 100%;"
                                  :clearable="true"
                                  default-first-option
                                  filterable placeholder="请选择"
                                  v-model="caseDetailFoemData.whdAgencyName">
                                  <el-option v-for="(item, index) in selectData.agencyList" :key="index" :label="item.typeName" :value="item.typeName" />
                                </el-select>
                              </template>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row class="fullRow">
                          <el-col :span="12">
                            <el-form-item class="postInfo-container-item" label="申请方向:">
                              <template>
                                <el-radio-group v-model="caseDetailFoemData.appFromto">
                                  <el-radio label="外-内" />
                                  <el-radio label="内-内" />
                                  <el-radio label="内-外" />
                                  <el-radio label="外-外" />
                                  <el-radio label="台-内" />
                                </el-radio-group>
                              </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item class="postInfo-container-item" label="交案账号:">
                              <template>
                                <el-input style="width: 100%;" v-model="caseDetailFoemData.submissionAccount" placeholder="请输入" />
                              </template>
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="ajxq-title">案件信息</span>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24" class="form-con-item">
                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="案件文号:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.agentNum" disabled/>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="案件等级:" prop="caseLevel">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.caseLevel">
                                      <el-radio :label="1">普通</el-radio>
                                      <el-radio :label="2">重要</el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>

                            </el-row>
<!--                            <el-row class="fullRow">-->
<!--                              <el-col :span="24">-->
<!--                                <el-form-item class="postInfo-container-item" label="工时类型:">-->
<!--                                  <template>-->
<!--                                    <el-radio-group v-model="caseDetailFoemData.hrType" :disabled="!ifModifyWorkHour">-->
<!--                                      <el-radio :label="1">记录工时</el-radio>-->
<!--                                      <el-radio :label="2">折算工时</el-radio>-->
<!--                                    </el-radio-group>-->
<!--                                  </template>-->
<!--                                </el-form-item>-->
<!--                              </el-col>-->
<!--                            </el-row>-->

                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="案件名称:" prop="caseName">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.caseName" />
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="案件名称(英文):">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.caseEnName" />
                                  </template>
                                </el-form-item>
                              </el-col>
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
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="备注:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.memo" :rows="3" placeholder="请输入" type="textarea" />

                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-col>

                        </el-row>
                      </el-col>

                    </el-row>

                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="khxx-title">客户信息</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="form-con-item">
                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="客户名称:" prop="custName" class="postInfo-container-item">
                                  <!--                                <template>-->
                                  <!--                                  <el-input :disabled="true" v-model="caseDetailFoemData.custName">-->
                                  <!--                                  </el-input>-->
                                  <!--                                </template>-->
                                  <el-select
                                    v-model="caseDetailFoemData.custId"
                                    ref="custSelect"
                                    :disabled="!$store.getters.permissions.includes(242)"
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
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item"  label="客户文号:">
                                  <template>
                                    <el-input  v-model="caseDetailFoemData.custRefno" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item"  label="客户联系人:">
                                  <template>

                                    <el-select v-model="caseDetailFoemData.custConId" :clearable="true" default-first-option filterable placeholder="请选择" @change="contactchange">
                                      <el-option v-for="(item,key) in selectData.customerContacts" :key="key" :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId" />
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="抄送人:">
                                  <template>
                                    <el-select v-model="caseDetailFoemData.lawsuitCaseCcArray" :clearable="true" default-first-option filterable multiple placeholder="请选择">
                                      <el-option v-for="(item,key) in selectData.customerContacts" :key="key" :label="item.name" :value="item.custContactId" />
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="账单联系人:">
                                  <template>
                                    <el-select v-model="caseDetailFoemData.billCustContactId" :clearable="true" default-first-option filterable placeholder="请选择">
                                      <el-option v-for="(item,key) in selectData.billContacts" :key="key" :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId" />
                                    </el-select>

                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="账单地址:">
                                  <template>
                                    <el-select v-model="caseDetailFoemData.billAddrId" :clearable="true" default-first-option filterable placeholder="请选择">
                                      <el-option v-for="(item,key) in selectData.billAdds" :key="key" :label="(item.addressCn||'')+(item.addressEn||'')" :value="item.addrId" />
                                    </el-select>

                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="折扣率:">
                                  <template>
                                    <!-- <el-input-number size="medium" v-model="caseDetailFoemData.discount" :min="1" :max="100" controls-position="right"></el-input-number> -->
                                    <el-input v-model="caseDetailFoemData.discount" type="number" min="1" max="100" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="申请人:">-->
                            <!--                                <el-select :clearable="true" :remote-method="remoteMethod" multiple default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                            <!--                                           v-model="caseDetailFoemData.lawsuitApplicantArray">-->
                            <!--                                  <el-option :key="key" :label="item.applicantName" :value="item.appId" v-for="(item,key) in selectData.appList" />-->
                            <!--                                </el-select>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="侵权人:">-->
                            <!--                                <template>-->
                            <!--                                  <el-button style="float:right" size="mini" type="primary" @click="addlaw(4)">添加</el-button>-->
                            <!--                                  <el-table size="mini" :data="caseDetailFoemData.lawsuitConflicterList" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                            <!--                                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                            <!--                                    <el-table-column label="目标名称" align="left" width>-->
                            <!--                                      <template slot-scope="scope">-->
                            <!--                                        <el-select :clearable="true" :remote-method="remotepaternalUnit1" default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                            <!--                                                   v-model="scope.row.conId">-->
                            <!--                                          <el-option :key="key" :label="item.fullname" :value="item.conId" v-for="(item,key) in selectData.liyiarr" />-->
                            <!--                                        </el-select>-->
                            <!--                                      </template>-->
                            <!--                                    </el-table-column>-->
                            <!--                                    <el-table-column label="目标性质" align="left" width>-->
                            <!--                                      <template slot-scope="scope">-->
                            <!--                                        <el-select :clearable="true" default-first-option filterable reserve-keyword-->
                            <!--                                                   v-model="scope.row.conNature">-->
                            <!--                                          <el-option :key="key" :label="item" :value="item" v-for="(item,key) in ['经销型','生产型']"></el-option>-->
                            <!--                                        </el-select>-->
                            <!--                                      </template>-->
                            <!--                                    </el-table-column>-->
                            <!--                                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                            <!--                                      <template slot-scope="scope">-->

                            <!--                                        <el-button size="mini" type="text" @click="handledeleElementglgs('lawsuitConflicterList',scope.$index)">删除</el-button>-->

                            <!--                                      </template>-->
                            <!--                                    </el-table-column>-->
                            <!--                                  </el-table>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="sbxx-title">著作权信息</span>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24" class="form-con-item">
                        <el-row class="form-border">
                          <el-col :span="24">

                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="著作权类型:">
                                  <el-select v-model="caseDetailFoemData.rightBelongType" :clearable="true" default-first-option filterable placeholder="请选择">
                                    <el-option  v-for="(item,key) in selectDataByClass['1031']"  :key="key" :label="item.typeName" :value="String(item.id)"  />
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item  uploader-custfile" label="著作权名称:" prop="">
                                  <template>
                                    <el-input  v-model="caseDetailFoemData.rightName" />
                                  </template>
                                </el-form-item>

                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="著作权样本:">
                                  <el-input disabled style="width: 50%;" v-model="fileName[1075]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1075',$event)">上传
                                    </el-button>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col>
                                <el-form-item class="postInfo-container-item" label="登记号:">
                                    <el-input style="width: 25%;" v-model="caseDetailFoemData.droitNumber" placeholder="请输入" />
                                </el-form-item>
                              </el-col>
                            </el-row>


                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item uploader-custfile" label="商标图样:">-->
                            <!--                                <template>-->

                            <!--                                  <div><img :src="tyimage" style="width:100px;height:100px;margin: 10px 10px;" v-if="tyimage"></div>-->

                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="商标国际分类">-->
                            <!--                                <template>-->

                            <!--                                  <span>{{goodsDetailData.goodClasses}}</span>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="商品/服务项目">-->
                            <!--                                <template>-->
                            <!--                                  <Goods :disabled="true" :appId='caseDetailFoemData.appId' @getGoods='getGoods' @delgood='delgood' :goodsListData='goodsDetailData.goods'></Goods>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->

                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="种类:">-->
                            <!--                                <template>-->
                            <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.tmType">-->
                            <!--                                    <el-radio label="1">一般</el-radio>-->
                            <!--                                    <el-radio label="2">集体</el-radio>-->
                            <!--                                    <el-radio label="3">证明</el-radio>-->
                            <!--                                  </el-radio-group>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.tmType=='2'||goodsDetailData.tmType=='3'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="集体/证明商标使用管理规则:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input :disabled='true' v-model="goodsDetailData.memberRule" :rows="3" type="textarea" />-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.tmType=='2'||goodsDetailData.tmType=='3'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="集体/证明商标使用管理规则(附件):">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="fileName[1005]" />-->

                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.tmType=='2'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="集体成员名单:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input :disabled='true' v-model="goodsDetailData.memberNamelist" :rows="4" placeholder="请输入内容" type="textarea" />-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.tmType=='2'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="集体成员名单(附件):">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="fileName[1006]" />-->

                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.tmType=='3'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="申请人是否具备检测能力:">-->
                            <!--                                <template>-->
                            <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.isAppWithDetectAbility">-->
                            <!--                                    <el-radio label="0">否</el-radio>-->
                            <!--                                    <el-radio label="1">是</el-radio>-->
                            <!--                                  </el-radio-group>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.isAppWithDetectAbility=='是'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="申请人检测资质证书（附件）:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="fileName[1007]" />-->
                            <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1007',$event)">上传</!&ndash;&gt; &ndash;&gt;-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.isAppWithDetectAbility=='是'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="申请人专业检测设备清单:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="fileName[1008]" />-->
                            <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1008',$event)">上传</el-button> &ndash;&gt;-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.isAppWithDetectAbility=='是'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="申请人专业技术人员名单（附件）:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="fileName[1009]" />-->

                            <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1009',$event)">上传</el-button> &ndash;&gt;-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row v-if="goodsDetailData.isAppWithDetectAbility=='是'" class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="申请人技术人员证书:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="fileName[1010]" />-->

                            <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1010',$event)">上传</el-button> &ndash;&gt;-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->

                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="是否三维标志:">-->
                            <!--                                <template>-->
                            <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.ifSolidTm">-->
                            <!--                                    <el-radio label="0">否</el-radio>-->
                            <!--                                    <el-radio label="1">是</el-radio>-->

                            <!--                                  </el-radio-group>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="是否颜色组合:">-->
                            <!--                                <template>-->
                            <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.colorSign">-->
                            <!--                                    <el-radio label="0">否</el-radio>-->
                            <!--                                    <el-radio label="1">是</el-radio>-->

                            <!--                                  </el-radio-group>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="指定颜色:">-->
                            <!--                                <template>-->
                            <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.assignColor">-->
                            <!--                                    <el-radio :label="false">否</el-radio>-->
                            <!--                                    <el-radio :label="true">是</el-radio>-->

                            <!--                                  </el-radio-group>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="">-->
                            <!--                            <el-col :span="12">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="声音标志:">-->
                            <!--                                <template>-->
                            <!--                                  <el-radio-group :disabled='true' v-model="goodsDetailData.tmVoice">-->
                            <!--                                    <el-radio label="否"/>-->
                            <!--                                    <el-radio label="是"/>-->

                            <!--                                  </el-radio-group>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                            <el-col v-if="goodsDetailData.tmVoice=='1'" :span="12">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="声音文件:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="fileName[1016]" />-->
                            <!--                                  &lt;!&ndash; <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1016',$event)">上传</el-button> &ndash;&gt;-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->

                          </el-col>

                        </el-row>
                      </el-col>

                    </el-row>
                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="gfdsr-title">各方当事人</span>
                      </el-col>
                    </el-row>
                    <el-row class="form-border">
                      <el-col :span="24">
                        <el-row class="fullRow">
                          <el-col :span="24">
                            <!--                          <el-form-item class="postInfo-container-item" label="我方当事人:" required>-->
                            <!--                            <template>-->
                            <!--                              <el-button style="float:right" size="mini" type="primary" @click="addlaw(1)">添加</el-button>-->
                            <!--                              <el-table size="mini" :data="caseDetailFoemData.agentPartyArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                            <!--                                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                            <!--                                <el-table-column label="名称" align="left" width>-->
                            <!--                                  <template slot-scope="scope">-->

                            <!--                                    <el-select :clearable="true"  @change="((val)=>{appselectChange(val,'agentPartyArray',scope.$index)})" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                            <!--                                               v-model="scope.row.fullname">-->
                            <!--                                      <el-option :key="key" :label="item.applicantName" :value="item.applicantName" v-for="(item,key) in selectData.apps" />-->
                            <!--                                    </el-select>-->
                            <!--                                  </template>-->
                            <!--                                </el-table-column>-->
                            <!--                                <el-table-column label="住所" align="left" width>-->
                            <!--                                  <template slot-scope="scope">-->
                            <!--                                    <el-input :clearable="true" type="text" placeholder="" v-model="scope.row.address">-->
                            <!--                                    </el-input>-->
                            <!--                                  </template>-->
                            <!--                                </el-table-column>-->
                            <!--                                <el-table-column label="诉讼地位" align="left" width>-->
                            <!--                                  <template slot-scope="scope">-->

                            <!--                                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="scope.row.position">-->

                            <!--                                      <el-option :key="key" :label="item.typeName" :value="String(item.id)" :disabled="sxdwdisabled(item.typeName)" v-for="(item,key) in selectDataByClass['1027']" />-->

                            <!--                                    </el-select>-->
                            <!--                                  </template>-->
                            <!--                                </el-table-column>-->

                            <!--                                <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                            <!--                                  <template slot-scope="scope">-->

                            <!--                                    <el-button size="mini" type="text" @click="handledeleElementglgs('agentPartyArray',scope.$index)">删除</el-button>-->

                            <!--                                  </template>-->
                            <!--                                </el-table-column>-->
                            <!--                              </el-table>-->
                            <!--                            </template>-->
                            <!--                          </el-form-item>-->
                            <el-row class="">
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item" label="申请人中文名称:" prop="appCnName">
                                    <el-autocomplete class="inline-input" :clearable='true' @select="handleAppCnName"
                                                     v-model="caseDetailFoemData.appCnName"
                                                     :fetch-suggestions="remotepinput" placeholder="请输入内容"
                                                     :trigger-on-focus="true">
                                    </el-autocomplete>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item label="申请人英文名称:" class="postInfo-container-item">
                                    <el-input style="width: 100%;" v-model="caseDetailFoemData.appEnName">
                                    </el-input>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-row class="fullRow">
                                <el-col :span="12">
                                  <el-form-item label="申请人中文地址:" class="postInfo-container-item">
                                    <Autocomplete style="width: 100%;" @select="appCnAddrChange" v-model="caseDetailFoemData.appCnAddr"
                                                  type="addressCn"
                                                  :list="$commonUtils.unique(selectData.appaddr.filter(itm=>!!itm.addressCn), 'addressCn')"></Autocomplete>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item label="申请人英文地址:" class="postInfo-container-item">
                                    <el-select style="width: 100%;" :clearable="true" allow-create default-first-option filterable
                                               placeholder="请选择" v-model="caseDetailFoemData.appEnAddr">
                                      <el-option :key="key" :label="item.addressEn" :value="item.addressEn"
                                                 v-for="(item,key) in $commonUtils.unique(selectData.appaddr.filter(itm=>!!itm.addressEn), 'addressEn')"/>
                                    </el-select>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-row class="fullRow">
                                <el-col :span="24">
                                  <el-form-item label="国籍:" prop="appCountry" class="postInfo-container-item">
                                    <template>
                                      <el-select style="width: 25%;" default-first-option :clearable='true'
                                                 placeholder="请选择" v-model="caseDetailFoemData.appCountry" filterable>
                                        <el-option v-for="(item,key)  in selectData.country" :key="key"
                                                   :label="item.countryCn" :value="item.countryCn">
                                        </el-option>
                                      </el-select>
                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>
<!--                            <el-row class="fullRow">-->
<!--                              <el-col :span="24">-->
<!--                                <el-form-item class="postInfo-container-item" label="侵权人:">-->
<!--                                  <template>-->
<!--                                    <el-button style="float:right" size="mini" type="primary" @click="addlaw(4)">添加</el-button>-->
<!--                                    <el-table size="mini" :data="caseDetailFoemData.lawsuitConflicterList" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
<!--                                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
<!--                                      <el-table-column label="目标名称" align="left" width>-->
<!--                                        <template slot-scope="scope">-->
<!--                                          <el-select :clearable="true" :remote-method="remotepaternalUnit1" default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
<!--                                                     v-model="scope.row.conId">-->
<!--                                            <el-option :key="key" :label="item.fullname" :value="item.conId" v-for="(item,key) in selectData.liyiarr" />-->
<!--                                          </el-select>-->
<!--                                        </template>-->
<!--                                      </el-table-column>-->
<!--                                      <el-table-column label="目标性质" align="left" width>-->
<!--                                        <template slot-scope="scope">-->
<!--                                          <el-select :clearable="true" default-first-option filterable reserve-keyword-->
<!--                                                     v-model="scope.row.conNature">-->
<!--                                            <el-option :key="key" :label="item" :value="item" v-for="(item,key) in ['经销型','生产型']"></el-option>-->
<!--                                          </el-select>-->
<!--                                        </template>-->
<!--                                      </el-table-column>-->
<!--                                      <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
<!--                                        <template slot-scope="scope">-->

<!--                                          <el-button size="mini" type="text" @click="handledeleElementglgs('lawsuitConflicterList',scope.$index)">删除</el-button>-->

<!--                                        </template>-->
<!--                                      </el-table-column>-->
<!--                                    </el-table>-->
<!--                                  </template>-->
<!--                                </el-form-item>-->
<!--                              </el-col>-->
<!--                            </el-row>-->
                          </el-col>
                        </el-row>
                        <!--                      <el-row class="fullRow">-->
                        <!--                        <el-col :span="24">-->
                        <!--                          <el-form-item class="postInfo-container-item" label="对方当事人:" required>-->
                        <!--                            <template>-->
                        <!--                              <el-button style="float:right" size="mini" type="primary" @click="addlaw(2)">添加</el-button>-->
                        <!--                              <el-table size="mini" :data="caseDetailFoemData.adversaryArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                        <!--                                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                        <!--                                <el-table-column label="名称" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-select :clearable="true" :remote-method="remotepaternalUnit" @change="((val)=>{lytranappselectChange(val,'adversaryArray',scope.$index)})" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                        <!--                                               v-model="scope.row.fullname">-->
                        <!--                                      <el-option :key="key" :label="item.fullname" :value="item.fullname" v-for="(item,key) in selectData.liyiarr" />-->
                        <!--                                    </el-select>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                                <el-table-column label="住所" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->
                        <!--                                    <el-input :clearable="true" type="text" placeholder="" v-model="scope.row.address">-->
                        <!--                                    </el-input>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                                <el-table-column label="诉讼地位" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="scope.row.position">-->

                        <!--                                      <el-option :key="key" :label="item.typeName" :value="String(item.id)" v-for="(item,key) in selectDataByClass['1027']" />-->

                        <!--                                    </el-select>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->

                        <!--                                <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-button size="mini" type="text" @click="handledeleElementglgs('adversaryArray',scope.$index)">删除</el-button>-->

                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                              </el-table>-->
                        <!--                            </template>-->
                        <!--                          </el-form-item>-->
                        <!--                        </el-col>-->
                        <!--                      </el-row>-->
                        <!--                      <el-row class="fullRow">-->
                        <!--                        <el-col :span="24">-->
                        <!--                          <el-form-item class="postInfo-container-item" label="其他当事人:">-->
                        <!--                            <template>-->
                        <!--                              <el-button style="float:right" size="mini" type="primary" @click="addlaw(3)">添加</el-button>-->
                        <!--                              <el-table size="mini" :data="caseDetailFoemData.otherPartyArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                        <!--                                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                        <!--                                <el-table-column label="名称" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-select :clearable="true" :remote-method="remotepaternalUnit" @change="((val)=>{lytranappselectChange(val,'otherPartyArray',scope.$index)})" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                        <!--                                               v-model="scope.row.fullname">-->
                        <!--                                      <el-option :key="key" :label="item.fullname" :value="item.fullname" v-for="(item,key) in selectData.liyiarr" />-->
                        <!--                                    </el-select>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                                <el-table-column label="住所" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->
                        <!--                                    <el-input :clearable="true" type="text" placeholder="" v-model="scope.row.address">-->
                        <!--                                    </el-input>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                                <el-table-column label="诉讼地位" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="scope.row.position">-->

                        <!--                                      <el-option :key="key" :label="item.typeName" :value="String(item.id)" v-for="(item,key) in selectDataByClass['1027']" />-->

                        <!--                                    </el-select>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->

                        <!--                                <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-button size="mini" type="text" @click="handledeleElementglgs('otherPartyArray',scope.$index)">删除</el-button>-->

                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                              </el-table>-->
                        <!--                            </template>-->
                        <!--                          </el-form-item>-->
                        <!--                        </el-col>-->
                        <!--                      </el-row>-->
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col class="tilteSpan" :span="24">
                        <span id='out-title'>境外信息</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col class="form-con-item" :span="24">

                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="外方代理所:" :key="caseDetailFoemData.appFromto" class="postInfo-container-item" :prop="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) ? 'foreignAgencyCustId' : ''">
                                  <template>
<!--                                    <virtual-select placeholder="请选择" class="virtual-select" clearable :data="selectData.hzLists"-->
<!--                                                    v-model="caseDetailFoemData.foreignAgencyCustId" @change="wfAgentChange"-->
<!--                                                    filterable>-->
<!--                                    </virtual-select>-->
                                    <el-select default-first-option :clearable='true' @change="wfAgentChange" placeholder="请选择" v-model="caseDetailFoemData.foreignAgencyCustId" filterable>
                                      <el-option v-for="(item,key)  in selectData.hzLists" :key="key" :label="item.label" :value="item.value">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="涉及国家:" :key="caseDetailFoemData.appFromto" class="postInfo-container-item" :prop="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) ? 'appState' : ''">
                                  <template>
                                    <el-select default-first-option :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.appState" filterable>
                                      <el-option v-for="(item,key)  in selectData.country" :key="key"
                                                 :label="item.countryCn" :value="item.countryCn">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="外方代理所联系人:" class="postInfo-container-item">
                                  <template>
                                    <el-select default-first-option :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.agencyCustContactId" filterable>
                                      <el-option v-for="(item,key)  in selectData.customerContactswf" :key="key"
                                                 :label="item.name" :value="item.custContactId">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="外方代理所地址:" class="postInfo-container-item">
                                  <template>

                                    <el-select default-first-option :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.agencyCustAddrId" filterable>
                                      <el-option v-for="(item,key)  in selectData.customerAddrs" :key="key"
                                                 :label="item.addressEn || item.addressCn" :value="item.addrId">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="24">
                                <el-form-item label="外方代理所文号:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.foreignAgentNum" placeholder=""></el-input>

                                  </template>
                                </el-form-item>
                              </el-col>

                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="外方代理所要求:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.agencyCustReq" type="textarea" rows="3"
                                              placeholder=""></el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-form>
            </template>
            <template v-if="$route.query.taskType==7">
              <el-form ref="postForm" label-width="180px" :model="caseDetailFoemData" :rules="rules" class="form-container" size="mini"  v-if="postFormFlag">
                <div class="createPost-main-container">
                  <div class="form-con">
                    <el-row class="form-border">
                      <el-col :span="24">
                        <el-row class="fullRow">
                          <el-col :span="24">
                            <el-form-item class="postInfo-container-item" label="案件类型:">
                              <!--                            <p v-for="item in caseDetailFoemData.lawsuitCasetypeNameArray">{{item}}</p>-->
                              <!--                            <template>-->
                              <!--                              <span>{{ caseDetailFoemData.caseType?caseDetailFoemData.caseType:'商标行政诉讼' }}</span>-->
                              <!--                            </template>-->
                              <el-multi-cascader
                                ref="multiCascader"
                                v-model="caseDetailFoemData.protectcaseTypeIdList"
                                :options="$store.state.caseInformation.caseTypeList.filter(item=>item.caseTypeId==86)[0].childrens"
                                filterable
                                clearable
                                :props="defaultParams"

                                @change="multiCatchange"
                              />
                            </el-form-item>

                          </el-col>

                        </el-row>
                        <el-row class="fullRow">
                          <el-col :span="24">

                            <el-form-item class="postInfo-container-item" label="申请方向:">
                              <template>
                                <el-radio-group v-model="caseDetailFoemData.appFromto">
                                  <el-radio label="外-内" />
                                  <el-radio label="内-内" />
                                  <el-radio label="内-外" />
                                  <el-radio label="外-外" />
                                  <el-radio label="台-内" />
                                </el-radio-group>
                              </template>
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="ajxq-title">案件信息</span>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24" class="form-con-item">
                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="案件文号:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.agentNum" disabled/>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="案件等级:" prop="caseLevel">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.caseLevel">
                                      <el-radio :label="1">普通</el-radio>
                                      <el-radio :label="2">重要</el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>

                            </el-row>
<!--                            <el-row class="fullRow">-->
<!--                              <el-col :span="24">-->
<!--                                <el-form-item class="postInfo-container-item" label="工时类型:">-->
<!--                                  <template>-->
<!--                                    <el-radio-group v-model="caseDetailFoemData.hrType" :disabled="!ifModifyWorkHour">-->
<!--                                      <el-radio :label="1">记录工时</el-radio>-->
<!--                                      <el-radio :label="2">折算工时</el-radio>-->
<!--                                    </el-radio-group>-->
<!--                                  </template>-->
<!--                                </el-form-item>-->
<!--                              </el-col>-->
<!--                            </el-row>-->

                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="案件名称:" prop="caseName">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.caseName" />
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="案件名称(英文):">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.caseEnName" />
                                  </template>
                                </el-form-item>
                              </el-col>
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
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="基本案情介绍:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.caseIntroduce" :rows="3" placeholder="请输入" type="textarea" />

                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <!--                          <el-row class="">-->
                            <!--                            <el-col :span="12">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="管辖法院:">-->
                            <!--                                <template>-->

                            <!--                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.courtCustId">-->

                            <!--                                    <el-option :key="key" :label="item.fullname" :value="item.custId" v-for="(item,key) in selectData.hzLists" />-->

                            <!--                                  </el-select>-->

                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                            <el-col :span="12">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="法院案号:">-->
                            <!--                                <template>-->
                            <!--                                  <el-input v-model="caseDetailFoemData.courtCaseNumber" />-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="合议庭:">-->
                            <!--                                <template>-->
                            <!--                                  <el-row class="fullRow">-->
                            <!--                                    <el-col :span="24">-->
                            <!--                                      <el-form-item class="postInfo-container-item" label="审判长:">-->
                            <!--                                        <template>-->
                            <!--                                          <el-input v-model="caseDetailFoemData.collegialBench" />-->
                            <!--                                        </template>-->
                            <!--                                      </el-form-item>-->
                            <!--                                    </el-col>-->
                            <!--                                  </el-row>-->
                            <!--                                  <el-row class="fullRow">-->
                            <!--                                    <el-col :span="24">-->
                            <!--                                      <el-form-item class="postInfo-container-item" label="审判员:">-->
                            <!--                                        <template>-->
                            <!--                                          <el-input v-model="caseDetailFoemData.judge" />-->
                            <!--                                        </template>-->
                            <!--                                      </el-form-item>-->
                            <!--                                    </el-col>-->
                            <!--                                  </el-row>-->
                            <!--                                  <el-row class="fullRow">-->
                            <!--                                    <el-col :span="24">-->
                            <!--                                      <el-form-item class="postInfo-container-item" label="法官助理:">-->
                            <!--                                        <template>-->
                            <!--                                          <el-input v-model="caseDetailFoemData.judgeAssistant" />-->
                            <!--                                        </template>-->
                            <!--                                      </el-form-item>-->
                            <!--                                    </el-col>-->
                            <!--                                  </el-row>-->
                            <!--                                  <el-row class="fullRow">-->
                            <!--                                    <el-col :span="24">-->
                            <!--                                      <el-form-item class="postInfo-container-item" label="书记员:">-->
                            <!--                                        <template>-->
                            <!--                                          <el-input v-model="caseDetailFoemData.clerk" />-->
                            <!--                                        </template>-->
                            <!--                                      </el-form-item>-->
                            <!--                                    </el-col>-->
                            <!--                                  </el-row>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="">-->
                            <!--                            <el-col :span="8">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="审理方式:">-->
                            <!--                                <template>-->

                            <!--                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.hearWay">-->

                            <!--                                    <el-option :key="key" :label="item.typeName" :value="item.id" v-for="(item,key) in selectDataByClass['1134']" />-->

                            <!--                                  </el-select>-->

                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                            <el-col :span="8">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="结案方式:">-->
                            <!--                                <template>-->

                            <!--                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.closeWay">-->

                            <!--                                    <el-option :key="key" :label="item.typeName" :value="item.id" v-for="(item,key) in selectDataByClass['1135']" />-->

                            <!--                                  </el-select>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                            <el-col :span="8">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="判决结果:">-->
                            <!--                                <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.judgment">-->

                            <!--                                  <el-option :key="key" :label="item.typeName" :value="item.id" v-for="(item,key) in selectDataByClass['1029']" />-->

                            <!--                                </el-select>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="所涉及条款:" prop="clause">-->
                            <!--                                <template>-->
                            <!--                                  <div class="textarea_wrap">-->
                            <!--                                    <el-input v-model="caseDetailFoemData.clause" :rows="3" placeholder="请输入" type="textarea" />-->
                            <!--                                    <div class="button_wrap">-->
                            <!--                                      <el-button type="primary" @click="editTextarea('clause')">编辑</el-button>-->
                            <!--                                    </div>-->
                            <!--                                  </div>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="审理尺度分析:" prop="hearMeasureAnalyze">-->
                            <!--                                <template>-->
                            <!--                                  <div class="textarea_wrap">-->
                            <!--                                    <el-input v-model="caseDetailFoemData.hearMeasureAnalyze" :rows="3" placeholder="请输入" type="textarea" />-->
                            <!--                                    <div class="button_wrap">-->
                            <!--                                      <el-button  type="primary" @click="editTextarea('hearMeasureAnalyze')">编辑</el-button>-->
                            <!--                                    </div>-->
                            <!--                                  </div>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="后续工作及建议:" prop="laterSuggest">-->
                            <!--                                <template>-->
                            <!--                                  <div class="textarea_wrap">-->
                            <!--                                    <el-input v-model="caseDetailFoemData.laterSuggest" :rows="3" placeholder="请输入" type="textarea" />-->
                            <!--                                    <div class="button_wrap">-->
                            <!--                                      <el-button  type="primary" @click="editTextarea('laterSuggest')">编辑</el-button>-->
                            <!--                                    </div>-->
                            <!--                                  </div>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="有无情势变更:" prop="situationChange">-->
                            <!--                                <template>-->
                            <!--                                  <div class="textarea_wrap">-->
                            <!--                                    <el-input v-model="caseDetailFoemData.situationChange" :rows="3" placeholder="请输入" type="textarea" />-->
                            <!--                                    <div class="button_wrap">-->
                            <!--                                      <el-button   type="primary" @click="editTextarea('situationChange')">编辑</el-button>-->
                            <!--                                    </div>-->
                            <!--                                  </div>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="关键词:" prop="keyword">-->
                            <!--                                <template>-->
                            <!--                                  <div class="textarea_wrap">-->
                            <!--                                    <el-input v-model="caseDetailFoemData.keyword" :rows="3" placeholder="请输入" type="textarea" />-->
                            <!--                                    <div class="button_wrap">-->
                            <!--                                      <el-button   type="primary" @click="editTextarea('keyword')">编辑</el-button>-->
                            <!--                                    </div>-->
                            <!--                                  </div>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="备注:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.memo" :rows="3" placeholder="请输入" type="textarea" />

                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-col>

                        </el-row>
                      </el-col>

                    </el-row>

                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="khxx-title">客户信息</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="form-con-item">
                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="客户名称:" prop="custName" class="postInfo-container-item">
                                  <!--                                <template>-->
                                  <!--                                  <el-input :disabled="true" v-model="caseDetailFoemData.custName">-->
                                  <!--                                  </el-input>-->
                                  <!--                                </template>-->
                                  <el-select
                                    v-model="caseDetailFoemData.custId"
                                    ref="custSelect"
                                    :disabled="!$store.getters.permissions.includes(242)"
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
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item"  label="客户文号:">
                                  <template>
                                    <el-input  v-model="caseDetailFoemData.custRefno" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item"  label="客户联系人:">
                                  <template>

                                    <el-select v-model="caseDetailFoemData.custConId" :clearable="true" default-first-option filterable placeholder="请选择" @change="contactchange">
                                      <el-option v-for="(item,key) in selectData.customerContacts" :key="key" :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId" />
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="抄送人:">
                                  <template>
                                    <el-select v-model="caseDetailFoemData.lawsuitCaseCcArray" :clearable="true" default-first-option filterable multiple placeholder="请选择">
                                      <el-option v-for="(item,key) in selectData.customerContacts" :key="key" :label="item.name" :value="item.custContactId" />
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="账单联系人:">
                                  <template>
                                    <el-select v-model="caseDetailFoemData.billCustContactId" :clearable="true" default-first-option filterable placeholder="请选择">
                                      <el-option v-for="(item,key) in selectData.billContacts" :key="key" :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId" />
                                    </el-select>

                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="账单地址:">
                                  <template>
                                    <el-select v-model="caseDetailFoemData.billAddrId" :clearable="true" default-first-option filterable placeholder="请选择">
                                      <el-option v-for="(item,key) in selectData.billAdds" :key="key" :label="(item.addressCn||'')+(item.addressEn||'')" :value="item.addrId" />
                                    </el-select>

                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="折扣率:">
                                  <template>
                                    <!-- <el-input-number size="medium" v-model="caseDetailFoemData.discount" :min="1" :max="100" controls-position="right"></el-input-number> -->
                                    <el-input v-model="caseDetailFoemData.discount" type="number" min="1" max="100" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="申请人:">-->
                            <!--                                <el-select :clearable="true" :remote-method="remoteMethod" multiple default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                            <!--                                           v-model="caseDetailFoemData.lawsuitApplicantArray">-->
                            <!--                                  <el-option :key="key" :label="item.applicantName" :value="item.appId" v-for="(item,key) in selectData.appList" />-->
                            <!--                                </el-select>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                            <!--                          <el-row class="fullRow">-->
                            <!--                            <el-col :span="24">-->
                            <!--                              <el-form-item class="postInfo-container-item" label="侵权人:">-->
                            <!--                                <template>-->
                            <!--                                  <el-button style="float:right" size="mini" type="primary" @click="addlaw(4)">添加</el-button>-->
                            <!--                                  <el-table size="mini" :data="caseDetailFoemData.lawsuitConflicterList" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                            <!--                                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                            <!--                                    <el-table-column label="目标名称" align="left" width>-->
                            <!--                                      <template slot-scope="scope">-->
                            <!--                                        <el-select :clearable="true" :remote-method="remotepaternalUnit1" default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                            <!--                                                   v-model="scope.row.conId">-->
                            <!--                                          <el-option :key="key" :label="item.fullname" :value="item.conId" v-for="(item,key) in selectData.liyiarr" />-->
                            <!--                                        </el-select>-->
                            <!--                                      </template>-->
                            <!--                                    </el-table-column>-->
                            <!--                                    <el-table-column label="目标性质" align="left" width>-->
                            <!--                                      <template slot-scope="scope">-->
                            <!--                                        <el-select :clearable="true" default-first-option filterable reserve-keyword-->
                            <!--                                                   v-model="scope.row.conNature">-->
                            <!--                                          <el-option :key="key" :label="item" :value="item" v-for="(item,key) in ['经销型','生产型']"></el-option>-->
                            <!--                                        </el-select>-->
                            <!--                                      </template>-->
                            <!--                                    </el-table-column>-->
                            <!--                                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                            <!--                                      <template slot-scope="scope">-->

                            <!--                                        <el-button size="mini" type="text" @click="handledeleElementglgs('lawsuitConflicterList',scope.$index)">删除</el-button>-->

                            <!--                                      </template>-->
                            <!--                                    </el-table-column>-->
                            <!--                                  </el-table>-->
                            <!--                                </template>-->
                            <!--                              </el-form-item>-->
                            <!--                            </el-col>-->
                            <!--                          </el-row>-->
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="gfdsr-title">申请人</span>
                      </el-col>
                    </el-row>
                    <el-row class="form-border">
                      <el-col :span="24">
                        <el-row class="fullRow">
                          <el-col :span="24">
                            <!--                          <el-form-item class="postInfo-container-item" label="我方当事人:" required>-->
                            <!--                            <template>-->
                            <!--                              <el-button style="float:right" size="mini" type="primary" @click="addlaw(1)">添加</el-button>-->
                            <!--                              <el-table size="mini" :data="caseDetailFoemData.agentPartyArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                            <!--                                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                            <!--                                <el-table-column label="名称" align="left" width>-->
                            <!--                                  <template slot-scope="scope">-->

                            <!--                                    <el-select :clearable="true"  @change="((val)=>{appselectChange(val,'agentPartyArray',scope.$index)})" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                            <!--                                               v-model="scope.row.fullname">-->
                            <!--                                      <el-option :key="key" :label="item.applicantName" :value="item.applicantName" v-for="(item,key) in selectData.apps" />-->
                            <!--                                    </el-select>-->
                            <!--                                  </template>-->
                            <!--                                </el-table-column>-->
                            <!--                                <el-table-column label="住所" align="left" width>-->
                            <!--                                  <template slot-scope="scope">-->
                            <!--                                    <el-input :clearable="true" type="text" placeholder="" v-model="scope.row.address">-->
                            <!--                                    </el-input>-->
                            <!--                                  </template>-->
                            <!--                                </el-table-column>-->
                            <!--                                <el-table-column label="诉讼地位" align="left" width>-->
                            <!--                                  <template slot-scope="scope">-->

                            <!--                                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="scope.row.position">-->

                            <!--                                      <el-option :key="key" :label="item.typeName" :value="String(item.id)" :disabled="sxdwdisabled(item.typeName)" v-for="(item,key) in selectDataByClass['1027']" />-->

                            <!--                                    </el-select>-->
                            <!--                                  </template>-->
                            <!--                                </el-table-column>-->

                            <!--                                <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                            <!--                                  <template slot-scope="scope">-->

                            <!--                                    <el-button size="mini" type="text" @click="handledeleElementglgs('agentPartyArray',scope.$index)">删除</el-button>-->

                            <!--                                  </template>-->
                            <!--                                </el-table-column>-->
                            <!--                              </el-table>-->
                            <!--                            </template>-->
                            <!--                          </el-form-item>-->
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="申请人:">
                                  <el-select :clearable="true" :remote-method="remoteMethod" multiple default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword
                                             v-model="caseDetailFoemData.lawsuitApplicantArray">
                                    <el-option :key="key" :label="item.applicantName" :value="item.appId" v-for="(item,key) in selectData.appList" />
                                  </el-select>
                                </el-form-item>
                              </el-col>
                            </el-row>
<!--                            <el-row class="fullRow">-->
<!--                              <el-col :span="24">-->
<!--                                <el-form-item class="postInfo-container-item" label="侵权人:">-->
<!--                                  <template>-->
<!--                                    <el-button style="float:right" size="mini" type="primary" @click="addlaw(4)">添加</el-button>-->
<!--                                    <el-table size="mini" :data="caseDetailFoemData.lawsuitConflicterList" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
<!--                                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
<!--                                      <el-table-column label="目标名称" align="left" width>-->
<!--                                        <template slot-scope="scope">-->
<!--                                          <el-select :clearable="true" :remote-method="remotepaternalUnit1" default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
<!--                                                     v-model="scope.row.conId">-->
<!--                                            <el-option :key="key" :label="item.fullname" :value="item.conId" v-for="(item,key) in selectData.liyiarr" />-->
<!--                                          </el-select>-->
<!--                                        </template>-->
<!--                                      </el-table-column>-->
<!--                                      <el-table-column label="目标性质" align="left" width>-->
<!--                                        <template slot-scope="scope">-->
<!--                                          <el-select :clearable="true" default-first-option filterable reserve-keyword-->
<!--                                                     v-model="scope.row.conNature">-->
<!--                                            <el-option :key="key" :label="item" :value="item" v-for="(item,key) in ['经销型','生产型']"></el-option>-->
<!--                                          </el-select>-->
<!--                                        </template>-->
<!--                                      </el-table-column>-->
<!--                                      <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
<!--                                        <template slot-scope="scope">-->

<!--                                          <el-button size="mini" type="text" @click="handledeleElementglgs('lawsuitConflicterList',scope.$index)">删除</el-button>-->

<!--                                        </template>-->
<!--                                      </el-table-column>-->
<!--                                    </el-table>-->
<!--                                  </template>-->
<!--                                </el-form-item>-->
<!--                              </el-col>-->
<!--                            </el-row>-->
                          </el-col>
                        </el-row>
                        <!--                      <el-row class="fullRow">-->
                        <!--                        <el-col :span="24">-->
                        <!--                          <el-form-item class="postInfo-container-item" label="对方当事人:" required>-->
                        <!--                            <template>-->
                        <!--                              <el-button style="float:right" size="mini" type="primary" @click="addlaw(2)">添加</el-button>-->
                        <!--                              <el-table size="mini" :data="caseDetailFoemData.adversaryArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                        <!--                                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                        <!--                                <el-table-column label="名称" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-select :clearable="true" :remote-method="remotepaternalUnit" @change="((val)=>{lytranappselectChange(val,'adversaryArray',scope.$index)})" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                        <!--                                               v-model="scope.row.fullname">-->
                        <!--                                      <el-option :key="key" :label="item.fullname" :value="item.fullname" v-for="(item,key) in selectData.liyiarr" />-->
                        <!--                                    </el-select>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                                <el-table-column label="住所" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->
                        <!--                                    <el-input :clearable="true" type="text" placeholder="" v-model="scope.row.address">-->
                        <!--                                    </el-input>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                                <el-table-column label="诉讼地位" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="scope.row.position">-->

                        <!--                                      <el-option :key="key" :label="item.typeName" :value="String(item.id)" v-for="(item,key) in selectDataByClass['1027']" />-->

                        <!--                                    </el-select>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->

                        <!--                                <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-button size="mini" type="text" @click="handledeleElementglgs('adversaryArray',scope.$index)">删除</el-button>-->

                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                              </el-table>-->
                        <!--                            </template>-->
                        <!--                          </el-form-item>-->
                        <!--                        </el-col>-->
                        <!--                      </el-row>-->
                        <!--                      <el-row class="fullRow">-->
                        <!--                        <el-col :span="24">-->
                        <!--                          <el-form-item class="postInfo-container-item" label="其他当事人:">-->
                        <!--                            <template>-->
                        <!--                              <el-button style="float:right" size="mini" type="primary" @click="addlaw(3)">添加</el-button>-->
                        <!--                              <el-table size="mini" :data="caseDetailFoemData.otherPartyArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                        <!--                                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                        <!--                                <el-table-column label="名称" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-select :clearable="true" :remote-method="remotepaternalUnit" @change="((val)=>{lytranappselectChange(val,'otherPartyArray',scope.$index)})" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
                        <!--                                               v-model="scope.row.fullname">-->
                        <!--                                      <el-option :key="key" :label="item.fullname" :value="item.fullname" v-for="(item,key) in selectData.liyiarr" />-->
                        <!--                                    </el-select>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                                <el-table-column label="住所" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->
                        <!--                                    <el-input :clearable="true" type="text" placeholder="" v-model="scope.row.address">-->
                        <!--                                    </el-input>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                                <el-table-column label="诉讼地位" align="left" width>-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="scope.row.position">-->

                        <!--                                      <el-option :key="key" :label="item.typeName" :value="String(item.id)" v-for="(item,key) in selectDataByClass['1027']" />-->

                        <!--                                    </el-select>-->
                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->

                        <!--                                <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
                        <!--                                  <template slot-scope="scope">-->

                        <!--                                    <el-button size="mini" type="text" @click="handledeleElementglgs('otherPartyArray',scope.$index)">删除</el-button>-->

                        <!--                                  </template>-->
                        <!--                                </el-table-column>-->
                        <!--                              </el-table>-->
                        <!--                            </template>-->
                        <!--                          </el-form-item>-->
                        <!--                        </el-col>-->
                        <!--                      </el-row>-->
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col class="tilteSpan" :span="24">
                        <span id='out-title'>境外信息</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col class="form-con-item" :span="24">

                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="外方代理所:" :key="caseDetailFoemData.appFromto" class="postInfo-container-item" :prop="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) ? 'foreignAgencyCustId' : ''">
                                  <template>
                                    <!--                                    <virtual-select placeholder="请选择" class="virtual-select" clearable :data="selectData.hzLists"-->
                                    <!--                                                    v-model="caseDetailFoemData.foreignAgencyCustId" @change="wfAgentChange"-->
                                    <!--                                                    filterable>-->
                                    <!--                                    </virtual-select>-->
                                    <el-select default-first-option :clearable='true' @change="wfAgentChange" placeholder="请选择" v-model="caseDetailFoemData.foreignAgencyCustId" filterable>
                                      <el-option v-for="(item,key)  in selectData.hzLists" :key="key" :label="item.label" :value="item.value">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="涉及国家:" :key="caseDetailFoemData.appFromto" class="postInfo-container-item" :prop="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) ? 'appState' : ''">
                                  <template>
                                    <el-select default-first-option :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.appState" filterable>
                                      <el-option v-for="(item,key)  in selectData.country" :key="key"
                                                 :label="item.countryCn" :value="item.countryCn">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="外方代理所联系人:" class="postInfo-container-item">
                                  <template>
                                    <el-select default-first-option :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.agencyCustContactId" filterable>
                                      <el-option v-for="(item,key)  in selectData.customerContactswf" :key="key"
                                                 :label="item.name" :value="item.custContactId">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="外方代理所地址:" class="postInfo-container-item">
                                  <template>

                                    <el-select default-first-option :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.agencyCustAddrId" filterable>
                                      <el-option v-for="(item,key)  in selectData.customerAddrs" :key="key"
                                                 :label="item.addressEn || item.addressCn" :value="item.addrId">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="24">
                                <el-form-item label="外方代理所文号:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.foreignAgentNum" placeholder=""></el-input>

                                  </template>
                                </el-form-item>
                              </el-col>

                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="外方代理所要求:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.agencyCustReq" type="textarea" rows="3"
                                              placeholder=""></el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-form>
            </template>
          </el-tab-pane>
          <el-tab-pane label="特殊指示" name="second" >
            <div v-if="activeName==='second'">
              <el-row>
                <el-col :span="24" class="tilteSpan">
                  <span id="-title">特殊指示-案件指示</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="form-con-item">
                  <el-row class="form-border">
                    <el-col :span="24">
                      <el-table :data="custReqCases" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
                        <el-table-column align="left" label="序号" type="index" width="50" />
                        <el-table-column align="left" label="客户" width="150">
                          <template slot-scope="scope">
                            <span>{{ scope.row.fullname }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column align="left" label="申请人" width="150">
                          <template slot-scope="scope">
                            <span>{{ scope.row.applicantName }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column align="left" label="案件特殊指示" width>
                          <template slot-scope="scope">
                            <span>{{ scope.row.specialInfo }}</span>
                          </template>
                        </el-table-column>

                      </el-table>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="tilteSpan">
                  <span id="-title">特殊指示-账单指示</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="form-con-item">
                  <el-row class="form-border">
                    <el-col :span="24">
                      <el-table :data="custReqBills" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
                        <el-table-column align="left" label="序号" type="index" width="50" />
                        <el-table-column align="left" label="客户" width="150">
                          <template slot-scope="scope">
                            <span>{{ scope.row.fullname }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column align="left" label="申请人" width="150">
                          <template slot-scope="scope">
                            <span>{{ scope.row.applicantName }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column align="left" label="案件特殊指示" width>
                          <template slot-scope="scope">
                            <span>{{ scope.row.specialInfo }}</span>
                          </template>
                        </el-table-column>

                      </el-table>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='-title'>客户活动</span>
                  <!--<caseBill :billData='caseDetailFoemData'></caseBill>-->
                </el-col>
              </el-row>
              <el-row>
                <SpecialInstructions v-for="(item, index) in custActivityList" :key="index" type="view" :label="item.actType"
                                     :data="{custFullNameString:caseDetailFoemData.custName,customerRequirementBillList:item.custActivity}"></SpecialInstructions>

              </el-row>
              <el-row>
                <el-col :span="24" class="tilteSpan">
                  <span id="-title">客户个案要求</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="form-con-item">
                  <el-row class="form-border">
                    <el-col :span="24">
                      <el-row class="fullRow">
                        <el-col :span="24">
                          <div class="postInfo-container-item" label="客户个案要求:">
                            <template>
                              <el-input v-model="caseDetailFoemData.workReq" :rows="3" placeholder="请输入" type="textarea" />

                            </template>
                          </div>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>

          </el-tab-pane>
          <el-tab-pane label="办案人" name="third">
            <CaseInvestigators  :caseDetailData='caseDetailFoemData' :isEdit="true" @workGroup="workGroup" @caseRoleSelectList="(v)=>{caseRoleSelectList = v}" v-if="activeName==='third'&&caseDetailFoemData.custId&&CaseInvestigatorsFlag">
<!--              <div class="createPost-main-container">-->
<!--                <div class="form-con">-->
<!--                  <el-row class="form-border">-->
<!--                    <el-col :span="24">-->
<!--                      <el-row>-->
<!--                        <el-col :span="24" class="tilteSpan">-->
<!--                          <span id="-title">承办律师</span>-->
<!--                        </el-col>-->
<!--                      </el-row>-->
<!--                      <el-row class="fullRow">-->
<!--                        <el-col :span="24">-->
<!--                          <el-form-item class="postInfo-container-item" label="承办律师1:">-->
<!--                            <el-select default-first-option  placeholder="请选择" v-model="caseDetailFoemData.lawyer1UserId" :filter-method="(text)=>filterMethod(text)" @change="changeCbLawyer" @clear="removeTag(1)" filterable clearable>-->
<!--                              <el-option-->
<!--                                v-for="item in $commonUtils.unique(userList.filter(i=>i.fullname.includes(filterText)).slice(0,100).concat(userList.filter(i=>i.userId==caseDetailFoemData.lawyer1UserId)),'userId')"-->
<!--                                :key="item.userId"-->
<!--                                :label="item.fullname"-->
<!--                                :value="item.userId">-->
<!--                              </el-option>-->
<!--                            </el-select>-->
<!--                          </el-form-item>-->
<!--                        </el-col>-->
<!--                      </el-row>-->
<!--                      <el-row class="fullRow">-->
<!--                        <el-col :span="24">-->
<!--                          <el-form-item class="postInfo-container-item" label="承办律师2:">-->
<!--                            <el-select default-first-option  placeholder="请选择" v-model="caseDetailFoemData.lawyer2UserId" @change="changeCbLawyer" :filter-method="(text)=>filterMethod(text)"  @clear="removeTag(2)" filterable clearable>-->
<!--                              <el-option-->
<!--                                v-for="item in $commonUtils.unique(userList.filter(i=>i.fullname.includes(filterText)).slice(0,100).concat(userList.filter(i=>i.userId==caseDetailFoemData.lawyer2UserId)),'userId')"-->
<!--                                :key="item.userId"-->
<!--                                :label="item.fullname"-->
<!--                                :value="item.userId">-->
<!--                              </el-option>-->
<!--                            </el-select>-->
<!--                          </el-form-item>-->
<!--                        </el-col>-->
<!--                      </el-row>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                </div>-->
<!--              </div>-->
            </CaseInvestigators>
          </el-tab-pane>
          <el-tab-pane label="账单费用" name="fourth">
            <caseBill :billData='caseDetailFoemData' v-if="activeName==='fourth'"></caseBill>
          </el-tab-pane>
          <el-tab-pane label="案件进展" name="Fifth">
            <ElectronicArchives v-if="caseDetailFoemData.caseId && activeName==='Fifth'" :taskType="$route.query.taskType"  :caseTypeId="caseDetailFoemData.caseTypeId" :caseEvolve="caseDetailFoemData.caseEvolve" :isEdit="true" :agentNum="caseDetailFoemData.agentNum" :curCaseId="caseDetailFoemData.caseId" :custId="caseDetailFoemData.custId" :business="business"></ElectronicArchives>
          </el-tab-pane>
<!--          <el-tab-pane label="任务管理" name="Sixth" v-if="$store.getters.domainList.some(item=>[2,3].includes(item))&&caseDetailFoemData.agentNum">-->
<!--            <TaskProgress :judgeRank="caseDetailFoemData.judgeRank" :case-type-id="caseDetailFoemData.caseTypeId" :taskDataCaseId="$route.params.id" :agentNum="caseDetailFoemData.agentNum"></TaskProgress>-->

          <el-tab-pane label="任务管理" name="Sixth" >
            <TaskProgress :caseName="caseDetailFoemData.caseName" :caseTypeStr="caseDetailFoemData.caseTypeStr" :judgeRank="caseDetailFoemData.judgeRank" :case-type-id="caseDetailFoemData.caseTypeId" :taskDataCaseId="$route.params.id" :agentNum="caseDetailFoemData.agentNum"></TaskProgress>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col v-if="activeName=='first'" :span="4">
        <div style="height: 520px;position: fixed;top:20%;right:5%">
          <el-steps :active="stepActive1" :space="200" direction="vertical">
            <el-step v-for="(item,index) in elstepList" v-if="item.state" :key="index" :title="item.title" @click.native="getTopPosition(item.id,index)" />
          </el-steps>
        </div>
      </el-col>

    </el-row>

    <el-dialog :visible.sync="dialogFormTmCm" title="重名检查" width="70%" @open="cmDialogShow">

      <el-row class="tmCmsearch">

        <el-col :span="12" style="float:right;margin-bottom:10px">
          <el-input v-model="selectTmSearchInput" class="input-with-select" placeholder="请输入内容">

            <el-button slot="append" icon="el-icon-search" @click="getCmtmdata('seach')" />
          </el-input>
        </el-col>
        <el-col :span="24" style="padding-left:40px;margin-bottom:10px">
          <el-checkbox v-model="checkAllgoodClass" :indeterminate="isIndeterminategoodClass" @change="handleCheckAllgoodClassChange">全选
          </el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="checkedgoodClass" @change="handleCheckedgoodClassChange">
            <el-checkbox v-for="goodclass in allgoodClass" :key="goodclass" :label="goodclass">
              {{ goodclass }}
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="24">
          <el-table :data="sameTmdata" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
            <el-table-column align="left" label="序号" type="index" width="50" />
            <el-table-column align="left" label="商标图样" width>
              <template slot-scope="scope">
                <img :src="`/tmFile${scope.row.imgFilePath}`" style="width:100px;height:100px">
              </template>
            </el-table-column>
            <el-table-column align="left" label="商标名称" width>
              <template slot-scope="scope">
                <span>{{ scope.row.tmName }}</span>

              </template>
            </el-table-column>
            <el-table-column align="left" label="申请/注册号" width>
              <template slot-scope="scope">
                <span>{{ scope.row.regNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="商标类别" width>
              <template slot-scope="scope">
                <span>{{ scope.row.tmType }}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="申请人" width>
              <template slot-scope="scope">
                <span>{{ scope.row.applicantName }}</span>
              </template>
            </el-table-column>

            <el-table-column align="left" label="申请时间" width>
              <template slot-scope="scope">
                <span>{{ scope.row.approvalDate }}</span>
              </template>
            </el-table-column>

          </el-table>
          <pagination v-show="sameTmdatatotal>0" :limit.sync="sameSenddata.pageSize" :page.sync="sameSenddata.pageNo" :total="sameTmdatatotal" @pagination="getCmtmdata" />
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">

        <el-button type="primary" @click="dialogFormTmCm=false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-row style="margin-bottom:50px">
      <el-col :span="24" style="text-align:center">
        <el-button v-if="!caseDetailFoemData.ctAudit || [2, 3, 4].includes(caseDetailFoemData.ctAudit)" size="medium" style="margin-right:10px" type="primary" @click="submitCaseForm(undefined,1)">
          保存
        </el-button>
        <el-button v-if="(caseDetailFoemData.ctAudit === 4 || !caseDetailFoemData.ctAudit) && $route.query.pageId&&curCustLevel&&caseDetailFoemData.auditStatus!=1&&!(caseDetailFoemData.agentNum&&caseDetailFoemData.agentNum.includes('TP'))" size="medium" style="margin-right:10px" type="primary" @click="creatCaseForm(1)">提交
        </el-button>
        <el-button v-if="caseDetailFoemData.auditStatus==1" size="medium" style="margin-right:10px" type="primary" @click="submitCaseForm('通过',1)">通过
        </el-button>
        <el-button v-if="caseDetailFoemData.auditStatus==1" size="medium" style="margin-right:10px" type="primary" @click="submitCaseForm('退回',1)">退回
        </el-button>
        <template v-if="caseDetailFoemData.ctAudit === 1">
          <el-button size="medium" style="margin-right:10px" type="primary" @click="chongtuTestFunc(true)">
            检查冲突
          </el-button>
          <el-button size="medium" style="margin-right:10px" type="primary" @click="alertChongtuAuditFunc(1)">
            利益冲突审核通过
          </el-button>
          <el-button size="medium" style="margin-right:10px" type="primary" @click="alertChongtuAuditFunc(2)">
            利益冲突审核退回
          </el-button>
        </template>
        <template v-if="caseDetailFoemData.ctAudit === 2">
          <el-button size="medium" style="margin-right:10px" type="primary" @click="dialogcheckChongTuBtn">
            利益冲突审核提交
          </el-button>
        </template>
        <el-dropdown v-if="(caseDetailFoemData.ctAudit === 4 || !caseDetailFoemData.ctAudit) && $route.query.pageId&&!curCustLevel&&caseDetailFoemData.auditStatus!=1&&!(caseDetailFoemData.agentNum&&caseDetailFoemData.agentNum.includes('TP'))" trigger="click" placement="top" style="margin-right:10px" @command="filingOperation">
          <el-button type="primary" :disabled="filingOperationState">
            立卷<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="prefiling">预立卷审批</el-dropdown-item>
            <el-dropdown-item command="createBills">创建账单</el-dropdown-item>
            <el-dropdown-item command="lowCreditAudit">低信用审核</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="medium" type="primary" @click.native="()=>{$router.go(-1)}">取消</el-button>
      </el-col>
    </el-row>
    <DataUploadOrSelect :dialog-visible="DataUploadOrSelectState" :file-name="fileName" :file-data="fileData1" :title="curUploadTitle" :wtsfile-list="multipleFileList" @getResponseAndFile="getResponseAndFile" @closedialogVisible="DataUploadOrSelectState=false" @deleteCaseMaterial="deleteFile" />
    <el-dialog title="检查结果" :visible.sync="dialogcheckChongTuVisible">
      <el-row style="margin: 10px 5px">
        <el-col :span="24">
          <span style="font-size:17px;" class="redClass">被申请人与下列我方代理过的客户/申请人名称相同/近似，请提交客户管理组刘佳进行冲突检索，审核通过后方可继续立案。</span>
        </el-col>
      </el-row>
      <el-table :data="gridData">
        <el-table-column property="agentNum" label="案件文号"></el-table-column>
        <el-table-column property="caseType" label="案件类型"></el-table-column>
        <el-table-column property="caseName" label="案件名称">
          <template slot-scope="scope">
            <span v-html="highlightKey(scope.row.caseName, scope.row.keyName)"></span>
          </template>
        </el-table-column>
        <el-table-column property="droitNumber" label="权利号"></el-table-column>
        <el-table-column property="applicantName" label="申请人">
          <template slot-scope="scope">
            <span v-html="highlightKey(scope.row.applicantName, scope.row.keyName)"></span>
          </template>
        </el-table-column>
        <el-table-column property="custName" label="客户名称">
          <template slot-scope="scope">
            <span v-html="highlightKey(scope.row.custName, scope.row.keyName)"></span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogcheckChongTuVisible = false">取 消</el-button>
        <el-button v-if="caseDetailFoemData.ctAudit !== 1" type="primary" @click="dialogcheckChongTuBtn">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择导出项" :visible.sync="dialogVisibledctm" width="40%">
      <el-row>
        <el-col :span="24" style="text-align: center">

          <el-transfer v-model="dcvalue" :titles="['所有项','导出项']" style="text-align: left; display: inline-block" :props="{
              key: 'value',
              label: 'desc'
            }" :data="dcdata" />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dcbtn">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      width="80%"
      top="5vh">
      <el-input v-model="caseDetailFoemData[curProp]" :rows="35" placeholder="请输入" type="textarea" />
    </el-dialog>
    <el-dialog
      v-dialogDrag
      top="0"
      :visible.sync="poppingTimeLimitState"
      width="60%"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :lock-scroll="false"
      :modal="false"
      title="创建时限"
      class="dialog——body——padding"
      v-dialogDrag
      center
    >
      <poppingTimeLimit v-if="poppingTimeLimitState" disabled @cancel="closePoppingTimeLimit" :list="caseData"></poppingTimeLimit>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="chongtuAuditViewCom" width="40%">
      <el-row>
        <el-col :span="24" style="text-align: center">
          <el-form>
            <el-form-item label="理由:">
              <el-input v-model="chongtuAuditReason"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chongtuAuditView = false">取 消</el-button>
        <el-button type="primary" @click="chongtuAuditFunc(chongtuAuditView)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import BreadCrumbCase from "./BreadCrumbCase";
  import {
    lawsuitUrl,
    saveCaseInfoUrl,
    queryCountry,
    queryCustomerContactByCustIdUrl,
    queryAppInfoUrl,
    queryAppContactUrl,
    queryCustomerReqUrl,
    handoverCase,auditCase,
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
    ifNewLevel,
    chongtuTest,
    tijiao,
    chongtuAudit
  } from '@/api/caseDetail'
  import TaskProgress from '@/views/workbench/case/components/TaskProgress.vue'
  import { queryCaseAppExamine, searchTmUrl, tmdetailUrl, tmdetailUrl3 } from '@/api/customerList'
  import { queryAlltask, tmdetail ,getAdversaryArray,queryUserAll,getCaseTime,queryApplicantByIdList} from '@/api/caseList'
  import serviceApi from '@/api/serviceApi.config.js'
  import { mapGetters } from 'vuex'
  import { truncate, truncateSync } from 'fs'
  import ChangeOfNameAndAddress from './ChangeOfNameAndAddress'
  import trademarkTable from './trademarkTable.vue'
  import caseBill from './CaseBill'
  import Goods from './Goods'
  import { scrollTo } from '@/utils/scroll-to'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import DataUploadOrSelect from '@/components/DataUploadOrSelect'
  import ElectronicArchives from '@/views/workbench/case/components/ElectronicArchives.vue'
  import CaseInvestigators from '@/views/workbench/case/components/CaseInvestigators.vue'
  import {
    queryCaseWorkgroupUrl,
  } from "@/api/caseDetail";
  import  poppingTimeLimit from '@/views/workbench/toDoTasks/poppingTimeLimit.vue'
  import { billSubmitUrl } from '@/api/billApi'
  import {queryCustomerNameId
  } from "@/api/caseList";
  import { queryAllUrl } from "@/api/applicant";
  const defaultdcmr = [
    'filePath',
    'tmName',
    'regNumber',
    'tmType',
    'applicantName',
    'applicantEnName',
    'applicantAddress',
    'applicantEnAddress',
    'appDate',
    'approvalNumber',
    'approvalDate',
    'regnoticeNumber',
    'regNoticeDate',
    'validStartDate',
    'validEndDate',
    'agent',
    'tmGroup',
    'trademarkCategories',
    'classify'
  ]
  const defaultdc = [
    { desc: '商标图样', value: 'filePath' },
    { desc: '商标名称', value: 'tmName' },
    { desc: '注册号/申请号', value: 'regNumber' },
    { desc: '国际分类', value: 'tmType' },
    { desc: '申请人名称（中文）', value: 'applicantName' },
    { desc: '申请人名称（英文）', value: 'applicantEnName' },
    { desc: '申请人地址（中文）', value: 'applicantAddress' },
    { desc: '申请人地址（英文）', value: 'applicantEnAddress' },
    { desc: '申请日期', value: 'appDate' },
    { desc: '递交日期', value: 'submitDate'},
    { desc: '初审公告期号', value: 'approvalNumber' },
    { desc: '初审公告日期', value: 'approvalDate' },
    { desc: '注册公告期号', value: 'regnoticeNumber' },
    { desc: '注册公告日期', value: 'regNoticeDate' },
    { desc: '专用期开始日期', value: 'validStartDate' },
    { desc: '专用期结束日期', value: 'validEndDate' },
    { desc: '代理/办理机构', value: 'agent' },
    { desc: '类似群', value: 'tmGroup' },
    { desc: '商品/服务', value: 'trademarkCategories' },
    { desc: '商标类型', value: 'classify' },
    { desc: '是否驰名商标', value: 'famous' },
    { desc: '是否立体商标', value: 'ifSolidTm' },
    { desc: '是否共有申请', value: 'ifShareTm' },
    { desc: '优先权日期', value: 'priorDate' },
    { desc: '国际注册日期', value: 'gjRegDate' },
    { desc: '后期指定日期', value: 'hqzdDate' },
    { desc: '共有人中文名称', value: 'gtApplicantName' }
  ]
  const fydefaultdc = [
    { desc: '商标图样', value: 'filePath' },
    { desc: '商标名称', value: 'tmName' },
    { desc: '注册号/申请号', value: 'regNumber' },
    { desc: '国际分类', value: 'tmType' },
    { desc: '申请人名称（中文）', value: 'applicantName' },
    { desc: '申请人名称（英文）', value: 'applicantEnName' },
    { desc: '申请人地址（中文）', value: 'applicantAddress' },
    { desc: '申请人地址（英文）', value: 'applicantEnAddress' },
    { desc: '申请日期', value: 'appDate' },
    { desc: '递交日期', value: 'submitDate'},
    { desc: '注册日期', value: 'regNoticeDate' },
    { desc: '备注', value: 'comments' }
  ]
  const fydefaultdcmr = [
    'filePath',
    'tmName',
    'regNumber',
    'tmType',
    'applicantName',
    'applicantEnName',
    'applicantAddress',
    'applicantEnAddress',
    'appDate',
    'regNoticeDate',
    'comments'
  ]
  const appTextShowzr = {
    title: '申请人(受让人)信息',
    cnname: '申请人(受让人)中文名称',
    enname: '申请人(受让人)英文名称',
    type: '申请人(受让人)类型',
    cnaddr: '申请人(受让人)中文地址',
    enaddr: '申请人(受让人)英文地址',
    uploadlang: '受让人上传文件的语言类型'
  }
  const appTextShowxk = {
    title: '申请人(许可人)信息',
    cnname: '申请人(许可人)中文名称',
    enname: '申请人(许可人)英文名称',
    type: '申请人(许可人)类型',
    cnaddr: '申请人(许可人)中文地址',
    enaddr: '申请人(许可人)英文地址',
    uploadlang: '申请人(许可人)上传文件的语言类型'
  }
  const yydbTextShowxk = {
    title: '异议人信息',
    cnname: '异议人中文名称',
    enname: '异议人英文名称',
    cnaddr: '异议人中文地址',
    enaddr: '异议人英文地址',
    dlzz: '异议人代理组织'
  }
  const yyxgTextShowxk = {
    title: '被申请人信息',
    cnname: '被申请人中文名称',
    enname: '被申请人英文名称',
    cnaddr: '被申请人中文地址',
    enaddr: '被申请人英文地址',
    dlzz: '被申请人代理组织'
  }
  const byzcfsTextShowxk = {
    title: '被申请人(不予注册复审申请人)信息',
    cnname: '被申请人(不予注册复审申请人)中文名称',
    enname: '被申请人(不予注册复审申请人)英文名称',
    cnaddr: '被申请人(不予注册复审申请人)中文地址',
    enaddr: '被申请人(不予注册复审申请人)英文地址',
    dlzz: '被申请人(不予注册复审申请人)代理组织'
  }
  const yycsTextShowxk = {
    title: '被申请人(撤销人)信息',
    cnname: '被申请人(撤销人)中文名称',
    enname: '被申请人(撤销人)英文名称',
    cnaddr: '被申请人(撤销人)中文地址',
    enaddr: '被申请人(撤销人)英文地址',
    dlzz: '被申请人(撤销人)代理组织'
  }
  const yycssTextShowxk = {
    title: '被申请人(注册人)信息',
    cnname: '被申请人(注册人)中文名称',
    enname: '被申请人(注册人)英文名称',
    cnaddr: '被申请人(注册人)中文地址',
    enaddr: '被申请人(注册人)英文地址',
    dlzz: '被申请人(注册人)代理组织'
  }
  const goodClasses = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45'
  ]
  export default {
    name: 'Casedetails',
    computed: {
      chongtuAuditViewCom(){
        return !!this.chongtuAuditView
      },
      ...mapGetters(['token', 'name', 'userId']),
      formatDialogFormjoin () {
        return !!this.dialogFormjoin
      },
      litigationCaseTypeList() {
      return  JSON.parse(localStorage.getItem('litigationCaseTypeList'))
    }
    },
    components: {
      Pagination,
      ChangeOfNameAndAddress,
      trademarkTable,
      DataUploadOrSelect,
      caseBill,
      ElectronicArchives,
      Goods,
      CaseInvestigators,
      poppingTimeLimit,
      TaskProgress,
      BreadCrumbCase
    },
    props: {
      business: {},
      isEdit: {
        type: Boolean,
        default: false
      },
      prePage: {}
    },
    data () {
      var idNumReg = /^[0-9]\d{5}$/
      var validateIdNum = (rule, value, callback) => {
        if (!idNumReg.test(value)) {
          callback(new Error('格式有误'))
        } else {
          callback()
        }
      }
      var validateCaseType = (rule, value, cb) => {
        if (value && value.length) {
          cb()
        } else {
          cb(new Error('请选择案件类型！'))
        }
      }
      var validateWorkArray = (rule, value, cb) => {
        if (value && value.length) {
          cb()
        } else {
          cb(new Error('请选择案件性质！'))
        }
      }
      return {
        queryAllData: [],
        backData: {},
        chongtuAuditReason: '',
        chongtuAuditView: false,
        ifModifyWorkHour: 1,
        caseRoleSelectList: [],
        postFormFlag:true,
        poppingTimeLimitState:false,
        caseData:[],
        defaultCaseData:{},
        timeout: null,
        goodsDetailData:{
          goods:[]
        },
        curProp:'',
        userList:[],
        centerDialogVisible:false,
        dcvalue: [
          'filePath',
          'tmName',
          'regNumber',
          'tmType',
          'applicantName',
          'applicantEnName',
          'applicantAddress',
          'applicantEnAddress',
          'appDate',
          'approvalNumber',
          'approvalDate',
          'regnoticeNumber',
          'regNoticeDate',
          'validStartDate',
          'validEndDate',
          'agent',
          'tmGroup',
          'trademarkCategories',
          'classify'
        ],
        materialArray: [],
        dcdata: [
          { desc: '商标图样', value: 'filePath' },
          { desc: '商标名称', value: 'tmName' },
          { desc: '注册号/申请号', value: 'regNumber' },
          { desc: '国际分类', value: 'tmType' },
          { desc: '申请人名称（中文）', value: 'applicantName' },
          { desc: '申请人名称（英文）', value: 'applicantEnName' },
          { desc: '申请人地址（中文）', value: 'applicantAddress' },
          { desc: '申请人地址（英文）', value: 'applicantEnAddress' },
          { desc: '申请日期', value: 'appDate' },
          { desc: '递交日期', value: 'submitDate'},
          { desc: '初审公告期号', value: 'approvalNumber' },
          { desc: '初审公告日期', value: 'approvalDate' },
          { desc: '注册公告期号', value: 'regnoticeNumber' },
          { desc: '注册公告日期', value: 'regNoticeDate' },
          { desc: '专用期开始日期', value: 'validStartDate' },
          { desc: '专用期结束日期', value: 'validEndDate' },
          { desc: '代理/办理机构', value: 'agent' },
          { desc: '类似群', value: 'tmGroup' },
          { desc: '商品/服务', value: 'trademarkCategories' },
          { desc: '商标类型', value: 'classify' },
          { desc: '是否驰名商标', value: 'famous' },
          { desc: '是否立体商标', value: 'ifSolidTm' },
          { desc: '是否共有申请', value: 'ifShareTm' },
          { desc: '优先权日期', value: 'priorDate' },
          { desc: '国际注册日期', value: 'gjRegDate' },
          { desc: '后期指定日期', value: 'hqzdDate' },
          { desc: '共有人中文名称', value: 'gtApplicantName' }
        ],
        dialogVisibledctm: false,
        cdBool: false,
        tabtypeDown: false,
        dialogcheckChongTuVisible: false,
        gridData: [],
        collaptrademarkTable: '1',
        curCustLevel: false,
        ch_caseTypr: '',
        DataUploadOrSelectState: false,
        fileData1: {},
        submitTypeBool: false,
        multipleFileList: [],
        curUploadTitle: '',
        yyTextShowxk: {
          title: '被异议人',
          cnname: '被异议人中文名称',
          enname: '被异议人英文名称',
          cnaddr: '被异议人中文地址',
          enaddr: '被异议人英文地址',
          dlzz: '被异议人代理组织'
        },
        wtsfileListzr: [],
        appTextShow: {
          title: '申请人信息',
          cnname: '申请人中文名称',
          enname: '申请人英文名称',
          type: '主体法律性质',
          cnaddr: '申请人中文地址',
          enaddr: '申请人英文地址',
          uploadlang: '上传文件的语言类型'
        },

        tyimage: '',
        collapseactiveNames: '',
        zngoodb: '',
        zngood: '',

        downloadDtepfiles: '',

        dialogFormgroupGzz: false,
        goodsCaseNumber: '',
        planName: '',
        innerVisible: false,
        sameloading: false,
        sameTmdata: {},
        sameSenddata: {
          tmName: '',
          tmType: '',
          pageNo: 1,
          pageSize: 10
        },
        sameTmdatatotal: '',
        checkAllgoodClass: true,
        checkedgoodClass: goodClasses,
        allgoodClass: goodClasses,
        isIndeterminategoodClass: true,

        selectTmSearchInput: '',

        dialogFormgroupCy: false,
        dialogFormTmCm: false,
        tkInspectType: '',
        tkInspectText: { innerMemo: '', cause: '', content: '' },
        jyText: '',
        goodsPlan: '',
        goodslistPageData: {
          total: 0,
          pageNo: 1,
          pageSize: 10
        },
        custReqCases: [],
        custReqBills: [],
        custActivity: [],
        custActivityList: [],
        joinFormData: {
          appId: '',
          cardName: '',
          cardId: '',
          nameCn: '',
          nameEn: '',
          addrEn: '',
          addrCn: '',
          joinAppType: '',
          joinAppCoun: '',
          getFileIsEn: '',
          type: ''
        },
        chongtuType: '',
        chongtuForwordType: '',
        dialogFormjoin: 0,
        filterText: '',
        loading: false,
        rules: {
          foreignAgencyCustId:[
            { required: true, message: '请选择外方代理所', trigger: 'change' }
          ],
          appState:[
            { required: true, message: '请选择涉及国家', trigger: 'change'}
          ],
          lawsuitWorkArray: [
            {validator: validateWorkArray, required: true, trigger: 'change'}
          ],
          protectcaseTypeIdList: [
            {validator: validateCaseType, required: true, trigger: 'change'}
          ],
          clause:[
            { min: 0, max: 1000, message: '录入字数请不要超过1000文字', trigger: 'blur' }
          ],
          caseName:[{ required: true, message: '请填写案件名称', trigger: 'change' }],
          hearMeasureAnalyze:[
            { min: 0, max: 1000, message: '录入字数请不要超过1000文字', trigger: 'blur' }
          ],
          laterSuggest:[
            { min: 0, max: 1000, message: '录入字数请不要超过1000文字', trigger: 'blur' }
          ],
          appFromto: [
            { required: true, message: '请选择申请方向', trigger: 'change' }
          ],
          judgeRank: [
            { required: true, message: '请选择审级', trigger: 'change' }
          ],
          submitType: [
            { required: true, message: '请选择递交方式', trigger: 'change' }
          ],
          custName: [
            { required: true, message: '请选择客户', trigger: 'change' }
          ],
          appCnName: [
            { required: true, message: '请选择申请人', trigger: 'change' }
          ],
          appId: [
            { required: true, message: '请选择申请人', trigger: 'change' }
          ],
          lawsuitApplicantArray: [
            { required: true, message: '请选择申请人', trigger: 'change' }
          ],
          appContactPerson: [
            { required: true, message: '请选择联系人', trigger: 'change' }
          ],
          custContactId: [
            { required: true, message: '请选择客户联系人', trigger: 'change' }
          ],
          certCode: [
            {
              required: true,
              message: '请填写统一社会信用代码',
              trigger: 'blur'
            }
          ],
          tmName: [
            { required: true, message: '请填写商标名称', trigger: 'blur' }
          ],
          custRefno: [
            { required: true, message: '请填写客户文号', trigger: 'blur' }
          ],
          tmOfficeNumber: [
            { required: true, message: '请填写官方发文编号', trigger: 'blur' }
          ],
          parentDocNumber: [
            { required: true, message: '请填写原官方发文编号', trigger: 'blur' }
          ],
          docDate: [
            { required: true, message: '请填写官方收文日期', trigger: 'blur' }
          ],

          approvalNo: [
            { required: true, message: '请填写初审公告号', trigger: 'blur' }
          ],
          regNumber: [
            {
              required: true,
              message: '请填写商标注册号/原商标申请号/国际注册号',
              trigger: 'blur'
            }
          ],

          appContactTel: [
            { required: true, message: '请填写联系人电话', trigger: 'blur' }
          ],
          legalNature: [
            { required: true, message: '请选择主体法律性质', trigger: 'change' }
          ],
          respondentNameCn: [
            {
              required: true,
              message: '请选择被申请人或被许可人',
              trigger: 'change'
            }
          ],
          appGJdq: [
            { required: true, message: '请选择申请人国籍', trigger: 'change' }
          ],
          appContactZip: [
            { required: true, validator: validateIdNum, trigger: 'blur' }
          ],
          appCnAddr: [
            { required: true, message: '请填写申请人中文地址', trigger: 'blur' }
          ],
          caseOffer:[ { required: true, message: '请填写报价', trigger: 'blur' }],
          // parentCaseRecvDate:[{required: true, message: '请填写前案收文日期', trigger: 'blur'}]
        },
        goodsData: [],
        goodsTreeProps: {
          label: function (data, node) {
            if (node.level > 2) {
              return data.goodName
            } else {
              return data.name
            }
          },
          children: 'child'
        },
        fileUrl: serviceApi.creatematerialUrl,
        selectDataByClass:[],
        stepActive1: 0,
        ifpriority: false,
        activeName: 'first',
        caseDetailFoemData: {
          protectcaseTypeIdList: [],
          supplement: 1,
          taskId: '',
          custName: '',
          whdAgencyName: '',
          IsUpwhdAgency: '',
          memberRule: '',
          memberNamelists: [],
          instructions: '',
          caseType: '', // 案件类型 文字
          custId: '', // 客户id
          caseTypeId: '', // 案件类型编号
          appFromto: '', // 申请方向 文字
          caseNumber: '', // 案件个数
          agentNum: '', // 案件文号
          submitType: '', // 递交方式 文字
          tmName: '', // 商标名称
          tmNameEn: '', // 商标英文

          goods: [],
          materials: [],
          tmType: '', // 种类 （1：一般；2：集体；3：证明）传1、2、3
          ifSolidTm: '', // 是否三维标志（0：否；1：是）传0、1
          colorSign: '', // 是否是颜色组合（0：否；1：是）传 0、1
          assignColor: '', // 指定颜色（0：否；1：是）传 0、1
          tmVoice: '', // 声音标识（0：否；1：是）传 0、1
          priorityType: '', // 优先权声明（1：基于第一次申请的优先权；2：基于会展的优先权）传1、2
          priorityBaseCrty: '', // 优先权国家（文字）
          priorityAppDate: '', // 优先权日期
          isLoadPriorityFile: '', // 优先权文件候补（0：否；1：是）传 0、1
          priorityAppNum: '', // 优先权申请号
          custRefno: '', // 客户文号
          custContactId: '', // 客户联系人id
          trademarkCaseCustContacts: [],
          letterAddrId: '', // 信函地址id
          billCustContactId: '', // 账单联系人id
          discount: '', // 折扣率
          billAddrId: null, // 账单地址id
          applicationMarks: '', // 申请书标注
          caseLevel: '', // 案件等级（1：普通；2：重要）传1、2
          otherAgency: '', // 他所代交（0：否；1：是）传 0、1
          replaceAgencyName: '', // 代交所名称
          remarks: '', // 案件备注
          appGJdq: '', // 书式类型（文字）
          certCode: '', // 统一社会信用代码
          appId: '', // 申请人id
          appCnName: '', // 申请人中文名称
          appEnName: '', // 申请人英文名称
          appCountryOrRegion: '', // 申请人国家或地区
          appCnAddr: '', // 申请人中文地址
          appEnAddr: '', // 申请人英文地址
          legalNature: '',
          appContactPerson: '', // 联系人（中文）
          appContactZip: '', // 邮政编码
          appContactTel: '', // 电话
          appContactEmail: '', // 邮箱
          ifShareTm: '', // 共同申请（0：否；1：是）传 0、1
          joinApps: [],
          madrid: false, // 马德里注册
          appState: '', // 注册国家（文字）
          agencyCustId: '', // 外方代理所id
          agencyCustContactId: '', // 外代所联系人id
          agencyCustRefno: '', // 外方代理所文号
          agencyCustAddrId: '', // 外方代理所地址id
          agencyCustReq: '', // 外放代理所要求
          timeLimitContent: '', // 时限内容
          limitDate: '', // 时限日期
          trademarkCaseMadrids: [],
          trademarkCaseBasicinfos: [],
          caseIds: [],
          trademarkCaseWorkgroups: [],
          ownerDeptId: '', // 案件所属部门 （选择客户组时的deptId）
          caseEvolve: [],
          trademarkCaseCustWorkgroups: [
            { wkgId: '', trademarkCaseWorkgroupMembers: [] }
          ],
          trademarkCaseCBWorkgroups: [],
          trademarkCaseLCWorkgroups: [],
          agentPartyArray:[]
        },
        pickerOptions: {
          // disabledDate(time) {
          //   return time.getTime() > Date.now()
          // },
          shortcuts: [
            {
              text: '今天',
              onClick (picker) {
                picker.$emit('pick', new Date())
              }
            },
            {
              text: '昨天',
              onClick (picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', date)
              }
            },
            {
              text: '一周前',
              onClick (picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', date)
              }
            }
          ]
        },
        selectData: {
          agencyList:[],
          appList:[],
          appaddr: [],
          rightTypeList:[],
          rightBelongTypeList:[],
          liyiarr: [],
          natureOfWorkList:[],
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
          customerContacts: [],
          customerAddrs: [],
          casecount: []
        },

        wtsfileList: [],
        fileName: {
          '1018': '',
          '429': '',
          '430': '',
          '1020': '',
          '1005': '',

          '1006': '',
          '1003': '',
          '1024': '',
          '1025': '',
          '1027': '',
          '1026': '',
          '1071': '',
          '1072': '',
          '1016': '',
          '1007': '',
          '1008': '',
          '1009': '',
          '1010': '',
          '409': '',
          '1040': '',
          '1039': '',
          '1002': '',
          '1000': '',

          '1037': '',
          '1038': '',
          '1032': '',
          '1033': '',
          '1001': '',

          '1004': '',

          '1028': '',
          '1041': '',
          '1075': ''
        },
        defaultParams: { // 級聯菜單默認
          value: 'caseTypeId',
          label: 'caseType',
          children: 'childrens',
          checkStrictly: false
        },
        protectcaseTypeIdList:[],
        iscases: false,
        pageGoods: [],
        custGroup: [],
        mainCaseIds: [],
        queryCanProcessTmState: false,
        queryModuleData: {},
        changeNAInfo: {
          tmName: '',
          regNumber: '',
          regNoticeDate: '',
          validStartDate: '',
          validEndDate: ''
        },
        regNumberList: [],
        tmlist: [
          '许可备案',
          '转让/移转',
          '撤回商标申请',
          '补发商标注册证',
          '补发商标变转续证明'
        ],
        elstepList: [],
        filingOperationState: false,
        showType: false,
        queryCustomerNameIdList:[],
        CaseInvestigatorsFlag:true
      }
    },
    watch: {
      'caseDetailFoemData.lawyer1UserId'(n,o){
        this.oldlawyer1UserId=n
      },
      'caseDetailFoemData.lawyer2UserId'(n,o){
        this.oldlawyer2UserId=n
      },
      'caseDetailFoemData.goodClasses' (n) {
        if (n) {
          this.caseDetailFoemData.goodClasses = n
            .replace(/\D/g, ';')
            .replace(/;+/g, ';')
        }
      },
      'caseDetailFoemData.appCertFileIsCn' (n) {
        console.log(n)
      },
      dialogFormjoin (n) {
        if (n == 1) {
          this.joinCreatdialog()
        }
      },

      // "selectData.apps"(n) {
      //   this.$nextTick(function() {
      //     this.appselectChange(this.caseDetailFoemData.appId, "1");
      //   });
      // }


    },
    mixins: [require('@/views/workbench/case/components/TabNameStorage.vue').default],
    created () {
      this.dcdata = fydefaultdc
      this.dcvalue = fydefaultdcmr
      this.firstGetTrademark = true
      console.log(this.caseDetailFoemData.caseEvolve, '___')

      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        //  this.$route.query.pageId

        this.mainCaseIds = id.split(',')
        if (this.mainCaseIds.length > 1) {
          this.iscases = true
        }

        this.fetchData()
        this.getCrestDataUp()
        // this.fetchData("387182,386627,387182");
      } else {
      }
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll, true)
    },
    methods: {
      highlightKey(text, key) {
        if (!key || !text || text.indexOf(key) === -1) {
          // 没有匹配到就原样返回
          return text;
        }
        const regex = new RegExp(key, 'gi');
        return text.replace(regex, `<span style="color: red;">${key}</span>`);
      },
      appCnAddrChange(e) {
        if (e) {
          this.caseDetailFoemData.appEnAddr = e.addressEn
        }
      },
      handleAppCnName(e) {
        this.caseDetailFoemData.appId = e.appId
        this.caseDetailFoemData.appEnName = e.applicantEnName
        this.changeAppId(e.appId)
      },
      changeAppId(appId) {
        this.caseDetailFoemData.appCountry = this.selectData.appList.find(item => item.appId === appId) && this.selectData.appList.find(item => item.appId === appId).country
        appId && queryAppAddrByAppIdUrl({
                appId
              }).then(res => {
                this.selectData.appaddr = res.data || []
                this.caseDetailFoemData.appCnAddr = this.$commonUtils.unique(this.selectData.appaddr.filter(itm=>!!itm.addressCn), 'addressCn') ? this.$commonUtils.unique(this.selectData.appaddr.filter(itm=>!!itm.addressCn), 'addressCn')[0].addressCn : ''
                this.caseDetailFoemData.appEnAddr = this.$commonUtils.unique(this.selectData.appaddr.filter(itm=>!!itm.addressEn), 'addressEn') ? this.$commonUtils.unique(this.selectData.appaddr.filter(itm=>!!itm.addressCn), 'addressEn')[0].addressEn : ''
              })
      },
      async chongtuTestFunc(flag){
        if (this.caseDetailFoemData.ctAudit && !flag) return false;
        return new Promise(resolve => {
          chongtuTest({
            taskType: 3,
            taskId: this.caseDetailFoemData.taskId,
            draftNumber: this.caseDetailFoemData.agentNum,
            ...this.$commonUtils.cleanNullAttr(this.caseDetailFoemData)
          }).then(res => {
            if (res.messageType == 10) {
              this.checkChongTuSet(res.data.length > 500 ? res.data.splice(0, 500) : res.data , "", '')
              resolve(true)
            } else {
              resolve(false)
            }
          }).catch(err => {
            resolve(true)
          })
        })
      },
      alertChongtuAuditFunc(type){
      this.chongtuAuditView = type
    },
    chongtuAuditFunc(result){
      if (!this.chongtuAuditReason) {
        this.$message.error(`请填写${result === 1 ? '通过' : '退回'}理由！`)
        return
      }
        chongtuAudit({
          taskType: 3,
          failReason: this.chongtuAuditReason,
          taskId: this.caseDetailFoemData.taskId,
          result: result === 1 ? 1 : 0
        }).then(res => {
          this.$message.success('审核成功！')
          this.updateCtAudit()
        })
      },
      ifNewLevelFunc() {
        return
        ifNewLevel({caseTypeId: this.caseDetailFoemData.caseTypeId}).then(res => {
          this.ifModifyWorkHour = res.data.ifModifyWorkHour
          if (this.ifModifyWorkHour) {
            !this.caseDetailFoemData.hrType && (this.caseDetailFoemData.hrType = 2)
          }else{
           this.caseDetailFoemData.hrType = 1
          }
        })
      },
      checkCaseRoleSelectList(){
        // 承办组
        this.caseDetailFoemData.trademarkCaseCBWorkgroups && this.caseDetailFoemData.trademarkCaseCBWorkgroups.length && this.caseDetailFoemData.trademarkCaseCBWorkgroups.forEach(item => {
          if (item.trademarkCaseWorkgroupMembers && item.trademarkCaseWorkgroupMembers.length) {
            item.trademarkCaseWorkgroupMembers.forEach(it => {
              if (it.caseRoleName) {
                this.caseRoleSelectList.push(it.caseRoleName)
              }
            })
          }
        })
        //客户组
        this.caseDetailFoemData.trademarkCaseCustWorkgroups && this.caseDetailFoemData.trademarkCaseCustWorkgroups[0] && this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers.forEach(item => {
          if (item.caseRoleName) {
            this.caseRoleSelectList.push(item.caseRoleName)
          }
        })
        this.caseRoleSelectList = [...new Set(this.caseRoleSelectList)]
      },
      customerView(){
        if(!this.caseDetailFoemData.custId)return;
        window.open(`/#/workbench/customer_management/cust_view/${this.caseDetailFoemData.custId}`)
      },
      filterMethod(e){
        this.filterText=e
      },
      changeCbLawyer(e){
        this.filterText=''
        if(e){
          queryCaseWorkgroupUrl({userId:e}).then(res=>{
            let length=this.caseDetailFoemData.trademarkCaseCBWorkgroups.length
            if(res.data.length){
              res.data.forEach(item=>{
                item.trademarkCaseWorkgroupMembers=item.wkgUsers
              })
              this.caseDetailFoemData.trademarkCaseCBWorkgroups= this.$commonUtils.unique(res.data.concat(this.caseDetailFoemData.trademarkCaseCBWorkgroups),'wkgId')
            }
            if(length!=this.caseDetailFoemData.trademarkCaseCBWorkgroups.length){
              this.CaseInvestigatorsFlag=false
              this.$nextTick(()=>{
                this.CaseInvestigatorsFlag=true
              })
            }
          })
        }
      },
      removeTag(e){
        let length=this.caseDetailFoemData.trademarkCaseCBWorkgroups.length
        if(e==1){
          if(this.caseDetailFoemData.trademarkCaseCBWorkgroups.find(item => item.trademarkCaseWorkgroupMembers.map(i=>i.userId).includes(this.oldlawyer1UserId))){
            this.caseDetailFoemData.trademarkCaseCBWorkgroups.splice(this.caseDetailFoemData.trademarkCaseCBWorkgroups.indexOf(this.caseDetailFoemData.trademarkCaseCBWorkgroups.find(item => item.trademarkCaseWorkgroupMembers.map(i=>i.userId).includes(this.oldlawyer1UserId))),1)
          }
        }
        if(e==2){
          if(this.caseDetailFoemData.trademarkCaseCBWorkgroups.find(item => item.trademarkCaseWorkgroupMembers.map(i=>i.userId).includes(this.oldlawyer2UserId))){
            this.caseDetailFoemData.trademarkCaseCBWorkgroups.splice(this.caseDetailFoemData.trademarkCaseCBWorkgroups.indexOf(this.caseDetailFoemData.trademarkCaseCBWorkgroups.find(item => item.trademarkCaseWorkgroupMembers.map(i=>i.userId).includes(this.oldlawyer2UserId))),1)
          }
        }
        if(length!=this.caseDetailFoemData.trademarkCaseCBWorkgroups.length){
          this.CaseInvestigatorsFlag=false
          this.$nextTick(()=>{
            this.CaseInvestigatorsFlag=true
          })
        }
      },
      selectCustChange(e){
        if(!e){
          return
        }
        this.caseDetailFoemData.custId&&queryCustomerContactByCustIdUrl({
          caseTypeId: this.caseDetailFoemData.caseTypeId,
          custId: this.caseDetailFoemData.custId
        })
          .then(response => {
            // this.selectData.country = response.data;
            this.selectData.customerContacts = response.data.customerContacts;
            this.selectData.billContacts = response.data.BillContacts;
          })
          .catch(err => {
            console.log(err);
          });
      },
      addlaw(type){

        switch (type) {
          case 1:
            this.caseDetailFoemData.agentPartyArray.unshift({
              partyType:1,
              nameId:'',
              nameIdFrom:2,
              address : '',
              position :''
            })
            break;
          case 2:
            this.caseDetailFoemData.adversaryArray.unshift({
              partyType:2,
              nameId:'',
              nameIdFrom:3,
              address : '',
              position :''
            })
            break;
          case 3:
            this.caseDetailFoemData.otherPartyArray.unshift({
              partyType:3,
              nameId:'',
              nameIdFrom:3,
              address : '',
              position :''
            })
            break;
          case 4:
            this.caseDetailFoemData.lawsuitConflicterList.unshift({
              conId:'',
              conNature:''
            })
            break;
          default:
            break;
        }
      },
      handleScroll () {
        var top1 = document.getElementsByClassName('tilteSpan')
        var top2 = Array.prototype.slice.call(top1)

        top2 = top2.filter(
          item =>
            item.getBoundingClientRect().top > 0 &&
            item.getBoundingClientRect().top < 150
        )

        if (top2.length == 1) {
          let stepindex = ''
          this.elstepList.forEach((item, index) => {
            if (item.id == top2[0].children[0].id && item.state == true) {
              stepindex = index
            }
          })

          this.stepActive1 = stepindex
        }
      },
      editTextarea(type){
        this.curProp=type
        this.centerDialogVisible=true
      },
      contactchange (id) {
        queryCustomerContactByCustContactIdUrl({ custContactId: id }).then(
          res => {
            this.selectData.customerMailAdds = res.data.customerMailAdds
            this.selectData.billAdds = res.data.BillAdds
            this.selectData.billAdds.forEach(item => {
              if (!item.addressCn) {
                item.addressCn = item.addressEn
              }
            })
            this.caseDetailFoemData.letterAddrId = ''
            this.$set(this.caseDetailFoemData,'billAddrId',null)
            // this.caseDetailFoemData.billAddrId = ''
          }
        )
      },
      getGoods (goods) {

        this.goodsDetailData.goods = [
          ...this.goodsDetailData.goods,
          ...goods
        ]

        const res = new Map()
        this.goodsDetailData.goods = this.goodsDetailData.goods.filter(
          item => !res.has(item.goodName) && res.set(item.goodName, 1)
        )

        this.goodsDetailData.goodClasses = [
          ...new Set(this.goodsDetailData.goods.map(item => item.goodClass))
        ].join(';')
        // Array.from(new Set(arr))
      },
      delgood (items) {
        this.goodsDetailData.goods = this.goodsDetailData.goods.filter(
          data => !items.includes(data)
        )
        this.goodsDetailData.goodClasses = [
          ...new Set(this.goodsDetailData.goods.map(item => item.goodClass))
        ].join(';')
      },
      regnumberchange (val) {
        this.$confirm("是否根据商标号更新案件信息？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {


          this.searchTmUrl(val)
          // this.caseDetailFoemData.regNumberList
          // this.caseDetailFoemData.caseIds = this.mainCaseIds;
          // saveCaseInfoUrl(this.caseDetailFoemData).then(res => {
          //   this.fetchData("1");
          // });
        });
      },
      searchTmUrl(val){
        searchTmUrl({ regNumbers: val, trans: 20,pageSize:100,pageNo:1 }).then(res => {
          if (!res.data || !res.data.length) {
            return;
          }
          this.goodsDetailData.appCnName = res.data[0].applicantName;
          this.goodsDetailData.tmName = res.data[0].tmName;
          this.goodsDetailData.regNumber = res.data[0].regNumber;
          this.goodsDetailData.validStartDate = res.data[0].validStartDate;
          this.goodsDetailData.validEndDate = res.data[0].validEndDate;
          this.goodsDetailData.regDate = res.data[0].regNoticeDate;
          this.goodsDetailData.approvalDate=res.data[0].approvalDate;
          this.goodsDetailData.approvalNumber=res.data[0].approvalNumber;
          // this.caseDetailFoemData.appDate = res[0].data.appDate;
          this.goodsDetailData.tmType =
            res.data[0].classify === "证明"
              ? "3"
              : res.data[0].classify === "集体"
              ? "2"
              : "1";
          this.goodsDetailData.imageFile =
            "/tmFile" + res.data[0].imgFilePath;
          this.tyimage="tmFile" + res.data[0].imgFilePath;
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
          if(res.data[0].trademarkCategories.length){
            this.goodsDetailData.goods = this.getLanglist(
              res.data.map(item => item.trademarkCategories).filter(item => item)
            ).map(item => ({
              goodClass: item.tmType,
              goodEnName: item.enName,
              goodName: item.name,
              id: item.id,
              similarGroup: item.tmGroup
            }));
            this.goodsDetailData.goodClasses = [
              ...new Set(
                this.goodsDetailData.goods.map(item => item.goodClass)
              )
            ].join(";");
          }else {
            this.goodsDetailData.goodClasses=res.data[0].tmType
          }

          // tmdetailUrl3({tmId:res.data[0].tmId}).then(res=>{
          //
          // })
        });
      },
      changeAppJoinState (row, index) {
        // if (row.modifyState) {
        //   this.caseDetailFoemData.joinApps[index].caseIds = this.mainCaseIds;
        //   modifyjoinappUrl(this.caseDetailFoemData.joinApps[index]).then(
        //     res => {}
        //   );
        // }
        // this.caseDetailFoemData.joinApps[index].modifyState = !row.modifyState;
        // this.caseDetailFoemData.joinApps.push({});
        // this.caseDetailFoemData.joinApps.pop();
        this.dialogFormjoin = 2
        this.joinFormData = row
      },
      getLanglist (array) {
        const arr = []
        array.forEach(item => {
          arr.push(...item)
        })
        return arr
      },
      cmDialogShow () {
        this.selectTmSearchInput = this.caseDetailFoemData.tmName

        this.getCmtmdata()
      },
      getCmtmdata (type) {
        this.sameloading = true
        if (type == 'seach') {
          this.sameSenddata.pageNo = '1'
        }
        this.sameSenddata.tmName = this.selectTmSearchInput
        this.sameSenddata.tmType = this.checkedgoodClass.join(';')
        checkSameTmUrl(this.sameSenddata)
          .then(res => {
            this.sameloading = false
            this.sameTmdata = res.data
            this.sameTmdatatotal = res.total
            this.$message.success(res.success)
          })
          .catch(error => {
            this.sameloading = false
          })
      },
      handleCheckAllgoodClassChange (val) {
        this.checkedgoodClass = val ? goodClasses : []
        this.isIndeterminategoodClass = false
      },
      handleCheckedgoodClassChange (value) {
        const checkedCount = value.length
        this.checkAllgoodClass = checkedCount === this.allgoodClass.length
        this.isIndeterminategoodClass =
          checkedCount > 0 && checkedCount < this.allgoodClass.length
      },

      // 共同申请人
      addjionP () {
        if (this.dialogFormjoin == 1) {
          this.caseDetailFoemData.joinApps.push(this.joinFormData)
          this.joinFormData.caseIds = this.mainCaseIds
          modifyjoinappUrl(this.joinFormData)
        } else if (this.dialogFormjoin == 2) {
          this.caseDetailFoemData.joinApps.splice(
            this.caseDetailFoemData.joinApps
              .map(item => item.joinAppId)
              .indexOf(this.joinFormData.joinAppId),
            1,
            this.joinFormData
          )
        }
        this.joinFormData = {
          caseIds: this.mainCaseIds,
          appId: '',
          cardName: '',
          cardId: '',
          nameCn: '',
          nameEn: '',
          addrEn: '',
          addrCn: '',
          joinAppType: '',
          joinAppCoun: '',
          getFileIsEn: '',
          materialArray: [],
          modifyState: false
        }
        this.dialogFormjoin = 0
      },
      deljoinp (item, index) {
        // const index = this.caseDetailFoemData.joinApps.indexOf(item);
        this.caseDetailFoemData.joinApps.splice(index, 1)
        delJoinAppUrl({ joinAppId: item.joinAppId, caseIds: this.mainCaseIds })
      },
      delMDL (index) {
        // const index = this.caseDetailFoemData.trademarkCaseBasicinfos.indexOf(
        //   item
        // );
        this.caseDetailFoemData.trademarkCaseBasicinfos.splice(index, 1)
      },
      handleClickTab (tab, event) {
        if (tab.index != '4') {
          this.tabtypeDown = false
        } else {
          this.tabtypeDown = true
        }
        if (tab.index == '1' && this.caseDetailFoemData.custId) {
          queryCustomerReqUrl({ custId: this.caseDetailFoemData.custId, caseId: this.caseDetailFoemData.caseId }).then(
            res => {
              this.custReqBills = res.data.custReqBills
              this.custReqCases = res.data.custReqCases
              this.custActivity = res.data.custActivity
              this.custActivity.forEach(item=>{
                item.specialInfo = item.subject + '\r\n' + item.specialInfo
                if(this.custActivityList.find(i => i.actType == item.actType)){
                  this.custActivityList.find(i => i.actType == item.actType).custActivity.push(item)
                }else{
                  this.custActivityList.push({
                    actType: item.actType,
                    custActivity: [item]
                  })
                }
              })
            }
          )
        }
        if (tab.index == '2') {
        }
      },
      getChangedata(){

        // let item=JSON.parse(JSON.stringify(this.caseDetailFoemData))
        let item = this.$commonUtils.compareObjAttrs(this.defaultCaseData, this.caseDetailFoemData)
            item.nullValueList = [];

        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            const element =item[key];
            const element1=this.defaultCaseData[key];

            if(JSON.stringify(element) != JSON.stringify(element1)){
              if((!element&&element1)){
                item.nullValueList.push(key);
              }
            }else{



            }
          }
        }
        return item;




      },
      getProtectcaseTypeIdList(type){
        let caseTypeId=1
        if(type==5){
          caseTypeId=75
        }
        if(type==6){
          caseTypeId=76
        }
        if(type==7){
          caseTypeId=86
        }
        if(caseTypeId==1){
          this.caseDetailFoemData.protectcaseTypeIdList= this.$commonUtils.getTwoDimensionalArray(this.$store.state.caseInformation.caseTypeList.filter(item=>item.caseTypeId==caseTypeId)[0].childrens,'caseTypeId',this.caseDetailFoemData.lawsuitCasetypeArray,{children:'childrens',parent:'parent'})

        }else {

          this.caseDetailFoemData.protectcaseTypeIdList= this.$commonUtils.getTwoDimensionalArray(this.$store.state.caseInformation.caseTypeList.filter(item=>item.caseTypeId==caseTypeId)[0].childrens,'caseTypeId',this.caseDetailFoemData.caseTypeId,{children:'childrens',parent:'parent'})


        }



      },
      async fetchData (type) {
        let {data}  =  await lawsuitUrl({ caseIds: this.mainCaseIds ,initFlag:1})
        this.caseDetailFoemData=Object.assign(data, this.caseDetailFoemData);
        lawsuitUrl({ caseIds: this.mainCaseIds })
          .then(response => {
            this.caseDetailFoemData = Object.assign(this.caseDetailFoemData, response.data);

            // if (this.$route.query.taskType == 3) { // 保护
            //   if (!this.caseDetailFoemData.hrType) {
            //     this.caseDetailFoemData.hrType = 2
            //   }
            // } else {
            //     this.ifModifyWorkHour = 0
            //     this.caseDetailFoemData.hrType = 1
            // }
              // this.ifNewLevelFunc()
            this.getProtectcaseTypeIdList(this.$route.query.taskType)
            this.queryCustomerNameIdList=[{custId:Number(this.caseDetailFoemData.custId),fullname:this.caseDetailFoemData.custName}]
            if(this.caseDetailFoemData.droitNumber){
              this.searchTmUrl(this.caseDetailFoemData.droitNumber)
            }
            this.defaultCaseData=JSON.parse(JSON.stringify(response.data))
            if (
              !this.caseDetailFoemData.discount ||
              this.caseDetailFoemData.discount == 'null'
            ) {
              this.$set(this.caseDetailFoemData, 'discount', 100)
              // this.caseDetailFoemData.discount = 100
            }
            this.materialArray = this.caseDetailFoemData.materials



            if (
              /^['C'|'D']$/.test(this.caseDetailFoemData.custLevel) ||
              !this.caseDetailFoemData.custLevel
            ) {
              queryAlltask({
                userId: this.$store.getters.userId,
                taskId: this.caseDetailFoemData.taskId
              }).then(res => {
                if (res.data && res.data.length && res.data[0].createStatus) {
                  this.curCustLevel = true
                } else {
                  if(!this.caseDetailFoemData.custLevel){
                    this.caseDetailFoemData.custId&&queryCustomerContactByCustIdUrl({
                      caseTypeId: this.caseDetailFoemData.caseTypeId,
                      custId: this.caseDetailFoemData.custId
                    })
                      .then(response => {
                        if(response.data.country=='中国'){
                          this.curCustLevel = false;
                        }else {
                          this.curCustLevel = true;
                        }
                      })
                  }else {
                    this.curCustLevel = false;
                  }
                }
              })
            } else {
              this.curCustLevel = true
            }
            this.ch_caseTypr = this.caseDetailFoemData.caseType
            //             if(this.caseDetailFoemData.caseType=='撤回商标申请'&&this.caseDetailFoemData.changeType){
            //              switch (this.caseDetailFoemData.changeType) {

            //               case '转让':
            // this.ch_caseTypr='转让/移转'
            //                 break;

            //               case '许可':
            //  this.ch_caseTypr='许可备案'
            //                 break;

            //               default:
            //                 break;
            //             }
            //             }



            // if (
            //   this.caseDetailFoemData.changeType === "异议" ||
            //   this.caseDetailFoemData.changeType === "注册驳回复审" ||
            //   this.caseDetailFoemData.changeType === "国际注册驳回复审" ||
            //   this.caseDetailFoemData.changeType === "撤销商标复审" ||
            //   this.caseDetailFoemData.changeType === "不予注册复审" ||
            //   this.caseDetailFoemData.changeType === "异议答辩" ||
            //   this.caseDetailFoemData.changeType === "撤三答辩（提供使用证明）" ||
            //   this.caseDetailFoemData.changeType === "撤销通用名称答辩" ||
            //   this.caseDetailFoemData.changeType === "参加不予注册复审" ||
            //   this.caseDetailFoemData.changeType === "无效宣告答辩" ||
            //   this.caseDetailFoemData.changeType === "撤销复审答辩" ||
            //   this.caseDetailFoemData.changeType === "撤销三年停止使用申请" ||
            //   this.caseDetailFoemData.changeType === "撤销成为通用名称注册商标" ||
            //   this.caseDetailFoemData.changeType === "无效宣告申请" ||
            //   this.caseDetailFoemData.changeType === "转让/移转" ||
            //   this.caseDetailFoemData.changeType === "行政复议"
            // ) {
            //   this.cdBool = true;
            // }



            this.elstepList = [
              { title: '案件详情', state: true, id: 'ajxq-title' },
              { title: '客户信息', state: true, id: 'khxx-title' },
              { title: '权利信息', state: true, id: 'sbxx-title' },
              { title: '各方当事人', state: true, id: 'gfdsr-title' }
            ].filter(item => item.state)

            if (!this.caseDetailFoemData.caseLevel) {
              this.caseDetailFoemData.caseLevel = 1
            }
            if (!this.caseDetailFoemData.otherAgency) {
              this.caseDetailFoemData.otherAgency = '0'
            }
            if (!this.caseDetailFoemData.assignColor) {
              this.caseDetailFoemData.assignColor = false
            }
            if (this.caseDetailFoemData.trademarkCaseCustWorkgroups.length <= 0) {
              this.caseDetailFoemData.trademarkCaseCustWorkgroups = [
                { wkgId: '', trademarkCaseWorkgroupMembers: [] }
              ]
            }
            // if (this.caseDetailFoemData.trademarkCaseCBWorkgroups.length <= 0) {
            //   this.caseDetailFoemData.trademarkCaseCBWorkgroups = [
            //     {trademarkCaseWorkgroupMembers: []}
            //   ]
            // }
            // if (this.caseDetailFoemData.trademarkCaseLCWorkgroups.length <= 0) {
            //   this.caseDetailFoemData.trademarkCaseLCWorkgroups = [
            //     {trademarkCaseWorkgroupMembers: []}
            //   ]
            // }


            if (this.caseDetailFoemData.imageFile) {
              this.tyimage = `/ipdoc${this.caseDetailFoemData.imageFile}`
            }

            this.backData = JSON.parse(JSON.stringify(this.caseDetailFoemData))
            this.checkCaseRoleSelectList()
            this.getCreatData()
          })
          .catch(err => {
            console.log(err)
          })
      },
      getCrestDataUp () { },
      queryUserAll(){
        queryUserAll().then(res=>{
          this.userList=res.data
        })
      },
      getCreatData () {
        if(this.caseDetailFoemData.lawsuitApplicantArray.length){
          queryApplicantByIdList({ appIdArray:this.caseDetailFoemData.lawsuitApplicantArray}).then(res=>{
            this.selectData.appList=res.data
          })
        }
        if(this.caseDetailFoemData.appId){
          queryAppAddrByAppIdUrl({
            appId: this.caseDetailFoemData.appId
          }).then(res => {
            this.selectData.appaddr = res.data || []
          })
          this.taskType != 6 && queryApplicantByIdList({ appIdArray: [this.caseDetailFoemData.appId]}).then(res=>{
            this.selectData.apps=res.data
          })
        }
        this.caseDetailFoemData.custId&&queryAppInfoUrl({ custId: this.caseDetailFoemData.custId }).then(
          response => {
            this.selectData.appList = response.data
            this.selectData.apps = response.data
          }
        );
        let conarrs= [...this.caseDetailFoemData.adversaryArray,...this.caseDetailFoemData.otherPartyArray,...this.caseDetailFoemData.lawsuitConflicterList];
        conarrs=conarrs.filter(itm=>!!itm.nameId||!!itm.conId).map(res=>res.nameId||res.conId)
        console.log(conarrs,'conarrs');
        if(conarrs&&conarrs.length>0){
          queryConflicterListUrl({ conIdArray: conarrs }).then(res => {
            this.selectData.liyiarr = res.data
          })
        }
        this.queryUserAll()
        queryMaterialTypeUrl().then(res => {
          this.fileName = res.data
          this.initfilelist()
        })
        if (this.caseDetailFoemData.foreignAgencyCustId) {
          queryCustomerUrl({
            customerID: this.caseDetailFoemData.foreignAgencyCustId
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
        querycustSelectClass({ classId: '1042,1134,1135,1027,1029,1136,1031,1020,1030,1195'}).then(response => {
          this.selectData.apptypelist = response.data['1042']
          this.selectData.natureOfWorkList = response.data['1136']
          this.selectData.agencyList = response.data['1195'] // 代理机构

          this.selectDataByClass=response.data
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

        queryOtherCustomerListUrl({ isCollaboration: '1',collaborationStatusArray:[2249,2250] })
          .then(response => {
            this.selectData.hzLists = response.data
            this.selectData.hzLists.forEach(item => {
              item.label = item.fullname + (item.fullnameEn ? ` (${item.fullnameEn})` : '')
              item.value = item.custId
            })
          })
          .catch(err => {
            console.log(err)
          })


        this.caseDetailFoemData.custId&&queryCustomerContactByCustIdUrl({
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
      getTopPosition (el, active) {
        this.stepActive1 = active

        document.getElementById(el).scrollIntoView()
        // scrollTo(
        //     document.getElementById("main-container").scrollTop +
        //     document.getElementById(el).getBoundingClientRect().top -
        //     document.getElementsByClassName("fixed-header")[0].offsetHeight -
        //     document.getElementById(el).offsetTop,
        //   300
        // );
      },
      async filingOperation (command) {
        // '其他保护业务' '线上维权', '海关备案申请', '官方培训', '展会维权', '代表客户参加会议'
        if (this.$route.query.taskType == 3 && (this.caseDetailFoemData.lawsuitCasetypeArray.find(item => ![128, 141, 144, 300040, 300044, 300045].includes(item))) && this.caseDetailFoemData.lawsuitConflicterList.filter(item => item.conFullname).length < 1) {
          this.$message.error('请添加侵权人！')
          return;
        }
        if(!this.$commonUtils.checkBA(this.caseRoleSelectList)){
          this.$message.error('承办律师或客户律师有误！')
          return
        }
        if(!this.caseRoleSelectList.includes('承办律师一')){
          this.$message.error('请选择承办律师一')
          return
        }
        if(!this.caseRoleSelectList.includes('客户律师一')){
          this.$message.error('请选择客户律师一')
          return
        }
        this.$route.query.copy = 'false'
        if (command === 'prefiling') {
          this.submitCaseForm('prefiling', 1)
        } else if (command == 'createBills') {
          this.$router.push({
            path: '/workbench/finance/off_bill/bill',
            query: {
              taskId: this.caseDetailFoemData.taskId,
              agentNum: this.caseDetailFoemData.agentNum
            }
          })
        } else {
          if (this.$route.query.taskType == 3 || this.$route.query.taskType == 7) {
            if (this.caseDetailFoemData.lawsuitApplicantArray && this.caseDetailFoemData.lawsuitApplicantArray.length) {
              const res = await queryCaseAppExamine({appIds: this.caseDetailFoemData.lawsuitApplicantArray, caseIds: [this.caseDetailFoemData.caseId]})
              if (res.messageType == 300) {
                this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
                return;
              }
            }
          } else if (this.$route.query.taskType==5 || this.$route.query.taskType==6) {
            if (this.caseDetailFoemData.appId && this.caseDetailFoemData.appId != '0000') {
              const res = await queryCaseAppExamine({appIds: [this.caseDetailFoemData.appId], caseIds: [this.caseDetailFoemData.caseId]})
              if (res.messageType == 300) {
                this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
                return;
              }
            }
          }

          billSubmitUrl({
            taskId: this.caseDetailFoemData.taskId,
            userId: this.$store.getters.userId
          }).then(res => {
            this.goNext()
          })
        }
      },
      // getRegdetailData (val) {
      //   searchTmUrl({ regNumbers: this.caseDetailFoemData.droitNumber, trans: 2 }).then(res => {
      //     if (!res.data && !res.data.length) {
      //       return
      //     }
      //     this.regdetail.appCnName = res.data[0].applicantName
      //     this.regdetail.tmName = res.data[0].tmName
      //     this.regdetail.regNumber = res.data[0].regNumber
      //     this.regdetail.validStartDate = res.data[0].validStartDate
      //     this.regdetail.validEndDate = res.data[0].validEndDate
      //     this.regdetail.regDate = res.data[0].regNoticeDate
      //     // this.caseDetailFoemData.appDate = res.data.appDate;
      //     this.regdetail.tmType =
      //       res.data[0].classify === '证明'
      //         ? '3'
      //         : res.data[0].classify === '集体'
      //           ? '2'
      //           : '1'
      //     this.regdetail.imageFile =
      //       '/downloadimage' + res.data[0].imgFilePath
      //     this.regdetail.ifSolidTm =
      //       res.data[0].ifSolidTm == '是' ? '1' : '0'
      //     this.regdetail.assignColor = res.data[0].colorDesc
      //       ? res.data[0].colorDesc
      //       : false
      //     this.regdetail.tmVoice = res.data[0].tmForm
      //       ? res.data[0].tmForm === '文字'
      //         ? '0'
      //         : '1'
      //       : '0'
      //     this.regdetail.colorSign = '0'
      //     // this.caseDetailFoemData.tmIdList = info.map(item => item.tmId);
      //
      //     this.regdetail.goods = getLanglist(
      //       res.data.map(item => item.trademarkCategories).filter(item => item)
      //     ).map(item => ({
      //       goodClass: item.tmType,
      //       goodEnName: item.enName,
      //       goodName: item.name,
      //       id: item.id,
      //       similarGroup: item.tmGroup
      //     }))
      //     this.regdetail.goodClasses = [
      //       ...new Set(
      //         this.regdetail.goods.map(item => item.goodClass)
      //       )
      //     ].join(';')
      //     // tmdetailUrl3({tmId:res.data[0].tmId}).then(res=>{
      //     //
      //     // })
      //   })
      // },
      queryCustomerNameId(query) {
        if (!this.loading) {
          if (query !== '') {
            this.loading = true;
            setTimeout(() => {
              queryCustomerNameId({curStatus: '4,5', pageNo: 0, pageSize: 100, keyword: query }).then(res => {
                this.queryCustomerNameIdList = res.data
                this.loading = false;
              })
            }, 200);
          }
        } else {
          this.queryCustomerNameIdList = [];
        }
      },
      async submitCaseForm (forwordType, checkCase, checkChongTu = 1) {
        console.log(this.caseDetailFoemData.caseTypeId)
        if (this.$route.query.taskType == 3 && (this.caseDetailFoemData.lawsuitCasetypeArray.find(item => ![128, 141, 144, 300040, 300044, 300045].includes(item))) && this.caseDetailFoemData.lawsuitConflicterList.filter(item => item.conFullname).length < 1) {
          this.$message.error('请添加侵权人！')
          return;
        }
        if ((this.$route.query.taskType == 3 || this.$route.query.taskType == 7) && !(this.caseDetailFoemData.lawsuitApplicantArray && this.caseDetailFoemData.lawsuitApplicantArray.length)) {
          this.$message.error('请增加申请人！')
          return
        } else if (this.$route.query.taskType == 5 && !this.caseDetailFoemData.appId) {
          this.$message.error('请增加申请人！')
          return
        } else if(this.$route.query.taskType == 6 && !this.caseDetailFoemData.appCnName) {
          this.$message.error('请增加申请人！')
          return
        }
        if(!this.caseDetailFoemData.caseCustRespUserArray ||
          !this.caseDetailFoemData.caseCustRespUserArray.length){
          this.$message.error('请选择客户负责人')
          return false
        }
        const applist = [...this.selectData.apps, ...this.queryAllData]
        if (this.$route.query.taskType == 6 && checkCase !== 0 && this.caseDetailFoemData.appCnName && !applist.find(i => String(i.applicantName).toLowerCase() === String(this.caseDetailFoemData.appCnName).toLowerCase())) {
          await this.$confirm('建立新申请人需要提交客户管理组刘佳审核，审核通过后方可继续立卷', '提示', {
            confirmButtonText: '提交审核',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.caseDetailFoemData.appSub = 1
            this.caseDetailFoemData.appId = '0000'
            this.submitCaseForm(undefined, 0)
          }).catch(() => {
            this.caseDetailFoemData.appSub = 0
            this.caseDetailFoemData.appId = '0000'
            // this.caseDetailFoemData.appCnName = '0000'
            this.submitCaseForm(undefined, 0)
          })
          return
        }
        if(!this.$commonUtils.checkBA(this.caseRoleSelectList)){
          this.$message.error('承办律师或客户律师有误！')
          return
        }
        if(!this.caseRoleSelectList.includes('承办律师一')){
          this.$message.error('请选择承办律师一')
          return
        }
        if(!this.caseRoleSelectList.includes('客户律师一')){
          this.$message.error('请选择客户律师一')
          return
        }
        this.$route.query.copy = 'false'

        // this.caseDetailFoemData.caseIds = this.caseDetailFoemData.caseId;
        delete this.caseDetailFoemData.materials
        delete this.caseDetailFoemData.caseEvolve
        delete this.caseDetailFoemData.tmList
        // delete this.caseDetailFoemData.joinApps;
        // delete this.caseDetailFoemData.trademarkCaseCustWorkgroups;
        // delete this.caseDetailFoemData.trademarkCaseLCWorkgroups;
        // delete this.caseDetailFoemData.trademarkCaseCBWorkgroups;
        delete this.caseDetailFoemData.trademarkCaseMadrids;
        delete this.caseDetailFoemData.lawsuitAgencyPartyList;
        delete this.caseDetailFoemData.lawsuitCaseCcList;
        // delete this.caseDetailFoemData.trademarkCaseBasicinfos;
        // delete this.caseDetailFoemData.trademarkCaseCustContacts;
        // delete this.caseDetailFoemData.memberNamelists;

        this.caseDetailFoemData.caseIds = this.mainCaseIds
        if (
          this.$route.query.import == '1' &&
          this.tmlist.includes(this.ch_caseTypr)
        ) {
          delete this.caseDetailFoemData.imageFile
          const sessionObj = JSON.parse(
            sessionStorage.getItem('changeOfNameOrAddressObj')
          )
          var data2 = {
            regNumberList: sessionObj.multipleSelection.map(
              item => item.regNumber
            ),
            tmIdList: sessionObj.multipleSelection.map(item => item.tmId),
            multiclass: sessionObj.multiclass,
            taskId: this.caseDetailFoemData.taskId
          }

          data2.isBatch = '1'
        }
        if (
          this.$route.query.import != '1' &&
          this.tmlist.includes(this.ch_caseTypr)
        ) {
          var data2 = {
            regNumberList: [this.caseDetailFoemData.regNumber],
            taskId: this.caseDetailFoemData.taskId
          }

          data2.isBatch = '0'
        }
        if (this.ch_caseTypr === '变名变址') {
          // delete data.preChangeCnName;
          // delete data.preChangeEnName;
          // delete data.preChangeCnAdress;
          // delete data.preChangeEnAdress;
          var data = Object.assign(
            {},
            this.getChangedata(),
            this.$refs.changeOfNameAndAddress.tmObj,
            data2
          )
        } else if (
          this.tmlist
            .filter(item => item !== '变名变址')
            .includes(this.ch_caseTypr)
        ) {
          var data = Object.assign({}, this.getChangedata(), data2)
        } else {
          var data = Object.assign({}, this.getChangedata())
        }
        data.checkCase = checkCase
        data.checkChongTu = checkChongTu
        // console.log(this.caseDetailFoemData.regNumber, 'shangbiaohao!')
        this.$refs['postForm'].validate(valid => {
          if (valid) {
            data.replaceInfo = ''
            data.taskType = this.$route.query.taskType
            delete data.checkChongTu
            this.$commonUtils.handleObjNullAttr(data, this.backData)
            saveCaseInfoUrl(data)
              .then(async response => {
                if (response.success) {
                  if (response.messageType == '-6') {
                    this.$confirm(response.message + '是否继保存', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      this.submitCaseForm(forwordType, 0, 1)
                    })
                  } else if (response.messageType == '10') {
                    this.checkChongTuSet(response.data, 'sive', forwordType)
                  } else {
                    if (forwordType && forwordType === 'prefiling') {
                      if(valid){
                        if (this.$route.query.taskType == 3 || this.$route.query.taskType == 7) {
                          if (this.caseDetailFoemData.lawsuitApplicantArray && this.caseDetailFoemData.lawsuitApplicantArray.length) {
                            const res = await queryCaseAppExamine({appIds: this.caseDetailFoemData.lawsuitApplicantArray, caseIds: [this.caseDetailFoemData.caseId]})
                            if (res.messageType == 300) {
                              this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
                              return;
                            }
                          }
                        } else if (this.$route.query.taskType==5 || this.$route.query.taskType==6) {
                          if (this.caseDetailFoemData.appId && this.caseDetailFoemData.appId != '0000') {
                            const res = await queryCaseAppExamine({appIds: [this.caseDetailFoemData.appId], caseIds: [this.caseDetailFoemData.caseId]})
                            if (res.messageType == 300) {
                              this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
                              return;
                            }
                          }
                        }
                        this.$router.push({
                          path: '/workbench/case/preFilingPush/1',
                          query: { taskId: this.caseDetailFoemData.taskId,taskType:this.$route.query.taskType }
                        })
                      }else {
                        this.$message.error('请填写必填项')
                      }
                    }else if(forwordType && forwordType === '通过'){
                      auditCase({result:1,userId:this.$store.getters.userId,caseId:this.caseDetailFoemData.caseId,taskId:this.caseDetailFoemData.taskId}).then(res=>{
                        this.goNext()
                      })
                    }else if(forwordType && forwordType === '退回'){
                      auditCase({result:0,userId:this.$store.getters.userId,caseId:this.caseDetailFoemData.caseId,taskId:this.caseDetailFoemData.taskId}).then(res=>{
                        this.goNext()
                      })
                    } else {
                      this.$message.success('保存成功!')
                      //   this.addConflicter()
                      this.goNext()
                    }
                  }
                }
              })
              .catch(err => { })
          } else {
            this.$message.error('请填写必填项且格式填写正确')
            return false
          }
        })
      },
      getfileData (materialTypeId, e) {
        if (materialTypeId == '1000') {
          this.multipleFileList = this.wtsfileList
        }
        if (materialTypeId == '1022') {
          this.multipleFileList = this.wtsfileListzr
        }
        this.curUploadTitle = e.target.offsetParent.previousSibling.innerText.replace(
          /[:]$/g,
          ''
        )
        const data = {
          caseIds: this.mainCaseIds,
          custId: this.caseDetailFoemData.custId,
          type: '2',
          caseId: this.caseDetailFoemData.caseId,
          materialTypeId: materialTypeId,
          applicantId: this.caseDetailFoemData.appId
            ? this.caseDetailFoemData.appId
            : '',
          tokenID: this.token
        }
        if (this.caseDetailFoemData.appId && this.caseDetailFoemData.appId != '0000') {
          data.applicantId = this.caseDetailFoemData.appId
        }
        if (this.joinFormData.joinAppId) {
          data.joinAppId = this.joinFormData.joinAppId
        }
        this.fileData1 = data
        this.DataUploadOrSelectState = true
      },
      checkChongTuSet (chongData, type, forwordType) {
        this.gridData = chongData.length > 500 ?chongData.splice(0, 500) : chongData
        this.chongtuType = type
        this.chongtuForwordType = forwordType
        this.dialogcheckChongTuVisible = true
      },
      dialogcheckChongTuBtn () {
        // if (this.chongtuType == 'sive') {
        //   this.submitCaseForm(this.chongtuForwordType, 0, 0)
        // } else {
        //   this.creatCaseForm(0, 0)
        // }
        //
        // this.dialogcheckChongTuVisible = false
        tijiao({
        taskType: 3,
          taskId: this.caseDetailFoemData.taskId
        }).then(async res => {
          this.$message.success('提交成功!')
          await this.updateCtAudit()
          this.dialogcheckChongTuVisible = false;
        })
      },
      async updateCtAudit(){
      this.goNext()
        // lawsuitUrl({ caseIds: this.mainCaseIds }).then(response => {
        //   this.$set(this.caseDetailFoemData, 'ctAudit', response.data.ctAudit)
        //   this.$set(this.caseDetailFoemData, 'taskId', response.data.taskId)
        // })
      },
      addConflicter () {
        if (
          this.ch_caseTypr === '撤销三年停止使用申请' ||
          this.ch_caseTypr === '异议' ||
          this.ch_caseTypr === '异议答辩' ||
          this.ch_caseTypr === '无效宣告申请' ||
          this.ch_caseTypr === '无效宣告答辩' ||
          this.ch_caseTypr === '无效宣告申请' ||
          this.ch_caseTypr === '无效宣告答辩' ||
          this.ch_caseTypr === '不予注册复审' ||
          this.ch_caseTypr === '撤销商标复审'
        ) {
          if (this.caseDetailFoemData.respondentNameCn) {
            addConflicterUrl({
              custId: this.caseDetailFoemData.custId,
              fullname: this.caseDetailFoemData.respondentNameCn,
              address: this.caseDetailFoemData.respondentAddrCn,
              addressEn: this.caseDetailFoemData.respondentNameEn
            })
          }
        }
      },
      fileData (joinAppId, getFileIsEn) {
        const data = {
          caseIds: this.mainCaseIds,
          custId: this.caseDetailFoemData.custId,
          type: '2',
          caseId: this.caseDetailFoemData.caseId,
          materialTypeId: getFileIsEn ? 1038 : 1037,
          tokenID: this.token
        }
        // if (this.joinFormData.joinAppId) {
        data.joinAppId = joinAppId
        // }
        return data
      },
      searchTm () {
        if (this.caseDetailFoemData.searchResultList == '') {
          this.$message.error('请正确填写需要查询的商标号')
          return
        }
        const listQuery = {}
        listQuery.export = ''
        listQuery.columns = ''
        listQuery.regNumbers = this.caseDetailFoemData.searchResultList
          .split('\n')
          .join(',')
        listQuery.trans = '1'
        listQuery.status = ''
        listQuery.pageSize=100
        listQuery.pageNo=1
        searchTmUrl(listQuery).then(response => {
          this.caseDetailFoemData.tmList = response.data
        })
      },
      dcbtn () {
        const listQuery = {}
        listQuery.export = '1'

        listQuery.regNumbers = this.caseDetailFoemData.searchResultList
          .split('\n')
          .join(',')
        listQuery.trans = '1'
        listQuery.status = ''
        listQuery.columns = this.dcvalue.join(',')

        this.dialogVisibledctm = false
        listQuery.pageSize=100
        listQuery.pageNo=1
        searchTmUrl(listQuery).then(response => {
          var a = document.createElement('a')
          a.setAttribute('href', '/ipdoc' + response.data.exportFilePath)
          a.setAttribute('id', 'zipDownLoad')
          if (document.getElementById('zipDownLoad')) {
            document.body.removeChild(document.getElementById('zipDownLoad'))
          }
          document.body.appendChild(a)
          a.click()
        })
      },
      deleteFile ({ materialTypeId, materialId }) {
        let delmaterialId
        if (!materialId) {
          delmaterialId = this.materialArray.find(
            item => item.materialTypeId == item.materialTypeId
          ).materialId
        } else {
          delmaterialId = materialId
        }
        delCaseMaterialUrl({
          caseIdArray: this.mainCaseIds,
          materialId: delmaterialId
        }).then(res => {
          if (!materialId) {
            this.fileName[materialTypeId] = ''
          } else {
            if (materialTypeId == '1000') {
              this.wtsfileList.splice(
                this.wtsfileList.map(item => item.materialId).indexOf(materialId),
                1
              )
            }
            if (materialTypeId == '1022') {
              this.wtsfileListzr.splice(
                this.wtsfileList.map(item => item.materialId).indexOf(materialId),
                1
              )
            }
          }
        })
      },
      getResponseAndFile (data) {
        const { response, file } = data
        if (response.data.length == '1') {
          if (
            this.materialArray.find(
              item => item.materialTypeId == response.data[0].materialTypeId
            )
          ) {
            for (var key in response.data[0]) {
              this.materialArray.find(
                item => item.materialTypeId == response.data[0].materialTypeId
              )[key] = response.data[0][key]
            }
          } else {
            this.materialArray.push(response.data[0])
          }
          if (file) {
            this.fileName[response.data[0].materialTypeId] = file.name
          } else {
            this.fileName[response.data[0].materialTypeId] =
              response.data[0].materialName
          }
          if (response.data[0].materialTypeId == '1000') {
            response.data[0].name = response.data[0].materialName
            this.wtsfileList.push(response.data[0])
          }
          if (response.data[0].materialTypeId == '1022') {
            response.data[0].name = response.data[0].materialName
            this.wtsfileListzr.push(response.data[0])
          }
          if (response.data[0].materialTypeId == '1018') {
            if (file) {
              this.tyimage = URL.createObjectURL(file.raw)
            } else {
              this.tyimage = 'ipdoc/' + response.data[0].address
            }
          }
          if (
            response.data[0].materialTypeId == '1038' ||
            response.data[0].materialTypeId == '1037'
          ) {
            this.joinFormData.materialArray = response.data
          }
        }
      },
      fileUploadSuccess (response, file, fileList, index) {
        if (response.data.length == '1') {
          this.fileName[response.data[0].materialTypeId] = file.name
          if (response.data[0].materialTypeId == '1018') {
            this.tyimage = URL.createObjectURL(file.raw)
          }
          if (index !== undefined) {
            response.data[0].name = response.data[0].materialName
            this.caseDetailFoemData.joinApps[index]['materialArray'].splice(
              0,
              1,
              response.data[0]
            )
            console.log(this.caseDetailFoemData.joinApps)
          }
        }
      },
      brforeRemoveFile (file, fileList) {
        let delmaterialId
        if (file.response) {
          delmaterialId = file.response.data[0].materialId
        } else {
          delmaterialId = file.materialId
        }
        delCaseMaterialUrl({
          caseIdArray: this.mainCaseIds,
          materialId: delmaterialId
        }).then(res => {
          this.message.success(res.message)
          this.wtsfileList = this.wtsfileList.filter(
            item => item.materialId != delmaterialId
          )
          this.wtsfileListzr = this.wtsfileListzr.filter(
            item => item.materialId != delmaterialId
          )
        })
      },
      remotepaternalUnit(val){
        getAdversaryArray({name: val,pageSize:100,pageNo:1}).then(res=>{
          this.selectData.liyiarr = res.data
        })
      },
      changeConId(val, row) {
        if (val) {
          if (this.selectData.liyiarr.find(item => item.fullname === val) && this.selectData.liyiarr.find(item => item.fullname === val).conId) {
            row.conId = this.selectData.liyiarr.find(item => item.fullname === val).conId
          } else {
            row.conId = undefined
            row.conFullname = val
          }
        } else {
          row.conId = undefined
        }
      },
      remotepaternalUnit1 (val) {
        if(val){
          queryConflicterListUrl({ fullname: val }).then(res => {
            // this.selectData.liyiarr = res.data
            if (res.data && res.data.length) {
              this.selectData.liyiarr.unshift(...res.data)
            } else {
              this.selectData.liyiarr.unshift({
                conId: undefined,
                fullname: val
              })
            }
            this.selectData.liyiarr = this.$commonUtils.unique(this.selectData.liyiarr, 'fullname')
          })
        }
      },
      remoteMethod(value) {
        if(value){
          queryAllUrl({
            applicantName: value,
            pageNo: 1,
            pageSize: 5,
            orderBy:1
          }).then(res => {
            this.selectData.appList=[...res.data,...this.selectData.appList]
          })
        }
      },
      async remotepinput (query, cb) {
        let results = []
        let restaurants = []
        if (!query) {
          restaurants = this.selectData.apps.map(ite => {
            if (ite.applicantName) {
              return { value: ite.applicantName, appId: ite.appId, applicantEnName: ite.applicantEnName }
            } else {
              return { value: '', appId: '', applicantEnName: '' }
            }
          })
          results = query
            ? restaurants.filter(this.createStateFilter(query))
            : restaurants
          cb(results)
          return
        }
        const res = await queryAllUrl({
            applicantName: query,
            pageNo: 1,
            pageSize: 5,
            orderBy:1
          })
        this.queryAllData = res.data
        restaurants = res.data.map(ite => {
          if (ite.applicantName) {
            return { value: ite.applicantName, appId: ite.appId, applicantEnName: ite.applicantEnName }
          } else {
            return { value: '', appId: '', applicantEnName: '' }
          }
        })
        results = query
          ? restaurants.filter(this.createStateFilter(query))
          : restaurants

        cb(results)
      },
      createStateFilter (queryString) {
        return state => {
          return (
            state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
          )
        }
      },
      clearTmMessage () {
        this.tyimage = ''
        this.caseDetailFoemData.goodClasses = ''
        this.caseDetailFoemData.approvalNo = ''
        this.caseDetailFoemData.approvalNumber = ''
        this.caseDetailFoemData.approvalDate = ''
        this.caseDetailFoemData.regNumber = ''
        this.caseDetailFoemData.parentAppNumber = ''
        this.caseDetailFoemData.parentDocNumber = ''
        this.caseDetailFoemData.docDate = ''
        this.caseDetailFoemData.regDate = ''
        this.caseDetailFoemData.validStartDate = ''
        this.caseDetailFoemData.validEndDate = ''
        this.caseDetailFoemData.tmName = ''
        this.caseDetailFoemData.tmNameEn = ''
        this.caseDetailFoemData.quoteTm = ''
        this.caseDetailFoemData.quoteTmClass = ''
        this.caseDetailFoemData.quoteRegNumber = ''
        this.caseDetailFoemData.tmOfficeNumber = ''
        this.caseDetailFoemData.docDate = '';
        (this.caseDetailFoemData.quoteRegNumber = ''),
          (this.caseDetailFoemData.goods = []),
          (this.caseDetailFoemData.appDate = ''),
          (this.caseDetailFoemData.appNumber = ''),
          (this.caseDetailFoemData.tmType = '1'),
          (this.caseDetailFoemData.memberRule = ''),
          (this.caseDetailFoemData.memberNamelist = '')
      },
      workGroup (work) {
        this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers =
          work.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers
        this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers =
          work.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers
        this.caseDetailFoemData.trademarkCaseCBWorkgroups =
          work.trademarkCaseCBWorkgroups
        console.log(111)
      },

      lytranappselectChange (e,st,index) {
        let data=this.selectData.liyiarr.find(item=>item.conId==e)
        if(data){
          this.caseDetailFoemData[st][index].address=data.address
        }
      },
      appselectChange (e,st,index) {
        let data=this.selectData.apps.find(item=>item.appId==e)
        if(data){
          this.caseDetailFoemData[st][index].address=data.applicantAddress
        }
      },
      handledeleElementglgs(st,index){
        this.caseDetailFoemData[st].splice(index,1);
      },
      tranappselectChange (applicantName) {
        var e = {}

        this.selectData.apps.forEach(ite => {
          if (ite.applicantName == applicantName) {
            e = ite
            return
          }
        })

        this.caseDetailFoemData.transferorEnName = e.applicantEnName
        this.caseDetailFoemData.transferorCnName = e.applicantName
        this.caseDetailFoemData.transferorType = e.appType
        this.caseDetailFoemData.transferorNationality = e.sendType
        this.caseDetailFoemData.transferorCnAdress = e.applicantAddress
        this.caseDetailFoemData.transferorEnAdress = e.applicantEnAddress
        this.caseDetailFoemData.transferorCountryAndregion = e.country
        this.caseDetailFoemData.zrCertCode = e.certCode
      },
      wfAgentChange (id) {
        if (id) {
          queryCustomerUrl({ customerID: id }).then(res => {
            this.selectData.customerContactswf = res.data.customerContacts
            this.selectData.customerAddrs = res.data.customerAddrs
            this.caseDetailFoemData.agencyCustAddrId = ''
            this.caseDetailFoemData.agencyCustContactId = ''
          })
        }
      },
      contactSelectChange (item) {
        var e = {}
        this.selectData.queryAppContact.forEach(ite => {
          if (ite.nameCn == item) {
            e = ite
            return
          }
        })
        this.caseDetailFoemData.appContactZip = e.post
        this.caseDetailFoemData.appContactTel = e.telphone
        this.caseDetailFoemData.appContactEmail = e.email
      },
      initfilelist () {
        this.caseDetailFoemData.materials.forEach(ite => {
          this.fileName[ite.materialTypeId] = ite.materialName
          if (ite.materialTypeId == '1000') {
            this.wtsfileList.push(ite)
          }
          if (ite.materialTypeId == '1022') {
            this.wtsfileListzr.push(ite)
          }
        })
      },
      goNext() {
        this.$route.query.copy = 'false'
        // console.log(this.prePage,888);
        // if (this.prePage === '案件管理') {
        //   this.$router.push('/workbench/case/case_management?myCase=2')
        // }
        //
        // if (this.prePage === '立卷') {
        //   this.$router.replace('/workbench/case/case_management?myCase=3')
        // }
        // if (this.prePage === '批量立卷') {
        //   this.$router.go(-1)
        // }

        this.$router.go(-1)
        // if (this.prePage === "案件管理") {
        //   this.$router.push("/workbench/case/protectList?myCase=2");
        // } else if (this.prePage === "立卷") {
        //   this.$router.replace("/workbench/case/protectList?myCase=3");
        // } else if (this.prePage === "批量立卷") {
        //   this.$router.go(-1);
        // } else {
        //   this.$router.go(-1);
        // }
      },
      async creatCaseForm (checkCase = 1, checkChongTu = 1) {
        if (this.$route.query.taskType == 3 && (this.caseDetailFoemData.lawsuitCasetypeArray.find(item => ![128, 141, 144, 300040, 300044, 300045].includes(item))) && this.caseDetailFoemData.lawsuitConflicterList.filter(item => item.conFullname).length < 1) {
          this.$message.error('请添加侵权人！')
          return;
        }
        if ((this.$route.query.taskType == 3 || this.$route.query.taskType == 7) && !(this.caseDetailFoemData.lawsuitApplicantArray && this.caseDetailFoemData.lawsuitApplicantArray.length)) {
          this.$message.error('请增加申请人！')
          return
        } else if (this.$route.query.taskType == 5 && !this.caseDetailFoemData.appId) {
          this.$message.error('请增加申请人！')
          return
        } else if(this.$route.query.taskType == 6 && !this.caseDetailFoemData.appCnName) {
          this.$message.error('请增加申请人！')
          return
        }
        if(!this.caseDetailFoemData.caseCustRespUserArray ||
          !this.caseDetailFoemData.caseCustRespUserArray.length){
          this.$message.error('请选择客户负责人')
          return false
        }
        const applist = [...this.selectData.apps, ...this.queryAllData]
        if (this.$route.query.taskType == 6 && this.caseDetailFoemData.appCnName && !applist.find(i => String(i.applicantName).toLowerCase() === String(this.caseDetailFoemData.appCnName).toLowerCase())) {
          await this.$confirm('建立新申请人需要提交客户管理组刘佳审核，审核通过后方可继续立卷', '提示', {
            confirmButtonText: '提交审核',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.caseDetailFoemData.appSub = 1
            this.caseDetailFoemData.appId = '0000'
            this.submitCaseForm(undefined, 0)
          }).catch(() => {
            this.caseDetailFoemData.appSub = 0
            this.caseDetailFoemData.appId = '0000'
            // this.caseDetailFoemData.appCnName = '0000'
          })
          return
        }
        if (this.$route.query.taskType == 3 || this.$route.query.taskType == 7) {
          if (this.caseDetailFoemData.lawsuitApplicantArray && this.caseDetailFoemData.lawsuitApplicantArray.length) {
            const res = await queryCaseAppExamine({appIds: this.caseDetailFoemData.lawsuitApplicantArray, caseIds: [this.caseDetailFoemData.caseId]})
            if (res.messageType == 300) {
              this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
              return;
            }
          }
        } else if (this.$route.query.taskType==5 || this.$route.query.taskType==6) {
          if (this.caseDetailFoemData.appId && this.caseDetailFoemData.appId != '0000') {
            const res = await queryCaseAppExamine({appIds: [this.caseDetailFoemData.appId], caseIds: [this.caseDetailFoemData.caseId]})
            if (res.messageType == 300) {
              this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
              return;
            }
          }
        }
        if (this.$route.query.taskType == 3 && (this.caseDetailFoemData.lawsuitCasetypeArray.find(item => ![128, 141, 144, 300040, 300044, 300045].includes(item))) && this.caseDetailFoemData.lawsuitConflicterList.filter(item => item.conFullname).length < 1) {
          this.$message.error('请添加侵权人！')
          return;
        }
        if(!this.$commonUtils.checkBA(this.caseRoleSelectList)){
          this.$message.error('承办律师或客户律师有误！')
          return
        }
        if(!this.caseRoleSelectList.includes('承办律师一')){
          this.$message.error('请选择承办律师一')
          return
        }
        if(!this.caseRoleSelectList.includes('客户律师一')){
          this.$message.error('请选择客户律师一')
          return
        }
        this.$route.query.copy = 'false'

        // this.caseDetailFoemData.caseIds = this.caseDetailFoemData.caseId;
        delete this.caseDetailFoemData.materials
        delete this.caseDetailFoemData.caseEvolve
        delete this.caseDetailFoemData.tmList
        delete this.caseDetailFoemData.trademarkCaseMadrids;
        delete this.caseDetailFoemData.lawsuitAgencyPartyList;
        delete this.caseDetailFoemData.lawsuitCaseCcList;
        // delete this.caseDetailFoemData.joinApps;
        // delete this.caseDetailFoemData.trademarkCaseCustWorkgroups;
        // delete this.caseDetailFoemData.trademarkCaseLCWorkgroups;
        // delete this.caseDetailFoemData.trademarkCaseCBWorkgroups;
        // delete this.caseDetailFoemData.trademarkCaseMadrids;
        // delete this.caseDetailFoemData.trademarkCaseBasicinfos;
        // delete this.caseDetailFoemData.trademarkCaseCustContacts;
        // delete this.caseDetailFoemData.memberNamelists;

        this.caseDetailFoemData.caseIds = this.mainCaseIds
        if (
          this.$route.query.import == '1' &&
          this.tmlist.includes(this.ch_caseTypr)
        ) {
          delete this.caseDetailFoemData.imageFile
          const sessionObj = JSON.parse(
            sessionStorage.getItem('changeOfNameOrAddressObj')
          )
          var data2 = {
            regNumberList: sessionObj.multipleSelection.map(
              item => item.regNumber
            ),

            taskId: this.caseDetailFoemData.taskId
          }

          data2.isBatch = '1'
        }
        if (
          this.$route.query.import != '1' &&
          this.tmlist.includes(this.ch_caseTypr)
        ) {
          var data2 = {
            regNumberList: this.caseDetailFoemData.regNumber,
            taskId: this.caseDetailFoemData.taskId
          }


          data2.isBatch = '0'
        }

        var data = Object.assign(
          {
            taskId: this.caseDetailFoemData.taskId,
            caseId: this.caseDetailFoemData.caseId,
            userId: this.userId
          },
          this.getChangedata()
        )

        data.checkCase = checkCase
        data.checkChongTu = checkChongTu
        data.taskType = this.$route.query.taskType
        this.postFormFlag=false
        await this.$nextTick()
        this.postFormFlag=true
        await this.$nextTick()
        this.$refs['postForm'].validate(async valid => {
          if (valid) {
            if (await this.chongtuTestFunc()) return ;
            delete data.checkChongTu
            handoverCase(data)
              .then(res => {
                if (res.success) {
                  console.log(res.messageType == '-6', '***')
                  if (res.messageType == '-6') {
                    this.$confirm(res.message + ' 请确认是否继续立卷?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      this.creatCaseForm(0, 1)
                    })
                  } else if (res.messageType == '10') {
                    this.checkChongTuSet(res.data, '', '')
                    console.log('{2}')
                  } else {
                    if (res.messageType ==12) {
                      this.$confirm(res.message ,
                        "提示",
                        {
                          confirmButtonText: "确定",
                          cancelButtonText: "取消",
                          type: "warning"
                        }
                      ).then(() => {
                        this.goNext();
                      });
                      return;
                    }
                    // if (res.messageType ==13) {
                    //   this.caseData=res.data
                    //   this.poppingTimeLimitState=true
                    //   return;
                    // }
                    this.addConflicter()
                    this.goNext()
                  }
                }
              })
              .catch(err => { })
          } else {
            this.$message.error('请填写必填项')
            return false
          }
        })
      },
      multiCatchange(e) {
        if( this.caseDetailFoemData.tcaseType===1){
          let currentList=e.map(item=>item[item.length-1])
          let lastNodeList=this.$commonUtils.getMenuName(this.$store.state.caseInformation.caseTypeList.filter(item=>item.caseTypeId==1)).filter(item=>!item.childrens)
          this.caseDetailFoemData.lawsuitCasetypeArray = currentList.filter(item=>lastNodeList.find(i=>i.caseTypeId==item))
          if(this.caseDetailFoemData.lawsuitCasetypeArray.length){
            this.caseDetailFoemData.caseTypeId = this.caseDetailFoemData.lawsuitCasetypeArray[0]
            // this.ifNewLevelFunc()
          }
        }else {
          if(e.length){
            this.caseDetailFoemData.caseTypeId=e[e.length-1]
          }
        }

        // this.protectcaseTypeIdList=this.caseDetailFoemData.caseTypeIdList
      },
      closePoppingTimeLimit(){
        this.poppingTimeLimitState=false
        if(this.prefiling){
          this.$router.push({
            path: '/workbench/case/preFilingPush/1',
            query: { taskId: this.caseDetailFoemData.taskId,taskType:this.$route.query.taskType}
          })
          return
        }
        this.goNext()
      },
      addMDL() {
        this.caseDetailFoemData.trademarkCaseBasicinfos.push({
          regNumber: '',
          regDate: ''
        })
      },
      tkInspect (command) {
        if (command == '1') {
          if (this.caseDetailFoemData.tmName) {
            checkForbidContentUrl({
              tmName: this.caseDetailFoemData.tmName
            }).then(res => {
              this.tkInspectText = res.data
              this.tkInspectType = res.data.result
            })
          } else {
            this.$message.error('请填写商标名称')
          }
        } else {
          if (this.caseDetailFoemData.tmName) {
            this.dialogFormTmCm = true
          } else {
            this.$message.error('请填写商标名称')
          }
        }
      },

      deljoinBtn () {
        delJoinAppUrl({ joinAppId: this.joinFormData.joinAppId })
        this.dialogFormjoin = 0
      },
      joinCreatdialog () {
        cradeJoinAppUrl({ caseIds: this.mainCaseIds }).then(res => {
          this.joinFormData = res.data
        })
      },
      trancaseCochange (val) {
        queryCountryCaseUrl({ country: val })
          .then(response => {
            if (response.data && response.data.length > 0) {
              this.caseDetailFoemData.transferorCountryAndregion =
                response.data[0].countryCn
            } else {
              this.caseDetailFoemData.transferorCountryAndregion = ''
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      caseCochange (val) {
        queryCountryCaseUrl({ country: val })
          .then(response => {
            if (response.data && response.data.length > 0) {
              this.caseDetailFoemData.appCountryOrRegion =
                response.data[0].countryCn
            } else {
              this.caseDetailFoemData.appCountryOrRegion = ''
            }
          })
          .catch(err => {
            console.log(err)
          })
      },

      jointypeChange (val) {
        if (val == '2') {
          this.joinFormData.typeStr = '转让人'
        } else if (val == '3') {
          this.joinFormData.typeStr = '受让人'
        }
      },
      sxdwdisabled(typeName){
        // let sjList = [{label:'无',value:1368},{label:'一审',value:1071},{label:'二审',value:1072},{label:'再审',value:1073},{label:'重申',value:1074},{label:'执行',value:1075}]
        if(this.caseDetailFoemData.judgeRank==1071){
          if(typeName == '原告' || typeName == '第三人') {
            return false
          } else {
            return true
          }
        }
        if(this.caseDetailFoemData.judgeRank==1072){
          if(typeName.includes('上诉人') ) {
            return false
          } else {
            return true
          }
        }
        if(this.caseDetailFoemData.judgeRank==1073){
          if(typeName == '申请人' || typeName == '被申请人') {
            return false
          } else {
            return true
          }
        }
        // this.selectDataByClass['1027']
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;
    padding: 10px 2px;
    border: 1px solid #d7d7d7;
    margin: 15px 20px;
    min-height: 800px;

    .step-div {
      padding: 20px 65px;
    }

    /deep/ .el-tabs__header {
      margin-bottom: 2px;
    }

    /deep/ .el-collapse-item__header {
      display: block;
      text-align: center;
      background: #f5f5f5;
      height: 35px;
      line-height: 35px;
    }

    /deep/ .el-collapse-item__content {
      padding: 0px;
    }

    .fg-div {
      height: 20px;
      background: #e4e4e4;
    }

    .tilteSpan {
      font-size: 18px;
      padding: 15px 0px;
      color: #7199d5;

      span {
        display: block;
      }
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
      height: 35px;
      line-height: 35px;
      // padding: 0px;
    }

    /deep/ td {
      background-color: #ffffff !important;
    }

    /deep/ .el-input__inner,
    /deep/ .el-select {
      width: 100% !important;
    }
  }

  /deep/ .form-border {
    .el-form-item__error {
      position: relative !important;
      top:0
    }

    .el-row {
      display: flex;
      margin: 0px;
    }

    .postInfo-container-item {
      width: 100%;
    }

    .el-form-item__label {
      background-color: #f9f9f9;
      /*width: 36.7%;*/
      text-align: right;
    }

    .el-form-item {
      height: 100%;
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    .el-row {
      border-bottom: 1px solid #d7d7d7;
    }

    .el-input,
    .el-select {
      width: 100%;
    }

    .el-form-item__content {
      text-align: left;
      // height: 30px;
      position: relative;
      .textarea_wrap{
        display: flex;
        .button_wrap{
          margin-left: 10px;
        }
      }
    }

    .fullRow {
      .el-form-item__label {
        /*width: 15%;*/
      }

      .el-input,
      .el-select {
        width: 30%;
      }
    }
    .inline-input {
      .el-input,
      .el-select {
        width: 100%;
      }
    }
    /deep/.cell{
      .el-input,
      .el-select {
        width: 100%!important;
      }
    }

    .el-input__inner {
      // border: none;
    }

    .el-select .el-input {
      width: 100%;
    }

    .postInfo-container-item {

      /*width: 100%;*/
      height: 100%;
      .el-form-item__content {

        height: 100%;
        /*display: flex;*/
        line-height: 2;
        padding: 5px 15px;
        /*flex-direction:column ;*/
        /*align-items: center;*/
        /*text-align: left;*/
        /*display: inline-table;*/
        /*width: 70%;*/
        /*min-width: 70%;*/
        /*padding: 5px 10px;*/
      }

      .el-form-item__label {
        height: 100%;
        line-height: 35px;
        border-right: 1px solid #d7d7d7;
      }
    }

    border-top: 1px solid #d7d7d7;
    border-left: 1px solid #d7d7d7;
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
  .uploadsqr {
    /deep/ .el-upload {
      width: 100%;
    }
    /deep/ .el-upload-dragger {
      height: 20px;
      width: 100%;
    }
    /deep/ .el-upload-list {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      &:first-child {
        margin-top: 0;
      }
    }
  }
  .uploadsqr {
    /deep/ .el-upload-list__item {
      transition: all 0s;
      transform: translateY(0);
    }
    /deep/ .el-upload-list__item:first-child {
      margin-top: 0;
    }
    /deep/ .el-list-enter,
    .el-list-leave-active {
      visibility: hidden;
      opacity: 1;
      transition: all 0s;
      transform: translateY(0);
    }
    /deep/ .el-list-enter-active,
    .el-list-leave-active {
      display: none;
      transition: all 0s;
    }
  }
  .el-cascader{
    width: 100%;
    /deep/ .el-input{
      width: 100%;
    }
  }
</style>
