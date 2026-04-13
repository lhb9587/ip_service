<template>
  <div>
    <header>{{ $route.meta.title }}</header>
    <el-form ref="ruleForm" :model="formData" label-width="206px">
      <el-row>
          <el-form-item label="案件文号" class="caseNumber" :class="formData.usAgency ? 'small-el-form-item' : ''">
            {{formData.draftNumber}} <el-button v-if="!$route.query.caseId" type="primary" size="mini" style="margin-left: 10px;" @click="$router.push(`transferCase/${formData.draftNumber}`)">转案</el-button>
          </el-form-item>
          <el-form-item v-if="isUsWorkGroup" label="US案件" class="small-el-form-item">
            <el-radio v-model="formData.usAgency" :label="0">否</el-radio>
            <el-radio v-model="formData.usAgency" :label="1">是</el-radio>
          </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="客户名称" class="small-el-form-item require" prop="custId">
          <span v-if="$route.query.custName">{{$route.query.custName}}</span>
          <el-select
            v-else
            ref="custSelect"
            v-model="formData.custId"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="queryCustomerNameId"
            @change="selectCustChange">
            <el-option
              v-for="item in queryCustomerNameIdList"
              :key="item.custId"
              :label="item.fullname"
              :value="item.custId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户信用等级" class="small-el-form-item">
          <span class="pad20">{{ custLevel }}</span>
        </el-form-item>
      </el-row>
<!--        </div>-->
<!--      </transition>-->
<!--      <transition name="fade">-->
<!--        <el-row v-if="formData.isBatch==='1'">-->
<!--          <el-form-item label="批量立卷" class="require">-->
<!--            <el-button type="primary" style="float:right" @click="pushBatchInfos">新增</el-button>-->
<!--            <el-table>-->
<!--              <el-table-column label="案件类型" >-->
<!--                <template slot="header" slot-scope="scope">-->
<!--                  <table class="table" width="100%" cellspacing="0" cellpadding="0" >-->
<!--                    <tr>-->
<!--                      <th width="auto" class="requireRule">案件类型</th>-->
<!--                      <th width="auto">案件个数</th>-->
<!--                      <th width="auto" v-if="getManyWithState">撤回案件类型</th>-->
<!--                      <th width="auto" >操作</th>-->
<!--                    </tr>-->
<!--                    <tr v-for="item,index in formData.batchInfos">-->
<!--                      <th>-->
<!--                        <el-cascader-->
<!--                          filterable-->
<!--                          clearable-->
<!--                          v-model="formData.batchInfos[index].caseTypeIdList"-->
<!--                          :show-all-levels="false"-->
<!--                          :options="caseTypeOptions"-->
<!--                          :props="defaultParams"-->
<!--                          placeholder="请选择"-->
<!--                        ></el-cascader></th>-->
<!--                      <th><el-input placeholder="请输入内容"  type="number" v-model="formData.batchInfos[index].caseNumber" @mousewheel.native.prevent @change="(number)=>ruleNum(number,index)"></el-input></th>-->
<!--                      <th :style="{visibility:[48,62].includes(Number(formData.batchInfos[index].caseTypeIdList[formData.batchInfos[index].caseTypeIdList.length-1]))?'visible':'hidden'}" v-if="getManyWithState"> <el-select-->
<!--                        v-model="formData.batchInfos[index].changeType">-->
<!--                        <el-option-->
<!--                          v-for="item in formData.batchInfos[index].caseTypeIdList[formData.batchInfos[index].caseTypeIdList.length-1]==48?withdrawList:withdrawList2"-->
<!--                          :key="item"-->
<!--                          :label="item"-->
<!--                          :value="item"-->
<!--                        >-->
<!--                        </el-option>-->
<!--                      </el-select>-->
<!--                      </th>-->
<!--                      <th><el-button type="text" size="small" @click="deleteBatchInfos(index)">删除</el-button></th>-->
<!--                    </tr>-->
<!--                  </table>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--            </el-table>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--      </transition>-->
      <el-row>
