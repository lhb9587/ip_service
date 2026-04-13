<template>
  <div>
    <div class="breadcrumb-wrapper">
      <div class="breadcrumb">
        <!--        <div style="font-size: 20px">-->
        <!--          <span @click="leftClick" class="el-icon-arrow-left breadcrumb-item" :class="[isLeft ? '' : 'none']"></span>-->
        <!--          <span @click="rightClick" class="el-icon-arrow-right breadcrumb-item" :class="[isRight ? '' : 'none']"></span>-->
        <!--          <span class="el-icon-refresh-right breadcrumb-item" @click="refreshCurrentPath"></span>-->
        <!--          <span class="el-icon-minus breadcrumb-item none" style="transform: rotate(90deg);"></span>-->
        <!--        </div>-->
        <div style="display: 1;overflow-x: auto" :style="{maxWidth: maxWidth + 'px'}">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item><span class="breadcrumb-item" style="color: #333" @click="clickbreadcrumb({sortId: 0})">全部文件</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbList" @click.native="clickbreadcrumb(item)" :key="item.sortId">
              <span class="breadcrumb-item">{{item.sortName}}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="fl-ac-j">
        <el-input @keyup.enter.native="searchFile" clearable size="mini" placeholder="搜索当前目录" v-model="fileName">
          <template slot="prefix">
            <span @click="searchFile" class="el-icon-search"></span>
          </template>
        </el-input>
        <!--        <el-input clearable v-model="fileName" size="small" placeholder="搜索当前目录" @change="searchFile">-->
        <!--          <template #prefix>-->
        <!--            <el-icon @click="searchFile" class="el-input__icon search-icon">-->
        <!--              <search/>-->
        <!--            </el-icon>-->
        <!--          </template>-->
        <!--        </el-input>-->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'bread',
    props: ['breadcrumbList'],
    computed: {
      maxWidth() {
        return document.documentElement.clientWidth - 450
      }
    },
    data() {
      return {
        fileName: '',
        isLeft: false,
        isRight: false
      }
    },
    watch: {
      // $route: {
      //   handler: function(val, oldVal) {
      //     console.log('+++++++++++++++++')
      //     console.log(val)
      //     console.log(this.$router)
      //     console.log(window)
      //     console.log(document)
      //     console.log('+++++++++++++++++')
      //   },
      //   immediate: true
      // }
    },
    methods: {
      clearFileName() {
        this.fileName = ''
      },
      searchFile() {
        this.fileName && this.$emit('searchFile', this.fileName)
      },
      refreshCurrentPath() {
        this.$emit('refreshCurrentPath')
      },
      leftClick() {
        if (this.$route.fullPath === '/workbench/material_management/agencyMaterial?sortId=0' || this.$router.fullPath == '/workbench/material_management/agencyMaterial') {
          return
        }
        this.$router.back()
      },
      rightClick() {
        this.$router.forward()
      },
      clickbreadcrumb(item) {
        this.clearFileName()
        this.$emit('changeSortId', item.sortId)
        // if (item.sortId == this.$route.query.sortId) {
        //   this.refreshCurrentPath()
        // } else {
        //   this.$router.push(
        //     {
        //       path: '/workbench/material_management/agencyMaterial',
        //       query: {
        //         sortId: item.sortId
        //       }
        //     })
        // }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .breadcrumb-wrapper {
    display: flex;
    height: 30px;
    line-height: 30px;
    justify-content: space-between;
    align-content: center;
    border-top: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
    margin-bottom: 5px;
    /*overflow-: auto;*/
    div {
      display: flex;
      align-content: center;
    }

    .current-path {
      margin-right: 5px;
    }

    .breadcrumb-item {
      height: 28px;
      line-height: 28px;
      cursor: pointer;
    }
  }

  .none {
    color: #bbbdbd;
  }

  .breadcrumb {
    white-space: nowrap;
  }
</style>
