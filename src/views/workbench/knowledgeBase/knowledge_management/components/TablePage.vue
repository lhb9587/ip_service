<template>
  <div>
    <template v-if="pageListState">
      <el-radio-group v-model="queryModuleData.isCheck" @change="updateList">
        <el-radio :label="0">未审核</el-radio>
        <el-radio :label="1">已审核</el-radio>
        <el-radio :label="2">审核未通过</el-radio>
        <el-radio :label="null">全部</el-radio>
      </el-radio-group>
      <div class="right_flexAble">
<!--        <el-button size="mini" @click="addItem(data)">目录管理</el-button>-->
        <el-button size="mini" @click="addItem(data)">添加</el-button>
        <el-button size="mini" @click="pushDoc(data)">批量上传</el-button>
      </div>
      <uploadFile :clickUpload="clickUpload" @getUploadFile="getUploadFile" @changeClick="clickUpload=false" :multiple="true"></uploadFile>
      <el-table
        ref="filterTable"
        :data="list"
        style="width: 100%"
        @row-dblclick="rowDblclick">
        <template  v-for="item in titleArray">
          <el-table-column
            :prop="item.alias"
            :label="item.name"
            v-if="item.type=='child'"
          >
            <template slot-scope="scope">
              {{Object.prototype.toString.call(scope.row[item.alias]).includes('Array')?scope.row[item.alias].map(item=>item.ruleContent).join('\r\n'):''}}
            </template>
          </el-table-column>
          <el-table-column
            :prop="item.alias"
            :label="item.name"
            v-else-if="item.type.includes('join')"
          >
            <template slot-scope="scope">
              {{Object.prototype.toString.call(scope.row[item.alias]).includes('Array')?scope.row[item.alias].join(item.type.match(/join[(]'(.*?)'[)]/)[1]):scope.row[item.alias]}}
            </template>
          </el-table-column>
          <el-table-column
            :prop="item.alias"
            :label="item.name"
            v-else-if="item.type=='richText'"
          >
            <template slot-scope="scope">
              <div class="ellipsis-2" v-text="scope.row[item.alias].replace(/<\/?.+?\/?>/g,'')"></div>
            </template>
          </el-table-column>
          <el-table-column
            :prop="item.alias"
            :label="item.name"
            v-else-if="item.type=='cascader'"
          >
            <template slot-scope="scope">
             {{getfenlei(scope.row[item.alias],item)}}
            </template>
          </el-table-column>
          <el-table-column
            :prop="item.alias"
            :label="item.name"
            v-else
          >
            <template slot-scope="scope">
            <div class="ellipsis-2" :title="scope.row[item.alias]">
             {{scope.row[item.alias]}}
            </div>
            </template>

          </el-table-column>
        </template>

        <el-table-column
          prop="tag"
          label="操作"
          >
          <template slot-scope="scope">
            <div class="button_wrap">
            <div>
            <el-button type="primary" size="mini" @click="updateRow(scope.row)">修改</el-button>
            </div>
            <div>
            <el-button size="mini" @click="deleteRule(scope.row)">删除</el-button>
            </div>
            <template v-if="scope.row.isCheck===0">
              <div>
              <el-button type="primary" size="mini" @click="checkRule(scope.row,1)">通过</el-button>
              </div>
              <div>
              <el-button size="mini" @click="checkRule(scope.row,2)">退回</el-button>
              </div>
            </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="data.total"
        :page.sync="data.pageNo"
        :limit.sync="data.pageSize"
        @pagination="updateList"
      />
    </template>
    <PageItem v-else @complete="complete" :knowledgeNavigationId="data.knowledgeNavigationId" :type="type" :row="row"></PageItem>
<!--    <directoryManagement></directoryManagement>-->
    <el-dialog
      title="请选择"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      >
      <el-form ref="form" :model="form"  label-width="80px">
        <el-form-item label="分类" :rules="{
      required: true, message: '分类不能为空', trigger: 'blur'
    }">
          <el-cascader
            style="width: 500px"
            v-model="form.parentIdList"
            :options="options"
            :props="props"
            clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmParent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import directoryManagement from './directoryManagement'
