<template>
    <div class="Examine-h5">
        <div class="Examine-top">
            <el-row type="flex" class="row-bg">
                <el-col :span="4"></el-col>
                <el-col :span="16">
                    <p>审批详情</p>
                </el-col>
                <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
        </div>
        <div class="Examine-main">
            <div class="Examine-title">
                <el-row type="flex" class="row-bg">
                    <el-col :span="16" :offset="1">
                        <p style="font-size: 20px;"><span style="color: rgb(39, 39, 175);">{{ resUser }}</span>提交的入职审批</p>
                    </el-col>
                    <el-col :span="6">
                        <p style="color: rgb(210, 210, 210); font-size: 12px;margin-top: 6px;">{{ dataDetail.appDate }}</p>
                    </el-col>
                </el-row>
            </div>
            <div class="Examine-detail">
                <div class="message_h5">
                    <div class="blok"></div>
                    <span>审批信息</span>
                </div>
                <el-row type="flex" class="row-bg">
                    <el-col :span="22" :offset="1">
                        <el-descriptions :column="1" class="message-text">
                            <el-descriptions-item label="申请人">{{ resUser }}</el-descriptions-item>
                            <el-descriptions-item label="申请日期">{{ dataDetail.appDate }}</el-descriptions-item>
                            <el-descriptions-item label="招聘岗位">{{ rDetail.recruitPosName }}</el-descriptions-item>
                            <el-descriptions-item label="招聘数量">{{ rDetail.recruitNum }}</el-descriptions-item>
                            <el-descriptions-item label="招聘工作组">{{ rDetail.recruitWkgName }}</el-descriptions-item>
                            <el-descriptions-item label="招聘类型">{{ rDetail.recruitNum }}</el-descriptions-item>
                            <el-descriptions-item label="月薪区间">{{ rDetail.salaryMin }}元/月 - {{ rDetail.salaryMax }}元/月</el-descriptions-item>
                            <el-descriptions-item label="年度奖金区间">{{ rDetail.bonusAmount }}元/年 或 {{ rDetail.bonusMonth }}个月月薪</el-descriptions-item>
                            <el-descriptions-item label="招聘原因">{{ rDetail.recruitReason }}</el-descriptions-item>
                        </el-descriptions>
                        <el-descriptions :column="1" class="message-text" v-if="approveTypeId == 3 || approveTypeId == 4">
                            <el-descriptions-item label="简历来源">{{ dataDetail.source }}</el-descriptions-item>
                            <el-descriptions-item label="招聘说明">{{ dataDetail.description }}</el-descriptions-item>
                            <el-descriptions-item label="查看附件">查看附件</el-descriptions-item>
                            <el-descriptions-item label="姓名">{{ rDetail.enrollName }}</el-descriptions-item>
                            <el-descriptions-item label="性别">{{ rDetail.enrollGende }}</el-descriptions-item>
                            <el-descriptions-item label="岗位">{{ rDetail.enrollPosId }}</el-descriptions-item>
                            <el-descriptions-item label="工作组">{{ rDetail.enrollWkgId }}</el-descriptions-item>
                            <el-descriptions-item label="试用期月薪">{{ rDetail.probationSalary }}</el-descriptions-item>
                            <el-descriptions-item label="转正月薪">{{ rDetail.salary }}</el-descriptions-item>
                            <el-descriptions-item label="合同年限">{{ rDetail.contractLimit }}</el-descriptions-item>
                            <el-descriptions-item label="试用期期限">{{ rDetail.probationMonth }}</el-descriptions-item>
                            <el-descriptions-item label="专业相关证书">{{ rDetail.majorCertificate }}</el-descriptions-item>
                            <el-descriptions-item label="外语等级证书">{{ rDetail.languageCertificate }}</el-descriptions-item>
                            <el-descriptions-item label="面试官评价">{{ rDetail.evaluation }}</el-descriptions-item>
                        </el-descriptions>
                    </el-col>
                </el-row>
            </div>
            <div class="Examine-flow" v-if="len">
                <div class="message_h5">
                    <div class="blok"></div>
                    <span>审批流程</span>
                </div>
                <div>
                    <div class="block">
                        <el-timeline>
                            <el-timeline-item timestamp="2018/4/12" placement="top">
                                <el-card 
                                    class="box-card" 
                                    style="margin-bottom: 10px;" 
                                    v-for="(item, index) in dataDetail.approveOpinions"
                                    :key="index">
                                    <div class="text item">
                                        <el-row :gutter="20" style="margin-bottom: 10px;">
                                            <el-col :span="20" :offset="1">
                                                <p style="font-size: 16px;"><span style="color: blue;">{{ item.auditUserName }}</span>的审批意见：{{ item[idea[index]] }}</p>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="20">
                                            <el-col :span="20" :offset="1">
                                                <span style="color: rgb(156, 156, 156);">补充意见：</span>{{ item.supplementOpinion }}
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-card>
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </div>
            </div>
        </div>
        <div class="Examine-footer">
            <el-row type="flex" style="line-height: 60px;">
                <el-col :span="6" :offset="2">
                    <el-button @click="innerVisible = true" type="primary" size="small" plain icon="el-icon-check">审核</el-button>
                </el-col>
                <el-col :span="7">
                    <el-dropdown>
                        <el-button type="primary" size="small" icon="el-icon-s-operation">
                            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="offChange = true">加签</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col :span="11"></el-col>
            </el-row>
            <ExamineIdeaH5 v-if="innerVisible&&flagT" :approveId="approveId" @offIdea="offIdea" :dataDetail="dataDetail"></ExamineIdeaH5>
            <el-dialog
                width="80%"
                title="加签任务"
                :visible.sync="offChange"
                append-to-body>
                <div class="Change">
                    <div class="rebookTitle">确认要加签这条{{ dataDetail.approveType }}吗？请指定您要加签的人</div>
                    <div class="rebookBody">
                        <div class="bodyRight">
                            <div class="rightTitle">设置加签人员</div>
                            <div class="rightSearch">
                                <el-input v-model="name" @input="searchName" size="small" placeholder="搜索部门名称或人员姓名"></el-input>
                            </div>
                            <div class="rightTable">
                                <el-table 
                                    @row-click="rowClick" 
                                    size="mini" 
                                    :data="list" 
                                    border fit empty-text="暂无数据" 
                                    :row-class-name="rowClassName"
                                    current-row-key
                                    style="width: 100%;">
                                    <el-table-column label="部门" prop="deptName"></el-table-column>
                                    <el-table-column label="姓名" prop="fullname"></el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fl-ac-jc" style="padding: 20px 0">
                    <el-button @click="offChange = false">取 消</el-button>
                    <el-button type="primary" @click="rowSubmit">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { queryApproveProcess, countersignPersonApprove } from '@/api/hrmList.js'
