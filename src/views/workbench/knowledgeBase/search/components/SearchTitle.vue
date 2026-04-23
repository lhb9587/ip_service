<template>
  <div class="SearchTitle">
    <div class="SearchTitle_wrap">
    <el-tabs v-model="activeName" >
      <el-tab-pane v-for="(item,index) in $store.state.knowledgeBase.docStructure" :label="item.stName" :name="String(index)">
<!--        <div class="searchWrap">-->
<!--          <div style="position: relative">-->
<!--            <input type="text" v-model="value" @focus="item.selectState=true">-->
<!--            <div class="select_warp" v-show="item.selectState">-->
<!--              <div  class="select_item" v-for="itm in ['全库检索','商标','专利']" @click="value=itm;item.selectState=false">{{itm}}</div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <el-input v-model="item.keywords"></el-input><el-button type="primary">搜索</el-button>-->
<!--        </div>-->
        <el-input @keyup.enter.native="queryDocList(0,item.keyword,item.searchType)" placeholder="请输入内容" v-model="item.keyword" class="input-with-select">
          <el-select v-model="item.searchType" slot="prepend" placeholder="请选择">
            <el-option :label="itm.className" :value="itm.scId" v-for="itm in item.scList"></el-option>
          </el-select>
        </el-input>
        <el-button type="primary" @click="queryDocList(0,item.keyword,item.searchType)">搜索</el-button>
        <el-button type="primary" @click="handleHeightSearch(item.searchType,item.stId,item.keyword)">高级搜索</el-button>
