<template>
  <div  :style="{'padding':type? '20px':'0','background':type?'rgba(0,0,0,0.42)':'#fff','position': 'relative'}">
    <slot name="close"></slot>

    <div
        style="position: absolute;left: 20px;top: 10px;display: flex;justify-content: center;align-items: center;border-radius:50%;    border: 1px solid;
        height: 20px;
        width: 20px;
        cursor: pointer;
        z-index:10"
         v-if="backsign">
      <i class="el-icon-back" @click="$router.go(-1)">
      </i>

    </div>
    <BreadCrumbCase v-if="caseDetailFoemData.caseId&&backsign" :caseDetailFoemData="caseDetailFoemData"></BreadCrumbCase>
    <header v-show="type" class="topHeader">
      <div>
        案件详情
      </div>
      <i class="el-icon-close close" @click="$emit('closeSeeCaseDetail')"></i>
    </header>
    <div class="sectionWrap" :style="{'padding':type? '10px':'20px','background': '#fff','margin-top':type?'43px':'0'}">

    <section >
      <div style="position: relative;width: 100%;height: auto;">
        <div style="
          position: absolute;
          right: 0;
          top: 0;
          z-index: 10;
          padding-top: 4px;
          padding-right: 4px;"
          v-if="$store.getters.permissions.includes(508)"
        >
          <el-button type="primary" size="mini" v-show="!isSubscribe" @click="setSubscribe(1)">关注</el-button>
          <el-button type="danger" size="mini" v-show="isSubscribe" @click="setSubscribe(0)">取消关注</el-button>
        </div>
        <el-tabs v-model="activeName" v-if="sign==0" @tab-click="handleClickTab">
          <el-tab-pane label="案件详情" name="1">
            <protectCaseDetail v-if="caseDetailFoemData.caseId&&!([1,2,4].includes(taskType))" :caseDetailFoemData="caseDetailFoemData" :taskType="taskType"></protectCaseDetail>
            <patent-case-detail v-if="caseDetailFoemData.caseId&&taskType==4" :caseDetailFormData="caseDetailFoemData"></patent-case-detail>
            <litigationCaseDetail v-if="caseDetailFoemData.caseId&&taskType==2" :caseDetailFoemData="caseDetailFoemData"></litigationCaseDetail>
            <caseDetail :sign="sign" v-if="caseDetailFoemData.caseId&&taskType==1" :caseDetailFoemData="caseDetailFoemData"></caseDetail>
          </el-tab-pane>
          <el-tab-pane label="办案人" name="2">
            <CaseInvestigators :isPatent="$store.getters.patentCaseTypeIdList.includes(caseDetailFoemData.caseTypeId)" v-if="caseDetailFoemData.caseId&&activeName==2" :caseDetailData='caseDetailFoemData' :isEdit="false">
    <!--          <div class="createPost-main-container" v-if="taskType==2">-->
    <!--            <div class="form-con">-->
    <!--              <el-row class="form-border">-->
    <!--                <el-col :span="24">-->
    <!--                  <el-row>-->
    <!--                    <el-col :span="24" class="tilteSpan">-->
    <!--                      <span id="-title">承办律师</span>-->
    <!--                    </el-col>-->
    <!--                  </el-row>-->
    <!--                  <el-row class="fullRow">-->
    <!--                    <el-col :span="24">-->
    <!--                      <el-form-item class="postInfo-container-item" label="承办律师1:">-->
    <!--                        {{caseDetailFoemData.lawyer1UserName}}-->
    <!--                      </el-form-item>-->
    <!--                    </el-col>-->
    <!--                    <el-col :span="24">-->
    <!--                      <el-form-item class="postInfo-container-item" label="承办律师2:">-->
    <!--                        {{caseDetailFoemData.lawyer2UserName}}-->
    <!--                      </el-form-item>-->
    <!--                    </el-col>-->
    <!--                  </el-row>-->
    <!--                </el-col>-->
    <!--              </el-row>-->
    <!--            </div>-->
    <!--          </div>-->
            </CaseInvestigators>
          </el-tab-pane>
          <el-tab-pane label="账单费用" name="3">
            <caseBill v-if="caseDetailFoemData.caseId" :billData='caseDetailFoemData'></caseBill>
          </el-tab-pane>
          <el-tab-pane label="案件进展" name="4">
            <ElectronicArchives
              :searchFanweiList="caseDetailFoemData.searchFanweiList"
              ref="Electronic"
              :usAgency="caseDetailFoemData.usAgency"
              v-if="caseDetailFoemData.caseId&&activeName==4"
              :caseEvolve="caseDetailFoemData.caseEvolve"
              :isEdit="false"
              :taskType="taskType"
              :caseTypeId="caseDetailFoemData.caseTypeId"
              :agentNum="caseDetailFoemData.agentNum"
              :curCaseId="caseDetailFoemData.caseId"
              :custId="caseDetailFoemData.custId"
              :case-detail-foem-data="caseDetailFoemData"
              :business="business"
            ></ElectronicArchives>

          </el-tab-pane>
          <el-tab-pane label="特殊指示" name="5" v-if="!caseDetailFoemData.usAgency">
            <el-row>
              <el-col :span="20">
                <el-row v-if="taskType == 4">
              <el-col class="tilteSpan" :span="24">
                <span id='-title'>客户个案要求</span>
              </el-col>
            </el-row>
                <el-row v-if="taskType == 4">
                  <el-col class="form-con-item" :span="24">
                    <el-row class="form-border">
                      <el-col :span="24">
                        <el-row class="fullRow">
                          <el-col :span="24">
                            <div label="客户个案要求:" class="postInfo-container-item">
                              <template v-if="caseDetailFoemData.custCommand">
                                <p v-for="item in caseDetailFoemData.custCommand.split('\n')">{{item}}</p>
                              </template>
        <!--                     {{caseDetailFoemData.custCommand}}-->
                            </div>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="tilteSpan" :span="24">
                    <span id='tszs-custzs'>特殊指示-案件指示</span>
                  </el-col>
                </el-row>
                <el-row>
                  <SpecialInstructions label="案件特殊指示" type="view" :data="{custFullNameString:caseDetailFoemData.custName,customerRequirementBillList:custReqCases}"></SpecialInstructions>

        <!--          <SpecialInstructions type="view" :data="{custFullNameString:caseDetailFoemData.custName,customerRequirementBillList:custReqBills}"></SpecialInstructions>-->
                  <!--          <el-col class="form-con-item" :span="24">-->
        <!--            <el-row class="form-border">-->
        <!--              <el-col :span="24">-->
        <!--                <el-table size="mini" :data="custReqCases" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
        <!--                  <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
        <!--                  <el-table-column label="客户" align="left" width='150'>-->
        <!--                    <template slot-scope="scope">-->
        <!--                      <span>{{ scope.row.fullname }}</span>-->
        <!--                    </template>-->
        <!--                  </el-table-column>-->
        <!--                  <el-table-column label="申请人" align="left" width='150'>-->
        <!--                    <template slot-scope="scope">-->
        <!--                      <span>{{ scope.row.applicantName }}</span>-->
        <!--                    </template>-->
        <!--                  </el-table-column>-->
        <!--                  <el-table-column label="案件特殊指示" align="left" width>-->
        <!--                    <template slot-scope="scope">-->
        <!--                      <span>{{ scope.row.specialInfo }}</span>-->
        <!--                    </template>-->
        <!--                  </el-table-column>-->

        <!--                </el-table>-->
        <!--              </el-col>-->
        <!--            </el-row>-->
        <!--          </el-col>-->
                </el-row>
                <el-row>
                  <el-col class="tilteSpan" :span="24">
                    <span id='tszs-billzs'>特殊指示-账单指示</span>
                    <!--<caseBill :billData='caseDetailFoemData'></caseBill>-->
                  </el-col>
                </el-row>
                <el-row>
                  <SpecialInstructions type="view" :data="{custFullNameString:caseDetailFoemData.custName,customerRequirementBillList:custReqBills}"></SpecialInstructions>
        <!--          <el-col class="form-con-item" :span="24">-->
        <!--            <el-row class="form-border">-->
        <!--              <el-col :span="24">-->
        <!--                <el-table size="mini" :data="custReqBills" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
        <!--                  <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
        <!--                  <el-table-column label="客户" align="left" width='150'>-->
        <!--                    <template slot-scope="scope">-->
        <!--                      <span>{{ scope.row.fullname }}</span>-->
        <!--                    </template>-->
        <!--                  </el-table-column>-->
        <!--                  <el-table-column label="申请人" align="left" width='150'>-->
        <!--                    <template slot-scope="scope">-->
        <!--                      <span>{{ scope.row.applicantName }}</span>-->
        <!--                    </template>-->
        <!--                  </el-table-column>-->
        <!--                  <el-table-column label="案件特殊指示" align="left" width>-->
        <!--                    <template slot-scope="scope">-->
        <!--                      <span>{{ scope.row.specialInfo }}</span>-->
        <!--                    </template>-->
        <!--                  </el-table-column>-->

        <!--                </el-table>-->
        <!--              </el-col>-->
        <!--            </el-row>-->
        <!--          </el-col>-->
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
                <el-row v-if="taskType != 4">
                  <el-col class="tilteSpan" :span="24">
                    <span id='-title'>客户个案要求</span>
                  </el-col>
                </el-row>
                <el-row v-if="taskType != 4">
                  <el-col class="form-con-item" :span="24">
                    <el-row class="form-border">
                      <el-col :span="24">
                        <el-row class="fullRow">
                          <el-col :span="24">
                            <div label="客户个案要求:" class="postInfo-container-item">
                              <template v-if="caseDetailFoemData.instructions">
                                <p v-for="item in caseDetailFoemData.instructions.split('\n')">{{item}}</p>
                              </template>
                              <template v-else-if="caseDetailFoemData.workReq">
                                <p v-for="item in caseDetailFoemData.workReq.split('\n')">{{item}}</p>
                              </template>
        <!--                     {{caseDetailFoemData.instructions || caseDetailFoemData.workReq}}-->
                            </div>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="4">
                <div style="height: 520px;position: fixed;top:20%;right:2%">
                  <el-steps :space="200" :active="stepActive1" direction="vertical">
                    <el-step v-for="(item,index) in elstepList" :title="item.title"
                            @click.native="getTopPosition(item.id,index)" v-if="item.state"></el-step>
                  </el-steps>
                </div>
              </el-col>
            </el-row>

          </el-tab-pane>

          <el-tab-pane label="任务管理" name="6" v-if="caseDetailFoemData.caseId && !($store.getters.tmCaseTypeIdList.includes(caseDetailFoemData.caseTypeId)) && !$store.getters.patentCaseTypeIdList.includes(caseDetailFoemData.caseTypeId)">
            <TaskProgress :caseName="caseDetailFoemData.caseName" :caseTypeStr="caseDetailFoemData.caseTypeStr" :taskDataCaseId="caseIds" v-if="caseDetailFoemData.caseTypeId&&caseDetailFoemData.caseName" :agentNum="agentNum" :judgeRank="caseDetailFoemData.judgeRank" :case-type-id="caseDetailFoemData.caseTypeId"></TaskProgress>
    <!--        <task-detail v-if="caseDetailFoemData.caseId" :judge-rank="caseDetailFoemData.judgeRank" :case-type-id="caseDetailFoemData.caseTypeId" :case-id="caseDetailFoemData.caseId"></task-detail>-->
          </el-tab-pane>
          <el-tab-pane label="著变信息" name="7" v-if="$store.getters.patentCaseTypeIdList.includes(caseDetailFoemData.caseTypeId)">
              <SignificantChange v-if="activeName==='7'" :case-id="caseDetailFoemData.caseId" :custId="caseDetailFoemData.custId"></SignificantChange>
          </el-tab-pane>
        </el-tabs>
      </div>

    <el-select class="selectCase" v-model="caseIds" @change="selectCase" placeholder="请选择" v-if="caseList.length>1">
      <el-option
        v-for="item in caseList"
        :key="item.caseId"
        :label="item.agentNum"
        :value="item.caseId">
      </el-option>
    </el-select>
    <Tabs v-model="activeName" v-if="sign!=0">

      <el-tab-pane label="案件进展" name="1">
        <ElectronicArchives
          ref="Electronic"
          :searchFanweiList="caseDetailFoemData.searchFanweiList"
          :usAgency="caseDetailFoemData.usAgency"
          :curCaseId="caseIds"
          :caseEvolve="caseDetailFoemData.caseEvolve"
          :isEdit="false"
          :isPatentFee="isPatentFee"
          :caseTypeId="caseDetailFoemData.caseTypeId"
          :agentNum="caseDetailFoemData.agentNum"
          :custId="caseDetailFoemData.custId"
          v-if="activeName==1&&(caseDetailFoemData.caseId || caseId)"
          :case-detail-foem-data="caseDetailFoemData"
         :taskType="taskType"
         :business="business"
        ></ElectronicArchives>
      </el-tab-pane>
      <el-tab-pane label="案件详情" name="2">
        <protectCaseDetail v-if="caseDetailFoemData.caseId&&activeName==2&&!([1,2,4].includes(taskType))" :caseDetailFoemData="caseDetailFoemData" :taskType="taskType"></protectCaseDetail>
        <patent-case-detail v-if="caseDetailFoemData.caseId&&activeName==2&&taskType==4" :caseDetailFormData="caseDetailFoemData"></patent-case-detail>
        <caseDetail v-if="caseDetailFoemData.caseId&&activeName==2&&taskType==1" :caseDetailFoemData="caseDetailFoemData"></caseDetail>
        <litigationCaseDetail v-if="caseDetailFoemData.caseId&&activeName==2&&taskType==2" :caseDetailFoemData="caseDetailFoemData"></litigationCaseDetail>

      </el-tab-pane>
      <el-tab-pane label="办案人" name="3">
        <CaseInvestigators :isPatent="$store.getters.patentCaseTypeIdList.includes(caseDetailFoemData.caseTypeId)" v-if="caseDetailFoemData.caseId&&activeName==3" :caseDetailData='caseDetailFoemData' :isEdit="false">
