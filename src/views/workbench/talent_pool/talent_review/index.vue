<template>
  <div class="talent">
    <h2 class="department_header">{{ $route.meta.title }}</h2>
    <div class="queryBlock">
      <div class="buttonWrap">
        <el-button type="primary" @click="mySearch(1)">搜索</el-button>
        <el-button type="primary" @click="detachMent">重置</el-button>
        <el-button type="primary" @click="clearCache">清除缓存</el-button>
        <el-button type="primary" v-if="$store.getters.talentPoolPermission.permissions.includes(7)" @click="updateOrganization">更新组织架构</el-button>
        <el-button type="primary" v-if="$store.getters.talentPoolPermission.permissions.includes(4)" @click="updatePersonnel">更新人员</el-button>
        <el-button type="primary" v-if="$store.getters.talentPoolPermission.permissions.includes(5)" @click="downloadMaterial">导出</el-button>
      </div>
      <div class="queryModular">
        <el-form ref="postForm"  size="mini" class="form-container">
          <el-form-item  label-width="130px"  label="员工姓名:" class="postInfo-container-item">
            <el-select  default-first-option  v-model="talentCode" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in namesList"
                :key="item.talentCode"
                :label="item.talentName"
                :value="item.talentCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label-width="130px"  label="部门工作组:" class="postInfo-container-item">
            <el-multi-cascader
              ref="multiCascader"
              :show-all-levels="false"
              :options="options"
              :props="{value : 'deptCode', label: 'wkGroupName', children: 'children'}"
              multiple
              filterable
              clearable
              change-on-select
              collapse-tags
              selectChildren
              v-model="deptCode"> </el-multi-cascader>
          </el-form-item>
          <el-form-item label-width="130px" label="岗位名称:" class="postInfo-container-item">
            <el-select default-first-option v-model="posId" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in queryPositionList"
                :key="item.posId"
                :label="item.posName"
                :value="item.posId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="130px" label="是否在职:" class="postInfo-container-item">
            <el-radio v-model="empStatus" label="">全部</el-radio>
            <el-radio v-model="empStatus" label="1">正式员工</el-radio>
            <el-radio v-model="empStatus" label="2">实习员工</el-radio>
            <el-radio v-model="empStatus" label="3">兼职人员</el-radio>
            <el-radio v-model="empStatus" label="4">试用员工</el-radio>
            <el-radio v-model="empStatus" label="5">退休返聘</el-radio>
            <el-radio v-model="empStatus" label="0">离职员工</el-radio>
          </el-form-item>
          <el-form-item  v-if="$store.getters.talentPoolPermission.permissions.includes(6)" label-width="130px" label="查看审核数据:" class="postInfo-container-item">
            <el-checkbox v-model="unCheck" true-label='1'>查看</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table
      :data="talentList"
      style="width: 100%">
      <el-table-column
        prop="talentName"
        label="员工姓名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="mainDeptName"
        label="部门名称">
      </el-table-column>
      <el-table-column
        prop="mainWorkGroup"
        label="工作组"
        width="150">
      </el-table-column>
      <el-table-column
        prop="mainPosName"
        label="岗位名称">
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别">
      </el-table-column>
      <el-table-column
        prop="birthday"
        label="出生日期">
      </el-table-column>
      <el-table-column
        prop="joinDate"
        label="入职时间">
      </el-table-column>
      <el-table-column
        prop="regularDate"
        label="转正时间">
      </el-table-column>
      <el-table-column
        prop="expirationDate"
        label="合同到期时间">
      </el-table-column>
      <el-table-column
        prop="mainCollege"
        label="学历">
      </el-table-column>
      <el-table-column
        prop="mainMajor"
        label="专业">
      </el-table-column>
      <el-table-column
        prop="mainLanguage"
        label="外语语种">
      </el-table-column>
      <el-table-column
        prop="mainLanguageDegree"
        label="外语等级">
      </el-table-column>
      <el-table-column
        prop="empStatusStr"
        label="用工状态">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="jumpStaffModify(scope.row)" type="text" size="small">成长档案</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="queryTalentPersonList"
    />
    <el-dialog title="更新组织架构数据" :visible.sync="updateorganization" width="400px">
      <updateOrganization></updateOrganization>
    </el-dialog>
    <el-dialog title="更新人员数据" :visible.sync="updatepersonnel" width="400px">
      <UpdatePersonnel></UpdatePersonnel>
    </el-dialog>
  </div>
</template>

