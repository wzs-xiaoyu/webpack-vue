<!--用户管理模块Menu-->
<template>
  <div class="user-management">
    <div class="user-management-menu">
      <Menu theme="dark" :active-name="activeMenu">
        <MenuGroup :title="group.title" v-for="group in menus" :key="group.title">
          <MenuItem :name="item.path" v-for="item in group.children || []" :to="item.path" :key="item.path">
            <Icon :type="item.symbol" />
            {{ item.name }}
          </MenuItem>
        </MenuGroup>
      </Menu>
    </div>
    <div class="user-management-content">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>
<script>
import routerUser from "./routerUser.js";
import { setTimeout } from "timers";

export default {
  name: "UserManagement",
  data() {
    return {
      menus: [
        {
          title: "单位",
          children: [{ path: "unit" }]
        },
        {
          title: "用户",
          children: [{ path: "user" }]
        },
        {
          title: "角色",
          children: [{ path: "role" }]
        }
      ]
    };
  },
  computed: {
    activeMenu() {
      let result = "";
      this.menus.forEach(group => {
        group.children.forEach(item => {
          if (this.$route.fullPath.indexOf(item.path) < 0) return;
          result = item.path;
        });
      });
      return result;
    }
  },
  created() {
    this.menus.forEach(group => {
      group.children = group.children.map(item => routerUser.children.find(route => route.path === item.path));
    });
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
<style lang="less">
.user-management {
  display: flex;
  height: 100%;
  .user-management-menu {
    height: 100%;
    background: #515a6e;
  }
  .user-management-content {
    width: 100%;
    margin: 0.1rem;
  }
}
</style>
