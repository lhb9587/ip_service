<template>
  <div style="padding:0px 10px">
    <!--    <div class="div_style" v-if="!($store.getters.tmCaseTypeIdList.includes(billData.caseTypeId))">-->
    <!--      <el-row>-->
    <!--        <el-col :span="24" class="tilteSpan">-->
    <!--          <span id="-title">工时</span>-->
    <!--          <handTime  ref="handTime" @refreshList="queryWorkHours" :caseData="billData" style="display: inline-block;visibility: hidden"></handTime>-->
    <!--          <el-button size="mini" style="float:right" type="primary" @click="createHandTime">新建 </el-button>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-row style='margin-top:5px'>-->
    <!--        <el-col :span="24">-->
    <!--          <el-table @row-dblclick="(row)=>rowClick(row,'工时')" :height="height" :data="workHours" border current-row-key empty-text="暂无数据" :summary-method="getSummaries" fit highlight-current-row show-summary size="mini"-->
    <!--                    style="width: 100%;">-->

    <!--            <el-table-column align="left" label="开始时间"  width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.beginDate }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="结束时间" width="200">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.endDate }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="工时" width="300">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.approvedTimetime|| scope.row.time }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="描述" width="300">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.approvedDesc  || scope.row.workContent}}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->

    <!--            <el-table-column align="left" label="状态" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.wfStatus }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column prop="approvedAmountCust" align="left"  label="金额">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.approvedAmountCust ||scope.row.amount }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->


    <!--          </el-table>-->

    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--    </div>-->
    <!--    <div class="div_style" v-if="$store.getters.tmCaseTypeIdList.includes(billData.caseTypeId)">-->
    <!--      <el-row>-->
    <!--        <el-col :span="24" class="tilteSpan">-->
    <!--          <span id="-title">草单</span>-->
    <!--          <el-button size="mini" style="float:right" type="primary" @click='$router.push({-->
    <!--          path: `/workbench/finance/trawSheet/${billData.caseId}/creat`, query: { agentNum: billData.agentNum } })'>新建 </el-button>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-row style='margin-top:5px'>-->
    <!--        <el-col :span="24">-->
    <!--          <el-table @row-dblclick="(row)=>rowClick(row,'草单')" :height="height" :data="billData.caseBillRecordArray" border current-row-key empty-text="暂无数据" :summary-method="getSummaries" fit highlight-current-row show-summary size="mini"-->
    <!--            style="width: 100%;">-->

    <!--            <el-table-column align="left" label="费用种类"  width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.feeKindNameString }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="费用描述（中文）" width="200">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.descriptionCn }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="费用描述（英文）" width="300">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.descriptionEn }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->

    <!--            <el-table-column prop="manhourBill" align="left"  label="数量">-->
    <!--            </el-table-column>-->

    <!--            <el-table-column align="left" label="单价" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.priceBill }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->

    <!--            <el-table-column prop="amountBill" align="left"  label="金额">-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" prop="referDate" sortable label="开单日期" width="106">-->

    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="开单人" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.userNameString }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="开单人角色" width="90">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.rolename }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="草单状态" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.tobillStatusStr }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->

    <!--          </el-table>-->

    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--    </div>-->
    <!--    <div class="div_style">-->
    <!--      <el-row>-->
    <!--        <el-col :span="24" class="tilteSpan">-->
    <!--          <span id="-title">账单</span>-->
    <!--          <el-button size="mini" style="float:right" v-allow="160" type="primary" @click='$router.push({-->
    <!--          path: "/workbench/finance/off_bill/bill", query: { agentNum: billData.agentNum } })'>新建 </el-button>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-row style='margin-top:20px'>-->
    <!--        <el-col :span="24">-->
    <!--          <el-table @row-dblclick="(row)=>rowClick(row,'账单')" :height="height" :data="billData.caseBillArray" :summary-method="getSummaries"  border current-row-key empty-text="暂无数据" fit highlight-current-row show-summary size="mini" style="width: 100%;">-->
    <!--            <el-table-column align="left" label="账单号" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <a @click='$router.push("/workbench/finance/creatBill/" + scope.row.billId + "/view")'>{{ scope.row.billNo }}</a>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="官费" width prop="officialCost">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>￥{{ scope.row.officialCost }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->

    <!--            <el-table-column align="left" label="服务费" width prop="serviceCost">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>￥{{ scope.row.serviceCost }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="服务费(折扣后)" width prop="serviceCostDiscount">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>￥{{ scope.row.serviceCostDiscount }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="杂费"  width prop="otherCost">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>￥{{ scope.row.otherCost }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="总金额"  width prop="billSum">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>￥{{ scope.row.billSum}}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" prop="billDate" label="开单日期" sortable width="106">-->

    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="开单人" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.billUserIdString }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="账单状态" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.wfStatus }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->

    <!--          </el-table>-->

    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--    </div>-->
    <!--    <div class="div_style">-->
    <!--      <el-row>-->
    <!--        <el-col :span="24" class="tilteSpan">-->
    <!--          <span id="-title">内部账单</span>-->
    <!--          <el-button size="mini" style="float:right" v-allow="161" type="primary" @click='$router.push({-->
    <!--          path: "/workbench/finance/off_bill/insideBill", query: { agentNum: billData.agentNum } })'>新建 </el-button>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-row style='margin-top:5px'>-->
    <!--        <el-col :span="24">-->
    <!--          <el-table @row-dblclick="(row)=>rowClick(row,'内部账单')" :height="height" :data="billData.caseBillInternalArray" :summary-method="getSummaries"  border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">-->
    <!--            <el-table-column align="left" label="内部账单号" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.billInterNo }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="官费" width prop="officialCost">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>￥{{ scope.row.officialCost }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->

    <!--            <el-table-column align="left" label="服务费" width prop="serviceCost">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>￥{{ scope.row.serviceCost }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->

    <!--            <el-table-column align="left" label="杂费" width prop="otherCost">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>￥{{ scope.row.otherCost }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="总金额" width prop="total">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>￥{{ scope.row.total }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="承办组" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.costWkgIdString }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="客户组" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.wkgidString }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" sortable prop="fillinDate"  label="开单日期" width="106">-->

    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="开单人" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.reimburseUserIdString }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="内部账单状态" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.tobillStatusString }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->

    <!--          </el-table>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--    </div>-->
    <!--    <div class="div_style">-->
    <!--      <el-row>-->
    <!--        <el-col :span="24" class="tilteSpan">-->
    <!--          <span id="-title">费用</span>-->
    <!--          <el-button size="mini" style="float:right" type="primary" @click="$router.push(`/workbench/finance/addFeeDetail/1?agentNums=${billData.agentNum}`)">新建 </el-button>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-row style='margin-top:5px'>-->
    <!--        <el-col :span="24">-->
    <!--          <el-table :height="height" :data="feeList" :summary-method="getSummaries"  border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;" @row-dblclick="(row)=>rowClick(row,'费用')">-->
    <!--            <el-table-column align="left" label="科目" width >-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.feeName }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="总金额" width prop="total">-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>￥{{ scope.row.total}}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->

    <!--            <el-table-column align="left" label="费用承担组" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.costWkgIdStr }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->

    <!--            <el-table-column align="left" label="报销人所属组" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.reimburseWkgIdStr }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="报销人" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.reimburseUserIdStr }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" sortable label="填报日期" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{scope.row.fillinDate }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="是否境外账单" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.isAbroadBill }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="核销状态" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.tobillStatusStr }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column align="left" label="费用状态" width>-->
    <!--              <template slot-scope="scope">-->
    <!--                <span>{{ scope.row.wfStatus }}</span>-->
    <!--              </template>-->
    <!--            </el-table-column>-->
    <!--          </el-table>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--    </div>-->
    <el-tabs v-model="activeName" @tab-click="changeName">
      <el-tab-pane v-if="!tabPermissonList.includes('账单')" :label="`账单(${billData.caseBillArray&&billData.caseBillArray.length || 0})`" name="账单">
        <el-row>
          <el-col :span="24" class="tilteSpan">
            <!--            <span id="-title">账单</span>-->
            <el-button size="mini" style="float:right" v-allow="160" type="primary" @click='$router.push({
          path: "/workbench/finance/off_bill/bill", query: { agentNum: billData.agentNum } })'>新建
            </el-button>
          </el-col>
        </el-row>
        <el-row style='margin-top:5px'>
          <el-col :span="24">
            <el-table @row-dblclick="(row)=>rowClick(row,'账单')" :height="height" :data="billData.caseBillArray"
                      :summary-method="getSummaries" border current-row-key empty-text="暂无数据" fit highlight-current-row
                      show-summary size="mini" style="width: 100%;">
              <el-table-column align="left" label="账单号" width>
                <template slot-scope="scope">
                  <a style="color: #409eff;" @click='clickBillNo(scope.row)'>{{
                    scope.row.billNo }}</a>
                </template>
              </el-table-column>
              <el-table-column align="left" label="官费" width prop="officialCost">
                <template slot-scope="scope">
                  <span>￥{{ scope.row.officialCost }}</span>
                </template>
              </el-table-column>

              <el-table-column align="left" label="服务费" width prop="serviceCost">
                <template slot-scope="scope">
                  <span>￥{{ scope.row.serviceCost }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="服务费(折扣后)" width prop="serviceCostDiscount">
                <template slot-scope="scope">
                  <span>￥{{ scope.row.serviceCostDiscount }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="杂费" width prop="otherCost">
                <template slot-scope="scope">
                  <span>￥{{ scope.row.otherCost }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="总金额" width prop="billSum">
                <template slot-scope="scope">
                  <span>￥{{ scope.row.billSum}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" prop="billDate" label="开单日期" sortable width="106">

              </el-table-column>
              <el-table-column align="left" label="开单人" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.billUserIdString }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="账单类型" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.billStyleName }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="账单状态" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.wfStatus }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="收款日期" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.paymentDate }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="收款状态" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.paymentStatusStr }}</span>
                </template>
              </el-table-column>

            </el-table>

          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="!tabPermissonList.includes('内部账单')" :label="`内部账单(${billData.caseBillInternalArray&&billData.caseBillInternalArray.length || 0})`"
                   name="内部账单">
        <el-row>
          <el-col :span="24" class="tilteSpan">
            <!--          <span id="-title">内部账单</span>-->
            <el-button size="mini" style="float:right" v-allow="161" type="primary" @click='$router.push({
          path: "/workbench/finance/off_bill/insideBill", query: { agentNum: billData.agentNum } })'>新建
            </el-button>
          </el-col>
        </el-row>
        <el-row style='margin-top:5px'>
          <el-col :span="24">
            <el-table @row-dblclick="(row)=>rowClick(row,'内部账单')" :height="height"
                      :data="billData.caseBillInternalArray" :summary-method="getSummaries" show-summary border current-row-key
                      empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
              <el-table-column align="left" label="内部账单号" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.billInterNo }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="官费" width prop="officialCost">
                <template slot-scope="scope">
                  <span v-if="scope.row.officialCost && scope.row.officialCost !== 0">￥{{ scope.row.officialCost }}</span>
                </template>
              </el-table-column>

              <el-table-column align="left" label="服务费" width prop="serviceCost">
                <template slot-scope="scope">
                  <span v-if="scope.row.serviceCost && scope.row.serviceCost !== 0">￥{{ scope.row.serviceCost }}</span>
                </template>
              </el-table-column>

              <el-table-column align="left" label="杂费" width prop="otherCost">
                <template slot-scope="scope">
                  <span v-if="scope.row.otherCost && scope.row.otherCost !== 0">￥{{ scope.row.otherCost }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="总金额" width prop="total">
                <template slot-scope="scope">
                  <span v-if="scope.row.total && scope.row.total !== 0">￥{{ scope.row.total }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="承办组" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.costWkgIdString }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="客户组" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.wkgidString }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" sortable prop="fillinDate" label="开单日期" width="106">

              </el-table-column>
              <el-table-column align="left" label="开单人" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.reimburseUserIdString }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="内部账单状态" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.tobillStatusString }}</span>
                </template>
              </el-table-column>

            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="!tabPermissonList.includes('工时') && (!($store.getters.tmCaseTypeIdList.includes(billData.caseTypeId))||billData.caseTypeId == 94)"
                   :label="`工时(${total})`" name="工时">
        <el-row>
          <el-col :span="24" class="tilteSpan">
            <!--                  <span id="-title">工时</span>-->
