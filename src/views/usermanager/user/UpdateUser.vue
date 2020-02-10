<!--用户信息编辑页-->
<template>
  <div class="update-user">
    <Modal class="update-user-modal" v-model="modalUpdateUserForm.show" :title="modalUpdateUserForm.title" width="640px" ok-text="修改" @on-ok="updateUserInfo">
      <div>
        <Form ref="formValidate" :model="updateUserFormData" :label-width="90" label-position="left" :rules="ruleValidate">
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="登录名" prop="name">
                <Input type="text" clearable v-model="updateUserFormData.name" placeholder="请以输入登录名" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="密码" prop="password">
                <Input type="password" clearable v-model="updateUserFormData.password" placeholder="请以输入密码" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="用户名" prop="userName">
                <Input type="text" clearable v-model="updateUserFormData.userName" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="联系电话" prop="tel">
                <Input type="text" clearable v-model="updateUserFormData.tel" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="邮箱" prop="email">
                <Input type="text" clearable v-model="updateUserFormData.email" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="联系地址" prop="address">
                <Input type="text" clearable v-model="updateUserFormData.address" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="隶属角色" prop="role">
                <!-- <Input type="text" clearable v-model="updateUserFormData.role" /> -->
                <selectRole ref="selectrole" placeholder="请选择角色" @select-role="selectRole" v-bind:selecteddata="updateUserFormData.roleId"></selectRole>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="隶属单位" prop="unitId">
                <selectUnit ref="selectunit" placeholder="请选择单位" @select-unit="selectUnit" v-bind:selecteddata="updateUserFormData.unitId"></selectUnit>
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="是否停用" prop="isStop">
                <!-- <Checkbox v-model="updateUserFormData.isStop" /> -->
                <i-switch v-model="updateUserFormData.isStop" @on-change="isStartUsing">
                  <span slot="open">是</span>
                  <span slot="close">否</span>
                </i-switch>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
    </Modal>
    <Modal class-name="updateuser-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
      <p>{{ modalError.content }}</p>
    </Modal>
  </div>
</template>
<script>
const validatePhone = (rule, value, callback) => {
  if (typeof value == "undefined" || value == null || value == "") {
    callback();
  } else if (!/^1[34578]\d{9}$/.test(value)) {
    callback("手机号格式不正确");
  } else {
    callback();
  }
};
import { Encrypt } from "../../../utils/AESkey.js";
import selectRole from "../../../components/selectRole.vue";
import selectUnit from "../../../components/selectUnit.vue";
export default {
  name: "UpdateUser",
  props: ["modalUpdateUserForm", "updateUserFormData"],
  components: {
    selectRole: selectRole,
    selectUnit: selectUnit
  },
  data() {
    return {
      modalError: {
        show: false,
        title: "",
        content: ""
      },
      ruleValidate: {
        name: [{ required: true, message: "登录名必填" }],
        password: [{ required: true, message: "密码必填" }],
        email: [{ required: false, type: "email", message: "邮格式不正确" }],
        tel: [{ required: false, validator: validatePhone }]
      }
    };
  },
  methods: {
    isEmpty(obj) {
      if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
      } else {
        return false;
      }
    },
    updateUserInfo() {
      if (this.isEmpty(this.updateUserFormData.name) && this.isEmpty(this.updateUserFormData.password)) {
        this.$Message.info("登录名和密码必填且不能为空！");
      } else {
        let password = Encrypt(this.updateUserFormData.password);
        let UserInfo = { ...this.updateUserFormData, password: password };
        this.$http
          .put("/api/users/user", UserInfo)
          .then(suc => {
            if (suc.data.success) {
              this.$parent.getUserInfoList();
              this.$Message.info("修改用户信息成功！");
              return;
            }
            throw new Error(suc.data.message);
          })
          .catch(err => {
            console.log(err);
            this.modalError = {
              show: true,
              title: "用户信息修改失败！",
              content: `${err}`
            };
          });
      }
    },
    isStartUsing(value) {
      this.updateUserFormData.isStop = value;
    },
    selectRole(role) {
      this.updateUserFormData.roleId = role;
    },
    selectUnit(unitId) {
      this.updateUserFormData.unitId = unitId;
    },
    getUnitList() {
      this.$refs.selectunit.getUnitInfoList();
    },
    getRoleList() {
      this.$refs.selectrole.getRoleInfoList();
    }
  }
};
</script>
<style>
.updateuser-modal-err .ivu-modal-header,
.updateuser-modal-err .ivu-modal-foote,
.update-user-modal .ivu-modal-header,
.update-user-modal .ivu-modal-footer {
  border: none;
}
</style>
