import Vue from "vue";
import Router from "vue-router";
// 项目管理
import routerProject from "./views/project/routerProject.js";
// 静态资源管理
import routerStaticResource from "./views/staticresource/routerStaticResource.js";
// //用户管理
import routerUser from "./views/usermanager/routerUser.js";
// cdc
import routerCdc from "./views/cdc/routerCdc.js";
Vue.use(Router);
// export const routes = [routerProject, routerStaticResource, routerUser, routerCdc];
export const routes = [routerProject, routerStaticResource,routerUser,routerCdc];
export default new Router({
  routes: routes
});
