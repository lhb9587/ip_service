<template>
  <div>
    <BreadCrumbCase v-if="caseDetailFoemData.caseId" :caseDetailFoemData="caseDetailFoemData"></BreadCrumbCase>
    <el-row>
      <el-col class="createPost-container" :span="20">
        <el-tabs v-model="activeName" @tab-click="handleClickTab">
          <el-tab-pane label="案件详情" name="first">
            <el-form ref="postForm" label-width="180px" :model="caseDetailFoemData" :rules="rules" size="small"
                     class="form-container" v-if="caseDetailFoemData.usAgency">
              <div class="createPost-main-container">
                <div class="form-con">
                  <el-row class="form-border">
                    <el-col :span="24">
                      <el-row class="fullRow">
                        <el-col :span="24">
                          <el-form-item label="案件类型:" class="postInfo-container-item">
                            <template>
                              <span>{{caseDetailFoemData.caseType}}</span>
                            </template>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col class="tilteSpan" :span="24">
                      <span id='ajxq-title'>案件详情</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col class="form-con-item" :span="24">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item label="案件名称:" class="postInfo-container-item">
                                <el-input v-model="caseDetailFoemData.tmName"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="案件文号:" class="postInfo-container-item">
                                <template>
                                  <el-input :disabled="true" v-model="caseDetailFoemData.agentNum"></el-input>
                                  <el-button type="primary" size="mini" style="margin-left: 10px;"
                                             @click="transferCase">转案
                                  </el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-form-item label="案件备注:" class="postInfo-container-item">
                                <el-input v-model="caseDetailFoemData.remarks"></el-input>
                              </el-form-item>
                          </el-row>
                          <template v-if="['内-外', '外-外'].includes(caseDetailFoemData.appFromto)">
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="合作所评分:" class="postInfo-container-item">
                                  <el-rate show-text v-model="caseDetailFoemData.score"></el-rate>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="合作所评价:" class="postInfo-container-item">
                                  <template>
                                    <el-input type="textarea" :rows="3" v-model="caseDetailFoemData.evaluate"
                                              placeholder="请输入"></el-input>

                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col class="tilteSpan" :span="24">
                      <span id='khxx-title'>客户信息</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col class="form-con-item" :span="24">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="客户名称:" class="postInfo-container-item">
                                <!--                                <template>-->
                                <!--                                  <el-input :disabled="true" v-model="caseDetailFoemData.custName">-->
                                <!--                                  </el-input>-->
                                <!--                                </template>-->
                                <el-select
                                  v-model="caseDetailFoemData.custId"
                                  ref="custSelect"
                                  :disabled="!($store.getters.permissions.includes(242))"
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
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="客户文号:" class="postInfo-container-item">
                                <template>
                                  <el-input v-model="caseDetailFoemData.custRefno">
                                  </el-input>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item label="客户联系人:" class="postInfo-container-item">
                                <template>

                                  <el-select @change='contactchange' default-first-option :clearable='true'
                                             placeholder="请选择" v-model="caseDetailFoemData.custContactId" filterable>
                                    <el-option v-for="(item,key)  in selectData.customerContacts" :key="key"
                                               :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId">
                                    </el-option>
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="抄送人:" class="postInfo-container-item">
                                <template>
                                  <el-select default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.trademarkCaseCustContacts" multiple filterable>
                                    <el-option v-for="(item,key)  in selectData.customerContacts" :key="key"
                                               :label="item.name" :value="item.custContactId">
                                    </el-option>
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="信函地址:" class="postInfo-container-item">
                                <template>
                                  <el-select default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.letterAddrId" filterable>
                                    <el-option v-for="(item,key)  in selectData.customerMailAdds" :key="key"
                                               :label="(item.addressCn||'')+(item.addressEn||'')" :value="item.addrId">
                                    </el-option>
                                  </el-select>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="账单联系人:" class="postInfo-container-item">
                                <template>
                                  <el-select default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.billCustContactId" filterable>
                                    <el-option v-for="(item,key)  in selectData.billContacts" :key="key"
                                               :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId">
                                    </el-option>
                                  </el-select>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="折扣率:" class="postInfo-container-item">
                                <template>

                                  <el-input type="number" min="1" max="100" v-model="caseDetailFoemData.discount"/>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="账单地址:" class="postInfo-container-item">
                                <template>
                                  <el-select default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.billAddrId" filterable>
                                    <el-option v-for="(item,key)  in selectData.billAdds" :key="key"
                                               :label="(item.addressCn||'')+(item.addressEn||'')" :value="item.addrId">
                                    </el-option>
                                  </el-select>

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
            <el-form ref="postForm" label-width="180px" :model="caseDetailFoemData" :rules="rules" size="small"
                     class="form-container" v-if="postFormFlag && !caseDetailFoemData.usAgency">
              <div class="createPost-main-container">
                <div class="form-con">
                  <el-row class="form-border">
                    <el-col :span="24">
                      <el-row class="fullRow">
                        <el-col :span="24">
                          <el-form-item label="案件类型:" class="postInfo-container-item">
                            <template>
                              <span>{{caseDetailFoemData.caseType}}</span>
                            </template>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col class="tilteSpan" :span="24">
                      <span id='ajxq-title'>案件详情</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col class="form-con-item" :span="24">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="申请方向:" prop="appFromto" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.appFromto" @change="changeAppFromto">
                                    <el-radio label='外-内'></el-radio>
                                    <el-radio label='内-内'></el-radio>
                                    <el-radio label='内-外'></el-radio>
                                    <el-radio label='外-外'></el-radio>
                                    <el-radio label='台-内'></el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="所属项目:">
                                <CustomerTree
                                  v-model="caseDetailFoemData.project"
                                  class="project-tree-wrap"
                                  :data="projectTreeData"
                                  :allow-input="false"
                                  :allow-create="true"
                                  :manageable="true"
                                  :show-path="false"
                                  :default-expand-all="true"
                                  empty-text="暂无项目数据"
                                  search-placeholder="请输入项目名称搜索"
                                  tip=""
                                />
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="合同编号:">
                                <el-input v-model="caseDetailFoemData.contractNumber" />
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item label="案件文号:" class="postInfo-container-item">
                                <template>
                                  <el-input :disabled="true" v-model="caseDetailFoemData.agentNum"></el-input>
                                  <el-button type="primary" size="mini" style="margin-left: 10px;"
                                             @click="transferCase">转案
                                  </el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="机密案件:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.ifSec" @change="changeIfSec">
                                    <el-radio :label='1'>是</el-radio>
                                    <el-radio :label='0'>否</el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>

                          </el-row>

                          <el-row class="">
                            <el-col :span="12">
<!--                              <el-form-item label="申请方式:" class="postInfo-container-item"-->
<!--                                            v-if="caseDetailFoemData.caseType==='更正商标申请事项'">-->
<!--                                <template>-->
<!--                                  <el-radio-group v-model="caseDetailFoemData.submitType" @change="billDiscount">-->
<!--                                    <el-radio label='网上申请'-->
<!--                                              v-show="caseDetailFoemData.isResend==='否'||caseDetailFoemData.isResend===null"></el-radio>-->
<!--                                    <el-radio label='线下申请'></el-radio>-->
<!--                                  </el-radio-group>-->
<!--                                </template>-->
<!--                              </el-form-item>-->
                              <el-form-item label="申请方式:" class="postInfo-container-item" prop="submitType">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.submitType" @change="billDiscount">
                                    <el-radio label='网上申请'
                                              v-show="caseDetailFoemData.caseType != '马德里商标转国内注册'"></el-radio>
                                    <el-radio label='线下申请'></el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="代理机构:" class="postInfo-container-item">
                                <template>
                                  <el-select default-first-option :clearable='true' @change="changeAgency"
                                             placeholder="请选择" v-model="caseDetailFoemData.whdAgencyName" filterable>
                                    <el-option label="云分万慧达" value="云分万慧达" disabled></el-option>
                                    <el-option label="津分万慧达" value="津分万慧达"></el-option>
                                    <el-option label="北京万慧达律所" value="北京万慧达律所"></el-option>
                                    <el-option label="上海万慧达律所" value="上海万慧达律所"></el-option>
                                    <el-option label="北京万慧达" value="北京万慧达"></el-option>
                                    <el-option label="汉智嘉成" value="汉智嘉成" disabled/>
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <template v-if="caseDetailFoemData.caseType==='变更注册申请代理机构'">
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="是否填写变更后代理机构名称:" class="postInfo-container-item" prop="isPreChangeAgencyName">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.isPreChangeAgencyName" :disabled=true>
                                      <el-radio :label='1'>是</el-radio>
                                      <el-radio :label='0'>否</el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="变更后代理机构名称:" class="postInfo-container-item"
                                              v-if="caseDetailFoemData.isPreChangeAgencyName=='1'">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.preChangeAgencyName" :disabled=true>
                                    </el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <!-- <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="变更后文件接收人名称:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.acceptPerson">
                                    </el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="变更后文件接收人地址:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.acceptPersonAddr">
                                    </el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row> -->
                          </template>
                          <template v-if="caseDetailFoemData.caseType==='更正商标申请事项'">
<!--                            <el-row class="fullRow">-->
<!--                              <el-col :span="24">-->
<!--                                <el-form-item label="是否需重新制发证书文件:" class="postInfo-container-item">-->
<!--                                  <template>-->
<!--                                    <el-radio-group v-model="caseDetailFoemData.isResend">-->
<!--                                      <el-radio label='是'>是</el-radio>-->
<!--                                      <el-radio label='否'>否</el-radio>-->
<!--                                    </el-radio-group>-->
<!--                                  </template>-->
<!--                                </el-form-item>-->
<!--                              </el-col>-->
<!--                            </el-row>-->
                            <el-row class="fullRow" v-if="caseDetailFoemData.submitType=='线下申请'">
                              <el-col :span="24">
                                <el-form-item label="更正事项:" class="postInfo-container-item">
                                  <template>
                                    <el-input type="textarea" :rows="3" v-model="caseDetailFoemData.correction"
                                              placeholder="请输入"></el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="更正前信息:" class="postInfo-container-item">
                                  <template>
                                    <el-input type="textarea" :rows="3" v-model="caseDetailFoemData.beforeChangeMessage"
                                              placeholder="请输入"></el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="更正后信息:" class="postInfo-container-item">
                                  <template>
                                    <el-input type="textarea" :rows="3" v-model="caseDetailFoemData.afterChangeMessage"
                                              placeholder="请输入"></el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="案件等级:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.caseLevel">
                                    <el-radio :label='1'>普通</el-radio>
                                    <el-radio :label='2'>重要</el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="他所代交:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.otherAgency">
                                    <el-radio label='0'>否</el-radio>
                                    <el-radio label='1'>是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.otherAgency=='1'">
                            <el-col :span="24">
                              <el-form-item label="代交所名称:" class="postInfo-container-item">
                                <template>
                                  <el-select default-first-option :clearable='true' placeholder="仅可使用下拉单中可选的第三方机构"
                                             @change="changeReplaceAgency"
                                             v-model="caseDetailFoemData.replaceAgencyName" filterable>
                                    <el-option v-for="(item, index) in otherAgencyList" :label="item.value" :value="item.value"></el-option>
<!--                                    <el-option label="北京英特普罗知识产权代理有限公司" value="北京英特普罗知识产权代理有限公司"></el-option>-->
<!--                                    <el-option label="北京思想力知识产权代理有限公司" value="北京思想力知识产权代理有限公司"></el-option>-->
<!--                                    <el-option label="广东源慧知识产权代理有限公司" value="广东源慧知识产权代理有限公司"></el-option>-->
<!--                                    <el-option label="北京安度凯特来知识产权代理有限公司" value="北京安度凯特来知识产权代理有限公司"></el-option>-->
<!--                                    <el-option label="北京腾中知识产权代理有限公司" value="北京腾中知识产权代理有限公司"></el-option>-->
<!--                                    <el-option label="北京英诺万知识产权代理有限公司" value="北京英诺万知识产权代理有限公司"></el-option>-->
<!--                                    <el-option label="北京为上知识产权代理有限公司" value="北京为上知识产权代理有限公司"></el-option>-->
<!--                                    <el-option label="北京观度知识产权代理有限公司" value="北京观度知识产权代理有限公司"></el-option>-->
<!--                                    <el-option label="昆明裘诺知识产权事务所有限公司" value="昆明裘诺知识产权事务所有限公司"/>-->
<!--                                    <el-option label="成都中炬新汇知识产权代理有限公司" value="成都中炬新汇知识产权代理有限公司"/>-->
<!--                                    <el-option label="温州市智信商标事务所有限公司" value="温州市智信商标事务所有限公司"/>-->
<!--                                    <el-option label="北京佰舟知识产权代理有限公司" value="北京佰舟知识产权代理有限公司"/>-->
<!--                                    <el-option label="北翔" value="北翔"></el-option>-->
<!--                                    <el-option label="申请人自交" value="申请人自交"></el-option>-->

                                  </el-select>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.caseType==='续展'&&$route.query.import!=1">
                            <el-col :span="24">
                              <el-form-item label="延迟续展:" class="postInfo-container-item">
                                <el-radio-group v-model="caseDetailFoemData.delayRenewal">
                                  <el-radio label='0'>否</el-radio>
                                  <el-radio label='1'>是</el-radio>
                                </el-radio-group>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="申请书标注:" class="postInfo-container-item">
                                <template>
                                  <el-input v-model="caseDetailFoemData.applicationMarks">
                                  </el-input>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="caseDetailFoemData.caseType === '提供使用声明/证据（境外）'">
                            <el-col :span="12">
                              <el-form-item label="使用声明/证据类型:" class="postInfo-container-item" prop="evidenceType">
<!--                                evidenceType -->
                                <el-select default-first-option :clearable='true' placeholder="请选择"
                                           v-model="caseDetailFoemData.evidenceType" filterable>
                                  <el-option :label="item.typeName" :key="item.id" :value="item.id"
                                             v-for="item in evidenceTypeList"></el-option>
                                </el-select>

                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="是否提交使用声明/证据:" class="postInfo-container-item">
                                <el-radio-group v-model="caseDetailFoemData.ifEvidence">
                                  <el-radio :label='1'>是</el-radio>
                                  <el-radio :label='0'>否</el-radio>
                                </el-radio-group>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.caseType === '提供使用声明/证据（境外）'">
                            <el-col :span="24">
                              <el-form-item label="使用声明/证据说明:" class="postInfo-container-item" prop="statementOfEvidence">
                                <template>
                                  <el-input type="textarea" :rows="3" v-model="caseDetailFoemData.statementOfEvidence"
                                            placeholder="请输入"></el-input>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="案件备注:" class="postInfo-container-item">
                                <template>
                                  <el-input type="textarea" :rows="3" v-model="caseDetailFoemData.remarks"
                                            placeholder="请输入"></el-input>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <template v-if="['内-外', '外-外'].includes(caseDetailFoemData.appFromto)">
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="合作所评分:" class="postInfo-container-item">
                                  <el-rate show-text v-model="caseDetailFoemData.score"></el-rate>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="合作所评价:" class="postInfo-container-item">
                                  <template>
                                    <el-input type="textarea" :rows="3" v-model="caseDetailFoemData.evaluate"
                                              placeholder="请输入"></el-input>

                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                          <template v-if="caseDetailFoemData.caseType==='投标'">
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="投标事项:" class="postInfo-container-item">
                                  <el-input v-model="caseDetailFoemData.tmName">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="投标报名费:" class="postInfo-container-item">
                                  <el-input type="number" v-model="caseDetailFoemData.bidEntryFee">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="招标方单位:" class="postInfo-container-item">
                                  <el-input v-model="caseDetailFoemData.transferorCnName">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="招标方联系人:" class="postInfo-container-item">
                                  <el-input v-model="caseDetailFoemData.transferorEnName">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="招标方联系电话:" class="postInfo-container-item">
                                  <el-input v-model="caseDetailFoemData.licenseeTel">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="招标号:" class="postInfo-container-item">
                                  <el-input v-model="caseDetailFoemData.quoteRegNumber">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="招标金额:" class="postInfo-container-item">
                                  <el-input type="number" v-model="caseDetailFoemData.tenderMoney">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="投标金额:" class="postInfo-container-item">
                                  <el-input type="number" v-model="caseDetailFoemData.bidMoney">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="保证金额:" class="postInfo-container-item">
                                  <el-input type="number" v-model="caseDetailFoemData.ensureMoney">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="开标日期:" class="postInfo-container-item">
                                  <el-date-picker
                                    v-model="caseDetailFoemData.limitDate"
                                    type="date"
                                    placeholder="选择日期"
                                    value-format="yyyy-MM-dd">
                                  </el-date-picker>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="是否联合投标:" class="postInfo-container-item">
                                  <el-radio-group v-model="caseDetailFoemData.delay">
                                    <el-radio :label='false'>否</el-radio>
                                    <el-radio :label='true'>是</el-radio>
                                  </el-radio-group>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" v-if="caseDetailFoemData.delay">
                                <el-form-item label="联合方名称:" class="postInfo-container-item">
                                  <el-input v-model="caseDetailFoemData.respondentAgency">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item label="开标地点:" class="postInfo-container-item">
                                  <el-input v-model="caseDetailFoemData.transferorCnAdress">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="投标结果:" class="postInfo-container-item">
                                  <el-input v-model="caseDetailFoemData.quoteTm">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                          <change-of-name-and-address ref="changeOfNameAndAddress"
                                                      :caseDetailFoemData="caseDetailFoemData"
                                                      v-if="caseDetailFoemData.caseType==='变名变址'&&$route.query.import==1"
                                                      :custId="caseDetailFoemData.custId" :fileUrl="fileUrl"
                                                      :fileName="fileName" :mainCaseIds="mainCaseIds"
                                                      @getAppInfo="getAppInfo" @getAppAddress="getAppAddress"
                                                      @getChildrenData="(obj)=>getfileData(obj.materialTypeId, obj.e)">
                          </change-of-name-and-address>
                        </el-col>

                      </el-row>
                    </el-col>

                  </el-row>
                  <template v-if="caseDetailFoemData.caseType&&trademarkList.includes(caseDetailFoemData.caseType)">
                    <el-row>
                      <el-col class="tilteSpan" :span="24">
                        <span id='sqrxx-title'>{{caseDetailFoemData.caseType=='投标'?'投标人':'申请人'}}信息</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col class="form-con-item" :span="24">
                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="申请人中文名称:" prop="appCnName" class="postInfo-container-item">
                                  <template>
                                    <el-autocomplete class="inline-input" :clearable='true' @select="handleAppCnName"
                                                     v-model="caseDetailFoemData.appCnName"
                                                     :fetch-suggestions="remotepinput" placeholder="请输入内容"
                                                     :clear="clearTmMessage" :trigger-on-focus="true">
                                    </el-autocomplete>

                                  </template>
                                </el-form-item>
                              </el-col>
                              <template v-if="caseTypeAndAppFromto">
                                <el-col :span="12">
                                  <el-form-item label="主体法律性质:" prop="legalNature"
                                                :rules="{ required: true, message: '请选择主体法律性质', trigger: 'change' }"
                                                class="postInfo-container-item">
                                    <template>
                                      <el-select default-first-option :clearable='true' placeholder="请选择"
                                                 v-model="caseDetailFoemData.legalNature" filterable @change="changeLegalNature">
                                        <el-option :label="item.typeName" :key="item.typeName" :value="item.typeName"
                                                   v-for="item in applicantTypeList"></el-option>
                                      </el-select>

                                    </template>
                                  </el-form-item>
                                </el-col>
                              </template>
                              <template v-else>
                                <el-col :span="12">
                                  <el-form-item label="主体法律性质:" class="postInfo-container-item">
                                    <template>
                                      <el-select default-first-option :clearable='true' placeholder="请选择"
                                                 v-model="caseDetailFoemData.legalNature" filterable @change="changeLegalNature">
                                        <el-option :label="item.typeName" :key="item.typeName" :value="item.typeName"
                                                   v-for="item in applicantTypeList"></el-option>
                                      </el-select>
                                    </template>
                                  </el-form-item>
                                </el-col>
                              </template>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="申请人英文名称:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.appEnName">
                                    </el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="国籍:" prop="appGJdq" class="postInfo-container-item">
                                  <template>
                                    <el-select default-first-option @change="caseCochange" :clearable='true'
                                               placeholder="请选择" v-model="caseDetailFoemData.appGJdq" filterable>
                                      <el-option v-for="(item,key)  in selectData.country" :key="key"
                                                 :label="item.countryCn" :value="item.countryCn">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="caseDetailFoemData.appGJdq=='中国'">
                              <el-col :span="24" class="long-input">
<!--                              省、市、区-->
                                <el-form-item label="申请人地址" class="postInfo-container-item" prop="addressGroup">
                                  <template>
                                    <el-select
                                      v-model="address.province"
                                      placeholder="请选择省"
                                      style="width: 120px; margin-right: 10px"
                                      @change="handleProvinceChange"
                                      filterable
                                      clearable
                                    >
                                      <el-option
                                        v-for="item in provinceList"
                                        :key="item.regionCode"
                                        :label="item.abbrName"
                                        :value="item.regionCode"
                                      />
                                    </el-select>
                                    <el-select
                                      v-model="address.city"
                                      placeholder="请选择市"
                                      style="width: 120px; margin-right: 10px"
                                      @change="handleCityChange"
                                      filterable
                                      clearable
                                      :disabled="!address.province"
                                    >
                                      <el-option
                                        v-for="item in cityList"
                                        :key="item.regionCode"
                                        :label="item.abbrName"
                                        :value="item.regionCode"
                                      />
                                    </el-select>
                                    <el-select
                                      v-model="address.district"
                                      placeholder="请选择区"
                                      style="width: 120px"
                                      @change="handleDistrictChange"
                                      filterable
                                      clearable
                                      :disabled="!address.city"
                                    >
                                      <el-option
                                        v-for="item in districtList"
                                        :key="item.regionCode"
                                        :label="item.abbrName"
                                        :value="item.regionCode"
                                      />
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12" class="long-input">
                                <el-form-item label="申请人详细地址:"
                                              :prop="noNeedTosubmit.includes(caseDetailFoemData.caseType)?'':'appCnAddr'"
                                              class="postInfo-container-item">
                                  <template>
                                    <Autocomplete v-model="caseDetailFoemData.appCnAddr" @change="changeAppCnAddr" @select="appCnAddrChange"
                                                  type="addressCn"
                                                  :list="selectData.appaddr.filter(itm=>!!itm.addressCn)"></Autocomplete>
                                    <!--                                    <el-select :clearable="true" allow-create default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appCnAddr" @change="appCnAddrChange" ref="appCnAddr">-->
                                    <!--                                      <el-option :key="item.addrId" :label="item.addressCn" :value="item.addressCn" v-for="(item,key) in selectData.appaddr.filter(itm=>!!itm.addressCn)" />-->
                                    <!--                                    </el-select>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" v-show='caseDetailFoemData.appGJdq!="中国"'>
                                <el-form-item label="国家或地区:" class="postInfo-container-item">
                                  <template>

                                    <el-select default-first-option :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.appCountryOrRegion" filterable>
                                      <el-option v-for="(item,key)  in selectData.casecount" :key="key"
                                                 :label="item.countryCn" :value="item.countryCn">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12" class="long-input">
                                <el-form-item label="申请人英文地址:" class="postInfo-container-item">
                                  <template>
                                    <el-select :clearable="true" allow-create default-first-option filterable
                                               placeholder="请选择" v-model="caseDetailFoemData.appEnAddr">
                                      <el-option :key="key" :label="item.addressEn" :value="item.addressEn"
                                                 v-for="(item,key) in selectData.appaddr.filter(itm=>!!itm.addressEn)"/>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="身份证明文件名称:" :prop="appCertificateRequired?'appCertificate':''">
                                  <template v-if="caseDetailFoemData.legalNature!=='自然人'&&caseDetailFoemData.appGJdq!=='中国'">
                                    <el-input placeholder="" v-model="caseDetailFoemData.appCertificate" />
                                  </template>
                                  <template v-else>
                                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appCertificate">
                                      <el-option v-for="(item,index) in idTypeOptions" :key="index" :label="item.typeName" :value="item.typeName" />
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="(caseDetailFoemData.caseType === '答复临时驳回/审查意见（境外）' || caseDetailFoemData.caseType === '商标注册' || caseDetailFoemData.caseType === '提供使用声明/证据（境外）') && caseDetailFoemData.appFromto == '内-内'">
                              <el-col :span="24">
                                <el-form-item label="经营范围是否包括知识产权代理:" class="postInfo-container-item" prop="isIpAgent">
                                  <template>
<!--                                    <el-input v-model="caseDetailFoemData.isIpAgent"></el-input>-->
                                    <el-radio-group v-model="caseDetailFoemData.isIpAgent">
                                      <el-radio :label='1'>是</el-radio>
                                      <el-radio :label='0'>否</el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <template v-if="['答复临时驳回/审查意见（境外）', '提供使用声明/证据（境外）','不予注册复审','商标注册','分割申请','异议','变名变址','转让/移转','续展','删减商品项目','变更注册申请代理机构','更正商标申请事项','注册驳回复审','国际注册驳回复审','撤销商标复审','异议答辩','撤三答辩(提供使用证明)','撤销通用名称答辩','参与不予注册复审','无效宣告答辩','撤销复审答辩','撤销三年停止使用申请','撤销成为通用名称注册商标','无效宣告申请','撤回商标评审','行政复议','许可备案','补发商标注册证','补发商标变转续证明','出具优先权证明文件','出具商标注册证明','商标注销','撤回商标申请'].includes(caseDetailFoemData.caseType)">
                                  <el-form-item label="代理人姓名:" class="postInfo-container-item"
                                              v-if="(caseDetailFoemData.replaceAgencyName && caseDetailFoemData.replaceAgencyName !== '北京佰舟知识产权代理有限公司' && ['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(caseDetailFoemData.whdAgencyName) && ['内-内', '外-内'].includes(caseDetailFoemData.appFromto))">
                                  <el-select default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.agentPerson" filterable>
                                    <el-option v-for="(item,key)  in agentPersonList" :key="key"
                                               :label="item" :value="item">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                                  <el-form-item label="代理人姓名:" class="postInfo-container-item"
                                              v-else-if="caseDetailFoemData.replaceAgencyName == '北京佰舟知识产权代理有限公司'">
                                  <el-select default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.agentPerson" filterable>
                                    <el-option v-for="(item, key)  in ['王莹', '刘骞', '刘敏']" :key="key"
                                               :label="item" :value="item">
<!--                                      <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                                <el-form-item label="代理人姓名:" class="postInfo-container-item"
                                              v-else>
                                  <el-select allow-create default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.agentPerson" filterable>
                                    <el-option v-for="(item,key)  in $store.getters.userList" :key="key"
                                               :label="item.fullname" :value="item.fullname">
                                      <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                                </template>
                              </el-col>
                              <el-col :span="12" v-if="caseDetailFoemData.appGJdq == '中国'&&caseDetailFoemData.legalNature!='自然人'">
                                <el-form-item prop="certCode" class="postInfo-container-item" label="统一社会信用代码:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.certCode"/>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" v-else>
                                <el-form-item
                                  class="postInfo-container-item"
                                  label="身份证明文件号码:"
                                  :prop="caseDetailFoemData.legalNature!=='自然人'&&caseDetailFoemData.appGJdq!=='中国'?'':'appCertificateNum'"
                                >
                                  <el-input v-model="caseDetailFoemData.appCertificateNum" />
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="12">
                                <el-form-item label="委托书:" class="postInfo-container-item">
                                  <template>
                                    <el-button style="margin-left:10px;display: block" size="mini" type="primary"
                                               @click="getfileData('1000',$event)">上传
                                    </el-button>
                                    <el-upload class="upload-btn" :before-remove="brforeRemoveFile"
                                               :on-success='fileUploadSuccess' :file-list="wtsfileList"
                                               :show-file-list='true' :action="fileUrl" name='attachFile'
                                               :data="fileData('1000')">
                                    </el-upload>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" style="font-size: 12px;color: #333">
                               <div style="padding: 10px">
                                  <div style="display: flex"><span class="el-icon-s-opportunity" style="font-size: 20px;color: #FFDF64"></span><div>委托书上传前核查风险点：</div></div>
                                  <div style="margin-left: 15px">
                                    <div>1.委托书上的申请人名称、地址信息是否正确（如XX集团和XX股份公司的委托书容易交错）</div>
                                    <div>2.委托书上客户盖章信息和申请人信息是否一致</div>
                                    <div>3.委托书形式是否正确（商标申请案件和评审案件委托书格式不同）</div>
                                    <div>4.委托书上勾选的委托事项、商标名称、类别是否填写正确</div>
                                  </div>
                                </div>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="trademarkList.includes(caseDetailFoemData.caseType)">
                              <el-col :span="24" v-if="['中国香港','中国台湾','中国澳门'].includes(caseDetailFoemData.appGJdq)">
                                <el-form-item label="证明文件是否为中文:" prop="appCertFileIsCn" class="postInfo-container-item">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.appCertFileIsCn">
                                      <el-radio label='否'>否</el-radio>
                                      <el-radio label='是'>是</el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>

                              </el-col>
                              <el-col :span="24"
                                      v-show="!(['中国香港','中国台湾','中国澳门'].includes(caseDetailFoemData.appGJdq))">
                                <el-form-item label="证明文件是否为中文:" class="postInfo-container-item">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.appCertFileIsCn">
                                      <el-radio label='否'>否</el-radio>
                                      <el-radio label='是'>是</el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="!(trademarkList.includes(caseDetailFoemData.caseType))">
                              <el-col :span="24">
                                <el-form-item label="上传文件的语言类型:" class="postInfo-container-item">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.uploadFileLanguage">
                                      <el-radio label='中文'></el-radio>
                                      <el-radio label='外文'></el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row v-if="caseDetailFoemData.appGJdq == '中国'&&caseDetailFoemData.legalNature == '自然人'">
                              <el-col :span=12>
                                <el-form-item class="postInfo-container-item" label="主体资格证明文件类型:">
                                  <el-select
                                    :clearable="true"
                                    default-first-option
                                    filterable
                                    placeholder="请选择"
                                    v-model="caseDetailFoemData.subjectCertType"
                                  >
                                    <el-option v-for="( item ) in certTypeOptions" :key="item.id" :label="item.typeName" :value="item.typeName"/>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span=12 v-if="caseDetailFoemData.subjectCertType === '个体工商户营业执照'">
                                <el-form-item prop="certCode" class="postInfo-container-item" label="统一社会信用代码:">
                                  <el-input v-model="caseDetailFoemData.certCode"/>
                                </el-form-item>
                              </el-col>
                              <el-col :span=12 v-else>
                                <el-form-item class="postInfo-container-item" label="统一社会信用代码:">
                                  <el-input v-model="caseDetailFoemData.certCode"/>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12"
                                      v-if="isShowSubjectFile">
                                <el-form-item label="主体资格证明文件（中文）:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1003]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1003',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('395')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col
                                v-if="isShowForeignFileUpload&&isShowSubjectFile"
                                :span="12">
                                <el-form-item label="主体资格证明（英文）:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1004]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1004',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('396')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12" v-if="caseDetailFoemData.legalNature=='自然人'">
                                <el-form-item label="身份证明文件(中文):" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1001]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1001',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('392')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col
                                v-if="isShowForeignFileUpload && caseDetailFoemData.legalNature=='自然人'"
                                :span="12">
                                <el-form-item label="身份证明原文件(外文):" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1002]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1002',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('394')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <el-row class="fullRow">
                              <el-col :span="24">
