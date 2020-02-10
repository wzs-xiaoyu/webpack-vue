import VersionAdmin from "./VersionAdmin.vue";
import ConfigAdmin from "./ConfigAdmin.vue";
import Project from "./Project.vue";

export default {
  path: "/",
  name: "项目管理",
  redirect: "version",
  mark: "",
  symbol: "",
  component: Project,
  children: [
    {
      path: "version",
      name: "版本",
      mark: "",
      symbol: "",
      component: VersionAdmin
    },
    {
      path: "config",
      name: "内容",
      mark: "",
      symbol: "",
      component: ConfigAdmin
    },
    {
      path: "configschema",
      name: "内容模板",
      mark: "",
      symbol: "",
      component: () => import(/* webpackChunkName: "ConfigSchemaAdmin" */ "./ConfigSchemaAdmin.vue")
    }
  ]
};
