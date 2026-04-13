<template>
  <div>
  <el-form label-width="136px">
    <!--<div class="el-wrap">-->
    <el-form-item label="预算金额:" class="twoInputWarp">
      <el-input type="number" v-model="queryModuleData.budgetAmountStart " placeholder="请输入内容" @change="(e)=>changeTextRange(e,'budgetAmountEnd')" clearable></el-input>
      <span>至</span>
      <el-input type="number" v-model="queryModuleData.budgetAmountEnd" placeholder="请输入内容" clearable></el-input>
    </el-form-item>
    <el-form-item label="申报日期:" class="twoInputWarp">
      <!--<el-date-picker-->
        <!--v-model="queryModuleData.month"-->
        <!--type="date"-->
        <!--placeholder="开始日期"-->
        <!--value-format="yyyy-MM-dd">-->
      <!--</el-date-picker>-->
      <!--<span>至</span>-->
      <!--<el-date-picker-->
        <!--v-model="queryModuleData.month"-->
        <!--type="date"-->
        <!--placeholder="结束日期"-->
        <!--value-format="yyyy-MM-dd">-->
      <!--</el-date-picker>-->
      <DataPicker v-model="monthList"></DataPicker>
    </el-form-item>
    <el-form-item label="部门名称:">
      <el-cascader
        v-model="superiorDepartments"
        filterable
        clearable
        :change-on-select="true"
        :show-all-levels="false"
        :options="limitDepartData"
        :props="defaultParams2"
        placeholder="请选择"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="任务人:" >
      <el-select v-model="queryModuleData.optUser"  filterable
                 clearable>
        <el-option
          v-for="item in taskUserList"
          :key="item.userId"
          :label="item.optUserName"
          :value="item.userId"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="申报状态:">

      <el-select :disabled="budgetAdjustmentState===1" v-model="queryModuleData.taskStatus"  filterable
                 clearable>
        <el-option
          v-for="item in [ '待提交','待主管高级合伙人审批','主管高级合伙人退回','待管委会终审','管委会终审退回','已完成']"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="申报人:">
      <el-select v-model="queryModuleData.appUser" filterable
                 clearable>
        <el-option
          v-for="item in appUserList.filter(item=>item)"
          :key="item.userId"
          :label="item.appUserName"
          :value="item.userId"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <!--</div>-->

    <el-button type="primary" class="clearButton" size="mini"  @click="clearSearch"><img src="@/assets/清除@2x.png" alt=""><span>重置</span></el-button>
    <div class="buttonWrap">
      <el-button type="primary" size="mini"  @click="handleSearch">查询</el-button>
      <div style="display: inline-block" class="declaration">
        <el-button type="primary" size="mini"  @click="declaration" v-allow="208">预算申报</el-button>
        <div v-if="declarationState">
          <!--<el-select v-model="curdeptId" filterable-->
                   <!--clearable>-->
            <!--<el-option-->
              <!--v-for="item in departMentList"-->
              <!--:key="item.deptId"-->
              <!--:label="item.deptName"-->
              <!--:value="item.deptId"-->
            <!--&gt;-->
            <!--</el-option>-->
          <!--</el-select>-->
          <el-cascader
            v-model="curdeptId"
            filterable
            clearable
            :change-on-select="true"
            :show-all-levels="false"
            :options="departMentList"
            :props="defaultParams2"
            placeholder="请选择"
            ref="caseTypecascader"
            @change="catchange"
          ></el-cascader>
          <div class="">
            <el-button  type="primary" size="mini" @click="queryDeclaration">确定</el-button>
            <el-button  size="mini" @click="declarationState=false">取消</el-button>
          </div>
        </div>
      </div>
      <el-button type="primary" size="mini"  @click="budgetAdjustment" v-allow="209">增加/追加、预算调整</el-button>
      <el-button type="primary" size="mini"  @click="autoForward" v-allow="209">自动结转</el-button>
      <el-button type="primary" size="mini"  @click="configuration" v-allow="210">权限配置</el-button>
    </div>
  </el-form>
  <el-table
    ref="budgetDeclarationTable"
    :data="dataList"
    @select="handleSelectionChange"
    :header-cell-class-name="cellClass"
  style="width: 100%">
    <el-table-column
      type="selection"
      width="30"
      class="selection"
      v-if="budgetAdjustmentState"
    >
    </el-table-column>
    <el-table-column
      label="序号"
      type="index"
      width="50">
    </el-table-column>
    <el-table-column
      label="部门名称"
      prop="deptName"
    >
      <template slot-scope="scope">
        {{scope.row.deptName}}
      </template>
    </el-table-column>
    <el-table-column
      label="申报人"
    >
      <template slot-scope="scope">
        {{scope.row.appUserName}}
      </template>
    </el-table-column>
    <el-table-column
      label="申报日期"
    >
      <template slot-scope="scope">
        {{formatDate(scope.row.appDate)}}
      </template>
    </el-table-column>
    <el-table-column

      label="申报金额"
    >
      <template slot-scope="scope">
        {{scope.row.amount|formatAmount}}
      </template>
    </el-table-column>
    <el-table-column
      label="申报状态"
    >
      <template slot-scope="scope">
         <span v-if="!scope.row.taskStatus.includes('退回')">
           {{scope.row.taskStatus}}
        </span>
        <el-tooltip v-else class="item" effect="dark" :content="scope.row.reason" placement="top">
         <span>{{scope.row.taskStatus}}</span>
        </el-tooltip>

      </template>
    </el-table-column>
    <el-table-column
      label="任务人"
    >
      <template slot-scope="scope">
        {{scope.row.optUserName}}
      </template>
    </el-table-column>
    <el-table-column
      prop="strStatus"
      label="操作"
    >
      <template slot-scope="scope">
        <el-button  v-if="scope.row.auditFlag" type="text" size="small"  @click="toExamine(scope.row)" >审核</el-button>
        <el-button v-if="scope.row.modifyFlag" type="text" size="small"  @click="jumpDeclare(scope.row)" >修改</el-button>
        <el-button v-if="scope.row.deleteFlag" type="text" size="small"  @click="deleteBudget(scope.row)" >删除</el-button>
      </template>
    </el-table-column>
  </el-table>
    <div class="button_wrap" v-if="budgetAdjustmentState">
      <el-button class="exactButton" style="margin-right: 20px" @click="cancel">取消</el-button>
      <el-button v-if="budgetAdjustmentState==1" class="exactButton" type="primary" @click="jumpPushBudget">确定</el-button>
      <el-button v-if="budgetAdjustmentState==2" class="exactButton" type="primary" @click="takeMonthModel">自动结转</el-button>
    </div>
    <el-dialog
      title="权限配置"
      :visible.sync="configurationState"
      @open="queryBudgetConfig"
      width="60%"
      top="7vh"
      >
      <p class="configTitle"><span>预算申报权限选择:</span>  <el-button size="mini" type="primary" @click="handleAdd(1)">添加</el-button></p>
      <el-table :data="configurationList.filter(item=>item.taskNo==1)" height="200">
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          label="员工姓名"
          prop="deptName"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.taskUser"
              v-if="!scope.row.modifyFlag"
              filterable
              clearable>
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.fullname"
                :value="item.userId"
                :disabled="configurationList.filter(item=>item.taskNo==1&&item.taskUser).map(item=>item.taskUser).includes(item.userId)"
              >
              </el-option>
            </el-select>
            <span  v-if="scope.row.modifyFlag">{{ scope.row.taskUser&&userList.find(item=>item.userId===scope.row.taskUser)?userList.find(item=>item.userId===scope.row.taskUser).fullname:''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="申报部门"
        >
          <template slot-scope="scope">
            <el-multi-cascader
              v-if="!scope.row.modifyFlag"
              selectChildren
              :show-all-levels="false"
              :options="departData"
              :is-two-dimension-value="true"
              multiple
              filterable
              clearable
              :props="defaultParams"
              collapse-tags
              change-on-select
              @change="(data)=>getdata(data,scope.row)"
              v-model="scope.row.deptIds"> </el-multi-cascader>
            <div  v-if="scope.row.modifyFlag" :title="scope.row.deptIdList.map(item=>langGetMenuName.find(itm=>itm.deptId==item).name).join('/')">
              <p :key="index" v-for="(i,index) in scope.row.deptIdList.map(item=>langGetMenuName.find(itm=>itm.deptId==item).name)">
                {{i}}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="strStatus"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button v-if="!scope.row.modifyFlag"  type="text" size="small"  @click="cancelItem(scope.row,1)" >取消</el-button>
            <el-button v-if="!scope.row.modifyFlag"  type="text" size="small"  @click="saveItem(scope.row,1)" >保存</el-button>
            <el-button v-if="scope.row.modifyFlag" type="text" size="small"  @click="modifyItem(scope.row,1)" >修改</el-button>
            <el-button  type="text" size="small"  @click="deleteItem(scope.row,1)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <p  class="configTitle"><span>主管/高级合伙人预算审批权限选择:</span>  <el-button size="mini" type="primary" @click="handleAdd(2)">添加</el-button></p>
      <el-table :data="configurationList.filter(item=>item.taskNo==2)" height="200">
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          label="员工姓名"
          prop="deptName"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.taskUser"  v-if="!scope.row.modifyFlag" filterable
                       clearable>
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.fullname"
                :value="item.userId"
              >
              </el-option>
            </el-select>
            <span  v-if="scope.row.modifyFlag">{{ scope.row.taskUser&&userList.find(item=>item.userId===scope.row.taskUser).fullname?userList.find(item=>item.userId===scope.row.taskUser).fullname:''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="申报部门"
        >
          <template slot-scope="scope">
            <el-multi-cascader
              v-if="!scope.row.modifyFlag"
              selectChildren
              :show-all-levels="false"
              :options="departData"
              :is-two-dimension-value="true"
              multiple
              filterable
              clearable
              :props="defaultParams"
              collapse-tags
              change-on-select
              @change="(data)=>getdata(data,scope.row)"
              v-model="scope.row.deptIds"> </el-multi-cascader>
            <div  v-if="scope.row.modifyFlag" :title="scope.row.deptIdList.map(item=>langGetMenuName.find(itm=>itm.deptId==item).name).join('/')">
              <p :key="index" v-for="(i,index) in scope.row.deptIdList.map(item=>langGetMenuName.find(itm=>itm.deptId==item).name)">
                {{i}}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="strStatus"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button v-if="!scope.row.modifyFlag"  type="text" size="small"  @click="cancelItem(scope.row,2)" >取消</el-button>
            <el-button v-if="!scope.row.modifyFlag"  type="text" size="small"  @click="saveItem(scope.row,2)" >保存</el-button>
            <el-button v-if="scope.row.modifyFlag" type="text" size="small"  @click="modifyItem(scope.row,2)" >修改</el-button>
            <el-button  type="text" size="small"  @click="deleteItem(scope.row,1)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <p  class="configTitle"><span>管委会预算审批权限选择:</span>  <el-button size="mini" type="primary" @click="handleAdd(3)">添加</el-button></p>
      <el-table :data="configurationList.filter(item=>item.taskNo==3)" height="200">
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          label="员工姓名"
          prop="deptName"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.taskUser"  v-if="!scope.row.modifyFlag" filterable
                       clearable>
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.fullname"
                :value="item.userId"
              >
              </el-option>
            </el-select>
            <span  v-if="scope.row.modifyFlag">{{ scope.row.taskUser&&userList.find(item=>item.userId===scope.row.taskUser).fullname?userList.find(item=>item.userId===scope.row.taskUser).fullname:''}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--label="申报部门"-->
        <!--&gt;-->
          <!--<template slot-scope="scope">-->
            <!--<el-multi-cascader-->
              <!--v-if="!scope.row.modifyFlag"-->
              <!--selectChildren-->
              <!--:show-all-levels="false"-->
              <!--:options="departData"-->
              <!--:is-two-dimension-value="true"-->
              <!--multiple-->
              <!--filterable-->
              <!--clearable-->
              <!--:props="defaultParams"-->
              <!--collapse-tags-->
              <!--change-on-select-->
              <!--@change="(data)=>getdata(data,scope.row)"-->
              <!--v-model="scope.row.deptIds"> </el-multi-cascader>-->
            <!--<span  v-if="scope.row.modifyState">{{scope.row.deptIdList.map(item=>langGetMenuName.find(itm=>itm.deptId==item).name).join('/')}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          prop="strStatus"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button v-if="!scope.row.modifyFlag"  type="text" size="small"  @click="cancelItem(scope.row,3)" >取消</el-button>
            <el-button v-if="!scope.row.modifyFlag"  type="text" size="small"  @click="saveItem(scope.row,3)" >保存</el-button>
            <el-button v-if="scope.row.modifyFlag" type="text" size="small"  @click="modifyItem(scope.row,3)" >修改</el-button>
            <el-button  type="text" size="small"  @click="deleteItem(scope.row,1)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <p  class="configTitle"><span>增加/调整预算权限选择:</span>  <el-button size="mini" type="primary" @click="handleAdd(4)">添加</el-button></p>
      <el-table :data="configurationList.filter(item=>item.taskNo==4)" height="200">
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          label="员工姓名"
          prop="deptName"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.taskUser"  v-if="!scope.row.modifyFlag" filterable
                       clearable>
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.fullname"
                :value="item.userId"
              >
                <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
              </el-option>
            </el-select>
            <span  v-if="scope.row.modifyFlag">{{ scope.row.taskUser&&userList.find(item=>item.userId===scope.row.taskUser)?userList.find(item=>item.userId===scope.row.taskUser).fullname:''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="申报部门"
        >
          <template slot-scope="scope">
            <el-multi-cascader
              v-if="!scope.row.modifyFlag"
              selectChildren
              :show-all-levels="false"
              :options="departData"
              :is-two-dimension-value="true"
              multiple
              filterable
              clearable
              :props="defaultParams"
              collapse-tags
              change-on-select
              @change="(data)=>getdata(data,scope.row)"
              v-model="scope.row.deptIds"> </el-multi-cascader>
            <div  v-if="scope.row.modifyFlag" :title="scope.row.deptIdList.map(item=>langGetMenuName.find(itm=>itm.deptId==item).name).join('/')">
              <p :key="index" v-for="(i,index) in scope.row.deptIdList.map(item=>langGetMenuName.find(itm=>itm.deptId==item).name)">
                {{i}}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="strStatus"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button v-if="!scope.row.modifyFlag"  type="text" size="small"  @click="cancelItem(scope.row,4)" >取消</el-button>
            <el-button v-if="!scope.row.modifyFlag"  type="text" size="small"  @click="saveItem(scope.row,4)" >保存</el-button>
            <el-button v-if="scope.row.modifyFlag" type="text" size="small"  @click="modifyItem(scope.row,4)" >修改</el-button>
            <el-button  type="text" size="small"  @click="deleteItem(scope.row,1)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>-->
      <!--</span>-->
    </el-dialog>
    <el-dialog
      title="选择自动结转的月份"
      :visible.sync="monthModelState"
      width="30%"
      >
      <el-date-picker
        v-model="curMonth"
        popper-class="monthPopper"
        type="month"
        format="MM"
        value-format="MM"
        placeholder="选择月">
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="monthModelState = false">取 消</el-button>
        <el-button type="primary" @click="remainingBudget">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {remainingBudget, queryBudgetList,queryDepartMent,queryBudgetConfig,createBudgetConfig,updateBudgetConfig,deleteBudgetConfig,queryAppUser,queryTaskUser ,deleteBudget} from '@/api/caseList'
import { selectAllDept } from '@/api/systemList'
import {getTwoDimensionalArray,getMenuName,formatDate} from '@/utils'
import { getUser } from '@/api/user'
import DataPicker from '@/components/DataPicker'
export default {
  name: "BudgetDeclaration",
  data(){
    return {
      monthList:[],
      queryModuleData:{
        taskStatus:''
      },
      superiorDepartments:[],
      departData:[],
      defaultParams:{
        value: 'deptId',
        label: 'name',
        checkStrictly: true
      },
      defaultParams2:{
        value: 'deptId',
        label: 'deptName',
        checkStrictly: true,
        children: 'dataList'
      },
      dataList: [],
      departMentList:[],
      curdeptId:[],
      curDeptName:'',
      declarationState:false,
      budgetAdjustmentState:false,
      configurationState: false,
      configurationList:[],
      langGetMenuName:[],
      userList:[],
      taskUserList:[],
      appUserList:[],
      limitDepartData:[],
      monthModelState:false,
      curMonth:'',
      multipleSelection:[]
    }
  },
  created(){
    this.queryBudgetList()
    this.selectAllDept()
    this.queryAppUser()
    this.queryTaskUser()
    this.getUser()
  },
  methods:{
    handleSearch() {
      this.budgetAdjustmentState=0
      this.queryBudgetList()
    },
    clearSearch() {
      this.$set(this,'monthList',[])
      this.queryModuleData = {}
      this.superiorDepartments=[]
      //this.queryBudgetList()
    },
    deleteBudget(row){
      this.$confirm('您确定要删除该预算吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBudget({deptId:row.deptId,year:row.year}).then(res=>{
          this.queryBudgetList()
        })
      }).catch(() => {

      })
    },
    configuration() {
      this.configurationState=true
    },
    catchange(e){
      this.curDeptName=this.$refs.caseTypecascader.currentLabels[this.$refs.caseTypecascader.currentLabels.length-1]
    },
    saveItem(row,taskNo){
      row.modifyFlag=!row.modifyFlag
      this.configurationList.push({})
      this.configurationList.pop()
      if(row.create){
        const data={deptIdList:row.deptIdList, taskUser:row.taskUser,taskNo:row.taskNo }
        createBudgetConfig(data).then(res => {
          delete row.create
        })
      } else {
        updateBudgetConfig(row).then(res => {

        })
      }

      //console.log(this.configurationList.filter(item=>item.taskNo==taskNo).indexOf(row));
    },
    formatDate(time){
      return formatDate(time)
    },
    getdata(data,row){
      row.deptIdList=data.map(item=>item[item.length-1])
    },
    modifyItem(row,taskNo){
      row.modifyFlag=!row.modifyFlag
      row.preData=JSON.parse(JSON.stringify(row))
      this.configurationList.push({})
      this.configurationList.pop()
    },
    cancelItem(row){
      if(row.create){
        this.configurationList.splice(this.configurationList.indexOf(row),1)
        return
      }
      for (var key in row.preData) {
        row[key]=row.preData[key]
      }
      row.modifyFlag = true
      this.configurationList.push({})
      this.configurationList.pop()
    },
    deleteItem(row,taskNo){
      this.$confirm('您确定要删除该权限吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         deleteBudgetConfig({taskUser:row.taskUser,taskNo}).then(res =>{
           this.configurationList.splice(this.configurationList.indexOf(row),1)
           this.$message({
             type: 'success',
             message: '删除成功!'
           });
         })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      })

    },
    handleAdd(taskNo) {
      this.configurationList.filter(item=>item.taskNo==taskNo).forEach(item=>{
        if(!item.modifyFlag){
          item.modifyFlag = true
        }
      })
      this.configurationList.unshift({ taskNo, deptIds:[], modifyFlag: false, create:true })
    },
    queryBudgetConfig(){
      queryBudgetConfig().then(res => {
        res.data.forEach(item => {
          item.deptIds = getTwoDimensionalArray(this.departData,'deptId',item.deptIdList,{children:'children'})
          item.modifyFlag = true
        })
        this.configurationList = res.data
      })
    },
    handleSelectionChange(val,row){
      this.multipleSelection=[row]
      this.dataList.forEach(item=>{
        if(item==row){
          this.$refs.budgetDeclarationTable.toggleRowSelection(item,true)
        }else {
          this.$refs.budgetDeclarationTable.toggleRowSelection(item,false)
        }
      })
    },
    queryDeclaration() {
      if (this.curdeptId.length) {
        this.$router.push(`declare?deptId=${this.curdeptId[this.curdeptId.length-1]}&deptName=${this.curDeptName}`)
      }
    },
    budgetAdjustment() {
      this.budgetAdjustmentState = 1
      this.$set(this.queryModuleData,'taskStatus','已完成')
   //   this.queryModuleData.taskStatus='已完成'
      this.queryBudgetList()
    },
    autoForward(){
      this.budgetAdjustmentState = 2
    },
    takeMonthModel(){
      if(!this.multipleSelection.length){
        this.$message.error('请选择部门')
        return
      }
      this.monthModelState = true
    },
    remainingBudget(){
      remainingBudget({
        deptId:this.multipleSelection[0].deptId,
        month:this.curMonth
      }).then(res=>{
        this.$message.success('设置成功')
      }).finally(()=>{
        this.monthModelState = false
      })
    },
    cancelMonthModel(){
      this.monthModelState = false
    },
    declaration() {
      this.queryDepartMent()
    },
    getUser(){
      this.userList =this.$store.getters.userList
    },
    queryDepartMent() {
      queryDepartMent({queryFlag:1}).then(res => {
        this.departMentList = res.data
        this.declarationState = true
      })
    },
    queryBudgetList(){
      this.queryModuleData.startAppDate=this.monthList[0]
      this.queryModuleData.endAppDate=this.monthList[1]
      this.queryModuleData.deptId=this.superiorDepartments[this.superiorDepartments.length-1]
      for(var key in this.queryModuleData){
        if(!this.queryModuleData[key]){
          delete this.queryModuleData[key]
        }
      }
      queryBudgetList(this.queryModuleData).then(res => {
        this.dataList = res.data
      })
    },
    queryAppUser(){
      queryAppUser().then(res=>{
        this.appUserList=res.data
      })
    },
    queryTaskUser(){
      queryTaskUser().then(res=>{
        this.taskUserList=res.data
      })
    },
    jumpDeclare(row){
      this.$router.push({path:'declare',query:Object.assign({modify:1},row)})
    },
    toExamine(row){
      this.$router.push({path:'declare',query:Object.assign({examine:1},row)})
    },
    selectAllDept(){
      queryDepartMent({queryFlag:2}).then(res => {
        this.limitDepartData = res.data
      })
      selectAllDept().then(res=>{
        this.departData = res.data
        this.langGetMenuName=getMenuName(this.departData,'children')
      })
    },
    cancel(){
      this.budgetAdjustmentState = false
    },
    jumpPushBudget(){
      if(!this.multipleSelection.length){
        this.$message.error('请选择部门')
        return
      }
      this.$router.push('AppendBudget?deptId='+this.multipleSelection[0].deptId+'&deptName='+this.multipleSelection[0].deptName)
    },
    cellClass(row) {
      if (row.columnIndex === 0 && this.budgetAdjustmentState) {
        return 'DisableSelection'
      }
    },
    changeTextRange(e,type) {
      this.$set(this.queryModuleData,type, e)
    },
  }
}
</script>

<style lang="scss" scoped>
  .el-form{
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-bottom: 40px;
    padding:10px 120px 10px 10px;
    box-shadow:0px 2px 5px 0px rgba(163, 163, 163, 0.35);
    .el-form-item{
      width: 33%;
      /deep/  .el-form-item__content{
        display: flex;
        align-items: center;
        height: 100%;
        .el-cascader{
          width: 100%;
        }
        .el-select{
          width: 100%;
        }
      }
    }
  }
  .clearButton{
    position: absolute;
    right: 18px;
    top: 10px;
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
  .buttonWrap{
    width: 100%;
    text-align: center;
    transform: translateX(60px);
  }
  .declaration{
    text-align: left;
    &>div{
      position: absolute;
      width: 300px;
      height: 122px;
      background: #ffffff;
      box-shadow: 2px 2px 5px rgba(201, 201, 201, 1);
      z-index: 3;
      padding: 5px;
      &>div{
        display: flex;
        justify-content: flex-end;
        padding-right: 10px;
        padding-bottom: 20px;
      }
    }
    .el-cascader{
      width: 200px;
      height: 30px;
      margin-bottom: 40px;
    //  line-height: 30px;
      .el-input{
        width: 200px;
        height: 30px;
        line-height: 30px;
      }
       /deep/ .el-input__inner{
         width: 200px;
         height: 30px;
         line-height: 30px;
        }
    }
  }
  .el-form{
    z-index: 1;
  }
  .el-table /deep/ .DisableSelection .cell{
    visibility: hidden;
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
  .el-table{
    /deep/ th{
      padding:5px 0
    }
    /deep/ td {
      padding: 0 ;
    }
  }
  .el-table{
    width: auto;
    /deep/ tr:nth-of-type(1){
      th{
        background: rgba(242, 242, 242, 1);
      }
    }
  }
  .configTitle{
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    line-height: 28px;
  }
</style>
