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
  let vnode=h(tree,{
    props: {
      data:params.api.getModel().rootNode.allLeafChildren.map(item=>item.data),
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
  return this.checkedKeys.includes(params.data.abslimitDate)
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
