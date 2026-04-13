<template>
  <el-dialog
    v-dialogDrag
    center
    top="0"
    :title="title"
    height="852"
    :visible.sync="newlovingVue"
    :width="width"
    :modal="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="ruleForm" :model="formData" label-width="206px">
      <el-row>
        <el-form-item label="案件文号" class="caseNumber">
          {{formData.draftNumber}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="客户名称" class="small-el-form-item require" prop="custId">
          <el-select
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
      <el-row>
        <el-form-item label="案件类型" prop="caseType">
          <el-cascader
            ref="caseTypecascader"
            v-model="caseTypeIdList"
            filterable
            :show-all-levels="false"
            :options="$store.getters.caseTypeList"
            :props="defaultParams"
            placeholder="请选择"
            @change="catchange"
          />
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="案件个数">
          <span class="pad20">1</span>
         </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="立卷转交">
          <el-radio v-model="formData.isDeliver" label="0">否</el-radio>
          <el-radio v-model="formData.isDeliver" label="1">是</el-radio>
        </el-form-item>
      </el-row>
      <el-row>
        <transition name="fade">
          <el-form-item v-show="formData.isDeliver==='1'" label="选择转交人">
            <el-select v-model="formData.deliverId" default-first-option filterable clearable placeholder="请选择">
              <el-option
                v-for="item in queryDeliverList"
                :key="item.userId"
                :label="item.nameEmail"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </transition>
      </el-row>
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
    </el-form>
    <div slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
      <el-button @click="newlovingVue = false"  size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { createCode, createTask, queryCaseType, queryCustomerNameId, queryDeliver, queryWithdraw,copyCaseData } from '@/api/caseList.js'
  import { heighCreditUrl, queryCaseInfoUrl } from '@/api/caseDetail'
  import { mapGetters } from 'vuex'
  export default {
    props:{
      projectId:{

      },

      width:{
        default:'50%'
      },
      title:{
        default:'转案'
      },
      lovingVue: {
      },
    },
    model:{
      prop: 'lovingVue',
      event: 'change'
    },
    name: "index",
    created() {
      // this.createCode()
      this.queryDeliver()
    },
    data(){
      return{
        dialogVisible:false,
        newlovingVue: this.lovingVue,
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
          draftNumber: '',
          isBatch: '0',
          isDeliver: '0',
          remark: '',
          caseType: '商标侵权',
          caseTypeIdList:[109],
        },
        defaultParams: { // 級聯菜單默認
          value: 'caseTypeId',
          label: 'caseType',
          children: 'childrens',
          checkStrictly: false
        },
        caseTypeIdList:[2,18,109],// 当前选择的案件了类型 默认为商标注册
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
      }
    },
    methods:{
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

        return createCode()
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
    async  createTask() {
      let res=await createCode()
      this.formData.draftNumber = res.data
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
        if(this.caseTypeIdList.includes(75)){
          data.taskType = 5
        }
        if(this.caseTypeIdList.includes(76)){
          data.taskType = 6
        }
        if(this.caseTypeIdList.includes(86)){
          data.taskType = 7
        }
        createTask(data).then(res=>{
          let caseId=res.data
          copyCaseData({caseId,projectId:this.projectId}).then(res=>{
            this.$router.replace({path:'/workbench/case/case_detail/' + caseId+'/'+this.formData.caseType, query: { pageId: 100 ,taskType:data.taskType,agentNum: data.draftNumber}})

          })
        })
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
    watch:{
      newlovingVue: function(newVal,oldVal){
        this.$emit('change',newVal)
      },
      lovingVue(n) {
        this.newlovingVue = n
      },
    },
    computed: {
      ...mapGetters(['userId']),
    }

  }
</script>

<style scoped>

</style>
