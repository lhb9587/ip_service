<template>
  <div class="height100">
<!--    <div class="height100">-->
<!--      <Headlines></Headlines>-->
<!--    </div>-->
<!--    <div class="heightw">-->
<!--      <div class="">-->
<!--        <ArticleCard></ArticleCard>-->
<!--      </div>-->
<!--      <div class="stickyBox" style="position: sticky">-->
<!--        <ReadingList></ReadingList>-->
<!--        <VersionCard></VersionCard>-->
<!--      </div>-->
<!--    </div>-->
    <VersionCard></VersionCard>
<!--    <ResourceView></ResourceView>-->
  </div>
<!--  <div class="flexAble">-->
<!--  <div class="box_card_wrap flexAble">-->
<!--    <VersionCard></VersionCard>-->
<!--  </div>-->

<!--  </div>-->
</template>

<script>
import Headlines from './components/Headlines';
import ReadingList from './components/ReadingList';
import ArticleCard from './components/ArticleCard';
import VersionCard from './components/VersionCard'
import ResourceView from "./components/ResourceView";
export default {
  name: 'Index',
  components:{
    VersionCard,ArticleCard,ReadingList,Headlines,ResourceView
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods:{

  }
}
</script>

<style lang="scss" scoped>
  /*.flexAble{*/
  /*  display: flex;*/
  /*}*/
  /*.box_card_wrap{*/
  /*  width: 800px;*/
  /*  padding: 10px;*/
  /*  .box-card{*/
  /*    !*height: 200px;*!*/
  /*    !*flex: 1;*!*/
  /*    width: 50%;*/
  /*    margin-right:10px ;*/
  /*  }*/
  /*}*/
.height100{
  height:calc(100vh - 80px);
}
  .heightw{
    display: flex;
    /*position: relative;*/
    height: 10000px;
  }
  .stickyBox{
    top:0;
    width: 400px;
    right: 0;
    height:calc(100vh - 80px);
    background: #fafafa;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>
