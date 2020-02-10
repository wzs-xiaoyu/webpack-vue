
import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import store from "./store";
import axios from "axios";
import iView from "iview";

import { Encrypt, Decrypt } from "./utils/AESkey.js";
import "iview/dist/styles/iview.css";
import "animate.css/animate.min.css";

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.use(iView);

//初始化公共模块
window.$AGCP.init(Vue);
Vue.component("pageheader", window.$AGCP.pageheader);
window.$AGCP.Encrypt = Encrypt;
window.$AGCP.Decrypt = Decrypt;
Vue.component("agcpSign", window.$AGCP.sign);

//路由切换 loading
router.beforeEach((to, from, next) => {
    Vue.prototype.$Loading.start();
    next();
});
router.afterEach(route => {
    Vue.prototype.$Loading.finish();
});

new Vue({
    router,
    store,
    render: h => h(App)  // App.vue
}).$mount("#app")