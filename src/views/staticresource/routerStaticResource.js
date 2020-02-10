import StaticResource from "./StaticResource.vue";
import StaticResourceManage from "./StaticResourceManage.vue";

export default {
  path: "/static",
  name: "静态资源管理",
  redirect: "/static/resource",
  mark: "",
  symbol: "",
  component: StaticResource,
  children: [
    {
      path: "resource",
      name: "内容",
      mark: "",
      symbol: "",
      component: StaticResourceManage
    }
  ]
};
