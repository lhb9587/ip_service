<template>
    <div style=" width:285px ;" v-if="curModel&&curModel.length">
      <el-collapse v-model="activeNames">
        <el-collapse-item :title="item.tongjiName" :name="String(index)" v-for="(item,index) in curModel" @mouseenter.native="changeMouseState(item)" @mouseleave.native="item.mouseState=false">
          <div v-if="!item.checkboxState">
            <el-button class="floatRightButton" v-if="item.mouseState" size="mini" @click="$set(item,'checkboxState',true)">+多选</el-button>
          </div>
          <div v-if="item.checkboxState">
            <el-button  class="floatRightButton" style="right: 95px" size="mini"  @click="multiConditionQuery(item.tongjiData)">确定</el-button>
            <el-button  class="floatRightButton" size="mini" @click="$set(item,'checkboxState',false)">-取消</el-button>
          </div>
          <div v-show="item.checkboxState">
            <el-tree
              class="filter-tree"
              :data="item.tongjiData"
              :props="defaultProps"

              ref="tree">
              <p style="width: 100%" slot-scope="{ node, data }">
                <el-checkbox v-model="data.select">{{data.name}}</el-checkbox>
                <span style="float: right">{{data.value}}</span>
              </p>
            </el-tree>
          </div>
        <div v-show="!item.checkboxState">
          <el-tree
            class="filter-tree"
            :data="item.tongjiData"
            :props="defaultProps"
            ref="tree"

          >
            <p style="width: 100%" slot-scope="{ node, data }">
              <span  class="label ellipsis" style="float: left" @click="handleSearch(node)">{{data.name}}</span>
              <span style="float: right">{{data.value}}</span>
            </p>
          </el-tree>
        </div>

<!--          <template v-if="!item.checkboxState">-->
<!--            <el-button class="floatRightButton" v-show="item.mouseState" size="mini" @click="item.checkboxState=true">+多选</el-button>-->
<!--            <div v-for="itm in item.list">-->
<!--              <label class="hovertype"><i class="fuxuan"></i><span>{{itm.type}}</span></label> <span style="float: right">{{itm.number}}</span>-->
<!--            </div>-->
<!--          </template>-->
<!--          <template v-if="item.checkboxState">-->
<!--             <el-button  class="floatRightButton" size="mini"  v-if="item.checkboxState" @click="item.checkboxState=false">-取消</el-button>-->
<!--              <div v-for="itm in item.list">-->
<!--                <label class="hovertype"><el-checkbox v-if="item.checkboxState" :label="itm.type"></el-checkbox></label> <span style="float: right">{{itm.number}}</span>-->
<!--              </div>-->
<!--            <el-button size="mini" style="float: right" >确定</el-button>-->
<!--          </template>-->
        </el-collapse-item>
      </el-collapse>
    </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "knowlegdeListModel",
    props:{
      queryData:{}
    },
    data(){
      return {
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        activeNames: ['1','2','3','4'],
        pageList:[
          {title:'文书性质',name:'1',mouseState:false,checkboxState:false,list:[{type:'决定书',number:'112029'},{type:'决定书',number:'112029'}]},
          {title:'文书性质',name:'2',mouseState:false,checkboxState:false,list:[{type:'决定书',number:'112029'},{type:'决定书',number:'112029'}]},
          {title:'文书性质',name:'3',mouseState:false,checkboxState:false,list:[{type:'决定书',number:'112029'},{type:'决定书',number:'112029'}]},
          {title:'文书性质',name:'4',mouseState:false,checkboxState:false,list:[{type:'决定书',number:'112029'},{type:'决定书',number:'112029'}]}]
      }
    },
    methods:{
      changeMouseState(item){
        this.$set(item,'mouseState',true)
      },
      handleSearch(node){

        let data={}
        if(this.queryData){
          data=this.queryData
        }else {
          for (var key in this.$route.query){
            data[key] = this.$route.query[key]
          }
        }
        data[node.data.property]=node.data.name
        // let searchProp=this.$commonUtils.intersection(Object.keys(this.$route.query),this.$commonUtils.getFilterModel('filterType','filterType').map(item=>item.property))
        data.pageNo=1
        if(this.queryData){
          this.$emit('updataDataStore',data)
        }else {
          this.$router.push({query:data})
        }
      },
      multiConditionQuery(list){
        let data={}
        if(this.queryData){
          data=this.queryData
        }else {
          for (var key in this.$route.query){
            data[key] = this.$route.query[key]
          }
        }
        data.pageNo=1
        console.log(data);
        let newQueryList =this.$commonUtils.getMenuName(list, 'children')
        newQueryList.forEach(item=>{
          if(item.select){
            if(!data[item.property]){
              data[item.property]=[item.name]
            }else {
              if(typeof data[item.property] =='object'){
                if(!data[item.property].includes(item.name)){
                  data[item.property].push(item.name)
                }

              }else {
                data[item.property]=[data[item.property]]
                if(!data[item.property].includes(item.name)){
                  data[item.property].push(item.name)
                }
              }
            }
          }
        })
        if(this.queryData){
          this.$emit('updataDataStore',data)
        }else {
          this.$router.push({query:{scId:data.scId}})
          this.$nextTick(()=>{
            this.$router.push({query:data})
          })
        }

      }
    },
    watch:{
      curModel:{
        handler(n,o){
          if(n&&n.length){
            this.activeNames = n.map((item,index) => String(index))
          }
        },
        deep:true,
        immediate:true
      }
    },
    computed:{
       ...mapState({
         curModel: state => state.knowledgeBase.curModel,

      })
    }
  }
</script>

<style lang="scss" scoped>

.el-collapse-item /deep/{
  .label{
    width:200px ;
  }
  position: relative;
  .hovertype:hover{
    color: #00b0ff;
  }
  .hovertype{
    font-weight: normal;
  }
  .fuxuan{
    width: 4px;
    height: 4px;
    vertical-align: middle;
    background-color: #373d41;
    margin-right: 8px;
    margin-left: 3px;
  }
  .floatRightButton{
    position: absolute;
    right: 25px;
    top: 10px;
  }
}

</style>
