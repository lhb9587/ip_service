<template>
    <div class="department_modify">
        <h2 class="department_header">价目详情</h2>
      <div class="modify">


        <el-table>
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <table class="departmentDetail">
                <tr>
                  <td>费用种类</td>
                  <td>{{submitData.typeName}}</td>
                </tr>
                <tr>
                  <td>适用的案件类型</td>
                  <td>
                   {{submitData.caseType}}
                  </td>
                </tr>
                <tr>
                  <td>费用名中文</td>
                  <td>
                    {{submitData.nameCn}}
                  </td>
                </tr>

                <tr>
                  <td>费用名英文</td>
                  <td>
                    {{submitData.nameEn}}
                  </td>
                </tr>
                <tr>
                  <td>费用名日文</td>
                  <td>
                    {{submitData.nameJp}}
                  </td>
                </tr>
                <tr>
                  <td>草单类型</td>
                  <td>
                    {{submitData.groupTypeName}}
                  </td>
                </tr>
              </table>
            </template>
          </el-table-column>
        </el-table>
      </div>
        <el-table
    :data="submitData.chargePrices"
    border
    style="width: 100%"
    empty-text="暂无数据">
    <el-table-column
    prop="date"
    label="费用名中文">
    <template slot-scope="scope">
     {{submitData.nameCn}}
    </template>
  </el-table-column>
    <el-table-column
    prop="date"
    label="费用名英文">
    <template slot-scope="scope">
        {{submitData.nameEn}}
    </template>
  </el-table-column>
    <el-table-column
      prop="name"
      label="申请方向">
      <template slot-scope="scope">
        {{scope.row.appFromto}}
       </template>
    </el-table-column>
    <el-table-column
      prop="province"
      label="上报事项">
      <template slot-scope="scope">
        {{submitData.reportMatter}}
       </template>
    </el-table-column>
    <el-table-column
      prop="city"
      label="递交方式">
      <template slot-scope="scope">
        <span v-if="scope.row.submitType===true">
          网上申请
        </span>
        <span v-if="scope.row.submitType===false">
          线下申请
        </span>
       </template>
    </el-table-column>
    <el-table-column
      prop="patentType"
      label="专利类型">
      <template slot-scope="scope">
        {{scope.row.patentType}}
       </template>
    </el-table-column>
    <el-table-column
      prop="yearNo"
      label="年号">
      <template slot-scope="scope">
        {{scope.row.yearNo}}
       </template>
    </el-table-column>
    <el-table-column
      prop="address"
      label="币种">
      <template slot-scope="scope">
        {{scope.row.curName}}
       </template>
    </el-table-column>
    <el-table-column
      prop="address"
      label="费用种类">
      <template slot-scope="scope">
        {{submitData.typeName}}
       </template>
    </el-table-column>
    <el-table-column
      prop="zip"
      label="价格">
      <template slot-scope="scope">
        {{scope.row.price}}
       </template>
    </el-table-column>
    <el-table-column
      prop="custNames"
      label="客户">
    </el-table-column>
    <el-table-column
      prop="country"
      label="进入国家">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="创建人">
     <template slot-scope="scope">
        {{scope.row.creater}}
       </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="创建日期">
      {{submitData.createDate}}
    </el-table-column>
  </el-table>

      </div>
</template>

<script>
import {queryChargeItemInfo} from  '@/api/systemList.js'
export default{
    data(){
        return{
            nameCn:'',
        submitData:{
         // creater:this.$store.getters.name,
             chargePrices:[{}]
            },
        }
      },
      created(){
      this.queryChargeItemInfo()
    },
   methods:{
    queryChargeItemInfo(){
            queryChargeItemInfo({chargeItemId:this.$route.query.chargeItemId}).then(res=>{
               this.submitData = res.data
              this.caseTypeIds = this.$commonUtils.getTwoDimensionalArray(this.$store.state.caseInformation.caseTypeList,'caseTypeId', res.data.caseTypeId )
            })
    },
   }

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
      box-sizing: border-box;
      padding: 10px;
      border: 1px solid #EBEEF5;
    }
  }
</style>
