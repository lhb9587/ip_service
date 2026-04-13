import reducer from '../reducers'
import Actions from '../actions'

function reportDispatcher(type, ctx, ...args) {
  const {
    report_create,
    report_edit,
    report_delete,
    report_search,
    report_export,
    report_lock
  } = reducer(ctx);
  switch (type) {
    case Actions.REPORT_CREATE:
      console.log(1111111)
      report_create()
      break;
    case Actions.REPORT_EDIT:
      report_edit()
      break;
    case Actions.REPORT_DELETE:
      report_delete();
      break;
    case Actions.REPORT_SEARCH:
      report_search(...args);
      break;
    case Actions.REPORT_EXPORT:
      report_export()
      break;
    case Actions.REPORT_LOCK:
      report_lock();
      break;
    default:
      break;
  }

}
export default reportDispatcher
