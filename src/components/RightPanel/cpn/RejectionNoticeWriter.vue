<template>
  <div class="rejection-notice-writer" :style="{width: halfWidth}">
    <div class="writer-header">
      <h3>报驳回通知邮件自动撰写</h3>
      <el-button type="text" class="close-btn" @click="handleClose">
        <i class="el-icon-close"></i>
      </el-button>
    </div>

    <div class="writer-content">
      <el-form :model="formData" :rules="formRules" ref="rejectionForm" label-width="120px">
        
        <!-- 模块1：文件上传与收文日期 -->
        <el-card class="form-card" shadow="never">
          <div slot="header" class="card-header">
            <span class="card-title">驳回通知书信息</span>
          </div>
          
          <!-- 切换上传文件/手动填写 -->
          <el-tabs v-model="inputMode" @tab-click="handleInputModeChange">
            <el-tab-pane label="上传文件" name="upload">
              <el-form-item label="上传文件">
                <el-upload
                  class="upload-demo"
                  name="attachFile"
                  drag
                  :action="uploadAction"
                  :headers="uploadHeaders"
                  :data="uploadData"
                  :on-success="handleUploadSuccess"
                  :on-error="handleUploadError"
                  :before-upload="beforeUpload"
                  :file-list="fileList"
                  :limit="1"
                  accept=".pdf">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">仅支持PDF格式（仅限.pdf），上传后系统将自动识别内容</div>
                </el-upload>
              </el-form-item>
            </el-tab-pane>
            
            <el-tab-pane label="手动填写" name="manual">
              <div class="tip-text" style="margin: 10px 0;">
                <i class="el-icon-info"></i>
                未上传文件时，请在下方模块中手动填写驳回通知书的相关信息
              </div>
            </el-tab-pane>
          </el-tabs>

          <!-- 收文日期：一行显示 -->
          <el-form-item label="收文日期" required class="inline-form-item">
            <el-radio-group v-model="formData.deadlineType" @change="handleDeadlineTypeChange" style="display: inline-block; margin-right: 10px;">
              <el-radio label="date">选择日期</el-radio>
              <el-radio label="unknown">未知</el-radio>
            </el-radio-group>
            <el-date-picker
              v-if="formData.deadlineType === 'date'"
              v-model="formData.deadLineDate"
              type="date"
              placeholder="选择收文日期"
              value-format="yyyy-MM-dd"
              style="width: 260px; display: inline-block;">
            </el-date-picker>
          </el-form-item>

          <div class="tip-text" v-if="formData.deadlineType === 'unknown'">
            <i class="el-icon-info"></i>
            选择"未知"后，生成的通知书将显示："请贵方尽量于截止日期之前就是否复审给予我们书面指示。"
          </div>
        </el-card>

        <!-- 仅在手动填写模式下显示以下表单 -->
        <template v-if="inputMode === 'manual'">
          <!-- 模块2：被驳回商标信息 -->
          <el-card class="form-card" shadow="never">
            <div slot="header" class="card-header">
              <span class="card-title">被驳回商标信息</span>
            </div>

            <el-form-item label="被驳回商标号" prop="regNumber">
              <el-input 
                v-model="formData.regNumber" 
                placeholder="请输入商标号"
                style="width: calc(100% - 120px)">
              </el-input>
              <el-button 
                type="primary" 
                @click="queryTrademarkInfo"
                :loading="queryLoading"
                style="margin-left: 10px">
                查询
              </el-button>
            </el-form-item>

            <el-form-item label="类别" prop="tmClasses">
              <el-input 
                v-model="formData.tmClasses" 
                placeholder="多个类别用分号分隔，如：6;8;14"
                :disabled="queryLoading">
              </el-input>
              <div class="tip-text">
                <i class="el-icon-info"></i>
                点击"查询"按钮可自动填充类别信息，也可手动修改
              </div>
            </el-form-item>

            <el-form-item label="申请人" prop="applicantName">
              <el-input 
                v-model="formData.applicantName" 
                placeholder="请输入申请人名称"
                :disabled="queryLoading">
              </el-input>
            </el-form-item>
          </el-card>

          <!-- 模块3：引证商标信息 -->
          <el-card class="form-card" shadow="never">
            <div slot="header" class="card-header">
              <span class="card-title">引证商标信息</span>
              <el-button 
                type="text" 
                icon="el-icon-plus" 
                @click="addQuoteRow"
                size="small">
                添加类别
              </el-button>
            </div>

            <el-table 
              :data="formData.trademarkQuoteList" 
              border 
              style="width: 100%">
              <el-table-column prop="goodClasses" label="类别" width="120">
                <template slot-scope="scope">
                  <el-input 
                    v-model="scope.row.goodClasses" 
                    placeholder="类别"
                    size="small">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="regNumbers" label="引证商标号">
                <template slot-scope="scope">
                  <el-input 
                    v-model="scope.row.regNumbers" 
                    placeholder="多个引证商标号之间可以用逗号、顿号、分号（中/英文均支持）分隔。也支持第xxx号的形式，例如：85152133、80200922，第85124945号，123456A；ABC12345"
                    size="small"
                    type="textarea"
                    :rows="2">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" align="center">
                <template slot-scope="scope">
                  <el-button 
                    type="text" 
                    icon="el-icon-delete" 
                    @click="deleteQuoteRow(scope.$index)"
                    size="small">
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="tip-text" style="margin-top: 10px;">
              <i class="el-icon-info"></i>
              因为一标多类的情况，所以，针对每个类别都可能设置引证商标
            </div>

            <!-- 驳回类型选择（直接放在表格下方，不再单独成卡片） -->
            <el-divider></el-divider>
            <el-form-item label="驳回类型" required style="margin-bottom: 0;">
              <el-radio-group v-model="formData.rejectionType">
                <el-radio label="all">全部驳回</el-radio>
                <el-radio label="partial">部分驳回</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-card>

          <!-- 模块5：初步审定信息（仅部分驳回时显示） -->
          <el-card class="form-card" shadow="never" v-if="formData.rejectionType === 'partial'">
            <div slot="header" class="card-header">
              <span class="card-title">初步审定信息</span>
              <el-button 
                type="text" 
                icon="el-icon-plus" 
                @click="addPreApprovalRow"
                size="small">
                添加类别
              </el-button>
            </div>

            <div 
              v-for="(item, index) in preApprovalList" 
              :key="'pre-' + index" 
              class="goods-service-item">
              <el-form-item :label="'类别 ' + (index + 1)" label-width="80px">
                <el-select 
                  v-model="item.goodClasses" 
                  placeholder="请选择类别"
                  style="width: 150px">
                  <el-option
                    v-for="cls in getAvailableClasses('preApproval', index)"
                    :key="cls"
                    :label="cls"
                    :value="cls">
                  </el-option>
                </el-select>
                <el-button 
                  type="text" 
                  icon="el-icon-delete" 
                  @click="deletePreApprovalRow(index)"
                  style="margin-left: 10px">
                </el-button>
              </el-form-item>
              <el-form-item label="商品/服务" label-width="80px">
                <el-input 
                  v-model="item.goodsData" 
                  type="textarea"
                  :rows="3"
                  placeholder="请输入该类别下核准的商品或服务名称">
                </el-input>
              </el-form-item>
            </div>
            <div class="tip-text">
              <i class="el-icon-info"></i>
              因为一标多类的情况，所以，有多个类别的初审信息
            </div>
          </el-card>

          <!-- 模块6：驳回信息（仅部分驳回时显示） -->
          <el-card class="form-card" shadow="never" v-if="formData.rejectionType === 'partial'">
            <div slot="header" class="card-header">
              <span class="card-title">驳回信息</span>
              <el-button 
                type="text" 
                icon="el-icon-plus" 
                @click="addRejectionRow"
                size="small">
                添加类别
              </el-button>
            </div>

            <div 
              v-for="(item, index) in rejectionList" 
              :key="'rej-' + index" 
              class="goods-service-item">
              <el-form-item :label="'类别 ' + (index + 1)" label-width="80px">
                <el-select 
                  v-model="item.goodClasses" 
                  placeholder="请选择类别"
                  style="width: 150px">
                  <el-option
                    v-for="cls in getAvailableClasses('rejection', index)"
                    :key="cls"
                    :label="cls"
                    :value="cls">
                  </el-option>
                </el-select>
                <el-button 
                  type="text" 
                  icon="el-icon-delete" 
                  @click="deleteRejectionRow(index)"
                  style="margin-left: 10px">
                </el-button>
              </el-form-item>
              <el-form-item label="商品/服务" label-width="80px">
                <el-input 
                  v-model="item.goodsData" 
                  type="textarea"
                  :rows="3"
                  placeholder="请输入被驳回的具体项目描述">
                </el-input>
              </el-form-item>
            </div>

            <div class="tip-text">
              <i class="el-icon-info"></i>
              因为一标多类的情况，所以，有多个类别的驳回信息
            </div>
          </el-card>
          <!-- 模块7：其他驳回理由 -->
          <el-card class="form-card" shadow="never">
            <div slot="header" class="card-header">
              <span class="card-title">其他驳回理由</span>
            </div>

            <el-form-item label="其他驳回理由">
              <el-input 
                v-model="formData.rejectReason" 
                type="textarea"
                :rows="4"
                placeholder="可填写通用性或综合性理由，例如：该标志使用在指定商品上，易使公众对商品的来源、品质等特点产生误认，不得作为商标使用。">
              </el-input>
            </el-form-item>
          </el-card>
        </template>

      </el-form>
    </div>

    <!-- 操作按钮区 -->
    <div class="writer-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
        生成邮件
      </el-button>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {
  createTrademarkRequest,
  queryTmList,
  saveTrademarkRequest,
  createRejectionDoc
} from '@/api/rejectionNotice'
import { uploadRejectionNotice } from '@/api/serviceApi.config.js'

