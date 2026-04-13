<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template
      v-if="hasOneShowingChild(item.children,item) && (!(onlyOneChild.children&&(onlyOneChild.children.filter(itm=>itm.hidden).length!=onlyOneChild.children.length))&&onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <div v-if="item.meta.path === 'common_solutions'" style="color: #303133;">
        <div style="margin-left: 10px">
          <el-tree
            :default-checked-keys="chartCheckList"
            node-key="configId"
            default-expand-all
            highlight-current
            ref="tree"
            :data="treeData"
            :props="{label: 'panelName', children: 'children', checkStrictly: true,multiple: true}"
            show-checkbox
            @check="handleCheck"
            @node-click="handleClick"
          >
          </el-tree>
          <!--          <el-checkbox v-model="checked" @change="changeAll">全选/取消全选</el-checkbox>-->
          <!--          <el-checkbox-group v-model="chartCheckList"-->
          <!--                             style="max-height: 350px;overflow-y: auto;display: flex;flex-direction: column"-->
          <!--                             @change="changeCheckGroups">-->
          <!--            <el-checkbox @change="(v) => changeCheck(v, chart)" v-for="(chart, index) in chartList"-->
          <!--                         :key="chart.configId"-->
          <!--                         :label="chart.configId" :title="chart.panelName">{{chart.panelName}}-->
          <!--            </el-checkbox>-->
          <!--          </el-checkbox-group>-->
          <div style="margin-top: 5px">
            <el-button size="mini" @click="configChart">
              <span class="el-icon-plus" style="font-size: 14px;"></span>
              自定义图表
            </el-button>
          </div>
        </div>
      </div>
      <app-link v-else-if="onlyOneChild.meta" :to="`/workbench${resolvePath(onlyOneChild.path)}`">
        <el-menu-item :index="`/workbench${resolvePath(onlyOneChild.path)}`"
                      :class="{'submenu-title-noDropdown':!isNest}"
                      :style="{border: !this.sidebar.opened && item.meta.path&&item.meta.path===$route.name ? '1px solid #52A0F5' : ''}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="item.meta.title"
                :isCurrent="item.meta.path&&item.meta.path===$route.name"/>

          <div class="toDoTaskNotice"
               v-if="item.meta &&item.meta.permissions&& item.meta.permissions.includes(8)&&(sidebar.opened||sidebar.hovered)"
               v-show="$store.state.user.todoTaskNotice.matterSum">
