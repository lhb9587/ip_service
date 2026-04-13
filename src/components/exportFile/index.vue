<template>
  <el-menu ref="elMenu" class="el-menu-demo" mode="horizontal" :default-openeds="openIndex"  @select="handleSelect" menu-trigger="click" unique-opened @open="clickMenu" v-clickoutside="clickoutside">
    <el-submenu index="1">
      <template slot="title">模板生成</template>
      <template v-if="pageTitle==='官方通知'">
        <el-menu-item index="发文签收单">发文签收单</el-menu-item>
        <el-menu-item index="时限官文提醒">时限官文提醒</el-menu-item>
        <el-menu-item index="邮寄清单-内部">邮寄清单-内部</el-menu-item>
        <el-menu-item index="邮寄清单-寄客户">邮寄清单-寄客户</el-menu-item>
      </template>
      <el-submenu index="1-1-1" v-if="pageTitle!=='官方通知' && business != 11">
        <template slot="title">递交官方</template>
        <el-menu-item v-if="business == 2" index="1-1-1-1" >申请书</el-menu-item>
        <el-menu-item :index="'委托书'+item.code" v-for="(item,index) in wtsExtendList">{{item.name}}</el-menu-item>
        <el-menu-item :index="'材料目录'+item.code" v-for="(item,index) in ofMaterialList">{{item.name}}</el-menu-item>

        <!--<el-menu-item index="1-1-1-2" >商标代理委托书（中文）</el-menu-item>-->
        <!--<el-menu-item index="1-1-1-3" >商标代理委托书（中英文）</el-menu-item>-->
        <!--<el-menu-item index="1-1-1-4" >商标评审代理委托书（中文）</el-menu-item>-->
        <!--<el-menu-item index="1-1-1-5" >商标评审代理委托书（中英文）</el-menu-item>-->
      </el-submenu>
      <template v-if="pageTitle!=='官方通知' && business == 11">
        <el-menu-item :index="'委托书'+item.code" v-for="(item,index) in wtsExtendList">{{item.name}}</el-menu-item>
<!--        <el-menu-item :index="'材料目录'+item.code" v-for="(item,index) in ofMaterialList">{{item.name}}</el-menu-item>-->
      </template>
<!--      <el-submenu index="1-1-1">-->
<!--        <template slot="title">递交官方</template>-->
<!--&lt;!&ndash;        <el-menu-item v-if="business == 2" index="1-1-1-1" >申请书</el-menu-item>&ndash;&gt;-->
<!--        <el-menu-item :index="'委托书'+item.code" v-for="(item,index) in wtsExtendList">{{item.name}}</el-menu-item>-->
<!--        <el-menu-item :index="'材料目录'+item.code" v-for="(item,index) in ofMaterialList">{{item.name}}</el-menu-item>-->

