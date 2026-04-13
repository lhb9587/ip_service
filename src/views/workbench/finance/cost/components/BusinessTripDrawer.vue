<template>
  <el-drawer
    :visible.sync="visible"
    :modal="false"
    size="50%"
    title="出差申请"
    @close="handleClose"
  >
    <div slot="title">
      <div
        style="
          display: flex;
          align-items: center;
        "
      >
        <span
          v-if="appData.btId"
          style="font-size: 16px"
          >出差申请
          <span v-if="appData.wfStatus">
            <el-tag
              type="primary"
              v-if="appData.wfStatus == '待提交'"
              >{{ appData.wfStatus }}</el-tag
            >
            <el-tag
              type="warning"
              v-if="appData.wfStatus == '待审核'"
              >{{ appData.wfStatus }}</el-tag
            >
            <el-tag
              type="danger"
              v-if="appData.wfStatus == '审核退回'"
              >{{ appData.wfStatus }}</el-tag
            >
            <el-tag
              type="success"
              v-if="appData.wfStatus == '已完成'"
              >{{ appData.wfStatus }}</el-tag
            >
          </span>
        </span>
      </div>
    </div>
    <ViewDetail :appData="appData" />
  </el-drawer>
</template>

<script>
import {getBtById} from '@/api/feeList'
import ViewDetail from '@/views/workbench/toDoTasks/components/viewDetail.vue'

export default {
  name: 'BusinessTripDrawer',
  components: {
    ViewDetail
  },
  props: {
    drawerVisible: {
      type: Boolean,
      default: false
    },
    btId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
      return {
        appData: {}
      }
  },
  computed: {
    visible: {
      get() {
        return this.drawerVisible
      },
      set(val) {
        this.$emit('update:drawerVisible', val)
      }
    }
  },
  watch: {
    visible: {
      handler(newVal) {
        if (newVal) {
          this.fetchBusinessTripData(this.btId)
        }
      },
      immediate: true
    }
  },
  methods: {
    fetchBusinessTripData(btId) {
      getBtById({ btId }).then(res => {
        if (res.success) {
          this.appData = res.data || {}
        }
      }).catch(err => {
        console.error('获取出差申请详情失败', err)
      })
    },
    handleClose() {
      this.$emit('update:drawerVisible', false)
      this.$emit('close')
    }
  }
}
</script>