<!--            待办-->
            {{$store.state.user.todoTaskNotice.matterSum>10000? '10000+': $store.state.user.todoTaskNotice.matterSum}}
          </div>
          <div class="toDoTaskNotice"
               v-if="item.meta &&item.meta.permissions&& item.meta.permissions.includes(9)&&(sidebar.opened||sidebar.hovered)"
               v-show="$store.state.user.todoTaskNotice.timelimitSum">
            {{$store.state.user.todoTaskNotice.timelimitSum>10000? '10000+':
            $store.state.user.todoTaskNotice.timelimitSum}}
          </div>
          <i class="toDoTaskNoticed"
             v-if="item.meta &&item.meta.permissions&& (item.meta.permissions.includes(421)&&$store.state.user.remindNotice.allMonitorResultSum || item.meta.permissions.includes(259)&&$store.state.user.todoTaskNotice.businessSum||item.meta.permissions.includes(8)&&$store.state.user.todoTaskNotice.matterSum||item.meta.permissions.includes(9)&&$store.state.user.todoTaskNotice.timelimitSum)&&!(sidebar.opened||sidebar.hovered)"></i>
          <div class="toDoTaskNotice"
               v-if="item.meta &&item.meta.permissions&& item.meta.permissions.includes(259)&&(sidebar.opened||sidebar.hovered)"
               v-show="$store.state.user.todoTaskNotice.businessSum">
            {{$store.state.user.todoTaskNotice.businessSum>10000? '10000+':
            $store.state.user.todoTaskNotice.businessSum}}
          </div>
          <div class="toDoTaskNotice"
               v-if="item.meta &&item.meta.permissions&& item.meta.permissions.includes(421)&&(sidebar.opened||sidebar.hovered)"
               v-show="$store.state.user.remindNotice.allMonitorResultSum">
            {{$store.state.user.remindNotice.allMonitorResultSum>10000? '10000+':
            $store.state.user.remindNotice.allMonitorResultSum}}
          </div>
          <div v-if="item.meta &&item.meta.permissions&& item.meta.permissions.includes(421)&&$store.state.user.todoTaskNotice.deliveryResultSum" class="el-icon-warning1">!</div>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu
      :style="{border: (item.finance || item.customer) && !this.sidebar.opened && item.children.find(item => item.path === $route.name) ? '1px solid #52A0F5' : ''}"
      :class="{financeOut: item.finance || item.customer, rightIcon: item.meta.path === 'customer_statistics'}"
      v-if="item.children&&(item.children.filter(itm=>itm.hidden).length!=item.children.length)" ref="subMenu"
      :index="`/workbench${resolvePath(item.path)}`" popper-append-to-body>
      <template slot="title" style="padding-left: 0!important;">
        <div @click="handleRoute(item)">


          <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title"
                :isCurrent="item.meta.path === 'customer_statistics' && $route.name === 'common_solutions'"/>
          <i class="toDoTaskNoticed"
             v-if="item.meta &&item.meta.permissions&& item.meta.permissions.includes(1)&&!(sidebar.opened||sidebar.hovered)"></i>
          <div class="toDoTaskNotice"
               v-if="item.meta &&item.meta.permissions&& item.meta.permissions.includes(1)&&(sidebar.opened||sidebar.hovered)"
               v-show="$store.state.user.todoTaskNotice.waitManageSum">
            {{$store.state.user.todoTaskNotice.waitManageSum>10000? '10000+':
            $store.state.user.todoTaskNotice.waitManageSum}}
          </div>
        </div>
      </template>
      <sidebar-item :class="{'finance': item.finance || item.customer}" v-for="child in item.children"
                    :key="child.path" :is-nest="true" :item="child" :base-path="resolvePath(child.path)"
                    class="nest-menu"/>
    </el-submenu>
  </div>
</template>

