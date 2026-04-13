<template>
  <div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="商标" name="1">
          <div class="caseType">
<!--            <i class="el-icon-search" ></i>-->
            裁定日期截止日:{{createDate}} </div>
          <div style="float: right;display: flex;flex-direction: column;height: 70px;justify-content: space-between;align-items: flex-end;">
            <el-button  size="mini"  type="primary"   @click="queryCaseTypeList">确定</el-button>
            <el-button  size="mini"  @click="clearSearch">重置</el-button>
          </div>

          <el-form  size="mini" label-width="120px" class="form-container"  style="margin-top: 2px;max-height: 300px;overflow: auto"  >
            <el-form-item :label="item.filterName+':'"
                          :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'" v-for="item,index in conditionsModuleList" :key="index">

              <el-select v-model="queryModuleData[item.property]" placeholder="请选择" v-if="item.filterType==='select'" filterable clearable>
                <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                </el-option>
              </el-select>
              <!--<el-checkbox-group style="display:flex" v-model="queryModuleData[item.property]" v-if="item.filterType==='checkbox'">-->
              <!--<el-checkbox v-for="itm in item.values" :label="itm.value" :key="itm.id">{{itm.value}}</el-checkbox>-->
              <!--</el-checkbox-group>-->
              <el-select  v-if="item.filterType==='checkbox'&&item.values&&item.values.length"    v-model="queryModuleData[item.property]" multiple reserve-keyword placeholder="请选择"  filterable  clearable >
                <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                </el-option>
              </el-select>
              <el-select v-if="item.filterType==='selectMany'" v-model="queryModuleData[item.property]"  filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                </el-option>
              </el-select>
              <el-select v-if="item.filterType==='selectMultipleMany'" multiple v-model="queryModuleData[item.property]"  filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                </el-option>
              </el-select>
              <el-select v-if="item.filterType==='selectMultipleManyTable'" multiple v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                <el-option disabled label="" value="-1">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
            {{itmx}}
            </span>
                </el-option>
                <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                  <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item" effect="light" :content="itmx" placement="top">
                    <span>{{itmx}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
              <el-select v-if="item.filterType==='selectTableMany'"  v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                <el-option disabled label="" value="">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
            {{itmx}}
            </span>
                </el-option>
                <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                  <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item" effect="light" :content="itmx" placement="top">
                    <span>{{itmx}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
              <el-select v-if="item.filterType==='selectTableMultipleMany'" v-model="queryModuleData[item.property]" multiple filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                <el-option disabled label="" value="">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
            {{itmx}}
            </span>
                </el-option>
                <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                  <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item" effect="light" :content="itmx" placement="top">
                    <span>{{itmx}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
              <el-select v-if="item.filterType==='selectTable'" v-model="queryModuleData[item.property]" filterable clearable placeholder="请选择">
                <el-option v-for="itm ,idx in item.values" :key="idx" :label="itm.value" :value="itm.id" :disabled="itm.id==-1">
                  <span v-for="itmx ,key in item['values'][idx]" v-if="key!='id'">{{itmx}}</span>
                </el-option>
              </el-select>
              <el-radio-group v-model="queryModuleData[item.property]" v-if="item.filterType==='radio'">
                <el-radio :label="itm.id" v-for="itm,index in item.values" :key="index">{{itm.value}}</el-radio>
              </el-radio-group>
              <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='text'"></el-input>
              <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" type="textarea" v-if="item.filterType==='textarea'"></el-input>
              <el-input clearable v-model="queryModuleData[item.property.split(',')[0]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"
                        @change="(string)=>changeTextRange(string,index,item.property)"></el-input>
              <span v-if="item.filterType==='textRange'" v-show="item.property.includes(',')">至</span>
              <el-input clearable v-model="queryModuleData[item.property.split(',')[1]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"></el-input>
              <DataPicker class="DataPicker" v-if="item.filterType==='date'" v-model="queryModuleData[item.property]"></DataPicker>
              <!--<el-date-picker v-if="item.filterType==='date'" v-model="queryModuleData[item.property.split(',')[0]]" type="date" placeholder="开始日期">-->
              <!--</el-date-picker>-->
              <!--<span v-if="item.filterType==='date'" v-show="item.property.includes(',')">至</span>-->
              <!--<el-date-picker v-if="item.filterType==='date'" v-show="item.property.includes(',')" v-model="queryModuleData[item.property.split(',')[1]]" type="date" placeholder="结束日期">-->
              <!--</el-date-picker>-->
              <el-multi-cascader
                ref="multiCascader"
                :class="item.property"
                v-if="item.filterType==='cascader'"
                :show-all-levels="false"
                :options="item.values"
                multiple
                filterable
                clearable
                :props="item.propsValue"
                change-on-select
                selectChildren
                v-model="queryModuleData[item.property]"> </el-multi-cascader>
              <el-autocomplete
                v-if="item.filterType==='autocomplete'"
                v-model="queryModuleData[item.property]"
                :fetch-suggestions="(queryString,cb)=>querySearchAsync(queryString, index, item.property, item.filterName,cb)"
                placeholder="请输入内容"
                clearable
                filterable
                :popper-append-to-body="false"
              >
                <template slot-scope="{ item }">
                  <div class="name_wrap" :class="item.id==-1?'firstName_wrap':''">
                    <el-tooltip  class="item" effect="light" :content="item.value" placement="top">
                      <div  :class="item.id==-1?'name0':'name'">{{ item.value }}</div>
                    </el-tooltip>
                    <el-tooltip  class="item" effect="light" :content="item.value1" placement="top">
                      <div :class="item.id==-1?'name0':'name'">{{ item.value1 }}</div>
                    </el-tooltip>
                    <el-tooltip  class="item" effect="light" :content="item.value2" placement="top">
                      <div  :class="item.id==-1?'name0':'name'">{{ item.value2 }}</div>
                    </el-tooltip>
                    <el-tooltip  class="item" effect="light" :content="item.value3" placement="top">
                      <div :class="item.id==-1?'name0':'name'">{{ item.value3 }}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-autocomplete>
              <!--                  <el-cascader :change-on-select="true" :show-all-levels="false" v-if="item.filterType==='cascader'" collapse-tags filterable clearable v-model="queryModuleData[item.property]"-->
              <!--                               :options="item.values" :props="defaultParams" placeholder="请选择"></el-cascader>-->
            </el-form-item>
            <!--        <el-form-item-->
            <!--          :label="item.filterName+':'"-->
            <!--          v-for="(item,index) in conditionsModuleList" :key="index">-->
            <!--          <el-input type="text" v-model="queryModuleData[item.property]"></el-input>-->
            <!--        </el-form-item>-->
          </el-form>

          <div>总计:{{total}}</div>

          <div  class="flexAble">
            <div class="YChat_wrap" v-for="itm in tongJiGOutlineList">
              <YChat class="YChat" @getParams="getParams" v-if="itm.chartType=='pie'"  :type="itm.chartType" :options="itm" />
              <YChat class="YChat" @getParams="getParams" v-else :type="itm.chartType=='pie'?'pie':'axis'" :options="itm" />
              <chatTable class="chatTable"  :tableData="itm.tableData"></chatTable>
            </div>
          </div>

          <div class="flexAble">
            <el-card class="box-card" v-for="item in data['1']">
              <div slot="header" class="clearfix">
                <span>{{item.caseType}} ({{item.number}})</span>
                <!--              <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
              </div>
              <el-button  size="mini"  @click="takeCaseTypeModelDetail(item)">查看</el-button>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="专利" name="2"></el-tab-pane>
        <el-tab-pane label="诉讼" name="3"></el-tab-pane>
        <el-tab-pane label="待定" name="4"></el-tab-pane>
      </el-tabs>
    <el-dialog
      center
      top="0"
      :visible.sync="uploadProofreadingState"
      width="80%"
      :close-on-click-modal="false"
      :modal="false"
      :close-on-press-escape="false"
      v-dialogDrag
    >
      <search v-if="uploadProofreadingState" :queryData="queryData"></search>
          </el-dialog>
  </div>
</template>

<script>
  import search from '@/views/workbench/knowledgeBase/search/index.vue'
  import { queryCustomerNameId,} from "@/api/caseList.js";
  import { queryAllUrl } from "@/api/applicant";
  import { queryActivityListflUrl,querylyctListUrl } from "@/api/customerList";
  import qs from 'qs'
  import YChat from "@/views/workbench/platformData/companyDashboard/components/YChat.vue";
  import chatTable from './components/chatTable'
import { queryPropertyList ,queryCaseTypeList,queryTongJiGOutline,queryUpdateDate,queryFilterConfig} from '@/api/knowledgeBase'
export default {
  name: "caseTypeModel",
  data() {
    return {
      activeName:'1',
      data:{},
      createDate:'',
      tongJiGOutlineList:[],
      queryModuleData:{},
      conditionsModuleList:[],
      uploadProofreadingState:false,
      queryData:{}
    }
  },
  created() {
    this.queryCaseTypeList()
  },

  methods:{
    clearSearch() {
      for (var key in this.queryModuleData) {
        if(key.includes('Date')){
          this.$set(this.queryModuleData,key,['',''])
        } else if(key.includes('Array')) {
          this.$set(this.queryModuleData,key,[])
        }else if(key==='caseTypeIds'||key==='deptGroupIds'){
          this.$set(this.queryModuleData,key,[])
        }else{
          this.$set(this.queryModuleData,key,null)
        }
      }
    },
    takeCaseTypeModelDetail(item){
      item.pageId=2
      let href=`#/workbench/knowledgeBase/statistics/caseTypeModelDetail?${qs.stringify(item)}`
      window.open(href, '_blank');
      // this.$router.push({path:'caseTypeModelDetail',query:item})
    },
    handleClick(e){
      this.queryCaseTypeList()
    },
    getParams(params){
      this.queryData={
  [params.data.queryProperty]:params.data.name,
  scId:1,
  tokenID:this.$store.getters.token
}
      this.uploadProofreadingState=true
    },
    getAppTitleList(filterName, valueList0) {
      if (filterName === "申请人") {
        return {
          id: "-1",
          value: "申请人中文名称",
          value1: "申请人英文名称",
          value2: "申请人中文地址",
          value3: "申请人英文地址",
          // disabled:true
        };
      }
      if (filterName === "被申请人") {
        return {
          id: "-1",
          value: "中文名称",
          value1: "英文名称",
          value2: "中文地址",
          value3: "英文地址"
        };
      }
      if (filterName === "转让人") {
        return {
          id: "-1",
          value: "转让人中文名称",
          value1: "转让人英文名称",
          value2: "转让人中文地址",
          value3: "转让人英文地址"
        };

      }
      if (filterName === "客户") {
        return {
          id: "-1",
          value: "全称",
          value1: "国籍",
          value2: "简称",
        };

      }
      return valueList0;
    },
    remoteMethod(value, index, property, filterName) {
      if (value && filterName === "客户") {
        queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value }).then(
          res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({ id: item.fullname, value:item.fullname,value1:item.country,value2:item.name}))
            );
            this.$forceUpdate();
          }
        );
      }
      if (value && ["申请人",  "转让人"].includes(filterName)) {
        queryAllUrl({
          applicantName: value,
          pageNo: 1,
          pageSize: 100,
          orderBy:1
        }).then(res => {
          this.$set(
            this.conditionsModuleList[index],
            "valueList",
            res.data.map(item => ({
              id: item.applicantName,
              value: item.applicantName,
              value1: item.applicantEnName,
              value2: item.applicantAddress,
              value3: item.applicantEnAddress
            }))
          );
          this.$forceUpdate();
        });
        if (value && ["被申请人"].includes(filterName)) {
          querylyctListUrl({
            fullname: value,
            pageNo: 1,
            pageSize: 100
          }).then(res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({
                id: item.fullname,
                value: item.fullname,
                value1: item.fullnameEn,
                value2: item.address,
                value3: item.addressEn
              }))
            );
            this.$forceUpdate();
          });
        }
        // "",
        // console.log(this.conditionsModuleList[index]['valueList']);

        // this.$set(
        //   this.conditionsModuleList[index],
        //   "valueList",
        //   this.conditionsModuleList[index].values
        //     .filter(item => {
        //       for (let key in item) {
        //         if (
        //           item[key] &&
        //           item[key]
        //             .toLocaleUpperCase()
        //             .includes(value.toLocaleUpperCase())
        //         ) {
        //           return true;
        //         }
        //       }
        //       return false;
        //     })
        //     .slice(0, 100)
        // );
      }
      if (
        value &&
        filterName !== "客户" &&
        !["申请人", "被申请人", "转让人"].includes(filterName)
      ) {
        this.$set(
          this.conditionsModuleList[index],
          "valueList",
          this.conditionsModuleList[index].values
            .filter(item =>
              item.value
                ? item.value
                  .toLocaleUpperCase()
                  .includes(value.toLocaleUpperCase())
                : false
            )
            .slice(0, 100)
        );
        this.$forceUpdate();
      }
    },
    querySearchAsync(value, index, property, filterName,cb){
      if (value && ["被申请人",'申请人'].includes(filterName)) {
        Promise.all([ querylyctListUrl({
          fullname: value,
          pageNo: 1,
          pageSize: 50,
          isCustomer:1
        }), queryAllUrl({
          applicantName: value,
          pageNo: 1,
          pageSize: 50,
          orderBy:1
        })]).then((res=>{
          let list1 = res[0].data.map(item => ({
            id: item.fullname,
            value: item.fullname,
            value1: item.fullnameEn,
            value2: item.address,
            value3: item.addressEn
          }))
          let list2= res[1].data.map(item => ({
            id: item.applicantName,
            value: item.applicantName,
            value1: item.applicantEnName,
            value2: item.applicantAddress,
            value3: item.applicantEnAddress
          }))
          cb([...[this.getAppTitleList(filterName)],...list1,...list2])
        }))
      }
      if (value && ["客户"].includes(filterName)) {
        queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value }).then(
          res => {
            let list = res.data.map(item => ({ id: item.custId, value:item.fullname,value1:item.country,value2:item.name}))
            cb([...[this.getAppTitleList(filterName)],...list])
            this.$forceUpdate();
          });
      }
      cb([])
    },
    queryCaseTypeList(){
      queryFilterConfig(Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},{scId:999})).then(res=>{
        this.conditionsModuleList=res.data
      })
      queryCaseTypeList(Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},{domainId:this.activeName},this.queryModuleData)).then(res=>{
        this.$set(this.data,this.activeName,res.data)
        // this.data[this.activeName]=res.data
      })
      queryTongJiGOutline(Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},{domainId:this.activeName},this.queryModuleData)).then(res=>{

        res.data.forEach(item=>{
          if(item.chartType=='pie'){
            item.dimensional=2
          }
//           if(item.title=='历年数量'){
// item.series=item.series.map(i=>({data :i.data.map(ii=>({value:ii,prop:'win'})),name:i.name}))
//           }
        })
        this.createDate= res.message
        this.tongJiGOutlineList=res.data
        console.log(this.tongJiGOutlineList);
      })
      // queryUpdateDate(Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},{domainId:this.activeName})).then(res=>[
      //   this.createDate=res.data.createDate
      // ])
    }
  },
  computed:{
    total(){
      if(this.data[this.activeName]){
        return this.data[this.activeName].reduce((pre,next)=>pre+next.number,0)
      } else {
        return 0
      }
    }
  },
  components:{
    YChat,
    chatTable,
    search
  }
}
</script>

