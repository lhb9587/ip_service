<template>
<div>
  <el-dialog :close-on-click-modal="false" :append-to-body="true" :show-close="false" :visible.sync="dialogFormgoods"  title="商品与服务项目查询" width="70%">
    <div style="color: red">数据来源：</div>
    <div style="color: red">中文，来自商标局官网网申数据库</div>
    <div style="color: red">英文/日文，尼斯分类6位编码的项目来自商标局公布的五方数据，其它来自第三方数据库国方</div>
    <el-form label-position="left" ref="creatwfconForm" size="small" style="width: 100%;" label-width="100px">
      <el-row class="form-border">
        <el-col :span="24">
          <el-row class="first-row">
            <el-col :span="goodsSelectPlan == 2 ? 8 : 24">
              <el-form-item class="" label="选择方式:">
                <template>
                  <el-select style="width: 180px;" :clearable="true" default-first-option filterable placeholder="请选择" v-model="goodsSelectPlan">
                    <el-option label="手动填写" value="3" />
<!--                    <el-option label="选择已有方案" value="0" />-->
                    <el-option label="智能推荐" value="1" />
                    <el-option label="自助选择" value="2" />
                    <el-option label="复制导入" value="4" />
                    <el-option label="execl导入" value="5" />
                  </el-select>
                  <el-button v-if="goodsSelectPlan != 2" @click="goods=[]" style='margin-left:10px'>
                    全部删除
                  </el-button>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="goodsSelectPlan == 2">
              <el-form-item class="" label="类别:">
                <el-input v-model="goodClass" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="goodsSelectPlan == 2">
              <el-form-item class="" label="群组:">
                <el-input v-model="similarGroup" clearable></el-input>
              </el-form-item>
            </el-col>
<!--            <el-col :span="5" v-if="goodsSelectPlan == 2">-->
<!--              <el-form-item class="" label="商品代码:">-->
<!--                <el-input v-model="goodCode" clearable></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
          </el-row>
          <el-row class="first-row" v-if="goodsSelectPlan == 2">
            <el-col :span="8">
              <el-form-item class="" label="中文名称">
                <el-input v-model="nameCn" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="" label="英文名称:">
                <el-input v-model="nameEn" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="" label="商品代码:">
                <el-input v-model="goodCode" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="goodsSelectPlan == 2" style="display:flex;justify-content: flex-end;padding: 5px;border-right: 1px solid;border-color: #d7d7d7">
              <el-button @click="goods=[]" size="mini" style='margin-left:10px'>
                全部删除
              </el-button>
              <el-button size="mini" @click="searchGoodsNew" type="primary" style='margin-left:10px;'>
                查询
              </el-button>
            </div>
<!--          <el-row class="fullRow" v-if="goodsSelectPlan=='0'">-->
<!--            <el-col :span="24">-->
<!--              <el-form-item class="postInfo-container-item" label="选择已有方案:">-->
<!--                <template>-->

<!--                  <el-select @change="goodsPlanselectChange" default-first-option placeholder="请选择" v-model="goodsPlan">-->
<!--                    <el-option v-for="(item,key) in selectData.goodsPlanselect" :key="key" :label="item.planName" :value="item.planId">-->
<!--                      <span style="float: left">{{ item.planName }}</span>-->
<!--                      <span style="float: right; color: #8492a6; font-size: 13px"><i @click="delPlan(item.planId)" class="el-icon-close" /></span>-->
<!--                    </el-option>-->
<!--                  </el-select>-->
<!--                </template>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
          <el-row class="fullRow" v-if="goodsSelectPlan=='1'">
            <el-col :span="24">
              <el-form-item class="postInfo-container-item" label="选择领域:">
                <template>
                  <el-select :clearable="true" @change="zngoodChange" default-first-option filterable placeholder="请选择" v-model="zngood">
                    <el-option :key="index" :label="key" :value="value" v-for="(value, key, index) in selectData.goodszn" />

                  </el-select>
                  <el-select :clearable="true" @change="zngoodChangeb" default-first-option filterable placeholder="请选择" style="margin-left:10px" v-model="zngoodb">
                    <el-option :key="key" :label="item.type2" :value="item.id" v-for="(item,key) in selectData.goodsznselect" />

                  </el-select>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
<!--          <el-row class="" v-if="goodsSelectPlan=='2'">-->
<!--            <el-col :span="24">-->
<!--              <el-row style="height:600px">-->
<!--                <el-col :span="6" style="overflow: auto; padding:10px 10px;border-right:1px solid #ddd;height:100%;">-->

