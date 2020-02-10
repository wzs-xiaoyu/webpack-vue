/* 项目管理 */
<template>
  <div class="Project">
    <projectMenu></projectMenu>
    <div class="Project-admin">
      <div>
        <div class="project-admin-title">
          <h1 class="project-admin-proname">{{ curProject.name }}</h1>
          <p class="project-admin-create">
            <span class="project-admin-descript">
              <Icon type="ios-text" />
              <i class="project-admin-descript-text">{{ curProject.remarks }}</i>
            </span>
            <span>
              <Icon type="ios-person" />
              {{ curProject.createUser }}
            </span>
            <span>
              <Icon type="md-time" />
              {{ curProject.createTime }}
            </span>
            <!-- <a :href="curProject.url" target="blank">
              <Icon type="ios-link" />
              {{ curProject.url }}
            </a> -->
            <a :href="'../' + curProject.name" target="blank">
              <Icon type="ios-link" />
              {{ "../" + curProject.name }}
            </a>
            <a :href="curProject.gitPath" target="blank">
              <Icon type="md-git-network" />
              {{ curProject.gitPath }}
            </a>
          </p>
        </div>
      </div>
      <projectNav></projectNav>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import projectNav from "./projectNav.vue";
import projectMenu from "./projectMenu.vue";
import { mapState, mapMutations } from "./storeProject.js";
export default {
  name: "Project",
  components: { projectNav, projectMenu },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState({ projectNameSelected: "projectNameSelected", curProject: "curProject" })
  },
  watch: {
    projectNameSelected() {
      this.getProjectDetail(this.projectNameSelected);
    }
  },
  methods: {
    ...mapMutations({
      projectNameSelectedChange: "projectNameSelectedChange",
      curProjectChange: "curProjectChange"
    }),
    getProjectDetail(name) {
      this.$http
        .get("/api/static/item", { params: { name: name } })
        .then(suc => {
          this.$Spin.hide();
          if (!suc.data.success) {
            throw new Error(suc.data.messsage);
          }
          this.curProjectChange(suc.data.data[0]);
        })
        .catch(err => {
          console.error(err);
          this.$Spin.hide();
        });
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
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
.Project {
  display: flex;
  height: 100%;
}

.Project-admin {
  max-height: 100%;
  background: #f8f8f8;
  overflow: auto;
  flex-grow: 1;
  margin: 0.1rem;
  padding: 0.2rem;
  border: 1px solid #eee;
}
.project-admin-title {
  display: flex;
}

.project-admin-proname {
  white-space: nowrap;
  padding-left: 0.1rem;
  padding-bottom: 0.06rem;
  font-size: 0.5rem;
  line-height: 1;
}
.project-admin-create {
  align-self: flex-end;
  font-size: 0.15rem;
  padding-right: 20px;
  margin-bottom: 0.08rem;
}
.project-admin-create > * {
  display: inline-flex;
  align-items: center;
  color: #515a6e;
}
.project-admin-create .ivu-icon {
  margin: 0 3px 0 20px;
}
.project-admin-url {
  align-self: flex-end;
  font-size: 0.5em;
}
.project-admin-descript-text {
  display: inline-block;
  max-width: 12rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-style: normal;
}
.project-admin-create .ivu-icon {
  color: #57a3f3;
}

body .ivu-spin-fix {
  background: transparent;
}
</style>
