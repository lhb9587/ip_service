import vue from 'vue';
import {queryRuleByindex} from '@/api/knowledgeBase.js'
export const state = vue.observable(
  {
    editableTabsValue: '',
    editableTabs: [],
  }
  );
export const mutation = {
  addTab(targetName,indexName,knowledgeNavigationId,titleArray) {

    // let newTabName = ++state.tabIndex + '';
    if(state.editableTabs.find(item=>item.title==targetName)){
      // state.editableTabs.indexOf(state.editableTabs.find(item=>item.title==targetName))
      state.editableTabsValue = state.editableTabs.find(item=>item.title==targetName).name;
    } else {
     // let newTabName = state.editableTabs.length+1+''
      queryRuleByindex({indexName: indexName,knowledgeNavigationId:knowledgeNavigationId,pageSize:10,pageNo:1}).then(res=>{
        state.editableTabs.push({
          title: targetName,
          name: targetName,
          content: res.data,
          titleArray: titleArray,
          indexName:indexName,
          knowledgeNavigationId:knowledgeNavigationId,
          pageSize:10,
          pageNo:1,
          total:res.total
        });
        state.editableTabsValue = targetName
      })
    }
  },
  updateTab(targetName, titleArray){
    if(state.editableTabs.find(item=>item.title==targetName)){
      // state.editableTabs.indexOf(state.editableTabs.find(item=>item.title==targetName))
      state.editableTabs.find(item => item.title == targetName).titleArray = titleArray
    }
  },
  updateTabcontent(targetName,indexName,knowledgeNavigationId,pageSize,pageNo,data){
    if(state.editableTabs.find(item=>item.title==targetName)){
      // state.editableTabs.indexOf(state.editableTabs.find(item=>item.title==targetName))
      queryRuleByindex({...{indexName: indexName,knowledgeNavigationId:knowledgeNavigationId,pageSize,pageNo},...data}).then(res=>{
        state.editableTabs.find(item => item.title == targetName).content = res.data
        state.editableTabs.find(item => item.title == targetName).pageSize = pageSize
        state.editableTabs.find(item => item.title == targetName).pageNo = pageNo
        state.editableTabs.find(item => item.title == targetName).total = res.total
      })
    }
  },
  removeTab(targetName) {
    let tabs = state.editableTabs;
    let activeName = state.editableTabsValue;
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          let nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            activeName = nextTab.name;
          }
        }
      })
    }
    state.editableTabsValue = activeName;
    state.editableTabs = tabs.filter(tab => tab.name !== targetName);
  }
}
