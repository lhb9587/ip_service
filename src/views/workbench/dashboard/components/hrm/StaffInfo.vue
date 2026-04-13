<!-- 在线考核表 -->
<template>
  <div class="container">
    <el-button @click="closeViewInfo" size="mini">关闭查看</el-button>
    <table class="info-table" border="1" bordercolor="black" style="table-layout:fixed;">
      <caption>
        <h3>员工个人信息表</h3>
      </caption>
      <tr>
        <td align="center" rowspan="8" class="td-width">基本资料</td>
        <td align="center" class="td-width td-lable">姓名</td>
        <td align="center" class="td-width">{{ tableData.talentName }}</td>
        <td align="center" class="td-width td-lable">性别</td>
        <td align="center" class="td-width">{{ tableData.gender }}</td>
        <td align="center" class="td-width td-lable">年龄</td>
        <td align="center" class="td-width">{{ tableData.age }}</td>
<!--        <td rowspan="3" :style="'background-image: url(ipdoc'+tableData.userIcon+'); background-size: cover; background-position: center; background-repeat: no-repeat;'"></td>-->
      </tr>
      <tr>
        <td align="center" class="td-width td-lable">民族</td>
        <td align="center" class="td-width">{{ tableData.nationality }}</td>
        <td align="center" class="td-width td-lable">政治面貌</td>
        <td align="center" class="td-width">{{ tableData.politicsStatus }}</td>
        <td align="center" class="td-width td-lable">婚姻状况</td>
        <td align="center" class="td-width">{{ tableData.maritalStatus }}</td>
      </tr>
      <tr>
        <td align="center" class="td-width td-lable">出生日期</td>
        <td align="center" class="td-width">{{ tableData.birthday }}</td>
        <td align="center" class="td-width td-lable">身份证号</td>
        <td align="center" class="td-width" colspan="3">{{ tableData.certificateNumber }}</td>
      </tr>
      <tr>
        <td align="center" class="td-width td-lable">户籍所在地</td>
        <td align="center" class="td-width" colspan="6">{{ tableData.domicile }}</td>
      </tr>
      <tr>
        <td align="center" class="td-width td-lable">学历</td>
        <td align="center" class="td-width">{{ tableData.mainEduExperience }}</td>
        <td align="center" class="td-width td-lable">外语等级</td>
        <td align="center" class="td-width">{{ this.foreignLanguageLevelShow() }}</td>
        <td align="center" class="td-width td-lable">专业</td>
        <td align="center" class="td-width" colspan="2">{{ (tableData.eduExperiences != undefined && tableData.eduExperiences.length > 0) ? tableData.eduExperiences[0].major : '' }}</td>
      </tr>
      <tr>
        <td align="center" class="td-width td-lable">入学时间</td>
        <td align="center" class="td-width">{{ (tableData.eduExperiences != undefined && tableData.eduExperiences.length > 0) ? tableData.eduExperiences[0].entryDate : '' }}</td>
        <td align="center" class="td-width td-lable">毕业时间</td>
        <td align="center" class="td-width">{{ (tableData.eduExperiences != undefined && tableData.eduExperiences.length > 0) ? tableData.eduExperiences[0].graduateDate : '' }}</td>
        <td align="center" class="td-width td-lable">毕业院校</td>
        <td align="center" class="td-width" colspan="2">{{ (tableData.eduExperiences != undefined && tableData.eduExperiences.length > 0) ? tableData.eduExperiences[0].collegeName : '' }}</td>
      </tr>
      <tr>
        <td align="center" class="td-width td-lable">所属公司</td>
        <td align="center" class="td-width">{{ tableData.belongToCompany }}</td>
        <td align="center" class="td-width td-lable">职（执）业资格</td>
        <td align="center" class="td-width" colspan="4">
          {{ this.qualificationShow() }}
        </td>
      </tr>
      <tr>
        <td align="center" class="td-width td-lable">联系电话</td>
        <td align="center" class="td-width">{{ tableData.phoneNumber }}</td>
        <td align="center" class="td-width td-lable">紧急联系人</td>
        <td align="center" class="td-width">{{ tableData.emergencyName }}</td>
        <td align="center" class="td-width td-lable">紧急联系人电话</td>
        <td align="center" class="td-width" colspan="2">{{ tableData.emergencyPhone }}</td>
      </tr>
      <tr>
        <td align="center" :rowspan="$store.getters.permissions.includes(365) ? 11 : 9">任职信息</td>
        <td align="center" class="td-width td-lable">工作组</td>
        <td align="center" class="td-width">{{ tableData.groupName }}</td>
        <td align="center" class="td-width td-lable">职务</td>
        <td align="center" class="td-width">{{ tableData.posName }}</td>
        <td align="center" class="td-width td-lable">入职日期</td>
        <td align="center" class="td-width">{{ tableData.joinDate }}</td>
      </tr>
      <tr>
        <td align="center" class="td-width td-lable">司龄</td>
        <td align="center" class="td-width">{{ tableData.companyAge }}</td>
        <td align="center" class="td-width td-lable">合同年限(年）</td>
        <td align="center" class="td-width">{{ tableData.contractLimit }}</td>
        <td align="center" class="td-width td-lable">合同到期日期</td>
        <td align="center" class="td-width">{{ tableData.expirationDate }}</td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">合同签订主体</td>
        <td colspan="5" class="td-width">{{ tableData.contractOwner }}</td>
      </tr>
      <tr v-if="$store.getters.permissions.includes(365)">
        <td align="center" colspan="1" class="td-width td-lable">月薪标准</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.payAdjusts && tableData.payAdjusts.length > 0">
            <div>{{ tableData.payAdjusts[0].adjustSalary }}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">绩效记录</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.performances" v-for="item in tableData.performances" :key="item.id">
            <div>考核月份：{{ item.performDate }} <span style="color: #52A0F5;cursor: pointer" @click="clickPerformances(item)">查看文件</span></div>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">转正记录</td>
        <td colspan="5" class="td-width" style="word-wrap:break-word;">
          <div v-if="tableData.positionAdjusts" v-for="item in tableData.positionAdjusts" :key="item.id">
            <template v-if="item.adjustStatus.includes('转正')">
              <div>{{ item.adjustDate }} 部门：{{ item.deptName }} 大组：{{ item.superGroup }} 工作组：{{ item.groupName }} 调整前岗位：{{ item.oldPosName }} 调整后岗位：{{ item.posName }}</div>
            </template>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">晋升记录</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.positionAdjusts" v-for="item in tableData.positionAdjusts" :key="item.id">
            <template v-if="item.adjustStatus.includes('晋升') || item.adjustStatus.includes('升职')">
              <div>
                <span v-if="item.adjustDate">{{ item.adjustDate }} </span>
                <span v-if="item.deptName">部门：{{ item.deptName+ '；' }}  </span>
                <span v-if="item.superGroup">大组：{{ item.superGroup + '；'}} </span>
                <span v-if="item.groupName">工作组：{{ item.groupName + '；' }} </span>
                <span v-if="item.oldPosName">调整前岗位：{{ item.oldPosName + '；' }} </span>
                <span v-if="item.posName">调整后岗位：{{ item.posName }} </span>
              </div>
            </template>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">调岗记录</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.positionAdjusts" v-for="item in tableData.positionAdjusts" :key="item.id">
            <template v-if="['调动调入','平调'].includes(item.adjustStatus)">
              <div>{{ item.adjustDate }} 部门：{{ item.deptName }} 大组：{{ item.superGroup }} 工作组：{{ item.groupName }} 调整前岗位：{{ item.oldPosName }} 调整后岗位：{{ item.posName }}</div>
            </template>
          </div>
        </td>
      </tr>
      <tr v-if="this.$store.getters.permissions.includes(365)">
        <td align="center" colspan="1" class="td-width td-lable">调薪记录</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.payAdjusts" v-for="item in tableData.payAdjusts" :key="item.id">
            <div>调薪类型：{{ item.adjustType }} 调整前薪资：{{ item.currentSalary }} 调整后薪资：{{ item.adjustSalary }} 调薪时间：{{ item.adjustDate }}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">离职日期</td>
        <td colspan="5" class="td-width">{{ tableData.leaveDate }}</td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">离职原因</td>
        <td align="center" colspan="5" class="td-width"></td>
      </tr>
      <tr>
        <td align="center" rowspan="11">其他信息</td>
        <td align="center" colspan="1" class="td-width td-lable">工作经历</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.workExperiences" v-for="item in tableData.workExperiences" :key="item.id">
            <div>{{ item.startDate }} - {{ item.endDate }} {{ item.workCompany }} 部门：{{ item.department }} 职务：{{ item.position }}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">继续教育</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.furtherStudies" v-for="item in tableData.furtherStudies" :key="item.id">
            <div>{{ item.startDate }} - {{ item.endDate }} 地点：{{ item.address }} 组织单位：{{ item.department }} 参会费用类型：{{ item.joinFeeType }} 学习主题：{{ item.content }}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">授课/演讲/主持</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.lessonSpeeches" v-for="item in tableData.lessonSpeeches" :key="item.id">
            <div>
              <span v-if="item.type">类型：{{ item.type + '；' }}</span>
              <span v-if="item.startDate&&item.endDate">时间：{{ item.startDate }} - {{ item.endDate + '；' }} </span>
              <span v-if="item.address">地点：{{ item.address + '；' }} </span>
              <span v-if="item.organization">组织单位：{{ item.organization + '；' }} </span>
              <span v-if="item.title">讲授题目：{{ item.title + '；' }} </span>
              <span v-if="item.subject"> 活动主题：{{ item.subject + '；'}}</span>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">社会任职</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.socialOfficials" v-for="item in tableData.socialOfficials" :key="item.id">
            <div>{{ item.startDate }} - {{ item.endDate }} 授予机构：{{ item.organization }} 职务：{{ item.duty }}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">奖惩记录</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.rewardPunishes" v-for="item in tableData.rewardPunishes" :key="item.id">
            <div>{{ item.gainDate }} 类型：{{ item.content }} 授予机构：{{ item.organization }}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">论文/专著/编著</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.treatises" v-for="item in tableData.treatises" :key="item.id">
            <div>{{ item.title }} 类型：{{ item.type }} 发表时间：{{ item.publishDate }} 名称：{{ item.periodicalName }}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">课题研究项目</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.projectStudies" v-for="item in tableData.projectStudies" :key="item.id">
            <div>{{ item.startDate }} - {{ item.endDate }} {{ item.projectName }} 委托单位：{{ item.organization }} 本人职责与工作情况：{{ item.position }} 证明人：{{ item.authenticator }}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">历年工作总结</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.summaries" v-for="item in tableData.summaries" :key="item.id">
            <div v-if="item.attachFile">{{ item.item }} <span style="color: #52A0F5;cursor: pointer" @click="preView(item.attachFile)">查看文件</span></div>
          </div>
        </td>
      </tr>
      <tr v-if="this.$store.getters.permissions.includes(299)">
        <td align="center" colspan="1" class="td-width td-lable">分管领导点评</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.summaries" v-for="item in tableData.summaries" :key="item.id">
            <div v-if="item.feedback">{{ item.itemDate }} {{ item.feedback }}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="1" class="td-width td-lable">谈话记录</td>
        <td colspan="5" class="td-width">
          <div v-if="tableData.summaries" v-for="item in tableData.summaries" :key="item.id">
            <div v-if="item.content">{{ item.itemDate }} {{ item.content }}</div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.container {
  background-color: #FFFFFF;
  button {
    margin: 5px;
  }
}
.info-table {
  width: 1050px;
  height: 800px;
  margin: auto;
}
.td-lable {
  background-color: #dcdfe6;
}
.td-width{
  padding: 5px;
  width:150px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.picture{
  width: 150px;
  height: auto;
}
</style>
<script>
import { queryTalentPersonInfo, exportTalentPersonPerformance } from '@/api/hrmList.js'
export default {
  props: ['talentCode'],
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.queryTalentPersonInfo()
  },
  methods: {
    queryTalentPersonInfo() {
      queryTalentPersonInfo(this.talentCode).then(res => {
        this.tableData = res.data
      })
    },
    // 预览查看
    preView(url) {
      console.log('url',url)
      if(['doc','docx'].includes(url.replace(/.+\./,"").toLocaleLowerCase())) {
        this.$commonUtils.viewPdf(`${url}`)
      }else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)) {
        window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
      } else {
        this.downLoad(url)
      }
    },
    // 附件下载
    downLoad(url){
      const downData={
        url:`ipdoc${url}`,
        success(){
          // notify.close()
        }
      }
      this.$commonUtils.downLoadAll(downData)
    },
    clickPerformances(row) {
      var data = {
        talentCode: row.talentCode,
        performYear: row.performYear,
        performMonth: row.performMonth
      }
      exportTalentPersonPerformance(data).then(res => {
        if (res.success) {
          this.preView(res.data)
        }
      })
    },
    closeViewInfo() {
      this.$emit('closeViewInfo')
    },
    qualificationShow(){
      const list = [
        this.tableData.practiceType != '无' ? this.tableData.practiceType : '',
        this.tableData.patentType != '无' ? this.tableData.patentType : '',
        this.tableData.trademarkType == '有' ? '商标资格：有' : '',
        this.tableData.arbiterType == '有' ? '仲裁员资格：有' : '',
        this.tableData.judicialType == '有' ? '司法鉴定人资格：有' : ''
      ]
      const filteredList = list.filter(item => item)
      return filteredList.join('；')
    },
    foreignLanguageLevelShow(){
      const languagesList = []
      if (this.tableData.languages&&this.tableData.languages.length>0) {
        this.tableData.languages.map(item=>{
          if (item.languageDegree) {
            languagesList.push(item.languageDegree) 
          }
        })
      }
      return languagesList.join('；')
    }
  }
};
</script>
