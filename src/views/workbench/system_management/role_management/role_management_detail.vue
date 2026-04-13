<template>
  <div>
    <h2 class="title">{{$route.meta.title}}</h2>
    <el-table>
      <el-table-column label="角色中文名称：" align="right" width="250">
        <el-table-column label="角色英文名称：" align="right" width="250" >
          <el-table-column label="角色描述：" align="right" width="250">
            <el-table-column label="创建日期：" align="right" width="250">
              <el-table-column label="员工费率：" align="right" width="250">
                <el-table-column label="角色类别：" align="right" width="250">

                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column class="columnColor">
        <template slot="header" slot-scope="scope">
          <el-input v-model="name"></el-input>
        </template>
        <el-table-column >
          <template slot="header" slot-scope="scope">
            <el-input v-model="rnnameEn"></el-input>
          </template>
          <el-table-column >
            <template slot="header" slot-scope="scope">
              <el-input v-model="description"></el-input>
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
            <el-table-column >
              <template slot="header" slot-scope="scope">
                <el-input v-model="manhourPrice"></el-input>
              </template>
              <el-table-column >
                <template slot="header" slot-scope="scope">
                  <el-select :clearable="true" default-first-option filterable v-model="roleKind" placeholder>
                    <el-option v-for="(item,key) in roleList" :key="key" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </template>

              </el-table-column>
            </el-table-column>
          </el-table-column>
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
import { createRole,updateRoleById,queryRoleNames } from '@/api/systemList'
export default {
  name: "role_management_detail",
  data() {
    return {
      name: '',//中文名稱
      rnnameEn:'',//英文名稱
      description:'',//角色描述
      queryRoleNamesList:[],//角色列表（查重）
      creatTime: new Date(),
      manhourPrice:0,
      roleKind:null,
      roleList:[{id:1,name:'业务角色'},{id:2,name:'支持角色'},{id:3,name:'管理角色'},{id:99,name:'系统管理员'}]
    }
  },
  created(){
    this.queryRoleNames()
    if(this.$route.params.type==2){
      this.name=this.$route.query.name
      this.createTime=this.$route.query.createDate
      this.rnnameEn=this.$route.query.rnnameEn
      this.description=this.$route.query.description
      this.manhourPrice=this.$route.query.manhourPrice
      this.roleKind=Number(this.$route.query.roleKind)
    }
  },
  beforeRouteEnter:(to,from,next)=> {
    if (to.params.type === '1') {
      document.title = getPageTitle(to.meta.title = "角色新增")
      next(res => {
      });
    } else {
      document.type = getPageTitle(to.meta.title = "角色修改")
      next(res => {
      });
    }
  },
  methods:{
    myRules(){
      if(!this.name||!this.name.trim()){
        this.$alert('角色名称不能为空', '提示', {
          confirmButtonText: '确定'
        });
        return
      }
      if (this.$route.params.type==1&&this.queryRoleNamesList.includes(this.name)){
        this.$alert('已有该角色名称', '提示', {
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
        name: this.name.trim(),
        rnnameEn: this.rnnameEn,
        description: this.description,
        createDate: this.formatDate(this.createTime),
        roleKind: this.roleKind,
        manhourPrice: this.manhourPrice
      }
      if(this.$route.params.type==2){
        data.roleId = this.$route.query.roleId
        updateRoleById(data).then(res=>{
          if(res.success){
            this.$router.history.go(-1)

          }
        })
      }else {
        createRole(data).then(res=>{
          if(res.success){
            this.$router.history.go(-1)
          }
        })
      }

    },
    queryRoleNames(){
      queryRoleNames().then(res=>{
        this.queryRoleNamesList=res.data.map(item=>item.name)
      })
    },
    formatDate(time){
      return this.$commonUtils.formatDate(time)
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
  .el-table /deep/ tr:nth-of-type(1) th:nth-of-type(1) .cell:before{
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }

</style>
