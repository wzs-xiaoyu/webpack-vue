<!--静态资源管理-->
<template>
  <div class="static-resource">
    <static-resource-menu></static-resource-menu>
    <div class="static-resource-header">
      <div>
        <div class="static-resource-title">
          <h1 class="static-resource-proname">{{ staticResource.name }}</h1>
          <p class="static-resource-create">
            <span class="static-resource-descript">
              <Icon type="ios-text" />
              <i class="static-resource-descript-text">{{ staticResource.remarks }}</i>
            </span>
            <span>
              <Icon type="ios-person" />
              {{ staticResource.createUser }}
            </span>
            <span>
              <Icon type="md-time" />
              {{ staticResource.createTime }}
            </span>
          </p>
        </div>
      </div>
      <static-resource-nav></static-resource-nav>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import staticResourceMenu from "./staticResourceMenu.vue";
import { mapState, mapMutations } from "./storeStaticResource.js";
import staticResourceNav from "./staticResourceNav.vue";
export default {
  name: "StaticResource",
  components: {
    staticResourceMenu: staticResourceMenu,
    staticResourceNav: staticResourceNav
  },
  data() {
    return {
      msg: "静态资源管理"
    };
  },
  computed: {
    ...mapState({ staticResourceNameSelected: "staticResourceNameSelected", staticResource: "staticResource" })
  },
  watch: {
    staticResourceNameSelected() {
      this.getStaticResourceDetail(this.staticResourceNameSelected);
    }
  },
  methods: {
    ...mapMutations({
      staticResourceNameSelectedChange: "staticResourceNameSelectedChange",
      staticResourceChange: "staticResourceChange"
    }),
    getStaticResourceDetail(name) {
      if (name == "undefined") {
        this.staticResourceChange({});
      } else {
        this.$http
          .get("/api/resource/item", { params: { _id: name } })
          .then(suc => {
            this.$Spin.hide();
            if (!suc.data.success) {
              throw new Error(suc.data.messsage);
            }
            this.staticResourceChange(suc.data.data);
          })
          .catch(err => {
            console.error(err);
            this.$Spin.hide();
          });
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!window.$AGCP.store.userInfo.name) {
      setTimeout(() => {
        window.$AGCP.bus.emit(window.$AGCP.events.sign, true, { noClose: true });
        window.$AGCP.bus.once(window.$AGCP.events.logined, (userInfo, status) => {
          status && location.reload();
        });
      }, 0);
      return;
    }
    next();
  }
};
</script>
<style>
.static-resource {
  display: flex;
  height: 100%;
  padding-top: 3px;
}
.static-resource-header {
  max-height: 100%;
  background: #f8f8f8;
  overflow: auto;
  flex-grow: 1;
  margin: 0.1rem;
  padding: 0.2rem;
  border: 1px solid #eee;
}
.static-resource-title {
  display: flex;
}

.static-resource-proname {
  white-space: nowrap;
  padding-left: 0.1rem;
}
.static-resource-create {
  align-self: flex-end;
  font-size: 0.15rem;
  padding-right: 20px;
  margin-bottom: 0.08rem;
}
.static-resource-create > * {
  display: inline-flex;
  align-items: center;
  color: #515a6e;
}
.static-resource-create .ivu-icon {
  margin: 0 3px 0 20px;
}
.static-resource-create .ivu-icon {
  color: #57a3f3;
}
.static-resource-url {
  align-self: flex-end;
  font-size: 0.5em;
}
.static-resource-descript-text {
  display: inline-block;
  max-width: 12rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-style: normal;
}
body .ivu-spin-fix {
  background: tran;
}
</style>