<!--        <el-form-item label="领域" class="small-el-form-item require">-->
<!--          <div v-if="isRouter">诉讼</div>-->
<!--          <el-select-->
<!--            v-else-->
<!--            v-model="fieldId"-->
<!--            filterable-->
<!--            clearable-->
<!--            reserve-keyword-->
<!--            placeholder="请输入关键词"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="item in caseTypeOptions"-->
<!--              :key="item.caseTypeId"-->
<!--              :label="item.caseType"-->
<!--              :value="item.caseTypeId"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="案件类型" prop="caseType">
<!--          <el-cascader-->
<!--            v-if="isRouter"-->
<!--            ref="caseTypecascader"-->
<!--            v-model="caseTypeIdList"-->
<!--            filterable-->
<!--            :show-all-levels="false"-->
<!--            :options="caseTypeOptions"-->
<!--            :props="defaultParams"-->
<!--            placeholder="请选择"-->
<!--            @change="catchange"-->
<!--          />-->
          <el-cascader
            ref="caseTypecascader"
            v-model="caseTypeIdList"
            filterable
            :show-all-levels="false"
            :options="caseTypeOptions"
            :props="defaultParams"
            placeholder="请选择"
            @change="catchange"
            :disabled="formData.usAgency"
          />
<!--          <el-multi-cascader-->
<!--            v-if="fieldId==1&&!isRouter"-->
<!--            ref="multiCascader"-->
<!--            v-model="protectcaseTypeIdList"-->

<!--            :options="caseTypeOptions.filter(item=>item.caseTypeId==fieldId)"-->
<!--            multiple-->
<!--            filterable-->
<!--            clearable-->
<!--            :props="defaultParams"-->
<!--            change-on-select-->
<!--            select-children-->
<!--            @change="multiCatchange"-->
<!--          />-->
        </el-form-item>
      </el-row>
      <el-row v-if="formData.usAgency">
        <el-form-item label="案件名称" class="">
          <el-input
            v-model="formData.caseName"
            placeholder="请输入案件名称"
          />
        </el-form-item>
      </el-row>

      <!--      <transition name="fade">-->
      <!--        <div v-if="formData.isBatch==='0'">-->
      <el-row v-if="!formData.usAgency">

        <el-form-item label="案件个数">
          <span v-if="formData.isBatch=='0'" class="pad20">1</span>
          <el-input v-if="formData.isBatch=='1'" v-model="formData.batchInfos[0].caseNumber" placeholder="请输入内容" type="number" @mousewheel.native.prevent @change="(number)=>ruleNum(number,0)" />
        </el-form-item>
      </el-row>
      <el-row v-if="formData.caseType==='撤回商标申请' && !formData.usAgency">
        <el-form-item label="撤回案件类型" class="require">
          <el-select
            v-model="formData.changeType"
            filterable
          >
            <el-option
              v-for="item in withdrawList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row v-if="formData.caseType==='撤回商标评审' && !formData.usAgency">
        <el-form-item label="撤回案件类型" class="require">
          <el-select
            v-model="formData.changeType"
            filterable
          >
            <el-option
              v-for="item in withdrawList2"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row v-if="(caseTypeIdList.includes(3) || caseTypeIdList.includes(4)) && !formData.usAgency">
        <el-form-item label="批量立卷">
          <el-radio v-model="formData.isBatch" label="0">否</el-radio>
          <el-radio v-model="formData.isBatch" :disabled="isRouter" label="1">是</el-radio>
        </el-form-item>
      </el-row>
      <el-row v-if="!formData.usAgency">
        <el-form-item label="立卷转交">
          <el-radio v-model="formData.isDeliver" label="0">否</el-radio>
          <el-radio v-model="formData.isDeliver" label="1">是</el-radio>
        </el-form-item>
      </el-row>
      <el-row v-if="!formData.usAgency">
        <transition name="fade">
          <el-form-item v-show="formData.isDeliver==='1'" label="选择转交人">
            <el-select v-model="formData.deliverId" default-first-option filterable clearable placeholder="请选择">
              <el-option
                v-for="item in queryDeliverList"
                :key="item.userId"
                :label="item.nameEmail"
                :value="item.userId"
              >
              <!--<span style="float: left">{{ item.fullname }}</span>-->
              <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.email }}</span>-->
              </el-option>

            </el-select>
          </el-form-item>
        </transition>
      </el-row>
      <!--      <el-row>-->
      <!--        <el-form-item label="上传案件所需文档">-->
      <!--          <el-upload-->
      <!--            ref="uploadFile"-->
      <!--            :action="uploadFile"-->
      <!--            :file-list="fileList"-->
      <!--            :auto-upload="false"-->
      <!--            :data="postFileData"-->
      <!--            :before-upload="beforeUpload"-->
      <!--          >-->
      <!--            <el-button size="small" type="primary" style="position: absolute;right: 0;top: 5px;">点击上传</el-button>-->
      <!--          </el-upload>-->
      <!--        </el-form-item>-->
      <!--      </el-row>-->
      <el-row>
        <el-form-item label="立卷备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            placeholder="请输入内容"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
      </el-row>
      <div class="button_wrap">
        <el-button class="exactButton" plain @click="cancel">返回</el-button>
        <el-button class="exactButton" type="primary" @click="submit">确定</el-button>
      </div>
    </el-form>

  </div>