import Pagination from '@/components/Pagination'
import {analysisWord,queryContentsDelTitle,deleteRule,checkRule} from "@/api/knowledgeBase.js"
import UploadFile from '@/views/workbench/material_management/components/uploadFile.vue'
import PageItem from "./PageItem";
export default {
  name: "TablePage",
  props: {
    list: {
      default: () => ([])
    },
    titleArray:{
      default: () => ([])
    },
    data:{}
  },
  data() {
    return {
      form:{
        parentIdList:[]
      },
      queryModuleData:{
        isCheck:null
      },
      options:[],
      props:{children:'childArray',label:'name',value:'id'},
      type:'add',
      clickUpload: false,
      pageListState: true,
      dialogVisible: false
    }
  },
  methods:{
    complete(type){
      this.pageListState=true
      if(type){
        this.updateList()
      }
      // if(type=='add'){
      //   mutation.updateTabcontent()
      //   // this.tableData.push({})
      // }
      // if(type=='edit'){
      //
      // }
    },
    updateList(){
      this.$emit('updateList',this.data.pageSize,this.data.pageNo,this.queryModuleData)
    },
    deleteRule(row){
      deleteRule({knowledgeNavigationId:row.knowledgeNavigationId,id:row.id}).then(res=>{
        this.updateList()
      })
    },
    checkRule(row,type){
      checkRule({knowledgeNavigationId:row.knowledgeNavigationId,id:row.id, isCheck:type}).then(res=>{
        this.updateList()
      })
    },
    confirmParent(){
      if(!this.form.parentIdList.length){
        this.$message.error('请选择分类后进行上传')
        return
      }
      this.clickUpload=true
    },
    getfenlei(array,item){
      if(!array){
        array=[]
      }
      let arr=this.$commonUtils.getMenuName(item.values,item.propsValue.children)
      return array.map(itm=>arr.find(i=>i[item.propsValue.value]==itm)[item.propsValue.label]).join('/')
    },
    getUploadFile(e){
      this.analysisWord(e.target.files)

    },
    rowDblclick(row, column, event){
      this.type = 'look'
      this.row = row
      this.pageListState = false
    },
    analysisWord(file){
      // let formData = new FormData()
      // formData.append("attachFile", file);
      // formData.append("paperOrEle", this.paperOrEle);
      // formData.append("tokenID", this.$store.getters.token);
      // createMultMaterial(formData).then(async res=>{
      //   this.$message.success('新建成功')
      // })
      let formData = new FormData()
      for (let item of file){
        formData.append("attachFile", item);
      }
      formData.append("parentId", this.form.parentIdList[this.form.parentIdList.length-1]);
      formData.append("tokenID", this.$store.getters.token);
      formData.append("knowledgeNavigationId", this.data.knowledgeNavigationId);
      analysisWord(formData,(e)=>{
        this.percentage = parseInt(e.loaded/e.total*100)
      }).then(async res=>{
        this.percentage = 0
        this.dialogVisible=false
        this.updateList()
        this.$message.success(res.message)
      }).catch(()=>{
        this.percentage = 0
      })
    },
    pushDoc(data){
      this.dialogVisible=true
    },
    updateRow(row){
      this.type = 'edit'
      this.row = row
      this.pageListState = false
    },
    addItem(){
      this.type='add'
      this.pageListState = false
    },
    resetDateFilter() {
      this.$refs.filterTable.clearFilter('date');
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  },
  watch:{
    dialogVisible(n,o){
      if (n&&!this.options.length){
        queryContentsDelTitle({ knowledgeNavigationId:3 }).then(res=>{
          this.options=res.data
        })
      }
    }
  },
  components:{
    PageItem,UploadFile,Pagination,directoryManagement
  }
}
</script>

<style lang="scss" scoped>
.right_flexAble{
  display: flex;
  justify-content: flex-end;
}
.ellipsis-2{
  /*text-overflow: -o-ellipsis-lastline;*/
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
/deep/ .button_wrap{
  display: flex;
  flex-wrap:wrap ;
  &>div{
    width: 50%;
    text-align: center;
    margin: 5px 0;
  }
}
</style>
