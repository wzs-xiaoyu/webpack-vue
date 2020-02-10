<!--静态资源路由操作-->
<template>
  <div class="static-resource-nav">
    <Menu mode="horizontal" theme="dark" :active-name="activeTabName">
      <MenuItem v-for="item in tabs" :key="item.link" :name="item.link" :to="item.link" :title="item.mark">
        <Icon :type="item.symbol" />
        {{ item.name }}
      </MenuItem>
    </Menu>
  </div>
</template>
<script>
import routes from "./routerStaticResource.js";
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
<style>
.static-resource-nav {
  border-radius: 0.05rem;
  overflow: hidden;
}
.static-resource-nav .ivu-menu-item {
  font-size: 0.2rem;
}
</style>
