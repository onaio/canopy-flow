import {
  LOGIN_SUCCESS, LOGIN_REQUEST, LOGIN_FAILURE, LOGOUT_SUCCESS, RECEIVE_TOKEN,
  RECEIVE_FORMS, FETCH_FORMS_ERROR, RECEIVE_FORM_FIELDS, FETCH_PROJECTS_ERROR, RECEIVE_PROJECTS, RECEIVE_PROJECT,
  FETCH_PROJECT_ERROR,
  SELECTED_FLOW,
  SAVE_FLOW, DELETE_FLOW, HANDLE_FLOW_CREATION,
} from './actions';

const defaultState = {
  isFetching: false,
  isAuthenticated: !!localStorage.getItem('access-token'),
  flows: {},
  stepsState: {
    selectSourceStage: true,
    selectDataStage: false,
    finalizeStage: false,
    disabledPrevBtn: true,
    disabledNextBtn: false,
  }
};

export default function AUTH(state = defaultState, action) {
  switch (action.type) {
  case LOGIN_REQUEST: {
    return {
      ...state,
      isFetching: true,
      isAuthenticated: false,
      user: action.creds,
    };
  }

  case RECEIVE_TOKEN: {
    return {
      ...state,
      access_token: action.token,
    };
  }

  case LOGIN_SUCCESS: {
    return {
      ...state,
      isFetching: false,
      isAuthenticated: true,
      errorMessage: '',
      userInfo: action.user,
    };
  }

  case LOGIN_FAILURE: {
    return {
      ...state,
      isFetching: false,
      isAuthenticated: false,
      errorMessage: action.message,
    };
  }

  case LOGOUT_SUCCESS: {
    return {
      ...state,
      isFetching: true,
      isAuthenticated: false,
      userInfo: null,
      forms: null,
      access_token: null,
    };
  }

  case RECEIVE_FORMS: {
    return {
      ...state,
      forms: action.forms.map(f => ({
        title: f.title,
        formid: f.formid,
        downloadable: f.downloadable,
      })),
    };
  }

  case RECEIVE_FORM_FIELDS: {
    return {
      ...state,
      fields: action.fields ? [
        ...action.fields.children.map(c => ({
          name: c.name || '',
          type: c.type || '',
          label: c.label || '',
        })),
      ] : null,
    };
  }

  case FETCH_FORMS_ERROR: {
    return {
      ...state,
      formsError: action.message,
    };
  }

  case RECEIVE_PROJECTS: {
    return {
      ...state,
      projects: [
        ...action.projects,
      ],
    };
  }

  case FETCH_PROJECTS_ERROR: {
    return {
      ...state,
      projectsError: action.message,
    };
  }

  case RECEIVE_PROJECT: {
    return {
      ...state,
      project: action.project
        ? {
          ...action.project,
        } : null,
    };
  }

  case HANDLE_FLOW_CREATION: {
    return {
      ...state,
      stepsState: {
        ...state.stepsState,
        disabledPrevBtn: action.disabledPrevBtn,
        selectSourceStage: action.selectSourceStage,
        selectDataStage: action.selectDataStage,
        finalizeStage: action.finalizeStage,
        disabledNextBtn: action.disabledNextBtn
      }
    };
  }

  case FETCH_PROJECT_ERROR: {
    return {
      ...state,
      projectError: action.message,
    };
  }

  case SELECTED_FLOW: {
    return {
      ...state,
      flow: {
        ...action.flow,
      },
    };
  }

  case SAVE_FLOW: {
    const keyedFlows = {
      ...state.flows,
    };
    if (action.flow.form) {
      if (action.flow.oldForm && keyedFlows[action.flow.oldForm]) {
        delete keyedFlows[action.flow.oldForm];
      }
      if (!keyedFlows[action.flow.form]) {
        keyedFlows[action.flow.form] = {};
      }

      keyedFlows[action.flow.form] = {
        ...action.flow,
      };
    }
    return {
      ...state,
      flows: {
        ...keyedFlows,
      },
    };
  }

  case DELETE_FLOW: {
    const flows = {
      ...state.flows,
    };
    if (action.flowName) {
      delete flows[action.flowName];
    }

    const flowKeys = Object.keys(flows);
    const prevFlow = flows[flowKeys[flowKeys.length - 1]];

    return {
      ...state,
      flows: {
        ...flows,
      },
      flow: prevFlow ? {
        flowName: prevFlow.form,
        status: true,
      } : {},
    };
  }

  default:
    return state;
  }
}
