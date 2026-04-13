/* eslint-disable */
let data =[{
  caseType:'转让/移转',
  list:[{title: '案件文号', type: 'agentNum'},{title:'案件类型',type:'caseType'}, {title: '客户', type: 'custName'},{title:'申请人',type:'appCnName'},{title:'转让人',type:'transferorCnName'},{title:'商标号',type:'regNumber'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'类别',type:'goodClasses'}]
},{
  caseType:'续展', list: [{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'申请人',type:'appCnName'},{title:'商标号',type:'regNumber'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'截止日期',type:'validEndDate'},{title:'类别',type:'goodClasses'}]
},{
  caseType: '更正商标申请事项',list:[{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'申请人',type:'appCnName'},{title:'商标号',type:'regNumber'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'更正前信息',type:'beforeChangeMessage'},{title:'更正后信息',type:'afterChangeMessage'},{title:'类别',type:'goodClasses'}]
},{
  caseType:'许可备案',list: [{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'申请人（许可人）',type:'appCnName'},{title:'被许可人',type:'transferorCnName'},{title:'商标号',type:'regNumber'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'类别',type:'goodClasses'}]

},{
  caseType: '变名变址',list: [{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'变更类型',type:'changeType'},{title:'变更前申请人名称',type:'preChangeCnName'},{title:'变更前申请人地址',type:'preChangeCnAdress'},{title:'变更后申请人名称',type:'appCnName'},{title:'变更后申请人地址',type:'appCnAddr'},
  { title: '商标号', type:'regNumber' }, {title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'类别',type:'goodClasses'}]

},{
  caseType: '变更注册申请代理机构',list: [{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'申请人',type:'appCnName'},{title:'商标号',type:'regNumber'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'变更后代理机构名称',type:'preChangeAgencyName'},{title:'变更后文件接收人名称',type:'acceptPerson'},{title:'变更后文件接收人地址',type:'acceptPersonAddr'},{title:'类别',type:'goodClasses'}	]

},{
  caseType: '删减商品项目',list:  [{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'申请人',type:'appCnName'},{title:'商标号',type:'regNumber'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'类别',type:'goodClasses'}]

},{
  caseType:['无效宣告申请','无效宣告答辩'], list:[{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'申请人',type:'appCnName'},{title:'被申请人',type:'respondentNameCn'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'商标注册号',type:'regNumber'},{title:'有效期起始日',type:'validStartDate'},{title:'有效期截至日',type:'validEndDate'},{title:'类别',type:'goodClasses'}	]
},
  {
    caseType:'异议', list:[{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'申请人',type:'appCnName'},{title:'被异议人',type:'respondentNameCn'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'初审公告号',type:'approvalNo'},{title:'初审公告日期',type:'approvalDate'},{title:'初审公告期号',type:'approvalNumber'},{title:'类别',type:'goodClasses'}	]
  },
  {
    caseType:'异议答辩', list:[{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'申请人',type:'appCnName'},{title:'异议人',type:'appCnName'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'初审公告号',type:'approvalNo'},{title:'初审公告日期',type:'approvalDate'},{title:'初审公告期号',type:'approvalNumber'},{title:'类别',type:'goodClasses'}	]
  },
  {
    caseType:[ '注册驳回复审','国际注册驳回复审'], list:[{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'申请人',type:'appCnName'},{title:'原商标申请号/国际注册号',type:'regNumber'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'官方发文编号',type:'tmOfficeNumber'},{title:'官文时限基准日期',type:'docDate'},{title:'类别',type:'goodClasses'}]
  },
  {
    caseType:'不予注册复审', list:[{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'申请人',type:'appCnName'},{title:'被申请人',type:'respondentNameCn'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'初审公告号',type:'approvalNo'},{title:'官方发文编号',type:'tmOfficeNumber'},{title:'官文时限基准日期',type:'docDate'},{title:'类别',type:'goodClasses'}]
  },
  {
    caseType:'撤销商标复审',  list:[{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'申请人',type:'appCnName'},{title:'被申请人',type:'respondentNameCn'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'商标注册号',type:'regNumber'},{title:'官方发文编号',type:'tmOfficeNumber'},{title:'官文时限基准日期',type:'docDate'},{title:'类别',type:'goodClasses'}]
  },
  {
    caseType:'撤三答辩（提供使用证明）',  list:[{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'申请人',type:'appCnName'},{title:'被申请人（撤销人）',type:'respondentNameCn'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'商标注册号',type:'regNumber'},{title:'注册日',type:'regDate'},{title:'使用起始日',type:'validStartDate'},{title:'有效期截至日',type:'validEndDate'},{title:'类别',type:'goodClasses'}]
  },
  {
    caseType:'撤销三年停止使用申请',  list:[{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'申请人',type:'appCnName'},{title:'被申请人（撤销人）',type:'respondentNameCn'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'商标注册号',type:'regNumber'},{title:'注册日',type:'regDate'},{title:'类别',type:'goodClasses'}]
  },
  {
    caseType:'商标注册', list: [{title:'案件文号',type:'agentNum'},{title:'案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'申请人',type:'appCnName'},{title:'申请方向',type:'appFromto'},{title:'商标名称',type:'tmName'},{title:'商标图样',type:'imageFile'},{title:'类别',type:'goodClasses'},{title:'国籍',type:'appGJdq'},{title:'递交方式',type:'submitType'},{title:'类别',type:'goodClasses'}]
  },
]
data.forEach((item,index)=>{
  if(Object.prototype.toString.call(item.caseType).includes('Array')){
    data=[...data,...item.caseType.map(itm=>({caseType:itm,list:item.list}))]
  }
})
data.forEach((item,index)=>{
  if(item.caseType==='异议答辩'){
    item.list.forEach(itm=>{
      if(itm.title==='被异议人'){
        itm.title==='异议人'
      }
    })
  }
})
export default data.filter(item=>!Object.prototype.toString.call(item.caseType).includes('Array'))