<!--                                <el-form-item v-if="['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(caseDetailFoemData.whdAgencyName) && ['内-内', '外-内'].includes(caseDetailFoemData.appFromto)" label="联系人:" class="postInfo-container-item">-->
<!--                                  <template>-->
<!--                                    <el-select ref="appContactPerson" default-first-option-->
<!--                                               @change="contactSelectChange" :clearable='true' placeholder="请选择"-->
<!--                                               v-model="caseDetailFoemData.appContactPerson" filterable>-->
<!--                                      <el-option v-for="(item,key)  in agentPersonList" :key="key"-->
<!--                                                 :label="item" :value="item">-->
<!--                                      </el-option>-->
<!--                                    </el-select>-->
<!--                                  </template>-->
<!--                                </el-form-item>-->
                                <el-form-item label="联系人:" class="postInfo-container-item">
                                  <template>
                                    <el-select ref="appContactPerson" allow-create default-first-option
                                               @change="contactSelectChange" :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.appContactPerson" filterable>
                                      <el-option v-for="(item,key)  in selectData.queryAppContact" :key="key"
                                                 :label="item.nameCn" :value="item.nameCn">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="邮政编码:" :prop="['内-内', '外-内'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.submitType === '网上申请' ? 'appContactZip' : ''" class="postInfo-container-item">
                                  <template>
                                    <el-input @mousewheel.native.prevent v-model="caseDetailFoemData.appContactZip"
                                              placeholder="" type="text">
                                    </el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="电话:" prop="appContactTel" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.appContactTel" placeholder=""></el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="邮箱:" class="postInfo-container-item">
                                  <template>
                                    <el-input :disabled="emailDisabled" v-model="caseDetailFoemData.appContactEmail" placeholder=""></el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="有关说明文件:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[1020]"/>
                                    <el-button size="mini" style="margin-left:10px" type="primary"
                                               @click="getfileData('1020',$event)">上传
                                    </el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="共同申请人:" class="postInfo-container-item">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.ifShareTm" @change="changeIfShareTm">
                                      <el-radio label='0'>否</el-radio>
                                      <el-radio label='1'>是</el-radio>

                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row v-if="caseDetailFoemData.ifShareTm=='1'">
                      <el-col class="tilteSpan" :span="24">
                        <span id='-title'>其他申请人</span>
                      </el-col>
                    </el-row>
                    <el-row v-if="caseDetailFoemData.ifShareTm=='1'">
                      <el-col class="form-con-item" :span="24">
                        <el-row>
                          <el-col :span="24" style="text-align:right">

                            <el-button @click="dialogFormjoin=1" style="margin-left:10px" type="primary" size="mini">
                              添加
                            </el-button>
                          </el-col>
                        </el-row>
                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-table :data="caseDetailFoemData.joinApps.filter(item=>item.type!=4)" border
                                      current-row-key empty-text="暂无数据" fit highlight-current-row size="mini"
                                      style="width: 100%;">
                              <el-table-column align="left" label="序号" type="index" width="50"/>
                              <el-table-column align="left" label="中文名称" width>
                                <template slot-scope="scope">
                                  <span v-if="!scope.row.modifyState">{{ scope.row.nameCn }}</span>
                                  <el-input v-if="scope.row.modifyState" type="text"
                                            v-model="scope.row.nameCn"></el-input>
                                </template>
                              </el-table-column>
                              <el-table-column align="left" label="英文名称" width>
                                <template slot-scope="scope">
                                  <span v-if="!scope.row.modifyState">{{ scope.row.nameEn }}</span>
                                  <el-input v-if="scope.row.modifyState" type="text"
                                            v-model="scope.row.nameEn"></el-input>
                                </template>
                              </el-table-column>
                              <el-table-column align="left" label="证件名称" width>
                                <template slot-scope="scope">
                                  <span v-if="!scope.row.modifyState">{{ scope.row.cardName }}</span>
                                  <el-input v-if="scope.row.modifyState" type="text"
                                            v-model="scope.row.cardName"></el-input>
                                </template>
                              </el-table-column>
                              <el-table-column align="left" label="证件号" width>
                                <template slot-scope="scope">
                                  <span v-if="!scope.row.modifyState">{{ scope.row.cardId }}</span>
                                  <el-input v-if="scope.row.modifyState" type="text"
                                            v-model="scope.row.cardId"></el-input>
                                </template>
                              </el-table-column>
                              <el-table-column align="left" label="证明文件" width>
                                <template slot-scope="scope">
                                  <p v-for="item in scope.row.materialArray">
                                    <a target="_blank" :href="`ipdoc${item.address}`">{{item.materialName}}</a>
                                  </p>
                                </template>
                              </el-table-column>

                              <el-table-column align="left" label="操作" width>
                                <template slot-scope="scope">
                                  <el-button @click="changeAppJoinState(scope.row,scope.$index)" type="text"
                                             size="mini">{{scope.row.modifyState?'保存':'修改'}}
                                  </el-button>
                                  <el-button @click="deljoinp(scope.row)" type="text" size="mini">删除</el-button>
                                </template>
                              </el-table-column>

                            </el-table>

                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </template>
                  <template>
                    <el-row>
                      <el-col class="tilteSpan" :span="24"
                              v-if="trademarkList.includes(caseDetailFoemData.caseType)||!$route.query.import">
                        <span id='sbxx-title'>商标信息</span>
                      </el-col>
                    </el-row>
                    <el-row
                    v-if="caseDetailFoemData.caseType==='提供使用声明/证据（境外）' || caseDetailFoemData.caseType==='马德里商标转国内注册' || caseDetailFoemData.caseType&&trademarkList.includes(caseDetailFoemData.caseType)">
                    <el-col class="form-con-item" :span="24">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <!--                          马德里商标转国内注册-->
                          <div class="madrid" v-if="caseDetailFoemData.caseType==='马德里商标转国内注册'">
                            <el-row class="fullRow">
                              <el-col :span="8">
                                <el-form-item class="" prop="gjRegNumber" label="国际注册号:">
                                  <template>
                                    <el-input @change="regnumberchangeMadRid" v-model="caseDetailFoemData.gjRegNumber"/>

                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item class="" prop="gjRegDate" label="国际注册日期:">
                                  <el-date-picker
                                    :picker-options="pickerOptions"
                                    align="right"
                                    format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                    type="date"
                                    v-model="caseDetailFoemData.gjRegDate"
                                    value-format="yyyy-MM-dd"/>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item class="" label="后期指定日期:">
                                  <el-date-picker
                                    :picker-options="pickerOptions"
                                    align="right"
                                    format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                    type="date"
                                    v-model="caseDetailFoemData.hqzdDate"
                                    value-format="yyyy-MM-dd"/>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="12">
                                <el-form-item class="" prop="interLogoutDate" label="国际注销登记日期:">
                                  <el-date-picker
                                    :picker-options="pickerOptions"
                                    align="right"
                                    format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                    type="date"
                                    v-model="caseDetailFoemData.interLogoutDate"
                                    value-format="yyyy-MM-dd"/>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="" label="国际注销通知书:">
                                  <el-upload class="upload-demo"
                                             :before-remove="brforeRemoveFile"
                                             ref="uploadFile"
                                             :limit="2" :data="uploadFileData" :action="creatematerialUrl"
                                             name="attachFile"
                                             :auto-upload="true"
                                             :on-success="successCallback"
                                             :before-upload="beforeupload"
                                             :file-list="zhuxiaofileList"
                                             :show-file-list="true"

                                  >
                                    <el-button type="primary" size="mini" style="margin-left:20px;display: block">上传
                                    </el-button>
                                  </el-upload>
                                </el-form-item>
                              </el-col>
                            </el-row>


                          </div>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="商标名称:" prop="tmName"
                                            class="postInfo-container-item  uploader-custfile">
                                <template>

                                  <el-input v-model="caseDetailFoemData.tmName" @change="changeTmName"></el-input>

                                  <el-dropdown style="margin-left:10px" @command="tkInspect">
                                    <el-button type="primary" size="mini">
                                      检查
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                      <el-dropdown-item command='1'>禁止注册检查</el-dropdown-item>
                                      <el-dropdown-item command='2'>重名检查</el-dropdown-item>
                                    </el-dropdown-menu>
                                  </el-dropdown>
                                  <div style="margin-left: 16px;"
                                       :class="{redClass:tkInspectType=='2',greenClass:tkInspectType=='1'}"
                                       v-if="tkInspectText!=''">{{tkInspectText.content}}
                                  </div>
                                  <div style="margin-left: 16px;"
                                       :class="{redClass:tkInspectType=='2',greenClass:tkInspectType=='1'}"
                                       v-if="tkInspectText!=''">{{tkInspectText.cause}}
                                  </div>
                                  <div style="margin-left: 16px;"
                                       :class="{redClass:tkInspectType=='2',greenClass:tkInspectType=='1'}"
                                       v-if="tkInspectText!=''">{{tkInspectText.innerMemo}}
                                  </div>
                                </template>
                              </el-form-item>

                            </el-col>

                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="商标英文:" class="postInfo-container-item">
                                <template>
                                  <el-input v-model="caseDetailFoemData.tmNameEn"></el-input>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="商标图样:" class="postInfo-container-item uploader-custfile">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1018]"></el-input>
                                  <el-button style="margin-left:10px" size="mini" type="primary"
                                             @click="getfileData('1018',$event)">上传
                                  </el-button>
                                  <el-button style="margin-left:10px" size="mini" type="primary"
                                             @click="deleteFile(materialArray.find(item => item.materialTypeId ==1018)?materialArray.find(item => item.materialTypeId ==1018):{materialTypeId:1018})">
                                    删除
                                  </el-button>
                                  <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                  <!--:action="fileUrl" name='attachFile' :data="fileData('410')">-->
                                  <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                  <!--</el-upload>-->
                                  <div><img v-if="tyimage" style="width:100px;height:100px;margin: 10px 10px;"
                                            :src="tyimage"></div>
                                  <div>图样文件格式应为jpg，图形应清晰，图样文件大小应小于“200KB”且图形像素介于“400×400－1500×1500”之间。如果通过扫
                                    描获得图样的，应按24位彩色、300dpi分辨率扫描符合《商标法》及其实施条例规定的图形（图形清晰，大于5×5厘米且小于10×10厘米）。
                                    申请人（或代理人）应确保扫描后的图形与原图形的色彩深浅（或灰度）一致，否则，可能影响《商标注册证》上图形的清晰度。）;
                                    以颜色组合或者着色图样申请商标注册的，应分别上传着色图样及黑白稿，黑白稿在”黑白稿“中上传。 不指定颜色的，只上传黑白图样即可。
                                    当图样没有正确显示时,那是因为您的图样不符合要求请勿下一步,否则递交申请会失败
                                  </div>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">

                              <el-form-item label="商标设计说明:" class="postInfo-container-item" :prop="['商标注册', '分隔申请'].includes(caseDetailFoemData.caseType) && ['外-内', '内-内'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.submitType === '网上申请' ? 'tmDesignDeclare' : ''">
                                <template>
                                  <el-input type="textarea" :rows="4" placeholder="请输入内容" :maxlength="['外-内', '内-内'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.submitType === '网上申请' ? 180 : 10000"
                                            v-model="caseDetailFoemData.tmDesignDeclare">
                                  </el-input>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.caseType === '商标注册'">
                            <el-col :span="24">
                              <el-form-item label="使用方式:" class="postInfo-container-item">
                                <el-input
                                  placeholder="请输入内容"
                                  v-model="caseDetailFoemData.statementOfEvidence"
                                >
                                </el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="商标国际分类:" class="postInfo-container-item"
                                            :prop="noNeedTosubmit.includes(caseDetailFoemData.caseType)?'':'goodClasses'">
                                <el-input v-model="caseDetailFoemData.goodClasses" placeholder="例如:1;2;3"></el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="商品/服务项目:" class="postInfo-container-item">
                                <template>
                                  <Goods v-if="caseDetailFoemData.appFromto" @changeGoodClass="changeGoodClass" ref="goods" :isRevamp="caseDetailFoemData.isRevamp" :appFromto="caseDetailFoemData.appFromto" :trademarkCaseCategoryModifyList="caseDetailFoemData.trademarkCaseCategoryModifyList" :goodsVersionList="goodsVersionList" :caseId="caseDetailFoemData.caseId"
                                         :appId='caseDetailFoemData.appId' @getGoods='getGoods' @delgood='delgood'
                                         :goodsListData='caseDetailFoemData.goods'></Goods>
                                  <!--<el-button style="margin-left:10px" @click="dialogFormgoods=true" type="primary"-->
                                  <!--size="mini">-->
                                  <!--商标类别-->
                                  <!--</el-button>-->
                                  <!--<el-col :span="24" style="text-align: right;margin-top:10px">-->
                                  <!--<el-table size="mini" :data="pageGoods" border fit empty-text="暂无数据"-->
                                  <!--highlight-current-row current-row-key style="width: 100%;">-->
                                  <!--<el-table-column label="商品类别" align="left" width>-->
                                  <!--<template slot-scope="scope">-->
                                  <!--<span>{{ scope.row.goodClass }}</span>-->
                                  <!--</template>-->
                                  <!--</el-table-column>-->
                                  <!--<el-table-column label="商品类似群组" align="left" width>-->
                                  <!--<template slot-scope="scope">-->
                                  <!--<span>{{ scope.row.similarGroup }}</span>-->
                                  <!--</template>-->
                                  <!--</el-table-column>-->
                                  <!--<el-table-column label="商品代码" align="left" width>-->
                                  <!--<template slot-scope="scope">-->
                                  <!--<span>{{ scope.row.goodCode }}</span>-->
                                  <!--</template>-->
                                  <!--</el-table-column>-->
                                  <!--<el-table-column label="商品中文名称" align="left" width>-->
                                  <!--<template slot-scope="scope">-->
                                  <!--<span>{{ scope.row.goodName }}</span>-->
                                  <!--</template>-->
                                  <!--</el-table-column>-->
                                  <!--<el-table-column label="商品英文名称" align="left" width>-->
                                  <!--<template slot-scope="scope">-->
                                  <!--<span>{{ scope.row.goodEnName }}</span>-->
                                  <!--</template>-->
                                  <!--</el-table-column>-->

                                  <!--<el-table-column label="操作" align="left" width>-->
                                  <!--<template slot-scope="scope">-->
                                  <!--<el-button @click="delgood(scope.row)" type="text">删除</el-button>-->
                                  <!--</template>-->
                                  <!--</el-table-column>-->

                                  <!--</el-table>-->
                                  <!--<pagination v-show="goodslistPageData.total>0" :total="goodslistPageData.total"-->
                                  <!--:page.sync="goodslistPageData.pageNo" :limit.sync="goodslistPageData.pageSize"-->
                                  <!--@pagination="getgoodsList(caseDetailFoemData.goods)" />-->
                                  <!--</el-col>-->
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="['内-外', '外-外'].includes(caseDetailFoemData.appFromto)">
                            <el-col :span="24">
                              <el-form-item label="商品查对文件:" class="postInfo-container-item">
                                <check-goods-list :total="checkGoodListTotal" ref="checkGoods" @delCheckGoods="delCheckGoods" :goodsListData='caseDetailFoemData.goods' :goodsVersionList="goodsVersionList" @getCheckGoodsList="getCheckGoodsList" :caseId="caseDetailFoemData.caseId" :caseIdArray="mainCaseIds" :checkGoodList="checkGoodList"></check-goods-list>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <template>
                            <el-row>
                              <el-col :span="8">
                                <el-form-item label="递交日期:" class="postInfo-container-item "
                                              v-if="(['答复临时驳回/审查意见（境外）', '提供使用声明/证据（境外）','马德里商标转国内注册','不予注册复审','商标注册','分割申请','异议','变名变址','转让/移转','续展','删减商品项目','变更注册申请代理机构','更正商标申请事项','注册驳回复审','国际注册驳回复审','撤销商标复审','异议答辩','撤三答辩(提供使用证明)','撤销通用名称答辩','参与不予注册复审','无效宣告答辩','撤销复审答辩','撤销三年停止使用申请','撤销成为通用名称注册商标','无效宣告申请','撤回商标评审','行政复议','许可备案','补发商标注册证','补发商标变转续证明','商标注销','撤回商标申请'].includes(caseDetailFoemData.caseType))">
                                  <el-date-picker v-model="caseDetailFoemData.submitDate" format='yyyy-MM-dd'
                                                  value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                                  :picker-options="pickerOptions">
                                  </el-date-picker>
                                </el-form-item>
                              </el-col>
                              <!-- <el-col :span="12"  v-if="cdBool">
                                <el-form-item class="postInfo-container-item" label="递交日期:">
                                  <template>
                                    <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData." value-format="yyyy-MM-dd" />
                                  </template>
                                </el-form-item>
                              </el-col> -->

                              <el-col :span="8">
                                <el-form-item label="申请日期:" class="postInfo-container-item ">
                                  <el-date-picker v-model="caseDetailFoemData.appDate" format='yyyy-MM-dd'
                                                  value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                                  :picker-options="pickerOptions">
                                  </el-date-picker>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item label="申请号:" class="postInfo-container-item ">
                                  <el-input type="text" placeholder="请输入内容" v-model="caseDetailFoemData.appNumber">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="8">
                                <el-form-item label="初审公告日期:" class="postInfo-container-item ">
                                  <el-date-picker v-model="caseDetailFoemData.approvalDate" format='yyyy-MM-dd'
                                                  value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                                  :picker-options="pickerOptions">
                                  </el-date-picker>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item label="初审公告号:" class="postInfo-container-item ">
                                  <template>
                                    <el-input type="text" placeholder="请输入内容" v-model="caseDetailFoemData.approvalNo">
                                    </el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item class="postInfo-container-item" label="初审公告期号:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.approvalNumber"/>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <el-form-item :label="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.madrid ? '国际注册日期' : '注册日期:'" class="postInfo-container-item ">
                                  <el-date-picker v-model="caseDetailFoemData.regDate" format='yyyy-MM-dd'
                                                  value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                                  :picker-options="pickerOptions">
                                  </el-date-picker>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item :label="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.madrid ? '国际注册号' : '注册号:'" class="postInfo-container-item ">
                                  <el-input type="text" placeholder="请输入内容" v-model="caseDetailFoemData.regNumber"
                                            @change="regnumberchange">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="有效起始日:" class="postInfo-container-item">
                                  <el-date-picker v-model="caseDetailFoemData.validStartDate" type="date"
                                                  placeholder="选择日期" value-format="yyyy-MM-dd">
                                  </el-date-picker>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="有效期截至日:" class="postInfo-container-item">
                                  <el-date-picker v-model="caseDetailFoemData.validEndDate" type="date"
                                                  placeholder="选择日期" value-format="yyyy-MM-dd">
                                  </el-date-picker>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  </template>
                  <template v-if="caseDetailFoemData.caseType==='马德里商标转国内注册'">
                    <el-row>
                      <el-col class="tilteSpan" :span="24">
                        <span id='sbsqsm-title'>商标申请说明</span>
                      </el-col>
                    </el-row>
                    <el-row>
                    <el-col class="form-con-item" :span="24">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item label="优先权国家:" class="postInfo-container-item">
                                <template>
                                  <el-select default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.priorityBaseCrty" filterable>
                                    <el-option v-for="(item,key)  in selectData.country" :key="key"
                                               :label="item.countryCn" :value="item.countryCn">
                                    </el-option>
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="优先权日期:" class="postInfo-container-item">
                                <template>
                                  <el-date-picker v-model="caseDetailFoemData.priorityAppDate" format='yyyy-MM-dd'
                                                  value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                                  :picker-options="pickerOptions">
                                  </el-date-picker>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="优先权类别:" class="postInfo-container-item">
                                <el-input v-model="caseDetailFoemData.priorityClasses" placeholder="例如:1;2;3"></el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </el-col>
                    </el-row>
                  </template>
                  <el-row v-if="caseDetailFoemData.caseType === '答复临时驳回/审查意见（境外）' || caseDetailFoemData.caseType==='商标注册' || caseDetailFoemData.caseType==='提供使用声明/证据（境外）'">
                    <el-col class="tilteSpan" :span="24">
                      <span id='sbsqsm-title'>商标申请说明</span>
                    </el-col>
                  </el-row>
                  <el-row v-if="trademarkList.filter(item=>!['答复临时驳回/审查意见（境外）', '商标注册', '提供使用声明/证据（境外）'].includes(item)).includes(caseDetailFoemData.caseType)">
                    <el-col class="tilteSpan" :span="24">
                      <span id='sbsqsm-title'>商标说明</span>
                    </el-col>
                  </el-row>
                  <el-row v-if="trademarkList.includes(caseDetailFoemData.caseType)">
                    <el-col class="form-con-item" :span="24">
                      <el-row class="form-border">
                        <el-col :span="24">

                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="种类:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.tmType">
                                    <el-radio label='1'>一般</el-radio>
                                    <el-radio label='2'>集体</el-radio>
                                    <el-radio label='3'>证明</el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.tmType=='2'||caseDetailFoemData.tmType=='3'">
                            <el-col :span="24">
                              <el-form-item label="集体/证明商标使用管理规则:" class="postInfo-container-item">
                                <template>
                                  <el-input type="textarea" :rows="3" v-model="caseDetailFoemData.memberRule">
                                  </el-input>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.tmType=='2'||caseDetailFoemData.tmType=='3'">
                            <el-col :span="24">
                              <el-form-item label="集体/证明商标使用管理规则(附件):" class="postInfo-container-item">
                                <template>
                                  <el-input v-model="fileName[1005]"></el-input>
                                  <el-button style="margin-left:10px" size="mini" type="primary"
                                             @click="getfileData('1005',$event)">上传
                                  </el-button>
                                  <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                  <!--:action="fileUrl" name='attachFile' :data="fileData('397')">-->
                                  <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                  <!--</el-upload>-->
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row v-if="caseDetailFoemData.tmType=='2'" class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="集体成员名单:" class="postInfo-container-item">
                                <template>
                                  <el-input type="textarea" :rows="4" placeholder="请输入内容"
                                            v-model="caseDetailFoemData.memberNamelist">
                                  </el-input>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.tmType=='2'">
                            <el-col :span="24">
                              <el-form-item label="集体成员名单(附件):" class="postInfo-container-item">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1006]"></el-input>
                                  <el-button style="margin-left:10px" size="mini" type="primary"
                                             @click="getfileData('1006',$event)">上传
                                  </el-button>
                                  <!--<el-upload-->
                                  <!--class="upload-btn"-->
                                  <!--:on-success='fileUploadSuccess'-->
                                  <!--:show-file-list='false'-->
                                  <!--:action="fileUrl"-->
                                  <!--name='attachFile'-->
                                  <!--:data="fileData('398')">-->
                                  <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                  <!--</el-upload>-->
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <template v-if="caseDetailFoemData.tmType=='3'">
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="申请人是否具备检测能力:" class="postInfo-container-item">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.isAppWithDetectAbility">
                                      <el-radio label='否'></el-radio>
                                      <el-radio label='是'></el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <el-row class="fullRow" v-if="caseDetailFoemData.isAppWithDetectAbility=='是'">
                              <el-col :span="24">
                                <el-form-item label="申请人检测资质证书（附件）:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1007]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1007',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('399')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="caseDetailFoemData.isAppWithDetectAbility=='是'">
                              <el-col :span="24">
                                <el-form-item label="申请人专业检测设备清单:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1008]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1008',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('400')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="caseDetailFoemData.isAppWithDetectAbility=='是'">
                              <el-col :span="24">
                                <el-form-item label="申请人专业技术人员名单（附件）:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1009]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1009',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('401')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="caseDetailFoemData.isAppWithDetectAbility=='是'">
                              <el-col :span="24">
                                <el-form-item label="申请人技术人员证书:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1010]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1010',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('402')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                          <template v-if="caseDetailFoemData.caseType !=='变更注册申请代理机构'">
                            <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="是否三维标志:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.ifSolidTm">
                                    <el-radio label='0'>否</el-radio>
                                    <el-radio label='1'>是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="是否颜色组合:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.colorSign">
                                    <el-radio label='0'>否</el-radio>
                                    <el-radio label='1'>是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="指定颜色:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.assignColor">
                                    <el-radio :label='false'>否</el-radio>
                                    <el-radio :label='true'>是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item label="声音标志:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.tmVoice">
                                    <el-radio label='0'>否</el-radio>
                                    <el-radio label='1'>是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col v-if="caseDetailFoemData.tmVoice=='1'" :span="12">
                              <el-form-item label="声音文件:" class="postInfo-container-item">
                                <template>
                                  <el-input v-model="fileName[1016]"></el-input>
                                  <el-button style="margin-left:10px" size="mini" type="primary"
                                             @click="getfileData('1016',$event)">上传
                                  </el-button>
                                  <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                  <!--:action="fileUrl" name='attachFile' :data="fileData('408')">-->
                                  <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                  <!--</el-upload>-->
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          </template>

                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="要求优先权:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="ifpriority" @change="changePriority">
                                    <el-radio label='0'>否</el-radio>
                                    <el-radio label='1'>是</el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="ifpriority=='1'">
                            <el-col :span="24">
                              <el-form-item label="要求优先权声明:" prop="priorityType" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.priorityType">
                                    <el-radio label='1'>基于第一次申请的优先权</el-radio>
                                    <el-radio label='2'>基于展会的优先权</el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ifpriority=='1'">
                            <el-col :span="12">
                              <el-form-item label="优先权国家:" class="postInfo-container-item" prop="priorityBaseCrty">
                                <template>
                                  <el-select default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.priorityBaseCrty" filterable>
                                    <el-option v-for="(item,key)  in selectData.country" :key="key"
                                               :label="item.countryCn" :value="item.countryCn">
                                    </el-option>
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="优先权日期:" class="postInfo-container-item" prop="priorityAppDate">
                                <template>
                                  <el-date-picker v-model="caseDetailFoemData.priorityAppDate" format='yyyy-MM-dd'
                                                  value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                                  :picker-options="pickerOptions">
                                  </el-date-picker>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ifpriority=='1'"
                                  v-show="trademarkList.includes(caseDetailFoemData.caseType)">
                            <el-col :span="12">
                              <el-form-item label="优先权文件后补:" class="postInfo-container-item" prop="isLoadPriorityFile">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.isLoadPriorityFile">
                                    <el-radio label='0'>否</el-radio>
                                    <el-radio label='1'>是</el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="优先权证明文件:"
                                            :prop="caseDetailFoemData.isLoadPriorityFile=='0'?'isLoadPriorityFile':''"
                                            class="postInfo-container-item">
                                <template>

                                  <el-input v-model="fileName[1017]"></el-input>
                                  <el-button style="margin-left:10px" size="mini" type="primary"
                                             @click="getfileData('1017',$event)">上传
                                  </el-button>
                                  <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                  <!--:action="fileUrl" name='attachFile' :data="fileData('409')">-->
                                  <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                  <!--</el-upload>-->
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="ifpriority=='1'">
                            <el-col :span="24">
                              <el-form-item label="优先权申请号:" class="postInfo-container-item" prop="priorityAppNum">
                                <template>
                                  <el-input v-model="caseDetailFoemData.priorityAppNum"></el-input>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="supplementList.includes(caseDetailFoemData.caseType)">
                            <el-col :span="24">
                              <el-form-item label="之后是否补充材料:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.supplement">
                                    <el-radio label='0'>否</el-radio>
                                    <el-radio label='1'>是</el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row v-if="tmlist.includes(caseDetailFoemData.caseType)&&$route.query.import!=='1'">
                    <el-col class="form-con-item" :span="24">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-collapse class="case_collapse" v-model="collaptrademarkTable" v-if="!['内-外', '外-外'].includes(caseDetailFoemData.appFromto)">
                            <el-collapse-item title="商标列表" name="1">
                              <trademarkTable v-if="regNumberList.length" :regNumberList="regNumberList"
                                              @queryCanProcessTmChange="queryCanProcessTmState = false"
                                              :queryCanProcessTmState="queryCanProcessTmState"
                                              :queryModuleData="queryModuleData" :multipleState="false"
                                              :goodClasses="caseDetailFoemData.goodClasses"
                                              :multiclass="caseDetailFoemData.multiclass"
                                              @getTrademark="getTrademark"></trademarkTable>
                            </el-collapse-item>
                          </el-collapse>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item label="商标名称:" class="postInfo-container-item ">
                                <el-input v-model="caseDetailFoemData.tmName" @change="changeTmName"></el-input>
                              </el-form-item>

                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="商标英文:" class="postInfo-container-item ">
                                <el-input v-model="caseDetailFoemData.tmNameEn"></el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="12">
                              <el-form-item label="商标注册号:" class="postInfo-container-item">
                                <el-input v-model="caseDetailFoemData.regNumber" @change="regnumberchange"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item :label="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.madrid ? '国际注册日期' : '注册日期:'" class="postInfo-container-item">
                                <el-date-picker v-model="caseDetailFoemData.regDate" type="date" placeholder="选择日期"
                                                value-format="yyyy-MM-dd">
                                </el-date-picker>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="12">
                              <el-form-item label="有效起始日:" class="postInfo-container-item">
                                <el-date-picker v-model="caseDetailFoemData.validStartDate" type="date"
                                                placeholder="选择日期" value-format="yyyy-MM-dd">
                                </el-date-picker>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="有效期截至日:" class="postInfo-container-item">
                                <el-date-picker v-model="caseDetailFoemData.validEndDate" type="date" placeholder="选择日期"
                                                value-format="yyyy-MM-dd" @change="changeDelayRenewal">
                                </el-date-picker>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="8"
                                    v-if="(['答复临时驳回/审查意见（境外）', '提供使用声明/证据（境外）','不予注册复审','商标注册','分割申请','异议','变名变址','转让/移转','续展','删减商品项目','变更注册申请代理机构','更正商标申请事项','注册驳回复审','国际注册驳回复审','撤销商标复审','异议答辩','撤三答辩(提供使用证明)','撤销通用名称答辩','参与不予注册复审','无效宣告答辩','撤销复审答辩','撤销三年停止使用申请','撤销成为通用名称注册商标','无效宣告申请','撤回商标评审','行政复议','许可备案','补发商标注册证','补发商标变转续证明','商标注销','撤回商标申请'].includes(caseDetailFoemData.caseType))">
                              <el-form-item label="递交日期:" class="postInfo-container-item ">
                                <el-date-picker v-model="caseDetailFoemData.submitDate" format='yyyy-MM-dd'
                                                value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                                :picker-options="pickerOptions">
                                </el-date-picker>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="申请日期:" class="postInfo-container-item ">
                                <el-date-picker v-model="caseDetailFoemData.appDate" format='yyyy-MM-dd'
                                                value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                                :picker-options="pickerOptions">
                                </el-date-picker>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="申请号:" class="postInfo-container-item ">
                                <el-input type="text" placeholder="请输入内容" v-model="caseDetailFoemData.appNumber">
                                </el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="商标图样:" class="postInfo-container-item uploader-custfile">
                                <img class="tmImg" :src="tyimage" alt="">
                                <el-input :disabled="true" v-model="fileName[1018]"></el-input>
                                <el-button style="margin-left:10px" size="mini" type="primary"
                                           @click="getfileData('1018',$event)">上传
                                </el-button>
                                <el-button style="margin-left:10px" size="mini" type="primary"
                                           @click="deleteFile(materialArray.find(item => item.materialTypeId ==1018)?materialArray.find(item => item.materialTypeId ==1018):{materialTypeId:1018})">
                                  删除
                                </el-button>

                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="商标国际分类:" class="postInfo-container-item"
                                            :prop="noNeedTosubmit.includes(caseDetailFoemData.caseType)?'':'goodClasses'">
                                <el-input v-model="caseDetailFoemData.goodClasses" placeholder="例如:1;2;3"></el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="商品/服务项目:" class="postInfo-container-item">
                                <template>
                                  <span style="color:red"
                                        v-if="caseDetailFoemData.caseType==='删减商品项目'">提示:以下为需删减的项目</span>
                                  <Goods v-if="caseDetailFoemData.appFromto" @changeGoodClass="changeGoodClass" ref="goods" :appId='caseDetailFoemData.appId' :appFromto="caseDetailFoemData.appFromto" :trademarkCaseCategoryModifyList="caseDetailFoemData.trademarkCaseCategoryModifyList" :goodsVersionList="goodsVersionList" :caseId="caseDetailFoemData.caseId"
                                         @getGoods='getGoods' @delgood='delgood'
                                         :goodsListData='caseDetailFoemData.goods'></Goods>
                                  <!--<el-button style="margin-left:10px" @click="dialogFormgoods=true" type="primary"-->
                                  <!--size="mini">-->
                                  <!--商标类别-->
                                  <!--</el-button>-->
                                  <!---->
                                  <!--<el-col :span="24" style="text-align: right;margin-top:10px">-->
                                  <!--<el-table size="mini" :data="pageGoods" border fit empty-text="暂无数据"-->
                                  <!--highlight-current-row current-row-key style="width: 100%;">-->
                                  <!--<el-table-column label="商品类别" align="left" width>-->
                                  <!--<template slot-scope="scope">-->
                                  <!--<span>{{ scope.row.goodClass }}</span>-->
                                  <!--</template>-->
                                  <!--</el-table-column>-->
                                  <!--<el-table-column label="商品类似群组" align="left" width>-->
                                  <!--<template slot-scope="scope">-->
                                  <!--<span>{{ scope.row.similarGroup }}</span>-->
                                  <!--</template>-->
                                  <!--</el-table-column>-->
                                  <!--<el-table-column label="商品代码" align="left" width>-->
                                  <!--<template slot-scope="scope">-->
                                  <!--<span>{{ scope.row.goodCode }}</span>-->
                                  <!--</template>-->
                                  <!--</el-table-column>-->
                                  <!--<el-table-column label="商品中文名称" align="left" width>-->
                                  <!--<template slot-scope="scope">-->
                                  <!--<span>{{ scope.row.goodName }}</span>-->
                                  <!--</template>-->
                                  <!--</el-table-column>-->
                                  <!--<el-table-column label="商品英文名称" align="left" width>-->
                                  <!--<template slot-scope="scope">-->
                                  <!--<span>{{ scope.row.goodEnName }}</span>-->
                                  <!--</template>-->
                                  <!--</el-table-column>-->

                                  <!--<el-table-column label="操作" align="left" width>-->
                                  <!--<template slot-scope="scope">-->
                                  <!--<el-button @click="delgood(scope.row)" type="text">删除</el-button>-->
                                  <!--</template>-->
                                  <!--</el-table-column>-->

                                  <!--</el-table>-->
                                  <!--<pagination v-show="goodslistPageData.total>0" :total="goodslistPageData.total"-->
                                  <!--:page.sync="goodslistPageData.pageNo" :limit.sync="goodslistPageData.pageSize"-->
                                  <!--@pagination="getgoodsList(caseDetailFoemData.goods)" />-->
                                  <!--</el-col>-->
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="['内-外', '外-外'].includes(caseDetailFoemData.appFromto)">
                            <el-col :span="24">
                              <el-form-item label="商品查对文件:" class="postInfo-container-item">
                                <check-goods-list :total="checkGoodListTotal" ref="checkGoods" @delCheckGoods="delCheckGoods" :goodsListData='caseDetailFoemData.goods' :goodsVersionList="goodsVersionList" @getCheckGoodsList="getCheckGoodsList" :caseId="caseDetailFoemData.caseId" :caseIdArray="mainCaseIds" :checkGoodList="checkGoodList"></check-goods-list>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="原代理组织:" class="postInfo-container-item">
                                <el-input v-model="caseDetailFoemData.respondentAgency"></el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="种类:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.tmType">
                                    <el-radio label='1'>一般</el-radio>
                                    <el-radio label='2'>集体</el-radio>
                                    <el-radio label='3'>证明</el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row class="fullRow" v-if="caseDetailFoemData.tmType=='2'||caseDetailFoemData.tmType=='3'">
                            <el-col :span="24">
                              <el-form-item label="集体/证明商标使用管理规则:" class="postInfo-container-item">
                                <template>
                                  <el-input type="textarea" :rows="3" v-model="caseDetailFoemData.memberRule">
                                  </el-input>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.tmType=='2'||caseDetailFoemData.tmType=='3'">
                            <el-col :span="24">
                              <el-form-item label="集体/证明商标使用管理规则(附件):" class="postInfo-container-item">
                                <template>
                                  <el-input v-model="fileName[1005]"></el-input>
                                  <el-button style="margin-left:10px" size="mini" type="primary"
                                             @click="getfileData('1005',$event)">上传
                                  </el-button>
                                  <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                  <!--:action="fileUrl" name='attachFile' :data="fileData('397')">-->
                                  <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                  <!--</el-upload>-->
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row v-if="caseDetailFoemData.tmType=='2'" class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="集体成员名单:" class="postInfo-container-item">
                                <template>
                                  <el-input type="textarea" :rows="4" placeholder="请输入内容"
                                            v-model="caseDetailFoemData.memberNamelist">
                                  </el-input>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.tmType=='2'">
                            <el-col :span="24">
                              <el-form-item label="集体成员名单(附件):" class="postInfo-container-item">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1006]"></el-input>
                                  <el-button style="margin-left:10px" size="mini" type="primary"
                                             @click="getfileData('1006',$event)">上传
                                  </el-button>
                                  <!--<el-upload-->
                                  <!--class="upload-btn"-->
                                  <!--:on-success='fileUploadSuccess'-->
                                  <!--:show-file-list='false'-->
                                  <!--:action="fileUrl"-->
                                  <!--name='attachFile'-->
                                  <!--:data="fileData('398')">-->
                                  <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                  <!--</el-upload>-->
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <template v-if="caseDetailFoemData.tmType=='3'">
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="申请人是否具备检测能力:" class="postInfo-container-item">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.isAppWithDetectAbility">
                                      <el-radio label='否'></el-radio>
                                      <el-radio label='是'></el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <el-row class="fullRow" v-if="caseDetailFoemData.isAppWithDetectAbility=='是'">
                              <el-col :span="24">
                                <el-form-item label="申请人检测资质证书（附件）:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1007]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1007',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('399')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="caseDetailFoemData.isAppWithDetectAbility=='是'">
                              <el-col :span="24">
                                <el-form-item label="申请人专业检测设备清单:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1008]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1008',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('400')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="caseDetailFoemData.isAppWithDetectAbility=='是'">
                              <el-col :span="24">
                                <el-form-item label="申请人专业技术人员名单（附件）:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[401]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('401',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('401')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="caseDetailFoemData.isAppWithDetectAbility=='是'">
                              <el-col :span="24">
                                <el-form-item label="申请人技术人员证书:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1010]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1010',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('402')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                          <template v-if="caseDetailFoemData.caseType !=='变更注册申请代理机构'">
                            <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="是否三维标志:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.ifSolidTm">
                                    <el-radio label='0'>否</el-radio>
                                    <el-radio label='1'>是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="是否颜色组合:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.colorSign">
                                    <el-radio label='0'>否</el-radio>
                                    <el-radio label='1'>是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="指定颜色:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.assignColor">
                                    <el-radio :label='false'>否</el-radio>
                                    <el-radio :label='true'>是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item label="声音标志:" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.tmVoice">
                                    <el-radio label='0'>否</el-radio>
                                    <el-radio label='1'>是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col v-if="caseDetailFoemData.tmVoice=='1'" :span="12">
                              <el-form-item label="声音文件:" class="postInfo-container-item">
                                <template>
                                  <el-input v-model="fileName[1016]"></el-input>
                                  <el-button style="margin-left:10px" size="mini" type="primary"
                                             @click="getfileData('1016',$event)">上传
                                  </el-button>
                                  <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                  <!--:action="fileUrl" name='attachFile' :data="fileData('408')">-->
                                  <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                  <!--</el-upload>-->
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          </template>

                          <el-row class="fullRow" v-if="supplementList.includes(caseDetailFoemData.caseType)">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="之后是否补充材料:">
                                <el-radio-group v-model="caseDetailFoemData.supplement">
                                  <el-radio :label="0">否</el-radio>
                                  <el-radio :label="1">是</el-radio>
                                </el-radio-group>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <change-of-name-and-address ref="changeOfNameAndAddress"
                                                      :caseDetailFoemData="caseDetailFoemData"
                                                      v-if="caseDetailFoemData.caseType==='变名变址'"
                                                      :custId="caseDetailFoemData.custId" :fileUrl="fileUrl"
                                                      :fileName="fileName" :mainCaseIds="mainCaseIds"
                                                      @getAppInfo="getAppInfo" @getAppAddress="getAppAddress"
                                                      @getChildrenData="(obj)=>getfileData(obj.materialTypeId, obj.e)">
                  </change-of-name-and-address>
                  <el-row class="fullRow" v-if="caseDetailFoemData.caseType==='变名变址'">
                    <el-col :span="24">
                      <el-form-item label="变更前共同申请人:" class="postInfo-container-item">
                        <el-row>
                          <el-col :span="24" style="text-align:right">

                            <el-button @click="dialogFormjoin=4" style="margin-left:10px" type="primary"
                                        size="mini">
                              添加
                            </el-button>
                          </el-col>
                        </el-row>
                        <!--<el-row class="form-border">-->
                        <!--<el-col :span="24">-->
                        <el-table :data="caseDetailFoemData.joinApps.filter(item=>item.type==4)" border
                                  current-row-key empty-text="暂无数据" fit highlight-current-row size="mini"
                                  style="width: 100%;">
                          <el-table-column align="left" label="序号" type="index" width="50"/>
                          <el-table-column align="left" label="中文名称" width>
                            <template slot-scope="scope">
                              <span v-if="!scope.row.modifyState">{{ scope.row.nameCn }}</span>
                              <el-input v-if="scope.row.modifyState" type="text"
                                        v-model="scope.row.nameCn"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column align="left" label="英文名称" width>
                            <template slot-scope="scope">
                              <span v-if="!scope.row.modifyState">{{ scope.row.nameEn }}</span>
                              <el-input v-if="scope.row.modifyState" type="text"
                                        v-model="scope.row.nameEn"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column align="left" label="证件名称" width>
                            <template slot-scope="scope">
                              <span v-if="!scope.row.modifyState">{{ scope.row.cardName }}</span>
                              <el-input v-if="scope.row.modifyState" type="text"
                                        v-model="scope.row.cardName"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column align="left" label="证件号" width>
                            <template slot-scope="scope">
                              <span v-if="!scope.row.modifyState">{{ scope.row.cardId }}</span>
                              <el-input v-if="scope.row.modifyState" type="text"
                                        v-model="scope.row.cardId"></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column align="left" label="证明文件" width>
                            <template slot-scope="scope">
                              <p v-for="item in scope.row.materialArray">
                                <a target="_blank" :href="`ipdoc${item.address}`">{{item.materialName}}</a>
                              </p>
                              <!--                                      <span v-if="!scope.row.modifyState&&(scope.row.materialArray&&.length)">-->
                              <!--                                      -->
                              <!--                                      </span>-->
                              <!--                                      <el-upload v-show="scope.row.modifyState" class="uploadsqr" drag name="attachFile" :data="fileData(scope.row.joinAppId,scope.row.getFileIsEn)" :action="fileUrl" :file-list="scope.row.materialArray" :on-success="(response, file, fileList)=>fileUploadSuccess(response, file, fileList,scope.$index)" :limit="1">-->
                              <!--                                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
                              <!--                                      </el-upload>-->
                            </template>
                          </el-table-column>

                          <el-table-column align="left" label="操作" width>
                            <template slot-scope="scope">
                              <el-button @click="changeAppJoinState(scope.row,scope.$index)" type="text"
                                          size="mini">{{scope.row.modifyState?'保存':'修改'}}
                              </el-button>
                              <el-button @click="deljoinp(scope.row)" type="text" size="mini">删除</el-button>
                            </template>
                          </el-table-column>

                        </el-table>

                        <!--</el-col>-->
                        <!--</el-row>-->
                      </el-form-item>
                    </el-col>
                  </el-row>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col class="tilteSpan" :span="24">
                      <span id='khxx-title'>客户信息</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col class="form-con-item" :span="24">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="客户名称:" prop="custId" class="postInfo-container-item">
                                <!--                                <template>-->
                                <!--                                  <el-input :disabled="true" v-model="caseDetailFoemData.custName">-->
                                <!--                                  </el-input>-->
                                <!--                                </template>-->
                                <el-select
                                  v-model="caseDetailFoemData.custId"
                                  ref="custSelect"
                                  :disabled="!($store.getters.permissions.includes(242))"
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
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="客户文号:" class="postInfo-container-item" prop="custRefno">
                                <template>
                                  <el-input v-model="caseDetailFoemData.custRefno">
                                  </el-input>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item label="客户联系人:" class="postInfo-container-item" prop="custContactId">
                                <template>

                                  <el-select @change='contactchange' default-first-option :clearable='true'
                                             placeholder="请选择" v-model="caseDetailFoemData.custContactId" filterable>
                                    <el-option v-for="(item,key)  in selectData.customerContacts" :key="key"
                                               :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId">
                                    </el-option>
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="抄送人:" class="postInfo-container-item">
                                <template>
                                  <el-select default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.trademarkCaseCustContacts" multiple filterable>
                                    <el-option v-for="(item,key)  in selectData.customerContacts" :key="key"
                                               :label="item.name" :value="item.custContactId">
                                    </el-option>
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="信函地址:" class="postInfo-container-item">
                                <template>
                                  <el-select default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.letterAddrId" filterable>
                                    <el-option v-for="(item,key)  in selectData.customerMailAdds" :key="key"
                                               :label="(item.addressCn||'')+(item.addressEn||'')" :value="item.addrId">
                                    </el-option>
                                  </el-select>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="账单联系人:" class="postInfo-container-item">
                                <template>
                                  <el-select default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.billCustContactId" filterable>
                                    <el-option v-for="(item,key)  in selectData.billContacts" :key="key"
                                               :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId">
                                    </el-option>
                                  </el-select>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="折扣率:" class="postInfo-container-item">
                                <template>

                                  <el-input type="number" min="1" max="100" v-model="caseDetailFoemData.discount"/>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="账单地址:" class="postInfo-container-item">
                                <template>
                                  <el-select default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.billAddrId" filterable>
                                    <el-option v-for="(item,key)  in selectData.billAdds" :key="key"
                                               :label="(item.addressCn||'')+(item.addressEn||'')" :value="item.addrId">
                                    </el-option>
                                  </el-select>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <template v-if="caseDetailFoemData.caseType&&!trademarkList.includes(caseDetailFoemData.caseType)">
                    <el-row>
                      <el-col class="tilteSpan" :span="24">
                        <span id='sqrxx-title'>申请人信息</span>
                      </el-col>
                    </el-row>
                    <!--                    <el-row>-->
                    <!--                      <el-col class="form-con-item" :span="24">-->
                    <!--                        <el-row class="form-border">-->
                    <!--                          <el-col :span="24">-->
                    <!--                            <el-row class="fullRow">-->
                    <!--                              <el-col :span="24">-->
                    <!--                                <el-form-item label="申请人中文名称:" prop="appCnName" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-autocomplete class="inline-input" :clearable='true' v-model="caseDetailFoemData.appCnName" @select="handleAppCnName" :fetch-suggestions="remotepinput" placeholder="请输入内容" :trigger-on-focus="true">-->
                    <!--                                    </el-autocomplete>-->

                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="fullRow">-->
                    <!--                              <el-col :span="24">-->
                    <!--                                <el-form-item label="申请人英文名称:" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-input v-model="caseDetailFoemData.appEnName">-->
                    <!--                                    </el-input>-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="">-->
                    <!--                              <el-col :span="12" v-if="caseTypeAndAppFromto">-->
                    <!--                                <el-form-item label="主体法律性质:" prop="legalNature" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.legalNature" filterable>-->
                    <!--                                      <el-option :label="item.typeName" :key="item.typeName" :value="item.typeName" v-for="item in applicantTypeList"></el-option>-->
                    <!--                                    </el-select>-->

                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                              <el-col :span="12" v-else>-->
                    <!--                                <el-form-item label="主体法律性质:" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.legalNature" filterable>-->
                    <!--                                      <el-option :label="item.typeName" :key="item.typeName" :value="item.typeName" v-for="item in applicantTypeList"></el-option>-->
                    <!--                                    </el-select>-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                              <el-col :span="12">-->
                    <!--                                <el-form-item label="国籍:" prop="appGJdq" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-select default-first-option @change="caseCochange" :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.appGJdq" filterable>-->
                    <!--                                      <el-option v-for="(item,key)  in selectData.country" :key="key" :label="item.countryCn" :value="item.countryCn">-->
                    <!--                                      </el-option>-->
                    <!--                                    </el-select>-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="fullRow" v-if="caseDetailFoemData.appGJdq == '中国'&&caseDetailFoemData.legalNature!='自然人'">-->
                    <!--                              <el-col :span="24" v-if="caseTypeAndAppFromto">-->
                    <!--                                <el-form-item prop="certCode" class="postInfo-container-item" label="统一社会信用代码:">-->
                    <!--                                  <template>-->
                    <!--                                    <el-input v-model="caseDetailFoemData.certCode" />-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                              <el-col :span="24" v-else>-->
                    <!--                                <el-form-item class="postInfo-container-item" label="统一社会信用代码:">-->
                    <!--                                  <template>-->
                    <!--                                    <el-input v-model="caseDetailFoemData.certCode" />-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="fullRow" v-show='caseDetailFoemData.appGJdq!="中国"'>-->
                    <!--                              <el-col :span="24">-->
                    <!--                                <el-form-item label="国家或地区:" class="postInfo-container-item">-->
                    <!--                                  <template>-->

                    <!--                                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.appCountryOrRegion" filterable>-->
                    <!--                                      <el-option v-for="(item,key)  in selectData.casecount" :key="key" :label="item.countryCn" :value="item.countryCn">-->
                    <!--                                      </el-option>-->
                    <!--                                    </el-select>-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="">-->
                    <!--                              <el-col :span="12">-->
                    <!--                                <el-form-item label="申请人中文地址:" prop="appCnAddr" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <Autocomplete v-model="caseDetailFoemData.appCnAddr" @select="appCnAddrChange" type="addressCn" :list="selectData.appaddr.filter(itm=>!!itm.addressCn)"> </Autocomplete>-->
                    <!--&lt;!&ndash;                                    <el-select :clearable="true" allow-create default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appCnAddr" @change="appCnAddrChange">&ndash;&gt;-->
                    <!--&lt;!&ndash;                                      <el-option :key="key" :label="item.addressCn" :value="item.addressCn" v-for="(item,key) in selectData.appaddr.filter(itm=>!!itm.addressCn)" />&ndash;&gt;-->
                    <!--&lt;!&ndash;                                    </el-select>&ndash;&gt;-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                              <el-col :span="12">-->
                    <!--                                <el-form-item label="申请人英文地址:" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-select :clearable="true" allow-create default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appEnAddr">-->
                    <!--                                      <el-option :key="key" :label="item.addressEn" :value="item.addressEn" v-for="(item,key) in selectData.appaddr.filter(itm=>!!itm.addressEn)" />-->
                    <!--                                    </el-select>-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                              <el-col :span="12" v-if="caseDetailFoemData.legalNature=='自然人'">-->
                    <!--                                <el-form-item label="证件名称:" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.appCertificate" filterable>-->
                    <!--                                      <el-option label="身份证" value="身份证"></el-option>-->
                    <!--                                      <el-option label="护照" value="护照"></el-option>-->
                    <!--                                      <el-option label="其他" value="其他"></el-option>-->
                    <!--                                    </el-select>-->

                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row  class="">-->
                    <!--                              <el-col :span="12">-->
                    <!--                              <el-form-item label="代理人姓名:" class="postInfo-container-item"  v-if="(['不予注册复审','商标注册','分割申请','异议','变名变址','转让/移转','续展','删减商品项目','变更注册申请代理机构','更正商标申请事项','注册驳回复审','国际注册驳回复审','撤销商标复审','异议答辩','撤三答辩(提供使用证明)','撤销通用名称答辩','参与不予注册复审','无效宣告答辩','撤销复审答辩','撤销三年停止使用申请','撤销成为通用名称注册商标','无效宣告申请','撤回商标评审','行政复议','许可备案','补发商标注册证','补发商标变转续证明','出具优先权证明文件','出具商标注册证明','商标注销','撤回商标申请'].includes(caseDetailFoemData.caseType))">-->
                    <!--                                <el-select allow-create default-first-option  :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.agentPerson" filterable>-->
                    <!--                                  <el-option v-for="(item,key)  in selectData.personList" :key="key" :label="item.fullname" :value="item.fullname">-->
                    <!--                                  </el-option>-->
                    <!--                                </el-select>-->
                    <!--                              </el-form-item>-->
                    <!--                            </el-col>-->
                    <!--                              <el-col :span="12" v-if="caseDetailFoemData.legalNature=='自然人'">-->
                    <!--                                <el-form-item label="证件号:" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-input v-model="caseDetailFoemData.appCertificateNum" placeholder=""></el-input>-->

                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="fullRow">-->
                    <!--                              <el-col :span="24">-->
                    <!--                                <el-form-item label="委托书:" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-button style="margin-left:10px;display: block" size="mini" type="primary" @click="getfileData('1000',$event)">上传</el-button>-->
                    <!--                                    <el-upload class="upload-btn" :before-remove="brforeRemoveFile" :on-success='fileUploadSuccess' :file-list="wtsfileList" :show-file-list='true' :action="fileUrl" name='attachFile' :data="fileData('1000')">-->
                    <!--                                    </el-upload>-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="fullRow" v-show="trademarkList.includes(caseDetailFoemData.caseType)">-->
                    <!--                              <el-col :span="24">-->
                    <!--                                <el-form-item label="证明文件是否为中文:" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-radio-group v-model="caseDetailFoemData.appCertFileIsCn">-->
                    <!--                                      <el-radio label='否'>否</el-radio>-->
                    <!--                                      <el-radio label='是'>���</el-radio>-->
                    <!--                                    </el-radio-group>-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="fullRow" v-if="!trademarkList.includes(caseDetailFoemData.caseType)">-->
                    <!--                              <el-col :span="24">-->
                    <!--                                <el-form-item label="上传文件的语言类型:" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-radio-group v-model="caseDetailFoemData.uploadFileLanguage">-->
                    <!--                                      <el-radio label='中文'></el-radio>-->
                    <!--                                      <el-radio label='外文'></el-radio>-->
                    <!--                                    </el-radio-group>-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="">-->
                    <!--                              <el-col :span="12" v-if="caseDetailFoemData.legalNature!='自然人'||(caseDetailFoemData.legalNature=='自然人'&&(caseDetailFoemData.appCertFileIsCn=='是'||caseDetailFoemData.uploadFileLanguage==='中文'))">-->
                    <!--                                <el-form-item label="主体资格证明文件（中文）:" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-input v-model="fileName[1003]"></el-input>-->
                    <!--                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1003',$event)">上传</el-button>-->
                    <!--                                    &lt;!&ndash;<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;:action="fileUrl" name='attachFile' :data="fileData('395')">&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;</el-upload>&ndash;&gt;-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                              <el-col v-if="(caseDetailFoemData.appCertFileIsCn=='否'||caseDetailFoemData.uploadFileLanguage==='外文')&&caseDetailFoemData.legalNature!='自然人'" :span="12">-->
                    <!--                                <el-form-item label="主体资格证明（英文）:" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-input v-model="fileName[1004]"></el-input>-->
                    <!--                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1004',$event)">上传</el-button>-->
                    <!--                                    &lt;!&ndash;<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;:action="fileUrl" name='attachFile' :data="fileData('396')">&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;</el-upload>&ndash;&gt;-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="">-->
                    <!--                              <el-col :span="12" v-if="caseDetailFoemData.legalNature=='自然人'">-->
                    <!--                                <el-form-item label="身份证明文件(中文):" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-input v-model="fileName[1001]"></el-input>-->
                    <!--                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1001',$event)">上传</el-button>-->
                    <!--                                    &lt;!&ndash;<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;:action="fileUrl" name='attachFile' :data="fileData('392')">&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;</el-upload>&ndash;&gt;-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                              <el-col v-if="(caseDetailFoemData.appCertFileIsCn=='否'||caseDetailFoemData.uploadFileLanguage==='外文')&&caseDetailFoemData.legalNature=='自然人'" :span="12">-->
                    <!--                                <el-form-item label="身份证明原文件(外文):" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-input v-model="fileName[1002]"></el-input>-->
                    <!--                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1002',$event)">上传</el-button>-->
                    <!--                                    &lt;!&ndash;<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;:action="fileUrl" name='attachFile' :data="fileData('394')">&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;</el-upload>&ndash;&gt;-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->

                    <!--                            <el-row class="fullRow">-->
                    <!--                              <el-col :span="24">-->
                    <!--                                <el-form-item label="联系人:" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-select ref="appContactPerson" allow-create default-first-option @change="contactSelectChange" :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.appContactPerson" filterable>-->
                    <!--                                      <el-option v-for="(item,key)  in selectData.queryAppContact" :key="key" :label="item.nameCn" :value="item.nameCn">-->
                    <!--                                      </el-option>-->
                    <!--                                    </el-select>-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="fullRow">-->
                    <!--                              <el-col :span="24">-->
                    <!--                                <el-form-item label="邮政编码:" prop="" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-input @mousewheel.native.prevent v-model="caseDetailFoemData.appContactZip" placeholder="" type="text">-->
                    <!--                                    </el-input>-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="fullRow">-->
                    <!--                              <el-col :span="24">-->
                    <!--                                <el-form-item label="电话:" prop="appContactTel" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-input v-model="caseDetailFoemData.appContactTel" placeholder=""></el-input>-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="fullRow">-->
                    <!--                              <el-col :span="24">-->
                    <!--                                <el-form-item label="邮箱:" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-input v-model="caseDetailFoemData.appContactEmail" placeholder=""></el-input>-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="fullRow">-->
                    <!--                              <el-col :span="24">-->
                    <!--                                <el-form-item class="postInfo-container-item" label="有关说明文件:">-->
                    <!--                                  <template>-->
                    <!--                                    <el-input :disabled="true" v-model="fileName[1020]" />-->
                    <!--                                    <el-button size="mini" style="margin-left:10px" type="primary" @click="getfileData('1020',$event)">上传</el-button>-->
                    <!--                                    &lt;!&ndash;<el-upload&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;:action="fileUrl"&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;:data="fileData('412')"&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;:on-success="fileUploadSuccess"&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;:show-file-list="false"&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;class="upload-btn"&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;name="attachFile"&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;&gt;&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;<el-button size="mini" style="margin-left:10px"&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;type="primary">上传&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;</el-button>&ndash;&gt;-->
                    <!--                                    &lt;!&ndash;</el-upload>&ndash;&gt;-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                            <el-row class="fullRow">-->
                    <!--                              <el-col :span="24">-->
                    <!--                                <el-form-item label="共同申请人:" class="postInfo-container-item">-->
                    <!--                                  <template>-->
                    <!--                                    <el-radio-group v-model="caseDetailFoemData.ifShareTm">-->
                    <!--                                      <el-radio label='0'>否</el-radio>-->
                    <!--                                      <el-radio label='1'>是</el-radio>-->

                    <!--                                    </el-radio-group>-->
                    <!--                                  </template>-->
                    <!--                                </el-form-item>-->
                    <!--                              </el-col>-->
                    <!--                            </el-row>-->
                    <!--                          </el-col>-->
                    <!--                        </el-row>-->
                    <!--                      </el-col>-->
                    <!--                    </el-row>-->
                    <el-row>
                      <el-col class="form-con-item" :span="24">
                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="申请人中文名称:" prop="appCnName" class="postInfo-container-item">
                                  <template>
                                    <el-autocomplete class="inline-input" :clearable='true' @select="handleAppCnName"
                                                     v-model="caseDetailFoemData.appCnName"
                                                     :fetch-suggestions="remotepinput" placeholder="请输入内容"
                                                     :clear="clearTmMessage" :trigger-on-focus="true">
                                    </el-autocomplete>

                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" v-if="caseTypeAndAppFromto">
                                <el-form-item label="主体法律性质:" prop="legalNature" class="postInfo-container-item">
                                  <template>
                                    <el-select default-first-option :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.legalNature" filterable @change="changeLegalNature">
                                      <el-option :label="item.typeName" :key="item.typeName" :value="item.typeName"
                                                 v-for="item in applicantTypeList"></el-option>
                                    </el-select>

                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" v-else>
                                <el-form-item label="主体法律性质:" class="postInfo-container-item">
                                  <template>
                                    <el-select default-first-option :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.legalNature" filterable @change="changeLegalNature">
                                      <el-option :label="item.typeName" :key="item.typeName" :value="item.typeName"
                                                 v-for="item in applicantTypeList"></el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="申请人英文名称:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.appEnName">
                                    </el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="国籍:" prop="appGJdq" class="postInfo-container-item">
                                  <template>
                                    <el-select default-first-option @change="caseCochange" :clearable='true'
                                               placeholder="请选择" v-model="caseDetailFoemData.appGJdq" filterable>
                                      <el-option v-for="(item,key)  in selectData.country" :key="key"
                                                 :label="item.countryCn" :value="item.countryCn">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="caseDetailFoemData.appGJdq=='中国'">
                              <el-col :span="24" class="long-input">
