<template>
  <div class="staff">
    <h2 class="department_header">国内价目表</h2>
    <div class="queryBlock">
      <div class="buttonWrap">
        <el-button type="primary" @click="mySearch">搜索</el-button>
        <el-button type="primary" @click="detachMent">重置</el-button>
        <el-button type="primary" @click="jumpStaffAdd">新增</el-button>
      </div>
      <div class="queryModular">
        <el-form ref="postForm"  size="mini" class="form-container">

          <el-form-item label-width="130px" label="案件类型:"  class="postInfo-container-item">
            <el-multi-cascader
              ref="multiCascader"
              :show-all-levels="false"
              :options="$store.state.caseInformation.caseTypeList"
              multiple
              filterable
              clearable
              :props="defaultParams"
              change-on-select
              selectChildren
              v-model="queryModuleData.caseTypeIds"> </el-multi-cascader>
            </el-form-item>


          <!-- <el-form-item label-width="130px" label="案件类型:"  class="postInfo-container-item">
            <el-cascader  ref="multiCascader"
                          :show-all-levels="false"
                          :options="$store.state.caseInformation.caseTypeList"
                          filterable
                          clearable
                          :props="defaultParams"

                          change-on-select
                          selectChildren
                          v-model="caseTypeIds"
            ></el-cascader>
          </el-form-item> -->


          <el-form-item  label-width="130px"  label="申请方向:" class="postInfo-container-item">
            <el-select v-model="queryModuleData.appFromto" clearable placeholder="请选择" class="postInfo-container-item">
              <el-option
                v-for="item in options"
                :key="item.value1"
                :label="item.label1"
                :value="item.value1"
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label-width="130px"  label="递交方式:" class="postInfo-container-item">
            <el-select v-model="queryModuleData.onlineApp" clearable placeholder="请选择" class="postInfo-container-item">
              <el-option
                v-for="item in submits"
                :key="item.value2"
                :label="item.label2"
                :value="item.value2">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="130px" label="上报事项:"  class="postInfo-container-item" prop="reportMatter">
            <el-select  default-first-option v-model="queryModuleData.reportMatter" clearable placeholder="请选择" >
              <el-option
                v-for="item in reportMatterList"
                :key="item.id"
                :label="item.typeName"
                :value="item.typeName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label-width="130px"  label="费用种类:" class="postInfo-container-item">
            <el-select v-model="queryModuleData.chargeType" placeholder="请选择" clearable class="postInfo-container-item">
              <el-option
                v-for="item in costs"
                :key="item.value3"
                :label="item.label3"
                :value="item.value3">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label-width="130px"  label="费用名中文:" class="postInfo-container-item">
            <el-input v-model="queryModuleData.nameCn" placeholder=""></el-input>
          </el-form-item>
          <el-form-item  label-width="130px"  label="费用名英文:" class="postInfo-container-item">
            <el-input v-model="queryModuleData.nameEn" placeholder=""></el-input>
          </el-form-item>
          <el-form-item  label-width="130px"  label="草单类型:" class="postInfo-container-item">
            <el-cascader 
              :show-all-levels="false"
              :options="typeTreeList"
              filterable
              clearable
              :props="billTypeProps"
              change-on-select
              selectChildren
              v-model="groupTypeIds"
              ></el-cascader>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <TitleTotal :total="total" :currentPageSize="currentPageSize"/>
    <div style="position: relative">

      <el-button class="brush_right" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
    <AgGridVue style="height: 550px;"
               class="ag-theme-balham"
               :columnDefs="columnDefs"
               :rowData="rowData"
               :localeText="$store.state.caseInformation.localeText"
               rowSelection="single"
               :gridOptions="gridOptions"

               :getContextMenuItems="getContextMenuItems"
               @rowDoubleClicked="rowDoubleClicked"
               @grid-ready="onGridReady"
               @firstDataRendered="firstDataRendered"
               @sortChanged="refreshEvenRowsCurrencyData"
               @filterChanged="refreshEvenRowsCurrencyData">
    </AgGridVue>
    </div>
