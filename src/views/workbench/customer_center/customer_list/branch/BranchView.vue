<template>
  <div class="branch-info">
    <div class="manageBtn">
      <el-button size="small" class="" v-if="manageView || contactView" @click="manageCustFz(2)">分支查看</el-button>
      <el-button size="small" class="" v-if="!manageView || contactView" @click="manageCustFz(1)">管理分支</el-button>
      <el-button size="small" class="" v-if="manageView && !contactView" @click="contactListView">机构联系人查看</el-button>
      <el-button size="small" class="" type="primary" v-if="editStatus && manageView && !contactView" @click="addFz">新增</el-button>
      <el-button size="small" class="" type="primary" v-if="editStatus && manageView && contactView" @click="addContact">新增</el-button>
    </div>

<!--    <div class="base-header">-->
<!--      <span class="left-line"></span>-->
<!--      <span class="right-text">分支机构 - {{moduleName}}</span>-->
<!--      <span class="el-icon-full-screen" v-if="!manageView" title="全屏" @click="clickFullScreens"></span>-->
<!--    </div>-->
    <div v-show="manageView">
      <contact-manage ref="contactManage" v-if="custId && contactView" :editStatus="editStatus" :cust-id="custId" @changeMask="changeMask" @updateFz="updateFz"></contact-manage>
      <fz-manage ref="fzManage" v-if="custId && !contactView" :editStatus="editStatus" :cust-id="custId" @changeMask="changeMask" @updateFz="updateFz"></fz-manage>
    </div>
    <div v-show="!manageView" style="height: 630px; background-color: #F4FBFE; overflow: auto">
      <el-button v-if="peopleView" size="small" style="position:absolute;top: 60px;left: 25px;z-index: 2" @click="goBack">返回上一级</el-button>
      <zm-tree-org
        ref="tree"
        :props="props"
        :data="treeData"
        :disabled="disaled"
        :horizontal="horizontal"
        :collapsable="collapsable"
        :label-style="style"
        :node-draggable="false"
        :scalable="false"
        :default-expand-level="1"
        :define-menus="[]"
        :only-one-node="onlyOneNode"
        :clone-node-drag="cloneNodeDrag"
        :before-drag-end="beforeDragEnd"
        :toolBar="toolBar"
        :render-content="renderContent"
        :filterNodeMethod="filterNodeMethod"
        :node-edit="nodeEdit"
        @on-expand="onExpand"
        @on-node-click="onNodeClick"
        @on-node-dblclick="onNodeDblclick"
      >
        <!--                :define-menus="[]"
        -->
        <!-- <template v-slot="{node}">
            <div class="tree-org-node__text node-label">{{node.label}}</div>
        </template>
        <template v-slot:expand="{node}">
          <div>{{node.children.length}}</div>
        </template> -->
      </zm-tree-org>
    </div>
  </div>
