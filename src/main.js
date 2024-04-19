import Vue from 'vue'
import App from './components/App'
import store from './js/store'
import Snotify from 'vue-snotify'
import 'vue-snotify/styles/material.css'
import Dialog from './components/Dialog'
import DialogInfo from './components/Dialog-info'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import drag from './js/drag'
import VModal from 'vue-js-modal'


Vue.use(VModal);
Vue.use(drag);
Vue.use(BootstrapVue);
Vue.component('v-dialog', Dialog);
Vue.component('v-dialog-info', DialogInfo);
Vue.use(Snotify);
Vue.config.productionTip = false;
new Vue({
    store,
    render: h => h(App)
}).$mount('#app');