</template>

<script>
import { createCode, createTask, queryCaseType, queryCustomerNameId, queryDeliver, queryWithdraw } from '@/api/caseList.js'
import { heighCreditUrl, queryCaseInfoUrl } from '@/api/caseDetail'
import { queryUserById } from '@/api/systemList'
import { uploadFile } from '@/api/serviceApi.config.js'
import { mapGetters } from 'vuex'
import {getMenuName} from "../../../../utils";
// import {getTwoDimensionalArray} from '@/utils'
export default {
  name: 'Registration',
  data() {
    return {
      fieldId: 3,
      flag: false,
      custName: '',
      loading: false,
      custLevel: '', // 客户信用等级
      caseTypeOptions: [], // 案件类型集合
      postFileData: {// 上传文件信息
        tokenID: this.$store.getters.token
      },
      formData: { // 提交上传信息
        usAgency: 0,
        draftNumber: '',
        isBatch: '0',
        isDeliver: '0',
        remark: '',
        caseType: '商标注册',
        caseTypeIdList:[185],
        batchInfos: [{
          caseTypeIdList: [3, 27, 185],
          // caseTypeIdList:[],
          caseTypeId: '',
          caseNumber: '',
          caseTypeName: '',
          custId: ''
        }]
      },
      uploadFile: uploadFile, // 上传路径
      defaultParams: { // 級聯菜單默認
        value: 'caseTypeId',
        label: 'caseType',
        children: 'childrens',
        checkStrictly: false
      },
      caseTypeIdList:[3,27,185],// 当前选择的案件了类型 默认为商标注册
      queryDeliverList:[],// 转交人列表
      queryCustomerNameIdList:[],// 客户信息列表
      fileList:[],// 上传文件列表,
      withdrawList:[],
      withdrawList2:[],
      caseIds: [],
      taskId: 0,
      caseData: {},
      isRouter: false,
      litgationList: [],
      litgationForm: {
        caseTypeId: 0
      },
      protectcaseTypeIdList: [],
      isUsWorkGroup: false
    }
  },
  watch: {
    'formData.usAgency': {
      handler(n){
        if (n) {
          this.caseTypeIdList = [3, 113, 217]
          this.$set(this.formData, 'caseTypeIdList', [217])
          this.$set(this.formData, 'caseType', '其他')
        }
      },
      immediate: true
    }
  },
  created() {

    if(this.$route.query&&this.$route.query.caseTypeId){
      this.isRouter = true
      this.fieldId = 2
      this.caseData = this.$route.query
      this.formData.caseType = '建议'
      this.litgationForm.caseTypeId = this.$route.query.caseTypeId
      this.caseTypeIdList = [2]
      this.formData.caseTypeIdList = this.caseTypeIdList[this.caseTypeIdList.length - 1]
    }
    this.queryUserWkg()
    this.createCode()
    this.queryCaseType()
    this.queryDeliver()
    this.queryWithdraw(48)
    this.queryWithdraw(62)
  },
  methods: {
    queryUserWkg(){
      queryUserById(this.$store.getters.userId).then(res => {
        if (res.data.groups && res.data.groups.find(item => item.wkgId === 300080)) {
          this.isUsWorkGroup = true
        }
      })
    },
    queryDeliver() {
      queryDeliver().then(res => {
        this.queryDeliverList = res.data
      })
    },
    catchange(e) {
      this.formData.caseType = this.$refs.caseTypecascader.currentLabels[this.$refs.caseTypecascader.currentLabels.length - 1]
      this.formData.caseTypeIdList = [this.caseTypeIdList[this.caseTypeIdList.length - 1]]
      if (this.caseTypeIdList.includes(2)) {
        this.formData.isBatch = '0'
      }
    },
    multiCatchange(e) {
      let currentList=e.map(item=>item[item.length-1])
      let lastNodeList=this.$commonUtils.getMenuName(this.caseTypeOptions.filter(item=>item.caseTypeId==this.fieldId)).filter(item=>!item.childrens)
      this.formData.caseTypeIdList = currentList.filter(item=>lastNodeList.find(i=>i.caseTypeId==item))
      this.formData.caseType = '保护'
    },
    ruleNum(number, index) {
      if (!/^[0-9]*[1-9][0-9]*$/.test(number)) {
        this.$message('您必须输入数字类型为整数的1以上的阿拉伯数字，不能输入特殊符号、汉字、英文字母')
        this.flag = false
        this.formData.batchInfos[index].caseNumber = parseInt(number) > 0 ? parseInt(number) : 1
      } else {
        this.flag = true
      }
    },
    selectCustChange(e){
      let choosenItem = this.queryCustomerNameIdList.find(item => item.custId === e);
      if(choosenItem) {
        this.custLevel=choosenItem.level
        this.formData.custfullname=choosenItem.fullname
      }
    },
    createCode() {
      createCode().then(res => {
        this.formData.draftNumber = res.data
      })
      if(this.isRouter) {
        this.formData.custId = this.caseData.custId
        this.custLevel = this.caseData.custLevel
        queryCustomerNameId({curStatus: '4,5', pageNo: 0, pageSize: 100, keyword: this.caseData.custName }).then(res => {
          this.queryCustomerNameIdList = res.data
          this.loading = false;
        })
      }
    },
    queryWithdraw(caseTypeId) {
      queryWithdraw({ caseTypeId }).then(res => {
        if (caseTypeId === 48) {
          this.withdrawList = res.data
        } else {
          this.withdrawList2 = res.data
        }
      })
    },
    ruleForm() {
      let flag = true
      if (this.formData.isBatch === '1') {
        this.formData.batchInfos.forEach(item => {
          if (!item.caseNumber) {
            this.$message.error('请选择案件个数')
            flag = false
          }
        })
        if (!this.flag) {
          return false
        }
      }
      if (this.formData.caseType === '撤回商标评审' || this.formData.caseType === '撤回商标申请') {
        if (!this.formData.changeType) {
          this.$message.error('请选择撤回类型')
          return false
        }
      }
      if (!this.formData.custId) {
        this.$message.error('请选择客户信息')
        return false
      }
      if (!this.formData.draftNumber) {
        this.$message.error('请检查案件文号')
        return false
      }
      if (this.caseTypeIdList.length === 0) {
        this.$message.error('请选择案件类型')
        return false
      }
      // if(this.formData.isBatch==='1'){
      //   // this.formData.batchInfos.forEach(item=>{
      //   //   if(item.caseTypeIdList.length===0){
      //   //     this.$message.error('请选择案件类型');
      //   //     return flag=false
      //   //   }
      //   // })
      //
      //
      // }
      return flag
    },
    beforeUpload(file) {
      this.postFileData.fileNames = file.name
    },
    submit() {
      if (this.ruleForm()) {
        // this.postFileData.userId=this.userId
        // this.postFileData.draftCaseNumber=this.formData.draftNumber
        // this.$refs.uploadFile.submit();
        this.createTask()
      }
    },
    cancel() {
      this.$router.history.go(-1)
    },
    createTask() {
      if (this.formData.isDeliver == 1 && !this.formData.deliverId) {
        this.$message.error('请选择转交人')
        return
      }
      const data = this.formData
      data.userId = this.userId
      data.level = this.custLevel
      if(this.formData.isBatch==='0'){
        // this.formData.caseTypeId= this.caseTypeIdList[this.caseTypeIdList.length-1]
        this.formData.caseNumber=1
      }
      if (this.formData.isBatch === '1') {
      //  const arr = util.getMenuName(this.caseTypeOptions).filter(item=>item!==null)
        data.batchInfos.forEach(item => {
          item.caseTypeId = this.caseTypeIdList[this.caseTypeIdList.length - 1]// item.caseTypeIdList[item.caseTypeIdList.length-1]
          item.caseTypeName = this.formData.caseType// arr.find(i=>i.caseTypeId===item.caseTypeIdList[item.caseTypeIdList.length-1]).caseType
        })
        if ([48, 62].includes(Number(this.caseTypeIdList[this.caseTypeIdList.length - 1]))) {
          data.batchInfos[0].caseType = this.formData.changeType
        }
      }

      if(this.caseTypeIdList.includes(2)){
        data.taskType = 2
      }
      if(this.caseTypeIdList.includes(1)){
        data.taskType = 3
      }
      if(this.caseTypeIdList.includes(4)){
        data.taskType = 4
      }
      if(this.caseTypeIdList.includes(75)){
        data.taskType = 5
      }
      if(this.caseTypeIdList.includes(76)){
        data.taskType = 6
      }
      if(this.caseTypeIdList.includes(86)){
        data.taskType = 7
      }
      if(data.caseType == '建议') {
        data.level = 'VIP'
        createTask(data).then(res=>{
          this.caseIds.push(res.data)
          const memo = res.data.remark
          queryCaseInfoUrl({caseIds: this.caseIds, memo: memo, ...data}).then(res=>{
            this.taskId = res.data.taskId
            heighCreditUrl({caseId:this.caseIds[0],taskId: this.taskId, ...data}).then(res=>{
              localStorage.setItem('suggestionData', res.data)
              this.$message.success('立卷成功！')
              this.$router.push('/workbench/case/civilSuit')
            })
          })
        })
      }else{
        createTask(data).then(res=>{
          if (this.formData.usAgency) {
            this.$router.go(-1)
            return
          }
        if(this.formData.isDeliver==='1'){
      // if (this.$commonUtils.getTwoDimensionalArray(this.$store.getters.caseTypeList, 'caseTypeId', this.formData.caseTypeIdList).includes(2)) {
      //
      // }
          this.$router.push('/workbench/toDoTask')
        }else if(this.formData.isBatch==='0'&&this.formData.isDeliver==='0') {
          if(this.caseData.caseId) {
            this.$router.replace({path:'/workbench/case/case_detail/' + res.data+'/'+this.formData.caseType, query: { pageId: 100 ,taskType:data.taskType, caseId:this.caseData.caseId,agentNum: data.draftNumber,type:'massfiling'}})
          }else{
            this.$router.replace({path:'/workbench/case/case_detail/' + res.data+'/'+this.formData.caseType, query: { pageId: 100 ,taskType:data.taskType,agentNum: data.draftNumber,type:'massfiling'}})
          }
        }else if(this.formData.isBatch==='1'&&this.formData.isDeliver === '0'){
          const taskId=res.data[0].taskId
          this.$router.replace({path:'massfiling',query:{taskId,taskType: this.caseTypeIdList.includes(4) ? 4 : 1 }})
        }
      })
      }

    },

    queryCustomerNameId(query) {
      if (!this.loading) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            queryCustomerNameId({ curStatus: '4,5', pageNo: 0, pageSize: 100, keyword: query }).then(res => {
              this.queryCustomerNameIdList = res.data
              this.loading = false
            })
          }, 200)
        }
      } else {
        this.queryCustomerNameIdList = []
      }
    },
    queryCaseType() {
      queryCaseType().then(res => {
        this.caseTypeOptions = res.data
      })
    },
    pushBatchInfos() {
      this.formData.batchInfos.push({
        caseTypeIdList: [3, 27, 185],
        caseTypeId: '',
        caseNumber: '',
        caseTypeName: ''
      })
    },
    deleteBatchInfos(index) {
      this.formData.batchInfos.splice(index, 1)
    },
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].childrens.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].childrens = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].childrens)
        }
      }
      return data
    },
    getLanglist(array) {
      const arr = []
      array.forEach(item => {
        arr.push(...item)
      })
      return arr
    }
  },
  computed: {
    ...mapGetters(['userId']),
    getManyWithState() {
      return [...new Set(this.getLanglist(this.formData.batchInfos.map(item => item.caseTypeIdList)))].some((id) => [48, 62].includes(id))
    }
  }
}
var util = {

}
// 将多级数组合并
util.getMenuName = function(obj) {
  var arr = []
  arr.push(obj)
  for (var i = 0, len = obj.length; i < len; i++) {
    arr.push(obj[i].childrens)
    if (obj[i].childrens != null && obj[i].childrens.length > 0) {
      var factorial = function() {
        var _obj = arguments[0]
        for (var j = 0, _len = _obj.length; j < _len; j++) {
          arr.push(_obj[j].childrens)
          if (_obj[j].childrens != null && _obj[j].childrens.length > 0) {
            factorial(_obj[j].childrens)
          }
        }
      }
      factorial(obj[i].childrens)
    }
  }
  var result = []
  for (let i = 0; i < arr.length; i++) {
    result = result.concat(arr[i])
  }
  return result.filter(item => item !== undefined && item !== null)
}

