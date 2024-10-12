import Vue from 'vue'
import Buefy from 'buefy'

import 'buefy/dist/buefy.css'
import App from './App.vue'
import numeral from 'numeral'
import VueApexCharts from 'vue-apexcharts'

Vue.use(Buefy)

Vue.use(VueApexCharts)

Vue.component('apex-chart', VueApexCharts)
Vue.config.productionTip = false

Vue.filter("money", function (value) {
  return numeral(value).format("0,0"); // displaying other groupings/separators is possible, look at the docs
});



new Vue({
  render: h => h(App),
}).$mount('#app')
 