<script>
  import path from "path";
  import {mapGetters} from "vuex";
  import {isExternal} from "@/utils/validate";
  import Item from "./Item";
  import AppLink from "./Link";
  import FixiOSBug from "./FixiOSBug";
  import {getAllPanelsUrl, hideShowUserPanelUrl} from "../../../api/customerList";
  import {hideShowUserPanel} from "../../../api/dashboard";

  export default {
    name: "SidebarItem",
    components: {Item, AppLink},
    mixins: [FixiOSBug],
    computed: {
      ...mapGetters(["permission_routes", "sidebar", "defaultOpeneds", 'hideChartIdList', 'panelsRefresh']),
      checkIds() {
        return this.$store.getters.panelsData.chartCheckList
      }
    },
    props: {
      // route object
      item: {
        type: Object,
        required: true
      },
      isNest: {
        type: Boolean,
        default: false
      },
      basePath: {
        type: String,
        default: ""
      }
    },
    data() {
      this.onlyOneChild = null;
      return {
        treeData: [
          {
            panelName: '客户概览',
            children: []
          },
          {
            panelName: '客户数量',
            children: []
          },
          {
            panelName: '负责客户账单',
            children: []
          }
        ],
        checked: false,
        chartList: [],
        chartCheckList: []
      };
    },
    async created() {
      // if (this.panelsRefresh && this.item.meta.path === 'common_solutions') {
      //      this.queryPanels()
      //     this.$store.commit('app/SET_PANELS_REFRESH', false)
      // }
      if (this.item.meta.path === 'common_solutions' && !this.$store.getters.panelsData.chartList.length) {
        await this.queryPanels()
      }
      if (this.$store.getters.panelsData.chartList.length) {
        this.chartList = this.$store.getters.panelsData.chartList.sort((a, b) => a.configId - b.configId)
        this.makeTreeData()
        this.chartCheckList = this.$store.getters.panelsData.chartCheckList
        if (this.chartList.length === this.chartCheckList.length) {
          this.checked = true
        }
      }
    },
    watch: {
      panelsRefresh: {
        handler(n) {
          if (n && this.item.meta.path === 'common_solutions') {
            this.queryPanels()
            this.$store.commit('app/SET_PANELS_REFRESH', false)
          }
        },
        immediate: true
      },
      hideChartIdList(n) {
        this.chartCheckList = this.checkIds.filter(item => !n.includes(item))
        this.chartList = this.chartList.filter(item => !n.find(i => i == item.configId)).sort((a, b) => a.configId - b.configId)
        this.makeTreeData()
        this.$store.commit('app/SET_PANELS_DATA', {
          chartList: this.chartList,
          chartCheckList: this.chartCheckList
        })
      },
    },
    methods: {
      makeTreeData() {
        this.treeData = [
          {
            panelName: '客户概览',
            children: []
          },
          {
            panelName: '客户数量',
            children: []
          },
          {
            panelName: '负责客户账单',
            children: []
          }
        ]
        this.chartList.forEach(item => {
          if (!item.belongToMenu) {
            item.belongToMenu = '客户概览'
          }
          if (item.belongToMenu === '客户业绩') {
            item.belongToMenu = '负责客户账单'
          }
          if (item.belongToMenu === '概览') {
            item.belongToMenu = '客户数量'
          }
          this.treeData.forEach(tree => {
            if (tree.panelName === item.belongToMenu) {
              tree.children.push(item)
            }
          })
        })
      },
      handleClick() {
        if (this.$route.query.config || !this.$route.fullPath.includes('common_solutions')) {
          this.$router.push(`/workbench/customer_statistics/common_solutions`)
        }
      },
      handleCheck(a, b) {
        const list = b.checkedKeys.filter(Boolean)
        if (a.configId) {
          const visible = list.includes(a.configId)
          this.changeCheck(visible, a)
        } else {
          a.children.forEach(item => {
            const visible = list.includes(item.configId)
            this.changeCheck(visible, item)
          })
        }
        this.chartCheckList = list
        this.$store.commit('app/SET_PANELS_DATA', {
          chartList: this.chartList,
          chartCheckList: list
        })
        if (this.$route.query.config || !this.$route.fullPath.includes('common_solutions')) {
          this.$router.push(`/workbench/customer_statistics/common_solutions`)
        }
      },
      configChart() {
        if (!this.$route.query.config || !this.$route.fullPath.includes('common_solutions')) {
          this.$router.push(`/workbench/customer_statistics/common_solutions?config=1`)
        }
      },
      changeAll(value) {
        if (this.$route.query.config || !this.$route.fullPath.includes('common_solutions')) {
          this.$router.push(`/workbench/customer_statistics/common_solutions`)
        }
        hideShowUserPanelUrl({
          configIds: this.chartList.filter(item => item.type === 2).map(item => item.configId),
          visible: value ? 1 : 0
        })
        hideShowUserPanel({
          panelIds: this.chartList.filter(item => item.type === 1).map(item => item.panelId),
          visible: value ? 1 : 0
        })
        this.chartCheckList = value ? this.chartList.map(item => item.configId) : []
        this.$store.commit('app/SET_PANELS_DATA', {
          chartList: this.chartList,
          chartCheckList: this.chartCheckList
        })
      },
      changeCheckGroups(list) {
        if (this.$route.query.config || !this.$route.fullPath.includes('common_solutions')) {
          this.$router.push(`/workbench/customer_statistics/common_solutions`)
        }
        if (this.chartList.length === this.chartCheckList.length) {
          this.checked = true
        } else {
          this.checked = false
        }
        this.$store.commit('app/SET_PANELS_DATA', {
          chartList: this.chartList,
          chartCheckList: list
        })
      },
      changeCheck(v, chart) {
        if (chart.type === 1) {
          hideShowUserPanel({
            panelIds: [chart.panelId],
            visible: v ? 1 : 0
          })
        } else if (chart.type === 2) {
          hideShowUserPanelUrl({
            configIds: [chart.configId],
            visible: v ? 1 : 0
          })
        }

      },
      async queryPanels() {
        let dataList = []
        await getAllPanelsUrl().then(res => {
          this.chartList = res.data.sort((a, b) => a.configId - b.configId)
          this.makeTreeData()
          dataList = res.data
        })
        this.chartCheckList = dataList.filter(item => item.visible).map(item => item.configId)
        if (this.chartList.length === this.chartCheckList.length) {
          this.checked = true
        }
        this.$store.commit('app/SET_PANELS_DATA', {
          chartList: this.chartList,
          chartCheckList: this.chartCheckList
        })
      },
      hasOneShowingChild(children = [], parent) {
        const showingChildren = children.filter(item => {
          if (item.hidden) {
            return false;
          } else {
            // Temp set(will be used if only has one showing child)
            this.onlyOneChild = item;
            return true;
          }
        });
        // When there is only one child router, the child router is displayed by default
        if (showingChildren.length === 1) {
          return true;
        }
        // Show parent if there are no child router to display
        if (showingChildren.length === 0) {
          this.onlyOneChild = {...parent, path: "", noShowingChildren: true};
          return true;
        }
        return false;
      }
      ,
      // 点击
      handleRoute(item) {
        if (item.finance) return;
        if (item.customer && item.name == 'customer_activity_all') return;
        if (this.$route.fullPath == this.$commonUtils.getFilterModel(`/workbench/${item.path}`, 'routeHistory')) {
          return
        }
        if (this.$commonUtils.getFilterModel(`/workbench/${item.path}`, 'routeHistory')) {
          this.$router.push(this.$commonUtils.getFilterModel(`/workbench/${item.path}`, 'routeHistory'))
        } else {
          if (item.children.find(item => !item.hidden)) {
            this.$router.push(`/workbench/${item.path}/${item.children.find(item => !item.hidden).path}`)
          }
        }
      }
      ,
      resolvePath(routePath) {
        if (isExternal(routePath)) {
          return routePath;
        }
        if (isExternal(this.basePath)) {
          return this.basePath;
        }
        return path.resolve(this.basePath, routePath);
      }
    }
  }
  ;
