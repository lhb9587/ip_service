<template>
  <div class="staff">
    <div class="archiveButton">
      <template v-if="this.$store.getters.permissions.includes(371)">
        <el-button size="small" @click="saveSample()" type="primary">修改</el-button>
        <el-button size="small" @click="deleteSample()" type="primary">删除</el-button>
        <el-button size="small" @click="showTable = true" type="primary">批量编辑</el-button>
        <el-button size="small" @click="dialogSetting(2,'借出')" type="primary">借出</el-button>
        <el-button size="small" @click="dialogSetting(3,'寄出')" type="primary">寄出</el-button>
        <el-button size="small" @click="dialogSetting(1,'归还')" type="primary">归还</el-button>
        <el-button size="small" @click="dialogSetting(6,'转借')" type="primary">转借</el-button>
        <el-button size="small" @click="dialogSetting(5,'异地保存')" type="primary">异地保存</el-button>
        <el-button size="small" @click="dialogSetting(4,'销毁')" type="primary">销毁</el-button>
        <el-dropdown>
          <el-button size="small" type="primary">
            数据导出<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="customExport(1)">借出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="text" @click="gridApi.deselectAll();currentCaseId = ''">清除所选</el-button>
      </template>
      <div class="archiveExport">
        <el-button type="text" @click="exportList(2)" >导出</el-button>
      </div>
    </div>

    <div class="all">
      <div class="drag-main">
        <div id="mainId" class="main">
          <div id="topBoxId" class="topBox content_wrap" :style="{height: statementTopHeight}">
            <div class="left_wrap" :style="{width:pattern?leftWrapWidth:'100%' }">
              <div class="dots" @click="handleCheckboxState">
                <span class="dot">.</span>
                <span class="dot">.</span>
                <span class="dot">.</span>
              </div>
              <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                         icon="el-icon-brush"></el-button>
              <AgGridVue :style="{width:'100%',height: statementTopHeightGrid}"
                         class="ag-theme-balham"
                         :columnDefs="columnDefs"
                         :rowData="list"
                         :localeText="$store.state.caseInformation.localeText"
                         rowSelection="multiple"
                         suppressCellSelection
                         :gridOptions="gridOptions"
                         @rowClicked="rowClicked"
                         @rowDoubleClicked="rowDoubleClicked"
                         @dragStopped="dragStopped"
                         :getContextMenuItems="getContextMenuItems"
                         @grid-ready="onGridReady"
                         @sortChanged="refreshEvenRowsCurrencyData"
                         @filterChanged="refreshEvenRowsCurrencyData">
              </AgGridVue>
              <pagination
                v-show="total>0"
                :total="total"
                :pageSizes="pageSizesList"
                :page.sync="listQuery.pageNo"
                :limit.sync="listQuery.pageSize"
                @pagination="querySampleList"
              />
            </div>

            <div class="right_wrap" :style="{position:'relative','margin-left':currentCaseId&&pattern?'10px' :'0',height:statementTopHeightGrid}">
              <seeCaseDetail :style="cssVar" v-if="currentCaseId&&pattern" :case-id="currentCaseId" :taskType="taskType" :caseList="caseList" :sign="1" :backsign="0">
              </seeCaseDetail>
              <div v-else style="margin-left: 45%;margin-top: 30px">暂无数据</div>
            </div>
          </div>
          <div id="downBoxId" class="downBox" :style="{height: statementBottomHeight}">
            <!--            <div style="border: 1px solid #BDC3C7;padding: 0 5px 5px 5px;margin-top: 5px;border-bottom: none;">-->
            <div id="resizeId" class="r-resize"></div>
            <SampleInfoGrid :sample-info="sampleInfo" :statementBottomHeight="statementBottomHeight"/>
            <!--            </div>-->
          </div>
        </div>
      </div>
    </div>

    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState"
                  @cancel="closeSelect" :idArray="getCurrentRowsData('samId')"
                  :defaultMultipleSelect="preferenceList.map(i=>i.title)"
                  :propsArray="getCurrentRowsProps()"
                  :exportType="exportType" :exportQueryModel="exportQueryModel">
    </SelectOption>
    <EmitSearch @undateSearch="undateSearch"></EmitSearch>
    <div class="checkbox" v-show="checkboxState">
      <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple reserve-keyword filterable
                 placeholder="请选择" collapse-tags :popper-append-to-body="false" @visible-change="handleChange"
                 :filter-method="filterCheck">
        <template slot="">
          <div class="checkbox_bottom">
            <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
            <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置
            </el-button>
          </div>
        </template>
        <el-option v-for="(item,idx) in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))"
                   :key="item.COLUMN_NAME" :label="item.COLUMN_COMMENT" :value="item.COLUMN_NAME">
        </el-option>
      </el-select>
    </div>

    <el-dialog :visible.sync="detailView" title="样品信息" width="50%" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <sampleDetail v-if="detailView" :check-type="checkType" :sample-id="sampleId" @closeDialog="closeDetailDialog"></sampleDetail>
    </el-dialog>

    <el-dialog :visible.sync="settingView" :title="settingName" width="60%" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <sampleSetting v-if="settingView" :type="settingType" :sample-list="settingList" @cancel="closeSetting"></sampleSetting>
    </el-dialog>

    <!--  批量编辑-->
    <Willtable v-if="showTable" :showTable="showTable"
               :samDetailIds="getSelectedRows().map(item=>item.samId)" plType="样品信息"
               @closeTable="closeTable"></Willtable>
  </div>
