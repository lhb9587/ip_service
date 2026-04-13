<template>
  <div>
    <!--  客户基本信息  -->
    <div class="top-info">
      <div class="left-img">
        <template v-if="editStatus">
          <el-upload
            name="attachFile"
            :action='creatematerial'
            ref='userIconupload'
            :data='usericonSendData'
            :on-success='iconSendSuccess'
            accept="image/jpeg,image/gif,image/png"
            :before-upload="onBeforeUploadIcon"
            :show-file-list="false"
            :auto-upload='false'
            :on-change="handleAvatarChange"
          >
            <div v-if="customerData.userIcon && !iconIsDel" style="position: relative" @mouseenter="showDelIcon"
                 @mouseleave="hideDelIcon">
              <img v-if="userIconCust" :src="userIconCust" class="avatar">
              <div @click.stop="btnDelete()" class="mask" v-show="isShow"
                   style="position:absolute; bottom: 0px; background-color: #000; opacity: 0.8; height: 20px; width: 100%">
                <i class="el-icon-delete" style="position:absolute; left: 43px;bottom: 3px; color: #fff;"></i>
              </div>
            </div>
            <i v-else="!postForm.userIcon" class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </template>
        <div v-else>
          <img v-if="userIconCust" :src="userIconCust" class="avatar">
        </div>
      </div>
      <div class="right-text">
        <div class="top-text">
          <div class="title-text">
            {{customerData.fullname}}
          </div>
          <div class="right-title-text">{{customerData.name}}</div>
          <div class="right-code-text">{{customerData.code}}</div>
        </div>
        <div class="bottom-text">
          <template v-if="customerData.fullnameEn">
            <div><img src="./assets/images/en.svg" alt="" width="18" height="18">{{customerData.fullnameEn}}</div>
            <div style="margin: 0 20px">|</div>
          </template>
          <div v-if="customerData.auditDate"><img src="./assets/images/review.svg" alt="" width="22" height="24">{{customerData.auditDate}}
          </div>
        </div>
      </div>
      <div class="right-btn">
        <div>
          <el-button @click="getLogList">操作记录</el-button>
          <template v-if="isCreated && !createSign">
            <el-button @click="createCustomer">创建</el-button>
          </template>
          <template v-else-if="isExamine">
            <el-button @click="customerExamine('1621')">审核通过</el-button>
            <el-button @click="customerExamine('1624')">审核驳回</el-button>
          </template>
          <template v-else-if="isSubmit">
            <el-button @click="submitTask">提交</el-button>
          </template>
          <template v-else>
            <el-button v-if="!editStatus && $store.getters.permissions.includes(50) && isModify" @click="openEdit">
              编辑客户
            </el-button>
            <el-button v-if="editStatus && $store.getters.permissions.includes(50) && isModify" @click="closeEdit">
              取消编辑
            </el-button>
            <!--            <el-button v-if="editStatus && isModify" @click="saveBaseInfo">保存</el-button>-->
          </template>

        </div>
      </div>
    </div>

    <!--  tab标签页  -->
    <el-tabs class="tabs-info" style="background-color: #F2F2F2;position:relative;" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(tab, index) in tabListPermission"
        :key="tab.label" :label="tab.label" :name="String(index + 1)">
        <mask-modal v-if="maskNameList.includes(activeName)"></mask-modal>
        <keep-alive>
          <base-info ref="baseRef" :tabNo="index + 1 + ''" :activeName="activeName" :editStatus="editStatus"
                     v-if="(customerData.custId || customerData.isCreated) && index === 0" :customerData="customerData"
                     :examineStatusStr="examineStatusStr"
                     @changeMask="changeMask"
                     :isCreated="isCreated"
                     :userIcon="customerData.userIcon"
                     :createSign="createSign"
                     @changeActiveName="changeActiveName"
                     @updateCust="(flag) => {$emit('updateCust', flag); createSign = true}"
                     :seletData="seletData"></base-info>
          <component
            :tabNo="index + 1 + ''"
            :is="tab.cpn"
            v-if="customerData.custId && activeName === String(index + 1) && index !== 0 || ['关联公司', '利益冲突'].includes(tab.label)"
            :cust-id="customerData.custId"
            :editStatus="editStatus"
            :fullname="customerData.fullname"
            :customerData="customerData"
            @changeMask="changeMask"
            :seletData="seletData"></component>
        </keep-alive>
      </el-tab-pane>
      <!--      <el-tab-pane label="基本信息" name="1">-->
      <!--        <mask-modal v-if="maskNameList.includes(activeName)"></mask-modal>-->
      <!--        <base-info ref="baseRef" :editStatus="editStatus" v-if="customerData.custId" :customerData="customerData"-->
      <!--                   @changeMask="changeMask"-->
      <!--                   :seletData="seletData"></base-info>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane label="客户地址" name="2">-->
      <!--        <mask-modal v-if="maskNameList.includes(activeName)"></mask-modal>-->
      <!--        <cust-addr :seletData="seletData" v-if="customerData.custId" :fullname="customerData.fullname"-->
      <!--                   :cust-id="customerData.custId" :editStatus="editStatus" @changeMask="changeMask"></cust-addr>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane label="对方联系人" name="3">-->
      <!--        <mask-modal v-if="maskNameList.includes(activeName)"></mask-modal>-->
      <!--        <other-party-contact :seletData="seletData" v-if="customerData.custId" :fullname="customerData.fullname"-->
      <!--                             :cust-id="customerData.custId" :editStatus="editStatus"-->
      <!--                             @changeMask="changeMask"></other-party-contact>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane label="客户活动" name="4">-->
      <!--        <mask-modal v-if="maskNameList.includes(activeName)"></mask-modal>-->
      <!--        <active-view v-if="customerData.custId" :cust-id="customerData.custId" :editStatus="editStatus"-->
      <!--                     @changeMask="changeMask"></active-view>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane label="我方联系人" name="5">-->
      <!--        <mask-modal v-if="maskNameList.includes(activeName)"></mask-modal>-->
      <!--        <our-contact v-if="customerData.custId" :cust-id="customerData.custId" :editStatus="editStatus"-->
      <!--                     :seletData="seletData" @changeMask="changeMask"></our-contact>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane label="客户指示" name="6">-->
      <!--        <mask-modal v-if="maskNameList.includes(activeName)"></mask-modal>-->
      <!--        <cust-indicate v-if="customerData.custId" :fullname="customerData.fullname" :cust-id="customerData.custId"-->
      <!--                       :editStatus="editStatus" @changeMask="changeMask"></cust-indicate>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane label="关联公司" name="7">-->
      <!--        <mask-modal v-if="maskNameList.includes(activeName)"></mask-modal>-->
      <!--        <association-company v-if="customerData.custId" :cust-id="customerData.custId" :editStatus="editStatus"-->
      <!--                             @changeMask="changeMask"></association-company>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane label="利益冲突" name="8">-->
      <!--        <mask-modal v-if="maskNameList.includes(activeName)"></mask-modal>-->
      <!--        <conflict-of-interest v-if="customerData.custId" :cust-id="customerData.custId" :editStatus="editStatus"-->
      <!--                              @changeMask="changeMask"></conflict-of-interest>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane label="行业" name="9">-->
      <!--        <mask-modal v-if="maskNameList.includes(activeName)"></mask-modal>-->
      <!--        <customer-industry v-if="customerData.custId" :cust-id="customerData.custId" :editStatus="editStatus"-->
      <!--                           @changeMask="changeMask"></customer-industry>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane label="趋势分析" name="10">-->
      <!--        <div>-->
      <!--          趋势分析-->
      <!--        </div>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane label="客户预测" name="11">-->
      <!--        <div>-->
      <!--          客户预测-->
      <!--        </div>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane label="关联商机" name="12">-->
      <!--        <mask-modal v-if="maskNameList.includes(activeName)"></mask-modal>-->
      <!--        <business-opportunity :fullname="customerData.fullname" v-if="customerData.custId"-->
      <!--                              :cust-id="customerData.custId" :editStatus="editStatus"-->
      <!--                              @changeMask="changeMask"></business-opportunity>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane label="业绩" name="13">-->
      <!--        <mask-modal v-if="maskNameList.includes(activeName)"></mask-modal>-->
      <!--        <performance-view v-if="customerData.custId" :cust-id="customerData.custId" :editStatus="editStatus"-->
      <!--                          @changeMask="changeMask"></performance-view>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane label="分支机构" name="14">-->
      <!--        <mask-modal v-if="maskNameList.includes('14')"></mask-modal>-->
      <!--        <branch-view v-if="customerData.custId"-->
      <!--                     :cust-id="customerData.custId" :editStatus="editStatus" @changeMask="changeMask"></branch-view>-->
      <!--      </el-tab-pane>-->
    </el-tabs>

    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="logView"
      title="操作日志"
      width="80%"
      height="70%"
      class="abow_dialog1"
    >
      <AgGridVue
        style="width:100%;padding: 0px 15px 15px 15px"
        :style="{height: clientHeight + 'px'}"
        class="ag-theme-balham"
        :columnDefs="columnDefs"
        :rowData="logList"
        rowSelection="multiple"
        @grid-ready="onGridReady"
        :gridOptions="gridOptions"
        :getContextMenuItems="getContextMenuItems"
        @sortChanged="refreshEvenRowsCurrencyData"
        @filterChanged="refreshEvenRowsCurrencyData"
        suppressAutoSize
        animateRows
        :localeText="$store.state.caseInformation.localeText"
      >
      </AgGridVue>
      <pagination style="margin-bottom: 10px" v-show="total>0" :total="total" :page-sizes="[10,50,100,500,1000,5000]"
                  :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getLogList"/>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import BaseInfo from "./base/BaseInfo"
  import {
    customerExamine, customerSubmit,
    delCustomer,
    deleteCustomerIcon, getLogInfo,
    queryCaseTypeUrl, queryCountry,
    querycustSelectClass, queryFiliale,
    queryIndustryUrl, queryUserByPermissionId, queryUserNamesUrl,
    querywfUserNameUrl, updateCustomerNew
  } from "../../../../api/customerList"
  import {creatematerial} from "@/api/ipServiceApi.config";
  import {checkPermission, queryUserByRoleId} from "../../../../api/caseList"
  import * as serviceApi from "../../../../api/serviceApi.config"
  import CustAddr from "./address/CustAddr";
  import BranchView from "./branch/BranchView";
  import MaskModal from "../components/MaskModal";
  import OtherPartyContact from "./df_contact/OtherPartyContact";
  import ActiveView from "./active/ActiveView";
  import OurContact from "./our_contact/OurContact";
  import CustIndicate from "./indicate/CustIndicate";
  import AssociationCompany from "./association_company/AssociationCompany";
  import ConflictOfInterest from "./conflict/ConflictOfInterest";
  import CustomerIndustry from "./customer_industry/CustomerIndustry";
  import BusinessOpportunity from "./business/BusinessOpportunity";
  import PerformanceView from "./performance/PerformanceView";
  import CustomerReports from "./customer_reports/CustomerReports";
  import BrandManage from "./brand/BrandManage"

  export default {
    name: "CustDetail",
    components: {
      CustomerReports,
      PerformanceView,
      BusinessOpportunity,
      CustomerIndustry,
      ConflictOfInterest,
      AssociationCompany,
      CustIndicate,
      OurContact,
      ActiveView,
      OtherPartyContact,
      MaskModal,
      BranchView,
      CustAddr,
      BaseInfo,
      BrandManage,
      Pagination
    },
    props: {
      examineStatusStr: {},
      dialog: {
        type: Boolean,
        default: false
      },
      isSubmit: {
        type: Boolean,
        default: false
      },
      isExamine: {
        type: Boolean,
        default: false
      },
      isCreated: {
        type: Boolean,
        default: false
      },
      customerData: {},
      editStatus: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      tabListPermission() {
        return this.tabList.filter(item => item.permissions && this.$store.getters.permissions.includes(item.permissions) || !item.permissions)
      },
      clientHeight() {
        return document.documentElement.clientHeight - 330
      },
    },
    data() {
      return {
        creatematerial,
        listQuery: {
          pageSize: 10,
          pageNo: 1
        },
        logList: [],
        total: 0,
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
        preferenceList: [
          {'label': '操作时间', prop: 'operateDate', 'width': 155},
          {'label': '操作人', prop: 'operator', 'width': 100},
          {'label': '操作类型', prop: 'operateType', 'width': 100},
          {'label': '日志类型', prop: 'logType', 'width': 170},
          {'label': '操作内容', prop: 'changeLog', flex: 1},
        ],
        columnDefs: [],
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
                {statusPanel: 'agSelectedRowCountComponent', align: 'left'}
              ]
            }
          }
        },
        gridApi: {},
        logView: false,
        componentName: 'BaseInfo',
        tabList: [
          {
            label: '基本信息',
            cpn: 'BaseInfo'
          },
          {
            label: '客户地址',
            cpn: 'CustAddr'
          },
          {
            label: '客户联系人',
            cpn: 'OtherPartyContact'
          },
          {
            label: '客户活动',
            cpn: 'ActiveView',
            permissions: 16
          },
          {
            label: '我方联系人',
            cpn: 'OurContact'
          },
          {
            label: '客户指示',
            cpn: 'CustIndicate'
          },
          {
            label: '关联公司',
            cpn: 'AssociationCompany'
          },
          {
            label: '利益冲突',
            cpn: 'ConflictOfInterest'
          },
          {
            label: '行业',
            cpn: 'CustomerIndustry'
          },
          // {
          //   label: '趋势分析',
          //   cpn: ''
          // },
          // {
          //   label: '客户预测',
          //   cpn: ''
          // },
          {
            label: '关联商机',
            cpn: 'BusinessOpportunity'
          },
          {
            permissions: 413,
            label: '分支机构',
            cpn: 'BranchView'
          },
          {
            permissions: 415,
            label: '业绩',
            cpn: 'PerformanceView'
          },
          {
            label: '客户报告',
            cpn: 'CustomerReports'
          },
          // {
          //   label: '品牌管理',
          //   cpn: 'BrandManage'
          // }
        ],
        maskNameList: [],
        createSign: false, // 是否点击创建
        // editStatus: false,
        isShow: false,
        userIconCust: '',
        iconIsDel: false,
        usericonSendData: {
          tokenID: "",
          custId: ""
        },
        userIconUrl: serviceApi.addCustomerIcon,
        activeName: '1',
        seletData: {
          hzzt: [],
          chargeItemlist: [],
          dfkhdzlist: [],
          comLanguage: [], //沟通语言
          mainLegalNature: [], //主法律性质
          customerSource: [], //客户来源
          paternalUnit: [], //父单位
          paternalUnitKh: [], //kh
          customerOwner: [], //客户所有者
          managementCommitteePartner: [],
          censor: [],
          caseType: [],
          ctDataOption: [],
          statu: {},
          sex: {},
          lxstatu: {},
          called: {},
          dfcon: {},
          hdstatu: {},
          hdtype: {},
          hdfs: {},
          zdfs: {},
          userNames: {},
          wfuserNames: {},
          ywstuta: {},
          roleMessage: {},
          reqType: {},
          caseTypezs: {},
          activityList: {},
          industry: {},
          payAcount: [],
          curId: [],
          gradeList: []
        },
        isModify: true
      }
    },
    watch: {
      customerData: {
        handler(n) {
          if (n.userIcon) {
            this.userIconCust = `/ipdoc${n.userIcon}`
          }
        },
        immediate: true
      },
    },
    created() {
      // this.checkPermission()
    },
    mounted() {
      setTimeout(() => {
        const tabNav = document.querySelector('.el-tabs__nav-prev')
        tabNav && tabNav.click()
      }, 500)
    },
    beforeDestroy() {
      // this.isCreated && !this.createSign && delCustomer({customerID: this.customerData.custId})
    },
    methods: {
      changeActiveName(active, custInfo) {
        custInfo && this.$emit('changeIsCreated', custInfo)
        this.activeName = active
        if (this.activeName != 1) {
          this.isModify = true
          this.$set(this.customerData, 'isCreated', false)
        } else {
          this.$set(this.customerData, 'isCreated', true)
        }
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
      getContextMenuItems(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.node.rowIndex, params.value, params.node)
          }
        }))
      },
      getRowContextmenuList(row) {
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
      copy(row, index, value) {
        if (value) {
          this.$copyText(value)
        }
      },
      onGridReady(params) {
        this.gridApi = params.api
        // params.api.sizeColumnsToFit()
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      getLogList() {
        getLogInfo({
          ...this.listQuery,
          tableType: 'log_customer',
          pKeyId: this.customerData.custId
        }).then(res => {
          this.logList = res.data
          this.total = res.total
          this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
            headerName: item.label,
            flex: item.flex,
            field: item.prop,
            resizable: true,
            sortable: true,
            width: item.width,
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
          this.logView = true
        })
      },
      async submitTask() {
        await this.saveBaseInfo(false)
        customerSubmit({
          custId: this.customerData.custId
        }).then(res => {
          this.$message.success('提交成功!')
          this.$emit('updateCust', true)
        })
      },
      checkPermission() {
        !this.isCreated && checkPermission({customerId: this.customerData.custId}).then(res => {
          this.isModify = res.data.modify
        })
      },
      changeMask(obj) {
        if (obj.type === 'add') {
          this.maskNameList.push(obj.value)
          this.maskNameList = [...new Set(this.maskNameList)]
        } else if (obj.type === 'del') {
          this.maskNameList = [...new Set(this.maskNameList)].filter(item => item !== obj.value)
        }
      },
      async customerExamine(type) {
        await this.saveBaseInfo(false)
        customerExamine({
          custId: this.customerData.custId,
          examineStatus: type
        }).then(res => {
          this.$message.success('审核成功!')
          this.$emit('updateCust', true)
        })
      },
      createCustomer() {
        if (this.$refs.baseRef[0].validateForm()) {
          this.$refs.baseRef[0].createBaseInfo(true, (custInfo) => {this.createSign = true;this.isModify = true;this.$emit('changeIsCreated', custInfo)})
          // this.$emit('closeDetail', true) // 关闭页面，且刷新列表
        }
      },
      async saveBaseInfo(flag) {
        await this.$refs.baseRef[0].saveBaseInfo(flag)
        // this.$refs.baseRef[0].validateForm() && updateCustomerNew(this.$commonUtils.cleanNullAttr(this.$refs.baseRef[0].$data.customerBaseInfo)).then(res => {
        //   let message = ''
        //   if (this.createSign === true) {
        //     message = '创建成功!'
        //   } else {
        //     message = '保存成功!'
        //   }
        //   this.$message.success(message)
        //   this.$emit('updateCust', true) // 关闭页面，且刷新列表
        // })
      },
      closeEdit() {
        this.$emit('changeEditStatus', false)
      },
      openEdit() {
        this.$emit('changeEditStatus', true)
      },
      handleClick(a) {
        this.componentName = this.tabListPermission[+a.name - 1].cpn
        this.activeName = a.name
      },
      btnDelete() {
        this.$confirm(`确认是否删除照片？`, '删除', {
          confirmButtonText: '确定',
          type: "warning"
        }).then(() => {
          deleteCustomerIcon({custId: this.customerData.custId}).then((req) => {
            this.iconIsDel = true
            let msg = req.message
            this.$message({
              type: 'success',
              message: msg
            })
          })
        })
      },
      hideDelIcon() {
        this.isShow = false
      },
      showDelIcon() {
        this.isShow = true
      },
      isItemTrue(item) {
        if (!this.customerData[item]) {
          this.$message.error("请填写必填项")
          return false
        } else {
          return true
        }
      },
      handleAvatarChange(file, fileList) {
        // if (this.isItemTrue("custId")) {
        //
        // }
        // this.customerData.userIcon = URL.createObjectURL(file.raw)
        this.userIconCust = URL.createObjectURL(file.raw)
        this.$refs.userIconupload.submit()
      },
      onBeforeUploadIcon(file) {
        this.usericonSendData.tokenID = this.$store.getters.token
        this.usericonSendData.materialTypeId = 1045

        const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png"
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isIMAGE) {
          this.$message.error("上传文件只能是图片格式!")
        }
        if (!isLt1M) {
          this.$message.error("上传文件大小不能超过 1MB!")
        }
        return isIMAGE && isLt1M
      },
      iconSendSuccess(response, file, fileList) {
        if (response.success) {
          this.iconIsDel = false
          this.customerData.userIcon = response.data[0].address
          this.$message.success(response.message)
        } else {
          this.$message.error(response.message)
          this.customerData.userIcon = ''
        }
      },
    }
  }
