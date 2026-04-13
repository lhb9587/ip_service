<template>
  <div>
    <Tabs v-model="activeName" @tab-click="">
      <el-tab-pane label="正式员工人数分布" name="OfficialStaff">
      </el-tab-pane>
      <el-tab-pane label="正式岗位新人数量及分布" name="Interns">
      </el-tab-pane>
      <el-tab-pane label="正式岗位离职数量及分布" name="Resigners">
      </el-tab-pane>
    </Tabs>
    <OfficialStaff v-if="activeName=='OfficialStaff'" />
    <Interns v-if="activeName=='Interns'" />
    <Resigners v-if="activeName=='Resigners'" />
  </div>
</template>
<script>
import OfficialStaff from './OfficialStaff';
import Interns from './Interns';
import Resigners from './Resigners';
export default {
  name: 'index',
  components: {
    OfficialStaff,
    Interns,
    Resigners
  },
  data() {
    return {
      activeName: 'OfficialStaff'
    }
  }
}
</script>
