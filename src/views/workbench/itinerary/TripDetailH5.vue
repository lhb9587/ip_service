<template>
  <div>
    <div class="tabbar">出差详情</div>
    <div class="content">
      <div class="status">
        <div>
          <span
            class="status-main"
            :style="{ backgroundColor: getStatusColor }">
          </span>
          {{detailInfo.wfStatus}}
        </div>
      </div>
      <div class="content-case">
        <div class="case-row">
          <div class="row-left">出差类型</div>
          <div class-="row-right">{{detailInfo.tripTypeStr}}</div>
        </div>
        <div class="case-row" v-if="detailInfo.tripType == 2162">
          <div class="row-left">会议名称</div>
          <div class-="row-right">{{detailInfo.meetingName}}</div>
        </div>
        <div class="case-row" v-if="detailInfo.tripType == 2163">
          <div class="row-left">客户名称</div>
          <div class-="row-right">{{detailInfo.custIdStr}}</div>
        </div>
        <div class="case-row" v-if="detailInfo.tripType == 2164">
          <div class="row-left">出差事由</div>
          <div class-="row-right">{{detailInfo.tripReason}}</div>
        </div>
        <div class="case-row">
          <div class="row-left">交通工具</div>
          <div class-="row-right">{{detailInfo.transport}}</div>
        </div>
        <div class="case-row">
          <div class="row-left">单程往返</div>
          <div class-="row-right">{{detailInfo.tripWay}}</div>
        </div>
        <div class="case-row">
          <div class="row-left">同行人</div>
          <div class-="row-right">{{detailInfo.companionsStr}}</div>
        </div>
        <div class="case-row">
          <div class="row-left">出发城市</div>
          <div class-="row-right">{{detailInfo.departureCity}}</div>
        </div>
        <div class="case-row">
          <div class="row-left">目的城市</div>
          <div class-="row-right">{{detailInfo.destinationCity}}</div>
        </div>
        <div class="case-row">
          <div class="row-left">开始时间</div>
          <div class-="row-right">{{detailInfo.startDate}}</div>
        </div>
        <div class="case-row">
          <div class="row-left">结束时间</div>
          <div class-="row-right">{{detailInfo.endDate}}</div>
        </div>
        <div class="case-row">
          <div class="row-left">出差天数</div>
          <div class-="row-right">{{detailInfo.tripDays}}</div>
        </div>
        <div class="case-row">
          <div class="row-left">出差备注</div>
          <div class-="row-right">{{detailInfo.remarks}}</div>
        </div>
        <div class="case-row">
          <div class="row-left">申请人员</div>
          <div class-="row-right">{{detailInfo.userIdStr}}</div>
        </div>
        <div class="case-row">
          <div class="row-left">申请日期</div>
          <div class-="row-right">{{$commonUtils.formatDate(detailInfo.createDate)}}</div>
        </div>
      </div>
    </div>
    <div class="foot fl-ac-jc">
      <el-button size="small"
                 :style="{backgroundColor: isAudit ? 'darkgray' : '#fff', borderColor: isAudit ? 'darkgray' : '', color: isAudit ? '#fff' : '#000'}"
                 :disabled="isAudit" @click="submitFee(0)">退 回
      </el-button>
      <el-button type="primary"
                 :style="{backgroundColor: isAudit ? 'darkgray' : '#409EFF', borderColor: isAudit ? 'darkgray' : '#409EFF'}"
                 :disabled="isAudit" size="small" @click="submitFee(1)">通 过
      </el-button>
      <el-button type="primary" size="small" @click="closeWindow">关 闭</el-button>
    </div>

    <el-dialog 
      :title="auditType === 1 ? '审核通过' : '审核退回'" 
      :visible.sync="showAuditDialog" 
      width="90%" 
      :close-on-click-modal="false" 
      append-to-body
      custom-class="audit-dialog-h5">
      <el-form label-position="top">
        <el-form-item label="审核意见">
          <el-input
            v-model="auditComment"
            type="textarea"
            :rows="5"
            placeholder="请输入审核意见（非必填）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAuditDialog = false" size="medium" class="cancel-btn">取 消</el-button>
        <el-button type="primary" @click="confirmAudit" size="medium" class="confirm-btn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getTripAudit, getTripById} from "../../../api/schedule";

  export default {
    name: "DetailH5",
    data() {
      return {
        auditStatus: false,
        detailInfo: {},
        btId: '',
        showAuditDialog: false,
        auditComment: '',
        auditType: 1,
      }
    },
    created() {
      this.btId = this.$route.query && this.$route.query.btId
      this.btId && this.queryDetail()
    },
    computed: {
      isAudit() {
        if ( this.detailInfo.wfStatus === '待审核' && !this.auditStatus) {
          return false
        }
        return true
      },
      getStatusColor() {
        switch (this.detailInfo.wfStatus) {
          case '已完成':
            return '#008000'; // 绿色
          case '待审核':
            return '#FFD700'; // 黄色
          case '审核退回':
            return '#FF0000'; // 红色
          default:
            return '#FFD700'; // 默认颜色
        }
      },
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      closeWindow() {
        window.location.href = "about:blank";
        window.close();
      },
      queryDetail() {
        getTripById({
          btId: this.btId
        }).then(res => {
          this.detailInfo = res.data
        })
      },
      submitFee(result) {
        this.auditType = result
        this.auditComment = ''
        this.showAuditDialog = true
      },
      confirmAudit() {
        let submitData = {
          btId: this.detailInfo.btId,
          taskId: this.detailInfo.taskId,
          result: this.auditType,
          auditComment: this.auditComment
        }
        getTripAudit(submitData).then(Response => {
          this.auditStatus = true
          this.showAuditDialog = false
          this.auditComment = ''
          if(this.auditType){
            this.$message.success('审核成功!')
            this.detailInfo.wfStatus = '已完成'
          }else{
            this.$message.success('退回成功!')
            this.detailInfo.wfStatus = '审核退回'
          }
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .tabbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 45px;
    background-color: #52A0F5;
    color: #fff;
    text-align: center;
    font-size: 16px;
    line-height: 45px;
    font-weight: bold;
  }

  .content {
    height: 100vh;
    background-color: #F7F7F7;
    padding-top: 45px;
    padding-bottom: 45px;
    font-size: 14px;
    overflow: auto;

    .status {
      width: 100%;
      padding: 10px 0;

      div {
        padding: 10px;
        background-color: #fff;
      }
    }

    .content-case {
      /*height: 900px;*/
      /*width: 100%;*/
      margin: 0px 10px 10px 10px;
      background-color: #fff;
      border-radius: 10px;
      padding: 0 10px 0 10px;
      font-size: 13px;
    }


    .case-row, .fee-title, .fee-content-item {
      display: flex;
      justify-content: space-between;
      line-height: 35px;
      border-bottom: 1px solid #EBEEF5;

      .row-left {
        margin-right: 10px;
        flex-shrink: 0;
      }

      &:last-child {
        border: none;
      }
    }

    .fee-content-item {
      justify-content: left;
      border: none;
      line-height: 20px;

      .row-left {
        margin-right: 5px;
      }
    }

    .fee-title {
      border: none;

      .row-left {
        color: #52A0F5;
      }
    }
  }

  .foot {
    padding-bottom: 10px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #F7F7F7;

    .el-button {
      width: 25%;
    }
  }
  .status-main {
    display: inline-block;
    margin:0 10px;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color:#FFD700;
  }

  /deep/ .audit-dialog-h5 {
    border-radius: 12px;
    
    .el-dialog__header {
      padding: 15px 20px;
      background: linear-gradient(135deg, #52A0F5 0%, #4a8fd8 100%);
      border-radius: 12px 12px 0 0;
      
      .el-dialog__title {
        color: #fff;
        font-size: 16px;
        font-weight: 500;
      }
      
      .el-dialog__close {
        color: #fff;
        font-size: 20px;
      }
    }
    
    .el-dialog__body {
      padding: 20px 15px;
      
      .el-form-item__label {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }
      
      .el-textarea__inner {
        border-radius: 8px;
        border: 1px solid #DCDFE6;
        font-size: 14px;
        
        &:focus {
          border-color: #52A0F5;
        }
      }
      
      .el-input__count {
        background: transparent;
        font-size: 12px;
      }
    }
    
    .el-dialog__footer {
      padding: 15px 20px;
      border-top: 1px solid #f0f0f0;
      
      .dialog-footer {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        
        .el-button {
          flex: 1;
          height: 40px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          
          &.cancel-btn {
            background: #fff;
            border: 1px solid #DCDFE6;
            color: #606266;
            
            &:hover {
              background: #f5f7fa;
              border-color: #c0c4cc;
            }
          }
          
          &.confirm-btn {
            background: linear-gradient(135deg, #52A0F5 0%, #4a8fd8 100%);
            border: none;
            box-shadow: 0 2px 8px rgba(82, 160, 245, 0.3);
            
            &:hover {
              box-shadow: 0 4px 12px rgba(82, 160, 245, 0.4);
            }
          }
        }
      }
    }
  }
</style>
