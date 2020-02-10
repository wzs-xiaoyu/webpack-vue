<!--静态资源管理内容-->
<template>
  <div class="static-resource-manage">
    <div>
      <div class="static-resource-filelevel">
        <ul>
          <li @click="returnPrevious">
            <Icon type="md-arrow-round-up" size="14px" />
          </li>
        </ul>
        <span> {{ staticResource.name }}</span>
        <span v-for="(item, index) in filelEvel" :key="'lable' + index">
          <Icon type="ios-arrow-forward" />
          {{ item }}
        </span>
      </div>
      <Upload
        ref="upload"
        v-if="!staticResourceList.length && !filelEvel.length"
        class="static-resource-upload"
        :class="{ uploading: uploading }"
        type="drag"
        accept="application/zip"
        action="/api/resource/upload"
        :max-size="30000"
        :headers="uploadHttpHeader"
        :paste="true"
        :data="uploadParam"
        :on-success="uploadEnd"
        :on-error="uploadError"
        :before-upload="uploadParamCreate"
        :show-upload-list="true"
        :multiple="false"
        :on-exceeded-size="exceededSize"
        :on-format-error="formatError"
      >
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>上传</p>
        </div>
      </Upload>
      <Upload
        ref="upload"
        v-else
        class="static-resource-upload"
        :class="{ uploading: uploading }"
        type="drag"
        action="/api/resource/uploadFile"
        :max-size="30000"
        :headers="uploadHttpHeader"
        :paste="true"
        :data="uploadFileParam"
        :on-success="uploadEnd"
        :on-error="uploadError"
        :before-upload="uploadParamCreate"
        :show-upload-list="true"
        :multiple="false"
        :on-exceeded-size="exceededSize"
      >
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>上传</p>
        </div>
      </Upload>
      <Table border :columns="staticResourceTable" :data="staticResourceListRender" @on-row-click="selectRowResource"></Table>
      <Modal class-name="staticresourcelist-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
        <p>{{ modalError.content }}</p>
      </Modal>
      <Modal class-name="staticresource-modal-upload" v-model="modalUpload.show" :title="modalUpload.title" width="416px">
        <Form :model="uploadParam" :label-width="80">
          <FormItem prop="remarks" label="上传描述" :rules="{ required: true }">
            <Input clearable type="text" v-model="uploadParam.remarks" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" size="large" @click="modalUploadOk">确认</Button>
          <Button type="error" size="large" @click="modalUploadCancel">取消</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "./storeStaticResource.js";
