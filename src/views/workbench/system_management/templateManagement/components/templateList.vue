<template>
    <div>
      <div class="search-bar">
      <el-row>
        <el-col :span="2">
<!--          <el-select class="selects" v-model="value" size="mini" placeholder="案件类型">-->
<!--            <el-option-->
<!--              v-for="item in ['案件类型', '模板名称']"-->
<!--              :key="item"-->
<!--              :label="item"-->
<!--              :value="item">-->
<!--            </el-option>-->
<!--          </el-select>-->
        </el-col>
        <el-col :span="4" style="margin-left: 21px">
          <el-input class="search" size="mini" v-model="input" clearable placeholder="请输入模板名称或案件类型" @keyup.enter.native="searchTemplate(input)" @input="changeSearch" prefix-icon="el-icon-search"></el-input>
        </el-col>
        <el-col :span="1" style="display: flex;align-items: center;justify-content: center">
          <el-button type="primary" size="mini" round @click.native="searchTemplate(input)">搜索</el-button>
        </el-col>
        <el-col :span="4" style="padding: 5px 15px" v-if="($route.path == '/workbench/system_management/templateManagement')&&(whdCreatePermission || type==2)">
          <el-tooltip class="item" effect="light" content="创建模板" placement="right">
            <i class="el-icon-plus hover" @click="createTemplate"></i>
          </el-tooltip>

        </el-col>
      </el-row>
    </div>
      <div class="template-list">
      <el-row>
        <el-col class="template-list-item" :span="7" v-for="(item, index) in templateList" :key="index">
          <el-card :body-style="{ padding: '0px' }">
            <div class="template-header" @click="viewTemplate(item.teptId, index, item)">
              <img src="@/assets/tmbg1.jpg" alt="" >
              <i v-if="selected == index" class="el-icon-circle-check-outline"></i>
              <div class="template-name" style="font-weight: bolder">{{item.teptName}}</div>
            </div>
            <div class="bottom-info">
              <div v-if="$route.path == '/workbench/system_management/templateManagement'">
                <el-button v-if="checkInTemplatePermission(item,'查看') || whdLookPermission" type="text" class="button" @click="viewTemplate(item.teptId,index,item)">查看</el-button>
                <el-button v-if="checkInTemplatePermission(item,'修改') || whdEditPermission" type="text" class="button" @click="editTemplate(item)">修改</el-button>
                <el-button v-if="checkInTemplatePermission(item,'删除') || whdDelPermission" type="text" class="button" @click="delTemplate(item.teptId)">删除</el-button>
                <el-button v-if="type == 2 || type==1&&$store.getters.permissions.includes(285)" type="text" class="button" @click="copyTemplateView(item)">复制</el-button>
              </div>
              <div v-else>
                <router-link
                  target="_blank"
                  :to="{
                  path: '/workbench/system_management/template_management_view/'+item.teptId,
                  query:{
                    type: type
                  }
                }">
                  <el-button type="text" class="button">查看</el-button>
                </router-link>
              </div>

            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[9, 18, 36, 72]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
      <el-dialog
      title="复制"
      :visible.sync="copyTeptView"
      width="35%"
    >
      <el-row class="dialog-footer" style="margin-bottom: 30px">
        <el-col :span="24" class="dialog-footer">
          <div class="all-user" style="">
            <div style="display: flex;justify-content: center;align-items: center">
              <div style="width: 100px;">模板名称:</div>
              <el-input v-model="copyTeptName" clearable placeholder="请输入内容"></el-input>
            </div>
            <div style="display: flex;justify-content: center;align-items: center;margin-top: 20px">
              <div style="width: 100px;">模板类型:</div>
              <el-radio-group v-model="tempType">
                <el-radio :label="1">万慧达模板</el-radio>
                <el-radio :label="2">内部共享模板</el-radio>
              </el-radio-group>
<!--              <el-input v-model="copyTeptName" clearable placeholder="请输入内容"></el-input>-->
            </div>

          </div>

        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copyTeptView = false" size="small">取 消</el-button>
        <el-button type="primary" @click="copyTemplate" size="small">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>