</template>

<script>
import seeCaseDetail from '@/views/workbench/case/components/ManualIdentification/seeCaseDetail'
import {mapState } from "vuex";
import SelectOption from '@/views/workbench/case/components/SelectOption'
import Pagination from "@/components/Pagination";
import { selectColumn,queryPreference,savePreference,delPreference} from '@/api/caseList'
import axios from 'axios'
import sampleDetail from '@/views/workbench/material_management/components/sampleDetail.vue';
import sampleSetting from '@/views/workbench/material_management/components/sampleSetting.vue';
import { querySampleList, delSample, copySample, exportSampleLendOut } from "@/api/material";
import SampleInfoGrid from '@/views/workbench/material_management/components/sampleInfoGrid';
import Willtable from '@/components/Willtable'
export default {
  name: 'SampleTable',
  props: {
    editableTabsValue:{

    },
    list: {},
    defaultColumnDefs: {},
    identification: {},
  },
  data() {
    var tableHeader = []
    if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name)) {
      tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
    }
    return {
      sampleId: 0, // 档案id
      checkType: '', // 打开档案状态，create/edit
      detailView: false,
      settingView: false,
      settingType: '',
      settingName: '',
      settingList: '',
      reportMatterList: [],
      brushRightHasFilter: false,
      filterText: '',
      tableHeader: tableHeader,
      checkCaseList: [],
      checkboxState: false,
      exportType: 1,
      taskType: 1,
      caseMaterialId: '',
      currentCaseId: '',
      caseList: [],
      showTable: false,
      statementTopHeightGrid: '',
      statementTopHeight: localStorage.getItem('statementTopHeight') ? localStorage.getItem('statementTopHeight') : 'calc(70%)',
      leftWrapWidth: localStorage.getItem('leftWrapWidth') ? localStorage.getItem('leftWrapWidth') : '60%',
      statementBottomHeight: localStorage.getItem('statementBottomHeight') ? localStorage.getItem('statementBottomHeight') : 'calc(30% - 80px)',
      createDate:[],
      abslimitDate:[],
      recvDate:[],
      appDate:[],
      caseDate:[],
      djSubmitDate:[],
      regDate:[],
      isSpinShow: false,
      pageSizesList:[10, 50, 200,500,1000,5000,10000],
      listQuery:{
        pageNo:0,
        pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10,
      },
      currentPageSize:0,
      total:0,
      bussId:62,
      gridOptions: {
        ...this.$store.state.caseInformation.gridOptions, ...{
          statusBar: {
            statusPanels: [
              { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
              { statusPanel: 'agSelectedRowCountComponent', align: 'left' } // 总和过滤的行数组件
            ]
          },
        }
      },
      defaultcolumnDefs:[
        {
          headerName: '序号',
          field: 'sid',
          width: 80,
          enableRowGroup: true,
          cellRenderer:this.cellRenderer,
          floatingFilter:true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          'pinned': 'left', //固定在左边
          checkboxSelection: false,//设置为ture显示为复选框
          headerCheckboxSelection: false,//表头是否也显示复选框，全选反选用
          headerCheckboxSelectionFilteredOnly: true
        },
      ],
      patentTypeList: [{ label: '发明', id: 1296 }, { label: '实用新型', id: 1297 }, { label: '外观', id: 1298 }],
      columnDefs:[], // 默认表格列
      dataList: [

      ],
      queryModuleData:{},
      defaultParams: {
        //級聯菜單默認
        value: "caseTypeId",
        label: "caseType",
        children: "childrens",
        checkStrictly: true,
        multiple: true
      },
      customerList:[],
      materialTypeList:[],
      materialDocTypeList:[],
      preferenceList: [],
      exportQueryModel:'',
      selectionOptionState:false,
      multipleTypeText:'',
      pdfData:'',
      selectColumnList: [],
      filterData: {},
      checkFilterList: [],
      lendData: [],
      quickSearchParam: '',
      isQuery: 0,
      sampleInfo: {},
      myTabsActivity: false
    }
  },
  created() {
    this.$store.commit('caseInformation/SET_BUSSID', this.bussId)
    this.getAllWfs()
  },
  mounted(){
    this.rightDrag()
    this.dragTwoRowDiv("mainId", "topBoxId", "resizeId", "downBoxId");
    this.statementTopHeight = getComputedStyle(document.querySelector('#topBoxId'))['height']
    this.statementTopHeightGrid = Number(this.statementTopHeight.replace('px', '')) - 32 + 'px'
    this.statementBottomHeight = getComputedStyle(document.querySelector('#downBoxId'))['height']
  },
  methods: {
    // 统计 样品信息
    sampleCount(type) {
      let queryModuleData = {}
      let day = this.$wUtil.getDate('', 'day')
      switch (type) {
        case 1:
          queryModuleData = {
            createDateArray: [day,day]
          }
          break;
        case 2:
          queryModuleData = {
            recordDateArray: [day,day]
          }
          break;
        case 3:
          queryModuleData = {
            returnDateArray: [day,day]
          }
          break;
        case 4:
          queryModuleData = {
            unDestroyed: 1
          }
          break;
        case 5:
          queryModuleData = {
            destroyed: 1
          }
          break;
        case 6:
          queryModuleData = {
            otherStatus: 1
          }
          break;
        case 7:
          queryModuleData = {
            recordDate1Array: [day,day]
          }
          break;
      }
      this.queryList(Object.assign({pageNo: 1,pageSize: this.listQuery.pageSize},queryModuleData))
    },
    // 局部更新
    queryPartData(samIds){
      console.log('局部更新执行')
      this.$commonUtils.partUpdate(
        this.list,
        querySampleList,
        {
          searchKey: 'samIds',
          key: 'samId',
          value: samIds
        },
        (list) => {
          this.gridApi.refreshCells();
        }
      )
    },
    closeDetailDialog(samId,type) {
      this.detailView = false
      if (type == 'create'){
        // this.queryList({samIds:[samId]})
        this.sampleCount(1)
      }else if((typeof samId) == 'number'){
        this.queryPartData(samId)
      }
    },
    // 创建样品
    handleCreateView() {
      this.checkType = 'create'
      this.sampleId = 0
      this.detailView = true
    },
    // 编辑样品
    saveSample() {
      var sampleList = this.getSelectedRows()
      if (sampleList.length <= 0) {
        this.$message.warning('请选择修改样品！');
      } else {
        this.checkType = 'edit'
        this.sampleId = sampleList[0].samId
        this.detailView = true
      }
    },
    // 删除样品
    deleteSample() {
      var sampleList = this.getSelectedRows()
      if (sampleList.length < 0) {
        this.$message.warning('请选择删除样品！');
      } else {
        this.deleteSamId(sampleList.map(res => res.samId))
      }
    },
    // 显示状态设置页
    dialogSetting(type,name) {
      this.settingList = this.getSelectedRows()
      // 借出、寄出、异地保存 判断操作数据是否有，在库数量等于0的样品
      if(type == 2 || type == 3 || type == 5){
        if(this.settingList.find(item => item.quantity <= 0)) {
          this.$message({
            message: '选择样品的在库数量为0',
            type: 'warning'
          });
          return
        }
      }
      this.settingType = type
      this.settingName = name
      this.settingView = true
    },
    // 提示警告
    promptWarning(){
      this.$message({
        message: '选择样品不符合当前状态设置',
        type: 'warning'
      });
    },
    // 关闭状态设置页面
    closeSetting(samIds) {
      this.settingView = false
      samIds && this.queryPartData(samIds)
    },
    // 关闭批量编辑
    closeTable(data) {
      this.showTable = false
      data.samDetailIds && this.queryPartData(data.samDetailIds)
    },
    getCurrentRowsData(key){
      if (this.gridApi && this.gridApi.rowModel) {
        return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
      }
      return []
    },
    getFilterModel(){
      this.$nextTick(()=>{
        let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
        let arr =  Object.keys(data)
        let arrInstance=arr.map(item=>this.gridApi.getFilterInstance(item))
        arrInstance.forEach((item,index)=>{
          // item.selectNothing&&item.selectNothing()
          item.setModel(data[arr[index]])
          item.applyModel()
        })
        this.gridApi.onFilterChanged()
        let sortData =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'SortModel')
        if(sortData&&sortData.length){
          this.gridApi.setSortModel(sortData)
          this.gridApi.onSortChanged()
        }
        if(this.gridApi.rowModel.rootNode.childrenAfterFilter.length){
          this.gridApi.rowModel.rootNode.childrenAfterFilter[0].setSelected(true)
        }

      })
    },
    getCurrentRowsProps(){
      if (this.gridApi && this.gridApi.rowModel) {
        return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => ({caseMaterialId:item.caseMaterialId, mailId:item.mailId}))
      }
      return []
    },
    brushRight() {
      let data = this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
      let arr =  Object.keys(data)
      arr.forEach(item=>{
        this.gridApi.destroyFilter(item)
      })
      this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel', {})
    },
    dragStopped(params) {
      let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
        label: item.colDef.headerName,
        width: item.actualWidth,
        prop: item.colDef.field,
      })).filter(item => item.prop != "group" && item.prop != "operation")
      var arr = JSON.parse(localStorage.getItem('tableHeader'))
      arr.find(item => item.name == this.$options.name).tableHeader = tableHeader
      localStorage.setItem('tableHeader', JSON.stringify(arr))
      this.changeHeader(tableHeader)
      // console.log(a);
    },
    changeHeader(n) {
      if (n && n.length) {
        this.checkCaseList = n.map(item => item.prop).filter(item => item != 'sid')
        let list2 = this.checkCaseList.map(item => ({
          title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
            .COLUMN_COMMENT,
          value: item
        }));
        const data = {
          userId: this.$store.getters.userId,
          bussId: this.bussId,
          list2
        };
        savePreference(data).then(res => {

        });
      }
    },
    handleChange(boolean) {
      if (!boolean) {
        this.checkboxState = false;
      }
    },
    filterCheck(val) {
      this.filterText = val;
    },
    delPreference(num) {
      const data = {
        userId: this.$store.getters.userId,
        bussId: this.bussId
      };
      delPreference(data).then(res => {
        if (res.success) {
          this.checkboxState = false;
          if (!num) {
            this.getList();
          }
          this.getAllWfs();
        }
      });
    },
    savePreference(num) {
      let list2 = this.checkCaseList.map(item => ({
        title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
          .COLUMN_COMMENT,
        value: item
      }));
      const data = {
        userId: this.$store.getters.userId,
        bussId: this.bussId,
        list2
      };
      savePreference(data).then(res => {
        if (res.success) {
          this.checkboxState = false;
          this.filterText = ''
          if (!num) {
            this.querySampleList();
          }
          this.getAllWfs();
        }
      });
    },
    getLoactionWidth(label) {
      if (!localStorage.getItem('tableHeader')) {
        return 'auto'
      } else {
        var arr = JSON.parse(localStorage.getItem('tableHeader'))
        if (arr.find(item => item.name == this.$options.name)) {
          var header = arr.find(item => item.name == this.$options.name).tableHeader
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
    getAllWfs() {
      const data = {
        userId: this.$store.getters.userId,
        bussId: this.bussId
      };
      Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
        this.selectColumnList = res[0].data;

        this.preferenceList = res[1].data;
        this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
          headerName: item.title,
          field: item.value,
          width: this.getLoactionWidth(item.title) == 'auto' ? 200 : this.getLoactionWidth(item.title),
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, item.value)
            }
          }
        }))]
        this.$nextTick(() => {
          this.columnDefs.forEach(item => {
            this.columnApi.getColumn(item.field)&&this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
              if (document.querySelector(".ag-tabs")) {
                new this.$DraginResize(document.querySelector(".ag-set-filter-list"), {
                  clone: true,
                  end(info) {
                    if (info.dir == 'ver') {
                      this.elem.style.height = info.height + 'px';
                    } else if (info.dir == 'hor') {
                      this.elem.style.width = info.width + 'px';
                    }
                  }
                })
              }
              let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
              let arr =  Object.keys(data)
              if(this.columnDefs.map(itm => itm.field).diff(arr).includes(item.field)){
                this.gridApi.getFilterInstance(item.field).selectNothing()
              }
            });
          })
        })
        this.tableHeader = this.preferenceList.map(item => ({
          label: item.title,
          prop: item.value,
          width: this.getLoactionWidth(item.title)
        }))

        this.saveLocation()
        this.checkCaseList = this.preferenceList.map(item => item.value);
        this.preferenceList.forEach(item => {
          this.$set(this.filterData, item.value, []);
        });
        this.checkFilterList = this.preferenceList.map(item => false);
      });
    },
    saveLocation() {
      if (!localStorage.getItem('tableHeader')) {
        let arr = []
        arr.push({name: this.$options.name, tableHeader: this.tableHeader})
        localStorage.setItem('tableHeader', JSON.stringify(arr))
      } else {
        let arr = JSON.parse(localStorage.getItem('tableHeader'))
        if (arr.find(item => item.name == this.$options.name)) {
          arr.find(item => item.name == this.$options.name).tableHeader = this.tableHeader
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          arr.push({name: this.$options.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        }
      }

    },
    // 自定义导出
    customExport(type) {
      if (this.getSelectedRows().length > 0){
        const samIds = this.getSelectedRows().map(res => res.samId)
        let queryData = {
          samIds: samIds
        }
        console.log('queryModuleData',this.queryModuleData.recordDateArray)
        if(type == 1){
          if (this.queryModuleData.hasOwnProperty('recordDateArray')){
            queryData = {
              samIds: samIds,
              recordDateArray: this.queryModuleData.recordDateArray
            }
          }
          exportSampleLendOut(queryData).then(res => {
            this.downLoad(res.data)
          })
        }
      }else{
        this.$message.warning('请选择导出样品！');
      }
    },
    // 附件下载
    downLoad(data) {
      const url = data
      const downData = {
        url: `ipdoc/${url}`,
        success() {
          // notify.close()
        }
      }
      this.$commonUtils.downLoadAll(downData)
    },
    handleCheckboxState() {
      this.checkboxState = !this.checkboxState;
    },
    rightDrag(){
      let that=this
      document.querySelector('.left_wrap') && new this.$DraginResize(document.querySelector(".left_wrap"), {
        clone: true,
        end(info) {
          if (info.dir == 'ver') {
            this.elem.style.height = info.height + 'px';
          }
          else if (info.dir == 'hor') {
            this.elem.style.width = info.width + 'px';
            localStorage.setItem('leftWrapWidth', info.width + 'px')
            that.leftWrapWidth = info.width + 'px'
          }
        }
      })
    },
    dragTwoRowDiv(contentId, topBoxId, resizeId, downBoxId) {
      let resize = document.getElementById(resizeId);
      let topBox = document.getElementById(topBoxId);
      let downBox = document.getElementById(downBoxId);
      let box = document.getElementById(contentId);
      // let custGrid = document.getElementById('cust_grid');
      resize.onmousedown = (e) => {
        let startY = e.clientY;
        resize.top = resize.offsetTop;
        document.onmousemove = (e) => {
          let endY = e.clientY;
          let moveLen = resize.top + (endY - startY);
          let maxT = box.clientHeight - resize.offsetHeight;
          if (moveLen < 100) moveLen = 100;
          if (moveLen > maxT - 100) moveLen = maxT - 100;
          resize.style.top = moveLen;
          topBox.style.height = moveLen + "px";
          // custGrid.style.height = moveLen + "px";
          downBox.style.height = (box.clientHeight - moveLen - 37) + "px";
          this.statementTopHeight = topBox.style.height
          this.statementTopHeightGrid = moveLen - 32 + 'px'
          localStorage.setItem('statementTopHeight', topBox.style.height)
          this.statementBottomHeight = downBox.style.height
          localStorage.setItem('statementBottomHeight', downBox.style.height)
        }
        document.onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;
          resize.releaseCapture && resize.releaseCapture();
        }
        resize.setCapture && resize.setCapture();
        return false;
      }
    },
    rowClicked(param){
      this.sampleInfo = param.data
    },
    takeCaseDetail(param){
      this.$store.commit('user/SET_PATTERN',true)
      if (param.data.caseId != this.currentCaseId) {
        this.currentCaseId = ''
        this.caseList = []
        this.$nextTick(() => {
          this.currentCaseId = param.data.caseId
          this.caseList = param.data.caseArray
          this.taskType = param.data.taskType
          this.caseTypeId = param.data.caseTypeId
          this.judgeRank = param.data.judgeRank
        })
      }
    },
    // 双击查看
    rowDoubleClicked(params){
      this.checkType = this.$store.getters.permissions.includes(371) ? 'edit' : 'view'
      this.sampleId = params.node.data.samId
      this.detailView = true
    },
    // 右侧折叠案件详情
    changePattern(e){
      if(e===1){
        this.$store.commit('user/SET_PATTERN',false)
      } else {
        if (!this.currentCaseId){
          this.$message.warning('请点击列表案件文号！'); return
        } else {
          this.$store.commit('user/SET_PATTERN',true)
        }
      }
    },
    handleSearch(flag) {
      if (this.isQuery){
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$options.name)?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$options.name).queryModuleData:{}:{}
        this.listQuery.pageNo = 1;
        if (flag==1){
          this.quickSearchParam = ''
        }
        this.querySampleList();
        return
      }
      this.isQuery = 1
    },
    closeSelect(){
      this.selectionOptionState=false
    },
    exportList(flag) {
      this.exportType=flag
      this.selectionOptionState = true
    },
    changeSelection(n){
      if(n){
        this.columnDefs.find(item=>item.field=='sid').checkboxSelection=function(params) {
          // we put checkbox on the name if we are not doing grouping
          return params.columnApi.getRowGroupColumns().length === 0;
        },
          this.columnDefs.find(item=>item.field=='sid').headerCheckboxSelection= function(params) {
            // we put checkbox on the name if we are not doing grouping
            return params.columnApi.getRowGroupColumns().length === 0;
          }
        this.columnDefs.push({})
        this.columnDefs.pop({})
      }else {
        this.columnDefs.find(item=>item.field=='sid').checkboxSelection=false
        this.columnDefs.find(item=>item.field=='sid').headerCheckboxSelection=false
        this.columnDefs.push({})
        this.columnDefs.pop({})
      }
    },
    jumpDetailSubmisson(){
      if(this.multipleTypeText === "列表导出"){
        this.selectionOptionState=true
      }
    },
    getSelectedRows() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      return selectedData
    },
    changeTextRange(value, property) {
      this.$set(this.queryModuleData, property,value);
    },
    getContextMenuItems(params){
      return [{name:'复制',
        action: () =>{
          this.$copyText(params.value).then(
            res => {
            })
        }},
        {name:'修改',
          action:()=>{
            this.editSample(params.node.data)
          },permissions:371
        },
        {name:'取消暂存',
          action:()=>{
            this.cancelStaging(params.node.data)
          }
        }].filter(item=>{
        if(item.permissions){
          return this.$store.getters.permissions.includes(item.permissions)
        }else {
          return true
        }
      })
    },
    // 取消暂存
    cancelStaging(row) {
      this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'delete',title:this.editableTabsValue,name:this.editableTabsValue,identification:this.identification,data:row})
    },
    hiddenAll(){
      let list=this.gridApi.getSelectedRows()
      this.list=this.dataList.filter(item=>!list.includes(item))
      this.$nextTick(()=>{
        this.currentPageSize = this.gridApi.rowModel.rootNode.allChildrenCount
      })
    },
    // 复制样品
    copySample(row) {
      this.checkType = 'create'
      this.sampleId = row.samId
      this.detailView = true
    },
    // // 复制样品
    // copySample(row){
    //   this.$confirm('该操作会创建一条相同样品，可进行编辑修改，是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     copySample({samId :row.samId}).then(res=>{
    //       if(res.data) {
    //         this.checkType = 'edit'
    //         this.sampleId = res.data.samId
    //         this.detailView = true
    //         this.querySampleList()
    //       }
    //     })
    //   }).catch(() => {
    //
    //   });
    // },
    // 修改
    editSample(row) {
      this.checkType = 'edit'
      this.sampleId = row.samId
      this.detailView = true
    },
    // 删除
    deleteSamId(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSample({ samIds: row }).then(res=>{
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.handleSearch()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    cellRenderer(params){
      if(params.colDef.field=='sid'){
        return params.rowIndex+1
      }
      if(params.colDef.field=='recvDate'){
        return `<span title="${params.value}">${params.value?params.value.slice(0,10):''}</span>`
      }

      // 案件文号点击
      if (params.data && params.colDef.field == 'showRefno') {
        var eDiv1 = document.createElement('div');
        eDiv1.innerHTML = `<span class="btn-simple1" style="cursor: pointer;color: #00b0ff" title="${params.value}">${params.value ? params.value : ''}</span>`
        var eButton1 = eDiv1.querySelectorAll('.btn-simple1')[0];

        eButton1.addEventListener('click', () => {
          if (params.data) {
            this.takeCaseDetail(params)
          }
        });
        return eDiv1;
        // return `<a href="#/workbench/case/seeCaseDetail/${params.data.caseId}?taskType=${params.data.taskType}" target="_blank" title="${params.value}">${params.value?params.value:''} </a>`
      }
      return `<span title="${params.value}">${params.value?params.value:''}</span>`
    },
    refreshEvenRowsCurrencyData(params) {
      this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
      if(!params.columnApi.columnController.groupAutoColumns) {
        this.gridApi.forEachNode(rowNode => {
          rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
        });
      }
      if (this.list.length) {
        if(params.type=="filterChanged"){
          let obj = this.gridApi.getFilterModel()
          for (let k in obj) {
            if (obj.hasOwnProperty(k)) {
              if(obj[k].values && !obj[k].values.length){
                delete obj[k]
              }
            }
          }
          Object.keys(obj).length && this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel', this.gridApi.getFilterModel())
          var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
          var arr = Object.keys(data);
          if (arr.length) {
            this.brushRightHasFilter = true
          } else {
            this.brushRightHasFilter = false
          }
        }
        if (params.type == "sortChanged") {
          this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'SortModel', this.gridApi.getSortModel())
        }
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    // 检索方案点击触发
    undateSearch(n){
      if(this.bussId==n.bussId){
        this.queryModuleData=JSON.parse(n.value)
        this.quickSearchParam = ''
        this.querySampleList()
      }
    },
    // 查询
    querySampleList() {
      let data = []
      if (this.quickSearchParam) {
        data = {
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          quickSearchParam: this.quickSearchParam
        }
      }else{
        data = this.$commonUtils.emptyParameterProcessing(Object.assign(this.listQuery,this.queryModuleData))
      }
      this.queryList(data)
    },
    queryList(data) {
      querySampleList(data).then(res => {
        if (res.success) {
          this.list = res.data
          this.total = res.total
          this.currentPageSize = res.data.length
          // 导出列表的查询条件
          this.exportQueryModel = JSON.stringify(data)
          // 样品状态列表
          this.sampleInfo = res.data[0]
          this.getFilterModel()
        }
      })
    },
  },
  watch:{
    checkboxState(n) {
      if (n) {
        this.$nextTick(() => {
          this.$refs.checkCaseSelect.focus()
        })
      }
    },
    $route: {
      handler: function(val, oldVal){
        this.$nextTick(()=>{
          this.rightDrag()
        })
      },
      immediate: true
    },
  },
  components:{
    SampleInfoGrid,
    Pagination,
    SelectOption,
    seeCaseDetail,
    sampleDetail,
    sampleSetting,
    Willtable
  },
  computed:{
    ...mapState({
      'pattern' : state => state.user.pattern
    }),
    clientHeight(){
      return document.documentElement.clientHeight-250
    },
    cssVar(){
      return {
        '--height': document.documentElement.clientHeight-300 + 'px'
      }
    },
    computedSubmitDate(){
      let  curArr=[...new Set(this.queryModuleData.caseTypeIds.map(item => item[0]))]
      if([1,2,75,76,86].find(item=>curArr.includes(item))){
        return false
      }else if(curArr.length==0){
        return  false
      }else{
        return true
      }
    }
  }
}
</script>

<style scoped lang="scss">
/* 两横 */
#mainId {
  width: 100%;
  /*overflow: hidden;*/
  position: relative;
}
#resizeId {
  height: 5px;
  cursor: s-resize;
}
#downBoxId {
  height: 20%;
}
.main {
  height: 85vh;

  .topBox {
    /*border: 1px solid #BDC3C7;*/
    /*background: #1ee3aa;*/
  }

  .r-resize {
    /*height: 5px;*/
    background: #fff;
    transition: all 0.3s ease-in-out;

    &:hover {
      /*box-shadow: 0px 0px 18px 0px rgba(64, 158, 255, 0.5);*/
      background-color: #C5E2FF;
      /*opacity: .3;*/
    }
  }

  .downBox {
    /*margin-top: 5px;*/
    /*border: 1px solid #BDC3C7;*/
    /*background: #eb77eb;*/
  }
}

