<template>
  <div class="hrm-container">
    <div class="hrm-main">
      <template v-for="(tabItem,tabIndex) in tablesList" :index="tabIndex">
        <div class="main-list">
          <template v-for="form in tabItem.form" :index="form.type">
            <div v-if="isFormData.find(res => res === form.type )" class="module">
              <div class="module-top">
                <div class="module-style"></div>
                <div class="module-name">{{ form.name }}</div>
              </div>
              <div class="module-cont">
                <el-form :inline="true" :model="tableHeader[form.type]" class="demo-form-inline">
                  <el-row>
                    <template v-for="item in tableHeader[form.type]">
                      <el-col v-if="JSON.stringify(item.data) != '{}'" :span="6">
                        <el-form-item :label="item.lable">
                          <template v-if="item.data.firstVal">
<!--                            头像检查-->
                            <template v-if="item.field != 'userIcon'">
                              <template v-if="item.data.secondVal">
                                <el-tooltip class="item" effect="light" :content="'原 :  '+item.data.firstVal" placement="top-start">
                                  <el-button type="text">{{ item.data.secondVal }}</el-button>
                                </el-tooltip>
                              </template>
                              <template v-else>
                                <span style="text-decoration: line-through red">{{ item.data.firstVal }}</span>
                              </template>
                            </template>
                            <template v-else>
                              <img :src="'ipdoc'+item.data.secondVal" class="avatar">
                            </template>
                          </template>
                          <template v-else>
                            <template v-if="item.field != 'userIcon'">
                              <span style="color: green">{{ item.data.secondVal }}</span>
                            </template>
                            <template v-else>
                              <img :src="'ipdoc'+item.data.secondVal" class="avatar">
                            </template>
                          </template>
                        </el-form-item>
                      </el-col>
                    </template>
                  </el-row>
                </el-form>
              </div>
            </div>
          </template>
          <template v-if="tabItem.tag && changedFields.find(field => field.fieldName === 'personLabelList')">
            <div class="module">
              <div class="module-top">
                <div class="module-style"></div>
                <div class="module-name">个人标签特点（工作领域专长）</div>
              </div>
              <div class="module-cont">
                <template v-for="tag in changedFields.find(field => field.fieldName === 'personLabelList').firstVal">
                  <span style="text-decoration: line-through red">{{tag}}</span>
                </template>
                <el-tag
                  :key="tag"
                  v-for="tag in changedFields.find(field => field.fieldName === 'personLabelList').secondVal"
                  :disable-transitions="false">
                  {{tag}}
                </el-tag>
              </div>
            </div>
          </template>
          <template v-for="table in tabItem.table">
            <div v-if="changedFields.find(field => field.fieldName === table.type)" class="module">
              <div class="module-top">
                <div class="module-style"></div>
                <div class="module-name">{{ table.name }}</div>
              </div>
              <div class="module-cont">
                <el-table
                  :data="changedFields.find(field => field.fieldName === table.type).secondVal"
                  style="width: 100%">
                  <el-table-column
                    v-for="(item, index) in tableHeader[table.type].header"
                    :key="index"
                    :prop="index"
                    :label="item.lable"
                    show-overflow-tooltip
                    :width="item.headerWidth ? item.headerWidth : tableHeader[table.type].headerWidth">
                    <template slot-scope="scope">
                      <div v-if="!changedFields.find(field => field.fieldName === table.type).firstVal.find(val => val.id === scope.row.id)" :style="scope.row.id ? 'text-decoration: line-through red' : 'color:green'">
                        <!--删除和新增-->
                        <template v-if="item.type != 'upload'">
                          {{ showHandle(scope.row[item.field],item.handle,item.field) }}
                        </template>
                        <template v-else>
                          <el-button v-if="scope.row[item.field]" type="text" size="small" @click="preView(scope.row[item.field])">查看</el-button>
                          <span v-else>未上传</span>
                        </template>
                      </div>
                      <div v-else>
