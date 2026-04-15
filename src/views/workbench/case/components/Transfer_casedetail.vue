<template>
  <div>
    <BreadCrumbCase v-if="caseDetailFoemData.caseId" :caseDetailFoemData="caseDetailFoemData"></BreadCrumbCase>
    <el-row>
      <el-col :span="20" class="createPost-container">
        <el-tabs @tab-click="handleClickTab" v-model="activeName">
          <el-row v-if='tabtypeDown'>
            <el-col :span="24">

            </el-col>
          </el-row>
          <el-tab-pane label="案件详情" name="first">

            <el-form :model="caseDetailFoemData" :rules="rules"  label-width="180px" class="form-container" ref="postForm" size="small"  v-if="postFormFlag">
              <div class="createPost-main-container">
                <div class="form-con">
                  <el-row class="form-border">
                    <el-col :span="24">
                      <el-row class="fullRow">
                        <el-col :span="24">
                          <el-form-item class="postInfo-container-item" label="案件类型:">
                            <template>
                              <span>{{ caseDetailFoemData.caseType }}</span>
                            </template>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row class="fullRow">
                        <el-col :span="24" v-if="ch_caseTypr==='撤回商标申请'||ch_caseTypr==='撤回商标评审'">
                          <el-form-item class="postInfo-container-item" label="撤回案件类型:">
                            <template>
                              <span>{{ caseDetailFoemData.changeType}}</span>
                            </template>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" class="tilteSpan">
                      <span id="ajxq-title">案件详情</span>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="24" class="form-con-item">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="申请方向:" prop="appFromto">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.appFromto" @change="changeAppFromto">
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
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="标签:">
                                <TagsModal
                                  :case-id="caseDetailFoemData.caseId"
                                  :cust-id="caseDetailFoemData.custId"
                                  :case-tag-info="{ tagPath: tagPath, tagPathList: caseDetailFoemData.caseTagPathList }"
                                  @change="tagPath = $event"
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
                              <el-form-item class="postInfo-container-item" label="案件文号:">
                                <template>
                                  <el-input :disabled="true" v-model="caseDetailFoemData.agentNum" />
                                  <el-button type="primary" size="mini" style="margin-left: 10px;" @click="transferCase">转案</el-button>
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
                          <template v-if="ch_caseTypr==='许可备案'">
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" prop="relicensing" label="是否再许可:">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.relicensing">
                                      <el-radio label="是">是</el-radio>
                                      <el-radio label="否">否</el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="许可类型:" prop="licenseType">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.licenseType">
                                      <el-radio label="普通许可">普通许可</el-radio>
                                      <el-radio label="排他许可">排他许可</el-radio>
                                      <el-radio label="独占许可">独占许可</el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="" v-if="caseDetailFoemData.relicensing=='是'">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="许可原备案号:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.parentDocNumber" />
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="再许可授权书:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[1041]" />

                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1041',$event)">上传</el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="许可使用合同生效日期:" prop="permitEffectiveDate">
                                  <template>
                                    <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.permitEffectiveDate" value-format="yyyy-MM-dd" />
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="许可使用合同终止日期:"  prop="permitInvalidDate">
                                  <template>
                                    <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.permitInvalidDate" value-format="yyyy-MM-dd" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>

                          <el-row class="">
                            <el-col :span="12" v-if='ch_caseTypr!="商标查询"'>
                              <el-form-item class="postInfo-container-item" label="申请方式:"  prop="submitType">
                                <template>
                                  <el-radio-group prop="submitType" v-model="caseDetailFoemData.submitType" @change="billDiscount">
                                    <el-radio :disabled="submitTypeBool" label="网上申请" />
                                    <el-radio label="线下申请">线下申请</el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="代理机构:">
                                <template>
                                  <el-select
                                    :clearable="true"
                                    @change="changeAgency"
                                    default-first-option
                                    filterable placeholder="请选择"
                                    v-model="caseDetailFoemData.whdAgencyName">
                                    <el-option label="云分万慧达" value="云分万慧达" disabled/>
                                    <el-option label="津分万慧达" value="津分万慧达" />
                                    <el-option label="北京万慧达律所" value="北京万慧达律所" />
                                    <el-option label="上海万慧达律所" value="上海万慧达律所" />
                                    <el-option label="北京万慧达" value="北京万慧达" />
                                    <el-option label="汉智嘉成" value="汉智嘉成" disabled/>
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="ch_caseTypr==='出具商标注册证明'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="申请补正理由:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.reason" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <div v-if="ch_caseTypr==='商标注销'">
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="注销类型:" prop="changeType">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.changeType">
                                      <el-radio label="全部注销" />
                                      <el-radio label="部分注销" />

                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="未交回原注册证原因:" prop="reason">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.reason" />
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="申请人名义是否发生变更:">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.isDlbz">
                                      <el-radio label="是" />
                                      <el-radio label="否" />

                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>

                            </el-row>
                            <el-row class="fullRow" v-if="caseDetailFoemData.isDlbz=='是'">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="变更证明文件类型:">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.appCertFileIsCn">

                                      <el-radio label="是">中文</el-radio>
                                      <el-radio label="否">外文</el-radio>

                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <el-form-item v-if="caseDetailFoemData.appCertFileIsCn=='是'" class="postInfo-container-item" label="变更证明文件（中文）：">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[1032]" />
                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1032',$event)">上传</el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item v-if="caseDetailFoemData.appCertFileIsCn=='否'" class="postInfo-container-item" label="变更证明文件原件彩色扫描件：">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[1033]" />
                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1033',$event)">上传</el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>

                          </div>

                          <el-row class="" v-if="ch_caseTypr==='撤回商标评审'">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="原申请日期:" prop="reviewCaseAppDate">
                                <template>
                                  <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.reviewCaseAppDate" value-format="yyyy-MM-dd" />
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="原申请编号:" prop="parentAppNumber">
                                <template>
                                  <el-input v-model="caseDetailFoemData.parentAppNumber" />
                                </template>
                              </el-form-item>
                            </el-col>

                          </el-row>
                          <el-row class="fullRow" v-if="ch_caseTypr==='补发商标注册证'||ch_caseTypr==='补发商标变转续证明'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="申请补证理由:" :prop="ch_caseTypr==='补发商标注册证' && caseDetailFoemData.submitType === '网上申请' && ['内-内', '外-内'].includes(caseDetailFoemData.appFromto) ? 'reason' : ''">
                                <template>
                                  <el-input v-model="caseDetailFoemData.reason" />
                                </template>
                              </el-form-item>
                            </el-col>

                          </el-row>
                          <el-row class="fullRow" v-if="ch_caseTypr==='补发商标变转续证明'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="证明类型:">
                                <template>
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.reissueType">
                                    <el-option value="变更证明" />
                                    <el-option value="转让证明" />
                                    <el-option value="续展证明" />

                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>

                          </el-row>
                          <template v-if="ch_caseTypr==='补发商标变转续证明'">
                            <el-row class="" v-if="caseDetailFoemData.reissueType=='变更证明'">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="变更前注册人名义/地址:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.transferorCnName" />
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="变更后注册人名义/地址:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.transferorEnName" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="" v-if="caseDetailFoemData.reissueType=='转让证明'">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="转让人名称:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.transferorCnAdress" />
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="受让人名称:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.transferorEnAdress" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                          <template v-if="ch_caseTypr==='撤回商标申请'">
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="撤回理由:" prop="withdraw">
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.withdraw">
                                    <el-option value="客户指示" />
                                    <el-option value="申请材料信息填写有误" />
                                    <el-option value="交官重复" />
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" v-if="caseDetailFoemData.caseType !== '撤回商标异议'">
                                <el-form-item v-if="caseDetailFoemData.changeType === '转让/移转商标'" class="postInfo-container-item" label="原转让申请号" prop="parentAppNumber">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.parentAppNumber" />
                                  </template>
                                </el-form-item>
                                <el-form-item v-else class="postInfo-container-item" :label="caseDetailFoemData.caseType == '撤回撤销三年不使用注册商标'?'原撤销申请号:' : '原申请号:'" :prop="ch_caseTypr==='撤回商标申请' && caseDetailFoemData.submitType === '网上申请' && ['内-内', '外-内'].includes(caseDetailFoemData.appFromto) ? 'parentAppNumber' : ''">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.parentAppNumber" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="撤回理由描述:">
                                  <el-input v-model="caseDetailFoemData.reason" :rows="3" placeholder="请输入" type="textarea" />
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" v-if="caseDetailFoemData.caseType == '撤回撤销三年不使用注册商标'">
                                <el-form-item class="postInfo-container-item" label="原撤销申请日期:" prop="parentAppDate">
                                  <el-date-picker  placeholder="选择日期" type="date" v-model="caseDetailFoemData.parentAppDate" value-format="yyyy-MM-dd" />
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="申请人名称是否已变更:">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.isDlbz">
                                      <el-radio label="是" />
                                      <el-radio label="否"></el-radio>
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item v-if="ch_caseTypr==='撤回商标申请' && caseDetailFoemData.changeType==='转让/移转商标'" class="postInfo-container-item" label="转让人中文名称:">
                                  <template>
                                    <el-autocomplete @select="handleTransferorCnName" class="inline-input" :clearable='true' v-model="caseDetailFoemData.transferorCnName" :fetch-suggestions="remotepinput" placeholder="请输入内容" :trigger-on-focus="true">
                                    </el-autocomplete>
  <!--                                  v-model=""-->
  <!--                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择">-->
  <!--                                    <el-option :key="key" :label="item.applicantName" :value="item.applicantName" v-for="(item,key) in selectData.apps" />-->
  <!--                                  </el-select>-->

                                  </template>
                                </el-form-item>

                                <el-form-item v-if="ch_caseTypr==='撤回商标申请'&&caseDetailFoemData.isDlbz=='是'" class="postInfo-container-item" label="变更证明文件:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[1032]" />

                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1032',$event)">上传</el-button>
                                  </template>

                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                          <template v-if="caseDetailFoemData.changeType==='变名变址'">
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="变更前名称（中文）:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.preChangeCnName" />
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="变更前名称（英文）:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.preChangeEnName" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="变更前地址（中文）:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.preChangeCnAdress" />
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="变更前地址（英文）:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.preChangeEnAdress" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                          <template v-if="ch_caseTypr==='更正商标申请事项'">
<!--                            <el-row class="fullRow">-->
<!--                              <el-col :span="24">-->
<!--                                <el-form-item class="postInfo-container-item" label="是否需重新制发证书文件:">-->
<!--                                  <template>-->
<!--                                    <el-radio-group v-model="caseDetailFoemData.isResend">-->
<!--                                      <el-radio label="是">是</el-radio>-->
<!--                                      <el-radio label="否">否</el-radio>-->
<!--                                    </el-radio-group>-->
<!--                                  </template>-->
<!--                                </el-form-item>-->
<!--                              </el-col>-->
<!--                            </el-row>-->
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="更正前信息:">
                                  <template>
                                    <el-input :rows="3" placeholder="请输入" type="textarea" v-model="caseDetailFoemData.beforeChangeMessage" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="更后前信息:">
                                  <template>
                                    <el-input :rows="3" placeholder="请输入" type="textarea" v-model="caseDetailFoemData.afterChangeMessage" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="案件等级:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.caseLevel">
                                    <el-radio :label="1">普通</el-radio>
                                    <el-radio :label="2">重要</el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="他所代交:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.otherAgency">
                                    <el-radio label="0">否</el-radio>
                                    <el-radio label="1">是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.otherAgency=='1'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="代交所名称:">
                                <template>
                                  <el-select  @change="changeReplaceAgency" :clearable="true" default-first-option filterable placeholder="仅可使用下拉单中可选的第三方机构" v-model="caseDetailFoemData.replaceAgencyName">
                                    <el-option v-for="(item, index) in otherAgencyList" :label="item.value" :value="item.value"></el-option>
<!--                                    <el-option label="北京普乐时知识产权代理有限公司" value="北京普乐时知识产权代理有限公司" />-->
<!--                                    <el-option label="北京英特普罗知识产权代理有限公司" value="北京英特普罗知识产权代理有限公司" />-->
<!--                                    <el-option label="北京思想力知识产权代理有限公司" value="北京思想力知识产权代理有限公司" />-->
<!--                                    <el-option label="广东源慧知识产权代理有限公司" value="广东源慧知识产权代理有限公司" />-->
<!--                                    <el-option label="北京安度凯特来知识产权代理有限公司" value="北京安度凯特来知识产权代理有限公司" />-->
<!--                                    <el-option label="北京腾中知识产权代理有限公司" value="北京腾中知识产权代理有限公司" />-->
<!--                                    <el-option label="北京英诺万知识产权代理有限公司" value="北京英诺万知识产权代理有限公司" />-->
<!--                                    <el-option label="北京为上知识产权代理有限公司" value="北京为上知识产权代理有限公司" />-->
<!--                                    <el-option label="北京观度知识产权代理有限公司" value="北京观度知识产权代理有限公司" />-->
<!--                                    <el-option label="昆明裘诺知识产权事务所有限公司" value="昆明裘诺知识产权事务所有限公司" />-->
<!--                                    <el-option label="成都中炬新汇知识产权代理有限公司" value="成都中炬新汇知识产权代理有限公司" />-->
<!--                                    <el-option label="温州市智信商标事务所有限公司" value="温州市智信商标事务所有限公司" />-->
<!--                                    <el-option label="北京佰舟知识产权代理有限公司" value="北京佰舟知识产权代理有限公司"/>-->
<!--                                    <el-option label="北翔" value="北翔" />-->
<!--                                    <el-option label="申请人自交" value="申请人自交" />-->
                                  </el-select>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="ch_caseTypr==='转让/移转'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="转让/移转:">
                                <template>
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.transfer">
                                    <el-option label="商标转让" value="商标转让" />
                                    <el-option label="商标移转" value="商标移转" />

                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="['异议', '无效宣告申请', '不予注册复审'].includes(ch_caseTypr)">
                            <el-col :span="ch_caseTypr === '无效宣告申请' ? 12 : 24">
                              <el-form-item class="postInfo-container-item" label="请求驰名商标保护:" prop="chiming">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.chiming">
                                    <el-radio label="否">否</el-radio>
                                    <el-radio label="是">是</el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="ch_caseTypr === '无效宣告申请'">
                              <el-form-item class="postInfo-container-item" label="仅涉及绝对理由:" prop="absoluteReason">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.absoluteReason">
                                    <el-radio :label="0">否</el-radio>
                                    <el-radio :label="1">是</el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="!['国际注册驳回复审','注册驳回复审'].includes(ch_caseTypr)">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="申请书标注:">
                                <template>

                                  <el-input :rows="4" placeholder="请输入内容" type="textarea" v-model="caseDetailFoemData.applicationMarks" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="ch_caseTypr==='撤销三年停止使用申请'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="撤销理由:">
                                <template>

                                  <el-input :rows="4" placeholder="请输入内容" type="textarea" v-model="caseDetailFoemData.reason" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ch_caseTypr==='撤销三年停止使用申请'">
                            <el-col :span="12">
                              <el-form-item label="理由:" class="postInfo-container-item">
                                <el-button style="margin-left:10px;display: block" size="mini" type="primary" @click="getfileData('327',$event, true)">上传</el-button>
                                <el-upload class="upload-btn" :before-remove="brforeRemoveFile" :on-success='fileUploadSuccess' :file-list="lyfileList" :show-file-list='true' :action="fileUrl" name='attachFile' :data="fileData('327')">
                                </el-upload>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="证据材料:" class="postInfo-container-item">
                                <el-button style="margin-left:10px;display: block" size="mini" type="primary" @click="getfileData('322',$event, true)">上传</el-button>
                                <el-upload class="upload-btn" :before-remove="brforeRemoveFile" :on-success='fileUploadSuccess' :file-list="zjclfileList" :show-file-list='true' :action="fileUrl" name='attachFile' :data="fileData('322')">
                                </el-upload>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ch_caseTypr==='撤销三年停止使用申请'">
                            <el-col :span="12">
                              <el-form-item label="材料目录/证据目录:" class="postInfo-container-item">
                                <el-button style="margin-left:10px;display: block" size="mini" type="primary" @click="getfileData('326',$event, true)">上传</el-button>
                                <el-upload class="upload-btn" :before-remove="brforeRemoveFile" :on-success='fileUploadSuccess' :file-list="clmlfileList" :show-file-list='true' :action="fileUrl" name='attachFile' :data="fileData('326')">
                                </el-upload>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item label="相关说明文件:" class="postInfo-container-item">
                                <el-button style="margin-left:10px;display: block" size="mini" type="primary" @click="getfileData('1020',$event, true)">上传</el-button>
                                <el-upload class="upload-btn" :before-remove="brforeRemoveFile" :on-success='fileUploadSuccess' :file-list="xgsmfileList" :show-file-list='true' :action="fileUrl" name='attachFile' :data="fileData('1020')">
                                </el-upload>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="ch_caseTypr==='国际注册驳回复审'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="是否延期:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.delay">
                                    <el-radio :label="false">否</el-radio>
                                    <el-radio :label="true">是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row v-if="showType||ch_caseTypr==='国际注册驳回复审'||ch_caseTypr==='注册驳回复审'||ch_caseTypr==='不予注册复审'||ch_caseTypr==='撤销商标复审' || ch_caseTypr==='无效宣告复审' ||ch_caseTypr==='撤销复审答辩'||ch_caseTypr==='撤三答辩（提供使用证明）'||ch_caseTypr==='撤销三年停止使用申请'">
                            <el-col :span="6">
                              <el-form-item class="postInfo-container-item" label="之后是否交补充材料:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.supplement">
                                    <el-radio :label="0">否</el-radio>
                                    <el-radio :label="1">是</el-radio>

                                  </el-radio-group>

                                </template>
                              </el-form-item>
                            </el-col>
                             <el-col :span="6" v-if="['国际注册驳回复审','注册驳回复审'].includes(ch_caseTypr)">
                              <el-form-item class="postInfo-container-item" label="是否分割:" prop="isDivision">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.isDivision">
                                    <el-radio :label="0">否</el-radio>
                                    <el-radio :label="1">是</el-radio>

                                  </el-radio-group>

                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="['国际注册驳回复审','注册驳回复审'].includes(ch_caseTypr)">
                              <el-form-item class="postInfo-container-item" label="分割申请书:">
                                <template>
                                  <el-button style="margin-left:10px;display: block" size="mini" type="primary" @click="getfileData('301535',$event, true)">上传</el-button>
                                <el-upload class="upload-btn" :before-remove="brforeRemoveFile" :on-success='fileUploadSuccess' :file-list="fgsqfileList" :show-file-list='true' :action="fileUrl" name='attachFile' :data="fileData('301535')">
                                </el-upload>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <template v-if="['国际注册驳回复审','注册驳回复审'].includes(ch_caseTypr)">
                            <el-row class="fullRow">
                              <el-col :span="24" v-show="caseDetailFoemData.submitType=='网上申请'">
                                <el-form-item prop="applicationMarks" class="postInfo-container-item" label="阐述事实与理由:" >
                                  <template>
                                    <el-input :rows="3" placeholder="请输入" type="textarea" @change="checkTab" v-model="caseDetailFoemData.applicationMarks" />

                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="24" v-show="caseDetailFoemData.submitType!=='网上申请'">
                                <el-form-item  class="postInfo-container-item" label="阐述事实与理由:" >
                                  <template>
                                    <el-input :rows="3" placeholder="请输入" @change="checkTab" type="textarea" v-model="caseDetailFoemData.applicationMarks"applicationMarks />

                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="" >
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="事实与理由:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[327]" />

                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('327',$event)">上传</el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" style="font-size: 12px;color: #333">
                                <div style="padding: 10px;line-height: 20px;">
                                  请上传驳回复审申请的事实与理由，格式为PDF。
                                </div>
                              </el-col>
                            </el-row>
                            <el-row class="" >
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="证据目录:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[326]" />

                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('326',$event)">上传</el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" style="font-size: 12px;color: #333">
                                <div style="padding: 10px;line-height: 20px;">
                                  若上传证据内容，必须上传证据目录，文件格式为PDF。可通过中国商标网商标申请>申请书栏目（ <a style="color: #409EFF" target="_blank" :href="`http://sbj.cnipa.gov.cn/sbj/sbsq/sqss`">http://sbj.cnipa.gov.cn/sbj/sbsq/sqss</a>）获取模板。
                                </div>
                              </el-col>
                            </el-row>
                            <el-row class="" >
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="证据内容:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[300012]" />

                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('300012',$event)">上传</el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" style="font-size: 12px;color: #333">
                                <div style="padding: 10px">
                                  需上传证据内容的，必须上传证据目录，且需要先上传证据目录再上传证据内容。需上传PDF格式。
                                </div>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="提示:">
                                  <div style="color: #67C23A">当前申请件剩余容量{{supCapacity}}MB</div>
                                  <div style="color: #F56C6C">(注意！补充材料需提交申请之日起三个月内一次性提交！)
                                  </div>
                                  <div style="color: #F56C6C">(注意！上传证据内容文件必须上传证据目录文件！)</div>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="" >
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="送达证据:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[300013]" />

                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('300013',$event)">上传</el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" style="font-size: 12px;color: #333">
                                <div style="padding: 10px">
                                  非电子送达方式收到驳回通知书的，请上传PDF格式的送达证据。
                                </div>
                              </el-col>
                            </el-row>
                            <el-row class="" v-if="ch_caseTypr==='国际注册驳回复审'">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="驳回通知书:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[301600]" />
                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('301600',$event)">上传</el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" style="font-size: 12px;color: #333">
                                <div style="padding: 10px">
                                  请上传驳回通知书，马德里注册商标的应当上传驳回通知书，并附中文翻译件，格式为PDF，大小不超过5M，仅支持上传一个。
                                </div>
                              </el-col>
                            </el-row>
                          </template>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="备注:">
                                <template>
                                  <el-input :rows="3" placeholder="请输入" type="textarea" v-model="caseDetailFoemData.remarks" />

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <template v-if="ch_caseTypr==='无效宣告申请'">
                              <el-row class="">
                                <el-col :span="24">
                                  <el-form-item label="法律条款:" class="postInfo-container-item" :class="{'require': caseDetailFoemData.submitType==='网上申请'}">
                                    <el-select :clearable="true" default-first-option filterable multiple placeholder="请选择" v-model="caseDetailFoemData.lawList">
                                      <el-option :key="key" :label="item.typeName" :value="item.typeName" v-for="(item,key) in wxLawArray" />
                                    </el-select>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-row class="fullRow">
                                <el-col :span="24">
                                  <el-form-item label="事实理由:" class="postInfo-container-item" :class="{'require': caseDetailFoemData.submitType==='网上申请'}">
                                    <el-input :disabled="true" v-model="fileName[327]" />
                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('327',$event)">上传</el-button>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                            <el-row>
                              <el-col :span="12">
                                  <el-form-item label="证据目录:" class="postInfo-container-item">
                                    <el-input :disabled="true" v-model="fileName[326]" />
                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('326',$event)">上传</el-button>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="12" style="font-size: 12px;color: #333">
                                  <div style="padding: 10px;line-height: 20px;">
                                    若上传证据内容，必须上传证据目录，文件格式为PDF。可通过中国商标网商标申请>申请书栏目（ <a style="color: #409EFF" target="_blank" :href="`http://sbj.cnipa.gov.cn/sbj/sbsq/sqss`">http://sbj.cnipa.gov.cn/sbj/sbsq/sqss</a>）获取模板。
                                  </div>
                                </el-col>
                            </el-row>
                            <el-row class="" >
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="证据内容:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[300012]" />

                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('300012',$event)">上传</el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" style="font-size: 12px;color: #333">
                                <div style="padding: 10px">
                                  需上传证据内容的，必须上传证据目录，且需要先上传证据目录再上传证据内容。需上传PDF格式。
                                </div>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="提示:">
                                  <div style="color: #67C23A">当前申请件剩余容量{{supCapacity}}MB</div>
<!--                                  <div style="color: #F56C6C">(注意！补充材料需提交申请之日起三个月内一次性提交！)-->
<!--                                  </div>-->
<!--                                  <div style="color: #F56C6C">(注意！上传证据内容文件必须上传证据目录文件！)</div>-->
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="有关说明文件:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[1020]" />
                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1020',$event)">上传</el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" >
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="同意通讯地址延及本案后续程序:">
                                  <el-radio-group v-model="caseDetailFoemData.empowerAddrCase">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                  </el-radio-group>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="正副本是否一致:">
                                  <el-radio-group v-model="caseDetailFoemData.justNegativeAgre">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                  </el-radio-group>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12" v-if="caseDetailFoemData.justNegativeAgre == 0">
                                <el-form-item class="postInfo-container-item" label="涉密证据材料:">
                                  <template slot="label"><span class="required-asterisk">*</span>涉密证据材料</template>
                                  <el-input :disabled="true" v-model="fileName[301677]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('301677',$event)">上传</el-button>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
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
                    <el-col :span="24" class="tilteSpan">
                      <span id="khxx-title">客户信息</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24" class="form-con-item">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="客户名称:" prop="custId">
<!--                                <template>&ndash;&gt;-->
                                  <!--                                  <el-input :disabled="true" v-model="caseDetailFoemData.custName" />-->
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
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" prop="custRefno" label="客户文号:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.custRefno" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" prop="custContactId" label="客户联系人:">
                                <template>

                                  <el-select @change='contactchange' :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.custContactId">
                                    <el-option :key="key" :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId" v-for="(item,key) in selectData.customerContacts" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="抄送人:">
                                <template>
                                  <el-select :clearable="true" default-first-option filterable multiple placeholder="请选择" v-model="caseDetailFoemData.trademarkCaseCustContacts">
                                    <el-option :key="key" :label="item.name" :value="item.custContactId" v-for="(item,key) in selectData.customerContacts" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="信函地址:">
                                <template>
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.letterAddrId">
                                    <el-option :key="key" :label="(item.addressCn||'')+(item.addressEn||'')" :value="item.addrId" v-for="(item,key) in selectData.customerMailAdds" />
                                  </el-select>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="账单联系人:">
                                <template>
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.billCustContactId">
                                    <el-option :key="key" :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId" v-for="(item,key) in selectData.billContacts" />
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
                                  <el-input type="number" min="1" max="100" v-model="caseDetailFoemData.discount" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="账单地址:">
                                <template>
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.billAddrId">
                                    <el-option :key="key" :label="(item.addressCn||'')+(item.addressEn||'')" :value="item.addrId" v-for="(item,key) in selectData.billAdds" />
                                  </el-select>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>

                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row v-if="ch_caseTypr === '许可备案'">
                    <el-col :span="24" class="tilteSpan">
                      <span id="srr-title">{{ appTextShow.title }}</span>
                    </el-col>
                  </el-row>
                  <el-row v-if="ch_caseTypr === '许可备案'">
                    <el-col :span="24" class="form-con-item">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item :label="appTextShow.cnname" class="postInfo-container-item"  prop="appCnName">
                                <el-autocomplete class="inline-input" :clearable='true' v-model="caseDetailFoemData.appCnName" @select="handleAppCnName" :fetch-suggestions="remotepinput" placeholder="请输入内容" :trigger-on-focus="true">
                                </el-autocomplete>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item :label="appTextShow.enname" class="postInfo-container-item">
                                <template>
                                  <el-input v-model="caseDetailFoemData.appEnName" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item :label="appTextShow.type" class="postInfo-container-item" prop="legalNature">
                                <template>
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.legalNature"  @change="changeLegalNature">

                                    <el-option :key="key" :label="item.typeName" :value="item.typeName" v-for="(item,key) in selectData.apptypelist" />

                                  </el-select>

                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="国籍" prop="appGJdq">
                                <template>
                                  <el-select :clearable="true" @change="caseCochange" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appGJdq">
                                    <el-option :key="key" :label="item.countryCn" :value="item.countryCn" v-for="(item,key) in selectData.country" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
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
                          <el-row class="fullRow" v-show='caseDetailFoemData.appGJdq!="中国"'>
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="国家或地区:">
                                <template>

                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appCountryOrRegion">
                                    <el-option :key="key" :label="item.countryCn" :value="item.countryCn" v-for="(item,key) in selectData.casecount" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row class="">
                            <el-col :span="12" class="long-input">
                              <el-form-item :label="appTextShow.cnaddr" class="postInfo-container-item" prop="appCnAddr">
                                <template>
                                  <Autocomplete v-model="caseDetailFoemData.appCnAddr" @change="changeAppCnAddr" @select="appCnAddrChange" type="addressCn" :list="selectData.appaddr.filter(itm=>!!itm.addressCn)"> </Autocomplete>
<!--                                  <el-select :clearable="true" allow-create default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appCnAddr" @change="appCnAddrChange">-->
<!--                                    <el-option :key="item.addrId" :label="item.addressCn" :value="item.addressCn" v-for="(item,key) in selectData.appaddr.filter(itm=>!!itm.addressCn)" />-->
<!--                                  </el-select>-->
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" class="long-input">
                              <el-form-item :label="appTextShow.enaddr" class="postInfo-container-item">
                                <template>

                                  <el-select :clearable="true" allow-create default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appEnAddr">
                                    <el-option :key="key" :label="item.addressEn" :value="item.addressEn" v-for="(item,key) in selectData.appaddr.filter(itm=>!!itm.addressEn)" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.appGJdq=='中国'">
                            <el-col :span="24" class="long-input">
