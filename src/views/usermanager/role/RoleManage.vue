<!--角色管理-->
<template>
  <div class="role-manage">
    <div class="rolequery">
      <div class="rolequery-item">
        <span class="rolequery-label">角色名称：</span>
        <Input type="text" v-model="roleName" placeholder="请输入名称关键字" @on-change="selectRoleByName" clearable />
      </div>
    </div>
    <div class="role-table-header">
      <Button type="primary" v-if="userInfo.admin" class="btn-margin" @click="roleAddForm"><Icon type="ios-add" size="2px" />新增</Button>
      <Button type="primary" v-else class="btn-margin" @click="roleAddForm"><Icon type="ios-add" size="2px" />新增</Button>
      <Button type="primary" v-if="userInfo.admin" @click="deleteRoleInfo">删除</Button>
      <Button type="primary" v-else @click="deleteRoleInfo">删除</Button>
    </div>
    <div class="role-table">
      <Table border :columns="roleColumns" :data="roleList" @on-selection-change="changSelectRole"></Table>
    </div>
    <Modal class-name="addrole-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
      <p>{{ modalError.content }}</p>
    </Modal>
    <add-role v-bind:modalAddRoleForm="modalAddRoleForm"></add-role>
    <update-role v-bind:modalUpdateRoleForm="modalUpdateRoleForm" v-bind:updateRoleFormData="roleInfo"></update-role>
    <edit-competence ref="rolepower" v-bind:modalRoleCompetenceForm="modalRoleCompetenceForm" v-bind:roleCompetence="roleCompetence"></edit-competence>
  </div>
</template>
<script>
import AddRole from "./AddRole.vue";
import UpdateRole from "./UpdateRole.vue";
import EditCompetence from "./EditCompetence.vue";
export default {
  name: "RoleManage",
  components: {
    AddRole: AddRole,
    UpdateRole: UpdateRole,
    EditCompetence: EditCompetence
  },
  data() {
    return {
      roleName: "",
      userInfo: {},
      roleList: [],
      roleColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "分组名称",
          key: "roleName",
          align: "center"
        },
        {
          title: "英文名称",
          key: "englishName",
          align: "center"
        },
        {
          title: "缩写",
          key: "abbrName",
          align: "center"
        },
        {
          title: "描述",
          key: "remark",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editCompetence(params.row);
                    }
                  }
                },
                "权限"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.updateRoleInfo(params.row);
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ],
      modalAddRoleForm: {
        show: false,
        title: ""
      },
      modalUpdateRoleForm: {
        show: false,
        title: ""
      },
      modalError: {
        show: false,
        title: "",
        content: ""
      },
      roleInfo: {},
      roleCompetence: {},
      modalRoleCompetenceForm: {
        show: false,
        title: ""
      },
      selection: [] //批量操作数组
    };
  },
  methods: {
    roleAddForm() {
      this.modalAddRoleForm = {
        show: true,
        title: "新增角色",
        content: `<input v-model="aaaa" />`
      };
    },
    selectRoleByName() {
      let params = {
        roleName: this.roleName
      };
      this.$http
        .get("/api/users/role", { params: params })
        .then(suc => {
          if (suc.data.success) {
            this.roleList = suc.data.data.reverse();
          } else {
            this.$Message.error(suc.data.message);
            throw new Error(suc.data.message);
          }
        })
        .catch(err => {
          console.error("条件请求角色信息列表", err);
        });
    },
    updateRoleInfo(role) {
      this.roleInfo = role;
      this.modalUpdateRoleForm = {
        show: true,
        title: "修改角色信息",
        content: `<input v-modal="aaaa"/>`
      };
    },
    editCompetence(role) {
      this.roleCompetence = role;
      this.modalRoleCompetenceForm = {
        show: true,
        title: "编辑权限",
        content: `<input v-modal="aaaa"/>`
      };
      this.$refs.rolepower.getRoleCompetenceList(role._id);
    },
    changSelectRole(selection) {
      let arr = [];
      for (var i = 0; i < selection.length; i++) {
        arr.push(selection[i]._id);
      }
      this.selection = arr;
    },
    deleteRoleInfo() {
      if (this.selection.length != 0) {
        this.$Modal.confirm({
          title: "删除确认",
          content: "<p>是否删除选中角色吗？</p>",
          okText: "确定",
          cancelText: "取消",
          onOk: () => {
            let params = {
              _id: []
            };
            params._id = this.selection;
            this.$http
              .delete("/api/users/role", { params: params })
              .then(suc => {
                if (suc.data.success && suc.data.message == "删除成功！") {
                  this.$Message.info("角色删除成功！");
                  this.getRoleInfoList();
                  return;
                }
                throw new Error(suc.data.message);
              })
              .catch(err => {
                this.modalError = {
                  show: true,
                  title: "角色删除失败！",
                  content: `${err}`
                };
              });
          }
        });
      } else {
        this.$Message.info("请选择需要删除的角色！");
      }
    },
    getRoleInfoList() {
      this.$http
        .get("/api/users/role")
        .then(suc => {
          if (suc.data.success) {
            this.roleList = suc.data.data.reverse();
          } else {
            this.$Message.error(suc.data.message);
            throw new Error(suc.data.message);
          }
        })
        .catch(err => {
          console.error("请求角色信息列表", err);
        });
    }
  },
  mounted() {
    this.userInfo = window.$AGCP.store.userInfo;
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
  },
  activated() {
    this.getRoleInfoList();
  },
  deactivated() {
    // 清除查询条件
    this.roleName = "";
  }
};
</script>
<style>
.role-manage {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  overflow: auto;
  background: #f8f8f8;
  padding: 0.2rem;
  border: 1px solid #eee;
}

.rolequery {
  display: flex;
  justify-content: flex-end;
  text-align: center;
  width: 100%;
  margin: 0rem 0rem 0.1rem 0rem;
}
.rolequery-item {
  display: flex;
  width: 24%;
  align-items: center;
  height: 100%;
}
.rolequery-label {
  width: 40%;
  display: flex;
  align-items: center;
}
.role-table-header {
  margin: 0.2rem 0rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0.2rem 0rem;
}
.role-table {
  width: 100%;
  /* margin: 0.2rem 0rem; */
}
.addrole-modal-err .ivu-modal-header,
.addrole-modal-err .ivu-modal-footer {
  border: none;
}
.btn-margin {
  margin-right: 6px;
}
</style>