import ExamineIdeaH5 from './components/ExamineIdeaH5.vue'
export default {
    name: "ExamineH5",
    components: {
        ExamineIdeaH5
    },
    data() {
        return {
            innerVisible: false,
            flagT: false,
            offChange: false,
            len: false,
            resUser: '', 
            approveId: null, 
            approveTypeId: null,
            dataDetail: {},
            rDetail: {},
            idea: [],
            name: '',
            auditUserIds: null,
            list: []
        }
    },
    methods: {
        offIdea() {
            this.innerVisible = false
            this.queryApproveProcess()
        },
        rowClassName({row, rowIndex}){
            if(row.userId == this.auditUserIds){
                return 'currentClick'
            }
            return ''
        },
        queryApproveProcess() {
            const data = {
                approveId: 27, 
                approveTypeId: 1
            }
            queryApproveProcess(data).then(res => {
                this.dataDetail = res.data
                this.rDetail =res.data.approveItems[0]
                this.resUser = this.$store.getters.userList.filter(value => value['userId'] === res.data.appUserId)[0].fullname
                this.flagT = true
                this.judGment()
            })
        },
        searchName(value) {
            if (!value) return
            this.auditUserIds = ''
            this.list = this.$store.getters.userList.filter(item => (item.deptName + '~' + item.fullname).includes(value))
        },
        judGment() {
            this.len = this.dataDetail.approveOpinions.length
            if(this.len == 1){
                this.idea = ['councilOpinion']
            }else if(this.len == 2) {
                this.idea = ['councilOpinion', 'chiefOpinion']
            }
        },
        rowClick(row) {
            this.name = row.fullname
            this.auditUserIds = row.userId
        },
        // 加签审批流程
        countersignPersonApprove() {
            const data = {
                approveId: this.approveId,
                currentTaskId: this.dataDetail.currentTaskId,
                auditUserIdList: []
            }
            data.auditUserIdList.push(this.auditUserIds)
            countersignPersonApprove(data).then(res => {
                this.$message({ message: '加签成功', type: 'success' });
                this.offChange = false
            })
        },
        rowSubmit() {
            this.countersignPersonApprove()
        },
    },
    created() {
        this.approveId =  this.$route.query && this.$route.query.approveId
        this.approveTypeId =  this.$route.query && this.$route.query.approveTypeId
        this.queryApproveProcess()
    }
}
</script>