<!--                              省、市、区-->
                              <el-form-item label="申请人（许可人）地址" class="postInfo-container-item" prop="addressGroup">
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
                          <el-row  class="fullRow"  v-if="(['不予注册复审','商标注册','分割申请','异议','变名变址','转让/移转','续展','删减商品项目','变更注册申请代理机构','更正商标申请事项','注册驳回复审','国际注册驳回复审','撤销商标复审', '无效宣告复审', '异议答辩','撤三答辩(提供使用证明)','撤销通用名称答辩','参与不予注册复审','无效宣告答辩','撤销复审答辩','撤销三年停止使用申请','撤销成为通用名称注册商标','无效宣告申请','撤回商标评审','行政复议','许可备案','补发商标注册证','补发商标变转续证明','出具优先权证明文件','出具商标注册证明','商标注销','撤回商标申请'].includes(ch_caseTypr))">
                            <el-col :span="24">
                              <el-form-item v-if="caseDetailFoemData.replaceAgencyName && caseDetailFoemData.replaceAgencyName !== '北京佰舟知识产权代理有限公司' && ['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(caseDetailFoemData.whdAgencyName) && ['内-内', '外-内'].includes(caseDetailFoemData.appFromto)" label="代理人姓名:" class="postInfo-container-item">
                                <el-select default-first-option  :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.agentPerson" filterable>
                                  <el-option v-for="(item,key)  in agentPersonList" :key="key" :label="item" :value="item">
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
                              <el-form-item v-else label="代理人姓名:" class="postInfo-container-item">
                                <el-select allow-create default-first-option  :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.agentPerson" filterable>
                                  <el-option v-for="(item,key)  in $store.getters.userList" :key="key" :label="item.fullname" :value="item.fullname">
                                    <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="委托书:">
                                <template>

                                  <el-button style="margin-left:10px;display: block" size="mini" type="primary" @click="getfileData('1000',$event)">上传</el-button>
                                  <el-upload class="upload-btn" :before-remove="brforeRemoveFile" :on-success='fileUploadSuccess' :file-list="wtsfileList" :show-file-list='true' :action="fileUrl" name='attachFile' :data="fileData('1000')">
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

                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item :label="appTextShow.uploadlang" class="postInfo-container-item">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.uploadFileLanguage">
                                    <el-radio label="中文" />
                                    <el-radio label="外文" />
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
                          <el-row class="" v-if="ch_caseTypr === '许可备案'">
                            <el-col :span="12" v-if="isShowSubjectFile">
                              <el-form-item class="postInfo-container-item" label="申请人（许可人）主体资格证明（中文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1003]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1003',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.uploadFileLanguage=='外文'&&isShowSubjectFile">
                              <el-form-item class="postInfo-container-item" label="申请人（许可人）主体资格证明（英文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1004]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1004',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ch_caseTypr === '许可备案'">
                            <el-col :span="12" v-if="caseDetailFoemData.legalNature=='自然人'">
                              <el-form-item class="postInfo-container-item" label="申请人（许可人）身份证明文件(中文):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1001]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1001',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.uploadFileLanguage=='外文'&&caseDetailFoemData.legalNature=='自然人'">
                              <el-form-item class="postInfo-container-item" label="申请人（许可人）身份证明原文件(外文):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1002]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1002',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ch_caseTypr === '转让/移转'">
                            <el-col :span="12" v-if="caseDetailFoemData.legalNature!='自然人'||(caseDetailFoemData.legalNature=='自然人'&&caseDetailFoemData.uploadFileLanguage=='中文')">
                              <el-form-item class="postInfo-container-item" label="受让人主体资格证明（中文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1003]" />

                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1003',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.uploadFileLanguage=='外文'&&caseDetailFoemData.legalNature!='自然人'">
                              <el-form-item class="postInfo-container-item" label="受让人主体资格证明文件（英文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1004]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1004',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ch_caseTypr === '转让/移转'">
                            <el-col :span="12" v-if="caseDetailFoemData.legalNature=='自然人'">
                              <el-form-item class="postInfo-container-item" label="受让人身份证明文件(中文):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1001]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1001',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.uploadFileLanguage=='外文'&&caseDetailFoemData.legalNature=='自然人'">
                              <el-form-item class="postInfo-container-item" label="受让人身份证明原文件(外文):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1002]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1002',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row class="" v-if="ch_caseTypr != '转让/移转'&&ch_caseTypr != '许可备案'">
                            <el-col :span="12" v-if="isShowSubjectFile">
                              <el-form-item class="postInfo-container-item" label="主体资格证明（中文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1003]" />

                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1003',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.uploadFileLanguage=='外文'&&isShowSubjectFile">
                              <el-form-item class="postInfo-container-item" label="主体资格证明文件（英文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1004]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1004',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ch_caseTypr != '转让/移转'&&ch_caseTypr != '许可备案'">
                            <el-col :span="12" v-if="caseDetailFoemData.legalNature=='自然人'">
                              <el-form-item class="postInfo-container-item" label="身份证明文件(中文):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1001]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1001',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.uploadFileLanguage=='外文'&&caseDetailFoemData.legalNature=='自然人'">
                              <el-form-item class="postInfo-container-item" label="身份证明原文件(外文):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1002]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1002',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row class="fullRow">
                            <el-col :span="24">
<!--                              <el-form-item v-if="['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(caseDetailFoemData.whdAgencyName) && ['内-内', '外-内'].includes(caseDetailFoemData.appFromto)" class="postInfo-container-item" label="联系人:" :prop="ch_caseTypr != '商标查询'?'appContactPerson':''">-->
<!--                                <template>-->
<!--                                  <el-select :clearable="true" @change="contactSelectChange" default-first-option filterable placeholder="请选择" ref="appContactPerson" v-model="caseDetailFoemData.appContactPerson">-->
<!--                                    <el-option :key="key" :label="item" :value="item" v-for="(item,key) in agentPersonList" />-->
<!--                                  </el-select>-->
<!--                                </template>-->
<!--                              </el-form-item>-->
                              <el-form-item class="postInfo-container-item" label="联系人:" :prop="ch_caseTypr != '商标查询'?'appContactPerson':''">
                                <template>
                                  <el-select :clearable="true" @change="contactSelectChange" allow-create default-first-option filterable placeholder="请选择" ref="appContactPerson" v-model="caseDetailFoemData.appContactPerson">
                                    <el-option :key="key" :label="item.nameCn" :value="item.nameCn" v-for="(item,key) in selectData.queryAppContact" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="邮政编码:" :prop="['内-内', '外-内'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.submitType === '网上申请' ? 'appContactZip' : ''">
                                <template>
                                  <el-input @mousewheel.native.prevent placeholder="" type="text" v-model="caseDetailFoemData.appContactZip" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="电话:" prop="">
                                <template>
                                  <el-input placeholder="" v-model="caseDetailFoemData.appContactTel" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="邮箱:">
                                <template>
                                  <el-input placeholder="" v-model="caseDetailFoemData.appContactEmail" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="ch_caseTypr === '转让/移转'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="自然人死亡/企业或其他组织注销证明：">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1023]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1023',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="ch_caseTypr === '转让/移转'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="同意转让声明或商标转移证明：">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1028]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1028',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="有关说明文件:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1020]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1020',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <template>
                    <el-row v-if="mainCaseIds.length===1">
                    <el-col :span="24" class="tilteSpan">
                      <span id="sbxx-title">商标信息</span>
                    </el-col>
                  </el-row>

                    <el-row v-if="mainCaseIds.length===1">
                    <el-col :span="24" class="form-con-item">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-collapse v-if="regNumberList.length&&!['内-外', '外-外'].includes(caseDetailFoemData.appFromto)" v-model="collaptrademarkTable">
                            <el-collapse-item title="商标列表" name="1">
                              <trademarkTable v-if="regNumberList.length" :regNumberList="regNumberList" @queryCanProcessTmChange="queryCanProcessTmState = false" :queryCanProcessTmState="queryCanProcessTmState" :queryModuleData="queryModuleData" :multipleState="false"
                                              :goodClasses="caseDetailFoemData.goodClasses" :multiclass="caseDetailFoemData.multiclass" @getTrademark="getTrademark"></trademarkTable>
                            </el-collapse-item>
                          </el-collapse>
                          <template v-if=" ch_caseTypr ==='异议' ||
                              ch_caseTypr === '异议答辩'|| ch_caseTypr === '不予注册复审'|| ch_caseTypr === '分割申请'">

                            <el-row class="">
                              <el-col :span="8">
                                <el-form-item :prop="ch_caseTypr ==='异议' ||
                              ch_caseTypr === '异议答辩'|| ch_caseTypr === '不予注册复审'?'approvalNo':''" class="postInfo-container-item" label="初审公告号:">
                                  <template>
                                    <el-input @change="(e)=>regnumberchange(e,'approvalNo')" v-model="caseDetailFoemData.approvalNo"/>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item class="postInfo-container-item" label="初审公告日期:" :prop="caseDetailFoemData.caseType=='异议'?'approvalDate':''">
                                  <template>

                                    <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.approvalDate" value-format="yyyy-MM-dd" />
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item class="postInfo-container-item" label="初审公告期号:" :prop="caseDetailFoemData.caseType=='异议'?'approvalNumber':''">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.approvalNumber" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>


                          </template>
                          <el-row class="fullRow" v-if="[
                              '撤销三年停止使用申请',
                              '异议',
                              '异议答辩',
                              '撤三答辩（提供使用证明）',
                              '撤销商标复审',
                              '无效宣告复审',
                              '不予注册复审',
                              '无效宣告申请',
                              '参加不予注册复审',
                              '撤销复审答辩',
                              '无效宣告答辩'].includes(ch_caseTypr)">
                            <el-col :span="12" >
                              <el-form-item class="postInfo-container-item" label="原注册申请日期:">
                                <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.parentAppDate" value-format="yyyy-MM-dd" />
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if=" ch_caseTypr==='国际注册驳回复审'||ch_caseTypr==='注册驳回复审'">
                            <el-col :span="ch_caseTypr==='注册驳回复审' ? 12 : 24">
                              <el-form-item :prop="ch_caseTypr==='国际注册驳回复审'||ch_caseTypr==='注册驳回复审'?'regNumber':''" class="postInfo-container-item" :label="ch_caseTypr==='注册驳回复审' ? '原申请号/国际注册号:' : '原商标申请号/国际注册号:'">
                                <template>
                                  <el-input @change="regnumberchange" v-model="caseDetailFoemData.regNumber" />

                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12"  v-if="ch_caseTypr==='注册驳回复审'">
                              <el-form-item class="postInfo-container-item" label="原注册申请日期:">
                                <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.parentAppDate" value-format="yyyy-MM-dd" />
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="ch_caseTypr==='出具优先权证明文件'">
                            <el-col :span="24">
                              <el-form-item label="商标号:">
                                <template>
                                  <el-input @change="regnumberchange" v-model="caseDetailFoemData.regNumber" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row  v-if="caseDetailFoemData.caseType&&ch_caseTypr!='撤回商标评审'&&ch_caseTypr !='异议'&&
                              ch_caseTypr != '异议答辩'&&ch_caseTypr!='国际注册驳回复审'&&ch_caseTypr!='注册驳回复审'&&ch_caseTypr!='不予注册复审'&&ch_caseTypr!='撤回商标申请'&&ch_caseTypr !='出具优先权证明文件'">
                            <el-col :span="12">
                              <el-form-item v-if="ch_caseTypr === '参加不予注册复审'" prop="approvalNo" class="postInfo-container-item" label="初审公告号:">
                                <template>
                                  <el-input @change="(e)=>regnumberchange(e,'approvalNo')" v-model="caseDetailFoemData.approvalNo" />

                                </template>
                              </el-form-item>
                              <el-form-item v-else :prop="ch_caseTypr!='撤回商标评审'&&ch_caseTypr !='分割申请'&&ch_caseTypr !='异议'&&ch_caseTypr != '商标查询'&&
                              ch_caseTypr != '异议答辩'&&ch_caseTypr!='国际注册驳回复审'&&ch_caseTypr!='注册驳回复审'&&ch_caseTypr!='不予注册复审'&&ch_caseTypr!='撤回商标申请'&&ch_caseTypr !='出具优先权证明文件'?'regNumber':''" class="postInfo-container-item" :label="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.madrid ? '国际注册号' : '注册号:'">
                                <template>
                                  <el-input @change="(v) => regnumberchange(v, 'regNumber')" v-model="caseDetailFoemData.regNumber" />

                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="ch_caseTypr == '撤三答辩（提供使用证明）'">
                              <el-form-item class="postInfo-container-item" label="申请号:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.appNumber" />
                                </template>
                              </el-form-item>
                            </el-col>

                          </el-row>

                          <el-row class="fullRow" v-if="ch_caseTypr=='撤回商标申请'||ch_caseTypr=='撤回商标评审'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" v-if="caseDetailFoemData.changeType === '转让/移转商标'" label="商标申请/注册号">
                                <template>
                                  <el-input @change="regnumberchange" v-model="caseDetailFoemData.regNumber" />
                                </template>
                              </el-form-item>
                              <el-form-item v-else class="postInfo-container-item" :prop="ch_caseTypr=='撤回商标评审'||(ch_caseTypr=='撤回商标申请'&&['撤销三年不使用注册商标', '商标异议'].includes(caseDetailFoemData.changeType))?'regNumber':''" :label="['撤销三年不使用注册商标', '转让/移转商标'].includes(caseDetailFoemData.changeType)?'商标号':'原商标号'">
                                <template>
                                  <el-input @change="regnumberchange" v-model="caseDetailFoemData.regNumber" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" >
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" prop="parentAppNumber" label="原案申请号:" v-if="ch_caseTypr =='分割申请'">
                                <template>
                                  <el-input v-model="caseDetailFoemData.parentAppNumber" @change="regnumberchange"/>

                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" prop="parentDocNumber" label="原案官方发文编号:" v-if="ch_caseTypr =='分割申请'">
                                <template>
                                  <el-input v-model="caseDetailFoemData.parentDocNumber" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ch_caseTypr =='分割申请'">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" prop="docDate" label="原案官文时限基准日期:">
                                <template>

                                  <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.docDate" value-format="yyyy-MM-dd" />
                                </template>
                              </el-form-item>
                            </el-col>

                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.caseType=='行政复议'" >
                            <el-col :span="24" >
                              <el-form-item  class="postInfo-container-item require" label="不予的案件类型:">
                                <el-cascader ref="caseTypecascader"
                                             filterable
                                             style="width: 100%"
                                             v-model="caseTypeList"
                                             :show-all-levels="false"
                                             :options="$store.getters.caseTypeList.filter(item => item.caseType === '商标')"
                                             :props="{ // 級聯菜單默認
                                                value: 'caseType',
                                                label: 'caseType',
                                                children: 'childrens',
                                                checkStrictly:false
                                              }"
                                             @change="(e)=>caseDetailFoemData.reissueType=e[e.length-1]"
                                             placeholder="请选择"
                                >
                                </el-cascader>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row v-if="caseDetailFoemData.caseType=='行政复议'" >
                            <el-col :span="12" >
                              <el-form-item prop="tmOfficeNumber" class="postInfo-container-item " label="不予发文编号:">
                                <template>
                                  <el-input  v-model="caseDetailFoemData.tmOfficeNumber" />
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" prop="docDate" label="官文时限基准日期:">
                                <template>

                                  <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.docDate" value-format="yyyy-MM-dd" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <div v-if="ch_caseTypr !='商标注销'&&ch_caseTypr !='异议'&&
                              ch_caseTypr != '异议答辩'&&
                              ch_caseTypr !='不予注册复审'&&ch_caseTypr !='注册驳回复审'&&
                              ch_caseTypr !='国际注册驳回复审'&&ch_caseTypr !='出具优先权证明文件'&&
                              ch_caseTypr !='撤回商标申请'&&ch_caseTypr!='撤回商标评审'">
                            <template v-if="ch_caseTypr === '许可备案提前终止'">
<!--                              <el-row class="fullRow">-->
<!--                                <el-col :span="24">-->
<!--                                  <el-form-item class="postInfo-container-item" label="被许可人名称（中文）:">-->
<!--                                    <template>-->
<!--                                      <el-autocomplete  @select="handleTransferorCnName" class="inline-input" :clearable='true' v-model="caseDetailFoemData.transferorCnName" :fetch-suggestions="remotepinput" placeholder="请输入内容" :trigger-on-focus="true">-->
<!--                                      </el-autocomplete>-->
<!--                                    </template>-->

<!--                                  </el-form-item>-->
<!--                                </el-col>-->
<!--                              </el-row>-->
<!--                              <el-row class="fullRow">-->
<!--                                <el-col :span="24">-->
<!--                                  <el-form-item class="postInfo-container-item" label="被许可人名称（英文）:">-->
<!--                                    <template>-->
<!--                                      <el-input v-model="caseDetailFoemData.transferorEnName" />-->
<!--                                    </template>-->

<!--                                  </el-form-item>-->
<!--                                </el-col>-->
<!--                              </el-row>-->
<!--                              <el-row class="fullRow">-->
<!--                                <el-col :span="24">-->
<!--                                  <el-form-item class="postInfo-container-item" label="统一社会信用代码:">-->
<!--                                    <template>-->
<!--                                      <el-input v-model="caseDetailFoemData.zrCertCode" />-->
<!--                                    </template>-->

<!--                                  </el-form-item>-->
<!--                                </el-col>-->
<!--                              </el-row>-->
<!--                              <el-row class="fullRow">-->
<!--                                <el-col :span="24">-->
<!--                                  <el-form-item class="postInfo-container-item" label="被许可人地址（中文）:">-->
<!--                                    <template>-->
<!--                                      <el-input v-model="caseDetailFoemData.transferorCnAdress" />-->
<!--                                    </template>-->

<!--                                  </el-form-item>-->
<!--                                </el-col>-->
<!--                              </el-row>-->
<!--                              <el-row class="fullRow">-->
<!--                                <el-col :span="24">-->
<!--                                  <el-form-item class="postInfo-container-item" label="被许可人地址（英文）:">-->
<!--                                    <template>-->
<!--                                      <el-input v-model="caseDetailFoemData.transferorEnAdress" />-->
<!--                                    </template>-->

<!--                                  </el-form-item>-->
<!--                                </el-col>-->
<!--                              </el-row>-->
                              <el-row class="">
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item" label="原商标使用许可备案号:">
                                    <template>
                                      <el-input v-model="caseDetailFoemData.parentDocNumber" />
                                    </template>

                                  </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                  <el-form-item class="postInfo-container-item" label="提前终止日期:">
                                    <template>
                                      <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.earlyStopDate" value-format="yyyy-MM-dd" />

                                    </template>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-row class="fullRow">
                                <el-col :span="24">
                                  <el-form-item class="postInfo-container-item" label="提前终止理由:">
                                    <el-input v-model="caseDetailFoemData.reason" style="width: 100%"/>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                            </template>

                            <el-row class="fullRow" v-if="ch_caseTypr !== '参加不予注册复审'">
                              <el-col :span="24">
                                <el-form-item key="1" v-if="['撤销三年停止使用申请','撤销成为通用名称注册商标','无效宣告申请'].includes(ch_caseTypr)" class="postInfo-container-item" prop="regDate" :label="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.madrid ? '国际注册日期' : '注册日期:'">

                                  <template>
                                    <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.regDate" value-format="yyyy-MM-dd" />

                                  </template>
                                </el-form-item>
                                <el-form-item key="2" v-else class="postInfo-container-item" :label="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.madrid ? '国际注册日期' : '注册日期:'">

                                  <template>
                                    <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.regDate" value-format="yyyy-MM-dd" />

                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <el-row class="" v-if="ch_caseTypr !='参加不予注册复审'&&ch_caseTypr !='商标注销'">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="有效期起始日:">

                                  <template>
                                    <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.validStartDate" value-format="yyyy-MM-dd" />

                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="有效期截止日:">

                                  <template>
                                    <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.validEndDate" value-format="yyyy-MM-dd" />

                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </div>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item  uploader-custfile" label="商标名称:" prop="tmName">
                                <template>

                                  <el-input v-model="caseDetailFoemData.tmName" @change="changeTmName" />

                                  <el-dropdown @command="tkInspect" style="margin-left:10px">
                                    <el-button size="mini" type="primary">
                                      检查
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                      <el-dropdown-item command="1">禁止注册检查
                                      </el-dropdown-item>
                                      <el-dropdown-item command="2">重名检查
                                      </el-dropdown-item>
                                    </el-dropdown-menu>
                                  </el-dropdown>
                                  <div :class="{redClass:tkInspectType=='2',greenClass:tkInspectType=='1'}" style="margin-left: 16px;" v-if="tkInspectText!=''">{{ tkInspectText.content }}
                                  </div>
                                  <div :class="{redClass:tkInspectType=='2',greenClass:tkInspectType=='1'}" style="margin-left: 16px;" v-if="tkInspectText!=''">{{ tkInspectText.cause }}
                                  </div>
                                  <div :class="{redClass:tkInspectType=='2',greenClass:tkInspectType=='1'}" style="margin-left: 16px;" v-if="tkInspectText!=''">{{ tkInspectText.innerMemo }}
                                  </div>
                                </template>
                              </el-form-item>

                            </el-col>

                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="商标英文:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.tmNameEn" />

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
<!--                          <template v-if="['异议','无效宣告申请','不予注册复审','参加不予注册复审'].includes(ch_caseTypr)">-->
<!--                            <el-row class="fullRow">-->
<!--                             <el-col :span="24">-->
<!--                               <el-form-item class="postInfo-container-item" label="引证商标号:">-->
<!--                                 <template>-->
<!--                                   <el-input v-model="caseDetailFoemData.quoteRegNumber" type="textarea" />-->
<!--                                 </template>-->
<!--                               </el-form-item>-->
<!--                             </el-col>-->
<!--                            </el-row>-->
<!--                            <el-row class=" ">-->
<!--                              <el-col :span="12">-->
<!--                                <el-form-item class="postInfo-container-item" label="引证商标名称:">-->
<!--                                  <template>-->
<!--                                    <el-input v-model="caseDetailFoemData.quoteTm" />-->
<!--                                  </template>-->
<!--                                </el-form-item>-->
<!--                              </el-col>-->
<!--                              <el-col :span="12">-->
<!--                                <el-form-item class="postInfo-container-item" label="引证商标类别:">-->
<!--                                  <template>-->
<!--                                    <el-input v-model="caseDetailFoemData.quoteTmClass" />-->
<!--                                  </template>-->
<!--                                </el-form-item>-->
<!--                              </el-col>-->
<!--                            </el-row>-->
<!--                          </template>-->
                          <template v-if="ch_caseTypr==='撤销复审答辩'||ch_caseTypr === '异议答辩' || ch_caseTypr==='无效宣告申请' || ch_caseTypr==='无效宣告答辩'">
                            <el-row class=" ">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="引证商标名称:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.quoteTm" />
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="引证商标类别:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.quoteTmClass" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <!-- <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="引证商标注册号:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.quoteRegNumber" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row> -->
                          </template>
                          <template v-if="ch_caseTypr==='撤销复审答辩'||ch_caseTypr==='撤三答辩（提供使用证明）'||ch_caseTypr === '异议答辩' || ch_caseTypr==='无效宣告答辩'||ch_caseTypr==='国际注册驳回复审'||ch_caseTypr==='注册驳回复审'||ch_caseTypr==='不予注册复审'||ch_caseTypr==='撤销商标复审'||ch_caseTypr==='无效宣告复审'||ch_caseTypr==='参加不予注册复审'">
                            <el-row class=" ">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" prop="tmOfficeNumber" label="官方发文编号:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.tmOfficeNumber" />
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" prop="docDate" label="官文时限基准日期:">
                                  <template>

                                    <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.docDate" value-format="yyyy-MM-dd" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <el-row class="fullRow" v-if="ch_caseTypr!='参加不予注册复审' || ch_caseTypr !='注册驳回复审'&&ch_caseTypr !='国际注册驳回复审'&&ch_caseTypr !='异议答辩'&&ch_caseTypr!='撤三答辩（提供使用证明）'">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="引证商标注册号:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.quoteRegNumber" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item uploader-custfile" label="商标图样:">
                                <template>

                                  <el-input :disabled="true" v-model="fileName[1018]" />

                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1018',$event)">上传</el-button>
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="deleteFile(materialArray.find(item => item.materialTypeId ==1018)?materialArray.find(item => item.materialTypeId ==1018):{materialTypeId:1018})">删除</el-button>

                                  <div><img :src="tyimage" style="width:100px;height:100px;margin: 10px 10px;" v-if="tyimage"></div>

                                  <div>
                                    图样文件格式应为jpg，图形应清晰，图样文件大小应小于“200KB”且图形像素介于“400×400－1500×1500”之间。如果通过扫
                                    描获得图样的，应按24位彩色、300dpi分辨率扫描符合《商标法》及其实施条例规定的图形（图形清晰，大于5×5厘米且小于10×10厘米）。
                                    申请人（或代理人）应确保扫描后的图形与原图形的色彩深浅（或灰度）一致，否则，可能影响《商标注册证》上图形的清晰度。）;
                                    以颜色组合或者着色图样申请商标注册的，应分别上传着色图样及黑白稿，黑白稿在”黑白稿“中上传。
                                    不指定颜色的，只上传黑白图样即可。
                                    当图样没有正确显示时,那是因为您的图样不符合要求请勿下一步,否则递交申请会失败
                                  </div>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.caseType == '撤回撤销三年不使用注册商标'">
                            <el-col :span="24">

                              <el-form-item label="商标注册人:" class="postInfo-container-item">
                                <template>
                                  <el-input type="text"  v-model="caseDetailFoemData.respondentNameCn">
                                  </el-input>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">

                              <el-form-item label="商标设计说明:" class="postInfo-container-item" :prop="['商标注册', '分隔申请'].includes(caseDetailFoemData.caseType) && ['外-内', '内-内'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.submitType === '网上申请' ? 'tmDesignDeclare' : ''">
                                <template>
                                  <el-input type="textarea" :rows="4" :maxlength="['外-内', '内-内'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.submitType === '网上申请' ? 180 : 10000" placeholder="请输入内容" v-model="caseDetailFoemData.tmDesignDeclare">
                                  </el-input>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row v-if="caseDetailFoemData.caseType == '出具优先权证明文件'">
                            <el-col :span="8">
                              <el-form-item label="申请日:" class="postInfo-container-item">
                                <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.appDate" value-format="yyyy-MM-dd" />
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="递交日:" class="postInfo-container-item">
                                <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.submitDate" value-format="yyyy-MM-dd" />
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="申请号:" class="postInfo-container-item">
                                <el-input v-model="caseDetailFoemData.appNumber" />
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.caseType">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="商标国际分类" :prop="noNeedTosubmit.includes(ch_caseTypr)?'':'goodClasses'">
                                <template>
                                  <el-input placeholder="例如:1;2;3" v-model="caseDetailFoemData.goodClasses" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="商品/服务项目">
                                <template>
                                  <Goods v-if="caseDetailFoemData.appFromto" ref="goods" @changeGoodClass="changeGoodClass" :isRevamp="caseDetailFoemData.isRevamp" :appFromto="caseDetailFoemData.appFromto" :trademarkCaseCategoryModifyList="caseDetailFoemData.trademarkCaseCategoryModifyList" :goodsVersionList="goodsVersionList" :caseId="caseDetailFoemData.caseId" :appId='caseDetailFoemData.appId' @getGoods='getGoods' @delgood='delgood' :goodsListData='caseDetailFoemData.goods'></Goods>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="['内-外', '外-外'].includes(caseDetailFoemData.appFromto)">
                            <el-col :span="24">
                              <el-form-item label="商品查对文件:" class="postInfo-container-item">
                                <check-goods-list ref="checkGoods" @delCheckGoods="delCheckGoods" :goodsListData='caseDetailFoemData.goods' :goodsVersionList="goodsVersionList" @getCheckGoodsList="getCheckGoodsList" :caseId="caseDetailFoemData.caseId" :caseIdArray="mainCaseIds" :total="checkGoodListTotal" :checkGoodList="checkGoodList"></check-goods-list>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="(['出具商标注册证明','不予注册复审','商标注册','分割申请','异议','变名变址','转让/移转','续展','删减商品项目','变更注册申请代理机构','更正商标申请事项','注册驳回复审','国际注册驳回复审','撤销商标复审','无效宣告复审','异议答辩','撤三答辩(提供使用证明)','撤销通用名称答辩','参与不予注册复审','无效宣告答辩','撤销复审答辩','撤销三年停止使用申请','撤销成为通用名称注册商标','无效宣告申请','撤回商标评审','行政复议','许可备案','补发商标注册证','补发商标变转续证明','商标注销','撤回商标申请'].includes(ch_caseTypr))">
                            <el-col :span="8">
                              <el-form-item  class="postInfo-container-item" label="递交日期:">
                                <template>
                                  <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.submitDate" value-format="yyyy-MM-dd" />
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8" >
                              <el-form-item class="postInfo-container-item" label="申请日期:">
                                <template>
                                  <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.appDate" value-format="yyyy-MM-dd" />
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8" >
                              <el-form-item class="postInfo-container-item" label="申请号:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.appNumber"  @change="(e)=>changeNumberA(e,'appNumber')"/>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row class="fullRow" v-if='caseDetailFoemData.stageName=="裁定"'>
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="裁定结果:">
                                <template>
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.decisionResult">
                                    <el-option label="输" value="输" />
                                    <el-option label="赢" value="赢" />
                                    <el-option label="部分" value="部分" />
                                  </el-select>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.caseType=='转让/移转'">
                            <el-col :span="24">
                              <el-form-item label="原代理组织:" class="postInfo-container-item">
                                <el-input v-model="caseDetailFoemData.respondentAgency"></el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="种类:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.tmType">
                                    <el-radio label="1">一般</el-radio>
                                    <el-radio label="2">集体</el-radio>
                                    <el-radio label="3">证明</el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.tmType=='2'||caseDetailFoemData.tmType=='3'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="集体/证明商标使用管理规则:">
                                <template>
                                  <el-input :rows="3" type="textarea" v-model="caseDetailFoemData.memberRule" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.tmType=='2'||caseDetailFoemData.tmType=='3'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="集体/证明商标使用管理规则(附件):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1005]" />

                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1005',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.tmType=='2'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="集体成员名单:">
                                <template>
                                  <el-input :rows="4" placeholder="请输入内容" type="textarea" v-model="caseDetailFoemData.memberNamelist" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.tmType=='2'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="集体成员名单(附件):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1006]" />

                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1006',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <template v-if="caseDetailFoemData.tmType=='3'">
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="申请人是否具备检测能力:">
                                  <template>
                                    <el-radio-group v-model="caseDetailFoemData.isAppWithDetectAbility">
                                      <el-radio label="否" />
                                      <el-radio label="是" />
                                    </el-radio-group>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="caseDetailFoemData.isAppWithDetectAbility=='是'">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="申请人检测资质证书（附件）:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[1007]" />
                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1007',$event)">上传</el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="caseDetailFoemData.isAppWithDetectAbility=='是'">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="申请人专业检测设备清单:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[1008]" />
                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1008',$event)">上传</el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="caseDetailFoemData.isAppWithDetectAbility=='是'">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="申请人专业技术人员名单（附件）:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[1009]" />

                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1009',$event)">上传</el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="caseDetailFoemData.isAppWithDetectAbility=='是'">
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="申请人技术人员证书:">
                                  <template>
                                    <el-input :disabled="true" v-model="fileName[1010]" />

                                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1010',$event)">上传</el-button>
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="是否三维标志:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.ifSolidTm">
                                    <el-radio label="0">否</el-radio>
                                    <el-radio label="1">是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="是否颜色组合:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.colorSign">
                                    <el-radio label="0">否</el-radio>
                                    <el-radio label="1">是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="指定颜色:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.assignColor">
                                    <el-radio :label="false">否</el-radio>
                                    <el-radio :label="true">是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="声音标志:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.tmVoice">
                                    <el-radio label="0">否</el-radio>
                                    <el-radio label="1">是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.tmVoice=='1'">
                              <el-form-item class="postInfo-container-item" label="声音文件:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1016]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1016',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <!-- <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="要求优先权:">
                                <template>
                                  <el-radio-group v-model="ifpriority">
                                    <el-radio label="0">否</el-radio>
                                    <el-radio label="1">是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row> -->
                          <!-- <el-row class="fullRow" v-if="ifpriority=='1'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="要求优先权声明:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.priorityType">
                                    <el-radio label="1">基于第一次申请的优先权</el-radio>
                                    <el-radio label="2">基于展会的优先权</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ifpriority=='1'">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="优先权国家:">
                                <template>
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.priorityBaseCrty">
                                    <el-option :key="key" :label="item.countryCn" :value="item.countryCn" v-for="(item,key) in selectData.country" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="优先权日期:">
                                <template>
                                  <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.priorityAppDate"
                                    value-format="yyyy-MM-dd" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ifpriority=='1'">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="优先权文件后补:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.isLoadPriorityFile">
                                    <el-radio label="0">否</el-radio>
                                    <el-radio label="1">是</el-radio>
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.isLoadPriorityFile=='1'">
                              <el-form-item class="postInfo-container-item" label="优先权证明文件:">
                                <template>

                                  <el-input :disabled="true" v-model="fileName[409]" />

                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('409',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="ifpriority=='1'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="优先权申请号:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.priorityAppNum" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row> -->

                        </el-col>

                      </el-row>
                    </el-col>

                  </el-row>
                  </template>

<!--                  引证商标信息-->
                  <template v-if="['异议', '无效宣告申请', '不予注册复审', '参加不予注册复审', '异议答辩', '撤销复审答辩', '无效宣告答辩', '撤销三年停止使用申请'].includes(ch_caseTypr)">
                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="yz-title">引证商标信息</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="form-con-item">
                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="引证商标列表" class="postInfo-container-item" :class="ch_caseTypr === '无效宣告申请' && ['内-内', '外-内'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.lawList && (caseDetailFoemData.lawList.includes('《商标法》第三十条') || caseDetailFoemData.lawList.includes('《商标法》第三十一条')) && caseDetailFoemData.submitType === '网上申请' ? 'require' : ''">
                                  <y-zgrid :ch_caseTypr="ch_caseTypr" :caseId="caseDetailFoemData.caseId" :case-data="caseDetailFoemData" type="edit" :tableTitleList="yzTitleList" :tableData="caseDetailFoemData.quotes" :tmCaseId="caseDetailFoemData.tmCaseId" @delYzData="delYzData" @addYzData="addYzData"/>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </template>

<!--                  法律条款和事实理由-->
                  <template v-if="ch_caseTypr === '异议'">
                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="fl-title">法律条款和事实理由</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="form-con-item">
                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row>
                              <el-col :span="caseDetailFoemData.quotedOthersMaterial ? 12 : 24">
                                <el-form-item class="postInfo-container-item" label="是否引用其他异议申请证据材料:" prop="quotedOthersMaterial">
                                  <el-radio-group v-model="caseDetailFoemData.quotedOthersMaterial">
                                      <el-radio :label="0">否</el-radio>
                                      <el-radio :label="1">是</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" v-if="caseDetailFoemData.quotedOthersMaterial">
                                <el-form-item class="postInfo-container-item" label="引证异议申请号:" prop="quotedAppNumber">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.quotedAppNumber" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row v-if="!caseDetailFoemData.quotedOthersMaterial">
                              <el-col :span="12">
                                <el-form-item class="postInfo-container-item" label="是否提交涉商业机密证据材料:" prop="subBusinessSecrets">
                                  <el-radio-group v-model="caseDetailFoemData.subBusinessSecrets" >
                                      <el-radio :label="0">否</el-radio>
                                      <el-radio :label="1">是</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" v-if="caseDetailFoemData.subBusinessSecrets == 1">
                                <el-form-item class="postInfo-container-item" label="涉商业机密证据材料:">
                                  <template slot="label"><span class="required-asterisk">*</span>涉商业机密证据材料</template>
                                  <el-input :disabled="true" v-model="fileName[301677]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('301677',$event)">上传</el-button>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="24">
                                <el-form-item class="postInfo-container-item" label="其他说明文件:">
                                  <template slot="label"><span class="required-asterisk" v-show="caseDetailFoemData.subBusinessSecrets && !caseDetailFoemData.quotedOthersMaterial">*</span>其他说明文件</template>
                                  <el-input :disabled="true" v-model="fileName[1020]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1020',$event)">上传</el-button>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row class="fullRow" v-if="!caseDetailFoemData.quotedOthersMaterial">
                              <el-col :span="24">
                                <el-form-item label="法律条款和事实理由列表" class="postInfo-container-item">
                                  <y-zgrid :materialTypeId="301603" :fileName="fileName[301603]" type="edit" idFlData right-key :tableTitleList="flTitleList" :tableData="caseDetailFoemData.demurCaseLaws" :fileSize="caseDetailFoemData.yyzjFileSize" :tmCaseId="caseDetailFoemData.caseId" @delete="deleteFlData" @edit="editFlData" @delYzData="delFlData" @addYzData="addFlData" @getResponseAndFile="getResponseAndFile" @deleteFile="deleteFile" @getfileData="getfileData"/>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>


<!--                    补充证据-->
                    <el-row>
                      <el-col :span="24" class="tilteSpan">
                        <span id="bc-title">补充证据</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" class="form-con-item">
                        <el-row class="form-border">
                          <el-col :span="24">
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="补充证据列表" class="postInfo-container-item">
                                  <y-zgrid :fileSize="caseDetailFoemData.yybcFileSize" style="margin-top: 10px" :materialTypeId="301606" :fileName="fileName[301606]" type="view" idFlData right-key :tableTitleList="zjTitleList" :tableData="caseDetailFoemData.demurCaseLawBCs" :tmCaseId="caseDetailFoemData.caseId" @delete="deleteZjData" @edit="editZjData" @delYzData="delZjData" @addYzData="addZjData" @getResponseAndFile="getResponseAndFile" @deleteFile="deleteFile" @getfileData="getfileData"/>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </template>
<!--                  申请人信息-->
                  <el-row v-if="ch_caseTypr != '许可备案'">
                    <el-col :span="24" class="tilteSpan">
                      <span id="srr-title">{{ appTextShow.title }}</span>
                    </el-col>
                  </el-row>
                  <el-row v-if="ch_caseTypr != '许可备案'">
                    <el-col :span="24" class="form-con-item">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="">
                            <el-col :span="12">
<!--                              中文名称-->
                              <el-form-item :label="appTextShow.cnname" class="postInfo-container-item" prop="appCnName">
                                <template>
                                  <el-autocomplete class="inline-input" :clearable='true' v-model="caseDetailFoemData.appCnName" @select="handleAppCnName" :fetch-suggestions="remotepinput" placeholder="请输入内容" :trigger-on-focus="true">
                                  </el-autocomplete>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="6"  v-if="['国际注册驳回复审','注册驳回复审'].includes(ch_caseTypr)">
                              <el-form-item label="是否变更名义" class="postInfo-container-item" >
                                <el-radio-group v-model="caseDetailFoemData.isChangeName" class="custom-radio-group" @change="changeIsChangeName">
                                  <el-radio :label="1">申请人名义</el-radio>
                                  <el-radio :label="2">本业务商标代表人</el-radio>
                                  <el-radio :label="3">其他</el-radio>
                                </el-radio-group>
                              </el-form-item>
                            </el-col>
                            <el-col :span="6" v-else>
                              <el-form-item></el-form-item>
                            </el-col>
<!--                              主体法律性质-->
                            <el-col :span="6" v-if="caseTypeAndAppFromto">
                              <el-form-item :label="appTextShow.type" class="postInfo-container-item" :prop="'legalNature'">
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.legalNature"  @change="changeLegalNature">
                                    <el-option :key="key" :label="item.typeName" :value="item.typeName" v-for="(item,key) in selectData.apptypelist" />
                                  </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="6" v-else>
                              <el-form-item :label="appTextShow.type" class="postInfo-container-item">
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.legalNature"  @change="changeLegalNature">
                                    <el-option :key="key" :label="item.typeName" :value="item.typeName" v-for="(item,key) in selectData.apptypelist" />
                                  </el-select>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row v-if="['国际注册驳回复审','注册驳回复审'].includes(ch_caseTypr) && caseDetailFoemData.isChangeName && caseDetailFoemData.submitType==='网上申请'">
                            <el-col :span="12" v-if="[1,2,3].includes(caseDetailFoemData.isChangeName)">
                              <el-form-item :key="caseDetailFoemData.isChangeName" prop="preChangeAppCnName" :label="preChangeAppCnNameMap[caseDetailFoemData.isChangeName]" class="postInfo-container-item">
                                <el-autocomplete class="inline-input" :clearable='true' v-model="caseDetailFoemData.preChangeAppCnName" :fetch-suggestions="remotepinput" placeholder="请输入内容" :trigger-on-focus="true">
                                  </el-autocomplete>
                              </el-form-item>
                            </el-col>
                            <el-col span="12">
                              <el-form-item class="postInfo-container-item require" :label="caseDetailFoemData.isChangeName == 1 ? '名义变更证明:' : caseDetailFoemData.isChangeName == 2 ? '变更代表人申请:' : '相关材料:'">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1032]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1032',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="12">
