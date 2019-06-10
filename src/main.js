import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex';
import rootStore from './store/index';
import widgets from './widgets/index.js';
import filter from './script/filter.js';

import global from './style/global.scss';
import fonts from './style/fonts.scss';
import icon from './style/icon.scss';


Vue.use(Vuex);
Vue.use(widgets);
Vue.use(filter);
const store = new Vuex.Store(rootStore);
window.p = new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
console.log('created 2019-6-10 17:11');
