import vue from 'vue'
import {getToken,removeToken} from "../../utils/auth";
const state = {
  docStructure:[],
  activeName:'0',
  propertyData:{},
  curList:[],
  curModel:[],
  curTotal:0,
  filterData:{},
  flag:false,
  stIdTotal:{
    stIdList:[]
  },
  total:0,
  defaultTokenData:{ tokenID:getToken()}//getToken()} // tokenID:getToken()'16028364027629350'
}
const mutations = {
  SET_DOCSTEUCTURE:(state, list) => {
    state.docStructure = list
  },
  SET_TOKEN(state, token){
    state.defaultTokenData.tokenID = token
  },
  SET_TOTAL(state, total){
    // state.total=total
  },
  CHANGE_DOCSTEUCTURE(state, data){
    if(!state.stIdTotal[data.activeName]){
      state.stIdTotal[data.activeName]=0
    }
    if( !state.stIdTotal.stIdList.includes(data.stId)){
      state.stIdTotal.stIdList.push(data.stId)
      state.stIdTotal[data.activeName]+=data.total
    }
    state.total=state.stIdTotal[data.activeName]
    state.docStructure.forEach(item=> {
      if (item.childList && item.childList.length) {
        item.childList.forEach(itm => {
          if (itm.childList && itm.childList.length) {
            itm.childList.forEach(i => {
              if (i.stId == data.stId) {
                if(!i.detailList){
                  vue.set(i,'detailList',[])
                }
                data.data.forEach(iii=>{
                  i.detailList.push(iii)
                })
              }
              if (i.childList && i.childList.length){

                i.childList.forEach(child=>{
                  if (child.stId == data.stId) {
                    if(i.activeName==0){
                      vue.set(i,'activeName',i.childList[0].stName)
                    }
                    // i.activeName=i.childList[0].stName
                    // console.log(i.activeName);
                    if(!child.detailList){
                      vue.set(child,'detailList',[])
                    }
                    data.data.forEach(iii=>{
                      child.detailList.push(iii)
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  SET_ACTIVENAME:(state, activeName) => {
    state.activeName = activeName
  },
  CHANGE_PROPERTYLIST:(state, data)=>{
    vue.set(state.propertyData,data.stId,data.data)
  },
  SET_CURLIST:(state, data)=>{
    state.curList=data
  },
  SET_CURMODEL:(state, data)=>{
    state.curModel=data
  },
  SET_CURTOTAL:(state, total)=>{
    state.curTotal=total
  },
  SET_FILTERDATA:(state, data)=>{
    state.filterData=data
  }
}
const actions = {

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
