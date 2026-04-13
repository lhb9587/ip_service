<template>
  <div>
  <div class="queryButton">
    <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect" v-allow="83" >
      <el-submenu index="1">
        <template slot="title">新建</template>
        <el-submenu index="1-1" v-allow="152">
          <template slot="title">新建费用账单</template>
          <el-menu-item index="1-1-1" v-allow="180">账单</el-menu-item>
          <el-menu-item index="1-1-2" v-allow="181">内部账单</el-menu-item>
          <el-menu-item index="1-1-4" v-allow="229">境外账单</el-menu-item>
          <el-menu-item index="1-1-3">费用</el-menu-item>
        </el-submenu>
        <el-submenu index="1-2" >
          <template slot="title">新建案件进程</template>
          <el-menu-item index="1-2-1" v-if="$store.getters.permissions.includes(182)">递交指令</el-menu-item>
          <el-menu-item index="1-2-2" v-allow="183">官方通知</el-menu-item>
          <el-menu-item index="1-2-2-2">递交官方(文件)</el-menu-item>
          <el-menu-item index="1-2-3"  >客户往来</el-menu-item>
          <el-menu-item index="1-2-4" >内部往来</el-menu-item>
          <el-menu-item index="1-2-5" >外代所往来</el-menu-item>
          <el-menu-item index="1-2-6" >对方当事人往来</el-menu-item>
          <!--<el-menu-item index="1-2-7">特批预立卷审批</el-menu-item>-->
        </el-submenu>
        <el-submenu index="1-3" v-allow="154">
          <template slot="title">新建时限</template>
          <el-menu-item index="1-3-1" v-allow="190">官方时限</el-menu-item>
          <el-menu-item index="1-3-2" v-allow="191">内部时限</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
<!--    <el-button class="plbj" type="primary" size="small" @click="handleSelect('批量操作')">批量编辑</el-button>-->
<!--    <exportFile ref="exportFile" :downLoadState="downLoadState" :multipleSelection="multipleSelection" @getData="getExportFileData" @exportList="exportList" @close="closeSelect" :pageTitle="pageTitle" @multipleTypeText="changeMultiple"></exportFile>-->
  </div>
    <div style="display: flex;position: relative">
      <TitleTotal :total="list.length" />
      <div class="button_wrap" v-if="selectionState">
<!--        <el-button type="primary"  size="mini" v-if="multipleTypeText==='审核'" @click="recognizedError" v-show="pageTitle=='官方通知'">识别错误</el-button>-->
        <el-button class="exactButton" size="mini" type="primary" @click="jumpDetailSubmisson">{{multipleTypeText}}</el-button>
        <el-button class="exactButton"  size="mini" @click="selectionState=false">取消</el-button>
      </div>
<!--      <el-button type="text" style="position: absolute;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px" @click="exportList"><i class="el-icon-download">导出</i></el-button>-->
    </div>
 <div class="content_wrap" style="margin-top: 10px">
     <div class="left_wrap" :style="{width:currentCaseId&&pattern?leftWrapWidth:'100%' }">
          <div class="w-table contextmenu">
            <el-table
              @row-contextmenu="rowContextmenu"
              highlight-current-row
              class="myeltable"
              ref="caseListMultiple"
              :data="list"
              :height="clientHeight"
              @row-click="rowClick"
              @current-change="changeRow"
              :row-class-name="getRowClassName"
              empty-text="暂无数据"
              @select="handleSelectionChange"
              @select-all="handleSelectionAll"
              :header-cell-class-name="headerCellClassName"
              :cell-class-name="getCellClassName"
              @header-dragend="headerDragend"
              @filter-change="filterChange"
              border
            >
              <template v-if="selectionState">
                <el-table-column type="selection" width="30" class="selection"  >
                </el-table-column>
              </template>
              <el-table-column type="index" width="60" label="序号" align="left">
                <template slot="header" slot-scope="scope">
                  <span>序号</span>
                </template>
              </el-table-column>

              <el-table-column v-for="(col, index) in tableHeader" :key="index"
                               :prop="col.prop"
                               :label="col.label"
                               :width="col.width"
                               :min-width="getMinWidth(col,tableHeader,currentId)"
                               :type="col.type"
                               :header-align="col.headerAlign"
                               :column-key="index.toString()"
                               :render-header="renderHeader"
                               :filters="unique(list.map(i=>({text:i[col.prop],value:i[col.prop]})),'value').filter(ii=>ii.value!='')"
                               :filter-method="filterHandler"
                               sortable
                               filter-placement="bottom-start"
              >
                <template slot-scope="scope">
                  <span  v-if="col.prop!=='imageFile'&&col.prop!='djRemarks'&&col.prop!='custName'" :title="scope.row[col.prop]" style="margin: 0;cursor: pointer"
                         @click="col.prop=='agentNum'&&!pattern?takeCaseDetail(scope.row):''"
                  >
                  {{scope.row[col.prop]}}
                  </span>
                  <div   @click.stop v-if="col.prop=='djRemarks'" :title="scope.row[col.prop]">
                    {{scope.row[col.prop]}}
                  </div>
                  <CustCard v-if="col.prop=='custName'" :custName="scope.row.custName" :customerID="scope.row.custId" />
                  <img class="filterTableTmg" v-if="col.prop==='imageFile'" :src="'/ipdoc'+scope.row['imageFile']" alt="">
                </template>
              </el-table-column>
<!--              <el-table-column align="left" label="操作" width="auto" >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-button-->
<!--                    v-if="pageTitle==='案件管理'&&scope.row.isSubmitOfficial==0&&$store.getters.permissions.includes(203)"  type="text" size="medium" icon="el-icon-edit" @click.stop="editFun(scope.row)"></el-button>-->
<!--                  <el-button-->
<!--                    v-if="pageTitle==='案件管理'&&scope.row.isSubmitOfficial==1&&$store.getters.permissions.includes(204)" type="text" size="medium" icon="el-icon-edit" @click.stop="editFun(scope.row)"></el-button>-->
<!--                    <el-button type="text" size="medium" icon="el-icon-delete" @click.stop="delCase(scope.row)"></el-button>-->
<!--                </template>-->
<!--              </el-table-column>-->
            </el-table>
          </div>
          <div class="checkbox" v-show="checkboxState" >
            <el-select ref="checkCaseSelect" v-model="checkCaseList" reserve-keyword multiple   filterable placeholder="请选择" collapse-tags :popper-append-to-body="false"  @visible-change="handleChange"
                       :filter-method="filterCheck">
              <template slot="">
                <div class="checkbox_bottom">
                  <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
                  <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置</el-button>
                  <!--<el-button size="mini" round @click.stop="checkNotAtAll">全不选</el-button>-->
                </div>
              </template>
              <el-option v-for="(item,idx) in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))" :key="item.COLUMN_NAME" :label="item.COLUMN_COMMENT" :value="item.COLUMN_NAME">
                <!--<el-checkbox v-model="selectBox[idx]">{{item.COLUMN_COMMENT}}</el-checkbox>-->
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="right_wrap" v-if="pattern" :style="{position:'relative','margin-left':currentCaseId&&pattern?'10px' :'0',height:clientHeight+'px'}">
          <!--<span class="el-icon-close" slot="close" style="cursor:pointer;position: absolute;right: 0;top: 10px;z-index: 1000" @click="closeCurrentRow"></span>-->
          <seeCaseDetail v-if="currentCaseId" :case-id="currentCaseId" :sign="1" :filed="filed">
          </seeCaseDetail>
        </div>
  </div>
    <el-dialog :title="uploadType" :visible.sync="uploadState" width="70%" :append-to-body="true">
      <el-table :data="multipleSelection" border>
        <el-table-column type="index" width="60" label="序号" align="left">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.$index+1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" v-for="(item,index) in preferenceList" :label="item.title" :prop="item.value" :width="item.width" :key="index">
          <template slot-scope="scope">
            <span :class="item.value=='agentNum'?'itemTitle_style':''" v-if="item.value!=='imageFile'&&item.value!='custName'" :title='scope.row[item.value]' style="margin: 0;cursor: pointer"
                  @click="takeCaseDetail(scope.row)">
              {{scope.row[item.value]}}
            </span>
            <CustCard v-if="item.value=='custName'" :custName="scope.row.custName" :customerID="scope.row.custId" />
            <img class="filterTableTmg" v-if="item.value==='imageFile'" :src="'ipdoc'+scope.row['imageFile']" alt="">
          </template>
        </el-table-column>
      </el-table>
      <BulkUploadFile v-if="uploadState" :uploadType="uploadType" :curCaseId="multipleSelection.map(item=>item.caseId)" @changeFalse="closeSelect"></BulkUploadFile>
    </el-dialog>
    <Willtable v-if="showTable" :plType="plType" :changeType="multipleSelection.length?multipleSelection[0].changeType:''" :reportMatter="multipleSelection.length?multipleSelection[0].reportMatter:null"
               :materialTypeId="multipleSelection.length?multipleSelection[0].materialTypeId:null" :caseTypeId="multipleSelection.length?multipleSelection[0].caseTypeId:null" :caseIds='willtableCaseIdList'
                :showTable='showTable'  @closeTable="closeSelect">
    </Willtable>
  <SelectOption :exportType="2" :buss-id="bussId" v-if="selectionOptionState&&multipleSelection.map(item=>item[getCurFilterId(pageTitle)]).length" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="multipleSelection.map(item=>item[getCurFilterId(pageTitle)])" :defaultMultipleSelect="preferenceList.map(i=>i.title)" >

  </SelectOption>
    <detail-official-communication v-if="communicationState" @closeThisPage="closeSelect" :dialogVisible="communicationState" :queryInfo="queryInfo" ></detail-official-communication>
 </div>
