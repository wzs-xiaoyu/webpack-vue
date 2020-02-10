<!-- page-header -->
<template>
  <div class="page-header-nav">
    <Menu mode="horizontal" :active-name="activeTabName">
      <MenuItem
        v-for="item in tabs"
        :key="item.link"
        :name="item.link"
        :to="item.link"
        :title="item.mark"
      >
        <Icon :type="item.symbol" />
        {{ item.name }}
      </MenuItem>
    </Menu>
  </div>
</template>

<script>
import { routes } from "../router.js";
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
      return routes.map(item => {
        let tabItem = { name: item.name, link: item.path, mark: item.mark, symbol: item.symbol };
        return tabItem;
      });
    }
  }
};
</script>

<style lang="css">
.page-header-nav {
  height: 100%;
  display: inline-flex;
  width: 100%;
  align-items: center;
  margin-left: 0.5rem;
}

.page-header-nav .ivu-menu-horizontal {
  height: 100%;
  background: transparent;
}

.page-header-nav .ivu-menu-horizontal .ivu-menu-item {
  display: inline-flex;
  align-items: center;
  border-color: transparent;
  outline-color: transparent;
}
.page-header-nav .ivu-menu-horizontal.ivu-menu-light:after {
  display: none;
}
</style>
