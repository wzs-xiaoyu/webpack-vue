/* 配置项编辑页 */
<template>
  <div class="configeditor">
    <div class="configeditor-edit">
      <ul class="configeditor-action">
        <li class="configeditor-action-item" @click="preview">
          <i> <Icon type="md-eye" />预览 </i>
        </li>
        <li class="configeditor-action-item" @click="codeToggle">
          <i> <Icon type="logo-javascript" />代码 </i>
        </li>
        <li class="configeditor-action-item" @click="linkShow">
          <i> <Icon type="ios-link" />链接 </i>
        </li>
      </ul>
      <div ref="editor" class="agcp-json-editor"></div>
    </div>
    <div class="configeditor-edit-code">
      <codeEditor :code="code" :originCode="serverCode" @upload="codeUpload" v-if="isShowCode"></codeEditor>
    </div>
    <div class="configeditor-preview" v-show="isShowPreview">
      <div class="configeditor-preview-box">
        <ul class="configeditor-preview-action">
          <li class="cpaction-item" @click="formUpload">
            <Icon type="ios-cloud-upload" />
          </li>
          <li class="cpaction-item" @click="actionViewClose">
            <Icon type="md-close-circle" />
          </li>
        </ul>
        <iframe frameborder="0" ref="previewFrame" v-show="isShowPreview"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/materialIcons.css";
