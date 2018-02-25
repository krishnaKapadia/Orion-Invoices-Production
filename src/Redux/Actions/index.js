// Action creators

// Sets isLoggedIn to the passing in value
export function setLogin(value) {
  return {
    type: 'LOGIN_SET',
    payload: value
  }
}

// Sets the logged in user information
export function setCurrentUserCredentials(user) {
  console.log(user);
  return {
    type: 'CURRENT_USER_SET',
    payload: user
  }
}
