<template>
  <div class="template-management" style="margin-left: 0px">
    <el-tabs type="border-card" v-model="activeName" @tab-click="changeTab">
      <el-tab-pane label="万慧达模板" name="1">
        <template-list  @changeSelect="changeSelect" :selectValue="selectValue" :activeName="activeName" :type="1" @templateData="templateData"></template-list>
      </el-tab-pane>
      <el-tab-pane label="内部共享模板" name="2">
        <template-list  @changeSelect="changeSelect" :selectValue="selectValue" :activeName="activeName" :type="2" @templateData="templateData"></template-list>
      </el-tab-pane>
    </el-tabs>

<!--    <div class="search-bar">-->
<!--      <el-row>-->
<!--        <el-col :span="2">-->
<!--&lt;!&ndash;          <el-select class="selects" v-model="value" size="mini" placeholder="案件类型">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-option&ndash;&gt;-->
<!--&lt;!&ndash;              v-for="item in ['案件类型', '模板名称']"&ndash;&gt;-->
<!--&lt;!&ndash;              :key="item"&ndash;&gt;-->
<!--&lt;!&ndash;              :label="item"&ndash;&gt;-->
<!--&lt;!&ndash;              :value="item">&ndash;&gt;-->
<!--&lt;!&ndash;            </el-option>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-select>&ndash;&gt;-->
<!--        </el-col>-->
<!--        <el-col :span="4" style="margin-left: 21px">-->
<!--          <el-input class="search" size="mini" v-model="input" clearable placeholder="请输入模板名称或案件类型" @keyup.enter.native="searchTemplate($event)" prefix-icon="el-icon-search"></el-input>-->
<!--        </el-col>-->
<!--        <el-col :span="4" style="padding: 5px 15px" v-if="$route.path == '/workbench/system_management/templateManagement'">-->
<!--          <el-tooltip class="item" effect="light" content="创建模板" placement="right">-->
<!--            <i class="el-icon-plus hover" @click="createTemplate"></i>-->
<!--          </el-tooltip>-->

<!--        </el-col>-->
<!--      </el-row>-->
<!--    </div>-->
<!--    <div class="template-list">-->
<!--      <el-row>-->
<!--        <el-col class="template-list-item" :span="7" v-for="(item, index) in templateList" :key="index">-->
<!--          <el-card :body-style="{ padding: '0px' }">-->
<!--            <div class="template-header" @click="viewTemplate(item.teptId, index, item)">-->
<!--              <img src="@/assets/tmbg1.jpg" alt="" >-->
<!--              <i v-if="selected == index" class="el-icon-circle-check-outline"></i>-->
<!--              <div class="template-name" style="font-weight: bolder">{{item.teptName}}</div>-->
<!--            </div>-->
<!--            <div class="bottom-info">-->
<!--              <div v-if="$route.path == '/workbench/system_management/templateManagement'">-->
<!--                <el-button type="text" class="button" @click="viewTemplate(item.teptId,index,item)">查看</el-button>-->
<!--                <el-button type="text" class="button" @click="editTemplate(item)">修改</el-button>-->
<!--                <el-button type="text" class="button" @click="delTemplate(item.teptId)">删除</el-button>-->
<!--              </div>-->
<!--              <div v-else>-->
<!--                <router-link-->
<!--                  target="_blank"-->
<!--                  :to="'/workbench/system_management/template_management_view/'+item.teptId">-->
<!--                  <el-button type="text" class="button">查看</el-button>-->
<!--                </router-link>-->
<!--              </div>-->

<!--            </div>-->
<!--          </el-card>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <div class="block">-->
<!--        <el-pagination-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--          :page-sizes="[9, 18, 36, 72]"-->
<!--          :page-size="pageSize"-->
<!--          layout="total, sizes, prev, pager, next, jumper"-->
<!--          :total="total">-->
<!--        </el-pagination>-->
<!--      </div>-->
<!--    </div>-->
  </div>

</template>

