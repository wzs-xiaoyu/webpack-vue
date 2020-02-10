/* 项目管理 */
<template>
  <div class="version-admin">
    <div>
      <Upload
        ref="upload"
        class="version-upload"
        :class="{ uploading: uploading }"
        type="drag"
        accept="application/zip"
        action="/api/static/upload"
        :max-size="30000"
        :headers="uploadHttpHeader"
        :data="uploadParam"
        :on-success="uploadEnd"
        :on-error="uploadError"
        :before-upload="uploadParamCreate"
        :show-upload-list="true"
        :paste="true"
        :multiple="false"
        :on-exceeded-size="exceededSize"
        :on-format-error="formatError"
      >
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>上传</p>
        </div>
      </Upload>
      <Table class="version-lock-table" border :columns="versionTableTitle" :data="projectVersionsLockRender"></Table>
      <Table border :columns="versionTableTitle" :data="projectVersionsRender"></Table>
    </div>
    <Modal class-name="Project-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
      <p>{{ modalError.content }}</p>
    </Modal>
    <Modal class-name="Project-modal-upload" v-model="modalUpload.show" :title="modalUpload.title" width="416px">
      <Form :model="uploadParam" :label-width="80">
        <FormItem prop="remarks" label="描述" :rules="{ required: true }">
          <Input clearable type="text" v-model="uploadParam.remarks" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" @click="modalUploadOk">确认</Button>
        <Button type="error" size="large" @click="modalUploadCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getGitInfo } from "../../utils/fileUtil.js";