</template>
<script>
import {
  selectColumn,
  savePreference,
  queryPreference,
  delPreference,
  queryFilter,
  configFilter,
  queryCorrelationCaseList
} from "@/api/caseList.js";
import {mapState,mapGetters} from 'vuex'
import {unique,throttle} from '@/utils'
import BulkUploadFile from "../BulkUploadFile";
import SelectOption from "../SelectOption";
import seeCaseDetail from "../ManualIdentification/seeCaseDetail";
import ViewsSwitching from "../ViewsSwitching";
import Willtable from "@/components/Willtable";
import exportFile from '@/components/exportFile'
import DetailOfficialCommunication from '@/views/workbench/case/officialCommunication/detailOfficialCommunication';
export default {
  props: {
    editableTabsValue:{

    },
    business: {
      type: String,
      default: "2"
    },
    bussId: {
      type: String,
      default: '5'
    },
    caseList: {
      type: Array,
      default: () => []
    },
    pageTitle: {
      type: String,
      default:'案件管理'
    },
    list: {}
  },
  name: "Table",
  data() {
    var tableHeader = []
    if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == 'types_of_cases' + this.$route.name)) {
      tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == 'types_of_cases' + this.$route.name).tableHeader
    }
    return {
      willtableCaseIdList:[],
      selectionOptionState:false,
      plType: "",
      downLoadState: false,
      uploadType: '',
      uploadState: false,
      showTable: false,
      selectColumnList: [],
      currentCaseId: '',
      currentId: '',
      selectionState: false,
      checkboxState: false,
      tableHeader: tableHeader,
      tableHeaderLabelList: [],
      checkCaseList: [],
      multipleSelection:[],
      requireList:[],
      preferenceList:[],
      multipleTypeText:'',
      filterText: '',
      dragState: {
        start: -1, // 起始元素的 index
        end: -1, // 结束元素的 index
        move: -1, // 移动鼠标时所覆盖的元素 index
        dragging: false, // 是否正在拖动
        direction: undefined // 拖动方向
      },
      rowContextmenuList: [
        { name: '相关案件', action: 'relevant' },
        { name:'暂存', action: 'temporarStorage'},

      ],
      filterDataSum:{},
      filed:"",
      queryInfo:{},
      communicationState:false,
      leftWrapWidth: localStorage.getItem('leftWrapWidth')?localStorage.getItem('leftWrapWidth'):'60%'
    }
  },
  created() {
    this.getAllWfs();
  },
  mounted() {
    new this.$DraginResize(document.querySelector(".left_wrap"), {
      clone: true,
      end(info) {
        if (info.dir == 'ver') {
          this.elem.style.height = info.height + 'px';
        }
        else if (info.dir == 'hor') {
          this.elem.style.width = info.width + 'px';
          localStorage.setItem('leftWrapWidth', info.width + 'px')
        }
      }
    })
  },
  methods: {
    getRowContextmenuList(row){
      return this.rowContextmenuList.concat([
        { name:'复制',action: 'copy' },
        { name: '修改', action: 'editFun',permissions:203, isSubmitOfficial:0},
        { name: '修改', action: 'editFun',permissions:204, isSubmitOfficial:1 },
        { name: '删除', action: 'delCase'},
      ].filter(item=>{
        if(item.permissions){
          return this.$store.getters.permissions.includes(item.permissions)&&row.isSubmitOfficial==item.isSubmitOfficial
        }else if(item.action=='pdfPre'){
          return row.addressList&&row.addressList.length!==0?true:false
        }else {
          return true
        }
      })).filter(item=>!this.editableTabsValue.includes(item.name))
    },
    rowContextmenu(row, column, event) {
      const that=this
      this.$ContextMenu({
        event, // 传入鼠标事件
        menu:this.getRowContextmenuList(row)
      }).then(rs => {
        if(rs){
          this[rs](row, column, event);
        }
      });
    },
    relevant(row, column, event) {
      queryCorrelationCaseList({caseId:row.caseId}).then(res=>{
        if(this.pageTitle==='案件管理'){
          res.data.forEach(item=>{
            if(this.ajglTabList.find(item=>item.title=='相关案件')){
              this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'相关案件',name:'相关案件',data:item}})
            }else {
              this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'相关案件',name:'相关案件',list:[item]}})
            }
          })
        }
      })
    },
    temporarStorage(row, column, event) {
      if(this.pageTitle==='案件管理'){
        if(this.ajglTabList.find(item=>item.title=='暂存案件')){
          this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'暂存案件',name:'暂存案件',data:row}})
        }else {
          this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'暂存案件',name:'暂存案件',list:[row]}})
        }
      }
    },
    abnormal(row, column, event) {
      if(this.pageTitle==='案件管理'){
        if(this.ajglTabList.find(item=>item.title=='异常案件')){
          this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'异常案件',name:'异常案件',data:row}})
        }else {
          this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'异常案件',name:'异常案件',list:[row]}})
        }
      }
    },
    copy(row, column, event) {
      this.$copyText(event.target.innerText).then(
        res => {
        })
    },
    changeMultiple(text){
      this.multipleTypeText=text
    },
    jumpDetailSubmisson() {
      if (!this.multipleSelection.length) {
        this.$message.error("请先选择！");
        return;
      }
      if (this.multipleSelection.length && this.multipleTypeText === "递交") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.multipleSelection,
            this.getCurFilterId(this.pageTitle)
          );
          let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
            item => item.caseId
          );
          this.selectionState=false
          this.$router.push({
            path: "/workbench/case/detailSubmission",
            query: { caseIds: caseIds, pageType: "1" }
          });
        } else {
          this.selectionState=false
          this.$router.push({
            path: "/workbench/case/detailSubmission",
            query: {
              caseIds: [
                ...new Set(this.multipleSelection.map(item => item.caseId))
              ],
              pageType: "1"
            }
          });
        }
      }
      if (this.multipleSelection.length && this.multipleTypeText === "上传") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.multipleSelection,
            this.getCurFilterId(this.pageTitle)
          );
          let caseList = this.getLanglist(list.map(item => item.caseArray));
          let caseIds = caseList.map(item => item.caseId);
          const queryInfo = {
            caseIds: caseIds,
            pageType: "1",
            info: caseList
          };
          this.$emit("getCaseQueryInfo", queryInfo);
        } else {
          let info = this.unique(this.multipleSelection, "caseId");
          info.forEach(item => {
            delete item.insId;
          });
          const queryInfo = {
            caseIds: [
              ...new Set(this.multipleSelection.map(item => item.caseId))
            ],
            pageType: "1",
            info
          };
          this.queryInfo=queryInfo
          this.communicationState=true
          console.log(546)
          // this.$emit("getCaseQueryInfo", queryInfo);
        }
      }
      if (
        this.multipleSelection.length &&
        this.multipleTypeText === "新建账单"
      ) {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.multipleSelection,
            this.getCurFilterId(this.pageTitle)
          );
          let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
            item => item.caseId
          );
          this.selectionState=false
          this.$router.push({
            path: "/workbench/finance/off_bill/bill",
            query: { caseIdList: caseIds }
          });
        } else {
          this.selectionState=false
          this.$router.push({
            path: "/workbench/finance/off_bill/bill",
            query: {
              caseIdList: [
                ...new Set(this.multipleSelection.map(item => item.caseId))
              ]
            }
          });
        }
      }
      if (
        this.multipleSelection.length &&
        this.multipleTypeText === "新建内部账单"
      ) {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.multipleSelection,
            this.getCurFilterId(this.pageTitle)
          );
          let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
            item => item.caseId
          );
          this.selectionState=false
          this.$router.push({
            path: "/workbench/finance/off_bill/bill",
            query: { caseIdList: caseIds }
          });
        } else {
          this.selectionState=false
          this.$router.push({
            path: "/workbench/finance/off_bill/insideBill",
            query: {
              caseIdList: [
                ...new Set(this.multipleSelection.map(item => item.caseId))
              ]
            }
          });
        }
      }
      if (
        this.multipleSelection.length &&
        this.multipleTypeText === "新建官方时限"
      ) {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.multipleSelection,
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");
          this.selectionState=false
          this.$router.push({
            path: "/workbench/createTimeLimit",
            query: { agentNums: agentNums, kind: 1 }
          });
        } else {
          this.selectionState=false
          this.$router.push({
            path: "/workbench/createTimeLimit",
            query: {
              agentNums: [
                ...new Set(this.multipleSelection.map(item => item.agentNum))
              ].join(","),
              kind: 1
            }
          });
        }
      }
      if (
        this.multipleSelection.length &&
        this.multipleTypeText === "新建内部时限"
      ) {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.multipleSelection,
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");
          this.selectionState=false
          this.$router.push({
            path: "/workbench/createTimeLimit",
            query: { agentNums: agentNums, kind: 2 }
          });
        } else {
          this.selectionState=false
          this.$router.push({
            path: "/workbench/createTimeLimit",
            query: {
              agentNums: [
                ...new Set(this.multipleSelection.map(item => item.agentNum))
              ].join(","),
              kind: 2
            }
          });
        }
      }
      if (this.multipleTypeText === "新建费用") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.multipleSelection,
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");

          this.$router.push({
            path: "/workbench/finance/addFeeDetail/1",
            query: { agentNums: agentNums, kind: 2 }
          });
        } else {

          this.$router.push({
            path: "/workbench/finance/addFeeDetail/1",
            query: {
              agentNums: [
                ...new Set(this.multipleSelection.map(item => item.agentNum))
              ].join(","),
              kind: 2
            }
          });
        }
        this.selectionState=false
      }
      if (this.multipleTypeText === "新建境外账单") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.multipleSelection,
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");

          this.$router.push({
            path: "/workbench/finance/addOverseasBill/1",
            query: { agentNums: agentNums }
          });
        } else {
          this.$router.push({
            path: "/workbench/finance/addOverseasBill/1",
            query: {
              agentNums: [
                ...new Set(this.multipleSelection.map(item => item.agentNum))
              ].join(","),
            }
          });
        }
        this.selectionState=false
      }
      if (
        this.multipleSelection.length &&
        this.multipleTypeText === "批量操作"
      ) {
        this.plType = this.pageTitle;
        if (this.pageTitle === "官方通知") {
          // let list = this.unique(
          //   this.multipleSelection,
          //   this.getCurFilterId(this.pageTitle)
          // );
          // let caseIdList = this.getLanglist(
          //   list.map(item => item.caseArray)
          // ).map(item => item.tmFileId);
          this.willtableCaseIdList = [
            ...new Set(this.multipleSelection.map(item => item.tmFileId))
          ];
          // this.willtableCaseIdList = caseIdList;
          this.showTable = true;
        } else {
          if (this.pageTitle === "递交官方") {
            this.willtableCaseIdList = [
              ...new Set(this.multipleSelection.map(item => item.insId))
            ];
          } else {
            this.willtableCaseIdList = [
              ...new Set(this.multipleSelection.map(item => item.caseId))
            ];
          }

          this.showTable = true;
        }
      }
      if(this.otherSelect){
        this.downLoadState=true
        this.$nextTick(()=>{
          this.downLoadState=false
        })
      }
      if(this.exportListState){
        this.selectionOptionState=true
        this.exportListState=false
      }
      if(this.multipleTypeText === '确定'&&!this.otherSelect&&!this.selectionOptionState){
        this.uploadState=true
      }
      // this.selectionState = false;
    },
    closeSelect(){
      this.selectionState=false
      this.selectionOptionState=false
      this.uploadState = false
      this.showTable=false
      this.communicationState=false
    },
    editFun(row) {
      if(row.pageId===100){
        this.$router.push('/workbench/case/case_detail/'+row.caseId+'/'+row.caseType+'?pageId=100')
      } else {
        this.$router.push('/workbench/case/case_detail/'+row.caseId+'/'+row.caseType)
      }
    },
    delCase(row) {
      this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'delete',data:{title:this.editableTabsValue,name:this.editableTabsValue,data:row}})
    },
    takeCaseDetail(row) {
      if( this.$commonUtils.getTwoDimensionalArray(this.$store.getters.caseTypeList,'caseTypeId',row.caseTypeId).includes(2)){
        this.$router.push({ path: '/workbench/case/seeCaseDetail/' + row.caseId, query: {taskType:2}})
      }else {
        this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId);
      }
    },
    handleChange(boolean) {
      if (!boolean) {
        this.checkboxState = false;
      }
    },
    getMinWidth(data, header, currentId) {
      //  let arr=[...[String(data.label).replace(/[\u4E00-\u9FA5]/gi,'aa').length],...this.caseList.map(item => item[data.prop]).filter(item=>item).map(item=>String(item).replace(/[\u4E00-\u9FA5]/gi,'aa').length)]
      return String(data.label).replace(/[\u4E00-\u9FA5]/gi, 'aa').length * 12 + 30
    },
    savePreference(num) {
      let list2 = this.checkCaseList.map(item => ({
        title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
          .COLUMN_COMMENT,
        value: item
      }));
      const data = {
        userId: this.userId,
        bussId: this.bussId,
        list2
      };
      savePreference(data).then(res => {
        if (res.success) {
          this.checkboxState = false;
          this.filterText=''
          if (!num) {
            this.queryCaseList();
          }
          this.getAllWfs();
        }
      });
    },
    delPreference(num) {
      const data = {
        userId: this.userId,
        bussId: this.bussId
      };
      delPreference(data).then(res => {
        if (res.success) {
          this.checkboxState = false;
          if (!num) {
            this.queryCaseList();
          }
          this.getAllWfs();
        }
      });
    },
    handleCheckboxState() {
      this.checkboxState = !this.checkboxState;
    },
    saveLocation() {
      if (!localStorage.getItem('tableHeader')) {
        let arr = []
        arr.push({name: 'types_of_cases' + this.$route.name, tableHeader: this.tableHeader})
        localStorage.setItem('tableHeader', JSON.stringify(arr))
      } else {
        let arr = JSON.parse(localStorage.getItem('tableHeader'))
        if (arr.find(item => item.name == 'types_of_cases' + this.$route.name)) {
          arr.find(item => item.name == 'types_of_cases' + this.$route.name).tableHeader = this.tableHeader
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          arr.push({name: 'types_of_cases' + this.$route.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        }
      }
    },
    getAllWfs() {
      const data = {
        userId: this.userId,
        bussId: this.bussId
      };
      Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
        this.selectColumnList = res[0].data;
        this.preferenceList = res[1].data;
        this.tableHeader = this.preferenceList.map(item => ({
          label: item.title,
          prop: item.value,
          width: this.getLoactionWidth(item.title)
        }))
        this.saveLocation()
        this.checkCaseList = this.preferenceList.map(item => item.value);
        // this.preferenceList.forEach(item => {
        //   this.$set(this.filterData, item.value, []);
        // });
        // this.checkFilterList = this.preferenceList.map(item => false);
      });
    },
    headerDragend(newWidth, oldWidth, column, event){
      var arr=JSON.parse(localStorage.getItem('tableHeader'))
      var header=arr.find(item=>item.name=='types_of_cases'+this.$route.name).tableHeader
      if (header.find(item=>item.label==column.label)){
        header.find(item=>item.label==column.label).width=newWidth
      }
      localStorage.setItem('tableHeader',JSON.stringify(arr))
    },
    getLoactionWidth(label) {
      if (!localStorage.getItem('tableHeader')) {
        return String(label).replace(/[\u4E00-\u9FA5]/gi, 'aa').length * 12 + 30
      } else {
        var arr = JSON.parse(localStorage.getItem('tableHeader'))
        if (arr.find(item => item.name == 'types_of_cases' + this.$route.name)) {
          var header = arr.find(item => item.name == 'types_of_cases' + this.$route.name).tableHeader
          if (header.find(item => item.label == label)) {
            return header.find(item => item.label == label).width
          } else {
            return String(label).replace(/[\u4E00-\u9FA5]/gi, 'aa').length * 12 + 30
          }
        } else {
          return 'auto'
        }
      }
    },
    renderHeader(createElement, {column}) {
      return createElement(
        'div', {
          'class': ['thead-cell'],
          on: {
            mousedown: ($event) => {
              this.handleMouseDown($event, column)
            },
            mouseup: ($event) => {
              this.handleMouseUp($event, column)
            },
            mousemove: ($event) => {
              this.handleMouseMove($event, column)
            }
          }
        }, [
          // 添加 <a> 用于显示表头 label
          createElement('a', column.label),
          // 添加一个空标签用于显示拖动动画
          createElement('span', {
            'class': ['virtual']
          })
        ])
    },
    // 按下鼠标开始拖动
    handleMouseDown(e, column) {
      e.target.parentNode.parentNode.childNodes[1].click()
      this.dragState.dragging = true
      this.dragState.start = parseInt(column.columnKey)
      // 给拖动时的虚拟容器添加宽高
      let table = document.getElementsByClassName('w-table')[0]
      let virtual = document.getElementsByClassName('virtual')
      for (let item of virtual) {
        item.style.height = item.parentElement.clientHeight - 1 + 'px'
        item.style.width = item.parentElement.clientWidth + 'px'
        item.style.left = '10px'

        // item.innerText=item.parentElement.parentElement.innerText
      }
    },

