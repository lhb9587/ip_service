import { Message } from 'element-ui'
const state = {
  ajglTabList:[],
  djgfTabList:[],
  gftzTabList:[],
  storageTable:{
    types_of_casescase_management:[],
    litigationCasecase_managementlitigation:[],
    patentCasecase_managementpatent:[],
    types_of_casesofficialCommunication: [],
    indexoverseasBill:[],
    billListbill:[],
    cost_listcost_list:[],
    invocieList:[],
    archiveList:[],
    sampleList:[],
    types_of_all_cases:[], // 全部案件
  }
}

const mutations = {
  CHANGE_STORAGETABLE: (state, info) => {
    if(info.type=='push'){
      if(state.storageTable[info.identification]&&info.identification==='types_of_casesofficialCommunication'){
        if(state.storageTable[info.identification].find(item=>item.name==info.name)){
          //判断案件是否重复
          if(!state.storageTable[info.identification].find(item=>item.name==info.name).list.find(item=>item.insId==info.data.insId)){
            state.storageTable[info.identification].find(item=>item.name==info.name).list.push(info.data)
            // Message.success('添加成功')
          }else {
            Message.info('官文重复')
          }
        }else {
          // Message.success('添加成功')
          state.storageTable[info.identification].push({name:info.name,title:info.title,list:[info.data]})
        }
      }else if(state.storageTable[info.identification]&&info.identification==='invocieList'){
        if(state.storageTable[info.identification].find(item=>item.name==info.name)){
          //判断案件是否重复
          if(!state.storageTable[info.identification].find(item=>item.name==info.name).list.find(item=>item.receiptId==info.data.receiptId)){
            state.storageTable[info.identification].find(item=>item.name==info.name).list.push(info.data)
          }else {
            Message.info('发票重复')
          }
        }else {
          // Message.success('添加成功')
          state.storageTable[info.identification].push({name:info.name,title:info.title,list:[info.data]})
        }
      }// 档案
      else if(state.storageTable[info.identification]&&info.identification==='archiveList'){
        if(state.storageTable[info.identification].find(item=>item.name==info.name)){
          //判断档案是否重复
          if(!state.storageTable[info.identification].find(item=>item.name==info.name).list.find(item=>item.arcId==info.data.arcId)){
            state.storageTable[info.identification].find(item=>item.name==info.name).list.push(info.data)
          }else {
            Message.info('档案重复')
          }
        }else {
          // Message.success('添加成功')
          state.storageTable[info.identification].push({name:info.name,title:info.title,list:[info.data]})
        }
      }// 样品
      else if(state.storageTable[info.identification]&&info.identification==='sampleList'){
        if(state.storageTable[info.identification].find(item=>item.name==info.name)){
          //判断样品是否重复
          if(!state.storageTable[info.identification].find(item=>item.name==info.name).list.find(item=>item.samId==info.data.samId)){
            state.storageTable[info.identification].find(item=>item.name==info.name).list.push(info.data)
          }else {
            Message.info('样品重复')
          }
        }else {
          // Message.success('添加成功')
          state.storageTable[info.identification].push({name:info.name,title:info.title,list:[info.data]})
        }
      }//费用
      else if(state.storageTable[info.identification]&&info.identification==='cost_listcost_list'){
        if(state.storageTable[info.identification].find(item=>item.name==info.name)){
          //判断案件是否重复
          if(!state.storageTable[info.identification].find(item=>item.name==info.name).list.find(item=>item.feeId==info.data.feeId)){
            state.storageTable[info.identification].find(item=>item.name==info.name).list.push(info.data)
            // Message.success('添加成功')
          }else {
            Message.info('费用重复')
          }
        }else {
          // Message.success('添加成功')
          state.storageTable[info.identification].push({name:info.name,title:info.title,list:[info.data]})
        }
      }//账单
      else if(state.storageTable[info.identification]&&info.identification==='billListbill'){
        if(state.storageTable[info.identification].find(item=>item.name==info.name)){
          //判断案件是否重复
          if(!state.storageTable[info.identification].find(item=>item.name==info.name).list.find(item=>item.billId==info.data.billId)){
            state.storageTable[info.identification].find(item=>item.name==info.name).list.push(info.data)
            // Message.success('添加成功')
          }else {
            Message.info('账单重复')
          }
        }else {
          // Message.success('添加成功')
          state.storageTable[info.identification].push({name:info.name,title:info.title,list:[info.data]})
        }
      }
      //境外账单
      else if(state.storageTable[info.identification]&&info.identification==='indexoverseasBill'){
        if(state.storageTable[info.identification].find(item=>item.name==info.name)){
          //判断案件是否重复
          if(!state.storageTable[info.identification].find(item=>item.name==info.name).list.find(item=>item.abroadBillId==info.data.abroadBillId)){
            state.storageTable[info.identification].find(item=>item.name==info.name).list.push(info.data)
            // Message.success('添加成功')
          }else {
            Message.info('境外账单重复')
          }
        }else {
          // Message.success('添加成功')
          state.storageTable[info.identification].push({name:info.name,title:info.title,list:[info.data]})
        }//案件
      }else if(state.storageTable[info.identification]){
        if(state.storageTable[info.identification].find(item=>item.name==info.name)){
          //判断案件是否重复
          if(!state.storageTable[info.identification].find(item=>item.name==info.name).list.find(item=>item.caseId==info.data.caseId)){
            state.storageTable[info.identification].find(item=>item.name==info.name).list.push(info.data)
            // Message.success('添加成功')
          }else {
            Message.info('案件重复')
          }
        }else {
          // Message.success('添加成功')
          state.storageTable[info.identification].push({name:info.name,title:info.title,list:[info.data]})
        }
      }
      else {
        state.storageTable[info.identification]=[]
        state.storageTable[info.identification].push({name:info.name,title:info.title,list:[info.data]})
      }
      // if(state.storageTable[info.identification]){
      //   if(state.storageTable[info.identification].find(item=>item.name==info.name)){
      //     //判断案件是否重复
      //     if(!state.storageTable[info.identification].find(item=>item.name==info.name).list.find(item=>item.caseId==info.data.caseId)){
      //       state.storageTable[info.identification].find(item=>item.name==info.name).list.push(info.data)
      //       Message.success('添加成功')
      //     }else {
      //       Message.info('案件重复')
      //     }
      //   }else {
      //     state.storageTable[info.identification].push({name:info.name,title:info.title,list:[info.data]})
      //   }
      // }else {
      //   state.storageTable[info.identification]=[]
      //   state.storageTable[info.identification].push({name:info.name,title:info.title,list:[info.data]})
      // }
    }
    if(info.type=='delete'){
      state.storageTable[info.identification].find(item=>item.name==info.name).list=state.storageTable[info.identification].find(item=>item.name==info.name).list.filter(item=>item!=info.data)
    }
    if(info.type=='update'){
      if(!state.storageTable[info.identification].find(item=>item.name==info.name)){
        return
      }
      if(state.storageTable[info.identification].find(item=>item.name==info.name).list.find(item=>item.billId==info.data.billId)){
        state.storageTable[info.identification].find(item=>item.name==info.name).list.splice(state.storageTable[info.identification].find(item=>item.name==info.name).list.findIndex(item=>item.billId==info.data.billId),1,info.data)
      }
    }
    if(info.type=='deleteItem'){
      state.storageTable[info.identification] = state.storageTable[info.identification].filter(item=>item.name!==info.targetName)
    }

    // console.log(state.storageTable);
    // state.storageTable=
  },
  CHANGE_AJGLTABLIST: (state, info) => {
    if(info.type==='deleteItem'){
      state.ajglTabList=state.ajglTabList.filter(item=>item.name!==info.targetName)
    }
    if(info.type==='push'){
      if(!state.ajglTabList.find(item=>item.name==info.data.name).list.find(item=>item.caseId==info.data.data.caseId)){
        state.ajglTabList.find(item=>item.name==info.data.name).list.push(info.data.data)
        // Message.success('添加成功')
      }else {
        Message.info('案件重复')
      }
    }
    if(info.type==='pushItem'){
      state.ajglTabList.push(info.data)
      // Message.success('添加成功')
    }
    if(info.type=='delete'){
      state.ajglTabList.find(item=>item.name==info.data.name).list=state.ajglTabList.find(item=>item.name==info.data.name).list.filter(item=>item!=info.data.data)
    }
  },
  CHANGE_DJGFTABLIST: (state, info) => {
  },
  CHANGE_GFTZTABLIST: (state, info) => {
  },
}

export default {
  namespaced:true,
  state,
  mutations,
}
