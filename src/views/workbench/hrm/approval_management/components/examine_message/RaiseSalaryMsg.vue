<template>
    <div class="examine-message">
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>生效时间</p>{{ approveDetail.effectiveDate }}
                </div>
            </el-col>
        </el-row>
        <el-row >
            <el-col :span="3">
                <div>
                    <p>调薪人员信息</p>
                </div>
            </el-col>
            <el-col :span="20" :offset="1">
                <el-table :data="approveDetail.salaryChangeList" :border="true" size="mini" style="margin-left: 14px;">
                    <el-table-column prop="talentName" label="调薪人员"></el-table-column>
                    <el-table-column prop="position" label="岗位"></el-table-column>
                    <el-table-column prop="workYears" label="司龄" width="80"></el-table-column>
                    <el-table-column prop="currentSalary" label="目前薪资" width="100"></el-table-column>
                    <el-table-column prop="changedSalary" label="调整后薪资" width="100"></el-table-column>
                    <el-table-column prop="changedReason" label="调整原因" width="180"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'RaiseSalaryMsg',
    props: ['approveDetail'],
    data() {
        return {}
    },
    methods: {}
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