// 鼠标放开结束拖动
    handleMouseUp(e, column) {
      this.dragState.end = parseInt(column.columnKey) // 记录起始列
      this.dragColumn(this.dragState)
      // 初始化拖动状态
      this.dragState = {
        start: -1,
        end: -1,
        move: -1,
        dragging: false,
        direction: undefined
      }
    },

// 拖动中
    handleMouseMove(e, column) {
      if (this.dragState.dragging) {
        let index = parseInt(column.columnKey) // 记录起始列
        if (index - this.dragState.start !== 0) {
          this.dragState.direction = index - this.dragState.start < 0 ? 'left' : 'right' // 判断拖动方向
          this.dragState.move = parseInt(column.columnKey)
        } else {
          this.dragState.direction = undefined
        }
      } else {
        return false
      }
    },
    // 拖动易位
    dragColumn({start, end, direction}) {
      if (start == -1) {
        return
      }
      let tempData = []
      let left = direction === 'left'
      let min = left ? end : start - 1
      let max = left ? start + 1 : end
      for (let i = 0; i < this.tableHeader.length; i++) {
        if (i === end) {
          tempData.push(this.tableHeader[start])
        } else if (i > min && i < max) {
          tempData.push(this.tableHeader[left ? i - 1 : i + 1])
        } else {
          tempData.push(this.tableHeader[i])
        }
      }
      if (start == end) {
        return
      }
      this.tableHeader = tempData
      this.$refs.caseListMultiple.store.states.filters={}
      let arr=Array.from(this.$refs.caseListMultiple.$el.querySelectorAll('.is-sortable'))
      let classList = arr.map(item=>Array.from(item.classList).find(itm=>itm.includes('column')))
      this.$refs.caseListMultiple.store.states.columns.forEach(ii=>{
        ii.filteredValue=[]
      })
      this.tableHeader.forEach((item,index)=>{
        classList.forEach((itm,idx)=>{
          if(index==idx){
            this.$refs.caseListMultiple.store.states.filters[itm]=this.filterDataSum[item.label]
            this.$refs.caseListMultiple.store.states.columns.forEach(ii=>{
              if(ii.id==itm){
                ii.filteredValue=this.filterDataSum[item.label]
              }
            })
          }
        })
      })
    },
    filterChange(a){
      for (var key in a){
        this.tableHeader.forEach((item,index)=>{
          if(index==key){
            this.$set(this.filterDataSum,item.label,a[key])
            // this.filterDataSum[item.label]=a[key]
          }
        })
      }
    },
    checkNotAtAll() {
      this.checkCaseList = [];
    },
    setWidth() {
      let timer = setInterval(() => {
        if (this.$el.getElementsByClassName("el-select-dropdown")[0]) {
          const els = this.$el.getElementsByClassName("el-select-dropdown")[0];
          const els1 = this.$el.getElementsByClassName("checkbox")[0];
          els1.children[0].click();
          //els.style.width = '100px';
          clearInterval(timer);
        }
      }, 60);
    },
    setFilterItem(index) {
      this.checkFilterList.splice(index, 1, !this.checkFilterList[index]);
    },
    queryFilter() {
      this.transferVisible = true;
      const data = {
        bussId: this.bussId
      };
      queryFilter(data).then(res => {
        if (res.success) {
          this.transferData = this.generateData(res.data);
        }
      });
    },
    generateData(arr) {
      arr.forEach(item => {
        item.key = item.filterId;
        item.label = item.filterName;
      });
      return arr;
    },
    configFilter() {
      const data = {
        bussId: this.bussId,
        filterIds: this.transferValue.join(",")
      };
      configFilter(data).then(res => {
        this.transferVisible = false;
        this.queryFilterConfig();
      });
    },
    handleSelect(key, keyPath) {

      if (key === "1-2-1") {
        this.multipleTypeText = "递交";
      }
      if (key === "1-2-2") {
        this.multipleTypeText = "上传";
      }
      if (key === "1-1-1") {
        this.multipleTypeText = "新建账单";
      }
      if (key === "1-1-2") {
        this.multipleTypeText = "新建内部账单";
      }
        if (key === "1-3-1") {
          this.multipleTypeText = "新建官方时限";
        }
        if (key === "1-3-2") {
          this.multipleTypeText = "新建内部时限";
        }
      if (key === "1-1-3") {

        this.multipleTypeText = "新建费用";
      }
      if (key === "1-1-4") {

        this.multipleTypeText = "新建境外账单";
      }
        if (key === "1-2-2-2") {
          this.multipleTypeText = "确定";
          this.uploadType = "递交官方";
        }
        if (key === "1-2-3") {
          this.multipleTypeText = "确定";
          this.uploadType = "客户往来";
        }
        if (key === "1-2-4") {
          this.multipleTypeText = "确定";
          this.uploadType = "内部往来";
        }
        if (key === "1-2-5") {
          this.multipleTypeText = "确定";
          this.uploadType = "外代所往来";
        }
        if (key === "1-2-6") {
          this.multipleTypeText = "确定";
          this.uploadType = "对方当事人往来";
        }
        if (key === "1-2-7") {
          this.multipleTypeText = "确定";
          this.uploadType = "特批预立卷审批";
        }

        if (key == "批量操作") {
          this.multipleTypeText = "批量操作";
        }
        this.requireList = []
        this.otherSelect = false
        this.exportListState = false
         this.selectionState = true;
        this.multipleSelection.forEach(item => {
          this.$refs.caseListMultiple.toggleRowSelection(item, false)
        })
        this.multipleSelection = [];
      },
      exportList() {
        this.otherSelect = false
        this.multipleSelection.forEach(item => {
          this.$refs.caseListMultiple.toggleRowSelection(item, false)
        })
        this.multipleSelection = []
        this.selectionState = true;
        this.multipleTypeText = '列表导出';
        this.exportListState = true
      },
      getExportFileData(requireList, key) {
        if (key) {
          this.$refs.exportFile.currentType = key
        }
        this.multipleSelection.forEach(item => {
          this.$refs.caseListMultiple.toggleRowSelection(item, false)
        })
        this.multipleSelection = []
        this.selectionState = true
        //this.multipleTypeText='确定'
        this.otherSelect = true
        this.exportListState = false
        this.requireList = requireList
      },
      intercept(val) {
        if (!this.requireList.length) {
          return
        }
        this.requireList.forEach(thisType => {
          if ([...new Set(this.multipleSelection.map(item => item[thisType['value']]))].length >= 2) {
            this.$message.error(`该选择需要${thisType.label}相同`);
            this.multipleSelection.filter(item => item[thisType['value']] !== this.multipleSelection[0][thisType['value']]).forEach(row => {
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(item => item[this.getCurFilterId(this.pageTitle)] !== row[this.getCurFilterId(this.pageTitle)]);
            });
          }
        })
      },
      handleSelectionAll(val) {
        val = val.filter(item => item !== undefined);
        this.multipleSelection = this.unique(
          this.multipleSelection.concat(val),
          this.getCurFilterId(this.pageTitle)
        );
        this.intercept(val)
        if (this.multipleTypeText === "递交") {
          if ([...new Set(this.multipleSelection.map(item => item.custName))].length >= 2) {
            this.$message.error("您必须选择同一客户下的案件");
            this.multipleSelection.filter(item => item.custName !== this.multipleSelection[0].custName).forEach(row => {
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(item => item[this.getCurFilterId(this.pageTitle)] !== row[this.getCurFilterId(this.pageTitle)]);
            });
          }
          if ([...new Set(this.multipleSelection.map(item => item.caseType))].length >= 2) {
            this.$message.error("您必须选择同一类型下的案件");
            this.multipleSelection
              .filter(
                item => item.caseType !== this.multipleSelection[0].caseType
              )
              .forEach(row => {
                this.$refs.caseListMultiple.toggleRowSelection(row, false);
                this.multipleSelection = this.multipleSelection.filter(
                  item =>
                    item[this.getCurFilterId(this.pageTitle)] !==
                    row[this.getCurFilterId(this.pageTitle)]
                );
              });
          }
          if (
            [...new Set(this.multipleSelection.map(item => item.appCnName))]
              .length >= 2
          ) {
            this.$message.error("您必须选择同一申请人下的案件");
            this.multipleSelection
              .filter(
                item => item.appCnName !== this.multipleSelection[0].appCnName
              )
              .forEach(row => {
                this.$refs.caseListMultiple.toggleRowSelection(row, false);
                this.multipleSelection = this.multipleSelection.filter(
                  item =>
                    item[this.getCurFilterId(this.pageTitle)] !==
                    row[this.getCurFilterId(this.pageTitle)]
                );
              });
          }
        }
        if (
          this.multipleTypeText === "新建账单" ||
          this.multipleTypeText === "新建内部账单"
        ) {
          if (
            [...new Set(this.multipleSelection.map(item => item.custName))]
              .length >= 2
          ) {
            this.$message.error("您必须选择同一客户下的案件");
            this.multipleSelection
              .filter(
                item => item.custName !== this.multipleSelection[0].custName
              )
              .forEach(row => {
                this.$refs.caseListMultiple.toggleRowSelection(row, false);
                this.multipleSelection = this.multipleSelection.filter(
                  item =>
                    item[this.getCurFilterId(this.pageTitle)] !==
                    row[this.getCurFilterId(this.pageTitle)]
                );
              });
          }
        }
        if (this.multipleTypeText === "批量操作") {
          if (
            [...new Set(this.multipleSelection.map(item => item.caseTypeId))]
              .length >= 2
          ) {
            this.$message.error("您必须选择同一案件类型");
            this.multipleSelection.filter(item => item.caseTypeId !== this.multipleSelection[0].caseTypeId).forEach(row => {
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item => item[this.getCurFilterId(this.pageTitle)] !== row[this.getCurFilterId(this.pageTitle)]);
            });
            if (this.multipleSelection.length && (this.multipleSelection[0].caseTypeId == 48 || this.multipleSelection[0].caseTypeId == 165) && [...new Set(this.multipleSelection.map(item => item.changeType))].length >= 2) {
              this.$message.error("您必须选择同一撤回类型");
              this.multipleSelection.filter(item => item.changeType !== this.multipleSelection[0].changeType).forEach(row => {
                this.$refs.caseListMultiple.toggleRowSelection(row, false);
                this.multipleSelection = this.multipleSelection.filter(
                  item => item[this.getCurFilterId(this.pageTitle)] !== row[this.getCurFilterId(this.pageTitle)]);
              });
            }
          }
        }
        if (!val.length) {
          this.list.forEach(row => {
            this.multipleSelection = this.multipleSelection.filter(
              item =>
                item[this.getCurFilterId(this.pageTitle)] !==
                row[this.getCurFilterId(this.pageTitle)]
            );
          });
        }
      },
      // tableselectRow() {
      //   let indexOfList = [this.list.map(item => Number(item[this.getCurFilterId(this.pageTitle)])).indexOf(Number(this.startRow)), this.list.map(item => Number(item[this.getCurFilterId(this.pageTitle)])).indexOf(Number(this.lastRow))].sort((a, b) => a - b)
      //   this.rowList = this.list.filter((item, index) => index >= indexOfList[0] && index <= indexOfList[1])
      //   console.log(this.rowList);
      //   // if (this.multipleTypeText === "递交") {
      //   //   if ([...new Set(this.rowList.map(item => item.custName))].length >= 2) {
      //   //     this.$message.error("您必须选择同一客户下的案件");
      //   //     this.rowList=this.rowList.filter(item=>item.custName==this.rowList[0].custName)
      //   //   }
      //   //   if ([...new Set(this.rowList.map(item => item.caseType))].length >= 2) {
      //   //     this.$message.error("您必须选择同一案件类型的案件");
      //   //     this.rowList=this.rowList.filter(item=>item.caseType==this.rowList[0].caseType)
      //   //   }
      //   //   if ([...new Set(this.rowList.map(item => item.appCnName))].length >= 2) {
      //   //     this.$message.error("您必须选择同一申请人下的案件");
      //   //     this.rowList=this.rowList.filter(item=>item.appCnName==this.rowList[0].appCnName)
      //   //   }
      //   // }
      //   // if (this.multipleTypeText === "新建账单" || this.multipleTypeText === "新建内部账单") {
      //   //   if ([...new Set(this.rowList.map(item => item.custName))].length >= 2) {
      //   //     this.$message.error("您必须选择同一客户下的案件");
      //   //     this.rowList=this.rowList.filter(item=>item.custName==this.rowList[0].custName)
      //   //   }
      //   // }
      //   // if (this.multipleTypeText === "批量操作") {
      //   //   if ([...new Set(this.rowList.map(item => item.caseTypeId))].length >= 2) {
      //   //     this.$message.error("您必须选择同一案件类型的案件");
      //   //     this.rowList=this.rowList.filter(item=>item.caseTypeId==this.rowList[0].caseTypeId)
      //   //   }
      //   //   if (this.rowList.length&&this.rowList[0].caseTypeId==48&&[...new Set(this.rowList.map(item => item.changeType))].length >= 2) {
      //   //     this.$message.error("您必须选择同一撤回类型的案件");
      //   //     this.rowList=this.rowList.filter(item=>item.changeType==this.rowList[0].changeType)
      //   //   }
      //   // }
      //   console.log(this.multipleSelection);
      //   this.rowList.forEach(item => {
      //     this.$refs.caseListMultiple.toggleRowSelection(this.list.find(i => i[this.getCurFilterId(this.pageTitle)] == item[this.getCurFilterId(this.pageTitle)]), true);
      //     this.multipleSelection = this.unique(
      //       this.multipleSelection.concat([item]),
      //       this.getCurFilterId(this.pageTitle)
      //     );
      //   })
      //   //if(this.rowList.find(item => Number(item[this.getCurFilterId(this.pageTitle)]) == Number(this.lastRow))){
      //   setTimeout(() => {
      //     this.$refs.caseListMultiple.toggleRowSelection(this.list.find(i => i[this.getCurFilterId(this.pageTitle)] == Number(this.lastRow)), true);
      //     this.multipleSelection = this.unique(
      //       this.multipleSelection.concat([this.list.find(i => i[this.getCurFilterId(this.pageTitle)] == Number(this.lastRow))]),
      //       this.getCurFilterId(this.pageTitle)
      //     );
      //     //  this.intercept()
      //   })
      //   // }
      // },
    tableselectRow(){

      let indexOfList=[this.list.map(item=>Number(item[this.getCurFilterId(this.pageTitle)])).indexOf(Number(this.startRow)),this.list.map(item=>Number(item[this.getCurFilterId(this.pageTitle)])).indexOf(Number(this.lastRow))].sort((a,b)=>a-b)
      this.rowList=this.list.filter((item,index)=>index>=indexOfList[0]&&index<=indexOfList[1])
      if (this.multipleTypeText === "递交") {
        if ([...new Set(this.rowList.map(item => item.custName))].length >= 2) {
          this.$message.error("您必须选择同一客户下的案件");
          this.rowList=this.rowList.filter(item=>item.custName==this.rowList[0].custName)
        }
        if ([...new Set(this.rowList.map(item => item.caseType))].length >= 2) {
          this.$message.error("您必须选择同一案件类型的案件");
          this.rowList=this.rowList.filter(item=>item.caseType==this.rowList[0].caseType)
        }
        if ([...new Set(this.rowList.map(item => item.appCnName))].length >= 2) {
          this.$message.error("您必须选择同一申请人下的案件");
          this.rowList=this.rowList.filter(item=>item.appCnName==this.rowList[0].appCnName)
        }
      }
      if (this.multipleTypeText === "新建账单" || this.multipleTypeText === "新建内部账单") {
        if ([...new Set(this.rowList.map(item => item.custName))].length >= 2) {
          this.$message.error("您必须选择同一客户下的案件");
          this.rowList=this.rowList.filter(item=>item.custName==this.rowList[0].custName)
        }
      }
      if (this.multipleTypeText === "批量操作") {
        if ([...new Set(this.rowList.map(item => item.caseTypeId))].length >= 2) {
          this.$message.error("您必须选择同一案件类型的案件");
          this.rowList=this.rowList.filter(item=>item.caseTypeId==this.rowList[0].caseTypeId)
        }
        if (this.rowList.length&&this.rowList[0].caseTypeId==48&&[...new Set(this.rowList.map(item => item.changeType))].length >= 2) {
          this.$message.error("您必须选择同一撤回类型的案件");
          this.rowList=this.rowList.filter(item=>item.changeType==this.rowList[0].changeType)
        }
      }
      if(this.multipleTypeText === "报官清单"){
        this.requireList.forEach(thisType =>{
          if ([...new Set(this.rowList.map(item => item[thisType['value']]))].length >= 2) {
            this.$message.error(`该选择需要${thisType.label}相同`);
            this.rowList=this.rowList.filter(item=>item[thisType['value']]==this.rowList[0][thisType['value']])
          }
        })
      }
      // this.intercept()
      this.rowList.forEach(item => {
        this.$refs.caseListMultiple.toggleRowSelection(this.list.find(i=>i[this.getCurFilterId(this.pageTitle)]==item[this.getCurFilterId(this.pageTitle)]), true);
        this.multipleSelection = this.unique(
          this.multipleSelection.concat([item]),
          this.getCurFilterId(this.pageTitle)
        );
      })
      this.startRow=''
      this.lastRow=''
    },
      handleSelectionChange(val, row) {
        val = val.filter(item => item != undefined);
        this.multipleSelection = this.unique(
          this.multipleSelection.concat(val),
          this.getCurFilterId(this.pageTitle)
        );
        if (!val.find(item => item[this.getCurFilterId(this.pageTitle)] === row[this.getCurFilterId(this.pageTitle)])) {
          this.multipleSelection = this.multipleSelection.filter(
            item =>
              item[this.getCurFilterId(this.pageTitle)] !==
              row[this.getCurFilterId(this.pageTitle)]
          );
          this.startRow = ''
        }
        this.intercept(val)
        if (this.multipleTypeText === "递交") {
          if ([...new Set(this.multipleSelection.map(item => item.custName))].length >= 2) {
            this.$message.error("您必须选择同一客户下的案件");
            this.$refs.caseListMultiple.toggleRowSelection(row, false);
            this.multipleSelection = this.multipleSelection.filter(
              item =>
                item[this.getCurFilterId(this.pageTitle)] !==
                row[this.getCurFilterId(this.pageTitle)]
            );
          }
          if ([...new Set(this.multipleSelection.map(item => item.caseType))].length >= 2) {
            this.$message.error("您必须选择同一案件类型的案件");
            this.$refs.caseListMultiple.toggleRowSelection(row, false);
            this.multipleSelection = this.multipleSelection.filter(
              item =>
                item[this.getCurFilterId(this.pageTitle)] !==
                row[this.getCurFilterId(this.pageTitle)]
            );
          }
          if ([...new Set(this.multipleSelection.map(item => item.appCnName))].length >= 2) {
            this.$message.error("您必须选择同一申请人下的案件");
            this.multipleSelection.filter(item => item.appCnName !== this.multipleSelection[0].appCnName).forEach(row => {
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item =>
                  item[this.getCurFilterId(this.pageTitle)] !==
                  row[this.getCurFilterId(this.pageTitle)]
              );
            });
          }
        }
        if (this.multipleTypeText === "新建账单" || this.multipleTypeText === "新建内部账单") {
          if ([...new Set(this.multipleSelection.map(item => item.custName))].length >= 2) {
            this.$message.error("您必须选择同一客户下的案件");
            this.$refs.caseListMultiple.toggleRowSelection(row, false);
            this.multipleSelection = this.multipleSelection.filter(
              item =>
                item[this.getCurFilterId(this.pageTitle)] !==
                row[this.getCurFilterId(this.pageTitle)]
            );
          }
        }
        if (this.multipleTypeText === "批量操作") {
          if ([...new Set(this.multipleSelection.map(item => item.caseTypeId))].length >= 2) {
            this.$message.error("您必须选择同一案件类型的案件");
            this.$refs.caseListMultiple.toggleRowSelection(row, false);
            this.multipleSelection = this.multipleSelection.filter(
              item =>
                item[this.getCurFilterId(this.pageTitle)] !==
                row[this.getCurFilterId(this.pageTitle)]
            );
          }
          if (this.multipleSelection.length && (this.multipleSelection[0].caseTypeId == 48 || this.multipleSelection[0].caseTypeId == 165) && [...new Set(this.multipleSelection.map(item => item.changeType))].length >= 2) {
            this.$message.error("您必须选择同一撤回类型的案件");
            this.$refs.caseListMultiple.toggleRowSelection(row, false);
            this.multipleSelection = this.multipleSelection.filter(
              item =>
                item[this.getCurFilterId(this.pageTitle)] !==
                row[this.getCurFilterId(this.pageTitle)]
            );
          }
        }
      },
    rowClick(row, column, event){
      if(row[this.getCurFilterId(this.pageTitle)]!=this.currentId){
        this.currentId=''
        this.currentCaseId=''
        this.$nextTick(()=>{
          this.currentId=row[this.getCurFilterId(this.pageTitle)]
          this.currentCaseId=row.caseId
        })
      }else {

      }
      if(this.selectionState){
        if(this.multipleSelection.find(item=>item[this.getCurFilterId(this.pageTitle)]==row[this.getCurFilterId(this.pageTitle)])){
          this.multipleSelection=this.multipleSelection.filter(item=>item[this.getCurFilterId(this.pageTitle)]!=row[this.getCurFilterId(this.pageTitle)])
          this.$refs.caseListMultiple.toggleRowSelection(row, false)
          this.startRow=''
        } else {
          var flag=true
          this.multipleSelection.push(row)
          if (this.multipleTypeText === "递交") {
            if ([...new Set(this.multipleSelection.map(item => item.custName))].length >= 2) {
              this.$message.error("您必须选择同一客户下的案件");
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item =>
                  item[this.getCurFilterId(this.pageTitle)] !==
                  row[this.getCurFilterId(this.pageTitle)]
              );
              flag=false
            }
            if ([...new Set(this.multipleSelection.map(item => item.caseType))].length >= 2) {
              this.$message.error("您必须选择同一案件类型的案件");
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item =>
                  item[this.getCurFilterId(this.pageTitle)] !==
                  row[this.getCurFilterId(this.pageTitle)]
              );
              flag=false
            }
            if ([...new Set(this.multipleSelection.map(item => item.appCnName))].length >= 2) {
              this.$message.error("您必须选择同一申请人下的案件");
              this.multipleSelection.filter(item => item.appCnName !== this.multipleSelection[0].appCnName).forEach(row => {
                this.$refs.caseListMultiple.toggleRowSelection(row, false);
                this.multipleSelection = this.multipleSelection.filter(
                  item =>
                    item[this.getCurFilterId(this.pageTitle)] !==
                    row[this.getCurFilterId(this.pageTitle)]
                );
              });
              flag=false
            }
          }
          if (this.multipleTypeText === "新建账单" || this.multipleTypeText === "新建内部账单") {
            if ([...new Set(this.multipleSelection.map(item => item.custName))].length >= 2) {
              this.$message.error("您必须选择同一客户下的案件");
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item =>
                  item[this.getCurFilterId(this.pageTitle)] !==
                  row[this.getCurFilterId(this.pageTitle)]
              );
              flag=false
            }
          }
          if (this.multipleTypeText === "批量操作") {
            if ([...new Set(this.multipleSelection.map(item => item.caseTypeId))].length >= 2) {
              this.$message.error("您必须选择同一案件类型的案件");
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item =>
                  item[this.getCurFilterId(this.pageTitle)] !==
                  row[this.getCurFilterId(this.pageTitle)]
              );
              flag=false
            }
            if (this.multipleSelection.length&&(this.multipleSelection[0].caseTypeId==48||this.multipleSelection[0].caseTypeId==165)&&[...new Set(this.multipleSelection.map(item => item.changeType))].length >= 2) {
              this.$message.error("您必须选择同一撤回类型的案件");
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item =>
                  item[this.getCurFilterId(this.pageTitle)] !==
                  row[this.getCurFilterId(this.pageTitle)]
              );
              flag=false
            }
          }
          if (this.multipleTypeText === "报官清单"){
            if(this.requireList.length){
              this.requireList.forEach(thisType =>{
                if ([...new Set(this.multipleSelection.map(item => item[thisType['value']]))].length >= 2) {
                  this.$message.error(`该选择需要${thisType.label}相同`);
                  this.multipleSelection.filter(item => item[thisType['value']]!== this.multipleSelection[0][thisType['value']]).forEach(row => {
                    this.$refs.caseListMultiple.toggleRowSelection(row, false);
                    this.multipleSelection = this.multipleSelection.filter(item => item[this.getCurFilterId(this.pageTitle)] !== row[this.getCurFilterId(this.pageTitle)]);
                  });
                  flag=false
                }
              })
            }
          }
          if(event.shiftKey){
            if(this.startRow){
              this.lastRow = row[this.getCurFilterId(this.pageTitle)]
              if(this.lastRow==this.startRow){
                this.lastRow=''
              }
            }
            if(!this.startRow&&flag) {
              this.startRow= row[this.getCurFilterId(this.pageTitle)]
              return
            }
            this.tableselectRow(this.rowList)
            this.rowList = []
          } else {
            if(!this.startRow&& flag){
              this.startRow=row[this.getCurFilterId(this.pageTitle)]
            }
          }
        }
      }
    },
      changeHeader(n) {
        if (n && n.length) {
          this.checkCaseList = n.map(item => item.prop)
          let list2 = this.checkCaseList.map(item => ({
            title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
              .COLUMN_COMMENT,
            value: item
          }));
          const data = {
            userId: this.userId,
            bussId: this.bussId,
            list2
          };
          savePreference(data).then(res => {
            this.$nextTick(() => {
              // this.caseList.push({})
              // this.caseList.pop()
            })
          });
        }
        },
      filterCheck(val) {
        this.filterText = val;},
      changeRow(row) {
        if (!this.pattern) {
          return
        }
        var that = this
        // console.log(this.$refs.caseListMultiple.$el.querySelector('.el-table__body'));
        document.onkeydown = throttle((event) => {
          var e = event || window.event || arguments.callee.caller.arguments[0];
          if (e && e.keyCode == 40) { //下
            if (that.list.find((item, index) => index == that.list.map(item => item[that.getCurFilterId(that.pageTitle)]).indexOf(that.currentId) + 1)) {
              that.$refs.caseListMultiple.setCurrentRow(that.list.find((item, index) => index == that.list.map(item => item[that.getCurFilterId(that.pageTitle)]).indexOf(that.currentId) + 1))
            }
          }
          if (e && e.keyCode == 38) { // 上
            if (that.list.find((item, index) => index == that.list.map(item => item[that.getCurFilterId(that.pageTitle)]).indexOf(that.currentId) - 1)) {
              that.$refs.caseListMultiple.setCurrentRow(that.list.find((item, index) => index == that.list.map(item => item[that.getCurFilterId(that.pageTitle)]).indexOf(that.currentId) - 1))
            }
          }
        }, 300)
        if(this.$commonUtils.getTwoDimensionalArray(this.$store.getters.caseTypeList,'caseTypeId',row.caseTypeId).includes(2)){
          this.filed='litigation'
        } else {
          this.filed=''
        }
        this.currentId = ''
        this.currentCaseId = ''


        this.$nextTick(() => {
          this.currentId = row[that.getCurFilterId(that.pageTitle)]
          this.currentCaseId = row.caseId
        })
      },
      headerCellClassName({column, columnIndex}) {
        if (!this.selectionState) {
          return (columnIndex - 1 === this.dragState.move ? `moveIng` : '')
        } else {
          return (columnIndex - 2 === this.dragState.move ? `moveIng` : '')
        }
      },
      getCellClassName({row, column, rowIndex, columnIndex}) {
        if (column.label === '上报事项') {
          if (row['reportMatter'] == '申请') {
            return 'blue'
          } else {
            return 'red'
          }
        } else if (column.label === '递交方式') {
          if (row['insSubmitType'] == '人工送达') {
            return 'blue'
          } else {
            return 'red'
          }
        } else if (column.label === '递交场所') {
          if (row['submitPlace'] == '国际处' || row['submitPlace'] == '海淀区工商局') {
            return 'blue'
          }
        }else if (column.label==='商标图样') {
          return 'imgWrap'
        }
      },
      getRowClassName({row, rowIndex}) {
        if (this.selectionState) {
          if (this.multipleSelection.map(item => item[this.getCurFilterId(this.pageTitle)]).includes(row[this.getCurFilterId(this.pageTitle)])) {
            if (this.$refs.caseListMultiple) {
              this.$refs.caseListMultiple.toggleRowSelection(row, true)
            }
            return 'selectRow'
          }
        } else {
          if (row.auditStatus == 1) {
            return 'gray'
          }
        }
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      unique(data, key) {
        return unique(data, key)
      },
      getCurFilterId(title) {
        switch (title) {
          case "案件管理":
            return "caseId";
          case "递交官方":
            return "insId";
          case "官方通知":
            return "tmFileId";
        }
      },
    },
    watch: {
      checkboxState(n) {
        if (n) {
          this.$nextTick(() => {
            this.$refs.checkCaseSelect.focus()
          })
        }
      },
      tableHeader(n) {
        this.tableHeaderLabelList = n.map(item => item.label)
      },
      tableHeaderLabelList(n, o) {
        if (o.length) {
          if (localStorage.getItem('tableHeader')) {
            let header = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == 'types_of_cases' + this.$route.name).tableHeader
            this.tableHeader.forEach(item => {
              header.forEach(itm => {
                if (itm.label == item.label) {
                  this.$set(item, 'width', itm.width)
                }
              })
            })
          }
          this.changeHeader(this.tableHeader)
        }
      },
    },
    computed: {
      ...mapGetters(["userId"]),
      ...mapState({
        'pattern' : state => state.user.pattern,
        'ajglTabList' : state => state.tabs.ajglTabList,
        'djgfTabList' : state => state.tabs.djgfTabList,
        'gftzTabList' : state => state.tabs.gftzTabList,
      }),
      clientHeight() {
        return document.documentElement.clientHeight -240
      },
    },
  components:{
    Willtable,
    BulkUploadFile,
    exportFile,
    SelectOption,
    seeCaseDetail,
    DetailOfficialCommunication
  }
}
</script>

