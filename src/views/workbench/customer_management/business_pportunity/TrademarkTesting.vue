<template>
  <div>
    <el-form>
      <el-row>
        <el-col :span="6">
          <el-form-item label="客户" style="padding-left: 30px">
            <el-select
              class="slect-op"
              v-model="queryModuleData.custIdArray"
              multiple
              filterable
              remote
              @change="currentChange"
              clearable
              placeholder="请输入客户名"
              :remote-method="(queryString)=>{queryCustArrList(queryString)}"
            >
              <el-option v-for="(item,index) in custArrOptions" :key="index" :label="item.fullname" :value="item.custId">
                <span>{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否查看全部监控" style="">
            <el-radio-group v-model=queryModuleData.isAll>
            <el-radio :label="1">是</el-radio>
              <el-tooltip class="item" effect="light" content="文字近似度大于0.85；图形近似度小于8" placement="top">
                <el-radio :label="0">否</el-radio>
              </el-tooltip>

          </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="监控类型" style="">
            <el-select v-model="queryModuleData.mType" placeholder="请选择">
              <el-option
                v-for="item in [{name: '文字', value: 1},{name: '图形', value: 2},{name: '全部', value: 0}]"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" size="mini" @click="queryTmTarget(1)" style="">搜 索</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2" v-if="$store.getters.permissions.includes(261)">
          <el-form-item style="">
            <el-button type="primary" size="mini"  @click="uploadView = true">上传文件</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="最近期号为：" style="padding-left: 30px">
          <el-tag
            style="cursor: pointer;margin-left: 10px;"
            v-for="(item, index) in qihaoList"
            :class="{isActive: isActiveArr.includes(item)}"
            :key="index"
            @click="qihaoClick(item)"
          >
            {{ item }}
          </el-tag>
        </el-form-item>
      </el-row>
    </el-form>
<!--      <el-form label-width="136px">-->
<!--        <el-form-item label="客户">-->
<!--          <el-select-->
<!--            v-model="queryModuleData['custId']"-->
<!--            ref="custSelect"-->
<!--            filterable-->
<!--            clearable-->
<!--            remote-->
<!--            reserve-keyword-->
<!--            placeholder="请输入客户姓名"-->
<!--            :remote-method="queryCustomerList">-->
<!--            <el-option-->
<!--              v-for="item in customerNameIdList"-->
<!--              :key="item.custId"-->
<!--              :label="item.name"-->
<!--              :value="item.custId"-->
<!--            >-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        &lt;!&ndash;<el-form-item label="客户信用等级" >&ndash;&gt;-->
<!--          &lt;!&ndash;<el-select v-model="queryModuleData.level" placeholder="请选择客户信用等级" filterable&ndash;&gt;-->
<!--                     &lt;!&ndash;clearable >&ndash;&gt;-->
<!--            &lt;!&ndash;<el-option&ndash;&gt;-->
<!--              &lt;!&ndash;v-for="item in ['VIP','A','B','C+','C','D']"&ndash;&gt;-->
<!--              &lt;!&ndash;:key="item"&ndash;&gt;-->
<!--              &lt;!&ndash;:label="item"&ndash;&gt;-->
<!--              &lt;!&ndash;:value="item">&ndash;&gt;-->
<!--            &lt;!&ndash;</el-option>&ndash;&gt;-->
<!--          &lt;!&ndash;</el-select>&ndash;&gt;-->
<!--        &lt;!&ndash;</el-form-item>&ndash;&gt;-->
<!--        <el-form-item label="申请人" >-->
<!--          <el-select-->
<!--            v-model="queryModuleData['applicantName']"-->
<!--            ref="custSelect"-->
<!--            filterable-->
<!--            clearable-->
<!--            remote-->
<!--            reserve-keyword-->
<!--            placeholder="请输入申请人姓名"-->
<!--            :remote-method="queryAllUrl">-->
<!--            <el-option-->
<!--              v-for="item in queryAppLicantList"-->
<!--              :key="item.appId"-->
<!--              :label="item.applicantName"-->
<!--              :value="item.applicantName"-->
<!--            >-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        &lt;!&ndash;<el-form-item label="商标名称">&ndash;&gt;-->
<!--          &lt;!&ndash;<el-input v-model="queryModuleData.tmName " placeholder="请输入案件名称" clearable></el-input>&ndash;&gt;-->
<!--        &lt;!&ndash;</el-form-item>&ndash;&gt;-->
<!--        <el-form-item label="有效起始日:" class="twoInputWarp">-->
<!--          <DataPicker v-model="validStartDate"></DataPicker>-->
<!--          &lt;!&ndash;<el-date-picker&ndash;&gt;-->
<!--            &lt;!&ndash;v-model="queryModuleData.validStartDateStart"&ndash;&gt;-->
<!--            &lt;!&ndash;value-format="yyyy-MM-dd"&ndash;&gt;-->
<!--            &lt;!&ndash;type="date"&ndash;&gt;-->
<!--            &lt;!&ndash;placeholder="选择日期">&ndash;&gt;-->
<!--          &lt;!&ndash;</el-date-picker>&ndash;&gt;-->
<!--          &lt;!&ndash;<span>至</span>&ndash;&gt;-->
<!--          &lt;!&ndash;<el-date-picker&ndash;&gt;-->
<!--            &lt;!&ndash;v-model="queryModuleData.validStartDateEnd"&ndash;&gt;-->
<!--            &lt;!&ndash;value-format="yyyy-MM-dd"&ndash;&gt;-->
<!--            &lt;!&ndash;type="date"&ndash;&gt;-->
<!--            &lt;!&ndash;placeholder="选择日期">&ndash;&gt;-->
<!--          &lt;!&ndash;</el-date-picker>&ndash;&gt;-->
<!--        </el-form-item>-->
<!--        <el-form-item label="有效截止日:">-->
<!--          <DataPicker v-model="validEndDate"></DataPicker>-->
<!--          &lt;!&ndash;<el-date-picker&ndash;&gt;-->
<!--            &lt;!&ndash;v-model="queryModuleData.validEndDateStart"&ndash;&gt;-->
<!--            &lt;!&ndash;value-format="yyyy-MM-dd"&ndash;&gt;-->
<!--            &lt;!&ndash;type="date"&ndash;&gt;-->
<!--            &lt;!&ndash;placeholder="选择日期">&ndash;&gt;-->
<!--          &lt;!&ndash;</el-date-picker>&ndash;&gt;-->
<!--          &lt;!&ndash;<span>至</span>&ndash;&gt;-->
<!--          &lt;!&ndash;<el-date-picker&ndash;&gt;-->
<!--            &lt;!&ndash;v-model="queryModuleData.validEndDateEnd"&ndash;&gt;-->
<!--            &lt;!&ndash;value-format="yyyy-MM-dd"&ndash;&gt;-->
<!--            &lt;!&ndash;type="date"&ndash;&gt;-->
<!--            &lt;!&ndash;placeholder="选择日期">&ndash;&gt;-->
<!--          &lt;!&ndash;</el-date-picker>&ndash;&gt;-->
<!--        </el-form-item>-->
<!--        &lt;!&ndash;<el-form-item label="商标类别:">&ndash;&gt;-->
<!--          &lt;!&ndash;<el-input type="number" v-model="queryModuleData.tmGroup" placeholder="请输入商标类别" clearable></el-input>&ndash;&gt;-->
<!--        &lt;!&ndash;</el-form-item>&ndash;&gt;-->
<!--        &lt;!&ndash;<el-form-item label="商标号">&ndash;&gt;-->
<!--          &lt;!&ndash;<el-input v-model="queryModuleData.regNumber " placeholder="请输入商标号" clearable></el-input>&ndash;&gt;-->
<!--        &lt;!&ndash;</el-form-item>&ndash;&gt;-->
<!--        &lt;!&ndash;<el-form-item label="时限状态:">&ndash;&gt;-->
<!--          &lt;!&ndash;<el-radio-group v-model="queryModuleData.isGrace">&ndash;&gt;-->
<!--          &lt;!&ndash;<el-radio label='全部' value=""></el-radio>&ndash;&gt;-->
<!--          &lt;!&ndash;<el-radio label='是' :value="1"></el-radio>&ndash;&gt;-->
<!--          &lt;!&ndash;<el-radio label='否' :value="0"></el-radio>&ndash;&gt;-->
<!--          &lt;!&ndash;</el-radio-group>&ndash;&gt;-->
<!--          &lt;!&ndash;&lt;!&ndash;<el-checkbox-group v-model="timelimitState" @change="timelimitState1">&ndash;&gt;&ndash;&gt;-->
<!--            &lt;!&ndash;&lt;!&ndash;<el-checkbox label="未核销"></el-checkbox>&ndash;&gt;&ndash;&gt;-->
<!--            &lt;!&ndash;&lt;!&ndash;<el-checkbox label="已核销"></el-checkbox>&ndash;&gt;&ndash;&gt;-->
<!--          &lt;!&ndash;&lt;!&ndash;</el-checkbox-group>&ndash;&gt;&ndash;&gt;-->
<!--        &lt;!&ndash;</el-form-item>&ndash;&gt;-->
<!--        <el-form-item label="送达工作组:">-->
<!--          <el-select  default-first-option v-model="queryModuleData.wkgId" clearable filterable placeholder="请选择">-->
<!--            <el-option-->
<!--              v-for="item in queryWorkgroupNamesList"-->
<!--              :key="item.wkgId"-->
<!--              :label="item.groupName"-->
<!--              :value="item.wkgId">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-button type="primary" class="clearButton" size="mini"  @click="clearSearch"><img src="@/assets/清除@2x.png" alt=""><span>重置</span></el-button>-->
<!--        <div class="buttonWrap">-->
<!--          <el-button type="primary" size="mini"  @click="handleSearch">搜索</el-button>-->
<!--          <el-button type="primary" size="mini" @click="takeDialog(0)" >提醒设置</el-button>-->
<!--          <el-button type="primary" size="mini" @click="takeDialog(1)">邮件发送记录</el-button>-->
<!--        </div>-->
<!--      </el-form>-->
<!--      <el-table-->
<!--        ref="todoTaskMultiple"-->
<!--        :data="businessList"-->
<!--        border-->
<!--        fit-->
<!--        empty-text="暂无数据"-->
<!--        highlight-current-row-->
<!--        current-row-key-->
<!--        style="width: 100%;"-->
<!--      >-->
<!--        <el-table-column type="index" width="60" label="序号" align="left">-->
<!--        </el-table-column>-->

<!--        <el-table-column type="expand" width="1" >-->
<!--          <template slot-scope="props">-->
<!--            <el-table-->
<!--              class="el-table1"-->
<!--              :data="props.row.trademarkArray"-->
<!--              border-->
<!--              fit-->
<!--              empty-text="暂无数据"-->
<!--              highlight-current-row-->
<!--              current-row-key-->
<!--              style="width: 100%;"-->
<!--              @select="(val, row)=>handleSelectionChange(val, row,props.row)"-->
<!--              @select-all="(val)=>handleSelectionAll(val,props.row)"-->

<!--            >-->
<!--              <el-table-column-->
<!--                type="selection"-->
<!--                width="30">-->
<!--              </el-table-column>-->
<!--              <el-table-column :label="item.title" align="left" v-for="item,index in tableTitleList2" :key="index" :width="item.value==='index'?50:'auto'">-->
<!--                <template slot-scope="scope">-->
<!--                  <span v-if="item.value==='index'">{{scope.$index+1}}</span>-->
<!--                  <span v-if="item.value!=='index'&&item.value!=='imgFilePath'&&item.value!=='sendSucceedNum'">{{scope.row[item.value]}}</span>-->
<!--                  <img style="width: 67px;height: auto" v-if="item.value==='imgFilePath'" :src="'ipdoc/downloadimage'+scope.row[item.value]" alt="">-->
<!--                  <div v-if="item.value=='sendSucceedNum'" style="display: flex;align-items: center;flex-wrap:wrap">-->
<!--                    <p style="color: green;font-size: 12px" v-if="scope.row[item.value]!=0">{{`已发送 (${scope.row[item.value]})`}}</p>-->
<!--                    <p style="color: red;font-size: 12px" v-if="scope.row['sendDefeatedNum']!=0">{{`发送失败 (${scope.row['sendDefeatedNum']})`}}</p>-->
<!--                    <p style="color: rgb(106, 167, 255);font-size: 12px" v-if="scope.row['sendDefeatedNum']==0&&scope.row['sendSucceedNum']==0">{{`未发送`}}</p>-->
<!--                    <img src="" style="max-width: 300px;height: auto" alt="">-->
<!--                  </div>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column label="操作" align="left"  class-name="small-padding fixed-width">-->
<!--                <template slot-scope="scope">-->
<!--                  <el-button type="text" size="small" @click="createCase(scope.row,scope.row.custId)">立卷</el-button>-->
<!--                  <el-button type="text" size="small" @click="sendBusiness(scope.row,scope.row.custId)">发送</el-button>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--            </el-table>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="客户名称" align="left" prop="custName">-->
<!--          <template slot-scope="scope">-->
<!--            <span>{{scope.row['custName']}}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column :label="item.title" align="left" v-for="item,index in tableTitleList" :key="index">-->
<!--          <template slot-scope="scope">-->
<!--            <span>{{scope.row[item.value]}}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="操作" align="left"  class-name="small-padding fixed-width">-->
<!--          <template slot-scope="scope">-->
<!--            &lt;!&ndash;<el-button type="text" size="small" @click="takeDialog(scope.row)">发送查看记录</el-button>&ndash;&gt;-->
<!--            <el-button type="text" size="small" @click="createCase(scope.row)">立卷</el-button>-->
<!--            <el-button type="text" size="small" @click="sendBusiness(scope.row)">发送</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
    <div class="content_wrap" style="position: relative;margin-top: 40px">
      <div class="left_wrap" :style="{width:visiable?leftWrapWidth:'100%' }">
        <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
        <AgGridVue :style="{width:'100%',height:clientHeight+'px'}"
                   class="ag-theme-balham"
                   :columnDefs="columnDefs"
                   :rowData="businessList"
                   rowSelection="multiple"
                   @grid-ready="onGridReady"
                   :gridOptions="gridOptions"

                   :getContextMenuItems="getContextMenuItemsFather"
                   suppressAutoSize
                    ref="agGrid"
                   animateRows
                   @rowClicked="rowClicked"
                   @sortChanged="refreshEvenRowsCurrencyData"
                   @filterChanged="refreshEvenRowsCurrencyData"
                   :localeText="$store.state.caseInformation.localeText"
                   :groupSelectsChildren="true"
                   :suppressAggFuncInHeader="true"
                   :masterDetail="true"
                   keepDetailRows
                   :detailRowHeight="detailRowHeight"
        >
        </AgGridVue>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.pageNo"
          :limit.sync="listQuery.pageSize"
          @pagination="queryTmTarget"
          :pageSizes="pageSizesList"
        />
      </div>
      <div v-if="visiable&&type == '近似监控1'" class="right_wrap" :style="{position:'relative','margin-left':visiable?'10px' :'0','margin-right':visiable?'10px' :'0',height:clientHeight+'px'}">
        <right-table v-if="visiable" :type="type" :childDataList="childDataList"></right-table>
      </div>
      <div v-if="visiable&&type == '近似监控2'" class="right_wrap" :style="{position:'relative','margin-left':visiable?'10px' :'0','margin-right':visiable?'10px' :'0',height:clientHeight+'px'}">
        <right-table v-if="visiable" :type="type" :childDataList="childDataList"></right-table>
      </div>
    </div>

<!--    <el-dialog title="上传文件" :visible.sync="uploadView">-->
<!--        <el-form :model="uploadData">-->
<!--          <el-form-item label="任务组名称">-->
<!--            <el-input v-model="uploadData.qihao" autocomplete="off"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="任务组序号">-->
<!--            <el-select v-model="uploadData.mType" placeholder="请选择" >-->
<!--            <el-option-->
<!--              v-for="item in [{name: '文字', value: 1},{name: '图形', value: 2},{name: '全部', value: 0}]"-->
<!--              :key="item.value"-->
<!--              :label="item.name"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--          <el-button @click="uploadView = false">取 消</el-button>-->
<!--          <el-button type="primary">确 定</el-button>-->
<!--        </div>-->
<!--      </el-dialog>-->


    <el-dialog title="上传文件" :visible.sync="uploadView">
      <el-form :model="uploadData" :rules="rules" style="" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="期号" prop="qihao" style="">
              <el-input v-model="uploadData.qihao"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="监控类型" prop="mType" style="">
              <el-select v-model="uploadData.mType" placeholder="请选择" >
                <el-option
                  v-for="item in [{name: '文字', value: 1},{name: '图形', value: 2}]"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item style="">
              <el-upload
                class="upload-demo"
                ref="upload"
                :data="uploadFile"
                :action="importTmMonitorDataURL"
                :before-upload="beforeUpload"
                :on-success="successCallback"
                multiple
                :show-file-list="false">
                <el-button ref="isUpload" size="small" :loading="isLoading" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer"  >
        <el-button type="primary" @click="uploadView = false">取 消</el-button>
<!--        <el-button type="primary" @click="uploadFiles">确 定</el-button>-->
      </div>
    </el-dialog>
<!--    <el-dialog-->
<!--      :title="remindRecordState?'邮件历史记录':'提醒设置'"-->
<!--      :visible.sync="dialogVisible"-->
<!--      width="80%"-->
<!--      :top="remindRecordState?'7vh':'15vh'">-->
<!--      <component v-if="dialogVisible" :is="remindRecordState?'remindRecord':'reminderSettings'" @changeFalse="dialogVisible=false"></component>-->
<!--    </el-dialog>-->
    </div>
</template>

<script>
import pagination from '@/components/Pagination'
import { queryCustomerNameId ,sendBusiness,queryTmTarget,queryTmEdition} from '@/api/caseList'
import {queryAllUrl} from '@/api/applicant'
import { queryUsers } from '@/api/systemList'
import { createCode, createTask} from '@/api/caseList.js'
import { saveCaseInfoUrl} from "@/api/caseDetail";
import remindRecord from './components/remindRecord'
import reminderSettings from './components/reminderSettings.vue'
import { importTmMonitorData } from "@/api/ipServiceApi.config.js";
import RightTable from "./components/rightTable";
// import {queryWorkgroupNames} from '@/api/systemList'
export default {
  name: "TrademarkTesting",
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 410
    }
  },
  data(){
    return {
      type:'',
      leftWrapWidth:localStorage.getItem('leftWrapWidth')?localStorage.getItem('leftWrapWidth'):'60%',
      visiable: false,
      childDataList: [],
      smallList: [],
      uploadData: {
        // qihao: '',
        // mType: 0
      },
      dHeight: 67,
      dIndex: 0,
      getRowNodeId: null,
      // keepDetailRowsCount: 1,
      detailRowHeight: null,
      isLoading: false,
      uploadFile: null,
      // uploadFile: {
      //   // tokenID: this.$store.getters.token,
      //   // ...this.uploadData
      // },
      rules: {
        qihao: [{ required: true, message: '请输入期号', trigger: 'blur' }],
        mType: [{ required: true, message: '请输入文件类型', trigger: 'blur' },]
      },
      importTmMonitorDataURL: '',
      importTmMonitorData,
      // custArrValue: [],
      custArrOptions: [],
      pageSizesList:[10, 50, 200,500,1000,5000,10000],
      listQuery: {
        pageNo: 0,
        pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10

      },
      total:0,
      dialogVisible:false,
      queryModuleData:{
        isAll: 0,
        mType: 0,
        custIdArray: []
      },
      businessList:[],
      customerNameIdList:[],
      queryAppLicantList:[],
      queryWorkgroupNamesList:[],
      validEndDate:[],
      validStartDate:[],
      remindRecordState:false,
      tableTitleList: [
        {"title":"客户组","value":"groupName" }, { 'title': '客户', 'value': 'custName',"width":'100' },{"title":"监控内容","value":"mTmName" },
        {"title":"监控主要类别","value":"mainTmType" },{"title":"次要类别","value":"minTmType" },{"title":'监控商标号',"value": 'mRegNumber'},
        {"title":'监控商标图片',"value": 'mImageFile'}, {"title":"期号","value":"qihao" },{"title":"监控类型","value":"mTypeStr" }
      ],
      tableTitleList2:[
        {'title':'近似商标','value':'tmName'},{'title':'注册号','value':'regNumber'},{"title":"类号","value":"tmType" },
        {"title":"申请人中文名称","value":"applicantName" },{"title":"图样","value":"imageFile" },
        {"title":"近似度","value":"jinsidu" },{"title":"距离","value":"distance" }
      ],
      selectData:[],
      gridOptions:{...this.$store.state.caseInformation.gridOptions, ...{}},
      // detailCellRendererParams:{
      //   detailGridOptions: {
      //     rowSelection:'multiple',
      //     columnDefs: [
      //     ],
      //     rowHeight:67,
      //     defaultColDef: { flex: 1 },
      //     getContextMenuItems: this.getContextMenuItemsChild,
      //   },
      //   getDetailRowData: params => {
      //     params.successCallback(params.data.childs);
      //   },
      //   template:
      //   '<div style="height: 100%; background-color: #edf6ff; padding: 20px; box-sizing: border-box;">' +
      //   '  <div style="height: 5%; padding: 2px; font-weight: bold;"></div>' +
      //   '  <div ref="eDetailGrid" style="height:100%"></div>' +
      //   '</div>',
      // },
      defaultcolumnDefs:[
        {
          headerName: '序号',
          field: 'sid',
          width: 60,
          'pinned': 'left', //固定再左边
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer:this.cellRenderer,

        },
      ],
      defaultcolumnDefs2:[
        {
          headerName: '序号',
          field: 'sid',
          width: 60,
          'pinned': 'left', //固定再左边
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer:this.cellRenderer,
          // checkboxSelection:function(params) {
          //   return params.columnApi.getRowGroupColumns().length === 0;
          // },
          // headerCheckboxSelection:(params)=>{
          //   return params.columnApi.getRowGroupColumns().length === 0;
          // }
        },
      ],
      columnDefs: [
        // ...this.tableTitleList2
      ],
      qihaoList: [],
      brushRightHasFilter:false,
      isActiveArr: [],
      custIdArrayList: [],
      uploadView: false,
      firstQihao:0,
      hide: ''
    }
  },
  beforeMount() {
    // const that = this
    // this.detailCellRendererParams = (params, index=1) => {
    //   const res = {}
    //   if(params.data.mType == 1){
    //     res.detailGridOptions={
    //       rowSelection:'multiple',
    //       columnDefs: [
    //         {'headerName':'序号','field': 'fid',cellRenderer: this.cellRenderer2},
    //         {'headerName':'近似商标','field':'tmName',cellRenderer: this.cellRenderer2},
    //         {'headerName':'注册号','field':'regNumber',cellRenderer: this.cellRenderer2},
    //         {"headerName":"类号","field":"tmType",cellRenderer: this.cellRenderer2 },
    //         {"headerName":"申请人中文名称","field":"applicantName", cellRenderer: this.cellRenderer2 },
    //         {"headerName":"图样","field":"imageFile", cellRenderer: this.cellRenderer2},
    //         {"headerName":"近似度（数值越接近于1越近似）","field":"jinsidu", cellRenderer: this.cellRenderer2 }
    //       ],
    //       rowHeight:67,
    //       defaultColDef: { flex: 1 },
    //       getContextMenuItems: that.getContextMenuItemsChild,
    //     }
    //   }else {
    //     res.detailGridOptions={
    //       rowSelection:'multiple',
    //       columnDefs: [
    //         {'headerName':'序号','field': 'fid',cellRenderer: this.cellRenderer2},
    //         {'headerName':'近似商标','field':'tmName',cellRenderer: this.cellRenderer2},
    //         {'headerName':'注册号','field':'regNumber',cellRenderer: this.cellRenderer2},
    //         {"headerName":"类号","field":"tmType",cellRenderer: this.cellRenderer2 },
    //         {"headerName":"申请人中文名称","field":"applicantName", cellRenderer: this.cellRenderer2 },
    //         {"headerName":"图样","field":"imageFile", cellRenderer: this.cellRenderer2},
    //         {"headerName":"近似度（数值越小越近似）","field":"distance",cellRenderer: this.cellRenderer2 }
    //       ],
    //       rowHeight:67,
    //       defaultColDef: { flex: 1 },
    //       getContextMenuItems: this.getContextMenuItemsChild,
    //     }
    //   }
    //
    //   res.getDetailRowData = (params) => {
    //     params.successCallback(params.data.childs)
    //   }
    //   res.template =
    //   '<div style="height: 100%; background-color: #edf6ff; padding: 20px; box-sizing: border-box;">' +
    //   '  <div style="height: 5%; padding: 2px; font-weight: bold;"></div>' +
    //   '  <div ref="eDetailGrid" style="height:100%"></div>' +
    //   '</div>'
    //   return res
    // }
  },
  mounted(){

  },
  created(){
    // this.getColumDefs()
    this.handleSearch()
    // this.queryWorkgroupNames()
  },
  methods:{
    beforeUpload() {
      this.isLoading = true
      this.uploadFile = {tokenID: this.$store.getters.token, ...this.uploadData}
      if(this.uploadFile.qihao&&this.uploadFile.mType){
        this.importTmMonitorDataURL = this.importTmMonitorData
        let promise = new Promise((resolve) => {
        this.$nextTick(function () {
          resolve(true);
        });
      });
      return promise;
      }else{
        this.importTmMonitorDataURL = ''
        this.$message.error('请填写必填项！')
        this.isLoading = false
      }
    },
    successCallback(response, file, fileList) {
      if(response.success){
        this.$message.success('文件上传成功!')
        this.uploadView = false
        this.isLoading = false
        this.handleSearch()
      }else{
        this.$message.error('文件上传失败!')
        this.isLoading = true
      }
    },
    currentChange(value) {
      this.queryModuleData.custIdArray = value
    },
    queryTmEdition() {
      queryTmEdition().then((res)=>{
        this.qihaoList = res.data
      })
    },
    qihaoClick(item) {
      this.isActiveArr.length = 0
      this.isActiveArr.push(item)
      this.queryModuleData.qihao = item
      this.queryTmTarget()
    },
    queryCustArrList(value) {
      if(value !== ''){
        if(this.queryModuleData.custIdArray&&this.queryModuleData.custIdArray.length){
          queryCustomerNameId({pageNo: 1, pageSize: 100,custIdArray: this.queryModuleData.custIdArray}).then(res=> {
            this.custIdArrayList = res.data
        })
        }
        queryCustomerNameId({ pageNo: 1, pageSize: 100,keyword:value }).then(res=>{
          this.custArrOptions=this.custIdArrayList.concat(res.data)
        })
      }
    },
    searchAll() {
        this.queryTmTarget(1)
    },
    getColumDefs(list){
      if(!list) {
        list = [...this.tableTitleList]
      }
      // if(childList == 1){
      //   childList = [...this.tableTitleList2, {"title":"近似度","value":"jinsidu" }]
      // }else if(childList == 2) {
      //   childList = [...this.tableTitleList2, {"title":"距离","value":"distance" }]
      // }
      this.columnDefs = [...this.defaultcolumnDefs, ...list.map(item=>({
        headerName: item.title,
        field: item.value,
         width:item.width,
        resizable: true,
        sortable: true,
        filter: 'agSetColumnFilter',
        cellRenderer:this.cellRenderer,
        menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        enableRowGroup: true,
        filterParams: {
          newRowsAction: 'keep',
          comparator: (a, b)=>{
            return this.$commonUtils.sort(a,b,item.value)
          }
        }
      }))]
      // this.detailCellRendererParams.detailGridOptions.columnDefs=[...this.defaultcolumnDefs2,...childList.map(item=>({
      //   headerName: item.title,
      //   field: item.value,
      //   // width:this.getLoactionWidth(item.title)=='auto'?200:this.getLoactionWidth(item.title),
      //   resizable: true,
      //   sortable: true,
      //   hide: item.title == this.hide,
      //   filter: 'agSetColumnFilter',
      //   cellRenderer:this.cellRenderer,
      //   menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
      //   enableRowGroup: true,
      //   filterParams: {
      //     newRowsAction: 'keep',
      //     comparator: (a, b)=>{
      //       return this.$commonUtils.sort(a,b,item.value)
      //     }
      //   }
      // }))]
    },
    rowClicked(params){
      if(params.data.mType == 1){
        this.type = '近似监控1'
      }else{
        this.type = '近似监控2'
      }
      let that=this
      new this.$DraginResize(document.querySelector(".left_wrap"), {
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
      this.childDataList = params.data.childs
      this.visiable = true
      //动态设置子表格高度
      // if(params.node.expanded){
      //   params.node.detailNode.setRowHeight('0')
      //   params.node.setExpanded(false);
      // }else {
      //   this.$nextTick(()=>{
      //     const h = params.data.childs.length * 67 + 76
      //     params.node.detailNode.setRowHeight(h>300?300:h)
      //   })
      //   params.node.setExpanded(true);
      // }
      // this.columnDefs.push({})
      // this.columnDefs.pop()
    },
    brushRight(){
      // let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
      let arr = this.columnDefs.map(item=>item.field)// Object.keys(data)
      arr.forEach(item=>{
        this.gridApi.destroyFilter(item)
      })
    },
    onGridReady(params) {
      this.gridparams=params
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      params.api.sizeColumnsToFit();
    },
    cellRenderer(params){
      if(params.colDef.headerName=='客户名称'){

        // var eDiv = document.createElement('div');
        // eDiv.innerHTML = `<span class="btn-simple" title="${params.value}">${params.value?params.value:''}</span>`
        // var eButton = eDiv.querySelectorAll('.btn-simple')[0];
        //
        // eButton.addEventListener('click', ()=> {
        //   if(!this.pattern&&!this.selectionState){
        //     this.takeCaseDetail(params.data)
        //   }
        // });
        //
        return `<i class="el-icon-caret-right ${params.node.expanded?'rotateClass':''}"></i>${params.value}`

      }
      if(params.colDef.field=='imageFile'){
        return `<img style="width: 67px;height: auto" src="${params.value}" alt="">`
      }
      if(params.colDef.field=='mImageFile'){
        if(params.value) {
          return `<img style="width: 50px;height: 100%" src="${params.value}" alt="">`
        }
      }

      if(params.colDef.field=='sendSucceedNum'){
        return  `<div  style="display: flex;align-items: center;flex-wrap:wrap">
            <p style="color: green;font-size: 12px;display:${params.node.data.sendSucceedNum!=0?'block':'none'}">已发送 (${params.value})</p>
            <p style="color: red;font-size: 12px;display:${params.node.data.sendDefeatedNum!=0?'block':'none'}">发送失败 (${params.value})</p>
            <p style="color: rgb(106, 167, 255);font-size: 12px;display:${params.node.data.sendDefeatedNum==0&&params.node.data.sendSucceedNum==0?'block':'none'}" >未发送</p>
          </div>`
      }
      if(params.colDef.field == 'sid'){
        return params.rowIndex+1
      }
      return `<span title="${params.value}">${params.value?params.value:''}</span>`
    },
    cellRenderer2(params){
      if(params.colDef.field == 'fid'){
        return params.rowIndex+1
      }
      if(params.colDef.field == 'imageFile'){
        return `<img style="width: 67px;height: auto" src="${params.data.imageFile}" alt="">`
      }
      return `<span title="${params.value}">${params.value?params.value:''}</span>`
    },
    getContextMenuItemsFather(params){
      if(!params.node||!params.node.data){
        return []
      }
      return this.getRowContextmenuListFather(params.node.data).map(item=>({
        name: item.name,
        action: () =>{
          this[item.action](params.node.data,params.value,params)
        },
      }))
    },
    getContextMenuItemsChild(params){
      if(!params.node||!params.node.data){
        return []
      }
      return this.getRowContextmenuListChild(params.node.data).map(item=>({
        name: item.name,
        action: () =>{
          this[item.action](params.node.data,params.value,params)
        },
      }))
    },
    getRowContextmenuListFather(row){
      return [{ name:'复制',action: 'copy' }]
    },
    getRowContextmenuListChild(row){
      return [{ name:'复制',action: 'copy' }]
    },
    createCaseChild(row, value,params){
      let formList=params.api.getSelectedRows()
      const data={
        isBatch: '1',
        isDeliver:'0',
        custId:row.custId,
        custfullname: row.custFullname,
        userId: this.$store.getters.userId,
        level: row.custLevel,
      }
      data.batchInfos=[{
        caseTypeId:33,
        caseNumber:formList.length,
        caseTypeName:'续展'
      }]
      createCode().then(res=>{
        data.draftNumber=res.data
        createTask(data).then(res=>{
          let taskId=res.data[0].taskId
          const data2={
            regNumberList:formList.map(item=>item.regNumber),
            caseIds:res.data[0].cases.map(item=>item.caseId),
            caseType:res.data[0].cases[0].caseType,
            caseTypeId:res.data[0].cases[0].caseTypeId
          }
          saveCaseInfoUrl(data2).then(res=>{
            this.$router.push({path:'/workbench/case/massfiling',query:{taskId}})
          })
        })
      })
    },
    createCaseFather(row, value,params){
      let formList = row.childs
      const data={
        isBatch: '1',
        isDeliver:'0',
        custId:row.custId,
        custfullname: row.custFullname,
        userId: this.$store.getters.userId,
        level: row.custLevel,
      }
      data.batchInfos=[{
        caseTypeId:33,
        caseNumber:formList.length,
        caseTypeName:'续展'
      }]
      createCode().then(res=>{
        data.draftNumber=res.data
        createTask(data).then(res=>{
          let taskId=res.data[0].taskId
          const data2={
            regNumberList:formList.map(item=>item.regNumber),
            caseIds:res.data[0].cases.map(item=>item.caseId),
            caseType:res.data[0].cases[0].caseType,
            caseTypeId:res.data[0].cases[0].caseTypeId
          }
          saveCaseInfoUrl(data2).then(res=>{
            this.$router.push({path:'/workbench/case/massfiling',query:{taskId}})
          })
        })
      })
    },
    sendFather(row,value,params){
      let formList = row.childs
      sendBusiness({
        custId:row.custId,
        tmIdArray:formList.map(item=>item.tmId)
      }).then(res=>{
        this.handleSearch()
      })
    },
    sendChild(row, value,params){
      let formList=params.api.getSelectedRows()
      sendBusiness({
        custId:row.custId,
        tmIdArray:formList.map(item=>item.tmId)
      }).then(res=>{
        this.handleSearch()
      })
    },
    copy(row, value) {
      if(value){
        this.$copyText(value).then(
          res => {
          })
      }
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
    },
    takeDialog(num){
      this.dialogVisible=true
      num ? this.remindRecordState=true: this.remindRecordState=false
    },
    handleSearch() {
      this.validEndDate = []
      this.validStartDate = []
      this.listQuery.pageNo = 1
      queryTmEdition().then((res)=>{
        this.qihaoList = res.data
        this.queryModuleData.qihao = this.qihaoList[0]
        this.isActiveArr.length = 0
        this.isActiveArr.push(this.qihaoList[0])
        this.queryTmTarget(1)
      })

    },
    clearSearch(){
      this.queryModuleData={}
      //this.handleSearch()
    },
    queryTmTarget(flag, qihao){
      if(this.visiable){
        this.visiable = false
      }
      if(flag == 1) {
        this.listQuery.pageNo = 1
      }
      if(qihao) {
        this.queryModuleData.qihao = qihao
      }
      queryTmTarget(Object.assign(this.queryModuleData,this.listQuery)).then(res=>{
        this.businessList=res.data
        this.getColumDefs()
        this.total=res.total
        const groupList = this.businessList.map(item=>(item.groupName))
        const uniqueGroup = new Set(groupList)

        if(uniqueGroup.size>1) {
          this.getColumDefs()
          return
        }else{
          queryUsers({groupName: Array.from(uniqueGroup)[0]}).then((res)=>{
            const h = res.data.users
            const nameList = h.map(item=> item.fullname)
            if(nameList.includes(this.$store.getters.name)) {
              const list =  this.tableTitleList.slice(1, this.tableTitleList.length)

              this.getColumDefs(list)
            }else{
              this.getColumDefs()
            }
          })
        }
      })
    },
    queryAllUrl(query){
      if(query !== ''){
        queryAllUrl({ pageNo: 1, pageSize: 100,applicantName:query ,orderBy:1}).then(res=>{
          this.queryAppLicantList=res.data
        })
      }
    },
    // queryWorkgroupNames(){
    //   queryWorkgroupNames().then(res => {
    //     if (res.success) {
    //       this.queryWorkgroupNamesList = res.data
    //     }
    //   })
    // },
    // queryCustomerList(query){
    //   if(query !== ''){
    //     queryCustomerNameId({ pageNo: 1, pageSize: 100,keyword:query }).then(res=>{
    //       this.customerNameIdList=res.data
    //     })
    //   }
    // },
    // handleSelectionAll(val, father) {
    //   val = val.filter(item => item !== undefined)
    //   if(!this.selectData.find(item=>item.custId===father.custId)){
    //     this.selectData.push({ custId:father.custId ,list:val})
    //   } else {
    //     this.selectData.find(item=>item.custId===father.custId).list=val
    //   }
    // },
    // handleSelectionChange(val, row, father) {
    //   val = val.filter(item => item != undefined)
    //   if(!this.selectData.find(item=>item.custId===father.custId)){
    //     this.selectData.push({ custId:father.custId ,list:val})
    //   } else {
    //     this.selectData.find(item=>item.custId===father.custId).list=val
    //   }
    // },
    sendBusiness(row,custId){
      let formList=[]
      if(custId){
        if(this.selectData.find(item=>item.custId===custId)){
          formList = this.selectData.find(item=>item.custId===custId).list
        } else {
          return
        }
        if(!formList.find(item=>item.tmId===row.tmId)){
          return
        }
      }else {
        formList=row.childs
      }
      sendBusiness({
        custId:row.custId,
        tmIdArray:formList.map(item=>item.tmId)
      }).then(res=>{
        this.handleSearch()
      })
    },
    createCase(row,custId){
      let formList=[]
      if(custId){
        if(this.selectData.find(item=>item.custId===custId)){
          formList = this.selectData.find(item=>item.custId===custId).list
        } else {
          return
        }
        if(!formList.find(item=>item.tmId===row.tmId)){
          return
        }
      }else {
        formList=row.childs
      }
      const data={
        isBatch: '1',
        isDeliver:'0',
        custId:row.custId,
        custfullname: row.custFullname,
        userId: this.$store.getters.userId,
        level: row.custLevel,
      }
      data.batchInfos=[{
        caseTypeId:33,
        caseNumber:formList.length,
        caseTypeName:'续展'
      }]
      createCode().then(res=>{
        data.draftNumber=res.data
        createTask(data).then(res=>{
          let taskId=res.data[0].taskId
          const data2={
            regNumberList:formList.map(item=>item.regNumber),
            caseIds:res.data[0].cases.map(item=>item.caseId),
            caseType:res.data[0].cases[0].caseType,
            caseTypeId:res.data[0].cases[0].caseTypeId
          }
          saveCaseInfoUrl(data2).then(res=>{
            this.$router.push({path:'/workbench/case/massfiling',query:{taskId}})
          })
        })
      })
    }
  },
  watch:{
    validEndDate(n,o){
      this.queryModuleData.validEndDateStart=n[0]
      this.queryModuleData.validEndDateEnd=n[1]
    },
    validStartDate(n,o){
      this.queryModuleData.validStartDateStart=n[0]
      this.queryModuleData.validStartDateEnd=n[1]
    }
  },
  components:{
    RightTable,
    pagination,remindRecord, reminderSettings
  }
}
</script>

<style lang="scss" scoped>

  .isActive {
    background-color: #409EFF;
    color: #fff;
  }

  .brush_right{
   position: absolute;
    right: 6px;
    top: -4px;
    z-index: 4;
  }
  .el-form {
    /*padding-right: 120px;*/
    padding: 30px;
    box-shadow:0px 2px 5px 0px rgba(163, 163, 163, 0.35);
    .el-row {
      .el-col {
        height: 50px;
        .el-select{
          max-height: 40px;
          max-width: 300px;
          >>> .el-select__tags{
            max-height: 30px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            overflow-y: auto;
          }
        }
      }

    }

  }
  .clearButton{
    /*position: absolute;*/
    /*left: 42%;*/
    /*top:5px;*/
    background: #fff;
    color: RGBA(254, 153, 23, 1);
    border: 0;
    /deep/ span{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img{
      width: 20px;
      margin-right: 8px;
      vertical-align: middle;
    }
  }
  >>> .el-input__inner {
    height: 28px!important;
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
      overflow: auto;
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
</style>