<!--          <div class="createPost-main-container" v-if="taskType==2">-->
<!--            <div class="form-con">-->
<!--              <el-row class="form-border">-->
<!--                <el-col :span="24">-->
<!--                  <el-row>-->
<!--                    <el-col :span="24" class="tilteSpan">-->
<!--                      <span id="-title">承办律师</span>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item class="postInfo-container-item" label="承办律师1:">-->
<!--                        {{caseDetailFoemData.lawyer1UserName}}-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item class="postInfo-container-item" label="承办律师2:">-->
<!--                        {{caseDetailFoemData.lawyer2UserName}}-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--            </div>-->
<!--          </div>-->
        </CaseInvestigators>
      </el-tab-pane>
      <el-tab-pane label="账单费用" name="4">
        <caseBill v-if="caseDetailFoemData.caseId&&activeName==4" :billData='caseDetailFoemData'></caseBill>
      </el-tab-pane>
      <el-tab-pane label="特殊指示" name="5" v-if="!caseDetailFoemData.usAgency">
        <el-row>
          <el-col :span="20">
            <el-row v-if="taskType == 4">
          <el-col class="tilteSpan" :span="24">
            <span id='-title'>客户个案要求</span>
          </el-col>
        </el-row>
            <el-row v-if="taskType == 4">
              <el-col class="form-con-item" :span="24">
                <el-row class="form-border">
                  <el-col :span="24">
                    <el-row class="fullRow">
                      <el-col :span="24">
                        <div label="客户个案要求:" class="postInfo-container-item">
                          <template v-if="caseDetailFoemData.custCommand">
                            <p v-for="item in caseDetailFoemData.custCommand.split('\n')">{{item}}</p>
                          </template>
    <!--                     {{caseDetailFoemData.custCommand}}-->
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span id='tszs-custzs'>特殊指示-案件指示</span>
              </el-col>
            </el-row>
            <el-row>
              <SpecialInstructions label="案件特殊指示" type="view" :data="{custFullNameString:caseDetailFoemData.custName,customerRequirementBillList:custReqCases}"></SpecialInstructions>

              <!--          <el-col class="form-con-item" :span="24">-->
    <!--            <el-row class="form-border">-->
    <!--              <el-col :span="24">-->
    <!--                <el-table size="mini" :data="custReqCases" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
    <!--                  <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
    <!--                  <el-table-column label="客户" align="left" width='150'>-->
    <!--                    <template slot-scope="scope">-->
    <!--                      <span>{{ scope.row.fullname }}</span>-->
    <!--                    </template>-->
    <!--                  </el-table-column>-->
    <!--                  <el-table-column label="申请人" align="left" width='150'>-->
    <!--                    <template slot-scope="scope">-->
    <!--                      <span>{{ scope.row.applicantName }}</span>-->
    <!--                    </template>-->
    <!--                  </el-table-column>-->
    <!--                  <el-table-column label="案件特殊指示" align="left" width>-->
    <!--                    <template slot-scope="scope">-->
    <!--                      <span>{{ scope.row.specialInfo }}</span>-->
    <!--                    </template>-->
    <!--                  </el-table-column>-->

    <!--                </el-table>-->
    <!--              </el-col>-->
    <!--            </el-row>-->
    <!--          </el-col>-->
            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span id='tszs-billzs'>特殊指示-账单指示</span>
                <!--<caseBill :billData='caseDetailFoemData'></caseBill>-->
              </el-col>
            </el-row>
            <el-row>
              <SpecialInstructions type="view" :data="{custFullNameString:caseDetailFoemData.custName,customerRequirementBillList:custReqBills}"></SpecialInstructions>

              <!--          <el-col class="form-con-item" :span="24">-->
    <!--            <el-row class="form-border">-->
    <!--              <el-col :span="24">-->
    <!--                <el-table size="mini" :data="custReqBills" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
    <!--                  <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
    <!--                  <el-table-column label="客户" align="left" width='150'>-->
    <!--                    <template slot-scope="scope">-->
    <!--                      <span>{{ scope.row.fullname }}</span>-->
    <!--                    </template>-->
    <!--                  </el-table-column>-->
    <!--                  <el-table-column label="申请人" align="left" width='150'>-->
    <!--                    <template slot-scope="scope">-->
    <!--                      <span>{{ scope.row.applicantName }}</span>-->
    <!--                    </template>-->
    <!--                  </el-table-column>-->
    <!--                  <el-table-column label="案件特殊指示" align="left" width>-->
    <!--                    <template slot-scope="scope">-->
    <!--                      <span>{{ scope.row.specialInfo }}</span>-->
    <!--                    </template>-->
    <!--                  </el-table-column>-->

    <!--                </el-table>-->
    <!--              </el-col>-->
    <!--            </el-row>-->
    <!--          </el-col>-->
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
            <el-row v-if="taskType != 4">
              <el-col class="tilteSpan" :span="24">
                <span id='tszs-require'>客户个案要求</span>
              </el-col>
            </el-row>
            <el-row v-if="taskType != 4">
              <el-col class="form-con-item" :span="24">
                <el-row class="form-border">
                  <el-col :span="24">
                    <el-row class="fullRow">
                      <el-col :span="24">
                        <div label="客户个案要求:" class="postInfo-container-item">
                          <template v-if="caseDetailFoemData.instructions">
                            <p v-for="item in caseDetailFoemData.instructions.split('\n')">{{item}}</p>
                          </template>
                          <template v-else-if="caseDetailFoemData.workReq">
                            <p v-for="item in caseDetailFoemData.workReq.split('\n')">{{item}}</p>
                          </template>
    <!--                     {{caseDetailFoemData.instructions || caseDetailFoemData.workReq}}-->
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4">
            <div style="height: 520px;position: fixed;top:30%;right:3%">
              <el-steps :space="100" :active="stepActive1" direction="vertical">
                <el-step v-for="(item,index) in elstepList" :title="item.title"
                         @click.native="getTopPosition(item.id,index)" v-if="item.state"></el-step>
              </el-steps>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="任务管理" name="6" v-if="caseDetailFoemData.caseId && !($store.getters.tmCaseTypeIdList.includes(caseDetailFoemData.caseTypeId)) && !$store.getters.patentCaseTypeIdList.includes(caseDetailFoemData.caseTypeId)">
        <TaskProgress :caseName="caseDetailFoemData.caseName" :caseTypeStr="caseDetailFoemData.caseTypeStr" :taskDataCaseId="caseIds" v-if="caseDetailFoemData.caseTypeId" :agentNum="agentNum" :judgeRank="caseDetailFoemData.judgeRank" :case-type-id="caseDetailFoemData.caseTypeId"></TaskProgress>
