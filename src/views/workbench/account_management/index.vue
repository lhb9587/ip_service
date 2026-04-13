<template>
  <el-tabs type="border-card" v-model="activeName" v-if="$store.getters.permissions.includes(523) || $store.getters.permissions.includes(524)">
    <el-tab-pane
      label="平台配置"
      name="平台配置"
      v-if="$store.getters.permissions.includes(523)"
    >
      <div class="operation-bar">
        <el-button type="primary" size="small" @click="handleAddPlatform"
          >新增平台</el-button
        >
      </div>
      <el-table
        :data="platformData"
        style="width: 100%"
        :max-height="tableHeight"
      >
        <el-table-column prop="platformName" label="平台名称">
        </el-table-column>
        <el-table-column prop="siteCode" label="Site 标识"> </el-table-column>
        <el-table-column prop="platformUrl" label="平台URL"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="备注说明"> </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEditPlatform(scope.row)"
              type="primary"
              >编辑</el-button
            >
            <el-button
              size="mini"
              :type="scope.row.status === 1 ? 'warning' : 'success'"
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? "禁用" : "启用" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 平台分页器 -->
      <div class="pagination-container" v-if="platformPagination.total > 0">
        <el-pagination
          @size-change="handlePlatformSizeChange"
          @current-change="handlePlatformCurrentChange"
          :current-page="platformPagination.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="platformPagination.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="platformPagination.total"
        >
        </el-pagination>
      </div>

      <!-- 平台表单对话框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="500px"
        @close="handleDialogClose"
        :close-on-click-modal="false"
      >
        <el-form
          ref="platformForm"
          :model="platformForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="平台名称" prop="platformName">
            <el-input
              v-model="platformForm.platformName"
              placeholder="请输入平台名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="Site标识" prop="siteCode">
            <el-input
              v-model="platformForm.siteCode"
              placeholder="请输入Site标识（唯一）"
            ></el-input>
          </el-form-item>
          <el-form-item label="平台URL" prop="platformUrl">
            <el-input
              v-model="platformForm.platformUrl"
              placeholder="请输入平台URL"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="platformForm.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注说明" prop="description">
            <el-input
              type="textarea"
              v-model="platformForm.description"
              placeholder="请输入备注说明"
              :rows="3"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane
      label="账号管理"
      name="账号管理"
      v-if="$store.getters.permissions.includes(524)"
    >
      <div class="operation-bar">
        <el-button type="primary" @click="handleAddAccount" size="small"
          >新增账号</el-button
        >

        <!-- 搜索和筛选区域 -->
        <div class="search-filter-container">
          <el-input
            v-model="accountSearch.accountName"
            placeholder="请输入账号名称"
            clearable
            @keyup.enter.native="handleSearch"
            style="width: 200px; margin-right: 10px"
            size="small"
            @input="handleSearchThrottled"
          >
          </el-input>

          <el-select
            v-model="accountSearch.status"
            placeholder="账号状态"
            clearable
            @change="handleSearch"
            style="width: 120px; margin-right: 10px"
            size="small"
          >
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>

          <el-select
            v-model="accountSearch.platformId"
            placeholder="所属平台"
            clearable
            @change="handleSearch"
            style="width: 200px"
            size="small"
          >
            <el-option
              v-for="item in platformAbleList"
              :key="item.platformId"
              :label="item.platformName"
              :value="item.platformId"
            ></el-option>
          </el-select>
        </div>
      </div>
      <el-table
        :data="accountData"
        style="width: 100%"
        :max-height="tableHeight"
      >
        <el-table-column prop="platformName" label="平台"> </el-table-column>
        <el-table-column prop="accountName" label="账号"> </el-table-column>
        <el-table-column
          prop="password"
          label="密码"
          :show-overflow-tooltip="true"
        >
          <!-- <template slot-scope="scope">
            <span v-if="showPassword[scope.$index]">{{
              scope.row.password
            }}</span>
            <span v-else>******</span>
            <el-button
              type="text"
              size="mini"
              @click="togglePassword(scope.$index)"
            >
              {{ showPassword[scope.$index] ? "隐藏" : "显示" }}
            </el-button>
          </template> -->
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="usernames" label="使用人"> </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEditAccount(scope.row)"
              type="primary"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              :type="scope.row.status === 1 ? 'warning' : 'success'"
              @click="handleToggleAccountStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? "禁用" : "启用" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 账号分页器 -->
      <div class="pagination-container" v-if="accountPagination.total > 0">
        <el-pagination
          @size-change="handleAccountSizeChange"
          @current-change="handleAccountCurrentChange"
          :current-page="accountPagination.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="accountPagination.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="accountPagination.total"
        >
        </el-pagination>
      </div>

      <!-- 账号表单对话框 -->
      <el-dialog
        :title="accountDialogTitle"
        :visible.sync="accountDialogVisible"
        width="500px"
        @close="handleAccountDialogClose"
        :close-on-click-modal="false"
      >
        <el-form
          ref="accountForm"
          :model="accountForm"
          :rules="accountRules"
          label-width="100px"
        >
          <el-form-item label="所属平台" prop="platformId">
            <el-select
              v-model="accountForm.platformId"
              placeholder="请选择所属平台"
              style="width: 100%"
            >
              <el-option
                v-for="item in platformAbleList"
                :key="item.platformId"
                :label="item.platformName"
                :value="item.platformId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号名称" prop="accountName">
            <el-input
              v-model="accountForm.accountName"
              placeholder="请输入账号名称"
            ></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="accountForm.password"
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="accountForm.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="绑定使用人员" prop="users">
            <el-select
              v-model="accountForm.userList"
              placeholder="请选择使用人员"
              style="width: 100%"
              :filter-method="filterMethod"
              :filterable="true"
              multiple
            >
              <el-option
                v-for="item in filteredUserList"
                :key="item.userId"
                :label="item.username"
                :value="item.userId"
              ></el-option>
            </el-select>
            <!-- <virtual-select
              clearable
              :multiple="true"
              :data="userList"
              v-model="accountForm.userList"
              :filterMethod="filterMethod"
              filterable
            >
            </virtual-select> -->
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input
              type="textarea"
              v-model="accountForm.description"
              placeholder="请输入账号备注"
              :rows="3"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="accountDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAccountForm">确 定</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {
  queryPlatformList,
  createPlatform,
  updatePlatform,
  enablePlatform,
  disablePlatform,
  queryAccountList,
  createAccount,
  updateAccount,
  enableAccount,
  disableAccount,
  queryAccountDetail,
} from "@/api/platform";