<!--                              省、市、区-->
                                <el-form-item label="申请人地址" class="postInfo-container-item" prop="addressGroup">
                                  <template>
                                    <el-select
                                      v-model="address.province"
                                      placeholder="请选择省"
                                      style="width: 120px; margin-right: 10px"
                                      @change="handleProvinceChange"
                                      filterable
                                      clearable
                                    >
                                      <el-option
                                        v-for="item in provinceList"
                                        :key="item.regionCode"
                                        :label="item.abbrName"
                                        :value="item.regionCode"
                                      />
                                    </el-select>
                                    <el-select
                                      v-model="address.city"
                                      placeholder="请选择市"
                                      style="width: 120px; margin-right: 10px"
                                      @change="handleCityChange"
                                      filterable
                                      clearable
                                      :disabled="!address.province"
                                    >
                                      <el-option
                                        v-for="item in cityList"
                                        :key="item.regionCode"
                                        :label="item.abbrName"
                                        :value="item.regionCode"
                                      />
                                    </el-select>
                                    <el-select
                                      v-model="address.district"
                                      placeholder="请选择区"
                                      style="width: 120px"
                                      @change="handleDistrictChange"
                                      filterable
                                      clearable
                                      :disabled="!address.city"
                                    >
                                      <el-option
                                        v-for="item in districtList"
                                        :key="item.regionCode"
                                        :label="item.abbrName"
                                        :value="item.regionCode"
                                      />
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="" >
                              <el-col :span="12" class="long-input">
                                <el-form-item label="申请人详细地址:" class="postInfo-container-item"
                                              :prop="noNeedTosubmit.includes(caseDetailFoemData.caseType)?'':'appCnAddr'">
                                  <template>
                                    <Autocomplete v-model="caseDetailFoemData.appCnAddr" @change="changeAppCnAddr" @select="appCnAddrChange"
                                                  type="addressCn"
                                                  :list="selectData.appaddr.filter(itm=>!!itm.addressCn)"></Autocomplete>
                                    <!--                                    <el-select :clearable="true" allow-create default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appCnAddr" @change="appCnAddrChange" ref="appCnAddr">-->
                                    <!--                                      <el-option :key="item.addrId" :label="item.addressCn" :value="item.addressCn" v-for="(item,key) in selectData.appaddr.filter(itm=>!!itm.addressCn)" />-->
                                    <!--                                    </el-select>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" v-show='caseDetailFoemData.appGJdq!="中国"'>
                                <el-form-item label="国家或地区:" class="postInfo-container-item">
                                  <template>

                                    <el-select default-first-option :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.appCountryOrRegion" filterable>
                                      <el-option v-for="(item,key)  in selectData.casecount" :key="key"
                                                 :label="item.countryCn" :value="item.countryCn">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12" class="long-input">
                                <el-form-item label="申请人英文地址:" class="postInfo-container-item">
                                  <template>
                                    <el-select :clearable="true" allow-create default-first-option filterable
                                               placeholder="请选择" v-model="caseDetailFoemData.appEnAddr">
                                      <el-option :key="key" :label="item.addressEn" :value="item.addressEn"
                                                 v-for="(item,key) in selectData.appaddr.filter(itm=>!!itm.addressEn)"/>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="身份证明文件名称:" :prop="appCertificateRequired?'appCertificate':''">
                                  <template v-if="caseDetailFoemData.legalNature!=='自然人'&&caseDetailFoemData.appGJdq!=='中国'">
                                    <el-input placeholder="" v-model="caseDetailFoemData.appCertificate" />
                                  </template>
                                  <template v-else>
                                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appCertificate">
                                      <el-option v-for="(item,index) in idTypeOptions" :key="index" :label="item.typeName" :value="item.typeName" />
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <template v-if="caseDetailFoemData.caseType==='变名变址'">
                              <el-row>
                                <el-col :span="24">
                                  <el-form-item label="国内申请人联系地址:" class="postInfo-container-item">
                                    <el-input v-model="caseDetailFoemData.appContactAddr" placeholder="请输入国内申请人联系地址" type="text"></el-input>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="24">
                                  <el-form-item label="国内申请人联系邮编:" class="postInfo-container-item">
                                    <el-input @mousewheel.native.prevent v-model="caseDetailFoemData.appContactPostCode" placeholder="请输入国内申请人联系邮编" type="text">
                                    </el-input>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                            </template>
                            <el-row class="">
                              <el-col :span="12">
                                <template v-if="['答复临时驳回/审查意见（境外）', '提供使用声明/证据（境外）','不予注册复审','商标注册','分割申请','异议','变名变址','转让/移转','续展','删减商品项目','变更注册申请代理机构','更正商标申请事项','注册驳回复审','国际注册驳回复审','撤销商标复审','异议答辩','撤三答辩(提供使用证明)','撤销通用名称答辩','参与不予注册复审','无效宣告答辩','撤销复审答辩','撤销三年停止使用申请','撤销成为通用名称注册商标','无效宣告申请','撤回商标评审','行政复议','许可备案','补发商标注册证','补发商标变转续证明','出具优先权证明文件','出具商标注册证明','商标注销','撤回商标申请'].includes(caseDetailFoemData.caseType)">
                                  <el-form-item label="代理人姓名:" class="postInfo-container-item"
                                              v-if="(caseDetailFoemData.replaceAgencyName && caseDetailFoemData.replaceAgencyName !== '北京佰舟知识产权代理有限公司' && ['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(caseDetailFoemData.whdAgencyName) && ['内-内', '外-内'].includes(caseDetailFoemData.appFromto))">
                                  <el-select default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.agentPerson" filterable>
                                    <el-option v-for="(item,key)  in agentPersonList" :key="key"
                                               :label="item" :value="item">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                                  <el-form-item label="代理人姓名:" class="postInfo-container-item"
                                              v-else-if="caseDetailFoemData.replaceAgencyName == '北京佰舟知识产权代理有限公司'">
                                  <el-select default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.agentPerson" filterable>
                                    <el-option v-for="(item, key)  in ['王莹', '刘骞', '刘敏']" :key="key"
                                               :label="item" :value="item">
<!--                                      <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                                <el-form-item label="代理人姓名:" class="postInfo-container-item"
                                              v-else>
                                  <el-select allow-create default-first-option :clearable='true' placeholder="请选择"
                                             v-model="caseDetailFoemData.agentPerson" filterable>
                                    <el-option v-for="(item,key)  in $store.getters.userList" :key="key"
                                               :label="item.fullname" :value="item.fullname">
                                      <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                                </template>
                              </el-col>
                              <el-col :span="12" v-if="caseDetailFoemData.appGJdq == '中国'&&caseDetailFoemData.legalNature!='自然人'">
                                <el-form-item prop="certCode" class="postInfo-container-item" label="统一社会信用代码:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.certCode"/>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" v-else>
                                <el-form-item
                                  class="postInfo-container-item"
                                  label="身份证明文件号码:"
                                  :prop="caseDetailFoemData.legalNature!=='自然人'&&caseDetailFoemData.appGJdq!=='中国'?'':'appCertificateNum'"
                                >
                                  <el-input v-model="caseDetailFoemData.appCertificateNum" />
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="12">
                                <el-form-item label="委托书:" class="postInfo-container-item">
                                  <template>
                                    <el-button style="margin-left:10px;display: block" size="mini" type="primary"
                                               @click="getfileData('1000',$event)">上传
                                    </el-button>
                                    <el-upload class="upload-btn" :before-remove="brforeRemoveFile"
                                               :on-success='fileUploadSuccess' :file-list="wtsfileList"
                                               :show-file-list='true' :action="fileUrl" name='attachFile'
                                               :data="fileData('1000')">
                                    </el-upload>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" style="font-size: 12px;color: #333">
                                <div style="padding: 10px">
                                  <div style="display: flex"><span class="el-icon-s-opportunity" style="font-size: 20px;color: #FFDF64"></span><div>委托书上传前核查风险点：</div></div>
                                  <div style="margin-left: 15px">
                                    <div>1.委托书上的申请人名称、地址信息是否正确（如XX集团和XX股份公司的委托书容易交错）</div>
                                    <div>2.委托书上客户盖章信息和申请人信息是否一致</div>
                                    <div>3.委托书形式是否正确（商标申请案件和评审案件委托书格式不同）</div>
                                    <div>4.委托书上勾选的委托事项、商标名称、类别是否填写正确</div>
                                  </div>
                                </div>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="trademarkList.includes(caseDetailFoemData.caseType)">
                              <el-col :span="24" v-if="['中国香港','中国台湾','中国澳门'].includes(caseDetailFoemData.appGJdq)">
                                <el-form-item label="证明文件是否为中文:" prop="appCertFileIsCn" class="postInfo-container-item">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.appCertFileIsCn">
                                      <el-radio label='否'>否</el-radio>
                                      <el-radio label='是'>是</el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>

                              </el-col>
                              <el-col :span="24" v-show="!['中国香港','中国台湾','中国澳门'].includes(caseDetailFoemData.appGJdq)">
                                <el-form-item label="证明文件是否为中文:" class="postInfo-container-item">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.appCertFileIsCn">
                                      <el-radio label='否'>否</el-radio>
                                      <el-radio label='是'>是</el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="!trademarkList.includes(caseDetailFoemData.caseType)">
                              <el-col :span="24">
                                <el-form-item label="上传文件的语言类型:" class="postInfo-container-item">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.uploadFileLanguage">
                                      <el-radio label='中文'></el-radio>
                                      <el-radio label='外文'></el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row v-if="caseDetailFoemData.appGJdq == '中国'&&caseDetailFoemData.legalNature == '自然人'">
                              <el-col :span=12>
                                <el-form-item class="postInfo-container-item" label="主体资格证明文件类型:">
                                  <el-select
                                    :clearable="true"
                                    default-first-option
                                    filterable
                                    placeholder="请选择"
                                    v-model="caseDetailFoemData.subjectCertType"
                                  >
                                    <el-option v-for="( item ) in certTypeOptions" :key="item.id" :label="item.typeName" :value="item.typeName"/>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span=12 v-if="caseDetailFoemData.subjectCertType === '个体工商户营业执照'">
                                <el-form-item prop="certCode" class="postInfo-container-item" label="统一社会信用代码:">
                                  <el-input v-model="caseDetailFoemData.certCode"/>
                                </el-form-item>
                              </el-col>
                              <el-col :span=12 v-else>
                                <el-form-item class="postInfo-container-item" label="统一社会信用代码:">
                                  <el-input v-model="caseDetailFoemData.certCode"/>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12"
                                      v-if="isShowSubjectFile">
                                <el-form-item label="主体资格证明文件（中文）:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1003]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1003',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('395')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col
                                v-if="isShowForeignFileUpload&&isShowSubjectFile"
                                :span="12">
                                <el-form-item label="主体资格证明（英文）:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1004]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1004',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('396')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12" v-if="caseDetailFoemData.legalNature=='自然人'">
                                <el-form-item label="身份证明文件(中文):" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1001]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1001',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('392')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col
                                v-if="isShowForeignFileUpload && caseDetailFoemData.legalNature=='自然人'"
                                :span="12">
                                <el-form-item label="身份证明原文件(外文):" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="fileName[1002]"></el-input>
                                    <el-button style="margin-left:10px" size="mini" type="primary"
                                               @click="getfileData('1002',$event)">上传
                                    </el-button>
                                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                                    <!--:action="fileUrl" name='attachFile' :data="fileData('394')">-->
                                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                                    <!--</el-upload>-->
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <el-row class="fullRow">
                              <el-col :span="24">
