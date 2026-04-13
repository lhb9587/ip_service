<template>
  <div>
    <h2 class="title" >{{$route.meta.title}}</h2>
    <el-table>
      <el-table-column label="领域编码：" align="right" width="250">
        <el-table-column label="领域名称：" align="right" width="250" >
          <el-table-column label="创建日期：" align="right" width="250">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column class="columnColor">
        <template slot="header" slot-scope="scope">
          <span style="margin-left: 10px"> {{$route.query.id?$route.query.id:''}}</span>
        </template>
        <el-table-column >
          <template slot="header" slot-scope="scope">
            <el-input v-model="domainName"></el-input>
          </template>
          <el-table-column >
            <template slot="header" slot-scope="scope">
              <el-date-picker
                v-model="creatTime"
                type="date"
                disabled
                placeholder="选择日期">
              </el-date-picker>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div class="button_wrap">
      <el-button class="exactButton" type="primary" @click="myRules">确定</el-button>
      <el-button class="exactButton" plain @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import getPageTitle from '@/utils/get-page-title'
import { createDomain, queryDomainNames, domainUpdate } from '@/api/systemList'
export default {
  name: "domain_management_detail",
  data() {
    return {
      domainName: '',
      queryDomains:[],
      creatTime: new Date()
    }
  },
  created(){
    this.queryDomainNames()
    if(this.$route.params.type==2){
      this.domainName=this.$route.query.domainName
      this.createTime=this.$route.query.createTime
    }
  },
  beforeRouteEnter:(to,from,next)=> {
    if (to.params.type === '1') {
      document.title = getPageTitle(to.meta.title = "领域新增")
      next(res => {
      });
    } else {
      document.title = getPageTitle(to.meta.title = "领域修改")
      next(res => {
      });
    }
  },
  methods:{
    myRules(){
      if(!this.domainName||!this.domainName.trim()){
        this.$alert('领域名称不能为空', '提示', {
          confirmButtonText: '确定'
        });
        return
      }
      if (this.queryDomainsList.includes(this.domainName)){
        this.$alert('已有该领域名称', '提示', {
          confirmButtonText: '确定'
        });
      }else{
        this.submit()
      }
    },
    cancel(){
      this.$router.history.go(-1)
    },
    submit(){
      let data={
        agencyId: 1,
        domainName: this.domainName
      }
      if(this.$route.params.type==2){
        data.id = this.$route.query.id
        domainUpdate(data).then(res=>{
          if(res.success){
            this.$router.history.go(-1)
          }
        })
      }else {
        createDomain(data).then(res=>{
          if(res.success){

            this.$router.history.go(-1)
          }
        })
      }
    },
    queryDomainNames(){
      queryDomainNames().then(res=>{
        this.queryDomainsList=res.data.map(item=>item.domainName)
      })
    }
  }
}
</script>

<style scoped>
  .button_wrap {
    display: flex;
    justify-content: center
  }
  .button_wrap .exactButton{
    width: 169px;
    height: 47px;
    margin: 20px ;
  }
  .title{
    height: 39px;
    border-bottom:1px solid rgba(232,235,237,1);
    font-size:18px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(38,42,47,1);
    line-height: 39px;
    text-indent: 21px;
  }
   .el-table /deep/ tr th:nth-child(2){
     background: #fff;
   }
  .el-table /deep/   .el-table__empty-block{
    display: none;}

  .el-table /deep/  .el-input__prefix  {
      left: 11px;
    }

</style>
