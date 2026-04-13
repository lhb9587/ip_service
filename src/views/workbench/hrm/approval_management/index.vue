<template>
  <div class="hrm-container">
    <div class="hrm-header">
      <span>审批管理</span>
      <div style="float: left; margin-left:15px; overflow: hidden;">
        <el-popover
          placement="bottom-start"
          width="808"
          trigger="hover"
          :disabled="approvalVisible">
          <div>
            <div slot="title" class="dialog-header-title">
              <i class="el-icon-edit-outline"></i>
              <span>项目申请类型</span>
            </div>
            <el-card
              v-for="(card, index) in cards"
              :key="index"
              shadow="always"
              class="box-card"
              @click.native="createApproval(card)"
            >
              <span class="iconfont" :class="card.icon"></span>
              {{ card.name }}
            </el-card>
          </div>
          <el-button utton slot="reference" plain type="primary" size="small">创建审批</el-button>
        </el-popover>
      </div>
    </div>
    <div class="parting-line"></div>
    <div class="hrm-inquire">
      <el-form :inline="true" :model="inquireParames" class="demo-form-inline" size="small">
        <el-form-item label="审批类型">
          <el-select v-model="inquireParames.approveTypeId" placeholder="请选择" :clearable="true">
            <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select v-model="inquireParames.status" placeholder="请选择" :clearable="true">
            <el-option v-for="(item,index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="发起日期:">
          <!-- @change="handleSearch(1)" -->
          <DateRange v-model="inquireParames.appDateArray"></DateRange>
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-input v-model="inquireParames.keyword" placeholder="请输入关键字" suffix-icon="el-icon-search" style="width: 300px;" :clearable="true"></el-input></el-input>-->
<!--        </el-form-item>-->
      </el-form>
    </div>
    <div class="hrm-list">
      <el-table
        ref="multipleTable"
        :data="tableData"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ textAlign: 'center' }"
        tooltip-effect="dark"
        style="width: 100%;"
        :max-height="maxHeight"
        >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="审批编号" width="100">
          <template slot-scope="scope">
            <span style="color: #2561EF;">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="approveType" label="审批类型"  width="180"></el-table-column>
        <el-table-column prop="createDate" label="发起时间" width="180"></el-table-column>
        <el-table-column prop="createUser" label="发起人" width="150"></el-table-column>
        <el-table-column prop="currentTasker" label="当前任务人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="approvalStatus" label="审批状态"  width="120"></el-table-column>
        <el-table-column prop="statusStr" label="任务状态" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" style="color: #2561EF;">{{ scope.row.statusStr }}</span>
            <span v-if="scope.row.status == 1" style="color: rgb(2, 168, 2);">{{ scope.row.statusStr }}</span>
            <span v-if="scope.row.status == 2" style="color: rgb(195, 20, 0);">{{ scope.row.statusStr }}</span>
            <span v-if="scope.row.status == 3" style="color: #ea3323;">{{ scope.row.statusStr }}</span>
          </template>
        </el-table-column>
<!--        <el-table-column prop="title" label="审批标题"></el-table-column>-->
        <el-table-column label="操作" width="320px" style="text-align: left;">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="vDetails(scope.row)">查看详情</el-button>
            <el-button type="primary" size="small" @click="vEdit(scope.row)" v-if="scope.row.isUpdate == 1">修改</el-button>
            <el-button type="danger" size="small" @click="vDelete(scope.row)" v-if="scope.row.erasure == 0">删除</el-button>
            <el-button type="danger" size="small" @click="vWithdraw(scope.row)" v-if="scope.row.withdraw == 1">撤销</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="hrm-paging">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.pageNo"
          :limit.sync="listQuery.pageSize"
          @pagination="queryPersonApproveList"
        />
      </div>
      <ExamineDetail v-if="appDetailVisible" :approveId="approveId" :approveTypeId="approveTypeId" @offDetail="offDetail()"></ExamineDetail>
      <ApprovalDetail v-if="approvalDetail" :appTypeId="appTypeId" :approveId="approveId" :appName="appName" :action="action" @offExamine="offExamine()"></ApprovalDetail>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import List from './list'