<!--        <task-detail v-if="caseDetailFoemData.caseId" :caseId="caseDetailFoemData.caseId" :judge-rank="caseDetailFoemData.judgeRank" :case-type-id="caseDetailFoemData.caseTypeId" :no-create="true"></task-detail>-->
      </el-tab-pane>
      <el-tab-pane label="著变信息" name="7" v-if="$store.getters.patentCaseTypeIdList.includes(caseDetailFoemData.caseTypeId)">
          <SignificantChange v-if="activeName==='7'" :case-id="caseDetailFoemData.caseId" :custId="caseDetailFoemData.custId"></SignificantChange>
      </el-tab-pane>
    </Tabs>
  </section>
  </div>
<!--    任务查看弹框-->

<!--    <el-dialog-->
<!--      v-if="false"-->
<!--        title="任务查看"-->
<!--        :visible.sync="taskLook"-->
<!--        width="70%"-->
<!--        >-->
<!--        <el-form class="new-task-dialog" label-width="120px">-->
<!--          <el-row>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item  label="任务名称:">-->
<!--                {{edtiTasksData.prjTaskName}}-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="任务描述:">-->
<!--                <div style="max-height: 120px;overflow-y: auto;">-->
<!--                  <p v-if="!edtiTasksData.prjTaskDesc"></p>-->
<!--                  <p v-else v-for="(j,index) in edtiTasksData.prjTaskDesc.split('\n')">{{j}}</p>-->
<!--                </div>-->