<!--                  <el-input placeholder="请输入搜索内容" @keyup.enter.native="searchGoods" size="mini" style="width:64%" v-model="filterText" />-->
<!--                  <el-button @click="searchGoods" icon="el-icon-search" size="mini" style="margin-left:0px" type="primary" />-->
<!--                  &lt;!&ndash; <el-button @click="filterText=''" style="margin-left:0px" type="primary" icon="el-icon-refresh"-->
<!--                    size="mini">-->
<!--                  </el-button> &ndash;&gt;-->
<!--                  <el-tree v-if='searchGoodsData.length<=0' empty-text='' :load="loadGoodNode" :data="searchGoodsData" :default-expand-all="false" :props="goodsTreeProps" lazy accordion class="filter-tree" node-key="id" ref="goodstree" show-checkbox />-->
<!--                  <el-tree else :data="searchGoodsData" :default-expand-all="true" empty-text='' :props="goodsTreeProps" accordion class="filter-tree" node-key="id" ref="goodstree1" show-checkbox />-->
<!--                </el-col>-->
<!--                <el-col :span="1" style="padding:0px 0px;height:100%;line-height:600px;border-right:1px solid #ddd;">-->
<!--                  <el-button @click="addGoods" icon="el-icon-d-arrow-right" size="mini" style="margin-left:0px" type="primary" />-->
<!--                </el-col>-->
<!--                <el-col :span="17" style=" overflow: auto;padding:10px 10px;height:100%;border-right:1px solid #ddd;">-->
<!--                  <el-table max-height="500" :key="changeKey" :data="pageGoods" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">-->
<!--                    <el-table-column type="index" label="序号" width="60"></el-table-column>-->
<!--                    <el-table-column align="left" label="商品类别" width column-key="goodClass" prop="goodClass" sortable :filters="headFilters['goodClass']"-->
<!--                               :filter-method="filterHandler">-->
<!--                      <template slot-scope="scope">-->
<!--                        <span>{{ scope.row.goodClass }}</span>-->
<!--                      </template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column align="left" prop="similarGroup" label="商品类似群组" width column-key="similarGroup" sortable :filters="headFilters['similarGroup']"-->
<!--                               :filter-method="filterHandler">-->
<!--                      <template slot-scope="scope">-->
<!--                        <span>{{ scope.row.similarGroup }}</span>-->
<!--                      </template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column align="left" label="商品代码" width column-key="goodCode" prop="goodCode" sortable :filters="headFilters['goodCode']"-->
<!--                               :filter-method="filterHandler">-->
<!--                      <template slot-scope="scope">-->
<!--                        <span>{{ scope.row.goodCode }}</span>-->
<!--                      </template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column align="left" label="商品中文名称" width column-key="goodName" prop="goodName" sortable :filters="headFilters['goodName']"-->
<!--                               :filter-method="filterHandler">-->
<!--                      <template slot-scope="scope">-->
<!--                        <span>{{ scope.row.goodName }}</span>-->
<!--                      </template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column align="left" label="商品英文名称" width column-key="goodEnName" prop="goodEnName" sortable :filters="headFilters['goodEnName']"-->
<!--                               :filter-method="filterHandler">-->
<!--                      <template slot-scope="scope">-->
<!--                        <span>{{ scope.row.goodEnName }}</span>-->
<!--                      </template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column align="left" label="商品日文名称" width column-key="goodJpName" prop="goodJpName" sortable :filters="headFilters['goodJpName']" :filter-method="filterHandler">-->
<!--                      <template slot-scope="scope">-->
<!--                        <span>{{ scope.row.goodJpName }}</span>-->
<!--                      </template>-->
<!--                    </el-table-column>-->

<!--                    <el-table-column align="left" label="操作" width>-->
<!--                      <template slot-scope="scope">-->
<!--                        <el-button @click="delgood(scope.row)" type="text">删除</el-button>-->
<!--                      </template>-->
<!--                    </el-table-column>-->

