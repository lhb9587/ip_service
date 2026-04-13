<template>
    <div>
      <el-popover width="500" placement="bottom" trigger="click">
        <el-input @change="changeInput" v-show="isEditChange" type="textarea" :rows="5" size="big" :placeholder="changeValue" v-model="changeValue" ></el-input>
        <el-input @change="changeInput"  size="small" slot="reference" v-model="changeValue"></el-input>
        <el-button style="float: right" v-show="isEditChange" size="mini" type="primary" @click="editChangeInput">修改</el-button>
      </el-popover>
    </div>
</template>

<script>
  import { modifyProjectTask, queryProjectTask } from '@/api/caseList'
  export default {
    name: "ChangeInput",
    props: {
      inputData: {}
    },
    data() {
      return {
        inputData1: [],
        isEditChange: true,
        changeValue: ''
      }
    },
    created() {
      this.inputData1 = JSON.parse(JSON.stringify(this.inputData))[0]
      if(JSON.parse(JSON.stringify(this.inputData))[1] == 'prjTaskName'){
        this.changeValue = this.inputData1.prjTaskName
      }
      if(JSON.parse(JSON.stringify(this.inputData))[1] == 'prjTaskDesc'){
        this.changeValue = this.inputData1.prjTaskDesc
      }

    },
    methods: {
      changeInput(v) {
        if(JSON.parse(JSON.stringify(this.inputData))[1] == 'prjTaskName'){
          this.inputData1.prjTaskName = v
        }
        if(JSON.parse(JSON.stringify(this.inputData))[1] == 'prjTaskDesc'){
          this.inputData1.prjTaskDesc = v
        }
      },
      editChangeInput() {
        console.log('+++++++++++++++')
        console.log(this.inputData1)
        console.log('+++++++++++++++')
        this.modifyProjectTask(this.inputData1)
      },
      modifyProjectTask(data) {
        this.$emit('hiddenInput', data)
      },
    }
  }
</script>

<style scoped>

</style>
