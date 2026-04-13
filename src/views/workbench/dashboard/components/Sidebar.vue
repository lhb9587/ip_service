<template>
  <!--  overflow-y: auto-->
  <div>
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <el-menu
      :default-active="sidebarActiveIndex"
      class="el-menu-vertical-demo"
      @select="handleSelect"
      @open="handleOpen"
      :collapse="isCollapse"
      unique-opened
      ref="elMenu">
      <el-menu-item index="概览">
        <svg-icon class="reply" icon-class="概览"/>
        <span slot="title">概览</span>
      </el-menu-item>
      <template v-for="(item,index) in listData[pageType]">
        <el-submenu v-if="item.permissions ? $store.getters.permissions.includes(item.permissions) : true" :index="item.name" :class="sidebarActiveIndex === item.name ? 'is-active' : ''">
          <template slot="title">
            <svg-icon class="reply" @click="handleClick(item.name)" :icon-class="item.icon"/>
<!--            <i :class="item.icon" @click="handleClick(item.name)"></i>-->
            <span slot="title">{{item.name}}</span>
          </template>

          <el-menu-item-group>
            <div class="select-class">
              <el-checkbox label="全选 / 取消全选" v-model="item.isSelectAll" @change="handleSelectAll(index)"></el-checkbox>
            </div>
            <el-checkbox-group v-model="checkList">
              <template v-for="obj in item.list">
                <el-menu-item style="padding-left: 20px">
<!--                  <el-checkbox :title="obj.panelName" :key="index" :label="obj.panelId+'&'+obj.panelType+'&'+obj.sequence" @change="checked=>handleChange(checked, obj.panelId)">{{ obj.panelName }}</el-checkbox>-->
                  <el-checkbox :title="obj.panelName" :key="obj.panelId" :label="obj" @change="checked=>handleChange(checked, obj.panelId)">{{ obj.panelName }}</el-checkbox>
                </el-menu-item>
              </template>
            </el-checkbox-group>
          </el-menu-item-group>
        </el-submenu>
      </template>
    </el-menu>

  </div>
</template>
  
