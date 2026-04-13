<template>
  <div class="SetHolidays" :style="{'height': '100%','background':'#fff'}">
    <template v-if="!dialogFormVisible">
      <div style="display: flex">
        <el-button @click="addWorkDate" size="mini">添加节假日</el-button>
        <el-pagination
          v-if="total > 4"
          small
          :current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total"
          @current-change="val=>handleCurrentChange(val)">
        </el-pagination>
      </div>
      <el-table
        :data="tableData"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'0px'}"
        style="width: 100%"
        max-height="200">
        <el-table-column
          prop="startDate"
          label="开始日期"
          width="110">
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="结束日期"
          width="110">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类别"
          width="50">
          <template slot-scope="scope">
            {{ scope.row.type == 1 ? '假期' : '上班'}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="updateWorkDate(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="delWorkDate(scope.row.id,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-else>
      <span class="set-date">设置节假日</span>
      <el-form :model="form">
        <el-form-item label="日期">
          <el-col :span="9">
            <el-date-picker
              type="date"
              placeholder="开始日期"
              v-model="form.startDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%;"
              size="mini"></el-date-picker>
          </el-col>
          <el-col style="text-align: center;" :span="2">-</el-col>
          <el-col :span="9">
            <el-date-picker
              type="date"
              placeholder="结束日期"
              v-model="form.endDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%;"
              size="mini"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="类别">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">假期</el-radio>
            <el-radio :label="2">上班</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="insertWorkDate">保 存</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import {getWorkDateList, updateWorkDate, insertWorkDate, delWorkDate} from '@/api/caseList.js'
export default {
  name: "SetHolidays",
  props: {
    isOfficialSub: {
      type: Boolean,
      default: false
    },
    types: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      hoverState:false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 4,
      dialogFormVisible: false,
      form: [],
      defaultForm: {
        startDate: '',
        endDate: '',
        type: 1
      }
    }
  },
  created() {
    this.getWorkDateList()
  },
  mounted() {

  },
  methods: {
    getWorkDateList() {
      getWorkDateList({ pageNo: this.currentPage, pageSize: this.pageSize }).then(res => {
        this.tableData = JSON.parse(JSON.stringify(res.data))
        this.total = res.total
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getWorkDateList()
    },
    updateWorkDate(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    addWorkDate() {
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      console.log(this.form)
      this.dialogFormVisible = true
    },
    insertWorkDate() {
      if (!this.form.startDate || !this.form.endDate){
        this.$message('日期请选择完整');
      }else{
        console.log(this.form)
        if (!this.form.id) {
          insertWorkDate(this.form).then(res => {
            this.$message({message: '添加成功',type: 'success'});
            this.currentPage = 1
            this.getWorkDateList()
          })
        }else{
          updateWorkDate(this.form).then(res => {
            this.$message({message: '修改成功',type: 'success'});
            this.getWorkDateList()
          })
        }
        this.form = []
        this.dialogFormVisible = false
      }
    },
    delWorkDate(id,index) {
      delWorkDate({ id: id }).then(res => {
        this.$message({message: '删除成功',type: 'success'});
        this.tableData.splice(index,1)
      })
    }
  },
  components:{

  }
}
</script>

<style lang="scss" scoped>
.set-date {
  display: block;
  margin-bottom: 20px;
}
.dialog-footer {
  text-align: center;
}

</style>