<style lang="scss" scoped>
  .caseType{
line-height: 30px;
  }
  .flexAble{
    display: flex;
    flex-wrap:wrap ;
    /*justify-content: space-between;*/
    /*justify-content: space-around;*/
    .box-card{
      width: 22%;
      margin: 10px 20px 0 0;
      /deep/.el-card__body{
        overflow: hidden;
      }
      .el-button{
        float: right;
      }
    }
  }
 .YChat_wrap{
    width: 100%;
    display: flex;
   margin-bottom: 20px;
   .YChat{
     width:600px;
     margin-right: 20px;

   }
   .chatTable{
     flex: 1;
   }
  }
  .SearchTitle{
    /*background-color: rgba(6,8,17, 0.2);*/
    border-bottom: 1px solid rgba(202,202,202, 0.2);
    .SearchTitle_wrap /deep/{
      width: 700px;
      margin: 0 auto;
      padding: 0 140px 20px;
      border: 1px solid #c9c9c9;
      box-sizing: content-box;
      .el-input-group{
        width: 0;
        flex: 1;
      }
      .el-tabs__content{
        overflow: visible;

        .el-tab-pane{
          display: flex;
        }
      }
    }
    .searchWrap /deep/ {
      .search_input{
        border: 1px solid #c9c9c9;
      }
      .el-form-item {
        display: flex;
      }

      .el-form-item__content {
        flex: 1;
        display: flex;

        /*.el-input{*/
        /*  line-height: 28px;*/
        /*}*/
      }

    }
    .select_warp{
      border: 1px solid #c0c4cc;
      border-bottom:0 ;
      position: absolute;
      border-radius: 4px;

      left: 0;
      /*top: 0;*/
      width: 100%;
      background: #ffffff;

      .select_item{
        padding: 0 15px;
        box-sizing: border-box;
        border-bottom:1px solid #c0c4cc ;
      }
    }
  }

  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
    .el-select .el-input {
      width: 130px;
      color: #333;
    }
  }
  /deep/ .name_wrap{
    display: flex;
    .name{
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-right:1px solid #2b2f3a;
      border-bottom:1px solid #2b2f3a;
    }
    .name0{
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      /*text-overflow: ellipsis;*/
      border-right:1px solid #2b2f3a;
      border-bottom:1px solid #2b2f3a;
    }
  }
  /deep/.firstName_wrap{
    cursor: not-allowed;
    background: #c9c9c9;
  }

  /deep/  .form-container.el-form {
    padding-bottom: 10px;
display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 50%;
    }
    .el-form-item__label {
      text-align: left;
      padding-left: 32px;
      font-weight: normal;
    }

    .el-form-item__content {
      .el-autocomplete,.el-select,.datePickerWrap,.el-input{
        width: 80%;
      }
      input {
        border-top: 0;
        border-left: 0;
        border-radius: 0;
        border-right: 0
      }
    }
  }
  .el-scrollbar li {
    display: flex;
    span {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      border-right: 1px solid #f4f4f5;
      border-bottom: 1px solid #f4f4f5;
    }
  }
  .el-transfer {
    display: flex;

    /deep/ & > .el-transfer-panel {
      flex: 1;
    }

    /deep/ .el-transfer__buttons {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    /deep/ .el-transfer-panel__list {
      display: flex;
      flex-wrap: wrap;
      label {
        width: 33.3%;
        margin-right: 0;
      }
    }
  }
  /deep/ .el-dialog__header{
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .DataPicker{
    line-height: 28px;
  }
</style>