<script>
import { mapGetters } from "vuex";
import Hamburger from "@/components/Hamburger";
import { getAllPanels, hideShowUserPanel } from '@/api/dashboard.js'
export default {
  name: 'Sidebar',
  props: ['pageType', 'activeIndex'],
  components: { Hamburger },
  data() {
    return {
      sidebarActiveIndex: this.activeIndex,
      listData: {
        '业绩数据': [
          { icon: '文件-账单', name: '账单收入', list: [], permissions: 399, isSelectAll: false },
          { icon: '收支余', name: '收支余', list: [], permissions: 400, isSelectAll: false },
          { icon: '档案', name: '案量', list: [], permissions: 401, isSelectAll: false },
          { icon: '工时', name: '工时', list: [], permissions: 399, isSelectAll: false },
          { icon: '通知', name: '官方通知', list: [], permissions: 402, isSelectAll: false },
          { icon: '递交申请', name: '递交官方', list: [], permissions: 403, isSelectAll: false },
          { icon: '时限完成情况', name: '时限完成情况', list: [], permissions: 500, isSelectAll: false }
        ],
        '客户数据': [
          { icon: '客户', name: '客户数量', list: [], isSelectAll: false },
          { icon: '业绩', name: '客户业绩', list: [], isSelectAll: false }
        ],
        '合伙人表现': [
          { icon: '业绩', name: '业绩', list: [], isSelectAll: false }
        ],
        '访问日志': [
          { icon: '档案', name: '数据统计', list: [], isSelectAll: false }
        ],
        '全员信息': [
          { icon: '客户', name: '员工情况', list: [], isSelectAll: false },
          { icon: '档案', name: '离职情况', list: [], isSelectAll: false },
        ]
      },
      checkList: [], // 选中图表数据
      allList: [] // 所有图表数据
    };
  },
  created() {
    console.log(this.$store.getters.userId)
    this.getAllPanels(this.sidebarActiveIndex)
  },
  computed: {
    ...mapGetters(["sidebar"]),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    toggleSideBar() {
      if (!this.sidebar.opened) {
        this.$store.dispatch("app/hoverSideBar");
      }else {
        this.$store.dispatch("app/unhoverSideBar");
        this.$emit('sidebarEvent', this.sidebar.opened)
      }
      this.$store.dispatch("app/toggleSideBar");
    },
    // 获取左侧图表类列
    handleSelect(key, keyPath) {
      console.log(0,key, keyPath);
      key && this.activeIndexTrigger(key)
    },
    handleOpen(key, keyPath) {
      console.log(1,key, keyPath);
      key && this.activeIndexTrigger(key)
    },
    handleClick(key) {
      // console.log(1,key);
      key && this.activeIndexTrigger(key)
    },
    // 全选/取消全选
    handleSelectAll(index) {
      // 思路：获取allList所有图表数据。把visible所有都设置选中状态。并循环或批量修改图表状态，然后把图表追加到checkList 然后触发父级进行更新
      this.checkList = []
      var panelIds = []
      var visible = this.listData[this.pageType][index].isSelectAll ? 1 : 0
      if (visible) {
        this.allList.forEach(item => {
          this.checkList.push(item)
          if (!item.visible) {
            item.visible = visible
            panelIds.push(item.panelId)
          }
        })
      } else {
        this.allList.forEach(item => {
          item.visible = visible
          panelIds.push(item.panelId)
        })
      }
      this.$emit('chartCheckList', this.allList)
      hideShowUserPanel({ panelIds: panelIds, visible: visible }).then(res => {})
    },
    activeIndexTrigger(key) {
      if (this.sidebarActiveIndex != key) {
        this.$emit('chartCheckList', [])
        this.$refs.elMenu.close(this.sidebarActiveIndex);
        this.getAllPanels(key)
      }
      this.sidebarActiveIndex = key
      this.$emit('activeIndex', this.sidebarActiveIndex)
    },
    // 获取用户当前页签下菜单图表列表
    getAllPanels(belongToMenu) {
      this.checkList = []
      this.allList = []
      getAllPanels({ belongToTab: this.pageType, belongToMenu: belongToMenu }).then(res => {
        const allPanels = res.data
        allPanels.sort((a, b) => {
          return a.sequence - b.sequence;
        });
        allPanels.forEach(data => {
          this.$set(data, 'charts', [data])
          if (data.visible === 1) {
            this.checkList.push(data)
          }
          this.allList.push(data)
        });
        this.$emit('chartCheckList', this.allList)
        this.listData[this.pageType].forEach(row => {
          if (row.name === belongToMenu) {
            row.list = allPanels
          }
        });
      })
    },
    // 改变一个选项状态时
    handleChange(value,panelId) {
      const visible = value ? 1 : 0
      hideShowUserPanel({ panelIds: [panelId], visible: visible }).then(res => {
        this.checkList.sort((a, b) => {
          return a.sequence - b.sequence;
        });
        this.$emit('saveCheckList', panelId, visible)
      })
    }
  },
  // 侦听器 获取选中下拉图表列表
  watch: {
    pageType() {
      this.$emit('chartCheckList', [])
      this.$refs.elMenu.close(this.sidebarActiveIndex)
      this.getAllPanels('概览')
      this.sidebarActiveIndex = '概览'
      this.$emit('activeIndex', this.sidebarActiveIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
.hamburger-container {
  background-color: white;
  width: 100%;
  line-height: 40px;
  height: 40px;
  /* float: left; */
  text-align: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}

#app .sidebar-container .el-menu .el-submenu.is-active /deep/ .el-submenu__title {;
  color: #409EFF !important;
  background-color: #EEF2FB;
  i {
    color: #409EFF;
  }
}

.el-submenu .el-menu-item {
  height: 30px;
  line-height: 30px;
  padding: 0 20px;
  color: #808080;
  .el-checkbox /deep/ .el-checkbox__label {
    color: #808080;
    font-size: 12px;
    //width: auto;
    //overflow: hidden;
    //white-space: nowrap;
    //text-overflow: ellipsis;
  }
  ///deep/ .el-checkbox__input.is-checked+.el-checkbox__label{
  //  color: #808080;
  //}
}
.svg-icon{
  width: 1.2em;
  height: 1.2em;
  vertical-align: middle;
}
.select-class .el-checkbox{
  color: #afafaf;
  margin-left: 10px;
  /deep/ .el-checkbox__label{
    font-size: 12px !important;
  }
}
</style>