<!--        &lt;!&ndash;<el-menu-item index="1-1-1-2" >商标代理委托书（中文）</el-menu-item>&ndash;&gt;-->
<!--        &lt;!&ndash;<el-menu-item index="1-1-1-3" >商标代理委托书（中英文）</el-menu-item>&ndash;&gt;-->
<!--        &lt;!&ndash;<el-menu-item index="1-1-1-4" >商标评审代理委托书（中文）</el-menu-item>&ndash;&gt;-->
<!--        &lt;!&ndash;<el-menu-item index="1-1-1-5" >商标评审代理委托书（中英文）</el-menu-item>&ndash;&gt;-->
<!--      </el-submenu>-->
<!--      <el-submenu v-if="business == 2" index="1-1-2"  class="bgkh">-->
<!--        <template slot="title">报告客户—中文</template>-->
<!--        <el-menu-item :index="'报告客户'+item.id" v-for="(item,index) in bgCustTypeList.filter(item=>item.businessType==1)">{{item.name}}</el-menu-item>-->
<!--      </el-submenu>-->
<!--      <el-submenu v-if="business == 2" index="1-1-3" class="bgkh">-->
<!--        <template slot="title">报告客户—英文</template>-->
<!--        <el-menu-item :index="'报告客户'+item.id" v-for="(item,index) in bgCustTypeList.filter(item=>item.businessType==2)">{{item.name}}</el-menu-item>-->
<!--      </el-submenu>-->


      <el-submenu v-if="business == 3 || business == 2" index="1-1-2"  class="bgkh" @click.native="clickSub('1-1-2')">
        <template slot="title">{{business == 3 ? '致函客户' : '报告客户'}}—中文</template>
        <el-menu-item index="loading" v-if="loading">加载中...</el-menu-item>
        <el-menu-item index="noData" v-if="noData">无数据</el-menu-item>
        <el-submenu :index="`1-1-2-1-${index}`" v-for="(item,index) in jieduanList" :key="index" @click.native="queryPatentMailType(1,item.jieduan)">
          <template slot="title">{{item.jieduan}}</template>
          <el-menu-item index="nextLoading" v-if="nextLoading">加载中...</el-menu-item>
          <el-menu-item index="nextNoData" v-if="nextNoData">无数据</el-menu-item>
          <el-menu-item :index="`${business == 3 ? '#1#' : '报告客户'}${it.mailType}`" v-for="(it,ind) in mailTypeAllList">{{it.mailTypeDesc || it.name}}</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu v-if="business == 3 || business == 2" index="1-1-3" class="bgkh" @click.native="clickSub('1-1-3')">
        <template slot="title">{{business == 3 ? '致函客户' : '报告客户'}}—英文</template>
        <el-menu-item index="loading" v-if="loading">加载中...</el-menu-item>
        <el-menu-item index="noData" v-if="noData">无数据</el-menu-item>
        <el-submenu :index="`1-1-2-1-${index}`" v-for="(item,index) in jieduanList" :key="index" @click.native="queryPatentMailType(2,item.jieduan)">
          <template slot="title">{{item.jieduan }}</template>
          <el-menu-item index="nextLoading" v-if="nextLoading">加载中...</el-menu-item>
          <el-menu-item index="nextNoData" v-if="nextNoData">无数据</el-menu-item>
          <el-menu-item :index="`${business == 3 ? '#2#' : '报告客户'}${it.mailType}`" v-for="(it,ind) in mailTypeAllList">{{it.mailTypeDesc || it.name}}</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu v-if="business == 2" index="1-1-5" class="bgkh" @click.native="clickSub('1-1-5')">
        <template slot="title">{{'报告客户'}}—日文</template>
        <el-menu-item index="loading" v-if="loading">加载中...</el-menu-item>
        <el-menu-item index="noData" v-if="noData">无数据</el-menu-item>
        <el-submenu :index="`1-1-2-1-${index}`" v-for="(item,index) in jieduanList" :key="index" @click.native="queryPatentMailType(4,item.jieduan)">
          <template slot="title">{{item.jieduan }}</template>
          <el-menu-item index="nextLoading" v-if="nextLoading">加载中...</el-menu-item>
          <el-menu-item index="nextNoData" v-if="nextNoData">无数据</el-menu-item>
          <el-menu-item :index="`${'报告客户'}${it.mailType}`" v-for="(it,ind) in mailTypeAllList">{{it.mailTypeDesc || it.name}}</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu v-if="business == 3 || business == 2" index="1-1-4" class="bgkh" @click.native="clickSub(business == 2 ? '1-1-4' : '1-1-6')">
        <template slot="title">指示外代所—英文</template>
        <el-menu-item index="loading" v-if="loading">加载中...</el-menu-item>
        <el-menu-item index="noData" v-if="noData">无数据</el-menu-item>
        <el-submenu :index="`1-1-2-1-${index}`" v-for="(item,index) in jieduanList" :key="index" @click.native="queryPatentMailType(business == 2 ? 3 : 2,item.jieduan)">
          <template slot="title">{{item.jieduan }}</template>
          <el-menu-item index="nextLoading" v-if="nextLoading">加载中...</el-menu-item>
          <el-menu-item index="nextNoData" v-if="nextNoData">无数据</el-menu-item>
          <el-menu-item :index="`指示外代所${it.mailType}`" v-for="(it,ind) in mailTypeAllList">{{it.mailTypeDesc || it.name}}</el-menu-item>
        </el-submenu>
      </el-submenu>
      <!--<el-menu-item  index="1-3" >-->
        <!--<template slot="title">结果导出</template>-->
      <!--</el-menu-item>-->
    </el-submenu>
  </el-menu>
