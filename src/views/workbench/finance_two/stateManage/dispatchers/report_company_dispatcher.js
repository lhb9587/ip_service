import reducer from '../reducers'
import Actions from '../actions'

function reportCompanyDispatcher(type, ctx, ...args) {
  const {
    report_company_create,
    report_company_edit,
    report_company_delete,
  } = reducer(ctx);
  switch (type) {
    case Actions.REPORT_COMPANY_CREATE:
      report_company_create()
      break;
    case Actions.REPORT_COMPANY_EDIT:
      report_company_edit()
      break;
    case Actions.REPORT_COMPANY_DELETE:
      report_company_delete();
      break;
    default:
      break;
  }

}
export default reportCompanyDispatcher