<!--                              英文名称-->
                                <el-form-item :label="appTextShow.enname" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.appEnName" />
                                  </template>
                                </el-form-item>

                            </el-col>
<!--                            国籍-->
                            <el-col :span="12" class="country">
                              <el-form-item  class="postInfo-container-item" label="国籍" prop="appGJdq">
                                <template>
                                  <el-select :clearable="true" @change="caseCochange" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appGJdq">
                                    <el-option :key="key" :label="item.countryCn" :value="item.countryCn" v-for="(item,key) in selectData.country" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="12" class="long-input">
<!--                              中文地址-->
                              <el-form-item :label="appTextShow.cnaddr" class="postInfo-container-item" prop="appCnAddr">
                                <template>
                                  <Autocomplete v-model="caseDetailFoemData.appCnAddr" @change="changeAppCnAddr" @select="appCnAddrChange" type="addressCn" :list="selectData.appaddr.filter(itm=>!!itm.addressCn)"> </Autocomplete>
                                  <!--                                  <el-select :clearable="true" allow-create default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appCnAddr"  @change="appCnAddrChange">-->
                                  <!--                                    <el-option :key="item.addrId":label="item.addressCn" :value="item.addressCn" v-for="(item,key) in selectData.appaddr.filter(itm=>!!itm.addressCn)" />-->
                                  <!--                                  </el-select>-->
                                </template>
                              </el-form-item>
                            </el-col>
<!--                            申请人国家或地区-->
                            <el-col :span="12" v-show='caseDetailFoemData.appGJdq!="中国"'>
                              <el-form-item class="postInfo-container-item" label="国家或地区:">
                                <template>

                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appCountryOrRegion">
                                    <el-option :key="key" :label="item.countryCn" :value="item.countryCn" v-for="(item,key) in selectData.casecount" />
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
<!--                              英文地址-->
                              <el-form-item :label="appTextShow.enaddr" class="postInfo-container-item">
                                <template>

                                  <el-select :clearable="true" allow-create default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appEnAddr">
                                    <el-option :key="key" :label="item.addressEn" :value="item.addressEn" v-for="(item,key) in selectData.appaddr.filter(itm=>!!itm.addressEn)" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row>
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
<!--                          <el-row class="fullRow">-->
<!--                            -->
<!--                          </el-row>-->


                          <el-row  class="fullRow" v-if="(['不予注册复审','商标注册','分割申请','异议','变名变址','转让/移转','续展','删减商品项目','变更注册申请代理机构','更正商标申请事项','注册驳回复审','国际注册驳回复审','撤销商标复审','无效宣告复审','异议答辩','撤三答辩(提供使用证明)','撤销通用名称答辩','参与不予注册复审','无效宣告答辩','撤销复审答辩','撤销三年停止使用申请','撤销成为通用名称注册商标','无效宣告申请','撤回商标评审','行政复议','许可备案','补发商标注册证','补发商标变转续证明','出具优先权证明文件','出具商标注册证明','商标注销','撤回商标申请'].includes(ch_caseTypr))">
                            <el-col :span="24">
                              <el-form-item v-if="caseDetailFoemData.replaceAgencyName && caseDetailFoemData.replaceAgencyName !== '北京佰舟知识产权代理有限公司' && ['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(caseDetailFoemData.whdAgencyName) && ['内-内', '外-内'].includes(caseDetailFoemData.appFromto)" label="代理人姓名:" class="postInfo-container-item">
                                <el-select default-first-option  :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.agentPerson" filterable>
                                  <el-option v-for="(item,key)  in agentPersonList" :key="key" :label="item" :value="item">
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
                              <el-form-item v-else label="代理人姓名:" class="postInfo-container-item">
                                <el-select allow-create default-first-option  :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.agentPerson" filterable>
                                  <el-option v-for="(item,key)  in $store.getters.userList" :key="key" :label="item.fullname" :value="item.fullname">
                                    <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row class="fullRow">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="委托书:" :class="{'require': ch_caseTypr==='无效宣告申请' && caseDetailFoemData.submitType==='网上申请'}">
                                <template>

                                  <el-button style="margin-left:10px;display: block" size="mini" type="primary" @click="getfileData('1000',$event)">上传</el-button>
                                  <el-upload class="upload-btn" :before-remove="brforeRemoveFile" :on-success='fileUploadSuccess' :file-list="wtsfileList" :show-file-list='true' :action="fileUrl" name='attachFile' :data="fileData('1000')">
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

                          <el-row class="fullRow" v-if="(caseDetailFoemData.submitType==='线下申请' && ch_caseTypr==='无效宣告申请') || ch_caseTypr!=='无效宣告申请'">
                            <el-col :span="24">
                              <el-form-item :label="appTextShow.uploadlang" class="postInfo-container-item" prop="uploadFileLanguage">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.uploadFileLanguage">
                                    <el-radio label="中文" />
                                    <el-radio label="外文" />
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                                                    <template v-if="ch_caseTypr != '许可备案'">
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
                          </template>
                          <el-row class="" v-if="ch_caseTypr === '许可备案'">
                            <el-col :span="12" v-if="caseDetailFoemData.legalNature!='自然人'||(caseDetailFoemData.legalNature=='自然人'&&caseDetailFoemData.uploadFileLanguage=='中文')">
                              <el-form-item class="postInfo-container-item" label="申请人（许可人）主体资格证明（中文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1003]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1003',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.uploadFileLanguage=='外文'&&caseDetailFoemData.legalNature!='自然人'">
                              <el-form-item class="postInfo-container-item" label="申请人（许可人）主体资格证明（英文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1004]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1004',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ch_caseTypr === '许可备案'">
                            <el-col :span="12" v-if="caseDetailFoemData.legalNature=='自然人'">
                              <el-form-item class="postInfo-container-item" label="申请人（许可人）身份证明文件(中文):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1001]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1001',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.uploadFileLanguage=='外文'&&caseDetailFoemData.legalNature=='自然人'">
                              <el-form-item class="postInfo-container-item" label="申请人（许可人）身份证明原文件(外文):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1002]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1002',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ch_caseTypr === '转让/移转'">
                            <el-col :span="12" v-if="caseDetailFoemData.legalNature!='自然人'||(caseDetailFoemData.legalNature=='自然人'&&caseDetailFoemData.uploadFileLanguage=='中文')">
                              <el-form-item class="postInfo-container-item" label="受让人主体资格证明（中文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1003]" />

                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1003',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.uploadFileLanguage=='外文'&&caseDetailFoemData.legalNature!='自然人'">
                              <el-form-item class="postInfo-container-item" label="受让人主体资格证明文件（英文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1004]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1004',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ch_caseTypr === '转让/移转'">
                            <el-col :span="12" v-if="caseDetailFoemData.legalNature=='自然人'">
                              <el-form-item class="postInfo-container-item" label="受让人身份证明文件(中文):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1001]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1001',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.uploadFileLanguage=='外文'&&caseDetailFoemData.legalNature=='自然人'">
                              <el-form-item class="postInfo-container-item" label="受让人身份证明原文件(外文):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1002]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1002',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ch_caseTypr != '转让/移转'&&ch_caseTypr != '许可备案'">
                            <el-col :span="12" v-if="isShowSubjectFile">
                              <el-form-item class="postInfo-container-item" label="主体资格证明（中文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1003]" />

                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1003',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.uploadFileLanguage=='外文'&&isShowSubjectFile">
                              <el-form-item class="postInfo-container-item" label="主体资格证明文件（英文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1004]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1004',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ch_caseTypr != '转让/移转'&&ch_caseTypr != '许可备案'">
                            <el-col :span="12" v-if="caseDetailFoemData.legalNature=='自然人'">
                              <el-form-item class="postInfo-container-item" label="身份证明文件(中文):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1001]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1001',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.uploadFileLanguage=='外文'&&caseDetailFoemData.legalNature=='自然人'">
                              <el-form-item class="postInfo-container-item" label="身份证明原文件(外文):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1002]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1002',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row class="fullRow">
                            <el-col :span="24">
<!--                              <el-form-item v-if="['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(caseDetailFoemData.whdAgencyName) && ['内-内', '外-内'].includes(caseDetailFoemData.appFromto)" class="postInfo-container-item" label="联系人:" :prop="ch_caseTypr != '商标查询'?'appContactPerson':''">-->
<!--                                <template>-->
<!--                                  <el-select :clearable="true" @change="contactSelectChange" default-first-option filterable placeholder="请选择" ref="appContactPerson" v-model="caseDetailFoemData.appContactPerson">-->
<!--                                    <el-option :key="key" :label="item" :value="item" v-for="(item,key) in agentPersonList" />-->
<!--                                  </el-select>-->
<!--                                </template>-->
<!--                              </el-form-item>-->
                              <el-form-item class="postInfo-container-item" label="联系人:" :prop="ch_caseTypr != '商标查询'?'appContactPerson':''">
                                <template>
                                  <el-select :clearable="true" @change="contactSelectChange" allow-create default-first-option filterable placeholder="请选择" ref="appContactPerson" v-model="caseDetailFoemData.appContactPerson">
                                    <el-option :key="key" :label="item.nameCn" :value="item.nameCn" v-for="(item,key) in selectData.queryAppContact" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="邮政编码:" :prop="['内-内', '外-内'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.submitType === '网上申请' ? 'appContactZip' : ''">
                                <template>
                                  <el-input @mousewheel.native.prevent placeholder="" type="number" v-model="caseDetailFoemData.appContactZip" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="电话:" prop="">
                                <template>
                                  <el-input placeholder="" v-model="caseDetailFoemData.appContactTel" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="邮箱:">
                                <template>
                                  <el-input :disabled="emailDisabled" placeholder="" v-model="caseDetailFoemData.appContactEmail" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="ch_caseTypr === '转让/移转'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="自然人死亡/企业或其他组织注销证明：">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1023]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1023',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="ch_caseTypr === '转让/移转'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="同意转让声明或商标转移证明：">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1028]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1028',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row class="" v-if="ch_caseTypr !== '异议'">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="有关说明文件:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1020]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1020',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>

                  <el-row v-if="ch_caseTypr === '转让/移转'||caseDetailFoemData.changeType==='转让'">
                    <el-col :span="24" class="tilteSpan">
                      <span id="zrrxx-title">转让人信息</span>
                    </el-col>
                  </el-row>
                  <el-row v-if="ch_caseTypr === '转让/移转'||caseDetailFoemData.changeType==='转让'">
                    <el-col :span="24" class="form-con-item">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="转让人中文名称:">
                                <template>
                                  <el-autocomplete @select="handleTransferorCnName" class="inline-input" :clearable='true' v-model="caseDetailFoemData.transferorCnName" :fetch-suggestions="remotepinput" placeholder="请输入内容" :trigger-on-focus="true">
                                  </el-autocomplete>
<!--                                  v-model=""-->
<!--                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择">-->
<!--                                    <el-option :key="key" :label="item.applicantName" :value="item.applicantName" v-for="(item,key) in selectData.apps" />-->
<!--                                  </el-select>-->

                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="转让人主体法律性质（类型）:">
                                <template>
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.transferorType" @change="handleChangeTfType">
                                    <el-option :key="key" :label="item.typeName" :value="item.typeName" v-for="(item,key) in selectData.apptypelist" />
                                  </el-select>

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="转让人英文名称:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.transferorEnName" />
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="转让人国籍:">
                                <template>
                                  <el-select :clearable="true" @change="trancaseCochange" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.transferorNationality">
                                    <el-option :key="key" :label="item.countryCn" :value="item.countryCn" v-for="(item,key) in selectData.country" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="转让人中文地址:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.transferorCnAdress" @input="changeTransferorCnAdress"/>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="转让人国家或地区:">
                                <template>

                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.transferorCountryAndregion">
                                    <el-option :key="key" :label="item.countryCn" :value="item.countryCn" v-for="(item,key) in selectData.casecount" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.transferorNationality=='中国'">
                            <el-col :span="24" class="long-input">
<!--                              省、市、区-->
                              <el-form-item label="转让人地址省市区" class="postInfo-container-item">
                                <template>
                                    <el-select
                                      v-model="transferorAddress.province"
                                      placeholder="请选择省"
                                      style="width: 120px; margin-right: 10px"
                                      @change="handleTfProvinceChange"
                                      filterable
                                      clearable
                                    >
                                      <el-option
                                        v-for="item in tfProvinceList"
                                        :key="item.regionCode"
                                        :label="item.abbrName"
                                        :value="item.regionCode"
                                      />
                                    </el-select>
                                    <el-select
                                      v-model="transferorAddress.city"
                                      placeholder="请选择市"
                                      style="width: 120px; margin-right: 10px"
                                      @change="handleTfCityChange"
                                      filterable
                                      clearable
                                      :disabled="!transferorAddress.province"
                                    >
                                      <el-option
                                        v-for="item in tfCityList"
                                        :key="item.regionCode"
                                        :label="item.abbrName"
                                        :value="item.regionCode"
                                      />
                                    </el-select>
                                    <el-select
                                      v-model="transferorAddress.district"
                                      placeholder="请选择区"
                                      style="width: 120px"
                                      filterable
                                      clearable
                                      :disabled="!transferorAddress.city"
                                    >
                                      <el-option
                                        v-for="item in tfDistrictList"
                                        :key="item.regionCode"
                                        :label="item.abbrName"
                                        :value="item.regionCode"
                                      />
                                    </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="转让人英文地址:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.transferorEnAdress" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
<!--                          <el-row class="">-->


