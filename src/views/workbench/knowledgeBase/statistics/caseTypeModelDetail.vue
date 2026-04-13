<template>
  <div>

    <div class="caseTypeModelDetail_header">
      <div class="caseTypeModelDetail_header_top">
        <div>
          <img src="" alt="">
        </div>
        <div>
          <p class="title firmid" v-for="item in propertyData.propertyList1">
            <span  v-if="item.property=='title'&&pageData.find(itm=>itm['property']==item.property)">
              {{pageData.find(itm=>itm['property']==item.property).name}}
            </span>
<!--            <span v-if="item.property=='title'">{{pageData.find(itm=>itm[itm.property]==item.property).name}}</span>-->
<!--            北京万慧-->
          </p>
          <ul class="propertyList1_wrap">
            <li v-if="item.property!='title'" class="corblur" v-for="item in propertyData.propertyList1" >
              <span class="dot"></span>
              <span class="name" v-if="pageData.find(itm=>itm['property']==item.property)">{{pageData.find(itm=>itm['property']==item.property).name}}</span>
              <span class="value"  v-if="pageData.find(itm=>itm['property']==item.property)">{{pageData.find(itm=>itm['property']==item.property).value}}</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
<!--    <el-tabs v-model="activeName" type="card" @tab-click="({name})=>handleClick(propertyData.propertyList2.find(itm=>itm['property']==name))">-->
<!--      <el-tab-pane :label="item.propertyName" :name="item.property" v-for="item in propertyData.propertyList2">-->
<!--&lt;!&ndash;        <el-select v-model="item.tongjivalue" clearable placeholder="请选择" @change="(tongjiProperty)=>weiduChange(tongjiProperty,item)">&ndash;&gt;-->
<!--&lt;!&ndash;          <el-option&ndash;&gt;-->
<!--&lt;!&ndash;            v-for="itm in item.tongjiList"&ndash;&gt;-->
<!--&lt;!&ndash;            :key="itm.tongjiProperty"&ndash;&gt;-->
<!--&lt;!&ndash;            :label="itm.tongjiName"&ndash;&gt;-->
<!--&lt;!&ndash;            :value="itm.tongjiProperty"&ndash;&gt;-->
<!--&lt;!&ndash;            >&ndash;&gt;-->
<!--&lt;!&ndash;          </el-option>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-select>&ndash;&gt;-->
<!--        <div class="model_wrap">-->
<!--        <div class="deepSize" v-if="tabPageData[item.ptId]&&tabPageData[item.ptId].length==1&&!tabPagechildrenData[item.ptId]">-->
<!--          <el-form ref="form"  label-width="80px">-->
<!--            <el-form-item label="top" >-->
<!--              <el-select v-model="item.tongjiSize" placeholder="请选择" @change="(value)=>handleClick(item)">-->
<!--                <el-option-->
<!--                  v-for="size in [10,20,30,40,50]"-->
<!--                  :key="size"-->
<!--                  :label="size"-->
<!--                  :value="size">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
<!--        </div>-->
<!--        <div class="flexAble" v-for="itm in tabPageData[item.ptId]">-->
<!--          <div style="width: 600px">-->
<!--          <YChat class="YChat" v-if="itm.chartType=='pie'"  :type="itm.chartType" :options="itm" />-->
<!--          <YChat class="YChat"  v-else :type="itm.chartType=='pie'?'pie':'axis'" :options="itm" />-->
<!--          </div>-->
<!--          <chatTable class="chatTable"  :tableData="itm.tableData"></chatTable>-->
<!--        </div>-->
<!--        </div>-->
<!--        <template v-if="tabPagechildrenData[item.ptId]&&tabPagechildrenData[item.ptId].length">-->
<!--          <div  class="model_wrap"  v-for="(itm,index) in tabPagechildrenData[item.ptId]">-->
<!--            <div class="filterModel" v-if="item.tongjiList.indexOf(item.tongjiList.find(i=>!!i.changetj))==index">-->
<!--              <el-form ref="form" :model="queryForm[item.ptId]" label-width="80px">-->
<!--                <el-form-item :label="tongjiItem.tongjiName" v-for="tongjiItem in item.tongjiList">-->
<!--                  <template v-if="tongjiItem.docfilter.filterType=='select'">-->
<!--                    <el-select clearable filterable  v-model="queryForm[item.ptId][tongjiItem.docfilter.filterProperty]" @change="(value)=>weiduChange(queryForm,item.ptId,item.tongjiList[index],index)">-->
<!--                      <el-option v-for="optionItem in  tongjiItem.docfilter.values" :label="optionItem.value" :value="optionItem.id"></el-option>-->
<!--                    </el-select>-->
<!--                  </template>-->
<!--                  <template  v-if="tongjiItem.docfilter.filterType=='year'">-->
<!--                    <DateYearPicker v-model="queryForm[item.ptId][tongjiItem.docfilter.filterProperty]" @change="(value)=>weiduChange(queryForm,item.ptId,tongjiItem,index)"></DateYearPicker>-->
<!--                  </template>-->
<!--                </el-form-item>-->
<!--              </el-form>-->
<!--            </div>-->
<!--            <div class="deepSize" v-if="item.tongjiList[index].tongjiSize" >-->
<!--              <el-form ref="form" :model="queryForm[item.ptId]" label-width="80px">-->
<!--                <el-form-item label="top" >-->
<!--                  <el-select v-model="item.tongjiList[index].tongjiSize" placeholder="请选择" @change="(value)=>tongjiSizeChange(item.ptId,item.tongjiList[index],index)">-->
<!--                    <el-option-->
<!--                      v-for="size in [10,20,30,40,50]"-->
<!--                      :key="size"-->
<!--                      :label="size"-->
<!--                      :value="size">-->
<!--                    </el-option>-->
<!--                  </el-select>-->
<!--                </el-form-item>-->
<!--              </el-form>-->
<!--            </div>-->

