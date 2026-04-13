<template>
  <div>
    <el-popover
      placement="bottom-start"
      width="300"
      height="600"
      trigger="click"  v-if="filterType=='select'"  v-model="hiddenState">
      <el-select  ref="myDom" v-model="newlovingVue" placeholder="请选择"  filterable  clearable>
        <el-option v-for="itm in values" :key="itm.id" :label="itm.value" :value="itm.id">
        </el-option>
      </el-select>
      <label class="label"  slot="reference" ><span>{{filterName}}:</span> <div :title="textConent">{{textConent=(values&&values.length&&newlovingVue?values.find(item=>item.id===newlovingVue).value:defaultValue)}}<i  class="el-icon-close" @click.stop="close"></i></div></label>
    </el-popover>
    <el-popover
      placement="bottom-start"
      width="300"
      trigger="click"  v-if="filterType=='checkbox'" v-model="hiddenState">
      <el-select ref="myDom"  v-model="newlovingVue" multiple  placeholder="请选择"  filterable  clearable @change="(e)=>checkBox(e,values)">
        <el-option v-for="itm in values" :key="itm.id" :label="itm.value" :value="itm.id">
        </el-option>
      </el-select>
      <label class="label" slot="reference" ><span>{{filterName}}:</span><div>{{newlovingVue&&newlovingVue.length?newlovingVue.map(item=>values.find(i=>i.id==item).value).join(','):defaultValue}}<i  class="el-icon-close" @click.stop="close"></i></div></label>
    </el-popover>
    <el-popover
      placement="bottom-start"
      width="300"
      trigger="click"  v-if="filterType=='selectMany'"  v-model="hiddenState">
      <el-select ref="myDom"  v-model="newlovingVue" filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
        remoteMethod(queryString,filterName);
        }">
        <el-option v-for="itm in valueList" :key="itm.id" :label="itm.value" :value="itm.id">
        </el-option>
        </el-select>
       <label class="label" slot="reference" ><span>{{filterName}}:</span><div :title="textConent">{{textConent=(valueList.length&&newlovingVue?valueList.find(item=>item.id===newlovingVue).value:defaultValue)}}<i  class="el-icon-close" @click.stop="close"></i></div></label>
    </el-popover>
    <el-popover
      placement="bottom-start"
      width="300"
      trigger="click"  v-if="filterType=='selectTableMany'"  v-model="hiddenState">
      <el-select ref="myDom" v-model="newlovingVue" filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
      remoteMethod(queryString,filterName); }">
      <el-option disabled label="" value="">
        <span v-for="(itmx,key) in getAppTitleList(filterName)" v-if="key!='id'">
        {{itmx}}
       </span>
      </el-option>
       <el-option v-for="itm,idx in valueList" :key="itm.id" :label="itm.value" :value="itm.id">
       <el-tooltip v-for="itmx,key in valueList[idx]" v-if="key!='id'" class="item" effect="light" :content="itmx" placement="top">
       <span>{{itmx}}</span>
       </el-tooltip>
       </el-option>
      </el-select>
      <label class="label" slot="reference" ><span>{{filterName}}:</span> <div :title="textConent">{{textConent=(valueList.length&&newlovingVue?valueList.find(item=>item.id===newlovingVue).value:defaultValue)}}<i  class="el-icon-close" @click.stop="close"></i></div></label>
    </el-popover>
    <el-popover
      placement="bottom-start"
      width="300"
      trigger="click" ref="myDom" v-if="filterType=='selectTable'" v-model="hiddenState">
      <el-select  v-model="newlovingVue" filterable clearable placeholder="请选择">
        <el-option v-for="itm ,idx in values" :key="idx" :label="itm.value" :value="itm.id" :disabled="itm.id==-1">
           <span v-for="itmx ,key in values[idx]" v-if="key!='id'">{{itmx}}</span>
        </el-option>
      </el-select>
      <label class="label" slot="reference" ><span>{{filterName}}:</span> <div :title="textConent">{{textConent=(newlovingVue&&newlovingVue.length?newlovingVue.map(item=>values.find(i=>i.id==item).value).join(','):defaultValue)}}<i  class="el-icon-close" @click.stop="close"></i></div></label>
    </el-popover>
    <label class="label"  v-if="filterType==='radio'">
      <span>
      {{filterName}}:
      </span>
      <div style="border: 0">
        <el-radio-group v-model="newlovingVue">
        <el-radio :label="itm.id" v-for="(itm,index) in values" :key="index">{{itm.value}}</el-radio>
        </el-radio-group>
      </div>
    </label>
    <el-popover
      placement="bottom-start"
      width="300"
      trigger="click"    v-if="filterType=='text'" v-model="hiddenState">
      <el-input ref="myDom" clearable v-model="newlovingVue" :placeholder="'请输入'+filterName" ></el-input>
      <label class="label" slot="reference" ><span>{{filterName}}:</span> <div :title="newlovingVue">{{newlovingVue?newlovingVue:defaultValue}}<i  class="el-icon-close" @click.stop="close"></i></div></label>
    </el-popover>

    <el-popover
      placement="bottom-start"
      width="400"
      trigger="click"  v-if="filterType=='date'" v-model="hiddenState">
      <DataPicker ref="myDom" clearable v-model="newlovingVue"></DataPicker>
      <label class="label" slot="reference" ><span>{{filterName}}:</span> <div :title="textConent">{{textConent=(newlovingVue&&newlovingVue.length&&newlovingVue.filter(item=>item).length?newlovingVue.join(','):defaultValue)}}<i  class="el-icon-close" @click.stop="close"></i></div></label>
    </el-popover>
    <el-popover
      placement="bottom-start"
      width="400"
      trigger="click"  v-if="filterType=='textRange'"  v-model="hiddenState">
      <div class="input_warp">
        <el-input ref="myDom"  clearable v-model="newlovingVue" :placeholder="'请输入'+filterName"
                  @change="(string)=>changeTextRange(string)"></el-input>
        <span >至</span>
        <el-input clearable v-model="newlovingVue1" :placeholder="'请输入'+filterName"></el-input>
      </div>
      <label class="label" slot="reference" >
        <span>{{filterName}}:</span>
        <div :title="newlovingVue+'-'+newlovingVue1" v-if="newlovingVue||newlovingVue1">{{newlovingVue?newlovingVue+'-':''}}{{newlovingVue1}}<i  class="el-icon-close" @click.stop="close"></i></div>
        <div :title="defaultValue" v-else>{{defaultValue}}</div>
      </label>
    </el-popover>
    <!--<el-date-picker v-if="filterType==='date'" v-model="queryModuleData[item.property.split(',')[0]]" type="date" placeholder="开始日期">-->
    <!--</el-date-picker>-->
    <!--<span v-if="filterType==='date'" v-show="item.property.includes(',')">至</span>-->
    <!--<el-date-picker v-if="item.filterType==='date'" v-show="item.property.includes(',')" v-model="queryModuleData[item.property.split(',')[1]]" type="date" placeholder="结束日期">-->
    <!--</el-date-picker>-->
    <el-popover
      placement="bottom-start"
      width="300"
      trigger="click"  v-if="filterType=='cascader'" v-model="hiddenState">
      <el-cascader ref="myDom" :change-on-select="true" :show-all-levels="false" collapse-tags filterable clearable v-model="newlovingVue"
      :options="values.filter(item=>item.caseType==='商标')" :props="defaultParams" placeholder="请选择"></el-cascader>
      <label class="label" slot="reference" ><span>{{filterName}}:</span> <div :title="textConent">{{textConent=(newlovingVue&&newlovingVue.length?getMenuName(values).find(item=>item.caseTypeId==newlovingVue[newlovingVue.length-1]).caseType:defaultValue)}}<i  class="el-icon-close" @click.stop="close"></i></div></label>
    </el-popover>

  </div>
