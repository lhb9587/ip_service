<template>
    <div>
        <div style="height: auto; margin-bottom: 30px;">
            <div class="message">
                <div class="blok"></div>
                <span>基础信息</span>
                <div class="segmentation"></div>
            </div>
            <div class="Basics-message" v-if="baseicsMsg1.includes(approveTypeId)">
                <el-row v-if="approveTypeId == 7">
                    <el-col :span="24">
                        <div>
                            <p>主题</p>{{ dataDetail.title }}
                        </div>
                    </el-col>
                </el-row>
                <el-row v-if="approveTypeId == 9">
                    <el-col :span="24">
                        <div>
                            <p>主题</p>申请进入晋升考核期
                        </div>
                    </el-col>
                </el-row>
                <el-row v-if="approveTypeId == 10">
                    <el-col :span="24">
                        <div>
                            <p>晋升说明</p>{{ dataDetail.description }}
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="11">
                        <div>
                            <p>申请人</p>{{ dataDetail.createUser }}
                        </div>
                    </el-col>
                    <el-col :span="11" :offset="1">
                        <div>
                            <p>申请日期</p>{{ dataDetail.appDate }}
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="Basics-message" v-if="approveTypeId == 3 || approveTypeId == 4">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div>
                            <p>简历来源</p>{{ dataDetail.source }}
                        </div>
                    </el-col>
                    <el-col :span="11">
                    <div style="display: flex;" >
                        <p>附件</p>
                        <div class="fujian">
                            <div class="fontColor" v-for="(item,index) in approveMaterials" :key="index">
                                <span @click="preView(item.materialPath)">{{ item.materialName }}</span>
                            </div>
                        </div>
                    </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="20">
                        <div>
                            <p>招聘说明</p> {{ dataDetail.description }}
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="message" v-if="approveTypeId != 1">
            <div class="blok"></div>
            <span>申请信息</span>
            <div class="segmentation"></div>
        </div>
        <!-- 招聘申请实习 -->
        <div class="examine-message" v-if="approveTypeId == 2">
            <el-row :gutter="20">
                <el-col :span="11">
                    <div>
                        <p>招聘工作组</p>{{ rDetail.recruitWkgName }}
                    </div>
                </el-col>
                <el-col :span="11" :offset="1">
                    <div>
                        <p>招聘数量</p>{{ rDetail.recruitNum }}
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="23">
                    <div>
                        <p>招聘原因</p>{{ rDetail.reason }}
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 招聘申请（正式） -->
        <InviteFormalMsg v-if="approveTypeId == 1" :inviteFormalData="inviteFormalData" />
        <!-- 入职审批（正式岗位） -->
        <EntryMessage v-if="approveTypeId == 3 || approveTypeId == 4" :appTypeId="approveTypeId" :approveDetail="rDetail" />
        <!-- 转正申请 -->
        <StraightForMsg v-if="approveTypeId == 5" :approveDetail="rDetail" :approveMaterials="approveMaterials"/>
        <!-- 实习评价 -->
        <EvaluateMsg v-if="approveTypeId == 6" :approveDetail="rDetail" :approveMaterials="approveMaterials"/>
        <!-- 调动申请 -->
        <MobilizeMsg v-if="approveTypeId == 7" :approveDetail="rDetail" />
        <!-- 调薪审批 -->
        <RaiseSalaryMsg v-if="approveTypeId == 8" :approveDetail="rDetail" :approveMaterials="approveMaterials"/>
        <!-- 晋升申请 -->
        <PromotionApplyMsg v-if="approveTypeId == 9" :approveDetail="rDetail" :approveMaterials="approveMaterials"/>
        <!-- 晋升审批 -->
        <PromotionCarefulMsg v-if="approveTypeId == 10" :approveDetail="rDetail" :approveMaterials="approveMaterials"/>
        <!-- 离职申请 -->
        <DepartApplyMsg v-if="approveTypeId == 11" :approveDetail="rDetail" />
        <!-- 员工辞退申请 -->
        <DismissMsg v-if="approveTypeId == 12" :approveDetail="rDetail" />
        <!-- 合同续签征询 -->
        <RenewalAskMsg v-if="approveTypeId == 13" :approveDetail="rDetail" />
        <!-- 合同续签通知 -->
        <RenewalNoticeMsg v-if="approveTypeId == 14" :approveDetail="rDetail" />
        <!-- 实习生工资审批、劳务用工工资审批 -->
        <FormalWagesMsg v-if="approveTypeId == 15 || approveTypeId == 16" :approveDetail="rDetail" :approveMaterials="approveMaterials"/>
        <!--执证申请（律师实习）、 执证申请（专利代理师实习） -->
        <DocumentPatentMsg v-if="approveTypeId == 17 || approveTypeId == 18" :approveDetail="rDetail" :appTypeId="approveTypeId" />
        <!-- 工作居住证办理申请 -->
        <ResidenceProveMsg v-if="approveTypeId == 19" :approveDetail="rDetail" />
        <!-- 证明类申请 -->
        <ProveApplyMsg v-if="approveTypeId == 20" :approveDetail="rDetail" :approveMaterials="approveMaterials"/>
        <!-- 宿舍住宿申请 -->
        <StayApplyMsg v-if="approveTypeId == 21" :approveDetail="rDetail" />
    </div>