<!--            <handTime ref="handTime" @refreshList="queryWorkHours" noQuery="1" :caseData="billData"-->
<!--                      style="display: inline-block;visibility: hidden"></handTime>-->
            <el-dialog
              title="新建工时"
              append-to-body
              :close-on-click-modal="false"
              :visible.sync="workHourView"
              width="45%"
              height="80%"
              class="abow_dialog"
            >
              <create-work-hour @refreshList="queryWorkHours" v-if="workHourView" :caseData="billData" @closeDialog="workHourView = false"></create-work-hour>
            </el-dialog>
            <el-button size="mini" style="float:right" type="primary" @click="createHandTime">新建</el-button>
          </el-col>
        </el-row>
        <el-row style='margin-top:5px'>
          <el-col :span="24">
            <AgGridVue
              style="width:100%;"
              :style="{height: clientHeight + 'px'}"
              class="ag-theme-balham"
              :columnDefs="columnDefs"
              :gridOptions="gridOptions"
              :rowData="workHours"
              rowSelection="multiple"
              @grid-ready="onGridReady"
              @rowDoubleClicked="rowDoubleClicked"
              :getContextMenuItems="getContextMenuItems"
              @sortChanged="refreshEvenRowsCurrencyData"
              @filterChanged="refreshEvenRowsCurrencyData"
              suppressAutoSize
              animateRows
              :suppressDragLeaveHidesColumns="true"
              :suppressMakeColumnVisibleAfterUnGroup="true"
              rowGroupPanelShow="always"
              :groupSelectsChildren="true"
              :suppressAggFuncInHeader="true"
              :localeText="$store.state.caseInformation.localeText"
              :frameworkComponents="frameworkComponents"
              :pinnedBottomRowData="pinnedBottomRowData"
            >
            </AgGridVue>
            <pagination style="margin-bottom: 10px" v-show="workHours.length > 0" :total="total"
                        :page-sizes="[10,50,100]"
                        :page.sync="hourPage.pageNo" :limit.sync="hourPage.pageSize"
                        @pagination="queryWorkHours"/>
