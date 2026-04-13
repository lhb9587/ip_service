import reducer from '../reducers'
import Actions from '../actions'

function reportManageDispatcher(type, ctx, ...args) {
  const {
    report_manage_create,
    report_manage_edit,
    report_manage_delete,
    report_manage_search,
  } = reducer(ctx);
  switch (type) {
    case Actions.REPORT_MANAGE_CREATE:
      report_manage_create()
      break;
    case Actions.REPORT_MANAGE_EDIT:
      report_manage_edit()
      break;
    case Actions.REPORT_MANAGE_DELETE:
      report_manage_delete();
      break;
    case Actions.REPORT_MANAGE_SEARCH:
      report_manage_search(...args);
      break;
    default:
      break;
  }

}
export default reportManageDispatcher
