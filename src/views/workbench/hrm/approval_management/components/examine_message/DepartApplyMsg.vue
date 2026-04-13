<template>
    <div class="examine-message">
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>离职原因</p>{{ approveDetail.reason }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>计划离职日期</p>{{ approveDetail.leaveDate }}
                </div>
            </el-col>

        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <div>
                    <p>特殊说明</p>{{ approveDetail.description }}
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'DepartApplyMsg',
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