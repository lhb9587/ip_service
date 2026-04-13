<template>
  <div>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose">
    <input type="text" placeholder="">
    <template  v-for="item in menuList">
      <el-submenu index="1" v-if="item.childrens&&item.childrens.length" >
        <template v-for="itm in item.childrens">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span >{{item.navigationName}}</span>
        </template>
        <el-menu-item @click="clickMenuItem(itm.navigationName,itm.indexName,itm.id)" index="1-1">
          {{itm.navigationName}}
          <svg-icon @click.stop="setItem(itm.id,itm.navigationName)" icon-class="设置"/>
        </el-menu-item>
        </template>
      </el-submenu>
      <el-menu-item index="2" v-else>
<!--        <i class="el-icon-menu"></i>-->
        <div  slot="title" style="display: flex;
    justify-content: space-between;
    align-items: center;">
          <span  @click="clickMenuItem(item.navigationName,item.indexName,item.id)">{{item.navigationName}}</span>
          <svg-icon  @click.stop="setItem(item.id,item.navigationName)" icon-class="设置"/>
        </div>

      </el-menu-item>
    </template>


<!--    <el-submenu index="1">-->
<!--      <template slot="title">-->
<!--        <i class="el-icon-location"></i>-->
<!--        <span>法律法规</span>-->
<!--      </template>-->
<!--      <el-menu-item @click="clickMenuItem('法规列表')" index="1-1">法规列表-->
<!--        <svg-icon @click.stop="setItem" icon-class="设置"/>-->
<!--      </el-menu-item>-->
<!--&lt;!&ndash;      <el-submenu index="1-1">&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;        <template slot="title">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;          <span>法规列表</span>&ndash;&gt;&ndash;&gt;-->

<!--&lt;!&ndash;&lt;!&ndash;        </template>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;        <el-menu-item index="1-1-1">法规列表</el-menu-item>&ndash;&gt;-->

<!--&lt;!&ndash;&lt;!&ndash;        <el-menu-item index="1-1-1">选项1</el-menu-item>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;      </el-submenu>&ndash;&gt;-->
<!--    </el-submenu>-->
<!--    <el-menu-item index="2">-->
<!--      <i class="el-icon-menu"></i>-->
<!--      <span slot="title">导航二</span>-->
<!--    </el-menu-item>-->
<!--    <el-menu-item index="3">-->
<!--      <i class="el-icon-document"></i>-->
<!--      <span slot="title">导航三</span>-->
<!--    </el-menu-item>-->
<!--    <el-menu-item index="4">-->
<!--      <i class="el-icon-setting"></i>-->
<!--      <span slot="title">导航四</span>-->
<!--    </el-menu-item>-->
  </el-menu>
    <el-dialog :title="dialogTableName" :visible.sync="dialogTableVisible" width="80%">
      <el-table :data="knowledgePropertyArray">
        <el-table-column :property="item.property" :label="item.name" v-for="item in titleAttay">
          <template slot-scope="scope">
            <el-checkbox  v-if="item.type=='checkbox'" :true-label="1" :false-label="0" v-model="scope.row[scope.column.property]"></el-checkbox>
            <span v-else>{{scope.row[scope.column.property]}}</span>
          </template>
        </el-table-column>
<!--        <el-table-column property="label" label="名称" ></el-table-column>-->
<!--        <el-table-column property="prop" label="别名"></el-table-column>-->
<!--        <el-table-column property="type" label="类型"></el-table-column>-->
<!--        <el-table-column property="kaiqi" label="开启">-->
<!--          <template slot-scope="scope">-->
<!--            <el-checkbox v-model="scope.row[scope.column.property]"></el-checkbox>-->
<!--          </template>-->

<!--        </el-table-column>-->
<!--        <el-table-column property="liebiao" label="列表" >-->
<!--          <template slot-scope="scope">-->
<!--            <el-checkbox v-model="scope.row[scope.column.property]"></el-checkbox>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column property="chakan" label="查看">-->
<!--          <template slot-scope="scope">-->
<!--            <el-checkbox v-model="scope.row[scope.column.property]"></el-checkbox>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column property="tianjia" label="添加">-->
<!--          <template slot-scope="scope">-->
<!--            <el-checkbox v-model="scope.row[scope.column.property]"></el-checkbox>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column property="xiugai" label="修改">-->
<!--          <template slot-scope="scope">-->
<!--            <el-checkbox v-model="scope.row[scope.column.property]"></el-checkbox>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column property="sousuo" label="搜索">-->
<!--          <template slot-scope="scope">-->
<!--            <el-checkbox v-model="scope.row[scope.column.property]"></el-checkbox>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column property="bitian" label="必填">-->
<!--          <template slot-scope="scope">-->
<!--            <el-checkbox v-model="scope.row[scope.column.property]"></el-checkbox>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
      <div class="right_flexAble">
        <el-button @click="updateKnowledgeProperty">保存</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { state,  mutation } from '../store/index.js'
import {queryNavigation,queryKnowledgeProperty,updateKnowledgeProperty,queryProperty} from '@/api/knowledgeBase.js'
export default {
  name: "managementMenu",
  data(){
    return {
      gridData:[],
      dialogTableVisible:false,
      menuList:[],
      knowledgePropertyArray:[],
      titleAttay:[],
      dialogTableName:''
      // state:state
    }
  },
  computed:{
    state(){
      return state
    }
  },
  created() {
    this.queryNavigation()
  },
  methods:{
    queryNavigation(){
      queryNavigation().then(res => {
        this.menuList=res.data
      })
    },
    queryKnowledgeProperty(knowledgeNavigationId){
      queryKnowledgeProperty({knowledgeNavigationId:knowledgeNavigationId}).then(res=>{
      this.knowledgePropertyArray=  res.data.knowledgePropertyArray
        this.titleAttay=res.data.titleAttay
        // this.gridData=[{label:'标题',prop:'title',type:'text',kaiqi:true,liebiao:true,chakan:true,xiugai:true,tianjia:true,sousuo:true,bitian:true},
        //   {label:'标题',prop:'title',type:'text',kaiqi:true,liebiao:true,chakan:true,xiugai:true,sousuo:true,tianjia:true,bitian:true},]
        this.dialogTableVisible=true
      })
    },
    clickMenuItem(navigationName,indexName,knowledgeNavigationId){
      queryProperty({ knowledgeNavigationId: knowledgeNavigationId, operate:'list' }).then(res => {
        // this.titleAttay = res.data
        mutation.addTab(navigationName,indexName,knowledgeNavigationId,res.data)
      })
    },
    updateKnowledgeProperty(dialogTableName){
      updateKnowledgeProperty({knowledgePropertyArray:this.knowledgePropertyArray}).then(res=>{
        this.dialogTableVisible=false
        this.$message.success('保存成功')
        queryProperty({ knowledgeNavigationId: this.knowledgePropertyArray[0].knowledgeNavigationId, operate:'list' }).then(res => {
          mutation.updateTab(dialogTableName, res.data)
        })
      })
    },
    setItem(knowledgeNavigationId,name){
      this.dialogTableName=name
      this.queryKnowledgeProperty(knowledgeNavigationId)
    }
  }
}
</script>

<style lang="scss" scoped>
  .right_flexAble{
    display: flex;
    justify-content: flex-end;
  }
</style>
