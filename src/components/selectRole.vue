<template>
  <div class="select-role">
    <Select :placeholder="placeholder" v-model="roleId" @on-change="selectedRole" filterable>
      <Option v-for="item in roleArr" :value="item._id" :key="item._id">{{ item.roleName }}</Option>
    </Select>
  </div>
</template>
<script>
export default {
  name: "SelectRole",
  props: {
    placeholder: {
      type: String,
      required: false,
      default: "请选择"
    },
    selecteddata: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      roleArr: [],
      roleId: this.selecteddata
    };
  },
  watch: {
    selecteddata(value) {
      this.roleId = value;
    },
    roleArr(value) {
      this.roleArr = value;
    }
  },
  methods: {
    getRoleInfoList() {
      this.$http
        .get("/api/users/role")
        .then(suc => {
          if (suc.data.success) {
            this.roleArr = suc.data.data;
          } else {
            this.$Message.error(suc.data.message);
            throw new Error(suc.data.message);
          }
        })
        .catch(err => {
          console.error("请求角色信息列表", err);
        });
    },
    selectedRole(role) {
      this.$emit("select-role", role);
    }
  },
  mounted() {
    this.getRoleInfoList();
  }
};
</script>
<style></style>
