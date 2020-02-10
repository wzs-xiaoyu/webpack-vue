<!--用户管理页-->
<template>
  <div class="user-manage">
    <div class="userquery">
      <div class="userquery-item">
        <span class="userquery-label">用户名称：</span>
        <Input type="text" v-model="userName" placeholder="请输入用户名称" @on-change="selectUserByName" clearable />
      </div>
    </div>
    <div class="user-table-header">
      <Button type="primary" v-if="userInfo.admin" class="btn-margin" @click="userAddForm"><Icon type="ios-add" size="2px" />新增</Button>
      <Button type="primary" v-else class="btn-margin" @click="userAddForm"><Icon type="ios-add" size="2px" />新增</Button>
    </div>
    <div class="user-table">
      <Table border :columns="userColumns" :data="userList"> </Table>
    </div>
    <Modal class-name="adduser-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
      <p>{{ modalError.content }}</p>
    </Modal>
    <add-user ref="adduser" v-bind:modalAddUserForm="modalAddUserForm"></add-user>
    <update-user ref="updateuser" v-bind:modalUpdateUserForm="modalUpdateUserForm" v-bind:updateUserFormData="userDetialInfo"></update-user>
  </div>
</template>
<script>
import AddUser from "./AddUser.vue";
import UpdateUser from "./UpdateUser.vue";
export default {
  name: "UserManage",
  components: {
    AddUser: AddUser,
    UpdateUser: UpdateUser
  },
  data() {
    return {
      userName: "",
      userInfo: {},
      userList: [],
      userColumns: [
        {
          title: "登录名",
          key: "name",
          align: "center"
        },
        {
          title: "用户名",
          key: "userName",
          align: "center"
        },
        {
          title: "联系电话",
          key: "tel",
          align: "center"
        },
        {
          title: "联系地址",
          key: "address",
          align: "center"
        },
        {
          title: "邮箱",
          key: "email",
          align: "center"
        },
        {
          title: "是否停用",
          key: "isStop",
          align: "center",
          render: (h, params) => {
            return h("div", [params.row.isStop === false ? "否" : "是"]);
          }
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
                      this.updateUserInfo(params.row);
                    }
                  }
                },
                "编辑"
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
                      this.deleteUserInfo(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      modalAddUserForm: {
        show: false,
        title: ""
      },
      modalUpdateUserForm: {
        show: false,
        title: ""
      },
      modalError: {
        show: false,
        title: "",
        content: ""
      },
      userDetialInfo: {}
    };
  },
  methods: {
    userAddForm() {
      this.modalAddUserForm = {
        show: true,
        title: "新增用户",
        content: `<input v-model="aaaa" />`
      };
      this.$refs.adduser.getUnitList();
      this.$refs.adduser.getRoleList();
    },
    selectUserByName() {
      let params = {
        userName: this.userName
      };
      this.$http
        .get("/api/users/user", { params: params })
        .then(suc => {
          if (suc.data.success) {
            this.userList = suc.data.data.reverse();
          } else {
            this.$Message.error(suc.data.message);
            throw new Error(suc.data.message);
          }
        })
        .catch(err => {
          console.error("条件请求用户信息列表", err);
        });
    },
    updateUserInfo(user) {
      this.userDetialInfo = user;
      this.modalUpdateUserForm = {
        show: true,
        title: "修改用户信息",
        content: `<input v-modal="aaaa"/>`
      };
      this.$refs.updateuser.getUnitList();
      this.$refs.updateuser.getRoleList();
    },
    deleteUserInfo(user) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "<p>是否删除选中的用户【" + user.name + "】</p>",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          let params = {
            _id: user._id
          };
          this.$http
            .delete("/api/users/user", { params: params })
            .then(suc => {
              if (suc.data.success) {
                this.$Message.info("用户删除成功！");
                this.getUserInfoList();
                return;
              }
              throw new Error(suc.data.message);
            })
            .catch(err => {
              this.modalError = {
                show: true,
                title: "用户删除失败！",
                content: `${err}`
              };
            });
        }
      });
    },
    getUserInfoList() {
      this.$http
        .get("/api/users/user")
        .then(suc => {
          if (suc.data.success) {
            this.userList = suc.data.data.reverse();
          } else {
            this.$Message.error(suc.data.message);
            throw new Error(suc.data.message);
          }
        })
        .catch(err => {
          console.error("请求用户信息列表", err);
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
    this.getUserInfoList();
  },
  deactivated() {
    // 清除查询条件
    this.userName = "";
  }
};
</script>
<style>
.user-manage {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  overflow: auto;
  background: #f8f8f8;
  padding: 0.2rem;
  border: 1px solid #eee;
}
.userquery {
  display: flex;
  justify-content: flex-end;
  text-align: center;
  width: 100%;
  margin: 0rem 0rem 0.1rem 0rem;
}
.userquery-item {
  display: flex;
  width: 24%;
  height: 100%;
  align-items: center;
}
.userquery-label {
  width: 40%;
  display: flex;
  align-items: center;
}
.user-table-header {
  margin: 0.2rem 0rem;
  width: 100%;
  height: 1rem;
}
.user-table {
  margin-bottom: 14px;
}
.adduser-modal-err .ivu-modal-header,
.adduser-modal-err .ivu-modal-footer {
  border: none;
}
.btn-margin {
  margin-right: 6px;
}
</style>
