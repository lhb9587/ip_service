<template>
  <div class="department_modify">
    <h2 class="department_header">{{$route.meta.title}}</h2>
    <el-table>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <table class="departmentDetail">
            <tr>
              <td>编号</td>
              <td><span style="padding-left:10px ">{{$route.query.deptId?$route.query.deptId:''}}</span></td>
            </tr>
              <tr>
                <td>是否分公司</td>
                <td>
                  <el-radio-group v-model="isbranch">
                  <el-radio label="1" >是</el-radio>
                  <el-radio label="0" >否</el-radio>
                </el-radio-group >
                </td>
              </tr>
            <tr v-if="isbranch==1">
              <td>分公司全称</td>
              <td>
                <el-input  ref="companyName" class="sendInfoName" v-model="companyName" placeholder="请输入内容"></el-input>
                <p class="ruleRed" v-show="rules.companyName">已有该名称</p>
              </td>
            </tr>
            <tr v-if="isbranch==1">
              <td>分公司简称</td>
              <td>
                <el-input  ref="companyShortName" class="sendInfoName" v-model="companyShortName" placeholder="请输入内容"></el-input>
                <p class="ruleRed" v-show="rules.companyShortName">已有该名称</p>
              </td>
            </tr>
            <tr>
              <td>所属上级部门(地域)</td>
              <td>
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
                <p class="ruleRed" v-show="rules.superiorDepartments">请选择上级部门</p>
              </td>
            </tr>

            <tr>
              <td>是否有效</td>
              <td>
                <el-radio-group  v-model="isactive">
                  <el-radio  label="1">是</el-radio>
                  <el-radio  label="0">否</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td>地域部门负责人</td>
              <td>
                <el-select style="width: 100%;" multiple allow-create default-first-option  :clearable='true' placeholder="请选择" v-model="deptBossId" @change="changedeptBossId" filterable>
                  <el-option v-for="(item,key)  in $store.getters.userList" :key="key" :label="item.fullname" :value="item.userId">
                    <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
            <tr>
              <td>部门名称</td>
              <td>
                <el-input ref="departmentName"  class="sendInfoName" v-model="departmentName" placeholder="请输入内容"></el-input>
                <p class="ruleRed" v-show="rules.departmentName==1">已有该名称</p>
                <p class="ruleRed" v-show="rules.departmentName==2">该项不能为空</p>
              </td>
            </tr>
          </table>
        </template>
      </el-table-column>
    </el-table>
    <div class="button_wrap">
      <el-button class="exactButton" type="primary" @click="submit" >确定</el-button>
      <el-button class="exactButton" plain @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import getPageTitle from '@/utils/get-page-title'