<!--                  </el-table>-->
<!--                  <pagination :pageSizes="pageSizesList" :storage="false" :limit.sync="goodslistPageData.pageSize" :page.sync="goodslistPageData.pageNo" :total="goodslistPageData.total" @pagination="getgoodsList(goods)" v-show="goodslistPageData.total>0" />-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--            </el-col>-->
<!--          </el-row>-->
          <el-row class="fullRow" v-if="goodsSelectPlan=='3'">
            <el-col :span="24">
              <el-form-item class="postInfo-container-item" label="商品信息:">
                <template>
                  <el-input :rows="4" placeholder="商品名称以回车分隔。" type="textarea" v-model="jyText" />
                  <el-button @click="jyGoods" style="margin-top:10px" type="primary">
                    校验信息
                  </el-button>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="fullRow" v-if="goodsSelectPlan=='4'">
            <el-col :span="24">
              <el-form-item class="postInfo-container-item" label="案卷号:">
                <template>
                  <el-input placeholder="请输入需要导入的案卷号" v-model="goodsCaseNumber" />
                  <el-button @click="getGoodsBycaseNumber" size="mini" style="margin-left:10px" type="primary">导入
                  </el-button>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="fullRow" v-if="goodsSelectPlan=='5'">
            <upload-xlsx @changeClick="clickUpload=false" @getFirstSheet="getFirstSheet" :clickUpload="clickUpload"></upload-xlsx>
            <el-button type="primary" @click="clickUpload=true" style="float:right">导入</el-button>

          </el-row>
          <el-table v-if="goodsSelectPlan != 2" max-height="500" ref="goodsTable" :key="changeKey" :data="pageGoods" :row-class-name="tableRowClassName" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column column-key="goodClass" align="left" label="商品类别" width prop="goodClass" sortable :filters="headFilters['goodClass']"
                               :filter-method="filterHandler">
              <template slot-scope="scope">
                <span>{{ scope.row.goodClass }}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" prop="similarGroup" label="商品类似群组" width column-key="similarGroup" sortable :filters="headFilters['similarGroup']"
                               :filter-method="filterHandler">
              <template slot-scope="scope">
                <span>{{ scope.row.similarGroup }}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="商品代码" width column-key="goodCode" prop="goodCode" sortable :filters="headFilters['goodCode']"
                               :filter-method="filterHandler">
              <template slot-scope="scope">
                <span>{{ scope.row.goodCode }}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="商品中文名称" width column-key="goodName" prop="goodName" sortable :filters="headFilters['goodName']"
                               :filter-method="filterHandler">
              <template slot-scope="scope">
                <span>{{ scope.row.goodName }}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="商品英文名称" width column-key="goodEnName" prop="goodEnName" sortable :filters="headFilters['goodEnName']"
                               :filter-method="filterHandler">
              <template slot-scope="scope">
                <span>{{ scope.row.goodEnName }}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="商品日文名称" width column-key="goodJpName" prop="goodJpName" sortable :filters="headFilters['goodJpName']"
                               :filter-method="filterHandler">
              <template slot-scope="scope">
                <span>{{ scope.row.goodJpName }}</span>
              </template>
            </el-table-column>

            <el-table-column align="left" label="操作" width>
              <template slot-scope="scope">
                <el-button @click="delgood(scope.row)" type="text">删除</el-button>
              </template>
            </el-table-column>

          </el-table>

          <AgGridVue v-else :style="{width:'100%','height':'350px',border:'1px'}"
                     class="ag-theme-balham"
                     ref="gridApi"
                     :columnDefs="columnDefs"
                     :gridOptions="gridOptions"
                     :rowData="pageGoods"
                     rowSelection="multiple"
                     :localeText="$store.state.caseInformation.localeText"
                     :getContextMenuItems="getContextMenuItems"
                     :rowHeight="28"
                     animateRows
                     suppressAutoSize
                     :suppressRowDrag="false"
                     :rowDragManaged="false"
                     @dragStopped="dragStopped"
                     :suppressMoveWhenRowDragging="true"
                     :frameworkComponents="frameworkComponents"
          >
          </AgGridVue>
          <pagination :pageSizes="pageSizesList" :storage="false" :limit.sync="goodslistPageData.pageSize" :page.sync="goodslistPageData.pageNo" :total="goodslistPageData.total" @pagination="getgoodsList(goods)" v-show="goodslistPageData.total>0" />
        </el-col>
      </el-row>

    </el-form>
    <div class="dialog-footer" slot="footer">
      <div class="copySelect_wrap">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group ref="checkboxGroup" v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="(item,index) in propOptions" :label="item.value" :key="index">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <el-button @click="cancel" size="mini">
        取消
      </el-button>

      <el-button @click="exportData()" size="mini" type="primary">
        导出
      </el-button>
      <el-button @click="copy(1)" size="mini" type="primary">
        复制
      </el-button>
      <el-button @click="copy(2)" size="mini" type="primary">
        复制中文
      </el-button>
      <el-button @click="copy(3)" size="mini" type="primary">
        复制英文
      </el-button>
      <el-button @click="copy(4)" size="mini" type="primary">
        复制日文
      </el-button>
    </div>
  </el-dialog>
