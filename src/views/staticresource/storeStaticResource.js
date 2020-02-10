import Store from "../../utils/Store.js";
export const { mapActions, mapGetters, mapMutations, mapState } = new Store({
  namespaced: true,
  state: {
    staticResource: {
      // createTime: "2019-05-28 16:54:47",
      // createUser: "admin",
      // name: "文件夹4",
      // remarks: "静态资源管理",
      // url: "http://172.16.1.99/AGCP-AB/"
    },
    staticResourceNameSelected: ""
  },
  mutations: {
    staticResourceChange(state, data) {
      state.staticResource = data;
    },
    staticResourceNameSelectedChange(state, data) {
      state.staticResourceNameSelected = data;
    }
  },
  actions: {}
});
