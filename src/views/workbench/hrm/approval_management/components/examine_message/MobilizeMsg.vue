<template>
    <div class="examine-message">
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>入职时间</p>{{ approveDetail.startDate }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>司龄</p>{{ convertDecimalToYearsMonths(approveDetail.workingYears) }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>最高学历毕业院校</p>{{ approveDetail.promoteList[0].collegeName }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>学历</p>{{ approveDetail.promoteList[0].eduDegree }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>专业</p>{{ approveDetail.promoteList[0].major }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>调动原因</p>{{ approveDetail.reason }}
                </div>
            </el-col>
        </el-row>
        <div class="message">
            <div class="blok"></div>
            <span>调动信息（变动前）</span>
            <div class="segmentation"></div>
        </div>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>部门</p>{{ approveDetail.promoteList[0].deptBefore }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>岗位</p>{{ approveDetail.promoteList[0].posBefore }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="11">
                <div>
                    <p>工作组</p>{{ approveDetail.promoteList[0].wkgBefore }}
                </div>
            </el-col>
            <el-col :span="11" :offset="1">
                <div>
                    <p>月薪</p>{{ approveDetail.promoteList[0].salaryBefore }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>费率</p>{{ approveDetail.promoteList[0].rateBefore }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>工作地</p>{{ approveDetail.promoteList[0].addrBefore }}
                </div>
            </el-col>
        </el-row>
        <div class="message">
            <div class="blok"></div>
            <span>调动信息（变动后）</span>
            <div class="segmentation"></div>
        </div>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>部门</p>{{ approveDetail.promoteList[0].deptAfter }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>招聘岗位</p>{{ approveDetail.promoteList[0].posAfter }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="11">
                <div>
                    <p>工作组</p>{{ approveDetail.promoteList[0].wkgAfter }}
                </div>
            </el-col>
            <el-col :span="11" :offset="1">
                <div>
                    <p>月薪</p>{{ approveDetail.promoteList[0].salaryAfter }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>费率</p>{{ approveDetail.promoteList[0].rateAfter }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>工作地</p>{{ approveDetail.promoteList[0].addrAfter }}
                </div>
            </el-col>
        </el-row>
        <div class="message">
            <div class="blok"></div>
            <span>确认选项</span>
            <div class="comSegmentation"></div>
        </div>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>薪资是否上调</p>{{ approveDetail.salaryIncr ==1 ? '是' : '否' }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>调动生效时间</p>{{ approveDetail.effectiveDate }}
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { convertDecimalToYearsMonths } from '@/utils/index.js';
export default {
    name: 'EvaluateMsg',
    props: ['approveDetail'],
    methods:{
        convertDecimalToYearsMonths
    }
}
</script>

<style lang='scss' scoped>
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
        width: 78%;
        border-top: 1px solid #dcdcdc;
        position: absolute;
        top: 16px;
        right: 0;
    }
    .comSegmentation {
        width: 88%;
        border-top: 1px solid #dcdcdc;
        position: absolute;
        top: 16px;
        right: 0;
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
</style>