export default {
  name: "StaticResourceManage",
  data() {
    return {
      staticResourceTable: [
        {
          title: "文件名称",
          key: "name",
          align: "center"
        },
        {
          title: "类型",
          key: "type",
          align: "center"
        },
        {
          title: "大小",
          key: "size",
          align: "center",
          render: (h, params) => {
            return h("div", [params.row.size + " byte"]);
          }
        },
        {
          title: "文件路径",
          key: "filePath",
          render: (h, params) => {
            return (
              "div",
              [
                h(
                  "Tooltip",
                  {
                    attrs: {
                      content: "点击复制",
                      placement: "bottom"
                    }
                  },
                  [
                    h(
                      "span",
                      {
                        style: {
                          display: "inline-block",
                          width: "100%"
                        },
                        on: {
                          click: e => {
                            e.stopPropagation();
                            this.copyFilePath(params.row.filePath);
                          }
                        }
                      },
                      params.row.filePath
                    )
                  ]
                )
              ]
            );
          }
        },
        {
          title: "修改日期",
          key: "editTime",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: e => {
                      e.stopPropagation();
                      this.deleteStaticResource(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      staticResourceList: [],
      modalError: {
        show: false,
        title: "",
        content: ""
      },
      uploadHttpHeader: { Authorization: "" },
      filelEvel: [],
      modalUpload: {
        show: false,
        title: ""
      },
      uploadParam: {
        _id: "",
        remarks: ""
      },
      uploading: false
    };
  },
  computed: {
    ...mapState({ staticResource: "staticResource" }),
    staticResourceName() {
      return this.staticResource.name;
    },
    staticResourceUrl() {
      return this.staticResource.url;
    },
    uploadFileParam() {
      return {
        url: this.filelEvel.length == 0 ? "/" + this.staticResource.name + "/" : "/" + this.staticResource.name + "/" + this.filelEvel.join("/") + "/"
      };
    },
    staticResourceListRender() {
      let data = this.staticResourceList;
      for (var i in data) {
        if (!this.filelEvel.length) {
          data[i].filePath = this.staticResource.url + "/" + data[i].name;
        } else {
          data[i].filePath = this.staticResource.url + "/" + this.filelEvel.join("/") + "/" + data[i].name;
        }
      }
      return data;
    }
  },
  watch: {
    staticResourceName() {
      this.filelEvel = [];
      this.getStaticResourceList();
    }
  },
  methods: {
    ...mapMutations({
      staticResourceChange: "staticResourceChange"
    }),
    copyFilePath(filePath) {
      this.$copyText(filePath)
        .then(e => {
          this.$Message.success(e.text + "已copy到粘贴板!");
        })
        .catch(e => {
          this.$Message.error(e.text + "复制失败!");
        });
    },
    deleteStaticResource(staticResource) {
      this.$Modal.confirm({
        title: "删除确认",
        content: staticResource.type === "文件夹" ? "<p>是否删除选中的文件夹【" + staticResource.name + "】</p>" : "<p>是否删除选中的文件【" + staticResource.name + "】</p>",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          let params = {
            url: ""
          };
          if (this.filelEvel.length == 0) {
            params.url = staticResource.url + "/" + staticResource.name;
          } else {
            params.url = staticResource.url + "/" + staticResource.name;
          }
          this.$http
            .delete("/api/resource/file", { params: params })
            .then(suc => {
              if (suc.data.success) {
                this.$Message.info("删除静态资源成功！");
                this.getStaticResourceList();
                return;
              }
              throw new Error(suc.data.message);
            })
            .catch(err => {
              this.modalError = {
                show: true,
                title: "删除静态资源失败！",
                content: `${err}`
              };
            });
        }
      });
    },
    //获取静态资源文件列表
    getStaticResourceList() {
      let params = {
        name: ""
      };
      if (!(typeof this.staticResourceName == "undefined")) {
        if (this.filelEvel.length == 0) {
          params.name = "/" + this.staticResourceName;
        } else {
          params.name = "/" + this.staticResourceName + "/" + this.filelEvel.join("/");
        }
        this.$http
          .get("/api/resource/fileList", { params: params })
          .then(suc => {
            if (!suc.data.success) {
              throw new Error(suc.data.message);
            }
            this.staticResourceList = suc.data.data.reverse();
          })
          .catch(err => {
            console.error(err);
          });
      }
    },
    selectRowResource(currentRow) {
      if (currentRow.type === "文件夹") {
        this.filelEvel.push(currentRow.name);
        this.getStaticResourceList();
      }
    },
    returnPrevious() {
      if (this.filelEvel.length != 0) {
        this.filelEvel.pop();
        this.getStaticResourceList();
      } else {
        this.$Message.info("已经是顶层文件夹！");
      }
    },
    // 获取某个文件夹下的文件列表
    getStaticResourceByFolder(folder) {
      this.$http
        .get("/api/resource/fileList", { params: { name: folder } })
        .then(suc => {
          if (!suc.data.success) {
            throw new Error(suc.data.message);
          }
          this.staticResourceList = suc.data.data.reverse();
        })
        .catch(err => {
          console.error("请求静态资源文件列表" + err);
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
        onOk: () => {
          this.getStaticResourceList();
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
    uploadFileForm() {
      return new Promise((rs, rj) => {
        this.$nextTick(function() {
          rs(true);
        });
        this.$nextTick(function() {
          rj(true);
        });
      });
    },
    // 确认上传
    modalUploadOk() {
      this.$emit("modalUploadOk");
    },
    // 取消上传
    modalUploadCancel() {
      this.$emit("modalUploadCancel");
    },
    // 构造上传接口参数
    uploadParamCreate(file) {
      if (!this.staticResourceList.length && !this.filelEvel.length) {
        this.uploadFile(file);
      } else {
        this.uploadFile1(file);
      }
      return false;
    },
    uploadFile1(file) {
      this.uploadHttpHeader.Authorization = this.$http.defaults.headers.common.Authorization;
      this.uploadFileForm()
        .then(() => {
          return file;
        })
        .then(suc => {
          console.log(suc);
          this.$refs.upload.post(file);
          this.uploading = true;
        })
        .catch(err => {
          console.error(err);
        });
    },
    uploadFile(file) {
      this.uploadParam._id = this.staticResource._id;
      this.uploadHttpHeader.Authorization = this.$http.defaults.headers.common.Authorization;
      this.uploadForm()
        .then(() => {
          return file;
        })
        .then(suc => {
          console.log(suc);
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
    }
  },
  mounted() {
    this.getStaticResourceList();
  }
};
</script>
<style>
.static-resource-filelevel {
  margin: 0.2rem 0;
  font-size: 0.2rem;
  font-weight: 500;
}
.static-resource-manage .static-resource-filelevel .ivu-icon {
  font-weight: 500;
  font-size: 0.32rem;
}
.static-resource-filelevel ul,
.static-resource-filelevel span {
  display: inline-block;
}
.static-resource-upload {
  margin: 0.1rem 0;
}
.static-resource-upload .ivu-upload {
  background: #fefefe;
}
.ivu-upload.uploading {
  cursor: progress;
}
.ivu-upload.uploading > *:not(.ivu-upload-list) {
  pointer-events: none;
  filter: saturate(0);
}
.staticresourcelist-modal-err .ivu-modal-header,
.staticresourcelist-modal-err .ivu-modal-footer,
.staticresource-modal-upload .ivu-modal-header,
.staticresource-modal-upload .ivu-modal-footer {
  border: none;
}
</style>