<!--            <el-table-->
<!--              @header-dragend="(newWidth, oldWidth, column, event) => {headerDrage(newWidth, oldWidth, column, event)}"-->
<!--              @row-dblclick="(row)=>rowClick(row,'工时')" :height="height" :data="workHours" border-->
<!--              current-row-key empty-text="暂无数据" :summary-method="getSummaries" fit highlight-current-row-->
<!--              show-summary size="mini"-->
<!--              style="width: 100%;">-->

<!--              <el-table-column align="left" label="工时日期" prop="hourDate" sortable :width="caseWorkHourTable.hourDate || '150'">-->
<!--                <template slot-scope="scope">-->
<!--                  <span>{{ scope.row.hourDate }}</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column align="left" label="结束时间" :width="caseWorkHourTable.endDate || '150'">-->
<!--                <template slot-scope="scope">-->
<!--                  <span>{{ scope.row.endDate }}</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column align="left" label="员工" :width="caseWorkHourTable.whUserName || '150'">-->
<!--                <template slot-scope="scope">-->
<!--                  <span>{{ scope.row.whUserName }}</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column align="left" label="员工角色" :width="caseWorkHourTable.roleName || '150'">-->
<!--                <template slot-scope="scope">-->
<!--                  <span>{{ scope.row.roleName }}</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column align="left" label="记录工时" :width="caseWorkHourTable.time || '100'">-->
<!--                <template slot-scope="scope">-->
<!--                  <span>{{scope.row.time}}</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column align="left" label="核定工时" :width="caseWorkHourTable.approvedTime || '100'">-->
<!--                <template slot-scope="scope">-->
<!--                  <span>{{ scope.row.approvedTime}}</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column align="left" label="费率(/时)" :width="caseWorkHourTable.billRate || '200'">-->
<!--                <template slot-scope="scope">-->
<!--                  <span v-if="scope.row.wfStatus=='待审核'">{{scope.row.criterionRate}}</span>-->
<!--                  <span v-else>{{ scope.row.billRate}}</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column align="left" label="描述" :width="caseWorkHourTable.workContent || '300'">-->
<!--                <template slot-scope="scope">-->
<!--                  <span v-if="scope.row.wfStatus=='待审核'">{{scope.row.workContent}}</span>-->
<!--                  <span v-else>{{ scope.row.approvedDesc||scope.row.workContent}}</span>-->
<!--                </template>-->
<!--              </el-table-column>-->

