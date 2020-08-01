import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible';
import axios from 'axios'
import VueAxios from 'vue-axios'

import {Search,Toast,Circle,Progress,List,Popup,Icon,NavBar,Form,Field,Button,Swipe,SwipeItem,Grid,GridItem,Tabbar,TabbarItem,IndexBar,IndexAnchor,Cell,Overlay,Tab,Tabs,Image as VanImage  } from 'vant'

Vue.use(VueAxios, axios)
Vue.config.productionTip = false
//配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';


Vue.use(Search)
  .use(Toast)
  .use(Icon)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Button)
  .use(Swipe)
  .use(SwipeItem)
  .use(Grid)
  .use(GridItem)
  .use(Tabbar)
  .use(TabbarItem)
  .use(IndexBar)
  .use(IndexAnchor)
  .use(Cell)
  .use(Overlay)
  .use(Tab)
  .use(Tabs)
  .use(VanImage)
  .use(List)
  .use(Popup)
  .use(Progress)
  .use(Circle)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
