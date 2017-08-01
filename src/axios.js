/**
 * axios  http请求组件封装
 *
 **/

import axios from 'axios'
import iView from 'iview'

/**
 *  axios  request请求配置
 **/

axios.defaults.baseURL = 'http://101.200.48.138/api'
axios.defaults.headers['Content-Type'] = 'application/json;UTF-8'


/**
 *  配置请求拦截器
 *
 **/

axios.interceptors.request.use(
  config => {
    
    //判断本地授权信息  oath
    let oauth = localStorage.getItem('oauth');
    if (oauth) {
      config.headers.oauth = oauth;
    }
    return config;
  }, error=> {
    return Promise.reject(error);
  })

/**
 * 配置 返回拦截器
 *
 */

axios.interceptors.response.use(
  response => {
    if (response.error) {
      var code = response.data.error.code;
      if (code == 'need_token' || code == 'login_timeout' || code == 'token_error') {
      }
    }
    return response.data
  },
  error=> {
    if (error.response) {
      switch (error.response.status) {
        case 500:
          iView.Message.error('服务器异常', 3, null)
          break;
      }
    }
    return Promise.reject(error.response);
  }
)
export default  axios