<!--              <el-table-column align="left" label="状态" :width="caseWorkHourTable.wfStatus || '100'" prop="wfStatus" :filters="headWorkFilters['wfStatus']"-->
<!--                               :filter-method="filterHandler">-->
<!--                <template slot-scope="scope">-->
<!--                  <span>{{ scope.row.wfStatus }}</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column prop="approvedAmountCust" align="left" label="金额" :width="caseWorkHourTable.amount || '100'">-->
<!--                <template slot-scope="scope">-->
<!--                  <span v-if="scope.row.wfStatus=='待审核'">{{scope.row.amount}}</span>-->
<!--                  <span v-else>{{ scope.row.approvedAmountCust}}</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column prop="billNo" align="left" label="核销账单" :width="caseWorkHourTable.billNo || '150'">-->
<!--                <template slot-scope="scope">-->
<!--                  <span class="pointer" @click="clickBillNo(scope.row)">{{ scope.row.billNo}}</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column align="left" label="出差路途" :width="caseWorkHourTable.hasBusinessTripStr || '60'">-->
<!--                <template slot-scope="scope">-->
<!--                  <span>{{scope.row.hasBusinessTripStr}}</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--            </el-table>-->

          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="!tabPermissonList.includes('草单') && ($store.getters.tmCaseTypeIdList.includes(billData.caseTypeId) || $store.getters.patentCaseTypeIdList.includes(billData.caseTypeId))"
        :label="`草单(${billData.caseBillRecordArray&&billData.caseBillRecordArray.length || 0})`" name="草单">
        <el-row>
          <el-col :span="24" class="tilteSpan">
            <!--          <span id="-title">草单</span>-->
            <el-button size="mini" style="float:right" type="primary" @click='moreEdit'>批量编辑
            </el-button>
          </el-col>
        </el-row>
        <el-row style='margin-top:5px'>
          <el-col :span="24">
            <el-table @row-contextmenu="rowContextmenu" @row-dblclick="(row)=>rowClick(row,'草单')" :height="height"
                      :data="billData.caseBillRecordArray"
                      border current-row-key empty-text="暂无数据" :summary-method="getSummaries" fit highlight-current-row
                      show-summary size="mini"
                      style="width: 100%;">

              <el-table-column align="left" label="费用种类" width sortable prop="feeKindNameString"
                               :filters="headCaoFilters['feeKindNameString']" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <span>{{ scope.row.feeKindNameString }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="费用描述（中文）" width="200">
                <template slot-scope="scope">
                  <span>{{ scope.row.descriptionCn }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="费用描述（外文）" width="300">
                <template slot-scope="scope">
                  <span>{{ scope.row.descriptionEn }}</span>
                </template>
              </el-table-column>

              <el-table-column prop="manhourBill" align="left" label="数量">
              </el-table-column>

              <el-table-column align="left" label="单价" prop="priceBill" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.priceBill }}</span>
                </template>
              </el-table-column>

              <el-table-column prop="amountBill" align="left" label="金额">
              </el-table-column>
              <el-table-column align="left" prop="referDate" sortable label="开单日期" width="106">

              </el-table-column>
              <el-table-column width="100" label="年号">
                <template slot-scope="scope">
                  <span>{{ scope.row.yearNo }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="开单人" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.userNameString }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="开单人角色" width="90">
                <template slot-scope="scope">
                  <span>{{ scope.row.rolename }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="草单状态" width sortable prop="tobillStatusStr"
                               :filters="headCaoFilters['tobillStatusStr']" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <span>{{ scope.row.tobillStatusStr }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="核销账单号" width="105" prop="billNo">
                <template slot-scope="scope">
                  <span>{{ scope.row.billNo }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="草单类型" width sortable prop="billStyleStr"
                               :filters="headCaoFilters['billStyleStr']" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <span>{{ scope.row.billStyleStr }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="备注" width="200" prop="memo">
                <template slot-scope="scope">
                  <span>{{ scope.row.memo }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="清单编号" width sortable prop="billStyleStr"
                               :filters="headCaoFilters['billStyleStr']" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <span>{{ scope.row.payListNo }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="制作日期" width sortable prop="billStyleStr"
                               :filters="headCaoFilters['billStyleStr']" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <span>{{ scope.row.createDate }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="缴费日期" width sortable prop="billStyleStr"
                               :filters="headCaoFilters['billStyleStr']" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <span>{{ scope.row.payDate }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="发票号" width sortable prop="billStyleStr"
                               :filters="headCaoFilters['billStyleStr']" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <span>{{ scope.row.invoiceNo }}</span>
                </template>
              </el-table-column>

            </el-table>

          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="!tabPermissonList.includes('费用')" :label="`费用(${feeList&&feeList.length || 0})`" name="费用">
        <el-row>
          <el-col :span="24" class="tilteSpan">
            <!--            <span id="-title">费用</span>-->
            <el-button size="mini" style="float:right" type="primary"
                       @click="$router.push(`/workbench/finance/addFeeDetail/1?agentNums=${billData.agentNum}`)">新建
            </el-button>
          </el-col>
        </el-row>
        <el-row style='margin-top:5px'>
          <el-col :span="24">
            <el-table :height="height" :data="feeList" :summary-method="feeGetSummaries" border current-row-key
                      empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;"
                      show-summary
                      @row-dblclick="(row)=>rowClick(row,'费用')"
            >
              <el-table-column align="left" label="科目" sortable width prop="feeName" :filters="headFilters['feeName']" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <span>{{ scope.row.feeName }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="总金额" sortable width prop="total" :filters="headFilters['total']" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <span>￥{{ scope.row.total}}</span>
                </template>
              </el-table-column>

              <el-table-column align="left" label="费用承担组" sortable width prop="costWkgIdStr" :filters="headFilters['costWkgIdStr']" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <span>{{ scope.row.costWkgIdStr }}</span>
                </template>
              </el-table-column>

              <el-table-column align="left" label="报销人所属组" sortable width prop="reimburseWkgIdStr" :filters="headFilters['reimburseWkgIdStr']" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <span>{{ scope.row.reimburseWkgIdStr }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="报销人" sortable width prop="reimburseUserIdStr" :filters="headFilters['reimburseUserIdStr']" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <span>{{ scope.row.reimburseUserIdStr }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" prop="fillinDate" sortable label="填报日期" width :filters="headFilters['fillinDate']" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <span>{{scope.row.fillinDate }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
                prop="isAbroadBill"
                sortable
                label="是否境外账单"
                width
                :filters="headFilters['isAbroadBill']"
                :filter-method="filterHandler"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.isAbroadBill }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" sortable prop="tobillStatusStr" label="核销状态" width
                               :filters="headFilters['tobillStatusStr']"
                               :filter-method="filterHandler"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.tobillStatusStr }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" prop="wfStatus" sortable label="费用状态" width :filters="headFilters['wfStatus']" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <span>{{ scope.row.wfStatus }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="!tabPermissonList.includes('结余') && ['内-外', '外-外'].includes(billData.appFromto)" :label="`结余(${billData.caseSurplusArray&&billData.caseSurplusArray.length || 0})`" name="结余">
        <el-row style='margin-top:5px'>
          <el-col :span="24" class="yingyu">
            <div>
              <div style="color: #52A0F5">个案结余</div>
              <el-table :height="250" :data="billData.caseSurplusArray&&billData.caseSurplusArray.filter(item => item.subject === '个案结余')"
                        border current-row-key empty-text="暂无数据" fit highlight-current-row
                        size="mini" style="width: 100%;">
                <el-table-column
                  label="境外报价"
                >
                  <el-table-column
                    prop="quotePrice"
                    label="报价金额"
                  >
                    <template slot-scope="scope">
                      {{formatAmount(scope.row.quotePrice)}}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="支出"
                >
                  <el-table-column
                    prop="abroadPay"
                    width="100px"
                    label="境外支出金额"
                  >
                    <template slot-scope="scope">
                      {{formatAmount(scope.row.abroadPay)}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="homePay"
                    width="100px"
                    label="境内支出金额"
                  >
                    <template slot-scope="scope">
                      {{formatAmount(scope.row.homePay)}}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="收入"
                >
                  <el-table-column
                    prop="homeIncome"
                    width="90px"
                    label="我方代理费"
                  >
                    <template slot-scope="scope">
                      {{formatAmount(scope.row.homeIncome)}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="abroadIncome"
                    label="境外费用"
                  >
                    <template slot-scope="scope">
                      {{formatAmount(scope.row.abroadIncome)}}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="预计结余"
                >
                  <el-table-column
                    width="125px"
                    prop="predictSurplus"
                    label="收入-报价金额"
                  >
                    <template slot-scope="scope">
                      {{formatAmount(scope.row.predictSurplus)}}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="实际结余"
                >
                  <el-table-column
                    prop="actualSurplus"
                    label="收入-支出"
                  >
                    <template slot-scope="scope">
                      {{formatAmount(scope.row.actualSurplus)}}
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </div>
            <div style="margin-top: 10px">
              <div  style="color: #52A0F5">整单结余</div>
              <el-table :height="250" :data="billData.caseSurplusArray&&billData.caseSurplusArray.filter(item => item.subject === '整单结余')"
                        border current-row-key empty-text="暂无数据" fit highlight-current-row
                        size="mini" style="width: 100%;">
                <el-table-column
                  label="境外报价"
                >
                  <el-table-column
                    prop="quotePrice"
                    label="报价金额"
                  >
                    <template slot-scope="scope">
                      {{formatAmount(scope.row.quotePrice)}}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="支出"
                >
                  <el-table-column
                    prop="abroadPay"
                    width="100px"
                    label="境外支出金额"
                  >
                    <template slot-scope="scope">
                      {{formatAmount(scope.row.abroadPay)}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="homePay"
                    width="100px"
                    label="境内支出金额"
                  >
                    <template slot-scope="scope">
                      {{formatAmount(scope.row.homePay)}}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="收入"
                >
                  <el-table-column
                    width="90px"
                    prop="homeIncome"
                    label="我方代理费"
                  >
                    <template slot-scope="scope">
                      {{formatAmount(scope.row.homeIncome)}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="abroadIncome"
                    label="境外费用"
                  >
                    <template slot-scope="scope">
                      {{formatAmount(scope.row.abroadIncome)}}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="预计结余"
                >
                  <el-table-column
                    width="125px"
                    prop="predictSurplus"
                    label="收入-报价金额"
                  >
                    <template slot-scope="scope">
                      {{formatAmount(scope.row.predictSurplus)}}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="实际结余"
                >
                  <el-table-column
                    prop="actualSurplus"
                    label="收入-支出"
                  >
                    <template slot-scope="scope">
                      <span :style="{color: scope.row.actualSurplus < scope.row.homeIncome ? 'red' : ''}">
                      {{formatAmount(scope.row.actualSurplus)}}
                      </span>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </div>

          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="!tabPermissonList.includes('发票')" :label="`发票(${billData.receiptList&&billData.receiptList.length || 0})`" name="发票">
        <el-row style='margin-top:5px'>
          <el-col :span="24">
            <el-table :height="height" :data="billData.receiptList"
                      border current-row-key empty-text="暂无数据" fit highlight-current-row
                      size="mini" style="width: 100%;">
              <el-table-column label="账单号" prop="billNos">
              </el-table-column>
              <el-table-column label="国税票号" prop="stateTaxNo">
              </el-table-column>
              <el-table-column label="发票金额" prop="receiptTotal">
                <template slot-scope="scope">
                  <span>￥{{ scope.row.receiptTotal}}</span>
                </template>
              </el-table-column>
              <el-table-column label="发票状态" prop="wfStatus">
              </el-table-column>
              <el-table-column label="开具人" prop="optName">
              </el-table-column>
              <el-table-column label="申请日期" prop="appDate">
              </el-table-column>

            </el-table>

          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane v-if="!tabPermissonList.includes('境外账单')" :label="`境外账单(${caseAbroadBillList&&caseAbroadBillList.length || 0})`" name="境外账单">
        <el-row style='margin-top:5px'>
          <el-col :span="24">
<!--            <el-table :height="height" :data="caseAbroadBillList"-->
<!--                      border current-row-key empty-text="暂无数据" fit highlight-current-row-->
<!--                      size="mini" style="width: 100%;">-->
<!--              <el-table-column label="境外账单号" prop="abroadBillNo">-->
<!--              </el-table-column>-->
<!--              <el-table-column label="境外账单日" prop="abroadBillDate">-->
<!--              </el-table-column>-->
<!--              <el-table-column label="我方账单收款情况" prop="paymentStatusStr">-->
<!--              </el-table-column>-->
<!--              <el-table-column label="境外账单电子版">-->
<!--                <template slot-scope="scope">-->
<!--                  <div style="display: flex" v-for="(item, index) in (scope.row.materialList || [])" :key="item.materialId">-->
<!--                    <span class="pointer ellipsis" :title="item.materialName" @click="preView(item)">{{item.materialName}}</span>-->
<!--                  </div>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column label="境外代理所" prop="agencyCustName">-->
<!--              </el-table-column>-->
<!--              <el-table-column label="境外账单费用概要" prop="abroadContent">-->
<!--              </el-table-column>-->
<!--              <el-table-column label="境外账单币种" prop="curIdString">-->
<!--              </el-table-column>-->
<!--              <el-table-column label="境外账单总金额">-->
<!--                <template slot-scope="scope">-->
<!--                  {{formatAmount(scope.row.abroadBillSum)}}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column label="流程状态" prop="processName">-->
<!--              </el-table-column>-->

<!--            </el-table>-->
            <abroad-bill-grid :case-id="billData.caseId" :height="height" :caseAbroadBillList="caseAbroadBillList"></abroad-bill-grid>

          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <TimeDialog :view="view" :dataTime="data" @closeDialog="view=false" :sign="sign"></TimeDialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
  import {
    billRecorddeleteUrl
  } from '@/api/billApi'
  import TimeDialog from '@/views/workbench/workTime/components/TimeDialog.vue'
  import { log } from 'util'
  import { toFixed1, toFixed2, formatAmount } from '@/utils/filters'
  import { queryCaseFeeInfo, queryWorkHours } from '@/api/caseList'
  // import handTime from '@/views/workbench/workTime/components/handTime.vue'
  import CreateWorkHour from "../../workTime/components/CreateWorkHour";
  import {queryCaseAbroadBillInfo} from "../../../../api/caseList";
  import {getProgID} from "../../../../utils/editInOffice";
  import AbroadBillGrid from "./AbroadBillGrid";
  import Summary from '@/components/Summary'

  export default {
    name: 'caseBill',
    components: {
      AbroadBillGrid,
      CreateWorkHour,
      // handTime,
      TimeDialog,
      Pagination},
    props: {
      billData: {
        type: Object
      }
    },
    data() {
      return {
        total: 0,
        hourPage: {
          pageSize: 10,
          pageNo: 1
        },
        frameworkComponents: {
          CountStatusBarComponent: Summary
        },
        pinnedBottomRowData:null,
        columnDefs: [],
        gridApi: {},
        preferenceList: [
          // {'label': '对比名称', prop: 'operateDate', 'width': '', editable: true},
          {'label': '工时日期', prop: 'hourDate',},
          {'label': '结束时间', prop: 'endDate', 'width': ''},
          {'label': '员工', prop: 'whUserName', 'width': ''},
          {'label': '员工角色', prop: 'roleName', 'width': ''},
          {'label': '记录工时', prop: 'time', 'width': ''},
          {'label': '核定工时', prop: 'approvedTime', 'width': ''},
          {'label': '费率(/时)', prop: 'criterionRate', 'width': ''},
          {'label': '描述', prop: 'workContent', 'width': ''},
          {'label': '状态', prop: 'wfStatus', 'width': ''},
          {'label': '金额', prop: 'amount', 'width': ''},
          {'label': '核销账单', prop: 'billNo', 'width': ''},
          {'label': '出差路途', prop: 'hasBusinessTripStr', 'width': ''},
          // {'label': '发票号', prop: 'invoiceNo', 'width': ''},
          // {'label': '日志类型', prop: 'logType', 'width': ''},
          // {'label': '操作内容', prop: 'changeLog', flex: 1},
        ],
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 60,
            'pinned': 'left', // 固定再左边
            enableRowGroup: true,
            // enablePivot: true,
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer
          }
        ],
        gridOptions: {
          statusBar: {
            statusPanels: [
              {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
              {statusPanel: 'agSelectedRowCountComponent', align: 'left'}
            ]
          }
        },
        caseAbroadBillList: [],
        caseWorkHourTable: {},
        workHourView: false,
        sign: '',
        filterTotal: 0,
        headFilters: {},
        headCaoFilters: {},
        headWorkFilters: {},
        feeList: [],
        workHours: [],
        height: 450,
        view: false,
        data: {},
        // activeName: this.$store.getters.tmCaseTypeIdList.includes(this.billData.caseTypeId) ? '账单' : '工时',
        activeName: localStorage.getItem(this.$options.name) || '账单',
        ch_caseTypr: '',
        tabPermissonList: [], // 无权查看列表
      }
    },
    filters: {
      money: function(value) {
        if (!value) return ''
        // value = value.toString()
        return value.toFixed(2)
      }
    },
    watch: {},
    computed: {
      totleAll: function() {
        let totle = 0
        this.billData.caseBillRecordArray.forEach(element => {
          totle += Number(element.amountBill)
        })
        return totle
      },
      clientHeight() {
        return document.documentElement.clientHeight - 400
      },
    },
    methods: {
      rowDoubleClicked(params) {
        if (params.data.isHeji)return // 最后一行return
        this.rowClick(params.data,'工时')
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid' && !params.data.isHeji) {
          return params.rowIndex + 1
        }
        if (params.colDef.field === 'sid' && params.data.isHeji) {
          return `<span>合计</span>`
        }
        if (params.colDef.field === 'billNo') {
          const h = this.$createElement
          const vnode = h('div', {
            'class': {
              'baoJia': true
            },
            attrs: {
              title: params.value
            },
            on: {
              click: () => this.clickBillNo(params.data)
            }
          }, params.value)
          const div = document.createElement('div')
          this.__patch__(div, vnode, true, false)
          return div
          return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
        }
        if (params.colDef.field === 'criterionRate') {
            const text = params.data.wfStatus == '待审核' ? params.data.criterionRate : params.data.billRate
          return `<span title="${text}">${text ? text : ''}</span>`
        }
        if (params.colDef.field === 'workContent') {
            const text = params.data.wfStatus == '待审核' ? params.data.workContent : (params.data.workContent || params.data.approvedDesc)
          return `<span title="${text}">${text ? text : ''}</span>`
        }
        if (params.colDef.field === 'amount' && !params.data.isHeji) {
            const text = params.data.wfStatus == '待审核' ? params.data.amount : params.data.approvedAmountCust
          return `<span title="${text}">${text ? text : ''}</span>`
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      refreshEvenRowsCurrencyData(params) {
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            setTimeout(() => {
              rowNode.setDataValue(
                'sid',
                rowNode.rowIndex + 1)
            }, 0)
          })
        }
        this.pinnedBottomRowDataFunc()
      },
      onGridReady(params) {
        this.gridApi = params.api
        // params.api.sizeColumnsToFit()
      },
      getContextMenuItems(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList1(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.node.rowIndex, params.value, params.node)
          }
        }))
      },
      copy(row, value) {
        if (value) {
          this.$copyText(value)
        }
      },
      getRowContextmenuList1(row) {
        return [
          {name: '复制', action: 'copy'},
        ].filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return true
          }
        })
      },
      headerDrage(newWidth, oldWidth, column, event) {
        this.caseWorkHourTable[column.property] = newWidth
        localStorage.setItem('caseWorkHourTable', JSON.stringify(this.caseWorkHourTable))
      },
      clickBillNo(row) {
        window.open("/#/workbench/finance/creatBill/" + row.billId + "/view")
      },
      checkWritePermisson() {
        this.tabPermissonList = this.billData.searchFanweiList && this.billData.searchFanweiList.filter(item => item.cjType == 2 && item.notSearch).map(item => item.notSearch) || []
      },
      formatAmount(value){
        if (value) return formatAmount(value)
        return '0.00'
      },
      changeName() {
        localStorage.setItem(this.$options.name, this.activeName)
      },
      getRowContextmenuList(row) {
        return [
          { name: '复制', action: 'copy' },
          { name: '修改', action: 'takemodify', permissions: 168 },
          { name: '删除', action: 'delTimelimit', permissions: 169 }
        ].filter(item => {
          if (item.permissions) {
            return (this.$store.getters.permissions.includes(item.permissions) || true) && (row.tobillStatusStr !== '已核销')
          } else {
            return true
          }
        })
      },
      rowContextmenu(row, column, event) {
        const that = this
        this.$ContextMenu({
          event, // 传入鼠标事件
          menu: this.getRowContextmenuList(row)
        }).then(rs => {
          if (rs) {
            this[rs](row, column, event)
          }
        })
      },
      moreEdit() {
        if (this.billData.caseBillRecordArray.filter(item => item.tobillStatusStr != '已核销').length) {
          const billRecordIds = this.billData.caseBillRecordArray.map(it => it.billRecordId).join('&')
          this.$router.push(`/workbench/finance/trawSheet/${billRecordIds}/edit?from=seeCase`)
        } else {
          this.$router.push({
            path: `/workbench/finance/trawSheet/${this.billData.caseId}/creat`,
            query: { agentNum: this.billData.agentNum }
          })
        }
      },
      takemodify(row) {
        // const billRecordIds = this.billData.caseBillRecordArray.map(it => it.billRecordId).join('&')
        this.$router.push(`/workbench/finance/trawSheet/${row.billRecordId}/edit?from=seeCase&opt=2`)
        // this.$router.push(`/workbench/finance/trawSheet/${billRecordIds}/edit?from=seeCase&currentBillRecordId=${row.billRecordId}`)
      },
      delTimelimit(row) {
        this.$confirm('确定要删除该草单吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          billRecorddeleteUrl({ billRecordId: row.billRecordId }).then(
            response => {
              if (response.success) {
                const index = this.billData.caseBillRecordArray.indexOf(row)
                this.billData.caseBillRecordArray.splice(index, 1)
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
              } else {
                this.$message.error(response.message)
              }
            }
          )
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      filterHandler(value, row, column) {
        const property = column['property']
        // let filterList = this.feeList.filter(item=> item[property] == value)
        // let allTotal = 0
        // filterList.forEach(item=>{
        //   allTotal += item.total
        // })
        // this.filterTotal = allTotal
        return row[property] === value
      },
      rowClick(row, type) {
        if (type == '工时') {
          this.data = row
          this.sign = '查看'
          this.view = true
        }
        if (type == '草单') {
          this.$router.push(`/workbench/finance/trawSheet/${row.billRecordId}/see`)
        }
        if (type == '账单') {
          this.$router.push(`/workbench/finance/creatBill/${row.billId}/view`)
        }
        if (type == '内部账单') {
          this.$router.push(`/workbench/finance/cinBill/${row.billInterId}/see`)
        }
        if (type == '费用') {
          // this.$router.push(`/workbench/finance/addFeeDetail/2?feeId=${row.feeId}`)
          this.$router.push(`/workbench/finance/seeFeeDetail?feeId=${row.feeId}`)
        }
      },
      createHandTime() {
        // this.$refs.handTime.isShow = true
        this.workHourView = true
      },
      feeGetSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：'
            return
          }
          const values = data.map(item => {
            if (column.property == 'approvedAmountCust' && isNaN(Number(item[column.property]))) {
              if (data.wfStatus == '待审核') {
                return Number(item['amount'])
              } else {
                return Number(item[column.property])
              }

            }
            return Number(item[column.property])
          })
          // console.log(values);
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {

                return prev + curr
              } else {
                return prev
              }
            }, 0)

            sums[index] = toFixed2(sums[index])
            sums[index] = '￥ ' + sums[index]
          }
        })
        return sums
      },
      pinnedBottomRowDataFunc() {
        this.$nextTick(() => {
          if(this.gridApi.rowModel){
            const columnDisplay = ['amount']
            // const list = JSON.parse(JSON.stringify(this.workHours))
            console.log(this.gridApi)
            console.log(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data))
            const list = JSON.parse(JSON.stringify(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data)))
            list.forEach(item => {
              if (item.wfStatus !== '待审核') {
                item.amount = item.approvedAmountCust
              }
            })
            this.pinnedBottomRowData = [{isHeji: true, ...this.$commonUtils.pinnedBottomRowData(list, this.columnDefs, columnDisplay)[0]}]
          }
        })

      },
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：'
            return
          }
          const values = data.map(item => {
            if (column.property == 'approvedAmountCust' && isNaN(Number(item[column.property]))) {
              if (data.wfStatus == '待审核') {
                return Number(item['amount'])
              } else {
                return Number(item[column.property])
              }

            }
            return Number(item[column.property])
          })
          // console.log(values);
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {

                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = toFixed2(sums[index])
            if (column.property == 'manhourBill') {
              sums[index] = sums[index]
            } else {
              sums[index] = '￥ ' + sums[index]
            }
          }
        })
        return sums
      },
      queryCaseFeeInfo() {
        if (!this.billData.caseId) return
        queryCaseFeeInfo({ caseId: this.billData.caseId }).then(res => {
          this.feeList = res.data
          if (this.feeList.length) {
            Object.keys(this.feeList[0]).forEach(item => {
              this.headFilters[item] = []
            })
            this.feeList.forEach(item => {
              for (let key in item) {
                if (this.headFilters.hasOwnProperty(key)) {
                  if (this.headFilters[key].find(i => i.text == item[key])) {

                  } else {
                    this.headFilters[key].push({ text: item[key], value: item[key] })
                  }
                }
              }
            })
          }
        })
      },
      queryWorkHours() {
        const data = {
          ...this.hourPage,
          caseId: this.billData.caseId
        }

        queryWorkHours(data).then(res => {
          this.workHours = res.data.workhoursList
          this.total = res.total
          // this.headWorkFilters = this.$commonUtils.tableFilter(this.workHours)
          this.pinnedBottomRowDataFunc()
        })
      },
      queryCaseAbroadBillInfo() {
        queryCaseAbroadBillInfo({
          caseId: this.billData.caseId,
          pageSize: 9999
        }).then(res => {
          this.caseAbroadBillList = res.data
        })
      }

    },
    created() {
      this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
        headerName: item.label,
        flex: item.flex,
        field: item.prop,
        resizable: true,
        sortable: true,
        editable: item.editable && this.type === 'edit',
        // width: item.width || 150,
        flex: 1,
        filter: 'agSetColumnFilter',
        cellRenderer: this.cellRenderer,
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        enableRowGroup: true,
        filterParams: {
          defaultToNothingSelected: true,
          newRowsAction: 'keep',
          comparator: (a, b) => {
            return this.$commonUtils.sort(a, b, item.prop)
          }
        }
      }))]
      if (localStorage.getItem('caseWorkHourTable')) {
        this.caseWorkHourTable = JSON.parse(localStorage.getItem('caseWorkHourTable'))
      }
      if (this.billData.caseBillRecordArray.length) {
        this.headCaoFilters = this.$commonUtils.tableFilter(this.billData.caseBillRecordArray)
      }
      this.queryCaseFeeInfo()
      this.queryCaseAbroadBillInfo()
      if (!this.$store.getters.tmCaseTypeIdList.includes(this.billData.caseTypeId) || this.billData.caseTypeId == 94) {
        this.queryWorkHours()
      }
      this.checkWritePermisson()

    },
    mounted() {
    }
  }
