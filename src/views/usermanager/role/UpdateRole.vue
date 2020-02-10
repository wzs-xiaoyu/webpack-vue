<!--角色信息编辑页-->
<template>
  <div>
    <Modal class="update-role-modal" v-model="modalUpdateRoleForm.show" :title="modalUpdateRoleForm.title" ok-text="修改" width="416px" @on-ok="updateRoleInfo">
      <div>
        <Form ref="formValidate" :model="updateRoleFormData">
          <FormItem label="角色名称" prop="roleName" :rules="{ required: true }">
            <Input type="text" :required="true" clearable v-model="updateRoleFormData.roleName" placeholder="请输入角色名" />
          </FormItem>
          <FormItem label="英文名称" prop="englishName">
            <Input type="text" clearable v-model="updateRoleFormData.englishName" placeholder="请输入英文名" />
          </FormItem>
          <FormItem label="缩写" prop="abbrName">
            <Input type="text" clearable v-model="updateRoleFormData.abbrName" placeholder="请输入缩写" />
          </FormItem>
          <FormItem label="描述" prop="remark">
            <Input type="textarea" clearable v-model="updateRoleFormData.remark" :autosize="{ minRows: 4, maxRows: 8 }" />
          </FormItem>
        </Form>
      </div>
    </Modal>
    <Modal class-name="updaterole-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
      <p>{{ modalError.content }}</p>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "UpdateRole",
  props: ["modalUpdateRoleForm", "updateRoleFormData"],
  data() {
    return {
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
    updateRoleInfo() {
      if (this.isEmpty(this.updateRoleFormData.roleName)) {
        this.$Message.info("角色名称必填且不能为空！");
      } else {
        this.$http
          .put("/api/users/role", this.updateRoleFormData)
          .then(suc => {
            if (suc.data.success) {
              this.$Message.info("修改角色信息成功！");
              this.$parent.getRoleInfoList();
              return;
            }
            throw new Error(suc.data.message);
          })
          .catch(err => {
            this.modalError = {
              show: true,
              title: "修改角色信息失败！",
              content: `${err}`
            };
          });
      }
    }
  }
};
</script>
<style>
.updaterole-modal-err .ivu-modal-header,
.updaterole-modal-err .ivu-modal-foote,
.update-role-modal .ivu-modal-header,
.update-role-modal .ivu-modal-footer {
  border: none;
}
</style>
