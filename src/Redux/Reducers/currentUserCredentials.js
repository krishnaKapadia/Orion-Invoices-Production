/**
* Reducer returns the default currentUserCredentials object in the global state.
*/
export default function(state = null, action) {
  switch(action.type) {
    case 'CURRENT_USER_SET':
      return action.payload;

    default:
      return state;
  }

  // return ...state;
}
