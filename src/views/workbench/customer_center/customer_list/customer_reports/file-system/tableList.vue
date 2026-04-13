<template>
  <div>
    <el-table
      :height="350"
      @selection-change="handleSelectionChange"
      row-class-name="tableRowClassName"
      border
      @row-contextmenu="rowContextmenu"
      size="small"
      class="table-box"
      :data="fileList"
      @cell-mouse-enter="cellMouseEnter"
      @row-dblclick="doubleClick"
      @header-dragend="(newWidth, oldWidth, column, event) => {headerDrage(newWidth, oldWidth, column, event, 'fileList')}"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="" width="60px">
        <template slot-scope="scope">
          <img
            :src="setFileImg(scope.row)"
            style="width: 30px; max-height: 30px; cursor: pointer"
          />
        </template>
      </el-table-column>
      <el-table-column property="materialName" label="文件名称"
                       :width="fileTableHeader.materialName || 'auto'">
        <template slot-scope="scope">
          <span :title="scope.row.materialName">{{scope.row.materialName}}</span>
        </template>
      </el-table-column>
      <el-table-column property="size" label="大小"
                       :width="fileTableHeader.size || 'auto'">
        <template slot-scope="scope">
          <span :title="scope.row.size" v-if="scope.row.size">{{(scope.row.size / (1024 * 1024)).toFixed(2)}} MB</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column property="creater" label="上传人" :width="fileTableHeader.creater || 'auto'"></el-table-column>
      <el-table-column property="createDate" label="上传时间"
                       :width="fileTableHeader.createDate || 'auto'">
        <template slot-scope="scope">
          <span :title="timestampToTime(scope.row.createDate)">{{timestampToTime(scope.row.createDate)}}</span>
        </template>
      </el-table-column>
      <el-table-column property="modifier" label="修改人" :width="fileTableHeader.modifier || 'auto'"></el-table-column>
      <el-table-column property="modifyDate" label="修改时间"
                       :width="fileTableHeader.modifyDate || 'auto'">
        <template slot-scope="scope">
          <span :title="timestampToTime(scope.row.modifyDate)">{{timestampToTime(scope.row.modifyDate)}}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--  外代所信息  -->
    <el-dialog
      title="外代所概况"
      :append-to-body="true"
      :visible.sync="WDSView"
      :close-on-click-modal="false"
      width="80%"
      class="abow_dialog"
    >
      <abroad-agency v-if="WDSView" :isMaterial="true" :custId="curCustId"></abroad-agency>
      <span slot="footer" class="fl-ac-jc">
        <el-button size="mini" @click="WDSView = false">取 消</el-button>
      </span>
    </el-dialog>

    <!--  文件夹授权  -->
    <el-dialog
      title="文件授权"
      :append-to-body="true"
      :visible.sync="allocationView"
      :close-on-click-modal="false"
      width="70%"
      class="abow_dialog"
    >
      <div>
        <div class="file-permisson">
          <el-button style="float: right" size="mini" type="primary" @click="addUser">添加</el-button>
          <el-table class="permissonUserList" border size="mini" :data="permissonUserList" fit empty-text="暂无数据"
                    highlight-current-row
                    current-row-key style="width: 100%;">
            <!--            <el-table-column-->
            <!--              type="selection"-->
            <!--              width="40"-->
            <!--              class="selection"-->
            <!--            >-->
            <!--            </el-table-column>-->
            <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
            <el-table-column label="员工" align="left">
              <template slot-scope="scope">
                <span>{{scope.row.userFullName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="权限" align="left">
              <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.permTypeList">
                  <el-checkbox :label="1">查看</el-checkbox>
                  <el-checkbox :label="2">修改</el-checkbox>
                  <el-checkbox :label="3">删除</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="left">
              <template slot-scope="scope">
                <span class="pointer" @click="delUser(scope.$index)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="fl-ac-jc">
        <el-button size="mini" type="primary" @click="updateAllocation">确 定</el-button>
        <el-button size="mini" @click="allocationView = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加员工权限"
      :append-to-body="true"
      :visible.sync="addUserView"
      :close-on-click-modal="false"
      width="40%"
    >
      <div>
        <el-form label-width="150px">
          <el-row>
            <el-form label-width="150px">
              <el-row>
                <el-form-item label="部门/工作组/员工:">
                  <el-multi-cascader
                    style="width: 100%;"
                    ref="multiCascader"
                    :show-all-levels="false"
                    :options="workGroupList"
                    multiple
                    filterable
                    clearable
                    :props="defaultProps"
                    @change="changeSelect"
                    change-on-select
                    selectChildren
                    v-model="permissonUserArray"></el-multi-cascader>
                </el-form-item>
              </el-row>
            </el-form>
          </el-row>
          <el-row>
            <el-form label-width="150px">
              <el-row>
                <el-form-item label="权限:">
                  <el-checkbox-group v-model="permissonArray" @change="changePermissonArray">
                    <el-checkbox :label="1">查看</el-checkbox>
                    <el-checkbox :label="2">修改</el-checkbox>
                    <el-checkbox :label="3">删除</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-row>
            </el-form>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="fl-ac-jc">
        <el-button size="mini" type="primary" @click="handleUser">确 定</el-button>
        <el-button size="mini" @click="closeUserDialog">取 消</el-button>
      </span>
    </el-dialog>

    <!--  文件夹重命名  -->
    <el-dialog
      title="重命名"
      :append-to-body="true"
      :visible.sync="changeDirNameView"
      :close-on-click-modal="false"
      width="40%"
      :before-close="() => closeChangeDirNameDialog(false)"
    >
      <div>
        <el-form label-width="150px">
          <el-row>
            <el-form-item label="名称">
              <el-input placeholder="请输入文件夹名称" size="small" v-model="changeDirNameData.sortName"></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="fl-ac-jc">
        <el-button size="mini" type="primary" @click="changeDirNameClick">确 定</el-button>
        <el-button size="mini" @click="closeChangeDirNameDialog(false)">取 消</el-button>
      </span>
    </el-dialog>

    <!--  文件、文件夹移动  -->
    <!--  文件夹重命名  -->
    <el-dialog
      :title="moveFileView ? '文件移动' : '文件复制'"
      class="moveFile"
      :append-to-body="true"
      :visible.sync="moveOrCopy"
      :close-on-click-modal="false"
      width="40%"
      :before-close="() => closeMoveFileDialog(false)"
    >
      <div style="display: flex;margin-bottom: 10px">
        <span style="flex-shrink: 0;margin-right: 5px">目标路径:</span>
        <div style="color: #97a8be">
          <span>~</span>
          <span v-for="item in pathList" :key="item.sortId">{{ '/' + item.sortName }}</span></div>
      </div>
      <el-tree
        v-if="moveOrCopy"
        :style="{height: this.maxHeight - 200 + 'px', overflow: 'auto'}"
        :props="props"
        @node-click="nodeClick"
        :load="loadNode"
        lazy
        highlight-current
        :show-checkbox="false">
      </el-tree>
      <span slot="footer" class="fl-ac-jc">
        <el-button size="mini" v-if="moveFileView" type="primary" @click="moveFileClick">确 定</el-button>
        <el-button size="mini" v-if="copyView" type="primary" @click="copyFileClick">确 定</el-button>
        <el-button size="mini" @click="closeMoveFileDialog(false)">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Sortable from "sortablejs";
  import {fileImgMap, unknownImg} from './map'
  import {doEditInOffice, getProgID} from '@/utils/editInOffice'
  import AbroadAgency from '@/components/AbroadAgency'
  import {recordOnlienEdit} from '@/api/caseList'
  import {queryDeptGroupAndUser, queryWorkGroup} from "@/api/systemList";
  import {
    copyCustMaterialAndDir,
    copyNwMaterialAndDir, modifyCustDir,
    modifyDir,
    modifyNwMaterial, moveCustMaterialAndDir, moveNwMaterialAndDir, queryCustMaterial,
    queryNwMaterial,
    querySortPermission,
    updateSortPermission
  } from '@/api/material'

  export default {
    name: 'tableList',
    components: {AbroadAgency},
    props: ['fileList', 'custId'],
    computed: {
      maxHeight() {
        return document.documentElement.clientHeight - 250
      },
      moveOrCopy() {
        return this.moveFileView || this.copyView
      }
    },
    data() {
      return {
        addUserPermissionArray: [],
        permissonUserArray: [],
        permissonArray: [],
        addUserView: false,
        permissonUserList: [],
        enterRow: {},
        currentNode: {},
        pathArr: [],
        pathList: [],
        props: {
          label: 'sortName',
          children: 'children',
          isLeaf: 'leaf'
        },
        moveFileView: false,
        copyView: false,
        moveFileData: {},
        changeDirNameView: false,
        changeDirNameData: {},
        defaultProps: {
          value: 'value',
          label: 'label',
          children: 'children',
          checkStrictly: false
        },
        filterGroup: [],
        workGroupList: [],
        permissionForm: {
          sortId: '',
          wkgStr: [],
          fpWkgArray: [],
          cascaderList: []
        },
        allocationView: false,
        WDSView: false,
        curCustId: '',
        fileTableHeader: {}
      }
    },
    created() {
      if (localStorage.getItem('fileTableHeader')) {
        this.fileTableHeader = JSON.parse(localStorage.getItem('fileTableHeader'))
      }
      this.$nextTick(() => {
        const that = this
        const tbody = document.querySelector('.el-table__body-wrapper tbody');
        Sortable.create(tbody, {
          sort: false,
          disabled: false,
          forceFallback: true,
          filter: '.el-checkbox__inner',
          animation: 0,
          delay: 500,
          onEnd({newIndex, oldIndex}) {
            if (that.enterRow.isDir) { // enterRow 目标文件夹 that.fileList[newIndex]当前拖动的文件\文件夹
              if (that.enterRow.materialId != that.fileList[newIndex].materialId) {
                that.$confirm(`确认将文件${that.fileList[newIndex].isDir ? '夹' : ''}移动至 ${that.enterRow.materialName} ?`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  if (that.fileList[newIndex].isDir) { // 拖动文件夹
                    modifyDir({
                      sortId: that.fileList[newIndex].sortId,
                      parentId: that.enterRow.sortId
                    }).then(res => {
                      that.$message.success('文件夹移动成功！')
                      that.closeMoveFileDialog(true)
                    })
                  } else { // 拖动文件
                    that.fileList[newIndex].sortId = that.enterRow.sortId
                    modifyNwMaterial(that.fileList[newIndex]).then(res => {
                      that.$message.success('文件移动成功！')
                      that.closeMoveFileDialog(true)
                    })
                  }
                }).catch(() => {

                })
              }
            }
          }
        })
      })
    },
    mounted() {
      this.$emit('changeSortId', 0)
    },
    watch: {},
    methods: {
      timestampToTime(timestamp) {
        var date = new Date(timestamp);
        return date.toLocaleString();
      },
      changePermissonArray(list) {
        if (list && list.length) {
          if ((list.includes(2) || list.includes(3)) && !list.includes(1)) {
            this.permissonArray.push(1)
          }
        }
      },
      closeUserDialog() {
        this.addUserView = false
        this.permissonUserArray = []
        this.permissonArray = []
        this.addUserPermissionArray = []
      },
      handleUser() {
        if (!this.permissonUserArray.length) {
          this.$message.error('请选择员工！')
          return
        }
        if (!this.permissonArray.length) {
          this.$message.error('请选择权限！')
          return
        }

        this.addUserPermissionArray = this.permissonUserArray.filter(item => item.length === 4).map(item => item[item.length - 1]).map(item => ({
          nwuserId: item,
          permTypeList: this.permissonArray
        }))
        // permissonUserList
        this.addUserPermissionArray.forEach(item => {
          if (this.permissonUserList.find(j => j.nwuserId == item.nwuserId)) {
            item.permTypeList = [...new Set([...item.permTypeList, ...this.permissonUserList.find(j => j.nwuserId === item.nwuserId).permTypeList])]
            this.permissonUserList.find(j => j.nwuserId === item.nwuserId).permTypeList = [...new Set([...item.permTypeList, ...this.permissonUserList.find(j => j.nwuserId === item.nwuserId).permTypeList])]
          } else {
            item.userFullName = this.$store.getters.userList.find(k => k.userId === item.nwuserId) && this.$store.getters.userList.find(k => k.userId === item.nwuserId).fullname
            this.permissonUserList.push(item)
          }
        })
        // permissonUserList
        this.$nextTick(() => {
          this.$commonUtils.scrollToBottom(document.querySelector('.file-permisson').querySelector('.el-table__body-wrapper'))
        })
        this.closeUserDialog()

      },
      addUser() {
        this.addUserView = true
      },
      delUser(index) {
        this.permissonUserList.splice(index, 1)
      },
      nodeClick(node) {
        this.currentNode = node
        this.moveFileData.parentId = node.sortId
        this.makePathList()
      },
      makePathList() {
        if (JSON.parse(JSON.stringify(this.pathArr)).find(item => item.sortId === this.currentNode.sortId)) {
          this.$set(this, 'pathList', JSON.parse(JSON.stringify(this.pathArr)).find(item => item.sortId === this.currentNode.sortId).pathList)
        } else {
          this.$set(this, 'pathList', [])
        }
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{sortName: '~', sortId: 0}]);
        }
        queryCustMaterial({sortId: node.data.sortId, pageSize: 9999, custId: this.custId}).then(res => {
          this.pathArr.push({
            sortId: node.data.sortId,
            pathList: res.data.pathList
          })
          this.pathArr = this.$commonUtils.unique(this.pathArr, 'sortId')
          this.makePathList()
          resolve(res.data.data.filter(item => item.isDir).map(item => ({
            pathList: res.data.pathList || [],
            sortId: item.sortId,
            sortName: item.materialName,
            leaf: false
          })))
        }).catch(err => {
          resolve([]);
        })
      },
      copyFileClick() {
        if (!this.moveFileData.parentId && this.moveFileData.parentId !== 0) {
          this.$message.error('请先选择文件夹再进行文件复制！')
          return
        }
        const path = JSON.parse(JSON.stringify(this.currentNode.pathList || []))
        path.push(this.currentNode)
        if (path.find(item => this.moveFileData.materialList.filter(f => !f.materialId).find(i => i.sortId == item.sortId))) {
          this.$message.error('不能将文件复制到自身或其子目录下')
          return;
        }
        copyCustMaterialAndDir({
          materialList: this.moveFileData.materialList,
          parentSortId: this.moveFileData.parentId
        }).then(res => {
          this.$message.success('文件复制成功！')
          this.closeMoveFileDialog(true)
        })
      },
      moveFileClick() {
        if (!this.moveFileData.parentId && this.moveFileData.parentId !== 0) {
          this.$message.error('请先选择文件夹再进行文件移动！')
          return
        }
        const path = JSON.parse(JSON.stringify(this.currentNode.pathList || []))
        path.push(this.currentNode)
        if (path.find(item => this.moveFileData.materialList.filter(f => !f.materialId).find(i => i.sortId == item.sortId))) {
          this.$message.error('不能将文件移动到自身或其子目录下')
          return
        }
        moveCustMaterialAndDir({
          materialList: this.moveFileData.materialList,
          parentSortId: this.moveFileData.parentId
        }).then(res => {
          this.$message.success('文件移动成功！')
          this.closeMoveFileDialog(true)
        })
        // if (this.moveFileData.isDir) { // 文件夹移动
        //   modifyDir({
        //     sortId: this.moveFileData.sortId,
        //     parentId: this.moveFileData.parentId
        //   }).then(res => {
        //     this.$message.success('文件夹移动成功！')
        //     this.closeMoveFileDialog(true)
        //   })
        // } else { // 文件移动
        //   this.moveFileData.sortId = this.moveFileData.parentId
        //   delete this.moveFileData.parentId
        //   modifyNwMaterial(this.moveFileData).then(res => {
        //     this.$message.success('文件移动成功！')
        //     this.closeMoveFileDialog(true)
        //   })
        // }
      },
      closeMoveFileDialog(isSearch) {
        this.moveFileView = false
        this.copyView = false
        this.moveFileData = {}
        this.currentNode = {}
        this.pathArr = []
        this.pathList = []
        isSearch === true && this.$emit('updatePermission')
      },
      changeDirNameClick() {
        modifyCustDir({
          sortId: this.changeDirNameData.sortId,
          sortName: this.changeDirNameData.sortName
        }).then(res => {
          this.$message.success('重命名成功!')
          this.closeChangeDirNameDialog(true)
        })
      },
      closeChangeDirNameDialog(isSearch) {
        this.changeDirNameView = false
        this.changeDirNameData = {}
        isSearch === true && this.$emit('updatePermission')
      },
      changeSelect(v) {
        this.permissionForm.wkgStr = v.filter(item => item.length === 4).map(item => String(item))
      },
      updateAllocation() {
        if (!this.permissonUserList.length) {
          this.$message.error('请设置员工权限!')
          return
        }
        const noPermissionUserList = []
        this.permissonUserList.forEach(item => {
          if (!item.permTypeList.length) {
            noPermissionUserList.push(item.userFullName)
          }
        })
        if (noPermissionUserList.length) {
          this.$message.error(`员工 ${noPermissionUserList} 未设置权限！`)
          return;
        }
        updateSortPermission({
          sortId: this.permissionForm.sortId,
          nwPermissionList: this.permissonUserList
        }).then(res => {
          this.$message.success('操作成功!')
          // this.$emit('updatePermission')
          this.allocationView = false
        })
        // this.permissionForm.wkgStr.push('29,205,2260,2')
        // updateSortPermission(this.permissionForm).then(res => {
        //   this.$message.success('操作成功!')
        //   this.$emit('updatePermission')
        //   this.allocationView = false
        // })
      },
      queryWDS(custId) {
        this.curCustId = custId
        this.WDSView = true
      },
      preView(data) {
        let url = data.address
        if (getProgID(url)) {
          recordOnlienEdit({materialId: data.materialId})
          doEditInOffice(url, getProgID(url))
        } else if (['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          let flag = ''
          if (data.mailId) {
            flag = 'mailId'
          } else if (data.materialId) {
            flag = 'materialId'
          }
          url = url.replace(/&/g, '%26')
          let downFlag = true
          // if (!this.$store.getters.permissions.includes(359)) {
          //   downFlag = false
          // }
          window.open(`#/preView?downFlag=${downFlag}&address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g, '%2B'))
          // doEditInOffice(url, getProgID(url))
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, '').toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        }
          // else if(['zip'].includes(url.replace(/.+\./, '').toLocaleLowerCase())){
          //   if (this.$store.getters.permissions.includes(359)) {
          //     this.downLoad(data)
          //   }
        // }
        else {
          this.downLoad(data)
        }
      },
      downLoad(data) {
        const url = data.address
        const downData = {
          url: `ipdoc${url}`,
          success() {
            // notify.close()
          }
        }
        if (data.mailId) {
          downData.downLoad = data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
      },
      headerDrage(newWidth, oldWidth, column, event, type) {
        this.fileTableHeader[column.property] = newWidth
        localStorage.setItem('fileTableHeader', JSON.stringify(this.fileTableHeader))
      },
      setFileImg(file) {
        let extendName = ''
        if (file.isDir !== 1) {
          extendName = file.materialName.substring(file.materialName.lastIndexOf('.') + 1)
        }
        if (file.isDir == 1) {
          return fileImgMap.get('dir')
        } else if (fileImgMap.has(extendName.toLowerCase())) {
          // 可以识别文件类型的文件
          return fileImgMap.get(extendName.toLowerCase())
        } else {
          // 无法识别文件类型的文件
          return unknownImg
        }
      },
      cellMouseEnter(row) {
        this.enterRow = row
      },
      doubleClick(row) {
        if (row.isDir) {
          this.$emit('clearFileName')
          // this.$router.push(
          //   {
          //     path: '/workbench/material_management/agencyMaterial',
          //     query: {
          //       sortId: row.sortId
          //     }
          //   })
          this.$emit('changeSortId', row.sortId)
        }
      },
      handleSelectionChange(selection) {
        this.$emit('selectionChange', selection)
      },
      copy(row, c, e) {
        if (e.target.innerText) {
          this.$copyText(e.target.innerText).then(
            res => {
            })
        }
      },
      editFun(row) {
        this.$emit('editFun', row)
      },
      handledeleElement(row) {
        this.$emit('handledeleElement', row)
      },
      allocation(row) {
        querySortPermission({sortId: row.sortId}).then(res => {
          this.permissonUserList = res.data || []
          // this.permissionForm.wkgStr = res.data.wkgStr.filter(i => i !== "29,205,2260,2")
          // this.permissionForm.cascaderList = res.data.wkgStr.filter(i => i !== "29,205,2260,2").map(item => item.split(',').map(Number))
        })
        queryDeptGroupAndUser().then(res => {
          this.workGroupList = res.data
          this.allocationView = true
          this.permissionForm.sortId = row.sortId
        })
      },
      changeDirName(row) {
        this.changeDirNameView = true
        this.changeDirNameData = JSON.parse(JSON.stringify(row))
        this.$set(this.changeDirNameData, 'sortName', row.materialName)
      },
      copyFile(row) {
        this.moveFileView = false
        this.copyView = true
        this.moveFileData.materialList = [{
          materialId: row.isDir ? undefined : row.materialId,
          sortId: row.sortId
        }]
      },
      copyFiles(list) {
        this.copyView = true
        this.moveFileView = false
        this.moveFileData.materialList = list.map(row => (
            {
              materialId: row.isDir ? undefined : row.materialId,
              sortId: row.sortId
            }
        ))
      },
      moveFiles(list) {
        this.copyView = false
        this.moveFileView = true
        this.moveFileData.materialList = list.map(row => (
            {
              materialId: row.isDir ? undefined : row.materialId,
              sortId: row.sortId
            }
        ))
      },
      moveFile(row) {
        this.copyView = false
        this.moveFileView = true
        // this.moveFileData = JSON.parse(JSON.stringify(row))
        this.moveFileData.materialList = [{
          materialId: row.isDir ? undefined : row.materialId,
          sortId: row.sortId
        }]
      },
      getRowContextmenuList(row) {
        return [
          // {name: '查看', action: 'doubleClick', isDir: [1]},
          // {name: '修改', action: 'editFun', isDir: [0]},
          {name: '重命名', action: 'changeDirName', isDir: [1]},
          {name: '复制', action: 'copyFile', isDir: [0, 1]},
          {name: '移动', action: 'moveFile', isDir: [0, 1]},
          {name: '删除', action: 'handledeleElement', isDir: [0, 1]},
        ].filter(item => {
          return true
        }).filter(item => item.isDir.includes(row.isDir))
      },
      rowContextmenu(row, column, event) {
        this.$ContextMenu({
          event, // 传入鼠标事件
          menu: this.getRowContextmenuList(row)
        }).then(rs => {
          if (rs) {
            this[rs](row, column, event)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .table-box {
    .el-table__body td {
      border-right: none !important;
      border-left: none !important;
      cursor: pointer;
    }
  }

  .pointer {
    display: block;
  }

  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      height: calc(100% - 130px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
    }
  }

  > > > .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: lightsteelblue !important;
  }

  .moveFile {
    > > > .el-dialog__body {
      padding-top: 0;
    }
  }

  .file-permisson {
    > > > .header-table {
      margin-top: 10px;
      padding: 0 0 0 15px;

      .el-table__header-wrapper {
        border: 1px solid #EBEEF5;
        border-bottom: none;

        th {
          background-color: #FFFFFF;
          font-size: 16px;
          color: #555555;
          font-weight: normal;
        }
      }
    }
  }

  .permissonUserList {
    max-height: 60vh;
    overflow: auto;
  }
</style>
