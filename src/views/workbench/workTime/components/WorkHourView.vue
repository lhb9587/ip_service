<template>
  <div>
    <div class="box-border">
      <div class="timeDiv">
        <timer :formTime="JSON.parse(JSON.stringify(formTime))" :type="type"></timer>
      </div>
      <el-form size="small" class="form-container" label-width="130px">
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="活动类型:" class="postInfo-container-item" :class="{'requireForm': !formTime.agentNum}">
              {{formTime.workTypeName}}
              <el-popover
                placement="top"
                width="400"
                trigger="hover"
                :content="computedDesc">
                <div v-show="computedDesc" slot="reference" style="line-height: 32px;font-size: 16px;margin-left: 5px;cursor:pointer;"
                     class="el-icon-info"></div>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称:" class="postInfo-container-item">
              {{formTime.custName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row" v-if="formTime.workType === 2069">
          <el-col :span="formTime.baifangType === '其他' ? 12 : 24">
            <el-form-item label="拜访方式:" class="postInfo-container-item">
              {{formTime.baifangType}}
            </el-form-item>
          </el-col>
          <el-col v-if="formTime.baifangType === '其他'" :span="12">
            <el-form-item label="其他说明:" class="postInfo-container-item">
              {{formTime.qitaDes}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row" v-if="formTime.workType === 2071">
          <el-col :span="12">
            <el-form-item label="业务领域:" class="postInfo-container-item">
              {{formTime.bussDomain}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="postInfo-container-item">
              <span slot="label">非定向或涉及<br>多客户开发</span>
              {{formTime.custmemo}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row" @click.stop v-if="[2069, 2070, 2071].includes(formTime.workType)">
          <el-col :span="24">
            <el-form-item label="参与会议:" class="postInfo-container-item">
              {{formTime.title}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row" v-if="formTime.workType" @click.stop>
          <el-col :span="12">
            <el-form-item label="内部参会人员:" class="postInfo-container-item">
              {{formTime.innerUserList && formTime.innerUserList.map(item => item.fullname).join(',')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户联系人:" class="postInfo-container-item">
              {{formTime.custContactList && formTime.custContactList.map(item => item.name).join(',')}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row" v-if="!formTime.workType">
          <el-col :span="12">
            <el-form-item label="案件文号:" class="postInfo-container-item requireForm" style="cursor: pointer;">
              <p style="color: rgb(59, 118, 227); float: left; margin-right: 10px;" @click="jumpDetails(formTime)">{{formTime.agentNum}}</p>
              <WorkTimeTips :paramsData="{data: formTime}"></WorkTimeTips>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="案件名称:" class="postInfo-container-item">
              {{formTime.caseName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="工作日期:" class="postInfo-container-item">
              {{formTime.hourDate}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间:" class="postInfo-container-item">
              {{formTime.beginDate}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="工作时长:" class="postInfo-container-item" :class="{'requireForm': !formTime.workType}">
              <span :class="{'red-color': formTime.time&&+formTime.time.substring(0,2)>3}">{{formTime.time}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间:" class="postInfo-container-item">
              {{formTime.endDate}}
            </el-form-item>
          </el-col>
        </el-row>
        <template>
          <el-row class="first-row">
            <el-col :span="12">
              <el-form-item label="员工:" class="postInfo-container-item">
                {{formTime.whUserName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="员工角色:" class="postInfo-container-item">
                {{formTime.roleName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row">
            <el-col :span="12">
              <el-form-item label="标准费率:" class="postInfo-container-item">
                {{formTime.criterionRate}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="金额:" class="postInfo-container-item">
                {{formTime.amount | formatAmount}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row">
            <el-col
              :span="formTime.wfStatus === '未核销' ? 12 : 24">
              <el-form-item label="所属工作组:" class="postInfo-container-item">
                {{formTime.groupName}}
              </el-form-item>
            </el-col>
            <el-col v-if="formTime.wfStatus === '未核销'"
                    :span="12">
              <el-form-item label="核定金额:" class="postInfo-container-item">
                <span>{{formTime.approvedAmountCust | formatAmount}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-if="formTime.wfStatus === '未核销'">
          <el-row class="first-row">
            <el-col :span="12">
              <el-form-item label="核定工时:" class="postInfo-container-item">
                <span :class="{'red-color': formTime.approvedTime&&+formTime.approvedTime.substring(0,2)>3}">{{formTime.approvedTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="核定费率:" class="postInfo-container-item">
                {{formTime.billRate}}
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <el-row class="first-row" v-if="isWorkHourAdmin">
          <el-col :span="12" v-if="formTime.workType">
            <el-form-item label="发现商机:" class="postInfo-container-item">
              <span v-if="formTime.hasSj === 1">是</span>
              <span v-if="formTime.hasSj === 0">否</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="记录人:" class="postInfo-container-item requireForm">
              {{$store.getters.userList.find(item => item.userId === formTime.userId) &&
              $store.getters.userList.find(item => item.userId === formTime.userId).fullname || ""}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row" v-else>
          <el-col :span="12" v-if="formTime.workType">
            <el-form-item label="发现商机:" class="postInfo-container-item">
              <span v-if="formTime.hasSj === 1">是</span>
              <span v-if="formTime.hasSj === 0">否</span>
            </el-form-item>
          </el-col>
          <el-col v-else :span="12" v-if="!formTime.workType">
            <el-form-item label="记录人:" class="postInfo-container-item requireForm">
              {{$store.getters.userList.find(item => item.userId === formTime.userId) &&
              $store.getters.userList.find(item => item.userId === formTime.userId).fullname || ""}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="出差路途:" class="postInfo-container-item">
            {{formTime.hasBusinessTripStr}}
            </el-form-item>
          <el-form-item label="关联项目:" class="postInfo-container-item">
            {{formTime.prjName}}
          </el-form-item>
        </el-row>
        <el-row v-if="formTime.workType">
            <el-form-item label="活动工时审核人:" class="postInfo-container-item" :class="[!isPartner ? 'requireForm' : '']">
              {{$store.getters.userList.find(item => item.userId === formTime.noCaseAuditUserId) &&
                $store.getters.userList.find(item => item.userId === formTime.noCaseAuditUserId).fullname || ""}}
            </el-form-item>
          </el-row>
        <div v-if="formTime.hasSj">
          <div class="divider">
          <span>
              商机线索
          </span>
          </div>
          <el-row>
            <el-table
              class="el-table1"
              :data="formTime.shangjiList"
              style="width: 99.5%;"
              border
            >
              <el-table-column label="领域" width="100px">
                <template slot-scope="scope">
                  {{scope.row.domain}}
                </template>
              </el-table-column>
<!--              <el-table-column label="客户联系人" width="200px">-->
<!--                <template slot-scope="scope">-->
<!--                  {{scope.row.lxren}}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column label="联系方式" width="150px">-->
<!--                <template slot-scope="scope">-->
<!--                  {{scope.row.lxfs}}-->
<!--                </template>-->
<!--              </el-table-column>-->
              <el-table-column label="商机描述" width="auto">
                <template slot-scope="scope">
                  {{scope.row.sjdesc}}
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
        <!--        <div v-if="formTime.feeDetais && formTime.feeDetais.length">-->
        <!--          <div class="divider">-->
        <!--            <span>-->
        <!--                关联费用-->
        <!--            </span>-->
        <!--          </div>-->
        <!--          <el-row>-->
        <!--            <el-table-->
        <!--              class="el-table1"-->
        <!--              :data="formTime.feeDetais"-->
        <!--              style="width: 99.5%;"-->
        <!--              border-->
        <!--              maxHeight="280"-->
        <!--            >-->
        <!--              <el-table-column label="费用科目" prop="feetStr" width="100">-->
        <!--              </el-table-column>-->
        <!--              <el-table-column label="费用名称" prop="feeName" width="120">-->
        <!--              </el-table-column>-->
        <!--              <el-table-column label="金额" prop="amount" width="70">-->
        <!--              </el-table-column>-->
        <!--              <el-table-column label="费用描述" prop="feeDesc" width="auto">-->
        <!--              </el-table-column>-->
        <!--              <el-table-column label="费用状态" prop="wfStatus" width="120">-->
        <!--              </el-table-column>-->
        <!--&lt;!&ndash;              <el-table-column label="操作" width="60px">&ndash;&gt;-->
        <!--&lt;!&ndash;                <template slot-scope="scope">&ndash;&gt;-->
        <!--&lt;!&ndash;                  <span class="pointer" @click="unBindFee(scope.row, scope.$index)">解绑</span>&ndash;&gt;-->
        <!--&lt;!&ndash;                </template>&ndash;&gt;-->
        <!--&lt;!&ndash;              </el-table-column>&ndash;&gt;-->
        <!--            </el-table>-->
        <!--          </el-row>-->
        <!--        </div>-->

        <div class="divider">
          <span class="require">
              工作描述
          </span>
        </div>
        <el-row style="border: none">
          {{formTime.workContent}}
        </el-row>
        <div v-if="(formTime.wfStatus === '未核销')">
          <div class="divider">
            <span class="">
                核定描述
            </span>
          </div>
          <el-row style="border: none">
            {{formTime.approvedDesc}}
          </el-row>
        </div>
        <div v-if="(formTime.wfStatus === '未核销')">
          <div class="divider">
            <span class="">
                审核备注
            </span>
          </div>
          <el-row style="border: none">
            {{formTime.auditNote}}
          </el-row>
        </div>
      </el-form>
      <div class="divider">
          <span class="">
              附件
          </span>
      </div>
      <div>
        <div v-for="item in fileList" @click="onPreview(item)">
          <span class="pointer">{{item.materialName}}</span>
        </div>
      </div>
    </div>
    <div class="fl-ac-jc">
      <el-button size="small" style="width: 100px;margin-right: 20px" @click="closeDialog">取 消</el-button>
    </div>
  </div>
</template>

<script>
  import WorkTimeTips from "@/views/workbench/toDoTasks/components/WorkTimeTips.vue";
  import {creatematerialUrl} from "@/api/serviceApi.config.js";
  import {
    addTaskHours,
    decFile,
    deleteFile,
    getCaseHistory, queryActiveWorkgroupBossUserList, queryIfHehuoren,
    queryRecentCase, queryWorkHours,
    queryWorkType
  } from "../../../../api/caseList";
  import {queryCustomerNameIdUrl} from "../../../../api/customerList";
  import {delCaseMaterialUrl, queryCustomerContactByCustIdUrl} from "../../../../api/caseDetail";
  import {getProgID} from "../../../../utils/editInOffice";
  import Timer from "./Timer";

  export default {
    name: "CreateWorkHour",
    components: {Timer,WorkTimeTips},
    props: {
      type: {
        type: String,
        default: 'create'
      },
      hoursId: {}
    },
    data() {
      return {
        uploadFileData: {
          tokenID: this.$store.getters.token,
          hoursFile: 1
        },
        creatematerialUrl,
        fileList: [],
        nameCaseLists: [],
        custList: [],
        historyList: [],
        visible: false,
        agentVisible: false,
        agentCaseLists: [],
        domainList: ['保护', '诉讼', '商标', '专利', '域名', '著作权', '非诉', '无'],
        formTime: {
          hasBusinessTrip: 0,
          workContent: undefined,
          userId: this.$store.getters.userId,
          materialIdList: [],
          shangjiList: [
            {
              domain: undefined,
              lxren: undefined,
              lxfs: undefined,
              sjdesc: undefined
            }
          ],
          agentNum: undefined,
          caseName: undefined,
          workType: undefined,
          hasSj: 0,
          beginDate: undefined,
          endDate: undefined,
          time: undefined,
          hourDate: undefined,
        },
        activityKinds: [],
        opportunityCluesData: [],
        agentHistorySearch: false,
        customerContacts: [],
        partnerList: [],
        isPartner: false
      }
    },
    computed: {
      computedDesc() {
        return this.formTime.workType && this.activityKinds.length && this.$commonUtils.extractTree(this.activityKinds, 'childrens', ['workType', 'workTypeName', 'memo']).find(item => item.workType === this.formTime.workType) && this.activityKinds.length && this.$commonUtils.extractTree(this.activityKinds, 'childrens', ['workType', 'workTypeName', 'memo']).find(item => item.workType === this.formTime.workType).memo || ''
      },
      isWorkHourAdmin() {
        return this.$store.state.user.roles.find(item => item.name === '工时管理员')
      },
    },
    async created() {
      queryIfHehuoren().then(res => {
        this.isPartner = !!res.data
      })
      this.queryWorkHours()
      await this.queryActivityType()
    },
    methods: {
      jumpDetails(val) {
        let taskType = 1
        switch (val.domain) {
          case '商标':
            taskType = 1
            break
          case '诉讼':
            taskType = 2
            break
          case '保护':
            taskType = 3
            break
          case '专利':
            taskType = 4
            break
          case '域名':
            taskType = 5
            break
          case '著作权':
            taskType = 6
            break
          case '非诉':
            taskType = 7
            break
          default:
            taskType = 1
        }
        const routeUrl = this.$router.resolve({ path: '/workbench/case/seeCaseDetail/' + val.caseId, query: {taskType: taskType}})
        window.open(routeUrl.href, "_blank");
      },
      async queryActivityType() {
        await queryWorkType().then(res => {
          this.activityKinds = res.data
        })
      },
      queryWorkHours() {
        queryWorkHours({hoursId: this.hoursId}).then(res => {
          if (res.data && res.data.workhoursList && res.data.workhoursList.length) {
            this.formTime = res.data.workhoursList[0]
            this.fileList = this.formTime.materialList
          }
        })
      },
      closeDialog() {
        this.$emit('closeDialog')
      },
      downLoad(data) {
        const url = data.address
        const downData = {
          url: `ipdoc${url}`,
          success() {
          }
        }
        if (data.mailId) {
          downData.downLoad = data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
      },
      onPreview(data) {
        let url = data.address
        if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          if (['doc', 'docx'].includes(url.replace(/.+\./, "").toLocaleLowerCase())) {
            this.$commonUtils.viewPdf(`${url}`)
          } else {
            let flag = ''
            if (data.mailId) {
              flag = 'mailId'
            } else if (data.materialId) {
              flag = 'materialId'
            }
            url = url.replace(/&/g, '%26')
            window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}&hoursFile=1`.replace(/[+]/g, '%2B'))
          }
          // doEditInOffice(url, getProgID(url))
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          this.downLoad(data)
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .fl-ac-jc {
    margin-top: 15px;
  }

  .box-border {
    border: 1px solid #D7D7D7;
    padding: 10px 10px 5px 10px;
  }

  .form-container {
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    /deep/ .el-row {
      margin: 0 0 5px 0;
      display: flex;
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    /deep/ .el-form-item__label {
      flex-shrink: 0;
      background-color: #F2F2F2;
      /*width: 36.7%;*/
      text-align: right;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #F2F2F2;
      margin: 0px !important;
    }

    .first-row {
      border-top: 1px solid #F2F2F2;
      .worktime-tips {
        float: left;
        margin-top: -4px;
      }
    }

    /deep/ .el-row {
      border-bottom: 1px solid #F2F2F2;
      border-left: 1px solid #F2F2F2;
    }

    /deep/ td .el-input,
    /deep/ td .el-select {
      width: 100%;
    }

    /deep/ .el-form-item__content {
      text-align: left;
      word-break: break-word;
      // height: 30px;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    .postInfo-container-item {
      display: flex;
      width: 100%;

      /deep/ .el-form-item__content {
        text-align: left;
        display: inline-table;
        flex: 1;
        padding: 5px 15px;
        margin-left: 0 !important;
      }

      > > > .el-date-editor {
        width: 100%;
      }
    }
  }

  .divider {
    position: relative;
    border-bottom: 1px solid #797979;
    margin-bottom: 20px;
    /*border-right: 1px solid #ccc;*/
    margin-top: 20px;

    .el-badge {
      padding-right: 10px;
    }

    span {
      /*color: #333;*/
      /*font-weight: bold;*/
      font-size: 14px;
      background: #fff;
      position: absolute;
      bottom: -9px;
      left: 50px;
      padding: 0 10px;
    }
  }

  .el-table.el-table1 {
    /deep/ tr:nth-of-type(1) {
      th {
        padding: 0;
        background: #F2F2F2;
      }
    }
  }

  .tables {
    div {
      border: 1px solid #ccc;
      border-top: none;
      text-align: center;
      z-index: 9;
    }
  }

  .table-head {
    text-align: center;
    background-color: #f7f7f7;
  }

  .overflow-hidden {
    overflow: hidden;
    width: 100%;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }

  .upload-btn {
    margin: 10px 0 5px 0;
    width: 120px;
    height: 30px;
    border: 1px solid #AAAAAA;
    color: #AAAAAA;
    text-align: center;
    line-height: 30px;
    cursor: pointer;

    &:hover {
      border: 1px solid #66B1FF;
      color: #66B1FF;
    }
  }

  .require:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }

  .requireForm /deep/ .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }

  .red-color {
    color: red !important;
  }

  .timeDiv {
    position: absolute;
    left: 100px;
    top: 10px;
    width: 180px;
  }
</style>
