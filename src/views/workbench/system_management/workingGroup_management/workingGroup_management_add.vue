<template>
  <div id="columnColor">
    <h2 class="department_header">{{$route.meta.title}}</h2>
    <el-form  ref="submission"  label-width="250px"  >
      <el-row style="border-right: 1px solid #EBEEF5;border-top: 1px solid #EBEEF5">
        <el-form-item label="工作组编号:"  class="small-el-form-item" style="border:0">
          {{$route.query.wkgId}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="flex" label="工作组负责人:" :rules="{
        required: true,
      }">
          <el-select  default-first-option  v-model="curBossUserId" disabled clearable filterable placeholder="请选择">
            <el-option
              v-for="item in namesList"
              :key="item.userId"
              :label="item.fullname"
              :value="item.userId"
            >
            </el-option>
          </el-select>
          <el-button  type="primary" size="small" @click="selectBossUser">选择</el-button>
          <p class="ruleRed" v-show="rules.curBossUserId">请选择工作组负责人</p>
        </el-form-item>
        <el-form-item class="flex" label="工作组费用审核人:">
          <VirtualSelect multiple filterable clearable :data="$store.getters.userList" v-model="auditorList"></VirtualSelect>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="flex"  label="工作组名称:" :rules="{
        required: true,
      }">
          <el-input v-model='groupName' placeholder="请输入内容"></el-input>
          <p class="ruleRed" v-show="rules.groupName==1">请输入工作组名称</p>
          <p class="ruleRed" v-show="rules.groupName==2">已有该工作组名称</p>
        </el-form-item>
      </el-row>
      <el-row >
        <el-form-item class="flex"   label="工作组角色:" :rules="{
        required: true,
      }">
          <el-select  default-first-option  v-model="wkgRoleName" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in queryWorkGroupList"
              :key="item.wkgRoleId"
              :label="item.roleName"
              :value="item.wkgRoleId"
            >
            </el-option>
          </el-select>
          <p class="ruleRed" v-show="rules.wkgRoleName">请选择工作组角色</p>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="所属部门(地域):" :rules="{
        required: true,
      }">
          <el-cascader
            v-model="superiorDepartments"
            filterable
            clearable
            :change-on-select="true"
            :show-all-levels="false"
            :options="departData"
            :props="defaultParams"
            @change="catchange"
            :disabled="$route.query.parent==0"
            placeholder="请选择"
          ></el-cascader>
          <p class="ruleRed" v-show="rules.superiorDepartments">请选择所属部门</p>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="是否有效(地域):" >
          <el-radio-group  v-model="status">
            <el-radio  label="1">是</el-radio>
            <el-radio  label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="地域:">
          <el-select  default-first-option  v-model="areaId" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in areaList"
              :key="item.areaId"
              :label="item.areaName"
              :value="item.areaId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="账单是否组长审核:" >
          <el-radio-group  v-model="billLeaderAudit">
            <el-radio  label="是">是</el-radio>
            <el-radio  label="否">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="商标撰写任务分配:" >
          <el-radio-group  v-model="articleType">
            <el-radio  label="天津">天津</el-radio>
            <el-radio  label="重庆">重庆</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="工作组成员:" >
          <div style="width: 100%;position: relative">
            <div style="overflow: hidden">
              <el-button type="primary" class="floatRight" @click="handleAddItem">添加</el-button>
            </div>

          <el-table :data="members" border  style="width: 99%;">
            <el-table-column align="left" label="员工姓名">
              <template slot-scope="scope">
                <virtual-select clearable :isUser="true" :data="$store.getters.allUserList" :disabled="members[scope.$index].disabledState" v-model="members[scope.$index].userId" filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
                </virtual-select>

