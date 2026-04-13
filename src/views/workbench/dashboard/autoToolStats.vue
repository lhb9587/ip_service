<template>
  <div class="container">
    <div class="main">
      <div class="main-list">
        <!-- 查询条件区域 -->
        <div class="hrm-search">
          <el-date-picker
            v-model="createDateArray"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 400px; margin-right: 10px;"
            @change="handleSearch">
          </el-date-picker>
          
          <el-select
            v-model="docType"
            placeholder="选择工具类型"
            clearable
            style="width: 250px; margin-right: 10px;"
            @change="handleSearch">
            <el-option label="异议方案自动撰写" :value="1"></el-option>
            <el-option label="报驳回通知邮件自动撰写" :value="2"></el-option>
            <el-option label="驳回复审（简单理由）自动撰写" :value="3"></el-option>
            <el-option label="商品服务推荐" :value="4"></el-option>
          </el-select>
          
          <el-select
            v-model="createUserId"
            placeholder="选择使用人"
            clearable
            style="width: 200px; margin-right: 10px;"
            @change="handleSearch">
            <el-option
              v-for="user in userList"
              :key="user.userId"
              :label="user.fullname"
              :value="user.userId">
            </el-option>
          </el-select>
          
          <!-- <el-button size="mini" type="primary" @click="handleSearch">查询</el-button> -->
          <el-button size="mini" @click="handleReset">重置</el-button>
        </div>
        
        <!-- 统计概览区域 -->
        <div class="stats-overview" v-if="overviewData.length > 0">
          <div class="stats-title">使用统计概览</div>
          <div class="stats-cards">
            <div class="stat-card" v-for="item in overviewData" :key="item.docType">
              <div class="stat-name">{{ item.name }}</div>
              <div class="stat-value">{{ item.total }}</div>
              <div class="stat-label">总使用次数</div>
            </div>
          </div>
        </div>
        
        <!-- 统计列表 -->
        <div class="stats-list">
          <div class="list-title">使用统计明细</div>
          <el-table
            :data="tableData"
            style="width: 100%"
            v-loading="loading"
            border
            max-height="400"
            @row-click="handleRowClick">
            <el-table-column
              prop="name"
              label="工具名称"
              min-width="220"
              align="center"
              :filters="toolNameFilters"
              :filter-method="filterToolName"
              filter-placement="bottom-end">
            </el-table-column>
            <el-table-column
              prop="fullname"
              label="使用人"
              width="150"
              align="center"
              :filters="userNameFilters"
              :filter-method="filterUserName"
              filter-placement="bottom-end">
            </el-table-column>
            <el-table-column
              prop="value"
              label="使用次数"
              width="150"
              align="center"
              sortable>
            </el-table-column>
            <el-table-column
              label="操作"
              width="150"
              align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click.stop="viewDetail(scope.row)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    
    <!-- 详情对话框 -->
    <el-dialog
      :title="detailTitle"
      :visible.sync="detailVisible"
      width="80%"
      :close-on-click-modal="false">
      <div v-loading="detailLoading">
        <el-table
          :data="detailData"
          style="width: 100%"
          border
          max-height="500">
          <el-table-column
            prop="name"
            label="工具名称"
            width="300"
            align="center">
          </el-table-column>
          <el-table-column
            prop="fullname"
            label="使用人"
            width="120"
            align="center">
          </el-table-column>
          <el-table-column
            prop="applicantName"
            label="客户/申请人名称"
            min-width="200"
            align="center"
            :filters="detailApplicantFilters"
            :filter-method="filterDetailApplicant"
            filter-placement="bottom-end">
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="使用时间"
            width="200"
            align="center"
            sortable>
          </el-table-column>
        </el-table>
        
        <!-- 详情分页 -->
        <div class="pagination-wrap">
          <el-pagination
            @size-change="handleDetailSizeChange"
            @current-change="handleDetailCurrentChange"
            :current-page="detailPageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="detailPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="detailTotal">
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { autoToolUseStatistic, autoToolUseDetail, queryToolUserIdList } from '@/api/dashboard.js'
import { formatDate } from '@/utils'

