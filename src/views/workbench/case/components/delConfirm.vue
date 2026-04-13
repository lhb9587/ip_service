<template>
  <div>
    <el-button style="color: #FB9608;font-weight: 700" type="text"
               v-show="isModify" size="small"
               @click="editFile">编辑
    </el-button>
    <div v-if="ctx.materialList&&ctx.materialList.length&&ctx.materialList.find(i=>i.mailId)"
         style="display: inline-block">
      <el-popover
        trigger="click"
        ref="changePopover"
        placement="top"
        width="360"
      >
        <div style="text-align: right; margin: 0">

          <el-form label-width="100px">
            <el-form-item label="原名称:">
              <div style="text-align: left">{{ctx.eventName}}</div>
            </el-form-item>
            <el-form-item label="修改名称:">
              <el-input size="mini" type="text" placeholder="请输入要修改的名称" v-model="mdocName"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" size="mini" @click="changeName">确定</el-button>
        </div>
        <el-button size="small" style="color: #FB9608;font-weight: 700" type="text" slot="reference">重命名</el-button>
      </el-popover>
    </div>
    <div v-if="idDelete" style="display: inline-block">
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
        <el-button size="small" style="color: #FB9608;font-weight: 700" type="text" slot="reference">删除</el-button>
      </el-popover>
    </div>
    <el-button style="color: #FB9608;font-weight: 700" type="text" v-show="permissionList.includes(371)" size="small"
               @click="createArchive">新建原件
    </el-button>
    <div
      v-if="(ctx.typeName == '裁定-赢' || ctx.typeName == '裁定-部分' || ctx.typeName == '裁定-输') && caseTypeId == 32 && ctx.materialList && ctx.materialList.length"
      style="display: inline-block">
      <el-button @click="translateFile" style="color: #FB9608;font-weight: 700" type="text" size="small">
        转机翻英文
      </el-button>
    </div>
    <div
      v-if="ctx.materialList && ctx.materialList.length && ctx.materialList.find(item => item.materialTypeId === 301509 || item.materialTypeId === 301684)"
      style="display: inline-block">
      <el-button @click="mergeFile" style="color: #FB9608;font-weight: 700" type="text" size="small">
        合成副本
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'delConfirm',
    props: {
      caseTypeId: {},
      items: {},
      ctx: {},
      permissionList: {},
      name: {},
      delItem: {},
      editItem: {},
      createArchiveItem: {},
      changeItem: {},
      translateItem: {},
      mergeFile: {}
    },
    data() {
      return {
        mdocName: '',
        item: {}
      }
    },
    computed: {
      isModify() {
        if (this.ctx.modify || this.ctx.modify === 0) {
          return this.ctx.modify
        } else {
          return this.ctx.eventRecordId || this.ctx.insId && this.getEditPermission(this.item.docTypeName, this.ctx.creater)
        }
      },
      idDelete() {
        if (this.ctx.modify || this.ctx.modify === 0) {
          return this.ctx.modify
        } else {
          return this.getPermission(this.item.docTypeName, this.ctx.creater)
        }
      },
    },
    created() {
      this.item = JSON.parse(JSON.stringify(this.items))
    },
    methods: {
      translateFile() {
        this.translateItem()
      },
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
      createArchive() {
        this.createArchiveItem()
      },
      deleteRow() {
        this.delItem()
        this.closePop()
      },
      closePop() {
        this.$refs.dcPopover.doClose()
      },
      getEditPermission(type, creater) {
        if (type == '官方通知') {
          if (this.permissionList.includes(195) || creater == this.name) {
            return true
          } else {
            return false
          }
        } else {
          if (this.permissionList.includes(241) || creater == this.name) {
            return true
          } else {
            return false
          }
        }
      },
      getPermission(type, creater) {
        if (type == '官方通知') {
          if (this.permissionList.includes(241)) {
            return true
          } else {
            return false
          }
        } else {
          if (this.permissionList.includes(241) || creater == this.name) {
            return true
          } else {
            return false
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
