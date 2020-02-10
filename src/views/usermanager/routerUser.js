import UserManagement from "./UserManagement.vue";
import UnitManage from "./unit/UnitManage.vue";
import UserManage from "./user/UserManage.vue";
import RoleManage from "./role/RoleManage.vue";
export default {
  path: "/um",
  name: "用户管理",
  redirect: "/um/unit",
  component: UserManagement,
  children: [
    {
      path: "unit",
      name: "单位管理",
      mark: "",
      symbol: "",
      component: UnitManage
    },
    {
      path: "user",
      name: "用户管理",
      mark: "",
      symbol: "",
      component: UserManage
    },
    {
      path: "role",
      name: "角色管理",
      mark: "",
      symbol: "",
      component: RoleManage
    }
  ]
};
