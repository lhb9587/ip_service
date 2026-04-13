<template>
  <div>
    <header>诉讼分案</header>
    <div class="title">
      案件信息
    </div>
    <el-table :data="caseData" border class="el-table1" >
      <el-table-column type="index" width="60" label="序号" align="left">
      </el-table-column>
      <el-table-column align="left" :key="item.title" v-for="item,index in tableTitleList" :label="item.title" :prop="item.value">
        <template slot-scope="scope">
          <p style="margin: 0;cursor: pointer" @click="$router.push('/workbench/case/seeCaseDetail/'+scope.row.caseId+'?taskType=2')">{{scope.row[item.value]}}</p>
        </template>
      </el-table-column>
    </el-table>
    <div class="title">
      递交事项
    </div>
    <template v-if="$route.query.pageType!=5">
      <div style="display: flex">
        <el-form  style="flex: 1"  ref="submission" :model="submitData" :rules="rules"  label-width="206px">
        <el-row>
          <el-form-item label="承办律师:" >
            <el-select  default-first-option v-model="lawyerUserIdList"  @remove-tag="removeTag" @change="changeCbLawyer"  placeholder="请选择"  filterable :multiple-limit="2" multiple >
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.fullname"
                :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="分案日期:" >-->
<!--            <el-date-picker-->
<!--              v-model="submitData.submitDate"-->
<!--              type="date"-->
<!--              :placeholder="formatDate(new Date())"-->
<!--              value-format="yyyy-MM-dd">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
        </el-row>
        <el-row>
          <el-form-item label="分案人:" >
            {{$store.getters.name}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注:" >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入备注"
              v-model="submitData.memo"
            >
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
        <el-form  style="flex: 1">
         <el-row  class="fullRow table-dl-row" >
           <el-form-item class="postInfo-container-item" label="承办组:">
                <el-row class="fullRow ">
                  <el-col :span="24" style="text-align:right">
                    <el-button  @click="dialogFormgroupGzz=true" size="mini" style="margin-left:10px" type="primary">
                      新增
                    </el-button>
                    <el-button @click="cbshow=!cbshow" size="mini" style="margin-left:10px" type="primary">
                      {{cbshow?"收起":"查看"}}
                    </el-button>
                  </el-col>
                </el-row>
                <el-row :key="key" class="fullRow " v-for="(item,key) in trademarkCaseCBWorkgroups">
                  <el-col :span="24">
                    <el-form-item class="postInfo-container-item">
                      <template>
                        <el-col :span="24" style="text-align:right">
                          <span style="float:left">{{item.groupName}}</span>
                          <el-button @click="addgroupCy('cbz',key)" size="mini" style="margin-left:10px" type="">
                            新增成员
                          </el-button>
                          <el-button @click="delgroupCb(key)" size="mini" style="margin-left:10px" type="">
                            删除组
                          </el-button>

                        </el-col>
                        <el-table v-if="cbshow" :data="item.trademarkCaseWorkgroupMembers" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">

                          <el-table-column align="left" label="成员姓名" width>
                            <template slot-scope="scope">
                              <span>{{ scope.row.fullname }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column align="left" label="成员角色" width>
                            <template slot-scope="scope">
                              <span>{{ scope.row.roleName }}</span>
                            </template>
                          </el-table-column>

                          <el-table-column  align="left" label="操作" width>
                            <template slot-scope="scope">
                              <el-button @click="delgroupCbCy(scope.$index,key)" size="mini" type="text">删除
                              </el-button>
                            </template>
                          </el-table-column>

                        </el-table>

                      </template>
                    </el-form-item>

                  </el-col>

                </el-row>
            </el-form-item>
        </el-row>
        </el-form>
      </div>
        <el-form   label-width="206px">
          <el-row>
            <el-form-item label="文件类型:" >
              <el-select  default-first-option v-model="materialTypeId" placeholder="请选择" @change="handleChangeTypeName">
                <el-option
                  v-for="item in typeNameList"
                  :key="item.materialTypeId"
                  :label="item.typeName"
                  :value="item.materialTypeId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="文件名称:" >
              <el-input v-model="docName" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="上传文件:">
              <el-upload
                ref="uploads"
                class="upload-demo1"
                drag
                :data="getUploadData(caseData.map(item=>item.caseId))"
                :action="creatematerial"
                :on-remove="handleRemove1"
                :on-preview="onPreview"
                :on-success="onsuccess"
                name="attachFile"
                :before-upload="beforeUpload"
                :file-list="materialArrayList"
                multiple
                :auto-upload="false">
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
<!--              <div style="width: 95%;position: relative">-->
<!--                -->
<!--              </div>-->
            </el-form-item>
          </el-row>
        </el-form>
      <div class="button_wrap">
        <el-button class="exactButton" plain @click="cancel">返回</el-button>
        <el-button class="exactButton" type="primary" @click="submit(1)">确定</el-button>
      </div>
    </template>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :show-close="false" :visible.sync="dialogFormgroupGzz" title="选择工作组" width="60%">
      <el-form :model="groupGzzObjc" label-position="left" ref="" size="mini" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" label="工作组:">
                  <template>
                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" ref="gzzselect" v-model="groupGzzObjc.wkgId">
                      <el-option :key="key" :label="item.groupName" :value="item.wkgId" v-for="(item,key) in custGroup" />
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormgroupGzz = false">
          取消
        </el-button>
        <el-button @click="addgroupGzzBtn" type="primary">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :show-close="false" :visible.sync="dialogFormgroupCy" title="添加成员" width="60%">
      <el-form :model="groupCyObjc" label-position="left" ref="" size="mini" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="">
              <el-col :span="12">
                <el-form-item class="postInfo-container-item" label="成员姓名:">
                  <template>
                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" ref="cyselect" v-model="groupCyObjc.userId">
                      <el-option :key="key" :label="item.fullname" :value="item.userId" v-for="(item,key) in userList" />
                    </el-select>

                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="postInfo-container-item" label="成员角色:">
                  <template>
                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" ref="jsselect" v-model="groupCyObjc.roleId">
                      <el-option :key="key" :label="item.name" :value="item.roleId" v-for="(item,key) in rolenameList" />
                    </el-select>

                  </template>
                </el-form-item>
              </el-col>
            </el-row>

          </el-col>
        </el-row>

      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormgroupCy = false">
          取消
        </el-button>
        <el-button @click="addgroupCyBtn" type="primary">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { queryUserAll, delCaseMaterial, queryMaterialType ,queryCase,modifyMaterialType,assignCase ,queryMaterialTypeByDocId} from '@/api/caseList.js'
import { creatematerial } from '@/api/ipServiceApi.config.js'
import { getEndDate ,getLanglist} from  '@/utils/index.js'
import {
  queryCaseWorkgroupUrl,
  queryRoleNames,
} from "@/api/caseDetail";
export default {
  name: "divisionCase",
  data() {
    return {
      rules: {
        // submitMode: [{ required: true, message: '请选择递交方式', trigger: 'blur'}],
        // reportMatter: [{ required: true, message: '请选择上报事项', trigger: ['blur','change'] }]
      },
      caseData: [],
      tableTitleList:[
        {"title":"案件文号", "value": "agentNum" },
        {"title":"案件类型","value":"caseType",},
        {"title":"审级","value":"judgeRankName"},
        {"title":"案件名称","value":"caseName"},
        {"title":"诉讼地位","value":"positionName"},
        // {"title":"我方诉讼地位","value":"partyTypeStr"},
        {"title":"案件报价","value":"caseOffer"},
        {"title":"案件等级","value":"caseLevelStr"},
        {"title":"客户","value":"custName" },
        {"title":"客户组","value":"custGroupName" },
        {"title":"承办组","value":"cbGroupName" },
        {"title":"时限内容","value":"caption"},
        {"title":"绝限日期","value":"abslimitDate" },
        {"title":"阶段","value":"stageName" }],
      submitData: {
      },
      creatematerial,
      uploadTable: [],
      typeNameList: [],
      docName: '',
      materialTypeId: '',
      materialArrayList: [],
      userList: [],
      lawyerUserIdList:[],
      materialIdList:[],
      trademarkCaseCBWorkgroups:[],
      cbshow:false,
      dialogFormgroupGzz:false,
      dialogFormgroupCy:false,
      groupGzzObjc:{},
      groupCyObjc:{},
      rolenameList:[],
      custGroup:[]
    }
  },
  created() {
    if (!this.$route.query.caseIds) {
      this.$router.replace('/workbench/toDoTask')
      return
    }
    this.init()
    this.queryAlltask()
    this.queryUserAll()
    this.queryMaterialTypeByDocId()

  //  this.submitData.submitDate=this.$commonUtils.formatDate(new Date())
  },
  methods:{
    init(){
      queryCaseWorkgroupUrl({ status: "1" }).then(res => {
        this.custGroup = res.data;
      });
      queryRoleNames().then(response => {
        this.rolenameList = response.data;
      })
        .catch(err => {
          console.log(err);
        });
      // queryUserNames()
      //   .then(response => {
      //     this.selectData.username = response.data;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    delgroupCb(index) {
      this.trademarkCaseCBWorkgroups.splice(index, 1);

    },
    addgroupCyBtn() {
      this.groupCyObjc.fullname = this.$refs.cyselect.selected.label;
      this.groupCyObjc.roleName = this.$refs.jsselect.selected.label;

      const objc = Object.assign({}, this.groupCyObjc);
      if (this.addCbzCyindex === "") {
        if (!this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].wkgId) {
          this.$message.error("请先选择客户组");
          this.dialogFormgroupCy = false;
          return;
        }
        if (!this.groupCyObjc.fullname) {
          this.$message.error("请先选择成员");
          return;
        }
        this.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers.push(
          objc
        );
        this.cyshow = true;
      } else {
        if (!this.groupCyObjc.fullname) {
          this.$message.error("请先选择成员");
          return;
        }
        this.trademarkCaseCBWorkgroups[
          this.addCbzCyindex
          ].trademarkCaseWorkgroupMembers.push(objc);
        this.cbshow = true;
      }
      this.dialogFormgroupCy = false;
    },
    addgroupCy(type, index) {
      this.dialogFormgroupCy = true;
      if (type == "cbz") {
        this.addCbzCyindex = index;
      } else {
        this.addCbzCyindex = "";
      }
    },
    addgroupGzzBtn() {
      this.groupGzzObjc.groupName = this.$refs.gzzselect.selected.label;
      if (!this.groupGzzObjc.groupName) {
        this.$message.error("请先选择客户组");

        return;
      }
      this.custGroup.forEach(element => {
        if (element.wkgId == this.$refs.gzzselect.selected.value) {
          this.groupGzzObjc.trademarkCaseWorkgroupMembers = element.wkgUsers;
          this.groupGzzObjc.wkgRoleId = element.wkgRoleId;
          return;
        }
      });
      const objc = Object.assign({}, this.groupGzzObjc);
      this.trademarkCaseCBWorkgroups.push(objc);
      this.dialogFormgroupGzz = false;
      // this.cbshow = true;
    },
    queryAlltask() {
      const data = {
        caseIds: this.$route.query.caseIds,
        taskType:2// Object.prototype.toString.call(this.$route.query.caseIds).includes('Array')?this.$route.query.caseIds:[this.$route.query.caseIds]
      }
      queryCase(data).then(res => {
        this.caseData = res.data
        if(res.data[0].Lawyer1UserId){
          this.lawyerUserIdList.push(res.data[0].Lawyer1UserId)
        }
        if(res.data[0].Lawyer2UserId){
          this.lawyerUserIdList.push(res.data[0].Lawyer2UserId)
        }
        if(res.data[0].trademarkCaseCBWorkgroups&&res.data[0].trademarkCaseCBWorkgroups.length){
          this.trademarkCaseCBWorkgroups=res.data[0].trademarkCaseCBWorkgroups
        }

        console.log(this.lawyerUserIdList);
      });
    },
    handleChangeTypeName(e) {
      this.docName = this.typeNameList.find(item => item.materialTypeId === e).typeName
    },
    handleRemove(file, fileList, caseId) {
      if (file.materialId) {
        delCaseMaterial({ materialId: file.materialId, caseIdArray: caseId }).then(res => {

        })
      }
    },
    handleRemove1(file) {
      if (file.materialId) {
        delCaseMaterial({ materialId: file.materialId,caseIdArray: this.caseData.map(item=>item.caseId)}).then(res => {

        })
      }
    },
    beforeLeave() {
      if(this.materialTypeId){
        // this.queryMaterialByCaseId()
      }
    },
    beforeUpload() {
      if (!this.docName || !this.materialTypeId){
        this.$message('请选择文件类型和填写文件名称')
        return false
      }
    },
    getUploadData(caseIds) {
      const data = {
        tokenID: this.$store.getters.token,
        caseIds: caseIds,
        custId: this.$route.query.custId,
        docName: this.docName,
        materialTypeId: this.materialTypeId
      }
      return data
    },
    onPreview(file) {
      var a = document.createElement('a');
      a.setAttribute('href', URL.createObjectURL(file.raw));
      a.setAttribute('id', 'startTelMedicine');
      a.setAttribute('target', '_blank');
      if(document.getElementById('startTelMedicine')) {
        document.body.removeChild(document.getElementById('startTelMedicine'));
      }
      document.body.appendChild(a);
      a.click();
    },
    queryMaterialTypeByDocId() {
      queryMaterialTypeByDocId({ taskType: 2,doctId:6 }).then(res => {
        this.typeNameList = res.data
      })
    },
    changeCbLawyer(e){
      Promise.all(e.map(item=>queryCaseWorkgroupUrl({userId:item}))).then(res=> {
        let list= this.$commonUtils.getLanglist(res.map(item=> item.data))
        list.forEach(item=>{
          item.trademarkCaseWorkgroupMembers=item.wkgUsers
        })
        this.trademarkCaseCBWorkgroups=this.$commonUtils.unique(list.concat(this.trademarkCaseCBWorkgroups),'wkgId')
        // console.log();
        // if(){
        //
        // }
        // this.trademarkCaseCBWorkgroups.map(item=>item.wkgId).diff(res.map(item=>item.data.wkgId))
        //
      })
    },
    removeTag(e){
      if(this.trademarkCaseCBWorkgroups.find(item => item.trademarkCaseWorkgroupMembers.map(i=>i.userId).includes(e))){
        this.trademarkCaseCBWorkgroups.splice(this.trademarkCaseCBWorkgroups.indexOf(this.trademarkCaseCBWorkgroups.find(item => item.trademarkCaseWorkgroupMembers.map(i=>i.userId).includes(e))),1)
      }
    },
    onsuccess(response, file, fileList) {
      this.materialIdList.push(response.data[0].materialId)
      console.log(fileList.length === this.materialIdList);
      if(fileList.length===this.materialIdList.length){
        this.cancel()
      }
    },
    cancel(){
      this.$router.history.go(-1)
    },
    submit(type){
      this.$refs['submission'].validate((valid) => {
        if (valid) {
          this.submitData.taskIdList=this.$route.query.taskId
          this.submitData.caseIds=this.caseData.map(item=>item.caseId)
          this.submitData.lawyer1UserId=this.lawyerUserIdList[0]
          if(this.lawyerUserIdList.filter(item=>!!item).length==2){
            this.submitData.lawyer2UserId=this.lawyerUserIdList[1]
          }
          this.submitData.lawyer2UserId=this.lawyerUserIdList[1]
          this.submitData.trademarkCaseCBWorkgroups=this.trademarkCaseCBWorkgroups
          assignCase(this.submitData).then(res=>{
            if(this.$refs.uploads.uploadFiles.length){
              this.$refs.uploads.submit()
            } else {
              this.cancel()
            }
           })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    queryUserAll(){
      queryUserAll().then(res=>{
        if(res.success){
          this.userList=res.data
        }
      })
    },
    formatDate(time){
      return this.$commonUtils.formatDate(time)
    },
  },
  watch: {
    // materialTypeId(n,o){
    //   modifyMaterialType({materialTypeId:n,materialIdList:[...new Set(getLanglist(this.uploadTable.map(item => item.materialArray.map(item => item.materialId))))]}).then(res=>{
    //     // this.queryMaterialByCaseId()
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
  .fade-enter-active{
    transition: opacity .5s
  }
  .fade-leave-active{
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }
  header{
    height: 62px;
    line-height:62px;
    font-size:22px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(51,51,51,1);
    padding-left: 20px;
    //border-bottom:1px solid #D4D5D5 ;
  }
  .title{
    font-family:'Arial Normal', 'Arial';
    color: #409EFF;
    font-weight: 400;
    height: 50px;
    line-height: 60px;
    padding-left: 50px;
  }
  .el-table.el-table1{
    margin:0 40px;
    width: auto;
    /deep/ tr:nth-of-type(1){
      th{
        background: rgba(242, 242, 242, 1);
      }
    }
  }
  .el-form{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
    margin:0 20px ;
    .el-row{
      min-height: 30px;
      width: 100%;
      display: flex;
      align-items: center;
      .el-form-item{
        width: 100%;
        display: flex;
        height: 100%;
        border: 1px solid #EBEEF5;
        border-bottom: 0;
        margin-bottom: 0;
        /deep/ .el-form-item__label{
          background: #f5f7fa;
          width: 206px;
        }
        /deep/ .el-form-item__content{
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
          position: relative;
        }
        /deep/ .el-form-item__error{
          position: relative;
          top: 0;
        }

      }

      .small-el-form-item{
        width: 50%;
        /deep/ .el-form-item__content{
          flex: 1;
          .pad20{
            padding-left: 20px;
          }
        }
      }
    }
    .el-row:nth-last-child(1){
      .el-form-item{
        border: 1px solid #EBEEF5;
      }
    }
  }
  .button_wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    .el-button{
      margin-left: 30px;
    }
  }
  .require /deep/ .el-form-item__label:before{
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
  .upload-demo{
    /deep/ .el-upload{
      width: 100%;
    }
    /deep/ .el-upload-dragger{
      height: 20px;
      width: 100%;
    }
    /deep/ .el-upload-list{
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      &:first-child{
        margin-top: 0;
      }
    }
  }
  .upload-demo1 ,.upload-demo{
    /deep/ .el-upload-list__item{
      transition: all 0s ;
      transform: translateY(0);
    }
    /deep/ .el-upload-list__item:first-child{
      margin-top: 0;
    }
    /deep/ .el-list-enter,.el-list-leave-active{
      visibility: hidden;
      opacity: 1;
      transition: all 0s;
      transform: translateY(0);
    }
    /deep/ .el-list-enter-active,.el-list-leave-active{
      display: none;
      transition: all 0s;
    }
  }
  .el-table{
    /deep/ th{
      padding:5px 0
    }
    /deep/ td {
      padding: 0 ;
    }
  }
</style>
