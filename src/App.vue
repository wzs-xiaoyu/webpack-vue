<template>
  <div id="app" class="agcp">
    <div class="agcp-header">
      <pageheader>
        <template v-slot:nav>
          <pageheaderNav></pageheaderNav>
        </template>
      </pageheader>
    </div>
    <div class="agcp-content">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
    <agcpSign></agcpSign>
  </div>
</template>
<script>
import pageheaderNav from "./components/pageHeaderNav.vue";
export default {
  components: { pageheaderNav },
  name: "App"
};
</script>
<style>
/* 滚动条整体部分 */
body ::-webkit-scrollbar {
  width: 5px;
}
.main-content ::-webkit-scrollbar {
  width: 3px;
}
/* 滚动条里面的小方块，能向上向下移动（或向左向右移动） */
body ::-webkit-scrollbar-thumb {
  border-radius: 0 0.1rem 0.1rem 0;
  background-color: #bbb;
}
body ::-webkit-scrollbar-track {
  background: #eee;
}
</style>