<!--                <el-select  default-first-option  v-model="members[scope.$index].userId"  :disabled="members[scope.$index].disabledState"  clearable filterable placeholder="请选择">-->
<!--                  <el-option-->
<!--                    v-for="item in namesList"-->
<!--                    :key="item.userId"-->
<!--                    :label="item.fullname"-->
<!--                    :value="item.userId"-->
<!--                  >-->
<!--                  </el-option>-->
<!--                </el-select>-->
              </template>
            </el-table-column>
            <el-table-column align="left" label="员工角色">
              <template slot-scope="scope" >
                <el-select  default-first-option class="multipleSelect" v-model="members[scope.$index].roleIds" filterable  :disabled="members[scope.$index].disabledState" multiple placeholder="请选择">
                  <el-option
                    v-for="item in roleNamesList"
                    :key="item.roleId"
                    :label="item.name"
                    :value="item.roleId">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="行政组员">
              <template slot-scope="scope" >
                <el-radio-group  v-model="scope.row.administrative" :disabled="members[scope.$index].disabledState">
                  <el-radio  :label="1">是</el-radio>
                  <el-radio  :label="0">否</el-radio>
                </el-radio-group>
<!--                {{scope.row.administrative ? '是' : '否'}}-->
              </template>
            </el-table-column>
            <el-table-column align="left" label="备注">
              <template slot-scope="scope" >
                <el-input v-model="members[scope.$index].memo" placeholder="请输入内容" :disabled="members[scope.$index].disabledState"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作"  align="left">
              <template slot-scope="scope">
                <el-button @click="handleChangeDisable(scope.$index)" type="text" size="small">{{members[scope.$index].disabledState?'修改':'保存'}}</el-button>
                <el-button type="text" size="small" @click="deleteDeptId(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
        </el-form-item>
      </el-row>
    </el-form>
    <!--<el-table class="myTable">-->
      <!--<el-table-column label="工作组编号：" width="250" >-->
        <!--<el-table-column  label="工作组负责人：" width="250">-->
          <!--<el-table-column  label="工作组名称：" width="250">-->
            <!--<el-table-column   label="工作组角色：" width="250">-->
              <!--<el-table-column  label="所属部门(地域)：" width="250">-->
                <!--<el-table-column label="是否有效：" width="250">-->
                  <!--<el-table-column label="工作组成员：" width="250">-->

                  <!--</el-table-column>-->
                <!--</el-table-column>-->
              <!--</el-table-column>-->
            <!--</el-table-column>-->
          <!--</el-table-column>-->
        <!--</el-table-column>-->
      <!--</el-table-column>-->
      <!--<el-table-column class="columnColor">-->
        <!--<template slot="header" slot-scope="scope">-->
          <!--{{$route.query.wkgId}}-->
        <!--</template>-->
        <!--<el-table-column>-->
          <!--<template slot="header" slot-scope="scope">-->
            <!--<el-select  default-first-option  v-model="curBossUserId" disabled clearable filterable placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in namesList"-->
                <!--:key="item.userId"-->
                <!--:label="item.fullname"-->
                <!--:value="item.userId"-->
              <!--&gt;-->
              <!--</el-option>-->
            <!--</el-select>-->
            <!--<el-button  type="primary" size="small" @click="selectBossUser">选择</el-button>-->
            <!--<p class="ruleRed" v-show="rules.curBossUserId">请选择工作组负责人</p>-->
          <!--</template>-->
          <!--<el-table-column>-->
            <!--<template slot="header" slot-scope="scope">-->
              <!--<el-input v-model='groupName' placeholder="请输入内容"></el-input>-->
              <!--<p class="ruleRed" v-show="rules.groupName==1">请输入工作组名称</p>-->
              <!--<p class="ruleRed" v-show="rules.groupName==2">已有该工作组名称</p>-->
            <!--</template>-->
            <!--<el-table-column>-->
              <!--<template slot="header" slot-scope="scope">-->
                <!--<el-select  default-first-option  v-model="wkgRoleName" clearable filterable placeholder="请选择">-->
                  <!--<el-option-->
                    <!--v-for="item in roleNamesList"-->
                    <!--:key="item.roleId"-->
                    <!--:label="item.name"-->
                    <!--:value="item.roleId"-->
                  <!--&gt;-->
                  <!--</el-option>-->
                <!--</el-select>-->
                <!--<p class="ruleRed" v-show="rules.wkgRoleName">请选择工作组角色</p>-->
              <!--</template>-->
              <!--<el-table-column>-->
                <!--<template slot="header" slot-scope="scope">-->
                  <!--<el-cascader-->
                    <!--v-model="superiorDepartments"-->
                    <!--filterable-->
                    <!--clearable-->
                    <!--:change-on-select="true"-->
                    <!--:show-all-levels="false"-->
                    <!--:options="departData"-->
                    <!--:props="defaultParams"-->
                    <!--@change="catchange"-->
                    <!--:disabled="$route.query.parent==0"-->
                    <!--placeholder="请选择"-->
                  <!--&gt;</el-cascader>-->
                  <!--<p class="ruleRed" v-show="rules.superiorDepartments">请选择所属部门</p>-->
                <!--</template>-->
                <!--<el-table-column>-->
                  <!--<template slot="header" slot-scope="scope">-->
                    <!--<el-radio-group  v-model="status">-->
                      <!--<el-radio  label="1">是</el-radio>-->
                      <!--<el-radio  label="0">否</el-radio>-->
                    <!--</el-radio-group>-->
                  <!--</template>-->
                  <!--<el-table-column >-->
                    <!--<template slot="header" slot-scope="scope">-->
                      <!--<el-button type="primary" class="floatRight" @click="handleAddItem">添加</el-button>-->
                      <!--<table id="sonTable" v-if="members.length">-->
                        <!--<tr>-->
                          <!--<th style="text-align: center">员工姓名</th>-->
                          <!--<th style="text-align: center" width="400">员工角色</th>-->
                          <!--<th style="text-align: center">备注</th>-->
                          <!--<th style="text-align: center">操作</th>-->
                        <!--</tr>-->
                        <!--<tr v-for="item,index in members" :key="index">-->
                          <!--<td>-->
                            <!--<el-select  default-first-option  v-model="item.userId"  :disabled="item.disabledState"  clearable filterable placeholder="请选择">-->
                              <!--<el-option-->
                                <!--v-for="item in namesList"-->
                                <!--:key="item.userId"-->
                                <!--:label="item.fullname"-->
                                <!--:value="item.userId"-->
                              <!--&gt;-->
                              <!--</el-option>-->
                            <!--</el-select>-->
                          <!--</td>-->
                          <!--<td>-->
                            <!--<el-select  default-first-option class="multipleSelect" v-model="item.roleIds"  :disabled="item.disabledState" multiple placeholder="请选择">-->
                            <!--<el-option-->
                            <!--v-for="item in roleNamesList"-->
                            <!--:key="item.roleId"-->
                            <!--:label="item.name"-->
                            <!--:value="item.roleId">-->
                            <!--</el-option>-->
                            <!--</el-select>-->
                          <!--</td>-->
                          <!--<td>-->
                            <!--<el-input v-model="item.memo" placeholder="请输入内容" :disabled="item.disabledState"></el-input>-->
                          <!--</td>-->
                          <!--<td>-->
                            <!--<el-button @click="handleChangeDisable(index)" type="text" size="small">{{item.disabledState?'修改':'保存'}}</el-button>-->
                            <!--<el-button type="text" size="small" @click="deleteDeptId(index)">删除</el-button>-->
                          <!--</td>-->
                        <!--</tr>-->
                      <!--</table>-->
                    <!--</template>-->
                  <!--</el-table-column>-->
                <!--</el-table-column>-->
              <!--</el-table-column>-->
            <!--</el-table-column>-->
          <!--</el-table-column>-->
        <!--</el-table-column>-->
      <!--</el-table-column>-->
    <!--</el-table>-->
    <div class="button_wrap">
      <el-button class="exactButton" type="primary" @click="submit">确定</el-button>
      <el-button class="exactButton" plain @click="cancel">取消</el-button>
    </div>
    <select-header v-if="dialogTableVisible" :dialogTableVisible="dialogTableVisible" @handleClose="handleClose" @getUserId="getUserId"></select-header>
  </div>
