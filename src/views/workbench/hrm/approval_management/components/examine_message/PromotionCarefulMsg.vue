<template>
    <div class="examine-message">
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>姓名</p>{{ approveDetail.promoteList[0].talentName }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>申请晋升岗位</p>{{ approveDetail.promoteList[0].promotePos }}
                </div>
            </el-col>

        </el-row>
        <el-row :gutter="10">
            <el-col :span="12">
                <div>
                    <p>考核期</p>          
                    <span v-if="approveDetail.promoteList[0].startDate && approveDetail.promoteList[0].endDate">{{
                        approveDetail.promoteList[0].startDate + '-' + approveDetail.promoteList[0].endDate
                    }}</span>
                </div>
            </el-col>
            <el-col :span="11">
                <div>
                    <p>司龄</p>{{ convertDecimalToYearsMonths(approveDetail.workingYears) }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>目前薪资</p>{{ approveDetail.promoteList[0].currentSalary }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>转正薪资</p>{{ approveDetail.promoteList[0].changedSalary }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>生效时间</p>{{ approveDetail.promoteList[0].effectiveDate }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div style="display: flex;">
                    <p>附件</p>
                    <div>
                        <div class="fontColor" v-for="(item,index) in approveMaterials" :key="index">
                            <span @click="preView(item.materialPath)">{{ item.materialName }}</span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { convertDecimalToYearsMonths } from '@/utils/index.js';
import { preView } from "@/utils/index";
export default {
    name: 'PromotionCarefulMsg',
    props: ['approveDetail','approveMaterials'],
    methods:{
        preView,
    },
    methods:{
        convertDecimalToYearsMonths
    }
}
</script>

<style lang='scss' scoped>
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
}
</style>