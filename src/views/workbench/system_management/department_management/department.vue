<template>
  <div class="department">
    <h2 class="department_header">部门管理（地域）</h2>
    <div class="queryBlock">
      <div class="buttonWrap">
        <el-button type="primary" @click="mySearch" >搜索</el-button>
        <el-button type="primary" @click="detachMent"  >移除</el-button>
        <el-button type="primary" @click="jumpDepartAdd" v-allow="96">新增</el-button>
      </div>
      <div class="queryModular">
        <el-form ref="postForm"  size="mini" class="form-container">
          <el-form-item  label-width="130px"  label="部门名称:" class="postInfo-container-item">
            <el-select  default-first-option @change="selectGet2" v-model="queryData.department" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in queryDeptByConditionList"
                :key="item.deptId"
                :label="item.name"
                :value="item.deptId"
              >
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item  label-width="130px"  label="所属领域:" class="postInfo-container-item">
            <el-select  default-first-option @change="selectGet1" v-model="queryData.domain"  clearable filterable placeholder="请选择">
              <el-option
                v-for="item in domainNames"
                :key="item.domainName"
                :label="item.domainName"
                :value="item.id"
              >
              </el-option>

            </el-select>

          </el-form-item>
          <el-form-item  label-width="130px"  label="创建日期:" class="postInfo-container-item">
            <DataPicker
              class="dataPicker"
              v-model="timeData"
              type="date"
              placeholder="选择日期"
            @change="timePickerChange">
            </DataPicker>
          </el-form-item>
          <el-form-item  label-width="130px"  label="是否有效:" class="postInfo-container-item">
            <el-radio-group v-model="queryData.isactive">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
              <el-radio label="">全部</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table
      ref="departmentTree"
      :data="departData"
      style="width: 100%"
      :row-key="deptId"
      node-key="agencyId"
      >
      <el-table-column
        prop="name"
        label="部门名称"
        width="280">
      </el-table-column>
      <el-table-column
        prop="domainName"
        label="所属领域"
        width="280">
      </el-table-column>
      <el-table-column
        prop="parentName"
        label="所属上级部门(地域)"
        width="300">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="isactive"
        label="是否有效">
        <template slot-scope="scope">
          {{scope.row.isactive?'是':scope.row.isactive=='0'?'否':''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="jumpDepartmentModify(scope.row)" type="text" size="small"  v-allow="97">修改</el-button>
          <el-button type="text" size="small" @click="jumpStaff(scope.row)">成员</el-button>
          <el-button type="text" size="small" @click="jumpWorkingGroup(scope.row)">工作组</el-button>
          <el-button type="text" size="small" @click="deleteDeptId(scope.row)" v-allow="98">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryDeptByCondition, deleteDeptId, queryDomainNames, selectAllDept } from '@/api/systemList'
export default {
  name: 'Department',
  data() {
    return {
      departData: [],//列表数据
      queryDeptByConditionList:[],//部门数据
      domainNames:[],//领域数据
      department: '',//部门当前数据
      domain: '',//领域当前数据
      creatTime: '',//创建时间
      timeData:[],
      queryData:{//查询条件
        deptId: null,
        domainName:null,
        isactive:'',
        createTimeStart:'',
        createTimeEnd:'',
        department:''
      },
    }
  },
  created() {
    this.queryDomainNames()
    this.selectAllDept()
    this.queryDeptByCondition()
  },
  mounted(){
  //  this.expandAll()
  },
  methods: {
    timePickerChange(e){
      this.queryData.createTimeStart=e[0]
      this.queryData.createTimeEnd=e[1]
    },
    jumpDepartmentModify(query) {
      this.$router.push({path:'/workbench/system_management/department_detail/2', query})
    },
    jumpDepartAdd(){
      this.$router.push('/workbench/system_management/department_detail/1')
    },
    jumpWorkingGroup(query){
      this.$router.push({path:"/workbench/system_management/workingGroup_management",query})
    },
    jumpStaff(query){
      this.$router.push({ path: '/workbench/system_management/staff_management', query:{queryDeptByConditionName:query.name}})
    },
    changeDate(){
      this.queryData.createDate=this.formatDate(this.creatTime)
    },
    formatDate(time){
      return this.$commonUtils.formatDate(time)
    },
    // 搜索
    mySearch(){
      this.selectAllDept(this.queryData)
    },
    // 清除
    detachMent() {
      // this.domain='';
      // this.department='';
      // this.creatTime='';
      this.timeData = []
      this.queryData = { // 查询条件
        deptId: null,
        domainName: null,
        isactive: '',
        createTimeStart: '',
        createTimeEnd: '',
        department: ''
      }
      this.selectAllDept()
    },
    // 查询条件
    queryDeptByCondition(){
      queryDeptByCondition().then(res => {
        if (res.success) {
          this.queryDeptByConditionList= res.data
        }
      })
    },
    selectGet1(e){
      this.queryData.domainName=e
    },
    selectGet2(e){
      this.queryData.deptId=e
    },
    //部门管理删除
    deleteDeptId(res){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDeptId(res).then(res => {
          if (res.success) {
            this.selectAllDept(this.queryData)

            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //领域查询条件
    queryDomainNames() {
      queryDomainNames().then(res => {
        if (res.success) {
          this.domainNames = res.data
        }
      })
    },

    //部门管理列表
    selectAllDept(data) {
      selectAllDept(data)
        .then(res => {
          if (res.success) {
            this.departData=res.data
            var obj=this.departData
            var list=this.queryDeptByConditionList
            for (var i = 0, len = obj.length; i < len; i++) {
              obj[i].parentName=list.find(item=>obj[i].parent==item.deptId)?list.find(item=>obj[i].parent==item.deptId).name:''
              if (obj[i].children != null && obj[i].children.length > 0) {
                var factorial= function () {
                  var _obj = arguments[0];
                  for (var j = 0, _len = _obj.length; j < _len; j++) {
                    _obj[j].parentName=list.find(item=>_obj[j].parent==item.deptId)?list.find(item=>_obj[j].parent==item.deptId).name:''
                    if (_obj[j].children != null && _obj[j].children.length > 0) {
                      factorial(_obj[j].children);
                    }
                  }
                }
                factorial(obj[i].children)
              }
            }
            for(let i=0;i< this.departData.length;i++) {
              if (this.departData[i].children && this.departData[i].children.length !== 0) {
                this.expandAll()
                break;
              }
            }
          }
        })
    },
    //将多级数组合并
    getMenuName(obj) {
      var arr = [];
      arr.push(obj)
      for (var i = 0, len = obj.length; i < len; i++) {
        arr.push(obj[i].children);
        obj[i].parentName=this.queryDeptByConditionList.find(item=>obj[i].parent===item.deptId).name
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
    },
    deptId(row){
      return row.deptId
    },
    expandAll () {
      let timer= setInterval(()=>{
        if(this.$el.getElementsByClassName('el-table__expand-icon')[0]){
          const els = this.$el.getElementsByClassName('el-table__expand-icon')[0]
          els.click()
          clearInterval(timer)
        }
      },60)
    }
  },
}
</script>

<style lang="scss" scoped>
  .queryBlock{
    border:1px solid rgba(191,191,191,1);
    padding: 15px;
    margin-bottom: 13px;
  }
  .department  .department_header{
  height:36px;
  font-size:18px;
  font-family:SourceHanSansCN-Normal;
  font-weight:400;
  color:rgba(38,42,47,1);
  line-height: 36px;
}
.department  .queryBlock{
    height:124px;
    border:1px solid rgba(191,191,191,1);
    padding: 15px;
    margin-bottom: 13px;
  }
.department .el-select{
    vertical-align: middle;
    margin-right:20px ;
  }
  .department  .buttonWrap{
    position: absolute;
    right: 50px;
  }
  .department .el-table{
    border:1px solid rgba(191,191,191,1);
    padding-left: 10px;
  }
  .queryModular{
    margin-bottom:15px;
  }
 .queryModular:nth-last-of-type(1){
    margin-bottom:0;
  }
  .form-container{
    width: 80%;
    .postInfo-container-item{
      display: inline-block;
    }
  }
  .dataPicker{
    height: 28px;
    line-height: 28px;
  }
</style>
