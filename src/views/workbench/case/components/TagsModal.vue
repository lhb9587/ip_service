<template>
  <div class="tags-modal">
    <div v-if="showInline" class="tags-modal__inline">
      <div class="tags-modal__content" :class="{ 'is-empty': !caseTagCurrentPath }">
        {{ caseTagCurrentPath || '未设置标签' }}
      </div>
      <div class="tags-modal__actions">
        <el-button
          type="primary"
          size="mini"
          :disabled="caseTagSubmitting || !caseId || !caseTagCustAllow"
          @click="openDialog"
        >
          设置标签
        </el-button>
        <el-button
          size="mini"
          :disabled="caseTagSubmitting || !caseTagCurrentPath"
          @click="clearSingleCaseTag"
        >
          清除
        </el-button>
      </div>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="720px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="!caseTagSubmitting"
      :show-close="!caseTagSubmitting"
      @close="closeDialog"
    >
      <div class="tags-modal__tree">
        <CustomerTree
          ref="caseTagTree"
          v-model="caseTagDraftValue"
          :data="projectTreeData"
          :label-key="labelKey"
          :value-key="valueKey"
          :children-key="childrenKey"
          :disabled="caseTagSubmitting"
          :manageable="manageable"
          :allow-input="allowInput"
          :default-expand-all="defaultExpandAll"
          :show-path="showPath"
          :search-placeholder="searchPlaceholder"
          :empty-text="emptyText"
          @selected-change="handleCaseTagDraftChange"
        />
      </div>
      <span slot="footer">
        <el-button :disabled="caseTagSubmitting" @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="caseTagSubmitting" @click="saveCaseTagDialog">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CustomerTree from '@/components/CustomerTree'
import { queryCaseTagTree, queryCaseTagCustAllow, batchUpdateCaseTag, updateCaseTag, clearCaseTag } from '@/api/caseTag'

