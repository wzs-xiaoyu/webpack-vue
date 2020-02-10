<!--单位管理-->
<template>
  <div class="unit-manage">
    <div class="unitquery">
      <div class="unitquery-item">
        <span class="unitquery-label">单位名称：</span>
        <Input type="text" v-model="unitName" placeholder="请输入单位名称" clearable />
        <Button @click="selectUnitByName" type="primary" class="unitquery-item-btn">查询</Button>
      </div>
    </div>
    <div class="unit-table-header">
      <Button type="primary" v-if="userInfo.admin" class="btn-margin" @click="unitAddForm"><Icon type="ios-add" size="2px" />新增</Button>
      <Button type="primary" v-else class="btn-margin" @click="unitAddForm"><Icon type="ios-add" size="2px" />新增</Button>
      <Button type="primary" v-if="parentId == '-1'" class="btn-margin" disabled @click="deleteUnitInfo"><Icon type="ios-trash" size="2px" />删除</Button>
      <Button type="primary" v-else class="btn-margin" @click="deleteUnitInfo"><Icon type="ios-trash" size="2px" />删除</Button>
    </div>
    <div class="unit-content">
      <div class="unit-content-tree">
        <Tree ref="tree" :data="treeData" @on-select-change="getNodes"></Tree>
      </div>
      <div class="unit-content-treenode">
        <Form ref="formValidate" :model="updateUnitFormData" :label-width="90" label-position="left" :rules="ruleValidate">
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="单位名称" prop="unitName">
                <Input type="text" clearable v-model="updateUnitFormData.unitName" placeholder="请以输入单位名称" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="单位简称" prop="abbrName">
                <Input type="text" clearable v-model="updateUnitFormData.abbrName" placeholder="请以输入单位简称" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="单位地址" prop="address">
                <Input type="text" clearable v-model="updateUnitFormData.address" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="单位代码" prop="unitCode">
                <Input type="text" clearable v-model="updateUnitFormData.unitCode" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="12">
              <FormItem label="负责人" prop="relaPerson">
                <Input type="text" clearable v-model="updateUnitFormData.relaPerson" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem label="负责人电话" prop="relaTel">
                <Input type="text" clearable v-model="updateUnitFormData.relaTel" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24">
            <i-col span="24">
              <FormItem label="描述" prop="remarks">
                <Input type="textarea" clearable v-model="updateUnitFormData.remarks" :autosize="{ minRows: 4, maxRows: 8 }" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="24" type="flex" justify="end" class="treenode-btnitem">
            <i-col span="12">
              <FormItem>
                <Button v-if="JSON.stringify(updateUnitFormData) == '{}'" disabled type="primary" @click="updateUnitInfo">修改</Button>
                <Button v-else type="primary" @click="updateUnitInfo">修改</Button>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
    </div>
    <Modal class-name="addunit-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
      <p>{{ modalError.content }}</p>
    </Modal>
    <add-unit v-bind:modalAddUnitForm="modalAddUnitForm" v-bind:parentId="parentId" v-bind:isLeaf="isLeaf"></add-unit>
  </div>
