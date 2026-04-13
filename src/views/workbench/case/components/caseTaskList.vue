<template>
    <div>

      <div class="content_wrap">
        <div class="left_wrap" style="width: 100%;height: 500px;">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          class="ag-theme-balham"
          :gridOptions="gridOptions"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :rowData="rowData"
          rowSelection="multiple"
          @rowClicked="rowClicked"
          @rowDoubleClicked="rowDbClick"
          @dragStopped="dragStopped"
          :groupSuppressAutoColumn="true"
          :groupDefaultExpanded="1"
          :groupSelectsChildren="true"
          :getContextMenuItems="getContextMenuItems"
          suppressAutoSize
          :localeText="$store.state.caseInformation.localeText"
          animateRows
        />
        </div>
<!--        <div class="right_wrap" :style="{position:'relative','margin-left':currentId&&pattern?'10px' :'0',height:clientHeight+'px'}">-->
<!--          <taskDetail v-if="currentId" :prj-task-id="currentId"></taskDetail>-->
<!--        </div>-->
      </div>

      <el-dialog title="修改任务组" :visible.sync="EditGroupView" width="30%">
        <el-form :model="editGroupInfo" >
          <el-form-item required label="任务组名称" style="padding: 0 50px" prop="prjTgName">
            <el-input v-model="editGroupInfo.prjTgName" autocomplete="off"></el-input>
          </el-form-item>
          <!--          <el-form-item label="任务组序号">-->
          <!--            <el-input v-model="editGroupInfo.prjTgId" autocomplete="off"></el-input>-->
          <!--          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click="EditGroupView = false">取 消</el-button>
          <el-button type="primary" @click="editTaskGroup(editGroupInfo)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  // import { mapGetters,mapState } from "vuex";
  // import taskDetail from './taskDetail'
  import taskHandle from "@/views/homePage/components/taskHandle.vue";
  import {deleteProjectTask,deleteProjectTaskGroup,modifyProjectTaskGroup} from '@/api/caseList'
  import vm from "../../../../main";

  export default {
    props:{
      caseData:{

      },
      caseId:{
        type:[String,Number]
      }
    },
    name: "caseTaskList",
    data(){
      return {
        leftWrapWidth:localStorage.getItem('leftWrapWidth')?localStorage.getItem('leftWrapWidth'):'60%',
        gridOptions:{...this.$store.state.caseInformation.gridOptions,...{
            getRowStyle:(params)=>{
              if(params.node.data){

                if(params.node.data.auditStatus==1||params.node.data.isCheck==0){
                  return { background:'#DCDFE6' }
                }
              }
            },
            statusBar: {
              statusPanels: [
                { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
              ]
            },
            // suppressScrollOnNewData:true
            //floatingFilter: true,defaultcolumnDefs
          }},
        defaultcolumnDefs:[
          {
            headerName: '序号',
            field: 'sid',
            width:this.getLoactionWidth('序号')=='auto'?60:this.getLoactionWidth('序号'),
            resizable: true,
            'pinned': 'left', //固定再左边
            enableRowGroup: true,
            // enablePivot: true,
            floatingFilter:true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer:this.cellRenderer,
            // checkboxSelection:function(params) {
            //   // we put checkbox on the name if we are not doing grouping
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // },
            // headerCheckboxSelection:(params)=>{
            //   // we put checkbox on the name if we are not doing grouping
            //   if(this.selectionState){
            //     return false
            //   }
            //   console.log(params.columnApi.getRowGroupColumns().length === 0);
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // }
          },
          {
            headerName: '任务阶段',
            width:this.getLoactionWidth('任务阶段')=='auto'?200:this.getLoactionWidth('任务阶段'),
            showRowGroup: 'prjTgName',
            field: 'prjTgName',
            rowGroup: 'true',
            cellRenderer:'agGroupCellRenderer'},
          {
            headerName: '操作',
            field: 'handle',
            width: 60,
            'pinned': 'right', //固定在右边
            enableRowGroup: true,
            // enablePivot: true,
            floatingFilter:true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer:this.cellRenderer,
            // editable: true,
            // cellEditor: 'taskHandle',
            // checkboxSelection:function(params) {
            //   // we put checkbox on the name if we are not doing grouping
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // },
            // headerCheckboxSelection:(params)=>{
            //   // we put checkbox on the name if we are not doing grouping
            //   if(this.selectionState){
            //     return false
            //   }
            //   console.log(params.columnApi.getRowGroupColumns().length === 0);
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // }
          },
        ],
        EditGroupView:false,
        editGroupInfo:{
          prjTgName:''
        },
        gridApi: null,
        columnApi: null,
        columnDefs:[],
        rowData:[],
        currentId:'',
        tableHeader:[]
      }
    },
    created() {
      var columnDefs=[
        {label: '任务名称', prop: 'prjTaskName',width:400},
        {label: '任务状态', prop: 'taskStatus'},
        {label: '分配人', prop: 'assigneeName'},
        {label: '执行人', prop: 'executorName'},
        {label: '开始时间', prop: 'startDate'},
        {label: '截止日期', prop: 'endDate'},
      ]
      var tableHeader=[]
      if(localStorage.getItem('tableHeader')&&JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$route.name+this.$options.name)){
        tableHeader=JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$route.name+this.$options.name).tableHeader
      }
      if(tableHeader.length==0){
        this.preferenceList =columnDefs

      }else {
        this.preferenceList=tableHeader
      }

      this.columnDefs=[...this.defaultcolumnDefs,...this.preferenceList.filter(item=>item.prop!='sid'&&item.prop!='prjTgName').map(item=>
      {
        if(!item.prop.includes('Date')){
          return {
            headerName: item.label,
            field: item.prop,
            width:this.getLoactionWidth(item.label)=='auto'?200:this.getLoactionWidth(item.label),
            resizable: true,
            sortable: true,
            filter: 'agSetColumnFilter',
            cellRenderer:this.cellRenderer,
            menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
            filterParams: {
              newRowsAction: 'keep',
              comparator: (a, b)=>{
                return this.$commonUtils.sort(a,b,item.field)
              },
            }
          }
        }else {
          return {
            headerName: item.label,
            field: item.prop,
            width:this.getLoactionWidth(item.label)=='auto'?200:this.getLoactionWidth(item.label),
            resizable: true,
            sortable: true,
            filter: 'agDateColumnFilter',
            cellRenderer:this.cellRenderer,
            menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
            filterParams: {
              buttons: ['apply', 'reset'],
              // newRowsAction: 'keep',
              comparator: function (filterLocalDateAtMidnight, cellValue) {
                var dateAsString = cellValue;
                if (dateAsString == null) return -1;
                // var dateParts = dateAsString.split('/');
                // var cellDate = new Date(
                //   Number(dateParts[2]),
                //   Number(dateParts[1]) - 1,
                //   Number(dateParts[0])
                // );
                var cellDate = new Date(cellValue.replace(/-/g,'/'))
                if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                  return 0;
                }
                if (cellDate < filterLocalDateAtMidnight) {
                  return -1;
                }
                if (cellDate > filterLocalDateAtMidnight) {
                  return 1;
                }
              },
              browserDatePicker: true,
              minValidYear: 2000,
            }
          }
        }

      })]
      this.tableHeader=this.preferenceList.map(item=>({label:item.label, prop:item.prop,width: this.getLoactionWidth(item.title)}))
      if(this.tableHeader.find(item=>item.prop == 'creatorName')){
        this.tableHeader.find(item=>item.prop == 'creatorName').prop = 'assigneeName'
      }
      this.saveLocation()


    },
    mounted(){
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
    },
    methods:{
      getContextMenuItems(params){
        if(!params.node||!params.node.data){
          if(params.node.groupData.prjTgName){
           let row= this.rowData.find(item=>item.prjTgName==params.node.groupData.prjTgName)
            return [{name:'修改任务组',action:()=>{ this.modifyTaskGroup(row)}},{name:'删除任务组',action:()=>{ this.deleteTaskGroup(row)}}]
          }
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item=>({
          name: item.name,
          action: () =>{
            this[item.action](params.node.data,params.value,params.node)
          },
        }))
      },
      saveLocation(){
        if(!localStorage.getItem('tableHeader')){
          let arr=[]
          arr.push({name:this.$route.name+this.$options.name,tableHeader:this.tableHeader})
          localStorage.setItem('tableHeader',JSON.stringify(arr))
        }else {
          let arr=JSON.parse(localStorage.getItem('tableHeader'))
          if(arr.find(item=>item.name==this.$route.name+this.$options.name)) {
            arr.find(item => item.name==this.$route.name+this.$options.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader',JSON.stringify(arr))
          } else {
            arr.push({name:this.$route.name+this.$options.name,tableHeader:this.tableHeader})
            localStorage.setItem('tableHeader',JSON.stringify(arr))
          }
        }
      },
      rowSelected(params){
        this.rowClicked(params)
      },
      rowDbClick(params){
        if(params.event.target.getAttribute("class")&&params.event.target.getAttribute("class").includes('dot-btn') || params.event.target.getAttribute("class")&&params.event.target.getAttribute("class").includes('el-icon-more'))return;
        params.data&&this.$emit('dbclick',params)
        // this.auditTaskTwo('查看', params)
      },
      rowClicked(params){
        // if(!(params.event.target.getAttribute("class")&&params.event.target.getAttribute("class").includes('dot-btn') || params.event.target.getAttribute("class")&&params.event.target.getAttribute("class").includes('el-icon-more'))){
        //   this.$store.commit('caseInformation/SET_TASK_INDEX', 0)
        //   return
        // };
        // this.$store.commit('caseInformation/SET_TASK_INDEX', params.data.prjTaskId)
        // if(!(params.node&&params.node.data)){
        //   return
        // }
        // if(this.pattern){
        //   if(params.node.selected){
        //     if(params.data['prjTaskId']!=this.currentId){
        //       this.currentId=''
        //       this.$nextTick(()=>{
        //         this.currentId=params.data['prjTaskId']
        //       })
        //     }
        //   }
        // }else {
        //   if(params.node.selected) {
        //     this.editFun(params.data)
        //   }
        // }


      },
      modifyTaskGroup(row){
        this.editGroupInfo.prjTgName=row.prjTgName
        this.editGroupInfo.prjTgId=row.prjTgId
        this.EditGroupView=true
      },
      editTaskGroup(a, b) {
        if(!this.editGroupInfo.prjTgName){
          this.$message.error('请填写任务组名称')
          return
        }
        modifyProjectTaskGroup({
          caseId:this.caseId,
          prjTgId: this.editGroupInfo.prjTgId,
          prjTgName: this.editGroupInfo.prjTgName,
        }).then(res=>{
          this.$message.success('修改成功！')
          this.$emit('update')
          this.EditGroupView = false
          this.rowData.forEach(item=>{
            if(item.prjTgId==this.editGroupInfo.prjTgId){
              item.prjTgName=this.editGroupInfo.prjTgName
            }
          })
        }).catch(()=>{
          this.$message.error('修改失败！')
          this.editGroupInfo.prjTgName = ''
          this.EditGroupView = false
        })
      },
      deleteTaskGroup(item) {
        this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          deleteProjectTaskGroup({prjTgId: item.prjTgId}).then(()=>{
            this.$message.success('删除成功！')

          })
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      getLoactionWidth(label){
        if(!localStorage.getItem('tableHeader')){
          return 'auto'
        } else {
          var arr= JSON.parse(localStorage.getItem('tableHeader'))
          if(arr.find(item=>item.name==this.$route.name+this.$options.name)){
            var header=arr.find(item=>item.name==this.$route.name+this.$options.name).tableHeader
            if(header.find(item=>item.label==label)){
              return header.find(item=>item.label==label).width
            } else {
              return 'auto'
            }
          } else {
            return 'auto'
          }
        }
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
      },
      cellRenderer(params){
        if(params.colDef.field=='sid'){
          return params.rowIndex+1
        }
        if(params.colDef.field=='handle'){
          const h = vm.$createElement;
          let vnode=h(taskHandle,{
            props: {
              items:params.data,
              userId:this.$store.getters.userId,
              rowIndex:params.rowIndex,
              page:'taskManage'
            },

          })
          const div = document.createElement('div');
          vm.__patch__(div,vnode,true,false)
          return div
        }
        return  `<span title="${params.value}">${params.value?params.value:''}</span>`
      },
      dragStopped(params){
        let tableHeader=params.columnApi.columnController.gridColumns.map(item=>({
          label:item.colDef.headerName,
          width:item.actualWidth,
          prop:item.colDef.field,
        })).filter(item=>item.prop!="group")
        var arr=JSON.parse(localStorage.getItem('tableHeader'))
        arr.find(item=>item.name==this.$route.name+this.$options.name).tableHeader=tableHeader
        localStorage.setItem('tableHeader',JSON.stringify(arr))
        // this.changeHeader(tableHeader)
      },
      getRowContextmenuList(row){
        return [
          { name:'复制',action: 'copy' },
          // { name: '修改', action: 'editFun'},
          // { name: '删除', action: 'delCase'},
        ]

      },
      copy(row, value) {
        if(value){
          this.$copyText(value).then(
            res => {
            })
        }
      },
      editFun(row){
        this.$router.push({name:'taskDetail',query:{prjTaskId:row.prjTaskId}})
      },
      delCase(row) {
        this.$confirm("此操作将删除该项目, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteProjectTask({ prjTaskId: row.prjTaskId })
              .then(res => {
                this.rowData=this.rowData.filter(item=>item.prjTaskId!=row.prjTaskId)
              })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      selectDefaultNode(){
        setTimeout(()=>{
          // if(this.pattern){
          //   if(this.gridApi.rowModel.rootNode.childrenAfterFilter.length){
          //     this.gridApi.rowModel.rootNode.childrenAfterFilter[0].childrenAfterFilter[0].setSelected(true)
          //     // this.rowClicked( this.gridApi.rowModel.rootNode.childrenAfterFilter[0].childrenAfterFilter[0])
          //   }
          // }
        })
      }
    },
    watch:{
      caseData:{
        handler(n){
          // console.log(n,'casedata')
          if(n){
            this.rowData =  n.reduce((pre,next)=>{
              if(!next.taskList){
                next.taskList=[]
              }
              next.taskList.forEach(item=>{
                item.prjTgId= next.prjTgId
                item.prjTgName= next.prjTgName
              })
              return [...pre,...next.taskList]
            },[])
            // this.selectDefaultNode()
          }else {
            this.rowData =[]
          }

        },
      }
    },
    computed:{
      // ...mapState({
      //   'pattern' : state => state.user.pattern,
      // }),
      clientHeight(){
        return document.documentElement.clientHeight-250
      },
    },
    components:{
      // taskDetail,
      taskHandle

    }
  }
</script>

<style lang="scss" scoped>
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
