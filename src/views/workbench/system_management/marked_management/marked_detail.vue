<template>
    <div class="department_modify">
        <h2 class="department_header">{{$route.meta.title}}</h2>
      <div class="modify">


        <el-table>
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <table class="departmentDetail">
                <tr>
                  <td>费用种类</td>
                  <td><el-select v-model="submitData.chargeType" placeholder="请选择" class="postInfo-container-item">
                    <el-option
                      v-for="item in costs"
                      :key="item.value3"
                      :label="item.label3"
                      :value="item.value3">
                    </el-option>
                  </el-select></td>
                </tr>
                  <tr>
                    <td>适用的案件类型</td>
                    <td>
                        <el-cascader  ref="multiCascader"
                        :show-all-levels="false"
                        :options="$store.state.caseInformation.caseTypeList"
                        filterable
                        clearable
                        :props="defaultParams"
                        change-on-select
                        selectChildren
                        v-model="caseTypeIds"
                        style="left: 10px;"
                        ></el-cascader>
                    </td>
                  </tr>
                <tr>
                  <td>费用名中文</td>
                  <td>
                    <el-input v-model="submitData.nameCn" placeholder=""></el-input>
                  </td>
                </tr>

                <tr>
                  <td>费用名英文</td>
                  <td>
                    <el-input v-model="submitData.nameEn" placeholder=""></el-input>
                  </td>
                </tr>
                <tr>
                  <td>费用名日文</td>
                  <td>
                    <el-input v-model="submitData.nameJp" placeholder=""></el-input>
                  </td>
                </tr>
                <tr>
                  <td>草单类型</td>
                  <td>
                    <!-- <el-select v-model="submitData.groupType" placeholder="" filterable clearable v-if="isBeforeData">
                      <el-option
                        v-for="item in billStyleList"
                        :key="item.billStyle"
                        :label="item.billStyleName"
                        :value="item.billStyle">
                      </el-option>
                    </el-select> -->
                    <el-cascader 
                      :show-all-levels="false"
                      :options="typeTreeList"
                      filterable
                      clearable
                      :props="billTypeProps"
                      change-on-select
                      selectChildren
                      v-model="groupTypeIds"
                      style="left: 10px;"
                      ></el-cascader>
                  </td>
                </tr>
                <!-- <tr>
                  <td>创建人</td>
                  <td>
                    <el-input v-model="submitData.createrStr" placeholder="" :disabled="true"></el-input>
                  </td>
                </tr> -->
              </table>
            </template>
          </el-table-column>
        </el-table>
      </div>
        <td style="color:cornflowerblue;font-size: 26px;font-weight: 600; margin-top: 20px;display: block;margin-bottom: 20px;float: left;">定价</td>
        <el-button class="exactButton" type="primary" @click="addCharge" style="float: right;margin-top: 15px;">新增</el-button>
        <el-table
          empty-text="暂无数据"
    :data="submitData.chargePrices"
    border
    style="width: 100%">
    <el-table-column
      prop="date"
      label="费用名中文">
      <template slot-scope="scope">
       <p>{{submitData.nameCn}}</p>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="申请方向">
      <template slot-scope="scope">
        <el-select v-model="scope.row.appFromto" placeholder="请选择" class="postInfo-container-item">
            <el-option
              v-for="item in options"
              :key="item.value1"
              :label="item.label1"
              :value="item.value1">
            </el-option>
          </el-select>
       </template>
    </el-table-column>
    <el-table-column
      prop="province"
      label="上报事项">
      <template slot-scope="scope">
        <el-select  default-first-option v-model="scope.row.reportMatter" placeholder="请选择" >
            <el-option
              v-for="item in reportMatterList"
              :key="item.id"
              :label="item.typeName"
              :value="item.typeName">
            </el-option>
          </el-select>
       </template>
    </el-table-column>
    <el-table-column
      prop="city"
      label="递交方式">
      <template slot-scope="scope">
        <el-select v-model="scope.row.onlineApp" placeholder="请选择" class="postInfo-container-item">
            <el-option
              v-for="item in submits"
              :key="item.value2"
              :label="item.label2"
              :value="item.value2">
            </el-option>
          </el-select>
       </template>
    </el-table-column>
    <el-table-column
      prop="patentType"
      label="专利类型">
      <template slot-scope="scope">
          <el-select v-model='scope.row.patentType'>
            <el-option v-for="item in [{label: '发明', id: 1296},{label: '实用新型', id: 1297},{label: '外观', id: 1298}]" :label="item.label" :value="item.label" :key="item.label"></el-option>
          </el-select>
       </template>
    </el-table-column>
    <el-table-column
      prop="yearNo"
      label="年号">
      <template slot-scope="scope">
        <el-input type="number" v-model="scope.row.yearNo"></el-input>
       </template>
    </el-table-column>
    <el-table-column
      prop="address"
      label="币种">
      <template slot-scope="scope">
        <!-- <el-input type="text" v-model="scope.row.curName" >

        </el-input> -->
          <el-select v-model='scope.row.curId'>
            <el-option v-for="item in queryCurrencyList" :label="item.curName" :value="item.curId" :key="item.curId"></el-option>
          </el-select>
       </template>
    </el-table-column>
    <el-table-column
      prop="zip"
      label="价格">
      <template slot-scope="scope">
        <el-input type="number" v-model="scope.row.price">

        </el-input>
       </template>
    </el-table-column>
    <el-table-column label="客户" align="left" width="200">
      <template slot-scope="scope">
        <el-select 
          v-model="scope.row.custIdList"
          placeholder="请输入关键词"
          filterable
          remote
          :remote-method="custRemoteMethod"
          multiple
          style="width: 100%;"
          clearable
        >
          <el-option
            v-for="item in custList"
            :key="item.custId"
            :label="item.name"
            :value="item.custId">
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="国家" align="left" width="200">
      <template slot-scope="scope">
        <el-select 
          v-model="scope.row.countryList"
          placeholder="请选择"
          filterable
          multiple
          style="width: 100%;"
          clearable
        >
          <el-option
            v-for="item in countryOptions"
            :key="item.countryCn"
            :label="item.countryCn"
            :value="item.countryCn">
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="创建人">
     <template slot-scope="scope">
       <span v-if="$route.query.type==1">
         {{name}}
       </span>
       <span v-if="$route.query.type==2">
        {{submitData.createrStr}}
       </span>
       </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="创建日期">
      <template slot-scope="scope">
       <span v-if="$route.query.type==1">

       </span>
      <span v-if="$route.query.type==2">
         {{gettime}}

       </span>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="confirm">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

        <div class="button_wrap">
          <el-button class="exactButton" type="primary" v-if="$route.query.type == '1'" @click="addChargeItemInfo" >确定</el-button>
          <el-button class="exactButton" type="primary" v-if="$route.query.type == '2'" @click="updateChargeItem" >修改</el-button>
          <el-button class="exactButton" plain @click="cancel">取消</el-button>
        </div>

      </div>
