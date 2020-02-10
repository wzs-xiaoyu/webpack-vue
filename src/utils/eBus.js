import Vue from "vue";
import axios from "axios";
const bus = new Vue();
export const eBus = {
  on() {
    return bus.$on(...arguments);
  },
  emit() {
    return bus.$emit(...arguments);
  },
  remove() {
    return bus.$off(...arguments);
  },
  once() {
    return bus.$once(...arguments);
  }
};

export const agcpEvents = {
  /**
   * 登录注册的弹框事件，调用此事件可以操控弹框的显示隐藏
   *@param {Boolean} isShow  显示或隐藏
   */
  sign: "showSign",
  /**
   * 用户登录事件，在用户登录后会触发
   * @param {Object} userInfo  用户信息
   * *@detail { name:"",password:"",department:"部门" }
   * @param {Boolean} status  登录成功还是失败
   */
  logined: "logined"
};

export const store = {
  userInfo: {
    token: "",
    name: "",
    password: "",
    unit: "",
    admin: ""
  }
};
let userInfoLocal = JSON.parse(localStorage.getItem("userInfo"));
if (userInfoLocal && userInfoLocal.name) {
  store.userInfo = userInfoLocal;
  axios.defaults.headers.common["Authorization"] = userInfoLocal.token;
}

eBus.on(agcpEvents.logined, (userInfo, status) => {
  if (!status) return;
  axios.defaults.headers.common["Authorization"] = userInfo.token;
  store.userInfo.token = userInfo.token || store.userInfo.token;
  store.userInfo.name = userInfo.name || store.userInfo.name;
  store.userInfo.password = userInfo.password || store.userInfo.password;
  store.userInfo.unit = userInfo.unit || store.userInfo.unit;
  store.userInfo.admin = userInfo.admin;
  store.userInfo.key = userInfo.key;
  localStorage.setItem("userInfo", JSON.stringify(store.userInfo));
});