</div>


</template>

<script>
  import Sortable from "sortablejs";
  import {
    GSQAllcategoryUrl,
    GSQCategoryUrl,
    deleteGoodsPlanUrl,
    addGoodsPlanUrl,
    queryGoodsByAgentNumUrl,
    queryGoodsPlanUrl,
    queryGoodsUrl,
    GSQQueryAllClassUrl,
    queryListByUrl,
    queryDetaileGroupUrl,
    GSQQueryClassUrl,
    GSQQueryFirstClassUrl,
    queryByNameUrl,
    queryCaseGory, queryByNameNewUrl
  } from '@/api/caseDetail'
  import Pagination from "@/components/Pagination";
  import uploadXlsx from '@/components/fileReadXLSX'
  import agInputLimitNumber from '@/components/ag-input-number'
  export default {
    name: "index",
    components: { Pagination,uploadXlsx },
    computed:{
      // headFilters(){
      //   return this.tableFilter(this.goods)
      // }
    },
    data(){
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == 'goods_service')) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == 'goods_service').tableHeader
      } else {
        tableHeader = [
          {
            headerName: '类别',
            field: 'goodClass',
            resizable: true,
            cellStyle: { 'text-align':'left','white-space': 'normal' },
            sortable: true,
            width:120,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            editable: false,
            cellRenderer: this.cellRenderer,
            cellEditor: 'agInputLimitNumber'
          },
          { headerName: '商品类似群组',
            field:'similarGroup',
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            resizable: true,
            cellStyle: { 'text-align': 'left','white-space': 'normal' },
            editable: false,
            cellRenderer: this.cellRenderer,
          },
          { headerName: '商品代码',
            field:'goodCode',
            cellStyle: { 'text-align': 'left','white-space': 'normal' },
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            resizable: true,
            editable: false,
            cellRenderer: this.cellRenderer,
          },
          { headerName: '商品中文名称',
            field:'goodName',
            cellStyle: { 'text-align': 'left','white-space': 'normal' },
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            editable: false,
            resizable: true,
            cellRenderer: this.cellRenderer,
          },
          { headerName: '商品英文名称',
            field:'goodEnName',
            cellStyle: { 'text-align': 'left','white-space': 'normal' },
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            editable: false,
            resizable: true,
            cellRenderer: this.cellRenderer,
          },
          { headerName: '商品日文名称',
            field:'goodJpName',
            cellStyle: { 'text-align': 'left','white-space': 'normal' },
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            editable: false,
            resizable: true,
            cellRenderer: this.cellRenderer,
          }
        ]
      }
      const that = this;
      const propOptions =localStorage.getItem("GoodsAndServices")
        ?JSON.parse(localStorage.getItem("GoodsAndServices")):[{label:'序号',value:'sid'},{label:'类别',value:'goodClass'},{label:'商品类似群组',value:'similarGroup'},{label:'商品代码',value:'goodCode'},{label:'商品中文名称',value:'goodName'},{label:'商品英文名称',value:'goodEnName'},{label:'商品日文名称',value:'goodJpName'}];
      return{
        tableHeader,
        frameworkComponents: {
          agInputLimitNumber: agInputLimitNumber
        },
        gridApi: {},
        gridOptions:{
      ...this.$store.state.caseInformation.gridOptions,
          onColumnResized(params) {
          params.api.resetRowHeights();
        },
        onGridReady: (params)=>{
          this['gridApi'] = params.api
          // this.data.billDetailsfwf.forEach(function(data, index) {
          //   data.id = index;
          // });
          // params.api.setRowData(this.data.billDetailsfwf);
          params.api.sizeColumnsToFit();
        },
          // singleClickEdit:true,
          // onCellEditingStarted: function (event) {
          //   console.log('cellEditingStarted');
          // },
          onCellEditingStarted(event){
          that.preValue = event.value

          // that.edit(event.data)
        },
        // getRowHeight(params){
        //   if(params.data.description){
        //     return (params.api.getSizesForCurrentTheme().rowHeight * Math.floor(params.data.description.length / 50))
        //   }else {
        //     return 28
        //   }
        //  // return (params.api.getSizesForCurrentTheme().rowHeight * Math.floor(params.data.description.length / 50))
        // },
        onCellValueChanged(event){

        },
        onCellEditingStopped(event){
          if (that.preValue === event.value)return;
          if(event.colDef.field=='goodName'){
            // that.queryList(event.value,event.data)
          }

          // that.save(event.data)
          // if(that.preValue===event.value){
          //   return;
          // }
          // // this['gridApi'+'billDetailsfwf'].resetRowHeights();
          // this.changeRowFwf(event)
          // this.resetRowHeights('billDetailsfwf')
        },
      },
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 70,
            resizable: true,
            enableRowGroup: true,
            // enablePivot: true,
            'pinned': 'left',
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            cellRenderer: this.cellRenderer,
            suppressMenu: true
          }
        ],
        columnDefs: [],
        nameCn: '',
        nameEn: '',
        goodCode: '',
        similarGroup: '',
        goodClass: '',
        pageSizesList:[100, 1000],
        changeKey: false,
        headFilters: {},
        goods:[],
        selectData:{
          goodszn:[],
          goodsznselect:[]
        },
        checkAll: false,
        checkedCities: ['goodClass','goodName','goodEnName'],
        propOptions: propOptions,
        isIndeterminate: true,
        zngoodb: "",
        zngood: "",
        filterText:'',
        goodsCaseNumber:'',
        goodsSelectPlan:'3',
        dialogFormgoods:false,
        pageGoods:[],
        searchGoodsData: [],
        goodsData: [],
        goodslistPageData: {
          total: 0,
          pageNo: 1,
          pageSize: 100
        },
        treeLazy: true,
        goodsTreeProps: {
          label: function (data, node) {
            if (node.level == 1) {
              return data.classshortname;
            }
            if (node.level == 2) {
              return data.groupshortname;
            }
            if (node.level == 3) {
              return data.goodName;
            }
          },
          children: "chaild",
          isLeaf: function (data, node) {
            if (node.level == 3) {
              return true;
            }
          }
        },
        clickUpload:false,
        jyText:''
      }
    },
    watch:{
      filterText (n) {
        if (n == "") {
          this.searchGoodsData = [];
        }
      },

      goodsSelectPlan (n) {
        this.planselectchange(n);
      },
      goods: function (val, oldval) {
        this.getgoodsList(val);
      },
    },
    created() {
      this.dialogFormgoods=true
      this.goodsDialogShow()
      this.columnDefs = [...this.defaultcolumnDefs,...this.tableHeader.map(item=>({
        headerName: item.headerName,
        field: item.field,
        width: item.width,
        resizable: true,
        sortable: false,
        filter: false,
      }))]
    },
    mounted() {
      this.sortable()
    },
    methods:{
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          headerName: item.colDef.headerName,
          width: item.actualWidth,
          field: item.colDef.field
        })).filter(item => item.field != 'sid' && item.prop != 'group')
        this.tableHeader = tableHeader
        this.saveLocation()
      },
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({name: 'goods_service', tableHeader: this.tableHeader.filter(j => j.field !== 'sid')})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == 'goods_service')) {
            arr.find(item => item.name == 'goods_service').tableHeader = this.tableHeader.filter(j => j.field !== 'sid')
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({name: 'goods_service', tableHeader: this.tableHeader.filter(j => j.field !== 'sid')})
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
        }
      },
      getContextMenuItems(params){
        return [ {name:'复制',
          action: () =>{
            this.$copyText(params.value).then(
              res => {
              })
          }},
          {name:'删除',
            action:()=>{
              this.delgood(params.node.data)
            }
          }]
      },
      cellRenderer(params){
        // if(params.colDef.field=='userid'){
        //   return params.data.useridString
        // }
        // if(params.colDef.field=='roleid'){
        //   return params.data.roleidString
        // }
        //
        // if(params.colDef.field=='description'){
        //   return  this.getSpecialInfo(params.value)
        // }
        if(params.colDef.field == 'sid'){
          return params.rowIndex+1// params.data.no//params.rowIndex+1
        }
        return `<span title="${params.value}">${params.value?params.value:''}</span>`
      },
      getSelectedRows() {
        const selectedNodes = this['gridApi'].getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      },
      exportData() {
        if (this.goodsSelectPlan == 2) {
          if (!this.getSelectedRows().length) {
            this.$message.error('请选择要导出的数据')
            return
          }
          this.pageGoods.forEach((item,index)=>item.sid=index+1)

          let propArr = this.tableHeader.reduce((pre,next)=>{
            if(this.checkedCities.includes(next.field)){
              pre.push(next.field)
            }
            return pre
          },[])//['goodClass','goodName','goodEnName']

          // let tableColList = [
          //   {key: 'sid', title: '序号'},
          //   {key: 'goodClass', title: '商品类别'},
          //   {key: 'similarGroup', title: '商品类似群组'},
          //   {key: 'goodCode', title: '商品代码'},
          //   {key: 'goodName', title: '商品中文名称'},
          //   {key: 'goodEnName', title: '商品英文名称'},
          //   {key: 'goodJpName', title: '商品日文名称'},
          // ].filter(item => propArr.includes(item.key))

          this.$commonUtils.ExportExcel(this.gridApi.columnController.allDisplayedColumns.map(item => ({key: item.colDef.field, title: item.colDef.headerName})).filter(item => propArr.includes(item.key)), this.getSelectedRows(), '商品服务项目.xlsx')
        } else {
          if (!this.pageGoods.length) {
            this.$message.error('暂无可导出数据')
            return
          }
          this.$refs.goodsTable.tableData.forEach((item,index)=>item.sid=(index+1)+'.')
          var propArr = this.propOptions.reduce((pre,next)=>{
            if(this.checkedCities.includes(next.value)){
              pre.push(next.value)
            }
            return pre
          },[])//['goodClass','goodName','goodEnName']

          let tableColList = [
            {key: 'sid', title: '序号'},
            {key: 'goodClass', title: '商品类别'},
            {key: 'similarGroup', title: '商品类似群组'},
            {key: 'goodCode', title: '商品代码'},
            {key: 'goodName', title: '商品中文名称'},
            {key: 'goodEnName', title: '商品英文名称'},
            {key: 'goodJpName', title: '商品日文名称'},
          ].filter(item => propArr.includes(item.key))
          console.log(this.pageGoods)
          this.$commonUtils.ExportExcel(tableColList, this.pageGoods, '商品服务项目.xlsx')
        }

      },
      tableFilter(list){
        let filters = {}
        if (list.length) {
          Object.keys(list[0]).forEach(item => {
            filters[item] = []
          })
          list.forEach(item => {
            for (let key in item) {
              if (filters.hasOwnProperty(key) && !filters[key].find(i => i.text == item[key])) {
                filters[key].push({text: item[key], value: item[key]})
              }
            }
          })
        }
        return filters;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      sortable(){
        let that=this
       let el = this.$refs.checkboxGroup.$el
        var sortable = Sortable.create(el, {
          onEnd(evt) {
            var newStore =  that.propOptions.slice()
            moveInArray(newStore, evt.oldIndex, evt.newIndex);
            that.$set( that,'propOptions',[])
            that.$nextTick(()=>{
              that.$set( that,'propOptions',newStore)
              localStorage.setItem("GoodsAndServices", JSON.stringify(that.propOptions));
            })
            function moveInArray(arr, fromIndex, toIndex) {
            var element = arr[fromIndex];
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
          }

          }
        });
      },
      handleCheckAllChange(val) {
        this.checkedCities = val ? this.propOptions.map(item=>item.value) : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.propOptions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.propOptions.length;
      },
      copy(type){
        let str = ''
        let propArr = []
        if (this.goodsSelectPlan == 2) {
          if (!this.getSelectedRows().length) {
            this.$message.error('请选择要复制的数据')
            return
          }
          propArr = this.tableHeader.reduce((pre,next)=>{
            if(this.checkedCities.includes(next.field)){
              pre.push(next.field)
            }
            return pre
          },[])//['goodClass','goodName','goodEnName']
          // var propArr = ['sid', 'goodName', 'similarGroup']
          if(type==2){
            propArr = ['goodName']
          }
          if(type==3){
            propArr = ['goodEnName']
          }
          if(type == 4){
            propArr = ['goodJpName']
          }

          this.getSelectedRows().forEach((item,index)=>item.sid=(index+1)+'.')
          str = this.getSelectedRows().reduce((pre,next)=>{
            return pre+propArr.map(item=>{
              if(next[item]){
                if(item!=='sid'){
                  return  next[item]//+new Array((Math.max(...this.goods.filter(i=>i[item]).map(i=>i[item].length))-next[item].length)*2).join(' ')
                }else {
                  return  next[item]+new Array(Math.max(...this.getSelectedRows().filter(i=>i[item]).map(i=>i[item].length))-next[item].length+1).join(' ')
                }

              }else {
                if(!this.getSelectedRows().filter(i=>i[item]).length){
                  return ''
                }else {
                  return new Array(Math.max(...this.getSelectedRows().filter(i=>i[item]).map(i=>i[item].length))+1).join(' ');
                }
              }
            }).join(' ')+`\r\n`
          },'')
        } else {
          propArr=this.propOptions.reduce((pre,next)=>{
            if(this.checkedCities.includes(next.value)){
              pre.push(next.value)
            }
            return pre
          },[])//['goodClass','goodName','goodEnName']
          // var propArr = ['sid', 'goodName', 'similarGroup']
          if(type==2){
            propArr = ['goodName']
          }
          if(type==3){
            propArr = ['goodEnName']
          }
          if(type == 4){
            propArr = ['goodJpName']
          }

          this.$refs.goodsTable.tableData.forEach((item,index)=>item.sid=(index+1)+'.')
          str = this.$refs.goodsTable.tableData.reduce((pre,next)=>{
            return pre+propArr.map(item=>{
              if(next[item]){
                if(item!=='sid'){
                  return  next[item]//+new Array((Math.max(...this.goods.filter(i=>i[item]).map(i=>i[item].length))-next[item].length)*2).join(' ')
                }else {
                  return  next[item]+new Array(Math.max(...this.$refs.goodsTable.tableData.filter(i=>i[item]).map(i=>i[item].length))-next[item].length+1).join(' ')
                }

              }else {
                if(!this.$refs.goodsTable.tableData.filter(i=>i[item]).length){
                  return ''
                }else {
                  return new Array(Math.max(...this.$refs.goodsTable.tableData.filter(i=>i[item]).map(i=>i[item].length))+1).join(' ');
                }
              }
            }).join(' ')+`\r\n`
          },'')
        }


        this.$copyText(str).then(
          res => {
            this.$message.success('复制成功')
          })
      },
      cancel(){
        this.dialogFormgoods = false;
        this.$emit('cancel')
      },
      tableRowClassName ({ row, rowIndex }) {
        if (row.flag === 0) {
          return "warning-row";
        }
        return "";
      },
      delgood (item) {
        const index = this.goods.indexOf(item);
        this.goods.splice(index, 1);
      },
      goodsDialogShow () {
        this.goods = [];
        this.zngoodb = "";
        this.zngood = "";
        this.goodsPlan = "";
        // if (!this.goodsData.length) {
        //   GSQQueryFirstClassUrl().then(response => {
        //     this.goodsData = response.data;
        //   });
        // }
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
      getgoodsList (goods) {
        this.goodslistPageData.total = goods.length;

        var offset =
          (this.goodslistPageData.pageNo - 1) * this.goodslistPageData.pageSize;
        this.pageGoods =
          offset + this.goodslistPageData.pageSize >= goods.length
            ? goods.slice(offset, goods.length)
            : goods.slice(offset, offset + this.goodslistPageData.pageSize);
        this.headFilters = this.tableFilter(this.pageGoods)
        this.changeKey = !this.changeKey
        console.log(this.pageGoods);
      },
      zngoodChange (value) {
        this.selectData.goodsznselect = value;
        console.log(value);
      },
      zngoodChangeb (id) {
        GSQCategoryUrl({ grid: id }).then(res => {
          this.goods = res.data;
        });
      },
      // 任务6947
      searchGoodsNew () {
        queryByNameNewUrl({ name: this.nameCn, nameEn: this.nameEn , goodClass: this.goodClass, similarGroup: this.similarGroup, goodCode: this.goodCode }).then(res => {
          this.goods = res.data
        });
      },
      searchGoods () {
        // if (this.filterText) {
          queryByNameUrl({ name: this.filterText, goodClass: this.goodClass, similarGroup: this.similarGroup, goodCode: this.goodCode }).then(res => {
            this.searchGoodsData = res.data.map(item => {
              if (item.goodgroups) {
                item.chaild = item.goodgroups;
                if (item.goodgroups) {
                  item.goodgroups.map(ite => {
                    if (ite.gooddetails) {
                      ite.chaild = ite.gooddetails;
                    }
                    return ite;
                  });
                }
                return item;
              }
            });
            console.log(this.searchGoodsData);
            this.treeLazy = false;
          });
        // }
      },
      getFirstSheet(data){
        let str =  JSON.stringify(data).replace(/类别/g,'goodClass').replace(/商品中文/g,'goodName').replace(/商品英文/g,'goodEnName')
        let list=   JSON.parse(str)
        this.goods =[...this.goods,...list]
      },
      loadGoodNode (node, resolve) {
        if (node.level === 0) {
          return resolve(this.goodsData);
        }
        if (node.level === 1) {
          GSQQueryClassUrl({ Class: node.data.classcode }).then(response => {
            return resolve(response.data.groupdetailgroup);
          });
        }
        if (node.level === 2) {
          queryDetaileGroupUrl({ Group: node.data.groupcode }).then(response => {
            return resolve(response.data.groupdetail);
          });
        }
      },
      addGoods () {

        if (this.searchGoodsData.length <= 0) {
          this.goods = [
            ...this.goods,
            ...this.$refs.goodstree.getCheckedNodes({
              leafOnly: true
            })
          ];
          this.$refs.goodstree.setCheckedKeys([]);
        } else {
          this.goods = [
            ...this.goods,
            ...this.$refs.goodstree1.getCheckedNodes({
              leafOnly: true
            })
          ];
          this.$refs.goodstree1.setCheckedKeys([]);
        }

        const res = new Map();
        this.goods = this.goods.filter(
          item => !res.has(item.goodName) && res.set(item.goodName, 1)
        );
      },
      getGoodsBycaseNumber () {
        if (!this.goodsCaseNumber) {
          this.$message.error("请输入案卷号");
        } else {
          queryGoodsByAgentNumUrl({ agentNum: this.goodsCaseNumber }).then(
            res => {
              this.goods = res.data;
              this.$message.success("导入成功");
            }
          );
        }
      },
      planselectchange (val) {
        this.goods = [];
        if (val == "0") {
          if (this.appId) {
            this.getgoodspian();
          } else {
            this.$message.error("商品方案需要先选择申请人!");
          }
        }
        if (val == "1") {
          if (!this.selectData.goodszn.length) {
            GSQAllcategoryUrl({ lang: "cn" }).then(res => {
              this.selectData.goodszn = res.data;
            });
          }
        }
        if (val == "2") {
        }
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
      /*width: 36.7%;*/
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
        margin-left: 0!important;
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
    height: 40px;
  }

  /deep/ .el-step {
    cursor: pointer;
  }

  .upload-btn {
    display: inline-block;
  }

  /deep/ .el-table {
    /*max-height: 500px;*/
    /*overflow: auto;*/
    .warning-row {
      background: #dd7a7a;
      color: white;
    }
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
    /deep/ .el-select,
    /deep/ .el-input {
      width: 100% !important;
    }
  }
  .line_m{
    text-decoration: line-through;
  }
  /deep/ .supplementTable{
    .deleteChange{
      background:#ffffee !important;
      color:#E3EAE9;
    }
    .modifyChange{
      background:#ffffee  !important;
      color:#C46A16;
    }
    .addChange{
      background:#ffffee  !important;
      /*color:#C46A16;*/
    }
    .nothingChange{
      background:#E3EAE9 !important;
      color:#333;
    }
  }
  .ag-theme-balham{
    /deep/ .el-input,
    /deep/ .el-select {
      width: 100%;
      line-height: 28px;
    }
    /deep/ .el-textarea{
      height: 100%;
      textarea{
        height: 100%;
      }
    }
    /deep/ .el-input__inner{
      padding: 0
    }
    /deep/ .el-input__prefix{
      display: none;
    }
    /deep/ .ag-cell-auto-height{
      height: 100%!important;
      word-wrap: break-word;
      word-break: break-word;
    }
    /deep/ .ag-cell-inline-editing{
      background: #fff;
      color: #333;
    }
  }
  .copySelect_wrap{
    display: flex;
    margin-bottom: 15px;
  }
  >>>.el-form {
      .first-row {
        display: flex;
        .el-col {
          display: flex;
          /*height: 42px;*/
          .el-form-item {
            flex: 1;
            .el-form-item__content {
              height: 100%;
              padding: 5px 15px;
            }
            .el-form-item__label {
              /*line-height: 35px;*/
              height: 100%;
              border-right: 1px solid #d7d7d7;
              /*background-color: #f9f9f9;*/
            }
          }
        }
      }
    }
  >>> .el-dialog {
    margin-top: 5vh !important;
  }
</style>
