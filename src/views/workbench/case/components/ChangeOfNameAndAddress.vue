<template>
  <div>
    <el-row class="fullRow">
      <el-col :span="24">
        <el-form-item label="变更类型:" class="postInfo-container-item">
          <!-- <template>
            <el-radio :disabled="$route.query.import==='1'" v-model="tmObj.changeType" label="变更名义">变名</el-radio>
            <el-radio :disabled="$route.query.import==='1'" v-model="tmObj.changeType" label="变更地址">变址</el-radio>
            <el-radio :disabled="$route.query.import==='1'" v-model="tmObj.changeType" label="变更名义/地址">变名变址</el-radio>
          </template> -->
          <el-checkbox-group 
            v-model="tmObj.changeTypeList"
            @change="handleChangeType"
            :disabled="$route.query.import==='1'"
          >
            <el-checkbox
              v-for="(item,key)  in changeTypeOptions" 
              :key="key"
              :label="item" 
              >
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="tmObj.changeTypeList.includes('变更名义')">
      <el-col :span="12">
        <el-form-item label="变更前名称（中文）:" class="postInfo-container-item">
          <template>
            <el-autocomplete
              class="inline-input"
              v-model="tmObj.applicantName"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="handleSelect"
            >
              <template slot-scope="{ item }">
                <el-tooltip :content="item.value" placement="top" effect="light">
                  <div
                    style="white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;">
                    {{ item.value }}
                  </div>
                </el-tooltip>
              </template>
            </el-autocomplete>
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="12">

        <el-form-item label="变更前名称（英文）:" class="postInfo-container-item">
          <template>
            <el-input v-model="tmObj.applicantEnName"></el-input>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- <template v-if="$route.query.import!='1'&&tmObj.changeTypeList.includes('变更地址')">
      <el-row >
        <el-col :span="12">
          <el-form-item label="变更前地址（中文）:" class="postInfo-container-item">
              <el-autocomplete
                class="inline-input"
                v-model="tmObj.addressCn"
                :fetch-suggestions="querySearch2"
                placeholder="请输入内容"
                @select="handleSelect2"
              >
                <template slot-scope="{ item }">
                  <el-tooltip :content="item.value" placement="top" effect="light">
                    <div
                      style="white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;">
                      {{ item.value }}
                    </div>
                  </el-tooltip>
                </template>
              </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="变更前地址（英文）:" class="postInfo-container-item">
            <template>
              <el-autocomplete
                class="inline-input"
                v-model="tmObj.addressEn"
                :fetch-suggestions="querySearchEn"
                placeholder="请输入内容"
                @select="handleSelectEn"
              >
                <template slot-scope="{ item }">
                  <el-tooltip :content="item.value" placement="top" effect="light">
                    <div
                      style="white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;">
                      {{ item.value }}
                    </div>
                  </el-tooltip>
                </template>
              </el-autocomplete>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <template v-if="$route.query.import=='1'&&tmObj.changeTypeList.includes('变更地址')">
      <el-row v-for="(item,index) in beforeAddress" :key="index">
        <el-col :span="12">
          <el-form-item :label="'变更前地址（中文）'+(index+1)+':'" class="postInfo-container-item">
            <template>
              <el-input v-model="item.addressCn"></el-input>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'变更前地址（英文）'+(index+1)+':'" class="postInfo-container-item">
            <template>
              <el-input v-model="item.addressEn"></el-input>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <el-row class="fullRow" v-if="tmObj.changeTypeList.length">
      <el-col :span="24">
        <el-form-item label="变更前联系地址（中文）:" class="postInfo-container-item">
          <el-input v-model="tmObj.preChangeContactAddr" placeholder="请输入变更前联系地址（中文）"></el-input>
        </el-form-item>
      </el-col>
    </el-row> -->
    <template v-if="tmObj.changeTypeList.length&&(!tmObj.changeTypeList.includes('变更地址')||tmObj.changeTypeList.includes('变更名义'))">
      <el-row class="fullRow">
        <el-col :span="24">
          <el-form-item label="变更证明文件是否为中文（网申）:" class="postInfo-container-item">
            <template>
              <template>
                <el-radio v-model="tmObj.appCertFileIsCn" label="否">否</el-radio>
                <el-radio v-model="tmObj.appCertFileIsCn" label="是">是</el-radio>
              </template>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="fullRow">
        <el-col :span="24">
          <el-form-item label="变更证明文件（中文）:" class="postInfo-container-item uploader-custfile">
            <template>
              <el-input v-model="fileName[1032]"></el-input>
              <el-button style="margin-left:10px;display: inline-block" size="mini" type="primary" @click="sendFileData('1032',$event)">上传</el-button>
              <!--<el-upload class="upload-btn" style="display: inline-block" :on-success='fileUploadSuccess' :show-file-list='false'-->
                        <!--:action="fileUrl" name='attachFile' :data="fileData('429')">-->
              <!---->
              <!--</el-upload>-->
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="fullRow" v-if="tmObj.appCertFileIsCn!=='是'" >
        <el-col :span="24">
          <el-form-item  label="变更证明文件（英文）:" class="postInfo-container-item uploader-custfile">
            <template>
              <el-input v-model="fileName[1033]"></el-input>
              <el-button style="margin-left:10px" size="mini" type="primary" @click="sendFileData('1033',$event)">上传</el-button>
              <!--<el-upload class="upload-btn" style="display: inline-block" :on-success='fileUploadSuccess' :show-file-list='false'-->
                        <!--:action="fileUrl" name='attachFile' :data="fileData('430')">-->
                <!---->
              <!--</el-upload>-->
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </template>

  </div>
