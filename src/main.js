import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import router from './router'
import iView from 'iview'
import Vuex from 'vuex'
import  axios from './axios'
import VueQuillEditor from 'vue-quill-editor'
import 'iview/dist/styles/iview.css'


/**
 * 该参数指定 环境为生产或者 测试
 * @type {boolean}
 */
Vue.config.productionTip = false

/**
 * 将axios绑定到系统$http属性上
 *
 */
Vue.prototype.$http = axios
Vue.use(VueQuillEditor)
Vue.use(iView)
Vue.use(VueRouter)
Vue.use(Vuex)
new Vue({
  el: '#app',
  router,
  axios,
  template: '<App/>',
  components: {App}
})