<!--            <div class="flexAble">-->
<!--              <div style="width: 600px">-->


<!--              <YChat class="YChat" v-if="itm.chartType=='pie'"  :type="itm.chartType" :options="itm" />-->
<!--              <YChat class="YChat"  v-else :type="itm.chartType=='pie'?'pie':'axis'" :options="itm" />-->
<!--              </div>-->
<!--              <chatTable class="chatTable"  :tableData="itm.tableData"></chatTable>-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-tab-pane>-->
<!--    </el-tabs>-->
    <template v-if="chartList.length">
      <div  class="model_wrap"  v-for="(item,index) in chartList">
        <div class="deepSize" v-if="item.tongjiList&&item.tongjiList.filter(i=>i.tongjiName==='top').length" >
          <el-form ref="form" :model="queryForm[index]" label-width="80px">
            <el-form-item label="top" >
              <el-select v-model="item.tongjiList[0].tongjiSize" placeholder="请选择" @change="(value)=>tongjiSizeChange(item.tongjiList[0],index)">
                <el-option
                  v-for="size in [10,20,30,40,50]"
                  :key="size"
                  :label="size"
                  :value="size">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <div class="filterModel" v-if="item.tongjiList&&item.tongjiList.filter(i=>i.tongjiName!='top').length">
          <el-form ref="form" :model="queryForm[index]" label-width="80px">
            <el-form-item :label="tongjiItem.tongjiName" v-for="tongjiItem in item.tongjiList.filter(i=>i.tongjiName!='top')">
              <template v-if="tongjiItem.docfilter.filterType=='select'">
                <el-select clearable filterable  v-model="queryForm[index][tongjiItem.docfilter.filterProperty]" @change="(value)=>weiduChange(queryForm,tongjiItem,index)">
                  <el-option v-for="optionItem in  tongjiItem.docfilter.values" :label="optionItem.value" :value="optionItem.id"></el-option>
                </el-select>
              </template>
              <template v-if="tongjiItem.docfilter.filterType=='checkbox'">
                <el-select clearable filterable multiple  v-model="queryForm[index][tongjiItem.docfilter.filterProperty]" @change="(value)=>weiduChange(queryForm,tongjiItem,index)">
                  <el-option v-for="optionItem in  tongjiItem.docfilter.values" :label="optionItem.value" :value="optionItem.id"></el-option>
                </el-select>
              </template>
              <template  v-if="tongjiItem.docfilter.filterType=='year'">
                <DateYearPicker v-model="queryForm[index][tongjiItem.docfilter.filterProperty]" @change="(value)=>weiduChange(queryForm,tongjiItem,index)"></DateYearPicker>
              </template>
            </el-form-item>
          </el-form>
        </div>

        <div class="flexAble">
          <div style="width: 600px">


            <YChat class="YChat" v-if="item.chartType=='pie'"  :type="item.chartType" :options="item" />
            <YChat class="YChat"  v-else :type="item.chartType=='pie'?'pie':'axis'" :options="item" />
          </div>
          <chatTable class="chatTable"  :tableData="item.tableData"></chatTable>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import DateYearPicker from '@/components/DateYearPicker/index.vue'
  import chatTable from './components/chatTable'
  import YChat from "@/views/workbench/platformData/companyDashboard/components/YChat.vue";
  import { queryPropertyList ,queryPageData} from '@/api/knowledgeBase'
  // import format from "../../../../components/pl-table/src/locale/format";
  export default {
    name: "caseTypeModelDetail",
    data(){
      return{
        activeName:'1',
        propertyList:[],
        pageData:[],
        propertyData:{},
        // tableC
        caseData:{
          title:'北京万慧达',
          image:'',
          list:[{label:'案件数量',number:1000,prop:'caseNumber'}]
        },
        tabList:[{label:'案件数量',name:'caseNumber'}],
        tongjivalue:'',
        checkedItems:[
          {
            "series": [
              { "name": "宁波分公司", "value": 57, },
              {  "name": "君策知识产权发展中心", "value": 6, },
              { "name": "英诺万", "value": null, },
              {  "name": "云南分公司", "value": 2611, },
              {  "name": "曜斗公司", "value": null,  },
              {  "name": "上海分公司", "value": 3247,  },
              { "name": "厦门分公司", "value": null, },
              { "name": "深圳分公司", "value": 751,  },
              {  "name": "重庆分公司", "value": null, },
              {  "name": "北京总部", "value": 45834,  },
              {  "name": "广州分公司", "value": 2634,  },
              { "name": "苏州分公司", "value": null,},
              {  "name": "天津分公司", "value": 56,},
              {"name": "杭州分公司", "value": 2508,} ],
            "chartType": "cake",
            "title": "案量-万慧达集团",
            'dimensional':'2'
          },
          {
            "series": [
              { "data": [ 20, 69, 90, 57, null ], "name": "宁波分公司", },
              { "data": [ 10, 8, 4, 6, 1 ], "name": "君策知识产权发展中心",},
              { "data": [ null, null, null, null, 1 ], "name": "英诺万",  },
              { "data": [ 2081, 2235, 3090, 2611, 1030 ], "name": "云南分公司",  },
              { "data": [ null, null, null, null, 20 ], "name": "曜斗公司",   },
              { "data": [ 1773, 2641, 2923, 3247, 402 ], "name": "上海分公司",  },
              { "data": [ 219, 110, 22, null, null ], "name": "厦门分公司",  },
              { "data": [ 233, 263, 345, 751, 52 ], "name": "深圳分公司",  },
              { "data": [ null, null, null, null, 35 ], "name": "重庆分公司",  },
              { "data": [ 24638, 27494, 35626, 45834, 10566 ], "name": "北京总部", },
              { "data": [ 1549, 1849, 1641, 2634, 422 ], "name": "广州分公司", },
              { "data": [ 102, 8, null, null, null ], "name": "苏州分公司",  },
              { "data": [ null, null, null, 56, 91 ], "name": "天津分公司",},
              { "data": [ 259, 970, 1329, 2508, 574 ], "name": "杭州分公司", } ],
               "x": [ 2016, 2017, 2018, 2019, 2020 ],
               "chartType": "bar",
               "title": "案量-万慧达集团",
          },
        ],
        column:[{label:'日期',prop:'date'},{label:'姓名',prop:'name'},{label:'地址',prop:'address'}],
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        tabPageData:{},
        tabPagechildrenData:{},
        queryForm:{},
        chartList:[]
      }
    },
    components:{
      YChat,chatTable,DateYearPicker
    },
    created() {
      let query={}
      for(var key in this.$route.query){
        query[key]=this.$route.query[key]
      }
      query.tokenID=this.$store.state.knowledgeBase.defaultTokenData.tokenID
      this.queryPageData(query)
    },
    methods:{
      getPageData(){
        let query={}
        let linkptId=52

        for(var key in this.$route.query){
          query[key]=this.$route.query[key]
        }
        // if(item.tongjiSize){
        //   query.tongjiSize=item.tongjiSize
        // }
        query.linkptId=linkptId
        query.tokenID=this.$store.state.knowledgeBase.defaultTokenData.tokenID
        queryPageData(query).then(res=>{
          res.data.forEach((item,index)=>{
            if(item.chartType=='pie'){
              item.dimensional='2'
            }
            this.$set(this.queryForm,index,{})
          })
          this.chartList=res.data

          // this.$set(this.tabPageData,linkptId,res.data)

        })
      },
      handleClick(item){
        if(this.propertyData.propertyList1.find(itm=>itm.property == item.property)){
          let linkptId = this.propertyData.propertyList1.find(itm=>itm.property == item.property).linkptId
          this.activeName = this.propertyData.propertyList2.find(itm=>itm.ptId == linkptId).property;
          // this.activeName=item.property
         let query={}
         for(var key in this.$route.query){
           query[key]=this.$route.query[key]
         }
         if(item.tongjiSize){
           query.tongjiSize=item.tongjiSize
         }
          query.linkptId=linkptId
          query.tokenID=this.$store.state.knowledgeBase.defaultTokenData.tokenID
          queryPageData(query).then(res=>{
            res.data.forEach(item=>{
              if(item.chartType=='pie'){
                item.dimensional='2'
              }
            })
            this.$set(this.tabPageData,linkptId,res.data)

          })
          if(item.tongjiList&&item.tongjiList.length){
            let tongjiPropertylist= item.tongjiList.map(itm=>itm.tongjiProperty)
            Promise.all(tongjiPropertylist.map(itm=> queryPageData({...query,...{tongjiProperty:itm}}))).then(res=>{
              this.$set(this.tabPagechildrenData,linkptId,this.$commonUtils.getLanglist(res.map(itm=>itm.data)))
              this.$set(this.queryForm,linkptId,{})
            })
          }
        }
      },
      weiduChange(value,item,index){
        console.log(value[index],item);
        let query={}
        for(var key in this.$route.query){
          query[key]=this.$route.query[key]
        }
        query.tongjiSize=item.tongjiSize
         // query.tongjiProperty='docDateString'
        query.changetj=this.chartList[index].tongjiList.find(item=>item.changetj).changetj
        query.linkptId=52
        query.tokenID=this.$store.state.knowledgeBase.defaultTokenData.tokenID
        queryPageData({...query,...value[index]}).then(res=>{
          res.data.forEach(item=>{
            if(item.chartType=='pie'){
              item.dimensional='2'
            }
          })
          this.$set(this.chartList,index,res.data[0])

          // this.$set(this.tabPageData,ptId,res.data)
        })
      },
      tongjiSizeChange(data,index){
        let query={}
        for(var key in this.$route.query){
          query[key]=this.$route.query[key]
        }
        query.tongjiProperty=data.tongjiProperty
        query.tongjiSize=data.tongjiSize
        // query.changetj=item.changetj
        query.linkptId=52
        query.tokenID=this.$store.state.knowledgeBase.defaultTokenData.tokenID
        queryPageData(query).then(res=>{
          res.data.forEach(item=>{
            if(item.chartType=='pie'){
              item.dimensional='2'
            }
            if(item.tongjiList&&item.tongjiList.length>1){
              item.tongjiList.forEach(i=>{
                i.tongjiSize=data.tongjiSize
              })
              // item.tongjiList[0].tongjiSize=
            }
          })
          // this.chartList=res.data
          this.$set(this.chartList,index,res.data[0])

          // this.$set(this.tabPageData,ptId,res.data)
        })
      },
      queryPageData(query){
        // console.log(query);
        query=  JSON.parse(JSON.stringify(query))
        Promise.all([queryPropertyList(query),queryPageData(query)]).then(res=>{
              this.propertyList=res[0].data;
                [...new Set(this.propertyList.map(item=>item.location))].forEach(item=>{
                  this.$set(this.propertyData,'propertyList'+item,this.propertyList.filter(ite=>ite.location==item))

                  // this['propertyList'+item]=this.propertyList.filter(item=>item.location==item)
          })

            // this.handleClick(this.propertyData.propertyList2[0])
          this.pageData = res[1].data.map(item=>{
            if(item.tongjiData){
              return Object.assign(item,item.tongjiData[0])
            }else {
              return item
            }
          })

        })
        this.getPageData()
        // queryPropertyList(query)
        // queryPageData(query).then(res=>{
        //
        // })
      }
    }
  }
</script>

<style lang="scss" scoped>
.firmid{
  font-size: 22px;
  color: #333;
  line-height: 40px;
}
.propertyList1_wrap{
  display: flex;
  flex-wrap:wrap ;
  li{
    position: relative;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
    line-height: 30px;
    width: 25%;
    .dot{
      display: block;
      width: 5px;
      height: 5px;
      background: #0e88eb;
      float: left;
      margin-top: 14px;
      border-radius: 3px;
      margin-right: 10px;
    }
    .value{
      float: right;
    }
  }
  .corblur{
    color: #00b0ff;
    /*cursor: pointer;*/
  }
}
  .flexAble{
    display: flex;

    .YChat{
      width: 600px;
      /*height: 400px;*/
      /*/deep/ .echarts{*/
      /*  height: 400px;*/
      /*}*/
    }
    .chatTable{
      margin-left: 20px;
      flex: 1;
    }
  }
  /deep/ .el-form-item{
    margin-bottom: 0;
    margin-top: 10px;
  }
  .model_wrap{
    padding-bottom: 10px;
    border-bottom: 1px dashed #ccc;
  }
</style>
