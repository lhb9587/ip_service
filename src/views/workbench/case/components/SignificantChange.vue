<template>
  <div>
    <!--    <el-form label-width="160px">-->
    <!--      <el-row class="border-top">-->
    <!--        <el-col :span="12">-->
    <!--          <el-form-item label="申请号:">-->
    <!--            {{caseDetailFormData.appNumber}}-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
    <!--        <el-col :span="12">-->
    <!--          <el-form-item label="发明名称:">-->
    <!--            {{caseDetailFormData.caseName}}-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-row class="">-->
    <!--        <el-col :span="12">-->
    <!--          <el-form-item label="第一个申请人名称:">-->
    <!--            {{caseDetailFormData.appName }}-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
    <!--        <el-col :span="12">-->
    <!--          <el-form-item label="官方通知类型:">-->
    <!--            {{caseDetailFormData.typeName }}-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <el-row>-->
    <!--        <el-col :span="24">-->
    <!--          <el-form-item label="官方通知文件编号 :">-->
    <!--            {{caseDetailFormData.documentNo}}-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--    </el-form>-->
    <div>
      <el-collapse v-if="recordList.length" ref="collapse" v-model="activeNames">
        <el-collapse-item v-for="(table, ind) in recordList.length&&recordList" :key="ind"
                          class="template-collapse-item" :name="ind+1">
                    <span slot="title" class="collapse-title">
                      <span>第{{ind+1}}次变更</span><span style="margin-left: 10px; color: #ccc"></span>
                    </span>
          <div>
            <SignificantTable :itemTypeList="itemTypeList" :custId="custId" :caseId="caseId" :table="table"></SignificantTable>
          </div>

        </el-collapse-item>
      </el-collapse>
      <div v-else style="margin-top: 10px">暂无变更信息</div>
      <!--      <div class="fl-ac-jc">-->
      <!--        <el-button v-if="createBtn" type="primary" size="" style="" @click="createReord">创建</el-button>-->
      <!--        <el-button v-else type="primary" size="" style="" @click="updateZbrecord">修改</el-button>-->
      <!--      </div>-->

    </div>

    <!--    <div v-else style="margin-top: 10px;color: #606266">-->
    <!--      还没有变更记录，-->
    <!--      <el-button type="primary" size="mini" style=""-->
    <!--                 @click="()=>{this.createReordBtn=false;this.createBtn=true;this.recordList.push({})}">创建-->
    <!--      </el-button>-->
    <!--    </div>-->

  </div>
</template>

