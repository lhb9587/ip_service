<template>
  <div class="navbar">
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <div class="logo-warp">
      <img class="logo" src="@/assets/logo11111.png" alt="" />
    </div>
    <div class="menu-container" ref="menuContainer">
      <el-menu
        :default-active="activeMenu"
        class="menu"
        background-color="#52a0f5"
        text-color="#ffffff"
        active-text-color="#ffd04b"
        mode="horizontal"
        ref="mainMenu"
      >
        <sidebar-item
          style="float: left"
          v-for="(route, index) in visibleRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :ref="`menuItem${index}`"
          v-if="!route.topHidden"
        />
      </el-menu>
      <el-popover
        v-if="overflowRoutes.length > 0"
        placement="bottom"
        trigger="hover"
        popper-class="overflow-menu-popover"
        :visible-arrow="false"
      >
        <el-menu
          :default-active="activeMenu"
          class="overflow-menu"
          background-color="#52a0f5"
          text-color="#ffffff"
          active-text-color="#ffd04b"
          mode="vertical"
          :collapse="true"
        >
          <sidebar-item
            v-for="route in overflowRoutes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
            v-if="!route.topHidden"
          />
        </el-menu>
        <div slot="reference" class="overflow-icon">
          <i class="el-icon-more"></i>
        </div>
      </el-popover>
    </div>
    <div class="right-menu">
      <!-- <el-dropdown class="avatar-container" trigger="click">-->
      <!--<div class="avatar-wrapper">-->
      <!--<img :src="''+avatar" class="user-avatar">-->
      <!--<i class="el-icon-caret-bottom" />-->
      <!--</div>-->
      <!--<el-dropdown-menu slot="dropdown" class="user-dropdown">-->
      <!--<router-link to="/">-->
      <!--<el-dropdown-item>-->
      <!--首页-->
      <!--</el-dropdown-item>-->
      <!--</router-link>-->
      <!--<el-dropdown-item divided>-->
      <!--<span style="display:block;" @click="logout">退出</span>-->
      <!--</el-dropdown-item>-->
      <!--</el-dropdown-menu>-->
      <!--</el-dropdown> -->
      <MessageNotice></MessageNotice>
      <div
        class="checkout firstDiv"
        @click="SwitchingAccountsState = !SwitchingAccountsState"
        v-if="$store.getters.permissions.includes(0)"
      >
        <img src="@/assets/切换账户@2x.png" alt="" /><span>切换账户</span>
        <SwitchingAccounts
          @click.native.stop
          class="switchingAccounts"
          v-show="SwitchingAccountsState"
          @closeBlock="SwitchingAccountsState = false"
        ></SwitchingAccounts>
      </div>
      <div
        class="checkout firstDiv"
        @click="changeV2"
        v-if="$store.getters.permissions.includes(495)"
      >
        <img src="@/assets/切换账户@2x.png" alt="" /><span
          style="display: block; line-height: 16px; min-width: 24px"
          >切换新版</span
        >
      </div>
      <el-popover placement="bottom" width="150" trigger="click">
        <div style="line-height: 28px; cursor: pointer" @click="jumpUserCenter">
          个人中心:{{ name }}
        </div>
        <div
          style="line-height: 28px; cursor: pointer"
          class="modifyPassword"
          @click.prevent.stop="changePasswordState = !changePasswordState"
        >
          <span>修改密码</span>
        </div>
        <div style="line-height: 28px; cursor: pointer" @click="logout">
          退出
        </div>
        <div class="firstDiv" slot="reference">
          <Avatar
            :username="name"
            :size="40"
            :src="`ipdoc${$store.getters.avatar}`"
          ></Avatar>
        </div>
      </el-popover>

      <el-dialog
        v-dialogDrag
        center
        top="0"
        height="300"
        :visible.sync="changePasswordState"
        width="50%"
        :modal-append-to-body="false"
      >
        <ModifyPassword
          @click.native.stop
          class="card"
          v-if="changePasswordState"
          @closeCard="changePasswordState = false"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ModifyPassword from "@/components/ModifyPassword";
import SwitchingAccounts from "@/components/SwitchingAccounts";
import SidebarItem from "./Sidebar/SidebarItem";
import MessageNotice from "@/components/MessageNotice";
import Avatar from "./VueAvatar.vue";

