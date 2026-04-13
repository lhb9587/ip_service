import reducer from '../reducers'
import Actions from '../actions'

function reportAccountDispatcher(type, ctx, ...args) {
  const {
    report_account_create,
    report_account_edit,
    report_account_delete,
    report_account_search
  } = reducer(ctx);
  switch (type) {
    case Actions.REPORT_ACCOUNT_CREATE:
      report_account_create()
      break;
    case Actions.REPORT_ACCOUNT_EDIT:
      report_account_edit()
      break;
    case Actions.REPORT_ACCOUNT_DELETE:
      report_account_delete();
      break;
    case Actions.REPORT_ACCOUNT_SEARCH:
      report_account_search(...args);
      break;
    default:
      break;
  }

}
export default reportAccountDispatcher