</template>

<script>
import { queryAllUrl } from "@/api/applicant";
import { queryCustomerNameId } from "@/api/caseList.js";
import {getMenuName } from '@/utils'
export default {
  props:{
    lovingVue:{

    },
    filterType:{

    },
    values:{

    },
    filterName:{

    }
  },
  model:{
    prop: 'lovingVue',
    event: 'change'
  },
  name: "index",
  data(){
    return{
      hiddenState:false,
      textConent:'',
      newlovingVue: this.lovingVue,
      defaultParams:{
        value: "caseTypeId",
        label: "caseType",
        children: "childrens",
        checkStrictly: true,
        multiple: true
      },
      valueList:[],
      newlovingVue1:'',
      defaultValue:'全部'
    }
  },
  watch:{
    hiddenState(n){
      if(n){
        this.$nextTick(()=>{
          if(this.$refs.myDom.focus){
            this.$refs.myDom.focus()
          }else {
            this.$refs.myDom.$el.click()
          }
        })
      }
    },
    newlovingVue: function(newVal,oldVal){
      if(this.filterType=='textRange'){
        this.newlovingVue1 = newVal
      }
      this.$emit('change',newVal)
    },
    lovingVue(n){
      this.newlovingVue= n
    },
    newlovingVue1(){
      this.$emit('changeNewlovingVue1',[this.newlovingVue,this.newlovingVue1])
    },
  },
  methods:{
    close(){
      if(this.filterType=='date'||this.filterType=='cascader'){
        this.newlovingVue=[]
      }else {
        this.newlovingVue=null
      }

    },
    checkBox(e,values){
      if(this.newlovingVue.includes('')&&this.newlovingVue.filter(item=>item).length!=values.filter(item=>item).length){
        this.newlovingVue=this.newlovingVue.filter(item=>item)
      }
      if(e[e.length-1]==''){
        this.newlovingVue=values.map(item=>item.id)
      }
    },
    remoteMethod(value, filterName) {
      if (value && filterName === "客户") {
        queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value }).then(res => {
          this.valueList=res.data.map(item => ({ id: item.custId, value: item.name }))
          this.$forceUpdate();
        });
      }
      if (value && ["申请人姓名", "被申请人", "转让人"].includes(filterName)) {
        queryAllUrl({
          applicantName: value,
          pageNo: 1,
          pageSize: 100
        }).then(res => {
          this.valueList= res.data.map(item => ({
            id: item.applicantName,
            value: item.applicantName,
            value1: item.applicantEnName,
            value2: item.applicantAddress,
            value3: item.applicantEnAddress
          }))
          this.$forceUpdate();
        });

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
        !["申请人姓名", "被申请人", "转让人"].includes(filterName)
      ) {
        this.valueList=this.values.filter(item => item.value ? item.value.toLocaleUpperCase().includes(value.toLocaleUpperCase()) : false).slice(0, 100)
      }
    },
    getAppTitleList(filterName, valueList0) {
      if (filterName === "申请人姓名") {
        return {
          id: "-1",
          value: "申请人中文名称",
          value1: "申请人英文名称",
          value2: "申请人中文地址",
          value3: "申请人英文地址"
        };
      }
      if (filterName === "被申请人") {
        return {
          id: "-1",
          value: "被申请人中文名称",
          value1: "被申请人英文名称",
          value2: "被申请人中文地址",
          value3: "被申请人英文地址"
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
      return valueList0;
    },
    getMenuName(values){
      return getMenuName(values)
    },
    changeTextRange(value) {
      this.newlovingVue1 = value

    },
  }
}
</script>

<style lang="scss" scoped>
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
  label.label{
    width: 100%;
    /*display: flex;*/
    height: 28px;
    font-size: 16px;
    font-weight: normal;
    line-height: 20px;
    margin-left: 120px;
    position: relative;
    span{
      padding-left: 10px;
      width: 120px;
      text-align: right;
      margin-right: 10px;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      font-family: "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
      font-size: 14px;
      color: #606266;
      font-weight:bold ;
      line-height: 28px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      float: left;
      position: absolute;
      top: -10px;
      left: -133px;
    }
    &>div{
      position: relative;
      z-index: 1;
      cursor: pointer;
      /*flex: 1;*/
      border:1px solid rgba(185, 188, 196, 1);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      -webkit-appearance: none;
      background-color: #fff;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #606266;
      display: inline-block;
      height: 28px;
      line-height: 28px;
      outline: 0;
      padding: 0 15px;
      -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      width: 65%;
      font-size: 14px;
    }
  }
  .input_warp{
    display: flex;
    line-height: 32px;
  }
  .el-icon-close{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    padding-right: 10px;
    right: 0;
  }
</style>
