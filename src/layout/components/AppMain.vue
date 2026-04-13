<template>
  <section class="app-main" :style="$route.path.includes('new_dashboard')?'margin-left: 0;':''">
<!--    <transition name="fade-transform" mode="out-in">-->
      <!--<router-view :key="key" />-->
<!--      <div>-->
        <keep-alive :max="5">
<!--          <transition name="fade-transform" mode="out-in">-->
          <router-view v-if="$route.meta.keepAlive" :key="key"></router-view>
<!--          </transition>-->
        </keep-alive>
<!--        <transition name="fade-transform" mode="out-in">-->
        <router-view v-if="!$route.meta.keepAlive" :key="key"></router-view>
<!--        </transition>-->
<!--      </div>-->
<!--    </transition>-->
<!--    <DownList></DownList>-->
<!--    <WorkBtn v-if="$store.getters.permissions.includes(267)"></WorkBtn>-->
    <WorkHours v-if="$store.getters.permissions.includes(267)"></WorkHours>
  </section>
</template>

<script>
  import DownList from '@/components/DownList'
  // import WorkBtn from '../../views/workbench/workTime/components/workBtn'
  import WorkHours from '../../views/workbench/workTime/components/WorkHours'
// import { mapGetters } from "vuex";
  import downLoadNotice from '@/mixins/downLoadNotice.vue'
export default {
  name: "AppMain",
  mixins: [downLoadNotice],
  components:{
    // WorkBtn,
    DownList,
    WorkHours
  },
  computed: {
    key() {
      return this.$route.path;
    },
    // ...mapGetters(["progressList"]),
  },
  data(){
    return {
      // notify: {}
    }
  },
  watch: {
    // progressList: {
    //   handler(n) {
    //     let data = JSON.parse(JSON.stringify(n))
    //     data.forEach(item=>{
    //       const domList = [...document.getElementsByClassName(item.path)]
    //       if(domList.find(i=>i.className == item.path)){
    //         domList.find(i=>i.className == item.path).innerHTML = item.progress + '%'
    //       }else{
    //         if(item.progress === null){
    //           this.$store.commit('caseInformation/DEL_PROGRESS', item.path)
    //           return;
    //         }
    //         this.notify[item.path] = this.$notify.success({
    //           // title: 'Info',
    //           dangerouslyUseHTMLString: true,
    //           message: `<p style="width: 100px;">正在下载<span class="${item.path}" style="float: right">${item.progress}%</span></p>`,
    //           showClose: false,
    //           duration: 0
    //         });
    //         item.uniq = this.notify[item.path]
    //       }
    //       console.log(item.progress+'%' ,'-------------------------->')
    //
    //       if(item.progress == 100){
    //         this.notify[item.path].close()
    //         // delete this.notify[item.path]
    //         setTimeout(()=>{delete this.notify[item.path]}, 1000)
    //         this.$store.commit('caseInformation/DEL_PROGRESS', item.path)
    //       }
    //     })
    //   },
    //   deep: true
    // },
  }
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 80px);
  position: relative;
  border-top: 1px solid transparent;
  /* padding-bottom: 20px; */
  background: #fff;
  /*overflow: auto;*/
  margin: 0 30px 0 10px;
}
.fixed-header + .app-main {
  padding-top: 50px;

}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
