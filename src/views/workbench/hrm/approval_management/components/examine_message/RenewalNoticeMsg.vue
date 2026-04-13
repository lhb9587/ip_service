<template>
    <div class="examine-message">
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p style="width: 120px;">合同续签员工姓名</p>{{ approveDetail.enrollName }}
                </div>
            </el-col>
            <el-col :span="12" :offset="2">
                <div>
                    <p>服务期</p>
                    <span v-if="approveDetail.startDate && approveDetail.endDate">
                        {{ approveDetail.startDate + ' - ' + approveDetail.endDate }}
                    </span>
                </div>
            </el-col>

        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p style="width: 120px;">续签答复日期</p>{{ approveDetail.renewReplyDate }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>续签提交日期</p>{{ approveDetail.renewSubmitDate }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p style="width: 120px;">合同最长期限</p>{{ approveDetail.renewLimitYear }}
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'RenewalNoticeMsg',
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