<!--    <pagination-->
<!--      v-show="total>0"-->
<!--      :total="total"-->
<!--      :pageSizes="pageSizesList"-->
<!--      :page.sync="listQuery.pageNo"-->
<!--      :limit.sync="listQuery.pageSize"-->
<!--      @pagination="queryUsers"-->
<!--    />-->
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { querycustSelectClass } from '@/api/customerList.js'
import { queryChargeItemList,deleteChargeItem} from '@/api/systemList'
import PullToLoad from '@/utils/pulltoload.js'
import{ queryClassTree } from "@/api/billApi";
export default {
  name: 'staff_management',
  data() {
    return {
      reportMatterList:[],//上报事项
      reportMatter:'',
      pageSize:10,
      pageSizesList:[10, 50,100, 200,500,1000],
      listQuery:{
        pageNo: 1,
        pageSize: 100,
        offset:0//JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10,
      },
      total: 0,
     defaultcolumnDefs:[
        {
          headerName: '序号',
          field: 'sid',
          width: 80,
          enableRowGroup: true,
          // enablePivot: true,
          cellRenderer:this.cellRenderer,
          floatingFilter:true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true
        },
      ],
      columnDefs:[
        {headerName: '费用中文名', field: 'nameCn',},
        {headerName: '费用英文名', field: 'nameEn'},
        {headerName: '费用日文名', field: 'nameJp'},
        {headerName: '案件类型', field: 'caseType'},
        {headerName: '费用种类', field: 'typeName'},
        {headerName: '草单类型', field: 'groupTypeName'},
        {headerName: '递交方式', field: 'onlineApp'},
        {headerName: '专利类型', field: 'patentType'},
        {headerName: '申请方向', field: 'appFromto'},
        {headerName: '上报事项', field: 'reportMatter'},
        {headerName: '价格', field: 'price'},
        {headerName: '创建人', field: 'fullname'},
        {headerName: '创建日期', field: 'createDate'},
        {headerName: '备注', field: 'memo'}
      ],
      rowData: [

      ],
      gridOptions:{

      },
      currentPageSize:0,
      queryModuleData:{
        appFromto:'',
        chargeType:'',
        onlineApp:'',
        nameCn:'',
        reportMatter:'',
        nameEn:''
      },
      gridApi:{},
      defaultParams: {
        //級聯菜單默認
        value: "caseTypeId",
        label: "caseType",
        children: "childrens",
        checkStrictly: true,
        multiple: true
      },
      billTypeProps:{
        value: "id",
        label: "typeName",
        children: "childrens",
        checkStrictly: true,
      },
      costs:[{
        value3:'1',
        label3:'服务费'
      },{
        value3:'2',
        label3:'官费'
      },{
        value3:'3',
        label3:'杂费'
      }],
      cost:'',
      submits:[{
          value2:0,
          label2:'网上申请'
        },{
          value2:1,
          label2:'线下申请'
        }],
       submit:'',
      options: [{
        value1: '内-内',
        label1: '内-内'
      }, {
        value1: '外-外',
        label1: '外-外'
      }, {
        value1: '外-内',
        label1: '外-内'
      }, {
        value1: '内-外',
        label1: '内-外'
      }, {
        value1: '台-内',
        label1: '台-内'
      }],
      typeTreeList:[],
      groupTypeIds:[]
    }
  },
  created() {
    this.columnDefs=[...this.defaultcolumnDefs,...this.columnDefs.map(item=>({
      headerName: item.headerName,
      field: item.field,
      resizable: true,
      sortable: true,
      filter: 'agSetColumnFilter',
      cellRenderer:this.cellRenderer,
      menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],

      filterParams: {
        newRowsAction: 'keep',
         comparator: (a, b)=>{
              return this.$commonUtils.sort(a,b,item.field)
            }
      }
    }))]
    this.mySearch()
    this.querycustSelectClass()
    this.queryBillTypeTree()
  },
  methods: {
    brushRight(){
      // let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
      let arr = this.columnDefs.map(item=>item.field)// Object.keys(data)
      arr.forEach(item=>{
        this.gridApi.destroyFilter(item)
      })
    },
    querycustSelectClass(){
      const data = {
        classId: '1069'
      }
      querycustSelectClass(data).then(res=>{
        this.reportMatterList=res.data['1069']
      })
    },
    queryBillTypeTree(){
      queryClassTree({classId:1185}).then(res=>{
        const list = res.data[1185] || []
        const formatData = list.map((item)=>{
          if(item.childrens && item.childrens.length>0){
            return {
              typeName:item.typeName,
              id:item.id,
              childrens:item.childrens
            }
          }else{
            return {
              typeName:item.typeName,
              id:item.id,
              childrens:null
            }
          }
        })
        this.typeTreeList = formatData
      })
    },
    getContextMenuItems(params){

      return [ {name:'复制',
        action: () =>{
          this.$copyText(params.value).then(
            res => {
            })
        }},
        {name:'修改',
          action: () =>{
            this.jumpStaffModify(params.node.data)
          }},
        {name:'删除',
          action:()=>{
            this.deleteDeptId( params.node.data)

          }}]
    },
    cellRenderer(params){
      if(params.colDef.field=='sid'){
        return params.rowIndex+1
      }
      if(params.colDef.field=='onlineApp'){
        if(params.value===true){
          return '网上申请'
        }
        if(params.value===false){
          return '线下递交'
        }
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
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    queryUsers() {
      this.listQuery.pageNo = 1
      if(this.groupTypeIds.length>0){
        this.queryModuleData.groupType = this.groupTypeIds[this.groupTypeIds.length-1]
      }else{
        this.queryModuleData.groupType = ''
      }
      queryChargeItemList(Object.assign(this.listQuery,this.queryModuleData)).then(res => {
        if (res.success) {
          // let that= this
          // const updateData = data => {
          //   var dataSource = {
          //     rowCount:null,
          //     getRows: function (params) {
          //       console.log(params.startRow, params.endRow);
          //
          //       var rowsThisPage = data.slice(params.startRow, params.endRow);
          //       var lastRow = -1;
          //       if (that.total <= params.endRow) {
          //         lastRow = that.total//data.length;
          //       }
          //       if(that.listQuery.pageNo!=1){
          //         queryChargeItemList(Object.assign(that.listQuery,that.queryModuleData)).then(res => {
          //           params.successCallback(res.data,lastRow);
          //           that.listQuery.pageNo+=1
          //         })
          //       }
          //       if(that.listQuery.pageNo==1){
          //         params.successCallback(rowsThisPage,lastRow);
          //         that.listQuery.pageNo+=1
          //       }
          //     },
          //   };
          //
          //   this.gridApi.setDatasource(dataSource);
          // }
          // updateData(res.data)
          this.rowData = res.data
          this.total=res.total
          this.lastRow=this.rowData.length
          this.listQuery.pageNo+=1
        }
      })
    },
    firstDataRendered(){

      var pull = new PullToLoad(".ag-body-viewport", {
        // 当滑动到距离底部还有 100px 的时候就触发加载事件
        threshold: 10,
      })

      pull.on("load", (reset)=>{
        this.scrollTopY=document.querySelector('.ag-body-viewport').scrollTop
        if(this.lastRow<this.total){
          queryChargeItemList(Object.assign(this.listQuery,this.queryModuleData)).then(res => {
            this.rowData=[...this.rowData,...res.data]
            this.$nextTick(()=>{
              document.querySelector('.ag-body-viewport').scrollTop=this.scrollTopY
            })
            this.lastRow=this.rowData.length
            this.listQuery.pageNo+=1
            reset()
          })
        }
      })
    },
    mySearch() {
      this.listQuery.pageNo = 1
      this.lastRow=-1
      this.listQuery.offset=0
      this.queryUsers()
    },
    detachMent() {
      for (var key in this.queryModuleData) {
        if(key.includes('Array')||key.includes('List')){
          this.$set(this.queryModuleData,key,[])
        }else if(key==='caseTypeIds'){
          this.$set(this.queryModuleData,key,[])
          if(this.$refs.multiCascader){
            this.$refs.multiCascader.$el.querySelector('.el-input__inner').value=''
          }
        }else if(key==='groupType'){
          this.groupTypeIds = []
          this.$set(this.queryModuleData,key,null)
        }else{
          this.$set(this.queryModuleData,key,null)
        }
      }
    },
    jumpStaffModify(row) {
      this.$router.push(`/workbench/system_management/marked_detail?type=2&chargeItemId=${row.chargeItemId}`)
    },
    jumpStaffAdd() {
      this.$router.push('/workbench/system_management/marked_detail?type=1')
    },
    rowDoubleClicked(parmas){
      this.$router.push(`/workbench/system_management/marked_details?chargeItemId=${parmas.data.chargeItemId}`)
    },
    deleteDeptId(row){
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteChargeItem({chargeItemId:row.chargeItemId}).then(res=>{
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.scrollTopY=document.querySelector('.ag-body-viewport').scrollTop
          this.total-=1
          this.rowData.splice(this.rowData.indexOf(row),1)
          this.lastRow=this.rowData.length



          this.$nextTick(()=>{
            document.querySelector('.ag-body-viewport').scrollTop=this.scrollTopY
          })
          // this.queryUsers()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    unique(arr) {//根據userid去重
      const res = new Map();
      return arr.filter((a) => !res.has(a.userId) && res.set(a.userId, 1))
    },
    formatDate(time){
      return this.$commonUtils.formatDate(time)
    }
  },
  watch:{
    'gridApi.rowModel.rootNode.allChildrenCount'(n){
      this.currentPageSize=n
    },
    rowData:{
      handler(n,o){
        this.listQuery.offset=n.length
      },
      deep:true
    }
  },
  components:{
    Pagination,
  }
}
</script>

<style scoped lang="scss">
  .staff  .department_header{
    height:36px;
    font-size:18px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(38,42,47,1);
    line-height: 36px;
  }
  .staff  .queryBlock{
    border:1px solid rgba(191,191,191,1);
    padding: 15px;
    margin-bottom: 13px;
  }
  .staff  .buttonWrap{
    float: right;
    margin-right: 58px ;
  }
  .form-container{
    width: 80%;
    display: flex;
    flex-wrap: wrap;

    .postInfo-container-item{
      display: inline-block;
      /deep/ .el-input{
       // height: 30px;
        width: 200px;
      }
    }
  }

  .multi-cascader {
    /deep/ .el-cascader__label{
      max-height: 28px;
      overflow-y: auto
    }
    /deep/ .el-input__inner{
      background: transparent !important;
    }
  }

  .brush_right{
    position: absolute;
    right: 6px;
    top: -4px;
    z-index: 4;
  }
</style>