</script>

<style lang="scss" scoped>
  .fade-enter-active{
    transition: opacity .5s
  }
  .fade-leave-active{
    transition: opacity 0s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }
.el-row{
  display: flex;
  align-items: center;
  .el-form-item{
      border: 1px solid #EBEEF5;
    background: #f5f7fa;
   /deep/ .el-form-item__content{
     background: #fff;
     width: 738px;
     padding-left: 10px;
    }
  }
  .small-el-form-item{
    /deep/ .el-form-item__content{
      width: 265px;
     .pad20{
        padding-left: 20px;
      }
    }
  }
}
.el-form{
  border: 1px solid #99a9bf;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 20px;
  margin:0 20px ;
  /deep/ .el-upload-list{
    max-height: 100px;
    overflow: auto;
  }
}
.button_wrap {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 0 400px;
}
.require /deep/ .el-form-item__label:before{
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
  .requireRule:before{
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
.el-table /deep/ th {
  background-color: #ffffff;
  color: #7199d5;
  text-align: left;
  .el-cascader{

  }
}
.el-table /deep/ .el-table__empty-block{display: none}
  header{
    border: 1px solid #99a9bf;
    border-bottom: 0;
    margin: 20px 20px 0 20px;
    height: 60px;
    text-indent: 40px;
    font-size: 26px;
    line-height: 80px;
  }
  .table{
    border:1px solid #f4f4f5;
    th{border:1px solid #f4f4f5; }
  }
</style>
