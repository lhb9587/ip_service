<template>
  <div>
    <el-button style="color: #FB9608;font-weight: 700;height: 25px;" type="text"
               v-show="getEditPermission(item.docTypeName ,ctx.creater)" size="mini"
               @click="editFile">编辑
    </el-button>
    <div v-if="getDelPermission(item.docTypeName ,ctx.creater)" style="display: inline-block">
      <el-popover
        trigger="click"
        ref="dcPopover"
        placement="top"
        width="160"
      >
        <p>确定要删除吗？</p>
        <div style="text-align: right; margin: 0">

          <!--          <el-button type="primary" size="mini" @click="$emit('deleteRow', ctx)">确定</el-button>-->
          <el-button type="primary" size="mini" @click="deleteRow">确定</el-button>
        </div>
        <el-button size="mini" style="color: #FB9608;font-weight: 700;height: 25px;" type="text" slot="reference">删除</el-button>
      </el-popover>
    </div>


  </div>
</template>

<script>
  export default {
    name: 'delConfirm',
    props: {
      items: {},
      ctx: {},
      permissionList: {},
      name: '',
      delItem: {},
      editItem: {},
      changeItem: {}
    },
    data() {
      return {
        mdocName: '',
        item: {}
      }
    },
    created() {
      // this.item = JSON.parse(JSON.stringify(this.items))
    },
    methods: {
      changeName() {
        this.mdocName = this.mdocName && this.mdocName.replace(/^[' ']+ | [' ']+$/g, '') || ''
        if (!this.mdocName) {
          this.$message.error('请输入修改事件名称')
          return
        }
        this.changeItem(this.ctx.materialList.map(i => i.mailId)[0], this.mdocName)
        this.$refs.changePopover.doClose()
        this.mdocName = ''
      },
      editFile() {
        this.editItem()
      },
      deleteRow() {
        this.delItem()
        this.closePop()
      },
      closePop() {
        this.$refs.dcPopover.doClose()
      },
      getEditPermission(type, creater) {
        if (this.permissionList.includes(58) || creater == this.name) { // 359
          return true
        }
        return false
      },
      getDelPermission(type, creater) {
        if (this.permissionList.includes(58) || creater == this.name) {
          return true
        }
        return false
      }
    }
  }
</script>

<style scoped>

</style>