<!--                                <el-form-item v-if="['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(caseDetailFoemData.whdAgencyName) && ['内-内', '外-内'].includes(caseDetailFoemData.appFromto)" label="联系人:" class="postInfo-container-item">-->
<!--                                  <template>-->
<!--                                    <el-select ref="appContactPerson" default-first-option-->
<!--                                               @change="contactSelectChange" :clearable='true' placeholder="请选择"-->
<!--                                               v-model="caseDetailFoemData.appContactPerson" filterable>-->
<!--                                      <el-option v-for="(item,key)  in agentPersonList" :key="key"-->
<!--                                                 :label="item" :value="item">-->
<!--                                      </el-option>-->
<!--                                    </el-select>-->
<!--                                  </template>-->
<!--                                </el-form-item>-->
                                <el-form-item label="联系人:" class="postInfo-container-item">
                                  <template>
                                    <el-select ref="appContactPerson" allow-create default-first-option
                                               @change="contactSelectChange" :clearable='true' placeholder="请选择"
                                               v-model="caseDetailFoemData.appContactPerson" filterable>
                                      <el-option v-for="(item,key)  in selectData.queryAppContact" :key="key"
                                                 :label="item.nameCn" :value="item.nameCn">
                                      </el-option>
                                    </el-select>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="邮政编码" :prop="['内-内', '外-内'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.submitType === '网上申请' ? 'appContactZip' : ''" class="postInfo-container-item">
                                  <template>
                                    <el-input @mousewheel.native.prevent v-model="caseDetailFoemData.appContactZip"
                                              placeholder="" type="text">
                                    </el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="电话:" prop="appContactTel" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.appContactTel" placeholder=""></el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="邮箱:" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.appContactEmail" placeholder=""></el-input>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="有关说明文件:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[1020]"/>
                                    <el-button size="mini" style="margin-left:10px" type="primary"
                                               @click="getfileData('1020',$event)">上传
                                    </el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="共同申请人:" class="postInfo-container-item">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.ifShareTm" @change="changeIfShareTm">
                                      <el-radio label='0'>否</el-radio>
                                      <el-radio label='1'>是</el-radio>

                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row v-if="caseDetailFoemData.ifShareTm=='1'">
                      <el-col class="tilteSpan" :span="24">
                        <span id='-title'>其他申请人</span>
                      </el-col>
                    </el-row>
                    <el-row v-if="caseDetailFoemData.ifShareTm=='1'">
                      <el-col class="form-con-item" :span="24">
                        <el-row>
                          <el-col :span="24" style="text-align:right">

                            <el-button @click="dialogFormjoin=1" style="margin-left:10px" type="primary" size="mini">
                              添加
                            </el-button>
                          </el-col>
                        </el-row>
                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-table :data="caseDetailFoemData.joinApps.filter(item=>item.type!=4)" border
                                      current-row-key empty-text="暂无数据" fit highlight-current-row size="mini"
                                      style="width: 100%;">
                              <el-table-column align="left" label="序号" type="index" width="50"/>
                              <el-table-column align="left" label="中文名称" width>
                                <template slot-scope="scope">
                                  <span v-if="!scope.row.modifyState">{{ scope.row.nameCn }}</span>
                                  <el-input v-if="scope.row.modifyState" type="text"
                                            v-model="scope.row.nameCn"></el-input>
                                </template>
                              </el-table-column>
                              <el-table-column align="left" label="英文名称" width>
                                <template slot-scope="scope">
                                  <span v-if="!scope.row.modifyState">{{ scope.row.nameEn }}</span>
                                  <el-input v-if="scope.row.modifyState" type="text"
                                            v-model="scope.row.nameEn"></el-input>
                                </template>
                              </el-table-column>
                              <el-table-column align="left" label="中文地址" width>
                                <template slot-scope="scope">
                                  <span v-if="!scope.row.modifyState">{{ scope.row.addrCn }}</span>
                                  <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.addrCn"></el-input>
                                </template>
                              </el-table-column>
                              <el-table-column align="left" label="英文地址" width>
                                <template slot-scope="scope">
                                  <span v-if="!scope.row.modifyState">{{ scope.row.addrEn }}</span>
                                  <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.addrEn"></el-input>
                                </template>
                              </el-table-column>
                              <el-table-column align="left" label="上传文件的语言类型" width>
                                <template slot-scope="scope">
                                <span v-if="!scope.row.modifyState">
                                  <span v-if="scope.row.getFileIsEn === '是'">中文</span>
                                  <span v-if="scope.row.getFileIsEn === '否'">英文</span>
                                </span>
                                </template>
                              </el-table-column>
                              <el-table-column align="left" label="证件名称" width>
                                <template slot-scope="scope">
                                  <span v-if="!scope.row.modifyState">{{ scope.row.cardName }}</span>
                                  <el-input v-if="scope.row.modifyState" type="text"
                                            v-model="scope.row.cardName"></el-input>
                                </template>
                              </el-table-column>
                              <el-table-column align="left" label="证件号" width>
                                <template slot-scope="scope">
                                  <span v-if="!scope.row.modifyState">{{ scope.row.cardId }}</span>
                                  <el-input v-if="scope.row.modifyState" type="text"
                                            v-model="scope.row.cardId"></el-input>
                                </template>
                              </el-table-column>
                              <el-table-column align="left" label="证明文件" width>
                                <template slot-scope="scope">
                                  <p v-for="item in scope.row.materialArray">
                                    <a target="_blank" :href="`ipdoc${item.address}`">{{item.materialName}}</a>
                                  </p>
                                </template>
                              </el-table-column>

                              <el-table-column align="left" label="操作" width>
                                <template slot-scope="scope">
                                  <el-button @click="changeAppJoinState(scope.row,scope.$index)" type="text"
                                             size="mini">{{scope.row.modifyState?'保存':'修改'}}
                                  </el-button>
                                  <el-button @click="deljoinp(scope.row)" type="text" size="mini">删除</el-button>
                                </template>
                              </el-table-column>

                            </el-table>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </template>
                  <el-row v-if="caseDetailFoemData.appFromto=='内-外'||caseDetailFoemData.appFromto=='外-外'">
                    <el-col class="tilteSpan" :span="24">
                      <span id='out-title'>境外信息</span>
                    </el-col>
                  </el-row>
                  <el-row v-if="caseDetailFoemData.appFromto=='内-外'||caseDetailFoemData.appFromto=='外-外'">
                    <el-col class="form-con-item" :span="24">

                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item label="注册方式:" class="postInfo-container-item" prop="madrid" @change="changeElstepList">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.madrid">
                                    <el-radio :label='false'>逐一注册</el-radio>
                                    <el-radio :label='true'>马德里注册</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="注册国家:" class="postInfo-container-item" prop="appState">
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
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="外方代理所:" class="postInfo-container-item" :prop="caseDetailFoemData.madrid===false?'agencyCustId':''">
                                <template>
                                  <virtual-select placeholder="请选择" class="virtual-select" clearable :data="selectData.hzLists"
                                                  @change="wfAgentChange" v-model="caseDetailFoemData.agencyCustId"
                                                  filterable>
                                  </virtual-select>
<!--                                  <el-select :filter-method="filterHandler" default-first-option :clearable='true' @change="wfAgentChange" placeholder="请选择" v-model="caseDetailFoemData.agencyCustId" filterable>-->
<!--                                    <el-option v-for="(item,key)  in selectData.hzLists1" :key="key" :label="item.fullname" :value="item.custId">-->
<!--                                    </el-option>-->
<!--                                  </el-select>-->
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
                              <el-form-item label="外方代理所文号:" class="postInfo-container-item">
                                <template>
                                  <el-input v-model="caseDetailFoemData.agencyCustRefno" placeholder=""></el-input>

                                </template>
                              </el-form-item>
                        </el-col>
                      </el-row>
                          <el-row class="">
                            <el-col :span="24">
                              <el-form-item label="外方代理所地址:" style="width: 50%" class="postInfo-container-item">
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
                          <el-row  v-show="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.appState == '美国'">
                              <el-col :span="12">
                                <el-form-item label="第一次使用日期:" class="postInfo-container-item">
                                  <template>
                                    <el-date-picker v-model="caseDetailFoemData.firstUseDate" format='yyyy-MM-dd'
                                                    value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                                    :picker-options="pickerOptions">
                                    </el-date-picker>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="商业使用日期:" class="postInfo-container-item">
                                  <template>
                                    <el-date-picker v-model="caseDetailFoemData.businessUseDate" format='yyyy-MM-dd'
                                                    value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                                    :picker-options="pickerOptions">
                                    </el-date-picker>
                                  </template>
                                </el-form-item>
          </el-col>
        </el-row>
                          <template v-if="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.madrid">
                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="指定国注册号:" class="postInfo-container-item">
                                  <el-input v-model="caseDetailFoemData.zdRegNumber"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="指定国注册日:" class="postInfo-container-item">
                                  <template>
                                    <el-date-picker v-model="caseDetailFoemData.zdRegDate" format='yyyy-MM-dd'
                                                    value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                                    :picker-options="pickerOptions">
                                    </el-date-picker>
                                  </template>
                                </el-form-item>
      </el-col>
    </el-row>
                            <el-row>
                              <el-col :span="12">
                                <el-form-item label="指定国申请号:" class="postInfo-container-item">
                                  <el-input v-model="caseDetailFoemData.zdAppNumber"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label="指定国申请日:" class="postInfo-container-item">
                                  <template>
                                    <el-date-picker v-model="caseDetailFoemData.zdAppDate" format='yyyy-MM-dd'
                                                    value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                                    :picker-options="pickerOptions">
                                    </el-date-picker>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item label="时限内容:" class="postInfo-container-item">
                                <template>
                                  <el-input v-model="caseDetailFoemData.timeLimitContent" placeholder=""></el-input>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="时限日期:" class="postInfo-container-item">
                                <template>
                                  <el-date-picker v-model="caseDetailFoemData.limitDate" format='yyyy-MM-dd'
                                                  value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                                  :picker-options="pickerOptions">
                                  </el-date-picker>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item label="外代所报价:" class="postInfo-container-item">
                                <overseas-quotation
                                  ref="overseas"
                                  :case-id="caseDetailFoemData.caseId"
                                  :case-ids="mainCaseIds"
                                  v-if="caseDetailFoemData.caseId && currencyList.length"
                                  :currencyList="currencyList"
                                  type="edit"
                                  :priceData="caseDetailFoemData.agencyOffers"
                                  @addQuotationData="addQuotationData"
                                  @delQuotationData="delQuotationData">
                                </overseas-quotation>
                              </el-form-item>
                            </el-col>
                          </el-row>

                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>

                  <el-row
                    v-if="(caseDetailFoemData.appFromto=='内-外'||caseDetailFoemData.appFromto=='外-外')&&caseDetailFoemData.madrid==true">
                    <el-col class="tilteSpan" :span="24">
                      <span id='base-title'>基础注册信息</span>
                    </el-col>
                  </el-row>
                  <el-row
                    v-if="(caseDetailFoemData.appFromto=='内-外'||caseDetailFoemData.appFromto=='外-外')&&caseDetailFoemData.madrid==true">
                    <el-col class="form-con-item" :span="24">
                      <el-row>
                        <el-col :span="24" style="text-align:right">

                          <el-button @click="addMDL" style="margin-left:10px" type="primary" size="mini">
                            添加
                          </el-button>
                        </el-col>
                      </el-row>
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-table size="mini" :data="caseDetailFoemData.trademarkCaseBasicinfos" border fit
                                    empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                            <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                            <el-table-column label="基础注册/申请号" align="left" width>
                              <template slot-scope="scope">

                                <el-input size="small" v-model="scope.row.regNumber" placeholder=""></el-input>
                              </template>
                            </el-table-column>
                            <el-table-column label="基础注册/申请日" align="left" width>
                              <template slot-scope="scope">

                                <el-date-picker size="small" v-model="scope.row.regDate" format='yyyy-MM-dd'
                                                value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                                :picker-options="pickerOptions">
                                </el-date-picker>
                              </template>
                            </el-table-column>

                            <el-table-column label="操作" align="left" width>
                              <template slot-scope="scope">
                                <el-button @click="delMDL(scope.$index)" type="text" size="mini">删除</el-button>
                              </template>
                            </el-table-column>

                          </el-table>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <template v-if="caseDetailFoemData.custName&&caseDetailFoemData.custName.includes('阿里')">
                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="ali-title">阿里月报信息</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="form-con-item">
                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row>
                              <el-col :span="8">
                                <el-form-item label="品牌层级:" class="postInfo-container-item">
                                  <el-select default-first-option :clearable='true' placeholder="请选择" allow-create
                                             v-model="caseDetailFoemData.brandHierarchy" filterable>
                                    <el-option v-for="(item,key)  in brandHierarchyList" :key="key"
                                               :label="item.typeName" :value="item.typeName">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item label="风险类型:" class="postInfo-container-item">
                                  <el-select default-first-option :clearable='true' placeholder="请选择" allow-create
                                             v-model="caseDetailFoemData.riskType" filterable>
                                    <el-option v-for="(item,key)  in riskTypeList" :key="key"
                                               :label="item.typeName" :value="item.typeName">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item label="风险等级:" class="postInfo-container-item">
                                  <el-select default-first-option :clearable='true' placeholder="请选择" allow-create
                                             v-model="caseDetailFoemData.riskLevel" filterable>
                                    <el-option v-for="(item,key)  in riskLevelList" :key="key"
                                               :label="item.typeName" :value="item.typeName">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="备注(关联案件说明):" class="postInfo-container-item">
                                  <el-input v-model="caseDetailFoemData.aliRemarks" type="textarea" rows="3"
                                            placeholder=""></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </template>
                </div>

              </div>

  </el-form>

          </el-tab-pane>
          <el-tab-pane label="特殊指示" name="second" v-if="!caseDetailFoemData.usAgency">

            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span id='tszs-custzs'>特殊指示-案件指示</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="form-con-item" :span="24">
                <SpecialInstructions label="案件特殊指示" type="view"
                                     :data="{custFullNameString:caseDetailFoemData.custName,customerRequirementBillList:custReqCases}"></SpecialInstructions>
                <!--                <el-row class="form-border">-->
                <!--                  <el-col :span="24">-->
                <!--                    <el-table size="mini" :data="custReqCases" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
                <!--                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
                <!--                      <el-table-column label="客户" align="left" width='150'>-->
                <!--                        <template slot-scope="scope">-->
                <!--                          <span>{{ scope.row.fullname }}</span>-->
                <!--                        </template>-->
                <!--                      </el-table-column>-->
                <!--                      <el-table-column label="申请人" align="left" width='150'>-->
                <!--                        <template slot-scope="scope">-->
                <!--                          <span>{{ scope.row.applicantName }}</span>-->
                <!--                        </template>-->
                <!--                      </el-table-column>-->
                <!--                      <el-table-column label="案件特殊指示" align="left" width>-->
                <!--                        <template slot-scope="scope">-->
                <!--                          <span>{{ scope.row.specialInfo }}</span>-->
                <!--                        </template>-->
                <!--                      </el-table-column>-->

                <!--                    </el-table>-->
                <!--                  </el-col>-->
                <!--                </el-row>-->
              </el-col>
            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span id='tszs-billzs'>特殊指示-账单指示</span>
                <!--<caseBill :billData='caseDetailFoemData'></caseBill>-->
              </el-col>
            </el-row>
            <el-row>
              <SpecialInstructions type="view"
                                   :data="{custFullNameString:caseDetailFoemData.custName,customerRequirementBillList:custReqBills}"></SpecialInstructions>

              <!--              <el-col class="form-con-item" :span="24">-->
              <!--                <el-row class="form-border">-->
              <!--                  <el-col :span="24">-->
              <!--                    <el-table size="mini" :data="custReqBills" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
              <!--                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
              <!--                      <el-table-column label="客户" align="left" width='150'>-->
              <!--                        <template slot-scope="scope">-->
              <!--                          <span>{{ scope.row.fullname }}</span>-->
              <!--                        </template>-->
              <!--                      </el-table-column>-->
              <!--                      <el-table-column label="申请人" align="left" width='150'>-->
              <!--                        <template slot-scope="scope">-->
              <!--                          <span>{{ scope.row.applicantName }}</span>-->
              <!--                        </template>-->
              <!--                      </el-table-column>-->
              <!--                      <el-table-column label="案件特殊指示" align="left" width>-->
              <!--                        <template slot-scope="scope">-->
              <!--                          <span>{{ scope.row.specialInfo }}</span>-->
              <!--                        </template>-->
              <!--                      </el-table-column>-->

              <!--                    </el-table>-->
              <!--                  </el-col>-->
              <!--                </el-row>-->
              <!--              </el-col>-->
            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span id='-title'>客户活动</span>
                <!--<caseBill :billData='caseDetailFoemData'></caseBill>-->
              </el-col>
            </el-row>
            <el-row>
              <SpecialInstructions v-for="(item, index) in custActivityList" :id="'tszs-hd' + index" :key="index" type="view" :label="item.actType"
                                   :data="{custFullNameString:caseDetailFoemData.custName,customerRequirementBillList:item.custActivity}"></SpecialInstructions>

            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span id='tszs-require'>客户个案要求</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="form-con-item" :span="24">
                <el-row class="form-border">
                  <el-col :span="24">
                    <el-row class="fullRow">
                      <el-col :span="24">
                        <div label="客户个案要求:" class="postInfo-container-item">
                          <template>
                            <el-input type="textarea" :rows="3" v-model="caseDetailFoemData.instructions"
                                      placeholder="请输入">
                            </el-input>

                          </template>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="办案人" name="third">
            <CaseInvestigators :caseDetailData='caseDetailFoemData' :isEdit="true" @workGroup="workGroup" @caseRoleSelectList="(v)=>{caseRoleSelectList = v}"
                               v-if="activeName==='third'" :prePage="prePage"></CaseInvestigators>
          </el-tab-pane>
          <el-tab-pane label="账单费用" name="fourth">
            <caseBill v-if="caseDetailFoemData.caseId" :billData='caseDetailFoemData'></caseBill>
          </el-tab-pane>
          <el-tab-pane label="案件进展" name="Fifth">
            <ElectronicArchives
              :searchFanweiList="caseDetailFoemData.searchFanweiList"
              :usAgency="caseDetailFoemData.usAgency"
              v-if="caseDetailFoemData.caseId&&activeName=='Fifth'"
              :caseTypeId="caseDetailFoemData.caseTypeId"
              :caseDetailFoemData="caseDetailFoemData"
                                :caseEvolve="caseDetailFoemData.caseEvolve" :isEdit="true"
                                :agentNum="caseDetailFoemData.agentNum" :curCaseId="caseDetailFoemData.caseId" :caseIds="mainCaseIds"
                                :custId="caseDetailFoemData.custId"></ElectronicArchives>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col v-if="caseDetailFoemData.caseType" :span="4">
        <div style="height: 520px;position: fixed;top:20%;right:2%">
          <el-steps :space="200" :active="stepActive1" direction="vertical">
            <el-step v-for="(item,index) in elstepList" :title="item.title"
                     @click.native="getTopPosition(item.id,index)" v-if="item.state"></el-step>
          </el-steps>
        </div>
      </el-col>

    </el-row>
    <el-dialog :show-close="false" :close-on-click-modal="false" title="共同申请人" :visible.sync="formatDialogFormjoin"
               width="80%">
      <el-form ref="" :model="joinFormData" label-width="180px" label-position="left" size="mini" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="">
              <el-col :span="12">
                <el-form-item label="主体法律性质:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择"
                               v-model="joinFormData.joinAppType" filterable>
                      <el-option label="法人或其它组织" value="法人或其它组织"></el-option>
                      <el-option label="自然人" value="自然人"></el-option>
                    </el-select>

                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="书式类型:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择"
                               v-model="joinFormData.joinAppCoun" filterable>
                      <el-option label="中国大陆" value="中国大陆"></el-option>
                      <el-option label="国外" value="国外"></el-option>
                      <el-option label="中国台湾" value="中国台湾"></el-option>
                      <el-option label="中国香港" value="中国香港"></el-option>
                      <el-option label="中国澳门" value="中国澳门"></el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                <el-form-item label="共有人中文名称:" class="postInfo-container-item">
                  <el-autocomplete class="inline-input" :clearable='true' @select="handleSelect"
                                   v-model="joinFormData.nameCn" :fetch-suggestions="remoteMethodApp"
                                   placeholder="请输入内容" :trigger-on-focus="true">
                  </el-autocomplete>
                  <!--                  <template>-->
                  <!--                    <el-input v-model="joinFormData.nameCn" placeholder=""></el-input>-->
                  <!--                  </template>-->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" v-if="joinFormData.joinAppCoun=='国外'">
               	<el-form-item label="共有人英文名称:" class="postInfo-container-item">
                  <template>
                    <el-input v-model="joinFormData.nameEn" placeholder=""></el-input>

                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="" v-if="!trademarkList.includes(caseDetailFoemData.caseType)">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" label="共有人中文地址:">
                  <template>
                    <el-input placeholder="" v-model="joinFormData.addrCn"/>

                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="" v-if="!trademarkList.includes(caseDetailFoemData.caseType)">
              <el-col :span="24" v-if="joinFormData.joinAppCoun=='国外'">
                <el-form-item class="postInfo-container-item" label="共有人英文地址:">
                  <template>
                    <el-input placeholder="" v-model="joinFormData.addrEn"/>

                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="" v-if="joinFormData.joinAppType=='自然人'">
              <el-col :span="12">
                <el-form-item class="postInfo-container-item" label="证件名称:">
                  <template>
                    <el-select :clearable="true" default-first-option filterable placeholder="请选择"
                               v-model="joinFormData.cardName">
                      <el-option label="身份证" value="身份证"/>
                      <el-option label="护照" value="护照"/>
                      <el-option label="其他" value="其他"/>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="postInfo-container-item" label="证件号:">
                  <template>
                    <el-input placeholder="" v-model="joinFormData.cardId"/>

                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="证明文件是否为中文:" class="postInfo-container-item"
                              v-if="['答复临时驳回/审查意见（境外）', '分割申请','商标注册','提供使用声明/证据（境外）'].includes(caseDetailFoemData.caseType)">
                  <template>
                    <el-radio-group v-model="joinFormData.getFileIsEn">
                      <el-radio label='否'>否</el-radio>
                      <el-radio label='是'>是</el-radio>
                    </el-radio-group>
                  </template>
                </el-form-item>
                <el-form-item class="postInfo-container-item" label="上传文件的语言类型:" v-else>
                  <template>
                    <el-radio-group v-model="joinFormData.getFileIsEn">
                      <el-radio label="是">中文</el-radio>
                      <el-radio label="否">外文</el-radio>
                    </el-radio-group>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="12" v-if="joinFormData.joinAppType=='自然人'">
                <el-form-item label="身份证明文件:" class="postInfo-container-item">
                  <template>
                    <el-input v-model="joinFormData.materialArray && joinFormData.materialArray.find(item => item.materialTypeId == 1037) && joinFormData.materialArray.find(item => item.materialTypeId == 1037).materialName" disabled></el-input>

                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1037',$event)">
                      上传
                    </el-button>
                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                    <!--:action="fileUrl" name='attachFile' :data="fileData('434')">-->
                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                    <!--</el-upload>-->
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="joinFormData.joinAppType=='自然人'&&joinFormData.getFileIsEn=='否'">
                <el-form-item label="身份证明文件(外文):" class="postInfo-container-item">
                  <template>
                    <el-input v-model="joinFormData.materialArray && joinFormData.materialArray.find(item => item.materialTypeId == 1038) && joinFormData.materialArray.find(item => item.materialTypeId == 1038).materialName" disabled></el-input>
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1038',$event)">
                      上传
                    </el-button>
                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                    <!--:action="fileUrl" name='attachFile' :data="fileData('435')">-->
                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                    <!--</el-upload>-->
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="12" v-if="joinFormData.joinAppType!='自然人'">
                <el-form-item label="主体资格证明文件:" class="postInfo-container-item">
                  <template>
                    <el-input v-model="joinFormData.materialArray && joinFormData.materialArray.find(item => item.materialTypeId == 1039) && joinFormData.materialArray.find(item => item.materialTypeId == 1039).materialName" disabled></el-input>
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1039',$event)">
                      上传
                    </el-button>
                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                    <!--:action="fileUrl" name='attachFile' :data="fileData('436')">-->
                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                    <!--</el-upload>-->
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="joinFormData.joinAppType!='自然人'&&joinFormData.getFileIsEn=='否'">
                <el-form-item label="主体资格证明文件(外文):" class="postInfo-container-item">
                  <template>
                    <el-input v-model="joinFormData.materialArray && joinFormData.materialArray.find(item => item.materialTypeId == 1040) && joinFormData.materialArray.find(item => item.materialTypeId == 1040).materialName" disabled></el-input>
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1040',$event)">
                      上传
                    </el-button>
                    <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
                    <!--:action="fileUrl" name='attachFile' :data="fileData('437')">-->
                    <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
                    <!--</el-upload>-->
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deljoinBtn">
          取消
        </el-button>
        <el-button type="primary" @click="addjionP">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="重名检查" :visible.sync="dialogFormTmCm" width="70%" @open="cmDialogShow">

      <el-row class="tmCmsearch">

        <el-col :span="12" style='float:right;margin-bottom:10px'>
          <el-input placeholder="请输入内容" v-model="selectTmSearchInput" class="input-with-select">

            <el-button slot="append" @click="getCmtmdata('seach')" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="24" style="padding-left:40px;margin-bottom:10px">
          <el-checkbox :indeterminate="isIndeterminategoodClass" v-model="checkAllgoodClass"
                       @change="handleCheckAllgoodClassChange">全选
          </el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedgoodClass" @change="handleCheckedgoodClassChange">
            <el-checkbox style="width:30px" v-for="goodclass in allgoodClass" :label="goodclass" :key="goodclass">
              {{goodclass}}
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="24">
          <el-table size="mini" :data="sameTmdata" border fit empty-text="暂无数据" highlight-current-row current-row-key
                    style="width: 100%;">
            <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
            <el-table-column label="商标图样" align="left" width>
              <template slot-scope="scope">
                <img style="width:100px;height:100px" :src="`/tmFile${scope.row.imgFilePath}`">
              </template>
            </el-table-column>
            <el-table-column label="商标名称" align="left" width>
              <template slot-scope="scope">
                <span>{{ scope.row.tmName }}</span>

              </template>
            </el-table-column>
            <el-table-column label="申请/注册号" align="left" width>
              <template slot-scope="scope">
                <span>{{ scope.row.regNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商标类别" align="left" width>
              <template slot-scope="scope">
                <span>{{ scope.row.tmType }}</span>
              </template>
            </el-table-column>
            <el-table-column label="申请人" align="left" width>
              <template slot-scope="scope">
                <span>{{ scope.row.applicantName }}</span>
              </template>
            </el-table-column>

            <el-table-column label="申请时间" align="left" width>
              <template slot-scope="scope">
                <span>{{ scope.row.approvalDate }}</span>
              </template>
            </el-table-column>

          </el-table>
          <pagination v-show="sameTmdatatotal>0" :total="sameTmdatatotal" :page.sync="sameSenddata.pageNo"
                      :limit.sync="sameSenddata.pageSize" @pagination="getCmtmdata"/>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">

        <el-button type="primary" @click="dialogFormTmCm=false">
          取消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="选择商标类别" @open="goodsDialogShow" :visible.sync="dialogFormgoods"
               width="70%">
      <el-dialog width="30%" title="保存方案" :visible.sync="innerVisible" style='text-align:center' append-to-body>
        <el-input v-model="planName" placeholder="请填写方案名称"></el-input>

        <div slot="footer" class="dialog-footer">

          <el-button @click="innerVisible=false">
            取消
          </el-button>
          <el-button @click="siveGoodsPlanBtn" type="primary">
            确定
          </el-button>
        </div>
      </el-dialog>
      <el-form ref="creatwfconForm" label-width="180px" :model="caseDetailFoemData" label-position="left" size="small"
               style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="选择方式:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' @change="planselectchange" placeholder="请选择"
                               v-model="goodsSelectPlan" filterable>
                      <el-option label="智能推荐" value="1"></el-option>
                      <el-option label="选择已有方案" value="0"></el-option>
                      <el-option label="自助选择" value="2"></el-option>
                      <el-option label="手动填写" value="3"></el-option>
                      <el-option label="复制导入" value="4"></el-option>
                      <el-option label="execl导入" value="5"></el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="goodsSelectPlan=='0'">
              <el-col :span="24">
                <el-form-item label="选择已有方案:" class="postInfo-container-item">
                  <template>

                    <el-select default-first-option @change="goodsPlanselectChange" v-model="goodsPlan"
                               placeholder="请选择">
                      <el-option v-for="(item,key)  in selectData.goodsPlanselect" :key="key" :label="item.planName"
                                 :value="item.planId">
                        <span style="float: left">{{ item.planName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px"><i class="el-icon-close"
                                                                                       @click="delPlan(item.planId)"></i></span>
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="text-align: right;margin-top:10px">
                <el-table size="mini" :data="pageGoods" border fit empty-text="暂无数据" highlight-current-row
                          current-row-key style="width: 100%;">
                  <el-table-column label="商品类别" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodClass }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品类似群组" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.similarGroup }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品代码" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodCode }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品中文名称" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品英文名称" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodEnName }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" align="left" width>
                    <template slot-scope="scope">
                      <el-button @click="delgood(scope.row)" type="text">删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
                <pagination v-show="goodslistPageData.total>0" :total="goodslistPageData.total"
                            :page.sync="goodslistPageData.pageNo" :limit.sync="goodslistPageData.pageSize"
                            @pagination="getgoodsList(caseDetailFoemData.goods)"/>
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="goodsSelectPlan=='1'">
              <el-col :span="24">
                <el-form-item label="选择领域:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' @change="zngoodChange" placeholder="请选择"
                               v-model="zngood" filterable>
                      <el-option v-for="(value, key, index) in selectData.goodszn" :key="index" :label="key"
                                 :value="value">
                      </el-option>

                    </el-select>
                    <el-select default-first-option style="margin-left:10px" @change="zngoodChangeb" :clearable='true'
                               placeholder="请选择" v-model="zngoodb" filterable>
                      <el-option v-for="(item,key) in selectData.goodsznselect" :key="key" :label="item.type2"
                                 :value="item.id"></el-option>

                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="text-align: right;margin-top:10px">
                <el-table size="mini" :data="pageGoods" border fit empty-text="暂无数据" highlight-current-row
                          current-row-key style="width: 100%;">

                  <el-table-column label="商品类别" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodClass }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品类似群组" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.similarGroup }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品代码" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodCode }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品中文名称" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品英文名称" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodEnName }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" align="left" width>
                    <template slot-scope="scope">
                      <el-button @click="delgood(scope.row)" type="text">删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
                <pagination v-show="goodslistPageData.total>0" :total="goodslistPageData.total"
                            :page.sync="goodslistPageData.pageNo" :limit.sync="goodslistPageData.pageSize"
                            @pagination="getgoodsList(caseDetailFoemData.goods)"/>
              </el-col>
            </el-row>
            <el-row class="" v-if="goodsSelectPlan=='2'">
              <el-col :span="24">
                <el-row style="height:600px">
                  <el-col :span="6" style="overflow: auto; padding:10px 10px;border-right:1px solid #ddd;height:100%;">

                    <el-input style="width:64%" v-model="filterText" size="mini" placeholder="请输入搜索内容"></el-input>
                    <el-button @click="searchGoods" style="margin-left:0px" type="primary" icon="el-icon-search"
                               size="mini">
                    </el-button>
                    <!-- <el-button @click="filterText=''" style="margin-left:0px" type="primary" icon="el-icon-refresh"
                      size="mini">
                    </el-button> -->
                    <el-tree :filter-node-method="filterNode" show-checkbox accordion class="filter-tree" node-key="id"
                             :data="goodsData" :props="goodsTreeProps" :default-expand-all='false' ref="goodstree">
                    </el-tree>
                  </el-col>
                  <el-col :span="1" style="padding:0px 0px;height:100%;line-height:600px;border-right:1px solid #ddd;">
                    <el-button @click="addGoods" style="margin-left:0px" type="primary" icon="el-icon-d-arrow-right"
                               size="mini">
                    </el-button>
                  </el-col>
                  <el-col :span="17" style=" overflow: auto;padding:10px 10px;height:100%;border-right:1px solid #ddd;">
                    <el-table size="mini" :data="pageGoods" border fit empty-text="暂无数据" highlight-current-row
                              current-row-key style="width: 100%;">

                      <el-table-column label="商品类别" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.goodClass }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="商品类似群组" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.similarGroup }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="商品代码" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.goodCode }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="商品中文名称" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.goodName }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="商品英文名称" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.goodEnName }}</span>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" align="left" width>
                        <template slot-scope="scope">
                          <el-button @click="delgood(scope.row)" type="text">删除</el-button>
                        </template>
                      </el-table-column>

                    </el-table>
                    <pagination v-show="goodslistPageData.total>0" :total="goodslistPageData.total"
                                :page.sync="goodslistPageData.pageNo" :limit.sync="goodslistPageData.pageSize"
                                @pagination="getgoodsList(caseDetailFoemData.goods)"/>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="goodsSelectPlan=='3'">
              <el-col :span="24">
                <el-form-item label="商品信息:" class="postInfo-container-item">
                  <template>
                    <el-input type="textarea" :rows="4" placeholder="商品名称以回车分隔。" v-model="jyText">
                    </el-input>
                    <el-button @click="jyGoods" type="primary" style="margin-top:10px">
                      校验信息
                    </el-button>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="text-align: right;margin-top:10px">
                <el-table size="mini" :row-class-name="tableRowClassName" :data="pageGoods" border fit empty-text="暂无数据"
                          highlight-current-row current-row-key style="width: 100%;">

                  <el-table-column label="商品类别" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodClass }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品类似群组" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.similarGroup }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品代码" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodCode }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品中文名称" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品英文名称" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodEnName }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" align="left" width>
                    <template slot-scope="scope">
                      <el-button @click="delgood(scope.row)" type="text">删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
                <pagination v-show="goodslistPageData.total>0" :total="goodslistPageData.total"
                            :page.sync="goodslistPageData.pageNo" :limit.sync="goodslistPageData.pageSize"
                            @pagination="getgoodsList(caseDetailFoemData.goods)"/>
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="goodsSelectPlan=='4'">
              <el-col :span="24">
                <el-form-item label="案卷号:" class="postInfo-container-item">
                  <template>
                    <el-input v-model="goodsCaseNumber" placeholder="请输入需要导入的案卷号"></el-input>
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getGoodsBycaseNumber">导入
                    </el-button>
                  </template>
                </el-form-item>

              </el-col>
              <el-col :span="24" style="text-align: right;margin-top:10px">
                <el-table size="mini" :data="pageGoods" border fit empty-text="暂无数据" highlight-current-row
                          current-row-key style="width: 100%;">

                  <el-table-column label="商品类别" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodClass }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品类似群组" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.similarGroup }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品代码" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodCode }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品中文名称" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品英文名称" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodEnName }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" align="left" width>
                    <template slot-scope="scope">
                      <el-button @click="delgood(scope.row)" type="text">删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
                <pagination v-show="goodslistPageData.total>0" :total="goodslistPageData.total"
                            :page.sync="goodslistPageData.pageNo" :limit.sync="goodslistPageData.pageSize"
                            @pagination="getgoodsList(caseDetailFoemData.goods)"/>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="siveGoodsPlan">
          保存方案
        </el-button>
        <el-button @click="goodsDialogqx">
          取消
        </el-button>
        <el-button @click="dialogFormgoods=false" type="primary">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-row style="margin-bottom:50px">
      <el-col :span="24" style="text-align:center">