</script>
<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .div_style {
    margin-bottom: 10px;
    padding: 5px 10px;
    background: inherit;
    background-color: rgba(255, 255, 255, 1);
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(201, 201, 201, 1);
    border-radius: 0px;
    -moz-box-shadow: 2px 2px 5px rgba(201, 201, 201, 1);
    -webkit-box-shadow: 2px 2px 5px rgba(201, 201, 201, 1);
    box-shadow: 2px 2px 5px rgba(201, 201, 201, 1);
  }

  .createPost-container {
    position: relative;
    /*padding: 10px 2px;*/
    border: 1px solid #d7d7d7;
    margin: 15px 20px;

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
      top: 0;

    }

    .el-row {
      margin: 0px;
    }

    .postInfo-container-item {
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
    }

    .el-input,
    .el-select {
      width: 77%;
    }

    .el-form-item__content {
      text-align: left;
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

    .postInfo-container-item {
      display: flex;
      width: 100%;

      .el-form-item__content {
        text-align: left;
        display: inline-table;
        width: 70%;
        min-width: 70%;
        padding: 5px 15px;
      }

      .el-form-item__label {
        line-height: 43px;
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
    height: 20px;
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

  .totleSpan {
    display: inline-block;
    border: 1px solid #ccc;
    text-align: center;
    padding: 5px 100px;
    margin-top: 12px;
  }
  .yingyu{
    >>>.el-table {
      .cell{
        text-align: center;
      }
    }
  }
  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      min-height: calc(60%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
      padding: 0 10px 10px 10px;
    }
  }
  > > > .baoJia {
    cursor: pointer;
    color: #409eff;
    display: inline-block;
  }

  > > > .ag-row-selected {
    .baoJia {
      cursor: pointer;
      color: #fff;
    }
  }
</style>

