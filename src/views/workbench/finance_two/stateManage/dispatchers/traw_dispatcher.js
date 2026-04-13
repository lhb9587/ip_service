import reducer from '../reducers'
import Actions from '../actions'

function trawDispatcher(type, ctx, ...args) {
  const {
    traw_search,
    traw_edit,
    traw_pl_edit,
    traw_delete
  } = reducer(ctx);
  switch (type) {
    case Actions.TRAW_SEARCH:
      traw_search(...args);
      break;
    case Actions.TRAW_EDIT:
      traw_edit();
      break;
    case Actions.TRAW_PL_EDIT:
      traw_pl_edit();
      break;
    case Actions.TRAW_DELETE:
      traw_delete();
      break
    default:
      break;
  }

}
export default trawDispatcher