<!--              </el-form-item>-->
<!--            </el-col>-->

<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-col :span="12">-->
<!--&lt;!&ndash;              <el-form-item label="文件:">&ndash;&gt;-->
<!--&lt;!&ndash;                <div style="display: flex;justify-content: left">&ndash;&gt;-->
<!--&lt;!&ndash;                  <div class="left-fileList" style="flex: 4">&ndash;&gt;-->
<!--&lt;!&ndash;                    <div style="max-height: 120px;overflow-y: auto;">&ndash;&gt;-->
<!--&lt;!&ndash;                      <div v-for="(item, index) in edtiTasksData.fileList" :key="index">&ndash;&gt;-->
<!--&lt;!&ndash;                        <div&ndash;&gt;-->
<!--&lt;!&ndash;                          :class="{'filehover': fileHover == index}"&ndash;&gt;-->
<!--&lt;!&ndash;                          @mouseover="fileHover = index" @mouseout="fileHover = 10000"&ndash;&gt;-->
<!--&lt;!&ndash;                          style="display: flex;justify-content: space-between;align-items: center"&ndash;&gt;-->
<!--&lt;!&ndash;                        >&ndash;&gt;-->
<!--&lt;!&ndash;                          <span style="color: #409EFF;display: flex;justify-content: left;align-items: center"><span class="file-name1">{{item.materialName}}</span><i class="el-icon-view" @click="preView(item)"></i></span>&ndash;&gt;-->
<!--&lt;!&ndash;                          <div class="do-some">&ndash;&gt;-->
<!--&lt;!&ndash;                          </div>&ndash;&gt;-->
<!--&lt;!&ndash;                        </div>&ndash;&gt;-->

