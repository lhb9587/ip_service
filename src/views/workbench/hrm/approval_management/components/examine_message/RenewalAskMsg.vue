<template>
    <div class="examine-message">
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p style="width: 120px;">合同到期员工姓名</p>{{ approveDetail.enrollName }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>入职时间</p>{{ approveDetail.startDate }}
                </div>
            </el-col>

        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p style="width: 120px;">服务年限</p>{{ approveDetail.contractLimit }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>合同到期时间</p>{{ approveDetail.endDate }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p style="width: 120px;">建议续签年限</p>{{ approveDetail.renewLimitYear }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>说明</p>{{ approveDetail.description }}
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'RenewalAskMsg',
    props: ['approveDetail'],
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