import { mapState, mapMutations } from "./storeProject.js";
import { timeRange } from "../../utils/time.js";
export default {
  name: "Project",
  components: {},
  props: {},
  data() {
    return {
      uploading: false,
      //版本title
      versionTableTitle: [
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Button", {
                props: {
                  shape: "circle",
                  type: params.row.isLock ? "primary" : "dashed",
                  icon: params.row.isLock ? "ios-lock" : "ios-unlock",
                  size: "small"
                },
                style: {
                  float: "left",
                  margin: "5px 0"
                },
                on: {
                  click: () => {
                    this.clickLock(params);
                  }
                }
              }),
              h(
                "Button",
                {
                  props: {
                    type: this.curProject.version === params.row.version ? "error" : "primary",
                    size: "small"
                  },
                  style: {
                    margin: "5px 0"
                  },
                  on: {
                    click: () => {
                      this.curProject.version === params.row.version ? "" : this.versionPublish(params);
                    }
                  }
                },
                this.curProject.version === params.row.version ? "在线" : "发布"
              )
            ]);
          }
        },
        {
          title: "上传描述",
          key: "remarks",
          align: "left"
        },
        {
          title: "上传日期",
          key: "_uploadTime",
          align: "center",
          render: (h, params) => {
            return h("div", [h("p", [params.row._uploadTime])]);
          }
        },
        {
          title: "上传用户",
          key: "uploadUser",
          align: "center"
        },
        {
          title: "Git",
          key: "gitInfo",
          align: "center",
          render: (h, params) => {
            return h("div", [h("p", { class: "version-gitInfo-branch" }, [h("Icon", { props: { type: "md-git-branch" } }), params.row.gitInfo[0]]), h("p", { class: "version-gitInfo-hash" }, params.row.gitInfo[1])]);
          }
        },
        {
          title: "ID",
          key: "version",
          align: "center"
        }
      ],
      projectVersions: [],
      modalError: {
        show: false,
        title: "",
        content: ""
      },
      modalUpload: {
        show: false,
        title: ""
      },
      uploadParam: {
        name: "",
        remarks: "",
        gitInfo: ""
      },
      uploadHttpHeader: { Authorization: "" }
    };
  },
  computed: {
    ...mapState({ curProject: "curProject" }),
    curProjectName() {
      return this.curProject.name;
    },
    //所有版本
    projectVersionsRender() {
      return this.projectVersions.map(item => {
        let gitInfo = item.gitInfo ? item.gitInfo.split("|") : ["", ""];
        gitInfo = gitInfo.map(item => item.replace(/^.*:/, ""));
        return { ...item, gitInfo };
      });
    },
    //被锁定的版本
    projectVersionsLockRender() {
      return this.projectVersionsRender.filter(item => item.isLock);
    }
  },
  watch: {
    curProjectName() {
      this.versionListGet();
    }
  },
  methods: {
    ...mapMutations({
      curProjectChange: "curProjectChange"
    }),
    // 获取当前项目的版本列表
    versionListGet() {
      this.$http
        .get("/api/static/version", { params: { name: this.curProjectName } })
        .then(suc => {
          if (!suc.data.success) {
            throw new Error(suc.data.message);
          }
          suc.data.data.forEach(item => {
            let rangeObj = timeRange(item.uploadTime * 1, suc.data.time * 1);
            if (rangeObj.year > 0 || rangeObj.month > 0 || rangeObj.day >= 2) {
              item._uploadTime = rangeObj.moment;
            } else if (rangeObj.day === 1) {
              item._uploadTime = "昨天--" + rangeObj.moment;
            } else if (rangeObj.day === 2) {
              item._uploadTime = "前天--" + rangeObj.moment;
            } else if (rangeObj.hours > 0) {
              item._uploadTime = rangeObj.hours + " 小时前--" + rangeObj.moment;
            } else if (rangeObj.minutes > 0) {
              item._uploadTime = rangeObj.minutes + " 分钟前--" + rangeObj.moment;
            } else if (rangeObj.seconds > 0) {
              item._uploadTime = rangeObj.seconds + " 秒前--" + rangeObj.moment;
            } else {
              item._uploadTime = rangeObj.moment;
            }
          });
          this.projectVersions = suc.data.data.reverse();
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 发布指定版本
    versionPublish(param) {
      this.$Modal.confirm({
        title: "发布",
        content: `<p>名称: ${this.curProjectName}</p><p>版本ID: ${param.row.version}</p>`,
        loading: true,
        onOk: () => {
          this.$http
            .post("/api/static/publish", {
              name: this.curProjectName,
              version: param.row.version
            })
            .then(suc => {
              this.$Modal.remove();
              if (suc.data.success) {
                this.$Message.info("发布成功！");
                this.curProjectChange({ ...this.curProject, version: param.row.version });
                return;
              }
              throw new Error(suc.data.message);
            })
            .catch(err => {
              console.error(err);
              this.$Spin.hide();
              this.modalError = {
                show: true,
                title: "发布失败！",
                content: `${err}`
              };
            });
        }
      });
    },
    // 上传结果
    uploadEnd(res) {
      this.uploading = false;
      this.$refs.upload.clearFiles();
      if (!res.success) {
        this.$Modal.error({
          title: "上传失败",
          content: `<p>${res.message instanceof Object ? res.message.name : res.message}</p>`
        });
        return console.error(res);
      }
      this.$Modal.info({
        title: "上传成功",
        // content: `<p>名称: ${this.curProjectName}</p><p>版本ID: ${param.row.version}</p>`,
        onOk: () => {
          this.versionListGet();
        }
      });
    },
    // 上传表单填写
    uploadForm() {
      return new Promise((rs, rj) => {
        this.modalUpload = { show: true, title: "上传" };
        this.$once("modalUploadOk", () => {
          this.modalUpload.show = false;
          rs();
        });
        this.$once("modalUploadCancel", () => {
          this.modalUpload.show = false;
          rj();
        });
      });
    },
    // 确认上传
    modalUploadOk() {
      if (!this.uploadParam.remarks.trim()) return;
      this.$emit("modalUploadOk");
    },
    // 取消上传
    modalUploadCancel() {
      this.$emit("modalUploadCancel");
    },
    // 构造上传接口参数
    uploadParamCreate(file) {
      this.uploadFile(file);
      return false;
    },
    uploadFile(file) {
      this.uploadParam.gitInfo = "";
      this.uploadParam.name = this.curProjectName;
      this.uploadHttpHeader.Authorization = this.$http.defaults.headers.common.Authorization;
      this.uploadForm()
        .then(() => {
          return getGitInfo(file);
        })
        .then(suc => {
          this.uploadParam.gitInfo = suc;
          this.$refs.upload.post(file);
          this.uploading = true;
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 文件尺寸超出限制
    exceededSize() {
      this.$Modal.error({ title: "上传失败", content: "<p>文件大小超出 30M 限制！</p>" });
    },
    // 文件格式超出限制
    formatError() {
      this.$Modal.error({ title: "上传失败", content: "<p>文件必须是 .zip 格式！</p>" });
    },
    // 上传组件抛出错误
    uploadError() {
      this.uploading = false;
      this.$Modal.error({ title: "上传失败", content: "<p>请联系管理员！</p>" });
    },
    //点击锁定
    clickLock(params) {
      let isLock = !params.row.isLock;
      let action = isLock ? "锁定" : "解锁";
      this.$http
        .put("/api/static/isLock", { version: params.row.version, isLock: isLock })
        .then(suc => {
          if (!suc.data.success) return this.$Message.error(action + "-失败！\n" + suc.data.message);
          params.row.isLock = isLock;
          this.projectVersions.some(item => {
            if (params.row.version !== item.version) return false;
            item.isLock = isLock;
          });
        })
        .catch(err => {
          console.error(err);
          this.$Message.error(action + "-失败！\n");
        });
    }
  },
  created() {},
  mounted() {
    this.versionListGet();
  },
  beforeDestroy() {}
};
</script>

<style>
.version-gitInfo-hash .ivu-icon,
.version-gitInfo-branch .ivu-icon {
  padding: 1px;
  border-radius: 5px;
  margin-right: 5px;
}
.version-gitInfo-branch {
  text-align: left;
  margin-bottom: 5px;
}
.version-gitInfo-hash {
  text-align: left;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.version-upload {
  margin: 0.1rem 0;
}
.version-upload .ivu-upload {
  background: #fefefe;
  /* border-color: #515a6e; */
}
.ivu-upload.uploading {
  cursor: progress;
}
.ivu-upload.uploading > *:not(.ivu-upload-list) {
  pointer-events: none;
  filter: saturate(0);
}
.version-lock-table {
  margin-bottom: 0.1rem;
}
.version-lock-table thead {
  display: none;
}
.version-lock-table .ivu-table-border td {
  color: #fff;
  background: #515a6e;
  border-color: #777;
}
</style>
