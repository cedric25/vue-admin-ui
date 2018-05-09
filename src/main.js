import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
import App from './App.vue'

Vue.config.productionTip = false

Vue.component(Buefy.Input.name, Buefy.Input)
Vue.component(Buefy.RadioButton.name, Buefy.RadioButton)
Vue.component(Buefy.Field.name, Buefy.Field)

new Vue({
  render: h => h(App)
}).$mount('#app')