</script>
<style lang="scss" scoped>
  .nest-menu {
    /*background-color: red !important;*/
  }

  /deep/ .el-icon-arrow-down, /deep/ .el-submenu__icon-arrow {
    display: none;
  }

  > > > .rightIcon {
    .el-icon-arrow-down {
      display: inline-block;
    }
  }

  .toDoTaskNoticed {
    box-sizing: border-box;

    position: absolute;
    right: 13px;
    top: 34%;
    transform: translateY(-50%);
    border-radius: 10px;
    height: 5px;


    background: #f00;
    color: #ffffff;
    min-width: 5px;
    text-align: center;
  }

  .toDoTaskNotice {
    box-sizing: border-box;
    padding: 6px;
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 10px;
    height: 20px;
    font-size: 12px;
    line-height: 10px;
    background: #f00;
    color: #ffffff;
    min-width: 20px;
    text-align: center;
    /*margin-left: 10px;*/
    /*float: right;*/
  }

  .icon-img {
    width: 18px;
    margin-right: 18px;
    margin-left: 18px;
  }

  .el-menu-item {
    padding-left: 20px !important;
  }

  > > > .financeOut {
    .el-submenu__title {
      padding-left: 0 !important;
    }
  }

  .finance {
    > > > .el-icon-arrow-down {
      display: inline-block;
    }
  }

  > > > .el-menu-item, .el-submenu__title {
    height: auto;
  }

  > > > .el-checkbox {
    height: 30px;
    line-height: 30px;
  }

  > > > .el-tree {
    .el-checkbox {
      margin-right: 6px;
    }
  }

  > > > .el-tree-node__children {
    .el-tree-node__content {
      padding-left: 15px !important;
    }
  }
.el-icon-warning1 {
  color: #FF0000;
  position: absolute;
  left: 0;
  font-size: 16px;
  font-weight: bold;
  top: 20px;
}
</style>
