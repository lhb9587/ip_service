import reducer from '../reducers'
import Actions from '../actions'

function outPriceDispatcher(type, ctx, ...args) {
  const {
    out_price_search,
    out_price_create,
    out_price_edit,
    out_price_zy,
    out_price_mdl,
    out_price_export_model,
    out_price_waibi
  } = reducer(ctx);
  switch (type) {
    case Actions.OUTPRICE_SEARCH:
      out_price_search(...args);
      break;
    case Actions.OUTPRICE_CREATE:
      out_price_create();
      break;
    case Actions.OUTPRICE_EDIT:
      out_price_edit();
      break;
    case Actions.OUTPRICE_ZY:
      out_price_zy();
      break;
    case Actions.OUTPRICE_MDL:
      out_price_mdl();
      break;
    case Actions.OUTPRICE_EXPORT_MODEL:
      out_price_export_model();
      break;
    case Actions.OUTPRICE_WAIBI:
      out_price_waibi();
      break;
    default:
      break;
  }

}
export default outPriceDispatcher