import { createDept,queryDeptByCondition ,selectAllDept, updateDeptById} from '@/api/systemList'
export default {
  name: "department_add",
  data() {
    return {
      deptBossId: [],
      superiorDepartments:[],//部门所属上级
      departmentName:'',//部门名称
      isactive:'1',//是否有效
      isbranch:'0',//是否是分公司
      companyName:'',//分公司全称
      companyShortName:'',//分公司简称
      departData:[],
      sendData: {},
      queryDeptByConditionList:[],
      nameList:[],
      companyShortNameList:[],
      companyNameList:[],
      defaultParams:{
        value: 'deptId',
        label: 'name',
        checkStrictly: true
      },
      rules:{
        companyName:false,
        departmentName:0,
        companyShortName:false,
        superiorDepartments:false
      },
      submitFlag:false,
    }
  },
  created(){
    this.queryDeptByCondition()
    this.selectAllDept()
    if(this.$route.params.type==2){
      this.isactive=this.$route.query.isactive.toString()
      this.isbranch=this.$route.query.isbranch.toString()
      this.departmentName=this.$route.query.name
      this.deptBossId=this.$route.query.deptBossId.split(',').map(item => +item)
      this.companyName=this.$route.query.companyName
      this.companyShortName=this.$route.query.companyShortName
    }
  },
  beforeRouteEnter:(to,from,next)=> {
    if (to.params.type === '1') {
      document.title = getPageTitle(to.meta.title = "部门新增")
      next(res => {
      });
    } else {
      document.type = getPageTitle(to.meta.title = "部门修改")
      next(res => {
      });
    }
  },
  methods:{
    changedeptBossId(value){
      console.log('+++++++++++++++++')
      console.log(value)
      console.log('+++++++++++++++++')
    },
    queryDeptByCondition(){
      queryDeptByCondition().then(res=>{
        if(res.success){
          this.queryDeptByConditionList=res.data
          this.nameList=this.unique(this.queryDeptByConditionList.map(item=>item.name))
          this.companyShortNameList=this.unique(this.queryDeptByConditionList.map(item=>item.companyShortName))
          this.companyNameList=this.unique(this.queryDeptByConditionList.map(item=>item.companyName))
        }
      })
    },
    unique(arr) {
     return Array.from(new Set(arr)).filter(item=>item!==null)
    },
    selectAllDept(){
      selectAllDept().then(res=>{
        if(this.$route.params.type=='2'){
          let menuNameList=util.getMenuName(res.data).filter(item=>item!=undefined);
          function familyTree(arr, pid) {
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
          this.superiorDepartments =familyTree(menuNameList, menuNameList.find(item => item.deptId == this.$route.query.deptId).parent).reverse().map(item => item.deptId)
        }
        this.departData =res.data
      })
    },
    catchange(e){
      this.superiorDepartments=e
    },
    submitRule(){

      if(this.$route.params.type==2){
        this.nameList= this.nameList.filter(item=>item!==this.$route.query.name)
        this.companyShortNameList=this.companyShortNameList.filter(item=>item!==this.$route.query.companyShortName)
        this.companyNameList=this.companyNameList.filter(item=>item!==this.$route.query.companyName)
      }
      if(this.$refs.departmentName.value.trim()){
        if(this.nameList.includes(this.$refs.departmentName.value.trim())){
          this.rules.departmentName=1
          return false
        }else {
          this.rules.departmentName=0
        }
      }else {
        this.rules.departmentName=2
        return false
      }
      if(this.isbranch==1){
        if(this.companyShortNameList.includes(this.$refs.companyShortName.value.trim())){
          this.rules.companyShortName=true
          return false
        }else {
          this.rules.companyShortName=false
        }
        if(this.companyNameList.includes(this.$refs.companyName.value.trim())){
          this.rules.companyName=true
          return false
        }else {
          this.rules.companyName=false
        }
      }
      if(!this.superiorDepartments.length){ this.rules.superiorDepartments=true; return false }else {this.rules.superiorDepartments=false }
      return true
    },
    submit(){//提交
      if (!this.submitRule()){ return }
      this.sendData.isactive=this.isactive
      this.sendData.isbranch=this.isbranch
      this.sendData.parent=this.superiorDepartments[this.superiorDepartments.length-1]
      this.sendData.name=this.departmentName.trim()
      this.sendData.companyName=this.companyName
      this.sendData.companyShortName=this.companyShortName
      this.sendData.deptBossId=this.deptBossId+''
      if(this.$route.params.type==2){
        this.sendData.deptId=this.$route.query.deptId
        updateDeptById(this.sendData)
          .then(res => {
            if (res.success) {
              this.cancel()
            }
          })
      }else {
        createDept(this.sendData)
          .then(res => {
            if (res.success) {
              this.cancel()
            }
          })
      }
    },
    //取消跳转
    cancel(){
      this.$router.history.go(-1)
    }
  }
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
  .department_modify{
    margin-top:20px ;
  }
  .department_modify /deep/ .el-table__empty-block{display: none}
  .department_modify /deep/  tr th:nth-child(1){
    border: 0;
  }
  .department_modify tr td:nth-child(1){
    background: #f5f7fa;
  }
  .department_modify .button_wrap {
    display: flex;
    justify-content: center
  }
  .department_modify .button_wrap .exactButton{
    width: 169px;
    height: 47px;
    margin: 20px ;
  }
  .department_modify .sendInfoName input{
    background: transparent;
    border: 0;
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
    text-indent: 15px;
  }
.departmentDetail{
  width: 100%;
  border-collapse:collapse;
  tr td:nth-child(1){
    text-align: right;
    width: 300px;
    padding-right: 50px;
  }
  td{

    border: 1px solid #EBEEF5;
  }
}
</style>