export default {
  name: 'RejectionNoticeWriter',
  props: {
    halfWidth: {
      type: String,
      default: '50%'
    }
  },
  data() {
    return {
      requestId: null, // 任务ID
      fileList: [],
      queryLoading: false,
      submitLoading: false,
      inputMode: 'upload', // 输入模式：upload-上传文件，manual-手动填写
      
      formData: {
        deadlineType: 'date', // date 或 unknown
        deadLineDate: '',
        regNumber: '', // 被驳回商标号
        tmClasses: '', // 类别
        applicantName: '', // 申请人
        trademarkQuoteList: [], // 引证商标列表
        rejectionType: 'all', // 驳回类型：all-全部驳回，partial-部分驳回
        rejectReason: '' // 其他驳回理由
      },

      // 初步审定信息列表
      preApprovalList: [],

      // 驳回信息列表
      rejectionList: [],

      formRules: {
        regNumber: [
          { required: true, message: '请输入被驳回商标号', trigger: 'blur' }
        ],
        tmClasses: [
          { required: true, message: '请输入类别', trigger: 'blur' },
          { 
            validator: (rule, value, callback) => {
              if (!value) {
                callback()
                return
              }
              // 只允许数字和分号，不允许其他符号
              const pattern = /^[0-9;]+$/
              if (!pattern.test(value)) {
                callback(new Error('类别只能包含数字和分号，多个类别请用分号分隔'))
              } else {
                // 检查是否有空分号（连续的分号或开头结尾的分号）
                if (value.includes(';;') || value.startsWith(';') || value.endsWith(';')) {
                  callback(new Error('类别格式不正确，请使用分号分隔，如：6;8;14'))
                } else {
                  callback()
                }
              }
            }, 
            trigger: 'blur' 
          }
        ],
        applicantName: [
          { required: true, message: '请输入申请人名称', trigger: 'blur' }
        ],
        deadlineType: [
          { required: true, message: '请选择收文日期类型', trigger: 'change' }
        ],
        deadLineDate: [
          { required: true, message: '请选择收文日期', trigger: 'change' }
        ]
      },

      uploadAction: uploadRejectionNotice,
      uploadHeaders: {
        tokenID: getToken()
      },
      uploadData: {
        materialTypeId: 3, // 驳回通知书类型
        tokenID: this.$store.state.user.token
      }
    }
  },
  created() {
    // 延迟初始化任务，避免一打开就创建任务
    // 改为在上传文件或提交时再创建
  },
  methods: {
    // 初始化任务（延迟创建，仅在需要时调用）
    async initTask() {
      // 如果已经有任务ID，不重复创建
      if (this.requestId) {
        return true
      }

      try {
        const response = await createTrademarkRequest({
          docType: 2,
          reqName: '' // 空名称，由后端自动生成
        })
        
        if (response.success && response.data) {
          this.requestId = response.data.requestId
          // 更新上传参数
          this.uploadData.requestId = this.requestId
          return true
        } else {
          this.$message.error('创建任务失败：' + (response.message || '未知错误'))
          return false
        }
      } catch (error) {
        console.error('创建任务失败:', error)
        this.$message.error('创建任务失败，请重试')
        return false
      }
    },

    // 获取当前日期
    getCurrentDate() {
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    // 输入模式切换
    handleInputModeChange(tab) {
      // 可以在这里处理切换逻辑
      console.log('切换到：', tab.name)
    },

    // 收文日期类型变化
    handleDeadlineTypeChange(val) {
      if (val === 'unknown') {
        this.formData.deadLineDate = ''
      }
    },

    // 上传前校验
    async beforeUpload(file) {
      const isPDF = file.type === 'application/pdf'
      const isLt50M = file.size / 1024 / 1024 < 50

      if (!isPDF) {
        this.$message.error('只能上传PDF格式文件!')
        return false
      }
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50MB!')
        return false
      }

      // 上传前先确保任务已创建
      if (!this.requestId) {
        const success = await this.initTask()
        if (!success) {
          return false
        }
      }

      return true
    },

    // 上传成功
    handleUploadSuccess(response, file, fileList) {
      if (response.success) {
        this.$message.success('文件上传成功！')
        this.fileList = fileList
      } else {
        this.$message.error('文件上传失败：' + (response.message || '未知错误'))
      }
    },

    // 上传失败
    handleUploadError(err, file, fileList) {
      this.$message.error('文件上传失败，请重试')
      console.error('上传错误:', err)
    },

    // 查询商标信息
    async queryTrademarkInfo() {
      if (!this.formData.regNumber) {
        this.$message.warning('请先输入商标号')
        return
      }

      this.queryLoading = true
      try {
        const response = await queryTmList({
          regNumber: this.formData.regNumber
        })

        if (response.success && response.data && response.data.length > 0) {
          // 提取所有类别并用分号连接
          const classes = response.data.map(item => item.tmType).join(';')
          this.formData.tmClasses = classes
          
          // 填充申请人信息（如果接口返回了该字段）
          if (response.data[0].applicantName) {
            this.formData.applicantName = response.data[0].applicantName
          }
          
          this.$message.success('查询成功，已自动填充商标信息')
        } else {
          this.$message.warning('未查询到该商标信息，请手动输入')
        }
      } catch (error) {
        console.error('查询商标信息失败:', error)
        this.$message.error('查询失败，请手动输入')
      } finally {
        this.queryLoading = false
      }
    },

    // 添加引证商标行
    addQuoteRow() {
      let defaultClass = ''
      
      // 如果是第一条记录，并且被驳回商标只有一个类别，自动赋值
      if (this.formData.trademarkQuoteList.length === 0 && this.formData.tmClasses) {
        const classes = this.formData.tmClasses.split(';').map(c => c.trim()).filter(c => c)
        if (classes.length === 1) {
          defaultClass = classes[0]
        }
      }
      
      this.formData.trademarkQuoteList.push({
        goodClasses: defaultClass,
        regNumbers: ''
      })
    },

    // 删除引证商标行
    deleteQuoteRow(index) {
      this.formData.trademarkQuoteList.splice(index, 1)
    },

    // 获取可用的类别列表
    getAvailableClasses(type, currentIndex) {
      // 检查是否已填写类别
      if (!this.formData.tmClasses) {
        return []
      }

      // 解析类别字符串，按分号分割
      const allClasses = this.formData.tmClasses.split(';').map(c => c.trim()).filter(c => c)
      
      // 获取已选择的类别
      const selectedClasses = []
      
      if (type === 'preApproval') {
        // 获取初步审定信息中已选择的类别（排除当前项）
        this.preApprovalList.forEach((item, index) => {
          if (index !== currentIndex && item.goodClasses) {
            selectedClasses.push(item.goodClasses)
          }
        })
      } else if (type === 'rejection') {
        // 获取驳回信息中已选择的类别（排除当前项）
        this.rejectionList.forEach((item, index) => {
          if (index !== currentIndex && item.goodClasses) {
            selectedClasses.push(item.goodClasses)
          }
        })
      }
      
      // 返回未被选择的类别
      return allClasses.filter(cls => !selectedClasses.includes(cls))
    },

    // 添加初步审定行
    addPreApprovalRow() {
      // 检查是否已填写类别
      if (!this.formData.tmClasses) {
        this.$message.warning('请先在"被驳回商标信息"中填写或查询类别')
        return
      }

      // 检查是否还有可用的类别
      const availableClasses = this.getAvailableClasses('preApproval', -1)
      if (availableClasses.length === 0) {
        this.$message.warning('所有类别已添加完毕')
        return
      }

      // 如果只有一个可用类别，自动填充
      const defaultClass = availableClasses.length === 1 ? availableClasses[0] : ''

      this.preApprovalList.push({
        goodClasses: defaultClass,
        goodsData: '',
        dataType: 1 // 1: 初审信息
      })
    },

    // 删除初步审定行
    deletePreApprovalRow(index) {
      this.preApprovalList.splice(index, 1)
    },

    // 添加驳回信息行
    addRejectionRow() {
      // 检查是否已填写类别
      if (!this.formData.tmClasses) {
        this.$message.warning('请先在"被驳回商标信息"中填写或查询类别')
        return
      }

      // 检查是否还有可用的类别
      const availableClasses = this.getAvailableClasses('rejection', -1)
      if (availableClasses.length === 0) {
        this.$message.warning('所有类别已添加完毕')
        return
      }

      // 如果只有一个可用类别，自动填充
      const defaultClass = availableClasses.length === 1 ? availableClasses[0] : ''

      this.rejectionList.push({
        goodClasses: defaultClass,
        goodsData: '',
        dataType: 2 // 2: 驳回信息
      })
    },

    // 删除驳回信息行
    deleteRejectionRow(index) {
      this.rejectionList.splice(index, 1)
    },

    // 提交表单
    async handleSubmit() {
      // 先进行自定义验证
      if (this.inputMode === 'upload' && this.fileList.length === 0) {
        this.$message.warning('请先上传驳回通知书PDF文件')
        return
      }

      // 验证收文日期
      if (this.formData.deadlineType === 'date' && !this.formData.deadLineDate) {
        this.$message.warning('请选择收文日期')
        return
      }

      // 如果是手动填写模式，需要验证商标号、类别和申请人
      if (this.inputMode === 'manual') {
        if (!this.formData.regNumber) {
          this.$message.warning('请输入被驳回商标号')
          return
        }
        if (!this.formData.tmClasses) {
          this.$message.warning('请输入或查询商标类别')
          return
        }
        if (!this.formData.applicantName) {
          this.$message.warning('请输入申请人名称')
          return
        }
      }

      // 提交前先确保任务已创建
      if (!this.requestId) {
        const success = await this.initTask()
        if (!success) {
          return
        }
      }

      this.$refs.rejectionForm.validate(async (valid) => {
        if (!valid) {
          this.$message.warning('请完善必填信息')
          return false
        }

        this.submitLoading = true
        try {
          // 准备保存数据的参数
          let submitData = {
            requestId: this.requestId
          }
          
          // 根据输入模式准备不同的参数
          if (this.inputMode === 'upload') {
            // 上传文件模式：只传 requestId 和 deadLineDate（有值时）
            if (this.formData.deadlineType === 'date' && this.formData.deadLineDate) {
              submitData.deadLineDate = this.formData.deadLineDate
            }
          } else {
            // 手动填写模式：传递完整信息
            // 合并商品服务列表（仅在部分驳回时）
            let goodsServiceList = []
            if (this.formData.rejectionType === 'partial') {
              goodsServiceList = [
                ...this.preApprovalList,
                ...this.rejectionList
              ]
            }
            
            submitData = {
              tokenID: getToken(),
              requestId: this.requestId,
              regNumber: this.formData.regNumber,
              applicantName: this.formData.applicantName,
              deadLineDate: this.formData.deadlineType === 'date' ? this.formData.deadLineDate : null,
              rejectReason: this.formData.rejectReason,
              trademarkQuoteList: this.formData.trademarkQuoteList,
              goodsServiceList: goodsServiceList
            }
          }
          
          // 1. 先保存用户输入的信息
          const saveResponse = await saveTrademarkRequest(submitData)
          
          if (saveResponse.success) {
            // 2. 调用生成报驳回通知邮件接口
            const createResponse = await createRejectionDoc({
              tokenID: getToken(),
              requestId: this.requestId
            })

            if (createResponse.success) {
              this.$message.success(createResponse.message)
              this.handleClose()
            } else {
              this.$message.error('生成报驳回通知邮件失败：' + (createResponse.message || '未知错误'))
            }
          } else {
            this.$message.error('保存信息失败：' + (saveResponse.message || '未知错误'))
          }
        } catch (error) {
          console.error('提交失败:', error)
          this.$message.error('操作失败，请重试')
        } finally {
          this.submitLoading = false
        }
      })
    },

    // 关闭面板
    handleClose() {
      this.$emit('close')
      // 通知父组件关闭
      this.$store.commit('caseInformation/SET_CLOSEFLAG', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.rejection-notice-writer {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  position: relative;
}

.writer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px; // 减少上下间距
  background: #fff;
  border-bottom: 1px solid #e4e7ed;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }

  // 增强关闭按钮的视觉效果
  .close-btn {
    padding: 6px;
    
    i {
      font-size: 22px;
      font-weight: bold;
      color: #909399;
    }
    
    &:hover i {
      color: #f56c6c;
    }
  }
}

.writer-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  padding-right: 45px; // 右侧空出至少35px，避免与工具栏按钮重叠
  
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
}

.form-card {
  margin-bottom: 15px; // 减少卡片间距

  // 紧凑标题样式
  /deep/ .el-card__header {
    padding: 10px 15px; // 减少标题内边距
    background-color: #f9fafc;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-size: 14px; // 稍微减小字号
      font-weight: bold;
      color: #303133;
    }
  }

  // 减少卡片内容区域的内边距
  /deep/ .el-card__body {
    padding: 15px; // 减少内边距
  }
}

.tip-text {
  margin-top: 5px;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;

  i {
    margin-right: 5px;
  }
}

.goods-service-item {
  padding: 10px 12px; // 减少内边距
  margin-bottom: 10px; // 减少间距
  background: #f9fafc;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  
  // 紧凑内部表单项
  .el-form-item {
    margin-bottom: 10px; // 减少表单项间距
  }
}

.writer-footer {
  padding: 15px 20px;
  padding-right: 45px; // 右侧与内容区保持一致
  background: #fff;
  border-top: 1px solid #e4e7ed;
  text-align: center;
}

// 上传组件样式
.upload-demo {
  justify-content: center;

  /deep/ .el-upload-dragger {
    width: 300px;
  }
}

// 表格样式优化
/deep/ .el-table {
  .el-input__inner,
  .el-textarea__inner {
    border: 1px solid #dcdfe6;
    
    &:focus {
      border-color: #409eff;
    }
  }
}

// 一行显示的表单项
.inline-form-item {
  /deep/ .el-form-item__content {
    line-height: 32px;
    text-align: left; // 确保内容左对齐
  }
}

// 确保所有表单项内容都左对齐
/deep/ .el-form-item__content {
  text-align: left;
}

// 分割线样式优化
/deep/ .el-divider {
  margin: 15px 0 10px 0; // 减少上下间距
}
</style>