</template>

<script>
import { queryAppByCusetId,queryAppAddrByTm } from '@/api/caseList'
export default {
  props:{
    custId:{
      type: Number
    },
    caseDetailFoemData:{
      type: Object
    },
    fileUrl:{
      type: String
    },
    fileName:{
      type: Object
    },
    mainCaseIds:{
      type: Array
    }
  },
  name: "ChangeOfNameAndAddress",
  data(){
    return {
      tmObj:{
        preChangeContactAddr: '',
        changeType:'',
        appCertFileIsCn:'',
        applicantName:'',
        preAppName:'',
        preAddress:'',
        applicantEnName:'',
        addressCn: '',
        addressEn: '',
        appAddrArray:[],
        appAddrArrayEn:[],
        changeTypeList:[]
      },
      appCustList: [ ],
      beforeAddress:[],
      defaultbeforeAddress:[],
      sessionObj:{},
    }
  },
  computed:{
    changeTypeOptions(){
      const type = this.caseDetailFoemData.tmType
      if (type === '1') {
        return ['变更名义','变更地址','变更联系地址','变更文件接收人']
      }else if(type === '2'){
        return ['变更名义','变更地址','变更联系地址','变更文件接收人','变更集体商标/证明商标管理规则','变更集体成员名单']
      } else{
        return ['变更名义','变更地址','变更联系地址','变更文件接收人','变更集体商标/证明商标管理规则']
      }
    }
  },
  created(){
    if(this.$route.query.import!='1'){
      this.queryAppByCusetId()
      // if(this.caseDetailFoemData.){
      //
      // }
    } else {
      
      this.sessionObj=JSON.parse(sessionStorage.getItem('changeOfNameOrAddressObj'))
      this.sessionObj.appObj.value=this.sessionObj.appObj.applicantName
      this.appCustList = [this.sessionObj.appObj]
      this.tmObj.changeTypeList=this.getChangeType(this.sessionObj.changeType)
      this.tmObj.changeType=this.sessionObj.changeType
      this.tmObj.appCertFileIsCn=this.caseDetailFoemData.appCertFileIsCn
      this.tmObj.applicantName=this.sessionObj.appObj.applicantName
      this.tmObj.applicantEnName = this.sessionObj.appObj.applicantEnName
      this.tmObj.preChangeContactAddr = this.caseDetailFoemData.preChangeContactAddr
      if(this.$route.query.import==='1'){
        this.beforeAddress = JSON.parse(JSON.stringify(this.sessionObj.beforeAddress))
        this.defaultbeforeAddress = JSON.parse(JSON.stringify(this.sessionObj.beforeAddress))
      }
    }
  },
  methods:{
    handleChangeType(value){
      if (value.length) {
        this.tmObj.changeType = value.join(',')
      }else{
        this.tmObj.changeType = ''
      }
    },
    getChangeType(str){
      if (str) {
        const arr = str.split(',')
        return arr
      }else{
        return []
      }
    },
    queryAppByCusetId(){
      this.tmObj.appCertFileIsCn=this.caseDetailFoemData.appCertFileIsCn
      this.tmObj.changeTypeList=this.getChangeType(this.caseDetailFoemData.changeType)
      this.tmObj.changeType=this.caseDetailFoemData.changeType
      this.tmObj.applicantName = this.caseDetailFoemData.preChangeCnName
      this.tmObj.addressCn = this.caseDetailFoemData.preChangeCnAdress
      this.tmObj.addressEn=this.caseDetailFoemData.preChangeEnAdress
      this.tmObj.applicantEnName=this.caseDetailFoemData.preChangeEnName
      this.tmObj.preAppName = this.caseDetailFoemData.preAppName
      this.tmObj.preAddress=this.caseDetailFoemData.preAddress
      this.tmObj.preChangeContactAddr = this.caseDetailFoemData.preChangeContactAddr
      const data = {
        custId: this.custId
      }
      queryAppByCusetId(data).then(res => {
        this.appCustList = res.data.map(item => {
          item.value = item.applicantName
          return item
        })
        if(this.$route.query.import!=='1'){
          var data = this.appCustList.find(item=>item.applicantName===this.tmObj.preAppName)
          if(data){
            this.tmObj.preAppName = data.applicantName
            // this.tmObj.applicantEnName=data.applicantEnName
            queryAppAddrByTm({ appId: data.appId }).then(res => {
              this.tmObj.appAddrArray=this.unique(JSON.parse(JSON.stringify(res.data[0].appAddrArray)), 'addressCn').map(itm=>{
                itm.value = itm.addressCn
                itm.appId=data.appId
                return itm
              })
              this.tmObj.appAddrArrayEn = this.unique(JSON.parse(JSON.stringify(res.data[0].appAddrArray)), 'addressEn').filter( item=> !!item.addressEn).map(itm=>{
                itm.value = itm.addressEn
                itm.appId = data.appId
                return itm
              })
              if(this.tmObj.changeTypeList.includes('变更地址')&&this.tmObj.preAddress){
                let { addressCn } = this.tmObj.appAddrArray.find(item=>item.addressCn==this.tmObj.preAddress)
                this.tmObj.preAddress=addressCn
                data.addressList= addressCn
                this.tmObj.addressCn=addressCn
                data.addressEnList=this.tmObj.addressEn
                this.$emit('getAppInfo',data)
              } else {
                this.$emit('getAppInfo',data)
              }
            })
          }
        }

        // if(){
        //   // const data = this.appCustList.find(item=>item.applicantName===this.caseDetailFoemData.preAppName)
        //   // this.tmObj.applicantName = data.applicantName
        //
        //   if(this.caseDetailFoemData.preAddress){
        //     // const data1=data.appAddrArray.find(item=>item.addrId===this.caseDetailFoemData.preAddress)
        //     // this.tmObj.addressCn = data1.addressCn
        //
        //   }
        // }
      })
    },
    querySearch(queryString, cb) {
      var appCustList = this.appCustList;
      var results = queryString ? appCustList.filter(this.createFilter(queryString)) : appCustList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },

    createFilter(queryString) {
      return (appCustList) => {
        return (appCustList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    unique(data, key) {
      const hash = {};
      const data2 = data.reduce((preVal, curVal) => {
        hash[curVal[key]] ? '' : hash[curVal[key]] = true && preVal.push(curVal);
        return preVal
      }, [])
      return data2
    },
    handleSelect(item) {
      let { applicantName, applicantEnName } =item
      this.tmObj.preAppName = applicantName
      this.tmObj.applicantName = applicantName
      this.tmObj.applicantEnName = applicantEnName
      queryAppAddrByTm({ appId: item.appId }).then(res => {
        this.tmObj.appAddrArray=this.unique(JSON.parse(JSON.stringify(res.data[0].appAddrArray)), 'addressCn').map(itm=>{
          itm.value = itm.addressCn
          itm.appId=item.appId
          return itm
        })
        this.tmObj.appAddrArrayEn = this.unique(JSON.parse(JSON.stringify(res.data[0].appAddrArray)), 'addressEn').filter( item=> !!item.addressEn).map(itm=>{
          itm.value = itm.addressEn
          itm.appId = item.appId
          return itm
        })
        this.$emit('getAppInfo',item)
      })

      // this.tmObj.appAddrArray = appAddrArray.map(item=>{
      //   item.value = item.addressCn
      //   return item
      // })
    },
    querySearch2(queryString, cb) {
      var appCustList = this.tmObj.appAddrArray;
      var results = queryString ? appCustList.filter(this.createFilter(queryString)) : appCustList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleSelect2(item) {
      let { addressCn }=item
      this.tmObj.preAddress=addressCn
      item.addressList= addressCn
      this.tmObj.addressCn=addressCn
      item.addressEnList = this.tmObj.addressEn
      // if(this.$route.query.import==='1'){
      //   this.defaultbeforeAddress=[item]
      // }
      this.$emit('getAppInfo',item)
    },
    querySearchEn(queryString, cb) {
      var appCustList = this.tmObj.appAddrArrayEn;
      var results = queryString ? appCustList.filter(this.createFilter(queryString)) : appCustList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleSelectEn(item) {
      let { addressEn } = item
      item.addressEnList = addressEn
      this.tmObj.addressEn = addressEn
      item.addressList = this.tmObj.addressCn
      this.$emit('getAppInfo', item)
    },
    fileUploadSuccess(response, file, fileList) {
      if (response.data.length == "1") {
        this.fileName[response.data[0].materialTypeId] = file.name;
      }
    },
    fileData(materialTypeId) {
      let data = {
        caseIds: this.mainCaseIds,
        custId: this.caseDetailFoemData.custId,
        type: "2",
        caseId: this.caseDetailFoemData.caseId,
        materialTypeId: materialTypeId,
        tokenID: this.$store.getters.token
      };
      return data;
    },
    sendFileData(materialTypeId,e){
      this.$emit('getChildrenData',{materialTypeId, e})
    }
  },
  watch:{
    'tmObj.applicantName'(n){

    },
    // 'tmObj.addressCn'(n){
    //   const data = this.tmObj.appAddrArray.find(item => item.applicantName === n)
    //   if(data){
    //     this.tmObj.preAddrId = data.addrId
    //     this.tmObj.addressEn = data.addressEn
    //   }
    // }
    'caseDetailFoemData.tmType'(){
      this.tmObj.changeTypeList = []
      this.tmObj.changeType = ''
    }
  }
}
</script>

<style >
.el-autocomplete{
  width: 100%;
}
</style>