<!--                        旧数据和新数据对比-->
                        <template v-if="changedFields.find(field => field.fieldName === table.type).firstVal.find(val => val.id === scope.row.id)[item.field] != scope.row[item.field]">
                          <template v-if="changedFields.find(field => field.fieldName === table.type).firstVal.find(val => val.id === scope.row.id)[item.field]">
                            <el-tooltip class="item" effect="light" :content="'原 :  '+changedFields.find(field => field.fieldName === table.type).firstVal.find(val => val.id === scope.row.id)[item.field]" placement="top-start">
                              <el-button type="text">
                                <template v-if="item.type != 'upload'">
                                  {{ showHandle(scope.row[item.field],item.handle,item.field) }}
                                </template>
                                <template v-else>
                                  <el-button v-if="scope.row[item.field]" type="text" size="small" @click="preView(scope.row[item.field])">查看</el-button>
                                  <span v-else>未上传</span>
                                </template>
                              </el-button>
                            </el-tooltip>
                          </template>
                          <template v-else>
                            <div style="color: green">
                              <template v-if="item.type != 'upload'">
                                {{ showHandle(scope.row[item.field],item.handle,item.field) }}
                              </template>
                              <template v-else>
                                <el-button v-if="scope.row[item.field]" type="text" size="small" @click="preView(scope.row[item.field])">查看</el-button>
                                <span v-else>未上传</span>
                              </template>
                            </div>
                          </template>
                        </template>
<!--                        旧数据和新数据对比未发生变化显示-->
                        <template v-else>
                          <template v-if="item.type != 'upload'">
                            {{ showHandle(scope.row[item.field],item.handle,item.field) }}
                          </template>
                          <template v-else>
                            <el-button v-if="scope.row[item.field]" type="text" size="small" @click="preView(scope.row[item.field])">查看</el-button>
                            <span v-else>未上传</span>
                          </template>
                        </template>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </template>
        </div>
      </template>
      <div v-if="auditInfo.auditStatus === 0" class="audit-button">
        <el-button @click="handleFailed(2)">未通过</el-button>
        <el-button type="primary" @click="handleFailed(1)">通过</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { auditModifyRecord } from '@/api/hrmList'
