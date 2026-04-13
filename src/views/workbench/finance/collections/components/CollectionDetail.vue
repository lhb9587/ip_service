<template>
  <div>
    <el-form ref="postForm" size="small" :rules="rules" class="form-container" :model="collectData">
      <div class="form-con">
        <el-row>
          <el-col class="form-con-item" :span="type === 'create' ? 24 : 20">
            <el-row class="form-border">
              <el-col :span="24">
                <div class="sticky">
                  <el-row class="" style="border-top: 1px solid #d7d7d7">
                    <el-col :span="12">
                      <el-form-item label="案件文号:" class="postInfo-container-item">
<!--                        {{collectData.showRefno}}-->
                        <span class="title-mx" style="cursor: pointer" @click="takeCaseDetail(collectData)">{{collectData.showRefno}}</span>
                        <el-button style="margin-left: 10px" size="mini" type="primary" v-if="type!='view'"
                                   @click="changeCaseVisible=true">修改
                        </el-button>
                        <ChooseCase
                          :dialogVisible="changeCaseVisible"
                          :agentNums="collectData.caseArray && collectData.caseArray.map(item=>item.agentNum).join('\n')"
                          @closed="ChooseCaseClose"
                          rules="custId"
                          @getList="getList"></ChooseCase>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="状态:" class="postInfo-container-item">
                        {{collectData.wfStatus}}
                        <!--                        <span v-if="type === 'view'">{{collectData.showRefno}}</span>-->
                        <!--                        <el-input v-else v-model="collectData.showRefno" placeholder="请输入案件文号"></el-input>-->
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="收款种类:" class="postInfo-container-item" prop="recvKind">
                        <span v-if="type === 'view'">{{collectData.recvKindStr}}</span>
                        <el-select v-else default-first-option :clearable='true' placeholder="请选择收款种类"
                                   v-model="collectData.recvKind" filterable>
                          <el-option :label="item.typeName" :value="item.id" v-for="item in recvKindList"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="收款类型:" class="postInfo-container-item">
                        <span v-if="type === 'view'">{{collectData.recvType}}</span>
                        <el-select v-else default-first-option :clearable='true' placeholder="请选择收款类型"
                                   v-model="collectData.recvType" filterable>
                          <el-option :label="item.typeName" :value="item.typeName"
                                     v-for="item in recvTypeList"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="收款日期:" class="postInfo-container-item">
                        <span v-if="type === 'view'">{{collectData.recvDate}}</span>
                        <el-date-picker
                          v-else
                          v-model="collectData.recvDate"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="收款账户:" class="postInfo-container-item" prop="payAccountId">
                        <span v-if="type === 'view'">{{collectData.payAccountIdStr}}</span>
                        <el-select v-else filterable clearable default-first-option v-model="collectData.payAccountId"
                                   placeholder>
                          <el-option v-for="(item,key) in accountList" :key="key" :label="item.payAccountName"
                                     :value="item.payAccountId"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="客户:" class="postInfo-container-item">
                        <span v-if="type === 'view'">{{collectData.custIdStr}}</span>
                        <el-select v-else size="mini" :remote-method="remoteMethod" default-first-option remote :automatic-dropdown="true" value-key='value' v-model="collectData.custId" :filterable='true' placeholder="请选择" clearable ref="searchSelect">
                          <el-option v-for="item in custList" :value="item.custId" :key="item.custId" :label="item.name">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="付款日期:" class="postInfo-container-item">
                        <span v-if="type === 'view'">{{collectData.payDate}}</span>
                        <el-date-picker
                          v-else
                          v-model="collectData.payDate"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="付款客户/对方:" class="postInfo-container-item">
                        <span v-if="type === 'view'">{{collectData.payCust}}</span>
                        <el-input v-else v-model="collectData.payCust" placeholder="请输入付款对方"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="现在汇率:" class="postInfo-container-item">
                        <span
                          v-if="type === 'view'">{{$wUtil.formatFloat(collectData.currExchangeRate, 2) || ''}}</span>
                        <div v-else>
                          <el-input v-if="currExchangeBlur" @blur="currExchangeBlur = false"
                                    v-model="collectData.currExchangeRate" placeholder="请输入现在汇率"
                                    @keyup.enter.native="changeCurrExchangeRate"
                                    @change="changeCurrExchangeRate"></el-input>
                          <el-input v-else @focus="currExchangeBlur = true"
                                    :value="$wUtil.formatFloat(collectData.currExchangeRate, 2) || ''"
                                    placeholder="请输入现在汇率" @change="changeCurrExchangeRate"></el-input>
                        </div>

                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="收到币种:" class="postInfo-container-item">
                        <span v-if="type === 'view'">{{collectData.recvCurIdStr}}</span>
                        <el-select v-else default-first-option
                                   @change="(v) =>{changeRecvCur(v, true)}"
                                   v-model="collectData.recvCurId" placeholder>
                          <el-option v-for="(item,key) in bzList" :key="key" :label="item.curName"
                                     :value="item.curId"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="同批收款额" class="postInfo-container-item">
                        <span v-if="type === 'view'">{{collectData.sameRecvAmount}}</span>
                        <el-input v-else v-model="collectData.sameRecvAmount" placeholder="请输入同批收款额"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!--                  <div class="title-mx"></div>-->
                  <div>
                    <div style="height: 30px;color: rgb(64, 158, 255);line-height: 30px">
                      收款明细
                      <div style="float: right;" v-if="type !== 'view'">
                        <el-button type="primary" size="mini" @click="addCollect">添加</el-button>
                        <el-button type="primary" size="mini" @click="delCollect">删除</el-button>
                      </div>

                    </div>
                    <AgGridVue :style="{width:'100%',height:'450px',border:'1px'}"
                               class="ag-theme-balham"
                               @grid-ready="onGridReady"
                               @dragStopped="dragStopped"
                               :columnDefs="columnDefs"
                               :gridOptions="gridOptions"
                               :rowData="collectDetailsList"
                               rowSelection="multiple"
                               :localeText="$store.state.caseInformation.localeText"
                               :getContextMenuItems="getContextMenuItems"
                               @sortChanged="refreshEvenRowsCurrencyData"
                               :rowHeight="28"
                               animateRows
                               suppressAutoSize
                               :pinnedBottomRowData="pinnedBottomRowData"
                    >
                    </AgGridVue>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="实收总外币金额:" class="postInfo-container-item">
                        {{paidForeignTotalCom}}
                        <!--                        <span v-if="type === 'view'">{{collectData.paidForeignTotal}}</span>-->
                        <!--                        <el-input v-else v-model="collectData.paidForeignTotal" placeholder="请输入实收总外币金额" readonly></el-input>-->
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="实收总本币金额:" class="postInfo-container-item">
                        {{paidLocalTotalCom}}
                        <!--                        <span v-if="type === 'view'">{{collectData.paidLocalTotal}}</span>-->
                        <!--                        <el-input v-else v-model="collectData.paidLocalTotal" placeholder="请输入实收总本币金额" readonly></el-input>-->
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="备注:" class="postInfo-container-item">
                        <span v-if="type === 'view'">{{collectData.remarks}}</span>
                        <el-input v-else clearable v-model="collectData.remarks" placeholder="请输入备注"
                                  type="textarea"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="录入人:" class="postInfo-container-item">
                        {{collectData.fillinUserIdStr}}
