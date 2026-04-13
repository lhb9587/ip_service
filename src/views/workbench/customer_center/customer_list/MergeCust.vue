<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :modal="false" width="50%"
    :before-close="() => handleClose( false)"
  >
    <div class="rebookDiv">
      <div class="rebookTitle">确认要合并客户吗？请指定您要合并到的客户</div>
      <div class="rebookBody">
        <div class="bodyRight">
          <div class="rightTitle">客户: <span class="rebookTitle" style="border-bottom: none">{{custName}}</span>
            将被合并至以下客户
          </div>
          <div class="rightSearch">
            <el-input style="margin-top: 5px;margin-bottom:5px" v-model="name" v-debounce:searchName="'input',300"
                      size="small" placeholder="客户名称">
              <template slot="prepend"><span class="el-icon-search"></span></template>
            </el-input>
          </div>
          <div class="rightTable">
            <el-table @row-click="rowClick" size="mini" :data="list" border fit empty-text="暂无数据"
                      :row-class-name="rowClassName"
                      height="300px"
                      current-row-key
                      style="width: 100%;">
              <el-table-column label="名称" prop="fullname"></el-table-column>
              <el-table-column label="编码" prop="code"></el-table-column>
              <el-table-column label="国籍" prop="country"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="fl-ac-jc" style="padding: 20px 0">
      <el-button size="small" @click="handleClose( false)">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {queryList} from "../../../../api/caseList";
  import {mergeCustomer} from "../../../../api/customerList";

  export default {
    name: "MergeCust",
    props: {
      custId: {},
      custName: {},
      dialogTitle: {
        type: String
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },

    },
    data() {
      return {
        list: [],
        name: '',
        mergeCustId: ''
      }
    },
    methods: {
      searchName(value) {
        if (!value.target.value) return
        this.mergeCustId = ''
        // this.list = this.$store.getters.userList.filter(item => (item.deptName + '~' + item.fullname).includes(value.target.value))
        queryList({pageNo: 1, pageSize: 100, sign: 1, parameter: value.target.value}).then(res => {
          this.list = res.data
          if (this.list.length === 1) {
            this.mergeCustId = this.list[0].custId
            this.name = this.list[0].fullname
          }
        })
      },
      rowClick(row) {
        this.name = row.fullname
        this.mergeCustId = row.custId
      },
      rowClassName({row, rowIndex}) {
        if (row.custId == this.mergeCustId) {
          return 'currentClick'
        }
        return ''
      },
      handleClose(isSearch) {
        this.$emit('closeMergeDialog', isSearch)
      },
      submit() {
        if (!this.custId) {
          this.$message.error('请选择要合并的客户！')
          return
        }
        if (!this.mergeCustId) {
          this.$message.error('请选择您要合并的目标客户！')
          return
        }
        mergeCustomer({
          saveCustId: this.mergeCustId,
          deleteCustId: this.custId
        }).then(res => {
          this.$message.success(res.message)
          this.handleClose(true)
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .rebookDiv {
    width: 100%;
    border: 1px solid #D7D7D7;
    padding: 10px;

    .rebookTitle {
      color: #D9001B;
      padding-bottom: 10px;
      border-bottom: 2px solid #797979;
    }

    .rebookBody {
      display: flex;

      .bodyLeft {
        min-height: 300px;
        max-height: 500px;
        overflow: auto;
        flex: 4;
        /*background-color: red;*/
        margin-right: 10px;

        .nameList {
          width: 100%;
          height: 35px;
          border: 1px solid #F2F2F2;
          border-bottom: none;
          display: flex;
          justify-content: center;
          align-items: center;

          &:last-child {
            border-bottom: 1px solid #F2F2F2;
          }
        }
      }

      .bodyRight {
        min-height: 300px;
        max-height: 500px;
        overflow: auto;
        flex: 6;

        .rightTitle {
          text-align: center;
          background-color: #D7D7D7;
          margin-top: 10px;
          height: 30px;
          line-height: 30px;
        }

        .rightSearch {
          .el-input {
            input {
              border-radius: 0 !important;
            }

            > > > .el-input__inner {
              height: 35px;
            }
          }
        }

        .rightTable {
          thead {
            tr {
              th {
                background-color: #D7D7D7;
                color: #606266;
              }
            }
          }
        }
      }
    }
  }

  > > > .currentClick {
    background-color: #2981EB !important;
    color: #ffffff;
    font-weight: bold;
  }

  > > > .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: transparent !important;
  }

  > > > .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
  }

  > > > .el-table {
    .cell {
      cursor: pointer;
    }
  }

</style>