<script>
    import { queryTemplateList, deleteTemplate, copyTemplate } from '@/api/templateManagement';
    import Bus from '@/utils/Bus'
    export default {
      name: "templateList",
      props: {
        type: '',
        activeName: '',
        selectValue: ''
      },
      data() {
        return {
          tempType:this.type,
          input:'',
          value:'',
          templateList: [],
          // template: require("../../../../assets/template.png"),
          pageSize: 9,
          pageNo: 1,
          total: 0,
          selected: 1000,
          sign: '',
          copyTeptId: '',
          copyTeptView: false,
          copyTeptName: '',
          copyTeptName1: '',
        }

      },
      watch:{
        selectValue(n){
          if(n != this.type){
            this.selected = 1000
          }
        },
        // updateCopyTemplate(n){
        //   alert('xixi')
        //   this.queryTemplateList()
        // }
      },
      computed: {
        // updateCopyTemplate(){
        //   return this.$store.getters.copyTemplate
        // },
        whdLookPermission(){
          return this.type == 1
        },
        whdCreatePermission(){
          return this.type == 1 && this.$store.getters.permissions.includes(280)
        },
        whdEditPermission(){
          return this.type == 1 && this.$store.getters.permissions.includes(281)
        },
        whdDelPermission(){
          return this.type == 1 && this.$store.getters.permissions.includes(282)
        }
      },
      created() {
        this.queryTemplateList()
      },
      mounted() {
        Bus.$on('updateTemplate',()=>{
          this.queryTemplateList()
        })
        Bus.$on('deleteSelect', ()=>{
          this.selected = 1000
        })

      },
      methods: {
        getTemName(){
          if(this.teptId){
               let   item= this.templateList.find(item=>item.tteptId==this.teptId)
            if(item){
              this.$emit('templateData', item)
            }

          }
        },
        copyTemplateView(item){
          this.copyTeptView = true
          this.copyTeptId = item.teptId
          this.copyTeptName = item.teptName
          this.copyTeptName1 = item.teptName
        },
        copyTemplate(){
          if(!this.copyTeptName){
            this.$message.error('请输入模板名称!')
            return
          }
          if(this.copyTeptName == this.copyTeptName1){
            // this.copyTeptName = this.copyTeptName + new Date().getTime()
          }
          copyTemplate({teptId: this.copyTeptId, teptName: this.copyTeptName,tempType:this.tempType}).then(()=> {
            this.$message.success('复制模板成功!')
            // this.queryTemplateList()
            Bus.$emit('updateTemplate')
            this.copyTeptView = false
            this.tempType = this.type
          })
        },
        changeSearch(v){
          // if(!v){
          //   this.queryTemplateList()
          // }
        },
        checkP(data,t){
          let p
          if(data.teptId&&data.userList&&data.userList.find(i=>i.tempUserId == this.$store.getters.userId)){
            p = data.userList.find(i=>i.tempUserId == this.$store.getters.userId)[t]
          }
          return p
        },
        checkInTemplatePermission(item,f){
          if(this.type == 2){
            switch (f) {
              case '查看':
                return this.checkP(item,'canUse')
                break;
              case '修改':
                return this.checkP(item,'canEdit')
                break;
              case '删除':
                return this.checkP(item,'canDelete')
                break;
              // case '创建':
              //   return this.$store.getters.permissions.includes(280)
              //   break;
              default:return false
            }
          }
        },
        queryTemplateList(filterData) {
          // console.log('+++++++++++++++')
          // console.log(typeof filterData)
          // console.log('+++++++++++++++')
          const pageSize = this.pageSize
          const pageNo = this.pageNo
          if(typeof filterData == 'number'){
            const caseTypeId = filterData
            queryTemplateList({pageNo, pageSize, caseTypeId,tempType:this.type}).then((res)=> {
              this.templateList = res.data
              // localStorage.setItem('templateList', JSON.stringify(this.templateList))
              this.total = res.total
            })
          }else if(typeof filterData == 'string'){
            const teptName = filterData
            queryTemplateList({pageNo, pageSize, teptName,tempType:this.type}).then((res)=> {
              this.templateList = res.data
              // localStorage.setItem('templateList', JSON.stringify(this.templateList))
              this.total = res.total
            })
          }else{
            this.templateList.length = 0
            if(this.type == 2){
              let teplist = []
              queryTemplateList({pageSize:10000,tempType:this.type}).then((res)=> {
                (res.data).forEach(item=>{
                    if(item.userList&&item.userList.length>0){
                      let pData = {}
                        // console.log(item.userList.find(i=>i.teptId == item.teptId),'000000')
                      let list = item.userList.filter(i=>i.tempUserId == this.$store.getters.userId)
                      if(list&&list.length>0&&list.find(j=>j.teptId = item.teptId)){
                        pData = list.find(j=>j.teptId = item.teptId)
                      }
                      if(pData&&(pData.canUse || pData.canEdit || pData.canDelete)){
                        teplist.push(item)
                      }
                    }
                  })
                  this.templateList = teplist.slice(this.pageSize*(this.pageNo-1),this.pageSize*this.pageNo)
                  // localStorage.setItem('templateList', JSON.stringify(this.templateList))
                  this.total = teplist.length || 0
                  // this.total = res.total

              })
            }else{
              queryTemplateList({pageNo, pageSize,tempType:this.type}).then((res)=> {
                  this.templateList = res.data
                  // localStorage.setItem('templateList', JSON.stringify(this.templateList))
                  this.total = res.total
              })
            }

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
          this.$router.push({path:'./template_management_edit/'+item.teptId,query:{'teptName': item.teptName,'type': this.type }})
        },
        createTemplate() {
          this.$router.push('./template_management_create/'+this.type)
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
            this.$router.push({path:'./template_management_view/'+teptId,query:{'teptName': item.teptName,'type': this.type }})
          }else{
            this.selected = index
            // console.log(index)
            // console.log(this.selected)
            this.$emit('changeSelect',this.activeName)
            this.$emit('templateData', item)
          }

        },
        searchTemplate(value) {
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

          if(!value){
            this.queryTemplateList()
          }else if(ligTypeList.find(item=> item.caseType == value)){
            const arr = ligTypeList.find(item=> item.caseType == value)
            filterData.caseTypeId = arr.caseTypeId
            this.queryTemplateList(filterData.caseTypeId)
          }else{
            filterData.teptName = value
            this.queryTemplateList(filterData.teptName)
          }
        }
      }
    }
</script>

<style lang="scss" scoped>
  .template-management {
    .search-bar {
      margin-top: 10px;
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
      margin-top: 10px;
      .block {
        margin-left: 50%;
        margin-bottom: 30px;
        margin-top: 30px;
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
  .dialog-footer{
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