<!--                        <span v-if="type === 'view'">{{collectData.fillinUserIdStr}}</span>-->
<!--                        <VirtualSelect v-else filterable clearable :data="$store.getters.allUserList"-->
<!--                                       v-model="collectData.fillinUserId" placeholder="请选择录入人"></VirtualSelect>-->
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="录入日期:" class="postInfo-container-item">
                        {{collectData.fillinDate}}
                      </el-form-item>
                    </el-col>
                  </el-row>

                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col v-if="type !== 'create'" :span="4" style="padding: 0 10px">
            <task-record v-if="collectData.payId" :id="collectData.payId" typeId="16"></task-record>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="fl-ac-jc" style="margin-top: 10px" v-if="!isAudit || !collectData.taskNo || collectData.taskNo == 1">
      <el-button type="primary" size="small" v-if="type == 'edit'" @click="modifyCollect">保存</el-button>
      <el-button type="primary" size="small" v-if="type == 'create'" @click="saveCollect">保存</el-button>
      <el-button type="primary" size="small" v-if="type != 'view'&&(type == 'create' || collectData.wfStatus == '待提交')" @click="createCollect(collectData.wfStatus == '待提交')">提交</el-button>
      <el-button type="" size="small" @click="goPreRouter(false)">取消</el-button>
    </div>
    <div class="fl-ac-jc" style="margin-top: 10px" v-if="isAudit && collectData.taskNo && collectData.taskNo == 2">
      <el-button type="primary" size="small" @click="createCollect(collectData.wfStatus == '待结账')">通过</el-button>
      <el-button type="primary" size="small" @click="modifyCollect">保存</el-button>
      <el-button type="" size="small" @click="goPreRouter(false)">取消</el-button>
    </div>

    <el-dialog title="案件选择" :modal-append-to-body="false" append-to-body :visible.sync="selectCaseVisible" width="40%">
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
  import {formatAmount, fomatFloat} from '@/utils/filters'
  import {
    queryPaymentById,
    queryPayAcountUrl,
    queryCurrencyUrl,
    getShowRefno,
    modifyPayment,
    createPayment,
    previewPayment,
    doPaymentTask,
    disposeAgentNum
  } from '@/api/billApi'
  import { querycustSelectClass } from '@/api/customerList.js'
  import { queryCustomerNameId } from "@/api/caseList.js";
  import TaskRecord from '../../components/TaskRecord'
  import ChooseCase from "../../../case/components/ChooseCase";

  export default {
    name: 'CollectionDetail',
    components: {ChooseCase, TaskRecord },
    props: {
      curIdString: {
        type: String,
        default: ''
      },
      billIds: {
        type: String,
        default: ''
      },
      payId: {
        type: [Number, String],
        default: ''
      },
      type: {
        type: String,
        default: ''
      },
      isAudit:{
        type: Boolean,
        default: false
      },
    },
    data() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name).tableHeader
      }
      const that = this
      return {
        selectCaseList: [],
        selectCaseVisible: false,
        changeCaseVisible: false,
        endInput: false,
        custList: [],
        tableHeader,
        gridApi: {},
        currExchangeBlur: false,
        rules: {
          recvKind: [{ required: true, message: '请选择收款种类', trigger: ['blur', 'change'] }],
          payAccountId: [{ required: true, message: '请选择收款账户', trigger: ['blur', 'change'] }]
        },
        caseIds: [],
        bzList: [],
        accountList: [],
        recvKindList: [],
        recvTypeList: [],
        collectData: {
          recvCurId: '',
          custId: '',
          custIdStr: ''
        },
        preferenceList: [
          {
            headerName: '账单号',
            field: 'billNo',
            // 'pinned': 'left', //固定再左边
            width: this.getLoactionWidth('账单号') == 'auto' ? 200 : this.getLoactionWidth('账单号'),
            enableRowGroup: true,
            cellClass: params => {
              return params.data.isAdd ? 'vAlign' : 'not-allow'
            },
            // cellStyle: { 'cursor': 'not-allowed' },
            editable: params => {
              return params.data.isAdd ? true : false
            },
            sortable: true,
            resizable: true,
            // enablePivot: true,
            floatingFilter: true,
            filter: false,
            // cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer
            // rowDrag: true
          },
          {
            headerName: '应收本币金额',
            field: 'duetoLocal',
            width: this.getLoactionWidth('应收本币金额') == 'auto' ? 200 : this.getLoactionWidth('应收本币金额'),
            cellStyle: { 'background-color': '#F5F7F7', 'color': '#000', 'cursor': 'not-allowed' },
            // editable: true,
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
            headerName: '应收外币金额',
            field: 'duetoForeign',
            width: this.getLoactionWidth('应收外币金额') == 'auto' ? 200 : this.getLoactionWidth('应收外币金额'),
            cellStyle: { 'background-color': '#F5F7F7', 'color': '#000', 'cursor': 'not-allowed' },
            // editable: true,
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
            headerName: '实收本币金额',
            field: 'paidLocal',
            width: this.getLoactionWidth('实收本币金额') == 'auto' ? 200 : this.getLoactionWidth('实收本币金额'),
            editable: true,
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
            headerName: '实收外币金额',
            field: 'paidForeign',
            width: this.getLoactionWidth('实收外币金额') == 'auto' ? 200 : this.getLoactionWidth('实收外币金额'),
            editable: true,
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
            headerName: '当时汇率',
            field: 'oriExchangeRate',
            width: this.getLoactionWidth('当时汇率') == 'auto' ? 200 : this.getLoactionWidth('当时汇率'),
            cellStyle: { 'background-color': '#F5F7F7', 'color': '#000', 'cursor': 'not-allowed' },
            // editable: true,
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
            headerName: '汇兑损益',
            field: 'gainsLosses',
            width: this.getLoactionWidth('汇兑损益') == 'auto' ? 200 : this.getLoactionWidth('汇兑损益'),
            editable: true,
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
            headerName: '手续费本币',
            field: 'chargeLocal',
            width: this.getLoactionWidth('手续费本币') == 'auto' ? 200 : this.getLoactionWidth('手续费本币'),
            editable: true,
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
            headerName: '手续费外币',
            field: 'chargeForeign',
            width: this.getLoactionWidth('手续费外币') == 'auto' ? 200 : this.getLoactionWidth('手续费外币'),
            editable: true,
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
            headerName: '部分收款',
            field: 'payPart',
            // editable: true,
            width: this.getLoactionWidth('部分收款') == 'auto' ? 200 : this.getLoactionWidth('部分收款'),
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
        collectDetailsList: [],
        columnDefs: [],
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions,
          onColumnResized(params) {
            params.api.resetRowHeights()
          },
          onGridReady: (params) => {
            this.gridApi = params.api
            this.collectDetailsList.forEach(function(data, index) {
              data.id = index
            })
          },
          singleClickEdit: true,
          onCellEditingStarted(event) {
            that.preValue = event.value
          },
          onCellValueChanged(event) {
            // console.log(event)
          },
          onCellEditingStopped: (event) => {
            // if (that.preValue === event.value) {
            //   return
            // }
            this.changeCollectDetailsList(event)
            // // 实收总本币金额
            // this.collectData.paidLocalTotal = this.getSum(this.gridApi.rowModel && this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'paidLocal')
            // // 实收总外币金额
            // this.collectData.paidForeignTotal = this.getSum(this.gridApi.rowModel && this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'paidForeign', 'ceil1')
            this.gridApi.refreshCells()

          }
        }
      }
    },
    computed: {
      paidForeignTotalCom(){
        return formatAmount(this.collectData.paidForeignTotal, 2)
      },
      paidLocalTotalCom(){
        return formatAmount(this.collectData.paidLocalTotal)
      },
      pinnedBottomRowData(params) {
        if (this.gridApi) {
          return [
            {
              billNo: `合计: ${this.collectDetailsList.length}`,
              duetoLocal: this.getSum(this.gridApi.rowModel && this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'duetoLocal'),
              duetoForeign: this.getSum(this.gridApi.rowModel && this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'duetoForeign'),
              paidLocal: this.getSum(this.gridApi.rowModel && this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'paidLocal'),
              paidForeign: this.getSum(this.gridApi.rowModel && this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'paidForeign'),
              oriExchangeRate: '',
              gainsLosses: this.getSum(this.gridApi.rowModel && this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'gainsLosses'),
              chargeLocal: this.getSum(this.gridApi.rowModel && this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'chargeLocal'),
              chargeForeign: this.getSum(this.gridApi.rowModel && this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data), 'chargeForeign'),
              payPart: ''
            }
          ]
        }
      }
    },
    watch: {
      'collectData.recvCurId': {
        handler(n){
          // (n||n===0)&&this.changeRecvCur(n)
        },
        // immediate: true
      },
      payId:{
        handler(n){
          (n || this.type == 'create')&&this.init()
        },
        immediate: true
      }
    },
    created() {
      // this.init()
    },
    methods: {
      copy(row, value) {
        if (value) {
          this.$copyText(String(value)).then(
            res => {
            })
        }
      },
      takeCaseDetail(row) {
        if (row.caseArray && row.caseArray.length > 1) {
          this.selectCaseList = row.caseArray;
          this.selectCaseVisible = true;
        } else {
          if (!row.caseId) {
            this.takeCaseDetail(row.caseArray[0])
          } else {
            this.$commonUtils.takeCaseDetail(row, this)
            // window.open(`#/workbench/case/seeCaseDetail/${row.caseId}?taskType=${row.taskType}`)
          }
        }
      },
      getList(list) {
        if (list.length) {
          this.$set(this.collectData, 'custId', list[0].custId)
          this.collectData.custId&&queryCustomerNameId({pageNo: 1, pageSize: 100, custId: this.collectData.custId}).then(res => {
            this.custList = res.data
          })
          this.$set(this.collectData, 'caseArray', list)
          disposeAgentNum({agentNumberArray: list.map(item => item.agentNum)}).then(res => {
            this.$set(this.collectData, 'showRefno', res.data)
          })
        }
      },
      ChooseCaseClose(data) {
        this.changeCaseVisible = false
      },
      async checkPartCollect(){
        this.endInput = true
        let list = []
        await new Promise(res => {
          this.gridApi.stopEditing()
          setTimeout(() => res(), 500)
        })
        this.collectDetailsList.forEach((item, index) => {
          if(this.collectData.recvCurId === 0 && (item.paidLocal < item.duetoLocal) && !item.payPart ){
            list.push(index + 1)
          }
          for (let key in item) {
            if (item[key] === "" && ["duetoLocal", "duetoForeign", "paidLocal", "paidForeign", "oriExchangeRate", "gainsLosses", "chargeLocal", "chargeForeign"].includes(key)) {
              item[key] = 0
            }
          }
        })
        if(list.length){
          return await this.$confirm(`请勾选第${String(list)}条明细中的部分收款`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "忽略",
            type: "warning"
          }).then(() => {
            return 1
          }).catch(() => {
            return 0
          })
        }
        return 0

      },
      remoteMethod(query){
        if(!query)return;
        queryCustomerNameId({pageNo: 1, pageSize: 100, keyword: query}).then(res => {
          this.custList = res.data
        })
      },
      getLoactionWidth(label) {
        if (!localStorage.getItem('tableHeader')) {
          return 'auto'
        } else {
          var arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name + this.$route.name)) {
            var header = arr.find(item => item.name == this.$options.name + this.$route.name).tableHeader
            if (header.find(item => item.label == label)) {
              return header.find(item => item.label == label).width
            } else {
              return 'auto'
            }
          } else {
            return 'auto'
          }
        }
      },
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field
        })).filter(item => item.prop != 'sid' && item.prop != 'group')
        this.tableHeader = tableHeader
        // this.changeHeader(tableHeader)
        this.saveLocation()
      },
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({ name: this.$options.name + this.$route.name, tableHeader: this.tableHeader })
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name + this.$route.name)) {
            arr.find(item => item.name == this.$options.name + this.$route.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({ name: this.$options.name + this.$route.name, tableHeader: this.tableHeader })
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
        }
      },
      async saveCollect() {
        if(await this.checkPartCollect())return;
        if (!this.$commonUtils.formValidate(this.$refs['postForm'])) return
        createPayment({
          ...this.collectData,
          caseIds: this.caseIds,
          payDetails: this.collectDetailsList
        }).then(res => {
          this.$message.success('保存成功！')
          if(this.billIds){
             this.goPreRouter(this.billIds || true)
          }else{
              this.goPreRouter(true)
          }
        }).catch(err => {
          this.$message.error('保存失败！')
        })
      },
      getSum(list, type, flag) {
        if (!list || !list.length) return
        if (type === 'paidForeign') {
          this.$set(this.collectData, 'paidForeignTotal', fomatFloat(list.map(item => item[type]).filter(item => !!item).reduce((x, y) => Number(x) + Number(y), 0), 2))
          return fomatFloat(list.map(item => item[type]).filter(item => !!item).reduce((x, y) => Number(x) + Number(y), 0), 2)
        }
        if(type === 'duetoForeign'){
          return fomatFloat(list.map(item => item[type]).filter(item => !!item).reduce((x, y) => Number(x) + Number(y), 0), 2)
        }
        if (type === 'paidLocal') {
          this.$set(this.collectData, 'paidLocalTotal', this.fomatFloat(list.map(item => item[type]).filter(item => !!item).reduce((x, y) => Number(x) + Number(y), 0), 2))
        }
        return formatAmount(this.fomatFloat(list.map(item => item[type]).filter(item => !!item).reduce((x, y) => Number(x) + Number(y), 0), 2))
      },
      async changeCurrExchangeRate() {
        this.collectDetailsList.forEach((item, index) => {
          this.changePaid(item.paidForeign, index, 'paidLocal')
          this.changePaid(item.paidLocal, index, 'paidForeign')
          this.changeCharge(item.chargeForeign, index, 'chargeLocal')
          this.changeCharge(item.chargeLocal, index, 'chargeForeign')
        })
        this.gridApi && this.gridApi.refreshCells && this.gridApi.refreshCells()
        await new Promise(res => {
          this.gridApi.stopEditing()
          setTimeout(() => res(), 10)
        })
      },
      regPrice(event, list, index) {
        const fieldList = ['paidLocal', 'paidForeign', 'gainsLosses', 'chargeLocal', 'chargeForeign']
        if (fieldList.includes(event.colDef.field)) {
          event.value = Number(String(event.value || 0).replace(/,/g, ''))
          list[index][event.colDef.field] = event.value || ''
        }
      },
      fomatFloat(number, n, type) {
        return +this.$wUtil.formatFloat(number || 0, n, type) || ''
      },
      queryBillFromDetail(billNo, index) {
       billNo && previewPayment({ billNo }).then(res => {
          let list = res.data || []
         if(list[0].ispay){
           this.$message.error('该账单已收款完毕！')
           this.collectDetailsList[index]['billNo'] = ''
           this.gridApi.refreshCells()
           return
         }
          list = list.map(item => ({
            duetoForeign: item.dueToForeign,
            duetoLocal: item.dueToLocal,
            billNo: item.billNo,
            billId: item.billId,
            oriExchangeRate: item.oriExchangeRate,
            custId: item.custId,
            custIdStr: item.custIdStr,
            paidLocal: '',
            paidForeign: '',
            gainsLosses: '',
            chargeLocal: '',
            chargeForeign: '',
            payPart: ''
          }))
          !list.length && (list = [{}])
          if (this.collectData.recvCurId === 0) {
            list[0].paidForeign = list[0].duetoLocal
            list[0].paidLocal = list[0].duetoLocal
          } else {
            list[0].paidLocal = list[0].duetoLocal
            list[0].paidForeign = list[0].duetoForeign
          }
          for (let k in this.collectDetailsList[index]){
            this.collectDetailsList[index][k] = list[0][k]
          }
          this.collectDetailsList[index]['isAdd'] = true
          this.collectDetailsList[index]['billNo'] = billNo
          this.gridApi.refreshCells()
        })
      },
      changeCollectDetailsList(event) {
        if (event.rowPinned == 'bottom') {
          return
        }
        let index = this.collectDetailsList.findIndex(item => item == event.data)
        if(event.colDef.field == 'billNo'){
          this.queryBillFromDetail(event.value, index)
        }
        if(event.colDef.field == 'gainsLosses'){
          this.gainsLossesChange(event, index)
        }
        this.regPrice(event, this.collectDetailsList, index)
        if (event.colDef.field == 'paidForeign') { // 实收外币金额
          this.changePaid(event.value, index, 'paidLocal')
        }
        if (event.colDef.field == 'paidLocal') { // 实收本币金额
          this.changePaid(event.value, index, 'paidForeign')
        }
        if (event.colDef.field == 'chargeForeign') { // 手续费外币
          this.changeCharge(event.value, index, 'chargeLocal')
        }
        if (event.colDef.field == 'chargeLocal') { // 手续费本币
          this.changeCharge(event.value, index, 'chargeForeign')
        }
      },
      gainsLossesChange(event, index){
        this.$nextTick(() => this.collectDetailsList[index].payPart && event.node.setDataValue('gainsLosses', '0'))
      },
      changeCharge(value, index, type) {
        if (type === 'chargeLocal') {
          this.collectDetailsList[index][type] = this.fomatFloat(this.collectData.currExchangeRate * value * 0.01, 2)
          // 收款种类为预收款1877和赔偿款1880或者勾选部分收款不计算汇兑损益
        // 汇兑损益 = '应收本币金额 - 实收本币金额 - 手续费本币金额'
        !this.collectDetailsList[index].payPart && ![1877, 1880].includes(this.collectData.recvKind) && (this.collectDetailsList[index].gainsLosses = this.fomatFloat(this.collectDetailsList[index].duetoLocal - this.collectDetailsList[index].paidLocal - this.collectDetailsList[index].chargeLocal, 2))
        } else {
          this.collectDetailsList[index][type] = this.fomatFloat(value / (this.collectData.currExchangeRate * 0.01), 2)
          // 收款种类为预收款1877和赔偿款1880或者勾选部分收款不计算汇兑损益
        // 汇兑损益 = '应收本币金额 - 实收本币金额 - 手续费本币金额'
        !this.collectDetailsList[index].payPart && ![1877, 1880].includes(this.collectData.recvKind) && (this.collectDetailsList[index].gainsLosses = this.fomatFloat(this.collectDetailsList[index].duetoLocal - this.collectDetailsList[index].paidLocal - this.collectDetailsList[index].chargeLocal, 2))
        }
      },
      changePaid(value, index, type) {
        if (type === 'paidLocal') {
          this.collectDetailsList[index].paidForeign = this.fomatFloat(value, 2)
          this.collectDetailsList[index][type] = this.fomatFloat(this.collectData.currExchangeRate * value * 0.01, 2)
          // 收款种类为预收款1877和赔偿款1880或者勾选部分收款不计算汇兑损益
          // 汇兑损益 = '应收本币金额 - 实收本币金额 - 手续费本币金额'
          !this.collectDetailsList[index].payPart && ![1877, 1880].includes(this.collectData.recvKind) && (this.collectDetailsList[index].gainsLosses = this.fomatFloat(this.collectDetailsList[index].duetoLocal - this.collectDetailsList[index][type] - this.collectDetailsList[index].chargeLocal, 2))
        } else {
          this.collectDetailsList[index].paidLocal = this.fomatFloat(value, 2)
          this.collectDetailsList[index][type] = +this.collectData.currExchangeRate ? this.fomatFloat(value / (this.collectData.currExchangeRate * 0.01), 2) : 0
          // 收款种类为预收款1877和赔偿款1880或者勾选部分收款不计算汇兑损益
          // 汇兑损益 = '应收本币金额 - 实收本币金额 - 手续费本币金额'
          !this.collectDetailsList[index].payPart && ![1877, 1880].includes(this.collectData.recvKind) && (this.collectDetailsList[index].gainsLosses = this.fomatFloat(this.collectDetailsList[index].duetoLocal - this.collectDetailsList[index].paidLocal - this.collectDetailsList[index].chargeLocal, 2))
        }
        // if(!this.endInput && this.collectData.recvCurId === 0 && (this.collectDetailsList[index].paidLocal < this.collectDetailsList[index].duetoLocal) && !this.collectDetailsList[index].payPart ){
        //   this.$alert('请勾选【部分收款】',"提示",
        //     {
        //       confirmButtonText: "关闭",
        //       type: "warning"
        //     })
        //   return
        // }

      },
      cellRenderer(params) {
        if (params.node.rowPinned == 'bottom') {
          return `<span title="${params.value}" style="float: right">${(params.value || params.value === 0) ? params.value : ''}</span>`
        }
        if (params.colDef.field == 'payPart') {
          const h = this.$createElement
          const that = this
          let vnode = h({
            template: `
              <div>
                <el-checkbox :true-label="1" v-model="value" @change="changeValue"></el-checkbox>
              </div>`,
            props: {
              params: {}
            },
            data(){
              return {
                value: ''
              }
            },
            watch: {
              value(n){
                this.params.data.payPart = n || 0
                n && this.params.node && this.params.node.setDataValue('gainsLosses', '0')
              }
            },
            created() {
              this.value = this.params.value || 0
            }
            ,
            methods: {
              async changeValue(n){
                this.$nextTick(() => {
                  that.changePaid(this.params.data.paidForeign, this.params.rowIndex, 'paidLocal')
                  that.changePaid(this.params.data.paidLocal, this.params.rowIndex, 'paidForeign')
                  that.changeCharge(this.params.data.chargeForeign, this.params.rowIndex, 'chargeLocal')
                  that.changeCharge(this.params.data.chargeLocal, this.params.rowIndex, 'chargeForeign')
                  that.gridApi && that.gridApi.refreshCells && that.gridApi.refreshCells()
                })
               await new Promise(res => {
                  that.gridApi.stopEditing()
                  setTimeout(() => res(), 10)
                })
              }
            },
          }, {
            props: {
              params
            }

          })
          const div = document.createElement('div')
          this.__patch__(div, vnode, true, false)

          return div
        }
        const mountlist = ['duetoLocal', 'duetoForeign', 'paidLocal', 'paidForeign', 'gainsLosses', 'chargeLocal', 'chargeForeign']
        if(mountlist.includes(params.colDef.field)){
          return `<span title="${params.value}" style="float: right">${formatAmount(params.value || '') || 0}</span>`
        }
        return `<span title="${params.value}">${(params.value || params.value === 0) ? params.value : ''}</span>`
      },
      changeRecvCur(v, flag) {
        let exchangeRate = ''
        if (this.bzList.find(i => i.curId == v)) {
          exchangeRate = this.bzList.find(i => i.curId == v).exchangeRate
        }
        exchangeRate&&this.$set(this.collectData, 'currExchangeRate', exchangeRate)
        if (this.type === 'create' && this.billIds) {
          this.collectDetailsList.forEach(item => {
            if (this.collectData.recvCurId === 0) {
              item.paidForeign = item.duetoLocal
              item.paidLocal = item.duetoLocal
            } else {
              item.paidLocal = item.duetoLocal
              item.paidForeign = item.duetoForeign
            }
          })
        }
       flag && this.changeCurrExchangeRate()
      },
      async init() {
        this.columnDefs = this.preferenceList
        this.queryPayment()
        if (this.type === 'view') {

        } else {
          this.queryClass()
          this.queryPayAcount()
          await this.queryCurrency()
          if (this.type === 'create') {
            this.$set(this.collectData, 'recvType', '账单收款')
            this.$set(this.collectData, 'recvKind', 1878)
            this.$set(this.collectData, 'recvDate', this.$wUtil.getDate('', 'day', '-'))
            this.$set(this.collectData, 'payDate', this.$wUtil.getDate('', 'day', '-'))
            this.$set(this.collectData, 'fillinDate', this.$wUtil.getDate('', 'day', '-'))
            this.$set(this.collectData, 'fillinUserIdStr', this.$store.getters.name)
            if (this.billIds) {
              this.getShowRefno(this.billIds.split(','))
              this.previewPayment(this.billIds.split(','))
            }
          }
        }
      },
      previewPayment(billIds) {
        previewPayment({ billIds }).then(res => {
          let list = res.data
          list = list.map(item => ({
            duetoForeign: item.dueToForeign,
            duetoLocal: item.dueToLocal,
            billNo: item.billNo,
            billId: item.billId,
            oriExchangeRate: item.oriExchangeRate,
            custId: item.custId,
            custIdStr: item.custIdStr,
            paidLocal: '',
            paidForeign: '',
            gainsLosses: '',
            chargeLocal: '',
            chargeForeign: '',
            payPart: ''
          }))
          this.$set(this.collectData, 'payCust', list[0].custIdStr)
          this.$set(this.collectData, 'custId', list[0].custId)
          this.collectData.custId&&queryCustomerNameId({pageNo: 1, pageSize: 100, custId: this.collectData.custId}).then(res => {
            this.custList = res.data
          })
        this.collectDetailsList.push(...list)
          if(this.collectDetailsList.length){
            this.collectData.recvCurId = this.bzList.find(item=> item.curName === this.curIdString).curId || 0
            this.changeRecvCur(this.collectData.recvCurId, true)
          }
        })
      },
      async queryCurrency() {
        await queryCurrencyUrl().then(res => {
          this.bzList = res.data || []
        })
      },
      queryPayAcount() {
        queryPayAcountUrl().then(res => {
          this.accountList = res.data || []
        })
      },
      queryClass() {
        let classIdString = [1157, 1039].join(',')
        querycustSelectClass({ classId: classIdString }).then(res => {
          this.recvKindList = res.data['1157']
          this.recvTypeList = res.data['1039']
        })
      },
      queryPayment() {
        this.payId && queryPaymentById({
          payId: this.payId
        }).then(res => {
          this.collectData = res.data
          this.collectData.custId&&queryCustomerNameId({pageNo: 1, pageSize: 100, custId: this.collectData.custId}).then(res => {
            this.custList = res.data
          })
          this.collectDetailsList = JSON.parse(JSON.stringify(this.collectData.payDetails))
          this.caseIds = res.data.caseIds
          // this.getShowRefno(this.collectDetailsList.map(item => item.billId))
        })
      },
      goPreRouter(search) {
        this.$emit('closeDialog', search)
        // this.$router.go(-1)
      },
      async createCollect(flag) {
        if(await this.checkPartCollect())return;
        if (!this.$commonUtils.formValidate(this.$refs['postForm'])) return
        if(!flag){
         createPayment({
            ...this.collectData,
            caseIds: this.caseIds,
            payDetails: this.collectDetailsList
          }).then(res => {
            // this.$message.success('提交成功！')
            if (res.data && res.data[0] && res.data[0].taskId) {
              doPaymentTask({ taskIdList: [res.data[0].taskId] }).then(res => {
                this.$message.success('提交成功！')
                if(this.billIds){
                   this.goPreRouter(this.billIds || true)
                }else{
                    this.goPreRouter(true)
                }
              }).catch(err => {
                // this.$message.error('提交失败1！')
              })
            }

          }).catch(err => {
            // this.$message.error('提交失败2！')
          })
        }else{
          modifyPayment({
          ...this.collectData,
          caseIds: this.caseIds,
          payDetails: this.collectDetailsList
        }).then(res => {
            doPaymentTask({ taskIdList: [this.collectData.taskId] }).then(res => {
              this.$message.success('操作成功！')
              this.goPreRouter({payIds: String(this.collectData.payId), payDetailIds: String(this.collectDetailsList.map(item => item.payDetailId))})
            })
          })
        }
      },
      async modifyCollect() {
        if(await this.checkPartCollect())return;
        if (!this.$commonUtils.formValidate(this.$refs['postForm'])) return
        modifyPayment({
          ...this.collectData,
          caseIds: this.caseIds,
          payDetails: this.collectDetailsList
        }).then(res => {
          this.$message.success('保存成功！')
          this.goPreRouter({payIds: String(this.collectData.payId), payDetailIds: String(this.collectDetailsList.map(item => item.payDetailId))})
        }).catch(err => {
          // this.$message.error('保存失败！')
        })
      },
      getShowRefno(billIds = []) {
        if (billIds.length) {
          getShowRefno({ billIds }).then(res => {
            this.caseIds = res.data.caseIds
            this.$set(this.collectData, 'showRefno', res.data.showRefno)
          })
        }
      },
      addCollect() {
        const data = {
          isAdd: true,
          billNo: '',
          billId: '',
          duetoLocal: '',
          duetoForeign: '',
          paidLocal: '',
          paidForeign: '',
          oriExchangeRate: '',
          gainsLosses: '',
          chargeLocal: '',
          chargeForeign: '',
          payPart: ''
        }
        this.collectDetailsList.push(data)
      },
      delCollect() {
        const list = this.gridApi.getSelectedRows()
        this.collectDetailsList = this.collectDetailsList.filter(item => !list.includes(item))
      },
      getContextMenuItems(params) {
        if (!params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.value)
          }
        }))
      },
      getRowContextmenuList(row) {
        return [
          { name: '复制', action: 'copy' }
          // { name: '修改', action: 'edit' }
          // { name: '删除', action: 'deleteFee', permissions: 223 }
        ].filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return true
          }
        })
      },
      refreshEvenRowsCurrencyData(params) {
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          })
        }
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        // params.api.sizeColumnsToFit()
      }
    }
  }
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

  .form-border {
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    /deep/ .el-row {
      margin: 0px;
      display: flex; /*解决账单查看表单样式被撑开*/
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    /deep/ .el-form-item__label {
      background-color: #f9f9f9;
      width: 36.7%;
      text-align: right;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    /deep/ .el-row {
      border-bottom: 1px solid #d7d7d7;
      border-left: 1px solid #d7d7d7;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 77%;
    }

    /deep/ td .el-input,
    /deep/ td .el-select {
      width: 100%;
    }

    /deep/ .el-form-item__content {
      text-align: left;
      word-break: break-word;
      // height: 30px;
    }

    .fullRow {
      /deep/ .el-form-item__label {
        width: 15%;
      }

      /deep/ .el-input,
      /deep/ .el-select {
        width: 30%;
      }
    }

    /deep/ .el-input__inner {
      // border: none;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    /deep/ td .el-select,
    /deep/ td .el-input,
    /deep/ td .el-input__inner {
      // border: 0px !important;
    }

    .postInfo-container-item {
      display: flex;
      width: 100%;

      /deep/ .el-form-item__content {
        text-align: left;
        display: inline-table;
        width: 85%;
        padding: 0px 15px;
      }

      /deep/ .el-form-item__label {
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
    /*float: left;*/
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
      height: 100vh;
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
    z-index: 2000;
    background: #fff;
  }

  > > > .ag-floating-bottom-container {
    /*font-weight: bolder;*/
    /*font-size: 16px;*/
  }

  > > > .el-form-item__error {
    position: relative;
  }
  >>>.not-allow{
    cursor: not-allowed!important;
  }
</style>


