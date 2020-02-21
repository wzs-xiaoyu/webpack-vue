<template>
  <div class="Project-list">
    <div class="Project-menu">
      <div class="Project-edit">
        <ul class="Project-edit-btns">
          <!-- <li class="Project-edit-btns-item">
    <Icon type="md-search"/>
  </li>-->
          <li class="Project-edit-btns-item" @click="projectAddForm">
            <Icon type="md-add-circle" />
          </li>
        </ul>
      </div>
      <Menu :active-name="projectNameSelected" @on-select="projectSelected" theme="dark" ref="menu">
        <MenuItem v-for="item in projectList" :key="item.name" :name="item.name">
          <p class="Project-menu-item">
            <span>{{ item.name }}</span>
            <Icon type="ios-trash-outline" @click="projectDeleteForm(item)" />
          </p>
        </MenuItem>
      </Menu>
    </div>
    <Modal class-name="Project-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
      <p>{{ modalError.content }}</p>
    </Modal>
    <Modal class-name="Project-modal-add" v-model="modalProjectForm.show" :title="modalProjectForm.title" @on-ok="projectAdd" width="416px">
      <div>
        <Form :model="projectFormData" :label-width="80">
          <FormItem prop="name" label="名称" :rules="{ required: true }">
            <Input clearable :required="true" type="text" v-model.trim="projectFormData.name" />
          </FormItem>
          <FormItem prop="remarks" label="描述" :rules="{ required: true }">
            <Input type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" clearable :required="true" v-model.trim="projectFormData.remarks" />
          </FormItem>
          <FormItem prop="gitPath" label="代码仓库">
            <Input type="text" clearable v-model.trim="projectFormData.gitPath" />
          </FormItem>
        </Form>
      </div>
    </Modal>
    <Modal class-name="Project-modal-delete" v-model="modalDeleteForm.show" :title="modalDeleteForm.title" @on-ok="projectDelete" width="416px">
      <div>
        <Form :model="modalDeleteForm" :label-width="80">
          <FormItem prop="name" label="项目名称">
            <Input type="text" disabled v-model.trim="modalDeleteForm.name" />
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
import { mapState, mapMutations } from "./storeProject.js";

export default {
  components: {},
  props: {},
  data() {
    return {
      projectList: [],
      projectFormData: {
        name: "",
        remarks: "",
        gitPath: ""
      },
      modalProjectForm: {
        show: false,
        title: ""
      },
      modalError: {
        show: false,
        title: "",
        content: ""
      },
      modalDeleteForm: {
        name: "",
        inputName: "",
        show: false,
        title: "项目删除"
      }
    };
  },
  computed: {
    ...mapState({ projectNameSelected: "projectNameSelected", curProject: "curProject" })
  },
  watch: {},
  methods: {
    ...mapMutations({
      projectNameSelectedChange: "projectNameSelectedChange",
      curProjectChange: "curProjectChange"
    }),
    projectSelected(name) {
      this.projectNameSelectedChange(name);
    },
    projectAddForm() {
      this.modalProjectForm = {
        show: true,
        title: "新增项目"
      };
    },
    projectAdd() {
      this.$http
        .post("/api/static", this.projectFormData)
        .then(suc => {
          if (suc.data.success) {
            this.projectListGet();
            this.$Message.info("新增项目成功！");
            return;
          }
          throw new Error(suc.data.message);
        })
        .catch(err => {
          console.error(err);
          this.modalError = {
            show: true,
            title: "新增项目失败！",
            content: `${err}`
          };
        });
    },
    projectDeleteForm(project) {
      this.modalDeleteForm.show = true;
      this.modalDeleteForm.name = project.name;
    },
    projectDelete() {
      if (this.modalDeleteForm.name !== this.modalDeleteForm.inputName) {
        return (this.modalError = {
          show: true,
          title: "项目删除失败！",
          content: `名称不一致！`
        });
      }
      let params = { name: this.modalDeleteForm.name, inputName: this.modalDeleteForm.inputName };
      this.$http
        .delete("/api/static", { params: params })
        .then(suc => {
          if (suc.data.statusCode === 403) {
            window.$AGCP.bus.once(window.$AGCP.events.logined, () => {
              window.location.reload();
            });
          }
          if (!suc.data.success) {
            return (this.modalError = {
              show: true,
              title: "项目删除失败！",
              content: suc.data.message
            });
          }
          this.$Message.success("项目删除成功！");
          this.projectListGet();
        })
        .catch(err => {
          this.modalError = {
            show: true,
            title: "项目删除失败！",
            content: err
          };
          console.error("项目删除", err);
        });
    },
    projectListGet() {
      this.$http
        .get("/api/static")
        .then(suc => {
          if (suc.data.statusCode === 403) {
            window.$AGCP.bus.once(window.$AGCP.events.logined, () => {
              window.location.reload();
            });
          }
          this.projectList = suc.data.data.reverse();
          if (!this.projectList.length) return;
          this.projectNameSelectedChange(this.projectList[0].name);
          this.$nextTick(() => {
            this.$refs.menu.updateActiveName();
          });
        })
        .catch(err => {
          console.error("请求项目列表", err);
        });
    }
  },
  created() {},
  mounted() {
    this.projectListGet();
  },
  beforeDestroy() {}
};
</script>

<style>
.Project-list {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #515a6e;
}
.Project-edit {
  display: flex;
  align-items: center;
  font-size: 0.3rem;
  z-index: 1000;
  color: #fff;
}
.Project-edit-btns {
  color: #ddd;
  background: #515a6e;
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  padding: 0 0.1rem;
}
.Project-edit-btns-item {
  cursor: pointer;
  margin-right: 0.1rem;
  cursor: pointer;
}
.Project-add {
  cursor: pointer;
}
.Project-menu {
  overflow: auto;
}
.Project-menu-item {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding-right: 3px;
}
.Project-menu .ivu-menu-item-selected .ivu-icon {
  transform: scale(1);
}
.Project-menu-item .ivu-icon {
  color: #ddd;
  transform: scale(0);
}
.Project-menu-item .ivu-icon:hover {
  color: #ed4014;
  transform: scale(2);
}

.Project-modal-err .ivu-modal-header,
.Project-modal-err .ivu-modal-footer,
.Project-modal-add .ivu-modal-header,
.Project-modal-add .ivu-modal-footer {
  border: none;
}
.Project-modal-err .ivu-modal-close {
  display: none;
}
.Project-modal-err .ivu-modal-header-inner,
.Project-modal-err .ivu-modal-body {
  color: #f00;
}
.Project-modal-err .ivu-modal-footer .ivu-btn:first-child {
  display: none;
}
</style>
