<template slot-scope="scope">
    <div>
        <div v-if="this.paramsData.data && this.paramsData.colDef.field == 'operation'" style="display: flex;">
            <el-button
                type="text"
                size="small"
                @click="handleTaskAA()">处理
            </el-button>
            <WorkTimeTips v-if="paramsData.data.agentNum" :paramsData="paramsData" :tipsType="'btn'" @jumpDetails="jumpDetails"></WorkTimeTips>
        </div>
        <div v-if="this.paramsData && this.paramsData.colDef.field != 'operation'"><span>{{ this.paramsData.value ? this.paramsData.value : '' }}</span></div>
    </div>
</template>

<script>
import WorkTimeTips from "./WorkTimeTips.vue";
export default {
    name: "WorkTimeBtn",
    components: {
        WorkTimeTips
    },
    props: { paramsData: {} },
    data() {
        return {
            workHourView: false,
            row: {}
        }
    },
    methods:{
        jumpDetails(data){
             this.$emit('jumpDetails', data)
        },
        handleTaskAA(){
            this.row = this.paramsData.data
            this.$emit('handleTask',this.row)
        }
    }
}
</script>

<style>

</style>