<style lang="scss" scoped>
.Examine-h5 {
    height: auto;
    width: 100%;
    background-color: #f2f6f6;
    display: flex;
    height: 100vh;
    flex-direction: column;
    .Examine-top,.Examine-footer {
        width: 100%;
    }
    .Examine-top {
        width: 100%;
        height: 60px;
        border-bottom: 1px solid #f4f4f4;
        background-color: #fff;
        font-size: 20px;
        .row-bg {
            text-align: center;
            line-height: 60px;
        }
    }
    .Examine-main {
        flex: 1;
        overflow-y: scroll;
        .Examine-title {
            width: 100%;
            background-color: #fff;
            padding: 16px 10px;
        }
        .Examine-detail{
            width: 100%;
            margin-top: 10px;
            background-color: #fff;
            padding: 16px 10px;
            .message-text {
                font-size: 14px;
                margin: 16px 0 0 10px;
            }
        }
        .Examine-flow {
            width: 100%;
            margin-top: 10px;
            padding: 16px 10px;
            background-color: #fff;
            .block {
                padding: 15px 30px 40px 15px;
            }

        }
    }
    .Examine-footer {
        width: 100%;
        height: 80px;
        border-top: 1px solid #f4f4f4;
        background-color: #fff;
        position: absolute;
        bottom: 0
    }
    .message_h5 {
        height: 20px;
        line-height: 16px;
        position: relative;
        .blok {
            height: 14px;
            width: 4px;
            background-color: blue;
            border-radius: 4px;
            float: left;
            margin: 2px 0 0 15px;
        }
        span {
            margin-left: 4px;
            font-size: 16px;
            color: #313131;
        }
    }
}
.Change {
    width: 100%;
    border: 1px solid #D7D7D7;
    padding: 10px;
    .rebookTitle {
        color: #D9001B;
        padding-bottom: 10px;
        border-bottom: 2px solid #797979;
    
    }
    .rebookBody {
        display: flex;
        .bodyRight {
            min-height: 300px;
            max-height: 500px;
            overflow: auto;
            flex: 6;

            .rightTitle {
                text-align: center;
                background-color: #D7D7D7;
                margin-top: 10px;
                height: 30px;
                line-height: 30px;
            }

            .rightSearch {
                .el-input {
                    input {
                        border-radius: 0 !important;
                    }
                }
            }

            .rightTable {
                thead {
                    tr {
                        th {
                            background-color: #D7D7D7;
                            color: #606266;
                        }
                    }
                }
            }
        }
    }
}
.Examine-main::-webkit-scrollbar {
    display: none;
}

</style>