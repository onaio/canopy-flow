import { parseCSV } from './../../helpers/utils';
import { fetchFormsError } from '../../store/actions';

// Map of ONA API Endpoints
var apiMap = {
  user: 'https://api.ona.io/api/v1/user',
  forms: 'https://api.ona.io/api/v1/forms',
  data: 'https://api.ona.io/api/v1/data',
};

// Generate Headers for API Fetch
var apiHeaders = (config) => {
  const headers = new Headers();

  if (config && config.mimeType) headers.append('Content-Type', config.mimeType);
  if (!config || !config.token) return headers;

  headers.append('Authorization', `Bearer ${config.token}`)
  return headers;
};

// Generate Request for API Fetch
var apiRequest = (config, headers) => {
  const reqConfig = { method: config.method || 'GET' };
  if (headers) reqConfig.headers = headers;

  let apiPath = apiMap[config.endpoint];
  if (config.extraPath) apiPath = `${apiPath}/${config.extraPath}`;
  if (config.params) apiPath = `${apiPath}?${config.params}`;

  return new Request(apiPath, reqConfig)
};

// Generate API Fetch Promise
const fetchAPI = (config) => {
  return fetch(apiRequest(config, apiHeaders(config)));
};

// Resolve API Fetch Promise, convert to JSON, handle with callback/resolve as JSON
// config          - (required) Object contaig options / credentials
// config.token    - (required) Access_Token provided by ONA Authorization
// config.endpoint - (required) API Key to determine API Path
// config.method   - (optional) Specify HTTP Method (defaults to GET)
// config.params   - (optional) Additional parameters to be appeneded to API Path
// config.mimeType - (optional) Specify mimeType for Request Headers
// callback        - (optional) Function to take JSON response, otherwise res is simply returned
export default (config, callback) => callback
  ? fetchAPI(config).then(res => res.json().then(user => ({ user, res }))).then(callback)
  : fetchAPI(config).then(res => res.json().then(user => ({ user, res }))).then(({user, res}) => ({ user, res }));

  export const apiFetch = async (config, callback) => fetchAPI(config).then((res) => {
    if (!res.ok) {
      const { dispatch } = config;
      if (dispatch && (config.endpoint === 'forms' || config.endpoint === 'data')) {
        dispatch(fetchFormsError(`Failed To Fetch data, status ${res.status}`))
      }
      throw new Error(
        `Request failed, HTTP status ${res.status}`
      );
    } else {
      // Define response parse method
      let parse;
      switch (config.mimeType) {
        case 'text/csv':
          parse = 'text';
          break;
        case 'image/jpeg':
          parse = 'blob';
          break;
        default:
          parse = 'json';
      }

      // Return parsed Response
      // todo - Change "user" to "body"
      return res[parse]().then((parsed) => {
        // if parsed text is CSV then return Papaparse via parseCSV
        if (config.mimeType === 'text/csv') return { user: parseCSV(parsed) };
        return parsed;
      }).catch((e) => console.error("Error: ", e));
    }
  }).then((callback || (user => user))).catch((e) => console.error("Error: ", e));

  export class API {
    constructor() {
      this.apiHeaders = apiHeaders;
      this.apiRequest = apiRequest;
      this.fetchAPI = fetchAPI;
      this.fetch = apiFetch;
    }
  }