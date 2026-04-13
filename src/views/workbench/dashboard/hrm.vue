<template>
  <div>
    <div v-if="activeName" style="display: flex;">
      <Sidebar
        class="sidebar-container left_wrap"
        :style="{width: leftWrapWidth }"
        :page-type="activeName"
        :active-index="activeIndex"
        @activeIndex="childActive"
        @sidebarEvent="sidebarEvent"
        @chartCheckList="chartCheckList"
        @saveCheckList="saveCheckList"/>
      <div class="right_wrap">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item,index) in tabList"
            :key="index"
            :label="item.name"
            :name="item.name"
          >
          </el-tab-pane>
        </el-tabs>
        <div>
          <keep-alive>
            <!--          数据列存在渲染-->
            <component v-if="checkList.length > 0 || activeType == 'staff'" :is="activeType" :active-index="activeIndex" :check-list="checkList"></component>
          </keep-alive>
        </div>
      </div>
    </div>
    <div v-else>
      <svg-icon class="left-insert" icon-class="系统开发"/>
    </div>
  </div>
</template>
<script>
import Sidebar from './components/Sidebar'
import kpi from './components/dataPanel/kpl'
import customer from './components/dataPanel/customer'
import partner from './components/dataPanel/partner'
import hrm from './components/dataPanel/hrm'
import staff from './components/dataPanel/staff'
export default {
  components: { Sidebar, kpi, customer, partner, hrm, staff },
  data() {
    return {
      activeName: '',
      activeType: '',
      activeIndex: '概览',
      checkList: [],
      defaultTabList: [
        {name:'全员信息',type:'hrm'},
        {name:'员工信息',type:'staff'}
      ],
      tabList: [],
      leftWrapWidth: ''
      // leftWrapWidth: localStorage.getItem('leftWrapWidth')?localStorage.getItem('leftWrapWidth'):'180px !important'
    }
  },
  created() {
    // 初始化权限判断
    this.initPermissions()
  },
  methods: {
    initPermissions() {
      this.defaultTabList.forEach(item => {
        if (item.permissions == undefined || this.$store.getters.permissions.includes(item.permissions)){
          this.tabList.push(item)
        }
      })
      if (this.tabList[0]) {
        this.activeName = this.tabList[0].name
        this.activeType = this.tabList[0].type
      }
    },
    childActive(data) {
      this.activeIndex = data
    },
    saveCheckList(panelId, visible) {
      this.$set(this.checkList.find(item => item.panelId == panelId),'visible',visible)
    },
    chartCheckList(data) {
      this.checkList = data
    },
    sidebarEvent(state) {
      if (state) {
        this.leftWrapWidth = ''
      }
    },
    // 顶部tab切换
    handleClick() {
      console.log('index-list',this.checkList)
    }
  },
  mounted() {
    if (this.activeName) {
      let that = this
      new this.$DraginResize(document.querySelector(".left_wrap"), {
        clone: true,
        end(info) {
          if (info.dir == 'ver') {
            this.elem.style.height = info.height + 'px';
          } else if (info.dir == 'hor') {
            var leftWrapWidth = info.width
            if (info.width < '180') {
              leftWrapWidth = '180'
            } else if (info.width > '550') {
              leftWrapWidth = '550'
            }
            console.log(leftWrapWidth)
            this.elem.style.width = leftWrapWidth + 'px !important';
            // localStorage.setItem('leftWrapWidth', leftWrapWidth + 'px !important') //自定义宽度缓存本地
            that.leftWrapWidth = leftWrapWidth + 'px !important'
          }
        }
      })
    }
  },
  watch:{
    activeName() {
      // 顶部tab名称转类型
      this.activeType = this.tabList.find(item => item.name == this.activeName).type
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar-container{
  margin-right: 10px;
  padding-top: 0 !important;
  //position: relative !important;
  position: sticky !important;
}
.left_wrap{
  position: relative;
}
.right_wrap{
  flex: 1;
}
.left-insert{
  width: 100%;
  height: 50vh;
}
</style>
