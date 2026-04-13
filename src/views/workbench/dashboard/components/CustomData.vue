<template>
  <el-dialog
    :title="'自定义'+name"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <div style="display: flex">
      <el-card class="box-card" style="width: 45%">
        <div slot="header" class="clearfix">
          <span>{{name}}列表</span>
          <el-button @click="createCustom" style="float: right; padding: 3px 0" type="text">添加</el-button>
        </div>
        <el-table
          ref="singleTable"
          :data="dataList"
          :max-height="500"
          :row-style="rowClass"
          border
          @cell-mouse-leave="mouseEvent">
          <el-table-column
            prop="customName"
            label="名称">
            <template slot-scope="scope">
              <!--isClick就是标识状态，状态处于编辑时候，显示输入框，状态属于呈现状态就显示文本内容-->
              <el-input v-if="scope.row.isClick" :placeholder="'请输入'+name+'名称'" v-model="scope.row.customName"></el-input>
              <span @dblclick="clickCell(scope.row)" v-else>{{scope.row.customName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button @click="settingCustom(scope.$index)" type="text" size="small">设置{{name}}</el-button>
              <el-button @click="detectCustom(scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <img v-if="selectRow !== undefined" class="img-right" :src="require('@/assets/card_icon/right.png')">
      <div style="width: 50%">
        <el-multi-cascader
          ref="multiCascader"
          class="caseTypeIds"
          v-if="selectRow !== undefined"
          :show-all-levels="false"
          :options="data"
          multiple
          filterable
          clearable
          :props="props"
          selectChildren
          only-out-put-leaf-node
          change-on-select
          v-model="value"
          style="width: 80%"></el-multi-cascader>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="saveCustom">保 存</el-button>
  </span>
  </el-dialog>
</template>

<script>
import { queryCustomList, createAndModify } from '@/api/dashboard.js'
import { queryCaseType, queryDeptGroup } from '@/api/caseList.js'
import { queryFeeTypeList } from "@/api/feeList";
import { getTwoDimensionalArray } from "@/utils/index.js";
export default {
  props: ['customType','panelId'],
  name: 'CustomData',
  data() {
    return {
      name: '',
      customName:{1:'案件类型',2:'工作组',4:'费用类型'},
      dialogVisible: true,
      selectRow: undefined,
      value: [], // 默认初始化值
      data:[],
      backupData: [], // 配置列表备份
      dataList: [],
      props: {},
      selectData: [] // 已选类型
    };
  },
  created() {
    this.name = this.customName[this.customType]
    this.initData()
    this.queryCustomList()
  },
  methods: {
    // 获取初始化数据
    initData() {
      switch (this.customType) {
        case 1:
          this.props = {
            children: "childrens",
            label: "caseType",
            value: "caseTypeId"
          }
          if (this.$store.getters.caseTypeList){
            this.data = this.$store.getters.caseTypeList
            this.backupData = JSON.parse(JSON.stringify(this.data))
          }else{
            queryCaseType().then(res=>{
              this.data = res.data
              this.backupData = JSON.parse(JSON.stringify(this.data))
            })
          }
          break
        case 2:
          this.props = {
            children: "children",
            label: "label",
            value: "value"
          }
          queryDeptGroup().then(res=>{
            this.data = res.data
            this.backupData = JSON.parse(JSON.stringify(this.data))
          })
          break
        case 4:
          this.props = {
            children: "feeTypes",
            label: "feeName",
            value: "feetId"
          }
          queryFeeTypeList().then(res=>{
            this.data = res.data
            this.backupData = JSON.parse(JSON.stringify(this.data))
          })
          break
      }
    },
    // 查询自定义项
    queryCustomList() {
      queryCustomList({ panelId: this.panelId }).then(res => {
        res.data.forEach(item => {
          this.dataList.push({
            customId: item.customId,
            customName: item.customName,
            typeIds: item.typeIds,
            isClick: false
          })
          // this.selectData = this.selectData.concat(item.ids.split(","))
        })
      })
    },
    // 循环禁用已选项
    disableOptions(data) {
      data && data.forEach(item => {
        if (this.selectData.findIndex(res => res == item[this.props.value]) !==-1) {
          item.disabled = true;
        }
        if (item[this.props.children]) {
          this.disableOptions(item[this.props.children]);
        }
      })
    },
    // 自定义项创建
    createCustom() {
      var data = {
        customId: null,
        customName: '',
        typeIds: [],
        isClick: true
      }
      this.dataList.push(data)
    },
    // 自定义项设置
    settingCustom(index) {
      // 根据最后一级,获取级联关系,目前测试案件类型/费用类型支持
      // this.array = getTwoDimensionalArray(
      //   this.data,
      //   "caseTypeId",
      //   [130,131,132,156,32]
      // );
      this.selectRow = index
      this.value = this.dataList[index].typeIds
    },
    // 自定义项删除
    detectCustom(index) {
      this.dataList.splice(index, 1)
    },
    // 自定义项选中判断，重新赋值
    customReassign() {
      this.selectData = []
      this.data = JSON.parse(JSON.stringify(this.backupData))
      this.dataList.forEach((item,index) => {
        // 判断，当前设置的不禁用，只禁用其他设置选中
        if (index != this.selectRow){
          item.typeIds.forEach(res => {
            this.selectData.push(res[res.length - 1])
          })
        }
      })
      this.value.forEach((item,index) => {
        if (this.selectData.findIndex(res => res == item[item.length - 1]) !==-1){
          this.value.splice(index,1)
        }
      })
      this.selectData && this.disableOptions(this.data)
    },
    // 自定义数据保存
    saveCustom() {
      var inspect = true
      this.dataList.forEach(item=>{
        if (item.typeIds.length == undefined || item.typeIds.length <= 0){
          var error = item.customName ? '请为<'+item.customName+'>设置'+this.name : '请填写自定义'+this.name+'名称'
          this.$message.error(error)
          inspect = false
        }
      })
      inspect && createAndModify({ panelId: this.panelId, customType: this.customType, customTypes: this.dataList }).then(res => {
        if (res.success){
          this.$message.success('保存成功')
          this.$emit('customDataClose',1)
        }
      })
    },
    rowClass({row,rowIndex}){
      if (this.selectRow == rowIndex){
        return {"background-color":"rgba(185,221,249,0.75)"}
      }
    },
    // 双击
    clickCell(row) {
      row.isClick = true
    },
    // 鼠标移入移出
    mouseEvent(row){
      if (row.customName){
        row.isClick = false
      }
    },
    handleClose() {
      this.$emit('customDataClose',0)
    },
  },
  watch:{
    value(){
      this.dataList[this.selectRow].typeIds = this.value
      this.customReassign()
    }
  }
}
</script>

<style scoped>
.box-card /deep/ .el-card__header{
  background: #f5f7fa;
  padding: 10px 20px;
  font-size: 16px;
}
.el-table th > .cell {
  text-align: center;
}
.img-right{
  height: 40px;
  margin: auto;
}
</style>