</template>

<script>
import { queryOrganizations, queryPositions } from '@/api/hrmList.js'
import { preView } from "@/utils/index";
import StraightForMsg from './StraightForMsg.vue'
import InviteFormalMsg from './InviteFormalMsg.vue'
import EntryMessage from './EntryMessage.vue'
import EvaluateMsg from './EvaluateMsg.vue'
import MobilizeMsg from './MobilizeMsg.vue'
import RaiseSalaryMsg from './RaiseSalaryMsg.vue'
import PromotionApplyMsg from './PromotionApplyMsg.vue'
import PromotionCarefulMsg from './PromotionCarefulMsg.vue'
import DismissMsg from './DismissMsg.vue'
import DepartApplyMsg from './DepartApplyMsg.vue'
import RenewalAskMsg from './RenewalAskMsg.vue'
import RenewalNoticeMsg from './RenewalNoticeMsg.vue'
import FormalWagesMsg from './FormalWagesMsg.vue'
import DocumentPatentMsg from './DocumentPatentMsg.vue'
import ResidenceProveMsg from './ResidenceProveMsg.vue'
import ProveApplyMsg from './ProveApplyMsg.vue'
import StayApplyMsg from './StayApplyMsg.vue'

export default {
    name: 'InviteMessage',
    props: ['dataDetail', 'approveTypeId'],
    data() {
        return {
            inviteFormalData:[],
            rDetail: {},
            approveMaterials: [],
            resUser: '',
            enrollWkgName: '',
            enrollPosName: '',
            baseicsMsg1: [1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
        }
    },
    components: {
        InviteFormalMsg,
        EntryMessage,
        StraightForMsg,
        EvaluateMsg,
        MobilizeMsg,
        RaiseSalaryMsg,
        PromotionApplyMsg,
        PromotionCarefulMsg,
        DismissMsg,
        DepartApplyMsg,
        RenewalAskMsg,
        RenewalNoticeMsg,
        FormalWagesMsg,
        DocumentPatentMsg,
        ResidenceProveMsg,
        ProveApplyMsg,
        StayApplyMsg,
    },
    methods: {
        preView,
        acquire() {
            if (this.approveTypeId == 1) {
                this.inviteFormalData = this.dataDetail.approveItems || []
            }
            this.approveMaterials = this.dataDetail.approveMaterials || []
            this.rDetail = this.dataDetail.approveItems[0] || {}
            // this.resUser = this.$store.getters.userList.filter(value => value['userId'] === this.dataDetail.appUserId)[0].fullname
        },
        // 获取岗位列表
        queryPositions() {
            queryPositions().then(res => {
                if (this.rDetail.enrollPosId) {
                    this.enrollPosName = res.data.filter(value => value['id'] === this.rDetail.enrollPosId)[0].posName
                }
            })
        },
        // 获取部门列表
        queryOrganizations() {
            queryOrganizations({ status: 1 }).then(res => {
                this.GroupChange(this.rDetail.enrollWkgId, res.data)
            })
        },
        recursive(id, obj) {
            let result = {} // 也可以是全局声明的变量
            obj.find(item => {
                if (item.deptCode == id) {
                    result = item
                }
                if (item.children) {
                    this.GroupChange(id, item.children)
                }
            })
            return result
        },
        GroupChange(e, obj) {
            let result = this.recursive(e, obj)
            let objk = JSON.stringify(result) === '{}'
            if (!objk) {
                this.enrollWkgName = result.kingDeeDepartment
            }
        },
    },
    created() {
        this.acquire()
        if (this.approveTypeId == 3 || this.approveTypeId == 4) {
            this.queryPositions()
            this.queryOrganizations()
        }
    }
}
</script>

<style lang="scss" scoped>
.message {
    height: 30px;
    line-height: 30px;
    position: relative;

    .blok {
        height: 20px;
        width: 6px;
        background-color: blue;
        border-radius: 6px;
        float: left;
        margin: 5px 14px 0 0;
    }

    span {
        font-size: 18px;
        color: #313131;
    }

    .segmentation {
        width: 88%;
        border-top: 1px solid #dcdcdc;
        position: absolute;
        top: 16px;
        right: 0;
    }
}
.fujian{
    margin-top: 0 !important;
}

.Basics-message {
    div {
        margin-top: 6px;
        p {
            float: left;
            width: 100px;
            text-align: right;
            margin-right: 16px;
            color: #c3c3c3;
            clear: both;
        }
    }
}

.examine-message {
    margin-top: 24px;

    div {
        margin-bottom: 14px;

        p {
            float: left;
            width: 100px;
            text-align: right;
            margin-right: 16px;
            color: #c3c3c3;
            clear: both;
        }
    }
}
.fontColor {
    color: #409EFF;
    cursor: pointer;
    margin-top: 0 !important;
}
</style>