<template>
  <div class="customer-tree">
    <div v-if="selectedDetails.length" class="customer-tree__selected">
      <div class="customer-tree__selected-title">
        <span>已选标签</span>
        <el-button
          v-if="clearable"
          type="text"
          :disabled="disabled"
          @click="clearSelection"
        >
          清空
        </el-button>
      </div>
      <div class="customer-tree__tags">
        <el-tag
          v-for="item in selectedDetails"
          :key="item.pathValue"
          class="customer-tree__tag"
          size="small"
          :closable="!disabled"
          @close="removeSelection(item.pathValue)"
        >
          {{ item.pathValue }}
        </el-tag>
      </div>
    </div>

    <div class="customer-tree__toolbar">
      <div class="customer-tree__toolbar-main">
        <el-input
          v-model.trim="filterText"
          class="customer-tree__search"
          clearable
          :disabled="disabled"
          :placeholder="searchPlaceholder"
          prefix-icon="el-icon-search"
        />
        <el-button
          v-if="manageable && allowCreate"
          class="customer-tree__root-button"
          type="primary"
          plain
          icon="el-icon-folder-add"
          :disabled="disabled"
          @click="createRootNode"
        >
          新增一级
        </el-button>
      </div>

      <div v-if="allowInput" class="customer-tree__manual">
        <el-autocomplete
          ref="manualInput"
          v-model.trim="manualText"
          class="customer-tree__autocomplete"
          clearable
          :disabled="disabled"
          :fetch-suggestions="fetchSuggestions"
          :placeholder="inputPlaceholderText"
          :trigger-on-focus="true"
          @select="handleSuggestionSelect"
          @keyup.enter.native="confirmManualInput"
        >
          <template slot-scope="{ item }">
            <div class="customer-tree__suggestion">
              <div class="customer-tree__suggestion-title">{{ item.pathValue }}</div>
              <div class="customer-tree__suggestion-meta">第{{ item.level }}级标签</div>
            </div>
          </template>
        </el-autocomplete>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          :disabled="disabled"
          @click="confirmManualInput"
        >
          {{ multiple ? '添加标签' : '设置标签' }}
        </el-button>
      </div>
    </div>

    <div v-if="tipText" class="customer-tree__tip">
      <i class="el-icon-info" />
      <span>{{ tipText }}</span>
    </div>

    <div class="customer-tree__panel">
      <el-tree
        ref="tree"
        class="customer-tree__tree"
        :data="treeData"
        :props="treeProps"
        :node-key="treeNodeKey"
        :empty-text="emptyText"
        :show-checkbox="multiple"
        :check-strictly="multiple"
        :highlight-current="!multiple"
        :expand-on-click-node="false"
        :default-expand-all="defaultExpandAll"
        :filter-node-method="filterNode"
        @check="handleTreeCheck"
        @node-click="handleNodeClick"
      >
        <span slot-scope="{ data: treeNodeData }" class="customer-tree__node">
          <span class="customer-tree__node-main">
            <span class="customer-tree__node-label">{{ treeNodeData.label }}</span>
            <span v-if="showPath && treeNodeData.level > 1" class="customer-tree__node-path">
              {{ treeNodeData.pathValue }}
            </span>
          </span>
          <span v-if="manageable" class="customer-tree__node-actions">
            <el-button
              v-if="allowCreate && treeNodeData.level < maxLevel"
              type="text"
              size="mini"
              :disabled="disabled"
              @click.stop="createChildNode(treeNodeData)"
            >
              新增
            </el-button>
            <el-button
              v-if="allowEdit"
              type="text"
              size="mini"
              :disabled="disabled"
              @click="editNode(treeNodeData)"
            >
              编辑
            </el-button>
            <el-button
              v-if="allowDelete"
              type="text"
              size="mini"
              class="customer-tree__danger"
              :disabled="disabled"
              @click.stop="deleteNode(treeNodeData)"
            >
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
const DEFAULT_SEGMENT_REGEXP = /^[\u4e00-\u9fa5A-Za-z0-9（）()_\-.,，。&·、\s]+$/

