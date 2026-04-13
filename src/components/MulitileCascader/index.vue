<template>
  <span class="dropTreeLists">
    <multiCascader :options="configOptions"
                   @on-selected="getSelected"
                   :inputValue="configTips"></multiCascader>
  </span>
</template>
<script>
import multiCascader from "./MulCheckCascader.vue";
export default {
  props:['myTips','myOptions'],
  components: {
    multiCascader
  },
  data() {
    return {
      configTips: "请选择",
      //模板勿删
      configOptions: [
        {
          value: "1",
          label: "一级菜单",
          checked: false,  //控制是否默认选中
          multiple: false,   //是否多选   false为该一级菜单不多选，true表示多选
          children: [
            {
              value: '11',
              checked: false,
              multiple: false,
              disabled:false,    //是否禁用
              label: "二级菜单",
              children: [
                {
                  value: "21",
                  checked: false,
                  multiple: true,   //是否多选   false为该一级菜单不多选，true表示多选
                  disabled :false,    //是否禁用
                  label: "三级菜单1"
                },
                {
                  value: "22",
                  checked: false,
                  multiple: true,
                  label: "三级菜单2"
                }
              ]
            },
            {
              value: "12",
              checked: false,
              multiple: false,
              label: "二级菜单",
              children: [
                {
                  value: "3993001",
                  checked: false,
                  multiple: true,
                  label: "三级菜单复制"
                },
                {
                  value: "3993001",
                  checked: false,
                  multiple: true,
                  label: "三级菜单"
                }
              ]
            }
          ]
        }
      ],
      commonLength: ""
    };
  },
  mounted() {
    //this.MulitGetlistBenchmark(); //多选
    console.log(this.configOptions,123)
  },
  methods: {
    // 点击每一个item的时候的操作   在这个方法内灵活判断多选的状态以及禁用状态
    getSelected(val) {
//       let strnum = val.length;
//       console.log(val);
//       // 当选中的指数大于1并且小于10的时候让所有的指数都可以选择（没有禁用状态）
//       if (val.length > 1 && val.length < 10) {
//         this.LessThanThen(this.configOptions);
//       }
//       // 必须保留一个选中的
//       if (val.length == 1) {
//         let moreOne = val[0];
//         this.LessThanMoreOne(this.configOptions, moreOne);
//       }
//       // 当选中的指数大于10的时候让除选中的之外的指数都变为禁用状态
//       if (val.length >= 10) {
//         let moreOne = val;
//         this.LessThanMoreTen(this.configOptions, moreOne);
//       }
//       if (strnum !== this.commonLength) {
// //将选中后的数组暴漏出去，在需要的页面使用
//         this.$emit("CheckedsIndexCodes", val);
//       }
//       this.commonLength = val.length;
      // 勿删后期需求改变会用
      // this.selectGroups = val;
      // this.configTips = `已选择${val.length}个分组`;
      this.$emit("CheckedsIndexCodes", val);
    },
    // 此递归为当选中的指数大于10的时候让除选中的之外的指数都变为禁用状态
    LessThanMoreTen(datas, moreOne) {
      for (var i in datas) {
        if (datas[i].multiple !== false) {
          // console.log(datas[i]);
          datas[i].disabled = true;
          for (let d = 0; d < moreOne.length; d++) {
            if (datas[i].value == moreOne[d]) {
              datas[i].disabled = false;
            }
          }
        } else {
          this.LessThanMoreTen(datas[i].children, moreOne);
        }
      }
    },
    // 此递归为当选中的为选中的只剩下一个的时候禁止取消，也就是必须保留一个选中的
    LessThanMoreOne(datas, moreOne) {
      for (var i in datas) {
        if (datas[i].multiple !== false) {
          // console.log(datas[i]);
          if (datas[i].value == moreOne) {
            datas[i].disabled = true;
          }
        } else {
          this.LessThanMoreOne(datas[i].children, moreOne);
        }
      }
    },
    // 此递归为当选中的为  满足该条件时(val.length > 1 && val.length < 10)  所有的item的都可以选则
    LessThanThen(datas) {
      for (var i in datas) {
        if (datas[i].multiple !== false) {
          // console.log(datas[i]);
          datas[i].disabled = false;
        } else {
          this.LessThanThen(datas[i].children);
        }
      }
    },
    // 此递归为初始化时默认选中沪深300，由于只有一个所以禁用沪深300
    getArrayList(datas) {
      for (var i in datas) {
        if (datas[i].multiple !== false) {
          // console.log(datas[i]);
          datas[i].disabled = false;
          if (datas[i].value === "399300") {
            datas[i].disabled = true;
            datas[i].checked = true;
          }
        } else {
          // console.log(datas[i]);
          //每次在传入父节点的childreg去查找，自己调用自己的方法
          this.getArrayList(datas[i].children);
        }
      }
    },
    MulitGetlistBenchmark() {
      if(this.myOptions){
        this.configOptions=this.myOptions
      }
//此接口为我们项目中的接口，上边有数据模板，可根据数据模板来写数据。
//       getlistBenchmark({}).then(response => {
//         this.configOptions = response.data.data;
//
//       });
      //this.getArrayList(this.configOptions);
    },
  },
  watch:{
    myTips(n,o){
      this.configTips=n
    },
    myOptions:{
      handler(n,o){
        this.configOptions=n
      },
      deep:true,
      immediate:true
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
