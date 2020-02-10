<template>
  <div class="code-editor">
    <ul class="code-editor-action">
      <li class="code-editor-action-item" @click="showDiff">
        <i> <Icon type="md-git-compare" />对比 </i>
      </li>
    </ul>
    <div ref="monaco" class="monaco"></div>
    <div class="monaco-diff" v-show="isShowDiff">
      <div class="monaco-diff-box">
        <ul class="monaco-diff-action">
          <li class="mdaction-item" v-if="!hideUpload" @click="uploadCode">
            <Icon type="ios-cloud-upload" />
          </li>
          <li class="mdaction-item" @click="closeDiff">
            <Icon type="md-close-circle" />
          </li>
        </ul>
        <div class="monaco-diff-content" ref="monacoDiff"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
export default {
  components: {},
  props: {
    code: {
      type: String,
      default: ""
    },
    originCode: {
      type: String,
      default: ""
    },
    disactions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isShowDiff: false
    };
  },
  computed: {
    hideUpload() {
      return this.disactions.find(item => item === "upload");
    }
  },
  watch: {
    code() {
      this.$codeEditor.setValue(this.code);
    }
  },
  methods: {
    showDiff() {
      this.isShowDiff = true;
      let originalModel = monaco.editor.createModel(this.originCode, "application/json");
      let modifiedModel = monaco.editor.createModel(this.$codeEditor.getValue(), "application/json");
      this.$diffEditor = monaco.editor.createDiffEditor(this.$refs.monacoDiff, {
        readOnly: true
      });
      this.$diffEditor.setModel({
        original: originalModel,
        modified: modifiedModel
      });
      document.querySelector(".close-diff-review").click();
    },
    closeDiff() {
      this.isShowDiff = false;
      this.$diffEditor.dispose();
    },
    uploadCode() {
      this.$emit("upload", this.$codeEditor.getValue(), result => {
        result && this.closeDiff();
      });
    }
  },
  created() {},
  mounted() {
    this.$codeEditor = monaco.editor.create(this.$refs.monaco, {
      value: this.code,
      language: "json",
      theme: "vs-dark", //can also be vs-dark or hc-black
      fontSize: 20,
      autoIndent: true,
      EditorAutoClosingStrategy: "always",
      folding: true,
      matchBrackets: true,
      showFoldingControls: true,
      foldingStrategy: "auto"
    });
  },
  beforeDestroy() {
    this.$codeEditor && this.$codeEditor.dispose();
  }
};
</script>

<style>
.code-editor {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}
.code-editor .monaco {
  flex-grow: 1;
  height: 50%;
}
.code-editor-action {
  background: #515a6e;
  color: #eee;
  display: flex;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
}

.code-editor-action-item {
  cursor: pointer;
  font-style: normal;
  padding: 0.1rem;
  display: inline-flex;
  align-items: center;
  height: 100%;
}
.code-editor-action-item:hover {
  background: #000;
  color: #fff;
}
.code-editor-diff {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
}
.monaco-diff {
  height: 100%;
}
.monaco-diff {
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
.monaco-diff-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 80%;
  height: 80%;
  margin: auto;
}
.monaco-diff-action {
  position: absolute;
  transform: translateY(-100%);
  top: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  background: #ddd;
  border-radius: 5px 5px 0 0;
}
.mdaction-item {
  border-radius: 5px 5px 0 0;
  padding: 10px 30px;
  color: #000;
  cursor: pointer;
  font-weight: bold;
}
.mdaction-item i {
  font-size: 40px;
}

.mdaction-item:hover {
  background: #000;
  color: #fff;
}
.monaco-diff-content {
  margin: auto;
  display: block;
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>
