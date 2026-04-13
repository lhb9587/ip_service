<template>
    <div class="examine-message">
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>姓名</p>{{ approveDetail.enrollName }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>岗位</p>{{ approveDetail.enrollPosName }}
                </div>
            </el-col>

        </el-row>
        <el-row :gutter="20">
            <el-col :span="11">
                <div>
                    <p>工作组</p>{{ approveDetail.enrollWkgName }}
                </div>
            </el-col>
            <el-col :span="11" :offset="1">
                <div>
                    <p>司龄</p>{{ convertDecimalToYearsMonths(approveDetail.workingYears) }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <div>
                    <p>申请原因</p>{{ approveDetail.reason }}
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { convertDecimalToYearsMonths } from '@/utils/index.js';
export default {
    name: 'ResidenceProveMsg',
    props: ['approveDetail'],
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
</style>