export default {
  name: 'TagsModal',
  components: {
    CustomerTree
  },
  computed: {
    isBatchMode: function() {
      return this.batchMode
    },
    targetCaseIdList: function() {
      const source = this.isBatchMode
        ? (this.caseIdList && this.caseIdList.length ? this.caseIdList : [])
        : (this.caseId ? [this.caseId] : [])
      return Array.from(new Set(source.filter(Boolean)))
    },
    targetCaseKey: function() {
      return this.targetCaseIdList.join(',')
    },
    dialogTitle: function() {
      return this.isBatchMode ? '批量设置标签' : '设置标签'
    }
  },
  props: {
    caseId: {
      type: [String, Number],
      default: ''
    },
    caseIdList: {
      type: Array,
      default: function() {
        return []
      }
    },
    batchMode: {
      type: Boolean,
      default: false
    },
    custId: {
      type: [String, Number],
      default: ''
    },
    caseTagInfo: {
      type: Object,
      default: function() {
        return null
      }
    },
    labelKey: {
      type: String,
      default: 'tagName'
    },
    valueKey: {
      type: String,
      default: 'tagId'
    },
    childrenKey: {
      type: String,
      default: 'childrens'
    },
    manageable: {
      type: Boolean,
      default: true
    },
    allowInput: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    showPath: {
      type: Boolean,
      default: false
    },
    showInline: {
      type: Boolean,
      default: true
    },
    searchPlaceholder: {
      type: String,
      default: '请输入标签名称搜索'
    },
    emptyText: {
      type: String,
      default: '暂无标签数据'
    }
  },
  data: function() {
    return {
      dialogVisible: false,
      caseTagValue: '',
      caseTagCurrentPath: '',
      caseTagDraftValue: '',
      caseTagDraftNode: null,
      caseTagSubmitting: false,
      caseTagCustAllow: false,
      caseTagCustAllowMessage: '',
      projectTreeData: []
    }
  },
  watch: {
    targetCaseKey: {
      immediate: true,
      handler: function(val) {
        if (!val) {
          this.caseTagCustAllow = false
          this.caseTagCustAllowMessage = ''
          this.caseTagCurrentPath = ''
          this.caseTagDraftValue = ''
          this.caseTagDraftNode = null
          this.projectTreeData = []
          return
        }
        this.getCaseTagCustAllow()
        this.getCaseTagTree()
      }
    },
    caseTagInfo: {
      immediate: true,
      deep: true,
      handler: function(val) {
        this.syncCaseTagValue(val)
      }
    }
  },
  methods: {
    buildCaseTagCustAllowParams: function() {
      if (this.targetCaseIdList.length <= 1) {
        return { caseId: this.targetCaseIdList[0] }
      }
      return { caseIdList: this.targetCaseIdList }
    },
    getCaseTagCustAllow: function() {
      const params = this.buildCaseTagCustAllowParams()
      return queryCaseTagCustAllow(params).then(res => {
        const allow = !!(res && res.data && Number(res.data.result) === 1)
        this.caseTagCustAllow = allow
        this.caseTagCustAllowMessage = allow
          ? ((res && res.message) || '')
          : '当前案件无权设置标签'
        return this.caseTagCustAllow
      }).catch(() => {
        this.caseTagCustAllow = false
        this.caseTagCustAllowMessage = ''
        return false
      })
    },
    getCaseTagTree: function() {
      queryCaseTagTree().then(res => {
        this.projectTreeData = Array.isArray(res.data) ? res.data : []
      }).catch(() => {
        this.projectTreeData = []
      })
    },
    resolveTagPath: function(caseTagInfo) {
      if (!caseTagInfo) {
        return ''
      }
      if (Object.prototype.hasOwnProperty.call(caseTagInfo, 'tagPath')) {
        return caseTagInfo.tagPath || ''
      }
      if (Array.isArray(caseTagInfo.tagPathList) && caseTagInfo.tagPathList.length) {
        return caseTagInfo.tagPathList.map(item => {
          if (typeof item === 'string') {
            return item
          }
          return item.tagName || item.label || ''
        }).filter(Boolean).join('/')
      }
      if (Array.isArray(caseTagInfo.pathList) && caseTagInfo.pathList.length) {
        return caseTagInfo.pathList.map(item => {
          if (typeof item === 'string') {
            return item
          }
          return item.tagName || item.label || ''
        }).filter(Boolean).join('/')
      }
      if (caseTagInfo.tagName) {
        return caseTagInfo.tagName
      }
      return ''
    },
    syncCaseTagValue: function(caseTagInfo) {
      const tagPath = this.resolveTagPath(caseTagInfo)
      this.caseTagValue = tagPath
      this.caseTagCurrentPath = tagPath
      this.caseTagDraftValue = tagPath
      this.caseTagDraftNode = null
    },
    openDialog: async function() {
      if (!this.targetCaseIdList.length || this.caseTagSubmitting) {
        return
      }
      if (!this.caseTagCustAllow) {
        const allow = await this.getCaseTagCustAllow()
        if (!allow) {
          this.caseTagCustAllowMessage && this.$message.error(this.caseTagCustAllowMessage)
          return
        }
      }
      this.caseTagDraftValue = this.isBatchMode ? '' : (this.caseTagCurrentPath || '')
      this.caseTagDraftNode = null
      this.dialogVisible = true
    },
    closeDialog: function(force) {
      if (this.caseTagSubmitting && !force) {
        return
      }
      this.dialogVisible = false
      this.caseTagDraftValue = this.caseTagCurrentPath || ''
      this.caseTagDraftNode = null
    },
    handleCaseTagDraftChange: function(list) {
      if (!Array.isArray(list) || !list.length) {
        this.caseTagDraftNode = null
        return
      }
      const currentNode = list[0] || null
      this.caseTagDraftNode = currentNode
      this.caseTagDraftValue = currentNode && currentNode.pathValue ? currentNode.pathValue : this.caseTagDraftValue
    },
    saveCaseTagDialog: function() {
      if (this.caseTagSubmitting) {
        return
      }
      if (!this.caseTagDraftNode) {
        if (this.caseTagDraftValue && this.caseTagDraftValue === this.caseTagCurrentPath) {
          this.closeDialog()
          return
        }
        this.$message.warning('请选择标签')
        return
      }
      const nextTagPath = this.caseTagDraftNode.pathValue || this.caseTagDraftValue || ''
      if (!nextTagPath) {
        this.$message.warning('请选择标签')
        return
      }
      if (nextTagPath === this.caseTagCurrentPath) {
        this.closeDialog()
        return
      }
      if (this.isBatchMode) {
        this.batchUpdateCaseTag(this.caseTagDraftNode)
        return
      }
      this.updateSingleCaseTag(this.caseTagDraftNode)
    },
    isCreatedCaseTagNode: function(node) {
      if (!node) {
        return false
      }
      if (node.source === null) {
        return true
      }
      return typeof node.id === 'string' && node.id.indexOf('customer-tree-') === 0
    },
    buildCaseTagUpdateParams: function(node) {
      const params = {
        caseId: this.caseId,
        custId: this.custId,
        tagPath: (node && node.pathValue) || this.caseTagValue || ''
      }
      return params
    },
    batchUpdateCaseTag: function(node) {
      const params = {
        caseIdList: this.targetCaseIdList,
        tagPath: (node && node.pathValue) || this.caseTagDraftValue || ''
      }
      this.caseTagSubmitting = true
      return batchUpdateCaseTag(params).then(res => {
        if (res && res.success === false) {
          throw new Error(res.message || '标签设置失败')
        }
        this.caseTagDraftValue = ''
        this.caseTagDraftNode = null
        this.$message.success((res && res.message) || '标签设置成功')
        this.getCaseTagTree()
        this.closeDialog(true)
        this.$emit('change', {
          batch: true,
          caseIdList: this.targetCaseIdList.slice(),
          response: res
        })
        return res
      }).catch(err => {
        this.$message.error((err && err.message) || '标签设置失败')
        throw err
      }).finally(() => {
        this.caseTagSubmitting = false
      })
    },
    updateSingleCaseTag: function(node) {
      const tagPath = node && node.pathValue ? node.pathValue : this.caseTagValue
      const params = this.buildCaseTagUpdateParams(node)
      this.caseTagSubmitting = true
      return updateCaseTag(params).then(res => {
        if (res && res.success === false) {
          throw new Error(res.message || '设置标签失败')
        }
        const serverTagPath = res && res.data && res.data.tagPath ? res.data.tagPath : tagPath
        this.caseTagValue = serverTagPath
        this.caseTagCurrentPath = serverTagPath
        this.caseTagDraftValue = serverTagPath
        this.$message.success((res && res.message) || '标签设置成功')
        // this.getCaseTagTree()
        this.closeDialog(true)
        this.$emit('change', serverTagPath)
        return res
      }).catch(err => {
        this.caseTagValue = this.caseTagCurrentPath
        this.caseTagDraftValue = this.caseTagCurrentPath
        this.$message.error((err && err.message) || '标签设置失败')
        throw err
      }).finally(() => {
        this.caseTagSubmitting = false
      })
    },
    clearSingleCaseTag: function() {
      if (!this.caseId || this.caseTagSubmitting || !this.caseTagCurrentPath) {
        return
      }
      this.caseTagSubmitting = true
      clearCaseTag({
        caseId: this.caseId
      }).then(res => {
        if (res && res.success === false) {
          throw new Error(res.message || '清除标签失败')
        }
        this.caseTagValue = ''
        this.caseTagCurrentPath = ''
        this.caseTagDraftValue = ''
        this.caseTagDraftNode = null
        this.dialogVisible = false
        this.$message.success((res && res.message) || '标签已清除')
        this.$emit('change', '')
      }).catch(err => {
        this.caseTagValue = this.caseTagCurrentPath
        this.caseTagDraftValue = this.caseTagCurrentPath
        this.$message.error((err && err.message) || '清除标签失败')
      }).finally(() => {
        this.caseTagSubmitting = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-modal__inline {
  display: flex;
  align-items: center;
  width: 100%;
}

.tags-modal__content {
  flex: 1;
  min-height: 32px;
  padding: 5px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  color: #606266;
  line-height: 22px;
  word-break: break-all;
}

.tags-modal__content.is-empty {
  color: #c0c4cc;
}

.tags-modal__actions {
  flex: none;
  margin-left: 10px;
  white-space: nowrap;
}

.tags-modal__tree {
  min-height: 240px;

  /deep/ .customer-tree__toolbar {
    margin-bottom: 8px;
  }

  /deep/ .customer-tree__selected {
    margin-bottom: 8px;
    padding: 8px 12px;
  }

  /deep/ .customer-tree__tree {
    max-height: 240px;
  }

  /deep/ .customer-tree__tip {
    display: none;
  }
}
</style>