export default {
  components: {
    ModifyPassword,
    SwitchingAccounts,
    SidebarItem,
    MessageNotice,
    Avatar,
  },
  computed: {
    ...mapGetters(["permission_routes", "sidebar", "defaultOpeneds", "name"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    allRoutes() {
      const workbench = this.permission_routes.find(
        (item) => item.name == "workbench"
      );
      // 核心修复：只计算真正会显示在导航栏上的有效一级菜单
      // 必须满足：非隐藏、非置顶隐藏、有 meta 且有 title
      return workbench
        ? workbench.children.filter(
            (r) => !r.hidden && !r.topHidden && r.meta && r.meta.title
          )
        : [];
    },
    visibleRoutes() {
      if (!this.menuOverflow) {
        return this.allRoutes;
      }
      return this.allRoutes.slice(0, this.visibleCount);
    },
    overflowRoutes() {
      if (!this.menuOverflow) {
        return [];
      }
      return this.allRoutes.slice(this.visibleCount);
    },
  },
  data() {
    return {
      changePasswordState: false,
      SwitchingAccountsState: false,
      menuOverflow: false,
      visibleCount: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.calculateMenuOverflow();
      // 监听窗口大小变化
      window.addEventListener("resize", this.handleResize);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  watch: {
    // 监听路由变化，确保在动态加载路由后重新计算
    allRoutes: {
      handler() {
        this.$nextTick(() => {
          this.calculateMenuOverflow();
        });
      },
      immediate: true,
    },
  },
  methods: {
    handleResize() {
      this.$nextTick(() => {
        this.calculateMenuOverflow();
      });
    },
    calculateMenuOverflow() {
      if (!this.$el) return;

      // 1. 获取导航栏总宽
      const navbarWidth = this.$el.clientWidth;
      if (navbarWidth <= 0) return;

      // 2. 严格按要求计算可用空间
      const logoWidth = 180;
      const rightReserved = 320;
      const maxAvailableWidth = navbarWidth - logoWidth - rightReserved;

      // “更多”图标宽度预估
      const overflowIconWidth = 40;

      const getWidth = (route) => {
        const title = (route.meta && route.meta.title) || "";
        const len = title.length;
        // 58 + 字数 * 14 (2字86, 3字100, 4字114)
        return 58 + len * 14;
      };

      const routes = this.allRoutes;
      let totalRequirement = 0;
      routes.forEach((r) => {
        totalRequirement += getWidth(r);
      });

      // 3. 溢出逻辑
      if (totalRequirement > maxAvailableWidth) {
        this.menuOverflow = true;
        // 扣除图标后，实际留给菜单的可用预算
        const budget = maxAvailableWidth - overflowIconWidth;
        let accumulated = 0;
        let count = 0;

        for (let i = 0; i < routes.length; i++) {
          const itemWidth = getWidth(routes[i]);
          if (accumulated + itemWidth <= budget) {
            accumulated += itemWidth;
            count++;
          } else {
            break;
          }
        }
        this.visibleCount = Math.max(1, count);

        // 特殊情况：如果扣除图标后算出来的可见数其实已经包含了全部，就不需要溢出了
        if (this.visibleCount >= routes.length) {
          this.menuOverflow = false;
        }
      } else {
        this.menuOverflow = false;
        this.visibleCount = routes.length;
      }

      console.log(
        `Navbar: ${navbarWidth}, MaxMenu: ${maxAvailableWidth}, Required: ${totalRequirement}, Visible: ${this.visibleCount}`
      );
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    jumpUserCenter() {
      this.$router.push("/userCenter");
    },
    async logout() {
      // if(this.$Socket){
      //   this.$Socket.closeMyself()
      // }
      await this.$store.dispatch("user/logout");
      window.location.reload();
      // this.$route.query.redirect = this.$route.path;
      // this.$router.replace({ path: "/login", query: this.$route.query });
    },
    changeV2() {
      let url = "";
      const hostname = window.location.hostname;
      const port = window.location.port || 8000;
      if (hostname === "ips.wanhuida.cn") {
        url = `https://ips.wanhuida.cn/v2`; // 正式
      } else if (hostname == "localhost") {
        url = `http://localhost:9528/v2`; //本地
      } else {
        url = `http://${hostname}:${port}/v2`; //测试
      }
      // window.open(url);
      window.location.href = url;
    },
  },
};
</script>

<style lang="scss">
// 导航栏溢出菜单及其各级子菜单的样式，只在.overflow-menu-popover元素内生效
.overflow-menu-popover {
  padding: 0;
  // 核心：强制弹出层（含飞出子菜单）内的项目高度
  .el-menu-item,
  .el-submenu__title {
    height: 42px !important;
    line-height: 42px !important;
    text-align: left !important;
    padding: 0 20px !important;

    // 图标和箭头对齐微调
    i {
      line-height: inherit !important;
      vertical-align: middle !important;
    }

    .el-submenu__icon-arrow {
      right: 10px !important;
      margin-top: -5px !important;
    }
  }

  // 针对主溢出列表的折叠状态（显示文字和箭头）
  .el-menu--collapse {
    width: 150px !important;
    border: none !important;

    .el-submenu__title,
    .el-menu-item {
      span {
        height: auto !important;
        width: auto !important;
        visibility: visible !important;
        display: inline-block !important;
      }
      .el-submenu__icon-arrow {
        // display: block !important;
      }
    }
  }

  .el-menu {
    border: none !important;
  }
}

// 溢出菜单的二级菜单样式，使用更具体的选择器确保只影响溢出菜单
.el-menu--popup {
  // 核心：强制弹出层（含飞出子菜单）内的项目高度
  .el-menu-item,
  .el-submenu__title {
    height: 42px !important;
    line-height: 42px !important;
    text-align: left !important;
    padding: 0 20px !important;
    &:hover {
      background-color: inherit !important;
    }
  }

  // 针对主溢出列表的折叠状态（显示文字和箭头）
  // .el-menu--collapse {
  //   width: 150px !important;
  //   border: none !important;

  //   .el-submenu__title,
  //   .el-menu-item {
  //     span {
  //       height: auto !important;
  //       width: auto !important;
  //       visibility: visible !important;
  //       display: inline-block !important;
  //     }
  //     .el-submenu__icon-arrow {
  //       display: block !important;
  //     }
  //     &:hover {
  //       background-color: #4280c4 !important;
  //     }
  //   }
  // }

  .el-menu {
    border: none !important;
  }
}
</style>

<style lang="scss" scoped>
.menu {
  float: left;
  height: 40px;
  line-height: 40px;
  /deep/ .el-menu-item,
  /deep/ .el-submenu__title {
    height: 40px !important;
    line-height: 40px !important;
    text-align: center !important;
  }
}
.navbar {
  height: 40px;
  //overflow: hidden;
  position: relative;
  background: #52a0f5;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    background-color: white;
    width: 54px;
    line-height: 40px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    position: absolute;
    right: 0;
    height: 100%;
    display: flex;
    line-height: 50px;
    padding-right: 10px;
    img {
      width: 12px;
      margin-right: 5px;
    }
    .firstDiv {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #1a1a1a;
      margin-left: 27px;
    }
    & > div:last-of-type {
      margin-right: 20px;
    }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.modifyPassword {
  position: relative;
  .card {
    position: absolute;
    top: 40px;
    right: -120px;
  }
}
.checkout {
  position: relative;
  .switchingAccounts {
    position: absolute;
    top: 40px;
    z-index: 2;
  }
}
.navbar {
  display: flex;
  .el-menu {
    display: flex;
    flex: 1;
    border-bottom: solid 1px #52a0f5;
  }
}
.logo-warp {
  display: flex;
  align-items: center;
  width: 180px;
  height: 100%;
  float: left;
  .logo {
    width: 111px;
    height: 40px;
    margin-left: 20px;
  }
}
/*/deep/ .icon-img {*/
/*  display: none;*/
/*}*/

.menu-container {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: calc(100% - 180px - 320px);
  overflow: hidden;
  height: 40px;

  .menu {
    flex: 1;
    overflow: hidden;
    height: 40px;
    border-bottom: none !important;
  }

  .overflow-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 40px;
    cursor: pointer;
    color: #ffffff;
    font-size: 20px;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

// .navbar {
//   height: 40px;
//   overflow: hidden;
//   position: relative;
//   background: #52a0f5;
//   box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
//   display: flex;
//   align-items: center;
//   padding: 0;

//   .right-menu {
//     height: 100%;
//     display: flex;
//     align-items: center;
//     margin-left: auto;
//     padding-right: 10px;
//   }
// }
</style>
