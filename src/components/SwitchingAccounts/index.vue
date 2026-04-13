<template>
  <div class="switcingAccounts">
    <virtual-select clearable :isUser="true" :data="userList" v-model="username" :filterMethod="filterMethod"  filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
    </virtual-select>
<!--    <virtual-select-->
<!--      v-model="username"-->
<!--      :items="this.$store.getters.userList"-->
<!--      :buffer="32"-->

<!--      :item-size="32"-->
<!--      filterable-->
<!--      keyField="userId"-->
<!--      filter-key="fullname"-->
<!--      clearable-->
<!--    >-->
<!--      <template #default="{ item }">-->
<!--        <el-option slot="default" :key="item.userId" :label="item.fullname" :value="item.userId">-->
<!--          <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--        </el-option>-->
<!--      </template>-->
<!--    </virtual-select>-->
<!--    <RecycleScroller-->
<!--      class="scroller"-->
<!--      :items="$store.getters.userList"-->
<!--      :item-size="32"-->
<!--      key-field="userId"-->
<!--      v-slot="{ item }"-->
<!--    >-->
<!--      <div class="user">-->
<!--        <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--      </div>-->
<!--    </RecycleScroller>-->
<!--    <virtual-select-->
<!--      v-model="username"-->
<!--      :items="$store.getters.userList"-->
<!--      :buffer="32"-->
<!--      :item-size="32"-->
<!--      filterable-->
<!--      filter-key="userId"-->
<!--    >-->
<!--      <template #default="{ item }">-->
<!--        <el-option slot="default" :key="item.userId" :label="item.fullname" :value="item.userId">-->
<!--          {{item}}-->
<!--&lt;!&ndash;          <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
<!--        </el-option>-->
<!--      </template>-->
<!--    </virtual-select>-->
<!--    <el-select @scroll="handlePopupScroll" v-model="username"  filterable clearable placeholder="请选择">-->
<!--      <el-option-->
<!--        v-for="item in $store.getters.userList"-->
<!--        :key="item.userId"-->
<!--        :label="item.fullname"-->
<!--        :value="item.userId"-->
<!--        >-->
<!--        <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--      </el-option>-->
<!--    </el-select>-->
    <p class="button_warp">
      <el-button size="mini" @click.prevent.stop="cancel">取消</el-button>
      <el-button  size="mini" type="primary" @click.prevent.stop="changeConfim">确认</el-button>
    </p>
  </div>
</template>

<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
import {switchoverAccount} from '@/api/user'
import UserIconAndUserName from '@/components/UserIconAndUserName/index.vue'
const generateData = function generateData(length) {
    const data = []
    for (let i = 0; i < length; i++) {
      const item = {
        value: i,
        label: `Label ${i + 1}`,

      }
      data.push(item)
    }
    return data
  }

export default {
  name: "index",

  data() {

    return {
      userList:[],
      username:null,
    }
  },

  components:{

  },
  created(){
    // let arr='白刚、黄晖、任海燕、苏亮、苏和秦、姚红军、李森、汪泽、盛安平、李斌、李明'.split('、')
    let arr='李明'.split('、')
    this.userList=this.$store.getters.userList.filter(item=>!arr.includes(item.label))
    // this.userList=this.$store.getters.userList
    // this.getUser()
  },
  methods:{
    cancel(){
      this.$emit('closeBlock',false)
    },
    filterMethod(label,e){
      return this.$commonUtils.isPinyinMatch(label,e)
    },
    changeConfim(){
      if(this.username){
        switchoverAccount({ userId:this.username }).then(res=>{
          this.$store.commit('user/SET_TOKEN', res.tokenID)
          setToken(res.tokenID)
          window.location.reload()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .switcingAccounts{
    display: flex;
    width: 400px;
    box-sizing: border-box;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    background: #fff;
    border-radius: 5px;
    border: 1px solid #f4f4f5;
    padding: 20px;
    .el-select{
      width: 300px;
    }
  }
  .button_warp{
    margin-top: 20px
  ;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
<style>
  .el-select-dropdown__item{
    list-style: none;
  }
</style>
