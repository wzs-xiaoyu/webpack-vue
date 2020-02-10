<template>
  <div class="configschema">
    <codeEditor :code="code" :originCode="code" @upload="codeUpload"></codeEditor>
  </div>
</template>

<script>
import codeEditor from "../../components/code-editor-monaco.vue";
import { mapState } from "./storeProject.js";
import { ajaxFile } from "../../utils/fileUtil.js";
export default {
  components: {
    codeEditor
  },
  props: {},
  data() {
    return {
      code: "",
      schemaPath: ""
    };
  },
  computed: {
    ...mapState({ curProject: "curProject" })
  },
  watch: {
    curProject() {
      this.configGet(this.curProject.name).then(suc => {
        this.codeSet(suc);
      });
    }
  },
  methods: {
    configGet(name) {
      return this.$http
        .get("/api/static/config", { params: { name: name } })
        .then(suc => {
          if (!suc.data.success) {
            throw new Error(suc.data.message);
          }
          this.schemaPath = suc.data.data.schema;
          return ajaxFile(suc.data.data.schema);
        })
        .catch(err => console.error(err));
    },
    codeSet(code) {
      this.code = code;
    },
    codeUpload(code, callback) {
      this.$Spin.show();
      this.$http
        .post("/api/static/config", {
          name: this.curProject.name,
          fileName: this.schemaPath,
          content: code
        })
        .then(suc => {
          callback(suc.data.success);
          this.$Spin.hide();
          if (!suc.data.success) throw new Error(suc.data.message);
          this.codeSet(code);
          this.$Modal.confirm({
            title: "上传成功！"
          });
        })
        .catch(err => {
          this.$Spin.hide();
          console.error(err);
        });
    }
  },
  created() {},
  mounted() {
    if (this.curProject.name) {
      this.configGet(this.curProject.name).then(suc => {
        this.codeSet(suc);
      });
    }
  },
  beforeDestroy() {}
};
</script>

<style>
.configschema {
  display: flex;
  min-height: 74vh;
  padding-top: 0.1rem;
}
</style>
