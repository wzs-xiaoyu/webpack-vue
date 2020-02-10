<template>
  <div class="staticresource-list">
    <div class="staticresource-menu">
      <div class="staticresource-edit">
        <ul class="staticresource-edit-btns">
          <li class="staticresource-edit-btns-item" @click="folderAddForm">
            <Icon type="md-add-circle" />
          </li>
        </ul>
      </div>
      <Menu :active-name="staticResourceNameSelected" @on-select="staticResourceSelected" theme="dark" ref="menus">
        <MenuItem v-for="item in staticResourceList" :key="item._id" :name="item._id">
          <p class="menuitem-content">
            <span>{{ item.name }}</span>
            <Icon type="ios-trash-outline" @click="deleteStaticResourceForm(item)" />
          </p>
        </MenuItem>
      </Menu>
    </div>
    <Modal class-name="staticresource-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
      <p>{{ modalError.content }}</p>
    </Modal>
    <Modal class-name="staticresource-modal-add" v-model="modalStaticResourceForm.show" :title="modalStaticResourceForm.title" @on-ok="staticResourceAdd" width="416px" @on-visible-change="modalVisibleChange">
      <div>
        <Form :model="staticResourceFormData" :label-width="80" ref="formValidate" :rules="ruleValidate">
          <FormItem prop="name" label="名称">
            <Input clearable type="text" v-model.trim="staticResourceFormData.name" />
          </FormItem>
          <FormItem prop="remarks" label="描述">
            <Input type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" clearable v-model.trim="staticResourceFormData.remarks" />
          </FormItem>
        </Form>
      </div>
    </Modal>
    <Modal class-name="staticresource-modal-delete" v-model="modalDeleteForm.show" :title="modalDeleteForm.title" @on-ok="deleteStaticResource" width="416px" @on-visible-change="modalVisibleChange1">
      <div>
        <Form :model="modalDeleteForm" :label-width="80" ref="formValidate1">
          <FormItem prop="staticResourceName" label="文件夹名称">
            <Input type="text" disabled v-model.trim="modalDeleteForm.staticResourceName" />
          </FormItem>
          <FormItem prop="inputName" label="确认名称">
            <Input type="text" clearable v-model.trim="modalDeleteForm.inputName" />
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapMutations } from "./storeStaticResource.js";
const validateName = (rule, value, callback) => {
  if (typeof value == "undefined" || value == null || value == "") {
    callback();
  } else if (/[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/.test(value)) {
    callback("不能含有特殊字符！");
  } else {
    callback();
  }
};
export default {
  components: {},
  props: {},
  data() {
    return {
      staticResourceList: [],
      staticResourceFormData: {
        name: "",
        remarks: ""
      },
      modalStaticResourceForm: {
        show: false,
        title: ""
      },
      modalError: {
        show: false,
        title: "",
        content: ""
      },
      modalDeleteForm: {
        staticResourceName: "",
        inputName: "",
        show: false,
        title: ""
      },
      ruleValidate: {
        name: [{ required: true, validator: validateName }],
        remarks: [{ required: true, message: "描述必填" }]
      }
    };
  },
  computed: {
    ...mapState({ staticResourceNameSelected: "staticResourceNameSelected", staticResource: "staticResource" })
  },
  watch: {},
  methods: {
    ...mapMutations({
      staticResourceNameSelectedChange: "staticResourceNameSelectedChange",
      staticResourceChange: "staticResourceChange"
    }),
    staticResourceSelected(name) {
      this.staticResourceNameSelectedChange(name);
    },
    folderAddForm() {
      this.modalStaticResourceForm = {
        show: true,
        title: "创建文件夹"
      };
    },
    isEmpty(obj) {
      if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
      } else {
        return false;
      }
    },
    staticResourceAdd() {
      let staticResource = { ...this.staticResourceFormData };
      if (this.isEmpty(staticResource) || this.isEmpty(staticResource.remarks)) {
        return this.$Message.info("文件夹名称和描述不能为空！");
      }
      this.$http
        .post("/api/resource", staticResource)
        .then(suc => {
          if (suc.data.success) {
            this.getStaticResourceFolder();
            this.$Message.info("创建文件夹成功！");
            return;
          }
          throw new Error(suc.data.message);
        })
        .catch(err => {
          this.modalError = {
            show: true,
            title: "创建文件夹失败！",
            content: `${err}`
          };
        });
    },
    getStaticResourceFolder() {
      this.$http
        .get("/api/resource")
        .then(suc => {
          if (suc.data.statusCode === 403) {
            window.$AGCP.bus.once(window.$AGCP.events.logined, () => {
              window.location.reload();
            });
          }
          this.staticResourceList = suc.data.data;
          if (!this.staticResourceList.length) {
            this.staticResourceNameSelectedChange("undefined");
          } else {
            this.staticResourceNameSelectedChange(this.staticResourceList[0]._id);
          }
          this.$nextTick(() => {
            this.$refs.menus.updateActiveName();
          });
        })
        .catch(err => {
          console.error("请求静态资源文件夹列表", err);
        });
    },
    deleteStaticResourceForm(StaticResource) {
      this.modalDeleteForm.show = true;
      this.modalDeleteForm.staticResourceName = StaticResource.name;
      this.modalDeleteForm.title = "文件夹删除";
      this.modalDeleteForm._id = StaticResource._id;
    },
    deleteStaticResource() {
      if (this.modalDeleteForm.staticResourceName !== this.modalDeleteForm.inputName) {
        return (this.modalError = {
          show: true,
          title: "文件夹删除失败！",
          content: `文件夹名称不一致！`
        });
      }
      let params = {};
      params.delObj = {};
      params.delObj.name = this.modalDeleteForm.staticResourceName;
      params.delObj.inputName = this.modalDeleteForm.inputName;
      params.delObj._id = this.modalDeleteForm._id;
      // let delObj={
      //   name:this.modalDeleteForm.staticResourceName,
      //   inputName:this.modalDeleteForm.inputName,
      //   _id:this.modalDeleteForm._id
      // }
      this.$http
        .delete("/api/resource", { params: params })
        .then(suc => {
          if (suc.data.statusCode === 403) {
            window.$AGCP.bus.once(window.$AGCP.events.logined, () => {
              window.location.reload();
            });
          }
          if (!suc.data.success) {
            return (this.modalError = {
              show: true,
              title: "文件夹删除失败！",
              content: suc.data.message
            });
          }
          if (suc.data.success) {
            this.$Message.success("删除静态资源文件夹成功！");
            this.getStaticResourceFolder();
            return;
          }
          throw new Error(suc.data.message);
        })
        .catch(err => {
          this.modalError = {
            show: true,
            title: "删除静态资源文件夹失败！",
            content: `${err}`
          };
        });
    },
    //清空From表单值及验证
    modalVisibleChange() {
      this.$refs.formValidate.resetFields();
    },
    modalVisibleChange1() {
      this.modalDeleteForm.inputName = "";
    }
  },
  created() {},
  mounted() {
    this.getStaticResourceFolder();
  },
  beforeDestroy() {}
};
</script>