<!--        <div slot="append">-->
<!--          -->
<!--        </div>-->
<!--        <el-form class="searchWrap" >-->
<!--          <el-form-item label="全文检索" >-->
<!--            <div style="position: relative" >-->
<!--              <el-input class="serch_input" type="text"  v-model="value" @focus="item.selectState=true" readonly="readonly"/>-->
<!--              <div class="select_warp" v-show="item.selectState">-->
<!--               <div  class="select_item" v-for="itm in item.scList" @click="value=itm;item.selectState=false">{{itm.className}}</div>-->
<!--              </div>-->
<!--            </div>-->
<!--            <el-input v-model="item.keywords"></el-input><el-button type="primary">搜索</el-button>-->
<!--            <el-button type="primary" @click="handleHeightSearch">高级搜索</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
      </el-tab-pane>
    </el-tabs>
    </div>
    <el-dialog
      title="高级搜索"
      :visible.sync="dialogVisible"
      width="60%"
      append-to-body
      >
      <el-button style="float: right" type="text" size="small"  @click="queryFilter(scId)"><i class="el-icon-s-tools"></i>更多</el-button>
      <el-form size="mini" label-width="120px" class="form-container"  style="margin-top: 2px;height: 300px;overflow: auto"  >
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
          <el-select v-if="item.filterType==='selectTableMany'" v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
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
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" :key="key" v-if="key!='id'">
            {{itmx}}
            </span>
            </el-option>
            <el-option v-for="itm,idx in item['valueList']" :key="idx" :label="itm.value" :value="itm.id">
              <el-tooltip v-for="itmx,key in item['valueList'][idx]" :key="key" v-if="key!='id'" class="item" effect="light" :content="itmx" placement="top">
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
            @select="selectedItem=>handleAutocompleteSelect(selectedItem, item.property, item.filterName)"
            placeholder="请输入内容"
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
          <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="reset">重 置</el-button>
        <el-button type="primary" @click="handleSearch">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog  append-to-body title="提示" :visible.sync="transferVisible" width="80%" >
      <el-transfer v-model="transferValue" @left-check-change="leftCheckChange" :key="transferData.filterId" :data="transferData" filterable filter-placeholder="请输入搜索内容"
                   :titles="['选择筛选项—全部案件', '已选']">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="configFilter(scId)">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import {queryFilter,queryFilterConfig,queryDocList,configFilter,queryCdResult} from '@/api/knowledgeBase.js'
  import { queryCustomerNameId,
  } from "@/api/caseList.js";
  import { queryAllUrl } from "@/api/applicant";
  import { queryActivityListflUrl,querylyctListUrl } from "@/api/customerList";
  import qs from 'qs'
  import {mapState} from "vuex";
  export default {
    name: "SearchTitle",
    props:{
      queryData:{}
    },
    data(){
      return{
        activeName:this.$store.state.knowledgeBase.activeName,
        value:'全库检索',
        pageList:[{label:'裁判文书',name:'1',keywords:'',prop:'lay',selectState:false}],
        dialogVisible:false,
        preferenceList:[],
        conditionsModuleList:[],
        queryModuleData:{},
        defaultParams:{
          value: "caseTypeId",
          label: "caseType",
          children: "childrens",
          checkStrictly: true,
          multiple: true
        },
        transferVisible:false,
        transferData: [], // 筛选条件数据
        transferValue: [], // 当前筛选条件id
      }
    },
    created() {

    },
    watch:{
      activeName(n,o){

        this.$store.commit('knowledgeBase/SET_ACTIVENAME',n)
      },
      'stateActiveName'(n,o){
        this.activeName=n
        this.queryModuleData={}
        let item=this.$store.state.knowledgeBase.docStructure[n]
        this.queryFilterConfig(item.searchType,item.stId)
      },
      'queryModuleData.caseTypeArray'(n,o){
        this.queryCdResult(n)
      }
    },
    computed:{
      ...mapState({
        'stateActiveName': state => state.knowledgeBase.activeName,
      })
    },
    methods:{
      leftCheckChange() {},
      handleAutocompleteSelect(selectedItem, property, filterName) {
        if (!selectedItem || selectedItem.id === "-1") {
          this.$set(this.queryModuleData, property, "");
          return;
        }
        const selectedValue = filterName === "客户"
          ? (selectedItem.value2 || selectedItem.value)
          : selectedItem.value;
        this.$set(this.queryModuleData, property, selectedValue);
      },
      handleSearch(){
       this.queryDocList(1)
        this.dialogVisible=false
        // queryDocList(data).then(res=>{
        //   this.$store.commit('knowledgeBase/SET_CURLIST',res.data)
        // })
      },
      configFilter(searchType) {
        const data = {
          scId:searchType,
          filterIds: this.transferValue.join(",")
        };
        configFilter(Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},data)).then(res => {
          this.queryFilterConfig(searchType);
        });
      },
      queryCdResult(caseType){
        queryCdResult({caseType}).then(res=>{
          let data=this.conditionsModuleList.find(item=>item.property=='cdResult')
          if(data){
            res.data.forEach(item=>item.value=item.name)
            this.$set(data,'values',res.data)
          }

        })

      },
      queryFilter(searchType) {
        this.transferVisible = true;
        const data = {
          scId:searchType
        };
        queryFilter(Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},data)).then(res => {
          this.transferData = this.generateData(res.data);
        });
      },
      generateData(arr) {
        arr.forEach(item => {
          item.key = item.filterId;
          item.label = item.filterName;
        });
        return arr;
      },
      reset(){
        for (var key in this.queryModuleData) {
            if(key.includes('Date')){
              // this.$set(this.queryModuleData,key,['',''])
              this.$set(this.queryModuleData,key,[])
            } else if(key.includes('Array')) {
              this.$set(this.queryModuleData,key,[])
            }else if(key==='caseTypeIds'||key==='deptGroupIds'){
              this.$set(this.queryModuleData,key,[])
            }else{
              this.$set(this.queryModuleData,key,null)
            }

        }
        if(this.$refs.multiCascader){
          this.$refs.multiCascader.forEach(item=>{
            item.$el.querySelector('.el-input__inner').value=''
          })
        }
        this.handleSearch()
      },
      changeTextRange(value, property) {
        this.$set(this.queryModuleData, property, value);
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
            value: "简称",
            value1: "国籍",
            value2: "全称",
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
                res.data.map(item => ({ id: item.custId, value:item.name,value1:item.country,value2:item.fullname}))
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
              let list = res.data.map(item => ({ id: item.custId, value:item.name,value1:item.country,value2:item.fullname}))
              cb([...[this.getAppTitleList(filterName)],...list])
              this.$forceUpdate();
            });
        }
        cb([])
      },
      queryDocList(flag,keyword,scId){
        let data
        if(flag){
          data=Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},this.queryModuleData,{keyword:this.keyword,scId:this.scId})
        }else{
          if(!keyword){
            this.$message.error('请输入搜索条件')
            return
          }
           data=Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},{keyword,scId},this.queryModuleData)
        }
        // if(!data.keyword){
        //   delete data.scId
        // }
        if(this.$route.query.tokenID){
          // this.$emit('updataDataStore',data)
          this.$router.push({query:data})
        }else {
          if(this.queryData){
            this.$emit('updataDataStore',data)
          }else {
            let href=`#/workbench/knowledgeBase?${qs.stringify(data)}`
            window.open(href, '_blank');
          }

        }

        // window.open('#/workbench/knowledgeBase')
        // this.$store.commit('knowledgeBase/SET_FILTERDATA',data)
        // queryDocList(data).then(res=>{
        //   this.$store.commit('knowledgeBase/SET_CURLIST',res.data)
        // })
      },
      handleHeightSearch(searchType,stId,keyword){
        this.keyword=keyword
        this.scId=searchType
        this.dialogVisible = true
        this.queryFilterConfig(searchType,stId)
      },
       queryFilterConfig(searchType,stId){
         this.conditionsModuleList=[]
        queryFilterConfig(Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},{scId:searchType})).then(res=>{
          this.transferValue = res.data.map(item => item.filterId);
          this.conditionsModuleList=res.data
          this.$commonUtils.saveFilterModel('filterType','filterType',this.conditionsModuleList)
          this.transferVisible = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
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
</style>