</template>

<script>

import getPageTitle from '@/utils/get-page-title'
import { querycustSelectClass } from '@/api/customerList.js'
import{queryCurrencyUrl, queryBillStyle} from "@/api/customerList";
import { queryCustomerNameId } from "@/api/caseList";
import { queryCountry } from '@/api/caseDetail'
import{ queryClassTree } from "@/api/billApi";
import {queryChargeItemInfo,createDept,queryDeptByCondition ,addChargeItemInfo,selectAllDept, updateDeptById,updateChargeItem} from '@/api/systemList.js'
export default{
    data(){
        return{
        billStyleList: [],
        message: '',
        moneyCh:'',
        moneyEn:'',
        cost:[],
        gettime:'',//当前时间
        tableData:[{}],
        superiorDepartments:[],//部门所属上级
        departmentName:'',//部门名称
        isactive:'1',//是否有效
        isbranch:'0',//是否是分公司
        companyName:'',//分公司全称
        companyShortName:'',//分公司简称
        departData:[],
        sendData: {},
        reportMatterList:[],//上报事项
        queryDeptByConditionList:[],
        nameList:[],
        companyShortNameList:[],
        companyNameList:[],
          caseTypeIds:[],
        name:this.$store.getters.name,
        defaultParams: {
            //級聯菜單默認
            value: "caseTypeId",
            label: "caseType",
            children: "childrens",
            checkStrictly: true,
            multiple: true
        },
        costs:[{
          value3:1,
          label3:'服务费'
        },{
          value3:2,
          label3:'官费'
        },{
          value3:3,
          label3:'杂费'
        }],
       cost:'',
       submits:[{
          value2:true,
          label2:'网上申请'
        },{
          value2:false,
          label2:'线下申请'
        }],
       submit:'',
        rules:{
           companyName:false,
           departmentName:0,
            companyShortName:false,
          superiorDepartments:false
        },
        submitFlag:false,
        queryModuleData:{
          appFromto:'',
          onlineApp:''
        },
        queryCurrencyList:[],
        submitData:{
         // creater:this.$store.getters.name,
             chargePrices:[{}]
            },
            options: [{
          value1: '内-内',
          label1: '内-内'
        }, {
          value1: '外-外',
          label1: '外-外'
        }, {
          value1: '外-内',
          label1: '外-内'
        }, {
          value1: '内-外',
          label1: '内-外'
        }, {
          value1: '台-内',
          label1: '台-内'
        }],
        value: '',
        typeTreeList:[],
        groupTypeIds:[],
        billTypeProps:{
          value: "id",
          label: "typeName",
          children: "childrens",
        },
        custList:[],
        countryOptions:[],
        }
      },
        beforeRouteEnter:(to,from,next)=> {
            if (to.query.type == '1') {
            document.title = getPageTitle(to.meta.title = "价目新增")
            next(res => {
            });
        } else {
      document.type = getPageTitle(to.meta.title = "价目修改")
      next(res => {
                });
            }
        },
    watch:{
      typeTreeList:{
        handler(val) {
          if (this.submitData.groupType) {
            this.groupTypeIds = this.$commonUtils.getTwoDimensionalArray(val,'id', this.submitData.groupType )
          }
        },
        deep: true
      }
    },
    created(){
      this.queryBillStyle()
      this.queryBillTypeTree()
      this.getTime()
      this.queryCurrencyUrl()
      this.fetchCountryOptions()
        console.log(this.$route.query.type)
        if(this.$route.query.type==2){
            this.queryChargeItemInfo()
        }
        this.querycustSelectClass()
    },
    methods:{
      //获取客户
      custRemoteMethod(value){
        const params = {
          pageNo: 1,
          pageSize: 100,
          keyword: value,
        }
        queryCustomerNameId(params).then((res)=>{
          this.custList = res.data || []
        })
      },
      //获取国家列表
      fetchCountryOptions(){
        queryCountry().then(res => {
          this.countryOptions = res.data || []
        })
      },
      queryBillStyle(){
        queryBillStyle().then(res => {
          this.billStyleList = res.data
        })
      },
      queryBillTypeTree(){
        queryClassTree({classId:1185}).then(res=>{
          const list = res.data[1185] || []
          const formatData = list.map((item)=>{
            return {
              typeName:item.typeName,
              id:item.id,
              childrens:item.childrens
            }
          })
          this.typeTreeList = formatData
        })
      },
      getTime:function(){
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth()+1;
      let dd = new Date().getDate();
      _this.gettime = yy+'-'+mm+'-'+dd;
    },
    handleClick(row){
      this.submitData.chargePrices.splice(this.submitData.chargePrices.indexOf(row),1)
    },
    addCharge(){

      this.submitData.chargePrices.push({creater:this.$store.getters.name,createDate:this.gettime})
    },
    addChargeItemInfo(){
      this.submitData.caseTypeId= this.caseTypeIds[this.caseTypeIds.length-1]
      if(Array.isArray(this.groupTypeIds)&&this.groupTypeIds.length>0){
        this.submitData.groupType = this.groupTypeIds[this.groupTypeIds.length-1]
      }
      addChargeItemInfo(this.submitData).then(res=>{
        this.cancel()
      })
    },
        querycustSelectClass(){
               const data = {
              classId: '1069'
        }
        querycustSelectClass(data).then(res=>{
          this.reportMatterList=res.data['1069']
        })
        },
        queryChargeItemInfo(){
            queryChargeItemInfo({chargeItemId:this.$route.query.chargeItemId}).then(res=>{
                res.data.chargePrices.forEach(item=>{
                  item.countryList = item.countryList || []
                  item.custIdList = item.custIdList || []
                })
               this.submitData = res.data
               if (this.typeTreeList.length) {
                this.groupTypeIds = this.$commonUtils.getTwoDimensionalArray(this.typeTreeList,'id', res.data.groupType )
               }
               //给客户列表下拉框赋初始值
               if (res.data.chargePrices.length) {
                //获取客户所有custIdList
                let idList = [] 
                res.data.chargePrices.forEach(item=>{
                  if (item.custIdList) {
                    idList = idList.concat(item.custIdList)
                  }
                })
                if (idList.length) {
                  const params = {
                    pageNo: 1,
                    pageSize: 100,
                    custIdArray:idList
                  }
                  queryCustomerNameId(params).then((res)=>{
                    this.custList = res.data || []
                  })
                }
               }
              this.caseTypeIds = this.$commonUtils.getTwoDimensionalArray(this.$store.state.caseInformation.caseTypeList,'caseTypeId', res.data.caseTypeId )
            })
    },
    queryCurrencyUrl(){
      queryCurrencyUrl().then(res=>{
        this.queryCurrencyList=res.data
      })
    },
      updateChargeItem(){
        this.submitData.caseTypeId= this.caseTypeIds[this.caseTypeIds.length-1]
        if(Array.isArray(this.groupTypeIds)&&this.groupTypeIds.length>0){
          this.submitData.groupType = this.groupTypeIds[this.groupTypeIds.length-1]
        }
        updateChargeItem(this.submitData).then(res=>{
          this.cancel()
        })
      },
      cancel(){
        this.$router.go(-1)
      }

    },

}
</script>

<style lang="scss" scoped>
    .department_modify{
      margin-top:20px ;
    }
    .modify /deep/ .el-table__empty-block{display: none}

    .department_modify tr td:nth-child(1){
      background: #f5f7fa;
    }
    .department_modify .button_wrap {
      display: flex;
      justify-content: center
    }
    .department_modify .button_wrap .exactButton{
      width: 169px;
      height: 47px;
      margin: 20px ;
    }
    .department_modify .sendInfoName input{
      background: transparent;
      border: 0;
    }
    .department_header{
      height:36px;
      font-size:18px;
      font-family:SourceHanSansCN-Normal;
      font-weight:400;
      color:rgba(38,42,47,1);
      line-height: 36px;
    }
    .ruleRed{
      color: #f00;
      font-size: 12px;
      text-indent: 15px;
    }
  .departmentDetail{
    width: 100%;
    border-collapse:collapse;
    tr td:nth-child(1){
      text-align: right;
      width: 300px;
      padding-right: 50px;
    }
    td{

      border: 1px solid #EBEEF5;
    }
  }
</style>