</script>

<style>
  .header-table {
    cursor: pointer;
  }
</style>
<style lang="scss" scoped>
  .top-info {
    margin-bottom: 15px;
    height: 150px;
    width: 100%;
    background-color: #fff;
    padding: 20px;
    display: flex;
    align-items: center;

    .left-img {
      width: 100px;
      height: 100px;
      border: 1px solid #f2f2f2;
      margin-right: 20px;
    }

    .right-text {
      display: flex;
      flex-direction: column;
      height: 100%;
      flex: 1;
      justify-content: center;

      .top-text {
        display: flex;
        flex-direction: row;
        margin-bottom: 15px;
        align-items: flex-end;

        .title-text {
          font-size: 28px;
          font-weight: bold;
        }

        .right-title-text {
          font-size: 18px;
          margin-left: 30px;
          line-height: 32px;
          color: #333333;
        }

        .right-code-text {
          font-size: 16px;
          margin-left: 30px;
          line-height: 30px;
          color: #7f7f7f;
        }
      }

      .bottom-text {
        display: flex;
        flex-direction: row;
        color: #333333;
        font-size: 18px;

        div {
          display: flex;
          align-items: center;

          img {
            margin-right: 10px;
          }
        }
      }
    }

    .right-btn {
      height: 110px;
      display: flex;
      flex-wrap: nowrap;
      align-items: flex-start;
    }
  }

  > > > .el-tabs__header {
    /*margin: 0 !important;*/
    background-color: #fff;
    padding-left: 20px;
    margin-bottom: 15px;

    .el-tabs__item {
      font-size: 16px !important;
    }
  }

  > > > .el-tabs__content {
    /*padding-top: 15px;*/
    /*position: relative;*/
    height: var(--height) !important;
    overflow: auto;
  }

  > > > .el-tabs__nav-wrap::after {
    display: none;
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
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

  > > > .el-tabs__nav-wrap.is-scrollable {
    padding-right: 30px;
  }

  > > > .el-tabs__nav-next {
    right: 10px;
  }

  > > > .el-tabs__nav-wrap.is-scrollable {
    .el-tabs__nav-next, .el-tabs__nav-prev {
      line-height: 40px !important;
      font-size: 18px !important;

      &:hover {
        background-color: #E1F3FF;
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
      max-height: calc(80%);
      min-height: 400px;
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__header {
      border-bottom: 1px solid #D7D7D7;
    }

    > > > .el-dialog__body {
      overflow: auto;
      padding: 0;
    }
  }

  .abow_dialog1 {
    > > > .el-dialog__body {
      overflow: auto;
      padding: 0;
    }
  }

  .vAlign {
    width: 60px !important;
  }

</style>