<!--        <el-button size="medium" style="margin-right:10px" type="primary" @click="submitCaseForm(undefined,$route.query.flag == 'noCheck' ? 0 : 1)">保存</el-button>-->
        <el-button size="medium" style="margin-right:10px" type="primary" v-throttle="[()=>submitCaseForm(undefined,$route.query.flag == 'noCheck' ? 0 : 1)]">保存</el-button>
        <el-button size="medium" v-if="$route.query.pageId&&curCustLevel&&!isYunFen&&!(caseDetailFoemData.agentNum&&caseDetailFoemData.agentNum.includes('TM'))" style="margin-right:10px"
                   type="primary" v-throttle="[()=>creatCaseForm(1)]">立卷
        </el-button>
        <el-dropdown trigger="click" placement="top" @command="filingOperation"
                     v-if="($route.query.pageId&&!curCustLevel||isYunFen)&&!(caseDetailFoemData.agentNum&&caseDetailFoemData.agentNum.includes('TM'))" style="margin-right:10px">
          <el-button type="primary" :disabled="filingOperationState">
            立卷<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="prefiling">预立卷审批</el-dropdown-item>
            <el-dropdown-item command="createBills">创建账单</el-dropdown-item>
            <el-dropdown-item command="lowCreditAudit">低信用审核</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" @click="goNext()" size="medium">取消</el-button>
      </el-col>
    </el-row>
    <DataUploadOrSelect :caseDetailFoemData="caseDetailFoemData" :dialogVisible="DataUploadOrSelectState" :fileName="fileName" :fileData="fileData1"
                        :title="curUploadTitle" :wtsfileList="$commonUtils.unique(multipleFileList, 'materialId')" @getResponseAndFile="getResponseAndFile"
                        :clientState="clientState" @closedialogVisible="DataUploadOrSelectState=false"
                        @deleteCaseMaterial="deleteFile"></DataUploadOrSelect>
    <el-dialog
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
      <poppingTimeLimit v-if="poppingTimeLimitState" disabled @cancel="closePoppingTimeLimit"
                        :list="caseData"></poppingTimeLimit>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryCaseInfoUrl,
  GSQQueryAllClassUrl,
  saveCaseInfoUrl,
  queryCountry,
  queryCustomerContactByCustIdUrl,
  queryAppInfoUrl,
  queryAppContactUrl,
  queryCustomerReqUrl,
  queryUserNames,
  queryRoleNames,
  queryCaseWorkgroupUrl,
  queryListByUrl,
  queryGoodsPlanUrl,
  queryGoodsUrl,
  oneKeyZipUrl,
  heighCreditUrl,
  queryCustomerList,
  queryCustomerUrl,
  checkForbidContentUrl,
  checkSameTmUrl,
  addGoodsPlanUrl,
  queryGoodsByAgentNumUrl,
  cradeJoinAppUrl,
  delJoinAppUrl,
  GSQAllcategoryUrl,
  GSQCategoryUrl,
  deleteGoodsPlanUrl,
  delCaseMaterialUrl,
  queryCountryCaseUrl,
  queryAppAddrByAppIdUrl,
  queryCustomerContactByCustContactIdUrl,
  queryOtherCustomerListUrl,
  queryReplaceAgencyName,
  checkImageInstruction,
  queryReginList,
  splitAddress
} from "@/api/caseDetail";
  import {getUser} from "@/api/user"
  import {
    tmdetail,
    queryAgencyName,
    queryAlltask,
    modifyjoinapp,
    createCode,
    queryCustomerNameId,
    getCaseTime
  } from "@/api/caseList";
  import serviceApi from "@/api/serviceApi.config.js";
  import {mapGetters} from "vuex";
  import ChangeOfNameAndAddress from "./ChangeOfNameAndAddress";
  import trademarkTable from "./trademarkTable.vue";
  import {scrollTo} from "@/utils/scroll-to";
import { querycustSelectClass, queryCustGroup, searchTmUrl, queryCaseAppExamine } from '@/api/customerList.js'
  import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
  import DataUploadOrSelect from "@/components/DataUploadOrSelect";
  import ElectronicArchives from "@/views/workbench/case/components/ElectronicArchives.vue";
  import CaseBill from "@/views/workbench/case/components/CaseBill.vue";
  import Goods from "./Goods";
  import CaseInvestigators from "@/views/workbench/case/components/CaseInvestigators.vue";
  import {billSubmitUrl, billDiscount} from "@/api/billApi";