<script>
  import templateList from "./components/templateList";
    import { queryTemplateList, deleteTemplate } from '@/api/templateManagement';
    import Bus from '@/utils/Bus'
    export default {
      name: "index",
      components: {
        templateList
      },
      data() {
        return {
          selectValue: '',
          activeName: '1',
          input:'',
          value:'',
          templateList: [],
          // template: require("../../../../assets/template.png"),
          pageSize: 9,
          pageNo: 1,
          total: 0,
          selected: 100
        }

      },
      created() {
        // this.queryTemplateList()
        if(localStorage.getItem('templateTab')){
          this.activeName = localStorage.getItem('templateTab')
        }
      },
      mounted() {
        // Bus.$on('updateTemplate',()=>{
        //   this.queryTemplateList()
        // })
      },
      methods: {
        changeTab(activeName){
          localStorage.setItem('templateTab',activeName.name)
        },
        changeSelect(v){
          this.selectValue = v
        },
        templateData(data){
          this.$emit('templateData', data)
        },
        queryTemplateList(filterData) {
          // console.log('+++++++++++++++')
          // console.log(typeof filterData)
          // console.log('+++++++++++++++')
          const pageSize = this.pageSize
          const pageNo = this.pageNo
          if(typeof filterData == 'number'){
            const caseTypeId = filterData
            queryTemplateList({pageNo, pageSize, caseTypeId}).then((res)=> {
              this.templateList = res.data
              // localStorage.setItem('templateList', JSON.stringify(this.templateList))
              this.total = res.total
            })
          }else if(typeof filterData == 'string'){
            const teptName = filterData
            queryTemplateList({pageNo, pageSize, teptName}).then((res)=> {
              this.templateList = res.data
              // localStorage.setItem('templateList', JSON.stringify(this.templateList))
              this.total = res.total
            })
          }else{
            queryTemplateList({pageNo, pageSize}).then((res)=> {
              this.templateList = res.data
              // localStorage.setItem('templateList', JSON.stringify(this.templateList))
              this.total = res.total
            })
          }

        },
        handleSizeChange(size) {
          this.pageSize = size
          this.queryTemplateList()
        },
        handleCurrentChange(no) {
          this.pageNo = no
          this.queryTemplateList()
        },
        editTemplate(item) {
          this.$router.push({path:'./template_management_edit/'+item.teptId,query:{'teptName': item.teptName }})
        },
        createTemplate() {
          this.$router.push('./template_management_create')
        },
        delTemplate(value) {
          this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            deleteTemplate({teptId: value}).then(()=>{
              this.$message.success('删除成功！')
              this.queryTemplateList()
            })
          }).catch(()=>{
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        },
        viewTemplate(teptId,index,item) {
          if(this.$route.path == '/workbench/system_management/templateManagement') {
            this.$router.push({path:'./template_management_view/'+teptId,query:{'teptName': item.teptName }})
          }else{
            this.selected = index
            // console.log(index)
            // console.log(this.selected)
            this.$emit('templateData', item)
          }

        },
        searchTemplate(event) {
          let filterData = {}
          let ligTypeList = []
          // console.log('++++++++3333+++++++')
          // console.log( this.$store.getters.caseTypeList[1].childrens)
          // console.log('+++++++++++++++')


          let typeList = []
          let recursiveFunction = (a)=>{
              const getObj = (arr)=>{
                arr.forEach(function(row){
                if(row.childrens){
                  // console.log('++++++++rowchild+++++++')
                  // console.log(row)
                  typeList.push({'caseType':row.caseType,'caseTypeId': row.caseTypeId})
                  getObj(row.childrens)
                }else {
                  // console.log('++++++roe')
                  // console.log(row)
                  typeList.push({'caseType':row.caseType,'caseTypeId': row.caseTypeId})
                }
              })
              }
              getObj(a)
              return typeList
          }
          ligTypeList = recursiveFunction(this.$store.getters.caseTypeList[1].childrens)
          // console.log('+++++++++++++++')
          // console.log(recursiveFunction(this.$store.getters.caseTypeList[1].childrens))
          // console.log('+++++++++++++++')

          if(!event.target.value){
            this.queryTemplateList()
          }else if(ligTypeList.find(item=> item.caseType == event.target.value)){
            const arr = ligTypeList.find(item=> item.caseType == event.target.value)
            filterData.caseTypeId = arr.caseTypeId
            this.queryTemplateList(filterData.caseTypeId)
          }else{
            filterData.teptName = event.target.value
            this.queryTemplateList(filterData.teptName)
          }
        }
      }
    }
</script>

<style lang="scss" scoped>
  .template-management {
    .search-bar {
      margin-top: 30px;
      .selects {
        >>> .el-input__inner {
          border: 0;
          color: #000;
        }
      }
      .search {
        >>> .el-input__inner {
          border-radius: 15px;
        }
      }
      .hover {
        font-size: 18px;
        transition: all .3s;
        &:hover{
          color: #409EFF;
          transform: rotateZ(90deg);
        }
      }
    }
    .template-list{
      margin-top: 60px;
      .block {
        margin-left: 50%;
        margin-bottom: 60px;
        margin-top: 60px;
        transform: translateX(-37%);
      }
      .template-list-item {
        margin: 15px 15px;
        padding: 5px;
        max-height: 350px;
        /*border: 1px solid #ccc;*/
        .template-header {
          position: relative;
          height: 200px;
          /*overflow: hidden;*/
          img {
            height: 100%;
            width: 100%;
            -webkit-filter: grayscale(100%); /* Chrome, Safari, Opera */
            filter: grayscale(100%);
            opacity: .2;
          }
          .el-icon-circle-check-outline {
            position: absolute;
            top: 0;
            left: 0;
            font-size: 30px;
          }
          .template-name {
            position: absolute;
            font-size: 20px;
            bottom: 50%;
            left: 50%;
            transform: translateX(-50%);
            cursor: pointer;
          }
        }
        .image {
          height: 100%;
          width: 100%;
          max-height: 235px;
        }
        .bottom-info {
          text-align: center;
          .bottom-update-date {
          }
        }
      }
    }
  }
</style>
