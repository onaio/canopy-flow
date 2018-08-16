// There are three possible states for our login
// process and we need actions for each of them
import { Base64 } from 'js-base64'; 
import { ONAoauth } from '../connectors/Ona/auth';

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const RECEIVE_TOKEN = 'RECEIVE_TOKEN';

export const requestLogin = (creds) => {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  }
}

export const receiveLogin = (user) => {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    user
  }
}

export const loginError = (message) => {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

export const receiveLogout = () => {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false,
  }
}

export const receiveToken = (token) => {
  return {
    type: RECEIVE_TOKEN,
    token,
  }
}

// todo - Migrate to ONA Connector?
export const loginUser = (token) => {
  const reqConfig = {
    token: token,
    endpoint: 'user',
  };

  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(token))
    return ONAoauth(reqConfig, token, dispatch);
  }
}

export const logoutUser = () => {
  return dispatch => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('state');
    dispatch(receiveLogout());
  }
}

export default {
  requestLogin,
  receiveLogin,
  loginError,
  loginUser,
  receiveLogout,
  logoutUser,
  receiveToken
}