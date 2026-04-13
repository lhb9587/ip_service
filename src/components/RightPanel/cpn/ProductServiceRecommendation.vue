<template>
  <div class="product-service-recommendation">
    <div class="recommendation-header">
      <h3>商品服务推荐 <el-button 
        type="primary" 
        size="mini" 
        icon="el-icon-plus"
        @click="showCreateTaskDialog">
        创建任务
      </el-button></h3>
    </div>
    
    <!-- 创建任务对话框 -->
    <el-dialog
      title="创建新任务"
      :visible.sync="createTaskDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :z-index="3000">
      <el-form :model="createTaskForm" :rules="createTaskRules" ref="createTaskForm" label-width="100px">
        <el-form-item label="任务名称" prop="reqName">
          <el-input
            v-model="createTaskForm.reqName"
            placeholder="请输入任务名称"
            maxlength="100"
            show-word-limit>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createTaskDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCreateTask" :loading="createTaskLoading">确 定</el-button>
      </span>
    </el-dialog>
    
    <div class="recommendation-layout">
      <!-- 左侧：历史推荐列表 -->
      <div class="left-panel">
        <div class="history-search">
          <el-input
            v-model="historySearchKeyword"
            placeholder="搜索任务名称"
            size="small"
            clearable
            @input="onHistorySearch">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="history-list" @scroll="handleHistoryScroll">
          <div 
            v-for="item in filteredHistoryList" 
            :key="item.requestId"
            :class="['history-item', { 'active': item.requestId === requestId }]"
            @click="loadHistoryRecord(item)">
            <div class="history-item-content">
              <div class="history-header">
                <div class="history-time">{{ formatTime(item.createTime) }}</div>
                <div :class="['history-status', getStepStatusClass(item.step)]">
                  {{ getStepStatusText(item.step) }}
                </div>
              </div>
              <div class="history-name" :title="item.reqName || '未命名任务'">{{ item.reqName || '未命名任务' }}</div>
            </div>
            <el-button
              type="text"
              icon="el-icon-delete"
              size="mini"
              class="history-delete-btn"
              @click.stop="deleteHistoryRecord(item)">
            </el-button>
          </div>
          <div v-if="filteredHistoryList.length === 0 && !historyLoading" class="empty-history">
            {{ historySearchKeyword ? '未找到匹配的记录' : '暂无历史记录' }}
          </div>
          <div v-if="historyLoading" class="loading-more">
            加载中...
          </div>
          <div v-if="historyNoMore && filteredHistoryList.length > 0 && !historySearchKeyword" class="no-more">
            没有更多了
          </div>
        </div>
      </div>
      
      <!-- 中间：基础信息和历史数据分析 -->
      <div class="middle-panel">
      <!-- 空状态提示 -->
      <div v-if="!requestId" class="empty-state">
        <div class="empty-icon">
          <i class="el-icon-document-add"></i>
        </div>
        <div class="empty-text">暂无数据</div>
        <div class="empty-hint">请点击左上角"创建任务"按钮开始</div>
      </div>
      
      <!-- 基础信息输入区 -->
      <div class="basic-info-section" v-else>
        <h4>基础信息输入</h4>
        <el-form :model="basicInfo" :rules="rules" ref="basicInfoForm" label-width="134px">
          <!-- <el-form-item label="任务名称" prop="reqName" required>
            <el-input
              v-model="basicInfo.reqName"
              placeholder="请输入任务名称"
              style="width: 90%">
            </el-input>
          </el-form-item> -->
          
          <el-form-item label="客户" prop="customer" required>
            <el-select 
              v-model="basicInfo.customer" 
              filterable 
              remote 
              reserve-keyword 
              placeholder="请选择客户" 
              :remote-method="searchCustomers"
              :loading="customerLoading"
              @change="onCustomerChange"
              clearable
              style="width: 90%">
              <el-option
                v-for="item in customerOptions"
                :key="item.custId"
                :label="item.fullname"
                :value="item.custId">
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="申请人" prop="applicantName" required>
            <el-select 
              v-model="basicInfo.applicantName" 
              filterable 
              remote 
              reserve-keyword 
              allow-create
              placeholder="请选择或输入申请人" 
              :remote-method="searchApplicants"
              :loading="applicantLoading"
              @change="onApplicantChange"
              @clear="onApplicantClear"
              clearable
              style="width: 90%">
              <el-option
                v-for="item in applicantOptions"
                :key="item.applicantId"
                :label="item.applicantName"
                :value="item.applicantName">
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="申请人地址" prop="applicantAddress">
            <el-input
              v-model="basicInfo.applicantAddress" 
              type="textarea" 
              :rows="2"
              placeholder="申请人地址将自动填充，如无则需手动输入"
              style="width: 90%">
            </el-input>
          </el-form-item>

          <el-form-item label="指定的类别和群组" prop="remGoodClass">
            <el-input
              v-model="basicInfo.remGoodClass" 
              type="textarea" 
              :rows="1"
              placeholder="示例：第9类 0901、0907、0908、0922群组；第41类 4105群组"
              style="width: 90%">
            </el-input>
          </el-form-item>

          <el-form-item label="本次注册申请要保护的产品/服务" prop="productDes" required>
            <div style="display: flex; align-items: flex-start; gap: 10px; width: 90%;">
              <el-input 
                v-model="basicInfo.productDes" 
                type="textarea" 
                :rows="3"
                placeholder="可输入多个商品或服务，每行一条，支持换行"
                style="flex: 1;">
              </el-input>
              <el-button 
                type="primary" 
                :loading="analyzingProduct"
                @click="analyzeProduct"
                class="analyze-product-btn">
                <span class="btn-text">分析<br/>产品</span>
              </el-button>
            </div>
          </el-form-item>
          
          <!-- 产品分析结果展示区域 -->
          <el-form-item label="产品功能分析结果" prop="productDetail" v-if="basicInfo.productDetail">
            <el-input 
              v-model="basicInfo.productDetail" 
              type="textarea" 
              :rows="12"
              placeholder="产品分析结果将显示在这里，您可以进行修改"
              style="width: 90%">
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <!-- 历史数据分析结果展示区 -->
      <div class="history-analysis-section" v-if="historyAnalysis">
        <div class="section-header" @click="toggleHistoryAnalysis">
          <h4>历史数据分析结果</h4>
          <div class="toggle-control">
            <span class="toggle-text">{{ historyAnalysisExpanded ? '收起' : '展开' }}</span>
            <i :class="['el-icon-arrow-down', 'toggle-icon', { 'is-expanded': historyAnalysisExpanded }]"></i>
          </div>
        </div>
        <div class="analysis-content" v-show="historyAnalysisExpanded">
          <!-- 是否有全类别申请 -->
          <div class="analysis-item">
            <span class="label">是否有全类别申请：</span>
            <span class="value">{{ historyAnalysis.coverageStatus }}</span>
          </div>
          
          <!-- 常申请的类别统计表 -->
          <div class="analysis-table">
            <h5>常申请的类别</h5>
            <el-table 
              :data="historyAnalysis.frequencyUse" 
              size="small" 
              border
              max-height="200"
              :default-sort="{prop: 'count', order: 'descending'}">
              <el-table-column 
                prop="goodClass" 
                label="类别" 
                sortable 
                :filters="frequencyUseCategoryFilters"
                :filter-method="filterCategory">
              </el-table-column>
              <el-table-column 
                prop="count" 
                label="次数" 
                sortable 
                :filters="countFilters"
                :filter-method="filterCount">
              </el-table-column>
            </el-table>
          </div>
          
          <!-- 是否每个类别选10项 -->
          <div class="analysis-stats">
            <h5>是否每个类别选10项</h5>
            <div class="stats-grid">
              <div class="stats-item">
                <span class="stats-label">选10项的数量</span>
                <span class="stats-value">{{ historyAnalysis.equal10 }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-label">选10项的占比</span>
                <span class="stats-value">{{ historyAnalysis.equal10Percent }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-label">超过10项的数量</span>
                <span class="stats-value">{{ historyAnalysis.moreThan10 }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-label">超过10项的占比</span>
                <span class="stats-value">{{ historyAnalysis.moreThan10Percent }}</span>
              </div>
            </div>
          </div>
          
          <!-- 常选商品/服务统计 -->
          <div class="goods-service-analysis">
            <h5>常选商品/服务统计</h5>
            
            <!-- 不区分类别使用最多的10个商品/服务 -->
            <div class="analysis-subsection">
              <h6>不区分类别使用最多的10个商品/服务</h6>
              <el-table 
                :data="historyAnalysis.maxGoodNameList" 
                size="small" 
                border
                max-height="250"
                :default-sort="{prop: 'count', order: 'descending'}">
                <el-table-column 
                  prop="goodClass" 
                  label="类别" 
                  width="100" 
                  sortable 
                  :filters="maxGoodNameListCategoryFilters"
                  :filter-method="filterCategory">
                </el-table-column>
                <el-table-column 
                  prop="similarGroup" 
                  label="类似群组" 
                  width="120" 
                  sortable 
                  :filters="maxGoodNameListSimilarGroupFilters"
                  :filter-method="filterSimilarGroup">
                </el-table-column>
                <el-table-column 
                  prop="goodName" 
                  label="商品/服务" 
                  min-width="150" 
                  sortable 
                  :filters="maxGoodNameListGoodNameFilters"
                  :filter-method="filterGoodName"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column 
                  prop="count" 
                  label="数量" 
                  width="100" 
                  sortable 
                  :filters="countFilters"
                  :filter-method="filterCount">
                </el-table-column>
              </el-table>
            </div>
            
            <!-- 区分类别使用最多的每个类别前5个商品/服务 -->
            <div class="analysis-subsection">
              <h6>区分类别使用最多的每个类别前5个商品/服务</h6>
              <el-table 
                :data="historyAnalysis.maxGoodNameListPerClass" 
                size="small" 
                border
                max-height="250"
                :default-sort="{prop: 'count', order: 'descending'}">
                <el-table-column 
                  prop="goodClass" 
                  label="类别" 
                  width="100" 
                  sortable 
                  :filters="maxGoodNameListPerClassCategoryFilters"
                  :filter-method="filterCategory">
                </el-table-column>
                <el-table-column 
                  prop="similarGroup" 
                  label="类似群组" 
                  width="120" 
                  sortable 
                  :filters="maxGoodNameListPerClassSimilarGroupFilters"
                  :filter-method="filterSimilarGroup">
                </el-table-column>
                <el-table-column 
                  prop="goodName" 
                  label="商品/服务" 
                  min-width="150" 
                  sortable 
                  :filters="maxGoodNameListPerClassGoodNameFilters"
                  :filter-method="filterGoodName"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column 
                  prop="count" 
                  label="数量" 
                  width="100" 
                  sortable 
                  :filters="countFilters"
                  :filter-method="filterCount">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      <!-- 右侧：推荐功能选择和推荐结果 -->
      <div class="right-panel">
        <!-- 空状态提示 -->
        <div v-if="!requestId" class="empty-state">
          <div class="empty-icon">
            <i class="el-icon-s-data"></i>
          </div>
          <div class="empty-text">暂无推荐任务</div>
          <div class="empty-hint">创建任务后即可开始商品服务推荐</div>
        </div>
        
        <!-- 有数据时显示的内容 -->
        <template v-else>
          <!-- 推荐功能选择与结果展示 -->
          <div class="recommendation-section">
        <h4>推荐功能选择</h4>
        
        <!-- 工作模式选择 -->
        <div class="work-mode-section">
          <el-radio-group v-model="workMode" @change="onWorkModeChange" :disabled="loading">
            <el-radio :label="1">全自动模式（推荐）</el-radio>
            <el-radio :label="2">自助模式</el-radio>
          </el-radio-group>
        </div>
        
        <!-- 全自动模式选项 -->
        <div v-if="workMode === 1" class="auto-mode-options">
          <div class="mode-description">
            <i class="el-icon-info"></i>
            全自动模式下，系统将智能推荐规范的或不规范但可接受的商品/服务
          </div>
          <el-radio-group v-model="autoModeType" @change="onAutoModeTypeChange" :disabled="loading">
            <div class="auto-option-item">
              <el-radio :label="7">
                每个类别推荐指定数量的商品/服务
              </el-radio>
              <el-input-number 
                v-model="remCount" 
                :min="1" 
                :max="50" 
                size="mini"
                :disabled="autoModeType !== 7"
                style="margin-left: 10px; width: 120px;"
                placeholder="数量">
              </el-input-number>
            </div>
            <div class="auto-option-item">
              <el-radio :label="8">
                每个类别推荐全群组的商品/服务
              </el-radio>
            </div>
          </el-radio-group>
        </div>
        
        <!-- 自助模式选项 -->
        <div v-if="workMode === 2" class="manual-mode-options">
          <div class="mode-description">
            <i class="el-icon-info"></i>
            自助模式下，您可以自由组合多个推荐规则
          </div>
          <div v-if="selectedRules.length === 0" class="rule-warning">
            <i class="el-icon-warning"></i>
            <span>请至少选择一个推荐规则</span>
          </div>
          <div class="recommendation-rules">
            <el-checkbox-group v-model="selectedRules" @change="onRuleChange">
              <div v-for="rule in recommendationRules" :key="rule.recommandRule" class="rule-item">
                <el-checkbox :label="rule.recommandRule" :disabled="loading">
                  {{ rule.ruleName }}
                  <el-tooltip :content="rule.ruleDes" placement="top">
                    <i class="el-icon-question" style="margin-left: 5px; color: #909399;"></i>
                  </el-tooltip>
                </el-checkbox>
                <!-- 针对规则2显示数量输入框（默认显示） -->
                <el-input-number 
                  v-if="rule.recommandRule === 2"
                  v-model="manualRemCount" 
                  :min="1" 
                  size="mini"
                  :disabled="!selectedRules.includes(2)"
                  style="margin-left: 10px; width: 120px;"
                  @change="onManualRemCountChange">
                </el-input-number>
              </div>
            </el-checkbox-group>
          </div>
        </div>
        
        <div class="action-buttons">
          <el-button type="primary" @click="generateRecommendation" :loading="loading">
            {{ loading ? '生成中...' : (currentStep === 3 ? '重新生成' : '生成推荐') }}
          </el-button>
        </div>
        
        <!-- 生成中的提示 -->
        <div v-if="pollingLoading" class="generating-tip">
          <div class="tip-content">
            <i class="el-icon-loading"></i>
            <span class="tip-text">正在生成推荐结果，请稍候...</span>
            <el-button type="text" size="small" @click="cancelPolling" class="cancel-link">
              取消
            </el-button>
          </div>
        </div>
        </div>

        <!-- 推荐结果展示区 -->
        <div class="recommendation-results" v-if="recommendationData.length > 0" ref="recommendationResults">
          <div class="results-header">
            <h4>推荐结果</h4>
            <el-button 
              v-if="selectedRecommendationIds.length > 0"
              type="warning" 
              size="small" 
              icon="el-icon-delete"
              @click="clearAllSelected">
              一键清除已选（{{ selectedRecommendationIds.length }}）
            </el-button>
          </div>
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入商品名称"
            v-model="selectedRecommendationIds"
            :data="transferData"
            :titles="['原始推荐列表', '已选择的推荐结果']"
            :render-content="renderTransferItem"
            @change="onTransferChange">
          </el-transfer>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons final-actions" v-if="recommendationData.length > 0">
          <!-- <el-button @click="saveRecommendations" :loading="saving">保存</el-button> -->
          <el-button type="primary" @click="generateReport" :loading="generating">生成报告</el-button>
        </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { queryApplication } from '@/api/applicant'
import {
  queryRecommandRule,
  createRecommandContent,
  queryGoodsRecommand,
  saveTrademarkRequest,
  saveGoodsRecommand,
  createRecommandDoc,
  analysisGoodsServiceHistory,
  queryTrademarkRequestList,
  queryHistoryRecords,
  deleteHistory,
  createTrademarkRequest,
  anylisisProduct
} from '@/api/productServiceRecommendation'
import { queryCustomerList } from '@/api/caseDetail'
// import { queryList } from '@/api/caseList'

export default {
  name: 'ProductServiceRecommendation',
  props: {
    halfWidth: {
      type: String,
      default: '50%'
    }
  },
  data() {
    return {
      // 基础信息
      basicInfo: {
        reqName: '', // 推荐任务名称
        customer: '',
        custId: '',
        applicantName: '',
        applicantAddress: '',
        productDes: '',
        remGoodClass: '',
        productDetail: '' // 产品功能等的详细描述
      },
      
      // 防抖定时器
      saveDebounceTimer: null,
      
      // 是否启用自动保存（加载历史记录时禁用）
      enableAutoSave: true,
      
      // 表单验证规则
      rules: {
        reqName: [
          { required: true, message: '请输入任务名称', trigger: ['blur', 'change'] }
        ],
        customer: [
          { required: true, message: '请选择客户', trigger: 'change' }
        ],
        applicantName: [
          { required: true, message: '请选择或输入申请人', trigger: ['blur', 'change'] }
        ],
        productDes: [
          { required: true, message: '请输入产品/服务', trigger: ['blur', 'change'] }
        ]
      },
      
      // 创建任务表单验证规则
      createTaskRules: {
        reqName: [
          { required: true, message: '请输入任务名称', trigger: ['blur', 'change'] },
          { max: 100, message: '任务名称不能超过100个字符', trigger: ['blur', 'change'] }
        ]
      },
      
      // 客户搜索相关
      customerOptions: [],
      customerLoading: false,
      
      // 申请人搜索相关
      applicantOptions: [],
      applicantLoading: false,
      
      // 历史数据分析
      historyAnalysis: null,
      historyAnalysisExpanded: true, // 历史数据分析结果展开状态
      
      // 表格筛选选项
      // 常申请的类别表格筛选选项
      frequencyUseCategoryFilters: [],
      
      // 不区分类别商品/服务表格筛选选项
      maxGoodNameListCategoryFilters: [],
      maxGoodNameListSimilarGroupFilters: [],
      maxGoodNameListGoodNameFilters: [],
      
      // 区分类别商品/服务表格筛选选项
      maxGoodNameListPerClassCategoryFilters: [],
      maxGoodNameListPerClassSimilarGroupFilters: [],
      maxGoodNameListPerClassGoodNameFilters: [],
      
      // 次数筛选选项（通用）
      countFilters: [
        { text: '1-10', value: '1-10' },
        { text: '11-50', value: '11-50' },
        { text: '51-100', value: '51-100' },
        { text: '100+', value: '100+' }
      ],
      
      // 工作模式
      workMode: 1, // 1:全自动模式(默认), 2:自助模式
      autoModeType: 7, // 全自动模式类型：7-指定数量，8-全群组
      
      // 推荐规则
      recommendationRules: [],
      selectedRules: [], // 自助模式下选择的规则
      remCount: 10, // 全自动模式默认推荐数量
      manualRemCount: 3, // 自助模式默认推荐数量
      isValidatingRemCount: false, // 是否正在验证推荐数量，防止循环触发
      
      // 推荐结果
      recommendationData: [],
      requestId: null,
      
      // 历史推荐列表
      historyList: [],
      historyPage: 1,
      historyPageSize: 20,
      historyLoading: false,
      historyNoMore: false,
      historySearchKeyword: '', // 历史记录搜索关键词
      currentHistoryItem: null, // 当前选中的历史记录
      
      // 创建任务对话框
      createTaskDialogVisible: false,
      createTaskLoading: false,
      createTaskForm: {
        reqName: ''
      },
      
      // transfer组件相关
      selectedRecommendationIds: [],
      transferData: [],
      
      // 当前步骤状态
      currentStep: 0, // 0: 未开始, 1: 基础信息, 2: 推荐中, 3: 已完成
      
      // 状态
      loading: false,
      saving: false,
      generating: false,
      pollingLoading: false, // 轮询加载状态
      analyzingProduct: false, // 产品分析加载状态
      
      // 轮询定时器
      pollingTimer: null
    }
  },
  
  computed: {
    // 已选择的推荐结果
    selectedRecommendations() {
      return this.recommendationData.filter(item => this.selectedRecommendationIds.includes(item.grId))
    },
    
    // 过滤后的历史列表
    filteredHistoryList() {
      if (!this.historySearchKeyword) {
        return this.historyList
      }
      return this.historyList.filter(item => 
        (item.reqName && item.reqName.includes(this.historySearchKeyword))
      )
    }
  },
  
  watch: {
    // 监听基础信息变化
    'basicInfo.reqName'() {
      this.debounceSaveBasicInfo()
    },
    'basicInfo.custId'() {
      this.debounceSaveBasicInfo()
    },
    'basicInfo.applicantName'() {
      this.debounceSaveBasicInfo()
    },
    'basicInfo.applicantAddress'() {
      this.debounceSaveBasicInfo()
    },
    'basicInfo.productDes'() {
      this.debounceSaveBasicInfo()
    },
    'basicInfo.remGoodClass'() {
      this.debounceSaveBasicInfo()
    },
    'basicInfo.productDetail'() {
      this.debounceSaveBasicInfo()
    },
    
    // 监听工作模式变化
    workMode() {
      this.debounceSaveBasicInfo()
    },
    
    // 监听全自动模式类型变化
    autoModeType() {
      this.debounceSaveBasicInfo()
    },
    
    // 监听全自动模式推荐数量变化
    remCount() {
      this.debounceSaveBasicInfo()
    },
    
    // 监听自助模式规则选择变化
    selectedRules: {
      handler() {
        this.debounceSaveBasicInfo()
      },
      deep: true
    },
    
    // 监听自助模式推荐数量变化（统一验证逻辑）
    manualRemCount(newVal, oldVal) {
      // 如果正在验证中，跳过（防止循环触发）
      if (this.isValidatingRemCount) {
        return
      }
      
      // 验证值是否在有效范围内
      if (newVal !== null && newVal !== undefined) {
        if (newVal > 20) {
          this.$message.warning('推荐数量不能超过20，已自动调整为20')
          this.isValidatingRemCount = true
          this.$nextTick(() => {
            this.manualRemCount = 20
            this.$nextTick(() => {
              this.isValidatingRemCount = false
            })
          })
          return
        }
      }
      // 值在有效范围内，执行保存
      this.debounceSaveBasicInfo()
    }
  },
  
  async mounted() {
    // 初始化时禁用自动保存
    this.enableAutoSave = false
    console.log('组件初始化，自动保存已禁用')
    
    await this.loadRecommendationRules()
    await this.loadHistoryList()
    
    // 如果有历史记录，默认加载第一条
    if (this.historyList.length > 0) {
      const firstItem = this.historyList[0]
      this.currentHistoryItem = firstItem
      this.currentStep = firstItem.step || 0
      await this.loadHistoryRecord(firstItem)
    } else {
      // 如果没有历史记录，确保显示空状态
      this.requestId = null
      this.currentHistoryItem = null
      this.currentStep = 0
      
      // 延迟启用自动保存
      setTimeout(() => {
        this.enableAutoSave = true
        console.log('初始化完成（无历史记录），自动保存已启用')
      }, 500)
    }
  },
  
  beforeDestroy() {
    this.clearPolling()
    // 清除防抖定时器
    if (this.saveDebounceTimer) {
      clearTimeout(this.saveDebounceTimer)
      this.saveDebounceTimer = null
    }
  },
  
    methods: {
    // 格式化时间，去掉秒
    formatTime(time) {
      if (!time) return ''
      return time.replace(/:\d{2}$/, '')
    },
    
    // 获取步骤状态文本
    getStepStatusText(step) {
      const statusMap = {
        0: '待启动',
        1: '待启动',
        2: '分析中',
        3: '已完成'
      }
      return statusMap[step] || '待启动'
    },
    
    // 获取步骤状态样式类
    getStepStatusClass(step) {
      const classMap = {
        0: 'status-pending',
        1: 'status-pending',
        2: 'status-analyzing',
        3: 'status-completed'
      }
      return classMap[step] || 'status-pending'
    },
    
    // 防抖保存基础信息
    debounceSaveBasicInfo() {
      // 如果禁用了自动保存，则不执行
      if (!this.enableAutoSave) {
        console.log('自动保存已禁用')
        return
      }
      
      // 清除之前的定时器
      if (this.saveDebounceTimer) {
        clearTimeout(this.saveDebounceTimer)
      }
      
      // 设置新的定时器，1秒后执行保存
      this.saveDebounceTimer = setTimeout(() => {
        this.saveBasicInfoRealTime()
      }, 1000)
      
      console.log('防抖保存已触发，1秒后执行')
    },
    
    // 实时保存基础信息
    async saveBasicInfoRealTime() {
      console.log('saveBasicInfoRealTime 被调用')
      console.log('requestId:', this.requestId)
      console.log('enableAutoSave:', this.enableAutoSave)
      console.log('currentStep:', this.currentStep)
      console.log('loading:', this.loading, 'pollingLoading:', this.pollingLoading)
      console.log('basicInfo:', {
        reqName: this.basicInfo.reqName,
        custId: this.basicInfo.custId,
        applicantName: this.basicInfo.applicantName,
        productDes: this.basicInfo.productDes
      })
      
      // 只有在有 requestId 的情况下才保存
      if (!this.requestId) {
        console.log('没有 requestId，跳过保存')
        return
      }
      
      // 如果任务已完成（currentStep === 3），不进行实时保存
      if (this.currentStep === 3) {
        console.log('任务已完成，跳过保存')
        return
      }
      
      // 不在加载状态和轮询状态下才保存
      if (this.loading || this.pollingLoading) {
        console.log('正在加载中，跳过保存')
        return
      }
      
      // 实时保存不需要验证必填字段，允许保存不完整的数据
      
      try {
        // 根据工作模式构建推荐规则列表
        let recommandRuleList = []
        
        if (this.workMode === 1) {
          // 全自动模式
          recommandRuleList = [{
            recommandRule: this.autoModeType,
            remCount: this.autoModeType === 7 ? this.remCount : undefined
          }]
        } else {
          // 自助模式
          recommandRuleList = this.selectedRules.map(rule => ({
            recommandRule: rule,
            remCount: rule === 2 ? this.manualRemCount : undefined
          }))
        }
        
        const params = {
          requestId: this.requestId,
          reqName: this.basicInfo.reqName,
          custId: this.basicInfo.custId,
          applicantName: this.basicInfo.applicantName,
          applicantAddress: this.basicInfo.applicantAddress,
          productDes: this.basicInfo.productDes,
          remGoodClass: this.basicInfo.remGoodClass,
          productDetail: this.basicInfo.productDetail,
          workMode: this.workMode,
          recommandRuleList
        }
        
        console.log('开始调用 saveTrademarkRequest 接口，参数：', params)
        
        // 调用保存接口（静默保存）
        const response = await saveTrademarkRequest(params)
        
        console.log('saveTrademarkRequest 接口调用成功，响应：', response)
        
        // 静默保存，不显示提示
      } catch (error) {
        console.error('实时保存基础信息失败:', error)
        // 实时保存失败时不打断用户操作，只记录错误
      }
    },
    
    // 分析产品
    async analyzeProduct() {
      // 验证产品描述是否已填写
      if (!this.basicInfo.productDes || !this.basicInfo.productDes.trim()) {
        this.$message.warning('请先填写产品/服务信息')
        return
      }
      
      // 验证 requestId
      if (!this.requestId) {
        this.$message.warning('请先创建任务')
        return
      }
      
      this.analyzingProduct = true
      
      try {
        const response = await anylisisProduct({
          requestId: this.requestId,
          productDes: this.basicInfo.productDes
        })
        
        if (response.success && response.data && response.data.productDetail) {
          this.basicInfo.productDetail = response.data.productDetail
          this.$message.success('产品分析完成')
        } else {
          this.$message.warning(response.message || '产品分析失败')
        }
      } catch (error) {
        console.error('产品分析失败:', error)
        this.$message.error('产品分析失败')
      } finally {
        this.analyzingProduct = false
      }
    },
    
    // 加载推荐规则
    async loadRecommendationRules() {
      try {
        const response = await queryRecommandRule()
        if (response.success) {
          this.recommendationRules = response.data
        }
      } catch (error) {
        console.error('加载推荐规则失败:', error)
        this.$message.error('加载推荐规则失败')
      }
    },
    
    // 显示创建任务对话框
    showCreateTaskDialog() {
      this.createTaskForm.reqName = ''
      this.createTaskDialogVisible = true
      
      // 清除表单验证状态
      this.$nextTick(() => {
        if (this.$refs.createTaskForm) {
          this.$refs.createTaskForm.clearValidate()
        }
      })
    },
    
    // 确认创建任务
    async confirmCreateTask() {
      // 验证表单
      try {
        await this.$refs.createTaskForm.validate()
      } catch (error) {
        return
      }
      
      this.createTaskLoading = true
      
      try {
        // 调用创建任务接口，只传递reqName
        const response = await createTrademarkRequest({
          reqName: this.createTaskForm.reqName,
          docType: 4
        })
        
        if (response.success && response.data && response.data.requestId) {
          // 禁用自动保存，避免清空数据时触发保存
          this.enableAutoSave = false
          
          // 保存requestId
          this.requestId = response.data.requestId
          
          // 更新基础信息
          this.basicInfo.reqName = this.createTaskForm.reqName
          
          // 清空其他数据
          this.basicInfo.customer = ''
          this.basicInfo.custId = ''
          this.basicInfo.applicantName = ''
          this.basicInfo.applicantAddress = ''
          this.basicInfo.productDes = ''
          this.basicInfo.remGoodClass = ''
          this.basicInfo.productDetail = ''
          this.recommendationData = []
          this.selectedRecommendationIds = []
          this.transferData = []
          this.historyAnalysis = null
          this.currentHistoryItem = null
          this.currentStep = 0
          
          // 重置推荐功能选择为默认值
          this.workMode = 1 // 全自动模式(默认)
          this.autoModeType = 7 // 指定数量
          this.remCount = 10 // 全自动模式默认推荐数量
          this.selectedRules = [] // 清空自助模式选择的规则
          this.manualRemCount = 3 // 自助模式默认推荐数量
          
          // 清除表单验证状态
          this.$nextTick(() => {
            if (this.$refs.basicInfoForm) {
              this.$refs.basicInfoForm.clearValidate()
            }
          })
          
          // 延迟重新启用自动保存
          setTimeout(() => {
            this.enableAutoSave = true
            console.log('新任务创建完成，自动保存已启用')
          }, 500)
          
          // 关闭对话框
          this.createTaskDialogVisible = false
          
          // 刷新历史列表
          this.refreshHistoryList()
          
          this.$message.success('任务创建成功')
        } else {
          this.$message.error(response.message || '创建任务失败')
        }
      } catch (error) {
        console.error('创建任务失败:', error)
        this.$message.error('创建任务失败')
      } finally {
        this.createTaskLoading = false
      }
    },
    
    // 刷新历史列表
    async refreshHistoryList() {
      // 重置分页
      this.historyPage = 1
      this.historyNoMore = false
      // 重新加载历史列表
      await this.loadHistoryList(false)
      
      // 如果刷新后历史列表为空，重置表单显示空状态
      if (this.historyList.length === 0) {
        this.resetForm()
      }
    },
    
    // 重置表单
    resetForm() {
      // 禁用自动保存
      this.enableAutoSave = false
      
      // 清空所有数据
      this.requestId = null
      this.currentHistoryItem = null
      this.currentStep = 0
      this.basicInfo.reqName = ''
      this.basicInfo.customer = ''
      this.basicInfo.custId = ''
      this.basicInfo.applicantName = ''
      this.basicInfo.applicantAddress = ''
      this.basicInfo.productDes = ''
      this.basicInfo.remGoodClass = ''
      this.basicInfo.productDetail = ''
      this.customerOptions = []
      this.applicantOptions = []
      this.recommendationData = []
      this.selectedRecommendationIds = []
      this.transferData = []
      this.historyAnalysis = null
      
      // 重置推荐功能选择为默认值
      this.workMode = 1
      this.autoModeType = 7
      this.remCount = 10
      this.selectedRules = []
      this.manualRemCount = 3
      
      // 清除表单验证状态
      this.$nextTick(() => {
        if (this.$refs.basicInfoForm) {
          this.$refs.basicInfoForm.clearValidate()
        }
      })
      
      console.log('表单已重置')
    },
    
    // 加载历史推荐列表
    async loadHistoryList(isLoadMore = false) {
      if (this.historyLoading || this.historyNoMore) return
      
      this.historyLoading = true
      
      try {
        const response = await queryHistoryRecords({
          page: this.historyPage,
          size: this.historyPageSize,
          docType: 4,
          orderCol: 'createDate',
          orderAsc: 'desc'
        })
        
        if (response.success) {
          // 格式化数据
          const formattedData = response.data ? response.data.map(item => ({
            requestId: item.requestId,
            custId: item.custId,
            reqName: item.reqName || '', // 任务名称
            applicantName: item.applicantName,
            applicantAddress: item.applicantAddress,
            productDes: item.productDes,
            createTime: item.createDate,
            remGoodClass: item.remGoodClass || '',
            productDetail: item.productDetail || '', // 产品功能分析结果
            workMode: item.workMode,
            recommandRuleList: item.recommandRuleList,
            step: item.step || 0 // 步骤状态
          })) : []
          
          if (isLoadMore) {
            // 加载更多，追加数据
            this.historyList = [...this.historyList, ...formattedData]
          } else {
            // 首次加载
            this.historyList = formattedData
          }
          
          // 判断是否还有更多数据
          if (formattedData.length < this.historyPageSize) {
            this.historyNoMore = true
          } else {
            this.historyPage++
          }
        }
      } catch (error) {
        console.error('加载历史推荐列表失败:', error)
      } finally {
        this.historyLoading = false
      }
    },
    
    // 处理历史列表滚动事件
    handleHistoryScroll(e) {
      const { scrollTop, scrollHeight, clientHeight } = e.target
      // 滚动到底部时加载更多（仅在非搜索状态下）
      if (!this.historySearchKeyword && scrollTop + clientHeight >= scrollHeight - 10) {
        this.loadHistoryList(true)
      }
    },
    
    // 历史记录搜索
    onHistorySearch() {
      // 搜索功能通过 computed 的 filteredHistoryList 实现
      // 输入时实时过滤显示结果
    },
    
    // 删除历史记录
    async deleteHistoryRecord(item) {
      try {
        await this.$confirm(`确定要删除任务"${item.reqName || '未命名任务'}"吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const isCurrentRecord = item.requestId === this.requestId
        
        const response = await deleteHistory({
          requestId: item.requestId
        })
        
        if (response.success) {
          this.$message.success(response.message || '删除成功')
          
          // 刷新历史列表
          await this.refreshHistoryList()
          
          // 如果删除的是当前查看的记录，自动切换到其他记录
          if (isCurrentRecord) {
            if (this.historyList.length > 0) {
              // 有其他记录，加载第一条
              const firstItem = this.historyList[0]
              await this.loadHistoryRecord(firstItem)
            } else {
              // 没有其他记录了，清空表单
              this.resetForm()
            }
          }
        } else {
          this.$message.error(response.message || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除历史记录失败:', error)
          this.$message.error('删除失败')
        }
      }
    },
  
    // 加载历史记录
    async loadHistoryRecord(item) {
      // 如果有正在进行的轮询，先停止（不刷新历史列表）
      if (this.pollingLoading) {
        this.clearPolling(false)
      }
      
      // 禁用自动保存，避免加载历史记录时触发保存
      this.enableAutoSave = false
      
      // 清空推荐结果，避免显示上一个记录的数据
      this.recommendationData = []
      this.selectedRecommendationIds = []
      this.transferData = []
      
      this.currentHistoryItem = item
      this.requestId = item.requestId
      this.currentStep = item.step || 0
      this.basicInfo.reqName = item.reqName || '未命名任务'
      this.basicInfo.custId = item.custId
      this.basicInfo.applicantName = item.applicantName
      this.basicInfo.applicantAddress = item.applicantAddress
      this.basicInfo.productDes = item.productDes
      this.basicInfo.remGoodClass = item.remGoodClass || ''
      this.basicInfo.productDetail = item.productDetail || ''
      
      // 设置推荐模式
      if (item.workMode) {
        this.workMode = item.workMode
      }
      
      // 设置推荐规则
      if (item.recommandRuleList && item.recommandRuleList.length > 0) {
        if (item.workMode === 1) {
          // 全自动模式
          const rule = item.recommandRuleList[0]
          if (rule.recommandRule === 7) {
            this.autoModeType = 7
            this.remCount = rule.remCount || 10
          } else if (rule.recommandRule === 8) {
            this.autoModeType = 8
          }
        } else if (item.workMode === 2) {
          // 自助模式
          this.selectedRules = item.recommandRuleList.map(r => r.recommandRule)
          // 设置各个规则的数量
          item.recommandRuleList.forEach(rule => {
            if (rule.recommandRule === 1) {
              this.manualRemCount = rule.remCount || 3
            } else if (rule.recommandRule === 2) {
              // 已有 manualRemCount 设置
            }
          })
        }
      }
      
      // 根据custId查询客户信息并设置到下拉框
      if (item.custId) {
        try {
          const response = await queryCustomerList({
            custId: item.custId,
            isCustomer: 1,
            pageSize: 1,
            pageNo: 1
          })
          if (response.data && response.data.length > 0) {
            const customer = response.data[0]
            // 将客户信息添加到选项中
            this.customerOptions = [customer]
            // 设置选中的客户
            this.basicInfo.customer = customer.custId
          }
        } catch (error) {
          console.error('查询客户信息失败:', error)
          this.basicInfo.customer = ''
          this.customerOptions = []
        }
      } else {
        this.basicInfo.customer = ''
        this.customerOptions = []
      }
      
      // 如果状态是"分析中"（step === 2），立即显示生成提示并启动轮询
      if (item.step === 2) {
        console.log('任务状态为分析中，立即显示生成提示并启动轮询')
        this.pollingLoading = true
        // startPolling内部会立即调用一次loadRecommendationResults
        this.startPolling()
      } else {
        // 非分析中状态，直接加载推荐结果（不显示消息）
        await this.loadRecommendationResults(false)
      }
      
      // 加载历史数据分析
      if (item.custId) {
        await this.analyzeHistory()
      }
      
      // 延迟重新启用自动保存，确保所有数据加载完成且 watch 不会被初始化数据触发
      setTimeout(() => {
        this.enableAutoSave = true
        console.log('历史记录加载完成，自动保存已启用')
      }, 500)
    },
    
    // 搜索客户
    async searchCustomers(query) {
      if (query !== '') {
        this.customerLoading = true
        try {
          // 使用现有的客户查询接口
          const response = await queryCustomerList({
            keywords: query,
            isCustomer: 1,
            pageSize: 20,
            pageNo: 1
          })
          this.customerOptions = response.data || []
        } catch (error) {
          console.error('搜索客户失败:', error)
        } finally {
          this.customerLoading = false
        }
      } else {
        this.customerOptions = []
      }
    },
    
    // 客户选择变化
    onCustomerChange(custId) {
      if (custId) {
        const selectedCustomer = this.customerOptions.find(item => item.custId === custId)
        if (selectedCustomer) {
          this.basicInfo.custId = custId
          this.basicInfo.applicantName = '' // 清空申请人选择
          this.basicInfo.applicantAddress = '' // 清空申请人地址
          this.applicantOptions = [] // 清空申请人选项
          this.analyzeHistory()
          this.loadApplicants() // 自动加载申请人列表
        }
      } else {
        // 客户被清空时，清空所有相关数据
        this.basicInfo.custId = ''
        this.basicInfo.applicantName = ''
        this.basicInfo.applicantAddress = ''
        this.applicantOptions = []
        this.historyAnalysis = null
      }
    },
    
    // 加载申请人列表
    async loadApplicants() {
      if (!this.basicInfo.custId) return
      
      this.applicantLoading = true
      try {
        const response = await queryApplication({
          custIdArray: [this.basicInfo.custId],
          pageNo: 1,
          pageSize: 100
        })
        
        if (response.data && response.data.length > 0) {
          this.applicantOptions = response.data
        }
      } catch (error) {
        console.error('加载申请人列表失败:', error)
      } finally {
        this.applicantLoading = false
      }
    },
    
    // 搜索申请人
    async searchApplicants(query) {
      if (!this.basicInfo.custId) {
        this.$message.warning('请先选择客户')
        return
      }
      
      if (query !== '') {
        this.applicantLoading = true
        try {
          const response = await queryApplication({
            custIdArray: [this.basicInfo.custId],
            applicantName: query,
            pageNo: 1,
            pageSize: 100
          })
          
          if (response.data && response.data.length > 0) {
            this.applicantOptions = response.data
          }
        } catch (error) {
          console.error('搜索申请人失败:', error)
        } finally {
          this.applicantLoading = false
        }
      } else {
        // 如果搜索框为空，重新加载全部申请人
        this.loadApplicants()
      }
    },
    
    // 申请人变化
    async onApplicantChange() {
      if (this.basicInfo.applicantName) {
        await this.queryApplicantAddress()
      } else {
        // 申请人被清空时，清空地址
        this.basicInfo.applicantAddress = ''
      }
    },
    
    // 申请人清空
    onApplicantClear() {
      this.basicInfo.applicantName = ''
      this.basicInfo.applicantAddress = ''
      // 手动触发验证
      this.$nextTick(() => {
        this.$refs.basicInfoForm.validateField('applicantName')
      })
    },
    
    // 查询申请人地址
    async queryApplicantAddress() {
      try {
        // 先从已加载的申请人列表中查找
        const selectedApplicant = this.applicantOptions.find(item => item.applicantName === this.basicInfo.applicantName)
        if (selectedApplicant && selectedApplicant.addressCn) {
          this.basicInfo.applicantAddress = selectedApplicant.addressCn
          return
        }
        
        // 如果在列表中没找到，则通过接口查询
        const response = await queryApplication({
          applicantName: this.basicInfo.applicantName
        })
        
        if (response.data && response.data.length > 0) {
          this.basicInfo.applicantAddress = response.data[0].addressCn || ''
        } else {
          // 如果查询不到申请人信息，清空地址字段（可能是自定义输入）
          this.basicInfo.applicantAddress = ''
        }
      } catch (error) {
        console.error('查询申请人地址失败:', error)
        // 查询失败时也清空地址字段
        this.basicInfo.applicantAddress = ''
      }
    },
    
    // 分析历史数据
    async analyzeHistory() {
      if (!this.basicInfo.custId) return
      
      try {
        const response = await analysisGoodsServiceHistory({
          custId: this.basicInfo.custId
        })
        
        if (response.success) {
          this.historyAnalysis = response.data
          // 更新筛选选项
          this.updateFilterOptions()
        }
      } catch (error) {
        console.error('历史数据分析失败:', error)
        this.$message.error('历史数据分析失败')
      }
    },
    
    // 工作模式变化
    onWorkModeChange(mode) {
      // 切换工作模式时，清空之前的选择
      if (mode === 1) {
        // 切换到全自动模式，清空自助模式的规则选择
        this.selectedRules = []
      } else if (mode === 2) {
        // 切换到自助模式，可以提示用户
        // this.$message.info('已切换到自助模式，请选择推荐规则')
      }
    },
    
    // 全自动模式类型变化
    onAutoModeTypeChange(type) {
      // 可以在这里添加类型变化的逻辑
    },
    
    // 推荐规则变化
    onRuleChange() {
      // 可以在这里添加规则变化的逻辑
    },
    
    // 全自动模式推荐数量变化
    onRemCountChange() {
      // 可以在这里添加数量变化的逻辑
    },
    
    // 自助模式推荐数量变化（验证逻辑在 watch 中统一处理，这里可以留空）
    onManualRemCountChange(val) {
      // 验证逻辑已统一在 watch 中处理
    },
    
    // 生成推荐
    async generateRecommendation() {
      // 表单验证
      try {
        await this.$refs.basicInfoForm.validate()
      } catch (error) {
        return
      }
      
      // 验证规则选择
      if (this.workMode === 2 && this.selectedRules.length === 0) {
        this.$message.warning('请至少选择一个推荐规则')
        return
      }
      
      this.loading = true
      
      try {
        // 根据工作模式构建推荐规则列表
        let recommandRuleList = []
        let workMode = this.workMode
        
        if (this.workMode === 1) {
          // 全自动模式
          recommandRuleList = [{
            recommandRule: this.autoModeType,
            remCount: this.autoModeType === 7 ? this.remCount : undefined
          }]
        } else {
          // 自助模式
          recommandRuleList = this.selectedRules.map(rule => ({
            recommandRule: rule,
            remCount: rule === 2 ? this.manualRemCount : undefined
          }))
        }
        
        let response

        await saveTrademarkRequest({
          requestId: this.requestId,
          reqName: this.basicInfo.reqName,
          custId: this.basicInfo.custId,
          applicantName: this.basicInfo.applicantName,
          applicantAddress: this.basicInfo.applicantAddress,
          productDes: this.basicInfo.productDes,
          remGoodClass: this.basicInfo.remGoodClass,
          productDetail: this.basicInfo.productDetail,
          workMode: workMode,
          recommandRuleList
        })
        
        response = await createRecommandContent({
          requestId: this.requestId,
          reqName: this.basicInfo.reqName,
          custId: this.basicInfo.custId,
          applicantName: this.basicInfo.applicantName,
          applicantAddress: this.basicInfo.applicantAddress,
          productDes: this.basicInfo.productDes,
          remGoodClass: this.basicInfo.remGoodClass,
          productDetail: this.basicInfo.productDetail,
          workMode: workMode,
          recommandRuleList
        })
      
        
        if (response.success) {
          // 更新当前步骤状态为分析中
          this.currentStep = 2
          
          // 更新当前历史记录项的状态
          if (this.currentHistoryItem) {
            this.currentHistoryItem.step = 2
          }
          
          if (response.messageType === 100) {
            // 异步处理
            if (response.data && response.data.requestId) {
              // 有requestId，使用requestId进行轮询
              this.requestId = response.data.requestId
              this.$message.info('正在生成推荐结果，请稍候...')
              this.startPolling()
              // 刷新历史列表，更新状态为"分析中"
              this.refreshHistoryList()
            } else {
              // 没有requestId，使用其他方式轮询
              this.$message.info('正在生成推荐结果，请稍候...')
              this.startPollingWithoutRequestId()
              // 刷新历史列表，更新状态为"分析中"
              this.refreshHistoryList()
            }
          } else if (response.data && response.data.requestId) {
            this.requestId = response.data.requestId
            this.startPolling()
            // 刷新历史列表，更新状态为"分析中"
            this.refreshHistoryList()
          } else {
            // 同步返回结果
            this.loadRecommendationResults()
          }
        } else {
          // 显示错误消息
          this.$message.error(response.message || '生成推荐失败')
        }
      } catch (error) {
        console.error('生成推荐失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 开始轮询结果
    startPolling() {
      this.clearPolling(false) // 清除之前的轮询，但不刷新历史列表
      this.pollingLoading = true
      
      // 立即执行一次查询（轮询时显示消息）
      this.loadRecommendationResults(true)
      
      // 启动定时器，每10秒查询一次
      this.pollingTimer = setInterval(() => {
        this.loadRecommendationResults(true) // 轮询时获取到结果要显示消息
      }, 10000)
    },
    
    // 开始轮询结果（没有requestId的情况）
    startPollingWithoutRequestId() {
      this.clearPolling()
      this.pollingLoading = true
      this.pollingTimer = setInterval(() => {
        this.loadRecommendationResultsWithoutRequestId()
      }, 5000) // 每5秒查询一次，因为没有requestId，查询频率可以低一些
    },
    
    // 清除轮询
    clearPolling(shouldRefreshHistory = true) {
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer)
        this.pollingTimer = null
      }
      this.pollingLoading = false
      // 根据参数决定是否刷新历史列表
      if (shouldRefreshHistory) {
        this.refreshHistoryList()
      }
    },
    
    // 取消轮询
    cancelPolling() {
      this.clearPolling()
      this.$message.info('已取消推荐生成')
    },
    
    // 加载推荐结果
    async loadRecommendationResults(showSuccessMessage = false) {
      if (!this.requestId) return
      
      try {
        const response = await queryGoodsRecommand({
          requestId: this.requestId
        })
        
        // 根据 messageType=200 判断后端是否已执行完成
        if (response.success && response.messageType === 200) {
          this.clearPolling() // 停止轮询
          
          // 更新当前步骤状态为已完成
          this.currentStep = 3
          
          // 更新当前历史记录项的状态
          if (this.currentHistoryItem) {
            this.currentHistoryItem.step = 3
          }
          
          if (response.data && response.data.length > 0) {
            // 有推荐结果
            this.recommendationData = response.data
            this.initTransferData()
            // 只在轮询完成时显示成功消息，加载历史记录时不显示
            if (showSuccessMessage) {
              this.$message.success('推荐结果已显示')
            } else {
              console.log('推荐结果已加载')
            }
          } else {
            // 没有推荐结果，显示后端返回的提示信息
            if (showSuccessMessage) {
              this.$message.warning(response.message || '未生成任何推荐结果')
            }
          }
        } else if (!response.success) {
          // 接口调用失败，停止轮询
          this.$message.error(response.message || '查询推荐结果失败')
          this.clearPolling()
        }
        // 如果 messageType !== 200，说明还在处理中，继续轮询
      } catch (error) {
        console.error('加载推荐结果失败:', error)
      }
    },
    
    // 加载推荐结果（没有requestId的情况）
    async loadRecommendationResultsWithoutRequestId() {
      try {
        // 使用客户ID和申请人名称查询推荐结果
        const response = await queryGoodsRecommand({
          custId: this.basicInfo.custId,
          applicantName: this.basicInfo.applicantName
        })
        
        // 根据 messageType=200 判断后端是否已执行完成
        if (response.success && response.messageType === 200) {
          this.clearPolling() // 停止轮询
          
          // 更新当前步骤状态为已完成
          this.currentStep = 3
          
          // 更新当前历史记录项的状态
          if (this.currentHistoryItem) {
            this.currentHistoryItem.step = 3
          }
          
          if (response.data && response.data.length > 0) {
            // 有推荐结果
            this.recommendationData = response.data
            this.initTransferData()
            this.$message.success('推荐结果生成完成')
          } else {
            // 没有推荐结果，显示后端返回的提示信息
            this.$message.warning(response.message || '未生成任何推荐结果')
          }
        } else if (!response.success) {
          // 接口调用失败，停止轮询
          this.$message.error(response.message || '查询推荐结果失败')
          this.clearPolling()
        }
        // 如果 messageType !== 200，说明还在处理中，继续轮询
      } catch (error) {
        console.error('加载推荐结果失败:', error)
      }
    },
    
    // 初始化transfer数据
    initTransferData() {
      this.transferData = this.recommendationData.map(item => ({
        key: item.grId,
        label: `${item.similarGroup} - ${item.goodName}${item.standardDes !== '规范' ? ` (${item.standardDes})` : ''}`,
        disabled: false,
        sameFlag: item.sameFlag // 保存sameFlag信息用于高亮显示
      }))
      
      // 初始化已选择的项目
      this.selectedRecommendationIds = this.recommendationData
        .filter(item => item.keepFlag === 1)
        .map(item => item.grId)
      
      // 滚动到推荐结果区域
      this.$nextTick(() => {
        this.scrollToRecommendationResults()
      })
    },
    
    // transfer自定义渲染方法
    renderTransferItem(h, option) {
      // 如果sameFlag为1，添加绿色高亮样式
      const className = option.sameFlag === 1 ? 'transfer-item-highlight' : ''
      return h('span', { class: className }, option.label)
    },
    
    // transfer过滤方法
    filterMethod(query, item) {
      return item.label.toLowerCase().includes(query.toLowerCase())
    },
    
    // 滚动到推荐结果区域
    scrollToRecommendationResults() {
      if (this.$refs.recommendationResults) {
        this.$refs.recommendationResults.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      }
    },
    
    // 切换历史数据分析结果展开状态
    toggleHistoryAnalysis() {
      this.historyAnalysisExpanded = !this.historyAnalysisExpanded
    },
    
    // 表格筛选方法
    filterCategory(value, row, column) {
      return String(row.goodClass) === String(value)
    },
    
    filterCount(value, row, column) {
      const count = parseInt(row.count)
      switch (value) {
        case '1-10':
          return count >= 1 && count <= 10
        case '11-50':
          return count >= 11 && count <= 50
        case '51-100':
          return count >= 51 && count <= 100
        case '100+':
          return count > 100
        default:
          return true
      }
    },
    
    filterSimilarGroup(value, row, column) {
      return String(row.similarGroup) === String(value)
    },
    
    filterGoodName(value, row, column) {
      return row.goodName === value
    },
    
    // 更新筛选选项
    updateFilterOptions() {
      if (!this.historyAnalysis) return
      
      // 更新常申请的类别表格筛选选项
      if (this.historyAnalysis.frequencyUse) {
        const categories = new Set()
        this.historyAnalysis.frequencyUse.forEach(item => {
          categories.add(item.goodClass)
        })
        this.frequencyUseCategoryFilters = Array.from(categories).sort().map(category => ({
          text: category,
          value: category
        }))
      }
      
      // 更新不区分类别商品/服务表格筛选选项
      if (this.historyAnalysis.maxGoodNameList) {
        const categories = new Set()
        const similarGroups = new Set()
        const goodNames = new Set()
        
        this.historyAnalysis.maxGoodNameList.forEach(item => {
          categories.add(item.goodClass)
          similarGroups.add(item.similarGroup)
          goodNames.add(item.goodName)
        })
        
        this.maxGoodNameListCategoryFilters = Array.from(categories).sort().map(category => ({
          text: category,
          value: category
        }))
        
        this.maxGoodNameListSimilarGroupFilters = Array.from(similarGroups).sort().map(group => ({
          text: group,
          value: group
        }))
        
        this.maxGoodNameListGoodNameFilters = Array.from(goodNames).map(name => ({
          text: name,
          value: name
        }))
      }
      
      // 更新区分类别商品/服务表格筛选选项
      if (this.historyAnalysis.maxGoodNameListPerClass) {
        const categories = new Set()
        const similarGroups = new Set()
        const goodNames = new Set()
        
        this.historyAnalysis.maxGoodNameListPerClass.forEach(item => {
          categories.add(item.goodClass)
          similarGroups.add(item.similarGroup)
          goodNames.add(item.goodName)
        })
        
        this.maxGoodNameListPerClassCategoryFilters = Array.from(categories).sort().map(category => ({
          text: category,
          value: category
        }))
        
        this.maxGoodNameListPerClassSimilarGroupFilters = Array.from(similarGroups).sort().map(group => ({
          text: group,
          value: group
        }))
        
        this.maxGoodNameListPerClassGoodNameFilters = Array.from(goodNames).map(name => ({
          text: name,
          value: name
        }))
      }
    },
    
    // transfer变化事件
    onTransferChange(value, direction, movedKeys) {
      // 更新推荐数据的keepFlag状态
      this.recommendationData.forEach(item => {
        if (movedKeys.includes(item.grId)) {
          item.keepFlag = direction === 'right' ? 1 : 0
        }
      })
      
      // 实时保存推荐结果
      this.saveRecommendations()
    },
    
    // 一键清除所有已选项
    clearAllSelected() {
      this.$confirm('确定要清除所有已选择的推荐结果吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清空所有已选择的ID
        this.selectedRecommendationIds = []
        // 更新所有推荐数据的keepFlag为0
        this.recommendationData.forEach(item => {
          item.keepFlag = 0
        })
        this.$message.success('已清除所有已选项')
        
        // 实时保存推荐结果
        this.saveRecommendations()
      }).catch(() => {
        // 用户取消操作
      })
    },
    
    // 保存推荐结果（实时保存，静默执行）
    async saveRecommendations() {
      if (!this.requestId) {
        return // 没有requestId时不保存
      }
      
      this.saving = true
      
      try {
        // 构建保存数据 - 只传递已选择的推荐结果
        const selectedItems = this.recommendationData.filter(item => item.keepFlag === 1)
        
        const goodsrecommandList = selectedItems.map(item => ({
          grId: item.grId,
          keepFlag: item.keepFlag
        }))
        
        const params = {
          requestId: this.requestId,
          goodsrecommandList: goodsrecommandList
        }
        
        // 调用保存接口
        const response = await saveGoodsRecommand(params)
        
        if (!response.success) {
          // 只在失败时显示错误提示
          this.$message.error(response.message || '保存推荐结果失败')
        }
        // 成功时静默保存，不显示提示
      } catch (error) {
        console.error('保存推荐结果失败:', error)
        // 实时保存失败时不打断用户操作，只记录错误
      } finally {
        this.saving = false
      }
    },
    
    // 生成报告
    async generateReport() {
      if (!this.requestId) {
        this.$message.warning('请先生成推荐结果')
        return
      }
      
      this.generating = true
      
      try {
        // 生成报告（推荐结果已实时保存，无需再次保存）
        const response = await createRecommandDoc({
          requestId: this.requestId
        })
        
        if (response.success) {
          const fileAddress = response.data.fileAddress
          // 下载文件
          // 使用项目统一的下载方式
          const downData = {
            url: `ipdoc${fileAddress}`,
            success() {
              // 下载成功回调
            }
          }
          this.$commonUtils.downLoadAll(downData)
          this.$message.success('报告生成成功')
        }
      } catch (error) {
        console.error('生成报告失败:', error)
        this.$message.error('生成报告失败')
      } finally {
        this.generating = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.product-service-recommendation {
  padding: 20px;
  text-align: left;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .recommendation-header {
    margin-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 10px;
    flex-shrink: 0;
    
    h3 {
      margin: 0;
      color: #303133;
      font-size: 18px;
      
      .el-button {
        margin-left: 10px;
        vertical-align: middle;
      }
    }
  }
  
  // 三列布局
  .recommendation-layout {
    display: flex;
    gap: 20px;
    flex: 1;
    overflow: hidden;
    
    .left-panel,
    .middle-panel,
    .right-panel {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      background: #f8f9fa;
      border-radius: 4px;
      padding: 15px;
      
      // 自定义滚动条样式
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      
      &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 3px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        transition: background 0.3s;
        
        &:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      }
    }
    
    .middle-panel,
    .right-panel {
      h4 {
        margin: 0 0 15px 0;
        color: #303133;
        font-size: 16px;
        font-weight: 600;
        flex-shrink: 0;
      }
    }
    
    // 左侧面板：历史记录列表
    .left-panel {
      width: 250px;
      flex-shrink: 0;
      
      .history-search {
        margin-bottom: 15px;
        flex-shrink: 0;
      }
      
      .history-list {
        flex: 1;
        overflow-y: auto;
        
        // 自定义滚动条样式
        &::-webkit-scrollbar {
          width: 6px;
        }
        
        &::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }
        
        &::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
          transition: background 0.3s;
          
          &:hover {
            background: rgba(0, 0, 0, 0.3);
          }
        }
        
        .history-item {
          padding: 12px;
          margin-bottom: 10px;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          &:hover {
            background: #ecf5ff;
            border-color: #c6e2ff;
            
            .history-delete-btn {
              opacity: 1;
            }
          }
          
          &.active {
            background: #ecf5ff;
            border-color: #409EFF;
          }
          
          .history-item-content {
            flex: 1;
            min-width: 0;
          }
          
          .history-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
            gap: 8px;
          }
          
          .history-time {
            font-size: 12px;
            color: #909399;
            flex-shrink: 0;
          }
          
          .history-status {
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 10px;
            font-weight: 500;
            white-space: nowrap;
            flex-shrink: 0;
            
            &.status-pending {
              background: #f4f4f5;
              color: #909399;
            }
            
            &.status-analyzing {
              background: #fef0f0;
              color: #f56c6c;
            }
            
            &.status-completed {
              background: #f0f9ff;
              color: #67c23a;
            }
          }
          
          .history-name {
            font-size: 14px;
            color: #303133;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: default;
          }
          
          .history-delete-btn {
            opacity: 0;
            transition: opacity 0.3s;
            color: #f56c6c;
            padding: 4px;
            
            &:hover {
              color: #f56c6c;
            }
          }
        }
        
        .empty-history {
          text-align: center;
          color: #909399;
          font-size: 13px;
          padding: 40px 0;
        }
        
        .loading-more,
        .no-more {
          text-align: center;
          color: #909399;
          font-size: 12px;
          padding: 10px 0;
        }
        
        .loading-more {
          color: #409EFF;
        }
      }
    }
    
    // 中间面板：基础信息和历史分析
    .middle-panel {
      flex: 1;
      min-width: 0;
    }
    
    // 右侧面板：推荐功能和结果
    .right-panel {
      flex: 1;
      min-width: 0;
    }
    
    // 空状态样式
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 300px;
      padding: 60px 20px;
      background: #fff;
      border-radius: 8px;
      
      .empty-icon {
        font-size: 80px;
        color: #dcdfe6;
        margin-bottom: 20px;
        
        i {
          display: block;
        }
      }
      
      .empty-text {
        font-size: 16px;
        color: #909399;
        font-weight: 500;
        margin-bottom: 10px;
      }
      
      .empty-hint {
        font-size: 13px;
        color: #c0c4cc;
      }
    }
  }
  
  // 生成中的提示样式
  .generating-tip {
    margin-top: 15px;
    padding: 15px;
    background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
    border-radius: 8px;
    border: 1px solid #90caf9;
    animation: pulse 2s ease-in-out infinite;
    
    .tip-content {
      display: flex;
      align-items: center;
      gap: 10px;
      
      .el-icon-loading {
        font-size: 18px;
        color: #409EFF;
        animation: rotating 1s linear infinite;
      }
      
      .tip-text {
        flex: 1;
        color: #5e35b1;
        font-size: 14px;
        font-weight: 500;
      }
      
      .cancel-link {
        color: #f56c6c;
        font-size: 13px;
        padding: 0;
        
        &:hover {
          color: #f78989;
        }
      }
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(144, 202, 249, 0.4);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(144, 202, 249, 0);
    }
  }
  
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  // 中间面板和右侧面板的共用样式
  .middle-panel,
  .right-panel {
    .basic-info-section,
    .history-analysis-section,
    .recommendation-section,
    .recommendation-results {
      margin-bottom: 20px;
      
      > h4 {
        margin: 0 0 15px 0;
        color: #303133;
        font-size: 15px;
        font-weight: 600;
      }
      
      h5 {
        margin: 10px 0 5px 0;
        color: #606266;
        font-size: 14px;
        font-weight: 500;
      }
      
      .form-tip {
        margin-top: 5px;
        font-size: 12px;
        color: #909399;
        display: flex;
        align-items: center;
        
        i {
          margin-right: 4px;
          color: #409EFF;
        }
      }
    }
  }
    
  .middle-panel {
    .basic-info-section {
      background: #fff;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      
      // 分析产品按钮样式
      .analyze-product-btn {
        height: 70px;
        width: 70px;
        padding: 8px 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
          background: linear-gradient(135deg, #7c92f0 0%, #8b5bb8 100%);
        }
        
        &:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }
        
        .btn-text {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.4;
          white-space: nowrap;
          color: #fff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
      }
    }
    
    .history-analysis-section {
      background: #fff;
      padding: 15px;
      border-radius: 4px;
      
      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        // margin-bottom: 15px;
        
        h4 {
          margin: 0;
          color: #303133;
          font-size: 16px;
          font-weight: 600;
        }
        
        .toggle-control {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .toggle-text {
            font-size: 12px;
            color: #909399;
            transition: color 0.3s ease;
          }
          
          .toggle-icon {
            transition: transform 0.3s ease;
            color: #909399;
            font-size: 14px;
            
            &.is-expanded {
              transform: rotate(180deg);
            }
          }
        }
        
        &:hover {
          .toggle-control {
            .toggle-text {
              color: #409EFF;
            }
            
            .toggle-icon {
              color: #409EFF;
            }
          }
        }
      }
      
      .analysis-content {
        .analysis-item {
          margin-bottom: 15px;
          
          .label {
            font-weight: 500;
            color: #606266;
          }
          
          .value {
            color: #303133;
            font-weight: 600;
          }
        }
        
        .analysis-table {
          margin: 20px 0;
          
          h5 {
            margin-bottom: 10px;
            color: #303133;
            font-size: 14px;
            font-weight: 600;
          }
        }
        
        .analysis-stats {
          margin: 20px 0;
          
          h5 {
            margin-bottom: 15px;
            color: #303133;
            font-size: 14px;
            font-weight: 600;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            
            .stats-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 10px;
              background: #fff;
              border-radius: 4px;
              border: 1px solid #e4e7ed;
              
              .stats-label {
                font-size: 12px;
                color: #909399;
                margin-bottom: 5px;
              }
              
              .stats-value {
                font-size: 16px;
                color: #303133;
                font-weight: 600;
              }
            }
          }
        }
        
        .goods-service-analysis {
          margin: 20px 0;
          
          h5 {
            margin-bottom: 15px;
            color: #303133;
            font-size: 14px;
            font-weight: 600;
          }
          
          .analysis-subsection {
            margin-bottom: 20px;
            
            h6 {
              margin: 0 0 10px 0;
              color: #606266;
              font-size: 13px;
              font-weight: 500;
            }
          }
        }
      }
    }
  }
  
  .right-panel {
    .recommendation-section {
      background: #fff;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      
      // 工作模式选择区域
      .work-mode-section {
        margin-bottom: 20px;
        padding: 15px;
        background: #f5f7fa;
        border-radius: 4px;
      }
      
      // 全自动模式选项
      .auto-mode-options {
        margin-top: 20px;
        padding: 15px;
        background: #ecf5ff;
        border: 1px solid #d9ecff;
        border-radius: 4px;
        
        .mode-description {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          font-size: 13px;
          color: #409EFF;
          
          i {
            margin-right: 5px;
            font-size: 16px;
          }
        }
        
        .auto-option-item {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      
      // 自助模式选项
      .manual-mode-options {
        margin-top: 20px;
        padding: 15px;
        background: #fdf6ec;
        border: 1px solid #faecd8;
        border-radius: 4px;
        
        .mode-description {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          font-size: 13px;
          color: #e6a23c;
          
          i {
            margin-right: 5px;
            font-size: 16px;
          }
        }
        
        .rule-warning {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding: 10px 15px;
          background: #fef0f0;
          border: 1px solid #fde2e2;
          border-radius: 4px;
          font-size: 13px;
          color: #f56c6c;
          font-weight: 500;
          animation: shake 0.5s ease-in-out;
          
          i {
            margin-right: 8px;
            font-size: 16px;
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        
        .recommendation-rules {
          .rule-item {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #ebeef5;
            border-radius: 4px;
            background: #fff;
            
            &:hover {
              border-color: #c6e2ff;
              background-color: #ecf5ff;
            }
          }
        }
      }
    }
    
    .recommendation-results {
      background: #fff;
      padding: 15px;
      border-radius: 4px;
      
      .results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        
        h4 {
          margin: 0;
          color: #303133;
          font-size: 15px;
          font-weight: 600;
        }
      }
      
      // transfer组件样式调整 - 左右布局
      /deep/ .el-transfer {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        
        .el-transfer-panel {
          width: 50%;
          // margin-right: 20px;
        }
        
        .el-transfer__buttons {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin: 0 10px;
          padding: 0 10px;
          
          .el-button {
            margin: 5px 0;
            width: 30px;
            height: 30px;
            padding: 0;
            
            i {
              font-size: 14px;
            }
          }
        }
        
        // 绿色高亮样式
        .transfer-item-highlight {
          background-color: #d4edda;
          color: #155724;
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: 500;
        }
      }
    }
    
    .action-buttons {
      margin-top: 20px;
      text-align: right;
      
      &.final-actions {
        border-top: 1px solid #ebeef5;
        padding-top: 20px;
      }
    }
  }
}

// 响应式处理
@media (max-width: 1200px) {
  .product-service-recommendation {
    .recommendation-results {
      /deep/ .el-transfer {
        flex-direction: row;
        
        .el-transfer-panel {
          width: 40%;
          margin-right: 10px;
        }
        
        .el-transfer__buttons {
          margin: 0 5px;
          
          .el-button {
            width: 25px;
            height: 25px;
            
            i {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .product-service-recommendation {
    .recommendation-results {
      /deep/ .el-transfer {
        flex-direction: column;
        
        .el-transfer-panel {
          width: 100%;
          margin-right: 0;
          margin-bottom: 10px;
        }
        
        .el-transfer__buttons {
          flex-direction: row;
          justify-content: center;
          margin: 10px 0;
          
          .el-button {
            margin: 0 5px;
          }
        }
      }
    }
  }
}
</style>

