import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

// create an axios instance
const service = axios.create({
  baseURL: 'http://158.247.198.68',
  timeout: 5000 // request timeout
});

export default service