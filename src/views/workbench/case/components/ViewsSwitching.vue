<template>
  <div class="operation" @click="visibilityState=!visibilityState" >

    <i class="iconfont icon-18List" v-show="pattern" @click="selectHandler(1)"></i>
    <i class="iconfont icon-list"   v-show="!pattern" @click="selectHandler(2)"></i>
    <!--<i class="el-icon-caret-bottom" v-show="!visibilityState"></i>-->
    <!--<i class="el-icon-caret-top" v-show="visibilityState"></i>-->
    <!--<ul class="list_wrap" v-if="visibilityState" >-->
      <!--<h5>视图</h5>-->
      <!--<li @click="selectHandler(1)"><i :style="{visibility:pattern?'hidden':'visible'}" class="el-icon-check"></i>列表视图</li>-->
      <!--<li @click="selectHandler(2)"><i :style="{visibility:pattern?'visible':'hidden'}" class="el-icon-check"></i>详细视图</li>-->
    <!--</ul>-->
  </div>
</template>

<script>
  import {mapState} from 'vuex'
export default {
  name: "ViewsSwitching",
  data(){
    return{
      visibilityState:false
    }
  },
  methods:{
    selectHandler(type){
      this.$emit('changePattern',type)
      // this.visibilityState=false
    },
    handleOutSide(){
      this.visibilityState=false
    }
  },
  computed:{
    ...mapState({
      'pattern':state=> state.user.pattern
    }),
  }
}
</script>

<style lang="scss" scoped>
  .operation{
    position: relative;
    border-radius:3px  ;
    box-sizing: border-box;
    background: #fff;
    padding: 8px;
    border: 1px solid #ccc;
    cursor: pointer;
    img{
      vertical-align: middle;
    }
    i{
      vertical-align: middle;
    }
    .list_wrap{
      position: absolute;
      width: 180%;
      right: 0;
      top: 35px;
      box-shadow: 0 3px 6px rgba(111,111,111,0.2);
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 3px;
      h5{
        padding: 3px 10px
      }
      li{
        padding: 3px 10px;
        font-size: 14px;
      }
      li:hover{
        background-color: #3b73af;
        color: #fff;
      }
    }
  }
.icon-18List:before{
  display:inline-block;
  transform: rotate(180deg);
}
</style>
