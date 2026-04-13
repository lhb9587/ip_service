<template>
  <div>
    <div class="container">
      <label class="filterLabel">筛选条件:</label>
      <el-tag
      v-for="(tag,key) in dynamicTags.filter(item=>!!item['value']&&!Array.isArray(item['value']) || Array.isArray(item['value'])&&item['value'].filter(i=>!!i).length)"
      :key="key"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)">
      {{tag['type']}}:
        <span class="ellipsis" style="max-width: 200px;
    display: inline-block;
    vertical-align: bottom;" :title="tag['value'].join('、')" v-if="Object.prototype.toString.call(tag['value']).includes('Array')">{{tag['value'].join('、')}}</span>
        <span v-else>{{tag['value']}}</span>
     </el-tag>
     </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import {queryDocList} from '@/api/knowledgeBase.js'
  export default {
    name: "ScreeningCriteria",
    props:{
      queryData:{}
    },
    data(){
      return {
        dynamicTags: [],
      }
    },
    created() {
      if(this.queryData){
        this.getData(this.queryData)
      }
    },
    methods:{
      getfenlei(array,item){
        if(!array){
          array=[]
        }
        let arr=this.$commonUtils.getMenuName(item.values,item.propsValue.children)
        return array.map(itm=>arr.find(i=>i[item.propsValue.value]==itm)[item.propsValue.label]).join('/')
      },
      getData(queryData){
        let data = queryData
        let searchProp = this.$commonUtils.intersection(Object.keys(data),this.$commonUtils.getFilterModel('filterType','filterType').map(item=>item.property))

        this.dynamicTags = searchProp.filter(item=>!['tokenID','pageSize','pageNo','id','stId','scId'].includes(item)).map(item=>{
          let filterItem = this.$commonUtils.getFilterModel('filterType','filterType').find(i=>i.property==item)
          if(filterItem.filterType!=='cascader'){
            return {type: filterItem.filterName,value: data[item]}
          } else {
            let value;
            if(typeof data[item][0]=='string'){
              value =  data[item].map(i => this.getfenlei(i.split(','), filterItem))
            } else {
              value =  data[item].map(i => this.getfenlei(i, filterItem))
            }
            return {type: filterItem.filterName,value}
          }
        })
        if(data.keyword){
          this.dynamicTags.unshift({type:'全文检索',value:data.keyword})
        }
        queryDocList(data).then(res=>{
          this.$store.commit('knowledgeBase/SET_CURLIST',res.data.data1)
          this.$store.commit('knowledgeBase/SET_CURMODEL',res.data.data2)
          this.$store.commit('knowledgeBase/SET_CURTOTAL',res.total)
        })
      },
      handleClose(tag) {
        // if(this.dynamicTags.filter(item=>!!item.value).length==1){
        //   this.$message.error('至少需要一个筛选条件')
        //   return
        // }
        let data={

        }

        if(this.queryData){
          data=this.queryData
        }else {



        let n=this.$route.query
        Object.keys(this.$route.query).map(item=>{
          if(item.match(/\[\d+\]/g)&&item.match(/\[\d+\]/g).length==2){
            return item.replace(/\[\d+\]\[\d+\]/,'')
          } else {
            return item.replace(/\[\d+\]/,'')
          }
        }).forEach(item=>{
          for(var key in n){
            if(key===item){
              data[item]=n[key]
              return
            }
            if(key.match(/\[\d+\]/g)&&key.match(/\[\d+\]/g).length==1){
              if(key.replace(/\[\d+\]/,'')==item){
                if(!data[item]){
                  data[item]=[n[key]]
                }else {
                  if(!data[item].includes(n[key])){
                    data[item].push(n[key])
                  }
                }
              }
            }
            if(key.match(/\[\d+\]/g)&&key.match(/\[\d+\]/g).length==2){
              if(key.replace(/\[\d+\]\[\d+\]/,'')==item){

                if(!data[item]){
                  data[item]=[[n[key]]]
                }else {
                  if(!data[item].includes(n[key])){
                    var index1=key.match(/\[\d+\]/g).map(i=>i.replace(/[\[\]]/g,''))[0]
                    var index2=key.match(/\[\d+\]/g).map(i=>i.replace(/[\[\]]/g,''))[1]
                    if(index1==data[item].length-1){
                      data[item][index1][index2]=n[key]
                    }else {
                      data[item][index1]=[]
                      data[item][index1][index2]=n[key]
                    }
                  }
                }
              }
            }
          }
        })
        }
        // let data={}
        // console.log(this.$route.query);
        // let searchProp=this.$commonUtils.intersection(Object.keys(this.$route.query),this.$commonUtils.getFilterModel('filterType','filterType').map(item=>item.property))
        // for (var key in this.$route.query){
        //   data[key] = this.$route.query[key]
        // }
        if(tag.type!='全文检索'){
          if(this.$commonUtils.getFilterModel('filterType','filterType').find(i=>i.filterName==tag.type)){
            delete data[this.$commonUtils.getFilterModel('filterType','filterType').find(i=>i.filterName==tag.type).property]
          }
        }else {
          delete data['keyword']
        }

        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        if(this.queryData){
          this.$emit('updataDataStore',data)
        }else {
          this.$router.push({query:data})
        }

        // console.log(this.$route.query);

      },
    },
    watch:{
      '$route.query':{
        handler(n,o){
          if(this.queryData){
            return
          }
          let data={
          }
          Object.keys(n).map(item=>{
            if(item.match(/\[\d+\]/g)&&item.match(/\[\d+\]/g).length==2){
              return item.replace(/\[\d+\]\[\d+\]/,'')
            } else {
              return item.replace(/\[\d+\]/,'')
            }
          }).forEach(item=>{
            for(var key in n){
              if(key===item){
                data[item]=n[key]
                return
              }
              if(key.match(/\[\d+\]/g)&&key.match(/\[\d+\]/g).length==1){
                if(key.replace(/\[\d+\]/,'')==item){
                  if(!data[item]){
                    data[item]=[n[key]]
                  }else {
                    if(!data[item].includes(n[key])){
                      data[item].push(n[key])
                    }
                  }
                }
              }
              if(key.match(/\[\d+\]/g)&&key.match(/\[\d+\]/g).length==2){
                if(key.replace(/\[\d+\]\[\d+\]/,'')==item){

                  if(!data[item]){

                    data[item]=[[n[key]]]
                    // if(key.match(/\[\d+\]/g).map(i=>i.replace(/[\[\]]/g,''))[0])


                  }else {
                    if(!data[item].includes(n[key])){
                      var index1=key.match(/\[\d+\]/g).map(i=>i.replace(/[\[\]]/g,''))[0]
                     var index2=key.match(/\[\d+\]/g).map(i=>i.replace(/[\[\]]/g,''))[1]
                      if(index1==data[item].length-1){
                        data[item][index1][index2]=n[key]
                      }else {
                        data[item][index1]=[]
                        data[item][index1][index2]=n[key]
                      }
                    }
                  }
                }
              }
            }
          })
          let searchProp = this.$commonUtils.intersection(Object.keys(data),this.$commonUtils.getFilterModel('filterType','filterType').map(item=>item.property))

          this.dynamicTags = searchProp.filter(item=>!['tokenID','pageSize','pageNo','id','stId','scId'].includes(item)).map(item=>{
            let filterItem = this.$commonUtils.getFilterModel('filterType','filterType').find(i=>i.property==item)
            if(filterItem.filterType!=='cascader'){
              return {type: filterItem.filterName,value: data[item]}
            } else {
              let value;
              if(typeof data[item][0]=='string'){
                value =  data[item].map(i => this.getfenlei(i.split(','), filterItem))
              } else {
                value =  data[item].map(i => this.getfenlei(i, filterItem))
              }
              return {type: filterItem.filterName,value}
            }
          })
          if(data.keyword){
            this.dynamicTags.unshift({type:'全文检索',value:n.keyword})
          }
          queryDocList(n).then(res=>{
            this.$store.commit('knowledgeBase/SET_CURLIST',res.data.data1)
            this.$store.commit('knowledgeBase/SET_CURMODEL',res.data.data2)
            this.$store.commit('knowledgeBase/SET_CURTOTAL',res.total)
          })
        },
        deep:true,
        immediate:true
      }
    },
    computed:{
      ...mapState({
        'filterData': state => state.knowledgeBase.filterData,
      })
    }
  }
</script>

<style lang="scss" scoped>
  .container{
    line-height: 70px;
    height: 70px;
    margin-right: auto;
    margin-left: auto;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .filterLabel{
    padding-left: 10px;
    font-weight: normal;
    margin-right: 20px;
  }

</style>
