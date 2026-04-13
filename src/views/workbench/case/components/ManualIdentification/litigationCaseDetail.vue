<template>
  <el-form label-width="130px">
    <el-row>
      <el-form-item label="案件类型">
        <div   v-if="$store.state.caseInformation.caseTypeList.find(item=>item.caseTypeId==2).childrens.find(item=>item.caseTypeId==18).childrens.find(item=>item.caseTypeId===caseDetailFoemData.caseTypeId)">
          <p v-for="item in caseDetailFoemData.lawsuitCasetypeNameArray">{{item}}</p>
        </div>
       <div v-else>
         {{ caseDetailFoemData.caseType?caseDetailFoemData.caseType:'商标行政诉讼' }}
       </div>

      </el-form-item>
      <el-form-item label="审级">
        {{transformation(sjList,caseDetailFoemData.judgeRank,'value','label')}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="申请方向">
        {{caseDetailFoemData.appFromto}}
      </el-form-item>

    </el-row>
    <el-row>
      <el-form-item label="案件文号">
        {{caseDetailFoemData.agentNum}}
      </el-form-item>
      <el-form-item label="案件等级">
        <span v-if="caseDetailFoemData.caseLevel==1">普通</span>
        <span v-if="caseDetailFoemData.caseLevel==2">重要</span>
        <span v-if="caseDetailFoemData.caseLevel==5">A(重点案件)</span>
        <span v-if="caseDetailFoemData.caseLevel==6">B(普通民事及其他诉讼案件)</span>
        <span v-if="caseDetailFoemData.caseLevel==7">C(普通商标行政诉讼)</span>
        <span v-if="caseDetailFoemData.caseLevel==8">D(串案及流程性商标行政诉讼)</span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item class="postInfo-container-item" label="是否存在第二期收费:">
        {{caseDetailFoemData.sdsf ? '是' : '否'}}
      </el-form-item>
<!--       <el-form-item class="postInfo-container-item" label="工时类型:">-->
<!--         <span v-if="caseDetailFoemData.hrType == 1">记录工时</span>-->
<!--         <span v-if="caseDetailFoemData.hrType == 2">折算工时</span>-->
<!--      </el-form-item>-->
<!--      <el-form-item v-if="caseDetailFoemData.hrType == 2 && (caseDetailFoemData.sdsf || [5, 8].includes(caseDetailFoemData.caseLevel))" class="postInfo-container-item" label="工时系数:">-->
<!--        {{caseDetailFoemData.hrDc}}-->
<!--      </el-form-item>-->
    </el-row>
    <el-row>
      <el-form-item label="案件名称">
        {{caseDetailFoemData.caseName}}
      </el-form-item>
      <el-form-item label="案件名称（英文）">
        {{caseDetailFoemData.caseEnName}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="前案案件类型" v-if="$store.getters.tmCaseTypeIdList.includes(this.caseDetailFoemData.caseTypeId) || this.caseDetailFoemData.caseTypeId === 17">
        {{caseDetailFoemData.parentCaseType}}
      </el-form-item>
      <el-form-item v-else label="相关案件">{{caseDetailFoemData.parentAgentNum}}</el-form-item>
      <el-form-item label="前案官文收文日期" v-if="$store.getters.tmCaseTypeIdList.includes(this.caseDetailFoemData.caseTypeId)">
        {{caseDetailFoemData.parentCaseRecvDate}}
      </el-form-item>
    </el-row>
<!--    <el-row>-->
<!--      <el-form-item label="相关案件">{{caseDetailFoemData.parentAgentNum}}</el-form-item>-->
<!--    </el-row>-->
    <el-row class="fullRow" v-if="caseDetailFoemData.caseType === '商标行政'">
      <el-form-item label="前案官文发文编号">
        {{caseDetailFoemData.parentDocNumber}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="基本案情介绍">
        {{caseDetailFoemData.caseIntroduce}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="管辖法院">
        {{caseDetailFoemData.courtCustName}}
      </el-form-item>
      <el-form-item label="法院案号">
        {{caseDetailFoemData.courtCaseNumber}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item class="pad0" label="合议庭:">

        <el-form-item class="postInfo-container-item" label="审判长:" >
         {{caseDetailFoemData.collegialBench}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="审判员:">
         {{caseDetailFoemData.judge}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="法官助理:">
         {{caseDetailFoemData.judgeAssistant}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="书记员:">
          {{caseDetailFoemData.clerk}}
        </el-form-item>

    </el-form-item>
    </el-row>
    <el-row v-if="caseDetailFoemData.lawsuitCasetypeArray.find(item => [109, 110, 150, 151, 300047, 153, 154].includes(item))">
      <el-form-item label="判赔金额">
        {{caseDetailFoemData.compensateAmount}}
      </el-form-item>
      <el-form-item label="标的金额">
        {{ caseDetailFoemData.underlyingAmount }}
      </el-form-item>
      </el-row>
    <el-row>
    <el-form-item class="postInfo-container-item" label="审理方式:">
      {{caseDetailFoemData.hearWayArray?caseDetailFoemData.hearWayArray.map(item=>transformation(selectDataByClass['1134'],item,'id','typeName')).join(','):''}}
<!--      {{transformation(selectDataByClass['1134'],caseDetailFoemData.hearWay,'id','typeName')}}-->
    </el-form-item>
    </el-row>
    <el-row>
      <el-form-item class="postInfo-container-item" label="结案方式:">
        {{transformation(selectDataByClass['1135'],caseDetailFoemData.closeWay,'id','typeName')}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item class="postInfo-container-item" label="判决结果:">
<!--        {{transformation(selectDataByClass['1029'],caseDetailFoemData.judgment,'id','typeName')}}-->
        {{caseDetailFoemData.judgment}}
      </el-form-item>
      <el-form-item class="postInfo-container-item" label="所涉及条款:">
        {{caseDetailFoemData.clause}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item class="postInfo-container-item" label="审理尺度分析:">
        {{caseDetailFoemData.hearMeasureAnalyze}}
      </el-form-item>
      <el-form-item class="postInfo-container-item" label="后续工作及建议:">
        {{caseDetailFoemData.laterSuggest}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item class="postInfo-container-item" label="报价:">
        {{caseDetailFoemData.caseOffer?caseDetailFoemData.caseOffer:'0'}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item class="postInfo-container-item" label="备注:">
        {{caseDetailFoemData.memo}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item class="postInfo-container-item" label="客户名称:">
        {{caseDetailFoemData.custName}}
        <div class="" style="display: inline-block;color: #409EFF;cursor: pointer;">
          <span @click="customerView">查看</span>
        </div>
      </el-form-item>
      <el-form-item class="postInfo-container-item" label="客户文号:">
        {{caseDetailFoemData.custRefno}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item class="postInfo-container-item" label="客户联系人:">
        {{transformation(selectData.customerContacts,caseDetailFoemData.custConId,'custContactId','name')}}
      </el-form-item>
      <el-form-item class="postInfo-container-item" label="抄送人:">
        {{caseDetailFoemData.lawsuitCaseCcArray.map(item=>transformation(selectData.customerContacts,item,'custContactId','name')).join(',')}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item class="postInfo-container-item" label="客户联系人:">
        {{transformation(selectData.customerContacts,caseDetailFoemData.custConId,'custContactId','name')}}
      </el-form-item>
      <el-form-item class="postInfo-container-item" label="账单联系人:">
        {{caseDetailFoemData.billCustContactName}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item class="postInfo-container-item" label="折扣率:">
        {{caseDetailFoemData.discount}}
      </el-form-item>
      <el-form-item class="postInfo-container-item" label="账单地址:">
        {{caseDetailFoemData.billAddre}}
      </el-form-item>
    </el-row>
    <template v-if="['商标行政','商标刑事'].includes(caseDetailFoemData.caseType)">
      <el-row>
        <el-form-item class="postInfo-container-item" label="商标号:">
          {{caseDetailFoemData.droitNumber}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="申请日:">
          {{goodsDetailData.appDate}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="注册日:">
          {{goodsDetailData.regDate}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="商标名称:">
          {{goodsDetailData.tmName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="商标图样:">

          <div><img :src="tyimage" style="width:100px;height:100px;margin: 10px 10px;" v-if="tyimage"></div>
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="商标国际分类:">
          {{goodsDetailData.goodClasses}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="商品/服务项目">
          <!--      <el-table class="table-dl-row" :data="goodsDetailData.goods" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini">-->
          <!--        <el-table-column align="left" label="商品类别">-->
          <!--          <template slot-scope="scope">-->
          <!--            <span>{{ scope.row.goodClass }}</span>-->
          <!--          </template>-->
          <!--        </el-table-column>-->
          <!--        <el-table-column align="left" label="商品类似群组">-->
          <!--          <template slot-scope="scope">-->
          <!--            <span>{{ scope.row.similarGroup }}</span>-->
          <!--          </template>-->
          <!--        </el-table-column>-->
          <!--        <el-table-column align="left" label="商品代码">-->
          <!--          <template slot-scope="scope">-->

          <!--            <span>{{ scope.row.goodCode }}</span>-->
          <!--          </template>-->
          <!--        </el-table-column>-->
          <!--        <el-table-column align="left" label="商品中文名称">-->
          <!--          <template slot-scope="scope">-->
          <!--            <span>{{ scope.row.goodName }}</span>-->
          <!--          </template>-->
          <!--        </el-table-column>-->
          <!--        <el-table-column align="left" label="商品英文名称">-->
          <!--          <template slot-scope="scope">-->
          <!--            <span>{{ scope.row.goodEnName }}</span>-->
          <!--          </template>-->
          <!--        </el-table-column>-->

          <!--      </el-table>-->
          <!--      <pagination :limit.sync="goodslistPageDataw.pageSize" :page.sync="goodslistPageDataw.pageNo" :total="goodslistPageDataw.total" @pagination="getgoodsListw(goodsDetailData.goods)" v-show="goodslistPageDataw.total>0" />-->
          <Goods :disabled="true" type="view"  :goodsListData='goodsDetailData.goods'></Goods>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="种类:">
          <span v-if="goodsDetailData.tmType==1">一般</span>
          <span v-if="goodsDetailData.tmType==2">集体</span>
          <span v-if="goodsDetailData.tmType==3">证明</span>
        </el-form-item>

      </el-row>
      <el-row v-if="goodsDetailData.tmType=='2'||goodsDetailData.tmType=='3'">
        <el-form-item class="postInfo-container-item" label="集体/证明商标使用管理规则:" >
          {{goodsDetailData.memberRule}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="集体/证明商标使用管理规则(附件):">
          {{fileName[1005]}}
        </el-form-item>
      </el-row>
      <el-row v-if="goodsDetailData.tmType=='2'">
        <el-form-item class="postInfo-container-item" label="集体成员名单:" >
          {{goodsDetailData.memberNamelist}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="集体成员名单(附件):">
          {{fileName[1006]}}
        </el-form-item>
      </el-row>
      <el-row v-if="goodsDetailData.tmType=='3'">
        <el-form-item class="postInfo-container-item" label="申请人是否具备检测能力:" v-if="goodsDetailData.tmType=='2'">
          {{goodsDetailData.isAppWithDetectAbility}}
        </el-form-item>
      </el-row>
      <template v-if="goodsDetailData.isAppWithDetectAbility=='是'">
        <el-row >
          <el-form-item class="postInfo-container-item" label="申请人检测资质证书（附件）:" >
            {{fileName[1007]}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="申请人专业检测设备清单:">
            {{fileName[1008]}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="申请人专业技术人员名单（附件）:" >
            {{fileName[1009]}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="申请人技术人员证书:">
            {{fileName[1010]}}
          </el-form-item>
        </el-row>
      </template>
      <el-row>
        <el-form-item class="postInfo-container-item" label="是否三维标志:" >
          <span v-if="goodsDetailData.ifSolidTm==0">否</span>
          <span v-if="goodsDetailData.ifSolidTm==1">是</span>
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="指定颜色:">
          <span v-if="goodsDetailData.assignColor==false">否</span>
          <span v-if="goodsDetailData.assignColor==true">是</span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item class="postInfo-container-item" label="声音标志:" >
          <span v-if="goodsDetailData.tmVoice==0">否</span>
          <span v-if="goodsDetailData.tmVoice==1">是</span>
        </el-form-item>
        <el-form-item  v-if="goodsDetailData.tmVoice=='1'" class="postInfo-container-item" label="声音文件:">
          {{fileName[1016]}}
        </el-form-item>
      </el-row>
    </template>
    <template v-else>
      <el-row class="">
        <el-form-item class="postInfo-container-item" label="权利授权号:">
          {{caseDetailFoemData.droitNumber}}
        </el-form-item>

        <el-form-item class="postInfo-container-item  uploader-custfile" label="权利名称:" prop="">
          {{caseDetailFoemData.rightName}}
        </el-form-item>

      </el-row>
      <el-row class="">

        <el-form-item class="postInfo-container-item" label="权利类型:">
          {{transformation(selectDataByClass['1020'],caseDetailFoemData.rightType,'id','typeName')}}

        </el-form-item>

        <el-form-item class="postInfo-container-item" label="权利所属:">
          {{caseDetailFoemData.rightBelongType}}

        </el-form-item>

      </el-row>
    </template>

    <el-row>
    <el-form-item class="postInfo-container-item" label="我方当事人:">
        <el-table size="mini" :data="caseDetailFoemData.agentPartyArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
          <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
          <el-table-column label="名称" align="left" width>
            <template slot-scope="scope">
              {{scope.row.fullname}}
            </template>
          </el-table-column>
          <el-table-column label="住所" align="left" width>
            <template slot-scope="scope">
             {{scope.row.address}}
            </template>
          </el-table-column>
          <el-table-column label="诉讼地位" align="left" width>
            <template slot-scope="scope">
              {{transformation(selectDataByClass['1027'],scope.row.position,'id','typeName')}}
            </template>
          </el-table-column>
        </el-table>
    </el-form-item>
    </el-row>
      <el-row>
    <el-form-item class="postInfo-container-item" label="对方当事人:">
        <el-table size="mini" :data="caseDetailFoemData.adversaryArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
          <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
          <el-table-column label="名称" align="left" width>
            <template slot-scope="scope">
              {{scope.row.fullname}}
<!--              <el-select :clearable="true" :remote-method="remotepaternalUnit" @change="((val)=>{lytranappselectChange(val,'adversaryArray',scope.$index)})" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
<!--                         v-model="scope.row.nameId">-->
<!--                <el-option :key="key" :label="item.fullname" :value="item.conId" v-for="(item,key) in selectData.liyiarr" />-->
<!--              </el-select>-->
            </template>
          </el-table-column>
          <el-table-column label="住所" align="left" width>
            <template slot-scope="scope">
            {{scope.row.address}}
            </template>
          </el-table-column>
          <el-table-column label="诉讼地位" align="left" width>
            <template slot-scope="scope">
              {{transformation(selectDataByClass['1027'],scope.row.position,'id','typeName')}}
            </template>
          </el-table-column>
        </el-table>
    </el-form-item>
      </el-row>
        <el-row>
    <el-form-item class="postInfo-container-item" label="其他当事人:">
        <el-table size="mini" :data="caseDetailFoemData.otherPartyArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
          <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
          <el-table-column label="名称" align="left" width>
            <template slot-scope="scope">
              {{scope.row.fullname}}
<!--              <el-select :clearable="true" :remote-method="remotepaternalUnit" @change="((val)=>{lytranappselectChange(val,'otherPartyArray',scope.$index)})" allow-create default-first-option filterable loading-text="正在查询" no-match-text="暂无数据" placeholder="请输入关键词" remote reserve-keyword-->
<!--                         v-model="scope.row.nameId">-->
<!--                <el-option :key="key" :label="item.fullname" :value="item.conId" v-for="(item,key) in selectData.liyiarr" />-->
<!--              </el-select>-->
            </template>
          </el-table-column>
          <el-table-column label="住所" align="left" width>
            <template slot-scope="scope">
              {{scope.row.address}}
            </template>
          </el-table-column>
          <el-table-column label="诉讼地位" align="left" width>
            <template slot-scope="scope">
              {{transformation(selectDataByClass['1027'],scope.row.position,'id','typeName')}}
<!--              <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="scope.row.position">-->

<!--                <el-option :key="key" :label="item.typeName" :value="String(item.id)" v-for="(item,key) in selectDataByClass['1027']" />-->

<!--              </el-select>-->
            </template>
          </el-table-column>
        </el-table>
    </el-form-item>
        </el-row>

<!--    <el-row>-->
<!--      <el-col>-->
<!--        <div class="grid-content bg-purple">境外信息</div>-->
<!--      </el-col>-->
<!--    </el-row>-->
      <el-row>
        <el-form-item label="外方代理所">
          {{caseDetailFoemData.agencyCustName}}
        </el-form-item>
        <el-form-item label="涉及国家">
          {{caseDetailFoemData.appState}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所联系人">
          {{caseDetailFoemData.agencyCustContactName}}
        </el-form-item>
        <el-form-item label="外方代理所地址">
          {{caseDetailFoemData.agencyCustAddrName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所文号">
          {{caseDetailFoemData.foreignAgentNum}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所要求">
          {{caseDetailFoemData.agencyCustReq}}
        </el-form-item>
      </el-row>
  </el-form>
</template>

<script>
  import {
    lawsuitUrl,
    saveCaseInfoUrl,
    queryCountry,
    queryCustomerContactByCustIdUrl,
    queryAppInfoUrl,
    queryAppContactUrl,
    queryCustomerReqUrl,
    queryUserNames,
    queryListByUrl,
    queryGoodsPlanUrl,
    queryGoodsUrl,
    oneKeyZipUrl,
    heighCreditUrl,
    queryCustomerList,
    queryCustomerUrl,
    checkForbidContentUrl,
    checkSameTmUrl,
    queryGoodsByAgentNumUrl,
    cradeJoinAppUrl,
    delJoinAppUrl,
    delCaseMaterialUrl,
    queryCountryCaseUrl,
    querycustSelectClass,
    queryConflicterListUrl,
    addConflicterUrl,
    modifyjoinappUrl,
    queryAppAddrByAppIdUrl,
    queryCustomerContactByCustContactIdUrl,
    queryMaterialTypeUrl,
    queryOtherCustomerListUrl,
  } from '@/api/caseDetail'
   import Goods from '../Goods'
  import pagination from "@/components/Pagination";
  import { searchTmUrl, tmdetailUrl, tmdetailUrl3 } from '@/api/customerList'
  import OverseasQuotation from '@/views/workbench/case/components/OverseasQuotation.vue'
  export default {
    props:{
      caseDetailFoemData:{

      }
    },
    components:{
      OverseasQuotation,
      pagination,Goods
    },
    computed: {
    },
    data(){
      return{
        tyimage:'',
        fileName:{},
        sjList:[{label:'无',value:1368},{label:'一审',value:1071},{label:'二审',value:1072},{label:'再审',value:1073},{label:'重审',value:1074},{label:'执行',value:1075}],
        goodsDetailData:{
          goods:[]
        },
        selectDataByClass:[],
        selectData:{
          appaddr: [],
          pJtypelist:[],
          liyiarr: [],
          apptypelist: [],
          customerContactswf: [],
          goodsznselect: [],
          goodszn: {},
          country: [],
          customerContacts: [],
          billContacts: [],
          customerMailAdds: [],
          apps: [],
          billAdds: [],
          queryAppContact: [],
          workgroup: [],
          username: [],
          rolename: [],
          goodsPlanselect: [],
          hzLists: [],
          customerAddrs: [],
          casecount: [],

        },
        goodslistPageDataw: {
          total: 0,
          pageNo: 1,
          pageSize: 10
        },
      }
    },
    name: "litigationCaseDetail",
    created() {
      this.getCreatData()
    },
    methods:{
      customerView(){
        if(!this.caseDetailFoemData.custId)return;
        window.open(`/#/workbench/customer_management/cust_view/${this.caseDetailFoemData.custId}`)
      },
      getCreatData () {
        if(this.caseDetailFoemData.droitNumber){
          this.searchTmUrl(this.caseDetailFoemData.droitNumber)
        }
        this.caseDetailFoemData.custId&&queryAppInfoUrl({ custId: this.caseDetailFoemData.custId }).then(
          response => {
            this.selectData.apps = response.data;}
        );
        let conarrs= [...this.caseDetailFoemData.adversaryArray,...this.caseDetailFoemData.otherPartyArray];
        conarrs=conarrs.filter(itm=>!!itm.nameId).map(res=>res.nameId)
        console.log(conarrs,'conarrs');
        if(conarrs&&conarrs.length>0){
          queryConflicterListUrl({ conIdArray: conarrs }).then(res => {
            this.selectData.liyiarr = res.data
          })
        }

        // this.initfilelist()
        queryMaterialTypeUrl().then(res => {
          this.fileName = res.data
        })
        if (this.caseDetailFoemData.agencyCustId) {
          queryCustomerUrl({
            customerID: this.caseDetailFoemData.agencyCustId
          }).then(res => {
            this.selectData.customerContactswf = res.data.customerContacts
            this.selectData.customerAddrs = res.data.customerAddrs
          })
        }

        if (this.caseDetailFoemData.priorityType == '0') {
          this.ifpriority = '0'
        } else {
          this.ifpriority = '1'
        }
        querycustSelectClass({ classId: '1042,1134,1135,1027,1029,1020' }).then(response => {
          if (response.success) {
            this.selectData.apptypelist = response.data['1042']
            this.selectDataByClass=response.data
          } else {
            this.$message.error(response.message)
          }
        })

        queryCountryCaseUrl()
          .then(response => {
            this.selectData.casecount = response.data
          })
          .catch(err => {
            console.log(err)
          })

        queryCountry()
          .then(response => {
            this.selectData.country = response.data
          })
          .catch(err => {
            console.log(err)
          })

        queryOtherCustomerListUrl({ isOfficial: '1' })
          .then(response => {
            this.selectData.hzLists = response.data
          })
          .catch(err => {
            console.log(err)
          })


        this.caseDetailFoemData.custId&&queryCustomerContactByCustIdUrl({
          caseTypeId: this.caseDetailFoemData.caseTypeId,
          custId: this.caseDetailFoemData.custId
        })
          .then(response => {
            // this.selectData.country = response.data;
            this.selectData.customerContacts = response.data.customerContacts
            this.selectData.billContacts = response.data.BillContacts
          })
          .catch(err => {
            console.log(err)
          })
        queryCustomerContactByCustContactIdUrl({
          custContactId: this.caseDetailFoemData.custConId
        }).then(res => {
          this.selectData.customerMailAdds = res.data.customerMailAdds
          this.selectData.billAdds = res.data.BillAdds
          this.selectData.billAdds.forEach(item => {
            if (!item.addressCn) {
              item.addressCn = item.addressEn
            }
          })
        })
      },
      getgoodsListw(goods) {
        console.log(goods);
        this.goodslistPageDataw.total = goods.length;
        var offset =
          (this.goodslistPageDataw.pageNo - 1) * this.goodslistPageDataw.pageSize;
        this.goodsDetailData.goods =
          offset + this.goodslistPageDataw.pageSize >= goods.length
            ? goods.slice(offset, goods.length)
            : goods.slice(offset, offset + this.goodslistPageDataw.pageSize);
      },
      searchTmUrl(val){
        searchTmUrl({ regNumbers: val, trans: 20,pageSize:100,pageNo:1 }).then(res => {
          if (!res.data || !res.data.length) {
            return;
          }
          this.goodsDetailData.appCnName = res.data[0].applicantName;
          this.goodsDetailData.tmName = res.data[0].tmName;
          this.goodsDetailData.regNumber = res.data[0].regNumber;
          this.goodsDetailData.validStartDate = res.data[0].validStartDate;
          this.goodsDetailData.validEndDate = res.data[0].validEndDate;
          this.goodsDetailData.regDate = res.data[0].regNoticeDate;
          this.goodsDetailData.approvalDate=res.data[0].approvalDate;
          this.goodsDetailData.approvalNumber=res.data[0].approvalNumber;
          this.goodsDetailData.appDate = res.data[0].appDate;
          // this.caseDetailFoemData.appDate = res[0].data.appDate;
          this.goodsDetailData.tmType =
            res.data[0].classify === "证明"
              ? "3"
              : res.data[0].classify === "集体"
              ? "2"
              : "1";
          this.goodsDetailData.imageFile =
            "/tmFile" + res.data[0].imgFilePath;
          this.tyimage="tmFile" + res.data[0].imgFilePath;
          this.goodsDetailData.ifSolidTm =
            res.data[0].ifSolidTm == "是" ? "1" : "0";
          this.goodsDetailData.assignColor = res.data[0].colorDesc
            ? res.data[0].colorDesc
            : false;
          this.goodsDetailData.tmVoice = res.data[0].tmForm
            ? res.data[0].tmForm === "文字"
              ? "0"
              : "1"
            : "0";
          this.goodsDetailData.colorSign = "0";
          // this.caseDetailFoemData.tmIdList = info.map(item => item.tmId);
          if(res.data[0].trademarkCategories.length){
            this.goodsDetailData.goods = this.$commonUtils.getLanglist(
              res.data.map(item => item.trademarkCategories).filter(item => item)
            ).map(item => ({
              goodClass: item.tmType,
              goodEnName: item.enName,
              goodName: item.name,
              id: item.id,
              similarGroup: item.tmGroup
            }));
            // this.getgoodsListw(this.goodsDetailData.goods)
            this.goodsDetailData.goodClasses = [
              ...new Set(
                this.goodsDetailData.goods.map(item => item.goodClass)
              )
            ].join(";");
          }else {
            this.goodsDetailData.goodClasses=res.data[0].tmType
          }

          // tmdetailUrl3({tmId:res.data[0].tmId}).then(res=>{
          //
          // })
        });
      },

      transformation(arr,val,valType,labelStr){
        if(arr&&arr.length){
          var item=arr.find(item=>item[valType]==val)
          if(item){
            return item[labelStr]
          }else {
            return ''
          }
        }
        return ''
      },
    }
  }
</script>

<style lang="scss" scoped>
  .pad0 /deep/ .el-form-item__content {
    padding-left: 0 !important;
  }
  .el-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .el-row {
      // min-height: 20px;
      width: 100%;
      display: flex;
      line-height: 30px;
      .el-form-item {
        width: 100%;
        display: flex;
        border: 1px solid #ebeef5;
        border-bottom: 0;
        margin-bottom: 0;
        /deep/ .el-form-item__label {
          background: #f5f7fa;
          line-height: 30px;
        }

        /deep/ .el-form-item__content {
          line-height: 30px;
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
        }
      }
      .small-el-form-item-prev:before {
        content: "";
        width: 50%;
        height: 1px;
        background: #ebeef5;
        position: absolute;
        bottom: -1px;
        right: 0;
        z-index: 1;
      }
      .small-el-form-item {
        position: relative;
        width: 50%;
        /deep/ .el-form-item__content {
          flex: 1;
          .pad20 {
            padding-left: 20px;
          }
        }
      }
    }
    .el-row:nth-last-child(1) {
      .el-form-item {
        border: 1px solid #ebeef5;
      }
    }
  }
</style>
