<template>
  <div>
    <div v-for="(items, index) in itemTypeList ">
      <div style="position: relative">
        <div class="header-info" style="position: relative">
          <span>{{items.itemName}}</span>
          <el-button v-if="!isView" type="primary" size="mini" style=""
                     @click="addSigItem(table,items.itemType)">添加
          </el-button>
          <el-button v-if="!isView" type="primary" size="mini" style=""
                     @click="delSigItem(table,items.itemType)">删除
          </el-button>
        </div>
      </div>
      <el-table
        :ref="'table'+items.itemType"
        class="sig-table"
        :data="table&&table['dataList']&&table['dataList'].length&&table['dataList'].filter(i=>i.itemType == items.itemType)"
        height="250"
        border
        style="width: 100%">
        <el-table-column
          v-if="!isView"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          v-if="[1,2,6].includes(items.itemType)"
          label="序号">
          <template slot-scope="scope">
            {{scope.row.no ? items.itemName+scope.row.no : ''}}
          </template>
        </el-table-column>
        <el-table-column
          :key="items.itemName"
          :label="items.itemName"
          v-if="!isView"
        >
          <template slot-scope="scope">
            <div v-if="Array.isArray(personList[index])">
              <el-select v-if="items.itemType==1" clearable
                         v-model="scope.row.inventorId"
                         @change="(v)=>{changeInventor(v,table['dataList'],personList[index], scope.$index, items.itemType)}">
                <el-option :label="it.inventorCtitle" :key="it.inventorId" :value="it.inventorId"
                           v-for="it in personList[index]">
                </el-option>
              </el-select>
              <el-select v-if="items.itemType==2" clearable
                         v-model="scope.row.preAppId"
                         @change="(v)=>{changeInventor(v,table['dataList'],personList[index], scope.$index, items.itemType)}"

              >
                <el-option :label="it.applicantName" :key="it.appId" :value="it.appId"
                           v-for="it in personList[index]">
                </el-option>
              </el-select>
              <el-select v-if="items.itemType==6" clearable
                         v-model="scope.row.priorityAppNum"
                         @change="(v)=>{changeInventor(v,table['dataList'],personList[index], scope.$index, items.itemType)}"
              >
                <el-option :label="it.priorityAppNum" :key="it.priorityAppNum" :value="it.priorityAppNum"
                           v-for="it in personList[index]">
                </el-option>
              </el-select>
            </div>
            <div v-else>
              <span v-if="items.itemType == 3">{{personList[index]}}</span>
              <span v-if="items.itemType == 4">{{personList[index]}}</span>
              <span v-if="items.itemType == 5">{{personList[index]}}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="变更项目"
        >
          <template slot-scope="scope">
            <el-select clearable
                       v-if="!isView"
                       v-model="scope.row.itemName"
                       @change="(v)=>{changeItem(v,table['dataList'],personList[index], scope.$index, items.itemType)}">
              <el-option :label="it.itemDesc" :key="it.itemDesc" :value="it.itemName"
                         v-for="it in itemList.filter(i=>i.itemType == items.itemType)">
              </el-option>
            </el-select>
            <span v-if="isView">{{itemList.filter(i=>i.itemType == items.itemType).find(k => k.itemName == scope.row.itemName)
              &&itemList.filter(i=>i.itemType == items.itemType).find(k => k.itemName == scope.row.itemName).itemDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="变更类型"
          v-if=" items.itemType==2"
        >
          <template slot-scope="scope">
            <el-select clearable
                       v-if="!isView && (scope.row.changeType || scope.row.itemName === 'applicantName')"
                       v-model="scope.row.changeType"
            >
              <el-option :label="it" :key="it" :value="it"
                         v-for="it in ['转移','继承','其他','更名']">
              </el-option>
            </el-select>
            <span v-if="!isView && (!scope.row.changeType && scope.row.itemName !== 'applicantName')">/</span>
            <span v-if="isView">{{scope.row.changeType || '/'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="变更前">
          <template slot-scope="scope">
            <span v-if="[1,2,3].includes(items.itemType)" :title="scope.row.beforeData">{{scope.row.beforeData}}</span>
            <el-input v-else v-model="scope.row.beforeData" :title="scope.row.beforeData"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="变更后">
          <template slot-scope="scope">
            <el-select v-if="!isView && scope.row.itemName === 'applicantName'" :clearable='true' placeholder="请选择"
                       v-model="scope.row.changedData"
                       filterable
                       @change="(v)=>{changeAppName(v,table['dataList'],personList[index], scope.$index, items.itemType)}"
            >
              <el-option v-for="item  in appList" :key="item.appId" :label="item.applicantName"
                         :value="item.applicantName">
              </el-option>
            </el-select>
            <el-input v-model="scope.row.changedData" :title="scope.row.changedData"
                      v-if="!isView && scope.row.itemName !== 'applicantName'"></el-input>
            <span v-if="isView" :title="scope.row.changedData">{{scope.row.changedData}}</span>
          </template>

        </el-table-column>
        <el-table-column
          v-if="type === 'submit'"
          label="变更理由">
          <template slot-scope="scope">
            <el-cascader
              clearable
              v-if="!isView"
              filterable
              :show-all-levels="true"
              v-model="scope.row.liyouNameList"
              :options="zbLiyouList.filter(i => i.itemType == items.itemType)"
              :props="defaultParams"
              placeholder="请选择"
              @change="(v)=>{changeReason(v, scope.row, items.itemType)}"
              ></el-cascader>
<!--            <el-select :clearable='true'-->
<!--                       v-if="!isView"-->
<!--                       placeholder="请选择"-->
<!--                       v-model="scope.row.liyouName"-->
<!--                       filterable-->
<!--                       @change="(v)=>{changeReason(v,table['dataList'], scope.$index, items.itemType)}"-->
<!--            >-->
<!--              <el-option v-for="item  in zbLiyouList.filter(i => i.itemType == items.itemType)" :key="item.zblyId"-->
<!--                         :label="item.liyouName"-->
<!--                         :value="item.liyouName">-->
<!--              </el-option>-->
<!--            </el-select>-->
            <span v-if="isView">{{$wUtil.extractTree(zbLiyouList, 'childrens', ['zblyId', 'liyouName']).find(i => i.zblyId == scope.row.liyouNameList[scope.row.liyouNameList.length - 1])
              &&$wUtil.extractTree(zbLiyouList, 'childrens', ['zblyId', 'liyouName']).find(i => i.zblyId == scope.row.liyouNameList[scope.row.liyouNameList.length - 1]).liyouName}}</span>
          </template>

        </el-table-column>
        <el-table-column
          v-if="type === 'submit'"
          label="证明文件种类"
        >
          <template slot-scope="scope">
            <el-select :clearable='true' placeholder="请选择"
                       v-if="!isView"
                       ref="zbzmtype"
                       v-model="scope.row.cardType"
                       filterable
                       :loading="cardTypeLoading"
                       @focus="()=>{queryZbzmfile(scope.row.liyouName, items.itemType)}"
                       @change="(v)=>{changeFileType(v, table['dataList'], scope.$index, items.itemType)}"
            >
              <el-option v-for="item  in zbZmFileList[items.itemType]" :key="item.zbzmId" :label="item.fileType"
                         :value="item.fileType">
              </el-option>
            </el-select>
            <span v-if="isView">{{scope.row.cardType}}</span>
          </template>

        </el-table-column>
        <el-table-column
          v-if="type === 'submit'"
          label="分组类别">
          <template slot-scope="scope">
            <el-select :clearable='true' placeholder="请选择"
                       v-if="!isView"
                       ref="zbfztype"
                       v-model="scope.row.groupType"
                       filterable
                       :loading="groupTypeLoading"
                       @focus="()=>{queryZbgroup(scope.row.cardType, items.itemType)}"
                       @change="(v)=>{changeGroup(v, table['dataList'], scope.$index)}"
            >
              <el-option v-for="item  in zbGruopList[items.itemType]" :key="item.zbgroupId" :label="item.groupType"
                         :value="item.groupType">
              </el-option>
            </el-select>
            <span v-if="isView">{{scope.row.groupType}}</span>
          </template>

        </el-table-column>
        <el-table-column
          v-if="type === 'submit'"
          label="上传文件"
          width="300"
        >
          <template slot-scope="scope">
            <div class="" style="display: flex;justify-content: space-around">
              <div style="flex: 7" class="wrap-input">
                <el-select style="width: 100%;" :clearable='true' placeholder="文件类型"
                           v-if="!isView"
                           v-model="scope.row.materialTypeId"
                           filterable
                >
                  <el-option v-for="item  in typeNameList" :key="item.materialTypeId"
                             :label="item.typeName"
                             :value="item.materialTypeId">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.typeName}}</span>
              </div>
              <div style="flex: 1">
                <span v-if="scope.row.materialName" style="color: #409EFF;cursor: pointer" class="el-icon-paperclip"
                      :title="scope.row.materialName" @click="preView({address: scope.row.address})"></span>
              </div>
              <div style="flex: 2" v-if="!isView">
                <el-upload class="upload-demo"
                           ref="uploadFile"
                           :multiple="false"
                           :data="uploadFileData"
                           :action="creatematerialUrl"
                           name="attachFile"
                           :auto-upload="true"
                           :on-success="(res, file, fileList)=>{successCallback(res, file, fileList,table['dataList'], scope.$index, items.itemType)}"
                           :show-file-list="false"
                           :before-upload="()=>{if(!scope.row.materialTypeId){$message('请选择文件类型');return false}; uploadFileData.materialTypeId = scope.row.materialTypeId}"
                >
                  <div class="el-upload__text">
                    <el-button style="margin-left: 10px" type="primary" size="mini">上传</el-button>
                  </div>
                </el-upload>
              </div>

            </div>

          </template>
        </el-table-column>

      </el-table>
    </div>

  </div>
</template>

<script>
  import {delCaseMaterial} from "@/api/caseList";
  import {doEditInOffice, getProgID} from '@/utils/editInOffice.js'
  import {creatematerialUrl} from "@/api/serviceApi.config.js";
  import {
    queryItemList,
    queryCaseInfoForZb,
    queryZbrecordList,
    createZbrecord,
    updateZbrecord,
    queryAppInfoUrl,
    queryZbliyou,
    queryZbzmfile,
    queryZbgroup,
    queryLastDoc
  } from '@/api/caseDetail';

  export default {
    name: "SignificantTable",
    props: {
      typeNameList: {},
      itemTypeList: {
        type: Array,
        default: () => [
          {
            itemType: 1,
            itemName: '发明人'
          },
          {
            itemType: 2,
            itemName: '申请人'
          },
          {
            itemType: 3,
            itemName: '联系人'
          },
          {
            itemType: 4,
            itemName: '代理机构'
          },
          {
            itemType: 5,
            itemName: '代理师'
          },
          // {
          //   itemType: 6,
          //   itemName: '在先申请'
          // },
        ]
      },
      isView: {
        type: Boolean,
        default: true
      },
      caseId: '',
      type: '',
      table: {},
      // personList: {},
      // itemList: {},
      custId: ''
    },
    data() {
      return {
        defaultParams: { // 級聯菜單默認
          value: 'zblyId',
          label: 'liyouName',
          children: 'childrens',
          checkStrictly: true
        },
        groupTypeLoading: false,
        cardTypeLoading: false,
        flielist: [],
        uploadFileData: {
          custId: this.custId,
          caseId: this.caseId,
          tokenID: this.$store.getters.token
        },
        creatematerialUrl,
        materialTypeId: '',
        personList: [],
        itemList: [],
        zbGruopList: {},
        zbZmFileList: {},
        zbLiyouList: [],
        appList: [],
        // itemTypeList: [
        //   {
        //     itemType: 1,
        //     itemName: '发明人'
        //   },
        //   {
        //     itemType: 2,
        //     itemName: '申请人'
        //   },
        //   {
        //     itemType: 3,
        //     itemName: '联系人'
        //   },
        //   {
        //     itemType: 4,
        //     itemName: '代理机构'
        //   },
        //   {
        //     itemType: 5,
        //     itemName: '代理人'
        //   },
        //   // {
        //   //   itemType: 6,
        //   //   itemName: '在先申请'
        //   // },
        // ],
      }
    },
    created() {
      this.type === 'submit' && (this.queryZbliyou())
      // this.queryLastDoc()
      this.queryItemList()
      this.queryCaseInfoForZb()
      if(this.table&&this.table['dataList']){
        this.table['dataList'].forEach(item=>{
          if(item.liyouName){
            item.liyouNameList = item.liyouName.split(',').map(Number)
          }
        })
      }
    },
    methods: {
      queryCardType(liyouName) {

      },
      preView(data) {
        let url = data.address
        if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          if(['doc','docx'].includes(url.replace(/.+\./,"").toLocaleLowerCase())){
            this.$commonUtils.viewPdf(`${url}`)
          }else {
            let flag = ''
            if(data.mailId){
              flag = 'mailId'
            }else if (data.materialId) {
              flag = 'materialId'
            }
            url = url.replace(/&/g, '%26')
            window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g,'%2B'))
          }
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          this.downLoad(data)
        }
      },
      downLoad(data) {
        const url = data.address
        // let notify = this.$notify.success({
        //   // title: 'Info',
        //   message: '正在下载',
        //   showClose: false,
        //   duration: 0
        // });
        const downData = {
          url: `ipdoc${url}`,
          success() {
            // notify.close()
          }
        }
        // if (data.mailId) {
        //   downData.downLoad = data.materialName
        // }
        this.$commonUtils.downLoadAll(downData)
      },
      brforeRemoveFile(file, fileList, materialTypeId) {
        if (!materialTypeId) {
          this.$message('请选择文件类型')
          return false
        }
      },
      beforeupload(materialTypeId) {
        this.$message('请选择文件类型')
        return false
        // if (!materialTypeId) {
        //   this.$message('请选择文件类型')
        //   return false
        // }
        // this.uploadFileData.materialTypeId = this.submitData.materialTypeId;
      },
      successCallback(res, file, fileList, table, index, itemType) {
        if(fileList.length >= 2){
          delCaseMaterial({materialId: fileList[fileList.length - 2].response.data[0].materialId, caseIdArray: this.caseId}).then(res => {

          })
        }
        table.filter(i => i.itemType == itemType)[index].materialName = fileList[fileList.length - 1].response.data[0].materialName
        table.filter(i => i.itemType == itemType)[index].materialId = fileList[fileList.length - 1].response.data[0].materialId
        table.filter(i => i.itemType == itemType)[index].address = fileList[fileList.length - 1].response.data[0].address
        this.$forceUpdate()
        // console.log(table.filter(i => i.itemType == itemType)[index])
      },

      queryCaseInfoForZb() {
        queryCaseInfoForZb({caseId: this.caseId}).then(res => {
          //发明：patentInventorList, 申请：patentApplicantList,在先申请：patentPriorityList
          let {patentInventorList, patentApplicantList, patentPriorityList, lxrnameCn, agencyName, attorneyName} = res.data
          this.personList[0] = patentInventorList
          this.personList[1] = patentApplicantList
          this.personList[2] = lxrnameCn
          this.personList[3] = agencyName
          this.personList[4] = attorneyName
          this.personList[5] = patentPriorityList
          this.$forceUpdate()
        })
      },
      queryItemList() {
        queryItemList().then(res => {
          this.itemList = res.data
        })
      },
      changeReason(v, row, itemType) {
        if (v.length) {
          // let id = this.zbLiyouList.find(i => i.liyouName == v).zblyId
          this.queryZbzmfile(v[v.length - 1], itemType, true)
          this.$set(row, 'liyouName', row.liyouNameList.join(','))
          this.$set(row, 'cardType', '')
        }
      },
      changeFileType(v, table, index, itemType) {
        if (v) {
          this.queryZbgroup(v, itemType, true)
          this.$set(table.filter(i => i.itemType == itemType)[index], 'groupType', '')
        }
      },
      changeGroup(v, table, index) {
        // table[index].groupType = this.zbGruopList.find(i => i.zbgroupId == v).groupType
      },
      //变更理由列表
      queryZbliyou() {
        queryZbliyou().then(res => {
          this.zbLiyouList = res.data
        })
      },
      //证明文件
      queryZbzmfile(v, itemType, flag) {
        if (!v || this.zbZmFileList[itemType] && this.zbZmFileList[itemType].length && !flag) return;
        this.cardTypeLoading = true
        // let id = this.zbLiyouList.find(i => i.liyouName == v).zblyId
        queryZbzmfile({zblyId: v}).then(res => {
          this.zbZmFileList[itemType] = res.data
          this.cardTypeLoading = false
        })
      },
      //分组类别
      queryZbgroup(v, itemType, flag) {
        if (!v || this.zbGruopList[itemType] && this.zbGruopList[itemType].length && !flag) return;
        this.groupTypeLoading = true
        let id = this.zbZmFileList[itemType].find(i => i.fileType == v).zbzmId
        queryZbgroup({zbzmId: id}).then(res => {
          this.zbGruopList[itemType] = res.data
          this.groupTypeLoading = false
        })
      },
      //申请人列表
      queryAppInfoUrl() {
        this.custId&&queryAppInfoUrl({custId: this.custId}).then(res => {
          this.appList = res.data
        })
      },
      addSigItem(table, itemType) {
        if (!table['dataList']) {
          table['dataList'] = []
        }
        table['dataList'].push({itemType})
        this.$forceUpdate()
      },
      delSigItem(table, itemType) {
        if (!table['dataList'].filter(i=>i.itemType == itemType).length) {
          this.$message.error('无数据')
          return
        }
        if (!this.$refs['table'+itemType][0].selection.length) {
          this.$message.error('请选择数据')
          return
        }
        let list = table['dataList']
        this.$refs['table'+itemType][0].selection.forEach(item => {
          let idx = list.findIndex(i => i == item);
          list.splice(idx, 1)
        })
      },
      changeAppName(v, tableData, personData, index, itemType) {
        // console.log(this.appList.find(i => i[v] == tableData.filter(i => i.itemType == itemType)[index][v]),'$$$$$');
        tableData.filter(i => i.itemType == itemType)[index].appId = this.appList.find(i => i[v] == tableData.filter(i => i.itemType == itemType)[index][v])['appId']
      },
      changeItem(v, tableData, personData, index, itemType) {
        if (!v) {
          tableData.filter(i => i.itemType == itemType)[index].beforeData = ''
          return
        }
        if (v === 'applicantName') {
          this.queryAppInfoUrl()
          // this.isApplicantName = true

        } else {
          // this.isApplicantName = false
        }
        let flag = ''
        // tableData[index].itemType = itemType
        switch (itemType) {
          case 1:
            flag = 'inventorId'
            if (tableData.filter(i => i.itemType == itemType)[index][flag]) {
              tableData.filter(i => i.itemType == itemType)[index]['beforeData'] = personData.find(i => i[flag] == tableData.filter(i => i.itemType == itemType)[index][flag])[v]
            }
            break;
          case 2:
            flag = 'preAppId'
            if (tableData.filter(i => i.itemType == itemType)[index][flag]) {
              tableData.filter(i => i.itemType == itemType)[index]['beforeData'] = personData.find(i => i['appId'] == tableData.filter(i => i.itemType == itemType)[index][flag])[v]
            }
            break;
          case 6:
            flag = 'priorityAppNum'
            if (tableData.filter(i => i.itemType == itemType)[index][flag]) {
              tableData.filter(i => i.itemType == itemType)[index]['beforeData'] = personData.find(i => i[flag] == tableData.filter(i => i.itemType == itemType)[index][flag])[v]
            }
            break;
          default:
            break;
        }
        // console.log('+++++++++++++++>>>>')
        // console.log(tableData.filter(i => i.itemType == itemType)[index])
        // console.log('+++++++++++++++>>>>')
      },
      changeInventor(v, tableData, personData, index, itemType) {
        if (!v) {
          tableData.filter(i => i.itemType == itemType)[index].beforeData = ''
          return
        }
        let flag = ''
        switch (itemType) {
          case 1:
            flag = 'inventorId'
            tableData.filter(i => i.itemType == itemType)[index].no = personData.find(i => i[flag] == v).no
            if (tableData.filter(i => i.itemType == itemType)[index].itemName) {
              tableData.filter(i => i.itemType == itemType)[index].beforeData = personData.find(i => i[flag] == v)[tableData.filter(i => i.itemType == itemType)[index].itemName]
            }
            break;
          case 2:
            flag = 'preAppId'
            tableData.filter(i => i.itemType == itemType)[index].no = personData.find(i => i['appId'] == v).no
            if (tableData.filter(i => i.itemType == itemType)[index].itemName) {
              tableData.filter(i => i.itemType == itemType)[index].beforeData = personData.find(i => i['appId'] == v)[tableData.filter(i => i.itemType == itemType)[index].itemName]
            }
            break;
          case 6:
            flag = 'priorityAppNum'
            // tableData.filter(i => i.itemType == itemType)[index].no = personData.find(i => i[flag] == v).no
            // tableData.filter(i => i.itemType == itemType)[index].no = 1
            if (tableData.filter(i => i.itemType == itemType)[index].itemName) {
              tableData.filter(i => i.itemType == itemType)[index].beforeData = personData.find(i => i[flag] == v)[tableData.filter(i => i.itemType == itemType)[index].itemName]
            }
            break;
          default:
            break;
        }
        this.$forceUpdate()
      },
    }
  }
</script>

<style lang="scss" scoped>
  .header-info {
    cursor: pointer;
    display: block;
    font-size: 16px;
    padding: 5px 0px;
    color: #409EFF;
  }

  .el-table {
    /deep/ th {
      padding: 5px 0
    }

    /deep/ td {
      padding: 0;
    }

    /deep/ .cell {
      white-space: nowrap
    }
  }

  > > > .el-table {
    width: auto;

    .el-input {
      width: 200px;
    }

    .el-select, .el-input {
      height: 30px;
      line-height: 30px;

      .el-input__icon {
        height: 30px;
        line-height: 30px;
      }

      .el-input__inner {
        height: 30px;
        line-height: 30px;
      }
    }

    .td, .cell {
      text-align: center;
      min-height: 40px;
      box-sizing: border-box;
      padding: 5px 0;
    }


    tr:nth-of-type(1) {
      th {
        padding: 0;
        background: rgba(242, 242, 242, 1);
      }
    }
  }

  > > > .sig-table {
    .el-select {
      width: 90%;
    }

    .el-input__inner {
      height: 28px;
    }

    .el-input__icon {
      line-height: 28px;
    }

    .el-input, .el-textarea {
      width: 90%;
      margin-left: 10px;
    }
  }
</style>