export default {
  data() {
    return {
      platformData: [],
      activeName: this.$store.getters.permissions.includes(523)
        ? "平台配置"
        : "账号管理",
      dialogVisible: false,
      dialogTitle: "新增平台",
      isEdit: false,
      // 平台分页数据
      platformPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      platformForm: {
        platformId: null,
        platformName: "",
        siteCode: "",
        platformUrl: "",
        status: 1,
        description: "",
      },
      rules: {
        platformName: [
          { required: true, message: "请输入平台名称", trigger: "blur" },
        ],
        siteCode: [
          { required: true, message: "请输入Site标识", trigger: "blur" },
        ],
        platformUrl: [
          { required: true, message: "请输入平台URL", trigger: "blur" },
        ],
      },
      // 账号管理相关数据
      accountData: [],
      accountDialogVisible: false,
      accountDialogTitle: "新增账号",
      isAccountEdit: false,
      // 账号分页数据
      accountPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      // 账号搜索和筛选数据
      accountSearch: {
        accountName: "",
        status: "",
        platformId: "",
      },
      // 搜索节流计时器
      searchTimer: null,
      accountForm: {
        accountId: null,
        accountName: "",
        platformId: "",
        password: "",
        status: 1,
        userList: [],
        description: "",
      },
      accountRules: {
        accountName: [
          { required: true, message: "请输入账号名称", trigger: "blur" },
        ],
        platformId: [
          { required: true, message: "请选择所属平台", trigger: "change" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      showPassword: [], // 控制密码显示/隐藏
      platformAbleList: [],
      accountKeyword: "",
    };
  },
  created() {
    this.fetchPlatformList();
    this.fetchAccountList();
  },
  computed: {
    userList() {
      return this.$store.getters.userList.map((item) => {
        return {
          userId: item.userId,
          username: item.fullname,
        };
      });
    },
    tableHeight() {
      return document.documentElement.clientHeight - 270;
    },
    filteredUserList() {
      if (!this.accountKeyword) return this.userList;
      return this.userList.filter((item) => {
        return (
          item.username.includes(this.accountKeyword) ||
          this.$commonUtils.isPinyinMatch(item.username, this.accountKeyword)
        );
      });
    },
  },
  methods: {
    // 获取平台列表
    async fetchPlatformList() {
      const params = {
        pageNo: this.platformPagination.currentPage,
        pageSize: this.platformPagination.pageSize,
      };
      const response = await queryPlatformList(params);
      this.platformData = response.data || [];
      this.platformPagination.total = response.total || 0;
    },
    filterMethod(value) {
      this.accountKeyword = value;
    },
    //获取所有可用平台
    async fetchPlatformAbleList() {
      const params = {
        status: 1,
        pageSize: 99999,
      };
      const response = await queryPlatformList(params);
      this.platformAbleList = response.data || [];
    },
    // 新增平台
    handleAddPlatform() {
      this.isEdit = false;
      this.dialogTitle = "新增平台";
      this.resetForm();
      this.dialogVisible = true;
    },

    // 编辑平台
    handleEditPlatform(row) {
      this.isEdit = true;
      this.dialogTitle = "编辑平台";
      this.platformForm = {
        platformId: row.platformId,
        platformName: row.platformName,
        siteCode: row.siteCode,
        status: row.status,
        description: row.description,
        platformUrl: row.platformUrl,
      };
      this.dialogVisible = true;
    },

    // 切换状态
    async handleToggleStatus(row) {
      const action = row.status === 1 ? "禁用" : "启用";
      let response;
      if (row.status === 1) {
        response = await disablePlatform({ platformId: row.platformId });
      } else {
        response = await enablePlatform({ platformId: row.platformId });
      }
      this.$message.success(`${action}成功`);
      this.fetchPlatformList();
    },

    // 提交表单
    async submitForm() {
      this.$refs.platformForm.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            await updatePlatform(this.platformForm);
          } else {
            await createPlatform(this.platformForm);
          }

          this.$message.success(`${this.isEdit ? "更新" : "创建"}成功`);
          this.dialogVisible = false;
          this.fetchPlatformList();
        } else {
          return false;
        }
      });
    },

    // 重置表单
    resetForm() {
      this.platformForm = {
        platformId: null,
        platformName: "",
        siteCode: "",
        platformUrl: "",
        status: 1,
        description: "",
      };
      if (this.$refs.platformForm) {
        this.$refs.platformForm.resetFields();
      }
    },

    // 关闭对话框
    handleDialogClose() {
      this.resetForm();
    },

    // ========== 账号管理相关方法 ==========
    // 获取账号列表
    async fetchAccountList() {
      const params = {
        pageNo: this.accountPagination.currentPage,
        pageSize: this.accountPagination.pageSize,
      };

      // 添加搜索和筛选条件
      if (this.accountSearch.accountName) {
        params.accountName = this.accountSearch.accountName;
      }
      if (this.accountSearch.status !== "") {
        params.status = this.accountSearch.status;
      }
      if (this.accountSearch.platformId) {
        params.platformId = this.accountSearch.platformId;
      }

      const response = await queryAccountList(params);
      this.accountData = response.data || [];
      // 初始化密码显示状态
      this.showPassword = new Array(this.accountData.length).fill(false);
      this.accountPagination.total = response.total || 0;
    },

    // 新增账号
    handleAddAccount() {
      this.isAccountEdit = false;
      this.accountDialogTitle = "新增账号";
      this.resetAccountForm();
      this.accountDialogVisible = true;
    },

    // 编辑账号
    async handleEditAccount(row) {
      this.isAccountEdit = true;
      this.accountDialogTitle = "编辑账号";
      this.resetAccountForm();

      // 获取账号详情
      const response = await queryAccountDetail({ accountId: row.accountId });
      const accountDetail = response.data;

      // 提取userList中的userId数组
      const userIdList = accountDetail.userList
        ? accountDetail.userList.map((user) => user.userId)
        : [];

      this.accountForm = {
        accountId: accountDetail.accountId,
        accountName: accountDetail.accountName,
        platformId: accountDetail.platformId,
        password: accountDetail.password,
        status: accountDetail.status,
        userList: userIdList,
        description: accountDetail.description || "",
      };
      this.accountDialogVisible = true;
    },

    // 切换账号状态
    async handleToggleAccountStatus(row) {
      const action = row.status === 1 ? "禁用" : "启用";
      let response;
      if (row.status === 1) {
        response = await disableAccount({ accountId: row.accountId });
      } else {
        response = await enableAccount({ accountId: row.accountId });
      }
      this.$message.success(`${action}成功`);
      this.fetchAccountList();
    },

    // 提交账号表单
    async submitAccountForm() {
      this.$refs.accountForm.validate(async (valid) => {
        if (valid) {
          // 格式化userList
          const formattedUserList = this.accountForm.userList.map((userId) => {
            const user = this.userList.find((u) => u.userId === userId);
            return {
              userId: userId,
              username: user ? user.username : "管理员",
            };
          });

          // 准备提交数据
          const submitData = {
            ...this.accountForm,
            userList: formattedUserList || [],
          };

          if (this.isAccountEdit) {
            await updateAccount(submitData);
          } else {
            delete submitData.accountId;
            await createAccount(submitData);
          }

          this.$message.success(`${this.isAccountEdit ? "更新" : "创建"}成功`);
          this.accountDialogVisible = false;
          this.fetchAccountList();
        } else {
          return false;
        }
      });
    },

    // 重置账号表单
    resetAccountForm() {
      this.accountForm = {
        accountId: null,
        accountName: "",
        platformId: "",
        password: "",
        status: 1,
        userList: [],
        description: "",
      };
      if (this.$refs.accountForm) {
        this.$refs.accountForm.resetFields();
      }
    },

    // 关闭账号对话框
    handleAccountDialogClose() {
      this.resetAccountForm();
    },

    // 切换密码显示状态
    togglePassword(index) {
      this.$set(this.showPassword, index, !this.showPassword[index]);
    },

    // 平台分页处理
    handlePlatformSizeChange(val) {
      this.platformPagination.pageSize = val;
      this.platformPagination.currentPage = 1;
      this.fetchPlatformList();
    },
    handlePlatformCurrentChange(val) {
      this.platformPagination.currentPage = val;
      this.fetchPlatformList();
    },

    // 账号分页处理
    handleAccountSizeChange(val) {
      this.accountPagination.pageSize = val;
      this.accountPagination.currentPage = 1;
      this.fetchAccountList();
    },
    handleAccountCurrentChange(val) {
      this.accountPagination.currentPage = val;
      this.fetchAccountList();
    },

    // 处理搜索和筛选
    handleSearch() {
      this.accountPagination.currentPage = 1;
      this.fetchAccountList();
    },

    // 节流处理函数
    handleSearchThrottled() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      this.searchTimer = setTimeout(() => {
        this.handleSearch();
      }, 500); // 500ms的延迟
    },
  },
  watch: {
    activeName(val) {
      if (val === "账号管理") {
        this.fetchPlatformAbleList();
      }
    },
  },
  mounted(){
    this.fetchPlatformAbleList()
  }
};
</script>

<style scoped>
.operation-bar {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-filter-container {
  display: flex;
  align-items: center;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
