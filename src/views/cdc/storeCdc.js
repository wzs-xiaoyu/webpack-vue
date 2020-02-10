import Store from "../../utils/Store.js";
import $http from "axios";
export const { mapActions, mapGetters, mapMutations, mapState } = new Store({
  namespaced: true,
  state: {
    projectServerData: {},
    projectNameSelected: ""
  },
  mutations: {
    projectServerDataChange: (state, data) => {
      let result = {};
      Object.keys(data).forEach(key => {
        let cdata = data[key];
        result[key] = Object.keys(cdata).map(ckey => {
          let ccdata = cdata[ckey];
          return { name: ckey, ...ccdata };
        });
        result[key] = result[key].reverse();
      });
      state.projectServerData = result;
    },
    projectNameSelectedChange(state, data) {
      state.projectNameSelected = data;
    },
    serverStatusSwitch(state, data) {
      state.projectServerData[state.projectNameSelected][data.index].isStop = data.isStop;
    }
  },
  getters: {
    curProjectServerData: state => {
      return state.projectServerData[state.projectNameSelected] || [];
    }
  },
  actions: {
    projectServerDataRefresh({ state, commit, rootState }) {
      return $http.get("/api/CDC").then(
        suc => {
          if (suc.data.statusCode === 403) {
            window.$AGCP.bus.once(window.$AGCP.events.logined, () => {
              window.location.reload();
            });
          }
          if (!suc.data.success) throw new Error(suc.data.message);
          commit("projectServerDataChange", suc.data.data);
        },
        err => {
          console.error("请求cdc项目列表", err);
          alert("网络或服务错误！");
        }
      );
    }
  }
});
