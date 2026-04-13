import reducer from '../reducers'
import Actions from '../actions'

function insideBillDispatcher(type, ctx, ...args) {
  const {
    inside_bill_create,
    inside_bill_edit,
    inside_bill_audit,
    inside_bill_search,
    indise_bill_clear_search
  } = reducer(ctx);
  switch (type) {
    case Actions.INSIDE_BILL_CREATE:
      inside_bill_create();
      break;
    case Actions.INSIDE_BILL_EDIT:
      inside_bill_edit();
      break;
    case Actions.INSIDE_BILL_AUDIT:
      inside_bill_audit();
      break;
    case Actions.INSIDE_BILL_SEARCH:
      inside_bill_search(...args);
      break;
    case Actions.INSIDE_BILL_CLEAR_SEARCH:
      indise_bill_clear_search(...args);
      break;
    default:
      break;
  }

}
export default insideBillDispatcher
