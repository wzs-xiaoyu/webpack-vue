<!--单位管理-->
<template>
  <div class="unit-manage">
    <div class="unitquery">
      <div class="unitquery-item">
        <span class="unitquery-label">单位名称：</span>
        <Input type="text" v-model="unitName" placeholder="请输入单位名称" @on-change="selectUnitByName" clearable />
      </div>
    </div>
    <div class="unit-table-header">
      <Button type="primary" v-if="userInfo.admin" class="btn-margin" @click="unitAddForm"><Icon type="ios-add" size="2px" />新增</Button>
      <Button type="primary" v-else class="btn-margin" @click="unitAddForm"><Icon type="ios-add" size="2px" />新增</Button>
    </div>
    <div class="unit-table">
      <Table border :columns="unitColumns" :data="unitList"> </Table>
    </div>
    <Modal class-name="addunit-modal-err" v-model="modalError.show" :title="modalError.title" width="416px">
      <p>{{ modalError.content }}</p>
    </Modal>
    <add-unit v-bind:modalAddUnitForm="modalAddUnitForm"></add-unit>
    <update-unit v-bind:modalUpdateUnitForm="modalUpdateUnitForm" v-bind:updateUnitFormData="unitInfo"></update-unit>
  </div>
</template>
<script>
import AddUnit from "./AddUnit.vue";
import UpdateUnit from "./UpdateUnit.vue";
export default {
  name: "UnitManage",
  components: {
    AddUnit: AddUnit,
    UpdateUnit: UpdateUnit
  },
  data() {
    return {
      unitName: "",
      userInfo: {},
      unitList: [],
      unitColumns: [
        {
          title: "单位名称",
          key: "unitName",
          align: "center"
        },
        {
          title: "简称",
          key: "abbrName",
          align: "center"
        },
        {
          title: "单位地址",
          key: "address",
          align: "center"
        },
        {
          title: "联系人",
          key: "relaPerson",
          align: "center"
        },
        {
          title: "联系人电话",
          key: "relaTel",
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
                    click: () => {
                      this.updateUnitInfo(params.row);
                    }
                  }
                },
                "编辑"
              ),
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
                    click: () => {
                      this.deleteUnitInfo(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      modalAddUnitForm: {
        show: false,
        title: ""
      },
      modalUpdateUnitForm: {
        show: false,
        title: ""
      },
      modalError: {
        show: false,
        title: "",
        content: ""
      },
      unitInfo: {}
    };
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
            this.unitList = suc.data.data.reverse();
          } else {
            this.$Message.error(suc.data.message);
            throw new Error(suc.data.message);
          }
        })
        .catch(err => {
          console.error("条件请求单位信息列表", err);
        });
    },
    updateUnitInfo(unit) {
      this.unitInfo = unit;
      this.modalUpdateUnitForm = {
        show: true,
        title: "修改单位信息",
        content: `<input v-modal="aaaa"/>`
      };
    },
    deleteUnitInfo(unit) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "<p>是否删除选中的单位【" + unit.unitName + "】</p>",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          let params = {
            _id: unit._id
          };
          this.$http
            .delete("/api/users/unit", { params: params })
            .then(suc => {
              if (suc.data.success && suc.data.message == "删除成功！") {
                this.$Message.info("单位删除成功！");
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
    getUnitInfoList() {
      this.$http
        .get("/api/users/unit")
        .then(suc => {
          if (suc.data.success) {
            this.unitList = suc.data.data.reverse();
          } else {
            this.$Message.error(suc.data.message);
            throw new Error(suc.data.message);
          }
        })
        .catch(err => {
          console.error("请求单位信息列表", err);
        });
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
  }
};
</script>
<style>
.unit-manage {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  overflow: auto;
  background: #f8f8f8;
  padding: 0.2rem;
  border: 1px solid #eee;
}

.unitquery {
  display: flex;
  justify-content: flex-end;
  text-align: center;
  width: 100%;
  height: 44px;
}
.unitquery-item {
  display: flex;
  width: 24%;
  align-items: center;
  height: 100%;
}
.unitquery-label {
  width: 40%;
  display: flex;
  align-items: center;
}
.unit-table-header {
  margin: 0.2rem 0rem;
}
.unit-table {
  margin-bottom: 14px;
}
.addunit-modal-err .ivu-modal-header,
.addunit-modal-err .ivu-modal-footer {
  border: none;
}
.btn-margin {
  margin-right: 6px;
}
</style>
