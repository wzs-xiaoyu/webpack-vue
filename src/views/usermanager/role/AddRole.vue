<!--角色新增页-->
<template>
  <div class="add-role">
    <Modal class="add-role-modal" v-model="modalAddRoleForm.show" :title="modalAddRoleForm.title" ok-text="保存" width="416px" @on-ok="addRoleInfo" @on-visible-change="modalVisibleChange">
      <div>
        <Form ref="formValidate" :model="addRoleFormData">
          <FormItem label="角色名称" prop="roleName" :rules="{ required: true }">
            <Input type="text" :required="true" clearable v-model="addRoleFormData.roleName" placeholder="请输入角色名" />
          </FormItem>
          <FormItem label="英文名称" prop="englishName">
            <Input type="text" clearable v-model="addRoleFormData.englishName" placeholder="请输入英文名" />
          </FormItem>
          <FormItem label="缩写" prop="abbrName">
            <Input type="text" clearable v-model="addRoleFormData.abbrName" placeholder="请输入缩写" />
          </FormItem>
          <FormItem label="描述" prop="remark">
            <Input type="textarea" clearable v-model="addRoleFormData.remark" :autosize="{ minRows: 4, maxRows: 8 }" />
          </FormItem>
        </Form>
      </div>
    </Modal>
    <Modal class-name="addrole-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
      <p>{{ modalError.content }}</p>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "AddRole",
  props: ["modalAddRoleForm"],
  data() {
    return {
      addRoleFormData: {
        roleName: "",
        englishName: "",
        abbrName: "",
        remark: ""
      },
      modalError: {
        show: false,
        title: "",
        content: ""
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
    addRoleInfo() {
      if (this.isEmpty(this.addRoleFormData.roleName)) {
        this.$Message.info("角色名称必填且不能为空！");
      } else {
        let RoleInfo = { ...this.addRoleFormData };
        this.$http
          .post("/api/users/role", RoleInfo)
          .then(suc => {
            if (suc.data.success) {
              this.$parent.roleList.unshift({ name: this.addRoleFormData.roleName });
              this.$Message.info("新增角色成功！");
              this.$parent.getRoleInfoList();
              return;
            }
            throw new Error(suc.data.message);
          })
          .catch(err => {
            this.modalError = {
              show: true,
              title: "新增角色失败！",
              content: `${err}`
            };
          });
      }
    },
    //清空From表单值及验证
    modalVisibleChange() {
      this.$refs.formValidate.resetFields();
    }
  }
};
</script>
<style>
.addrole-modal-err .ivu-modal-header,
.addrole-modal-err .ivu-modal-foote,
.add-role-modal .ivu-modal-header,
.add-role-modal .ivu-modal-footer {
  border: none;
}
</style>
