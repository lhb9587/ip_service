<template>
  <!-- 招聘申请（正式） -->
  <div>
    <div v-for="(item, index) in inviteFormalData">
      <div class="message">
        <div class="blok"></div>
        <span
          >申请信息<span v-if="inviteFormalData.length > 1"
            >-{{ index + 1 }}</span
          ></span
        >
        <div class="segmentation"></div>
      </div>
      <div class="examine-message">
        <el-row :gutter="20">
          <el-col :span="11">
            <div>
              <p>招聘岗位</p>
              {{ item.recruitPosName }}
            </div>
          </el-col>
          <el-col :span="11" :offset="1">
            <div>
              <p>招聘数量</p>
              {{ item.recruitNum }}
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <div>
              <p>招聘工作组</p>
              {{ item.recruitWkgName }}
            </div>
          </el-col>
          <el-col :span="11" :offset="1">
            <div>
              <p>招聘类型</p>
              {{ item.recruitType }}
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <div>
              <p>月薪区间</p>
              <span v-if="item.salaryMin && item.salaryMax">
                {{ item.salaryMin }} - {{ item.salaryMax }} 元/月
              </span>
            </div>
          </el-col>
          <el-col :span="11" :offset="1">
            <div>
              <p>年度奖金区间</p>
              <span v-if="item.bonusAmount || item.bonusMonth">
                <span v-if="item.bonusAmount"
                  >{{ item.bonusAmount }} 元/年</span
                >
                <span v-else>{{ item.bonusMonth }} 个月月薪</span>
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="23">
            <div>
              <p>招聘原因</p>
              {{ item.reason }}
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InviteFormalMsg",
  props: ["inviteFormalData"]
};
</script>

<style lang="scss" scoped>
.message {
    height: 30px;
    line-height: 30px;
    position: relative;

    .blok {
        height: 20px;
        width: 6px;
        background-color: blue;
        border-radius: 6px;
        float: left;
        margin: 5px 14px 0 0;
    }

    span {
        font-size: 18px;
        color: #313131;
    }

    .segmentation {
        width: 86%;
        border-top: 1px solid #dcdcdc;
        position: absolute;
        top: 16px;
        right: 0;
    }
}
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
