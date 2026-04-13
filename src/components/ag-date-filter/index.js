import vm from '@/main'
import tree from './tree'
function YearFilter() {
  this.checkedKeys=[]
}

YearFilter.prototype.init = function(params) {

  this.getDiv(params)
  this.filterActive = false;
  this.filterChangedCallback = params.filterChangedCallback;
  this.valueGetter = params.valueGetter;
};
YearFilter.prototype.getDiv=function(params) {
  var that=this
  YearFilter.prototype.field = params.colDef.field
  function getCheck(array,defaultArray) {
    that.checkedKeys=array
    if(that.checkedKeys.length){
      that.filterActive = true
    }else {
      that.filterActive = false
    }
    that.filterChangedCallback();
  }
  const h = vm.$createElement;
  let data = JSON.parse(JSON.stringify(params.api.getModel().rootNode.allLeafChildren.map(item=>item.data)))
  data.forEach(item=>{
    // if(item.gfCreateDate){
    //   item.gfCreateDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.gfCreateDate)[0]
    // }
    if(item[params.colDef.field]){
      if (['certificationTime', 'reportEvidenceTime'].includes(params.colDef.field)) {
        const match = /\d{2}:\d{2}/g.exec(item[params.colDef.field])
        item[params.colDef.field] = match ? match[0] : String(item[params.colDef.field])
      } else {
        const match = /\d{4}-\d{1,2}-\d{1,2}/g.exec(item[params.colDef.field])
        item[params.colDef.field] = match ? match[0] : String(item[params.colDef.field])
      }
    }
  })
  let vnode=h(tree,{
    props: {
      data,
      field: params.colDef.field,
      splitStr: ['certificationTime', 'reportEvidenceTime'].includes(params.colDef.field) ? ':' : '-'
      // model:this.model
    },
    on:{
      checkedKeys:getCheck
    },
  })
  const div = document.createElement('div');
  vm.__patch__(div,vnode,true,false)
  this.eGui = div
  return this.eGui
};
YearFilter.prototype.onRbChanged = function() {
  this.filterActive = this.rbSince2010.checked;
  this.filterChangedCallback();
};

YearFilter.prototype.getGui = function() {
  return this.eGui;
};
YearFilter.prototype.selectNothing = function() {
  this.filterActive = false;
  this.filterChangedCallback();
  // return this.eGui;
};

YearFilter.prototype.doesFilterPass = function(params) {
  // const date = /\d{4}-\d{1,2}-\d{1,2}/g.exec(params.data.gfCreateDate)[0]
  let date = ''
  const value = params.data && this.field ? params.data[this.field] : ''
  if (!value) {
    return false
  }
  if (['certificationTime', 'reportEvidenceTime'].includes(this.field)) {
    const match = /\d{2}:\d{2}/g.exec(value)
    date = match ? match[0] : String(value)
  } else {
    const match = /\d{4}-\d{1,2}-\d{1,2}/g.exec(value)
    date = match ? match[0] : String(value)
  }
  return this.checkedKeys.includes(date)
};

YearFilter.prototype.isFilterActive = function() {
  return this.filterActive;
};

// this example isn't using getModel() and setModel(),
// so safe to just leave these empty. don't do this in your code!!!
YearFilter.prototype.getModel = function() {
  return {values: this.checkedKeys.map(item=>item.replace(/^.*?/,'')), filterType: "set"}
};

YearFilter.prototype.setModel = function(model) {

  // this.model=model

};
YearFilter.prototype.applyModel = function(model) {

  // this.model=model

};

export default YearFilter