</template>

<script>
  import { queryJieduan, queryPatentMailType, queryJieduanOfMailType, queryMailTypeByJieduan} from '@/api/mailList'
import { createGovList, createForm, queryMandate, createPOA, queryAllMailType, createMailByself, queryListOfMaterial, createListOfMaterial, createReceipt ,excelMould} from '@/api/formList.js'
import { downLoadAll, getLanglist } from '@/utils'
import jsFileDownload from 'js-file-download'
import axios from 'axios'
export default {
  props:{
    isTimeLimit: {
      type: Boolean,
      default: false
    },
    business: {
      type: Number,
      default: 2
    },
    downLoadState:{

    },
    multipleSelection:{
      type: Array,
      default: ()=>[]
    },
  },
  name: "index",
  data(){
    return{
      // timeLimitDataList: [],
      openIndex: [],
      mailTypeAllList: [],
      jieduanList: [],
      noData: false,
      nextNoData: false,
      loading: false,
      nextLoading: false,
      currentType:'',
      pageTitle :this.$route.meta.title,
      wtsExtendList:[],
      bgCustTypeList:[],
      ofMaterialList:[]
    }
  },
  created(){
    this.queryMandate()
    // this.queryAllMailType()
    this.business !=3 && this.queryListOfMaterial()
  },
  methods:{
    async clickMenu(){
      // taskType和business对应关系
      const map = {
        1: 2,
        2: 11,
        3: 23,
        4: 3,
        5: 5,
        6: 4,
        7: 6
      }

      this.isTimeLimit && await this.$emit('selectedRows')

      if(this.multipleSelection.length){
        let list = this.multipleSelection.map(i=>i.taskType)
        if([...new Set(list)].length > 1 && this.isTimeLimit){
          this.$message.error('只能选择一种案件类型!')
          this.openIndex = []
        }else if([...new Set(list)].length === 1 && this.isTimeLimit){
          this.$emit('update:business', map[[...new Set(list)][0]])
        }
      }else{
        this.$message.error('请选择数据!')
        this.openIndex = []
      }

    },
    clickoutside(){
      this.openIndex = []
    },
    queryPatentMailType(businessType,jieduan){
      this.nextLoading = true
      this.nextNoData = false
      this.mailTypeAllList = []
      if(this.business == 3) {
        queryPatentMailType({
          businessType,
          jieduan,
          caseIds:this.multipleSelection.map(item=>item.caseId)
        }).then(res=>{
          this.nextLoading = false
          this.mailTypeAllList = res.data.filter(item=>!!item)
          this.mailTypeAllList&&!this.mailTypeAllList.length&&(this.nextNoData = true)
        }).catch(err=>{
          this.mailTypeAllList = []
          this.nextLoading = false
          this.nextNoData = true
        })
      }else if (this.business == 2) {
        queryMailTypeByJieduan({
          businessType,
          jieduan
        }).then(res=>{
          this.nextLoading = false
          this.mailTypeAllList = res.data.filter(item=>!!item)
          this.mailTypeAllList&&!this.mailTypeAllList.length&&(this.nextNoData = true)
        }).catch(err=>{
          this.mailTypeAllList = []
          this.nextLoading = false
          this.nextNoData = true
        })
      }
    },
    queryJieduan(businessType,otherFlag){
      this.loading = true
      this.noData = false
      this.jieduanList = []
      if(this.business === 3) {
        queryJieduan({
          caseIds:this.multipleSelection.map(item=>item.caseId),
          businessType,
          otherFlag,
        }).then(res=>{
          this.loading = false
          this.jieduanList = res.data.filter(item=>!!item)
          this.jieduanList&&!this.jieduanList.length&&(this.noData = true)
        }).catch(err=>{
          this.jieduanList = []
          this.loading = false
          this.noData = true
        })
      }else if (this.business === 2) {
        queryJieduanOfMailType({
          businessType
        }).then(res=>{
          this.loading = false
          this.jieduanList = res.data.filter(item=>!!item)
          this.jieduanList&&!this.jieduanList.length&&(this.noData = true)
        }).catch(err=>{
          this.jieduanList = []
          this.loading = false
          this.noData = true
        })
      }

    },
    clickSub(key){
      switch (key) {
        case '1-1-2':
          this.queryJieduan(1)
          break
        case '1-1-3':
          this.queryJieduan(2)
          break
        case '1-1-4':
          this.queryJieduan(3)
          break
        case '1-1-5':
          this.queryJieduan(4)
          break
        case '1-1-6':
          this.queryJieduan(2,1)
          break
        default:
          break
      }
      // key == '1-1-2' ? this.queryJieduan(1) :  key == '1-1-3' ? this.queryJieduan(2) : this.queryJieduan(3)
    },
    handleSelect(key,keyPath) {
      if(this.business== 3){
        if(key.includes('委托书')){
          this.currentType = key
          this.$emit('getData',[])
          this.$emit('multipleTypeText',this.wtsExtendList.find(item=>item.code==this.currentType.replace(/委托书/, '')).name)
        }
        if(key.includes('#1#') || key.includes('#2#')){
          this.currentType = key
          this.$emit('getData',[])
        }
        if(key.includes('指示外代所')){
          this.currentType = key
          this.$emit('getData',[])
          this.$emit('multipleTypeText',this.mailTypeAllList.find(item=>item.mailType==this.currentType.replace(/指示外代所/, '')).name)
        }

        return;
      }
      if(key == '1-2'){
        this.currentType=key
        this.$emit('getData',[{label:'案件类型',value:'caseTypeId'},{label:'上报事项',value:'reportMatter'}])
      }
      if(key =='1-1-1-1'){
        this.currentType = key
        this.$emit('getData',[])
        this.$emit('multipleTypeText', '申请书')
      }
      if(key.includes('委托书')){
        this.currentType = key
        this.$emit('getData',[])
        this.$emit('multipleTypeText',this.wtsExtendList.find(item=>item.code==this.currentType.replace(/委托书/, '')).name)
      }
      if(key.includes('材料目录')){
        this.currentType = key
        this.$emit('getData',[])
        this.$emit('multipleTypeText',this.ofMaterialList.find(item=>item.code==this.currentType.replace(/材料目录/, '')).name)
      }
      if(key.includes('报告客户')){
        this.currentType = key
        this.$emit('getData',[])
        this.$emit('multipleTypeText',this.mailTypeAllList.find(item=>item.mailType==this.currentType.replace(/报告客户/, '')).name)
      }
      if(key.includes('指示外代所')){
        this.currentType = key
        this.$emit('getData',[])
        this.$emit('multipleTypeText',this.mailTypeAllList.find(item=>item.mailType==this.currentType.replace(/指示外代所/, '')).name)
      }
      if(key =='发文签收单'){
        this.currentType = key
        this.$emit('getData',[])
        this.$emit('multipleTypeText','发文签收单')
      }
      if(key.includes('邮寄清单')){
        this.currentType = key
        this.$emit('getData',[])
        this.$emit('multipleTypeText',key)
      }
      if(key =='时限官文提醒'){
        this.currentType = key
        this.$emit('getData',[])
        this.$emit('multipleTypeText','时限官文提醒')
      }

      if(key =='1-3'){
        this.currentType = key
        // this.$emit('getData',[])
        this.$emit('exportList')
      }
    },
    queryMandate(){
      queryMandate({business:this.business}).then(res=>{
        this.wtsExtendList=res.data
      })
    },
    queryListOfMaterial(){
      queryListOfMaterial({business:this.business}).then(res=>{
        this.ofMaterialList=res.data
      })
    },
    queryAllMailType(){
      queryAllMailType().then(res=>{
        this.bgCustTypeList=[...res.data.guowai,...res.data.guonei]
      })
    },
    downManyFile(list){
      var that=this
      let index=0
      function down(item){
        that.$commonUtils.downLoadAll({url:`ipdoc${item.localFilePath}`,success(){
            index+=1
            if(index===list.length){
              return
            }
            setTimeout(()=>{
              down(list[index])
            },1000)

          }
        })
      }


      down(list[index])
    }
  },
  watch:{
    business(n){
      n&&this.queryMandate()
      if(n != 2){
        this.ofMaterialList = []
      }else{
        this.queryListOfMaterial()
      }
    },
    downLoadState(n){
      if(n) {
        if (this.currentType=='1-2') {
          const data = { insIds:this.multipleSelection.map(item=>item.insId)}
          createGovList(data).then(res=>{
            downLoadAll({ url: `ipdoc${res.data}`})
            this.$emit('close')
          })
        }
        if (this.currentType=='1-3') {
          const data = { idArray:this.multipleSelection.map(item=>item.insId),mouldTypeId:1}
          excelMould(data).then(res=>{
            downLoadAll({ url: `ipdoc${res.data}`})
            this.$emit('close')
          })
        }
        if(this.currentType=='1-1-1-1'){
          const data = { caseIds:this.multipleSelection.map(item=>item.caseId)}
          if ([...new Set(this.multipleSelection.map(item => item.caseTypeId))].length >= 2) {
            this.$message.error("您必须选择同一案件类型的案件");
            return
          }
          if(this.multipleSelection[0].caseType === '撤销三年停止使用申请' || this.multipleSelection[0].caseType === '出具优先权证明文件'){
            if(data.caseIds.length > 1){
              this.$confirm("生成的多个文档是否要合并？", "提示", {
                confirmButtonText: "是",
                cancelButtonText: "否",
                type: "warning"
              }).then(() => {
                data.isMerge = 1
                createForm(data).then(res=>{
                  let hash = {}
                  res.data = res.data.reduce((preVal, curVal) => {
                    hash[curVal.localFilePath] ? '' : hash[curVal.localFilePath] = true && preVal.push(curVal);
                    return preVal
                  }, [])
                  this.downManyFile(res.data)
                  this.$emit('close')
                })
              }).catch(() => {
                data.isMerge = 0
                createForm(data).then(res=>{
                  this.downManyFile(res.data)
                  this.$emit('close')
                })
              })
            }else {
              createForm(data).then(res=>{
                this.downManyFile(res.data)
                this.$emit('close')
              })
            }
          }else if(['变名变址','','转让/移转', '变更注册申请代理机构'].includes(this.multipleSelection[0].caseType)){
            this.$confirm("同批次案件是否生成在一份申请书中？", "提示", {
              confirmButtonText: "是",
              cancelButtonText: "否",
              type: "warning"
            }).then(() => {
              data.batch = 1
              createForm(data).then(res=>{
                this.downManyFile(res.data)
                this.$emit('close')
              })
            }).catch(() => {
              data.batch = 0
              createForm(data).then(res=>{
                this.downManyFile(res.data)
                this.$emit('close')
              })
            })
          }else{
            createForm(data).then(res=>{
              this.downManyFile(res.data)
              this.$emit('close')
            })
          }
        }
        if(this.currentType.includes('委托书')){
          const data = { caseIds:this.multipleSelection.map(item=>item.caseId),code:this.currentType.replace(/委托书/, ''),business:this.business}
          if(data.caseIds.length > 1){
            this.$confirm("生成的多个文档是否要合并？", "提示", {
              confirmButtonText: "是",
              cancelButtonText: "否",
              type: "warning"
            }).then(() => {
              data.isMerge = 1
              createPOA(data).then(res=>{
                let hash = {}
                res.data = res.data.reduce((preVal, curVal) => {
                  hash[curVal.localFilePath] ? '' : hash[curVal.localFilePath] = true && preVal.push(curVal);
                  return preVal
                }, [])
                this.downManyFile(res.data)
                this.$emit('close')
              })
            }).catch(() => {
              data.isMerge = 0
              createPOA(data).then(res=>{
                this.downManyFile(res.data)
                this.$emit('close')
              })
              // this.downManyFile(res.data)
            })
          }else {
            createPOA(data).then(res=>{
              this.downManyFile(res.data)
              this.$emit('close')
            })
          }
        }
        if(this.currentType.includes('材料目录')){
          const data = { caseIds:this.multipleSelection.map(item=>item.caseId),code:this.currentType.replace(/材料目录/, '')}
          createListOfMaterial(data).then(res=>{
            this.downManyFile(res.data)
            // res.data.forEach(item => {
            //   axios.get(`ipdoc${item.localFilePath}`,{ responseType: 'blob', headers: {
            //       "Content-Type": "application/json; charset=utf-8",
            //     }}).then(function (res) {
            //     jsFileDownload(res.data,item.localFilePath.replace(/(.*\/)*([^.]+).*/ig,"$2",'')+'.'+item.localFilePath.replace(/.+\./,""));
            //   })
            // })
            this.$emit('close')
          })
        }
        if(this.currentType.includes('报告客户')){
          if(this.pageTitle=='官方通知'){
            let caseList = getLanglist(this.multipleSelection.map(item => item.caseArray));
            let list = caseList.map(item => item.agentNum);
            let onlyOneId=this.currentType.replace(/报告客户/, '')
            const data = { doc_id:list,mail_Type:onlyOneId,businesstype:this.mailTypeAllList.find(item=>item.mailType==onlyOneId).businessType}
            createMailByself(data).then(res=>{
              // res.data&&downLoadAll({ url: `ipdoc${res.data[0].localFilePath}`})
              this.$message.success(res.message || '邮件发送中')
              this.$emit('close')
            })
           } else {
            let onlyOneId=this.currentType.replace(/报告客户/, '')
            const data = { doc_id:this.multipleSelection.map(item => item.agentNum ),mail_Type:onlyOneId,businesstype:this.mailTypeAllList.find(item=>item.mailType==onlyOneId).businessType}
            createMailByself(data).then(res=>{
              // res.data&&downLoadAll({ url: `ipdoc${res.data[0].localFilePath}`})
              this.$message.success(res.message || '邮件发送中')
              this.$emit('close')
            })
          }
        }
        if(this.currentType.includes('指示外代所')){
          if(this.pageTitle=='官方通知'){
            let caseList = getLanglist(this.multipleSelection.map(item => item.caseArray));
            let list = caseList.map(item => item.agentNum);
            let onlyOneId=this.currentType.replace(/指示外代所/, '')
            const data = { doc_id:list,mail_Type:onlyOneId,businesstype:this.mailTypeAllList.find(item=>item.mailType==onlyOneId).businessType}
            createMailByself(data).then(res=>{
              // res.data&&downLoadAll({ url: `ipdoc${res.data[0].localFilePath}`})
              this.$message.success(res.message || '邮件发送中')
              this.$emit('close')
            })
           } else if(this.pageTitle=='专利案件') {
            let onlyOneId=this.currentType.replace(/指示外代所/, '')
            const data = { doc_id:this.multipleSelection.map(item => item.agentNum ),mail_Type:onlyOneId,businesstype:2}
            createMailByself(data).then(res=>{
              this.$message.success(res.message || '邮件发送中')
              this.$emit('close')
            })
          } else {
            console.log('zozuwssss',this.pageTitle,this.mailTypeAllList)
            let onlyOneId=this.currentType.replace(/指示外代所/, '')
            const data = { doc_id:this.multipleSelection.map(item => item.agentNum ),mail_Type:onlyOneId,businesstype:this.mailTypeAllList.find(item=>item.mailType==onlyOneId).businessType}
            createMailByself(data).then(res=>{
              // res.data&&downLoadAll({ url: `ipdoc${res.data[0].localFilePath}`})
              this.$message.success(res.message || '邮件发送中')
              this.$emit('close')
            })
          }
        }
        if(this.currentType=='发文签收单'){
          const data={
            tmFileIds:this.multipleSelection.map(item=>item.tmFileId),
            type:1
          }
          createReceipt(data).then(res=>{
            downLoadAll({ url: `ipdoc${res.data}`})
            this.$message.success(res.message)
            this.$emit('close')
          })
        }
        if(this.currentType=='时限官文提醒'){
          const data={
            tmFileIds:this.multipleSelection.map(item=>item.tmFileId),
            type:2
          }
          createReceipt(data).then(res=>{
            downLoadAll({ url: `ipdoc${res.data}`})
            this.$message.success(res.message)
            this.$emit('close')
          })
        }
        if(this.currentType.includes('邮寄清单')){
          const data={
            tmFileIds:this.multipleSelection.map(item=>item.tmFileId),
            type:this.currentType.includes('内部') ? 3 : 4
          }
          createReceipt(data).then(res=>{
            downLoadAll({ url: `ipdoc${res.data}`})
            this.$message.success(res.message)
            this.$emit('close')
          })
        }

        //专利
        if(this.currentType.includes('#1#')){
          if(this.pageTitle=='官方通知'){
            let caseList = getLanglist(this.multipleSelection.map(item => item.caseArray));
            let list = caseList.map(item => item.agentNum);
            let mailType=this.currentType.replace(/#1#/, '')
            const data = { doc_id:list,mail_Type:mailType,businesstype:1}
            createMailByself(data).then(res=>{
              res.data&&downLoadAll({ url: `ipdoc${res.data[0].localFilePath}`})
              this.$message.success(res.message || '邮件发送中')
              this.$emit('close')
            })
           } else {
            let mailType=this.currentType.replace(/#1#/, '')
            const data = { doc_id:this.multipleSelection.map(item => item.agentNum ),mail_Type:mailType,businesstype:1}
            createMailByself(data).then(res=>{
              res.data&&downLoadAll({ url: `ipdoc${res.data[0].localFilePath}`})
              this.$message.success(res.message || '邮件发送中')
              this.$emit('close')
            })
          }
        }
        if(this.currentType.includes('#2#')){
          if(this.pageTitle=='官方通知'){
            let caseList = getLanglist(this.multipleSelection.map(item => item.caseArray));
            let list = caseList.map(item => item.agentNum);
            let mailType=this.currentType.replace(/#2#/, '')
            const data = { doc_id:list,mail_Type:mailType,businesstype:2}
            createMailByself(data).then(res=>{
              res.data&&downLoadAll({ url: `ipdoc${res.data[0].localFilePath}`})
              this.$message.success(res.message || '邮件发送中')
              this.$emit('close')
            })
           } else {
            let mailType=this.currentType.replace(/#2#/, '')
            const data = { doc_id:this.multipleSelection.map(item => item.agentNum ),mail_Type:mailType,businesstype:2}
            createMailByself(data).then(res=>{
              res.data&&downLoadAll({ url: `ipdoc${res.data[0].localFilePath}`})
              this.$message.success(res.message || '邮件发送中')
              this.$emit('close')
            })
          }
        }

      }
    }
  }
}
</script>

<style lang="scss" scoped>
  >>>.el-menu{
    overflow: inherit!important;
  }
  >>>.el-menu--horizontal{
    top: auto !important;
  }
</style>
