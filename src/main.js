import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false

// js-cookie is a cookie manager.
import jsCookie from 'js-cookie'
Vue.prototype.$jsCookie = jsCookie

// TDesign is a design framework.
import TDesign from 'tdesign-vue';
import 'tdesign-vue/es/style/index.css';
Vue.use(TDesign);


// EzDeployApiserver is a restful api client.
import EzDeployApiserver  from 'ez_deploy_apiserver'

Vue.prototype.$baseAPIClient = new EzDeployApiserver.ApiClient()
Vue.prototype.$baseAPIClient.basePath = "http://localhost:8888/api"
Vue.prototype.$baseAPIClient.enableCookies = true

Vue.prototype.$identityClient = new EzDeployApiserver.IdentityApi()
Vue.prototype.$identityClient.apiClient = Vue.prototype.$baseAPIClient

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