<style>
.staticresource-list {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #515a6e;
}
.staticresource-edit {
  display: flex;
  align-items: center;
  font-size: 0.3rem;
  z-index: 1000;
  color: #fff;
}
.staticresource-edit-btns {
  color: #ddd;
  background: #515a6e;
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  padding: 0 0.1rem;
}
.staticresource-edit-btns-item {
  cursor: pointer;
  margin-right: 0.1rem;
  cursor: pointer;
}
.staticresource-menu {
  overflow: auto;
}
.menuitem-content {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding-right: 3px;
}
.staticresource-menu .ivu-menu-item-selected .ivu-icon {
  transform: scale(1);
}
.menuitem-content .ivu-icon {
  color: #ddd;
  transform: scale(0);
}
.menuitem-content .ivu-icon:hover {
  color: #ed4014;
  transform: scale(2);
}
.staticresource-modal-delete .ivu-modal-header,
.staticresource-modal-delete .ivu-modal-footer,
.staticresource-modal-err .ivu-modal-header,
.staticresource-modal-err .ivu-modal-footer,
.staticresource-modal-add .ivu-modal-header,
.staticresource-modal-add .ivu-modal-footer {
  border: none;
}
.staticresource-modal-err .ivu-modal-close {
  display: none;
}
.staticresource-modal-err .ivu-modal-header-inner,
.staticresource-modal-err .ivu-modal-body {
  color: #f00;
}
.staticresource-modal-err .ivu-modal-footer .ivu-btn:first-child {
  display: none;
}
</style>