import Hrm from '../../../dashboard/hrm'
export default {
  name: 'AuditDetail',
  components: { Hrm },
  props: ['auditInfo'],
  data() {
    return {
      changedFields: [],
      tablesList: {
        personal: {
          form: [
            { name: '头像', type: 'userPhoto' },
            { name: '基本信息', type: 'personalInfo' },
          ],
          table: [
            { name: '社会关系', type: 'socialRelations' },
            { name: '教育经历', type: 'eduExperiences' },
            { name: '外语水平', type: 'languages' }
          ]
        },
        tags: {
          tag: [
            { name: '个人标签特点（工作领域专长）', type: 'personLabelList' },
          ]
        },
        job: {
          form: [
            { name: '在职信息', type: 'positionInfo' },
          ],
          table: [
            { name: '岗位调整', type: 'positionAdjusts' },
            { name: '历史劳动合同', type: 'laborContracts', step: 2 }
          ]
        },
        certificate: {
          form: [
            { name: '法律/司法鉴定/仲裁/专利/商标资格', type: 'quals' },
            { name: '专利代理师', type: 'patentAgent' },
            { name: '执业律师', type: 'legalLawyer' },
            { name: '法律职业资格', type: 'legalProfessions' },
            { name: '专利代理资格', type: 'patentAgency' },
            { name: '商标资格', type: 'trademarkInfo' },
            { name: '仲裁员资格', type: 'arbiterInfo' },
            { name: '司法鉴定人资格', type: 'judicialInfo' },
          ],
          table: [
            { name: '指导律师记录', type: 'guidedLawyers' },
            { name: '实习律师记录', type: 'lawyerTeachers' },
            { name: '专利实习备案记录', type: 'patentPractices' },
            { name: '职称和专业技术人员资格', type: 'certificates' }
          ]
        },
        experience: {
          form: [],
          table: [
            { name: '工作经历', type: 'workExperiences' },
            { name: '继续教育', type: 'furtherStudies' },
            { name: '授课/演讲/主持', type: 'lessonSpeeches' },
            { name: '社会任职', type: 'socialOfficials' },
            { name: '奖惩记录', type: 'rewardPunishes' },
            { name: '论文/专著/编著', type: 'treatises' },
            { name: '课题研究项目', type: 'projectStudies' }
          ]
        },
        evaluate: {
          form: [],
          table: [
            { name: '试用期/转正', type: 'trialPeriods', step: 0 },
            { name: '续签', type: 'renewals', step: 1 },
            { name: '岗位/薪酬调整', type: 'changes', step: 2 },
            { name: '个人总结', type: 'summaries', step: 3 },
          ]
        },
        salary: {
          form: [],
          table: [
            { name: '调薪记录', type: 'payAdjusts' },
            { name: '年终奖记录', type: 'bonuses' },
          ]
        }
      }, // 相同table表格循环配置
      tableHeader: {
        userPhoto: [
          { lable: '头像', field: 'userIcon', data: {}}
        ],
        personalInfo: [
          { lable: '姓名', field: 'talentName', data: {}},
          { lable: '工号', field: 'talentCode', data: {}},
          { lable: '性别', field: 'gender', data: {}},
          { lable: '年龄', field: 'age', data: {}},
          { lable: '出生日期', field: 'birthday', data: {}},
          { lable: '政治面貌', field: 'politicsStatus', data: {}},
          { lable: '民族', field: 'nationality', data: {}},
          { lable: '婚姻状况', field: 'maritalStatus', data: {}},
          { lable: '手机号码', field: 'phoneNumber', data: {}},
          { lable: '备用邮箱', field: 'secondEmail', data: {}},
          { lable: '档案存放单位', field: 'archiveUnit', data: {}},
          { lable: '参加工作时间', field: 'startWorkDate', data: {}},
          { lable: '证件类型', field: 'certificateType', data: {}},
          { lable: '证件号码', field: 'certificateNumber', data: {}},
          { lable: '证件颁发日期', field: 'certificateIssueDate', data: {}},
          { lable: '证件有效期', field: 'certificateValidityDate', data: {}},
          { lable: '户籍地址', field: 'domicile', data: {}},
          { lable: '户籍地址-邮编', field: 'domicilePostCode', data: {}},
          { lable: '现居住地址', field: 'living', data: {}},
          { lable: '现居住地址-邮编', field: 'livingPostCode', data: {}},
          { lable: '紧急联系人姓名', field: 'emergencyName', data: {}},
          { lable: '紧急联系人电话', field: 'emergencyPhone', data: {}}
        ], // 基本信息
        positionInfo: [
          { lable: '员工类型', field: 'empType', data: {}},
          { lable: '部门', field: 'department', data: {}, hide: true },
          { lable: '工作组', field: 'groupName', data: {}, hide: true },
          { lable: '岗位名称', field: 'posName', data: {}, hide: true },
          { lable: '合同签订主体', field: 'contractOwner', data: {}},
          { lable: '合同起始日期', field: 'contractDate', data: {}},
          { lable: '合同终止日期', field: 'expirationDate', data: {}},
          { lable: '合同年限', field: 'contractLimit', data: {}},
          { lable: '工作邮箱', field: 'email', data: {}},
          { lable: '入职日期', field: 'joinDate', data: {}},
          { lable: '转正日期', field: 'regularDate', data: {}},
          { lable: '离职日期', field: 'leaveDate', data: {}},
          { lable: '工资发放地', field: 'paymentPlace', data: {}},
          { lable: '调整时间(年)', field: 'workAdjustTime', data: {}},
          { lable: '所属公司', field: 'belongToCompany', data: {}}
        ], // 岗位信息
        quals: [
          { lable: '法律资格', field: 'practiceType', data: {}},
          { lable: '专利资格', field: 'patentType', data: {}},
          { lable: '商标资格', field: 'trademarkType', data: {}},
          { lable: '仲裁员资格', field: 'arbiterType', data: {}},
          { lable: '司法鉴定人资格', field: 'judicialType', data: {}}
        ], // 法律/专利资格
        legalLawyer: [
          { lable: '执业机构', field: 'practiceOrganization', data: {}},
          { lable: '执业证类别', field: 'practiceClass', data: {}},
          { lable: '执行证号', field: 'practiceNumber', data: {}},
          { lable: '职业资格证号', field: 'practiceQualifyNumber', data: {}},
          { lable: '发证机关', field: 'practiceUnit', data: {}},
          { lable: '发证日期', field: 'firstPracticeDate', data: {}},
          { lable: '执业年限', field: 'practiceYear', data: {}},
          { lable: '年度考核结果', field: 'practiceEvaluationResult', data: {}},
          { lable: '工作地点', field: 'practiceWorkPlace', data: {}},
          { lable: '执业证所在地', field: 'practicePlace', data: {}},
          { lable: '分所负责人', field: 'practiceManager', data: {}},
          { lable: '指导律师资质', field: 'practiceGuided', data: {}}
        ], // 执业律师
        legalProfessions: [
          { lable: '资格名称', field: 'legalProfessionName', data: {}},
          { lable: '证书编号', field: 'legalProfessionNumber', data: {}},
          { lable: '取得资格证时间', field: 'legalProfessionAcquireDate', data: {}},
          { lable: '颁发单位', field: 'legalProfessionOrganization', data: {}}
        ], // 法律职业资格
        patentAgent: [
          { lable: '专业领域', field: 'patentMajor', data: {}},
          { lable: '资格证号', field: 'patentQualifyNumber', data: {}},
          { lable: '颁证日期', field: 'patentAcquireDate', data: {}},
          { lable: '首页执业日期', field: 'firstPatentDate', data: {}},
          { lable: '执业机构', field: 'patentOrganization', data: {}},
          { lable: '备案编号', field: 'patentNumber', data: {}},
          { lable: '备案日期', field: 'patentRecordDate', data: {}},
          { lable: '备案机关', field: 'patentRecordUnit', data: {}}
        ], // 专利代理师
        patentAgency: [
          { lable: '资格名称', field: 'patentAgencyName', data: {}},
          { lable: '证书编号', field: 'patentAgencyNumber', data: {}},
          { lable: '取得资格证时间', field: 'patentAgencyAcquireDate', data: {}},
          { lable: '颁发单位', field: 'patentAgencyOrganization', data: {}}
        ], // 专利代理资格
        trademarkInfo: [
          { lable: '资格名称', field: 'trademarkName', data: {}},
          { lable: '证书编号', field: 'trademarkNumber', data: {}},
          { lable: '证书有效期', field: 'trademarkLimitDate', data: {}},
          { lable: '颁发单位', field: 'trademarkUnit', data: {}}
        ], // 商标资格
        arbiterInfo: [
          { lable: '资格名称', field: 'arbiterName', data: {}},
          { lable: '证书编号', field: 'arbiterNumber', data: {}},
          { lable: '签发日期', field: 'arbiterIssueDate', data: {}},
          { lable: '聘任期限', field: 'arbiterLimitDate', data: {}},
          { lable: '颁发单位', field: 'arbiterUnit', data: {}}
        ], // 仲裁员资格
        judicialInfo: [
          { lable: '资格名称', field: 'judicialName', data: {}},
          { lable: '证书编号', field: 'judicialNumber', data: {}},
          { lable: '签发日期', field: 'judicialIssueDate', data: {}},
          { lable: '聘任期限', field: 'judicialLimitDate', data: {}},
          { lable: '颁发单位', field: 'judicialUnit', data: {}}
        ], // 司法鉴定人资格
        guidedLawyers: {
          currentPage: 1,
          header: [
            { lable: '指导的实习律师', field: 'guidedLawyer', data: {}},
            { lable: '起始时间', field: 'startDate', data: {}},
            { lable: '到期时间', field: 'endDate', data: {}}
          ]
        }, // 指导实习律师记录
        lawyerTeachers: {
          currentPage: 1,
          header: [
            { lable: '指导律师', field: 'lawyerTeacher', type: 'input' },
            { lable: '起始时间', field: 'startDate', type: 'date' },
            { lable: '到期时间', field: 'endDate', type: 'date' },
            { lable: '实习证号', field: 'certificateNumber', type: 'input' },
            { lable: '职业资格证号', field: 'qualificationNumber', type: 'input' },
            { lable: '取得资格证时间', field: 'acquireDate', type: 'date' }
          ]
        }, // 实习律师记录
        patentPractices: {
          currentPage: 1,
          header: [
            { lable: '指导老师', field: 'lawyerTeacher', type: 'input' },
            { lable: '起始时间', field: 'startDate', type: 'date' },
            { lable: '到期时间', field: 'endDate', type: 'date' },
            { lable: '资格证号', field: 'certificationNumber', type: 'input' },
            { lable: '取得资格证时间', field: 'acquireDate', type: 'date' }
          ]
        }, // 专利实习备案记录
        socialRelations: {
          currentPage: 1,
          header: [
            { lable: '关系类型', field: 'relationType', data: {}, options: ['父亲','母亲','哥哥','姐姐','弟弟','妹妹'] },
            { lable: '姓名', field: 'relationName', data: {}},
            { lable: '工作/学习单位', field: 'relationOccupation', data: {}},
            { lable: '职务/身份', field: 'relationJob', data: {}},
            { lable: '联系电话', field: 'relationPhone', data: {}}
          ]
        }, // 社会关系
        eduExperiences: {
          currentPage: 1, // 当前页码
          headerWidth: '160',
          header: [
            { lable: '入学时间', field: 'entryDate', data: {}},
            { lable: '毕业时间', field: 'graduateDate', data: {}},
            { lable: '毕业院校', field: 'collegeName', data: {}},
            { lable: '所学专业', field: 'major', data: {}},
            { lable: '学历', field: 'eduExperience', data: {}},
            { lable: '学历证书编号', field: 'experienceNumber', data: {}},
            { lable: '学历附件', field: 'experienceFile', type: 'upload', options: 1 },
            { lable: '学位', field: 'eduDegree', data: {}},
            { lable: '学位证书编号', field: 'degreeNumber', data: {}},
            { lable: '学位附件', field: 'degreeFile', type: 'upload', options: 5 }
          ]
        }, // 教育经历
        languages: {
          currentPage: 1, // 当前页码
          header: [
            { lable: '外语种类', field: 'language', data: {}},
            { lable: '考试种类和等级/成绩', field: 'languageDegree', data: {}},
            { lable: '获取时间', field: 'acquireDate', data: {}},
            { lable: '工作语言', field: 'workingLanguage', data: {}}
          ]
        },
        positionAdjusts: {
          currentPage: 1,
          header: [
            { lable: '调整类型', field: 'adjustStatus', data: {}, options: ['员工初始化','转正','雇佣入职','调动调入','晋升','兼职','辞退','辞职','返聘','返聘终止','其他'] },
            { lable: '部门', field: 'deptName', type: 'selectDepartment', function: 'positionChange', options: [] },
            { lable: '大组', field: 'superGroup', type: 'selectDepartment', function: 'positionChange', options: [] },
            { lable: '工作组', field: 'groupName', type: 'selectWorkGroup', function: 'positionChange', options: [] },
            { lable: '调整前岗位', field: 'oldPosName', type: 'selectPositions', function: 'positionChange', options: [] },
            { lable: '调整后岗位', field: 'posName', type: 'selectPositions', function: 'positionChange', options: [] },
            { lable: '任职类型', field: 'mainOfficial', type: 'selectValue', function: 'positionChange', handle: true, options: [
              {
                value: 1,
                label: '主要任职'
              },{
                value: 0,
                label: '兼职任职'
              }
            ]},
            { lable: '生效日期', field: 'adjustDate', data: {}}
          ]
        },
        laborContracts: {
          currentPage: 1,
          header: [
            // { lable: '合同编号', field: 'serialNumber', type: 'input' },
            { lable: '劳动合同主体', field: 'contractOwner', type: 'select', function: 'contractChange', options: ['北京万慧达知识产权代理有限公司', '北京市万慧达律师事务所', '北京万慧达（上海）律师事务所', '北京君策知识产权发展中心', '北京市万慧达（广州）律师事务所', '北京万慧达知识产权代理有限公司上海分公司', '北京万慧达知识产权代理有限公司苏州分公司', '北京万慧达知识产权代理有限公司广州分公司', '北京万慧达知识产权代理有限公司重庆分公司', '北京万慧达知识产权代理有限公司杭州分公司', '北京曜斗科技有限公司', '北京万慧达知识产权代理有限公司天津分公司', '苏州万慧达知识产权咨询服务有限公司', '广州万慧达知识产权咨询服务有限公司', '重庆万慧达知识产权服务有限责任公司', '北京市万慧达（深圳）律师事务所', '北京万慧达知识产权代理有限公司宁波分公司', '北京通达亿管理咨询中心', '北京市万慧达（苏州）律师事务所', '广州达申商务咨询有限公司', '北京市万慧达（重庆）律师事务所', '北京君策九州科技有限公司', '广州达申商务咨询有限公司上海分公司', '北京万慧达（宁波）律师事务所', '北京万慧达（杭州）律师事务所','北京佰舟知识产权代理有限公司','北京璞琰科贸有限公司'] },
            { lable: '合同编码', field: 'serialNumber', type: 'input', function: 'contractChange' },
            { lable: '合同期限类型', field: 'contractType', type: 'select', function: 'contractChange', options: ['固定期限','无固定期限'] },
            { lable: '合同期限（年）', field: 'contractLimit', type: 'input', function: 'contractChange' },
            { lable: '生效日期', field: 'takeEffectDate', type: 'date', function: 'contractChange' },
            { lable: '终止日期', field: 'terminalDate', type: 'date', function: 'contractChange'},
            // { lable: '签订日期', field: 'contractDate', type: 'date' },
            { lable: '解除日期', field: 'relieveDate', type: 'date', function: 'contractChange' }
          ]
        }, // 劳动合同
        certificates: {
          currentPage: 1,
          header: [
            { lable: '资格名称', field: 'name', data: {}},
            { lable: '资格等级', field: 'level', data: {}},
            { lable: '取得资格证书时间', field: 'acquireDate', data: {}},
            { lable: '证书编号', field: 'certificationNumber', data: {}},
            { lable: '颁发单位', field: 'organization', data: {}},
            { lable: '专业', field: 'major', data: {}}
          ]
        },
        workExperiences: {
          currentPage: 1,
          header: [
            { lable: '开始时间', field: 'startDate', data: {}},
            { lable: '结束时间', field: 'endDate', data: {}},
            { lable: '工作单位', field: 'workCompany', headerWidth: '350', data: {}},
            { lable: '部门', field: 'department', data: {}},
            { lable: '职务', field: 'position', data: {}}
          ]
        },
        furtherStudies: {
          currentPage: 1,
          headerWidth: '160',
          header: [
            { lable: '起始时间', field: 'startDate', data: {}},
            { lable: '结束时间', field: 'endDate', data: {}},
            { lable: '地点', field: 'address', data: {}},
            { lable: '组织单位', field: 'organization', data: {}},
            { lable: '参会费用类型', field: 'joinFeeType', data: {}},
            { lable: '学习主题', field: 'content', data: {}},
            { lable: '学习形式', field: 'form', data: {}},
            { lable: '学时', field: 'classHour', data: {}},
            { lable: '考试考核结果', field: 'result', data: {}}
          ]
        },
        lessonSpeeches: {
          currentPage: 1,
          // headerWidth: '160',
          header: [
            { lable: '类型', field: 'type', data: {}},
            { lable: '起始时间', field: 'startDate', data: {}},
            { lable: '结束时间', field: 'endDate', data: {}},
            { lable: '地点', field: 'address', data: {}},
            { lable: '组织单位', field: 'organization', data: {}},
            { lable: '参会费用类型', field: 'joinFeeType', data: {}},
            { lable: '活动规模', field: 'activityScale', data: {}},
            { lable: '活动主题', field: 'subject', data: {}},
            { lable: '讲授题目', field: 'title', data: {}},
            { lable: '证明文件', field: 'credentialFile', type: 'upload', options: 6 }
          ]
        },
        socialOfficials: {
          currentPage: 1,
          header: [
            { lable: '起始时间', field: 'startDate', data: {}},
            { lable: '结束时间', field: 'endDate', data: {}},
            { lable: '授予机构', field: 'organization', data: {}},
            { lable: '职务', field: 'duty', data: {}},
            { lable: '证明文件', field: 'credentialFile', type: 'upload', options: 3 }
          ]
        },
        rewardPunishes: {
          currentPage: 1,
          header: [
            { lable: '获得时间', field: 'gainDate', data: {}},
            { lable: '表彰奖励/惩罚名称', field: 'content', data: {}},
            { lable: '授予机构', field: 'organization', data: {}},
            { lable: '证明文件', field: 'credentialFile', type: 'upload', options: 2 }
          ]
        },
        treatises: {
          currentPage: 1,
          header: [
            { lable: '标题', field: 'title', data: {}},
            { lable: '类型', field: 'type', data: {}},
            { lable: '作者总人数', field: 'authorNumber', data: {}},
            { lable: '本人排名', field: 'personRanking', data: {}},
            { lable: '发表时间', field: 'publishDate', data: {}},
            { lable: '刊物名称/出版单位/学术会议名称', field: 'periodicalName', data: {}},
            { lable: '卷号/期号/页码', field: 'issueNumber', data: {}},
            { lable: '证明文件', field: 'credentialFile', type: 'upload', options: 7 }
          ]
        },
        projectStudies: {
          currentPage: 1,
          header: [
            { lable: '起始时间', field: 'startDate', data: {}},
            { lable: '结束时间', field: 'endDate', data: {}},
            { lable: '项目名称', field: 'projectName', data: {}},
            { lable: '委托单位', field: 'organization', data: {}},
            { lable: '本人职责与工作情况', field: 'position', data: {}},
            { lable: '证明人', field: 'authenticator', data: {}}
          ]
        },
        trialPeriods: {
          currentPage: 1,
          header: [
            { lable: '项目', field: 'item', type: 'select', options: ['试用期','转正','其他'] },
            { lable: '日期', field: 'itemDate', type: 'date' },
            { lable: '附件', field: 'attachFile', type: 'upload', options: 8 },
            { lable: '沟通内容', field: 'content', type: 'textarea' },
            { lable: '人力面谈人员', field: 'hrUserName', type: 'input' }
          ]
        },
        renewals: {
          currentPage: 1,
          header: [
            { lable: '项目', field: 'item', type: 'input' },
            { lable: '日期', field: 'itemDate', type: 'date' },
            { lable: '附件', field: 'attachFile', type: 'upload', options: 9 },
            { lable: '沟通内容', field: 'content', type: 'textarea' },
            { lable: '人力面谈人员', field: 'hrUserName', type: 'input' }
          ]
        },
        changes: {
          currentPage: 1,
          header: [
            { lable: '项目', field: 'item', type: 'input' },
            { lable: '日期', field: 'itemDate', type: 'date' },
            { lable: '附件', field: 'attachFile', type: 'upload', options: 10 },
            { lable: '沟通内容', field: 'content', type: 'textarea' },
            { lable: '人力面谈人员', field: 'hrUserName', type: 'input' }
          ]
        },
        summaries: {
          currentPage: 1,
          header: [
            { lable: '项目', field: 'item', type: 'select', options: ['2022年度总结'] },
            { lable: '日期', field: 'itemDate', type: 'date' },
            { lable: '附件', field: 'attachFile', type: 'upload', options: 11 },
            { lable: '评价反馈', field: 'content', type: 'textarea', permissions: 299 },
            { lable: '负责人', field: 'hrUserName', type: 'input', permissions: 299 }
          ]
        },
        payAdjusts: {
          currentPage: 1,
          header: [
            { lable: '调薪类型', field: 'adjustType', data: {}},
            { lable: '调整前薪资', field: 'currentSalary', data: {}},
            { lable: '调整后薪资', field: 'adjustSalary', data: {}},
            { lable: '调薪时间', field: 'adjustDate', data: {}}
          ]
        },
        bonuses: {
          currentPage: 1,
          header: [
            { lable: '年度', field: 'bonusYear', data: {}},
            { lable: '年终奖金额', field: 'bonusAmount', data: {}}
          ]
        }
      }, // table顶部列名
      formHandleList: ['userPhoto','personalInfo','positionInfo','quals','patentAgent','legalLawyer','trademarkInfo','arbiterInfo','judicialInfo','legalProfessions','patentAgency'], // 表单循环单独处理
      tableHandleList: ['socialRelations','eduExperiences','languages','positionAdjusts','guidedLawyers','lawyerTeachers','patentPractices','certificates','workExperiences','furtherStudies','lessonSpeeches','socialOfficials','rewardPunishes','treatises','projectStudies','trialPeriods','renewals','changes','summaries','payAdjusts','bonuses','laborContracts',''], // table循环单独处理
      isFormData: [], // 判断模块下是否有变动数据
    }
  },
  created() {
    this.changedFields = JSON.parse(this.auditInfo.changedFields)
    this.changedFields && this.dataInit()
  },
  methods: {
    dataInit() {
      // form表单项展示循环判断，比如（判断基本信息，字段是否在修改记录中，有的话作为判断显示）
      this.formHandleList.forEach(item => {
        this.tableHeader[item].forEach(result => {
          if (this.changedFields.find(field => field.fieldName === result.field)) {
            result.data = this.changedFields.find(field => field.fieldName === result.field)
            this.isFormData.push(item)
          }
        })
      })

      this.changedFields.forEach(item => {
        if (this.tableHandleList.includes(item.fieldName)) {
          if (!item.secondVal) {
            item.secondVal = [];
          }
          for (let index = item.firstVal.length - 1; index >= 0; index--) {
            const first = item.firstVal[index];
            if (!item.secondVal.find(second => second.id === first.id)) {
              item.secondVal.push(first);
              item.firstVal.splice(index, 1);
            }
          }
        }
      });

      console.log('changedFields',this.changedFields)
    },
    handleFailed(status) {
      const message = status == 1 ? '需补充项目' : '未通过原因'
      this.$prompt('', '请输入' + message, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        inputType: 'textarea'
      }).then(({ value }) => {
        if(value) {
          this.auditHandle(status,value)
        }else{
          if (status == 1){
            this.auditHandle(status,'')
          }else{
            this.$message({
              type: 'warning',
              message: '请填写未通过原因'
            });
          }
        }
      }).catch(() => {});
    },
    auditHandle(status,comment) {
      let data = {
        id: this.auditInfo.auditId,
        talentCode: this.auditInfo.talentCode,
        auditStatus: status,
        submitUserId: this.$store.getters.userId,
        comment: comment
      }
      auditModifyRecord(data).then(res => {
        if (res.success) {
          this.$message({
            message: res.message,
            type: 'success'
          });
          this.$emit('closeAuditDetail')
        }
      })
    },
    // 显示处理,一些特殊内容转换
    showHandle(content, handle, field) {
      if (handle && content != null) {
        switch (field) {
          case 'mainOfficial':
            return content ? '主要任职' : '次要任职'
          case 'EditCredit':
            return 'warning'
          case 'ManuallyNotPassed':
            return 'danger'
        }
      }
      return content
    },
    // 预览查看
    preView(url) {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.hrm-container {
  width: 100%;
  display: inline-block;
  background-color: #F2F2F2;
}
.hrm-header{
  height: 215px;
  margin: 10px 10px 15px 10px;
  color: #000000;
  .info-top{
    display: flex;
    height: 150px;
    background-color: #FFFFFF;
    .user-info{
      height: 40px;
      line-height: 40px;
      display: flex;
      margin-top: 35px;
      .username{
        font-size: 28px;
        font-weight: bold;
        margin-right: 20px;
      }
      .user-group{
        font-size: 18px;
        span{
          margin-left: 20px;
          color: #7F7F7F;
          font-size: 16px;
        }
      }
    }
    .user-contact{
      height: 21px;
      line-height: 21px;
      display: flex;
      font-size: 18px;
      margin-top: 20px;
      .split-line{
        margin: 0 20px;
      }
      i{
        color: #AAAAAA;
        margin-right: 10px;
      }
    }
  }
  .top-right{
    margin: 10px 10px 10px auto;
  }
  .info-tab{
    height: 50px;
    margin-top: 15px;
    background-color: #FFFFFF;
    .el-tabs{
      margin-left: 15px;
      /deep/ .el-tabs__nav-wrap::after{
        background-color: #FFFFFF;
      }
      /deep/ .el-tabs__item{
        height: 50px;
        line-height: 50px;
        font-size: 16px;
      }
    }
  }
}
.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 24px 20px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.hrm-main{
  height: 640px;
  margin: 10px;
  overflow: auto;
  .main-list{
    //background-color: #FFFFFF;
    .module{
      //height: 200px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      background-color: #FFFFFF;
      .module-top{
        height: 55px;
        display: flex;
        .module-style{
          width: 8px;
          height: 25px;
          margin: 15px 15px;
          background: #409EFF;
        }
        .module-name{
          height: 21px;
          font-size: 16px;
          font-weight: bold;
          margin-top: 20px;
        }
        .right-button{
          font-size: 14px;
          cursor: pointer;
          color: #409EFF;
          margin: 10px 10px 10px auto;
        }
      }
      .module-cont{
        padding: 0 15px;
        .module-td{
          /deep/ .el-table__body td{
            padding: 7px 0 !important;
          }
        }
        .paging{
          display: flex;
          .page{
            width: 100px;
            font-size: 12px;
            color: #555555;
            letter-spacing: 5px;
            margin: 15px 10px 0 10px;
          }
          .el-pagination{
            margin: 5px 5px -5px auto;
          }
        }
        .el-row{
          margin-bottom: 0px;
        }
        .el-form-item{
          margin-bottom: 0px;
          width: 100%;
        }
        .item-half{
          /deep/ .el-form-item__label{
            width: 20% !important;
          }
        }
        .el-form--inline {
          /deep/ .el-form-item__label{
            width: 40%;
            color: #7F7F7F;
            font-weight: 500;
            letter-spacing: 2px;
            padding: 0 15px 0 0;
          }
          /deep/ .el-form-item__content{
            width: 60%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space:nowrap;
            letter-spacing: 1px;
          }
        }
        .el-date-editor.el-input {
          width: 100%;
        }
        .el-select{
          width: 100%;
        }
        .el-tag + .el-tag {
          margin-left: 10px;
        }
        .button-new-tag {
          margin-left: 10px;
          height: 32px;
          line-height: 30px;
          padding-top: 0;
          padding-bottom: 0;
        }
        .input-new-tag {
          width: 90px;
          margin-left: 10px;
          vertical-align: bottom;
        }
      }
    }
  }

  .lawyer-right-button{
    font-size: 14px;
    cursor: pointer;
    float: right;
    color: #409EFF;
    margin: 10px 10px 10px auto;
  }

  .right-column{
    width: 15%;
    height: 640px;
    margin-left: 15px;
    background-color: #FFFFFF;
    .el-steps{
      margin: 50px 0px 0px 40px;
    }
  }

  .audit-button {
    width: 200px;
    margin: 0 auto;
    .el-button + .el-button {
      margin-left: 40px;
    }
  }
}

.el-table{
  /deep/ th{
    padding: 6px 0;
    color: #555555;
    background: #FAFAFA;
  }
}
</style>
