<template>
  <div  :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText" :unique-opened="false"
        :active-text-color="variables.menuActiveText" :collapse-transition="true" mode="vertical" :default-openeds="defaultOpeneds">
        <div v-if="$route.path.includes('finance_')">
          <template v-for="route in permission_routes.find(item=>item.name=='workbench').children">
            <sidebar-item :item="route"  :base-path="route.path" v-if="route.finance" />
          </template>
        </div>
        <div v-else-if="$route.meta.newCustomer">
          <template v-for="route in permission_routes.find(item=>item.name=='workbench').children">
            <sidebar-item :item="route"  :base-path="route.path" v-if="route.customer" />
          </template>
        </div>
        <div v-else>
          <sidebar-item v-for="route in permission_routes.find(item=>item.name=='workbench').children" :key="route.path" :item="route"  :base-path="route.path" v-if="route.topHidden && !route.finance && !route.customer" />
        </div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import Hamburger from "@/components/Hamburger";
import {getAllPanelsUrl} from "../../../api/customerList";
export default {
  components: { SidebarItem, Logo, Hamburger },
  created() {
    // console.log(this.permission_routes[6], "123123");
  },
  computed: {
    ...mapGetters(["permission_routes", "sidebar", "defaultOpeneds"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
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
      }
      this.$store.dispatch("app/toggleSideBar");
    },
    toggleHover(n) {
      if (!this.sidebar.opened) {
        if (n) {
          this.$store.dispatch("app/hoverSideBar");
        } else {
          this.$store.dispatch("app/unhoverSideBar");
        }
      }
    }
  }
};
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


.el-scrollbar
  /deep/
  .el-scrollbar__view
  > .el-menu
  > .menu-wrapper
  > .el-submenu
  > .el-submenu__title {
  // display: none;
}
.el-scrollbar /deep/ {
  .menu-wrapper > a > li {
    // display: flex;
    // align-items: center;
  }
  .submenu-title-noDropdown {
    padding: 0 !important;
  }
}
</style>