<script>
  import SignificantTable from "./SignificantTable";
  import {
    queryItemList,
    queryCaseInfoForZb,
    queryZbrecordList,
    createZbrecord,
    updateZbrecord,
    queryAppInfoUrl
  } from '@/api/caseDetail';

  export default {
    name: "SignificantChange",
    components: {
      SignificantTable
    },
    props: {
      caseId: {},
      custId: {}
    },
    data() {
      return {
        itemTypeList: [],
        typeList: [
          {},
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
            itemName: '代理人'
          },
          // {
          //   itemType: 6,
          //   itemName: '在先申请'
          // },
        ],
        appList: [],
        isApplicantName: false,
        createBtn: false,
        createReordBtn: false,
        activeNames: 1,
        caseDetailFormData: {},
        personList: [],
        itemList: [],

        dataList: [],
        sigData: [],
        recordList: []
      }
    },
    created() {
      // this.queryItemList()
      // this.queryCaseInfoForZb()
      this.queryZbrecordList()
    },
    methods: {
      changeAppName(v, tableData, personData, index, itemType) {
        tableData.filter(i => i.itemType == itemType)[index].appId = personData.find(i => i[v] == tableData.filter(i => i.itemType == itemType)[index][v])['appId']
      },
      //申请人列表
      queryAppInfoUrl() {
        this.custId&&queryAppInfoUrl({custId: this.custId}).then(res => {
          this.appList = res.data
        })
      },
      updateZbrecord() {
        updateZbrecord({
          caseId: this.caseId,
          zbRecordId: this.recordList[this.recordList.length - 1].zbRecordId,
          dataList: this.recordList[this.recordList.length - 1]['dataList']
        }).then(res => {
          this.$message.success('修改成功！')
          // this.queryZbrecordList()
        })
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
            tableData.filter(i => i.itemType == itemType)[index].no = personData.find(i => i[flag] == v).no
            if (tableData.filter(i => i.itemType == itemType)[index].itemName) {
              tableData.filter(i => i.itemType == itemType)[index].beforeData = personData.find(i => i[flag] == v)[tableData.filter(i => i.itemType == itemType)[index].itemName]
            }
            break;
          default:
            break;
        }
        this.$forceUpdate()
      },
      deepFlatten(arr) {
        let flatten = (arr) => [].concat(...arr);
        return flatten(arr.map(x => Array.isArray(x) ? this.deepFlatten(x) : x));
      },
      createReord() {
        // return
        createZbrecord({
          caseId: this.caseId,
          dataList: this.recordList[this.recordList.length - 1]['dataList']
        }).then(res => {
          this.$message.success('创建成功！')
          this.queryZbrecordList()
          this.createBtn = false
        })
      },
      queryZbrecordList() {
        queryZbrecordList({caseId: this.caseId}).then(res => {
          this.recordList = res.data
          let list = this.recordList.filter(i => i.zbStatus == 0)[0].dataList || []
          if (list.length) {
            this.itemTypeList = list.map(i => this.typeList[i.itemType]).filter(i=>!!i)
          }
        })
      },
      queryCaseInfoForZb() {
        queryCaseInfoForZb({caseId: this.caseId}).then(res => {
          //发明：patentInventorList, 申请：patentApplicantList,在先申请：patentPriorityList
          this.caseDetailFormData = res.data
          let {patentInventorList, patentApplicantList, patentPriorityList, lxrnameCn, agencyName} = res.data
          this.personList[0] = patentInventorList
          this.personList[1] = patentApplicantList
          this.personList[2] = lxrnameCn
          this.personList[3] = agencyName
          this.personList[4] = '代理人'
          this.personList[5] = patentPriorityList
        })
      },
      queryItemList() {
        queryItemList().then(res => {
          this.itemList = res.data
        })
      },
      remotepinput() {

      },
      clearTmMessage() {

      },
      handleAppCnName() {

      }
    }
  }
</script>

<style lang="scss" scoped>


  > > > .el-form {
    .el-row {
      display: flex;

      .header-info {
        display: block;
        font-size: 18px;
        padding: 15px 0px;
        color: #7199d5;
      }

      .el-col {
        display: flex;
        height: 41px;

        .el-form-item {
          flex: 1;
          border: 1px solid #d7d7d7;
          border-top: none;
          border-right: none;
          margin-bottom: 0;
          align-items: center;

          .el-form-item__content {
            line-height: 40px;
            padding-left: 10px;
            color: #606266;
          }

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
            width: 80% !important;
            margin-left: 10px;
          }

          .el-form-item__label {
            min-height: 40px;
            line-height: 40px;
            height: 100%;
            border-right: 1px solid #d7d7d7;
            background-color: #f9f9f9;
          }
        }

        &:last-child {
          border-right: 1px solid #d7d7d7;
        }
      }
    }

    .border-top {
      border-top: 1px solid #d7d7d7;
    }
  }

  .template-collapse-item {
    position: relative;

    .collapse-title {
      flex: 1 0 90%;
      order: 1;

      .el-icon-delete {
        position: absolute;
        left: 50%;
        top: 20px;
        font-size: 16px;
        transform: translateX(-200px) translateY(-6px);
        /*transition: all .3s;*/
        &:hover {
          color: red;
        }
      }

      .el-icon-edit {
        position: absolute;
        left: 50%;
        top: 20px;
        font-size: 16px;
        transform: translateX(-250px) translateY(-6px);
        /*transition: all .3s;*/
        &:hover {
          color: #52A0F5;
        }
      }
    }

    > > > .el-collapse-item__header {
      display: flex;
      flex: 1 0 auto;
      height: 50px;
      order: -1;
      background-color: #fff;
      text-align: left;
    }
  }
</style>