</template>

<script>
import getPageTitle from '@/utils/get-page-title'
import { getAreaList,selectWorkgroupById,queryUsers, queryRoleNames, queryDomainNames,createWorkgroup,selectAllDept,queryWorkGroup ,updateById,queryWkgRole} from '@/api/systemList'
import selectHeader from './selectionHeader'
export default {
  name: "workingGroup_management_add",
  data() {
    return {
      areaList: [],
      areaId: '',
      auditorList: [], // 费用审核人
      members:[],// 工作組成員
      namesList: [],//下拉姓名
      roleNamesList: [],//下拉角色名字
      domainNames:[],//下拉領域名稱
      departData:[],//下拉部門
      defaultParams:{//級聯菜單默認
        value: 'deptId',
        label: 'name',
        checkStrictly: true
      },
      curBossUserId:'',// 負責人id
      domainName:'',// 領域id
      groupName:'',// 工作組id
      status:'1',// 是否有效 1是0否String
      wkgRoleName:'',// 工作組成員
      superiorDepartments:[],// 部門級聯菜單
      rules:{// 表單驗證
        curBossUserId:false,
        groupName:0,
        wkgRoleName:false,
        superiorDepartments:false
      },
      queryWorkGroupList:[],//工作組名稱列表（查重）
      dialogTableVisible:false,//彈框控制
      billLeaderAudit:'是',
      articleType:'天津'
    }
  },
  created() {
    this.queryAreaList()
    this.queryRoleNames()
    this.queryDomainNames()
    this.selectAllDept()
    this.queryWorkGroup()
    if(this.$route.params.type=='2'){//修改
     this.curBossUserId= Number(this.$route.query.bossUserId)
     this.auditorList= JSON.parse(this.$route.query.auditorList || [])
      this.selectWorkgroupById(this.$route.query.wkgId)
      this.status=this.$route.query.status.toString()
      this.groupName=this.$route.query.groupName.toString()
      this.billLeaderAudit=this.$route.query.billLeaderAudit.toString()
      this.articleType=this.$route.query.articleType
      this.wkgRoleName =this.$route.query.wkgRoleId!==0?Number(this.$route.query.wkgRoleId):-1
      this.areaId = this.$route.query.areaId ? +this.$route.query.areaId : undefined
    }
  },
  methods: {
    queryAreaList(){
      getAreaList().then(res => {
        this.areaList = res.data
      })
    },
    queryDomainNames(){
      queryDomainNames().then(res=>{
        if(res.success){
          this.domainNames=res.data
          this.queryUsers()
        }
      })
    },
    queryUsers() {
      queryUsers().then(res => {
        if (res.success) {
          let obj = {};
          this.namesList = res.data.users.reduce((cur,next) => {
            obj[next.userId] ? "" : obj[next.userId] = true && cur.push(next);
            return cur;
          },[])//歸併去重
          console.log(this.namesList.find(item => item.userId == 2789));
        }
      })
    },
    queryRoleNames() {
      queryRoleNames().then(res => {
        if (res.success) {
          this.roleNamesList = res.data
        }
      })
    },
    queryWorkGroup(){
      queryWkgRole().then(res=>{
        if (res.success) {
          this.queryWorkGroupList = res.data
        }
      })
    },
    selectAllDept(){
      selectAllDept().then(res=>{
        if (res.success) {
          if(this.$route.params.type=='2'){// 如果是修改工作組 將多級菜單進行回顯
            let menuNameList=util.getMenuName(res.data).filter(item=>item!=undefined);// 根據父子節點的關係整出回顯數組
            function  familyTree(arr, pid) {
              var temp = [];
              var forFn = function(arr, pid) {
                for (var i = 0; i < arr.length; i++) {
                  var item = arr[i];
                  if (item.deptId == pid) {
                    temp.push(item);
                    forFn(arr, item.parent);
                  }
                }
              };
              forFn(arr, pid);
              return temp;
            }
            this.superiorDepartments=familyTree(menuNameList, menuNameList.find(item => item.deptId == this.$route.query.deptId).parent).reverse().map(item => item.deptId).concat(parseInt(this.$route.query.deptId));
          }
          this.departData =res.data
        }
      })
    },
    selectWorkgroupById(num) {//根據userid查詢數據回顯
      selectWorkgroupById(num).then(res => {
        if (res.success) {
          this.members = res.data.members
          this.members.forEach(item=>{
            var roleList=[ ]
            item.roles.forEach(item=>{
              roleList.push(item.roleId)
            })
            this.$set(item,'roleIds',roleList)
            // item.roleIds=roleList
            item.disabledState=true
          })
        }
      })
    },
    handleChangeDisable(res){
      this.members[res].disabledState=!this.members[res].disabledState
      this.members.push({})
      this.members.pop()
    },
    deleteDeptId(res){
      this.members.splice(res,1)
    },
    catchange(e){
      this.superiorDepartments=e
    },
    handleAddItem(){
      if(this.members.length!=0) {
        if (!this.members[this.members.length - 1].disabledState) {
          this.$alert('请先保存添加项', '提示信息', {
            confirmButtonText: '确定',
          })
          return
        }
      }
      this.members.push({})
    },
    selectBossUser(){
      this.dialogTableVisible=true
    },
    getUserId(res){
      this.curBossUserId=res
      this.dialogTableVisible=false
    },
    handleClose(res){
      this.dialogTableVisible=res
    },
    submit() {
      if (!this.submitRule()){ return}
      var members = this.coppyArray(this.members)
      members.forEach(item=>{
        item.roleIds=item.roleIds.join(',')
        delete item.disabledState
      })
      let sendData={
        billLeaderAudit:this.billLeaderAudit, 
        articleType:this.articleType, 
        bossUserId:this.curBossUserId,
        groupName: this.groupName,
        members: members,
        status: this.status,
        wkgRoleId:this.wkgRoleName,
        deptId:this.superiorDepartments[this.superiorDepartments.length-1],
        auditorList: this.auditorList,
        areaId: this.areaId
      }
      if(this.$route.params.type==='1'){
        createWorkgroup(sendData).then(res => {
          this.$router.history.go(-1)
        })
      }else {
        sendData.wkgId=this.$route.query.wkgId
        updateById(sendData).then( res => {
          // this.$router.history.go(-1)
          this.$router.push('/workbench/system_management/workingGroup_management')
        })
      }
    },
    cancel(){
      const text =  this.$route.params.type==='1' ? '新增' : '编辑'
      this.$confirm(`你确认要放弃${text}工作组吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(this.$route.params.type==='1'){
          this.$router.history.go(-1)
        }else{
          this.$router.push('/workbench/system_management/workingGroup_management')
        }
      }).catch(() => {

      });
    },
    submitRule(){//表單驗證
      if(!this.curBossUserId){
        this.rules.curBossUserId=true
        return false
      }else {
        this.rules.curBossUserId=false
      }
      if(!this.groupName){
        this.rules.groupName=1
        return false
      }
      if(this.$route.params.type=='2'){
        this.queryWorkGroupList = this.queryWorkGroupList.filter(item=>item.roleName!=this.$route.query.groupName)
      }
      if(this.queryWorkGroupList.map(item=>item.roleName).includes(this.groupName)){
        this.rules.groupName=2
        return false
      }else {
        this.rules.groupName=0
      }
      if(!this.wkgRoleName){
        this.rules.wkgRoleName=true
        return false
      }else {
        this.rules.wkgRoleName=false
      }
      if(!this.superiorDepartments.length){
        this.rules.superiorDepartments=true
        return false
      }else {
        this.rules.superiorDepartments=false
      }
      return true

    },
    coppyArray(arr){
      return arr.map((e)=>{
        if(typeof e==='object'){
          return Object.assign({},e);
        }else{
          return e;
        }
      })
    }
  },
  components:{
    selectHeader
  },
  beforeRouteEnter:(to,from,next)=> {
    if (to.params.type === '1') {
      document.title=getPageTitle(to.meta.title = "工作组添加")
      next(res => {
        res.modifyState = false
      });
    } else {
      document.title=getPageTitle( to.meta.title = "工作组修改")
      next(res => {
        res.modifyState = true
      });
    }
  },
}
var util={

}
//将多级数组合并
util.getMenuName=function(obj) {
  var arr = [];
  arr.push(obj)
  for (var i = 0, len = obj.length; i < len; i++) {
    arr.push(obj[i].children);
    if (obj[i].children != null && obj[i].children.length > 0) {
      var factorial= function () {
        var _obj = arguments[0];
        for (var j = 0, _len = _obj.length; j < _len; j++) {
          arr.push(_obj[j].children);
          if (_obj[j].children != null && _obj[j].children.length > 0) {
            factorial(_obj[j].children);
          }
        }
      }
      factorial(obj[i].children)
    }
  }
  var result=[]
  for (let i = 0; i < arr.length; i++) {
    result = result.concat(arr[i]);
  }
  return result;
}
</script>

<style lang="scss" scoped>
  /*.el-table /deep/  tr th:nth-child(2){*/
    /*background: #fff;*/
  /*}*/
 /*.el-table  /deep/ .el-table__empty-block{display: none}*/
  /*#sonTable tr th:nth-child(2){*/
    /*background: #f5f7fa;*/
  /*}*/
  /*#sonTable /deep/ .el-table__empty-block{display: block}*/
  /*#sonTable {*/
    /*width: 100%;*/
  /*}*/
  .multipleSelect{
    width: 100%;
  }
  .floatRight{
    float: right;
    margin-bottom: 10px;
  }
  .button_wrap {
    display: flex;
    justify-content: center;
    padding: 50px 0;
  }
  .button_wrap .exactButton{
    width: 169px;
    height: 47px;
    margin: 20px ;
  }
  .department_header{
    height:36px;
    font-size:18px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(38,42,47,1);
    line-height: 36px;
  }
  .ruleRed{
    color: #f00;
    font-size: 12px;
    /*text-indent: 15px;*/
  }
  /*.el-table /deep/ tr th:nth-of-type(1)  .cell{*/
    /*text-align: right;*/
  /*}*/
  /*!*.el-table /deep/ tr:nth-of-type(2) th:nth-of-type(1) .cell:before,*!*/
  /*.el-table /deep/ tr:nth-of-type(3) th:nth-of-type(1) .cell:before,*/
  /*.el-table /deep/ tr:nth-of-type(4) th:nth-of-type(1) .cell:before,*/
  /*.el-table /deep/ tr:nth-of-type(5) th:nth-of-type(1) .cell:before{*/
  /*content: "*";*/
  /*color: #f56c6c;*/
  /*margin-right: 4px;*/
/*}*/.el-form{
       display: flex;
       flex-wrap: wrap;
       justify-content: center;
       padding: 20px;
       margin:0 20px ;
       /*.el-select,.el-input,.el-date-picker,.el-textarea{*/
         /*width: 95%;*/
       /*}*/
       /*.el-textarea{*/
         /*margin: 10px 0;*/
       /*}*/
       /*/deep/ input{*/
         /*height: 28px;*/
       /*}*/
       /*/deep/ .el-input__icon{*/
         /*line-height: 28px;*/
       /*}*/
       .el-row{
         min-height: 30px;
         width: 100%;
         display: flex;
         align-items: center;
         .el-form-item{
           width: 100%;
           height: 100%;
           display: flex;
           border: 1px solid #EBEEF5;
           border-bottom: 0;
           margin-bottom: 0;
           /deep/ .el-form-item__label{
             background: #f5f7fa;
           }
           /deep/ .el-form-item__content{
             margin-left: 0 !important;
             padding: 10px;
             background: #fff;
             flex: 1;
           }
         }
         /deep/  .flex .el-form-item__content{
           display: flex;
           align-items: center;
           flex-wrap: wrap;
           p{
             width: 100%;
           }
           .el-select,.el-input{
              width: 300px;
              margin-right: 20px;
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
  .el-table{
    overflow: visible;
    /deep/ .cell{
      overflow: visible;
    }
    /deep/ .el-table__body-wrapper{
      overflow: visible;
    }
    /deep/ th{
      /*color: rgba(51, 51, 51, 1);*/
      background: #f5f7fa;
    }
  }

</style>
