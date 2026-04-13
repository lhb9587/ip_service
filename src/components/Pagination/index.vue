<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination :background="background" :current-page.sync="currentPage" :page-size.sync="pageSize" :layout="layout" :page-sizes="pageSizes" :total="total" v-bind="$attrs"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import { scrollTo } from "@/utils/scroll-to";

export default {
  name: "Pagination",
  props: {
    total: {
      required: true
    },
    page: {
      default: 1
    },
    limit: {
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50];
      }
    },
    storage:{
      default:true
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    storageName:{
      type: String,
      default: ''
    }
  },
  computed: {
    currentPage: {
      get() {
        return Number(this.page);
      },
      set(val) {
        this.$emit("update:page", Number(val));
      }
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        if(isNaN(val)){
          val=1000000
        }
        this.$emit("update:limit", val);
        if (!this.storage) {
          return
        }
        if(JSON.parse(localStorage.getItem('pageSize'))){
          var arr = JSON.parse(localStorage.getItem('pageSize'))
        }else {
          var arr = []
        }
        if(this.$options.parent.name&&this.$options.parent.name=="dialog-fade"){

          if(arr.find(item=>item.name=="dialog-fade")){
            arr.find(item=>item.name=="dialog-fade").pageSize=val
          }else {
            arr.push({name:"dialog-fade",pageSize:val})
          }
        } else if(this.storageName){
          if(arr.find(item=>item.name==this.storageName)){
            arr.find(item=>item.name==this.storageName).pageSize=val
          }else {
            arr.push({name:this.storageName,pageSize:val})
          }
        }
        else {
          if(arr.find(item=>item.name==this.$route.name)){
            arr.find(item=>item.name==this.$route.name).pageSize=val
          }else {
            arr.push({name:this.$route.name,pageSize:val})
          }
        }
        if(this.$options.parent.label&&(this.$options.parent.label.includes('无法识别')||this.$options.parent.label.includes('识别错误'))) {
          if (this.$options.parent.label.includes('无法识别')) {
            if (arr.find(item => item.name == '无法识别')) {
              arr.find(item => item.name == '无法识别').pageSize = val
            } else {
              arr.push({name: '无法识别', pageSize: val})
            }
          }
          if (this.$options.parent.label.includes('识别错误')) {
            if (arr.find(item => item.name == '识别错误')) {
              arr.find(item => item.name == '识别错误').pageSize = val
            } else {
              arr.push({name: '识别错误', pageSize: val})
            }
          }
        }else {
          if(arr.find(item=>item.name==this.$route.name)){
            arr.find(item=>item.name==this.$route.name).pageSize=val
          }else {
            arr.push({name:this.$route.name,pageSize:val})
          }
        }
        localStorage.setItem('pageSize',JSON.stringify(arr))
        // console.log(this.$options.parent.name ,this.$options.parent.label);
        // if(this.$options.parent.name||this.$options.parent.label){
        //  if(this.$options.parent.name=="dialog-fade"||this.$options.parent.label.includes('无法识别')||this.$options.parent.label.includes('识别错误')){
        //     if(JSON.parse(localStorage.getItem('pageSize'))){
        //       var arr = JSON.parse(localStorage.getItem('pageSize'))
        //     }else {
        //       var arr = []
        //     }
        //     if(this.$options.parent.label){
        //
        //
        //     if(this.$options.parent.label.includes('无法识别')){
        //       if(arr.find(item=>item.name=='无法识别')){
        //         arr.find(item=>item.name=='无法识别').pageSize=val
        //       }else {
        //         arr.push({name:'无法识别',pageSize:val})
        //       }
        //     }
        //     if(this.$options.parent.label.includes('识别错误')){
        //       if(arr.find(item=>item.name=='识别错误')){
        //         arr.find(item=>item.name=='识别错误').pageSize=val
        //       }else {
        //         arr.push({name:'识别错误',pageSize:val})
        //       }
        //     }
        //     }
        //     if(this.$options.parent.name=="dialog-fade"){
        //       if(arr.find(item=>item.name=='"dialog-fade"')){
        //         arr.find(item=>item.name=="dialog-fade").pageSize=val
        //       }else {
        //         arr.push({name:"dialog-fade",pageSize:val})
        //       }
        //     }
        //   }else {
        //    if(JSON.parse(localStorage.getItem('pageSize'))){
        //      var arr = JSON.parse(localStorage.getItem('pageSize'))
        //    }else {
        //      var arr = []
        //    }
        //    if(arr.find(item=>item.name==this.$route.name)){
        //      arr.find(item=>item.name==this.$route.name).pageSize=val
        //    }else {
        //      arr.push({name:this.$route.name,pageSize:val})
        //    }
        //  }
        // }else {
        //   if(JSON.parse(localStorage.getItem('pageSize'))){
        //     var arr = JSON.parse(localStorage.getItem('pageSize'))
        //   }else {
        //     var arr = []
        //   }
        //   if(arr.find(item=>item.name==this.$route.name)){
        //     arr.find(item=>item.name==this.$route.name).pageSize=val
        //   }else {
        //     arr.push({name:this.$route.name,pageSize:val})
        //   }
        // }
        // localStorage.setItem('pageSize',JSON.stringify(arr))
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("pagination", { page: this.currentPage, limit: val });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    },
    handleCurrentChange(val) {
      this.$emit("pagination", { page: val, limit: this.pageSize });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    }
  },
};
</script>

<style scoped>

.pagination-container.hidden {
  display: none;
}
</style>
