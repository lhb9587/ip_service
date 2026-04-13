<template>
  <div class="poppingTimeLimit" style="padding:0 20px;margin-top: -10px">
    <h4 class="title">案件信息</h4>
    <div style="max-height:200px">
    <!-- <el-table ref="caseTable" :row-class-name="({row, rowIndex})=>{return tableRowClassName({row, rowIndex},'case')}" @select="caseSelectionChange" :data="caseData.filter(item=>!!item.caseId)" border class="el-table1" maxHeight="200">
      <el-table-column
          v-if="isPatent"
          type="selection"
          width="55">
        </el-table-column>
      <el-table-column type="index" width="60" label="序号" align="left">
      </el-table-column>
      <el-table-column align="left" :key="item.title" v-for="item,index in tableTitleList" :label="item.title" :prop="item.value" :width="item.width">
        <template slot-scope="scope">
          <span :title="scope.row[item.value]">{{scope.row[item.value]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  align="left" width="90">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="editTimelimit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <AgGridVue
      class="ag-theme-balham"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :rowData="caseData.filter(item=>!!item.caseId)"
      :localeText="$store.state.caseInformation.localeText"
    ></AgGridVue>
    </div>
    <h4  class="title">时限列表</h4>
    <div style="max-height:200px">
      <el-table ref="patentTable" :data="timelimitArr" :row-class-name="({row, rowIndex})=>{return tableRowClassName({row, rowIndex},'time')}" @select="pantentSelectionChange" border class="el-table1" maxHeight="200">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="index" width="60" label="序号" align="left">
        </el-table-column>
        <el-table-column align="left" :key="item.title" v-for="item,index in patentTitleList" :label="item.title" :prop="item.value" :width="item.width">
          <template slot-scope="scope">
            <span :title="scope.row[item.value]">{{scope.row[item.value]}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作"  align="left" width="90">
          <template slot-scope="{row}">
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <h4 class="title">时限信息</h4>
    <section>

      <el-form  ref="submission" :rules="rules" :model="timelimitInfo" label-width="206px"  >
        <el-row style="border-right: 1px solid #EBEEF5;border-top: 1px solid #EBEEF5">
          <el-form-item label="案件文号:"  class="small-el-form-item" style="border:0">
            {{timelimitInfo.agentNum}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="时限种类:" prop="kind">
            <el-radio-group disabled v-model="timelimitInfo.kind" @change="getTimelimitType" ref="elRadio">
              <el-radio  :label="1">官方时限</el-radio>
              <el-radio  :label="2">内部时限</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="时限类型:" prop="tltTypeId" >
            <el-select v-model="timelimitInfo.tltTypeId" placeholder="请选择时限类型" filterable @change="(n) => {changeTltTypeId(n)}"
                       clearable >
              <el-option
                v-for="item in getTimelimitTypeAllList"
                :key="item.tltTypeId"
                :label="item.typeName"
                :value="item.tltTypeId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="时限内容:" >
            <el-input
              type="text"
              placeholder="请输入内容"
              v-model="timelimitInfo.caption"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="详细说明:" >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="timelimitInfo.decription"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <el-row >
          <el-form-item label="计算基准日期:"  class="sendDate">
            <el-date-picker
              @change="getAbslimitDate"
              v-model="timelimitInfo.sendDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="绝限日期:" prop="abslimitDate" class="abslimitDate">
            <el-date-picker
              v-model="timelimitInfo.abslimitDate"
              type="date"
              @change="absLimitChange"
              :disabled="!$store.getters.permissions.includes(249)&&timelimitInfo.kind==1"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="内部期限:"  prop="abslimitInternalDate">
            <el-date-picker
              v-model="timelimitInfo.abslimitInternalDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="时限工作组:" >
            <template slot="label">
             <span style="display: block">时限工作组</span>
              <el-button  size="small"  @click="addTimelimitWorkgroupArray" type="primary">添加</el-button>
            </template>
            <el-table class="el-table2" :data="timelimitInfo.workgroupArray" border style="width: 98%">
              <el-table-column align="left" label="时限工作组" width="300">
                <template slot-scope="scope">
                  <el-select v-model="timelimitInfo.workgroupArray[scope.$index].wrkId" placeholder="请选择时限工作组" filterable
                             clearable  @change="(e)=>getTimelimitInfoWkgUsers(e,scope.$index)">
                    <el-option
                      v-for="item in queryWorkgroupNamesList"
                      :key="item.wkgId"
                      :label="item.groupName"
                      :value="item.wkgId">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="left" label="时限成员" width="400">
                <template slot-scope="scope" >
                  <virtual-select class="virtual-select" :isUser="true" clearable multiple   :data="$store.getters.userList" v-model="timelimitInfo.workgroupArray[scope.$index].timelimitUserArray"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
                  </virtual-select>
<!--                  <el-select v-model="timelimitInfo.workgroupArray[scope.$index].timelimitUserArray" placeholder="请选择时限成员" filterable-->
<!--                             multiple  clearable >-->
<!--                    <el-option-->
<!--                      v-for="item in queryGetUserList"-->
<!--                      :key="item.userId"-->
<!--                      :label="item.fullname"-->
<!--                      :value="item.userId">-->
<!--                      <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--                    </el-option>-->
<!--                  </el-select>-->
                </template>
              </el-table-column>
              <el-table-column label="操作"  align="left" >
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="timelimitInfo.workgroupArray.splice(scope.$index,1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-row>
<!--        <el-row v-else>-->
<!--          <el-form-item label="时限成员:" class="time-user">-->
<!--            <el-select v-model="timelimitInfo.tltUserIdList" placeholder="请选择时限成员" filterable-->
<!--                             multiple  clearable >-->
<!--                    <el-option-->
<!--                      v-for="item in queryGetUserList"-->
<!--                      :key="item.userId"-->
<!--                      :label="item.fullname"-->
<!--                      :value="item.userId">-->
<!--                      <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--                    </el-option>-->
<!--                  </el-select>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
        <planList ref="planlist" :timelimitInfo="timelimitInfo" :queryGetUserList="queryGetUserList" @getData="getData"></planList>
        <!--<el-row>-->
        <!--<el-form-item label="提醒计划:">-->

        <!--</el-form-item>-->
        <!--</el-row>-->

        <el-row>

            <el-form-item label="备注:">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="timelimitInfo.memo"
              >
              </el-input>
            </el-form-item>

          <el-form-item label="上传时间:">
            {{new Date().toLocaleDateString()}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="监督人:">
            <el-select :disabled="!$store.getters.permissions.includes(249)&&timelimitInfo.kind==1" v-model="timelimitInfo.watcherUserIdArray" placeholder="请选择监督员工" filterable
                       multiple clearable >
              <el-option
                v-for="item in queryGetUserList"
                :key="item.userId"
                :label="item.fullname"
                :value="item.userId">
                <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建人:">
            {{$store.getters.name}}
          </el-form-item>
        </el-row>
      </el-form>
    </section>
    <div class="button_wrap" >
<!--      <el-popover-->
<!--        placement="top"-->
<!--        width="260"-->
<!--        v-model="visible">-->
<!--        <p>该操作将会覆盖所有案件,确定要复制吗？</p>-->
<!--        <div style="text-align: right; margin: 0">-->
<!--          <el-button size="mini" type="text" @click="visible = false">取消</el-button>-->
<!--          <el-button type="primary" size="mini" @click="visible = false,copyAllCase()">确定</el-button>-->
<!--        </div>-->
<!--        <el-button v-if="!isPatents" slot="reference" class="exactButton" >复制</el-button>-->
<!--      </el-popover>-->
      <el-button class="exactButton" type="primary" @click="confirmExactButton" >创建</el-button>
      <el-button class="exactButton" style="margin-right: 20px" @click="cancel()" v-if="officialCommunication">不创建</el-button>
    </div>
  </div>
</template>

<script>
  import {addTimelimit,getCase,delTimelimit,upTimelimit,getTimelimitByCaseId,getTimelimitTypeAll,getTimelimitDetail,getTimelimitType, getAbslimitDate, getCaption, getTimelimitObj} from '@/api/caseList'
  import { queryWorkgroupNames} from '@/api/systemList'
  import {queryCaseWorkgroupUrl} from '@/api/caseDetail'
  import { getUser } from '@/api/user'
  import {getEndDate} from '@/utils'
  import timeLimit from "./timeLimit";
  import planList from "./components/planList";
  export default {
    props:{
      isPatent: {
        default:false
      },
      list:{

      },
        officialCommunication:{
        default: false
      },
      disabled: {
        default: false
      }
    },
    name: "createTimeLimit",
    components:{
      planList
    },
    computed:{
      isPatents(){
        return this.isPatent || this.timelimitInfo.tltTypeId&&this.getTimelimitTypeAllList.find(item=>this.timelimitInfo.tltTypeId==item.tltTypeId)&&this.getTimelimitTypeAllList.find(item=>this.timelimitInfo.tltTypeId==item.tltTypeId).memo == '专利';
      }
    },
    data(){
      var validateDate = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择时间'));
        } else {
          callback();
        }
      };
     let timeLimitInfo={
       abslimitDate: null,
       abslimitInternalDate: null,
       agentNum: '',
       appDate: null,
       appFromto: null,
       appState: null,
       applicantName: null,
       caption: null,
       caseDate: null,
       caseId: '',
       caseIdArray: null,
       caseName: null,
       caseStatus: null,
       caseTypeId: null,
       caseTypeName: null,
       cmplDate: null,
       createDate: null,
       custId: '',
       custName: null,
       dataSource: null,
       decription: null,
       droitNumber: null,
       execUserId: null,
       fromSource: null,
       goodClasses: null,
       isExamine: null,
       isRevocation: null,
       isSign: null,
       isSignStr: null,
       isSubmitWriteoff: null,
       kind: null,
       kindStr: null,
       materialArray: [],
       materialIds: null,
       memo: null,
       objInstId: null,
       objType: null,
       rempId: null,
       sendDate: null,
       senderUserId: null,
       senderUserName: null,
       stageName: null,
       timeWorks: null,
       timelimitWorkgroupArray: [],
       tltId: null,
       tltIdArray: null,
       tltIds: null,
       tltTypeId: null,
       tmGoodClasses: null,
       typeName: null,
       undoDate: null,
       undoUserId: null,
       upcaseVolstatusId: null,
       watcherUserIdArray: [],
       watcherUserIds: "",
       watcherUserNmaes: null,
       workgroupArray: [],
       wpmElemid: null,
       writeoffDate: null,
       writeoffDesc: null,
       writeoffState: null,
       writeoffStateStr: null,
       writeoffUserId: null,
       writeoffUserName: null,
     }
      return{
        limitIndex:0,
        columnDefs: [
        {
          headerName: "序号",
          field: "number",
          width: 80,
          cellRenderer: params => {
          return params.node.rowIndex + 1; // 添加1，使序号从1开始
        }
        },
        {
          headerName: "案件文号",
          field: "agentNum",
          width:150
        },
        {
          headerName: "客户",
          field: "custName",
        },
        { headerName: "案件类型", field: "caseTypeStr" },
        { headerName: "申请方向", field: "appFromto",width:100 },
        { headerName: "申请日（优先权日）", field: "appDate" },
        { headerName: "权利号", field: "droitNumber" },
        { headerName: "案件名称", field: "caseName" },
        { headerName: "类别", field: "goodClasses",width:80 },
        {
        headerName: "操作",
        field: "handle",
        width: 80,
        pinned: "right",
        cellRenderer: params => {
          if (params.colDef.field === "handle") {
            const editClick = (index) => {
              console.log(index,'index');
              this.editTimelimit(index)
            };
            window.editClick = editClick;
            // const list = JSON.stringify(params.data).replace(/\"/g,"'")
            return `
              <div>
                <span style="color: #4A8DDC;cursor: pointer" onclick="editClick(${params.node.rowIndex})">编辑</span>
              </div>
            `;
          }
        }
      }
      ],
       caseRow:{},
       timelimitArr: [],
        visible:false,
        caseData:[],
        patentTitleList:[
        {'title':'案件文号','value':'agentNum'},
          // {'title':'案件名称','value':'caseName'},
          // {"title":"客户","value":"custName" },
        // {"title":"申请人","value":"applicantName" },
        //   {"title":"时限类型","value":"typeName" },
          {"title":"绝限日期","value":"abslimitDate" },
          {"title":"创建时间","value":"createDate" },
          // {"title":"创建人","value":"senderUserName" },
          // {"title":"时限状态","value":"isSign" }
          ],
        tableTitleList:[{'title':'案件文号','value':'' ,'width':150},{'title':'客户','value':'custName' },{'title':'案件类型','value':'caseTypeStr'},{'title':'申请方向','value':'appFromto',width:80},{'title': '申请日（优先权日）', 'value': 'appDate'},{'title':'权利号','value':'droitNumber'},{'title':'案件名称','value':'caseName'},{'title':'类别','value':'goodClasses',width:80}],
        defaultTimelimitInfo:JSON.parse(JSON.stringify(timeLimitInfo)),
        timelimitInfo:timeLimitInfo,
        getTimelimitTypeAllList:[],
        queryWorkgroupNamesList:[],
        queryGetUserList:[],
        rules: {
          kind: [
            { required: true, message: '请选择时限种类', trigger: ['change','blur'] }
          ],
          tltTypeId: [
            { required: true, message: '请选择时限类型', trigger: ['change','blur'] }
          ],
          abslimitDate: [
            { type: 'date', required: true, message: '请选择绝限日期', trigger: 'blur' ,validator: validateDate,}
          ],
          abslimitInternalDate: [
            { type: 'date', required: true, message: '请选择内部期限', trigger: 'blur',validator: validateDate, }
          ]
        },
        hasCaseState:true
      }
    },
    created(){
      console.log(this.list,'this.list');
      this.caseData=this.list
      if(this.caseData.length){
        this.caseData.forEach(item => {
          if (item.timelimitList && !item.timelimitList.length) {
            item.timelimitList = [item.timelimit || {}]
          }
          item.timelimitList && item.timelimitList.forEach((item, index) => {
            item.sid = index + 1
          })
        })
        this.timelimitInfo = this.caseData[0].timelimitList[0]
        this.timelimitArr = this.caseData[0].timelimitList&&this.caseData[0].timelimitList.length ? this.caseData[0].timelimitList : [this.caseData[0].timelimit]
        console.log(this.timelimitArr,'this.timelimitArr');
        console.log(this.timelimitInfo,'this.timelimitInfo');
        if(this.isPatent){
          this.timelimitArr = this.caseData[0].timelimitList
          this.caseData.forEach(item => {
            item.timelimitList && item.timelimitList.forEach(j => {
              if (j.workgroupArray && !j.workgroupArray.length && j.tltUserIdList && j.tltUserIdList.length) {
                j.workgroupArray.push({
                  timelimitUserArray: j.tltUserIdList,
                  wrkId: ''
                })
              }
            })
          })
        }
        if(this.timelimitInfo.watcherUserIdArray && this.timelimitInfo.watcherUserIdArray.length == 0 && this.timelimitInfo.watcherUserIds){
          this.timelimitInfo.watcherUserIdArray = this.timelimitInfo.watcherUserIds.split(',')
        }
        // this.editTimelimit(this.caseData[0])
        // this.timelimitInfo=
        // this.$set(this.caseData[0].timelimit,'successState',2)
      }
      this.getTimelimitTypeAll()
      this.queryWorkgroupNames()
      this.getUser()
    },
    mounted() {

    },
    methods:{
      changeTltTypeId(n){
        // if (n === 300263 && this.caseData[0].appFromto === '内-内' && this.caseData[0].caseTypeId === 63) {
        //   this.timelimitInfo.kind = 2
        // } else {
        //   this.timelimitInfo.kind = 1
        // }
        this.getAbslimitDate(this.timelimitInfo.sendDate,n,true)
      },
      onGridReady(params) {
        // 表格自适应
        // params.api.sizeColumnsToFit();
      },
      caseSelectionChange(selection,row){
        this.caseRow = row
        if(!selection.length)return;
          // this.$refs.caseTable.clearSelection()
        // this.timelimitArr = JSON.parse(JSON.stringify(row.timelimitList))
        this.timelimitArr = row.timelimitList
        this.timelimitInfo = this.timelimitArr[0]
        this.$nextTick(()=>{
          this.$refs.patentTable.toggleRowSelection(this.timelimitArr[0],true)
          // this.$refs.caseTable.toggleRowSelection(row,true)
        })
      },
      pantentSelectionChange(selection,row){
        if(!selection.length)return;
        this.timelimitInfo = row
        const limitIndex = this.timelimitArr.findIndex(item => item === row);
        console.log(limitIndex,'limitIndex');
        this.limitIndex = limitIndex
        this.$nextTick(()=>{
          this.$refs.patentTable.clearSelection()
          this.$refs.patentTable.toggleRowSelection(row,true)
          // this.$refs.caseTable.toggleRowSelection(this.caseRow,true)
        })
      },
      absLimitChange(n){
        this.timelimitInfo.abslimitInternalDate=getEndDate(n,-1,'天')
      },
      getData(data){
        this.timelimitInfo.rempId=data.rempId
        this.timelimitInfo.planList=data.planList
      },
      copyAllCase(){
        if(!this.isPatent){
          let data = this.caseData.find(item=>item.timelimit.abslimitDate)
          this.caseData.forEach(item=>{
            for(var key in data.timelimit){
              item.timelimit[key]=data.timelimit[key]
            }

            // this.$set(item.timelimit,'successState',1)
          })
        }else{

        }

      },
      tableRowClassName({row, rowIndex},flag) {
        // if(this.isPatent){
          if(flag == 'time'){
            if (row.abslimitDate && row.workgroupArray.find(i => i.timelimitUserArray.length)) {
              return 'success-row'
            }
            return 'warning1-row'
          }else if(flag == 'case'){
            if(!row.timelimitList.some(i=>!i.abslimitDate)){
              return 'success-row'
            }
            return 'warning1-row'
          }
        // }
        // else{
          // if (row.timelimit.successState === 2) {
          //   return 'warning1-row';
          // } else if (row.timelimit.successState === 1) {
          //   return 'success-row';
          // }
        // }
        // return '';
      },
      delTimelimit(row){
        if(this.timelimitInfo.caseId==row.caseId){
          this.timelimitInfo=this.defaultTimelimitInfo
        }
        this.caseData=this.caseData.filter(item=>item.caseId!==row.caseId)
      },
      editTimelimit(index){
        const row = this.caseData[index] || {}
        console.log(row,'row');
        this.limitIndex = 0
        this.timelimitArr = row.timelimitList
        this.timelimitInfo = row.timelimitList[0] ? row.timelimitList[0] : row.timelimit
        this.$nextTick(() => {
          this.$refs.patentTable.clearSelection()
          this.$refs.patentTable.toggleRowSelection(this.timelimitArr[0],true)
        })
        // this.$set( row.timelimit,'successState',2)

      },
      getTimelimitTypeAll(){
        getTimelimitTypeAll().then(res=>{
          this.getTimelimitTypeAllList=res.data
          this.$nextTick(()=>{
            this.caseRow = this.caseData[0]
            // this.isPatent&&this.$refs.caseTable.toggleRowSelection(this.caseData[0],true)
            this.$refs.patentTable.toggleRowSelection(this.timelimitArr[0],true)
          })
        })
      },
      getTimelimitInfoWkgUsers(e,index){
        this.timelimitInfo.workgroupArray[index].timelimitUserArray = [...new Set(this.queryWorkgroupNamesList.find(item=>item.wkgId==e).wkgUsers.map(item=>item.userId))]
      },
      queryWorkgroupNames(){
        queryCaseWorkgroupUrl({status:1}).then(res => {
          this.queryWorkgroupNamesList = res.data
        })
      },
      getTimelimitType(kind){
        getTimelimitType({
          kind:kind,
          caseId:this.timelimitInfo.caseId
        }).then(res=>{
          this.timelimitInfo.tltTypeId=null
          this.getTimelimitTypeAllList=res.data
        })
        // this.isPatents ? this.getWangZhenZhu(kind) : this.getCuiXin(kind)
        if(this.caseData.length){
          if(this.caseData[0].taskType == 1) {
            this.getCuiXin(kind)
          }else if(this.caseData[0].taskType == 4) {
            this.getWangZhenZhu(kind)
          }
        }
      },
      getCuiXin(kind){
        if(this.isPatent)return;
        if(kind==1){
          if(this.timelimitInfo.watcherUserIdArray.includes(2837)){
            return
          }else {
            this.timelimitInfo.watcherUserIdArray.push(2837)
          }
        }else if(kind==2){
          if(this.timelimitInfo.tltTypeId==83){
            if(this.timelimitInfo.watcherUserIdArray.includes(2837)){
              return
            }else {
              this.timelimitInfo.watcherUserIdArray.push(2837)
            }
          }else {
            if(this.timelimitInfo.watcherUserIdArray.includes(2837)){
              this.timelimitInfo.watcherUserIdArray.splice( this.timelimitInfo.watcherUserIdArray.indexOf(2837),1)
            }
          }
        }
      },
      getWangZhenZhu(kind){
        if(this.timelimitInfo.watcherUserIdArray.includes(2837)) {
          this.timelimitInfo.watcherUserIdArray.splice(this.timelimitInfo.watcherUserIdArray.indexOf(2837), 1)
        }
        if(this.timelimitInfo.watcherUserIdArray.includes(4255)){
          return
        }
        this.isPatent && this.timelimitInfo.watcherUserIdArray.push(4255)
      },
      async getAbslimitDate(sendDate,id,flag){
        if(flag){
          id&& await getTimelimitObj({caseId: this.timelimitInfo.caseId,objInstId: this.timelimitInfo.objInstId,objType: this.timelimitInfo.objType, tltTypeId: this.timelimitInfo.tltTypeId}).then(res=>{
            this.timelimitInfo.abslimitDate = res.data.abslimitDate || ''
            this.timelimitInfo.sendDate = res.data.sendDate || ''
            // 对kind赋值
            this.timelimitInfo.kind = res.data.kind
            // if (id === 300263 && this.caseData[0].appFromto === '内-内' && this.caseData[0].caseTypeId === 63) {
            //   this.timelimitInfo.kind = 2
            // }
          })
          if((this.timelimitInfo.tltTypeId != 118)&&this.getTimelimitTypeAllList.find(item=>this.timelimitInfo.tltTypeId==item.tltTypeId)){
            this.timelimitInfo.caption=this.getTimelimitTypeAllList.find(item=>this.timelimitInfo.tltTypeId==item.tltTypeId).typeName
          }
        }

        if(!this.timelimitInfo.kind){
          return
        } else {
          // this.isPatents ? this.getWangZhenZhu(this.timelimitInfo.kind) : this.getCuiXin(this.timelimitInfo.kind)
          if(this.caseData.length){
            if(this.caseData[0].taskType == 1) {
              this.getCuiXin(this.timelimitInfo.kind)
            }else if(this.caseData[0].taskType == 4) {
              this.getWangZhenZhu(this.timelimitInfo.kind)
            }
          }
        }
        if(!this.timelimitInfo.sendDate){
          return
        }
        if(!this.timelimitInfo.tltTypeId){
          return
        }
        getAbslimitDate({
          sendDate: this.timelimitInfo.sendDate,
          tltTypeId:this.timelimitInfo.tltTypeId,
          kind:this.timelimitInfo.kind,
          caption: this.timelimitInfo.tltTypeId == 118 ? this.timelimitInfo.caption : undefined, // 年费时限需要传该参数
          caseId: this.timelimitInfo.caseId
        }).then(res=>{
          this.timelimitInfo.abslimitDate = res.data.abslimitDate
          this.absLimitChange(this.timelimitInfo.abslimitDate)
          // this.timelimitInfo.abslimitInternalDate=res.data.abslimitInternalDate?res.data.abslimitInternalDate:
          if (this.isPatent && this.timelimitInfo.sid == 1 && this.timelimitArr[1] && this.timelimitArr[1].tltTypeId == 300274) { // 专利das时限
            this.$set(this.timelimitArr[1], 'sendDate', this.timelimitInfo.abslimitDate)
            getAbslimitDate({
              sendDate: this.timelimitArr[1].sendDate,
              tltTypeId: 300274,
              kind: this.timelimitArr[1].kind,
              caseId: this.timelimitArr[1].caseId
            }).then(r => {
              this.$set(this.timelimitArr[1], 'abslimitDate', r.data.abslimitDate)
            })
          }
        })

      },
      addTimelimitWorkgroupArray(){
        this.timelimitInfo.workgroupArray.push({
          timelimitUserArray: [],
          wrkId: ''
        })
      },
      getUser(){
        this.queryGetUserList = this.$store.getters.userList
      },
      confirmExactButton(){
        console.log('执行！！！');
        if(!this.isPatent){
          this.$refs['submission'].validate((valid) => {
            if (valid) {
              let result = true
              this.caseData.forEach(item=>{
                if(item.timelimitList.some(i=>!i.abslimitDate)){
                  this.$message.error('有案件的绝限日期未填写,可使用复制按钮赋值全部案件属性')
                  result = false
                  return
                }
                item.timelimitList.forEach(i => {
                  if (!i.workgroupArray.find(j => j.timelimitUserArray.length)) {
                    this.$message.error('有时限的时限成员未填写')
                   result = false
                  }
                })
              })
              result && this.addTimelimit()
              // if(this.caseData.length!==this.caseData.filter(item=>!!item.timelimit.abslimitDate).length){
              //   this.$message.error('有案件的绝限日期未填写,可使用复制按钮赋值全部案件属性')
              // } else {
              //   this.addTimelimit()
              // }
            } else {
              return false;
            }
          });
        }else{
          this.$refs['submission'].validate((valid) => {
            if (valid) {
              let result = true
              console.log(this.caseData,'this.caseData');
              
              this.caseData.forEach(item=>{
                if(item.timelimitList.some(i=>!i.abslimitDate)){
                  this.$message.error('有时限的绝限日期未填写')
                  result = false
                  return
                }
                item.timelimitList.forEach(i => {
                  if (!i.workgroupArray.find(j => j.timelimitUserArray.length)) {
                    this.$message.error('有时限的时限成员未填写')
                   result = false
                  }
                })
              })
              result && this.addTimelimit()
              // if(this.caseData.length!==this.caseData.filter(item=>!!item.timelimit.abslimitDate).length){
              //   this.$message.error('有案件的绝限日期未填写,可使用复制按钮赋值全部案件属性')
              // } else {
              //   this.addTimelimit()
              // }
            } else {
              return false;
            }
          });
        }

      },
      checkPlanUsers(){
        if (this.timelimitInfo.rempId && (!this.timelimitInfo.planList || this.timelimitInfo.planList &&this.timelimitInfo.planList[0] && !this.timelimitInfo.planList[0].userIdList.length)) {
          this.$message.error("请增加提醒计划提醒人！")
          return false
        }
        return true
      },
      addTimelimit(){
        // if(!this.isPatent){
        //   this.caseData.forEach(i=>{
        //     if(i.hasOwnProperty('timelimitList')){
        //       delete i.timelimitList
        //     }
        //   })
        // }
        //  校验提醒计划人
        if (!this.checkPlanUsers()) return
        console.log('执行~！~~~');
        addTimelimit({caseInfoArray: this.caseData.map(item => ({
            timelimitList: item.timelimitList,
            // timelimit: item.timelimit,
            caseId: item.caseId,
            agentNum: item.agentNum,
            custId: item.custId
          }))}).then(res=>{
            console.log(res,'resssssssss');
            this.$emit('cancel')
          console.log(res,'cancel success成功');
        })
      },
      cancel(){
        this.$emit('cancel')
      }
    },
    watch:{
      isPatents(n){
        n&&this.timelimitInfo.kind&&this.getWangZhenZhu(this.timelimitInfo.kind)

        !n&&this.timelimitInfo.watcherUserIdArray.includes(4255)&&(this.timelimitInfo.watcherUserIdArray.splice(this.timelimitInfo.watcherUserIdArray.indexOf(4255), 1))
      },
      caseRow(n){

      },
      'timelimitInfo.workgroupArray':{
        handler(n){
           if(n.find(item => item.timelimitUserArray)){
             this.$refs.planlist.changePeople(n)
           }
        },
        // immediate: true,
        deep: true
      },
      timelimitInfo:{
        handler(n){
          this.$nextTick(()=>{
            // this.isPatent&&this.$refs.caseTable.toggleRowSelection(this.caseRow,true)
            this.caseData.forEach((item,index)=>{
              if (this.timelimitInfo.caseId==item.caseId) {
                this.caseData[index].timelimitList[this.limitIndex] = this.timelimitInfo
              }
            })
          })
        },
        deep:true

      },
      'timelimitInfo.tltTypeId'(n){
        if(n == 118) {
          this.timelimitInfo.caseId&&(getCaption({caseId: this.timelimitInfo.caseId}).then(res=>{
            this.timelimitInfo.caption = res.data.caption
            this.timelimitInfo.abslimitDate=res.data.abslimitDate
            this.timelimitInfo.sendDate=res.data.sendDate
            // this.getAbslimitDate(this.timelimitInfo.sendDate,n,true)
          }))
        }else{
          // this.getAbslimitDate(this.timelimitInfo.sendDate,n,true)
        }
      },
      'timelimitInfo.abslimitDate'(n){
        n&&!this.timelimitInfo.abslimitInternalDate&&(
          this.timelimitInfo.abslimitInternalDate=getEndDate(n,-1,'天')
        )
      }
    }
  }
</script>

<style lang="scss" scoped>
  aside{
    &>div{
      display: flex;
      align-items: center;
      .el-textarea{
        width: 80%;
      }
      .el-button{
        margin-left: 20px;
        width: 67px;
        height: 32px;
        padding: 0;
        color: #409EFF;
        border: 1px solid #409EFF;
      }
    }
    span{
      display: block;
      margin: 10px 0;
      font-size: 12px;
      color: #FB9608;
    }

  }
  .el-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .el-select,.el-input,.el-date-picker,.el-textarea{
      width: 95%;
    }
    /deep/ input{
      height: 28px;
    }
    /deep/ .el-input__icon{
      line-height: 28px;
    }
    .el-row{
      min-height: 30px;
      width: 100%;
      display: flex;
      // align-items: center;
      .el-form-item{
        width: 100%;
        display: flex;
        border: 1px solid #EBEEF5;
        border-bottom: 0;
        margin-bottom: 0;
        /deep/ .el-form-item__label{
          background: #f5f7fa;
          flex-shrink: 0;
        }
        /deep/ .el-form-item__content{
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
          position: relative;
        }

      }
      .sendDate /deep/{
        .el-form-item__label,input{
          color: blue;
        }
      }
      .abslimitDate /deep/{
        .el-form-item__label,input{
          color: red;
        }
      }
      .small-el-form-item-prev:before{
        content: '';
        width: 50%;
        height: 1px;
        background: #EBEEF5;
        position: absolute;
        bottom: -1px;
        right: 0;
        z-index: 1;
      }
      .small-el-form-item{
        position: relative;
        width: 50%;
        /deep/ .el-form-item__content{
          flex: 1;
          .pad20{
            padding-left: 20px;
          }
        }
      }
    }
    .el-row:nth-last-child(1){
      .el-form-item{
        border: 1px solid #EBEEF5;
      }
    }
  }
  .button_wrap {
    width: 100%;
    display: flex;
    height: 85px;
    align-items: center;
    justify-content: flex-end;
    .el-button{
      margin-right: 30px;
    }
  }
  /deep/ .el-form-item__error{
    position: relative;
    top: 0;
  }
  header{
    height: 62px;
    line-height:62px;
    font-size:22px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(51,51,51,1);
  }
  .title{
    font-size: 16px;
    color: #6AA7FF;
    height: 50px;
    line-height: 50px;
    font-weight: normal;
  }
  >>>.el-table.el-table1{
    width: auto;
    margin-bottom: 10px;
    tr{
      line-height: 34px;
      th,td{
        padding-top: 0;
        padding-bottom: 0;
      }
    }
     tr:nth-of-type(1){
      th{
        background: rgba(242, 242, 242, 1);
      }
    }
  }
  .el-table2  /deep/ tr{
    line-height: 34px;
    th{
      line-height: 22px;
    }
  }

  .poppingTimeLimit{
    max-height: 90vh;
    display: flex;
    flex-direction:column ;
    section{
      flex: 1;
      overflow: auto;
    }
  }
  .el-table /deep/ .success-row {
    background: #f0f9eb
  }
  .el-table /deep/ .warning1-row {
    background: oldlace
  }
  /deep/ .el-table--enable-row-hover  .el-table__body tr:hover>td {
    background: transparent
  }
  >>>thead {
    .el-table-column--selection {
      .cell {
        display: none;
      }
    }
  }
  >>>.time-user{
    .el-input__inner{
      height: 28px!important;
    }
  }
  >>>.el-table1 {
    height: auto;
    .cell {
      max-height: 70px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }
  /deep/ .ag-theme-balham{
    width: 100%;
    height: 200px;
  }
</style>