<!--&lt;!&ndash;                      </div>&ndash;&gt;-->
<!--&lt;!&ndash;                    </div>&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->

<!--&lt;!&ndash;              </el-form-item>&ndash;&gt;-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="任务检查项:">-->
<!--                <div style="max-height: 120px;overflow-y: auto;">-->
<!--                  <p v-if="!edtiTasksData.itemList"></p>-->
<!--                  <p v-else v-for="(i,index) in (edtiTasksData.itemList+'').split('\n')">{{i}}</p>-->
<!--                </div>-->

<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="截止日期:">-->
<!--                {{edtiTasksData.endDate}}-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="任务创建人:">-->
<!--                {{edtiTasksData.creatorName}}-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="当前任务执行人:">-->
<!--                {{edtiTasksData.executorName}}-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="全部任务执行人:">-->
<!--                {{edtiTasksData.executorNames}}-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-col :span="12" class="bott">-->
<!--              <el-form-item label="任务分配人:">-->
<!--                {{edtiTasksData.assigneeName?edtiTasksData.assigneeName:'无'  }}-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="任务状态:" class="bott">-->
<!--                {{edtiTasksData.taskStatus}}-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--          </el-row>-->
<!--        </el-form>-->
<!--        <span slot="footer" class="dialog-footer" style="display: flex;justify-content: center">-->
<!--          <el-button @click="taskLook = false">取 消</el-button>-->
<!--        </span>-->
<!--      </el-dialog>-->
</div>
</template>

