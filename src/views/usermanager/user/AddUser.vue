<!--用户新增页-->
<template>
  <div class="add-user">
    <Modal class="add-user-modal" v-model="modalAddUserForm.show" :title="modalAddUserForm.title" width="640px" ok-text="保存" @on-ok="addUserInfo()" @on-visible-change="modalVisibleChange">
      <div>
        <Form ref="formValidate" :model="addUserFormData" :label-width="90" label-position="left" :rules="ruleValidate">
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="登录名" prop="name">
                <Input type="text" clearable v-model="addUserFormData.name" placeholder="请以输入登录名" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="密码" prop="password">
                <Input type="password" clearable v-model="addUserFormData.password" placeholder="请以输入密码" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="用户名" prop="userName">
                <Input type="text" clearable v-model="addUserFormData.userName" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="联系电话" prop="tel">
                <Input type="text" clearable v-model="addUserFormData.tel" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="邮箱" prop="email">
                <Input type="text" clearable v-model="addUserFormData.email" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="联系地址" prop="address">
                <Input type="text" clearable v-model="addUserFormData.address" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="隶属角色" prop="roleId">
                <!-- <Input type="text" clearable v-model="addUserFormData.Id" /> -->
                <selectRole ref="selectrole" placeholder="请选择角色" @select-role="selectRole" v-bind:selecteddata="addUserFormData.roleId"></selectRole>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="隶属单位" prop="unitId">
                <selectUnit ref="selectunit" placeholder="请选择单位" @select-unit="selectUnit" v-bind:selecteddata="addUserFormData.unitId"></selectUnit>
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="是否停用" prop="isStop">
                <!-- <Checkbox v-model="addUserFormData.isStop" /> -->
                <i-switch v-model="addUserFormData.isStop" @on-change="isStartUsing">
                  <span slot="open">是</span>
                  <span slot="close">否</span>
                </i-switch>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
    </Modal>
    <Modal class-name="addunit-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
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
  name: "AddUnit",
  props: ["modalAddUserForm"],
  components: {
    selectRole: selectRole,
    selectUnit: selectUnit
  },
  data() {
    return {
      addUserFormData: {
        name: "",
        password: "",
        userName: "",
        tel: "",
        email: "",
        address: "",
        roleId: "",
        unitId: null,
        isStop: false,
        admin: false
      },
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
    addUserInfo() {
      if (this.isEmpty(this.addUserFormData.name) || this.isEmpty(this.addUserFormData.password)) {
        this.$Message.info("登录名和密码必填且不能为空！");
      } else {
        let password = Encrypt(this.addUserFormData.password);
        let UserInfo = { ...this.addUserFormData, password: password };
        this.$http
          .post("/api/users/user", UserInfo)
          .then(suc => {
            if (suc.data.success) {
              this.$parent.userList.unshift({ name: this.addUserFormData.unitName });
              this.$Message.info("新增用户成功！");
              this.$parent.getUserInfoList();
              return;
            }
            throw new Error(suc.data.message);
          })
          .catch(err => {
            this.modalError = {
              show: true,
              title: "新增用户失败！",
              content: `${err}`
            };
          });
      }
    },
    //清空From表单值及验证
    modalVisibleChange() {
      this.$refs.formValidate.resetFields();
    },
    isStartUsing(value) {
      this.addUserFormData.isStop = value;
    },
    selectRole(roleId) {
      this.addUserFormData.roleId = roleId;
    },
    selectUnit(unitId) {
      this.addUserFormData.unitId = unitId;
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
.adduser-modal-err .ivu-modal-header,
.adduser-modal-err .ivu-modal-foote,
.add-user-modal .ivu-modal-header,
.add-user-modal .ivu-modal-footer {
  border: none;
}
</style>