export default {
  name: 'autoToolStats',
  data() {
    return {
      createDateArray: [],
      docType: null,
      createUserId: null,
      userList: [],
      tableData: [],
      overviewData: [],
      loading: false,
      // 详情对话框相关
      detailVisible: false,
      detailLoading: false,
      detailTitle: '',
      detailData: [],
      detailPageNo: 1,
      detailPageSize: 20,
      detailTotal: 0,
      currentRow: null
    }
  },
  computed: {
    // 主列表-工具名称筛选项
    toolNameFilters() {
      const names = [...new Set(this.tableData.map(item => item.name))]
      return names.map(name => ({ text: name, value: name }))
    },
    // 主列表-使用人筛选项
    userNameFilters() {
      const names = [...new Set(this.tableData.map(item => item.fullname))]
      return names.map(name => ({ text: name, value: name }))
    },
    // 详情列表-工具名称筛选项
    detailToolNameFilters() {
      const names = [...new Set(this.detailData.map(item => item.name))]
      return names.map(name => ({ text: name, value: name }))
    },
    // 详情列表-使用人筛选项
    detailUserNameFilters() {
      const names = [...new Set(this.detailData.map(item => item.fullname))]
      return names.map(name => ({ text: name, value: name }))
    },
    // 详情列表-客户名称筛选项
    detailApplicantFilters() {
      const names = [...new Set(this.detailData.map(item => item.applicantName).filter(name => name))]
      return names.map(name => ({ text: name, value: name }))
    }
  },
  created() {
    this.initDateRange()
    this.loadUserList()
    this.loadData()
  },
  methods: {
    // 初始化默认时间范围(本年)
    initDateRange() {
      const now = new Date()
      const year = now.getFullYear()
      // 本年第一天
      const start = new Date(year, 0, 1)
      // 本年最后一天
      const end = new Date(year, 11, 31)
      this.createDateArray = [formatDate(start), formatDate(end)]
    },
    
    // 加载用户列表
    loadUserList() {
      queryToolUserIdList().then(res => {
        if (res.success) {
          this.userList = res.data || []
        } else {
          this.$message.error(res.message || '查询用户列表失败')
        }
      }).catch(err => {
        console.error('查询用户列表失败', err)
      })
    },
    
    // 加载统计列表数据
    loadData() {
      this.loading = true
      const params = {
        createDateArray: this.createDateArray,
        createUserId: this.createUserId || undefined,
        docType: this.docType
      }
      
      autoToolUseStatistic(params).then(res => {
        this.loading = false
        if (res.success) {
          this.tableData = res.data || []
          
          // 生成统计概览数据
          this.generateOverview()
        } else {
          this.$message.error(res.message || '查询失败')
        }
      }).catch(err => {
        this.loading = false
        this.$message.error('查询失败')
        console.error(err)
      })
    },
    
    // 生成统计概览数据
    generateOverview() {
      const toolNames = {
        1: '异议方案自动撰写',
        2: '报驳回通知邮件自动撰写',
        3: '驳回复审（简单理由）自动撰写',
        4: '商品服务推荐'
      }
      
      // 按工具类型汇总使用次数
      const overviewMap = {}
      this.tableData.forEach(item => {
        if (!overviewMap[item.docType]) {
          overviewMap[item.docType] = {
            docType: item.docType,
            name: item.name,
            total: 0
          }
        }
        overviewMap[item.docType].total += item.value
      })
      
      // 如果选择了特定工具类型,只显示该类型的统计
      if (this.docType) {
        this.overviewData = Object.values(overviewMap)
      } else {
        // 显示所有工具类型的统计(包括使用次数为0的)
        this.overviewData = [1, 2, 3, 4].map(type => {
          return overviewMap[type] || {
            docType: type,
            name: toolNames[type],
            total: 0
          }
        })
      }
    },
    
    // 点击行查看详情
    handleRowClick(row) {
      this.viewDetail(row)
    },
    
    // 查看详情
    viewDetail(row) {
      this.currentRow = row
      this.detailTitle = `${row.fullname} - ${row.name} - 详细使用记录`
      this.detailVisible = true
      this.detailPageNo = 1
      this.loadDetailData()
    },
    
    // 加载详情数据
    loadDetailData() {
      if (!this.currentRow) return
      
      this.detailLoading = true
      const params = {
        createDateArray: this.createDateArray,
        createUserId: this.currentRow.userId,
        docType: this.currentRow.docType,
        pageNo: this.detailPageNo,
        pageSize: this.detailPageSize
      }
      
      autoToolUseDetail(params).then(res => {
        this.detailLoading = false
        if (res.success) {
          this.detailData = res.data || []
          this.detailTotal = res.total || 0
        } else {
          this.$message.error(res.message || '查询详情失败')
        }
      }).catch(err => {
        this.detailLoading = false
        this.$message.error('查询详情失败')
        console.error(err)
      })
    },
    
    // 查询
    handleSearch() {
      this.loadData()
    },
    
    // 重置
    handleReset() {
      this.docType = null
      this.createUserId = null
      this.initDateRange()
      this.loadData()
    },
    
    // 详情分页大小改变
    handleDetailSizeChange(val) {
      this.detailPageSize = val
      this.detailPageNo = 1
      this.loadDetailData()
    },
    
    // 详情页码改变
    handleDetailCurrentChange(val) {
      this.detailPageNo = val
      this.loadDetailData()
    },
    
    // 主列表-工具名称筛选方法
    filterToolName(value, row) {
      return row.name === value
    },
    
    // 主列表-使用人筛选方法
    filterUserName(value, row) {
      return row.fullname === value
    },
    
    // 详情列表-工具名称筛选方法
    filterDetailToolName(value, row) {
      return row.name === value
    },
    
    // 详情列表-使用人筛选方法
    filterDetailUserName(value, row) {
      return row.fullname === value
    },
    
    // 详情列表-客户名称筛选方法
    filterDetailApplicant(value, row) {
      return row.applicantName === value
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  background-color: #F2F2F2;
}

.main {
  width: 100%;
  padding: 15px;
  
  .main-list {
    width: 100%;
    padding: 10px;
    background-color: #FFFFFF;
  }
}

.hrm-search {
  font-size: 14px;
  padding: 10px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  
  /deep/ .el-date-editor {
    .el-input__inner {
      font-weight: bold;
    }
  }
  
  /deep/ .el-select .el-input input {
    font-weight: bold;
  }
}

// 统计概览区域
.stats-overview {
  margin-bottom: 30px;
  
  .stats-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 3px solid #409EFF;
  }
  
  .stats-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    
    .stat-card {
      flex: 0 0 auto;
      width: 240px;
      max-width: 240px;
      padding: 20px;
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12);
        border-color: #409EFF;
      }
      
      .stat-name {
        font-size: 14px;
        font-weight: bold;
        color: #666;
        margin-bottom: 12px;
        line-height: 1.4;
      }
      
      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #409EFF;
        margin-bottom: 8px;
      }
      
      .stat-label {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

// 统计列表区域
.stats-list {
  .list-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 3px solid #409EFF;
  }
}

.el-table {
  /deep/ th {
    padding: 8px 0;
    color: #333;
    background: rgba(187, 187, 187, 0.3);
    font-weight: bold;
  }
  
  /deep/ td {
    padding: 6px 0;
  }
  
  /deep/ .el-table__row {
    cursor: pointer;
    
    &:hover {
      background-color: #f5f7fa;
    }
  }
  
  // 筛选图标样式优化
  /deep/ .el-table__column-filter-trigger {
    line-height: 1.5;
    
    .el-icon-arrow-down {
      color: #409EFF;
      font-size: 14px;
      font-weight: bold;
      
      &:before {
        content: "\e790";
      }
    }
  }
  
  // 有筛选激活时的样式
  /deep/ .el-table__column-filter-trigger.el-table__column-filter-trigger--visible {
    .el-icon-arrow-down {
      color: #409EFF;
      transform: scale(1.1);
    }
  }
}

.pagination-wrap {
  margin-top: 20px;
  text-align: right;
}

// 对话框样式
/deep/ .el-dialog__body {
  padding: 10px 20px 20px 20px;
}
</style>

