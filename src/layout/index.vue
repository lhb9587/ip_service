<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="!isH5">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
      <sidebar class="sidebar-container sidebar-container1" v-if="!$route.path.includes('new_dashboard')"
               :style="{width: dragWidth + 'px'}"/>
      <div :class="{'fixed-header':fixedHeader}">
        <navbar/>
      </div>
      <div @mouseenter="toggleHover(true)" class="main-container main-container1" id="main-container"
           :style="{marginLeft: $route.path.includes('new_dashboard') ? '0' : (dragWidth + 'px')}">
        <breadcrumb
          v-if="!$route.meta.newCustomer && !$route.path.includes('finance_') && !$route.path.includes('new_dashboard') && !$route.path.includes('hrm') && !$route.path.includes('partner_weekly_report') && !$route.path.includes('lawyer_performance')
           && !$route.path.includes('contract_management')
           && !$route.path.includes('contract_detail')
           && !$route.path.includes('travel_management')"
          class="breadcrumb-container"/>
        <!--        财务顶部菜单-->
        <!--        <top-panel v-if="$route.path.includes('finance_')&&toolPosTop=='top'"/>-->
        <!--        <top-menu v-if="$route.path.includes('finance_')" />-->
        <app-main/>
        <!--        <right-panel v-if="showSettings&&(toolPosTop=='right' || !$route.path.includes('finance_'))"></right-panel>-->
        <right-panel v-if="showSettings&&!$route.path.includes('finance_')"></right-panel>
      </div>
    </div>
    <div v-else>
      <audit-fee-h5 v-if="this.$route.path.includes('addFeeDetail')"></audit-fee-h5>
      <detail-h5 v-if="this.$route.path.includes('itinerary_detail')"></detail-h5>
      <trip-detail-h5 v-if="this.$route.path.includes('business_trip')"></trip-detail-h5>
      <list-h5 v-if="this.$route.path.includes('itinerary_list')"></list-h5>
      <pre-filing-push-h5 v-if="this.$route.path.includes('preFilingPush')"></pre-filing-push-h5>
      <examine-h5 v-if="this.$route.path.includes('exmaine_apply')"></examine-h5>
    </div>

  </div>
</template>