<script>
import updateOrganization from './components/updateOrganization';
import UpdatePersonnel from './components/UpdatePersonnel';
import Pagination from '@/components/Pagination';
import { queryTalentPersonList, queryPersonAll, queryPositionAll, queryDepartmentAll, exportPersonListToExcel, talentClearCache } from '@/api/hrmList'
export default {
  data() {
    return {
      dashboard: false,
      updateorganization: false,
      updatepersonnel: false,
      talentCode: '', // 员工
      deptCode: '', // 工作组
      posId: '', // 岗位名称
      isSearch: 0,
      empStatus: '', // 是否离职 0=>离职员工，1=>正式员工，2=>实习员工，3=>兼职人员，4=>试用人员，5=>退休返聘
      namesList: [], // 员工名字列表
      queryPositionList: [], // 岗位名列表
      unCheck: '',
      talentList: [],
      options: [],
      listQuery: {
        pageNo: 0,
        pageSize: 10
      },
      total: 0
    }
  },
  created() {
    this.queryPersonAll()
    this.queryPosition()
    this.queryDepartmentAll()
    this.mySearch(0)
  },
  methods: {
    // 获取用户数据
    queryTalentPersonList() {
      // 搜索条件查询
      const data = this.searchData()
      queryTalentPersonList(data).then(res => {
        this.talentList = res.data
        this.total = res.total
        this.talentList.forEach(item => {
          if (item.gender === 1) {
            item.gender = '男'
          } else {
            item.gender = '女'
          }
        })
      })
    },
    // 搜索条件
    searchData() {
      const data = {
        talentCode: this.talentCode,
        empStatus: this.empStatus,
        deptCodes: this.deptCode,
        unCheck: this.unCheck,
        posId: this.posId,
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
        isSearch: this.isSearch
      }
      return data
    },
    // 搜索
    mySearch(isSearch) {
      this.listQuery.pageNo = 1
      this.isSearch = isSearch
      this.queryTalentPersonList()
    },
    // 重置
    detachMent() {
      this.talentCode = ''
      this.empStatus = ''
      this.deptCode = []
      this.posId = ''
      this.listQuery.pageNo = 1
      this.queryTalentPersonList()
    },
    // 清除接口缓存
    clearCache() {
      talentClearCache().then(res => {
        if (res.success) {
          this.$message({
            message: res.message,
            type: 'success'
          });
        }
      })
    },
    // 更新组织架构
    updateOrganization() {
      this.updateorganization = true
    },
    // 更新人员
    updatePersonnel() {
      this.updatepersonnel = true
    },
    // 导出数据表格
    downloadMaterial() {
      const data = this.searchData()
      exportPersonListToExcel(data).then(res => {
        if (res.success) {
          const downData={
            url:`ipdoc${res.data}`,
            success(){
              // notify.close()
            }
          }
          this.$commonUtils.downLoadAll(downData)
        }
      })
    },
    jumpStaffModify(query) {
      this.$router.push('/workbench/talent_pool/talent_review_detail/'+query.talentCode)
    },
    queryPersonAll() {
      queryPersonAll().then(res => {
        if (res.success) {
          this.namesList = res.data
        }
      })
    },
    queryPosition() {
      queryPositionAll().then(res => {
        if (res.success) {
          this.queryPositionList = res.data
        }
      })
    },
    queryDepartmentAll() {
      queryDepartmentAll().then(res => {
        if (res.success) {
          this.options = res.data
        }
      })
    },
    formatDate(time) {
      return this.$commonUtils.formatDate(time)
    }
  },
  components: {
    Pagination,
    updateOrganization,
    UpdatePersonnel
  }
}
</script>

<style scoped lang="scss">
.talent  .department_header{
  width:72px;
  height:36px;
  font-size:18px;
  font-family:SourceHanSansCN-Normal;
  font-weight:400;
  color:rgba(38,42,47,1);
  line-height: 36px;
}
.talent  .queryBlock{
  border:1px solid rgba(191,191,191,1);
  padding: 15px;
  margin-bottom: 13px;
}
.talent .el-select{
  vertical-align: middle;
  margin-right:20px ;
}
.talent  .buttonWrap{
  float: right;
  margin-right: 58px ;
}
.talent .el-table{
  border:1px solid rgba(191,191,191,1);
  padding-left: 10px;
}
.talent .queryModular{
  margin-bottom:15px;
}
.talent .queryModular:nth-last-of-type(1){
  margin-bottom:0 ;
}
.form-container{
  width: 80%;
  .postInfo-container-item{
    display: inline-block;
  }
}
</style>
