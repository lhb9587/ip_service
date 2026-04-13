import reducer from '../reducers'
import Actions from '../actions'

function patentDispatcher(type, ctx, ...args) {
  const {
    patent_edit,
    patent_search,
    patent_create,
    patent_net_pay,
    patent_finance_pay,
    patent_receipt_input,
    patent_charge_exchange,
    patent_merge
  } = reducer(ctx);
  switch (type) {
    case Actions.PATENT_EDIT:
      patent_edit(...args);
      break;
    case Actions.PATENT_SEARCH:
      patent_search(...args);
      break;
    case Actions.PATENT_CREATE:
      patent_create();
      break;
    case Actions.PATENT_NET_PAY:
      patent_net_pay();
      break;
    case Actions.PATENT_FINANCE_PAY:
      patent_finance_pay();
      break;
    case Actions.PATENT_RECEIPT_INPUT:
      patent_receipt_input();
      break;
    case Actions.PATENT_CHARGE_EXCHANGE:
      patent_charge_exchange();
      break;
    case Actions.PATENT_MERGE:
      patent_merge()
      break
    default:
      break;
  }

}
export default patentDispatcher
