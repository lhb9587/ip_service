import reducer from '../reducers'
import Actions from '../actions'

function collectionDispatcher(type, ctx, ...args) {
  const {
    collection_search,
    collection_clear_search,
    collection_create,
    collection_edit,
    collection_delete,
    collection_submit,
    collection_check,
    collection_rebook
  } = reducer(ctx);
  switch (type) {
    case Actions.COLLECTION_SEARCH:
      collection_search(...args);
      break;
    case Actions.COLLECTION_CLEAR_SEARCH:
      collection_clear_search(...args);
      break;
    case Actions.COLLECTION_CREATE:
      collection_create();
      break;
    case Actions.COLLECTION_EDIT:
      collection_edit();
      break;
    case Actions.COLLECTION_DELETE:
      collection_delete();
      break;
    case Actions.COLLECTION_SUBMIT:
      collection_submit();
      break;
    case Actions.COLLECTION_CHECK:
      collection_check();
      break;
    case Actions.COLLECTION_REBOOK:
      collection_rebook(...args);
      break;
    default:
      break;
  }
}
export default collectionDispatcher
