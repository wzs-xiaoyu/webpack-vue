<template>
  <div class="cdc-form">
    <Button v-for="item in actions" :key="item.value" @click="form(item.value)" type="primary" style="width:102px">{{ item.label }}</Button>
    <!-- 注册表单 -->
    <Modal v-model="formAdd.show" :title="formAdd.title" @on-ok="serverAdd" width="416px">
      <Form :label-width="80">
        <FormItem label="项目名称">
          <Input type="text" disabled v-model.trim="projectNameSelected" />
        </FormItem>
        <FormItem label="服务名称">
          <Input type="text" v-model.trim="formAdd.serverName" :rules="{ required: true }" />
        </FormItem>
        <FormItem label="数据来源">
          <RadioGroup v-model="formAdd.type">
            <Radio label="url">URL</Radio>
            <Radio label="value">JSON</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="formAdd.type === 'url'">
          <Input v-model.trim="formAdd.url" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" placeholder="输入URL" :rules="{ required: true }" />
        </FormItem>
        <FormItem v-else>
          <a href></a>
          <Input v-model="formAdd.value" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" placeholder="输入JSON" :rules="{ required: true }" />
        </FormItem>
      </Form>
    </Modal>
    <!-- 删除表单 -->
    <Modal v-model="formDelete.show" :title="formDelete.title" @on-ok="serverDelete" width="416px">
      <Form :label-width="80">
        <FormItem label="项目名称">
          <Input type="text" disabled v-model.trim="projectNameSelected" />
        </FormItem>
        <FormItem label="服务名称">
          <Input type="text" disabled v-model.trim="formDelete.name" />
        </FormItem>
        <FormItem label="确认服务">
          <Input type="text" v-model.trim="formDelete.nameSure" :rules="{ required: true }" />
        </FormItem>
      </Form>
    </Modal>
    <!-- 编辑表单 -->
    <Modal v-model="formEdit.show" :title="formEdit.title" @on-ok="serverEdit" width="416px">
      <Form :label-width="80">
        <FormItem label="项目名称">
          <Input type="text" disabled v-model.trim="projectNameSelected" />
        </FormItem>
        <FormItem label="服务名称">
          <Input type="text" disabled v-model.trim="formEdit.serverName" />
        </FormItem>
        <FormItem label="数据来源">
          <RadioGroup v-model="formEdit.type">
            <Radio label="url">URL</Radio>
            <Radio label="value">JSON</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label>
          <a class="formEdit-data-link" :href="formEdit.data" target="blank">
            <span>点击查看当前数据</span>
            <span>{{ formEdit.data }}</span>
          </a>
        </FormItem>
        <FormItem v-if="formEdit.type === 'url'">
          <Input v-model.trim="formEdit.url" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" placeholder="输入新的URL" :rules="{ required: true }" />
        </FormItem>
        <FormItem v-else>
          <Input v-model="formEdit.value" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" placeholder="输入新的JSON" :rules="{ required: true }" />
        </FormItem>
      </Form>
    </Modal>
    <!-- 错误弹窗 -->
    <Modal class-name="Project-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
      <p>{{ modalError.content }}</p>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "./storeCdc.js";

export default {
  components: {},
  props: {},
  data() {
    return {
      actions: [
        { value: "formAdd", label: "+注册" }
        //   { value: "formDelete", label: "删除" }
      ],
      formAdd: {
        show: false,
        title: "注册服务",
        serverName: "",
        type: "url",
        url: "",
        value: ""
      },
      formDelete: {
        show: false,
        title: "删除服务",
        name: "",
        nameSure: ""
      },
      formEdit: {
        show: false,
        title: "编辑服务信息",
        prjName: "",
        serverName: "",
        type: "url",
        url: "",
        data: "",
        value: ""
      },
      modalError: {
        show: false,
        title: "",
        content: ``
      }
    };
  },
  computed: {
    ...mapState(["projectNameSelected"])
  },
  watch: {},
  methods: {
    ...mapActions(["projectServerDataRefresh"]),
    form(formName, data) {
      this[formName].show = true;
      if (formName === "formDelete") {
        this[formName].name = data.name;
      } else if (formName === "formEdit") {
        this[formName].serverName = data.name;
        this[formName].type = data.type;
        this[formName].value = this[formName].url = "";
        this[formName].data = data.url;
      }
    },
    serverAdd() {
      let value = this.formAdd.type === "url" ? this.formAdd.url : this.formAdd.value;
      let params = { prjName: this.projectNameSelected, serverName: this.formAdd.serverName, type: this.formAdd.type, value: value };
      this.$http
        .post("/api/CDC", params)
        .then(suc => {
          if (!suc.data.success) {
            throw new Error(suc.data.message);
          }
          this.$Message.success("注册服务成功！");
          this.projectServerDataRefresh();
        })
        .catch(err => {
          this.modalError = {
            show: true,
            title: "注册服务失败！",
            content: err
          };
          console.error("cdc-注册服务：" + err);
        });
    },
    serverDelete() {
      if (this.formDelete.name !== this.formDelete.nameSure) {
        return (this.modalError = {
          show: true,
          title: "服务删除失败！",
          content: `名称不一致！`
        });
      }
      let params = { prjName: this.projectNameSelected, serverName: this.formDelete.name };
      this.$http
        .delete("/api/CDC", { params })
        .then(suc => {
          if (!suc.data.success) {
            throw new Error(suc.data.message);
          }
          this.$Message.success("删除服务成功！");
          this.projectServerDataRefresh();
        })
        .catch(err => {
          this.modalError = {
            show: true,
            title: "删除服务失败！",
            content: err
          };
          console.error("cdc-删除服务：" + err);
        });
    },
    serverEdit() {
      let value = this.formEdit.type === "url" ? this.formEdit.url : this.formEdit.value;
      let params = { prjName: this.projectNameSelected, serverName: this.formEdit.serverName, type: this.formEdit.type };
      if (value) params.value = value;
      this.$http
        .put("/api/CDC", params)
        .then(suc => {
          if (!suc.data.success) {
            throw new Error(suc.data.message);
          }
          this.$Message.success("修改服务信息成功！");
          this.projectServerDataRefresh();
        })
        .catch(err => {
          this.modalError = {
            show: true,
            title: "修改服务信息失败！",
            content: err
          };
          console.error("cdc-修改服务信息：" + err);
        });
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {}
};
</script>

<style scoped>
.cdc-form {
  display: inline-block;
}
.formEdit-data-link {
  line-height: 1.2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 30px;
  border-radius: 10px;
  border-color: #2d8cf0;
}
.formEdit-data-link > span {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
