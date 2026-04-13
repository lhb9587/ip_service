import reducer from '../reducers'
import Actions from '../actions'

function statementDispatcher(type, ctx, ...args) {
  const {
    statement_credit,
    statement_set_statement,
    statement_search,
    statement_edit_credit,
    statement_edit_statement,
    statement_export
  } = reducer(ctx);
  switch (type) {
    case Actions.STATEMENT_SET_CREDIT:
      statement_credit(...args)
      break;
    case Actions.STATEMENT_SET_STATEMENT:
      statement_set_statement(...args);
      break;
    case Actions.STATEMENT_SEARCH:
      statement_search(...args);
      break;
    case Actions.STATEMENT_EDIT_CREDIT:
      statement_edit_credit(...args);
      break;
    case Actions.STATEMENT_EDIT_STATEMENT:
      statement_edit_statement(...args);
      break;
    case Actions.STATEMENT_EXPORT:
      statement_export();
      break;
    default:
      break;
  }

}
export default statementDispatcher