<style lang="scss" scoped>
  .queryButton {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-wrap: nowrap;
    top: -40px;
    justify-content: center;
    .buttonWrap_small {

      display: flex;
      margin: 5px 5px;
      align-items: center;
      .el-button {
        margin-left: 10px;
      }
    }
  }
  .content_wrap{
    width: 100%;
    display: flex;
    .left_wrap{
      transition:all 0.5s;
      //   width: 40%;
    }
    .right_wrap{
      box-shadow: 0px 0px 18px 0px rgba(64, 158, 255,0.5);
      height: 598px;
      overflow: auto;
      transition:all 0.5s;
      // width: 60%;
      flex: 1;
      /deep/ *{
        font-size: 12px !important;
      }
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
  .w-table {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* 没有前缀，目前支持Opera和谷歌浏览器 */
    /deep/ .caret-wrapper{
      position: relative;
      z-index: 100;
    }
    /deep/ .el-table__column-filter-trigger{
      position: relative;
      z-index: 100;
    }
    /deep/ .el-table th {
      padding: 0;
      .virtual{
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        z-index: 99;
        top: 0;
        background: none;
        border: none;
        box-sizing: border-box;
      }

    }
    .thead-cell {
      vertical-align: middle !important;
      padding: 0;
      display: inline-flex;
      flex-direction: column;
      align-items: left;
      cursor: pointer;
      overflow: initial;
      /*&:before {*/
      /*content: "";*/
      /*position: absolute;*/
      /*top: 0;*/
      /*left: 0;*/
      /*bottom: 0;*/
      /*right: 0;*/
      /*}*/
    }
    &.w-table_moving {
      .el-table th .thead-cell{
        cursor: move !important;
      }
      .el-table__fixed {
        cursor: not-allowed;
      }
    }
  }
  .right_wrap{

    /deep/.el-collapse-item{
      border-bottom: 1px solid #303133;
    }
  }
  /deep/ .selectRow{
    background: #C9C8D0;
  }
  /deep/ .gray{
    background: #E4E2E2;
  }
  /deep/ .pagination-container{
    padding: 0;
  }
  .el-menu-demo {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    width: 92px;
    height: 32px;
    font-size: 12px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    &:hover {
      opacity: 0.8;
    }
    /deep/ li {
      height: 100%;
      width: 100%;
      .el-submenu__title {
        border-radius: 3px;
        background: #409eff;
        color: #fff !important;
        line-height: 32px;
        height: 100%;
        text-align: center;
        border-bottom: 0;
        padding: 0;
        i {
          color: #fff;
        }
        &:hover {
          color: #fff;
          background: #409eff;
        }
      }
    }
    //padding: 9px 15px;
  }
  .plbj{
    margin-right: 10px;
  }
  .el-table {
    overflow: visible;
    /deep/ th {
      color: rgba(51, 51, 51, 1);
      background: rgba(187, 187, 187, 0.5);
    }
    /deep/ .cell{
      overflow:hidden;
      white-space: nowrap;
      text-overflow: clip;
    }
  }
  .el-table /deep/ th .cell {

    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    padding-left:10px ;
    img {
      margin-left: 5px;
      width: 12px;
      cursor: pointer;
    }
    .checkboxs {
      position: absolute;
      background: #fff;
      min-width: 100%;
      top: 47px;
      left: 0px;
      display: flex;
      z-index: 1;
      border: 1px solid #f4f4f5;
      overflow: visible;
      padding-left: 6px;
      padding-bottom: 80px;
      .filter_content {
        width: 100%;
        max-height: 200px;
        height: 200px;
        overflow: auto;
      }
      .el-checkbox-group {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        overflow: visible;
      }
      .checkAll {
        position: absolute;
        bottom: -27px;
        width: 100%;
        left: 0;
        background: #fff;
        height: 27px;
        color: #409eff;
        text-indent: 5px;
        line-height: 27px;
        cursor: pointer;
        border: 1px solid #f4f4f5;
      }
    }
  }
  .el-table /deep/ th div{
    overflow: visible;
    text-overflow: inherit;
    padding: 0;
  }
  /deep/ .el-dialog__wrapper{
    z-index: 10000!important;
  }
  .filterTableTmg{
   height: 100%;
  }
  /deep/ .imgWrap{
    .cell{
      width: 100%;
      height: 30px;
    }
  }
</style>
