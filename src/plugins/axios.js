import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

// create an axios instance
const service = axios.create({
  baseURL: 'http://odin-tracker.kr',
  timeout: 5000 // request timeout
});

export default service