</template>
<script>
  import screenfull from 'screenfull/dist/screenfull.js'
  import RenderContent from "./RenderContent";
  import {
    addCustomerJiagou, delCustomerJiagou,
    queryCustAndFenzhiInfo,
    queryCustomerJiagouById,
    queryCustTree, stopCustomerContact, updateCustomerJiagouById
  } from "../../../../../api/customerList";
  import FzManage from "./FzManage";
  import ContactManage from "./ContactManage";

  export default {
    name: 'BranchView',
    props: {
      tabNo: {},
      custId: {},
      editStatus: {
        type: Boolean,
        default: false
      }
    },
    components: {ContactManage, FzManage},
    data() {
      return {
        contactView: false,
        manageView: false,
        hideCustAndCustFzList: [],
        toolBar: {scale: false, restore: false, expand: false, zoom: false, fullscreen: false,},
        keyword: '',
        props: {
          id: 'treeId',
          pid: 'parentId',
          label: 'name'
        },
        allCustAndFzList: [],
        treeCustList: [],
        treeCustFzList: [],
        treeData: {},
        custData: {},
        peopleView: false,
        peopleData: {},
        horizontal: false,
        collapsable: true,
        onlyOneNode: true,
        cloneNodeDrag: false,
        expandAll: true,
        disaled: false,
        style: {
          background: '#fff',
          color: '#5e6d82'
        }
      }
    },
    computed: {
      moduleName() {
        if (this.contactView) {
          return '机构联系人'
        }
        if (this.manageView) {
          return '管理分支'
        }
        return '分支查看'
      }
      // hideData() {
      //   this.screenData(this.treeData)
      //   return [{
      //     label: '客户',
      //     options: this.treeCustList
      //   }, {
      //     label: '分支机构',
      //     options: this.treeCustFzList
      //   }]
      // }
    },
    created() {
      this.queryCustTree()
      if (screenfull.isEnabled) {
        screenfull.on('change', () => {
          this.$store.commit('app/SET_FULLSCREEN_STATE', screenfull.isFullscreen)
        });
      }
      // this.toggleExpand(this.data, this.expandAll);
    },
    mounted() {
    },
    methods: {
      addContact() {
        this.$refs.contactManage.addContact()
      },
      contactListView(){
        this.contactView = true
        this.manageView = true
      },
      goBack() {
        this.peopleView = false
        this.peopleData = {}
        this.treeData = JSON.parse(JSON.stringify(this.custData))
        this.props = {
          id: 'treeId',
          pid: 'parentId',
          label: 'name'
        }
      },
      addFz() {
        this.$refs.fzManage.addFz()
      },
      changeMask(obj) {
        obj.value = this.tabNo
        this.$emit('changeMask', obj)
      },
      manageCustFz(flag){
        if (this.contactView && flag === 1) {
          this.contactView = false
        } else {
          this.contactView = false
         this.manageView = !this.manageView
        }
      },
      updateCustList () {
        const existCustAndFzList = this.$commonUtils.extractTree([this.treeData], 'children', ['custId', 'name', 'custfzId', 'parentId', 'ctId']).filter(item => item.custId)
        this.hideCustAndCustFzList = this.allCustAndFzList.filter(item => {
          if (item.custfzId) {
            return !existCustAndFzList.find(i => i.custfzId === item.custfzId)
          } else {
            return !existCustAndFzList.find(i => i.custId === item.custId && !i.custfzId)
          }
        }).filter(item => item.name)
      },
      queryCustAndFenzhiInfo() {
        queryCustAndFenzhiInfo({custId: this.custId}).then(res => {
          this.allCustAndFzList = res.data
          this.updateCustList()
        })
      },
      clickFullScreens() {
        this.$refs.tree.handleFullscreen()
        this.$refs.tree.handleFullscreen()
      },
      renderContent(e, node) {
        return (<RenderContent key={node.treeId || node.vid} v-on:updateNode={this.updateNode} v-on:updateCustList={this.updateCustList} v-on:changeTree={this.changeTree} hideCustAndCustFzList={this.hideCustAndCustFzList} editStatus={this.editStatus} custId={this.custId} data={node} v-on:nodeCreate={this.nodeCreate} v-on:nodeAdd={this.nodeAdd} v-on:delContactNode={this.delContactNode} v-on:nodeDel={this.nodeDel} />)
      },
      updateFz(){
        this.queryCustAndFenzhiInfo()
      },
      updateNode(node) {
        // const parent = this.findParent(this.treeData, node.parentId || node.pid)
        updateCustomerJiagouById({
          ctId: node.ctId,
          parentId: node.parentId,
          custId: node.custId,
          custfzId: node.custfzId
        }).then(res => {
          if (res.data.custId && !node.custfzId) {
            queryCustTree({custId: res.data.custId, childTree: 1}).then(res => {
              this.$set(node, 'children', res.data.children)
              this.updateCustList()
            })
          } else {
            this.updateCustList()
          }
          this.$message.success('修改成功!')
        })
      },
      changeTree(treeData) {
        this.peopleView = true
        this.peopleData = treeData
        this.treeData = JSON.parse(JSON.stringify(treeData))
        this.props = {
          id: 'custContactId',
          pid: 'parentId',
          label: 'name'
        }
      },
      nodeCreate(node) {
        let pid,custId,parent
        if (node.root && node.pid === 0) {
          pid = node.custId
          custId = this.custId
          parent = 0
        } else {
          parent = undefined
          pid = node.pid
          custId = node.custId
        }
        if (pid === custId) {
          this.$message.error('父客户和子客户不能为同一客户！')
          return;
        }
        addCustomerJiagou({
          parent,
          parentId: pid,
          custId: custId,
          custfzId: node.custfzId
        }).then(res => {
          node.isCreate = undefined
          this.$message.success('添加成功!')
          this.$set(node, 'ctId', res.data.ctId)
          this.$set(node, 'custId', res.data.custId)
          this.$set(node, 'custfzId', res.data.custfzId)
          this.$set(node, 'parentId', res.data.parentId)
          if (res.data.custId && !node.custfzId) {
            queryCustTree({custId: pid, childTree: 1}).then(res => {
              this.$set(node, 'children', res.data.children)
              this.updateCustList()
            })
          } else {
            this.updateCustList()
          }
        })
      },
      queryCustTree() {
        queryCustTree({custId: this.custId}).then(res => {
          const data = res.data
          if (data && data.custId) {
            this.handleTreeId(data)
            this.treeData = JSON.parse(JSON.stringify(data))
            this.custData = JSON.parse(JSON.stringify(data))
          } else {
            this.treeData = {id: '', vid: new Date().getTime() + '', pid: 0, isCreate: true}
            this.custData = {id: '', vid: new Date().getTime() + '', pid: 0, isCreate: true}
          }
          this.queryCustAndFenzhiInfo()
        })
      },
      // screenData(data) {
      //   !data.custfzId && this.treeCustList.push({treeId: data.custId, name: data.name})
      //   data.custfzId && this.treeCustFzList.push({treeId: [data.custId, data.custfzId] + '', name: data.name})
      //   if (data.children) {
      //     data.children.forEach(item => {
      //       this.screenData(item)
      //     })
      //   }
      // },
      handleTreeId(obj){
        obj.treeId = [obj.custId, obj.custfzId].filter(Boolean) + ''
        if (obj.children && obj.children.length) {
          obj.children.forEach(item => {
            this.handleTreeId(item)
          })
        }
      },
      filter() {
        this.$refs.tree.filter(this.keyword)
      },
      filterNodeMethod(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      onExpand(e, data) {
        // console.log(e, data)
      },
      beforeDragEnd(node, targetNode) {
        return new Promise((resolve, reject) => {
          if (!targetNode) reject();
          if (node.id === targetNode.id) {
            reject()
          } else {
            resolve()
          }
        })
      },
      onNodeClick(e, data) {

      },
      onNodeDblclick(e, data) {
        this.$set(data, 'editFlag', true)
      },
      onNodeCopy() {
      },
      nodeEdit(node) {

      },
      findParent(data, pid) {
        let parent
        const find = (data, pid) => {
          if (data.custId === pid) {
            parent = data
          } else if (data.children) {
            data.children.forEach(item => {
              if (!item.custfzId) {
                find(item, pid)
              }
            })
          }
        }
        find(data, pid)
        return parent
      },
      findParentContact(data, pid) {
        let parent
        const find = (data, pid) => {
          if (data.custContactId === pid) {
            parent = data
          } else if (data.children) {
            data.children.forEach(item => {
              find(item, pid)
            })
          }
        }
        find(data, pid)
        return parent
      },
      delContactNode(node) {
        this.$confirm('此操作将停用该联系人, 是否继续?', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          stopCustomerContact({custContactId: node.custContactId}).then(res => {
            const parent = this.findParentContact(this.treeData, node.parentId || node.pid)
            if (parent) {
             parent.children.splice(parent.children.findIndex(item => item.custContactId === node.custContactId), 1)
              this.$message.success('停用成功!')
            }
          })
        })
      },
      nodeDel(node) {
        if (!node.isCreate) {
          let notice = ''
          if (node.custfzId) {
            notice = '此操作将删除该分支机构, 是否继续?'
          } else {
            notice = '此操作将删除该客户以及子客户/分支机构, 是否继续?'
          }
          console.log('+++++++++++++++++')
          console.log(this.findParent(this.treeData, node.parentId || node.pid))
          console.log(node)
          console.log('+++++++++++++++++')
          // return
          this.$confirm(notice, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            const parent = this.findParent(this.treeData, node.parentId || node.pid)
            delCustomerJiagou({ctId: node.ctId}).then(res => {
              parent && parent.children && parent.children.splice(parent.children.findIndex(item => item.treeId === node.treeId), 1)
              if (node.root) {

              }
              this.$message.success('删除成功!')
              this.updateCustList()
            })
          })
        } else {
          const parent = this.findParent(this.treeData, node.parentId || node.pid)
          if (parent) {
           parent.children.splice(parent.children.findIndex(item => item.vid === node.vid), 1)
            this.updateCustList()
          }
        }
      },
      nodeAdd(node) {
        node.expand = true
        !node.children && this.$set(node, 'children', [])
        node.children.push({id: '', vid: new Date().getTime() + '', pid: node.custId, isCreate: true}) // vid: virtual id 便于后续节点操作

      },
      toggleExpand(data, val) {
        if (Array.isArray(data)) {
          data.forEach(item => {
            this.$set(item, "expand", val);
            if (item.children) {
              this.toggleExpand(item.children, val);
            }
          });
        } else {
          this.$set(data, "expand", val);
          if (data.children) {
            this.toggleExpand(data.children, val);
          }
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  > > > .zoom-container {
    display: flex !important;
    background-color: #F4FBFE;
    padding: 15px;
    /*justify-content: center !important;*/
    overflow: auto !important;

    .tree-org-node__content {
      /*margin-right: 15px;*/
    }
  }

  .branch-info {
    background-color: #fff;
    padding: 10px 0px;
    .manageBtn {
      position: absolute;
      right: 15px;
      z-index: 1;
    }

    .base-header {
      display: flex;
      align-items: center;

      .el-icon-full-screen {
        color: #409EFF;
        margin-left: 10px;
        font-weight: bold;
        font-size: 18px;
        cursor: pointer;
      }

      .left-line {
        display: inline-block;
        width: 10px;
        height: 26px;
        background-color: #409EFF;
        margin-right: 10px;
        margin-left: 10px;
      }

      .right-text {
        font-weight: bold;
      }
    }
  }

  > > > .zm-tree-handle {
    top: 15px;
    right: 15px;
  }
  >>>.tree-org-node {
    margin-left: 100px;
  }
  >>>.tree-org-node__content {
    &:after{
      border-right: 1px solid #409EEF!important;
    }
  }
  >>>.tree-org-node__children{
    &:before {
      border-right: 1px solid #409EEF!important;
    }
  }
  >>>.tree-org-node:not(:first-child):before, .tree-org-node:not(:last-child):after {
    border-top: 1px solid #409EEF!important;
  }
  >>>.tree-org-node:after {
    left: 50%;
    border-left: 1px solid #409EEF!important;
  }
  >>>.tree-org-node:not(:first-child):before, >>>.tree-org-node:not(:last-child):after {
    border-top: 1px solid #409EEF!important;
  }
  >>>.tree-org>.tree-org-node:after {
    border-left: 0!important;
  }
</style>
