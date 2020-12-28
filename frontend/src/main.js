import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import App from './App'

import './config/msgs'
import './config/bootstrap'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

require('axios').defaults.headers.common['Authorization']= 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NCwibmFtZSI6Imx1Y2FzIiwiZW1haWwiOiJwcmljaUBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjA5MTU3ODE2LCJleHAiOjE2MDk0MTcwMTZ9.KgqygXJ5k8JxF2lMrtYiXEq3XSPXdPrz0D9dI8KZe1k'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')