<script>
  import SignificantChange from "../SignificantChange";
  import BreadCrumbCase from '../BreadCrumbCase'
  import TaskDetail from "./TaskDetail";
  import TaskProgress from '@/views/workbench/case/components/TaskProgress.vue'
  import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
  // import TaskProgress from '@/views/workbench/case/components/TaskProgress.vue'
import caseDetail from './caseDetail.vue'
import litigationCaseDetail from './litigationCaseDetail.vue'
import ElectronicArchives from "@/views/workbench/case/components/ElectronicArchives.vue";
import CaseBill from "@/views/workbench/case/components/CaseBill.vue";
import CaseInvestigators from "@/views/workbench/case/components/CaseInvestigators.vue";
import  SpecialInstructions from '@/views/workbench/finance/billviews/components/SpecialInstructions'
import protectCaseDetail from './protectCaseDetail'
import {
  queryCaseInfoUrl,
  lawsuitUrl,
  queryCustomerReqUrl,
  queryPatentCaseInfo,
  settingsSubscribe,
  querySubscribe
} from "@/api/caseDetail";
import {queryAddrByAppIds} from '@/api/applicant'
import {
    addProjectTaskGroup,
    queryProjectTask,
    modifyProjectTaskGroup,
    deleteProjectTaskGroup,
    addProjectTask,
    modifyProjectTask,
    deleteProjectTask,
    queryTaskUserList,
    assginTask,
    submitTask,
    auditTask,
    queryToDoTask,
    addTaskHours,
    startTaskHours,
    stopTaskHours,
  } from '@/api/caseList'
  import PatentCaseDetail from "./patentCaseDetail";
