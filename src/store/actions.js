// There are three possible states for our login
// process and we need actions for each of them
import { ONAoauth } from '../connectors/Ona/auth';
import { fetchAPIForms, fetchFormFields } from '../connectors/Ona/forms';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const RECEIVE_TOKEN = 'RECEIVE_TOKEN';
export const RECEIVE_FORMS = 'RECEIVE_FORMS';
export const FETCH_FORMS_ERROR = 'FETCH_FORMS_ERROR';
export const RECEIVE_FORM_FIELDS = 'RECEIVE_FORM_FIELDS';

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

export const receiveForms = (forms) => {
  return {
    type: RECEIVE_FORMS,
    forms
  }
}

export const receiveFormFields = (fields) => {
  return {
    type: RECEIVE_FORM_FIELDS,
    fields,
  }
}

export const fetchFormsError = (message) => {
  return {
    type: FETCH_FORMS_ERROR,
    message
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

export const getUserForms = (token) => {
  const reqConfig = {
    token: token,
    endpoint: 'forms',
  }
  return dispatch  => {
    return fetchAPIForms(reqConfig, dispatch);
  }
}

export const getFormFields = (token, formID) => {
  const reqConfig = {
    token: token,
    endpoint: 'forms',
    extraPath: `${formID}/form.json`
  };
  return dispatch => {
    return fetchFormFields(reqConfig, dispatch);
  }
}

export const logoutUser = () => {
  return dispatch => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('state');
    localStorage.removeItem('user');
    dispatch(receiveLogout());
    window.location.reload();
  }
}

export default {
  requestLogin,
  receiveLogin,
  loginError,
  loginUser,
  receiveLogout,
  logoutUser,
  receiveToken,
  receiveForms,
  fetchFormsError,
  getUserForms,
  receiveFormFields,
  getFormFields,
}