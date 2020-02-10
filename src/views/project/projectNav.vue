<!-- 项目管理路由操作 -->
<template>
  <div class="project-nav">
    <Menu theme="dark" mode="horizontal" :active-name="activeTabName">
      <MenuItem v-for="item in tabs" :key="item.link" :name="item.link" :to="item.link" :title="item.mark">
        <Icon :type="item.symbol" />
        {{ item.name }}
      </MenuItem>
    </Menu>
  </div>
</template>

<script>
import routes from "./routerProject.js";
export default {
  components: {},
  data() {
    return {};
  },
  computed: {
    activeTabName() {
      let curTabs = this.tabs.filter(item => this.$route.fullPath.indexOf(item.link) >= 0);
      return curTabs.length ? curTabs.pop().link : "/";
    },
    tabs() {
      return routes.children.map(item => {
        let tabItem = { name: item.name, link: item.path, mark: item.mark, symbol: item.symbol };
        return tabItem;
      });
    }
  }
};
</script>

<style lang="css">
.project-nav{
  border-radius: .05rem;
  overflow: hidden;
}
.project-nav .ivu-menu-item{
  font-size: .2rem;
}
</style>