import "../../assets/jsonEditor.css";
import JSONEditor from "@json-editor/json-editor";
import codeEditor from "../../components/code-editor-monaco.vue";
import { mapState } from "./storeProject.js";
import { ajaxFile } from "../..//utils/fileUtil.js";
export default {
  components: { codeEditor },
  props: {},
  data() {
    return {
      isShowPreview: false,
      isShowCode: false,
      previewSrc: "",
      configPath: "",
      code: ``,
      serverCode: ``
    };
  },
  computed: {
    ...mapState({ curProject: "curProject" })
  },
  watch: {
    curProject() {
      this.configGet(this.curProject.name);
      this.isShowCode = false;
    }
  },
  methods: {
    preview() {
      ajaxFile(this.curProject.url)
        .then(suc => {
          let config = this.$editor.getValue() || {};
          let configText = JSON.stringify(config);
          configText = this.json2Script(configText);
          let htmlText = this.combinehtmlConfig(suc, configText);
          let $previewFrame = this.$refs.previewFrame;
          let $previewDocument = $previewFrame.contentDocument || $previewFrame.contentWindow.document;
          this.isShowPreview = true;
          $previewDocument.open();
          $previewDocument.write(htmlText);
          $previewDocument.close();
        })
        .catch(err => console.error(err));
    },
    // 将配置项添加到预览页面
    combinehtmlConfig(htmlText, configText) {
      let configScript = "<script>" + configText + "</";
      let host = new URL(this.curProject.url).origin + "/";
      htmlText = htmlText.replace(/(?<=src=\s*['"]*)(?=[^/])/gm, this.curProject.url + "/"); //项目目录 js
      htmlText = htmlText.replace(/(?<=href=\s*['"]*)(?=[^/])/gm, this.curProject.url + "/"); //项目目录 css
      htmlText = htmlText.replace(/(?<=src=\s*['"]*)\//gm, host); //服务器根目录 js
      htmlText = htmlText.replace(/(?<=href=\s*['"]*)\//gm, host); //服务器根目录 css
      htmlText = htmlText.replace(/(?<=config.*?config\.js.*?<\/script>)/, configScript + "script>"); //插入配置项脚本
      return htmlText;
    },
    // 关闭预览
    actionViewClose() {
      this.isShowPreview = false;
      this.isShowCode = false;
    },
    // 切换代码展示与否
    codeToggle() {
      this.isShowCode = !this.isShowCode;
      if (!this.isShowCode) return;
      this.code = JSON.stringify(this.$editor.getValue(), null, 2);
      this.code = this.code === "null" ? "" : this.code;
    },
    //http请求配置文件信息与内容
    configGet(name) {
      return this.$http
        .get("/api/static/config", { params: { name: name } })
        .then(suc => {
          if (!suc.data.success) {
            throw new Error(suc.data.message);
          }
          this.configPath = suc.data.data.config;
          return Promise.all([ajaxFile(suc.data.data.config), ajaxFile(suc.data.data.schema)]);
        })
        .then(suc => {
          this.editorInit(...suc);
        })
        .catch(err => console.error(err));
    },
    editorInit(jsonData, schema) {
      try {
        schema = JSON.parse(schema || "{}");
      } catch (err) {
        return console.error("内容模板不存在！");
      }
      this.serverCode = this.script2jsonText(jsonData); //用于代码对比
      // 启动表单编辑器
      this.$editor && this.$editor.destroy();
      this.$editor = new JSONEditor(this.$refs.editor, {
        schema: schema,
        ajax: false,
        collapsed: true,
        disable_edit_json: true,
        disable_properties: true,
        disable_array_delete_last_row: true,
        disable_array_delete_all_rows: true,
        theme: "materialize",
        iconlib: "materialicons"
      });
      // 将字符串解析为对象
      if (!jsonData) return;
      try {
        jsonData = JSON.parse(this.serverCode);
        this.$editor.setValue(jsonData);
      } catch (e) {
        console.error(e);
      }
    },
    // 去除配置项内容中的 window.xxx=
    script2jsonText(config) {
      return config.replace(/window.*?=/gm, "");
    },
    json2Script(json) {
      let property = this.configPath
        .split("/")
        .slice(-1)[0]
        .replace(".js", "");
      return `window["${property}"]=${json}`;
    },
    //代码提交
    codeUpload(code) {
      this.$Spin.show();
      this.$http
        .post("/api/static/config", {
          name: this.curProject.name,
          fileName: this.configPath,
          content: this.json2Script(code)
        })
        .then(suc => {
          this.$Spin.hide();
          if (!suc.data.success) {
            this.$Modal.error({
              title: "上传失败！",
              content: suc.data.message
            });
            throw new Error(suc.data.message);
          }
          this.$Modal.success({
            title: "上传成功！"
          });
          let jsonData = JSON.parse(code);
          this.serverCode = code;
          this.$editor.setValue(jsonData);
        })
        .catch(err => {
          this.$Spin.hide();
          console.error(err);
        });
    },
    //表单提交
    formUpload() {
      let code = JSON.stringify(this.$editor.getValue(), null, 2);
      this.codeUpload(code);
    },
    // 展示内容 js 文件链接
    linkShow() {
      this.$Modal.success({
        content: `<a target="blank" href=${this.configPath}>${this.configPath}</a>`
      });
    }
  },
  created() {},
  mounted() {
    if (this.curProject.name) {
      this.configGet(this.curProject.name);
    }
  },
  beforeDestroy() {}
};
</script>

<style>
.configeditor {
  overflow: auto;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
}
.configeditor-action {
  color: #eee;
  background: #515a6e;
  display: flex;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
}
.configeditor-action-item {
  cursor: pointer;
  font-style: normal;
  padding: 0.1rem;
  display: inline-flex;
  align-items: center;
  height: 100%;
}
.configeditor-action-item:hover {
  background: #000;
  color: #fff;
}
.configeditor-action > i {
  margin-left: 0.2rem;
  font-style: normal;
  cursor: pointer;
}
.configeditor-action > i:hover {
  color: #000;
}
.configeditor-action a {
  color: inherit;
}
.configeditor-edit {
  width: 45%;
}
.agcp-json-editor {
  border: 0.04rem solid #515a6e;
  border-top: none;
  border-radius: 0 0 0.05rem 0.05rem;
  background: #fff;
  padding: 0.2rem;
  padding-top: 0.1rem;
  min-height: 7rem;
}
.configeditor-edit-code {
  height: 7rem;
  width: 50%;
  display: flex;
}
.configeditor-preview {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
}
.configeditor-preview-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 80%;
  height: 80%;
  margin: auto;
}
.configeditor-preview-action {
  position: absolute;
  transform: translateY(-100%);
  top: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  background: #ddd;
  border-radius: 5px 5px 0 0;
}
.cpaction-item {
  border-radius: 5px 5px 0 0;
  padding: 10px 30px;
  color: #000;
  cursor: pointer;
  font-weight: bold;
}
.cpaction-item i {
  font-size: 40px;
}

.cpaction-item:hover {
  background: #000;
  color: #fff;
}
.configeditor-preview-box iframe {
  margin: auto;
  display: block;
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>