export default {
  props: {
    isPatentFee: {
      default: false
    },
    caseId: {

    },
    tabName:{
      default:false
    },
    caseType: {
      default: ''
    },
    agentNum: {
      default: ''
    },
    type: {
      default: false
    },
    sign:{
      default:0
    },
    taskType:{
      default:1
    },
    backsign:{
      default:1
    },
    caseList:{
      default:()=>[]
    },
    pageType:{

    },
    business:{
      default:123
    }
  },
  name: "seeCaseDetail",
  data() {
    return {
      elstepList: [],
      stepActive1: 0,
      fileHover: 100000,
      taskLook: false,
      edtiTasksData: {
          prjTaskId: '',
          fileList: [],
          modelFileList: [],
          executor: '',
          itemList: '',
          prjTaskName: '',
          prjTaskDesc: '',
          endDate: '',
          creatorName: '',
          assigneeName: '',
          taskStatus: ''
        },
      activeNames: [],
      taskgroupList: [],
      agList: [],
      activeName: '1',
      caseIds: '',
      caseDetailFoemData: {},
      custReqBills:[],
      custReqCases:[],
      custActivity: [],
      custActivityList: [],
      isSubscribe:false
    }
  },
  watch: {
    activeName: {
      handler (n) {
        this.queryCustomerReqUrl()
      },
      immediate: true
    }
  },
  computed: {
  },
  created() {
    this.init(this.caseId)
    // this.queryProjectTask()
  },
  mixins: [require('@/views/workbench/case/components/TabNameStorage.vue').default],
  methods: {
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
    handleClickTab () {
    },
    rowDbClick(data){
        this.taskLook = true
        this.edtiTasksData = JSON.parse(JSON.stringify(data))
        let arr = []
        if(this.edtiTasksData.itemList&&this.edtiTasksData.itemList.length>0){
          this.edtiTasksData.itemList.forEach((i, index)=>{
            arr.push(i.prjIemName)
          })
          this.edtiTasksData.itemList = arr.join('\n')
        }
      },
    preView(data){
        let url = data.address
        if (getProgID(url)||url.replace(/.+\./,"").toLocaleLowerCase()=='msg') {
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
        } else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
          window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
        } else {
         this.downLoad(data)
        }
      },
      downLoad(data){
        const url = data.address
        // let notify = this.$notify.success({
        //   // title: 'Info',
        //   message: '正在下载',
        //   showClose: false,
        //   duration: 0
        // });
        const downData={
          url:`ipdoc${url}`,
          success(){
            // notify.close()
          }
        }
        if(data.mailId){
          downData.downLoad=data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
      },
      selectCase(e){
        this.taskType= this.caseList.find(item=>item.caseId==e).taskType
        this.init(e)
      },
    init(e){
      if (this.$route.params.caseId) {
        this.caseIds = this.$route.params.caseId
      } else {
        this.caseIds = e
      }
      this.fetchSubscribe()
      if (this.$route.query.taskType&&this.$route.name=='seeCaseDetail') {
        this.taskType=Number(this.$route.query.taskType)
      }
      if (this.taskType==1){
        this.queryCaseInfoUrl()
      } else if(this.taskType == 4){
        this.queryPatentCaseInfo(this.caseIds)
      } else {
        this.queryLitCaseInfoUrl()
      }

    },
    fetchSubscribe(){
      const params = {
        objType:1,
        objInstId:this.$route.params.caseId || this.caseIds
      }
      querySubscribe(params).then(res=>{
        if (res.success) {
          this.isSubscribe = res.data
        }
      })
    },
    setSubscribe(type){
      const params = {
        objType:1,
        objInstId:this.$route.params.caseId || this.caseIds,
        subscribe:type
      }
      settingsSubscribe(params).then(res=>{
        if (res.success) {
          this.$message.success('操作成功')
          this.fetchSubscribe()
        }
      })
    },
    async queryPatentCaseInfo(caseIds) {
        // let {data} = await queryPatentCaseInfo({caseIds})
        // this.caseDetailFoemData = Object.assign(data, this.caseDetailFoemData);
        let res = await queryPatentCaseInfo({caseIds})
        this.caseDetailFoemData = res.data
        this.queryAddrByAppIds(this.caseDetailFoemData.patentCaseApplicationList)
        this.queryCustomerReqUrl()
      },
    queryAddrByAppIds(appList){
        if(!(appList&&appList.length))return;
        let appIds = appList.map(i=>i.appId).filter(item=>!!item).join(',')
        if(!appIds.length)return;
        queryAddrByAppIds({appIds}).then(res=>{
          res.data.forEach(i=>{
            appList.forEach(j=>{
              if(j.appId == i.appId){
                j.post = i.appAddrArray.find(item=>item.addrId == j.addrId)&&i.appAddrArray.find(item=>item.addrId == j.addrId).post
                j.addressEn = i.appAddrArray.find(item=>item.addrId == j.addrId)&&i.appAddrArray.find(item=>item.addrId == j.addrId).addressEn
                j.appAddrArray = i.appAddrArray
              }
            })
          })
        })
      },
    queryCustomerReqUrl(){
      if(this.caseDetailFoemData.custId){
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
        )
      }

    },
    changeElstepList() {
        // if (this.activeName=='first') {
        //   if (!this.trademarkList.includes(this.caseDetailFoemData.caseType)) {
        //       this.elstepList = [
        //         {title: "案件详情", state: true, id: "ajxq-title"},
        //         {title: "案件详情", state: true, id: "ajxq-title"},
        //         {
        //           title: "商标信息",
        //           state:
        //             this.trademarkList.includes(this.caseDetailFoemData.caseType) ||
        //             this.mainCaseIds.length === 1,
        //           id: "sbxx-title"
        //         },
        //         {
        //           title: "商标申请说明",
        //           state: this.trademarkList.includes(this.caseDetailFoemData.caseType),
        //           id: "sbsqsm-title"
        //         },
        //         {title: "客户信息", state: true, id: "khxx-title"},
        //         {title: "申请人信息", state: true, id: "sqrxx-title"},
        //         {
        //         title: "阿里月报信息",
        //         state: this.caseDetailFoemData.custName && this.caseDetailFoemData.custName.includes('阿里'),
        //         id: "ali-title"
        //       },
        //       ].filter(item => item.state);
        //     } else {
        //       this.elstepList = [
        //         {title: "案件详情", state: true, id: "ajxq-title"},
        //         {title: "申请人信息", state: true, id: "sqrxx-title"},
        //         {
        //           title: "商标信息",
        //           state:
        //             this.trademarkList.includes(this.caseDetailFoemData.caseType) ||
        //             this.mainCaseIds.length === 1,
        //           id: "sbxx-title"
        //         },
        //         {
        //           title: "商标申请说明",
        //           state: this.trademarkList.includes(this.caseDetailFoemData.caseType),
        //           id: "sbsqsm-title"
        //         },
        //         {title: "客户信息", state: true, id: "khxx-title"},
        //         {
        //         title: "阿里月报信息",
        //         state: this.caseDetailFoemData.custName && this.caseDetailFoemData.custName.includes('阿里'),
        //         id: "ali-title"
        //       },
        //       ].filter(item => item.state);
        //     }
        // }
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
      },
    queryCaseInfoUrl() {
      queryCaseInfoUrl({ caseIds: this.caseIds })
        .then(response => {
          this.caseDetailFoemData = response.data
          this.queryCustomerReqUrl()
          // this.$nextTick(()=>{
          //   this.$refs.Electronic.complay()
          // })
          // this.$refs.Electronic.complay()
        }).catch(err=>{

      })
    },
    queryLitCaseInfoUrl(){
      lawsuitUrl({ caseIds: this.caseIds}).then(res=>{
        this.caseDetailFoemData = res.data
        this.queryCustomerReqUrl()
      })
    }
  },
  components: {
    PatentCaseDetail,
    TaskDetail,
    TaskProgress,
    caseDetail,
    CaseBill,
    ElectronicArchives,
    CaseInvestigators,
    litigationCaseDetail,
    SpecialInstructions,
    protectCaseDetail,
    BreadCrumbCase,
    SignificantChange
  }
}
</script>