import { debounce, fomat_qh, getLanglist, isInputAll } from '../../../../utils'
  import {queryAllUrl} from "@/api/applicant";
  import SpecialInstructions from '@/views/workbench/finance/billviews/components/SpecialInstructions'
  import poppingTimeLimit from '@/views/workbench/toDoTasks/poppingTimeLimit.vue'
  import BreadCrumbCase from './BreadCrumbCase'
  import CustomerTree from '@/components/CustomerTree'
  import { MessageBox } from 'element-ui'

  const goodClasses = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45"
  ];
  const mockProjectTreeData = [
    {
      id: 'project-1',
      label: '重点客户项目',
      children: [
        {
          id: 'project-1-1',
          label: '商标注册推进',
          children: [
            {
              id: 'project-1-1-1',
              label: '华东区域'
            },
            {
              id: 'project-1-1-2',
              label: '华南区域'
            }
          ]
        },
        {
          id: 'project-1-2',
          label: '异议答辩专项'
        }
      ]
    },
    {
      id: 'project-2',
      label: '品牌保护项目',
      children: [
        {
          id: 'project-2-1',
          label: '维权监测'
        },
        {
          id: 'project-2-2',
          label: '证据固化'
        }
      ]
    },
    {
      id: 'project-3',
      label: '年度续展计划'
    }
  ];
  import {creatematerialUrl} from "@/api/serviceApi.config.js";
  import {queryWorkGroup} from "../../../../api/systemList";
  import {queryAgentPerson} from "../../../../api/caseDetail";
  import OverseasQuotation from "./OverseasQuotation";
  import {queryCurrencyUrl} from "../../../../api/billApi";
  import CheckGoodsList from "./CheckGoodsList";
  import {queryImageGoodsList} from "../../../../api/caseList";

  export default {
    name: "Casedetails",
    computed: {
      ...mapGetters(["token", "name", "userId"]),
      formatDialogFormjoin() {
        return !!this.dialogFormjoin;
      },
      caseTypeAndAppFromto() {
        return (['答复临时驳回/审查意见（境外）','提供使用声明/证据（境外）','不予注册复审', '商标注册', '分割申请', '异议', '变名变址', '转让/移转', '续展', '删减商品项目', '变更注册申请代理机构', '更正商标申请事项', '注册驳回复审', '国际注册驳回复审', '撤销商标复审', '异议答辩', '撤三答辩(提供使用证明)', '撤销通用名称答辩', '参与不予注册复审', '无效宣告答辩', '撤销复审答辩', '撤销三年停止使用申请', '撤销成为通用名称注册商标', '无效宣告申请', '撤回商标评审', '行政复议', '许可备案', '补发商标注册证', '补发商标变转续证明', '出具优先权证明文件', '出具商标注册证明', '商标注销', '撤回商标申请'].includes(this.caseDetailFoemData.caseType)) && ['内-内', '外-内', '台-内'].includes(this.caseDetailFoemData.appFromto)
      },
      idTypeOptions(){
        if (this.caseDetailFoemData.legalNature=='自然人') {
          if(this.caseDetailFoemData.appGJdq=='中国'){
            return [
              {
                typeName: '身份证',
                value: '身份证'
              },
            ]
          }else if(['中国香港','中国澳门','中国台湾'].includes(this.caseDetailFoemData.appGJdq)){
            return this.idCardOptions
          }else{
            return [
              {
                typeName: '护照',
                value: '护照'
              },
              {
                typeName: '其他',
                value: '其他'
              },
            ]
          }
        }else{
          if(this.caseDetailFoemData.appGJdq=='中国'){
            return this.organIdTypeList
          }
        }
      },
      isShowSubjectFile(){
        return (this.caseDetailFoemData.legalNature=='自然人' && this.caseDetailFoemData.appGJdq == '中国') || this.caseDetailFoemData.legalNature!='自然人'
      },
      isShowForeignFileUpload(){
        if(this.caseDetailFoemData.appGJdq && this.caseDetailFoemData.appGJdq.includes('中国')){
          if(this.caseDetailFoemData.appGJdq == '中国'){
            return false
          }else{
            return this.caseDetailFoemData.appCertFileIsCn == '否' || this.caseDetailFoemData.uploadFileLanguage==='外文'
          }
        }else{
          return true
        }
      },
      appCertificateRequired(){
        const fromtoList = ['内-内', '外-内', '台-内']
        const caseTypeList = ['商标注册','变名变址','转让/移转','续展','删减商品项目','变更注册申请代理机构','更正商标申请事项','商标注销','许可备案','撤回商标申请']
        const result = fromtoList.includes(this.caseDetailFoemData.appFromto) && caseTypeList.includes(this.caseDetailFoemData.caseType)
        return result
      }
    },
    components: {
      CheckGoodsList,
      OverseasQuotation,
      BreadCrumbCase,
      Pagination,
      ChangeOfNameAndAddress,
      trademarkTable,
      DataUploadOrSelect,
      ElectronicArchives,
      CaseBill,
      Goods,
      CaseInvestigators,
      SpecialInstructions,
      poppingTimeLimit,
      CustomerTree
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      prePage: {
        default: "案件管理"
      }
    },
    data() {
      var idNumReg = /^[0-9]{6}$/;
      var validateIdNum = (rule, value, callback) => {
        if (!idNumReg.test(value)) {
          callback(new Error("格式有误"));
        } else {
          callback();
        }
      };
      var tmDesignDeclare = (rule, value, callback) => {
        if (this.caseDetailFoemData.submitType == "网上申请") {
          if (['商标注册', '分隔申请'].includes(this.caseDetailFoemData.caseType) && (value && ['外-内', '内-内'].includes(this.caseDetailFoemData.appFromto) && value.length > 180 || !value && ['外-内', '内-内'].includes(this.caseDetailFoemData.appFromto))) {
            callback(new Error("商标说明字数在1-180之间"));
          }
          if (!isInputAll(value) && value) {
            callback(new Error("商标说明内有特殊字符不能递交网申。特殊字符含义：除英文、汉字及常用标点符号数字之外的所有字符"));
          } else {
            callback();
          }
        } else {
          callback();
        }

      };
      var appContactTel = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请填写电话"));
        } else {
          if (this.$commonUtils.yan_telMoble(value)) {
            callback()
          } else {
            callback(new Error("请填写正确的电话号或手机号,格式例如：0577-88888888或11位手机号码"));
          }
        }
        // if (this.caseDetailFoemData.submitType == "网上申请") {
        //   if (/^1[3456789]\d{9}$/g.test(value)) {
        //     callback();
        //   } else if (/^\d+-\d{8}-\d+$/.test(value)) {
        //     callback();
        //   } else if (/^\d+-\d{8}$/.test(value)) {
        //     callback();
        //   } else {
        //     callback(new Error("联系方式格式不正确"));
        //   }
        // } else {
        //   callback();
        // }
      };
      var appCnAddrValidate = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请填写申请人冠有省、市、县/区三级区划的详细地址,如四川省成都市青羊区玉沙路1000号"));
        } else {
          if (this.caseDetailFoemData.submitType == "网上申请" && this.caseDetailFoemData.appGJdq === '中国') {
            if (this.$commonUtils.fomat_qh(value)) {
              callback()
            } else {
              callback(new Error("请填写申请人冠有省、市、县/区三级区划的详细地址,如四川省成都市青羊区玉沙路1000号"));
            }
          } else {
            callback()
          }
          // fomat_qh
        }
      }
      var certCode = (rule, value, callback) => {
        if (this.caseDetailFoemData.submitType == "网上申请") {
          if (/^\w{18}$/g.test(value)) {
            callback();
          } else if (/^\w{15}$/g.test(value)) {
            callback();
          } else {
            callback(new Error("统一社会信用代码格式错误"));
          }
        } else {
          callback();
        }
      };

      return {
        debouncedFunc:null,
        address: {
          province: '',
          city: '',
          district: ''
        },
        provinceList: [],
        cityList: [],
        districtList: [],
        idCardOptions:[],
        organIdTypeList:[],
        certTypeOptions:[],
        projectTreeData: JSON.parse(JSON.stringify(mockProjectTreeData)),
        emailDisabled: false,
        checkGoodListTotal: 0,
        checkGoodList: [],
        currencyList: [],
        agentPersonList: [],
        backAppFromto: '',
        goodsVersionList: [],
        checkGoodsSign: false,
        brandHierarchyList: [],
        riskTypeList: [],
        riskLevelList: [],
        custActivity: [],
        custActivityList: [],
        otherAgencyList:[],
        caseRoleSelectList: [],
        zhuxiaofileList: [],
        uploadFileData: {},
        creatematerialUrl,
        postFormFlag: true,
        defaultCaseData: {},
        caseData: [],
        DataUploadOrSelectState: false,
        poppingTimeLimitState: false,
        fileData1: {},
        tyimage: "",
        // collapseactiveNames: "1",
        zngoodb: "",
        zngood: "",
        addCbzCyindex: "",
        downloadDtepfiles: "",
        stepActive: 0,
        groupGzzObjc: {
          wkgId: "",
          groupName: "",
          trademarkCaseWorkgroupMembers: [],
          wkgRoleId: ""
        },
        dialogFormgroupGzz: false,
        goodsCaseNumber: "",
        planName: "",
        innerVisible: false,
        sameloading: false,
        sameTmdata: {},
        sameSenddata: {
          tmName: "",
          tmType: "",
          pageNo: 1,
          pageSize: 10
        },
        sameTmdatatotal: "",
        checkAllgoodClass: true,
        checkedgoodClass: goodClasses,
        allgoodClass: goodClasses,
        isIndeterminategoodClass: true,

        selectTmSearchInput: "",

        groupCyObjc: {
          userId: "",
          roleId: "",
          roleName: "",
          fullname: ""
        },
        dialogFormgroupCy: false,
        dialogFormTmCm: false,
        tkInspectType: "",
        tkInspectText: {innerMemo: "", cause: "", content: ""},
        jyText: "",
        goodsPlan: "",
        goodslistPageData: {
          total: 0,
          pageNo: 1,
          pageSize: 10
        },
        custReqCases: [],
        custReqBills: [],

        joinFormData: {
          appId: "",
          cardName: "",
          cardId: "",
          nameCn: "",
          nameEn: "",
          joinAppType: "",
          joinAppCoun: "",
          getFileIsEn: "",
          fileName: []
        },
        dialogFormjoin: 0,
        filterText: "",
        loading: false,
        caseDetailFoemData: {
          supplement: 1,
          // isResend: "否", // 是否需重新制发证
          taskId: "",
          custName: "",
          whdAgencyName: "",
          isUpwhdAgency: "",
          memberRule: "",
          memberNamelists: [],
          instructions: "",
          caseType: "", //案件类型 文字
          custId: "", //客户id
          caseTypeId: "", //案件类型编号
          appFromto: "", //申请方向 文字
          caseNumber: "", //案件个数
          agentNum: "", //案件文号
          submitType: "", //申请方式 文字
          tmName: "", //商标名称
          tmNameEn: "", //商标英文
          tmDesignDeclare: "", //商标设计说明
          goods: [],
          materials: [],
          uploadFileLanguage: '',
          tmType: "", //种类 （1：一般；2：集体；3：证明）传1、2、3
          ifSolidTm: "", //是否三维标志（0：否；1：是）传0、1
          colorSign: "", //是否是颜色组合（0：否；1：是）传 0、1
          assignColor: "", //指定颜色（0：否；1：是）传 0、1
          tmVoice: "", //声音标识（0：否；1：是）传 0、1
          priorityType: "1", //优先权声明（1：基于第一次申请的优先权；2：基于会展的优先权）传1、2
          priorityBaseCrty: "", //优先权国家（文字）
          priorityAppDate: "", //优先权日期
          isLoadPriorityFile: "0", //优先权文件候补（0：否；1：是）传 0、1
          priorityAppNum: "", //优先权申请号
          custRefno: "", //客户文号
          custContactId: "", //客户联系人id
          trademarkCaseCustContacts: [],
          letterAddrId: "", //信函地址id
          billCustContactId: "", //账单联系人id
          discount: "", //折扣率
          billAddrId: "", //账单地址id
          applicationMarks: "", //申请书标注
          caseLevel: "", //案件等级（1：普通；2：重要）传1、2
          otherAgency: "", //他所代交（0：否；1：是）传 0、1
          replaceAgencyName: "", //代交所名称
          remarks: "", //案件备注
          appGJdq: "", //书式类型（文字）
          certCode: "", //统一社会信用代码
          appId: "", //申请人id
          appCnName: "", //申请人中文名称
          appEnName: "", //申请人英文名称
          appCountryOrRegion: "", //申请人国家或地区
          appCnAddr: "", //申请人详细地址
          appEnAddr: "", //申请人英文地址
          legalNature: "",
          appContactPerson: "", //联系人（中文）
          appContactZip: "", //邮政编码
          appContactTel: "", //电话
          appContactEmail: "", //邮箱
          ifShareTm: "", //共同申请（0：否；1：是）传 0、1
          joinApps: [],
          madrid: '', //马德里注册
          appState: "", //注册国家（文字）
          agencyCustId: "", //外方代理所id
          agencyCustContactId: "", //外代所联系人id
          agencyCustRefno: "", //外方代理所文号
          agencyCustAddrId: "", //外方代理所地址id
          agencyCustReq: "", //外放代理所要求
          timeLimitContent: "", //时限内容
          limitDate: "", //时限日期
          trademarkCaseMadrids: [],
          trademarkCaseBasicinfos: [],
          caseIds: [],
          trademarkCaseWorkgroups: [],
          ownerDeptId: "", //案件所属部门 （选择客户组时的deptId）
          caseEvolve: [],
          trademarkCaseCustWorkgroups: [
            {wkgId: "", trademarkCaseWorkgroupMembers: []}
          ],
          trademarkCaseCBWorkgroups: [],
          trademarkCaseLCWorkgroups: []
        },
        madridRules: {
          gjRegNumber: [
            {
              required: true,
              message: "请填写国际注册号",
              trigger: "change"
            }
          ],
          gjRegDate: [
            {required: true, message: "请填写国际注册日期", trigger: "blur"}
          ],
          interLogoutDate: [
            {required: true, message: "请填写国际注销登记日期", trigger: "blur"}
          ],
        },
        rules: {
          isPreChangeAgencyName: [{required: true, message: '请选择是否填写变更后代理机构名称', trigger: ['blur', 'change']}],
          custContactId: [{required: true, message: '请选择客户联系人', trigger: ['blur', 'change']}],
          custRefno: [{required: true, message: '请填写客户文号', trigger: ['blur', 'change']}],
          statementOfEvidence: [{required: true, message: '请填写使用声明/证据说明', trigger: ['blur', 'change']}],
          evidenceType: [{required: true, message: '请选择使用声明/证据类型', trigger: ['blur', 'change']}],
          isIpAgent: [{required: true, message: '请选择经营范围是否包括知识产权代理', trigger: ['blur', 'change']}],
          madrid: [
            {required: true, message: '请选择注册方式', trigger: ['blur', 'change']}
          ],
          agencyCustId: [
            {required: true, message: '请选择外方代理所', trigger: ['blur', 'change']}
          ],
          appState: [
            {required: true, message: '请选择注册国家', trigger: ['blur', 'change']}
          ],
          appFromto: [
            {required: true, message: "请选择申请方向", trigger: "change"}
          ],
          submitType: [
            {required: true, message: "请选择申请方式", trigger: "change"}
          ],
          custId: [
            {required: true, message: "请选择客户", trigger: "change"}
          ],
          goodClasses: [
            {required: true, message: "请选择类别", trigger: "change"}
          ],
          appCnName: [
            {required: true, message: "请选择申请人", trigger: "change"}
          ],
          tmDesignDeclare: [
            {validator: tmDesignDeclare, trigger: ['blur', 'change'] , required: true,}
          ],
          isLoadPriorityFile: [
            {required: true, message: "请选择人优先权文件后补", trigger: "change"}
          ],
          priorityAppDate: [
            {required: true, message: "请选择优先权日期", trigger: "change"}
          ],
          priorityAppNum: [
            {required: true, message: "请选择优先权申请号", trigger: "change"}
          ],
          priorityBaseCrty: [
            {required: true, message: "请选择国家", trigger: "change"}
          ],
          priorityType: [
            {required: true, message: "请选择要求优先权声明", trigger: "change"}
          ],
          certCode: [
            {
              required: true,
              validator: certCode,
              trigger: "blur"
            }
          ],
          tmName: [
            {required: true, message: "请填写商标名称", trigger: "blur"}
          ],
          appCnAddr: [
            {required: true, validator: appCnAddrValidate, trigger: ['blur', 'change']}
          ],
          appContactTel: [
            {required: true, validator: appContactTel, trigger: ['blur', 'change']},
            // { required: true, message: "请填写联系人电话", trigger: "blur" },
          ],
          legalNature: [
            {required: true, message: "请选择主体法律性质", trigger: "change"}
          ],
          appCertificate: [
            {
              required: true,
              message: "请填写证件名称",
              trigger: "blur"
            }
          ],
          appCertFileIsCn: [
            {
              required: true,
              message: "请选择证明文件是否为中文",
              trigger: "blur"
            }
          ],
          appCertificateNum: [
            {
              required: true,
              message: "请填写证件号",
              trigger: "blur"
            }
          ],
          appGJdq: [
            {required: true, message: "请选择申请人国籍", trigger: "change"}
          ],
          appContactZip: [
            { required: true, validator: validateIdNum, trigger: "blur" }
          ],
          addressGroup: [
            {
              required: true,
              message: "请选择申请人地址",
              trigger: "change",
              validator: (rule, value, callback)=>{
                if (
                  this.address &&
                  this.address.province
                ) {
                  callback();
                } else {
                  callback(new Error("请选择申请人地址"));
                }
              },
            }
          ]
        },
        goodsData: [],
        goodsTreeProps: {
          label: function (data, node) {
            if (node.level > 2) {
              return data.goodName;
            } else {
              return data.name;
            }
          },
          children: "child"
        },
        fileUrl: serviceApi.creatematerialUrl,
        goodsSelectPlan: "1",
        dialogFormgoods: false,
        stepActive1: 0,
        ifpriority: false,
        activeName: "first",

        pickerOptions: {
          disabledDate(time) {
            // return time.getTime() > Date.now();
          },
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
        clickUpload: false,
        selectData: {
          appaddr: [],
          goodsznselect: [],
          goodszn: {},
          country: [],
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
          customerContactswf: [],
          customerContacts: [],
          customerAddrs: [],
          casecount: []
        },

        wtsfileList: [],
        multipleFileList: [],
        fileName: {
          "1000": "",
          "1001": "",
          "1002": "",
          "1003": "",
          "1004": "",
          "1005": "",
          "1006": "",
          "1007": "",
          "1008": "",
          "1009": "",
          "1010": "",
          "1011": "",
          "1012": "",
          "1013": "",
          "1014": "",
          "1015": "",
          "1016": "",
          "1017": "",
          "1018": "",
          "1019": "",
          "1020": "",
          "1021": "",
          "1022": "",
          "1023": "",
          "1024": "",
          "1025": "",
          "1026": "",
          "1027": "",
          "1028": "",
          "1029": "",
          "1030": "",
          "1031": "",
          "1032": "",
          "1033": "",
          "1034": "",
          "1035": "",
          "1036": "",
          "1037": "",
          "1038": "",
          "1039": "",
          "1040": ""
        },
        jzNub: "",
        materialArray: [],
        taskRecordArray: [],
        pageGoods: [],
        custGroup: [],
        mainCaseIds: [],
        queryCanProcessTmState: false,
        queryModuleData: {},
        regNumberList: [],
        tmlist: [
          "变名变址",
          "续展",
          "变更注册申请代理机构",
          "删减商品项目",
          "更正商标申请事项"
        ],
        elstepList: [],
        filingOperationState: false,
        evidenceTypeList: [],
        applicantTypeList: [],
        curUploadTitle: "",
        clientState: false,
        collaptrademarkTable: "1",
        curCustLevel: false,
        isYunFen: false,
        casePprogress: true,
        supplementList: [
          "异议",
          "注册驳回复审",
          "国际注册驳回复审",
          "撤销商标复审",
          "不予注册复审",
          "异议答辩",
          "撤三答辩（提供证明使用）",
          "撤销通用名称答辩",
          "参与不予注册复审",
          "无效宣告答辩",
          "撤销复审答辩",
          "撤销三年停止使用申请",
          "撤销成为通用名称注册商标",
          "无效宣告申请"
        ],
        trademarkList: ["商标注册",
          '答复临时驳回/审查意见（境外）',
          "提供使用声明/证据（境外）",
          '商标查询',
          "签署代理合同协议",
          "商标监控总卷/协议",
          "咨询",
          "其他",
          '广告',
          '著名商标认定',
          "投标"],
        noNeedTosubmit: [
          '商标查询',
          "签署代理合同协议",
          "商标监控总卷/协议",
          "咨询",
          "其他",
          '广告',
          '著名商标认定',
          "投标"],
        materialArray: [],
        queryCustomerNameIdList: [],
        appCnAddrChangeFlag:false
      };
    },
    mixins: [require('@/views/workbench/case/components/TabNameStorage.vue').default],
    created() {
      this.firstPage = true;
      this.firstGetTrademark = true;

      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id;
        //  this.$route.query.pageId

        this.mainCaseIds = id.split(",");
        this.fetchData();
        this.getCrestDataUp();
        this.querycustSelectClass();
        this.queryCustGroup();
        // this.fetchData("387182,386627,387182");
      } else {
      }
      this.debouncedFunc = this.debounce(this.debounceSplitAddress, 1000);
    },
    watch: {
      // "caseDetailFoemData.appCnAddr":{
      //   handler(val){
      //     if(this.caseDetailFoemData.appGJdq == '中国'){
      //       this.debouncedFunc&&this.debouncedFunc()
      //     }
      //   },
      //   immediate: true
      // },
      "caseDetailFoemData.project":{
        handler(v){
          console.log(v,'v@@@@');
        }
      },
      "caseDetailFoemData.otherAgency": {
        handler(v){
          if(!Number(v)) {
            this.$set(this.caseDetailFoemData, 'replaceAgencyName', '')
          }
        },
        immediate: true
      },
      "checkGoodList": {
        handler(n) {
          this.caseDetailFoemData.goodImages = n
        },
        immediate: true,
        deep: true
      },
      activeName: {
        handler (n) {
          this.handleClickTab({}, null, true)
        },
        immediate: true
      },
      // "caseDetailFoemData.approvalNo"(n){
      //   if (n) {
      //     this.caseDetailFoemData.regNumber = n
      //   }
      // },
      // "caseDetailFoemData.regNumber"(n){
      //   if (n) {
      //     this.caseDetailFoemData.approvalNo = n
      //   }
      // },
      "caseDetailFoemData.goodClasses"(n) {
        if (n) {
          this.caseDetailFoemData.goodClasses = n.replace(/\D/g, ";").replace(/;+/g, ';')
        }
      },
      dialogFormjoin(n) {
        if (n == 1) {
          this.joinCreatdialog();
        }
        if (n == 4) {
          this.joinCreatdialog(4);
        }
      },
      // "caseDetailFoemData.isResend"(n) {
      //   if (n === "是") {
      //     this.caseDetailFoemData.submitType = "线下申请";
      //   }
      // },
      "caseDetailFoemData.goodImages": function (val, oldval) {
        if (val && val.length == 0) {
          this.caseDetailFoemData.goodImagesSign = '0000'
        }
        if (val && val.length > 0) {
          this.caseDetailFoemData.goodImagesSign = '1111'
        }
      },
      "caseDetailFoemData.goods": function (val, oldval) {
        if (val && val.length == 0) {
          this.caseDetailFoemData.goodsSign = '0000'
        }
        if (val && val.length > 0) {
          this.caseDetailFoemData.goodsSign = '1111'
        }
        this.getgoodsList(val);
      },
      "caseDetailFoemData.agencyOffers": {
        handler(val) {
          if (val && val.length == 0) {
            this.caseDetailFoemData.agencySign = '0000'
          }
          if (val && val.length > 0) {
            this.caseDetailFoemData.agencySign = '1111'
          }
        }
      },
      "caseDetailFoemData.whdAgencyName"(shortName, oldval) {
        if (this.caseDetailFoemData.caseType !== "变更注册申请代理机构") {
          return;
        }
        queryAgencyName({shortName}).then(res => {
          this.caseDetailFoemData.preChangeAgencyName = res.data.name;
        });
      },
      "caseDetailFoemData.appId"(n) {
        if (
          this.tmlist
            .filter(item => item !== "变名变址")
            .includes(this.caseDetailFoemData.caseType) &&
          this.$route.query.import !== "1"
        ) {
          this.queryModuleData.custId = this.caseDetailFoemData.custId;
          this.queryModuleData.appId = n;
          this.queryModuleData.caseTypeId = this.caseDetailFoemData.caseTypeId;
          this.$nextTick(() => {
            this.queryCanProcessTmState = true;
          });
        }
      },
      "caseDetailFoemData.caseTypeId"(newVal) {
        const list = [
          185,30,31,33,53,54,55,118,42,39,48,38,36,37,39,32,
          40,186,56,35,43,44,45,47,62,117,120,122,158,159,160,161,163,165,166,209
        ]
        if(list.includes(newVal)){
          this.rules.submitType.require = true
        }else{
          this.rules.submitType[0].required = false
        }
      },
      //外内和内内、国籍是中国时，申请人英文名称和英文地址清空
      "caseDetailFoemData.appFromto"(newVal) {
        if(["内-内","外-内"].includes(newVal)&&this.caseDetailFoemData.appGJdq=='中国'){
          this.caseDetailFoemData.appEnName = undefined
          this.caseDetailFoemData.appEnAddr = undefined
        }
      },
      "caseDetailFoemData.appGJdq"(newVal) {
        if(["内-内","外-内"].includes(this.caseDetailFoemData.appFromto)&&newVal=='中国'){
          this.caseDetailFoemData.appEnName = undefined
          this.caseDetailFoemData.appEnAddr = undefined
        }
      }
    },
    async mounted() {
      window.addEventListener("scroll", this.handleScroll, true);
      this.provinceList =await this.queryRegionList(1)
    },
    methods: {
      changeAppCnAddr(vlaue){
        if(this.appCnAddrChangeFlag){
          this.debouncedFunc&&this.debouncedFunc()
        }
        this.appCnAddrChangeFlag = true
      },
      //主体法律性质变更
      changeLegalNature(value){
        if (value) {
          this.caseDetailFoemData.appCertificate = ''
        }
      },
      // 自定义防抖方法
      debounce(fn, delay) {
        let timer = null;
        return function (...args) {
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            fn.apply(this, args);
          }, delay);
        };
      },
      // 分割地址
      debounceSplitAddress(){
        this.splitAddressFunc(this.caseDetailFoemData.appCnAddr)
      },
      async splitAddressFunc(address){
        const responce = await splitAddress({address:address})
        if (responce.success) {
          if (responce.data.provinceCode) {
            this.cityList = await this.queryRegionList(2,responce.data.provinceCode)
            this.address.province = responce.data.provinceCode
          }else{
            this.address.province = ''
          }
          if (responce.data.cityCode) {
            this.districtList = await this.queryRegionList(3,responce.data.cityCode)
            this.address.city = responce.data.cityCode
          }else{
            this.address.city = ''
          }
          if (responce.data.regionCode) {
            this.address.district = responce.data.regionCode
          }else{
            this.address.district = ''
          }
        }
      },
      async queryRegionList(regionLevel, parentCode = '') {
        const res = await queryReginList({ regionLevel, parentCode });
        return res.data || [];
      },
      async handleProvinceChange(val) {
        this.address.city = '';
        this.address.district = '';
        if(val){
          this.cityList = await this.queryRegionList(2, val);
          // const address = this.provinceList.find(item => item.regionCode == val).regionName
          // this.caseDetailFoemData.appCnAddr = address
        }else{
          this.cityList = [];
        }
        this.districtList = [];
      },
      async handleCityChange(val) {
        this.address.district = '';
        if(val){
          this.districtList = await this.queryRegionList(3, val);
          // const address = this.cityList.find(item => item.regionCode == val).regionName
          // this.caseDetailFoemData.appCnAddr = address
        }else{
          this.districtList = [];
        }
      },
      handleDistrictChange(val){
        if (val) {
          // const address = this.districtList.find(item => item.regionCode == val).regionName
          // this.caseDetailFoemData.appCnAddr = address
        }
      },
      delCheckGoods(list) {
        this.checkGoodList = this.checkGoodList.filter(
            data => !list.includes(data)
        );
      },
      changeIfShareTm(value) {
        if (value == '0') {
          this.$set(this.caseDetailFoemData, 'joinApps', this.caseDetailFoemData.joinApps.filter(item => item.type == 4))
        }
      },
      getCheckGoodsList(listQuery) {
        queryImageGoodsList({
          caseId: this.caseDetailFoemData.caseId,
          ...listQuery
        }).then(res => {
          this.checkGoodList = res.data || []
          this.checkGoodListTotal = res.total || 0
        })
      },
      addQuotationData() {
        this.caseDetailFoemData.agencyOffers.push({
          tmCaseId: this.caseDetailFoemData.tmCaseId,
          caseId: this.caseDetailFoemData.caseId,
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
        this.caseDetailFoemData.agencyOffers = this.caseDetailFoemData.agencyOffers.filter(
          data => !items.includes(data)
        );
      },
      changeReplaceAgency(value) {
        if (value && value.includes('佰舟')) { // 100000
          !this.caseDetailFoemData.appContactZip && this.$set(this.caseDetailFoemData, 'appContactZip', 100000)
          //任务7345
          // if (this.caseDetailFoemData.trademarkCaseCustWorkgroups.length) {
          //   if (this.tradWorkGroupList.includes(this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].groupName)) {
          //     this.$set(this.caseDetailFoemData, 'agentPerson', '王莹')
          //     this.$set(this.caseDetailFoemData, 'appContactPerson', '王莹')
          //   } else {
          //     this.$set(this.caseDetailFoemData, 'agentPerson', '刘骞')
          //     this.$set(this.caseDetailFoemData, 'appContactPerson', '刘骞')
          //   }
          // }
          this.emailDisabled = true
          this.$set(this.caseDetailFoemData, 'appContactEmail', 'baizhoujg@126.com')
        } else {
          this.emailDisabled = false
        }
      },
      changeAgency(value) {
        // 任务6277
        if (value === '北京万慧达' || value === '津分万慧达') {
          this.emailDisabled = true
          this.$set(this.caseDetailFoemData, 'appContactEmail', 'whdsqr@126.com')
        } else if (value === '北京万慧达律所') {
          this.emailDisabled = true
          this.$set(this.caseDetailFoemData, 'appContactEmail', 'whdlsjg@126.com')
        } else {
          this.emailDisabled = false
        }
        if (value === '北京万慧达' || value === '北京万慧达律所') { // 100873
          this.$set(this.caseDetailFoemData, 'appContactZip', 100873)
        } else if (value === '津分万慧达') { // 300041
          this.$set(this.caseDetailFoemData, 'appContactZip', 300041)
        }
        if (this.caseDetailFoemData.replaceAgencyName !== '北京佰舟知识产权代理有限公司' && ['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(this.caseDetailFoemData.whdAgencyName)) {
          queryAgentPerson({
            whdAgencyName: value
          }).then(res => {
            this.agentPersonList = res.data
            if (['内-内', '外-内'].includes(this.caseDetailFoemData.appFromto)) {
             if (this.caseDetailFoemData.agentPerson && !this.agentPersonList.includes(this.caseDetailFoemData.agentPerson) || this.caseDetailFoemData.appContactPerson && !this.agentPersonList.includes(this.caseDetailFoemData.appContactPerson)) {
               // this.$message.error('【代理人姓名】或【联系人】不在备案员工范围内')
             }
            }
          })
        }
      },
      changeGoodClass(version) {
        this.caseDetailFoemData.goodClasses = [
          ...new Set(this.caseDetailFoemData.goods.filter(item => item.version == version).map(item => item.goodClass))
        ].join(";");
      },
      changeAppFromto(value) {
        if (!['内-外', '外-外'].includes(this.caseDetailFoemData.appFromto)) {
          if (this.caseDetailFoemData.goods.length && [...new Set(this.caseDetailFoemData.goods.map(item => item.version).filter(Boolean))].length > 1) {
            const h = this.$createElement
            const params = {
              version1: ''
            }
            let vnode = h({
              template: `
                <div>
                  <el-form label-width="100px">
                    <el-row>
                      <el-form-item label="选择版本:">
                        <el-select default-first-option placeholder="请选择" @change="changeValue"
                           v-model="version1" filterable>
                          <el-option v-for="(item, key)  in versionList" :key="item.id"
                                     :label="item.typeName" :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-row>
                  </el-form>
                </div>`,
              props: {
                params: {},
                versionList: {}
              },
              methods: {
                changeValue(value) {
                  this.params.version1 = value
                }
              },
              data() {
                return {
                  version1: ''
                }
              },
            }, {
              props: {
                params,
                versionList: this.goodsVersionList.filter(item => this.caseDetailFoemData.goods.find(i => i.version == item.id))
              }
            })
            this.$confirm(vnode, "请选择保留的版本商品/服务项目", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                if (params.version1) {
                  done()
                } else {
                  this.$message.error('请选择版本!')
                }
              } else {
                done()
              }
            }
            }).then(() => {
              this.backAppFromto = value
              this.$refs.goods.$data.version = params.version1
              this.caseDetailFoemData.goods = this.caseDetailFoemData.goods.filter(item => item.version == params.version1)
              this.changeGoodClass(params.version1)
            }).catch(() => {
              this.caseDetailFoemData.appFromto = this.backAppFromto
            })
          } else {
            this.backAppFromto = value
          }
        } else {
          !this.currencyList.length && queryCurrencyUrl().then(res => {
            this.currencyList = res.data
          })
          if (this.caseDetailFoemData.goods.find(item => !item.version)) {
            const h = this.$createElement
            const params = {
              version1: ''
            }
            let vnode = h({
              template: `
                <div>
                  <el-form label-width="100px">
                    <el-row>
                      <el-form-item label="选择版本:">
                        <el-select default-first-option placeholder="请选择" @change="changeValue"
                           v-model="version1" filterable>
                          <el-option v-for="(item, key)  in versionList" :key="item.id"
                                     :label="item.typeName" :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-row>
                  </el-form>
                </div>`,
              props: {
                params: {},
                versionList: {}
              },
              methods: {
                changeValue(value) {
                  this.params.version1 = value
                }
              },
              data() {
                return {
                  version1: ''
                }
              },
            }, {
              props: {
                params,
                versionList: this.goodsVersionList
              }
            })
            this.$confirm(vnode, "存在未指定版本的商品，请指定版本", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                if (params.version1) {
                  done()
                } else {
                  this.$message.error('请选择版本!')
                }
              } else {
                done()
              }
            }
            }).then(() => {
              this.backAppFromto = value
              this.$refs.goods.$data.version = params.version1
              let number = Math.max(...(this.caseDetailFoemData.goods && this.caseDetailFoemData.goods.filter(item => item.number).map(item => item.number) || []), 0)
              this.caseDetailFoemData.goods.forEach(item => {
                if (!item.version) {
                  item.version = params.version1
                  item.number = ++number
                }
              })
              this.changeGoodClass(params.version1)
            }).catch(() => {
              this.caseDetailFoemData.appFromto = this.backAppFromto
            })
          } else {
            this.backAppFromto = value
          }
          // this.backAppFromto = value
        }
        this.changeElstepList()
      },
      async checkGoods(){
        if (this.$refs.goods || this.$refs.overseas || this.$refs.checkGoods) {
          await new Promise(res => {
            this.$refs.goods && this.$refs.goods.stopEditing()
            this.$refs.overseas && this.$refs.overseas.stopEditing()
            this.$refs.checkGoods && this.$refs.checkGoods.stopEditing()
            setTimeout(() => res(), 300)
          })
        }
        if (!this.checkGoodsSign) {
          this.checkGoodsSign = true
        } else {
          return false
        }
        let notice = ''
        const cnCheck = () => {
          notice = '商品中文名称中包含了非中文描述，请确认是否继续？'
          return true
        }
        const enCheck = () => {
          notice = '商品英文名称中包含了非英文描述，请确认是否继续？'
          return true
        }
        if (
          this.caseDetailFoemData.goods&&
          this.caseDetailFoemData.goods.filter(item => {
            var reg1 = /[\u4e00-\u9fa5]+/g // 检测中文
            var reg2 = /[A-Za-z]+/g // 检测英文
            return item.goodName && !reg1.test(item.goodName) && cnCheck() || item.goodEnName && !reg2.test(item.goodEnName) && !item.goodEnName.includes('待翻译') && enCheck()
          }).length
        ) {
          return await this.$confirm(notice,
            '提示',
            {
              distinguishCancelAndClose:true,
              confirmButtonText: '核查',
              cancelButtonText: '不核查',
              type: 'warning'
            }
          ).then(() => {
            return true
          }).catch((action) => {
            if(action === 'cancel') {
              return false
            }else{
              return true
            }
          })
        }
        return false
      },
      changeIfSec(v){
        if(v){
          this.$confirm("请注意：【机密案件】只能办案人才能查看！确认设置为【机密案件】吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {

          }).catch(() => {
            this.caseDetailFoemData.ifSec = 0
          })
        }
      },
      customerView(){
        if(!this.caseDetailFoemData.custName)return;
        window.open(`/#/workbench/customer_info?custName=${this.caseDetailFoemData.custName}`)
      },
      changeTmName(v){
        this.caseDetailFoemData.tmNameEn = v
      },
      successCallback(a, b, c) {
        if (c.length > 1) {
          this.zhuxiaofileList = c
          const delMaterialId = this.zhuxiaofileList[0].materialId ? this.zhuxiaofileList[0].materialId : this.zhuxiaofileList[0].response.data[0].materialId
          delCaseMaterialUrl({
            caseIdArray: this.mainCaseIds,
            materialId: delMaterialId
          }).then(() => {
            this.zhuxiaofileList = this.zhuxiaofileList.filter(
              item => (item.materialId ? item.materialId : item.response.data[0].materialId) != delMaterialId
            );
          })
        }

      },
      beforeupload(file) {
        this.uploadFileData.tokenID = this.token
        this.uploadFileData.materialTypeId = 300454
        this.uploadFileData.caseIds = this.mainCaseIds
        this.uploadFileData.custId = this.caseDetailFoemData.custId
        this.uploadFileData.type = '2'
        this.uploadFileData.caseId = this.caseDetailFoemData.caseId
      },
      changeDelayRenewal() {
        new Date(this.caseDetailFoemData.validEndDate) > new Date()
          ? (this.caseDetailFoemData.delayRenewal = "1")
          : (this.caseDetailFoemData.delayRenewal = "0");
      },
      billDiscount() {
        billDiscount(this.caseDetailFoemData).then(res => {
          this.caseDetailFoemData.discount = res.data
        })
      },
      handleAppCnName(e) {
        this.appCnAddrChangeFlag = true
        this.appId = e.appId
        this.caseDetailFoemData.appId = e.appId;
        this.caseDetailFoemData.legalNature = e.appType;
        this.caseDetailFoemData.appGJdq = e.sendType;
        this.caseDetailFoemData.appCnAddr = e.applicantAddress;
        this.caseDetailFoemData.appCountryOrRegion = e.country;
        this.caseDetailFoemData.certCode = e.certCode;
        this.caseDetailFoemData.appCertificateNum = e.cardNumber;
        this.caseDetailFoemData.appCertificate = e.cardName;
        //外内和内内、国籍是中国时，申请人英文名称和英文地址清空
        if (!(["内-内","外-内"].includes(this.caseDetailFoemData.appFromto)&&this.caseDetailFoemData.appGJdq=='中国')) {
          this.caseDetailFoemData.appEnName = e.applicantEnName;
          this.caseDetailFoemData.appEnAddr = e.applicantEnAddress;
        }

        if (e.appId) {
          // applicantName:''
          queryAppContactUrl({appId: e.appId}).then(ite => {
            this.selectData.queryAppContact = ite.data;
          });
          queryAppAddrByAppIdUrl({appId: e.appId}).then(res => {
            this.selectData.appaddr = res.data;
            this.caseDetailFoemData.appCnAddr = this.selectData.appaddr[0].addressCn
            this.caseDetailFoemData.appEnAddr = this.selectData.appaddr[0].addressEn
          });
          this.billDiscount()
        } else {
          this.selectData.queryAppContact = [];
          this.caseDetailFoemData.appContactPerson = "";
        }

        if (
          this.tmlist
            .filter(item => item !== "变名变址")
            .includes(this.caseDetailFoemData.caseType) &&
          this.$route.query.import != "1"
        ) {
          this.queryModuleData.custId = this.caseDetailFoemData.custId;
          this.queryModuleData.appId = e.appId;
          this.queryModuleData.caseTypeId = this.caseDetailFoemData.caseTypeId;
          this.queryCanProcessTmState = true;
        }
      },
      changeElstepList() {
        if (this.activeName=='first') {
          if (!this.trademarkList.includes(this.caseDetailFoemData.caseType)) {
              this.elstepList = [
                {title: "案件详情", state: true, id: "ajxq-title"},
                {title: "案件详情", state: true, id: "ajxq-title"},
                {
                  title: "商标信息",
                  state:
                    this.trademarkList.includes(this.caseDetailFoemData.caseType) ||
                    this.mainCaseIds.length === 1,
                  id: "sbxx-title"
                },
                {
                  title: "商标申请说明",
                  state: this.trademarkList.includes(this.caseDetailFoemData.caseType),
                  id: "sbsqsm-title"
                },
                {title: "客户信息", state: true, id: "khxx-title"},
                {title: "申请人信息", state: true, id: "sqrxx-title"},
                {
                  title: "境外信息",
                  state: this.caseDetailFoemData.appFromto=='内-外' || this.caseDetailFoemData.appFromto=='外-外',
                  id: "out-title"
                },
                {
                  title: "基础注册信息",
                  state: (this.caseDetailFoemData.appFromto == '内-外' || this.caseDetailFoemData.appFromto=='外-外') && this.caseDetailFoemData.madrid == true,
                  id: "base-title"
                },
                {
                title: "阿里月报信息",
                state: this.caseDetailFoemData.custName && this.caseDetailFoemData.custName.includes('阿里'),
                id: "ali-title"
              },
              ].filter(item => item.state);
            } else {
              this.elstepList = [
                {title: "案件详情", state: true, id: "ajxq-title"},
                {title: "申请人信息", state: true, id: "sqrxx-title"},
                {
                  title: "商标信息",
                  state:
                    this.trademarkList.includes(this.caseDetailFoemData.caseType) ||
                    this.mainCaseIds.length === 1,
                  id: "sbxx-title"
                },
                {
                  title: "商标申请说明",
                  state: this.trademarkList.includes(this.caseDetailFoemData.caseType),
                  id: "sbsqsm-title"
                },
                {title: "客户信息", state: true, id: "khxx-title"},
                {
                  title: "境外信息",
                  state: this.caseDetailFoemData.appFromto=='内-外' || this.caseDetailFoemData.appFromto=='外-外',
                  id: "out-title"
                },
                {
                  title: "基础注册信息",
                  state: (this.caseDetailFoemData.appFromto == '内-外' || this.caseDetailFoemData.appFromto=='外-外') && this.caseDetailFoemData.madrid == true,
                  id: "base-title"
                },
                {
                title: "阿里月报信息",
                state: this.caseDetailFoemData.custName && this.caseDetailFoemData.custName.includes('阿里'),
                id: "ali-title"
              },
              ].filter(item => item.state);
            }
        }
         if (this.activeName=='second') {

          this.elstepList = [
            { title: "案件指示", id: "tszs-custzs", state: true },
            { title: "账单指示", id: "tszs-billzs", state: true },
            // { title: "客户活动--信息变更", id: "tszs-infochange", state: true },
            // { title: "客户活动–报价及折扣", id: "tszs-pricezk", state: true },
            // { title: "客户活动--特殊指示", id: "tszs-tszs", state: true },
          ]
          if (this.custActivityList && this.custActivityList.length) {
            let list = []
            this.custActivityList.forEach((item, index) => {
              list.push({
                title: item.actType,
                id: "tszs-hd" + index,
                state: true
              })
            })
            this.elstepList.push(...list)
          }
          this.elstepList.push({ title: "客户个案要求", id: "tszs-require", state: true })
        }
      },
      selectCustChange(e) {
        if (!e) {
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
            this.caseDetailFoemData.custContactId = ''
            this.caseDetailFoemData.billCustContactId = ''
            this.caseDetailFoemData.custName = this.queryCustomerNameIdList.find(item =>item.custId == this.caseDetailFoemData.custId).fullname
            this.changeElstepList()
          })
          .catch(err => {
            console.log(err);
          });
        this.billDiscount()
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
      transferCase() {
        createCode().then(res => {
          this.$router.push(`/workbench/case/transferCase/${res.data}?agentNum=${this.caseDetailFoemData.agentNum}`)
        })
      },
      regnumberchangeMadRid(val, type) {
        searchTmUrl({regNumbers: val, trans: 20, pageSize: 100, pageNo: 1}).then(res => {
          if (!res.data || !res.data.length) {
            return;
          }

          this.caseDetailFoemData.appCnName = res.data[0].applicantName
          this.caseDetailFoemData.appCnAddr = res.data[0].applicantAddress;
          this.caseDetailFoemData.tmName = res.data[0].tmName;
          this.caseDetailFoemData.imageFile = res.data[0].imgFilePath ? ("/tmFile" + res.data[0].imgFilePath) : '';
          this.tyimage = res.data[0].imgFilePath ? ("/tmFile" + res.data[0].imgFilePath) : '';
          if (res.data[0].trademarkCategories.length) {
            this.caseDetailFoemData.goods = this.getLanglist(
              res.data.map(item => item.trademarkCategories).filter(item => item)
            ).map(item => ({
              goodClass: item.tmType,
              goodEnName: item.enName,
              goodName: item.name,
              id: item.id,
              similarGroup: item.tmGroup
            }));
            this.caseDetailFoemData.goodClasses = [
              ...new Set(
                this.caseDetailFoemData.goods.map(item => item.goodClass)
              )
            ].join(";");
          } else {
            this.caseDetailFoemData.goodClasses = res.data[0].tmType
          }

        })
      },
      regnumberchange(val) {
        if (["内-内", "外-内"].includes(this.caseDetailFoemData.appFromto)) {
          this.caseDetailFoemData.regNumber = val
          this.caseDetailFoemData.approvalNo = val
        }
        if (['内-外', '外-外'].includes(this.caseDetailFoemData.appFromto)) {
          return
        }
        this.$confirm("是否根据商标号更新案件信息？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delete this.caseDetailFoemData.materials;
          delete this.caseDetailFoemData.caseEvolve;
          this.caseDetailFoemData.replaceInfo = "1";
          this.caseDetailFoemData.checkInfo = "1";
          this.caseDetailFoemData.regNumberList = val;
          searchTmUrl({regNumbers: val, trans: 20, pageSize: 100, pageNo: 1}).then(res => {
            if (!res.data || !res.data.length) {
              return;
            }
            if (this.caseDetailFoemData.caseType !== "变名变址") {
              this.caseDetailFoemData.appCnName = res.data[0].applicantName;
              this.$nextTick(() => {
                if (this.selectData.apps && this.selectData.apps.length > 0) {
                  this.appselectChange(this.caseDetailFoemData.appCnName, res.data[0].applicantAddress, res.data[0].applicantEnAddress);
                }
              });
            } else {
              this.caseDetailFoemData.preChangeCnName = res.data[0].applicantName;
              this.caseDetailFoemData.preChangeCnAdress = res.data[0].applicantAddress;
              // this.caseDetailFoemData.preChangeEnAdress=res.data[0].applicantName;
              // this.caseDetailFoemData.preChangeEnName=res.data[0].applicantName;
              this.caseDetailFoemData.caseType = ""
              this.$nextTick(() => {
                this.caseDetailFoemData.caseType = "变名变址"
              })
            }
            this.caseDetailFoemData.tmName = res.data[0].tmName;
            this.caseDetailFoemData.regNumber = res.data[0].regNumber;
            this.caseDetailFoemData.validStartDate = res.data[0].validStartDate;
            this.caseDetailFoemData.validEndDate = res.data[0].validEndDate;
            this.caseDetailFoemData.regDate = res.data[0].regNoticeDate;
            this.caseDetailFoemData.approvalDate = res.data[0].approvalDate;
            this.caseDetailFoemData.approvalNumber = res.data[0].approvalNumber;
            // this.caseDetailFoemData.appDate = res[0].data.appDate;
            this.caseDetailFoemData.respondentAgency = res.data[0].agent
            this.caseDetailFoemData.tmType =
              res.data[0].classify === "证明"
                ? "3"
                : res.data[0].classify === "集体"
                ? "2"
                : "1";
            this.caseDetailFoemData.imageFile = res.data[0].imgFilePath ? ("/tmFile" + res.data[0].imgFilePath) : '';
            this.tyimage = res.data[0].imgFilePath ? ("/tmFile" + res.data[0].imgFilePath) : '';
            this.caseDetailFoemData.ifSolidTm =
              res.data[0].ifSolidTm == "是" ? "1" : "0";
            this.caseDetailFoemData.assignColor = res.data[0].colorDesc === '是'
              ? true
              : false;
            this.caseDetailFoemData.tmVoice = res.data[0].tmForm
              ? res.data[0].tmForm === "文字"
                ? "0"
                : "1"
              : "0";
            this.caseDetailFoemData.colorSign = "0";
            if (res.data[0].trademarkCategories.length) {
              this.caseDetailFoemData.goods = this.getLanglist(
                res.data.map(item => item.trademarkCategories).filter(item => item)
              ).map(item => ({
                goodClass: item.tmType,
                goodEnName: item.enName,
                goodName: item.name,
                id: item.id,
                similarGroup: item.tmGroup
              }));
              this.caseDetailFoemData.goodClasses = [
                ...new Set(
                  this.caseDetailFoemData.goods.map(item => item.goodClass)
                )
              ].join(";");
            } else {
              this.caseDetailFoemData.goodClasses = res.data[0].tmType
            }
            // this.caseDetailFoemData.tmIdList = info.map(item => item.tmId);
            // this.caseDetailFoemData.goods = res.data[0].trademarkCategories.map(
            //   item => ({
            //     goodClass: item.tmType,
            //     goodEnName: item.enName,
            //     goodName: item.name,
            //     id: item.id,
            //     similarGroup: item.tmGroup
            //   })
            // );
            // tmdetailUrl3({tmId:res.data[0].tmId}).then(res=>{
            //
            // })
          });

          // this.caseDetailFoemData.regNumberList
          // this.caseDetailFoemData.caseIds = this.mainCaseIds;
          // saveCaseInfoUrl(this.caseDetailFoemData).then(res => {
          //   this.fetchData("1");
          // });
        });
      },
      handleScroll() {
        var top1 = document.getElementsByClassName("tilteSpan");
        var top2 = Array.prototype.slice.call(top1);

        top2 = top2.filter(
          item =>
            item.getBoundingClientRect().top > 0 &&
            item.getBoundingClientRect().top < 150
        );

        if (top2.length == 1) {
          let stepindex = "";
          this.elstepList.forEach((item, index) => {
            if (item.id == top2[0].children[0].id && item.state == true) {
              stepindex = index;
            }
          });

          this.stepActive1 = stepindex;
        }
      },
      workGroup(work) {
        this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers =
          work.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers;
        this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers =
          work.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers;
        this.caseDetailFoemData.trademarkCaseCBWorkgroups =
          work.trademarkCaseCBWorkgroups;
      },
      getAppInfo(item) {
        this.queryModuleData.custId = this.caseDetailFoemData.custId;
        this.queryModuleData.appId = item.appId;
        this.queryModuleData.caseTypeName = this.caseDetailFoemData.caseType;
        this.queryModuleData.caseTypeId = this.caseDetailFoemData.caseTypeId;
        if (item.addressList) {
          this.queryModuleData.address = [item.addressList];
        }
        if (item.addressEnList) {
          this.queryModuleData.addressEnList = [item.addressEnList];
        }
        this.queryCanProcessTmState = true;
      },
      getGoods(goods) {
        // this.caseDetailFoemData.goods = [
        //   ...this.caseDetailFoemData.goods,
        //   ...goods
        // ];
        this.$set(this.caseDetailFoemData, 'goods', [
          ...this.caseDetailFoemData.goods,
          ...goods
        ])
        const res = new Map();
        this.caseDetailFoemData.goods = this.caseDetailFoemData.goods.filter(
          item => !res.has(item.goodName + item.goodEnName + item.goodJpName + (item.version || '')) && res.set(item.goodName + item.goodEnName + item.goodJpName + (item.version || ''), 1)
        );
        if (this.caseDetailFoemData.goods.length) {
          if (['内-外', '外-外'].includes(this.caseDetailFoemData.appFromto)) {
            this.caseDetailFoemData.goodClasses = [
              ...new Set(this.caseDetailFoemData.goods.filter(item => item.version == this.$refs.goods.$data.version).map(item => item.goodClass))
            ].join(";");
          } else {
            this.caseDetailFoemData.goodClasses = [
              ...new Set(this.caseDetailFoemData.goods.map(item => item.goodClass))
            ].join(";");
          }
        }
      },
      getAppAddress() {
      },
      querycustSelectClass() {
        const classIdString = [1042, 1158, 1161, 1162, 1163, 1174,1189, 1120, 1190].join(',')
        querycustSelectClass({classId: classIdString}).then(res => {
          this.applicantTypeList = res.data["1042"];
          this.evidenceTypeList = res.data["1158"]
          this.brandHierarchyList = res.data['1161']
          this.riskTypeList = res.data['1162']
          this.riskLevelList = res.data['1163']
          this.goodsVersionList = res.data['1174']
          this.organIdTypeList = res.data['1189']
          this.idCardOptions = res.data['1120']
          this.certTypeOptions = res.data['1190']
        });
      },
      queryCustGroup() {
        queryCustGroup({userId: this.userId}).then(res => {
          this.isYunFen = res.data['isYunFen'] == 1
        })
      },
      getTrademark(info) {

        if (info.length && info[0]) {
          Promise.all(
            Array.from(new Array(info.length).keys())
              .slice(0)
              .map(item => tmdetail({tmId: info[item].tmId}))
          ).then(res => {
            this.$nextTick(() => {
              if (this.selectData.apps && this.selectData.apps.length > 0) {
                this.appselectChange(this.caseDetailFoemData.appCnName, res[0].data.applicantAddress);
              }
            });
            this.caseDetailFoemData.tmName = res[0].data.tmName;
            this.caseDetailFoemData.regNumber = res[0].data.regNumber;
            this.caseDetailFoemData.validStartDate = res[0].data.validStartDate;
            this.caseDetailFoemData.validEndDate = res[0].data.validEndDate;
            this.caseDetailFoemData.regDate = res[0].data.regNoticeDate;
            this.caseDetailFoemData.respondentAgency = res[0].data.agent
            // this.caseDetailFoemData.appDate = res[0].data.appDate;
            this.caseDetailFoemData.tmType =
              res[0].data.classify === "证明"
                ? "3"
                : res[0].data.classify === "集体"
                ? "2"
                : "1";
            this.caseDetailFoemData.imageFile =
              res[0].data.imgFilePath ? ("ipdoc/downloadimage" + res[0].data.imgFilePath) : '';
            this.tyimage = res[0].data.imgFilePath ? ("ipdoc/downloadimage" + res[0].data.imgFilePath) : '';
            this.caseDetailFoemData.ifSolidTm =
              res[0].data.ifSolidTm == "是" ? "1" : "0";
            this.caseDetailFoemData.assignColor = res[0].data.colorDesc === '是'
              ? true
              : false;
            this.caseDetailFoemData.tmVoice = res[0].data.tmForm
              ? res[0].data.tmForm === "文字"
                ? "0"
                : "1"
              : "0";
            this.caseDetailFoemData.colorSign = "0";
            this.caseDetailFoemData.tmIdList = info.map(item => item.tmId);
            this.caseDetailFoemData.goods = this.getLanglist(
              res.map(item => item.data.trademarkCategories)
            ).map(item => ({
              goodClass: item.tmType,
              goodEnName: item.enName,
              goodName: item.name,
              id: item.id,
              similarGroup: item.tmGroup
            }));
            this.caseDetailFoemData.goodClasses = [
              ...new Set(
                this.caseDetailFoemData.goods.map(item => item.goodClass)
              )
            ].join(";");
          });
        } else {
          this.caseDetailFoemData.goods = [];
          this.caseDetailFoemData.tmIdList = [];
          this.caseDetailFoemData.regNumber = "";
          this.caseDetailFoemData.goodClasses = "";
        }
      },
      getLanglist(array) {
        let arr = [];
        array.forEach(item => {
          arr.push(...item);
        });
        return arr;
      },
      cmDialogShow() {
        this.selectTmSearchInput = this.caseDetailFoemData.tmName;

        this.getCmtmdata();
      },
      getCmtmdata(type) {
        this.sameloading = true;
        if (type == "seach") {
          this.sameSenddata.pageNo = "1";
        }
        this.sameSenddata.tmName = this.selectTmSearchInput;
        this.sameSenddata.tmType = this.checkedgoodClass.join(";");
        checkSameTmUrl(this.sameSenddata)
          .then(res => {
            this.sameloading = false;
            this.sameTmdata = res.data;
            this.sameTmdatatotal = res.total;
            this.$message.success(res.success);
          })
          .catch(error => {
            this.sameloading = false;
          });
      },
      handleCheckAllgoodClassChange(val) {
        this.checkedgoodClass = val ? goodClasses : [];
        this.isIndeterminategoodClass = false;
      },
      handleCheckedgoodClassChange(value) {
        let checkedCount = value.length;
        this.checkAllgoodClass = checkedCount === this.allgoodClass.length;
        this.isIndeterminategoodClass =
          checkedCount > 0 && checkedCount < this.allgoodClass.length;
      },
      // 共同申请人
      addjionP() {
        if (this.dialogFormjoin == 1) {
            this.joinFormData.caseIds = this.mainCaseIds;
            this.caseDetailFoemData.joinApps.push(this.joinFormData);
            modifyjoinapp(this.joinFormData);
        } else if (this.dialogFormjoin == 2) {
          this.caseDetailFoemData.joinApps.splice(
            this.caseDetailFoemData.joinApps
              .map(item => item.joinAppId)
              .indexOf(this.joinFormData.joinAppId),
            1,
            this.joinFormData
          );
        } else if (this.dialogFormjoin == 4) {
          this.joinFormData.caseIds = this.mainCaseIds;
          this.caseDetailFoemData.joinApps.push(this.joinFormData);
          modifyjoinapp(this.joinFormData);
        }
        this.joinFormData = {
          caseIds: this.mainCaseIds,
          appId: "",
          cardName: "",
          cardId: "",
          nameCn: "",
          nameEn: "",
          addrEn: "",
          addrCn: "",
          joinAppType: "",
          joinAppCoun: "",
          getFileIsEn: "",
          materialArray: [],
          modifyState: false,
          fileName: []
        };
        this.dialogFormjoin = 0;
      },
      deljoinp(item) {
        const index = this.caseDetailFoemData.joinApps.indexOf(item);
        this.caseDetailFoemData.joinApps.splice(index, 1);
        delJoinAppUrl({joinAppId: item.joinAppId}).then(res => {
        });
      },
      changeAppJoinState(row, index) {
        // if (row.modifyState) {
        //   this.caseDetailFoemData.joinApps[index].caseIds = this.mainCaseIds;
        //   modifyjoinapp(this.caseDetailFoemData.joinApps[index]).then(res => {});
        // }
        // this.caseDetailFoemData.joinApps[index].modifyState = !row.modifyState;
        // this.caseDetailFoemData.joinApps.push({});
        // this.caseDetailFoemData.joinApps.pop();
        this.dialogFormjoin = 2;
        this.$set(this, 'joinFormData', row)
      },
      delMDL(index) {
        // const index = this.caseDetailFoemData.trademarkCaseBasicinfos.indexOf(
        //   item
        // );
        this.caseDetailFoemData.trademarkCaseBasicinfos.splice(index, 1);
      },
      handleClickTab(tab, event, flag) {
        if ((tab.index == "1" || flag) && this.caseDetailFoemData.custId) {
          queryCustomerReqUrl({custId: this.caseDetailFoemData.custId, caseId: this.caseDetailFoemData.caseId}).then(
            res => {
              // res.data.custReqBills.forEach(item=>{
              //   item.status=1
              // })
              this.custReqBills = res.data.custReqBills;
              // res.data.custReqCases.forEach(item=>{
              //   item.status=1
              // })
              this.custReqCases = res.data.custReqCases;
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
              this.changeElstepList()
            }
          );
        }
        if (tab.index == "2") {
        }
      },
      // 进展
      downloadLCfile(command) {
        let data = {caseId: this.caseDetailFoemData.caseId};
        if (command == "1") {
          data.caseStageId = this.downloadDtepfiles;
        }
        oneKeyZipUrl(data).then(res => {
          if (res.success) {
            var a = document.createElement("a");
            a.setAttribute("href", res.data);
            a.setAttribute("id", "zipDownLoad");
            if (document.getElementById("zipDownLoad")) {
              document.body.removeChild(document.getElementById("zipDownLoad"));
            }
            document.body.appendChild(a);
            a.click();
          }
        });
      },

      // 商品服务
      goodsPlanselectChange(id) {
        console.log(id, "900-------009");
        queryGoodsUrl({planId: id}).then(res => {
          this.caseDetailFoemData.goods = res.data;
        });
      },
      jyGoods () {
        if (this.jyText == "") {
          this.$message.error("请输入校验内容!");
        } else {
          // console.log(this.jyText.split("\n"));
          let list = this.jyText.split("\n").filter(Boolean)
          this.jyText = Array.from(new Set(this.jyText.split("\n"))).join("\n");
          Array.from(new Set(this.jyText.split("\n"))).forEach(item => {
            list.splice(list.findIndex(i => i == item), 1)
          })
          queryListByUrl({ paramter: this.jyText }).then(res => {
            this.goods = res.data;
            if(list.length){
              this.$alert(`商品名称"${[...new Set(list)]}"有重复，已删除`,
              "提示",
                {
                  confirmButtonText: "关闭",
                  type: "warning"
                }
              )
            }
          });
        }
      },
      tableRowClassName({row, rowIndex}) {
        if (row.flag === 0) {
          return "warning-row";
        }
        return "";
      },
      delgood(items) {
        this.caseDetailFoemData.goods = this.caseDetailFoemData.goods.filter(
          data => !items.includes(data)
        );
        if (['内-外', '外-外'].includes(this.caseDetailFoemData.appFromto)) {
          this.caseDetailFoemData.goodClasses = [
            ...new Set(this.caseDetailFoemData.goods.filter(item => item.version == this.$refs.goods.$data.version).map(item => item.goodClass))
          ].join(";");
        } else {
          this.caseDetailFoemData.goodClasses = [
            ...new Set(this.caseDetailFoemData.goods.map(item => item.goodClass))
          ].join(";");
        }
      },
      getgoodsList(goods) {
        this.goodslistPageData.total = goods.length;

        var offset =
          (this.goodslistPageData.pageNo - 1) * this.goodslistPageData.pageSize;
        this.pageGoods =
          offset + this.goodslistPageData.pageSize >= goods.length
            ? goods.slice(offset, goods.length)
            : goods.slice(offset, offset + this.goodslistPageData.pageSize);
      },
      searchGoods() {
        this.$refs.goodstree.filter(this.filterText);
      },
      filterNode(value, data) {
        if (!value) return true;
        if (data.goodName) {
          return data.goodName.indexOf(value) !== -1;
        }
        return data.name.indexOf(value) !== -1;
      },
      goodsDialogShow() {
        GSQAllcategoryUrl({lang: "cn"}).then(res => {
          this.selectData.goodszn = res.data;
        });
        GSQQueryAllClassUrl({flag: "1"})
          .then(response => {
            this.goodsData = response.data;
          })
          .catch(err => {
            console.log(err);
          });
      },
      goodsDialogqx() {
        this.dialogFormgoods = false;
        // this.caseDetailFoemData.goods = [];
      },
      addGoods() {
        this.caseDetailFoemData.goods = this.$refs.goodstree.getCheckedNodes({
          leafOnly: true
        });
      },
      getChangedata() {
        // let item = JSON.parse(JSON.stringify(this.caseDetailFoemData))

        if(this.defaultCaseData.goodsSign){
          delete this.defaultCaseData.goodsSign
        }

        // if(['内-内', '外-内', '台-内'].includes(this.caseDetailFoemData.appFromto) && this.caseDetailFoemData.approvalNo && this.caseDetailFoemData.regNumber){
        //   this.caseDetailFoemData.approvalNo = this.caseDetailFoemData.regNumber
        // }
        let item = this.$commonUtils.compareObjAttrs(this.defaultCaseData, this.caseDetailFoemData)

        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            const element = item[key];
            const element1 = this.defaultCaseData[key];
            if(key == 'trademarkCaseCBWorkgroups' && item[key] && !item[key].length){
              item[key + 'Sign'] = '0000'
            } else if(!item['trademarkCaseCBWorkgroups']){
              item[key + 'Sign'] = '0000'
            }

            if (JSON.stringify(element) != JSON.stringify(element1)) {
              if (((element === null || element === '' || element === undefined) && element1)) {
                if (['priorityAppDate', 'appDate', 'approvalDate', 'regDate', 'limitDate', 'submitDate', 'validStartDate', 'validEndDate','zdRegDate','zdAppDate','firstUseDate','businessUseDate'].includes(key)) {
                  item[key + 'Str'] = '0000';
                } else {
                  item[key] = '0000';
                }
                // if(key=='validStartDate'){
                //   item['validStartDateStr']='0000';
                // }
                // if(key=='validEndDate'){
                //   item['validEndDateStr']='0000';
                // }
                // priorityAppDateStr、appDateStr、approvalDateStr、regDateStr、limitDateStr、submitDateStr

              }
            } else {


            }
          }
        }
        return item;


      },
      async fetchData() {
        let {data} = await queryCaseInfoUrl({caseIds: this.mainCaseIds, initFlag: 1})
        this.caseDetailFoemData = Object.assign(data, this.caseDetailFoemData);
        // 针对历史异常数据做处理，之前有问题内-外，外-外，存在version版本号未关联的情况，导致后续出现问题
        if(['内-外', '外-外'].includes(this.caseDetailFoemData.appFromto)){
          this.caseDetailFoemData.goods = this.caseDetailFoemData.goods.filter(item => {
            // 如果 version 不为 null，返回 true，保留该元素
            // 如果 version 为 null，返回 false，排除该元素
            return item.version !== null;
          });
        }
        queryReplaceAgencyName().then(res=>{
          this.otherAgencyList = res.data
        })
        queryCaseInfoUrl({caseIds: this.mainCaseIds})
          .then(async response => {
            // let {appId}=response.data
            // await this.appselectChange(appId)

            this.caseDetailFoemData = Object.assign(this.caseDetailFoemData, response.data);
            if (['内-外','外-外'].includes(this.caseDetailFoemData.appFromto)) {
             queryCurrencyUrl().then(res => {
                this.currencyList = res.data
              })
              this.getCheckGoodsList({pageSize: 10})
            }
            this.caseDetailFoemData.isPreChangeAgencyName = 1
            if (this.caseDetailFoemData.agencyOffers && this.caseDetailFoemData.agencyOffers.length) {
              // this.caseDetailFoemData.agencyOffers.forEach(item => {
              //   item.materialIds && this.$set(item, 'materialArray', item.materialIds.map(i => this.caseDetailFoemData.materials.find(j => j.materialId === i)))
              // })
            }
            if (this.caseDetailFoemData.replaceAgencyName !== '北京佰舟知识产权代理有限公司' && this.caseDetailFoemData.whdAgencyName && ['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(this.caseDetailFoemData.whdAgencyName)) {
              queryAgentPerson({
                whdAgencyName: this.caseDetailFoemData.whdAgencyName
              }).then(res => {
                this.agentPersonList = res.data
                if (['内-内', '外-内'].includes(this.caseDetailFoemData.appFromto)) {
                 if (this.caseDetailFoemData.agentPerson && !this.agentPersonList.includes(this.caseDetailFoemData.agentPerson) || this.caseDetailFoemData.appContactPerson && !this.agentPersonList.includes(this.caseDetailFoemData.appContactPerson)) {
                   // this.$message.error('【代理人姓名】或【联系人】不在备案员工范围内')
                 }
                }
              })
            }
            this.backAppFromto = this.caseDetailFoemData.appFromto
            if (this.caseDetailFoemData.caseType == '马德里商标转国内注册') {
              this.caseDetailFoemData.submitType = '线下申请'
              this.rules.gjRegNumber = this.madridRules.gjRegNumber
              this.rules.gjRegDate = this.madridRules.gjRegDate
              this.rules.interLogoutDate = this.madridRules.interLogoutDate
            }
            this.defaultCaseData = JSON.parse(JSON.stringify(response.data))
            // this.caseDetailFoemData.caseType=this.$route.params.caseType
            this.queryCustomerNameIdList = [{
              custId: Number(this.caseDetailFoemData.custId),
              fullname: this.caseDetailFoemData.custName
            }]
            if (this.trademarkList.filter(item => !['答复临时驳回/审查意见（境外）', '提供使用声明/证据（境外）', '商标注册'].includes(item)).includes(this.caseDetailFoemData.caseType)) {
              let appPorpList = ['appCnName', 'appCnName', 'certCode', 'appCnAddr', 'appGJdq', 'legalNature', 'appContactTel', 'appFromto']
              appPorpList.forEach(item => {
                this.$set(this.rules[item][0], 'required', false)
              })
            }

            if (!this.caseDetailFoemData.discount || this.caseDetailFoemData.discount == 'null') {
              // this.caseDetailFoemData.discount = 100;
              this.$set(this.caseDetailFoemData, 'discount', 100)
            }
            this.materialArray = this.caseDetailFoemData.materials;
            this.caseDetailFoemData.joinApps.forEach(item => {
              item.modifyState = false;
            });
            this.caseDetailFoemData.delayRenewal
              ? (this.caseDetailFoemData.delayRenewal = "1")
              : (this.caseDetailFoemData.delayRenewal = "0");
            if (
              /^['C'|'D']$/.test(this.caseDetailFoemData.custLevel) ||
              !this.caseDetailFoemData.custLevel
            ) {
              this.curCustLevel = false;

              queryAlltask({
                userId: this.$store.getters.userId,
                taskId: this.caseDetailFoemData.taskId
              }).then(res => {
                if (res.data && res.data.length && res.data[0].createStatus) {
                  this.curCustLevel = true;
                } else {
                  if (!this.caseDetailFoemData.custLevel) {
                    this.caseDetailFoemData.custId&&queryCustomerContactByCustIdUrl({
                      caseTypeId: this.caseDetailFoemData.caseTypeId,
                      custId: this.caseDetailFoemData.custId
                    })
                      .then(response => {
                        if (response.data.country == '中国') {
                          this.curCustLevel = false;
                        } else {
                          this.curCustLevel = true;
                        }
                      })
                  } else {
                    this.curCustLevel = false;
                  }
                }
              });
            } else {
              this.curCustLevel = true;
            }
            //给省/市/区赋值
            if (this.caseDetailFoemData.appRegionalism) {
              this.splitAddressFunc(this.caseDetailFoemData.appRegionalism.replace(/#/g,''))
            }else{
              this.splitAddressFunc(this.caseDetailFoemData.appCnAddr)
            }

            this.changeElstepList()
            // if (!this.trademarkList.includes(this.caseDetailFoemData.caseType)) {
            //   this.elstepList = [
            //     {title: "案件详情", state: true, id: "ajxq-title"},
            //     {title: "案件详情", state: true, id: "ajxq-title"},
            //     {
            //       title: "商标信息",
            //       state:
            //         this.trademarkList.includes(this.caseDetailFoemData.caseType) ||
            //         this.mainCaseIds.length === 1,
            //       id: "sbxx-title"
            //     },
            //     {
            //       title: "商标申请说明",
            //       state: this.trademarkList.includes(this.caseDetailFoemData.caseType),
            //       id: "sbsqsm-title"
            //     },
            //     {title: "客户信息", state: true, id: "khxx-title"},
            //     {title: "申请人信息", state: true, id: "sqrxx-title"}
            //   ].filter(item => item.state);
            // } else {
            //   this.elstepList = [
            //     {title: "案件详情", state: true, id: "ajxq-title"},
            //     {title: "申请人信息", state: true, id: "sqrxx-title"},
            //     {
            //       title: "商标信息",
            //       state:
            //         this.trademarkList.includes(this.caseDetailFoemData.caseType) ||
            //         this.mainCaseIds.length === 1,
            //       id: "sbxx-title"
            //     },
            //     {
            //       title: "商标申请说明",
            //       state: this.trademarkList.includes(this.caseDetailFoemData.caseType),
            //       id: "sbsqsm-title"
            //     },
            //     {title: "客户信息", state: true, id: "khxx-title"}
            //   ].filter(item => item.state);
            // }
            if (this.caseDetailFoemData.appId) {
              queryAppAddrByAppIdUrl({
                appId: this.caseDetailFoemData.appId
              }).then(res => {
                this.selectData.appaddr = res.data;
              });
            }
            if (
              this.tmlist.includes(this.caseDetailFoemData.caseType) &&
              this.$route.query.import !== "1"
            ) {
              this.regNumberList = [
                {
                  regNumber: this.caseDetailFoemData.regNumber
                }
              ];
            }
            if (!this.caseDetailFoemData.caseLevel) {
              this.caseDetailFoemData.caseLevel = 1;
            }
            if (!this.caseDetailFoemData.otherAgency) {
              this.caseDetailFoemData.otherAgency = "0";
            }
            if (!this.caseDetailFoemData.assignColor) {
              this.caseDetailFoemData.assignColor = false;
            }
            if (this.caseDetailFoemData.trademarkCaseCustWorkgroups.length <= 0) {
              this.caseDetailFoemData.trademarkCaseCustWorkgroups = [
                {wkgId: "", trademarkCaseWorkgroupMembers: []}
              ];
            }
            // if (this.caseDetailFoemData.trademarkCaseCBWorkgroups.length <= 0) {
            //   this.caseDetailFoemData.trademarkCaseCBWorkgroups = [
            //     { trademarkCaseWorkgroupMembers: [] }
            //   ];
            // }
            // if (this.caseDetailFoemData.trademarkCaseLCWorkgroups.length <= 0) {
            //   this.caseDetailFoemData.trademarkCaseLCWorkgroups = [
            //     { trademarkCaseWorkgroupMembers: [] }
            //   ];
            // }
            if (this.caseDetailFoemData.imageFile) {
              if (/^tmFile|\/tmFile/.test(this.caseDetailFoemData.imageFile)) {
                this.tyimage = `${this.caseDetailFoemData.imageFile}`;
              } else {
                this.tyimage = `/ipdoc${this.caseDetailFoemData.imageFile}`;
              }

            }
            this.getCreatData();
          })
          .catch(err => {
            console.log(err);
          });
      },
      getFileData(materialTypeId) {
      },
      getCrestDataUp() {
      },
      getCreatData() {
        this.initfilelist();
        // getUser().then(res=>{
        //   this.selectData.personList=res.data
        // })

        if (this.caseDetailFoemData.agencyCustId) {
          queryCustomerUrl({
            customerID: this.caseDetailFoemData.agencyCustId
          }).then(res => {
            this.selectData.customerContactswf = res.data.customerContacts;
            this.selectData.customerAddrs = res.data.customerAddrs;
            this.selectData.customerAddrs = this.selectData.customerAddrs.filter(i => i.addressCn || i.addressEn);
          });
        }
        if (this.caseDetailFoemData.priorityType == "0") {
          this.ifpriority = "0";
        } else {
          this.ifpriority = "1";
        }

        queryCountryCaseUrl()
          .then(response => {
            this.selectData.casecount = response.data;
          })
          .catch(err => {
            console.log(err);
          });

        queryCountry()
          .then(response => {
            this.selectData.country = response.data;
          })
          .catch(err => {
            console.log(err);
          });
        this.caseDetailFoemData.custId&&queryAppInfoUrl({custId: this.caseDetailFoemData.custId, caseTypeId: this.caseDetailFoemData.caseTypeId})
          .then(response => {
            this.selectData.apps = response.data;
            if (
              this.tmlist
                .filter(item => item !== "变名变址")
                .includes(this.caseDetailFoemData.caseType) &&
              this.$route.query.import === "1"
            ) {
              let applicantName = JSON.parse(
                sessionStorage.getItem("changeOfNameOrAddressObj")
              ).appObj.applicantName;

              this.caseDetailFoemData.appCnName = applicantName;
            }
          })
          .catch(err => {
            console.log(err);
          });
        queryOtherCustomerListUrl({isCollaboration: "1",collaborationStatusArray:[2249,2250]})
          .then(response => {
            this.selectData.hzLists = response.data;
            this.selectData.hzLists.forEach(item => {
              item.label = item.fullname + (item.fullnameEn ? ` (${item.fullnameEn})` : '')

              // item.id=item.custId
              // item.name=item.fullname
              item.value = item.custId
            })
          })
          .catch(err => {
            console.log(err);
          });

        if (this.caseDetailFoemData.appId) {
          queryAppContactUrl({appId: this.caseDetailFoemData.appId}).then(
            ite => {
              this.selectData.queryAppContact = ite.data;
            }
          );
        } else {
          this.selectData.queryAppContact = [];
          this.$set(this.caseDetailFoemData, 'appContactPerson', '')
          //  this.caseDetailFoemData.appContactPerson = "";
        }
        this.caseDetailFoemData.custId&&queryCustomerContactByCustIdUrl({
          caseTypeId: this.caseDetailFoemData.caseTypeId,
          custId: this.caseDetailFoemData.custId
        })
          .then(response => {
            this.custCountry = response.data.country
            // this.selectData.country = response.data;
            this.selectData.customerContacts = response.data.customerContacts;
            this.selectData.billContacts = response.data.BillContacts;
          })
          .catch(err => {
            console.log(err);
          });
        queryCustomerContactByCustContactIdUrl({
          custContactId: this.caseDetailFoemData.custContactId
        }).then(res => {
          this.selectData.customerMailAdds = res.data.customerMailAdds;
          this.selectData.billAdds = res.data.BillAdds;
          this.selectData.billAdds.forEach(item => {
            if (!item.addressCn) {
              item.addressCn = item.addressEn;
            }
          });
        });
      },
      getTopPosition(el, active) {
        this.stepActive1 = active;
        document.getElementById(el).scrollIntoView();
        // scrollTo(
        //   document.getElementById("main-container").scrollTop +
        //     document.getElementById(el).getBoundingClientRect().top -
        //     document.getElementsByClassName("fixed-header")[0].offsetHeight -
        //     document.getElementById(el).offsetTop,
        //   300
        // );
      },
      async filingOperation(command) {
        if(await this.checkGoods()){
          return
        }
        if (this.caseDetailFoemData.replaceAgencyName !== '北京佰舟知识产权代理有限公司' && ['内-内', '外-内'].includes(this.caseDetailFoemData.appFromto) && ['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(this.caseDetailFoemData.whdAgencyName)) {
         if (this.caseDetailFoemData.agentPerson && !this.agentPersonList.includes(this.caseDetailFoemData.agentPerson) || this.caseDetailFoemData.appContactPerson && !this.agentPersonList.includes(this.caseDetailFoemData.appContactPerson)) {
           // todo
           // this.$message.error('【代理人姓名】或【联系人】不在备案员工范围内')
           // return
         }
        }
        // 内-外，外外进行版本号填写提示
        if(['内-外', '外-外'].includes(this.caseDetailFoemData.appFromto)){
          if (this.caseDetailFoemData.goods.find(item => !item.version)){
            this.changeAppFromto(this.caseDetailFoemData.appFromto)
            return
          }
        }
        if(!this.$commonUtils.checkBA(this.caseRoleSelectList)){
          this.$message.error('承办律师或客户律师有误！')
          return
        }
        if (this.caseDetailFoemData.caseType == '马德里商标转国内注册') {
          if (!this.caseDetailFoemData.gjRegDate) {
            return this.$message.error('请填写国际注册日期')
          }
          if (!this.caseDetailFoemData.interLogoutDate) {
            return this.$message.error('请填写国际注销登记日期')
          }
          if (!this.caseDetailFoemData.gjRegNumber) {
            return this.$message.error('请填写国际注册号')
          }
        }
        if (command === "prefiling") {
          this.submitCaseForm("prefiling", 1);
        } else if (command == "createBills") {
          this.$router.push({
            path: "/workbench/finance/off_bill/bill",
            query: {
              taskId: this.caseDetailFoemData.taskId,
              agentNum: this.caseDetailFoemData.agentNum
            }
          });
        } else {
          if (this.caseDetailFoemData.appId) {
            const res = await queryCaseAppExamine({appIds: [this.caseDetailFoemData.appId], caseIds: [this.caseDetailFoemData.caseId]})
            if (res.messageType == 300) {
              this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
              return;
            }
          }
          billSubmitUrl({
            taskId: this.caseDetailFoemData.taskId,
            userId: this.$store.getters.userId
          }).then(res => {
            this.goNext();
          });
        }
      },
      //检查申请人中文名称空格
      async checkSpaces(){
        return new Promise((resolve, reject) => {
          if ((this.caseDetailFoemData.appFromto == '内-内'||this.caseDetailFoemData.appFromto == '外-内')&&this.caseDetailFoemData.submitType == '网上申请' && this.caseDetailFoemData.appCnName) {
            const regex = /[\s\u3000]/g;
            if (regex.test(this.caseDetailFoemData.appCnName)) {
              MessageBox.confirm('网上申请限制申请人中文名称不能有空格，是否去除？', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning',
                showClose: false
              }).then(() => {
                this.caseDetailFoemData.appCnName = this.caseDetailFoemData.appCnName.replace(regex, '')
                resolve()
              }).catch(() => {
                resolve()
              })
            }else{
              resolve()
            }
          }else{
            resolve()
          }
        })
      },
      async submitCaseForm(forwordType, checkCase) {
        if ((checkCase !== 0 || this.$route.query.flag == 'noCheck') && this.caseDetailFoemData.appCnName && !this.selectData.apps.find(i => String(i.applicantName).toLowerCase() === String(this.caseDetailFoemData.appCnName).toLowerCase())) {
          await this.$confirm('建立新申请人需要提交客户管理组刘佳审核，审核通过后方可继续立卷', '提示', {
            confirmButtonText: '提交审核',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.caseDetailFoemData.appSub = 1
            this.caseDetailFoemData.appId = '0000'
          }).catch(() => {
            this.caseDetailFoemData.appSub = 0
            this.caseDetailFoemData.appId = '0000'
            // this.caseDetailFoemData.appCnName = '0000'
          })
        }
        if(await this.checkGoods()){
          return
        }
        await this.checkSpaces()
        if (this.caseDetailFoemData.replaceAgencyName !== '北京佰舟知识产权代理有限公司' && ['内-内', '外-内'].includes(this.caseDetailFoemData.appFromto) && ['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(this.caseDetailFoemData.whdAgencyName)) {
         if (this.caseDetailFoemData.agentPerson && !this.agentPersonList.includes(this.caseDetailFoemData.agentPerson) || this.caseDetailFoemData.appContactPerson && !this.agentPersonList.includes(this.caseDetailFoemData.appContactPerson)) {
           // todo
           // this.$message.error('【代理人姓名】或【联系人】不在备案员工范围内')
           // return
         }
        }
        // 内-外，外外进行版本号填写提示
        if(['内-外', '外-外'].includes(this.caseDetailFoemData.appFromto)){
          if (this.caseDetailFoemData.goods.find(item => !item.version)){
            this.changeAppFromto(this.caseDetailFoemData.appFromto)
            return
          }
        }
        if(!this.$commonUtils.checkBA(this.caseRoleSelectList)){
          this.$message.error('承办律师或客户律师有误！')
          return
        }
        delete this.caseDetailFoemData.materials;
        delete this.caseDetailFoemData.caseEvolve;
        this.caseDetailFoemData.caseIds = this.mainCaseIds;
        if (
          this.$route.query.import == "1" &&
          this.tmlist.includes(this.caseDetailFoemData.caseType)
        ) {
          delete this.caseDetailFoemData.imageFile;
          let sessionObj = JSON.parse(
            sessionStorage.getItem("changeOfNameOrAddressObj")
          );
          var data2 = {
            regNumberList: sessionObj.multipleSelection.map(
              item => item.regNumber
            ),
            tmIdList: sessionObj.multipleSelection.map(item => item.tmId),
            multiclass: sessionObj.multiclass,
            taskId: this.caseDetailFoemData.taskId
          };
          if (this.caseDetailFoemData.caseType === "变名变址") {
            data2.appNameList = [
              {
                before: sessionObj.appObj.applicantName,
                cn: this.$refs.changeOfNameAndAddress.tmObj.applicantName,
                en: this.$refs.changeOfNameAndAddress.tmObj.applicantEnName
              }
            ];
            data2.appAddressList = this.$refs.changeOfNameAndAddress.defaultbeforeAddress.map(
              (item, index) => {
                return {
                  before: item.addressCn,
                  cn: this.$refs.changeOfNameAndAddress.beforeAddress[index]
                    .addressCn,
                  en: this.$refs.changeOfNameAndAddress.beforeAddress[index]
                    .addressEn
                };
              }
            );
            // data2.preAppId = sessionObj.appObj.appId;
          }
          data2.isBatch = "1";
        }
        if (
          this.$route.query.import != "1" &&
          this.tmlist.includes(this.caseDetailFoemData.caseType)
        ) {
          var data2 = {
            regNumberList: [this.caseDetailFoemData.regNumber],
            taskId: this.caseDetailFoemData.taskId
          };
          if (this.caseDetailFoemData.caseType === "变名变址") {


            data2.appNameList = [
              {
                before: this.$refs.changeOfNameAndAddress.tmObj.preAppName,
                cn: this.defaultCaseData.preChangeCnName && !this.$refs.changeOfNameAndAddress.tmObj.applicantName ? '0000' : this.$refs.changeOfNameAndAddress.tmObj.applicantName,
                en: this.defaultCaseData.preChangeEnName && !this.$refs.changeOfNameAndAddress.tmObj.applicantEnName ? '0000' : this.$refs.changeOfNameAndAddress.tmObj.applicantEnName //this.$refs.changeOfNameAndAddress.tmObj.applicantName
              }
            ];
            data2.appAddressList = [
              {
                before: this.$refs.changeOfNameAndAddress.tmObj.preAddress,
                cn: this.defaultCaseData.preChangeCnAdress && !this.$refs.changeOfNameAndAddress.tmObj.addressCn ? '0000' : this.$refs.changeOfNameAndAddress.tmObj.addressCn,
                en: this.defaultCaseData.preChangeEnAdress && !this.$refs.changeOfNameAndAddress.tmObj.addressEn ? '0000' : this.$refs.changeOfNameAndAddress.tmObj.addressEn
                //this.$refs.changeOfNameAndAddress.tmObj.addressCn
              }
            ];
          }
          data2.isBatch = "0";
        }
        if (this.caseDetailFoemData.caseType === "变名变址") {
          var data = Object.assign(
            {},
            this.getChangedata(),
            this.$refs.changeOfNameAndAddress.tmObj,
            data2
          );
          delete data.preChangeCnName;
          delete data.preChangeEnName;
          delete data.preChangeCnAdress;
          delete data.preChangeEnAdress;
          delete data.preAppName;
          delete data.preAddress;
        } else if (
          this.tmlist
            .filter(item => item !== "变名变址")
            .includes(this.caseDetailFoemData.caseType)
        ) {
          var data = Object.assign({}, this.getChangedata(), data2);
        } else {
          var data = Object.assign({}, this.getChangedata());
        }
        data.checkCase = checkCase;
        let flag = this.caseDetailFoemData.agentNum.includes('NO')
        if (!flag) {
          if (this.caseDetailFoemData.caseType == '马德里商标转国内注册') {
            if (!this.caseDetailFoemData.gjRegDate) {
              return this.$message.error('请填写国际注册日期')
            }
            if (!this.caseDetailFoemData.interLogoutDate) {
              return this.$message.error('请填写国际注销登记日期')
            }
            if (!this.caseDetailFoemData.gjRegNumber) {
              return this.$message.error('请填写国际注册号')
            }
          }
          if (this.caseDetailFoemData.caseType == '马德里商标转国内注册') {
          if (!this.caseDetailFoemData.gjRegDate) {
            return this.$message.error('请填写国际注册日期')
          }
          if (!this.caseDetailFoemData.interLogoutDate) {
            return this.$message.error('请填写国际注销登记日期')
          }
          if (!this.caseDetailFoemData.gjRegNumber) {
            return this.$message.error('请填写国际注册号')
          }
        }
        if (this.caseDetailFoemData.submitType == "网上申请" && ['内-内', '外-内'].includes(this.caseDetailFoemData.appFromto)) {
          const uploadFileProperty = this.trademarkList.includes(this.caseDetailFoemData.caseType)?
            this.caseDetailFoemData.appCertFileIsCn == '是':
            this.caseDetailFoemData.uploadFileLanguage =='中文'
          if (
            this.caseDetailFoemData.legalNature == "自然人" &&
            !uploadFileProperty
          ) {
            if (!this.fileName[1002]) {
              this.$message.error("请上传身份证明文件(外文)");
              return;
            }
          }
          if (
            this.caseDetailFoemData.legalNature == "自然人" &&
            uploadFileProperty
          ) {
            if (!this.fileName[1001]) {
              this.$message.error("请上传身份证明文件");
              return;
            }
          }

          if (
            this.caseDetailFoemData.legalNature != "自然人" &&
            !uploadFileProperty
          ) {
            if (!this.fileName[1004]) {
              this.$message.error("请上传主体资格证明文件(外文)");
              return;
            }
          }
          if (
            this.caseDetailFoemData.legalNature != "自然人" &&
            uploadFileProperty
          ) {
            if (!this.fileName[1003]) {
              this.$message.error("请上传主体资格证明文件");
              return;
            }
          }

          if (
            this.caseDetailFoemData.appGJdq != "中国大陆" &&
            this.caseDetailFoemData.appGJdq != "中国" &&
            this.caseDetailFoemData.appGJdq != "中国香港" &&
            this.caseDetailFoemData.appGJdq != "中国澳门" &&
            this.caseDetailFoemData.appGJdq != "中国台湾"
          ) {
            if (!this.caseDetailFoemData.appCountryOrRegion) {
              this.$message.error("请填写申请人国家或地区");
              return;
            }
          }
          if (!this.wtsfileList) {
            this.$message.error("请上传代理委托书");
            return;
          }
          if (this.trademarkList.includes(this.caseDetailFoemData.caseType)) {
            if (
              this.caseDetailFoemData.goods &&
              this.caseDetailFoemData.goods.length <= 0
            ) {
              this.$message.error("请选择商品类别");
              return;
            }
            if (!this.tyimage) {
              this.$message.error("请上传商标图样");
              return;
            }

            if (!this.caseDetailFoemData.tmDesignDeclare) {
              this.$message.error("请填写商标设计说明");
              return;
            }
          }
          if (
            this.caseDetailFoemData.caseType != "商标续展" &&
            this.caseDetailFoemData.appGJdq != "中国大陆" &&
            this.caseDetailFoemData.appGJdq != "中国" &&
            this.caseDetailFoemData.appGJdq != "中国香港" &&
            this.caseDetailFoemData.appGJdq != "中国澳门" &&
            this.caseDetailFoemData.appGJdq != "中国台湾"
          ) {
            if (!this.caseDetailFoemData.appEnName) {
              this.$message.error("请填写申请人英文名称");
              return;
            }
            if (!this.caseDetailFoemData.appEnAddr) {
              this.$message.error("请填写申请人英文地址");
              return;
            }
          }

          // if (this.trademarkList.includes(this.caseDetailFoemData.caseType)) {
          //   if (!this.caseDetailFoemData.appCertFileIsCn) {
          //     this.$message.error("请选择证明文件是否为中文");
          //     return;
          //   }
          // }
        }
        if (this.trademarkList.includes(this.caseDetailFoemData.caseType)) {
          if (this.ifpriority == '1') {
            if (!['1', '2'].includes(this.caseDetailFoemData.priorityType)) {
              this.$message.error("请选择要求优先权声明");
              return;
            }
            if (this.caseDetailFoemData.isLoadPriorityFile == '0' && !this.fileName[1017]) {
              this.$message.error("请上传优先权证明文件");
              return;
            }
          }
        }
        if (this.caseDetailFoemData.ifShareTm == '1' && !this.caseDetailFoemData.joinApps.filter(item => item.type != 4).length) {
          this.$message.error("请添加共同申请人");
          return;
        }
        if(!this.caseDetailFoemData.caseCustRespUserArray ||
           !this.caseDetailFoemData.caseCustRespUserArray.length){
          this.$message.error('请选择客户负责人')
          return false
        }
        }
        this.$refs["postForm"].validate(valid => {
          if (flag||valid) {
          // if (true) {
            if (this.$route.query.operate==='many') {
              const manyData = {
              appFromto:this.caseDetailFoemData.appFromto,
              submitType:this.caseDetailFoemData.submitType,
              chiming:this.caseDetailFoemData.chiming,
              custId:this.caseDetailFoemData.custId,
              custRefno:this.caseDetailFoemData.custRefno,
              custContactId:this.caseDetailFoemData.custContactId,
              appCnName:this.caseDetailFoemData.appCnName,
              appCnAddr:this.caseDetailFoemData.appCnAddr,
              legalNature:this.caseDetailFoemData.legalNature,
              appGJdq:this.caseDetailFoemData.appGJdq,
              appContactPerson:this.caseDetailFoemData.appContactPerson,
              respondentNameCn:this.caseDetailFoemData.respondentNameCn
            }
              data = Object.assign(data,manyData)
            }
            //获取省/市/区名称并通过#拼接，如果没有某一个值就不要#拼接
            if (this.caseDetailFoemData.appGJdq=='中国') {
              const province = this.provinceList.find(item => item.regionCode == this.address.province) || {}
              const city = this.cityList.find(item => item.regionCode == this.address.city) || {}
              const district = this.districtList.find(item => item.regionCode == this.address.district) || {}
              data.appRegionalism = `${province.abbrName}${city.abbrName?`#${city.abbrName}`:''}${district.abbrName?`#${district.abbrName}`:''}`
            }else{
              data.appRegionalism = ''
            }

            const params = {...data,importByCase:this.$route.query.importByCase,piliang:this.$route.query.importByCase}
            saveCaseInfoUrl(params)
              .then(async response => {
                if (response.messageType == -6) {
                  this.$confirm(
                    response.message + " 当前案件是否继续保存",
                    "提示",
                    {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning"
                    }
                  ).then(() => {
                    this.submitCaseForm(forwordType, 0);
                  });
                  return;
                }
                if (forwordType && forwordType === "prefiling") {
                  if (valid) {
                    if (this.caseDetailFoemData.appId) {
                      const res = await queryCaseAppExamine({appIds: [this.caseDetailFoemData.appId], caseIds: [this.caseDetailFoemData.caseId]})
                      if (res.messageType == 300) {
                        this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
                        return;
                      }
                    }
                    getCaseTime({caseIds: this.mainCaseIds}).then(res => {
                      if (res.messageType == 12) {
                        this.$confirm(res.message,
                          "提示",
                          {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                          }
                        ).then(() => {
                          this.$router.push({
                            path: "/workbench/case/preFilingPush/1",
                            query: {taskId: this.caseDetailFoemData.taskId, taskType: 1}
                          });
                          // this.goNext();
                        });
                        return;
                      }
                      if (res.messageType == 13) {
                        this.caseData = res.data
                        this.prefiling = true
                        this.poppingTimeLimitState = true
                        return;
                      }
                      this.$router.push({
                        path: "/workbench/case/preFilingPush/1",
                        query: {taskId: this.caseDetailFoemData.taskId, taskType: 1}
                      });
                    })
                  } else {
                    this.$message.error('请填写必填项')
                  }
                  // this.$router.push({
                  //   path: "/workbench/case/preFilingPush/1",
                  //   query: { taskId: this.caseDetailFoemData.taskId }
                  // });
                } else {
                  this.$message.success("保存成功");
                  this.goNext();
                }
              })
              .catch(err => {
              });
          } else {
            this.$message.error("请填写必填项");
            return false;
          }
        });
      },
      goNext() {
        this.$store.commit('caseInformation/SET_PREONLYID', this.caseDetailFoemData.caseId)
        if (this.caseDetailFoemData.usAgency) {
          this.$router.push("/workbench/case/us_cases");
          return
        }
        if (this.prePage === "案件管理") {
          this.$router.push("/workbench/case/case_management?myCase=2");
        }
        if (this.prePage === "立卷") {
          this.$router.replace("/workbench/case/case_management?myCase=3");
        }
        if (this.prePage === "批量立卷") {
          this.$router.go(-1);
        }
      },
      changePriority(e) {
        if (e == 0) {
          this.caseDetailFoemData.priorityType = 0;
          // this.caseDetailFoemData.priorityType=null;
          this.caseDetailFoemData.priorityBaseCrty = null
          this.caseDetailFoemData.priorityAppDate = null
          this.caseDetailFoemData.priorityAppNum = null
        } else {
          this.caseDetailFoemData.priorityType = '1'
        }
        this.caseDetailFoemData.isLoadPriorityFile = e
      },
      async getfileData(materialTypeId, e) {
        // if(materialTypeId == '410'){
        //   this.clientState = true
        // }else{
        //   this.clientState = false
        // }
        let coverImage = 0
        if (materialTypeId == '1018' && this.caseDetailFoemData.caseType == '商标注册' && ['内-内', '外-内'].includes(this.caseDetailFoemData.appFromto)) {
          try {
            const flag = await checkImageInstruction({caseIds: this.mainCaseIds +　''})
            if (flag.data && !await this.$confirm('该案件已有商标图样，请确认是否覆盖？', '提示', {
              confirmButtonText: '覆盖',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              coverImage = 1
              return true
            }).catch(() => {
              coverImage = 0
              return false
            })) return
          } catch (e) {

          }
        }
        if (materialTypeId == "1000") {
          this.multipleFileList = this.wtsfileList;
        }
        this.curUploadTitle = e.target.offsetParent.previousSibling.innerText.replace(
          /[:]$/g,
          ""
        );
        let data = {
          coverImage,
          caseIds: this.mainCaseIds,
          custId: this.caseDetailFoemData.custId,
          type: "2",
          caseId: this.caseDetailFoemData.caseId,
          materialTypeId: materialTypeId,

          tokenID: this.token
        };
        if (this.caseDetailFoemData.appId) {
          data.applicantId = this.caseDetailFoemData.appId;
        }
        if (this.joinFormData.joinAppId) {
          data.joinAppId = this.joinFormData.joinAppId;
        }
        this.fileData1 = data;
        this.DataUploadOrSelectState = true;
      },
      fileData(joinAppId, getFileIsEn) {
        let data = {
          caseIds: this.mainCaseIds,
          custId: this.caseDetailFoemData.custId,
          type: "2",
          caseId: this.caseDetailFoemData.caseId,
          materialTypeId: getFileIsEn ? 1038 : 1037,
          tokenID: this.token
        };
        //if (this.joinFormData.joinAppId) {
        data.joinAppId = joinAppId;
        //}
        return data;
      },
      getResponseAndFile(data) {
        let {response, file} = data;
        if(!response.data[0].materialId)return;
        if (response.data.length == "1") {
          if (this.dialogFormjoin) {
              this.$set(this.joinFormData, 'fileName', [response.data[0].materialName])
            }
          if (response.data[0].materialTypeId == "1000") {
            response.data[0].name = response.data[0].materialName;
            this.wtsfileList.push(response.data[0])
          } else {
            if (
              this.materialArray.find(
                item => item.materialTypeId == response.data[0].materialTypeId
              )
            ) {
              for (var key in response.data[0]) {
                this.materialArray.find(
                  item => item.materialTypeId == response.data[0].materialTypeId
                )[key] = response.data[0][key];
              }
            } else {
              this.materialArray.push(response.data[0]);
            }
          }
          if (file) {
            this.fileName[response.data[0].materialTypeId] = file.name;
          } else {
            this.fileName[response.data[0].materialTypeId] =
              response.data[0].materialName;
          }

          if (response.data[0].materialTypeId == "1018") {
            console.log(file);
            if (file) {
              this.tyimage = URL.createObjectURL(file.raw);
              this.caseDetailFoemData.imageFile = response.data[0].address
            } else {
              this.tyimage = "ipdoc/" + response.data[0].address;
              this.caseDetailFoemData.imageFile = response.data[0].address
            }
          }
          if (
            ["1037", "1038", "1039", "1040"].includes(
              response.data[0].materialTypeId.toString()
            )
          ) {
            this.joinFormData.materialArray.push(response.data[0]);
          }
        }
      },
      deleteFile({materialTypeId, materialId}) {
        let delmaterialId;
        if (!this.materialArray.find(item => item.materialTypeId == materialTypeId) && materialTypeId == 1018) {
          this.caseDetailFoemData.imageFile = '0000'
          this.tyimage = ''
          return
        }
        if (!materialId) {
          delmaterialId = this.materialArray.find(item => item.materialTypeId == materialTypeId).materialId;
        } else {
          delmaterialId = materialId;
        }
        delCaseMaterialUrl({
          caseIdArray: this.mainCaseIds,
          materialId: delmaterialId
        }).then(res => {
          this.fileName[materialTypeId] = "";
          if (materialTypeId == 1018) {
            this.caseDetailFoemData.imageFile = '0000'
            this.tyimage = ''
          }
          if (materialId && materialTypeId == "1000") {
            this.wtsfileList.splice(
              this.wtsfileList.map(item => item.materialId).indexOf(materialId),
              1
            );
          }
          // if (!materialId) {
          //
          //
          // } else {
          //
          // }
        });
      },
      fileUploadSuccess(response, file, fileList, index) {
        if (response.data.length == "1") {
          this.fileName[response.data[0].materialTypeId] = file.name;
          if (response.data[0].materialTypeId == "1018") {
            this.tyimage = URL.createObjectURL(file.raw);
          }
          if (index !== undefined) {
            response.data[0].name = response.data[0].materialName;
            this.caseDetailFoemData.joinApps[index]["materialArray"].splice(
              0,
              1,
              response.data[0]
            );
            console.log(this.caseDetailFoemData.joinApps);
          }
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
          caseIdArray: this.mainCaseIds,
          materialId: delmaterialId
        }).then(res => {
          this.$message.success(res.message);
          this.wtsfileList = this.wtsfileList.filter(
            item => item.materialId != delmaterialId
          );
          this.zhuxiaofileList = this.zhuxiaofileList.filter(
            item => item.materialId != delmaterialId
          );
        });
      },
      appselectChange(app, applicantAddress, applicantEnAddress) {

        var e = {};
        if (this.appId) {
          this.appId = null
          return;
        } else {
          this.selectData.apps.forEach(ite => {
            if (ite.applicantName == app) {
              e = ite;
              return;
            }
          });
          if (!e) {
            this.caseDetailFoemData.appId = "";
            return;
          }
        }
        // this.caseDetailFoemData.appCnName = e.applicantName;
        this.caseDetailFoemData.appId = e.appId;
        this.caseDetailFoemData.appEnName = e.applicantEnName;
        this.caseDetailFoemData.legalNature = e.appType;
        this.caseDetailFoemData.appGJdq = e.sendType;
        if (applicantAddress) {
          this.caseDetailFoemData.appCnAddr = applicantAddress;
          this.caseDetailFoemData.appEnAddr = applicantEnAddress;

        } else {
          this.caseDetailFoemData.appCnAddr = e.applicantAddress;
          this.caseDetailFoemData.appEnAddr = e.applicantEnAddress;
        }
        this.caseDetailFoemData.appCountryOrRegion = e.country;
        this.caseDetailFoemData.certCode = e.certCode;
        this.caseDetailFoemData.appCertificateNum = e.cardNumber;
        this.caseDetailFoemData.appCertificate = e.cardName;

        if (e.appId) {
          // applicantName:''
          queryAppContactUrl({appId: e.appId}).then(ite => {
            this.selectData.queryAppContact = ite.data;
          });
          queryAppAddrByAppIdUrl({appId: e.appId}).then(res => {
            this.selectData.appaddr = res.data;
          });
        } else {
          this.selectData.queryAppContact = [];
          this.caseDetailFoemData.appContactPerson = "";
        }

        if (
          this.tmlist
            .filter(item => item !== "变名变址")
            .includes(this.caseDetailFoemData.caseType) &&
          this.$route.query.import != "1"
        ) {
          this.queryModuleData.custId = this.caseDetailFoemData.custId;
          this.queryModuleData.appId = e.appId;
          this.queryModuleData.caseTypeId = this.caseDetailFoemData.caseTypeId;
          this.queryCanProcessTmState = true;
        }
      },
      remoteMethodApp(query, cb) {
        queryAllUrl({pageNo: 1, pageSize: 100, applicantName: query, orderBy: 1}).then(res => {
          res.data.forEach(item => {
            item.value = item.applicantName
          })
          cb(res.data.filter(this.createStateFilter(query)))
        });
      },
      handleSelect(item) {
        this.joinFormData.nameEn = item.applicantEnName
        this.joinFormData.addrCn = item.applicantAddress
        this.joinFormData.addrEn = item.applicantEnAddress
      },
      remotepinput(query, cb) {
        console.log(query);
        // return
        // this.clearTmMessage();
        console.log(query, "target.value");
        var restaurants = this.selectData.apps.map(ite => {
          if (ite.applicantName) {
            ite.value = ite.applicantName
            return ite;
          } else {
            ite.value = ''
            return ite;
          }
        });
        var results = query
          ? restaurants.filter(this.createStateFilter(query))
          : restaurants;
        cb(results);
      },
      createStateFilter(queryString) {
        return state => {
          return (
            state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
          );
        };
      },
      clearTmMessage(e) {
        console.log(11, e)
        this.caseDetailFoemData.respondentAgency = ''
        this.caseDetailFoemData.goodClasses = "";
        this.caseDetailFoemData.imageFile = "";
        this.caseDetailFoemData.approvalNo = "";
        this.caseDetailFoemData.approvalNumber = "";
        this.caseDetailFoemData.approvalDate = "";
        this.caseDetailFoemData.regNumber = "";
        this.caseDetailFoemData.parentAppNumber = "";
        this.caseDetailFoemData.parentDocNumber = "";
        this.caseDetailFoemData.docDate = "";
        this.caseDetailFoemData.regDate = "";
        this.caseDetailFoemData.validStartDate = "";
        this.caseDetailFoemData.validEndDate = "";
        this.caseDetailFoemData.tmName = "";
        this.caseDetailFoemData.tmNameEn = "";
        this.caseDetailFoemData.quoteTm = "";
        this.caseDetailFoemData.quoteTmClass = "";
        this.caseDetailFoemData.quoteRegNumber = "";
        this.caseDetailFoemData.tmOfficeNumber = "";
        this.caseDetailFoemData.docDate = "";
        (this.caseDetailFoemData.quoteRegNumber = ""),
          (this.caseDetailFoemData.goods = []),
          (this.caseDetailFoemData.appDate = ""),
          (this.caseDetailFoemData.appNumber = ""),
          (this.caseDetailFoemData.tmType = "1"),
          (this.caseDetailFoemData.memberRule = ""),
          (this.caseDetailFoemData.memberNamelist = "");
      },
      wfAgentChange(id) {
        if (id) {
          queryCustomerUrl({customerID: id}).then(res => {
            this.selectData.customerContactswf = res.data.customerContacts;
            this.selectData.customerAddrs = res.data.customerAddrs;
            this.selectData.customerAddrs = this.selectData.customerAddrs.filter(i => i.addressCn || i.addressEn);
            this.caseDetailFoemData.agencyCustAddrId = "";
            this.caseDetailFoemData.agencyCustContactId = "";
          });
        }

      },
      // contactchange(id){
      //   queryCustomerContactByCustIdUrl({
      //
      //     custContactId:id
      //   })
      //     .then(response => {
      //       // this.selectData.country = response.data;
      //       this.selectData.customerContacts = response.data.customerContacts
      //       this.selectData.billContacts = response.data.BillContacts
      //       this.selectData.customerMailAdds = response.data.customerMailAdds
      //       this.selectData.billAdds = response.data.BillAdds
      //
      //
      //     })
      //     .catch(err => {
      //       console.log(err)
      //     })
      // },
      contactchange(id) {
        queryCustomerContactByCustContactIdUrl({custContactId: id}).then(
          res => {
            this.selectData.customerMailAdds = res.data.customerMailAdds;
            this.selectData.billAdds = res.data.BillAdds;
            this.selectData.billAdds.forEach(item => {
              if (!item.addressCn) {
                item.addressCn = item.addressEn;
              }
            });
          }
        );
      },
      contactSelectChange(item) {
        var e = {};
        this.selectData.queryAppContact.forEach(ite => {
          if (ite.nameCn == item) {
            e = ite;
            return;
          }
        });
        this.$set(this.caseDetailFoemData, 'appContactZip', e.post)
        this.$set(this.caseDetailFoemData, 'appContactTel', e.telphone)
        this.$set(this.caseDetailFoemData, 'appContactEmail', e.email)
        // this.caseDetailFoemData.appContactZip = e.post;
        // this.caseDetailFoemData.appContactTel = e.telphone;
        // this.caseDetailFoemData.appContactEmail = e.email;
      },
      initfilelist() {
        this.caseDetailFoemData.materials.forEach(ite => {
          this.fileName[ite.materialTypeId] = ite.materialName;
          if (ite.materialTypeId == "1000") {
            this.wtsfileList.push(ite);
          }
          if (ite.materialTypeId == "300454") {
            this.zhuxiaofileList.push(ite)
          }
        });
      },
      async creatCaseForm(checkCase) {
        if (this.caseDetailFoemData.appCnName && !this.selectData.apps.find(i => String(i.applicantName).toLowerCase() === String(this.caseDetailFoemData.appCnName).toLowerCase())) {
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
        if (this.caseDetailFoemData.appId) {
          const res = await queryCaseAppExamine({appIds: [this.caseDetailFoemData.appId], caseIds: [this.caseDetailFoemData.caseId]})
          if (res.messageType == 300) {
            this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
            return;
          }
        }
        if(await this.checkGoods()){
          return
        }
        await this.checkSpaces()
        if (this.caseDetailFoemData.replaceAgencyName !== '北京佰舟知识产权代理有限公司' && ['内-内', '外-内'].includes(this.caseDetailFoemData.appFromto) && ['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(this.caseDetailFoemData.whdAgencyName)) {
         if (this.caseDetailFoemData.agentPerson && !this.agentPersonList.includes(this.caseDetailFoemData.agentPerson) || this.caseDetailFoemData.appContactPerson && !this.agentPersonList.includes(this.caseDetailFoemData.appContactPerson)) {
           // todo
           // this.$message.error('【代理人姓名】或【联系人】不在备案员工范围内')
           // return
         }
        }
        // 内-外，外外进行版本号填写提示
        if(['内-外', '外-外'].includes(this.caseDetailFoemData.appFromto)){
          if (this.caseDetailFoemData.goods.find(item => !item.version)){
            this.changeAppFromto(this.caseDetailFoemData.appFromto)
            return
          }
        }
        if(!this.$commonUtils.checkBA(this.caseRoleSelectList)){
          this.$message.error('承办律师或客户律师有误！')
          return
        }
        if (this.caseDetailFoemData.caseType == '马德里商标转国内注册') {
          if (!this.caseDetailFoemData.gjRegDate) {
            return this.$message.error('请填写国际注册日期')
          }
          if (!this.caseDetailFoemData.interLogoutDate) {
            return this.$message.error('请填写国际注销登记日期')
          }
          if (!this.caseDetailFoemData.gjRegNumber) {
            return this.$message.error('请填写国际注册号')
          }
        }
        if (this.caseDetailFoemData.submitType == "网上申请" && ['内-内', '外-内'].includes(this.caseDetailFoemData.appFromto)) {
          const uploadFileProperty = this.trademarkList.includes(this.caseDetailFoemData.caseType)?
            this.caseDetailFoemData.appCertFileIsCn == '是':
            this.caseDetailFoemData.uploadFileLanguage =='中文'
          if (
            this.caseDetailFoemData.legalNature == "自然人" &&
            !uploadFileProperty
          ) {
            if (!this.fileName[1002]) {
              this.$message.error("请上传身份证明文件(外文)");
              return;
            }
          }
          if (
            this.caseDetailFoemData.legalNature == "自然人" &&
            uploadFileProperty
          ) {
            if (!this.fileName[1001]) {
              this.$message.error("请上传身份证明文件");
              return;
            }
          }

          if (
            this.caseDetailFoemData.legalNature != "自然人" &&
            !uploadFileProperty
          ) {
            if (!this.fileName[1004]) {
              this.$message.error("请上传主体资格证明文件(外文)");
              return;
            }
          }
          if (
            this.caseDetailFoemData.legalNature != "自然人" &&
            uploadFileProperty
          ) {
            if (!this.fileName[1003]) {
              this.$message.error("请上传主体资格证明文件");
              return;
            }
          }

          if (
            this.caseDetailFoemData.appGJdq != "中国大陆" &&
            this.caseDetailFoemData.appGJdq != "中国" &&
            this.caseDetailFoemData.appGJdq != "中国香港" &&
            this.caseDetailFoemData.appGJdq != "中国澳门" &&
            this.caseDetailFoemData.appGJdq != "中国台湾"
          ) {
            if (!this.caseDetailFoemData.appCountryOrRegion) {
              this.$message.error("请填写申请人国家或地区");
              return;
            }
          }
          if (!this.wtsfileList) {
            this.$message.error("请上传代理委托书");
            return;
          }
          if (this.trademarkList.includes(this.caseDetailFoemData.caseType)) {
            if (
              this.caseDetailFoemData.goods &&
              this.caseDetailFoemData.goods.length <= 0
            ) {
              this.$message.error("请选择商品类别");
              return;
            }
            if (!this.tyimage) {
              this.$message.error("请上传商标图样");
              return;
            }

            if (!this.caseDetailFoemData.tmDesignDeclare) {
              this.$message.error("请填写商标设计说明");
              return;
            }
          }
          if (
            this.caseDetailFoemData.caseType != "商标续展" &&
            this.caseDetailFoemData.appGJdq != "中国大陆" &&
            this.caseDetailFoemData.appGJdq != "中国" &&
            this.caseDetailFoemData.appGJdq != "中国香港" &&
            this.caseDetailFoemData.appGJdq != "中国澳门" &&
            this.caseDetailFoemData.appGJdq != "中国台湾"
          ) {
            if (!this.caseDetailFoemData.appEnName) {
              this.$message.error("请填写申请人英文名称");
              return;
            }
            if (!this.caseDetailFoemData.appEnAddr) {
              this.$message.error("请填写申请人英文地址");
              return;
            }
          }

          // if (this.trademarkList.includes(this.caseDetailFoemData.caseType)) {
          //   if (!this.caseDetailFoemData.appCertFileIsCn) {
          //     this.$message.error("请选择证明文件是否为中文");
          //     return;
          //   }
          // }
        }
        if (this.trademarkList.includes(this.caseDetailFoemData.caseType)) {
          if (this.ifpriority == '1') {
            if (!['1', '2'].includes(this.caseDetailFoemData.priorityType)) {
              this.$message.error("请选择要求优先权声明");
              return;
            }
            if (this.caseDetailFoemData.isLoadPriorityFile == '0' && !this.fileName[1017]) {
              this.$message.error("请上传优先权证明文件");
              return;
            }
          }
        }
        if (this.caseDetailFoemData.ifShareTm == '1' && !this.caseDetailFoemData.joinApps.filter(item => item.type != 4).length) {
          this.$message.error("请添加共同申请人");
          return;
        }
        if(!this.caseDetailFoemData.caseCustRespUserArray ||
           !this.caseDetailFoemData.caseCustRespUserArray.length){
          this.$message.error('请选择客户负责人')
          return false
        }

        // this.caseDetailFoemData.caseIds = this.caseDetailFoemData.caseId;
        delete this.caseDetailFoemData.materials;
        delete this.caseDetailFoemData.caseEvolve;
        // delete this.caseDetailFoemData.joinApps;
        // delete this.caseDetailFoemData.trademarkCaseCustWorkgroups;
        // delete this.caseDetailFoemData.trademarkCaseLCWorkgroups;
        // delete this.caseDetailFoemData.trademarkCaseCBWorkgroups;
        // delete this.caseDetailFoemData.trademarkCaseMadrids;
        // delete this.caseDetailFoemData.trademarkCaseBasicinfos;
        // delete this.caseDetailFoemData.trademarkCaseCustContacts;
        // delete this.caseDetailFoemData.memberNamelists;
        this.caseDetailFoemData.caseIds = this.mainCaseIds;
        if (
          this.$route.query.import == "1" &&
          this.tmlist.includes(this.caseDetailFoemData.caseType)
        ) {
          delete this.caseDetailFoemData.imageFile;
          let sessionObj = JSON.parse(
            sessionStorage.getItem("changeOfNameOrAddressObj")
          );
          var data2 = {
            regNumberList: sessionObj.multipleSelection.map(
              item => item.regNumber
            ),
            taskId: this.caseDetailFoemData.taskId
          };
          if (this.caseDetailFoemData.caseType === "变名变址" && sessionObj && this.$refs.changeOfNameAndAddress.tmObj) {
            data2.appNameList = [
              {
                before: sessionObj.appObj.applicantName,
                cn: this.$refs.changeOfNameAndAddress.tmObj.applicantName,
                en: this.$refs.changeOfNameAndAddress.tmObj.applicantEnName
              }
            ];
            data2.appAddressList = this.$refs.changeOfNameAndAddress.defaultbeforeAddress.map(
              (item, index) => {
                return {
                  before: item.addressCn,
                  cn: this.$refs.changeOfNameAndAddress.beforeAddress[index]
                    .addressCn,
                  en: this.$refs.changeOfNameAndAddress.beforeAddress[index]
                    .addressEn
                };
              }
            );
            // data2.preAppId = sessionObj.appObj.appId;
          }
          data2.isBatch = "1";
        }
        if (
          this.$route.query.import != "1" &&
          this.tmlist.includes(this.caseDetailFoemData.caseType)
        ) {
          var data2 = {
            regNumberList: this.caseDetailFoemData.regNumber,
            taskId: this.caseDetailFoemData.taskId
          };
          let sessionObj = JSON.parse(
            sessionStorage.getItem("changeOfNameOrAddressObj")
          );
          if (this.caseDetailFoemData.caseType === "变名变址" && sessionObj && this.$refs.changeOfNameAndAddress.tmObj) {

            data2.appNameList = [
              {
                before: sessionObj.appObj.applicantName,
                cn: this.$refs.changeOfNameAndAddress.tmObj.applicantName,
                en: this.$refs.changeOfNameAndAddress.tmObj.applicantEnName
              }
            ];
            data2.appAddressList = [
              {
                before: this.$refs.changeOfNameAndAddress.tmObj.preAddrId,
                cn: this.$refs.changeOfNameAndAddress.tmObj.addressCn,
                en: this.$refs.changeOfNameAndAddress.tmObj.addressEn,
              }
            ];
          }
          data2.isBatch = "0";
        }
        if (this.caseDetailFoemData.caseType === "变名变址" && this.$refs.changeOfNameAndAddress.tmObj) {
          // delete data.preChangeCnName;
          // delete data.preChangeEnName;
          // delete data.preChangeCnAdress;
          // delete data.preChangeEnAdress;
          var data = Object.assign(
            {
              taskId: this.caseDetailFoemData.taskId,
              caseId: this.caseDetailFoemData.caseId,
              userId: this.userId
            },
            this.getChangedata(),
            this.$refs.changeOfNameAndAddress.tmObj,
            data2
          );
        } else if (this.caseDetailFoemData.caseType === "续展") {
          var data = Object.assign(
            {
              taskId: this.caseDetailFoemData.taskId,
              caseId: this.caseDetailFoemData.caseId,
              userId: this.userId
            },
            this.getChangedata(),
            data2
          );
        } else {
          var data = Object.assign(
            {
              taskId: this.caseDetailFoemData.taskId,
              caseId: this.caseDetailFoemData.caseId,
              userId: this.userId
            },

            this.getChangedata()
          );

        }
        data.checkCase = checkCase;
        if (this.caseDetailFoemData.appGJdq=='中国') {
          //获取省/市/区名称并通过#拼接，如果没有某一个值就不要#拼接
          const province = this.provinceList.find(item => item.regionCode == this.address.province) || {}
          const city = this.cityList.find(item => item.regionCode == this.address.city) || {}
          const district = this.districtList.find(item => item.regionCode == this.address.district) || {}
          data.appRegionalism = `${province.abbrName}${city.abbrName?`#${city.abbrName}`:''}${district.abbrName?`#${district.abbrName}`:''}`
        }else{
          data.appRegionalism = ''
        }
        //
        if (this.caseDetailFoemData.caseType == '变名变址' && this.$refs.changeOfNameAndAddress.tmObj) {
          this.caseDetailFoemData.appCertFileIsCn = this.$refs.changeOfNameAndAddress.tmObj.appCertFileIsCn
          this.caseDetailFoemData.changeType = this.$refs.changeOfNameAndAddress.tmObj.changeType
          this.caseDetailFoemData.preChangeCnName = this.$refs.changeOfNameAndAddress.tmObj.applicantName
          this.caseDetailFoemData.preChangeCnAdress = this.$refs.changeOfNameAndAddress.tmObj.addressCn
          this.caseDetailFoemData.preChangeEnAdress = this.$refs.changeOfNameAndAddress.tmObj.addressEn
          this.caseDetailFoemData.preChangeEnName = this.$refs.changeOfNameAndAddress.tmObj.applicantEnName
          this.caseDetailFoemData.preAppName = this.$refs.changeOfNameAndAddress.tmObj.preAppName
          this.caseDetailFoemData.preAddress = this.$refs.changeOfNameAndAddress.tmObj.preAddress

        }
        this.postFormFlag = false
        await this.$nextTick()
        this.postFormFlag = true
        await this.$nextTick()
        if ((this.caseDetailFoemData.caseType === '答复临时驳回/审查意见（境外）' || this.caseDetailFoemData.caseType == '商标注册' || this.caseDetailFoemData.caseType == '提供使用声明/证据（境外）') && this.caseDetailFoemData.appFromto == '外-内') {
          this.$refs["postForm"].validate(async valid => {

            if (valid) {
              if (this.ifpriority == '0') {
                try {
                  await this.$confirm(
                    "案件是否要求优先权",
                    "提示",
                    {
                      confirmButtonText: "是",
                      cancelButtonText: "否",
                      distinguishCancelAndClose: true,
                      closeOnPressEscape: false,
                      type: "warning"
                    }
                  )
                  return
                } catch (e) {
                  if (e == 'close') {
                    return
                  }
                }
              }
              heighCreditUrl(data)
                .then(response => {
                  if (response.messageType == -6) {
                    this.$confirm(
                      "提示",
                      {
                        message: this.$commonUtils.rowsMessage(response.message, '#'),
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                      }
                    ).then(() => {
                      this.creatCaseForm(0);
                    });
                    return;
                  }
                  if (response.messageType == 12) {
                    this.$confirm(response.message,
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
                  if (response.messageType == 13) {
                    this.caseData = response.data
                    this.poppingTimeLimitState = true
                    return;
                  }

                  this.goNext();
                })
                .catch(err => {
                });
            } else {
              console.log('请填写必填项')
              this.$message.error("请填写必填项");
              return false;
            }
          });
        } else {
          this.$refs["postForm"].validate(valid => {
            if (valid) {

              heighCreditUrl(data)
                .then(response => {
                  if (response.messageType == -6) {
                    this.$confirm(
                      "提示",
                      {
                        message: this.$commonUtils.rowsMessage(response.message, '#'),
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                      }
                    ).then(() => {
                      this.creatCaseForm(0);
                    });
                    return;
                  }
                  if (response.messageType == 12) {
                    this.$confirm(response.message,
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
                  if (response.messageType == 13) {
                    this.caseData = response.data
                    this.poppingTimeLimitState = true
                    return;
                  }
                  this.goNext();
                })
                .catch(err => {
                });
            } else {
              this.$message.error("请填写必填项");
              return false;
            }
          });
        }
      },
      closePoppingTimeLimit() {
        this.poppingTimeLimitState = false
        if (this.prefiling) {
          this.$router.push({
            path: "/workbench/case/preFilingPush/1",
            query: {taskId: this.caseDetailFoemData.taskId, taskType: 1}
          });
          return
        }
        this.goNext()
      },
      addMDL() {
        this.caseDetailFoemData.trademarkCaseBasicinfos.push({
          regNumber: "",
          regDate: ""
        });
      },

      tkInspect(command) {
        if (command == "1") {
          if (this.caseDetailFoemData.tmName) {
            checkForbidContentUrl({
              tmName: this.caseDetailFoemData.tmName
            }).then(res => {
              this.tkInspectText = res.data;
              this.tkInspectType = res.data.result;
            });
          } else {
            this.$message.error("请填写商标名称");
          }
        } else {
          if (this.caseDetailFoemData.tmName) {
            this.dialogFormTmCm = true;
          } else {
            this.$message.error("请填写商标名称");
          }
        }
      },

      siveGoodsPlan() {
        this.innerVisible = true;
      },
      siveGoodsPlanBtn() {
        if (!this.caseDetailFoemData.appId) {
          this.$message.error("请选择申请人");
        }
        if (!this.planName) {
          this.$message.error("请选择填写方案名称");
        }
        if (!this.caseDetailFoemData.goods) {
          this.$message.error("请选择商品");
        }
        addGoodsPlanUrl({
          appId: this.caseDetailFoemData.appId,
          planName: this.planName,
          goods: this.caseDetailFoemData.goods
        }).then(res => {
          this.$message.success("保存成功");
          this.innerVisible = false;
        });
      },
      getGoodsBycaseNumber() {
        if (!this.goodsCaseNumber) {
          this.$message.error("请输入案卷号");
        } else {
          queryGoodsByAgentNumUrl({agentNum: this.goodsCaseNumber}).then(
            res => {
              this.caseDetailFoemData.goods = res.data;
              this.$message.success("导入成功");
            }
          );
        }
      },
      planselectchange(val) {
        if (val == "0") {
          if (this.caseDetailFoemData.appId) {
            queryGoodsPlanUrl({appId: this.caseDetailFoemData.appId})
              .then(response => {
                this.selectData.goodsPlanselect = response.data;
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.$message.error("商品方案需要先选择申请人!");
          }
        }
      },
      deljoinBtn() {
        if (this.dialogFormjoin == 1) {
          delJoinAppUrl({joinAppId: this.joinFormData.joinAppId});
        }
        this.dialogFormjoin = 0;
      },
      joinCreatdialog(type = 1) {
        cradeJoinAppUrl({caseIds: this.mainCaseIds, type}).then(res => {
          this.joinFormData = res.data;
        });
      },
      caseCochange(val) {
        if (val == '中国') {
          this.splitAddressFunc(this.caseDetailFoemData.appCnAddr)
        }
        queryCountryCaseUrl({country: val})
          .then(response => {
            if (response.data && response.data.length > 0) {
              this.caseDetailFoemData.appCountryOrRegion =
                response.data[0].countryCn;
            } else {
              this.caseDetailFoemData.appCountryOrRegion = "";
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      appCnAddrChange(e) {
        // console.log(this.$refs.appCnAddr);
        if (e) {
          this.caseDetailFoemData.appEnAddr = e.addressEn //this.selectData.appaddr.find(item=>item.addressCn==e).addressEn
        }
      },
      zngoodChange(value) {
        this.selectData.goodsznselect = value;
        console.log(value);
      },
      zngoodChangeb(id) {
        GSQCategoryUrl({grid: id}).then(res => {
          this.caseDetailFoemData.goods = res.data;
        });
      },
      delPlan(id) {
        deleteGoodsPlanUrl({planId: id}).then(res => {
          queryGoodsPlanUrl({appId: this.caseDetailFoemData.appId})
            .then(response => {
              this.selectData.goodsPlanselect = response.data;
              if (!this.selectData.goodsPlanselect) {
                this.goodsPlan = "";
              }
            })
            .catch(err => {
              console.log(err);
            });
        });
      }
    }
  };
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

    .case_collapse {
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

  /*/deep/ .form-border {*/
  /*  .el-form-item__error {*/
  /*    position: relative !important;*/
  /*  }*/
  /*  .el-row {*/
  /*    margin: 0px;*/
  /*    display: flex;*/
  /*  }*/
  /*  .postInfo-container-item {*/
  /*    width: 100%;*/
  /*  }*/

  /*  .el-form-item__label {*/
  /*    background-color: #f9f9f9;*/
  /*    width: 36.7%;*/
  /*    text-align: right;*/
  /*  }*/

  /*  .el-form-item {*/
  /*    border-right: 1px solid #d7d7d7;*/
  /*    margin: 0px !important;*/
  /*  }*/
  /*  .el-row {*/
  /*    border-bottom: 1px solid #d7d7d7;*/
  /*  }*/
  /*  .el-input,*/
  /*  .el-select {*/
  /*    width: 77%;*/
  /*  }*/
  /*  .el-form-item__content {*/
  /*    text-align: left;*/
  /*    // height: 30px;*/
  /*  }*/
  /*  .fullRow {*/
  /*    .el-form-item__label {*/
  /*      width: 17.2%;*/
  /*    }*/

  /*    .el-input,*/
  /*    .el-select {*/
  /*      width: 30%;*/
  /*    }*/
  /*  }*/
  /*  .el-input__inner {*/
  /*    // border: none;*/
  /*  }*/
  /*  .el-select .el-input {*/
  /*    width: 100%;*/
  /*  }*/
  /*  .postInfo-container-item {*/
  /*    display: flex;*/
  /*    width: 100%;*/
  /*    height: 100%;*/
  /*    .el-form-item__content {*/
  /*      text-align: left;*/
  /*      display: inline-table;*/
  /*      width: 70%;*/
  /*      min-width: 70%;*/
  /*      padding: 5px 15px;*/
  /*    }*/

  /*    .el-form-item__label {*/
  /*      line-height: 43px;*/
  /*      border-right: 1px solid #d7d7d7;*/
  /*    }*/
  /*  }*/
  /*  border-top: 1px solid #d7d7d7;*/
  /*  border-left: 1px solid #d7d7d7;*/
  /*  // border-bottom: 1px solid #d7d7d7;*/
  /*}*/
  /deep/ .form-border {
    .el-form-item__error {
      position: relative !important;
      top: 0
    }

    .el-row {
      display: flex;
      margin: 0px;
    }

    .postInfo-container-item {
      width: 100%;
    }

    .el-form-item__label {
      height: 100%;
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
      width: 77%;
    }

    .el-form-item__content {
      text-align: left;
      // height: 30px;
      position: relative;

      .textarea_wrap {
        display: flex;

        .button_wrap {
          margin-left: 10px;
        }
      }
    }

    .fullRow {
      .el-form-item__label {
        height: 100%;
        /*width: 15%;*/
      }

      .el-input,
      .el-select {
        /*width: 30%;*/
      }
    }

    /deep/ .cell {
      .el-input,
      .el-select {
        width: 100% !important;
      }
    }

    .el-input__inner {
      // border: none;
    }

    .el-select .el-input {
      width: 100%;
    }

    .virtual-select {
      width: 100%;

      .jh-virtual-select {
        width: 100%;
      }
    }

    .postInfo-container-item, .madrid {

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

    /deep/ .el-upload--text {
      display: none;
    }
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

  .tmImg {
    display: block;
    width: 100px;
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
  /*>>> .el-upload-list{*/
  /*  height: 35px;*/
  /*  overflow: hidden;*/
  /*}*/
  .long-input{
    .el-select{
      width: 100%;
    }
    >>>.el-autocomplete{
      .el-select, .el-input{
        width: 100%;
      }
    }
  }

  .project-tree-wrap {

    /deep/ .customer-tree__toolbar {
      margin-bottom: 8px;
    }

    /deep/ .customer-tree__selected {
      margin-bottom: 8px;
      padding: 8px 12px;
    }

    /deep/ .customer-tree__tree {
      max-height: 240px;
    }

    /deep/ .customer-tree__tip {
      display: none;
    }
  }
</style>