import ApprovalDetail from './components/ApprovalDetail'
import ExamineDetail from './components/ExamineDetail'
import { queryTalentPersonInfo, queryPersonApproveList, queryPersonApproveTypes, deletePersonApprove,revokeApproveProcess } from '@/api/hrmList.js'
export default {
  name: 'index',
  components: {
    List,
    Pagination,
    ApprovalDetail,
    ExamineDetail
  },
  data() {
    return {
      action:'create',
      approvalVisible: false,
      appDetailVisible: false,
      approvalDetail: false,
      title: '招聘申请（正式岗位）',
      approveId: null,
      appTypeId: null,
      pageName: '',
      total: 0,
      auditNum: '',
      talentInfo: [],
      appName: '',
      checkNames: ['实习生'],
      cards: [],
      typeList : [],
      statusList: [
        { label:'待审核', value: 0 },
        { label:'审批通过', value: 1 },
        { label:'审批拒绝', value: 2 },
        // { label:'审批撤销', value: 'cx' },
      ],
      inquireParames: {
        approveTypeId: null,
        status: null,
        data: '',
        keyword: '',
        appDateArray: []
      },
      tableData: [],
      multipleSelection: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
    }
  },
  computed: {
    maxHeight() {
      return document.documentElement.clientHeight - 240
    },
  },
  methods: {
    // 根据具体的权限检查逻辑判断是否有权限
    checkPermission(permission) {
      if (permission){
        return this.$store.getters.permissions.includes(permission)
      }
      return true
    },
    // 检查名称权限
    checkName(name) {
      if (!name) {
        return true;
      }
      if (this.checkNames.includes(name) && this.talentInfo) {
        if (name === '实习生') {
          return this.talentInfo.posName === name;
        }
      }
      return false;
    },
    // 获取人员信息
    queryTalentPersonInfo() {
      if (this.$store.state.user.userId != 2) {
        queryTalentPersonInfo().then(res => {
          console.log(res.data)
          this.talentInfo = res.data
        })
      }
    },
    // 查询审批流程项目列表
    queryPersonApproveTypes() {
      queryPersonApproveTypes().then(res => {
        let objType = {
          "success": true,
          "data": [
            {id: 1, name: "招聘申请（正式岗位）", processDefineId: 27, permissionId: 299, icon: "icon-recruit-item", checkName: null},
            {id: 2,name: "招聘申请（实习生岗位）",processDefineId: 28,permissionId: 299,icon: "icon-recruit-item",checkName: null},
            {id: 3,name: "入职审批（正式岗位）",processDefineId: 29,permissionId: 363,icon: "icon-ruzhishenpi",checkName: null},
            {id: 4,name: "入职审批（实习生岗位）",processDefineId: 30,permissionId: 363,icon: "icon-ruzhishenpi",checkName: null},
            {id: 5,name: "转正申请",processDefineId: 31,permissionId: null,icon: "icon-zhuanzhengshenqing",checkName: null},
              {
                  id: 6,
                  name: "实习评价",
                  processDefineId: 32,
                  permissionId: null,
                  icon: "icon-pingjia",
                  checkName: "实习生"
              },
              {
                  id: 7,
                  name: "调动申请",
                  processDefineId: 33,
                  permissionId: null,
                  icon: "icon-tiaodongshenpi",
                  checkName: null
              },
              {
                  id: 8,
                  name: "调薪审批",
                  processDefineId: 34,
                  permissionId: 299,
                  icon: "icon-tiaogangtiaoxin",
                  checkName: ""
              },
              {
                  id: 9,
                  name: "晋升申请",
                  processDefineId: 35,
                  permissionId: null,
                  icon: "icon-jinsheng-zhuangang",
                  checkName: null
              },
              {
                  id: 10,
                  name: "晋升审批",
                  processDefineId: 36,
                  permissionId: 299,
                  icon: "icon-jinshenglixiang",
                  checkName: null
              },
              {
                  id: 11,
                  name: "离职申请",
                  processDefineId: 37,
                  permissionId: null,
                  icon: "icon-yuangonglizhishenqingbiao",
                  checkName: null
              },
              {
                  id: 12,
                  name: "员工辞退申请",
                  processDefineId: 38,
                  permissionId: 299,
                  icon: "icon-lizhishenqing",
                  checkName: null
              },
              {
                  id: 13,
                  name: "合同续签征询",
                  processDefineId: 39,
                  permissionId: 363,
                  icon: "icon-hetongqianding",
                  checkName: null
              },
              {
                  id: 14,
                  name: "合同续签通知",
                  processDefineId: 40,
                  permissionId: 363,
                  icon: "icon-hetongqianding",
                  checkName: null
              },
              {
                  id: 15,
                  name: "实习生工资审批",
                  processDefineId: 41,
                  permissionId: 365,
                  icon: "icon-shixishengribao",
                  checkName: null
              },
              {
                  id: 16,
                  name: "劳务用工工资审批",
                  processDefineId: 42,
                  permissionId: 365,
                  icon: "icon-gongzibiaoshenhe",
                  checkName: null
              },
              {
                  id: 17,
                  name: "执证申请（律师实习）",
                  processDefineId: 43,
                  permissionId: null,
                  icon: "icon-lvshijindiao",
                  checkName: null
              },
              {
                  id: 18,
                  name: "执证申请（专利代理师实习）",
                  processDefineId: 44,
                  permissionId: null,
                  icon: "icon-zhuanli",
                  checkName: null
              },
              {
                  id: 19,
                  name: "工作居住证办理申请",
                  processDefineId: 45,
                  permissionId: 299,
                  icon: "icon-juzhuzhengbanli",
                  checkName: null
              },
              {
                  id: 20,
                  name: "证明类申请",
                  processDefineId: 46,
                  permissionId: null,
                  icon: "icon-zhengming",
                  checkName: null
              },
              {
                  id: 21,
                  name: "宿舍住宿申请",
                  processDefineId: 47,
                  permissionId: null,
                  icon: "icon-zhusu",
                  checkName: null
              }
          ],
          "total": null,
          "currPage": null,
          "message": "查询审批项目列表成功！",
          "messageType": null
      }
        this.cards = res.data
        this.typeList = [...res.data]
      })
    },
    //获取列表
    queryPersonApproveList() {
      const data = {
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
        approveTypeId: this.inquireParames.approveTypeId,
        status: this.inquireParames.status,
        appDateArray: this.inquireParames.appDateArray
      }
      queryPersonApproveList(data).then(res => {
        this.tableData = res.data
        this.total = res.total
      })
    },
    // 点击审批项
    createApproval(item) {
      this.action = 'create'
      this.approvalDetail = true
      this.appTypeId = item.id
      this.appName = item.name
      this.approveId = null
    },
    // 查看详情
    vDetails(item) {
      this.appDetailVisible = true
      this.approveId = item.id
      this.approveTypeId = item.approveTypeId
    },
    // 修改
    vEdit(item) {
      this.action = 'edit'
      this.approvalDetail = true
      this.appTypeId = item.approveTypeId
      this.approveId = item.id
      this.appName = item.approveType
    },
    // 删除列表数据
    vDelete(val) {
      this.$confirm("确定删除这条审批？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deletePersonApprove({ id: val.id }).then(res => {
          this.$message({
            message: res.message,
            type: 'success'
          });
          this.queryPersonApproveList()
        })
      }).catch(() => {

      })
    },
    // 撤销
    vWithdraw(val) {
      this.$confirm("确定撤销这条审批？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        revokeApproveProcess({ id: val.id }).then(res => {
          this.$message({
            message: res.message,
            type: 'success'
          });
          this.queryPersonApproveList()
        })
      }).catch(() => {

      })
    },
    // 关闭审批
    offExamine() {
      this.approvalDetail = false
      this.queryPersonApproveList()
    },
    offDetail() {
      this.appDetailVisible = false
      this.queryPersonApproveList()
    },
    // 关闭审核列表
    close() {
      this.dialogVisible = false
    }
  },
  watch: {
    inquireParames: {
      handler(val) {
        this.listQuery.pageNo = 1
        this.queryPersonApproveList()
      },
      deep: true
    },
  },
  created() {
    this.queryTalentPersonInfo()
    this.queryPersonApproveList()
    this.queryPersonApproveTypes()
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/icons/font_4120659_yliomx4x1pc.css";
// /deep/ .el-dialog__header{
//   padding: 10px;
// }
/deep/ .el-dialog__headerbtn {
  top: 15px;
  right: 15px;
}
/deep/ .el-dialog__body{
  padding: 0 10px 10px 10px;
}
/deep/ .el-card__body{
  padding: 20px 0 20px 15px;
}
.hrm-container {
  width: 100%;
  background-color: #F2F2F2;
}
.parting-line {
  width: 100%;
  height: 0px;
  border-top: 1px solid #dfdfdf;
}

.hrm-header{
  width: 100%;
  height: 50px;
  background-color: #FFFFFF;
  color: #333;
  line-height: 50px;
  span{
    float: left;
    font-size: 18px;
    line-height: 50px;
    font-weight: bold;
  }
  .left-button{
    margin-left: 20px;
    // margin-top: 6px;
    float: left;
  }
  button{
    font-size: 16px;
    i{
      width: 20px;
      border-radius: 3px;
      background: #409eff;
      color: #fff
    }
  }
}
.hrm-inquire {
  width: 100%;
  padding-top: 30px;
  background-color: #FFFFFF;
}
.hrm-main{
  width:100%;
  padding: 15px;
  .main-list{
    width: 100%;
    padding: 0 10px 10px 10px;
    background-color: #FFFFFF;
  }
}
.app-div {
  display: inline-block;
}
.box-card {
  width: 240px;
  float: left;
  margin: 10px;
  cursor: pointer;
}
.hrm-list {
  .hrm-paging {
    background-color: #fff;
    padding-top: 20px;
  }
}
</style>