</template>
<script>
import AddUnit from "./AddUnit.vue";
const validatePhone = (rule, value, callback) => {
  if (typeof value == "undefined" || value == null || value == "") {
    callback();
  } else if (!/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value)) {
    callback("手机号格式不正确");
  } else {
    callback();
  }
};
export default {
  name: "UnitManage",
  components: {
    AddUnit: AddUnit
  },
  data() {
    return {
      unitName: "",
      userInfo: {},
      unitList: [],
      conditionList: [],
      parentId: "-1",
      isLeaf: false,
      modalAddUnitForm: {
        show: false,
        title: ""
      },
      modalError: {
        show: false,
        title: "",
        content: ""
      },
      updateUnitFormData: {},
      ruleValidate: {
        unitName: [{ required: true, message: "单位名称必填" }],
        abbrName: [{ required: true, message: "单位简称必填" }],
        relaTel: [{ required: false, validator: validatePhone }]
      }
    };
  },
  computed: {
    treeData() {
      let renderData = [];
      let data = [];
      if (this.conditionList.length != 0) {
        data = this.unitList;
      }
      let updateData = [];
      if (JSON.stringify(this.updateUnitFormData) != "{}") {
        updateData = this.unitList;
        updateData.map(item => {
          if (item.unitName == this.updateUnitFormData.unitName) {
            item.isSelected = true;
          }
        });
      }
      renderData = JSON.stringify(this.updateUnitFormData) == "{}" ? this.getTreeDataFormat(this.unitList) : this.conditionList.length == 0 ? this.getTreeDataFormat(updateData) : this.getTreeDataFormat(data);
      return renderData;
    }
  },
  watch: {
    parentId(val) {
      if (val == "-1") {
        this.isLeaf = false;
      } else {
        this.isLeaf = true;
      }
    },
    conditionList(val, val1) {
      if (JSON.stringify(this.updateUnitFormData) != "{}") {
        this.updateUnitFormData = {};
        this.$refs.formValidate.resetFields();
        this.unitList.map(item => {
          item.isSelected = false;
        });
      }
      if (!val.length) {
        return;
      }
      this.unitList.map(item => {
        val.map(valItem => {
          if (item.unitName == valItem.unitName) {
            item.isSelected = true;
          }
        });
      });
      if (!val1.length) {
        return;
      }
      this.unitList.map(item => {
        val1.map(valItem => {
          if (item.unitName == valItem.unitName) {
            item.isSelected = false;
          }
        });
      });
    },
    updateUnitFormData(val, val1) {
      if (this.conditionList.length != 0) {
        this.conditionList = [];
        this.unitList.map(item => {
          item.isSelected = false;
        });
      }
      if (JSON.stringify(val) == "{}") {
        return;
      }
      this.unitList.map(item => {
        if (item.unitName == this.updateUnitFormData.unitName) {
          item.isSelected = true;
        }
      });
      if (JSON.stringify(val1) == "{}") {
        return;
      }
      this.unitList.map(item => {
        if (item.unitName == val1.unitName) {
          item.isSelected = false;
        }
      });
    }
  },
  methods: {
    unitAddForm() {
      this.modalAddUnitForm = {
        show: true,
        title: "新增单位",
        content: `<input v-model="aaaa" />`
      };
    },
    selectUnitByName() {
      let params = {
        unitName: this.unitName
      };
      this.$http
        .get("/api/users/unit", { params: params })
        .then(suc => {
          if (suc.data.success) {
            this.conditionList = suc.data.data;
          } else {
            this.$Message.error(suc.data.message);
            throw new Error(suc.data.message);
          }
        })
        .catch(err => {
          console.error("条件请求单位信息列表", err);
        });
    },
    deleteUnitInfo() {
      this.$Modal.confirm({
        title: "删除确认",
        content: "<p>将删除该单位所包含的所有子单位及用户！</p>",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          let params = {
            _id: this.parentId
          };
          this.$http
            .delete("/api/users/unit", { params: params })
            .then(suc => {
              if (suc.data.success && suc.data.message == "删除成功！") {
                this.$Message.info("单位删除成功！");
                this.updateUnitFormData = {};
                this.$refs.formValidate.resetFields();
                this.parentId = "-1";
                this.getUnitInfoList();
                return;
              }
              throw new Error(suc.data.message);
            })
            .catch(err => {
              this.modalError = {
                show: true,
                title: "单位删除失败！",
                content: `${err}`
              };
            });
        }
      });
    },
    isEmpty(obj) {
      if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
      } else {
        return false;
      }
    },
    updateUnitInfo() {
      if (this.isEmpty(this.updateUnitFormData.unitName) && this.isEmpty(this.updateUnitFormData.abbrName)) {
        this.$Message.info("单位名称和单位简称必填且不能为空！");
      } else {
        this.$http
          .put("/api/users/unit", this.updateUnitFormData)
          .then(suc => {
            if (suc.data.success) {
              this.getUnitInfoList();
              this.$Message.info("修改单位信息成功！");
              return;
            }
            throw new Error(suc.data.message);
          })
          .catch(err => {
            console.log(err);
            this.modalError = {
              show: true,
              title: "单位信息修改失败！",
              content: `${err}`
            };
          });
      }
    },
    getNodes(e) {
      if (!e.length) {
        return;
      }
      this.parentId = e[0].id;
      this.getUnitByID(e[0].id);
    },
    getUnitByID(id) {
      this.$http
        .get("/api/users/unit/item", { params: { _id: id } })
        .then(suc => {
          if (suc.data.success) {
            this.updateUnitFormData = suc.data.data;
          } else {
            this.$Message.error(suc.data.message);
            throw new Error(suc.data.message);
          }
        })
        .catch(err => {
          console.error("查询单位信息", err);
        });
    },
    getUnitInfoList() {
      this.$http
        .get("/api/users/unit")
        .then(suc => {
          if (suc.data.success) {
            this.unitList = suc.data.data;
          } else {
            this.$Message.error(suc.data.message);
            throw new Error(suc.data.message);
          }
        })
        .catch(err => {
          console.error("请求单位信息列表", err);
        });
    },
    getTreeDataFormat(data) {
      return this.recursiveSpanningTree(this.getTreeDataStructure(data), "-1");
    },
    //获取树的数据结构
    getTreeDataStructure(arr) {
      let data = [];
      if (arr.length == 0) {
        return;
      } else {
        arr.map(item => {
          data.push({
            title: item.unitName,
            expand: true,
            selected: item.isSelected,
            id: item._id,
            parentId: item.parentId
          });
        });
      }
      return data;
    },
    //递归生成树
    recursiveSpanningTree(data, pid) {
      var result = [],
        temp;
      for (var i in data) {
        if (data[i].parentId == pid) {
          result.push(data[i]);
          temp = this.recursiveSpanningTree(data, data[i].id);
          if (temp.length > 0) {
            data[i].children = temp;
          }
        }
      }
      return result;
    }
  },
  mounted() {
    this.userInfo = window.$AGCP.store.userInfo;
  },
  beforeRouteEnter(to, from, next) {
    if (!window.$AGCP.store.userInfo.name) {
      setTimeout(() => {
        window.$AGCP.bus.emit(window.$AGCP.events.sign, true, { noClose: true });
        window.$AGCP.bus.once(window.$AGCP.events.logined, (userInfo, status) => {
          status && location.reload();
        });
      }, 0);
      return;
    }
    next();
  },
  activated() {
    this.getUnitInfoList();
  },
  deactivated() {
    // 清除查询条件
    this.unitName = "";
    this.parentId = "-1";
    this.updateUnitFormData = {};
    this.$refs.formValidate.resetFields();
  }
};
</script>
<style>
.unit-manage {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
  background: #f8f8f8;
  padding: 0.2rem;
  border: 1px solid #eee;
}

.unitquery {
  display: flex;
  justify-content: flex-end;
  text-align: center;
  width: 100%;
  margin: 0rem 0rem 0.1rem 0rem;
}
.unitquery-item {
  display: flex;
  width: 30%;
  align-items: center;
}
.unitquery-item-btn {
  margin-left: 0.1rem;
}
.unitquery-label {
  width: 40%;
  display: flex;
  align-items: center;
}
.unit-table-header {
  margin: 0.1rem 0rem;
  width: 100%;
  height: 1rem;
}
.unit-content {
  margin-bottom: 14px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.unit-content-tree {
  width: 24%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  justify-content: flex-start;
}
.unit-content-treenode {
  width: 74%;
}
.unit-content-treenode .treenode-btnitem .ivu-col-span-12 {
  justify-content: flex-end;
  display: flex;
}
.addunit-modal-err .ivu-modal-header,
.addunit-modal-err .ivu-modal-footer {
  border: none;
}
.btn-margin {
  margin-right: 6px;
}
</style>
