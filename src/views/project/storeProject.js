import Store from "../../utils/Store.js";
export const { mapActions, mapGetters, mapMutations, mapState } = new Store({
  namespaced: true,
  state: {
    curProject: {
      // createTime: "2019-05-06 16:54:47",
      // createUser: "admin",
      // editTime: "2019-05-06 18:47:38",
      // gitPath: "https://gitee.com/gis_development/AGCP-AB.git",
      // name: "AGCP-AB",
      // publishUser: "admin",
      // remarks: "安泰得GIS云平台应用构建器",
      // url: "http://172.16.1.99:9088/AGCP-AB",
      // version: "20190506184549372"
    },
    projectNameSelected: ""
  },
  mutations: {
    curProjectChange(state, data) {
      state.curProject = data;
    },
    projectNameSelectedChange(state, data) {
      state.projectNameSelected = data;
    }
  },
  actions: {}
});