<!--                          </el-row>-->
                          <!-- <el-row class="" v-if="caseDetailFoemData.transferorType=='自然人'">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="转让人证件名称:" >
                                <template>
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.transferorCertificateName">
                                    <el-option label="身份证" value="身份证" />
                                    <el-option label="护照" value="护照" />
                                    <el-option label="其他" value="其他" />
                                  </el-select>

                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.transferorType=='自然人'">
                              <el-form-item class="postInfo-container-item" label="转让人证件号:">
                                <template>
                                  <el-input placeholder="" v-model="caseDetailFoemData.transferorCertificateNumber" />

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row> -->
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="转让人身份证明文件名称:" prop="transferorCertificateName">
                                <template v-if="caseDetailFoemData.transferorType!=='自然人'&&caseDetailFoemData.transferorNationality!=='中国'">
                                  <el-input placeholder="" v-model="caseDetailFoemData.transferorCertificateName" />
                                </template>
                                <template v-else>
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.transferorCertificateName">
                                    <el-option v-for="(item,index) in transferorIdTypeOptions" :key="index" :label="item.typeName" :value="item.typeName" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.transferorNationality == '中国'&&caseDetailFoemData.transferorType!='自然人'">
                                <el-form-item prop="zrCertCode" class="postInfo-container-item" label="转让人统一社会信用代码:">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.zrCertCode"/>
                                  </template>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12" v-else>
                                <el-form-item
                                  class="postInfo-container-item"
                                  label="转让人身份证明文件号码:"
                                  :prop="caseDetailFoemData.transferorType!=='自然人'&&caseDetailFoemData.transferorNationality!=='中国'?'':'transferorCertificateNumber'"
                                >
                                  <el-input v-model="caseDetailFoemData.transferorCertificateNumber" />
                                </el-form-item>
                              </el-col>
                          </el-row>
                          <!-- <el-row class="fullRow" v-if="caseDetailFoemData.transferorNationality == '中国'&&caseDetailFoemData.transferorType!='自然人'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="转让人统一社会信用代码:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.zrCertCode" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row> -->
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="转让人邮政编码:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.licenseePostCode" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-show='caseDetailFoemData.transferorNationality!="中国"'>

                          </el-row>

                          <el-row  class="fullRow" v-if="(['不予注册复审','商标注册','分割申请','异议','变名变址','转让/移转','续展','删减商品项目','变更注册申请代理机构','更正商标申请事项','注册驳回复审','国际注册驳回复审','撤销商标复审','无效宣告复审','异议答辩','撤三答辩(提供使用证明)','撤销通用名称答辩','参与不予注册复审','无效宣告答辩','撤销复审答辩','撤销三年停止使用申请','撤销成为通用名称注册商标','无效宣告申请','撤回商标评审','行政复议','许可备案','补发商标注册证','补发商标变转续证明','出具优先权证明文件','出具商标注册证明','商标注销','撤回商标申请'].includes(ch_caseTypr))">
                            <el-col :span="24">
                              <el-form-item v-if="caseDetailFoemData.replaceAgencyName && caseDetailFoemData.replaceAgencyName !== '北京佰舟知识产权代理有限公司' && ['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(caseDetailFoemData.whdAgencyName) && ['内-内', '外-内'].includes(caseDetailFoemData.appFromto)" label="代理人姓名:" class="postInfo-container-item">
                                <el-select default-first-option  :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.agentPerson" filterable>
                                  <el-option v-for="(item,key)  in agentPersonList" :key="key" :label="item" :value="item">
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
                              <el-form-item v-else label="代理人姓名:" class="postInfo-container-item">
                                <el-select allow-create default-first-option  :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.agentPerson" filterable>
                                  <el-option v-for="(item,key)  in $store.getters.userList" :key="key" :label="item.fullname" :value="item.fullname">
                                    <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row class="fullRow">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="委托书:">
                                <template>

                                  <el-button style="margin-left:10px;display: block" size="mini" type="primary" @click="getfileData('1022',$event)">上传</el-button>
                                  <el-upload class="upload-btn" :before-remove="brforeRemoveFile" :on-success='fileUploadSuccess' :file-list="wtsfileListzr" :show-file-list='true' :action="fileUrl" name='attachFile' :data="fileData('1022')">
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
                          <el-row v-if="caseDetailFoemData.transferorNationality == '中国'&&caseDetailFoemData.transferorType == '自然人'">
                            <el-col :span=12>
                              <el-form-item class="postInfo-container-item" label="主体资格证明文件类型:">
                                <el-select
                                  :clearable="true"
                                  default-first-option
                                  filterable
                                  placeholder="请选择"
                                  v-model="caseDetailFoemData.transferorSubjectCertType"
                                >
                                  <el-option v-for="( item ) in certTypeOptions" :key="item.id" :label="item.typeName" :value="item.typeName"/>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span=12>
                              <el-form-item class="postInfo-container-item" label="统一社会信用代码:">
                                <el-input v-model="caseDetailFoemData.zrCertCode"/>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="转让人上传文件的语言类型:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.transferorUploadFileLanguage">
                                    <el-radio label="中文" />
                                    <el-radio label="外文" />
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="caseDetailFoemData.changeType==='转让'">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="转/受让人同意撤回的声明文件:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1071]" />

                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1071',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12" v-if="transferorSubjectFile">
                              <el-form-item class="postInfo-container-item" label="转让人主体资格证明（中文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[ch_caseTypr === '许可备案' ? 301562 : 1026]" />

                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData(ch_caseTypr === '许可备案' ? 301562 : 1026,$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.transferorUploadFileLanguage=='外文'&&transferorSubjectFile">
                              <el-form-item class="postInfo-container-item" label="转让人主体资格证明文件（英文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[ch_caseTypr === '许可备案' ? 301563 : 1027]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData(ch_caseTypr === '许可备案' ? 301563 : 1027,$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12" v-if="caseDetailFoemData.transferorType=='自然人'">
                              <el-form-item class="postInfo-container-item" label="转让人身份证明文件(中文):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[ch_caseTypr === '许可备案' ? 301564 : 1024]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData(ch_caseTypr === '许可备案' ? 301564 : 1024,$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.transferorUploadFileLanguage=='外文'&&caseDetailFoemData.transferorType=='自然人'">
                              <el-form-item class="postInfo-container-item" label="转让人身份证明原文件(外文):">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[ch_caseTypr === '许可备案' ? 301565 : 1025]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData(ch_caseTypr === '许可备案' ? 301565 : 1025,$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>

                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>

                  <el-row v-if="ch_caseTypr === '商标查询'&&!iscases">
                    <el-col :span="24" class="tilteSpan">
                      <span id="xxjgxx-title">查询结果</span>
                    </el-col>
                  </el-row>
                  <el-row v-if="ch_caseTypr === '商标查询'&&!iscases">
                    <el-col :span="24" class="form-con-item">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="录入信息:">
                                <template>
                                  <el-input :rows="5" placeholder="请输入商标号,以回车分隔" type="textarea" v-model="caseDetailFoemData.searchResultList" />
                                  <el-button style="margin-left:0px" size="mini" type="primary" @click="searchTm">生成商标列表</el-button>
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="dialogVisibledctm=true">导出英文模板</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-table :data="caseDetailFoemData.tmList" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
                                <el-table-column align="left" label="序号" type="index" width="50" />
                                <el-table-column align="left" label="商标图样" width>
                                  <template slot-scope="scope">
                                    <img style="width:100px;height:100px" :src="'tmFile'+scope.row.imgFilePath" alt="">
                                  </template>
                                </el-table-column>
                                <el-table-column align="left" label="商标注册号" width>
                                  <template slot-scope="scope">
                                    <span>{{ scope.row.regNumber }}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column align="left" label="商标名称" width>
                                  <template slot-scope="scope">
                                    <span>{{ scope.row.tmName }}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column align="left" label="申请人" width>
                                  <template slot-scope="scope">
                                    <span>{{ scope.row.applicantName }}</span>
                                  </template>
                                </el-table-column>
                                <el-table-column align="left" label="类别" width>
                                  <template slot-scope="scope">
                                    <span>{{ scope.row.tmType }}</span>
                                  </template>
                                </el-table-column>

                              </el-table>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row v-if="ch_caseTypr != '商标查询'">
                    <el-col :span="24" class="tilteSpan">
                      <span id="gyrxx-title">共有人信息</span>
                    </el-col>
                  </el-row>
                  <el-row v-if="ch_caseTypr != '商标查询'">
                    <el-col :span="24" class="form-con-item">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="共同申请:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.ifShareTm" @change="changeIfShareTm">
                                    <el-radio label="0">否</el-radio>
                                    <el-radio label="1">是</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>


                          </el-row>
                          <el-row class="fullRow"  v-if="ch_caseTypr=='转让/移转'&&caseDetailFoemData.ifShareTm=='1'">

                          <el-col :span="24"  >
                            <el-form-item class="postInfo-container-item" label="共有人知情转让移转证明:">
                              <el-input :disabled="true" v-model="fileName[1031]" />
                              <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1031',$event)">上传</el-button>
                            </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ch_caseTypr=='撤回商标申请'&&caseDetailFoemData.ifShareTm=='1'">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="商标申请知情书:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[1072]" />

                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1072',$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>

                  <el-row v-if="caseDetailFoemData.ifShareTm=='1'">
                    <el-col :span="24" class="form-con-item">
                      <el-row>
                        <el-col :span="24" style="text-align:right">

                          <el-button @click="dialogFormjoin=1" size="mini" style="margin-left:10px" type="primary">
                            添加
                          </el-button>
                        </el-col>
                      </el-row>
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-table :data="caseDetailFoemData.joinApps" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
                            <el-table-column align="left" label="序号" type="index" width="50" />
                            <el-table-column align="left" label="类型" v-if="ch_caseTypr === '转让/移转'" width>
                              <template slot-scope="scope">
                                <span>{{ scope.row.typeStr }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column align="left" label="共有人中文名称" width>
                              <template slot-scope="scope">
                                <span v-if="!scope.row.modifyState">{{ scope.row.nameCn }}</span>
                                <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.nameCn"></el-input>
                              </template>
                            </el-table-column>
                            <el-table-column align="left" label="共有人英文名称" width>
                              <template slot-scope="scope">
                                <span v-if="!scope.row.modifyState">{{ scope.row.nameEn }}</span>
                                <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.nameEn"></el-input>
                              </template>
                            </el-table-column>
                            <el-table-column align="left" label="共有人中文地址" width>
                              <template slot-scope="scope">
                                <span v-if="!scope.row.modifyState">{{ scope.row.addrCn }}</span>
                                <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.addrCn"></el-input>
                              </template>
                            </el-table-column>
                            <el-table-column align="left" label="共有人英文地址" width>
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
                            <el-table-column align="left" label="共有人证件名称" width>
                              <template slot-scope="scope">
                                <span v-if="!scope.row.modifyState">{{ scope.row.cardName }}</span>
                                <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.cardName"></el-input>
                              </template>
                            </el-table-column>
                            <el-table-column align="left" label="证件号" width>
                              <template slot-scope="scope">
                                <span v-if="!scope.row.modifyState">{{ scope.row.cardId }}</span>
                                <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.cardId"></el-input>
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
                                <el-button @click="changeAppJoinState(scope.row,scope.$index)" type="text" size="mini">{{scope.row.modifyState?'保存':'修改'}}</el-button>
                                <el-button @click="deljoinp(scope.row,scope.$index)" type="text" size="mini">删除</el-button>
                              </template>
                            </el-table-column>

                          </el-table>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row v-if="ch_caseTypr === '许可备案'||caseDetailFoemData.changeType==='许可' || ch_caseTypr === '许可备案提前终止'">
                    <el-col :span="24" class="tilteSpan">
                      <span id="bxkrxx-title">被许可人信息</span>
                    </el-col>
                  </el-row>
                  <el-row v-if="ch_caseTypr === '许可备案'||caseDetailFoemData.changeType==='许可' || ch_caseTypr === '许可备案提前终止'">
                    <el-col :span="24" class="form-con-item">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="被许可人名称（中文）:" prop="transferorCnName">
                                <template>
                                  <el-autocomplete  @select="handleTransferorCnName" class="inline-input" :clearable='true' v-model="caseDetailFoemData.transferorCnName" :fetch-suggestions="remotepinput" placeholder="请输入内容" :trigger-on-focus="true">
                                  </el-autocomplete>
<!--                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.transferorCnName">-->
<!--                                    <el-option :key="key" :label="item.applicantName" :value="item.applicantName" v-for="(item,key) in selectData.apps" />-->
<!--                                  </el-select>-->
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="被许可人统一社会信用代码:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.zrCertCode" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="被许可人名称（英文）:">
                                  <el-input v-model="caseDetailFoemData.transferorEnName" />
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="ch_caseTypr != '许可备案提前终止'">
                              <el-form-item class="postInfo-container-item" label="被许可人邮政编码:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.licenseePostCode" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="被许可人中文地址:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.transferorCnAdress" />
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="被许可人国籍:">
                                <template>
                                  <el-select :clearable="true" @change="trancaseCochange" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.transferorNationality">
                                    <el-option :key="key" :label="item.countryCn" :value="item.countryCn" v-for="(item,key) in selectData.country" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="caseDetailFoemData.transferorNationality=='中国'">
                            <el-col :span="24" class="long-input">
<!--                              省、市、区-->
                              <el-form-item label="被许可人地址省市区" class="postInfo-container-item">
                                <template>
                                    <el-select
                                      v-model="transferorAddress.province"
                                      placeholder="请选择省"
                                      style="width: 120px; margin-right: 10px"
                                      @change="handleTfProvinceChange"
                                      filterable
                                      clearable
                                    >
                                      <el-option
                                        v-for="item in tfProvinceList"
                                        :key="item.regionCode"
                                        :label="item.abbrName"
                                        :value="item.regionCode"
                                      />
                                    </el-select>
                                    <el-select
                                      v-model="transferorAddress.city"
                                      placeholder="请选择市"
                                      style="width: 120px; margin-right: 10px"
                                      @change="handleTfCityChange"
                                      filterable
                                      clearable
                                      :disabled="!transferorAddress.province"
                                    >
                                      <el-option
                                        v-for="item in tfCityList"
                                        :key="item.regionCode"
                                        :label="item.abbrName"
                                        :value="item.regionCode"
                                      />
                                    </el-select>
                                    <el-select
                                      v-model="transferorAddress.district"
                                      placeholder="请选择区"
                                      style="width: 120px"
                                      filterable
                                      clearable
                                      :disabled="!transferorAddress.city"
                                    >
                                      <el-option
                                        v-for="item in tfDistrictList"
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
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="被许可人英文地址:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.transferorEnAdress" />
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="被许可人国家或地区:">
                                <template>
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.transferorCountryAndregion">
                                    <el-option :key="key" :label="item.countryCn" :value="item.countryCn" v-for="(item,key) in selectData.casecount" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row v-if="ch_caseTypr != '许可备案提前终止'" class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="被许可人类型:">
                                <template>
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.transferorType">
                                    <el-option :key="key" :label="item.typeName" :value="item.typeName" v-for="(item,key) in selectData.apptypelist" />
                                  </el-select>

                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="ch_caseTypr != '许可备案提前终止'">
                              <el-form-item class="postInfo-container-item" label="被许可人上传文件的语言类型:">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.transferorUploadFileLanguage">
                                    <el-radio label="中文" />
                                    <el-radio label="外文" />
                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>

                          </el-row>
                          <el-row class="" v-if="ch_caseTypr != '许可备案提前终止'">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="被许可人身份证明文件名称:" prop="transferorCertificateName">
                                <template v-if="caseDetailFoemData.transferorType!=='自然人'&&caseDetailFoemData.transferorNationality!=='中国'">
                                  <el-input placeholder="" v-model="caseDetailFoemData.transferorCertificateName" />
                                </template>
                                <template v-else>
                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.transferorCertificateName">
                                    <el-option v-for="(item,index) in transferorIdTypeOptions" :key="index" :label="item.typeName" :value="item.typeName" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                            <!-- <el-col :span="12" v-if="caseDetailFoemData.transferorType=='自然人'">
                              <el-form-item class="postInfo-container-item" label="被许可人身份证明文件号码:">
                                <template>
                                  <el-input placeholder="" v-model="caseDetailFoemData.transferorCertificateNumber" />

                                </template>
                              </el-form-item>
                            </el-col> -->
                            <el-col :span="12" v-if="caseDetailFoemData.transferorNationality == '中国'&&caseDetailFoemData.transferorType!='自然人'">
                              <el-form-item prop="zrCertCode" class="postInfo-container-item" label="被许可人统一社会信用代码:">
                                <template>
                                  <el-input v-model="caseDetailFoemData.zrCertCode"/>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-else>
                              <el-form-item
                                class="postInfo-container-item"
                                label="被许可人身份证明文件号码:"
                                :prop="caseDetailFoemData.transferorType!=='自然人'&&caseDetailFoemData.transferorNationality!=='中国'?'':'transferorCertificateNumber'"
                              >
                                <el-input v-model="caseDetailFoemData.transferorCertificateNumber" />
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row v-if="caseDetailFoemData.transferorNationality == '中国'&&caseDetailFoemData.transferorType == '自然人'">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="被许可人主体资格类型:">
                                <el-select
                                  :clearable="true"
                                  default-first-option
                                  filterable
                                  placeholder="请选择"
                                  v-model="caseDetailFoemData.transferorSubjectCertType"
                                >
                                  <el-option v-for="( item ) in certTypeOptions" :key="item.id" :label="item.typeName" :value="item.typeName"/>
                                </el-select>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row class="" v-if="ch_caseTypr != '许可备案提前终止'">
                            <el-col :span="12" v-if="caseDetailFoemData.transferorType!='自然人'||(caseDetailFoemData.transferorType=='自然人'&&caseDetailFoemData.transferorUploadFileLanguage=='中文')">
                              <el-form-item class="postInfo-container-item" label="被许可人主体资格证明（中文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[ch_caseTypr === '许可备案' ? 301562 : 1026]" />

                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData(ch_caseTypr === '许可备案' ? 301562 : 1026,$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.transferorUploadFileLanguage=='外文'&&caseDetailFoemData.transferorType!='自然人'">
                              <el-form-item class="postInfo-container-item" label="被许可人主体资格证明文件（英文）:">
                                <template>
                                  <el-input :disabled="true" v-model="fileName[ch_caseTypr === '许可备案' ? 301563 : 1027]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData(ch_caseTypr === '许可备案' ? 301563 : 1027,$event)">上传</el-button>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="" v-if="ch_caseTypr != '许可备案提前终止'">
                            <el-col :span="12" v-if="caseDetailFoemData.transferorType=='自然人'">
                                <el-form-item class="postInfo-container-item" label="被许可人身份证明原文件(中文):">
                                <el-input :disabled="true" v-model="fileName[ch_caseTypr === '许可备案' ? 301564 : 1024]" />
                                <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData(ch_caseTypr === '许可备案' ? 301564 : 1024,$event)">上传</el-button>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="caseDetailFoemData.transferorUploadFileLanguage=='外文'&&caseDetailFoemData.transferorType=='自然人'">
                              <el-form-item class="postInfo-container-item" label="被许可人身份证明原文件(外文):">
                                  <el-input :disabled="true" v-model="fileName[ch_caseTypr === '许可备案' ? 301565 : 1025]" />
                                  <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData(ch_caseTypr === '许可备案' ? 301565 : 1025,$event)">上传</el-button>
                              </el-form-item>
                            </el-col>


                          </el-row>

                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row v-if="showType|| this.ch_caseTypr === '不予注册复审'||this.ch_caseTypr === '撤销商标复审'||this.ch_caseTypr === '撤销复审答辩'||this.ch_caseTypr === '撤三答辩（提供使用证明）'||this.ch_caseTypr === '撤销通用名称答辩'||this.ch_caseTypr === '撤销三年停止使用申请'||this.ch_caseTypr === '参加不予注册复审'">
                    <el-col :span="24" class="tilteSpan">
                      <span id="byyrxx-title">{{ yyTextShowxk.title }}</span>
                    </el-col>
                  </el-row>
                  <el-row v-if="showType|| this.ch_caseTypr === '不予注册复审'||this.ch_caseTypr === '撤销商标复审'||this.ch_caseTypr === '撤销复审答辩'||this.ch_caseTypr === '撤三答辩（提供使用证明）'||this.ch_caseTypr === '撤销通用名称答辩'||this.ch_caseTypr === '撤销三年停止使用申请'||this.ch_caseTypr === '参加不予注册复审'">
                    <el-col :span="24" class="form-con-item">
                      <el-row class="form-border">
                        <el-col :span="24">
                          <template v-if="ch_caseTypr === '异议答辩'">
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item label="异议人列表" class="postInfo-container-item" :class="{'require': ch_caseTypr === '异议答辩'}" >
                                  <y-zgrid type="edit" :tableTitleList="yyTitleList" :tableData="caseDetailFoemData.opponents" :tmCaseId="caseDetailFoemData.tmCaseId" @delYzData="delYyData" @addYzData="addYyData"/>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>
                          <template v-else>
                            <el-row class="">
                              <el-col :span="12">
                                <el-form-item :label="yyTextShowxk.cnname" class="postInfo-container-item" :prop="showType|| this.ch_caseTypr === '不予注册复审'||this.ch_caseTypr === '撤销商标复审'||this.ch_caseTypr === '无效宣告复审'||this.ch_caseTypr === '撤三答辩（提供使用证明）'||this.ch_caseTypr === '撤销三年停止使用申请'?'respondentNameCn':''">
                                  <template>

                                    <el-select :clearable="true" :remote-method="remotepaternalUnit" @change="lytranappselectChange" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword
                                               v-model="caseDetailFoemData.respondentNameCn">
                                      <el-option :key="key" :label="item.fullname" :value="item.fullname" v-for="(item,key) in selectData.liyiarr" />
                                    </el-select>

                                  </template>
                                </el-form-item>
                              </el-col>

                            </el-row>
                            <el-row class="fullRow">
                              <el-col :span="24">
                                <el-form-item :label="yyTextShowxk.enname" class="postInfo-container-item">
                                  <template>
                                    <el-input v-model="caseDetailFoemData.respondentNameEn" />
                                  </template>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </template>

                          <el-row class="" v-if="yyTextShowxk.cnaddr">
                            <el-col :span="12">
                              <el-form-item :label="yyTextShowxk.cnaddr" class="postInfo-container-item">
                                <template>
                                  <el-input v-model="caseDetailFoemData.respondentAddrCn" />
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" >
                              <el-form-item :label="yyTextShowxk.enaddr" class="postInfo-container-item">
                                <template>
                                  <el-input v-model="caseDetailFoemData.respondentAddrEn" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow" v-if="yyTextShowxk.cnaddr">
                            <el-col :span="24">
                              <el-form-item :label="yyTextShowxk.dlzz" class="postInfo-container-item">
                                <template>
                                  <el-input v-model="caseDetailFoemData.respondentAgency" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row v-if="caseDetailFoemData.appFromto=='内-外'||caseDetailFoemData.appFromto=='外-外'">
                    <el-col :span="24" class="tilteSpan">
                      <span id="out-title">境外信息</span>
                    </el-col>
                  </el-row>
                  <el-row v-if="caseDetailFoemData.appFromto=='内-外'||caseDetailFoemData.appFromto=='外-外'">
                    <el-col :span="24" class="form-con-item">

                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="注册方式:" prop="madrid" @change="changeElstepList">
                                <template>
                                  <el-radio-group v-model="caseDetailFoemData.madrid">
                                    <el-radio :label="false">逐一注册</el-radio>
                                    <el-radio :label="true">马德里注册</el-radio>

                                  </el-radio-group>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="注册国家:" prop="appState">
                                <template>

                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.appState">
                                    <el-option :key="key" :label="item.countryCn" :value="item.countryCn" v-for="(item,key) in selectData.country" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="外方代理所:" :prop="caseDetailFoemData.madrid===false?'agencyCustId':''">
                                <template>
                                  <virtual-select placeholder="请选择" class="virtual-select"  clearable :data="selectData.hzLists" @change="wfAgentChange" v-model="caseDetailFoemData.agencyCustId"   filterable  >
                                  </virtual-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="外方代理所联系人:">
                                <template>

                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.agencyCustContactId">
                                    <el-option :key="key" :label="item.name" :value="item.custContactId" v-for="(item,key) in selectData.customerContactswf" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="外方代理所文号:">
                                <template>
                                  <el-input placeholder="" v-model="caseDetailFoemData.agencyCustRefno" />

                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="外方代理所地址:">
                                <template>

                                  <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="caseDetailFoemData.agencyCustAddrId">
                                    <el-option :key="key" :label="item.addressEn || item.addressCn" :value="item.addrId" v-for="(item,key) in selectData.customerAddrs" />
                                  </el-select>
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row class="fullRow">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item" label="外方代理所要求:">
                                <template>

                                  <el-input placeholder="" rows="3" type="textarea" v-model="caseDetailFoemData.agencyCustReq" />
                                </template>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row v-show="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.appState == '美国'">
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
                              <el-form-item class="postInfo-container-item" label="时限内容:">
                                <template>
                                  <el-input placeholder="" v-model="caseDetailFoemData.timeLimitContent" />
                                </template>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item class="postInfo-container-item" label="时限日期:">
                                <template>
                                  <el-date-picker :picker-options="pickerOptions" align="right" format="yyyy-MM-dd" placeholder="选择日期" type="date" v-model="caseDetailFoemData.limitDate" value-format="yyyy-MM-dd" />

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

                  <el-row v-if="(caseDetailFoemData.appFromto=='内-外'||caseDetailFoemData.appFromto=='外-外')&&caseDetailFoemData.madrid==true&&caseDetailFoemData.caseType !== '出具优先权证明文件'">
                    <el-col :span="24" class="tilteSpan">
                      <span id="base-title">基础注册信息</span>
                    </el-col>
                  </el-row>
                  <el-row v-if="(caseDetailFoemData.appFromto=='内-外'||caseDetailFoemData.appFromto=='外-外')&&caseDetailFoemData.madrid==true&&caseDetailFoemData.caseType !== '出具优先权证明文件'">
                    <el-col :span="24" class="form-con-item">
                      <el-row>
                        <el-col :span="24" style="text-align:right">

                          <el-button @click="addMDL" size="mini" style="margin-left:10px" type="primary">
                            添加
                          </el-button>
                        </el-col>
                      </el-row>
                      <el-row class="form-border">
                        <el-col :span="24">
                          <el-table :data="caseDetailFoemData.trademarkCaseBasicinfos" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
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
                                <el-button @click="delMDL(scope.$index)" size="mini" type="text">删除
                                </el-button>
                              </template>
                            </el-table-column>

                          </el-table>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <template v-if="caseDetailFoemData.custName && caseDetailFoemData.custName.includes('阿里')">
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
          <el-tab-pane label="特殊指示" name="second">
            <div v-if="activeName==='second'">
              <el-row>
                <el-col :span="24" class="tilteSpan">
                  <span id="tszs-custzs">特殊指示-案件指示</span>
                </el-col>
              </el-row>
              <el-row>
<!--                <el-col :span="24" class="form-con-item">-->
<!--                  <el-row class="form-border">-->
<!--                    <el-col :span="24">-->
<!--                      <el-table :data="custReqCases" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">-->
<!--                        <el-table-column align="left" label="序号" type="index" width="50" />-->
<!--                        <el-table-column align="left" label="客户" width='150'>-->
<!--                          <template slot-scope="scope">-->
<!--                            <span>{{ scope.row.fullname }}</span>-->
<!--                          </template>-->
<!--                        </el-table-column>-->
<!--                        <el-table-column align="left" label="申请人" width='150'>-->
<!--                          <template slot-scope="scope">-->
<!--                            <span>{{ scope.row.applicantName }}</span>-->
<!--                          </template>-->
<!--                        </el-table-column>-->
<!--                        <el-table-column align="left" label="案件特殊指示" width>-->
<!--                          <template slot-scope="scope">-->
<!--                            <span>{{ scope.row.specialInfo }}</span>-->
<!--                          </template>-->
<!--                        </el-table-column>-->

<!--                      </el-table>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                </el-col>-->
                <SpecialInstructions label="案件特殊指示" type="view" :data="{custFullNameString:caseDetailFoemData.custName,customerRequirementBillList:custReqCases}"></SpecialInstructions>

              </el-row>
              <el-row>
                <el-col :span="24" class="tilteSpan">
                  <span id="tszs-billzs">特殊指示-账单指示</span>
                </el-col>
              </el-row>
              <el-row>
                <SpecialInstructions type="view" :data="{custFullNameString:caseDetailFoemData.custName,customerRequirementBillList:custReqBills}"></SpecialInstructions>

                <!--                <el-col :span="24" class="form-con-item">-->
<!--                  <el-row class="form-border">-->
<!--                    <el-col :span="24">-->
<!--                      <el-table :data="custReqBills" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">-->
<!--                        <el-table-column align="left" label="序号" type="index" width="50" />-->
<!--                        <el-table-column align="left" label="客户" width='150'>-->
<!--                          <template slot-scope="scope">-->
<!--                            <span>{{ scope.row.fullname }}</span>-->
<!--                          </template>-->
<!--                        </el-table-column>-->
<!--                        <el-table-column align="left" label="申请人" width='150'>-->
<!--                          <template slot-scope="scope">-->
<!--                            <span>{{ scope.row.applicantName }}</span>-->
<!--                          </template>-->
<!--                        </el-table-column>-->
<!--                        <el-table-column align="left" label="案件特殊指示" width>-->
<!--                          <template slot-scope="scope">-->
<!--                            <span>{{ scope.row.specialInfo }}</span>-->
<!--                          </template>-->
<!--                        </el-table-column>-->

<!--                      </el-table>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                </el-col>-->
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
                <el-col :span="24" class="tilteSpan">
                  <span id="tszs-require">客户个案要求</span>
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
                              <el-input :rows="3" placeholder="请输入" type="textarea" v-model="caseDetailFoemData.instructions" />

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
            <CaseInvestigators :prePage="prePage" :caseDetailData='caseDetailFoemData' :isEdit="true" @workGroup="workGroup" @caseRoleSelectList="(v)=>{caseRoleSelectList = v}" v-if="activeName==='third'"></CaseInvestigators>
          </el-tab-pane>
          <el-tab-pane label="账单费用" name="fourth">
            <caseBill :billData='caseDetailFoemData' v-if="activeName==='fourth'"></caseBill>
          </el-tab-pane>
          <el-tab-pane label="案件进展" name="Fifth">
            <ElectronicArchives :searchFanweiList="caseDetailFoemData.searchFanweiList" v-if="caseDetailFoemData.caseId && activeName==='Fifth'" :caseTypeId="caseDetailFoemData.caseTypeId" :caseEvolve="caseDetailFoemData.caseEvolve" :isEdit="true" :agentNum="caseDetailFoemData.agentNum" :caseIds="mainCaseIds" :curCaseId="caseDetailFoemData.caseId" :custId="caseDetailFoemData.custId"></ElectronicArchives>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="4" v-if="activeName=='first' || activeName=='second'">
        <div style="height: 520px;position: fixed;top:20%;right:5%">
          <el-steps :active="stepActive1" :space="200" direction="vertical">
            <el-step :title="item.title" @click.native="getTopPosition(item.id,index)" v-for="(item,index) in elstepList" :key="index" v-if="item.state" />
          </el-steps>
        </div>
      </el-col>

    </el-row>
    <el-dialog :close-on-click-modal="false" :show-close="false" :visible.sync="formatDialogFormjoin" title="共同申请人" width="50%">
      <el-form :model="joinFormData" label-width="180px" label-position="left" ref="" size="mini" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow" v-if="ch_caseTypr === '转让/移转'">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" label="类型:">
                  <template>
                    <el-radio-group @change="jointypeChange" v-model="joinFormData.type">
                      <el-radio :label="2">转让人共有人</el-radio>
                      <el-radio :label="3">受让人共有人</el-radio>
                    </el-radio-group>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="12">
                <el-form-item class="postInfo-container-item" label="共有人类型:">
                  <template>
                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="joinFormData.joinAppType">
                      <el-option :key="key" :label="item.typeName" :value="item.typeName" v-for="(item,key) in selectData.apptypelist" />
                    </el-select>

                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="postInfo-container-item" label="共有人国籍:">
                  <template>
                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="joinFormData.joinAppCoun">
                      <el-option label="中国大陆" value="中国大陆" />
                      <el-option label="国外" value="国外" />
                      <el-option label="中国台湾" value="中国台湾" />
                      <el-option label="中国香港" value="中国香港" />
                      <el-option label="中国澳门" value="中国澳门" />
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" label="共有人中文名称:">
                  <el-autocomplete class="inline-input" :clearable='true' @select="handleSelect" v-model="joinFormData.nameCn" :fetch-suggestions="remoteMethodApp" placeholder="请输入内容"  :trigger-on-focus="true">
                  </el-autocomplete>
<!--                  <template>-->
<!--                    <el-input placeholder="" v-model="joinFormData.nameCn" />-->

<!--                  </template>-->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" v-if="joinFormData.joinAppCoun=='国外'">
                <el-form-item class="postInfo-container-item" label="共有人英文名称:">
                  <template>
                    <el-input placeholder="" v-model="joinFormData.nameEn" />

                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" label="共有人中文地址:">
                  <template>
                    <el-input placeholder="" v-model="joinFormData.addrCn" />

                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" v-if="joinFormData.joinAppCoun=='国外'">
                <el-form-item class="postInfo-container-item" label="共有人英文地址:">
                  <template>
                    <el-input placeholder="" v-model="joinFormData.addrEn" />

                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="" v-if="joinFormData.joinAppType=='自然人'">
              <el-col :span="12" >
                <el-form-item class="postInfo-container-item" label="证件名称:">
                  <template>
                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="joinFormData.cardName">
                      <el-option label="身份证" value="身份证" />
                      <el-option label="护照" value="护照" />
                      <el-option label="其他" value="其他" />
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12" >
                <el-form-item class="postInfo-container-item" label="证件号:">
                  <template>
                    <el-input placeholder="" v-model="joinFormData.cardId" />

                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow" >
              <el-col :span="24">
<!--                <el-form-item class="postInfo-container-item" label="证明文件是否为中文:" >-->
<!--                  <template>-->
<!--                    <el-radio-group v-model="joinFormData.getFileIsEn">-->
<!--                      <el-radio label="否">否</el-radio>-->
<!--                      <el-radio label="是">是</el-radio>-->
<!--                    </el-radio-group>-->
<!--                  </template>-->
<!--                </el-form-item>-->
                <el-form-item class="postInfo-container-item" label="上传文件的语言类型:">
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
                <el-form-item class="postInfo-container-item" label="身份证明文件:">
                  <template>
                    <el-input v-model="joinFormData.materialArray && joinFormData.materialArray.find(item => item.materialTypeId == 1037) && joinFormData.materialArray.find(item => item.materialTypeId == 1037).materialName" disabled />
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1037',$event)">上传</el-button>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="joinFormData.joinAppType=='自然人'&&joinFormData.getFileIsEn=='否'">
                <el-form-item class="postInfo-container-item" label="身份证明文件(外文):">
                  <template>
                    <el-input v-model="joinFormData.materialArray && joinFormData.materialArray.find(item => item.materialTypeId == 1038) && joinFormData.materialArray.find(item => item.materialTypeId == 1038).materialName" disabled />
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1038',$event)">上传</el-button>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="">
              <el-col :span="12" v-if="joinFormData.joinAppType!='自然人'">
                <el-form-item class="postInfo-container-item" label="主体资格证明文件:">
                  <template>
                    <el-input v-model="joinFormData.materialArray && joinFormData.materialArray.find(item => item.materialTypeId == 1039) && joinFormData.materialArray.find(item => item.materialTypeId == 1039).materialName" disabled />
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1039',$event)">上传</el-button>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="joinFormData.joinAppType!='自然人'&&joinFormData.getFileIsEn=='否'">
                <el-form-item class="postInfo-container-item" label="主体资格证明文件(外文):">
                  <template>
                    <el-input v-model="joinFormData.materialArray && joinFormData.materialArray.find(item => item.materialTypeId == 1040) && joinFormData.materialArray.find(item => item.materialTypeId == 1040).materialName" disabled />
                    <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1040',$event)">上传</el-button>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

          </el-col>
        </el-row>

      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="deljoinBtn">
          取消
        </el-button>
        <el-button @click="addjionP" type="primary">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormTmCm" @open="cmDialogShow" title="重名检查" width="70%">

      <el-row class="tmCmsearch">

        <el-col :span="12" style="float:right;margin-bottom:10px">
          <el-input class="input-with-select" placeholder="请输入内容" v-model="selectTmSearchInput">

            <el-button @click="getCmtmdata('seach')" icon="el-icon-search" slot="append" />
          </el-input>
        </el-col>
        <el-col :span="24" style="padding-left:40px;margin-bottom:10px">
          <el-checkbox :indeterminate="isIndeterminategoodClass" @change="handleCheckAllgoodClassChange" v-model="checkAllgoodClass">全选
          </el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group @change="handleCheckedgoodClassChange" v-model="checkedgoodClass">
            <el-checkbox :key="goodclass" :label="goodclass" v-for="goodclass in allgoodClass">
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
          <pagination :limit.sync="sameSenddata.pageSize" :page.sync="sameSenddata.pageNo" :total="sameTmdatatotal" @pagination="getCmtmdata" v-show="sameTmdatatotal>0" />
        </el-col>
      </el-row>

      <div class="dialog-footer" slot="footer">

        <el-button @click="dialogFormTmCm=false" type="primary">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-row style="padding-bottom:50px">
      <el-col :span="24" style="text-align:center">
        <el-button v-if="!caseDetailFoemData.ctAudit || [2, 3, 4].includes(caseDetailFoemData.ctAudit)" @click="submitCaseForm(undefined,$route.query.flag == 'noCheck' ? 0 : 1, 0)" size="medium" style="margin-right:10px" type="primary">
            保存
          </el-button>
        <template v-if="caseDetailFoemData.ctAudit === 1">
          <el-button size="medium" style="margin-right:10px" type="primary" @click="chongtuTestFunc(1)">
            检查冲突
          </el-button>
          <el-button size="medium" style="margin-right:10px" type="primary" @click="alertChongtuAuditFunc(1)">
            通 过
          </el-button>
          <el-button size="medium" style="margin-right:10px" type="primary" @click="alertChongtuAuditFunc(2)">
            退 回
          </el-button>
        </template>
        <template v-if="caseDetailFoemData.ctAudit === 2">
          <el-button size="medium" style="margin-right:10px" type="primary" @click="dialogcheckChongTuBtn">
            提 交
          </el-button>
        </template>
        <template v-if="caseDetailFoemData.ctAudit === 4 || !caseDetailFoemData.ctAudit">
          <el-button size="medium" v-if="$route.query.pageId&&curCustLevel&&!(caseDetailFoemData.agentNum&&caseDetailFoemData.agentNum.includes('TM'))&&(!caseDetailFoemData.ctAudit ||caseDetailFoemData.ctAudit === 4)" style="margin-right:10px" type="primary" @click="creatCaseForm(1)">立卷
          </el-button>
          <el-dropdown trigger="click" placement="top" @command="filingOperation" v-if="$route.query.pageId&&!curCustLevel&&!(caseDetailFoemData.agentNum&&caseDetailFoemData.agentNum.includes('TM'))&&(!caseDetailFoemData.ctAudit ||caseDetailFoemData.ctAudit === 4)" style="margin-right:10px">
            <el-button type="primary" :disabled="filingOperationState">
              立卷<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="prefiling">预立卷审批</el-dropdown-item>
              <el-dropdown-item command="createBills">创建账单</el-dropdown-item>
              <el-dropdown-item command="lowCreditAudit">低信用审核</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <el-button @click="goNext()" size="medium" type="primary">取消</el-button>
      </el-col>
    </el-row>
    <DataUploadOrSelect :caseDetailFoemData="caseDetailFoemData" :dialogVisible="DataUploadOrSelectState" :materialArray="materialArray" :caseType="caseDetailFoemData.caseType || ''" :onlyJpg="onlyJpg" :oneFile="oneFile" :fileName="fileName" :fileData="fileData1" :title="curUploadTitle" :wtsfileList="$commonUtils.unique(multipleFileList, 'materialId')" @getResponseAndFile="getResponseAndFile" @closedialogVisible="()=>{this.DataUploadOrSelectState=false;this.oneFile=false}" @deleteCaseMaterial="deleteFile">
    </DataUploadOrSelect>
    <el-dialog
      title="请注意:"
      :visible.sync="dialogcheckChongTuVisible"
      class="chongtuTitle"
      append-to-body
      width="50%"
      top="0"
      center
      :modal="false"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <el-row style="margin: 10px 5px">
        <el-col :span="24">
          <span style="font-size:17px;color: #ff0000">被申请人与下列我方代理过的客户/申请人名称相同/近似，请提交客户管理组刘佳进行冲突检索，审核通过后方可继续立案。</span>
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

          <el-transfer :titles="['所有项','导出项']" style="text-align: left; display: inline-block" v-model="dcvalue" :props="{
      key: 'value',
      label: 'desc'
    }" :data="dcdata">
          </el-transfer>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dcbtn">确 定</el-button>
      </span>
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
<!--    FlView-->
    <el-dialog title="提示" :visible.sync="FlView" width="40%" :before-close="closeFlView">
      <el-row>
        <el-col :span="24" style="text-align: center">
          <el-form label-width="100px" :model="flData">
            <el-row>
              <el-form-item label="法律条款:">
                <el-select style="width: 100%" :clearable="true" default-first-option filterable placeholder="请选择" v-model="flData.law">
                  <el-option :key="key" :label="item.typeName" :value="item.typeName" v-for="(item,key) in lawArray" />
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="事实理由:">
                <div style="display: flex">
                  <el-input type="textarea" placeholder="请填写事实理由(不超过4000字)" maxLength="4000" v-model="flData.reason"></el-input>
                </div>
                <div style="float: right;height: 20px;line-height: 20px;font-size: 12px;color: #606266;">
                  <span style=""><span>{{flData.reason.length}}</span>/4000</span>
                </div>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="证据材料:">
                <div class="fl-ac-jc">
                  <el-input disabled v-model="flData.material&&flData.material.materialName"></el-input>
                  <el-upload
                      ref="uploads"
                      class="upload-demo1"
                      :before-upload="beforeUpload"
                      :on-success="onsuccess"
                      :data="getUploadData()"
                      :action="creatematerial"
                      name="attachFile"
                      :multiple="false"
                      :show-file-list="false"
                  >
                    <el-button size="small" type="primary">上传</el-button>
                  </el-upload>
                </div>
                <div style="float: right;height: 20px;line-height: 20px;font-size: 12px;color: #606266;margin-right: 60px">
                  <span style="color: #F56C6C"><span>本次申请证据材料剩余容量{{200 - (flDataFileSize || 0)}}MB</span></span>
                </div>
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="small" @click="() => closeFlView()">取 消</el-button>
        <el-button size="small" type="primary" @click="submitFl">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import {creatematerial} from '@/api/ipServiceApi.config.js'
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
    queryOtherCustomerListUrl,
    queryReplaceAgencyName,
    chongtuTest,
    tijiao,
    chongtuAudit,
    queryReginList,
    splitAddress
  } from "@/api/caseDetail";
    import { queryCaseAppExamine, searchTmUrl, tmdetailUrl, tmdetailUrl3 } from '@/api/customerList'
    import {queryAlltask, tmdetail, queryCustomerNameId, getCaseTime} from "@/api/caseList";
  import serviceApi from "@/api/serviceApi.config.js";
  import {getUser} from "@/api/user"
  import { mapGetters } from "vuex";
  import { truncate, truncateSync } from "fs";
  import ChangeOfNameAndAddress from "./ChangeOfNameAndAddress";
  import trademarkTable from "./trademarkTable.vue";
  import caseBill from "./CaseBill";
  import Goods from "./Goods";
  import { scrollTo } from "@/utils/scroll-to";
  import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
  import DataUploadOrSelect from "@/components/DataUploadOrSelect";
  import ElectronicArchives from "@/views/workbench/case/components/ElectronicArchives.vue";
  import CaseInvestigators from "@/views/workbench/case/components/CaseInvestigators.vue";
  import { billSubmitUrl,billDiscount } from "@/api/billApi";
  import { createCode } from '@/api/caseList.js'
  import { queryAllUrl } from "@/api/applicant";
  import  SpecialInstructions from '@/views/workbench/finance/billviews/components/SpecialInstructions'
  import  poppingTimeLimit from '@/views/workbench/toDoTasks/poppingTimeLimit.vue'
  import BreadCrumbCase from './BreadCrumbCase'
  import YZgrid from './YZgrid'
  import vm from '../../../../main'
    import { deleteMaterial } from '../../../../api/customerList'
    import {analysisFile, queryAgentPerson} from '../../../../api/caseDetail'
    import {queryWorkGroup} from "../../../../api/systemList";
    import OverseasQuotation from "./OverseasQuotation";
    import {queryCurrencyUrl} from "../../../../api/billApi";
    import CheckGoodsList from "./CheckGoodsList";
    import {queryImageGoodsList} from "../../../../api/caseList";
    import { isInputAll } from '../../../../utils'
    import TagsModal from './TagsModal.vue'
    import { MessageBox } from 'element-ui'
  const defaultdcmr = [
    "filePath",
    "tmName",
    "regNumber",
    "tmType",
    "applicantName",
    "applicantEnName",
    "applicantAddress",
    "applicantEnAddress",
    "appDate",
    "approvalNumber",
    "approvalDate",
    "regnoticeNumber",
    "regNoticeDate",
    "validStartDate",
    "validEndDate",
    "agent",
    "tmGroup",
    "trademarkCategories",
    "classify"
  ];
  const defaultdc = [
    { desc: "商标图样", value: "filePath" },
    { desc: "商标名称", value: "tmName" },
    { desc: "注册号/申请号", value: "regNumber" },
    { desc: "国际分类", value: "tmType" },
    { desc: "申请人名称（中文）", value: "applicantName" },
    { desc: "申请人名称（英文）", value: "applicantEnName" },
    { desc: "申请人地址（中文）", value: "applicantAddress" },
    { desc: "申请人地址（英文）", value: "applicantEnAddress" },
    { desc: "申请日期", value: "appDate" },
    { desc: "递交日期", value: "submitDate"},
    { desc: "初审公告期号", value: "approvalNumber" },
    { desc: "初审公告日期", value: "approvalDate" },
    { desc: "注册公告期号", value: "regnoticeNumber" },
    { desc: "注册公告日期", value: "regNoticeDate" },
    { desc: "专用期开始日期", value: "validStartDate" },
    { desc: "专用期结束日期", value: "validEndDate" },
    { desc: "代理/办理机构", value: "agent" },
    { desc: "类似群", value: "tmGroup" },
    { desc: "商品/服务", value: "trademarkCategories" },
    { desc: "商标类型", value: "classify" },
    { desc: "是否驰名商标", value: "famous" },
    { desc: "是否立体商标", value: "ifSolidTm" },
    { desc: "是否共有申请", value: "ifShareTm" },
    { desc: "优先权日期", value: "priorDate" },
    { desc: "国际注册日期", value: "gjRegDate" },
    { desc: "后期指定日期", value: "hqzdDate" },
    { desc: "共有人中文名称", value: "gtApplicantName" }
  ];
  const fydefaultdc = [
    { desc: "商标图样", value: "filePath" },
    { desc: "商标名称", value: "tmName" },
    { desc: "注册号/申请号", value: "regNumber" },
    { desc: "国际分类", value: "tmType" },
    { desc: "申请人名称（中文）", value: "applicantName" },
    { desc: "申请人名称（英文）", value: "applicantEnName" },
    { desc: "申请人地址（中文）", value: "applicantAddress" },
    { desc: "申请人地址（英文）", value: "applicantEnAddress" },
    { desc: "申请日期", value: "appDate" },
    { desc: "递交日期", value:"submitDate"},
    { desc: "注册日期", value: "regNoticeDate" },
    { desc: "备注", value: "comments" }
  ];
  const fydefaultdcmr = [
    "filePath",
    "tmName",
    "regNumber",
    "tmType",
    "applicantName",
    "applicantEnName",
    "applicantAddress",
    "applicantEnAddress",
    "appDate",
    "regNoticeDate",
    "comments"
  ];
  const appTextShowzr = {
    title: "申请人(受让人)信息",
    cnname: "申请人(受让人)中文名称",
    enname: "申请人(受让人)英文名称",
    type: "申请人(受让人)类型",
    cnaddr: "申请人(受让人)中文地址",
    enaddr: "申请人(受让人)英文地址",
    uploadlang: "受让人上传文件的语言类型"
  };
  const appTextShowxk = {
    title: "申请人(许可人)信息",
    cnname: "申请人(许可人)中文名称",
    enname: "申请人(许可人)英文名称",
    type: "申请人(许可人)类型",
    cnaddr: "申请人(许可人)中文地址",
    enaddr: "申请人(许可人)英文地址",
    uploadlang: "申请人(许可人)上传文件的语言类型"
  };
  const yydbTextShowxk = {
    title: "异议人信息",
    cnname: "异议人中文名称",
    enname: "异议人英文名称",
    // cnaddr: "异议人中文地址",
    // enaddr: "异议人英文地址",
    // dlzz: "异议人代理组织"
  };
  const yyxgTextShowxk = {
    title: "被申请人信息",
    cnname: "被申请人中文名称",
    enname: "被申请人英文名称",
    cnaddr: "被申请人中文地址",
    enaddr: "被申请人英文地址",
    dlzz: "被申请人代理组织"
  };
  const byzcfsTextShowxk = {
    title: "被申请人(不予注册复审申请人)信息",
    cnname: "被申请人(不予注册复审申请人)中文名称",
    enname: "被申请人(不予注册复审申请人)英文名称",
    cnaddr: "被申请人(不予注册复审申请人)中文地址",
    enaddr: "被申请人(不予注册复审申请人)英文地址",
    dlzz: "被申请人(不予注册复审申请人)代理组织"
  };
  const yycsTextShowxk = {
    title: "被申请人(撤销人)信息",
    cnname: "被申请人(撤销人)中文名称",
    enname: "被申请人(撤销人)英文名称",
    // cnaddr: "被申请人(撤销人)中文地址",
    // enaddr: "被申请人(撤销人)英文地址",
    // dlzz: "被申请人(撤销人)代理组织"
  };
  const yycssTextShowxk = {
    title: "被申请人(注册人)信息",
    cnname: "被申请人(注册人)中文名称",
    enname: "被申请人(注册人)英文名称",
    // cnaddr: "被申请人(注册人)中文地址",
    // enaddr: "被申请人(注册人)英文地址",
    // dlzz: "被申请人(注册人)代理组织"
  };
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

  export default {
    name: "Casedetails",
    computed: {
      chongtuAuditViewCom(){
        return !!this.chongtuAuditView
      },
      ...mapGetters(["token", "name", "userId"]),
      formatDialogFormjoin () {
        return !!this.dialogFormjoin;
      },
      caseTypeAndAppFromto(){
        return (['不予注册复审','商标注册','分割申请','异议','变名变址','转让/移转','续展','删减商品项目','变更注册申请代理机构','更正商标申请事项','注册驳回复审','国际注册驳回复审','撤销商标复审','无效宣告复审','异议答辩','撤三答辩(提供使用证明)','撤销通用名称答辩','参与不予注册复审','无效宣告答辩','撤销复审答辩','撤销三年停止使用申请','撤销成为通用名称注册商标','无效宣告申请','撤回商标评审','行政复议','许可备案','补发商标注册证','补发商标变转续证明','出具优先权证明文件','出具商标注册证明','商标注销','撤回商标申请'].includes(this.ch_caseTypr))&&['内-内', '外-内', '台-内'].includes(this.caseDetailFoemData.appFromto)
      },
      supCapacity() {
        const useList = ['326', '327', '300012']
        let useSize = 0 // 已使用
        let capacity = 0 // 剩余容量
        let limitSize = 0 // 总容量
        if (this.caseDetailFoemData.caseType.includes('驳回复审')) {
          limitSize = 50 * 1024 * 1024
        } else if (this.ch_caseTypr === '无效宣告申请') {
          limitSize = 200 * 1024 * 1024
        }
        this.materialArray.forEach(item => {
          if (useList.includes(String(item.materialTypeId))) {
            useSize += item.size
          }
        })
        capacity = limitSize - useSize
        return (capacity / (1024 * 1024)).toFixed(2)
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
      transferorIdTypeOptions(){
        if (this.caseDetailFoemData.transferorType=='自然人') {
          if(this.caseDetailFoemData.transferorNationality=='中国'){
            return [
              {
                typeName: '身份证',
                value: '身份证'
              },
            ]
          }else if(['中国香港','中国澳门','中国台湾'].includes(this.caseDetailFoemData.transferorNationality)){
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
          if(this.caseDetailFoemData.transferorNationality=='中国'){
            return this.organIdTypeList
          }
        }
      },
      isShowSubjectFile(){
        return (this.caseDetailFoemData.legalNature=='自然人' && this.caseDetailFoemData.appGJdq == '中国') || this.caseDetailFoemData.legalNature!='自然人'
      },
      transferorSubjectFile(){
        return (this.caseDetailFoemData.transferorType=='自然人' && this.caseDetailFoemData.transferorNationality == '中国') || this.caseDetailFoemData.transferorType!='自然人'
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
      YZgrid,
      Pagination,
      ChangeOfNameAndAddress,
      trademarkTable,
      DataUploadOrSelect,
      caseBill,
      ElectronicArchives,
      Goods,
      CaseInvestigators,
      SpecialInstructions,
      poppingTimeLimit,
      BreadCrumbCase,
      TagsModal
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      prePage: {}
    },
    data () {
      var idNumReg = /^[0-9]\d{5}$/;
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
      };
      return {
        transferorAddress:{
          province: '',
          city: '',
          district: ''
        },
        tfProvinceList: [],
        tfCityList: [],
        tfDistrictList: [],
        debouncedTfFunc: null,
        debouncedFunc: null,
        address: {
          province: '',
          city: '',
          district: ''
        },
        provinceList: [],
        cityList: [],
        districtList: [],
        organIdTypeList:[],
        idCardOptions:[],
        certTypeOptions:[],
        emailDisabled: false,
        checkGoodListTotal: 0,
        checkGoodList: [],
        currencyList: [],
        agentPersonList: [],
        backAppFromto: '',
        goodsVersionList: [],
        flDataFileSize: 0,
        creatematerial,
        flDataIndex: '',
        flData: {
          law: '',
          reason: '',
          materialId: '',
          material: {}
        },
        FlView: false,
        ZJView: false,
        FlEditView: false,
        ZjEditView: false,
        checkGoodsSign: false,
        lawArray: [],
        wxLawArray: [],
        yyTitleList: [
          { 'title': '中文名称', 'value': 'nameCn', 'editable': true },
          { 'title': '英文名称', 'value': 'nameEn', 'editable': true }
        ],
        flTitleList: [
          { 'title': '法律条款', 'value': 'law', 'editable': false },
          { 'title': '事实理由', 'value': 'reason', 'editable': false },
          { 'title': '附件', 'value': 'material', 'editable': false }
        ],
        zjTitleList: [
          { 'title': '法律条款', 'value': 'law', 'editable': false },
          { 'title': '事实理由', 'value': 'reason', 'editable': false },
          { 'title': '附件', 'value': 'material', 'editable': false },
          { 'title': '创建日期', 'value': 'createDate', 'editable': false },
        ],
        yzTitleList: [
          { 'title': '引证商标号', 'value': 'quoteRegNumber', 'editable': true, 'cellEditor': 'agInputSearch' },
          { 'title': '引证商标名称', 'value': 'quoteTm', 'editable': true },
          { 'title': '引证商标类别', 'value': 'quoteTmClass', 'editable': true },
          { 'title': '引证商标申请人', 'value': 'quoteAppName', 'editable': true },
        ],
        chongtuAuditReason: '',
        chongtuAuditView: false,
        brandHierarchyList: [],
        riskTypeList: [],
        riskLevelList: [],
        onlyJpg: false,
        oneFile: false,
        fgsqfileList:[],
        xgsmfileList: [],
        clmlfileList: [],
        zjclfileList: [],
        lyfileList: [],
        otherAgencyList: [],
        caseRoleSelectList: [],
        postFormFlag:true,
        poppingTimeLimitState:false,
        caseData:[],
        timeout: null,
        defaultCaseData:{},
        dcvalue: [
          "filePath",
          "tmName",
          "regNumber",
          "tmType",
          "applicantName",
          "applicantEnName",
          "applicantAddress",
          "applicantEnAddress",
          "appDate",
          "approvalNumber",
          "approvalDate",
          "regnoticeNumber",
          "regNoticeDate",
          "validStartDate",
          "validEndDate",
          "agent",
          "tmGroup",
          "trademarkCategories",
          "classify"
        ],
        materialArray: [],
        dcdata: [
          { desc: "商标图样", value: "filePath" },
          { desc: "商标名称", value: "tmName" },
          { desc: "注册号/申请号", value: "regNumber" },
          { desc: "国际分类", value: "tmType" },
          { desc: "申请人名称（中文）", value: "applicantName" },
          { desc: "申请人名称（英文）", value: "applicantEnName" },
          { desc: "申请人地址（中文）", value: "applicantAddress" },
          { desc: "申请人地址（英文）", value: "applicantEnAddress" },
          { desc: "申请日期", value: "appDate" },
          { desc: "递交日期", value: "submitDate"},
          { desc: "初审公告期号", value: "approvalNumber" },
          { desc: "初审公告日期", value: "approvalDate" },
          { desc: "注册公告期号", value: "regnoticeNumber" },
          { desc: "注册公告日期", value: "regNoticeDate" },
          { desc: "专用期开始日期", value: "validStartDate" },
          { desc: "专用期结束日期", value: "validEndDate" },
          { desc: "代理/办理机构", value: "agent" },
          { desc: "类似群", value: "tmGroup" },
          { desc: "商品/服务", value: "trademarkCategories" },
          { desc: "商标类型", value: "classify" },
          { desc: "是否驰名商标", value: "famous" },
          { desc: "是否立体商标", value: "ifSolidTm" },
          { desc: "是否共有申请", value: "ifShareTm" },
          { desc: "优先权日期", value: "priorDate" },
          { desc: "国际注册日期", value: "gjRegDate" },
          { desc: "后期指定日期", value: "hqzdDate" },
          { desc: "共有人中文名称", value: "gtApplicantName" }
        ],
        dialogVisibledctm: false,
        cdBool: false,
        tabtypeDown: false,
        dialogcheckChongTuVisible: false,
        gridData: [],
        collaptrademarkTable: "1",
        curCustLevel: false,
        ch_caseTypr: "",
        DataUploadOrSelectState: false,
        fileData1: {},
        submitTypeBool: false,
        multipleFileList: [],
        curUploadTitle: "",
        yyTextShowxk: {
          title: "被异议人",
          cnname: "被异议人中文名称",
          enname: "被异议人英文名称",
          cnaddr: "被异议人中文地址",
          enaddr: "被异议人英文地址",
          dlzz: "被异议人代理组织"
        },
        wtsfileListzr: [],
        appTextShow: {
          title: "申请人信息",
          cnname: "申请人中文名称",
          enname: "申请人英文名称",
          type: "主体法律性质",
          cnaddr: "申请人中文地址",
          enaddr: "申请人英文地址",
          uploadlang: "上传文件的语言类型"
        },

        tyimage: "",
        collapseactiveNames: "",
        zngoodb: "",
        zngood: "",

        downloadDtepfiles: "",

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

        dialogFormgroupCy: false,
        dialogFormTmCm: false,
        tkInspectType: "",
        tkInspectText: { innerMemo: "", cause: "", content: "" },
        jyText: "",
        goodsPlan: "",
        goodslistPageData: {
          total: 0,
          pageNo: 1,
          pageSize: 10
        },
        custReqCases: [],
        custReqBills: [],
        custActivity:[],
        custActivityList: [],
        joinFormData: {
          appId: "",
          cardName: "",
          nameCn: "",
          nameEn: "",
          addrEn: "",
          addrCn: "",
          joinAppType: "",
          joinAppCoun: "",
          getFileIsEn: "",
          type: "",
          fileName: []
        },
        chongtuType: "",
        chongtuForwordType: '',
        dialogFormjoin: 0,
        filterText: "",
        loading: false,
        rules: {
          reviewCaseAppDate: [
            { required: true, message: "请填写原申请日期", trigger: "blur" }
          ],
          // parentAppNumber: [
          //   { required: true, message: "请填写原申请编号", trigger: "blur" }
          // ],
          tmDesignDeclare: [
            {validator: tmDesignDeclare, trigger: ['blur', 'change'] , required: true,}
          ],
          preChangeAppCnName:[
            { required: true, message: `请选择名称`, trigger: ['blur', 'change'] }
          ],
          changeType:[
            { required: true, message: '请选择注销类型', trigger: ['blur', 'change'] }
          ],
          reason:[
            { required: true, message: this.ch_caseTypr === '补发商标注册证' ? '请输入申请补证理由' : '请输入未交回原注册证原因', trigger: ['blur', 'change'] }
          ],
          isDivision:[
            { required: true, message: '请选择是否分割', trigger: ['blur', 'change'] }
          ],
          parentAppDate:[
            { required: true, message: '请选择原撤销申请日期', trigger: ['blur', 'change'] }
          ],
          absoluteReason:[
            { required: true, message: '请选择是否仅涉及绝对理由', trigger: ['blur', 'change'] }
          ],
          chiming:[
            { required: true, message: '请选择请求驰名商标保护', trigger: ['blur', 'change'] }
          ],
          regDate: [{required: true, message: '请选择注册日期', trigger: ['blur', 'change']}],
          madrid: [
            { required: true, message: '请选择注册方式', trigger: ['blur', 'change'] }
          ],
          agencyCustId:[
            { required: true, message: '请选择外方代理所', trigger: ['blur', 'change'] }
          ],
          appState: [
            { required: true, message: '请选择注册国家', trigger: ['blur', 'change'] }
          ],
          appFromto: [
            { required: true, message: "请选择申请方向", trigger: "change" }
          ],
          submitType: [
            { required: true, message: "请选择申请方式", trigger: "change" }
          ],
          // docNumber:[
          //   { required: true, message: "请输入不予发文编号", trigger: "change" }
          // ],
          transferorCnName:[{ required: true, message: "请填写被许可人名称", trigger: "change" }],
          permitEffectiveDate:[{ required: true, message: "请选择许可使用合同生效日期", trigger: "change" }],
          permitInvalidDate:[{ required: true, message: "请选择许可使用合同终止日期", trigger: "change" }],
          relicensing:[
            { required: true, message: "请选择是否再许可", trigger: "change" }
          ],
          licenseType:[
            { required: true, message: "请选择许可类型", trigger: "change" }
          ],
          withdraw: [
            { required: true, message: "请选择撤回理由", trigger: "change" }
          ],
          parentAppNumber: [
            { required: true, message: "请填写", trigger: "change" }
          ],
          submitType: [
            { required: true, message: "请选择申请方式", trigger: "change" }
          ],
          custId: [
            { required: true, message: "请选择客户", trigger: "change" }
          ],
          goodClasses:[
            { required: true, message: "请选择类别", trigger: "change" }
          ],
          appCnName: [
            { required: true, message: "请选择申请人", trigger: ['change','blur']}
          ],
          appContactPerson: [
            { required: true, message: "请选择联系人", trigger: "change" }
          ],
          custContactId: [
            { required: true, message: "请选择客户联系人", trigger: "change" }
          ],
          certCode: [
            {
              required: true,
              message: "请填写统一社会信用代码",
              trigger: "blur"
            }
          ],
          // applicationMarks:[
          //   { required: true, message: "请填写阐述事实与理由", trigger: "blur" }
          // ],
          tmName: [
            { required: true, message: "请填写商标名称", trigger: "blur" }
          ],
          custRefno: [
            { required: true, message: "请填写客户文号", trigger: "blur" }
          ],
          tmOfficeNumber: [
            { required: true, message: "请填写官方发文编号", trigger: "blur" }
          ],
          parentDocNumber: [
            { required: true, message: "请填写原官方发文编号", trigger: "blur" }
          ],
          // parentAppNumber:[
          //   { required: true, message: "请填写原官方申请号", trigger: "blur" }
          // ],
          docDate: [
            { required: true, message: "请填写官文时限基准日期", trigger: "blur" }
          ],

          approvalNo: [
            { required: true, message: "请填写初审公告号", trigger: "change" }
          ],
          approvalDate: [
            { required: true, message: "请填写初审公告日期", trigger: "change" }
          ],
          approvalNumber: [
            { required: true, message: "请填写初审公告号", trigger: "change" }
          ],
          regNumber: [
            {
              required: true,
              message: "请填写商标注册号/原商标申请号/国际注册号",
              trigger: "change"
            }
          ],

          appContactTel: [
            { required: true, message: "请填写联系人电话", trigger: "blur" }
          ],
          legalNature: [
            { required: true, message: "请选择主体法律性质", trigger: "change" }
          ],
          respondentNameCn: [
            {
              required: true,
              message: "请选择被申请人或被许可人",
              trigger: "change"
            }
          ],
          uploadFileLanguage: [
            {
              required: true,
              message: "请选择上传文件的语言类型",
              trigger: "change",
              validator: (rule, value, callback)=>{
                if (
                  this.caseDetailFoemData.caseType === '国际注册驳回复审' && !value
                ) {
                  callback(new Error("请选择上传文件的语言类型"));
                } else {
                  callback();
                }
              },
            }
          ],
          appGJdq: [
            { required: true, message: "请选择申请人国籍", trigger: "change" }
          ],
          appContactZip: [
            { required: true, validator: validateIdNum, trigger: "blur" }
          ],
          appCnAddr: [
            {required: true, validator: appCnAddrValidate, trigger: ['blur', 'change']}
          ],

          appCertificate: [
            {
              required: true,
              message: "请填写证件名称",
              trigger: "blur"
            }
          ],
          appCertificateNum: [
            {
              required: true,
              message: "请填写证件号",
              trigger: "blur",
            }
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
          ],
          quotedOthersMaterial:[
            {
              required: true,
              message: "请选择是否引用其他异议申请证据材料",
              trigger: "change",
            }
          ],
          subBusinessSecrets:[
            {
              required: true,
              message: "请选择是否提交涉商业机密证据材料",
              trigger: "change",
            }
          ],
          quotedAppNumber:[
            {
              required: true,
              message: "请填写涉商业机密证据材料",
              trigger: "blur",
            }
          ],
        },
        preChangeAppCnNameMap : {
          1:"申请人变更名称",
          2:"代表人变更名称",
          3:"复审申请人变更名称",
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

        stepActive1: 0,
        ifpriority: false,
        activeName: "first",
        caseDetailFoemData: {
          isChangeName:'',
          isDivision: 0,
          supplement: 1,
          taskId: "",
          custName: "",
          whdAgencyName: "",
          IsUpwhdAgency: "",
          memberRule: "",
          memberNamelists: [],
          instructions: "",
          caseType: "", // 案件类型 文字
          custId: "", // 客户id
          caseTypeId: "", // 案件类型编号
          appFromto: "", // 申请方向 文字
          caseNumber: "", // 案件个数
          agentNum: "", // 案件文号
          submitType: "", // 申请方式 文字
          tmName: "", // 商标名称
          tmNameEn: "", // 商标英文
          relicensing:'否',
          licenseType:'',
          goods: [],
          materials: [],
          tmType: "", // 种类 （1：一般；2：集体；3：证明）传1、2、3
          ifSolidTm: "", // 是否三维标志（0：否；1：是）传0、1
          colorSign: "", // 是否是颜色组合（0：否；1：是）传 0、1
          assignColor: "", // 指定颜色（0：否；1：是）传 0、1
          tmVoice: "", // 声音标识（0：否；1：是）传 0、1
          priorityType: "", // 优先权声明（1：基于第一次申请的优先权；2：基于会展的优先权）传1、2
          priorityBaseCrty: "", // 优先权国家（文字）
          priorityAppDate: "", // 优先权日期
          isLoadPriorityFile: "", // 优先权文件候补（0：否；1：是）传 0、1
          priorityAppNum: "", // 优先权申请号
          custRefno: "", // 客户文号
          custContactId: "", // 客户联系人id
          trademarkCaseCustContacts: [],
          letterAddrId: "", // 信函地址id
          billCustContactId: "", // 账单联系人id
          discount: "", // 折扣率
          billAddrId: "", // 账单地址id
          applicationMarks: "", // 申请书标注
          caseLevel: "", // 案件等级（1：普通；2：重要）传1、2
          otherAgency: "", // 他所代交（0：否；1：是）传 0、1
          replaceAgencyName: "", // 代交所名称
          remarks: "", // 案件备注
          appGJdq: "", // 书式类型（文字）
          certCode: "", // 统一社会信用代码
          appId: "", // 申请人id
          appCnName: "", // 申请人中文名称
          appEnName: "", // 申请人英文名称
          appCountryOrRegion: "", // 申请人国家或地区
          appCnAddr: "", // 申请人中文地址
          appEnAddr: "", // 申请人英文地址
          legalNature: "",
          appContactPerson: "", // 联系人（中文）
          appContactZip: "", // 邮政编码
          appContactTel: "", // 电话
          appContactEmail: "", // 邮箱
          ifShareTm: "", // 共同申请（0：否；1：是）传 0、1
          joinApps: [],
          madrid: '', // 马德里注册
          appState: "", // 注册国家（文字）
          agencyCustId: "", // 外方代理所id
          agencyCustContactId: "", // 外代所联系人id
          agencyCustRefno: "", // 外方代理所文号
          agencyCustAddrId: "", // 外方代理所地址id
          agencyCustReq: "", // 外放代理所要求
          timeLimitContent: "", // 时限内容
          limitDate: "", // 时限日期
          trademarkCaseMadrids: [],
          trademarkCaseBasicinfos: [],
          caseIds: [],
          trademarkCaseWorkgroups: [],
          ownerDeptId: "", // 案件所属部门 （选择客户组时的deptId）
          caseEvolve: [],
          trademarkCaseCustWorkgroups: [
            { wkgId: "", trademarkCaseWorkgroupMembers: [] }
          ],
          trademarkCaseCBWorkgroups: [],
          trademarkCaseLCWorkgroups: [],
          respondentNameCn:'',
          transferorCnName:'',
          transferorEnName:'',
          transferorType:'',
          transferorNationality:'',
          transferorCnAdress:'',
          transferorEnAdress:'',
          transferorCountryAndregion:'',
          zrCertCode:'',
          transferorUploadFileLanguage:''
        },
        pickerOptions: {
          // disabledDate(time) {
          //   return time.getTime() > Date.now()
          // },
          shortcuts: [
            {
              text: "今天",
              onClick (picker) {
                picker.$emit("pick", new Date());
              }
            },
            {
              text: "昨天",
              onClick (picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit("pick", date);
              }
            },
            {
              text: "一周前",
              onClick (picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", date);
              }
            }
          ]
        },
        selectData: {
          appaddr: [],

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
          casecount: []
        },

        wtsfileList: [],
        fileName: {
          "1018": "",
          "429": "",
          "430": "",
          "1020": "",
          "1005": "",

          "1006": "",
          "1003": "",
          "1024": '',
          "1025": '',
          "1026": '',
          "1027": '',
          "301564": "",
          "301565": "",
          "301563": "",
          "301562": "",
          "1071": "",
          "1072": "",
          "1016": "",
          "1007": "",
          "1008": "",
          "1009": "",
          "1010": "",
          "409": "",
          "1040": "",
          "1039": "",
          "1002": "",
          "1000": "",

          "1037": "",
          "1038": "",
          "1032": "",
          "1033": "",
          "1001": "",

          "1004": "",

          "1028": "",
          "1041": ""
        },
        iscases: false,
        pageGoods: [],
        custGroup: [],
        mainCaseIds: [],
        queryCanProcessTmState: false,
        queryModuleData: {},
        changeNAInfo: {
          tmName: "",
          regNumber: "",
          regNoticeDate: "",
          validStartDate: "",
          validEndDate: ""
        },
        regNumberList: [],
        tmlist: [
          "许可备案",
          "转让/移转",
          "撤回商标申请",
          "补发商标注册证",
          "补发商标变转续证明"
        ],
        noNeedTosubmit:['商标查询',
          "签署代理合同协议",
          "商标监控总卷/协议",
          "咨询",
          "其他",
          '广告',
          '著名商标认定',
          "投标"],
        elstepList: [],
        filingOperationState: false,
        showType: false,
        queryCustomerNameIdList:[],
        caseTypeList:[],
        appCnAddrChangeFlag:false,
        transAppCnAddrChangeFlag:false,
        tagPath:''
      };
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
      // "caseDetailFoemData.transferorCnAdress":{
      //   handler(val){
      //     if(this.caseDetailFoemData.transferorNationality == '中国'){
      //       this.debouncedTfFunc&&this.debouncedTfFunc()
      //     }
      //   },
      //   immediate: true
      // },
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
      "caseDetailFoemData.goodClasses" (n) {
        if (n) {
          this.caseDetailFoemData.goodClasses = n
            .replace(/\D/g, ";")
            .replace(/;+/g, ";");
        }
      },
      "caseDetailFoemData.goodImages": function (val, oldval) {
        if (val && val.length == 0) {
          this.caseDetailFoemData.goodImagesSign = '0000'
        }
        if (val && val.length > 0) {
          this.caseDetailFoemData.goodImagesSign = '1111'
        }
      },
      "caseDetailFoemData.goods": function (val, oldval) {
        if(val&&val.length==0){
          this.caseDetailFoemData.goodsSign='0000'
        }
        if(val&&val.length>0){
          this.caseDetailFoemData.goodsSign='1111'
        }
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
      "caseDetailFoemData.quotes": function (val, oldval) {
        if(val&&val.length==0){
          this.caseDetailFoemData.quotesSign='0000'
        }
        if(val&&val.length>0){
          this.caseDetailFoemData.quotesSign='1111'
        }
      },
      "caseDetailFoemData.demurCaseLaws": function (val, oldval) {
        if(val&&val.length==0){
          this.caseDetailFoemData.demurCaseLawsSign='0000'
        }
        if(val&&val.length>0){
          this.caseDetailFoemData.demurCaseLawsSign='1111'
        }
      },
      "caseDetailFoemData.appCertFileIsCn" (n) {
        console.log(n);
      },
      dialogFormjoin (n) {
        if (n == 1) {
          this.joinCreatdialog();
        }
      },
      "caseDetailFoemData.appId" (n) {
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
      // "selectData.apps"(n) {
      //   this.$nextTick(function() {
      //     this.appselectChange(this.caseDetailFoemData.appId, "1");
      //   });
      // }
      "caseDetailFoemData.appCnName" (n, o) {
        // this.$nextTick(()=>{
        //
        //   if (this.selectData.apps && this.selectData.apps.length > 0) {
        //     if (o != null) {
        //       console.log("清空");
        //     }
        //     this.appselectChange(n);
        //   }
        // });
      },
      "caseDetailFoemData.transferorCnName" (n,o) {
        // this.$nextTick(function () {
        //      if (this.selectData.apps && this.selectData.apps.length > 0) {
        //     if (o != null) {
        //       console.log("清空");
        //     }
        //       this.tranappselectChange(n);
        //   }
        //
        // });
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
    mixins: [require('@/views/workbench/case/components/TabNameStorage.vue').default],
    created () {
      this.dcdata = fydefaultdc;
      this.dcvalue = fydefaultdcmr;
      this.firstGetTrademark = true;
      // console.log(this.caseDetailFoemData.caseEvolve, "___");

      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id;
        //  this.$route.query.pageId

        this.mainCaseIds = id.split(",");
        if (this.mainCaseIds.length > 1) {
          this.iscases = true;
        }

        this.fetchData();
        this.getCrestDataUp();
        // this.fetchData("387182,386627,387182");
      } else {
      }
      this.debouncedFunc = this.debounce(this.debounceSplitAddress, 1000);
      this.debouncedTfFunc = this.debounce(this.debounceSplitTfAddress, 1000);
    },
    async mounted () {
      window.addEventListener("scroll", this.handleScroll, true);
      this.provinceList =await this.queryRegionList(1)
      this.tfProvinceList =await this.queryRegionList(1)
    },
    methods: {
      formatCaseTagPath(caseTagPathList) {
        if (!Array.isArray(caseTagPathList) || !caseTagPathList.length) {
          return ''
        }
        return caseTagPathList.map(item => {
          if (typeof item === 'string') {
            return item
          }
          return item.tagName || ''
        }).filter(Boolean).join('/')
      },
      changeAppCnAddr(vlaue){
        if(this.appCnAddrChangeFlag){
          this.debouncedFunc&&this.debouncedFunc()
        }
        this.appCnAddrChangeFlag = true
      },
      changeTransferorCnAdress(){
        if(this.transAppCnAddrChangeFlag){
          this.debouncedTfFunc&&this.debouncedTfFunc()
        }
        this.transAppCnAddrChangeFlag = true
      },
      //主体法律性质变更
      changeLegalNature(value){
        if (value) {
          this.caseDetailFoemData.appCertificate = ''
        }
      },
      //转让人主体法律性质变更
      handleChangeTfType(){
        this.caseDetailFoemData.transferorCertificateName = ''
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
        if (!address) {
          return false
        }
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
      debounceSplitTfAddress(){
        this.splitTfAddressFunc(this.caseDetailFoemData.transferorCnAdress)
      },
      async splitTfAddressFunc(address){
        const responce = await splitAddress({address:address})
        if (responce.success) {
          if (responce.data.provinceCode) {
            this.tfCityList = await this.queryRegionList(2,responce.data.provinceCode)
            this.transferorAddress.province = responce.data.provinceCode
          }else{
            this.transferorAddress.province = ''
          }
          // console.log(responce.data.cityCode,'responce.data.cityCode');
          // console.log(responce.data.regionCode,'responce.data.regionCode');

          if (responce.data.cityCode) {
            this.tfDistrictList = await this.queryRegionList(3,responce.data.cityCode)
            this.transferorAddress.city = responce.data.cityCode
          }else{
            this.transferorAddress.city = ''
          }
          if (responce.data.regionCode) {
            this.transferorAddress.district = responce.data.regionCode
          }else{
            this.transferorAddress.district = ''
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
      //转让人地址变更处理
      async handleTfProvinceChange(val) {
        this.transferorAddress.city = '';
        this.transferorAddress.district = '';
        if(val){
          this.tfCityList = await this.queryRegionList(2, val);
        }else{
          this.tfCityList = [];
        }
        this.tfDistrictList = [];
      },
      async handleTfCityChange(val) {
        this.transferorAddress.district = '';
        if(val){
          this.tfDistrictList = await this.queryRegionList(3, val);
        }else{
          this.tfDistrictList = [];
        }
      },
      handleDistrictChange(val){
        if (val) {
          // const address = this.districtList.find(item => item.regionCode == val).regionName
          // this.caseDetailFoemData.appCnAddr = address
        }
      },
      highlightKey(text, key) {
        if (!key || !text || text.indexOf(key) === -1) {
          // 没有匹配到就原样返回
          return text;
        }
        const regex = new RegExp(key, 'gi');
        return text.replace(regex, `<span style="color: red;">${key}</span>`);
      },
      changeIsChangeName(value){
        if(value == 0){
          this.caseDetailFoemData.preChangeAppCnName = ''
        }
      },
      delCheckGoods(list) {
        this.checkGoodList = this.checkGoodList.filter(
            data => !list.includes(data)
        );
      },
      changeIfShareTm(value) {
        if (value == '0') {
          this.$set(this.caseDetailFoemData, 'joinApps', [])
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
              let number = [...(this.caseDetailFoemData.goods.filter(item => item.number).map(item => item.number)), 0]
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
      computeFileSize(size) {
        let list = []
        if (this.ZjView == true) {
          list = this.caseDetailFoemData.demurCaseLawBCs
        } else {
          list = this.caseDetailFoemData.demurCaseLaws
        }
        this.flDataFileSize = this.$wUtil.formatFloat(list.reduce((pre, next) => pre + (next.material && next.material.size && next.material.size || 0), size || 0) / 1024 / 1024, 2);
      },
      beforeUpload(file) {
        const limitSize = 200 * 1024 * 1024
        const currentSize = this.caseDetailFoemData.demurCaseLaws && this.caseDetailFoemData.demurCaseLaws.reduce((pre, next) => pre + (next.material && next.material.size && next.material.size || 0), file.size || 0)
        if (currentSize > limitSize) {
          this.$message.error('所有证据材料加在一起不能超过200MB!')
          return false
        }
        const name = file.name.toLowerCase().replace(/.+\./g, '')
        if (!name.includes('pdf')) {
          this.$message.warning('请上传PDF类型的文件！')
          return false
        }
      },
      handleRemove(file, fileList, caseId) {
        let delmaterialId;
        if (file.response) {
          delmaterialId = file.response.data[0].materialId
        } else {
          delmaterialId = file.materialId
        }
        deleteMaterial({materialId: delmaterialId}).then(res => {
          this.flData.material = {}
          this.flData.materialId = ''
        })
      },
      onsuccess(response, file, fileList) {
        response.data[0].name = response.data[0].materialName
        this.flData.material = response.data[0]
        this.flData.materialId = response.data[0].materialId
        this.computeFileSize(file.size)
      },
      getUploadData() {
        const data = {
          tokenID: this.$store.getters.token,
          caseIds: [this.caseDetailFoemData.caseId],
          materialTypeId: this.ZjView ? 301605 : 301602
        }
        return data
      },
      submitFl(){
        if (this.ZjView) {
          if (this.ZjEditView) {
            this.caseDetailFoemData.demurCaseLawBCs.splice(+this.flDataIndex, 1, this.flData)
          } else {
           this.caseDetailFoemData.demurCaseLawBCs.push(this.flData)
          }
        } else {
          if (this.FlEditView) {
            this.caseDetailFoemData.demurCaseLaws.splice(+this.flDataIndex, 1, this.flData)
          } else {
           this.caseDetailFoemData.demurCaseLaws.push(this.flData)
          }
        }
        this.closeFlView()
      },
      closeFlView(done) {
        this.FlView = false
        this.ZjView = false
        this.ZjEditView = false
        this.flData = {
          law: '',
          reason: '',
          materialId: '',
          material: {}
        }
        this.FlEditView = false
        this.flDataFileSize = 0
        done && done()
      },
      delFlData(items) { // 批量删除
        this.caseDetailFoemData.demurCaseLaws = this.caseDetailFoemData.demurCaseLaws.filter(
          data => !items.includes(data)
        );
      },
      deleteFlData(row){ // 单个删除
        this.delFlData([row])
      },
      deleteZjData(row){
        this.delZjData([row])
      },
      delZjData(items){
        this.caseDetailFoemData.demurCaseLawBCs = this.caseDetailFoemData.demurCaseLawBCs.filter(
          data => !items.includes(data)
        );
      },
      editZjData(row, index){
        this.ZjView = true
        this.ZjEditView = true
        this.editFlData(row, index)
      },
      editFlData(row, index){
        this.FlView = true
        this.FlEditView = true
        this.flDataIndex = index
        this.flData = JSON.parse(JSON.stringify(row))
        this.computeFileSize()
      },
      addZjData(){
        this.ZjView = true
        this.addFlData()
      },
      addFlData() {
        this.FlView = true
        this.computeFileSize()
      },
      addYyData() {
        this.caseDetailFoemData.opponents.push({
          nameCn: '',
          nameEn: '',
          tmCaseId: this.caseDetailFoemData.tmCaseId,
          caseId: this.caseDetailFoemData.caseId,
        })
      },
      addYzData() {
        this.caseDetailFoemData.quotes.push({
          tmCaseId: this.caseDetailFoemData.tmCaseId,
          quoteRegNumber: '',
          quoteTm: '',
          quoteTmClass: '',
          quoteAppName: ''
        })
      },
      alertChongtuAuditFunc(type){
        // this.chongtuAuditReason
        this.chongtuAuditView = type
      },
      chongtuAuditFunc(result){
        if (!this.chongtuAuditReason) {
          this.$message.error(`请填写${result === 1 ? '通过' : '退回'}理由！`)
          return
        }
        chongtuAudit({
          failReason: this.chongtuAuditReason,
          taskId: this.caseDetailFoemData.taskId,
          result: result === 1 ? 1 : 0
        }).then(res => {
          this.$message.success('审核成功！')
          this.updateCtAudit()
          this.chongtuAuditView = false
        })
      },
      delYzData(items){
        this.caseDetailFoemData.quotes = this.caseDetailFoemData.quotes.filter(
          data => !items.includes(data)
        );
      },
      delYyData(items){
        this.caseDetailFoemData.opponents = this.caseDetailFoemData.opponents.filter(
          data => !items.includes(data)
        );
      },
      checkTab(v){
        if (v) {
          const reg = new RegExp(/\t/);
          if (reg.test(v)) {
            this.caseDetailFoemData.applicationMarks = v.replace(/\t/g, ' ')
            this.$message.warning('请注意，为了提交自动网申成功，已将制表符改成空格。')
          }
        }
      },
      async delAllGoodsJudge (data) {
        let notice = this.ch_caseTypr === '撤销三年停止使用申请' ? '是否撤销【全部商品/服务项目】？' : '许可商品/服务项目是否为【全部商品/服务项目】？'
        if (
          ['撤销三年停止使用申请', '许可备案'].includes(this.ch_caseTypr)
          && ['外-内', '内-内'].includes(this.caseDetailFoemData.appFromto)
          && this.caseDetailFoemData.goodClasses
        ) {
          return await this.$confirm(notice,
            '提示',
            {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'warning'
            }
          ).then(() => {
            data.goods = [{
              goodClass: this.caseDetailFoemData.goodClasses.split(';')[0],
              goodName: '全部'
            }]

          }).catch((action) => {

          })
        }
        return
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
      billDiscount(){
        billDiscount(this.caseDetailFoemData).then(res=>{
          this.caseDetailFoemData.discount=res.data
        })
      },
      changeNumberA(e,type){
        if(e&&this.caseDetailFoemData.caseType=='分割申请'&&['内-内','外-内'].includes(this.caseDetailFoemData.appFromto)){
          if(!this.caseDetailFoemData[type]||!this.caseDetailFoemData[type].endsWith('A')){
            this.caseDetailFoemData[type] = e +'A'
          }
        }
      },
      handleTransferorCnName(item){
        this.caseDetailFoemData.transferorEnName = item.applicantEnName;
        // this.caseDetailFoemData.transferorCnName = item.applicantName;
        this.caseDetailFoemData.transferorType =item.appType;
        this.caseDetailFoemData.transferorNationality = item.sendType;
        this.caseDetailFoemData.transferorCnAdress = item.applicantAddress;
        this.caseDetailFoemData.transferorEnAdress = item.applicantEnAddress;
        this.caseDetailFoemData.transferorCountryAndregion =item.country;
        this.caseDetailFoemData.zrCertCode =item.certCode;
      },
      handleAppCnName(e){
        this.appCnAddrChangeFlag = true
        this.appId=e.appId

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
          queryAppContactUrl({ appId: e.appId }).then(ite => {
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
      remoteMethodApp(query, cb) {
        queryAllUrl({ pageNo: 1, pageSize: 100, applicantName: query,orderBy:1 }).then(res => {
          res.data.forEach(item=>{
            item.value=item.applicantName
          })
          cb(res.data.filter(this.createStateFilter(query)))
        });
      },
      handleSelect(item){
        this.joinFormData.nameEn = item.applicantEnName
        this.joinFormData.addrCn=item.applicantAddress
        this.joinFormData.addrEn=item.applicantEnAddress
      },
      changeElstepList(){
        if (this.activeName=='first') {
          this.elstepList = [
              { title: "案件详情", state: true, id: "ajxq-title" },
              { title: "客户信息", state: true, id: "khxx-title" },

              {
                title: "受让人信息",
                state: this.ch_caseTypr === "转让/移转",

                id: "srr-title"
              },
              {
                title: "申请人（许可人信息）",
                state: this.ch_caseTypr === "许可备案",

                id: "srr-title"
              },
              {
                title: "商标信息",
                state: this.mainCaseIds.length === 1,
                id: "sbxx-title"
              },
              {
                title: "引证商标信息",
                state: true,
                id: "yz-title"
              },
              {
                title: "法律条款和事实理由",
                state: true,
                id: "fl-title"
              },
              {
                title: "申请人信息",
                state:
                  this.ch_caseTypr === "商标查询" ||
                  this.ch_caseTypr === "撤回商标申请" ||
                  this.ch_caseTypr === "补发商标注册证" ||
                  this.ch_caseTypr === "补发商标变转续证明" ||
                  this.ch_caseTypr === "撤回商标评审" ||
                  this.ch_caseTypr === "出具优先权证明文件" ||
                  this.ch_caseTypr === "异议" ||
                  this.ch_caseTypr === "异议答辩" ||
                  this.ch_caseTypr === "出具商标注册证明" ||
                  this.ch_caseTypr === "商标注销",

                id: "srr-title"
              },

              {
                title: "共有人信息",
                state: this.ch_caseTypr != "商标查询",
                id: "gyrxx-title"
              },
              // {
              //   title: "查询信息",
              //   state: this.ch_caseTypr === "商标查询",
              //   id: "xxxx-title"
              // },
              {
                title: "查询结果",
                state: this.ch_caseTypr === "商标查询",
                id: "xxjgxx-title"
              },
              {
                title: "转让人信息",
                state:
                  this.ch_caseTypr === "转让/移转" ||
                  this.caseDetailFoemData.changeType === "转让",

                id: "zrrxx-title"
              },
              {
                title: "被许可人信息",
                state:
                  this.ch_caseTypr === "许可备案" ||
                  this.caseDetailFoemData.changeType === "许可" ||
                  this.ch_caseTypr === "许可备案提前终止",

                id: "bxkrxx-title"
              },
              {
                title: "被异议人信息",
                state: this.ch_caseTypr === "异议",
                id: "byyrxx-title"
              },
              {
                title: "被申请人信息",
                state:
                  this.ch_caseTypr === "无效宣告申请" ||
                  this.ch_caseTypr === "不予注册复审" ||
                  this.ch_caseTypr === "撤销商标复审" ||
                  this.ch_caseTypr === "无效宣告复审" ||
                  this.ch_caseTypr === "无效宣告答辩" ||
                  this.ch_caseTypr === "参加不予注册复审",
                id: "byyrxx-title"
              },
              {
                title: "异议人信息",
                state: this.ch_caseTypr === "异议答辩",
                id: "byyrxx-title"
              },
              {
                title: "被申请人(撤销人)信息",
                state: this.ch_caseTypr === "撤三答辩（提供使用证明）" || this.ch_caseTypr === "撤销通用名称答辩",
                id: "byyrxx-title"
              },
              {
                title: "被申请人(注册人)信息",
                state: this.ch_caseTypr === "撤销三年停止使用申请",
                id: "byyrxx-title"
              },
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
      transferCase(){
        createCode().then(res=>{
          this.$router.push(`/workbench/case/transferCase/${res.data}?agentNum=${this.caseDetailFoemData.agentNum}`)
        })
      },
      handleScroll () {
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
      getAppInfo (item) {
        this.queryModuleData.custId = this.caseDetailFoemData.custId;
        this.queryModuleData.appId = item.appId;
        this.queryModuleData.caseTypeName = this.ch_caseTypr;
        this.queryModuleData.caseTypeId = this.caseDetailFoemData.caseTypeId;
        this.queryCanProcessTmState = true;
      },
      getAppAddress () { },
      contactchange (id) {
        queryCustomerContactByCustContactIdUrl({ custContactId: id }).then(
          res => {
            this.selectData.customerMailAdds = res.data.customerMailAdds;
            this.selectData.billAdds = res.data.BillAdds;
            this.selectData.billAdds.forEach(item => {
              if (!item.addressCn) {
                item.addressCn = item.addressEn;
              }
            });
            this.caseDetailFoemData.letterAddrId = "";
            this.caseDetailFoemData.billAddrId = "";
          }
        );
      },
      getGoods (goods) {
        // console.log(this.caseDetailFoemData.goods);
        this.caseDetailFoemData.goods = [
          ...this.caseDetailFoemData.goods,
          ...goods
        ];
        // console.log(this.caseDetailFoemData.goods);
        const res = new Map();
        this.caseDetailFoemData.goods = this.caseDetailFoemData.goods.filter(
          item => !res.has(item.goodName + item.goodEnName + item.goodJpName + (item.version || '')) && res.set(item.goodName + item.goodEnName + item.goodJpName + (item.version || ''), 1)
        );
        // console.log(this.caseDetailFoemData.goods);
        if(this.caseDetailFoemData.goods.length){
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

        // Array.from(new Set(arr))
      },
      delgood (items) {
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
      getTrademark (info) {
        if (info.length && info[0]) {
          Promise.all(
            Array.from(new Array(info.length).keys())
              .slice(0)
              .map(item => tmdetail({ tmId: info[item].tmId }))
          ).then(res => {
            // if (["转让/移转","异议","撤销三年停止使用申请","无效宣告"].includes(this.ch_caseTypr)) {
            //   this.caseDetailFoemData.transferorCnName = res[0].data.applicantName;
            // } else {
            //   this.caseDetailFoemData.appCnName = res[0].data.applicantName;
            // }
            this.$nextTick( ()=> {
              if (this.selectData.apps && this.selectData.apps.length > 0) {
                this.appselectChange( this.caseDetailFoemData.appCnName ,res[0].data.applicantAddress,res[0].data.applicantEnAddress);
              }
            });
            this.caseDetailFoemData.tmName = res[0].data.tmName;
            this.caseDetailFoemData.regNumber = res[0].data.regNumber;
            this.caseDetailFoemData.validStartDate = res[0].data.validStartDate;
            this.caseDetailFoemData.validEndDate = res[0].data.validEndDate;
            this.caseDetailFoemData.regDate = res[0].data.regNoticeDate;
            // this.caseDetailFoemData.appDate = res[0].data.appDate;
            // this.caseDetailFoemData.appNumber = res[0].data.appNumber;
            this.caseDetailFoemData.decisionResult = res[0].data.decisionResult;
            this.caseDetailFoemData.respondentAgency=res[0].data.agent
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
            this.caseDetailFoemData.assignColor = res[0].data.colorDesc==='是'
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
        this.dialogFormjoin = 2;
        // this.joinFormData = row;
        this.$set(this, 'joinFormData', row)
      },
      getLanglist (array) {
        let arr = [];
        array.forEach(item => {
          arr.push(...item);
        });
        return arr;
      },
      cmDialogShow () {
        this.selectTmSearchInput = this.caseDetailFoemData.tmName;

        this.getCmtmdata();
      },
      getCmtmdata (type) {
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
      handleCheckAllgoodClassChange (val) {
        this.checkedgoodClass = val ? goodClasses : [];
        this.isIndeterminategoodClass = false;
      },
      handleCheckedgoodClassChange (value) {
        const checkedCount = value.length;
        this.checkAllgoodClass = checkedCount === this.allgoodClass.length;
        this.isIndeterminategoodClass =
          checkedCount > 0 && checkedCount < this.allgoodClass.length;
      },
      // 共同申请人
      addjionP () {
        if (this.dialogFormjoin == 1) {
          this.caseDetailFoemData.joinApps.push(this.joinFormData);
          this.joinFormData.caseIds = this.mainCaseIds;
          modifyjoinappUrl(this.joinFormData);
        } else if (this.dialogFormjoin == 2) {
          this.caseDetailFoemData.joinApps.splice(
            this.caseDetailFoemData.joinApps
              .map(item => item.joinAppId)
              .indexOf(this.joinFormData.joinAppId),
            1,
            this.joinFormData
          );
        }
        this.joinFormData = {
          caseIds: this.mainCaseIds,
          appId: "",
          cardName: "",
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
      deljoinp (item, index) {
        // const index = this.caseDetailFoemData.joinApps.indexOf(item);
        this.caseDetailFoemData.joinApps.splice(index, 1);
        delJoinAppUrl({ joinAppId: item.joinAppId, caseIds: this.mainCaseIds });
      },
      delMDL (index) {
        // const index = this.caseDetailFoemData.trademarkCaseBasicinfos.indexOf(
        //   item
        // );
        this.caseDetailFoemData.trademarkCaseBasicinfos.splice(index, 1);
      },
      handleClickTab (tab, event, flag) {
        if (tab.index != "4") {
          this.tabtypeDown = false;
        } else {
          this.tabtypeDown = true;
        }
        if ((tab.index == "1" || flag) && this.caseDetailFoemData.custId) {
          queryCustomerReqUrl({ custId: this.caseDetailFoemData.custId, caseId: this.caseDetailFoemData.caseId }).then(
            res => {
              this.custReqBills = res.data.custReqBills;
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
      getChangedata(){
        // let item=JSON.parse(JSON.stringify(this.caseDetailFoemData))

        if(this.defaultCaseData.goodsSign){
          delete this.defaultCaseData.goodsSign
        }

        // if(['内-内', '外-内', '台-内'].includes(this.caseDetailFoemData.appFromto) && this.caseDetailFoemData.approvalNo && this.caseDetailFoemData.regNumber){
        //   this.caseDetailFoemData.approvalNo = this.caseDetailFoemData.regNumber
        // }
        let item = this.$commonUtils.compareObjAttrs(this.defaultCaseData, this.caseDetailFoemData)
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            const element =item[key];
            const element1=this.defaultCaseData[key];
            if(key == 'trademarkCaseCBWorkgroups' && item[key] && !item[key].length){
              item[key + 'Sign'] = '0000'
            } else if(!item['trademarkCaseCBWorkgroups']){
              item[key + 'Sign'] = '0000'
            }

            if(JSON.stringify(element) != JSON.stringify(element1)){
              if(((element===null||element===''||element===undefined)&&element1)){
                if(['priorityAppDate','appDate','approvalDate','regDate','limitDate','submitDate','validStartDate','validEndDate','zdRegDate','zdAppDate','firstUseDate','businessUseDate'].includes(key)){
                  item[key+'Str']='0000';
                }else {
                  item[key]='0000';
                }
              }
            }else{

            }
          }
        }
        return item;

      },
      async  fetchData (type) {
        let {data}  =  await queryCaseInfoUrl({ caseIds: this.mainCaseIds ,initFlag:1})
        this.caseDetailFoemData=Object.assign(data, this.caseDetailFoemData);
        this.tagPath = this.formatCaseTagPath(data.caseTagPathList)
        queryReplaceAgencyName().then(res=>{
          this.otherAgencyList = res.data
        })
        queryCaseInfoUrl({ caseIds: this.mainCaseIds })
          .then(response => {
            this.caseDetailFoemData = Object.assign(this.caseDetailFoemData, response.data);
            this.tagPath = this.formatCaseTagPath(response.data.caseTagPathList)
            if ((this.caseDetailFoemData.caseType == '注册驳回复审' || this.caseDetailFoemData.caseType == '国际注册驳回复审')&&!this.caseDetailFoemData.isChangeName) {
              // this.caseDetailFoemData.isChangeName = 0
              this.caseDetailFoemData.preChangeAppCnName = ''
            }
            if (['内-外','外-外'].includes(this.caseDetailFoemData.appFromto)) {
             queryCurrencyUrl().then(res => {
                this.currencyList = res.data
              })
              this.getCheckGoodsList({pageSize: 10})
            }
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
            if (this.caseDetailFoemData.reissueType) {
              this.caseTypeList = this.$commonUtils.extractTree(this.$commonUtils.findParentLevel(this.$store.getters.caseTypeList.filter(item => item.caseType === '商标'), 'caseType', [this.caseDetailFoemData.reissueType], 'parent', 'childrens', 'caseTypeId'), 'childrens').map(item => item.caseType)
            }
            this.ch_caseTypr = this.$commonUtils.getMenuName(this.$store.state.caseInformation.caseTypeList,'childrens').find(item=>item.caseTypeId==this.caseDetailFoemData.caseTypeId).caseType

            // console.log(response.data.appContactPerson,888);
            //
            this.defaultCaseData=JSON.parse(JSON.stringify(response.data))
            // this.caseDetailFoemData.caseType=this.$route.params.caseType
            this.queryCustomerNameIdList=[{custId:Number(this.caseDetailFoemData.custId),fullname:this.caseDetailFoemData.custName}]
            if(this.caseDetailFoemData.caseType==='商标查询'){
              let appPorpList=['appCnName', 'appCnAddr', 'certCode','appGJdq', 'legalNature', 'appContactTel','appFromto']
              appPorpList.forEach(item=>{
                this.$set(this.rules[item][0],'required',false)
              })
            }
            if (
              !this.caseDetailFoemData.discount ||
              this.caseDetailFoemData.discount == "null"
            ) {
              this.$set(this.caseDetailFoemData, 'discount', 100)
              // this.caseDetailFoemData.discount = 100;
            }
            this.materialArray = this.caseDetailFoemData.materials;
            this.caseDetailFoemData.joinApps.forEach(item => {
              item.modifyState = false;
            });

            if (
              type == "1" &&
              this.caseDetailFoemData.caseType == "商标注销" &&
              this.caseDetailFoemData.changeType == "部分注销"
            ) {
              this.caseDetailFoemData.goods = [];
            }
            if (
              /^['C'|'D']$/.test(this.caseDetailFoemData.custLevel) ||
              !this.caseDetailFoemData.custLevel
            ) {
              queryAlltask({
                userId: this.$store.getters.userId,
                taskId: this.caseDetailFoemData.taskId
              }).then(res => {
                if (res.data && res.data.length && res.data[0].createStatus) {
                  this.curCustLevel = true;
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
            //给转让人的省/市/区赋值
            if (this.caseDetailFoemData.provinceOrCity) {
              this.splitTfAddressFunc(this.caseDetailFoemData.provinceOrCity.replace(/#/g,''))
            }else{
              this.splitTfAddressFunc(this.caseDetailFoemData.transferorCnAdress)
            }

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
            let submitTypeBoolarr = [
            //  "无效宣告申请",
            //   "无效宣告答辩",
              //"异议",
             // "异议答辩",
             //  "不予注册复审",
             //  "参加不予注册复审",
             //  "撤销商标复审",
             //  "无效宣告复审",
             //  "撤销复审答辩",
             // "撤销三年停止使用申请",
             // "撤三答辩（提供使用证明）",
             //  "撤回商标评审",
              // "注册驳回复审",
              // "国际注册驳回复审"
            ];
            if (submitTypeBoolarr.includes(this.ch_caseTypr)) {
              this.submitTypeBool = true;
              this.caseDetailFoemData.submitType = "线下申请";
            }
            if (
              this.caseDetailFoemData.stageName == "受通" ||
              this.caseDetailFoemData.stageName == "已核准" ||
              this.caseDetailFoemData.stageName == "裁定"
            ) {
              this.cdBool = true;
            }
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

            if (
              this.ch_caseTypr === "商标查询" &&
              this.caseDetailFoemData.searchResultList
            ) {
              this.caseDetailFoemData.searchResultList = this.caseDetailFoemData.searchResultList
                .map(item => item.regNumber)
                .join("\n");
            }else{
              this.caseDetailFoemData.searchResultList =[]
            }

            if (this.ch_caseTypr === "转让/移转") {
              this.appTextShow = appTextShowzr;
            }
            if (this.ch_caseTypr === "许可备案") {
              this.appTextShow = appTextShowxk;
            }
            if (this.ch_caseTypr === "异议答辩") {
              this.yyTextShowxk = yydbTextShowxk;
            }
            if (this.ch_caseTypr === "撤三答辩（提供使用证明）" || this.ch_caseTypr === "撤销通用名称答辩") {
              this.yyTextShowxk = yycsTextShowxk;
            }
            if (this.ch_caseTypr === "撤销三年停止使用申请") {
              this.yyTextShowxk = yycssTextShowxk;
            }
            if (this.ch_caseTypr === "参加不予注册复审") {
              this.yyTextShowxk = byzcfsTextShowxk;
            }

            if (
              this.ch_caseTypr === "无效宣告申请" ||
              this.ch_caseTypr === "无效宣告答辩" ||
              this.ch_caseTypr === "不予注册复审" ||
              this.ch_caseTypr === "撤销商标复审" ||
              this.ch_caseTypr === "无效宣告复审" ||
              this.ch_caseTypr === "撤销复审答辩"
            ) {
              this.yyTextShowxk = yyxgTextShowxk;
            }
            if (
              this.ch_caseTypr === "异议" ||
              this.ch_caseTypr === "异议答辩" ||
              this.ch_caseTypr === "无效宣告申请" ||
              this.ch_caseTypr === "无效宣告答辩"
            ) {
              this.showType = true;
              if (this.caseDetailFoemData.respondentNameCn) {
                queryConflicterListUrl({
                  fullname: this.caseDetailFoemData.respondentNameCn,
                  pageSize: 100, pageNo: 1
                }).then(res => {
                  this.selectData.liyiarr = res.data;
                });
              }
            }

            // this.elstepList = [
            //   { title: "案件详情", state: true, id: "ajxq-title" },
            //   { title: "客户信息", state: true, id: "khxx-title" },
            //
            //   {
            //     title: "受让人信息",
            //     state: this.ch_caseTypr === "转让/移转",
            //
            //     id: "srr-title"
            //   },
            //   {
            //     title: "申请人（许可人信息）",
            //     state: this.ch_caseTypr === "许可备案",
            //
            //     id: "srr-title"
            //   },
            //   {
            //     title: "商标信息",
            //     state: this.mainCaseIds.length === 1,
            //     id: "sbxx-title"
            //   },
            //   {
            //     title: "申请人信息",
            //     state:
            //       this.ch_caseTypr === "商标查询" ||
            //       this.ch_caseTypr === "撤回商标申请" ||
            //       this.ch_caseTypr === "补发商标注册证" ||
            //       this.ch_caseTypr === "补发商标变转续证明" ||
            //       this.ch_caseTypr === "撤回商标评审" ||
            //       this.ch_caseTypr === "出具优先权证明文件" ||
            //       this.ch_caseTypr === "异议" ||
            //       this.ch_caseTypr === "异议答辩" ||
            //       this.ch_caseTypr === "出具商标注册证明" ||
            //       this.ch_caseTypr === "商标注销",
            //
            //     id: "srr-title"
            //   },
            //
            //   {
            //     title: "共有人信息",
            //     state: this.ch_caseTypr != "商标查询",
            //     id: "gyrxx-title"
            //   },
            //   {
            //     title: "查询信息",
            //     state: this.ch_caseTypr === "商标查询",
            //     id: "xxxx-title"
            //   },
            //   {
            //     title: "查询结果",
            //     state: this.ch_caseTypr === "商标查询",
            //     id: "xxjgxx-title"
            //   },
            //   {
            //     title: "转让人信息",
            //     state:
            //       this.ch_caseTypr === "转让/移转" ||
            //       this.caseDetailFoemData.changeType === "转让",
            //
            //     id: "zrrxx-title"
            //   },
            //   {
            //     title: "被许可人信息",
            //     state:
            //       this.ch_caseTypr === "许可备案" ||
            //       this.caseDetailFoemData.changeType === "许可" ||
            //       this.ch_caseTypr === "许可备案提前终止",
            //
            //     id: "bxkrxx-title"
            //   },
            //   {
            //     title: "被异议人信息",
            //     state: this.ch_caseTypr === "异议",
            //     id: "byyrxx-title"
            //   },
            //   {
            //     title: "被申请人信息",
            //     state:
            //       this.ch_caseTypr === "无效宣告申请" ||
            //       this.ch_caseTypr === "不予注册复审" ||
            //       this.ch_caseTypr === "撤销商标复审" ||
            //       this.ch_caseTypr === "无效宣告答辩" ||
            //       this.ch_caseTypr === "参加不予注册复审",
            //     id: "byyrxx-title"
            //   },
            //   {
            //     title: "异议人信息",
            //     state: this.ch_caseTypr === "异议答辩",
            //     id: "byyrxx-title"
            //   },
            //   {
            //     title: "被申请人(撤销人)信息",
            //     state: this.ch_caseTypr === "撤三答辩（提供使用证明）",
            //     id: "byyrxx-title"
            //   },
            //   {
            //     title: "被申请人(注册人)信息",
            //     state: this.ch_caseTypr === "撤销三年停止使用申请",
            //     id: "byyrxx-title"
            //   },
            //   {
            //     title: "阿里月报信息",
            //     state: this.caseDetailFoemData.custName.includes('阿里'),
            //     id: "ali-title"
            //   },
            // ].filter(item => item.state);
            this.changeElstepList()
            if (
              this.tmlist.includes(this.ch_caseTypr) &&
              this.$route.query.import !== "1"
            ) {
              this.regNumberList = [
                {
                  regNumber: this.caseDetailFoemData.regNumber
                }
              ];
              // console.log(this.regNumberList, "123");
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
                { wkgId: "", trademarkCaseWorkgroupMembers: [] }
              ];
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
            if (this.caseDetailFoemData.appId) {
              queryAppAddrByAppIdUrl({
                appId: this.caseDetailFoemData.appId
              }).then(res => {
                this.selectData.appaddr = res.data;
              });
            }

            if (this.caseDetailFoemData.imageFile) {
              if(/^tmFile|\/tmFile/.test(this.caseDetailFoemData.imageFile)){
                this.tyimage = `${this.caseDetailFoemData.imageFile}`;
              }else {
                this.tyimage = `/ipdoc${this.caseDetailFoemData.imageFile}`;
              }

            }
            this.getCreatData();
          })
          .catch(err => {
            console.log(err);
          });
      },
      getCrestDataUp () { },
      getCreatData () {
        this.initfilelist();
        // queryMaterialTypeUrl().then(res => {
        //   this.fileName = res.data;
        // });
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
        const classIdString = [1042, 1161, 1162, 1163, 1167, 1174, 1176, 1189, 1120 ,1190].join(',')
        querycustSelectClass({ classId: classIdString }).then(response => {
          if (response.success) {
            this.selectData.apptypelist = response.data["1042"];
            this.brandHierarchyList = response.data['1161']
            this.riskTypeList = response.data['1162']
            this.riskLevelList = response.data['1163']
            this.lawArray = response.data['1167']
            this.wxLawArray = response.data['1176']
            this.goodsVersionList = response.data['1174']
            this.organIdTypeList = response.data['1189']
            this.idCardOptions = response.data['1120']
            this.certTypeOptions = response.data['1190']
          } else {
            this.$message.error(response.message);
          }
        });

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
        this.caseDetailFoemData.custId&&queryAppInfoUrl({ custId: this.caseDetailFoemData.custId, caseTypeId: this.caseDetailFoemData.caseTypeId }).then(
          response => {
            this.selectData.apps = response.data;

            if (
              this.tmlist.includes(this.ch_caseTypr) &&
              this.$route.query.import == "1"
            ) {
              var changeOfNameOrAddressObj = JSON.parse(
                sessionStorage.getItem("changeOfNameOrAddressObj")
              );
              // console.log(changeOfNameOrAddressObj.appObj, "appdata");
              if (
                this.ch_caseTypr == "转让/移转" ||
                this.ch_caseTypr == "许可备案"
              ) {
                this.caseDetailFoemData.transferorCnName =
                  changeOfNameOrAddressObj.appObj.applicantName;
              } else {
                this.caseDetailFoemData.appCnName =
                  changeOfNameOrAddressObj.appObj.applicantName;
              }
            }
          }
        );

        queryOtherCustomerListUrl({ isCollaboration: "1",collaborationStatusArray:[2249,2250]})
          .then(response => {
            this.selectData.hzLists = response.data;
            this.selectData.hzLists.forEach(item=>{
              item.label = item.fullname + (item.fullnameEn ? ` (${item.fullnameEn})` : '')

              // item.id=item.custId
              // item.name=item.fullname
              item.value=item.custId
            })

          })
          .catch(err => {
            console.log(err);
          });

        if (this.caseDetailFoemData.appId) {
          queryAppContactUrl({ appId: this.caseDetailFoemData.appId }).then(
            ite => {
              this.selectData.queryAppContact = ite.data;
            }
          );
        } else {
          this.selectData.queryAppContact = [];
          this.caseDetailFoemData.appContactPerson = "";
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
      getTopPosition (el, active) {
        this.stepActive1 = active;

        document.getElementById(el).scrollIntoView();
        // scrollTo(
        //     document.getElementById("main-container").scrollTop +
        //     document.getElementById(el).getBoundingClientRect().top -
        //     document.getElementsByClassName("fixed-header")[0].offsetHeight -
        //     document.getElementById(el).offsetTop,
        //   300
        // );
      },
      async filingOperation (command) {
        if (command === "prefiling") {
          if(await this.checkGoods()){
            return
          }
          if (this.caseDetailFoemData.replaceAgencyName !== '北京佰舟知识产权代理有限公司' && ['内-内', '外-内'].includes(this.caseDetailFoemData.appFromto) && ['北京万慧达', '北京万慧达律所', '津分万慧达'].includes(this.caseDetailFoemData.whdAgencyName)) {
           if (this.caseDetailFoemData.agentPerson && !this.agentPersonList.includes(this.caseDetailFoemData.agentPerson) || this.caseDetailFoemData.appContactPerson && !this.agentPersonList.includes(this.caseDetailFoemData.appContactPerson)) {
             // this.$message.error('【代理人姓名】或【联系人】不在备案员工范围内')
             // return
           }
          }
          if(!this.$commonUtils.checkBA(this.caseRoleSelectList)){
            this.$message.error('承办律师或客户律师有误！')
            return
          }
          this.submitCaseForm("prefiling", 1, 1);
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
      regnumberchangeMadRid(val,type){
        searchTmUrl({ regNumbers: val, trans: 20,pageSize:100,pageNo:1 }).then(res => {
          if (!res.data ||!res.data.length) {
            return;
          }

          this.caseDetailFoemData.appCnName = res.data[0].applicantName
          this.caseDetailFoemData.appCnAddr = res.data[0].applicantAddress;
          this.caseDetailFoemData.tmName = res.data[0].tmName;
          this.caseDetailFoemData.imageFile = res.data[0].imgFilePath ? ("/tmFile" + res.data[0].imgFilePath) : '';
          this.tyimage=res.data[0].imgFilePath ? ("/tmFile" + res.data[0].imgFilePath) : '';
          if(res.data[0].trademarkCategories.length){
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
            }else {
              this.caseDetailFoemData.goodClasses=res.data[0].tmType
            }

        })
      },
      regnumberchange (val,type) {
        if (["内-内", "外-内"].includes(this.caseDetailFoemData.appFromto)) {
          this.caseDetailFoemData.regNumber = val
          this.caseDetailFoemData.approvalNo = val
          this.changeNumberA(val, 'regNumber')
          this.changeNumberA(val, 'approvalNo')
        }
        // this.changeNumberA(val,'appNumber')
        this.changeNumberA(val, type)
        if(['内-外','外-外'].includes(this.caseDetailFoemData.appFromto)){
          return
        }
        this.$confirm("是否根据商标号更新案件信息？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          console.log('执行！！');
          // delete this.caseDetailFoemData.materials;
          // delete this.caseDetailFoemData.caseEvolve;
          this.caseDetailFoemData.replaceInfo = "1";
          this.caseDetailFoemData.checkInfo = "1";
          this.caseDetailFoemData.regNumberList = val;
          searchTmUrl({ regNumbers: val, trans: 20,pageSize:100,pageNo:1 }).then(res => {
            if (!res.data ||!res.data.length) {
              return;
            }
            if(['注册驳回复审',
              '撤销三年停止使用申请',
              '异议',
              '异议答辩',
              '撤三答辩（提供使用证明）',
              '撤销商标复审',
              '无效宣告复审',
              '不予注册复审',
              '无效宣告申请',
              '参加不予注册复审',
              '撤销复审答辩',
              '无效宣告答辩'].includes(this.ch_caseTypr)){
              this.caseDetailFoemData.parentAppDate = res.data[0].appDate
            }
            if(this.caseDetailFoemData.caseType == '撤回撤销三年不使用注册商标'){
              this.caseDetailFoemData.respondentNameCn = res.data[0].applicantName;
              // this.caseDetailFoemData.respondentNameEn= res.data[0].applicantEnName
            }
            if (["转让/移转","异议","撤销三年停止使用申请","无效宣告申请"].includes(this.ch_caseTypr)) {
              if(this.ch_caseTypr=="转让/移转"){
                this.caseDetailFoemData.transferorCnName=res.data[0].applicantName;
                if (this.selectData.apps && this.selectData.apps.map(item=>item.applicantName).includes(res.data[0].applicantName)){
                  this.tranappselectChange(this.caseDetailFoemData.transferorCnName)
                }else {
                  this.caseDetailFoemData.transferorEnName = res.data[0].applicantEnName;
                  this.caseDetailFoemData.transferorCnName = res.data[0].applicantName;
                  this.caseDetailFoemData.transferorType = res.data[0].appType;
                  this.caseDetailFoemData.transferorNationality = res.data[0].sendType;
                  this.caseDetailFoemData.transferorCnAdress = res.data[0].applicantAddress;
                  this.caseDetailFoemData.transferorEnAdress = res.data[0].applicantEnAddress;
                  this.caseDetailFoemData.transferorCountryAndregion = res.data[0].country;
                  this.caseDetailFoemData.zrCertCode = res.data[0].certCode;
                }
              }else {

                this.caseDetailFoemData.respondentNameCn = res.data[0].applicantName;
                this.caseDetailFoemData.respondentNameEn= res.data[0].applicantEnName
                // respondentNameEn   respondentAddrCn
                this.caseDetailFoemData.respondentAddrCn = res.data[0].applicantAddress;
                this.caseDetailFoemData.respondentAddrEn=  res.data[0].applicantEnAddress

                // this.caseDetailFoemData.respondentNameCn = res.data[0].applicantName;
              }
            } else if(this.ch_caseTypr == '撤销商标复审' || this.ch_caseTypr == '无效宣告复审'){
              this.$confirm("商标权利人是撤销申请人吗？", "提示", {
                distinguishCancelAndClose: true,
                confirmButtonText: "是",
                cancelButtonText: "否",
                type: "warning"
              }).then(() => {
                this.caseDetailFoemData.appCnName = res.data[0].applicantName;
              }).catch((err)=>{
                if(err=='cancel'){
                  this.caseDetailFoemData.respondentNameCn = res.data[0].applicantName;
                }
              })
            } else if(this.ch_caseTypr == '异议答辩'){
                this.caseDetailFoemData.appCnName = res.data[0].applicantName;
                this.caseDetailFoemData.opponents = res.data.map(item => ({
                  nameCn: item.applicantName,
                  nameEn: item.applicantEnName,
                  tmCaseId: this.caseDetailFoemData.tmCaseId,
                  caseId: this.caseDetailFoemData.caseId,
                }))
                this.$nextTick( ()=> {
                  if (this.selectData.apps && this.selectData.apps.length > 0) {
                    this.appselectChange( this.caseDetailFoemData.appCnName ,res.data[0].applicantAddress);
                  }
                });
            }else{
              this.caseDetailFoemData.appCnName = res.data[0].applicantName;
              this.$nextTick( ()=> {
                if (this.selectData.apps && this.selectData.apps.length > 0) {
                  this.appselectChange( this.caseDetailFoemData.appCnName ,res.data[0].applicantAddress);
                }
              });
            }
            this.caseDetailFoemData.respondentAgency=res.data[0].agent
            this.caseDetailFoemData.tmName = res.data[0].tmName;
            // this.caseDetailFoemData.regNumber = res.data[0].regNumber;
            this.caseDetailFoemData.validStartDate = res.data[0].validStartDate;
            this.caseDetailFoemData.validEndDate = res.data[0].validEndDate;
            this.caseDetailFoemData.regDate = res.data[0].regNoticeDate;
            this.caseDetailFoemData.approvalDate=res.data[0].approvalDate;
            this.caseDetailFoemData.approvalNumber=res.data[0].approvalNumber;
            // this.caseDetailFoemData.appDate = res[0].data.appDate;
            this.caseDetailFoemData.tmType =
              res.data[0].classify === "证明"
                ? "3"
                : res.data[0].classify === "集体"
                ? "2"
                : "1";
            this.caseDetailFoemData.imageFile =
              res.data[0].imgFilePath ? ("/tmFile" + res.data[0].imgFilePath) : '';
            this.tyimage=res.data[0].imgFilePath ? ("/tmFile" + res.data[0].imgFilePath) : '';
            this.caseDetailFoemData.ifSolidTm =
              res.data[0].ifSolidTm == "是" ? "1" : "0";
            this.caseDetailFoemData.assignColor = res.data[0].colorDesc==='是'? true : false;
            this.caseDetailFoemData.tmVoice = res.data[0].tmForm
              ? res.data[0].tmForm === "文字"
                ? "0"
                : "1"
              : "0";
            this.caseDetailFoemData.colorSign = "0";
            // this.caseDetailFoemData.tmIdList = info.map(item => item.tmId);
            if(res.data[0].trademarkCategories.length){
              this.caseDetailFoemData.goods = this.getLanglist(
                res.data.map(item => item.trademarkCategories).filter(item => item)
              ).map(item => ({
                goodClass: item.tmType,
                goodEnName: item.enName,
                goodName: item.name,
                id: item.id,
                similarGroup: item.tmGroup
              }));
              if( ["内-内", "外-内"].includes(this.caseDetailFoemData.appFromto) &&
              this.caseDetailFoemData.caseType == "许可备案" &&
              this.caseDetailFoemData.submitType == "线下申请"){
                this.caseDetailFoemData.goods = [
                  {
                    goodClass: '',
                    goodEnName: '',
                    goodName: '全部',
                    id: '',
                    similarGroup: '',
                  }
                ]
            }else{
              this.caseDetailFoemData.goods = this.getLanglist(
                res.data.map(item => item.trademarkCategories).filter(item => item)
              ).map(item => ({
                goodClass: item.tmType,
                goodEnName: item.enName,
                goodName: item.name,
                id: item.id,
                similarGroup: item.tmGroup
              }));
            }
              // this.caseDetailFoemData.goodClasses = [
              //   ...new Set(
              //     this.caseDetailFoemData.goods.map(item => item.goodClass)
              //   )
              // ].join(";");
              this.caseDetailFoemData.goodClasses = [
                ...new Set(
                  this.getLanglist(
                    res.data.map(item => item.trademarkCategories).filter(item => item)
                  ).map(item => item.tmType)
                )
              ].join(";")
              console.log(this.caseDetailFoemData.goodClasses,'this.caseDetailFoemData.goodClasses');
            }else {
              this.caseDetailFoemData.goodClasses=res.data[0].tmType
            }

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
      //检查申请人中文名称空格
      async checkSpaces(){
        return new Promise((resolve, reject) => {
          if ((this.caseDetailFoemData.appFromto == '内-内'||this.caseDetailFoemData.appFromto == '外-内')&&this.caseDetailFoemData.submitType == '网上申请' && this.caseDetailFoemData.appCnName) {
            const regex = /[\s\u3000]/g;
            if (regex.test(this.caseDetailFoemData.appCnName)) {
              MessageBox.confirm('网上申请限制申请人中文名称不能有空格，是否去除？', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
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
      async submitCaseForm (forwordType, checkCase = 1, checkChongTu = 1) {
        console.log('submitCaseForm1222222');
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
           // this.$message.error('【代理人姓名】或【联系人】不在备案员工范围内')
           // return
         }
        }
        if(!this.$commonUtils.checkBA(this.caseRoleSelectList)){
          this.$message.error('承办律师或客户律师有误！')
          return
        }
        // if((this.caseDetailFoemData.caseType == '注册驳回复审' || this.caseDetailFoemData.caseType == '国际注册驳回复审')&&this.caseDetailFoemData.isChangeName == 0){
        //   // this.caseDetailFoemData.isChangeName = undefined
        //   // this.caseDetailFoemData.preChangeAppCnName = ''
        // }
        if (
          (this.ch_caseTypr === "许可备案" || this.ch_caseTypr === "转让/移转") &&
          this.$route.query.import == "1"
        ) {
          var changeOfNameOrAddressObj = JSON.parse(
            sessionStorage.getItem("changeOfNameOrAddressObj")
          );
          this.caseDetailFoemData.regNumberList = changeOfNameOrAddressObj.multipleSelection.map(
            item => item.regNumber
          );
        }
        if (
          this.ch_caseTypr === "商标查询" &&
          this.caseDetailFoemData.searchResultList
        ) {
          if(Object.prototype.toString.call(this.caseDetailFoemData.searchResultList).includes("String")) {
            this.caseDetailFoemData.searchResultList = this.caseDetailFoemData.searchResultList
              .split("\n")
              .map(item => {
                return {regNumber: item};
              });
          }
        } else {
          this.caseDetailFoemData.searchResultList = [];
        }
        // this.caseDetailFoemData.caseIds = this.caseDetailFoemData.caseId;
        delete this.caseDetailFoemData.materials;
        // delete this.caseDetailFoemData.caseEvolve;
        // delete this.caseDetailFoemData.tmList;
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
          this.tmlist.includes(this.ch_caseTypr)
        ) {
          delete this.caseDetailFoemData.imageFile;
          const sessionObj = JSON.parse(
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
          if (this.ch_caseTypr === "变名变址") {
            data2.appNameList = [
              {
                id: sessionObj.appObj.appId,
                cn: this.$refs.changeOfNameAndAddress.tmObj.applicantName
              }
            ];
            data2.appAddressList = this.$refs.changeOfNameAndAddress.defaultbeforeAddress.map(
              (item, index) => {
                return {
                  id: item.addrId,
                  cn: this.$refs.changeOfNameAndAddress.beforeAddress[index]
                    .addressCn
                };
              }
            );
            data2.preAppId = sessionObj.appObj.appId;
          }
          data2.isBatch = "1";
        }
        if (
          this.$route.query.import != "1" &&
          this.tmlist.includes(this.ch_caseTypr)
        ) {
          var data2 = {
            regNumberList: [this.caseDetailFoemData.regNumber],
            taskId: this.caseDetailFoemData.taskId
          };

          if (this.ch_caseTypr === "变名变址") {
            data2.appNameList = [
              {
                id: this.$refs.changeOfNameAndAddress.tmObj.preAppId,
                cn: this.$refs.changeOfNameAndAddress.tmObj.applicantName
              }
            ];
            data2.appAddressList = [
              {
                id: this.$refs.changeOfNameAndAddress.tmObj.preAddrId,
                cn: this.$refs.changeOfNameAndAddress.tmObj.addressCn
              }
            ];
          }
          data2.isBatch = "0";
        }
        if (this.ch_caseTypr === "变名变址") {
          // delete data.preChangeCnName;
          // delete data.preChangeEnName;
          // delete data.preChangeCnAdress;
          // delete data.preChangeEnAdress;
          var data = Object.assign(
            {},
            this.getChangedata(),
            this.$refs.changeOfNameAndAddress.tmObj,
            data2
          );
        } else if (
          this.tmlist
            .filter(item => item !== "变名变址")
            .includes(this.ch_caseTypr)
        ) {
          var data = Object.assign({},  this.getChangedata(), data2);
        } else {
          var data = Object.assign({},  this.getChangedata());
        }
        data.checkCase = checkCase;
        data.checkChongTu = checkChongTu;
        // if(this.caseDetailFoemData.submitType==='网上申请'){
        //   this.rules.applicationMarks[0].required=true
        // } else {
        //   this.rules.applicationMarks[0].required=false
        // }
        this.postFormFlag=false
        await this.$nextTick()
        this.postFormFlag=true
        await this.$nextTick()
        // console.log(this.caseDetailFoemData.regNumber, "shangbiaohao!");
        let flag = this.caseDetailFoemData.agentNum.includes('NO')
        if (!flag) {
          if (this.caseDetailFoemData.submitType == "网上申请" && ['内-内', '外-内'].includes(this.caseDetailFoemData.appFromto)) {
          let msg1 = '请上传申请人'
          // if (this.ch_caseTypr==='撤销三年停止使用申请') {
          //   msg1 = '请上传申请人'
          // } else {
          //   msg1 = '请上传受让人'
          // }
            if (['注册驳回复审','国际注册驳回复审'].includes(this.ch_caseTypr) && this.caseDetailFoemData.isChangeName) {
              if (!this.fileName[1032]) {
                this.$message.error(`请上传${this.caseDetailFoemData.isChangeName == 1 ? '名义变更证明' : this.caseDetailFoemData.isChangeName == 2 ? '变更代表人申请' : '相关材料'}`);
                return;
              }
            }
            if (this.ch_caseTypr==='国际注册驳回复审') {
              if (!this.fileName[301600]) {
                this.$message.error("请上传评审网申国际商标需上传材料");
                return;
              }
            }
          if (
            this.caseDetailFoemData.legalNature == "自然人" &&
            this.caseDetailFoemData.uploadFileLanguage == "外文"
          ) {
            if (!this.fileName[1002]) {
              this.$message.error(`${msg1}身份证明文件(外文)`);
              return;
            }
          }
          if (
            this.caseDetailFoemData.legalNature == "自然人" &&
            this.caseDetailFoemData.uploadFileLanguage == "中文"
          ) {
            if (!this.fileName[1001]) {
              this.$message.error(`${msg1}身份证明文件(中文)`);
              return;
            }
          }
          if (
            this.caseDetailFoemData.legalNature != "自然人" &&
            this.caseDetailFoemData.uploadFileLanguage == "外文"
          ) {
            if (!this.fileName[1004] && this.ch_caseTypr!=='注册驳回复审'&& this.ch_caseTypr!=='无效宣告申请' ) {
              this.$message.error(`${msg1}主体资格证明文件(外文)`);
              return;
            }
          }
          if (
            this.caseDetailFoemData.legalNature != "自然人" &&
            this.caseDetailFoemData.uploadFileLanguage == "中文"
          ) {
            if (!this.fileName[1003] && this.ch_caseTypr!=='注册驳回复审' && this.ch_caseTypr!=='无效宣告申请') {
              this.$message.error(`${msg1}主体资格证明文件`);
              return;
            }
          }
          if (this.ch_caseTypr==='无效宣告申请') {
            if (!this.fileName[1000]) {
              this.$message.error("请上传委托书文件");
              return;
            }
            if (!this.fileName[1003]) {
              this.$message.error("请上传主体资格证明（中文+原文）文件");
              return;
            }
            if (!this.fileName[327]) {
              this.$message.error("请上传事实理由文件");
              return;
            }
            if (!this.caseDetailFoemData.lawList.length) {
              this.$message.error("请选择法律条款");
              return;
            }
            if (this.caseDetailFoemData.lawList && (this.caseDetailFoemData.lawList.includes('《商标法》第三十条') || this.caseDetailFoemData.lawList.includes('《商标法》第三十一条')) && (!this.caseDetailFoemData.quotes || this.caseDetailFoemData.quotes && !this.caseDetailFoemData.quotes.filter(i => i.quoteRegNumber).length)) {
              this.$message.error("请添加引证商标信息");
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
          if (this.ch_caseTypr == "商标注册") {
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
          }
          if (
            this.ch_caseTypr != "商标续展" &&
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
          if (
            this.ch_caseTypr == "商标注册" ||
            this.ch_caseTypr == "续展" ||
            this.ch_caseTypr == "变名变址"
          ) {
            if (!this.caseDetailFoemData.appCertFileIsCn) {
              this.$message.error("请选择证明文件是否为中文");
              return;
            }
          }
        }
          if(this.caseDetailFoemData.caseType=='行政复议'&&!this.caseDetailFoemData.reissueType){
          this.$message.error("请选择不予的案件类型");
          return;
        }
        if(this.caseDetailFoemData.ifShareTm=='1'&&!this.caseDetailFoemData.joinApps.filter(item=>item.type!=4).length){
          this.$message.error("请添加共同申请人");
          return;
        }
        if(this.ch_caseTypr == '异议答辩' && this.caseDetailFoemData.opponents && !this.caseDetailFoemData.opponents.length){
          this.$message.error("异议人名称不能为空");
          return;
        }
        if(this.ch_caseTypr == '异议' && this.caseDetailFoemData.subBusinessSecrets && !this.caseDetailFoemData.quotedOthersMaterial && !this.fileName[301677]){
          this.$message.error("请上传涉商业机密证据材料");
          return;
        }
        if(this.ch_caseTypr == '异议' && this.caseDetailFoemData.subBusinessSecrets && !this.caseDetailFoemData.quotedOthersMaterial && !this.fileName[1020]){
          this.$message.error("请上传其他说明文件");
          return;
        }
        if (this.ch_caseTypr == '无效宣告申请' && this.caseDetailFoemData.justNegativeAgre == 0 && !this.fileName[301677] ) {
          this.$message.error("请上传涉密证据材料");
          return;
        }

        if(!this.caseDetailFoemData.caseCustRespUserArray ||
           !this.caseDetailFoemData.caseCustRespUserArray.length){
          this.$message.error('请选择客户负责人')
          return false
        }
        }
        this.$refs["postForm"].validate(async valid => {
          if (flag||valid) {
            const not = '案件的注册日期为自动抓取的首次注册公告日期，请务必通过商标网（G开头商标号的国际注册通过WIPO官网）确认被撤销商标是否经过异议流程以免因不满三年不予受理。'
            if (forwordType === "prefiling" && this.ch_caseTypr === "撤销三年停止使用申请" && !await this.$confirm(not,
              '提示',
              {
                // distinguishCancelAndClose:true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).then(() => {
              return true
            }).catch((action) => {
              return false
              // if(action === 'cancel') {
              //   return false
              // }else{
              //   return true
              // }
            })) return
            data.replaceInfo = "";
            // 冲突检查
            if (await this.chongtuTestFunc(checkChongTu)) return ;
            // 不简查
            // delete data.checkChongTu
            forwordType === "prefiling" && checkCase && await this.delAllGoodsJudge(data)

            if (this.$route.query.operate==='many') {
              console.log("operate==='many'");
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
            data ={...data,importByCase:this.$route.query.importByCase,piliang:this.$route.query.importByCase}

            if (this.caseDetailFoemData.appGJdq=='中国') {
              //获取省/市/区名称并通过#拼接，如果没有某一个值就不要#拼接
              const province = this.provinceList.find(item => item.regionCode == this.address.province) || {}
              const city = this.cityList.find(item => item.regionCode == this.address.city) || {}
              const district = this.districtList.find(item => item.regionCode == this.address.district) || {}
              data.appRegionalism = `${province.abbrName}${city.abbrName?`#${city.abbrName}`:''}${district.abbrName?`#${district.abbrName}`:''}`
            }else{
              data.appRegionalism = ''
            }
            if (this.caseDetailFoemData.transferorNationality=='中国') {
              //获取省/市/区名称并通过#拼接，如果没有某一个值就不要#拼接
              const province = this.tfProvinceList.find(item => item.regionCode == this.transferorAddress.province) || {}
              const city = this.tfCityList.find(item => item.regionCode == this.transferorAddress.city) || {}
              const district = this.tfDistrictList.find(item => item.regionCode == this.transferorAddress.district) || {}
              data.provinceOrCity = `${province.abbrName || ''}${city.abbrName?`#${city.abbrName}`:''}${district.abbrName?`#${district.abbrName}`:''}`
            }else{
              data.provinceOrCity = ''
            }
            saveCaseInfoUrl(data)
              .then(async response => {
                if (response.success) {
                  if (response.messageType == "-6") {
                    this.$confirm(response.message + "是否继保存", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning"
                    }).then(() => {
                      this.submitCaseForm(forwordType, 0, checkChongTu);
                    });
                  }
                  else if (response.messageType == "10") {
                    this.checkChongTuSet(response.data, "sive", forwordType);
                  }
                  else {
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
                    }
                    else {
                      this.$message.success("保存成功！");
                      this.addConflicter();
                      // clearTimeout(this.timeout);
                      // this.timeout = setTimeout(() => {
                      //   this.$router.go(0);
                      // }, 1000 * Math.random());
                      this.goNext();
                    }
                  }
                }
              })
              .catch(err => { });
          } else {
            this.$message.error("请填写必填项");
            return false;
          }
        });
      },
      getfileData (materialTypeId, e, showFileList) {
        this.onlyJpg = false
        this.oneFile = false
        if (this.ch_caseTypr == '注册驳回复审' && this.caseDetailFoemData.isChangeName && materialTypeId == "1032" && this.caseDetailFoemData.submitType == "网上申请") {
          this.oneFile = true
        }
        if (materialTypeId == "1000") {
          this.multipleFileList = this.wtsfileList;
        }
        if (materialTypeId == "1022") {
          this.multipleFileList = this.wtsfileListzr;
        }
        if (materialTypeId == "327" && showFileList) {
          this.oneFile = true
          this.multipleFileList = this.lyfileList;
        }
        if (materialTypeId == "1020" && showFileList) {
          this.oneFile = true
          this.multipleFileList = this.xgsmfileList;
        }
        if (materialTypeId == "326" && showFileList) {
          this.oneFile = true
          this.multipleFileList = this.clmlfileList;
        }
        if (materialTypeId == "322" && showFileList) {
          this.oneFile = true
          this.multipleFileList = this.zjclfileList;
        }
        if (materialTypeId == "301535" && showFileList) {
          if (this.caseDetailFoemData.isDivision !== 1) {
            return this.$message.warning("是否分割不能为否");
          }
          this.oneFile = true
          this.multipleFileList = this.fgsqfileList;
        }
        if (materialTypeId == "1000" && this.caseDetailFoemData.submitType == "网上申请") {
          this.onlyJpg = true
        }
        if (["1003", "1004", "1039", "1040", "327", "326", "300012", "1020"].includes(materialTypeId) && this.caseDetailFoemData.submitType == "网上申请") {
          this.oneFile = true
        }
        this.curUploadTitle = e.target.offsetParent.previousSibling.innerText.replace(
          /[:*]/g,
          ""
        );
        let data = {
          caseIds: this.mainCaseIds,
          custId: this.caseDetailFoemData.custId,
          type: "2",
          caseId: this.caseDetailFoemData.caseId,
          materialTypeId: materialTypeId,
          applicantId: this.caseDetailFoemData.appId
            ? this.caseDetailFoemData.appId
            : "",
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
      checkChongTuSet (chongData, type, forwordType) {
        this.gridData = chongData.length > 500 ?chongData.splice(0, 500) : chongData;
        this.chongtuType = type;
        this.chongtuForwordType = forwordType;
        this.dialogcheckChongTuVisible = true;
      },
      dialogcheckChongTuBtn () {
        // if (this.chongtuType == "sive") {
        //   this.submitCaseForm(this.chongtuForwordType, 0, 0);
        // } else {
        //   this.creatCaseForm(0, 0);
        // }
        tijiao({
          taskId: this.caseDetailFoemData.taskId
        }).then(async res => {
          this.$message.success('提交成功!')
          await this.updateCtAudit()
          this.dialogcheckChongTuVisible = false;
        })
      },
      async updateCtAudit(){
        // this.$router.go(0)
        // this.$router.go(-2)
        this.goNext()
        // queryCaseInfoUrl({ caseIds: this.mainCaseIds }).then(response => {
        //   this.$set(this.caseDetailFoemData, 'ctAudit', response.data.ctAudit)
        //   this.$set(this.caseDetailFoemData, 'taskId', response.data.taskId)
        // })
      },
      addConflicter () {
        if (
          this.ch_caseTypr === "撤销三年停止使用申请" ||
          this.ch_caseTypr === "异议" ||
          this.ch_caseTypr === "异议答辩" ||
          this.ch_caseTypr === "无效宣告申请" ||
          this.ch_caseTypr === "无效宣告答辩" ||
          this.ch_caseTypr === "无效宣告申请" ||
          this.ch_caseTypr === "无效宣告答辩" ||
          this.ch_caseTypr === "不予注册复审" ||
          this.ch_caseTypr === "无效宣告复审" ||
          this.ch_caseTypr === "撤销商标复审"
        ) {
          if (this.caseDetailFoemData.respondentNameCn) {
            addConflicterUrl({
              custId: this.caseDetailFoemData.custId,
              fullname: this.caseDetailFoemData.respondentNameCn,
              address: this.caseDetailFoemData.respondentAddrCn,
              fullnameEn:this.caseDetailFoemData.respondentNameEn,
              addressEn: this.caseDetailFoemData.respondentAddrEn
            });
          }
        }
      },
      fileData (joinAppId, getFileIsEn) {
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
      searchTm () {
        if (this.caseDetailFoemData.searchResultList == "") {
          this.$message.error("请正确填写需要查询的商标号");
          return;
        }
        let listQuery = {};
        listQuery.export = "";
        listQuery.columns = "";
        listQuery.regNumbers = this.caseDetailFoemData.searchResultList
          .split("\n")
          .join(",");
        listQuery.trans = "1";
        listQuery.status = "";
        listQuery.pageSize=100;
        listQuery.pageNo=1
        searchTmUrl(listQuery).then(response => {
          this.caseDetailFoemData.tmList = response.data;
        });
      },
      dcbtn () {
        let listQuery = {};
        listQuery.export = "1";

        listQuery.regNumbers = this.caseDetailFoemData.searchResultList
          .split("\n")
          .join(",");
        listQuery.trans = "1";
        listQuery.status = "";
        listQuery.columns = this.dcvalue.join(",");
        listQuery.pageSize=100
        listQuery.pageNo=1
        this.dialogVisibledctm = false;

        searchTmUrl(listQuery).then(response => {
          var a = document.createElement("a");
          a.setAttribute("href", "/ipdoc" + response.data.exportFilePath);
          a.setAttribute("id", "zipDownLoad");
          if (document.getElementById("zipDownLoad")) {
            document.body.removeChild(document.getElementById("zipDownLoad"));
          }
          document.body.appendChild(a);
          a.click();
        });
      },
      deleteFile ({ materialTypeId, materialId }) {
        if(!this.materialArray.find(item => item.materialTypeId == materialTypeId)&&materialTypeId==1018){
          this.caseDetailFoemData.imageFile= '0000'
          this.tyimage=''
          return
        }
        let delmaterialId;
        if (!materialId) {
          delmaterialId = this.materialArray.find(
            item => item.materialTypeId == materialTypeId
          ).materialId;
        } else {
          delmaterialId = materialId;
        }

        delCaseMaterialUrl({
          caseIdArray: this.mainCaseIds,
          materialId: delmaterialId
        }).then(res => {
          this.fileName[materialTypeId] = "";
          if(materialTypeId==1018){
            this.caseDetailFoemData.imageFile='0000'
            this.tyimage=''
          }
          if(materialId){
            if (materialTypeId == "1000") {
              this.wtsfileList.splice(
                this.wtsfileList.map(item => item.materialId).indexOf(materialId),
                1
              );
            }
            if (materialTypeId == "327") {
              this.lyfileList.splice(
                this.lyfileList.map(item => item.materialId).indexOf(materialId),
                1
              );
            }
            if (materialTypeId == "1020") {
              this.xgsmfileList.splice(
                this.xgsmfileList.map(item => item.materialId).indexOf(materialId),
                1
              );
            }
            if (materialTypeId == "301535") {
              this.fgsqfileList.splice(
                this.fgsqfileList.map(item => item.materialId).indexOf(materialId),
                1
              );
            }
            if (materialTypeId == "326") {
              this.clmlfileList.splice(
                this.clmlfileList.map(item => item.materialId).indexOf(materialId),
                1
              );
              console.log(this.clmlfileList,'@@')
            }
            if (materialTypeId == "322") {
              this.zjclfileList.splice(
                this.zjclfileList.map(item => item.materialId).indexOf(materialId),
                1
              );
            }
            if (materialTypeId == "1022") {
              this.wtsfileListzr.splice(
                this.wtsfileList.map(item => item.materialId).indexOf(materialId),
                1
              );
            }
          }
          // if (!materialId) {
          //   this.fileName[materialTypeId] = "";
          //   if(materialTypeId==1018){
          //     this.caseDetailFoemData.imageFile='0000'
          //     this.tyimage=''
          //   }
          // } else {
          //
          // }
        });
      },
      analysisFileFunc(materialId, id){
        analysisFile({
          caseId: this.caseDetailFoemData.caseId,
          materialId
        }).then(res => {
          if (id == 301603) {
            // this.yyFileSumSize = res.data.yyFileSumSize
            // this.$set(this.submitData, 'demurCaseLaws', res.data.trademarkDemurCaseLawList || [])
            this.caseDetailFoemData.yyzjFileSize = res.data.yyzjFileSize
            this.caseDetailFoemData.demurCaseLaws = res.data.trademarkDemurCaseLawList || []
          } else if (id == 301606) {
            this.caseDetailFoemData.yybcFileSize = res.data.yybcFileSize
            this.$set(this.caseDetailFoemData, 'demurCaseLawBCs' , res.data.trademarkDemurCaseLawList || [])
          }
        })
      },
      getResponseAndFile (data) {
        let { response, file } = data;
        if(!response.data[0].materialId)return;
        if (response.data.length == "1") {
          if (this.dialogFormjoin) {
              this.$set(this.joinFormData, 'fileName', [response.data[0].materialName])
            }
          if (
            this.materialArray.find(
              item => item.materialTypeId == response.data[0].materialTypeId
            )&&(response.data[0].materialTypeId != "1000"&&response.data[0].materialTypeId != "1022")
          ) {
            for (var key in response.data[0]) {
              this.materialArray.find(
                item => item.materialTypeId == response.data[0].materialTypeId
              )[key] = response.data[0][key];
            }
          } else {
            this.materialArray.push(response.data[0]);
          }
          if (file) {
            // this.fileName[response.data[0].materialTypeId] = file.name;
            this.$set(this.fileName, response.data[0].materialTypeId, file.name)
          } else {
            // this.fileName[response.data[0].materialTypeId] = response.data[0].materialName
            this.$set(this.fileName, response.data[0].materialTypeId, response.data[0].materialName)
          }
          if (response.data[0].materialTypeId == "301603" || response.data[0].materialTypeId == "301606") {
            this.analysisFileFunc(response.data[0].materialId, response.data[0].materialTypeId)
          }
          if (response.data[0].materialTypeId == "1000") {
            response.data[0].name = response.data[0].materialName;
            this.wtsfileList.push(response.data[0]);
          }
          if (response.data[0].materialTypeId == "327") {
            response.data[0].name = response.data[0].materialName;
            this.lyfileList.push(response.data[0]);
          }
          if (response.data[0].materialTypeId == "1020") {
            response.data[0].name = response.data[0].materialName;
            this.xgsmfileList.push(response.data[0]);
          }
          if (response.data[0].materialTypeId == "301535") {
            response.data[0].name = response.data[0].materialName;
            this.fgsqfileList.push(response.data[0]);
          }
          if (response.data[0].materialTypeId == "326") {
            response.data[0].name = response.data[0].materialName;
            this.clmlfileList.push(response.data[0]);
          }
          if (response.data[0].materialTypeId == "322") {
            response.data[0].name = response.data[0].materialName;
            this.zjclfileList.push(response.data[0]);
          }
          if (response.data[0].materialTypeId == "1022") {
            response.data[0].name = response.data[0].materialName;
            this.wtsfileListzr.push(response.data[0]);
          }
          if (response.data[0].materialTypeId == "1018") {
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
      fileUploadSuccess (response, file, fileList, index) {
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
            // console.log(this.caseDetailFoemData.joinApps);
          }
        }
      },
      brforeRemoveFile (file, fileList) {
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
          // this.message.success(res.message);
          this.wtsfileList = this.wtsfileList.filter(
            item => item.materialId != delmaterialId
          );
          this.lyfileList = this.lyfileList.filter(
            item => item.materialId != delmaterialId
          );
          this.xgsmfileList = this.xgsmfileList.filter(
            item => item.materialId != delmaterialId
          );
          this.fgsqfileList = this.fgsqfileList.filter(
            item => item.materialId != delmaterialId
          );
          this.clmlfileList = this.clmlfileList.filter(
            item => item.materialId != delmaterialId
          );
          this.zjclfileList = this.zjclfileList.filter(
            item => item.materialId != delmaterialId
          );
          this.wtsfileListzr = this.wtsfileListzr.filter(
            item => item.materialId != delmaterialId
          );

        });
      },
      remotepaternalUnit (val) {
        // 空的、长度为1、数字拦截
        if(!val || val.length == 1 || !isNaN(+val))return;
        queryConflicterListUrl({ fullname: val, pageSize: 100, pageNo: 1 }).then(res => {
          this.selectData.liyiarr = res.data;
        });
      },
      appselectChange (app, applicantAddress,applicantEnAddress) {

        var e = {};
        if(this.appId){
          this.appId=null
          return;
        }else {
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
        // console.log(e, "jin ru ");

        this.caseDetailFoemData.appId = e.appId;
        this.caseDetailFoemData.appEnName = e.applicantEnName;
        this.caseDetailFoemData.legalNature = e.appType;
        this.caseDetailFoemData.appGJdq = e.sendType;
        if(applicantAddress){
          this.caseDetailFoemData.appCnAddr = applicantAddress;
          this.caseDetailFoemData.appEnAddr = applicantEnAddress;
        }else {
          this.caseDetailFoemData.appCnAddr = e.applicantAddress;
          this.caseDetailFoemData.appEnAddr = e.applicantEnAddress;
        }
        this.caseDetailFoemData.appCountryOrRegion = e.country;
        this.caseDetailFoemData.certCode = e.certCode;
        this.caseDetailFoemData.appCertificateNum = e.cardNumber;
        this.caseDetailFoemData.appCertificate = e.cardName;

        if (e.appId) {
          // applicantName:''
          queryAppContactUrl({ appId: e.appId }).then(ite => {
            this.selectData.queryAppContact = ite.data;
          });
          queryAppAddrByAppIdUrl({ appId: e.appId }).then(res => {
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
      remotepinput (query, cb) {
        //this.clearTmMessage();
        // console.log(query, "target.value");

        var restaurants = this.selectData.apps.map(ite => {
          if (ite.applicantName) {
            ite.value=ite.applicantName
            return ite;
          } else {
            ite.value=''
            return ite;
          }
        });
        var results = query
          ? restaurants.filter(this.createStateFilter(query))
          : restaurants;

        cb(results);
      },
      createStateFilter (queryString) {
        return state => {
          return (
            state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
          );
        };
      },
      clearTmMessage () {
        this.tyimage = "";
        this.caseDetailFoemData.respondentAgency=''
        this.caseDetailFoemData.goodClasses = "";
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
      workGroup (work) {
        this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers =
          work.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers;
        this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers =
          work.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers;
        this.caseDetailFoemData.trademarkCaseCBWorkgroups =
          work.trademarkCaseCBWorkgroups;
        // console.log(111);
      },

      lytranappselectChange (respondentNameCn) {
        var e = this.selectData.liyiarr.find(
          ite => ite.fullname == respondentNameCn
        );
        // console.log(e, "shuchu");
        // this.caseDetailFoemData.transferorCnName = e.applicantName;
        this.caseDetailFoemData.respondentNameEn = e.fullnameEn;
        this.caseDetailFoemData.respondentAddrCn = e.address;
        this.caseDetailFoemData.respondentAddrEn = e.addressEn;
      },
      tranappselectChange (applicantName) {
        var e = {};

        this.selectData.apps.forEach(ite => {
          if (ite.applicantName == applicantName) {
            e = ite;
            return;
          }
        });

        this.caseDetailFoemData.transferorEnName = e.applicantEnName;
        this.caseDetailFoemData.transferorCnName = e.applicantName;
        this.caseDetailFoemData.transferorType = e.appType;
        this.caseDetailFoemData.transferorNationality = e.sendType;
        this.caseDetailFoemData.transferorCnAdress = e.applicantAddress;
        this.caseDetailFoemData.transferorEnAdress = e.applicantEnAddress;
        this.caseDetailFoemData.transferorCountryAndregion = e.country;
        this.caseDetailFoemData.zrCertCode = e.certCode;
      },
      wfAgentChange (id) {
        if (id) {
          queryCustomerUrl({ customerID: id }).then(res => {
            this.selectData.customerContactswf = res.data.customerContacts;
            this.selectData.customerAddrs = res.data.customerAddrs;
            this.selectData.customerAddrs = this.selectData.customerAddrs.filter(i => i.addressCn || i.addressEn);
            this.caseDetailFoemData.agencyCustAddrId = "";
            this.caseDetailFoemData.agencyCustContactId = "";
          });
        }
      },
      contactSelectChange (item) {
        var e = {};
        this.selectData.queryAppContact.forEach(ite => {
          if (ite.nameCn == item) {
            e = ite;
            return;
          }
        });
        this.caseDetailFoemData.appContactZip = e.post;
        this.caseDetailFoemData.appContactTel = e.telphone;
        this.caseDetailFoemData.appContactEmail = e.email;
      },
      initfilelist () {
        this.caseDetailFoemData.materials.forEach(ite => {
          this.fileName[ite.materialTypeId] = ite.materialName;
          if (ite.materialTypeId == "1000") {
            this.wtsfileList.push(ite);
          }
          if (ite.materialTypeId == "327") {
            this.lyfileList.push(ite);
          }
          if (ite.materialTypeId == "1020") {
            this.xgsmfileList.push(ite);
          }
          if (ite.materialTypeId == "301535") {
            this.fgsqfileList.push(ite);
          }
          if (ite.materialTypeId == "326") {
            this.clmlfileList.push(ite);
          }
          if (ite.materialTypeId == "322") {
            this.zjclfileList.push(ite);
          }
          if (ite.materialTypeId == "1022") {
            this.wtsfileListzr.push(ite);
          }

        });
      },
      async chongtuTestFunc(flag){
        if ((this.caseDetailFoemData.ctAudit && this.caseDetailFoemData.ctAudit !==1) || !flag) return false;
        const isDraft = this.caseDetailFoemData.agentNum.includes('NO')
        if (!isDraft) return false
        return new Promise(resolve => {
          chongtuTest({
            taskId: this.caseDetailFoemData.taskId,
            draftNumber: this.caseDetailFoemData.agentNum,
            ...this.caseDetailFoemData
          }).then(res => {
            if (res.messageType == 10) {
              this.checkChongTuSet(res.data, "", '')
              resolve(true)
            } else {
              resolve(false)
            }
          }).catch(err => {
            resolve(true)
          })
        })
      },
      goNext () {
        this.$store.commit('caseInformation/SET_PREONLYID', this.caseDetailFoemData.caseId)
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
     async creatCaseForm (checkCase = 1, checkChongTu = 1) {
        console.log('creatCaseForm3333333');
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
           // this.$message.error('【代理人姓名】或【联系人】不在备案员工范围内')
           // return
         }
        }
        if(!this.$commonUtils.checkBA(this.caseRoleSelectList)){
          this.$message.error('承办律师或客户律师有误！')
          return
        }
        if (
          this.ch_caseTypr === "商标查询" &&
          this.caseDetailFoemData.searchResultList
        ) {
          if(Object.prototype.toString.call(this.caseDetailFoemData.searchResultList).includes("String")){
            this.caseDetailFoemData.searchResultList = this.caseDetailFoemData.searchResultList
              .split("\n")
              .map(item => {
                return { regNumber: item };
              });
          }
        } else {
          this.caseDetailFoemData.searchResultList = [];
        }
        if (this.caseDetailFoemData.submitType == "网上申请" && ['内-内', '外-内'].includes(this.caseDetailFoemData.appFromto)) {
          let msg1 = '请上传申请人'
          // if (this.ch_caseTypr==='撤销三年停止使用申请') {
          //   msg1 = '请上传申请人'
          // } else {
          //   msg1 = '请上传受让人'
          // }
          if (this.ch_caseTypr==='国际注册驳回复审') {
            if (!this.fileName[301600]) {
              this.$message.error("请上传评审网申国际商标需上传材料");
              return;
            }
          }
          if (
            this.caseDetailFoemData.legalNature == "自然人" &&
            this.caseDetailFoemData.uploadFileLanguage == "外文"
          ) {
            if (!this.fileName[1002]) {
              this.$message.error(`${msg1}身份证明文件(外文)`);
              return;
            }
          }
          if (
            this.caseDetailFoemData.legalNature == "自然人" &&
            this.caseDetailFoemData.uploadFileLanguage == "中文"
          ) {
            if (!this.fileName[1001]) {
              this.$message.error(`${msg1}身份证明文件(中文)`);
              return;
            }
          }
          if (
            this.caseDetailFoemData.legalNature != "自然人" &&
            this.caseDetailFoemData.uploadFileLanguage == "外文"
          ) {
            if (!this.fileName[1004] &&this.ch_caseTypr!=='注册驳回复审'&& this.ch_caseTypr!=='无效宣告申请') {
              this.$message.error(`${msg1}主体资格证明文件(外文)`);
              return;
            }
          }
          if (
            this.caseDetailFoemData.legalNature != "自然人" &&
            this.caseDetailFoemData.uploadFileLanguage == "中文"
          ) {
            if (!this.fileName[1003] && this.ch_caseTypr!=='注册驳回复审'&& this.ch_caseTypr!=='无效宣告申请') {
              this.$message.error(`${msg1}主体资格证明文件`);
              return;
            }
          }
          if (this.ch_caseTypr==='无效宣告申请') {
            if (!this.fileName[1000]) {
              this.$message.error("请上传委托书文件");
              return;
            }
            if (!this.fileName[1003]) {
              this.$message.error("请上传主体资格证明（中文+原文）文件");
              return;
            }
            if (!this.fileName[327]) {
              this.$message.error("请上传事实理由文件");
              return;
            }
            if (!this.caseDetailFoemData.lawList.length) {
              this.$message.error("请选择法律条款");
              return;
            }
            if (this.caseDetailFoemData.lawList && (this.caseDetailFoemData.lawList.includes('《商标法》第三十条') || this.caseDetailFoemData.lawList.includes('《商标法》第三十一条')) && (!this.caseDetailFoemData.quotes || this.caseDetailFoemData.quotes && !this.caseDetailFoemData.quotes.filter(i => i.quoteRegNumber).length)) {
              this.$message.error("请添加引证商标信息");
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
          if (this.ch_caseTypr == "商标注册") {
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
          }
          if (
            this.ch_caseTypr != "商标续展" &&
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
          if (
            this.ch_caseTypr == "商标注册" ||
            this.ch_caseTypr == "续展" ||
            this.ch_caseTypr == "变名变址"
          ) {
            if (!this.caseDetailFoemData.appCertFileIsCn) {
              this.$message.error("请选择证明文件是否为中文");
              return;
            }
          }
        }
        if(this.caseDetailFoemData.ifShareTm=='1'&&!this.caseDetailFoemData.joinApps.filter(item=>item.type!=4).length){
          this.$message.error("请添加共同申请人");
          return;
        }
        if(this.ch_caseTypr == '异议答辩' && this.caseDetailFoemData.opponents && !this.caseDetailFoemData.opponents.length){
          this.$message.error("异议人名称不能为空");
          return;
        }
        if(this.caseDetailFoemData.caseType=='行政复议'&&!this.caseDetailFoemData.reissueType){
          this.$message.error("请选择不予的案件类型");
          return;
        }
        if(this.ch_caseTypr == '异议' && this.caseDetailFoemData.subBusinessSecrets && !this.caseDetailFoemData.quotedOthersMaterial && !this.fileName[301677]){
          this.$message.error("请上传涉商业机密证据材料");
          return;
        }
        if(this.ch_caseTypr == '异议' && this.caseDetailFoemData.subBusinessSecrets && !this.caseDetailFoemData.quotedOthersMaterial && !this.fileName[1020]){
          this.$message.error("请上传其他说明文件");
          return;
        }
        if (this.ch_caseTypr == '无效宣告申请' && this.caseDetailFoemData.justNegativeAgre == 0 && !this.fileName[301677] ) {
          this.$message.error("请上传涉密证据材料");
          return;
        }
        if(!this.caseDetailFoemData.caseCustRespUserArray ||
           !this.caseDetailFoemData.caseCustRespUserArray.length){
          this.$message.error('请选择客户负责人')
          return false
        }
        // this.caseDetailFoemData.caseIds = this.caseDetailFoemData.caseId;
        // delete this.caseDetailFoemData.materials;
        // delete this.caseDetailFoemData.caseEvolve;
        // delete this.caseDetailFoemData.tmList;
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
          this.tmlist.includes(this.ch_caseTypr)
        ) {
          delete this.caseDetailFoemData.imageFile;
          const sessionObj = JSON.parse(
            sessionStorage.getItem("changeOfNameOrAddressObj")
          );
          var data2 = {
            regNumberList: sessionObj.multipleSelection.map(
              item => item.regNumber
            ),

            taskId: this.caseDetailFoemData.taskId
          };
          if (this.ch_caseTypr === "变名变址") {
            data2.appNameList = [
              {
                id: sessionObj.appObj.appId,
                cn: this.$refs.changeOfNameAndAddress.tmObj.applicantName
              }
            ];
            data2.appAddressList = this.$refs.changeOfNameAndAddress.defaultbeforeAddress.map(
              (item, index) => {
                return {
                  id: item.addrId,
                  cn: this.$refs.changeOfNameAndAddress.beforeAddress[index]
                    .addressCn
                };
              }
            );
            data2.preAppId = sessionObj.appObj.appId;
          }
          data2.isBatch = "1";
        }
        if (
          this.$route.query.import != "1" &&
          this.tmlist.includes(this.ch_caseTypr)
        ) {
          var data2 = {
            regNumberList: this.caseDetailFoemData.regNumber,
            taskId: this.caseDetailFoemData.taskId
          };

          if (this.ch_caseTypr === "变名变址") {
            data2.appNameList = [
              {
                id: this.$refs.changeOfNameAndAddress.tmObj.preAppId,
                cn: this.$refs.changeOfNameAndAddress.tmObj.applicantName
              }
            ];
            data2.appAddressList = [
              {
                id: this.$refs.changeOfNameAndAddress.tmObj.preAddrId,
                cn: this.$refs.changeOfNameAndAddress.tmObj.addressCn
              }
            ];
          }
          data2.isBatch = "0";
        }
        if (this.ch_caseTypr === "变名变址") {
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
        } else if (this.ch_caseTypr === "续展") {
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
        data.checkChongTu = checkChongTu;
        if (this.caseDetailFoemData.appGJdq=='中国') {
          //获取省/市/区名称并通过#拼接，如果没有某一个值就不要#拼接
          const province = this.provinceList.find(item => item.regionCode == this.address.province) || {}
          const city = this.cityList.find(item => item.regionCode == this.address.city) || {}
          const district = this.districtList.find(item => item.regionCode == this.address.district) || {}
          data.appRegionalism = `${province.abbrName}${city.abbrName?`#${city.abbrName}`:''}${district.abbrName?`#${district.abbrName}`:''}`
        }else{
          data.appRegionalism = ''
        }
        if (this.caseDetailFoemData.transferorNationality=='中国') {
            //获取省/市/区名称并通过#拼接，如果没有某一个值就不要#拼接
            const province = this.tfProvinceList.find(item => item.regionCode == this.transferorAddress.province) || {}
            const city = this.tfCityList.find(item => item.regionCode == this.transferorAddress.city) || {}
            const district = this.tfDistrictList.find(item => item.regionCode == this.transferorAddress.district) || {}
            data.provinceOrCity = `${province.abbrName || ''}${city.abbrName?`#${city.abbrName}`:''}${district.abbrName?`#${district.abbrName}`:''}`
          }else{
            data.provinceOrCity = ''
          }
        // if(this.caseDetailFoemData.submitType==='网上申请'){
        //   this.rules.applicationMarks[0].required=true
        // }else {
        //   this.rules.applicationMarks[0].required=false
        // }
        this.postFormFlag=false
        await this.$nextTick()
        this.postFormFlag=true
        await this.$nextTick()
        this.$refs["postForm"].validate(async valid => {
          if (valid) {
            const not = '案件的注册日期为自动抓取的首次注册公告日期，请务必通过商标网（G开头商标号的国际注册通过WIPO官网）确认被撤销商标是否经过异议流程以免因不满三年不予受理。'
            if (this.ch_caseTypr === "撤销三年停止使用申请" && !await this.$confirm(not,
                '提示',
                {
                  // distinguishCancelAndClose:true,
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
              ).then(() => {
                return true
              }).catch((action) => {
                return false
                // if(action === 'cancel') {
                //   return false
                // }else{
                //   return true
                // }
              })) return
            // 冲突检查
            if (await this.chongtuTestFunc(1)) return ;

            checkCase && await this.delAllGoodsJudge(data)
            heighCreditUrl(data)
              .then(res => {
                if (res.success) {
                  // console.log(res.messageType == "-6", "***");
                  if (res.messageType == "-6") {
                    this.$confirm("提示", {
                      message: this.$commonUtils.rowsMessage(res.message, '#'),
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning"
                    }).then(() => {
                      this.creatCaseForm(0, 1);
                    });
                  } else if (res.messageType == "10") {
                    this.checkChongTuSet(res.data, "", '');
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
                    if (res.messageType ==13) {
                      this.caseData = res.data
                      this.poppingTimeLimitState=true
                      return;
                    }
                    this.addConflicter();
                    this.goNext();
                  }
                }
              })
              .catch(err => { });
          } else {
            this.$message.error("请填写必填项");
            return false;
          }
        });
      },
      closePoppingTimeLimit(){
        this.poppingTimeLimitState=false
        if(this.prefiling){
          this.$router.push({
            path: "/workbench/case/preFilingPush/1",
            query: {taskId: this.caseDetailFoemData.taskId, taskType: 1}
          });
          return
        }
        this.goNext()
      },
      addMDL () {
        this.caseDetailFoemData.trademarkCaseBasicinfos.push({
          regNumber: "",
          regDate: ""
        });
      },

      tkInspect (command) {
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

      deljoinBtn () {
        if(this.dialogFormjoin ==1){
          delJoinAppUrl({ joinAppId: this.joinFormData.joinAppId });
        }
        this.dialogFormjoin = 0;
      },
      joinCreatdialog () {
        cradeJoinAppUrl({ caseIds: this.mainCaseIds }).then(res => {
          // res.data是一个对象，过滤掉对象的空值
          const filteredData = Object.fromEntries(
            Object.entries(res.data).filter(([_, value]) =>
              value !== null && value !== undefined && value !== ""
            )
          );
          this.joinFormData = filteredData
          console.log(this.joinFormData,'this.joinFormData');
        });
      },
      trancaseCochange (val) {
        if (val == '中国') {
          this.splitTfAddressFunc(this.caseDetailFoemData.transferorCnAdress)
        }
        queryCountryCaseUrl({ country: val })
          .then(response => {
            if (response.data && response.data.length > 0) {
              this.caseDetailFoemData.transferorCountryAndregion =
                response.data[0].countryCn;
            } else {
              this.caseDetailFoemData.transferorCountryAndregion = "";
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      appCnAddrChange(e){
        // console.log(this.$refs.appCnAddr);
        if(e){
          this.caseDetailFoemData.appEnAddr=e.addressEn //this.selectData.appaddr.find(item=>item.addressCn==e).addressEn
        }
      },
      caseCochange (val) {
        if (val == '中国') {
          this.splitAddressFunc(this.caseDetailFoemData.appCnAddr)
        }
        queryCountryCaseUrl({ country: val })
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

      jointypeChange (val) {
        if (val == "2") {
          this.joinFormData.typeStr = "转让人";
        } else if (val == "3") {
          this.joinFormData.typeStr = "受让人";
        }
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

  /*/deep/ .form-border {*/
  /*  .el-form-item__error {*/
  /*    position: relative !important;*/
  /*  }*/
  /*  .el-row {*/
  /*    display: flex;*/
  /*    margin: 0px;*/
  /*  }*/
  /*  .postInfo-container-item {*/
  /*    width: 100%;*/
  /*    height: 100%;*/
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
  /*    width: 60%;*/
  /*  }*/

  /*  .el-form-item__content {*/
  /*    text-align: left;*/
  /*    // height: 30px;*/
  /*  }*/

  /*  .fullRow {*/
  /*    .el-form-item__label {*/
  /*      width: 17.2%!important;*/
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
      .textarea_wrap{
        display: flex;
        .button_wrap{
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
  .chongtuTitle{
    /deep/ .el-dialog__title{
      color: #ff0000;
    }
  }
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
  .require /deep/ .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
  .custom-radio-group{
    .el-radio{
      display: block;
    }
  }
.required-asterisk{ color:#F56C6C; margin-right:4px; }

</style>
