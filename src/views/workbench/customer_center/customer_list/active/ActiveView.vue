<template>
  <div class="active-info">
    <el-button v-if="editStatus" type="primary" size="mini" @click="createActive" v-allow="71">新增</el-button>
    <div class="cust-active">
<!--      <div class="base-header">-->
<!--        <span class="left-line"></span>-->
<!--        <span class="right-text">客户活动</span>-->
<!--      </div>-->
      <div class="header-table">
        <el-table max-height="265" class="el-table1" size="mini" :data="activeList" fit empty-text="暂无数据"
                  highlight-current-row
                  current-row-key style="width: 100%;" @row-dblclick="rowDbClick">
          <el-table-column label="主题" align="left" width prop="subject" :filters="headFilters['subject']" :filter-method="filterHandler">
            <template slot-scope="scope">
              <span :title="scope.row.subject">{{ scope.row.subject }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" align="left" width prop="begindate" :filters="headFilters['begindate']" :filter-method="filterHandler">
            <template slot-scope="scope">
              <span :title="scope.row.begindate">{{ scope.row.begindate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="赠送礼品" align="left" width prop="putGift" :filters="headFilters['putGift']" :filter-method="filterHandler">
            <template slot-scope="scope">
              <span :title="scope.row.putGift">{{ scope.row.putGift }}</span>
            </template>
          </el-table-column>
          <el-table-column label="内容描述" align="left" width prop="description" :filters="headFilters['description']" :filter-method="filterHandler">
            <template slot-scope="scope">
              <span :title="scope.row.description">{{ scope.row.description }}</span>
            </template>
          </el-table-column>

          <el-table-column v-if="editStatus" label="操作" align="left" width="" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <span class="pointer" @click="delActive(scope.row, scope.$index)" v-allow="74">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="hh-active">
      <div class="base-header">
        <span class="left-line"></span>
        <span class="right-text">客户活动-工时</span>
      </div>
      <div class="header-table">
        <el-table max-height="265" class="el-table1" size="mini" :data="hActiveList" fit empty-text="暂无数据"
                  highlight-current-row
                  current-row-key style="width: 100%;">
          <el-table-column label="姓名" align="left" width prop="userFullName" sortable :filters="headFilters1['userFullName']" :filter-method="filterHandler1">
            <template slot-scope="scope">
              <span :title="scope.row.userFullName">{{ scope.row.userFullName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色" align="left" width prop="userRoleName" sortable :filters="headFilters1['userRoleName']" :filter-method="filterHandler1">
            <template slot-scope="scope">
              <span :title="scope.row.userRoleName">{{ scope.row.userRoleName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="活动类型" align="left" width prop="actTypeStr" sortable :filters="headFilters1['actTypeStr']" :filter-method="filterHandler1">
            <template slot-scope="scope">
              <span :title="scope.row.actTypeStr">{{ scope.row.actTypeStr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" align="left" width prop="begindate" sortable :filters="headFilters1['begindate']" :filter-method="filterHandler1">
            <template slot-scope="scope">
              <span :title="scope.row.begindate">{{ scope.row.begindate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="内容描述" align="left" width prop="description" sortable :filters="headFilters1['description']" :filter-method="filterHandler1">
            <template slot-scope="scope">
              <span :title="scope.row.description">{{ scope.row.description }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog style="position:absolute;left: 0;top: 0;" :fullscreen="false" :show-close="false"
               :close-on-click-modal="false" :modal="false"
               :append-to-body="false" :title="'活动 - ' + title" :visible.sync="dialogActiveView" width="70%">
      <active-detail ref="activeDetail" v-if="custActId || title === '新建'" :title="title"
                     :custActId="custActId" :custName="fullname" :custId="custId"></active-detail>
      <div slot="footer" class="fl-ac-jc" style="height: 35px;">
        <el-button size="small" type="primary" v-if="title === '新建'" style="margin-top: 0" @click="updateActive">创建活动
        </el-button>
        <el-button size="small" type="primary" v-if="title === '修改'" style="margin-top: 0" @click="updateActive">保存修改
        </el-button>

        <el-button type="" size="small" style="margin-top: 0" @click="closeDialog(false)">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addActivityUrl, delActivity,
    queryActivityListUrl,
    queryhuodongList,
    updateActivityUrl
  } from "../../../../../api/customerList";
  import ActiveDetail from "./ActiveDetail";

  export default {
    name: "ActiveView",
    components: {ActiveDetail},
    props: {
      tabNo: {},
      editStatus: {
        type: Boolean,
        default: false
      },
      custId: {},
      fullname: {},
    },
    data() {
      return {
        headFilters: {},
        headFilters1: {},
        isSave: false,
        custActId: '',
        dialogActiveView: false,
        title: '',
        activeList: [],
        hActiveList: []
      }
    },
    created() {
      this.queryActiveList()
    },
    methods: {
      filterHandler(value, row, column) {
        const property = column['property']
        return row[property] === value
      },
      filterHandler1(value, row, column) {
        const property = column['property']
        return row[property] === value
      },
      createActive() {
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.title = '新建'
        this.dialogActiveView = true
      },
      updateActive() {
        if (this.title === '新建') {
          this.$refs.activeDetail.createActivity((tempData) => addActivityUrl(tempData).then(res => {
            this.$message.success('新建成功!')
            this.isSave = true
            this.closeDialog(true)
          }))
        } else {
          this.$refs.activeDetail.updateActivity((tempData) => updateActivityUrl(tempData).then(res => {
            this.$message.success('保存成功!')
            this.isSave = true
            this.closeDialog(true)
          }))
        }
      },
      async closeDialog(isSearch) {
        if (this.title === '新建' && !this.isSave) {
          // await delActivity({custActId: this.$refs.activeDetail.$data.hdFromData.custActId})
        }
        isSearch === true && this.queryActiveList()
        this.title = ''
        this.custActId = ''
        this.isSave = false
        this.dialogActiveView = false
        this.$emit('changeMask', {type: 'del', value: this.tabNo})
      },
      delActive(row, index) {
        this.$confirm(`确认是否删除该活动？`, '删除', {
          confirmButtonText: '确定',
          type: "warning"
        }).then(() => {
          delActivity({custActId: row.custActId}).then(res => {
            this.$message.success('删除成功!')
            this.activeList.splice(index, 1)
            // this.closeDialog(true)
          })
        })
      },
      rowDbClick(row) {
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.custActId = row.custActId
        this.title = this.editStatus && this.$store.getters.permissions.includes(73) ? '修改' : '查看'
        this.dialogActiveView = true
      },
      queryActiveList() {
        queryActivityListUrl({custId: this.custId, isCustomer: 1, pageSize: 9999}).then(res => {
          this.activeList = res.data
          this.headFilters = this.$commonUtils.tableFilter(this.activeList)
        })
        queryhuodongList({
          custId: this.custId,
          pageSize: 9999
        }).then(res => {
          this.hActiveList = res.data
          this.headFilters1 = this.$commonUtils.tableFilter(this.hActiveList)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .active-info {
    /*background-color: #fff;*/
    /*padding: 10px 15px;*/

    .el-button {
      float: right;
      margin-right: 15px;
      margin-top: 10px;
    }

    .cust-active, .hh-active {
      padding: 10px 15px;
      background-color: #fff;
    }

    .hh-active {
      margin-top: 15px;

      .el-button {
        float: right;
        margin-right: 0;
        margin-top: 0px;
      }
    }

    .base-header {
      /*background-color: #fff;*/
      display: flex;
      align-items: center;


      .left-line {
        display: inline-block;
        width: 10px;
        height: 26px;
        background-color: #409EFF;
        margin-right: 10px;
      }

      .right-text {
        font-weight: bold;
      }
    }
  }

  > > > .header-table {
    margin-top: 10px;
    padding: 0 0 0 15px;

    .el-table__header-wrapper {
      border: 1px solid #EBEEF5;
      border-bottom: none;

      th {
        background-color: #FAFAFA;
        font-size: 16px;
        color: #555555;
        font-weight: normal;
      }
    }
  }

  > > > .el-table1 {
    /*height: auto;*/

    .cell {
      max-height: 70px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }

  > > > .el-dialog {
    margin-top: 5vh !important;
  }

  > > > .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    max-height: 450px;
    overflow: auto;
  }


</style>
