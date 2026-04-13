<template>
    <div class="examine-message">
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>申请原因</p>{{ approveDetail.reason }}
                </div>
            </el-col>
            <el-col :span="12" :offset="2">
                <div>
                    <p>住宿起止日期</p><span v-if="approveDetail.startDate && approveDetail.endDate">{{ approveDetail.startDate + ' 至 ' + approveDetail.endDate}}</span>
                </div>
            </el-col>

        </el-row>
        <!-- <el-row :gutter="20">
            <el-col :span="24">
                <div>
                    <p>说明</p>行政部接到申请后，根据宿舍空余情况安排房间及床位，并反馈住宿安排计划。如出现无法安排住
                    宿情形，行政部与人力资源部按照住宿员工部门比例或住宿原因协调解决；经协调确实无法解决，则与需 求部门负责人协商员工到京行程或更改住宿方式。
                </div>
            </el-col>
        </el-row> -->
    </div>
</template>

<script>
export default {
    name: 'StayApplyMsg',
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