.el-form {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-cascader {
    width: 100%;
  }
  .el-multi-cascader{
    width: 100%;
  }
  .el-select /deep/{
    .el-select__tags{
      max-height: 40px;
      overflow-y: auto;
    }
  }
  .multi-cascader /deep/{
    /*.el-cascader__label{*/
    /*  max-height: 40px;*/
    /*  overflow-y: auto*/
    /*}*/
  }
  .postInfo-container-item {

    /deep/ .el-form-item__content {
      width: 330px;
      display: flex;
      /*height: 28px;*/
      align-items: center;
      .el-select {
        width: 100%;
      }
      .el-input {
        width: 100%;
      }
    }
  }
}

@keyframes show {
  0% {

    opacity: 0;
    //transform: translateX(100%);

  }
  100% {
    // transform: translateX(0);
    opacity: 1;

  }
}
@keyframes hide {
  0% {
    opacity: 1;
    // transform: translateX(0);
  }
  100% {

    opacity: 0;
    //  transform: translateX(100%);
  }
}
.show-enter-active {
  animation: show 0.5s;
}
.show-leave-active {
  animation: hide 0.5s;
}
.show-enter, .show-leave-to {
  opacity: 0;
}
.el-button{
  position: relative;
}
.buttonWrap{
  width: 100%;
  text-align: center;
  margin: 10px 0;
  display: flex;
  justify-content: center;
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
.button-group-search{
  position: relative;
  display: flex;
  .searchRight{
    margin-left: 0;
    height: 32px;
    border-top-right-radius:3px !important;
    border-bottom-right-radius:3px !important;
    padding: 0 5px
  }
  .searchWrap{
    border-radius: 5px;
    top: 34px;
    left: 10px;
    width: 550px;
    min-height: 200px;
    /*max-height: 500px;*/
    position: absolute;
    background: #ffffff;
    border: 1px solid #d4d5d5;
    z-index: 50;
    /*overflow: auto;*/
    padding: 20px 0;
    box-shadow: 0 3px 6px rgba(111,111,111,0.2);
    /deep/  .el-form{
      padding-bottom: 10px;
      overflow: auto;
      max-height: 500px;
      .el-form-item__label{
        text-align: left;
        padding-left: 32px;
        font-weight: normal;
      }
      .el-form-item__content{
        input{
          border-top: 0;
          border-left: 0;
          border-radius: 0;
          border-right: 0
        }
      }
    }
    .clearWrap{
      display: flex;
      justify-content: flex-end;
      right: 20px;
      bottom: 10px;
      position: absolute;
      z-index: 1;
    }
  }
}
.archiveExport{
  cursor: pointer;
  float: right;
  align-items: center;
  right: 0px;
  bottom: -6px;
  font-size: 14px;
  padding-right: 40px;
}
.archiveButton{
  margin-bottom: 10px;
  position: relative;
  /deep/ .button-group-search{
    margin-top: 5%;
  }
  /deep/ .queryButton .buttonWrap_small .el-button{
    margin-left: 0;
  }
}
.content_wrap{
  width: 100%;
  display: flex;
  .left_wrap{
    position: relative;
    transition:all 0.5s;
    //   width: 40%;
  }
  .right_wrap{
    box-shadow: 0px 0px 18px 0px rgba(64, 158, 255,0.5);
    height: 598px;
    /*overflow: auto;*/
    overflow: hidden;
    transition:all 0.5s;
    flex: 1;
    /deep/ *{
      font-size: 12px !important;
    }
    // width: 60%;
    /deep/.sectionWrap{
      padding: 0 !important;
      padding-left: 10px !important;
      // padding-bottom: 350px!important;
      .ElectronWrap{
        padding: 0!important;
      }
    }
  }
}
>>>.el-tabs__content{
  height: var(--height)!important;
  overflow: auto!important;
}
.dots {
  cursor: pointer;
  position: absolute;
  left: 0;
  z-index: 1;
  top: 6px;
  width: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  .dot {
    color: transparent;
    padding: 1px;
    margin: 1px;
    width: 5px;
    background: RGBA(113, 123, 140, 1);
    height: 5px;
    display: block;
  }

  & ~ span {
    margin-left: 5px;
  }
}
.checkbox {
  position: absolute;
  left: 0px;
  top: 125px;
  /*width: 222px;*/
  height: 324px;
  border: 1px solid #99a9bf;
  background: #fff;
  z-index: 100;
  padding-top: 6px;
  padding-left: 6px;
  padding-right: 16px;
}

.checkbox_bottom {
  position: absolute;
  display: flex;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 29px;
  background: #fff;
  z-index: 2;
  justify-content: flex-end;
}

.checkbox_bottom ~ li:last-of-type {
  margin-bottom: 30px;
}
.brush_right {
  position: absolute;
  right: 6px;
  z-index: 1;
  top: -4px;
}

>>> .el-dialog__body{
  padding: 0 20px;
}
</style>