<style lang="scss" scoped>
.topHeader{
  width: 100%;
  height:53px;
  line-height: 53px;
  background:rgba(0,0,0,0.6);
  box-shadow:0px 3px 6px 1px rgba(30, 30, 30, 0.35);
  position: absolute;
  left: 0;
  top: 0;
  color: #ffffff;
  div{
    margin-left: 20px;
    height:16px;
    font-size:16px;
  };
  .close{
    position: absolute;
    right: 20px;
    top: 17px;
    color: #ffffff;
    font-size: 20px;
    cursor: pointer;
    z-index: 1;
  }
}
.tilteSpan {
  font-size: 18px;
  padding: 15px 0px;
  color: #7199d5;

  span {
    display: block;
  }
}
section{
  position: relative;
  .selectCase{
    position: absolute;
    right: 0;
    line-height: 24px;
    top: 0;
    z-index: 10;
    /deep/ .el-input__inner{
      border: 0;
    }
  }
}
  .template-collapse-item{
    max-height: 300px;
    overflow-y: auto;
        position: relative;
        .collapse-title {
          flex: 1 0 90%;
          order: 1;
          .el-icon-delete {
            position: absolute;
            left: 50%;
            top: 20px;
            font-size: 16px;
            transform: translateX(-200px) translateY(-6px);
            /*transition: all .3s;*/
            &:hover {
              color: red;
            }
          }
          .el-icon-edit {
            position: absolute;
            left: 50%;
            top: 20px;
            font-size: 16px;
            transform: translateX(-250px) translateY(-6px);
            /*transition: all .3s;*/
            &:hover {
              color: #52A0F5;
            }
          }
        }
        >>> .el-collapse-item__header {
          display: flex;
          flex: 1 0 auto;
          height: 50px;
          order: -1;
          background-color: #fff;
          text-align: left;
        }
      }
  .table {
    >>>.el-table{
      height: auto;
      .cell {
        max-height: 70px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        .file-list {
          /*width: 100%;*/
          /*max-height: 70px;*/
          /*display: -webkit-box;*/
          /*-webkit-box-orient: vertical;*/
          /*-webkit-line-clamp: 3;*/
          /*overflow: hidden;*/
        }
      }
    }
  }
  .file-name{
    color: #409EFF;
    width: 140px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    cursor: pointer;
  }
  .el-icon-view {
      color: #409EFF;
      cursor: pointer;
  }
  .el-form {
    .el-row{
      &:last-child{
        border-bottom: 1px solid #ccc;
      }
    }
  }
  .new-task-dialog,.edit-task-dialog {
    .el-row {
      display: flex;

      .el-col {
        /*height: 100%;*/
        display: flex;
        border: 1px solid #ccc;
        border-bottom: none;

        .el-form-item {
          flex: 1;
          margin-bottom: 0;
          /*max-height: 120px;*/
          overflow-y: auto;
          display: flex;
          justify-content: left;

          > > > .el-form-item__label {
            background-color: #f1f1f1;
          }

          > > > .el-form-item__content {
            margin-left: 0 !important;
            width: 75%;
          }
        }
      }
    }
  }
  .filehover {
    background-color: #f7f7f7;
  }
  /deep/.el-tabs__content{
    height: var(--height)!important;
    //height: calc(100vh - 300px);
    overflow: auto!important;
  }
</style>