<script>
  import {Navbar, Sidebar, AppMain} from "./components";
  import Breadcrumb from "@/components/Breadcrumb";
  import RightPanel from "@/components/RightPanel";
  import {mapState} from "vuex";
  import AuditFeeH5 from '../views/workbench/finance/cost/AuditFeeH5'
  import TripDetailH5 from "../views/workbench/itinerary/TripDetailH5";
  import DetailH5 from "../views/workbench/itinerary/DetailH5";
  import ListH5 from "../views/workbench/itinerary/ListH5";
  import PreFilingPushH5 from "../views/workbench/case/preFiling/components/PreFilingPushH5";
  import ExamineH5 from "../views/workbench/hrm/approval_management/ExamineH5";
  //import ResizeMixin from "./mixin/ResizeHandler";

  export default {
    name: "Layout",
    components: {
      PreFilingPushH5,
      ListH5,
      TripDetailH5,
      DetailH5,
      AuditFeeH5,
      Navbar,
      Sidebar,
      AppMain,
      Breadcrumb,
      RightPanel,
      ExamineH5
    },
    data() {
      return {
        isH5: false,
        dragWidth: 180
      }
    },
    created() {
      this.browserRedirect()
      if (!localStorage.getItem('toolPosTop')) {
        localStorage.setItem('toolPosTop', 'top')
      } else {
        this.$store.dispatch('settings/changeToolsPos', localStorage.getItem('toolPosTop'))
      }
    },
    // mixins: [ResizeMixin],
    mounted() {
      // this.timer = setInterval(() => {
      //   if (this.$store.getters.token) {
      //     this.$store.dispatch("user/getTodoTaskNotice");
      //   } else {
      //     clearInterval(this.timer);
      //   }
      // }, 60000);
      this.$store.commit("settings/CHANGE_SETTING", {
        key: "fixedHeader",
        value: true
      });
    const that = this
      if (document.querySelector(".sidebar-container1")) {
        new this.$DraginResize(document.querySelector(".sidebar-container1"), {
          clone: true,
          end(info) {
            if (info.dir == 'ver') {
              this.elem.style.height = info.height + 'px';
            } else if (info.dir == 'hor') {
              this.elem.style.width = info.width + 'px';
              if (document.querySelector(".main-container1")) {
               document.querySelector(".main-container1").style.marginLeft = that.$route.path.includes('new_dashboard') ? 0 : info.width + 'px'
              }
              this.dragWidth = that.$route.path.includes('new_dashboard') ? 0 : info.width
            }
          }
        })
      }
    },
    watch: {
      '$route.path': {
        handler(n) {
          this.$nextTick(() => {
            const obj = document.querySelector(".sidebar-container1")
            let width
            if (obj) {
              width = obj.style.width
              if (width == '0px') {
                width = this.opened ? '180px' : '54px'
              }
              if (document.querySelector(".main-container1")) {
                document.querySelector(".main-container1").style.marginLeft = this.$route.path.includes('new_dashboard') ? 0 : width
              }
              this.dragWidth = this.$route.path.includes('new_dashboard') ? 0 : width.replace('px', '')
            }
          })
        }
      },
      opened: {
        handler(n) {
          this.$nextTick(() => {
            if (!document.querySelector(".main-container1")) return
            if (n) {
              this.dragWidth = this.$route.path.includes('new_dashboard') ? 0 : 180
              document.querySelector(".main-container1").style.marginLeft = this.$route.path.includes('new_dashboard') ? 0 : 180 + 'px'
            } else {
              this.dragWidth = this.$route.path.includes('new_dashboard') ? 0 : 54
              document.querySelector(".main-container1").style.marginLeft = this.$route.path.includes('new_dashboard') ? 0 : 54 + 'px'
            }
          })
        },
        immediate: true
      }
    },
    computed: {
      opened() {
        return this.$store.state.app.sidebar.opened
      },
      sidebar() {
        return this.$store.state.app.sidebar;
      },
      device() {
        return this.$store.state.app.device;
      },
      fixedHeader() {
        return this.$store.state.settings.fixedHeader;
      },
      ...mapState({
        showSettings: state => state.settings.showSettings,
        toolPosTop: state => state.settings.toolPosTop
      }),
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened && !this.sidebar.hovered,
          openSidebar: this.sidebar.opened,
          hoverSidebar: this.sidebar.hovered && !this.sidebar.opened,
          unhoverSidebar: !this.sidebar.hovered,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === "mobile"
        };
      }
    },
    methods: {
      browserRedirect() {
        const sUserAgent = window.navigator.userAgent.toLowerCase();
        const bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        const bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        const bIsMidp = sUserAgent.match(/midp/i) == "midp";
        const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        const bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        const bIsAndroid = sUserAgent.match(/android/i) == "android";
        const bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        const bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
          if (this.$route.path.includes('addFeeDetail') && this.$route.params && this.$route.params.pageType && this.$route.params.pageType == 3) {
            this.isH5 = true
          } else {
            this.isH5 = false
          }
          if (this.$route.path.includes('preFilingPush') && this.$route.params.type === '2') {
            this.isH5 = true
          }
          if (this.$route.path.includes('exmaine_apply')) {
            this.isH5 = true
          }
        } else {
          this.isH5 = false
        }
        if (this.$route.path.includes('itinerary_detail') || this.$route.path.includes('itinerary_list') || this.$route.path.includes('business_trip')) {
          this.isH5 = true
        }
      },
      toggleHover(n) {
        if (!this.sidebar.opened) {
          if (n) {
            this.$store.dispatch("app/unhoverSideBar");
          } else {
          }
        }
      },
      handleClickOutside() {
        this.$store.dispatch("app/closeSideBar", {withoutAnimation: false});
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 101;
    width: 100%;
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    // width: calc(100% - 54px);
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .main-container1 {
    /*background: RGBA(239, 248, 255, 1);*/
    overflow: auto;
    margin-right: 0px;
  }
</style>
