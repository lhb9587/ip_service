<template>
  <div class="tags-modal">
    <div class="tags-modal__inline">
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
      title="设置标签"
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
import { queryCaseTagTree, queryCaseTagCustAllow, updateCaseTag, clearCaseTag } from '@/api/caseTag'

export default {
  name: 'TagsModal',
  components: {
    CustomerTree
  },
  props: {
    caseId: {
      type: [String, Number],
      default: ''
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
      projectTreeData: []
    }
  },
  watch: {
    caseId: {
      immediate: true,
      handler: function(val) {
        if (!val) {
          this.caseTagCustAllow = false
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
    getCaseTagCustAllow: function() {
      return queryCaseTagCustAllow({
        caseId: this.caseId
      }).then(res => {
        this.caseTagCustAllow = !!(res && res.data && Number(res.data.result) === 1)
      }).catch(() => {
        this.caseTagCustAllow = false
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
      if (caseTagInfo.tagPath) {
        return caseTagInfo.tagPath
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
    openDialog: function() {
      if (!this.caseId || this.caseTagSubmitting || !this.caseTagCustAllow) {
        return
      }
      this.caseTagDraftValue = this.caseTagCurrentPath || ''
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
        custId: this.custId
      }
      if (this.isCreatedCaseTagNode(node)) {
        params.tagPath = node.pathValue || this.caseTagValue || ''
      } else {
        params.tagId = node.id
      }
      return params
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
        this.getCaseTagTree()
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