export default {
  name: 'CustomerTree',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 当前选中值，支持字符串、数组或节点对象
    value: {
      type: [String, Array, Object],
      default: null
    },
    // 树数据源，支持树形对象数组或路径字符串数组
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 是否开启多选模式
    multiple: {
      type: Boolean,
      default: false
    },
    // 多级路径分隔符
    separator: {
      type: String,
      default: '/'
    },
    // 允许的最大层级
    maxLevel: {
      type: Number,
      default: 4
    },
    // 树节点显示字段名
    labelKey: {
      type: String,
      default: 'label'
    },
    // 树节点唯一值字段名
    valueKey: {
      type: String,
      default: 'id'
    },
    // 子节点字段名
    childrenKey: {
      type: String,
      default: 'children'
    },
    // 是否显示手动输入路径区域
    allowInput: {
      type: Boolean,
      default: true
    },
    // 是否允许创建不存在的节点
    allowCreate: {
      type: Boolean,
      default: true
    },
    // 是否开启节点管理能力，包含增删改入口
    manageable: {
      type: Boolean,
      default: false
    },
    // 是否允许编辑节点名称
    allowEdit: {
      type: Boolean,
      default: true
    },
    // 是否允许删除节点
    allowDelete: {
      type: Boolean,
      default: true
    },
    // 是否显示清空按钮
    clearable: {
      type: Boolean,
      default: true
    },
    // 是否禁用整个组件
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否默认展开全部节点
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    // 空数据时的提示文案
    emptyText: {
      type: String,
      default: '暂无标签数据'
    },
    // 顶部搜索框占位文案
    searchPlaceholder: {
      type: String,
      default: '请输入标签关键字搜索'
    },
    // 手动输入框占位文案，为空时使用组件内默认文案
    inputPlaceholder: {
      type: String,
      default: ''
    },
    // 是否在节点右侧展示完整路径
    showPath: {
      type: Boolean,
      default: true
    },
    // 顶部提示文案，为空时按单选/多选模式显示默认提示
    tip: {
      type: String,
      default: ''
    },
    // v-model 输出格式，可选 path、pathArray、node
    valueFormat: {
      type: String,
      default: 'path',
      validator: function(value) {
        return ['path', 'pathArray', 'node'].indexOf(value) > -1
      }
    },
    // 单级节点名称的校验规则
    segmentPattern: {
      type: RegExp,
      default: function() {
        return DEFAULT_SEGMENT_REGEXP
      }
    }
  },
  data: function() {
    return {
      filterText: '',
      manualText: '',
      treeData: [],
      flatOptions: [],
      selectedPaths: [],
      autoId: 0
    }
  },
  computed: {
    treeProps: function() {
      return {
        children: 'children',
        label: 'label'
      }
    },
    treeNodeKey: function() {
      return 'nodeKey'
    },
    inputPlaceholderText: function() {
      if (this.inputPlaceholder) {
        return this.inputPlaceholder
      }
      return this.multiple
        ? '输入标签路径后回车，可添加多个标签'
        : '输入标签路径后回车，例如：品牌/超人'
    },
    selectedDetails: function() {
      const _this = this
      return this.selectedPaths.map(function(pathValue) {
        return _this.findNodeByPath(pathValue) || _this.createVirtualNode(pathValue)
      })
    },
    tipText: function() {
      if (this.tip) {
        return this.tip
      }
      if (this.multiple) {
        return '多标签查询默认按 OR 匹配，命中任一标签即可。'
      }
      return '同一案件仅支持选择一条标签路径，新选择会替换原标签。'
    }
  },
  watch: {
    filterText: function(val) {
      if (this.$refs.tree) {
        this.$refs.tree.filter(val)
      }
    },
    data: {
      deep: true,
      handler: function() {
        this.initTreeData()
      }
    },
    value: {
      immediate: true,
      handler: function(val) {
        this.syncSelectionFromValue(val)
      }
    }
  },
  created: function() {
    this.initTreeData()
  },
  methods: {
    initTreeData: function() {
      this.autoId = 0
      this.treeData = this.normalizeDataSource(this.data)
      this.refreshFlatOptions()
      this.syncSelectionFromValue(this.value)
    },
    refreshFlatOptions: function() {
      this.flatOptions = this.flattenTree(this.treeData)
    },
    normalizeDataSource: function(source) {
      if (!Array.isArray(source) || !source.length) {
        return []
      }
      const isPathList = source.every(function(item) {
        return typeof item === 'string' || Array.isArray(item)
      })
      if (isPathList) {
        return this.buildTreeByPathList(source)
      }
      return this.normalizeTreeNodes(source, [])
    },
    normalizeTreeNodes: function(nodes, parentLabels) {
      const _this = this
      return (nodes || []).reduce(function(result, item) {
        if (!item) {
          return result
        }
        const label = _this.getNodeLabel(item)
        if (!label) {
          return result
        }
        const pathLabels = parentLabels.concat(label)
        const pathValue = pathLabels.join(_this.separator)
        const childKey = _this.resolveChildrenKey(item)
        const children = _this.normalizeTreeNodes(item[childKey] || [], pathLabels)
        result.push({
          id: item[_this.valueKey] || pathValue,
          label: label,
          level: pathLabels.length,
          pathLabels: pathLabels,
          pathValue: pathValue,
          nodeKey: pathValue,
          children: children,
          source: item
        })
        return result
      }, [])
    },
    buildTreeByPathList: function(pathList) {
      const _this = this
      const root = []
      pathList.forEach(function(item) {
        const pathLabels = _this.normalizePathInput(item)
        if (!pathLabels.length) {
          return
        }
        _this.ensurePath(pathLabels, root, { silent: true })
      })
      return root
    },
    ensurePath: function(pathLabels, targetTree, options) {
      const _this = this
      const tree = targetTree || this.treeData
      const config = options || {}
      let currentLevel = tree
      const currentPath = []
      const createdNodes = []
      let lastNode = null
      pathLabels.forEach(function(label, index) {
        currentPath.push(label)
        const pathValue = currentPath.join(_this.separator)
        let existed = currentLevel.find(function(node) {
          return node.label === label
        })
        if (!existed) {
          existed = {
            id: 'customer-tree-' + (++_this.autoId),
            label: label,
            level: index + 1,
            pathLabels: currentPath.slice(),
            pathValue: pathValue,
            nodeKey: pathValue,
            children: [],
            source: null
          }
          currentLevel.push(existed)
          createdNodes.push(existed)
        }
        lastNode = existed
        currentLevel = existed.children
      })
      if (createdNodes.length && !config.silent) {
        this.refreshFlatOptions()
        this.emitTreeChange(createdNodes, lastNode)
      } else if (createdNodes.length) {
        this.refreshFlatOptions()
      }
      return lastNode
    },
    emitTreeChange: function(createdNodes, lastNode) {
      this.$emit('tree-change', this.cloneTree(this.treeData))
      this.$emit('create-tag', {
        createdNodes: createdNodes.map(this.createNodePayload),
        currentNode: lastNode ? this.createNodePayload(lastNode) : null
      })
    },
    createRootNode: function() {
      const _this = this
      this.openNodePrompt({
        title: '新增一级标签',
        message: '请输入一级标签名称',
        siblings: this.treeData
      }).then(function(label) {
        const node = _this.ensurePath([label])
        _this.scrollTreeToBottom()
        _this.$emit('node-add', {
          type: 'root',
          node: node ? _this.createNodePayload(node) : null
        })
      }).catch(function() {})
    },
    createChildNode: function(node) {
      const _this = this
      this.openNodePrompt({
        title: '新增下级标签',
        message: '请输入下级标签名称',
        siblings: node.children || []
      }).then(function(label) {
        const nextNode = _this.ensurePath(node.pathLabels.concat(label))
        _this.$emit('node-add', {
          type: 'child',
          parentNode: _this.createNodePayload(node),
          node: nextNode ? _this.createNodePayload(nextNode) : null
        })
      }).catch(function() {})
    },
    editNode: function(node) {
      const _this = this
      const relation = this.findNodeRelation(node.pathValue)
      const siblings = relation && relation.list ? relation.list.filter(function(item) {
        return item.pathValue !== node.pathValue
      }) : []
      this.openNodePrompt({
        title: '编辑标签',
        message: '请修改标签名称',
        value: node.label,
        siblings: siblings
      }).then(function(label) {
        const oldPathValue = node.pathValue
        relation.node.label = label
        _this.rebuildTreeMeta()
        _this.replaceSelectedPathPrefix(oldPathValue, relation.node.pathValue)
        _this.refreshFlatOptions()
        _this.syncTreeSelection()
        _this.emitValueChange()
        _this.$emit('tree-change', _this.cloneTree(_this.treeData))
        _this.$emit('node-edit', {
          oldPathValue: oldPathValue,
          node: _this.createNodePayload(relation.node)
        })
      }).catch(function() {})
    },
    deleteNode: function(node) {
      const _this = this
      this.$confirm(
        '删除后将同时移除该节点下的所有下级标签，是否继续？',
        '删除提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(function() {
        const relation = _this.findNodeRelation(node.pathValue)
        if (!relation || relation.index < 0) {
          return
        }
        const removedNode = relation.list.splice(relation.index, 1)[0]
        _this.rebuildTreeMeta()
        _this.removeSelectedPathPrefix(removedNode.pathValue)
        _this.refreshFlatOptions()
        _this.syncTreeSelection()
        _this.emitValueChange()
        _this.$emit('tree-change', _this.cloneTree(_this.treeData))
        _this.$emit('node-delete', {
          node: _this.createNodePayload(removedNode)
        })
      }).catch(function() {})
    },
    openNodePrompt: function(config) {
      const _this = this
      return this.$prompt(config.message, config.title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: config.value || '',
        beforeClose: function(action, instance, done) {
          if (action !== 'confirm') {
            done()
            return
          }
          const validateResult = _this.validateSingleLabel(instance.inputValue, config.siblings || [])
          if (validateResult === true) {
            instance.editorErrorMessage = ''
            done()
            return
          }
          instance.editorErrorMessage = validateResult
        }
      }).then(function(result) {
        return String(result.value || '').trim()
      })
    },
    validateSingleLabel: function(value, siblings) {
      const label = String(value || '').trim()
      if (!label) {
        return '请输入标签名称'
      }
      if (label.indexOf(this.separator) > -1) {
        return '单级标签名称不能包含分隔符'
      }
      if (label.length > 100) {
        return '单个标签名称最多允许 100 个字符'
      }
      if (!this.segmentPattern.test(label)) {
        return '标签仅允许中文、英文、数字及常见符号'
      }
      if ((siblings || []).some(function(item) { return item.label === label })) {
        return '同级标签名称已存在'
      }
      return true
    },
    findNodeRelation: function(pathValue, nodes, parentNode) {
      const _this = this
      const nodeList = nodes || this.treeData
      let matched = null
      nodeList.some(function(item, index) {
        if (item.pathValue === pathValue) {
          matched = {
            node: item,
            parentNode: parentNode || null,
            list: nodeList,
            index: index
          }
          return true
        }
        if (item.children && item.children.length) {
          matched = _this.findNodeRelation(pathValue, item.children, item)
          return !!matched
        }
        return false
      })
      return matched
    },
    rebuildTreeMeta: function(nodes, parentLabels) {
      const _this = this
      const nodeList = nodes || this.treeData
      const baseLabels = parentLabels || []
      nodeList.forEach(function(node) {
        const nextLabels = baseLabels.concat(node.label)
        node.level = nextLabels.length
        node.pathLabels = nextLabels
        node.pathValue = nextLabels.join(_this.separator)
        node.nodeKey = node.pathValue
        if (!Array.isArray(node.children)) {
          node.children = []
        }
        _this.rebuildTreeMeta(node.children, nextLabels)
      })
    },
    replaceSelectedPathPrefix: function(oldPrefix, newPrefix) {
      const separatorPrefix = oldPrefix + this.separator
      this.selectedPaths = this.uniqueList(this.selectedPaths.map(function(pathValue) {
        if (pathValue === oldPrefix) {
          return newPrefix
        }
        if (pathValue.indexOf(separatorPrefix) === 0) {
          return newPrefix + pathValue.slice(oldPrefix.length)
        }
        return pathValue
      }))
    },
    removeSelectedPathPrefix: function(prefix) {
      const separatorPrefix = prefix + this.separator
      this.selectedPaths = this.selectedPaths.filter(function(pathValue) {
        return pathValue !== prefix && pathValue.indexOf(separatorPrefix) !== 0
      })
    },
    flattenTree: function(nodes) {
      const result = []
        ;(function walk(list) {
        (list || []).forEach(function(node) {
          result.push(node)
          if (node.children && node.children.length) {
            walk(node.children)
          }
        })
      })(nodes)
      return result
    },
    filterNode: function(value, data) {
      if (!value) {
        return true
      }
      const keyword = String(value).toLowerCase()
      return data.label.toLowerCase().indexOf(keyword) > -1 ||
          data.pathValue.toLowerCase().indexOf(keyword) > -1
    },
    fetchSuggestions: function(queryString, cb) {
      const keyword = (queryString || '').toLowerCase()
      const list = this.flatOptions.filter(function(item) {
        if (!keyword) {
          return true
        }
        return item.pathValue.toLowerCase().indexOf(keyword) > -1 ||
            item.label.toLowerCase().indexOf(keyword) > -1
      }).slice(0, 20)
      cb(list)
    },
    handleSuggestionSelect: function(item) {
      this.applySelection(item.pathValue)
      this.manualText = ''
    },
    handleNodeClick: function(data) {
      if (this.multiple || this.disabled) {
        return
      }
      this.applySelection(data.pathValue)
    },
    handleTreeCheck: function() {
      if (!this.multiple || this.disabled) {
        return
      }
      const checkedKeys = this.$refs.tree ? this.$refs.tree.getCheckedKeys() : []
      this.selectedPaths = this.uniqueList(checkedKeys)
      this.emitValueChange()
    },
    confirmManualInput: function() {
      if (this.disabled) {
        return
      }
      const pathLabels = this.normalizePathInput(this.manualText)
      if (!pathLabels.length) {
        return
      }
      if (!this.validatePath(pathLabels)) {
        return
      }
      let node = this.findNodeByPath(pathLabels.join(this.separator))
      if (!node && !this.allowCreate) {
        this.$message.warning('标签库中未找到该标签，请从已有标签中选择。')
        return
      }
      if (!node) {
        node = this.ensurePath(pathLabels)
      }
      this.applySelection(node.pathValue)
      this.manualText = ''
    },
    validatePath: function(pathLabels) {
      if (pathLabels.length > this.maxLevel) {
        this.$message.error('标签最多支持 ' + this.maxLevel + ' 级。')
        return false
      }
      const invalidLabel = pathLabels.find(function(label) {
        return !label
      })
      if (invalidLabel === '') {
        this.$message.error('标签层级不能为空，请检查分隔符两侧内容。')
        return false
      }
      const tooLongLabel = pathLabels.find(function(label) {
        return label.length > 100
      })
      if (tooLongLabel) {
        this.$message.error('单个标签名称最多允许 100 个字符。')
        return false
      }
      const invalidPatternLabel = pathLabels.find(function(label) {
        return !this.segmentPattern.test(label)
      }, this)
      if (invalidPatternLabel) {
        this.$message.error('标签仅允许中文、英文、数字及常见符号。')
        return false
      }
      return true
    },
    applySelection: function(pathValue) {
      let node = this.findNodeByPath(pathValue)
      if (!node && this.allowCreate) {
        node = this.ensurePath(this.normalizePathInput(pathValue))
      }
      if (!node) {
        return
      }
      if (this.multiple) {
        this.selectedPaths = this.uniqueList(this.selectedPaths.concat(node.pathValue))
      } else {
        this.selectedPaths = [node.pathValue]
      }
      this.syncTreeSelection()
      this.emitValueChange()
    },
    removeSelection: function(pathValue) {
      if (this.disabled) {
        return
      }
      this.selectedPaths = this.selectedPaths.filter(function(item) {
        return item !== pathValue
      })
      this.syncTreeSelection()
      this.emitValueChange()
    },
    clearSelection: function() {
      if (this.disabled) {
        return
      }
      this.selectedPaths = []
      this.syncTreeSelection()
      this.emitValueChange()
    },
    syncSelectionFromValue: function(value) {
      const _this = this
      const normalized = this.normalizeModelValue(value)
      normalized.forEach(function(pathValue) {
        if (!_this.findNodeByPath(pathValue) && _this.allowCreate) {
          _this.ensurePath(_this.normalizePathInput(pathValue), null, { silent: true })
        }
      })
      this.selectedPaths = this.uniqueList(normalized).filter(function(pathValue) {
        return !!_this.findNodeByPath(pathValue)
      })
      this.syncTreeSelection()
    },
    syncTreeSelection: function() {
      const _this = this
      this.$nextTick(function() {
        if (!_this.$refs.tree) {
          return
        }
        if (_this.multiple) {
          _this.$refs.tree.setCheckedKeys(_this.selectedPaths)
        } else {
          _this.$refs.tree.setCurrentKey(_this.selectedPaths[0] || null)
        }
      })
    },
    emitValueChange: function() {
      const payload = this.formatValueByType()
      this.$emit('change', payload)
      this.$emit('input', payload)
      this.$emit('selected-change', this.selectedDetails.map(this.createNodePayload))
    },
    formatValueByType: function() {
      const list = this.selectedDetails
      let payload
      if (this.valueFormat === 'pathArray') {
        payload = list.map(function(item) {
          return item.pathLabels.slice()
        })
      } else if (this.valueFormat === 'node') {
        payload = list.map(this.createNodePayload)
      } else {
        payload = list.map(function(item) {
          return item.pathValue
        })
      }
      if (this.multiple) {
        return payload
      }
      return payload.length ? payload[0] : null
    },
    normalizeModelValue: function(value) {
      const _this = this
      if (value === null || value === undefined || value === '') {
        return []
      }
      const list = this.multiple ? (Array.isArray(value) ? value : [value]) : [value]
      return list.map(function(item) {
        return _this.stringifyPath(item)
      }).filter(function(item) {
        return !!item
      })
    },
    stringifyPath: function(item) {
      if (!item) {
        return ''
      }
      if (typeof item === 'string') {
        return this.normalizePathInput(item).join(this.separator)
      }
      if (Array.isArray(item)) {
        return this.normalizePathInput(item).join(this.separator)
      }
      if (item.pathValue) {
        return this.normalizePathInput(item.pathValue).join(this.separator)
      }
      if (Array.isArray(item.pathLabels)) {
        return this.normalizePathInput(item.pathLabels).join(this.separator)
      }
      if (item.label) {
        return String(item.label).trim()
      }
      return ''
    },
    normalizePathInput: function(value) {
      const separator = this.separator
      const list = Array.isArray(value) ? value : String(value || '').split(separator)
      return list.map(function(item) {
        return String(item || '').trim()
      }).filter(function(item) {
        return item !== ''
      })
    },
    findNodeByPath: function(pathValue) {
      const target = this.stringifyPath(pathValue)
      return this.flatOptions.find(function(item) {
        return item.pathValue === target
      }) || null
    },
    getNodeLabel: function(item) {
      return String(
        item[this.labelKey] ||
          item.label ||
          item.name ||
          item.title ||
          ''
      ).trim()
    },
    resolveChildrenKey: function(item) {
      if (item[this.childrenKey] && Array.isArray(item[this.childrenKey])) {
        return this.childrenKey
      }
      if (item.children && Array.isArray(item.children)) {
        return 'children'
      }
      if (item.child && Array.isArray(item.child)) {
        return 'child'
      }
      return this.childrenKey
    },
    uniqueList: function(list) {
      return Array.from(new Set(list))
    },
    createNodePayload: function(node) {
      return {
        id: node.id,
        label: node.label,
        level: node.level,
        pathValue: node.pathValue,
        pathLabels: node.pathLabels.slice(),
        source: node.source
      }
    },
    createVirtualNode: function(pathValue) {
      const pathLabels = this.normalizePathInput(pathValue)
      return {
        id: pathValue,
        label: pathLabels[pathLabels.length - 1] || '',
        level: pathLabels.length,
        pathValue: pathLabels.join(this.separator),
        pathLabels: pathLabels,
        source: null
      }
    },
    cloneTree: function(nodes) {
      return (nodes || []).map(function(node) {
        return {
          id: node.id,
          label: node.label,
          level: node.level,
          pathValue: node.pathValue,
          pathLabels: node.pathLabels.slice(),
          children: this.cloneTree(node.children || []),
          source: node.source
        }
      }, this)
    },
    scrollTreeToBottom: function() {
      this.$nextTick(function() {
        const treeEl = this.$refs.tree && this.$refs.tree.$el
        if (!treeEl) {
          return
        }
        treeEl.scrollTop = treeEl.scrollHeight
      })
    },
    focus: function() {
      const inputRef = this.$refs.manualInput
      if (inputRef && inputRef.focus) {
        inputRef.focus()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .customer-tree {
    width: 100%;
    color: #606266;
  }

  .customer-tree__toolbar {
    margin-bottom: 12px;
  }

  .customer-tree__toolbar-main {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    margin-bottom: 8px;
  }

  .customer-tree__search {
    width: 260px;
    min-width: 220px;
    flex: 1;
    margin-right: 12px;
  }

  .customer-tree__root-button {
    flex: none;
  }

  .customer-tree__manual {
    display: flex;
    align-items: center;
    min-width: 280px;
  }

  .customer-tree__autocomplete {
    flex: 1;
  }

  .customer-tree__manual .el-button {
    margin-left: 8px;
  }

  .customer-tree__selected {
    padding: 10px 12px;
    margin-bottom: 12px;
    background: #f7f9fc;
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }

  .customer-tree__selected-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 13px;
    color: #606266;
  }

  .customer-tree__tags {
    display: flex;
    flex-wrap: wrap;
  }

  .customer-tree__tag {
    margin-right: 8px;
    margin-bottom: 8px;
  }

  .customer-tree__tip {
    display: flex;
    align-items: flex-start;
    padding: 8px 12px;
    margin-bottom: 12px;
    background: #fdf6ec;
    border: 1px solid #faecd8;
    border-radius: 4px;
    color: #c08c3b;
    font-size: 12px;
    line-height: 1.5;
  }

  .customer-tree__tip i {
    margin-top: 2px;
    margin-right: 6px;
  }

  .customer-tree__panel {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background: #fff;
  }

  .customer-tree__tree {
    max-height: 360px;
    overflow: auto;
    padding: 8px 0;
  }

  .customer-tree__node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-width: 0;
    padding-right: 12px;
  }

  .customer-tree__node-main {
    display: flex;
    align-items: center;
    min-width: 0;
    flex: 1;
  }

  .customer-tree__node-label {
    flex: none;
    color: #303133;
  }

  .customer-tree__node-path {
    margin-left: 10px;
    color: #909399;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .customer-tree__node-actions {
    flex: none;
    margin-left: 8px;
    white-space: nowrap;
  }

  .customer-tree__node-actions .el-button + .el-button {
    margin-left: 4px;
  }

  .customer-tree__danger {
    color: #f56c6c;
  }

  .customer-tree__suggestion {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .customer-tree__suggestion-title {
    color: #303133;
  }

  .customer-tree__suggestion-meta {
    color: #909399;
    font-size: 12px;
    margin-left: 12px;
  }

  /deep/ .customer-tree__tree .el-tree-node__content {
    height: 34px;
  }

  /deep/ .customer-tree__tree .el-tree-node.is-current > .el-tree-node__content {
    background-color: #ecf5ff;
  }

  /deep/ .customer-tree__search .el-input__inner,
  /deep/ .customer-tree__autocomplete .el-input__inner {
    border-radius: 4px;
  }
  @media screen and (max-width: 768px) {
    .customer-tree__toolbar-main {
      flex-wrap: wrap;
    }

    .customer-tree__search,
    .customer-tree__manual {
      width: 100%;
      min-width: 100%;
      margin-right: 0;
    }

    .customer-tree__root-button {
      width: 100%;
      margin-top: 8px;
    }

    .customer-tree__manual {
      flex-wrap: wrap;
      margin-top: 8px;
    }

    .customer-tree__manual .el-button {
      width: 100%;
      margin-left: 0;
      margin-top: 8px;
    }
  }
</style>
